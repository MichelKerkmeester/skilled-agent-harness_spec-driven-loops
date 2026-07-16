---
title: "Feature Specification: versioned command contract"
description: "Define a versioned, machine-readable command contract as the single source of behavioral truth for the six command families. Populate topology, input and gate owner, execution targets, mode matrix, owned assets, loader requirements, presentation ownership with typed exceptions, destructive policy, timeout bounds, and runtime invocation aliases; align both templates and the skill to consume it; and resolve the required-input contradiction and stale template references."
status: complete
trigger_phrases:
  - "versioned command contract"
  - "command contract schema"
  - "command mode matrix"
  - "presentation ownership typed exceptions"
importance_tier: "critical"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/035-command-surface-benchmark/013-command-canon-remediation/001-versioned-command-contract"
    last_updated_at: "2026-07-16T08:31:59Z"
    last_updated_by: "claude"
    recent_action: "Resolved 014 dependency; contract fields delivered"
    next_safe_action: "Author contract schema from 014 asset-layer findings"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-command/SKILL.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_router_template.md"
      - ".opencode/skills/sk-doc/create-command/assets/command_template.md"
    open_questions:
      - "Sidecar file format: JSON versus YAML"
      - "Whether the mode matrix lives in the contract or a separate mode-registry"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: versioned command contract

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-16 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The command canon encodes behavioral truth as prose duplicated across seven surfaces — the skill, the two templates, router prose, the workflow YAML, the runtime, the mirrors, and the benchmark adapters — with no shared machine-readable representation for input ownership, mode resolution, loader requirements, presentation ownership, timeout bounds, or intentional exceptions. A command can therefore be canon-shaped yet contract-wrong. The required-input rule is itself contradictory: the skill demands an immediate gate, while the router template declares a required hint and omits that gate. `command_template.md` compounds the drift with stale numbered-section references and an outdated family topology. This phase gives the canon a single versioned contract so that prose, mirrors, validators, benchmark adapters, and generated routers all consume one truth.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Define a versioned command-contract schema as a sidecar file under `create-command/assets/` — a sidecar avoids relying on unverified frontmatter placement in the OpenCode and Claude loaders.
- Populate the contract for all six command families: create, design, speckit, memory, doctor, and deep.
- Align the two templates and the skill to consume the contract rather than restate its facts in prose.
- Correct the required-input contradiction and the stale numbered-section references and family topology in `command_template.md`.

**Out of scope:**
- Building the semantic validators, which belong to phase 003.
- Generating routers from the contract, which belongs to phase 005.
- The route-parser fix, which belongs to phase 002.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** The contract declares, per command — topology; input and gate owner; execution targets; a mode matrix (per-family default plus supported modes); owned assets; loader requirements; presentation ownership plus typed intentional exceptions; destructive policy; timeout bounds; and runtime invocation aliases.
- **REQ-002 (P0):** Both `command_router_template.md` and `command_template.md` validate against the schema.
- **REQ-003 (P0):** A required input is always router-gated or target-gated; naming the router-gate form resolves the contradiction, while enforcement is deferred to phase 003.
- **REQ-004 (P1):** No numbered-section pointer or hand-maintained family inventory remains normative in either template.
- **REQ-005 (P1):** The schema's non-asset fields — topology, gate owner, execution targets, destructive policy, and invocation aliases — are authorable before the 014 asset-layer research completes; the asset-layer fields (mode matrix and typed presentation exceptions) are finalized after it.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- Both templates validate against the schema.
- Every six-family router has a complete contract entry.
- The mode matrix records create → confirm, design → auto for complete invocations, and speckit → explicit, without forcing one default across families.
- `memory`/`search`-style inline presentation is representable as a typed exception rather than a leak.
- No stale numbered-section reference or hand-maintained family topology remains in the templates.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Dependency on 014 research (RESOLVED)** — the mode-matrix and typed-presentation-exception detail is delivered by the completed sibling `014-command-asset-layer-research` run: a per-command `mode_matrix` with a `default_policy` enum (confirm, conditional-auto, ask, confirm-only) that holds every real family default without forcing one, a typed `presentation.exceptions[]` carrier, a `workflow_schema_ref`, and the observed `confirm == auto + checkpoints` invariant. The schema's non-asset fields are still authored first; the asset-layer fields now consume verified detail.
- **Contradiction resolution scope creep** — naming the router-gate form could tempt a full enforcement build here. Mitigation: enforcement stays framed as phase 003; this phase only declares the resolved form.
- **Loader-placement risk** — frontmatter-embedded contracts may be silently dropped by some loaders. Mitigation: the contract ships as a sidecar asset, not as template frontmatter.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Sidecar file format: JSON versus YAML.
- Whether the mode matrix lives inside the contract or in a separate mode-registry consumed by it.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 000-keystone-validator-compose. Successor: 002-executable-edge-route-parsing.
