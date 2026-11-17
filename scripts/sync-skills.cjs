const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const source = path.join(root, '.claude', 'skills');
const mirror = path.join(root, '.agents', 'skills');

// Use slash-separated relative names for diagnostics and comparisons on every OS.
function collectFiles(directory, prefix = '', files = new Set()) {
  if (!fs.lstatSync(directory).isDirectory()) throw new Error(`Expected directory: ${directory}`);
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const relative = prefix + entry.name;
    if (entry.isDirectory()) {
      collectFiles(path.join(directory, entry.name), relative + '/', files);
    } else if (entry.isFile()) {
      files.add(relative);
    } else {
      throw new Error(`Expected a regular file or directory: ${path.join(directory, entry.name)}`);
    }
  }
  return files;
}

function markdown(bytes) {
  return bytes.toString('utf8').replaceAll('\r\n', '\n');
}

function portableContent(relative, bytes, skillNames) {
  if (!relative.endsWith('.md')) return bytes;
  let content = markdown(bytes);
  if (relative.endsWith('/SKILL.md')) {
    content = content.replace(/^---\n[\s\S]*?\n---(?=\n|$)/, frontmatter =>
      frontmatter.replace(/^allowed-tools:.*\n/m, ''));
  }
  content = content
    .replaceAll('CLAUDE.md', 'AGENTS.md')
    .replaceAll('.claude/skills/', '.agents/skills/')
    .replaceAll('allowed tools', 'available and permitted tools')
    .replace(/(?<![\w./])\/([a-z0-9-]+)\b/g, (match, name) => skillNames.has(name) ? name : match);
  return Buffer.from(content);
}

function sync(check) {
  const canonical = collectFiles(source);
  const existing = collectFiles(mirror);
  const expected = new Set(canonical);
  const names = new Set(fs.readdirSync(source));
  const problems = [];

  if (!names.size) problems.push('No canonical skills found.');
  for (const name of names) {
    if (!canonical.has(`${name}/SKILL.md`)) problems.push(`Missing canonical ${name}/SKILL.md`);
    const metadata = `${name}/agents/openai.yaml`;
    expected.add(metadata);
    if (canonical.has(metadata)) problems.push(`Keep ${metadata} in the Codex mirror only.`);
    if (!existing.has(metadata)) problems.push(`Missing Codex metadata: ${metadata}`);
    else if (!fs.readFileSync(path.join(mirror, metadata), 'utf8').trim()) {
      problems.push(`Empty Codex metadata: ${metadata}`);
    }
  }
  for (const relative of existing) {
    if (!expected.has(relative)) problems.push(`Unexpected mirror file (review and remove or move): ${relative}`);
  }

  // Resolve ownership errors before writing anything. Never delete files or generate UI metadata.
  if (problems.length) throw new Error(problems.join('\n'));
  const changed = [];
  for (const relative of canonical) {
    const wanted = portableContent(relative, fs.readFileSync(path.join(source, relative)), names);
    const destination = path.join(mirror, relative);
    if (existing.has(relative)) {
      let current = fs.readFileSync(destination);
      if (relative.endsWith('.md')) current = Buffer.from(markdown(current));
      if (current.equals(wanted)) continue;
    }
    if (check) {
      changed.push(relative);
    } else {
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, wanted);
    }
  }
  if (changed.length) throw new Error(`Mirror drift (run node scripts/sync-skills.cjs):\n${changed.join('\n')}`);
  console.log(`Skill mirrors ${check ? 'match' : 'synchronized'} (${names.size} skills).`);
}

try {
  const args = process.argv.slice(2);
  if (args.length && !(args.length === 1 && args[0] === '--check')) {
    throw new Error('Usage: node scripts/sync-skills.cjs [--check]');
  }
  sync(args[0] === '--check');
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
