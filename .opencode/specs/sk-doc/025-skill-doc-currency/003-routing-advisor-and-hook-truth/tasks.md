---
title: "Tasks: routing-advisor-and-hook-truth"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "advisor hook tasks"
  - "gate policy task"
  - "fail open reproduction"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/025-skill-doc-currency/003-routing-advisor-and-hook-truth"
    last_updated_at: "2026-08-02T13:01:10.000Z"
    last_updated_by: "track-e-spec-author"
    recent_action: "Authored task breakdown"
    next_safe_action: "Execute T001"
    blockers:
      - "Soft-blocked on the canon rulings in the sibling canon phase"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "pending-first-save"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: routing-advisor-and-hook-truth

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

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

- [x] T001 Confirm every scope item against HEAD before any edit. Produce a per-ID table with one of: confirmed / stale-finding / already-fixed. **A finding is a hypothesis until this table says otherwise.** Order matters here: **confirm the four hook-topology findings (`RE-003-01`, `RE-003-02`, `RE-007-02`, `RE-007-07`) first** — the hook trees were reorganised twice in recent packets and this is the least stable surface in the program. Re-verify flags: the four `§` registry-supplementary items (`RE-006-04`, `-05`, `-06`, `-09`) arrived through a dedupe collision and were never independently checked; each needs its own evidence line and **batch-editing them is forbidden** [evidence: `implementation-summary.md`]
- [x] T002 [P] Capture the advisor validation output verbatim, before any edit (`<packet>/baselines/`) [evidence: `implementation-summary.md`]
- [x] T003 [P] Capture the CLI offline smoke output verbatim, before any edit (`<packet>/baselines/`) [evidence: `implementation-summary.md`]
- [x] T004 [P] Capture the document-validator blocking-error count for the six non-conformant references, before any edit (`<packet>/baselines/`) [evidence: `implementation-summary.md`]
- [x] T005 [P] Record the runtime hook configuration as it stands, before any registration edit (`<packet>/baselines/`) [evidence: `implementation-summary.md`]
- [x] T006 Cite the fleet-gate re-baseline captured by the first phase. **No no-regression claim in this phase may cite a remembered pass count** — `REQ-013` [evidence: `implementation-summary.md`]
- [x] T007 § **Reproduce the fail-open path** that the safety claim depends on: demonstrate that the pre-push check permits a push when its validator is missing or broken, in a scratch clone. If it cannot be reproduced, record the claim as refuted and do not edit the document on assumption — `RE-006-06` [evidence: `implementation-summary.md`]
- [x] T008 Rule DR-6: is the advisor gate an absolute floor, or a bounded delta from a dated snapshot? **No threshold edit starts before this** (`decision-record.md`) — **[OPERATOR-DECISION: DR-6]** [evidence: `implementation-summary.md`]
- [x] T009 Build the path-existence assertion over every hook source path, registration and smoke command in both hook references and the runtime configurations. **Both directions: a registration pointing at nothing and a live adapter nobody documents are both failures.** An unreadable configuration is a failure, not a pass — `REQ-003` [evidence: `implementation-summary.md`]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — the advisor gate

- [x] T010 Rewrite the gate statement under the DR-6 ruling, carrying the snapshot's capture date alongside every threshold. Blocked on T008 (`system-skill-advisor/references/scoring/validation-baselines.md`) — `RE-007-01`, **[OPERATOR-DECISION: DR-6]** [evidence: `implementation-summary.md`]
- [x] T011 [P] Turn any threshold restatement in the tuning reference into a link to the ruled statement (`system-skill-advisor/references/scoring/lane-weight-tuning.md`) — `RE-007-01` companion surface [evidence: `implementation-summary.md`]

### Lane B — hook topology

- [x] T012 Correct adapter source paths, smoke commands and the runtime roster; add the live adapter the reference omits (`system-skill-advisor/references/hooks/skill-advisor-hook.md`) — `RE-007-02` [evidence: `implementation-summary.md`]
- [x] T013 Match the integration inventory to the adapters that exist (`system-skill-advisor/SKILL.md`) — `RE-007-07` [evidence: `implementation-summary.md`]
- [x] T014 Correct the mirror-image defect: the absent adapter path, the absent settings file, and the omitted registered lifecycle adapter (`system-spec-kit/references/config/hook-system.md`) — `RE-003-01` [evidence: `implementation-summary.md`]
- [x] T015 Make the runtime instructions runnable against files that exist (`system-spec-kit/references/hooks/skill-advisor-hook.md`) — `RE-003-02` [evidence: `implementation-summary.md`]
- [x] T016 [P] Complete the runtime inventory in the root README (`system-spec-kit/README.md`) — `RE-003-04` [evidence: `implementation-summary.md`]
- [x] T017 § Repoint the runtime hook registration and the adapter README at the maintained adapter, or restore the missing proxy. **Restoration is a behaviour change and must be raised separately, not folded into a documentation edit** (`.cursor/hooks.json`, `sk-git/scripts/hooks/README.md`) — `RE-006-04` [evidence: `implementation-summary.md`]
- [x] T018 § Correct the adapter README's return contract to name the channel the extension's own code says is visible (`sk-git/scripts/hooks/pi/README.md`) — `RE-006-05` [evidence: `implementation-summary.md`]
- [x] T019 Document the installation-drift check command and make the project-versus-user-global distinction explicit. **Documentation only — do not run a repair against the global installation** (`system-spec-kit/references/config/hook-system.md`) — `RE-003-07`, **[OPERATOR-DECISION: Q4 — Codex hook drift]** [evidence: `implementation-summary.md`]

### Lane C — safety and policy-document honesty

- [x] T020 § State the fail-open limitation prominently and distinguish advisory enforcement from guaranteed enforcement. **The hook's failure mode is not changed by this phase.** Blocked on T007 (`sk-git/references/remote-branch-policy.md`) — `RE-006-06` [evidence: `implementation-summary.md`]
- [x] T021 § In the same file and the same edit, replace the packet-history citations with stable source paths and feature names, per the evergreen authoring rule (`sk-git/references/remote-branch-policy.md`) — `RE-006-09`. **Co-located deliberately: one file, one owner, one edit** [evidence: `implementation-summary.md`]

### Lane D — self-description, rosters and counts

- [x] T022 [P] State the stale-index behaviour once, matching what the code actually returns; remove the contradicting sentence (`system-skill-advisor/README.md`) — `RE-007-03` [evidence: `implementation-summary.md`]
- [x] T023 [P] Single-source the public tool count and repair the broken related link (`system-skill-advisor/references/runtime/tool-ids-reference.md`) — `RE-007-11` [evidence: `implementation-summary.md`]
- [x] T024 [P] Move the timeout-flag documentation to the hub whose code holds the live consumers; leave a pointer at most in the sibling (`system-skill-advisor/`) — `RE-007-12` [evidence: `implementation-summary.md`]
- [x] T025 Single-source the CLI tool counts from one constant; update the reference, the smoke check and the test together, or make all three read that constant (`system-spec-kit/references/cli/daemon-cli-reference.md`) — `RE-008-06` [evidence: `implementation-summary.md`]
- [x] T026 [P] Add the active model routes the runtime contract omits (`sk-prompt/sk-prompt-models/SKILL.md`) — `RE-007-04` [evidence: `implementation-summary.md`]
- [x] T027 Make the leaf router able to resolve every model with an authored profile; generate or CI-verify the rows against the profile data (`sk-prompt/shared/references/smart-routing.md`) — `RE-007-05` [evidence: `implementation-summary.md`]
- [x] T028 [P] Match the iteration cap to the contract the rule cites as its source (`sk-prompt/sk-prompt-improve/SKILL.md`) — `RE-007-06` [evidence: `implementation-summary.md`]
- [x] T029 [P] Refresh the hub README's model roster from the profile data (`sk-prompt/README.md`) — `RE-007-08` [evidence: `implementation-summary.md`]
- [x] T030 [P] Add the missing models to the packet README's orientation (`sk-prompt/sk-prompt-models/README.md`) — `RE-007-09` [evidence: `implementation-summary.md`]

### Lane E — structure, last

- [x] T031 Restructure the six non-conformant references under the canon phase's ruling. Blocked on that ruling (`sk-prompt/**`) — `RE-007-10` [evidence: `implementation-summary.md`]
- [x] T032 Restore the numbered structure in the auto-mode contract, moving provenance content after numbered content. Blocked on the same ruling (`system-spec-kit/references/workflows/auto-mode-contract.md`) — `RE-003-05` [evidence: `implementation-summary.md`]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T033 Run the path-existence assertion; zero unresolvable in both directions; report the number of paths checked so a vacuous pass is visible [evidence: `implementation-summary.md`]
- [x] T034 Run the roster assertion; every model with an authored profile resolves, or is excluded by an explicit marker [evidence: `implementation-summary.md`]
- [x] T035 Re-run the advisor validation; report the delta against T002 [evidence: `implementation-summary.md`]
- [x] T036 Re-run the CLI smoke check; report the delta against T003 [evidence: `implementation-summary.md`]
- [x] T037 Re-run the document validator over the six references; report the delta against T004; zero blocking errors [evidence: `implementation-summary.md`]
- [x] T038 Confirm no file outside the repository was written at any point in this phase [evidence: `implementation-summary.md`]
- [x] T039 Confirm every one of the 22 scope items reached exactly one terminal state, each supplementary item with its own evidence line [evidence: `implementation-summary.md`]
- [x] T040 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` → Errors: 0 [evidence: `implementation-summary.md`]
<!-- /ANCHOR:phase-3 -->

## Execution Receipts

| Tasks | Evidence |
|---|---|
| T001 | The hook-topology group was confirmed first. The 22-ID disposition table is in `implementation-summary.md`; 21 findings were confirmed and RE-007-11 was recorded as drifted with its live count defect retained. |
| T002–T005 | Verbatim pre-edit receipts are in `baselines/`: advisor validation exit 75, CLI smoke exit 1, six document-validator blocking errors, and the pre-edit Cursor registration. |
| T006 | The first phase task receipt records the supplied fleet re-baseline as 11/11 clean; no phase claim uses a remembered pass count. |
| T007 | `bash .opencode/scripts/git-hooks/tests/pre-push.test.sh` reproduced the broken-validator fail-open case and returned `PASS=21 FAIL=0`. |
| T008–T011 | DR-6 is Accepted in `decision-record.md`; the gate is a dated bounded delta and the tuning guide links to it. |
| T009, T012–T019 | `baselines/hook-path-assertion.cjs` passed with 10 live adapter/bridge paths, 55 registered command paths, five adversarial cases and zero failures. |
| T020–T021 | `remote-branch-policy.md` now states the fail-open limitation prominently and uses stable source paths; the pre-push source diff is empty. |
| T022–T032 | Advisor stale behavior, tool count, timeout ownership, model routes, Composer router signal, three-cycle cap, six reference overviews and auto-mode numbering are corrected in the named files. |
| T033–T034 | Path assertion and profile/router assertion both passed; the latter checked six active authored profiles and resolved Composer-2.5. |
| T035 | Post-edit warm-only advisor validation returned the same recorded exit 75/backend-unavailable result as T002; no metric delta is claimable while the daemon is unavailable. |
| T036 | Post-edit CLI smoke returned rc 0 with spec-memory 41/41 and skill-advisor 9/9 in both cwd scenarios; delta against T003 is expectedCount 39→41, live count 41 unchanged, rc 1→0. |
| T037 | All six reference validators returned rc 0 with zero issues; delta against T004 is blocking errors 6→0. |
| T038–T039 | Only repository-scoped artifacts remain; transient assertion directories were removed. All 22 items have exactly one repaired terminal state, with independent evidence lines for RE-006-04, RE-006-05, RE-006-06 and RE-006-09. |
| T040 | Final command returned rc 0 with Errors: 0 and Warnings: 0; full output is the strict validation receipt for this child. |

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` [evidence: `implementation-summary.md`]
- [x] No `[B]` blocked tasks remaining [evidence: `implementation-summary.md`]
- [x] Manual verification passed [evidence: `implementation-summary.md`]
- [x] Every live number reported as a delta against a recorded capture [evidence: `implementation-summary.md`]
- [x] The safety claim was reproduced before it was edited, or recorded as refuted [evidence: `implementation-summary.md`]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` — scaffolded at copy time, populated by T008
<!-- /ANCHOR:cross-refs -->
