---
title: "Implementation Plan: 116/002 - Seeded Fixture Harness"
description: "Level 2 plan for authoring review-depth v2 seeded fixtures before downstream implementation phases."
trigger_phrases:
  - "116 seeded fixture plan"
  - "review-depth fixture harness"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/002-deep-review/002-complexity-seeded-fixture-harness"
    last_updated_at: "2026-05-22T11:19:32Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Authored Level 2 plan for seeded fixtures."
    next_safe_action: "Use failing fixtures as gates for phases 004-007."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1160021000000000000000000000000000000000000000000000000000000000"
      session_id: "116-002-plan"
      parent_session_id: "116-002-seeded-fixture-harness"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Use node-typescript-vitest verification for the OPENCODE surface."
---
# Implementation Plan: 116/002 - Seeded Fixture Harness

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript Vitest fixtures, JSONL review records, CommonJS reducer import |
| **Framework** | Vitest under `.opencode/skills/system-spec-kit/mcp_server` |
| **Storage** | Temp directories for synthetic review state and coverage-graph SQLite DBs |
| **Testing** | Targeted Vitest run, TypeScript typecheck for MCP server, strict spec validation |

### Overview

Phase 002 adds fixture files only. The tests encode the v2 review-depth contract and are intentionally red, todo, or skipped against today's implementation so phases 004 through 007 have precise behavioral targets.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Parent phase map read and scope boundary confirmed.
- [x] Phase 001 research synthesis read and frozen v2 contract extracted.
- [x] Existing validator Vitest style inspected.
- [x] Reducer, convergence, graph DB, and graph upsert surfaces inspected.

### Definition of Done

- [x] Level 2 spec docs populated.
- [x] Four review-depth fixture files created.
- [x] Targeted Vitest command loads all four fixture files and reports expected today-red/todo/skip behavior.
- [x] Metadata refreshed with `generate-context.js`.
- [x] Strict validation passes for the phase folder.

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Fixture-first hardening. Each test file points at a downstream implementation owner:

- Phase 004 owns validator v2 enforcement.
- Phase 005 owns reducer/search-ledger persistence.
- Phase 006 owns candidate saturation and graphless fallback gates.
- Phase 007 owns ledger-led graph vocabulary.

### Key Components

- **Validator fixtures**: synthetic iteration markdown plus state-log and delta JSONL paths passed to `validateIterationOutputs`.
- **Reducer fixture**: temp review artifact root passed to `reduceReviewState(..., { write: false })`.
- **Convergence fixture**: isolated coverage-graph handler invocation against an empty graph namespace.
- **Graph fixture**: isolated upsert handler invocation with future review node kinds.

### Data Flow

1. Tests create temp review artifacts with explicit v2 fields.
2. Current production helpers are invoked unchanged.
3. Assertions document the future required outcome.
4. Todo/skip/failing cases remain as visible gates for later phases.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup + Spec Docs

- [x] Read parent phase map and frozen research synthesis.
- [x] Read Level 2 templates.
- [x] Upgrade phase 002 docs from scaffold to Level 2.
- [x] Declare OPENCODE TypeScript/Vitest routing.

### Phase 2: Fixture Authoring

- [x] Add validator v2 fixtures.
- [x] Add reducer search-debt fixture.
- [x] Add convergence graphless fallback fixture.
- [x] Add graph vocabulary fixture.

### Phase 3: Verification

- [x] Run MCP server TypeScript typecheck.
- [x] Run targeted `review-depth-` Vitest command and capture intentional red/todo/skip output.
- [x] Refresh description and graph metadata.
- [x] Run strict spec validation.

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Typecheck | MCP server TypeScript production source | `pnpm --dir .opencode/skills/system-spec-kit/mcp_server exec tsc --noEmit --composite false -p tsconfig.json --ignoreDeprecations 6.0` |
| Targeted fixture run | `review-depth-*.vitest.ts` files | `pnpm vitest run --no-coverage review-depth-` |
| Spec docs | Phase 002 Level 2 folder | `validate.sh --strict` |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 research synthesis | Spec evidence | Green | Frozen v2 contract would be ambiguous. |
| Current validator helper | Test import | Green | Validator fixture file would not load. |
| Deep-review reducer export | Test import | Green | Reducer fixture would need CLI spawning instead. |
| Coverage graph handlers | Test import | Green | Convergence and graph vocabulary fixtures would need MCP-level harnessing. |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Fixture files break TypeScript loading or accidentally modify production behavior.
- **Procedure**: Remove the four new `review-depth-*.vitest.ts` files and restore the phase 002 docs to their prior scaffold.
- **Data Reversal**: No durable runtime data is written; all test artifacts use temp directories.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup + spec docs) -> Phase 2 (Fixture authoring) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup + spec docs | Parent phase map, Phase 001 synthesis | Fixture authoring |
| Fixture authoring | Existing test/helper conventions | Verification |
| Verification | Fixture files and metadata refresh | Phase 003+ handoff |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup + spec docs | Medium | 45 minutes |
| Fixture authoring | Medium | 90 minutes |
| Verification | Medium | 45 minutes |
| **Total** | | **3 hours** |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-merge Checklist

- [x] No production deep-review or coverage-graph files modified.
- [x] Fixture files are additive.
- [x] Spec metadata regenerated after docs were authored.

### Rollback Procedure

1. Delete the four `review-depth-*.vitest.ts` files.
2. Restore phase 002 docs from the previous scaffold if needed.
3. Re-run strict spec validation.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Temp test directories are cleaned automatically; no database migration is involved.

<!-- /ANCHOR:enhanced-rollback -->
