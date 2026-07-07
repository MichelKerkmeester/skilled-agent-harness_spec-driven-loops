# Iteration 007 - RQ6 Deprecation Phase DAG + Ordering + Risk

## Focus (RQ6)

Synthesize the dependency-ordered deprecation PHASE DAG from all prior findings (iterations 001-006). This is the planning output that becomes the 002+ phase children of 014.

## Phase DAG

| Phase | Scope | Depends on | Verify gate | Rollback | ~Files |
|-------|-------|------------|-------------|----------|--------|
| 002-decouple-code-graph | Sever CCC bridge coupling from system-code-graph (ccc_* tools, semantic routing, integration docs, SKILL.md refs) [SOURCE: iteration-003.md] | None (first phase) | `vitest run --exclude '*ccc*' --exclude '*cocoindex*'` in system-code-graph; TypeScript compilation; MCP server starts with 8 tools | Git commit before phase | ~20 files (tool-schemas.ts, handlers, query-intent-classifier.ts, SKILL.md, ARCHITECTURE.md, README.md, tests) |
| 003-remove-memory-rerank-path | Remove mk-spec-memory local cross-encoder provider + ensure-rerank-sidecar.cjs integration + SPECKIT_CROSS_ENCODER/RERANKER_LOCAL flags [SOURCE: iteration-002.md] | 002-decouple-code-graph (no dependency, but logical sequencing) | `mk-spec-memory` MCP server starts without sidecar; memory search returns positional fallback scores; verify `scoringMethod:'fallback'` in results | Git commit before phase | ~5 files (cross-encoder.ts, search-flags.ts, mk-spec-memory-launcher.cjs, ensure-rerank-sidecar.cjs, ENV_REFERENCE.md) |
| 004-remove-rerank-sidecar-skill | Delete system-rerank-sidecar skill folder + .venv + scripts + tests [SOURCE: iteration-006.md] | 003-remove-memory-rerank-path (memory no longer consumes sidecar) | Verify `.opencode/skills/system-rerank-sidecar/` does not exist; verify port 8765 not in use (`lsof -i :8765`); verify no process named `rerank_sidecar` | Git commit before phase | ~30 files (entire skill folder: scripts/, tests/, pyproject.toml, SKILL.md) |
| 005-remove-coco-index-skill | Delete mcp-coco-index skill folder + .venv + scripts + CCC CLI [SOURCE: iteration-006.md] | 002-decouple-code-graph (code-graph no longer calls coco) | Verify `.opencode/skills/mcp-coco-index/` does not exist; verify `~/.cocoindex_code/` daemon runtime cleaned; verify `.cocoindex_code/` repo index removed | Git commit before phase | ~40 files (entire skill folder: mcp_server/, scripts/, SKILL.md, CCC CLI) |
| 006-runtime-configs-4runtime-mirror | Remove cocoindex_code MCP registrations from opencode.json, .vscode/mcp.json, .gemini/settings.json, .codex/config.toml; remove RERANK_SIDECAR_PORT env vars; remove coco from agent/command frontmatter across 4 runtimes [SOURCE: iteration-005.md] | 004-remove-rerank-sidecar-skill, 005-remove-coco-index-skill (skills deleted before config cleanup) | Verify no `cocoindex_code` in any runtime config; verify no `RERANK_SIDECAR_PORT` in any env block; verify agent/command frontmatter has no coco references | Git commit before phase | ~97 files (4 runtime configs + 49 mirrored command files + agent files + doctor assets) |
| 007-docs-readme-search-routing | Rewrite semantic-search routing docs per HYBRID policy (Grep + code-graph); remove coco from README, install guides, AGENTS.md, CLAUDE.md SEARCH ROUTING [SOURCE: iteration-004.md] | 006-runtime-configs-4runtime-mirror (configs cleaned before doc updates) | Verify no semantic-search references to CocoIndex; verify decision trees show Grep + code-graph path; verify no coco in README feature tables | Git commit before phase | ~30 files (README.md, install guides, AGENTS.md, CLAUDE.md, agent docs) |
| 008-runtime-artifacts-cleanup | Clean venvs, daemon sockets/pids, telemetry logs, git hooks, orphan MCP sweeper logic [SOURCE: iteration-006.md] | 004-remove-rerank-sidecar-skill, 005-remove-coco-index-skill (skills deleted before runtime cleanup) | Verify no `.venv/` directories for deleted skills; verify `~/.cocoindex_code/` gone; verify `~/Library/Logs/spec-kit/sidecar-reaper.jsonl` gone; verify port 8765 free; verify git hooks updated | Git commit before phase | ~8 items (venvs, daemon runtime, telemetry, hooks, sweeper script) |

## Ordering rationale

**Hard constraint: DECOUPLE BEFORE DELETE**

The phase ordering follows the dependency graph to avoid breaking the system during deprecation:

1. **Decouple code-graph first (Phase 002)**: system-code-graph has active coupling to CocoIndex via the CCC bridge (ccc_status/reindex/feedback tools, semantic routing, hybrid seeds). If we delete coco-index before decoupling, code-graph MCP server will fail to start (missing tool registrations) and semantic routing will break. The decouple edit-set [SOURCE: iteration-003.md] severs this coupling while keeping the structural skill green.

2. **Remove memory rerank path before sidecar deletion (Phase 003 before 004)**: mk-spec-memory is the only non-coco consumer of the rerank sidecar [SOURCE: iteration-002.md]. It calls the sidecar via the local cross-encoder provider (`http://localhost:8765/rerank`). If we delete the sidecar first, memory will fail when `RERANKER_LOCAL=true` is set. Removing the local provider path first ensures memory falls back to positional scoring safely.

3. **Delete sidecar before coco-index (Phase 004 before 005)**: The sidecar is a dependency of coco-index (COCOINDEX_RERANK_VIA_SIDECAR flag [SOURCE: iteration-001.md]). However, since we've already removed memory's consumption (Phase 003), the sidecar has no remaining consumers. Deleting it before coco-index simplifies the coco-index deletion (no sidecar references to clean).

4. **Delete skills before runtime configs (Phases 004-005 before 006)**: Runtime configs (opencode.json, .vscode/mcp.json, .gemini/settings.json, .codex/config.toml) register the MCP servers for these skills. If we remove the registrations before deleting the skill folders, the MCP servers might still be referenced in agent/command frontmatter, causing tool load failures. Deleting skills first ensures the registrations are stale before cleanup.

5. **Runtime configs before docs (Phase 006 before 007)**: Documentation should reflect the final system state. If we update docs before cleaning configs, the docs might claim coco is removed while runtime configs still register it, creating confusion. Cleaning configs first ensures docs match the actual runtime state.

6. **Runtime artifacts last (Phase 008)**: Venvs, daemon sockets, and telemetry logs are runtime artifacts that persist after skill deletion. Cleaning them last ensures no processes are still trying to use the deleted skills (verified by earlier phases).

## Risk register

| Risk | Phase | Impact | Mitigation |
|------|-------|--------|------------|
| Memory rerank regression | 003-remove-memory-rerank-path | High - mk-spec-memory loses neural cross-encoder reranking, degrading result quality for opt-in users | Fallback is positional scoring with `scoringMethod:'fallback'` marker [SOURCE: iteration-002.md]; verify memory search still returns results; document that `SPECKIT_CROSS_ENCODER` and `RERANKER_LOCAL` flags become no-ops |
| Semantic-search vacuum | 002-decouple-code-graph, 007-docs-readme-search-routing | High - "find code by concept" queries lose semantic backend; users must know exact tokens | HYBRID policy repoints to Grep + code-graph [SOURCE: iteration-004.md]; update decision trees and routing guidance; add Grep pattern construction tips; verify code-graph structural queries work for unknown implementations |
| 4-runtime drift | 006-runtime-configs-4runtime-mirror | Medium - inconsistent cleanup across opencode/claude/gemini/codex runtimes causes behavior divergence | Use the mirror multiplier table from iteration-005; verify each runtime config has no coco references; run agent/command smoke tests in each runtime; use git diff to ensure all mirrors are updated |
| MCP-registration breakage | 006-runtime-configs-4runtime-mirror | Medium - removing MCP server blocks incorrectly breaks tool loading for other servers | Verify JSON/TOML syntax after edits; test MCP server startup for remaining servers (mk-spec-memory, mk-code-index); check for trailing commas or malformed blocks |
| Daemon orphan | 004-remove-rerank-sidecar-skill, 008-runtime-artifacts-cleanup | Medium - rerank-sidecar FastAPI process continues running after skill deletion, causing port conflicts | Verify `lsof -i :8765` shows no process before Phase 004; kill any remaining `rerank_sidecar` processes; clean `~/.cocoindex_code/` daemon runtime; verify sidecar reaper telemetry log is gone |
| Code-graph test coverage loss | 002-decouple-code-graph | Low - removing CCC-specific tests might reduce coverage for remaining 8 tools | Run test suite excluding CCC tests; verify all non-CCC tests pass; add new tests if coverage gaps emerge; use `vitest run --exclude '*ccc*' --exclude '*cocoindex*'` as verify gate |
| Feature catalog orphan files | 002-decouple-code-graph | Low - CCC feature catalog files (01-ccc-reindex.md, 02-ccc-feedback.md, 03-ccc-status.md) not located/classified | Locate these files in iteration-008 gap analysis; classify as DELETE (no CCC tools remain) or EDIT-decouple (if they contain non-CCC content); remove RESOURCE_MAP references from system-code-graph SKILL.md |

## Negative knowledge (NOT in scope)

The following items appear related to the deprecation but are explicitly OUT OF SCOPE per the strategy charter [SOURCE: deep-research-strategy.md]:

- **Frozen historical spec docs under `.opencode/specs/**`**: ~2170 files in system-spec-kit specs alone reference coco/cocoindex/ccc. These are LEAVE-historical per operator directive 2026-05-25. Do not edit or delete these files.

- **Cloud rerankers (voyage/cohere)**: Already removed in specs 022/013. Not part of this deprecation. Do not re-add or reference them.

- **mk-spec-memory embeddings or non-rerank retrieval channels**: Only the cross-encoder reranking path is in scope. Do not change embeddings, BM25, RRF, or other Stage 1-2 pipeline features [SOURCE: deep-research-strategy.md].

- **Shared HuggingFace model cache**: `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B` and `models--nomic-ai--CodeRankEmbed` are shared infrastructure used by other projects. Marked as shared-optional in iteration-006. Do not delete as part of this deprecation unless explicitly requested.

- **code-graph structural core**: The 8 remaining tools (code_graph_scan, code_graph_query, code_graph_status, code_graph_context, code_graph_classify_query_intent, code_graph_verify, code_graph_apply, detect_changes) and their structural indexing functionality are KEEP. Only the CCC bridge coupling is removed.

- **mk-code-index MCP server**: The server itself stays (it hosts the 8 remaining code-graph tools). Only the ccc_* tool registrations are removed.

- **system-spec-kit core**: The spec-kit runtime, memory search, and other MCP servers are not being deprecated. Only the rerank-sidecar integration point is removed.

## Gaps for next iteration

1. **RQ1 dedup/completeness sweep**: Iteration 001 seeded the inventory with 37 touchpoints, but iterations 002-006 discovered additional surfaces (4-runtime mirrors, deletion artifacts, feature catalog files). Iteration 008 should perform a final dedup pass to ensure no touchpoints are double-counted or missed across the 6 prior iterations.

2. **Feature catalog CCC files**: Iteration-003 noted that system-code-graph SKILL.md RESOURCE_MAP references `feature_catalog/07--ccc-integration/01-ccc-reindex.md`, `02-ccc-feedback.md`, `03-ccc-status.md` [SOURCE: iteration-003.md:104]. These files need to be located and classified (DELETE vs EDIT-decouple) for inclusion in Phase 002 or 007.

3. **Install guide script references**: Iteration-005 noted `install_scripts/README.md` references `install-cocoindex-code.sh` [SOURCE: iteration-005.md:90]. Need to verify if this script exists and classify it for deletion in Phase 005 or 008.

4. **HuggingFace cache cleanup policy**: Iteration-006 identified the HuggingFace model caches as shared-optional [SOURCE: iteration-006.md:32-33]. Need to define the explicit policy: leave as shared infrastructure, or provide optional cleanup instructions for operators who want to reclaim disk space.

5. **Runtime artifact verification procedures**: Iteration-006 noted the need for exact verification commands for runtime-cleanup items [SOURCE: iteration-006.md:62]. Need to define the safe procedures for: killing daemon processes, releasing port bindings, removing telemetry logs, and verifying no orphan processes remain.

6. **Phase DAG file count estimates**: The current phase DAG uses approximate file counts (~20, ~5, ~30, etc.). Iteration 008 should refine these counts by cross-referencing the touchpoint tables from iterations 001-006 to produce exact file counts per phase.

7. **Integration testing strategy**: Need to define the integration test plan for verifying the system works end-to-end after all phases complete. This should include: memory search with fallback scoring, code-graph structural queries, agent/command tool routing, and MCP server startup across all 4 runtimes.
