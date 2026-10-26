---
title: "Implementation Plan: Phase 8: runner-limit-closeout"
description: "Closes the runner's own open items with measurement rather than assertion: a probe that proves the checker its hook names, a read-only dist path with declared generated files, one bounded workspace listing instead of three, and a stated guard boundary."
trigger_phrases:
  - "runner limit closeout plan"
  - "quality runner budget plan"
  - "runner guard boundary"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 8: runner-limit-closeout

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node 22 CommonJS (`.cjs`) for the runner, the guard and the freshness library, Python 3 for `check-dist-staleness.sh` and the hygiene checker, and one Node test suite per area |
| **Framework** | None. Node built-in modules only: `node:test`, `node:child_process`, `node:fs`, `node:path` and `node:crypto` |
| **Storage** | None. A run still writes nothing. The one file that could appear, a freshness cache record beside a dist entry, is what this phase removes from a gate run |
| **Testing** | `node --test` over the quality suite with temporary fixture repositories, the four quality shell suites, and one recorded timing command over five runs |

### Overview
Six requirements: one each for the items phase 002 left open, and one that stops a framework-specific checklist from reaching a surface the runner could not verify. The probe resolves the checker its hook names before it reads a layer as installed. The dist check gets an opt-in read-only mode, declared generated paths, and a snapshot that covers the folders they live in. The workspace listing moves from three whole-tree walks per run to one bounded read, and the five-run timing command records the change. An ADR settles what the guard can see, and the phase 002 limitation list is corrected to match. Every step ends with a command whose output decides it.

### Dependency on the earlier phases
This plan depends on `002-builtin-runner` and `003-config-and-doctor`. Step 0 confirms both have landed before any edit, because phase 003 moves the guard's call sites and adds `--config`, and because the citations in section 8 were checked on the phase 002 tree at HEAD `f69e5cd2e8`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 and phase 003 have landed. `rg -n 'function probePreCommit|function takeSnapshot' .skilled/skills/sk-code/sk-code-quality/scripts` prints both functions at the landed tree.
- [ ] The baseline is recorded with the section 4 step 3 command, five runs, before the first edit to a source file.
- [ ] Every citation this plan repeats was re-checked at the landed tree, and the table in section 8 holds the results.
- [ ] Scope is frozen in `spec.md` section 3, and no file outside it changes.

### Definition of Done
- [ ] The six requirements pass, with evidence recorded in `acceptance-criteria.md`.
- [ ] The five-run timing command prints five `real` lines, each under `2.00`.
- [ ] `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# fail 0`.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout --strict` prints `RESULT: PASSED`.
- [ ] Each changed skill carries its changelog entry and version, and the packet changelog exists.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: five narrow changes inside one existing pipeline. Each stage keeps its shape, its output and its error codes, and each change is measured or proven before the next one starts.

### Key Components
- **`probePreCommit` in `quality-gate.cjs`**: reads the hook text, its trust gate and now the checker path the text names, and returns one layer state.
- **`fileFacts` and `applicability` in `quality-gate.cjs`**: decide what reads a file. A base-declared generated path needs a path through them that reaches the dist adapter only.
- **`collectScope` in `quality-gate.cjs`**: resolves the file list and the changed lines. It owns the one workspace listing a run needs.
- **`takeSnapshot` and `withGuard` in `lib/run-check.cjs`**: hash the workspace before and after the spawned checks. They share the listing `collectScope` made, and they add the ignored watch only if the ADR adds it.
- **`checkPackageFreshness` in `dist-freshness.cjs`**: owns the cache record write. The read-only mode is a new option beside it, and the default stays as it is.
- **`check-dist-staleness.sh`**: the per-file mode is the only caller that passes the read-only switch. `--all` and the session-start path keep their behavior.
- **`assets/quality-defaults.json`**: the `generated` rows name the dist entries this repository holds.
- **`scripts/tests/fixtures.cjs` and `quality-gate.test.cjs`**: the snapshot and the cases that prove the four claims.

### Data Flow
1. `collectScope` reads the workspace once, bounded to the scope it was given, and returns the file list with its changed lines.
2. `fileFacts` reads each file. A declared generated path is marked generated instead of excluded, and no base-layer check other than the dist adapter reads it, while a repository's own `generated` row runs on it.
3. `applicability` and `planChecks` build the plan, with `dist-staleness` holding only declared generated paths.
4. The spawned checks run inside one guard snapshot pair, which reuses the scope's listing instead of walking the tree again.
5. The dist adapter runs once per declared generated path with the read-only switch set, so the freshness library writes no cache record.
6. The verdict renders as it does today. The gate, the exit codes and the schema are untouched.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase is partly a fix. It touches path handling in the layer probe, a write path in another skill's library, the guard's coverage boundary and the workspace listing, so the inventory applies.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `probePreCommit` (`quality-gate.cjs:1217-1241`) | Reads the hook text and its trust gate, and does not prove the checker path | update: resolve the named checker and report `broken` when it cannot run | `unit: layers` reads `present`, `broken`, `broken` and SC-002 prints `present` on this repository |
| `fileFacts` exclude short-circuit (`quality-gate.cjs:736-739`) | Returns every `**/dist/**` file as unchecked before a check sees it | update: a declared generated path is read as generated, the sensors and the parse floor still skip it, and a repository's own `generated` row still reaches it | F20 reaches the dist adapter with no other base-layer check reading that file, and F38 runs a repository `generated` row on its declared path |
| `collectScope` untracked listing (`quality-gate.cjs:686`) | Lists the whole tree once per run | update: bounded to the folders the scope reaches, and skipped for the scope itself on `--files`, where each guard snapshot takes one bounded listing instead | The step 3 timing and `unit: scope listing` |
| `takeSnapshot` (`run-check.cjs:153-173`) and `withGuard` (`:190-195`) | Lists the untracked files and hashes them, twice per run | update: reuse the scope listing, and hash only the entries the snapshot adds | `unit: argv spawn and guard` and `unit: guard snapshot source` |
| `writeStoredBuildRecord` call in `checkPackageFreshness` (`dist-freshness.cjs:806`) | Writes a cache record beside the dist entry on a fresh verdict | update: skipped when the read-only option is set | `unit: dist read-only`, and F20's unchanged snapshot |
| `check-dist-staleness.sh` per-file mode (`:208`) | Calls `check-file` with no read-only argument | update: passes the switch when the environment asks for it | F20, and `unit: dist adapter` for the stand-in script |
| The four session-start hook configs (`.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`) | Call the checker with the writable default | not a consumer of the mode, and unchanged | `rg -n 'check-dist-staleness' .claude/settings.json .codex/hooks.json .cursor/hooks.json .devin/hooks.v1.json` prints the same lines before and after |
| `.skilled/scripts/git-hooks/pre-commit:126` | Names the checker through `COMMENT_CHECKER`, with `SOURCE_ROOT` set at line 22 | unchanged, and read by the probe | SC-002 prints `present` on this repository |
| Post-edit router (`.skilled/hooks/post-edit-quality/lib/post-edit-router.cjs`) | Names the checker for the post-edit layer | unchanged here | `rg -n 'check-comment-hygiene' .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs` prints one line |
| `runner-contract.md` sections 1, 2 and 8 | States the CLI, the layer states and the dist limits | update: the `broken` definition, the read-only path, the listing count and the guard boundary | SC-005 and the document validator |
| Phase 006 measurement | Measures the same budget on the final runner | consumer of the after numbers | Section 4 step 3 records the command phase 006 reuses |

Required inventories:
- Same-class producers: `rg -n 'ls-files|status --porcelain|rev-parse' .skilled/skills/sk-code/sk-code-quality/scripts --glob '*.cjs'` lists every workspace reader, so no second walk stays behind.
- Consumers of the guard: `rg -n 'withGuard|takeSnapshot' .skilled/skills/sk-code/sk-code-quality/scripts --glob '*.cjs'` lists the runner and the configured checks phase 003 adds.
- Consumers of the read-only mode: `rg -n 'check-file|dist-freshness' .skilled/skills/sk-code/sk-code-quality .skilled/skills/system-spec-kit/runtime/cli` lists the checker, the library and the suites.
- Matrix axes: scope (`--files`, `--worktree`, `--base`), hook checker state (present, missing, not executable), declared path state (declared and present, declared and absent, not declared), dist switch (on, off), cache record state (absent, present with the same hashes), repository (this one, a foreign one), and machine.
- Checklist-row consumers: `rg -c 'checklistRows|resolveChecklists' .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs` prints `5`, so one repository condition serves the run and `--explain` alike.
- Algorithm invariant: the snapshot still hashes every path the previous one hashed for the same scope, so a write inside the scope is detected exactly as before. Adversarial cases: a check that creates an untracked file inside the scope, a check that rewrites a tracked file, a second edit to a file that was already modified, an ignored write beside a dist entry, and a write outside the scope, which the ADR's boundary names.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

The seven steps below are the order of work. `tasks.md` owns the individual task rows and their checkboxes. Each step here names one probe that proves it before the next step starts.

### Step 0: Confirm the base and record the baseline
What it does: confirms phases 002 and 003 are landed, re-checks the section 8 citations at the landed tree, and records the five-run baseline with the step 3 command before any source edit.

Acceptance: the two functions exist, every citation row reads `Holds` or names the corrected line, and the baseline file records the HEAD, the machine and five `real` lines.

Verify: `rg -n 'function probePreCommit|function takeSnapshot' .skilled/skills/sk-code/sk-code-quality/scripts` prints two lines.

### Step 1: REQ-001, prove the checker a hook names
What it does: in `probePreCommit`, after the trust gate, strip shell comments from the hook text, so a mention inside a comment names no checker and reads `absent`, while a `#` inside quotes stays text. Then read every occurrence of `check-comment-hygiene.sh` back to the last character that cannot belong to a path, drop a variable name that sits inside the word, and fold `..` segments at the root rather than letting them escape it. A plain `tools/...`, a `./tools/...`, a path after `sh`, `bash`, `cd ... &&` or a trailing `|| true`, and one behind a `$NAME/`, `${NAME}/`, `${NAME:-default}/` or nested `$(...)/` prefix are therefore one candidate each. Resolve a candidate against the repository root, its `.skilled` source root, its `.opencode` source root, and the repository that owns the hook through `git rev-parse --git-common-dir`, and try an unprefixed absolute path as it stands. Report `present` only when one candidate is a regular file with the execute bit. Otherwise report `broken` with a repair line naming the resolved path. `runner-contract.md` section 2 defines `broken` as installed but not runnable, and names this cause.

Acceptance: three cases read `present`, `broken` for a missing checker and `broken` for a checker without the execute bit, and this repository's own hook still reads `present`.

Verify: `node --test --test-reporter=tap --test-name-pattern='^unit: layers' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`, then the SC-002 command prints `present`.

### Step 2: REQ-002, give the dist adapter a real path with no write
What it does: add a `readOnly` option to `checkPackageFreshness` and `checkAllFreshness`, and a `--no-write` flag to the library CLI. In that mode the checker-origin `writeStoredBuildRecord` call at `dist-freshness.cjs:806` is skipped and the returned verdict is unchanged. Leave the default writable, so the session-start hook and `--all` are untouched. `check-dist-staleness.sh` passes `--no-write` on its per-file `check-file` call when `SPECKIT_DIST_READ_ONLY=1` is in the environment, and `runDistAdapter` sets that variable beside `SPECKIT_DIST_AUTO_REBUILD=0`. Then declare the `generated` rows for the eight dist entries this repository holds: `system-spec-kit/shared/dist/tsconfig.tsbuildinfo`, `system-spec-kit/runtime/cli/dist/tsconfig.tsbuildinfo`, `system-spec-kit/runtime/cli/dist/spec/is-phase-parent.js`, `system-spec-kit/runtime/dist/tsconfig.tsbuildinfo`, `system-spec-kit/runtime/dist/lib/validation/orchestrator.js`, `system-skill-advisor/runtime/dist/runtime/advisor-server.js`, `system-skill-advisor/runtime/dist/runtime/skill-advisor-cli.js` and `sk-design/sk-design-md-generator/backend/dist/cli.js`. The `mcp-code-mode` entry stays out, because its build is absent here.

The second half is reachability. `fileFacts` returns every `**/dist/**` file as `excluded` at line 736, so a declared path could never reach the adapter. A path that matches a base-declared `generated` row is read as a generated file instead, and `applicability` keeps every base-layer check other than the dist adapter away from it. A repository's own `generated` row reaches such a path through `configuredMatches`, which tests reachability rather than passability, so that row runs on the paths it declares.

The proof is the snapshot. `describeEntry` in `fixtures.cjs` records the content hash, the mode and now the modification time, so a rewrite that reproduces the bytes still fails. `assertSnapshotUnchanged` takes the folders holding the declared dist entries as extra roots. Fixture F20 names a declared entry with `--files`, runs the real checker, and asserts two things: `dist-staleness` did not read `ERROR`, and no file under the dist folders changed.

Acceptance: F20 passes, and `unit: dist read-only` shows a cache record absent after a read-only check on a temporary workspace and present after a writable one.

Verify: `node --test --test-reporter=tap --test-name-pattern='^F20|^unit: dist' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.

### Step 3: REQ-003, meet the two-second budget by measurement
What it does: first records the baseline, then removes the repeated workspace walks, then records the after numbers with the same command.

The command, which is the measurement method for this requirement:
```bash
for run in 1 2 3 4 5; do
  /usr/bin/time -p node .skilled/skills/sk-code/sk-code-quality/scripts/quality-gate.cjs \
    --files $(git ls-files '*.cjs' | head -50) --format json > /dev/null
done 2>&1 | rg '^real'
```
The scope is the first 50 paths `git ls-files '*.cjs'` prints, which is stable for a fixed commit. Record `git rev-parse --short HEAD` and the machine beside the five lines, because a wall clock number means nothing without them.

Where the time goes: a `--worktree` run reads the untracked files three times, once in `collectScope` and once in each snapshot. A probe at HEAD `f69e5cd2e8`, before phase 003 lands, ran exactly this command and printed `real 2.28`, `real 2.08`, `real 2.04`, `real 2.07` and `real 2.01`, so every run is over budget before the change. The same probe timed a whole-tree `git ls-files --others --exclude-standard -z` at 0.71 s to 1.02 s over three runs, and the same listing bounded to `.skilled/skills/sk-code/` at 0.02 s, which is where the budget will come from. Step 0 records the numbers again on the landed tree, because phase 003 changes this file first.

In this order, stopping when five runs are under 2.00:
1. Read the untracked list once per run and hand it to `collectScope` and to both snapshots. `withGuard` already accepts an earlier snapshot, so the seam exists.
2. Bound that listing to the folders the scope reaches. A `--files` scope takes no listing of its own, because it hashes the named files and the tracked diff set, and each of its guard snapshots takes one bounded listing over the folders its named files sit in, so a path a check creates beside one of them is still seen.
3. For a declared generated path, hash the path itself rather than its folder.
4. Then, and only then, spawn `node --check` and `bash -n` files through a bounded pool, with the same deadline per process.

The guard rule: the set of paths a snapshot hashes for a given scope must not shrink. A case writes an untracked file inside the scope from a stand-in check and must still exit 3 with `CHECK_MUTATED_WORKSPACE` naming it.

Acceptance: five runs print five `real` lines under `2.00`, the whole suite still prints `# fail 0`, and the write case exits 3.

Verify: the command above, then `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` prints `# fail 0`.

### Step 4: REQ-004, settle the guard boundary with a measurement
What it does: measures the ignored listing at both bounds, writes the ADR with the numbers, and states the boundary in `runner-contract.md`. The probe here took 91,555 whole-tree ignored entries in 0.91 s to 1.43 s over six runs, and 447 entries bounded to `.skilled/skills/system-spec-kit/runtime/cli/dist` in 0.02 s. The decision rule the ADR applies: add the bounded watch inside the scope when its measured cost stays under a bounded budget this phase sets (50 ms on this machine) and it hashes only folders the scope already reads. Otherwise the target-repository boundary stands.

Either way, `runner-contract.md` states what the guard sees: the tracked diff, the untracked files inside the scope, and either the ignored paths inside the scope or the reason they stay outside.

Acceptance: the ADR carries both numbers and the decision, and the contract's boundary sentence matches the code, including when the watch is not added.

Verify: `rg -n 'ignored' .skilled/skills/sk-code/sk-code-quality/references/runner-contract.md` prints the boundary sentence, and `rg -n '^## ADR-00' specs/sk-code/015-quality-agnostic-gate/008-runner-limit-closeout/decision-record.md` prints the ADR headings.

### Step 5: REQ-005 and the release work
What it does: edits Known Limitations items 1, 3, 4 and 5 of the phase 002 summary to name what closed each, and item 8 to name phase 005. Nothing else in that file changes except the continuity block. Then bumps the versions, writes one changelog entry per changed skill, writes the packet changelog, regenerates the Hermes copies with their sync script, and re-derives the graph metadata.

Acceptance: the four items and item 8 read the new text, the versions match their newest changelog file, and the mirrors are generated rather than hand-edited.

Verify: `rg -n 'closed by' specs/sk-code/015-quality-agnostic-gate/002-builtin-runner/implementation-summary.md` prints four lines, and `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` exits 0 after the copies are regenerated.

### Step 6: REQ-006, scope the spec-folder checklist to the repository that owns it

What it does: a base-layer row in `assets/quality-defaults.json` may carry `hubRepo: true`, and `resolveChecklists` matches such a row only when the file's repository root is the repository that owns the declaration hub. The spec-folder row gains that condition. The three `.js` and `.css` rows keep matching by path alone, because they carry no surface house style.

Why the condition is the repository rather than the file's label: measured on this repository, `specs/sk-code/015-quality-agnostic-gate/spec.md` resolves to `unknown` and still lists the spec-folder checklist today, because the row carries no condition. A condition on the SKILLED label would therefore take the checklist off this repository's own spec docs as well as off a foreign repository's, and the second fixture case would fail. The harm R6 names is the foreign repository, so the condition is the repository boundary the runner already knows.

The two cases. F21 builds a fixture repository holding `specs/demo/spec.md` and `specs/demo/notes.js`, runs the runner against the real hub with no override, and asserts three things: both files resolve to `UNKNOWN`, `spec-folder-authoring-checklist.md` is not listed, and the three `.js` style checklists still are. The same run at this tree lists the spec-folder checklist, so the case fails before the change and passes after it. F22 runs the real runner with `cwd` at this repository root over the first `spec.md` it finds under `specs/`, and asserts the checklist is listed, so the case names no packet path that may later be archived. `unit: target map` keeps comparing the two checklist sources, and the `Q/SKILL.md` map row names the repository condition.

Acceptance: F21 and F22 print `# fail 0`, `unit: target map` still prints `# fail 0`, and the three surface-neutral rows keep their selectors.

Verify: `node --test --test-reporter=tap --test-name-pattern='^F21|^F22|unit: target map' .skilled/skills/sk-code/sk-code-quality/scripts/tests/quality-gate.test.cjs` prints `# fail 0`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `unit: layers` gains the present, missing and non-executable checker cases. Fixtures F30 to F33 cover a dist check that cannot assess its package, and F34 to F37 the checker spellings a hook can carry, including a mention that sits only in a comment. `unit: dist read-only` covers the library option on a temporary workspace. `unit: dist adapter` keeps its stand-in script and gains the switch. `unit: guard snapshot source` asserts that a listing the guard was handed is hashed rather than re-taken, that a later window lists once, and that a `--files` run bounds its guard listings to the folder its named file sits in. `unit: scope listing` asserts the bounded pathspec. `unit: target map` keeps reading both checklist sources, now with the repository condition on the spec-folder row. `unit: argv spawn and guard` keeps every case it has | `node:test` in `scripts/tests/quality-gate.test.cjs`, plus the library CLI through `spawnArgv` |
| Integration | Fixture F20, a declared generated path checked by the real `check-dist-staleness.sh` with the snapshot over the dist folders. Fixture F38 runs a repository `generated` row on the path it declares. Fixtures F21 and F22 prove the checklist scope, one in a foreign repository and one on this repository's own spec files. Fixtures F01 to F05, F10, F12 to F14 and F16 to F18 stay in the suite and stay green | `node:test` with `scripts/tests/fixtures.cjs` |
| Measurement | The five-run timing command of section 4 step 3, at the baseline and after the change, with the HEAD and the machine recorded | `/usr/bin/time -p` and `rg` |
| Regression | The whole quality suite, the four quality shell suites, `compiled-route-sync.cjs --check`, and the setup battery phase 003 adds | `node --test`, `bash`, `node` |

A timing figure is recorded, not asserted. No test fails on a slow machine, and the budget is checked by reading the five lines the command prints. The suite asserts the mechanism instead: one listing, a bounded pathspec, and a write that still ends the run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-builtin-runner` (`probePreCommit`, `takeSnapshot`, the fixtures, the contract) | Internal, earlier phase | Green, landed | None. The files this phase edits do not exist without it |
| `003-config-and-doctor` (`--config`, the configured checks and the guard around each of their spawns) | Internal, earlier phase | Red until it lands on the branch | The step 0 check fails, and the guard change is written against a tree that does not match. The phase waits |
| `system-spec-kit` freshness library, owned by another skill | Internal | Green, with one suite under `runtime/cli/tests` | A behavior change there reaches four session-start hooks, so the default stays writable |
| Node 22 with `node:test` and `--test-name-pattern` | External | Green. CI runs Node 22, this machine runs Node 26.8.2 | Test selection fails on older Node |
| `python3` with a working `-B -I` | External | Green here | The hygiene call and the dist checker report `SKIPPED_ABSENT`, and the run is UNVERIFIED |
| git | External | Green | The guard is unavailable, and the scope needs `--files` |
| `/usr/bin/time -p` | External | Green here | The timing command prints nothing usable, so the measurement falls back to the shell's `time` keyword |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: five runs stay over 2.00 seconds after the change, this repository's own hook reads `broken`, a run creates or rewrites a file beside a dist entry, or phase 006 cannot reproduce the budget.
- **Procedure**: revert this phase's commits with `git revert`, newest first. Then run `node --test --test-reporter=tap .skilled/skills/sk-code/sk-code-quality/scripts/tests/*.test.cjs` and `node .skilled/bin/compiled-route-sync.cjs --check`, and run the five-run command to confirm the tree is back at the baseline it started from. Phases 002 and 003 stay in place, because every requirement here is an improvement to a working runner.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:citations -->
## 8. DESIGN CITATION CHECK

The citations this phase relies on were read at HEAD `f69e5cd2e8`, before phase 003 lands. Step 0 re-checks them at the landed tree, because phase 003 edits two of these files.

| Reference | Result at the current tree | Used in |
|-----------|----------------------------|---------|
| `quality-gate.cjs:1217-1241` for `probePreCommit` | Holds: the function spans lines 1217 to 1241 | REQ-001 |
| `quality-gate.cjs:1228` and `:1229-1233` for the checker-name test and the execute-bit check on the hook itself | Holds | REQ-001 |
| `.skilled/scripts/git-hooks/pre-commit:126` with `SOURCE_ROOT` at `:22` | Holds: the hook names `${SOURCE_ROOT}/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh`, and `SOURCE_ROOT` is `.skilled`, or `.opencode` when the framework tree lives there | REQ-001 |
| `quality-gate.cjs:736-739` for the exclude short-circuit | Holds: a matching file returns as `excluded` with no text read | REQ-002 |
| `quality-gate.cjs:910` and `:927` for the `generated` rows and the `dist-staleness` applicability | Holds: the row is read, and the file never arrives because of the short-circuit | REQ-002 |
| `dist-freshness.cjs:295-299`, `:325-347` and `:806` for the cache path, the writer and the checker-origin call | Holds: the write sits in the fresh branch of `checkPackageFreshness` | REQ-002 |
| `check-dist-staleness.sh:208` for the per-file `check-file` argv | Holds | REQ-002 |
| `quality-defaults.json:17` for the empty `generated` list, and `:4` for the exclude globs | Holds: `**/dist/**` is in the exclude list at line 4 | REQ-002 |
| `quality-gate.cjs:663-697` for `collectScope`, with the untracked listing at `:686` | Holds | REQ-003 |
| `run-check.cjs:153-173` for `takeSnapshot`, `:162` for its untracked listing, `:190-195` for `withGuard` | Holds: the function takes an earlier snapshot as the guard's start | REQ-003, REQ-004 |
| `quality-gate.test.cjs:420-458` for `unit: layers` and `:639-677` for `unit: dist adapter` | Holds. The first asserts `present` for a hook whose named checker does not exist, which is the case this phase changes | REQ-001, REQ-002 |
| `fixtures.cjs:87-93` for `describeEntry` and `:185-191` for `assertSnapshotUnchanged` | Holds: the entry hashes the content and the mode, and not the modification time, and the roots are the fixture folder and the scripts folder | REQ-002 |
| `runner-contract.md:20`, `:56` and `:223` for sections 1, 2 and 8 | Holds: section 8's last bullet names the cache write as the reason no generated path is declared | REQ-001 to REQ-004 |
| The phase 002 `implementation-summary.md` items 1, 3, 4, 5 and 8 at lines 164, 166, 167, 168 and 171 | Holds | REQ-005 |
| The phase 002 `decision-record.md` ADR-018 | Holds: its status line is `Accepted, confirmed by the operator 2026-10-26`, which every ADR in this packet repeats | REQ-002, REQ-004 |
| The phase 003 `decision-record.md` ADR-006 | Holds: it owns the guard's ownership split, which this phase keeps | REQ-003, REQ-004 |
<!-- /ANCHOR:citations -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
002-builtin-runner ──┐
                     ├──► 008-runner-limit-closeout ──► 006-measurement
003-config-and-doctor┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| 002-builtin-runner | 001-honest-checker | Every phase above it, through the runner it creates |
| 003-config-and-doctor | 001-honest-checker, 002-builtin-runner | 005-consumers-and-routing, 006-measurement |
| 008-runner-limit-closeout | 002-builtin-runner, 003-config-and-doctor | 006-measurement, which measures the budget this phase meets |
| 006-measurement | 003-config-and-doctor, 005-consumers-and-routing, 008-runner-limit-closeout | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Estimates are an assumption, made before any code exists.

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (step 0) | Low | About one hour, including the baseline and the citation re-check |
| Core Implementation (steps 1 to 4 and 6) | High | About two and a half days: half a day for the probe, half a day for the dist path, one day for the budget and the boundary, and half a day for the checklist scope |
| Verification and release (step 5) | Medium | About one day, including the mirrors, the changelogs and the packet gates |
| **Total** | | **About three and a half days (assumption)** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Phases 002 and 003 have landed, and their suites print `# fail 0` on the branch head
- [ ] The branch head is recorded before the first commit of this phase
- [ ] The baseline timing lines are recorded, with the HEAD and the machine
- [ ] No feature flag applies. No caller reads the read-only mode until the runner sets it

### Rollback Procedure
1. Revert this phase's commits with `git revert`, newest first.
2. Run the quality suite and confirm it prints `# fail 0` on the reverted tree.
3. Run the five-run timing command and confirm it reads at the recorded baseline.
4. Confirm `git status --porcelain` names no file under a dist folder, so no cache record was left behind.

### Data Reversal
- **Has data migrations?** No. The library's default stays writable, so every existing cache record keeps its meaning.
- **Reversal procedure**: N/A. Nothing this phase adds writes outside a temporary fixture folder.
<!-- /ANCHOR:enhanced-rollback -->

---
