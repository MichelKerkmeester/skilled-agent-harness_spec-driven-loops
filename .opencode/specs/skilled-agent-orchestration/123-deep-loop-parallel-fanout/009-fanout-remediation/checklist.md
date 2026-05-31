---
title: "Verification Checklist: Deep-loop fan-out remediation (009)"
description: "P0/P1/P2 verification for the 14 fan-out fixes, including the architecture parity gate and the two P0-catching tests the original suite lacked."
trigger_phrases:
  - "123 phase 009 checklist"
  - "fanout remediation checklist"
  - "fanout fix verification"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/123-deep-loop-parallel-fanout/009-fanout-remediation"
    last_updated_at: "2026-05-31T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level-3 checklist; P0/P1/P2 + parity gate"
    next_safe_action: "Verify items as Phase 1 P0 fixes land"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Deep-loop fan-out remediation (009)

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [ ] CHK-001 [P0] Findings source-verified (008 review + 2 Opus iterations)
  - **Evidence**: `008-deep-review/review/review-report.md` + `opus/iterations/iteration-00{1,2}.md`
- [ ] CHK-002 [P0] Reuse targets confirmed before wiring
  - **Evidence**: `executor-audit.ts:663` (async spawn), `:466` (env allowlist), `session-state-hierarchy.cjs:25` (pad3)
- [ ] CHK-003 [P1] Single-executor parity baseline captured before changes

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [ ] CHK-010 [P0] No comment-hygiene violations (no spec/phase/finding ids in code comments)
  - **Evidence**: pre-commit gate passes on the touched `.cjs`/`.ts` files
- [ ] CHK-011 [P1] Reused helpers, not re-implemented (async spawn, env allowlist, pad)
- [ ] CHK-012 [P1] Changes follow existing runtime patterns (CJS scripts, TS lib, zod schema)

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## TESTING

- [ ] CHK-020 [P0] Real-spawn concurrency test present and green (catches C-01)
  - **Evidence**: cap-2 run shows ≥2 subprocesses alive at once
- [ ] CHK-021 [P0] All-lineages-fail → non-PASS merged verdict test present and green (catches C-02)
- [ ] CHK-022 [P0] Full fanout suite green from `system-spec-kit/mcp_server`
- [ ] CHK-023 [P1] BOUNDS / XOR / DEDUP / ENV / padding tests present and green

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [ ] CHK-024 [P0] All 14 review findings have a landed fix + its test (C-01, C-02, U-01, C-03, C-04, N-01, N-02, N-04, MERGE-DROP, MERGE-DEDUP, BOUNDS, XOR, ENV-LEAK, TIMEOUT-ORPHANS)
- [ ] CHK-025 [P0] Single-executor path byte-identical to `main` (parity gate, ADR-005)
  - **Evidence**: diff of config/state(modulo timestamps)/iteration md/final report = empty
- [ ] CHK-026 [P1] C-03 lineage runs the command verbatim (no synthesized prompt); `lineage.iterations` is the iteration cap
- [ ] CHK-027 [P1] Executor field `.kind` canonical end-to-end (native default branches correctly)

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## SECURITY

- [ ] CHK-030 [P1] Child env allowlisted; no blanket secret passthrough (ENV-LEAK)
  - **Evidence**: a non-allowlisted var absent in child env in test
- [ ] CHK-031 [P1] Hostile config (huge count/concurrency) rejected (BOUNDS)
- [ ] CHK-032 [P1] No orphan subprocess survives a timed-out lineage (TIMEOUT-ORPHANS)

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [ ] CHK-040 [P1] U-01 executor field aligned to `.kind` across docs + YAML
- [ ] CHK-041 [P2] Children 003-006 have impl-summaries + fresh graph-metadata (DOC-STALENESS)
- [ ] CHK-042 [P2] Parent `spec.md` continuity refreshed (no stale completion_pct:33)

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [ ] CHK-050 [P1] Commits scoped by pathspec; daemon graph-metadata churn excluded
- [ ] CHK-051 [P1] No temp/scratch files left in the packet

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 0/9 (planned) |
| P1 Items | 12 | 0/12 (planned) |
| P2 Items | 3 | 0/3 (planned) |

**Status**: PLANNED — implementation not started. No completion claims until items verified with evidence. Architecture parity gate (CHK-025) and the two P0-catching tests (CHK-020, CHK-021) are the non-negotiable gates; performance target (fan-out wall-clock ≈ ceil(N/K)×per-lineage, NFR-P01) verified via the real-spawn test.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:arch-verify -->
## L3: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Single-executor path byte-identical to `main` (parity gate, ADR-005)
  - **Evidence**: diff of config/state(modulo timestamps)/iteration md/final report = empty
- [ ] CHK-101 [P0] ADRs documented in decision-record.md with status Accepted (ADR-001..005)
- [ ] CHK-102 [P1] C-01 rewrite confined to the inner fan-out worker (TSX self-respawn left synchronous, N-02)

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P1] Fan-out wall-clock ≈ ceil(N/K)×per-lineage, not N× (NFR-P01)
  - **Evidence**: timed real-spawn test or manual 2-lineage run
- [ ] CHK-111 [P2] No measurable regression on the single-executor path

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure documented (plan.md §7/§10) — fan-out is opt-in, revert restores prior behavior
- [ ] CHK-121 [P1] Fanout suite count recorded before/after (regression floor 72)
- [ ] CHK-122 [P2] `validate.sh --strict` green on 009

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] All changes hold packet 123 §2's byte-identical parity contract (ADR-005)
- [ ] CHK-131 [P1] Comment-hygiene gate passes on every touched code file (no spec/phase/finding ids in comments)
- [ ] CHK-132 [P2] No new external dependency introduced (reuse-first per ADR-003)

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] U-01 executor field aligned to `.kind` across docs + YAML
- [ ] CHK-141 [P2] Children 003-006 have impl-summaries + fresh graph-metadata (DOC-STALENESS)
- [ ] CHK-142 [P2] Parent `spec.md` continuity refreshed (no stale completion_pct:33)

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3: SIGN-OFF

- [ ] CHK-150 [P0] All 14 findings fixed + tested; full fanout suite green; parity gate green
- [ ] CHK-151 [P0] Implementation-summary updated from PLANNED to actual with verification evidence
- [ ] CHK-152 [P1] Operator review of the merged remediation before closing the phase

<!-- /ANCHOR:sign-off -->
