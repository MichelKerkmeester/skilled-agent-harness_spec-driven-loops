---
title: "Implementation Summary: Deep-review correctness edges"
description: "Landed 3 of the deep-review's isolated correctness findings (retention TOCTOU, adapter-cache dimensions, explicit-provider precedence) with regression tests; dispositioned 2 (lock fail-open = intentional degradation; status timestamps = already fixed)."
trigger_phrases:
  - "deep review correctness edges summary"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/008-deep-review-correctness-edges"
    last_updated_at: "2026-05-29T23:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "3 fixes landed + tested; 2 dispositioned"
    next_safe_action: "C3 cluster (packet 009)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003184"
      session_id: "031-008-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Deep-review correctness edges

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 031-embedding-stack-hardening/008-deep-review-correctness-edges |
| **Completed** | 2026-05-29 |
| **Level** | 1 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

Three deep-review correctness fixes, each independently re-validated at HEAD and shipped with a regression test. Two further findings were dispositioned after re-validation rather than patched.

### DR-014 — retention sweep TOCTOU (data-loss)
The retention sweep selected expired rows outside any transaction, then deleted them by id with no re-check. A concurrent writer could push `delete_after` into the future between selection and deletion, and the row was still deleted. Added `isStillExpired()` re-validated inside the delete transaction (mirrors `selectExpiredRows`), so an un-expired row is skipped. Unit-tested via a new `__retentionSweepTestables` export.

### DR-013 — adapter cache ignored dimensions
`getEmbedderAdapter` cached by `provider:model`, so a later request with a different `dimensionsOverride` reused a wrong-dimension adapter. Now it re-creates when `adapter.dim !== dimensions` — keeping the `provider:model` key so `teardownEmbedderAfterSwap` (which has no dimension) is unaffected.

### DR-001/015 — bootstrap ignored explicit provider
The fresh-boot auto-selector ran the local-first cascade (ollama → hf-local → openai → voyage) and never honored an explicitly-set `EMBEDDINGS_PROVIDER`. It now moves an explicit provider to the front of the cascade (prefer-then-fallback), mirroring `resolveProvider()` precedence.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `mcp_server/lib/governance/memory-retention-sweep.ts` | Modified | `isStillExpired` in-tx guard + testables export |
| `mcp_server/lib/embedders/execution-router.ts` | Modified | Re-create adapter on dimension mismatch |
| `shared/embeddings/auto-select.ts` | Modified | Prefer explicit `EMBEDDINGS_PROVIDER` |
| `mcp_server/tests/memory-retention-sweep.vitest.ts` | Modified | TOCTOU-guard test |
| `mcp_server/tests/embedders/execution-router.vitest.ts` | Modified | Dimension-mismatch test |
| `mcp_server/tests/embedder-auto-selection.vitest.ts` | Modified | Explicit-provider precedence test |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The handover required re-validating each finding against HEAD before fixing, and that paid off: the first-pass deep-review analysis was uneven. DR-017's described defect did not exist (already fixed). DR-002-P1-002 cited a function (`acquireLock`) that does not exist — the real lock is `acquireFilesystemLock`, whose timeout fallback is an *intentional* graceful degradation to the in-process promise queue, so failing closed would break legitimate single-process use; left unchanged with rationale. The three landed fixes each got a design decision (in-tx re-check; dimension-aware cache invalidation that preserves the teardown key; prefer-then-fallback precedence) and a regression test. The DR-013 test initially over-asserted lazy provider construction; correcting it confirmed the fix via the dim/identity assertions. Verified: both workspaces build (`tsc`, exit 0); the three suites pass (retention 10/10, execution-router 14/14, auto-selection 9/9).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| DR-013: re-create on `adapter.dim` mismatch, keep `provider:model` key | Avoids breaking `teardownEmbedderAfterSwap` (which has no dimension) while never serving a wrong-dim adapter |
| DR-001/015: prefer-then-fallback, not strict | Honors an operator's explicit provider while keeping the cascade's resilience if it is unreachable |
| DR-002-P1-002: no change | The fs-lock timeout deliberately degrades to the in-process queue; throwing would regress legitimate single-process flows |
| Re-validate every finding before patching | The first-pass analysis included a hallucinated location and an already-fixed item; blind application would have damaged operator-sensitive code |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| TS build (`@spec-kit/shared` + `@spec-kit/mcp-server`) | PASS — exit 0 |
| `memory-retention-sweep.vitest.ts` | PASS — 10/10 (incl. TOCTOU guard) |
| `embedders/execution-router.vitest.ts` | PASS — 14/14 (incl. dim-mismatch) |
| `embedder-auto-selection.vitest.ts` | PASS — 9/9 (incl. explicit-provider precedence) |
| `validate.sh --strict` (this packet) | PASS |

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **DR-002-P1-002 left as-is.** If a future requirement demands hard cross-process exclusivity (no degradation), the fs-lock timeout path would need an opt-in fail-closed mode — a separate decision.
2. **DR-014 guard is unit-tested at the predicate level.** A true select-then-concurrent-update-then-delete race needs multi-process injection; the predicate test asserts the guard's correctness directly.
3. **Cluster findings excluded.** DR-005/006/012/016/011/020 + DR-001-P1-002 + DR-002-P1-001 + OR-R-01 are the coordinated single-writer/durability packet (009), not this one.

<!-- /ANCHOR:limitations -->
