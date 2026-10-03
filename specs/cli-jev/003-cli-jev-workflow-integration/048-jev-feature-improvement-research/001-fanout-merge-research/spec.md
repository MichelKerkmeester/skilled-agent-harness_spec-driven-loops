---
title: "Feature Specification: Research: improve the Jev fan-out merge (030)"
description: "Five DeepSeek V4.1 Flash and three GPT-6 Luna research iterations on how to improve, refine and expand the Jev fan-out merge, measured in feature 030 as verdict jev: keep K=60 M=60 A=53 B=12 W=44 L=3 F=3 p=1.232e-10 on 60 recorded fan-out pairs labeled by a delegated arbiter."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Research: improve the Jev fan-out merge (030)

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-02 |
| **Branch** | `scaffold/001-fanout-merge-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 10 |
| **Predecessor** | None |
| **Successor** | 002-track-narrowing-research |
| **Handoff Criteria** | `research/research.md` ranks recommendations from both lineages |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it specification.

**Scope Boundary**: Research only. The loop writes inside this phase's `research/` folder and changes no other file.

**Dependencies**:
- The scorer `.skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs` and its phase in the parent packet, feature 030

**Deliverables**:
- `research/research.md`, merged from a DeepSeek lineage of 5 iterations and a Luna lineage of 3

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 047 measured the Jev fan-out merge at verdict jev: keep K=60 M=60 A=53 B=12 W=44 L=3 F=3 p=1.232e-10 on 60 recorded fan-out pairs labeled by a delegated arbiter. Real data and the largest win measured. The merge's own rule was right only on the 12 pairs labeled different. Nobody has yet asked how to make it better, more trustworthy or wider in reach.

### Purpose
A ranked, evidence-cited list of ways to improve, refine and expand this feature, ready for a later build phase to pick from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research question: Improve, refine and expand the Jev fan-out merge (cli-jev feature 030). Its scorer is .skilled/skills/system-deep-loop/runtime/scripts/score-fanout-pairs.cjs in system-deep-loop, and it measures the merge step of /deep:research and /deep:review fan-out runs, which decides whether two findings from parallel lineages are the same finding (fanout-merge.cjs and the fan-out runner in .skilled/skills/system-deep-loop/runtime/scripts/). Measured result: verdict jev: keep K=60 M=60 A=53 B=12 W=44 L=3 F=3 p=1.232e-10 on 60 recorded fan-out pairs labeled by a delegated arbiter. Real data and the largest win measured. The merge's own rule was right only on the 12 pairs labeled different. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
- A DeepSeek V4.1 Flash lineage (max effort, cli-pi) of 5 iterations and a GPT-6 Luna lineage (max effort, fast tier, cli-codex) of 3
- `research/research.md` with ranked recommendations

### Out of Scope
- Changing any scorer or live workflow - this phase researches only
- Re-measuring the feature - phase 047 owns the measurement

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `research/` in this phase | Create | Lineage state, iterations and the merged `research.md` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages run to their iteration cap | `research/lineages/deepseek` holds 5 iteration records and `research/lineages/luna` holds 3 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Every recommendation cites file:line evidence or the measured result | Read `research/research.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with ranked recommendations
- **SC-002**: Each lineage's state log holds its full iteration count
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | DeepSeek through llmgateway, Luna through Codex | A lineage stops early | Record the stop and its iteration count in the goal log |
| Risk | Luna's usage limit | Med | Luna runs only 3 iterations per feature |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The operator set the executors and iteration counts on 2026-10-03.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
Research findings from `research/research.md` (deepseek 5 iterations, luna 3):

- The keep rests on a blind baseline. Every labeled pair is cross-body and the merge answers "different" on all of them, so B=12 is a constant guess. Against constant-same (48/60) the margin gate fails.
- Cheapest win: stop after two agreeing orders (58/60 agree) and use a symmetric tiebreak, cutting about a third of the calls with no verdict change.
- Make the verdict self-describing: label digest, scorer hash, per-pair oracle decision and disclosed dropouts in `report.json`.
- Strengthen the gold: second rater on the different class, re-adjudicate 3 contested pairs, hold out whole runs.
- Default-on path: zero-call census now, shadow with a named reader next, model-as-collapse stays dropped. Best expansion is the merge's own exact-id question and ruled-out streams.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


