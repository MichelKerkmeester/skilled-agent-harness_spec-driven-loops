# Verification log: Fable 5.2 review of research/research.md

Verifier: Opus 5.5, 2026-11-17, working tree on `main`. Inputs: `scratch/fable-5-2-review.md` (the review), `scratch/research-fable-5-2-draft.md` (Fable's corrected draft), `research/research.md` (synthesis before this pass). The review and the draft were treated as claims. Every verdict below rests on a file and line opened in this pass. No live run was repeated.

Path shorthand: `S/` is `.skilled/skills/system-deep-loop/`, `C/` is `.skilled/commands/deep/assets/`, `SSK/` is `.skilled/skills/system-spec-kit/runtime/cli/tests/`.

## Totals

| Severity | Checked | UPHELD | PARTLY UPHELD | REJECTED |
|---|---|---|---|---|
| P0 | 2 | 2 | 0 | 0 |
| P1 | 9 | 8 | 1 | 0 |
| P2 | 12 | 10 | 2 | 0 |
| Defect verdicts (WRONG / OVERSTATED / upgrades) | 7 | 7 | 0 | 0 |

New item found during verification: 2 (research findings gate, stale `COMMAND_POLICIES`). Observation not acted on: 1.

## P0 findings

| Id | Fable claim | Verdict | Evidence (file:line) | Change in research.md |
|---|---|---|---|---|
| F1 | The extension design's duration rule (`maxDurationMinutes += M`, M optional) re-stops any extension started later than the old budget, because the clock charges idle time since `createdAt`. | UPHELD | `C/deep-research.yaml:888-891` computes `floor((Date.now() - Date.parse(createdAt))/60000) >= maxDurationMinutes`; `:897` note "paused and waiting time counts"; `C/deep-review.yaml:938-947` identical; default 120 at `S/deep-research/assets/deep-research-config.json:11`, `S/deep-review/assets/deep-review-config.json:17`. The workflow's own `gate_pre_synthesis.on_B` already warns the duration check "stops the loop again" (`C/deep-research.yaml:1771`). | §1 gen-2 item 4 and new review summary; §19 item 4 rewritten with `max(prior, elapsedAtExtension) + M`, default M, `elapsedMinutesAtExtension` in the event; §19 item 6 event fields; new Eliminated Alternatives row; §15 risk; Slice A duration-ceiling test. |
| F2 | D7's drop is still at the upcast `legacy-compatibility.ts:643-660`; gen 2's "moved, not located" is wrong; Slice F is a ledger schema change. | UPHELD | `S/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:643-660` builds data from five inputs only; `deep-research-ledger-schema.ts:657-660` allows only `focus`, `answeredQuestions`; `deep-research-ledger-types.ts:185-200`; `S/runtime/lib/legacy-projections/deep-research-contract.ts:312-325` writes ten keys. The gateway routes research rows through this upcast (`S/runtime/scripts/append-mode-event.cjs:406`). Gen 2's own evidence was a grep for field names (`research/iterations/iteration-001.md:28`), which a drop-by-omission cannot match. Extra: `S/runtime/scripts/verify-iteration.cjs:502` comments that "the ledger upcast keeps no leaf dispatch fields", so the route-proof drop is a documented trade-off. | §1; §4 item 7 collapsed into one chain plus one "Corrected after independent review" note; §13 D7 row; §12 item 3 closed; §12 item 6 new decision; Slice F rewritten (files, MEDIUM, decision first). |

## P1 findings

| Id | Fable claim | Verdict | Evidence (file:line) | Change in research.md |
|---|---|---|---|---|
| F3 | D3 consequence wrong: a review run cannot stop at iteration 1. | UPHELD | Clean stop needs `coverageAge >= 1` (`S/runtime/scripts/convergence.cjs:1106-1111`); composite `dimensionCoverage.stop` needs it too (`:785-793`); at iteration 1 rolling average and MAD are unavailable (`:773-784`), so score is 0. `reviewCoverageAge` returns records after the completing one (`:1430-1443`), and evidence records are one per iteration number (`orderedIterationRecords`, `:1270-1284`; filter at `:1598`). Floor reads `antiConvergence.minIterations` (`:1347-1349`). | §4 item 5; §13 D3 row; §15; Slice C risk LOW, test changed to a configured-floor-above-2 case, dependency "none". |
| F4 | D10 overstated: custom dimensions are outside the workflow contract (`deep-review.yaml:654`), not enforced in code. | UPHELD (with nuance) | `C/deep-review.yaml:654` "Every element MUST be one of the four canonical dimension names." Only code readers of `reviewDimensions` are `S/runtime/scripts/convergence.cjs:1541` and `S/deep-review/scripts/divergent-review-pivot.ts:213`; neither validates. Reducer writes only the four keys (`S/runtime/scripts/reduce-state.cjs:1223-1250`). Nuance: line 654 is a prose rule the orchestrating model executes, so a non-compliant orchestrator can produce the input too, not only a hand edit. | §1 gen-2 item 3; §6 table row; §13 D10 row; §18 items 1 and 4; §12 item 7 new decision; Slice H decision first. |
| F5 | D14 mechanism misattributed: verify gate already splits reasons; the fix is a reason filter on `redispatch_once`. | UPHELD | `S/runtime/scripts/verify-iteration.cjs:479-483` (`iteration_file_missing`), `:520` (`state_record_missing`), `:530` (`delta_file_missing`), `:570-573` (`executor_missing`, after the earlier checks pass). `C/deep-research.yaml:1539` and `C/deep-review.yaml:1634` redispatch "On the FIRST failure" of any reason. | §13 D14 row; new Eliminated Alternatives row; Slice M is YAML-only. |
| F6 | Slice A file list incomplete. | UPHELD | `S/runtime/lib/deep-research-reducers/deep-research-reducer.ts:106`, switches ending `assertNeverStem` at `:1391`, `:1551`, `:1944`; `deep-review-reducer.ts:104`, `:493`, `:709`, `:736`, `:1417`, `:1615`; `legacy-projections/deep-research-contract.ts:272-289`; `deep-review-state-contract.ts:138-158`; lifecycle filters `S/deep-research/scripts/reduce-state.cjs:2245`, `:2294`, `S/runtime/scripts/reduce-state.cjs:497`, `:549`; `LIVE_LINEAGE_MODES` at `S/runtime/scripts/reduce-state.cjs:27`, `:112-114`; producer table `deep-research-ledger-types.ts:758-761`. Research config has `lineage.allowedModes`/`deferredModes` (`deep-research-config.json:27-42`); review config is flat (`deep-review-config.json:3-7`). | §19 items 5 and 6; Slice A files; §15 schema-drift risk. |
| F7 | Slice A breaks four `system-spec-kit` contract tests and more docs than listed. | PARTLY UPHELD | Tests: only two assertions break, `SSK/deep-review-contract-parity.vitest.ts:126` ("fork and completed-continue are deferred") and `SSK/deep-review-reducer-schema.vitest.ts:120-121`. The `deep-research-contract-parity.vitest.ts:54-79` and `deep-review-contract-parity.vitest.ts:58-93` assertions only require the name `completed-continue` to appear, which survives Slice A. A repo-wide search of test files found no other "deferred" assertion. Docs: all 11 cited lines confirmed (`S/deep-review/references/protocol/loop-protocol.md:594`, `S/deep-review/assets/review-mode-contract.yaml:179`, `S/deep-review/references/state/state-format.md:139`, `S/deep-review/references/protocol/quick-reference.md:107`, `S/deep-research/SKILL.md:126`, `S/deep-research/references/guides/quick-reference.md:105`, `S/deep-research/assets/deep-research-strategy.md:179`, `.skilled/agents/deep-research.md:100`, `.skilled/agents/deep-review.md:385`, `.skilled/commands/deep/research.md:109`, `review.md:102`). | Slice A tests name exactly the two breaking assertions and say the name assertions survive; Slice A docs list. Fable's draft listed three test files as breaking; reverted to two. |
| F8 | "Synthesis needs no change" skips the protocol's snapshot-before-reopen rule. | UPHELD | `S/deep-research/references/protocol/loop-protocol.md:562` "snapshot this file as `research/synthesis-v{generation}.md` before any `completed-continue` flow". Extension keeps the generation (§19 item 6), so names collide. | §19 item 9 retitled "needs one change"; §12 item 8; Slice A YAML adds the snapshot step. |
| F9 | Slice F contradicts the eliminated "widen the upcast" alternative. | UPHELD | Same seam as F2 (`legacy-compatibility.ts:643-660`, `deep-research-ledger-schema.ts:657-660`). Verification adds the resolution: the elimination stays valid for frontier fields because they have a non-ledger channel (delta and inbox), while for D7 a non-widening option exists (`verify-iteration.cjs:502` already treats the delta as the source of leaf fields). | Eliminated Alternatives row reworded; §12 item 6 states both options; Slice F "decision first". |
| F10 | Frontier nodes that end unanswered never close their counted question. | UPHELD (refined) | Inbox row becomes an unchecked question (`S/deep-research/scripts/reduce-state.cjs:1137-1180`, `checked: false` at `:1165`). Resolution at `:2486-2499`. Fable listed three resolution paths; there is a fourth, `question.checked` (`:2499`), fed by `- [x]` strategy lines (`:1968`) and a prior registry `checked`/`resolved` (`:1219`). Nothing maps a frontier status to it, so the gap is real, but the fix can reuse that path. `questionEntropy` 0.85 at `S/runtime/scripts/convergence.cjs:815-820`. | §8 new "Close rules" items 1 and 2; §5 item 6 lists all four paths; §10 reducer row and new close test; §15 risk; Slice J. |
| F11 | Admitted QUESTION nodes can block the graph stop for good. | UPHELD | `S/runtime/lib/coverage-graph/coverage-graph-signals.ts:583-589` (two answering findings, divided by all QUESTION nodes), `:660-690` (source diversity averaged over all QUESTION nodes); blockers `S/runtime/scripts/convergence.cjs:448-456`; graph block to BLOCKED `:1012-1019`. | §8 close rule 3; §10 YAML row; Slice J. |

## P2 findings

| Id | Fable claim | Verdict | Evidence (file:line) | Change in research.md |
|---|---|---|---|---|
| F12 | D7/D9 share a root; restoring `keyQuestions` turns `focusAlignment` on for every research run. | UPHELD | `S/runtime/scripts/convergence.cjs:871-875` counts only records with both lists. | §4 item 7; §13 D9 row; §15; Slice F risk. |
| F13 | D13 is CONFIRMED for research, no behavioral effect today; review unaffected. | UPHELD | `extractSection` at `S/deep-research/scripts/reduce-state.cjs:1891-1895` (exact `## ` heading, case-insensitive); reducer reads "Recommended Next Focus" at `:1930`; pack asks for "Next Focus" at `S/deep-research/assets/prompt-pack-iteration.md.tmpl:61`; agent uses "Recommended Next Focus" at `.skilled/agents/deep-research.md:228`, `:316`; review accepts three spellings at `S/runtime/scripts/reduce-state.cjs:355`. | §13 D13 row; §12 item 3 closed. |
| F14 | D4 and D8 verified; §12 item 2 can close. | UPHELD | D4: `S/deep-research/scripts/reduce-state.cjs:128-133`, `:204-207`. D8: `S/runtime/scripts/loop-lock.cjs:182-187` marks transient; `S/runtime/lib/deep-loop/loop-lock.ts:641` never probes a transient pid; stale rule `:637-644` is heartbeat older than 2x TTL (Fable had not read it); TTL rule `C/deep-research.yaml:411`. | §2; §12 item 2 closed; §13 D4, D8 rows; §17; §20 order note. |
| F15 | §5.5 review focus list is evaluation order, not precedence. | UPHELD | `S/runtime/scripts/reduce-state.cjs:2184-2215`: leaf `nextFocus` or first uncovered dimension, then pivot overrides, then a most-recent blocked stop overrides. | §5 item 5; §18 item 3; §10 review row. |
| F16 | Landing on `resume` also appends a `resumed` event; pick one mechanism for review. | UPHELD | `C/deep-research.yaml:446` `on_resume.append_jsonl` writes a `resumed` row; `legacy-compatibility.ts:33` upcasts it to `deep_research.run_resumed`. | §19 item 6 (event choice, one mechanism). |
| F17 | The pre-classify mutation must sit inside the lock. | UPHELD | `step_acquire_lock` at `C/deep-research.yaml:408`, `step_classify_session` at `:427`; `step_apply_lifecycle_request` at `:270` runs before the lock. | §19 item 6. |
| F18 | `status: "active"` is not a workflow value. | UPHELD | Only `initialized` (`C/deep-research.yaml:565`) and `complete` (`:1926`) are written; classification tests `status == 'complete'` (`:436`); no `"active"` config status in either YAML. | §19 item 6 now uses `initialized`; §12 item 9. |
| F19 | `maxIterations += N` over-extends a run that stopped early. | UPHELD | Arithmetic against the cap at `S/runtime/scripts/convergence.cjs:1115`, which counts every iteration row. | §19 item 6 uses `continuedFromRun + N`; new Eliminated Alternatives row. |
| F20 | Slice ordering inconsistencies (C "before J", §11 omits M, §18.5 needs I). | UPHELD | Research merge carries open/resolved questions at `S/runtime/scripts/fanout-merge.cjs:789-843`. Fable's draft moved C to "before K"; verification sets it to "none", because review never evaluates the floor in a way K's veto depends on and C changes no default run. | §11 includes M; §18 item 5; Slice C dependency "none" (overrules the draft's "before K"); order paragraph. |
| F21 | Node cap 40 is out of step with default `maxIterations` 10/7. | UPHELD | `S/deep-research/assets/deep-research-config.json:3`, `S/deep-review/assets/deep-review-config.json:9`. | §8 depth-budget paragraph; §10 config row. |
| F22 | Local stuck handling becomes one strike per node, because `stuckCount` resets only on a ratio above threshold. | PARTLY UPHELD | The mechanism claim is wrong for today's workflow: `deriveLoopCounters` also resets on a `stuckRecovery` event row and on an `insight` iteration (`S/runtime/scripts/convergence.cjs:1313-1316`, `:1328-1331`). Research's `if_stuck_recovery` appends that event (`C/deep-research.yaml:1216`), and it round-trips (`legacy-compatibility.ts:56`, `legacy-projections/deep-research-contract.ts:121`). Review's `deep_review.recovery_started` (`C/deep-review.yaml:1343`) is projected as a `stuckRecovery` event (`legacy-projections/deep-review-state-contract.ts:239-249`). The risk is real only if the expansive sub-branch replaces that append, which §8 did not rule out. | §8 local stuck paragraph adds the rule "keep the `stuckRecovery` append", with evidence for both loops; §10 YAML row; Slice J. Fable's draft gap 4 ("one strike per node") not carried over as stated. |
| F23 | Smaller citation and wording issues. | PARTLY UPHELD | Upheld: `notEvaluated` exists only on the quality guard (`S/runtime/scripts/convergence.cjs:858-866`), graph `sourceDiversity` is a number vs 1.5 (`:437`, `:448`); skill-advisor paths are under `runtime/` (`.skilled/skills/system-skill-advisor/runtime/data/prompt-policy.default.json`, `runtime/handlers/advisor-recommend.ts`, `runtime/tests/legacy/advisor-fixtures/skippedShortCasual.json` exist; `data/prompt-policy.default.json` at skill root does not); `DEPTH_WORDING` `:275`, `attachCommand` `:517`; D3 key is `antiConvergence.minIterations`; no code enforcer of `fileProtection` outside tests. Missed by Fable: `COMMAND_POLICIES` no longer exists. `command-attach.ts` exports `COMMAND_ROWS` (`:64`) and `TRACKED_COMMANDS` (`:123`), and `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:624` asserts `COMMAND_POLICIES` is absent. | §9 command-surfacing bullet and citations; §9 gen-2 path; §12 item 1 paths; §15 sourceDiversity risk; §19 item 2 marked INFERENCE; §8 veto note (composite candidate) and §10 test 2. |

## Defect verdicts (Fable's Check 1)

| Id | Fable claim | Verdict | Evidence (file:line) | Change in research.md |
|---|---|---|---|---|
| D3 | OVERSTATED | UPHELD | See F3. | §13 D3 row. |
| D7 | WRONG (location) | UPHELD | See F2. | §13 D7 row, §4 item 7. |
| D10 | OVERSTATED | UPHELD | See F4. | §13 D10 row. |
| D14 | OVERSTATED | UPHELD | See F5. | §13 D14 row. |
| D13 | CONFIRMED (was INFERENCE) | UPHELD | See F13. | §13 D13 row. |
| D4 | CONFIRMED (verified by review) | UPHELD | See F14. | §13 D4 row. |
| D8 | CONFIRMED (verified by review) | UPHELD | See F14. | §13 D8 row. |

D1, D2, D5, D6, D9, D11 and D12 were marked CONFIRMED by Fable and left unchanged. Of these, D2 (`S/runtime/scripts/dispatch-iteration.cjs:211-221`), D9 (`convergence.cjs:871-875`), D11 (`C/deep-research.yaml:515-519`, `C/deep-review.yaml:584-587`) and D12 (`fanout-merge.cjs:789-843`) were re-read in this pass.

## Found during verification

| Id | Item | Evidence (file:line) | Change in research.md |
|---|---|---|---|
| V1 | The research `findings_not_enumerated` gate never runs. It reads `findingsCount` from the projected state row, which the ten-key projection drops, so `Math.floor(Number(undefined))` is `NaN` and the `Number.isFinite` check skips the gate. CONFIRMED by trace, not live. | `S/runtime/scripts/verify-iteration.cjs:533-535` (research branch reads `iterationRecord.findingsCount`), `:536` gate condition; `iterationRecord` from the state log (`:517`); projection keys at `legacy-projections/deep-research-contract.ts:312-325`; gen-2 probe lists `findingsCount` among dropped fields (`research/iterations/iteration-001.md:28`). | §1 review summary item 2; §13 D7 row; §12 item 6; §15; Slice F test and risk. |
| V2 | Stale `COMMAND_POLICIES` symbol in §9 (see F23). | as F23 | §9. |
| V3 | Observation, not acted on: the stem-producer table marks `deep_research.run_resumed` "reserved: No writer emits it today", while `on_resume` appends a `resumed` row that the upcast maps to that stem. The table and the workflow disagree. Outside this packet's scope; worth checking when Slice A edits the table. | `S/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts:760`; `C/deep-research.yaml:446`; `legacy-compatibility.ts:33` | None. |

## Draft corrections reverted or changed

- Slice A tests: draft said four (listing three files) break; reverted to the two assertions that actually assert "deferred".
- Slice C dependency: draft said "before K"; set to "none".
- Draft §8 gap 4 (one strike per node): replaced by a design rule, because the reset mechanism exists today (F22).
- Draft §19 item 6 left status open ("use `initialized` or introduce it"); final text chooses `initialized` and records `active` as a deliberate alternative in §12 item 9.
- Draft kept generation 2's wrong "location moved" bullet stacked above the correction in §4 item 7; collapsed into one chain with one short note.
- Draft §15 said suppressing `sourceDiversity` "needs its own change in `evaluateResearch`"; final text recommends landing Slice G first instead.

## Checks run on the final research.md

- Count of em dash characters (U+2014) in research.md: 0. The four em dashes in section headings (§8, §9, §10, §19) were replaced with parenthesized labels; numbering unchanged.
- `grep -c 'CORRECTED (Fable'`: 0.
- Every `[SOURCE: path:line]` tag (131 unique) resolved against the repo root or the packet folder; file exists and line is within the file: 131 of 131.
- Section headings §1-§20, `## Eliminated Alternatives` and `## Divergence Map` all present.

## Not verified

- No live run was repeated: D1's 0.00 to 2.0 result, D6's 12 of 12, the 14-to-10 field probe, D11, D14 and the inbox injection remain the packet's own observations. V1 is a trace, not a live result.
- The generation-1 and generation-2 iteration narratives were not compared line by line against the synthesis.
- The 002-graph-engineering syntheses and reference docs cited in §7 were checked for existence and line range only, not content.
- Whether status `initialized` on an extended config is classified as `resume` in every confirm-mode branch was not traced beyond `C/deep-research.yaml:427-446`.
