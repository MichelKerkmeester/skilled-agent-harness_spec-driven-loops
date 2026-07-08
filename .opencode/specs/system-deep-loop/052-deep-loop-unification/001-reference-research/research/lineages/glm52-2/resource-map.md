# Resource Map — glm52-2 (evidence-derived)

> Generated from converged research deltas. Maps the surfaces this lineage investigated, with per-section counts. Emitted per the convergence evidence unless suppressed by `--no-resource-map`.

## READMEs
- `deep-loop-workflows/README.md` — hub README; documents runtimeLoopType + frozen-backend framing (lines 36, 61, 92). [1]
- `deep-loop-runtime/README.md` — runtime README; documents the lib module roster incl. fallback-router (line 92). [1]

## Commands (24 files, ~434 hits)
- `commands/deep/assets/deep_research_{auto,confirm}.yaml` — fanout-run, loop-lock, convergence, upsert, executor-config/audit, prompt-pack, post-dispatch-validate, atomic-state, fanout-merge (lines 160-1294). [2 files]
- `commands/deep/assets/deep_review_auto.yaml` — same runtime surface, review loopType (lines 176-1663). [1]
- `commands/deep/assets/deep_ai-council_{auto,confirm}.yaml` — council modules + loop-lock + graph scripts (lines 16-188). [2]
- `commands/deep/{research,review,ai-council}.md` — render-command-contract.cjs front-doors. [3]
- `commands/deep/assets/compiled/*.contract.md` — compiled contracts w/ content hash (REQ-002: regenerate only). [3]
- `commands/doctor/_routes.yaml` — status/query/convergence scripts (lines 108-110). [1]

## Agents
- `.opencode/agents/ai-council.md:398` — "caller-owned deep-loop-runtime CLI reducers" (1 real reference; `.claude/agents/` mirror must move in lockstep). [1]

## Skills (6 skills touched)
- `deep-loop-runtime/` — SKILL.md, lib/{deep-loop,coverage-graph,council}/ (30 modules), scripts/ (13 .cjs), database/ (2 SQLite), tests/, feature_catalog/, package.json, tsconfig.json. [whole tree]
- `deep-loop-workflows/` — SKILL.md, mode-registry.json, hub-router.json, graph-metadata.json, 4 mode packets, shared/. [whole tree]
- `system-spec-kit/` — mcp_server/vitest.config.ts:20, mcp_server/tests/memory-runtime-retention.vitest.ts:9, council-playbook-anchor-integrity.vitest.ts, graph-metadata.json:45, scripts/tests/deep-review-auto-restart-contract.vitest.ts:19. [~8 sites]
- `system-skill-advisor/` — advisor-recommend.ts:15,266, routing-parity-deep-{skills,council}.vitest.ts, routing-registry-drift-guard.vitest.ts:26,76, local-native-approved-divergences.json (40+ entries incl. line 530 anomaly). [~12 sites]
- `sk-prompt-models/` — references/quota_fallback.md:148, pattern_index.md:50,67 (fallback-router recipe + borrow owner). [2]

## Scripts (runtime, 13 .cjs)
- Forward-coupling: render-command-contract.cjs:11, compile-command-contracts.cjs:15-288 (~36 paths), check-contract-drift.cjs:40-42, fanout-run.cjs:942-943. [4 files]
- Intra-runtime: fanout-pool.cjs (same-model retry; no fallback-router call), fanout-salvage.cjs, fanout-merge.cjs, loop-lock.cjs, convergence.cjs, upsert.cjs, query.cjs, status.cjs, verify-iteration.cjs. [9]

## Tests
- Runtime unit: fallback-router.vitest.ts:12,36; executor-provenance-mismatch.vitest.ts:12,237. [2 callers — test-only]
- system-spec-kit tests reaching runtime: memory-runtime-retention.vitest.ts:9, council-playbook-anchor-integrity.vitest.ts:12-64, deep-review-auto-restart-contract.vitest.ts:19. [3]
- Advisor parity: routing-parity-deep-skills.vitest.ts, routing-parity-deep-council.vitest.ts, advisor-recommend.vitest.ts, routing-registry-drift-guard.vitest.ts. [4]

## Config
- `deep-loop-runtime/package.json:11` (tsc borrow), `tsconfig.json:13` (@types borrow), `system-deep-loop/{mode-registry.json, hub-router.json, description.json, graph-metadata.json}` (identity fields, 002 SC-003). [~6]

## Meta
- 2 SQLite DBs under `deep-loop-runtime/database/` (deep-loop-graph.sqlite, council-graph.sqlite) — writer-locked mid-move (002 §6 Risk). [2]

*Coverage: 6 skills, ~24 command files, 13 runtime scripts, 9 test files, ~6 config — no single weak source dominates.*
