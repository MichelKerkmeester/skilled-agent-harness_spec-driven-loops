---
title: "Implementation Summary"
description: "The master kill switch now silences all but one OpenCode plugin: system-speckit-completion and sk-vision read the shared hook-flags resolver on OpenCode 1 and OpenCode 2."
trigger_phrases:
  - "plugin kill switch coverage implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/028-plugin-kill-switch-coverage"
    last_updated_at: "2026-10-20T11:53:36Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-028-plugin-kill-switch-coverage"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 028-plugin-kill-switch-coverage |
| **Completed** | 2026-10-20 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Setting `SYSTEM_HOOKS_DISABLED=1` now stops the work of sixteen of the seventeen OpenCode plugins, on both OpenCode lines. Before this phase two more stayed on: the speckit-completion tool and the sk-vision `/vision` command.

### Phase 28: plugin-kill-switch-coverage

When you switch the hooks off, or switch off one plugin by its own name, these two plugins now register nothing. `system-speckit-completion.js` asks the shared resolver about the `completion` concern, so its own `SYSTEM_SPECKIT_COMPLETION_DISABLED` still works, now with any truthy value and from `hook-flags.env` as well. The sk-vision plugin asks about the `sk-vision` concern, the same name its Devin hook already used, so `SYSTEM_SK_VISION_DISABLED` now reaches OpenCode too. On OpenCode 1 a switched-off sk-vision returns only `dispose`; on OpenCode 2 its `setup` adds no command, prompt hook or tool. `sk-git-message-gate.js` is the one plugin left without a switch, by design.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/plugins/system-speckit-completion.js` | Modified | Resolve the switch through `hook-flags.cjs` |
| `.opencode/plugins/tests/system-speckit-completion.test.cjs` | Modified | Master switch, alias, truthy value, v1 and v2 |
| `.skilled/skills/sk-vision/vision-runtime/src/plugin.ts` | Modified | `visionHooksEnabled()` checked in `server` and `setup` |
| `.skilled/skills/sk-vision/vision-runtime/tests/plugin.test.ts` | Modified | Seven kill-switch cases |
| `.opencode/plugins/README.md`, `.opencode/plugins/ARCHITECTURE.md` | Modified | Drop the two gaps; refresh the `src/plugin.ts` line citations |
| `.skilled/hooks/completion/README.md` | Modified | The completion switch row names the master switch |
| `.skilled/skills/sk-vision/hooks/README.md` | Modified | New OpenCode plugin switch note |
| `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/speckit-completion-exposer.md` | Modified | Expected signals match the resolver's truthy values |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash wrote the code, tests and doc edits from short literal briefs; I wrote the spec docs and one doc sentence. Each new test was run against the old code first: the speckit-completion test exits 1 on the old plugin and 0 on the new; the sk-vision plugin test fails 5 of its 40 cases on the old source and passes all 40 on the new (`scratch/mutation/`). The built bundle was loaded through the `.opencode/plugins/sk-vision.js` link under Bun with each switch, to prove the resolver path holds after bundling and through the symlink (`scratch/mutation/bundle-check.txt`).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| speckit-completion uses the `completion` concern | The resolver already lists `SYSTEM_SPECKIT_COMPLETION_DISABLED` and `MK_SPECKIT_COMPLETION_DISABLED` as aliases of that concern, so no switch name is new |
| sk-vision uses the `sk-vision` concern | Its Devin hook and the hooks README already document `SYSTEM_SK_VISION_DISABLED` |
| sk-vision finds the resolver from its real path and fails open | OpenCode loads the bundle through a symlink, and a bundle copied without the repo must keep working, as the resolver does for a missing switch file |
| Check at plugin construction | Matches `system-dist-freshness-guard.js`; a disabled plugin registers nothing rather than registering hooks that return early |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Plugin suite `node --test .opencode/plugins/tests/` | PASS, 417/417 (baseline 417/417) |
| sk-vision `bun test` | PASS, 83/83 (baseline 76/76) |
| sk-vision `bunx tsc --noEmit` | PASS, exit 0 |
| New tests on old code | FAIL as intended: completion exit 1, sk-vision 5 of 40 fail |
| Built bundle through the symlink | No switch: v1 `command.execute.before`, v2 command and prompt hook. Either switch: v1 `dispose` only, v2 nothing |
| v1 battery, local | PASS: discovered, loaded, command-listed |
| sk-doc `validate_document.py` on the five changed docs | PASS, 0 issues |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The switch is read once, at load.** Changing it needs a host restart, as for every plugin that checks at construction.
2. **One switch for two completion surfaces.** The `completion` concern also answers to `SYSTEM_COMPLETION_SENTINEL_DISABLED`, so switching off the sentinel drops the tool too. That grouping is the resolver's existing alias design.
3. **The v2 battery's `plugin-active` leg fails in a nested worktree**, a separate known issue, so CI on a plain checkout is the proof for that leg.
<!-- /ANCHOR:limitations -->

---
