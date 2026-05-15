---
title: "Advisor Scorer: Lane Attribution and Confidence Calibration"
description: "Reference for the skill advisor's 5-lane scoring system, lane attribution assembly, confidence thresholds and prompt-safety boundaries."
trigger_phrases:
  - "advisor scorer lanes"
  - "lane attribution"
  - "confidence thresholds"
  - "scorer calibration"
  - "prompt isolation safety"
---

# Advisor Scorer: Lane Attribution and Confidence Calibration

<!-- sk-doc-template: skill_reference -->

---

<!-- ANCHOR:1-overview -->
## 1. OVERVIEW

The advisor scorer ranks candidate skills against a user prompt by fusing weighted evidence from five distinct lanes. Lane attribution traces which lanes contributed to a recommendation and produces prompt-safe explanations that do not echo raw prompt text.

The scorer combines lane-specific evidence, text matching, age policy, ambiguity handling and final fusion into recommendation scores (`mcp_server/lib/scorer/README.md:30-33`). Prompt-safety boundary forbids advisor metadata and lane attribution from echoing raw prompt text (`SKILL.md:124`). Final fusion normalizes lane contributions by live weight total and applies calibration constants for confidence assembly (`mcp_server/lib/scorer/fusion.ts:309-311`).

---

<!-- /ANCHOR:1-overview -->

<!-- ANCHOR:2-lane-attribution-model -->
## 2. LANE ATTRIBUTION MODEL

Five lanes participate in scoring. Each carries a fixed weight in the live fusion total. Lane attribution filters shadow-only lanes from dominant lane detection but keeps them in reason strings.

| Lane | Weight | Source |
|---|---|---|
| explicit_author | 0.42 | Curated token and phrase boosts |
| lexical | 0.28 | Token matching with synonym expansion |
| graph_causal | 0.13 | Skill graph edge propagation |
| derived_generated | 0.12 | Derived trigger metadata |
| semantic_shadow | 0.05 | Embedding cosine similarity (shadow only) |

Lane weights live in `mcp_server/lib/scorer/lane-registry.ts:7-19`. The derived-dominant check fires when derived lane evidence exceeds combined explicit and lexical evidence, triggering a confidence ceiling (`mcp_server/lib/scorer/attribution.ts:26-34`).

---

<!-- /ANCHOR:2-lane-attribution-model -->

<!-- ANCHOR:3-lexical-lane -->
## 3. LEXICAL LANE

The lexical lane performs token-based matching between prompt text and skill metadata covering name, description, domains, keywords and intent signals. Tokens expand through a synonym map (e.g., `branch` expands to `git`, `worktree`, `merge`) and category hints add skill-specific boosts (`mcp_server/lib/scorer/lanes/lexical.ts:8-37`).

Category hints route well-known phrases. The phrase `deep research` maps to the deep-research skill with a 0.38 boost (`mcp_server/lib/scorer/lanes/lexical.ts:25-37`). Evidence tokens are capped at 5 hits per skill and the lane score is clamped to 1.0 (`mcp_server/lib/scorer/lanes/lexical.ts:73-86`).

---

<!-- /ANCHOR:3-lexical-lane -->

<!-- ANCHOR:4-semantic-shadow-lane -->
## 4. SEMANTIC SHADOW LANE

The semantic shadow lane computes cosine similarity between a prompt embedding and pre-computed skill embeddings. The lane carries `shadowOnly=true` and weight 0.05 so it does not affect live ranking (`mcp_server/lib/scorer/lanes/semantic-shadow.ts:154-161`).

Cosine similarity below 0.2 is treated as no signal (`mcp_server/lib/scorer/lanes/semantic-shadow.ts:10, 147-150`). When embeddings are unavailable under `VITEST=true`, the lane falls back to token-overlap scoring so tests stay deterministic (`mcp_server/lib/scorer/lanes/semantic-shadow.ts:91-108`).

---

<!-- /ANCHOR:4-semantic-shadow-lane -->

<!-- ANCHOR:5-graph-causal-lane -->
## 5. GRAPH CAUSAL LANE

The graph causal lane propagates scores through the skill graph using typed edges. Edge multipliers: `enhances` 0.55, `siblings` 0.35, `depends_on` 0.35, `prerequisite_for` 0.30, `conflicts_with` -0.35 (`mcp_server/lib/scorer/lanes/graph-causal.ts:13-19`).

Traversal uses BFS with `maxDepth=2` and `maxBreadth=4`, decaying signal by `1/(depth+1)` (`mcp_server/lib/scorer/lanes/graph-causal.ts:27-28, 70`). Negative contributions from `conflicts_with` edges pass through the emit filter so suppressive evidence reaches fusion (`mcp_server/lib/scorer/lanes/graph-causal.ts:89-103`).

---

<!-- /ANCHOR:5-graph-causal-lane -->

<!-- ANCHOR:6-explicit-author-lane -->
## 6. EXPLICIT AUTHOR LANE

The explicit author lane uses curated `TOKEN_BOOSTS` and `PHRASE_BOOSTS` mappings for high-confidence routing, plus pattern-based disambiguation rules. Token boosts map single tokens to skill scores (e.g., `git` to sk-code at 1.0, `readme` to sk-doc at 0.95) defined in `mcp_server/lib/scorer/lanes/explicit.ts:8-90`.

Phrase boosts handle multi-word patterns (e.g., `deep research` to deep-research at 1.3, `chrome devtools` to mcp-chrome-devtools at 1.0) defined in `mcp_server/lib/scorer/lanes/explicit.ts:92-186`. Review-plus-write disambiguation applies +3.0 to sk-code and -2.0 to sk-code-review when both `review` and write verbs appear together (`mcp_server/lib/scorer/lanes/explicit.ts:230-245`).

---

<!-- /ANCHOR:6-explicit-author-lane -->

<!-- ANCHOR:7-derived-generated-lane -->
## 7. DERIVED GENERATED LANE

The derived generated lane scores against `derivedTriggers` and `derivedKeywords` from skill metadata. Phrase-specificity scoring weights direct triggers at 0.7x and affordance-derived triggers at 0.45x (`mcp_server/lib/scorer/lanes/derived.ts:38-53`).

Age-policy haircut reduces derived scores based on projection age and skill lifecycle status (`mcp_server/lib/scorer/lanes/derived.ts:54-61`). A per-skill `derivedDemotion` factor scales scores further before emission (`mcp_server/lib/scorer/lanes/derived.ts:66`).

---

<!-- /ANCHOR:7-derived-generated-lane -->

<!-- ANCHOR:8-score-fusion-and-confidence-calibration -->
## 8. SCORE FUSION AND CONFIDENCE CALIBRATION

Fusion combines weighted lane contributions into a final score, then applies confidence assembly based on live normalization, direct evidence and intent signals. Confidence uses `liveNormalized` (`score/liveTotal`) as the primary ramp with `baseConstant=0.52` plus `liveNormalizedRampCoefficient=0.43` (`mcp_server/lib/scorer/scoring-constants.ts:141-144`).

The derived-dominant short-circuit pins confidence to 0.72 when the derived lane dominates and `directScore < 0.2` (`mcp_server/lib/scorer/scoring-constants.ts:146-147`). A task-intent floor of 0.82 applies when `directScore >= 0.18` or `liveNormalized >= 0.2`, with a dispersion guard against token-stuffing (`mcp_server/lib/scorer/scoring-constants.ts:149-156`).

---

<!-- /ANCHOR:8-score-fusion-and-confidence-calibration -->

<!-- ANCHOR:9-uncertainty-and-ambiguity-detection -->
## 9. UNCERTAINTY AND AMBIGUITY DETECTION

Uncertainty is computed from evidence count and direct evidence. Uncertainty floors: no evidence 0.42, some evidence 0.30, medium evidence 0.22, high evidence 0.18 (`mcp_server/lib/scorer/scoring-constants.ts:160-165`).

Direct evidence discount of -0.06 applies when `directScore >= 0.75`. Low-confidence penalty of +0.08 applies when `confidence < 0.8` (`mcp_server/lib/scorer/scoring-constants.ts:167-170`). Ambiguity clusters use 0.05 margins for both score and confidence gaps, unioning the two conditions (`mcp_server/lib/scorer/ambiguity.ts:7-8, 22-36`).

---

<!-- /ANCHOR:9-uncertainty-and-ambiguity-detection -->

<!-- ANCHOR:10-prompt-isolation-safety -->
## 10. PROMPT ISOLATION SAFETY

Lane attribution is safety-critical. It must provide explainable routing without exposing raw prompt text in advisor metadata or outputs. Attribution reason strings use lane identifiers and evidence labels (e.g., `lexical=0.85 (token:git; hint:worktree)`) instead of quoting prompt text (`mcp_server/lib/scorer/attribution.ts:13-24`).

Evidence arrays contain structured labels (`token:`, `hint:`, `phrase:`, `explicit:`, `author:`, `derived:`, `edge:`) that reference match patterns rather than raw prompt substrings (`mcp_server/lib/scorer/lanes/lexical.ts:66-77`). The boundary is enforced at attribution assembly so downstream consumers receive only prompt-safe artifacts.

<!-- /ANCHOR:10-prompt-isolation-safety -->
