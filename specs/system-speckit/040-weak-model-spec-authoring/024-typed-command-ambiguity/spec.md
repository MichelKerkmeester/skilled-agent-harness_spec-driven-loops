---
title: "Feature Specification: Phase 24: typed-command-ambiguity"
description: "A typed /deep:research :auto prompt routes to system-deep-loop, but the advisor still reports it as ambiguous with system-spec-kit, because the graph seed bound holds spec-kit only one millionth below and both confidences tie. This phase stops reporting that held pair as ambiguous."
trigger_phrases:
  - "typed command ambiguity"
  - "phase 24 typed command ambiguity"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 24: typed-command-ambiguity

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-10-27 |
| **Branch** | `worktrees/217-weak-model-spec-authoring` |
| **Parent Spec** | ../spec.md |
| **Phase** | 24 of 24 |
| **Predecessor** | 023-deep-review-remediation |
| **Successor** | None |
| **Handoff Criteria** | Every row of `acceptance-criteria.md` is Met and `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 24** of packet 054. It follows up the graph seed bound phase 22 added.

**Scope Boundary**: the advisor's ambiguity cluster and the fields that carry it to the brief. Scores and the order of skills do not change.

**Dependencies**:
- The seed bound in `fusion.ts` (`boundGraphSupportBySeed`), from phase 22.

**Deliverables**:
- A recommendation records which typed-command seed held it down, the ambiguity check leaves that pair out, and a test proves both.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A typed `/deep:research :auto` prompt ranks system-deep-loop first only because the seed bound caps system-spec-kit one millionth below it. The ambiguity check clusters any two skills within 0.05 on score or on confidence, and both skills read 0.8235 confidence, so the brief reports the pair as ambiguous although the user named the command.

### Purpose
When a skill sits below a typed command's owner only because the seed bound held it there, the advisor reports the owner without an ambiguity flag.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"Run /deep:research :auto --max-iterations=8 on the routing packet"}' --format json
ambiguous: true
system-deep-loop 0.564694
system-spec-kit 0.564693
$ sed -n '7,8p' .skilled/skills/system-skill-advisor/runtime/lib/scorer/ambiguity.ts
export const AMBIGUITY_MARGIN = 0.05;
export const AMBIGUITY_CONFIDENCE_MARGIN = 0.05;
```
Both skills carry confidence 0.8235, so a score boost alone would leave the confidence gap at 0 and the flag set.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Record on each recommendation the typed-command seed whose bound lowered its score.
- Leave a held recommendation out of the ambiguity cluster led by the seed that held it.
- Carry the field through every path that re-derives ambiguity: the brief renderer and the hook's CLI fallback.

### Out of Scope
- Changing scores or lane weights - the order is already right, and weight changes would move routing fixtures.
- Changing the 0.05 margins - other prompts rely on them.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/{types,fusion,ambiguity}.ts` | Modify | Record the holding seed, skip the held pair |
| `.skilled/skills/system-skill-advisor/runtime/lib/render.ts` | Modify | Carry the field when ambiguity is re-derived |
| `.skilled/skills/system-skill-advisor/hooks/lib/skill-advisor-cli-fallback.ts` | Modify | Carry the field from CLI output |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/typed-command-routing.vitest.ts` | Modify | Failing-first ambiguity checks |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | For a prompt whose top skill is a typed command's owner and whose runner-up was held below it by the seed bound, the advisor result reads `ambiguous: false` and the top recommendation names no held skill in `ambiguousWith`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-002 | Two skills close on their own evidence still cluster: the plain-word control keeps its earlier ambiguity value, and scores and order do not change for any probe. |
| REQ-003 | The brief renderer and the hook's CLI fallback give the same ambiguity answer as the scorer. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The live probe prints system-deep-loop first with `ambiguous: false`.
- **SC-002**: The advisor suite and the Python twin show no new failure, and the five phase 22 probes keep their top skill.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The seed bound in `fusion.ts` | Without it no recommendation is held | The new field is set only where the bound lowered a score |
| Risk | A real tie gets hidden | Med | Only the held pair is skipped; a third close skill still clusters, and the control prompt is pinned |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: one optional field and one filter, with no measurable cost.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a prompt with no typed command sets no field and clusters as before.
- Maximum input: two typed commands in one prompt; a skill held by either seed is skipped only in the cluster that seed leads.
- Failure path: an older CLI payload without the field renders as before.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Five source files, one test file |
| Risk | 8/25 | Advisor output contract gains an optional field |
| Research | 3/20 | Cause measured in the live probe |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose on 2026-10-27 to act once the flag showed up in practice.
<!-- /ANCHOR:questions -->
