# Iteration 15: Doctor-side graph validation exposure

## Focus

Determine whether /doctor:skill-advisor should expose skill_graph_validate through the native route metadata, or leave graph validation as an operator-facing CLI handoff.

## Actions Taken

- Read the externalized iteration state, strategy, and iteration-014 findings before selecting this focus.
- Compared the skill-advisor entry in _routes.yaml with the /doctor router's allowed-tool union and route-validator semantics.
- Compared the doctor-skill-advisor verification workflow with the live skill_graph_validate descriptor and its documented CLI parity.
- Performed no mutations against the researched command, doctor, or skill-advisor surfaces. The MCP memory-trigger probe was cancelled; local source contracts were sufficient for this focused decision.

## Findings

1. **P1 — The doctor route omits a live, read-only graph validator from both declarations that govern native tool reachability.** The skill-advisor route lists advisor_recommend, advisor_status, advisor_validate, advisor_rebuild, skill_graph_scan, skill_graph_query, and skill_graph_status, but not skill_graph_validate. The /doctor router frontmatter repeats the same omission. The router then resolves mcp_tools from _routes.yaml, and route validation only checks that route entries are a subset of the frontmatter union; omission is therefore invisible to the existing contract. [SOURCE: .opencode/commands/doctor/_routes.yaml:99-116; .opencode/commands/doctor/speckit.md:4,58-62; .opencode/commands/doctor/scripts/route-validate.py:14-20,285-303]

2. **P1 — The doctor workflow rebuilds the index and runs advisor tests, but does not run the structural graph validator.** Phase 4 is described as re-indexing and testing; its concrete steps call advisor_rebuild, capture counts, and run the advisor test suite. That verifies freshness and scorer behavior, but it does not exercise the documented checks for schema drift, broken edges, relation-weight bands, reciprocal symmetry, dependency cycles, or derived-freshness warnings. [SOURCE: .opencode/commands/doctor/assets/doctor-skill-advisor.yaml:318-331; .opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/skill-graph-validate.md:19-25]

3. **P1 — CLI-only validation is available, but it is the wrong primary contract for /doctor.** The skill-advisor implementation documents full parity between the daemon-backed CLI and all nine advisor tools, and read tools do not need the trusted mutation flag. However, /doctor's execution contract resolves the route's native mcp_tools and then executes the selected YAML; the route currently declares only a warm-only advisor_status CLI probe. A printed CLI command would be a useful fallback for daemon/MCP transport failure, not a substitute for native route exposure and workflow coverage. [SOURCE: .opencode/skills/system-skill-advisor/README.md:76-83; .opencode/skills/system-skill-advisor/SKILL.md:303-305,323-333; .opencode/commands/doctor/_routes.yaml:105-116; .opencode/commands/doctor/speckit.md:53-62]

4. **P2 — The smallest aligned change has three coordinated pieces, not one metadata line.** Add mcp__mk_skill_advisor__skill_graph_validate to the /doctor router frontmatter and the skill-advisor route entry, then call it in the doctor verification phase after the rebuild and before final reporting. Keep the CLI form as a warm-only fallback. Because the validator is read-only and the route is already classified as mutates for its scorer/metadata apply path, this does not weaken the route's mutation guard; it closes the diagnostic coverage gap. The route validator's K rule protects only read-only routes from known mutators, while its F rule enforces subset parity, so the new tool needs an explicit route-contract assertion if future completeness is desired. [SOURCE: .opencode/commands/doctor/scripts/route-validate.py:59-66,285-303,395-406; .opencode/commands/doctor/_routes.yaml:99-116; .opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts:60-63,125-137]

## Questions Answered

- **Should the doctor-side route expose skill_graph_validate through route metadata?** Yes. Declare the native tool in both the doctor router's allowed-tool union and the skill-advisor route's mcp_tools list, then invoke it explicitly in the verification phase.
- **Should the CLI handoff disappear?** No. Retain the daemon-backed CLI command as a warm-only fallback for transport-unavailable cases; it should not be the normal validation path.
- **Does this imply automatic advisor_rebuild or skill_graph_scan from a read-only route?** No. The route's existing rebuild remains an explicit, approval-gated mutation path; this finding concerns only adding a read-only validation call after the approved refresh.

## Questions Remaining

- What exact output fields and failure policy should the doctor presentation use for skill_graph_validate alongside graph_scan_report and advisor test results?
- Should route-contract tests assert tool-set completeness against the live advisor tool registry, or only assert the selected high-value tools and workflow handoff?
- Whether description.json should remain descriptive metadata rather than a vocabulary-validated projection.

## Ruled Out

- Retaining CLI-only validation as the canonical /doctor path; it leaves the route's native tool contract and workflow blind to structural graph failures.
- Auto-running advisor_rebuild or skill_graph_scan as an implicit side effect of a read-only diagnostic route; this remains ruled out by prior iterations.

## Sources Consulted

- .opencode/commands/doctor/_routes.yaml:99-116
- .opencode/commands/doctor/speckit.md:4,53-62
- .opencode/commands/doctor/assets/doctor-skill-advisor.yaml:318-331
- .opencode/commands/doctor/scripts/route-validate.py:14-20,59-66,285-303,395-406
- .opencode/skills/system-skill-advisor/mcp-server/tools/skill-graph-tools.ts:60-63,125-137
- .opencode/skills/system-skill-advisor/feature-catalog/mcp-surface/skill-graph-validate.md:19-25
- .opencode/skills/system-skill-advisor/README.md:76-83,144-154
- .opencode/skills/system-skill-advisor/SKILL.md:303-305,323-333

## Assessment

- New information ratio: 0.80
- Questions addressed: doctor route exposure versus CLI-only validation.
- Questions answered: one carried-forward focus question.
- Overall research remains open; this iteration resolves the route-level recommendation but does not implement it.

## Reflection

- What worked and why: comparing the route manifest, router resolution contract, workflow phase, and live tool descriptor separated declaration, execution, and fallback concerns.
- What did not work and why: the memory trigger MCP lookup was cancelled, so no additional indexed context was available; the local contracts were internally consistent for this question.
- What I would do differently: the next pass should inspect the existing static contract-test harness before choosing whether to enforce complete tool parity or only the new validation handoff.

## Next Focus

Trace the existing doctor/create contract-test harness and define the smallest assertion matrix for route frontmatter, _routes.yaml mcp_tools, and the skill-advisor verification handoff.

