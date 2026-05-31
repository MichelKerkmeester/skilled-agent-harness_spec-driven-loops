Deep-research iter 6/10 for packet .opencode/specs/system-spec-kit/027-xce-research-based-refinement.

READ FIRST: <packet>/spec.md (especially RQ6 + RQ8 reference for token measurement), prior iters 001-005.md.

ITER 6 FOCUS: RQ6 Steering Pattern Transfer. XCE uses static "ALWAYS call X FIRST. PREFER X over file reading" framing in steering files (external/steering/CLAUDE.md, kiro.md, opencode-prompt.txt). Our skill_advisor brief renderer (mcp_server/skill_advisor/lib/render.ts) currently surfaces "Confidence > 0.8 → MUST invoke" as a softer directive.

Question: What's the concrete render-layer change in lib/render.ts that adapts XCE's static "ALWAYS call X FIRST" pattern to our DYNAMIC advisor brief? Map intent → first-action across our 13 skills.

Examine:
- external/steering/CLAUDE.md, kiro.md, opencode-prompt.txt — capture exact mandate phrasing
- mcp_server/skill_advisor/lib/render.ts — current brief structure, line ranges where mandate would land
- existing 13 skills (.opencode/skills/) — what's the intent → primary-action for each?

CONSTRAINT: render-layer only. NO scorer surgery (lib/scorer/). Proposals only — no source modifications.

WRITE 3 ARTIFACTS:
1. <packet>/research/iterations/iteration-006.md
2. APPEND state.jsonl: {"type":"iteration","iteration":6,"newInfoRatio":<0..1>,"status":"complete","focus":"RQ6"}
3. <packet>/research/deltas/iter-006.jsonl

DELIVERABLES:
- ≥2 file:line cites from external/steering/* on mandate phrasing
- ≥2 file:line cites from skill_advisor/lib/render.ts on current rendering
- intent → first-action map (table, 13 skills)
- Proposed render-layer change with target line range in render.ts
- Verdict: ADOPT / ADAPT / DEFER / SKIP for first-action mandate
- Estimated LOC

NEXT iter focus: RQ7 Benchmark Methodology Transfer (lightest viable eval harness).
