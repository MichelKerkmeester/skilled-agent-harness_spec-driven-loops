---
title: "Tasks: sk-design unified sk-code handoff schema"
description: "Task list for the unified handoff schema: one shared schema is defined and applied as an interface build manifest, foundations handoff card, audit backlog handoff, and motion stack-boundary field. Complete."
trigger_phrases:
  - "sk-design handoff schema tasks"
  - "design build manifest tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/019-handoff-card"
    last_updated_at: "2026-06-27T07:18:33Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Completed the shared sk-code handoff card"
    next_safe_action: "Use the handoff schema in future design-to-build work"
    blockers: []
    key_files:
      - "spec.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-019-handoff-card"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Read the four-mode handoff recurrence and per-mode shapes from the interface (P1 manifest), foundations (P2-1 card), audit (R4 backlog), and motion (P2 stack boundary) lineage research. Evidence: read the four `015-per-skill-improvement-research/*/research/lineages/gpt55fast/research.md` files.
- [x] T002 Confirm the live interface, foundations, audit, and motion packets for where each handoff artifact lives and what fields each mode already emits. Evidence: read the four live mode `SKILL.md` routers before editing.
- [x] T003 Confirm the audit-never-fixes boundary so the backlog card routes findings without applying them. Evidence: `design-audit/SKILL.md` now states the backlog card routes accepted findings and applies nothing.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define the shared sk-code handoff schema in the sk-design shared layer, carrying register posture, source evidence, output schema, reuse list, motion budget, open risks, and do-not constraints (`.opencode/skills/sk-design/shared/`). Evidence: created `.opencode/skills/sk-design/shared/sk_code_handoff.md`.
- [x] T005 [P] Apply the required interface build manifest referencing the shared schema (tokens, signature move, motion budget, reuse list, open risks) (`.opencode/skills/sk-design/design-interface/`). Evidence: `REAL_UI_LOOP` now loads `../shared/sk_code_handoff.md` and the interface section requires the build manifest.
- [x] T006 [P] Apply the foundations handoff card referencing the shared schema (register, surface role, source evidence, output schema, CSS-var and breakpoint handoff) (`.opencode/skills/sk-design/design-foundations/`). Evidence: `TOKENS` now loads `../shared/sk_code_handoff.md` and the foundations section names the required fields.
- [x] T007 [P] Apply the audit backlog-handoff card that routes accepted findings (id, severity, owner, target, one-line fix shape, verification) to sk-code without applying them (`.opencode/skills/sk-design/design-audit/`). Evidence: `AUDIT_CONTRACT` now loads `../shared/sk_code_handoff.md` and the audit backlog section states audit never applies fixes.
- [x] T008 [P] Apply the motion implementation-mechanism and stack-boundary field on the motion cards recording which animation library to use (`.opencode/skills/sk-design/design-motion/`). Evidence: `STRATEGY` now loads `../shared/sk_code_handoff.md` and the motion boundary section names the allowed mechanism field.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Confirm each of the four modes references the shared handoff schema and the audit card routes findings without applying them. Evidence: D5 connectivity returned score 100, `gateFailed false`, 0 path escapes, 0 dead intent keys and 0 dead resource paths for all four modes.
- [x] T010 Run `package_skill.py --check` on every touched sk-design skill (exit 0). Evidence: `Result: PASS` for interface, foundations, audit and motion.
- [x] T011 Run `validate.sh --strict` on this packet (0 errors). Evidence: final strict validation recorded in `implementation-summary.md`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`. Evidence: T001 through T011 are complete.
- [x] No `[B]` blocked tasks remaining. Evidence: no blocked tasks remain in this file.
- [x] One shared schema is referenced by all four modes, the audit boundary holds, and packaging plus strict validation pass. Evidence: D5 and package checks passed for every touched mode.

### Status note

This packet is complete. It defines the single sk-code handoff schema the 015 synthesis recommended after the same need recurred in four of five modes. The shared schema is applied as the interface build manifest, the foundations handoff card, the audit backlog-handoff card, and the motion stack-boundary field. D5 connectivity and package checks passed for all four modes.
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
