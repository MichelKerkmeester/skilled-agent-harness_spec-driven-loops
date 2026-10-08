---
title: "Implementation Plan: External-user compatibility path for /doctor:update"
description: "A read-only compatibility section in `/doctor:update check` and a separate action for layout move and upgrade-legacy apply, with preview and collision checking."
trigger_phrases:
  - "doctor update compatibility plan"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: External-user compatibility path for /doctor:update

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js, YAML (workflow), Bash (scripts) |
| **Framework** | Doctor update command, spec-kit tools |
| **Storage** | File system tree operations, baseline JSON |
| **Testing** | Bash tests, manual verification with fixture repos |

### Overview
A new YAML workflow provides the external-user path: `/doctor:update check` shows era report and compatibility findings, and a separate gated action runs layout move with collision checking and `upgrade-legacy --apply` with baseline recording, outside the release transaction.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:architecture -->
## 2. ARCHITECTURE

### Pattern
External-facing command workflow with mandatory preview and approval steps.

### Key Components
- **Compatibility check** (doctor-update-check.yaml): calls era report, shows layout and signals, recommends repair stages.
- **Path map collision checker**: detects folder name collisions during v3 to v4 layout move (reusable function in upgrade-legacy.mjs).
- **Layout move executor**: runs the printed recipe, logs each step, handles interruption recovery.
- **Upgrade executor**: calls `upgrade-legacy --apply` with baseline recording, limits rollback to its own units.
- **Presentation menu**: shows compatibility option and results in `/doctor:update` output.

### Data Flow
1. User runs `/doctor:update check`.
2. Check workflow calls era report and collects layout, signals, repair stages.
3. Presentation shows layout and signal summary, offers compatibility action option.
4. User runs the compatibility action.
5. Action runs path map preview and collision check (no writes yet).
6. Action prints path map and asks for approval.
7. User approves (or cancels).
8. Action runs layout move in logged steps.
9. Action runs `upgrade-legacy --apply` with before-image manifest.
10. Action reports repair summary and rollback procedure.

### Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `/doctor:update check` | Release readiness check, `.skilled/` units only | Add compatibility section that calls era report and shows layout/signals | Test with fixture repo showing era signals |
| `/doctor:update` routes | Maps phrases to workflows; phrase "spec-kit version migration" exists on the route | Create the compatibility action workflow that the existing route will trigger | Verify phrase triggers compatibility section |
| `upgrade-legacy.mjs` | Validates and repairs failing packets | Add path map collision-check function (reusable) | Test function on fixture paths with collisions |
| Doctor presentation assets | Shows menu options and results | Add compatibility option, show results | Manual verification that menu option appears |
| External user workflow | No existing path | Create: check → preview → approve → apply | Test with fixture v3 repo from check through apply |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:testing -->
## 3. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Path map collision checker function | Node.js test with fixture paths |
| Integration | `/doctor:update check` calls era report and shows results | Bash test with fixture repo |
| Integration | Compatibility action workflow: preview, approval, apply | Bash test with fixture v3 repo to v4 conversion |
| Manual | Full external-user workflow on a real v3 repo | Manual execution by operator |
| Performance | Path map collision check on large tree | Timing on 4,000+ packet corpus |
<!-- /ANCHOR:testing -->

### Test Coverage
- **Collision detector**: Fixture paths with name collisions at different tree levels (same-named sibling in v3 and v4).
- **Compatibility check workflow**: Fixture repo with v3 layout, old-era packets; verify output shows layout, signals, and repair stages.
- **Layout move simulation**: Fixture with controlled paths; verify move recipe and logging.
- **Approval flow**: Test with approval, cancellation, and dirty tree scenarios.
- **Full integration**: A fixture v3 repo from check through apply to v4, all packets passing strict validation.

---

<!-- ANCHOR:dependencies -->
## 4. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 8 era report (`repo-era.mjs`) | Internal | Blocker | Compatibility check cannot show signals |
| Phase 5 healer fix | Internal | Blocker | Doctor ships a tool that violates validator rules |
| Phase 6 provenance fix | Internal | Blocker | Doctor ships invented template versions |
| Phase 10 reversibility | Internal | Blocker | The action runs `upgrade-legacy --apply` with no undo record |
| `upgrade-legacy.mjs` existing behavior | Internal | Green | Fail-closed apply, baseline recording, v3 detection already in place |
| Node.js ES modules, Bash | External | Green | Standard runtime, no new setup |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 5. ROLLBACK PLAN

- **Trigger**: Compatibility action produces wrong path map or collisions are not caught.
- **Procedure**: Revert the commit. `/doctor:update check` shows only `.skilled/` units. Users cannot run the compatibility action. Fallback: print the manual recipe in the check output.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup (YAML workflows, collision checker) | Med | 2-3 hours |
| Core (integration, logging, approval flow) | Med | 4-6 hours |
| Verification (tests, manual runs on real repo) | Med | 3-4 hours |
| **Total** | | **9-13 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Compatibility check is read-only (no mutations)
- [ ] Layout move is logged at each step for recovery
- [ ] Collision detection tested on fixture paths
- [ ] Before-image manifest requirement is enforced

### Rollback Procedure
1. User revert the commit or disable the compatibility action route.
2. Clear any in-flight layout move state (git status shows what is moved).
3. Restore from before-image manifest if upgrade was interrupted.
4. Re-run compatibility action to finish or recover.

### Data Reversal
- Has data mutations? Yes, layout move and spec upgrades.
- Reversal procedure: Git history + before-image manifest records the pre-move state; user can restore from either.
<!-- /ANCHOR:enhanced-rollback -->

---

