---
title: "Plan: 022/004b cli-opencode 3-wave atomic"
description: "Dispatch contract + 3-wave plan."
trigger_phrases: ["022/004b plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/010-skill-advisor-embedder-stack/008-skill-advisor-interface-and-env-vars"
    last_updated_at: "2026-05-23T18:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan written"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022a2"
      session_id: "016-002-022-004b-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["Dispatch shipped"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/004b cli-opencode 3-wave atomic

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
cli-opencode + deepseek-v4-pro --variant high atomic 3-wave dispatch with HALT-on-failure + per-wave verification + bundle gate.
### Overview
PID 31167, ~10 min wall-clock, 9 modified + 1 new file.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- Pre-dispatch checklist 10/10 complete (per council executor-instructions)
- Baseline typecheck exit 0 — DONE
### Definition of Done
- R1–R8 from spec.md §4 satisfied
- Bundle gate PASS
- Strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
3-wave atomic dispatch: each wave gates next via verification report; HALT on any wave failure.
### Key Components
- compat/contract.ts — resolved* helpers added
- scoring-constants.ts — RoutingCalibration interface expanded
- fusion.ts — inline literals → typed slots
- prompt-policy.ts — JSON config loader + env-var overrides
- prompt-cache.ts + render.ts + subprocess.ts + skill-advisor-brief.ts — resolvedThreshold helpers wired
- data/prompt-policy.default.json — externalized linguistic sets + thresholds (NEW)
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Wave 2: RoutingCalibration interface expansion
3 typed slots + fusion.ts wiring + verify (`return 0.55|0.65` ban-list).
### Wave 3: Env-var overrides
resolvedConfidenceThreshold + resolvedUncertaintyThreshold + 3 env vars + JSON override env var.
### Wave 4: Prompt-policy externalization
data/prompt-policy.default.json + module init loader + 5 fire/no-fire env vars.
### Bundle Gate
typecheck + vitest + ban-list grep + JSON file presence check.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Existing vitest suite runs unchanged. Dispatch confirmed 4 pre-existing failures via git stash. Zero new failures introduced.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
- 004a Wave 1 (5 consumers import SKILL_ADVISOR_COMPAT_CONTRACT) shipped first
- Existing SPECKIT_ADVISOR_* convention in metrics.ts + shadow-sink.ts
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git restore` 9 modified files + `git rm` data/prompt-policy.default.json. Reverts to pre-004b state (post-004a Wave 1 still intact).
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES
Depends on 004a Wave 1 shipped. Sibling to 005-009; independent.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE
| Phase | Est | Actual |
|---|---|---|
| Pre-dispatch | 15 min | 10 min |
| Dispatch | 90 min | 10 min |
| Ingest + docs | 15 min | 5 min |
| Total | 2 hr | ~25 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK
If pre-existing vitest failures get attributed to 004b later, use `git stash` to prove same failures exist on HEAD~1 before 004b lands.
<!-- /ANCHOR:enhanced-rollback -->
