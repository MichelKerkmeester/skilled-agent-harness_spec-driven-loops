---
title: "Implementation Summary: 022/007"
description: "Code-graph constants consolidated to CODE_GRAPH_DEFAULTS with 5 SPECKIT_CODE_GRAPH_* env-var overrides. 6 P1 + 10 P2 closed."
trigger_phrases: ["022/007 shipped"]
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/032-code-graph-scatter/016-code-graph-p1-config-extraction"
    last_updated_at: "2026-05-23T18:20:00Z"
    last_updated_by: "main_agent"
    recent_action: "Shipped via cli-opencode"
    next_safe_action: "Arc convergence — all 10 phases shipped"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/lib/config-defaults.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/budget-allocator.ts"
      - ".opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts"
      - ".opencode/skills/system-code-graph/mcp_server/tests/config-defaults.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000002275"
      session_id: "016-002-022-007-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: ["6 P1 + 10 P2 closed; 15/15 invariant test pass"]
---
<!-- SPECKIT_TEMPLATE_SOURCE: implementation-summary-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Implementation Summary: 022/007 Code-Graph P1 Config Extraction

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|---|---|
| Status | Complete |
| Shipped | 2026-05-23 |
| Files changed | 8 (2 new + 6 modified) |
| Typecheck | exit 0 |
| Vitest | 58 pass + new 15/15 invariant test; 1 pre-existing failure unrelated |
| Findings closed | 6 P1 + 10 P2 |
| Wall-clock | ~7 min cli-opencode dispatch |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## 2. WHAT WAS BUILT

### New: `config-defaults.ts`

`CODE_GRAPH_DEFAULTS` object with:
- `ttlMs` (default 60000, override `SPECKIT_CODE_GRAPH_TTL_MS`)
- `findFilesMaxDepth` (default 20, override `SPECKIT_CODE_GRAPH_FIND_FILES_MAX_DEPTH`)
- `quarantineAgeDays` (default 14, override `SPECKIT_CODE_GRAPH_QUARANTINE_AGE_DAYS`)
- `floors` (DEFAULT_FLOORS shape, JSON override `SPECKIT_CODE_GRAPH_FLOORS_JSON`)
- `edgeWeights` (DEFAULT_EDGE_WEIGHTS shape, JSON override `SPECKIT_CODE_GRAPH_EDGE_WEIGHTS_JSON`)

`parsePositiveInt` helper for scalar env-var overrides; JSON parse with try/catch + warning + fallback for object overrides; partial JSON merge with defaults.

### New: `tests/config-defaults.vitest.ts`

15-assertion invariant test covering defaults, env-var overrides, JSON partial merges, and shape preservation.

### Updated consumers (5 files)

- `owner-lease.ts:62` `DEFAULT_TTL_MS = CODE_GRAPH_DEFAULTS.ttlMs`
- `structural-indexer.ts:88` `FIND_FILES_MAX_DEPTH = CODE_GRAPH_DEFAULTS.findFilesMaxDepth`
- `apply-orchestrator.ts:100` `DEFAULT_QUARANTINE_AGE_DAYS = CODE_GRAPH_DEFAULTS.quarantineAgeDays`
- `budget-allocator.ts:34` `export const DEFAULT_FLOORS = CODE_GRAPH_DEFAULTS.floors`
- `indexer-types.ts:24` `export const DEFAULT_EDGE_WEIGHTS: Readonly<Record<EdgeType, number>> = CODE_GRAPH_DEFAULTS.edgeWeights as Readonly<Record<EdgeType, number>>`

### ENV_REFERENCE.md

5 new rows under a new `## CODE GRAPH` section documenting the env vars.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## 3. HOW IT WAS DELIVERED

cli-opencode + deepseek-v4-pro --variant high single-wave dispatch. PID 63466. ~7 min wall-clock. Prompt at /tmp/007-prompt.md. Dispatch self-reported PHASE 007 STATUS block confirmed all PASS.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## 4. KEY DECISIONS

- **DEFAULT_FATAL_PARSE_ERROR_RATIO over-flag rebutted.** Council listed this but investigation confirmed it doesn't exist in current code. Skipped.
- **`as Readonly<Record<EdgeType, number>>` assertion preserved type narrowing** for DEFAULT_EDGE_WEIGHTS downstream consumers; CODE_GRAPH_DEFAULTS.edgeWeights uses Record<string, number> internally.
- **DEFAULT_FLOORS + DEFAULT_EDGE_WEIGHTS exports kept** (not removed) — downstream `import { DEFAULT_FLOORS }` callers continue working without coordinated edits.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## 5. VERIFICATION

Per dispatch self-report:
- config-defaults.ts created
- 5 consumer imports wired (1 decl + 10 consumer refs = 11 grep hits)
- ENV_REFERENCE.md +5 rows
- 15/15 invariant test pass
- 58 vitest pass + new test
- typecheck:root exit 0
- Bundle gate PASS
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## 6. KNOWN LIMITATIONS

- Pre-existing TS6307 errors when running system-code-graph's own tsc (cross-project ref to system-spec-kit/shared/embeddings/registry.ts introduced by 005). Doesn't affect typecheck:root or behavior.
- 10 P2 audit findings effectively closed by the consolidation pattern (subsumed into CODE_GRAPH_DEFAULTS) but not individually documented.

### Commit Handoff

```
fix(022/007): code-graph config extraction via cli-opencode + deepseek-v4-pro

Closes 6 P1 + 10 P2 audit findings via cli-opencode dispatch:
- NEW config-defaults.ts: CODE_GRAPH_DEFAULTS object + 5 SPECKIT_CODE_GRAPH_*
  env-var overrides (TTL_MS, FIND_FILES_MAX_DEPTH, QUARANTINE_AGE_DAYS, FLOORS_JSON,
  EDGE_WEIGHTS_JSON) + parsePositiveInt helper.
- 5 consumer files wired: owner-lease, structural-indexer, apply-orchestrator,
  budget-allocator, indexer-types.
- NEW config-defaults.vitest.ts: 15 invariant assertions covering defaults +
  env-var overrides + JSON partial merges + shape preservation.
- ENV_REFERENCE.md: 5 new SPECKIT_CODE_GRAPH_* rows.

Bundle gate PASS: typecheck exit 0; vitest 58 pass + new 15/15; 1 pre-existing
failure (code-graph-siblings-readiness) confirmed unrelated.
```

Paths:

```
.opencode/skills/system-code-graph/mcp_server/lib/config-defaults.ts (NEW)
.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts
.opencode/skills/system-code-graph/mcp_server/lib/structural-indexer.ts
.opencode/skills/system-code-graph/mcp_server/lib/apply-orchestrator.ts
.opencode/skills/system-code-graph/mcp_server/lib/budget-allocator.ts
.opencode/skills/system-code-graph/mcp_server/lib/indexer-types.ts
.opencode/skills/system-code-graph/mcp_server/tests/config-defaults.vitest.ts (NEW)
.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md
.opencode/specs/system-spec-kit/.../022-.../007-code-graph-p1-config-extraction/
```
<!-- /ANCHOR:limitations -->
