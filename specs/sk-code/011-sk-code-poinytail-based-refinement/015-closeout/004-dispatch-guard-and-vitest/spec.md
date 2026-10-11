---
title: "Feature Specification: Phase 4: dispatch-guard-and-vitest"
description: "Make a vitest run over the hooks tree exit 0 by skipping the test files written for node, and read a double-quoted bash -c payload to its closing quote."
trigger_phrases:
  - "dispatch guard and vitest"
  - "phase 4 dispatch guard and vitest"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 4: dispatch-guard-and-vitest

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-11 |
| **Branch** | `worktrees/098-post-092-integration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 4 of 9 |
| **Predecessor** | 003-sk-git-playbook-changelog |
| **Successor** | 005-stdin-late-write-coverage |
| **Handoff Criteria** | Every criterion in goal.md passes and strict validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the epic closeout phase parent. It closes items 4 and 6 of the closeout list, the hooks vitest run that exits 1 and the shell-wrapper payload cut at the first escaped quote.

**Scope Boundary**: Only the files in the table below change.

**Dependencies**:
- None beyond the files named below.

**Deliverables**:
- Make a vitest run over the hooks tree exit 0 by skipping the test files written for node, and read a double-quoted bash -c payload to its closing quote.

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`npx vitest run --config .skilled/hooks/vitest.config.ts .skilled/hooks/dispatch` exits 1 with `No test suite found` on dispatch-rule-checks.test.mjs, a node:test file; across the whole hooks tree 15 such files fail the same way. Separately, SHELL_WRAPPER in dispatch-audit.mjs ends a double-quoted `-c` payload at the first escaped quote, so `bash -c "devin -p \"task\" </dev/null"` reads ambiguous and Pi denies a dispatch the user named.

### Purpose
A vitest run over the dispatch folder or the whole hooks tree exits 0 while CI and the READMEs still run every node-style file with node, and a wrapped payload with escaped quotes is classified by what it runs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The hooks vitest config
- SHELL_WRAPPER and its three callers in dispatch-audit.mjs
- Tests in dispatch-audit.test.mjs and the Pi dispatch-preflight-lint.test.ts

### Out of Scope
- Payloads holding an expansion such as $DIR, which stay ambiguous on purpose so `bash -c "$CMD"` never reads as none
- Converting node-style suites to vitest

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/vitest.config.ts` | Modify | Skip JavaScript test files that do not import vitest |
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modify | Escape-aware payload extraction |
| `.skilled/hooks/dispatch/lib/dispatch-audit.test.mjs` | Modify | Four table cases |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | Modify | One boundary case |
| 013 pi-guard-classification implementation-summary.md | Modify | Limitation marked fixed |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Vitest exits 0 on the dispatch folder and the hooks tree | Test Files all passed, exit 0 |
| REQ-002 | No node-style coverage is lost | node --test over the skipped files passes |
| REQ-003 | Escaped quotes no longer cut a payload | New cases fail on the old code and pass on the fix |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-090 | Strict validation of this phase passes | validate.sh --strict prints RESULT: PASSED |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every completion criterion in goal.md passes when the orchestrator reruns it.
- **SC-002**: The phase lands as one conventional commit in the worktree.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A change reaches a caller the phase did not name | Med | The gates named in goal.md are rerun from the final state |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
