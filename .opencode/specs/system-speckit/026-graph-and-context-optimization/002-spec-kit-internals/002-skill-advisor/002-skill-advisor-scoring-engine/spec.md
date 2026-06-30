---
title: "006-skill-advisor/002-skill-advisor-scoring-engine Phase Parent: Scoring System"
description: "Phase parent for skill advisor scoring optimization across 8 children: embed cache, cosine wiring, ablation/weight/corpus sweeps, and routing calibration to activate semantic similarity lanes."
trigger_phrases:
  - "006-skill-advisor/002-skill-advisor-scoring-engine"
  - "scorer"
  - "skill-advisor scoring"
importance_tier: "important"
contextType: "general"
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-core | v1.0 -->
# Phase Parent: 006-skill-advisor/002-skill-advisor-scoring-engine

<!-- SPECKIT_LEVEL: 3 -->

---

## 1. ROOT PURPOSE

Optimize the skill advisor's scoring system by activating semantic similarity lanes through embedding cache infrastructure, cosine wiring, and systematic weight tuning. The 8 children bind together thematically around a progressive evaluation pipeline: from shadow-only cosine lane deployment (014) through ablation sweeps (015), weight sweep harness development (016), corpus-seeded evaluation (017), harder-intent stress testing (020), to final routing calibration (023). This enables data-driven lane weight selection and damping configurations that lift recall on intent-described prompts without regressing today-correct baseline accuracy.

---

## 2. PHASE CHILDREN

| ID | Slug | Summary |
|----|------|---------|
| 001 | skill-advisor-hook-improvements | Skill-Advisor Hook Improvements |
| 002 | skill-advisor-semantic-lane | Phase parent for activating semantic lane with cosine similarity and weight rebalance gated behind ablation sweep |
| 003 | embed-cache-and-cosine-wiring | Add per-skill embedding cache to skill-graph.sqlite, embed prompts at recommend-time, surface cosine score as shadow-only lane |
| 004 | ablation-sweep-and-promote | Sweep candidate lane weight vectors via eval_run_ablation, pick best, promote cosine lane to live in lane-registry.ts |
| 005 | weight-sweep-harness | Extend scoring core with laneWeightsOverride, add runLaneWeightSweep, author 20-30 prompt corpus split today-correct vs intent-described |
| 006 | corpus-seeded-sweep | Seed cosine embeddings into lane-weight sweep test fixture, emit numbers-driven weight recommendation |
| 007 | harder-intent-corpus-resweep | Author 15-25 lexical-mis-route prompts, extend sweep test, re-run to measure cosine lane lift on harder cases |
| 008 | advisor-routing-calibration | Damp explicit/lexical lane contributions when evidence is weak, sweep damping configurations against corpora |

---

## 3. SUB-PHASE CONTROL FILE

- Active child: n/a - sub-phase children share equivalent priority
- Last completed child: n/a
- Resume entry: /spec_kit:resume honors graph-metadata.json derived.last_active_child_id; falls back to listing children.

---

## 4. WHAT NEEDS DONE (parent-level pointer)

The parent itself owns no implementation. All work lives in the children. Each child's spec.md is the source of truth for that child's scope.

**Thematic groupings:**
- Infrastructure: 011 (hook improvements), 014 (embed cache + cosine wiring)
- Semantic lane activation: 013 (semantic lane phase parent), 015 (ablation sweep + promote)
- Evaluation harness: 016 (weight sweep harness), 017 (corpus-seeded sweep)
- Stress testing and calibration: 020 (harder intent corpus), 023 (routing calibration)

---

## 5. PROVENANCE

Sub-phase directory created by packet 109 Wave 2 per 998 iter-005 classification rules. Phase-parent base files authored by packet 111 Wave 3.A (cli-devin SWE-1.6).
