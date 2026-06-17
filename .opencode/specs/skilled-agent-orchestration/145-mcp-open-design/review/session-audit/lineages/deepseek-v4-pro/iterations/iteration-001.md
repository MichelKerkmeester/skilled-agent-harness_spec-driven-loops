# Iteration 001: Correctness

## Focus
**Dimension**: Correctness — Logic errors, broken invariants, wrong claims, contradictions  
**Files reviewed**: `.opencode/skills/mcp-open-design/SKILL.md`, `.opencode/skills/mcp-open-design/references/od_cli_reference.md`, `.opencode/skills/mcp-open-design/references/mcp_wiring.md`, `.opencode/skills/mcp-open-design/references/tool_surface.md`, `.opencode/skills/sk-interface-design/SKILL.md`, `.opencode/skills/sk-interface-design/references/claude_design_parity.md`

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 6
- New findings: P0=0 P1=1 P2=4
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.00

## Findings

### P1, Required
- **F001**: mcp-open-design SKILL.md frontmatter version is stale (1.1.0, not 1.2.0), `.opencode/skills/mcp-open-design/SKILL.md:9`, The skill frontmatter declares `version: 1.1.0` but the changelog `v1.2.0.0.md` exists at `.opencode/skills/mcp-open-design/changelog/v1.2.0.0.md` and the phase 008 implementation summary at `.opencode/specs/skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/008-mcp-magicpath-deprecation/implementation-summary.md:61` claims "mcp-open-design bumped v1.1.0 to v1.2.0." The changelog was created but the frontmatter `version` field was not updated. This means automated version readers (advisor, package checker) see the wrong version, and the live skill contract under-reports its release level.

- **Claim adjudication packet:**
```json
{
  "findingId": "F001",
  "claim": "mcp-open-design SKILL.md frontmatter still shows version 1.1.0 despite changelog v1.2.0.0 existing and phase 008 claiming a bump to 1.2.0.",
  "evidenceRefs": [
    ".opencode/skills/mcp-open-design/SKILL.md:9",
    ".opencode/skills/mcp-open-design/changelog/v1.2.0.0.md:1-26",
    ".opencode/specs/skilled-agent-orchestration/150-open-design-terminal-and-interface-integration/008-mcp-magicpath-deprecation/implementation-summary.md:61"
  ],
  "counterevidenceSought": "Read the SKILL.md frontmatter (line 9 confirms 1.1.0), listed the changelog directory (v1.2.0.0.md present), checked graph-metadata.json (references v1.2.0.0.md), read the changelog content (describes v1.2.0.0 release).",
  "alternativeExplanation": "The version bump could be intentional because the v1.2.0 changelog describes only reference-hygiene edits (dropping mcp-magicpath mentions, no behavioral change), and the author may have decided the SKILL.md change didn't warrant a version bump — but the implementation summary explicitly claims the bump happened.",
  "finalSeverity": "P1",
  "confidence": 0.92,
  "downgradeTrigger": "If the version field was intentionally left at 1.1.0 because v1.2.0 is a reference-only patch and the implementation summary's claim is aspirational, downgrade to P2 (documentation drift).",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery — version field contradicts spec claim of bump" }
  ]
}
```

### P2, Suggestion
- **F002**: Internal evidence-tag inconsistency between `od_cli_reference.md:242` and `mcp_wiring.md:65`, `.opencode/skills/mcp-open-design/references/od_cli_reference.md:242` and `.opencode/skills/mcp-open-design/references/mcp_wiring.md:65`, The CLI reference Section 7 item 8 marks the daemon-down install-fallback behavior as "needs live verification" (uncertain), while the wiring reference describes the same fallback as CONFIRMED behavior. Two reference docs in the same skill diverge on whether the same question is resolved. The wiring doc says the installer falls back to `{command:"od", args:[...], env:{}}` and tags it CONFIRMED; the CLI ref still lists it as an open uncertainty item. An agent reading both will get contradictory confidence signals.

- **F003**: `tool_surface.md` doesn't classify `od mcp live-artifacts` tools, `.opencode/skills/mcp-open-design/references/tool_surface.md` and `.opencode/skills/mcp-open-design/references/od_cli_reference.md:144`, The CLI reference documents `od mcp live-artifacts` and `od tools live-artifacts` on the verb table but the tool_surface.md classification (read-only/mutating/destructive) doesn't mention live-artifacts at all. This creates a gap: an agent reading only tool_surface.md to gate verbs would not know that live-artifacts has mutating members (`create`, `update`, `refresh`) that need gating.

- **F004**: DESIGN_INTENTS declared but unused in routing pseudocode, `.opencode/skills/mcp-open-design/SKILL.md:113-116`, The SKILL.md routing section declares `DESIGN_INTENTS = {"READ", "RUN"}` with a comment: "Also load sk-interface-design and apply its principles before deciding." But the `route_open_design_resources()` pseudocode function never references `DESIGN_INTENTS` and never loads the cross-skill. The comment describes a contract the code doesn't deliver. This is pseudo-code, but the intent-signaling gap could cause an implementer to miss the cross-skill loading requirement.

- **F005**: Fidelity check loop has an automation gap at the inspection step, `.opencode/skills/sk-interface-design/references/claude_design_parity.md:83`, The parity protocol says "open the previewUrl to inspect the render" as step 4 (fidelity check) but neither `mcp-open-design` nor `sk-interface-design` documents an agent-side mechanism to open a URL in a browser for inspection. The `mcp-chrome-devtools` skill is mentioned for dev-server UIs controlled by sk-code (Section 5, line 84), but for Open Design's local `previewUrl`, no tool is prescribed. The protocol describes a loop step the agent can't fully automate.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | not_executed | hard | — | Cross-ref deferred to traceability iteration |
| checklist_evidence | not_executed | hard | — | Deferred |

## Assessment
- New findings ratio: 1.00 (all 5 findings are new, no prior findings to refine)
- Dimensions addressed: correctness
- Novelty justification: First iteration — all findings are first discovery. F001 is a spec-vs-code drift; F002 is internal inconsistency; F003 is a coverage gap; F004 is declared-but-unimplemented logic; F005 is an automation gap.

## Ruled Out
- Version bump omission as intentional: considered but the implementation summary explicitly claims the bump happened. The changelog exists. The frontmatter was simply missed.
- `design_principles.md` or `ux_quality_reference.md` correctness: read both, no logic errors or wrong claims found. Claims are design guidance, not testable invariants.

## Dead Ends
- None in this iteration.

## Recommended Next Focus
**Dimension**: Security  
**Rationale**: The skills involve CLI invocation, environment variables, and MCP server configuration. Review for secrets exposure, unsafe `exec` patterns, trust-boundary violations, and hardcoded paths that could enable injection.

Review verdict: CONDITIONAL
