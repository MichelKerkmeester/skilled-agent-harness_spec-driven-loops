---
title: "Feature Specification: Research: improve the Jev Pi native classifier transport (037)"
description: "Five DeepSeek V4.1 Flash and three GPT-6 Luna research iterations on how to improve, refine and expand the Jev Pi native classifier transport, measured in feature 037 as verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Research: improve the Jev Pi native classifier transport (037)

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
| **Branch** | `scaffold/009-pi-transport-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 10 |
| **Predecessor** | 008-folder-suggestion-research |
| **Successor** | 010-completion-claims-research |
| **Handoff Criteria** | `research/research.md` ranks recommendations from both lineages |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Five DeepSeek iterations per kept Jev feature on how to improve, refine and expand it specification.

**Scope Boundary**: Research only. The loop writes inside this phase's `research/` folder and changes no other file.

**Dependencies**:
- The scorer `.skilled/skills/cli-classifier/benchmark/pi-transport/score-pi-transport.mjs`, the transport adapter `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`, and its phase in the parent packet, feature 037

**Deliverables**:
- `research/research.md`, merged from a DeepSeek lineage of 5 iterations and a Luna lineage of 3

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 037 measured the Jev Pi native classifier transport at verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022. Shipped as an opt-in transport in phase 038. Only two callers use it, and only for choice questions. Nobody has yet asked how to make it better, more trustworthy or wider in reach.

### Purpose
A ranked, evidence-cited list of ways to improve, refine and expand this feature, ready for a later build phase to pick from.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The research question: Improve, refine and expand the Jev Pi native classifier transport (cli-jev feature 037). Its scorer is .skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs in cli-classifier, and it measures how Jev choice questions reach the model: through the jev CLI or through Pi's native classify(); score-clarify-default.cjs and leaf-route-replay.cjs import the transport, off while JEV_TRANSPORT is unset. Measured result: verdict pi-transport: adopt K=111 M=111 coverage=100.0 agreement=95.5 median_abs_dp=0.0100 p95_ms=340/387 cost_per_100=0.0022. Shipped as an opt-in transport in phase 038. Only two callers use it, and only for choice questions. Answer five questions with file:line evidence: what drove this result, how to raise its accuracy or lower its cost, how to make the measurement more trustworthy, where else in .skilled the same judgment would pay off, and what a default-on integration would need, cost and risk.
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

- The adopt is one row from failing (106 of 111 agree, 95 needed) and measures parity with the CLI, not correctness. The CLI arm was a day older and used a different provider.
- All five disagreements are near-ties. Serving Pi only where its margin is at least 0.10 and deferring the rest to the CLI would agree on 110 while Pi still answers 104.
- The adapter drops `--provider` and pins OpenRouter `typesafe/jev-1.13`, and a per-call option outranks the `JEV_TRANSPORT` kill switch. Fix both before any wider use.
- Repair the measurement first: a same-day paired run, stored usage and prompt digests, labels on the 12 ambiguous rows, and three rotations kept.
- Adopt in `choice` harnesses one owner at a time, `score-suggested-order` first. Default-on only as a monitored `auto` mode.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---


