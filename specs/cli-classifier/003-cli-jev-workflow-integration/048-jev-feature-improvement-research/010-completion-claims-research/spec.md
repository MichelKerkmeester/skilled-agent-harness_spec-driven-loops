---
title: "Feature Specification: Research: improve the Jev completion-claim audit (026)"
description: "Five DeepSeek V4.1 Flash and three GPT-6 Luna research iterations on how to improve, refine and expand the Jev completion-claim audit, measured in feature 026 as verdict jev: stop (margin) K=110 M=110 A=102 B=93 W=13 L=4 F=0 p_win=0.02452."
trigger_phrases:
  - "completion claims research"
  - "five deepseek v4 1 flash and three gpt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Research: improve the Jev completion-claim audit (026)

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
| **Branch** | `scaffold/010-completion-claims-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-pi-transport-research |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` ranks recommendations from both lineages |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it specification.

**Scope Boundary**: Research only. The loop writes inside this phase's `research/` folder and changes no other file.

**Dependencies**:
- The scorer `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` and its phase in the parent packet, feature 026

**Deliverables**:
- `research/research.md`, merged from a DeepSeek lineage of 5 iterations and a Luna lineage of 3

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 047 measured the Jev completion-claim audit at verdict jev: stop (margin) K=110 M=110 A=102 B=93 W=13 L=4 F=0 p_win=0.02452. Real data: 50 Pi turns and 60 Claude turns. The win is significant but its 0.08 gain falls under the 0.10 margin. The regex missed all 10 labeled claims. Nobody has yet asked how to make it better, more trustworthy or wider in reach.

### Purpose
A ranked, evidence-cited list of ways to improve, refine and expand this feature, ready for a later build phase to pick from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research question: Improve, refine and expand the Jev completion-claim audit (cli-jev feature 026). Its scorer is .skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs in system-spec-kit, and it measures the completion sentinel's detectCompletionClaim regex, which decides whether an agent's last 400 characters claim the work is done. Measured result: verdict jev: stop (margin) K=110 M=110 A=102 B=93 W=13 L=4 F=0 p_win=0.02452. Real data: 50 Pi turns and 60 Claude turns. The win is significant but its 0.08 gain falls under the 0.10 margin. The regex missed all 10 labeled claims. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
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

- The stop is a margin miss: Jev scores 102 against the regex's 93 and needs an 11-row lead. The regex has zero recall and zero precision here (0 of 10 claims, 7 false fires).
- Two free regex fixes: anchor to the closing ~160 characters (false fires 7 to 3) and add `complete` (3 of 10 claims, no new false fire).
- All 10 positives are Claude turns. Rebuild the corpus with Pi positives, two labelers and a holdout, and pre-register the 0.7 judge threshold that passes only post-hoc.
- Scorer repairs: reject duplicate IDs, fix whole-word attribution, correct the `labels-happy` fixture. Wire the unwired Cursor adapter.
- Keep the judge offline or in shadow. Pi advisory visibility must be settled before any privacy claim.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


