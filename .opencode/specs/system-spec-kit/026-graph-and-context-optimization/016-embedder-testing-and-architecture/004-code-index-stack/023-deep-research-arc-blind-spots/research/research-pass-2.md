# Deep Research 023 - Pass 2 Running Synthesis

## Executive Summary
Pass 2 keeps the Pass 1 verdict at **CONTINGENT**, but changes the shape of the recommendation. Several Pass 1 claims were too broad: only `2/8` registered embedders are non-768d, commercial-safe rerankers exist, RRF is flat rather than knife-edge on the current fixture, and pure high-offset KNN fails fast under sqlite-vec's cap. Those falsifications are useful.

The survivors are narrower and stronger. The active vector table is still `embedding float[768]`; `jinaai/jina-reranker-v3` remains the default despite CC BY-NC 4.0; query/document prompt policy is asymmetric; a valid path-filtered query took `21.59s`; and the local fork is based on upstream `cocoindex-code` `0.2.3` while upstream has moved to `0.2.33` and core `cocoindex` `1.0.6`.

Pass-2 finding-count basis: `35` findings across iterations 011-020: `20` STRENGTHENS, `5` FALSIFIES, `10` ORTHOGONAL; `12` HIGH-LATENT-RISK, `16` MEDIUM-OPPORTUNITY, `7` LOW-CURIOSITY.

## Pass-1 Attack Scorecard
| Pass 1 claim | Pass 2 status | Reason |
| --- | --- | --- |
| FINDING-001-A fixture representativeness | STRENGTHENED | Three new architecture-invariant probes missed expected core files, so the fixture remains narrow. |
| FINDING-002-A non-768 landscape pressure | STRENGTHENED | Immediate blast radius narrowed to `2/8` non-768 registry entries, but schema and migration risk remain real. |
| FINDING-002-B Jina-v3 license risk | STRENGTHENED | "No alternatives" was falsified, but default CC BY-NC governance risk survived. |
| FINDING-003-A calibration confidence | STRENGTHENED | RRF knife-edge was falsified; fixture narrowness and low-information calibration survived. |
| FINDING-004-A 768d schema lock | STRENGTHENED | Active schema is still `float[768]`, and non-768 opt-ins require reset/reindex behavior. |
| FINDING-004-B global daemon embedder | STRENGTHENED | Peer/status comparison reinforced the need for per-project effective model/index metadata. |
| FINDING-005-A search cost fanout | STRENGTHENED | Valid path-filtered high-offset payload took `21.59s`; pure KNN overrun was falsified. |
| FINDING-006-A prompt-policy metadata | STRENGTHENED | Current query path has prompt handling while index path embeds raw chunks; upstream has related indexing/query params. |
| FINDING-006-B dedup before rerank | UNCHANGED | Pass 2 did not find counter-evidence or a stronger reproducer for this specific contract. |
| FINDING-008-A stale global CLI/venv drift | STRENGTHENED | Upstream drift and thin status UX increase operator-confusion risk, though the original CLI failure was not re-run. |
| FINDING-009-A coverage tooling absent | UNCHANGED | Pass 2 did not re-run coverage; no new evidence changed the claim. |
| FINDING-010-A schema/external/daemon amplification | STRENGTHENED | Schema lock, upstream drift, and prompt-policy asymmetry now amplify each other. |
| FINDING-010-B fixture/calibration/observability amplification | STRENGTHENED | New probes plus weak telemetry strengthened the compound-risk claim. |

## Quantified Risks
| Risk | Quantified evidence | Interpretation |
| --- | --- | --- |
| Registry dimension pressure | `8` manifests, `6` at 768d, `1` at 1024d, `1` at 2048d | The immediate registry pressure is moderate, not broad, but non-768 support is already in scope. |
| Active schema lock | SQLite schema command returned `embedding float[768]` | Any non-768 opt-in requires a reset/reindex or new table/index strategy. |
| Reindex cost | Benchmark report rows cite roughly `10-25` minute reindex windows | Rollback and operator UX are required before promoting model swaps. |
| License alternatives | HF API checks: Jina CC BY-NC; BGE, mxbai, Qwen, GTE Apache-2.0 | The risk is default governance, not absence of commercial-safe choices. |
| RRF perturbation | BGE stayed `12/18`; Jina stayed `14/18` across K30/K60/K90/K120 | RRF is low-information on this fixture, not empirically knife-edge. |
| New blind-spot probes | `3/3` new probes missed at least one expected core file in top-5 | Current fixture does not cover architecture-governance queries. |
| Search cost | `--path '*' --limit 100 --offset 20000` took `21.59s` and deduped `56,512` aliases | Request budget clamps are a concrete hardening need. |
| Upstream drift | Local fork base `0.2.3`; upstream `cocoindex-code` `0.2.33`; core pin `1.0.0a33` vs upstream `1.0.6` | Rebase/import should precede heavy local architecture. |

## Counter-Designs Explored
Fixed dimensions are normal. LlamaIndex and CocoIndex docs both treat vector dimension as schema-relevant; the local problem is not fixed dimensions, but weak compatibility metadata and reset/reindex ergonomics.

Commercial-safe reranking is available. BGE, mxbai, Qwen, and GTE reported Apache-2.0 via Hugging Face API checks. The counter-design is a license-aware model manifest and a commercial-safe default profile, not removing Jina.

Search-first enterprise retrieval is a serious alternative. Sourcegraph Cody's FAQ says Sourcegraph replaced embeddings with Sourcegraph Search for enterprise scale and maintenance reasons. That does not obsolete this stack, but it argues that 023B should compare embedding-heavy, hybrid, and graph/symbol-assisted retrieval rather than only swapping models.

## Comparative Architecture Deltas
| Peer/source | Relevant pattern | Local delta |
| --- | --- | --- |
| LlamaIndex vector stores | Explicit dimension/index construction is common | Add stored model/dimension/index metadata instead of pretending vectors are dimension-free. |
| LangChain vector stores | Vector store initialized around a specific embedding model | Surface effective embedder config in status and compatibility checks. |
| Continue | Model roles include `embed` and `rerank` | Local role behavior is split across config, shared globals, indexer, query, and reranker. |
| Sourcegraph Cody | Enterprise path moved away from embeddings for scale/security/maintenance | Keep graph/search-assisted retrieval in the calibration study. |
| Cursor | User-facing indexing status and multi-root indexing | Local daemon status lacks model, freshness, progress, and per-project compatibility. |
| CocoIndex upstream docs | Embedding transforms should be shared between indexing and querying | Local query prompt handling is not mirrored by index-time document prompt policy. |

## Upstream And Peer-Pattern Import Opportunities
- Add packet **023F upstream rebase/import spike** before 023A heavy architecture.
- Inspect upstream `cocoindex-code` `v0.2.29` for configurable `indexing_params` and `query_params` before inventing local `EmbedderPromptPolicy` from scratch.
- Inspect upstream `v0.2.30` dimension-parameter removal before adding a generic user-facing dimensions knob.
- Consider importing upstream Svelte/Vue language support into the fixture expansion if rebase lands.
- Borrow Cursor-like status UX: active model, index freshness, indexing progress, and compatibility mismatch.

## Time-Machine: Undocumented Decisions
The git history shows rapid default churn:

- `8f909d2299`: Jina-code default plus Metal auto-detect.
- `4ec84cec26`: hybrid and rerank promoted default-on.
- `c6a6493e6c`: GTE default swapped to BGE because GTE was broken on Apple Silicon MPS.
- `38d4e2d627`: Jina-v3 locked as production reranker default.
- `8364bdd5b7`: Nomic CodeRankEmbed promoted as production embedder default.
- `ee788254d1`: RRF described as no-op and locked for latency.

The missing ADRs are: quality default versus commercial-safe default, RRF no-op/latency lock criteria, and the invariant "fix code/pipeline before model swap." Future remediation arcs should also keep a machine-readable finding-to-file or finding-to-commit map.

## Migration Cost Matrix
| Packet | Code touch | Test touch | Migration risk | Rollback story | Operator disruption | ROI read |
| --- | --- | --- | --- | --- | --- | --- |
| 023A dimension/prompt/index metadata | High: schema/indexer/query/daemon/config/protocol/docs | High: compatibility, reindex, daemon, registry | High: existing index compatibility and reindex path | Requires old-index read/refusal and reset guidance | Medium-high: model/index mismatch may block search | Split into 023A1 metadata, 023A2 prompt/license registry, 023A3 optional multi-dim storage. |
| 023B fixture/calibration | Medium: bench harness and fixture | Medium-high: new probes and repeated runs | Low-medium: evidence changes defaults | Revert fixture/default decision | Low unless defaults change | Do after telemetry; otherwise more numbers without diagnosis. |
| 023C retrieval observability | Medium: query/protocol/status/logs | Medium: telemetry assertions | Low | Disable counters or hide fields | Low | High because it explains misses and supports 023B. |
| 023D doctor/model-swap UX | Medium: CLI/settings/status/docs | Medium | Low-medium | Warnings can be downgraded | Low-medium: more visible warnings | Useful, but some license and metadata fields belong in 023A/023C. |
| 023E request-budget hardening | Low-medium: query/server/cli/protocol/tests | Low-medium: budget and adversarial cases | Low | Config flag or relaxed defaults | Low: invalid/adversarial inputs rejected earlier | Highest immediate ROI: concrete `21.59s` repro and small rollback surface. |
| 023F upstream rebase/import spike | Low-medium for spike; unknown for merge | Medium: upstream compatibility smoke | Medium: merge conflicts and behavior drift | Keep fork branch; cherry-pick patterns only | Low if spike-only | Must precede heavy 023A to avoid hardening stale abstractions. |

## Verdict-Flip Scenarios
**FRAGILE** if any two of these hold:
- Upstream rebase reveals missed security/correctness fixes in local fork.
- Default path-filtered MCP/CLI queries exceed the request budget under normal IDE/MCP usage.
- Commercial operators hit the Jina CC BY-NC default without warning or opt-in.
- Expanded architecture-invariant fixture drops materially below the current `14/18` quality floor.
- Daemon/index metadata mismatch causes wrong-model searches after a model/config change.

**ROBUST** only after measurable gates:
- Existing fixture remains at least `14/18` across 3 repeated runs.
- Expanded architecture-invariant fixture has an agreed pass threshold and meets it.
- Search p95 stays below `10s` for bounded valid inputs, including path/language cases.
- License manifest and model-policy status are visible in `ccc status` or doctor output.
- Reranker fallback, candidate counts, boost flips, and index freshness are observable.

## Second- And Third-Order Amplifications
- **Upstream drift + prompt policy + schema lock**: designing local metadata without upstream import can lock in the wrong abstraction.
- **Request cost + weak observability**: a slow query can breach budgets while logs lack fanout/candidate counters to diagnose it.
- **License default + default churn history**: a quality-driven Jina default becomes a governance issue because the acceptance criteria were not made durable.
- **Fixture flat-line + reranker dominance**: stable RRF rows can look like confidence while the fixture is simply unable to distinguish fusion settings.
- **Global daemon + model swaps + reindex cost**: users can pay a long reindex cost and still lack a visible guarantee that the live daemon/index pair matches.

## Combined Pass 1 + Pass 2 Recommendation
1. **023E request-budget hardening**: first, because it has a concrete `21.59s` repro and likely small code/test scope.
2. **023C retrieval observability**: second, because calibration and operator trust need counters, fingerprints, and fallback visibility.
3. **023F upstream rebase/import spike**: third, before locking in 023A abstractions.
4. **023A1 metadata/fingerprint compatibility**: store and compare model, dimension, prompt policy, license class, chunking policy, and corpus settings.
5. **023A2 prompt/license registry fields**: make document/query/rerank roles explicit and deterministic.
6. **023A3 optional multi-dimension storage**: only after metadata and upstream import shape the schema.
7. **023B fixture expansion + calibration**: expand architecture-invariant probes, residual taxonomy, top-K, and reranker/fusion sweeps after observability exists.
8. **023D doctor/model-swap UX**: fold in license warnings, stale CLI checks, reindex estimates, and rollback guidance.

## Pass-2 Failed Hypotheses
- "Most registered embedders are non-768" failed: only `2/8` are non-768.
- "Commercial-safe rerankers are unavailable" failed: multiple Apache-2.0 alternatives exist.
- "Prompt-policy risk requires a large migration before any useful test" failed: a compact contract test can pin the invariant.
- "RRF K=60 is a knife-edge optimum" failed: hit/miss patterns flat-lined across K perturbations.
- "Any high-offset query is equally dangerous" failed: pure KNN high offset fails fast under sqlite-vec's `4096` cap.
- "Local fork is current enough that upstream cannot change recommendations" failed: upstream moved from `0.2.3` to `0.2.33`.
- "Highest severity should always be first" failed: 023E has better immediate ROI than 023A.

## Artifact Paths
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-011.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-012.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-013.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-014.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-015.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-016.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-017.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-018.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-019.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/iterations/iteration-020.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/research-pass-2.md`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/023-deep-research-arc-blind-spots/research/research-report-pass-2.md`
