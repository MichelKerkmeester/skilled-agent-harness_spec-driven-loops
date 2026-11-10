---
title: "Implementation Plan: Phase 4: trigger-index-rebuild-hardening"
description: "Update `.github/workflows/trigger-index-rebuild.yml` to stage all four generator outputs, guard its loop exactly, and retry a raced push after regenerating and checking the index. The token is left as it is."
trigger_phrases:
  - "trigger index rebuild hardening plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 4: trigger-index-rebuild-hardening

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | GitHub Actions workflow YAML, Bash |
| **Framework** | GitHub Actions, Node 22 |
| **Storage** | Git repository, trigger index JSON |
| **Testing** | Workflow dispatch on a test branch, local index build comparison |

### Overview
The rebuild job runs on every push to main and `skilled/**` and exits early when the index is unchanged. It stages only one of the four outputs the generator produces, guards its loop on a subject prefix and pushes with no retry. This plan stages all four files with a verification check, makes the loop guard exact, adds explicit error handling, and handles non-fast-forward races with one retry that regenerates and checks the index first. The token is left as it is, by operator decision on 2026-10-08.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented - spec.md sections 2 and 3
- [x] Success criteria measurable - three concrete scenarios in spec.md section 5
- [x] Dependencies identified - none for this phase

### Definition of Done
- [x] Acceptance criteria reviewed - each row in `acceptance-criteria.md` carries its test
- [x] Docs updated - spec, plan, tasks, acceptance criteria, and the workflow README
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Declarative configuration file. The workflow YAML chains multiple run steps with clear output handling and error signaling.

### Key Components
- **Checkout step**: Unchanged. The token stays as it is, by operator decision.
- **Loop guard**: The job-level `if:` skips only the job's own rebuild commit, by an exact subject match or a marker trailer the commit step writes.
- **Setup and build step**: Installs Node 22, the workspace and builds the shared package (already done in abb53ecc698).
- **Generator step**: Calls `generate-trigger-index.mjs` which writes four files (`trigger-index.json`, `corpus-manifest.json`, `generation-diagnostics.json`, `phrase-variants.json`).
- **Diff and stage step**: Verifies the index changed, stages all four files and validates they exist.
- **Commit step**: Commits with the rebuilt message.
- **Push with retry**: Catches non-fast-forward, fetches and rebases to the tip, regenerates the index, runs `--check`, retries once, and reports the final status clearly.

### Data Flow
A push to main or `skilled/**` triggers the workflow. The generator walks the specs tree and outputs the index plus three sidecar files. The job stages all four, commits them as one, and pushes. On a race it rebuilds on the new tip before pushing again.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.github/workflows/trigger-index-rebuild.yml` line 24 | Loop guard on a subject prefix | Update: exact subject match or marker trailer | A prefix-only commit still runs the job |
| `.github/workflows/trigger-index-rebuild.yml` lines 53-61 | File staging | Update: stage all four files and verify they exist | A commit check passes for all four file paths |
| `.github/workflows/trigger-index-rebuild.yml` lines 50-67 | Commit and push | Update: retry once after rebase, regenerate and `--check` | Non-fast-forward errors are retried once |
| `.github/workflows/README.md` | Documentation | Update: describe the four files, the loop guard and non-fast-forward recovery | Document is read and accurate |

Required inventories:
- Same-class producers: no other workflow rebuilds this index.
- Consumers of the changed behavior: the advisory check (`advisory-checks.yml`) reads the committed index with `--check` and never rewrites it.
- Matrix axes: main branch vs `skilled/**` branch, index changed vs unchanged, push succeeds vs non-fast-forward vs auth failure.
- Invariant: every pushed rebuild commit carries all four outputs, built from the tip it lands on and passing `--check`.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Workflow dispatch | Push the phase branch and trigger manually | GitHub Actions UI, workflow log inspection |
| Live test | Intentionally stale the index locally and run the workflow | Workflow dispatch on main with a clean commit |
| Loop guard | A commit whose subject only starts with the rebuild subject still runs the job | Workflow dispatch or a test push |
| File verification | Check that all four files are in the commit | Git log and commit contents |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Commit abb53ecc698 (npm ci and Node 22) | Internal | Complete | None, it is already shipped |
| The generator (generate-trigger-index.mjs) | Internal | Stable | Only reads the corpus, no changes needed |
| Token decision | Operator | Decided 2026-10-08: left as it is | None |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A critical bug in the push retry logic or the loop guard that causes the job to fail or loop on main.
- **Procedure**: `git revert` the commit. Manually run the index rebuild if main is stale.
<!-- /ANCHOR:rollback -->

---

