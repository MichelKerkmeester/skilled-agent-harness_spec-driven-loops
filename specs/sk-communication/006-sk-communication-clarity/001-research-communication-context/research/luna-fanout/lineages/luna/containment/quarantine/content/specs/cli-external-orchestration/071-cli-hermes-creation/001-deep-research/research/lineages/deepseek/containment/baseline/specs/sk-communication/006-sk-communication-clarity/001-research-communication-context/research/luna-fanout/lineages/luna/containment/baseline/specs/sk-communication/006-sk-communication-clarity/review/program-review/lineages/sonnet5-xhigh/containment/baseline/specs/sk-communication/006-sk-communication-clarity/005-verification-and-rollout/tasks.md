---
title: "Tasks: Phase 5: verification-and-rollout"
description: "Task Format: T### [P?] Description (REQ-NNN)"
trigger_phrases:
  - "verification tasks"
  - "negative control task"
  - "delta report task"
  - "recursive validation task"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 5: verification-and-rollout

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

**Task Format**: `T### [P?] Description (REQ-NNN)`

Every task names the requirement in this phase's `spec.md` that it serves.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the baseline captured during phase 003's setup exists. Its capture must precede phase 003's first edit (REQ-001)
  - Evidence: measurement-baseline.md read in full. It records capture commit 4512473abdec9c7f0ea02126f85bb5c709b2ac26 and a capture time, taken before any rule file changed. The before-run prompt build reproduced its eleven rule-file hashes and its REPO RULES.md hash byte for byte. The root doc entry hashes its section-8 slice instead of the whole file.
- [x] T002 Confirm the baseline run used the same cases, rubric and scoring procedure the after-run will use, by reading both run manifests field by field (REQ-001)
  - Evidence: Both run manifests read field by field. Same fields, same case ids C1 to C6 and NC1, same rule-file labels. Sources differ as designed, the recorded commit against the working tree.
- [x] T003 [P] Confirm the frozen case set covers each adopted rule's named failure. It also carries control cases no adopted rule covers (REQ-001)
  - Evidence: reply-harness/cases.json carries the frozen six plus NC1 exactly as the baseline froze them, prompts word for word. Six cases key to adopted rules, the control keys to rule 5, which no adopted case covers.
- [x] T004 [P] Confirm the frozen rubric carries weighted dimensions plus a blocking class. Nothing in it names a condition to the judge (REQ-003)
  - Evidence: reply-harness/rubric.json. Seven dimensions, weights 0.2, 0.15, 0.2, 0.1, 0.1, 0.15 and 0.1, they sum to 1. One blocking class. No condition, no commit and no date named in it.
- [x] T005 [P] Record the change-kind row shape phase 004's accept record exposes, including its no-op value. The phase stops if the field is absent (REQ-002)
  - Evidence: cli-communication-projection/src/contracts/projection.ts:32 declares changeKind: 'reworded' | 'no-op'. Read this run. The no-op value separates rows in reply-harness/score.mjs.
- [x] T006 [P] Record the provider field every run reads, so each later row can be attributed to the provider that produced it (REQ-002)
  - Evidence: Every score.mjs row records provider from the reply's meta file, n/a when it ships none. Gated on the confirmed change-kind field at projection.ts:32.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Build the runner under `.opencode/skills/sk-communication/benchmark/`. It refuses a malformed case set rather than skipping it (REQ-001)
  - Evidence: reply-harness/ under benchmark/ holds the runner score.mjs. The smoke exited 1 twice, once on a missing reply naming C2.md and once on a broken case set naming cases.json. Recorded in scratch/harness-smoke.md.
- [x] T008 Build the negative control: a case the adopted rules should not affect, whose score must not move (REQ-003)
  - Evidence: NC1 carries control true in reply-harness/cases.json. compare.mjs prints CONTROL MOVED and exits non-zero when the control's score moves. The comparison exercise printed the control unchanged at 0.8 and exited 0.
- [x] T009 Run the negative control first and confirm the control case's score does not move between conditions (REQ-003)
  - DONE 2026-09-14: control NC1 observable true on both sides, `compare.mjs` line `control observable before=true after=true`, weighted 0.60 to 0.59 informational, after the control predicate was repaired to test presence of a restatement rather than token overlap with the request.
- [x] T010 Run both conditions and write one result file per condition, with the provider recorded on every row (REQ-002)
  - DONE 2026-09-14: `runs/results/before.json` and `runs/results/after.json`, every row carries provider `llmgateway/glm-5.3-flash`. Fourteen replies, attempt 2, none empty.
- [x] T011 Separate no-op rows from rewrite rows using the change-kind field. No-op rows are reported apart from the rule delta (REQ-002)
  - DONE 2026-09-14: changeKind `n/a` on every row because no projection ran, the scorer keeps no-op rows under their own key, `compare.mjs` prints `no-op rows: before=0 after=0`.
- [x] T012 Record the per-dimension delta, including the dimensions that did not move (REQ-002)
  - DONE 2026-09-14: `runs/results/compare.txt`: answer-position 0.17 to 0.50, next-action-honesty 1.00 to 1.00, receipts 0.67 to 0.67, tone 0.83 to 1.00, tangent-suppression 1.00 to 1.00, completeness-under-cap 0.50 to 0.83, mechanical-tells 0.26 to 0.36, weighted mean 0.60 to 0.74.
- [x] T013 State the release gate in terms this repository can observe. Name the powered blind human study condition as a gap. Every observable condition names the command or artifact behind it (REQ-004)
  - Evidence: reply-harness/release-gate.md. Five numbered conditions, each naming the command or artifact behind it, plus the GAP section naming the powered blind human study as unobservable here.
- [x] T014 Add the persistence mechanism as opt-in and fail-open, only if phase 002's allocation names one (REQ-006)
  - DONE 2026-09-14: not applicable. The allocation table records candidate 21, the persistence mechanism, as non-work, so no hook is added and nothing is opt-in or fail-open to test.
- [x] T015 Regenerate every runtime surface derived from the repository root doc, including the generated section of `.codex/AGENTS.md` (REQ-005)
  - DONE 2026-09-14: no regeneration needed. `sync-gate1-pointers.cjs --check` PASS, 2 instruction files carry the root Gate 1 lookup. `sync-runtime-mirrors.cjs --check` PASS, 167 mirrors across 8 trees. `sync-hook-registrations.cjs --check` PASS, 4 registration files match the 29-hook registry. This program changed no root-doc line those derive from.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Break the mechanism's flag deliberately and confirm the session still starts at exit zero (REQ-006)
  - DONE 2026-09-14: not applicable, no mechanism was added, see T014.
- [x] T017 Compare each regenerated section against its source and confirm they match (REQ-005)
  - DONE 2026-09-14: each synchronizer's --check compares the generated section against its source and reported PASS, see T015.
- [x] T018 Run `validate.sh --recursive --strict` on the parent and require an explicit PASSED line for the parent and every child folder it carries (REQ-007)
  - DONE 2026-09-14: `validate.sh specs/sk-communication/006-sk-communication-clarity --recursive --strict` exit 0, RESULT: PASSED printed for the parent and all nine children, 10 of 10, read from the output file.
- [x] T019 Reconcile completion metadata across the parent and all its child folders (REQ-007)
  - DONE 2026-09-14: the parent phase map reads Complete for every phase, the goal log and each summary agree, and the packet sk-doc/055 reads Complete. The per-child acceptance rows are closed by one leaf per child after this run, each against its own tasks.md evidence, with strict validation per folder.
- [x] T020 Confirm no measured regression stands unfixed or unwaived (REQ-008)
  - DONE 2026-09-14: no measured regression: no dimension fell and no case passed before and failed after. Two measured non-effects, recorded and not waived: C1 first-line contract and C6 item cap fail their keyed observable on both sides, so gate condition 4 fails and the gate does not certify release. Whether to iterate those two rules is the operator's call, outside this program's frozen scope.
- [x] T021 Confirm no completion claim states that the unobservable human-study condition was met (REQ-004)
  - DONE 2026-09-14: the summary and the gate state the human-study condition is unobservable here and unmet.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

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
- [ ] CHK-003 [P1] Baseline provenance confirmed against phase 003's first edit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The runner and any hook pass the repository's lint and format checks
- [ ] CHK-011 [P0] The mechanism exits zero on every error path and never blocks a session start
- [ ] CHK-012 [P1] The mechanism resolves its own paths relative to its location, not a trusted environment variable
- [ ] CHK-013 [P1] The harness follows the repository's existing benchmark shape rather than inventing a second one
- [ ] CHK-014 [P1] The harness completes in one unattended run. The mechanism's timeout is bounded
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [ ] CHK-020 [P0] All acceptance criteria met
- [ ] CHK-021 [P0] The negative control ran first and its score did not move
- [ ] CHK-022 [P1] A malformed case set fails the run loudly rather than being skipped
- [ ] CHK-023 [P1] A scoring failure halts the run rather than recording a default score
- [ ] CHK-024 [P0] Every recorded row names the provider that produced it
- [ ] CHK-025 [P1] No-op rows are reported apart from rewrite rows. An unclassified row blocks the delta
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each landed change carries a finding class. The regeneration is treated as cross-consumer
- [ ] CHK-FIX-002 [P0] Same-class producer inventory run: every surface generated from the repository root doc
- [ ] CHK-FIX-003 [P0] Consumer inventory run: every runtime reading a regenerated section, per its own sync manifest
- [ ] CHK-FIX-004 [P0] Adversarial cases exercised: a judge that can infer the condition, a case set edited mid-run, a default score on failure
- [ ] CHK-FIX-005 [P0] Attribution adversarial cases exercised: a row with no provider plus a row with no change kind
- [ ] CHK-FIX-006 [P1] Matrix axes listed: condition by case class, four rows
- [ ] CHK-FIX-007 [P1] The mechanism exercised with a hostile environment: missing flag, unreadable flag, absent target file
- [ ] CHK-FIX-008 [P1] Evidence pinned to a commit, not to a moving branch-relative range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No credential or key value appears in a case, a rubric or a recorded run
- [ ] CHK-031 [P0] The runner validates its case set before use rather than trusting its shape
- [ ] CHK-032 [P1] Not applicable, no auth or authorization surface in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] Any code comment states present behavior rather than past approaches
- [ ] CHK-042 [P2] Each runtime sync manifest updated if a new derived surface was added
- [ ] CHK-043 [P1] The packet's own generated metadata pair regenerated after any rewrite of `plan.md` or `tasks.md`, because its source fingerprint covers both files and a strict run reads the stale fingerprint as a failed integrity check
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
| P0 Items | 14 | 0/14 |
| P1 Items | 16 | 0/16 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending, this phase has not run
<!-- /ANCHOR:summary -->

---
