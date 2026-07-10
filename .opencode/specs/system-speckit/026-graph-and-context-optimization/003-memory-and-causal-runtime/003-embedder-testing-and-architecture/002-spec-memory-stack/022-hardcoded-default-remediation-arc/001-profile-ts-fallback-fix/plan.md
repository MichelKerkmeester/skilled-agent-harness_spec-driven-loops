---
title: "Plan: 022/001 profile.ts Fallback Fix"
description: "Replace 4 inline pipe-pipe fallbacks in profile.ts:resolveActiveProfileModel with getCanonicalFallback(provider) + delete inline 'jina-embeddings-v3' at embeddings.ts:774 + ship profile.test.ts with 7 invariants."
trigger_phrases:
  - "022/001 plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/001-profile-ts-fallback-fix"
    last_updated_at: "2026-05-23T15:45:00Z"
    last_updated_by: "main_agent"
    recent_action: "Plan written post-execution"
    next_safe_action: "n/a - phase shipped"
    blockers: []
    key_files:
      - "spec.md"
      - ".opencode/skills/system-spec-kit/shared/embeddings/profile.ts"
    session_dedup:
      fingerprint: "sha256:00000000000000000000000000000000000000000000000000000000000022b2"
      session_id: "016-002-022-001-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Direct main-agent Edit chosen over cli-devin dispatch: 5-line edit + 80-line test scope falls below dispatch ROI threshold per memory feedback_cli_dispatch_unreliability.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Plan: 022/001 profile.ts Fallback Fix

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Phase 001 closes 3 P0 audit findings from packet 021: `profile.ts:188-197` had 4 inline `||` fallback literals in `resolveActiveProfileModel` (2 stale, contradicting ADR-014); `embeddings.ts:774` had a parallel inline `'jina-embeddings-v3'` (dead code shadowed by registry-derived upstream). The helper `getCanonicalFallback(provider)` from `registry.ts` (shipped by packet 020) is the canonical fix surface.

### Overview

5 edits + 1 new test file. Main-agent direct execution (skipping cli-devin dispatch) chosen because the scope is below the dispatch overhead threshold — same precedent as Phase A of the embedder-fix arc earlier this session.

<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- `getCanonicalFallback` exists in registry.ts (shipped by packet 020) — verified
- profile.ts:185-197 + embeddings.ts:770-780 read for context — verified

### Definition of Done
- All R1–R8 from spec.md §4 satisfied
- Strict-validate this phase exit 0
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Replace `process.env.X || 'literal'` with `process.env.X || getCanonicalFallback(provider)`. Registry remains the single source of truth.

### Key Components

```typescript
// Before (4 sites in profile.ts:resolveActiveProfileModel):
return process.env.HF_EMBEDDINGS_MODEL || 'BAAI/bge-base-en-v1.5';

// After:
return process.env.HF_EMBEDDINGS_MODEL || getCanonicalFallback('hf-local');
```

### Data Flow

Unchanged at the function-interface level. The fallback path now derives from MANIFESTS[0] instead of a stale string literal.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Read profile.ts + embeddings.ts context windows.

### Phase 2: Core Implementation

5 edits (4 in profile.ts switch + 1 in embeddings.ts) + 1 import statement + 1 new test file.

### Phase 3: Verification

- `npm run typecheck:root` exit 0
- `node --experimental-vm-modules shared/dist/embeddings/profile.test.js` 7/7 ok
- Ban-list grep returns 0 hits in production code (only comments + dim-lookups remain, both legitimate)
- Strict-validate phase 001 exit 0
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`shared/embeddings/profile.test.ts` (NEW, 7 assertions, standalone convention matching `shared/predicates/boolean-expr.test.ts`):

- Source-text ban-list (code-only, skipping comments): 3 assertions
- Behavioral invariants via getCanonicalFallback: 4 assertions
- Total: 7/7 ok exit 0
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Packet 020: `getCanonicalFallback` helper in registry.ts
- ADR-014: hf-local fallback = nomic-embed-text-v1.5 (canonical)
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git restore` on profile.ts + embeddings.ts. `git rm` profile.test.ts.

Behavior reverts to pre-022 state: CLI scripts continue writing wrong vector tables (the bug that 022/001 fixes). No DB or state corruption.
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:phase-deps -->
## 8. PHASE DEPENDENCIES

Phase 001 is independent of all other 022 phases. Sequencing places it first because it closes the only CONFIRMED-ACTIVE P0 in the arc.
<!-- /ANCHOR:phase-deps -->

<!-- ANCHOR:effort -->
## 9. EFFORT ESTIMATE

| Phase | Estimate | Actual |
|---|---|---|
| Setup | 5 min | 5 min |
| Edits + test | 15 min | ~10 min |
| Verify | 10 min | 5 min |
| Total | 30 min | ~20 min |
<!-- /ANCHOR:effort -->

<!-- ANCHOR:enhanced-rollback -->
## 10. ENHANCED ROLLBACK

If a downstream consumer relies on the pre-fix `BAAI/bge-base-en-v1.5` fallback (unlikely; would be a bug-on-bug coupling), `git revert` the commit and document in a follow-on packet why the consumer needs explicit `HF_EMBEDDINGS_MODEL` set.
<!-- /ANCHOR:enhanced-rollback -->
