---
title: "Tasks: Phase 21: ci-gate-regressions"
description: "Confirm both CI failures, skip scratch packets in the changed-packet selection loop, drop the advisor phrase that routed /deep:research to spec-kit, make the in-range audit fixes through cli-pi and Opus, then replay each gate and validate this folder."
trigger_phrases:
  - "ci gate regressions tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: ci-gate-regressions

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation
<!-- FILL: Keep the prefix table and add the two shell variables this task list uses. GOOD: `R` is `scripts/rotate-logs.sh`. `A` is `logs/archive/`. WEAK: Variables are defined below. -->

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/skills/system-spec-kit`. `C` is `S/runtime/cli`, and commands that name `C` run from there. `A` is `.skilled/skills/system-skill-advisor/runtime`, and commands that name `A` run from there. `P` is this phase folder, `specs/system-speckit/054-weak-model-spec-authoring/021-ci-gate-regressions`. `W` is `.github/workflows/changed-packet-validation.yml`. Every other command runs from the repository root, and git runs read-only with `-c core.fsmonitor=false`. A box is ticked only when the closeout ran the Verify command and it printed what the line says.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Confirm the X1 failure on main (CI run 40380947180). Verify: `gh run view 40380947180 --json conclusion,headSha,name` prints `"conclusion":"failure"` and head `b51a341a07...`, and `grep -c 'New packet does not validate'` on its `--log-failed` output prints 82 (81 error annotations plus the script line that prints the call).
- [x] T002 Count the scratch packets that run graded (`W`). Verify: `git diff --name-only b51a341a07^2 b51a341a07 -- specs | grep -c '/scratch/.*/spec\.md$'` prints 104.
- [x] T003 [P] Confirm the repo convention that scratch is never validated (`S/references/validation/`). Verify: `sed -n 57p S/references/validation/path-scoped-rules.md` prints the `**/scratch/**` row with `Skip all validation`, and `sed -n 322p S/references/validation/validation-rules.md` prints `Scratch files are never scanned`.
- [x] T004 [P] Write one short cli-pi brief per literal finding (`P/scratch/briefs/`). Verify: `ls P/scratch/briefs | wc -l` prints 5 (A-1, B-01, X6, X7 and `preamble.txt`), and `P/scratch/runs/exits.txt` holds `exit=0` for all four.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T005 X1: skip any changed file under a whole `scratch/` path segment in the selection loop (`W`). Verify: `rg -n 'scratch/\*\) continue' W` prints `91:                case "$file" in (*/scratch/*) continue ;; esac`.
- [x] T006 X1: add the scratch-copy and scratch-named tests (`C/tests/ci-rule-set-comparison.vitest.ts`). Verify: `npx vitest run --config ../../vitest.config.ts --project cli tests/ci-rule-set-comparison.vitest.ts` in `C` prints `Tests 17 passed (17)`, and with `CHANGED_PACKET_WORKFLOW_PATH` pointed at `git show HEAD:W` it prints `Tests 1 failed | 16 passed (17)`, the failure being `does not grade a packet copied under a scratch folder`.
- [x] T007 X2: replace `draft auto-repair` with `spec docs` in both lists and recompile the graph (`S/graph-metadata.json`, `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json`). Verify: `rg -c '"spec docs"' S/graph-metadata.json` prints 2, and `rg -c 'draft auto-repair'` on both files prints nothing.
- [x] T008 [P] B-01: add the ten `---` separators and rename `## 1. BOUNDS` (`S/references/workflows/spec-authoring-card.md`). Verify: `rg -c '^---$'` on the card prints 12, `rg -n '^## 1\.'` prints `20:## 1. OVERVIEW AND BOUNDS`, and `python3 .skilled/skills/sk-doc/scripts/validate_document.py` on the card prints `Total issues: 0`.
- [x] T009 [P] B-03, B-04, B-05: the Level 3 row names `decision-record.md` a lazy add-on (`S/references/validation/validation-rules.md`, `S/references/validation/path-scoped-rules.md`, `S/references/templates/level-selection-guide.md`). Verify: `rg -n 'lazy add-on'` over the three files prints lines 206, 69 and 135.
- [x] T010 [P] A-1: ignore every `dist/` folder (`S/runtime/eslint.config.mjs`). Verify: `rg -n "ignores:"` prints line 10 with `'**/dist/**'`, and `npx eslint . --ext .ts -f json` from `S/runtime` reports 244 problems, 0 in a `dist/` file.
- [x] T011 [P] X6: point the authoring checklists at real files (`.skilled/commands/speckit/assets/speckit-complete.yaml`). Verify: `rg -n "checklists/[^ ]*_authoring|assets/opencode"` on the YAML prints nothing, `yaml.safe_load` prints `YAML OK`, and `ls .skilled/skills/sk-code/sk-code-skilled/assets/checklists/` lists the four `*-authoring.md` files.
- [x] T012 [P] X7: correct the Level 2 line in `--help` (`C/spec/validate.sh`). Verify: `bash C/spec/validate.sh --help | rg LEVELS` prints `LEVELS: 1=spec+plan+tasks+impl-summary*, 2=+acceptance-criteria (optional), 3=+architecture guidance`, and `ls -l` still shows `-rwxr-xr-x`.
- [x] T013 Bump system-spec-kit to 2.12.2.0 with a compact release note and regenerate the Hermes copy (`S/SKILL.md`, `S/changelog/v2.12.2.0.md`). Verify: `rg -n '^version:'` prints `2.12.2.0` for `S/SKILL.md` and `.hermes/skills/system-spec-kit/SKILL.md`, and `node S/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T014 Replay the X1 selection over the failing diff (`W`). Verify: the selection loop run over `git diff -z --name-only --diff-filter=ACMR b51a341a07^2 b51a341a07 -- specs`, keeping a document only when its folder holds `spec.md` at `b51a341a07`, grades 111 packets with 104 under `scratch/` without the skip, and 7 packets with 0 under `scratch/` with it.
- [x] T015 Run the Routing Registry Drift suites (`A`). Verify: `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` prints `Tests 9 passed (9)`; the drift guard and two parity suites print `Tests 21 passed (21)`; `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` prints `Tests 7 passed (7)`; `tests/routing-golden-prompts.vitest.ts` prints `Tests 14 passed (14)`.
- [x] T016 Run the graph checks from the same workflow. Verify: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` prints `SIGNAL DRIFT compiled vs disk: none` and rc=0, `skill_graph_compiler.py --validate-only` prints `VALIDATION PASSED`, `generate-router-intent-signals.cjs --check` prints `RESULT: PASSED`, and `compiled-route-guard.cjs` prints `All hubs fresh or excused`.
- [x] T017 Run the spec-kit CLI tests and guards (`C`). Verify: `npx vitest run --config ../../vitest.config.ts --project cli tests/card-sync.vitest.ts tests/ci-rule-set-comparison.vitest.ts` prints `Tests 27 passed (27)`, `bash spec/check-card-sync.sh` prints `CARD SYNC OK`, and `bash spec/check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`.
- [x] T018 Probe the live advisor (`node .skilled/bin/skill-advisor.cjs advisor_recommend`). Verify: rr-iter3-149 ranks system-deep-loop first (0.5724 against 0.5621), `repair derived metadata after editing docs` ranks system-spec-kit first (0.6922 against sk-doc 0.6475), and `read the spec authoring card before writing spec docs` ranks system-spec-kit first (0.8068).
- [x] T019 Repair derived metadata and validate this folder (`P`). Verify: `node C/spec/repair-derived.cjs --folder P --apply` exits 0, then `SPECKIT_DRAFT_AUTO_REPAIR=0 bash C/spec/validate.sh P --strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria
<!-- FILL: Keep the three completion lines and add the one artifact that proves the phase is done. GOOD: `--keep 3` leaves 3 archives and the suite passes. WEAK: Work is complete. -->

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] `acceptance-criteria.md` reads Closeable: Yes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References
<!-- FILL: Name the spec and plan files. Add the decision record when the packet has one. GOOD: Specification: `spec.md`. Plan: `plan.md`. WEAK: See the other docs. -->

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Evidence**: `scratch/briefs/`, `scratch/runs/`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist
<!-- FILL: Fill each checklist section below. GOOD: Each CHK line names the command that answers it. WEAK: The checklist is done. -->

<!-- ANCHOR:protocol -->
## Verification Protocol
<!-- FILL: Keep the three rows and add the rule this packet uses for a blocked task. GOOD: P0 blocks close. P1 needs a recorded reason. WEAK: Follow the priorities. -->

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A check left open is recorded with its reason on its own line, never ticked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The X1 failure is observed before the fix: `gh run view 40380947180` reports `"conclusion":"failure"` (T001).
- [x] CHK-002 [P0] The X1 cause is measured: the old selection loop grades 104 packets under `scratch/` in the failing diff (T014).
- [x] CHK-003 [P1] The scratch convention is cited from the repo, not assumed (T003).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] The workflow parses and its step script runs: the 17 `ci-rule-set-comparison` tests load the YAML and run the real step script. Done: 17 of 17.
- [x] CHK-011 [P0] The edited YAML parses: `yaml.safe_load` on `speckit-complete.yaml` prints `YAML OK`.
- [x] CHK-012 [P1] No code comment names a phase, packet or finding id: the added workflow and test comments state the reason (scratch is working space, a whole segment matches) and carry no id. Done by reading the diff.
- [x] CHK-013 [P1] `validate.sh` keeps mode `-rwxr-xr-x`. Done: `ls -l` shows it.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met. Done: the closure statement reads Closeable: Yes.
- [x] CHK-021 [P0] The new scratch-copy test fails against the old workflow. Done: `Tests 1 failed | 16 passed (17)` (T006).
- [x] CHK-022 [P1] A real packet whose name contains "scratch" is still graded and still blocks. Done: the scratch-named test passes (T006).
- [x] CHK-023 [P1] The divergence ratchet passes with the recompiled graph. Done: 9 of 9 (T015).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Done: X1 `class-of-bug` (every scratch packet, not one), X2 `cross-consumer` (one phrase, every prompt carrying `auto`), B-03 to B-05 `class-of-bug` across three docs, B-01, A-1, X6 and X7 `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Done: `rg -c 'draft auto-repair'` over the spec-kit metadata and compiled graph prints nothing, and `rg -n "checklists/[^ ]*_authoring|assets/opencode"` over the YAML prints nothing.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Done: the selection loop's only other reader is its own test; the weekly `strict-pass-freshness-report.yml` holds no `git diff` call (`grep -c` prints 0).
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Done for the one path match: the scratch-copy and scratch-named rows run beside the existing hostile-name and spaced-name rows.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Done: one axis, where `scratch` sits in the path (whole segment or inside a name), two rows.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Done: the test reads `CHANGED_PACKET_WORKFLOW_PATH`, and the run with it pointed at the old workflow fails as expected (T006).
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Not done: the work is uncommitted, and this closeout makes no git write. The replay is pinned to `b51a341a07^2..b51a341a07`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Done: the diff adds no credential or token.
- [x] CHK-031 [P0] Input validation implemented. Done: the skip runs on the NUL-delimited path before any other parsing, so a hostile packet name still reaches the existing escaping unchanged; the hostile-name tests pass.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: all three name X1, X2 and the same in-range findings.
- [x] CHK-041 [P1] Code comments adequate: the workflow comment says why scratch is skipped and why only a whole segment matches.
- [x] CHK-042 [P2] README updated: N/A, no README describes the selection loop or the advisor phrase.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only: briefs and runs live under `P/scratch/`, and the replay script and CI log stayed in the session scratchpad outside the repository.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Not done on purpose: `scratch/briefs` and `scratch/runs` are the evidence this phase cites, so they stay.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary
<!-- FILL: Count the boxes by priority and write the three totals. GOOD: P0 12, P1 13, P2 1. WEAK: Most items done. -->

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 11/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-26. No P0 is open. Two P1 checks stay open with reasons: CHK-FIX-007 (uncommitted, no SHA) and CHK-051 (scratch kept as evidence).
<!-- /ANCHOR:summary -->

---
