---
title: "Decision Record: Test-Only Barrel Export Cleanup for F44 and F109"
description: "ADR documenting direct test imports and public barrel export removal for F44 and F109."
trigger_phrases:
  - "020 001 ADR"
  - "F44 F109 barrel decision"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/001-fix-deferred-p2s-for-test-only-and-shared-exports"
    last_updated_at: "2026-05-23T10:20:00Z"
    last_updated_by: "codex"
    recent_action: "Completed"
    next_safe_action: "Parent agent may commit packet"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0200010200010200010200010200010200010200010200010200010200010200"
      session_id: "020-001-f44-f109-barrel-cleanup"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Test-Only Barrel Export Cleanup for F44 and F109

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: COLLAPSE TEST-ONLY BARREL EXPORTS TO DIRECT IMPORTS

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F44 and F109 were deferred because tests consumed production-dead symbols through public barrels.

### Decision
Refactor the `system-spec-kit` registry test to import `listSupportedDimensions` from `@spec-kit/shared/embeddings/registry.js` and `EmbedderManifest` from `@spec-kit/shared/embeddings/types.js`, then remove those members from the `system-spec-kit` mcp-server embedders barrel surface.

### Rationale
- Test-only consumers should not force public barrel exports to remain part of the production API surface.
- Direct imports make internal test coupling explicit.
- Removing the barrel members closes the deferred dead-export findings without changing runtime behavior.
- Consumer grep found production handlers importing `BackendKind`, `getAdapter`, `getManifest`, `listManifests`, and schema helpers from the barrel, but no live production consumer of the removed F44/F109 members.
- `system-skill-advisor` has its own shared-embedder shim/barrel and parity test mentioning `listSupportedDimensions`; this packet leaves that sibling surface untouched and does not remove the shared source symbol.

### Consequences
- Tests keep validating registry/type behavior through source modules.
- Public barrel surface becomes smaller.
- No live `system-spec-kit` consumer imports the deleted barrel members; typecheck and embedders vitest passed after deletion.
