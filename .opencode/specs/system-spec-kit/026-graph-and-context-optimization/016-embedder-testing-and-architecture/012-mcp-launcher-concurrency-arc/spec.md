---
title: "MCP Launcher Concurrency Arc — Phase Parent"
description: "Umbrella for the 4-phase arc that delivered single-writer lease enforcement at the launcher boundary across all 3 MCP launchers (skill-advisor, code-graph, spec-memory), plus the review-driven hardening that followed."
trigger_phrases:
  - "mcp launcher concurrency arc"
  - "launcher lease arc"
  - "012 arc"
  - "daemon corruption arc"
importance_tier: "important"
contextType: "general"
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

This arc fixes the smell at its source — single-writer enforcement at the launcher process boundary — and propagates the fix uniformly across all 3 launchers. The 4 phases were sized to keep each commit focused on one decision class.
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:phase-map -->
## 2. SUB-PHASE CONTROL FILE

| # | Phase | Status | What it shipped |
|---|-------|--------|-----------------|
| 001 | `001-concurrent-daemon-corruption-fix/` | Complete | Skill-advisor launcher-boundary `isLeaseHeld()` probe + `MK_SKILL_ADVISOR_STRICT_SINGLE_WRITER` env gate + WAL/busy_timeout pragmas in `skill-graph-db.ts`. First binary that refuses to start when a sibling is already alive. |
| 002 | `002-cross-launcher-lease-propagation/` | Complete | Inline PID-file primitive mirrored into `mk-code-index-launcher.cjs` and `mk-spec-memory-launcher.cjs`. New `references/launcher-lease.md` for each skill. Spec-memory's launcher additionally forwards SIGTERM to its `context-server.js` child. |
| 003 | `003-lease-hardening-from-review/` | Complete | Closes 9 P1 findings from a 3-reviewer parallel audit of 001+002: race-window correctness (re-probe after write, SIGTERM `child.once('exit')` handler, env-var parsing parity), error-surface correctness (EPERM → `held: true`, pragma ordering swap, broadened EACCES predicate to include `SqliteError(code='SQLITE_READONLY')`), and test-isolation hygiene (stdout-close gate before exit assert, host env strip, new skill-advisor subprocess test). |
| 004 | `004-p2-cleanup-from-review/` | Complete | Closes all 14 P2 findings from the same audit: PID-reuse diagnostics (`startedAt=<iso>` in `LEASE_HELD_BY:` line), SIGQUIT + uncaughtException cleanup hooks, readonly-probe path in `isLeaseHeld()`, `checkSqliteIntegrity` busy_timeout, code-index `stateFile` collision removal, DELETE-mode warn expansion, `MK_*_DB_DIR` override constraint documented, plus 6 test-hygiene fixes. Strict spec validate reaches 0/0 (errors/warnings) for the first time in the arc. |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:what-needs-done -->
## 3. WHAT NEEDS DONE

Code work is finished. Two passive operator items remain:

1. **SC-002 24-hour zero-zombie soak.** Restart MCP-using runtimes (Claude Code, OpenCode, Codex sessions, Devin) so the new launcher binaries activate. Use the workspace normally for ≥ 24 hours across all connected runtimes. Then run `bash .opencode/skills/system-skill-advisor/mcp_server/scripts/verify-zombie-soak.sh --verbose > /tmp/soak-evidence-$(date +%Y%m%d).log 2>&1`. Mark `002/checklist.md` CHK-014 with the log as evidence.
2. **24h zombie audit becomes a property test, not a fire drill.** Once SC-002 passes once, future re-verification is a 10-second script invocation. The `.opencode/skills/system-skill-advisor/mcp_server/scripts/verify-zombie-soak.sh` script exits 0 if all 3 launchers have ≤ 1 instance; exits 1 if duplicates re-appear.

Anything beyond those two items belongs to a separate follow-on arc, not this one.
<!-- /ANCHOR:what-needs-done -->
