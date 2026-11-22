# Iteration 005 - Correctness (cross-cutting second pass)

## Dispatcher
- Lineage: claude2, session fanout-claude2-1795299580084-7g6zan, generation 1
- Dimension: correctness
- Review focus coverage: covered the nested sub-track writer (`create.sh`) from the system-spec-kit commit, and the stage-1 advisor anchors (`explicit.ts`) from the "route at both advisor stages" commit. It then traced the iteration-1 P1 through both routing stages and into the hub SKILL.md's instruction for acting on the decision.
- Sources: steer.md absent.

## Files Reviewed
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh` (diff: `inspectLevel`, `maxSubTrackDepth`, multi-level refresh loop)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts` (diff: anchors repointed from `mcp-tooling` to `mcp-browser-use`, new `browser automation` anchor)
- `.skilled/skills/mcp-browser-use/SKILL.md:50-77,128`
- `.skilled/skills/mcp-browser-use/ROUTER.md:22,30,84,105`
- Live advisor: `.skilled/bin/skill-advisor.cjs advisor_recommend` on three browser prompts

## Findings by Severity

### P0 Findings
- None.

### P1 Findings
1. **(Refines R1-P1-001) The forbidden-word reject is reached end to end and the hub tells the agent to refuse** -- `.skilled/skills/mcp-browser-use/SKILL.md:62` -- Stage 1 routes correctly: `advisor_recommend` on "Debug the 403 Forbidden response in Chrome DevTools" ranks `mcp-browser-use` first at 0.95. The brief carries the hub's compiled decision `{"action":"reject","targets":[]}` from `router.cjs:107`. The hub SKILL.md then instructs "Act on the decision: `route` loads its targets, `clarify` and `defer` ask, `reject` refuses" (`SKILL.md:62`, restated at `ROUTER.md:105`). The legacy fallback applies only to a `servingAuthority: legacy` sentinel or an error, so it does not catch a reject. The iteration-1 downgrade trigger (a consumer that treats reject as fall-through) is therefore not met, and the finding stays P1 at higher confidence.
   Finding class: instance-only
   Scope proof: `router.cjs` and `SKILL.md` are both new in this branch; the reject is served live.
   Affected surface hints: `010-mcp-browser-use/lib/router.cjs:107`, hub `SKILL.md:62`, `ROUTER.md:105`, `fixtures/canary-cases.v1.json` forbidden-reject case
   Case: prompt "Debug the 403 Forbidden response in Chrome DevTools" reaches the hub at 0.95 and the agent is told to refuse it.

```json
{"type":"claim-adjudication","claim":"A valid browser-debug prompt mentioning HTTP 403 Forbidden is routed to the hub by the advisor, rejected by the compiled stage-2 router, and the hub contract instructs the agent to refuse.","evidenceRefs":[".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use/lib/router.cjs:107",".skilled/skills/mcp-browser-use/SKILL.md:62",".skilled/skills/mcp-browser-use/ROUTER.md:105"],"counterevidenceSought":"Looked for a fall-through on reject in SKILL.md and ROUTER.md; the only fallback is for a legacy sentinel or an error.","alternativeExplanation":"An agent may notice the refusal is spurious and route by hand, but the contract does not tell it to.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"A change that limits the forbidden sentinel to the constraints channel, or a hub rule that treats reject as defer, would resolve or downgrade this.","refines":"R1-P1-001"}
```

### P2 Findings
- None new.

## Traceability Checks
- spec_code: pass for the stage-1 claim. Prompts naming Chrome DevTools, Bladebro and Aside each put `mcp-browser-use` first (0.95, 0.9354, 0.8995), and their compiled decisions route `single` to the named mode, apart from the 403 case above.
- agent_cross_runtime: notApplicable. This branch adds no agent files.

## Integration Evidence
- `.skilled/bin/skill-advisor.cjs advisor_recommend` (read-only), three prompts, each with `mcp-browser-use` ranked first.

## Edge Cases
- `create.sh` with `--track mcp/mcp-browser-use/x/y` (more than three segments) is rejected by `subNames.length > maxSubTrackDepth`. The refresh loop stops at four segments (`[[ "$track" != */*/*/* ]]`) and refreshes each level from the deepest upward. No defect found.

## Confirmed-Clean Surfaces
- `create.sh` `inspectLevel` applies the same symlink, declaration and spec.md checks at every level and names the first failing level in its diagnostic.
- `explicit.ts`: every browser anchor that pointed at `mcp-tooling` now points at `mcp-browser-use`. The new `browser automation` anchor carries a negative `sk-code` weight.

## Ruled Out
- Stage-1 mis-routing of named browser tools away from the hub: ruled out by the advisor probes.

## Next Focus
- Max iterations reached; synthesis next.

Review verdict: CONDITIONAL
