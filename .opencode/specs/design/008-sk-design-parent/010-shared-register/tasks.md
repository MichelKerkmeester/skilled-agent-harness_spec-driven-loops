---
title: "Tasks: sk-design shared Brand-vs-Product operating register"
description: "Task list for building the shared sk-design operating register and its fill-in routing card. Build tasks are pending; only the planning-scaffold meta-task is done. This packet is a planning record awaiting operator approval to execute."
trigger_phrases:
  - "sk-design shared register tasks"
  - "brand vs product register build tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/010-shared-register"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Listed the build tasks; all left pending pending approval"
    next_safe_action: "Operator approval, then execute T002 onward"
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-010-shared-register"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design shared Brand-vs-Product operating register

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

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

- [x] T001 Scaffold this planning packet (spec/plan/tasks/implementation-summary + metadata) from the 009 research deliverable
- [x] T002 Read `../009-reference-asset-expansion/research/research.md` sections 3.1, 4, and 5 for rationale and scope
- [x] T003 Confirm the `sk-design/shared/` home and the consuming modes (interface, audit, foundations, motion) against the live tree
- [x] T004 Agree the dial vocabulary (density, motion budget, color dosage, copy register, anti-slop strictness, audit severity) and the Brand-vs-Product posture
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Author the Brand-vs-Product operating register (`.opencode/skills/sk-design/shared/register.md`) FIRST: declare whether a design IS the product (brand/landing) or SERVES the product (app/task)
- [x] T006 In the register, gate the six downstream dials from that declaration: density, motion budget, color dosage, copy register, anti-slop strictness, audit severity (`.opencode/skills/sk-design/shared/register.md`)
- [x] T007 Author the one-page fill-in routing card (`.opencode/skills/sk-design/shared/assets/register_card.md`): Brand vs Product questions + the downstream defaults each mode should apply
- [x] T008 Cross-check the card's defaults against the register so the two stay consistent (`.opencode/skills/sk-design/shared/assets/register_card.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Verify the register gates all six dials and is written as referenceable shared content (not a sixth sub-skill)
- [x] T010 Verify the card is a single page and resolves to the register's modes
- [x] T011 Run `validate.sh --strict` on this packet, reconcile completion metadata, and mark the build tasks done with evidence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] `shared/register.md` and `shared/assets/register_card.md` both exist under `.opencode/skills/sk-design/`
- [x] No `[B]` blocked tasks remaining
- [x] The register gates all six dials, the card is a one-page fill-in, and both are referenceable shared content

### Status note

This packet is EXECUTED. All build tasks are done: `shared/register.md` and `shared/assets/register_card.md` are built under `sk-design/`, the sk-design hub passes `package_skill --check`, and `validate.sh --strict` passes on this packet.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source rationale**: See `../009-reference-asset-expansion/research/research.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
