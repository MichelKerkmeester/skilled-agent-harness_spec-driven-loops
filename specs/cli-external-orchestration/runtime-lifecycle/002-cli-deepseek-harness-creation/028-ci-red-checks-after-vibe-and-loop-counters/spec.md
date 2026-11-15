---
title: "Feature Specification: Phase 28: ci-red-checks-after-vibe-and-loop-counters"
description: "Command Tree Parity and Spec-Kit Check went red on main after the Vibe mirror CI check, the loop counter change and the session handover work. This phase fixes the five causes."
trigger_phrases:
  - "ci red checks after vibe and loop counters"
  - "phase 28 ci red checks"
  - "vibe local prompt stub gitignore"
  - "convergence tsx lazy resolve"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 28: ci-red-checks-after-vibe-and-loop-counters

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-15 |
| **Branch** | `worktrees/414-ci-red-fixes-2` |
| **Parent Spec** | ../spec.md |
| **Phase** | 28 of 28 |
| **Predecessor** | 027-ci-red-checks-after-council-retirement |
| **Successor** | None |
| **Handoff Criteria** | The CLI vitest project, the Vibe mirror checks and the router check pass locally and both spec folders validate strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 28** of the DeepSeek Harness creation specification. A merge that landed under phase 027 brought new CI failures into main, and the operator asked to fix them too.

**Scope Boundary**: one ignore rule, one untracked stub, six provenance lines, one contract entry, one lazy require and one test count.

**Dependencies**:
- Phase 027, on whose head these checks stayed red

**Deliverables**:
- Green Command Tree Parity and Spec-Kit Check inputs
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Command Tree Parity fails because `.vibe/prompts/local-skilled-alignment.md` is tracked while its private source is ignored, so CI reports an extra stub. Spec-Kit Check fails four CLI tests: six playbook files carry no provenance line, the `deep` command contract still names `deep-<name>-auto.yaml` and `deep-<name>-confirm.yaml`, `reduce-state.cjs` now loads `convergence.cjs`, which resolves `tsx` at load in a job that never installs it, and the hook binding count still says 117 after a Codex compact-pointer binding made it 118.

### Purpose
Make both workflows pass by fixing each input, without loosening any check.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
[vibe-prompt-sync] EXTRA .vibe/prompts/local-skilled-alignment.md
FAIL tests/playbook-provenance-paths.vitest.ts   expected [ …(6) ] to deeply equal []
FAIL tests/typo-flags.vitest.ts                  generate-command-routers.cjs --check: expected 1 to be +0
FAIL tests/deep-research-reducer.vitest.ts       Error: Cannot find module 'tsx'
FAIL tests/hook-registration-sync.vitest.ts      expected 118 to be 117
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Ignore `/.vibe/prompts/local-*` and untrack the one stub
- Add a provenance line to each of the six playbook files
- Point the `deep` contract at `deep-<name>.yaml`
- Resolve `tsx` only when `convergence.cjs` runs as a script
- Expect 118 hook bindings

### Out of Scope
- Every check's own logic

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.gitignore`, `.vibe/prompts/local-skilled-alignment.md` | Modify, untrack | Private Vibe stubs |
| Six `system-spec-kit/manual-testing-playbook/plugins-and-hooks/*.md` files | Modify | Provenance lines |
| `.skilled/skills/sk-doc/sk-create-command/assets/command-contract.json` | Modify | Single deep workflow |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | Modify | Lazy tsx resolve |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/hook-registration-sync.vitest.ts` | Modify | Binding count |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The CLI vitest project passes | The run prints no failed test file |
| REQ-002 | The Vibe prompt check passes without the private command | `sync-prompts-vibe.cjs --check` passes with the private source moved away |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | Importing `convergence.cjs` needs no tsx | The reducer test passes with `tsx` unresolvable |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `generate-command-routers.cjs --check` prints `routers=42 clean=42`.
- **SC-002**: `validate.sh` prints `RESULT: PASSED` for this phase and its parent with `--strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The lazy resolve hides a missing tsx until the script runs | Low | The script still fails at once with the module error when run directly |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
