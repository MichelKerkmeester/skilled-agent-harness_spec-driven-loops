---
title: "Task Breakdown: sk-doc Legacy Self-Identity Cleanup [skilled-agent-orchestration/144-sk-doc-legacy-self-identity-cleanup/tasks]"
description: "Planned task list for normalizing the 258 pre-existing self-identity references in the sk-doc track."
trigger_phrases:
  - "sk-doc self-identity cleanup tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/144-sk-doc-legacy-self-identity-cleanup"
    last_updated_at: "2026-07-15T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Backlog task list authored"
    next_safe_action: "Schedule the cleanup pass when a worktree is available"
    blockers: []
    completion_pct: 0
    status: "Planned"
---
# Task Breakdown: sk-doc Legacy Self-Identity Cleanup

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[x]` complete · `[ ]` pending · `[~]` in progress


<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-101 Capture baseline: comprehensive detector count (258 at authoring), validate error count, unrelated-token occurrence table


<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-201 Rewrite self-identity fields per file to the doc's current on-disk `sk-doc/NNN-…` path


<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-301 Verify: detector = 0; occurrence parity on unrelated tokens; `validate.sh --strict --recursive` regression-neutral
- [ ] T-302 Record + land behind operator approval


<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- Detector = 0 non-resolving self-identity refs in sk-doc canonical docs.
- Regression-neutral validation; no unrelated token changed.


<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Spec**: `spec.md`
- **Plan**: `plan.md`


<!-- /ANCHOR:cross-refs -->
---
