# Iteration 2: Security - Gating policy, auth guidance, credential handling

## Focus
D2 Security dimension. Reviewed the gating policy for mutating/destructive verbs in mcp-open-design, auth guidance, credential handling, and safety safeguards across both skills.

## Scorecard
- Dimensions covered: [security]
- Files reviewed: 5
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.20

## Findings

### P0, Blocker

(none)

### P1, Required

(none)

### P2, Suggestion

- **F004**: Auth requirements per verb are partially [INFERRED] in `od_cli_reference.md`. Items 5-6 in Section 7 list open questions about whether `start_run`, `media generate`, and `research search` need a logged-in `vela` account or `OD_TOOL_TOKEN` when invoked by a user (vs. a daemon-spawned agent). For a security-sensitive review, these should be resolved or explicitly documented as deferred with a tracking issue. `.opencode/skills/mcp-open-design/references/od_cli_reference.md:241-242`.

- **F005**: The `claude_design_parity.md` protocol's Section 8 guardrail states "No unsanctioned write-back. Open Design's mutating verbs are STOP-and-confirm points" but does not specify what constitutes "sanctioned" write-back. The guardrail could be tightened by defining the exact conditions under which write-back is permitted (e.g., explicit user approval per the mcp-open-design gating policy). `.opencode/skills/sk-design-interface/references/claude_design_parity.md:109`.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | pass | hard | Gating policy consistent across SKILL.md and references | |
| checklist_evidence | pass | hard | Phase 002 security checklist items checked | |
| feature_catalog_code | pass | advisory | Catalog correctly describes gating for all verbs | |
| playbook_capability | pass | advisory | Failure-path scenarios cover daemon-down and auth-error | |

## Assessment
- New findings ratio: 0.20 (two P2 at weight 1.0 each, total weighted new = 2.0, total = 10.0)
- Dimensions addressed: [security]
- Novelty justification: Auth gaps are known limitations documented in the implementation summaries. The parity protocol guardrail tightening is a minor clarification.

## Ruled Out
- No secrets or credentials found in any skill file or reference
- No unsafe URL patterns (the curl-to-shell warning is explicit and correct)
- The destructive verb safeguards (confirm:true, no active-project fallback) are sound

## Dead Ends
- Checked for hardcoded tokens, API keys, or credentials across all skill files: none found

## Recommended Next Focus
D3 Traceability: Cross-check spec.md normative claims against shipped implementation, verify checklist evidence, and check cross-reference integrity across all 8 phase children.

## Claim Adjudication Packets

```json
{
  "findingId": "F004",
  "claim": "Auth requirements per verb are partially inferred and 5 uncertainty items remain open in od_cli_reference.md.",
  "evidenceRefs": [
    ".opencode/skills/mcp-open-design/references/od_cli_reference.md:241-242",
    ".opencode/skills/mcp-open-design/references/od_cli_reference.md:233-244"
  ],
  "counterevidenceSought": "Checked if any of the 5 open items were resolved in later phases (007, 008). Phase 007 addressed generation flow but not auth. Phase 008 was a deprecation, not auth resolution.",
  "alternativeExplanation": "Could be intentional deferral since the skill works for the primary use case (daemon-spawned agent) without needing per-verb auth resolution. The uncertainty is documented honestly.",
  "finalSeverity": "P2",
  "confidence": 0.85,
  "downgradeTrigger": "If a live auth test confirms the verbs work without explicit tokens when invoked from a daemon-spawned agent, this becomes a documentation improvement only.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery: auth gaps are known documented limitations" }
  ]
}
```

```json
{
  "findingId": "F005",
  "claim": "claude_design_parity.md write-back guardrail uses 'unsanctioned' without defining what constitutes sanctioned write-back.",
  "evidenceRefs": [
    ".opencode/skills/sk-design-interface/references/claude_design_parity.md:109"
  ],
  "counterevidenceSought": "Checked the mcp-open-design SKILL.md gating policy for a definition of sanctioned write-back. The gating policy defines confirmation requirements but the parity protocol does not cross-reference it.",
  "alternativeExplanation": "The term 'unsanctioned' may be intentionally loose to allow future flexibility. The mcp-open-design gating policy provides the concrete requirements.",
  "finalSeverity": "P2",
  "confidence": 0.80,
  "downgradeTrigger": "If the parity protocol is updated to reference the mcp-open-design gating policy as the definition of 'sanctioned', this resolves.",
  "transitions": [
    { "iteration": 2, "from": null, "to": "P2", "reason": "Initial discovery: guardrail terminology could be tighter" }
  ]
}
```

Review verdict: PASS
