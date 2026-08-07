# Evidence Command Notes

## Annotation Coverage Counts
Command scope: non-test `.ts` files under `mcp_server/` and `shared/`, excluding `tests`, `dist`, and `node_modules`.

Result: `437` source files, `195` files with one or more `// Feature catalog:` annotations.

Adding `scripts/` to the same source scope produced `563` files and still only `195` annotated files.

## Scenario 135 Sample Greps
`Hybrid search pipeline` returned one handler hit and multiple lib hits under `mcp_server/`.

`Classification-based decay` returned one handler hit and multiple lib hits under `mcp_server/`.

`Prediction-error save arbitration` returned handler save/gating hits plus a lib cognitive hit under `mcp_server/`.

## Scenario 136 Annotation Validity
Unique annotation names extracted from `mcp_server/` and `shared/`: `126`.

Catalog H3 headings extracted from `feature_catalog/feature_catalog.md`: `238`.

Invalid annotation names after exact comparison: `0`.

## Stale Label Search
Representative non-test source comments still include phase-style labels:

- `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts:54`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/memory-surface.ts:372`
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts:202`
