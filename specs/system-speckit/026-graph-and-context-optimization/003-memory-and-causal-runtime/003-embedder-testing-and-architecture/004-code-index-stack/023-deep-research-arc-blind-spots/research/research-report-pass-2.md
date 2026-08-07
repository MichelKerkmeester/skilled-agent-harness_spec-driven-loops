# Deep Research 023 - Research Report Pass 2

## Executive Summary
Pass 2 leaves Pass 1's **CONTINGENT** verdict intact, but makes it more precise. The current default is still defensible under the existing evidence: Pass 1 had `172 passed` and the best corrected fixture lane reached `14/18`. Pass 2 did not find a current-default correctness failure.

The hostile review did falsify overbroad readings. Current registry pressure is `2/8` non-768 embedders, not most adapters. Jina is not the only viable reranker; Apache-2.0 alternatives exist. RRF is not knife-edge on the current fixture; it flat-lines. Pure high-offset KNN is capped by sqlite-vec. Those null results sharpen the work.

The surviving risks are concrete enough to keep the verdict from becoming ROBUST: a valid path-filtered high-offset query took `21.59s`; the default reranker is CC BY-NC 4.0; prompt policy remains asymmetric between query and index paths; upstream `cocoindex-code` has moved from the local `0.2.3` fork base to `0.2.33`; and the current fixture misses architecture-invariant queries.

**Comparison to Pass 1**: Pass 1 said CONTINGENT because the arc was strong on the fixture but exposed to hidden contracts. Pass 2 says CONTINGENT because several hidden contracts survived hostile review, and two new blind spots - upstream drift and migration ROI - changed packet ordering.

## Pass-1 Attack Scorecard: HIGH-LATENT-RISK
| Pass 1 finding | Outcome | One-line justification |
| --- | --- | --- |
| FINDING-001-A fixture representativeness | STRENGTHENED | Three Pass-2 architecture-invariant probes missed expected implementation files. |
| FINDING-002-A external non-768 landscape | STRENGTHENED | `2/8` local entries are non-768, narrowing but not eliminating schema-risk pressure. |
| FINDING-002-B Jina-v3 CC BY-NC default | STRENGTHENED | Apache alternatives falsify "no choices," but the default still binds unaware operators. |
| FINDING-003-A calibration fixture-fit | STRENGTHENED | RRF knife-edge failed, but fixture narrowness and nondiscriminative calibration survived. |
| FINDING-004-A 768d schema lock | STRENGTHENED | Active table remains `embedding float[768]`; reset/reindex is still the opt-in path. |
| FINDING-004-B global daemon embedder | STRENGTHENED | Peer systems make effective model/index status more visible than this daemon. |
| FINDING-005-A search-cost fanout | STRENGTHENED | Path-filtered high-offset repro took `21.59s`; this is no longer theoretical. |
| FINDING-006-A prompt-policy invariant | STRENGTHENED | Query prompt is handled at search time while index embeddings use raw chunk text. |
| FINDING-006-B dedup-before-rerank contract | UNCHANGED | Pass 2 did not find new evidence beyond Pass 1's pipeline-order concern. |
| FINDING-008-A stale CLI/venv drift | STRENGTHENED | Upstream and status drift increase operator confusion, though the original CLI failure was not re-run. |
| FINDING-009-A coverage tooling absent | UNCHANGED | Pass 2 did not re-run coverage; the claim remains as Pass 1 left it. |
| FINDING-010-A schema/external/daemon amplification | STRENGTHENED | Upstream drift and prompt-policy asymmetry amplify the schema/daemon risk. |
| FINDING-010-B fixture/calibration/observability amplification | STRENGTHENED | New probes plus weak telemetry strengthen the compound-risk claim. |

## Pass-1 Attack Scorecard: MEDIUM-OPPORTUNITY
| Pass 1 finding | Outcome | One-line justification |
| --- | --- | --- |
| FINDING-001-B residual miss taxonomy | STRENGTHENED | New probes show misses should be classified by architecture invariant, not only query difficulty. |
| FINDING-002-C sentence-transformers/release drift | STRENGTHENED | Upstream `cocoindex`/`cocoindex-code` drift adds another version-currency axis. |
| FINDING-003-B low-confidence RRF optimum | STRENGTHENED | RRF perturbations flat-lined, so the current value is low-information rather than proven optimal. |
| FINDING-003-C rerank `top_k` sensitivity missing | UNCHANGED | Pass 2 did not run a top-K cutoff sweep. |
| FINDING-004-C env/settings restart gaps | STRENGTHENED | Peer/status comparison reinforces effective-config fingerprinting. |
| FINDING-005-B chunker fuzz/pathology | UNCHANGED | Pass 2 did not add chunking fuzz evidence. |
| FINDING-006-C reranker fallback observability | STRENGTHENED | Observability-before-calibration remains necessary for fallback and candidate diagnosis. |
| FINDING-007-A RRF alternatives untested | STRENGTHENED | Sourcegraph's search-first design widens the counter-design set beyond RRF variants. |
| FINDING-007-B 18-probe `n=1` low confidence | STRENGTHENED | Verdict-flip gates now require repeated runs and expanded fixture thresholds. |
| FINDING-007-C multilingual/code-switched coverage absent | STRENGTHENED | Upstream language support movement argues for fixture expansion beyond current local shapes. |
| FINDING-008-B model-swap/reindex cost | STRENGTHENED | 023A migration was split because existing-index handling and rollback are nontrivial. |
| FINDING-008-C indexing wait opacity | STRENGTHENED | Cursor comparison shows local status is thin for progress and freshness. |
| FINDING-009-B retrieval diagnostics missing | STRENGTHENED | Request-cost repro needs candidate/fanout counters to diagnose. |
| FINDING-009-C missing integration scenarios | STRENGTHENED | Pass 2 added architecture-invariant probes and path-budget scenarios. |
| FINDING-010-C operator trust compound risk | STRENGTHENED | License default, default churn, upstream drift, and long reindex cost compound. |

## NEW HIGH-LATENT-RISK Findings (Pass 2 Only)
| Finding | Claim | Evidence | Packet recommendation |
| --- | --- | --- | --- |
| FINDING-011-B | The system still lacks a dimension-safe migration surface. | Active schema is `embedding float[768]`; `registered_embedders.py:22-27` documents reset/reindex guidance; benchmark rows cite `10-25` minute reindex windows. | 023A1 metadata/fingerprint checks before 023A3 storage. |
| FINDING-012-B | A non-commercial reranker remains the default. | `config.py:22-25` sets `jinaai/jina-reranker-v3`; HF API reports `cc-by-nc-4.0`. | 023D license UX plus commercial-safe profile. |
| FINDING-013-B | Existing indexes lack stored prompt/model/dimension policy fingerprints. | `protocol.py:122-140` exposes status without model or prompt fingerprints; `indexer.py:314-329`; `query.py:710-713`. | 023A1 index metadata and compatibility refusal. |
| FINDING-014-B | Architecture-invariant probes expose fixture blind spots. | Three new probes missed at least one expected local core file in top-5; related code in `shared.py`, `query.py`, and `daemon.py`. | 023B expanded architecture-invariant fixture. |
| FINDING-015-A | Valid path-filtered queries can exceed the 10s budget. | `.venv/bin/ccc search ... --path '*' --limit 100 --offset 20000` took `21.59s` and deduped `56,512` aliases; `query.py:149-185`, `:600-620`, `:727-728`. | 023E request-budget hardening. |
| FINDING-016-B | Model role and transform policy are not explicit enough. | Continue model-role docs; CocoIndex query docs; local `shared.py:35-60`, `indexer.py:314-329`, `query.py:710-713`. | 023A1/023A2 metadata and prompt policy. |
| FINDING-017-A | Local fork is roughly 30 upstream `cocoindex-code` releases behind. | Local `pyproject.toml:9-13`, `:29`; local `NOTICE:1-8`; GitHub API showed upstream `0.2.33` and core `1.0.6`. | 023F upstream rebase/import spike. |
| FINDING-017-B | Upstream embedder indexing/query params may obsolete local prompt-policy design. | GitHub API release `v0.2.29` mentions configurable `indexing_params` and `query_params`. | Inspect/import upstream before building local abstraction. |
| FINDING-018-A | Reranker default churn lacks a durable license-governance ADR. | Git log GTE -> BGE -> Jina in about a day; benchmark report records Jina quality win and CC BY-NC default. | ADR plus 023D license UX. |
| FINDING-019-A | Highest immediate ROI is request-budget clamps, not the highest-severity architecture packet. | Iteration 015 repro and localized validation surface in `query.py`, `server.py`, `cli.py`. | Reorder stack: 023E first. |
| FINDING-020-A | Verdict flips FRAGILE if upstream drift and runtime cost land together. | Iteration 015 timing plus iteration 017 upstream release gap. | Monitor upstream delta and p95/p99 search. |
| FINDING-020-C | Request-cost bug plus weak observability is a compound production risk. | `observability.py:61-85`; `protocol.py:112-140`; valid `21.59s` repro. | Pair 023E with 023C. |

## NEW MEDIUM-OPPORTUNITY Findings (Pass 2 Only)
| Finding | Claim | Evidence | Packet recommendation |
| --- | --- | --- | --- |
| FINDING-011-A | Current registry pressure was overstated. | `6/8` registered embedders are 768d; `2/8` are non-768. | Reword 023A around future-proofing and rollback. |
| FINDING-012-A | The license problem is not lack of alternatives. | BGE, mxbai, Qwen, and GTE reported Apache-2.0 via HF API. | Add license manifest and commercial-safe profile. |
| FINDING-013-A | Prompt-policy guardrails can start with a compact contract test. | Current index path lacks document prompt; proposed deterministic local test. | Add failing contract test before full migration. |
| FINDING-014-A | RRF is flat, not knife-edge, on the current fixture. | BGE rows stayed `12/18`; Jina rows stayed `14/18` across K perturbations. | Stop over-tuning RRF on this fixture. |
| FINDING-015-C | CLI and MCP validation surfaces differ. | MCP caps `limit` at 100; CLI exposes `--limit` and `--offset`; neither caps offset centrally. | Shared `SearchBudget`. |
| FINDING-016-A | Fixed dimensions are normal; weak metadata is the gap. | LlamaIndex/CocoIndex docs and local status fields. | Store and surface index compatibility metadata. |
| FINDING-016-C | Sourcegraph's search-first path is a valid counter-design. | Sourcegraph Cody FAQ. | Include symbol/graph/search-assisted retrieval in 023B. |
| FINDING-016-D | Cursor-like indexing status would improve operator confidence. | Cursor codebase-index docs; local `protocol.py:122-140`. | Extend `ccc status` and daemon status. |
| FINDING-017-C | Upstream removed a dimensions knob; local design should not add a naive one. | GitHub API release `v0.2.30`. | Treat dimensions as provider/model metadata. |
| FINDING-017-D | Upstream language support should inform fixture expansion. | GitHub API release `v0.2.32` added Svelte/Vue. | Add language-shape probes after upstream spike. |
| FINDING-018-B | RRF no-op/latency lock needs ADR criteria. | Git log `ee788254d1`; benchmark prose. | ADR with quality/latency/fixture criteria. |
| FINDING-018-C | Pipeline-before-model invariant should be durable. | Git log Jina-code -> Nomic; benchmark report pipeline arc. | ADR: fix code first, keep losing adapters opt-in. |
| FINDING-019-B | 023A should be phased, not single-packet. | Core files include `daemon.py 1055`, `query.py 854`, `config.py 749`; schema/index migration risk. | Split 023A1/2/3. |
| FINDING-019-C | Observability should precede broad calibration. | Current logs lack fanout/candidate/rerank counters. | Run 023C before 023B. |
| FINDING-020-B | ROBUST requires measurable release gates. | Existing fixture `14/18`, new probes, request-budget evidence. | Define gates for repeated benchmark, p95, license, metadata. |
| FINDING-020-D | Upstream drift plus local metadata design can harden the wrong abstraction. | Upstream `indexing_params/query_params`; local prompt asymmetry. | Insert 023F before 023A heavy work. |

## Pass-2 Failed Hypotheses
- "Most registered embedders are non-768" failed: `6/8` are 768d.
- "Commercial-safe reranking is unavailable" failed: at least four checked alternatives reported Apache-2.0.
- "Prompt-policy risk has no cheap first test" failed: a local metadata contract test can pin the invariant.
- "RRF K=60 is a brittle optimum" failed: hit/miss patterns flat-lined across perturbations.
- "Pure high-offset KNN burns CPU unbounded" failed: sqlite-vec rejected `k=80020` against a `4096` cap in under one second.
- "Fixed dimensions are themselves the peer-system smell" failed: peer systems commonly use dimension-aware indexes.
- "Local fork is current enough" failed: upstream `cocoindex-code` is at `0.2.33`, local fork base is `0.2.3`.
- "Highest severity should ship first" failed: 023E has better immediate ROI than 023A.
- "Verdict should flip ROBUST after falsifications" failed: upstream drift and the `21.59s` repro keep risk alive.
- "Verdict should flip FRAGILE after new risks" failed: current tests and benchmark still support the default under known fixture.

## Quantified-Risk Table
| Surviving risk | Probability under realistic operator load | Blast radius if it lands | Mitigation cost |
| --- | --- | --- | --- |
| Path-filtered query budget breach | Medium: valid inputs can trigger it; repro took `21.59s` on this repo | Medium-high: MCP timeout, slow CLI, poor IDE UX | Low-medium: central budget validator plus tests. |
| CC BY-NC default reranker | Medium for commercial/on-prem users who accept defaults | High governance risk for commercial use | Low-medium: license manifest, warnings, commercial-safe profile. |
| Prompt/index policy mismatch | Medium under model swaps such as EmbeddingGemma/Jina-style policies | High: silent retrieval quality degradation after reindex/search mismatch | Medium: contract test, metadata fields, compatibility refusal. |
| 768d schema lock | Low immediate, medium future: `2/8` registry entries blocked now | Medium-high: reset/reindex, rollback confusion, adapter friction | High if multi-dim storage; medium if metadata-first. |
| Upstream drift | Medium-high: local fork is many releases behind | Medium-high: duplicate local design, missed bug fixes, harder rebase | Medium: spike first; full merge unknown. |
| Fixture narrowness | High: new probes already missed core files | Medium: overconfident defaults and tuning | Medium: expanded fixture plus repeated runs. |
| Weak retrieval observability | High: current counters are sparse | Medium: failures become hard to diagnose | Medium: protocol/status/log additions. |

## Migration Cost Matrix
| Packet | Code touch | Test touch | Migration risk | Rollback | Operator disruption | Highest ROI? |
| --- | --- | --- | --- | --- | --- | --- |
| 023A dimension/prompt/index metadata | High: schema, indexer, query, daemon, protocol, config, docs | High | High | Needs compatibility read/refusal and reset path | Medium-high | No; split first. |
| 023B fixture/calibration | Medium: bench harness/fixtures | Medium-high | Low-medium | Revert fixture/default choice | Low unless defaults change | Not before telemetry. |
| 023C retrieval observability | Medium | Medium | Low | Hide/disable counters | Low | High. |
| 023D doctor/model-swap UX | Medium | Medium | Low-medium | Warnings can relax | Low-medium | Medium. |
| 023E request-budget hardening | Low-medium | Low-medium | Low | Config defaults/escape hatch | Low | Yes: first. |
| 023F upstream rebase/import spike | Low-medium spike; unknown full merge | Medium | Medium | Keep fork branch/cherry-pick only | Low if spike-only | Yes: before 023A heavy design. |

## Verdict-Flip Scenarios
**Flip to FRAGILE** if upstream rebase reveals missed correctness/security fixes, default path-filtered queries exceed budget under normal IDE/MCP use, commercial operators hit Jina's CC BY-NC default without warning, or expanded architecture-invariant fixture drops materially below the current `14/18` floor.

**Flip to ROBUST** only if repeated benchmark runs keep at least the current quality floor, the expanded fixture meets an agreed threshold, p95 search stays under `10s` for bounded valid inputs, model/license/index metadata are visible in status/doctor output, and reranker fallback/candidate/fanout counters are observable.

## Combined Priority-Ordered Packet Stack
1. **023E request-budget hardening**: central `SearchBudget`, offset/path/language caps, KNN friendly validation, path-fullscan refusal unless forced.
2. **023C retrieval observability**: candidate counters, fanout counters, boost flips, rerank input/output, fallback counters, model/index fingerprints.
3. **023F upstream rebase/import spike**: inspect/import upstream `indexing_params/query_params`, language support, and stable core changes.
4. **023A1 metadata/fingerprint compatibility**: store and compare model, dimension, prompt policy, license class, chunking policy, and corpus settings.
5. **023A2 prompt/license registry fields**: make `embed_document`, `embed_query`, `rerank`, and license explicit.
6. **023A3 optional multi-dimension storage**: only after metadata and upstream import settle the shape.
7. **023B fixture expansion + calibration**: architecture-invariant probes, residual miss taxonomy, repeated runs, top-K/fusion/boost sweeps.
8. **023D doctor/model-swap UX**: stale CLI detection, dependency checks, model license warnings, reindex cost estimate, rollback guidance.

STATUS=CONTINGENT
