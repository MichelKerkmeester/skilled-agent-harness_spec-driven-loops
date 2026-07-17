---
title: "Gem Team Adoption (Phase Parent)"
description: "Phase-parent for adopting the three gem-team refinements (research 007/009) into the spec-kit agent runtime: a typed agent I/O contract and its scoped gates + advisory fields, built on one shared agent-io-contract."
trigger_phrases:
  - "027 phase 006"
  - "gem team adoption"
  - "agent io contract program"
  - "typed agent io adapter"
  - "scoped preexec handoff gates"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/001-research-and-doctrine/002-gem-team-adoption"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 009 phase-parent with 3 phases (001/002/003)"
    next_safe_action: "Plan/implement phase 001 (typed I/O adapter) first"
    blockers: []
    key_files:
      - "spec.md"
      - "001-typed-agent-io-adapter/spec.md"
      - "002-scoped-preexec-and-handoff-gates/spec.md"
      - "003-planner-review-focus-and-drift-hint/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-006-gem-team-adoption-scaffold"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Gem Team Adoption (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Phase Parent |
| **Created** | 2026-06-06 |
| **Branch** | `main` |
| **Source** | research/007-gem-team-adoption-matrix + research/009-gem-team-integration-impact |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The gem-team adoption research (007) recommended three small, additive refinements to the spec-kit agent runtime, and the integration research (009) showed they collapse onto a single shared advisory contract (`agent-io-contract.md`) emitted/consumed centrally by `@orchestrate`. They share that substrate but have independent delivery risk and rollout order, so they need a parent control document that points to child phases without duplicating implementation detail.

### Purpose
Coordinate the three phases so each can be planned, implemented, and validated independently while the parent keeps the phase map and high-level outcome visible. The unifying outcome: make agent dispatch/output **optionally typed and machine-parseable** — an adapter over the existing rich-markdown contracts, never a replacement.

> **Phase-parent note:** This spec.md is the only REQUIRED authored document at the parent level. All detailed planning, tasks, checklists, and continuity live inside the child phase folders in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The shared advisory `agent-io-contract.md` and the three refinements that build on it (typed dispatch + output envelope; scoped pre-exec/handoff gates; planner reviewer-focus + spec-drift advisory fields).
- Phase routing, dependency visibility (phase 001 is the substrate for 002 and 003), and rollout sequencing.

### Out of Scope
- Implementation at the parent level (each phase carries its own plan/tasks).
- The 007 deferred items (OWASP naming, memory tags, knowledge-precedence note, auto-skills shadow trigger, specialized-agent checklists, APM distribution) — tracked as notes/tags, not phases.
- Runtime enforcement, validator changes, governance rewrites — every field stays optional/advisory.

### Files to Change
Aggregate file scope; per-phase detail lives in child plans.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-spec-kit/references/workflows/agent-io-contract.md` | Create | 001 | Shared advisory contract (substrate) |
| `.opencode/agents/{orchestrate,code,review,context,debug}.md` | Modify | 001-003 | Optional typed dispatch header + output envelope + gate/advisory fields |
| `.opencode/skills/sk-code/SKILL.md`, debug-delegation template/scaffold | Modify | 002 | Scoped gates (boundary contract-first, debug-handoff schema) |
| `.opencode/commands/{speckit,memory}/**` | Modify | 001-003 | Workflow wiring of the optional fields |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details live inside the phase children.

| Phase | Folder | Focus | Level | Status |
|-------|--------|-------|-------|--------|
| 001 | `001-typed-agent-io-adapter/` | Typed dispatch header + output-envelope adapter (gem-team P1) — the substrate | 2 | Complete |
| 002 | `002-scoped-preexec-and-handoff-gates/` | Scoped debug-handoff schema + boundary contract-first + pre-mortem (gem-team P2) | 2 | Complete |
| 003 | `003-planner-review-focus-and-drift-hint/` | Planner reviewer-focus + spec-drift advisory fields (gem-team P3) | 1 | Complete |

### Phase Transition Rules
- **Phase 001 ships first** — it is the substrate; 002 and 003 reuse its envelope (`confidence`/`failure_type`/advisory fields).
- Each phase MUST pass `validate.sh --strict` independently before the next phase implements.
- Use `/speckit:plan` or `/speckit:implement` on `[this-parent]/[NNN-phase]/` to work a specific phase.

### Phase Handoff Criteria

| From | To | Criteria |
|------|----|----------|
| 001-typed-agent-io-adapter | 002 / 003 | The optional dispatch header + output envelope contract is landed and backward-compatible (envelope-less output still parses) before the gates/advisory fields reuse it. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the three phases ship as one PR sequence or three independent PRs (phase 001 first regardless)?
- Final numbering of the sibling proposal sets (peck `009-011`, caura `015`) is reconciled in `research/007 sub-packet-proposals.md`; confirm before cross-phase work.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS
- **Source research**: `../research/007-gem-team-adoption-matrix/` (what to adopt) and `../research/009-gem-team-integration-impact/` (how to integrate + impact matrix + rollout).
- **Phase children**: `001-typed-agent-io-adapter/`, `002-scoped-preexec-and-handoff-gates/`, `003-planner-review-focus-and-drift-hint/`.
