# Iteration 3: Q3 Expiry (closure), Q4 Runtime reach and Q5 The measurement

## Focus

This is the last iteration of the lineage, so it closes Q3, Q4 and Q5 together. Q3 had one open part from iteration 2: which hosts deliver a boundary to the lifecycle clock, whether an age limit or turn count is needed on top of the clock, and the fallback if the clock's spawn cost is too high. Q3 and Q4 share one read: for each host, does a boundary reach the file store, and does the prompt path pass `session_id` and `transcript_path` to the shared handler? Q5 then fixes the harness, the threshold, the reason `C` does not apply, the scorer-isolation check and the false-carry pair. Q0 is closed and was not rerun.

## Actions Taken

1. Grepped every host's hook config (`.claude/settings.json`, `.codex/hooks.json`, `.vibe/hooks.toml`) and the Pi, DSH, Vibe and Codex adapters for session-start, compaction, `session_id` and `transcript_path` wiring.
2. Listed every file that calls into the directive lifecycle (`grep -rln` over the runtime hook trees, `.skilled/hooks`, `.opencode/plugins`). Then read the README's runtime-coverage table (`.skilled/hooks/directive-lifecycle/README.md:20-100`).
3. Read the boundary call sites in Claude's `session-prime.ts` and `compact-inject.ts`, Codex's `session-start.ts`, and Vibe's `compaction-context.mjs`.
4. Read DSH's `registerPromptAdvisor` and receipt map, Pi's `promptAdvisor` handlers, and the shared handler's session and store resolution (`user-prompt-submit.ts:318-335`).
5. Read Codex's `runClaudeHookAdapter`, the OpenCode plugin's dedup state and CLI args, the follow-up bench pairs and harm loop, and Vibe's `reduceRepeatedHead`.

## Findings

### Q3 and Q4: which hosts rotate the clock

1. **Claude rotates the clock on all four lifecycle sources and on PreCompact.** `runSessionStartHook` passes the host's `source` straight through as the boundary, keyed by session id [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:262-267]. The bridge's boundary type includes `clear` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:37]. PreCompact notifies a `compact` boundary for the session [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:587-588] and skips sub-agent payloads, whose session id is the parent's [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:578-584]. When stdin is missing, both hooks fall back to a no-session boundary, which advances the generation for every session [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:350-351] [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:572-574]. CONFIRMED from code. Iteration 2's open point is now closed for Claude: `clear` reaches the clock through SessionStart's `source`, even though the prompt hook's `lifecycleEventFor` drops it.

2. **Codex reaches the same clock through the Claude adapters in a subprocess.** `runClaudeHookAdapter` spawns the Claude adapter with the whole Codex input as stdin [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:90-115]. The Codex prompt hook calls it with `user-prompt-submit.js` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts:22], and the Codex SessionStart calls it with `session-prime.js` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts:34-41]. So `session_id` reaches both the handler and the boundary. CONFIRMED from code for the forwarding. INFERRED that Codex's PreCompact path also notifies with the session id when it has input: this iteration saw only its no-input branch [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/codex/compact-inject.ts:34]. Reading the rest of that file would confirm it.

3. **Vibe rotates the clock on compaction only, and that is enough.** `compaction-context.mjs` imports `advanceDirectiveLifecycleBoundary` and `defaultDirectiveLifecycleStore` from the advisor dist [SOURCE: .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:52-64]. It advances the session's epoch before the turn's advisor text is built [SOURCE: .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:288-293]. Vibe's one `session_start` hook is `session-start.mjs` [SOURCE: .vibe/hooks.toml:142-146], and that file is not in the list of lifecycle callers from action 2. The prompt path passes both `session_id` and `transcript_path` [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:229-237]. CONFIRMED from code. A new Vibe session has a new id, so it finds no receipt. A resumed session keeps its transcript, so the earlier route is still in context. INFERRED: missing start and resume boundaries do not make a Vibe receipt unsafe.

4. **DSH passes a session id, but no boundary ever reaches its file-store clock.** DSH's `agent/created` and `compaction/end` handlers only delete its in-process receipt map [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:59-61] [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:148-155]. The handler call passes `session_id` but no `transcript_path` [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:168-173]. The decision core sends full context whenever the transcript is not valid [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:133], so the shared store never dedups a DSH turn, and DSH does its own trimming afterward [SOURCE: .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:177]. CONFIRMED from code. A DSH route receipt would therefore survive compaction, which breaks the suppress rationale that the earlier brief is still in context. Adding a call to `advanceDirectiveLifecycleBoundary(defaultDirectiveLifecycleStore(), { sessionId, boundary })` in those two existing handlers would fix it. It would change no directive delivery, because the shared store never dedups DSH. INFERRED from the two facts above. A DSH test that compacts and then reads the guard would confirm it.

5. **Pi cannot hold a receipt today.** Pi calls the shared handler with only `prompt`, `cwd` and `hook_event_name` [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:289-294]. It reads its session id only for its own repeat check, which it resets on `session_start` and `session_compact` [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:248-254]. The shared handler takes the session from `input.session_id` [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:318-320], so guard predicate (a) can never hold for Pi. CONFIRMED from code. Putting Pi in scope would take three changes: pass `sessionIdFromContext(ctx)` to the handler, and add a boundary call to both reset handlers. INFERRED.

6. **The OpenCode plugin never runs the shared handler.** It spawns the advisor CLI's `advisor_recommend` [SOURCE: .opencode/plugins/system-skill-advisor.js:137] [SOURCE: .opencode/plugins/system-skill-advisor.js:692-694]. It keeps its dedup generation, epoch and last-directive state in memory, and treats only `startup`, `resume` and `compact` as boundaries [SOURCE: .opencode/plugins/system-skill-advisor.js:229-246]. CONFIRMED from code. A guard that lives in the hook does not reach OpenCode. Covering it would mean porting the pure decision function into the plugin with a second store.

7. **Vibe's head receipt fits suppress without a conflict.** `reduceRepeatedHead` passes any context that has a directive separator through unchanged, recording only the head. For a head-only context it delivers nothing when the head matches the stored one, and otherwise stores the new head and delivers it [SOURCE: .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:173-187]. CONFIRMED from code. A suppressed turn renders `Advisor: prompt skipped.`. Two guarded follow-ups in a row would deliver that line once and then nothing, which is the intended result. The next real route has a different head, so it is delivered. Suppress also writes no route receipt (iteration 1 design), so the two receipts never feed each other. INFERRED. A Vibe replay test of route, guard, guard, route would confirm it.

### Q3 recommended design

- **Expire on lifecycle clock mismatch or transcript shrink. Add no age limit and no turn count.** The guard fires only when the receipt's `{storeGeneration, lifecycleEpoch}` equals `state.clock(sessionId)`, and, when both byte counts are numbers, the current transcript bytes are at least the receipt's `transcriptBytes`. The shrink check reuses the size the hook already reads, so it costs no spawn. It also catches a host-side rewind that sends no boundary. INFERRED: no rewind path was traced.
- **Why no turn count.** A run of weak follow-ups ("fix that too", then "and the other one") should keep suppressing against the same unfloored route. A turn cap would cut that run off, and it would need a write on guarded turns, which iteration 1 ruled out. INFERRED, a design judgment.
- **Why no age limit while the clock is present.** On Claude, Codex and Vibe, every event that removes the earlier brief from context (clear, compact, a new session) rotates the clock (findings 1 to 3). An old receipt in an unbroken session still points at a route that is still in the transcript. INFERRED from the boundary coverage.
- **Fallback if the spawn cost is too high.** If phase 011 measures the `clock` spawn and rejects it, drop the clock fields and expire by transcript shrink plus a 30-minute age limit from a `writtenAt` field. INFERRED: the 30 minutes is a judgment, not a measurement. Claude's transcript is believed append-only across compaction, so in the fallback a compaction would expire a receipt only through the age limit. That is the weaker design, so the clock stays primary.
- **Amendment to iteration 1's fields:** drop `writtenAt` from the primary design. Nothing reads it, and file `mtime` already drives eviction. That follows iteration 1's own rule against fields nothing reads. Keep `transcriptBytes`. `null` means the shrink check is skipped, which is the DSH case.

### Q4 recommended design

| Host | In 011? | Session id to handler | Clock rotation | 011 change |
|---|---|---|---|---|
| Claude | In | Yes | SessionStart (all sources) and PreCompact | None beyond the hook guard |
| Codex | In | Yes, the whole input forwarded | Through `session-prime.js` | None |
| Vibe | In | Yes, plus transcript | Compaction via `compaction-context.mjs` | A replay test for head-receipt interplay (finding 7) |
| DSH | In, with a boundary call | Yes, no transcript | None today | Call `advanceDirectiveLifecycleBoundary` in the existing `agent/created` and `compaction/end` handlers |
| Pi | Out, named deferral | No | Own in-memory reset only | None. The deferral row names the three changes in finding 5 |
| OpenCode | Out | Does not run the handler | Plugin memory | None. Out because the guard lives in the hook (finding 6) |

### Q5: the measurement

8. **The bench records the task's top skill but not whether it was floored.** `taskTop` is the skill only [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:227]. The harm count is `floored && policyReason === WORK_INTENT_REASON` against the task top [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:230-234]. CONFIRMED from code. Under iteration 1's design only an unfloored route writes a receipt. If the task in any of harm pairs 1, 3, 5, 6 or 9 is itself floored, the guard cannot fire for that pair. UNKNOWN: whether those five task tops are floored was never measured. Pair 8's task (the refactor prompt) is floored per the spec's Measured Behavior, third block, and pair 8 passes through on predicate (d) anyway. This is the largest risk to the threshold below.

9. **`C` does not apply when there is no receipt, by construction.** `C` counts corpus rows whose floored, work-intent top-1 is correct. Each row is a single prompt with no session [SOURCE: .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:256-262]. Guard predicate (a) needs a receipt that is fresh for the session, so a turn with no receipt always delivers. INFERRED from iteration 1's predicate. Running the pure function with `receipt = null` over the corpus rows would confirm it.

### Q5 recommended design (frozen for 011)

- **Harness: both layers.**
  1. A pure `decideRouteReceiptGuard(receipt, clock, transcriptBytes, strippedPrompt, policyReason, top1, floored) -> 'deliver' | 'suppress'` in `hooks/lib/route-receipt.ts`. The bench's follow-up block calls it with a synthetic receipt built from the task's top, written only when the task top is unfloored, and with a fixed matching clock.
  2. A hook-level replay in `runtime/tests/hooks/route-receipt.vitest.ts`. It runs each pair's task, then its follow-up, through `handleClaudeUserPromptSubmit` on one session id. It injects `InMemoryDirectiveLifecycleStore` and an in-memory receipt store, with the scorer result fixed to the bench's recorded tops.
- **New bench output:** add `taskFloored`, `receiptWritten` and `guard` to each pair row, plus `H_after`, the count of harm pairs the guard still delivers.
- **Success threshold, literal:** `H_after = 0` of `H = 5` (pairs 1, 3, 5, 6, 9 all `suppress`); `Hsame = 2` pairs (7, 8) `deliver`; negative controls 2 and 4 `deliver`; `C_after = 0` suppressions over the 19 `C` rows with `receipt = null`. Precondition: `receiptWritten = true` for pairs 1, 3, 5, 6 and 9. If any of those is `false`, 011 stops and reports it. It does not lower the threshold, because a floored task reopens iteration 1's "floored routes never become receipts" rule (finding 8).
- **Scorer isolation check:** `rg -n 'route-receipt|routeReceipt|weak_follow_up' .skilled/skills/system-skill-advisor/runtime/lib/scorer/` prints nothing. The `scoreAdvisorPrompt` signature and its cache key are unchanged in the diff.
- **False-carry case, literal:** session task `Update the advisor README to document the new corpus file layout` (receipt `sk-doc`, if unfloored), then follow-up `Refactor the session store module to remove duplicated locking code`. That follow-up is floored `sk-code` with reason `work_intent_with_meaningful_tokens` (spec Measured Behavior, third block). Predicate (e) fails: there is no back-reference word and there are 6 content words. **Expected route: `sk-code` delivered**, and no `weak_follow_up_receipt` policy reason is recorded.
- **Expiry rows:** one replay advances the session epoch between the task and follow-up of pair 1, and one shrinks the transcript bytes. Both expect `sk-code` delivered.

### 011 changes from Q3 to Q5

- `hooks/lib/route-receipt.ts` row: the receipt holds `version`, `sessionId`, `skill`, `storeGeneration`, `lifecycleEpoch` and `transcriptBytes`, with no `writtenAt`. Add the pure `decideRouteReceiptGuard`.
- Add a Modify row for `hooks/dsh/prompt-advisor.mjs`: a boundary call in the `agent/created` and `compaction/end` handlers.
- Add a REQ: the guard fires only when the stored clock equals `state.clock(sessionId)` and the transcript has not shrunk. There is no age or turn limit.
- Add a REQ naming Pi and OpenCode as out of scope, with the reasons in findings 5 and 6.
- Add a Modify row for `runtime/bench/scorer-calibration.bench.ts`: per-pair `taskFloored`, `receiptWritten` and `guard`, plus `H_after`, with the scorer untouched.
- Add the frozen threshold, the false-carry pair, the two expiry rows and the Vibe route-guard-guard-route row to `runtime/tests/hooks/route-receipt.vitest.ts`.
- Add the scorer-isolation `rg` as a verification row.

## Questions Answered

- Q3 Expiry: answered. The receipt expires on a clock mismatch or a transcript shrink, with no age or turn limit. The fallback is shrink plus a 30-minute age limit.
- Q4 Runtime reach: answered. Claude, Codex and Vibe are in. DSH is in with one boundary call. Pi and OpenCode are out, for stated reasons.
- Q5 The measurement: answered with literal values. One precondition is UNKNOWN: whether the five harm-pair tasks are unfloored (finding 8).

## Questions Remaining

- None of Q1 to Q5 is open as a design question. Three claims still need checking: the floored state of the five harm-pair task tops (finding 8), Codex PreCompact's with-input branch (finding 2), and iteration 1's hand-worked separator table. The rebuilt-`dist/` probe or 011's bench row confirms all three.

## Next Focus

The lineage ends here. Synthesis should merge the Q1 to Q5 designs into `research/research.md` with the 011 amendment, and should put finding 8's precondition first.

## Ruled Out

- **A turn-count expiry.** It cuts off a legitimate run of weak follow-ups and needs a write on guarded turns.
- **An age limit on top of the clock.** It adds no safety on hosts where the clock rotates, and it adds a field.
- **Putting OpenCode in scope.** The guard runs in the hook, and the plugin calls the CLI.

## Dead Ends

- None. No runtime probe was attempted in this iteration, so the iteration 1 permission dead end was not retried.

## Edge Cases

- Ambiguous input: "which hosts deliver boundaries" was read as which hosts rotate the file-store clock for the session id the prompt hook uses, not which hosts have any lifecycle reset.
- Contradictory evidence: the README says DSH "applies a local receipt after the shared handler". That is accurate, but it hides that DSH's file-store clock never rotates (finding 4).
- Missing dependencies: whether the harm-pair tasks are floored is unmeasured (finding 8), and Codex PreCompact was read only partly (finding 2).
- Partial success: all three questions closed with designs. `research/research.md` is not on this dispatch's write list, so progressive synthesis was not written, as in iterations 1 and 2.

## Sources Consulted

- .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:255-272, :340-356
- .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts:566-590
- .skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts:18-92
- .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts:90-115, session-start.ts:28-42, user-prompt-submit.ts:11-22, compact-inject.ts:15-34
- .skilled/hooks/session-lifecycle/vibe/compaction-context.mjs:50-64, :262, :280-296
- .skilled/hooks/directive-lifecycle/README.md:20-100
- .skilled/skills/system-skill-advisor/hooks/dsh/prompt-advisor.mjs:40-75, :128-200
- .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:240-300
- .skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs:166-190, :229-243
- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:227-248, :318-338
- .skilled/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts:121-175
- .opencode/plugins/system-skill-advisor.js:128-140, :226-248, :688-700
- .skilled/skills/system-skill-advisor/runtime/bench/scorer-calibration.bench.ts:90-110, :220-262
- .claude/settings.json:175-221, :331-337; .codex/hooks.json:3-42, :214-219; .vibe/hooks.toml:123-151

## Assessment

- New information ratio: 0.78
- Questions addressed: Q3, Q4, Q5
- Questions answered: Q3, Q4, Q5

## Reflection

- What worked and why: listing every file that calls into the lifecycle before reading any host settled boundary coverage in one pass. That list showed at once that DSH and Pi never appear as clock callers, which became findings 4 and 5.
- What did not work and why: Codex's `compact-inject.ts` was read only at its no-input line, because the grep context stopped there. Its with-input branch is inferred.
- What I would do differently: add a `taskFloored` probe to the first iteration. The receipt-write rule depends on it, and nobody measured it.

## Recommended Next Focus

Synthesis: write `research/research.md` with Q1 to Q5. Put the finding 8 precondition (`receiptWritten` on pairs 1, 3, 5, 6 and 9) at the top of 011's verification, and open every cited line for the REQ-007 verification note.
