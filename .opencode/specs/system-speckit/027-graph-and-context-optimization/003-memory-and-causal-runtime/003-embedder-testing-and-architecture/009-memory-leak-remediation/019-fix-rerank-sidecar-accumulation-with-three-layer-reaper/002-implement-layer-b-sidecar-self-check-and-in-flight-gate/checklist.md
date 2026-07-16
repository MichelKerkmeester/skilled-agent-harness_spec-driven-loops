---
title: "Verification Checklist: Layer B Sidecar Self-Check and In-Flight Gate"
description: "Checklist evidence for rerank_sidecar Layer B owner self-check, Layer A idle timeout, in-flight gate, telemetry, and tests."
trigger_phrases:
  - "arc 010 005 002 checklist"
  - "rerank sidecar self reaper checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/002-implement-layer-b-sidecar-self-check-and-in-flight-gate"
    last_updated_at: "2026-05-23T12:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-rerank-sidecar-reaper-checklist"
    next_safe_action: "parent-agent-commit-handoff"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100050020100050020100050020100050020100050020100050020100050020"
      session_id: "010-005-002-rerank-sidecar-self-reaper"
      parent_session_id: null
    completion_pct: 100
---
# Verification Checklist: Layer B Sidecar Self-Check and In-Flight Gate

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

|| Priority | Handling | Completion Impact |
||----------|----------|-------------------|
|| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
|| **[P1]** | Required | Must complete OR get user approval |
|| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in `plan.md`.
- [x] CHK-003 [P1] Dependencies identified and available.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Reaper is async-native and lifespan-managed; evidence: `rerank_sidecar.py:467-483`, `rerank_sidecar.py:379-382`.
- [x] CHK-011 [P0] In-flight gate is exception-safe; evidence: `rerank_sidecar.py:121-149`, `rerank_sidecar.py:517-535`, `rerank_sidecar.py:543-599`.
- [x] CHK-012 [P0] Reaper decisions send graceful self-SIGTERM after telemetry; evidence: `rerank_sidecar.py:307-325`.
- [x] CHK-013 [P1] Telemetry writes use temp-file replace and async executor on reaper path; evidence: `rerank_sidecar.py:266-315`.
- [x] CHK-014 [P1] No forbidden files are modified; evidence: changed-file list in `implementation-summary.md`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] In-flight gate blocks owner-death reap until drain; evidence: `test_rerank_sidecar.py:200-233`.
- [x] CHK-021 [P0] `/health` does not refresh idle timer; evidence: `test_rerank_sidecar.py:236-258`.
- [x] CHK-022 [P0] All-dead owners trigger reap; evidence: `test_rerank_sidecar.py:261-286`.
- [x] CHK-023 [P0] Partial owner death does not reap; evidence: `test_rerank_sidecar.py:289-309`.
- [x] CHK-024 [P0] Idle timeout fires at threshold; evidence: `test_rerank_sidecar.py:312-331`.
- [x] CHK-025 [P0] Telemetry JSONL contains structured fields; evidence: `test_rerank_sidecar.py:334-360`.
- [x] CHK-026 [P1] Manual debug opt-out prevents reaper task startup; evidence: `test_rerank_sidecar.py:363-372`.
- [x] CHK-027 [P1] Model loading is mocked in tests; evidence: `test_rerank_sidecar.py:20-31`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Layer B owner self-check implemented; evidence: `rerank_sidecar.py:217-240`, `rerank_sidecar.py:351-369`.
- [x] CHK-FIX-002 [P0] Layer A idle backstop implemented; evidence: `rerank_sidecar.py:203-214`, `rerank_sidecar.py:371-374`.
- [x] CHK-FIX-003 [P0] `/warmup` and `/rerank` refresh idle and gate active work; evidence: `rerank_sidecar.py:512-599`.
- [x] CHK-FIX-004 [P0] `/health` does not refresh idle; evidence: `rerank_sidecar.py:495-509`.
- [x] CHK-FIX-005 [P0] Manual opt-out is honored; evidence: `rerank_sidecar.py:72`, `rerank_sidecar.py:469-471`, `rerank_sidecar.py:351-354`.
- [x] CHK-FIX-006 [P1] Owner-death and idle decisions share one telemetry/SIGTERM path; evidence: `rerank_sidecar.py:318-348`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Reaper uses identity-verified `process_liveness` with recorded owner identity fields; evidence: `rerank_sidecar.py:223-240`.
- [x] CHK-031 [P0] Reaper does not terminate mid-request; evidence: pending decision path at `rerank_sidecar.py:328-348`.
- [x] CHK-032 [P1] Request auth behavior remains covered; evidence: `test_rerank_sidecar.py:149-156`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary synchronized.
- [x] CHK-041 [P1] Decision record notes telemetry env-name refinement.
- [x] CHK-042 [P1] Decision record notes app self-reaper legacy empty-owner policy.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Modified files are limited to approved source, test, and packet docs.
- [x] CHK-051 [P1] No inherited scratch placeholder remains in this packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

|| Check | Status | Evidence |
||-------|--------|----------|
|| Requested pytest | blocked by system Python deps | `/usr/bin/python3` missing FastAPI; command exits 2 during collection. |
|| Sidecar pytest | passed | `.venv/bin/python -m pytest tests/test_rerank_sidecar.py -v`: 15 passed. |
|| Ledger regression pytest | passed | `.venv/bin/python -m pytest tests/test_sidecar_ledger.py -v`: 22 passed. |
|| Syntax | passed | `.venv/bin/python -m py_compile scripts/rerank_sidecar.py tests/test_rerank_sidecar.py`. |
|| Alignment | passed | `verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar`: 0 errors, 0 warnings. |
|| Strict validate | passed | `validate.sh <this-folder> --strict`: exit 0 after final docs update. |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L2: Architecture Verification

- [x] CHK-ARCH-001 [P1] Lifespan task replaces daemon-thread approach.
- [x] CHK-ARCH-002 [P1] Layer B and Layer A share one in-flight safety primitive.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L2: Performance Verification

- [x] CHK-PERF-001 [P1] Reaper heartbeat defaults to 45 seconds and does no busy loop.
- [x] CHK-PERF-002 [P2] Telemetry I/O is offloaded from the reaper loop with `run_in_executor`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L2: Deployment Readiness

- [x] CHK-DEPLOY-001 [P1] Default idle timeout is 1800 seconds and manual debug can disable the reaper.
- [x] CHK-DEPLOY-002 [P1] Commit handoff lists every modified or created file by absolute path.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L2: Compliance Verification

- [x] CHK-COMPLIANCE-001 [P0] `validate.sh <packet> --strict` exits 0.
- [x] CHK-COMPLIANCE-002 [P1] Forbidden surfaces remain untouched.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L2: Documentation Verification

- [x] CHK-DOCS-001 [P1] `implementation-summary.md` status is Completed with completion_pct 100.
- [x] CHK-DOCS-002 [P1] `decision-record.md` exists and records refinements.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L2: Sign-Off

- [x] CHK-SIGNOFF-001 [P0] PACKET-010-005-002 handoff summary is present.
- [x] CHK-SIGNOFF-002 [P0] Parent agent can commit without additional scope discovery.
<!-- /ANCHOR:sign-off -->
