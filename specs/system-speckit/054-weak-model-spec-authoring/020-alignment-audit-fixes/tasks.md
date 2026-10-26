---
title: "Tasks: Phase 20: alignment-audit-fixes"
description: "Audit the files 054 touched in four lanes, fix each finding through cli-pi or Sonnet, verify and re-audit every lane, fix the residuals, then run the close gates and validate this folder."
trigger_phrases:
  - "alignment audit fixes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: alignment-audit-fixes

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

`S` is `.skilled/skills/system-spec-kit`. `C` is `S/runtime/cli`, and commands that name `C` run from there. `P` is this phase folder, `specs/system-speckit/054-weak-model-spec-authoring/020-alignment-audit-fixes`. `CH` is `specs/system-speckit/054-weak-model-spec-authoring/changelog`. Every other command runs from the repository root, and read-only git runs with fsmonitor off. A box is ticked only when the closeout ran the Verify command and it printed what the line says.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
<!-- FILL: Replace the sample tasks with the real setup steps. Each task names a file and a verify command. GOOD: T001 Confirm `logs/archive/` holds 10 archives. Verify: `ls logs/archive | wc -l` prints 10. WEAK: T001 Set up the project. -->

- [x] T001 Audit the files 054 touched in four lanes plus a completeness critic, with each finding's file, line, evidence, fix and fix class (`P/scratch/audit/findings.json`). Verify: `python3 -c "import json;print(len(json.load(open('P/scratch/audit/findings.json'))))"` prints 46.
- [x] T002 Rebuild the scope list after the first one matched another 054 packet's trailer (`P/scratch/audit/scope2.txt`). Verify: `wc -l P/scratch/audit/scope2.txt` prints 224.
- [x] T003 [P] Write one short brief per literal finding for cli-pi (`P/scratch/briefs/`). Verify: `ls P/scratch/briefs | wc -l` prints 36 (35 briefs and `preamble.txt`).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
<!-- FILL: Write one implementation task per file change. Add a `Verify:` line with the command and its expected output. GOOD: T002 Add the `--keep <n>` branch. Verify: `--keep 3` leaves 3 archives. WEAK: T002 Implement the feature. -->

- [x] T004 [P] A1: allowlist `draft-auto-repair.vitest.ts` in the CLI import policy (`C/evals/import-policy-allowlist.json`). Verify: `npx tsx evals/check-no-mcp-lib-imports-ast.ts` in `C` prints `AST import policy check passed` and rc=0.
- [x] T005 [P] A3 and A4: COMPONENT header and `set -euo pipefail` in the drift guard, mode kept (`C/spec/check-example-drift.sh`). Verify: `rg -n 'set -euo pipefail' spec/check-example-drift.sh` prints `11:set -euo pipefail`, `ls -l` shows `-rwxr-xr-x`, and `bash spec/check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`.
- [x] T006 [P] A7: one shared `speckit_template_stamp` parser used by the token gate and the measured-behavior rule (`C/lib/status-classifier.sh`, `C/rules/check-measured-behavior.sh`). Verify: `rg -c speckit_template_stamp lib/status-classifier.sh rules/check-measured-behavior.sh` prints 2 for each file.
- [x] T007 [P] A5, A6 and A8: MODULE headers on three tests, TSDoc on `writeRepairHint`, rebuilt CLI dist (`C/tests/`, `S/runtime/lib/validation/orchestrator.ts`). Verify: `head -4` of the three tests holds 3 `MODULE` lines, `rg -n -B2 'export function writeRepairHint'` shows the `/** Prints the repair-derived.cjs --apply command` line, and `node lib/dist-freshness.cjs check --package system-spec-kit/runtime/cli --entry default` prints `@spec-kit/cli dist is fresh`.
- [x] T008 [P] B-01 to B-14 and the lane B residuals: v2.4 stamps, two catalog leaves and two scenarios, no phase or packet ids, `v2.3-or-later` wording (`S/feature-catalog/`, `S/manual-testing-playbook/`, `S/templates/`, `S/references/`). Verify: `validate_catalog_package.py --package system-spec-kit` prints `PASS tier=fail violations=0`, `validate-playbook-package.cjs --package system-spec-kit` prints `scenarios=112 ... violations=0`, and `rg -n 'phase [0-9]|054-'` over `template-authoring/` and `example-drift-guard.md` prints nothing.
- [x] T009 [P] B-03: bring `SKILL.md` under the 5,000-word limit (`S/SKILL.md`). Verify: `python3 .skilled/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py S` prints `package_skill.py --check: PASS (exit 0)`.
- [x] T010 [P] C-01 to C-17 (C-15 through B-12) and the lane C residuals: README rule counts, `--quiet` and Draft auto-repair, compact release entries, packet changelogs (`README.md`, `S/README.md`, `C/spec/README.md`, `S/changelog/`, `CH/`). Verify: the `grep '^### '` loop over `CH/changelog-054-01[3-9]-*.md` prints the seven-heading set for all 7 files, `grep -c '01[3-9]-' CH/changelog-054-root.md` prints 7, and `grep -c SPECKIT_DRAFT_AUTO_REPAIR` prints at least 1 for each of the three READMEs.
- [x] T011 [P] D-F1 to D-F3 and R3: orchestrate exit-code rule, real template source, no `Level template contract`, three warn-only rules in the command docs (`.skilled/agents/orchestrate.md`, `.claude/agents/orchestrate.md`, `.skilled/commands/speckit/`). Verify: `rg -n 'RESULT: PASSED \(exit code 0' .skilled/agents/orchestrate.md` prints line 403, and `rg -c 'Level template contract'` over the five agent trees and `rg -c 'two warn-only'` over the three command docs print nothing.
- [x] T012 [P] D-F4 and R1: spec-scoped advisor phrases, rebuilt SQLite graph and recompiled `skill-graph.json` (`S/graph-metadata.json`). Verify: `node .skilled/commands/doctor/scripts/skill-graph-freshness.cjs --strict` prints `SIGNAL DRIFT compiled vs disk: none` and rc=0, and the probe `add a measured behavior block to the spec` returns system-spec-kit first at 0.95.
- [x] T013 [P] X1, X2 and X3: list the switch, drop `effort-est`, drop per-task effort from the examples and references (`.env.example`, `S/assets/complexity-decision-matrix.md`, `S/templates/examples/level-*/tasks.md`). Verify: `rg -c SPECKIT_DRAFT_AUTO_REPAIR .env.example` prints 1, and `rg -c effort-est` on the matrix and the effort `rg` over `S/templates/examples` and `S/references/templates` print nothing.
- [x] T014 Bump system-spec-kit to 2.12.1.0 with a compact release note and regenerate the Hermes copy (`S/SKILL.md`, `S/changelog/v2.12.1.0.md`). Verify: `rg -n '^version:'` prints `2.12.1.0` for both `SKILL.md` copies, and `sync-skills-hermes.cjs --check` prints `PASS: 67 Hermes skill copies in sync`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
<!-- FILL: Write one verification task per requirement. Each one runs a command. GOOD: T003 Run both invocations. Verify: `ls logs/archive | wc -l` prints 3 and 10. WEAK: T003 Test everything. -->

- [x] T015 Run the seven targeted CLI test files (`C/tests/`). Verify: `npx vitest run --config ../../vitest.config.ts --project cli` on measured-behavior-rule, example-drift, card-sync, template-fill-guidance, draft-auto-repair, placeholder-token-gate and post-edit-placeholder-scan prints `Test Files 7 passed (7)` and `Tests 117 passed (117)`.
- [x] T016 Run the CLI check gate (`C`). Verify: `npm run check` in `C` ends with `AST handler cycle check passed` and rc=0.
- [x] T017 Run the guards and mirror checks. Verify: `check-card-sync.sh` prints `CARD SYNC OK`, `sync-runtime-mirrors.cjs --check` prints `PASS: 194 mirrors across 8 trees are in sync.`, codex and pi agent and prompt syncs print `PASS` (11, 38, 11, 38), and `agent-roster-mirror-check.cjs` prints `STATUS=OK`.
- [x] T018 Check the trigger index against the corpus. Verify: `node S/runtime/cli/retrieval/generate-trigger-index.mjs --check` prints `trigger index matches the corpus` and rc=0.
- [x] T019 Write the verifier verdicts and residual outcomes (`P/scratch/review.md`). Verify: `rg -c '^## Lane' P/scratch/review.md` prints 4.
- [x] T020 Repair derived metadata and validate this folder (`P`). Verify: `node C/spec/repair-derived.cjs --folder P --apply` exits 0, then `SPECKIT_DRAFT_AUTO_REPAIR=0 bash C/spec/validate.sh P --strict` prints `RESULT: PASSED`.
- [x] T021 Wire the guard scripts into every `post_write_validation` gate as a non-blocking check, so the speckit command docs' claim holds (`.skilled/commands/speckit/assets/speckit-{plan,implement,complete}.yaml`). Verify: `rg -c 'guard_command' .skilled/commands/speckit/assets/speckit-plan.yaml .skilled/commands/speckit/assets/speckit-implement.yaml .skilled/commands/speckit/assets/speckit-complete.yaml` prints 2, 2 and 5, and `node .skilled/skills/system-deep-loop/runtime/scripts/check-contract-drift.cjs` prints `[CONTRACT DRIFT] OK commands=3`.
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
- **Evidence**: `scratch/audit/findings.json`, `scratch/audit/lane-*.md`, `scratch/audit/critic.md`, `scratch/review.md`
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

A finding or residual left open is recorded with its reason in `scratch/review.md`, never ticked.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation
<!-- FILL: Write one check per setup fact, each with a command. GOOD: CHK-001 [P0] The start commit is in `goal.md` section 4. WEAK: Setup is ready. -->

- [x] CHK-001 [P0] The audit exists before any fix: `findings.json` holds 46 findings, 1 P0, 12 P1 and 33 P2.
- [x] CHK-002 [P0] The A1 failure is measured before the fix: `spec.md` Measured Behavior quotes `AST import policy check FAILED: 1 violation(s) found` and `EXIT=1` from `scratch/audit/lane-A-code.md:21-22`.
- [x] CHK-003 [P1] The corrected scope list exists: `scratch/audit/scope2.txt`, 224 lines.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality
<!-- FILL: Write one check per file rule. A command must answer it. GOOD: CHK-010 [P0] `bash -n scripts/rotate-logs.sh` exits 0. WEAK: Code is clean. -->

- [x] CHK-010 [P0] `bash -n` on `check-example-drift.sh`, `status-classifier.sh` and `check-measured-behavior.sh` exits 0, and `shellcheck spec/check-example-drift.sh` exits 0. Done: both exit 0.
- [x] CHK-011 [P0] `shellcheck -x -e SC2034 check-measured-behavior.sh` from `C/rules` exits 0. Done: exits 0.
- [x] CHK-012 [P1] No code comment names a phase, packet or finding id: `rg -n '054|020|T0[0-9][0-9]|A[1-8]\b'` over the three shell files prints nothing. Done: prints nothing.
- [x] CHK-013 [P1] The three shell files keep mode `-rwxr-xr-x`. Done: `ls -l` shows it for all three.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist
<!-- FILL: Write one check per acceptance criterion. GOOD: CHK-020 [P0] `--keep 3` leaves 3 archives. WEAK: Tests pass. -->

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` is Met. Done: the closure statement reads Closeable: Yes.
- [x] CHK-021 [P0] The seven targeted CLI test files pass. Done: 117 of 117 (T015).
- [x] CHK-022 [P1] Under strict mode the drift guard still prints every FAIL line: the lane A judgment pass ran a three-failure fixture before and after, and `diff` printed nothing. Done as recorded in `scratch/review.md`, lane A.
- [x] CHK-023 [P1] Playbook scenarios 485 and 486 were run verbatim and their output matches the Expected text. Done by the lane B judgment and verify passes, recorded in `scratch/review.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS
<!-- FILL: Write this section when the packet fixes a reported finding. Delete it otherwise. GOOD: CHK-FIX-001 [P0] Every finding names one class. WEAK: All findings handled. -->

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. Done: each finding carries `fix_class` literal or judgment in `findings.json`, and the class-of-bug ones (v2.3 wording, effort estimates, phase ids in evergreen docs) were swept by `rg` across their whole tree, not only the cited line.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. Done: the lane B residual pass found five more `a v2.3 doc` lines and fixed them (RB-02), and the lane C verify found the same defects in `v2.9.0.0.md` and `v2.9.3.0.md` (RA-01 to RA-05).
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. Done: the callers of `speckit_carries_token_gate_stamp` (`rules/check-placeholders.sh:153`, `rules/check-scaffold-never-touched.sh:60`, `spec/check-placeholders.sh:121`) are covered by `placeholder-token-gate`, which passes.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. Done for the one parser change: the empty-source stamp and the no-stamp file were both run against `speckit_template_stamp` (lane A judgment evidence).
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. Done: four lanes by four passes (lead, judgment, verify, residual), recorded per lane in `scratch/review.md`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. Done: scenario 486 reruns with `SPECKIT_DRAFT_AUTO_REPAIR=0` and gets `RESULT: FAILED` with no repair line.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. Not done: the work is uncommitted, and this closeout makes no git write.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security
<!-- FILL: Write one check per security surface. Write `N/A` with a reason when none applies. GOOD: CHK-030 [P0] `scripts/rotate-logs.sh` reads no credential. WEAK: Security is fine. -->

- [x] CHK-030 [P0] No hardcoded secrets. Done: the briefs and edits carry no credential, and `.env.example` gains one commented switch line.
- [x] CHK-031 [P0] N/A for input validation: no new input surface. The allowlist entry widens the import policy for one test file only, with an `expiresAt` of 2027-04-26.
- [x] CHK-032 [P1] N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation
<!-- FILL: Write one check per document that must agree. GOOD: CHK-040 [P1] `spec.md` and `tasks.md` both name `--keep <n>`. WEAK: Docs are updated. -->

- [x] CHK-040 [P1] Spec/plan/tasks synchronized: all three name the same four lanes and the same P0, A1.
- [x] CHK-041 [P1] Code comments adequate: the new helper's header states why one parse exists (lane A judgment evidence), with no ephemeral label (CHK-012).
- [x] CHK-042 [P2] README updated: the root, skill and `runtime/cli/spec` READMEs name `--quiet` and the Draft auto-repair (T010).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization
<!-- FILL: Write one check per file location rule. GOOD: CHK-050 [P1] Test copies live under `scratch/test/`. WEAK: Files are organized. -->

- [x] CHK-050 [P1] Temp files in scratch/ only: briefs, runs, audit and review live under `P/scratch/`, and the scenario runs left no `specs/zz-pb-*` path.
- [ ] CHK-051 [P1] scratch/ cleaned before completion. Not done on purpose: `scratch/audit`, `scratch/briefs` and `scratch/runs` are the evidence this phase cites, so they stay.
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
