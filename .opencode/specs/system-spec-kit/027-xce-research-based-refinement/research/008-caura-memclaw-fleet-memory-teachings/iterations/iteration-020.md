# Iteration 020 — ADVERSARIAL refute MCP/perf/eval + final negative-knowledge ledger

**Status:** insight · **Findings:** 12 · **newInfoRatio:** 0.72 · **tokens:** 139024 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Citation verification
C1: VERIFIED. `docs/api-surfaces.md` is an explicit surface-ownership charter, and MemClaw does use op-dispatched MCP tools such as `memclaw_manage` and `memclaw_doc`. Evidence: `docs/api-surfaces.md:1`, `docs/api-surfaces.md:43`, `core-api/src/core_api/mcp_server.py:735`, `core-api/src/core_api/mcp_server.py:1169`.

C2: MISATTRIBUTED. MemClaw documents token efficiency and has optional `include_brief` summarization, but I did not find the cited “slice-first with citations + explicit expansion” mechanism. Recall returns full `results` plus optional `brief`, and the summary prompt intentionally omits invented IDs rather than providing citations. Evidence: `docs/performance.md:23`, `docs/performance.md:29`, `core-api/src/core_api/mcp_server.py:452`, `core-api/src/core_api/services/recall_service.py:44`.

C3: VERIFIED, with caveat. The cited scoring block has soft freshness, date-range, currency, recall boost, and status penalty factors. However, default search still hard-excludes `outdated` and `conflicted` unless `status_filter` is provided. Evidence: `core-storage-api/src/core_storage_api/services/postgres_service.py:938`, `core-storage-api/src/core_storage_api/services/postgres_service.py:954`, `core-storage-api/src/core_storage_api/services/postgres_service.py:986`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1017`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1022`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1148`, `common/constants.py:37`.

C4: MISATTRIBUTED. `docs/performance.md` supports public benchmark LLM-judge accuracy, token efficiency ratio, and benchmark limitation notes, but not end-task developer-memory evaluation or dashboard implementation. Evidence: `docs/performance.md:7`, `docs/performance.md:27`, `docs/performance.md:33`.

## Refutation analysis
C1: Strongest argument against adoption is LLM discoverability. MemClaw exposes 12 MCP tools and uses op-dispatch selectively; Spec Kit has a 37-tool surface with semantic tool names, layer tags, and per-tool token budgets. Collapsing many precise tools into generic `op` routers would make tool selection harder for LLMs, hide parameter contracts, and trade discoverability for governance neatness. A lightweight ownership note may help, but full charter bureaucracy and consolidation are not proportionate for a single-user internal SQLite toolset.

C2: Strongest argument against adoption is redundancy. Spec Kit already enforces retrieval token budgets, supports `profile` output modes, anchors, inline content selection, cursor continuation, quick search, and tiered trigger injection. MemClaw’s `include_brief` is an optional LLM summary over full results, not a citation-first progressive disclosure model. The only useful residue is a reminder to keep “summary first, expand on demand” enabled where it already exists.

C3: Strongest argument against adoption is duplicate scoring machinery. Spec Kit already has FSRS decay, classification-based decay, session boost, causal boost, co-activation, HOT/WARM/COLD tiers, and min-state filtering. MemClaw’s soft factors are real, but copying them directly risks double-decay and opaque scoring. Also, MemClaw itself still hard-excludes some stale statuses by default, so “soft over hard” is not consistently proven.

C4: Strongest argument against adoption is cost and weak fit. MemClaw’s cited doc is aspirational/product benchmarking, not an implementation plan for developer-memory task evals. Spec Kit already has `eval_run_ablation`, `eval_reporting_dashboard`, Recall@20 deltas, channel metrics, and dashboard trend aggregation. Adding end-task LLM judges would add expense and evaluator variance before proving it catches failures the existing eval stack misses.

## Verdict adjustments
| Claim | Prior verdict | NEW verdict | Reason |
|---|---|---|---|
| C1 surface charter + 37-tool op-dispatch consolidation | Adopt proposed from 091 | DOWNGRADE | Keep only a lightweight ownership map; reject broad op-dispatch consolidation because it harms MCP discoverability and MemClaw only proves this on a 12-tool surface. |
| C2 slice-first / summary-first recall with citations + expansion | Adopt proposed from 090 | DOWNGRADE | Token-efficiency principle survives, but cited MemClaw evidence does not prove citation-first expansion and Spec Kit already has profiles, budgets, anchors, continuation, and tiered injection. |
| C3 soft stale/currency/status penalties + activation multiplier | Adopt proposed from 089 | DOWNGRADE | Scoring evidence is real, but partly inconsistent due default hard status exclusion and mostly redundant with Spec Kit FSRS/classification/co-activation scoring. |
| C4 end-task LLM-judge eval + token-efficiency dashboard notes | Adopt proposed from 092 | REFUTED | Citation is mostly benchmark narrative, not actionable developer-memory eval; Spec Kit already has ablation and dashboard tooling. |

## Final negative-knowledge ledger
- Multi-tenant scoping: do NOT port tenant isolation, cross-tenant readable sets, or RLS-style boundaries into a local single-user store. Evidence: `README.md:253`.

- Fleet trust tiers: do NOT port trust-level ladders for cross-fleet read/write/delete into a single-user memory database. Evidence: `README.md:255`.

- Cross-agent propagation and divergence workflows: do NOT port fleet outcome propagation, divergence analysis, or “agents learn from each other” governance loops unless multiple independent agents with conflicting scopes actually exist. Evidence: `README.md:36`.

- PII quarantine as fleet-boundary control: do NOT port quarantine-before-cross-fleet machinery; keep only simple local privacy flags if needed. Evidence: `README.md:253`.

- pgvector/Postgres-specific machinery: do NOT port pgvector, Postgres schema migration, RLS, or vector-operator scoring assumptions into SQLite unless sqlite-vec cannot satisfy a measured need. Evidence: `CONTRIBUTING.md:21`.

- Distributed workers/brokers: do NOT port Pub/Sub worker consumers, DLQs, or event-driven embedding/enrichment flows for a local synchronous tool unless background backlog becomes a measured bottleneck. Evidence: `core-worker/src/core_worker/consumer.py:1`.

- Warm-cache/rate-limit/bulkhead infra: do NOT port production warm-cache assumptions, per-tenant bulkheads, or SlowAPI-style rate limiting into a single-user local MCP unless concurrency failures are measured. Evidence: `core-api/src/core_api/services/memory_service.py:856`.

- Public-SemVer external-API governance: do NOT port release-please, public stable API tables, and SemVer governance to an internal single-user MCP surface beyond simple compatibility notes. Evidence: `README.md:812`.

## Surviving teachings
- Keep a small tool-ownership map, but do not consolidate Spec Kit’s tools behind broad `op` routers.

- Preserve summary-first/profiled responses and explicit expansion where Spec Kit already implements them.

- Consider one narrow audit for stale/status behavior to ensure Spec Kit is not hard-excluding useful deprecated-but-relevant evidence unexpectedly.

- Keep benchmark limitation notes in eval docs, but do not add LLM-judge end-task evaluation until existing ablation/dashboard metrics identify a real blind spot.

DELTA_JSON: {"iteration":"020","focus":"ADVERSARIAL refute MCP/perf/eval + final negative-knowledge ledger","findingsCount":12,"newInfoRatio":0.72,"topVerdicts":["DOWNGRADE: C1 keep lightweight ownership map, reject 37-tool op-dispatch consolidation","REFUTED: C4 end-task LLM-judge eval is aspirational/redundant with existing Spec Kit eval tools"],"sources":["docs/api-surfaces.md:1","core-api/src/core_api/mcp_server.py:735","docs/performance.md:29","core-storage-api/src/core_storage_api/services/postgres_service.py:1017","README.md:253","README.md:812"]}
