# Iteration 5: Phases 012–014 close conditions and evidence handoffs

## Focus
Closing-phase proof pass: phases 013-manual-testing-scenarios, 014-skilled-and-doc-alignment, and 015-deep-review — verify evidence inputs, close conditions, fix/retest loops, and handoffs; identify the exact shared artifact and rank the per-phase expansion plan.

## Findings
1. **Phase 013-manual-testing-scenarios — P1:** Its corpus has a useful validator, isolated scenario fixtures, and a recorder, but REQ-006 lets a run close after each FAIL is merely named as a defect; AC-006 likewise passes when a FAIL is listed in `scratch/failures.md`. This can mark every acceptance row Met while the manual corpus still documents a broken phase. Add `012-fail-close-and-post-fix-replay.md` and make closure require zero unresolved FAILs, with evidence that each fixed scenario was rerun. Keep 012 as one corpus-and-recorder phase rather than a parent. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:32,186-192] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/acceptance-criteria.md:60-62]
2. **Phase 014-skilled-and-doc-alignment — P1:** Phase 013 says it hands runtime findings to 014 and passes two external report folders plus a clean criterion, but Phase 014 depends only on 013's acceptance rows and strict validator; it never requires reading those folders or the findings they contain. Add `013-to-014-evidence-handoff.md` with a packet-local evidence index, report paths and stable copies or digests, the fixed/rebutted finding ledger, and an explicit 014 intake check. Keep 013 as one two-command alignment/fix workflow, not a parent. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/spec.md:33,108-115,145-148] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/spec.md:43-55]
3. **Phase 015-deep-review — P1:** Its fix pass reruns affected unit suites and the full runtime suite but explicitly excludes a second review, and it does not require rerunning Phase 012's end-to-end corpus after those fixes; the review verdict can therefore describe a pre-fix surface beside unverified post-fix changes. Add `014-final-verification-loop.md` to require the affected 012 scenarios and a final review of changed files after the fix waves, or record an explicit conditional close when either cannot run. Keep 014 as the final review workflow, not a parent. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/spec.md:41,51-55,98-104,152-157] [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/acceptance-criteria.md:60-62] [SOURCE: specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-008.md:17-19]

## Ruled Out
- No child decomposition is needed for phases 012–014 from this pass. Each is a single operational workflow: scenario corpus and recorder; two alignment runs and a fix pass; or one review/fix/retest loop. Their gaps are handoff and closure rules.
- No repository from the nine context references is the first source for these closing phases. Use the in-repository playbook contract/recorder for 012, the local-alignment commands and report schemas for 013, and the deep-review command/fan-out runner for 014.

## Dead Ends
- The completeness of the 58-scenario inventory does not prove its verdicts are clean: its recorded-result acceptance row expressly permits FAIL rows when defects are named. [SOURCE: specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/acceptance-criteria.md:60-62]

## Edge Cases
- Ambiguous input: no frontier node remained; selected the closing-phase proof pass from the iteration 4 recommendation and the original fourteen-phase request.
- Contradictory evidence: none. The prior sibling findings were confirmed against the current handoff, requirement, and acceptance rows.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/spec.md:28-42,177-200
- specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/acceptance-criteria.md:54-64
- specs/system-skilled-bots/003-openbot-parity-build/013-manual-testing-scenarios/plan.md:67-74,103-126,136-141
- specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/spec.md:28-36,105-116,145-156
- specs/system-skilled-bots/003-openbot-parity-build/014-skilled-and-doc-alignment/acceptance-criteria.md:57-62
- specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/spec.md:39-55,98-104,136-166
- specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/plan.md:57-67,95-100,134-139
- specs/system-skilled-bots/003-openbot-parity-build/015-deep-review/tasks.md:131-161
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-007.md:25-33
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/vibe/iterations/iteration-008.md:15-19,31-33
- specs/system-skilled-bots/002-openbot-parity-research/003-plan-depth-research/research/lineages/codex-1/deep-research-config.json, deep-research-state.jsonl, deep-research-strategy.md, findings-registry.json; steer.md was absent at iteration start

## Assessment
- New information ratio: 0.5
- Questions addressed: whether phases 012–014 prove the build they claim to close; whether their outputs have explicit receivers and post-fix verification; whether any should become parents.
- Questions answered: 012's acceptance gate permits named but unresolved FAILs; 013's handoff artifacts are not an explicit input to 014; 014 does not require the manual corpus or a final review after code fixes. None needs a phase parent from this evidence; add the named handoff and close-condition artifacts.
- Reference order: 012, use the existing manual-playbook validator and recorder; 013, use the two local-alignment command/report contracts; 014, use `.skilled/commands/deep/review.md` and the fan-out runner. No external context repository is a better first source for these phases.

## Reflection
- What worked and why: comparing acceptance evidence to handoff criteria exposed that a syntactically complete corpus and a clean report can still leave unresolved runtime failures outside the next phase's declared inputs.
- What did not work and why: none of the review gaps is visible from module lists alone; they appear in the cross-phase close and handoff clauses.
- What I would do differently: define a packet-wide close contract before the first end-to-end corpus run, then make each later phase consume and refresh the same evidence ledger.

## Recommended Next Focus
Run terminal synthesis at the configured maximum of five iterations. Rank the P0/P1 planning artifacts by dependency and build-blocking risk, state which phases should become Level 3 parents only after both decomposition thresholds pass, and preserve the evidence links to all five iteration files.
