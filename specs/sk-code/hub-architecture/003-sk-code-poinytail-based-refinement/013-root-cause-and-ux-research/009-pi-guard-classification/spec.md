---
title: "Feature Specification: Phase 9: pi-guard-classification"
description: "The shared dispatch inspector read a `bash -c` wrapped dispatch as none, read `mkdir -p $DIR` as a dispatch, and the Pi denial told the caller not to use a path that the inspector accepts."
trigger_phrases:
  - "pi guard classification"
  - "phase 9 pi guard classification"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 9: pi-guard-classification

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-10 |
| **Branch** | `worktrees/094-root-cause-ux-research` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-authored-classifier-fixture |
| **Successor** | None |
| **Handoff Criteria** | Every criterion in this phase's `goal.md` passes and the phase is committed |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the root cause and UX research packet, which builds the ranked fixes from `../research/research.md` and remediates its review.

**Scope Boundary**: The shared inspector, the Pi guard's deny text, their two test files, and the wrapper wording in the cli-dispatch-authorization feature catalog entry and its playbook scenario.

**Dependencies**:
- `../007-remediation-deep-review/review/review-report.md` findings P2-1 and P2-2, and the older shell-wrapper P1 and wording P2 it carried forward

**Deliverables**:
- Shell `-c` wrapped dispatches classify by their payload
- A variable counts as an executor only in command position
- A deny text that no longer forbids paths
- Catalog and playbook wording that matches the code

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`inspectDispatch` tokenizes `bash -c 'devin -p task'` as a bash call with one quoted argument and returned none, so the Pi guard let a wrapped dispatch through unauthorized, although `resolveDispatchPacket` already unwrapped the same form for the other runtimes. `hasDispatchEvidence` counted any expanded token next to any `-p` flag, so `mkdir -p "$DIR"` and `node -p "$EXPR"` were ambiguous and Pi denied them. The Pi denial said not to call an executor through a path, yet `~/bin/pi -p task` is direct. The catalog and playbook listed wrapper forms as ambiguous without saying a shell `-c` wrapper is unwrapped.

### Purpose
Make the Pi guard and the audit trail classify wrapped dispatches the way the hook resolver does, stop denying ordinary commands, and make the denial and the docs say what the code does.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Unwrap SHELL_WRAPPER inside `inspectDispatch` when the outer command shows no dispatch
- Unwrap before shape matching in `resolveSegment` when the wrapped payload is ambiguous
- Count an expanded token as an executor only in command position
- Drop the word path from the Pi deny text
- One paragraph in the catalog entry and one sentence in the playbook scenario

### Out of Scope
- Escaped quotes inside a `-c` payload: SHELL_WRAPPER still stops at the first escaped quote, a limitation it already had in `resolveSegment`
- Hub version bumps, which the master makes once at merge

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Command-position variable rule, shell unwrap in `inspectDispatch` and `resolveSegment` |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | Two negative rows and three wrapper rows |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modify | Deny text |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | Wrapped dispatch blocked at the boundary; deny text has no path |
| `.skilled/skills/cli-external-orchestration/feature-catalog/cli-dispatch-authorization/cli-dispatch-authorization.md` | Modify | Wrapper paragraph |
| `.skilled/skills/cli-external-orchestration/manual-testing-playbook/plugins-and-hooks/cli-dispatch-preflight-authorization.md` | Modify | Wrapper sentence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `bash -c`, `sh -c` and `zsh -c` wrapped dispatches classify as direct | Three inspector rows pass, and Pi blocks `bash -c 'devin -p task'` for an unnamed executor |
| REQ-002 | `mkdir -p "$DIR"` and `node -p "$EXPR"` classify as none | Two inspector rows pass while `$CLI -p task` stays ambiguous |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | The deny text drops path | The Pi test asserts the reason has no `path` |
| REQ-004 | Docs match the code | Both docs name the shell `-c` unwrap and validate with 0 issues |
| REQ-005 | No regression in the resolver | The rule-checks suite stays at 20 of 20 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The inspector and Pi suites go from 111 to 117 tests, all passing.
- **SC-002**: Every new test failed once before its fix.
- **SC-003**: No hub version changes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A wrapped payload with escaped quotes is cut short and reads ambiguous, so Pi denies it | Low | Fail-closed; the denial tells the caller to call the executor literally |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking the phase.
<!-- /ANCHOR:questions -->

---
