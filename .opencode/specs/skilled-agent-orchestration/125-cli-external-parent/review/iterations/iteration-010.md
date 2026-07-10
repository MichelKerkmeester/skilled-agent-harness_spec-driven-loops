# Iteration 010

## Dimension

Security. This final stabilization pass reviewed process isolation, session-publication consent, destructive-scope containment, fail-open enforcement, authentication drift, and the planned security gates across both parent programs and the current `cli-opencode` contract.

## Files Reviewed

- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/001-research-and-context/plan.md:1-175`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/001-research-and-context/spec.md:1-208`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision/decision-record.md:1-537`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision/plan.md:1-379`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/002-architecture-decision/spec.md:1-314`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/003-scaffold-hub/plan.md:1-173`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/003-scaffold-hub/spec.md:1-203`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/004-onboard-cli-opencode/plan.md:1-179`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/004-onboard-cli-opencode/spec.md:1-205`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/005-foldin-cli-claude-code/plan.md:1-181`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/005-foldin-cli-claude-code/spec.md:1-240`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/006-advisor-and-integration/plan.md:1-182`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/006-advisor-and-integration/spec.md:1-239`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/007-routing-benchmark-and-review/plan.md:1-175`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/007-routing-benchmark-and-review/spec.md:1-200`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/008-cutover-and-rollout/plan.md:1-178`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/008-cutover-and-rollout/spec.md:1-201`
- `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/spec.md:1-172`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/001-research-and-context/plan.md:1-174`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/001-research-and-context/spec.md:1-211`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:1-635`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/plan.md:1-385`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/spec.md:1-311`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/plan.md:1-174`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/spec.md:1-196`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md:1-173`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md:1-192`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/plan.md:1-175`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md:1-197`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/plan.md:1-180`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:1-212`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/plan.md:1-173`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md:1-194`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/plan.md:1-175`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md:1-194`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/spec.md:1-156`
- `.opencode/skills/cli-opencode/SKILL.md:1-459`
- `.opencode/skills/cli-opencode/README.md:1-220`
- `.opencode/skills/cli-opencode/references/cli_reference.md:1-379`
- `.opencode/skills/cli-opencode/references/destructive_scope_violations.md:1-174`
- `.opencode/skills/cli-opencode/changelog/v1.3.15.2.md:1-61`

## Findings by Severity

### P0

None.

### P1

#### R10-P1-001: Broad process kill can terminate unrelated operator-owned OpenCode sessions

- **Claim**: The single-dispatch cleanup rule mandates `pkill -9 -f "opencode run"`, which matches every OpenCode run process owned by the user rather than only the child launched by the current dispatch. This directly contradicts the same skill's earlier rule to exclude operator-owned `opencode run` sessions from orphan cleanup. A compliant caller can therefore destroy unrelated sessions, lose unsaved in-session work, and break explicitly authorized parallel dispatches.
- **Evidence**: [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:337`] [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:351`]
- **Counterevidence sought**: A PID, process-group, session-id, lockfile, or ownership constraint narrowing the `pkill` command to the dispatcher spawned by the current invocation; none appears in the scoped `SKILL.md`, README, CLI reference, or destructive-scope playbook.
- **Alternative explanation**: The rule may assume no other `opencode run` process exists because dispatches are serialized, but the same paragraph permits explicitly authorized cross-skill parallel dispatches and cannot govern operator-owned sessions launched outside this skill.
- **Final severity**: P1.
- **Confidence**: 0.99.
- **Downgrade trigger**: Replace the broad pattern kill with tracked-child PID/process-group cleanup and verify that an unrelated sentinel `opencode run` process survives.
- **Finding class**: cross-consumer.
- **Scope proof**: Exact search found both the operator-owned-session prohibition and the contradictory broad kill in the same current skill; prior review artifacts contain no registered process-scope finding.
- **Affected surface hints**: `cli-opencode dispatcher`, `parallel detached sessions`, `operator-owned OpenCode sessions`, `deep-loop cleanup`.
- **Recommendation**: Capture the launched process PID/process group and terminate only that owned tree. Never use a user-wide `pkill -f "opencode run"` pattern for post-dispatch cleanup.

### P2

None new.

## Traceability Checks

- `spec_code`: partial. The scoped corpus is planning plus current skill documentation; runtime process ownership behavior is not implemented in the target, but the published cleanup command is directly actionable. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:337,351`]
- `checklist_evidence`: deferred. Execution checklists and completion evidence are outside the configured review-target files. [SOURCE: `.opencode/specs/skilled-agent-orchestration/125-cli-external-parent/review/deep-review-config.json:18-59`]
- `skill_agent`: covered. The current CLI skill contract was checked for session-publication, process-isolation, destructive-scope, and dispatch-agent boundaries.
- `agent_cross_runtime`: partial. The process-kill defect crosses the cli-opencode dispatcher and any concurrent OpenCode runtime owned by the operator.
- `feature_catalog_code`: deferred. No feature catalog is in the configured review scope.
- `playbook_capability`: deferred. No manual playbook is in the configured review scope.
- Structural graph search was unavailable for this pass because the code graph is stale and excludes spec files; direct reads and exact searches were used as the graphless fallback.

## Verdict

One new P1 security/reliability defect was substantiated. The iteration-level result is CONDITIONAL, and the existing registry findings remain active.

## Next Dimension

Maximum iteration count reached; proceed to reducer validation and synthesis.

Review verdict: CONDITIONAL
