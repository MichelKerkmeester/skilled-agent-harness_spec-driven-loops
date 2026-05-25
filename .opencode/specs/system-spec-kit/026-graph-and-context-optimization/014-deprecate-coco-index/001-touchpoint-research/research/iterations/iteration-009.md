# Iteration 009 - Dynamic/Runtime Touchpoints + Final Coupling Verification

## Focus (dynamic/runtime + final coupling verification)

This iteration hunts for DYNAMIC and RUNTIME couplings that static text-grep on skill names misses. Iteration-008 achieved newInfoRatio=0.07, indicating the static inventory is near-complete. This iteration focuses on runtime imports/requires, MCP tool discovery by name, skill-advisor graph-metadata edges, and health checks that probe localhost:8765 or the coco daemon at runtime.

## Dynamic/runtime touchpoints grep missed

| File (file:line) | Mechanism | Mutation Class | Phase | Note |
|------------------|----------|----------------|-------|------|
| .opencode/bin/lib/ensure-rerank-sidecar.cjs:7-14 | Runtime require() of sidecar dependencies (fs, http, os, path, crypto, childProcess) | DELETE (entire file) | 004-remove-rerank-sidecar-skill | Sidecar helper module itself; captured in iteration-006 as part of sidecar skill deletion |
| .opencode/bin/mk-spec-memory-launcher.cjs:12 | Runtime require() of ensure-rerank-sidecar.cjs | EDIT-remove-import | 003-remove-memory-rerank-path | Already captured in iteration-002 as memory's sidecar integration point |
| .opencode/skills/system-code-graph/mcp_server/lib/shared/cocoindex-path.ts:10 | Runtime import of cocoindex binary path (COCOINDEX_RELATIVE_PATH) | DELETE (entire file) | 002-decouple-code-graph | Part of CCC bridge coupling; cocoindex-path.ts only used by CCC tools |
| .opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:47 | Runtime import of getCocoIndexBinaryPath from cocoindex-path.ts | DELETE (entire file) | 002-decouple-code-graph | CCC readiness probe; only used by ccc_* handlers |
| .opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:10 | Runtime import of getCocoIndexBinaryPath from cocoindex-path.ts | DELETE (entire file) | 002-decouple-code-graph | CCC reindex handler; part of CCC bridge tools |
| .opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:10 | Runtime import of isCocoIndexAvailable from cocoindex-path.ts | EDIT-remove-import | 002-decouple-code-graph | Startup brief checks coco availability; remove this check after CCC deletion |
| .opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:6 | Runtime import of getCocoIndexBinaryPath from cocoindex-path.ts | DELETE (entire file) | 002-decouple-code-graph | Test file for CCC security hardening; remove with CCC tests |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:38 | Runtime HTTP endpoint 'http://localhost:8765/rerank' in PROVIDER_CONFIG.local | EDIT-remove-config | 003-remove-memory-rerank-path | Local sidecar endpoint; remove provider config when memory rerank path is removed |
| .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:209 | Runtime env var check RERANKER_LOCAL for provider resolution | EDIT-remove-logic | 003-remove-memory-rerank-path | Provider resolution logic; remove local provider branch when memory rerank path is removed |

## Coupling verification

### (A) Memory's only sidecar tie: CONFIRMED

**Evidence:**
- `.opencode/bin/mk-spec-memory-launcher.cjs:12` imports `ensureRerankSidecar` from `./lib/ensure-rerank-sidecar.cjs` [SOURCE: iteration-009.md:grep-results]
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:38` defines the local provider endpoint as `http://localhost:8765/rerank` [SOURCE: cross-encoder.ts:38]
- `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts:209` resolves to the 'local' provider when `RERANKER_LOCAL=true` [SOURCE: cross-encoder.ts:209]
- No other runtime imports or requires of sidecar code found in system-spec-kit or other live skills [SOURCE: iteration-009.md:grep-results]

**Conclusion:** Memory's coupling to the sidecar is isolated to:
1. The launcher's `ensureRerankSidecar` import (for sidecar process management)
2. The cross-encoder module's local provider configuration (HTTP endpoint at localhost:8765)
3. The RERANKER_LOCAL env var flag that activates the local provider

No hidden runtime paths detected. Removing these three touchpoints in Phase 003 will fully decouple memory from the sidecar.

### (B) Code-graph's only coco tie: CONFIRMED

**Evidence:**
- `.opencode/skills/system-code-graph/mcp_server/lib/shared/cocoindex-path.ts` provides `getCocoIndexBinaryPath` and `isCocoIndexAvailable` [SOURCE: cocoindex-path.ts:35-56]
- `.opencode/skills/system-code-graph/mcp_server/lib/ccc-readiness-probe.ts:47` imports `getCocoIndexBinaryPath` for CCC readiness checks [SOURCE: ccc-readiness-probe.ts:47]
- `.opencode/skills/system-code-graph/mcp_server/handlers/ccc-reindex.ts:10` imports `getCocoIndexBinaryPath` for CCC reindex operations [SOURCE: iteration-009.md:grep-results]
- `.opencode/skills/system-code-graph/mcp_server/lib/startup-brief.ts:10` imports `isCocoIndexAvailable` for startup coco availability check [SOURCE: iteration-009.md:grep-results]
- `.opencode/skills/system-code-graph/mcp_server/tests/lib/security-hardening.vitest.ts:6` imports `getCocoIndexBinaryPath` for CCC security tests [SOURCE: iteration-009.md:grep-results]
- No other runtime imports or requires of cocoindex code found in system-code-graph [SOURCE: iteration-009.md:grep-results]

**Conclusion:** Code-graph's coupling to CocoIndex is isolated to the CCC bridge:
1. The cocoindex-path.ts module (binary path resolution)
2. The ccc-readiness-probe.ts module (readiness checks for CCC tools)
3. The ccc-reindex.ts handler (CCC reindex tool)
4. The startup-brief.ts import of isCocoIndexAvailable (startup availability check)
5. The security-hardening.vitest.ts test (CCC security tests)

No hidden runtime dependencies detected. Removing these files in Phase 002 will fully decouple code-graph from CocoIndex. The 8 remaining code-graph tools (code_graph_scan, code_graph_query, code_graph_status, code_graph_context, code_graph_classify_query_intent, code_graph_verify, code_graph_apply, detect_changes) have no coco dependencies.

## skill-graph recompile requirement

**Requirement:** After editing the 6 `graph-metadata.json` files identified in iteration-008, the compiled `skill-graph.json` must be regenerated by running the skill-graph compiler.

**Evidence:**
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:20` includes `mcp-coco-index` in the `families.mcp` array [SOURCE: skill-graph.json:20]
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:139-148` contains adjacency entries for `mcp-coco-index` (enhances system-spec-kit, siblings with system-rerank-sidecar, prerequisite_for system-skill-advisor) [SOURCE: skill-graph.json:139-148]
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:232` shows system-skill-advisor depends_on mcp-coco-index [SOURCE: skill-graph.json:232]
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:239` shows system-skill-advisor enhances mcp-coco-index [SOURCE: skill-graph.json:239]
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:215` shows system-code-graph enhances mcp-coco-index [SOURCE: skill-graph.json:215]
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:356-361` includes semantic search signals for mcp-coco-index [SOURCE: skill-graph.json:356-361]
- `.opencode/skills/system-skill-advisor/mcp_server/scripts/skill-graph.json:522` lists mcp-coco-index as a hub skill [SOURCE: skill-graph.json:522]

**Recompile command:**
```bash
cd .opencode/skills/system-skill-advisor/mcp_server/scripts
python skill_graph_compiler.py --export-json
```

**Verification:** After recompilation, verify that:
1. `mcp-coco-index` is removed from `families.mcp` array
2. All adjacency entries for `mcp-coco-index` are removed
3. `system-rerank-sidecar` is removed from `families.system` array
4. All adjacency entries for `system-rerank-sidecar` are removed
5. Hub skills list no longer includes `mcp-coco-index`
6. Semantic search signals for `mcp-coco-index` are removed

## Open uncertainties for deepseek closers

1. **Feature catalog CCC files classification:** Iteration-003 noted that system-code-graph SKILL.md RESOURCE_MAP references `feature_catalog/07--ccc-integration/01-ccc-reindex.md`, `02-ccc-feedback.md`, `03-ccc-status.md` [SOURCE: iteration-003.md:104]. These files need to be located and classified (DELETE vs EDIT-decouple) for inclusion in Phase 002 or 007.

2. **Install guide script references:** Iteration-005 noted `install_scripts/README.md` references `install-cocoindex-code.sh` [SOURCE: iteration-005.md:90]. Need to verify if this script exists and classify it for deletion in Phase 005 or 008.

3. **HuggingFace cache cleanup policy:** Iteration-006 identified the HuggingFace model caches as shared-optional [SOURCE: iteration-006.md:32-33]. Need to define the explicit policy: leave as shared infrastructure, or provide optional cleanup instructions for operators who want to reclaim disk space.

4. **Runtime artifact verification procedures:** Iteration-006 noted the need for exact verification commands for runtime-cleanup items [SOURCE: iteration-006.md:62]. Need to define the safe procedures for: killing daemon processes, releasing port bindings, removing telemetry logs, and verifying no orphan processes remain.

5. **Integration testing strategy:** Need to define the integration test plan for verifying the system works end-to-end after all phases complete. This should include: memory search with fallback scoring, code-graph structural queries, agent/command tool routing, and MCP server startup across all 4 runtimes.

6. **descriptions.json scope clarification:** The `.opencode/specs/descriptions.json` file contains ~75 historical spec references to cocoindex/coco-index/mcp-coco-index. Per the scope charter, `.opencode/specs/**` is FROZEN (LEAVE-historical). Need to confirm this includes descriptions.json or if it should be treated as a runtime index that requires cleanup.

7. **Startup-brief.ts coco availability check:** The `startup-brief.ts:10` import of `isCocoIndexAvailable` needs to be removed in Phase 002, but we need to verify if removing this check breaks any startup contracts or readiness reporting that depends on coco availability signals.

8. **Health/doctor probes:** No runtime health checks or doctor probes that directly probe `localhost:8765` or the coco daemon were found in the live codebase. However, need to verify if any external health monitoring systems or CI checks depend on these endpoints.
