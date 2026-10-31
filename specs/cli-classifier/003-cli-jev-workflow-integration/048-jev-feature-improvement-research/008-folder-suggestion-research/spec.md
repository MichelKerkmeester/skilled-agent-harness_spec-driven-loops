---
title: "Feature Specification: Research: improve the Jev spec-folder suggestion (022)"
description: "Five DeepSeek V4.1 Flash and three GPT-6 Luna research iterations on how to improve, refine and expand the Jev spec-folder suggestion, measured in feature 022 as verdict jev: keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top."
trigger_phrases:
  - "folder suggestion research"
  - "five deepseek v4 1 flash and three gpt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Research: improve the Jev spec-folder suggestion (022)

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
| **Branch** | `scaffold/008-folder-suggestion-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 8 of 10 |
| **Predecessor** | 007-clarify-default-research |
| **Successor** | 009-pi-transport-research |
| **Handoff Criteria** | `research/research.md` ranks recommendations from both lineages |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 8** of the Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it specification.

**Scope Boundary**: Research only. The loop writes inside this phase's `research/` folder and changes no other file.

**Dependencies**:
- The scorer `.skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts` and its phase in the parent packet, feature 022

**Deliverables**:
- `research/research.md`, merged from a DeepSeek lineage of 5 iterations and a Luna lineage of 3

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 047 measured the Jev spec-folder suggestion at verdict jev: keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top, target right 0 of 40. Fixture corpus of 40 rows from real spec folders. The fixture's own target was wrong on every row, so the result compares Jev with the top alternative only. Nobody has yet asked how to make it better, more trustworthy or wider in reach.

### Purpose
A ranked, evidence-cited list of ways to improve, refine and expand this feature, ready for a later build phase to pick from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research question: Improve, refine and expand the Jev spec-folder suggestion (cli-jev feature 022). Its scorer is .skilled/skills/system-spec-kit/runtime/cli/evals/score-alignment-suggestion.ts in system-spec-kit, and it measures the spec-folder alignment check on saves (validateContentAlignment and validateFolderAlignment), when it flags a low match and lists other folders. Measured result: verdict jev: keep K=40 M=40 A=39 B=30 W=10 L=1 F=0 p=0.0059 baseline=top, target right 0 of 40. Fixture corpus of 40 rows from real spec folders. The fixture's own target was wrong on every row, so the result compares Jev with the top alternative only. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
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

- The keep beats the top-listed alternative (39 against 30), not the target, which the fixture made wrong on all 40 rows. The baseline is chosen on the same labels it is scored against.
- The one loss is likely a description collision: `001-deep-research` exists in 9 places, so the right option was the only one shown without a description. Path-resolve descriptions first.
- Measure candidate recall before chooser accuracy (at most three candidates are offered) and score content and folder saves separately.
- Rebuild the corpus from real low-match saves with final destinations and label provenance; gating passes 2 and 3 on confidence would cut 120 calls to 70.
- Any served form is a flag-gated, confirmed suggestion on interactive data saves, after an amendment to 047 D6.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


