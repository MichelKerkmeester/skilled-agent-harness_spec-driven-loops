---
title: "Implementation Summary: Post-rename fallout remediation"
description: "Fixed the stale sk-code/sk-doc test imports (router-sync now 10/10); the compiled-routing drift is a guarded legacy-fallback state that needs an operator-gated recompile, and the strict-validation dist stays blocked by another program's pi-hooks."
trigger_phrases:
  - "rename fallout remediation"
  - "router-sync stale import fixed"
  - "compiled routing operator-gated"
contextType: "implementation"
parent: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-mode-sk-prefix-rename/011-rename-fallout-remediation"
    last_updated_at: "2026-07-29T18:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Fixed 6 stale rename refs in sk-code-router-sync.vitest.ts (10/10 pass); documented REQ-2 operator-gated and REQ-3 externally blocked"
    next_safe_action: "Operator: recompile sk-doc compiled routing to re-activate the compiled path (REQ-2); rebuild mcp-server dist once the pi-hooks land (REQ-3)"
    blockers: []
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->

---

## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-rename-fallout-remediation |
| **Completed** | 2026-07-29 |
| **Level** | 2 |

---

## What Was Built

### REQ-1 — stale rename references in the router-sync test (fixed)

`sk-code-router-sync.vitest.ts` wouldn't load: it imported the removed `sk-doc/create-skill/...` path and hardcoded pre-rename sk-code mode names. Repointed six references to the canonical names — the `sk-create-skill` contract import, `code-opencode`→`sk-code-opencode` (three sites), `code-webflow`→`sk-code-webflow`, and the parent-tier path `code-review/assets/...`→`sk-code-review/assets/...`. The suite now loads and passes **10/10** (it was 0 tests / failed-to-load).

### REQ-2 — compiled-routing drift (operator-gated, no live bug)

The sk-doc compiled-routing manifest was never recompiled after the mode rename, so `compiled-routing-parity` reports `BLOCKED-BY-COMPILED-DRIFT` with 32 drift rows against the frozen route-gold. This is **not a live routing fault**: `compiled-route-status --hub sk-doc` shows `servingAuthority: "legacy"`, so the runtime already falls back to legacy and routes sk-doc correctly; the drift verdict is the guard working as designed. Re-activating the compiled path requires driving the gated compiler pipeline (`004-compiler` → `005-evaluator` → `013-live-activation`) and re-attesting the serving closure — there is no CLI/main regen entrypoint (the compiler is a library), so this is a deliberate operator release step, left operator-gated per the spec.

### REQ-3 — strict-validation dist (externally blocked)

`validate.sh --strict` is blocked by a stale `system-spec-kit/mcp-server` dist. The rebuild still fails on the in-flight `hooks/pi/*.ts` — `Cannot find module '@earendil-works/pi-coding-agent'`, plus `noImplicitAny` (TS7006) and `.ts`-extension import (TS5097) errors. Those files belong to the hook-runtime program (worktrees 0118/0120), out of scope here. Recorded as an external blocker; the rebuild belongs to that program / CI.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `system-deep-loop/deep-improvement/scripts/skill-benchmark/tests/sk-code-router-sync.vitest.ts` | Modified | Repoint 6 stale pre-rename references to canonical `sk-*` names |

---

## How It Was Delivered

Investigated each finding against the live tree, fixed only the one file the rename actually broke, and reached the documented-alternative outcome the spec allowed for the two that are genuinely gated/external. Verified REQ-1 by re-running the suite to green; verified REQ-2's non-urgency via the live serving-status probe; verified REQ-3's blocker by attempting the build.

---

## Verification

| Check | Result |
|-------|--------|
| `sk-code-router-sync.vitest.ts` | PASS — 10/10 (was failed-to-load) |
| 0 stale `create-*`/`code-*` literals in the test | PASS |
| sk-doc compiled-routing parity | drift confirmed (32 rows) — guarded: live serving is `legacy` (correct) |
| `compiled-route-status --hub sk-doc` | `servingAuthority: legacy` — no live mis-route |
| mcp-server dist rebuild | FAIL — `@earendil-works/pi-coding-agent` missing + pi-hook type errors (external) |

---

## Known Limitations

1. **REQ-2 operator action:** re-activating sk-doc compiled routing requires an operator-gated recompile + serving-closure re-attestation. Routing is correct via legacy until then; no urgency.
2. **REQ-3 external blocker:** the mcp-server dist rebuild is blocked by the hook-runtime program's `hooks/pi/*.ts`; unblocks `validate.sh --strict` once that lands. Do it on main/CI.
