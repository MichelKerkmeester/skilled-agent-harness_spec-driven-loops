# Review Iteration 003

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Mode: review, execution single_review_iteration, state source externalized files
- Session: `fanout-vibe-2-1794808672532-65xu0h`, generation 1, lineageMode `new`
- Iteration: 3 of 5 (stopPolicy `max-iterations`)
- Dimension: correctness
- Operator review focus: correctness, security and fail-open defects, wire-format and payload edge cases, ordering and kill-switch gaps, and parity gaps against the OpenCode plugins. This iteration addresses the focus by auditing the four composers and the session reader for silent no-ops, per-call cost, and path-resolution disagreements between the composers and the shared hook seam.
- Sources read: `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `turn-end.mjs`, `session-start.mjs`, `compaction-post-tool.mjs`, `compaction-context.mjs`, `.skilled/hooks/shared/session-readers/vibe.mjs`, `.skilled/hooks/session-handover/lib/context-usage.cjs`, `.vibe/plugins/repo-guards/lib/hook-io.mjs`, `.vibe/hooks.toml`.

## Files Reviewed

- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:1-172`
- `.skilled/hooks/session-lifecycle/vibe/turn-end.mjs:1-122`
- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:1-147`
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:1-86`
- `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:66-381`
- `.skilled/hooks/shared/session-readers/vibe.mjs:1-497`
- `.skilled/hooks/session-handover/lib/context-usage.cjs:388-428`
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:25-27`
- `.vibe/hooks.toml:96-108`

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. R1-P1-001 remains active and is carried forward.

### P2 Findings

1. **The hand-over part runs on every tool call with no size gate, so the journal is re-parsed each time** -- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:66-73` -- the compaction part beside it is gated by `measureJournal`, and the file's own header says "The journal's size decides whether the detector reads it at all". The hand-over part has no such gate: it calls `buildHandoverContextPart(payload)` unconditionally, which reaches `readVibeUsage(payload.transcript_path)` (`handover-parts.mjs:268`) and then `vibeFillTokens`, which walks every journal segment and parses each one (`context-usage.cjs:388-394`). The binding has no `match` selector (`.vibe/hooks.toml:96-108`), so this runs after every tool call of every kind.
   Finding class: algorithmic
   Scope proof: the binding and the composer are inside the declared target; the usage reader is cited as the cost it drives.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/session-handover/lib/context-usage.cjs`, the `compaction-post-tool` binding in `.vibe/hooks.toml`
   Case: a long headless turn that makes fifty tool calls while the journal grows to several megabytes. Each call re-reads and re-parses the whole journal for the hand-over part, so the hook's cost grows with the square of the turn length, against a 10-second binding timeout.

2. **The session-start composer has no CLI-entry guard and no test, unlike the other three composers** -- `.skilled/hooks/session-lifecycle/vibe/session-start.mjs:145-147` -- `main().catch(...)` runs at module load with no `IS_CLI_ENTRY` check, while `turn-start.mjs:35-37,168-172`, `turn-end.mjs:28,118-122` and `compaction-post-tool.mjs:26-28,82-86` all compute `IS_CLI_ENTRY` and gate `main()` on it. The consequence is visible in the test set: `compaction-context.test.mjs`, `compaction-post-tool.test.mjs`, `turn-end.test.mjs` and `turn-start.test.mjs` exist, and there is no `session-start.test.mjs`. The one composer that runs the goal slice, the session prime, the startup guards and the dist warning is the one that cannot be imported by a test without blocking on stdin.
   Finding class: test-isolation
   Scope proof: inside the declared target; the sibling composers are cited as the pattern the file departs from.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/session-start.mjs`, the `session-start` binding in `.vibe/hooks.toml:126-129`
   Case: a contributor adds a unit test for the goal part or the startup-guard part. Importing the module starts `main()`, which awaits stdin and never returns, so the test hangs instead of asserting.

3. **The turn-start composer uses the raw payload cwd as the project root while the guard seam resolves it against the checkout** -- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:52,80` -- both `pendingCompletionAdvisoryPart` and `buildSaveNudgePart` take `payload.cwd` verbatim and `join` a relative path onto it. The shared seam does the opposite: `hook-io.mjs:25-27` `sessionDirFor` resolves a relative cwd against the checkout, and its comment says why — "A relative cwd is resolved against the checkout, so the same payload names the same tree on any machine". `dist-freshness.mjs:53-55` repeats the same resolution locally for the same reason. The two turn-start parts are the only readers that do not.
   Finding class: instance-only
   Scope proof: inside the declared target; `hook-io.mjs` and `dist-freshness.mjs` are cited as the convention.
   Affected surface hints: `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs`, `.vibe/plugins/repo-guards/lib/hook-io.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`
   Case: a fixture or a scratch-cwd run whose payload carries a relative `cwd`. The completion part writes its pending advisory under the absolute path the hook process happens to run in, while the turn-start part reads it under a path resolved from the process cwd — so the advisory is written to one tree and looked for in another, and the model never sees it.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | The composers' documented part order matches the code: `turn-start.mjs:101-111` lists the withdraw step then five text parts, and `README.md:23` describes the same order. The `compaction-post-tool` binding's documented "the journal's size decides whether it reads at all" (`compaction-post-tool.mjs:7-8`) holds for the compaction part only, not for the hand-over part beside it. |
| `checklist_evidence` | notApplicable | No checklist document on a hook and plugin surface. |

## Integration Evidence

- `.vibe/hooks.toml:96-108` — the `compaction-post-tool` binding is `type = "post_tool"` with `timeout = 10.0` and no `match`, so it fires after every tool call.
- `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs:59-73` — the two parts, one gated and one not.
- `.skilled/hooks/session-handover/lib/context-usage.cjs:388-394,419-428` — `readVibeUsage` → `vibeFillTokens` → `segmentFillTokens` per journal segment, the cost finding R3-P2-001 measures.
- `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs:35-37,168-172` and `turn-end.mjs:28,118-122` — the `IS_CLI_ENTRY` pattern finding R3-P2-002 compares against.
- `.vibe/plugins/repo-guards/lib/hook-io.mjs:25-27` — `sessionDirFor`, the resolution convention finding R3-P2-003 compares against.
- `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs:110-112` — the writer of the pending advisory that `turn-start.mjs:50-69` reads.

## Edge Cases

- **The reader's journal ordering was re-checked and stays clean.** `session-readers/vibe.mjs:66` sorts with a default `.sort()`, which would misorder `10.jsonl` before `2.jsonl`. The live journal names are zero-padded to 16 digits, so the sort is numeric. This direction is BLOCKED in the strategy and was not re-entered.
- **`loadVibeSession` compares an untrimmed session id.** `vibe.mjs:375` tests `sessionId.trim()` for truthiness but compares `recordedId !== sessionId` untrimmed, so a padded id fails `session_mismatch`. `compaction-context.mjs` trims before calling, while `ask-surface-post-agent.mjs:90` and `completion-evidence-post-agent.cjs:48` pass the raw payload value. Held as an edge case rather than a finding: no recorded payload carries a padded id, so the trigger is unproven and the severity would be P2 at most.
- **Prior-finding overlap checked.** None of the three appears in the 29 dispositions. `R3-P2-003` in the prior round was a deferred cost assertion; R3-P2-001 here is a different cost, in a different file, with the reader named.

## Confirmed-Clean Surfaces

- `turn-start.mjs:135-149` — `composeTurnStart` rejects a non-object and a non-`pre_agent` event, and runs each part in its own try/catch so one failure cannot suppress the rest.
- `turn-start.mjs:61-67` — the pending advisory is deleted before it is returned, so a file that cannot be removed is dropped rather than repeated.
- `turn-start.mjs:93-99` — the withdraw step runs first, before any slow part, so a slow part cannot hold the withdraw past the killer.
- `turn-end.mjs:86-99` — the composer stops at the first deny, and the hand-over part is last so a turn another part sends back is never armed.
- `turn-end.mjs:45-48` — the completion part runs first, so its advisory is written even when the ask-surface part denies.
- `session-start.mjs:118-119` — a non-object payload and a non-`session_start` event both return before any work.
- `session-start.mjs:129-136` — every part runs in its own try/catch.
- `compaction-post-tool.mjs:52-57` — malformed input prints nothing and exits 0.
- `compaction-context.mjs:326-336` — `measureJournal` sums only the numbered segments and returns 0 for an empty folder rather than unreadable.
- `compaction-context.mjs:350-381` — `buildPostToolPart` checks `hook_event_name === 'post_tool'`, records the size even when the detector returned no text, and fails open on any throw.
- `compaction-context.mjs:73-84` — the watermark directory must already exist as an absolute directory, so a payload cannot make the detector create a tree anywhere it names.
- `compaction-context.mjs:139-160` — the watermark moves before the text is built and every id in a catch-up joins the seen list, so a snapshot roll cannot re-inject an older compaction.
- `session-readers/vibe.mjs:347-393` — `loadVibeSession` fails with a named code for a missing locator, a missing session, an unreadable store, an unsupported format and a session mismatch, rather than returning an empty success.
- `session-readers/vibe.mjs:116-124` — `withSnapshot` drops a projection delta at or below the snapshot sequence, so replaying it cannot put an older entry state back.
- `session-readers/vibe.mjs:474-477` — `compactionsSince` sorts by sequence, so the caller sees compactions in order regardless of segment order.

## Ruled Out

- **Journal segment ordering in the session reader.** Zero-padded names make the lexicographic sort correct; BLOCKED in the strategy.
- **`compaction-post-tool.mjs` judging a non-`post_tool` payload.** `buildPostToolPart` checks `hook_event_name` itself at line 361.
- **`turn-end.mjs` requiring the completion part by an absolute path.** `createRequire(import.meta.url)` accepts an absolute path, and the path resolves to `.skilled/skills/system-spec-kit/runtime/hooks/vibe/completion-evidence-post-agent.cjs`.
- **A wrong relative root in any composer.** `turn-start.mjs:44`, `session-start.mjs:29`, `compaction-context.mjs:45`, `prompt-advisor.mjs:30` and `hook-io.mjs:16` each climb the correct number of levels to the checkout.

## Next Focus

- Dimension: correctness
- Focus area: the goal, hand-over, ask-surface, decision-capture, completion and skill-advisor adapters
- Reason: iteration 3 covered the composers and the reader; the remaining adapters are where the claim, the marker and the injected `env` seam decide whether a part delivers once or repeatedly.
- Rotation status: correctness (guard seam), security and correctness (composers and reader) done; correctness (adapters) next.
- Blocked/productive carry-forward: the `process_start` and `system_message` upgrade triggers are carried forward; the journal-ordering direction stays BLOCKED; the untrimmed session id is carried as an edge case.
- Required evidence: the `claimNudge`/`commitNudge` contract in `nudge.cjs`, and the `env` seam each adapter accepts.

Review verdict: CONDITIONAL
