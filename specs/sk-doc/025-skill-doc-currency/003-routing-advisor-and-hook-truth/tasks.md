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
    last_updated_at: "2026-07-30T00:00:00Z"
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

- [ ] T001 Confirm every scope item against HEAD before any edit. Produce a per-ID table with one of: confirmed / stale-finding / already-fixed. **A finding is a hypothesis until this table says otherwise.** Order matters here: **confirm the four hook-topology findings (`RE-003-01`, `RE-003-02`, `RE-007-02`, `RE-007-07`) first** — the hook trees were reorganised twice in recent packets and this is the least stable surface in the program. Re-verify flags: the four `§` registry-supplementary items (`RE-006-04`, `-05`, `-06`, `-09`) arrived through a dedupe collision and were never independently checked; each needs its own evidence line and **batch-editing them is forbidden**
- [ ] T002 [P] Capture the advisor validation output verbatim, before any edit (`<packet>/baselines/`)
- [ ] T003 [P] Capture the CLI offline smoke output verbatim, before any edit (`<packet>/baselines/`)
- [ ] T004 [P] Capture the document-validator blocking-error count for the six non-conformant references, before any edit (`<packet>/baselines/`)
- [ ] T005 [P] Record the runtime hook configuration as it stands, before any registration edit (`<packet>/baselines/`)
- [ ] T006 Cite the fleet-gate re-baseline captured by the first phase. **No no-regression claim in this phase may cite a remembered pass count** — `REQ-013`
- [ ] T007 § **Reproduce the fail-open path** that the safety claim depends on: demonstrate that the pre-push check permits a push when its validator is missing or broken, in a scratch clone. If it cannot be reproduced, record the claim as refuted and do not edit the document on assumption — `RE-006-06`
- [ ] T008 Rule DR-6: is the advisor gate an absolute floor, or a bounded delta from a dated snapshot? **No threshold edit starts before this** (`decision-record.md`) — **[OPERATOR-DECISION: DR-6]**
- [ ] T009 Build the path-existence assertion over every hook source path, registration and smoke command in both hook references and the runtime configurations. **Both directions: a registration pointing at nothing and a live adapter nobody documents are both failures.** An unreadable configuration is a failure, not a pass — `REQ-003`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A — the advisor gate

- [ ] T010 [B] Rewrite the gate statement under the DR-6 ruling, carrying the snapshot's capture date alongside every threshold. Blocked on T008 (`system-skill-advisor/references/scoring/validation-baselines.md`) — `RE-007-01`, **[OPERATOR-DECISION: DR-6]**
- [ ] T011 [P] Turn any threshold restatement in the tuning reference into a link to the ruled statement (`system-skill-advisor/references/scoring/lane-weight-tuning.md`) — `RE-007-01` companion surface

### Lane B — hook topology

- [ ] T012 Correct adapter source paths, smoke commands and the runtime roster; add the live adapter the reference omits (`system-skill-advisor/references/hooks/skill-advisor-hook.md`) — `RE-007-02`
- [ ] T013 Match the integration inventory to the adapters that exist (`system-skill-advisor/SKILL.md`) — `RE-007-07`
- [ ] T014 Correct the mirror-image defect: the absent adapter path, the absent settings file, and the omitted registered lifecycle adapter (`system-spec-kit/references/config/hook-system.md`) — `RE-003-01`
- [ ] T015 Make the runtime instructions runnable against files that exist (`system-spec-kit/references/hooks/skill-advisor-hook.md`) — `RE-003-02`
- [ ] T016 [P] Complete the runtime inventory in the root README (`system-spec-kit/README.md`) — `RE-003-04`
- [ ] T017 § Repoint the runtime hook registration and the adapter README at the maintained adapter, or restore the missing proxy. **Restoration is a behaviour change and must be raised separately, not folded into a documentation edit** (`.cursor/hooks.json`, `sk-git/scripts/hooks/README.md`) — `RE-006-04`
- [ ] T018 § Correct the adapter README's return contract to name the channel the extension's own code says is visible (`sk-git/scripts/hooks/pi/README.md`) — `RE-006-05`
- [ ] T019 Document the installation-drift check command and make the project-versus-user-global distinction explicit. **Documentation only — do not run a repair against the global installation** (`system-spec-kit/references/config/hook-system.md`) — `RE-003-07`, **[OPERATOR-DECISION: Q4 — Codex hook drift]**

### Lane C — safety and policy-document honesty

- [ ] T020 [B] § State the fail-open limitation prominently and distinguish advisory enforcement from guaranteed enforcement. **The hook's failure mode is not changed by this phase.** Blocked on T007 (`sk-git/references/remote-branch-policy.md`) — `RE-006-06`
- [ ] T021 § In the same file and the same edit, replace the packet-history citations with stable source paths and feature names, per the evergreen authoring rule (`sk-git/references/remote-branch-policy.md`) — `RE-006-09`. **Co-located deliberately: one file, one owner, one edit**

### Lane D — self-description, rosters and counts

- [ ] T022 [P] State the stale-index behaviour once, matching what the code actually returns; remove the contradicting sentence (`system-skill-advisor/README.md`) — `RE-007-03`
- [ ] T023 [P] Single-source the public tool count and repair the broken related link (`system-skill-advisor/references/runtime/tool-ids-reference.md`) — `RE-007-11`
- [ ] T024 [P] Move the timeout-flag documentation to the hub whose code holds the live consumers; leave a pointer at most in the sibling (`system-skill-advisor/`) — `RE-007-12`
- [ ] T025 Single-source the CLI tool counts from one constant; update the reference, the smoke check and the test together, or make all three read that constant (`system-spec-kit/references/cli/daemon-cli-reference.md`) — `RE-008-06`
- [ ] T026 [P] Add the active model routes the runtime contract omits (`sk-prompt/sk-prompt-models/SKILL.md`) — `RE-007-04`
- [ ] T027 Make the leaf router able to resolve every model with an authored profile; generate or CI-verify the rows against the profile data (`sk-prompt/shared/references/smart-routing.md`) — `RE-007-05`
- [ ] T028 [P] Match the iteration cap to the contract the rule cites as its source (`sk-prompt/sk-prompt-improve/SKILL.md`) — `RE-007-06`
- [ ] T029 [P] Refresh the hub README's model roster from the profile data (`sk-prompt/README.md`) — `RE-007-08`
- [ ] T030 [P] Add the missing models to the packet README's orientation (`sk-prompt/sk-prompt-models/README.md`) — `RE-007-09`

### Lane E — structure, last

- [ ] T031 [B] Restructure the six non-conformant references under the canon phase's ruling. Blocked on that ruling (`sk-prompt/**`) — `RE-007-10`
- [ ] T032 [B] Restore the numbered structure in the auto-mode contract, moving provenance content after numbered content. Blocked on the same ruling (`system-spec-kit/references/workflows/auto-mode-contract.md`) — `RE-003-05`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T033 Run the path-existence assertion; zero unresolvable in both directions; report the number of paths checked so a vacuous pass is visible
- [ ] T034 Run the roster assertion; every model with an authored profile resolves, or is excluded by an explicit marker
- [ ] T035 Re-run the advisor validation; report the delta against T002
- [ ] T036 Re-run the CLI smoke check; report the delta against T003
- [ ] T037 Re-run the document validator over the six references; report the delta against T004; zero blocking errors
- [ ] T038 Confirm no file outside the repository was written at any point in this phase
- [ ] T039 Confirm every one of the 22 scope items reached exactly one terminal state, each supplementary item with its own evidence line
- [ ] T040 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this folder> --strict` → Errors: 0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
- [ ] Every live number reported as a delta against a recorded capture
- [ ] The safety claim was reproduced before it was edited, or recorded as refuted
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md` — scaffolded at copy time, populated by T008
<!-- /ANCHOR:cross-refs -->
