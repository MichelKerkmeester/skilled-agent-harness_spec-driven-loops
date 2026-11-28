---
title: "Implementation Summary"
description: "Every bot now reads a bounded shared memory file and one of its own before its body, an operator adds and forgets facts with bots remember, and a bot proposes a fact the operator confirms or rejects through bots answer."
trigger_phrases:
  - "memory implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/003-openbot-parity-build/005-memory"
    last_updated_at: "2026-11-27T21:30:00Z"
    last_updated_by: "unit-005-orchestrator"
    recent_action: "Built the memory phase and closed every acceptance row"
    next_safe_action: "Merge the unit branch into the build branch"
    packet_purpose: "Purpose: Give a bot two bounded memory files, one shared and one its own, prepended to its prompt, with a verb to add a fact and a needs-you item to confirm one a bot proposes."
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-bots/runtime/lib/memory.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/runner.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/answer.ts"
      - ".skilled/bin/bots.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-memory"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "833af0cc-38d5-498d-8268-a1869252b4d2"
      workspace: "/Users/michelkerkmeester/worktrees/public/system-skilled-bots"
      savedAt: "2026-11-26T08:26:12Z"
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-memory |
| **Completed** | 2026-11-27 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A bot now starts each fresh run with two short lists of facts in its prompt: the shared file every bot reads and its own. You add a fact with `bots remember`, list it with its 8-hex id and forget it by that id, and a bot that ends a clean run with one `[REMEMBER]` line leaves a proposal you confirm or reject with `bots answer`.

### Phase 5: memory

Each memory file holds at most 60 entries, 3,600 bytes and 400 characters a fact, and an append past a bound is refused with a hint naming the forget command rather than rewritten. The prompt carries the files inside one labelled `<memory>` block each, after the checkout line and before the decision rule, so a fact that reads like an order stays a fact. The whole prompt is now bounded at 32,000 characters: a queued conversation gives way from its oldest message, and anything still over the line is refused `prompt-over-budget` naming the block that crossed it. A proposal is a needs-you item of kind `memory-proposal` under the reserved bot id `memory-proposals`, so it never holds the proposing bot and never queues a resume.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/lib/memory.ts` | Created | Entry grammar, ids, bounds, append, forget, read and the labelled block |
| `.skilled/skills/system-skilled-bots/runtime/lib/state-root.ts` | Modified | `sharedMemoryFile`, `ensureMemoryFolder` and the identity's `memory` path |
| `.skilled/skills/system-skilled-bots/runtime/lib/definition.ts` | Modified | The `memory` key, default true, refused `memory-invalid` when not a boolean |
| `.skilled/skills/system-skilled-bots/runtime/lib/label.ts` | Modified | Reserves `memory-proposals` beside the drain id |
| `.skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts` | Modified | `kind` values, the three proposal keys and the decision-only hold and resume filters |
| `.skilled/skills/system-skilled-bots/runtime/lib/run-record.ts` | Modified | The `postRunCauses` field, its validator and `postRunCausesOf` |
| `.skilled/skills/system-skilled-bots/runtime/lib/dispatch.ts` | Modified | Named-block prompt builder returning a Result, `checkPromptBudget`, the conversation cut and `parseRememberMarker` |
| `.skilled/skills/system-skilled-bots/runtime/lib/runner.ts` | Modified | Reads both files, secret-checks the blocks, refuses `prompt-over-budget` with the tree settled, writes the proposal and records the post-run causes |
| `.skilled/skills/system-skilled-bots/runtime/lib/answer.ts` | Modified | The review seam: claim, precheck before the write, settle after it, status `reviewed` |
| `.skilled/bin/bots.cjs` | Modified | The `remember` verb with `--bot`, `--type`, `--as`, `--list`, `--json` and `--forget`, and the review line on `answer` |
| `.skilled/skills/system-skilled-bots/assets/bot-template.txt` | Modified | The commented `memory: true` line |
| `.skilled/skills/system-skilled-bots/runtime/lib/README.md` | Modified | The `memory.ts` row and the module count |
| `.skilled/skills/system-skilled-bots/bots-run/SKILL.md` | Modified | `bots remember` in the run mode's verbs |
| `.skilled/skills/system-skilled-bots/bots-run/references/run-queue-and-answer.md` | Modified | Rows for confirm, reject, `remember`, `--list` and `--forget` |
| `.skilled/skills/system-skilled-bots/bots-author/references/bot-definition.md` | Modified | The `memory` field and its refusal |
| `specs/system-skilled-bots/003-openbot-parity-build/contracts/records.md` | Modified | The `postRunCauses` row names all three causes |
| `runtime/tests/memory.vitest.ts` | Created | Fourteen cases in `describe('memory')` |
| `runtime/tests/dispatch.vitest.ts`, `needs-you.vitest.ts`, `answer.vitest.ts`, `runner.vitest.ts`, `cli-run.vitest.ts`, `definition.vitest.ts`, `label.vitest.ts` | Modified | The named cases each acceptance row runs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Cheap Vibe workers on deepseek-flash wrote every code and doc change, one file per live worker, and the orchestrator verified each one before the next that read it started. The library modules landed first (wave A), then the runner, answer and CLI call sites (wave B and C), then the tests, each pipelined as soon as its modules were verified. No worker needed the cli-pi retry. The close ran every acceptance command, the whole runtime suite, the typecheck and the cargo test, compared with the ledger floor, and then the strict validator.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The memory folder is made by its writer through `ensureMemoryFolder`, not by `ensureIdentityState` | `state-root.vitest.ts` asserts the exact folder list `ensureIdentityState` makes, and 002 set the same precedent for its own folder. The spec's Risks row said otherwise. |
| `sharedMemoryFile` is a standalone export rather than a `sharedStatePaths` key | `state-root.vitest.ts` compares `sharedStatePaths` to an exact object. |
| `memory-entry-invalid` is an internal backstop refusal | An entry whose type, date, actor or source would break the line grammar needs a named refusal. No caller reaches it with valid input. |
| An append after a torn last line writes a leading line feed and the byte bound counts it | The torn line stays skipped and the new entry stays its own line. |
| Forget keeps skipped lines byte for byte | A line the parser cannot read may still matter to the person who wrote it. |
| `beforeWrite` and `afterTempWrite` options on append and forget | They put a second write inside the race window so the two concurrency cases are tested in one process. |
| `checkMemoryAppend` is exported | The answer's precheck needs the bound check without the write. |
| No read-time default for `kind` or `postRunCauses`, which `itemKind` and `postRunCausesOf` read instead | Several existing tests compare stored shapes exactly, and a stored value is what readers print. Every record this runner writes carries `postRunCauses`, `[]` when empty. |
| `buildBotPrompt` gains no `skillBlocks` input | 009 owns the skills block. |
| The shared forms of `remember` resolve config and state root only, and identity only with `--bot` | The shared file sits beside the identity folders, so a checkout with no identity can still keep shared memory. |
| `remember`'s child bar is its own check on the write forms, and `--list` stays open | A list is a read. Adding `remember` to `CHILD_REFUSED_VERBS` would refuse it and print the bare line. |
| An unresolved OS user records the actor `unknown` | The line grammar needs a non-empty actor. |
| Waves restructured from the plan's table | The `buildBotPrompt` Result change had to land with its runner call site and the existing dispatch tests to keep the typecheck green, and T048 to T053 had no wave row. |
| The CLI review test sits in `describe('bots answer')` | AC-024 and T051 run `^bots answer review recorded$`, while T029 named a `bots answer review` block. The acceptance row is the closure gate. |
| Personas inlined as a focused summary | The small-context exception: a full persona file would crowd a cheap worker's context. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Acceptance rows AC-001 to AC-026 | PASS: all 27 commands, run verbatim, printed `Tests  1 passed`, and all 26 rows read Met |
| `npm test` (runtime) | PASS: `Test Files  41 passed (41)`, `Tests  519 passed (519)`, exit 0. The floor was 40 files and 480, so the delta is one new file and 39 new tests with none lost |
| `npm run typecheck` | PASS: exit 0, the floor's value |
| `cargo test --locked --manifest-path .skilled/crates/bots-tui/Cargo.toml` | PASS: 57 lib and 8 `cli_client` passed, exit 0, the floor's numbers. Nothing under `crates/` changed |
| Manual probe on a scratch checkout | PASS: `bots remember "the sales sheet is Q3"` printed `bots: entry 1 in $T/state/memory/shared.md (1 of 60 entries, 83 of 3600 bytes)` and exited 0, `--list` printed that entry, the folder is 0700 and the file 0600, and `--list --json` matched both list fixtures |
| `validate.sh --strict` | PASS: `RESULT: PASSED` |
| Read verbs with a live proposal item | PASS: `bots inbox`, `inbox --json`, `activity`, `activity --json`, `status` and `status --json` each exited 0 and showed the item |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`contracts/refusals.md` section 3.4 lacks `remember-fact-too-long`.** That file is outside this unit's write set, so the row waits for the contracts writer. `contracts/records.md` already names the cause.
2. **Some verify commands named text the design does not use.** T009 greps `forgetEntry` where the design names `forgetMemoryEntry`, T020 greps `'memory'` where the secret-check label is the template `memory ${path}` the design's refusal detail requires, and T016's grep matches a JSDoc line. Each keeps its command with the real evidence beside it. CHK-001, CHK-032, CHK-034 and CHK-051 were amended in place, and `goal.md`'s log records why.
3. **A full file blocks a confirm.** Free a line with `bots remember --forget <entry-id> --bot <id>` and answer again, or reject the proposal.
<!-- /ANCHOR:limitations -->

---
