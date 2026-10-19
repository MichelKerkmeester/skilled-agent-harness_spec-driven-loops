---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Round 2, building on round 1 (archived at specs/sk-code/019-surface-consistency-research/research_archive/20261019T081751Z; read its research.md first, especially §7 target layout, §8 gaps, §9 migration). Three questions: (Q1) Doctor alignment: what /doctor:sk-code (.skilled/commands/doctor/sk-code.md, assets/doctor-sk-code-setup.yaml, scripts/sk-code-setup-check.cjs and its legs, parent-skill-check.cjs) checks today, and what legs or checks should be added so the doctor enforces the shared surface contract from round 1 (section order, workflow-link trio, assets/checklists home, no flat topical references, version/changelog match, no surface graph-metadata.json) — name exact files, functions and new leg ids, and how each fails with a repair command. (Q2) A hub-level base architecture for creating a new sk-code mode/surface: what a new surface must touch today (mode-registry.json, hub-router.json, ROUTER.md, hub SKILL.md RESOURCE_MAP union, leaf-manifest.json, compiled route, shared/references/stack-detection.md and phase-detection.md, the advisor plugin surface detection in .opencode/plugins/system-skill-advisor.js, verify-router-sync.cjs which hard-codes SURFACES at line 33, parent-skill-check, playbooks, hermes mirror), and design a scaffold under the sk-code hub (e.g. shared/assets/surface-scaffold/ or similar) with template SKILL.md/README/references tree/§2b smart-routing block, plus a checklist or script that registers the new surface in every place; compare with the sk-doc create-skill canon (.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/scaffold/hub-skill-scaffold.md, packet-skill-scaffold.md) and say whether the scaffold belongs in sk-code or should extend sk-create-skill. (Q3) Routing optimization: remove hard-coded surface lists (verify-router-sync.cjs SURFACES, the skilled/webflow union comments, any other) in favour of deriving surfaces from mode-registry.json packetKind: surface; check how intent signals, DEFAULT_RESOURCE and load tiers differ across the three §2b blocks and recommend one shape; check compiled-route and advisor surface-hint behaviour for all three surfaces. Deliver per question: findings with path:line evidence, a recommendation, and ordered remediation steps with the check that guards each, ready to be appended as steps 8+ to round 1's 7-step plan. Make research.md self-contained: summarize round 1 briefly and cite its archived path.
- Started: 2026-10-19T08:18:18.987Z
- Status: INITIALIZED
- Iteration: 3 of 3
- Session ID: 2026-10-19T08:18:18.987Z
- Parent Session: 2026-10-19T06:41:00.693Z
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: doctor alignment. | - | 0.72 | 0 | insight |
| 2 | Q2: What must a new sk-code surface touch today, and what hub-level scaffold plus registration checklist or script should create one; does it belong in sk-code or in sk-create-skill? | - | 0.68 | 0 | insight |
| 3 | Q3: How should hard-coded surface lists be replaced by derivation from mode-registry.json packetKind: surface, and what single shape should the three §2b blocks (intent signals, DEFAULT_RESOURCE, load tiers) share, given compiled-route and advisor surface-hint behaviour? | - | 0.72 | 0 | insight |

- iterationsCompleted: 3
- keyFindings: 27
- openQuestions: 0
- resolvedQuestions: 3

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 3/3
- [x] Q1: What does /doctor:sk-code check today, and which new legs or checks (exact files, functions, leg ids, failure text and repair command) would enforce the round-1 shared surface contract?
- [x] Q2: What must a new sk-code surface touch today, and what hub-level scaffold plus registration checklist or script should create one; does it belong in sk-code or in sk-create-skill?
- [x] Q3: How should hard-coded surface lists be replaced by derivation from mode-registry.json packetKind: surface, and what single shape should the three §2b blocks (intent signals, DEFAULT_RESOURCE, load tiers) share, given compiled-route and advisor surface-hint behaviour?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▆▅▄▄▃▂▁▁▂▃▄▄▅▆▇▇█
- score sparkline: █▇▇▆▅▄▄▃▂▁▁▂▃▄▄▅▆▇▇█
- Last 3 ratios: 0.72 -> 0.68 -> 0.72
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.72
- coverageBySources: {"other":10}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
