---
title: "Implementation Plan: Phase 11: remaining-limits"
description: "Verify four remaining limits against the code, then fix each with the smallest in-place change and a check that fails on the old state. Luna makes every edit outside the spec folder, one dispatch at a time."
trigger_phrases:
  - "remaining limits plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: remaining-limits

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts, Python 3 verifier, TypeScript stress test, Markdown docs |
| **Framework** | None |
| **Storage** | None |
| **Testing** | node:test (doctor runner), unittest and pytest (sk-code and sk-doc), vitest (advisor stress suite), playbook validator |

### Overview
Each item was checked against the code before planning, and all four hold. Item 2 holds with one correction: of the 34 warnings outside `specs/`, 28 are fixture stand-ins, not 31, and six are real files. The fixes extend the existing functions in place. Luna (`gpt-6-luna`, max, fast) makes every edit outside this folder, one dispatch per change, and the orchestrator diffs, tests and mutation-checks each one.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)

### Baselines (2026-10-17, before any change)

| Gate | Result |
|------|--------|
| `run-all.sh` (doctor) | 7 suites passed, node:test 348/348 |
| `git-setup-check.test.cjs` | 59/59 |
| `git-setup-check.cjs --tool=claude` / `--tool=hermes` | `STATUS=OK checks=11` both |
| `run-all-drift-guards.sh` | all 4 guards PASSED, 278 warnings: 244 under `specs/` (236 in `scratch/` or `z_archive/`), 28 sk-doc fixture stand-ins, 6 real files |
| `test_verify_alignment_drift.py` | 28 tests OK |
| `validate-playbook-package.cjs --package system-skill-advisor` | PASS, violations=0 warnings=11 |
| `validate-playbook-package.cjs` (fleet) | 52 PASS, 5 SKIP, 0 FAIL, 100 warnings |
| `validate-playbook-package.test.cjs` | 1/1 (fixture 35, contract 8, prompt sync 8, piped 2 assertions) |
| `single-writer-lease-stress.vitest.ts` | 3/3 locally on three runs, CI failed it at 414.7 ms (run 38785057554) and 431.8 ms (run 38363499177) |
| sk-doc fixture tests | code-folder `failures=0`, verdict parity PASS, manifest reproducible, template seed 3 passed |
| `sync-runtime-mirrors.cjs --check` | PASS: 185 mirrors across 8 trees |
| `sync-skills-hermes.cjs --check` | PASS: 68 |
| `compiled-route-guard.cjs` | all hubs fresh or excused, exit 0 |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place extension of existing check functions. No new module, option or dependency.

### Key Components
- **Item 1, `adapterExportsBinding` (git-setup-check.cjs:1150)**: it matches only `export default [async] function (...) {` and `export default [async] (...) =>`, so `export default plugin;` returns false. The released sk-git changelog v1.9.3.0 records this limit. Fix: when neither inline form matches, read `export default <identifier>` and find that identifier's declaration at depth 0 in the masked code that `scanAdapterSource()` returns, as a function declaration, a function expression, an arrow or an object literal. The existing OpenCode and Pi rules then run on it unchanged. Only a top-level declaration counts, so a shadowing declaration inside a function and an imported identifier both read as unregistered.
- **Item 2, the drift guard**: the runner passes `--root <repo>`, and the verifier scans every tracked file. Scanning spec code is deliberate: `is_unscanned_record_path` (verify_alignment_drift.py:68) already skips `evidence` below `specs/` and says why, and `CONTEXT_ADVISORY_SEGMENTS` softens `scratch` and `z_archive` to WARN rather than skipping them. So the fix extends the same rule to `scratch` and `z_archive` below `specs/` only. Outside `specs/` both still get scanned. The 28 sk-doc fixture warnings come from stand-in modules such as `def run():\n    return "module"\n`, which exist only so a folder counts as a code folder. The README validator they feed lists file names and never reads them (`validate_document.py:1018`), so they are not meant to break Python rules. They get the shebang and docstring instead of an exclusion. The six real files get the missing line at source. `sk-vision/hooks/opencode/sk-vision.js` is a 13,822-line Bun bundle that `vision-runtime/scripts/build.ts:57-60` emits, that `sk-vision/.gitignore:4` lists and `hooks/README.md:66` calls a gitignored build artifact, and that nothing loads, because both plugin links point at `vision-runtime/dist/plugin.js`. It was committed anyway. The verifier scans tracked files only, so the source fix is to untrack it with `git rm --cached`, which keeps the file on disk.
- **Item 3, the advisor playbook**: nine of the ten unresolved paths are link texts naming a feature-catalog file without its `feature-catalog/` prefix, and one names `lanes/derived.ts`, whose real path is `runtime/lib/scorer/lanes/derived.ts`. Each now names the real path, which resolves from the skill root. `runtime/data/shadow-deltas.jsonl` is runtime output the repository ignores (`.gitignore:210`), so that line is reworded. The index gets the `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` block from the template (`manual-testing-playbook-template.md:172-175`).
- **Item 4, the stress test**: CI history shows the lease test as the only timing failure in the last 15 stress runs, with the other 63 tests passing in both failed runs. The sibling timing asserts, `trust-state` under 10 ms and `chokidar-narrow-scope` under 100 ms, never failed there, so only this file changes.

### Data Flow
Each check reads files and prints rows. None of the changes adds a write path.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Item 1: a passing fixture per declaration form and a negative test with a non-registering declaration, a nested-only declaration and an imported identifier. Mutation: restore the old function and the passing tests must fail.
- Item 2: a verifier test that spec `scratch` and `z_archive` files are skipped and `src/scratch/` is scanned. Mutation: restore the old rule and the test must fail.
- Item 3: the validator on the package and the fleet, and `hvr_scan.py` on each touched doc.
- Item 4: five local runs of the stress file, and a read of the diff to confirm only the budget changed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond the files named in the scope table.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Each target is backed up to the build scratch directory as `before-N.*` before its dispatch. Nothing is committed, so reverting one item means restoring its backups. The untracked bundle comes back with `git restore --staged .skilled/skills/sk-vision/hooks/opencode/sk-vision.js`.
<!-- /ANCHOR:rollback -->

---
