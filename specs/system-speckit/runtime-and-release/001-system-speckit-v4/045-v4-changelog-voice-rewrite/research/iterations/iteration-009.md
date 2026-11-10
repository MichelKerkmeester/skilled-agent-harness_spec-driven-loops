# Iteration 009 — What each iteration-owned write surface can actually move: the answer channel audited

## Focus
Served: "Iteration 3: sentence-level prose conformance sample against README HEAD (Q4 tail), and the per-paragraph ownership map for merged or dropped content (Q1 tail)." — sixth dispatch of the same text (iterations 4–9). That direction is already delivered (F-016, F-017) and marked ruled out (F-034, iteration 8), so it was not re-run.

Actual work (non-duplicative): finish the channel audit iteration 8 opened. Iteration 8 proved the narrative heading vocabulary was wrong (F-033) and fixed it. This iteration asks the next question in that chain: now that the narrative is parseable, which of the *other* write surfaces an iteration owns — the canonical record, the delta stream, the strategy file — can still move reducer-visible state at all? Answer: the canonical record's answer channel is dropped before it reaches the ledger, the delta stream has exactly one consumer that is not questions, and the strategy file is written by the reducer from the registry. The run's five questions therefore cannot be machine-resolved by any iteration-owned write. Two of them are already answered in substance (iterations 2–4, below); the machine simply has no path to hear it.

## Actions Taken
1. Re-read `findings-registry.json` (read-only) and confirmed iteration 8's rulings did land: `ruledOutDirections` 6 (the strategy's §10 lists all six), while `metrics.resolvedQuestions` is still 0 and `openQuestions` still 5.
2. Traced the resolution path end to end in `reduce-state.cjs`: `buildRegistry` line 2320–2330 accepts exactly three signals — an `answeredQuestions` array containing the question text, a single-element `keyQuestions` array equal to the question text, or `focus` exactly equal to the question text. All three live on the *state-log iteration record*.
3. Read the writer of those records: `upcastLegacyDeepResearchRecord` in `runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` (case `deep_research.iteration_completed`, lines 376–397) and the projection back out in `runtime/lib/legacy-projections/deep-research-contract.ts` (lines 211–222).
4. Decoded this run's own ledger frame 11 (`research/deep-research-ledger/frames/0000000000000011.frame`, iteration 8's `iteration-completed` event, base64 payload) and read all eight iteration rows in `deep-research-state.jsonl` (read-only) to compare what was accepted against what survived.
5. Ran the pin sentinel (changelog sha256, changelog commit, README tip, working-tree cleanliness) and mapped the delta stream's consumers (`loadDeltaSources` → resource map only).

## Findings

### F-036 — The iteration record's answer channel is dropped in the canonical payload (P1, mechanism)
`buildRegistry` resolves a question only when an iteration record carries `answeredQuestions` (containing the exact question text), a single-element `keyQuestions` equal to that text, or a `focus` equal to it (`reduce-state.cjs:2320–2330`).

That record never exists in the form the agent writes it. `upcastLegacyDeepResearchRecord` maps `type:'iteration'` to `deep_research.iteration_completed` with `data = {status, rawNewInfoRatio, trustedEvidenceYield: 0, outputDigest, ruledOutApproachRefs, nextFocusCausationId}` (`legacy-compatibility.ts:376–397`). Everything else the record carried — `focus`, `answeredQuestions`, `keyQuestions`, `graphEvents`, `noveltyJustification` — is folded into `outputDigest`, a hash. The projection back to the legacy log rebuilds a six-key row: `{type:'iteration', iteration, run, status, newInfoRatio, ruledOut, timestamp}` (`deep-research-contract.ts:211–222`).

Both halves are observed, not inferred. Frame 11 of this run's ledger carries exactly that six-field payload (`"data":{"nextFocusCausationId":"legacy-jsonl:3e29…:next-focus","outputDigest":"3e29…","rawNewInfoRatio":0.3,"ruledOutApproachRefs":[],"status":"insight","trustedEvidenceYield":0}`, scope `{iteration:8, lineageId:"rsr-2026-09-21T08-45-54-679Z", runId:"rsr-2026-09-21T08-45-54-679Z"}`), and all eight iteration rows in `deep-research-state.jsonl` carry exactly the six projected keys — `ruledOut` is `[]` on every one of them, and no row has `focus`.

Live confirmation from this iteration's own append: the new ledger frame 12 decodes to the same six `data` fields, and the projected row appended to `deep-research-state.jsonl` is `{"iteration":9,"status":"insight","newInfoRatio":0.35,"ruledOut":[]}` — with no `focus` and no `graphEvents`, the two fields the pack's output contract asks for by name and the only ones that could have carried an answer.

Consequence: `metrics.resolvedQuestions` is immovable by any iteration-owned write. The five key questions stay open in the registry and the dashboard will report `Answered: 0/5` when the run stops, however completely the research answered them. This is not a defect in the research; it is the same class as F-033, one layer deeper.

### F-037 — The narrative parse contract has no answer section, and `## Recommended Next Focus` is not consulted (P2)
`parseIterationFile` extracts eight sections — `Focus`, `Findings`, `Ruled Out`, `Dead Ends`, `Questions Remaining`, `Sources Consulted`, `Reflection`, `Recommended Next Focus` (`reduce-state.cjs:1783–1808`). There is no `Questions Answered` section in that list, so iteration 8's `## Questions Answered` block (which correctly states that Q1, Q4 and Q5 were delivered in iterations 2–3, and Q2/Q3 in 2–4) is invisible to the machine; the registry still shows all five open.

The second half is the mirror image: `resolveNextFocus` (lines 2251–2300) never reads the parsed `nextFocus` field. It consults `blockedStopHistory`, `divergence.currentFocus`, then `deriveNextFocusFromContinuity` over `iterationFiles`, `iterationRecords` and `carriedForwardOpenQuestions` (`runtime/lib/deep-loop/continuity-thread.cjs:114–145`). Iteration 8's `## Recommended Next Focus: None.` therefore could not close the run — the served focus falls through to the machine's five open questions, and `deriveNextFocusFromContinuity` returns the latest carried-forward thread question, which is the iteration-3 sentence from iteration 2's narrative. The only lever an iteration narrative still has over the *served* focus is `## Questions Remaining` (via `buildCarriedForwardOpenQuestions` plus `getLatestByRun`), and the run is terminal only when `machineOpenQuestions` is empty — which F-036 shows is unreachable from here.

### F-038 — The delta stream's only reducer consumer is the resource map; `graphEvents` has no consumer at all (P2, consumer map)
`loadDeltaPayloads` / `loadDeltaSources` / `loadFanoutDeltaSources` (`reduce-state.cjs:1541`, `1569`, `1612`) are referenced only by the resource-map builder, which emits `research/resource-map.md` with delta provenance (`appendDeltaSourceProvenance` / `emitResourceMap`, lines 1632–1700). Question resolution and registry building read the state log alone (`readStateLogForReduction(stateLogPath)`, lines 2938–2943).

This closes the loop iteration 8 opened with F-033: the `ruled_out` records written into delta files in iterations 4–7 were correctly diagnosed as having no consumer on the registry path — the finding now names the one consumer they do have. Related: a grep over `reduce-state.cjs` returns no `graphEvents` line at all; the convergence graph is built from event records (`buildGraphConvergenceRollup`, line 2401, feeding `computeGraphConvergenceScore` at 1943). So the pack's optional `graphEvents` array is inert for this reducer, which is why the run's coverage graph and divergence frontier have stayed empty across nine iterations.

### F-039 — Pin sentinel holds at iteration 9 (P1)
| Check | Value | Matches |
|---|---|---|
| Changelog sha256 | `33abcc9a865e688189ce2a5cab458f838fc5a185e3d521aded0bed47b45fcb19` | F-028 pin exactly |
| Changelog commit | `7076dba64b` (2026-09-21) | unchanged since F-028 |
| README tip | `3ad5ca25fb` (2026-09-21) | F-026 voice-standard pin |
| Working tree, both files | 0 porcelain lines | clean |

The frozen F-024 patch list and F-025 outline remain valid against the pinned blob; nothing since iteration 8 has touched either file.

## Ruled Out
- Re-running the sentence-level prose conformance sample (F-016) against README HEAD — delivered in iteration 3, marked ruled out in iteration 8 (F-034), and the README pin is unchanged this iteration (F-039) so the sample is reproducible-identical.
- Re-running the per-paragraph ownership map (F-017) — same delivery status, same pin.
- Re-deriving the family-block order tie-break (F-018) — settled in iteration 3 against README §7 SKILL LIBRARY's sub-order; no commit has touched that section (F-039).
- Writing the five answers into the narrative, the canonical record, or the delta stream in the hope that one of them resolves them — F-036 and F-038 give the exact field lists each path drops; only a reducer-side input (strategy §3 checkbox or a prior registry that already carries `resolved`) moves `resolvedQuestions`, and both are outside an iteration's write authority.

## Dead Ends
- Expecting `## Questions Answered` to be parsed: the parse contract extracts eight sections and that is not one of them (F-037).
- Expecting `## Recommended Next Focus` to close the run: `resolveNextFocus` never reads the parsed `nextFocus` field (F-037).
- Expecting a richer canonical record to reach the reducer: the upcaster keeps six payload fields and the projection re-emits six row keys (F-036).

## Questions Answered
Human-readable closure record (the machine cannot read this section — F-037):
- Q1 (duplication / unneeded content) — delivered iteration 3: F-015 sentence-level duplication table, F-017 per-paragraph ownership map.
- Q2 (stale or over-specific claims) — delivered iterations 2–4: F-008 count dispositions, F-020; the F-024 patch list is the executable form.
- Q3 (audience fit and section order) — delivered iteration 3: F-018 family-block tie-break, F-025 candidate outline and recommended order.
- Q4 (README voice divergence) — delivered iteration 3: F-016 prose conformance sample, pinned to README HEAD by F-026; the pin still holds (F-039).
- Q5 (contract and template requirements, justified departures) — delivered iteration 2: F-012–F-014, F-016, F-020; the departures are recorded as deliberate.

## Questions Remaining
- None open for research. The run's deliverables are complete and frozen against the pinned blob; the only remaining work is the deferred implementation pass in this order: apply F-024's ordered patch list, then F-025's outline order, then F-027's REQ-005 disposition. If an iteration is dispatched before that pass, its only non-duplicative action is the F-039 pin sentinel: confirm the changelog sha256 still equals `33abcc9a865e688189ce2a5c…`; if it differs, re-derive F-024 before applying it.

## Sources Consulted
- `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` — `parseIterationFile` (1783–1808), `buildRegistry` resolution inputs (2320–2330), `resolveNextFocus` (2251–2300), delta loaders (1541, 1569, 1612), resource-map emission (1632–1700), graph rollup (1943, 2401), `readStateLogForReduction` use (2938–2943).
- `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` — `iteration_completed` upcast mapping (376–397).
- `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` — projected iteration row shape (211–222).
- `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs` — `deriveNextFocusFromContinuity` (114–145).
- `research/deep-research-ledger/frames/0000000000000011.frame` — iteration 8's canonical event, decoded payload.
- `research/deep-research-state.jsonl` (read-only) — all eight iteration rows and their key sets.
- `research/findings-registry.json` (read-only) — `ruledOutDirections` (6), `keyQuestions`, `metrics`, `carriedForwardOpenQuestions`.
- Repository, read-only: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` (sha256), `git log`/`git status` for `7076dba64b` and `3ad5ca25fb`.

## Reflection
- What worked and why: reading the writer of the record the reducer consumes — the upcast mapping and the projection row shape together explain the empty `ruledOut`, the missing `focus`, and the five unresolved questions in one pass, and each half is checkable against a durable artifact (the ledger frame and the state log itself).
- What did not work and why: iteration 8 fixed the narrative heading vocabulary, which moved the ruled-out directions (6 now present) but could not move the questions, because the resolution inputs do not live in the narrative at all — they live on a record whose extra fields the ledger discards.
- What I would do differently: audit every write surface's consumer before writing the first narrative, not one channel per iteration; three iterations were spent discovering, channel by channel, that the pack's advertised fields and the reducer's read set overlap in exactly one place.

## Recommended Next Focus
None for research. Implementation pass against the pinned blob: F-024 patch list in order, then F-025 outline order, then F-027 REQ-005 disposition. If dispatched before implementation, run the F-039 pin sentinel only. Operator note, separate from the research question: the five questions will end the run unresolved (`Answered: 0/5`) because no iteration-owned surface can set `resolvedQuestions` (F-036, F-037) — that is runtime telemetry to fix, not research left undone.

## SCOPE VIOLATIONS
No researched surface was written. The reducer source, the ledger frame, the state log, the registry, `continuity-thread.cjs` and the projection contract were all read-only; the changelog and README were read via `sha256sum`, `git log` and `git status --porcelain`. Writes landed only in `research/iterations/iteration-009.md`, `research/deltas/iter-009.jsonl`, one temp file outside the repository, and the gateway's own ledger refresh.
