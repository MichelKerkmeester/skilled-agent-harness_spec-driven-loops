---
title: "Implementation Plan: Remove the Superset/Copilot hook bridge"
description: "Removal plan for the checked-in Superset/Copilot hook bridge: 6 outright deletes, 5 surgical edits that preserve spec-kit Copilot priming, and a purge of the local untracked root config. Sequenced deletes-then-edits-then-verify, with a path-scoped single-commit rollback."
trigger_phrases:
  - "superset removal plan"
  - "copilot hook bridge teardown"
  - "remove superset-notify"
  - "decommission superset"
importance_tier: "important"
contextType: "implementation"
parent: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge"
_memory:
  continuity:
    packet_pointer: "sk-doc/015-sk-doc-parent/027-catalog-naming-convention/004-remove-superset-copilot-hook-bridge"
    last_updated_at: "2026-07-12T11:02:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Removal plan executed"
    next_safe_action: "Commit path-scoped after strict validate"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Remove the Superset/Copilot Hook Bridge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `.github/hooks/` (repo-root) + `system-spec-kit` / `sk-code` / `system-skill-advisor` hook docs & tests |
| **Change class** | Removal (6 deletes) + surgical edit (5 files) + local-file purge (1 untracked) |
| **Testing** | vitest (spec-kit MCP `copilot-hook-wiring` removed; skill-advisor `hooks-parity-stress` edited) |
| **Runtime dependency** | `~/.superset/hooks/copilot-hook.sh` — out of repo, operator-owned, out of scope |

### Overview
Strip every repo-tracked artifact of the Superset/Copilot bridge. The only subtlety is that two files
(`session-start.sh`, `user-prompt-submitted.sh`) are shared with the spec-kit's own Copilot session-priming, so they
are edited (remove the trailing `~/.superset` call block) rather than deleted. Everything lands in one path-scoped
commit so a single `git revert` restores the bridge.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Manifest confirmed against the live tree (11 tracked files + 1 untracked local)
- [x] Delete-vs-edit split decided per file (load-bearing files edited, not deleted)
- [x] Rollback defined (path-scoped commit + scratchpad backup of the untracked file)

### Definition of Done
- [ ] All 6 deletes + 5 edits applied; local root config purged
- [ ] Affected vitest suites green (parity test) / cleanly removed (wiring test)
- [ ] Live-tree grep for the bridge returns zero
- [ ] `validate.sh --recursive --strict` Errors 0 on parent + child
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Removal Approach
The bridge is a fan-out: a `superset-notify.json` config (declaring all four Copilot events route to
`~/.superset/hooks/copilot-hook.sh`) propagated into three subdirectory `.github/hooks/` copies, a notify-wrapper
shell script, a trailing call block appended to the two spec-kit lifecycle scripts, plus a README, two docs, and two
tests that assert the wiring.

### Component Disposition
- **Config copies (3) + wrapper (1) + README (1) + wiring test (1)** → delete outright (nothing else depends on them).
- **Lifecycle scripts (2)** → keep the `*-prime.js` / `*-submit.js` priming and fallback; delete only the trailing
  `if [ -x "~/.superset/hooks/copilot-hook.sh" ]; then ... fi` block.
- **Parity test (1)** → drop the `COPILOT_SETTINGS` constant and its one assertion; keep the Claude + OpenCode arms.
- **Docs (2)** → remove the lines that name `superset-notify.json` / the wrapper.
- **Untracked root config** → back up, `rm`, drop the `.git/info/exclude` line.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Deletes
- [ ] `git rm` the wrapper, the 3 propagated configs, the README, and the wiring test

### Phase 2: Surgical Edits
- [ ] Strip the `~/.superset` block from the two lifecycle scripts
- [ ] Remove the superset lines from `hook_system.md` + `sk-code hooks.md`
- [ ] Drop the Copilot/superset arm from `hooks-parity-stress.vitest.ts`

### Phase 3: Local Purge + Verify
- [ ] Back up + `rm` the untracked root config; drop the `.git/info/exclude` line
- [ ] Run the affected vitest suites; live-tree grep gate; strict validate
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit/wiring | skill-advisor `hooks-parity-stress` (edited) passes; spec-kit `copilot-hook-wiring` removed | vitest |
| Static | Live-tree grep for `superset-notify` / `.superset/hooks/copilot-hook` = 0 | ripgrep |
| Doc | Whole-workspace markdown-link guard clean | check-markdown-links |
| Spec | `validate.sh --recursive --strict` Errors 0 | spec-kit validator |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `~/.superset/hooks/copilot-hook.sh` | External (operator) | Out of scope | Its callers vanish; operator uninstalls separately |
| spec-kit `session-prime.js` / `user-prompt-submit.js` | Internal | Green | Must remain invoked after the edit |
| vitest | Internal | Green | Cannot verify parity test |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: spec-kit Copilot priming breaks, or a needed reference was removed
- **Procedure**: `git revert <commit>` restores all tracked files; copy the scratchpad backup back to
  `.github/hooks/superset-notify.json` and re-add the `.git/info/exclude` line to restore the local wiring
<!-- /ANCHOR:rollback -->

<!-- ANCHOR:l2-phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Deletes) ──> Phase 2 (Edits) ──> Phase 3 (Purge + Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Deletes | None | Edits |
| Edits | Deletes | Verify |
| Purge + Verify | Edits | None |
<!-- /ANCHOR:l2-phase-deps -->

<!-- ANCHOR:l2-effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Deletes | Low | 5 minutes |
| Surgical edits | Low-Medium | 20 minutes |
| Purge + verify | Low | 15 minutes |
| **Total** | | **~40 minutes** |
<!-- /ANCHOR:l2-effort -->

<!-- ANCHOR:l2-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-removal Checklist
- [x] Untracked root config backed up to scratchpad
- [x] All 11 target files confirmed clean (untouched by the concurrent session)
- [x] Manifest reviewed for load-bearing vs pure-superset

### Rollback Procedure
1. `git revert <removal-commit>` → restores the 6 deletes + 5 edits
2. Restore local wiring: `cp scratchpad/superset-notify.root.json.bak .github/hooks/superset-notify.json`
3. Re-add `.github/hooks/superset-notify.json` to `.git/info/exclude`
4. Verify: `hooks-parity-stress` + `copilot-hook-wiring` suites green again

### Data Reversal
- **Has data migrations?** No — file removals only, fully git-reversible
<!-- /ANCHOR:l2-rollback -->
