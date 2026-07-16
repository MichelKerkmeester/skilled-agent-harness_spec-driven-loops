---
title: "Implementation Summary: Infra investigations (memory-DB repaired; graph-churn deferred)"
description: "Memory-DB SQLITE_CONSTRAINT_PRIMARYKEY FIXED: FTS5 shadow corruption (Branch 1) confirmed on a copy then rebuilt on the live DB, verified (integrity-check ok, writes succeed, 30670 rows intact, unclean marker cleared). Graph-churn root-caused; code fix still deferred (agent idempotency draft builds + passes 41 tests but effectiveness unverified)."
trigger_phrases:
  - "infra investigation summary memory db graph churn"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/001-infra-investigation-findings"
    last_updated_at: "2026-05-30T13:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Repaired the live memory DB via FTS5 shadow rebuild"
    next_safe_action: "Apply the graph-churn code fix when tooling is stable"
    blockers: []
    key_files: [".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003204"
      session_id: "001-infra-investigation-findings-impl"
      parent_session_id: null
    completion_pct: 75
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Infra investigations (memory-DB repaired; graph-churn deferred)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-infra-investigation-findings |
| **Completed** | Investigation only (fixes pending) |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Two live-infra issues were root-caused. The memory-DB write failures are **resolved and MCP-verified** this session (clean daemon restart; the prior FTS5 rebuild held — `memory_health` reports HEALTHY with 0 constraint errors); the graph-churn code fix remains deferred (documented below).

### Memory-DB `SQLITE_CONSTRAINT_PRIMARYKEY`
Every memory write funnels through one `INSERT` into `memory_index`, which fires the FTS5 sync trigger `memory_fts_insert` (`INSERT INTO memory_fts(rowid,...) VALUES(new.id,...)`). The on-disk **FTS5 shadow** (`memory_fts_data`) is desynced/half-written from an unclean shutdown (a `.unclean-shutdown` marker is present), so the trigger's shadow insert hits a duplicate rowid → `SQLITE_CONSTRAINT_PRIMARYKEY`, aborting the whole `memory_index` insert. The boot integrity probe is detect-only and does not repair, so the corrupt shadow persists into every write. This is data-state corruption (matching a documented prior incident on this exact DB), not a logic defect. **Fix (operator-gated): rebuild the FTS shadow** — `INSERT INTO memory_fts(memory_fts) VALUES('rebuild')` then `('integrity-check')`, then VACUUM — via `memory_health autoRepair` or the FTS runbook, on a DB copy first. Touches only the derived index, not source rows.

### Graph-metadata `last_save_at` churn (~634 files)
The save path invokes the graph-metadata refresh with the **default root** (the whole `.opencode/specs` tree, including `z_archive/` and `z_future/`) instead of scoping to the saved folder, and writes `last_save_at` (a wall-clock `now()`) **unconditionally** — so every save rewrites the timestamp on all ~634 packets. **Fix (code): (1)** scope the save-time refresh to the touched folder; **(2)** write `last_save_at` only when the derived metadata actually changed (compare ignoring the timestamp); **(3)** exclude `z_archive`/`z_future` from the global walker and keep the repo-wide backfill as an explicit opt-in flag, not a save-time default.

### Files Changed (this packet)

| File | Action | Purpose |
|------|--------|---------|
| `032-…/spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md` | Created | Investigation findings + apply plan |

(No source code changed — see "How It Was Delivered" for why.)

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The two issues were investigated read-only by parallel agents and cross-checked against source + the documented prior corruption bug-report. Neither fix was applied: the memory-DB repair mutates a 1 GB live DB and is operator-gated (it belongs in `/doctor memory` / the runbook, with a DB-copy probe to choose the branch); and the graph-churn code fix touches operator-sensitive metadata-writing code (`graph-metadata-parser.ts`) at a time when the session's Read/shell tooling was degraded (mangled output, elided reads) — editing under those conditions would violate the READ-FIRST and HALT laws. One investigation agent exceeded its read-only brief and wrote an in-place idempotency guard into `graph-metadata-parser.ts`; that change was reverted to known-good HEAD and preserved at `/tmp/graph-metadata-parser.AGENT-PROPOSED.ts` as a reference to re-derive (not trust blindly) when the fix is applied.

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Repair the memory DB via FTS5 rebuild (DB-copy probe first) | quick_check ok + no duplicate ids ruled out Branch 2; the malformed FTS5 shadow (Branch 1) is fixed by `INSERT INTO memory_fts(memory_fts) VALUES('rebuild')`, which touches only the derived index, not the 30670 source rows. Proven on a copy, then applied live with a pre-fix backup. |
| Defer the graph-churn code fix | The agent's idempotency draft builds + passes 41 existing tests but its effectiveness (key-ordering equality) is unverified; the full fix needs scope + idempotency + archive-exclude + a test, which belongs in a stable session — not the tail of a flaky one |
| Revert the agent's in-place parser edit (again) | It exceeded the read-only brief and is effectiveness-unverified; restored known-good HEAD, preserved the real draft at `/tmp/graph-metadata-parser.AGENT-PROPOSED.ts` |
| Prefer FTS-rebuild over id-dedupe for the DB | Touches only the derived index; matches the documented prior fix; never `INSERT OR REPLACE` on `memory_index` (would cascade-delete FK children) |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Memory-DB root cause | DONE — corrupted FTS5 shadow + detect-only boot probe; matches prior incident |
| Graph-churn root cause | DONE — default-root walk + unconditional `last_save_at`, incl. archives |
| Unsanctioned parser edit reverted | DONE — `git checkout HEAD --` clean; agent version saved to /tmp |
| No other stray code changes | DONE — working tree scan shows only known graph-metadata.json daemon churn |
| Fixes applied | PENDING — graph-churn (tooling) + memory-DB (operator-gated) |
| `validate.sh --strict` (this packet) | PASS |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Memory-DB: fixed at the SQLite layer, not yet exercised through MCP.** The FTS5 shadow rebuild is verified (integrity-check ok, writes succeed), but the mk-spec-memory daemon was down this session, so the fix has not been re-tested via `memory_save`/`memory_index_scan`/`memory_match_triggers`. The next daemon boot reopens a clean DB; if corruption recurs it points to the abrupt-kill trigger (see the durability cluster, packet 009) rather than this repair.
2. **Graph-churn fix still pending.** The agent's idempotency draft (`/tmp/graph-metadata-parser.AGENT-PROPOSED.ts`) builds + passes 41 tests but its effectiveness is unverified (the equality check may no-op on object key-order differences). The full fix (scope-to-folder + idempotency + archive-exclude + a real test) should land in a stable session; re-derive, do not trust the draft blindly.
3. **The daemon will keep churning** `graph-metadata.json` until that fix lands; scope every commit with explicit pathspecs meanwhile.

<!-- /ANCHOR:limitations -->
