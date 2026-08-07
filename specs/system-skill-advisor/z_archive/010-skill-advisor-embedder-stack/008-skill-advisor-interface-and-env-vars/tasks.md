---
title: "Tasks: 022/004b"
description: "9 tasks complete via cli-opencode dispatch."
trigger_phrases: ["022/004b tasks"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-embedder-stack/008-skill-advisor-interface-and-env-vars"
    last_updated_at: "2026-05-23T18:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks done via dispatch"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md", "plan.md"]
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022a3"
      session_id: "016-002-022-004b-tasks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Tasks shipped via cli-opencode"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Tasks: 022/004b

<!-- ANCHOR:notation -->
## 1. TASK NOTATION
`[x]` complete | `[T###]` id | `[P#]` priority
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## 2. PHASE 1: SETUP
- [x] [T001] [P0] Pre-dispatch checklist 10 steps complete (preflight + investigation + sequential_thinking + sk-prompt CRAFT + CLEAR ≥ 40/50).
- [x] [T002] [P0] Compose tightly-scoped prompt at /tmp/004b-prompt.md with verified file refs + 3-wave atomic structure + bundle gate.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## 3. PHASE 2: IMPLEMENTATION
- [x] [T003] [P1] Dispatch: `opencode run --model deepseek/deepseek-v4-pro --variant high --agent general --format json --dangerously-skip-permissions --dir "$(pwd)"` PID 31167.
- [x] [T004] [P1] Wave 2 (RoutingCalibration interface expansion + fusion.ts wiring) — PASS per dispatch self-report.
- [x] [T005] [P1] Wave 3 (env-var overrides + resolvedConfidenceThreshold/resolvedUncertaintyThreshold helpers + 3 env vars) — PASS; SPECKIT_ADVISOR_LANE_WEIGHTS_JSON skipped with documented reason.
- [x] [T006] [P1] Wave 4 (prompt-policy.ts externalization + data/prompt-policy.default.json + 5 fire/no-fire env vars + SPECKIT_ADVISOR_PROMPT_POLICY_PATH) — PASS.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## 4. PHASE 3: VERIFICATION
- [x] [T007] [P0] system-spec-kit typecheck:root exit 0 (dispatch self-verified).
- [x] [T008] [P0] Bundle gate: 4 pre-existing vitest failures confirmed via `git stash` (same failures on HEAD~1); 0 new failures introduced.
- [x] [T009] [P0] data/prompt-policy.default.json exists (91 lines, 1486 bytes).
- [x] [T010] [P0] 9 new SPECKIT_ADVISOR_* env vars wired across consumers.
- [x] [T011] [P0] Strict-validate phase 004b exit 0.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## 5. COMPLETION CRITERIA
9 P1 + 2 P2 closed. Lane-weights env var documented as out-of-scope follow-on.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## 6. CROSS-REFERENCES
spec.md R1–R8 ↔ T003–T011
<!-- /ANCHOR:cross-refs -->
