---
title: "Plan: 022/007"
description: "cli-opencode single-wave dispatch."
trigger_phrases: ["022/007 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/007-code-graph-p1-config-extraction"
    last_updated_at: "2026-05-23T18:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan post-dispatch"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002272"
      session_id: "016-002-022-007-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["cli-opencode dispatch shipped"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/007

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Consolidate 5 code-graph constants to canonical config-defaults.ts with env-var overrides.
### Overview
Single dispatch ~7 min.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- 5 consumer paths verified pre-dispatch
### Definition of Done
- R1–R7 pass; strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
New config-defaults.ts module + lazy/static imports in 5 consumers + invariant test.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: New module
config-defaults.ts with CODE_GRAPH_DEFAULTS + parsePositiveInt helper.
### Phase 2: Consumers
5 file updates importing from config-defaults.
### Phase 3: Test + ENV_REFERENCE
15-assertion invariant test + 5 new rows in ENV_REFERENCE.md.
### Phase 4: Verification
typecheck + vitest + ban-list grep + strict-validate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
New config-defaults.vitest.ts: 15 assertions covering defaults + env-var overrides + JSON partial merge.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
None on other 022 phases (independent subsystem).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git restore` 6 files + `git rm` 2 new files.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES
Independent of other 022 phases.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE
| Phase | Est | Actual |
|---|---|---|
| Total | 60 min | 7 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK
If JSON env var malformed in production, log warning + revert to defaults — already implemented by parser.
<!-- /ANCHOR:enhanced-rollback -->
