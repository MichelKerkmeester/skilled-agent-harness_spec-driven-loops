ROLE: Senior memory-systems research analyst, DEEP second pass. READ-ONLY. Do NOT write/edit/create files or run code. Spec folder: .opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/008-caura-memclaw-fleet-memory-teachings (pre-approved; skip Gate 3).

TARGET: caura-memclaw (multi-tenant, Postgres/pgvector). CONSUMER: Spec Kit Memory (LOCAL single-user, SQLite + vector store) — 027/008 = shadow-first learning-feedback reducers. MemClaw is Apache-2.0 — design inspiration only.
Path: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/027-xce-research-based-refinement/external/caura-memclaw-main

PRIOR PASS (iteration 004) ALREADY FOUND (go DEEPER + verify): two loops — evolve (outcome capture with related_ids; scope/trust gate; clamped weight deltas success +0.1 / failure -0.15 / partial +0.03, floor 0.05 cap 1.0; failure/partial trigger LLM rule synthesis persisted only at confidence >= 0.5; outcome stored as memory_type='outcome', rules as 'rule' with generated_by='evolve') and insights (separate reflection over contradictions/failures/stale/divergence/patterns/discover; excludes prior insights from sources; drops hallucinated related_ids; supersedes prior insights; activity-gated daily). System types outcome/rule/insight are server-reserved (agents can't forge them). Search blends Memory.weight into score, so evolve directly affects ranking. Stale archival targets weight<0.3 + zero recall.

YOUR ANGLE (iteration 014): DEEP self-improving loop internals -> design 027/008. Verify with exact file:line: the outcome data model + weight-application transaction; the rule-synthesis confidence gate; the insight hallucination-gating + supersession; how feedback reaches ranking/retention. Then answer the OPEN QUESTIONS from 084: (1) durable outcome event record vs implicit telemetry; (2) should generated rules be shadow/probation before entering recall; (3) does single-agent insight mining have enough signal (which modes: failures/stale/patterns yes, divergence no); (4) should feedback alter importance-tier, FSRS decay schedule, retrieval score, retention eligibility — or which subset; (5) asymmetric damping risk (failures lower weight faster than successes raise — risk of losing rare-but-correct memories in a SMALL local corpus).
Read deeply (cap ~18 files): core-api/src/core_api/services/evolve_service.py, core-api/src/core_api/services/insights_service.py, core-api/src/core_api/constants.py (scoring/confidence consts), core-api/src/core_api/routes/{evolve,insights}.py, core-storage-api/src/core_storage_api/services/postgres_service.py (scoring + stale archival), common/models/analysis_report.py.

DELIVERABLE — markdown with EXACTLY these sections (cite file:line):
## Verified mechanism (deep)
The evolve+insights internals at implementation level, confirming/correcting 084.
## Concrete Spec-Kit-native adoption sketch (027/008)
A CONCRETE shadow-first reducer design for a single-agent local store: the outcome-event record (SQLite shape), the shadow ledger, the promotion gate (what evidence promotes a shadow signal to active), and exactly which target it mutates (tier vs FSRS decay vs score vs retention) with SYMMETRIC/soft damping to protect rare-but-correct memories. Tie to Spec Kit's existing FSRS decay + importance tiers + constitutional protection.
## Verdict table
Each teaching + answered open question: Claim · Maps-to (027/008 or new) · Verdict · Risk · Confidence.
## Negative knowledge (confirmed)
Cross-agent/fleet/divergence machinery with no single-agent analog.

Then output EXACTLY one final line, valid compact JSON:
DELTA_JSON: {"iteration":"014","focus":"DEEP self-improving loop -> 027/008 shadow-first reducer design","findingsCount":<int>,"newInfoRatio":<0.0-1.0>,"topVerdicts":["ADAPT: ...","DEFER: ..."],"sources":["path:line"]}
