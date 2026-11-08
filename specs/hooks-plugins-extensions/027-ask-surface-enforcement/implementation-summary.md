---
title: "Implementation Summary"
description: "A turn that ends in a typed option menu is now sent back to ask through the runtime's question tool on Claude Code, OpenCode, Pi and DSH, and logged on Codex and Devin."
trigger_phrases:
  - "ask surface enforcement implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/027-ask-surface-enforcement"
    last_updated_at: "2026-11-08T14:58:51Z"
    last_updated_by: "generate-context"
    recent_action: "Fixed all alignment findings; tests and live rerun pass"
    next_safe_action: "Run the alignment recheck, then commit when the operator asks"
    blockers: []
    key_files:
      - ".skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts"
      - ".skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs"
      - ".opencode/plugins/lib/v2-bridge.js"
      - ".skilled/skills/system-spec-kit/feature-catalog/ux-hooks/ask-surface-guard.md"
      - "specs/hooks-plugins-extensions/027-ask-surface-enforcement/implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0ff95430865c487dea7405574f75efd6f5f91c9c4d19a74aecaaa84817b86e19"
      session_id: "scaffold-027-ask-surface-enforcement"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "37344d65-539c-401d-8341-c9b769fd34a7"
      workspace: "/Users/michelkerkmeester/MEGA/Development/Skilled"
      savedAt: "2026-11-08T14:58:51Z"
      locatorKind: "transcript_path"
      version: 1
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
| **Spec Folder** | 027-ask-surface-enforcement |
| **Completed** | 2026-11-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reply that ends in a typed A/B/C menu, with no question-tool call in the turn, is now sent back with one instruction: ask that question through the runtime's tool. Claude Code, DSH, OpenCode and Pi enforce it. Codex and Devin cannot block a finished turn, so they log an advisory instead.

### Enforce asking operator decisions through each runtime's native ask-question tool instead of prose option menus

You no longer have to catch a prose menu by eye. One shared detector reads the closing lines of a turn: two or more sequential labels starting at A or 1, a question beside them, and nothing inside code fences, quotes or tables. Each runtime adapter decides what to do with a match. A turn is sent back once at most, so a model that repeats the menu ends normally rather than looping: Claude Code relies on `stop_hook_active`, and DSH, OpenCode and Pi key a marker on the operator's turn. `SYSTEM_ASK_SURFACE_DISABLED=1` turns the guard off everywhere. The rule text changed too. `communication-handoff.md` §4 now says a structured choice goes through the §5 tool. §5 names each runtime's tool and narrows the prose fallback to sessions that have no tool, and Gate 3 in `AGENTS.md` points at §5.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/ask-surface-guard/lib/ask-surface-core.cjs` | Created | Detector, verdict, per-turn marker, `fires.jsonl` log and the re-prompt text per runtime |
| `.skilled/hooks/ask-surface-guard/lib/advisory-stop.cjs` | Created | Codex and Devin Stop runner: stderr advisory and a log line, never a block |
| `.skilled/hooks/ask-surface-guard/claude/ask-surface-stop.cjs` | Created | Synchronous Claude Code Stop guard that reads the transcript and blocks once |
| `.skilled/hooks/ask-surface-guard/codex/ask-surface-stop.cjs`, `devin/ask-surface-stop.cjs` | Created | Thin entry points into the advisory runner |
| `.skilled/hooks/ask-surface-guard/dsh/ask-surface-guard.mjs` | Created | DSH `agent/turn-stopping` guard that steers once and skips headless sessions |
| `.skilled/hooks/ask-surface-guard/pi/ask-surface-guard.ts` | Created | Pi `agent_end` guard that starts one follow-up turn |
| `.opencode/plugins/ask-surface-guard.js` | Created | OpenCode `session.idle` guard that re-prompts through `promptAsync` |
| `.skilled/hooks/ask-surface-guard/fixtures/*.json` and each adapter's test | Created | Ten detector fixtures, plus tests for each adapter; the DSH test sits in `tests/dsh-ask-surface-guard.test.mjs` with the other DSH tests |
| `.opencode/plugins/lib/v2-bridge.js` and `tests/v2-bridge.test.cjs` | Modified | OpenCode 2 tool parts reach the v1 message shape, so the plugin sees a `question` call |
| `.skilled/skills/system-spec-kit/feature-catalog/ux-hooks/ask-surface-guard.md` and `feature-catalog.md` | Created, Modified | Catalog entry the four scenario rows link |
| Root, `.opencode/`, `.opencode/plugins/`, `.pi/` and DSH READMEs, `.dsh/SYNC.md`, `.env.example`, `ENV-REFERENCE.md`, `injection-contract.md` | Modified | Inventories, counts, the kill switch and the injection channels name the guard |
| Thirteen `/create:*`, `/design:*` and `/prompt:*` presentation files, `speckit-implement.yaml` | Modified | Startup forms are asked through the §5 question tool, printed as text only where §5 names none |
| `.pi/extensions/ask-surface-guard.ts`, `.dsh/plugins/repo-guards/adapters/ask-surface-guard.mjs` | Created | Symlinks that load the guard |
| `.dsh/plugins/repo-guards/index.mjs` | Modified | Registers the DSH guard |
| `hook-registry.json`, `.claude/settings.json`, `.codex/hooks.json`, `.devin/hooks.v1.json` | Modified | Registry entry and the configs the sync script regenerated from it |
| `hook-registration-sync.vitest.ts` | Modified | Binding count from 105 to 108 |
| `.skilled/repo-rules/communication-handoff.md` | Modified | §4 and §5 rewritten around the question tool |
| `AGENTS.md`, `agents-md-manifest.json` | Modified | Gate 3 points at §5, and the manifest was re-minted at 16379 of 16384 bytes |
| `.skilled/hooks/README.md`, `coverage-rationale.md`, `hook-flags.env.example` | Modified | Kill switch, coverage row and the new concern |
| Four `ask-surface-guard-*-conversation.md` scenarios and their index rows | Created | Live, Devin advisory, kill-switch and no-false-positive conversations |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Five research iterations on DeepSeek V4.1 Flash, run through opencode-go after DevPass ran out of credit, mapped each runtime's tool and stop event. The detector and its fixtures came first, then the adapters one runtime at a time, then the registry entry and the rule text. The Gate 3 edit went in only after you approved the byte-neutral diff. Every unit suite ran on the final tree. The four conversation scenarios then ran live through the shared runner, which drives each runtime in a scratch project.

`/local-skilled-alignment` then reviewed the work with four review lanes and a critic. It found three guard defects: the Claude guard missed a slash command as a turn start, the Pi guard had no UI check and no per-turn marker, and the OpenCode 2 bridge dropped tool parts. It also found the doc gaps the second Files Changed block lists. All were fixed. The live scenario and the Devin advisory then ran again on the fixed code.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Key the Pi marker on the operator's last message | `agent_end` closes one agent loop, not the turn, and the guard's own follow-up arrives as a custom message, so every loop of one turn shares the key |
| Fix the OpenCode tool-part gap in the shared bridge | The bridge dropped the part for every plugin, so fixing it there fixes the cause rather than one reader |
| One shared detector, thin adapter per runtime | Each runtime differs only in how it reads a turn and sends one back, so a single detector keeps the verdict identical everywhere |
| Send back once per turn | A model that repeats the menu must still finish its turn, so the guard can never trap a session |
| Advisory only on Codex and Devin | Neither Stop event documents a block, and a guessed block could break their sessions |
| Skip DSH headless, leaf and child sessions | Those sessions have no question tool, so sending them back would ask for something they cannot do |
| Devin gets its own live scenario | Its guard only advises, so the other runtimes' check, which requires a tool answer, cannot apply to it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test` over the core, advisory, Claude, DSH and OpenCode tests | PASS: 37 pass, 0 fail, exit 0 |
| Pi vitest, `vitest run --config .skilled/hooks/vitest.config.ts .../pi/ask-surface-guard.test.ts` | PASS: 4 pass, exit 0 |
| Hook node:test lane and hooks vitest lane, earlier in the session | PASS: 1476/1476 and 487/487 |
| `sync-hook-registrations.cjs --check` | PASS: 4 files match the 34-hook registry, 21 Pi extensions resolve |
| `check-repo-rules.cjs` after the §4 and §5 edit | PASS: 11/11 |
| AGENTS.md manifest canary | PASS: 16379/16384 bytes, exit 0 |
| Live: ask-surface-guard-live-conversation | PASS on Claude Code, OpenCode and Pi: tool=1, fires=0 |
| Live: ask-surface-guard-devin-advisory-conversation | PASS on Devin: teal=1, fires=0 |
| Live: ask-surface-guard-kill-switch-conversation | PASS on Claude Code, OpenCode, Pi and Devin: fires=0, teal=1 |
| Live: ask-surface-guard-no-false-positive-conversation | PASS on Claude Code, OpenCode, Pi and Devin: fires=0, listed=1 |
| Fixed-code tests: core, advisory, Claude, DSH, OpenCode and bridge | PASS: 89 pass, 0 fail, exit 0; Pi vitest 6/6; full hooks vitest lane 489/489 |
| Live rerun on the fixed code | Claude Code, OpenCode and Pi: tool=1 and fires=0, with the runner's REPO_CHANGED from other sessions' writes; Devin advisory PASS |
| Run report | `.skilled/skills/system-spec-kit/benchmark/reports/2026-11-08--manual-testing-playbook--ask-surface-guard/`: 12 PASS |
| Playbook validator, `--package system-spec-kit` | No ask-surface finding; the two violations already present are session-relaunch links |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No live run has exercised the send-back, before or after the fixes.** Every live run recorded fires=0, because each model used the question tool on its own, even when the prompt asked for lettered options. The send-back is proven by the adapter tests only. When a real turn trips the guard, `.skilled/skills/.state/ask-surface/fires.jsonl` records it. Use that line to rerun the live scenario on that runtime.
2. **Codex is untested live.** No Codex usage was available, so the Codex adapter is covered by its unit test only.
3. **Implementation prompts that name a runtime still route to its CLI executor.** Eight of the eleven alignment probes miss: "Make the Claude Code Stop hook…" goes to `cli-claude-code` rather than `sk-code`, because the `cli-external-orchestration` hub's author keywords outscore it. That is the shared advisor scorer, not this guard, so it is left to an advisor packet.
4. **A turn sent back can still end in prose.** The guard sends a turn back once, so a model that ignores the instruction ends its turn normally, and the menu stays on screen. The fire line still records it.
<!-- /ANCHOR:limitations -->
