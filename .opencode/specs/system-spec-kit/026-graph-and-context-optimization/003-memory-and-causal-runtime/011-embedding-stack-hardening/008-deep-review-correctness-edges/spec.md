---
title: "Feature Specification: Deep-review correctness edges (re-validated)"
description: "Re-validate the deep-review correctness findings against HEAD and land the confirmed, isolated ones with regression tests. DR-014 / DR-013 / DR-001+015 landed; DR-002-P1-002 is a documented no-change (intentional degradation); DR-017 was already fixed."
trigger_phrases:
  - "deep review correctness edges"
  - "retention toctou adapter-cache provider-precedence fixes"
  - "C2 isolated correctness fixes re-validation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/031-embedding-stack-hardening/008-deep-review-correctness-edges"
    last_updated_at: "2026-05-29T23:05:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Landed DR-014 + DR-013 + DR-001/015 with regression tests; DR-002-P1-002 documented no-change"
    next_safe_action: "C3 single-writer/durability cluster (packet 009)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/governance/memory-retention-sweep.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/execution-router.ts"
      - ".opencode/skills/system-spec-kit/shared/embeddings/auto-select.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003181"
      session_id: "031-008-spec"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "DR-017 already fixed at HEAD (timestamp path is live) — no change."
      - "DR-002-P1-002: the fs-lock timeout is intentional graceful degradation to the in-process queue (belt-and-suspenders); failing closed would break legitimate single-process use — documented no-change."
      - "DR-013: re-create on cache-hit dimension mismatch (adapter.dim) — keeps the provider:model key so teardown is unaffected."
      - "DR-001/015: prefer-then-fallback — move an explicit EMBEDDINGS_PROVIDER to the front of the cascade, mirroring resolveProvider()."
---
# Feature Specification: Deep-review correctness edges (re-validated)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete (3 fixes landed + tested; 2 findings dispositioned) |
| **Created** | 2026-05-29 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | Deep-review remediation — isolated correctness edges |
| **Predecessor** | 007-ephemeral-pointer-guard-and-sweep |
| **Successor** | 009-single-writer-durability-cluster (C3) |
| **Handoff Criteria** | Each landed fix is independently re-validated at HEAD, has a regression test, builds, and passes vitest; dispositioned findings have recorded rationale. |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 20-iteration deep review flagged seven correctness findings as "isolated." The handover mandates re-validating each against HEAD before fixing. Re-validation showed the first-pass analysis was uneven: one finding was already fixed, one was mis-located (`acquireLock` does not exist; the real function is `acquireFilesystemLock`) and mis-framed (its "fail-open" is intentional graceful degradation), and the rest needed concrete design decisions rather than rote patches.

### Purpose
Land the confirmed, isolated findings with regression tests and an explicit design decision each; record the rationale for findings dispositioned as no-change or already-fixed — so nothing is applied blindly to operator-sensitive memory/embedder code.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope (landed, tested)
- **DR-014** (retention TOCTOU, data-loss): re-validate `delete_after` inside the delete transaction (`isStillExpired`), so a row un-expired by a concurrent writer between selection and deletion is not swept. Unit test on the predicate.
- **DR-013** (adapter cache ignored dimensions): re-create the adapter on a cache-hit dimension mismatch (`adapter.dim !== dimensions`), keeping the `provider:model` cache key so `teardownEmbedderAfterSwap` is unaffected. Regression test.
- **DR-001/015** (bootstrap ignored explicit provider): in the auto-select cascade, move an explicit `EMBEDDINGS_PROVIDER` to the front (prefer-then-fallback), mirroring `resolveProvider()` precedence. Regression test.

### Dispositioned (no code change)
- **DR-002-P1-002**: the workflow fs-lock timeout intentionally degrades to the in-process promise queue (belt-and-suspenders); failing closed (throw) would break legitimate single-process use when the lock is stale/contended. Documented no-change.
- **DR-017**: already fixed at HEAD — the `embedder_status` timestamp path is live.

### Out of Scope
- The single-writer/durability cluster (DR-005/006/012/016/011/020 + DR-001-P1-002 + DR-002-P1-001 + OR-R-01) → packet 009 (C3).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| mcp_server/lib/governance/memory-retention-sweep.ts | Modify | `isStillExpired` re-check in the delete tx + testables export |
| mcp_server/lib/embedders/execution-router.ts | Modify | Re-create adapter on cache-hit dimension mismatch |
| shared/embeddings/auto-select.ts | Modify | Prefer explicit `EMBEDDINGS_PROVIDER` in the cascade |
| mcp_server/tests/memory-retention-sweep.vitest.ts | Modify | TOCTOU-guard unit test |
| mcp_server/tests/embedders/execution-router.vitest.ts | Modify | Dimension-mismatch regression test |
| mcp_server/tests/embedder-auto-selection.vitest.ts | Modify | Explicit-provider precedence test |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each landed fix re-validated at HEAD | Read confirms the defect; line numbers re-located post-sweep |
| REQ-002 | Each landed fix has a regression test | New test asserts the corrected behavior and fails without the fix |
| REQ-003 | Build + vitest pass | Both workspaces build (exit 0); the 3 suites pass (10 + 14 + 9) |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Dispositioned findings have rationale | DR-002-P1-002 (no-change) + DR-017 (already-fixed) documented |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The 3 fixes land with passing regression tests and zero build regressions.
- **SC-002**: Every one of the 7 reviewed findings is either landed-with-test, dispositioned-with-rationale, or routed to the C3 cluster.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | First-pass deep-review patches were partly unreliable | Blind application would corrupt operator-sensitive code | Independent HEAD re-validation per finding; land only confirmed |
| Risk | DR-001/015 changes which provider persists at fresh boot | Operator-visible | Prefer-then-fallback keeps cascade resilience; covered by a test |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None — all seven reviewed findings are landed, dispositioned, or routed to packet 009.

<!-- /ANCHOR:questions -->
