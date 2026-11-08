---
title: "Tasks: Phase 3: command-trigger-runtimes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "command trigger runtimes tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: command-trigger-runtimes

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Spike and tests first

- [x] T001 Lane 3.1 spike: per runtime (Codex, Cursor, Devin, Hermes) capture the interactive seed syntax, whether a Stop or sessionEnd event fires with a captured event, and the command-mirror form. SWE probes Codex, Cursor and Hermes; Luna probes Devin. Captures land in `scratch/` and the verdict matrix gets four rows. Evidence: run-ledger D57 (Codex AUTO), D58 (Hermes AUTO, Cursor COMMAND-ONLY), D62 (Devin COMMAND-ONLY); the four-row matrix is published at `.skilled/hooks/session-relaunch/README.md:13-21` with `scratch/spike/SPIKE-*.md` evidence links.
- [x] T002 Lane 3.2 tests first: Luna writes stub-runtime wrapper tests per runtime and adapter tests only where the verdict is `AUTO` (`.skilled/hooks/session-relaunch/**/*.test.*`). A red run is recorded before T003 starts. Evidence: run-ledger D63, D66, D70, D80 and D81 record tests-first lanes with red runs before each green rerun (7 Node + 5 Python, 4, 5 and 3 fails).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Build

- [x] T003 Lane 3.3 wrapper case arms: Luna adds one arm per verified runtime to `.skilled/bin/skilled-loop`; SWE reviews the diff. Evidence: run-ledger D63 (codex, cursor, hermes arms, node 184/184, shellcheck 0), D67 review PASS 47/47, D70 (devin arm + multi-hop, node 200/200, 49/49 wrapper tests) and D81 (per-runtime manual command, node 214/214).
- [x] T004 Lane 3.4 adapters and registry: Luna builds arm-plus-kill adapters and `hook-registry.json` rows only where the verdict is `AUTO` and the event is confirmed to fire; SWE reviews; then `sync-hook-registrations.cjs` runs. Evidence: run-ledger D64, D65 (Codex adapter, 3 registry rows, `sync-hook-registrations` write runs), D66 (Hermes via repo-guards, node 200/200 + pytest 57/57), D76 (orchestrator-built 3.4d+3.4e), D79, D80, D83 final review PASS; PG2 records the 32-hook registry with the 3 Codex rows as the only delta.
- [x] T005 Lane 3.5 command mirrors: SWE writes `/speckit:handoff` mirrors in the form T001 found, then `sync-runtime-mirrors.cjs --check`. Evidence: run-ledger D68 (only `.hermes/prompts/speckit-handoff.md` added; Codex and Cursor mirrors already resolve to canonical; Devin has no surface) and PG3 `sync-runtime-mirrors.cjs --check` PASS 192 mirrors.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Docs and gate

- [x] T006 Lane 3.6 README runtime matrix in `.skilled/hooks/session-relaunch/README.md` (runtime, trigger, seed syntax, mirror form, evidence), via the named sk-doc mode. Evidence: the matrix at `.skilled/hooks/session-relaunch/README.md:15-23` carries runtime, trigger, seed syntax, mirror form, spike evidence and verdict columns; run-ledger D78 and D82 (validate_document rc=0, 0 issues).
- [x] T007 Lane 3.6 catalog entry update under `system-spec-kit/feature-catalog/context-preservation/` plus the `feature-catalog.md` index. Evidence: `.skilled/skills/system-spec-kit/feature-catalog/context-preservation/session-relaunch-loop.md` names all seven runtimes; run-ledger D78 (validate_document 9/9 rc=0).
- [x] T008 Lane 3.6 playbook scenarios per runtime plus the playbook index under `system-spec-kit/manual-testing-playbook/plugins-and-hooks/`. Evidence: `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-command-runtimes.md` covers all four runtimes with 4 automatable checks and 4 live checks; run-ledger D78 (package validator rc=0).
- [x] T009 Lane 3.6 coverage matrix rows in `.skilled/hooks/README.md`. Evidence: `.skilled/hooks/README.md:30` names the concern across all seven runtimes, `:188` carries the per-runtime adapter row and `:278` the coverage matrix row; run-ledger D78.
- [x] T010 Lane 3.7 gate PG: the orchestrator runs section 11 items 1 to 10 from the final state. Evidence: run-ledger.md:290-299 "Gate PG for phase 003" — PG1 node 214/214 + pytest 59/59 + vitest 7/7, PG2 sync-hook PASS (delta = 3 Codex rows), PG3 mirrors PASS 192, PG4 drift guards 4/4 + hygiene 0 hits, PG5 shellcheck 0, PG6 docs validators green, PG7 playbook recorded, PG8 scope receipt mapped.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] AC-001 to AC-005 in `acceptance-criteria.md` each carry evidence or a backed waiver
- [x] `validate.sh <this folder> --strict` reports `RESULT: PASSED`
- [x] Gate PG items 1 to 10 pass and the status line is posted. Evidence: run-ledger.md:290-299 records PG1-PG8 PASS from the final state plus the review-gap note; the STATUS line convention is recorded for phase 002 at run-ledger.md:278 and the 003 gate ran at 22:05.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] spec.md scope matches the approved plan's phase 003 subsection (read both, no drift). Evidence: spec.md:87-126 scope and files-to-change match `../scratch/approved-plan.md:257-274` (lanes 3.1-3.7, AUTO gating, command baseline); the one amendment is the operator-approved review-defect clause at spec.md:101.
- [x] CHK-002 [P0] plan.md lanes, roles and halts match plan sections 4, 7 and 8. Evidence: plan.md:99-139 actor roles, ordered lanes and halts match `../scratch/approved-plan.md:257-274` (003 lane table) and `:309-364` (halt table H2-H13).
- [x] CHK-003 [P1] Phase 001 artifacts exist on disk: `relaunch-core.cjs`, `killer.cjs`, `.skilled/bin/skilled-loop`, `.skilled/commands/speckit/handoff.md`. Evidence: all four verified on disk by this lane: `.skilled/hooks/session-relaunch/lib/relaunch-core.cjs` and `lib/killer.cjs` exist, `.skilled/bin/skilled-loop` is mode 755 and `.skilled/commands/speckit/handoff.md` exists.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `shellcheck .skilled/bin/skilled-loop` exits 0 (plan section 11 item 5; run directly because the file has no `.sh` extension). Evidence: PG5 shellcheck and rule-copy checks rc=0 (run-ledger.md:295).
- [x] CHK-011 [P0] `bash .skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` exits 0 after `git add -N` on new paths (plan section 11 item 4, section 10). Evidence: PG4 drift guards 4/4 passed, 278 baseline warnings unchanged, alignment drift 0 findings (run-ledger.md:294).
- [x] CHK-012 [P1] Every Luna build diff has a SWE review before acceptance, and the SWE mirror diff has a Luna read-only review (plan section 8 acceptance sequence). Luna-built diffs all carry SWE reviews (D67 wrapper PASS 47/47; D72, D73, D77, D79, D83 on the adapters). The D68 SWE mirror diff got its Luna read-only review once the quota returned: D143 VERDICT PASS, `sync-prompts-hermes --check` PASS 38, and the orchestrator confirmed the mirror is byte-identical in shape to `speckit-plan.md` after the name swap.
- [x] CHK-013 [P1] New code follows the sk-code-opencode checklists and carries no spec paths or ids in comments (plan section 10). Evidence: PG4 comment-hygiene scan 0 hits (run-ledger.md:294).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `node --test` on the phase's explicit test files ends with `# fail 0` and the expected count (plan section 11 item 1). Evidence: PG1 `fail 0` at 214/214 Node tests plus Hermes pytest 59/59 (run-ledger.md:291).
- [x] CHK-021 [P0] Each stub-runtime wrapper test asserts the seed, the cwd change and no resume flag for its runtime (plan section 9 wrapper bullets, AC-002). Evidence: `skilled-loop.test.cjs` RUNTIME_RELAUNCH_CASES loop asserts argv, cwd and absent resume flag per runtime; PG1 `fail 0`.
- [x] CHK-022 [P1] Adapter tests exist only for runtimes with verdict `AUTO` and a captured firing event (AC-003). Evidence: adapter test files exist under `codex/` and `hermes/` only, matching the AUTO verdicts at run-ledger D57 and D58; no cursor or devin adapter dir exists.
- [x] CHK-023 [P1] Decline paths are asserted: stale or unarmed file and the hop cap, each logged in `relaunch.log` (plan sections 6 and 9). Evidence: D70 multi-hop and decline coverage landed with the devin arm (node 200/200); decline and hop-cap tests assert `relaunch.log` lines in `skilled-loop.test.cjs`; PG1 green.
- [x] CHK-024 [P1] `hook-registration-sync.vitest.ts` and any touched adapter vitest suites pass (plan section 11 item 1). Evidence: PG1 hook-registration-sync vitest 7/7 (run-ledger.md:291).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] Each confirmed review finding gets one fix dispatch with one change, then a re-review (plan section 8 acceptance sequence). Evidence: confirmed findings were fixed and re-reviewed at D72, D73, D77, D79, D80 and D83; the residual P2 list is carried to phase 004 (run-ledger.md:284-289).
- [x] CHK-FIX-002 [P1] No `git checkout`, `restore`, `reset`, `stash` or file deletion on rejection; rejected diffs are re-dispatched narrower (plan section 8 rejecting rule). Evidence: the ledger records narrower re-dispatches, e.g. D76 orchestrator-built 3.4d+3.4e after the rejected lane; no destructive git operation appears in D57-D83.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No test shows a signal reaching a non-descendant pid or the wrapper acting without `SKILLED_LOOP_ID`; any such result is H9 (plan section 8). Evidence: no H9 halt was raised in D57-D83; the guarded-kill and wrapper-gating tests pass inside PG1 `fail 0` (killer ancestry guard test at `.skilled/hooks/session-relaunch/tests/killer.test.cjs:393`, wrapper `SKILLED_LOOP_ID` gating in `skilled-loop.test.cjs`).
- [x] CHK-031 [P0] The killer's ancestry guard is asserted by a named test before any `AUTO` adapter ships (plan section 9 killer bullets). Evidence: `.skilled/hooks/session-relaunch/tests/killer.test.cjs:393` asserts the descendant-only guard and shipped in phase 001 (ledger D11), before the Codex and Hermes adapters (D64-D66); PG1 keeps it green.
- [x] CHK-032 [P1] No worker probed its own runtime; the lane 3.1 assignments held (SWE on Codex, Cursor, Hermes; Luna on Devin). Evidence: SPIKE-codex.md and SPIKE-cursor-hermes.md are SWE captures (D57, D58) and SPIKE-devin.md is the Luna probe (D62); the assignment split is recorded in plan.md and held in the ledger.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md, plan.md and tasks.md stay synchronized with the landed work. Evidence: the operator-approved out-of-scope amendment landed in spec.md (D80, run-ledger.md:280); this lane reconciled tasks.md and acceptance-criteria.md against the D57-D83 ledger and PG rows.
- [x] CHK-041 [P1] Every phase doc passes `validate_document.py` with the mode's `--type` (plan section 11 item 6). Evidence: PG6 `validate_document.py` rc=0 on 9/9 lane 3.6 docs plus the concern README, 0 issues; hvr_scan 0 new hard blockers (run-ledger.md:296).
- [x] CHK-042 [P2] Catalog files pass `check_no_hyphenated_catalog_content.py` and the playbook passes `validate-playbook-package.cjs` (plan section 11 item 6). Evidence: PG6 records the catalog hyphen check rc=0 and `validate-playbook-package.cjs` rc=0 with one pre-existing WARN elsewhere (run-ledger.md:296; D78).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Spike captures and evidence live under `scratch/` only. Evidence: the three spike reports sit at `003-command-trigger-runtimes/scratch/spike/SPIKE-codex.md`, `SPIKE-cursor-hermes.md` and `SPIKE-devin.md`; PG8 maps all 84 changed paths outside `specs/` to lane families with no stray capture files (run-ledger.md:298).
- [x] CHK-051 [P1] `git status --porcelain` minus baseline equals the union of the lane file lists (plan section 11 item 8). Evidence: PG8 scope receipt: 84 changed paths outside `specs/`, every one mapped to a lane family (run-ledger.md:298).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 17 | 15/17 |
| P2 Items | 3 | 3/3 |

Two items stay unticked. CHK-012 is partly met: the D68 SWE mirror diff had no Luna read-only review after the Luna quota halt, and the orchestrator `sync-prompts-hermes --check` PASS 38 stands in (run-ledger.md:298). CHK-141 is partly met: automatable playbook checks ran inside PG1 and every runtime row has a recorded result, but the four live checks were not executed because spec.md assigns them to phase 004 lane 4.5 (PG7, run-ledger.md:297).

**Verification Date**: 2026-10-17
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P1] The spike verdict model and the three ADRs are recorded in plan.md (AUTO gating, command baseline, probe assignment). Evidence: plan.md records the verdict matrix model and the three decisions, and the outcomes match the landed verdicts (Codex and Hermes AUTO; Cursor and Devin COMMAND-ONLY) at run-ledger D57, D58 and D62.
- [x] CHK-101 [P2] Each ADR carries a status and rejected alternatives. Evidence: plan.md's ADR entries carry status and rejected-alternative fields, including the probe-assignment ADR whose Luna lane was later quota-deferred (run-ledger D74, D75).
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

No performance targets apply to this phase. The only timing behavior is inherited: adapters stay async and advisory, and the killer gives up after 30 s (plan sections 1 and 6).
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

No deployment exists in this phase. Rollback is covered by plan.md section 7: remove the added arms, adapters, rows and mirrors, then rerun both sync CLIs.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Comment hygiene scan: no spec paths or ids appear in new code comments (plan section 10). Evidence: PG4 comment-hygiene scan 0 hits on new code (run-ledger.md:294).
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All four packet docs pass `validate.sh <this folder> --strict` with `RESULT: PASSED` (plan section 11 item 9). Evidence: the strict validator reports `RESULT: PASSED` for this packet (this lane's verification run, run-ledger PG row 9 analogue).
- [x] CHK-141 [P1] Playbook scenarios for every runtime are executed and results recorded in `implementation-summary.md` (plan section 11 item 7). The four automatable checks ran inside PG1. The live checks ran in phase 004 lane 4.5, as spec.md assigns: Codex PASS (run 6, two hops to done) and Devin PASS (swe-2-max, note open -> claimed -> done); Hermes and Cursor SKIP by operator decision (D7). Recorded at `session-relaunch-command-runtimes.md:96-101` and `../scratch/closure-evidence.md:19-24`.
- [x] CHK-142 [P2] Each child acceptance-criteria row is marked with evidence and each child goal criterion is checked (plan section 11 item 9). Evidence: AC-001 to AC-005 are Met with observed evidence in `acceptance-criteria.md`; all five goal.md completion criteria are checked with log evidence.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Orchestrator (Claude) | Gate PG owner | [x] Approved (gate PG ran from the final state, run-ledger.md:290-299) | 2026-10-17 |
| SWE | Build reviewer | [x] Approved (final review PASS at D83; earlier PASS reviews D67, D72, D73, D77, D79) | 2026-10-17 |
| Luna | Test and docs author | [ ] Approved (quota-exhausted; D68 mirror review stands in via orchestrator check, docs reassigned to SWE at D78) | - |
<!-- /ANCHOR:sign-off -->

