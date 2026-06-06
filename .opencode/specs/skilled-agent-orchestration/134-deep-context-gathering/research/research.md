# Deep Research — Best approaches for the `deep-context` deep loop

**Method:** orchestrator-driven deep-research, 10 iterations across two parallel small-model lineages — `mimo-v2.5-pro` (internal/architecture lens, COSTAR) and `MiniMax-M3` (external/design lens, TIDD-EC), via cli-opencode read-only analysis; host (Claude Code) persisted all state (Gate-3-safe). Per-iteration evidence in `research/lineages/{mimo,minimax}/iteration-00N.md`.
**Convergence:** strong cross-model agreement on architecture by iteration 5; remaining divergence is in signal/threshold naming (reconciled below). Stop reason: all 8 charter questions answered with a concrete, evidence-backed recommendation.

---

## 1. Executive summary & recommendation

`deep-context` is the **fourth corner** of the deep-loop family: an INWARD, iterative, small-model-driven loop that maps the *existing* repository surface relevant to a feature and synthesizes an **implementation/planning-ready Context Report**. It is not research (outward discovery), review (audit), or council (planning) — it is the missing **"understand"** loop that runs *before* `/speckit:plan` and `/speckit:implement`.

**Recommended shape (MVP):** a single small-model, **by-slice** fan-out over a **code-graph-seeded frontier**, with the **host writing all merged state** and small models acting as **read-only analyzers**; convergence on **relevance-gated coverage saturation**; output a **Context Report whose top section is a REUSE catalog of pointers** (`file:symbol` + signature + how-to-extend), never raw source bodies. Built as the **3rd consumer of `deep-loop-runtime`** (requiring a new ownership ADR), reusing ~10 runtime libs as-is and extending 3 coverage-graph modules + `convergence.cjs` for `loop_type='context'`.

**Highest-leverage finding:** the Context Report can **replace the 4-agent parallel exploration dispatch inside `/speckit:plan` Step 5** (mimo iter-3) — turning deep-context from "nice to have" into a token-saving accelerator for the existing planning workflow.

**Most important risk the models surfaced (and the design must defend against):** *context rot + stale references*. Both lenses independently concluded that "more context ≠ better" (minimax: Chroma Context Rot, NoLiMa, LongMemEval) and that **stale `file:line` refs are worse than omission** (minimax iter-3) — so the report ships verified pointers + signatures, the consumer pulls bodies just-in-time, and every reuse entry carries a freshness/confidence label.

---

## 2. What `deep-context` is (the fourth corner)

| Loop | Direction | Convergence signal | Output |
|---|---|---|---|
| deep-research | outward (web/knowledge) | `newInfoRatio` 0.05 | `research.md` |
| deep-review | audit | severity-weighted P0/P1/P2 0.10 | `review-report.md` |
| deep-ai-council | planning deliberation | adjudicator-verdict stability 0.20 | `ai-council/**` |
| **deep-context** | **inward (codebase)** | **relevance-gated coverage saturation ~0.10** | **`context-report.md`** |

It is a loop-refined, convergence-gated superset of the existing one-shot `@context` agent's "Context Package" (`.opencode/agents/context.md`) — and should **coexist** with it (`@context` = quick one-shot lookup; `deep-context` = heavyweight iterative sweep invoked via `/deep:start-context-loop`). *(mimo iter-1/iter-3 OpenQ; minimax iter-3 — agreed.)*

---

## 3. Convergence model — relevance-gated coverage saturation [Q1]

**Core principle (both lenses):** convergence is **coverage saturation**, NOT novelty (research) or severity (review) — but raw coverage ("% slices visited") is a trap (minimax: Chroma — coverage ≠ utility). Use **marginal-utility / new-relevant-coverage per iteration**, gated by relevance so over-collection of low-relevance context cannot masquerade as progress.

**Recommended convergence (reconciled):**
- **Stop when** rolling `newCoverageDelta` < **0.10** over K=2–3 evidence iterations **AND** coverage signals pass their floors **AND** `relevanceFloor` is healthy — **OR** `maxIterations` (default 12) — **OR** deadlock (frontier revisit with no new evidence). *(minimax iter-5 dual-criterion `coverage_delta<0.05 AND new_finding_rate<0.10 for K=2`; mimo iter-2 weighted composite. Reconciled to a saturation delta + legal-stop gates mirroring deep-research's rolling-average pattern.)*
- **`newCoverageDelta` = |kept-unit-ids new this iteration| / |sub-questions or scope units|** — only **`kept`** units count (see gate). *(minimax iter-2 formula.)*

**Relevance gate (3-band — minimax iter-2, the cleanest proposal):**
| Band | Range | Action |
|---|---|---|
| `kept` | r ≥ 0.55 | counts toward coverage; in main report sections |
| `marginal` | 0.35 ≤ r < 0.55 | does NOT count toward saturation; surfaced under "Gaps/Unknowns" |
| `pruned` | r < 0.35 | dropped before graph upsert (logged in JSONL for post-mortem) |

The gate's enforcement signal is **`relevanceFloor`** = fraction of newly-added units this iteration that landed `kept` — the direct mechanism that stops noise from blocking saturation (the central Q1 risk). *(minimax iter-2.)*

**Five context signals (reconciled from mimo iter-2/iter-5 + minimax iter-2), computed by a new `computeContextSignals()`:**
1. `sliceCoverage` — slices with all in-scope files explored / total slices
2. `reuseCatalogCoverage` — REUSE_CANDIDATE nodes with ≥1 verification edge / total
3. `newCoverageDelta` — the saturation trigger (above)
4. `relevanceFloor` — the relevance gate enforcement (above)
5. `dependencyCompleteness` — IMPORTS/DEPENDS_ON edges with resolved targets / total

**Default threshold: 0.10.** *(mimo proposed 0.12/0.08/0.15 across iterations; minimax 0.10. Reconciled to 0.10 — between research 0.05 and review 0.10; final calibration is a build task against 2–3 real runs, per both models' open questions.)*

**Vacuous-pass guards** (minimax iter-2, mirroring research): no slices → `sliceCoverage=1.0`; no reuse candidates → `reuseCatalogCoverage=1.0` (feature genuinely has nothing to reuse — don't penalize); no questions → fail loudly.

---

## 4. Context Report schema [Q2]

**Design rule (both lenses):** the report ships **typed pointers + signatures, not source bodies** (minimax: just-in-time context, anti-context-rot); order by **reuse-candidate cluster, not file narrative** (minimax: coherent-ordering hurts long-context attention); every entry carries **confidence + freshness**.

**Core sections (reconciled — mimo iter-3's 9-section schema, pruned by minimax iter-3's value-per-token ranking):**

| # | Section | Format | Why (consumer behavior) |
|---|---|---|---|
| 1 | **REUSE Catalog** | JSON array (see below) | HIGHEST value — prevents reinventing code (repo principle); direct extend/compose target |
| 2 | **Integration Points** | ranked JSON (hard-required vs soft) | a single missed integration point = contract break (minimax iter-3 #1 failure mode) |
| 3 | **Touch List** | ordered file list (impl sequence) | direct action target for the implementer |
| 4 | **Conventions** | `file:line` exemplars (not prose) | prevents review churn; small + pervasive |
| 5 | **Pattern Precedent** | 2–3 concrete snippets ≤15 LOC | copy-modify starter; prevents style drift |
| 6 | **Module/Boundary Map** | JSON layers + entry points | planning scope (replaces plan.md's `architecture_explorer`) |
| 7 | **Pruned Dependency Subgraph** | edges within touch-radius only | impact awareness; full graph = noise |
| 8 | **Decision History** | date-stamped ADR/decision cites | prevents re-debating settled choices (planning) |
| 9 | **Gaps & Unknowns / Blind Spots** | markdown + severity | anti-false-confidence; cheap, high value |

**REUSE Catalog entry (mimo iter-3, the canonical shape):**
```json
{ "id":"reuse-001", "symbol":"validateToken", "kind":"function|class|util|pattern|hook|config",
  "file":"src/auth/validate.ts", "line":42, "fqSymbolId":"auth::validate::validateToken",
  "signature":"validateToken(token:string): Promise<AuthResult>", "purpose":"JWT validation w/ expiry",
  "reuseStrategy":"extend|compose|wrap|import-direct", "confidence":0.92, "relevance":0.85,
  "freshness":"verified|unverified", "evidence":"code_graph_query + Read", "limitations":"no refresh tokens" }
```
Sort: relevance ↓, confidence ↓. Confidence: 1.0 Read-verified + call-sites confirmed; 0.6 grep-only; <0.6 excluded. **Prefer `fqSymbolId` over line numbers** (lines shift; symbols are stable + grep-able — minimax iter-3).

**Planning vs implementing cut (minimax iter-3):** planning wants MAPS (topology, decisions, precedent); implementing wants NEEDLES (verified citable surgical targets). Serve both from ONE report via **mode-tagged sections** (`[planning]`/`[implementing]`/`[both]`), not two reports (context budget too scarce to gather twice).

**Consumer fit (mimo iter-3 — the efficiency win):** `/speckit:plan` Step 5 currently spawns 4 parallel exploration agents (`architecture_explorer`, `feature_explorer`, `dependency_explorer`, `test_explorer`); a pre-computed Context Report **replaces that entire dispatch** (§6/§8/§7/precedent → ~16K tokens + 4 dispatches saved). `/speckit:implement` Steps 1/3/6 consume §1 (verify reuse refs), §7+§9 (consistency/risks), §1+§4+§5 (development).

---

## 5. Frontier & chunking [Q3]

**Seed from the code graph, never the full repo** (both lenses; minimax: Aider repo-map = tree-sitter symbols + PageRank over the reference graph seeded from entry-points).

**Recommended (mimo iter-4 + minimax iter-1):**
1. **Anchor extraction** — parse the feature/query for paths, symbols, error strings, domain terms; Grep → `anchors[]`.
2. **Structural expansion** — `code_graph_query(blast_radius / calls_from)` 1-hop neighbors per anchor; cap `maxAnchorFanout≈20` to avoid hot-utility explosion.
3. **Cluster into SLICEs** — group by directory/module prefix; each cluster = one `SLICE` node with deterministic id.
4. **Frontier = ranked candidate list of *symbols* within a token budget** (minimax: graph-centrality ranking), not a flat file list.
5. **Guardrail** — if code-graph is stale/empty, fall back to Glob+Grep; never treat an empty graph as authoritative (mimo iter-4).

**Frontier bookkeeping in the coverage graph (mimo iter-4):** each SLICE starts with `FRONTIER` edges to its files; reading a file adds an `EXPLORED` edge; a slice's remaining frontier = `FRONTIER − EXPLORED`. Gap detection = SLICE nodes with unexplored frontier (SQL query proposed in mimo iter-4). Saturation = frontier exhausted + `newCoverageDelta` below threshold.

**Slice granularity is the #1 calibration unknown** (both models): file vs symbol-cluster vs directory. **Recommended default: symbol-cluster with an adjacency cap** (minimax iter-5), validated by a 3-run calibration sweep.

---

## 6. Relevance scoring & dedup [Q6]

**Relevance (minimax iter-2) — 5 cheap signals combined by log-odds averaging** (so one degraded signal can't dominate; weights renormalize over present signals):
- `s_path` (basename/dir/trigram match — O(1), free), `s_centrality` (code-graph hops + degree — reuses existing `NodeSignal`), `s_grep` (hit + co-occurrence density), `s_embed` (cosine; **fallback 0.5 neutral when embedder unavailable — never blocks the loop**), `s_model` (median of fan-out small-model judgments — free, already produced).

**Dedup (minimax iter-2 — elegant, zero new SQL):**
- Identity key `unit_id = sha256(normalize(path) + ':' + symbol_or_range + ':' + kind)`.
- The existing `coverage_nodes` composite PK + `content_hash` column means **the SQLite upsert conflict IS the dedup** — set `id = unit_id`, first inserter wins on fields, subsequent hits merge metadata (`relevance = max`, `lineages[]` union, `model_judgments[]` append).
- **Content-drift defense:** same `unit_id`, new `content_hash` (file edited mid-run) → overwrite + flag `content_drift`, but **treat as the same unit (no re-count)** so active edits can't prevent convergence.

---

## 7. Fan-out topology & lineage dispatch contract [Q4, Q5]

**Topology (minimax iter-4):** **by-slice is the default** (disjoint partition → trivial dedup); **by-model is a v2 secondary axis** (same slice, multiple lenses) only when a by-slice pass yields low relevance; **single lineage** for trivial targets. Concurrency cap K≈4 for small models (reuse `fanout-pool.cjs` `concurrency`).

**Disjoint partitioning (mimo iter-4):** round-robin slices across lineages by index (stateless, verifiable); per-kind state-dir isolation already exists (`SPECKIT_<KIND>_STATE_DIR`).

**THE dispatch-contract fix (minimax iter-4 — confirms & solves the gap I found pre-flight):** the current `fanout-run.cjs:buildLoopPrompt` carries spec-folder/lineage-dir/session/executor but **omits the gather-subject, slice boundary, known-context, and output schema → a worker runs blind.** The deep-context lineage prompt MUST carry, as mandatory fields validated at `renderPromptPack` time (so a missing field throws *before* spawn):
`gather_subject` · `slice_boundary` (allow-globs + denylist) · `known_context` (target `handover.md`/`spec.md`/`resource-map.md` — the @context Layer-1 anchor) · `output_schema` (typed slice registry JSON) · `lineage_label` · `session_id` · `artifact_dir` · `read_only:true`.

**State ownership (minimax iter-4 — Gate-3 + reliability):** **lineages write only inside their `artifact_dir`** (write-once `iteration-NNN.md`, append-only slice JSONL, per-slice registry); the **host writes all merged surfaces** (`context-report.{md,json}`, `fanout-attribution.md`, cross-lineage graph upserts, convergence). Rationale: the merged report is what `/speckit:plan` consumes — a sub-agent must never corrupt it; only the host has the all-lineages view for dedup/rollup; partial-failure containment (emit a partial report from surviving slices). This is the **reducer-owned-files pattern** reused verbatim.

---

## 8. Reuse map, ownership ADR & coverage-graph delta [Q7] — the build map

**Reuse onto `deep-loop-runtime` (mimo iter-1/iter-5, minimax iter-4 — strong agreement):**
- **AS-IS (10 libs):** `executor-config`, `executor-audit`, `prompt-pack`, `post-dispatch-validate`, `atomic-state`, `jsonl-repair`, `loop-lock`, `permissions-gate`, `bayesian-scorer`, `fallback-router`; plus `fanout-*.cjs` (4) and `upsert.cjs`/`query.cjs`/`status.cjs` (pass `--loop-type context`).
- **EXTEND (3 + 1):** `coverage-graph-db.ts` (LoopType union, `VALID_KINDS`/`VALID_RELATIONS` + CHECK constraint + SCHEMA_VERSION→3), `coverage-graph-signals.ts` (`ContextConvergenceSignals` + `computeContextSignals` + dispatch branch), `coverage-graph-query.ts` (context gap queries), and `convergence.cjs` (`evaluateContext` + composite-score branch + accept `'context'`).
- **NEW skill files** mirroring the deep-research tree: `.opencode/skills/deep-context/{SKILL.md, assets/(config,strategy,dashboard,prompt_pack tmpl,runtime_capabilities), references/(protocol,convergence,state,guides), scripts/(reduce-state.cjs, runtime-capabilities.cjs)}`; `.opencode/commands/deep/start-context-loop.md` + `assets/deep_start-context-loop_{auto,confirm}.yaml`; `.opencode/agents/deep-context.md` (LEAF, read-only, code-graph/grep/read tools, **no WebFetch**).

**Ownership ADR (mandated by `deep-loop-runtime/SKILL.md §4`) must record:** consumer registration (3rd consumer); `LoopType` extension (backward-compatible additive CHECK); SCHEMA_VERSION 2→3 (additive migration, existing reuses the drop/recreate path); convergence semantics (saturation, threshold 0.10); context node-kind/relation ownership (PK includes `loop_type` → no collision); read-only-analyzer contract; downstream `/speckit:plan`+`/speckit:implement` integration; **no new MCP tools** (isolation ADR).

**Coverage-graph delta (reconciled minimal set — mimo + minimax proposals merged):**
- **Node kinds (`loop_type='context'`):** `SLICE`, `FILE`, `SYMBOL`, `PATTERN`, `REUSE_CANDIDATE`, `DEPENDENCY`, `CONSTRAINT`, `GAP`. *(Reconciles mimo's SCOPE/MODULE/INTERFACE/FRONTIER variants and minimax's SLICE/REUSE_ENTRY/CONTRADICTION; final names fixed in the ADR.)*
- **Relations:** `CONTAINS`(SLICE→FILE), `REFERENCES`(FILE→SYMBOL), `IMPORTS`/`DEPENDS_ON`, `IMPLEMENTS`(→PATTERN), `EXPOSES`(→API), `REUSES`/`EXTENDS`(→REUSE_CANDIDATE, weight 1.5 — highest, repo principle), `CONSTRAINS`, `COVERED_BY`, `CONTRADICTS` (reused), plus `FRONTIER`/`EXPLORED` markers for frontier bookkeeping.

---

## 9. Prior art & negative knowledge [Q8]

**Borrow (minimax iter-1, cited):** Aider repo-map (tree-sitter symbols + PageRank-ranked, token-budgeted); ctags as a cheap first-pass symbol enumeration; RAPTOR-style multi-granularity zoom ladder (symbol→file→module); GraphRAG community summaries *only* for thematic knowledge (with staleness re-validation); Anthropic agentic/iterative retrieval + orchestrator-worker sub-agents (each subagent returns a 1–2K-token condensed summary); two-mode slice tool (`skeleton` signatures vs `body`); just-in-time context (ship pointers, pull bodies on demand); `CONVENTIONS.md`-style derived conventions section.

**AVOID (negative knowledge — both lenses):** naive whole-repo embedding RAG (similarity ≠ reuse-relevance; degrades with length); pre-baking raw source into the report (context rot); stale hierarchical/community summaries (re-validate by content-hash); "% slices visited" as convergence (coverage ≠ utility); coherent file-order narrative (hurts long-context attention — group by reuse cluster); one mega-prompt "understand the whole repo" (that's `@context`'s ceiling, ~50K tokens); free-form finding text (uncitable/unmergeable — require schema-bound categories); by-model fan-out in v1 (council's job; doubles cost, no proven value for a non-adversarial task); confidence scores without source pointers (un-re-validatable).

**Sources** (external prior art surfaced by the minimax lineage): [SOURCE: Aider repo-map + CONVENTIONS.md], [SOURCE: arXiv:2401.18059 (RAPTOR)], [SOURCE: arXiv:2404.16130 (Microsoft GraphRAG)], [SOURCE: Chroma "Context Rot" 2025], [SOURCE: Anthropic agentic-retrieval / sub-agents / context-engineering / tool-design 2025], [SOURCE: NoLiMa + LongMemEval]. Internal evidence: per-iteration files under `research/lineages/{mimo,minimax}/`.

---

## 10. Recommended MVP & phased roadmap (minimax iter-5, endorsed)

**v1 ships:** `loop_type='context'` + ownership ADR; coverage-graph delta; code-graph-seeded frontier (anchors → 1-hop → symbol clusters; supports diff / target-symbol / open-ended seeding); single small-model by-slice fan-out (default `MiniMax-M3` via cli-opencode, configurable; one slice per call); read-only analyzer prompt pack with JSON-schema output `{category, ref:file:line/fqSymbol, one_line, relevance:0-1}`; host-writes atomic JSONL state; relevance-gated dual-criterion saturation convergence (`newCoverageDelta<0.10 AND relevanceFloor healthy for K=2`, cap 12, deadlock detector); **post-dispatch validation that resolves every cited `file:line` against the code graph and surfaces a per-slice hallucination rate** (drops invalid refs, never silently repairs); Context Report = REUSE Catalog + Integration Points + Touch List + Conventions + Gaps/Unknowns + Methodology/Confidence; consumed directly by `/speckit:plan` + `/speckit:implement`.

**v2:** two-model agreement-gated cross-check; embedding relevance for dedup/ranking; multi-symbol slice bundling; churn/recency signals; `context_snapshot_diff` between runs.

**Deferred:** dashboard/UI; cross-repo/monorepo federation; live mid-loop FS-watch refresh; causal-graph decision lineage; persistent cross-run cache.

---

## 11. Open questions for the build

1. **Packet location when no spec folder exists yet.** deep-context runs *before* `/speckit:plan`, so there may be no spec folder. mimo: `{spec_folder}/context/` mirroring `research/`; minimax: standalone `.opencode/skills/deep-context/runs/<run-id>/`. **Decision needed** — likely: `{spec_folder}/context/` when a folder exists, else a standalone run dir, with `/speckit:plan` ingesting the report path. deep-context must NOT mutate `spec.md` (that's plan's job).
2. **Final slice granularity + convergence thresholds** — calibrate (file vs symbol-cluster vs dir; `newCoverageDelta`, K, relevance bands) against 2–3 real targets.
3. **Embedding storage** — sidecar `deep-context-embeddings.sqlite` keyed on `content_hash` (recommended — keeps runtime-owned graph schema untouched) vs a `coverage_nodes.embedding` column (rejected by minimax).
4. **Single report vs dual planning/implementing views** — recommend one report with mode-tagged sections.
5. **REUSE_CANDIDATE emission** — analyzer-tagged (recommended, keeps convergence math pure) vs separate post-pass.
6. **Small-model selection** — benchmark MiniMax-M3 vs MiMo vs Qwen/Kimi on schema fidelity, `file:line` accuracy, out-of-scope refusal (no write attempts), cost-per-validated-finding (a natural `/deep:start-model-benchmark-loop` job).
7. **Code-graph readiness** — auto-trigger `code_graph_scan` at init vs require caller readiness.
8. **ADR authorship** — deep-context owner vs runtime maintainer writes the ownership ADR.

---

## 12. Convergence report & attribution

- **Iterations:** 10 (mimo 5 + minimax 5), 2 parallel lineages, all exit 0, all returned complete delimited findings. Per-iteration evidence: `research/lineages/{mimo,minimax}/iteration-001..005.md`; state log `research/deep-research-state.jsonl`.
- **mimo (internal lens)** drove: reuse inventory + @context structure (i1), convergence signals + relevance gate (i2), 9-section report schema + consumer-fit + the plan-Step-5-replacement insight (i3), frontier seeding/bookkeeping + gap-detection SQL (i4), full file inventory + runtime-reuse table + coverage-graph TypeScript delta (i5).
- **minimax (external lens)** drove: cited prior art (Aider/RAPTOR/GraphRAG/Anthropic/Chroma) + context-rot negative knowledge (i1), log-odds relevance + zero-SQL dedup + 3-band gate (i2), planning-vs-implementing needs + failure-mode/value-ranking (i3), fan-out topology + the mandatory lineage-prompt contract + state-ownership rationale (i4), risks + negative knowledge + the decisive MVP/roadmap (i5).
- **Reconciliations the host made:** convergence threshold → 0.10; one canonical 5-signal set; one minimal node-kind/relation set; report location flagged as the top build-time open question; by-model fan-out → v2.
- **Cross-model agreement (high confidence):** 3rd-consumer + ownership ADR; coverage-graph `loop_type='context'` schema bump; saturation+relevance-gate convergence; code-graph-seeded by-slice frontier; host-writes-state + read-only analyzers; REUSE-catalog-first report shipping pointers not bodies; lineage prompt must carry the gather-subject.

**Next:** `/speckit:plan` for the `deep-context` build (Level-3 packet + ownership ADR), using this report as the seed.
