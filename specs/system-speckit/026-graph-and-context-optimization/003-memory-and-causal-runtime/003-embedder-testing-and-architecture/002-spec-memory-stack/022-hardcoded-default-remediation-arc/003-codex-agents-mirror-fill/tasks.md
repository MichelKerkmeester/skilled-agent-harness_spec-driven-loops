---
title: "Tasks: 022/003 Codex Agents Mirror Investigation + Qualifier Removal"
description: "5 tasks; all complete."
trigger_phrases: ["022/003 tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/003-codex-agents-mirror-fill"
    last_updated_at: "2026-05-23T17:05:00Z"
    last_updated_by: "main_agent"
    recent_action: "All tasks complete"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022e3"
      session_id: "016-002-022-003-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Tasks shipped"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/003 Codex Agents Mirror Investigation + Qualifier Removal

<!-- ANCHOR:notation -->
## 1. TASK NOTATION

- `[x]` complete | `[ ]` pending | `[T###]` task id | `[P#]` priority
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP

- [x] [T001] [P0] Investigation: `ls -la .codex/agents/` → 11 .toml files confirmed (not empty).
- [x] [T002] [P0] Investigation: `grep "^\[agents\." .codex/config.toml` → `[agents.ai-council]` at line 139 confirmed.
- [x] [T003] [P0] Investigation: `grep -n "proposed" .opencode/agents/` → 2 sites identified (deep-research.md:51, deep-review.md:45).
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION

- [x] [T004] [P1] Edit `.opencode/agents/deep-research.md:51`: remove ` (proposed)` substring.
- [x] [T005] [P1] Edit `.opencode/agents/deep-review.md:45`: same.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION

- [x] [T006] [P0] Ban-list grep across all 4 runtime agent dirs → 0 hits for `deep-ai-council (proposed)`.
- [x] [T007] [P0] Preservation check: `ai-council.md:39` threshold-value `(proposed)` kept (1 hit expected, returned 1).
- [x] [T008] [P0] Strict-validate phase 003 exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA

P0 confirmed already-closed via investigation. 2 P1 token deletions shipped. Phase 003 closed.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES

- spec.md §4 R1–R5 map to T004–T008
- plan.md §4 phases match
- implementation-summary.md captures shipped state
<!-- /ANCHOR:cross-refs -->
