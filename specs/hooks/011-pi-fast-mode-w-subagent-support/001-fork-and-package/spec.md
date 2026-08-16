---
title: "Feature Specification: Phase 1: fork-and-package [template:level-2/spec.md]"
description: "Fork pi-openai-fast-mode v0.3.0 into pi-fast-mode-w-subagent-support with an identity-only rename; behavior stays byte-identical."
trigger_phrases:
  - "fork-and-package"
  - "pi-fast-mode-w-subagent-support fork"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/011-pi-fast-mode-w-subagent-support/001-fork-and-package"
    last_updated_at: "2026-08-16T09:20:00Z"
    last_updated_by: "pi-coding-agent"
    recent_action: "Authored phase docs from scaffold"
    next_safe_action: "Execute phase plan: copy source, rename identity, run upstream tests"
    blockers: []
    key_files:
      - "context/pi-openai-fast-mode/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-16-pi-fast-mode-w-subagent-support"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 1: fork-and-package

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-08-16 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 1 of 3 |
| **Predecessor** | None |
| **Successor** | 002-subagent-handoff |
| **Handoff Criteria** | Renamed package typechecks; upstream vitest suite passes unmodified; `git diff` vs upstream limited to identity renames |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the pi-fast-mode-w-subagent-support specification.

**Scope Boundary**: Identity-only fork. Copy `context/pi-openai-fast-mode/` source, rename the package and its identity constants, and prove the upstream test suite still passes. Zero behavior changes — the subagent handoff is phase 2.

**Dependencies**:
- `context/pi-openai-fast-mode/` — pinned upstream snapshot (commit `9b28456`, v0.3.0)
- Node.js `>=22.19.0`, npm, vitest (declared in the forked package)

**Deliverables**:
- `packages/pi-fast-mode-w-subagent-support/` (or repo root per decision) with renamed package.json, src/, tests/, tsconfig, README
- `npm run typecheck` and `npm test` green on the untouched upstream suite

**Changelog**:
- When this phase closes, refresh the matching file in ../changelog/ using the parent packet number plus this phase folder name.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The chosen engine (pi-openai-fast-mode v0.3.0) lacks subagent handoff, which pi-gpt-fast-mode has. The fork exists so the engine can be extended in phase 2 without forking upstream later. Phase 1 establishes a clean, renamed, test-verified baseline so phase 2's diff is purely the handoff feature.

### Purpose

Create the `pi-fast-mode-w-subagent-support` package as a byte-faithful rename of the upstream source, with its own package identity (name, status key, config namespace) so it can be installed alongside or in place of the originals without identity collisions.

### Non-Goals

- No behavior or API changes (handoff, config, indicators all deferred or intentionally preserved)
- No npm publication (open question tracked at parent level)
- No replacement of the installed `pi-gpt-fast-mode` yet (phase 3)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Copy `context/pi-openai-fast-mode/` source tree into the fork working directory
- Rename package identity: `package.json` name → `pi-fast-mode-w-subagent-support`; `PACKAGE_NAME` / `STATUS_KEY` in `src/types.ts`; `pi` extension entry stays `./src/index.ts`
- Update README (name, description, install/usage wording; keep config docs accurate)
- Keep `tsconfig.json`, vitest config, and all test files byte-identical (tests must pass unmodified)
- Run `npm install`, `npm run typecheck`, `npm test` and record evidence

### Out of Scope

- Any src logic change beyond the identity constants (PACKAGE_NAME, STATUS_KEY)
- Config format changes (targets array, scope resolution, syncSupportedTargets behavior)
- New tests (phase 3)
- Installation into `.pi/settings.json` (phase 3)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `package.json` | Modify | name, description, keywords, repository → fork identity |
| `src/types.ts` | Modify | PACKAGE_NAME, STATUS_KEY → new identity |
| `src/*.ts` (6 files) | Copy | unchanged logic |
| `tests/*.test.ts` (4 files) | Copy | unchanged |
| `README.md` | Modify | fork identity + provenance note |
| `tsconfig.json`, `.gitignore`, `LICENSE` | Copy | unchanged (LICENSE retains upstream MIT attribution) |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### Functional Requirements

| ID | Requirement | Verification |
|----|-------------|--------------|
| REQ-FUNC-1 | Package installs under the name `pi-fast-mode-w-subagent-support` | `npm pack --dry-run` shows the tarball name |
| REQ-FUNC-2 | All upstream behaviors preserved: `/fast [on\|off\|toggle]`, `--fast` flag, widget/status indicator, config scopes, self-upgrading targets | upstream `tests/` suite passes unmodified |
| REQ-FUNC-3 | Identity constants renamed in every reference (status key, config namespace, messages) | `rg -n "pi-openai-fast-mode" src/ tests/ README.md` returns only provenance note |
| REQ-FUNC-4 | Upstream git history preserved in the fork's `context/` reference and noted in README | README provenance section cites commit `9b28456` |

### Non-Functional Requirements

| ID | Requirement | Verification |
|----|-------------|--------------|
| REQ-NFR-1 | Typecheck clean with the upstream tsconfig | `npm run typecheck` exit 0 |
| REQ-NFR-2 | No dependency additions beyond upstream's devDependencies | `package-lock.json` diff limited to name/version fields |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- [ ] `npm run typecheck` exits 0 in the fork
- [ ] `npm test` (upstream vitest suite, unmodified) exits 0 in the fork
- [ ] `rg -n "pi-openai-fast-mode"` in the fork matches only README provenance + package.json repository URL
- [ ] `npm pack --dry-run` lists the expected files under the new name
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Upstream tests reference `PACKAGE_NAME`/`STATUS_KEY` literals and break on rename | Medium | Medium | Grep tests for identity literals before renaming; keep test expectations aligned with the rename (tests stay green, so any literal must be updated deliberately and flagged) |
| Lockfile churn from `npm install` touches unrelated deps | Low | Low | Commit only name/version fields; verify with `git diff package-lock.json` |
| `/fast` command collision if the fork is installed before pi-gpt-fast-mode is removed | High (later phases) | Medium | Phase 3 removes pi-gpt-fast-mode; this phase only builds, never installs |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

| Question | Impact | Decision Needed By |
|----------|--------|-------------------|
| Fork lives at repo root or `packages/` subdir? | File layout of the deliverable | Phase 1 start |
| Keep upstream test files byte-identical or rename `PACKAGE_NAME` expectations? | Test integrity vs rename purity | Phase 1 execution |
<!-- /ANCHOR:questions -->

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-source-fork-and-identity/ | [Phase 1 scope] | Pending |
| 2 | 002-config-and-request-safety/ | [Phase 2 scope] | Pending |
| 3 | 003-package-and-baseline-verification/ | [Phase 3 scope] | Pending |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-source-fork-and-identity | 002-config-and-request-safety | [Criteria TBD] | [Verification TBD] |
| 002-config-and-request-safety | 003-package-and-baseline-verification | [Criteria TBD] | [Verification TBD] |
<!-- /ANCHOR:phase-map -->
