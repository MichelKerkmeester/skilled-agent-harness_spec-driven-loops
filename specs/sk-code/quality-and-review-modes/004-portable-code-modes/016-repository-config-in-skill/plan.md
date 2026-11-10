---
title: "Implementation Plan: Repository config inside the owning skill folder"
description: "One shared identity module reads which repository a checkout is, both loaders move their default path into the skill folder that reads the file, and this repository's profile moves with them so the CI report is unchanged apart from the profile path."
trigger_phrases:
  - "repository config in skill plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Repository config inside the owning skill folder

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, YAML route assets, Markdown references |
| **Framework** | None |
| **Storage** | `repository/ci.json` and `repository/quality.json` inside the owning skill folder, committed per repository |
| **Testing** | `node:test` over throwaway fixture repositories under `os.tmpdir()`, a shell suite for the pre-commit hook, and a Python self-test for the README checker |

### Overview
`shared/scripts/lib/repository-identity.cjs` reads which repository a checkout is, from `GITHUB_REPOSITORY` first and the origin remote otherwise, through one parser for https, ssh and scp-like URLs. Both loaders move their default path into the skill folder that reads the file, accept an optional `repository` field, report a file written for another repository as `ignored` and refuse the old root path with its move target. This repository's profile moves with the code, so `/doctor:ci report --no-gh --json` keeps 32 workflows and 0 errors, and each suite proves the foreign, legacy and `.opencode/` cases.
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
- [x] The five CI suites print `tests 73 pass 73 fail 0` and the combined quality, doctor-quality, shared and CI run prints `tests 270 pass 270 fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One identity module, two loaders.

### Key Components
- **`shared/scripts/lib/repository-identity.cjs`**: `normalizeRemote`, `currentRepository`, `repositoryMatches` and `REPOSITORY_PATTERN`.
- **`doctor/scripts/lib/ci-profile.cjs`**: the skill-folder path and its `.opencode/` twin, the `repository` field check, the `ignored` result and the `PROFILE_LEGACY_LOCATION` refusal.
- **`sk-code-quality/scripts/lib/quality-config.cjs`**: the same four pieces for the quality config, plus `repoConfigTarget` for `init` and source `none` on a mismatch.
- **The readers**: `ci-report.cjs`, `ci-toggle.cjs` and `ci-scaffold.cjs` carry `ignored` into their output, and `quality-gate.cjs` gives the legacy code its own repair line.

### Data Flow
Each loader reads the identity once, parses the file, validates every field, and compares `repository` when the file declares one. It then applies the file, returns the default with `ignored`, or throws the legacy error. The readers only print what the loader returned; none of them re-reads the file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `ci-profile.cjs` | Owns CI profile discovery, validation and the default | update | `ci-profile.test.cjs` legacy, ignored and `.opencode/` cases |
| `ci-report.cjs`, `ci-toggle.cjs`, `ci-scaffold.cjs` | Print the profile and its refusals | update | `ignored` cases in `ci-report.test.cjs`, `ci-toggle.test.cjs`, `ci-scaffold.test.cjs` |
| `quality-config.cjs` | Owns quality config discovery and the `init` target | update | `quality-config.test.cjs` legacy, ignored and `.opencode/` cases |
| `quality-gate.cjs` | Turns a config fault into a gate error | update | `CONFIG_LEGACY_LOCATION` maps to its own code and repair line |
| `.skilled/skills/sk-code/sk-code-ci/repository/ci.json` | This repository's CI profile | moved | `ci-profile.test.cjs` "this repository commits its CI profile and it keeps every protection" |
| Doctor commands, READMEs, references and playbooks | Describe the old root path | update | `rg -n '\.sk-code/'` leaves only the refusal text |
| `.github/workflows/**`, `.github/scripts/**` | CI | unchanged | `git diff --stat` shows none |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the baseline report and reads the current lookup order. Implementation lands the identity module, both loaders, their readers, this repository's moved profile and the docs sweep. Verification reruns every suite and checks that the report is unchanged apart from the profile path.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Remote normalization, the environment-first identity, the match rule, loader schema and discovery | `repository-identity.test.cjs`, `ci-profile.test.cjs`, `quality-config.test.cjs` |
| Integration | Report, toggle, scaffold, quality gate and doctor quality as processes against foreign fixtures, a legacy fixture and this repository | `ci-report.test.cjs`, `ci-toggle.test.cjs`, `ci-scaffold.test.cjs`, `quality-gate.test.cjs`, `sk-code-quality-config.test.cjs` |
| Manual | The live read-only report, and each loader against a temp root holding a file at the old path | `ci-report.cjs --no-gh --json`, the two loader calls in `spec.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `git` with an origin remote, or `GITHUB_REPOSITORY` in CI | External | Green | The identity reads `unknown`, and a file that names a repository is ignored |
| `node:test`, `bash` and `python3` for the suites | Internal | Green | The verification gate cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A repository whose profile stops applying, or a report here that differs beyond the profile path.
- **Procedure**: Revert the commit. The identity module is new, both loader changes are additive, and moving the profile back to `.sk-code/ci.json` restores the old read.
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
