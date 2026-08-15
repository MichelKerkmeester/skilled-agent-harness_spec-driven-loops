# Iteration 10: Axis 8 — Single-Host Multi-Session Concurrency

## Focus
Design the concurrency model for one relay with N Pi RPC children: process model, isolation layers, multiplexing, conflict policy, and the PWA surface. Prior art: Claude Code server-mode capacity/worktree spawning, tmux's isolation limits, OpenCode's coordinator/child orchestration proposals.

## Findings

### F1. Claude Code server mode: capacity + worktree spawn
- `claude remote-control --capacity <N>` (default 32 concurrent remote sessions); `--spawn=session` is single-session and incompatible with capacity; `--spawn=worktree` gives each session an isolated Git worktree; `same-dir` sessions share files and **can conflict** ([SOURCE: code.claude.com/docs/en/remote-control]).
- Parallel sessions share account rate limits; 429s are mitigated by reducing parallelism ([SOURCE: code.claude.com/docs/en/claude-code-on-the-web]).
- Implication: the reference's answer to "N sessions" is capacity + opt-in worktree; same-dir conflicts are the user's problem.

### F2. tmux: organizational isolation ≠ resource isolation
- Sessions/windows/panes are UI organization; they do not isolate CPU, memory, filesystem, network, or signals; real isolation needs cgroups/systemd scopes, containers, or VMs; control-plane separation needs separate servers (`tmux -L`) ([SOURCE: github.com/tmux/tmux/wiki/Getting-Started], [SOURCE: github.com/tmux/tmux/wiki/Advanced-Use]).
- Implication: a concurrency design must name its isolation layers honestly: organizational (per-child, per-epoch) vs resource (host mechanisms).

### F3. OpenCode orchestration proposals: the missing durable-scheduling layer
- Coordinator session + child sessions (`session.promptAsync`, `parentID`), per-agent permissions, worker risk separation, bounded scheduler (3-5 workers), separate worktrees for write workers, atomic task claims in persistent storage (SQLite WAL), pull-based result retrieval, explicit lifecycle `queued → running → blocked | completed | failed | cancelled`, abort cascade, and restart reconciliation ([SOURCE: dev.opencode.ai/docs/agents/], [SOURCE: github.com/anomalyco/opencode/issues/20849], [SOURCE: github.com/anomalyco/opencode/issues/19215]).
- Implication: durable claims + explicit lifecycle + reconciliation are the concurrency primitives — 003's catalog + mutation ledger already provide the durable substrate.

## Design: Axis 8 deliverables

### Process model
- One relay process, N Pi RPC children (003 REQ-001 — already one child per active session). Capacity: configurable `maxConcurrentSessions` with a sane host default (4-8) and a hard cap; a "reserved control lane" (003 REQ-005) is never consumed by session traffic.
- Supervision per axis 6 (on-failure restart, backoff, health pings) applies per child; a crashed child's session parks with `error` attention without affecting siblings — **per-session fault isolation** (one session's needs_input/crash never blocks others).

### Isolation layers (named honestly, per tmux lesson)
1. **Organizational**: per-child process, per-epoch immutable streams, per-session catalog rows, per-session lease ledger entries. One session cannot read another's envelopes (catalog is workspace-scoped, 003).
2. **Workspace/FS**: a session binds to a registered workspace (axis 6/9). Two sessions on the same workspace → conflict policy (below). Optional `worktree` mode: session creates a Git worktree; its identity is recorded in session meta as `worktreeOf: ws-<opaque>` (redacted-safe).
3. **Resource**: relay-level per-child caps where the host supports them (cgroup/systemd scope integration, documented as host-dependent); worst case, capacity is the only global governor. No VM/container claim is made.

### Conflict policy (the reference's unsolved problem)
- Ledger-backed **workspace write lease**: the first session to take a write action on a workspace holds the lease; a second session attempting a write to the same workspace either waits (queued, visible in transcript) or parks with `needs_input` ("workspace busy — take over or wait"). Dependency-lock files (package-lock, migrations) are always serialized via this lease. Read-only sessions never contend.
- This is strictly better than the reference: same-dir conflicts are prevented by a durable lease instead of surfacing as lost edits.

### Multiplexing
- One authenticated WSS per device; envelopes already carry `sessionOpaqueId + epoch + seq` — multiplexing is purely a transport fan-out; per-session queues with the reserved control lane (003 REQ-005) keep one slow session from starving another. Attention events (axis 3) are per-session but coalesced per class in the notification layer.

### Cross-session governance
- **Approvals**: one global "pending approvals" queue across sessions; each entry binds to its session + lease (006 CAS unchanged); deciding in one session never affects another.
- **Budgets**: per-host aggregate token/cost budget with per-session allocation (axis 1b `transcript.usage`); the PWA renders a cross-session budget ring; hitting the aggregate → new `session.create` blocked with an explicit reason event.
- **Lifecycle**: `queued → running → parked|completed|failed|cancelled`; `run.stop` is per-session (no implicit cascade — sibling sessions are peers, not children); reconciliation on relay restart restores catalog state from the ledger (003 crash-safety).

### PWA surface
- The session list (axis 5) is the concurrency surface: per-session cards with attention badges, per-session transcripts, quick-switcher between sessions, pinned sessions, cross-session approval queue, cross-session budget ring. "New run" (axis 6) is the create point; capacity is shown ("3 of 6 active") with a clear reason when full.

### Why this exceeds the reference
- Reference: capacity default 32 with same-dir conflicts on by default and worktree opt-in; no durable conflict resolution; shared rate limits without surfacing.
- Pi: durable workspace write leases prevent conflicts, per-session fault isolation, explicit lifecycle + reconciliation, cross-session approval/budget governance, and honest per-layer isolation — all on the 003 ledger that already exists.

## Sources Consulted
- [SOURCE: https://code.claude.com/docs/en/remote-control]
- [SOURCE: https://code.claude.com/docs/en/claude-code-on-the-web]
- [SOURCE: https://github.com/tmux/tmux/wiki/Getting-Started]
- [SOURCE: https://github.com/tmux/tmux/wiki/Advanced-Use]
- [SOURCE: https://dev.opencode.ai/docs/agents/]
- [SOURCE: https://github.com/anomalyco/opencode/issues/20849]
- [SOURCE: https://github.com/anomalyco/opencode/issues/19215]
- [SOURCE: specs/cli-external-orchestration/041-pi-remote-mobile-agent-like-cc/003-relay-protocol-and-state/spec.md]

## Assessment
- newInfoRatio: 0.70
- Novelty justification: workspace write leases, per-session fault isolation framing, and cross-session approval/budget governance are new design; CC capacity, tmux isolation honesty, OpenCode lifecycle primitives consolidate prior art.
- Confidence: high on prior art; design maps to 003 catalog/ledger contracts.

## Reflection
- What worked: naming isolation layers explicitly (organizational/workspace/resource) — it forced the conflict policy into the design.
- What failed / ruled out: container/VM per session (outside scope, host-dependent); implicit abort cascades (sessions are peers); unbounded capacity (host is a laptop-class machine).
- Ruled out: same-dir silent concurrent writes (the reference's default — rejected as the failure mode).

## Recommended Next Focus
Cross-cutting pass A: reconcile every convenience design against the 001 threat baseline + 004/007 redaction boundaries — find violations and gaps before synthesis.
