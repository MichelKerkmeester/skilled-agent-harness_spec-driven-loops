---
title: "Implementation Summary: Hook Feature Flags + Full Hub Index"
description: "Running log across six phases. Phase 1 shipped: a shared kill-switch guard (master + per-concern + legacy aliases) in three module flavors with a passing test suite. Remaining phases wire it into every runtime adapter and complete the hub symlink index."
status: "in-progress"
completion_pct: 15
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
    recent_action: "Phase 1 shipped: shared hook-flags guard + master switch; node --test 7/7"
    next_safe_action: "Phase 2 pilot: wire guard into all 6 mcp-route-guard adapters"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - ".opencode/hooks/shared/hook-flags.cjs"
      - ".opencode/hooks/shared/hook-flags.test.cjs"
    session_dedup:
      fingerprint: "sha256:89322d98d14112bf9b68ee277e5dfe0f50b343c1c5f005e6455185d337a5a6aa"
      session_id: "4654af88-ba88-466a-bd14-2fa43ea87923"
      parent_session_id: null
    completion_pct: 15
    open_questions:
      - "Exact per-runtime import path for the guard (settled in the Phase 2 pilot)"
    answered_questions:
      - "Full hub index (symlink skill hooks in) vs portable-only -> full index"
      - "Per-concern-family flags vs per-adapter -> per-concern family + master switch"
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

## PHASES 2-6 — pending

See `tasks.md`. Phase 2 pilots the guard on `mcp-route-guard` across all six runtimes and settles the per-runtime import path before the fan-out.
