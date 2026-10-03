---
title: "Feature Specification: Research: improve the Jev fetched-text injection screen (035)"
description: "Five DeepSeek V4.1 Flash and three GPT-6 Luna research iterations on how to improve, refine and expand the Jev fetched-text injection screen, measured in feature 035 as verdict jev: keep K=90 M=90 A=81 B=56 W=30 L=5 TP=31 FP=5 F=0 p=0.00001118."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Research: improve the Jev fetched-text injection screen (035)

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
| **Branch** | `scaffold/004-injection-screen-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 10 |
| **Predecessor** | 003-citation-drift-research |
| **Successor** | 005-hallucination-grader-research |
| **Handoff Criteria** | `research/research.md` ranks recommendations from both lineages |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it specification.

**Scope Boundary**: Research only. The loop writes inside this phase's `research/` folder and changes no other file.

**Dependencies**:
- The scorer `.skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs` and its phase in the parent packet, feature 035

**Deliverables**:
- `research/research.md`, merged from a DeepSeek lineage of 5 iterations and a Luna lineage of 3

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 047 measured the Jev fetched-text injection screen at verdict jev: keep K=90 M=90 A=81 B=56 W=30 L=5 TP=31 FP=5 F=0 p=0.00001118, brier 0.0652. 60 natural rows plus 30 planted injection sentences. The lexical screen caught 1 of 30 planted sentences. Nobody has yet asked how to make it better, more trustworthy or wider in reach.

### Purpose
A ranked, evidence-cited list of ways to improve, refine and expand this feature, ready for a later build phase to pick from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research question: Improve, refine and expand the Jev fetched-text injection screen (cli-jev feature 035). Its scorer is .skilled/skills/cli-classifier/benchmark/injection-screen/score-injection-screen.mjs in cli-classifier, and it measures text agents fetch with WebFetch or WebSearch, which nothing screens today; the comparator is a four-pattern lexical screen. Measured result: verdict jev: keep K=90 M=90 A=81 B=56 W=30 L=5 TP=31 FP=5 F=0 p=0.00001118, brier 0.0652. 60 natural rows plus 30 planted injection sentences. The lexical screen caught 1 of 30 planted sentences. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
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

- The keep is strong on a fixed public mixture (81/90 against a lexical screen at 56) but unmeasured on real fetched pages.
- A 0.6 flag line would score 84/90 at precision 0.968, and the first two calls agree on all 90 rows, so a two-call protocol cuts a third of the calls.
- The corpus was untracked by `b0f89ee5f07`, so a fresh draw fails. Restore it and hash the label files before any new run.
- Default-on needs a tested adapter at each host's fetch boundary, advisory first, and a privacy decision before live text leaves the machine.
- Best expansion: Bash and MCP tool output, after repairing the fetch census.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


