---
title: "Decision Record: API Response Shape Closure for F9 F32 F39 F97 F99"
description: "ADRs for sidecar-client testables split, response alias compatibility, and pending-map discriminator narrowing."
trigger_phrases:
  - "020 004 ADR"
  - "api response shape ADR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/004-fix-deferred-p2s-for-api-response-shape"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified"
    next_safe_action: "Parent agent may review and commit packet"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0200040200040200040200040200040200040200040200040200040200040200"
      session_id: "020-004-api-response-shape"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: API Response Shape Closure for F9 F32 F39 F97 F99

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: MOVE TEST-ONLY ENV HELPER BEHIND TESTABLES MODULE

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F9

### Decision
Keep `buildSidecarEnv` implemented in `sidecar-client.ts` as an internal helper, but expose test access through `sidecar-client.testables.ts` only. The production module no longer has a named `buildSidecarEnv` export.

### Rationale
- `buildSidecarEnv` exists to fixture env filtering and prefix precedence.
- Test-only helper exports from production modules make the public API larger than the runtime contract.
- The existing `sidecar-client.testables.ts` module is the narrow test-only surface for this package.

### Alternatives Considered
- Keep the production export: rejected because it leaves F9 open.
- Duplicate env-building logic in tests: rejected because fixtures would drift from production behavior.

### Compatibility Contract
Production consumers should not import `buildSidecarEnv`. Grep found no live source consumer of the production export; the same token in `ensure-rerank-sidecar.cjs` is a separate launcher-local helper, not a client import.

---

## ADR-002: ONE-RELEASE RESPONSE ALIAS COMPATIBILITY

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F32, F39, F97

### Decision
Expose canonical camelCase response field names and keep deprecated legacy aliases for one release cycle. Legacy alias reads emit a stderr warning once per alias per process. This applies to `SidecarWorkerInfo` (`lastRequestAt`, `idleForMs`, `requestCount`) and the client dimension surface (`dimensions` canonical, `dim` deprecated).

### Rationale
- The parent packet identifies bucket 2 as high risk because response shape changes are public API changes.
- A hard rename would break consumers immediately.
- Warning-on-read gives consumers a migration signal while preserving runtime compatibility.

### Alternatives Considered
- Hard break to camelCase only: rejected by the prompt and public API risk.
- Keep legacy names only: rejected because it leaves the naming findings open.
- Warn on every legacy read: rejected because repeated response reads can spam stderr.

### Compatibility Contract
For this release cycle, both legacy and canonical names resolve to the same values. The legacy names are deprecated and scheduled for removal after the compatibility window. The warning text contains only field names, not payload values.

---

## ADR-003: PENDING-MAP DISCRIMINATOR NARROWING

**Status:** Accepted
**Date:** 2026-05-23
**Findings:** F99

### Decision
Replace unsafe pending-map casts with a discriminated pending-entry shape and runtime checks before resolving responses. The map stores `unknown`; `isPendingRequest()` verifies the entry has a supported `type`, `resolve`, and `reject` before response dispatch.

### Rationale
- The current cast trusts that a pending entry matches the response type.
- Discriminator narrowing lets malformed internal entries fail closed with a structured error.
- Keeping the change local to `sidecar-client.ts` avoids a wider public type refactor.

### Alternatives Considered
- Leave the cast: rejected because it bypasses the type discriminator.
- Refactor worker protocol types across sibling consumers: rejected unless required; prompt says to DEFER-AGAIN when the change propagates outside `sidecar-client.ts`.

### Compatibility Contract
Valid pending entries resolve as before. Malformed pending entries reject with `SidecarClientError` code `sidecar-pending-entry-invalid` instead of reaching an unchecked cast. No sibling consumer files needed changes, so no F99 escalation was required.

---

## VERIFICATION NOTES

- 2026-05-23: Scaffold strict validation passed with errors 0, warnings 0.
- 2026-05-23: Embedders vitest passed: 4 files, 47 tests, exit 0.
- 2026-05-23: `npm run typecheck --workspace=@spec-kit/mcp-server` exited 0.
- 2026-05-23: Final strict validation passed with errors 0, warnings 0.

## DEFERRED

- None.
