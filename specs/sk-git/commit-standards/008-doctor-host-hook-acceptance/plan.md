---
title: "Implementation Plan: Let the doctor git check accept a hand-over hook and a hook the host declares omitted"
description: "Add two helpers to the doctor git battery, one that follows a hand-over marker line to an accepted hook source and one that reads skilled.omitHook from local config, and use them in checkHooks. Three test cases prove both paths, and the hooks row this worktree prints stays the same."
trigger_phrases:
  - "doctor host hook acceptance plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Let the doctor git check accept a hand-over hook and a hook the host declares omitted

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS |
| **Framework** | None |
| **Storage** | None. The omitted hooks live in local git config |
| **Testing** | `node --test` |

### Overview
`checkHooks` gains two fallbacks. A hook whose real path is not a hook source is followed through its one `# skilled-hook-handover: <dir>` line, and an absent hook is skipped when local config lists it under `skilled.omitHook`. A passing row names both in its details. Three test cases prove the hand-over, the refused marker and the omitted hook, and the hooks row this worktree prints does not change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` reports `tests 80` and `fail 0` before any edit
- [ ] `node .skilled/commands/doctor/scripts/git-setup-check.cjs` in this worktree prints the hooks row of the `spec.md` Measured Behavior block before any edit
- [ ] Lines 339 to 400 of `git-setup-check.cjs` match the OLD text below

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` reports `tests 83` and `fail 0`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fallback acceptance rules

### Key Components
- **`handoverTarget`**: follows the marker line of a host hook to a hook source. Without it a hand-over hook always reads as a foreign file.
- **`omittedHooks`**: reads `skilled.omitHook` from local config. Without it a hook the host left out on purpose always reads as missing.

### Data Flow
`checkHooks` lists the hook source names in this checkout's `scripts/git-hooks`. For each name it looks in the inspected repository's hooks folder. An absent name in the omitted set becomes a note and any other absent name a failure. A present hook whose real path is in `accepted` goes straight to the execute check. Any other present hook goes to `handoverTarget`, which returns the source's real path or null. A null keeps today's `not a hook source` failure, and a path becomes a note before the execute check runs on the host file itself. Failures return `fail` as today, and with none the row returns `pass(source, notes)`. `renderHuman` prints the details of every row, PASS included, so the notes reach the operator. With no marker and no key the notes stay empty and `pass(source, [])` equals today's `pass(source)`.

### The edits

Edits 1 to 3 are in `.skilled/commands/doctor/scripts/git-setup-check.cjs` and apply in that order. `tasks.md` applies Edit 4 first, so the new cases are seen to fail before the code changes.

Edit 1 adds the two helpers between `checkInstall` and the comment above `checkHooks`.

OLD:

```js
  return pass(source);
}

// install-git-hooks.sh is not called: it links the hook sources of the
```

NEW:

```js
  return pass(source);
}

// A host that vendors this toolchain may install a small hook of its own that
// hands over to a hook source. It names the folder it hands over to in one marker
// line, relative to its own real folder. The hook counts as that source only when
// the folder holds an accepted source of the same name and the rest of the body
// carries an exec. Returns the source's real path, or null.
const HANDOVER_MARKER = /^# skilled-hook-handover: (.+)$/;

function handoverTarget(installedReal, name, accepted) {
  let text;
  try {
    text = fs.readFileSync(installedReal, 'utf8');
  } catch {
    return null;
  }
  const lines = text.split(/\r?\n/);
  const markers = lines.map((line) => HANDOVER_MARKER.exec(line)).filter(Boolean);
  if (markers.length !== 1) return null;
  const body = lines.filter((line) => !HANDOVER_MARKER.test(line)).join('\n');
  if (!/\bexec\b/.test(body)) return null;
  let targetReal;
  try {
    targetReal = fs.realpathSync(path.join(path.dirname(installedReal), markers[0][1].trim(), name));
  } catch {
    return null;
  }
  return accepted.includes(targetReal) ? targetReal : null;
}

// A host may install fewer hooks than this checkout ships. It lists each hook it
// leaves out under skilled.omitHook in its local config, one value per hook. Only
// local scope counts, as for skilled.trustRepoHooks, because local config is never
// cloned.
function omittedHooks(repoRoot) {
  const result = git(repoRoot, ['config', '--local', '--get-all', 'skilled.omitHook']);
  if (result.status !== 0) return new Set();
  return new Set(result.stdout.split(/\r?\n/).map((value) => value.trim()).filter(Boolean));
}

// install-git-hooks.sh is not called: it links the hook sources of the
```

Edit 2 extends the comment above `checkHooks`.

OLD:

```js
// shares. A missing target and a foreign target both surface as one detail line.
function checkHooks(ctx) {
```

NEW:

```js
// shares. A missing target and a foreign target both surface as one detail line.
// A host hook whose marker line hands over to a hook source counts as that source,
// and a hook the local config lists under skilled.omitHook may be absent. A
// passing row names both, so the operator can see why it passed.
function checkHooks(ctx) {
```

Edit 3 replaces the loop and the return in `checkHooks`.

OLD:

```js
  const details = [];
  for (const name of names) {
    const installed = path.join(hooksDir, name);
    if (!fs.existsSync(installed)) {
      details.push(`${name}: not installed`);
      continue;
    }
    const installedReal = fs.realpathSync(installed);
    const accepted = [ownDir, repoDir]
      .filter((dir) => dir !== null && fs.existsSync(path.join(dir, name)))
      .map((dir) => fs.realpathSync(path.join(dir, name)));
    if (!accepted.includes(installedReal)) {
      details.push(`${name}: resolves to ${installedReal}, not a hook source`);
      continue;
    }
    // Git skips a hook it cannot execute, so a linked hook without the execute bit gates nothing.
    try {
      fs.accessSync(installedReal, fs.constants.X_OK);
    } catch {
      details.push(`${name}: not executable (chmod +x ${shellQuote(installedReal)})`);
    }
  }
  if (details.length > 0) return fail(source, details, repair);
  return pass(source);
}
```

NEW:

```js
  const omitted = omittedHooks(ctx.repoRoot);
  const details = [];
  const notes = [];
  for (const name of names) {
    const installed = path.join(hooksDir, name);
    if (!fs.existsSync(installed)) {
      if (omitted.has(name)) {
        notes.push(`${name}: omitted by skilled.omitHook`);
        continue;
      }
      details.push(`${name}: not installed`);
      continue;
    }
    const installedReal = fs.realpathSync(installed);
    const accepted = [ownDir, repoDir]
      .filter((dir) => dir !== null && fs.existsSync(path.join(dir, name)))
      .map((dir) => fs.realpathSync(path.join(dir, name)));
    if (!accepted.includes(installedReal)) {
      const target = handoverTarget(installedReal, name, accepted);
      if (target === null) {
        details.push(`${name}: resolves to ${installedReal}, not a hook source`);
        continue;
      }
      notes.push(`${name}: hands over to ${target}`);
    }
    // Git skips a hook it cannot execute, so a hook without the execute bit gates
    // nothing. For a hand-over hook that is the host file git runs.
    try {
      fs.accessSync(installedReal, fs.constants.X_OK);
    } catch {
      details.push(`${name}: not executable (chmod +x ${shellQuote(installedReal)})`);
    }
  }
  if (details.length > 0) return fail(source, details, repair);
  return pass(source, notes);
}
```

Edit 4 is in `.skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`. It adds one helper and three cases directly above the test that names this checkout's installer.

OLD:

```js
test('hooks names this checkout\'s installer by absolute path when the inspected repository is the battery\'s own checkout', (t) => {
```

NEW:

```js
// Lay out the repository's own hook sources and link every shipped hook to them,
// except the names in `skip`, which the caller installs or leaves out itself.
function linkOwnHooks(f, skip = []) {
  const ownSources = path.join(f.repo, '.skilled', 'scripts', 'git-hooks');
  fs.mkdirSync(ownSources, { recursive: true });
  fs.mkdirSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit'), { recursive: true });
  fs.writeFileSync(path.join(f.repo, '.skilled', 'skills', 'system-spec-kit', 'SKILL.md'), 'sentinel\n');
  const hooksDir = path.join(f.repo, '.git', 'hooks');
  for (const entry of fs.readdirSync(HOOKS_SOURCE, { withFileTypes: true })) {
    if (!entry.isFile() || entry.name === 'README.md') continue;
    fs.writeFileSync(path.join(ownSources, entry.name), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
    if (!skip.includes(entry.name)) {
      fs.symlinkSync(path.join(ownSources, entry.name), path.join(hooksDir, entry.name));
    }
  }
  return { ownSources, hooksDir };
}

test('hooks accepts a host hook that hands over to a hook source through its marker line', (t) => {
  const f = fixture(t);
  const { ownSources, hooksDir } = linkOwnHooks(f, ['pre-commit']);
  fs.writeFileSync(
    path.join(hooksDir, 'pre-commit'),
    '#!/bin/sh\n# skilled-hook-handover: ../../.skilled/scripts/git-hooks\nexec sh "$(dirname "$0")/../../.skilled/scripts/git-hooks/pre-commit" "$@"\n',
    { mode: 0o755 },
  );
  const row = rowOf(reportOf(f.run(['--json'])), 'hooks');
  assert.equal(row.result, 'PASS', row.details.join(' | '));
  const target = fs.realpathSync(path.join(ownSources, 'pre-commit'));
  assert.deepEqual(row.details, [`pre-commit: hands over to ${target}`]);
});

test('hooks refuses a marker line that points at a folder without the hook source', (t) => {
  const f = fixture(t);
  const { hooksDir } = linkOwnHooks(f, ['pre-commit']);
  const elsewhere = path.join(f.repo, 'elsewhere');
  fs.mkdirSync(elsewhere);
  fs.writeFileSync(path.join(elsewhere, 'pre-commit'), '#!/bin/sh\nexit 0\n', { mode: 0o755 });
  const installed = path.join(hooksDir, 'pre-commit');
  fs.writeFileSync(
    installed,
    '#!/bin/sh\n# skilled-hook-handover: ../../elsewhere\nexec sh "$(dirname "$0")/../../elsewhere/pre-commit" "$@"\n',
    { mode: 0o755 },
  );
  const row = rowOf(reportOf(f.run(['--json'])), 'hooks');
  assert.equal(row.result, 'FAIL');
  assert.deepEqual(row.details, [`pre-commit: resolves to ${fs.realpathSync(installed)}, not a hook source`]);
});

test('hooks passes a hook the local config declares omitted and fails it without the declaration', (t) => {
  const f = fixture(t);
  linkOwnHooks(f, ['post-commit']);
  const missing = rowOf(reportOf(f.run(['--json'])), 'hooks');
  assert.equal(missing.result, 'FAIL');
  assert.deepEqual(missing.details, ['post-commit: not installed']);

  execFileSync('git', ['-C', f.repo, 'config', '--local', '--add', 'skilled.omitHook', 'post-commit'], { env: f.env });
  const omitted = rowOf(reportOf(f.run(['--json'])), 'hooks');
  assert.equal(omitted.result, 'PASS', omitted.details.join(' | '));
  assert.deepEqual(omitted.details, ['post-commit: omitted by skilled.omitHook']);
});

test('hooks names this checkout\'s installer by absolute path when the inspected repository is the battery\'s own checkout', (t) => {
```

The third case covers the absent hook without a declaration, so no fourth case is added. No existing case asserts the `post-commit: not installed` detail by itself. The bare fixture case at line 790 fails on every hook at once.

No operator doc is edited. `skilled.trustRepoHooks` appears in hook script comments, the root README, changelogs, playbooks and one prose sentence in `doctor-git-setup.yaml`, and none of them is a list of keys to add an entry to.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the suite count and the hooks row this worktree prints. Implementation applies the four edits above. Verification reruns the suite, reruns the battery in this worktree and compares its hooks row with the baseline.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`node --test .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs` reports `tests 83` and `fail 0` after the edits, against a baseline of 80 tests that all pass. The three new cases are run once after Edit 4 and before Edits 1 to 3, where the hand-over case and the second half of the omitted case must fail, so each is known to detect the fault. `node .skilled/commands/doctor/scripts/git-setup-check.cjs` run in this worktree must print the same hooks row and the same `STATUS=FAIL failed=1 degraded=0 skipped=0 unknown=0` line before and after.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node, its built-in test runner and the `git` binary the battery already calls. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a test in `git-setup-check.test.cjs` that passed in the baseline fails after the edits, or the hooks row this worktree prints differs from the baseline. Before the commit, `git restore .skilled/commands/doctor/scripts/git-setup-check.cjs .skilled/commands/doctor/scripts/tests/git-setup-check.test.cjs`. After the commit, revert the one commit.
<!-- /ANCHOR:rollback -->

---
