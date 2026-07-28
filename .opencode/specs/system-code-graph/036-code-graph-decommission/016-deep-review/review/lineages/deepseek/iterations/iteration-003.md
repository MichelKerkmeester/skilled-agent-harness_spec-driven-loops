# Iteration 003: Traceability — Spec/Code Alignment & Cross-Refs

## Focus
Traceability dimension: cross-reference spec.md claims (016-deep-review and parent 036 decommission) against implementation evidence. Audited closeout docs for 015-verification against actual diffs. Checked the "inert string literal" claim and completion status honesty.

## Scorecard
- Dimensions covered: traceability
- Files reviewed: 6 (parent spec.md, 015-verification/implementation-summary.md, doctor routes, trust-tree.ts, layer-definitions.ts
- New findings: P0=0 P1=1 P2=3
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.400 (severity-weighted: 1 P1 x 5.0 + 3 P2 x 1.0 = 8, cumulative total = 17)

## Findings

### P1, Required

- **F010**: 015 closeout claim "no live imports survive" is misleading when live code-graph signal handlers remain, `.opencode/specs/system-code-graph/036-code-graph-decommission/015-verification-and-closeout/implementation-summary.md:64` vs `.opencode/skills/system-spec-kit/mcp-server/lib/rag/trust-tree.ts:104-116`
  The closeout states "no live imports remain" from the `rg --hidden --no-ignore` sweep. However, `trust-tree.ts:104-116` has a live `codeGraphSignal()` function that processes `code_graph.readiness` signals — this is active production code in the `lib/` directory, not a test fixture or manifest. The function handles absent signals gracefully, but its presence means the codebase still contains code-graph-aware logic. The distinction: these reference the EXTERNAL `system_code_graph` MCP server's signals, not the decommissioned internal subsystem. The closeout claim should explicitly distinguish "no decommissioned internal imports" from "no code-graph references at all." Dimension: traceability.

### P2, Suggestion

- **F011**: Layer-definitions lists EXTERNAL code-graph tools but no tool list refresh was documented, `.opencode/skills/system-spec-kit/mcp-server/lib/architecture/layer-definitions.ts:115`
  `code_graph_scan`, `code_graph_status`, `code_graph_verify` listed as L3 tools. The decommission phase 008-009 should have refreshed tool lists. No evidence of a post-decommission audit confirming these are reachable from the external server. Dimension: traceability.

- **F012**: The 016-deep-review spec claims "two unrelated external models" but both lanes share the same skill tree, `.opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/spec.md:84`
  Line 84: "Have two unrelated external models independently audit." In practice, both the grok (cli-cursor) and deepseek (cli-opencode) lanes review the same repository with the same skill tree loaded. The models differ but the tool surface and codebase are identical. The "independently" claim is accurate per the fan-out architecture but could be read as implying different access surfaces. Dimension: traceability.

- **F013**: 016-deep-review implementation-summary.md is still a template scaffold, `.opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/implementation-summary.md:1`
  The file is the unpopulated `impl-summary-core` template with all placeholder content. This is expected at this stage (review in progress) but the `_memory.continuity.completion_pct: 0` and `Status: Not Started` in `spec.md` are correct and honest. No fabrication found. Dimension: traceability.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | trust-tree.ts:104-116 vs 015 closeout | Closeout claim of "no live imports" needs qualification for external-server references |
| checklist_evidence | partial | hard | 015 closeout states 3 accounted-for failures, honest reporting | Reported openly rather than hidden |

## Assessment
- New findings ratio: 0.400 (weighted new = 8, cumulative weighted = 17)
- Dimensions addressed: traceability with cross-reference protocol execution
- Novelty justification: F010 is the key finding — the 015 closeout claim is technically correct (no decommissioned internal imports) but the wording "no live imports survive" is overbroad when live code-graph signal handlers remain. F012 documents a minor spec ambiguity.

## Ruled Out
- Dishonest completion claims: The 015 closeout explicitly states 3 accounted-for failures in the full suite. This is honest reporting.
- Phantom findings from research phase: No evidence of fabrication found in any closeout doc.
- checklist_evidence protocol: No checklist.md exists for 016-deep-review (Level 1, no checklist required). Parent phase 015 has verification items with cited evidence.

## Dead Ends
None.

## Recommended Next Focus
Maintainability dimension: review codebase patterns, documentation quality, naming consistency across agent mirrors, and the clarity of the deep-review SKILL.md contract for this workflow.

```json
{"findingId":"F010","claim":"015 closeout claim 'no live imports survive' is overbroad — live code-graph signal handlers remain in production code.","evidenceRefs":[".opencode/specs/system-code-graph/036-code-graph-decommission/015-verification-and-closeout/implementation-summary.md:64",".opencode/skills/system-spec-kit/mcp-server/lib/rag/trust-tree.ts:104-116"],"counterevidenceSought":"Verified trust-tree.ts is in lib/ (production) not tests/. The codeGraphSignal function is active code. But it references EXTERNAL server signals, not the decommissioned internal module.","alternativeExplanation":"The closeout's 'no live imports' means no imports from the decommissioned internal module path. External server references are expected to remain.","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"If the closeout is amended to explicitly distinguish 'decommissioned internal imports' from 'external server references,' severity reduces to resolved.","transitions":[]}
```
```json
{"findingId":"F011","claim":"Layer-definitions lists external code-graph tool names but no post-decommission refresh audit is documented.","evidenceRefs":[".opencode/skills/system-spec-kit/mcp-server/lib/architecture/layer-definitions.ts:115"],"counterevidenceSought":"Checked phase 008-009 closeout docs for tool-list refresh evidence.","alternativeExplanation":"The external server is operational and these tool names resolve correctly at runtime.","finalSeverity":"P2","confidence":0.72,"downgradeTrigger":"If a tool-list audit shows resolution succeeds, this resolves.","transitions":[]}
```
```json
{"findingId":"F012","claim":"016-deep-review spec 'unrelated external models' wording could imply different access surfaces when both share the same repo.","evidenceRefs":[".opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/spec.md:84"],"counterevidenceSought":"Verified both lanes write only within their lineage directories. Access scope is identical.","alternativeExplanation":"The 'unrelated' refers to the model providers (Grok vs DeepSeek), not the access surfaces. No actual defect.","finalSeverity":"P2","confidence":0.90,"downgradeTrigger":"None — this is a wording note.","transitions":[]}
```
```json
{"findingId":"F013","claim":"016-deep-review implementation-summary.md is an unpopulated template scaffold.","evidenceRefs":[".opencode/specs/system-code-graph/036-code-graph-decommission/016-deep-review/implementation-summary.md:1"],"counterevidenceSought":"Verified scaffold — all sections contain template placeholders.","alternativeExplanation":"Expected at this stage — review is in progress, summary should be populated after completion.","finalSeverity":"P2","confidence":0.95,"downgradeTrigger":"When review completes and the summary is populated, this resolves.","transitions":[]}
```

Review verdict: CONDITIONAL
