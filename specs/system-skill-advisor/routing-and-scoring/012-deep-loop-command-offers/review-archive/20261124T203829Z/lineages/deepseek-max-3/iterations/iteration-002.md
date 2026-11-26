# Review Iteration 002

## Dispatcher

- Mode: review; dimension `security` (iteration 2 of 7).
- Operator review focus: traceability, continuing `spec_code` for REQ-029..REQ-034 with ADR-005 and ADR-006, and `checklist_evidence` for AC-040, AC-041 and AC-042.
- How this iteration addressed the focus: it read the trust boundary the degraded transports draw around a supplied command string (REQ-028, REQ-038), then traced REQ-029 to ADR-005, REQ-034 to the closure docs it names, and AC-041's two countable claims (the Verification Summary counts and packet 013's degraded-path row) into the tree. It also re-read the drift-guard counts AC-038 states, which widened iteration 1's finding rather than adding a second one.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts` (`trackedCommandForOwner` at `:1489`, `degradedRecommendations` at `:1503`)
- `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts` (`runAdvisorSubprocess` at `:383`, `spawn` at `:283`, `pythonBin` default at `:419`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` (pasted-reply strip at `:544`, `attachTypedCommand` at `:442`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` (`_advisor_prompt_head` at `:888`, `_LEAD_WINDOW` at `:5230`, gate head at `:6627`)
- `decision-record.md` ADR-005 (`:412`), ADR-006 (`:508`)
- `implementation-summary.md` `:167`, `:181`, `:201`-`:259`; `tasks.md` Verification Summary `:338`; `013-deep-loop-offer-in-hint/implementation-summary.md:123`; `.skilled/changelog/skilled/v4.2.0.0.md:482`-`:484`; `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121`-`145`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The drift guard's pair count is a moving number the closure docs keep restating as a present fact** -- `acceptance-criteria.md:95` (AC-038), widened this iteration by `implementation-summary.md:167`, `:181` and `:255` -- AC-038 says the guard "compares 22 vocabulary pairs ..., the last of them `RUN_ASK_REFUSAL_LEADS`" and that "Twelve of the 22 lists carry a per-entry case". The array at `deep-loop-offer-cases.vitest.ts:121`-`145` holds 24 rows and ends at `RUN_ASK_REFUSAL_VERBS`; the sixth-round paragraph at `implementation-summary.md:255` says the guard "compares eleven pairs", and the two round tables at `:167` and `:181` say eleven and fifteen. Those two tables are historical and each was true of its round, so the drift that matters is AC-038's: it is a `Met` closure row, written in the present tense, whose count and last-pair name no longer describe the guard. The actionable shape is to stop restating a count in a closure cell, because REQ-031 already refuses to fix one ("The requirement names no list count, so adding a list changes the guard, not this text"), so every later list makes the cell stale again.
   Finding class: matrix/evidence
   Scope proof: `sed -n '121,146p'` of the test file prints all 24 rows with `:143` `RUN_ASK_REFUSAL_LEADS`, `:144` `RUN_ASK_REFUSAL_CANCEL_LEADS` and `:145` `RUN_ASK_REFUSAL_VERBS`; `rg -n 'vocabulary pairs'` over the packet's `acceptance-criteria.md` and `implementation-summary.md` returns exactly the four sites above, so the class is bounded to them and only AC-038 is a live claim.
   Affected surface hints: ["acceptance-criteria.md AC-038", "implementation-summary.md sixth-round paragraph", "deep-loop-offer-cases.vitest.ts VOCABULARY_PAIRS", "spec.md REQ-031"]
   Case: a closure reviewer reads AC-038 to confirm the guard's reach, checks 22 pairs against the tree, finds 24, and cannot tell whether two lists landed without a guard row or the cell simply froze an older count — the cell cannot distinguish the two, which is exactly what a `Met` row exists to settle.
   Cell: a reader counting `VOCABULARY_PAIRS` on the built tree.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | `partial` | REQ-029 read to ADR-005 (`decision-record.md:412`): `attachTypedCommand` (`advisor-recommend.ts:442`) rewrites only `recommendations[0]` and spreads `output.recommendations.slice(1)` untouched (`:460`), which is the ordering the ADR describes; the Python side keeps a typed run row in `_apply_deep_loop_offer_gate`. REQ-030 read to `_advisor_prompt_head` (`skill_advisor.py:888`), `_LEAD_WINDOW = 400` (`:5230`) and the gate head at `:6627`; native `LEAD_WINDOW = 400` (`command-attach.ts:783`). REQ-031 read to `VOCABULARY_PAIRS` (`:121`), `NUMERIC_PAIRS` and `PATTERNS_NOT_COMPARED` (`:571`), with `it.each` over the listed-with-reason rows at `:675`. REQ-032 read to `refinesSameLocation` (`reduce-state.cjs:1011`). REQ-033 has no implementation to read: it is a requirement on a review run, and AC-040 is the row that scores it. REQ-034 read to the closure docs below. REQ-035..REQ-052 not yet read this iteration; ADR-006's decision was read and its fixture row `bare-loop-name` ("deep loop: audit the payments flow", `asksForLoopRun: false`) exists. |
| `checklist_evidence` | `partial` | AC-041's two countable claims resolve: `tasks.md:338` Verification Summary reads `P0 Items 12 / 11 of 12`, `P1 Items 13 / 13 of 13`, `P2 Items 1 / 1 of 1`, which is what the cell states; `013-deep-loop-offer-in-hint/implementation-summary.md:123` carries the `Reopened: degraded paths` row with three `file:line` anchors. AC-041's changelog claims resolve: `.skilled/changelog/skilled/v4.2.0.0.md:482` ("unless the complaint also refuses a run or a fix") and `:484` ("A turned-down loop gets no run"). AC-042's cell cites `tasks.md:163` and its counts (`3,518 passed`, `cases=359`) match the tree's fixture size. AC-040 stays `Unmet` and cannot be scored from inside the run it names; AC-038's count clause does not resolve, which is the finding above. |

## Integration Evidence

- The degraded path's trust boundary is a table lookup, not a string pass-through: `degradedRecommendations` rejects a supplied `command` unless `trackedCommandForOwner` (`skill-advisor-cli.ts:1489`) finds it in `TRACKED_COMMANDS` and its owner matches the row's skill (or that skill's alias group), and every other emitted command is derived by `typedCommandForRecommendation` from the prompt plus the same table (`:1570`, `:1573`). A row that loses the gate prints as its plain skill (`:1593`), which is REQ-038's clause.
- Both served paths strip a pasted earlier reply before reading a typed command: native at `advisor-recommend.ts:544` (`scoredPrompt`) and degraded at `skill-advisor-cli.ts:1511` (`task`), and the subprocess pass strips again at `subprocess.ts:251`. The two paths agree on which commands count as typed.
- `ADR-005`'s served-head exception is realised in one place: `attachTypedCommand` (`advisor-recommend.ts:442`) runs after the attach layer and replaces only the top row, so the native head answers `/deep:review (ask)` with `typed: true` where the gate layer answers `/doctor:deep-loop`.

## Edge Cases

- **Test execution stays out of scope.** Every "both suites pass" clause is read as a claim about a recorded run, verified by resolving its anchors only. In particular the `six crossed at the same place` quantifier edit AC-059 describes was not re-run.
- **AC-040 (REQ-033) is `Unmet` by design of the packet.** `acceptance-criteria.md:145` says the traceability rerun is a follow-up run, not part of the build. This lineage is one such run; its own coverage pass is adjudicated by the cross-lineage merge, so the row is reported, not scored, here.
- **The round tables in `implementation-summary.md` (`:167`, `:181`) are historical.** A count that changed between rounds is not drift in a round record; only AC-038's present-tense claim is. The finding says so rather than counting four sites as four defects.

## Confirmed-Clean Surfaces

- **No shell in the subprocess path.** `spawn(args.command, args.commandArgs, ...)` (`subprocess.ts:283`) takes an argv array, never a shell string; the script path and `--stdin` are the only fixed elements (`:414`-`:418`), and the prompt travels over stdin rather than argv.
- **No environment path to an arbitrary binary.** `pythonBin` and `scriptPath` are `AdvisorSubprocessOptions` fields (`subprocess.ts:92`); no production caller sets them, so `pythonBin` falls back to `'python3'` (`:419`) and `scriptPath` to the package-relative script (`:388`). The one environment read, `SPECKIT_OPENCODE_HOOK_TIMEOUT_MS` (`:129`), passes through `parsePositiveInt`.
- **Prompt cost is bounded on both sides.** The Python gate reads a 10,000-unit head (`_advisor_prompt_head`, `skill_advisor.py:888`, applied at `:6627`) and every per-match prefix read is a 400-unit window (`_LEAD_WINDOW`, `:5230`); the native side carries the same 400-unit window (`command-attach.ts:783`, `windowedPattern` at `:793`).
- **No unbounded repetition in the gate grammars.** Every quantified group in `LOOP_REQUEST` and the refusal patterns is bounded: `{0,2}` in `RUN_ASK_REFUSAL_GAP` (`command-attach.ts:761`), `{0,3}` in `LOOP_OBJECT_GAP` (`:983`), `{0,2}?` in the want and set-up forms (`:997`, `:998`), so a 96,000-character prompt cannot drive catastrophic backtracking.

## Ruled Out

- *Arbitrary text reaching the rendered command from a prompt.* Every emitted `command` is a `TRACKED_COMMANDS` key, chosen by table lookup or by owner-checked derivation; a free-text field cannot become one.
- *The native path treating a pasted reply as typed where the degraded path does not.* Both strip it (`advisor-recommend.ts:544`, `skill-advisor-cli.ts:1511`, `subprocess.ts:251`).
- *Command injection through the Python child.* argv-form spawn with no shell, fixed argv shape, prompt over stdin.
- *A denial-of-service through an unbounded prefix scan or a nested quantifier.* Both directions are bounded, as recorded above.

## Next Focus

- Dimension: `traceability`
- Focus area: finish `spec_code` for REQ-001..REQ-022 and REQ-035..REQ-052, checking each REQ against the code or the decision that records it — the same read the review focus asks for, on the half not yet covered.
- Reason: iteration 3 of 7; two iterations have covered correctness and security, and the packets' 52 REQs need a full pass before the coverage gate can pass.
- Rotation status: `correctness` and `security` reviewed; `traceability` next; `maintainability` remains.
- Blocked/productive carry-forward: productive — REQ reads against decisions (ADR-005/ADR-006) resolve cleanly and cheaply.
- Required evidence: `spec.md` REQ-001..REQ-022 and REQ-035..REQ-052, with the `decision-record.md` ADRs each one cites.

Review verdict: PASS
