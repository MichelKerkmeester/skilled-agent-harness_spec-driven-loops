---
title: "Feature Specification: Research: improve the Jev hallucination grader (024)"
description: "Five DeepSeek V4.1 Flash and three GPT-6 Luna research iterations on how to improve, refine and expand the Jev hallucination grader, measured in feature 024 as verdict jev: keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Research: improve the Jev hallucination grader (024)

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
| **Branch** | `scaffold/005-hallucination-grader-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 10 |
| **Predecessor** | 004-injection-screen-research |
| **Successor** | 006-verdict-fallback-research |
| **Handoff Criteria** | `research/research.md` ranks recommendations from both lineages |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it specification.

**Scope Boundary**: Research only. The loop writes inside this phase's `research/` folder and changes no other file.

**Dependencies**:
- The scorer `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` and its phase in the parent packet, feature 024

**Deliverables**:
- `research/research.md`, merged from a DeepSeek lineage of 5 iterations and a Luna lineage of 3

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 047 measured the Jev hallucination grader at verdict jev: keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906, baselines: majority 47 of 56, deterministic check 22 of 56. Fixture corpus. 42 honest DeepSeek answers held 0 invented names, so all 9 hallucinations came from 14 deliberately careless answers. Nobody has yet asked how to make it better, more trustworthy or wider in reach.

### Purpose
A ranked, evidence-cited list of ways to improve, refine and expand this feature, ready for a later build phase to pick from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research question: Improve, refine and expand the Jev hallucination grader (cli-jev feature 024). Its scorer is .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs in system-deep-loop/deep-improvement, and it measures the D4 hallucination dimension of the model-benchmark 5-dimension scorer, run today by deterministic/hallucination-flag.cjs; run-benchmark.cjs already accepts --grader noop|mock|llm. Measured result: verdict jev: keep K=56 M=56 A=55 B=47 W=8 L=0 F=1 p_win=0.003906, baselines: majority 47 of 56, deterministic check 22 of 56. Fixture corpus. 42 honest DeepSeek answers held 0 invented names, so all 9 hallucinations came from 14 deliberately careless answers. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
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

- The keep is real (55/56) but the baseline collapsed to majority-only: none of the 21 fixtures carries an allowlist, so the deterministic check flags the tasks' own names.
- First fixes: populate fixture allowlists, give grader failure an unmeasured state instead of a 0.0 score, and forward task, spec and allowlist into the shipped D4 path.
- The low-confidence escalation module exists but the 5-dimension adapter never calls it.
- Trust: second rater on the 9 positives, per-class intervals, and compare the labels SHA on requalify.
- Best expansion: deep-review findings and deep-research claim links, routed once through the classifier hub.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


