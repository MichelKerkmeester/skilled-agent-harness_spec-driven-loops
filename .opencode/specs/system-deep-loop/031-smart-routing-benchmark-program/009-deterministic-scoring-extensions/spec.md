---
title: "Spec: Deterministic Scoring Extensions — Over-Activation Lane + Scenario-Loader Scope"
description: "Two CI-safe deterministic harness extensions: an identity-scoped contamination lint that unblocks generic-keyword over-activation negatives (the scoring path already exists; only the lint gate blocks it), and a scenario-loader relaxation that lets all playbook categories (not just 10--intra-routing-recall) enter Type-1 scoring when they carry gold."
trigger_phrases:
  - "over-activation lane"
  - "identity-scoped contamination lint"
  - "scenario loader scope"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/031-smart-routing-benchmark-program/009-deterministic-scoring-extensions"
    last_updated_at: "2026-07-09T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase scaffolded from fresh-Opus analysis"
    next_safe_action: "Add scope:'identity' to buildBannedVocab; relax loader regex behind gold-check"
    blockers: []
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Spec: Deterministic Scoring Extensions — Over-Activation Lane + Scenario-Loader Scope

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

## 1. METADATA
<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Packet** | 009-deterministic-scoring-extensions |
| **Level** | 2 |
| **Status** | Planned |
| **Sequencing** | Ship first among the harness-capability phases (deterministic, CI-safe); prereq for 010 |
<!-- /ANCHOR:metadata -->

## 2. PROBLEM & PURPOSE
<!-- ANCHOR:problem -->
(a) OVER-ACTIVATION: `contamination-lint.cjs:88-91` bans every intent keyword from a fixture prompt,
so a "generic keyword X over-fires in an unrelated context" negative is rejected pre-dispatch as
`contaminated-fixture` (`run-skill-benchmark.cjs:109-116`). But the negative-activation scorer already
exists (`score-skill-benchmark.cjs:172-192,234-248`), and the authoring doc already blesses an
identity-scoped lint (`scenario_authoring.md:44`) — the code just never implemented it. This is a
doc↔code gap; closing it unlocks a deterministic, CI-safe over-activation gate (the deep-research/
deep-improvement over-routing from phase 007 becomes *scorable*). (b) LOADER SCOPE:
`load-playbook-scenarios.cjs:296` filters `NNN-*.md`, so only `10--intra-routing-recall` enters Type-1
scoring; other categories are silently skipped.
<!-- /ANCHOR:problem -->

## 3. SCOPE
<!-- ANCHOR:scope -->
- Add `scope: 'full' | 'identity'` (default `'full'`, back-compat) to `buildBannedVocab`: identity
  scope bans skill-id/basename/resource-path-tokens/private-gold labels but NOT intent keywords.
- Opt fixtures into identity scope via a metadata marker; deterministic router-mode scoring flags an
  over-fire as a negativeActivation failure. Emit a `report.overActivation` summary.
- Relax the loader regex to any gold-bearing `.md` (include only if it carries `expected_intent`/
  `expected_resources` — naturally back-compat; gold-less files warn, not error).

**Out of scope:** the live lane + circularity gate (phase 010); the bulk gold-authoring for other
categories (flagged as the real cost, a per-skill follow-up).
<!-- /ANCHOR:scope -->

## 4. REQUIREMENTS
<!-- ANCHOR:requirements -->
- **R1:** All existing `buildBannedVocab` callers unchanged (default `'full'`).
- **R2:** An identity-scoped over-activation fixture reaches the scorer and fails deterministically in
  router mode when the forbidden resource leaks.
- **R3:** `10--intra-routing-recall` rows byte-identical after the loader change (no aggregate drift).
<!-- /ANCHOR:requirements -->

## 5. SUCCESS CRITERIA
<!-- ANCHOR:success-criteria -->
1. RED/GREEN vitest: identity scope drops intent keywords, retains id/basename bans.
2. RED/GREEN vitest: over-activation fixture scores deterministically (router mode, no network).
3. Loader returns gold-bearing other-category scenarios + warns on gold-less; back-compat asserted.
<!-- /ANCHOR:success-criteria -->

## 6. RISKS & DEPENDENCIES
<!-- ANCHOR:risks -->
- *Fixture-path regressions* → preserve `loadError`/`contaminated-fixture` rows verbatim; router mode
  stays default.
- *Aggregate drift from the loader* → gate inclusion on gold presence.
- Deterministic + CI-safe → no operator decision; unblocks 007 scoring and precedes 010.
<!-- /ANCHOR:risks -->

## 7. OPEN QUESTIONS
<!-- ANCHOR:questions -->
None — both changes are deterministic, back-compatible, and doc-blessed.
<!-- /ANCHOR:questions -->
