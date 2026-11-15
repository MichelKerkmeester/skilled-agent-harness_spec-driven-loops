---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "hub two mode wiring implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/002-hub-two-mode-wiring"
    last_updated_at: "2026-11-15T01:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed child 002 with every acceptance row Met"
    next_safe_action: "Close child 003"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-hub-two-mode-wiring"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-hub-two-mode-wiring |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The deep-loop hub routes two modes, research and review. The `ai-council` mode, the `deep-ai-council` packet and the `/deep:ai-council` command are deleted, and a council prompt defers at the hub.

### Phase 2: hub-two-mode-wiring

The registry, the hub router, the root router, the graph metadata and the command metadata each listed a third mode. Every one now lists two, and the contract compiler knows two commands. You run `/speckit:ai-council` for a council and nothing in the hub claims that request.

The packet's 20 changelog entries stay as a real folder under `.skilled/changelog/system-deep-loop/deep-ai-council/`, so the history is still readable. The hub moved to version 2.0.0.0 because a command and a mode were removed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/mode-registry.json`, `hub-router.json`, `ROUTER.md` | Modified | Two modes, and no `council` loop type |
| `.skilled/skills/system-deep-loop/graph-metadata.json`, `command-metadata.json`, `description.json` | Modified | Hub metadata without the council |
| `.skilled/skills/system-deep-loop/deep-ai-council/` | Deleted | The mode packet, 139 files |
| `.skilled/commands/deep/ai-council.md` and its two workflow files | Deleted | The retired command, with its compiled contract and runtime mirrors |
| `.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs`, `render-command-contract.cjs` | Modified | Two commands, and no in-CLI seat branch |
| `.skilled/skills/system-deep-loop/SKILL.md`, `README.md`, `ARCHITECTURE.md`, catalog and playbook | Modified | Hub docs for two modes. Three council-only playbook scenarios are deleted |
| `.skilled/skills/system-deep-loop/shared/behavior-benchmark/` | Modified | The runner drops the `seat_artifacts` evidence kind and the `ACB` prefix |
| `.skilled/skills/system-deep-loop/leaf-manifest.json` and the compiled-route manifests | Regenerated | Derived routing data |
| `.skilled/skills/system-deep-loop/changelog/v2.0.0.0.md` | Created | The breaking release entry |
| `.skilled/skills/sk-doc/sk-create-command/SKILL.md` | Modified | Its example names a workflow file that exists |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Three DeepSeek dispatches did the hub JSON, the contract compiler and the hub docs, and each diff was read and its checks rerun before staging. The work is in commit `adbba5a06a` together with child 004. The commit gate runs `parent-skill-check.cjs`, whose row 4b compares the hub registry with the advisor's mode map, so the two children could not be committed apart.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Version 2.0.0.0 | Removing a mode and a command breaks anyone who called them. The version rules name that a major change. |
| One commit for children 002 and 004 | The pre-commit hub check fails when the registry and the advisor map disagree, and each child changes one side. |
| The changelog folder stays | It is history. The sweep allowlist names it. |
| Three council-only playbook files were deleted by hand | The docs brief was limited to edits, and a scenario for a deleted mode has nothing left to test. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Modes in `mode-registry.json` | `research review`, loop types `research review` |
| `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/system-deep-loop` | `declares 2 modes`, `OK: parent-skill-check` |
| `node runtime/scripts/check-contract-drift.cjs` | `[CONTRACT DRIFT] OK commands=2` |
| `node .skilled/bin/compiled-route-guard.cjs` | All hubs fresh |
| `git ls-files .skilled/skills/system-deep-loop/deep-ai-council` | Prints nothing |
| `ls .skilled/changelog/system-deep-loop/deep-ai-council \| wc -l` | Prints 20 |
| `validate.sh` on this folder with `--strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Old links into the packet are dead.** A doc outside this repository that names `system-deep-loop/deep-ai-council/` points at nothing. Point it at `.skilled/agents/ai-council.md`.
<!-- /ANCHOR:limitations -->

---


