---
title: "Feature Specification: Research: improve the Jev routing clarify default (020)"
description: "Five DeepSeek V4.1 Flash and three GPT-6 Luna research iterations on how to improve, refine and expand the Jev routing clarify default, measured in feature 020 as verdict jev: keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599."
trigger_phrases:
  - "clarify default research"
  - "five deepseek v4 1 flash and three gpt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Research: improve the Jev routing clarify default (020)

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
| **Branch** | `scaffold/007-clarify-default-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 7 of 10 |
| **Predecessor** | 006-verdict-fallback-research |
| **Successor** | 008-folder-suggestion-research |
| **Handoff Criteria** | `research/research.md` ranks recommendations from both lineages |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it specification.

**Scope Boundary**: Research only. The loop writes inside this phase's `research/` folder and changes no other file.

**Dependencies**:
- The scorer `.skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs` and its phase in the parent packet, feature 020

**Deliverables**:
- `research/research.md`, merged from a DeepSeek lineage of 5 iterations and a Luna lineage of 3

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 047 measured the Jev routing clarify default at verdict jev: keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599, baseline: first alternative right on 15 of 54. Fixture corpus of 54 prompts written to tie. 34 of 54 were labeled none_of_these, and most of Jev's gain came from recognizing those. Nobody has yet asked how to make it better, more trustworthy or wider in reach.

### Purpose
A ranked, evidence-cited list of ways to improve, refine and expand this feature, ready for a later build phase to pick from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research question: Improve, refine and expand the Jev routing clarify default (cli-jev feature 020). Its scorer is .skilled/skills/sk-doc/sk-create-skill/scripts/score-clarify-default.cjs in sk-doc/sk-create-skill, and it measures the compiled router (.skilled/bin/compiled-route.cjs) that every parent hub uses, when it returns a clarify between two modes of one hub. Measured result: verdict jev: keep K=54 M=54 A=28 B=15 W=17 L=4 F=10 p=0.003599, baseline: first alternative right on 15 of 54. Fixture corpus of 54 prompts written to tie. 34 of 54 were labeled none_of_these, and most of Jev's gain came from recognizing those. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
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

- The keep is abstention-driven: 12 of Jev's 17 wins are `none_of_these` rows. On named modes Jev scores 16/20 against the baseline's 15/20, and always answering none (34/54) beats Jev (28/54).
- Replaying the 54 prompts on today's routers gives 12 clarifies, all sk-doc, and 42 direct routes. The score path never replays a row, so replay-verify every row and record the build and digests in `report.json`.
- Report by class and hub and print the always-none baseline as the bar. Shadow-log real clarifies so the user's pick becomes the label.
- Cheapest safe saving: stop after two agreeing orders (118 calls against 163, byte-equal).
- Expand per hub only, sk-doc first. Default-on needs a router seam, a reader, fail-open and payload approval in a separate phase.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


