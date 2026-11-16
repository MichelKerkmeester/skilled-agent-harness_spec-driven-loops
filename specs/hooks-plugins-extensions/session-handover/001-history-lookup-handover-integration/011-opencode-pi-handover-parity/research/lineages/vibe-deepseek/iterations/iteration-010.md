# Iteration 10: Consolidated failure modes, one fix each, and the residual proof gap

## Focus

Nine iterations produced a long list of individual defects. This iteration collapses them into the distinct ways a hop can fail, one fix per mode, and then states honestly which of the packet's five completion criteria the current harness can actually prove. The consolidation matters because several defects share one root cause, and because two of the five criteria are unprovable as written rather than merely unproven.

## Actions Taken

1. Re-read the strategy's five key questions and its exhausted-approach list to confirm no mode was retried.
2. Re-read the prepare seed, the claim seed and the claim output anchors to confirm the sender and receiver text findings still hold.
3. Grouped the thirty-plus individual findings from iterations 1-9 by the stage of the hop they break.
4. Mapped each of the five completion criteria to the harness capability that would prove it.

## Findings

1. **Mode A — the sender is never told the lookup exists.** The prepare seed's opening line and the prepare stdout both describe writing a note and nothing else; neither names the History Lookup. A sender that believes the note is the only channel writes a closing sentence ("a fresh session cannot recover it") instead of a pointer. Fix: add one sentence to the prepare seed and to the prepare stdout naming the lookup and the fact that the receiver can read the sender's turns. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:180] [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:630]

2. **Mode B — the note outranks the lookup in the claim text.** The claim seed omits the lookup, and the claim output prints the offer after the note body with a weaker directive, so a receiver that reads top-down treats the note as authoritative. The Pi receiver did exactly that: it dismissed the lookup on the note's authority and asked the operator. Fix: print the lookup offer before the note body and phrase it as a step, not an option. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:276] [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:729]

3. **Mode C — a withheld offer is indistinguishable from no need to look.** `mintHandoverLocator` returns null on six conditions and the claim command wraps the call in a bare `catch {}`, so a withheld offer prints nothing, logs nothing and leaves no marker. Fix: return a typed refusal, print one line naming why the offer was withheld, and log it. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:929] [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:729]

4. **Mode D — the OpenCode reader can return another project's session.** When the store has no `directory` column the reader skips the project proof, so the lookup's answer may come from a different checkout. Fix: require the column, or fall back to a cwd proof taken from the session's own record rather than from the store schema. [SOURCE: .skilled/hooks/shared/session-readers/opencode.mjs:256]

5. **Mode E — a secret survives redaction in three shapes.** `SECRET_ARGUMENT_KEY` misses `x-api-key` and `X-Api-Key`, the array branch of `redactArgument` drops the key, and image blocks are returned unchanged. Fix: accept a vendor prefix and a plural suffix in the key pattern, pass the parent key into the array branch, and document the image exclusion as a known limit rather than a guarantee. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:56] [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:71] [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:86]

6. **Mode F — a detail past character 160 is invisible until the receiver loads the turn.** The preview is the first 160 characters of redacted text, so a detail at character 295 of a 425-character turn appears in neither the preview nor any marker. The OpenCode receiver succeeded only because it chose to `load` the turn. Fix: raise the preview bound, or append an explicit "more at part N" handle so the receiver knows the preview is truncated. [SOURCE: .skilled/hooks/session-handover/history/lib/pages.ts:300]

7. **Mode G — model and effort do not carry on OpenCode.** `resolveSessionSettings` has no Pi or OpenCode branch, the OpenCode plugin never reads model or effort, `effort_is_valid` and `append_effort_arguments` have no OpenCode case, and `build_relaunch_arguments` drops the model on OpenCode 2. Pi is unaffected because its extension supplies the values itself. Fix: write the model and effort into the OpenCode config or a per-session setting, since the wrapper's own comment records that OpenCode 2 has no model flag on its root command. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1121] [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:775] [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:502]

8. **Mode H — the nudge is suppressed by a bare environment variable, and two hooks can both nudge.** `AI_SESSION_CHILD=1` short-circuits `nudgeDecision` through `relaunchSessionIsChild`, a bare env read, so a test sandbox that inherits the variable gets no nudge at all. Separately, only claude, codex and vibe route through `commitNudge`; Pi and OpenCode keep in-process state, so two hooks can both nudge. Fix: replace the bare env read with a marker written into the relaunch environment, and route Pi and OpenCode through the same claim guard. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:707] [SOURCE: .skilled/hooks/session-handover/claude/handover-context-nudge.mjs:157] [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:604] [SOURCE: .opencode/plugins/session-handover.js:181]

9. **Mode I — a claimed note never expires, so the sender's task is left open.** `completeHandoff` requires status `claimed`, `noteState` has no expired or abandoned state, no sweep expires a claimed note, and `questionHoldReason` covers only question tools, so a receiver that asks in prose holds the note open indefinitely. Fix: add an expiry sweep for a claimed note past its window, and widen the hold guard to a prose ask. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:407] [SOURCE: .skilled/hooks/session-handover/lib/killer.cjs:317] [SOURCE: .skilled/hooks/session-handover/pi/session-handover.ts:188]

10. **Mode J — the scorecard can report a pass that did not happen.** The recall check slices at the last `[session-handover]` marker or the whole pane; the Pi pane has no marker, so `sideWordStated: true` is the sender's own prompt echo at character 12,812 of 30,172. The harness also plants no token and `score.cjs` has no redaction field. Fix: require the marker, or slice from the receiver's first turn, and add a token plant plus a redaction assertion. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:74] [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh:61]

## Residual Unproven Criteria

The packet's five completion criteria are not equally provable. Three cannot be proven by the current harness, and two are outside this lineage's write authority.

| Criterion | Status | Why |
|---|---|---|
| Three consecutive Pi runs 5/5 with `sideWordStated: true` | Unprovable as written | The Pi pane has no `[session-handover]` marker, so `sideWordStated: true` is the sender's prompt echo. The metric passes on a false positive, so three green runs would prove nothing until the slice is fixed. |
| Three consecutive OpenCode runs 5/5 | Unproven | The evidence holds one OpenCode run, not three. |
| A planted token returns `[REDACTED:` and never the token | Unprovable | The harness has no plant and the scorecard has no redaction field. A generic `FAKE_TOKEN_` plant would also miss the shape-driven scrubber. |
| `env -u AI_SESSION_CHILD` suites exit 0 with no fewer passing tests | Out of scope | Running the suites is a verification step, not a research step, and this lineage may not write outside its directory. |
| `validate.sh --strict --quiet` prints `RESULT: PASSED` | Out of scope | The dispatch prompt forbids running `validate.sh`. |

## Ruled Out

- "The five criteria are five independent checks." They are not: the first two depend on the scorecard's recall slice, which is the same code path, so fixing the slice changes both.
- "Fixing the prepare text alone would close the Pi gap." The Pi receiver had a working offer and did not run it, so the claim text and the note's authority are the binding constraint, not the prepare text.

## Dead Ends

- Looking for a single root cause behind all ten modes. There are three: the note is treated as the only channel (A, B, C), the readers and the scorecard disagree about what a session is (D, F, J), and the relaunch path has no per-runtime settings contract (G, H, I).

## Edge Cases

- Ambiguous input: "fail to finish the sender's task" could mean the hop never starts or the note never closes. Both are covered; mode I is the second.
- Contradictory evidence: none. The code, the panes and the scorecards agree once the scorecard's slice is corrected.
- Missing dependencies: no live hop was run in this lineage, so every mode is established from code plus the packet's recorded evidence.
- Partial success: the consolidation is complete for the five key questions, but three of the five completion criteria remain unprovable, which is stated above rather than smoothed over.

## Sources Consulted

- `.skilled/hooks/session-handover/lib/nudge.cjs:180`
- `.skilled/hooks/session-handover/lib/nudge.cjs:276`
- `.skilled/hooks/session-handover/lib/nudge.cjs:707`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:630`
- `.skilled/hooks/session-handover/bin/session-handover.cjs:729`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:407`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:775`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:929`
- `.skilled/hooks/session-handover/lib/relaunch-core.cjs:1121`
- `.skilled/hooks/session-handover/lib/killer.cjs:317`
- `.skilled/hooks/session-handover/history/lib/core.ts:56`
- `.skilled/hooks/session-handover/history/lib/core.ts:71`
- `.skilled/hooks/session-handover/history/lib/core.ts:86`
- `.skilled/hooks/session-handover/history/lib/pages.ts:300`
- `.skilled/hooks/session-handover/hooks/shared/session-readers/opencode.mjs:256`
- `.skilled/hooks/session-handover/hooks/context-nudge.mjs:157`
- `.pi/extensions/session-handover.ts:188`
- `.pi/extensions/session-handover.ts:461`
- `.pi/extensions/session-handover.ts:652`
- `.opencode/plugins/session-handover.js:181`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:74`
- `specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/live-hop.sh:61`

## Assessment

- New information ratio: 0.35
- Questions addressed: all five key questions, consolidated
- Questions answered: all five, with a named fix per failure mode

## Reflection

- What worked and why: grouping by stage of the hop rather than by file collapsed thirty findings into ten modes and exposed the three shared root causes. The grouping also showed that the scorecard defect is upstream of two criteria, which no single-iteration view made visible.
- What did not work and why: treating the five criteria as independent checks. Two of them read the same scorecard field, so a fix to the slice changes both verdicts at once.
- What I would do differently: map the completion criteria to harness capabilities in iteration 1, because that mapping would have redirected effort from re-reading code toward the scorecard and the missing token plant.

## Recommended Next Focus

The loop has reached its iteration cap. The next step is synthesis, not another iteration. If the loop is resumed, the highest-value focus is the scorecard's recall slice, because it gates two of the five criteria and currently reports a false positive on Pi.

## Fixes Named

- Prepare seed and prepare stdout: name the History Lookup and the receiver's ability to read the sender's turns. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:180]
- Claim output: print the lookup offer before the note body as a step. [SOURCE: .skilled/hooks/session-handover/bin/session-handover.cjs:729]
- `mintHandoverLocator`: return a typed refusal and print the reason. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:929]
- OpenCode reader: require the directory column or prove the project from the session record. [SOURCE: .skilled/hooks/shared/session-readers/opencode.mjs:256]
- Redaction: widen `SECRET_ARGUMENT_KEY`, pass the parent key into arrays, document the image exclusion. [SOURCE: .skilled/hooks/session-handover/history/lib/core.ts:56]
- Preview: raise the bound or append a truncation handle. [SOURCE: .skilled/hooks/session-handover/history/lib/pages.ts:300]
- OpenCode relaunch: write model and effort into config or a per-session setting. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:1121]
- Nudge suppression: replace the bare env read with a relaunch marker, and route Pi and OpenCode through `commitNudge`. [SOURCE: .skilled/hooks/session-handover/lib/nudge.cjs:707]
- Note lifecycle: add an expiry sweep and widen the hold guard to a prose ask. [SOURCE: .skilled/hooks/session-handover/lib/relaunch-core.cjs:407]
- Scorecard: require the `[session-handover]` marker, add a token plant and a redaction assertion. [SOURCE: specs/hooks-plugins-extensions/session-handover/001-history-lookup-handover-integration/011-opencode-pi-handover-parity/scratch/harness/score.cjs:74]
