---
title: "Feature Specification: Let read-only git history questions route to sk-git by lifting them off the advisor's read-only floor"
description: "A read-only question about git history, such as show the git log, names no skill id, so the advisor floors every skill and returns nothing. This packet lifts such a question to sk-git without lifting prompts that only share a word with git."
trigger_phrases:
  - "git history lift"
  - "let read only git history questions route"
  - "readOnlyRouteAllowed sk-git"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Let read-only git history questions route to sk-git by lifting them off the advisor's read-only floor

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-13 |
| **Branch** | `worktrees/365-git-lift-and-router-capture-plans` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A prompt that opens with show, list, explain or compare is a read-only explainer, and the advisor holds every skill at its floor on such a prompt unless `readOnlyRouteAllowed` lifts one. A question about git history names no skill id, so nothing lifts sk-git and the advisor returns no recommendation. Skill metadata cannot repair this, because `intent_signals` add score and the floor is applied after scoring.

Barter carries the lift as its last advisor code overlay on `fusion.ts`. Two review rounds found that Barter's block is too broad to land here unchanged. Once `readOnlyRouteAllowed` returns true, `confidenceFor` raises the skill to at least 0.82 on any prompt, and the block has no read-only guard. Its bare `branches`, `blame` and `who changed` terms lift prompts that have nothing to do with git.

### Purpose
A read-only question about git history routes to sk-git, and a prompt that only shares a word with git stays where it is today.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"<prompt>"}' --format json
  (recommendations reduced to skillId@confidence, run on main at 57411c2d6e)

show the git log -> no recommendation
show me what changed in the last three commits -> no recommendation
compare branches main and develop -> no recommendation
explain how the decision tree branches are pruned -> no recommendation
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add one sk-git branch to `readOnlyRouteAllowed`, guarded by `isReadOnlyExplainer`, that lifts a prompt naming git, a commit-history object or a branch ref.
- Change the bare-suffix test in `route-gates.vitest.ts`, which today asserts that `list the git branches` stays floored for sk-git, so it keeps its intent with a prompt nothing lifts.
- Add scorer tests for one lifted prompt and for the prompts that must stay floored.
- Run the advisor suite and the local-native divergence ratchet with the lift in place.

### Out of Scope
- The Python scorer `skill_advisor.py` - it has no read-only floor to lift from. This is inferred from a search that found no explainer or read-only logic in it, and the ratchet run in this packet is what confirms it.
- The prompt `what changed in the last 5 commits` - it carries no read-only verb, so it is not floored, and it already routes to sk-git at 0.82 here. Barter's miss on it is a scoring gap that Barter's own metadata closes.
- The terms `blame` and `who changed` from Barter's block - each lifts unrelated prompts, and no measured history question needs them.
- Removing Barter's overlay - that is Barter's follow-up after this lands and Barter re-pins.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modify | Add the guarded sk-git branch as the last check in `readOnlyRouteAllowed` |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts` | Modify | Move the bare-suffix assertion to sk-doc and add the lifted and floored cases |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `readOnlyRouteAllowed` lifts sk-git on a read-only question about git history | It returns true for sk-git on `show the git log`, `show me what changed in the last three commits` and `compare branches main and develop` |
| REQ-002 | The lift does not reach prompts that only share a word with git | It returns false for sk-git on `show me the plan`, `explain how the decision tree branches are pruned`, `explain who changed the lunch menu` and `add a blame column to the incident report table` |
| REQ-003 | The bare-suffix test keeps its intent | `readOnlyRouteAllowed('list the doc templates', skill('sk-doc'))` is asserted false, and no assertion remains that `list the git branches` is false for sk-git |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The advisor suite passes with the lift | `npm test` in `.skilled/skills/system-skill-advisor/runtime` exits 0 |
| REQ-005 | The divergence ratchet holds | `npx vitest run tests/parity/local-native-divergence-ratchet.vitest.ts` exits 0, or the ledger is recaptured and the new rows are named in `implementation-summary.md` |
| REQ-006 | The live advisor routes the handover's prompt | `advisor_recommend` on `show me what changed in the last three commits` returns sk-git in this checkout |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The three prompts in REQ-001 return sk-git from `advisor_recommend`, where the Measured Behavior block shows no recommendation today.
- **SC-002**: `explain how the decision tree branches are pruned` still returns no recommendation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The advisor's built output, which the CLI runs | A probe run before a rebuild reports the old behaviour | Run `npm run build` in the runtime folder before the live probes |
| Risk | The lift floors sk-git at 0.82 on a prompt it should not own, because the word `git` alone passes the pattern | Med | The `isReadOnlyExplainer` guard limits it to read-only questions, and REQ-002 pins four prompts that must stay floored |
| Risk | A stored corpus row changes its top result | Low | The second review found 18 rows that match the pattern and none that changes. That count was not rerun here, so REQ-004 and REQ-005 are the check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Does the branch alternative name only main, master and develop? Decision: yes. A bare `branches` lifts `explain how the decision tree branches are pruned`. A prompt that says `git branches` is still lifted by the word git.
- Does `list the git branches` now route to sk-git, against the current test? Decision: yes. Listing branches is a git history question, which is this packet's premise, so the test moves to a prompt nothing lifts.
<!-- /ANCHOR:questions -->

---
