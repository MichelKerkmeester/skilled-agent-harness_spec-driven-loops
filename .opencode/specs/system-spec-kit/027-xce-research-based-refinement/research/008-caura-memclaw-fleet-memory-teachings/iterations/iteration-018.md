# Iteration 018 — ADVERSARIAL refute self-improving / 027-008 reducer teachings

**Status:** insight · **Findings:** 9 · **newInfoRatio:** 0.34 · **tokens:** 71635 · **exit:** 0 · executor: cli-opencode openai/gpt-5.5-fast(high)

---

## Citation verification
C1: MISATTRIBUTED. `evolve_service.py:147-165` verifies a direct bulk weight-update SQL path. `evolve_service.py:551-612` verifies durable `outcome` memories. `postgres_service.py:919-975` verifies retrieval scoring blends similarity, freshness setup, recall boost setup, and weight in `base_score`, but it does not verify a shadow ledger, bounded promotion, retention, or FSRS.

C2: VERIFIED. `common/enrichment/constants.py:97-110` defines `SERVER_RESERVED_MEMORY_TYPES = {"outcome", "rule", "insight"}`. `routes/memories.py:101-131` rejects those at the REST write boundary. Adjacent evidence also shows REST calls it on single and bulk writes at `routes/memories.py:873` and `routes/memories.py:1027`; MCP mirrors this at `mcp_server.py:281-310`.

C3: MISATTRIBUTED. `evolve_service.py:837-857` only limits rule generation to failure/partial outcomes with related IDs. `evolve_service.py:904-923` persists a generated rule when confidence is above `EVOLVE_RULE_CONFIDENCE_THRESHOLD`; it does not keep the rule in shadow/probation.

C4: MISATTRIBUTED. The cited ranges verify pieces, not the whole claim. `insights_service.py:419-454` verifies divergence requires multiple agents at query level, and `insights_service.py:1057-1061` rejects `focus="divergence"` with `scope="agent"`. `insights_service.py:926-1008` verifies hallucinated `related_memory_ids` are dropped. Supersession is actually at `insights_service.py:706-780` and restore-on-total-failure at `insights_service.py:893-913`, not in the cited range. Failures/stale/patterns are at `insights_service.py:369-416` and `insights_service.py:457-471`, also outside the cited bundle.

C5: VERIFIED. `constants.py:495-503` verifies asymmetric deltas: success `+0.1`, failure `-0.15`, partial `+0.03`. `evolve_service.py:100-104` maps outcomes to those deltas, and `evolve_service.py:340-375` applies them directly through the bulk update.

## Refutation analysis
C1: Strongest argument against: this bundles one real teaching with several invented or already-planned safeguards. MemClaw has durable outcome records, but the actual mechanism is direct active mutation: `_adjust_weights` picks `_DELTA_MAP[outcome_type]` and applies it to canonical memory weight. The cited storage lines show weight affects ranking, not a shadow ledger. In Spec Kit’s single-user corpus, promoting outcome feedback into retrieval, retention, and FSRS creates three coupled control loops from sparse, ambiguous labels. That is complexity without enough signal. NEW verdict: REFUTED as-is.

C2: Strongest argument against: this is necessary only if feedback artifacts can affect reducers. If 008 is scoped down to an audit-only event log, reserved types are less valuable. Still, once any reducer consumes outcome/rule/insight records, user-forgeability is a real poisoning path even in a single-user store because the same user-facing agent can accidentally or adversarially write fake reducer evidence. NEW verdict: UPHELD, but only as a provenance boundary, not as a reason to build the reducer loop.

C3: Strongest argument against: the cited MemClaw evidence proves the opposite of the claimed mechanism. MemClaw persists confidence-passing rules as ordinary `rule` memories. “Keep LLM rules shadow/probation first” is a good negative lesson, but it is not new: iteration 014 already planned “Never promote LLM-generated rules straight into recall” and shadow/probation gates. NEW verdict: DOWNGRADE as redundant validation, not new teaching.

C4: Strongest argument against: single-agent insight mining has weak signal unless the system already has dense, reliable metadata. Failures based on low weight plus recall can punish rare-but-correct memories. Stale based on no recall is extremely weak in a local corpus where many valid memories are episodic. Patterns are prone to overfit small corpora. Divergence is explicitly cross-agent and should not transfer. Hallucinated-ID filtering and supersession are useful hygiene, but they do not prove that autonomous insight mining should drive reducers. NEW verdict: DOWNGRADE to manual/diagnostic insight review only.

C5: Strongest argument against: asymmetric damping is especially dangerous locally because one mistaken failure attribution can push a useful memory toward lower retrieval and retention eligibility, while there may be too few future successful events to recover it. MemClaw also lets low weight feed stale archival conditions. Spec Kit already has FSRS decay, importance tiers, and constitutional protection, so direct negative damping would fight existing governance. NEW verdict: UPHELD as a rejection of MemClaw’s mechanic.

CORE question verdict: single-user outcome feedback has some signal, but not enough to justify 027/008 as a self-improving loop with active autonomous promotion across retrieval, retention, and FSRS. The fleet payoff is missing: one agent’s failure does not amortize across 40 agents. For Spec Kit, the only defensible signal is explicit user correction, deterministic validation, or repeated independent evidence across distinct task contexts. 008 should be scoped down to event capture, replayable shadow diagnostics, and provenance guards; active reducers should remain deferred until measured ledger quality proves positive value.

## Verdict adjustments
| Claim | Prior verdict | NEW verdict | Reason |
|---|---|---|---|
| C1 | ADAPT durable outcome events plus shadow ledger with bounded effects | REFUTED | MemClaw evidence verifies durable outcomes and direct active weight mutation, not shadow ledger or bounded FSRS/retention promotion; single-user payoff is too weak for this scope. |
| C2 | ADAPT system-generated type protection | UPHELD | Provenance protection is still useful against feedback poisoning if reducers exist, though it does not justify reducers by itself. |
| C3 | DEFER active confidence-only generated rules; use shadow/probation | DOWNGRADE | Correct recommendation, but cited code shows MemClaw does immediate confidence-gated persistence; shadow-first is already planned in 027/008. |
| C4 | ADAPT failures/stale/patterns; defer divergence | DOWNGRADE | Query modes exist, but utility is unproven for small local corpora; keep as opt-in diagnostics, not active learning reducers. |
| C5 | ADAPT opposite: softer/symmetric damping | UPHELD | Direct asymmetric failure damping is genuinely risky in a sparse single-user corpus and conflicts with existing tier/FSRS/protection semantics. |

## Surviving teachings
Minimal survivor set:

Keep an append-only outcome or correction event record only for audit, replay, and diagnostics.

Reserve or otherwise provenance-protect system-generated feedback artifacts if any reducer consumes them.

Keep LLM-generated rule candidates out of normal recall unless explicitly confirmed or repeatedly validated.

If any active effect is ever promoted, use small symmetric modifiers and never mutate constitutional/protected memories or importance tiers from outcome failure.

Treat failures, stale, and patterns as manual review signals with minimum corpus/evidence thresholds. Do not import divergence for single-user Spec Kit.

DELTA_JSON: {"iteration":"018","focus":"ADVERSARIAL refute self-improving / 027-008 reducer teachings","findingsCount":9,"newInfoRatio":0.34,"topVerdicts":["UPHELD: C2 provenance-reserved feedback artifacts and C5 rejection of asymmetric damping survive","DOWNGRADE: C3 shadow/probation rules and C4 insight mining are mostly redundant or diagnostic-only","REFUTED: C1 as-is; cited code shows durable outcomes plus direct active mutation, not a shadow ledger or bounded FSRS/retention promotion"],"sources":["core-api/src/core_api/services/evolve_service.py:147","core-api/src/core_api/services/evolve_service.py:340","core-api/src/core_api/services/evolve_service.py:584","core-api/src/core_api/services/evolve_service.py:904","core-storage-api/src/core_storage_api/services/postgres_service.py:973","common/enrichment/constants.py:97","core-api/src/core_api/routes/memories.py:101","core-api/src/core_api/mcp_server.py:281","core-api/src/core_api/services/insights_service.py:369","core-api/src/core_api/services/insights_service.py:706","core-api/src/core_api/services/insights_service.py:979","core-api/src/core_api/services/insights_service.py:1057","core-api/src/core_api/constants.py:495",".opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings/iterations/iteration-014.md:51"]}
