// Requires Node 18+, Git, and a Codex CLI with "plugin add" and app-server "skills/list".
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const readline = require('node:readline');
const { execFileSync, spawn } = require('node:child_process');

const root = path.resolve(__dirname, '..');
const codex = process.env.NORTHSTAR_CODEX_BIN || (process.platform === 'win32' ? 'codex.exe' : 'codex');
const pluginId = 'northstar@northstar-workflows';
const timeout = 30000;

// Wait for each protocol response before sending the next message. Closing stdin
// after skills/list lets the server release its profile before we delete it.
function listSkills(cwds, options) {
  return new Promise((resolve, reject) => {
    const child = spawn(codex, ['app-server', '--stdio'], options);
    const lines = readline.createInterface({ input: child.stdout });
    let result, failure, stderr = '';
    const stop = error => { failure = error; child.kill(); };
    const timer = setTimeout(() => stop(new Error('Timed out waiting for Codex skills/list')), timeout);
    const send = message => child.stdin.write(JSON.stringify(message) + '\n');
    child.stderr.on('data', chunk => { stderr = (stderr + chunk).slice(-2000); });
    child.on('error', error => { failure = error; });
    child.stdin.on('error', stop);
    child.on('close', code => {
      clearTimeout(timer);
      if (failure || code !== 0 || !result) {
        reject(failure || new Error(`Codex exited (${code}) before completing skills/list. ${stderr}`));
      } else {
        resolve(result);
      }
    });
    lines.on('line', line => {
      try {
        const response = JSON.parse(line);
        if (response.error) throw new Error(JSON.stringify(response.error));
        if (response.id === 1) {
          send({ method: 'initialized' });
          send({ id: 2, method: 'skills/list', params: { cwds, forceReload: true } });
        } else if (response.id === 2) {
          result = response.result.data;
          child.stdin.end();
        }
      } catch (error) { stop(error); }
    });
    send({ id: 1, method: 'initialize', params: { clientInfo: { name: 'northstar_check', version: '1' }, capabilities: {} } });
  });
}

function verify(rows, expected, prefix, directory) {
  assert.deepEqual(rows.map(s => s.name).sort(), expected.map(name => prefix + name), 'Unexpected skills');
  for (const skill of rows) {
    const name = skill.name.slice(prefix.length);
    assert.equal(skill.enabled, true, `${skill.name} disabled`);
    assert.ok(skill.interface?.displayName?.trim(), `${skill.name} missing display name`);
    assert.ok(skill.interface?.shortDescription?.trim(), `${skill.name} missing UI description`);
    assert.equal(fs.realpathSync(skill.path), fs.realpathSync(path.join(directory, name, 'SKILL.md')));
  }
}

async function check(temp) {
  const repo = path.join(temp, 'with-skills');
  const unrelated = path.join(temp, 'unrelated');
  const profile = path.join(temp, 'profile');
  const state = path.join(profile, '.codex');
  fs.mkdirSync(state, { recursive: true });
  // Keep all Codex configuration, trust decisions, and installed plugins temporary.
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (/^(CODEX_|OPENAI_|CHATGPT_)/i.test(key)) delete env[key];
  }
  Object.assign(env, { CODEX_HOME: state, HOME: profile, USERPROFILE: profile, XDG_CONFIG_HOME: profile,
    HTTP_PROXY: 'http://127.0.0.1:9', HTTPS_PROXY: 'http://127.0.0.1:9', ALL_PROXY: 'http://127.0.0.1:9', NO_PROXY: '' });
  const options = { cwd: temp, env, windowsHide: true, stdio: ['pipe', 'pipe', 'pipe'] };
  const run = (bin, args) => execFileSync(bin, args, { ...options, encoding: 'utf8', timeout }).trim();
  console.log(run(codex, ['--version']));
  for (const project of [repo, unrelated]) {
    fs.mkdirSync(project);
    run('git', ['-C', project, 'init', '-q']);
  }
  fs.writeFileSync(path.join(state, 'config.toml'), [repo, unrelated].map(project =>
    `[projects.${JSON.stringify(project)}]\ntrust_level = "trusted"\n`).join('\n'));
  const localSkills = path.join(repo, '.agents', 'skills');
  fs.cpSync(path.join(root, '.agents', 'skills'), localSkills, { recursive: true });
  const expected = fs.readdirSync(path.join(root, '.claude', 'skills'), { withFileTypes: true })
    .filter(entry => entry.isDirectory()).map(entry => entry.name).sort();
  assert.ok(expected.length > 0, 'No canonical skills found');

  run(codex, ['plugin', 'marketplace', 'add', root, '--json']);
  const installed = JSON.parse(run(codex, ['plugin', 'add', pluginId, '--json']));
  assert.equal(installed.pluginId, pluginId);
  const relative = path.relative(fs.realpathSync(state), fs.realpathSync(installed.installedPath));
  assert.ok(relative && !relative.startsWith('..') && !path.isAbsolute(relative), 'Install outside disposable profile');

  const data = await listSkills([repo, unrelated], options);
  assert.equal(data.length, 2, 'Expected both project responses');
  const forProject = project => {
    const entry = data.find(entry => path.relative(project, entry.cwd) === '');
    assert.ok(entry, `Missing Codex response for ${project}`);
    assert.deepEqual(entry.errors, [], 'Codex reported skill loading errors');
    return entry.skills;
  };
  verify(forProject(repo).filter(s => s.scope === 'repo'), expected, '', localSkills);
  console.log(`PASS: ${expected.length} enabled repository skills with UI metadata.`);
  const otherSkills = forProject(unrelated);
  assert.equal(otherSkills.filter(s => s.scope === 'repo').length, 0);
  verify(otherSkills.filter(s => s.pluginId === pluginId), expected, 'northstar:', path.join(installed.installedPath, 'skills'));
  console.log(`PASS: ${expected.length} enabled plugin skills from ${pluginId} in an unrelated project.`);
}

async function main() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'northstar-codex-'));
  try { await check(temp); }
  finally { fs.rmSync(temp, { recursive: true, force: true, maxRetries: 5, retryDelay: 150 }); }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
