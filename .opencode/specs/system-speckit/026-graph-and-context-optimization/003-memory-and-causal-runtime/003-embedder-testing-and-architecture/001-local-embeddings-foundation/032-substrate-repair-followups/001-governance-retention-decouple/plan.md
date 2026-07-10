---
title: "Plan: Governance Retention Decouple"
description: "Implementation plan and verification evidence for ADR-002 Option A."
trigger_phrases:
  - "governance retention decouple plan"
  - "ADR-002 Option A plan"
  - "DEFAULT_EPHEMERAL_TTL_MS plan"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/001-governance-retention-decouple"
    last_updated_at: "2026-05-14T11:10:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed implementation and verification docs."
    next_safe_action: "Review memory_search provider blocker if needed."
---

# Plan: Governance Retention Decouple

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | TypeScript and dist JavaScript |
| Runtime | Spec Kit MCP server |
| Testing | Vitest |
| Packet | `001-governance-retention-decouple` |

### Overview

Implement ADR-002 Option A by making ephemeral retention independent from audit-governance enforcement. The implementation adds a 24h TTL default, updates source and dist, and verifies the three required input shapes.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Spec read.
- [x] ADR-002 read.
- [x] Source and call-site context read.

### Definition of Done

- [x] Focused vitests pass.
- [x] Existing governance vitests pass.
- [x] Packet docs filled.
- [x] Sandbox cleanup completed.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Keep validation centralized in `scope-governance.ts`. `memory-save.ts` continues calling `validateGovernedIngest()` without special-case retention logic.

### Key Components

- `DEFAULT_EPHEMERAL_TTL_MS`: exported default 24h TTL.
- `requiresGovernedIngest()`: scope/provenance/governed timestamp still trigger governance; ephemeral retention no longer does.
- `validateGovernedIngest()`: non-governed ephemeral inputs receive default `deleteAfter`.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Source Change

- [x] Add TTL constant.
- [x] Remove ephemeral retention as a governance trigger.
- [x] Preserve explicit ephemeral `deleteAfter` without forcing governance.

### Phase 2: Runtime Mirror

- [x] Apply equivalent changes to ignored dist JS.

### Phase 3: Verification

- [x] Add three-case vitest.
- [x] Run focused vitest.
- [x] Run governance regression vitests.
- [x] Attempt live save/search/delete round trip and document provider blocker.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tool |
|-----------|-------|------|
| Unit | Three ephemeral validation cases | Vitest |
| Regression | Existing governance behavior | Vitest |
| Live handler | Save, row inspection, search attempt, delete cleanup | Dist memory tools |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Vitest | Local test runner | Green | Required for focused and regression tests |
| Dist mirror | Runtime JS | Patched | Required because build is broken |
| llama-cpp query embeddings | Local provider | Blocked | Prevented `memory_search` top-3 verification |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the source and dist governance edits, remove `tests/governance-ephemeral-decouple.vitest.ts`, and revert packet doc status if the behavior change is rejected.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Source Change | Spec and ADR read | Tests and dist mirror |
| Runtime Mirror | Source Change | Live handler verification |
| Verification | Source Change and Runtime Mirror | Completion docs |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Actual |
|-------|------------|--------|
| Source Change | Low | Complete |
| Runtime Mirror | Low | Complete |
| Verification | Medium | Complete with documented provider blocker |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

No database migration was introduced. Rollback is file-only and does not require data reversal.

<!-- /ANCHOR:enhanced-rollback -->
