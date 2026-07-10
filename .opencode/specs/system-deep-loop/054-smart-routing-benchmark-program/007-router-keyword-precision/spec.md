---
title: "Spec: Router Keyword-Precision Narrowing (over-activation fix)"
description: "Narrow over-broad generic keywords in the deep-loop child routers (deep-research + deep-improvement) so unrelated marketing/billing/UI prompts stop mis-routing to research intents, proving the shipped Type-1 gold is preserved; document deep-review/secondaries and defer sk-code."
trigger_phrases:
  - "router keyword precision"
  - "over-activation narrowing"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/054-smart-routing-benchmark-program/007-router-keyword-precision"
    last_updated_at: "2026-07-09T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded from fresh-Opus analysis"
    next_safe_action: "Narrow deep-research STATE/ITERATION/CONVERGENCE; re-prove gold"
    blockers: []
    completion_pct: 5
    open_questions:
      - "Narrow vs keep-and-document per intent — operator decision"
    answered_questions: []
---
# Spec: Router Keyword-Precision Narrowing (over-activation fix)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 007-router-keyword-precision |
| **Level** | 2 |
| **Status** | Planned |
| **Origin** | Discharges `../004-cross-skill-routing-sweep/assets/deep-research-router-precision-finding.md` |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
Under substring keyword-scoring (`router-replay.cjs:299-318`), bare common words in `INTENT_SIGNALS`
fire on unrelated prompts. deep-research `STATE` fires on `strategy`/`dashboard`/`registry`/`lineage`,
`ITERATION` on `focus`, `CONVERGENCE` on `diminishing returns` (`SKILL.md:115-118`) — confirmed by 4
reproduced probes. It is a **pattern**, not one skill: deep-improvement shares it (weight 4-5 bare
words like `strategy`/`contract`/`integration`); deep-review is mostly compound-scoped; sk-code
children have it but weight-1 + surface-sliced. Low severity (second-layer routers — the hub never
routes *into* a skill on these words; the collision only bites intra-session), but a real precision
defect. The `focus trap` compound already in code-webflow is the in-repo narrowing precedent.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
- Narrow deep-research `SKILL.md:115-118` (Tactic A compound e.g. `dashboard`→`research dashboard`;
  Tactic B drop pure idioms e.g. `diminishing returns`) and deep-improvement `SKILL.md:110-119`.
- Re-prove each skill's shipped Type-1 gold + probe suppression via `routeSkillResources`.
- Optionally extend 2 deep-research scenario prompts so new compound keywords get positive coverage.
- Document deep-review residuals + deep-research secondaries as known; log sk-code as a follow-up.

**Out of scope:** sk-code children (weight-1 + surface-sliced + dual-edit cost); RESOURCE_MAP/intent/hub
changes; the benchmark-engine over-activation lane (phase 009) that would let these be *scored*.
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** Every shipped Type-1 scenario's `intents[0]` + expected_resources unchanged after narrowing.
- **R2:** All 4 probes (and deep-improvement's) drop to `intents: []`.
- **R3:** D5 structural gate unchanged (no intent emptied, no RESOURCE_MAP change); drift guards green.
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. Gold-preservation proof (before/after routing of all scenarios) — zero drift.
2. Probe suppression proof — all mis-routes eliminated.
3. Mode-A benchmark D1intra flat, D3 flat on positives, D5 green.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *In-session recall loss* (accepted, primary) — the intended precision/recall tradeoff; compounds
  cover natural phrasings.
- *New compound keywords ship untested by positive gold* → the optional scenario-prompt extension.
- Independent of other phases; could later be automated by the phase-011 optimizer (intent-gate class).
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
**DECISION NEEDED — narrow vs keep-and-document, per intent.** Recommendation: narrow the confirmed
worst offenders in deep-research (STATE, ITERATION) + deep-improvement; drop pure idioms
(`diminishing returns`); keep-and-document deep-research secondaries (`setup`/`stuck`/`timeout`) and
deep-review residuals; defer sk-code to a separate follow-up.
<!-- /ANCHOR:questions -->
