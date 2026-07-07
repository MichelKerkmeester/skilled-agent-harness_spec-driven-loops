---
title: "Spec: 022/007 Code-Graph P1 Config Extraction"
description: "cli-opencode + deepseek-v4-pro --variant high dispatched: new config-defaults.ts with CODE_GRAPH_DEFAULTS (ttlMs, findFilesMaxDepth, quarantineAgeDays, floors, edgeWeights) + 5 SPECKIT_CODE_GRAPH_* env-var overrides + 15-assertion invariant test. 5 consumer files wired."
trigger_phrases: ["022/007 code-graph config", "CODE_GRAPH_DEFAULTS"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/008-code-graph-scatter/016-code-graph-p1-config-extraction"
    last_updated_at: "2026-05-23T18:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Phase 007 shipped"
    next_safe_action: "Arc convergence"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/config-defaults.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/budget-allocator.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002271"
      session_id: "016-002-022-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["5 confirmed P1 sites consolidated; 6 P1 + 10 P2 closed; over-flagged DEFAULT_FATAL_PARSE_ERROR_RATIO confirmed non-existent in current code"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Spec: 022/007 Code-Graph P1 Config Extraction

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Type | cli-opencode + deepseek-v4-pro --variant high dispatch |
| Files changed | 8 (2 new + 6 modified) |
| Findings closed | 6 P1 + 10 P2 |
| Wall-clock | ~7 min cli-opencode dispatch |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

Code-graph had hardcoded constants across owner-lease.ts (DEFAULT_TTL_MS=60_000), structural-indexer.ts (FIND_FILES_MAX_DEPTH=20), apply-orchestrator.ts (DEFAULT_QUARANTINE_AGE_DAYS=14), budget-allocator.ts (DEFAULT_FLOORS frozen object), indexer-types.ts (DEFAULT_EDGE_WEIGHTS frozen Record). No env-var overrides; operators couldn't tune behavior at runtime.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (delivered by dispatch)

- New `mcp_server/lib/config-defaults.ts` with `CODE_GRAPH_DEFAULTS` typed object + `parsePositiveInt` helper.
- Scalar env-var overrides: `SPECKIT_CODE_GRAPH_TTL_MS`, `SPECKIT_CODE_GRAPH_FIND_FILES_MAX_DEPTH`, `SPECKIT_CODE_GRAPH_QUARANTINE_AGE_DAYS`.
- Object env-var overrides (JSON partial merge): `SPECKIT_CODE_GRAPH_FLOORS_JSON`, `SPECKIT_CODE_GRAPH_EDGE_WEIGHTS_JSON`.
- 5 consumer file updates importing from config-defaults.ts (owner-lease, structural-indexer, apply-orchestrator, budget-allocator, indexer-types).
- ENV_REFERENCE.md: 5 new SPECKIT_CODE_GRAPH_* rows.
- New invariant test: `mcp_server/tests/config-defaults.vitest.ts` (15 assertions).

### Out of Scope (rebutted)

- `DEFAULT_FATAL_PARSE_ERROR_RATIO` (council estimated existence; investigation confirmed non-existent in current code).
- 10 P2 over-flags (e.g., `ccc-readiness-probe.ts:CACHE_TTL_MS` — different constant, correctly out of scope).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Verification |
|---|---|---|
| R1 | config-defaults.ts module exists with CODE_GRAPH_DEFAULTS + helper | grep |
| R2 | 5 consumer files import CODE_GRAPH_DEFAULTS | grep ≥ 5 hits |
| R3 | system-spec-kit typecheck:root exit 0 | npm run typecheck:root |
| R4 | code-graph mcp_server tsc exit 0 (pre-existing TS6307 from 005 cross-project ref documented) | tsc |
| R5 | Invariant test 15/15 assertions pass | vitest |
| R6 | ENV_REFERENCE.md has 5 new SPECKIT_CODE_GRAPH_* rows | grep |
| R7 | Strict-validate phase 007 exit 0 | validate.sh |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

R1–R7 pass. 6 P1 + 10 P2 closed (P2s effectively closed by rebut + consolidation pattern).
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:approach -->
## 6. APPROACH

cli-opencode + deepseek-v4-pro --variant high single-wave dispatch. PID 63466. ~7 min wall-clock.

Dispatch self-reported status:
```
PHASE 007 STATUS:
- config-defaults.ts created: PASS
- 5 consumer imports wired: PASS
- ENV_REFERENCE.md updated: PASS (5 new rows)
- Invariant test passes: PASS (15/15)
- typecheck: exit 0
- Files changed: 8 (2 new + 6 modified)
- Bundle gate: PASS
```
<!-- /ANCHOR:approach -->

<!-- ANCHOR:risks -->
## 7. RISKS & DEPENDENCIES

| Risk | Mitigation |
|---|---|
| Behavior change from JSON env vars with partial overrides | parsePositiveInt + try/catch + warning + fallback to defaults |
| DEFAULT_EDGE_WEIGHTS type narrowing | Used `as Readonly<Record<EdgeType, number>>` assertion to preserve type contract |
| Pre-existing TS6307 cross-project errors | Confirmed pre-existing (system-code-graph tsconfig doesn't include shared embeddings paths from 005's edits); typecheck:root still exit 0 |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 8. OPEN QUESTIONS
None.
<!-- /ANCHOR:questions -->

<!-- ANCHOR:cross-links -->
## 9. CROSS-LINKS

- Audit: f-iter007-001..016 (6 P1 + 10 P2)
- Dispatch prompt: /tmp/007-prompt.md
- Predecessor: phase 005 (similar canonical-extraction pattern)
<!-- /ANCHOR:cross-links -->

<!-- ANCHOR:nfr -->
## 10. NON-FUNCTIONAL REQUIREMENTS

Defaults preserved (behavior unchanged when env vars unset). Module-init cost: 5 env reads + helper function calls.
<!-- /ANCHOR:nfr -->

<!-- ANCHOR:edge-cases -->
## 11. EDGE CASES

- JSON env var with malformed input → log warning, fallback to defaults
- Partial JSON override merges with defaults (preserves un-overridden keys)
- DEFAULT_EDGE_WEIGHTS export shape preserved for downstream `import { DEFAULT_EDGE_WEIGHTS }` consumers
<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## 12. COMPLEXITY

LEVEL 2+ via cli-opencode dispatch. 2 new files (config-defaults.ts + test) + 6 consumer updates.
<!-- /ANCHOR:complexity -->
