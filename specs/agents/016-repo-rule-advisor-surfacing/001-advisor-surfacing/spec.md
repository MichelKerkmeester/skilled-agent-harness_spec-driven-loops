---
title: "Feature Specification: Repo rule surfacing through the advisor"
description: "Repo rules load only at Gate 5 on the first write, and their trigger phrases are read by nothing. Decide from repository evidence whether the skill advisor, the trigger index or an action-keyed hook should surface and suggest them, and at what context cost."
trigger_phrases:
  - "repo rule advisor"
  - "suggest repo rules"
  - "surface repo rules"
  - "advisor repo rule pointer"
  - "repo rules trigger index"
  - "action keyed rule nudge"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Repo rule surfacing through the advisor

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-04 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | None |
| **Successor** | `../002-rule-concision-and-loading/spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Repo rules in `.skilled/repo-rules/` reach the model through one door: Gate 5, which fires on the first write of a session and asks the model to match its action against the `REPO RULES.md` trigger table. Read-only turns never open that door, later actions in a long session depend on the model re-consulting the table unprompted, and each rule's `trigger_phrases` frontmatter is read by no retrieval surface today. The operator asked whether `system-skill-advisor` should also support and suggest repo rules, provided it does not add context the model does not need.

### Purpose
A research verdict, grounded in this repository, on which surface (if any) should surface repo rules, what it would emit, when it stays silent, and what it costs in context per turn.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A four-iteration deep-research run on two `cli-devin` lineages, `swe-2-max` and `deepseek-v4-1-flash-max`, writing only under `research/`.
- Evaluating at least three candidate surfaces: an advisor brief pointer, adding `.skilled/repo-rules` to the trigger-index corpus, and an action-keyed PreToolUse advisory. Other candidates the evidence raises are in scope.
- A synthesized `research/research.md` with a verdict, a silence condition for any admitted surface, and the ruled-out directions.

### Out of Scope
- Implementing any surface - this packet decides; a later packet builds.
- Rewriting rule content or the `REPO RULES.md` trigger table - rule authoring belongs to `sk-doc`'s repo-rule mode.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing/research/` | Create | Deep-research state, iterations and synthesis |
| `specs/agents/016-repo-rule-advisor-surfacing/001-advisor-surfacing/spec.md` | Modify | Generated findings block after synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages complete four iterations each | Four iteration files per lineage on disk under `research/lineages/` |
| REQ-002 | Every load-bearing claim cites a resolvable `file:line` | Spot-check of cited paths in the synthesis resolves |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Any admitted surface names its silence condition and per-turn context cost | Stated in `research/research.md` |
| REQ-004 | Disagreements between the two lineages are reported, not averaged | Named in the synthesis with the evidence each side used |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` gives one recommended path, or a refusal with the test that decided it.
- **SC-002**: The ruled-out directions are recorded with their deciding evidence.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Devin CLI auth and model quota | Lineage fails mid-run | Runner retries; a failed lineage is reported as a finding |
| Risk | The two lineages restate the brief instead of reading the repo | Med | Brief carries paths and the open question, not a preferred answer |
| Risk | A lineage writes outside `research/` | Low | Fan-out write containment records and quarantines out-of-scope writes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should `system-skill-advisor` surface or suggest repo rules, and if so in what form?
- Is the trigger-index corpus, a PreToolUse action-keyed advisory, or no new surface the better carrier?
- What silence condition keeps any admitted surface off most turns?

### Research Context
Deep research ran for this topic. `research/research.md` is the canonical source of findings; this section receives only a generated summary block.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
- **Verdict:** do not teach the skill advisor about repo rules, and do not add `.skilled/repo-rules` to the trigger index. Both lineages refused both, and the trigger-index exclusion is already a recorded, test-enforced decision in `retrieval-conventions.md` §9.
- **The only admissible family** is an action-keyed PreToolUse advisory. The lineages split on timing: `deepseek-v4-1-flash-max` would build a per-action classifier now; `swe-2-max` admits only a once-per-session Gate 5 reminder and only after a measured miss rate.
- **Next step:** a logging-only observer that records whether `REPO RULES.md` was read before the first write, at zero context cost, to supply the miss rate neither lineage could find.
- **Authoring-time gap:** `check-repo-rules.cjs` never compares a trigger row with its rule's Fires-when list.
<!-- END GENERATED: deep-research/spec-findings -->
<!-- /ANCHOR:questions -->

---
