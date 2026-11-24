# Review Iteration 003

## Dispatcher

- Mode: review
- Dimension: traceability (operator focus continued)
- Iteration: 3 of 7
- Focus this pass: `spec_code` for REQ-023 to REQ-046, with ADR-005 and ADR-006 read as the decision records the operator focus names
- Executor: this lineage process (cli-pi, deepseek-v4.1-flash-1017); no nested dispatch

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:240-300`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412-500`, `:508-600`, `:702-790`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:96-115`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:940-1225`, `:1660-1700`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5346-5365`, `:5700-5770`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:178-330`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:236-300`, `:478-520`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2892-2915`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:919-962`
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363-430`

## Findings

New findings this pass. The operator focus is addressed by reading ADR-005 and ADR-006 against their implementations, then replaying every REQ-035 to REQ-044 prompt through the shared fixture's expected columns.

### P0 Findings

None. The fallback divergence below is a contract-level contradiction with an accepted alternative reading, so it does not meet the P0 bar after the adversarial pass.

### P1 Findings

1. **ADR-008 records the mode-free plural ask as "serves the hub with no command", but the Python fallback keeps both run commands** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:732` -- ADR-008 states "The shared fixture row `plural-deep-loops-served` reads `servedRun: null` in both copies", and REQ-035 says "run two deep loops on the cache layer ... serves the hub with no command" (`spec.md:247`). The native deferred route does return `undefined` for that prompt (`.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:280-282`), but the Python suite reads the same `servedRun: null` as "not exactly one mode" and accepts *two* kept rows (`tests/python/test_skill_advisor.py:2902-2913`); `_apply_deep_loop_offer_gate` keeps every run row whose mode is not excluded when `asked_mode` is `None` (`scripts/skill_advisor.py:5734-5744`). So on a fallback runtime the reader is served `/deep:review (ask)` and `/deep:research (ask)` for a prompt the packet says carries no command. The fixture header calls the two answers equivalent ("which is the same answer the native deferred route gives when it offers no command", `deep-loop-offer-cases.json:2`), which is true of the reader's freedom to choose and false of the served rows.
   - Finding class: `spec-drift`
   - Scope proof: all four files are in the review target or the declared scope file list; the Python gate is a named integration surface in `spec.md` Files to Change.
   - Affected surface hints: `spec.md` REQ-035, `decision-record.md` ADR-008, `scripts/skill_advisor.py`, `tests/python/test_skill_advisor.py`, `tests/fixtures/deep-loop-offer-cases.json`
   - Case: On a fallback runtime, "run two deep loops on the cache layer" serves both the review and the research command with `ask`, while the same prompt on the native head serves the hub with no command.
   - Claim adjudication:
     ```json
     {"type":"traceability","claim":"REQ-035 and ADR-008 say a mode-free plural ask serves the hub with no command, while the Python fallback keeps both deep run rows for that prompt.","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:247","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:732",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5734",".skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2902"],"counterevidenceSought":"Read ADR-008's consequences and the fixture header for a statement that the fallback's two ask-policy rows are the intended equivalent; the header asserts equivalence without naming the two-row outcome, and the ADR's risk row names single-side divergence as the thing to prevent.","alternativeExplanation":"The ADR's 'no command' may describe only the native served head, and keeping both ask-policy rows may be the fallback's way of leaving the choice with the reader.","finalSeverity":"P1","confidence":0.75,"downgradeTrigger":"If ADR-008 is amended to state that the fallback keeps both ask-policy rows, or the fallback drops them, this becomes P2 or resolves."}
     ```

### P2 Findings

1. **The declared change set in spec.md stops at the sixth round** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:181` -- The `Files to Change` tables cover the first round and "Added by the sixth round (REQ-023 to REQ-034)" (`:181-193`). The eighth and ninth rounds create or modify files no table names: `.skilled/skills/system-skill-advisor/runtime/tests/scorer/deep-loop-plural-noun.vitest.ts`, `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-duplicate-command.vitest.ts`, `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-heading.vitest.ts`, and `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts` (the last one carries REQ-046's enrichment). A search of `spec.md` for those names prints nothing.
   - Finding class: `spec-drift`
   - Scope proof: `spec.md` is the review target and every omitted path is inside the packet's own scope.
   - Affected surface hints: `spec.md` §3, `handlers/advisor-recommend.ts`, `tests/scorer/deep-loop-plural-noun.vitest.ts`, `tests/handlers/advisor-recommend-duplicate-command.vitest.ts`, `tests/unit/deep-review-strategy-heading.vitest.ts`
   - Case: A reader auditing which files the packet touches from `spec.md` alone misses the enrichment handler and three test files the later requirements depend on.

2. **T074 cites a fixture line that holds a different case** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:148` -- T074 says the `bare-loop-name` row is at `tests/fixtures/deep-loop-offer-cases.json:169`; that line holds `typed-doctor-no-edit`, and `bare-loop-name` is at `:178`. The rule itself is pinned (the row reads `asksForLoopRun: false`), so only the pointer is stale.
   - Finding class: `stale-evidence`
   - Scope proof: packet task row and fixture are both inside the target scope.
   - Affected surface hints: `tasks.md` T074, `tests/fixtures/deep-loop-offer-cases.json`
   - Case: A reader opening `:169` to confirm the ADR-006 row finds an unrelated typed-doctor case instead.
   - refines: `R2-P1-001`

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `spec.md:247`, `decision-record.md:732`, `tests/python/test_skill_advisor.py:2902` | REQ-035's mode-free clause is the one requirement-level contradiction in this pass; REQ-023 to REQ-034 and REQ-036 to REQ-046 map cleanly. |
| `checklist_evidence` | partial | `tasks.md:148`, `acceptance-criteria.md:101` | T074's pointer is stale; every REQ-035 to REQ-044 prompt is present in the fixture with the expected column. |
| `skill_agent` | notApplicable | - | Not in this pass. |
| `agent_cross_runtime` | notApplicable | - | Not in this pass. |

## Integration Evidence

- `LOOP_REQUEST` reads the loop names only behind use, continue or want verbs (`command-attach.ts:949-954`), which is what ADR-006 (`decision-record.md:508-560`) records; the fixture's `bare-loop-name` row confirms the no-ask outcome.
- `loopAskCues` blanks a refused loop phrase before the mode cue is read (`command-attach.ts:1668-1685`), so REQ-041's four controls behave as the guard block asserts (`command-attach-guards.vitest.ts:919-955`).
- `enrichCompiledRoutes` strips `command`, `policy`, `ownerSkillId` and `typed` from a row it withholds (`handlers/advisor-recommend.ts:422-426`), so REQ-046's second clause holds.
- The mode vocabulary is compared on every carrier by the guard (`deep-loop-offer-cases.vitest.ts:485-492`), and `hub-router.json` carries exactly `research` and `review` signals.
- `typedCommandIn` still returns the longest typed key (`command-attach.ts:251-265`), so REQ-025's "keeps its longest-key result for every other caller" holds.

## Edge Cases

- REQ-035's mode-free clause is internally split: REQ-035 and ADR-008 say "no command", the fixture header says both copies "leave the choice with the reader", and only the native test asserts `undefined`. Recorded as P1 above; the native path is not at fault.
- AC-034's `skill_advisor.py:5566` points at a blank line while `_is_loop_workflow_request` is at `:5820`; this repeats the citation cluster already filed as `R1-P1-003` and is not re-filed.
- The sixth-round tasks' historical counts (203 cases, 26 doctorWithheld rows) are not defects in themselves; only rows that claim the final tree are.

## Confirmed-Clean Surfaces

- All eight REQ-035 run prompts, the five no-run prompts, the three REQ-036 questions, the thirteen REQ-037 complaints, the four REQ-037 controls, the three REQ-040 no-edit prompts, the four REQ-041 refused-cue prompts, the four REQ-043 prompts and the six REQ-044 prompts are present in the shared fixture with the expected `asksForLoopRun`, `servedRun`, `doctorWithheld` and `readOnlyRunKept` values.
- ADR-005's native half is pinned at `typed-on-stuck-serving.vitest.ts:112-124`, including `typed: true`; its Python half is read at `tests/python/test_skill_advisor.py:2875`.
- `COMMAND_ASK_LEAD_WORDS` exists in both copies (`command-attach.ts:1336`, `skill_advisor.py:5442`), as REQ-031 names it.

## Ruled Out

- "A REQ-035 to REQ-044 prompt is missing from the fixture": ruled out by a prompt-by-prompt lookup -- every one resolves, with its column.
- "The mode vocabulary is out of sync with the hub router": ruled out. The guard compares `MODE_CUES`, `MODE_CUE_WORDS` and `hub-router.json` `routerSignals` on the same sorted mode list (`deep-loop-offer-cases.vitest.ts:487-492`).

## Next Focus

- Dimension: correctness
- Focus area: the gate's decision order for prompts that combine a loop ask with a refusal, a stuck symptom or a no-edit clause, and the deferred/routed mode selection
- Reason: traceability has covered both core protocols and surfaced its drift; the combined-clause logic is the highest-risk behaviour the packet changes and has not been read as code
- Rotation status: correctness starts; security and maintainability remain
- Blocked/productive carry-forward: productive (fixture columns as the oracle)
- Required evidence: exact branch order in `command-attach.ts`/`skill_advisor.py` and a case that distinguishes each branch

Review verdict: CONDITIONAL
