# Independent Research Synthesis — Why an OpenCode or Pi hand-over hop fails, and what fixes each failure

**Lineage:** vibe-deepseek (cli-mistral-vibe / deepseek-flash) · **Session:** fanout-vibe-deepseek-1794807924469-5jb1x3 · **Spec:** specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity · **Iterations:** 10 of 10 · **Stop reason:** maxIterationsReached

## 1. Research Metadata

| Field | Value |
|---|---|
| Objective | Find every reason a hand-over hop on OpenCode or Pi can fail to finish the sender's task, or fail to recover a note-omitted detail through the History Lookup, and name a concrete fix for each |
| Method | Ten inline research iterations over the handover hooks, the shared session readers, the Pi extension, the OpenCode plugin, the history lookup core, and the packet's recorded live-run evidence |
| Scope | Research only; every artifact written inside this lineage directory |
| Iteration findings | 81 findings across 10 iterations; reducer reports 10 completed iterations and zero corruption |
| Evidence limits | No live hop was run in this lineage. Every failure mode is established from code plus the packet's recorded panes, scorecards and relaunch logs, not from a fresh run |
| Known case under study | A live Pi hop on DeepSeek V4.1 Flash at max scored 4/5; the same task on OpenCode scored 5/5 |

## 2. Executive Summary

The Pi 4/5 is not a recall failure and not a relaunch failure. The Pi relaunch log records a `ready` relaunch 0.2 seconds after the signal, and the receiver's pane shows a complete, coherent reply. The missing step is `noteClosed`: the receiver asked the operator in prose instead of running the History Lookup, and left the note claimed. The OpenCode receiver, given the same kind of offer, ran `load` on the sender's turn and closed the note.

Three root causes explain the ten failure modes this lineage found.

1. **The note is treated as the only channel.** The prepare text never tells the sender that a lookup exists, so a sender that is told to keep a detail out of its note writes a closing sentence ("a fresh session cannot recover it") rather than a pointer. The claim text then prints the lookup offer after the note body with a weaker directive, so a receiver that reads top-down treats the note as authoritative. When the offer is withheld, the mint returns null and the call site catches silently, so a withheld offer is indistinguishable from no need to look.
2. **The readers and the scorecard disagree about what a session is.** The OpenCode reader skips the project proof when the store has no `directory` column. The preview is the first 160 characters of redacted text, so a detail past character 160 is invisible until the receiver loads the turn. The scorecard slices the pane at the last `[session-handover]` marker or the whole pane, and the Pi pane has no marker, so `sideWordStated: true` is the sender's own prompt echo at character 12,812 of 30,172.
3. **The relaunch path has no per-runtime settings contract.** `resolveSessionSettings` has no Pi or OpenCode branch, the OpenCode plugin never reads model or effort, and `build_relaunch_arguments` drops the model on OpenCode 2. Pi is unaffected only because its extension supplies the values itself.

The most consequential finding is about proof rather than behaviour: three of the packet's five completion criteria cannot be proven by the current harness. The Pi recall metric passes on a false positive, the redaction criterion has no token plant and no scorecard field, and the two suite criteria are outside this lineage's write authority. Three consecutive green Pi runs would therefore prove nothing until the scorecard's slice is fixed.

## 3. Research Question & Objectives

The question was why a hop on OpenCode or Pi can fail to finish the sender's task, or fail to recover a detail the note left out through the History Lookup, and what concrete fix each failure needs. Five sub-questions were tracked: the prepare text each runtime gives the sender; the claim text and lookup offer the receiver reads; how the two session readers feed the lookup and whether they redact tool-call argument shapes; whether model and effort carry across the relaunch; and which of the four known limits can make a hop fail.

## 4. Method

Ten iterations, each reading a bounded slice of the handover code and the packet's recorded evidence. Iterations 1 and 5 read the two live notes and panes side by side. Iterations 2 and 9 read the readers and the redaction layer, and iteration 9 executed the compiled scrubber against seventeen candidate plant strings and seven header and URL shapes rather than reasoning about the regexes. Iteration 3 traced model and effort from the record writer through the record reader to the argument builder. Iterations 4, 6, 7 and 8 read the nudge, the claim lifecycle, the relaunch decision and the lookup CLI's withholding conditions. Iteration 10 consolidated the findings into ten modes and mapped each completion criterion to the harness capability that would prove it.

The packet's `scratch/runs/` evidence was read as data and never re-executed. No live hop was run, so every claim about runtime behaviour is a code-path claim corroborated by a recorded pane, scorecard or log line.

## 5. The Hop's Stages and Where Each Can Break

A hop has five stages, and each has at least one silent failure mode.

| Stage | What must happen | Failure mode | Where |
|---|---|---|---|
| Nudge | The hook decides to hand over | `AI_SESSION_CHILD=1` short-circuits the decision; two hooks can both nudge | `nudge.cjs:707`, `context-nudge.mjs:157` |
| Prepare | The sender writes a note that points at the lookup | The prepare text never names the lookup, so the sender closes the question | `nudge.cjs:180`, `session-handover.cjs:630` |
| Relaunch | The new session starts with the same model and effort | OpenCode reads and writes neither | `relaunch-core.cjs:1121`, `relaunch-core.cjs:775` |
| Claim | The receiver reads the note and the lookup offer | The offer prints after the note body with a weaker directive; a withheld offer is silent | `session-handover.cjs:729`, `relaunch-core.cjs:929` |
| Close | The receiver finishes the task and closes the note | A claimed note never expires; the hold guard covers question tools only | `relaunch-core.cjs:407`, `killer.cjs:317` |

The Pi run failed at Claim and Close, not at Relaunch. The OpenCode run passed all five.

## 6. Sender Side: The Prepare Text

The prepare seed's opening line is `Write a handoff note before auto-compaction`, and the prepare stdout describes writing a note and nothing else. Neither names the History Lookup. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:180] [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:630]

Both senders obeyed the withholding instruction: both scorecards record `sideWordInNote: false`. The difference is the sentence each wrote about recoverability. The Pi note says a fresh session cannot recover the side word; the OpenCode note points at the lookup. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/note-2026-11-15T22-14-08-431Z.md:31] [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/note-2026-11-15T22-14-08-431Z.md:25]

A sender that believes the note is the only channel writes a closing sentence, because that is the honest thing to write. The fix is one sentence in the prepare seed and in the prepare stdout naming the lookup and the receiver's ability to read the sender's turns.

## 7. Receiver Side: The Claim Text and the Lookup Offer

The claim seed text omits the lookup, and the claim output prints the offer after the note body with a weaker directive. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:276] [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:729]

The Pi receiver read the note's closing sentence and dismissed the lookup on its authority: the pane records the decision at character 331. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-pi/pane.txt:331] The OpenCode receiver ran `load` on the sender's turn at character 22 of its pane and closed the note. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/runs/base1-opencode/pane.txt:22]

The offer can also disappear entirely. `mintHandoverLocator` returns null on an empty runtime or session id, a runtime with no locator kind, a missing transcript path, a `placeLookup` miss, a reader that cannot find the session, or a recorded folder outside the sender's checkout. `handoverLookupSection` withholds the offer unless the receiver's workspace and the sender's workspace are the same checkout, and `lookupRunsFrom` requires a `.git` entry, the entry script and the compiled core at `history/dist/cli.js`. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:929] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1090] [SOURCE: .skilled/hooks/session-handover/history/lib/lookup-offer.ts]

Every one of those conditions fails closed by returning null, and the claim command wraps the call in a bare `catch {}`, so a withheld offer produces no message, no log line and no marker. A receiver cannot tell "no lookup is available" from "there is nothing to look up". [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:729]

The locator itself is sound. It is minted at claim time rather than prepare time, precisely so the 30-minute `LOCATOR_TTL_MS` does not bite a note claimed hours later, and a locator whose `mintedAt` is in the future counts as stale because a future timestamp is clock skew rather than freshness. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1060] [SOURCE: .skilled/hooks/session-handover/history/lib/cli.ts:37] [SOURCE: .skilled/hooks/session-handover/history/lib/cli.ts:217]

## 8. The Readers and the Redaction Contract

Both readers emit `toolCallBlock`, and the core redacts every block regardless of which reader produced it, so redaction is a shared layer rather than a per-adapter duty. Redaction runs before projection: `createHistoryLookup` calls `projectHistoryEntries(redactHistoryEntries(entries), options)`, so every preview, page offset, part list and search index is computed on the text a caller receives. A secret cannot be matched by `search`, and a secret straddling a page boundary is redacted before the boundary is chosen. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:136]

The layer has three gaps.

- `SECRET_ARGUMENT_KEY` does not match `x-api-key` or `X-Api-Key`, because the alternation requires the key to begin with `api`, `access`, `auth`, `client`, `refresh` or `secret`. The value alone carries no assignment context, so `{"x-api-key": "FAKE0123456789abcdef"}` leaks both the key and the value. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:56]
- The array branch of `redactArgument` drops the key, so an array under a plural secret key is only shape-scanned. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:71]
- Image blocks are returned unchanged, deliberately, because image bytes are base64 where a pattern hit would corrupt the image. A token visible in a screenshot is not redacted. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:86]

The shared scrubber is shape-driven, not entropy-driven. It requires a vendor prefix, a fixed length, or an assignment context with both a digit and a letter and a 20-character floor. Running the compiled scrubber shows the consequence: `FAKE_TOKEN_abc123` and `PLANTED_FAKE_TOKEN_9f3a2b1c8d7e6f5a` pass through unchanged, `sk-fake-0123456789abcdef0123456789abcdef` misses because the hyphen after `sk-` breaks the base62 value class, and `AIzaFake0123456789abcdef0123456789abc` misses because its tail is 33 characters against a required 35. [SOURCE: .skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:59] [SOURCE: .skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:102] [SOURCE: .skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:109]

The OpenCode reader has a separate defect: when the store has no `directory` column it skips the project proof, so the lookup's answer may come from a different checkout. The Pi reader proves the cwd from the session header instead. [SOURCE: .skilled/hooks/session-handover/hooks/shared/session-readers/opencode.mjs:256] [SOURCE: .skilled/hooks/session-handover/hooks/shared/session-readers/pi.mjs:242]

The preview is the first 160 characters of redacted text. The side word sat at character 295 of a 425-character turn, so it appeared in neither the preview nor any marker; the OpenCode receiver recovered it only because it chose to `load` the turn. [SOURCE: .skilled/hooks/session-handover/history/lib/pages.ts:300]

## 9. Model and Effort Carry on Relaunch

`resolveSessionSettings` has no Pi or OpenCode branch. Pi is unaffected because its extension supplies the values itself through `liveSettings` and replays provider, model and thinking. OpenCode is not: the plugin never reads model or effort, `effort_is_valid` and `append_effort_arguments` have no OpenCode case, and `build_relaunch_arguments` drops the model on OpenCode 2. The wrapper's own comment records that OpenCode 2 has no model flag on its root command, so there is no launch argument to append; the fix has to be a config write or a per-session setting. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1121] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:775] [SOURCE: .pi/extensions/session-handover.ts:461] [SOURCE: .opencode/plugins/session-handover.js:575]

The scorecards record the consequence as `unobservable` or `not-set` rather than as a failure, which is why a hop can score 5/5 while silently running on a different model than the sender.

## 10. The Nudge: Suppression and the Double Nudge

`AI_SESSION_CHILD=1` short-circuits `nudgeDecision` through `relaunchSessionIsChild`, a bare environment read. The suppression is deliberate: it stops a relaunched child from nudging again. But a test sandbox that inherits the variable gets no nudge at all, so a suite that runs under the variable tests nothing about the hop. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:707] [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:703]

The double nudge is a separate gap. Only claude, codex and vibe route through `commitNudge`; Pi and OpenCode keep in-process state (`heldNudges` and `state.pendingNudge`), so two hooks can both nudge. Claude registers `context-nudge.mjs` on both `UserPromptSubmit` and `PostToolUse`, which is exactly the shape that needs the claim guard. [SOURCE: .skilled/hooks/session-handover/hooks/context-nudge.mjs:157] [SOURCE: .pi/extensions/session-handover.ts:652] [SOURCE: .opencode/plugins/session-handover.js:181] [SOURCE: .claude/settings.json:169]

## 11. Recommendations — One Fix per Failure Mode

| # | Failure mode | Concrete fix | Source |
|---|---|---|---|
| A | The sender is never told the lookup exists | Name the lookup and the receiver's ability to read the sender's turns in the prepare seed and the prepare stdout | `nudge.cjs:180`, `session-handover.cjs:630` |
| B | The note outranks the lookup in the claim text | Print the lookup offer before the note body and phrase it as a step, not an option | `nudge.cjs:276`, `session-handover.cjs:729` |
| C | A withheld offer is silent | Return a typed refusal from `mintHandoverLocator`, print one line naming the reason, and log it instead of swallowing it in the bare `catch {}` | `relaunch-core.cjs:929`, `session-handover.cjs:729` |
| D | The OpenCode reader can return another project's session | Require the `directory` column, or prove the project from the session's own record rather than the store schema | `opencode.mjs:256` |
| E | A secret survives redaction under `x-api-key`, in an array, or in an image | Accept a vendor prefix and a plural suffix in `SECRET_ARGUMENT_KEY`, pass the parent key into the array branch, and document the image exclusion as a known limit | `core.ts:56`, `core.ts:71`, `core.ts:86` |
| F | A detail past character 160 is invisible | Raise the preview bound, or append an explicit truncation handle so the receiver knows the preview is cut | `pages.ts:300` |
| G | Model and effort do not carry on OpenCode | Write the model and effort into the OpenCode config or a per-session setting, since the root command has no model flag | `relaunch-core.cjs:1121`, `relaunch-core.cjs:775` |
| H | A bare env read suppresses the nudge, and two hooks can both nudge | Replace the bare env read with a marker written into the relaunch environment, and route Pi and OpenCode through `commitNudge` | `nudge.cjs:707`, `context-nudge.mjs:157` |
| I | A claimed note never expires | Add an expiry sweep for a claimed note past its window, and widen the hold guard to a prose ask | `relaunch-core.cjs:407`, `killer.cjs:317` |
| J | The scorecard can report a pass that did not happen | Require the `[session-handover]` marker or slice from the receiver's first turn, and add a token plant plus a redaction assertion | `score.cjs:74`, `live-hop.sh:61` |

Two further defects are worth fixing alongside these. Six decline reasons (`no-file`, `not-armed`, `withdrawn`, `stale`, `hop-cap`, `incomplete-record`) are silent because the wrapper preserves the runtime's exit code and prints a warning only when the decision command itself fails. And a future `armedAt` reads as stale, while the hop count is never coerced. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:407] [SOURCE: .skilled/hooks/session-handover/lib/killer.cjs:317]

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat the Pi 4/5 as a recall failure | The five scored steps do not include recall; the missing step is `noteClosed` | `score.cjs:74`, `base1-pi/pane.txt:331` | 5 |
| Treat the Pi 4/5 as a relaunch failure | The relaunch log records `ready` 0.2 s after the signal | `base1-pi/relaunch.log` | 7 |
| Blame the Pi sender for leaking the side word | Both scorecards record `sideWordInNote: false` | both scorecards | 1 |
| Conclude the Pi lookup was never offered | The offer is minted at claim time from the note's own `session_id`, `runtime` and `cwd`, all three of which the Pi note carries; the pane collapses tool output, so its silence is not evidence of absence | `relaunch-core.cjs:1072` | 1 |
| Trust `sideWordStated: true` on Pi as proof of recall | The card's input is the echoed prompt, and the receiver's reply says the opposite | `score.cjs:74`, `base1-pi/pane.txt:331` | 5 |
| Assume the double nudge is unguarded everywhere | Three adapters take the claim and are safe; the gap is Pi and OpenCode only | `context-nudge.mjs:157`, `pi/session-handover.ts:652` | 4 |
| Assume the note stayed claimed because the receiver crashed | The pane shows a complete, coherent reply and a deliberate decision to hold the close | `base1-pi/pane.txt:333` | 6 |
| Assume the question-hold guard should have blocked the ask | The guard covers question tools only, and the receiver asked in prose | `pi/session-handover.ts:188` | 6 |
| Assume the OpenCode model carries because the plugin reads `input.model` | It reads only `limit.context`, a number, and writes nothing to the record | `session-handover.js:575` | 3 |
| Assume the Pi carry is broken because `resolveSessionSettings` has no Pi branch | The Pi extension supplies the values itself, so the missing branch is harmless on Pi | `pi/session-handover.ts:461` | 3 |
| Look for a `--thinking` flag on OpenCode's CLI | The wrapper's own comment states OpenCode 2 has no model flag on its root command | `relaunch-core.cjs:775` | 3 |
| Assume redaction is per-adapter, so one runtime can miss it | Both readers emit `toolCallBlock` and the core redacts every block | `core.ts:86` | 2 |
| Assume the preview cut is harmless because search returns the whole turn | It returns a bounded preview plus a read handle; the value is only reachable through the handle | `pages.ts:300` | 2 |
| Assume any planted fake token will be redacted | The scrubber is shape-driven; a generic `FAKE_TOKEN_...` string is not a secret shape | `secret-scrubber.ts:59` | 9 |
| Plant the token in an image to exercise redaction | Image blocks are returned unchanged by design | `core.ts:86` | 9 |
| Assume the redaction test proves the criterion | The test proves seven vendor shapes and two keyed argument names; it does not prove the header-key, array or image paths | `history-secret-redaction.vitest.ts:15` | 9 |
| Look for a reason code on a withheld offer | There is none; the function returns null rather than a typed refusal | `relaunch-core.cjs:929` | 8 |
| Treat the 30-minute locator TTL as a bug | Minting at claim time makes the TTL irrelevant to a normal hop | `relaunch-core.cjs:1060` | 8 |
| Look for a timeout that closes a stale claim | There is none in the handover code, so the fix has to add one rather than tune one | `killer.cjs:317` | 6 |
| Look for a retry after a decline | There is none; the wrapper takes the decline path once and exits | `skilled-loop:1263` | 7 |
| Read the pane transcript for the claim command's stdout | The capture collapses tool output, so the offer's presence cannot be proven or disproven from the pane | `base1-pi/pane.txt` | 1 |
| Read the Pi fixture for a tool-call argument shape | `pi-assistant-message-end.json` carries no `toolCall` item, so the shape had to be read from the reader's mapping | `pi.mjs` | 2 |
| Look for an entropy or high-randomness detector in the scrubber | There is none; every pattern is a vendor shape, a fixed length, or an assignment context | `secret-scrubber.ts:59` | 9 |
| Look for a redaction count or marker summary in the reply metadata | The reply carries a `preview` and part handles, but no field saying something was removed | `pages.ts:300` | 9 |
| Look for a token-planting branch in the harness | There is none, so the redaction criterion cannot be scored from the current harness at all | `live-hop.sh:61` | 5, 9 |
| Fix the prepare text alone and expect the Pi gap to close | The Pi receiver had a working offer and did not run it, so the claim text and the note's authority bind first | `base1-pi/pane.txt:331` | 10 |
| Treat the five completion criteria as five independent checks | The first two read the same scorecard recall slice, so fixing the slice changes both verdicts at once | `score.cjs:74` | 10 |

## Divergence Map

No graph pivots or saturation events were recorded: the coverage graph was deliberately not written, because the graph upsert writes a sqlite database and a writer lock outside this lineage's write authority. Convergence therefore ran to the iteration cap rather than to a graph-settled stop.

The lineage triangulated four angles rather than pivoting between them. The first was the two live notes and panes read side by side, which isolated the variable: both senders got the same withholding instruction and both obeyed it, and only the sentence each wrote about recoverability differed. The second was the code path behind each sentence, which explained where each sentence came from. The third was the reader and redaction layer, read and then executed rather than reasoned about. The fourth was the relaunch and lifecycle path, traced from the record writer through the record reader to the argument builder.

The strongest divergence is between the scorecard and the pane. The scorecard reports `sideWordStated: true` on Pi; the pane shows the receiver saying the side word could not be recovered. The scorecard is reading the sender's prompt echo because the Pi pane has no `[session-handover]` marker to slice at. That divergence is the single most important result of this lineage, because it means the packet's first completion criterion can pass on a false positive.

The second divergence is between the design intent and the observable behaviour of the withheld offer. The mint fails closed by design, which is correct, but the bare `catch {}` at the call site turns a correct refusal into an invisible one.

The remaining frontier is the live proof. No hop was run in this lineage, so the ten modes are code-path claims corroborated by recorded evidence. The smallest next evidence is one Pi hop with the scorecard's slice fixed and one Pi hop with a vendor-shaped token planted.

## 12. Open Questions

1. Which fix closes the Pi gap first: the prepare text, the claim text, or the scorecard slice? The evidence says the claim text and the note's authority bind first, but the scorecard must be fixed before any of the three can be measured.
2. Should the preview bound rise, or should the preview carry an explicit truncation handle? Raising the bound costs reply bytes; a handle costs one line and tells the receiver the preview is cut.
3. Should the OpenCode model and effort be written into the config or into a per-session setting? The wrapper's comment rules out a launch flag, but the two remaining options differ in whether the setting survives the session.
4. Should `AI_SESSION_CHILD` suppression be replaced by a relaunch marker, or should the test harness simply unset the variable? The first fixes the class; the second fixes the symptom.
5. Should a claimed note expire, or should the receiver be required to close it before the session ends? Expiry is a safety net; a required close is a contract.

## 13. Risks & Caveats

- No live hop was run in this lineage. Every failure mode is a code-path claim corroborated by the packet's recorded panes, scorecards and relaunch logs.
- The Pi recall metric is a false positive, so any conclusion drawn from `sideWordStated: true` on Pi is unsound until the scorecard's slice is fixed.
- The redaction criterion cannot be scored from the current harness at all: there is no token plant and no scorecard field.
- The scrubber analysis is empirical for the seventeen strings tested and inferential for shapes not tested. A shape that was not tried may behave differently.
- The OpenCode evidence holds one run, not three, so the 5/5 is a single observation rather than a streak.
- The coverage graph was not written, so convergence ran to the iteration cap and the graph-based stop signal was never available.

## 14. Convergence Report

- Stop reason: maxIterationsReached
- Total iterations: 10
- Questions answered: 5 / 5
- Remaining questions: 0 tracked; five implementation decisions are carried forward in Section 12
- Last 3 iteration summaries: iteration 8 enumerated the six conditions under which the lookup offer is withheld and found the silent `catch {}` (newInfoRatio 0.72); iteration 9 established that the scrubber is shape-driven and that a generic planted token is not caught (0.78); iteration 10 consolidated the findings into ten modes and mapped each completion criterion to the harness capability that would prove it (0.35)
- Convergence threshold: 0.05
- Divergence summary: no formal pivots; the scorecard and the pane diverge on Pi recall, and the mint's fail-closed design diverges from its silent call site
- Segment transitions, wave scores, and checkpoint metrics are experimental and omitted from the live report.

## 15. References

Repository sources, by area.

- Prepare and claim text: `.skilled/hooks/session-handover/lib/nudge.cjs:180`, `:276`, `:703`, `:707`; `.skilled/hooks/session-handover/bin/session-handover.cjs:630`, `:729`, `:742`
- Relaunch and lifecycle: `.skilled/hooks/session-handover/lib/relaunch-core.cjs:407`, `:775`, `:929`, `:1060`, `:1072`, `:1090`, `:1121`; `.skilled/hooks/session-handover/lib/killer.cjs:23`, `:29`, `:220`, `:317`
- History lookup: `.skilled/hooks/session-handover/history/lib/core.ts:56`, `:71`, `:86`, `:136`; `.skilled/hooks/session-handover/history/lib/pages.ts:300`; `.skilled/hooks/session-handover/history/lib/cli.ts:37`, `:217`; `.skilled/hooks/session-handover/history/lib/lookup-offer.ts`
- Readers: `.skilled/hooks/session-handover/hooks/shared/session-readers/opencode.mjs:256`; `.skilled/hooks/session-handover/hooks/shared/session-readers/pi.mjs:242`
- Runtime adapters: `.pi/extensions/session-handover.ts:188`, `:461`, `:652`, `:753`; `.opencode/plugins/session-handover.js:181`, `:575`; `.skilled/hooks/session-handover/hooks/context-nudge.mjs:157`; `.claude/settings.json:169`
- Shared scrubber: `.skilled/skills/system-spec-kit/shared/parsing/secret-scrubber.ts:59`, `:102`, `:109`, `:135`
- Tests: `.skilled/hooks/session-handover/history/tests/history-secret-redaction.vitest.ts:15`, `:28`
- Harness: `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh:61`; `.../scratch/harness/score.cjs:55`, `:74`
- Live-run evidence: `.../scratch/runs/base1-pi/note-2026-11-15T22-14-08-431Z.md:31`; `.../scratch/runs/base1-pi/pane.txt:331`, `:333`; `.../scratch/runs/base1-pi/relaunch.log`; `.../scratch/runs/base1-opencode/note-2026-11-15T22-14-08-431Z.md:25`; `.../scratch/runs/base1-opencode/pane.txt:22`

No `resource-map.md` was present at init, so no map citation is made.

## 16. Orchestrator Verification

| Check | Result |
|---|---|
| Iteration files present | 10 of 10, `iterations/iteration-001.md` through `iteration-010.md` |
| Delta files present | 10 of 10, `deltas/iter-001.jsonl` through `iter-010.jsonl` |
| Gateway receipts | 11 ledger records: 1 run-initialized plus 10 iteration records, all exit 0 |
| Reducer state | `iterationsCompleted: 10`, `corruptionCount: 0` |
| Convergence | `stop_decision.decision: STOP`, `stopReason: maxIterationsReached` |
| Key questions | 5 of 5 ticked in the strategy |
| Findings | 81 across 10 iterations, each with a source or inference marker |
| Write boundary | Every artifact inside this lineage directory; no reducer-owned file edited directly; the state projection written only by the gateway |
| Nested dispatch | None; every iteration ran inline in this process |

## 17. Workflow and Scope Deviations

- **Graph upsert skipped.** `step_graph_upsert` writes a sqlite coverage graph and a writer lock outside this lineage's write authority, so it was not run. The consequence is recorded rather than hidden: `convergence.cjs` reports `nodeCount: 0` and a `CONTINUE` graph decision, so the loop could not reach a graph-settled stop and ran to the iteration cap.
- **Fan-out merge skipped.** `step_fanout_merge` is owned by the parent orchestrator, not by this lineage.
- **Resource map skipped.** `step_emit_resource_map` would write outside the lineage, and `resource_map_present` is false.
- **Spec write-back skipped.** The post-synthesis `spec.md` write-back is outside this lineage's write authority.
- **Suite and validator criteria not run.** The `env -u AI_SESSION_CHILD` suites and `validate.sh --strict --quiet` are verification steps outside a research lineage's scope, and the dispatch prompt forbids running `validate.sh`.
- **One in-lineage correction.** A line-number citation in `iteration-006.md` was corrected from 739 to 742 after re-reading the source. The edit stayed inside the lineage directory.
