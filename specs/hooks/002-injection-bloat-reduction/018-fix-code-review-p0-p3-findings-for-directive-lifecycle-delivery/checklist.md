---
title: "Verification Checklist: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery"
description: "Evidence gate for lifecycle correctness, state-store security, runtime evidence integrity, adapter parity, and packet reconciliation."
status: "in_progress"
completion_pct: 91
trigger_phrases:
  - "directive lifecycle remediation checklist"
  - "review findings evidence gate"
  - "scenario 457 proof checklist"
importance_tier: "high"
contextType: "implementation"
parent: "../spec.md"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
    last_updated_at: "2026-08-11T19:57:46Z"
    last_updated_by: "codex"
    recent_action: "Reconciled observed implementation, focused-suite, performance, provenance, and whole-gate evidence"
    next_safe_action: "Run fresh deep review, then complete metadata, strict validation, and final-state sweeps"
    blockers:
      - "Fresh review, final metadata, strict validation, and sign-off rows remain open"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:f9c911eb89e7e302d828626b26bca8a7d1932b31d6b6b85784334e690d153716"
      session_id: "2026-08-11-directive-lifecycle-review-planning"
      parent_session_id: null
    completion_pct: 91
    open_questions: []
    answered_questions:
      - "P3 residual risks are tracked separately from formal completion priorities"
---
# Verification Checklist: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Must be zero or fixed; cannot defer |
| **P1** | Required | Must complete or receive explicit user-approved deferral |
| **P2** | Optional | May defer with owner, reason, and reopen criterion |
| **P3 residual** | Non-gating risk register | Must have a truthful disposition; never upgrades evidence strength |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Current review confirms no active P0 finding. Evidence: `evidence/review/source-review-registry.json` records a source SHA-256 and observed counts P0=0, P1=7, P2=3.
- [x] CHK-002 [P1] All current P1/P2 findings and requested P3 residuals are mapped. Evidence: `spec.md` requirements and `tasks.md` T009-T043 cover each review class.
- [x] CHK-003 [P1] Architecture alternatives and rollback are documented. Evidence: `decision-record.md` compares explicit epoch/high-water, heuristic-only, and always-full rollback.
- [x] CHK-004 [P1] Whole-gate command manifest and pre-change evidence exist at repository-relative paths. Evidence: `evidence/whole-gate/manifest.json` and `baseline/` contain the hashed manifest, logs, inventories, totals, failures, and environment.
- [x] CHK-005 [P1] Discovery symlink baseline is captured. Evidence: `evidence/inventory/discovery-symlinks.txt`, `runtime-registrations.txt`, and registered-path source hashes cover all four runtimes.
- [x] CHK-006 [P1] Same-class producer and consumer inventories are stored. Evidence: `evidence/inventory/lifecycle-producers-consumers.txt` and `evidence-producers-consumers.txt`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] Transcript high-water, session epoch, and store-wide invalidation-generation invariants are implemented through the transactional canonical contract and covered by focused tests.
- [x] CHK-011 [P1] Unknown path/stat, unconfirmed identity, schema mismatch, IO failure, and race ambiguity deliver full directives. Evidence: `evidence/negative-controls/final.json` and focused hostile-store rows.
- [x] CHK-012 [P1] Registered lifecycle hooks advance trusted epoch/generation state through the canonical boundary. Evidence: `tests/directive-lifecycle-boundary-bridge.vitest.ts` executes the compiled bridge and the real Devin CommonJS adapter; its six registered-path rows pass, and the advisor boundary/core matrices pass.
- [x] CHK-013 [P1] OpenCode rejects object-shaped, explicit-ambiguous, missing, or conflicting session identities; plugin identity/state assertions pass.
- [x] CHK-014 [P1] TypeScript and JavaScript contract vectors agree. Evidence: shared `directive-lifecycle-vectors.json` and focused parity tests.
- [x] CHK-015 [P2] Changed TypeScript comments pass the comment-hygiene checker; no ephemeral packet identifiers were added to code comments.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] `5 KB → 10 KB → 7 KB` produces FULL → ROUTE-ONLY → FULL and stores the high-water mark before shrink.
- [x] CHK-021 [P1] `null → null`, path disappearance, stat failure, and older-generation records remain FULL without reusable suppression proof.
- [x] CHK-022 [P1] Epoch change forces full delivery across separate store instances and registered host paths.
- [x] CHK-023 [P1] OpenCode identity rows cover equal duplicates, conflicts, object ids, explicit ambiguity, global/unknown, and lifecycle resets.
- [x] CHK-024 [P1] File-store tests cover hostile topology, metadata, record validation, failure cleanup, race replacement, and unsupported always-full fallback.
- [x] CHK-025 [P1] Codex/Cursor/Devin adapter parity tests cover payload, envelope, malformed output, timeout, missing fields, discovery path, and canonical path.
- [x] CHK-026 [P1] Focused suites pass: advisor 87/87, registered adapters 23/23, persistence 9/9, Pi 55/55, negative controls 5/5.
- [x] CHK-027 [P2] Hostile-order and repeated-suite rows restore env, stores, timers, modules, and mocks.
- [x] CHK-028 [P1] The identical post-change whole-gate comparison reports zero blockers, no new failure identity, no missing lane, and no lost test file.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding is classified. Evidence: `spec.md` maps algorithmic, cross-consumer, security/path, matrix/evidence, and test-isolation work.
- [x] CHK-FIX-002 [P0] Same-class producer inventory is stored with intentionally unchanged siblings in `evidence/inventory/lifecycle-producers-consumers.txt`.
- [x] CHK-FIX-003 [P0] Consumer inventory covers runtime adapters, plugin events, report writers/readers, docs, metadata, and tests.
- [x] CHK-FIX-004 [P0] Algorithmic and path/security fixes have adversarial table tests and safe negative controls.
- [x] CHK-FIX-005 [P1] Required matrix axes are represented across focused, registered-path, negative-control, performance, and Pi suites.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variants execute from restored baseline state.
- [x] CHK-FIX-007 [P1] Durable reports pin exact SHA-256 artifacts; the stored dirty-checkout and scoped path inventories provide the explicit diff identity without claiming a commit.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Authoritative store operations use the directory-descriptor-anchored helper; hostile topology and outside-target negative controls pass, while unsupported proof stays full.
- [x] CHK-031 [P0] Unsafe owner/mode/link-count/type/size/schema records are rejected and cause full delivery.
- [x] CHK-032 [P1] Current benchmark evidence uses sanitized fixtures and verified repository-relative paths; symlink/outside-root evidence is rejected.
- [x] CHK-033 [P1] Temp cleanup and eviction operate inside the owned directory with bounded prefix/count/age work; race evidence reports no residue.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Scenario 457 names the controlled evidence classes and cannot promote adapter proof to native-host proof.
- [x] CHK-041 [P1] Cursor native delivery remains explicit SKIP/unconfirmed/dormant.
- [x] CHK-042 [P1] Current benchmark evidence is relative, hashed, versioned, command-bound, payload-classified, and provenance-clean.
- [x] CHK-043 [P1] Historical reports remain immutable and are marked superseded in the external manifest; the final Pi report is append-only and hash-verified.
- [ ] CHK-044 [P1] Phases 014-018 and the parent expose one status, completion, lineage, and fingerprint truth.
- [x] CHK-045 [P2] Phase 017 is a concise superseded historical record with no executable symlink-deletion task or stale PASS claim. Evidence: phase 017 `validate.sh --strict` passed with Errors 0 / Warnings 0 and all former mutation tasks are marked canceled.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every current evidence path resolves inside phase 018 or its append-only report folder; historical temp-only records are externally superseded and are not current PASS evidence.
- [x] CHK-051 [P1] All `.claude/.codex/.cursor/.devin` user-prompt discovery paths remain symlinks with correct targets. Evidence: `test -L` and `readlink` passed 4/4 against the expected system-spec-kit dist adapters.
- [x] CHK-052 [P1] Task-created scratch, failed-upgrade backups, temp files, and diagnostic artifacts are removed before closeout. Evidence: the failed-upgrade backup and temporary backfill report were removed after operator approval; `find` and `test ! -e` residue checks passed.
- [x] CHK-053 [P1] Phase-owned paths are explicitly attributed against `evidence/inventory/dirty-checkout.txt`; unrelated dirty paths are excluded and `git diff --cached --name-only` is empty.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | State |
|----------|-------|----------|-------|
| P0 formal requirements | 1 | 1/1 | Source registry records active P0 = 0; fresh review still required before final status |
| P1 formal requirements | 9 | 8/9 | Runtime/evidence work verified; final parent/phase metadata reconciliation remains |
| P2 formal requirements | 5 | 5/5 | Cleanup, isolation, evidence audit, phase-017 cleanup, performance/race, and structural disposition recorded |
| P3 residuals | 5 | 5/5 disposition checks | Owners and reopen criteria recorded; native-host gaps remain unpromoted |

**Verification Date**: 2026-08-11; implementation and whole-gate verification complete, fresh review and final metadata validation pending.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision is documented. Evidence: `decision-record.md` selects Option A and names rollback Option C.
- [ ] CHK-101 [P1] The decision remains Accepted after implementation review.
- [x] CHK-102 [P1] Alternatives include heuristic-only and always-full. Evidence: `decision-record.md` alternatives table.
- [x] CHK-103 [P2] Record schema migration and legacy-record fail-open behavior are evidenced by canonical/store schema mismatch rows.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P2] File-backed hook p50/p95/p99 is measured; p99 is 65.706 ms under the 100 ms budget.
- [x] CHK-111 [P2] Cleanup and eviction work is bounded by prefix, entry, age, and work caps; the final race probe leaves no residue.
- [x] CHK-112 [P2] Cross-process contention preserves all 16 high-water writes and rejects stale suppression.
- [x] CHK-113 [P2] RR-002 records the measured results, 100 ms threshold, and stale-state/residue reopen conditions.
- [x] CHK-114 [P2] `evidence/inventory/structural-impact-coverage.md` maps changed surfaces, attaches inventory deltas, records graph-tool unavailability and native-host gaps, and updates RR-005.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Kill-switch/always-full rollback is exercised across model-context adapters, OpenCode, and Pi.
- [x] CHK-121 [P1] Default-on and disabled configurations pass their declared unit/adapter/registered-path classes.
- [x] CHK-122 [P1] Operator-facing ENV and feature docs expose cadence, flags, failure behavior, and the private-state contract without persisting private paths in evidence.
- [x] CHK-123 [P1] Operator docs state rebuild/restart boundaries, distinct Pi cadence, and Cursor dormancy.
- [ ] CHK-124 [P2] Rollback and evidence-supersession steps receive fresh-context review.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Security review covers local filesystem attacker, malformed state, and evidence leakage.
- [x] CHK-131 [P2] No new external dependency was introduced; the hardened store uses the existing Node/Python standard libraries.
- [x] CHK-132 [P2] Path traversal, insecure temp use, and sensitive-data persistence checks pass.
- [x] CHK-133 [P2] Current evidence retention and redaction follow the benchmark/report contract; historical records remain immutable and superseded.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All phase 018 docs are synchronized and placeholder-free after fresh review. Evidence required: final `validate.sh --strict` exit 0.
- [ ] CHK-141 [P1] Description and graph metadata match final docs and use fresh nonzero generated hashes.
- [ ] CHK-142 [P1] Parent phase map and metadata record completed phase 018 as the active/latest child while preserving superseded phase 017.
- [x] CHK-143 [P2] `spec.md`, `implementation-summary.md`, `handover.md`, and `evidence/inventory/structural-impact-coverage.md` record unresolved residual owners and triggers.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Implementation owner | Lifecycle and store changes | Pending | Not signed |
| Independent reviewer | Security/correctness/evidence review | Pending | Not signed |
| Operator | Native-host evidence and rollout | Pending | Not signed |
<!-- /ANCHOR:sign-off -->
