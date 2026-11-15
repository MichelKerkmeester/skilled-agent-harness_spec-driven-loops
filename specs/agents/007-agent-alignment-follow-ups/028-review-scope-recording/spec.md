---
title: "Feature Specification: Phase 28: review-scope-recording"
description: "The scope gate fails findings whose file carries a line suffix such as `src/a.ts:4`, and findings in the reviewed packet's own docs. This phase strips the suffix and counts the reviewed spec folder as in scope."
trigger_phrases:
  - "review scope recording"
  - "phase 28 review scope recording"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 28: review-scope-recording

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/384-agent-alignment-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 29 |
| **Predecessor** | 027-review-traceability-recording |
| **Successor** | 029-review-verdict-script |
| **Handoff Criteria** | A suffixed path and a finding in the reviewed packet's docs pass scope, a finding elsewhere still fails, and `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the agent alignment follow-ups. It closes one follow-up phase 25 recorded.

**Scope Boundary**: `terminal-gates.cjs`, its tests, and the spec-folder scope prose in `deep-review.yaml`.

**Dependencies**:
- Phase 24's scope gate

**Deliverables**:
- Line-suffix and packet-doc handling in the scope gate
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Run over the reviews recorded since October, the scope gate failed 23 of 39. Of the out-of-scope findings, some carry a `:line` suffix the gate compares literally, and some sit in the reviewed packet's own spec docs, which the spec-folder scope step leaves out of `reviewScopeFiles`. Configs with no recorded scope at all are now rare (0 of 6 in November), so no init resolver is needed.

### Purpose
A finding inside the reviewed target passes the scope gate however its location is written.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node -e "...computeTerminalGates({config:{reviewScopeFiles:['src/a.ts']},registry:{openFindings:[{file:'src/a.ts:4'}]}})..."
findings-out-of-scope
$ node -e "...computeTerminalGates({config:{reviewTargetType:'spec-folder',reviewTarget:'specs/x/001-a',reviewScopeFiles:['src/a.ts']},registry:{openFindings:[{file:'specs/x/001-a/spec.md'}]}})..."
findings-out-of-scope
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strip a trailing `:N`, `:N-M` or `:N:C` from a finding file before matching.
- When `reviewTargetType` is `spec-folder`, count the reviewed folder as a scope entry, with or without its `specs/` prefix.
- Say in the spec-folder scope step of `deep-review.yaml` that scope includes the packet's own docs.

### Out of Scope
- Findings in other packets' docs or other files: those are out of scope and keep failing.
- An init-time scope resolver: recent runs record their scope.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/scripts/terminal-gates.cjs` | Modify | Line suffix and spec-folder entry |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/terminal-gates.vitest.ts` | Modify | Cases for both and for a finding still out of scope |
| `.skilled/commands/deep/assets/deep-review.yaml` | Modify | Spec-folder scope includes the packet docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A finding with a line suffix inside the scope passes. | A test passes for `src/a.ts:4`, `:4-9` and `:4:2`, and fails on the old rule |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | A finding in the reviewed spec folder passes for a spec-folder target. | A test passes for the packet's `spec.md`, while a sibling packet's doc still fails |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The runtime suite fails nothing that passed at baseline, plus the new tests.
- **SC-002**: `validate.sh --strict --recursive` on the parent prints `RESULT: PASSED` for every folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A file name that really ends in `:digits` | Low | Only a suffix after a path with an extension-like segment is stripped; a test pins it |
| Dependency | The compiled review contract | Low | Recompile and run the drift check |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---


