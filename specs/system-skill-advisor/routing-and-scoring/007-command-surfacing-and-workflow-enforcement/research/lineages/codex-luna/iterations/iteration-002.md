# Iteration 2: Command scoring and lane boundaries

## Focus

Investigate Angle 2 after the inventory pass: how command and skill intent combine, how plain-chat versus typed-command evidence affects score, and where route eligibility and action policy enter. The reducer's current Next Focus still points to Q1 on inventory authority, while the dispatch names ten ordered angles; I followed the explicit next angle and folded route-eligibility evidence into this scoring pass. Q1 remains open for a later cross-angle synthesis.

## Findings
1. The scorer subtracts 0.08 from command recommendations only in the sort comparator when the prompt contains no slash. Typed slash evidence has its own 0.55 explicit-lane floor, and graph support borrowed by a slash-anchored seed is capped below that seed. This supports distinct command-intent treatment, but contradicts using the -0.08 adjustment as either eligibility or authorization: it only adjusts ordering. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:548-570] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1196-1204]

2. The projection type makes routingEnabled optional, and scoringCommandBridges filters only entries explicitly marked false. The recommendation is to preserve three states—active, disabled and unspecified—when cataloging commands, so an absent status cannot silently mean a verified runnable route. The filtering helper supports using this flag; its permissive treatment of missing values contradicts a strict active-only interpretation. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:62-66] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:1239-1242]

3. AGENTS Gate 2 turns confidence into workflow behavior: at 0.8 or higher the skill must be invoked; below that the general approach applies; user-named skills are explicit direction. Gate 4 says the skill-owned workflow beats executor choice and resolves command-spec-kit against cli-* in favor of the command workflow. This supports a policy layer downstream from scoring. It also contradicts a score-only policy because direct user direction and workflow ownership can determine the route. [SOURCE: AGENTS.md:63-70] [SOURCE: AGENTS.md:86-89]

4. The read-only route gate rejects explicit no-edit requests first, then allows a named skill; an unnamed command's own trigger phrase lifts the route only when the command has readOnly true. This supports effect-aware routing, but the named-skill exception and the lack of a complete confirmation contract contradict treating this helper as a universal run-or-ask decision. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:673-690]

5. Bridge documentation requires manual entries in separate TypeScript and Python compatibility lists and describes different doctor matching paths; it also says source rows use equal inventoryId/id values. The Python deep-research entry instead has inventoryId command-deep-research and id command-spec-kit-deep-research, while its owning skill is deep-research. A shared command model should retain canonical identity, runtime aliases and per-runtime adapters. The separate lists support runtime-specific adapters; the stated equality rule and actual row contradict collapsing the fields into one key. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:58-64] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:368-387]

## Ruled Out

- Using the command ranking adjustment as an authorization rule; it appears only in result ordering.
- Treating command-file presence as proof of an eligible route; projection has explicit disabled states, and compatibility rows can diverge by runtime identity.

## Dead Ends

- None established. Plain-chat ranking quality and cross-runtime recall remain unmeasured.

## Edge Cases

- Ambiguous input: Strategy Next Focus says Q1 inventory authority, but the dispatched research topic explicitly orders the next angle as scoring. Followed Angle 2; Q1 remains open.
- Contradictory evidence: Config has top-level stopPolicy max-iterations and antiConvergence.stopPolicy fail-closed. The dispatch explicitly requires running to the cap and terminal stopReason maxIterationsReached, so that instruction governs this lineage.
- Contradictory evidence: Bridge README says id equals inventoryId for compatibility rows, but the Python deep-research row differs.
- Missing dependencies: None for this angle.
- Partial success: Existing score and gate mechanics are identified; acceptable precision/recall and invocation calibration require the measurement angle.

## Sources Consulted

- .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:548-570, 660-690, 1196-1204
- .skilled/skills/system-skill-advisor/runtime/lib/scorer/projection.ts:62-66, 1239-1242
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/README.md:58-64
- .skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/scoring-compatibility.json:368-387
- AGENTS.md:63-70, 86-89
- specs/system-skill-advisor/routing-and-scoring/007-command-surfacing-and-workflow-enforcement/research/lineages/codex-luna/deep-research-strategy.md:166-167

## Assessment

- New information ratio: 0.70 (two findings are new to scoring and action-policy boundaries; three extend the inventory model).
- Questions addressed: scoring signals, bridge eligibility and scoring-versus-action boundaries.
- Questions answered: None fully. Scoring behavior is mapped, but recall, precision and confirmation thresholds await measurement and output-contract review.

## Reflection

- What worked and why: Bounded source reads exposed the actual ordering adjustment, eligibility helper and AGENTS action thresholds; this separates ranking facts from workflow policy.
- What did not work and why: The first state path included an extra research/ directory and the initial broad grep returned excessive context; correcting to the lineage-root files and narrowing to exact line windows resolved both.
- What I would do differently: Compare each scorer lane against its final recommendation contract and runtime invocation surface before drawing a system-wide conclusion.

## Recommended Next Focus

Angle 3: inspect render.ts and existing recommendation formats to define what a surfaced command must show, including command identity, runnable string, owner skill, confidence, effects, and whether the workflow will run or ask.
