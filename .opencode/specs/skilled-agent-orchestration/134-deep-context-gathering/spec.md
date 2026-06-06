---
title: "deep-context loop"
description: "Phase-parent packet for the deep-context loop: the foundational build (001) and runtime-robustness parity with the mature deep loops (002)."
trigger_phrases:
  - "deep-context"
  - "context gathering"
  - "context loop"
  - "reuse catalog"
  - "deep loop"
importance_tier: "high"
contextType: "specification"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-deep-context-gathering"
    last_updated_at: "2026-06-06T21:40:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "001 foundation shipped; 002 runtime-robustness-parity open for build"
    next_safe_action: "Implement the 002 runtime-robustness-parity features in the loop"
    blockers: []
    key_files:
      - "spec.md"
      - "001-context-loop-foundation/spec.md"
      - "002-runtime-robustness-parity/spec.md"
    completion_pct: 50
    open_questions: []
    answered_questions:
      - "001 shipped the deep-context loop; 002 wires the runtime durability and validation features it currently skips."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 3 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: deep-context loop (Phase Parent)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Phase Parent |
| **Created** | 2026-06-06 |
| **Updated** | 2026-06-06 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

There is no convergence-gated loop that assembles implementation-ready context from the existing codebase. `/speckit:plan` discovers context ad-hoc and `/speckit:implement` relies on whatever the plan captured, so reusable code is missed, stale references and context-rot creep in, and there is no saturation signal for "enough context gathered." A first build closed that gap, but it landed as a host-driven loop that does not yet use the shared runtime's durability and validation layer as fully as the mature deep loops do.

### Purpose

Deliver a `deep-context` deep loop that produces a relevance-gated, agreement-confirmed, reuse-first Context Report — and bring it to robustness parity with `deep-research` and `deep-review` so it inherits the same crash-safety, output validation, and audited dispatch guarantees on the shared `deep-loop-runtime`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The deep-context loop itself: skill, `/deep:start-context-loop` command and workflows, `@deep-context` agent, the `loop_type='context'` coverage-graph and convergence extension, and the reuse-first Context Report (phase 001).
- Runtime-robustness parity: wiring the `deep-loop-runtime` durability and validation features the loop currently skips (phase 002).

### Out of Scope

- The disjoint-slice `fanout-run` lineage mode and `bayesian-scorer` executor demotion — deep-context uses by-model-shared-scope council dispatch by design, and the mature loops do not use the scorer either.
- Any change to research or review behavior; all runtime extensions stay gated behind `loop_type='context'`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `001-context-loop-foundation/**` | Complete | Foundational build, sk-doc package, advisor registration, playbook-gap fixes (done) |
| `002-runtime-robustness-parity/**` | Open | Runtime durability/validation wiring for the deep-context loop |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Status | Scope |
|-------|--------|--------|-------|
| 001 | `001-context-loop-foundation/` | Complete (shipped + verified) | The foundational deep-context build: the loop skill, `/deep:start-context-loop` command + auto/confirm workflows, the `@deep-context` LEAF agent, the `deep-loop-runtime` `loop_type='context'` coverage-graph + convergence extension, the reuse-first Context Report, the sk-doc documentation package, skill-advisor registration, and the closed manual-testing-playbook gaps. |
| 002 | `002-runtime-robustness-parity/` | Open (build) | Bring the host-driven loop to durability and validation parity with `deep-research`/`deep-review`: wire `post-dispatch-validate` (seat-output validation before merge), `atomic-state` (crash-safe writes), `jsonl-repair` (corrupt-tail recovery before read), `executor-audit` (provenance + recursion guard on CLI seat dispatch), and the `loop-lock` runtime helper. |

### Phase Transition Rules

- Each phase child carries its own full doc set (spec/plan/tasks/checklist/implementation-summary); this parent stays a lean control file.
- All phase-002 runtime wiring stays gated behind `loop_type='context'` so research and review behavior is unchanged.
- Robustness features are added to match the mature loops' guarantees, not to replace deep-context's by-model-shared-scope council-dispatch design.
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- None at parent level. Phase-002 implementation questions belong to that child packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- `001-context-loop-foundation/spec.md` — the foundational build phase (shipped)
- `002-runtime-robustness-parity/spec.md` — the runtime-robustness parity phase (open)
- `001-context-loop-foundation/research/research.md` — the 10-iteration design research behind the loop
