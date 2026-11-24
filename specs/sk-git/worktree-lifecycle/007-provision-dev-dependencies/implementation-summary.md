---
title: "Implementation Summary: provision a nested npm package"
description: "New worktrees now install system-spec-kit and build all four outputs that used to fail."
trigger_phrases:
  - "provision dev dependencies implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-git/worktree-lifecycle/007-provision-dev-dependencies"
    last_updated_at: "2026-11-24T11:29:35Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Fixed the npm walk boundary and added the regression case"
    next_safe_action: "Operator review, then commit and push the worktree branch"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-provision-dev-dependencies"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-provision-dev-dependencies |
| **Completed** | 2026-11-24 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A new worktree now installs system-spec-kit's own dependencies, so the spec-kit runtime, the spec-kit CLI, the session-handover history and the skill-advisor runtime all build. Before, all four failed in every new worktree, and the fix by hand was `npm ci --include=dev`.

### The npm walk stops at the package's install root

Provisioning decides a package is installed when it finds the package's first dependency in a `node_modules` folder, walking up the tree. The walk used to run all the way to the worktree root. `.skilled` installs `@types/node` before system-spec-kit is checked, and `@types/node` is also system-spec-kit's first dependency, so system-spec-kit looked installed when it was not. The walk now stops at the nearest folder holding a `package-lock.json`, because npm installs a package there. A workspace member has no lockfile, so its walk still reaches the workspace root, where npm put its packages.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-git/scripts/worktree-naming.sh` | Modified | `_wn_npm_install_root` sets the npm walk boundary |
| `.skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | Modified | Regression case for a nested lockfile package and a workspace member |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The failure was reproduced by creating worktree 536. The new test case was run against the HEAD script, where it failed, and then against the fix, where it passed. The real worktree was then re-provisioned with the fixed script.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Bound the walk at the lockfile folder instead of checking every dependency | The probe was wrong about where to look, not about what to look for. Checking every name would catch this case only because `.skilled` happens to lack `typescript`; an ancestor that held every name would still be misread |
| Keep the first-dependency probe | The earlier provisioning packet chose it on purpose for hoisted workspace members, and it stays correct inside the right boundary |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash .skilled/skills/sk-git/scripts/tests/worktree-naming.test.sh` | PASS, `PASS=178 FAIL=0` |
| Same suite against the HEAD script | Fails as expected, `PASS=177 FAIL=1` on the new case |
| `worktree-naming.sh provision` on worktree 536 | PASS, `provisioned: 1 installed, 4 built, 13 already present, 0 failed` |
| `shellcheck -S warning worktree-naming.sh` | 2 warnings, the same 2 as at HEAD |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Existing worktrees keep their partial install.** A worktree created before this fix still lacks system-spec-kit's dev dependencies. Run `worktree-naming.sh provision <path>` once to install them.
<!-- /ANCHOR:limitations -->

---
