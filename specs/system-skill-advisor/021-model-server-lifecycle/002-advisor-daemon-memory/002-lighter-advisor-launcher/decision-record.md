---
title: "Decision Record: Phase 2: lighter-advisor-launcher"
description: "No-go on folding the advisor launcher into the advisor server: the launcher is the only process that cleans up the model server and the leases when the advisor server dies."
trigger_phrases:
  - "lighter advisor launcher decision"
  - "advisor launcher no-go"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: decision-record | v2.2 -->
# Decision Record: Phase 2: lighter-advisor-launcher

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:adr-001 -->
## ADR-001: Keep the launcher as a separate parent process (no-go)

<!-- ANCHOR:adr-001-context -->
### Context

Measured on this machine on 2026-10-21:

| Process | Earlier audit, 2026-10-21 morning | This phase, 2026-10-21 afternoon |
|---------|------|------|
| Advisor launcher | about 53 MB | 53 and 57 MB |
| Advisor server | 62 to 100 MB | 66 and 103 MB |
| Bare `node` process | 47 MB | 50 MB |

Both columns come from `ps -axo pid,ppid,rss,command` on this machine; the afternoon column sampled the two live advisor pairs once, and a `node -e` sleeping for three seconds.

The launcher's own logic costs a few MB; only removing the process would save about 50 MB per checkout. GPT-6 Luna mapped the launcher's jobs read-only, and the orchestrator checked the deciding lines.

The launcher loads the environment and builds missing runtime artifacts, holds and heartbeats the owner lease, spawns the advisor server, and supervises the model server: the demand listener, respawn with backoff, crash-loop give-up, the RSS watchdog and idle eviction. When the advisor server exits for any reason, the launcher's `exit` handler (`.skilled/bin/system-skill-advisor-launcher.cjs:1436`) stops the model server and clears every lease file. `hf-model-server.cjs` has no check on its own parent: it handles only SIGINT, SIGTERM, SIGHUP and SIGQUIT (`hf-model-server.cjs:1139-1186`), its stdio is inherited so no pipe closes, and its idle eviction lives in the launcher's supervision code.

That cleanup covers only one direction. When the launcher itself dies, the model server is already left behind today: a SIGKILL skips every handler, and the launcher's `uncaughtException` handler clears the leases but not the model server (`system-skill-advisor-launcher.cjs:1489-1496`). The next supervisor that finds that server alive backs off and never adopts it (`model-server-supervision.cjs:1318-1320`), so the orphan keeps its model loaded and keeps serving the shared socket. The leases are not part of the argument, because a dead owner's lease is reclaimed as stale (`system-skill-advisor-launcher.cjs:568-616`).

### Launcher Job Map

| Job | Where | Could the advisor server do it? |
|-----|-------|---------------------------------|
| Environment loading, child env filtering, build or install of stale artifacts | `system-skill-advisor-launcher.cjs:70`, `:118`, `:296`, `:1293` | Partly: the server runs from built output, so a caller must still build first |
| Owner lease acquire, heartbeat, stale-owner takeover, release | `:432`, `:446`, `:568-616`, `:640` | Yes, with the same lease format |
| Bootstrap lock for two sessions starting at once | `:1390` | Yes, with the lease |
| Spawn the advisor server, record pids and socket, recycle an old build | `:756`, `:842`, `:947`, `:1430` | Not needed in one process |
| Model server demand listener, spawn, respawn with backoff, crash-loop give-up, RSS watchdog, idle eviction | `:1085`; `model-server-supervision.cjs:243`, `:283`, `:961`, `:1002`, `:1199-1253` | Yes while the server lives; none of it survives the server's crash |
| Cleanup when the advisor server exits: stop the model server, clear leases | `:1436-1453` | No: a process cannot clean up after its own SIGKILL |

The only automatic spawner is the advisor CLI (`skill-advisor-cli.ts:1113`); the launcher path is also a documented manual entry point (`.skilled/bin/README.md:162`) and a test target.
<!-- /ANCHOR:adr-001-context -->

<!-- ANCHOR:adr-001-decision -->
### Decision

No-go. The merge would not create the leak, but it would widen it: supervision would move into the advisor server, the process most likely to run out of memory, so every advisor crash would also leave the model server loaded (about 470 MB) with no one to evict it. Today an advisor crash is still cleaned up by the launcher. That loses more than the 50 MB the change would save, and the spec's risk table makes a lost recovery path a no-go.
<!-- /ANCHOR:adr-001-decision -->

<!-- ANCHOR:adr-001-alternatives -->
### Alternatives Considered

1. **Fold the launcher into the advisor server now**: rejected for the reason above.
2. **Keep the launcher path as a transient thin wrapper that execs the server**: rejected. It keeps the entry point but still leaves no resident process to clean up after a crash.
3. **A parent-death exit in the model server**: not built here. If the model server exited when its parent died, a crash of either design would free its memory. It changes the model server's lifecycle and needs its own phase.
4. **Reap an orphaned model server at supervisor startup**: not built here. The next supervisor can read the recorded pid file, see that the server's parent is PID 1 (`model-server-supervision.cjs:355-365` reads the parent pid, and `:727-735` already treats a PID 1 parent as orphaned for the respawn lock), and reap it with the existing reap path (`:1287-1301`); the next embedding reloads in under half a second. It needs no change to the model server and would also fix today's launcher-death leak, so it is worth doing on its own. Either 3 or 4 would remove the reason for this no-go, which then becomes a straight 50 MB trade against crash isolation.
<!-- /ANCHOR:adr-001-alternatives -->

<!-- ANCHOR:adr-001-consequences -->
### Consequences

- Each checkout that runs an advisor keeps two Node processes, about 50 MB more than one would need.
- Phase 001's idle default already removes the larger cost, the loaded model, but only for a supervised server.
- An orphaned model server, left by a launcher that died, stays loaded until something kills it. Alternative 4 is the fix for that, with or without a later merge.
<!-- /ANCHOR:adr-001-consequences -->
<!-- /ANCHOR:adr-001 -->

---

<!-- ANCHOR:adr-002 -->
## ADR-002: The build criteria do not apply after a no-go

<!-- ANCHOR:adr-002-context -->
### Context

AC-002 and AC-003 describe the build that a go would have started.
<!-- /ANCHOR:adr-002-context -->

<!-- ANCHOR:adr-002-decision -->
### Decision

AC-002 and AC-003 are superseded by AC-004, which closes the phase on a no-go with no code change.
<!-- /ANCHOR:adr-002-decision -->

<!-- ANCHOR:adr-002-alternatives -->
### Alternatives Considered

1. **Leave them Unmet**: rejected. The phase could then never close, although its question is answered.
<!-- /ANCHOR:adr-002-alternatives -->

<!-- ANCHOR:adr-002-consequences -->
### Consequences

- A later phase that reopens the merge writes its own build criteria.
<!-- /ANCHOR:adr-002-consequences -->
<!-- /ANCHOR:adr-002 -->

---
