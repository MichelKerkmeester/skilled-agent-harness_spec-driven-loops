---
title: "MCP Launcher Concurrency Arc — Phase Parent"
description: "Umbrella for the 12-child launcher concurrency arc that delivered single-writer lease enforcement at the launcher boundary across all 3 MCP launchers (skill-advisor, code-graph, spec-memory), plus the review-driven hardening that followed."
trigger_phrases:
  - "mcp launcher concurrency arc"
  - "launcher lease arc"
  - "012 arc"
  - "daemon corruption arc"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/006-mcp-launcher-concurrency"
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
## 2. PHASE MAP

| Phase | Focus | Status |
|---|---|---|
| `001-concurrent-daemon-corruption-fix/` | Concurrent Daemon Corruption Fix | Complete |
| `002-cross-launcher-lease-propagation/` | Cross-Launcher Lease Propagation | Complete |
| `003-launcher-race-and-error-surface-hardening/` | Lease Hardening From Review | Complete |
| `004-launcher-diagnostics-and-signal-coverage/` | P2 Cleanup From Review | Complete |
| `005-lease-correctness-and-arc-traceability/` | Lease Correctness and Arc Traceability | Complete |
| `006-lease-canonicalization-and-cleanup-ordering/` | Lease Canonicalization and Cleanup Ordering | Implementation Complete; Commit Blocked |
| `007-skill-advisor-zombie-launcher-fix/` | Skill-Advisor Zombie Launcher Fix | Complete |
| `008-launcher-race-window-and-debug-log-hygiene/` | Launcher Race-Window Tightening + Debug-Log Hygiene | Complete |
| `009-launcher-eperm-parity-fix/` | Launcher EPERM Parity Fix | Complete |
| `010-multi-client-stdio-socket-bridge/` | Multi-client stdio-socket launcher bridge | Complete |
| `011-sun-path-and-stale-lease-followups/` | sun_path socket-dir + stale-lease reclaim followups | Complete (core fix shipped); 1 follow-on advisory open |
| `012-daemon-bridge-socket-for-skill-advisor-and-code-index/` | Daemon bridge socket for skill-advisor and code-index | Complete |
| `013-launcher-lease-acquisition-reclaim/` | Acquisition-time stale-lease reclaim with atomic CAS/race regression | Planned |
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
- Track a new `013-dead-pid-acquisition-reclaim/` packet for acquisition-time stale-owner reclaim; Dispatch B owns the scaffold.
<!-- /ANCHOR:what-needs-done -->
