---
title: "Implementation Summary: Skill-Advisor Zombie Launcher Fix"
description: "Phase 007 closes the skill-advisor zombie launcher regression by adding the missing launcher-owned PID guard before the daemon-backed server spawn."
trigger_phrases:
  - "007 zombie launcher summary"
  - "skill-advisor zombie root cause"
  - "spawn-three launcher fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix"
    last_updated_at: "2026-05-18T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented Phase 007 launcher fix"
    next_safe_action: "Commit explicit scoped paths"
    blockers: []
    key_files:
      - ".opencode/bin/mk-skill-advisor-launcher.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-implementation-summary"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Root cause: launcher did not own a pre-spawn PID guard"
      - "daemon lease.ts inspected; no source change required"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-skill-advisor-zombie-launcher-fix |
| **Completed** | 2026-05-18 |
| **Level** | 2 |
| **Status** | Complete; commit pending main-agent handoff |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Phase 007 adds the missing skill-advisor launcher-boundary PID guard. The launcher now checks a live `.mk-skill-advisor-launcher.json` owner before consulting the daemon SQLite lease, serializes the pre-spawn acquisition window with the bootstrap lock, writes its own PID guard before `launchServer()`, re-probes ownership, and only then starts `advisor-server.js`.

### Root Cause

The working launchers (`mk-code-index-launcher.cjs` and `mk-spec-memory-launcher.cjs`) write an inline PID lease before spawning their child servers. Skill-advisor had cleanup/probe helpers for `.mk-skill-advisor-launcher.json`, but it never wrote that file as a live PID guard; instead, it only probed `lease.ts` for the daemon SQLite lease.

That daemon SQLite lease is acquired inside `advisor-server.ts` through `startSkillGraphDaemon()` after startup scan work. A duplicate launcher can therefore pass the parent preflight before the first child acquires the daemon lease. Even after losing the daemon lease, the child server remains connected in degraded mode, so the parent launcher remains alive. That is how three `mk-skill-advisor-launcher` processes could survive while only one daemon writer was active.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/bin/mk-skill-advisor-launcher.cjs` | Modified | Adds local launcher PID guard check/write/re-probe and keeps daemon SQLite lease probing. |
| `.opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts` | Modified | Moves fixture lease ownership to the launcher and adds the `007-REQ-001` spawn-three regression test. |
| `007-skill-advisor-zombie-launcher-fix/*.md` | Created | Level 2 packet docs for root cause, plan, tasks, checklist, and verification. |
| `description.json`, `graph-metadata.json` | Created | Generated packet metadata. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The fix avoids changing code-index and spec-memory. It also avoids changing `lease.ts` because the daemon SQLite lease behavior was not the faulty component: its current/legacy owner probes were present, realpath canonicalization was present, and SQLite ownership still protects the daemon writer.

The new parent-owned PID guard closes the process-count invariant that the daemon lease cannot express. Duplicate launchers now exit before they can spawn a degraded child server.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep daemon SQLite lease unchanged | It protects writer exclusivity correctly; the regression was before and around child spawn. |
| Add a launcher PID guard in `mk-skill-advisor-launcher.cjs` | The observed failure counted launcher processes, so the parent launcher must own the user-visible process invariant. |
| Remove `artifactsReady()` early return from the bootstrap lock wait | A duplicate that arrives during the first launcher's pre-spawn window must wait until the first owner has written the PID guard. |
| Keep duplicate contention as exit 0 | A held lease is expected contention, not a launcher crash. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `cd .opencode/skills/system-skill-advisor/mcp_server && npx vitest --run launcher-lease` | PASS, exit 0. 1 file passed; 11 tests passed. |
| `npm --prefix .opencode/skills/system-skill-advisor/mcp_server run typecheck` | PASS, exit 0. |
| Isolated spawn-three smoke | PASS for behavior: owner pid `13360`; launcher #2 and #3 exited 0 with `LEASE_HELD_BY:13360`; launcher #1 remained alive until cleanup. |
| Smoke `ps` process-count probe | BLOCKED by sandbox: `spawnSync ps EPERM`; no `ps` matching-lines output available. |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <007> --strict --verbose` | PASS, exit 0. `Summary: Errors: 0  Warnings: 0`; `RESULT: PASSED`. |

Smoke output excerpt:

```json
{
  "ownerPid": 13360,
  "firstAlive": true,
  "secondExit": { "code": 0, "signal": null },
  "thirdExit": { "code": 0, "signal": null },
  "secondStdout": "LEASE_HELD_BY:13360 startedAt=2026-05-18T16:58:48.831Z",
  "thirdStdout": "LEASE_HELD_BY:13360 startedAt=2026-05-18T16:58:48.831Z",
  "psError": "spawnSync ps EPERM",
  "psMatchingCount": null
}
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:commit-handoff -->
## Commit Handoff

This runtime cannot create `.git/index.lock`:

```text
fatal: Unable to create '/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.git/index.lock': Operation not permitted
```

Stage exactly these paths from a non-sandboxed shell:

```bash
git add \
  .opencode/bin/mk-skill-advisor-launcher.cjs \
  .opencode/skills/system-skill-advisor/mcp_server/tests/launcher-lease.vitest.ts \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix/spec.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix/plan.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix/tasks.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix/checklist.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix/implementation-summary.md \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix/description.json \
  .opencode/specs/system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/006-mcp-launcher-concurrency/007-skill-advisor-zombie-launcher-fix/graph-metadata.json
```

Commit subject:

```text
feat(006/007): close skill-advisor zombie launcher root cause
```
<!-- /ANCHOR:commit-handoff -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The sandbox blocks `ps`, so the requested literal `ps -A | grep mk-skill-advisor-launcher | wc -l` evidence could not be captured here. The focused Vitest includes a `ps`-based assertion when available and falls back to direct child exit/liveness assertions when `ps` is unavailable.
2. No change was made to `.opencode/skills/system-skill-advisor/mcp_server/lib/daemon/lease.ts`; inspection showed the root cause was in the parent launcher acquisition gap, not the daemon SQLite lease code.
3. The final commit is intentionally left to the main agent per the dispatch constraints.
<!-- /ANCHOR:limitations -->
