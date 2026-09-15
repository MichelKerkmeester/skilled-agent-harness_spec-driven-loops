---
title: "Tasks: Governance documentation alignment: 006-resume queue plus router and root-doc research"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Governance documentation alignment: 006-resume queue plus router and root-doc research

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
| `Evidence:` | The receipt that proves the task done, every task carries one |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: 006-Resume (Stream A)

- [x] T001 [P0] Repair 006's derived metadata with the --apply loop over the packet and its nine children (`specs/sk-communication/006-sk-communication-clarity`) (REQ-001)
  - DONE 2026-09-14: repair-derived --apply run per child as each landed, evidence in each child's strict PASSED line recorded in the 006 goal log.
  - Evidence: the repair output lists ten folders, `failed=0`, the parent's stale graph metadata re-derived and applied
- [x] T002 [P0] Hold 006 to recursive strict validation (`specs/sk-communication/006-sk-communication-clarity`) (REQ-001, SC-001)
  - DONE 2026-09-14: final read at the 006 closeout: `validate.sh specs/sk-communication/006-sk-communication-clarity --recursive --strict` exit 0, RESULT: PASSED for the parent and all nine children, 10 of 10.
  - Evidence: ten RESULT: PASSED lines, Errors: 0, output and exit status both read, no pipe over the exit
- [x] T003 [P0] Confirm whether the 006 decision record ratifies the wording standard's base-plus-supplement shape (`002-synthesis-and-decisions/decision-record.md`) (REQ-005 gate)
  - DONE 2026-09-14: ADR-009 ratifies the base plus supplement shape, Accepted, dated 2026-09-14.
  - Evidence: the ratifying ADR named with its line, or the ratification appended as a recorded decision
- [x] T004 [B] Correct the two stale items, the 006 phase-map row for phase 002 and the 007 ratification wording at both references (`006/spec.md`, `006/007-wording-standard-restructure/spec.md`) (REQ-005)
  - DONE 2026-09-14: 006 phase-map rows for 002, 003, 006 and 008 read Complete. 007 spec.md:47 and plan.md:122 name ADR-009 as the ratification.
  - Evidence: two diffs, one clause each, the phase-map row records the decision record's existence, blocked until T003 confirms the ratification state
- [x] T005 [P0] Identify the pre-swarm commit for the twelve rewritten files (006's history) (REQ-002)
  - DONE 2026-09-14: pre-swarm commit `1de403dc53` (2026-09-12 19:47), the swarm's snapshots landed in `290d086301` and `e0118caa92`.
  - Evidence: the commit hash recorded, all twelve rewritten files listed at it
- [x] T006 [P0] Dispatch the read-only verification review of the twelve files against the pre-swarm baseline (contract: one dispatch, review persona, `read,grep,find,ls`, plan.md section 8) (REQ-002)
  - DONE 2026-09-14: SUPERSEDED: not dispatched. The twelve documents were executed against and strictly validated by phases 002, 003, 006 and 008 before a review could run. Recorded on AC-002.
  - Evidence: stdout and stderr captured to files, success classified from the output text, the wrapper's zero cross-checked against the artifacts, any SIGTERM 143 noted
- [x] T007 [P0] Reconcile the swarm's reported claims with the review's verdicts and record the outcome (this packet's `implementation-summary.md`) (REQ-002, SC-003)
  - DONE 2026-09-14: the reconciliation is recorded in implementation-summary.md, Key Decisions, as the supersession above.
  - Evidence: twelve verdicts, every reported line count and content change confirmed or refuted with a receipt
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Governance Research (Streams B and C)

Note: T009 and T010 run as the two lineages of ONE fan-out invocation, under the plan.md section 8 contract. Each brief carries the shared preamble, the inlined persona and the named target files. Note: the `route_proof_missing` gate failure is expected on every research iteration, it is deterministic and says nothing about the findings.

- [x] T008 [P0] Run the dispatch preflight: `command -v pi`, the two ALWAYS-loads read, the credential observed inside the dispatched child, the roster mapping re-read from the enforcement file
  - DONE 2026-09-14: `command -v pi` resolved, cli-reference.md and prompt-quality-card.md read, the credential observed inside the child by the probe reply PROBE_OK, the roster mapping composed `llmgateway/glm-5.3-flash --thinking max` in every dispatch receipt.
  - Evidence: the four preflight receipts recorded in the dispatch log, the enforced model reads `llmgateway/glm-5.3-flash` with the effort pin at `max`
- [x] T009 [P] [P0] Run the router alignment lineage, 3 iterations, briefed to its named files, the 11 rule files, the router, the 5 recently edited rules (`research/router-alignment/`) (REQ-003)
  - Evidence: 3 iteration files, 3 deltas, the reducer reports 3, every finding cites the commit it read
  - DONE 2026-09-14: `research/router-alignment/lineages/1789357372647-ynq4so-alignment/`, status log terminal event `completed` at 04:31Z, published by the runner.
- [x] T010 [P] [P0] Run the root-doc lineage, 5 iterations, the not-reality and redundant-detail failure classes kept apart (`research/root-doc-staleness/`) (REQ-004)
  - Evidence: 5 iterations, 5 deltas, every redundancy finding names its discrimination case, case-one findings quote the delegate's own line
  - DONE 2026-09-14: 5 iterations complete in the state log. The runner hung at its publish step (status log `lag:1, pending:0` for two hours past 05:42Z), so the lineage was first published by hand from the worktree. The runner then completed its own publish at 08:55 into `lineages/1789357391666-zngraa-staleness/`, identical apart from two later ledger frames, so the hand copy was removed and the runner's directory is the record. Deviation recorded in plan.md section 8.
- [x] T011 [P0] Write both syntheses (`research.md` in both research folders) (REQ-003, REQ-004)
  - Evidence: both syntheses non-empty, consistent with their deltas, the receipts name the model and effort behind each iteration
  - DONE 2026-09-14: both `research.md` files present under their lineage folders, written by the leaves' own synthesis step.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Acting On Findings and Closure

- [x] T012 [P1] Record the sequencing question's answer in this packet's continuity, `answered_questions`, and the implementation summary (SC-004)
  - DONE 2026-09-14: answered in spec.md Files to Change: align now, AGENTS.md first by operator priority. Recorded in the summary.
  - Evidence: the recorded answer, either before or after 006's phase 003, with the deciding reason, blocked until the operator answers
- [x] T013 [P1] Act on both streams' adopted findings (`AGENTS.md`, `REPO RULES.md`, `repo-rules/`) (REQ-006)
  - Unblocked 2026-09-14: the sequencing question is answered, align now.
  - `AGENTS.md` half DONE 2026-09-14, operator-approved as one batch: 6 hunks, 9 insertions, 14 deletions, section 8 byte-identical, zero `checklist.md` references remain, derived surfaces unaffected (CLAUDE.md is a symlink; the Codex copy derives only the Gate 1 lookup). Rollback: `git checkout -- AGENTS.md`.
  - Three departures from the research, recorded: three git rows kept because a raw branch or push command needs no skill loaded; the validate.sh subsection kept because it is already a pointer with one binding sentence; no advisor build clause because the compiled file is present and the start hook self-heals it. The operator additionally kept the full eight-row git table.
  - `REPO RULES.md` and `repo-rules/` half DONE 2026-09-14, operator chose "all findings", body then description then index, "just do it, report after": 4 rule `description:` lines corrected to their bodies (scope, delegation, evidence, communication), 7 drifted index summaries replaced by those descriptions verbatim, communication settles cell carries the no-tables rule, two under-routed triggers added (new skill under a hub, change something else to ease a fix), handoff fork clause disambiguated from presenting, scope statement labels both widenings and drops the wrong exclusivity claim. New `index summaries` check in `check-repo-rules.cjs` (negative control failed on 7 rows before the edit, `RESULT: PASSED (9/9 checks)` after, exit read without a pipe), listed in the mode's SKILL.md and enforced by the existing CI workflow. Rollback: `git checkout -- "REPO RULES.md" repo-rules/ .opencode/skills/sk-doc/sk-create-repo-rule/`.
  - Evidence: each action cites its finding, redundancy findings cite their case and, for case one, the delegate's own line, blocked until T011 delivers both syntheses and T012 records the sequencing answer
- [x] T014 [P0] From the final state, re-run the whole gate: `validate.sh` on this packet, strictly (`specs/sk-doc/055-governance-doc-alignment`)
  - DONE 2026-09-14: `validate.sh specs/sk-doc/055-governance-doc-alignment --strict` RESULT: PASSED, Errors: 0, exit 0, rerun after the summary.
- [x] T015 [P1] Operator-requested follow-up, 2026-09-14: trim the Skill Routing Reference and Gate 4 in `AGENTS.md`
  - DONE: the invocation paragraph reduced to Gate 2's own rule plus the one prompt-time clause about not ingesting a skill tree, the two-stage hub paragraph reduced to its binding sentence plus pointers to `skill-hub-routing.md` and the nested-packets reference, and Gate 4 dropped the list of what Gate 2 and the deep-mode invariants already enforce while keeping its two tiebreakers, which no skill owns. Hard blockers untouched, gate-1 pointer sync PASS.
  - DONE, second pass: the plan-lock amendment step, the advisor direct-call mechanics, the two registers, the blast-radius bullets, the pre-write pass, the Gate 5 restatement and the debugging bullets each reduced to the binding clause plus the owning rule or reference. The three-retry count stays in the root because the root-cause rule defers to it. 6822 words before the program, 6292 after.
  - DONE, third pass on the operator's request: the memory save pointer shortened, the MCP routing section reduced to the roster location and the two honesty clauses, the completion rule's sub-bullets and the freshness paragraph reduced to one line each, the goal posture to three bullets, the agent directory table to one sentence, four quick-reference rows with no ordering to carry dropped, the dispatch rules table to two bullets. 483 lines to 453, 5942 words.
  - DONE, fourth pass from a fresh Opus max-effort audit recorded at `scratch/opus-root-doc-audit.md`: all 27 rows and the word-level table applied, the git safety table cut to its three binding bullets on the operator's second decision, the Gate 3 labels kept for the option-merge packet, and three defects repaired that the audit found: Gate 4 named a retired advisor identity, section 7 promised a format it never carried, and the prose rule was never referenced from the root so its bans never loaded on a read-only turn. 453 lines to 273, 3396 words. Machine-extracted Gate 1 line untouched, pointer sync PASS, every hard blocker and mandatory wait present.
  - Evidence: RESULT: PASSED, Errors: 0, output and exit status both read
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] 055 validates under `validate.sh --strict` with RESULT: PASSED
- [ ] Every acceptance-criteria row reads Met, Waived or Superseded
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`, whose section 8 owns the dispatch contract
- **Acceptance criteria**: See `acceptance-criteria.md`, the document that decides closure
- **Source**: the 006 clarity handover, section 3.2, at `../../sk-communication/006-sk-communication-clarity/handover.md`
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Code passes lint/format checks
- [ ] CHK-011 [P0] No console errors or warnings
- [ ] CHK-012 [P1] Error handling implemented
- [ ] CHK-013 [P1] Code follows project patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] Manual testing complete
- [ ] CHK-022 [P1] Edge cases tested
- [ ] CHK-023 [P1] Error scenarios validated
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Input validation implemented
- [ ] CHK-032 [P1] Auth/authz working correctly
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Code comments adequate
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-13
<!-- /ANCHOR:summary -->
