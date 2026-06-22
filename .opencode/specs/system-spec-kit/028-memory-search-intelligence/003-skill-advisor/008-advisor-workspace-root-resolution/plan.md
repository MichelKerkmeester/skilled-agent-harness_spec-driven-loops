---
title: "Implementation Plan: Advisor workspace-root resolution by walk-up [template:level_2/plan.md]"
description: "Plan to replace cwd-based workspace-root resolution in the skill advisor with a deterministic walk-up, route the two write-path call sites through it, rebuild dist, and clean stray nested .advisor-state directories."
trigger_phrases:
  - "advisor root plan"
  - "resolveWorkspaceRoot walk-up"
  - "advisor dist rebuild"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-memory-search-intelligence/003-skill-advisor/008-advisor-workspace-root-resolution"
    last_updated_at: "2026-06-21T15:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored implementation plan"
    next_safe_action: "Recycle advisor daemon to activate"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-advisor-root-fix"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Advisor workspace-root resolution by walk-up

<!-- SPECKIT_LEVEL: 2 -->
<!--
SELF-CHECK:
- Confirm the plan states the approach, phases, testing, and rollback for the change.
- Remove placeholders and any step not backed by the real build or verification.
FAILURE MODES:
- Vague phases, missing rollback, or testing that does not exercise the fix.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

Make the skill advisor resolve its workspace root deterministically from the module location, so it never writes generation state into a subdirectory.

### Technical Context

The advisor persists `skill-graph-generation.json` under `<root>/.opencode/skills/.advisor-state/`. The startup scan and daemon init passed `process.cwd()` as the root; `resolveWorkspaceRoot()` existed but its `import.meta.dirname` candidate used a fixed depth wrong for the compiled layout, so it always fell back to cwd.

### Overview

Reuse `resolveWorkspaceRoot()` with a corrected walk-up implementation, route the two write-path call sites through it, rebuild dist, and clean pre-existing strays.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- Root cause confirmed with file:line; runtime layout (source vs dist) understood.

### Definition of Done

- Typecheck clean, dist rebuilt, resolver returns the repo root from a subdir cwd, zero main-tree strays, canonical state intact.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Walk up from the module's own directory to the first ancestor containing `.opencode/skills/system-skill-advisor`; that is the repo root.

### Key Components

`resolveWorkspaceRoot()` (the resolver), the startup-scan write path, and the daemon-init write path.

### Data Flow

Generation paths derive from the resolved root, so writes always land at the canonical `<root>/.opencode/skills/.advisor-state/`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

`.opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts` (resolver plus two call sites). Disk-only: stray `.advisor-state` directories (gitignored).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

Clean stray nested `.advisor-state` leaves in the main tree (leaf-only; preserve any parent `.opencode` that holds other content).

### Phase 2: Core Implementation

Rewrite `resolveWorkspaceRoot()` to walk up; swap the two write-path call sites to use it.

### Phase 3: Verification

Typecheck, rebuild dist, confirm the resolver returns the repo root from a subdir cwd.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`npm run typecheck` (0 errors); a node walk-up check from `cwd=tool/` returning the repo root; observation that re-running does not regenerate a `tool/.opencode`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The advisor build chain (`npm run build`) and the running advisor daemon for live activation (reconnect / fresh session).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

`git revert` the source commit and rebuild dist. Strays do not need restoring (they were clutter).
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

Phase 1 precedes Phase 2 so a leftover stray cannot influence verification. Phase 3 gates completion.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

Small: one function plus two call sites, a scripted cleanup, a rebuild, and a logic verification.
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist

Confirm typecheck clean and dist rebuilt before reconnecting the daemon.

### Rollback Procedure

Revert the source, rebuild dist, start a fresh session to reload prior behavior.

### Data Reversal

None — no data migration is involved.
<!-- /ANCHOR:enhanced-rollback -->
