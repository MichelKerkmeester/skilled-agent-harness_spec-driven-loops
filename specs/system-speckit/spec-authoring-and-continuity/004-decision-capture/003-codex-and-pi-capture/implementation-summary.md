---
title: "Implementation Summary"
description: "Codex and Pi operator answers now reach the decision record: Pi through a live extension, Codex through a save-time rollout reader, both proven in the 006 live runs."
trigger_phrases:
  - "codex and pi capture implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/003-codex-and-pi-capture"
    last_updated_at: "2026-11-02T16:33:28Z"
    last_updated_by: "generate-context"
    recent_action: "Closed 003 on the 006 Pi and Codex live runs"
    next_safe_action: "Verify CHK-FIX-007 against the commit SHA once the operator approves"
    blockers: []
    key_files:
      - ".skilled/hooks/decision-capture/bin/sweep-codex.mjs"
      - ".skilled/hooks/decision-capture/bin/sweep-pi.mjs"
      - ".skilled/hooks/decision-capture/pi/decision-capture.ts"
    session_dedup:
      fingerprint: "sha256:3c5acdcaeaee8dab86cba90428f4b60b1ba7f0d1fa0a411b81f89367a0720d8e"
      session_id: "planning-003-codex-and-pi-capture"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-codex-and-pi-capture |
| **Status** | Complete |
| **Completed** | 2026-11-02, after the 006 Codex and Pi re-proof |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

An answer you give to a Codex or Pi question tool now reaches the decision queue. Pi queues it the moment Pi reports the result, through a live extension, and both runtimes have a save-time reader that recovers anything the live path missed, under the same key.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/decision-capture/bin/sweep-pi.mjs` and `sweep-pi.test.mjs` | Created | Pi session reader: answered `ask_user_question` results only, cancelled and error results skipped, silent when nothing is pending. 8 tests |
| `.skilled/hooks/decision-capture/bin/sweep-codex.mjs` and `sweep-codex.test.mjs` | Created | Codex rollout reader: `request_user_input` calls paired with their output by `call_id`; aborted output and the async variant skipped; a typed note replaces `None of the above`. 8 tests |
| `.skilled/hooks/decision-capture/pi/decision-capture.ts` and `decision-capture.test.ts` | Created | Pi `tool_result` extension that reuses the reader's exported `recoveredRecords`, so both write one key. 8 vitest cases |
| `.pi/extensions/decision-capture.ts` | Created | Symlink to the extension, the repo's Pi convention |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modified | `"pi": { "extension": "decision-capture.ts" }` on the `decision-capture` entry |
| `.skilled/hooks/decision-capture/claude/ask-capture-posttooluse.mjs` and `ask-capture-posttooluse.test.mjs` | Modified, Created | No `process.cwd()` fallback: with no project dir the adapter writes nothing |
| `.skilled/hooks/decision-capture/bin/fixtures/pi-ask-user-question.json`, `codex-request-user-input.json` | Created | Redacted live samples from scratch-project sessions |
| `.skilled/hooks/README.md`, `.skilled/commands/speckit/save.md`, `feature-catalog/ux-hooks/operator-decision-capture.md` | Modified | Coverage row, tree, reader list and catalog entries for Codex and Pi |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Operator consent for the live Codex and Pi probes, given with the OpenCode and Devin ones: "Yes, all four (Recommended)", 2026-11-02, recorded as Q007 in `../decision-record.md`.

The orchestrator ran both live probes in throwaway scratch projects, each with one harmless question answered and one cancelled. Pi used a temporary extension logging `tool_result`. Codex used a temporary PostToolUse hook trusted for the probe only. Its two trust entries in `~/.codex/config.toml` were removed afterwards and the file was compared with a backup. Evidence: the probe files under `.skilled/skills/.state/decision-capture/probe/` and the redacted samples `bin/fixtures/pi-ask-user-question.json` and `bin/fixtures/codex-request-user-input.json`. The raw probe log held real session and call ids, so it was not kept in the packet.

Luna workers through cli-codex wrote the readers, the extension and the adapter fix. The orchestrator verified each one against the real probe sessions and ran a negative control on each reader. It also fixed one Pi extension test whose missing-session case passed a real id through a default parameter.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Codex takes branch (a), a rollout reader | With `default_mode_request_user_input` on, Codex calls the synchronous `request_user_input`, and both its PostToolUse payload and its rollout tie the answer to the call: `{"answers":{"<id>":{"answers":["pear"]}}}`. The planned `request_user_input_async` only returns `{"accepted":true}` |
| No Codex live hook is registered | A project hook needs each user to trust it in their own Codex config before it runs, so the save-time reader is the path that works everywhere. The README cell says so |
| Pi gets a live extension as well as a reader | The live probe showed `event.details.answers` in the `tool_result` payload, which REQ-005 requires before registering |
| The extension reuses the reader's mapping | Two copies of the mapping could drift and queue one answer twice under two keys |
| AC-001 and AC-003 are superseded by AC-010 and AC-011 (`decision-record.md` ADR-001) | AC-001 expected `hook UNKNOWN` and AC-003 named the async tool. The live probes went further, so the new rows state what they observed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash scratch/measure-answer-surfaces.sh` (T001) | exit 0. Rerun 2026-11-02 at close-out, against the spec's planning numbers: codex rollouts 341 (402), codex-tui rollouts 7 (13), `request_user_input_async` calls 62 (59), accepted 32 (29), accepted calls followed by a user message 2 (0), pi session files 12995 (12952), files with a result 134 (130), files with an answered result 108 (104). Fewer rollout files exist than at planning; why was not checked, and nothing in this packet reads them by count. Both probe statuses now read `observed` |
| `node --test .skilled/hooks/decision-capture/bin/sweep-pi.test.mjs` | pass 9, fail 0. With the multi-select read broken: fail 4. Without the `isError` skip: fail 1 |
| `node --test .skilled/hooks/decision-capture/bin/sweep-codex.test.mjs` | pass 8, fail 0. With the note prefix broken: fail 1 |
| Pi reader on the live probe session, twice | `recovered 1` (`pear`), then `recovered 0` |
| Codex reader on the live probe rollout, twice | `recovered 1` (`pear`), then `recovered 0`; the interrupted call queued nothing |
| Pi extension vitest | Test Files 1 passed, Tests 8 passed |
| Pi extension live in a scratch project | Queued `Plum` with source `hook` during the session; `sweep-pi.mjs` afterwards printed `recovered 0` and the queue held 1 line |
| `node --test .skilled/hooks/decision-capture/claude/*.test.mjs` | pass 2, fail 0. With the fallback restored: fail 1 |
| `sync-hook-registrations.cjs --check` | PASS: 4 registration files match the 32-hook registry; 19 Pi extensions resolve |
| `node --test` on every `lib` and `bin` test | pass 78, fail 0 at close-out (baseline 35); the later rows come from the sibling 004 and 005 children |
| 006 live re-proof, Pi | main 14/14 and kill-switch 1/1; 6 answers queued live, 0 duplicate keys, 7 record rows |
| 006 live re-proof, Codex | main PASS on attempt 7 and kill-switch 1/1; `sweep-codex.mjs` swept 6 answers from the rollout at save time, 0 duplicate keys, 7 record rows, a repeat save identical. Attempts 1 to 6 exposed the save's sufficiency gate, now fixed, and five scenario gaps |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Every Pi launch rewrites `.pi/settings.json`.** The home-dir settings file links to the repo copy, and Pi sets `theme` to `system` and drops the trailing newline. Restore it with `git checkout -- .pi/settings.json` after any live Pi run.
2. **A Codex answer reaches the queue only at save time.** Until the save runs its reader, the Claude-style pending nudge has nothing to count on Codex.
<!-- /ANCHOR:limitations -->

---
