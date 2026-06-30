---
title: "D6 — Corpus Ports (designer-skills-main)"
description: "Port the genuinely new designer-skills-main corpus patterns into the design-enforcement build — one phase per recommendation, D6-R1..R11."
trigger_phrases:
  - "d6 corpus ports build"
  - "designer-skills-main port phases"
  - "design corpus expansion backlog"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "design/008-sk-design-parent/039-design-enforcement-build/006-d6-corpus-ports"
    last_updated_at: "2026-06-30T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Documented D6 corpus ports phase parent"
    next_safe_action: "Execute child phases under this parent"
    blockers: []
    key_files:
      - "spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-parent-154-039-d6-corpus-ports"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v1.0 -->
# D6 — Corpus Ports (designer-skills-main)

## 1. PURPOSE
The designer-skills-main corpus contributed exactly one genuinely new portable pattern: **command-as-workflow-recipe** — typed `argumentGrammar`, ordered named-skill `choreography[]`, and explicit `nextOptions[]` ("commands are workflows - verbs / skills run underneath them"). Everything else is an enforceable field *shape* over a topic D1–D5 already cover (interaction state, rationale, a11y, readability, locale, naming) — incremental hardening, not discovery. Each recommendation is scaffolded as one planned phase; several do not stand alone but **FEED** existing dimensions (D2 command surface, D3 routing/scorer, D4 audit, D1 craft).

## 2. RECOMMENDATIONS (one phase each)

| Phase folder | ID | Title | Sev | Class | Feeds |
|--------------|----|-------|-----|-------|-------|
| 001-command-recipe-projection | D6-R1 | Command-surface projection layer (typed `argumentGrammar` + `choreography[]`) | P1 | enforceable | D2 |
| 002-command-recipe-scorer-cap | D6-R2 | `commandRecipe` scorer adapter capping D2/D3 for invalid recipes | P1 | enforceable | D3 |
| 003-lane-c-craft-stress-fixtures | D6-R3 | Lane C craft-stress fixtures (stateful-upload, dense-dashboard, locale) | P1 | enforceable | D3 |
| 004-interaction-state-matrix | D6-R4 | `INTERACTION STATE MATRIX` conditional proof lane | P1 | hybrid | D1 |
| 005-decision-rationale-lane | D6-R5 | `DECISION RATIONALE` proof lane (options/trade-offs/validation) | P1 | hybrid | D3 |
| 006-accessibility-coverage-matrix | D6-R6 | `ACCESSIBILITY COVERAGE` sub-object under AUDIT EVIDENCE | P1 | hybrid | D4 |
| 007-next-options-handoff-grammar | D6-R7 | `nextOptions[]` + handoff status grammar (no silent chain) | P2 | enforceable | D2 |
| 008-command-surface-check | D6-R8 | `design-command-surface-check` structural drift audit | P2 | enforceable | D2/D3 |
| 009-observation-problem-fix-triad | D6-R9 | Observation/Problem/Fix finding triad in the audit schema | P2 | enforceable | D4 |
| 010-readability-density-locale-proof | D6-R10 | `READABILITY AND DENSITY PROOF` + `LOCALE STRESS PROOF` fields | P2 | hybrid | D1 |
| 011-naming-lint-doc-completeness | D6-R11 | `NAMING LINT` + `DOC COMPLETENESS` design-system artifact contract | P2 | enforceable | D4 |

## 3. NET ASSESSMENT
Partly justified. **D6-R1 (command-recipe projection) plus D6-R2 (its scorer/cap) are the highest-value ports** — they convert D2 argument grammar and D3 utilization from prose into a checkable schema with no impeccable precedent. The remaining craft lanes (R3–R6, R9–R11) mostly add enforceable field *shapes* over topics impeccable already covers (state / i18n / a11y), so they are incremental hardening rather than discovery. Source caveat: research iterations 037/038/045 re-mined the nine-plugin angle three times (~0.74 newInfoRatio is inflated) — roughly 2 of 5 D6 passes were redundant.

## 4. SEQUENCING
Most D6 items merge **INTO** existing dimensions rather than building standalone: R1/R7/R8 → D2, R2/R3/R5 → D3, R6/R9/R11 → D4, R4/R10 → D1. They can be folded into those dimensions' execution. Sequence **after the cross-cutting spine** (the shared selection/loading/firing/survival mechanism) lands — R1's `command-metadata.json` and R2's scorer cap depend on the parseable router projection and gated scorer already being in place.

## 5. RELATED
- Source: [[044-design-routing-and-integration-research]] research.md §9
