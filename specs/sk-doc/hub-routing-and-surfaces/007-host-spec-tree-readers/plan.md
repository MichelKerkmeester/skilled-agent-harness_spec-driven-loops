---
title: "Implementation Plan: Let the route sync check, the route-gold check and one advisor test run in a host that has no Skilled spec tree"
description: "Two checks learn to skip a missing Skilled spec input when the caller's repository is a host, using the host detection the trigger index already ships. One evidence file moves from a spec packet into the advisor test helpers. A throwaway host and the existing test suites prove it."
trigger_phrases:
  - "host spec tree readers plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Let the route sync check, the route-gold check and one advisor test run in a host that has no Skilled spec tree

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, CommonJS scripts and one ES module helper |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` and vitest |

### Overview
`compiled-route-sync.cjs --check` and leg 3 of `verify-router-sync.cjs` each gain a host branch that runs only when their Skilled spec input is missing. The branch loads `host-index.mjs` lazily and asks it whether the caller's git root is a host. `activation-matrix-evidence.mjs` moves into the advisor test helpers so the advisor test no longer reaches into `specs/`. A throwaway host shows both skips, and the existing suites plus two new tests show nothing else moved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `node --test .skilled/bin/tests/` reports `tests 180` and `fail 0` before any edit
- [ ] `node .skilled/bin/compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files` before any edit
- [ ] The throwaway host from `spec.md` reproduces both failures

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node --test .skilled/bin/tests/` reports `tests 182` and `fail 0`, and the throwaway host prints both skips with exit 0
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Lazy host guard

### Key Components
- **`authoredRootState(repoRoot, callerRoot)`** in `compiled-route-sync.cjs`: returns `present`, `host-skip` or `missing`. It is exported so a test can pass two temp roots. It reads the filesystem, so it is small rather than pure.
- **`callerIsHostRepository()`** in `verify-router-sync.cjs`: true only when the helper loads and the caller's git root is a host. It runs only after the gold lookup found nothing.
- **`skipNotes`** in `verify-router-sync.cjs`: a leg leaves a note there and `main` prints it under that leg's status line as `  skip: <note>`, beside the existing `  - <problem>` lines.
- **`tests/helpers/activation-matrix-evidence.mjs`**: the moved file, byte for byte. `tests/helpers/` already holds test-only helpers, the build excludes `tests/` and the vitest include `tests/**/*.vitest.ts` does not match `.mjs`, so no new `tests/support/` folder is needed.

### Data Flow
Node resolves a script's symlink before it runs, so in a host `__dirname` sits in the vendored checkout and both scripts' `REPO_ROOT` names that checkout, not the host. Each script looks for its spec input under `REPO_ROOT` first. Only when it is missing does the script `require()` `host-index.mjs`, call `callerRepoRoot()` for the git root of the working directory and pass that to `isHostRepository()`. A host answer turns the failure into a skip. Any other answer, including a load error on an older Node, keeps today's failure.

### The edits

Read each file before editing. Every OLD block below matches the file once.

**Edit 1.** `.skilled/bin/compiled-route-sync.cjs`, after `requireAuthoredRoot()`.

OLD:

```js
// The build and --check modes read the authored closure under the router program
// packet. A pruned specs/ tree must fail naming the folder to restore, not with a
// filesystem stack.
function requireAuthoredRoot() {
  if (!fs.existsSync(path.join(REPO_ROOT, layout.AUTHORED_PROGRAM_DIR))) {
    throw new Error(`authored compiled-routing source is missing; restore ${layout.AUTHORED_PROGRAM_DIR}`);
  }
}
```

NEW:

```js
// The build and --check modes read the authored closure under the router program
// packet. A pruned specs/ tree must fail naming the folder to restore, not with a
// filesystem stack.
function requireAuthoredRoot() {
  if (!fs.existsSync(path.join(REPO_ROOT, layout.AUTHORED_PROGRAM_DIR))) {
    throw new Error(`authored compiled-routing source is missing; restore ${layout.AUTHORED_PROGRAM_DIR}`);
  }
}

const HOST_INDEX_MODULE = path.join(__dirname, '..', 'skills', 'system-spec-kit', 'runtime', 'cli', 'retrieval', 'lib', 'host-index.mjs');
const HOST_SKIP_MESSAGE = "SKIP: host repository; the authored compiled-routing source ships only in Skilled's own checkout";

// The authored source ships only in Skilled's own checkout, so a host repository
// that vendors Skilled under `.skilled` has nothing for --check to compare. The
// caller's git root decides, never REPO_ROOT, because Node resolves this script's
// symlink and REPO_ROOT then names the vendored checkout. The host helper is an
// ES module, loaded with require() only when the folder is missing. An older Node
// rejects that load, and the missing folder then stays an error.
// Returns 'present', 'host-skip' or 'missing'. callerRoot defaults to the git
// root of the working directory.
function authoredRootState(repoRoot, callerRoot) {
  if (fs.existsSync(path.join(repoRoot, layout.AUTHORED_PROGRAM_DIR))) return 'present';
  try {
    const hostIndex = require(HOST_INDEX_MODULE);
    const root = callerRoot === undefined ? hostIndex.callerRepoRoot() : callerRoot;
    if (root && hostIndex.isHostRepository(root)) return 'host-skip';
  } catch {
    // An unloadable helper or an unreadable host setting leaves the folder missing.
  }
  return 'missing';
}
```

**Edit 2.** `.skilled/bin/compiled-route-sync.cjs`, the `--check` branch of `main()`. The no-argument rebuild below it is not touched.

OLD:

```js
    if (args.length !== 1) { process.stderr.write('usage: compiled-route-sync.cjs --check\n'); process.exit(2); }
    requireAuthoredRoot();
    return check();
```

NEW:

```js
    if (args.length !== 1) { process.stderr.write('usage: compiled-route-sync.cjs --check\n'); process.exit(2); }
    if (authoredRootState(REPO_ROOT) === 'host-skip') {
      process.stdout.write(`${HOST_SKIP_MESSAGE}\n`);
      return;
    }
    requireAuthoredRoot();
    return check();
```

**Edit 3.** `.skilled/bin/compiled-route-sync.cjs`, `module.exports`.

OLD:

```js
  ACTIVATION_ROOT,
  AUTHORED_RESOLVER,
  build,
```

NEW:

```js
  ACTIVATION_ROOT,
  AUTHORED_RESOLVER,
  authoredRootState,
  build,
```

**Edit 4.** Create `.skilled/bin/tests/compiled-route-sync-host.test.cjs`:

```js
'use strict';

// A host repository vendors Skilled under `.skilled` and holds none of its spec
// tree, so the route sync check skips there. Skilled's own checkout with the
// authored folder missing still fails.

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');

const { authoredRootState } = require('../compiled-route-sync.cjs');

function tempDir(t, prefix) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), prefix));
  t.after(() => fs.rmSync(dir, { recursive: true, force: true }));
  return dir;
}

test('a host whose .skilled points outside it skips the missing authored folder', (t) => {
  const vendor = tempDir(t, 'route-sync-vendor-');
  const host = tempDir(t, 'route-sync-host-');
  fs.mkdirSync(path.join(vendor, '.skilled'));
  fs.symlinkSync(path.join(vendor, '.skilled'), path.join(host, '.skilled'));
  assert.equal(authoredRootState(vendor, host), 'host-skip');
});

test('an own checkout with a real .skilled still reports the folder missing', (t) => {
  const own = tempDir(t, 'route-sync-own-');
  fs.mkdirSync(path.join(own, '.skilled'));
  assert.equal(authoredRootState(own, own), 'missing');
});
```

**Edit 5.** `.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`, after `ROUTE_GOLD_CANDIDATES`.

OLD:

```js
const ROUTE_GOLD_CANDIDATES = [
  path.join(REPO_ROOT, 'specs', 'sk-doc', 'z_archive', ROUTE_GOLD_REL.replace(/^specs[\\/]sk-doc[\\/]/, '')),
  path.join(REPO_ROOT, ROUTE_GOLD_REL),
];
```

NEW:

```js
const ROUTE_GOLD_CANDIDATES = [
  path.join(REPO_ROOT, 'specs', 'sk-doc', 'z_archive', ROUTE_GOLD_REL.replace(/^specs[\\/]sk-doc[\\/]/, '')),
  path.join(REPO_ROOT, ROUTE_GOLD_REL),
];
const HOST_INDEX_MODULE = path.join(SKILLS_ROOT, 'system-spec-kit', 'runtime', 'cli', 'retrieval', 'lib', 'host-index.mjs');

// The route gold lives in Skilled's own spec tree, so a host repository that vendors
// Skilled under `.skilled` has none by design. The caller's git root decides, never
// REPO_ROOT, because Node resolves this script's symlink and REPO_ROOT then names the
// vendored checkout. The helper is an ES module loaded with require(), which an older
// Node rejects, and a missing gold then stays a problem.
function callerIsHostRepository() {
  try {
    const hostIndex = require(HOST_INDEX_MODULE);
    const root = hostIndex.callerRepoRoot();
    return Boolean(root) && hostIndex.isHostRepository(root);
  } catch {
    return false;
  }
}

// A leg that skips part of its check leaves a note here, and main prints it under the
// leg's status line.
const skipNotes = [];
```

**Edit 6.** `verify-router-sync.cjs`, inside `legBijection()`.

OLD:

```js
  const goldPath = ROUTE_GOLD_CANDIDATES.find((p) => fs.existsSync(p));
  if (!goldPath) {
    problems.push(`route-gold not found, tried: ${ROUTE_GOLD_CANDIDATES.map((p) => path.relative(REPO_ROOT, p)).join(', ')}`);
  } else {
```

NEW:

```js
  const goldPath = ROUTE_GOLD_CANDIDATES.find((p) => fs.existsSync(p));
  if (!goldPath && callerIsHostRepository()) {
    skipNotes.push("route-gold not checked: host repository; the compiled route gold ships only in Skilled's own checkout");
  } else if (!goldPath) {
    problems.push(`route-gold not found, tried: ${ROUTE_GOLD_CANDIDATES.map((p) => path.relative(REPO_ROOT, p)).join(', ')}`);
  } else {
```

**Edit 7.** `verify-router-sync.cjs`, inside the leg loop of `main()`.

OLD:

```js
      if (problems.length > 12) console.log(`  - ... ${problems.length - 12} more`);
    }
  }
```

NEW:

```js
      if (problems.length > 12) console.log(`  - ... ${problems.length - 12} more`);
    }
    for (const note of skipNotes.splice(0)) console.log(`  skip: ${note}`);
  }
```

**Edit 8.** `.skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync.test.cjs`, append at the end of the file.

OLD:

```js
  assert.doesNotMatch(out, /section anchors not found/);
  assert.match(out, /prose path not routed: references\/unrouted\.md/);
});
```

NEW:

```js
  assert.doesNotMatch(out, /section anchors not found/);
  assert.match(out, /prose path not routed: references\/unrouted\.md/);
});

// A host vendors Skilled under `.skilled` and keeps its own specs/, so leg 3 skips the absent
// route gold there and still reports it when the vendored checkout runs on its own.
test('leg 3 skips a missing route gold in a host and reports it in its own checkout', (t) => {
  const { root, hub, guard } = buildHub(t);
  const hostIndex = path.join('system-spec-kit', 'runtime', 'cli', 'retrieval', 'lib', 'host-index.mjs');
  write(path.join(root, '.skilled', 'skills', hostIndex), fs.readFileSync(path.join(LIVE_SKILLS, hostIndex), 'utf8'));
  write(path.join(hub, 'sk-code-skilled', 'SKILL.md'), 'RESOURCE_MAP = {\n  "DEMO": ["references/o.md"],\n}\n');
  const manifest = { modes: [{ workflowMode: 'sk-code-skilled', packet: 'sk-code-skilled', leaves: ['references/o.md'] }] };
  write(path.join(hub, 'leaf-manifest.json'), JSON.stringify(manifest));
  const host = fs.mkdtempSync(path.join(os.tmpdir(), 'router-sync-host-'));
  t.after(() => fs.rmSync(host, { recursive: true, force: true }));
  for (const repo of [root, host]) assert.equal(spawnSync('git', ['init', '-q'], { cwd: repo }).status, 0);
  fs.symlinkSync(path.join(root, '.skilled'), path.join(host, '.skilled'));

  const hostGuard = path.join(host, path.relative(root, guard));
  const inHost = spawnSync(process.execPath, [hostGuard, '--checks', '3'], { cwd: host, encoding: 'utf8' });
  assert.equal(inHost.status, 0, inHost.stdout);
  assert.match(inHost.stdout, /PASS check 3/);
  assert.match(inHost.stdout, /skip: route-gold not checked: host repository/);

  const own = spawnSync(process.execPath, [guard, '--checks', '3'], { cwd: root, encoding: 'utf8' });
  assert.equal(own.status, 1, own.stdout);
  assert.match(own.stdout, /route-gold not found/);
});
```

**Edit 9.** Move the evidence file. Run from the repository root:

```bash
git mv specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix-evidence.mjs .skilled/skills/system-skill-advisor/runtime/tests/helpers/activation-matrix-evidence.mjs
```

**Edit 10.** `.skilled/skills/system-skill-advisor/runtime/tests/policy-observation-sink.vitest.ts`, line 7.

OLD:

```ts
import { evidenceBindsToCell } from '../../../../specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix-evidence.mjs';
```

NEW:

```ts
import { evidenceBindsToCell } from './helpers/activation-matrix-evidence.mjs';
```

**Edit 11.** `specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs`, line 6.

OLD:

```js
import { evidenceBindsToCell } from './activation-matrix-evidence.mjs';
```

NEW:

```js
import { evidenceBindsToCell } from '../../../../../.skilled/skills/system-skill-advisor/runtime/tests/helpers/activation-matrix-evidence.mjs';
```

**Edit 12.** `.skilled/skills/system-skill-advisor/runtime/tests/helpers/README.md`, the contents table and the consumers list.

OLD:

```markdown
| `env-snapshot.ts` | Exports `snapshotEnv(keys)`, which captures the current value of each given `process.env` key and returns a `restore()` function that re-sets or deletes each key back to its captured state. |
```

NEW:

```markdown
| `env-snapshot.ts` | Exports `snapshotEnv(keys)`, which captures the current value of each given `process.env` key and returns a `restore()` function that re-sets or deletes each key back to its captured state. |
| `activation-matrix-evidence.mjs` | Exports `evidenceBindsToCell(behavioralEvidence, deliveryEvidence, cell)`, which accepts an activated matrix cell only when its behavioral and delivery evidence agree and bind to that cell. |
```

OLD:

```markdown
- `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`
```

NEW:

```markdown
- `.skilled/skills/system-skill-advisor/runtime/stress-test/skill-advisor/opencode-plugin-bridge-stress.vitest.ts`
- `.skilled/skills/system-skill-advisor/runtime/tests/policy-observation-sink.vitest.ts`
```

**Edit 13.** `.skilled/skills/system-skill-advisor/runtime/tests/README.md`, the tree line for `helpers/`.

OLD:

```text
+-- helpers/                 # Test-only helpers (env snapshot and restore)
```

NEW:

```text
+-- helpers/                 # Test-only helpers (env snapshot, activation-matrix evidence)
```
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Setup records the baselines and builds the throwaway host. Implementation applies edits 1 to 13 in order. Verification reruns every baseline and both host commands.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Coverage floor only, one happy path and one edge per changed surface. `compiled-route-sync-host.test.cjs` drives `authoredRootState` with temp roots: a host returns `host-skip` and an own checkout returns `missing`. The new case in `verify-router-sync.test.cjs` runs the guard from a host, where it must pass with the skip line, and from its own checkout, where it must fail on the missing gold. The commands that must pass afterwards:

- `node --test .skilled/bin/tests/` reports `tests 182` and `fail 0`, against a baseline of 180 tests with 179 passed and 1 skipped.
- `node .skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs` prints `router-sync: 5/5 checks passed`.
- `node .skilled/bin/compiled-route-sync.cjs --check` prints `all 55 served copies match their authored files`.
- `cd .skilled/skills/system-skill-advisor/runtime && npx vitest run tests/policy-observation-sink.vitest.ts` prints `Tests  5 passed (5)`.
- `node --test specs/hooks-plugins-extensions/hook-injection-pipeline/002-injection-bloat-reduction/007-guardrail-controls-and-activation/activation-matrix.test.mjs` reports `pass 4`, with the same one `ajv` failure as the baseline.

The two host skips are checked by hand in the throwaway host, after copying the edited files into its vendored `.skilled`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Node with `require()` of an ES module, v26.13.0 here. `host-index.mjs` as it ships today. `git` for the caller root. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: any baseline in `spec.md` changes in Skilled's own checkout, or either script skips there. Before a commit, `git checkout --` the edited files, delete the new test file and `git mv` the evidence file back. After a commit, revert the one commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `compiled-route-sync.cjs --check` | Compares served copies with the authored folder | Update. Skips in a host | Throwaway host prints the SKIP line and exits 0 |
| `compiled-route-sync.cjs` with no argument | Rebuilds the served tree | Unchanged. Still throws without the folder | Throwaway host prints `SYNC FAILED` and exits 1 |
| Leg 3 of `verify-router-sync.cjs` | Checks compiled destinations against the gold | Update. Skips the gold in a host | Throwaway host prints `PASS check 3` and the skip line |
| `policy-observation-sink.vitest.ts` | Imports `evidenceBindsToCell` | Update. Imports from `tests/helpers/` | Vitest reports `5 passed (5)` |
| `activation-matrix.test.mjs` | Imports `evidenceBindsToCell` | Update. Imports from the new location | `pass 4` and the baseline `ajv` failure |
| `compiled-route-guard.cjs:40` and pre-commit lines 708 to 710 | Read the same authored folder | Unchanged. Not reported failing in a host | Not checked here |

Matrix axis: caller repository. Rows are a host with no Skilled spec input, where both checks skip, and Skilled's own checkout, where a present input is checked as today and a missing one still fails.

Invariant: a skip happens only when the spec input is missing and `isHostRepository(callerRepoRoot())` is true.
<!-- /ANCHOR:affected-surfaces -->

---
