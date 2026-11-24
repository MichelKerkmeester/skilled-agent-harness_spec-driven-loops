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
    last_updated_at: "2026-11-24T18:39:55Z"
    last_updated_by: "generate-context"
    recent_action: "Recorded the decisions that opened and scoped this packet"
    next_safe_action: "None; packet complete"
    packet_purpose: "Purpose: A package with its own `package-lock.json` counts as installed only when its dependency is under its own install root, so every new worktree provisions with no failed build."
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:f4195d447f93f7d39dfd1a4b27f2b296961ee1d8a492f124f77437b273963b92"
      session_id: "scaffold-007-provision-dev-dependencies"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "ff6a7339-90f8-496d-b18b-2c3b56947423"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-24T18:39:55Z"
      locatorKind: "transcript_path"
      version: 1
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
| `.skilled/skills/sk-git/changelog/v1.11.13.0.md`, `SKILL.md` | Created/Modified | Release coverage at 1.11.13.0 |
| `.skilled/manual-testing-playbook/doctor-commands/doctor-mcp-install.md` | Modified | The approved npm install restores Code Mode's `node_modules`; provisioning never did |
| `.skilled/skills/sk-git/SKILL.md`, `changelog/v1.11.14.0.md` | Modified/Created | Only `provision` is idempotent; `create` allocates a new worktree each time |
| `.github/workflows/README.md`, `job-shape-rules.md`, `SECURITY.md` | Modified | Correct accounts of the setup action's callers and what provisioning checks and installs |
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
| `validate_document.py` on the v1.11.13.0 changelog | PASS, `Total issues: 0` |
| `grep -n 'actions/setup$' .github/workflows/*.yml` against `job-shape-rules.md:119` | PASS, lines 63, 103, 103, 145 and 266 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Existing worktrees keep their partial install.** A worktree created before this fix still lacks system-spec-kit's dev dependencies. Run `worktree-naming.sh provision <path>` once to install them.
<!-- /ANCHOR:limitations -->

---
