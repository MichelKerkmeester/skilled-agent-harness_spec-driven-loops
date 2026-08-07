# Iteration 014 — DEEP self-improving loop -> 027/008 shadow-first reducer design

**Status:** insight · **Findings:** 15 · **newInfoRatio:** 0.74 · **tokens:** 87222 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Verified mechanism (deep)
084 is mostly confirmed, with one important correction: MemClaw has an explicit outcome-event record, but the outcome/rule memory writes and local weight/backfill commit are split, so outcome metadata can outlive a failed weight commit.

Evolve internals:
- The outcome feedback API is explicit, not implicit telemetry: `/evolve/report` accepts `outcome`, `outcome_type`, `related_ids`, `scope`, `agent_id`, and `fleet_id` (`core-api/src/core_api/routes/evolve.py:26-60`), validates `success|failure|partial` before invoking `report_outcome` (`core-api/src/core_api/routes/evolve.py:116-184`).
- Scope and trust are enforced before mutation: `agent` requires trust >=1, `fleet/all` require trust >=2, and unregistered non-admin agents are blocked (`core-api/src/core_api/routes/evolve.py:104-163`).
- Related memories are filtered by scope before any LLM sees them (`core-api/src/core_api/services/evolve_service.py:739-762`), and invalid/out-of-scope IDs are dropped (`core-api/src/core_api/services/evolve_service.py:241-285`).
- Weight deltas are exactly as 084 stated: success `+0.1`, failure `-0.15`, partial `+0.03`, floor `0.05`, cap `1.0`, threshold `0.5` (`core-api/src/core_api/constants.py:494-500`).
- Weight mutation is a single bulk SQL update using `GREATEST(:floor, LEAST(:cap, weight + :delta))`, returning old/new weights (`core-api/src/core_api/services/evolve_service.py:147-165`).
- The update runs inside one nested transaction/savepoint and fails as a batch, not per row (`core-api/src/core_api/services/evolve_service.py:358-380`).
- The outcome memory records only processed IDs and actual returned weight adjustments, not the caller’s raw related IDs (`core-api/src/core_api/services/evolve_service.py:551-600`, `core-api/src/core_api/services/evolve_service.py:924-937`).
- Correction to “transaction”: local weight updates and rule backfill commit together, but rule/outcome memories are storage-API writes that are not rolled back if the local commit fails (`core-api/src/core_api/services/evolve_service.py:881-884`, `core-api/src/core_api/services/evolve_service.py:961-978`).

Rule synthesis:
- Rule synthesis only runs for failure/partial outcomes with related IDs (`core-api/src/core_api/services/evolve_service.py:816-857`).
- Related memories are fetched, sanitized, capped, and included in the prompt (`core-api/src/core_api/services/evolve_service.py:468-508`).
- LLM confidence is coerced into `[0,1]` (`core-api/src/core_api/services/evolve_service.py:529-543`).
- Rules below `EVOLVE_RULE_CONFIDENCE_THRESHOLD = 0.5` are skipped; otherwise `_persist_rule` writes an active `memory_type="rule"` memory weighted by confidence (`core-api/src/core_api/services/evolve_service.py:904-923`, `core-api/src/core_api/services/evolve_service.py:615-665`).
- Generated rules enter recall immediately as ordinary memories unless downstream search filters them; there is no shadow/probation state in MemClaw.

Outcome/rule/insight data model:
- Outcome memories are `memory_type="outcome"`, weighted by outcome type, with metadata containing `outcome_type`, `related_memory_ids`, `weight_adjustments`, `rule_memory_id`, and `scope` (`core-api/src/core_api/services/evolve_service.py:577-599`).
- Rule memories are `memory_type="rule"`, weight equals generated confidence, and metadata includes condition/action/confidence/reasoning/source/generated_by/scope (`core-api/src/core_api/services/evolve_service.py:638-665`).
- `outcome`, `rule`, and `insight` are valid storage-layer types but server-reserved at write boundaries (`common/enrichment/constants.py:97-110`).
- REST and MCP write paths refuse agent-supplied reserved types to prevent forged system feedback (`core-api/src/core_api/routes/memories.py:105-130`, `core-api/src/core_api/mcp_server.py:281-310`).
- `common/models/analysis_report.py` is not the outcome-feedback model; it defines `CrystallizationReport` for `analysis_reports` only (`common/models/analysis_report.py:11-40`).

Insights internals:
- Query modes exclude prior insights from the source corpus, avoiding insight-on-insight feedback loops (`core-api/src/core_api/services/insights_service.py:287-299`, `core-api/src/core_api/services/insights_service.py:369-385`, `core-api/src/core_api/services/insights_service.py:388-416`, `core-api/src/core_api/services/insights_service.py:419-454`, `core-api/src/core_api/services/insights_service.py:457-471`, `core-api/src/core_api/services/insights_service.py:510-525`).
- Failure mining targets active memories with `weight < 0.3` and `recall_count > 0` (`core-api/src/core_api/services/insights_service.py:369-385`).
- Stale mining targets active memories with no recalls after 30 days, or low weight plus no/old recalls (`core-api/src/core_api/services/insights_service.py:388-416`).
- Divergence requires multiple agents sharing an entity (`core-api/src/core_api/services/insights_service.py:419-454`) and is rejected for `scope="agent"` (`core-api/src/core_api/routes/insights.py:57-63`, `core-api/src/core_api/services/insights_service.py:1057-1061`).
- Prompt formatting returns `shown_ids`, and LLM-emitted `related_memory_ids` are kept only if actually shown; hallucinated IDs are dropped and logged (`core-api/src/core_api/services/insights_service.py:610-638`, `core-api/src/core_api/services/insights_service.py:641-663`, `core-api/src/core_api/services/insights_service.py:979-1003`).
- Supersession is active: previous active insights for the same focus/scope/agent/fleet are marked `outdated` before new findings are created, with restore if all new persists fail (`core-api/src/core_api/services/insights_service.py:706-773`, `core-api/src/core_api/services/insights_service.py:893-913`).
- Scheduled discovery insights are opt-in and activity-gated, not intrinsic to `generate_insights`: daily scheduling exists (`core-operations/src/core_operations/app.py:86-90`), settings describe `auto_insights_enabled` and the activity gate (`core-api/src/core_api/services/organization_settings.py:93-103`), and lifecycle skips when no non-insight memory is newer than the latest insight (`core-api/src/core_api/services/lifecycle_audit.py:129-152`).

Feedback to ranking/retention:
- Search blends semantic/FTS similarity first, then blends `Memory.weight` into `base_score`: `SIMILARITY_BLEND = 0.85`, so weight contributes the remaining 15% before multipliers (`core-api/src/core_api/constants.py:468-475`, `core-storage-api/src/core_storage_api/services/postgres_service.py:919-975`).
- Final score multiplies base score by freshness, recall boost, temporal/date/currency/status factors (`core-storage-api/src/core_storage_api/services/postgres_service.py:1017-1069`).
- Recall is implicit telemetry: search results trigger recall tracking (`core-api/src/core_api/services/memory_service.py:3222-3229`), the hook increments `recall_count` and `last_recalled_at` (`core-api/src/core_api/repositories/memory_repository.py:1008-1018`), and recall count feeds ranking boost (`core-storage-api/src/core_storage_api/services/postgres_service.py:954-969`).
- Retention uses weight directly: stale archival marks active memories archived when older than `stale_days`, `recall_count = 0`, and `weight < max_weight` (`core-storage-api/src/core_storage_api/services/postgres_service.py:1606-1644`), with the shared stale archive threshold `0.3` (`common/constants.py:384-388`).
- Type decay is separate from evolve weight, with `outcome` at 90 days and other types having fixed windows (`common/constants.py:41-53`).

## Concrete Spec-Kit-native adoption sketch (027/008)
Use MemClaw’s loop shape, but do not copy its direct active mutation. For Spec Kit Memory’s local SQLite + vector store, 027/008 should be a shadow-first reducer with explicit outcome events, a shadow signal ledger, and small promoted effects.

Outcome-event record:
- Table: `memory_feedback_events`.
- Shape: `id`, `created_at`, `memory_id`, `memory_ids_json`, `event_type`, `outcome`, `outcome_confidence`, `evidence_source`, `query_hash`, `task_context_hash`, `spec_folder`, `retrieval_rank`, `retrieval_score`, `fsrs_state_snapshot_json`, `importance_tier_snapshot`, `constitutional_protected`, `notes`, `metadata_json`.
- Event types: `retrieval_used`, `outcome_success`, `outcome_failure`, `outcome_partial`, `explicit_correction`, `stale_suspect`, `pattern_signal`, `rule_candidate`.
- Rationale: MemClaw’s outcome memory is valuable because it is durable (`core-api/src/core_api/services/evolve_service.py:584-599`), but Spec Kit should avoid its split-commit ambiguity by writing the event and shadow ledger in the same SQLite transaction.

Shadow ledger:
- Table: `memory_shadow_signals`.
- Shape: `id`, `memory_id`, `signal_kind`, `target`, `raw_delta`, `effective_delta`, `confidence`, `positive_count`, `negative_count`, `neutral_count`, `distinct_context_count`, `last_event_id`, `status`, `created_at`, `updated_at`, `promoted_at`, `expires_at`, `reason_json`.
- Status values: `shadow`, `probation`, `active`, `rejected`, `expired`.
- Targets: `retrieval_score_modifier`, `retention_hold`, `fsrs_decay_modifier`, `rule_candidate_visibility`.
- Avoid targets at first: direct `importance_tier` mutation and direct permanent FSRS schedule rewrite.

Promotion gate:
- Promote a shadow signal to probation only when one of these holds: two independent outcome events in different task contexts agree; one explicit user correction agrees with a retrieval/outcome event; stale/pattern mining repeats across two scheduled passes; or a deterministic validator confirms the outcome.
- Promote probation to active only after no contradictory event appears during a short observation window.
- Never promote LLM-generated rules straight into recall. A rule candidate stays shadow/probation until supported by a later successful use or explicit confirmation.
- Demote or expire signals with time decay so one bad episode does not permanently poison a rare memory.

Mutation targets:
- Retrieval score: first active target. Apply a small bounded multiplier or additive modifier after vector/keyword scoring, not by overwriting the memory’s canonical importance. Example: active positive `+0.03`, active negative `-0.03`, cap absolute active modifier at `0.10`.
- Retention eligibility: use active negative signals only as one input. Do not archive a memory solely because of shadow feedback. Add `retention_hold` for rare-but-correct candidates with high tier, constitutional protection, explicit user confirmation, or positive historical outcomes.
- FSRS decay: adjust only after promoted active evidence, and only through a bounded decay modifier. Example: reliable memory may decay 10% slower; repeatedly stale/failed memory may decay 10% faster. Keep FSRS state recoverable from event history.
- Importance tier: do not auto-demote from outcome failure. Auto-promotion can be allowed only for repeated explicit confirmations or constitutional/system-level evidence. Constitutional/protected memories are immutable to feedback demotion and archival reducers.

Symmetric/soft damping:
- Replace MemClaw’s asymmetric `+0.1/-0.15` with symmetric evidence accumulation, e.g. `+1/-1` event counts or log-odds deltas of equal magnitude.
- Convert ledger confidence to a small active effect only after promotion.
- Use stronger protection against false negatives than against false positives: negative signals need repeated evidence; positive confirmations can create retention holds.
- Rare-but-correct guard: if a memory has low recall but high tier, user confirmation, constitutional protection, or sparse-domain marking, negative feedback cannot push it below retention eligibility without explicit correction.
- Keep recovery possible: later successes reduce or neutralize prior negative active modifiers instead of fighting an already-demoted canonical weight.

Mode adoption:
- Adapt failures: yes, but shadow first.
- Adapt stale: yes, but as review/retention signal, not immediate archival.
- Adapt patterns: yes, for surfacing candidate reducers and gaps.
- Adapt contradictions: yes if Spec Kit already has supersession/conflict metadata.
- Defer divergence: no single-agent analog.
- Defer fleet/trust/scoped visibility: no local single-user analog.

## Verdict table
| Claim | Maps-to (027/008 or new) | Verdict | Risk | Confidence |
|---|---|---|---|---|
| Explicit outcome event is better than implicit telemetry alone. | 027/008 outcome-event reducer | ADAPT | Event schema must not become a second undocumented memory store. | High |
| MemClaw outcome record is durable but split from final weight commit. | 027/008 transaction design | ADAPT WITH CHANGE | Avoid outcome metadata claiming weight updates that failed to commit. | High |
| Direct weight deltas close the feedback loop quickly. | 027/008 shadow ledger | ADAPT CONCEPT, NOT MECHANIC | Direct mutation is too aggressive for small local corpora. | High |
| Generated rules should be active if LLM confidence >=0.5. | 027/008 rule candidate reducer | DEFER ACTIVE RECALL | Confidence-only gates invite hallucinated operational rules. | High |
| Generated rules should be shadow/probation first. | 027/008 promotion gate | ADAPT | Requires UI/reporting so shadow rules are inspectable. | High |
| Failure mining has single-agent value. | 027/008 insight reducer | ADAPT | Low-weight recalled memories may be rare-but-correct, not bad. | High |
| Stale mining has single-agent value. | 027/008 retention reducer | ADAPT | No-recall is weak evidence in small corpora. | High |
| Pattern mining has single-agent value. | 027/008 pattern reducer | ADAPT | Needs minimum corpus threshold to avoid overfitting. | Medium |
| Divergence mining has single-agent value. | New only if multi-agent/local profiles emerge | DEFER | MemClaw explicitly requires multiple agents and rejects agent scope. | High |
| Feedback should alter retrieval score. | 027/008 retrieval reducer | ADAPT | Must remain bounded so semantic relevance still dominates. | High |
| Feedback should alter retention eligibility. | 027/008 retention reducer | ADAPT SOFTLY | Premature archival can delete rare useful knowledge. | High |
| Feedback should alter FSRS decay schedule. | 027/008 FSRS reducer | ADAPT AFTER PROMOTION | Too much coupling can destabilize review scheduling. | Medium |
| Feedback should alter importance tier. | New governance reducer | MOSTLY DEFER | Tier is user/governance semantics, not just observed utility. | High |
| Asymmetric damping is risky in small local memory. | 027/008 damping policy | ADAPT OPPOSITE | MemClaw’s failure delta is larger than success delta and archival also keys off low weight. | High |
| System-generated types must be unforgeable. | 027/008 event provenance | ADAPT | Local tools need equivalent boundary checks for reducer outputs. | High |
| Activity-gated scheduled insight pass is useful. | 027/008 optional maintenance pass | ADAPT | Default should be off or cheap; local user should control LLM cost. | Medium |

## Negative knowledge (confirmed)
- Fleet scope, tenant scope, trust levels, and cross-agent visibility are MemClaw multi-tenant controls; Spec Kit’s local single-user store should not import them (`core-api/src/core_api/routes/evolve.py:41-60`, `core-api/src/core_api/routes/evolve.py:104-163`).
- Cross-agent divergence has no direct single-agent analog; MemClaw requires `fleet` or `all` scope and rejects `agent` scope (`core-api/src/core_api/routes/insights.py:57-63`, `core-api/src/core_api/services/insights_service.py:1057-1061`).
- Fleet/tenant scheduled fanout is not relevant as architecture; only the activity-gated idea maps (`core-operations/src/core_operations/tasks.py:104-113`, `core-api/src/core_api/routes/lifecycle.py:60-62`).
- Postgres/pgvector scoring mechanics are implementation-specific; Spec Kit should adapt the ranking concept, not the CTE/pgvector transaction shape (`core-storage-api/src/core_storage_api/services/postgres_service.py:845-1234`).
- `analysis_reports` is crystallization reporting, not the self-improving feedback record to copy (`common/models/analysis_report.py:11-40`).

DELTA_JSON: {"iteration":"014","focus":"DEEP self-improving loop -> 027/008 shadow-first reducer design","findingsCount":15,"newInfoRatio":0.74,"topVerdicts":["ADAPT: durable outcome events plus shadow ledger, with bounded promoted score/retention/FSRS effects","DEFER: active confidence-only generated rules, cross-agent divergence, and direct importance-tier mutation"],"sources":["core-api/src/core_api/services/evolve_service.py:147","core-api/src/core_api/services/evolve_service.py:881","core-api/src/core_api/services/insights_service.py:979","core-storage-api/src/core_storage_api/services/postgres_service.py:973","core-storage-api/src/core_storage_api/services/postgres_service.py:1606","common/enrichment/constants.py:97"]}
