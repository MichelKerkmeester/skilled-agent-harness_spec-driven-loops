---
title: "Feature Specification: Phase 5: DeepSeek V4.1 Flash on Devin"
description: "Devin serves a DeepSeek V4.1 Flash family that neither enforced allowlist carried, so a fan-out naming it was refused before a request was sent."
trigger_phrases:
  - "feature specification"
  - "problem statement"
  - "requirements and scope"
  - "success criteria"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: DeepSeek V4.1 Flash on Devin

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-09-15 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-gemini-3-7-flash-high |
| **Successor** | None |
| **Handoff Criteria** | Both allowlists carry the family, are byte-identical, and the three guard suites pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This parent adds one model family to the Devin roster per child. Phase 2 added the DeepSeek V4
Flash max tier. Cognition has since released a separate DeepSeek V4.1 Flash family, which the live
CLI reports as two tiers rather than one.

The gap surfaced from use rather than from an audit. The operator asked for a crawl on DeepSeek
V4.1 Flash Max through `cli-devin`. A direct `devin -p` call ran, because a direct call does not
consult the repository's allowlist. A fan-out naming the same id would have been refused.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

**Problem.** `DEVIN_SUPPORTED_MODELS` and its hand-duplicated mirror `DEVIN_ALLOWED_MODELS` carried
no DeepSeek V4.1 id. The allowlist is fail-closed, so the fan-out refuses an id it does not hold.
A model the operator can reach by hand was unreachable through the loop that is supposed to wrap it.

**Purpose.** Make the enforced lists say what the CLI serves, so the two agree.

**A second defect surfaced in the same run.** The skill tells a caller to use `auto` for read-only
research. Under `auto` the dispatch refused its own shell call, reported almost nothing and exited
zero, which is the silent-failure shape the skill warns about one paragraph earlier for a different
mode. The guidance needed the same warning.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope**

- `deepseek-v4-1-flash-high` and `deepseek-v4-1-flash-max` in both enforced lists, sorted.
- The fan-out fixture that walks the whole Devin roster, plus an assertion binding it to the source.
- The permission-mode guidance in the skill, which now names what `auto` refuses.

**Out of scope**

- The default model. It stays where its own lane put it, and V4.1 prices higher on output than V4
  Flash, so it is a deliberate choice rather than a drop-in default.
- The roster table and the GLM-5.3 rows, landed by the session that owns that lane while this one
  ran. This child records the collision rather than claiming the rows.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement |
|----|-------------|
| REQ-001 | Both tiers appear in `DEVIN_SUPPORTED_MODELS`, sorted, with no duplicate |
| REQ-002 | `DEVIN_ALLOWED_MODELS` stays byte-identical to the source array |
| REQ-003 | The fan-out fixture exercises every id on the list and fails if the two diverge |
| REQ-004 | Each id carries an honest verification claim: dispatch-tested or list-verified only |
| REQ-005 | The permission-mode guidance names what `auto` refuses and what it costs |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The executor-config, fan-out and combo-matrix suites pass together from the final state.
- The two lists hold the same ids in the same order.
- A fan-out lineage naming `deepseek-v4-1-flash-max` builds a command instead of being refused.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Mitigation |
|------|------------|
| A concurrent session edits the same arrays and the two inserts duplicate | Observed and repaired here. Both lists were deduplicated and sorted, then asserted equal |
| An id is added that the service does not serve | Both were read from live `devin models list` output, and the max tier also returned a live response |
| The fixture drifts from the source as ids are added | The fixture now asserts equality with the source array rather than restating it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---


