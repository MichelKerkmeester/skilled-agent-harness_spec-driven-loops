---
title: "Implementation Plan: Doctor guard and sync messages"
description: "Change three messages so each names its fix, add an authored-root check to sync and a missing-authored-manifest failure to the guard, each with one test in an existing test file, and prove them in throwaway copies."
trigger_phrases:
  - "doctor guard sync messages plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Doctor guard and sync messages

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS and a YAML command asset |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` on the doctor invariants and `compiled-route-manifest.test.cjs`; the doctor `run-all.sh` |

### Overview
Three message edits and two failure classes. The guard and sync changes are in place: an existence check before the first filesystem read of the authored root in sync, and a branch in `authoredDrift` that reports a missing authored manifest instead of returning `null`. Each change gets one test that fails before it, and copy runs prove the user path end to end.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail with a named cause and the next action

### Key Components
- **`compiled-route-sync.cjs`**: resolves `SPECS_ROOT` with `fs.realpathSync` at load (line 39), so a missing `specs/` throws before any message; the fix checks the authored program folder first
- **`authoredDrift(hubId)`** in `compiled-route-guard.cjs:63-71`: compares runtime and authored manifests byte for byte and returns `null` when either is missing
- **The guard summary** at `compiled-route-guard.cjs:155-170`: prints one line per failure reason
- **3c** in `parent-skill-check.cjs:495-497` and the `compiled_routes` row in `doctor-update-apply.yaml:157-160`

### Data Flow
The doctor and CI run the guard; the guard reads runtime and authored manifests and prints a verdict; sync `--check` compares served copies with the authored closure. The pre-commit gate `gate:route-remint` re-mints and copies the manifest at commit, which the repair string may name as the alternative to a hand copy.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `parent-skill-check.cjs` 3c | Reports a missing packet dir | Update message | T1, P9-1 |
| `doctor-update-apply.yaml` `compiled_routes` | Repair text the doctor prints | Update | P9-3 |
| `compiled-route-guard.cjs` | Freshness verdict for CI and the doctor | Update line, add failure class | T2, T4, P9-2, P9-5 |
| `compiled-route-sync.cjs` | Served-copy check and rebuild | Add authored-root check | T3, P9-4 |
| `.github/workflows/routing-registry-drift.yml` | Runs the guard in CI | Unchanged; its verdict on the pristine tree stays exit 0 | Criterion 3 |

Required inventories:
- Consumers of the guard's reason strings: `grep -rn "authored-drift\|stale-manifest" .skilled .github` before adding the new reason, so every consumer handles it or is shown not to need to.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

Copy recipe, from research run V0: under the session scratchpad, copy `.skilled` without `node_modules` and symlink each `node_modules` read-only to the worktree's; copy `specs/sk-doc/z_archive/019-skill-routing-refactor/`; copy `README.md`, `PUBLIC-RELEASE.md`, `.github` and `.opencode` with `cp -RP`. Variants: delete `sk-code-webflow/` (P9-1); reorder `tieBreak` to `[sk-code-quality, sk-code-review, sk-code-webflow, sk-code-obsidian, sk-code-opencode]` and refresh (P9-2, P9-3); drop `specs/` entirely, and keep `specs/` with the 019 folder removed (P9-4, P9-5).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | T1 to T4, one per change | `node --test` |
| Integration | The doctor and compiled-route suites | `run-all.sh`, `compiled-route-manifest.test.cjs` |
| Copy runs | P9-1 to P9-6 | The doctor, guard and sync in throwaway copies |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 026 planning commit on origin/main | Internal | Waits on the operator's merge | The worktree lacks this spec folder |
| Phase 004 | Internal | Downstream | 004 branches from this phase's finished branch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The guard or sync turns red on the pristine tree or in CI.
- **Procedure**: Revert this phase's commits; the old messages and verdicts return.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Worktree, four copies, baselines |
| Core Implementation | Med | Four changes and four tests |
| Verification | Med | Copy runs and a five-iteration review |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Baseline counts of the three suites recorded

### Rollback Procedure
1. Revert the phase commits.
2. Rerun the guard, sync `--check` and the doctor on the live tree.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A; every change is a tracked file
<!-- /ANCHOR:enhanced-rollback -->
