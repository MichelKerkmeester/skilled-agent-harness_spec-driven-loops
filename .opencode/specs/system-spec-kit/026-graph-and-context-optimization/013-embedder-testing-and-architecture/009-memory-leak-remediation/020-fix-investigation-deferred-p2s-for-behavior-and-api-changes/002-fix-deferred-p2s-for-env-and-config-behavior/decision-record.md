---
title: "Decision Record: Env and Config Behavior Closure for F17 F16 F40 F46"
description: "ADRs for rerank sidecar config hash validation, shared env allowlist filtering, and config-prefix precedence."
trigger_phrases:
  - "020 002 ADR"
  - "F17 F16 F40 F46 ADR"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/002-fix-deferred-p2s-for-env-and-config-behavior"
    last_updated_at: "2026-05-23T12:30:00Z"
    last_updated_by: "codex"
    recent_action: "Scaffolded"
    next_safe_action: "Validate scaffold, then implement F17/F16/F40/F46"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0200020200020200020200020200020200020200020200020200020200020200"
      session_id: "020-002-f17-f16-f40-f46-env-config"
      parent_session_id: null
    completion_pct: 10
---
# Decision Record: Env and Config Behavior Closure for F17 F16 F40 F46

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: CONFIG HASH INPUT SANITIZATION POLICY

**Status:** Proposed
**Date:** 2026-05-23
**Context:** F17 reports that `canonicalConfigHash()` hashes malformed or oversized env-derived values without validating them.

### Decision
Validate hash-relevant config values before canonical string construction. Reject non-string values, total value bytes above 4KB, and unprintable control characters with `ConfigHashInputError`.

### Rationale
- The config hash is a sidecar identity boundary; malformed inputs should fail before identity calculation.
- Key-only errors avoid leaking secrets or local paths through stderr/test output.
- A bounded byte limit prevents pathological env payloads from being hashed into sidecar reuse state.

### Alternatives Considered
- Coerce non-strings with `String(value)`: rejected because it hides caller mistakes.
- Truncate oversized values: rejected because it can create false hash equality.
- Log value snippets for debugging: rejected because env values can contain secrets.

### Affected Consumers
- Operators or tests passing malformed `RERANK_*` config values to the launcher.

### Backward Compatibility
This is a hard rejection for malformed hash inputs. Valid existing string configs keep the same hash.

---

## ADR-002: SHARED SIDECAR ENV ALLOWLIST WITH DROP-WARNING MIGRATION

**Status:** Proposed
**Date:** 2026-05-23
**Context:** F16 and F40 report drift between the F49 launcher env allowlist and the in-process sidecar client filter.

### Decision
Use one shared sidecar env allowlist for launcher and in-process client filtering. Dropped env keys emit a stderr warning naming the key only and are not forwarded.

### Rationale
- One allowlist prevents launcher and in-process sidecar behavior from drifting again.
- Warning plus drop gives operators a migration window without leaking disallowed values.
- Matching the F49 baseline preserves already-approved launcher behavior.

### Alternatives Considered
- Hard-error on disallowed keys: rejected because the prompt requires a migration window.
- Keep test-only `MOCK_SIDECAR_*`: rejected because it keeps production env behavior broader than the launcher.
- Continue separate allowlists with parity tests only: rejected because the source of truth would still be duplicated.

### Affected Consumers
- Tests or local callers relying on `MOCK_SIDECAR_*` or explicit in-process `envAllowlist` forwarding.
- Operators expecting unrelated parent env keys to reach sidecar child processes.

### Backward Compatibility
This is a soft behavior change: now-rejected env keys are dropped with a warning instead of forwarded.

---

## ADR-003: CONFIG PREFIX OVERLAP PRECEDENCE

**Status:** Proposed
**Date:** 2026-05-23
**Context:** F46 requires documented precedence when `SPECKIT_*` and `RERANK_*` values can express the same sidecar config intent.

### Decision
Use the more-specific prefix when two prefixes map to the same sidecar setting. For full equality on the same setting, warn and prefer `SPECKIT_*`.

### Rationale
- `SPECKIT_*` is the Spec Kit operator-facing namespace and should win exact intent conflicts in the in-process client.
- `RERANK_*` remains supported for the shared rerank sidecar launcher and lower-level sidecar skill knobs.
- Warning on overlap makes migration visible without blocking process startup.

### Alternatives Considered
- Prefer `RERANK_*`: rejected because the in-process client is owned by Spec Kit and should favor its namespace on conflicts.
- Hard-error on conflict: rejected because this bucket requires bounded migration behavior.
- Silently prefer one prefix: rejected because hidden precedence would recreate the documentation gap.

### Affected Consumers
- Operators setting both a `SPECKIT_*` and `RERANK_*` key for the same sidecar setting.

### Backward Compatibility
This is a soft behavior change. Conflicts continue to start, but stderr announces that `SPECKIT_*` won.

---

## DEFERRED

- 2026-05-23: HALT-ON-FIRST-REGRESSION triggered during `cd .opencode/skills/system-spec-kit && node mcp_server/node_modules/vitest/vitest.mjs run mcp_server/tests/embedders/sidecar-hardening.vitest.ts --config mcp_server/vitest.config.ts`. Existing test `generates cryptographically random request IDs (F48)` failed at `sidecar-hardening.vitest.ts:413` because the random request IDs were monotonic in that run (`expect(isMonotonic).toBe(false)` received `true`). This is unrelated to the env/config changes and appears to be a probabilistic fixture weakness, so verification halted per parent rule.
