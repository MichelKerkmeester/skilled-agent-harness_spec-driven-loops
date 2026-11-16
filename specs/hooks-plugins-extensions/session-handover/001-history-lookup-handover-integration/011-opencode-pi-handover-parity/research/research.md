# Research Synthesis: Why An OpenCode Or Pi Hand-Over Hop Fails, And The Fix For Each

## 1. Research Metadata

- **Packet**: `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity`
- **Loop**: `/deep:research:auto`, two-lineage fan-out
- **Lineages**: `vibe-deepseek` (cli-mistral-vibe, `deepseek-flash`, thinking max) ran 10 iterations and stopped at `maxIterationsReached`. `opencode-go-deepseek` (cli-opencode, `opencode-go/deepseek-v4.1-flash`, variant max) ran 8 iterations and stopped at `converged`.
- **Questions answered**: 5 of 5 in each lineage
- **Lineage syntheses**: `lineages/vibe-deepseek/research.md`, `lineages/opencode-go-deepseek/research.md`
- **Date**: 2026-11-16

## 2. Executive Summary

A hop on Pi or OpenCode moves the work correctly: prepare, the kill, the relaunch, the claim and the History Lookup all ran on both runtimes in the baseline hops. What fails is what the two models are told. The sender is never told that the receiver can read its turns, so a sender that kept a detail out of the note can write that the detail is lost. The receiver reads the note first and the lookup offer last, with a weaker instruction, so it believes the note. On the Pi baseline hop that chain cost the side word and left the note `claimed`.

Both lineages reached this independently, and the orchestrator confirmed it against the code. The text fix lives in two shared places, `nudge.cjs` and the claim output, so it reaches every runtime at once.

Four further gaps are real but smaller. The redaction key rule misses prefixed and plural credential names and drops the key inside arrays. Browse previews stop at 160 characters with no sign that they stop. The harness scorer can record a recall that never happened, and it plants no secret, so two completion criteria cannot be measured yet. Model and effort do not carry on an OpenCode 2 relaunch, because its root command has no model flag.

## 3. Research Question And Objectives

Find every reason a session hand-over hop on OpenCode or Pi can fail to finish the sender's task, or fail to recover a detail the note left out through the History Lookup, and name a concrete fix for each.

## 4. Method

Each lineage read the hand-over code, the session readers, the lookup engine and the two baseline runs, and ran the scrubber against sample inputs. The Vibe lineage spread across ten angles: prepare and claim text, readers and redaction, carry, the child flag and nudge, the scorecard, the claim lifecycle, relaunch, the CLI and redaction end to end, then a consolidation. The OpenCode Go lineage covered the same ground in fewer passes and spent its last three iterations on evidence classes and question coverage.

The orchestrator checked the load-bearing claims against source before this synthesis:

- `core.ts:57`: `SECRET_ARGUMENT_KEY` anchors on the whole key, so `x-api-key` does not match.
- `core.ts:78`: the array branch calls `redactArgument(item)` with no key.
- `score.cjs:64`: the recall slice falls back to the whole pane when no `[session-handover]` marker is present.
- `skilled-loop:775`: OpenCode 2 receives no `-m`, and `opencode --help` lists no model flag on the root command.
- The Pi receiver's transcript records `model_change` to `deepseek-v4.1-flash-1017` and `thinking_level_change` to `max`, so Pi carry works.
- The Pi receiver ran the claim with its own `--session` id, which only the injected seed steps carry, so Pi does inject them.

## 5. The Hop's Stages And Where Each Broke

| Stage | Pi baseline | OpenCode baseline |
|---|---|---|
| Nudge and prepare | Worked | Worked |
| Kill and relaunch | Worked, `relaunch reason=ready` 0.2 s after the signal | Worked |
| Claim and lookup offer | Worked, offer printed with a runnable `browse` | Worked |
| Receiver uses the lookup | Failed: dismissed it on the note's word | Worked: loaded the sender's first turn |
| Close the note | Failed: held open waiting for the operator | Worked |

## 6. Sender Side: The Prepare Text

`handoffText` in `nudge.cjs:161` is the one text every runtime's sender reads. It lists the note's shape and the steps around prepare and never names the History Lookup. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:161] `/speckit:handoff` Step 3, the long form of the same instructions, also never names it. [SOURCE: .skilled/commands/speckit/handoff.md:99]

The Pi sender's reasoning shows the cause: "The claim seed carries only the note path and the spec folder ... So literally impossible." It then wrote "say plainly that a fresh session cannot recover it from this note". [SOURCE: scratch/runs/base1-pi/note-20261116T053237Z-01a1e2d7-6b7b-75de-a705-ee16233b97a3.md] The OpenCode sender, given the same instruction, wrote that the receiver should recover the side word "through the claim's History Lookup section", and that hop passed. The difference is what each model happened to infer, not anything the runtime told it.

## 7. Receiver Side: The Claim Text And The Lookup Offer

`seedText` gives the receiver ordered steps: claim, read the note, goal, active command, continue, complete. None of them is the lookup. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:276] The claim output prints the note body first and the offer last, closing with "Use it for a detail this note does not spell out, before you guess." [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:735] A note that says "ask the operator" is a stronger and earlier instruction than "before you guess", and asking is not guessing. The Pi receiver followed the note: "A fresh session has no path to it ... not through history lookup, since it was never written."

Because the receiver then waited for an operator answer, the note stayed `claimed`. Nothing expires a claimed note, and the question-hold guard covers only question tools, not a question asked in prose. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:188]

## 8. The Readers And The Redaction Contract

Redaction runs once, before projection, so search, previews and pages all see redacted text. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:101] Three shapes get through:

- A credential under a prefixed or plural key, such as `x-api-key` or `api_keys`, because the key rule is anchored on the whole key. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:57]
- A secret inside an array under a credential key, because the array branch drops the key. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:78]
- A short or shapeless token, because the shared scrubber needs a vendor prefix, a fixed length or a 20-character assignment value. This is a property of the shared scrubber and is recorded as a limit.

The OpenCode Go lineage found that a tool call whose arguments are stored as a JSON string becomes `{}` in projection, which loses the call's content rather than leaking it. [SOURCE: .skilled/hooks/shared/session-readers/project.mjs] No baseline transcript showed a string argument, so this is a latent loss.

Browse previews are the first 160 characters of a turn. The baseline side word sat at character 295 of a 425-character turn, so the offer's own first command could not show it, and the preview gives no sign that it was cut. [SOURCE: .skilled/hooks/session-handover/history/lib/pages.ts:300] Search previews are centred on the match and do not have this problem.

An OpenCode store without a `directory` column skips the folder proof. Current stores carry the column. [SOURCE: .skilled/hooks/shared/session-readers/opencode.mjs]

## 9. Model And Effort Carry On Relaunch

Pi carries provider, model and thinking level through its extension and the wrapper's relaunch flags. The receiver's transcript proves it. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:461] [SOURCE: .skilled/bin/skilled-loop:753]

OpenCode 2 carries neither. Its root command has no model flag, so the wrapper sends `-m` only to OpenCode 1, and the plugin never records a model or effort. [SOURCE: .skilled/bin/skilled-loop:775] [SOURCE: .opencode/plugins/session-handover.js:575] A receiver starts on whatever model OpenCode itself selects at launch.

## 10. The Nudge: Child Flag And Double Delivery

`AI_SESSION_CHILD=1` silences the nudge before any other check, and neither `skilled-loop` nor the live-hop harness clears it, so a hop started from a dispatched worker never nudges its sender. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:707] Pi and OpenCode guard against a double nudge with in-process state rather than the shared `commitNudge` claim. That is enough for one process. Pi also spends the nudge level before delivery, so a reload between the two loses that nudge. [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:652]

## 11. Recommendations: The Fix Set

Ranked by what blocks a reliable hop on OpenCode and Pi:

| # | Gap | Fix | Where |
|---|---|---|---|
| 1 | The sender does not know the lookup exists | Tell the sender, in the prepare text and in `/speckit:handoff` Step 3, that the receiver can read this session's turns through the History Lookup. Tell it never to write that a detail is lost or that the receiver must ask the operator for something this session saw: name where the detail is instead. | `nudge.cjs` `handoffText`, `handoff.md` Step 3 |
| 2 | The receiver trusts the note over the lookup | Add a seed step: before asking the operator or deciding a detail is lost, run the History Lookup the claim printed. Make the claim's closing line say the note cannot see what the lookup holds. | `nudge.cjs` `seedText`, `session-handover.cjs` claim output |
| 3 | Redaction misses prefixed, plural and array-held credentials | Match a credential word anywhere in the key, and pass the parent key into the array branch | `history/lib/core.ts` |
| 4 | The harness cannot measure recall or redaction | Score recall only from the receiver's own turns, plant a vendor-shaped fake token in the sender's prompt, and assert the receiver never shows it. Clear `AI_SESSION_CHILD` in the harness launch. | `scratch/harness/score.cjs`, `scratch/harness/live-hop.sh` |
| 5 | A cut browse preview gives no sign it is cut | End a cut preview with a visible mark that the turn continues, so the receiver knows to `load` it | `history/lib/navigator.ts` |

Recorded for later, outside this phase:

- OpenCode 2 model and effort carry. It needs a design choice (config injection or a per-session setting) and touches the plugin, the wrapper and the record.
- String tool-call arguments becoming `{}`. Latent, with no observed case.
- A typed reason when the lookup offer is withheld, an expiry for a claimed note, Pi held-nudge persistence, the OpenCode store without a `directory` column, and `AI_SESSION_CHILD` handling inside `skilled-loop` itself.

## Eliminated Alternatives

| Approach | Why it was eliminated | Evidence |
|---|---|---|
| The Pi lookup was never offered | The receiver's transcript holds the full offer and a runnable `browse` | Pi receiver transcript, claim tool result |
| The Pi lookup does not work | `search` and `browse` on the sender's session return the turn with the side word | Measured Behavior in `spec.md` |
| Pi relaunch or carry is broken | `relaunch reason=ready` 0.2 s after the signal, and the receiver's model and thinking level match the sender's | `base1-pi/relaunch.log`, receiver transcript |
| Pi does not inject the seed steps | The receiver ran the claim with its own `--session` id, which only the seed steps carry | Pi receiver transcript |
| Fix the prepare text alone | The Pi receiver had a working offer and still deferred to the note, so the receiver side needs the fix too | `base1-pi/pane.txt:331` |
| Trust `sideWordStated: true` on Pi | The scorer read the sender's echoed prompt because the pane had no seed marker | `score.cjs:64` |
| Plant `FAKE_TOKEN_...` to test redaction | The scrubber is shape-driven and does not treat that as a secret | scrubber patterns |
| Replay `-m` to OpenCode 2 | Its root command has no model flag and the launch would fail | `skilled-loop:775`, `opencode --help` |

## Divergence Map

No divergent pivots ran, since the convergence mode was `default`. The two lineages diverged in breadth. Vibe covered relaunch decisions, the killer, the CLI's refusal surface and the claim lifecycle, which OpenCode Go did not reach. OpenCode Go covered the string-argument loss, the whole-session failure on one bad pair and the held-nudge loss, which Vibe did not reach. They agree on every finding both reached. The remaining frontier is live proof: no lineage ran a hop, so the fix set is confirmed by the hops the implementation runs.

## 12. Open Questions

- How should OpenCode 2 carry model and effort across a relaunch, given that its root command takes no model flag?
- Should a claimed note expire, or should a receiver be required to close it before its session ends?

## 13. Risks And Caveats

- Text fixes change model behavior, not code paths, so one passing hop proves little. The goal requires three consecutive passes per runtime.
- Both lineages ran on DeepSeek Flash, the same family as the receivers. A shared blind spot is possible. The live hops are the independent check.

## 14. Convergence Report

- Stop reason: `vibe-deepseek` maxIterationsReached, `opencode-go-deepseek` converged
- Total iterations: 18 (10 and 8)
- Questions answered: 5 of 5 per lineage
- Convergence threshold: 0.05

## 15. References

- `lineages/vibe-deepseek/research.md` and its ten iterations
- `lineages/opencode-go-deepseek/research.md` and its eight iterations
- `scratch/runs/base1-pi/` and `scratch/runs/base1-opencode/`
- `.skilled/hooks/session-handover/lib/nudge.cjs`, `bin/session-handover.cjs`, `history/lib/core.ts`, `history/lib/pages.ts`, `history/lib/navigator.ts`
- `.skilled/bin/skilled-loop`, `.opencode/plugins/session-handover.js`, `.skilled/hooks/session-handover/pi/session-handover.ts`

## 16. Orchestrator Verification

The six checks listed under Method were run by the orchestrator against source and transcripts, not taken from the lineages. The live hops after the fixes are the remaining proof.

## 17. Workflow And Scope Deviations

The orchestrator ran the fan-out runner and the merge directly from the workflow's own commands. It compiled this synthesis from both lineage syntheses rather than re-reading every iteration file, because each lineage synthesis already cites its iterations.
