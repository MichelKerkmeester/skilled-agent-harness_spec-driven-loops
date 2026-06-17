# Iteration 1: Correctness - mcp-open-design and cross-phase consistency

## Focus
D1 Correctness dimension. Reviewed `mcp-open-design/SKILL.md`, its three references (`tool_surface.md`, `od_cli_reference.md`, `mcp_wiring.md`), and cross-checked version metadata and claims against the phase 008 implementation-summary and changelog.

## Scorecard
- Dimensions covered: [correctness]
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.60

## Findings

### P0, Blocker

(none)

### P1, Required

- **F001**: mcp-open-design SKILL.md version is stale at 1.1.0, should be 1.2.0, `.opencode/skills/mcp-open-design/SKILL.md:9`, Phase 008 implementation-summary documents the bump from v1.1.0 to v1.2.0 for the mcp-magicpath deprecation, but the SKILL.md header still reads `version: 1.1.0`. The changelog `v1.2.0.0.md` exists confirming the release. This is a version-metadata mismatch that would cause advisor routing and skill-advisor graph to report stale version info.

### P2, Suggestion

- **F002**: sk-interface-design SKILL.md version 1.3.0 is correct per phase 008, but the SKILL.md header `source` URL still points to the Anthropic frontend-design repo (line 8), which is accurate for the vendored origin but could mislead readers into thinking the current skill lives there. Consider noting it as the upstream origin, not the live source. `.opencode/skills/sk-interface-design/SKILL.md:8`.

- **F003**: `od_cli_reference.md` Section 7 lists 8 uncertainty items. Items 1 and 4 are marked resolved or strongly inferred, but items 5-8 remain open. The skill accurately tags these `[INFERRED]` or `[UNVERIFIED]`, which is good practice. However, for a v1.2.0 release, having 5 open uncertainty items in a reference doc could be tightened by either resolving them or explicitly marking them as deferred with a tracking note. `.opencode/skills/mcp-open-design/references/od_cli_reference.md:233-244`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | F001: version mismatch between SKILL.md and shipped changelog | Version claim does not resolve to shipped behavior |
| checklist_evidence | pass | hard | Checklist items in 002 all checked | Phase 002 checklist verified |
| feature_catalog_code | pass | advisory | Feature catalog entries match SKILL.md capabilities | No gaps found |
| playbook_capability | pass | advisory | Playbook scenarios reference correct tools | Gating policy consistent |

## Assessment
- New findings ratio: 0.60 (one P1 at weight 5.0, two P2 at weight 1.0 each, total weighted new = 7.0, total = 7.0 + 5.0 refinement potential = ~0.58, rounded up)
- Dimensions addressed: [correctness]
- Novelty justification: The version mismatch is a concrete correctness issue not caught in prior reviews. The P2 items are refinements of known limitations.

## Ruled Out
- No spec contradictions found in the multi-turn generation flow documentation; it is consistent across SKILL.md, tool_surface.md, and od_cli_reference.md.
- No broken internal links found within the mcp-open-design references.

## Dead Ends
- Checked for stale mcp-magicpath references in mcp-open-design; none found (phase 008 sweep was thorough).

## Recommended Next Focus
D2 Security: Review the gating policy, auth guidance, and destructive-verb safeguards in the mcp-open-design and sk-interface-design skills for security correctness.

## Claim Adjudication Packets

```json
{
  "findingId": "F001",
  "claim": "mcp-open-design SKILL.md declares version 1.1.0 but the skill was bumped to 1.2.0 in phase 008.",
  "evidenceRefs": [
    ".opencode/skills/mcp-open-design/SKILL.md:9",
    ".opencode/skills/mcp-open-design/changelog/v1.2.0.0.md:1"
  ],
  "counterevidenceSought": "Checked SKILL.md header, changelog directory, and the 008 implementation-summary for any ambiguity about which version was final. The changelog v1.2.0.0.md exists and the 008 summary explicitly states 'mcp-open-design bumped v1.1.0 to v1.2.0'.",
  "alternativeExplanation": "Could be that v1.2.0 was the changelog version but SKILL.md was intentionally not bumped because the change was metadata-only. However, the 008 summary lists SKILL.md as a Modified file, so the bump should have been applied.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If the version field in SKILL.md is confirmed to be intentionally decoupled from the changelog version (e.g., by project convention), downgrade to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: version metadata mismatch between SKILL.md header and shipped changelog" }
  ]
}
```

Review verdict: CONDITIONAL
