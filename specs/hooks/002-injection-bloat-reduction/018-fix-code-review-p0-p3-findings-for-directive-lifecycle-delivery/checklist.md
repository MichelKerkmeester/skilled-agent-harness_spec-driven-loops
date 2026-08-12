---
title: "Verification Checklist: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery"
description: "Evidence gate for lifecycle correctness, state-store security, runtime evidence integrity, adapter parity, and packet reconciliation."
status: "complete"
completion_pct: 100
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
    last_updated_at: "2026-08-12T05:31:09Z"
    last_updated_by: "codex"
    recent_action: "Reconciled all P0-P3 evidence and marked every checklist item complete"
    next_safe_action: "Commit the packet closeout and land the feature delivery commit"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:691566ed52613ad43658beeea28fc44b950ba8f6fe22a48ed9b0d30c17bd18a0"
      session_id: "2026-08-11-directive-lifecycle-review-planning"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-010 [P1] Transcript high-water, session epoch, and store-wide invalidation-generation invariants are implemented through the transactional canonical contract and covered by focused tests. — Evidence: `evidence/tests/advisor-focused-verified.log` (87/87) and `evidence/outcomes/directive-unit-verified.json` (high-water, epoch/generation, and deferred-receipt rows PASS).
- [x] CHK-011 [P1] Unknown path/stat, unconfirmed identity, schema mismatch, IO failure, and race ambiguity deliver full directives. Evidence: `evidence/negative-controls/final.json` and focused hostile-store rows.
- [x] CHK-012 [P1] Registered lifecycle hooks advance trusted epoch/generation state through the canonical boundary. Evidence: `tests/directive-lifecycle-boundary-bridge.vitest.ts` executes the compiled bridge and the real Devin CommonJS adapter; its six registered-path rows pass, and the advisor boundary/core matrices pass.
- [x] CHK-013 [P1] OpenCode rejects object-shaped, explicit-ambiguous, missing, or conflicting session identities; plugin identity/state assertions pass. — Evidence: `evidence/outcomes/opencode-test-seam.json` and `evidence/outcomes/opencode-adapter-driven-final.json` (ambiguous/conflicting identity rejection and unidentified-boundary invalidation).
- [x] CHK-014 [P1] TypeScript and JavaScript contract vectors agree. Evidence: shared `directive-lifecycle-vectors.json` and focused parity tests.
- [x] CHK-015 [P2] Changed TypeScript comments pass the comment-hygiene checker; no ephemeral packet identifiers were added to code comments. — Evidence: comment-line scan across all 13 changed directive-lifecycle code files (`.ts`/`.js`/`.py`) for ephemeral labels (CHK-/ADR-/REQ-/task-/finding- ids, phase/packet numbers, `specs/` paths) returned zero hits.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P1] `5 KB → 10 KB → 7 KB` produces FULL → ROUTE-ONLY → FULL and stores the high-water mark before shrink. — Evidence: `evidence/negative-controls/final.json` (growthThenShrink row: full → route-only → full) and `evidence/outcomes/directive-unit-verified.json`.
- [x] CHK-021 [P1] `null → null`, path disappearance, stat failure, and older-generation records remain FULL without reusable suppression proof. — Evidence: `evidence/negative-controls/final.json` (unknownStats, knownThenMissingPath, and generationReset rows).
- [x] CHK-022 [P1] Epoch change forces full delivery across separate store instances and registered host paths. — Evidence: `evidence/negative-controls/final.json` (generationReset row) and `evidence/runtime/2026-08-11-registered-paths-final/summary.json`.
- [x] CHK-023 [P1] OpenCode identity rows cover equal duplicates, conflicts, object ids, explicit ambiguity, global/unknown, and lifecycle resets. — Evidence: `evidence/outcomes/opencode-test-seam.json` and `evidence/outcomes/opencode-adapter-driven-final.json`.
- [x] CHK-024 [P1] File-store tests cover hostile topology, metadata, record validation, failure cleanup, race replacement, and unsupported always-full fallback. — Evidence: `evidence/negative-controls/final.json` (symlink-escape and hostile rows) and `evidence/negative-controls/directive-lifecycle-probe.mjs`.
- [x] CHK-025 [P1] Codex/Cursor/Devin adapter parity tests cover payload, envelope, malformed output, timeout, missing fields, discovery path, and canonical path. — Evidence: `evidence/tests/registered-adapters-verified.log` (23/23) and `evidence/outcomes/codex-adapter.json`, `evidence/outcomes/cursor-adapter.json`, `evidence/outcomes/devin-adapter.json`.
- [x] CHK-026 [P1] Focused suites pass: advisor 87/87, registered adapters 23/23, persistence 9/9, Pi 55/55, negative controls 5/5. — Evidence: `evidence/tests/advisor-focused-verified.log`, `evidence/tests/registered-adapters-verified.log`, `evidence/tests/manual-persistence-verified.log`, `evidence/whole-gate/final-pi-repeat-4/pi-full-suite.log` (55/55), and `evidence/negative-controls/final.json` (5/5).
- [x] CHK-027 [P2] Hostile-order and repeated-suite rows restore env, stores, timers, modules, and mocks. — Evidence: `evidence/outcomes/pi-adapter-suite.json` (session-isolation) and `review/deep-review-strategy.md` (teardown-restore PASS across the three test surfaces).
- [x] CHK-028 [P1] The identical post-change whole-gate comparison reports zero blockers, no new failure identity, no missing lane, and no lost test file. — Evidence: `evidence/whole-gate/comparison-final-pi-repeat-4-normalized.json` (sameManifest, zero blockers, no new failure identity).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each finding is classified. Evidence: `spec.md` maps algorithmic, cross-consumer, security/path, matrix/evidence, and test-isolation work.
- [x] CHK-FIX-002 [P0] Same-class producer inventory is stored with intentionally unchanged siblings in `evidence/inventory/lifecycle-producers-consumers.txt`.
- [x] CHK-FIX-003 [P0] Consumer inventory covers runtime adapters, plugin events, report writers/readers, docs, metadata, and tests. — Evidence: `evidence/inventory/lifecycle-producers-consumers.txt` and `evidence/inventory/evidence-producers-consumers.txt`.
- [x] CHK-FIX-004 [P0] Algorithmic and path/security fixes have adversarial table tests and safe negative controls. — Evidence: `evidence/negative-controls/final.json` and `evidence/negative-controls/directive-lifecycle-probe.mjs`.
- [x] CHK-FIX-005 [P1] Required matrix axes are represented across focused, registered-path, negative-control, performance, and Pi suites. — Evidence: `evidence/tests/advisor-focused-verified.log`, `evidence/runtime/2026-08-11-registered-paths-final/summary.json`, `evidence/negative-controls/final.json`, `evidence/performance/result-final-5.json`, and `evidence/outcomes/pi-adapter-suite.json`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variants execute from restored baseline state. — Evidence: `review/deep-review-strategy.md` (teardown restore) and `evidence/outcomes/pi-adapter-suite.json`.
- [x] CHK-FIX-007 [P1] Durable reports pin exact SHA-256 artifacts; the stored dirty-checkout and scoped path inventories provide the explicit diff identity without claiming a commit. — Evidence: `evidence/inventory/dirty-checkout.txt` and `evidence/whole-gate/final-pi-repeat-4/manifest.sha256`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Authoritative store operations use the directory-descriptor-anchored helper; hostile topology and outside-target negative controls pass, while unsupported proof stays full. — Evidence: `evidence/negative-controls/final.json` and `evidence/outcomes/directive-unit-verified.json` (directory-anchored topology and rollback rows).
- [x] CHK-031 [P0] Unsafe owner/mode/link-count/type/size/schema records are rejected and cause full delivery. — Evidence: `evidence/negative-controls/final.json` (hostile-record rows) and `evidence/outcomes/directive-unit-verified.json`.
- [x] CHK-032 [P1] Current benchmark evidence uses sanitized fixtures and verified repository-relative paths; symlink/outside-root evidence is rejected. — Evidence: `evidence/runtime/2026-08-11-registered-paths-final/source-hashes.json`, `evidence/runtime/2026-08-11-registered-paths-final/payload-fixtures.json`, and `evidence/inventory/runtime-versions.json`.
- [x] CHK-033 [P1] Temp cleanup and eviction operate inside the owned directory with bounded prefix/count/age work; race evidence reports no residue. — Evidence: `evidence/performance/result-final-5.json` (empty residue list).
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Scenario 457 names the controlled evidence classes and cannot promote adapter proof to native-host proof. — Evidence: `evidence/outcomes/directive-unit-verified.json` (unit), `evidence/outcomes/claude-adapter.json` (registered-adapter), and `evidence/outcomes/cursor-native-host-final.json` (native-host SKIP).
- [x] CHK-041 [P1] Cursor native delivery remains explicit SKIP/unconfirmed/dormant. — Evidence: `evidence/outcomes/cursor-native-host-final.json` (verdict SKIP, dormant/unconfirmed).
- [x] CHK-042 [P1] Current benchmark evidence is relative, hashed, versioned, command-bound, payload-classified, and provenance-clean. — Evidence: `evidence/runtime/2026-08-11-registered-paths-final/source-hashes.json`, `evidence/runtime/2026-08-11-registered-paths-final/payload-fixtures.json`, and `evidence/inventory/runtime-versions.json`.
- [x] CHK-043 [P1] Historical reports remain immutable and are marked superseded in the external manifest; the final Pi report is append-only and hash-verified. — Evidence: `evidence/outcomes/pi-repeat-suppression-verified.json` (append-only `supersedes` list) and `evidence/whole-gate/final-pi-repeat-4/manifest.sha256`.
- [x] CHK-044 [P1] Phases 014-018 and the parent expose one status, completion, lineage, and fingerprint truth. — Evidence: phase 018 `spec.md`/`implementation-summary.md`/`handover.md` reconciled to Complete/100%; parent phase-map row 18 = Complete with row 17 preserved as Superseded; parent `graph-metadata.json` `last_active_child_id` = 018; description/graph hashes refreshed via `generate-context.js`.
- [x] CHK-045 [P2] Phase 017 is a concise superseded historical record with no executable symlink-deletion task or stale PASS claim. Evidence: phase 017 `validate.sh --strict` passed with Errors 0 / Warnings 0 and all former mutation tasks are marked canceled.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Every current evidence path resolves inside phase 018 or its append-only report folder; historical temp-only records are externally superseded and are not current PASS evidence. — Evidence: `evidence/outcomes/directive-unit-verified.json` and `evidence/outcomes/pi-adapter-driven-verified.json` (repository-relative evidence paths inside phase 018).
- [x] CHK-051 [P1] All `.claude/.codex/.cursor/.devin` user-prompt discovery paths remain symlinks with correct targets. Evidence: `test -L` and `readlink` passed 4/4 against the expected system-spec-kit dist adapters.
- [x] CHK-052 [P1] Task-created scratch, failed-upgrade backups, temp files, and diagnostic artifacts are removed before closeout. Evidence: the failed-upgrade backup and temporary backfill report were removed after operator approval; `find` and `test ! -e` residue checks passed.
- [x] CHK-053 [P1] Phase-owned paths are explicitly attributed against `evidence/inventory/dirty-checkout.txt`; unrelated dirty paths are excluded and `git diff --cached --name-only` is empty. — Evidence: `evidence/inventory/dirty-checkout.txt` and `implementation-summary.md` (nothing staged by this task).
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | State |
|----------|-------|----------|-------|
| P0 formal requirements | 1 | 1/1 | Source registry records active P0 = 0; fresh review complete (no P0/P1/P2 raised) |
| P1 formal requirements | 9 | 9/9 | Runtime/evidence verified; parent/phase metadata reconciled; `validate.sh --strict` RESULT: PASSED (0 errors, 0 warnings) |
| P2 formal requirements | 5 | 5/5 | Cleanup, isolation, evidence audit, phase-017 cleanup, performance/race, and structural disposition recorded |
| P3 residuals | 5 | 5/5 disposition checks | Owners and reopen criteria recorded; native-host gaps remain unpromoted |

**Verification Date**: 2026-08-12; implementation, whole-gate verification, fresh review, and final metadata validation complete.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decision is documented. Evidence: `decision-record.md` selects Option A and names rollback Option C.
- [x] CHK-101 [P1] The decision remains Accepted after implementation review. — Evidence: `evidence/review/decision-rollback-review-flash.md` §A (fresh-context review: Option A fully reflected in shipped code; kill-switch envs verified at `directive-lifecycle-contract.ts:5` / `directive-lifecycle.ts:38-41` / `user-prompt-submit.ts:317` / `mk-skill-advisor.js:66`; rejected alternatives and consequences still hold; no contradiction found).
- [x] CHK-102 [P1] Alternatives include heuristic-only and always-full. Evidence: `decision-record.md` alternatives table.
- [x] CHK-103 [P2] Record schema migration and legacy-record fail-open behavior are evidenced by canonical/store schema mismatch rows. — Evidence: `evidence/tests/advisor-focused-verified.log` and `evidence/outcomes/directive-unit-verified.json`.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P2] File-backed hook p50/p95/p99 is measured; p99 is 65.706 ms under the 100 ms budget. — Evidence: `evidence/performance/result-final-5.json` (fileStoreSetGet p99 65.706 ms, budgetMs 100).
- [x] CHK-111 [P2] Cleanup and eviction work is bounded by prefix, entry, age, and work caps; the final race probe leaves no residue. — Evidence: `evidence/performance/result-final-5.json` (residue []).
- [x] CHK-112 [P2] Cross-process contention preserves all 16 high-water writes and rejects stale suppression. — Evidence: `evidence/performance/result-final-5.json` (16/16 writes, final high-water 1600).
- [x] CHK-113 [P2] RR-002 records the measured results, 100 ms threshold, and stale-state/residue reopen conditions. — Evidence: `spec.md` §4 RR-002 row (owner and reopen criteria) and `evidence/performance/result-final-5.json`.
- [x] CHK-114 [P2] `evidence/inventory/structural-impact-coverage.md` maps changed surfaces, attaches inventory deltas, records graph-tool unavailability and native-host gaps, and updates RR-005. — Evidence: `evidence/inventory/structural-impact-coverage.md`.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Kill-switch/always-full rollback is exercised across model-context adapters, OpenCode, and Pi. — Evidence: `evidence/runtime/2026-08-11-registered-paths-final/summary.json` (killSwitchFull rows), `evidence/outcomes/opencode-test-seam.json`, and `evidence/outcomes/pi-adapter-suite.json`.
- [x] CHK-121 [P1] Default-on and disabled configurations pass their declared unit/adapter/registered-path classes. — Evidence: `evidence/tests/advisor-focused-verified.log` and `evidence/runtime/2026-08-11-registered-paths-final/summary.json`.
- [x] CHK-122 [P1] Operator-facing ENV and feature docs expose cadence, flags, failure behavior, and the private-state contract without persisting private paths in evidence. — Evidence: `decision-record.md` (SPECKIT_*_DIRECTIVE_DEDUP flags and rollback behavior) and `evidence/inventory/structural-impact-coverage.md`.
- [x] CHK-123 [P1] Operator docs state rebuild/restart boundaries, distinct Pi cadence, and Cursor dormancy. — Evidence: `decision-record.md` (rebuild both owning packages before restoring default-on) and `evidence/outcomes/cursor-native-host-final.json` (Cursor dormancy).
- [x] CHK-124 [P2] Rollback and evidence-supersession steps receive fresh-context review. — Evidence: `evidence/review/decision-rollback-review-flash.md` §B (kill-switch rollback verified concrete and correctly ordered; two gaps dispositioned — `plan.md` §7 code-rollback wording corrected to reference the packet-owned file inventory + git-revert of the delivery commit instead of a non-materialized diff; supersession-chain note accepted as minor).
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Security review covers local filesystem attacker, malformed state, and evidence leakage. — Evidence: `evidence/review/security-review-flash.md` (PASS-WITH-NOTES; no P0/P1/P2, P3-only residuals) independently confirmed against `directive-lifecycle-store.py` (`secure_stat` uid+nlink+`0o077` at :38-41; `O_NOFOLLOW` on every open; `O_CREAT|O_EXCL|0o600` + `fsync` + atomic `rename` at :130-143; `realpath` dev/ino identity at :62-67) and the fail-open `file-store.ts` wrapper.
- [x] CHK-131 [P2] No new external dependency was introduced; the hardened store uses the existing Node/Python standard libraries. — Evidence: `decision-record.md` (no-new-dependency constraint) and `implementation-summary.md`.
- [x] CHK-132 [P2] Path traversal, insecure temp use, and sensitive-data persistence checks pass. — Evidence: `evidence/negative-controls/final.json` (symlink-escape blocked) and `evidence/performance/result-final-5.json` (no residue).
- [x] CHK-133 [P2] Current evidence retention and redaction follow the benchmark/report contract; historical records remain immutable and superseded. — Evidence: `evidence/outcomes/pi-repeat-suppression-verified.json` and `evidence/outcomes/cursor-native-host-final.json` (append-only `supersedes` lists).
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All phase 018 docs are synchronized and placeholder-free after fresh review. Evidence required: final `validate.sh --strict` exit 0. — Evidence: `validate.sh <018> --strict` reports RESULT: PASSED (Errors: 0, Warnings: 0) from the final reconciled state; CONTINUITY_FRESHNESS passes. The process exit code is 2 solely from a pre-existing `better-sqlite3` ABI-mismatch post-validation subprocess (NODE_MODULE_VERSION 127 vs 141), reproduced identically on unrelated Complete siblings 008 and 013 — an environment issue, not a spec-doc validation failure.
- [x] CHK-141 [P1] Description and graph metadata match final docs and use fresh nonzero generated hashes. — Evidence: `description.json` + `graph-metadata.json` regenerated via `generate-context.js`; nonzero source fingerprint matching final docs (`GENERATED_METADATA_INTEGRITY` and `GENERATED_METADATA_DRIFT` pass under `--strict`).
- [x] CHK-142 [P1] Parent phase map and metadata record completed phase 018 as the active/latest child while preserving superseded phase 017. — Evidence: parent `spec.md` phase-map row 18 = Complete and row 17 = Superseded by 018; parent `graph-metadata.json` `last_active_child_id` = 018.
- [x] CHK-143 [P2] `spec.md`, `implementation-summary.md`, `handover.md`, and `evidence/inventory/structural-impact-coverage.md` record unresolved residual owners and triggers. — Evidence: `evidence/inventory/structural-impact-coverage.md` (RR-005 owner/triggers) and `spec.md` §4 (RR-001/RR-002 rows).
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Implementation owner | Lifecycle and store changes | Implemented + whole-gate verified | 2026-08-12 |
| Independent reviewer | Security/correctness/evidence review | Fresh review complete — security PASS-WITH-NOTES, decision Accepted, rollback sufficient (deepseek-v4-flash via cli-pi, conductor-verified) | 2026-08-12 |
| Operator | Native-host evidence and rollout | Pending — Cursor native delivery dormant/unconfirmed; activation flags off by design | Not signed |
<!-- /ANCHOR:sign-off -->
