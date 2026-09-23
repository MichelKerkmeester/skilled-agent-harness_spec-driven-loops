---
title: "Decision Record: Compile current sk-design for compiled routing"
description: "Why the rollout compiles the live four-mode root-router contract and why serving authority remains behind independent admission and identity gates."
trigger_phrases:
  - "sk-design compiled decisions"
  - "root-router compilation"
  - "compiled serving promotion"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/013-fix-sk-design-for-compiled-routing"
    last_updated_at: "2026-09-22T15:26:03Z"
    last_updated_by: "pi"
    recent_action: "Both decisions were implemented, verified, and closed"
    next_safe_action: "Operator review, then push the rollout and closure commits"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-21-sk-design-compiled-routing"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "ADR-001: compile the current root-router contract"
      - "ADR-002: promote only after independent serving identity is proven"
---
# Decision Record: Compile current sk-design for compiled routing

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Compile the current root-router contract

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-21 |
| **Deciders** | Packet owner and implementer |
| **Satisfies** | REQ-001, REQ-002 |

### Context

The live design hub was rebuilt after the historical compiled rollout was deleted. Its current contract has four modes and a root `ROUTER.md` that owns stage-two leaf selection. The historical compiler used retired modes and a different generation model.

### Decision

Compile the current registry, hub router, root router, mode packets, and leaf manifest as one source-addressed snapshot. Derive mode ownership from the live registry and root resource prefixes instead of freezing a historical mode list.

### Consequences

- Source changes invalidate the policy identity and require a fresh build.
- Stage one remains mode selection and stage two remains root-router leaf selection.
- Retired historical resources cannot be emitted accidentally.

### Alternatives Rejected

- **Copy the deleted historical rollout**: it would route to modes and leaves that the live hub no longer owns.
- **Use the generic compiler alone**: it cannot preserve the root-router leaf projection and current mode-specific semantics.
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Promote only after independent serving identity is proven

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-09-21 |
| **Deciders** | Packet owner and implementer |
| **Satisfies** | REQ-003, REQ-004, REQ-005 |

### Context

A generated policy can be structurally valid while its activation state is missing, stale, or inconsistent with the runtime. The existing resolver already defines the safe authority boundary.

### Decision

Build shadow-only artifacts first. Promote the activation manifest only after route admission, root leaf replay, freshness, status, and cohort lockstep checks pass. Keep the fleet flag and manifest as immediate rollback controls.

### Consequences

- A missing or drifted artifact remains a legacy fallback, not a routing exception.
- The activation manifest records the exact policy hash and generation that the resolver is allowed to serve.

### Alternatives Rejected

- **Activate on build completion**: it would authorize a route before parity and freshness evidence exists.
<!-- /ANCHOR:adr-002 -->
