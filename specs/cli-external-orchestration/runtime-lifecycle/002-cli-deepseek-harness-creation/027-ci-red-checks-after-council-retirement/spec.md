---
title: "Feature Specification: Phase 27: ci-red-checks-after-council-retirement"
description: "OpenCode Plugin Tests and Spec-Kit Check stayed red on main after the AI Council retirement and the session handover rename. This phase fixes the one test and the one manifest line behind them."
trigger_phrases:
  - "ci red checks after council retirement"
  - "phase 27 ci red checks"
  - "cursor task guard test deep-review"
  - "agents-md manifest history body hash"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 27: ci-red-checks-after-council-retirement

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
| **Branch** | `worktrees/410-ci-red-fixes` |
| **Parent Spec** | ../spec.md |
| **Phase** | 27 of 27 |
| **Predecessor** | 026-alignment-remaining-findings |
| **Successor** | None |
| **Handoff Criteria** | The hook, plugin, installer and doctor suites pass locally and both spec folders validate strict |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 27** of the DeepSeek Harness creation specification. After phase 026, two CI workflows on main were still red, and both were red before this session's commits. The operator asked to fix them.

**Scope Boundary**: one test case and one regenerated manifest line. No runtime code changes.

**Dependencies**:
- Phase 026, on whose head the two workflows stayed red

**Deliverables**:
- A Cursor Task guard case that dispatches a registered deep agent
- A manifest history body that matches the text it shipped with
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
OpenCode Plugin Tests fails "the Cursor preflight, MCP route and Task guards still answer a normal payload": the case dispatches `ai-council` with a research mode and expects a deny, but the council retirement left `ai-council` with no registered mode, so the guard allows it. Spec-Kit Check fails "history: the derived key holds one entry per distinct body": two session handover rename sweeps rewrote the wording inside the v4.0.0.14 history body of the AGENTS.md manifest, so the body no longer hashes to its recorded hash.

### Purpose
Make both workflows pass without changing what either guard or gate checks.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs   # CI, run 43724162684
not ok 1671 - the Cursor preflight, MCP route and Task guards still answer a normal payload
  expected: 2
  actual: 0
$ node --test .skilled/commands/doctor/scripts/tests/agents-md-manifest.test.cjs
  actual: 'df50c6916b8ab08d487a1d7e6ad5f13a8235fa3581f26f14942f4f6a31e35341'
  expected: 'bbfcdfd10759503af0ccfca0a88af97e675748657322f438e556187781e1343c'
ℹ fail 1
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Point the Cursor Task guard case at `deep-review`, as the council retirement did for the sibling guard tests
- Regenerate the manifest's derived history from the release tags

### Out of Scope
- The guard and the generator themselves - both behave as designed

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` | Modify | Task guard case agent |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modify | Restored history body |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The OpenCode Plugin Tests steps pass | The hook and plugin `node --test` runs print `fail 0` and the installer test exits 0 |
| REQ-002 | The doctor suites pass | `run-all.sh` prints `0 failed` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every recorded history body hashes to its recorded hash.
- **SC-002**: `validate.sh` prints `RESULT: PASSED` for this phase and its parent with `--strict`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A later rename sweep rewrites a history body again | Med | The manifest test fails on it, and `agents-md-manifest.cjs --write` restores it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None
<!-- /ANCHOR:questions -->

---
