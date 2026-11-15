---
title: "Implementation Summary"
description: "The Cursor Task guard case now dispatches a registered deep agent, and the AGENTS.md manifest's v4.0.0.14 history body matches the text it shipped with, so OpenCode Plugin Tests and Spec-Kit Check pass locally."
trigger_phrases:
  - "ci red checks after council retirement implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/027-ci-red-checks-after-council-retirement"
    last_updated_at: "2026-11-15T17:00:00Z"
    last_updated_by: "template-author"
    recent_action: "Fixed the two red CI workflows"
    next_safe_action: "Commit, push and confirm both workflows on the new head"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-ci-red-checks-after-council-retirement"
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
| **Spec Folder** | 027-ci-red-checks-after-council-retirement |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Cursor Task guard case again proves that a mode mismatch is denied, because it now dispatches `deep-review`, a registered deep agent, with a research mode. The manifest's history again records what v4.0.0.14 shipped: its Gate 3 body says "session-relaunch handoff note", the wording of that release.

### Phase 27: ci-red-checks-after-council-retirement

The council retirement moved the sibling guard tests to `deep-review` and missed this one. Two rename sweeps for session handover rewrote the shipped body inside the manifest's history. `agents-md-manifest.cjs --write` rebuilt the history from the release tags and changed only that one line.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` | Modified | Task guard case agent |
| `.skilled/commands/doctor/assets/agents-md-manifest.json` | Modified | Restored history body |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Both failing tests were read in the CI logs and reproduced locally. Each workflow step then ran with its exact command, after provisioning the worktree's dependency trees as the workflow's setup action does.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Restore the history body rather than accept the renamed text | The history records what a release shipped, and the test exists to catch a body edited after the fact |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Hook and Vibe repo-guard `node:test` suites | 1837 pass, 0 fail |
| Plugin suites | 591 pass, 0 fail |
| Hook installer test | exit 0 |
| Doctor `run-all.sh` | 7 suites passed, 0 failed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A rename sweep can rewrite a history body again.** Nothing stops the edit, but the manifest test fails on it and the generator restores it.
<!-- /ANCHOR:limitations -->

---
