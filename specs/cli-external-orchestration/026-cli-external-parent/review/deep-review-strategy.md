---
title: "Deep Review Strategy: Whole-program review: 125-cli-external + 126-mcp-tooling planning packets + cli-opencode GPT-5.6 rename"
description: "Review strategy for the sk-prompt parent-hub merge program + post-merge benchmark work."
---

# Deep Review Strategy

## Review Charter

- **Target**: `Whole-program review: 125-cli-external + 126-mcp-tooling planning packets + cli-opencode GPT-5.6 rename` (spec-folder)
- **Dimensions**: correctness, security, traceability, maintainability
- **Max Iterations**: 10
- **Convergence Threshold**: 0.1 (telemetry only — stop_policy=max-iterations)
- **Stop Policy**: max-iterations

## Scope Files

- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/001-research-and-context/plan.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/001-research-and-context/spec.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/002-architecture-decision/decision-record.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/002-architecture-decision/plan.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/002-architecture-decision/spec.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/003-scaffold-hub/plan.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/003-scaffold-hub/spec.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/plan.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/004-onboard-cli-opencode/spec.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/plan.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/006-advisor-and-integration/plan.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/006-advisor-and-integration/spec.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/007-routing-benchmark-and-review/plan.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/007-routing-benchmark-and-review/spec.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/plan.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md`
- `.opencode/specs/cli-external-orchestration/026-cli-external-parent/spec.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/001-research-and-context/plan.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/001-research-and-context/spec.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/plan.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/spec.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/plan.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/003-scaffold-hub/spec.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/plan.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/004-onboard-chrome-devtools/spec.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/plan.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/005-foldin-clickup-and-figma/spec.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/plan.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/plan.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/007-routing-benchmark-and-review/spec.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/plan.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md`
- `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/spec.md`
- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/skills/cli-opencode/README.md`
- `.opencode/skills/cli-opencode/references/cli_reference.md`
- `.opencode/skills/cli-opencode/references/destructive_scope_violations.md`
- `.opencode/skills/cli-opencode/changelog/v1.3.15.2.md`

## Cross-Reference Targets

- spec_paths: all 9 spec folders (parent + 001-008) under `.opencode/specs/cli-external-orchestration/026-cli-external-parent`
- code_paths: `.opencode/skills/sk-prompt/**`
- test_paths: `.opencode/skills/sk-prompt/*/manual_testing_playbook/**`, `.opencode/skills/sk-prompt/benchmark/**`

## Dimension Queue

1. correctness
2. security
3. traceability
4. maintainability

Iterations beyond dimension count re-cycle the queue for deeper passes (stop_policy=max-iterations mandates broadening rather than stopping).

## Known Context

resource-map.md not present; skipping coverage gate.

## Iteration 001 Update

- **Covered dimension**: correctness.
- **Findings**: P1 R1-P1-001 (contradictory top-level agent dispatch contract); P1 R1-P1-002 (OpenAI sibling-boundary misroute); P2 R1-P2-003 (mcp-code-mode scope-boundary wording conflicts with its metadata carve-out).
- **Traceability**: `spec_code` partial; `checklist_evidence` deferred because execution evidence is outside this iteration's plan/spec scope. `skill_agent`, `agent_cross_runtime`, and `playbook_capability` received partial coverage.
- **Next Focus**: security. Review destructive-scope and permission assumptions, fail-open hook behavior, and transport mutation boundaries.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 7
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### `agent_cross_runtime`: covered. Both program plans preserve stable runtime/configuration identities while relocating folder structures. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `agent_cross_runtime`: covered. Both program plans preserve stable runtime/configuration identities while relocating folder structures.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: covered. Both program plans preserve stable runtime/configuration identities while relocating folder structures.

### `agent_cross_runtime`: covered. The mcp-tooling design retains `code_mode` as an external registration and explicitly limits its metadata carve-out to reverse-edge repair. [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:460-465`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:105-121`] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `agent_cross_runtime`: covered. The mcp-tooling design retains `code_mode` as an external registration and explicitly limits its metadata carve-out to reverse-edge repair. [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:460-465`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:105-121`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: covered. The mcp-tooling design retains `code_mode` as an external registration and explicitly limits its metadata carve-out to reverse-edge repair. [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:460-465`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:105-121`]

### `agent_cross_runtime`: Covered. The plans preserve stable executor-kind strings and isolate path relocation from runtime model/provider behavior. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `agent_cross_runtime`: Covered. The plans preserve stable executor-kind strings and isolate path relocation from runtime model/provider behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: Covered. The plans preserve stable executor-kind strings and isolate path relocation from runtime model/provider behavior.

### `agent_cross_runtime`: Covered. The program plans preserve named executor identities and isolate the GPT-5.6 roster change from the planned hub migrations. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `agent_cross_runtime`: Covered. The program plans preserve named executor identities and isolate the GPT-5.6 roster change from the planned hub migrations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: Covered. The program plans preserve named executor identities and isolate the GPT-5.6 roster change from the planned hub migrations.

### `agent_cross_runtime`: Partial. The mcp-tooling plan retains the `mcp-code-mode` registration boundary and requires atomic graph migration before advisor rebuild. [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-122,146-148`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `agent_cross_runtime`: Partial. The mcp-tooling plan retains the `mcp-code-mode` registration boundary and requires atomic graph migration before advisor rebuild. [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-122,146-148`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: Partial. The mcp-tooling plan retains the `mcp-code-mode` registration boundary and requires atomic graph migration before advisor rebuild. [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:108-122,146-148`]

### `agent_cross_runtime`: partial. The planned scorer preserves executor-kind output strings, while the MCP plan preserves `mcp-code-mode` and name-keyed manual boundaries. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. The planned scorer preserves executor-kind output strings, while the MCP plan preserves `mcp-code-mode` and name-keyed manual boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. The planned scorer preserves executor-kind output strings, while the MCP plan preserves `mcp-code-mode` and name-keyed manual boundaries.

### `agent_cross_runtime`: partial. The process-kill defect crosses the cli-opencode dispatcher and any concurrent OpenCode runtime owned by the operator. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. The process-kill defect crosses the cli-opencode dispatcher and any concurrent OpenCode runtime owned by the operator.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. The process-kill defect crosses the cli-opencode dispatcher and any concurrent OpenCode runtime owned by the operator.

### `checklist_evidence`: deferred. Checklists and execution evidence are not named review targets. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `checklist_evidence`: deferred. Checklists and execution evidence are not named review targets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: deferred. Checklists and execution evidence are not named review targets.

### `checklist_evidence`: Deferred. Checklists are intentionally absent from the configured review scope. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `checklist_evidence`: Deferred. Checklists are intentionally absent from the configured review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Deferred. Checklists are intentionally absent from the configured review scope.

### `checklist_evidence`: deferred. Execution checklists and completion evidence are outside the configured review-target files. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/review/deep-review-config.json:18-59`] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `checklist_evidence`: deferred. Execution checklists and completion evidence are outside the configured review-target files. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/review/deep-review-config.json:18-59`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: deferred. Execution checklists and completion evidence are outside the configured review-target files. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/review/deep-review-config.json:18-59`]

### `checklist_evidence`: Deferred. Execution checklists and completion evidence are outside the declared review-target files. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: Deferred. Execution checklists and completion evidence are outside the declared review-target files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Deferred. Execution checklists and completion evidence are outside the declared review-target files.

### `checklist_evidence`: Deferred. Execution checklists and runtime evidence are outside the declared review-target files. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `checklist_evidence`: Deferred. Execution checklists and runtime evidence are outside the declared review-target files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: Deferred. Execution checklists and runtime evidence are outside the declared review-target files.

### `checklist_evidence`: deferred. Execution checklists are outside the named review-target files. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence`: deferred. Execution checklists are outside the named review-target files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: deferred. Execution checklists are outside the named review-target files.

### `checklist_evidence`: deferred. The configured review scope omits execution checklists and completed implementation evidence. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/review/deep-review-config.json:18-59`] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `checklist_evidence`: deferred. The configured review scope omits execution checklists and completed implementation evidence. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/review/deep-review-config.json:18-59`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: deferred. The configured review scope omits execution checklists and completed implementation evidence. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/review/deep-review-config.json:18-59`]

### `feature_catalog_code`: Deferred. No feature catalog is a configured review target. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `feature_catalog_code`: Deferred. No feature catalog is a configured review target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Deferred. No feature catalog is a configured review target.

### `feature_catalog_code`: deferred. No feature catalog is in the configured review scope. -- BLOCKED (iteration 10, 2 attempts)
- What was tried: `feature_catalog_code`: deferred. No feature catalog is in the configured review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: deferred. No feature catalog is in the configured review scope.

### `feature_catalog_code`: Deferred. No feature catalog is in the declared scope. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code`: Deferred. No feature catalog is in the declared scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Deferred. No feature catalog is in the declared scope.

### `feature_catalog_code`: deferred. No feature catalog is in the declared target. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `feature_catalog_code`: deferred. No feature catalog is in the declared target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: deferred. No feature catalog is in the declared target.

### `feature_catalog_code`: deferred. No feature catalog is within the declared review scope. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `feature_catalog_code`: deferred. No feature catalog is within the declared review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: deferred. No feature catalog is within the declared review scope.

### `feature_catalog_code`: Deferred. No feature catalog is within the declared target. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `feature_catalog_code`: Deferred. No feature catalog is within the declared target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: Deferred. No feature catalog is within the declared target.

### `playbook_capability`: deferred. No manual playbook is in the configured review scope. -- BLOCKED (iteration 10, 2 attempts)
- What was tried: `playbook_capability`: deferred. No manual playbook is in the configured review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: deferred. No manual playbook is in the configured review scope.

### `playbook_capability`: Deferred. No manual playbook is in the declared scope. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability`: Deferred. No manual playbook is in the declared scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: Deferred. No manual playbook is in the declared scope.

### `playbook_capability`: deferred. No manual playbook is in the declared target. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability`: deferred. No manual playbook is in the declared target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: deferred. No manual playbook is in the declared target.

### `playbook_capability`: deferred. No manual playbook is within the declared review scope. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `playbook_capability`: deferred. No manual playbook is within the declared review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: deferred. No manual playbook is within the declared review scope.

### `playbook_capability`: Deferred. No manual testing playbook is a configured review target. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability`: Deferred. No manual testing playbook is a configured review target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: Deferred. No manual testing playbook is a configured review target.

### `playbook_capability`: Deferred. No manual testing playbook is within the declared target. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `playbook_capability`: Deferred. No manual testing playbook is within the declared target.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: Deferred. No manual testing playbook is within the declared target.

### `skill_agent`: Covered. The `--share` confirmation rule is explicit in the current skill and reference documentation; the known README omission is already registered. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:19-22,354-358`] [SOURCE: `.opencode/skills/cli-opencode/references/cli_reference.md:331-334`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `skill_agent`: Covered. The `--share` confirmation rule is explicit in the current skill and reference documentation; the known README omission is already registered. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:19-22,354-358`] [SOURCE: `.opencode/skills/cli-opencode/references/cli_reference.md:331-334`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Covered. The `--share` confirmation rule is explicit in the current skill and reference documentation; the known README omission is already registered. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:19-22,354-358`] [SOURCE: `.opencode/skills/cli-opencode/references/cli_reference.md:331-334`]

### `skill_agent`: Covered. The cli-opencode runtime, sibling, model-roster, and destructive-scope contracts remain traceable across `SKILL.md`, README, reference, and changelog. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `skill_agent`: Covered. The cli-opencode runtime, sibling, model-roster, and destructive-scope contracts remain traceable across `SKILL.md`, README, reference, and changelog.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Covered. The cli-opencode runtime, sibling, model-roster, and destructive-scope contracts remain traceable across `SKILL.md`, README, reference, and changelog.

### `skill_agent`: Covered. The current `cli-opencode` contract and the proposed hub/scorer migration remain separated by explicit phase ownership. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `skill_agent`: Covered. The current `cli-opencode` contract and the proposed hub/scorer migration remain separated by explicit phase ownership.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: Covered. The current `cli-opencode` contract and the proposed hub/scorer migration remain separated by explicit phase ownership.

### `skill_agent`: covered. The current CLI skill contract was checked for session-publication, process-isolation, destructive-scope, and dispatch-agent boundaries. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `skill_agent`: covered. The current CLI skill contract was checked for session-publication, process-isolation, destructive-scope, and dispatch-agent boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: covered. The current CLI skill contract was checked for session-publication, process-isolation, destructive-scope, and dispatch-agent boundaries.

### `skill_agent`: covered. The current cli-opencode skill, README, and CLI reference identify the direct-agent and loop-owner boundaries. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `skill_agent`: covered. The current cli-opencode skill, README, and CLI reference identify the direct-agent and loop-owner boundaries.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: covered. The current cli-opencode skill, README, and CLI reference identify the direct-agent and loop-owner boundaries.

### `skill_agent`: covered. The current skill declares no-top-level-agent guidance, while the known contradictory recipes are already registered; no distinct correctness defect was found in this pass. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:271-287`] [SOURCE: `.opencode/skills/cli-opencode/README.md:63-76`] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `skill_agent`: covered. The current skill declares no-top-level-agent guidance, while the known contradictory recipes are already registered; no distinct correctness defect was found in this pass. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:271-287`] [SOURCE: `.opencode/skills/cli-opencode/README.md:63-76`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: covered. The current skill declares no-top-level-agent guidance, while the known contradictory recipes are already registered; no distinct correctness defect was found in this pass. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:271-287`] [SOURCE: `.opencode/skills/cli-opencode/README.md:63-76`]

### `skill_agent`: partial. The current `cli-opencode` agent-dispatch contract was cross-checked with the planned scorer and benchmark contracts. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `skill_agent`: partial. The current `cli-opencode` agent-dispatch contract was cross-checked with the planned scorer and benchmark contracts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: partial. The current `cli-opencode` agent-dispatch contract was cross-checked with the planned scorer and benchmark contracts.

### `spec_code`: partial. The reviewed corpus is planning and current CLI documentation; runtime move behavior is intentionally outside the configured targets. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `spec_code`: partial. The reviewed corpus is planning and current CLI documentation; runtime move behavior is intentionally outside the configured targets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The reviewed corpus is planning and current CLI documentation; runtime move behavior is intentionally outside the configured targets.

### `spec_code`: partial. The reviewed scope is planning and current skill documentation; the CLI scorer's atomic migration and both hub-validation routes are explicitly bound to runtime verification in their later phases. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: partial. The reviewed scope is planning and current skill documentation; the CLI scorer's atomic migration and both hub-validation routes are explicitly bound to runtime verification in their later phases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The reviewed scope is planning and current skill documentation; the CLI scorer's atomic migration and both hub-validation routes are explicitly bound to runtime verification in their later phases.

### `spec_code`: Partial. The reviewed target is planning plus current documentation; both cutover plans require strict validation and stale-reference sweeps, while the cli-external cutover adds an active fail-open hook test. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:105-110,130-137`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md:103-107,127-138`] -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code`: Partial. The reviewed target is planning plus current documentation; both cutover plans require strict validation and stale-reference sweeps, while the cli-external cutover adds an active fail-open hook test. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:105-110,130-137`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md:103-107,127-138`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Partial. The reviewed target is planning plus current documentation; both cutover plans require strict validation and stale-reference sweeps, while the cli-external cutover adds an active fail-open hook test. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/008-cutover-and-rollout/spec.md:105-110,130-137`] [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/008-cutover-and-rollout/spec.md:103-107,127-138`]

### `spec_code`: partial. The scoped corpus is planning plus current skill documentation, not the future moved runtime implementation. The cli-external scorer/dissolution contract remains atomic and has explicit parity, live-routing, and cutover consumers. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:141-146`] [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/007-routing-benchmark-and-review/spec.md:104-109`] -- BLOCKED (iteration 9, 1 attempts)
- What was tried: `spec_code`: partial. The scoped corpus is planning plus current skill documentation, not the future moved runtime implementation. The cli-external scorer/dissolution contract remains atomic and has explicit parity, live-routing, and cutover consumers. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:141-146`] [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/007-routing-benchmark-and-review/spec.md:104-109`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The scoped corpus is planning plus current skill documentation, not the future moved runtime implementation. The cli-external scorer/dissolution contract remains atomic and has explicit parity, live-routing, and cutover consumers. [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:141-146`] [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/007-routing-benchmark-and-review/spec.md:104-109`]

### `spec_code`: partial. The scoped corpus is planning plus current skill documentation; runtime process ownership behavior is not implemented in the target, but the published cleanup command is directly actionable. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:337,351`] -- BLOCKED (iteration 10, 1 attempts)
- What was tried: `spec_code`: partial. The scoped corpus is planning plus current skill documentation; runtime process ownership behavior is not implemented in the target, but the published cleanup command is directly actionable. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:337,351`]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The scoped corpus is planning plus current skill documentation; runtime process ownership behavior is not implemented in the target, but the published cleanup command is directly actionable. [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:337,351`]

### `spec_code`: Partial. The scoped target is planning and current skill documentation rather than shipped implementation. The cross-phase ownership and verification contracts were reviewed directly. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: Partial. The scoped target is planning and current skill documentation rather than shipped implementation. The cross-phase ownership and verification contracts were reviewed directly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Partial. The scoped target is planning and current skill documentation rather than shipped implementation. The cross-phase ownership and verification contracts were reviewed directly.

### `spec_code`: Partial. The target is a planning/documentation corpus; both programs trace final validation, rollback, and stale-reference gates into phase 008, but implementation evidence is outside scope. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `spec_code`: Partial. The target is a planning/documentation corpus; both programs trace final validation, rollback, and stale-reference gates into phase 008, but implementation evidence is outside scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: Partial. The target is a planning/documentation corpus; both programs trace final validation, rollback, and stale-reference gates into phase 008, but implementation evidence is outside scope.

### Core `checklist_evidence`: deferred. The declared iteration target is planning/specification and scoped runtime documentation; execution checklists and completion evidence are outside the named target files. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core `checklist_evidence`: deferred. The declared iteration target is planning/specification and scoped runtime documentation; execution checklists and completion evidence are outside the named target files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: deferred. The declared iteration target is planning/specification and scoped runtime documentation; execution checklists and completion evidence are outside the named target files.

### Core `checklist_evidence`: Deferred. The target is planning and documentation; execution-time checklists and runtime evidence are outside the declared review scope. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `checklist_evidence`: Deferred. The target is planning and documentation; execution-time checklists and runtime evidence are outside the declared review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: Deferred. The target is planning and documentation; execution-time checklists and runtime evidence are outside the declared review scope.

### Core `checklist_evidence`: Deferred. This iteration's review scope names plan/spec/decision files, not execution evidence or completed checklists. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core `checklist_evidence`: Deferred. This iteration's review scope names plan/spec/decision files, not execution evidence or completed checklists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `checklist_evidence`: Deferred. This iteration's review scope names plan/spec/decision files, not execution evidence or completed checklists.

### Core `spec_code`: Partial. Parent and phase plans consistently identify the relocation, hub metadata, and scorer/referrer contracts. The two P1 findings are in the scoped current cli-opencode documentation rather than proposed implementation code. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Core `spec_code`: Partial. Parent and phase plans consistently identify the relocation, hub metadata, and scorer/referrer contracts. The two P1 findings are in the scoped current cli-opencode documentation rather than proposed implementation code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: Partial. Parent and phase plans consistently identify the relocation, hub metadata, and scorer/referrer contracts. The two P1 findings are in the scoped current cli-opencode documentation rather than proposed implementation code.

### Core `spec_code`: partial. The cli-external phase-003 scaffold specification traces to the phase-005 scorer contract, but the staged `family: cli` identity conflicts with that contract's atomicity invariant. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Core `spec_code`: partial. The cli-external phase-003 scaffold specification traces to the phase-005 scorer contract, but the staged `family: cli` identity conflicts with that contract's atomicity invariant.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: partial. The cli-external phase-003 scaffold specification traces to the phase-005 scorer contract, but the staged `family: cli` identity conflicts with that contract's atomicity invariant.

### Core `spec_code`: Partial. The cli-external program explicitly preserves and actively tests its fail-open dispatch-preflight hook (`004-onboard-cli-opencode/spec.md:92-95`, `008-cutover-and-rollout/spec.md:103-108`), but the scoped README share recipe conflicts with its own published hard rule. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Core `spec_code`: Partial. The cli-external program explicitly preserves and actively tests its fail-open dispatch-preflight hook (`004-onboard-cli-opencode/spec.md:92-95`, `008-cutover-and-rollout/spec.md:103-108`), but the scoped README share recipe conflicts with its own published hard rule.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Core `spec_code`: Partial. The cli-external program explicitly preserves and actively tests its fail-open dispatch-preflight hook (`004-onboard-cli-opencode/spec.md:92-95`, `008-cutover-and-rollout/spec.md:103-108`), but the scoped README share recipe conflicts with its own published hard rule.

### Overlay `agent_cross_runtime`: partial. The cli-external scorer contract and the mcp-tooling `code_mode` carve-out were checked across their stated producer/consumer documents. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay `agent_cross_runtime`: partial. The cli-external scorer contract and the mcp-tooling `code_mode` carve-out were checked across their stated producer/consumer documents.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `agent_cross_runtime`: partial. The cli-external scorer contract and the mcp-tooling `code_mode` carve-out were checked across their stated producer/consumer documents.

### Overlay `agent_cross_runtime`: Partial. The ClickUp mismatch crosses the skill documentation and external MCP registration boundary; no runtime authentication verification is specified at cutover. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay `agent_cross_runtime`: Partial. The ClickUp mismatch crosses the skill documentation and external MCP registration boundary; no runtime authentication verification is specified at cutover.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `agent_cross_runtime`: Partial. The ClickUp mismatch crosses the skill documentation and external MCP registration boundary; no runtime authentication verification is specified at cutover.

### Overlay `agent_cross_runtime`: Partial. The OpenCode versus OpenAI provider boundary was cross-checked against the GPT-5.6 changelog. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay `agent_cross_runtime`: Partial. The OpenCode versus OpenAI provider boundary was cross-checked against the GPT-5.6 changelog.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `agent_cross_runtime`: Partial. The OpenCode versus OpenAI provider boundary was cross-checked against the GPT-5.6 changelog.

### Overlay `feature_catalog_code`: Deferred to traceability iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay `feature_catalog_code`: Deferred to traceability iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `feature_catalog_code`: Deferred to traceability iteration.

### Overlay `feature_catalog_code`: deferred. No feature catalog is in the declared review scope. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay `feature_catalog_code`: deferred. No feature catalog is in the declared review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `feature_catalog_code`: deferred. No feature catalog is in the declared review scope.

### Overlay `playbook_capability`: deferred. No playbook is in the declared review scope. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay `playbook_capability`: deferred. No playbook is in the declared review scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `playbook_capability`: deferred. No playbook is in the declared review scope.

### Overlay `playbook_capability`: Partial. Search located repeated direct-agent playbook scenarios; detailed playbook review is deferred to maintainability/traceability coverage. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay `playbook_capability`: Partial. Search located repeated direct-agent playbook scenarios; detailed playbook review is deferred to maintainability/traceability coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `playbook_capability`: Partial. Search located repeated direct-agent playbook scenarios; detailed playbook review is deferred to maintainability/traceability coverage.

### Overlay `skill_agent`: partial. `cli-opencode/SKILL.md` correctly states that direct top-level agent dispatch is restricted, but its README/reference/playbook surfaces still contain the previously recorded conflicting recipes. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Overlay `skill_agent`: partial. `cli-opencode/SKILL.md` correctly states that direct top-level agent dispatch is restricted, but its README/reference/playbook surfaces still contain the previously recorded conflicting recipes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`: partial. `cli-opencode/SKILL.md` correctly states that direct top-level agent dispatch is restricted, but its README/reference/playbook surfaces still contain the previously recorded conflicting recipes.

### Overlay `skill_agent`: Partial. The `--share` rule is consistent between `SKILL.md` and `cli_reference.md`, but is not propagated to the README recipe. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Overlay `skill_agent`: Partial. The `--share` rule is consistent between `SKILL.md` and `cli_reference.md`, but is not propagated to the README recipe.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`: Partial. The `--share` rule is consistent between `SKILL.md` and `cli_reference.md`, but is not propagated to the README recipe.

### Overlay `skill_agent`: Partial. The cli-opencode agent-routing contract was cross-checked against its scoped README and CLI reference. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Overlay `skill_agent`: Partial. The cli-opencode agent-routing contract was cross-checked against its scoped README and CLI reference.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlay `skill_agent`: Partial. The cli-opencode agent-routing contract was cross-checked against its scoped README and CLI reference.

### Security direction ruled out: the cli-external fail-open hook path has an active-trigger requirement at closeout, so the planning packet does not rely solely on a passive path check. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Security direction ruled out: the cli-external fail-open hook path has an active-trigger requirement at closeout, so the planning packet does not rely solely on a passive path check.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Security direction ruled out: the cli-external fail-open hook path has an active-trigger requirement at closeout, so the planning packet does not rely solely on a passive path check.

### Structural graph search was unavailable for this pass because the code graph is stale and excludes spec files; direct reads and exact searches were used as the graphless fallback. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Structural graph search was unavailable for this pass because the code graph is stale and excludes spec files; direct reads and exact searches were used as the graphless fallback.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Structural graph search was unavailable for this pass because the code graph is stale and excludes spec files; direct reads and exact searches were used as the graphless fallback.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All dimensions covered]

<!-- /ANCHOR:next-focus -->
