---
title: "Implementation Summary: Hook Feature Flags + Full Hub Index"
description: "Running log across six phases. Phases 1-4 shipped the shared guard and wired it through portable and skill-owned hook concerns. Phase 5 adds the full hub symlink index; Phase 6 remains the final cross-runtime sweep."
status: "in-progress"
completion_pct: 83
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
    recent_action: "Phase 5 shipped: 49 relative hub-index symlinks resolve to every Phase 4 adapter"
    next_safe_action: "Phase 6: rebuild required dist outputs, then run the final cross-runtime validation sweep"
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
    completion_pct: 83
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

## PHASE 3 — Remaining hub concerns (shipped)

Commit `5cf07cf7bd` guarded dispatch, post-edit-quality, task-dispatch, and goal adapters across their runtime surfaces. Existing plugin-local disable checks were replaced with the shared helper while each adapter retained its prior fail-open or no-op path.

## PHASE 4 — Skill-owned concerns (shipped)

The shared guard now covers 41 skill-local adapter files and 8 remaining OpenCode plugin adapters across `skill-advisor`, `spec-gate`, `spec-memory`, `completion`, `session-lifecycle`, `git-preflight`, `directive-lifecycle`, `dist-freshness`, `codex-watchdog`, and `permission-policy`. Every guard is at the adapter entry before normal work, and the default remains on.

### Runtime and build boundary

Source-direct `.mjs`/`.cjs` hooks and Pi `.ts` symlink targets take effect immediately. Claude, Codex, Cursor, and Devin lifecycle/prompt adapters are invoked from `system-spec-kit/mcp-server/dist/hooks/`, while canonical advisor hooks target `system-skill-advisor/mcp-server/dist/`; both packages need a rebuild before those compiled runtime paths carry the Phase 4 guards. The requested implementation pass did not rebuild dist.

### Proof

- All changed JavaScript and TypeScript files passed Node syntax checks; all 41 skill-local guard import/require edges resolved directly.
- Eight Pi adapters loaded from `.pi/extensions/` with `--preserve-symlinks`, proving their symlink-relative guard imports.
- `git-preflight` emitted its existing destructive-reset advisory by default and emitted nothing under either `MK_GIT_PREFLIGHT_DISABLED=1` or `MK_HOOKS_DISABLED=1`.
- `dist-freshness` and `codex-watchdog` plugins registered their existing hooks by default and returned `{}` under their concern switch and the master switch.
- Completion plugin tests passed 5/5; shared guard tests passed 7/7; comment-hygiene checks reported no violations in the Phase 4 code diff.

The broader typecheck/plugin suite remains blocked by checkout provisioning: Spec Kit typecheck rejects the existing deprecated `baseUrl` setting, Skill Advisor typecheck cannot find its TypeScript binary, and runtime/plugin imports that reach `system-skill-advisor/mcp-server/dist/mcp-server/lib/policy-plan.js` fail because that dist tree is absent.

## PHASE 5 — Full hub index (shipped)

The hub now includes 49 relative symlinks under the ten skill-owned concern folders. Every link resolves with `readlink -f` to the Phase 4 adapter that remains in its owning skill or `.opencode/plugins/`; no implementation file moved. Duplicate Claude basenames are disambiguated with `speckit-` for the Spec Kit shim/bridge while retaining the canonical Skill Advisor target. The shared Git preflight adapter is indexed once under `git-preflight/shared/` because the same physical file serves Claude, Codex, Cursor, and Devin.

The packet plan also named edits to `.opencode/hooks/README.md` and `injection-contract.md`, but this implementation's explicit scope lock permits only symlink creation under `.opencode/hooks/`. Those documentation edits were skipped rather than exceeding scope.

## PHASE 6 — pending

Phase 6 remains the final cross-runtime validation sweep after required dist rebuilds.
