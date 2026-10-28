---
title: "Implementation Plan: CI repository profile for sk-code-ci and doctor ci"
description: "One profile loader shared by the CI report, a toggle planner and a template renderer, with this repository's Skilled profile committed so its output stays the same and its protections grow a second named confirmation."
trigger_phrases:
  - "ci repo profile plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: CI repository profile for sk-code-ci and doctor ci

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, YAML route assets, Markdown references |
| **Framework** | None |
| **Storage** | `.sk-code/ci.json`, committed per repository |
| **Testing** | `node:test` with a gh stub on PATH, throwaway fixture repositories under `os.tmpdir()` |

### Overview
`lib/ci-profile.cjs` finds the profile in the quality config's order and rejects unknown keys. `ci-report.cjs` reads switches by their `vars.X != 'off'` shape and takes every repository convention from the profile. `ci-toggle.cjs` plans one change with every refusal in code and never writes. `ci-scaffold.cjs` fills the template slots. This repository's profile carries today's values, so the report JSON gains only a `profile` key and the templates render byte for byte.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] The five CI suites pass 60 of 60, and 28 of them fail against the HEAD scripts
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One loader, three readers. The loader follows `sk-code-quality/scripts/lib/quality-config.cjs`: a named path that is missing throws, a `-c` git value is ignored, every fault is collected.

### Key Components
- **`lib/ci-profile.cjs`**: `discoverProfile`, `validateProfile`, `normalizeProfile`, `loadProfile`, `declaredSwitches`.
- **`ci-report.cjs`**: `switchNames` (shape), `resolveDefaultBranch` (profile, then `gh repo view`, then `main`), exports for the toggle under a `require.main` guard.
- **`ci-toggle.cjs`**: allowlist, required contexts from `gh api repos/{owner}/{repo}/rules/branches/<branch>`, `neverOff`, README sentence, no-op, second confirmation.
- **`ci-scaffold.cjs`**: a small slot language (value, block, inverted block, inline block, wrapped comment, note line) and `--protected`.

### Data Flow
Each script loads the profile, parses the workflows once, reads gh only for state, and prints. The route YAML shows the plan, asks, and runs the one gh command itself.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ci-report.cjs` | The report route and the scaffold read-back | update | before and after JSON diff, `ci-report.test.cjs` |
| `doctor-ci-toggle.yaml` | Toggle route | update to run the planner | `ci-toggle.test.cjs`, `doctor-ci-contract.test.cjs` |
| `doctor-ci-scaffold.yaml` and both templates | Scaffold route | update to render from the profile | `ci-scaffold.test.cjs`, byte diff against HEAD |
| `_routes.yaml` | Route manifest | add `script_invocations` for scaffold and toggle | `route-validate.sh` I1 and L1 |
| `leaf-manifest.json` | sk-code typed leaves | regenerate for the new template asset | `parent-skill-check.cjs .skilled/skills/sk-code` |
| `.github/workflows/**`, `.github/scripts/**` | CI | unchanged | `git diff --stat` shows none |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the baselines, Implementation lands the loader, the report, the profile, the templates, the toggle and the docs, and Verification reruns every suite and the repository gates.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Loader schema and discovery | `ci-profile.test.cjs` |
| Integration | Report, toggle and scaffold as processes against foreign fixtures and this repository, gh stubbed | `ci-report.test.cjs`, `ci-toggle.test.cjs`, `ci-scaffold.test.cjs`, `doctor-ci-contract.test.cjs` |
| Manual | Live read-only report and toggle plans in this repository, no variable written | `ci-report.cjs --json`, `ci-toggle.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `gh` with read access to rules and variables | External | Green | The toggle falls back to `neverOff` and the README sentence |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The report output here differs beyond the `profile` key, or a toggle plan here loses a refusal.
- **Procedure**: Revert the commit. The loader, the two new scripts and `.sk-code/ci.json` are new files, and the report and templates return to their constants.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
