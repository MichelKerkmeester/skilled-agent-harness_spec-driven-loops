---
title: "Plan: Dist Staleness Rebuild-on-Drift"
description: "Delete the sweep-crashing orphan, then make the guard self-heal a stale build at session start with fail-open and a kill-switch."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "dist staleness rebuild plan"
  - "check-dist-staleness auto rebuild plan"
importance_tier: "high"
contextType: "plan"
parent: "sk-code"
_memory:
  continuity:
    packet_pointer: "sk-code/022-dist-staleness-rebuild-on-drift"
    last_updated_at: "2026-08-09T05:41:05Z"
    last_updated_by: "claude"
    recent_action: "Removed the orphaned dist package entry and added fail-open auto-rebuild"
    next_safe_action: "None; guard self-heals stale packages at session start"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
    session_dedup:
      fingerprint: "sha256:f601e09c21504982de1e44236e2dba5f2888364b6ffba544a38f85c381295d3d"
      session_id: "2026-08-09-sk-code-022"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Plan: Dist Staleness Rebuild-on-Drift

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

The dist-staleness guard is a Python wrapper (`check-dist-staleness.sh`) over a Node freshness checker (`dist-freshness.cjs`). The `--all` sweep runs once per session (SessionStart); `check-file` runs per edit (PostToolUse). Both only warn.

### Overview

Two ordered edits: delete the malformed `DIST_PACKAGES` entry that crashed the sweep, then make the sweep self-heal a stale package by running its own `rebuildCommand` — bounded, fail-open, and with a kill-switch.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- The crash's root cause is identified: an orphaned package entry with no `id`/`root`.
- The freshness payload already exposes a self-contained `rebuildCommand`.

### Definition of Done

- The sweep enumerates the valid packages without throwing.
- A stale package is rebuilt at session start; a failing build fails open; the kill-switch reverts to warn-only.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Detect-then-heal with fail-open. Detection stays in the checker; healing is a bounded side effect in the sweep path only.

### Key Components

- `dist-freshness.cjs` `DIST_PACKAGES` — the watched-package table (one malformed entry removed).
- `check-dist-staleness.sh` `surface_result` / `try_rebuild` / `auto_rebuild_enabled` — the heal-or-warn decision.

### Data Flow

`--all` → checker returns per-package `{stale, rebuildCommand}` → for each stale package the guard runs `rebuildCommand` (timeout-bounded) → on success prints `DIST REBUILT`, on failure prints `STALE DIST WARNING`; always exits 0.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Confirm the crash and the payload shape; identify the orphaned entry left by the code-graph removal.

### Phase 2: Core Implementation

Delete the orphaned entry from `dist-freshness.cjs`; add `try_rebuild` + `auto_rebuild_enabled` and thread `repo_root` through `surface_result`, auto-rebuilding only in `--all`.

### Phase 3: Verification

Run the stale-then-fresh control: self-heal, fail-open, kill-switch, and syntax checks.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Behavioral control on real packages: force a stale package and confirm `DIST REBUILT` plus a fresh re-check; confirm a failing build falls back to the warning with exit 0; confirm `SPECKIT_DIST_AUTO_REBUILD=0` warns only. Plus `node --check` and `ast.parse` for syntax.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `dist-freshness.cjs` freshness payload (`rebuildCommand`, `stale`, `packageName`) — consumed, unchanged.
- Per-package `npm run build` scripts — invoked as-is.
- No new packages or network access.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Both files are small and reversible: `git checkout -- check-dist-staleness.sh dist-freshness.cjs` restores warn-only behavior. `SPECKIT_DIST_AUTO_REBUILD=0` is a runtime opt-out that needs no revert. No committed build artifacts to unwind (all watched `dist/` remain gitignored).

<!-- /ANCHOR:rollback -->
