---
title: "Tasks: P0 Fixes"
description: "Fix tasks for remediation phase 1."
trigger_phrases:
  - "028 drift remediation"
  - "tasks: p0 fixes"
  - "drift fix verification"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    last_updated_at: "2026-06-27T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded tasks for phase 1"
    next_safe_action: "Work the fix tasks"
    blockers: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: P0 Fixes

<!-- ANCHOR:notation -->
## Task Notation
- [ ] open
- [x] fixed and verified
- [~] false-positive (reason in ledger)
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup
- [ ] Load ledger entries for 001-p0-fixes
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation
- [ ] F001 fix `.opencode/commands/doctor/_routes.yaml` /doctor code-graph route declares read-only but advertises mutating operations
- [ ] F002 fix `.opencode/specs/system-spec-kit/028-memory-search-intelligence/005-spec-data-quality/graph-metadata.json` Phase parent 005 carries full Level 3 heavy-doc stack + missing migrated flag
- [ ] F003 fix `.opencode/commands/doctor/assets/doctor_causal-graph.yaml` Causal-graph doctor mutation boundaries invert the canonical DB path
- [ ] F004 fix `.codex/agents/ai-council.toml` ai-council agent re-pinned to gpt-5.4 after cli-codex gpt-5.5 lock
- [ ] F005 fix `.opencode/skills/deep-loop-runtime/lib/deep-loop/fallback-router.ts` Fallback router type expects model-level quota_pool that does not exist
- [ ] F006 fix `.opencode/skills/deep-loop-runtime/tests/unit/fallback-router.vitest.ts` Fallback router tests exercise stale cli-devin registry
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification
- [ ] opus re-reads every touched file; evidence resolved; scope respected
- [ ] validate.sh on this phase --strict exit 0
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria
All 6 findings terminal in the ledger.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References
- ../remediation-ledger.jsonl
<!-- /ANCHOR:cross-refs -->
