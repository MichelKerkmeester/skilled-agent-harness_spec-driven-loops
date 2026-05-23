---
title: "Verification Checklist: Rerank-Sidecar Accumulation Investigation and Reaper Design"
description: "Canonical-anchor verification checklist for the rerank_sidecar lifecycle investigation, reaper design, ADRs, and follow-on handoff."
trigger_phrases:
  - "arc 010 004 001 checklist"
  - "rerank sidecar reaper checklist"
importance_tier: "critical"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/010-system-spec-kit-mcp-sidecar-investigation/004-rerank-sidecar-accumulation-investigation-and-reaper-design/001-investigate-and-design-reaper-architecture"
    last_updated_at: "2026-05-23T10:45:00Z"
    last_updated_by: "codex"
    recent_action: "completed-rerank-sidecar-reaper-checklist"
    next_safe_action: "strict validation evidence supports implementation packet handoff"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0100040010100040010100040010100040010100040010100040010100040010"
      session_id: "010-004-001-rerank-reaper-design"
      parent_session_id: null
    completion_pct: 100
---
# Verification Checklist: Rerank-Sidecar Accumulation Investigation and Reaper Design

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-010 [P0] No runtime source files modified; evidence: authored docs are confined to this packet folder.
- [x] CHK-011 [P0] Lifecycle claims cite file:line evidence; evidence: `research/iter-001.md`.
- [x] CHK-012 [P1] Current detach line corrected from stale memory; evidence: `mcp-coco-index/.../core/client.py:327`, `ensure_rerank_sidecar.py:269`, `ensure-rerank-sidecar.cjs:392-400`.
- [x] CHK-013 [P1] No out-of-scope arc 010/001/002/003 review artifacts were edited.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Findings registry contains at least 10 findings; evidence: 12 findings in `research/findings-registry.json`.
- [x] CHK-021 [P0] ADR count is at least 5; evidence: 7 ADRs in `decision-record.md`.
- [x] CHK-022 [P0] Layer-interaction matrix computes marginal coverage for B, D, and A; evidence: `research/research.md` section 6.
- [x] CHK-023 [P1] Strict validation command exits 0; evidence: final validation output recorded in `implementation-summary.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Root-cause lifecycle map complete; evidence: `research/iter-001.md` lifecycle map.
- [x] CHK-FIX-002 [P0] Ledger ownership lifecycle complete; evidence: `research/iter-001.md` ledger section.
- [x] CHK-FIX-003 [P0] Existing GC paths audited; evidence: `research/iter-001.md` existing GC section.
- [x] CHK-FIX-004 [P0] Failure-mode inventory covers at least 6 cases; evidence: 10 cases in `research/research.md` section 2.
- [x] CHK-FIX-005 [P1] Follow-on Files-to-Change list includes concrete absolute paths, invariants, and parity-test requirements; evidence: `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] PID reuse hazard is explicitly addressed by identity-verified liveness.
- [x] CHK-031 [P0] Unknown liveness errors fail open for safety and emit structured reasons.
- [x] CHK-032 [P1] Operator-spawned debug sidecars are not reaped by launcher pre-flight unless they are registered in the ledger; idle backstop includes an opt-out for manual debug.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, checklist, decision record, research, registry, and implementation summary are synchronized.
- [x] CHK-041 [P1] ADRs include architecture, identity check, ledger schema, defaults, parity tests, telemetry, and in-flight gate.
- [x] CHK-042 [P2] Parent phase scope remains unchanged.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Created files are limited to the approved child packet and its `research/` subtree.
- [x] CHK-051 [P1] No generated scratch or temporary files remain in the packet.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

|| Finding | Severity | Fingerprint | Status | Evidence |
||---------|----------|-------------|--------|----------|
|| F001 | P1 | `lifecycle:cocoindex-client:daemon-detaches-with-start-new-session` | confirmed | client.py:263,327 |
|| F002 | P1 | `lifecycle:cocoindex-cli:mcp-default-ensures-sidecar` | confirmed | cli.py:139-168,1196 |
|| F003 | P0 | `lifecycle:python-launcher:detached-sidecar-start-new-session` | confirmed | ensure_rerank_sidecar.py:263-280 |
|| F004 | P0 | `lifecycle:js-launcher:detached-spawn-unref` | confirmed | ensure-rerank-sidecar.cjs:391-409 |
|| F005 | P1 | `lifecycle:start-sh:uvicorn-single-worker-exec` | confirmed | start.sh:88-89 |
|| F006 | P0 | `lifecycle:ledger:schema-lacks-owner-identity-list` | confirmed | sidecar_ledger.py:32-69 |
|| F007 | P0 | `lifecycle:ledger:reclaim-stale-removes-dead-sidecar-rows-only` | confirmed | sidecar_ledger.py:263-273 |
|| F008 | P0 | `lifecycle:js-launcher:reuse-gc-keeps-alive-ownerless-sidecars` | confirmed | ensure-rerank-sidecar.cjs:332-350 |
|| F009 | P0 | `lifecycle:python-launcher:reuse-classification-is-sidecar-process-centric` | confirmed | sidecar_ledger.py:241-260,276-318 |
|| F010 | P0 | `lifecycle:app:no-owner-heartbeat-or-idle-exit` | confirmed | rerank_sidecar.py:230-235,247-261,289-339 |
|| F011 | P1 | `lifecycle:health:token-and-config-prove-reuse-not-owner-liveness` | confirmed | rerank_sidecar.py:247-261 |
|| F012 | P1 | `lifecycle:python-launcher:healthy-port-collision-can-spawn-new-port` | confirmed | ensure_rerank_sidecar.py:247-249 |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L2: Architecture Verification

- [x] CHK-ARCH-001 [P1] Three-layer B+D+A architecture has non-zero marginal coverage per layer.
- [x] CHK-ARCH-002 [P1] Identity-check contract records `(pid, create_timestamp, comm)` per owner and treats mismatch as `pid-recycled`.
- [x] CHK-ARCH-003 [P1] Ledger schema extension is versioned and backward-compatible with legacy rows.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L2: Performance Verification

- [x] CHK-PERF-001 [P1] Heartbeat default set to 45s to bound orphan lifetime while keeping `ps`/`kill(0)` overhead negligible.
- [x] CHK-PERF-002 [P1] Idle timeout default set to 30 minutes to reclaim warm model RAM after inactive sessions.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L2: Deployment Readiness

- [x] CHK-DEPLOY-001 [P1] Follow-on packet has concrete source/test/docs file list.
- [x] CHK-DEPLOY-002 [P1] Commit handoff lists every modified or created packet file by absolute path.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L2: Compliance Verification

- [x] CHK-COMPLIANCE-001 [P0] `validate.sh <packet> --strict` exits 0.
- [x] CHK-COMPLIANCE-002 [P1] No forbidden source files are modified.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L2: Documentation Verification

- [x] CHK-DOCS-001 [P1] `implementation-summary.md` status is Completed with completion_pct 100.
- [x] CHK-DOCS-002 [P1] `decision-record.md` exists and records 7 ADRs.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L2: Sign-Off

- [x] CHK-SIGNOFF-001 [P0] PACKET-010-004-001 handoff summary is present.
- [x] CHK-SIGNOFF-002 [P0] Parent agent can open follow-on implementation packet without additional lifecycle discovery.
<!-- /ANCHOR:sign-off -->
