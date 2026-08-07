# Iteration 004 — self-improving memory / outcome propagation loop

**Status:** insight · **Findings:** 5 · **newInfoRatio:** 0.86 · **tokens:** 147463 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Mechanism

MemClaw’s self-improving loop is two related loops, not one monolith:

1. **Outcome capture via `memclaw_evolve`.** Agents report what happened after acting on recalled memories: `outcome`, `outcome_type`, and `related_ids` from recent recall results. The REST request schema makes `related_ids` explicitly “Memory UUIDs that influenced your action” and scopes evolution to `agent`, `fleet`, or `all` with trust requirements. Evidence: `core-api/src/core_api/routes/evolve.py:26-60`, `core-api/src/core_api/routes/evolve.py:90-105`, `core-api/src/core_api/tools/memclaw_evolve.py:17-22`.

2. **Scope/trust gating before mutation.** `scope='agent'` can only touch caller-owned memories; `scope='fleet'` requires `fleet_id`; `scope='all'` is tenant-wide. Out-of-scope IDs are dropped before rule generation so the LLM never sees unauthorized memory content. Evidence: `core-api/src/core_api/services/evolve_service.py:185-207`, `core-api/src/core_api/services/evolve_service.py:247-285`, `core-api/src/core_api/services/evolve_service.py:739-777`.

3. **Weight reinforcement/dampening.** Related memories get clamped weight deltas: success `+0.1`, failure `-0.15`, partial `+0.03`, with floor `0.05` and cap `1.0`. Evidence: `core-api/src/core_api/constants.py:494-503`, `core-api/src/core_api/services/evolve_service.py:147-165`, `core-api/src/core_api/services/evolve_service.py:288-323`, `core-api/src/core_api/services/evolve_service.py:886-903`.

4. **Failure/partial rule derivation.** Failure and partial outcomes trigger LLM rule synthesis from the outcome plus related memory context. Success does not generate rules. Generated rules are persisted only if confidence meets threshold `0.5`; otherwise a structured skip reason is returned/logged. Evidence: `core-api/src/core_api/services/evolve_service.py:120-141`, `core-api/src/core_api/services/evolve_service.py:431-545`, `core-api/src/core_api/services/evolve_service.py:816-857`, `core-api/src/core_api/services/evolve_service.py:904-923`.

5. **Outcome/rule storage.** The outcome is persisted as `memory_type='outcome'` with metadata linking related memories, actual weight adjustments, generated rule ID, and scope. Generated rules are persisted as `memory_type='rule'`, weighted by confidence, with `generated_by='evolve'` and `source_outcome_id` backfilled after outcome creation. Evidence: `core-api/src/core_api/services/evolve_service.py:551-612`, `core-api/src/core_api/services/evolve_service.py:615-677`, `core-api/src/core_api/services/evolve_service.py:924-959`.

6. **Insight derivation via `memclaw_insights`.** A separate reflection step analyzes memory subsets for `contradictions`, `failures`, `stale`, `divergence`, `patterns`, or `discover`; findings persist as `insight` memories. Evidence: `core-api/src/core_api/services/insights_service.py:1-6`, `core-api/src/core_api/constants.py:481-486`, `core-api/src/core_api/tools/memclaw_insights.py:16-20`.

7. **Insight query modes.** Failure analysis targets low-weight recalled memories; stale analysis targets old/unrecalled or low-weight memories; divergence explicitly requires multiple agents; discover clusters embedding space and reports cluster stats including weight variance and agent count. Evidence: `core-api/src/core_api/services/insights_service.py:79-109`, `core-api/src/core_api/services/insights_service.py:369-385`, `core-api/src/core_api/services/insights_service.py:388-416`, `core-api/src/core_api/services/insights_service.py:421-454`, `core-api/src/core_api/services/insights_service.py:510-585`.

8. **Insight gating.** Insight generation excludes prior `insight` memories from source queries to avoid insight-on-insight feedback loops; hallucinated `related_memory_ids` are dropped unless they were actually shown to the LLM; prior active insights for the same focus/scope/fleet are moved to `outdated` before new ones persist, and restored if all new persists fail. Evidence: `core-api/src/core_api/services/insights_service.py:283-320`, `core-api/src/core_api/services/insights_service.py:926-1008`, `core-api/src/core_api/services/insights_service.py:706-780`, `core-api/src/core_api/services/insights_service.py:893-913`.

9. **System-authored feedback types are protected.** `outcome`, `rule`, and `insight` are server-reserved memory types. Agents cannot write them directly through public REST/MCP write paths, preventing forged learning signals. Evidence: `common/enrichment/constants.py:70-91`, `common/enrichment/constants.py:97-110`, `core-api/src/core_api/routes/memories.py:101-131`, `core-api/src/core_api/mcp_server.py:281-310`.

10. **Feedback affects recall.** Search scoring blends semantic/keyword similarity with `Memory.weight`, then multiplies by freshness, recall boost, temporal/date/currency factors, status penalty, and optional entity boost; results are ordered by score. Therefore `evolve` weight updates directly affect future ranking. Evidence: `core-storage-api/src/core_storage_api/services/postgres_service.py:919-975`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1042-1069`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1188-1207`.

11. **Feedback affects retention indirectly.** Stale archival targets old active memories with zero recalls and `weight < 0.3`; failure outcomes reduce weight, so repeated failed use can push memories toward archival eligibility, but archival still requires age and zero recall. Evidence: `common/constants.py:381-388`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1606-1644`.

12. **Periodic insights are opt-in and activity-gated.** The scheduler triggers insights daily, but the consumer only runs when `auto_insights_enabled` is true and non-insight memories have been created since the latest insight. Evidence: `core-operations/src/core_operations/tasks.py:104-113`, `core-api/src/core_api/services/organization_settings.py:93-104`, `core-api/src/core_api/services/organization_settings.py:554-560`, `core-api/src/core_api/services/lifecycle_audit.py:97-161`.

Inherently cross-agent parts: fleet/all scopes, cross-agent divergence, trust tiers, fleet-wide visibility, and the advertised “agent #17 prevents agents #1-#40 repeating it” propagation are fleet mechanics. Evidence: `README.md:30-36`, `docs/performance.md:35-43`, `docs/performance.md:52-57`, `core-api/src/core_api/services/insights_service.py:142-171`, `core-api/src/core_api/routes/insights.py:57-63`.

Implementation caveat: the REST `evolve` path passes `weight_adjustment_skipped_reason` into `_apply_outcome_to_db`, but the MCP handler call shown omits that required keyword while the service signature requires it. Evidence: `core-api/src/core_api/services/evolve_service.py:860-875`, `core-api/src/core_api/routes/evolve.py:175-184`, `core-api/src/core_api/mcp_server.py:2055-2070`.

## Teachings for Spec Kit Memory (027/008)

1. **Claim** · Outcome feedback can transfer to a single-agent local store if treated as attribution-weighted ranking/retention evidence, not fleet propagation.
   **Evidence** · `memclaw_evolve` records outcome type plus related memory IDs, adjusts weights, persists an outcome memory, and search directly uses `Memory.weight` in ranking. `core-api/src/core_api/routes/evolve.py:26-60`, `core-api/src/core_api/services/evolve_service.py:551-612`, `core-storage-api/src/core_storage_api/services/postgres_service.py:973-975`.
   **Maps-to** · 027/008.
   **Verdict** · ADAPT.
   **Risk** · Bad attribution can punish the wrong memory; false successes can create self-reinforcing ranking.
   **Confidence** · 0.88.
   **Why it transfers (or not)** · The cross-agent broadcast does not transfer, but “my own outcome changes my own future recall” is a direct single-agent analog.

2. **Claim** · Failure-to-rule synthesis should be shadow-first in Spec Kit, not immediately authoritative.
   **Evidence** · MemClaw only attempts rule synthesis for failure/partial outcomes and persists only above confidence threshold; generated rules then become normal searchable memories. `core-api/src/core_api/services/evolve_service.py:837-857`, `core-api/src/core_api/services/evolve_service.py:904-923`, `core-api/src/core_api/services/evolve_service.py:647-664`.
   **Maps-to** · 027/008.
   **Verdict** · ADAPT.
   **Risk** · LLM overgeneralization can turn one local failure into a bad durable rule.
   **Confidence** · 0.80.
   **Why it transfers (or not)** · Single-agent negative knowledge is valuable, but without fleet corroboration it needs probation, decay, or validation before changing hard retrieval/retention.

3. **Claim** · Reserve system-generated feedback artifact types separately from user-authored memories.
   **Evidence** · MemClaw blocks agent-authored `outcome`, `rule`, and `insight` rows at REST/MCP boundaries because forged rows would pollute insights/RL signals. `common/enrichment/constants.py:97-110`, `core-api/src/core_api/routes/memories.py:101-131`, `core-api/src/core_api/mcp_server.py:281-310`.
   **Maps-to** · 027/008.
   **Verdict** · ADOPT.
   **Risk** · More schema/status complexity.
   **Confidence** · 0.92.
   **Why it transfers (or not)** · Spec Kit’s 027/008 reducers need trustworthy feedback provenance even with one user; separating human notes from reducer-emitted learning records prevents feedback poisoning.

4. **Claim** · Insight derivation should be batched, bounded, and hallucination-gated.
   **Evidence** · MemClaw analyzes capped subsets by focus, excludes insights from source queries, filters hallucinated related IDs, and supersedes prior insights only when replacements exist. `core-api/src/core_api/constants.py:481-486`, `core-api/src/core_api/services/insights_service.py:283-320`, `core-api/src/core_api/services/insights_service.py:926-1008`, `core-api/src/core_api/services/insights_service.py:748-780`.
   **Maps-to** · 027/008.
   **Verdict** · ADAPT.
   **Risk** · A local single-user corpus may be too small for reliable pattern mining; LLM insight cost/noise can exceed value.
   **Confidence** · 0.84.
   **Why it transfers (or not)** · The corpus-analysis mechanism transfers; cross-agent divergence mode mostly does not.

5. **Claim** · Do not import MemClaw’s fleet trust/scoping model into Spec Kit as-is.
   **Evidence** · MemClaw’s differentiation is explicitly multi-tenant/multi-agent fleet memory, per-agent trust tiers, scoped memory, and cross-agent outcome propagation. `README.md:30-36`, `README.md:251-256`, `docs/performance.md:35-43`, `docs/performance.md:52-57`.
   **Maps-to** · new sub-packet only if Spec Kit later supports multi-user/multi-agent sharing.
   **Verdict** · REJECT.
   **Risk** · Over-engineering a local single-user system with tenancy concepts it does not need.
   **Confidence** · 0.95.
   **Why it transfers (or not)** · The governance/propgation layer exists to prevent or enable cross-agent/cross-fleet effects; Spec Kit has no fleet to propagate across.

## Negative knowledge

MemClaw’s strongest marketed value is cross-agent/fleet compounding, not single-agent memory quality. The README says it is “built for fleets, not single agents” and designed for “dozens or thousands of agents” sharing what they learn. Evidence: `README.md:30-36`.

The benchmark framing is explicitly about things single-agent benchmarks cannot measure: agent #17’s mistake preventing agents #1-#40 from repeating it, new agents inheriting fleet knowledge, fleet-scoped visibility, and cross-tenant leakage prevention. Evidence: `docs/performance.md:35-43`.

Per-agent trust tiers and scope escalation are fleet governance. `scope='agent'` requires lower trust; `scope='fleet'`/`all` requires higher trust and broader visibility. This has little single-user analog beyond basic provenance and permission hygiene. Evidence: `core-api/src/core_api/routes/evolve.py:41-60`, `core-api/src/core_api/routes/evolve.py:138-164`, `core-api/src/core_api/routes/insights.py:83-84`.

Cross-agent divergence analysis is inherently non-local: the prompt asks for different agents describing the same entities, and the route rejects `focus='divergence'` with `scope='agent'`. Evidence: `core-api/src/core_api/services/insights_service.py:142-171`, `core-api/src/core_api/services/insights_service.py:421-454`, `core-api/src/core_api/routes/insights.py:57-63`.

Cross-fleet visibility and tenant-wide propagation are deployment-safety machinery, not a memory-quality primitive for Spec Kit’s local store. Evidence: `README.md:251-256`, `core-storage-api/src/core_storage_api/services/postgres_service.py:1100-1140`.

## Open questions

1. Verify whether the MCP `memclaw_evolve` handler is actually broken by the missing `weight_adjustment_skipped_reason` argument, or whether another vendored patch/wrapper fills it. Evidence needing follow-up: `core-api/src/core_api/services/evolve_service.py:860-875`, `core-api/src/core_api/mcp_server.py:2055-2070`.

2. Determine whether Spec Kit 027/008 already has a durable outcome event table equivalent to MemClaw’s `outcome` memory metadata, or whether outcomes are only implicit telemetry.

3. Decide whether Spec Kit should let generated “rules” enter normal recall immediately, or keep them in a shadow/probation tier until repeated validation.

4. Test whether single-agent insight mining has enough signal without cross-agent divergence; likely useful modes are failures, stale, and patterns, not divergence.

5. Compare MemClaw’s direct weight mutation with Spec Kit’s FSRS decay and importance tiers: should feedback alter tier, decay schedule, retrieval score, retention eligibility, or all four?

6. Examine whether outcome-derived retention pressure should be symmetric. MemClaw makes failures lower weight faster than successes raise it, but Spec Kit may need softer damping to avoid losing rare-but-correct memories.

DELTA_JSON: {"iteration":"004","focus":"self-improving memory / outcome propagation loop","findingsCount":5,"newInfoRatio":0.86,"topVerdicts":["ADAPT: outcome feedback can improve single-agent future recall when scoped to attribution-weighted ranking/retention, not fleet propagation","REJECT: fleet trust/scoping and cross-agent propagation machinery should not be imported into local single-user Spec Kit"],"sources":["README.md:265","docs/performance.md:42","core-api/src/core_api/services/evolve_service.py:683","core-api/src/core_api/services/insights_service.py:1011","core-storage-api/src/core_storage_api/services/postgres_service.py:973"]}
