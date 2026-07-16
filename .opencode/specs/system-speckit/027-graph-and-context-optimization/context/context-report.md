# Context Report — `027-graph-and-context-optimization` (all work done)

> Reuse-first map of a **completed** spec-kit program: what 026 delivered (docs narrative + decisions)
> and the live code it produced/touches. Ships **pointers, not source bodies** — pull bodies just-in-time.
> Machine-readable companion: `context-report.json`.

| | |
|---|---|
| **Scope** | All work in `system-spec-kit/026-graph-and-context-optimization` — docs narrative + underlying code subsystems |
| **Read-only source root** | `.opencode/specs/system-spec-kit/026-graph-and-context-optimization` (the `specs/…` path given is a symlink) |
| **Executor pool** | `mimo` — `xiaomi/mimo-v2.5-pro` (Direct API, COSTAR, --variant high), **single seat** |
| **Iterations (parallel sweeps)** | 5 → **converged** |
| **Findings** | 118 (117 agreement-eligible) · 53 reuse · 16 integration_point · 37 convention · 3 dependency · 8 gap |
| **Final signals** | sliceCoverage 0.95 · reuseCatalogCoverage 1.0 · agreementRate 1.0¹ · relevanceFloor 1.0 · score 0.99 · contradictions 0 |
| **Date** | 2026-06-07 (026 last active 2026-06-05, final save 2026-06-06) |

¹ Single-seat: agreement is self-confirmation (`agreementMin=1`); the agreement signal is **non-informative by design** — confidence rests on relevance + citation, not cross-model agreement.

---

## 0. What 026 is (one paragraph)

026 is a **complete coordinating phase-parent** for a graph/context/memory/operator-tooling program,
decomposed into **9 tracks (000–008), ~110 sub-phases**. Net result: the code-graph was extracted to a
**standalone `system-code-graph` MCP** (CocoIndex decoupled); the **memory + embedder runtime** was
hardened (local-first embedder cascade, quality/indexer invariants, causal-graph channel); **MCP daemon
reliability** was rebuilt (IPC canonicalization, single-writer lease, WAL durability, watchdog roadmap);
and **operator tooling** (hook parity, doctor surface, template system, skill-advisor) matured. One track
(**005 graph-impact-and-affordance**) is deferred; **008** fixed four live integration defects.

---

## 1. REUSE Catalog (highest value)

Concrete, reusable code surfaces (file:line verified on disk). Reuse verb in **bold**.

### Deep-loop runtime (the shared substrate every deep loop reuses)
- **compose** `runCappedPool({items,concurrency,worker})` — `deep-loop-runtime/scripts/fanout-pool.cjs:138` — pure `xargs -P K` pool primitive; `settleItem` never throws.
- **extend** `buildLineageCommand(lineage,prompt,sandbox,permission)` — `fanout-run.cjs:259` — per-executor-kind CLI flag shapes (codex/gemini/claude/opencode/devin).
- **compose** `dispatchCouncilSeats({roundId,seats,dispatchSeat})` — `lib/council/multi-seat-dispatch.cjs:129` — `Promise.all` seat fan-out; `settleSeat` never throws.
- **import** convergence evaluators `evaluateContext/Research/Review` + `computeCompositeScore` — `scripts/convergence.cjs:262/200/234/116` — context weights reuseCatalog highest (0.30); slice/relevance/agreement are blocking guards.
- **import** `mergeResearchRegistries`/`mergeReviewRegistries` — `fanout-merge.cjs:91/183` — cross-model attribution; P0/P1/P2 severity rank + verdict.
- **wrap** `runSalvageSweep` — `fanout-salvage.cjs:69` — recovers iteration output before a failure throw; `extractTextFromOpencodeJson` parses opencode `--format json`.

### code-graph MCP (standalone `system-code-graph`)
- **wrap** `ensureCodeGraphReady(rootDir,opts)` — `mcp_server/lib/ensure-ready.ts:624` — gate any code-graph read; auto-reindex + freshness `ReadyResult`.
- **extend** read handlers `handleCodeGraphQuery/Context/Scan/DetectChanges` — `mcp_server/handlers/{query,context,scan,detect-changes}.ts` — outline/calls/imports/blast-radius, LLM neighborhoods, scan pipeline, diff→symbol impact.
- **import** `CODE_GRAPH_TOOL_SCHEMAS` + `validateToolArgs` — `tool-schemas.ts:186/213` — 8 MCP tool defs + strict arg validation (reuse for any MCP dispatch layer).
- **compose** DB primitives `getDb`/`queryEdgesFrom`/`queryOutline`/`getStats`/`persistIndexedFileResult` — `mcp_server/lib/code-graph-db.ts` + `ensure-ready.ts:583`.
- **wrap** `startIpcSocketServer` — `mcp_server/lib/ipc/socket-server.ts:44` — multi-client UDS bridge shared by memory/code-index/advisor daemons.

### memory + embedder runtime
- **compose** `generateDocumentEmbedding`/`generateQueryEmbedding`/`invalidateProviderSingleton` — `shared/embeddings.ts:663/718/445` — lazy singleton provider, circuit breaker, LRU cache (local-first ADR-014).
- **extend** `getEmbedderAdapter`/`resolveDimensions`/`teardownEmbedderAfterSwap` — `mcp_server/lib/embedders/execution-router.ts:262/74/291` — provider:model adapter cache + dispose-on-swap.
- **compose** `startReindex`/`cancelJob` + `ensureVecTableForDim`/`getActiveEmbedder` — `lib/embedders/{reindex,schema}.ts` — staging-shard reindex with atomic rename.
- **import** `BoundedMap`/`TtlMap` — `lib/memory/bounded-cache.ts:26/67` — LRU + TTL bounded caches; `rotateIfNeeded` — `lib/memory/audit-rotation.ts:12`.

### daemon launchers + operator tooling
- **wrap** `createModelServerSupervisor(opts)` — `bin/lib/model-server-supervision.cjs` — shared by mk-spec-memory + mk-skill-advisor launchers (watchdog/crash-loop env-configurable).
- **extend** `scoreAdvisorPrompt` — `system-skill-advisor/mcp_server/lib/scorer/fusion.ts` — lane-weighted routing with abstention gates (env-overridable weights).

### Program-level capabilities (docs-level, build-on)
- code-graph structural-indexing track (004, ~90%) · memory continuity substrate (003/001) · v2 research synthesis (001: 88 findings/10 recs) · daemon-lifecycle reliability (007) · doctor surface (006/002, ~90%) · `scouted-bugfix-train` verify-first pattern (000/010).

*(Full 53 in `context-report.json` → `reuseCandidates[]`.)*

---

## 2. Integration Points (entry/exit seams)

- **[HARD]** `createCodeIndexMcpServer()` — `system-code-graph/mcp_server/index.ts:74` — MCP server wiring (ListTools+CallTool, IPC bridge, owner-lease).
- **[HARD]** `handleTool(name,args)` / `dispatch(name,args)` — `mcp_server/tools/{code-graph-tools.ts:62,index.ts:9}` — central tool dispatch (validate→route to 8 handlers).
- **[HARD]** `getDb()` — `code-graph-db.ts:295` — singleton better-sqlite3 seam; all DB ops flow through it.
- **[HARD]** daemon lease/IPC: `acquireOwnerLeaseFile` (`mk-spec-memory-launcher.cjs:365`), `maybeBridgeLeaseHolder`/`getIpcSocketPath`/`probeDaemon` (`bin/lib/launcher-ipc-bridge.cjs:311/59/124`), `createSessionProxy` (`launcher-session-proxy.cjs:338`), `recycleDaemonInPlace` (`mk-spec-memory-launcher.cjs:1053`).
- **[soft]** `batchUpsert(nodes,edges)` — `deep-loop-runtime/scripts/upsert.cjs:241` — coverage-graph writer (writer-lock guarded; VALID_KINDS/RELATIONS gated).
- **[soft]** advisor entry `handleAdvisorRecommend` (`advisor-recommend.ts:320`, prompt-safe) + `scoreAdvisorPrompt` (`fusion.ts`).
- **[soft]** doctor workflows `/doctor:update` (`commands/doctor/assets/doctor_update.yaml:24` — flock→probe→migrate→snapshot→validate) + `/doctor:memory` (`doctor_memory.yaml` — explicit mutation boundaries).

*(Full 16 in `context-report.json` → `integrationPoints[]`.)*

---

## 3. Touch List — where to plug in if you extend 026's surfaces

Ordered by subsystem dependency (lower first):

1. `shared/embeddings.ts` (+ `lib/embedders/*`) — embedding provider/dim resolution; touch before anything that re-embeds.
2. `lib/memory/*` (continuity, indexer invariants, bounded-cache) — memory write/index path; gated by index-scope SSOT (ADR-003).
3. `system-code-graph/mcp_server/*` — structural index; standalone MCP (don't re-couple to spec-kit dist).
4. `deep-loop-runtime/scripts/* + lib/*` — shared loop substrate (pool/lineage/merge/convergence/upsert).
5. `.opencode/bin/*launcher*.cjs + lib/launcher-*.cjs` — daemon lifecycle; single-writer lease discipline.
6. `commands/doctor/* + system-skill-advisor/*` — operator surfaces; consume the above, don't bypass leases.

> Single-writer rule: **never** open the daemon-owned memory/code-graph DB from a second process — route through IPC (`startIpcSocketServer` / session proxy). This is the exact hazard that reverted the 008 bridge fix.

---

## 4. Conventions (policies a planner must honor — do not relitigate)

**Architecture**
- **Split topology preserved** — semantic / structural / continuity stay distinct cross-linking surfaces; NOT a monolith (`001/spec.md:31,188`; `spec.md:120` memory↔code-graph separation; `004/spec.md:94` three-way isolation).
- **Trust-axis separation (R10)** — provenance / evidence-status / freshness as separate fields; no ready-made cached-artifact defaults (`001/spec.md:33`).
- **Honest-measurement-first (R1)** — no multiplier claims before the measurement contract (gates 005).
- **Standalone code-graph MCP (ADR-002)** — `mcp__system_code_graph__*` namespace; co-resident option superseded (`004/006/003/decision-record.md:57`).
- **Code-graph excludes `.opencode/skills/**` by default (ADR-001)** — 97% of files were skill internals; opt-in via `SPECKIT_CODE_GRAPH_INDEX_SKILLS=true` (`004/004/004/decision-record.md:68`).

**Runtime discipline**
- **Single-writer daemon lease** + PID-start-time identity (ADR-001, `007/016/decision-record.md:63`) — lease owner valid only if alive AND start-time matches within 2s.
- **Atomic temp→rename writes** (`writeAtomicJsonFile` `mk-spec-memory-launcher.cjs:140`) + **JSONL tail-repair**; exit-code contract 0/1/2/3 (`cli-guards.cjs:111`).
- **Local-first embedder cascade (ADR-014)**; **ONNX rejected** (5× slower on Apple Silicon at parity, `003/003/…/014/decision-record.md:68`); model-keyed `PREFIX_REGISTRY` (ADR-001).
- **Memory invariants** — `index-scope.ts` is SSOT for exclusions (ADR-003); `z_future` must never be indexed → delete-not-downgrade (ADR-004); constitutional tier is path-gated + SQL-layer-enforced (ADR-005/007); realpath hardening (ADR-010).
- **`/memory:save` planner-first default** (non-mutating; full-auto explicit only, ADR-002).

**Docs/process**
- **Level 1/2/3 is the SOLE public vocabulary** (ADR-005); internal manifest uses kind+capabilities+presets (ADR-001 C+F hybrid; 86→15 source files); single `spec-kit-docs.json` drives scaffolder AND validator.
- **Changelogs flat-per-track**; scaffold-then-enrich pipeline (HVR voice, fabrication guard).

*(Full 37 in `context-report.json` → `conventions[]`.)*

---

## 5. Pruned Dependency Subgraph (within the touch radius)

- `001 research baselines` → **gate** → `003 memory/runtime`, `004 code-graph`.
- `004 code-graph stability` → **gate** → `005 adoption uplift` (deferred).
- `002 advisor/templates` → **gate** → `006 operator tooling`.
- `code-graph runtime upgrades` **depend on** packet `011` (validator owner; fail-closed trust) — additive enrichment only (`004/004/001/decision-record.md:57`).
- `embedding architecture (003, 75%)` ← consolidation (010) + stack hardening (011).
- `invalidateEntityDensityCache()` wired into **post-commit** of `memory_save`/`memory_bulk_delete` (after commit, not before — `003/002/002/decision-record.md:31`).

---

## 6. Prior Art / Decisions (date-stamped where known)

The 37 conventions above ARE the decision record. Highest-leverage for new work:
- **008 dual-writer-hazard revert** (the canonical "why" for the single-writer rule) — `008/implementation-summary.md:48-49`. Bridge inert until **028** delivers IPC-backed transport.
- **R1/R10 research contracts** (001) — measurement + trust-axis before packaging.
- **ADR-002 standalone-MCP pivot** (004/006) — code-graph extraction.
- **ADR-014 local-first embedders** (003/016) + **ONNX rejection** (003/003).
- **tier-gamma conservative defaults** (`000/001/005/decision-record.md:39-49`) — 8 release-readiness defaults a memory/ingest planner must not re-decide.

---

## 7. Gaps & Unknowns

**Deferred / open (8):**
- **005 graph-impact-and-affordance** — only deferred top-level track (5%); children: phase-runner, edge-explanation, affordance-evidence, causal-trust-display.
- **028 code-index IPC transport** — blocks the OpenCode code-graph plugin bridge (`mk-code-graph-bridge.mjs` deliberately inert; dual-writer hazard).
- **007 phases 5–7** planned-not-shipped — provider-dispose, RSS watchdog, bridge liveness/reap (map to RC-1..RC-3).
- **002/004 literal-spec-folder-names** (0%) · **006/003 install-scripts-doctor-realignment** (0%, blocked on CocoIndex decoupling final).
- **Contract violations a planner must know:** `getGraphReadinessSnapshot`/`getGraphFreshness` are documented read-only but call `detectState` which writes `last_git_head` (idempotent, but violates ADR-003) — `004/011/review-report.md:229`. Changelog root-rollup index drift after the flat-per-track flatten (leaf layer healthy, index layer stale).
- **Stress-test fidelity:** `daemon-recycle-transparency-stress` uses a replay-loop copy, not the production `replaySnapshot()` closure (`launcher-session-proxy.cjs:595`).

**Unknowns / verification caveats:**
- **Code Graph MCP was unavailable** this run → symbol-level citations are filesystem-path-verified but **not graph-verified**; code-band `file:line` were sampled by MiMo's reads.
- Docs decision-record citations use **packet-relative paths** (resolve under the 026 root); they are evidence-cited, not absolute-path-checked.
- Several phase percentages (002/003 ~85%, 004 ~90%, 007 ~55%) are as-documented in spec.md, not independently re-verified.

---

## Methodology & Confidence

- **Single MiMo lens**, 5 advancing-focus sweeps (docs narrative → docs decisions → code pt1 → code pt2 → gap-fill). Host wrote all merged state; MiMo was a read-only analyzer (Gate-3-safe).
- **Attribution:** every unit `producedBy:[mimo]`, `agreement:1`. The agreement guard is **non-informative** for a single seat — confidence = relevance (gate 0.55, floor 1.0 on kept units) + on-disk citation. A second model lens would add real cross-model agreement; **not run per the operator's MiMo-only choice.**
- **Robustness:** reducer ran every iteration with `seatValidationWarnings:0`, `stateLogRepaired:false`, `stateSafety:"runtime"` (durability layer engaged, not fallback). 0 contradictions across 118 findings.
- **Verification:** 86/117 cited paths exist on disk as-written; the remainder are packet-relative decision-records (real) or symbol-only (code-graph-down).

## Convergence Report

- **Stop reason:** converged.
- **Total iterations (parallel sweeps):** 5.
- **Executor pool:** mimo (xiaomi/mimo-v2.5-pro, single seat).
- **Final signals:** sliceCoverage=0.95 · reuseCatalogCoverage=1.0 · agreementRate=1.0 · relevanceFloor=1.0 · dependencyCompleteness=1.0 · score=0.99.
- **Saturation:** iter-5 gap-fill added 8 findings → new/cumulative = 8/117 = **0.068 < 0.10** (threshold) AND frontier fully swept AND graph STOP_ALLOWED.
- **Relevance gate:** 0.55 · **Agreement min:** 1 (single-seat) · **Convergence threshold:** 0.10.

---

## Next steps

- `/speckit:plan [feature]` — consume the Reuse Catalog + Integration Points + Touch List + Conventions before designing.
- `/speckit:implement` — build against the verified reuse map; honor the single-writer lease + the §4 conventions.
- For full cross-model confidence, re-run with a 2nd seat (e.g. `--executor=native`) — single-lens agreement is non-informative.
