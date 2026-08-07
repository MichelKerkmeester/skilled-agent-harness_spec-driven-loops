## Dimension

cross-runtime-mirror-consistency

## Files Reviewed

- `.opencode/skills/sk-code-review/references/review_core.md:18`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/resource-map.md:131`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/resource-map.md:133`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/resource-map.md:135`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/resource-map.md:137`
- `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-template-levels/003-manifest-template-implementation-plan/resource-map.md:146`
- `.opencode/agents/create.md:141`
- `.opencode/agents/context.md:64`
- `.opencode/agents/debug.md:89`
- `.opencode/agents/deep-research.md:295`
- `.opencode/agents/deep-review.md:229`
- `.opencode/agents/improve-agent.md:46`
- `.opencode/agents/improve-prompt.md:69`
- `.opencode/agents/orchestrate.md:87`
- `.opencode/agents/review.md:70`
- `AGENTS.md:327`
- `CLAUDE.md:327`

## Findings by Severity (P0/P1/P2)

### P0

None.

### P1

#### DR-005-P1-001 - `@create` agent prompt was missed by the cross-runtime agent vocabulary cleanup

- File: `.opencode/agents/create.md:141`
- Claim: The create agent remains on the old `CAPABILITY SCAN` heading while the rest of the exposed agent mirror set has moved to `ROUTING SCAN`, leaving an AI-facing runtime surface inconsistent with the ADR-005 cleanup.
- Evidence: The resource map says all AI-facing agent definitions under `.opencode/agents/` are in scope for the heading rename (`resource-map.md:131`, `resource-map.md:133`), but its enumerated agent list omits `.opencode/agents/create.md` (`resource-map.md:135-146`). Runtime mirrors expose `@create` as a first-class agent (`AGENTS.md:327`, `CLAUDE.md:327`). The file still contains `## 2. CAPABILITY SCAN` (`.opencode/agents/create.md:141`), while sampled sibling agent prompts use `ROUTING SCAN` (`.opencode/agents/context.md:64`, `.opencode/agents/debug.md:89`, `.opencode/agents/orchestrate.md:87`, `.opencode/agents/review.md:70`, `.opencode/agents/deep-review.md:229`, `.opencode/agents/deep-research.md:295`, `.opencode/agents/improve-agent.md:46`, `.opencode/agents/improve-prompt.md:69`).
- Counterevidence sought: Searched the scoped agent directory for `CAPABILITY SCAN` and `ROUTING SCAN`; only `create.md` retained the old heading among scanned routing sections. Checked root runtime mirrors to confirm `@create` is an exposed AI-facing agent, not a private orphan.
- Alternative explanation: The create agent may have been added after the original audit list, but `.opencode/agents/` is in the review scope and root mirrors advertise `@create`, so it inherits the same public-surface vocabulary requirement.
- Final severity: P1
- Confidence: 0.90
- Downgrade trigger: Downgrade only if maintainers explicitly classify `.opencode/agents/create.md` as outside AI-facing public-surface cleanup despite the root mirrors exposing `@create`, or if `capability` vocabulary is intentionally allowed for agent routing headings.
- Finding class: cross-consumer
- Scope proof: Directory-wide heading scan found the old heading in `create.md` and routing headings in the other sampled agent prompts; root instruction mirrors confirm the missed file is reachable through the same agent surface.
- Affected surface hints: `@create` prompt, agent routing docs, AGENTS/CLAUDE mirrors, workflow-invariance public-surface gate.
- Recommendation: Rename the `create.md` section heading to `ROUTING SCAN` and add `.opencode/agents/create.md` to the agent cleanup/resource-map coverage so future mirror scans include it.

### P2

None.

## Traceability Checks

- `agent_cross_runtime`: gap. Root runtime mirrors expose `@create`, but the `.opencode/agents/create.md` prompt was not synchronized with the agent heading vocabulary used by the rest of the prompt set.
- `spec_code`: gap. ADR-005/workflow-invariance cleanup requires public AI-facing surfaces to avoid private taxonomy vocabulary, and this AI-facing prompt still uses the old capability heading.
- `resource_map_coverage`: gap. No `applied/T-*.md` files were present to cross-check; direct scope audit shows the resource-map agent table omits an exposed agent file under the scoped `.opencode/agents/` directory.
- `overlay`: partial. Agent mirrors are mostly synchronized, but the create-agent mirror remains stale.

## Verdict

CONDITIONAL. This iteration adds one new P1 cross-runtime mirror finding and leaves the packet blocked until the exposed `@create` prompt is brought into the same vocabulary cleanup as the other agent prompts.

## Next Dimension

None. This is iteration 5 of 5.
