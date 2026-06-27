---
title: "Implementation Summary: sk-design unified sk-code handoff schema"
description: "Not started. Scaffold for the single sk-code handoff schema applied across four modes: an interface build manifest, a foundations handoff card, an audit backlog-handoff card that routes findings without applying them, and a motion stack-boundary field. A later subagent implements and verifies."
trigger_phrases:
  - "sk-design handoff schema status"
  - "design build manifest outcome"
importance_tier: "important"
contextType: "implementation"
status: not-started
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/019-handoff-card"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created the not-started status stub"
    next_safe_action: "Define the shared handoff schema, then apply it per mode"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-019-handoff-card"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-design unified sk-code handoff schema

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 154-sk-design-parent/019-handoff-card |
| **Completed** | Not started (scaffold only) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is scaffolded and not started. The planned work standardizes one sk-code handoff schema in `.opencode/skills/sk-design/shared/` and applies it across four modes: an interface required build manifest, a foundations handoff card, an audit backlog-handoff card that routes accepted findings to sk-code without applying them, and a motion implementation-mechanism and stack-boundary field on the motion cards.

A later subagent will record the shared schema, the four per-mode applications, and the verification evidence here.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The single-schema direction is grounded in `../015-per-skill-improvement-research/implementation-summary.md`, which found the same structured-handoff need recurring in four of five modes under different names. The per-mode field shapes come from the interface (P1 manifest), foundations (P2-1 handoff card), audit (R4 backlog handoff), and motion (P2 stack boundary) lineage research.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| One shared schema with per-mode extensions | The same need recurs in four modes, so one schema is cheaper and more consistent than four bespoke cards |
| Keep the audit variant a routing card | The audit-never-fixes boundary must hold, so the card routes findings to sk-code and never applies them |
| Exclude md-generator | It does not hand a design to sk-code the same way, so it is the fifth mode the recurrence skips |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| One shared handoff schema defined and referenced by all four modes | PENDING |
| Audit backlog card routes accepted findings without applying them | PENDING |
| Interface, foundations, and motion artifacts carry their required fields | PENDING |
| `package_skill.py --check` on every touched skill | PENDING |
| `validate.sh --strict` on this packet | PENDING |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not started.** This is a scaffold. The four modes still hand to sk-code through inconsistent or implicit cards in the live family.
2. **Schema shape is open.** Whether the schema is one imported file or a documented contract each mode instantiates is left to the implementing subagent.
<!-- /ANCHOR:limitations -->
