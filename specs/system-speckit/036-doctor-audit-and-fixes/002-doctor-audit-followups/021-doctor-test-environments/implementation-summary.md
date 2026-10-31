---
title: "Implementation Summary"
description: "Two long-lived local worktrees now back the doctor scenarios: an update fixture from v4.0.0.0 with one unit of each status, and a current-code environment that follows main."
trigger_phrases:
  - "doctor test environments summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/021-doctor-test-environments"
    last_updated_at: "2026-10-04T19:10:00Z"
    last_updated_by: "doctor-test-environments"
    recent_action: "Built both test environments and proved the fixture's statuses and reset"
    next_safe_action: "Fix the engine's symlinked-parent crash and remove the fixture workaround"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/manual-testing-playbook/doctor-commands/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "doctor-test-environments"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 021-doctor-test-environments |
| **Completed** | 2026-10-04 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The doctor scenarios now have state to run against, and the update fixture found an engine crash on its first check.

### Phase 21: doctor-test-environments

- **Update fixture.** `.worktrees/.doctor-update-test-environment` links to `087-doctor-update-test-environment`, created from `v4.0.0.0`. It carries the current updater, a customized `sk-code-webflow`, a local `sk-code-web-dev` packet, the 10-file Barter sk-git and a recorded v4.0.0.0 base, each as its own commit.
- **Fixture tag.** `v4.0.0.3-fixture` is `v4.0.0.2` without `sk-code-obsidian`, built from a temporary index so no branch was created.
- **Current-code environment.** `.worktrees/.doctor-test-environment` links to `088-doctor-test-environment`, which follows `origin/main` and has no dependencies installed yet.
- **Engine crash found.** v4.0.0.0 ships `.skilled/changelog/sk-design` as a symlink and later releases ship a folder. `check` aborts on that symlinked parent even when scoped elsewhere. The fixture works around it until the engine is fixed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.worktrees/087-doctor-update-test-environment/` | Created (local) | The update fixture |
| `.worktrees/088-doctor-test-environment/` | Created (local) | The current-code environment |
| Two symlinks under `.worktrees/` | Created (local) | The requested names |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both worktrees came from `worktree-naming.sh create` with `--no-provision`. Fixture commits use the mirror-parity and route-remint bypasses the v4.0.0.0 hooks name, because those hooks need dependencies the fixture lacks. The checks and the round trip ran against the finished fixture.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Numbered worktrees with dot-name symlinks | The operator chose this over a name outside the sk-git allocator grammar |
| One commit per customization | Each unit status then traces to one commit, which makes a rebuild or a status change easy to diagnose |
| Work around the engine crash in the fixture first | The operator chose a workaround now and an engine fix in a follow-up phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Scoped check against `v4.0.0.2` | `sk-code-webflow` customized (149 same, 1 local-only, 2 take-release), `sk-code-web-dev` local, `sk-git` conflict (30 conflict, 105 local-only) |
| Scoped check against `v4.0.0.3-fixture` | `sk-code-obsidian` removed (61 take-release) |
| Apply and rollback round trip | Apply wrote 2 changelogs, `base.json` and `divergence.json`. Rollback restored 4 paths with `skipped` empty, and status and checksums match the committed state |
| Remote | `git ls-remote --tags origin v4.0.0.3-fixture` prints nothing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The engine still aborts on a symlinked parent.** The fixture's workaround commit hides it until the follow-up fix lands.
2. **The current-code environment has no dependencies installed.** Scenarios that need a built runtime provision it first, which installs packages and needs the operator's approval.
<!-- /ANCHOR:limitations -->

---
