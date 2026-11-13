# Iteration 4: Which candidate closes the measured gap at the lowest cost

## Focus
Question 4 of section 7: which candidate change closes the measured gap at the lowest cost. The operator's three candidates are hypotheses to test, not conclusions: (a) acceptance criteria at the parent spec level, (b) a user story or purpose-and-problem section at the parent level, (c) an improved parent-specific spec template. This iteration adds two evidence-supported candidates — a purpose field in the continuity block, and a purpose line in the compaction/resume surfaces — and ranks all five against the gap measured in iterations 1-3.

No `steer.md` exists in the lineage directory.

## Actions Taken
1. Measured parent-level artifact coverage: counted live phase parents (folders with two or more `NNN-*` children) and how many carry `goal.md` and `acceptance-criteria.md`.
2. Grepped for any reader of `goal.md` in the resume ladder, the hook tree and the continuity library.
3. Located the mechanism that lets a hook resolve the active packet without reading the transcript (`lastSpecFolder` in hook state).
4. Measured the ladder's read order to establish that the spec-doc snapshots are read even when a handover wins.
5. Counted edit points each candidate must touch, from the files already read in iterations 1-3.

## Findings
1. Parent-level purpose is already authored in two machine-readable carriers, and neither is the artifact the operator proposed. The phase-parent template carries `## 2. PROBLEM & PURPOSE` with Problem Statement and Purpose [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:63-72], and `goal.md` carries `## 1. DURABLE DIRECTIVE` with a one-sentence `**Objective:**` [SOURCE: .skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl:38-41]. In the live corpus there are 319 phase parents, of which 94 carry `goal.md` and only 10 carry `acceptance-criteria.md` [INFERENCE: measured by the parent walk described in Actions Taken, this iteration].
2. No hop reads `goal.md`. References to `goal.md` number 0 in `resume-ladder.ts`, 0 across `runtime/hooks/**`, and 0 in `runtime/lib/continuity/**` [INFERENCE: grep counts run this iteration over those three trees]. The durable directive is an authored purpose carrier with no reader, which places the gap on the read side rather than the authoring side.
3. Candidate (a), parent-level acceptance criteria, fails the gap test and costs the most. `acceptance-criteria.md` has no purpose column (AC-ID, REQ, Given/When/Then, Verification, Status, Waiver) [SOURCE: .skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl:57-66]; the phase level declares no optional addon docs, so enabling the file at parent level needs the level manifest, the `AC_CLOSURE` rule scope, `create.sh` seeding and the template — four or more edit points [SOURCE: .skilled/skills/system-spec-kit/templates/spec-kit-docs.json:1848] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh:1]. Only 10 of 319 parents carry the file today.
4. Candidate (b), a parent-level user story or purpose-and-problem section, is a no-op as written: the phase-parent template already has Problem & Purpose [SOURCE: .skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl:63-72], and iteration 1 measured that the phase validator exempts parents rather than requiring the section [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/validation/orchestrator.ts:963-970]. Adding the section again changes no artifact and crosses no hop; it becomes useful only when a hop reads it.
5. Candidate (c), an improved parent-specific template, cannot close the gap on its own for the same reason: the parent template already carries the purpose and the missing piece is a reader. A user-story block could ride along in the same edit as a read-side change, but as a standalone candidate it changes authoring only.
6. Candidate (d), a purpose field in the continuity block, is the most expensive. It needs the thin-record interface and its `MEMORY_0NN` validation, the compact serializer, the save writer's documented payload contract, the implementation-summary template and the resume parser, plus a fallback story for the 4,657 existing `implementation-summary.md` files that have no such field [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts:60-78; .skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts:170-181]. It also leaves the 29 handover-only packets uncovered.
7. Candidate (e), a purpose line in the compaction brief, is feasible and cheap on Claude: the active packet is resolvable without the transcript because `lastSpecFolder` is persisted in hook state [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts:345], so one extra file read supplies the purpose. It covers only the compaction hop, and pi/devin compose their own sections, so it needs per-runtime wiring [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:270-290].
8. Candidate (f), one purpose row on the resume surface, is the smallest change that closes the measured gap. The ladder already reads `spec.md` among its spec-doc snapshots before it chooses a primary tier [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:1128-1141], and its signal shape is one interface plus one renderer [SOURCE: .skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts:56-72; .skilled/commands/speckit/assets/speckit-resume-presentation.txt:116-129]. Cost: two files and one test — add `purpose` to the signal, extract `### Purpose` from the snapshot already in memory (falling back to an author-labelled `**Objective:**` line when present, of which the corpus has one example [SOURCE: specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/005-sk-deep-research-review-mode/handover.md:33]), and render a `Purpose:` row in the RESUME BRIEF. No schema change, no migration, no new authoring.
9. Candidate (f) is also the widest coverage per unit of effort, because every runtime's recovery surface already delegates to `/speckit:resume`: Claude's compaction output tells the session to run it [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts:135-170], dsh appends the same pointer [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs:122,126-142], and devin and pi emit `## Recovery\nRun /speckit:resume …` [SOURCE: .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs:266]. One read-side addition therefore reaches every hop the operator described, and it also fixes the misleading facet label from iteration 2 by making the real purpose available next to the next action.
10. Validation plan for the recommendation: a fixture test in `resume-ladder.vitest.ts` with a packet whose `spec.md` Purpose is filled (assert the signal carries it and the brief renders the row), a second fixture whose only carrier is `goal.md` (assert the objective is used), and a negative fixture with neither (assert the row is omitted rather than rendering "None"); then one manual `/speckit:resume` against this packet and a check that the rendered brief shows the purpose line [SOURCE: .skilled/skills/system-spec-kit/runtime/tests/resume-ladder.vitest.ts].

## Questions Answered
- Q4: Which candidate change closes the measured gap at the lowest cost? — Answered by findings 1-10: the gap is on the read side, so candidates (a), (b) and (c) either fail the gap test or cost more for less; (d) is the most expensive and still partial; (e) is cheap but narrow; (f), one purpose row on the resume surface sourced from already-read text, closes the measured gap with a two-file, no-migration change.

## Questions Remaining
5.

## Ruled Out
- Parent-level acceptance criteria as the closing change: no purpose column, only 10 of 319 parents have the file, and enabling it touches four or more edit points.
- A parent-level user story section as a standalone change: the parent template already has the purpose section, so the candidate is a no-op without a reader.
- A new continuity field as the cheapest option: it is the most expensive of the five and still leaves handover-only packets uncovered.

## Dead Ends
- Looking for a hop that already reads `goal.md`. None exists; the durable directive has no consumer today.

## Edge Cases
- Ambiguous input: the operator's candidates read as authoring changes, while the measurements locate the gap on the read side. The narrowest evidence-backed interpretation is taken: evaluate each candidate on whether it makes the purpose reachable by a successor, not on whether it adds another place to write it. The authoring-only reading is deferred.
- Contradictory evidence: iteration 1's declared-vs-executed phase-parent requirement stands; it is why candidate (b) is a no-op, not a repair.
- Missing dependencies: none.
- Partial success: none.
- Cost statements are estimates from the files read; they are marked as inference where they aggregate.

## Sources Consulted
- `.skilled/skills/system-spec-kit/templates/packet-types/phase-parent.spec.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/goal.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/addons/acceptance-criteria.md.tmpl`
- `.skilled/skills/system-spec-kit/templates/spec-kit-docs.json`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-closure.sh`
- `.skilled/skills/system-spec-kit/runtime/lib/resume/resume-ladder.ts`
- `.skilled/skills/system-spec-kit/runtime/lib/continuity/thin-continuity-record.ts`
- `.skilled/skills/system-spec-kit/runtime/cli/continuity/generate-context.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/hook-state.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`
- `.skilled/skills/system-spec-kit/runtime/hooks/dsh/session-compact-context.mjs`
- `.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs`
- `.skilled/commands/speckit/assets/speckit-resume-presentation.txt`
- `specs/system-deep-loop/z_archive/022-sk-deep-research-evolution/005-sk-deep-research-review-mode/handover.md:33`
- Parent-walk measurement over `specs/**/spec.md` (319 phase parents, 94 `goal.md`, 10 `acceptance-criteria.md`).

## Assessment
- New information ratio: 0.80
- Questions addressed: Q4
- Questions answered: Q4

## Reflection
- What worked and why: measuring which parent-level artifacts authors actually create. The 94-vs-10 split between `goal.md` and `acceptance-criteria.md` reorders the operator's candidates empirically, and the zero-reader count for `goal.md` moved the question from "where do we write it" to "who reads it".
- What did not work and why: treating the operator's candidates symmetrically at first. Two of them describe artifacts that already exist; only the third plus the alternatives compete on cost, so the comparison needed the measured coverage before it meant anything.
- What I would do differently: measure read coverage (who opens which file) before measuring authoring coverage, because a purpose that is written and never read is indistinguishable from an absent one at the hop.

## Recommended Next Focus
Q5: consolidate what is ruled out and why, including the authoring-only candidates, the continuity-field cost, and the saturations this lineage hit, and state the residual risks of the recommended read-side change.

## SCOPE VIOLATIONS
- None. Every write landed inside `research/lineages/deepseek-1/`.
