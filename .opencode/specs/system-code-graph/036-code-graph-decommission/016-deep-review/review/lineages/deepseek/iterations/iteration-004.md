# Iteration 004: Maintainability — Patterns, Documentation, Quality

## Focus
Maintainability dimension: codebase pattern consistency, documentation quality, naming across agent mirrors, template completeness, and cross-runtime parity. Scanned: agent mirror pairs, 016-deep-review docs, 015 closeout docs.

## Scorecard
- Dimensions covered: maintainability
- Files reviewed: 8
- New findings: P0=0 P1=0 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.160 (severity-weighted: 4 P2 x 1.0 = 4, cumulative total = 21)

## Findings

### P2, Suggestion

- **F014**: Agent mirror frontmatter uses different permission models across runtimes, `.opencode/agents/orchestrate.md:4-15` vs `.claude/agents/orchestrate.md:4`
  The `.opencode` orchestrator uses `permission:` with per-tool deny lists (list: deny, glob: deny, grep: deny, write: deny, edit: deny, bash: deny, patch: deny, webfetch: deny). The `.claude` orchestrator uses `tools:` with an allow list (`Read, Agent, mcp__mk_spec_memory__*`). These different permission models are runtime-appropriate but the conceptual models differ (deny-list vs allow-list). A reader unfamiliar with both runtimes could misinterpret one as more or less restrictive than the other. Dimension: maintainability.

- **F015**: Orchestrator agent mirrors diverge in Agent Files table references, `.opencode/agents/orchestrate.md:157` vs `.claude/agents/orchestrate.md:146`
  The `.opencode` version lists 8 agents with `.opencode/agents/` paths; the `.claude` version lists 7 agents with `.claude/agents/` paths. The `.opencode` version includes `@deep-review` as priority 6 in the routing table; the `.claude` version includes it at priority 6 but the Agent Files table below lists it the same way at line 151. The `.opencode` version has 814 lines, the `.claude` version 803 — the `.opencode` version has additional Agent I/O contract and Review Focus sections. These divergences are expected per-runtime variation but the routing table priority ordering is identical, which is the critical consistency property. Dimension: maintainability.

- **F016**: Plan.md, tasks.md, implementation-summary.md for 016-deep-review are unpopulated scaffold templates, `.opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/plan.md:1`, `tasks.md:1`, `implementation-summary.md:1`
  All three docs contain only `SPECKIT_TEMPLATE_SOURCE` markers and generic placeholder content like "[2-3 sentences: what this implements and the technical approach]". The spec.md is populated and specific, but plan/tasks/implementation-summary are still scaffolding. At Level 1, plan.md and tasks.md are required files — their scaffold state means the packet is not yet ready for implementation handoff. Expected since review is in progress. Dimension: maintainability.

- **F017**: 016-deep-review packet lacks a checklist.md despite being a decommission audit phase, `.opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/`
  The packet is Level 1 (< 100 LOC planned). checklist.md is only required at Level 2+. The spec correctly identifies Level 1. However, a deep review audit phase handling security-sensitive findings would benefit from at least a minimal checklist for acceptance-criteria verification. Purely advisory. Dimension: maintainability.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | n/a | hard | - | Iteration 3 covered |
| checklist_evidence | n/a | hard | - | Iteration 3 covered |

## Assessment
- New findings ratio: 0.160 (declining as expected with cumulative coverage)
- Dimensions addressed: maintainability (doc quality, naming, patterns)
- Novelty justification: F014-F015 document expected cross-runtime variations that are design-intentional. F016-F017 note scaffold/docs completeness at the expected stage.

## Ruled Out
- Agent mirror routing table drift: Verified both mirrors have identical priority ordering (1 context, 2 deep-research, 3 ai-council, 4 markdown, 5 review, 6 deep-review, 7 code, 8 debug).
- Template marker leakage: `SPECKIT_TEMPLATE_SOURCE` markers are standard in this framework. Not a defect.

## Dead Ends
None.

## Recommended Next Focus
Coverage/verification pass: revisit any residual code-graph patterns, verify breadth of review across all four dimensions, confirm the "only inert string literals" claim one more time with a broader sweep, and prepare for synthesis.

```json
{"findingId":"F014","claim":"Agent mirror frontmatter uses deny-list vs allow-list permission models across runtimes.","evidenceRefs":[".opencode/agents/orchestrate.md:4-15",".claude/agents/orchestrate.md:4"],"counterevidenceSought":"Verified both are runtime-appropriate — deny-list for opencode, allow-list for claude. No security gap.","alternativeExplanation":"Each runtime has its own tool-surface. Deny-list and allow-list are both valid with the same effect for this agent.","finalSeverity":"P2","confidence":0.88,"downgradeTrigger":"None — this is a readability note, not a defect.","transitions":[]}
```
```json
{"findingId":"F015","claim":"Orchestrator agent mirrors have expected per-runtime content divergences but shared priority ordering.","evidenceRefs":[".opencode/agents/orchestrate.md:157",".claude/agents/orchestrate.md:146"],"counterevidenceSought":"Compared routing priority tables — identical priority ordering across both mirrors.","alternativeExplanation":"Expected — each mirror references its own runtime's agent paths and tool surface.","finalSeverity":"P2","confidence":0.92,"downgradeTrigger":"None — this documents expected per-runtime mirror behavior.","transitions":[]}
```
```json
{"findingId":"F016","claim":"Plan.md, tasks.md, and implementation-summary.md for 016-deep-review are unpopulated scaffold templates.","evidenceRefs":[".opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/plan.md:1",".opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/tasks.md:1",".opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/implementation-summary.md:1"],"counterevidenceSought":"Checked all three files — confirmed scaffold-only content.","alternativeExplanation":"Expected — packets are populated as work progresses. Review phase 016 is the last phase; these docs should be filled after review completes.","finalSeverity":"P2","confidence":0.95,"downgradeTrigger":"When review completes and docs are populated, this resolves.","transitions":[]}
```
```json
{"findingId":"F017","claim":"016-deep-review packet lacks checklist.md though it is not required at Level 1.","evidenceRefs":[".opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/spec.md:39"],"counterevidenceSought":"Verified Level 1 specification from spec.md metadata — checklist.md is not mandatory at this level.","alternativeExplanation":"The packet correctly identifies as Level 1. Checklist is optional and the spec's success criteria serve the same function.","finalSeverity":"P2","confidence":0.90,"downgradeTrigger":"If the packet is elevated to Level 2, add checklist.md.","transitions":[]}
```

Review verdict: PASS
