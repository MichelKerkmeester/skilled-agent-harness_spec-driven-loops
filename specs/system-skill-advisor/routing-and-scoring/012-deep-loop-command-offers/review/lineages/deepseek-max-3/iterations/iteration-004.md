# Review Iteration 004

## Dispatcher

- Mode: review
- Dimension: correctness (operator focus carried alongside)
- Iteration: 4 of 7
- Focus this pass: branch order in the two gate copies for prompts that combine a loop ask with a refusal, a stuck symptom or a no-edit clause; deferred versus routed mode selection
- Executor: this lineage process (cli-pi, deepseek-v4.1-flash-1017); no nested dispatch

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:618-790`, `:860-1135`, `:1537-1700`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5346-5365`, `:5700-5770`
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489-1585`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-2`, `:253-330`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:236-300`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2892-2915`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:247`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:702-760`

## Findings

New findings this pass. The operator focus is addressed by checking that the traceability claims REQ-035 to REQ-044 make are backed by branch order in both gate copies, not only by fixture columns.

### P0 Findings

None.

### P1 Findings

None. The combined-clause order in both copies matches the requirements the packet states: the refusal leads are read before the loop ask, the stuck reading cancels on an unrefused run ask, and the no-edit guard spares a read-only loop mode.

### P2 Findings

1. **`servedRun: null` cannot tell "no mode named" from "both modes kept", so the Python suite cannot catch a drop-to-zero regression** -- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2902` -- For a `null` row the Python parity test accepts any row count other than one (`served_ok = len(served_modes) != 1`), so zero kept rows and two kept rows both pass. The native test pins the same row to `undefined` (`tests/deep-loop-offer-cases.vitest.ts:280-282`). The columns therefore encode two different answers under one value, and the shared fixture cannot catch a fallback change that drops every run row for "run two deep loops on the cache layer" -- a change that would already contradict ADR-008's two-row reading.
   - Finding class: `test-oracle`
   - Scope proof: both suites and the fixture are named scope files for this review.
   - Affected surface hints: `tests/python/test_skill_advisor.py`, `tests/deep-loop-offer-cases.vitest.ts`, `tests/fixtures/deep-loop-offer-cases.json`, `scripts/skill_advisor.py`
   - Case: A fallback edit that drops both deep run rows for a mode-free ask leaves `servedRun: null` true and every suite green, even though the brief then offers nothing where the ADR says the reader keeps the choice.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `spec.md:247`, `decision-record.md:732` | REQ-035's mode-free clause remains the one requirement-level open item carried from iteration 3. |
| `checklist_evidence` | partial | `tasks.md:148`, `acceptance-criteria.md:84` | The stale pointers and counts recorded in iterations 1 to 3 are unchanged by this pass. |
| `skill_agent` | notApplicable | - | Not in this pass. |
| `agent_cross_runtime` | notApplicable | - | Not in this pass. |

## Integration Evidence

- `asksForLoopRun` gates the ask on `hasLoopAsk` minus the past-run, stuck, writing-about and question readings in that order (`command-attach.ts:1132-1139`); the Python copy applies the same four exceptions in `asks_for_loop_run`.
- `isStuckRunComplaint` cancels on an unrefused run ask or a counted ask and ignores a negated symptom (`command-attach.ts:667-670`), so REQ-018's "not stuck, run 5 more iterations" reads as a run.
- `COUNT_AS_SUBJECT` and `PASS_NOUN` together keep "several passes of the linter failed, review the config" from reading as an ask (`command-attach.ts:390`, `:1090-1100`), which is the gate half of REQ-027.
- `attachCommand` answers a stuck complaint before either route branch, then restores a typed command at the handler layer (`command-attach.ts:1546-1558`, `advisor-recommend.ts:436+`), which is ADR-005's shape.
- `deferredLoopCommand` and `routedLoopMode` both read `loopAskCues`, so refused phrases and subject-only loop names settle no mode on either route (`command-attach.ts:1625-1690`).
- `trackedCommandForOwner` resolves a legacy bridge id through the alias group (`skill-advisor-cli.ts:1489-1495`), so REQ-038's degraded row survives the folded skill id.

## Edge Cases

- `namesDeepRun` intentionally keeps the doctor on a past-tense fault ("the deep research run was stuck yesterday"), because the comment states a fault in the same prompt names a state to read (`command-attach.ts:642-651`). Recorded as an accepted behaviour, not a finding.
- The 400-character lead window drops a refusal further away than that; the comment names the trade-off, and no prompt in the fixture puts a refusal more than a few words from the command, so no case of a wrong offer was found.
- `attachCommand`'s no-edit guard reads the routed `workflowMode` before `routedLoopMode` resolves the ask; both deep modes are in `READ_ONLY_LOOP_MODES`, so no current prompt is affected.

## Confirmed-Clean Surfaces

- Refusal leads, typed-command mentions, doc-path mentions and the second-typed-command case all keep the branch order the requirements state (`command-attach.ts:1616`, `:1634`).
- The Python gate's doctor drop reads the same three inputs as the native withhold: mention, ask, and refusal or no-edit (`skill_advisor.py:5715-5728`).
- The degraded CLI path prints a supplied command only through the tracked table (`skill-advisor-cli.ts:1571-1580`).
- Both copies read the same 10,000-code-unit head before the gate (`skill-advisor.py:1056`, `lib/skill-advisor-brief.ts:481`).

## Ruled Out

- "A refusal is lost when a typed command is also present": ruled out. `typesThisCommand` only bypasses the wording gate for the command actually typed, and `commandOnlyMentioned` still drops a refused naming (`command-attach.ts:1616`, `:1646`).
- "A negated symptom still reads as a stuck run": ruled out. The symptom pattern carries a negation lookbehind and the fixture row for REQ-018 reads as a run.
- "The no-edit guard withholds a read-only loop": ruled out by the routed and deferred branches, each sparing `READ_ONLY_LOOP_MODES`.

## Next Focus

- Dimension: security
- Focus area: the trust boundary between the advisor child process and the degraded brief, plus any prompt-supplied string that reaches a command row
- Reason: correctness found the branch order sound; the degraded path carries child-supplied command text and is the one place a prompt can influence what the reader sees
- Rotation status: security starts; maintainability remains
- Blocked/productive carry-forward: productive (reading the caller alongside the callee)
- Required evidence: the exact field each path trusts and a case that shows an untrusted value being dropped

Active P1 findings carried into this iteration: R1-P1-001, R1-P1-002, R1-P1-003, R3-P1-001. This iteration added none, so the verdict stays CONDITIONAL.

Review verdict: CONDITIONAL
