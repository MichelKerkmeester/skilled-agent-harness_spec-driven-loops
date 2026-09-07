---
title: "Implementation Plan: Harden CI mirror parity at commit time and remediate Dependabot alerts"
description: "Make the pre-commit hook run exactly what CI's mirror job runs and refuse unstaged mirror output, widen the workflow triggers to every mirror path, then lift each transitive advisory dependency with lockfile-only audit fixes and dismiss alerts on manifests that are not installed."
trigger_phrases:
  - "mirror parity gate plan"
  - "dependabot remediation plan"
  - "spec-kit check triggers"
  - "lockfile audit fix"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Harden CI mirror parity at commit time and remediate Dependabot alerts

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash (git hook), YAML (GitHub Actions), npm lockfiles |
| **Framework** | GitHub Actions, the spec-kit mirror sync scripts |
| **Storage** | None |
| **Testing** | Four-shape hook harness, vitest for the advisor package, `npm audit` |

### Overview
The hook gains a gate that runs the six mirror checks CI runs and scans the generated mirror outputs for unstaged or untracked changes. The workflow's `paths:` lists gain every mirror source and output. The four live lockfiles get `npm audit fix --package-lock-only`, each package is reinstalled and tested, and alerts on the two manifests that are never installed are dismissed with a reason.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fail-closed gate mirroring the CI job

### Key Components
- **Mirror-parity gate in the pre-commit hook**: a `script|flag` table of the six checks, iterated with `"${arr[@]}"` so zsh and bash agree, plus a `git diff` and `git ls-files --others` scan over the mirror output list.
- **Workflow trigger paths**: mirror sources (`.opencode/commands`, `.opencode/agents`, hub `command-metadata.json`) and outputs (`.codex`, `.claude`, `.cursor`, `.devin`, `.pi`).
- **Lockfile fixes**: transitive bumps only, within existing semver ranges.

### Data Flow
Commit → hook scans mirror outputs for dirt → runs six checks → blocks with the failing check's output, or passes → push → workflow now fires on the mirror path → CI runs the same six checks.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/scripts/git-hooks/pre-commit` | Global hook, symlinked from `~/.config/git/hooks`, shared by every checkout and worktree | update | Four-shape harness |
| `.github/workflows/spec-kit-check.yml` | Runs the six mirror checks on push and pull_request | update triggers only | Both branches green at the hardening commit |
| Six mirror check scripts under spec-kit runtime and doctor | Producers of the parity verdict | unchanged | Each exits 0 on a clean tree |
| Four `package-lock.json` files | Installed manifests | update | `npm audit` total 0, packages reinstalled, advisor vitest green |
| Two uninstalled manifests | Retired uv.lock, vendored research snapshot | not a consumer | Alerts dismissed with reason |

Required inventories:
- Same-class producers: the six checks are the full set named in the workflow's mirror step.
- Consumers of changed symbols: none, no symbol changed.
- Matrix axes: gate shape (clean, unregenerated, regenerated-untracked, incomplete catalog) × outcome (pass, block).
- Algorithm invariant: any state CI's mirror job would fail is refused before the commit exists.
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
| Unit | Gate blocks each failing shape and passes the clean one | Bash harness invoking the hook directly |
| Integration | Both branches' Spec-Kit Check runs on the hardening commit | `gh run list` |
| Regression | Advisor package after the lockfile bump, with the HEAD lockfile as negative control | vitest |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Six mirror check scripts | Internal | Green | Gate has nothing to run |
| GitHub Dependabot API | External | Green | Alerts cannot be dismissed from the CLI |
| Patched upstream versions | External | Green | `npm audit fix` finds no fix |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the gate blocks legitimate commits it should not, or a lockfile bump breaks a package.
- **Procedure**: `SPECKIT_SKIP_MIRROR_PARITY=1` bypasses the gate for one commit; `git revert 328accca03` restores the old hook and triggers; each lockfile reverts independently with `git checkout HEAD~1 -- <lockfile>` followed by `npm install`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Diagnose) ──► Phase 2 (Gate + triggers) ──► Phase 3 (Verify + push)
                  └──► Phase 2b (Dependabot) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Diagnose | None | Gate, Dependabot |
| Gate + triggers | Diagnose | Verify |
| Dependabot | Diagnose | Verify |
| Verify + push | Gate, Dependabot | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Diagnose | Low | 1 hour |
| Gate + triggers | Med | 2 hours |
| Dependabot | Low | 1 hour |
| Verification | Low | 1 hour |
| **Total** | | **5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes) - none needed, no data
- [x] Feature flag configured - `SPECKIT_SKIP_MIRROR_PARITY`
- [x] Monitoring alerts set - CI itself

### Rollback Procedure
1. Set `SPECKIT_SKIP_MIRROR_PARITY=1` for the blocked commit.
2. Revert the hardening commit if the gate is wrong in general.
3. Re-run the four-shape harness after any hook change.
4. Notify the other live session, since the hook is global.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
