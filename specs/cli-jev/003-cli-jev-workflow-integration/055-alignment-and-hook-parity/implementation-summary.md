---
title: "Implementation Summary"
description: "The injection screen now runs on every runtime whose fetch result reaches a hook, the live-sync hooks run on Cursor, Devin and Hermes, every runtime a hook skips carries a checked reason, and the Jev docs and env surfaces match the code."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/055-alignment-and-hook-parity"
    last_updated_at: "2026-10-05T12:55:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Shipped cross-runtime hook parity and doc alignment"
    next_safe_action: "Capture the Codex spawn_agent hook payload before building a Codex task-dispatch adapter"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-055-alignment-and-hook-parity"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 055-alignment-and-hook-parity |
| **Completed** | 2026-10-05 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The injection screen used to warn on Claude Code only. It now warns on every runtime whose fetch result reaches a hook, with the same words on the same verdict, and the hooks that were missing on some runtimes now run there or say why they cannot.

### Injection screen on five runtimes

`lib/classifier-injection-advisory.mjs` holds the runtime-neutral half: it finds the fetched text in any known payload shape, checks the feature gate, screens and words the one advisory line. Each adapter owns only its event, its fetch tool and its channel.

- **Claude Code**: PostToolUse on `WebFetch`, now on the shared library.
- **Devin**: PostToolUse on `webfetch`. A live run showed the hook payload names the tool `webfetch`, not `fetch` as the Devin tool reference said, with the page in `tool_response.output`.
- **OpenCode**: a plugin on `webfetch` that buffers the advisory per session and drains it into the next system transform.
- **Pi**: an extension on `fetch_content`, the tool the `pi-web-access` package adds, appending the advisory to the tool result.
- **Hermes**: the `repo-guards` plugin runs the Devin adapter for `web_extract`, after checking the switches itself so a switched-off session spawns nothing.

Cursor and Codex cannot carry it. Cursor's `Fetch` hook payload holds only the URL, status code and content length. Codex's only web tool is the hosted `web_search`, so no fetched page reaches a local hook.

### Live-sync and registry parity

`git-live-follow` and `git-primary-reconcile` now run at Cursor and Devin session start, and Hermes runs `git-live-follow` as its fifth session guard. Cursor's command builder gained the detached background form the reconcile hook needs. Every registry entry that said "No Pi counterpart is registered" now names the Pi extension that runs the hook or gives the true reason.

### Docs and env

The coverage matrix, rationale and injection contract now agree with the registry. `ENV-REFERENCE.md` names the files that read each Jev switch, and `.env.example` and `hook-flags.env.example` match it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/classifier-injection-screen/**` | Created and modified | Shared library, Devin and Pi adapters, tests |
| `.opencode/plugins/classifier-injection-screen.js` | Created | OpenCode adapter and test |
| `.hermes/plugins/repo-guards/**`, `.hermes/SYNC.md` | Modified | `web_extract` bridge, live-follow guard |
| `hook-registry.json`, `sync-hook-registrations.cjs` and its test | Modified | Bindings, Pi entries, Cursor background form |
| `.cursor/hooks.json`, `.devin/hooks.v1.json`, runtime mirrors | Regenerated | From the registry |
| Hook, skill, env and root docs | Modified | Match the code |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A read-only DeepSeek worker mapped every hook against the matrix. The orchestrator read each runtime's real payload from the installed CLIs, wrote the shared library and the registry changes, and dispatched DeepSeek workers for the Devin and Hermes adapters, the OpenCode and Pi adapters, and two docs passes. Each worker's report was checked against the code and its tests rerun. Luna reviewed the code against the sk-code-opencode checklists after its usage limit reset.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Read each runtime's payload before writing its adapter | The Devin docs named the wrong tool, so an adapter built from them would never have fired |
| Record n/a for Cursor and Codex instead of re-fetching the URL | A second fetch screens a different response than the one the model read |
| Keep Codex task dispatch `unverified` | PreToolUse fires on `spawn_agent`, but the payload was not captured and the logged message is encrypted |
| Follow the JavaScript style guide's `MODULE` header over the checklist's box | The two disagree; the guide forbids the box in new files and matches 38 neighbouring files |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Injection screen node tests | PASS, 32 (was 17) |
| OpenCode plugin and Pi extension tests | PASS, 8 and 5, both new |
| Hermes repo-guards | PASS, 51 (was 48) |
| Registration sync | PASS, 5 (was 4) |
| Every other suite | PASS, equal to the phase 54 run |
| Captured Devin payload through real Jev | Planted injection flags at p=0.99; clean page silent |
| Registration and mirror syncs, `--check` | PASS |
| Alignment verifier on every changed code folder | PASS, 0 findings |
| Doctor tests and env-reference drift | PASS, 225 and 5 |
| Luna review | No runtime-safety defect; header, naming, early switch check and test findings fixed; the Pi import finding answered by the hooks vitest alias |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex task dispatch has no adapter.** Its `spawn_agent` payload must be captured first.
2. **The sk-code-opencode JavaScript checklist disagrees with its style guide** on the header format and says no shipped file uses the COMPONENT/PURPOSE header, while 32 OpenCode plugins do. The checklist needs amending.
3. **Open sessions keep their old hook sets until restarted.** Each runtime reads its hook file at session start.
<!-- /ANCHOR:limitations -->

---
