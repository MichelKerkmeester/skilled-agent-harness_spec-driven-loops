---
title: "Tasks: versioned command contract"
description: "Task breakdown for the versioned command-contract sidecar schema, its six-family population, template and skill alignment, and the required-input contradiction fix — scaffolded, with asset-layer tasks gated on the 014 research."
status: complete
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation/001-versioned-command-contract"
    last_updated_at: "2026-07-16T12:30:00Z"
    last_updated_by: "claude"
    recent_action: "Shipped versioned command contract; six families populated, templates and skill aligned"
    next_safe_action: "Open 002-executable-edge-route-parsing"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.schema.json"
      - ".opencode/skills/sk-doc/create-command/assets/command_contract.json"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_template.md"
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: versioned command contract

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task carries its verification evidence. All seven tasks are complete: the versioned contract exists and validates, all six families are populated, both templates and the skill consume it, and the required-input contradiction is resolved.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Defined the versioned command-contract schema `command_contract.schema.json` under `create-command/assets/`, declaring topology, input and gate owner, execution targets, mode matrix, owned assets, loader requirements, presentation ownership plus typed exceptions, destructive policy, timeout bounds, and invocation aliases. Evidence: the schema passes draft-07 meta-validation and lists every required field; topology is a discriminated union of four classes.
- [x] T002 — Recorded the format and layout decisions: JSON sidecar (consumers are machine readers, matching the `template_rules.json` / `mode-registry.json` precedent) and the mode matrix inline in the contract (a separate registry would re-fragment the single source of truth). Evidence: the decisions are in the decision record and the schema follows them.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Populated the non-asset fields (topology, gate owner, execution targets, destructive policy, invocation aliases) for all six families. Evidence: `command_contract.json` validates against the schema with complete entries for create, design, speckit, memory, doctor, and deep.
- [x] T004 — Populated the mode matrix and typed presentation exceptions from the 014 asset-layer census: create → confirm, design → conditional-auto, speckit → ask (with a `/speckit:resume` → confirm override), doctor → confirm-only, deep → ask, and memory → non-mutating-default. Evidence: the enum-exhaustiveness check found the fifth-value pressure is memory (direct-dispatch), not speckit/deep, so `non-mutating-default` was added; the `/memory:search` inline render block is a typed presentation exception rather than a leak.
- [x] T005 — Aligned `command_router_template.md`, `command_template.md`, and the skill to consume the contract: removed the hand-maintained family enumerations from all three, replaced the off-by-one Command-Types section pointers and the stale gate-pattern references with drift-proof names, and added the router-owned required-argument gate slot to the skeleton. Evidence: a grep sweep finds zero numbered-section pointers and zero family enumerations; both templates and the skill reference the contract.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Validated both templates against the schema and confirmed every six-family router resolves to a complete entry. Evidence: the acceptance harness passes — the contract validates, all six families are present, and each template's embedded `contract-example` block validates as a `familyContract`.
- [x] T007 — Confirmed the required-input contradiction is resolved on the router-gate form (enforcement remains phase 003). Evidence: the skill's Step 7 mandate and the router skeleton's new `REQUIRED-ARGUMENT GATE` slot agree; the acceptance harness reports the required-input invariant holding 6/6 families (no required input is ungated).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

Met. Both templates validate against the schema, every six-family router has a complete contract entry, the mode matrix and typed presentation-exception encodings match the intended defaults, and no stale numbered-section reference or hand-maintained family topology remains normative.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark/013-command-canon-remediation`. Predecessor: 000-keystone-validator-compose. Successor: 002-executable-edge-route-parsing.
<!-- /ANCHOR:cross-refs -->
