---
title: "Tasks: sk-design unified sk-code handoff schema"
description: "Task list for the unified handoff schema: define one shared schema, then apply it as an interface build manifest, foundations handoff card, audit backlog handoff, and motion stack-boundary field. Not started."
trigger_phrases:
  - "sk-design handoff schema tasks"
  - "design build manifest tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/019-handoff-card"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Enumerated the handoff-schema tasks across four modes"
    next_safe_action: "Define the shared handoff schema, then apply it per mode"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-019-handoff-card"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design unified sk-code handoff schema

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 Read the four-mode handoff recurrence and per-mode shapes from the interface (P1 manifest), foundations (P2-1 card), audit (R4 backlog), and motion (P2 stack boundary) lineage research
- [ ] T002 Confirm the live interface, foundations, audit, and motion packets for where each handoff artifact lives and what fields each mode already emits
- [ ] T003 Confirm the audit-never-fixes boundary so the backlog card routes findings without applying them
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define the shared sk-code handoff schema in the sk-design shared layer, carrying register posture, source evidence, output schema, reuse list, motion budget, open risks, and do-not constraints (`.opencode/skills/sk-design/shared/`)
- [ ] T005 [P] Apply the required interface build manifest referencing the shared schema (tokens, signature move, motion budget, reuse list, open risks) (`.opencode/skills/sk-design/design-interface/`)
- [ ] T006 [P] Apply the foundations handoff card referencing the shared schema (register, surface role, source evidence, output schema, CSS-var and breakpoint handoff) (`.opencode/skills/sk-design/design-foundations/`)
- [ ] T007 [P] Apply the audit backlog-handoff card that routes accepted findings (id, severity, owner, target, one-line fix shape, verification) to sk-code without applying them (`.opencode/skills/sk-design/design-audit/`)
- [ ] T008 [P] Apply the motion implementation-mechanism and stack-boundary field on the motion cards recording which animation library to use (`.opencode/skills/sk-design/design-motion/`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 Confirm each of the four modes references the shared handoff schema and the audit card routes findings without applying them
- [ ] T010 Run `package_skill.py --check` on every touched sk-design skill (exit 0)
- [ ] T011 Run `validate.sh --strict` on this packet (0 errors)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All implementation tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] One shared schema is referenced by all four modes, the audit boundary holds, and packaging plus strict validation pass

### Status note

This packet is NOT STARTED. It scaffolds the single sk-code handoff schema the 015 synthesis recommended after the same need recurred in four of five modes. A later subagent defines the shared schema, applies it as the interface build manifest, the foundations handoff card, the audit backlog-handoff card, and the motion stack-boundary field, then records the packaging and validation evidence.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Grounding**: See the interface, foundations, audit, and motion lineage research and `../015-per-skill-improvement-research/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
