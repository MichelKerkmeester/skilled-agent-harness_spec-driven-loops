---
title: "MCP Launcher Concurrency Arc — Phase Parent"
description: "Umbrella for the 5-phase arc that delivered single-writer lease enforcement at the launcher boundary across all 3 MCP launchers (skill-advisor, code-graph, spec-memory), plus the review-driven hardening that followed."
trigger_phrases:
  - "mcp launcher concurrency arc"
  - "launcher lease arc"
  - "012 arc"
  - "daemon corruption arc"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency-arc"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Added Phase 005 remediation traceability"
    next_safe_action: "Validate arc parent and child packet"
    blockers: []
    key_files:
      - "001-concurrent-daemon-corruption-fix/spec.md"
      - "002-cross-launcher-lease-propagation/spec.md"
      - "003-launcher-race-and-error-surface-hardening/spec.md"
      - "004-launcher-diagnostics-and-signal-coverage/spec.md"
      - "005-lease-correctness-and-arc-traceability/spec.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v2.2 -->
# MCP Launcher Concurrency Arc

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This is a lean phase-parent control file. Only {spec.md, description.json,
  graph-metadata.json} live here. Heavy docs (plan, tasks, checklist,
  implementation-summary, decision-record) live in each phase child where they
  stay accurate to that phase's actual work. Phase children own their own
  continuity ladders; resume on this parent first follows
  `graph-metadata.json.derived.last_active_child_id`, else lists children with
  statuses (per /spec_kit:resume step 3b).
-->

---

<!-- ANCHOR:root-purpose -->
## 1. ROOT PURPOSE

The three MCP launchers (`mk-skill-advisor-launcher.cjs`, `mk-code-index-launcher.cjs`, `mk-spec-memory-launcher.cjs`) all shared the same architectural smell: nothing prevented multiple launcher instances from running concurrently in the same workspace. Skill-advisor's SQLite quarantine path turned that smell into a visible failure (1005 `.corrupt` files in 6 hours during a benchmark run). Code-graph and spec-memory absorbed the race silently because their WAL + busy_timeout settings happened to be compatible, but the same code-path could have failed under different conditions.

This arc fixes the smell at its source — single-writer enforcement at the launcher process boundary — and propagates the fix uniformly across all 3 launchers. The 5 phases were sized to keep each commit focused on one decision class.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:phase-map -->
## 2. SUB-PHASE CONTROL FILE

| # | Phase | Status | What it shipped |
|---|-------|--------|-----------------|
| 001 | `001-concurrent-daemon-corruption-fix/` | Complete | Skill-advisor launcher-boundary `isLeaseHeld()` probe + `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER` env gate + WAL/busy_timeout pragmas in `skill-graph-db.ts`. First binary that refuses to start when a sibling is already alive. |
| 002 | `002-cross-launcher-lease-propagation/` | Complete | Inline PID-file primitive mirrored into `mk-code-index-launcher.cjs` and `mk-spec-memory-launcher.cjs`. New `references/launcher-lease.md` for each skill. Spec-memory's launcher additionally forwards SIGTERM to its `context-server.js` child. |
| 003 | `003-launcher-race-and-error-surface-hardening/` | Complete | Closes 9 P1 findings from a 3-reviewer parallel audit of 001+002: race-window correctness (re-probe after write, SIGTERM `child.once('exit')` handler, env-var parsing parity), error-surface correctness (EPERM → `held: true`, pragma ordering swap, broadened EACCES predicate to include `SqliteError(code='SQLITE_READONLY')`), and test-isolation hygiene (stdout-close gate before exit assert, host env strip, new skill-advisor subprocess test). |
| 004 | `004-launcher-diagnostics-and-signal-coverage/` | Complete | Closes all 14 P2 findings from the same audit: PID-reuse diagnostics (`startedAt=<iso>` in `LEASE_HELD_BY:` line), SIGQUIT + uncaughtException cleanup hooks, readonly-probe path in `isLeaseHeld()`, `checkSqliteIntegrity` busy_timeout, code-index `stateFile` collision removal, DELETE-mode warn expansion, `MK_*_DB_DIR` override constraint documented, plus 6 test-hygiene fixes. Strict spec validate reaches 0/0 (errors/warnings) for the first time in the arc. |
| 005 | `005-lease-correctness-and-arc-traceability/` | Complete | Closes 13 P1 findings from the 29-iteration deep review: child status drift, strict-validate evidence, central invariants, REQ/test traceability, skill-advisor coverage gaps, resolved-DB-dir lease ownership, widened SQLite WAL fallback matching, and unconditional lease cleanup. |
| 006 | `006-lease-canonicalization-and-cleanup-ordering/` | Complete | Closes 6 P1 + 6 P2 findings from 005 council review: lease identity canonicalized by real filesystem paths, legacy-lease probe for rolling starts, cleanup ordered before signal mirroring. |
| 007 | `007-skill-advisor-zombie-launcher-fix/` | Complete | Investigates and closes a post-006 skill-advisor regression where 3 launcher instances survived while code-index and spec-memory stayed single-owner. |
| 008 | `008-launcher-race-window-and-debug-log-hygiene/` | Complete | Closes 2 P2 findings from 007 deep-review: moves skill-advisor PID guard write inside the bootstrap-lock critical section + gates verbose error/path logging behind `MK_SKILL_ADVISOR_DEBUG`. |
| 009 | `009-launcher-eperm-parity-fix/` | Complete | Propagates skill-advisor's `EPERM` handling in `leaseHeldFromFile` to `mk-spec-memory` and `mk-code-index`. Closes the `-32000` MCP reconnect failure when `kill(pid,0)` returns `EPERM` in sandboxed runtimes. |
| 010 | `010-multi-client-stdio-socket-bridge/` | Complete | Secondary MCP launchers attach to the primary daemon over an IPC socket instead of exiting with `LEASE_HELD_BY`. Foundation for the sun_path issue surfaced in 011. |
| 011 | `011-sun-path-and-stale-lease-followups/` | Complete (1 follow-on open) | Pins `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` across all 4 runtime configs to clear the macOS 104-char `sun_path` limit (commit `9ae9a6f4e`). Documents the operational lease-clear recipe and flags dead-PID auto-reclaim in `skill_graph_daemon_lease` as the next follow-on. |
| 012 | `012-daemon-bridge-socket-for-skill-advisor-and-code-index/` | Complete | Closes packet 010's daemon-side gap. Lifts the `socket-server.ts` pattern from `mk-spec-memory` into the skill-advisor and code-index daemons; both now bind `/tmp/<service>/daemon-ipc.sock` so secondary launchers (incl. the OpenCode plugin bridge) attach via the socket instead of failing with `LEASE_HELD_BY ... (no-bridge-socket)`. |
<!-- /ANCHOR:phase-map -->

---

## Cross-Cutting Invariants

Future maintainers MUST preserve these across all 3 launchers (skill-advisor / code-graph / spec-memory):

1a. **Inline PID-file lease at launcher boundary.** Code-graph and spec-memory write PID files via atomic temp+rename and only proceed if no live owner exists.
1b. **Daemon SQLite lease DB at launcher boundary.** Skill-advisor probes the daemon lease database before opening the skill graph DB; the lease DB lives beside the canonicalized skill graph DB directory and blocks a second live owner.
2. **SQLite WAL + busy_timeout ≥ 5000ms.** All three DB-open paths (handler boot, watcher refresh, rebuild-from-source) set both pragmas. WAL→DELETE fallback only on documented filesystem errors.
3. **Signal-handler parity.** SIGTERM, SIGINT, SIGQUIT, and uncaughtException all clear the lease file before exit, in all 3 launchers.
4. **Lease cleanup is unconditional.** clearLeaseFile() runs whether the child exited cleanly, was killed, or hung past SIGKILL grace.

---

<!-- ANCHOR:what-needs-done -->
## 3. WHAT NEEDS DONE

Code work is finished. Two passive operator items remain:

1. **SC-002 24-hour zero-zombie soak.** Restart MCP-using runtimes (Claude Code, OpenCode, Codex sessions, Devin) so the new launcher binaries activate. Use the workspace normally for ≥ 24 hours across all connected runtimes. Then run `bash .opencode/skills/system-skill-advisor/mcp_server/scripts/verify-zombie-soak.sh --verbose > /tmp/soak-evidence-$(date +%Y%m%d).log 2>&1`. Mark `002/checklist.md` CHK-014 with the log as evidence.
2. **24h zombie audit becomes a property test, not a fire drill.** Once SC-002 passes once, future re-verification is a 10-second script invocation. The `.opencode/skills/system-skill-advisor/mcp_server/scripts/verify-zombie-soak.sh` script exits 0 if all 3 launchers have ≤ 1 instance; exits 1 if duplicates re-appear.

Anything beyond those two items belongs to a separate follow-on arc, not this one.
<!-- /ANCHOR:what-needs-done -->
