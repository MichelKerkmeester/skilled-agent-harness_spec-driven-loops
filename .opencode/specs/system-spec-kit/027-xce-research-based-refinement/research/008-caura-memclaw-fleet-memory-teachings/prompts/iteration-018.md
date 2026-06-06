ROLE: ADVERSARIAL verifier. Your job is to REFUTE, not confirm. Default position: "this should NOT be adopted as-is." This is the HIGHEST cargo-cult-risk cluster (self-improving memory). Be ruthless. READ-ONLY. Do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

TARGET (verify against real code): caura-memclaw at /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main . CONSUMER: Spec Kit Memory (LOCAL single-user, SQLite). It already has FSRS-style decay, importance tiers, constitutional protection.

ALREADY PLANNED IN 027/008 (flag teachings that merely restate this as REDUNDANT): learning-feedback reducers are DEFAULT-OFF and SHADOW-FIRST until ledger quality, replay, and per-consumer promotion gates pass. So "be shadow-first" is ALREADY the plan — a teaching that just says "be shadow-first" is validation, not novelty.

THE CORE SKEPTICAL QUESTION: MemClaw's self-improvement value is CROSS-AGENT (one agent's mistake protects 40 others). Spec Kit has ONE agent/user. Does outcome feedback have ANY real signal for a single user, or is the whole loop a fleet feature with no single-user payoff? Attack this directly.

CLAIMS TO ATTACK (from iterations 004/094). For EACH: (1) OPEN cited file:line, CONFIRM/REFUTE the evidence; (2) attack: no single-user signal? redundant vs 027/008's existing shadow-first plan? feedback-poisoning / asymmetric-damping harms a SMALL local corpus? complexity >> payoff? (3) render UPHELD / DOWNGRADE / REFUTED.
- C1: Durable outcome-event records + a shadow ledger, with BOUNDED promotion to retrieval score / retention / FSRS. Cited: core-api/src/core_api/services/evolve_service.py:147-165,551-612; core-storage-api/src/core_storage_api/services/postgres_service.py:919-975.
- C2: Reserve system-generated feedback memory types (outcome/rule/insight) so user writes cannot forge learning signals. Cited: common/enrichment/constants.py:97-110; core-api/src/core_api/routes/memories.py:101-131.
- C3: Keep LLM-generated "rules" in shadow/probation, NOT immediately authoritative (DEFER active confidence-only rules). Cited: core-api/src/core_api/services/evolve_service.py:837-857,904-923.
- C4: Insight mining is useful in single-agent modes (failures/stale/patterns) but NOT divergence (cross-agent); must hallucination-gate + supersede. Cited: core-api/src/core_api/services/insights_service.py:283-320,421-454,926-1008.
- C5: Asymmetric damping (failure -0.15 vs success +0.10) is risky for a small corpus — needs softer/symmetric damping. Cited: core-api/src/core_api/constants.py:494-503; core-api/src/core_api/services/evolve_service.py:147-165.

DELIVERABLE — markdown with EXACTLY these sections:
## Citation verification
Per claim: VERIFIED / MISATTRIBUTED / NOT-FOUND.
## Refutation analysis
Per claim, the strongest argument AGAINST. Plus an explicit verdict on the CORE question: does single-user outcome feedback have enough signal to justify 027/008 at all, or should 008 be scoped down / deferred?
## Verdict adjustments
Table: Claim · Prior verdict · NEW verdict · Reason.
## Surviving teachings
The minimal subset that genuinely helps a single-user store (if any).

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"018","focus":"ADVERSARIAL refute self-improving / 027-008 reducer teachings","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["UPHELD: ...","DOWNGRADE: ...","REFUTED: ..."],"sources":["path:line"]}
