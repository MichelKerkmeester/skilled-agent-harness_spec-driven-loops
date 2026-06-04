---
title: "Resource Map — Deprecate CocoIndex + Rerank-Sidecar, Decouple Code-Graph (014)"
description: "Classified touchpoint map + dependency-ordered deprecation phase DAG, synthesized from the 12-iteration deep-research run in 001-touchpoint-research (10 cli-devin swe-1.6 + 2 cli-opencode deepseek-v4 adversarial closers). Verdict: COMPLETE+CORRECT, ready to scaffold."
---
# Resource Map — Deprecate CocoIndex + Rerank-Sidecar, Decouple Code-Graph

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

> **Provenance:** Synthesized from `001-touchpoint-research/research/` — 12 iterations (iters 1-10 cli-devin/swe-1.6; iters 11-12 cli-opencode/deepseek-v4 adversarial cross-model validation). Exhaustive per-file detail with `file:line` lives in `001-touchpoint-research/research/iterations/iteration-0NN.md`; this map is the authoritative consolidation + phase plan the deprecation phases consume.

---

## 1. Executive Summary

Three targets, three distinct end-states:

| Target | End state | Why |
|--------|-----------|-----|
| `mcp-coco-index` | **DELETE** — skill folder, forked `mcp_server/`, `ccc` CLI, `cocoindex_code` MCP server | Semantic code-search stack being retired |
| `system-rerank-sidecar` | **DELETE** — skill folder, `.venv`, scripts, FastAPI service | Cross-encoder HTTP service; consumers removed first |
| `system-code-graph` | **KEEP, DECOUPLE** from CocoIndex — sever `ccc_*` bridge + semantic routing | Structural indexing stays; only the coco coupling is severed |

**Scope boundary (hard rule):** historical spec docs under `.opencode/specs/**` are **FROZEN** (LEAVE-historical) — never edited. Raw greps show ~3183 cocoindex files but ~85% are frozen history. The **live surface ≈ 270 touchpoints** across the 3 skills, `system-spec-kit`, commands, agents, hooks, runtime configs, README, install guides, and 27 YAML workflow assets.

**Two dangerous couplings (both confirmed isolated, iter-009):**
- **rerank-sidecar ↔ mk-spec-memory** — memory is the *only* non-coco consumer (`cross-encoder.ts` `local` provider, opt-in `SPECKIT_CROSS_ENCODER`/`RERANKER_LOCAL`).
- **code-graph ↔ coco** — `ccc_status`/`ccc_reindex`/`ccc_feedback` tools + `classify_query_intent` routing + `cocoindex-path.ts`/`ccc-readiness-probe.ts`/`startup-brief.ts`.

---

## 2. Touchpoint Inventory (by class)

| Mutation class | Meaning | Approx. count | Detail source |
|----------------|---------|---------------|---------------|
| **DELETE** | File/dir removed entirely | ~75 (2 skill folders + venvs + scripts + feature_catalog CCC + ccc_* schemas/handlers) | iter-001, 003, 006 |
| **EDIT-decouple** | Surgical edit to sever coupling, keep file | ~45 (code-graph internals, cross-encoder.ts, launcher wiring, classifier) | iter-002, 003, 009 |
| **EDIT-remove-ref** | Remove a reference/registration | ~150 (configs, docs, README, 27 YAML assets, 4-runtime mirror) | iter-004, 005, 011, 012 |
| **LEAVE-historical** | Frozen `.opencode/specs/**` — not touched | n/a (excluded) | scope rule |

Exhaustive `file:line` tables: see `iteration-001.md` (inventory seed), `003` (code-graph edit-set), `005` (97 config/mirror), `012` (27 YAML assets + 6 pass-1 misses).

---

## 3. Key Decisions (validated by deepseek closers)

### D1 — Memory loses cross-encoder rerank; falls back to positional scoring
Removing the sidecar removes mk-spec-memory's only cross-encoder. The safe fallback **already exists**: `cross-encoder.ts:319-330` returns positional fallback scores (0-0.5, `scoringMethod:'fallback'`) when no provider is available. Because cross-encoder rerank is **opt-in (default OFF)**, the **default memory-search path is unaffected** by removal (validated iter-011/012). Phase 003 removes the `local` provider branch + flags + ensure helper.

### D2 — Semantic code-search → HYBRID policy (Grep + code-graph structural)
Of three options (drop / repoint to `memory_search` / hybrid), the recommendation is **HYBRID**: document Grep + code-graph structural as the path for concept discovery. Not `memory_search` (it indexes spec-docs/memory, not arbitrary code). 33 semantic-search routes rewrite to this policy in Phase 007.

---

## 4. Deprecation Phase DAG (corrected — hard constraint: DECOUPLE BEFORE DELETE)

```
002-decouple-code-graph          (~35 files)   [first; no deps]
   → 003-remove-memory-rerank-path        (~6 files)
   → 004-remove-rerank-sidecar-skill      (~30 files)   [after 003]
   → 005-remove-coco-index-skill          (~40 files)   [after 002]
   → 006-runtime-configs-4runtime-mirror  (~108 files)  [after 004,005]
   → 007-docs-readme-search-routing       (~74 files)   [after 006]
   → 008-runtime-artifacts-cleanup        (~10 items)   [after 004,005]
```

| Phase | Scope (source iters) | Depends on | Verify gate | ~Files |
|-------|----------------------|------------|-------------|--------|
| **002-decouple-code-graph** | Sever ccc_* tools (schemas/handlers/TOOL_NAMES, 11→8), `classify_query_intent` semantic routing, `cocoindex-path.ts`/`ccc-readiness-probe.ts`/`startup-brief.ts`, SKILL/ARCHITECTURE/README refs, feature_catalog `07--ccc-integration/` DELETE (3), `_routes.yaml` coco route (106-120) + `doctor_cocoindex.yaml` DELETE + `_routes.yaml:20/73` + `doctor_mcp_install.yaml`/`doctor_mcp_debug.yaml` coco entries, `mk-code-index-launcher.cjs:20` COCOINDEX_BIN_PATH (iter-003/009/012) | None | `vitest` (code-graph suites minus ccc); tsc; MCP starts with 8 tools; `/doctor` route manifest has no coco | ~35 |
| **003-remove-memory-rerank-path** | `cross-encoder.ts` local provider + fallback wiring, `search-flags.ts` opt-in gates, `mk-spec-memory-launcher.cjs:12/449-451` ensure call, ENV_REFERENCE.md, `mk-skill-advisor-launcher.cjs:93` RERANK_SIDECAR_PORT (iter-002/012) | None (seq. after 002) | mk-spec-memory MCP starts without sidecar; search returns `scoringMethod:'fallback'` | ~6 |
| **004-remove-rerank-sidecar-skill** | Delete `system-rerank-sidecar/` folder + `.venv` + scripts + tests + pyproject (iter-006) | 003 | folder gone; port 8765 free; no `rerank_sidecar` proc | ~30 |
| **005-remove-coco-index-skill** | Delete `mcp-coco-index/` folder + `.venv` + scripts + `ccc` CLI (iter-006) | 002 | folder gone; `~/.cocoindex_code/` + `.cocoindex_code/` cleaned | ~40 |
| **006-runtime-configs-4runtime-mirror** | Remove `cocoindex_code` MCP block from opencode.json/.vscode/.gemini/.codex; RERANK env notes; coco from agent/command frontmatter ×4 runtimes; `doctor_update.yaml` coco refs; `.gemini/commands/doctor/update.toml:2` (iter-005/012) | 004, 005 | no `cocoindex_code` in any config; no `RERANK_SIDECAR_PORT`; frontmatter clean | ~108 |
| **007-docs-readme-search-routing** | Rewrite 27 YAML workflow assets to HYBRID policy (**P0: 4 deep-loop executor YAMLs remove `cocoindex_code` from `mcp_servers:`**); README, install guides, AGENTS.md, CLAUDE.md SEARCH ROUTING, `search.md:116` (iter-004/012) | 006 | no coco semantic-search refs; decision trees show Grep+code-graph; loop executors start with modified YAML | ~74 |
| **008-runtime-artifacts-cleanup** | venvs, `~/.cocoindex_code/` daemon sock/pid/log, `.cocoindex_code/` index, sidecar reaper telemetry, `orphan-mcp-sweeper.sh:195-196/304` (rerank/8765 probes), `scripts/README.md:66/78` (iter-006/012) | 004, 005 | no deleted-skill `.venv`; daemon runtime gone; port 8765 free; hooks updated | ~10 |

---

## 5. The 27 YAML Workflow Assets (Phase 007 — full list)

**P0 — deep-loop executors (4, `mcp_servers: [cocoindex_code]` → break at runtime if not cleaned):**
`deep_start-research-loop_auto.yaml:87-88`, `deep_start-research-loop_confirm.yaml:73-74`, `deep_start-review-loop_auto.yaml:76-77`, `deep_start-review-loop_confirm.yaml:76-77`.

**speckit (6):** `speckit_plan_auto/confirm`, `speckit_complete_auto/confirm`, `speckit_implement_auto/confirm`.