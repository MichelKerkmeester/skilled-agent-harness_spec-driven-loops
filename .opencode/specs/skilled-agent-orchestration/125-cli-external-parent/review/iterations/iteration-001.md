# Iteration 001

## Dimension

Correctness. Reviewed the two parent-hub planning programs and the scoped `cli-opencode` GPT-5.6 documentation for internally contradictory execution contracts and routing guidance.

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/spec.md:72-115`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision/decision-record.md:445-527`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision/plan.md:112-224`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/004-onboard-cli-opencode/spec.md:100-149`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/005-foldin-cli-claude-code/spec.md:102-153`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/006-advisor-and-integration/spec.md:102-152`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/spec.md:69-100`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:53-70`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/plan.md:113-231`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:67-148`
- `.opencode/skills/cli-opencode/SKILL.md:271-287`
- `.opencode/skills/cli-opencode/README.md:63-76,135-145`
- `.opencode/skills/cli-opencode/references/cli_reference.md:123-143`
- `.opencode/skills/cli-opencode/changelog/v1.3.15.2.md:47-60`

## Findings by Severity

### P0

None.

### P1

#### R1-P1-001: Published dispatch recipes contradict the authoritative top-level agent contract

- File: `.opencode/skills/cli-opencode/README.md:63-76`; `.opencode/skills/cli-opencode/references/cli_reference.md:123-143`
- Evidence: The README's default command passes `--agent context`, and the CLI reference includes `--agent <agent-slug>` in its default invocation. The scoped `SKILL.md` instead says not to pass a top-level agent by default and specifically directs callers to describe the role in the prompt unless live help has confirmed a direct agent route (`SKILL.md:277`).
- Finding class: cross-consumer
- Scope proof: A scoped `cli-opencode` search also found direct `--agent context` scenarios in the manual testing playbook, confirming this is a repeated contract rather than one isolated README typo.
- Affected surface hints: ["README quick start", "CLI reference default invocation", "manual testing recipes"]
- Recommendation: Establish one tested top-level agent policy, then make the README, CLI reference, and direct-agent test scenarios follow it. If direct specialist agents are unsupported, use the documented orchestration route or omit `--agent` in every canonical command.
- Claim adjudication: The contradictory instructions are directly observed. The live help exposes an `--agent` flag but does not prove that `context` is valid at the top level; the alternative explanation is that `SKILL.md` is stale. Downgrade to P2 only after an end-to-end direct `--agent context` dispatch is verified and the authoritative contract is amended consistently.

#### R1-P1-002: The sibling-boundary table directs OpenAI work to the wrong skill identity

- File: `.opencode/skills/cli-opencode/README.md:137-145`
- Evidence: The table assigns both the OpenCode and OpenAI provider rows to `cli-opencode`. The GPT-5.6 changelog confirms there is no `cli-copilot` skill under `.opencode/skills/` (`changelog/v1.3.15.2.md:60`), so the second row cannot describe an alternate installed dispatcher and tells readers to use the OpenCode skill for a distinct provider surface.
- Finding class: cross-consumer
- Scope proof: The sibling-boundary table is the user-facing "When to reach for it" router, so its provider-to-skill mapping is operational guidance rather than historical prose.
- Affected surface hints: ["README sibling boundaries", "provider selection", "cross-AI dispatch routing"]
- Recommendation: Replace the duplicate OpenAI row with the actual supported dispatch surface, or explicitly state that no installed sibling currently owns it. Do not present `cli-opencode` as the OpenAI dispatcher when it is documented as the OpenCode-runtime orchestrator.
- Claim adjudication: The duplicate row and the absence statement are directly observed. The alternative explanation is an intended future `cli-copilot` entry, but no such skill is present and the changelog labels its absence as current. Downgrade to P2 only if a real supported OpenAI dispatch path is documented and the table is shown to resolve through `cli-opencode` by design.

### P2

#### R1-P2-003: Phase 006's scope boundary contradicts its explicit metadata carve-out

- File: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:72,110,120`
- Evidence: The phase boundary says it does not touch `mcp-code-mode`, while the detailed scope requires modifying `mcp-code-mode/graph-metadata.json`. Later text explains the valid metadata-only exception, but the high-level boundary remains misleading.
- Recommendation: State the metadata-only reverse-edge carve-out in the scope-boundary sentence so a scope-locked executor does not skip the required edge repoint.

## Traceability Checks

- Core `spec_code`: Partial. Parent and phase plans consistently identify the relocation, hub metadata, and scorer/referrer contracts. The two P1 findings are in the scoped current cli-opencode documentation rather than proposed implementation code.
- Core `checklist_evidence`: Deferred. This iteration's review scope names plan/spec/decision files, not execution evidence or completed checklists.
- Overlay `skill_agent`: Partial. The cli-opencode agent-routing contract was cross-checked against its scoped README and CLI reference.
- Overlay `agent_cross_runtime`: Partial. The OpenCode versus OpenAI provider boundary was cross-checked against the GPT-5.6 changelog.
- Overlay `feature_catalog_code`: Deferred to traceability iteration.
- Overlay `playbook_capability`: Partial. Search located repeated direct-agent playbook scenarios; detailed playbook review is deferred to maintainability/traceability coverage.

## SCOPE VIOLATIONS

None. Reviewed targets were not modified.

## Verdict

CONDITIONAL. Two P1 documentation-contract defects can yield unsupported direct-agent invocations or misroute a user seeking an OpenAI dispatcher. No P0 defect was confirmed.

## Next Dimension

Security. Prioritize destructive-scope guarantees, runtime permission boundaries, and the planned hook/transport contracts.

Review verdict: CONDITIONAL
