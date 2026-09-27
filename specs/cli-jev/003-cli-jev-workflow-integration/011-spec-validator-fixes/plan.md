---
title: "Implementation Plan: Phase 11: spec-validator-fixes"
description: "Add a report-only existence and line-range check to AC_COVERAGE's two citation parsers, let check-goal.cjs take a goal.md path at its command line and make create.sh label appended phase children by folder number, each with tests and no other contract changed."
trigger_phrases:
  - "ac coverage resolution rule plan"
  - "unresolved citation detail plan"
  - "check-goal goal.md path plan"
  - "spec validator fixes rollback"
  - "create.sh phase label plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 11: spec-validator-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash with POSIX awk (`check-ac-coverage.sh`), Bash (`create.sh`), Node.js CommonJS (`check-goal.cjs`) |
| **Framework** | The `system-spec-kit` rule contract (`run_check`, `RULE_*` variables) and `node:test` |
| **Storage** | None |
| **Testing** | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh`, `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` and `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` |

### Overview
Both parsers in `check-ac-coverage.sh` already find each `file:line` with a regular expression. The build makes each parser carry its counted citations out as a fifth field. Bash builtins in `run_check()` then open each cited file, count its lines up to the cited one and print the ones that do not resolve as one detail line, while the covered count stays as it is. The first design opened the files inside awk with `getline`, but macOS awk aborts the whole program on a directory, so it was replaced. `check-goal.cjs` gets a three-line change in `main()` that swaps a `goal.md` file argument for its folder. `create.sh`'s child loop already labels appended children with their folder's number, through `8036425eaa` from another packet, so this phase adds only the shell test that pins it. Each owner's contract governs its file: `system-spec-kit`'s rule contract and `validation-rules.md` for the first and third, `sk-create-goal`'s `SKILL.md` and `scripts/README.md` for the second, and `sk-code` for code style and comment hygiene in both.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified, including the 006 ordering the orchestrator picks

### Definition of Done
- [x] All acceptance criteria met
- [x] Both test suites pass in full
- [x] Docs updated (spec/plan/tasks) and the two owner docs carry their one line each
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a sourced validation rule plus a command-line checker. No new module.

### Key Components
- **`_ac_analyze_canonical()` and `_ac_analyze_traceability()`**: already find the citation shape. They gain a fifth output field, the list of counted citations as `AC-ID (path:line)`
- **`_ac_file_has_line()`, `_ac_citation_resolves()` and `_ac_unresolved_citations()`**: new bash helpers that resolve each citation with `-f`, `-r` and a `read` loop that stops at the cited line
- **`run_check()`**: finds the repository root once, reads the fifth field, resolves it and adds one `RULE_DETAILS` line. Status and message logic are untouched
- **`check-goal.cjs` `main()`**: normalizes the packet argument before `checkGoalPacket()` runs
- **`create.sh` child loop (`:1481` onward)**: `8036425eaa` sets `_phase_number=$((PHASE_START_INDEX + _i - 1))` at `:1489`, the formula that builds the folder prefix, and uses it at `:1494`, `:1516` and `:1528`. Not edited here

### Data Flow
Each awk parser appends every counted citation to a list as `AC-ID (path:line)` and makes the row's coverage decision exactly as before. The TSV line becomes `rows, covered, malformed, malformed-ids, cited`, with `-` for an empty list, because `read` with a tab `IFS` merges empty fields. `run_check()` finds the repository root once with `git -C "$folder" rev-parse --show-toplevel`, falling back to the working directory, and hands the list to `_ac_unresolved_citations()`. That helper tries each path as written if absolute, else in the folder, then in the root. A citation with no readable file, a line outside 1 to the file's line count, or a line number longer than nine digits is unresolved.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `has_file_line()` at `check-ac-coverage.sh:291` and `:346` | Shape test for a citation | Unchanged. Resolution runs after it | The 25 existing cases pass without edits |
| `_ac_analyze_canonical()` output (`check-ac-coverage.sh:336`) | TSV read by `run_check()` and by `_ac_count_canonical_rows()` (`cut -f1`) | Update: fifth field appended | `rg -n '_ac_analyze_canonical|_ac_analyze_traceability' .skilled/skills/system-spec-kit` lists every reader |
| `run_check()` read at `check-ac-coverage.sh:430` (`:533` after the build) | Splits the TSV | Update: reads the fifth field and handles `-` | New test cases |
| `orchestrator.ts:154-157` | Prints each `RULE_DETAILS` entry as a `detail` line | Unchanged consumer | A `validate.sh --strict` run shows the new detail |
| `check-goal.cjs` `main()` (`:694-711` before the build) | Resolves the packet argument | Update: `goal.md` file argument becomes its folder | New command-line test |
| `check-goal.cjs` exports (`:716-724` before the build) | Public API used by the tests and by phase 006's plan | Unchanged | `git diff` shows no change in that block |
| `create.sh:1494`, `:1516`, `:1528` | Child labels for `graph-metadata.json`, `description.json` and the scaffold title | Already updated by `8036425eaa`. No edit here | New append-mode case in `test-phase-system.sh` |
| `create.sh:1236`, `:1252`, `:1541` | Folder name, phase-map row and metadata row, already from `_phase_number` | Unchanged | Existing append-mode cases pass |
| `create.sh:785-796` | Single first child of a new phase parent, labeled "Phase one for ..." | Not a consumer, it has its own label | `git diff` shows no change there |

Required inventories:
- Same-class producers: `rg -n 'has_file_line' .skilled/skills/system-spec-kit/runtime/cli/rules/` must show only the two known copies before the build starts. A third copy is reported, not silently fixed. `rg -n 'Phase \$\{_i\}' .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` must show only the three label lines and the two warnings.
- Consumers of changed symbols: `rg -n '_ac_analyze_canonical|_ac_analyze_traceability|check-goal.cjs' .skilled --glob '*.sh' --glob '*.cjs' --glob '*.ts' --glob '*.md'`.
- Matrix axes: citation path kind (absolute, packet-relative, root-relative, missing), line (in range, 0, past the end), parser (canonical, legacy). Required rows: canonical x {packet-relative resolves, root-relative resolves, missing file, line past the end}, and legacy x {missing file}.
- Algorithm invariant: the covered count for any criteria file equals its value before the change. Adversarial cases: a path with `..` that leaves the folder still resolves or not by plain file existence, since the rule only reads and prints the citation text, and an ellipsis path is unresolved.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Each step and its observable check:

| Step | Observable check |
|------|------------------|
| Baseline | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh` prints `25 passed, 0 failed`. `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` prints `pass 18` and `fail 0` (the planning run recorded 15). `check-goal.cjs .../006-goal-criteria-lint/goal.md` exits 2 |
| Owner reads and collision check | `git log -5 --format='%h %ad %s' --date=short` on each file in Files to Change shows nothing newer than `062ac6e4f5` (2026-09-26) and `ab725ca7ae2` (2026-09-25), and `git status --short` on them is empty |
| Resolution rule in both parsers | New test cases for a missing file and a line past the end each print their AC id in the detail |
| Detail line in `run_check()` | A `validate.sh --strict` run on a fixture shows `detail` with `Unresolved evidence citation(s):` |
| `check-goal.cjs` path change | `check-goal.cjs .../006-goal-criteria-lint/goal.md` exits 0 and prints `RESULT: PASSED (5/5 checks)` |
| `create.sh` labels | `bash .skilled/skills/system-spec-kit/runtime/cli/tests/test-phase-system.sh` prints `pass` for the new label case and 0 failed |
| Docs | `rg -n 'nresolved' .skilled/skills/system-spec-kit/references/validation/validation-rules.md` and `rg -n 'goal.md' .skilled/skills/sk-doc/sk-create-goal/scripts/README.md` each return the new line |
| Final gate | Both suites pass in full, `validate.sh --strict` on this phase prints `RESULT: PASSED` |
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Canonical parser: a packet-relative citation that resolves adds no detail (happy path). A missing file and a line past the end each add their AC id (edge). A root-relative citation resolves inside a temporary `git init` repository | `tests/check-ac-coverage.sh` with a new `expect_detail` helper beside `expect` |
| Unit | Legacy parser: a traceability row citing a missing file adds its AC id (edge), and a resolving one adds none (happy path) | `tests/check-ac-coverage.sh` |
| Integration | `check-goal.cjs` run as a child process: a `goal.md` path exits 0 with the same stdout as the folder (happy path). A path to another file exits 2 with `packet path is not a directory` (edge) | `node:test` with `child_process.spawnSync` in `check-goal.test.cjs` |
| Integration | `create.sh --phase --parent` in a throwaway repository: children appended after `001` carry "Phase 2" and "Phase 3" in the stub's `--description` log, `graph-metadata.json` and the `spec.md` title (happy path). A new parent's single child still says "Phase 1" (edge) | `tests/test-phase-system.sh`, extending its description-generator stub to log `--description` |
| Manual | `validate.sh --strict` on one real packet with unresolved citations shows the detail and the same ratio as before | Terminal |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `system-spec-kit` rule contract and `validation-rules.md` | Internal | Green | The detail format follows the existing `Malformed evidence citation(s):` line |
| `sk-create-goal` `SKILL.md` and `scripts/README.md` | Internal | Green | The checker stays read-only and keeps its five checks |
| Phase 006 build order | Internal | Green | 006 is not built in this wave, and 011's `check-goal.cjs` change is committed in `e9059c8073` |
| Owner yes for option B or C | Internal | Not requested | Without it the build stays report-only, which is the planned scope |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: any existing test case fails, `validate.sh` output changes anything other than adding the new detail line, or `check-goal.cjs` changes an exit code for an input other than a `goal.md` path
- **Procedure**: `git revert <fix commit>` for the affected skill. The three fixes share no file, so each reverts alone. No data or generated file depends on them. A child scaffolded while the `create.sh` fix was live keeps its correct label after a revert
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |

Setup is the baseline and the owner reads. Config is the 006 ordering choice. Core is the three fixes, which can run in any order. Verify is both suites and strict validation.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 minutes |
| Core Implementation | Med | 2.5 to 3.5 hours |
| Verification | Low | 1.5 hours |
| **Total** | | **4.5 to 5.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes): not applicable, no data changes
- [ ] Feature flag configured: not applicable. The new detail is advisory and changes no outcome
- [ ] Monitoring alerts set: not applicable

### Rollback Procedure
1. Stop using the new detail line. Nothing reads it automatically
2. `git revert <fix commit>` for the skill whose change misbehaves
3. Rerun both suites and `validate.sh --strict` on this phase
4. Record the revert and its reason in `goal.md`'s log

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
