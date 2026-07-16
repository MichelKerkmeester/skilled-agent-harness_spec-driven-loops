---
title: "Decision Record: system-deep-loop hub root and shared names (032 phase 007/001)"
description: "L2 design decisions for the system-deep-loop hub/shared naming phase, including exact-name protections, the current no-candidate result, and dependency-closed verification."
trigger_phrases:
  - "system-deep-loop hub shared decisions"
  - "deep loop hub naming decision record"
  - "hub shared no-op decision"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/007-system-deep-loop/001-hub-root-and-shared"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored hub shared decisions"
    next_safe_action: "Verify hub shared map"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: System-deep-loop hub root and shared names

<!-- ANCHOR:context -->
## Context

The system-deep-loop hub root currently has no underscore-bearing filesystem candidate in the pinned inventory, and its shared directories are already compliant. The phase still owns the hub/shared boundary because root routing, metadata, and shared references can make a no-op assertion unsafe unless the inventory and exact-name exemptions are frozen together.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Preserve tool-mandated hub identity names
SKILL.md, mode-registry.json, README.md, hub-router.json, description.json, and graph-metadata.json retain their exact names. Their content, keys, identifiers, and metadata shape are not migration candidates.

### DR-002 — Treat the current root/shared result as a verified no-op
The phase records the current zero-candidate result as an evidence-backed no-op. If the pinned BASE inventory differs, the phase may rename only newly discovered in-scope root/shared candidates after mapping and collision checks; it does not broaden into runtime, manual-playbook, or benchmark ownership.

### DR-003 — Verify the hub/shared closure even when no filesystem rename occurs
Routing, shared Markdown links, helper fixtures, and graph metadata are checked against the pinned inventory. A no-op is accepted only when the closure resolves and behavior remains non-trivial.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The phase has a narrow, auditable boundary and can finish without a cosmetic rename commit when the pinned result remains zero candidates.
- The exact-name protections prevent metadata or router identity drift while allowing a future BASE-drift candidate to be handled in the same scoped packet.
- Verification must prove the absence of candidates and root/shared parity, so the no-op is not inferred from an incomplete scan.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Governing convention decisions: ../../../001-convention-policy-and-scope/decision-record.md.
- Phase specification and live root/shared inventory: spec.md.
<!-- /ANCHOR:references -->
