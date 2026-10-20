---
title: "Implementation Summary"
description: "The doctor battery now judges a worktree nested inside another checkout on OpenCode 2. It used to fail all 17 plugins there, because OpenCode 2 merges every ancestor `.opencode` and the outer checkout's plugins shadowed the worktree's as duplicate IDs."
trigger_phrases:
  - "nested worktree battery implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/030-nested-worktree-battery"
    last_updated_at: "2026-10-20T16:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed the nested-worktree battery, three review rounds addressed"
    next_safe_action: "Luna round 4, then merge origin/main, push and watch CI"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/opencode-version-battery.cjs"
      - ".skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "g030-nested-worktree-battery"
      parent_session_id: null
    completion_pct: 80
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
| **Spec Folder** | 030-nested-worktree-battery |
| **Completed** | Implementation 2026-10-20; review, validation and CI closure pending |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now run the doctor battery inside a `.worktrees/NNN-slug` worktree and get a real answer on OpenCode 2. Before, every plugin showed as failed there while a plain checkout and CI passed. The cause turned out to be OpenCode 2 itself, not the plugins: it merges the `.opencode` folder of every ancestor directory, so the main checkout's 17 plugins registered first and the worktree's 17 failed with `Duplicate plugin ID`.

### Phase 30: nested-worktree-battery

The battery now looks for a `.opencode/plugins` folder above the root. Only when it finds one does it start the private v2 server with `OPENCODE_CONFIG_PROJECT_DISABLE=1` and `OPENCODE_CONFIG_DIR=<root>/.opencode`, the two switches OpenCode 2 reads, so it loads the root's own plugins. The plugin-active result says so in an `isolated:` line naming each outer folder. If OpenCode 2 ever ignored those switches, the outer entries would come back, and the battery now fails on them instead of passing. A plain checkout and CI keep OpenCode 2's normal discovery.

The bigger consequence is for real sessions: an OpenCode 2 session started in a nested worktree runs the main checkout's plugin code, so a plugin change made in the worktree does nothing there. `ARCHITECTURE.md` and the sk-git worktree reference now say this and give the command that loads the worktree's own plugins.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/opencode-version-battery.cjs` | Modified | `ancestorPluginDirs`, `v2ServerEnv`, the `isolated:` note, the ancestor-entry check and the isolation-aware command allowlist |
| `.skilled/commands/doctor/scripts/tests/opencode-version-battery.test.cjs` | Modified | A fake OpenCode 2 under an outer checkout and one that ignores the switches; seven nested tests; plain-root assertions with a clean environment |
| `.opencode/plugins/ARCHITECTURE.md` | Modified | The battery paragraph and a known limit |
| `.skilled/skills/sk-git/references/worktree-workflows.md` | Modified | A troubleshooting entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

I reproduced the failure in worktree 169 and read the private server's plugin list, which showed the duplicate IDs. A plain clone under the scratchpad passed, and OpenCode 1 loaded only the worktree's plugins. The OpenCode 2 source shows a walk with no stop bound and the two switches. DeepSeek v4.1 flash wrote the code and doc edits from literal briefs. I wrote the spec documents and ran every check myself. Luna reviewed read-only.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fix the battery instead of documenting the failure | OpenCode 2 reads two switches that stop the walk, so the battery can judge the root's own plugins with a supported mechanism |
| Isolate only when an ancestor plugin folder exists | CI and plain checkouts keep testing the discovery path real sessions use |
| Fail an isolated read that carries ancestor entries | A future OpenCode 2 that ignored the switches must not pass on the root's active copies |
| Record, not change, how real sessions start in worktrees | Changing every session's startup is a behavior change outside this phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Battery test suite | PASS, 45 of 45 (37 at baseline), `scratch/mutation/after-r4.txt` |
| Mutation runs m1 to m8 | Each fails at least one test, `scratch/mutation/` |
| Live battery, worktree 169, both families | PASS, exit 0, v2 with an `isolated:` line (`scratch/rootcause/after-r4-both.json`) |
| Live battery, plain clone, both families | PASS, exit 0, no `isolated:` line (`scratch/rootcause/after-r2-plain-both.json`) |
| OpenCode 1 origins in worktree 169 | 17 from the worktree, 0 from the outer checkout (`scratch/rootcause/v1-origins.json`) |
| Luna review | Rounds 1 to 4 FAIL, each finding fixed; round 5 pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Real OpenCode 2 sessions in a nested worktree still run the outer checkout's plugins.** Start one with `OPENCODE_CONFIG_PROJECT_DISABLE=1 OPENCODE_CONFIG_DIR="$PWD/.opencode"`, or use a checkout outside the main one.
2. **The filesystem-root guard has no failing mutant.** No machine here has a `/.opencode/plugins` folder, so removing the guard changes nothing the test can see.
3. **A command present in both the root and an ancestor can't reveal ignored switches.** The names are identical; the plugin check covers that case.
<!-- /ANCHOR:limitations -->

---
