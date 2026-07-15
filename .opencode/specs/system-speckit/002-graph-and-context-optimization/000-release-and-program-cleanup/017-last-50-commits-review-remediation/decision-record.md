---
title: "Decision Record: Remediation of the 016 Last-50-Commits Deep Review"
description: "Architectural decisions for the 016 remediation packet: the keystone single ordered shutdown path (ADR-001), and the deliberate accept-no-action calls for items that were already correct by design (F-002 lease EPERM, F-A3-01/02 reciprocal contradicts edges, F-CC-01 coverage gap with sound code, F-CC-P2-01/02 low-risk unreviewed tooling)."
trigger_phrases:
  - "016 remediation decision record"
  - "single ordered shutdown path decision"
  - "lease EPERM accept-no-action"
  - "reciprocal contradicts edges dormant"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/017-last-50-commits-review-remediation"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Recorded the keystone shutdown decision + the deliberate accept-no-action calls"
    next_safe_action: "Operator builds + deploys the dist"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "last-50-commits-review-remediation-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Decision Record: Remediation of the 016 Last-50-Commits Deep Review

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Unify the divergent shutdown signal-handler stacks into one ordered path

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-05 |
| **Deciders** | main_agent |

---

<!-- ANCHOR:adr-001-context -->
### Context

The 016 review found two divergent signal-handler stacks (`context-server.ts:1681-1692` exiting 0 vs `lib/runtime/shutdown-hooks.ts:129-148` exiting 143/130) that could race under a concurrent-session SIGTERM and bypass `fatalShutdown`'s ordered drain. F-A4-01's recoverability (boot repairs the dirty marker and re-enqueues incomplete jobs) implicitly assumes that ordered drain runs; the race breaks that assumption and couples the dirty-WAL window (F-A4-01) with the non-re-entrant socket server (F-A4-03) into a worse combined failure. F-X19-02 was named the keystone of the A4 lifecycle cluster.

### Constraints

- The shutdown path must remain deterministic from any signal and produce one exit code.
- The ingest worker must be fenced before `closeDb` so it cannot resurrect a closed DB and re-dirty the WAL.
- No DB schema, MCP wire protocol, or lease-file format may change.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: to collapse the two handler stacks into a single ordered shutdown path with a deterministic exit code, and to fence the ingest worker (`job-queue.stopWorker()`/`shuttingDown` + a non-reopen DB accessor) before `vectorIndex.closeDb()`.

**How it works**: every termination signal routes through one ordered teardown — file-watcher first (preserving the existing `:1586-1592` ordering), then the ingest-worker fence, then `closeDb` — and the worker switches to the non-reopen accessor once the shutting-down signal is set, so it can never reopen the DB after close.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Unify to one ordered path + worker fence (chosen)** | Deterministic exit; closes the dirty-WAL window; one place to reason about teardown | Touches three files together | 9/10 |
| Worker fence only, leave the two handler stacks | Smaller diff | The handler race can still bypass the drain, so the fence is not guaranteed to run | 4/10 |
| Switch the worker to `tryGetDb()` only | Stops DB resurrection cheaply | Does not fix the non-deterministic exit or the bypassed ordered drain | 5/10 |

**Why this one**: only unifying the path AND fencing the worker removes both the non-determinism and the dirty-WAL window; the partial options leave the keystone race intact.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- One ordered teardown with a deterministic exit code under concurrent-session SIGTERM.
- The ingest worker can no longer reopen the DB after `closeDb`, so the dirty-marker + non-empty-WAL at-rest window is closed.

**What it costs**:
- The fence adds one ordering dependency in `fatalShutdown`. Mitigation: it mirrors the existing file-watcher-first ordering, so the pattern is already established.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| The fence ordering regresses if `fatalShutdown` is later edited | M | New job-queue tests assert the worker is fenced before `closeDb` |
| The fix is not live until deploy | M | Documented deploy note; the running daemon uses the current dist |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Keystone P1; the race is operationally reachable under the concurrent-session daemon |
| 2 | **Beyond Local Maxima?** | PASS | Three alternatives scored; the partial options leave the race intact |
| 3 | **Sufficient?** | PASS | Unify + fence removes both the non-determinism and the dirty-WAL window |
| 4 | **Fits Goal?** | PASS | Directly closes the highest-leverage A4 lifecycle finding |
| 5 | **Open Horizons?** | PASS | One ordered path is easier to extend than two divergent stacks |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `mcp_server/context-server.ts` — single ordered `fatalShutdown` path; worker fenced before `closeDb`.
- `lib/runtime/shutdown-hooks.ts` — folded into the single path with a deterministic exit code.
- `lib/ops/job-queue.ts` — `stopWorker()`/`shuttingDown` guard + non-reopen DB accessor.

**How to roll back**: revert the three Stream 1 commits together; re-run the job-queue + drift tests against the pre-fix baseline to confirm green. The running daemon is unaffected until the dist is built and deployed.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: Accept F-002 (lease EPERM reclaim) with no code change

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-05 |
| **Deciders** | main_agent |

### Decision

**We chose**: to make no code change for the lease EPERM reclaim double-block. EPERM-on-live is the documented-correct cross-sandbox semantic — only the cross-uid PID-reuse corner wedges, and treating EPERM as "not held" would be unsafe across sandboxes.

**Why this one**: the behaviour is correct by design; a "fix" would weaken the cross-sandbox safety guarantee to address a corner that does not occur in the supported deployment.

---

## ADR-003: Accept F-A3-01 / F-A3-02 (reciprocal `contradicts` edges) with no code change

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-05 |
| **Deciders** | main_agent |

### Decision

**We chose**: to make no code change for the opt-in `contradicts` collector materializing reciprocal pairs. No consumer assumes mutual exclusivity, and the trust-tree is dormant in production (`memory_context`/`memory_search` pass no `causal:` key).

**Why this one**: the directional model is sound for every live consumer; reconciling reciprocal pairs would add machinery for a path that nothing in production exercises.

---

## ADR-004: Record F-CC-01 (review coverage gap) as honest disclosure, no remediation

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-05 |
| **Deciders** | main_agent |

### Decision

**We chose**: to record F-CC-01 with no code change. The 016 security pass never opened the range's primary cross-tenant handlers (`memory-search.ts` IDOR guard + `memory-context.ts` no-session anchor); iter-20 read them and confirmed the fixes are sound. This is a closed review-coverage gap, not a defect.

**Why this one**: there is no code finding to remediate; recording it keeps the review chain honest about what was and was not covered.

---

## ADR-005: Accept F-CC-P2-01 / F-CC-P2-02 (low-risk unreviewed tooling) with no code change

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-05 |
| **Deciders** | main_agent |

### Decision

**We chose**: to make no code change for the residual unreviewed low-risk tooling/CI scripts (doctor, deep-improvement, comment-hygiene). They are outside the commit range's hotspot set; a regression there is unlikely but not asserted as clear.

**Why this one**: opening them is review scope, not a remediation; they carry no traced finding and are explicitly out of the frozen actionable list.

---

## ADR-006: Keep both `socket-server.ts` copies byte-identical, enforced by a drift test

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-05 |
| **Deciders** | main_agent |

### Decision

**We chose**: to apply the F-A5-01/F-A5-03 fresh-bind hardening to both the `shared/ipc/socket-server.ts` copy and the system-code-graph fork together, keeping them byte-identical (`diff -q`) and relying on the existing IPC drift test to enforce parity.

**Why this one**: a security fix applied to one fork only would leave the other vulnerable; byte-identical copies plus a drift guard make the parity machine-checkable rather than relying on memory.
