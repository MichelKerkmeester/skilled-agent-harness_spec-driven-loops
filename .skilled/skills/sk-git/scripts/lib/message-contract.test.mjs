// ───────────────────────────────────────────────────────────────────
// MODULE: Message Contract Tests
// ───────────────────────────────────────────────────────────────────
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
import { execFileSync, spawnSync } from 'node:child_process';

import {
  ContractError,
  TEMPLATE_FILES,
  commitRuleIds,
  contractShapeErrors,
  extractContract,
  lengthLiteralErrors,
  loadContract,
  rangeContext,
  resolveContractDir,
  stripCommitMessage,
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

test('optional commit rules stay inactive when their contract keys are absent', () => {
  const contract = {
    ...COMMIT,
    subject: { ...COMMIT.subject },
    body: { ...COMMIT.body },
  };
  delete contract.subject.scopeAliases;
  delete contract.subject.warnLength;
  delete contract.body.breakingSections;

  assert.deepEqual(validateCommit('feat(sk-git): add a thing\n\nWhy.', contract), {
    errors: [],
    warnings: [],
    passthrough: false,
  });
  for (const id of ['subject.scope-alias', 'subject.length-target', 'body.breaking-sections']) {
    assert.equal(commitRuleIds(contract).includes(id), false, id);
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

test('scope aliases name the canonical scope and canonical scopes pass', () => {
  const contract = {
    ...COMMIT,
    subject: { ...COMMIT.subject, scopeAliases: { 'old-scope': 'new-scope' } },
  };
  const alias = validateCommit('feat(old-scope): add a thing\n\nWhy.', contract);
  assert.deepEqual(ids(alias), ['subject.scope-alias']);
  assert.match(alias.errors[0].message, /new-scope/);
  assert.deepEqual(ids(validateCommit('feat(new-scope): add a thing\n\nWhy.', contract)), []);
  assert.ok(commitRuleIds(contract).includes('subject.scope-alias'));
});

test('subject length target warns above its threshold and stays quiet at the threshold', () => {
  const contract = {
    ...COMMIT,
    subject: { ...COMMIT.subject, warnLength: 80 },
  };
  const prefix = 'feat(sk-git): ';
  const subjectOfLength = (length) => `${prefix}${'a'.repeat(length - [...prefix].length)}`;
  const above = validateCommit(`${subjectOfLength(81)}\n\nWhy.`, contract);
  assert.deepEqual(ids(above), []);
  assert.deepEqual(above.warnings.map((warning) => warning.id), ['subject.length-target']);
  const at = validateCommit(`${subjectOfLength(80)}\n\nWhy.`, contract);
  assert.deepEqual(ids(at), []);
  assert.deepEqual(at.warnings, []);
  assert.ok(commitRuleIds(contract).includes('subject.length-target'));
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
  // '..' resolves to the specs root or above it, which always exists, so existence alone passes it.
  for (const escape of ['..', 'sk-git/../..', '../specs/sk-git/001-x']) {
    assert.ok(v(`feat(sk-git): add a thing\n\nWhy.\n\nSpec: ${escape}`, { specExists: () => true }).includes('trailer.spec-exists'), escape);
  }
  assert.ok(v('feat(sk-git): add a thing\n\nWhy.\n\nCo-Authored-By: A <a@b.c>').includes('attribution.forbidden'));
  assert.ok(v('feat(sk-git)!: drop a thing\n\nWhy.').includes('breaking.footer'));
  assert.deepEqual(v('feat(sk-git): add a thing\n\nThe Anthropic client moved.'), [], 'prose naming the vendor is not attribution');
});

test('breaking commits require every declared section', () => {
  const footer = 'BREAKING CHANGE: the interface changed';
  const missingVerification = validateCommit(
    `feat(sk-git)!: change the interface\n\nContext: why.\nChanges: what changed.\n${footer}`,
    COMMIT,
  );
  assert.deepEqual(ids(missingVerification), ['body.breaking-sections']);
  assert.match(missingVerification.errors[0].message, /Missing: Verification\./);

  const missingChangesAndVerification = validateCommit(
    `feat(sk-git)!: change the interface\n\nContext: why.\n${footer}`,
    COMMIT,
  );
  assert.deepEqual(ids(missingChangesAndVerification), ['body.breaking-sections']);
  assert.match(missingChangesAndVerification.errors[0].message, /Missing: Changes, Verification\./);

  const allSections = validateCommit(
    `feat(sk-git)!: change the interface\n\nContext: why.\nChanges: what changed.\nVerification: tested.\n${footer}`,
    COMMIT,
  );
  assert.deepEqual(ids(allSections), []);
  assert.deepEqual(ids(validateCommit('feat(sk-git): add a thing\n\nWhy.', COMMIT)), []);
  assert.ok(commitRuleIds(COMMIT).includes('body.breaking-sections'));
});

test('the pre-stamp stage drops attribution the stamper would strip', () => {
  const msg = 'feat(sk-git): add a thing\n\nWhy.\n\nCo-Authored-By: A <a@b.c>\nClaude-Session: x';
  assert.deepEqual(ids(validateCommit(msg, COMMIT, { stage: 'pre-stamp' })), []);
});

test('the pre-stamp stage keeps a trailer that only names the vendor, for the rule to report', () => {
  const msg = 'feat(sk-git): add a thing\n\nWhy.\n\nGenerated-By: Anthropic Claude';
  assert.ok(ids(validateCommit(msg, COMMIT, { stage: 'pre-stamp' })).includes('attribution.forbidden'));
});

test('warnings never block', () => {
  const result = validateCommit('feat(sk-git): finish wave 3 cleanup work\n\nWhy.', COMMIT);
  assert.deepEqual(ids(result), []);
  assert.deepEqual(result.warnings.map((w) => w.id), ['subject.process-language']);
});

test('comment lines go only where git drops them', () => {
  const typed = 'feat(sk-git): add a thing\n\n#42 was the cause of this.';
  assert.equal(stripCommitMessage(typed), typed, 'a -m message keeps its # lines');
  const edited = `${typed}\n\n# Please enter the commit message for your changes.\n#\n# On branch main`;
  assert.equal(stripCommitMessage(edited), 'feat(sk-git): add a thing', 'an editor session drops them');
  assert.equal(stripCommitMessage(typed, '#', 'strip'), 'feat(sk-git): add a thing', 'commit.cleanup=strip drops them');
  assert.deepEqual(ids(validateCommit(typed, COMMIT)), [], 'a # body line under -m is a body');
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

test('a pushed commit finds a packet the repository keeps out of git', () => {
  const dir = tempRepo(false);
  const git = (...args) => execFileSync('git', ['-C', dir, ...args], { encoding: 'utf8' });
  fs.writeFileSync(path.join(dir, '.gitignore'), '/specs\n');
  fs.mkdirSync(path.join(dir, 'specs', '001-kept'), { recursive: true });
  git('add', '.gitignore');
  git('-c', 'user.name=t', '-c', 'user.email=t@t', 'commit', '-q', '-m', 'chore: init');
  const sha = git('rev-parse', 'HEAD').trim();
  const ctx = rangeContext(dir, [sha])(sha);
  assert.equal(ctx.specExists('specs/001-kept'), true);
  assert.equal(ctx.specExists('specs/002-missing'), false);
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

test('a non-string scope alias value makes the commit contract invalid', () => {
  const dir = tempRepo(false);
  const localContracts = path.join(dir, '.sk-git');
  fs.mkdirSync(localContracts);
  const file = path.join(localContracts, TEMPLATE_FILES.commit);
  const contract = { kind: 'commit', subject: { scopeAliases: { legacy: 42 } } };
  fs.writeFileSync(file, [
    '## Enforced rules',
    '',
    '```json',
    JSON.stringify(contract),
    '```',
    '',
  ].join('\n'));
  assert.throws(() => loadContract(dir, 'commit'), (error) => (
    error instanceof ContractError && error.message.includes('subject.scopeAliases.legacy')
  ));
});

test('subject warning length and breaking sections require valid shapes', () => {
  assert.ok(contractShapeErrors({ kind: 'commit', subject: { warnLength: 0 } }, 'commit')
    .some((problem) => problem.includes('subject.warnLength')));
  assert.ok(contractShapeErrors({ kind: 'commit', body: { breakingSections: [] } }, 'commit')
    .some((problem) => problem.includes('body.breakingSections')));
  assert.ok(contractShapeErrors({ kind: 'commit', body: { breakingSections: ['Impact', 42] } }, 'commit')
    .some((problem) => problem.includes('body.breakingSections')));
  for (const label of ['', '  ', 'Context:', 'Con\ntext']) {
    assert.ok(contractShapeErrors({ kind: 'commit', body: { breakingSections: [label] } }, 'commit')
      .some((problem) => problem.includes('body.breakingSections[0]')), JSON.stringify(label));
  }
});

test('a warning length at or above the hard limit makes the commit contract invalid', () => {
  assert.ok(contractShapeErrors({ kind: 'commit', subject: { maxLength: 100, warnLength: 100 } }, 'commit')
    .some((problem) => problem.includes('subject.warnLength')));
  assert.ok(!contractShapeErrors({ kind: 'commit', subject: { maxLength: 100, warnLength: 80 } }, 'commit')
    .some((problem) => problem.includes('subject.warnLength')));
});

test('a scope alias must point at a scope the pattern accepts, never at another alias', () => {
  const subject = (scopeAliases) => ({ kind: 'commit', subject: { scopePattern: '^[a-z][a-z0-9-]*$', scopeAliases } });
  assert.ok(contractShapeErrors(subject({ legacy: 'Not_Valid' }), 'commit')
    .some((problem) => problem.includes('subject.scopeAliases.legacy')));
  assert.ok(contractShapeErrors(subject({ a: 'b', b: 'canonical' }), 'commit')
    .some((problem) => problem.includes('subject.scopeAliases.a')));
  assert.deepEqual(contractShapeErrors(subject({ legacy: 'canonical' }), 'commit'), []);
});

test('restated subject lengths must match the rules block, in the template and in SKILL.md', () => {
  const contract = extractContract(fs.readFileSync(path.join(ASSETS, TEMPLATE_FILES.commit), 'utf8'));
  assert.deepEqual(lengthLiteralErrors('Aim for 81 characters (`subject.length-target`).', contract).length, 1);
  for (const skill of [path.resolve(HERE, '../../SKILL.md'), path.resolve(HERE, '../../../../../.hermes/skills/sk-git/SKILL.md')]) {
    assert.deepEqual(lengthLiteralErrors(fs.readFileSync(skill, 'utf8'), contract), [], skill);
  }
});

test('skgit.contractDir pointing nowhere is an error, not an opt-out', () => {
  const dir = tempRepo(false);
  execFileSync('git', ['-C', dir, 'config', 'skgit.contractDir', 'nope']);
  assert.throws(() => loadContract(dir, 'commit'), ContractError);
});

test('a command-scope skgit.contractDir cannot switch the rules off', () => {
  const dir = tempRepo(true);
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'message-contract-empty-'));
  const saved = { ...process.env };
  try {
    process.env.GIT_CONFIG_COUNT = '1';
    process.env.GIT_CONFIG_KEY_0 = 'skgit.contractDir';
    process.env.GIT_CONFIG_VALUE_0 = empty;
    assert.equal(loadContract(dir, 'commit').source, 'git config skgit.contractDir');
    assert.equal(resolveContractDir(dir).dir, ASSETS);
  } finally {
    for (const key of ['GIT_CONFIG_COUNT', 'GIT_CONFIG_KEY_0', 'GIT_CONFIG_VALUE_0']) {
      if (saved[key] === undefined) delete process.env[key];
      else process.env[key] = saved[key];
    }
  }
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

test('a bundled short-flag cluster cannot carry a bad subject past the gate', () => {
  const dir = tempRepo();
  const messageFile = path.join(dir, 'message.txt');
  fs.writeFileSync(messageFile, 'wip\n');
  const bundled = [
    'git commit -am "wip"',
    'git commit -sm "wip"',
    'git commit -qm "wip"',
    'git commit -asm "wip"',
    `git commit -aF "${messageFile}"`,
  ];
  for (const command of bundled) {
    assert.match(evaluateCommand(command, dir), /subject\.format/, command);
  }
});

test('a bundled commit flag keeps a conventional subject beside its separate body', () => {
  const dir = tempRepo();
  assert.equal(evaluateCommand('git commit -am "feat(sk-git): add a thing" -m "Explains why."', dir), null);
});

test('a short value flag never expands the token that is its value', () => {
  const dir = tempRepo();
  assert.match(evaluateCommand('git commit -m -am', dir), /subject\.format/);
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

test('a backtracking contract pattern cannot hang the validator', () => {
  const dir = tempRepo(false);
  fs.mkdirSync(path.join(dir, '.sk-git'));
  fs.writeFileSync(
    path.join(dir, '.sk-git', TEMPLATE_FILES.commit),
    '## Enforced rules\n\n```json\n{ "kind": "commit", "subject": { "types": ["feat"], "scopePattern": "^(a+)+$" } }\n```\n',
  );
  const message = path.join(dir, 'message.txt');
  fs.writeFileSync(message, `feat(${'a'.repeat(34)}b): add a thing\n`);
  const cli = path.resolve(HERE, '../validate-message.mjs');
  const started = Date.now();
  const run = spawnSync(process.execPath, [cli, '--repo', dir, '--commit', message], {
    encoding: 'utf8',
    timeout: 20_000,
  });
  assert.equal(run.signal, null, 'the validator was killed by the timeout');
  assert.ok(Date.now() - started < 10_000, `took ${Date.now() - started} ms`);
  assert.equal(run.status, 1, run.stderr);
});

test('the stamper drops exactly the attribution keys the commit template forbids', () => {
  const hook = fs.readFileSync(path.resolve(HERE, '../../../../scripts/git-hooks/prepare-commit-msg'), 'utf8');
  const line = hook.split('\n').find((l) => l.startsWith('FORBIDDEN_KEY_RE='));
  assert.ok(line, 'prepare-commit-msg defines FORBIDDEN_KEY_RE');
  const match = line.match(/^FORBIDDEN_KEY_RE='\^\(([^)]*)\):'$/);
  assert.ok(match, `unexpected FORBIDDEN_KEY_RE shape: ${line}`);
  assert.deepEqual(match[1].split('|').sort(), [...COMMIT.attribution.forbiddenKeys].sort());
});
