# Deep Research Synthesis — 50 Angles on the 026 Program

- **Date:** 2026-06-05
- **Method:** 3-model parallel fan-out, one provider per lane, model-tuned prompts (DeepSeek-v4-pro / RCAF, MiMo-V2.5-Pro / COSTAR-lean, MiniMax-M3 / TIDD-EC). 10 dispatches, 50 angles, all exit 0, all read-only with repo evidence.
- **Per-angle notes:** `research/iterations/D1..D10.md` (this file is the synthesis).
- **Angle catalog:** `research/research-angles.md`.

---

## The one finding that dominates everything: 026 shipped mechanisms, deferred measurement

Across all three models and most of the 50 angles, the same pattern recurs: **the capability shipped with a sound contract, a harness, or tests, but the empirical number that would prove it optimal was never produced.** This is the single biggest theme of the 026 program.

Unmeasured-but-shipped, by angle:
- **q8 vs fp16 dtype** (12): harness complete, never run — blocked on an `onnxruntime-common` dependency resolution. *Most actionable deferred item in the embedding stack.*
- **Local vs cloud retrieval quality** (11): the bake-off compared local models against each other; cloud (Voyage/OpenAI) was never in the judged fixture. Local-first cost is **UNKNOWN**.
- **Async-enrichment latency delta** (1): no-latency is structurally enforced via `setImmediate`, but the p50/p95 claim is unbenchmarked.
- **Fan-out lineage diversity** (31, 35): ~~never measured~~ — **measured 2026-06-06** (`experiments/fanout-diversity/`): heterogeneity ≈ resampling for coverage (trio union 1.05× best same-model pair; cross-model J 0.42 ≈ same-model 0.405); its real value is blind-spot insurance + cross-lane adjudication, not volume.
- **Skill-advisor in-the-wild accuracy** (27), semantic-vs-lexical ablation (28), 0.8 threshold calibration (29), enhancement-edge discovery lift (30): all synthetic-proxy only, no real-stream measurement.
- **Prompt-framework picks** (36): ~70% convention default, ~30% empirically validated; CRISPE/CRAFT have zero coverage.
- **Convergence 0.10 threshold** (34), **detector provenance precision/recall** (23), **model-benchmark near-saturation edge** (32): uncalibrated/unvalidated.

**Implication:** the highest-leverage follow-up to 026 is not new features but a **measurement sprint** that converts these contracts into numbers.

## Cross-model behavior (angle 35, observed live)
The three models could not be directly compared on identical angles (the run partitioned angles for coverage), but their *styles* diverged usefully: **MiMo** produced the richest historical context (embedding bake-off lineage, cold-start phases, generalizability ordering); **DeepSeek** gave the crispest formal-correctness verdicts (checkpoint crash-window proof, WAL bound); **MiniMax** was the best at finding **concrete in-code defects** (the cache-invalidation gap, the variant-suppression line). The diversity test has now been run (2026-06-06, `experiments/fanout-diversity/`): the same 5 angles through all three lanes, twice each. The styles above are real; the coverage dividend is not — cross-model Jaccard (0.42) equals same-model resampling (0.405), and the trio union beats the best single-model pair by only 1.05×. Heterogeneity's measured value: blind-spot insurance (M3 double-missed a verified watcher-bypass defect that DeepSeek and MiMo each caught once) and adjudication (cross-lane disagreement exposed one false MiMo claim and one DeepSeek verdict flip).

---

## Highest-value actionable findings (concrete, low-cost, high-signal)

These are real defects/gaps the models located with file evidence, ordered by value/cost:

1. **Entity-density cache invalidation gap (angle 7, MiniMax).** `memory_causal_link` / `memory_causal_unlink` (and likely `memory_ingest_start`) mutate entity state without calling the post-mutation cache-invalidation hook. *Fix:* add `runPostMutationHooks('causal-link'|'causal-unlink', …)` in those handlers. Lowest-cost, highest-signal fix in the set.
2. **`--variant high` suppressed for MiniMax in one dispatch path (angle 39, MiniMax).** `live-executor.cjs:83` carries a `!/minimax/i.test(model)` exception that strips `--variant`, while `dispatch-model.cjs` forwards it — the two paths disagree. *Fix:* remove the exception + add a per-provider smoke test asserting `--variant high` reaches argv.
3. **Launcher-lease copy-incompleteness latent in 2 more fixtures (angle 22, DeepSeek).** The same root cause that broke the spec-kit launcher-lease suite (fixture copies the launcher but not its `lib/` tree) is present in two other active suites; try/catch guards hide it. *Fix:* one-line `cpSync` each + a shared `setupLauncherFixture()` that asserts `lib/` present.
4. **maxDepth silently truncates blast-radius (angle 25, DeepSeek).** `code_graph_query` drops frontier nodes at `maxDepth` with no completeness signal. *Fix:* emit `depthTruncated: true` (mirroring `overflowed`); consider raising default 3→5.
5. **Symmetric metadata-staleness rule missing (angle 47, MiniMax).** The only auto-refresh is save-time `refreshGraphMetadata`; `CONTINUITY_FRESHNESS` is one-sided (silent when graph-metadata is *older* than source). *Fix:* add `stale_after_days` + mtime check to the backfill + a `GRAPH_METADATA_STALE` validate rule. (This is the same drift class fixed manually this session.)

## Reassuring correctness verdicts (no action needed)
- **checkpoint-v2** (10, DeepSeek): no unrecoverable crash windows remain after the P1 fix; two-phase journal + `.needs-rebuild` sentinel cover all crash timings. Residual concerns are disk-waste only.
- **WAL-on-close** (19, DeepSeek): bounded autocheckpoint closes the previously-unbounded window (~9.2 MiB → ~1 MiB + 5-min delta); remaining gap is the deliberate `synchronous=NORMAL` power-loss tradeoff.
- **SEC-001 conflict guard** (4, DeepSeek): correct within its 2-node reciprocal scope; transitive (3+ node) cycle detection is a known, unimplemented gap.
- **Socket TOCTOU** (20, DeepSeek): formally complete for cross-uid attacks; residual same-uid `chmodSync` self-race is P2 defense-in-depth.
- **Async-enrichment crash safety** (2, MiniMax): the `markEnrichmentPending` + backfill-drain invariant holds; no silent data loss.
- **AI-authored changelog accuracy** (45, MiMo): **zero fabrication** across ~694 changelogs; the real problem was drift (stale cells), not invention.

---

## The measurement backlog (recommended next experiments, ranked)
1. Unblock `onnxruntime-common`, run `bench-dtype-q8-fp16.cjs` → decide DEFAULT_DTYPE (angle 12).
2. Run the cat-24/409 + 50-query holdout against Voyage-4 / OpenAI vs nomic/jina, with and without rescue → quantify local-first cost (11), plus a code-domain fixture (14).
3. Measure peak hf-local RSS under load → set a calibrated `SPECKIT_HF_MODEL_SERVER_MAX_RSS_MB` default + a memory-sufficiency preflight (13).
4. ~~Run the same angles through all 3 models and measure finding-overlap~~ → **DONE 2026-06-06** (31, 35 answered): diversity is stochastic, not model-driven; see `experiments/fanout-diversity/analysis.md`.
5. Skill-advisor: ship the semantic-vs-lexical diff + a 0.8-threshold calibration report from existing shadow-delta data (28, 29).
6. Add a CI fan-out speedup benchmark at K={1,2,3} (21) and a convergence auto-tuning curve (34).

## Per-theme verdict digest (all 50)
- **Memory/causal (1-10):** sound engineering; gaps are measurement (1,5) + 2 read-path/multi-tenant follow-ups (9), a cache-invalidation bug (7), a cross-session move-during-scan race untested (8), transitive-cycle detection unimplemented (4). Causal coverage ceiling ~62% inferred, ~50-55% without external signals (3,5).
- **Embeddings (11-15):** local-first cost unmeasured; dtype bench blocked; consolidation cost zero recall (cleanup only); cold-start lever = keep the model server alive across daemon recycles (15).
- **Daemon/MCP (16-22):** transparency is "retryable not silent-hang" by design; lease model is defense-in-depth-sound with a 120s no-secondary-demand gap (17); generalizing transparent recycle needs shared-daemon mode first (18); 2 latent test fixtures (22).
- **Code-graph (23-26):** provenance honest but unvalidated (23); maxDepth truncates silently (25); CocoIndex decoupling lost nothing material (24); union/breadcrumb unused-but-harmless (26).
- **Skill-advisor (27-30):** all four are built-but-unmeasured; do not quote a top-1 from the synthetic corpus.
- **Deep-loop (31-35):** fan-out diversity now measured (31/35, 2026-06-06): stochastic-not-model-driven, heterogeneity earns its seat as insurance/adjudication only; correctness gate solid except near-saturation edge; round-2 verify works but FP-reduction unmeasured.
- **Prompt toolkit (36-39):** sk-prompt is cleanly forkable (HIGH confidence, 37); frameworks ~70% convention (36); open-model frontier partially mapped, DeepSeek unmeasured (38); variant-forwarding mostly confirmed, one code divergence (39).
- **Operator (40-42):** doctor strong on data-plane, weak on control-plane (40); worktree isolation net-positive-by-construction but unquantified (41); hook parity is a goal not a state — Codex partial, Gemini/Copilot degraded (42).
- **Program-meta (43-50):** phase decomposition net-positive above ~50 packets (43); centralization made drift *visible* not *smaller* (44); zero changelog fabrication (45); verify-first batches ~27% strict-confirmed / ~20% refuted (46); no working metadata TTL (47); shipped-then-removed marker incomplete coverage (48); index-race solved for scan, untested for daemon writes (49); front-proxy is the clear reusable extraction (50).

<!-- ANCHOR:sources -->
## Sources

- Source: `research/research-angles.md` — the 50 angles investigated.
- Source: `research/iterations/D1..D10.md` — the per-model deep-research notes (MiMo / DeepSeek / MiniMax-M3), each citing repo file:line and commit evidence.
- Source: `research/measurement-backlog.md` — the deferred experiments with commands and diagnosed blockers.
- Source: `research/experiments/fanout-diversity/` — the executed angle-31/35 diversity experiment (pre-registered design, 6 runs, audit matrix, adjudications).
- Source: the 026 changelog tree at `002-graph-and-context-optimization/changelog/` and `.opencode/changelog/system-spec-kit/v3.5.0.0.md` — the shipped behavior the angles were assessed against.
<!-- /ANCHOR:sources -->
