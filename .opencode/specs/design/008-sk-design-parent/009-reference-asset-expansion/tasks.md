---
title: "Tasks: sk-design sub-skill reference and asset expansion research"
description: "Task list for the 2-lineage deep-research fan-out producing the per-mode reference/asset expansion matrix. All research tasks executed; implementation tasks belong to the gated follow-up."
trigger_phrases:
  - "design subskill expansion research tasks"
  - "sk-design reference asset fan-out tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/009-reference-asset-expansion"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Completed all research tasks; implementation deferred to a gated follow-up"
    next_safe_action: "Operator review of research/research.md"
    blockers: []
    key_files:
      - "research/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-154-009-reference-asset-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: sk-design sub-skill reference and asset expansion research

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

- [x] T001 Scaffold the phase folder and charter `spec.md`
- [x] T002 Confirm `~/.claude-account2` is authenticated for the Opus lineage
- [x] T003 Build the 2-lineage fan-out config (10 Opus xhigh + 10 GPT-5.5 xhigh, concurrency 2) (`research/deep-research-fanout-config.json`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] Smoke-test 1+1 to confirm executor wiring; archive the smoke artifacts
- [x] T005 Run the full 10+10 fan-out via `fanout-run.cjs`
- [x] T006 Merge lineages via `fanout-merge.cjs`
- [x] T007 Synthesize the consolidated `research/research.md` per-mode matrix with lineage-agreement markers
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Verify both lineages produced valid iterations and reached their cap or converged
- [x] T009 Verify `research/research.md` + findings registry exist with citations
- [x] T010 Generate packet metadata, author plan/tasks/implementation-summary, integrate into the parent phase map, and validate
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All research-phase tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Both lineages verified and the consolidated per-mode matrix is ready for operator review

### Deferred to the gated implementation follow-up (out of scope for this research phase)

These remain `[ ]` intentionally: this packet is findings-only and the implementation is a separate, operator-approved phase.

- [ ] Build `shared/register.md` (the must-add prerequisite) first
- [ ] Author the interface and audit first-assets (preflight card, audit report template)
- [ ] Author N1/N2 gates once (interface owns, audit references)
- [ ] Add the foundations and motion references/assets per the priority ranking
- [ ] Add the md-generator authoring-boundary reference (forward-authoring capability stays out of scope)
- [ ] Fix the `design-audit/SKILL.md §8` stale `v1.0.0.1.md` changelog pointer
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Deliverable**: See `research/research.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
CORE TEMPLATE (~60 lines)
- Simple task tracking
- 3 phases: Setup, Implementation, Verification
- Add L2/L3 addendums for complexity
-->
