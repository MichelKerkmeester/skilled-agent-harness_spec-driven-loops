---
title: "Decision Record: Launcher Token, Env, and Reindex Cancellation Policy"
description: "ADRs for F15 atomic owner tokens, F49 child env allowlist, and F105 reindex cancellation polling removal."
trigger_phrases:
  - "arc 010 003 004 decisions"
  - "launcher token env reindex cancellation adr"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/003-fix-sidecar-investigation-remaining-p1s-and-p2s-for-resource-bounds-and-deadcode/004-fix-investigation-p1s-for-launcher-and-reindex-deadcode"
    last_updated_at: "2026-05-23T07:05:00Z"
    last_updated_by: "codex"
    recent_action: "Recorded launcher/reindex P1 decisions"
    next_safe_action: "Commit handoff"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0100030040100030040100030040100030040100030040100030040100030040"
      session_id: "010-003-004-launcher-reindex-p1"
      parent_session_id: null
    completion_pct: 100
---
# Decision Record: Launcher Token, Env, and Reindex Cancellation Policy

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core | v1.0 -->

---

## ADR-001: Lock-Protected Atomic Owner Token Publication

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F15 - Missing atomic file write in owner token creation.

### Decision
Create owner tokens through an exclusive `.sidecar-owner-token.lock`, then write a crypto-random temp file with `openSync(tmp, 'wx', 0o600)`, write the token, fsync the file descriptor, close it, and rename the temp file to `.sidecar-owner-token`.

### Rationale
- The previous direct `writeFileSync(..., flag: 'wx')` could expose empty or partially written state during concurrent observation.
- The temp-write/fsync/rename pattern mirrors the earlier F13 atomic-write direction while the lock ensures concurrent launcher processes converge on one token.
- A bounded wait lets losing contenders read the winning token without spinning indefinitely.

### Consequences
- Concurrent launchers return the same persisted owner token.
- Stale lock without a token fails closed after a bounded wait.
- The token file remains a plain-text newline-terminated token for compatibility.

---

## ADR-002: Child Env Allowlist at Launcher Spawn

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F49 - Environment variable leakage to child processes.

### Decision
Replace blanket `...processObj.env` inheritance with `buildSidecarEnv()`. The helper passes only minimal system keys, `LC_*`, `SPECKIT_*`, `RERANK_*`, and `HF_*`, then overlays explicit sidecar runtime values for port, owner token, and config hash.

### Rationale
- Blanket inheritance leaks unrelated credentials and local process state into the sidecar process.
- `RERANK_*` and `HF_*` remain necessary because `system-rerank-sidecar/scripts/start.sh` uses those knobs and then performs its own stricter `env -i` scrub before uvicorn.
- Passing `SPECKIT_*` preserves the opt-in cross-encoder flag and explicit SpecKit runtime controls without exposing arbitrary secrets.

### Consequences
- Custom non-allowlisted parent env vars no longer reach the sidecar child.
- Sidecar startup still receives model, cache, locale, and explicit launcher override values.
- Future env needs must be consciously added to the allowlist instead of inherited by default.

---

## ADR-003: Delete Reindex Mid-Run Cancellation Polling

**Status:** Accepted
**Date:** 2026-05-23
**Context:** F105 - Dead cancellation-polling branches in `runJob`.

### Decision
Remove `getCancellationStatus()` and both `getCancellationStatus(db, jobId) === 'cancelled'` branches inside `runJob`.

### Rationale
- Finding iteration 020 proves `cancelJob()` has zero production callers; it is imported by tests and re-exported from the barrel, but no MCP handler writes `cancelled` during production execution.
- The two polling branches added one DB read per batch for an unreachable state.
- Keeping the branches misrepresented mid-run cancellation as production-supported.

### Consequences
- Queued cancellation before a job runs still works through the initial status guard.
- Mid-run cancellation is not a production feature in this phase.
- A future packet that wires an MCP cancel tool can reintroduce polling with a real caller and tests.
