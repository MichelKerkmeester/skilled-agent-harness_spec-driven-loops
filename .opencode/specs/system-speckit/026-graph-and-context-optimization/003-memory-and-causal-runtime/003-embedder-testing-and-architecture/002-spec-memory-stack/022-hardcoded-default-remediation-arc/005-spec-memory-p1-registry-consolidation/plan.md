---
title: "Plan: 022/005"
description: "cli-opencode + deepseek-v4-pro --variant high single-wave dispatch."
trigger_phrases: ["022/005 plan"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/005-spec-memory-p1-registry-consolidation"
    last_updated_at: "2026-05-23T18:10:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan post-dispatch"
    next_safe_action: "n/a"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002252"
      session_id: "016-002-022-005-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["cli-opencode dispatch shipped"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/005

<!-- ANCHOR:summary -->
## 1. SUMMARY
### Technical Context
Extend registry.ts with reranker canonical helper; consolidate 4 inline-default consumer files.
### Overview
Single dispatch ~12 min.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
### Definition of Ready
- registry.ts shape verified (getCanonicalFallback already exists)
- 5 consumer file paths verified
### Definition of Done
- R1–R8 pass; strict-validate exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
### Pattern
Extend canonical registry + import from registry in consumers. Mirrors packet 020 pattern.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
### Phase 1: Extend registry
RerankerProvider + RERANKER_CANONICAL + getRerankerFallback.
### Phase 2: Consumers
4 file updates (voyage, openai, auto-select, cross-encoder).
### Phase 3: Verification
typecheck + vitest + ban-list grep + strict-validate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
Existing vitest suite; behavior preserved.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
Packet 020 (getCanonicalFallback shipped).
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
`git restore` 5 files.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES
Independent of other 022 phases.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE
| Phase | Est | Actual |
|---|---|---|
| Total | 60 min | 12 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK
If voyage/cohere reranker canonical names are later established, fill them in RERANKER_CANONICAL.
<!-- /ANCHOR:enhanced-rollback -->
