---
title: "Feature Specification: Phase 15: skilled-alignment-check"
description: "Run /local-skilled-alignment over the twenty commits of worktree 474 that merged as 57d3f5d9159, and keep its findings report in this phase. Report only: fixing what it finds is a later operator decision."
trigger_phrases:
  - "skilled alignment check"
  - "phase 15 skilled alignment check"
  - "local skilled alignment advisor"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 15: skilled-alignment-check

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-19 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 15 of 16 |
| **Predecessor** | 014-review-p2-fixes |
| **Successor** | 016-doc-alignment-check |
| **Handoff Criteria** | `evidence/report.md` exists and `tasks.md` has no open task |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 15** of the pi-context-decisions packet. The operator asked for it on 2026-11-19: "Also run /local-skilled-alignment and /local-doc-alignment make that phases".

**Scope Boundary**: One `/local-skilled-alignment` run, report only, over the branch `worktrees/474-advisor-pasted-context-and-crash-fallback` against base `4bf79332378`, the first parent of the merge `57d3f5d9159`. No repository file outside this folder changes.

**Dependencies**:
- The kept branch `worktrees/474-advisor-pasted-context-and-crash-fallback`, which still points at the merged tip.
- The lane executor the operator picks at the lane checkpoint.

**Deliverables**:
- The run's `report.md`, `findings.json`, `fix-plan.md` and `scope-summary.json`, copied into `evidence/`.
- A triage of the findings in `implementation-summary.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phases 002 to 013 changed 34 files under `.skilled/` and merged to main, and the five-pass review in `../review/review-report.md` checked the code. Nothing has checked the change against the connected surfaces the alignment surface map covers: skill docs, feature catalog, playbooks, READMEs, changelogs, routing, advisor integration, env docs and spec validation.

### Purpose
One alignment report names every surface the merged change left out of step, so the operator can decide what to fix.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node .skilled/commands/assets/local-skilled-alignment/resolve-scope.cjs worktrees/474-advisor-pasted-context-and-crash-fallback --kind branch --base 4bf79332378 --first-parent --out "$OUT/scope.json"
STATUS=OK resolve-scope: kind=branch mode=first-parent files=220 commits=20 owners=4 dirty=0

$ git diff --name-only 57d3f5d9159^1 57d3f5d9159 -- . ':!specs' | wc -l
34
```
The scope holds 34 non-spec files, the same count the merge diff prints, so the target and base cover the whole merged change.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `/local-skilled-alignment` in confirm mode over the branch and base named above, with the scope and lane checkpoints answered by the operator.
- Copy the run's report files into `evidence/`.
- Triage each finding in `implementation-summary.md` as fix, accept or refuted.

### Out of Scope
- Fixing any finding - the operator decides which findings become work, and a fix would widen this phase past its spec.
- `--fix literal` - the operator did not ask for fixes, so no repository file outside this folder changes.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `015-skilled-alignment-check/evidence/*` | Create | Copies of the run's report files |
| `015-skilled-alignment-check/*.md` | Modify | This phase's own docs |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The run reaches its report step | `evidence/report.md`, `evidence/findings.json` and `evidence/fix-plan.md` exist |
| REQ-002 | No repository file outside this folder changes | The run gets no `--fix` flag, so its run folder holds no `applied.json`, and `git status --short -- .skilled` prints nothing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Every finding has a triage | Each finding id in `evidence/findings.json` appears in the triage table of `implementation-summary.md` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls evidence` prints `findings.json`, `fix-plan.md`, `report.md` and `scope-summary.json`.
- **SC-002**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The lane executor's provider | A lane that times out or hits a quota leaves its surfaces unreviewed | The report names each failed lane, the run status becomes PARTIAL, and the triage says which surfaces no lane covered |
| Risk | The default `opencode-go` preset runs DeepSeek through OpenCode Go, while parent D3 allows DeepSeek only through cli-mistral-vibe | Med | The lane checkpoint offers the `vibe-deepseek` preset, which matches D3, and the operator picks |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None that block. The lane preset is asked at the lane checkpoint.
<!-- /ANCHOR:questions -->

---
