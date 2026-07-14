---
title: "Decision Record: mcp-tooling hub root and shared naming boundary (017 phase 001)"
description: "The phase boundary decisions for root-owned mcp-tooling routing material, an absent shared directory, and delegated child surfaces."
trigger_phrases:
  - "mcp-tooling root naming decision"
  - "mcp-tooling shared boundary decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/006-mcp-tooling/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded the phase 001 root/shared boundary decisions"
    next_safe_action: "Execute the scoped root/shared rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/mcp-tooling/SKILL.md"
      - ".opencode/skills/mcp-tooling/mode-registry.json"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: mcp-tooling Hub Root and Shared Naming Boundary

<!-- ANCHOR:context -->
## Context

The mcp-tooling root contains the public hub contract and navigation for three component packets. The baseline has root-level manual-testing-playbook and benchmark directories, but no physical shared/ directory. A root sweep that treats every descendant as shared would steal files from later phases and could rename exact routing contracts. The 017 program also requires filesystem names to use kebab-case while preserving tool-mandated names and non-filesystem identifiers.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Scope phase 001 to root-owned material and real shared paths
The phase census owns root siblings and any shared/ directory that physically exists at execution. It records the current absence of shared/ and does not create one. The root manual-testing-playbook, benchmark, and three component trees remain owned by their named child phases.

### DR-002 — Preserve hub contracts while repairing path values
SKILL.md and mode-registry.json remain exact filenames. Root Markdown links and path-valued router metadata may change to follow renamed children, but JSON keys, mode identifiers, frontmatter fields, and code identifiers do not change.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase has a narrow, auditable blast radius and cannot absorb another child's rename set.
- The root hub remains routable while child phases land independently.
- A missing shared/ directory is an evidence-backed zero-candidate result, not a reason to invent a new filesystem surface.
- Reviewers must inspect path values and structural keys separately because both live in the same JSON documents.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Parent spec: ../spec.md
- 017 program scope and exemption boundary: ../../../../../../spec.md
- Hub contract: .opencode/skills/mcp-tooling/SKILL.md
- Mode registry: .opencode/skills/mcp-tooling/mode-registry.json
<!-- /ANCHOR:references -->
