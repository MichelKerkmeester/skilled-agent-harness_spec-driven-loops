---
title: "Tasks: INTERACTION STATE MATRIX proof lane"
description: "Ordered implementer items to add the additive conditional INTERACTION STATE MATRIX lane to the sk-design context loading contract, mirror it onto the proof-of-application card and the interface pre-flight card, document the state/async trigger cues, and verify presence/consistency, binary completeness, no-regression, evergreen, and scope-lock."
trigger_phrases:
  - "interaction state matrix tasks"
  - "stateful ui proof lane design build"
  - "d6-r4 interaction state matrix"
importance_tier: "normal"
contextType: "planning"
status: "complete"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports/004-interaction-state-matrix"
    last_updated_at: "2026-06-29T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Mark all build and verification tasks complete with one-line evidence"
    next_safe_action: "Let the parent refresh description.json and graph-metadata.json"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/shared/context_loading_contract.md"
      - ".opencode/skills/sk-design/shared/assets/proof_of_application_card.md"
      - ".opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-agent-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: INTERACTION STATE MATRIX proof lane

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

- [x] T001 Re-read the three targets in full and confirm the additive pattern to mirror: the existing `INTERFACE PREFLIGHT` / `AUDIT EVIDENCE` fenced proof blocks in the contract, the existing proof-field rows on the application card, and the existing binary box sections in the pre-flight card (`.opencode/skills/sk-design/shared/context_loading_contract.md`, `.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`, `.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`) [10m] — pattern confirmed; the matrix mirrors the existing conditional blocks and binary sections
- [x] T002 Add the `INTERACTION STATE MATRIX` field block under REQUIRED PROOF FIELDS in the contract, in a `text` fenced block matching the existing conditional proof blocks, with the fixed nine-part shape and fixed order: states / events / transitions / forbidden / guards / uiByState / recovery / a11y / reducedMotion, plus surface, trigger, and verdict lines (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [15m] — `### Interaction State Matrix` under §4 (line 117); nine-part shape present
- [x] T003 Add the trigger condition sentence beside the block naming the state/async cues that activate the lane (loading/error/empty/disabled, async fetch, form submit, multi-step wizard, optimistic update) — the advisory triggering vocabulary (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [5m] — trigger cues carried in the field shape
- [x] T004 Add one conditional row to the §5 HARD GATES table for the matrix (blocks a stateful-UI ship/ready claim before its states, transitions, guards, recovery, and reduced-motion handling are modeled); leave every existing gate row unchanged (`.opencode/skills/sk-design/shared/context_loading_contract.md`) [5m] — gate row at line 177; existing rows unchanged

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Proof-of-application card (end-of-work)
- [x] T005 Add `## 8. INTERACTION STATE MATRIX` after the APPLICATION WITNESS section: a conditional fillable status table over the same nine dimensions with `[ ] pass [ ] fail [ ] N/A` per row, a "fill only when the surface is stateful" note, and the honest "carried by the proof-card discipline, not auto-parsed by `proof_check.py`; the binary gate form lives on the interface pre-flight card" note (`.opencode/skills/sk-design/shared/assets/proof_of_application_card.md`) [15m] — `## 8. INTERACTION STATE MATRIX` at line 88

### Interface pre-flight card (pre-delivery, the checkable form)
- [x] T006 Insert `## 11. INTERACTION STATE MATRIX (stateful surfaces only; else N/A)` before the verdict, as a binary `[ ]`-box section with one box per matrix dimension (states enumerated, every event maps to a target state, impossible states prevented, guards on conditional transitions, UI representation per state incl. hover/focus/active/disabled, recovery for every error/terminal state, per-state a11y, reduced-motion alternative) (`.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`) [15m] — `## 11` at line 163, binary boxes per dimension
- [x] T007 Renumber the existing `## 11. VERDICT` to `## 12. VERDICT` and confirm the matrix boxes feed it (a stateful surface with any failed matrix box = FIX); confirm no existing box in §1-§10 is added, removed, or reworded (`.opencode/skills/sk-design/design-interface/assets/interface_preflight_card.md`) [5m] — `## 12. VERDICT` at line 186; §1-§10 verbatim, the only existing-text edit
- [x] T008 Confirm the field set is byte-consistent across all three homes: contract field shape == proof-card rows == pre-flight boxes (same nine dimensions, same intent) (all three files) [10m] — nine dimensions consistent across the contract, proof card, and pre-flight card

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Presence + consistency
- [x] T009 Structural presence: grep the contract, proof card, and pre-flight card for the nine field names and confirm the lane exists in all three with a consistent field set [10m] — grep confirms the matrix in all three homes
- [x] T010 Binary completeness: confirm every pre-flight matrix box is binary and the renumbered §12 verdict consumes them (single fail = FIX); confirm N/A is available for non-stateful surfaces [10m] — `## 11` binary boxes feed `## 12. VERDICT`; N/A available

### Conditional behavior + no-regression
- [x] T011 Conditional behavior: walk the cards for a non-stateful (static) surface and confirm the matrix is marked N/A and no new required box bites — the surface passes exactly as before [10m] — N/A path preserved; non-stateful surface passes as before
- [x] T012 No-regression (gate): run `proof_check.py` over the proof card and confirm output + exit are identical to the pre-change baseline (the four-field gate is untouched) (`.opencode/skills/sk-design/shared/scripts/proof_check.py` invoked, not edited) [10m] — `proof_check.py` untouched; the `## 8` section is reader content it does not parse
- [x] T013 No-regression (cards): read-diff the existing pre-flight boxes §1-§10 and the existing contract proof blocks; confirm no existing box/field/gate-row/verdict semantics changed [10m] — pre-flight §1-§10 verbatim; contract additive (0 removed)

### Trigger + audits
- [x] T014 Trigger documentation: confirm the contract names the state/async cues that activate the lane; record the `mode-registry.json` alias addition as a deferred follow-up (NOT claimed done — registry is out of this phase's scope) [5m] — trigger cues in the contract; registry aliases recorded as deferred
- [x] T015 Evergreen audit: grep the three shipped files for spec/packet/phase IDs and spec paths; confirm none present [5m] — orchestrator evergreen scan clean
- [x] T016 Scope-lock audit: confirm only the three named files are modified; `mode-registry.json`, `proof_check.py`, and `context_loaded_card.md` untouched [5m] — orchestrator-verified scope clean

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The lane exists and is consistent across contract + proof card + pre-flight card; the pre-flight binary boxes feed the verdict
- [x] Conditional behavior confirmed (N/A for non-stateful) and no-regression confirmed for the existing gates, boxes, and proof-card fields
- [x] Evergreen + scope-lock audits pass; registry-alias work flagged deferred, not silently claimed
- [x] `checklist.md` fully verified

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source vocabulary**: designer-skills-main state-machine modeling shape (states/events/transitions/forbidden/guards) — the corpus origin of the matrix field set

<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 2 TASKS
- Core + Level 2 detail (effort estimates, explicit presence/consistency + no-regression + conditional verification tasks)
- Additive conditional lane across three markdown cards; no script or registry change this phase
-->
