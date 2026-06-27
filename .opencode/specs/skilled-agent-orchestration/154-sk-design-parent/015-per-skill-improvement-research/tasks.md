---
title: "Tasks: sk-design per-skill improvement research across the five design modes"
description: "Task list for the Level-3 research phase: ran five parallel GPT-5.5-xhigh deep-research lineages, one per design mode, all converged, then synthesized the findings and recorded the decisions. All tasks done, research deliverables preserved."
trigger_phrases:
  - "sk-design improvement research tasks"
  - "design per-skill research synthesis tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/154-sk-design-parent/015-per-skill-improvement-research"
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed the five lineages and recorded the synthesis and decision record"
    next_safe_action: "Research synthesis captured pending commit, plumbing fixes route to future build phases"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-015-per-skill-improvement-research"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design per-skill improvement research across the five design modes

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] T001 Confirm the five sk-design mode packets exist with their 009 and 012 content landed
- [x] T002 Confirm the GPT-5.5-xhigh deep-research executor is reachable over opencode
- [x] T003 Bind a lineage artifact directory per mode so writes stay lineage-local
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Ran the five parallel GPT-5.5-xhigh lineages, ten iterations each, to convergence (interface, foundations, motion, audit, md-generator)
- [x] T005 [P] Captured the per-mode `research.md` deliverable for each mode (`00N-<mode>/research/lineages/gpt55fast/research.md`)
- [x] T006 Read the five deliverables across the family and recorded the cross-mode synthesis (`implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Confirmed each of the five lineages converged and its `research.md` is present, with orchestration logs preserved unchanged
- [x] T008 Recorded the binding decisions in `decision-record.md`: plumbing over theory, the shared-register loading contract as the highest-leverage family fix, the single sk-code handoff schema, and the unanimous do-not list
- [x] T009 Routed every named plumbing fix (shared-register loader, registry aliases, handoff schema, benchmark fixtures, md-generator backend manifest) to a future build phase and confirmed no live sk-design content was changed
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All implementation tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] The five converged deliverables are preserved and the synthesis plus decision record are recorded as the acceptance evidence

### Status note

This packet is EXECUTED. Five parallel GPT-5.5-xhigh deep-research lineages ran, one per design mode, ten iterations each, and all five converged. The deliverables are the five `research.md` files under `00N-<mode>/research/lineages/gpt55fast/`, preserved as written. The cross-mode synthesis is recorded in `implementation-summary.md`: the design knowledge already landed in phases 009 and 012, so the leverage is now plumbing rather than design theory. The single highest-leverage family fix is the shared-register loading contract, where the router path-guard cannot load the parent `../shared/register.md` that motion, audit, and partly interface mandate, so one shared loader fix repairs multiple modes. Router and registry wiring lags content in all five (missing aliases in foundations and md-generator, an overloaded grounding branch in interface, loaders that do not match the documented contract in motion and audit). No mode has its claimed score backed by checked-in fixtures, which the 014 benchmark begins to address. A required sk-code handoff card recurs in four of five modes. One real bug, md-generator's missing `backend/package.json`, is recorded to patch first. The binding decisions and the unanimous do-not list are in `decision-record.md`. No live sk-design content was changed by this research phase.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Synthesis**: See `implementation-summary.md`
- **Decisions**: See `decision-record.md`
- **Deliverables**: See `00N-<mode>/research/lineages/gpt55fast/research.md` for each of the five modes
- **Benchmark evidence**: See `../014-routing-benchmark/implementation-summary.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
