---
title: "Feature Specification: Research: improve the Jev reviewer verdict fallback (025)"
description: "Five DeepSeek V4.1 Flash and three GPT-6 Luna research iterations on how to improve, refine and expand the Jev reviewer verdict fallback, measured in feature 025 as verdict jev: keep K=24 M=24 A=24 B=8 W=16 L=0 F=0 p_win=0.00001526."
trigger_phrases:
  - "verdict fallback research"
  - "five deepseek v4 1 flash and three gpt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Research: improve the Jev reviewer verdict fallback (025)

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
| **Branch** | `scaffold/006-verdict-fallback-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 10 |
| **Predecessor** | 005-hallucination-grader-research |
| **Successor** | 007-clarify-default-research |
| **Handoff Criteria** | `research/research.md` ranks recommendations from both lineages |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it specification.

**Scope Boundary**: Research only. The loop writes inside this phase's `research/` folder and changes no other file.

**Dependencies**:
- The scorer `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs` and its phase in the parent packet, feature 025

**Deliverables**:
- `research/research.md`, merged from a DeepSeek lineage of 5 iterations and a Luna lineage of 3

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 047 measured the Jev reviewer verdict fallback at verdict jev: keep K=24 M=24 A=24 B=8 W=16 L=0 F=0 p_win=0.00001526, baselines: majority 8 of 24, loose 0 of 24. Fixture corpus of 24 reviewer reports written so the regex misses every one. Real reviewers rarely write verdicts the regex misses. Nobody has yet asked how to make it better, more trustworthy or wider in reach.

### Purpose
A ranked, evidence-cited list of ways to improve, refine and expand this feature, ready for a later build phase to pick from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research question: Improve, refine and expand the Jev reviewer verdict fallback (cli-jev feature 025). Its scorer is .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs in system-deep-loop/deep-improvement, and it measures the reviewer scorer's deterministic verdict regex (extractVerdict) in the model-benchmark reviewer-regression profile; Jev answers only when the regex finds no verdict. Measured result: verdict jev: keep K=24 M=24 A=24 B=8 W=16 L=0 F=0 p_win=0.00001526, baselines: majority 8 of 24, loose 0 of 24. Fixture corpus of 24 reviewer reports written so the regex misses every one. Real reviewers rarely write verdicts the regex misses. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
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

- The keep is a perfect 24/24 on reports written so the regex misses them; the 8/8/8 label split fixes the majority baseline at 8, and the shipped fixtures never miss.
- Natural miss prevalence is unmeasured. Capture reviewer outputs and run the zero-call census before anything else.
- The regex misses plausible real forms such as `**VERDICT: FAIL**` and `Final verdict: pass`. Prefer a typed producer verdict, then widen only where natural misses show it.
- Serve one call per miss (all three orders agreed on every row) and add an abstain outcome so no-decision text is never forced into `BLOCK`.
- Best expansion: the reviewer scorer's grader slot, then residue-flagger severity.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


