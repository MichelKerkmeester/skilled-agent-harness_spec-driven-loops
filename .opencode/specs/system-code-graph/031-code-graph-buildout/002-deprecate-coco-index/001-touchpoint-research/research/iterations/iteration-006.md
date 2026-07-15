# Iteration 006 - RQ7 Deletion Completeness

## Focus (RQ7)

Enumerate deletion-completeness items beyond the file edits already mapped in iterations 001-005. This iteration catalogs non-source artifacts that must be removed or cleaned up when deprecating `mcp-coco-index` and `system-rerank-sidecar`, including venvs, bundled scripts, runtime/daemon artifacts, HuggingFace model cache, git hooks, dependency manifests, and skill artifacts.

## Deletion-completeness items

| Path | Type | Verify-gone | Note |
|------|------|-------------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/.venv/` | runtime-cleanup | `ls -la .opencode/skills/mcp-coco-index/mcp_server/.venv/` should fail or be empty | Python virtual environment for cocoindex MCP server (not git-tracked, created by install.sh) |
| `.opencode/skills/system-rerank-sidecar/.venv/` | runtime-cleanup | `ls -la .opencode/skills/system-rerank-sidecar/.venv/` should fail or be empty | Python virtual environment for rerank sidecar (not git-tracked, created by install.sh) |
| `.opencode/skills/mcp-coco-index/scripts/install.sh` | repo-delete | File should be deleted with skill folder | CocoIndex MCP server install script [SOURCE: .opencode/skills/mcp-coco-index/scripts/install.sh] |
| `.opencode/skills/mcp-coco-index/scripts/doctor.sh` | repo-delete | File should be deleted with skill folder | CocoIndex doctor/diagnostics script [SOURCE: .opencode/skills/mcp-coco-index/scripts/doctor.sh] |
| `.opencode/skills/mcp-coco-index/scripts/ensure_ready.sh` | repo-delete | File should be deleted with skill folder | CocoIndex readiness check script [SOURCE: .opencode/skills/mcp-coco-index/scripts/ensure_ready.sh] |
| `.opencode/skills/mcp-coco-index/scripts/update.sh` | repo-delete | File should be deleted with skill folder | CocoIndex update script [SOURCE: .opencode/skills/mcp-coco-index/scripts/update.sh] |
| `.opencode/skills/mcp-coco-index/scripts/common.sh` | repo-delete | File should be deleted with skill folder | Shared shell utilities for CocoIndex scripts [SOURCE: .opencode/skills/mcp-coco-index/scripts/common.sh] |
| `.opencode/skills/system-rerank-sidecar/scripts/install.sh` | repo-delete | File should be deleted with skill folder | Rerank sidecar install script [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/install.sh] |
| `.opencode/skills/system-rerank-sidecar/scripts/doctor.sh` | repo-delete | File should be deleted with skill folder | Rerank sidecar doctor script [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/doctor.sh] |
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | repo-delete | File should be deleted with skill folder | Rerank sidecar startup script [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/start.sh] |
| `.opencode/skills/system-rerank-sidecar/scripts/use-model.sh` | repo-delete | File should be deleted with skill folder | Rerank sidecar model selection script [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/use-model.sh] |
| `.opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py` | repo-delete | File should be deleted with skill folder | Main rerank sidecar FastAPI application [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/rerank_sidecar.py] |
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_defaults.py` | repo-delete | File should be deleted with skill folder | Sidecar configuration defaults [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/sidecar_defaults.py] |
| `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py` | repo-delete | File should be deleted with skill folder | Sidecar telemetry ledger [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py] |
| `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py` | repo-delete | File should be deleted with skill folder | Sidecar ensure helper (Python version) [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py] |
| `.opencode/skills/system-rerank-sidecar/scripts/finetune/` | repo-delete | Directory should be deleted with skill folder | Fine-tuning utilities for reranker (train.py, eval_on_fixture.py, etc.) [SOURCE: .opencode/skills/system-rerank-sidecar/scripts/finetune/] |
| `.opencode/skills/system-rerank-sidecar/tests/` | repo-delete | Directory should be deleted with skill folder | Sidecar test suite (test_rerank_sidecar.py, test_sidecar_ledger.py) [SOURCE: .opencode/skills/system-rerank-sidecar/tests/] |
| `~/.cocoindex_code/` | runtime-cleanup | `ls -la ~/.cocoindex_code/` should fail or be empty | CocoIndex daemon runtime directory (daemon.sock, daemon.pid, daemon.log) - gitignored, on operator machine |
| `.cocoindex_code/` (repo root) | runtime-cleanup | `ls -la .cocoindex_code/` should fail or be empty | CocoIndex index directory at repo root - gitignored entry at .gitignore:123 [SOURCE: .gitignore:123] |
| `~/Library/Logs/spec-kit/sidecar-reaper.jsonl` | runtime-cleanup | `ls -la ~/Library/Logs/spec-kit/sidecar-reaper.jsonl` should fail or be empty | Sidecar reaper telemetry log (default path from ensure-rerank-sidecar.cjs) [SOURCE: .opencode/bin/lib/ensure-rerank-sidecar.cjs:1076-1080] |
| Port 8765 binding | runtime-cleanup | `lsof -i :8765` should show no rerank_sidecar process | Rerank sidecar default port (RERANK_SIDECAR_PORT) - verify no process listening after deletion |
| `~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B` | shared-optional | `ls -la ~/.cache/huggingface/hub/models--Qwen--Qwen3-Reranker-0.6B` | HuggingFace model cache for Qwen3-Reranker-0.6B (shared infra, not repo-specific) |
| `~/.cache/huggingface/hub/models--nomic-ai--CodeRankEmbed` | shared-optional | `ls -la ~/.cache/huggingface/hub/models--nomic-ai--CodeRankEmbed` | HuggingFace model cache for nomic-ai/CodeRankEmbed (shared infra, not repo-specific) |
| `.github/hooks/scripts/session-start.sh:18` | repo-delete | Line 18 should be removed or updated | Session-start hook prints "CocoIndex: unknown" status [SOURCE: .github/hooks/scripts/session-start.sh:18] |
| `.opencode/scripts/orphan-mcp-sweeper.sh:193-200` | repo-delete | Lines 193-200 should be removed | Orphan MCP sweeper has CCC and rerank-sidecar detection logic [SOURCE: .opencode/scripts/orphan-mcp-sweeper.sh:193-200] |
| `.opencode/skills/mcp-coco-index/mcp_server/pyproject.toml` | repo-delete | File should be deleted with skill folder | Python dependency manifest for cocoindex MCP server [SOURCE: .opencode/skills/mcp-coco-index/mcp_server/pyproject.toml] |
| `.opencode/skills/system-rerank-sidecar/pyproject.toml` | repo-delete | File should be deleted with skill folder | Python dependency manifest for rerank sidecar [SOURCE: .opencode/skills/system-rerank-sidecar/pyproject.toml] |
| `.opencode/bin/lib/ensure-rerank-sidecar.cjs` | repo-delete | File should be deleted | Ensure helper script for sidecar (already mapped in iter-002) [SOURCE: .opencode/bin/lib/ensure-rerank-sidecar.cjs] |
| `.opencode/skills/mcp-coco-index/` (entire skill folder) | repo-delete | Directory should not exist | Entire mcp-coco-index skill folder deletion |
| `.opencode/skills/system-rerank-sidecar/` (entire skill folder) | repo-delete | Directory should not exist | Entire system-rerank-sidecar skill folder deletion |

## Cross-skill import check

**No cross-skill imports found beyond the already-mapped ensure-rerank-sidecar.cjs dependency.**

Evidence:
- Grep for `from.*mcp-coco-index|import.*mcp-coco-index|from.*system-rerank-sidecar|import.*system-rerank-sidecar` across `.opencode/` found only spec doc references (historical), no live code imports [SOURCE: grep results]
- Grep for `cocoindex-path|ensure-rerank-sidecar` across `.opencode/` found only the already-mapped files in iteration-001 and iteration-002:
  - `.opencode/skills/system-code-graph/mcp_server/lib/shared/cocoindex-path.ts` (CCC utility, already marked DELETE in iter-003)
  - `.opencode/bin/lib/ensure-rerank-sidecar.cjs` (ensure helper, already marked DELETE in iter-002)
  - `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` (local provider, already marked EDIT-decouple in iter-002)
- No other production code imports from the two deleted skills.

**Conclusion:** The two skills are self-contained with no cross-skill code dependencies beyond the already-documented mk-spec-memory coupling (via ensure-rerank-sidecar.cjs and cross-encoder.ts local provider), which is already addressed in iteration-002.

## Gaps for next iteration

1. **RQ6 Dependency-correct phase DAG:** With RQ7 complete, the next iteration should focus on RQ6 — constructing the dependency-ordered deprecation phase DAG with rollback points and per-phase verification gates. This requires determining the correct sequence: (a) decouple system-code-graph from CocoIndex first, (b) remove MCP registrations and runtime configs, (c) delete skill folders, (d) clean up doctor workflows, (e) update documentation, (f) clean up runtime artifacts.

2. **HuggingFace cache cleanup policy:** Need to define whether the HuggingFace model caches (Qwen3-Reranker-0.6B, CodeRankEmbed) should be cleaned up as part of the deprecation or left as shared infrastructure. These are shared across projects and may be used by other tools.

3. **Runtime artifact verification procedures:** Need to define the exact verification commands for each runtime-cleanup item (e.g., how to verify daemon processes are killed, how to verify port bindings are released, how to safely remove telemetry logs).

4. **Feature catalog CCC files:** Iteration-003 noted that system-code-graph SKILL.md RESOURCE_MAP references feature_catalog CCC files (07--ccc-integration/01-ccc-reindex.md, 02-ccc-feedback.md, 03-ccc-status.md). These files need to be located and classified (DELETE vs EDIT-decouple).

5. **Install guide script references:** Iteration-005 noted install_scripts/README.md references install-cocoindex-code.sh. Need to verify if this script exists and classify it for deletion.
