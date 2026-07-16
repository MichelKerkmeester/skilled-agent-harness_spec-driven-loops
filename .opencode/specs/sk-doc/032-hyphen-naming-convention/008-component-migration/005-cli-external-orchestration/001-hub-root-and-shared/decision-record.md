---
title: "Decision Record: cli-external-orchestration hub root and shared boundary (032 phase 005.001)"
description: "Design decisions for the cli-external-orchestration hub boundary: protect exact routing contracts, record the absent shared subtree, and keep playbook and benchmark ownership with their dedicated phases."
trigger_phrases:
  - "cli-external hub root decision record"
  - "cli external shared boundary decisions"
  - "cli-external phase 001 decisions"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded hub boundary decisions"
    next_safe_action: "Apply the hub ownership ledger"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/hub-router.json"
      - ".opencode/skills/cli-external-orchestration/mode-registry.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The current hub has no shared/ directory."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: cli-external-orchestration hub root and shared boundary

<!-- ANCHOR:context -->
## Context

The live hub root contains `SKILL.md`, `README.md`, `description.json`, `graph-metadata.json`, `hub-router.json`, and `mode-registry.json`, plus three CLI components, a root `manual_testing_playbook/`, and an empty `benchmark/`. There is no `shared/` directory. A root-level underscore sweep would risk claiming delegated paths or changing exact routing contracts.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Protect the hub routing contract as an exact-name boundary

`SKILL.md`, `mode-registry.json`, `hub-router.json`, metadata filenames, and other tool-mandated names stay exact. Only path-valued references inside them may change when they point to a hub/shared-owned path. JSON keys, workflow-mode values, and router semantics do not change.

### DR-002 — Treat the absent shared subtree as an explicit zero-candidate result

The execution census records `shared/` as absent rather than inventing a rename or silently widening the phase. If a preceding phase introduces `shared/`, execution stops for an explicit reclassification before mutation.

### DR-003 — Keep playbook and benchmark ownership with their child phases

The root and component `manual_testing_playbook/` trees belong to phase 005, and the root `benchmark/` boundary belongs to phase 006. Their root references are consumers for those phases, not root/shared candidates for this map.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase can finish with a protected boundary and an evidenced empty owned map when the live root remains unchanged.
- Later phases own the path references they rewrite, so their checklists must include root `SKILL.md` and README link checks where relevant.
- Every root/shared path is classified before any filesystem operation; a mechanical root substitution is not allowed.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Program naming rules and exemptions: `.opencode/specs/sk-doc/032-hyphen-naming-convention/001-convention-policy-and-scope/decision-record.md`.
- Live hub contract: `.opencode/skills/cli-external-orchestration/SKILL.md`, `hub-router.json`, and `mode-registry.json`.
- Child ownership map: `../spec.md` and its phase documentation map.
<!-- /ANCHOR:references -->

