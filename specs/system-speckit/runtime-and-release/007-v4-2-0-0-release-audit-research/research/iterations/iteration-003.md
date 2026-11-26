# Iteration 3: System Skill Advisor Routing

## Focus

Audited the system-skill-advisor scorer, hook behavior, brief policy, embedding-lane removal and the relationship between the active hook reference and AGENTS.md Gate 2. Also traced the Q1 legacy-import source because its checked status determines why Q2 was selected.

## Actions Taken

1. Read the run config, state log, strategy and registry before selecting the focus. Two canonical iteration records existed, and strategy Section 3 names Q2 as the next unchecked question.
2. Traced the Q1 registry row. It has origin legacy-import and source key-questions; the strategy's Section 3 row has Q1 checked. That explains why the registry presents Q1 as resolved and why Q2 is next. The current iteration-1 state record still has an empty answeredQuestions array, so the historical decision behind that imported checkbox remains unknown.
3. Compared the live scorer lane registry with the active README and architecture descriptions. The current registry and both active docs describe four scoring lanes after the semantic embedding lane removal.
4. Followed the Pi input adapter into the shared prompt handler and route-receipt guard, then compared that path with the hook reference's per-session receipt description.
5. Read the relevant hook and route-receipt tests as source evidence. No tests or runtime commands were run.

## Findings

1. **P3: Pi omits the session ID needed by the shared route-receipt guard.** Pi obtains its session ID from the host context, but the input object passed to the shared handler contains only the prompt, working directory and event name. The shared handler derives receipt identity only from input.session_id. Without it, both the weak-follow-up guard and the route-receipt writer return before reading or writing a receipt. A weak follow-up in Pi is therefore scored without the prior route receipt, even though the hook reference describes per-session receipts and lists Pi as a shared-handler adapter. [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:57] [SOURCE: .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:290] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:339] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:370] [SOURCE: .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:407] [SOURCE: .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:164] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:57] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:74]

## Ruled Out

- The semantic embedding-lane removal does not show active scorer or documentation drift in the inspected surface. The live registry lists four active lanes, and the README and architecture describe the same four. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8] [SOURCE: .skilled/skills/system-skill-advisor/README.md:38] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:110] [SOURCE: .skilled/skills/system-skill-advisor/ARCHITECTURE.md:126]
- No conflict was found between the reviewed hook mechanics and AGENTS.md Gate 2 policy. Gate 2 gives the surfaced hook brief priority and names the direct advisor call as the fallback; the hook reference describes how the brief is produced and delivered. [SOURCE: AGENTS.md:63] [SOURCE: AGENTS.md:68] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55] [SOURCE: .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:59]

## Dead Ends

- The removed semantic lane did not leave a mismatch in the live lane registry, active README or architecture description.
- The user-supplied Gate 2 policy is not contradicted by the hook behavior description reviewed here.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: Q1 is checked in the strategy and imported into the registry as resolved from key-questions, while the current iteration-1 record has no answered questions and the prior narrative says Q1 remains open. The import source that affects focus selection is identified; the decision or event that justified the checked state remains unknown. This is the previously recorded packet-status conflict, not a new Q2 finding.
- Missing dependencies: none.
- Partial success: none. The Pi route-receipt gap is confirmed by the source path; the broader Q2 question can be answered yes on this routing defect.

## Sources Consulted

- .skilled/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:57, 290-300, 336
- .skilled/skills/system-skill-advisor/hooks/claude/user-prompt-submit.ts:339-345, 363-391, 397-432
- .skilled/skills/system-skill-advisor/hooks/lib/route-receipt.ts:148-185
- .skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md:55-59, 69-76
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/lane-registry.ts:8-18
- .skilled/skills/system-skill-advisor/README.md:38
- .skilled/skills/system-skill-advisor/ARCHITECTURE.md:110, 126
- AGENTS.md:63-70
- specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-strategy.md:56-59, 81-84
- specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/findings-registry.json:10-19
- specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/deep-research-state.jsonl:6

## Assessment

- New information ratio: 1.0
- Questions addressed: Q2; Q1 import provenance for focus selection
- Questions answered: Q2, the system-skill-advisor audit question
- Questions remaining: Q3, Q4 and Q5; the historical reason for Q1's imported checked state remains unknown

## Reflection

- What worked and why: following the Pi adapter's concrete call into the shared handler exposed a missing identity field that makes both receipt paths unreachable.
- What did not work and why: dynamic Pi behavior was not exercised; static control flow was sufficient to confirm the missing session identity.
- What I would do differently: continue with Q3 and reserve another pass for any additional Q2 surfaces only if later evidence opens a specific question.

## Questions Answered

- Q2: Does the changed system-skill-advisor (scorer, hooks, brief policy, embedding-lane removal) hold routing bugs or drift between code, hook docs and AGENTS.md Gate 2? Yes. The Pi adapter omits the session ID required for its shared route-receipt guard.

## Questions Remaining

- Q3: Do the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes hold broken paths, registry or hub-router drift, or executor builder bugs?
- Q4: Do the changed system-spec-kit runtime and hooks (decision-capture, session-handover, cli-dispatch, overlay-guard, git hooks) hold logic bugs or doc drift against what v4.2.0.0 claims?
- Q5: Do the doctor commands and skill, sk-doc, sk-code, sk-git, runtime mirrors, CI workflows and the v4.2.0.0 changelog agree with the code they describe?
- Q1's imported checked state still lacks a recorded decision or event explaining its semantic closure.

## Recommended Next Focus

Proceed to Q3: inspect the changed mcp-browser-use, mcp-tooling, cli-external-orchestration and cli-orca modes for broken paths, registry or hub-router drift and executor-builder bugs.
