# Iteration 4: Ownership, sequencing and interaction of the three fixes

## Focus

Cross-check the three findings: which packet owns each fix under the series goal, whether the fixes interact or collide, what order they should land in, and what verification each one costs. Also close the last key question and record what remains unresolved before a plan can be written.

## Actions Taken

1. Scanned every skill's `graph-metadata.json` `intent_signals` and `derived.trigger_phrases` for the candidate decision phrases and for near-collisions.
2. Read the graph compiler's export path and the freshness checker's comparison set.
3. Re-read the series goal's D1 and the 031 precedent's file list to settle ownership.
4. Compared the production files each fix touches and the tests each one needs.
5. Re-read the review report's `symlinked_queue_path_escape` finding against the proposed scoping fix.

## Findings

1. No existing skill declares any of the candidate decision phrases. The only competing vocabulary is `sk-design`'s description word "decision" and its "decision tree", "colour decision" and "color decision" signals. The candidate set ("as a decision", "decision record", "operator decision", "record my answer") does not overlap those phrases, and a phrase-boundary match on "as a decision" outranks sk-design's 1.0 corpus word. [SOURCE: .skilled/skills/sk-design/graph-metadata.json:48-80] [SOURCE: .skilled/skills/sk-design/SKILL.md:3]
2. The routing fix must refresh both compiled graph artifacts, not only the source metadata: `skill-graph.json` and the SQLite database the daemon reads. The freshness checker compares both against the on-disk `graph-metadata.json` files and reports `STALE COMPILED` when either is older. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:13] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py:1080] [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:48-49] [SOURCE: .skilled/commands/doctor/scripts/skill-graph-freshness.cjs:191]
3. Gap 1 belongs to a new packet in `specs/system-skill-advisor/` (next free number 034), not to a 043 child. Packet 031 fixed the same class of gap ("`environment variables` routes to nothing") by editing `.skilled/skills/system-spec-kit/graph-metadata.json` and filing under the advisor track, and 043's goal D1 freezes its children to the decision-capture pipeline, the writer or the save step. [SOURCE: specs/system-skill-advisor/031-routing-and-launcher-hardening/spec.md:40] [SOURCE: specs/system-skill-advisor/031-routing-and-launcher-hardening/spec.md:73] [SOURCE: specs/system-speckit/043-decision-capture/goal.md:44]
4. Gaps 2 and 3 belong to 043 children: both change the decision-capture pipeline, which D1 explicitly covers. Each is independently executable and independently verifiable, so one child each (008 for state scoping, 009 for chat evidence) gives clean closure; a single 008 is also consistent with 007's precedent of bundling several small fixes, but it makes two different proofs share one acceptance gate. [SOURCE: specs/system-speckit/043-decision-capture/goal.md:44] [SOURCE: specs/system-speckit/043-decision-capture/spec.md:117]
5. The fixes do not collide in code. Gap 2 changes `capture-core.mjs`, the writer, the api barrel and the matcher; gap 3 changes `chat-questions.mjs` and `save.md`. They share no file, so either order works. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:238-345] [SOURCE: .skilled/hooks/decision-capture/lib/chat-questions.mjs:120-217]
6. Gap 2 should land first: it changes where data lives and needs a migration note, while gap 3 only adds fields to candidates that are printed, not stored. Landing gap 3 first would add evidence to candidates whose queue rows may then move. [SOURCE: .skilled/hooks/decision-capture/lib/capture-core.mjs:305-345]
7. Gap 1 is independent of both and can ship in parallel on the advisor track. It should ship after gap 2, or at least point its DECISION intent at the save workflow that already carries the scoped behavior, so a newly routed request does not lead the operator into the shared-state bug. [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:42]
8. Verification cost is uneven. Gap 1: graph compile, `skill-graph-freshness.cjs --strict`, the 42-case regression corpus plus new decision cases, a short-prompt probe, and the doctor skill check. Gap 2: hooks `node --test` (the series goal's criterion 6), writer and matcher vitest suites, a two-project temp test, and the state README. Gap 3: chat-questions unit tests, a larger labeled set, and the save-step wording; no runtime write path. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl] [SOURCE: specs/system-speckit/043-decision-capture/goal.md:88]
9. The review report's `symlinked_queue_path_escape` finding is adjacent but not closed by the project token. The token scopes data; it does not enforce real-path containment. A strict containment check would reject every linked project, because the sanctioned `.skilled` symlink resolves outside the project root, so the gap-2 child must record that trade-off and decide whether to add a sanctioned-link exception or leave the review finding open. [SOURCE: specs/system-speckit/043-decision-capture/review/review-report.md:124-132]
10. Four items remain unresolved before a plan: gap 1's live advisor probe (the daemon writes outside this lineage, so it was not run), gap 2's behavior for pre-fix queue files, gap 3's false-reject rate on a larger labeled set, and whether the operator wants one 043 child or two. The workflow's graph convergence snapshot and pre-init `spec.md` mutation were also skipped because both write outside this lineage; the inline vote ran without a graph decision, which the composite rule allows when the decision is absent. [SOURCE: specs/system-speckit/043-decision-capture/goal.md:44]

## Ruled Out

- **Putting gap 1 in a 043 child.** D1 freezes 043 children to the pipeline, writer or save step; routing metadata is none of those, and 031 is the precedent owner.
- **Landing gap 3 before gap 2.** It would add evidence to candidate payloads while the queue rows they describe may move.
- **A strict real-path containment check as the gap-2 fix.** It would reject every linked project and disable capture there; the token scopes data without refusing the sanctioned install shape.
- **One combined child for gaps 2 and 3 with a single acceptance gate.** It hides two different proofs behind one closure verdict.

## Dead Ends

- Looking for an existing decision phrase in another skill's signals: none exists, so the collision check is a phrase-overlap check rather than a live routing comparison.
- Looking for a graph convergence snapshot path inside the lineage: the tool takes only `--spec-folder` and writes under the packet, outside this lineage.

## Edge Cases

- **Ambiguous input:** "which packet should own it" could mean the track or the exact folder. Chosen interpretation: the track plus the next free number, with the alternative (a 043 child) named and rejected on D1 evidence.
- **Contradictory evidence:** 007 bundled six fixes in one child, which argues for one combined child; the independent verification argument argues for two. Resolution: two is cleaner, one is acceptable if the operator prefers fewer packets; both are recorded.
- **Missing dependencies:** the live advisor probe and the graph snapshot are unavailable under the lineage write limit.
- **Partial success:** the collision check is structural (phrase overlap), not a live advisor run.

## Sources Consulted

- All `.skilled/skills/*/graph-metadata.json` files (scripted read)
- All `.skilled/skills/*/SKILL.md` frontmatter descriptions (scripted read)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_graph_compiler.py`
- `.skilled/commands/doctor/scripts/skill-graph-freshness.cjs`
- `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl`
- `specs/system-skill-advisor/031-routing-and-launcher-hardening/spec.md`
- `specs/system-speckit/043-decision-capture/goal.md`
- `specs/system-speckit/043-decision-capture/spec.md`
- `specs/system-speckit/043-decision-capture/review/review-report.md`

## Assessment

- New information ratio: 0.72
- Questions addressed: ownership, sequencing, interaction and verification cost.
- Questions answered: the final key question.

## Reflection

- What worked and why: scanning every skill's declared signals turned the collision risk from a guess into a phrase-overlap result, and the 031 precedent settled ownership without inventing a new convention.
- What did not work and why: looking for a graph convergence path inside the lineage. The tool's write target is the packet, so the inline vote had to run without it.
- What I would do differently: run the live advisor probe in a scratch checkout before the lineage, not inside it.

## Recommended Next Focus

All five key questions are answered. Synthesize the three fixes, their owners, the recommended order, the remaining open items, and the smallest change set into `research.md`.
