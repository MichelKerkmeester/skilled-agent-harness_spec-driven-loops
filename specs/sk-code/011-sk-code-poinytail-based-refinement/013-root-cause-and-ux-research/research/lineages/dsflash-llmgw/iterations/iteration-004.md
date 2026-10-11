# Iteration 4: The advisor cluster — battery failures and the unpassed surface hint

## Focus

Part 2's advisor items: the probe battery scoring 13 of 17 positives with 2 of 5 negative false positives, the role a file path or hub-owned name in the prompt plays in those outcomes, and why the advisor never passes `--surface-hint` so keyword ties fall back to the fixed surface order. Confirmed by reading the recorded battery runs, the fixture that defines the battery, the advisor handler's compiled-route call, and the front door and engine that accept the hint.

## Actions Taken

1. Read the SA-001 battery definition and its pass rule, and the recorded after-run and comparison tsv files under the phase-002 scratch directory.
2. Read the advisor's compiled-route enrichment path (`advisor-recommend.ts`) and the front door (`compiled-route.cjs`) plus the engine's `applySurfaceHint` handling.
3. Read the surface-hint test suite and the sk-code hub's tie-break statement to establish what "fixed surface order" means and where the hint changes it.
4. Cross-checked the recorded outcomes against the brief's claimed counts.

## Findings

1. **The battery fails both of its own aggregates, and the recorded run matches the brief exactly.** The SA-001 rule requires at least 14 of 17 positives and 0 of 5 negative false positives; the recorded post-change run has 13 positives won (P2, 3, 5, 6, 7, 8, 9, 10, 12, 13, 14, 16, 17) with P1, P4, P11 and P15 lost, and sk-code is top-1 on two negatives (N1 at 0.934 and N5 at 0.861). The phase recorded the same state: "It failed before this phase (11 of 15 positives, 2 of 5 negatives won by sk-code) and this phase changes no advisor input. It is a separate advisor-accuracy issue." [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:60] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/scratch/after-sa001.tsv:1] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/implementation-summary.md:111] — **CONFIRMED** (read the recorded per-probe outcomes and the rule). **P1 by external-user impact**: the playbook's central advisor scenario is permanently red, so an adopter verifying the advisor sees a failing suite with a known cause but no owner. **Smallest fix**: none inside the epic's scope — the fix belongs to the advisor's scoring inputs; the phase-level action is to attach the existing signals (below) and rerun the battery, which the battery doc's own triage lists.

2. **The production mechanism for both the false positives and most lost positives is the same: hub-owned tokens in the prompt outrank intent tokens.** N1 is the documented shape — the battery's own triage says "`Update sk-code SKILL.md ...` should go to sk-doc but sk-code wins because of 'sk-code' mention" — and the recorded run shows its mirror on the positive side: P11 names a `.skilled/skills/system-spec-kit/.../validate.sh` path and system-spec-kit wins (0.864) over the intended sk-code; P1 names a system-deep-loop path and cli-external-orchestration wins (0.95); N4 names `cli-opencode` and cli-external-orchestration wins (0.95) over sk-doc. So a prompt that is about editing a document or adding a flag, but names some hub's artifact, is scored by the artifact's owner. [SOURCE: .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:115] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/scratch/after-sa001.tsv:4] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/scratch/after-sa001.tsv:11] — **CONFIRMED** (recorded outcomes; the triage names the shape). **P1**. **Smallest fix**: the battery doc's own triage already lists the four missing signals ("executor config", "Gate 3"/"classifier", "verify alignment"); applying them in the owning skill graph and rerunning is the smallest complete step, and no new scoring layer is needed.

3. **The advisor never passes `--surface-hint`, so a multi-surface recommendation serves the compiled order, not the session's surface.** The handler invokes the front door with exactly `['--hub', skillId, '--prompt-stdin']`; the front door parses `--surface-hint <SURFACE>` and forwards it as `options.surfaceHint`; the engine applies it only when present, and its own comment says "a call without it serves exactly the compiled order". The compiled order for bundled surfaces is the hub's `routerPolicy.tieBreak` = detection precedence `OPENCODE > OBSIDIAN > WEBFLOW`, stated in the hub `SKILL.md` and `stack-detection.md`. The session-aware tie-break child that added the hint (round four, child 008) recorded that no shipped caller passes it yet and named this exact handler. [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:372] [SOURCE: .skilled/bin/compiled-route.cjs:36] [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99] [SOURCE: .skilled/skills/sk-code/SKILL.md:74] [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/goal.md:95] — **CONFIRMED** (read every link in the chain). **P1 by external-user impact**: every multi-surface recommendation orders surfaces by a fixed precedence even when the user's session works in a lower-precedence surface — the exact routing surprise the hint was built to remove. **Smallest fix**: pass the detected session surface as one extra argument at the single existing subprocess call site; the machinery, the flag and its tests already exist.

4. **The hint capability is complete and tested; only adoption is missing.** The front door accepts the flag, the sk-code canary router implements `applySurfaceHint` (reorder only among matched surface targets, leaving non-surface targets in place), and `.skilled/bin/tests/compiled-route-surface-hint.test.cjs` exercises ordering; the merge record counts "surface hint tests -> 6 of 6 pass". Because the advisor already spawns the front door per eligible recommendation, adding the argument introduces no new process, dependency or layer. [SOURCE: .skilled/bin/tests/compiled-route-surface-hint.test.cjs:1] [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs] [SOURCE: git:5cf062b021] — **CONFIRMED** (read). **P2**. **Smallest fix**: none beyond finding 3 — this finding exists to establish that the fix is adoption, not construction.

5. **The battery and the hint are coupled but independent fixes, and the phase's own decision kept the battery out of scope.** Phase 002's decision D5 judges each probe against its own before-result and reports the aggregate "only as a number", because changing advisor inputs is outside an sk-code doc phase. That is correct scoping; the synthesis should still assign the battery a named owner and a rerun, because a known-red suite with no owner is the same class as the stale canary in iteration 3. [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/goal.md:51] — **CONFIRMED** (read). **P2**. **Smallest fix**: none in code — name the owner and the rerun command when the aggregate is reported.

## Ruled Out

- **A new "intent beats artifact" scoring mode or a prompt-preprocessing layer that strips paths before scoring.** Rejected under `.skilled/repo-rules/prevent-overengineering.md`: the advisor already exposes a signal list and a compiled hint specifically for context the prompt text alone cannot carry; stripping paths would break the legitimate case where the named artifact IS the work target (P5, P6 pass today). The smallest complete fixes are the four signal additions and the hint argument.
- **Re-running the battery in this lineage to reproduce the aggregate.** The advisor runs through a daemon-backed CLI and its Python entry point that can write runtime state outside this lineage's write boundary; the phase-002 scratch tsv already records the full per-probe run with timestamps of the same tree, so the reproduction adds no evidence and risks a scope violation.

## Dead Ends

- Searching for the second false positive's path mechanism: N5's prompt names no file path ("gate-3 classifier", "research summary"), so its sk-code win is a signal-space effect rather than the path-owner pull; marked as the residual half of the mechanism and left for the advisor-owner phase rather than over-claimed here.

## Edge Cases

- Ambiguous input: "false positives where a file path in the prompt pulls routing" could describe all five negatives; the recorded run shows exactly two sk-code wins (N1, N5), and N5 has no file path — the interpretation chosen is the recorded one, with the N5 residual noted.
- Contradictory evidence: none; the battery's own triage documents the N1 shape.
- Missing dependencies: no reproduction run in this lineage (see Ruled Out); the recorded run is the evidence.
- Partial success: the battery aggregate, the mechanism and the hint gap are all confirmed; the N5 token-level cause is inferred. `Status: complete`.

## Questions Answered

- Q6: Why does the advisor battery score 13 of 17 with false positives where a file path in the prompt pulls routing, and why does the advisor never pass --surface-hint? — answered.

## Questions Remaining

- Q7 to Q10.

## Sources Consulted

- .skilled/skills/sk-code/manual-testing-playbook/skill-advisor-integration/advisor-probe-battery.md:27,30,37,41,49,53,60,115
- specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/scratch/after-sa001.tsv (all 22 rows)
- specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/implementation-summary.md:111
- specs/sk-code/011-sk-code-poinytail-based-refinement/002-surface-contract-alignment/goal.md:51
- .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:372
- .skilled/bin/compiled-route.cjs:36
- .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:99
- .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/001-sk-code/lib/canary-router.cjs
- .skilled/bin/tests/compiled-route-surface-hint.test.cjs:1
- .skilled/skills/sk-code/SKILL.md:74
- .skilled/skills/sk-code/shared/references/stack-detection.md:39
- specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/008-session-aware-tie-break/goal.md:95
- git:5cf062b021

## Assessment

- New information ratio: 0.85
- Questions addressed: Q6
- Questions answered: Q6

## Reflection

- What worked and why: the phase-002 scratch tsv is a full per-probe record of the same tree, so the brief's aggregate could be confirmed without re-running a daemon-backed tool; the handler chain to the hint was readable end to end.
- What did not work and why: N5's token-level cause could not be established without running the scorer against instrumentation, which would write outside the boundary; it is marked inferred with the residual named, not smoothed over.
- What I would do differently: for advisor issues, read the recorded probe outputs before the scoring code — the results file is the cheapest ground truth.

## Recommended Next Focus

Iteration 5: the document-claim and hook items — the 36 HVR hard blockers in `.skilled/skills/sk-code/SKILL.md` and the 500 ms hook stdin deadline against a 3 s host budget with no late-write test. Count the blockers read-only with the shipped scanner, read the deadline constants and the deadline test, and establish what is untested.
