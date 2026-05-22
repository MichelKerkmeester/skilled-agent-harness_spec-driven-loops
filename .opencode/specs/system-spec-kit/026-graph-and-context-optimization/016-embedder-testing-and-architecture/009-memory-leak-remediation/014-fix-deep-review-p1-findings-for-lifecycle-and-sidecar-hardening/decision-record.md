---
title: "Decision Record: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening"
description: "Architecture decisions for shared lease helpers, subprocess environment boundaries, test fixture restoration, and P2 deferral policy."
trigger_phrases:
  - "arc 009 phase 014 decisions"
  - "deep review remediation ADR"
importance_tier: "important"
contextType: "decision"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening"
    last_updated_at: "2026-05-22T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "created-phase-014-decision-record"
    next_safe_action: "apply-adrs-during-batch-implementation"
    blockers: []
    key_files:
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0140140140140140140140140140140140140140140140140140140140140140"
      session_id: "009-memory-leak-remediation-014"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Adopt Shared Lease/Ownership Helpers Where Protocols Are Mirrored

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-001, DR009-COR-002, DR009-COR-014, DR009-COR-015, DR009-MNT-002 |

<!-- ANCHOR:adr-001-context -->
### Context
The review found double-acquire and drift risks in deep-loop locks, Code Graph owner leases, rerank sidecar ledgers, and launcher heartbeat refresh. These protocols are mirrored across TS and CJS in some surfaces.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision
Prefer a shared helper or shared algorithm contract with parity tests instead of independently patching each call site.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered
- Patch each call site independently: faster locally, but preserves drift risk.
- Shared helper only: cleaner, but may be too broad for one batch if module boundaries resist it.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences
- Fewer protocol forks after B1.
- Slightly more up-front design work.
- If a true shared helper is too risky, parity tests become mandatory evidence.
<!-- /ANCHOR:adr-001-consequences -->

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks
- Clarity: one protocol is easier to reason about than mirrored snippets.
- Systems: owner transfer affects phases 004, 007, 008, and 013.
- Bias: do not create a shared helper if parity tests solve the actual risk with less churn.
- Sustainability: future fixes should land in one place or fail parity tests.
- Scope: B1 owns the helper decision; later batches consume it.
<!-- /ANCHOR:adr-001-five-checks -->

<!-- ANCHOR:adr-001-impl -->
### Implementation Notes
Batch B1 should choose either a shared helper or parity-backed duplicated helpers and record the choice in this ADR before closing DR009-MNT-002.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: Use Explicit Environment Allowlists for Subprocess Boundaries

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-001, DR009-SEC-010, DR009-SEC-012, DR009-SEC-013 |

### Context
Deep-loop executors, Code Graph launchers, CocoIndex binary probes, and rerank sidecar startup cross a local subprocess boundary. The review found full env inheritance, dropped API keys, uncontained binary paths, and dotenv-driven Node runtime injection.

### Decision
Each subprocess boundary should build an explicit environment from an allowlist plus required runtime variables. Dotenv parsing must not execute shell code, and runtime injection variables such as `NODE_OPTIONS` must be filtered unless explicitly needed and tested.

### Consequences
- Reduces accidental secret propagation and injection.
- Requires startup tests to prove required variables still pass.
- May need a small shared env builder to avoid divergent allowlists.
<!-- /ANCHOR:adr-002 -->

---

<!-- ANCHOR:adr-003 -->
## ADR-003: Rewrite Narrow Fixtures When Specs Require Public or Concurrent Behavior

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-TRC-001, DR009-TRC-002, DR009-TRC-003, DR009-TRC-004, DR009-TRC-005, DR009-TRC-006, DR009-TRC-007, DR009-TRC-009, DR009-TRC-010, DR009-TRC-011 |

### Context
Many traceability findings are not missing code fixes; they are missing proof that the completed phase actually satisfied the promised behavior.

### Decision
When a phase spec required public transport, true concurrency, reconnect behavior, parent-death cleanup, or measured RSS, B5 must add or rerun evidence at that level rather than citing helper-only or synthetic tests.

### Consequences
- Higher evidence quality.
- Some tests may be slower or require more controlled fixtures.
- Documentation-only closure is allowed only when the required command cannot run locally and the blocker is recorded.
<!-- /ANCHOR:adr-003 -->

---

<!-- ANCHOR:adr-004 -->
## ADR-004: Keep P2 Deferrals Explicit and Reopenable

| Field | Value |
|-------|-------|
| **Status** | Proposed |
| **Date** | 2026-05-22 |
| **Related Findings** | All P2 findings |

### Context
The review marked 20 findings as P2. Some are cheap correctness/doc fixes; others may be better deferred if they risk churn outside the P1 closure path.

### Decision
P2 findings may be deferred only by changing their checklist status to `deferred` with rationale, owner, and reopen trigger in the final implementation summary.

### Consequences
- P2 work stays visible after P1 closure.
- Parent agent can accept or reject deferrals with concrete trade-offs.
- No P2 disappears silently behind a passing verdict.
<!-- /ANCHOR:adr-004 -->

---

<!-- ANCHOR:adr-005 -->
## ADR-005: Keep Review Artifacts Immutable During Remediation

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | All findings |

### Context
The review report, resource map, and registry are the evidence source for phase 014. Mutating them during remediation would blur which findings existed at review time.

### Decision
Do not modify `review/review-report.md`, `review/resource-map.md`, `review/deep-review-findings-registry.json`, review iterations, or review deltas. Remediation status belongs in this phase's checklist and implementation summary.

### Consequences
- The original review remains auditable.
- Phase 014 becomes the living closure ledger.
<!-- /ANCHOR:adr-005 -->

---

<!-- ANCHOR:adr-006 -->
## ADR-006: Use Exclusive Creation for Lease Acquisition and Flock for Ledger Mutation

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-001, DR009-COR-002, DR009-COR-014, DR009-MNT-002 |

### Context
The B1 races shared the same failure shape: read current owner, write a temporary file, then atomically replace the final file. That makes the write durable, but it does not make the ownership claim exclusive.

### Decision
Use exclusive creation on fresh TS/CJS lease paths and treat `EEXIST` as a losing acquisition: deep-loop lock source now uses the moved runtime path `.opencode/skills/deep-loop-runtime/lib/deep-loop/loop-lock.ts`, Code Graph TS uses `.opencode/skills/system-code-graph/mcp_server/lib/owner-lease.ts`, and the launcher mirror uses `.opencode/bin/mk-code-index-launcher.cjs`. Use `fcntl.flock` around rerank sidecar ledger read-modify-write operations in `.opencode/skills/system-rerank-sidecar/scripts/sidecar_ledger.py`.

### Consequences
- Fresh concurrent acquisition has a single winner in the targeted tests.
- The CJS launcher remains bootstrap-safe before the TypeScript build exists.
- DR009-MNT-002 is closed with parity coverage in `owner-lease.vitest.ts` and `launcher-lease.vitest.ts`; a generated CJS contract remains a future cleanup candidate if the launcher build pipeline changes.
<!-- /ANCHOR:adr-006 -->

---

<!-- ANCHOR:adr-007 -->
## ADR-007: Require All Supplied Cancel Identities to Match

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-013 |

### Context
`CancelRequest` accepts `reqId`, `indexId`, or both. The previous OR-match let a stale `reqId` cancel the row for a fresh `indexId`, or the reverse.

### Decision
When both identities are supplied, both must match the same active or stale row. Single-identity cancellation remains supported.

### Consequences
- Mismatched identity pairs return `not-found` instead of cancelling unrelated work.
- The rule is covered in `mcp_server/tests/lifecycle/test_cancel_protocol.py`.
<!-- /ANCHOR:adr-007 -->

---

<!-- ANCHOR:adr-008 -->
## ADR-008: Shut Down on Owner-Lease Heartbeat Mismatch

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-015 |

### Context
The Code Graph child refreshed the owner lease periodically, but a failed refresh after owner transfer could be ignored while the process kept serving.

### Decision
Treat a `refreshOwnerLease()` false return in the MCP server heartbeat loop as owner-loss. The child clears its refresh timer, closes IPC/DB resources through `shutdownCodeIndex()`, and exits.

### Consequences
- A process that no longer owns the lease does not overwrite the new owner.
- The no-op refresh behavior is covered in `owner-lease.vitest.ts`; launcher transfer behavior remains covered by `launcher-lease.vitest.ts`.
<!-- /ANCHOR:adr-008 -->

---

<!-- ANCHOR:adr-009 -->
## ADR-009: Signal-Triggered Shutdown Must Exit

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-003 |

### Context
Node signal listeners replace the default SIGTERM/SIGINT termination behavior, so running shutdown hooks without exiting can leave the daemon process alive.

### Decision
Signal handlers run registered shutdown hooks and then terminate with a conventional code: 143 for SIGTERM, 130 for SIGINT, and 1 when any hook fails.

### Consequences
Cleanup remains best-effort and bounded by hook timeouts, but operator signals regain terminal semantics.
<!-- /ANCHOR:adr-009 -->

---

<!-- ANCHOR:adr-010 -->
## ADR-010: Cancellation Checks Precede Success Mutation

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-005 |

### Context
Cancelled CocoIndex updates previously ran FTS sync and marked initial indexing complete from a `finally` block.

### Decision
Project index updates record a local completion flag and mutate FTS/initial-index state only after the update stream completes without cancellation.

### Consequences
Cancelled or failed work clears transient progress but does not advertise a usable initial index.
<!-- /ANCHOR:adr-010 -->

---

<!-- ANCHOR:adr-011 -->
## ADR-011: Config Refresh Waits for Active Work

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-007 |

### Context
Config refresh can be triggered from search/status paths while an index task already holds a captured `Project` object.

### Decision
Before closing a project during config refresh, the registry performs the same bounded active-work drain used by remove-project. If the drain times out, refresh logs evidence and skips the close.

### Consequences
Refresh may defer a config change under active indexing, but it no longer closes DB resources underneath live work.
<!-- /ANCHOR:adr-011 -->

---

<!-- ANCHOR:adr-012 -->
## ADR-012: Sidecar Timeout Cleanup Kills the Process Group

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-008 |

### Context
Embedder timeout cleanup sent SIGTERM to a child and immediately dropped listeners and references.

### Decision
Forked embedder sidecars run as POSIX process-group leaders. Timeout cleanup sends SIGTERM to the group, waits boundedly, escalates SIGKILL to the group, and only then drops child state.

### Consequences
Slow or signal-resistant workers cannot be detached silently before the next request creates another resident worker.
<!-- /ANCHOR:adr-012 -->

---

<!-- ANCHOR:adr-013 -->
## ADR-013: Warmup Registers Before Health

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-009 |

### Context
The rerank warmup path spawned a process and registered it only after health succeeded, leaving timeout-spawned processes unledgered.

### Decision
The ensure helper writes the sidecar ledger row immediately after spawn and before health probing. Warmup timeout then terminates the session and reclaims stale rows.

### Consequences
Every spawned process has an ownership row during warmup, so timeout cleanup and later recovery have an auditable PID.
<!-- /ANCHOR:adr-013 -->

---

<!-- ANCHOR:adr-014 -->
## ADR-014: Close Confirms Success Before Marking Closed

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-010 |

### Context
`Project.close()` marked a project closed before DB close succeeded, hiding failed cleanup and preventing retry.

### Decision
`Project.close()` sets `close_status = "degraded"` and leaves the project retryable on close failure. It marks `_closed = True` only after the underlying DB close succeeds.

### Consequences
Callers no longer get silent success after a failed resource close; repeated close attempts can still release the handle.
<!-- /ANCHOR:adr-014 -->

---

<!-- ANCHOR:adr-015 -->
## ADR-015: Shutdown Drain Leaves Completed History Alone

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-COR-012 |

### Context
Daemon task shutdown previously selected retained completed rows and rewrote them to `cancelling`.

### Decision
Shutdown cancellation targets only live rows with `running` or `queued` status. Completed diagnostic history remains immutable until normal history eviction.

### Consequences
Shutdown evidence no longer corrupts completed task history while still cancelling live work.
<!-- /ANCHOR:adr-015 -->

---

<!-- ANCHOR:adr-016 -->
## ADR-016: Duplicate Task IDs Are Typed Errors

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-MNT-003 |

### Context
The daemon task registry used public task IDs as identity keys but silently overwrote existing rows.

### Decision
Registering an existing task ID raises `DuplicateTaskIdError`. `create_task()` cancels the just-created task when registration fails so the duplicate does not leak.

### Consequences
Duplicate task IDs fail loudly as logical bugs, and completion callbacks cannot mark the wrong row.
<!-- /ANCHOR:adr-016 -->

---

<!-- ANCHOR:adr-017 -->
## ADR-017: Rerank Startup Treats Dotenv as Data

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-001, DR009-SEC-011 |

### Context
The rerank start script sourced dotenv files as shell code and then launched with a narrow environment that dropped API keys before `uvicorn` started.

### Decision
Dotenv loading is a line-oriented safe parser. It exports only explicit rerank/Hugging Face keys and forwards API-key variables through an allowlisted `env -i` launch path.

### Consequences
Startup preserves required credentials without evaluating project-controlled shell syntax.
<!-- /ANCHOR:adr-017 -->

---

<!-- ANCHOR:adr-018 -->
## ADR-018: Warmup Uses the Rerank Auth Gate

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-002 |

### Context
The `/warmup` endpoint could initialize the model without the auth and rate-limit checks used by `/rerank`.

### Decision
Both endpoints call the same authentication helper, and `/warmup` also consumes the shared rate limiter.

### Consequences
Warmup no longer exposes an unauthenticated high-cost model-load path.
<!-- /ANCHOR:adr-018 -->

---

<!-- ANCHOR:adr-019 -->
## ADR-019: Sidecar Ownership Requires High-Entropy Proof

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-003, DR009-SEC-016, DR009-MNT-001 |

### Context
Reusable rerank sidecars were identified by predictable project-derived tokens, and health checks accepted any local responder on the expected port.

### Decision
Ensure helpers persist a random `token_urlsafe(24)` owner token, pass only its SHA-256 digest through `/health`, and also verify the canonical config hash before reuse. Python and CJS helpers share parity coverage for this contract.

### Consequences
A localhost process must prove possession of the project token and matching configuration before reuse.
<!-- /ANCHOR:adr-019 -->

---

<!-- ANCHOR:adr-020 -->
## ADR-020: Rerank Inputs and Logs Are Bounded

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-005, DR009-SEC-008 |

### Context
Rerank request validation capped item count but not document bytes, and optional audit logs could persist raw query text indefinitely.

### Decision
Requests enforce `RERANK_MAX_DOCUMENT_BYTES` before scoring. Logs redact query text by default, emit a SHA-256 digest for correlation, and rotate through `RERANK_LOG_MAX_BYTES`; raw query logging requires explicit opt-in.

### Consequences
Large payloads fail before model work, and logs no longer retain sensitive query text by default.
<!-- /ANCHOR:adr-020 -->

---

<!-- ANCHOR:adr-021 -->
## ADR-021: Trust-Remote-Code Models Require Revision Pins

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-006 |

### Context
Extra allowlisted rerank models could enable `trust_remote_code` without an immutable revision.

### Decision
Every model in the trust-remote-code allowlist must include a 40-character commit revision. Startup rejects unpinned entries.

### Consequences
Operators can still opt into extra remote-code models, but execution is pinned to a reviewed commit.
<!-- /ANCHOR:adr-021 -->

---

<!-- ANCHOR:adr-022 -->
## ADR-022: Code Graph Paths Stay Workspace-Contained

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-007, DR009-SEC-010, DR009-SEC-017 |

### Context
Code Graph accepted database, binary, and IPC paths that could escape the workspace or reclaim unrelated filesystem nodes.

### Decision
DB-dir overrides and `COCOINDEX_BIN_PATH` are resolved, canonicalized, and checked against the workspace before use. IPC socket unlinking requires workspace containment, socket type, and same uid.

### Consequences
Operator overrides remain available only for workspace-local assets, and stale IPC cleanup cannot unlink arbitrary files.
<!-- /ANCHOR:adr-022 -->

---

<!-- ANCHOR:adr-023 -->
## ADR-023: Code Graph Launches Without Project Node Runtime Flags

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-013 |

### Context
Project dotenv values could inject `NODE_OPTIONS` or related Node runtime variables into launcher child processes.

### Decision
The launcher dotenv parser only accepts Code Graph keys, and child process environments strip `NODE_*` plus npm runtime variables.

### Consequences
Project-local dotenv files cannot alter Node module loading, inspector state, or runtime flags for the Code Graph server.
<!-- /ANCHOR:adr-023 -->

---

<!-- ANCHOR:adr-024 -->
## ADR-024: Metadata Commands Use Arg Arrays

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-014 |

### Context
Stored Code Graph metadata was interpolated into shell commands for git diff operations.

### Decision
Metadata-derived git commands now use `execFileSync` with argv arrays, and revision strings must satisfy SHA validation before use.

### Consequences
Stored metadata is treated as data, not shell syntax.
<!-- /ANCHOR:adr-024 -->

---

<!-- ANCHOR:adr-025 -->
## ADR-025: External Executors Receive Minimal Environments

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-012 |

### Context
Deep-loop CLI executors inherited the full parent environment, including unrelated tokens.

### Decision
Non-native executor spawns use a common environment allowlist plus executor-specific credential prefixes. Native execution keeps the parent environment because it does not cross the external CLI boundary.

### Consequences
CLI dispatch receives only the credentials expected for that executor.
<!-- /ANCHOR:adr-025 -->

---

<!-- ANCHOR:adr-026 -->
## ADR-026: Process Control Uses Ownership Evidence

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-05-22 |
| **Related Findings** | DR009-SEC-009, DR009-SEC-015 |

### Context
Model switching killed sidecars by command substring, while process inventory emitted owner tokens in command text.

### Decision
Model switching reads the rerank sidecar ledger and signals only exact PIDs with the current project owner token. Process inventory and sweep output redact API keys, secrets, and owner tokens before storage or display.

### Consequences
Process control is tied to ownership evidence, and diagnostics no longer leak reusable owner tokens.
<!-- /ANCHOR:adr-026 -->
