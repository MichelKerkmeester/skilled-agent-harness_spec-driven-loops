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

- [ ] T001 Confirm the baseline captured during phase 003's setup exists. Its capture must precede phase 003's first edit (REQ-001)
- [ ] T002 Confirm the baseline run used the same cases, rubric and scoring procedure the after-run will use, by reading both run manifests field by field (REQ-001)
- [ ] T003 [P] Confirm the frozen case set covers each adopted rule's named failure. It also carries control cases no adopted rule covers (REQ-001)
- [ ] T004 [P] Confirm the frozen rubric carries weighted dimensions plus a blocking class. Nothing in it names a condition to the judge (REQ-003)
- [ ] T005 [P] Record the change-kind row shape phase 004's accept record exposes, including its no-op value. The phase stops if the field is absent (REQ-002)
- [ ] T006 [P] Record the provider field every run reads, so each later row can be attributed to the provider that produced it (REQ-002)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T007 Build the runner under `.opencode/skills/sk-communication/benchmark/`. It refuses a malformed case set rather than skipping it (REQ-001)
- [ ] T008 Build the negative control: a case the adopted rules should not affect, whose score must not move (REQ-003)
- [ ] T009 Run the negative control first and confirm the control case's score does not move between conditions (REQ-003)
- [ ] T010 Run both conditions and write one result file per condition, with the provider recorded on every row (REQ-002)
- [ ] T011 Separate no-op rows from rewrite rows using the change-kind field. No-op rows are reported apart from the rule delta (REQ-002)
- [ ] T012 Record the per-dimension delta, including the dimensions that did not move (REQ-002)
- [ ] T013 State the release gate in terms this repository can observe. Name the powered blind human study condition as a gap. Every observable condition names the command or artifact behind it (REQ-004)
- [ ] T014 Add the persistence mechanism as opt-in and fail-open, only if phase 002's allocation names one (REQ-006)
- [ ] T015 Regenerate every runtime surface derived from the repository root doc, including the generated section of `.codex/AGENTS.md` (REQ-005)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Break the mechanism's flag deliberately and confirm the session still starts at exit zero (REQ-006)
- [ ] T017 Compare each regenerated section against its source and confirm they match (REQ-005)
- [ ] T018 Run `validate.sh --recursive --strict` on the parent and require an explicit PASSED line for the parent and every child folder it carries (REQ-007)
- [ ] T019 Reconcile completion metadata across the parent and all its child folders (REQ-007)
- [ ] T020 Confirm no measured regression stands unfixed or unwaived (REQ-008)
- [ ] T021 Confirm no completion claim states that the unobservable human-study condition was met (REQ-004)
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
