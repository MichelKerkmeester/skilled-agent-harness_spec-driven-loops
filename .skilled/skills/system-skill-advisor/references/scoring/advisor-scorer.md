---
title: "Advisor Scorer: Lane Attribution and Confidence Calibration"
description: "Reference for the skill advisor's lane fusion scoring system, lane attribution assembly, confidence thresholds and prompt-safety boundaries."
trigger_phrases:
  - "advisor scorer lanes"
  - "lane attribution"
  - "confidence thresholds"
  - "scorer calibration"
  - "prompt isolation safety"
importance_tier: "normal"
contextType: "implementation"
version: 0.8.11.0
---

# Advisor Scorer: Lane Attribution and Confidence Calibration

Open this when a recommendation scores unexpectedly, and when you need to see which lane moved a result and how much confidence the call earned.

---

## 1. OVERVIEW

### Purpose

Explains the advisor's lane fusion scorer, lane attribution, confidence calibration and prompt-safety boundaries.

### When to Use

- Debugging why a skill recommendation scored the way it did.
- Reviewing lane weights, confidence floors or ambiguity handling.
- Checking prompt-safety rules for attribution output.

### Core Principle

Recommendations must be explainable through lane attribution without echoing raw prompt text.

### Key Sources

- `runtime/lib/scorer/`
- [`lane-weight-tuning.md`](./lane-weight-tuning.md)
- [`validation-baselines.md`](./validation-baselines.md)

---

## 2. LANE ATTRIBUTION MODEL

Four lanes are registered for scoring. Their live weights are held in the registry. A zero weight disables a lane for scoring without removing it from the registry. Lane attribution derives shadow-only status from registry liveness (`isLiveScorerLane`): a lane is filtered from dominant-lane detection only when it is not live.

| Lane | Live Weight | Shadow Weight | Source |
|---|---|---|---|
| explicit_author | 0.42 | 0.40 | Curated token and phrase boosts |
| lexical | 0.28 | 0.25 | Token matching with synonym expansion |
| graph_causal | 0.13 | 0.20 | Skill graph edge propagation |
| derived_generated | 0.12 | 0.10 | Derived trigger metadata |

Lane weights live in `runtime/lib/scorer/lane-registry.ts:8-18`. The derived-dominant check fires when derived lane evidence exceeds combined explicit plus lexical evidence, triggering a confidence ceiling (`runtime/lib/scorer/attribution.ts:26-34`).

### Shadow vs live weight mechanics

Shadow weights live alongside live weights as `DEFAULT_SHADOW_SCORER_LANE_WEIGHTS` in `runtime/lib/scorer/lane-registry.ts`.

- `SPECKIT_ADVISOR_SHADOW_MODE` is currently inert: it documents intended operator control, but the runtime has no reader for it and scoring does not branch on that variable.
- Effective shadow-only status is derived per lane from registry liveness in fusion (`shadowOnly = !isLiveScorerLane(lane)`), not from any per-match flag.

---

## 3. LEXICAL LANE

Before the lanes score the prompt, `scoreAdvisorPrompt` calls `stripLeadingPastedReply` from `runtime/lib/prompt-policy.ts` to remove a recognized earlier reply pasted ahead of the task (`runtime/lib/scorer/fusion.ts:1275-1277,1291-1297`). The lexical lane performs token-based matching between prompt text and skill metadata covering name, description, domains, keywords and intent signals. Tokens expand through a synonym map (e.g., `branch` expands to `git`, `worktree`, `merge`) and category hints add skill-specific boosts (`runtime/lib/scorer/lanes/lexical.ts:8-37`).

Category hints route well-known phrases. The phrase `deep research` maps to the deep-research skill with a 0.38 boost (`runtime/lib/scorer/lanes/lexical.ts:25-37`). Evidence tokens are capped at 5 hits per skill and the lane score is clamped to 1.0 (`runtime/lib/scorer/lanes/lexical.ts:73-86`).

---

## 4. GRAPH CAUSAL LANE

The graph causal lane propagates scores through the skill graph using typed edges. Edge multipliers: `enhances` 0.55, `siblings` 0.35, `depends_on` 0.35, `prerequisite_for` 0.30, `conflicts_with` -0.35 (`runtime/lib/scorer/lanes/graph-causal.ts:13-19`).

Traversal uses BFS with `maxDepth=2` and `maxBreadth=4`, decaying signal by `1/(depth+1)` (`runtime/lib/scorer/lanes/graph-causal.ts:27-28, 70`). Negative contributions from `conflicts_with` edges pass through the emit filter so suppressive evidence reaches fusion (`runtime/lib/scorer/lanes/graph-causal.ts:89-103`).

---

## 5. EXPLICIT AUTHOR LANE

The explicit author lane uses curated `TOKEN_BOOSTS` and `PHRASE_BOOSTS` mappings for high-confidence routing, plus pattern-based disambiguation rules. Token boosts map single tokens to skill scores (e.g., `git` to sk-git at 1.0, `readme` to sk-doc at 0.95) defined in `runtime/lib/scorer/lanes/explicit.ts:28-83`.

- Phrase boosts handle multi-word patterns (e.g., `deep-research` to system-deep-loop at 1.3, `deep research` to system-deep-loop at 1.0, `chrome devtools` to mcp-browser-use at 1.0) defined in `runtime/lib/scorer/lanes/explicit.ts:91-213`.
- Every `PHRASE_BOOSTS` amount must lie in the closed interval [-1.0, 2.0], declared as `PHRASE_BOOST_BOUND` at `runtime/lib/scorer/lanes/explicit.ts:89` and pinned by `runtime/tests/command-bridge-resolution-guard.vitest.ts`; it is the same range the doctor proposal validator uses.
- The lane still clamps each emitted score to at most 1.
- Review-plus-write disambiguation applies +3.0 to sk-code when both `review` and write verbs appear together, anchoring the explicit lane on the code hub so its router selects the implement mode rather than the code-review mode (`runtime/lib/scorer/lanes/explicit.ts:432-441`; the +3.0 push is at line 440).

---

## 6. DERIVED GENERATED LANE

The derived generated lane scores against `derivedTriggers` and `derivedKeywords` from skill metadata. Phrase-specificity scoring weights direct triggers at 0.7x and affordance-derived triggers at 0.45x (`runtime/lib/scorer/lanes/derived.ts:38-53`).

Age-policy haircut reduces derived scores based on projection age and skill lifecycle status (`runtime/lib/scorer/lanes/derived.ts:54-61`). A per-skill `derivedDemotion` factor scales scores further before emission (`runtime/lib/scorer/lanes/derived.ts:66`).

---

## 7. SCORE FUSION AND CONFIDENCE CALIBRATION

Fusion combines weighted lane contributions into a final score, then applies confidence assembly based on live normalization, direct evidence plus intent signals. Confidence uses `liveNormalized` (`score/liveTotal`) as the primary ramp with `baseConstant=0.52` plus `liveNormalizedRampCoefficient=0.43` (`runtime/lib/scorer/scoring-constants.ts:184-186`).

The derived-dominant short-circuit pins confidence to 0.72 when the derived lane dominates and `directScore < 0.2` (`runtime/lib/scorer/scoring-constants.ts:188-189`). A task-intent floor of 0.82 applies when `directScore >= 0.18` or `liveNormalized >= 0.2`, with a dispersion guard against token-stuffing (`runtime/lib/scorer/scoring-constants.ts:190-192`, guard in `runtime/lib/scorer/fusion.ts:426-437`).

### Confidence calibration constants (full reference)

| Constant | Default | Behavior |
|---|---|---|
| `baseConstant` | 0.52 | Confidence floor for any non-zero score. |
| `liveNormalizedRampCoefficient` | 0.43 | Coefficient on `liveNormalized` (score/liveTotal). |
| `liveNormalizedRampGain` | 1.25 | Additional gain applied beyond base ramp. |
| `readOnlyExplainerFloor` | 0.25 | Floor for read-only explainer cases. |
| `readOnlyRouteAllowedFloor` | 0.82 | Floor for read-only routes that pass intent checks. |
| `derivedDominantConfidence` | 0.72 | Pinned ceiling when derived lane dominates and `directScore < 0.2`. |
| `taskIntentFloor` | 0.82 | Floor when `directScore >= 0.18` or `liveNormalized >= 0.2`. |
| `directScoreFloor` | 0.82 | Floor when `directScore >= 0.75`. |
| `hardCeiling` | 0.95 | Maximum confidence regardless of inputs. |
| `noEvidenceFloor` | 0.42 | Uncertainty floor when no evidence is present. |
| `someEvidenceFloor` | 0.30 | Uncertainty floor when only weak evidence is present. |
| `mediumEvidenceFloor` | 0.22 | Uncertainty floor for moderate evidence. |
| `highEvidenceFloor` | 0.18 | Uncertainty floor for high evidence. |
| `directEvidenceDiscount` | -0.06 | Discount applied to uncertainty when `directScore >= 0.75`. |
| `lowConfidencePenalty` | +0.08 | Penalty added to uncertainty when `confidence < 0.8`. |
| `ambiguityMargin` | 0.05 | Score-gap and confidence-gap margin for cluster detection. |

The confidence constants are declared by the `ConfidenceCalibration` interface (`runtime/lib/scorer/scoring-constants.ts:20-61`) with their defaults at `:182-198`, the uncertainty constants by `UncertaintyCalibration` (`:66-97`) with their defaults at `:199-214`, and the ambiguity margins are `AMBIGUITY_MARGIN` and `AMBIGUITY_CONFIDENCE_MARGIN` in `runtime/lib/scorer/ambiguity.ts:8-9`. Changes require measured evidence plus a synchronized update across this doc, the feature catalog, plus the manual playbook.

---

## 8. UNCERTAINTY AND AMBIGUITY DETECTION

Uncertainty is computed from evidence count and direct evidence. Uncertainty floors: no evidence 0.42, some evidence 0.30, medium evidence 0.22, high evidence 0.18 (`runtime/lib/scorer/scoring-constants.ts:200-206`).

Direct evidence discount of -0.06 applies when `directScore >= 0.75`. Low-confidence penalty of +0.08 applies when `confidence < 0.8` (`runtime/lib/scorer/scoring-constants.ts:207-210`). Ambiguity clusters use 0.05 margins for both score and confidence gaps, unioning the two conditions (`runtime/lib/scorer/ambiguity.ts:8-9, 63-77`).

---

## 9. PROMPT ISOLATION SAFETY

Lane attribution is safety-critical. It must provide explainable routing without exposing raw prompt text in advisor metadata or outputs. Attribution reason strings use lane identifiers and evidence labels (e.g., `lexical=0.85 (token:git; hint:worktree)`) instead of quoting prompt text (`runtime/lib/scorer/attribution.ts:13-24`).

Evidence arrays contain structured labels (`token:`, `hint:`, `phrase:`, `explicit:`, `author:`, `derived:`, `edge:`) that reference match patterns rather than raw prompt substrings (`runtime/lib/scorer/lanes/lexical.ts:66-77`). The boundary is enforced at attribution assembly so downstream consumers receive only prompt-safe artifacts.
