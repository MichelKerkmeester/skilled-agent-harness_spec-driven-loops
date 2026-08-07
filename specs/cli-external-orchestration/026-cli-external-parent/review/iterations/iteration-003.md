# Iteration 003

## Dimension

Traceability: verify that the phase plans preserve their declared atomic contracts across the cli-external and mcp-tooling programs, and that the scoped cli-opencode documentation matches its authority hierarchy.

## Files Reviewed

- All 41 files named in the iteration scope, including both parent packets' phase plans/specifications, both decision records, and the five scoped cli-opencode documents.
- Primary trace: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/003-scaffold-hub/spec.md:104-105,121`, `.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:72,81-82,142-144`, and `.opencode/specs/cli-external-orchestration/026-cli-external-parent/002-architecture-decision/decision-record.md:347-362,445-463`.

## Findings by Severity

### P0

None.

### P1

#### R3-P1-001: The phase-003 graph scaffold violates the scorer/dissolution atomicity boundary

- Claim: Phase 003 creates a hub `graph-metadata.json` with `family: cli` before phase 005 rewrites the scorer, despite ADR-004/ADR-005 requiring the identity change and scorer change to land as one atomic unit.
- Evidence: Phase 003 explicitly creates the hub graph identity with `family: cli` [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/003-scaffold-hub/spec.md:104-105,121`]. ADR-004 identifies `family: cli` as the condition that makes the existing scorer's family filter select the hub [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/002-architecture-decision/decision-record.md:347-362`]. ADR-005 requires the scorer to change in the same atomic bundle as the identity dissolution [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/002-architecture-decision/decision-record.md:445-463`], and phase 005 repeats that one-commit requirement [SOURCE: `.opencode/specs/cli-external-orchestration/026-cli-external-parent/005-foldin-cli-claude-code/spec.md:72,81-82,142-144`].
- Counterevidence sought: A phase-003 invariant proving the staged hub metadata cannot enter the advisor projection, or an explicit requirement that no graph scan/rebuild can occur before phase 005. None is specified in the reviewed phase plans/specifications.
- Alternative explanation: The hub metadata may be intended as inert scaffold data until phase 006 rebuilds the graph. The plans do not encode or verify that isolation, while the staged file carries the active `family: cli` identity used by the documented scorer filter.
- Finding class: cross-consumer.
- Recommendation: Stage the hub without an advisor-visible `family: cli` identity until phase 005, or add an explicit, enforced no-projection/no-rebuild gate and a phase-005 activation step that is verified atomically with the scorer rewrite.
- Final severity: P1.
- Confidence: 0.94.
- Downgrade trigger: Evidence that the advisor projection excludes the phase-003 hub metadata until the phase-005 atomic commit, with a test covering an intervening graph scan/rebuild.

### P2

None new. The mcp-tooling phase-006 scope-boundary wording issue remains the prior R1-P2-003 finding; the detailed scope, ADR-005 carve-out, and task all preserve the actual metadata-only exception [SOURCE: `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/006-advisor-and-integration/spec.md:72,110,130`; `.opencode/specs/skilled-agent-orchestration/126-mcp-tooling-parent/002-architecture-decision/decision-record.md:463`].

## Traceability Checks

- Core `spec_code`: partial. The cli-external phase-003 scaffold specification traces to the phase-005 scorer contract, but the staged `family: cli` identity conflicts with that contract's atomicity invariant.
- Core `checklist_evidence`: deferred. The declared iteration target is planning/specification and scoped runtime documentation; execution checklists and completion evidence are outside the named target files.
- Overlay `skill_agent`: partial. `cli-opencode/SKILL.md` correctly states that direct top-level agent dispatch is restricted, but its README/reference/playbook surfaces still contain the previously recorded conflicting recipes.
- Overlay `agent_cross_runtime`: partial. The cli-external scorer contract and the mcp-tooling `code_mode` carve-out were checked across their stated producer/consumer documents.
- Overlay `feature_catalog_code`: deferred. No feature catalog is in the declared review scope.
- Overlay `playbook_capability`: deferred. No playbook is in the declared review scope.

## Verdict

CONDITIONAL. One new P1 breaks the planned trace from graph-identity staging to the scorer's atomic migration contract.

## Next Dimension

maintainability

Review verdict: CONDITIONAL
