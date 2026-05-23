---
title: "Decision Record: Investigation P1 Fixes for TS CJS Rerank Twin Parity"
description: "Architecture Decision Records for 9 P1 drift and parity findings across TS/CJS/Python sidecar contracts."
trigger_phrases:
  - "arc 010 parity decision record"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/004-fix-investigation-p1s-for-ts-cjs-rerank-twin-parity"
    last_updated_at: "2026-05-23T05:17:00Z"
    last_updated_by: "devin"
    recent_action: "created-decision-records"
    next_safe_action: "run-strict-validation"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100020040100020040100020040100020040100020040100020040100020040"
      session_id: "010-002-004-parity"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Investigation P1 Fixes for TS CJS Rerank Twin Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Canonical toBackendKind Location

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F2, F38 - Duplicate backend kind resolution logic between sidecar-client and execution-router

### Decision
Keep `toBackendKind` implementation canonical in `sidecar-client.ts:175-183`. The `execution-router.ts` imports and uses this canonical version via the existing import at line 11. No duplicate implementation exists in execution-router.ts.

### Rationale
- `sidecar-client.ts` is the consumer of the backend kind normalization logic
- `execution-router.ts` already imports from `sidecar-client.ts` for other types
- Moving to a shared location would require more import boundary changes
- The current import pattern is already established and working
- Test coverage validates the canonical implementation

### Consequences
- Single source of truth for backend kind normalization
- Reduced maintenance burden (no duplicate implementations to sync)
- Clear import path: execution-router → sidecar-client
- Test coverage in sidecar-hardening.vitest.ts validates the contract

---

## ADR-002: SidecarClientOptions Production/Test Split

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F37 - SidecarClientOptions API surface drift from production usage

### Decision
Split `SidecarClientOptions` into two interfaces:
- `SidecarClientOptions` (production-only): provider, model, dimensions, backend
- `SidecarClientTestOptions` (extends production): adds workerPath, idleMs, pingTimeoutMs, requestTimeoutMs, envAllowlist, env

### Rationale
- Production API surface is now minimal and clear
- Test consumers can use extended interface for test doubles
- Avoids narrowing production type which would break existing tests
- Maintains backward compatibility with test code
- Clear separation of concerns via TypeScript interface extension

### Consequences
- Production constructor signature is minimal (4 required fields)
- Test code has access to all needed injection points
- Type system enforces production-only field usage
- No breaking changes to existing test code

---

## ADR-003: Canonical Empty Revision Semantic

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F1 - Config hash default revision drift between JS and Python implementations

### Decision
Both JS and Python implementations treat empty `RERANK_MODEL_REVISION` string as "not set" via the `||` operator, using the same default revision (`e61197ed45024b0ed8a2d74b80b4d909f1255473`). This contract is documented in both files with cross-references.

### Rationale
- Both implementations already used `||` operator (empty string is falsy)
- No code changes needed, only documentation
- Consistent behavior across runtimes
- Default revision is pinned for reproducibility
- Cross-references help future maintainers understand the contract

### Consequences
- Empty string and missing env var have identical behavior
- Config hash is stable across JS/Python implementations
- Contract is documented and testable
- No breaking changes to existing behavior

---

## ADR-004: JS Ledger Locking Policy

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F69 - Missing file locking in JS ledger write vs Python atomic locking

### Decision
Add advisory file locking to JS ledger writes using `.lock` file pattern with exclusive-create (`wx` mode). This matches Python's `fcntl.flock(LOCK_EX)` approach in `sidecar_ledger.py:94-104`. Avoid external dependency on `proper-lockfile` package.

### Rationale
- Python already uses fcntl locking for concurrent write safety
- JS needs parity for multi-process scenarios (e.g., concurrent MCP launches)
- Advisory locking via `.lock` file is sufficient for this use case
- Exclusive-create mode provides atomic lock acquisition
- Avoids adding external dependency for simple locking pattern
- Existing test validates concurrent safety

### Consequences
- JS ledger writes are now safe across concurrent processes
- Lock file pattern matches Python implementation
- No external dependencies added
- Best-effort cleanup on lock file release
- Test coverage validates concurrent row additions

---

## ADR-005: 64KB Health Body Cap Parity

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F101 - Health payload body size limit drift between JS (64KB) and Python (8KB)

### Decision
Raise Python health payload cap from 8KB to 64KB to match JS implementation. Add `MAX_HEALTH_BODY_BYTES` constant (65536) in both files for consistency. JS was already canonical (set by F85 in phase 002).

### Rationale
- 64KB provides more headroom for health responses
- JS was already the canonical implementation (F85 in phase 002)
- Python 8KB limit was unnecessarily restrictive
- Consistent operator-facing behavior across runtimes
- Health responses are typically small, 64KB is safe upper bound

### Consequences
- Both runtimes use identical 64KB cap
- Canonical constant defined in both files
- No breaking changes (raising limit is safe)
- Test coverage validates the constant value

---

## ADR-006: Structured Process Liveness Python Mirror

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F102 - Process liveness error handling drift between JS and Python

### Decision
Change Python `processLiveness` return type from `Literal["alive", "dead", "eperm"]` to structured dict with keys: `alive` (bool), `reason` (str), `errorCode` (str | None). This matches the JS contract in `ensure-rerank-sidecar.cjs:192-202`. Update all callers and tests to use the structured format.

### Rationale
- Structured return provides better error diagnostics
- Matches JS contract for cross-runtime parity
- Enables future extension with additional metadata
- Clearer semantics (alive boolean + reason string)
- Consistent error handling pattern across runtimes

### Consequences
- Python processLiveness returns structured dict
- All callers updated to access dict fields
- Tests updated to return structured dict format
- Better error diagnostics for unknown errno cases
- Parity with JS contract maintained

---

## Summary

All 6 ADRs were accepted to resolve the 9 P1 findings:
- **Schema/Location drift (F2, F37, F38, F70):** ADR-001, ADR-002, ADR-003 (partial), ADR-005 (comment update)
- **Python ↔ JS contract alignment (F1, F69, F101, F102):** ADR-003, ADR-004, ADR-005, ADR-006

Each decision maintains backward compatibility, follows existing patterns, and includes test coverage to validate the contracts.
