---
title: "Implementation Plan: versioned command contract"
description: "Plan for the versioned command-contract sidecar schema: define it under create-command/assets/, populate all six families, align both templates and the skill to consume it, and resolve the required-input contradiction and stale template references, with asset-layer fields finalized after the 014 research."
status: complete
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/001-versioned-command-contract"
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: versioned command contract

<!-- ANCHOR:summary -->
## 1. SUMMARY

Give the command canon one versioned, machine-readable contract that replaces prose duplicated across seven surfaces. The contract ships as a sidecar asset under `create-command/assets/`, declares each command's topology, input and gate owner, execution targets, mode matrix, owned assets, loader requirements, presentation ownership with typed exceptions, destructive policy, timeout bounds, and invocation aliases, and is populated for all six families. Both templates and the skill are aligned to consume it, and the required-input contradiction and stale template references are corrected. Non-asset fields are authored now; the mode-matrix and typed-presentation-exception fields are finalized after the 014 asset-layer research.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Both `command_router_template.md` and `command_template.md` validate against the schema.
- Every six-family router has a complete contract entry.
- The mode matrix records create → confirm, design → auto, and speckit → explicit without forcing one default.
- Inline `memory`/`search`-style presentation is representable as a typed exception, not a leak.
- No stale numbered-section reference or hand-maintained family topology remains in the templates.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The contract lives beside the templates it governs, as a sidecar file under `.opencode/skills/sk-doc/create-command/assets/`. A sidecar is chosen over template frontmatter because some OpenCode and Claude loaders drop unverified frontmatter placement, and the contract must remain the single machine-readable source. Each family entry declares topology, input and gate owner, execution targets, a mode matrix, owned assets, loader requirements, presentation ownership plus typed exceptions, destructive policy, timeout bounds, and runtime invocation aliases. `command_router_template.md` and `command_template.md` are reworked to reference the contract instead of restating its facts, dropping their numbered-section pointers and hand-maintained family topology. The required-input rule is unified on the router-gate form so the skill and the router template no longer contradict each other. Enforcement of the schema and the gate rule is left to the phase-003 validators.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Schema and non-asset fields
Define the sidecar schema and author the fields that do not depend on the 014 research — topology, input and gate owner, execution targets, destructive policy, and invocation aliases — for all six families.

### Phase 2: Asset-layer fields
After 014 converges, populate the mode matrix and the typed presentation-exception fields, encoding the per-family defaults and the inline-presentation exception shape.

### Phase 3: Template and skill alignment
Rework both templates and the skill to consume the contract, remove the stale numbered-section references and hand-maintained family topology, and unify the required-input rule on the router-gate form.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Validate both templates against the schema, confirm every six-family router resolves to a complete contract entry, and assert the mode matrix and typed presentation-exception encodings match the intended per-family defaults. Semantic-validator enforcement is out of scope here (phase 003); this phase verifies structural completeness and that no stale numbered-section pointer or hand-maintained topology remains normative.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends on the sibling `014-command-asset-layer-research` deep-research run for the mode-matrix and typed-presentation-exception detail; that run is in flight, so the asset-layer fields are finalized after it converges. Feeds phase 003 (semantic validators), phase 005 (router generation from the contract), and phase 002 (route-parser fix), each of which consumes the contract this phase produces.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert by removing the sidecar contract asset and restoring the two templates and the skill to their pre-contract prose, leaving the downstream phases (002, 003, 005) untouched since they have not yet consumed the contract.
<!-- /ANCHOR:rollback -->
