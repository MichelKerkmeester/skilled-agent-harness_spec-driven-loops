---
title: "Implementation Plan: Phase 25: deprecate-nested-changelogs"
description: "Remove the packet-changelog step from the speckit workflows and the phase scaffold, make /create:changelog global-only, keep the generator behind a deprecation notice and align the docs."
trigger_phrases:
  - "deprecate nested changelogs plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 25: deprecate-nested-changelogs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | YAML workflows, Bash, TypeScript, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest in the system-spec-kit CLI, sk-doc `validate_document.py`, `rg` sweeps |

### Overview
Four lanes run in parallel because they touch different files: the speckit workflows and scaffold, the create-changelog workflow, the generator, and the docs. The conductor then sweeps with `rg`, runs the suites and validates the packet.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The operator chose the scope on 2026-10-27: stop generating, keep the generator and the existing files
- [x] Callers listed: two speckit workflows, `create.sh`, the create-changelog workflow, about 25 docs

### Definition of Done
- [ ] Every row of `acceptance-criteria.md` is Met
- [ ] The CLI suite shows no new failure against its baseline
- [ ] `validate.sh --strict --recursive` on packet 054 prints `RESULT: PASSED` for every folder
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Stop at the producer: remove the calls that create packet changelogs, and keep the reader paths that serve the files already written.

### Key Components
- **Closing workflows**: `speckit-implement.yaml` and `speckit-complete.yaml` lose the generator call.
- **Phase scaffold**: `create.sh` stops writing the changelog line.
- **Changelog command**: the create-changelog workflows keep global mode only.
- **Generator**: `nested-changelog.ts` keeps working and warns.

### Data Flow
A packet closes, writes `implementation-summary.md`, and stops. A release goes through `/create:changelog` to `.skilled/changelog/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow `tasks.md`. Setup takes the baselines, Implementation runs the four lanes, and Verification sweeps, tests and validates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The generator's deprecation notice | vitest `nested-changelog.vitest.ts` |
| Integration | The CLI suite and the scaffold snapshots | vitest `--project cli` |
| Manual | A throwaway phase scaffold, the `rg` sweep | `create.sh --phase`, `rg` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The system-spec-kit CLI build | Internal | Green | The generator's notice does not reach `dist` |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a workflow or test depends on a packet changelog being written.
- **Procedure**: revert the phase commit. The existing files and the generator never left, so nothing needs restoring.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation (4 lanes) ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | The CLI suite baseline | Verification |
| Verification | All four lanes and the rebuilt CLI | Close |
<!-- /ANCHOR:phase-deps -->
