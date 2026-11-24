# Deep Review Report - 012 deep-loop command offers (lineage opus-medium-2)

## 1. Executive Summary
- Overall verdict: CONDITIONAL
- hasAdvisories: true
- P0/P1/P2 counts (active, as the verdict used them): 0 / 1 / 6
- Self-check outcomes: R1-P1-001 rechecked at synthesis and kept at P1 (confidence 0.75). The served-path reach is inferred from code: `attachTypedCommand` runs after `enrichCompiledRoutes` on both return paths and `typedCommandForTop` has no stuck-run check. It could not be run end to end because `runtime/dist` is missing in this worktree. R3-P1-001 merged into R1-P1-001 as a refinement. Reach, both sides: the scorer's stuck-run rule pushes `system-deep-loop` +1.0 and `sk-code` -0.6 (`.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:487-489`), so the hub, which owns `/deep:review`, is expected to top this prompt. Against that, baseline probe N7 shows `command-doctor-deep-loop` topping one stuck prompt (spec.md:124). When the doctor row tops, `typedCommandForTop` returns undefined and nothing is overridden. No finding was called a false positive.
- Review scope summary: 32 files (the gate in command-attach.ts, the Python fallback in skill_advisor.py, the handler, render, subprocess and CLI-fallback paths, the tests and fixture, the command docs, the changelog, and the 012 and 013 packet docs). Five iterations ran: correctness, security, traceability, maintainability, then a correctness cross-reference pass.
- Operator review focus: The deep-loop offer gate in command-attach.ts and the Python fallback in skill_advisor.py, plus the typed-command hint from packet 013

## 2. Planning Trigger
`/speckit:plan` is required: one active P1.

```json
{"triggered":true,"verdict":"CONDITIONAL","hasAdvisories":true,
"activeFindings":[
{"id":"R1-P1-001","severity":"P1","title":"Typed /deep:review on a stuck-run complaint overrides the /doctor:deep-loop answer in the served output","file":".skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:434"},
{"id":"R1-P2-001","severity":"P2","title":"Common refusal verbs (skip, avoid, no need for) still open the loop gate in both copies","file":".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:440"},
{"id":"R2-P2-001","severity":"P2","title":"Python fallback runs per-match gate scans on an uncapped prompt (quadratic cost)","file":".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5596"},
{"id":"R3-P2-001","severity":"P2","title":"Python-subprocess brief path drops command/policy/typed so a typed deep command renders the A/B/C offer","file":".skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:200"},
{"id":"R4-P2-001","severity":"P2","title":"Typed-command parity column pinned at different layers; no deep-loop typed case at the serving layer","file":".skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:57"},
{"id":"R5-P2-001","severity":"P2","title":"Named-mode shortcut reads a loop name the gate treated as subject, so a review request gets /deep:research","file":".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:908"},
{"id":"R5-P2-002","severity":"P2","title":"Bare loop name is not an ask; narrows D2 without a recorded decision","file":".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:574"}],
"remediationWorkstreams":[{"id":"WS-1","priority":"P1","findings":["R1-P1-001","R4-P2-001"],"summary":"Make the typed-command step honour the stuck-run diagnosis, and test the served path"},{"id":"WS-2","priority":"P2","findings":["R1-P2-001","R5-P2-001","R5-P2-002"],"summary":"Gate vocabulary and deferred-mode fixes, kept in both copies"},{"id":"WS-3","priority":"P2","findings":["R3-P2-001","R2-P2-001"],"summary":"Python fallback parity: carry command/policy/typed, cap the prompt"}],
"specSeed":["REQ: a stuck-run complaint that types /deep:* serves /doctor:deep-loop end to end","REQ: refusal leads skip/avoid/no need for withhold the loop offer","REQ: the Python subprocess brief keeps typed commands plain"],
"planSeed":["Add an isStuckRunComplaint guard to typedCommandForTop or attachTypedCommand for system-deep-loop","Add a deep-loop typed-stuck case to advisor-recommend-typed-command.vitest.ts","Extend RUN_ASK_NEGATED and _RUN_ASK_NEGATED_RE together, with fixture rows","Apply namesLoopSubject before NAMED_LOOP_MODE in deferredLoopCommand","Record the loop-name use-verb narrowing as an ADR or widen the code","Carry command/policy/typed through subprocess.ts parseRecommendations and emit typed from skill_advisor.py","Apply _advisor_prompt_head in analyze_request"],
"findingClasses":["correctness","security","traceability","maintainability"],
"affectedSurfacesSeed":["typedCommandForTop","attachTypedCommand","RUN_ASK_NEGATED","_RUN_ASK_NEGATED_RE","deferredLoopCommand","NAMED_LOOP_MODE","LOOP_NAMES","subprocess.ts parseRecommendations","skill_advisor.py analyze_request","deep-loop-offer-cases.vitest.ts","acceptance-criteria.md AC-027","v4.2.0.0.md"],
"fixCompletenessRequired":true}
```

## 3. Active Finding Registry
| ID | Sev | Dimension | Title | file:line | Impact | Fix recommendation | findingClass | scopeProof | affectedSurfaceHints |
|----|-----|-----------|-------|-----------|--------|--------------------|--------------|------------|----------------------|
| R1-P1-001 | P1 | correctness | A typed /deep:review on a stuck-run complaint overrides /doctor:deep-loop in the served output (refined by R3-P1-001: AC-027 is Met on evidence from attachCommand only) | `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:434` | A reader who reports a stuck run is offered a new costly run. TS and Python disagree on the case REQ-020 names. | Check for a stuck run in the typed step for deep-loop commands. Test the served path. Rescope AC-027 or re-verify it | correctness | handler and gate in scope; REQ-020 names the prompt | typedCommandForTop, attachTypedCommand, AC-027 |
| R1-P2-001 | P2 | correctness | skip/avoid/"no need for" refusals still open the loop gate | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:440` | One unwanted `ask` question | Extend both negation patterns | correctness | both gate copies in scope | RUN_ASK_NEGATED, _RUN_ASK_NEGATED_RE |
| R2-P2-001 | P2 | security | Python fallback gate cost grows quadratically on an uncapped prompt | `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5596` | A direct CLI call on a 90 KB paste stalls for about 11 s | Apply `_advisor_prompt_head` in analyze_request | security | gate copy in scope | analyze_request, _has_loop_ask |
| R3-P2-001 | P2 | traceability | The Python-subprocess brief drops command/policy/typed, so a typed deep command shows A/B/C | `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:200` | 013 REQ-006 holds on two of three brief paths | Carry the fields through; emit typed from Python | traceability | subprocess/render in scope | parseRecommendations, commandLabel |
| R4-P2-001 | P2 | maintainability | The parity column is pinned at different layers, and the serving layer has no deep-loop typed test | `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:57` | Served-path drift stays green | Assert the served path for typed rows | maintainability | fixture/test in scope | deep-loop-offer-cases.vitest.ts |
| R5-P2-001 | P2 | correctness | The named-mode shortcut reads a subject loop name, so a review request gets /deep:research | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:908` | The offer names the wrong mode | Skip subject matches in NAMED_LOOP_MODE | correctness | deferred branch in scope | deferredLoopCommand |
| R5-P2-002 | P2 | traceability | A bare loop name is not an ask, which narrows D2 with no ADR | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:574` | Spec and code disagree on "deep loop: X" | Record an ADR or widen the code | traceability | spec D2 and LOOP_REQUEST in scope | LOOP_NAMES, decision-record.md |

## 4. Remediation Workstreams
1. WS-1 (P1): R1-P1-001 with R4-P2-001. Guard the typed step for a stuck-run complaint and add a served-path test.
2. WS-2 (P2 advisories): R1-P2-001, R5-P2-001, R5-P2-002. Gate vocabulary changes, kept in both copies and the shared fixture.
3. WS-3 (P2 advisories): R3-P2-001, R2-P2-001. Python fallback parity on the brief path, plus the prompt cap.

## 5. Spec Seed
- A stuck-run complaint that also types `/deep:*` serves `/doctor:deep-loop` end to end, not only from `attachCommand`.
- Refusal leads `skip`, `avoid` and "no need for" withhold the loop offer in both copies.
- The Python subprocess brief shows a typed deep command as plain `(ask)`.
- D2's loop-name clause states whether a bare "deep loop: X" counts.

## 6. Plan Seed
- Add a stuck-run guard for `system-deep-loop` in `typedCommandForTop` or `attachTypedCommand`.
- Add a deep-loop typed-stuck case to the handler typed-command test.
- Widen `RUN_ASK_NEGATED` and `_RUN_ASK_NEGATED_RE` together, with fixture rows.
- Filter subject matches out of `NAMED_LOOP_MODE` in `deferredLoopCommand`.
- Carry `command`, `policy`, `ownerSkillId` and `typed` through `parseRecommendations`, and emit `typed` from `skill_advisor.py`.
- Cap the prompt in `analyze_request` with `_advisor_prompt_head`.

## 7. Traceability Status
### Core Protocols
- spec_code: partial. REQ-015 to REQ-019 example prompts reproduce at `attachCommand`. NFR-S01 passes. REQ-021 predicate parity passes, with 0 drift over 663 prompts. REQ-020 diverges on the served path (R1-P1-001). 013 REQ-006 fails on the Python subprocess path (R3-P2-001). D2's loop-name clause is narrower in code (R5-P2-002).
- checklist_evidence: partial. AC-008 is Waived with ADR-003, which exists. AC-022 to AC-026 and AC-029 are consistent with the code. AC-027's evidence does not cover the served path.
- AC_COVERAGE: advisory-shortfall on AC-027 only.
### Overlay Protocols
- skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability: notApplicable. No such surfaces are in the scope file.

## 8. Deferred Items
- End-to-end confirmation of R1-P1-001 with a built `runtime/dist`. This is its downgrade trigger.
- acceptance-criteria.md frontmatter `completion_pct: 0` is already recorded as Q028 (decision-record.md:951).
- The stage-one rule in explicit.ts checks the research cue before the review cue. It affects only the hub's score.

## Dimension Expansion Map
- Swept: correctness (iterations 1 and 5), security (2), traceability (3), maintainability (4).
- Pivots: none. Remaining frontier: the served-path end-to-end run, blocked on dist.

## 9. Search Ledger
*No search-depth state captured (legacy v1 record)*

## 10. Audit Appendix
- Convergence: newFindingsRatio by iteration 1.0, 0.143, 0.269, 0.077, 0.133. stopPolicy max-iterations; stop reason maxIterationsReached.
- Coverage: 4 of 4 dimensions.
- Ruled out: a typed command kept beside no-edit wording; a prompt-injected `typed` flag; subprocess shell or argv injection; catastrophic single-regex backtracking; the changelog overclaiming the refusal vocabulary; hidden TS/Python drift on case, apostrophe, punctuation or spacing; the stage-one rule leaking a command.
- Sources: see each iteration's Files Reviewed. Executable probes are kept under `probes/` in this lineage.
### Core Protocols
- spec_code: partial (iterations 1, 2, 3, 4, 5)
- checklist_evidence: partial (iteration 3)
### Overlay Protocols
- all four: notApplicable (iteration 4)
