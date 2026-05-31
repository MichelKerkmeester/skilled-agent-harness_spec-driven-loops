---
title: "Lane C Skill-Benchmark Scenario Authoring"
description: "How to author Lane C fixtures: the public/private pair schema, the three anti-circularity tiers (auto-derived, hand-authored holdout, adversarial), the T1-T2 circularity meter, coverage targets, and empty-gold handling."
trigger_phrases:
  - "skill-benchmark scenario authoring"
  - "Lane C fixtures"
  - "public private fixture"
  - "anti-circularity tiers"
importance_tier: important
contextType: reference
---

# Lane C Skill-Benchmark Scenario Authoring

How to author the public/private fixture pairs Lane C scores against.

---

## 1. OVERVIEW

Each scenario is a public/private pair under `assets/skill-benchmark/fixtures/<skill-id>/`. The public half is the only material that crosses the dispatch boundary; the private half is scorer-only gold. Author fixtures in three tiers to manage circularity, publish the T1-T2 score gap as the circularity meter, and aim for one admitted fixture per router key.

## 2. FIXTURE STRUCTURE

- `<scenarioId>.public.json` — dispatched material only. `{ scenarioId, tier, public: { prompt, runtime, mutationBoundary, outputContract }, provenance }`. The `prompt` is written in **domain language** — it must NOT name the skill, its triggers, intent keys, resource paths/basenames, or commands (the contamination linter rejects leaks before scoring).
- `<scenarioId>.private.json` — scorer-only gold, never crosses the dispatch boundary. `{ scenarioId, expected: { skillId, advisorLane, intentKeys, resources, negativeActivation }, rubric }`.

## 3. THREE TIERS (ANTI-CIRCULARITY)

- **T1 — auto-derived + paraphrased.** Gold keys mechanically derived from the skill's own `RESOURCE_MAP[intent]`; prompt paraphrased from the task domain and decontaminated. Breadth/coverage; circular unless decontaminated.
- **T2 — hand-authored holdout.** Prompt written from the task domain by an author blind to `INTENT_SIGNALS`/`RESOURCE_MAP`; gold joined privately. The honesty anchor.
- **T3 — adversarial.** Sibling-skill paraphrases, decoys whose gold belongs to another skill, and "should NOT activate" negatives (`negativeActivation: true`).

Publish the **T1↔T2 score gap** as the circularity meter (mirrors the advisor corpus↔holdout split). A large gap is a finding against the corpus, not evidence the skill is good.

## 4. COVERAGE

Aim for ≥1 admitted fixture per `INTENT_SIGNALS` key, per `RESOURCE_MAP` target, and per "When NOT to Use" class. Uncovered keys are themselves dead-key findings.

## 5. NOTE ON EMPTY GOLD

`expected.intentKeys`/`expected.resources` may be left `[]` while a skill's router map is still being confirmed; Mode A treats empty gold as non-penalizing (scores structure/efficiency only). Populate from a router-extract pass to get real D1-intra/D2 signal.
