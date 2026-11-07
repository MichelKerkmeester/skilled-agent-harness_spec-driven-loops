---
title: "Feature Specification: Phase 1: runtime-code-and-tests"
description: "Remove the cli-hermes executor and the hermes runtime from the deep-loop executors, the hooks, the launcher, the git hooks and the doctor scripts, with their tests."
trigger_phrases:
  - "remove cli-hermes executor code"
  - "hermes runtime removal tests"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: runtime-code-and-tests

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-07 |
| **Branch** | `worktrees/321-deprecate-cli-hermes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-docs-and-registries |
| **Handoff Criteria** | Every touched test suite matches its baseline with no new failure |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the Deprecate and remove the cli-hermes executor and the .hermes runtime folder specification.

**Scope Boundary**: Code and tests under .skilled/skills/system-deep-loop, .skilled/hooks, .skilled/bin, .skilled/scripts and .skilled/commands/doctor/scripts. Docs and registries belong to phase 2.

**Dependencies**:
- The operator decision to remove Hermes with no archive

**Deliverables**:
- No Hermes executor, adapter, rule or launcher arm remains in runtime code
- Tests updated so every suite matches its baseline
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Runtime code carried a full Hermes executor: a fan-out command builder, executor config and audit tables, session-relaunch adapters, dispatch lint rules, a launcher arm and a shell function. None of it served a live user, and every executor change had to keep the Hermes branch working.

### Purpose
Take Hermes out of every runtime code path while every other executor behaves exactly as before.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
rg -l -i hermes .skilled/skills/system-deep-loop .skilled/hooks .skilled/bin .skilled/scripts --glob '!**/node_modules/**' --glob '!**/changelog/**'
before: 24 + 17 + 6 + 3 files with hits (grouped count from the 2026-11-07 inventory)
after: only the captured Devin transcript fixture and its two test assertions
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `cli-hermes` from `EXECUTOR_KINDS`, the executor config and audit tables, and `fanout-run.cjs`
- Delete the Hermes session-relaunch adapters and drop Hermes from relaunch-core, context usage and hook flags
- Drop the Hermes dispatch rules and audit shapes
- Remove the `hermes` launcher arm and shell function
- Update or delete every test that enumerated Hermes

### Out of Scope
- Docs and registries - phase 2 owns them
- The Nous Hermes model-family cache labels in the Pi cache optimizer - they describe a model family, not this runtime
- The user-level `~/.hermes` install - it lives outside the repository

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts`, `executor-audit.ts` | Modify | Drop the executor kind and its tables |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modify | Drop the Hermes adapter, env and availability probe |
| `.skilled/skills/system-deep-loop/deep-ai-council/scripts/orchestrate-session.cjs` | Modify | Drop Hermes as a seat executor |
| `.skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/**` | Modify/Delete | Delete the Hermes shim and suite, shrink the matrix to 8 subjects |
| `.skilled/hooks/session-relaunch/hermes/` | Delete | The Hermes relaunch adapter |
| `.skilled/hooks/session-relaunch/lib/*.cjs`, `.skilled/hooks/shared/hook-flags.*` | Modify | Drop Hermes from runtime lists |
| `.skilled/hooks/dispatch/lib/*.mjs` | Modify | Drop Hermes dispatch rules and audit shapes |
| `.skilled/bin/skilled-loop`, `skilled-loop-shell.sh` | Modify | Drop the launcher arm and shell function |
| `.skilled/scripts/git-hooks/pre-commit`, `orphan-mcp-sweeper.sh` | Modify | Drop Hermes mirror checks and process patterns |
| `.skilled/commands/doctor/scripts/**` | Modify | Drop Hermes from the integrate, surface, check and git-setup scripts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | No runtime code path dispatches, configures or audits a `cli-hermes` executor |
| REQ-002 | Every touched test suite reports no failure that its baseline did not have |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-003 | Every other executor's command, environment and routing stay unchanged |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n -i hermes` over the phase area finds only the justified transcript fixture
- **SC-002**: The targeted deep-loop suites pass 433 with 0 failing, against a baseline of 466 passing and 2 failing
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Shared executor roster | A roster count that tests freeze breaks | Update the frozen counts in the same change |
| Risk | A shared helper used only by Hermes is removed while another caller needs it | Med | Grep each removed symbol for other callers before deleting |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: this phase removes code and documentation and runs no service, so it sets no performance, security or uptime target.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a request that names Hermes now gets no executor; the dispatch lint has no Hermes rule to match.
- Maximum input: the stress matrix shrinks from 9 subjects and 126 cells to 8 and 112.
- Failure path: `fanout-run.cjs` rejects `cli-hermes` as an unknown kind.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 60 code and test files across five areas |
| Risk | 10/25 | Shared rosters frozen by tests |
| Research | 4/20 | Inventory by grep |
| **Total** | **32/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose full removal with no backup on 2026-11-07.
<!-- /ANCHOR:questions -->

---
