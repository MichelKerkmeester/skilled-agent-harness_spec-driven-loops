---
title: "Implementation Plan: Phase 14: doctor-and-ci-gate-honesty"
description: "Change each doctor checker and CI workflow where it decides its exit or what it runs, prove each with a test that failed before, and rerun the doctor, sk-git, mirror and route checks against their baselines."
trigger_phrases:
  - "doctor and ci gate honesty plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 14: doctor-and-ci-gate-honesty

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS doctor scripts, bash, GitHub Actions YAML, doctor route YAML and text contracts |
| **Framework** | `/doctor:*` routes and their contract tests |
| **Storage** | None |
| **Testing** | `node --test` doctor suites, five sk-git suites, `.skilled/vitest.config.bin.ts`, `check-agent-mirror-sync.cjs --all`, `route-validate.sh` |

### Overview
Each gate changes where it decides what it reports: the symlink check's exit, the parity verifier's tree list, the runtime-mirrors step list and two CI workflows. P2 messages that misled are reworded or their exits corrected.
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
- [x] Doctor, sk-git, bin vitest, mirror parity and route checks keep every baseline pass; the six manifest-caused doctor failures are unchanged
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fix at producer.

### Key Components
- **`symlink-engine.cjs` and the symlink route contract**: decides check exit and report shape
- **`mirror-sync-verify.cjs`, `check-agent-mirror-sync.cjs`**: agent body parity across runtime trees
- **`doctor-runtime-mirrors.yaml`, `_routes.yaml`**: which checkers the route runs
- **`.github/workflows/`**: what CI runs

### Data Flow
A doctor route runs a checker, reads its exit and renders a STATUS line; CI runs suites and checks on push and pull request.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `symlink-engine.cjs check` | symlink and install routes | update exit | symlink-engine tests |
| Install route and presentation | reads check output | update wording | contract test |
| `mirror-sync-verify.cjs` | parity gate | update | bin vitest |
| `doctor-runtime-mirrors.yaml` | route | add step | contract test, route-validate |
| sk-git and advisory workflows | CI | add steps | yaml parse, local suite runs |
| P2 scripts | doctor helpers | update messages and exits | their tests |

Required inventories:
- Callers of `symlink-engine.cjs check`: only route contracts, the playbook and tests; no hook or CI job reads its exit.
- Callers of `orphan-process-check.cjs`: `/doctor:setup` reports it informationally and never changes setup status on its exit.
- Matrix axes: entry status (missing, local, project-owned, linked, broken, foreign-link, partial-merge with and without broken links, source-missing, tracked absolute link) by exit.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: setup records baselines, implementation sends one worker brief per change group, verification reruns the probes and the baseline suites.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | each changed exit and status | `node --test`, vitest bin config |
| Integration | route parity | `route-validate.sh` |
| Manual | suites the new CI steps run | bash and node locally |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 013 operator write | Internal | Red | the advisory manifest step stays red, report-only |
| cli-codex Luna and cli-pi DeepSeek | External | Green | each other |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a baseline-passing test fails after the change.
- **Procedure**: `git revert <phase commit>` in the worktree.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (baselines, negative controls) | None | Implementation |
| Implementation (worker briefs) | Setup | Verification |
| Verification (probes, suites, cross-family review) | Implementation | Close and commit |
<!-- /ANCHOR:phase-deps -->

---
