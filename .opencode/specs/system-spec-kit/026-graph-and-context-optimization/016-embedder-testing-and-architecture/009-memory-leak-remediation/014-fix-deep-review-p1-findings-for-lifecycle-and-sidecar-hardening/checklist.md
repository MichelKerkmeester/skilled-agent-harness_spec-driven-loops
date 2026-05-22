---
title: "Checklist: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening"
description: "Verification ledger with one row per active arc 009 deep-review finding."
trigger_phrases:
  - "arc 009 phase 014 checklist"
  - "deep review finding checklist"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening"
    last_updated_at: "2026-05-22T19:00:00Z"
    last_updated_by: "codex"
    recent_action: "created-phase-014-finding-checklist"
    next_safe_action: "fill-checklist-evidence-during-batch-implementation"
    blockers: []
    key_files:
      - "checklist.md"
      - "../review/deep-review-findings-registry.json"
    session_dedup:
      fingerprint: "sha256:0140140140140140140140140140140140140140140140140140140140140140"
      session_id: "009-memory-leak-remediation-014"
      parent_session_id: null
    completion_pct: 0
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->
# Checklist: Deep-Review P1 Findings Remediation for Lifecycle and Sidecar Hardening

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P1** | Required | Must close or have explicit parent-approved deferral before phase completion. |
| **P2** | Advisory | Can defer with rationale, owner, and reopen trigger. |

Status values: `open`, `closed`, `deferred`, `blocked`.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P1] Registry, report, and resource map are read before implementation.
- [ ] CHK-002 [P1] Batch scope is selected from `scratch/batch-plan.md`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P1] Shared ownership helpers or parity tests cover mirrored protocols.
- [ ] CHK-011 [P1] No implementation batch modifies review artifacts.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P1] Batch-specific Vitest/pytest/shell tests pass.
- [ ] CHK-021 [P1] Touched phase docs pass strict validation.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

### Finding Ledger

| Finding ID | Severity | Batch | Status | Evidence |
|------------|----------|-------|--------|----------|
| DR009-COR-001 | P1 | B1 | closed-by-arc-118 | Evidence: `deep-loop-runtime/lib/deep-loop/loop-lock.ts` ships `writeLoopLockExclusive` (O_EXCL); `deep-loop-runtime/tests/unit/loop-lock.vitest.ts` "allows exactly one fresh concurrent acquire to win" (7/7 PASSED). Closed by arc 118 deep-loop FULL_ISOLATE migration (commits `954702a8f4` + `107c522599`), independent of phase 014 edits. |
| DR009-COR-002 | P1 | B1 | closed | Evidence: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md#b1-commit-handoff` |
| DR009-COR-013 | P1 | B1 | closed | Evidence: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md#b1-commit-handoff` |
| DR009-COR-014 | P1 | B1 | closed | Evidence: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md#b1-commit-handoff` |
| DR009-COR-015 | P1 | B1 | closed | Evidence: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md#b1-commit-handoff` |
| DR009-MNT-002 | P1 | B1 | closed | Evidence: `/Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/014-fix-deep-review-p1-findings-for-lifecycle-and-sidecar-hardening/scratch/batch-plan.md#b1-commit-handoff` |
| DR009-COR-003 | P1 | B2 | closed | Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/runtime/shutdown-hooks.ts:129` routes SIGTERM/SIGINT through terminal shutdown; `mcp_server/tests/lib/runtime/shutdown-hooks.vitest.ts:42` and `:57` cover clean signal exit 143 and hook-failure exit 1. |
| DR009-COR-005 | P1 | B2 | closed | Evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:91` gates FTS sync and `_initial_index_done` behind completed update; `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:571` logs cancelled work; `mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:344` covers cancelled updates skipping FTS and initial-done mutation. |
| DR009-COR-007 | P1 | B2 | closed | Evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:460` awaits active-work drain before config-refresh close and `:461` skips close on timeout; `mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:419` covers active indexing preventing config-refresh close. |
| DR009-COR-008 | P1 | B2 | closed | Evidence: `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:138` signals the process group, `:385` bounded-waits then escalates SIGKILL, and `:399` drops child references only after termination; `mcp_server/tests/embedders/sidecar-hardening.vitest.ts:133` covers SIGTERM-resistant timeout cleanup. |
| DR009-COR-009 | P1 | B2 | closed | Evidence: `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:220` writes the ledger row before warmup and `:232` terminates/reclaims on timeout; `tests/test_sidecar_ledger.py:239` covers ledger-before-health plus SIGTERM/SIGKILL timeout cleanup. |
| DR009-COR-010 | P1 | B2 | closed | Evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:42` marks closed only after DB close succeeds and records degraded retryable state on failure; `mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:388` covers retry after failed close. |
| DR009-COR-012 | P2 | B2 | closed | Evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:110` filters shutdown cancellation to running/queued rows; `mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:440` covers completed history remaining complete while running rows cancel. |
| DR009-MNT-003 | P1 | B2 | closed | Evidence: `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/lifecycle/daemon_task_registry.py:17` defines `DuplicateTaskIdError` and `:83` rejects duplicate registrations; `mcp_server/tests/lifecycle/test_remove_project_lifecycle.py:464` covers duplicate task ID rejection. |
| DR009-SEC-001 | P1 | B3 | open | TBD: commit hash + rerank API-key startup test |
| DR009-SEC-002 | P1 | B3 | open | TBD: commit hash + warmup auth/rate test |
| DR009-SEC-003 | P1 | B3 | open | TBD: commit hash + ownership proof test |
| DR009-SEC-004 | P1 | B3 | open | TBD: commit hash + stale identity retention test |
| DR009-SEC-005 | P2 | B3 | open | TBD: commit hash or deferral rationale |
| DR009-SEC-006 | P2 | B3 | open | TBD: commit hash or deferral rationale |
| DR009-SEC-007 | P1 | B3 | open | TBD: commit hash + DB override containment test |
| DR009-SEC-008 | P1 | B3 | open | TBD: commit hash + document-byte cap test |
| DR009-SEC-009 | P1 | B3 | open | TBD: commit hash + ledger identity kill test |
| DR009-SEC-010 | P1 | B3 | open | TBD: commit hash + CocoIndex binary containment test |
| DR009-SEC-011 | P2 | B3 | open | TBD: commit hash or deferral rationale |
| DR009-SEC-012 | P1 | B3 | open | TBD: commit hash + executor env allowlist test |
| DR009-SEC-013 | P1 | B3 | open | TBD: commit hash + NODE_OPTIONS dotenv test |
| DR009-SEC-014 | P1 | B3 | open | TBD: commit hash + arg-array git diff test |
| DR009-SEC-015 | P1 | B3 | open | TBD: commit hash + process inventory redaction test |
| DR009-SEC-016 | P1 | B3 | open | TBD: commit hash + unpredictable token test |
| DR009-SEC-017 | P2 | B3 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-001 | P1 | B3 | open | TBD: commit hash + helper contract parity test |
| DR009-COR-004 | P1 | B4 | open | TBD: commit hash + corrupt JSONL tail test |
| DR009-COR-006 | P1 | B4 | open | TBD: commit hash + degraded inventory test |
| DR009-COR-016 | P2 | B4 | open | TBD: commit hash or deferral rationale |
| DR009-COR-017 | P2 | B4 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-009 | P1 | B4 | open | TBD: commit hash + executor config schema test |
| DR009-TRC-001 | P1 | B5 | open | TBD: commit hash + supervised executor coverage |
| DR009-TRC-002 | P1 | B5 | open | TBD: commit hash + true concurrent lock fixture |
| DR009-TRC-003 | P1 | B5 | open | TBD: commit hash + queued remove fixture |
| DR009-TRC-004 | P1 | B5 | open | TBD: commit hash + integrated retention workload |
| DR009-TRC-005 | P1 | B5 | open | TBD: commit hash + RSS slope evidence |
| DR009-TRC-006 | P1 | B5 | open | TBD: commit hash + SC-003 reconnect evidence |
| DR009-TRC-007 | P1 | B5 | open | TBD: commit hash + public index_cancel transport test |
| DR009-TRC-009 | P1 | B5 | open | TBD: commit hash + parent-death cleanup evidence |
| DR009-TRC-010 | P1 | B5 | open | TBD: commit hash + macOS child-liveness fixture |
| DR009-TRC-011 | P1 | B5 | open | TBD: commit hash + memory index scan evidence |
| DR009-COR-011 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-TRC-008 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-TRC-012 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-004 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-005 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-006 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-007 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-008 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-010 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-011 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-012 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-013 | P2 | B6 | open | TBD: commit hash or deferral rationale |
| DR009-MNT-014 | P2 | B6 | open | TBD: commit hash or deferral rationale |
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P1] Subprocess environment allowlists are tested where security findings touch spawn paths.
- [ ] CHK-031 [P1] Owner tokens and sensitive command-line values are redacted in operator-facing outputs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `checklist.md` evidence is updated for every closed or deferred finding.
- [ ] CHK-041 [P1] `implementation-summary.md` records final status and residual risk.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Scratch material remains under `scratch/`.
- [ ] CHK-051 [P1] No generated temp files are left in implementation surfaces.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P1] ADR decisions are either accepted or updated with implementation rationale.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [ ] CHK-110 [P2] RSS benchmark evidence is recorded for DR009-TRC-005 or explicitly deferred.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [ ] CHK-120 [P1] Parent agent has enough evidence to commit after all batches.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] P1 deferrals, if any, have explicit parent approval.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] Phase 014 and arc 009 parent pass strict validation.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-Off

- [ ] CHK-150 [P1] Parent agent accepts the final batch evidence and handles commit.
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Closed | Deferred | Open |
|----------|-------|--------|----------|------|
| P1 Findings | 40 | 13 | 0 | 27 |
| P2 Findings | 20 | 1 | 0 | 19 |
| Batches | 6 | 2 | 0 | 4 |

**Verification Date**: 2026-05-22
**Verified By**: codex
**ADRs**: 12 total in `decision-record.md`; B1/B2 cleanup correctness ADRs accepted where implemented.
<!-- /ANCHOR:summary -->
