---
title: "Tasks: Phase 29: relaunch-evidence-gaps-and-playbook-drift"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "relaunch evidence gaps tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 29: relaunch-evidence-gaps-and-playbook-drift

<!-- SPECKIT_LEVEL: 2 -->

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
## Phase 1: Setup

- [x] T001 Baseline: run the relaunch gate and record the totals (806 of 806, exit 0, `scratch/baseline-relaunch-gate.tap` and `.exit`)
- [x] T002 Clear leftover hand-over records and tmux sessions from earlier runs (no tmux server was running; every live run used a private tmux socket and a private `XDG_RUNTIME_DIR`, so no shared record was read or written)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Rerun the Codex withdraw scenario with a wait sized to the reply and save the transcript (`scratch/codex-cx2/run-1/`, `run-2/`: replies after 64 s and 31 s, both quoted the notice and the extra nudge)
- [x] T004 Rerun the Claude extra-nudge scenario several times, count first-attempt successes and trace the producer if it fails (`scratch/claude-cl3/` 0 of 7 first-attempt deliveries with `echo staying`, `scratch/claude-cl3-slow/` 3 of 3 with `sleep 3; echo staying`, `scratch/claude-cl3/staleness-report.txt` names the producer)
- [x] T005 If a producer is found, write the failing test first and fix it at the source (`.skilled/hooks/session-relaunch/`): not done by instruction. The build brief bars edits to the relaunch hook code, so the producer is recorded as a follow-up in `implementation-summary.md`, and no code changed (`git diff -- .skilled/hooks/session-relaunch .skilled/bin` is empty)
- [x] T006 Run the Pi adapter and extension suites and record the totals (`scratch/pi/vitest-baseline.txt` 52 of 52 on 2026-10-24; the extension load smoke is SKIP, `scratch/pi/extension-smoke.txt` holds the provider's 402 billing error)
- [x] T007 Run the OpenCode import smoke and the shim suite, then correct the two playbook lines to the printed output (`session-relaunch-pi-opencode.md`; `scratch/playbook-drift/import-smoke.txt` printed `object` twice, `shim-run-1.tap` and `shim-run-2.tap` reported 18 tests, and the same 16 sat in two sibling playbooks, fixed too)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun the relaunch gate and report the delta against the baseline (806 of 806, exit 0, delta 0, `scratch/final-relaunch-gate.tap`)
- [x] T009 Run the sk-doc validators on each changed playbook and `validate.sh --strict` on this folder (`validate_document.py` 0 issues on each of the three playbooks, `validate-playbook-package.cjs` PASS with 0 violations; `validate.sh --strict` result in `implementation-summary.md`)
- [x] T010 Confirm no hand-over record or tmux session remains (10 records in the private runtime directories, 3 were left armed or pending by the model and were cancelled with `cancel --loop-id`, all 10 read `disarmed`; no tmux server or `ev029` socket remains)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md (evidence: spec.md sections 1 to 5 hold the requirements)
- [x] CHK-002 [P0] Technical approach defined in plan.md (evidence: plan.md sections 1 to 3 hold the approach)
- [x] CHK-003 [P1] Codex and Claude credentials available, or the rerun recorded as SKIP (evidence: `codex login status` printed `Logged in using ChatGPT` and `claude auth status` printed `loggedIn: true`; Pi's provider was out of quota, recorded as SKIP in `scratch/pi/extension-smoke.txt`)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Any changed code file passes `node --check`, and playbook snippets run under bash and zsh (evidence: no code file changed; the one new playbook loop passes `bash -n` and `zsh -n` and matches the real Codex pane in `scratch/codex-cx2/run-1/pane-final.txt`)
- [x] CHK-011 [P0] No console errors or warnings in the suite output (evidence: `scratch/final-relaunch-gate.tap` shows 806 pass, 0 fail, 0 cancelled, 0 skipped)
- [x] CHK-012 [P1] Error handling implemented, and a failed step never blocks a session start (evidence: no code changed, so there is no new error path; the withdraw and nudge hooks kept their fail-open behavior in 10 live runs)
- [x] CHK-013 [P1] Code follows project patterns and carries no artifact ids in comments (evidence: no code or code comment was added; the harness files under `scratch/harness/` carry no artifact ids)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (see acceptance-criteria.md) (evidence: every row of `acceptance-criteria.md` reads Met with evidence)
- [x] CHK-021 [P0] The relaunch gate passes in the final state, delta against the baseline reported (evidence: 806 of 806 before (`scratch/baseline-relaunch-gate.tap`) and after (`scratch/final-relaunch-gate.tap`), delta 0, Pi vitest 52 of 52 both times)
- [x] CHK-022 [P1] Edge cases tested (evidence: slow-tool control (3 of 3 first-attempt deliveries) against the instant tool (0 of 7); a reply 1 s past the old 30 s wait (31 s run))
- [x] CHK-023 [P1] Error scenarios validated (evidence: Pi extension smoke blocked by a provider 402, recorded as SKIP with the exact error; three runs that left a record armed or pending were cancelled and read `disarmed`)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence` or `test-isolation`. (evidence: the Claude retry is `class-of-bug` (every nudge read from a lagging transcript), the two playbook lines are `instance-only` doc drift, the Codex wait is `matrix/evidence`)
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. (evidence: `rg -n "all 16 tests|16 tests"` found the shim count in three playbooks (all fixed) and `rg -n "typeof m.default"` found one more stale claim in a closed packet record, left as history)
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs and tests. (evidence: the playbook index and feature catalog name no shim count or smoke output (`rg` over both returned no line))
- [x] CHK-FIX-004 [P0] No path, parser or redaction change is in this phase unless the retry fix adds one, in which case adversarial table tests are added. (evidence: no path, parser or redaction change in this phase, since no retry fix was made)
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. (evidence: axes: runtime (Claude, Codex, Pi, OpenCode) by gap (four), 16 rows: Claude 10 runs, Codex 2 runs, Pi 2 runs (suite, smoke), OpenCode 2 runs (import smoke, shim suite))
- [x] CHK-FIX-006 [P1] Hostile env and global-state variant executed when tests or code read process-wide state. (evidence: the shim suite was rerun with the loop variables unset (`scratch/playbook-drift/shim-run-3-loop-vars-unset.tap`, 18 of 18); the live runs unset every loop and Claude session variable)
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or an explicit diff range, not a moving branch-relative range. (evidence: evidence is pinned to the worktree at the time of the runs, with Claude Code 2.1.310, Codex 0.164.0, Node v26.8.2 and worktree HEAD `93310073cd` with the relaunch hook code unchanged from it; no fix SHA exists because no fix was made)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets, and no credential or key read, logged or written (evidence: no credential was read, logged or written; the evidence scan found no key, token or account id)
- [x] CHK-031 [P0] Input validation implemented for every path and value read from a note or an environment variable (evidence: no input path or value is read from a note or an environment variable by new code, since there is none)
- [x] CHK-032 [P1] Auth and authz not applicable: the state files are local and keep their `0o700` directory mode (evidence: state files stayed in the private `XDG_RUNTIME_DIR` directories at mode 0700)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks synchronized (evidence: spec, plan, tasks, acceptance criteria and implementation summary all carry the same outcome)
- [x] CHK-041 [P1] Code comments carry the reason, with no artifact ids (evidence: no comment was added to any code)
- [x] CHK-042 [P2] Each changed playbook passes the sk-doc validators (evidence: `validate_document.py` 0 issues on each of the three playbooks and the package validator PASS)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files kept in the session scratchpad or scratch/ (evidence: temp files stayed under `scratch/` and the session scratchpad)
- [x] CHK-051 [P1] scratch/ holds only evidence this packet cites (evidence: `scratch/` holds the runs, tables and harness that `implementation-summary.md` cites)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-24
<!-- /ANCHOR:summary -->

---
