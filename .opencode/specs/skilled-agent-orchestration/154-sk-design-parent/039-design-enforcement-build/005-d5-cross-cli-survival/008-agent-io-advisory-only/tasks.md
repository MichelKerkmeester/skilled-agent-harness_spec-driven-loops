---
title: "Tasks: Treat Agent I/O as advisory-only; name the real design gate"
description: "Task list for landing one single-sourced prose clarification marking Agent I/O as advisory-only and naming the proof-token plus guarded boundary as the design-enforcement gate."
trigger_phrases:
  - "agent io advisory only tasks"
  - "advisory vs gate tasks"
  - "agent io not the gate tasks"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/039-design-enforcement-build/005-d5-cross-cli-survival/008-agent-io-advisory-only"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark grounding, authoring, and verification tasks complete"
    next_safe_action: "Regenerate description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "d5-r8-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Treat Agent I/O as advisory-only; name the real design gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Read the phase spec objective, target, and acceptance (`spec.md`) [5m] — DONE: read before authoring
- [x] T002 [P] Confirm the Open Design pairing contract already states the Open-Design-scoped "Agent I/O Is Not The Gate" rule (`cli_child_pairing.md`) [3m] — DONE: present at line 174
- [x] T003 [P] Confirm the general contract declares `optional-advisory` and has no design-gate pointer (`agent-io-contract.md`) [3m] — DONE: `status: optional-advisory` at Contract Status; no gate pointer pre-existing
- [x] T004 Lock the home: a short advisory-status note in the general Agent I/O contract, placed immediately after the Contract Status section (`agent-io-contract.md`) [4m] — DONE: landed at line 32

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Advisory-only statement
- [x] T005 Write the advisory-only sentence: Agent I/O is a convenience header that may carry manifest/result digests as data, never as authority (`agent-io-contract.md`) [5m] — DONE: line 32, first sentence

### Name the real gate
- [x] T006 Name the authority: the design proof token plus the guarded boundary — guarded-proxy classification, the structured transport result, and parent re-validation (`agent-io-contract.md`) [5m] — DONE: line 32, second sentence
- [x] T007 State both failure directions: presence never substitutes for the gate; absence never passes a design handoff (`agent-io-contract.md`) [4m] — DONE: line 32, third sentence

### Reconcile (single-source)
- [x] T008 Add a by-name pointer to the Open Design pairing contract's "Agent I/O Is Not The Gate" section as the canonical scoped statement (`agent-io-contract.md`) [3m] — DONE: pointer in line 32, fourth sentence
- [x] T009 Keep the note to 2-4 sentences; do not duplicate the scoped deny-rule prose (`agent-io-contract.md`) [3m] — DONE: 4 sentences, no restatement (4 insertions, 0 deletions)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Content review
- [x] T010 Prose review: the advisory-vs-gate framing is unambiguous; the gate is unmistakable [3m] — DONE: advisory vs authority read distinct
- [x] T011 Reconciliation check: the new note does not contradict the existing scoped statement (`cli_child_pairing.md`) [3m] — DONE: consistent; references it, no conflict

### Cross-reference & evergreen
- [x] T012 Follow the pointer; confirm it resolves to the correct sibling section [2m] — DONE: resolves to `cli_child_pairing.md` line 174
- [x] T013 Evergreen lint: grep the authored note for spec IDs, phase numbers, backlog IDs, and spec-folder paths; none present [3m] — DONE: grep over lines 30-32 clean

### Acceptance & quality
- [x] T014 Verify against the phase spec acceptance: advisory-only stated AND a handoff relying solely on Agent I/O presence/absence is named as rejected by the gate [2m] — DONE: both directions stated; SC-001/SC-002 met
- [x] T015 Compute DQI (target >= 75) and record the score [2m] — DONE: DQI 92
- [x] T016 Mark all checklist items with evidence (`checklist.md`) [2m] — DONE: all P0/P1 checked

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Advisory-only status stated and the real gate named in the chosen home
- [x] Reconciled with the existing "not the gate" language (no contradiction)
- [x] Authored prose is evergreen (no IDs, phase numbers, or spec-folder paths)
- [x] checklist.md fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit verification tasks)
- Docs-only prose-contract clarification: names what is NOT the gate
-->
