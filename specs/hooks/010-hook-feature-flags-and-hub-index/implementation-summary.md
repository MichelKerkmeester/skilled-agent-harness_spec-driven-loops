---
title: "Implementation Summary: Hook Feature Flags + Full Hub Index"
description: "Running log across six phases. Phase 1 shipped: a shared kill-switch guard (master + per-concern + legacy aliases) in three module flavors with a passing test suite. Remaining phases wire it into every runtime adapter and complete the hub symlink index."
status: "in-progress"
completion_pct: 30
trigger_phrases:
  - "hook feature flags status"
  - "hook-flags guard implementation"
  - "packet 010 implementation summary"
importance_tier: "high"
contextType: "implementation"
parent: "./spec.md"
_memory:
  continuity:
    packet_pointer: "hooks/010-hook-feature-flags-and-hub-index"
    last_updated_at: "2026-08-12T15:20:51Z"
    last_updated_by: "claude"
    recent_action: "Phase 2 pilot shipped: mcp-route-guard gated on all 6 runtimes; proof clean"
    next_safe_action: "Phase 3: fan out guard to dispatch, post-edit-quality, task-dispatch, goal"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - ".opencode/hooks/shared/hook-flags.cjs"
      - ".opencode/hooks/shared/hook-flags.test.cjs"
    session_dedup:
      fingerprint: "sha256:f77a9c65b2809c95f7477b2a1c8e4893c8c2f9ddecf375663660fd6c09ad8d2f"
      session_id: "4654af88-ba88-466a-bd14-2fa43ea87923"
      parent_session_id: null
    completion_pct: 30
    open_questions: []
    answered_questions:
      - "Full hub index (symlink skill hooks in) vs portable-only -> full index"
      - "Per-concern-family flags vs per-adapter -> per-concern family + master switch"
      - "Per-runtime guard import path -> settled in Phase 2 pilot (see body)"
---
# Implementation Summary: Hook Feature Flags + Full Hub Index

<!-- SPECKIT_LEVEL: 3 -->

---

## PHASE 1 — Guard + master switch (shipped)

`.opencode/hooks/shared/hook-flags.cjs` is the canonical kill-switch resolver: `isHookEnabled(concern, env?)` returns `false` when the master `MK_HOOKS_DISABLED` or the concern's canonical `MK_<CONCERN>_DISABLED` or a registered legacy alias is truthy, else `true` (default on). `concernFlag()` derives the canonical name; `isTruthy()` accepts `1|true|yes|on` case/space-insensitively.

Legacy aliases absorbed (so existing operator config keeps working): `goal`←`MK_GOAL_PLUGIN_DISABLED`; `dispatch`←`MK_CLI_DISPATCH_AUDIT_DISABLED`; `skill-advisor`←the four `*_SKILL_ADVISOR_{HOOK,PLUGIN}_DISABLED`; `completion`←`MK_COMPLETION_SENTINEL_DISABLED`/`MK_SPECKIT_COMPLETION_DISABLED`; `spec-memory`←`MK_SPEC_MEMORY_PLUGIN_DISABLED`/`SPECKIT_…`; `spec-gate`←`SPECKIT_SPEC_GATE_DISABLED`.

`hook-flags.mjs` and `hook-flags.ts` are thin `createRequire` facades over the `.cjs`, so the semantics cannot drift between module systems.

### Validation

`node --experimental-strip-types --test .opencode/hooks/shared/hook-flags.test.cjs` → **7 passed / 0 failed**, covering: default-on, master switch, canonical per-concern, legacy aliases (and cross-concern non-interference), truthy parsing, and `.mjs`/`.ts` facade parity.

## PHASE 2 — Pilot: mcp-route-guard (shipped)

All six `mcp-route-guard` adapters now short-circuit through `isHookEnabled("mcp-route-guard")` at entry (before any work), falling to each adapter's existing silent-approve path when disabled. The OpenCode plugin's ad-hoc `MK_MCP_ROUTE_GUARD_DISABLED === '1'` check was realigned to the shared helper.

### Per-runtime guard import path (settled — the reusable pattern for Phases 3-4)

| Adapter kind | File | Import |
|---|---|---|
| `.cjs` (claude/codex/devin) | `mcp-route-guard/<rt>/mcp-route-guard.cjs` | `require('../../shared/hook-flags.cjs')` |
| `.mjs` (cursor) | `mcp-route-guard/cursor/mcp-route-guard.mjs` | `import … '../../shared/hook-flags.mjs'` |
| `.ts` (pi) | `mcp-route-guard/pi/mcp-route-guard.ts` | `import … '../../.opencode/hooks/shared/hook-flags.mjs'` (relative to the `.pi/extensions/` symlink base) |
| `.js` (opencode plugin) | `plugins/mk-mcp-route-guard.js` | `require('../hooks/shared/hook-flags.cjs')` |

### Proof

Fed `mcp__claude_ai_Figma__get_metadata` (an advisory-triggering call) to each stdin adapter under three env states:

| Adapter | default | `MK_MCP_ROUTE_GUARD_DISABLED=1` | `MK_HOOKS_DISABLED=1` |
|---|---|---|---|
| claude / codex / devin (.cjs) | ADVISORY | silent | silent |
| cursor (.mjs) | ADVISORY | silent | silent |

Plugin (`.js`) imports and loads clean; Pi (`.ts`) loads clean under `--preserve-symlinks` (mirrors the live Pi loader), confirming the `../../.opencode/hooks/shared/hook-flags.mjs` path resolves and the guard runs.

## PHASES 3-6 — pending

See `tasks.md`. Phase 3 fans the settled pattern out to the remaining hub concerns (dispatch, post-edit-quality, task-dispatch, goal); Phase 4 to the skill-owned concerns; Phase 5 completes the hub symlink index; Phase 6 is the cross-runtime validation sweep.
