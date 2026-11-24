# Review Iteration 001

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Session: `fanout-deepseek-max-3-1795514074741-gl47kr`, generation 4, lineageMode `new`, parent `2026-11-24T09:54:34.000Z`
- Iteration 1 of 5. Dimension: correctness. Operator review focus bound: traceability (`spec_code` + `checklist_evidence`).
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder). Scope: the 46 paths in `review-scope-files.txt`.
- Setup bindings: target=`specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`, maxIterations=5, convergence=0.1, mode=review, dimensions=correctness,security,traceability,maintainability, specFolder=`specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`.
- No `steer.md` exists in this lineage at iteration 1, so this iteration carries no lead ruling.

## Dimension

Correctness of the deep-loop offer gate in both copies: the refusal, stuck-run, typed-command, deferred-route and bounded-window predicates the sixth and seventh rounds changed, judged against the outcome each prompt states in `spec.md`.

The operator focus was addressed by opening the `spec_code` protocol: the gate rows REQ-015 to REQ-030 were each exercised or read against the code that implements them, so the traceability pass in iterations 3 to 5 starts from settled gate behaviour rather than restating prose.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1291-1367` (`attachCommand`), `:1369-1411` (`deferredLoopCommand`), `:569-618` (`RUN_ASK_REFUSAL_LEADS`, `refusalLeadSource`, `RUN_ASK_NEGATED_SOURCE`), `:629-646` (`LEAD_WINDOW`, `endsBefore`), `:251-295` (`typedCommandIn`, `typedCommandsIn`), `:551-556` (`isStuckRunComplaint`), `:930-963` (`asksForLoopRun`), `:1406` (`NAMED_LOOP_MODE`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5343-5400` (`_apply_deep_loop_offer_gate`), `:4628` (`_RUN_ASK_REFUSAL_LEAD_LIST`), `:4921-4926` (`_LEAD_WINDOW`, `_lead_window_ends_before`), `:888-899` (`_advisor_prompt_head`), `:52` (`ADVISOR_PROMPT_MAX_CHARS`), `:5333` (`is_run_refused`), `:5021` (`asks_for_loop_run`), `:4864` (`is_stuck_run_complaint`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074-1090` (`withholdDeepLoopDoctorWithoutRun`)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` (fixture header, which names the layer each typed column pins)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:185-215` (gate and served columns), `:249-298` (per-entry vocabulary coverage)
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107-121` (typed-on-stuck served head)
- Live module probes: `attachCommand` over 40 prompts and `_apply_deep_loop_offer_gate` over 14, executed in this iteration against the working tree.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None.

## Traceability Checks

- **`spec_code` (core, hard): partial.** Opened in this iteration. The gate rows REQ-015, REQ-016, REQ-017, REQ-018, REQ-019, REQ-023, REQ-024, REQ-025, REQ-026, REQ-028, REQ-029 and REQ-030 were each checked against the producer that implements them; REQ-001 to REQ-014, REQ-020 to REQ-022, REQ-027 and REQ-031 to REQ-034 are deferred to iterations 3 and 5. Evidence: `command-attach.ts:1291`, `command-attach.ts:1369`, `skill_advisor.py:5343`, `fusion.ts:1074`, `skill_advisor.py:888`, `command-attach.ts:629`.
- **`checklist_evidence` (core, hard)**: not run in this iteration; it is scheduled for iterations 4 and 5.

Observed results, one line per requirement this iteration settled:

| Requirement | Observed | Evidence |
|---|---|---|
| REQ-015 | all six refusal prompts return no command; "do a deep review of the parser" returns `/deep:review` | `command-attach.ts:1291`, probe |
| REQ-016 | both loop questions return no command | `command-attach.ts:965`, probe |
| REQ-017 | "run a deep-review of the auth module" and the curly-apostrophe research loop both attach | `command-attach.ts:551`, probe |
| REQ-018 | "the deep research run is not stuck, run 5 more iterations" attaches `/deep:research` | `command-attach.ts:521`, probe |
| REQ-019 | the nine subject prompts return no command on either route; the three controls keep theirs | `command-attach.ts:905`, probe |
| REQ-023 | six refusal verbs withhold; "skip straight to", "don't hesitate", "don't forget" all keep `/deep:review` | `command-attach.ts:569`, probe |
| REQ-024 | both stuck-and-refusing prompts drop the doctor row in `attachCommand`, in the fused row and in the Python gate; the bare complaint keeps `/doctor:deep-loop` | `command-attach.ts:1301`, `fusion.ts:1074`, `skill_advisor.py:5343`, probe |
| REQ-025 | both two-command prompts keep `/deep:review`; `typedCommandsIn` returns `["/deep:review","/create:changelog"]` | `command-attach.ts:274`, probe |
| REQ-026 | "run a deep loop to review the research loop config" and "run a deep loop checking the parser for bugs" both resolve `/deep:review` on a deferred route | `command-attach.ts:1369`, probe |
| REQ-028 | the degraded render paths carry `command`, `policy` and `typed` through, which the CLI and subprocess suites pin | `subprocess.ts`, `skill-advisor-cli.ts`, tests read |
| REQ-029 | `attachCommand` answers `/doctor:deep-loop` while the served head answers `/deep:review` with `typed: true`, asserted at `typed-on-stuck-serving.vitest.ts:107` | `advisor-recommend.ts:428`, test read |
| REQ-030 | a 96,150-character refusal prompt stays withheld in 12 ms, a 96,000-character run ask attaches in 11 ms, and both copies cut at 10,000 code units with a 400-unit lead window | `command-attach.ts:629`, `skill_advisor.py:888`, `skill_advisor.py:4921`, probe |

The Python gate was exercised directly over the REQ-020, REQ-023, REQ-024, REQ-025, REQ-027 and REQ-030 prompts and agreed with the TypeScript gate on every row tested, apart from the route-scoped difference the fixture header documents (the Python gate keeps every run row a prompt asks for; the native gate is handed one route).

## Integration Evidence

- `.skilled/commands/deep/review.md` and `.skilled/commands/deep/research.md`: read as the command entry points the offer is taught in; no routing claim of this iteration rests on them.
- `.skilled/skills/system-deep-loop/deep-review/SKILL.md`: loaded as the owning mode packet for this loop.
- `.skilled/skills/system-deep-loop/hub-router.json` and `ROUTER.md`: not exercised this iteration; REQ-011's alias rows are iteration 3's.

## Edge Cases

- **Cross-route probe is not a defect.** `"do 5 research iterations on caching"` returns `/deep:research` on a research route and `/deep:review` on a review route. The gate attaches the command of the route it is handed, and the fixture pins each typed and gate row on one route of that command's mode (`.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2`), so the requirement's "keep theirs" is a claim about the route the scorer picks, not about every route. Recorded as an interpretation, not a finding.
- **Python keeps both run rows on a keep case.** The Python gate has no route, so a keep prompt keeps both `/deep:*` rows it was given. The fixture header states this asymmetry, and REQ-020 claims parity at the gate layer rather than row-for-row equality.
- **The typed-on-stuck split is deliberate.** `attachCommand` answers the doctor and the served head answers the typed command, which ADR-005 records and REQ-029 requires. The two layers disagreeing is the documented behaviour, so a reader comparing them is seeing the decision, not drift.
- **`dist/` is absent from this worktree**, so the probe harness and the vitest suite cannot be rerun here. Every behavioural claim above was produced by importing the TypeScript and Python modules directly, which is the producer, not the built shim.

## Confirmed-Clean Surfaces

- The refusal-lead alternation withholds all six REQ-023 verbs and keeps all three control prompts (`command-attach.ts:569-618`).
- The stuck-run branch withholds the doctor on a refusing complaint and keeps it otherwise, in both copies and in the fused row (`command-attach.ts:1301`, `fusion.ts:1074`, `skill_advisor.py:5343`).
- A second typed command never hides a typed `/deep:*` command (`command-attach.ts:274`).
- A deferred route resolves one mode cue only, and two cues resolve none (`command-attach.ts:1369-1411`).
- The lead window bounds the per-phrase scan, so a 96,150-character prompt costs 12 ms rather than time quadratic in its length (`command-attach.ts:629-646`).
- The Python head cut counts UTF-16 code units, so a prompt with astral characters is cut where the native schema cuts it (`skill_advisor.py:888-899`).

## Ruled Out

- **A refusal that still offers the command:** ruled out for all six REQ-023 verbs and for the six REQ-015 prompts, by probe on both copies.
- **A bare-naming false offer:** ruled out; "refactor the deep research scorer", "review our multi-pass compiler" and the other seven REQ-019 subject prompts return no command on either route.
- **A quadratic scan left in the lead reads:** ruled out; `endsBefore` slices a 400-character window rather than the whole prefix (`command-attach.ts:629-646`), and the 96,150-character probe completed in 12 ms.
- **A type/length divergence between the two copies on the head and the window:** ruled out; both read `10_000` and `400` (`advisor-tool-schemas.ts:257`, `skill_advisor.py:52`, `skill_advisor.py:4921`), and the drift guard compares the two numbers against the Python source (`deep-loop-offer-cases.vitest.ts:80-83`).
- **A typed command hidden by a longer second command:** ruled out by probe over both REQ-025 prompts.

## Next Focus

- Dimension: security
- Focus area: trust boundaries of the gate and its serving layers, the no-edit guard ordering, command-naming quote handling and the secrets surface in the changed files.
- Reason: rotation continues to the second canonical dimension with correctness settled.
- Rotation status: 1 of 4 dimensions covered.
- Blocked/productive carry-forward: productive category "read the producer, then exercise it live" carried this iteration and should carry the security pass.
- Required evidence: file:line for each guard and a probe or test for each security-relevant prompt shape.

## Verdict

No active P0 and no active P1, so the iteration passes on its own findings. The run's verdict is not settled here: `spec_code` is still partial and `checklist_evidence` has not run.

Review verdict: PASS
