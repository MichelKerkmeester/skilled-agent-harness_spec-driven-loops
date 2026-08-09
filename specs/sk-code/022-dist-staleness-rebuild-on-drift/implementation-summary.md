---
title: "Implementation Summary: Dist Staleness Rebuild-on-Drift"
description: "The dist-staleness guard now self-heals a stale checked-out build at session start; the sweep-crashing orphan was removed."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "dist staleness rebuild implementation"
  - "check-dist-staleness self heal summary"
importance_tier: "high"
contextType: "implementation"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/022-dist-staleness-rebuild-on-drift"
    last_updated_at: "2026-08-09T05:41:05Z"
    last_updated_by: "claude"
    recent_action: "Shipped sweep-unblock + fail-open auto-rebuild; verified stale-then-fresh"
    next_safe_action: "None; packet complete"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:d3e76a70dec09bc070f49227ef4416f2da0ef621cac85a3d14d2e9fc47b6c14c"
      session_id: "2026-08-09-sk-code-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Dist Staleness Rebuild-on-Drift

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 022-dist-staleness-rebuild-on-drift |
| **Status** | Complete |
| **Created** | 2026-08-09 |
| **Level** | 1 |
| **Completion** | 100% — sweep unblocked, guard self-heals, verified with a stale-then-fresh control |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Two edits close the recurring cross-session `UserPromptSubmit` hook error (a stale advisor `dist/` that broke `spec-gate-core.mjs`'s import).

1. **`dist-freshness.cjs`** — deleted the orphaned `DIST_PACKAGES` entry left by the code-graph removal. It had `distEntries`/`sourceCandidates` but no `id`/`root`, so `checkAll`'s `pkg.id`→`undefined`→`packageById(undefined)` resolved to it and its missing `root` threw. The whole `--all` sweep aborted, and the guard's fail-open swallowed it — so the session-start check silently detected nothing. At discovery, three packages (mcp-server, code-mode, sk-design backend) were quietly stale.

2. **`check-dist-staleness.sh`** — added `try_rebuild` (runs the package's self-contained `rebuildCommand`, bounded at a 180s timeout, fail-open) and `auto_rebuild_enabled` (kill-switch, default on). The `--all` sweep now self-heals a stale package instead of only warning; `check-file` (per-edit) stays warn-only.

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Root-caused from the reproduced hook error: traced `spec-gate-core.mjs`'s failing import to the advisor's stale compiled `policy-plan.js`, then found the `--all` sweep was itself crashing on a malformed `DIST_PACKAGES` entry. Removed the orphan, added the fail-open `try_rebuild`, and verified with a stale-then-fresh control on real packages (mcp-server self-healed; code-mode's failing build fell back to a warning). All watched `dist/` trees stayed gitignored — no build artifact was committed.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Auto-rebuild only in `--all`, not `check-file` | The session-start sweep runs once; per-edit `check-file` fires on every keystroke and must never trigger a compile. |
| Default the kill-switch on | The goal is to stop the recurrence without operator configuration; anyone who dislikes an auto-build at session start sets `SPECKIT_DIST_AUTO_REBUILD=0`. |
| Fail-open on rebuild failure | A broken or slow build must never block session start, so a non-zero exit or timeout falls back to the existing warning. |
| Delete the orphan rather than repair it | The code-graph package was removed upstream; its watch entry has no live source to build, so the correct fix is removal, not reconstructing dead identity fields. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Sweep no longer crashes | PASS — `dist-freshness.cjs check-all --json` returns 6 packages (previously threw at `packageRoot`) |
| Auto-rebuild self-heals a stale package | PASS — `DIST REBUILT: @spec-kit/mcp-server`; a subsequent `check-all` reports it fresh |
| Fail-open on a failing build | PASS — code-mode's failing compile fell back to `STALE DIST WARNING` and the guard exited 0 |
| Kill-switch reverts to warn-only | PASS — `SPECKIT_DIST_AUTO_REBUILD=0 --all` warns without rebuilding |
| Syntax | PASS — `node --check dist-freshness.cjs`; `ast.parse(check-dist-staleness.sh)` |

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A genuinely broken package build warns every session.** code-mode's own compile fails in this checkout, so the guard now correctly surfaces `STALE DIST WARNING` for it each session-start sweep. Fixing that package's build is out of this packet's scope; the guard's job is to detect, attempt, and fail-open.
2. **First stale session pays the rebuild cost.** A session that opens with a stale package runs one bounded `npm run build` at start (incremental, usually seconds). The `SPECKIT_DIST_AUTO_REBUILD=0` switch opts out for anyone who does not want a compile at session start.
<!-- /ANCHOR:limitations -->
