---
title: "Tasks: versioned command contract"
description: "Task breakdown for the versioned command-contract sidecar schema, its six-family population, template and skill alignment, and the required-input contradiction fix — scaffolded, with asset-layer tasks gated on the 014 research."
status: in_progress
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/001-versioned-command-contract"
    last_updated_at: "2026-07-16T08:06:37Z"
    last_updated_by: "claude"
    recent_action: "Scaffolded Level-1 contract-phase doc set"
    next_safe_action: "Await 014 asset-layer research before finalizing schema"
    blockers:
      - "Mode-matrix and typed presentation-exception shape pending 014 asset-layer research"
    key_files:
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_template.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: versioned command contract

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists the verification that will confirm it. All seven tasks are open: this phase is scaffolded only, and the asset-layer tasks are gated on the in-flight 014 asset-layer research before they can be finalized.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Define the versioned command-contract sidecar schema under `create-command/assets/`, declaring topology, input and gate owner, execution targets, mode matrix, owned assets, loader requirements, presentation ownership plus typed exceptions, destructive policy, timeout bounds, and invocation aliases. Verification: the schema file parses and lists every required field.
- [ ] T002 — Choose and record the sidecar file format (JSON versus YAML) and whether the mode matrix lives inline or in a separate mode-registry. Verification: the decision is captured in the decision surface and the schema follows it.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Populate the non-asset fields (topology, gate owner, execution targets, destructive policy, invocation aliases) for all six families: create, design, speckit, memory, doctor, deep. Verification: each family has a complete non-asset entry.
- [ ] T004 — After the 014 asset-layer research converges, populate the mode matrix and typed presentation-exception fields, encoding create → confirm, design → auto, speckit → explicit, and the inline `memory`/`search`-style exception. Verification: the mode matrix matches the intended per-family defaults and the inline case is a typed exception, not a leak. (Gated on 014.)
- [ ] T005 — Align `command_router_template.md`, `command_template.md`, and the skill to consume the contract; remove the stale numbered-section references and hand-maintained family topology; unify the required-input rule on the router-gate form. Verification: neither template retains a numbered-section pointer or hand-maintained inventory, and both consume the contract.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Validate both templates against the schema and confirm every six-family router resolves to a complete contract entry. Verification: schema validation passes for both templates and all six family entries are complete.
- [ ] T007 — Confirm the required-input contradiction is resolved in the declared form (router-gated), noting that enforcement is phase 003. Verification: the skill and the router template agree on the router-gate form with no residual contradiction.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Both templates validate against the schema, every six-family router has a complete contract entry, the mode matrix and typed presentation-exception encodings match the intended defaults, and no stale numbered-section reference or hand-maintained family topology remains normative.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation`. Predecessor: 000-keystone-validator-compose. Successor: 002-executable-edge-route-parsing.
<!-- /ANCHOR:cross-refs -->
