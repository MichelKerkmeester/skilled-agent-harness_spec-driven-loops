---
title: Deep Research Strategy - Touchpoint Discovery (014/001)
description: Session-tracking strategy for mapping CocoIndex / rerank-sidecar deprecation + code-graph decouple touchpoints.
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for the touchpoint-research session. Produces a classified resource map (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical) + a dependency-ordered deprecation phase DAG for removing `mcp-coco-index` and `system-rerank-sidecar` and decoupling `system-code-graph` from CocoIndex.

---

## 2. TOPIC
Map every LIVE touchpoint for deprecating `mcp-coco-index` + `system-rerank-sidecar` and decoupling `system-code-graph` from CocoIndex, into a classified resource map + dependency-ordered deprecation phase DAG. Historical spec docs under `.opencode/specs/**` stay frozen.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] RQ1: Exhaustive, deduplicated inventory of every LIVE file referencing coco / cocoindex / cocoindex_code / ccc CLI, with a per-file mutation class (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical). Dedup across all spellings.
- [ ] RQ2: All consumers of `system-rerank-sidecar`. Confirm/deny mk-spec-memory is the only non-coco consumer; trace `cross-encoder.ts` local branch, `ensure-rerank-sidecar.cjs`, launcher wiring, `SPECKIT_CROSS_ENCODER` / `RERANKER_LOCAL` flags, reaper/telemetry. Define exactly what mk-spec-memory loses and the safe fallback.
- [ ] RQ3: Precise edit-set to decouple `system-code-graph` from CocoIndex — sever `ccc_status`/`ccc_reindex`/`ccc_feedback` tools, the `code_graph_classify_query_intent` semantic/hybrid routing, `ccc_bridge_integration` doc, glossary/router refs — while keeping the structural skill green (tests, tool-schemas, code-graph-boundary.ts).
- [ ] RQ4: Semantic-search vacuum. Every agent/command/CLAUDE.md/AGENTS.md route that sends "find code by concept" to CocoIndex; the replacement policy options (drop / repoint to memory_search / grep + code-graph) + a recommendation.
- [ ] RQ5: 4-runtime mirror + configs. Every opencode.json / .vscode/mcp.json / .gemini / .claude / .codex + mirrored agent/command + MCP registration edit. The x4 multiplier.
- [ ] RQ6: Dependency-correct phase DAG + ordering (decouple before delete), rollback points, per-phase verify gates, risk register, and the NEGATIVE-knowledge list (things that look related but are NOT in scope).
- [ ] RQ7: Deletion completeness — venv, daemon sockets/pids (~/.cocoindex_code/), gitignored index dirs (.cocoindex_code/), HuggingFace model cache, install/doctor scripts, git hooks, benchmarks.

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any deletion or edit (research reports findings only; the deprecation phases execute later).
- Editing or rewriting FROZEN historical spec docs under `.opencode/specs/**` (operator directive 2026-05-25).
- Re-adding cloud rerankers (voyage/cohere) — already removed in 022/013.
- Changing mk-spec-memory embeddings or non-rerank retrieval channels beyond the cross-encoder removal.

---

## 5. STOP CONDITIONS
- All 7 RQs answered with a classified, deduplicated resource map + phase DAG.
- 12 iterations reached (10 cli-devin swe-1.6 + 2 cli-opencode deepseek-v4 cross-model validation), OR genuine convergence after the deepseek closers add no net-new touchpoints.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
RQ1: Exhaustive, deduplicated inventory of every LIVE file referencing coco / cocoindex / cocoindex_code / ccc CLI, with a per-file mutation class (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical). Dedup across all spellings.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

Established during pre-research investigation (cite + verify, do not re-derive):

- **Three targets, three end-states.** mcp-coco-index → DELETE (skill folder, forked `mcp_server/`, `ccc` CLI, `cocoindex_code` MCP server). system-rerank-sidecar → DELETE. system-code-graph → KEEP but DECOUPLE from CocoIndex.
- **Scope boundary.** Raw greps: cocoindex ~3183 files, mcp-coco-index ~1500, rerank-sidecar (all spellings) ~500-800. BUT ~85% are FROZEN historical spec docs under `.opencode/specs/**` (2170 in system-spec-kit specs alone) — LEAVE-historical. LIVE surface = the 3 skills, system-spec-kit (137), commands (create/speckit/doctor/deep), agents, hooks, runtime configs, README, install guides.
- **Coupling A (rerank-sidecar to mk-spec-memory).** SKILL.md:248 + opencode.json _NOTE_8/_NOTE_9: memory consumes the sidecar via `mcp_server/lib/search/cross-encoder.ts` `local` provider, opt-in `SPECKIT_CROSS_ENCODER=true` + `RERANKER_LOCAL=true`. Ensure helper: `bin/lib/ensure-rerank-sidecar.cjs`. Cloud rerankers already removed (022/013), so the local sidecar is memory's ONLY cross-encoder — removal = memory loses cross-encoder rerank (define fallback).
- **Coupling B (code-graph to coco).** `ccc_status`/`ccc_reindex`/`ccc_feedback` registered in the `mk_code_index` MCP (11 tools -> 8 after removal), `references/integrations/ccc_bridge_integration.md`, `code_graph_classify_query_intent` routing semantic->coco / hybrid->coco-seeds, glossary + "when NOT to use" + router pseudocode in SKILL.md. Shared boundary: `system-spec-kit/mcp_server/lib/code-graph-boundary.ts`.
- **Coco MCP registration** lives in `opencode.json` (`cocoindex_code` block), `.vscode/mcp.json`, `.gemini/settings.json`, `.codex/config.toml`. Default embedder nomic-ai/CodeRankEmbed; default reranker Qwen/Qwen3-Reranker-0.6B via the sidecar.
- **Semantic-search routing** to coco appears in: global CLAUDE.md + `.claude/CLAUDE.md` SEARCH ROUTING, AGENTS.md, `@context`/`@deep-review` agents, and the deep-research/deep-review commands (`mcp__cocoindex_code__search`). Removal needs a replacement policy.
- **4-runtime mirror.** Agent/command/config edits multiply across `.opencode` / `.claude` / `.gemini` / `.codex`.
- **Iter-1 finding (2026-05-25):** 30+ live touchpoints mapped incl. `cocoindex-path.ts`, `query.ts:424`, CCC bridge tests, `.gitignore:123`, doctor scripts. See `research/iterations/iteration-001.md`.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 12 (10 cli-devin swe-1.6, then 2 cli-opencode deepseek-v4)
- Convergence threshold: 0.02 (low — push toward the full 12, esp. the deepseek cross-model closers)
- Per-iteration budget: 12 tool calls, 15 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-05-25T06:58:00Z
