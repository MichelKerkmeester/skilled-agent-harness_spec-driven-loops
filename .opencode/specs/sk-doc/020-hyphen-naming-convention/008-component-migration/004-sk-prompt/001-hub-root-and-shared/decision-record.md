---
title: "Decision Record: sk-prompt hub root and shared boundary (032 phase 004.001)"
description: "Design decisions for phase 001: protect the sk-prompt routing contract, treat the absent shared/ subtree as an explicit census result, and keep delegated playbook and benchmark ownership separate."
trigger_phrases:
  - "sk-prompt hub root decision record"
  - "sk-prompt phase 001 boundary decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Recorded the root/shared ownership decisions"
    next_safe_action: "Use these decisions when constructing the phase map"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
      - ".opencode/skills/sk-prompt/mode-registry.json"
      - ".opencode/skills/sk-prompt/hub-router.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The live tree has no shared/ directory."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: sk-prompt hub root and shared boundary

<!-- ANCHOR:context -->
## Context

The live hub root contains `SKILL.md`, `README.md`, `description.json`, `graph-metadata.json`, `hub-router.json`, and
`mode-registry.json`, plus the delegated `manual_testing_playbook/`, `benchmark/`, `prompt-improve/`, and
`prompt-models/` trees. There is no `shared/` directory in the current inventory. A root-level underscore sweep would
therefore risk claiming later-phase paths or treating exact routing filenames as ordinary rename candidates.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Protect the hub routing contract as an exact-name boundary

`SKILL.md`, `mode-registry.json`, `hub-router.json`, package manifests, and other tool-mandated filenames stay exact.
Only path-valued references inside them may change when they point to a root/shared name owned by this phase. JSON keys,
workflow-mode values, and router semantics do not change.

### DR-002 — Treat the absent shared subtree as an explicit zero-candidate result

The execution census records `shared/` as absent rather than inventing a rename or silently widening the phase. If a
preceding phase introduces `shared/`, the same phase applies the program exemption rules and records the new candidates.

### DR-003 — Keep delegated trees out of the root/shared map

The root `manual_testing_playbook/` tree belongs to phase 004 and benchmark trees belong to phase 005. This keeps
reference rewrites with the path owner and prevents two child phases from producing competing source-to-target maps.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase may finish with a boundary and verification record rather than a root rename when the live census remains empty.
- Later phases own the root path references they change, so their checklists must include root `SKILL.md` and README link checks.
- A broad mechanical substitution is not allowed; every root/shared path is classified before any filesystem operation.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program scope and exemptions: `.opencode/specs/sk-doc/020-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md`.
- Live hub contract: `.opencode/skills/sk-prompt/SKILL.md` and `.opencode/skills/sk-prompt/mode-registry.json`.
- Child ownership map: `../spec.md` and the phase-parent `PHASE DOCUMENTATION MAP`.
<!-- /ANCHOR:references -->
