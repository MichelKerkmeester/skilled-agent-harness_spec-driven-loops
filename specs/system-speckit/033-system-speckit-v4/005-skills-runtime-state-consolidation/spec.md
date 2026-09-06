---
title: "Feature Specification: Consolidate the seven skills-root state directories into .state"
description: "Seven runtime-state directories sit directly under .opencode/skills/, so the folder a user opens to find skills shows mostly machine state instead."
trigger_phrases:
  - "skills state consolidation"
  - "dot state directories"
  - "advisor-state goal-state spec-gate-state"
  - "clean up the skills folder"
  - "runtime state relocation"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Consolidate the seven skills-root state directories into .state

<!-- SPECKIT_LEVEL: 3 -->


---

## EXECUTIVE SUMMARY

`.opencode/skills/` is the directory an end user opens to see what skills exist. Seven runtime-state directories sit there alongside them, so roughly a third of the entries are machine state that nobody browsing skills wants to see. This packet moves all seven under a single `.state/` parent, one child per owning subsystem.

**Key Decisions**: one `.state/` parent rather than seven siblings; child names drop the redundant leading dot and `-state` suffix; existing state is discarded and regenerated rather than migrated, on operator instruction.

**Critical Dependencies**: seven owning resolvers across four subsystems; three build outputs that must be regenerated rather than edited; `.gitignore`, whose negation semantics constrain the directory shape.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-28 |
| **Parent Spec** | `../spec.md` |
| **Phase** | 5 of 24 |
| **Predecessor** | `../004-decisions-and-notes-system/spec.md` |
| **Successor** | `../006-derived-metadata-repair-tool/spec.md` |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Seven hidden state directories sit directly under `.opencode/skills/`: advisor, authority, completion-sentinel, goal, loop-guard, smart-router-telemetry and spec-gate. They are machine-local runtime data owned by four different subsystems, but they share a namespace with the skills themselves. A person listing that directory to find a skill sees seven entries that are not skills, and no grouping tells them so.

### Purpose

One `.state/` parent under the skills root, so the skills directory lists skills and runtime state has an obvious single home.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Relocating all seven directories to `.opencode/skills/.state/<subsystem>/`.
- Updating the seven owning resolvers plus every other source reference.
- Regenerating the three affected build outputs from their sources.
- Updating tests, test fixtures and documentation that name the old paths.
- Replacing the fifteen `.gitignore` rules with a pattern that survives the extra directory level.
- Re-pointing the relative links in the seven relocated READMEs.

### Out of Scope

- Migrating existing state content. The operator chose regeneration; the data is machine-local and disposable.
- Historical benchmark reports that record an old path as run evidence. Editing them would falsify a past run.
- Any state directory outside the skills root. `.opencode/logs/` and per-skill databases are untouched.
- Restarting the long-lived daemons. That is an operator action, documented rather than performed.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/.state/` | Create | New parent with seven subsystem children |
| `.opencode/hooks/goal/lib/goal-core.cjs` | Modify | Goal state resolver |
| `.opencode/hooks/task-dispatch/lib/dispatch-guard.cjs` | Modify | Loop-guard resolver |
| `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.mjs` | Modify | Spec-gate resolver |
| `.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs` | Modify | Sentinel resolver |
| `.opencode/skills/system-deep-loop/runtime/lib/authority-root/resolve-authority-root.ts` | Modify | Authority resolver |
| `.opencode/skills/system-skill-advisor/mcp-server/lib/**` | Modify | Advisor lease, watcher, generation, workspace-root |
| `.opencode/skills/system-spec-kit/scripts/observability/*.ts` | Modify | Telemetry writer and analyzer |
| `.gitignore` | Modify | Fifteen rules replaced by two |
| `.opencode/skills/.state/*/README.md` | Move | Seven relocated docs, relative links re-pointed |
| Tests, fixtures and docs | Modify | Nineteen tests and twenty-seven documents |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | No source, test or doc references an old path | A repository scan for the seven old directory names returns zero hits outside historical run evidence |
| REQ-002 | Every owning resolver points into `.state/` | Each of the seven resolvers is called or read and reports a path under `.opencode/skills/.state/` |
| REQ-003 | Build outputs are regenerated, not hand-edited | Each affected package is rebuilt from source and contains zero old-path references |
| REQ-004 | The workspace test gate passes | `run-node-tests.mjs` reports zero failures |
| REQ-005 | Runtime writes land in the new location | Exercising a subsystem creates its file under `.state/` and recreates no old directory |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Runtime state stays ignored, READMEs stay tracked | `git check-ignore` reports the runtime file ignored and the README not ignored |
| REQ-007 | Relocated READMEs have working relative links | The repository markdown link guard reports zero broken links |
| REQ-008 | The seven READMEs are recorded as renames | `git diff --cached --name-status` shows `R` for all seven, preserving history |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `ls .opencode/skills/` shows skills plus one `.state/` entry, instead of skills plus seven state directories.
- **SC-002**: A subsystem that writes state after the change writes it under `.state/` with no code aware of the old location.
- **SC-003**: A future relocation of the state root requires editing seven constants, not seven constants plus a hardcoded fixture depth.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A missed reference fails silently | High | Nothing errors on a wrong state path; it quietly creates a directory. Mitigated by a repository-wide residual scan and by leaving the old paths un-ignored, so a recreated directory shows up as untracked |
| Risk | Long-lived daemons hold the old paths in memory | Medium | Observed during the change: daemons started before it recreated an old directory. They pick up the new path on restart; documented as an operator action |
| Risk | `.gitignore` negation silently drops the READMEs | Medium | Git cannot re-include a file whose parent directory is excluded, so a `**/.state/**` rule makes the README negation inert and `git add` stages nothing without warning. Resolved by matching one level inside instead |
| Dependency | Three build outputs | Low | Regenerated from source and verified to contain zero old-path references |
| Dependency | Concurrent sessions in the same checkout | Medium | Staging is done by explicit pathspec; three unrelated in-flight changes were identified and deliberately excluded |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: No added path resolution at runtime. Each resolver gains one path segment and resolves as before.

### Security

- **NFR-S01**: No change to what is written, only where. Runtime state stays outside version control.

### Reliability

- **NFR-R01**: Every affected subsystem keeps its existing fail-open behavior on an unwritable state directory, verified by the spec-gate fail-open tests.

---

## 8. EDGE CASES

### Data Boundaries

- A subsystem whose state directory does not exist yet: created on first write, as before.
- A state directory occupied by a plain file: still fails open rather than blocking, which the fail-open tests assert against the new depth.

### Error Scenarios

- A process running pre-change code writes to the old path. It reappears as an untracked directory, which is the intended visible signal rather than a silent divergence.

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 16/25 | Files: 83 changed, Systems: 4 owning subsystems plus build and ignore rules |
| Risk | 13/25 | Auth: N, API: N, Breaking: N, but silent-failure mode on a missed reference |
| Research | 8/20 | Ownership discovery across four subsystems; wrapped shell tooling gave false results initially |
| Multi-Agent | 2/15 | Workstreams: 1 |
| Coordination | 9/15 | Three concurrent sessions active in the same checkout |
| **Total** | **48/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | A reference is missed and a stale directory returns | H | L | Residual scan returned zero; old paths left un-ignored so recurrence is visible |
| R-002 | A daemon keeps writing the old path after the change | M | H | Observed and expected; resolved by daemon restart, documented for the operator |
| R-003 | Another session's work is swept into the commit | H | M | Explicit pathspec staging; three unrelated in-flight changes identified and excluded |
| R-004 | A build output is edited instead of regenerated | M | L | All three packages rebuilt and re-scanned |

---

## 11. USER STORIES

### US-001: Browsing the skills directory (Priority: P0)

**As a** person opening `.opencode/skills/` for the first time, **I want** to see skills, **so that** I can find the one I need without filtering out machine state.

**Acceptance Criteria**:
1. Given a listing of the skills root, When the change is applied, Then exactly one entry relates to runtime state.

### US-002: Relocating state again later (Priority: P1)

**As a** maintainer moving the state root again, **I want** the change confined to the owning constants, **so that** fixtures do not encode the directory depth.

**Acceptance Criteria**:
1. Given a fixture that needs the state directory's parent, When it is written, Then it derives the parent from the resolved path rather than a hardcoded segment count.

---

## 12. OPEN QUESTIONS

- Whether a standing guard check should fail the test gate when any code writes to a pre-`.state` path. The one-time residual scan proved the current state; nothing prevents a regression. Recorded as the packet's single follow-up.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Decision Records**: See `decision-record.md`

---
