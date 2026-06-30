---
title: "Decision Record: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle"
description: "Decision record for the three code-verified choices behind the MCP front-proxy: launcher-as-proxy over standalone-proxy and bridge-reconnect, in-place daemon recycle, and frame-aware bidirectional parsing with an idempotency classifier."
trigger_phrases:
  - "mcp front proxy decisions"
  - "launcher as proxy vs standalone proxy"
  - "in-place recycle vs self-exit"
  - "idempotency classifier replay safety"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/013-memory-index-scan-implementation/003-mcp-front-proxy"
    last_updated_at: "2026-06-01T00:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored MCP front-proxy packet from judge-panel design"
    next_safe_action: "Land after checkpoint-v2 then dispatch Phase 1 in-place recycle"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/launcher-session-proxy.cjs"
      - "mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mcp-front-proxy-packet-setup"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Decision Record: MCP Launcher-as-Reconnecting-Frame-Proxy with In-Place Daemon Recycle

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Launcher-as-proxy over standalone-proxy and bridge-reconnect

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | Operator, orchestrator, judge panel |

---

<!-- ANCHOR:adr-001-context -->
### Context

The MCP session must survive a daemon recycle transparently. Three topologies were on the table: keep the launcher as the OpenCode `command` and make it the reconnecting proxy (`launcher-as-proxy`); move the `command` to a new standalone proxy binary (`standalone-proxy`); or reconnect inside the existing bridge while leaving the launcher topology mostly as-is (`bridge-reconnect`). On raw scores `standalone-proxy` ranked highest, so the choice needed code verification, not score-following.

### Constraints

- Four client configs (`opencode.json`, `.mcp.json`, `.claude/mcp.json`, `.vscode/mcp.json`) all spawn the launcher as the MCP `command`; the topology must not change for any of them.
- Whatever owns the client `command` is the process the client revives if it dies; nothing else respawns it.
- The reconnect transparency mechanics (cached `initialize`, frame parsing, replay) are the same regardless of topology.
<!-- /ANCHOR:adr-001-context -->

---

<!-- ANCHOR:adr-001-decision -->
### Decision

**We chose**: Keep the launcher as the OpenCode `command` and make it the reconnecting frame-proxy, borrowing `bridge-reconnect`'s transparency engine (frame-aware bidirectional parsing plus idempotency classifier) and running it on the launcher topology.

**How it works**: The launcher owns the client `stdin`/`stdout` for its whole life and bridges to the daemon over the UDS socket. The transparency engine lives inside the launcher, so a daemon recycle never changes which process the client talks to. The `standalone-proxy` topology is explicitly rejected.
<!-- /ANCHOR:adr-001-decision -->

---

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Launcher-as-proxy (chosen)** | No topology change to any of the four client configs; the launcher already has a supervisor; minimal blast radius | The launcher gains an I/O proxy responsibility | 9/10 |
| Standalone-proxy | Clean separation of proxy from launcher | Moving the `command` to a new binary orphans the launcher: `recycleViaGracefulSelfExit` exits it and the supervisor relaunch returns early on `launcherShutdownInProgress`, so nothing self-respawns an exited launcher; the proxy would have to re-own the entire `main()` boot dance (lease, bootstrap lock, build, launch) | 4/10 |
| Bridge-reconnect | Supplies the transparency engine (cached initialize, frame parse, replay) | Ships on the wrong topology, overstates idempotency, and adds a decorative `socket-server.ts` resume preamble that risks back-compat with the other three clients | 5/10 |

**Why this one**: Code verification inverted the raw scores. `standalone-proxy`'s higher score ignored that the launcher is only revived today because it IS the `command`; the moment a proxy becomes the `command`, the launcher is an unsupervised orphan. `launcher-as-proxy` keeps the launcher as the `command` and takes only the transparency engine from `bridge-reconnect`, discarding its wrong topology and its decorative resume preamble.
<!-- /ANCHOR:adr-001-alternatives -->

---

<!-- ANCHOR:adr-001-consequences -->
### Consequences

**What improves**:
- Zero topology change: all four client configs keep spawning the launcher as the `command`.
- The existing launcher supervisor and crash-loop guard keep working unchanged; the tiny proxy is invisible to the RSS watchdog, which samples the daemon subtree.

**What it costs**:
- The launcher takes on an I/O proxy responsibility (~280 LOC). Mitigation: the proxy is I/O-only and isolated in its own module with a small public surface.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| A future move of the `command` to a standalone proxy re-introduces the orphaned-launcher problem | H | Document the launcher-stays-command invariant; the recycle no longer exits the launcher at all |
| The proxy adds latency to steady-state I/O | L | Frame parsing is line-level and cheap; no extra process hop beyond the existing socket |
<!-- /ANCHOR:adr-001-consequences -->

---

<!-- ANCHOR:adr-001-five-checks -->
### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The session must survive a recycle, and only the `command`-owning process is guaranteed to outlive it. |
| 2 | **Beyond Local Maxima?** | PASS | The higher-scored standalone-proxy was code-verified and rejected on the orphaned-launcher finding. |
| 3 | **Sufficient?** | PASS | The launcher topology plus the borrowed transparency engine fully covers transparent reconnect. |
| 4 | **Fits Goal?** | PASS | Delivers REQ-001 and REQ-005 (no sever, no config change) directly. |
| 5 | **Open Horizons?** | PASS | The second-launcher bridge can later route through the same proxy if multi-client transparency is needed. |

**Checks Summary**: 5/5 PASS
<!-- /ANCHOR:adr-001-five-checks -->

---

<!-- ANCHOR:adr-001-impl -->
### Implementation

**What changes**:
- `.opencode/bin/lib/launcher-session-proxy.cjs`: the new reconnecting frame-proxy.
- `.opencode/bin/mk-spec-memory-launcher.cjs`: start the proxy on `process.stdin/stdout` after `launchServer()`; flip child stdio off the MCP channel.

**How to roll back**: Set `SPECKIT_BACKEND_ONLY` off to restore inherited-stdio behavior; the launcher remains the `command` either way.
<!-- /ANCHOR:adr-001-impl -->
<!-- /ANCHOR:adr-001 -->

---

## ADR-002: In-place daemon recycle over launcher self-exit

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | Operator, orchestrator, judge panel |

### Context

The RSS recycle currently exits the launcher: `recycleViaGracefulSelfExit` sets `launcherShutdownInProgress = true` and calls `process.exit(0)`. Because the launcher is the `command`, exiting it severs the client pipe. The recycle itself is needed for memory safety; the mechanism is the problem.

### Constraints

- The launcher already has a child-exit supervisor (lines 817-839) that respawns the daemon, but its relaunch path returns early when `launcherShutdownInProgress` is set.
- The RSS watchdog, backoff, and crash-loop guard must stay untouched.
- The hf-model-server teardown and the SIGTERM->SIGKILL ladder on the child must be preserved.

### Decision

**We chose**: Recycle the daemon child in place. Rename `recycleViaGracefulSelfExit` to `recycleDaemonInPlace`, delete both `process.exit(0)` calls, and stop setting `launcherShutdownInProgress` for the recycle path, so the existing supervisor respawns the daemon and the launcher stays up.

**How it works**: On an RSS breach the watchdog SIGTERMs the daemon child (keeping the SIGKILL ladder). The launcher does not exit and `launcherShutdownInProgress` stays false, so the child-exit supervisor's guard does not suppress relaunch and it respawns the daemon with the existing backoff. `rssBreachSelfExitInProgress` is reset after the relaunch instead of driving an exit.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **In-place recycle (chosen)** | Minimal survivable change; reuses the existing supervisor; the launcher and client pipe never go down | Requires the launcher to no longer own the client pipe as inherited stdio (handled by ADR-001) | 9/10 |
| Keep self-exit, reconnect on the client side | No launcher change | The client cannot transparently reconnect to a `command` that exited; this is the failure being fixed | 2/10 |

**Why this one**: Deleting two `process.exit(0)` calls and not setting one flag is the smallest change that makes the recycle survivable, and it reuses the supervisor that already exists for daemon child exits.

### Consequences

**What improves**:
- An RSS recycle no longer severs the client; the launcher and the client pipe stay up across the event.
- The RSS machinery (watchdog, backoff, crash-loop guard, lease) is untouched.

**What it costs**:
- The recycle path now depends on the child-exit supervisor respawning the daemon. Mitigation: a forced-recycle test asserts the daemon pid changes and the socket re-binds.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `launcherShutdownInProgress` left set would suppress relaunch | H | Explicitly keep it false for the recycle path; test the respawn |
| A genuine launcher crash still needs OpenCode to revive it | L | Unchanged: OpenCode revives the launcher as the `command` on the rare launcher crash |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | The self-exit is the direct cause of the severed client. |
| 2 | **Beyond Local Maxima?** | PASS | Client-side reconnect to an exited command considered and rejected. |
| 3 | **Sufficient?** | PASS | The existing supervisor respawns the daemon once the launcher stops exiting. |
| 4 | **Fits Goal?** | PASS | Delivers REQ-004 (recycle no longer exits the launcher). |
| 5 | **Open Horizons?** | PASS | A stable in-place recycle is the foundation the reconnect engine builds on. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `.opencode/bin/mk-spec-memory-launcher.cjs`: rename the recycle, delete both exits, keep the flag false, reset `rssBreachSelfExitInProgress` after relaunch, rewire `onBreach`.

**How to roll back**: Restore the two `process.exit(0)` calls and the `launcherShutdownInProgress = true` assignment to return to recycle-by-exit.

---

## ADR-003: Frame-aware bidirectional parsing with an idempotency classifier over byte-level piping and at-least-once replay

### Metadata

| Field | Value |
|-------|-------|
| **Status** | Accepted |
| **Date** | 2026-06-01 |
| **Deciders** | Operator, orchestrator, judge panel |

### Context

Two transparency mechanics had to be decided. First, how the proxy moves bytes between client and backend: the existing bridge uses a byte-level `socket.pipe(output)`, which flushes a truncated JSON-RPC line to client stdout if the backend dies mid-frame. Second, what the proxy replays after a reconnect: the bridge-reconnect design replayed all in-flight requests, but only `memory_save` is dedup-guarded, so replaying others is at-least-once over non-idempotent tools.

### Constraints

- A partial backend->client frame already on the client stream corrupts the client's JSON-RPC decode.
- `shouldSendMemory` dedups only `memory_save` by content hash; `memory_delete`, `memory_bulk_delete`, `memory_update`, `checkpoint_restore`, `embedder_set`, and others have no replay guard.
- The verified SDK leniencies (no init-state gating on `_onrequest`, zero server->client requests) make a single cached-`initialize` replay sufficient, and there is no reverse request table to track.

### Decision

**We chose**: Frame-parse both directions and emit only complete frames to the client, and gate replay through an idempotency `classify(frame)` that default-denies the verified-unsafe write set.

**How it works**: The proxy splits newline-framed JSON-RPC in both directions. On backend close it discards any incomplete trailing frame, so a truncated response never reaches client stdout; the originating request stays in `pendingRequests`. After a reconnect, `replayable:true` requests (reads, dedup-guarded `memory_save`, protocol frames) are replayed under their original `id`; `replayable:false` requests get a single `-32001` error with `data.retryable: true` and are never replayed.

### Alternatives Considered

| Option | Pros | Cons | Score |
|--------|------|------|-------|
| **Frame-parse both + classify (chosen)** | No truncated frames reach the client; non-idempotent writes never double-apply | Slightly more code than a raw pipe; a classification table to maintain | 9/10 |
| Byte-level `socket.pipe` + replay-all | Simplest; mirrors the current bridge | Leaks truncated frames on mid-frame death; replays non-idempotent writes at-least-once (double-apply) | 2/10 |

**Why this one**: A raw pipe cannot tell a complete frame from a truncated one, and replay-all silently double-applies destructive operations. Frame parsing plus default-deny classification is the load-bearing safety boundary that makes the reconnect transparent without corrupting the stream or the data.

### Consequences

**What improves**:
- The client stream is never corrupted by a partial frame.
- In-flight reads and idempotent writes resolve transparently; unsafe in-flight writes fail once, retryably, instead of double-applying.

**What it costs**:
- A new tool must be classified or it defaults to deny. Mitigation: a snapshot test fails the build when a new tool is added without a classification, forcing the default-deny review.

**Risks**:

| Risk | Impact | Mitigation |
|------|--------|------------|
| `memory_save` partial-commit double-indexes secondary tables | M | Clean-close barrier makes graceful SIGTERM durable; the safety phase tightens secondary-index atomicity; gated by the partial-commit replay test |
| A new unclassified tool is replayed unsafely | M | Default-deny plus the fail-on-new-tool snapshot test |

### Five Checks Evaluation

| # | Check | Result | Evidence |
|---|-------|--------|----------|
| 1 | **Necessary?** | PASS | Both the truncated-frame leak and the at-least-once replay are verified correctness gaps. |
| 2 | **Beyond Local Maxima?** | PASS | The simpler raw-pipe + replay-all was evaluated and rejected with concrete code evidence. |
| 3 | **Sufficient?** | PASS | Frame parsing plus default-deny replay covers stream integrity and write safety. |
| 4 | **Fits Goal?** | PASS | Delivers REQ-002, REQ-003, and REQ-007 directly. |
| 5 | **Open Horizons?** | PASS | The classifier extends cleanly as new tools are added. |

**Checks Summary**: 5/5 PASS

### Implementation

**What changes**:
- `.opencode/bin/lib/launcher-session-proxy.cjs`: the bidirectional frame splitter, `pendingRequests`, `cachedInitialize`, and `classify`.
- `mcp_server/lib/session/session-manager.ts`: tighten `memory_save` secondary-index atomicity in the safety phase.

**How to roll back**: Revert the proxy module; with `SPECKIT_BACKEND_ONLY` off the launcher falls back to inherited stdio and no replay is attempted.

---

<!--
Level 3 Decision Record: three ADRs, one per code-verified decision.
Human voice: active, direct, specific. HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
