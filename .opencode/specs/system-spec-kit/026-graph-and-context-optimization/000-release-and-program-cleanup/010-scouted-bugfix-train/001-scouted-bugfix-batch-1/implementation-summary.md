---
title: "Implementation Summary: Scouted Bugfix Batch 1"
description: "An 8-agent scout surfaced 40 candidate deep-research targets; the top 5 were deep-dived in parallel by gpt-5.5-fast, which REFUTED the two pre-try lease-leak headlines (all throws precede lease acquisition; the one post-acquisition call swallows its errors) but confirmed a real lesser defect in each. Five disjoint-file implement agents fixed and tested the confirmed defects across 10 files: two shell hardenings (worktree-reaper eval, setup-cp-sandbox rm-rf), one advisor IPC hardening, and two MCP-server bug fixes (file-watcher close hang, scan lease heartbeat). Every fix stack-verified; both MCP builds exit 0."
trigger_phrases:
  - "scouted bugfix batch 1 summary"
  - "verify-first batch fix shipped"
  - "5 confirmed defects 10 files"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/134-scouted-bugfix-batch-1"
    last_updated_at: "2026-06-03T05:32:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed 5 confirmed defects across 10 files; builds exit 0; targeted suites green"
    next_safe_action: "Generate metadata, validate --strict, reconcile; orchestrator recycles daemons"
    blockers: []
    key_files:
      - ".opencode/bin/worktree-reaper.sh"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/ipc/socket-server.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/ops/file-watcher.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-1-session"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Scouted Bugfix Batch 1

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/134-scouted-bugfix-batch-1` |
| **Completed** | 2026-06-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A verify-first batch fix over the top 5 of 40 scouted candidate defects, run as a scout → deep-dive → implement pipeline that refused to edit on an unverified headline:

1. **SCOUT** — an 8-agent scout enumerated **40 candidate deep-research targets** across the codebase; the **top 5** were selected by risk (2 shell, 1 IPC, 2 MCP-server).
2. **DEEP-DIVE** — 5 parallel `gpt-5.5-fast` deep-dives confirmed or refuted each headline against the real code. Notably, the two "pre-try lease leak" headlines were **REFUTED**: all throws occur before lease acquisition, and the one post-acquisition call swallows its errors — so there was no pre-try leak to fix. Each target still had a **real lesser defect**.
3. **IMPLEMENT** — 5 parallel implement-and-test agents on **disjoint files** fixed the confirmed defects across **10 files**; the orchestrator reviewed every diff and confirmed builds + tests.

### 5 Fixes

| # | Target | Severity | Fix |
|---|--------|----------|-----|
| 1 | `worktree-reaper.sh` | P1 security | Replaced the `eval "$@"` act() with argv-array execution (`"$@"`) at 5 call sites; added `rm -rf -- "$sd"` end-of-options guard; DRY_RUN uses `%q`. Kills shell command injection via reaped-worktree path names. |
| 2 | `setup-cp-sandbox.sh` (3 copies) | P1 security | Derived REPO_ROOT from `BASH_SOURCE` (was hardcoded to an author absolute path); added `validate_sandbox_dir()` that rejects empty / non-absolute / `..` / non-`/tmp` paths before the destructive `rm -rf`. |
| 3 | advisor `socket-server.ts` | P1 security | Ported the 4 DR-008 hardening items code-graph already had: canonicalizePath ancestor-realpath, allowedSocketRoots, isWithinAllowedSocketRoot confinement, post-mkdir stat uid / group-writable check. |
| 4 | `file-watcher.ts` (+ test, package.json) | P2 bug | `watcher.close()` could block on a non-cancellable `withBusyRetry` backoff sleep. Added a RetryWaker wake-coordination mechanism (sticky-after-wakeAll; clears the backoff timer on early wake) so close() wakes in-flight retries immediately. Re-enabled file-watcher.vitest.ts in test:core (removed the `--exclude`). |
| 5 | `memory-index.ts` (+ test) | P2 bug | The pre-try leak was refuted; the real defect was no periodic lease heartbeat during processBatches (a >expiry multi-batch scan could let a concurrent caller treat the lease as stale). Added a `setInterval` heartbeat (expiry/3, min 10s, `.unref()`) started inside the try, cleared in finally. |

### Files Changed

| File Group | Action | Purpose |
|------------|--------|---------|
| `.opencode/bin/worktree-reaper.sh` | Modified | argv-array execution + `rm -rf --` guard + `%q` DRY_RUN |
| `setup-cp-sandbox.sh` (deep-research/deep-review `07--command-flow-stress-tests/`, deep-improvement `08--agent-discipline-stress-tests/`) | Modified | BASH_SOURCE REPO_ROOT + `validate_sandbox_dir()` |
| `system-skill-advisor/mcp_server/lib/ipc/socket-server.ts` | Modified | 4 DR-008 IPC hardening items |
| `system-spec-kit/mcp_server/lib/ops/file-watcher.ts` + tests/file-watcher.vitest.ts + mcp_server/package.json | Modified | RetryWaker; re-enabled suite in test:core |
| `system-spec-kit/mcp_server/handlers/memory-index.ts` + tests/handler-memory-index-cooldown.vitest.ts | Modified | scan lease heartbeat |

Total: **10 files** across 5 disjoint targets, scope-locked to the confirmed defects.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fan-out / fan-in pipeline with a verify gate. The 8-agent scout produced the 40-candidate backlog and the top-5 selection. The deep-dive stage dispatched 5 parallel gpt-5.5-fast passes that read the real code and classified each headline CONFIRMED or REFUTED — the gate that stopped the two pre-try lease-leak headlines from becoming wrong edits. The implement stage ran 5 agents on disjoint file sets so parallel writes never collided, each fixing only its confirmed defect and proving it with stack-appropriate verification: shell fixes via `bash -n` + shellcheck + a LIVE injection test (worktree-reaper) and an 11-input unit test + end-to-end run (setup-cp-sandbox); TS fixes via typecheck + `npm run build` + targeted vitest. The orchestrator then reviewed every diff and confirmed both MCP builds exit 0 before ship.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deep-dive to confirm/refute each headline before editing | The two "pre-try lease leak" headlines were the loudest, but unverified; the deep-dive refuted them (all throws precede lease acquisition; the one post-acquisition call swallows its errors), so acting on them directly would have fixed a non-existent defect and missed the real one. |
| Fix each target's real lesser defect, not the refuted headline | Verify-first discipline: the headline was wrong, but each target still had a genuine defect worth fixing — that is what shipped. |
| Partition the 5 implement agents by disjoint files | 10 files, no overlap, so parallel edit agents never collide; keeps each fix scope-locked. |
| Port the advisor IPC hardening from the code-graph reference, not invent new | code-graph already had the 4 DR-008 items; mirroring the proven impl keeps the two socket servers consistent and avoids a novel, unaudited hardening. |
| Treat the 2 handler-memory-index failures as pre-existing | They live in a `[deferred - requires DB test fixtures]` describe block, unrelated to the heartbeat change; the cooldown suite (9/9) is the relevant gate. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-dive confirm/refute of all 5 headlines | PASS — two pre-try lease-leak headlines REFUTED with code evidence; 5 real defects confirmed |
| Fix 1 — worktree-reaper | PASS — `bash -n` + shellcheck clean; LIVE injection test (hostile `$sd`) injection dead; exit-status propagation preserved |
| Fix 2 — setup-cp-sandbox (3 copies) | PASS — `bash -n` + 11-input unit test + end-to-end; rejects `$HOME` and `/tmp/../etc`; default `/tmp/...` path still works |
| Fix 3 — advisor IPC | PASS — typecheck + build exit 0; faithful to the code-graph DR-008 reference |
| Fix 4 — file-watcher | PASS — typecheck exit 0; file-watcher suite 22/22 incl new close-mid-retry-sleep test; re-enabled in test:core |
| Fix 5 — memory-index scan | PASS — typecheck exit 0; cooldown suite 9/9 incl new heartbeat test |
| Builds | PASS — system-spec-kit mcp_server `npm run build` exit 0; system-skill-advisor mcp_server build exit 0 |
| Scope leak | PASS — edits land only in the 10 confirmed-defect files (+ their tests/package.json) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Two pre-existing test failures remain.** `handler-memory-index.vitest.ts` has 2 failures in a `[deferred - requires DB test fixtures]` describe block; they predate and are unrelated to the heartbeat change. The cooldown suite (9/9) is the gate for Fix 5.
2. **Fixes need a deploy to take effect.** The orchestrator must recycle the mk-spec-memory daemon (#1/#2) + the skill-advisor (#3) after commit; the 2 shell fixes (#1/#2 of the shell set) need no deploy.
3. **35 scouted candidates deferred.** Only the top 5 of the 40-candidate scout are in this packet; the remaining candidates are for later batches.

### Downstream

The corrected shell scripts and MCP-server behavior are consumed by the worktree-reaper / sandbox tooling and the two MCP daemons; after the orchestrator recycle, the IPC confinement, the non-blocking `close()`, and the fresh scan lease are live. No downstream packet depends on this batch directly.
<!-- /ANCHOR:limitations -->
