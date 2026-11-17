const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const source = '.claude/skills/demo';
const mirror = '.agents/skills/demo';
const metadata = `${mirror}/agents/openai.yaml`;
const ui = 'interface:\n  display_name: "My display name"\n';
const body = '---\nname: demo\nallowed-tools: Read\n---\nSee CLAUDE.md and /demo.\n';
const portable = '---\nname: demo\n---\nSee AGENTS.md and demo.\n';

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'northstar-sync-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  function write(relative, data) {
    const target = path.join(root, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, data);
  }
  write('scripts/sync-skills.cjs', fs.readFileSync(path.join(__dirname, 'sync-skills.cjs')));
  write(`${source}/SKILL.md`, body);
  write(`${mirror}/SKILL.md`, portable);
  write(metadata, ui);
  return {
    write,
    read: relative => fs.readFileSync(path.join(root, relative)),
    remove: relative => fs.unlinkSync(path.join(root, relative)),
    run: (...args) => spawnSync(process.execPath, ['scripts/sync-skills.cjs', ...args], { cwd: root, encoding: 'utf8' })
  };
}

test('check only reports drift; sync translates Markdown and preserves UI metadata and binary assets', t => {
  const repo = fixture(t);
  const asset = Buffer.from([0, 255, 13, 10]);
  repo.write(`${source}/assets/sample.bin`, asset);
  repo.write(`${source}/references/example.md`, 'allowed-tools: example in the reference\n');
  repo.write(`${mirror}/SKILL.md`, 'old');
  const check = repo.run('--check');
  assert.equal(check.status, 1);
  assert.match(check.stderr, /demo\/SKILL.md/);
  assert.match(check.stderr, /demo\/assets\/sample.bin/);
  assert.equal(repo.read(`${mirror}/SKILL.md`).toString(), 'old');

  const sync = repo.run();
  assert.equal(sync.status, 0, sync.stderr);
  assert.equal(repo.read(`${mirror}/SKILL.md`).toString(), portable);
  assert.deepEqual(repo.read(`${mirror}/assets/sample.bin`), asset);
  assert.equal(repo.read(`${mirror}/references/example.md`).toString(), 'allowed-tools: example in the reference\n');
  assert.equal(repo.read(metadata).toString(), ui);
  repo.write(`${mirror}/SKILL.md`, portable.replaceAll('\n', '\r\n'));
  assert.equal(repo.run('--check').status, 0);
});

test('missing metadata, a deleted skill and an obsolete reference are reported without deleting or rewriting files', t => {
  const repo = fixture(t);
  repo.remove(metadata);
  repo.write('.agents/skills/retired/SKILL.md', 'old skill');
  repo.write(`${mirror}/references/old.md`, 'old reference');
  repo.write(`${source}/SKILL.md`, body + 'new text\n');
  for (const args of [['--check'], []]) {
    const result = repo.run(...args);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Missing Codex metadata: demo\/agents\/openai.yaml/);
    assert.match(result.stderr, /retired\/SKILL.md/);
    assert.match(result.stderr, /demo\/references\/old.md/);
  }
  assert.equal(repo.read(`${mirror}/SKILL.md`).toString(), portable);
  assert.equal(repo.read(`${mirror}/references/old.md`).toString(), 'old reference');
});

test('canonical UI metadata cannot overwrite the hand-maintained copy', t => {
  const repo = fixture(t);
  repo.write(`${source}/agents/openai.yaml`, 'other metadata');
  const result = repo.run();
  assert.equal(result.status, 1);
  assert.match(result.stderr, /Codex mirror only/);
  assert.equal(repo.read(metadata).toString(), ui);
});
