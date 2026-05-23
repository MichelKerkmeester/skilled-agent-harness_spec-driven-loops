---
title: "Decision Record: Investigation P0 Fixes for Resource Exhaustion and Symlink Attack"
description: "Architecture Decision Records for F12, F13, and F47 P0 remediation."
trigger_phrases:
  - "arc 010 p0 decisions"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/002-fix-sidecar-investigation-findings-for-resource-bounds-and-lifecycle/001-fix-investigation-p0s-for-resource-exhaustion-and-symlink-attack"
    last_updated_at: "2026-05-23T06:45:00Z"
    last_updated_by: "devin"
    recent_action: "recorded-p0-adrs"
    next_safe_action: "proceed-to-p1-phase"
    blockers: []
    completion_pct: 100
---
# Decision Record: Investigation P0 Fixes for Resource Exhaustion and Symlink Attack

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: IPC line cap value — 1MB

**Status**: Accepted
**Date**: 2026-05-23
**Findings**: F12, F47

### Context

Sidecar IPC uses newline-delimited JSON over stdout/stdin with no per-line size limit. A malicious or buggy child/parent can send arbitrarily large JSON lines, exhausting process memory.

### Decision

Set `MAX_LINE_BYTES = 1024 * 1024` (1MB) on both client stdout (`sidecar-client.ts`) and worker stdin (`sidecar-worker.ts`).

### Rationale

- 1MB is 100x larger than typical embedding response lines (~10KB for a 768-dim vector) — provides ample headroom for future model growth
- Large enough to accommodate legitimate embedding metadata extensions
- Small enough to prevent trivial memory exhaustion (sending 100MB lines)
- Symmetric across client and worker for defense-in-depth

### Alternatives Considered

- **64KB cap**: Too tight for potential future use cases with per-vector metadata or large batch sizes
- **No cap**: Unacceptable — leaves the DoS vector open
- **Configurable via env var**: Added complexity with no immediate benefit; can be added later if needed

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Stdout buffer cap value — 10MB

**Status**: Accepted
**Date**: 2026-05-23
**Finding**: F12

### Context

`sidecar-client.ts` accumulates stdout data in `stdoutBuffer` between newline boundaries. A child process that sends data without newlines can grow this buffer unbounded.

### Decision

Set `MAX_STDOUT_BUFFER_BYTES = 10 * 1024 * 1024` (10MB). On overflow, drop the buffer, emit `dispatch_failure`, and terminate the child.

### Rationale

- 10MB provides a generous window for accumulating partial lines from high-throughput embeddings
- The line-level cap (1MB) already prevents individual lines from being too large
- If a child sends >10MB without a newline, it is either malicious or severely buggy — termination is appropriate

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Crypto-random temp file suffix + exclusive create

**Status**: Accepted
**Date**: 2026-05-23
**Finding**: F13

### Context

`ensure-rerank-sidecar.cjs` wrote ledger temp files using predictable names (`${target}.tmp.${process.pid}.${Date.now()}`) with `writeFileSync`, which follows symlinks. An attacker with local filesystem access could pre-create a symlink at the predicted path, causing the write to target an arbitrary file.

### Decision

Replace predictable suffix with `crypto.randomBytes(16).toString('hex')` and use `openSync(tmp, 'wx')` for exclusive-create semantics. On EEXIST, the error propagates and the sidecar spawn fails safely.

### Rationale

- `crypto.randomBytes(16)` provides 128 bits of entropy — collision probability is negligible
- `'wx'` flag fails-fast on any existing path (file, symlink, directory) instead of following symlinks
- No external dependency required (crypto and fs are built-in)
- Fails closed: if a collision somehow occurs, the ledger write fails rather than silently corrupting

### Alternatives Considered

- **`mkstemp`-style API**: Not available in Node.js without third-party libraries; the crypto-random approach is equivalent
- **File locking (fcntl)**: Complementary but not a substitute for unpredictable names — addresses a different threat (concurrent writes)
- **Keep predictable names but use `O_NOFOLLOW`**: Node.js `fs.openSync` does not expose `O_NOFOLLOW` directly; `'wx'` provides equivalent safety

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Input array length cap — 500 items

**Status**: Accepted
**Date**: 2026-05-23
**Finding**: F47

### Context

`sidecar-worker.ts` allocates embedding vectors for all items in a single request. Without a length cap, a large `input` array (e.g., 10,000 strings) causes unbounded memory allocation on the worker side.

### Decision

Set `MAX_INPUT_ITEMS = 500`. In `parseRequest()`, reject embed requests where `input.length > 500` before any allocation occurs.

### Rationale

- 500 items is the current maximum batch size used by the embedding pipeline
- Defense-in-depth: client-side `SidecarClient.embed()` controls batch sizes, but the worker should not trust the client
- Fails with a typed error message that propagates to the parent via the error response channel
- Can be increased later if batch sizes grow, via a simple constant change