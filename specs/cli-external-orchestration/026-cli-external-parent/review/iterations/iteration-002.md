# Iteration 002: Security

## Dimension

Security review of the planned cli-external and mcp-tooling hub migrations and the scoped cli-opencode dispatch documentation. The review concentrated on publication controls, fail-open enforcement, and authentication/configuration boundaries.

## Files Reviewed

- All review-scope plan, specification, and decision-record files under `125-cli-external-parent` and `126-mcp-tooling-parent`, using direct review and targeted security-boundary searches.
- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/skills/cli-opencode/README.md`
- `.opencode/skills/cli-opencode/references/cli_reference.md`
- `.opencode/skills/cli-opencode/references/destructive_scope_violations.md`
- `.opencode/skills/cli-opencode/changelog/v1.3.15.2.md`

## Findings by Severity

### P0

None.

### P1

#### R2-P1-001: Parallel-session quick-start publishes a session without the required confirmation gate

- File: `.opencode/skills/cli-opencode/README.md:78-87`
- Evidence: The copy-paste parallel-session recipe includes `--share`, and the accompanying text says it publishes a browser-accessible URL, but it does not require an explicit operator confirmation. The authoritative hard rule requires confirmation before `--share` (`.opencode/skills/cli-opencode/SKILL.md:19-22`), and the CLI reference says the URL exposes session contents (`.opencode/skills/cli-opencode/references/cli_reference.md:331-334`).
- Finding class: cross-consumer
- Scope proof: The README is a primary operator-facing invocation surface; it is the only scoped quick-start that presents the `--share` command as directly runnable.
- Affected surface hints: ["parallel detached dispatch", "session sharing", "operator confirmation"]
- Recommendation: Add an explicit confirmation prerequisite immediately before the `--share` recipe and make the sample conditional on confirmation having been obtained.
- Claim adjudication: Claim: a user can follow the published quick-start and expose a session without the documented consent gate. Evidence refs: `.opencode/skills/cli-opencode/README.md:78-87`, `.opencode/skills/cli-opencode/SKILL.md:19-22`, `.opencode/skills/cli-opencode/references/cli_reference.md:331-334`. Counterevidence sought: whether the recipe is labeled as post-confirmation-only. Alternative explanation: requesting a parallel detached session may imply consent. Final severity: P1. Confidence: 0.96. Downgrade trigger: the recipe is explicitly constrained to a previously confirmed share request or the execution surface enforces confirmation independently.

#### R2-P1-002: MCP cutover leaves a known authentication/configuration disagreement outside every release gate

- File: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md:109-114`
- Evidence: The plan identifies a live disagreement between the ClickUp skill's OAuth `mcp-remote` documentation and the registered `@clickup/mcp-server` configuration, but accepts merely documenting it as a deferred follow-up (`:137-143`, `:162-174`). The terminal cutover accepts completion after structural validation and stale-reference grep only, without either an authentication-boundary check or a named/remediable follow-up gate (`008-cutover-and-rollout/spec.md:103-138`).
- Finding class: cross-consumer
- Scope proof: The discrepancy bridges documentation, provider authentication, and the registered external MCP server; the final gate is the sole in-scope completion authority and does not test or block the mismatch.
- Affected surface hints: ["mcp-click-up authentication", "MCP registration", "operator documentation", "cutover gate"]
- Recommendation: Before declaring the hub canon-clean, either reconcile the OAuth/API-server contract or link a named follow-up with an owner and make cutover record the authenticated runtime path that was verified.
- Claim adjudication: Claim: the program can mark the moved ClickUp bridge complete while its documented and registered credential paths disagree. Evidence refs: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md:109-114`, `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md:137-143`, `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md:103-138`. Counterevidence sought: a terminal security check or named follow-up that validates the intended route. Alternative explanation: the two routes may be deliberately compatible profiles. Final severity: P1. Confidence: 0.88. Downgrade trigger: evidence that both routes are intentionally supported and share a documented, tested authentication contract, or a concrete security-gated follow-up is linked from cutover.

### P2

None.

## Traceability Checks

- Core `spec_code`: Partial. The cli-external program explicitly preserves and actively tests its fail-open dispatch-preflight hook (`004-onboard-cli-opencode/spec.md:92-95`, `008-cutover-and-rollout/spec.md:103-108`), but the scoped README share recipe conflicts with its own published hard rule.
- Core `checklist_evidence`: Deferred. The target is planning and documentation; execution-time checklists and runtime evidence are outside the declared review scope.
- Overlay `skill_agent`: Partial. The `--share` rule is consistent between `SKILL.md` and `cli_reference.md`, but is not propagated to the README recipe.
- Overlay `agent_cross_runtime`: Partial. The ClickUp mismatch crosses the skill documentation and external MCP registration boundary; no runtime authentication verification is specified at cutover.
- Security direction ruled out: the cli-external fail-open hook path has an active-trigger requirement at closeout, so the planning packet does not rely solely on a passive path check.

## SCOPE VIOLATIONS

None. No reviewed target was modified.

## Verdict

CONDITIONAL. Two P1 security findings require remediation or explicit, evidence-backed deferral before release readiness can be claimed.

## Next Dimension

Traceability: reconcile the scoped requirements, plans, terminal gates, and generated/registered artifacts for both parent programs.

Review verdict: CONDITIONAL
