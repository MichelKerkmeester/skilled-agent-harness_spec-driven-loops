---
title: "Resource Map — Launcher Concurrency Spawn & Bridge Investigation"
description: "Inventory of source, spec, and runtime resources examined during the read-only deep-research investigation of T1 (hf-local spurious spawn) and T2 (daemon bridge not serving)."
---

# Resource Map

Read-only inventory of resources the research touched. No file was modified outside this packet's `research/`.

## Source — Thread 1 (model-server spawn / probe)
- `.opencode/bin/lib/launcher-ipc-bridge.cjs` — `probeModelServer` builds/writes `GET /api/health` (`:230-306`, `:240`, `:269`).
- `.opencode/bin/lib/model-server-supervision.cjs` — `prepareModelServerDemandTarget` boot probe (`:1160-1201`), `handleModelServerDemand` spawn-on-any-request (`:1204-1238`), idle monitor spawn-safe (`:1045-1090`), `MODEL_SERVER_DEMAND_STATUS=503` (`:33`).
- `.opencode/skills/system-spec-kit/shared/embeddings/providers/hf-local.ts` — real embed path wakes via `GET /api/health` then `POST /api/embed` (`:712`, `:718-785`, `:826-835`).
- `.opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts` — cascade short-circuit (`:528-545`).
- `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts` — provider construction (ollama probe throws, hf-local branch).
- `.opencode/skills/system-spec-kit/mcp_server/handlers/embedder-status.ts` — hf-local only when `effectiveProvider==='hf-local'` (`:62-67`).
- `.opencode/skills/system-skill-advisor/mcp_server/lib/embedders/schema.ts` — advisor `ensureActiveEmbedder` short-circuit (`:223-230`).

## Source — Thread 2 (daemon IPC bridge / socket race)
- `.opencode/skills/system-code-graph/mcp_server/lib/ipc/socket-server.ts` — `canUnlinkExistingSocket` gate (`:118-131`, no ENOENT guard `:123`), EADDRINUSE reclaim `throw` (`:242-243`), chmod post-listen (`:260-262`), `close()` (`:269-292`).
- `.opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` — second failing copy (same gate).
- `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts` — WORKING permissive copy (`:196-207`); un-hardened (DR-008-01 vulnerable).
- `.opencode/skills/system-code-graph/mcp_server/dist/index.js` — running bridge bind `:127`.
- `.opencode/skills/system-skill-advisor/mcp_server/dist/mcp_server/advisor-server.js` — running bridge bind `:232`.
- `.opencode/bin/{mk-code-index,mk-skill-advisor,mk-spec-memory}-launcher.cjs` — secondary attach vs become-primary; `mk-code-index-launcher.cjs:100-130` (secondaries never bind).

## Specs — design intent
- `…/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/006-mcp-launcher-concurrency/` — arc (001-013); esp. `010-multi-client-stdio-socket-bridge`, `012-daemon-bridge-socket-for-skill-advisor-and-code-index` (spec.md/implementation-summary.md), `007-skill-advisor-zombie-launcher-fix`, `004-launcher-supervision` (REQ-001 `:126`, open question `004/spec.md:170`, impl-summary `:50`).
- `…/003-memory-and-causal-runtime/010-embedding-consolidation-hf-local-server`, `018-front-proxy-recycle-hardening`, `020-lease-socket-path`, `024-launcher-lease-integration-test`.
- `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` (`:47-58`) + `embedding_resilience.md` (ADR-013→014).

## Runtime artifacts (read-only inspection)
- `/tmp/mk-hf-embed/hf-embed-giveup.json` (give-up marker), `hf-embed.sock`, `hf-embed-respawn.lock`.
- `/tmp/mk-{spec-memory,code-index,skill-advisor}/daemon-ipc.sock` (lsof asymmetry).
- `.opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite` + `.../system-skill-advisor/mcp_server/database/skill-graph.sqlite` (`vec_metadata` pointers/timestamps).
- `.code-graph-owner.json` (lease heartbeat), `opencode.json` (MCP env), `.env.local` (maintainer mode).

## Meta
- This packet: `spec.md`, `research/research.md`, `research/iterations/iteration-001..005.md`, `research/deltas/iter-001..005.jsonl`, `research/deep-research-{config.json,state.jsonl,strategy.md,findings-registry.json}`.
