---
title: "Tasks: shared model intelligence"
description: "Phase D task list."
trigger_phrases: ["shared intelligence tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/093-small-ai-model-optimization/005-model-profiles-and-fallback"
    last_updated_at: "2026-05-18T16:56:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase 005 shared intelligence tasks"
    next_safe_action: "Review diffs and commit the explicit Phase 005 path list"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000021"
      session_id: "114-005-tasks-init"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Tasks: shared model intelligence

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> Registry.

- [x] T001 Author `sk-prompt/assets/model-profiles.json` (4 required + 2 optional stubs, schema v1.0)
- [x] T002 [P] Author `sk-prompt/references/model-profiles.md` (schema + update protocol)
- [x] T003 Update `cli-devin/SKILL.md` §3 to defer to registry
- [x] T004 [P] Update `cli-opencode/SKILL.md` §3 to defer to registry
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

> Bayesian + fallback.

- [x] T005 Update 3 cli-devin agent-config recipes with bayesian scoring block
- [x] T006 Author `cli-devin/references/quota-fallback.md`
- [x] T007 Update agent-config recipes with `fallback_chain` field
- [x] T008 Unit tests: bayesian sequences (success/fail patterns)
- [x] T009 Unit tests: fallback pairs (every required {failed, target} plus optional adoption paths)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> Empirical + cross-refs.

- [x] T010 Empirical: simulate SWE-1.6 free exhaustion → fail-fast; Haiku adoption mutation → fallback
- [x] T011 Empirical: tool below 50% score after 3+ calls → demoted by `shouldDemote`
- [x] T012 Update `sk-small-model/references/pattern-index.md` with 3 shipped rows
- [x] T013 Update `sk-prompt/assets/cli_prompt_quality_card.md` cross-ref
- [x] T014 Update implementation-summary.md with metrics
- [x] T015 Memory continuity update in packet frontmatter
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] T001-T015 marked [x]
- [x] P0 requirements verified (4/4)
- [x] decision-record.md has ≥1 accepted ADR
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Plan**: `plan.md`
- **Checklist**: `checklist.md`
- **Decisions**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`
- **Research**: `../001-research-smallcode/research/research.md` §RQ3 + iter-008
<!-- /ANCHOR:cross-refs -->
