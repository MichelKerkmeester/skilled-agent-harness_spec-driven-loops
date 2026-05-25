---
title: "Research Synthesis — CocoIndex / Rerank-Sidecar Deprecation Touchpoint Discovery"
description: "Canonical synthesis of the 12-iteration deep-research run mapping every live touchpoint for deprecating mcp-coco-index + system-rerank-sidecar and decoupling system-code-graph from CocoIndex."
---
# Research Synthesis — Touchpoint Discovery (014/001)

> The authoritative classified map + phase DAG is at `../resource-map.md` (promoted to the 014 root). This file is the narrative synthesis; per-file `file:line` detail lives in `iterations/iteration-0NN.md`.

## 1. Overview

Twelve iterations of deep research mapped the full LIVE surface for retiring the CocoIndex semantic-search stack: **iters 1-10** via cli-devin/swe-1.6 (breadth + classified inventory), **iters 11-12** via cli-opencode/deepseek-v4 (`--variant high`, adversarial cross-model validation). Convergence threshold 0.02; the run completed all 12 with a final verdict of **COMPLETE+CORRECT — ready to scaffold**.

Goal: a classified touchpoint resource map (DELETE / EDIT-decouple / EDIT-remove-ref / LEAVE-historical) + a dependency-ordered deprecation phase DAG. Historical specs under `.opencode/specs/**` stay frozen.

## 2. Findings by Research Question

- **RQ1 (inventory)** — ~270 live touchpoints across 3 skills, system-spec-kit, commands, agents, hooks, configs, README, install guides, 27 YAML assets. ~85% of raw grep hits are frozen `.opencode/specs/**` history (excluded). [iter-001, 008, 012]
- **RQ2 (rerank consumers + fallback)** — mk-spec-memory is the only non-coco consumer; coupling = `cross-encoder.ts` local provider + ensure helper + opt-in flags. Default search path is unaffected (cross-encoder opt-in/off); positional fallback at `cross-encoder.ts:319-330`. [iter-002, 009]
- **RQ3 (code-graph decouple)** — sever `ccc_*` tools (11→8), `classify_query_intent` routing, `cocoindex-path.ts`/`ccc-readiness-probe.ts`/`startup-brief.ts`, docs/tests. ~35 files. [iter-003, 009]
- **RQ4 (semantic-search vacuum)** — 33 routes to coco; recommended HYBRID policy (Grep + code-graph structural). [iter-004]
- **RQ5 (4-runtime + configs)** — ~108 config/mirror touchpoints across opencode.json/.vscode/.gemini/.codex + agent/command mirror. [iter-005]
- **RQ6 (phase DAG)** — 7-phase decouple-before-delete DAG (002-008). [iter-007, corrected iter-012]
- **RQ7 (deletion completeness)** — venvs, daemon sockets/pids, index dirs, telemetry, hooks, sweeper, dead env vars. [iter-006, 012]

## 3. Key Decisions

- **D1** — Removing the sidecar removes memory's only cross-encoder; default path unaffected (opt-in); fallback to positional scoring. Phase 003.
- **D2** — Semantic code-search retired in favor of HYBRID (Grep + code-graph structural); not repointed to `memory_search`. Phase 007.

## 4. Deprecation Phase DAG

`002-decouple-code-graph → 003-remove-memory-rerank-path → 004-remove-rerank-sidecar-skill → 005-remove-coco-index-skill → 006-runtime-configs-4runtime-mirror → 007-docs-readme-search-routing → 008-runtime-artifacts-cleanup`. Hard constraint: DECOUPLE BEFORE DELETE. Per-phase scope/verify/file-count in `../resource-map.md` §4.

## 5. Convergence Report

- Iterations: 12 / 12 (stop reason: completed planned run; verdict COMPLETE+CORRECT).
- newInfoRatio trend: 0.9, 0.7, 0.85, 0.8, 0.75, 0.65, 0.8, 0.07, 0.05, 0.03 (devin) → 0.15, (deepseek p1, net-new gaps), (deepseek p2 finalize).
- The deepseek closers materially improved the map: caught 3 CRITICAL gaps the swe-1.6 passes missed (doctor `_routes.yaml` zombie window, 27 YAML assets hardcoding the coco MCP tool incl. 4 runtime-breaking loop executors, false "no 8765 probes" claim) + 6 pass-1 misses; corrected "~40" YAML estimate to a precise 27.
- Questions: all 7 RQs MET with cited evidence (iter-010 acceptance check).

## 6. Next Steps

1. Scaffold phase children 002-008 under `014-deprecate-coco-index/` from the corrected DAG.
2. Execute phases in dependency order (decouple before delete), each gated by its verify command + a pre-phase git commit (rollback point).
3. Operator decisions to confirm before execution: D1 (accept memory cross-encoder loss) + D2 (HYBRID semantic-search policy).

## References

- `../resource-map.md` — authoritative classified map + phase DAG
- `iterations/iteration-001.md` … `iteration-012.md` — per-iteration findings
- `deep-research-strategy.md` — charter + known context
