// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Message Contract Tests                                        ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Prove the shipped templates, the validator and the agent gate   ║
// ║          agree, and that another repository's template replaces them.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝
//
// The shipped templates are tested as they are on disk, not as a copy, so an edit to a template
// that breaks its own rules block or drifts from its prose fails here. Repository behaviour runs
// against real temporary repositories, because resolution reads git config and the working tree.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execFileSync } from 'node:child_process';

import {
  ContractError,
  TEMPLATE_FILES,
  extractContract,
  loadContract,
  templateDriftErrors,
  validateBranch,
  validateCommit,
  validatePrBody,
} from './message-contract.mjs';
import { evaluateCommand } from '../hooks/git-message-gate.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. SETUP
// ─────────────────────────────────────────────────────────────────────────────

const HERE = path.dirname(new URL(import.meta.url).pathname);
const ASSETS = path.resolve(HERE, '../../assets');
const read = (kind) => fs.readFileSync(path.join(ASSETS, TEMPLATE_FILES[kind]), 'utf8');
const COMMIT = extractContract(read('commit'));
const PR = extractContract(read('pr'));
const BRANCH = extractContract(read('branch'));

const ids = (result) => result.errors.map((e) => e.id);

function tempRepo(withContract = true) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'message-contract-'));
  const git = (...args) => execFileSync('git', ['-C', dir, ...args], { stdio: 'ignore' });
  git('init', '-q');
  if (withContract) git('config', 'skgit.contractDir', ASSETS);
  return dir;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3. SHIPPED TEMPLATES
// ─────────────────────────────────────────────────────────────────────────────

test('every shipped template parses, is well formed and matches its prose', () => {
  for (const kind of Object.keys(TEMPLATE_FILES)) {
    assert.deepEqual(templateDriftErrors(read(kind), kind), [], `${kind} template drift`);
  }
});

test('drift is caught in both directions', () => {
  const text = read('commit');
  assert.ok(templateDriftErrors(text.replaceAll('`subject.vague`', 'subject vague'), 'commit').some((p) => p.includes('subject.vague')));
  assert.ok(templateDriftErrors(`${text}\nAlso see \`subject.invented\`.\n`, 'commit').some((p) => p.includes('subject.invented')));
});

// ─────────────────────────────────────────────────────────────────────────────
// 4. COMMIT RULES
// ─────────────────────────────────────────────────────────────────────────────

test('a conforming commit passes and git-generated subjects pass through', () => {
  assert.deepEqual(ids(validateCommit('feat(sk-git): add a thing\n\nExplains why.\n', COMMIT)), []);
  for (const subject of ['Merge branch side', 'Revert "feat(x): y"', 'fixup! feat(x): y']) {
    assert.equal(validateCommit(subject, COMMIT).passthrough, true, subject);
  }
});

test('subject rules each fire on their own case', () => {
  const cases = [
    ['update', 'subject.format'],
    ['feat(028): add a thing', 'subject.scope-numeric'],
    ['feat(sk-git): Add a thing', 'subject.summary-start'],
    ['feat(sk-git): add  a thing', 'subject.repeated-spaces'],
    ['feat(sk-git): add a thing.', 'subject.trailing-punctuation'],
    ['feat(sk-git): update', 'subject.vague'],
    [`feat(sk-git): ${'a'.repeat(100)}`, 'subject.max-length'],
  ];
  for (const [subject, id] of cases) {
    assert.ok(ids(validateCommit(`${subject}\n\nExplains why.`, COMMIT)).includes(id), `${subject} -> ${id}`);
  }
});

test('body, trailer and attribution rules each fire on their own case', () => {
  const v = (msg, ctx) => ids(validateCommit(msg, COMMIT, ctx));
  assert.ok(v('feat(sk-git): add a thing\nWhy.').includes('body.blank-line'));
  assert.ok(v('feat(sk-git): add a thing\n\nCommit-Id: 0001234').includes('body.required'));
  assert.ok(v('feat(sk-git): add a thing\n\nCommit-Id: 0001234\n\nProse below.').includes('trailer.final-paragraph'));
  assert.ok(v('feat(sk-git): add a thing\n\nWhy.\n\nCommit-Id: 12').includes('trailer.commit-id-format'));
  assert.ok(v('feat(sk-git): add a thing\n\nWhy.\n\nCommit-Id: 0001234', { commitIdOwner: () => 'abc1234' }).includes('trailer.commit-id-unique'));
  assert.ok(v('feat(sk-git): add a thing\n\nWhy.\n\nSpec: specs/sk-git/001-x').includes('trailer.spec-prefix'));
  assert.ok(v('feat(sk-git): add a thing\n\nWhy.\n\nSpec: sk-git/001-x', { specExists: () => false }).includes('trailer.spec-exists'));
  assert.deepEqual(v('feat(sk-git): add a thing\n\nWhy.\n\nSpec: sk-git/001-x', { specExists: () => true }), []);
  assert.ok(v('feat(sk-git): add a thing\n\nWhy.\n\nCo-Authored-By: A <a@b.c>').includes('attribution.forbidden'));
  assert.ok(v('feat(sk-git)!: drop a thing\n\nWhy.').includes('breaking.footer'));
  assert.deepEqual(v('feat(sk-git): add a thing\n\nThe Anthropic client moved.'), [], 'prose naming the vendor is not attribution');
});

test('the pre-stamp stage drops attribution the stamper would strip', () => {
  const msg = 'feat(sk-git): add a thing\n\nWhy.\n\nCo-Authored-By: A <a@b.c>\nClaude-Session: x';
  assert.deepEqual(ids(validateCommit(msg, COMMIT, { stage: 'pre-stamp' })), []);
});

test('warnings never block', () => {
  const result = validateCommit('feat(sk-git): finish wave 3 cleanup work\n\nWhy.', COMMIT);
  assert.deepEqual(ids(result), []);
  assert.deepEqual(result.warnings.map((w) => w.id), ['subject.process-language']);
});

// ─────────────────────────────────────────────────────────────────────────────
// 5. PR AND BRANCH RULES
// ─────────────────────────────────────────────────────────────────────────────

test('PR descriptions need filled required sections and no attribution', () => {
  const good = '## Summary\n\n- Adds a thing\n\n## Test Plan\n\n- [x] Ran the suite\n';
  assert.deepEqual(ids(validatePrBody(good, PR)), []);
  assert.ok(ids(validatePrBody('## Summary\n\n- Adds a thing\n', PR)).includes('pr.section-missing'));
  assert.ok(ids(validatePrBody('## Summary\n\n## Test Plan\n\n- [x] Ran it\n', PR)).includes('pr.section-empty'));
  assert.ok(ids(validatePrBody(`${good}\n## Related Issues\n\nCloses #<issue-number>\n`, PR)).includes('pr.placeholder'));
  assert.ok(ids(validatePrBody(`${good}\n🤖 Generated with [Claude Code](https://claude.com/claude-code)\n`, PR)).includes('pr.attribution'));
  assert.deepEqual(ids(validatePrBody(`${good}\n\`\`\`markdown\n## Summary\n<placeholder>\n\`\`\`\n`, PR)), [], 'fenced examples are not checked');
});

test('branch names follow the grammar and worktree directories pair with them', () => {
  for (const name of ['main', 'skilled/v4.0.0.2', 'worktrees/073-message-contract', 'branches/001-x', 'work/codex/a', 'backup/old']) {
    assert.deepEqual(ids(validateBranch(name, BRANCH)), [], name);
  }
  for (const name of ['feature/x', 'worktrees/000-x', 'worktrees/73-x', 'worktrees/073-Bad']) {
    assert.deepEqual(ids(validateBranch(name, BRANCH)), ['branch.name'], name);
  }
  assert.deepEqual(ids(validateBranch('worktrees/073-a', BRANCH, '.worktrees/074-b')), ['branch.worktree-pair']);
});

// ─────────────────────────────────────────────────────────────────────────────
// 6. RESOLUTION
// ─────────────────────────────────────────────────────────────────────────────

test('a repository without templates enforces nothing', () => {
  const dir = tempRepo(false);
  for (const kind of Object.keys(TEMPLATE_FILES)) assert.equal(loadContract(dir, kind), null);
});

test('a .sk-git copy is used, and a broken one throws rather than passing', () => {
  const dir = tempRepo(false);
  fs.mkdirSync(path.join(dir, '.sk-git'));
  const file = path.join(dir, '.sk-git', TEMPLATE_FILES.commit);
  fs.writeFileSync(file, '## Enforced rules\n\n```json\n{ "kind": "commit", "subject": { "types": ["feat"] } }\n```\n');
  assert.equal(loadContract(dir, 'commit').source, '.sk-git/');
  fs.writeFileSync(file, '## Enforced rules\n\n```json\n{ "kind": "commit", "subjet": {} }\n```\n');
  assert.throws(() => loadContract(dir, 'commit'), ContractError);
  fs.writeFileSync(file, '## Enforced rules\n\n```json\n{ not json\n```\n');
  assert.throws(() => loadContract(dir, 'commit'), ContractError);
});

test('skgit.contractDir pointing nowhere is an error, not an opt-out', () => {
  const dir = tempRepo(false);
  execFileSync('git', ['-C', dir, 'config', 'skgit.contractDir', 'nope']);
  assert.throws(() => loadContract(dir, 'commit'), ContractError);
});

// ─────────────────────────────────────────────────────────────────────────────
// 7. AGENT GATE
// ─────────────────────────────────────────────────────────────────────────────

test('the gate refuses a bad inline commit message and allows a good one', () => {
  const dir = tempRepo();
  assert.match(evaluateCommand('git commit -m "update stuff"', dir), /subject\.format/);
  assert.equal(evaluateCommand('git commit -m "feat(sk-git): add a thing" -m "Explains why."', dir), null);
  assert.match(evaluateCommand(`cd ${dir} && git add . && git commit -m "feat(sk-git): add a thing"`, '/'), /body\.required/);
});

test('the gate reads heredoc messages the way agents write them', () => {
  const dir = tempRepo();
  const ok = `git commit -m "$(cat <<'EOF'\nfeat(sk-git): add a thing\n\nExplains why.\n\nCo-Authored-By: Claude <noreply@anthropic.com>\nEOF\n)"`;
  assert.equal(evaluateCommand(ok, dir), null, 'attribution is stripped by the stamper, not blocked');
  const bad = `git commit -m "$(cat <<'EOF'\nUpdate things.\nEOF\n)"`;
  assert.match(evaluateCommand(bad, dir), /subject\.format/);
});

test('the gate refuses a PR body that breaks the PR rules', () => {
  const dir = tempRepo();
  const bad = `gh pr create --title "feat(x): y" --body "$(cat <<'EOF'\n## Summary\n- Adds a thing\nEOF\n)"`;
  assert.match(evaluateCommand(bad, dir), /pr\.section-missing/);
  const good = `gh pr create --title "feat(x): y" --body "$(cat <<'EOF'\n## Summary\n- Adds a thing\n\n## Test Plan\n- [x] Ran it\nEOF\n)"`;
  assert.equal(evaluateCommand(good, dir), null);
});

test('the gate refuses a branch name outside the grammar', () => {
  const dir = tempRepo();
  assert.match(evaluateCommand('git checkout -b feature/x', dir), /branch\.name/);
  assert.match(evaluateCommand('git switch -c feature/x', dir), /branch\.name/);
  assert.match(evaluateCommand('git worktree add .worktrees/074-b -b worktrees/073-a', dir), /branch\.worktree-pair/);
  assert.equal(evaluateCommand('git checkout -b branches/004-ok', dir), null);
  assert.equal(evaluateCommand('git branch -d feature/x', dir), null, 'deleting is not creating');
});

test('the gate allows what it cannot read, leaving it to the hooks and CI', () => {
  const dir = tempRepo();
  assert.equal(evaluateCommand('git commit', dir), null, 'editor commit');
  assert.equal(evaluateCommand('git commit -m "$MSG"', dir), null, 'variable message');
  assert.equal(evaluateCommand('gh pr create --fill', dir), null, 'generated body');
  assert.equal(evaluateCommand('git commit -m "update"', tempRepo(false)), null, 'no contract');
});
