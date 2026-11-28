# Iteration 3: Verification and review gates

## Focus
Frontier node F-1-006: assess phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review for concrete scenarios, alignment targets, review dimensions, executor waves, stop rules and cross-phase handoffs. The frontier block reported no remaining child slots, so this iteration proposes no frontier nodes.

## Actions Taken
- Read config, state, strategy, registry and steer.md (absent), then followed the reducer-selected F-1-006 focus and checked exhausted approaches.
- Compared phase 012's scenario corpus and defect recording with phase 013's alignment reports and phase 014's review inputs, dimensions, stop rule, fan-out and executor fallback.
- Checked the source plan/tasks for gate consistency and traced which verification artifacts are named as inputs to the next phase.
- Ran the required expansive frontier block and convergence telemetry. The early-stop signal remains telemetry; the five-iteration cap still governs this run.

## Findings
1. **Cross-phase handoff 013-manual-testing-scenarios → 015-deep-review — P1: manual test failures can be recorded without entering the final review.** Phase 012 permits an observed FAIL to remain in results when its scenario id appears in `scratch/failures.md`; phase 014 says it reviews the code and docs built by phases 001-013 and its workflow consumes the deep-review registry/report, but does not list the manual results or failure file as review inputs. That leaves a path for a reproducible manual defect to be filed and then omitted from the final P0/P1 decision. Add the 012 run folder, `results.csv` and `failures.md` to 014's required inputs; require each failure to map to scenario, phase, requirement and evidence, and block closure on any unresolved P0/P1 or explicitly carry it as a named deferral. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/tasks.md:142-146] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/plan.md:29-30] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/plan.md:58-66]
2. **Phase 015-deep-review — P1: missing-executor prerequisites conflict with the fallback contract.** The preflight task requires all five binaries on PATH, while the dependency table says a missing binary drops its lineage and the fallback replaces it; the plan also promises five independent reads. A builder cannot tell whether an absent CLI blocks the phase before spawn or is expected to be absorbed by the fallback. Align 014's Definition of Ready, task T003, dependency table and acceptance criteria: either require all five executors and remove the missing-binary fallback, or permit a smaller available roster and state how fallback scaling still preserves five independent lineages and the no-partition-gap check. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/tasks.md:39-44] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/plan.md:121-128] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/plan.md:173-183]

## Questions Answered
- Verification phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment and 015-deep-review: are scenario lists, alignment targets, review dimensions, executor waves and stop rules concrete enough to run without decisions, and do the build phases leave them the hooks they need? **Mostly yes:** 012's 33-scenario corpus and recorder are explicit, 013 names both alignment runs, code roots, validators and recheck outputs, and 014 defines five review dimensions, evidence/coverage gates and fix waves. The two remaining gaps are the 012 failure handoff into 014 and the contradictory executor preflight/fallback rule.

## Questions Remaining
- Whether the 014 executor roster is a hard operator prerequisite or a replaceable set, and which terminal condition applies when an executor is absent before spawn.
- Review phases 001, 002, 004, 006 and 011, then check the build-order interfaces across all reviewed phases.

## Ruled Out
- Do not infer that a FAIL is necessarily blocking or resolved: 012 explicitly allows it to be filed as a defect.
- Do not assume 014's fallback removes its preflight gate: T003 separately requires all five executables.
- No phase 003 children were inspected; 010's design handoff remains assigned to that phase's UX artifact owner.

## Dead Ends
- None. The validation plans contain useful handoff evidence; the only contradictions are specific and repairable in 012/014's phase contracts.

## Edge Cases
- Ambiguous input: none; the frontier names the three verification phases.
- Contradictory evidence: 014 requires five executables in T003 but also says a missing executable drops a lineage and fallback replaces it; recorded as a P1 planning conflict. steer.md was checked before resolving it and was absent.
- Missing dependencies: none during read-only inspection; external executor availability is a planned preflight condition, not a tool failure in this iteration.
- Partial success: the assigned verification question is answered; the remaining five build phases are outside this frontier and scheduled for a later pass.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/plan.md:39-53, 62-73
- specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/tasks.md:138-147
- specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/plan.md:70-78, 120-128
- specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/spec.md:128-146
- specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/plan.md:29-30, 58-66, 121-128, 173-183
- specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/tasks.md:39-47, 91-113
- specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/acceptance-criteria.md:48-54
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-2/steer.md (checked; absent)

## Assessment
- New information ratio: 1.0 (two newly identified cross-phase/gate inconsistencies).
- Questions addressed: F-1-006.
- Questions answered: F-1-006, with both 012/013/014 readiness and the specific handoff gaps recorded.

## Reflection
- What worked and why: comparing the source phase's allowed failure outcome with the next phase's declared inputs exposed a missing handoff; reading both 014's task gate and dependency contract exposed the executor conflict.
- What did not work and why: none of the verification artifacts needed were missing; the remaining issue is how the documents compose, not the availability of tools or fixtures.
- What I would do differently: the next pass should map phase dependencies and producer/consumer fields, focusing on the remaining runtime phases rather than revisiting the verification machinery.

## Recommended Next Focus
Review the uncovered runtime phases 001-activity-and-actor, 002-routine-layer, 004-computer-exposure, 006-approval-grants and 011-messaging-channels for missing contracts, lifecycle and user-facing channel design.
