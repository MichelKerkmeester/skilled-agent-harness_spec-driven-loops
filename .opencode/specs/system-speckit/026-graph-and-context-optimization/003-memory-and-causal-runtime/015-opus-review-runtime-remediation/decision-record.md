---
title: "Decision Record: Opus Review Runtime Remediation (013 cross-review)"
description: "Decision record for the four pressure-tested choices behind the 013 cross-review remediation: surgical per-finding fixes, crash-safe restore-swap ordering, buffer-then-decode front-proxy frames, and preserving spec_folder through the reconcileMoves rewrite."
trigger_phrases:
  - "opus review remediation decisions"
  - "surgical fix vs runtime refactor"
  - "crash-safe restore swap ordering"
  - "front-proxy buffer then decode"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/015-opus-review-runtime-remediation"
    last_updated_at: "2026-06-02T16:07:14Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 015 remediation packet from validated 013/002 sibling"
    next_safe_action: "Fix P1-1 checkpoint-restore data-loss crash window first"
    blockers: []
    key_files:
      - "lib/storage/checkpoints.ts"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - "lib/storage/incremental-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "opus-review-remediation-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: Opus Review Runtime Remediation (013 cross-review)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Surgical per-finding fixes over a runtime refactor

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 013 runtime is deployed and live. An independent Opus 4.8 cross-review found 4 P1 correctness defects and 17 P2 advisories — discrete bugs at specific lines, not a structural flaw. The temptation is to rework the restore and front-proxy paths while we are in them.

### Constraints

- The runtime is live; a broad refactor raises regression risk on code that currently works.
- The findings are line-specific, so a minimal diff is both sufficient and easiest to review.
- SCOPE LOCK: only files named in a cited finding may change.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Fix each cited finding with the minimal diff at its exact location and verify every fix against the deployed source before editing; do not restructure or touch non-cited code.

**How it works**: Each finding maps to one surface and one focused change. Every fix that alters runtime behavior gains a vitest that fails on the old behavior and passes on the fix. Documentation findings are reconciled to deployed values with no runtime effect.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Surgical per-finding fixes (chosen)** | Smallest blast radius; easiest review; low regression risk on a live runtime | Local fixes may briefly coexist with older surrounding style | 9/10 |
| Refactor restore + front-proxy while remediating | One pass cleans the whole path | Out of scope; high regression risk on deployed code; harder to verify against findings | 3/10 |

**Why this one**: The cross-review identified specific defects, and a minimal diff fixes each without risking the working parts of a live runtime.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- The 4 P1 defects are corrected with the smallest possible change and clear test evidence.
- Review is fast because each diff maps to one cited finding.

**What it costs**:
- Some local fixes sit next to older surrounding code; that is accepted under SCOPE LOCK.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Touching adjacent code while fixing a cited line | M | Minimal diff; no opportunistic cleanup; grep confirms no non-cited edits |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The cross-review found real correctness defects in a live runtime. |
| 2 | **Beyond Local Maxima?** | PASS | A full refactor was considered and rejected. |
| 3 | **Sufficient?** | PASS | A minimal diff at each cited line resolves each finding. |
| 4 | **Fits Goal?** | PASS | Remediates exactly the cited findings, nothing more. |
| 5 | **Open Horizons?** | PASS | A later refactor remains possible if a real need appears. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `checkpoints.ts`, `launcher-session-proxy.cjs`, `incremental-index.ts`, and the cited docs — each at its cited finding only.

**How to roll back**: Each fix is an independent minimal diff; revert any one in isolation.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Crash-safe restore-swap ordering over leaving the existing window

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

P1-1: the restore swap renames the live database to `.bak` and then renames the snapshot into place. A crash between those two renames leaves no file at the live path, so the daemon boots with no database and the operator must recover by hand. The two-phase restore journal exists, but the cited window can still strand the live path empty.

### Constraints

- The fix must preserve the existing two-phase journal semantics, not replace them.
- Recovery on boot must be deterministic for any partial on-disk state.
- `vec_memories` is a vec0 virtual table; the snapshot is a whole file, so recovery works at the file level.

### Decision

**We chose**: Order the swap so the snapshot is in place before the live file is retired, and make boot recovery reconstruct a single consistent live database from whatever partial swap state is on disk, keeping the journal phases.

**How it works**: The swap sequence and the journal markers are arranged so that at every crash point, recovery can either complete the swap forward or roll it back, and never leaves the live path absent.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Reorder + harden recovery (chosen)** | Closes the empty-live-path window; preserves journal semantics; file-level correctness for vec0 | Requires careful recovery branching for each partial state | 9/10 |
| Leave the window, document the manual `cp` fallback | No code change | Accepts a data-loss crash window on a live runtime | 1/10 |

**Why this one**: The window is a real data-loss path; reordering plus recovery hardening removes it without discarding the journal that already works.

### Consequences

**What improves**:
- A crash at any swap point leaves the daemon able to boot to one consistent live database.

**What it costs**:
- Recovery gains a few branches for partial states. Mitigation: a crash-window vitest covers each.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Reorder regresses journal recovery | H | Preserve journal phases; crash-window vitest proves both forward and backward recovery |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The cited window can leave no live database. |
| 2 | **Beyond Local Maxima?** | PASS | Leaving the window with a documented manual fallback was rejected. |
| 3 | **Sufficient?** | PASS | Reorder plus recovery hardening closes the window for every crash point. |
| 4 | **Fits Goal?** | PASS | Delivers crash-safe restore in the success criteria. |
| 5 | **Open Horizons?** | PASS | The hardened recovery generalizes to future restore changes. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `lib/storage/checkpoints.ts`: swap ordering and boot-recovery branches; the two-phase journal is preserved.

**How to roll back**: Revert the swap-ordering change; the prior behavior (with the documented window) returns.

---

## ADR-003: Buffer-then-decode front-proxy frames over per-chunk decode

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

P1-2: the front-proxy decodes each socket read as UTF-8 immediately. When the OS splits a multi-byte sequence across two reads, each half is decoded separately and the sequence is mangled (replacement characters or corruption). Non-ASCII payloads do not round-trip.

### Constraints

- The accumulator must be bounded so a frame that never completes cannot exhaust memory.
- Decoding must produce byte-identical output to the source frame.

### Decision

**We chose**: Accumulate raw bytes across reads and decode UTF-8 only once a complete frame boundary is reached, with a bounded accumulator.

**How it works**: Inbound bytes append to a buffer; the proxy detects complete-frame boundaries and decodes the whole frame at once, so no multi-byte sequence is ever decoded across a read split.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Buffer then decode on boundary (chosen)** | Byte-identical output; handles any read split; minimal change | Adds one accumulating buffer per connection | 9/10 |
| Incremental UTF-8 decoder that carries partial code points | No explicit frame buffer | More complex state; still must respect frame boundaries; larger diff | 4/10 |

**Why this one**: Decoding only complete frames is the direct fix for the split-sequence corruption and keeps the change small.

### Consequences

**What improves**:
- Multi-byte payloads round-trip intact regardless of how the OS splits reads.

**What it costs**:
- One accumulating buffer per connection. Mitigation: bound it; map an over-long never-completing frame to a clean error.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Buffering mishandles frame boundaries | H | Decode only on complete frames; split-sequence vitest asserts byte-identity |
| Unbounded accumulator on a truncated frame | M | Bound the buffer; clean error on overflow |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Split multi-byte sequences are corrupted today. |
| 2 | **Beyond Local Maxima?** | PASS | An incremental decoder was considered and rejected as larger. |
| 3 | **Sufficient?** | PASS | Decoding whole frames removes the corruption entirely. |
| 4 | **Fits Goal?** | PASS | Delivers byte-identical frame decode in the success criteria. |
| 5 | **Open Horizons?** | PASS | A bounded frame buffer is reusable for future framing needs. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `.opencode/bin/lib/launcher-session-proxy.cjs`: byte accumulation across reads, decode on complete-frame boundary, bounded buffer.

**How to roll back**: Revert to per-chunk decode; the corruption returns but no other behavior changes.

---

## ADR-004: Preserve spec_folder through the reconcileMoves rewrite over re-deriving it

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-02 |
| **Deciders** | Operator, orchestrator |

### Context

P1-3: `reconcileMoves` rewrites rows for moved files but omits `spec_folder` from the rewritten values, so a moved file loses its folder association. The obvious alternative is to re-derive `spec_folder` from the new path.

### Constraints

- The original `spec_folder` value must be preserved verbatim, including NULL.
- Re-derivation from the new path could assign a different folder than the row originally had.

### Decision

**We chose**: Carry the existing `spec_folder` value through the moved-row rewrite verbatim, rather than re-deriving it from the destination path.

**How it works**: The rewrite includes `spec_folder` in the carried-forward columns, so the moved row keeps exactly the association it had before the move.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Carry spec_folder verbatim (chosen)** | Preserves the original association; minimal change; NULL-safe | None material | 9/10 |
| Re-derive spec_folder from the new path | Could "correct" stale associations | Changes semantics; may reassign rows; risk of wrong folder | 3/10 |

**Why this one**: The bug is an omission; the fix is to stop dropping the field, not to invent a new derivation.

### Consequences

**What improves**:
- Moved files retain their original `spec_folder`, including NULL.

**What it costs**:
- Nothing material; one preserved column.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| Carry-through coerces NULL or wrong value | M | Preserve the source value verbatim; reconcile vitest covers set and NULL cases |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Moved rows currently lose `spec_folder`. |
| 2 | **Beyond Local Maxima?** | PASS | Re-derivation was considered and rejected as a semantic change. |
| 3 | **Sufficient?** | PASS | Carrying the field forward restores the association. |
| 4 | **Fits Goal?** | PASS | Fixes exactly the cited omission. |
| 5 | **Open Horizons?** | PASS | No new coupling introduced. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `lib/storage/incremental-index.ts`: include `spec_folder` in the moved-row rewrite.

**How to roll back**: Revert the one-field addition; the prior omission returns.

---

<!--
Level 3 Decision Record: four ADRs, one per pressure-tested decision behind the 013 cross-review remediation.
Human voice: active, direct, specific. HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
