---
title: "Decision Record: system-deep-loop deep-alignment names (017 phase 007/007)"
description: "L2 design decisions for the deep-alignment naming phase, including filesystem-path versus embedded-key classification, adapter/catalog closure, and read-only authority boundaries."
trigger_phrases:
  - "system-deep-loop alignment decisions"
  - "deep-alignment naming decision record"
  - "alignment path key boundary"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/007-system-deep-loop/007-deep-alignment"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored alignment decisions"
    next_safe_action: "Verify alignment path key map"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

# Decision Record: System-deep-loop deep-alignment names

<!-- ANCHOR:context -->
## Context

The deep-alignment component contains 15 underscore-bearing directory families and 68 underscore-bearing files across adapter, catalog, playbook, resource-map, and state paths. It also contains embedded resource identifiers, authority labels, and serialized keys whose underscores are semantic values rather than filesystem names.
<!-- /ANCHOR:context -->

<!-- ANCHOR:decisions -->
## Decisions

### DR-001 — Separate physical path candidates from embedded identifiers and keys
Only filesystem names and path-valued references enter the rename map. Resource identifiers, serialized keys, authority labels, and other embedded values retain their BASE values unless a separate path contract proves they are path-valued.

### DR-002 — Move adapter, catalog, playbook, resource-map, and state paths as one closure
The component’s path families are verified together so adapter lookup, catalog discovery, manual verification, resource mapping, and state access do not split across old and new names.

### DR-003 — Preserve the read-only and authority boundary
Read-only behavior, authority selection, tool access, and state handling are acceptance constraints. A path rename must not become an opportunity to rewrite alignment semantics or broaden tool permissions.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:consequences -->
## Consequences

- The map is more precise than a global underscore scan because it records why each path-like token changes or remains fixed.
- Verification must check both path resolution and key preservation, including non-trivial authority/read-only behavior.
- Documentation may contain old-looking identifiers that are correct; the report must distinguish them from stale filesystem basenames.
<!-- /ANCHOR:consequences -->

<!-- ANCHOR:references -->
## References

- Governing convention decisions: ../../../001-convention-policy-and-scope/decision-record.md.
- Phase specification and path/key inventory: spec.md.
<!-- /ANCHOR:references -->
