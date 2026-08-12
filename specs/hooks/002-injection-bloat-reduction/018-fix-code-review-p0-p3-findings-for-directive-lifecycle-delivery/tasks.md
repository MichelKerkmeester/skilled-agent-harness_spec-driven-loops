---
title: "Tasks: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery"
description: "Ordered remediation tasks for lifecycle correctness, store security, cross-runtime adapter parity, durable evidence, and phase-truth reconciliation."
status: "complete"
completion_pct: 100
trigger_phrases:
  - "directive lifecycle remediation tasks"
  - "review findings implementation tasks"
  - "scenario 457 evidence repair"
  - "file lifecycle store hardening"
importance_tier: "high"
contextType: "implementation"
parent: "../spec.md"
predecessor: "017-adapter-live-delivery-verification"
successor: "None"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery"
    last_updated_at: "2026-08-12T06:27:39Z"
    last_updated_by: "codex"
    recent_action: "Closed implementation, focused proof, Pi repeat suppression, and whole-gate comparison tasks"
    next_safe_action: "Await operator push and native-host rollout decision"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle.ts"
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md"
      - "specs/hooks/002-injection-bloat-reduction/018-fix-code-review-p0-p3-findings-for-directive-lifecycle-delivery/checklist.md"
    session_dedup:
      fingerprint: "sha256:3d28c206e6d4c45fabfc694e513d7a796a75e745ab7fac95d4359e4edffd1358"
      session_id: "2026-08-11-directive-lifecycle-review-planning"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No P0 finding exists; P0 remains an escalation gate"
      - "P3 is tracked as a non-gating residual-risk register"
---
# Tasks: Fix Code-Review P0-P3 Findings for Directive-Lifecycle Delivery

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed with evidence |
| `[P]` | Parallelizable after its dependencies pass |
| `[B]` | Blocked; stop and report |

**Formal priority**: P0 blocks, P1 requires completion or user-approved deferral, P2 may defer with owner and reason. User-requested P3 items are residual risks `RR-*`, not formal completion priorities.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Confirm the active review contains zero P0 findings. Evidence: `evidence/review/source-review-registry.json` hashes the source review and records P0=0, P1=7, P2=3.
- [x] T002 [P1] Create the frozen whole-gate manifest. Evidence: `evidence/whole-gate/manifest.json` and captured manifests record commands, cwd, environment, timeouts, inventories, and output rules.
- [x] T003 [P1] Execute and hash the pre-change manifest. Evidence: `evidence/whole-gate/baseline/` contains complete results, logs, inventories, environment, and manifest hash.
- [x] T004 [P1] Capture discovery-link and registration targets. Evidence: `evidence/inventory/discovery-symlinks.txt`, `runtime-registrations.txt`, and registered-path summaries.
- [x] T005 [P1] Inventory every lifecycle state producer and consumer. Evidence: `evidence/inventory/lifecycle-producers-consumers.txt`.
- [x] T006 [P1] Inventory scenario-457 and benchmark-evidence producers/consumers. Evidence: `evidence/inventory/evidence-producers-consumers.txt`.
- [x] T007 [P1] Record dirty-checkout attribution. Evidence: `evidence/inventory/dirty-checkout.txt`; no file is staged by this task.
- [x] T008 [P1] Mark phase 017 superseded by this phase and remove every executable symlink-deletion instruction while preserving its historical diagnosis. Evidence: phase 017 strict validation passed with Errors 0 / Warnings 0; discovery symlink checks passed 4/4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lifecycle correctness and identity

- [x] T009 [P1] Version the lifecycle record with transcript high-water bytes and a trusted lifecycle epoch. — Evidence: `evidence/outcomes/directive-unit-verified.json`
- [x] T010 [P1] Update high-water state atomically on known growth even when the emitted result is route-only. — Evidence: `evidence/negative-controls/final.json`
- [x] T011 [P1] Make missing/unknown transcript path or stat ineligible for suppression; `null → null` stays full.
- [x] T012 [P1] Add one canonical epoch/reset entry point and connect actual Claude/Codex/Cursor/Devin session-start/resume/compact sources; identified events advance the session epoch and unidentified events increment a store-wide invalidation generation. — Evidence: `evidence/outcomes/directive-unit-verified.json`
- [x] T013 [P1] Ensure test-only prompt lifecycle fields cannot be the sole production boundary proof. — Evidence: `evidence/runtime/2026-08-11-registered-paths-final-2/summary.json`
- [x] T014 [P1] Make OpenCode identity resolution collect all candidates and fail open for missing, object-shaped, explicit-ambiguous, or conflicting values. — Evidence: `evidence/outcomes/opencode-test-seam.json`
- [x] T015 (P3 residual) Add shared contract vectors for the TypeScript core and OpenCode JavaScript mirror; compiled-core unification remains RR-001. — Evidence: `.opencode/skills/system-skill-advisor/hooks/lib/directive-lifecycle-vectors.json`

### File-store security and cleanup

- [x] T016 [P1] Establish a verified user-private state root and prove race-safe containment for every authoritative record IO. — Evidence: `evidence/performance/result-final-5.json`
- [x] T017 [P1] Reject symlinked path components, records, temp targets, and intermediate-component replacement races; validate regular-file type, owner/mode/link-count where supported, and record size/schema. — Evidence: `evidence/negative-controls/final.json`
- [x] T018 [P1] Use a directory-descriptor-anchored helper with no-follow/exclusive operations; unsupported or unprovable execution disables durable suppression. — Evidence: `evidence/outcomes/directive-unit-verified.json`
- [x] T019 [P2] Remove owned `.tmp-*` files after failed write/rename and bound temp/eviction cleanup by prefix, count, age, and directory.
- [x] T020 [P2] Run cross-process high-water/race and residue probes. Evidence: `evidence/performance/result-final-5.json` records 16/16 successful writes, final high-water 1600, and no residue.
- [x] T021 [P2] Measure p50/p95/p99 latency. Evidence: file-store p99 65.706 ms under the declared 100 ms budget; RR-002 retains reopen thresholds.

### Evidence, adapters, and repository truth

- [x] T022 [P1] Add Codex/Cursor/Devin adapter parity coverage for payloads, envelopes, missing fields, malformed child output, timeout, discovery path, and canonical real path. — Evidence: `evidence/tests/registered-adapters-verified.log`
- [x] T023 [P1] Preserve all four runtime discovery symlinks and add integrity tests that fail on replacement, deletion, or wrong target. — Evidence: `evidence/inventory/discovery-symlinks.txt`
- [x] T024 [P1] Rewrite scenario 457 around `unit`, `adapter-driven`, `registered-path`, and `native-host-delivered` evidence classes.
- [x] T025 [P1] Keep Cursor native `beforeSubmitPrompt` unconfirmed/dormant; adapter success does not promote it.
- [x] T026 [P1] Require repository-relative evidence, hashes, runtime/version, exact command, sanitized payload fixture, evidence class, executor, and valid model provenance. — Evidence: `evidence/runtime/2026-08-11-registered-paths-final/source-hashes.json`
- [x] T027 [P1] Reject PASS when required evidence is absent, temporary-only, unhashed, outside the verified root, or stronger than the captured class. — Evidence: `evidence/outcomes/cursor-native-host-final.json`
- [x] T028 [P1] Preserve historical report directories byte-for-byte; append corrected reports and an external supersession manifest. — Evidence: `evidence/outcomes/pi-repeat-suppression-verified.json`
- [x] T029 [P2] Restore lifecycle env variables, default stores, plugin instances, timers, module caches, and mocks in teardown, including failure paths.
- [x] T030 [P1] Reconcile status, completion, tasks, checklists, summaries, description metadata, graph children, active child, and source fingerprints across phases 014-018 and the parent. Evidence: `spec.md`, `implementation-summary.md`, `checklist.md`, and `handover.md` reconciled to Complete; parent phase map records 018 Complete + 017 Superseded + last_active_child_id=018; 018 fingerprints refreshed (parent packet metadata carries pre-existing debt tracked separately).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T031 [P1] Prove `5 KB → 10 KB → 7 KB` produces FULL → ROUTE-ONLY with high-water update → FULL.
- [x] T032 [P1] Prove repeated unknown stat/path and every unconfirmed identity stay full and never create reusable suppression proof. — Evidence: `evidence/negative-controls/final.json`
- [x] T033 [P1] Run the complete file-store hostile-topology matrix and verify no outside-root content changes. — Evidence: `evidence/negative-controls/final.json`
- [x] T034 [P1] Run OpenCode identity and lifecycle-event matrices, including conflict and object-id rows. — Evidence: `evidence/outcomes/opencode-test-seam.json`
- [x] T035 [P1] Run focused canonical/shim/plugin/Pi suites plus adapter parity tests. Evidence: advisor 87/87, registered adapters 23/23, persistence 9/9, Pi 55/55, negative controls 5/5.
- [x] T036 [P2] Run hostile-order and repeated-suite isolation checks and compare process state before/after.
- [x] T037 [P1] Execute corrected scenario 457 per evidence class and persist durable hashed artifacts for every supported lane. — Evidence: `evidence/outcomes/directive-unit-verified.json`
- [x] T038 (P3 residual) Record available adapter/registered-path evidence and preserve honest native-host unconfirmed/SKIP outcomes, including Cursor dormancy. — Evidence: `evidence/outcomes/cursor-native-host-final.json`
- [x] T039 [P1] Execute the unchanged whole-gate manifest. Evidence: `comparison-final-pi-repeat-4-normalized.json` reports the same manifest hash, zero blockers, no new failure identity, and no lost test file.
- [x] T040 [P1] Run strict validation on phase 018 and recursive validation on the parent; reconcile every task/checklist/continuity field before any completion claim. Evidence: `validate.sh <018> --strict` exit 0 RESULT PASSED (0 errors, 0 warnings); the parent recursive run surfaced only pre-existing sibling debt outside 018 scope; all 018 continuity fields reconciled.
- [x] T041 [P1] Run comment-hygiene, diff, no-staged-files, no-task-residue, and discovery-symlink sweeps from final state. Evidence: comment-hygiene scan of the 13 changed code files returned zero ephemeral labels; `git diff --cached` empty (0 staged); packet scratch holds only `.gitkeep`; `.claude`/`.codex`/`.cursor`/`.devin` user-prompt discovery symlinks intact.
- [x] T042 [P1] Obtain fresh-context security/correctness/evidence review and disposition every finding. Evidence: converged deep review (`review/review-report.md`) plus supplementary `evidence/review/security-review-flash.md` (PASS-WITH-NOTES) and decision/rollback reviews via deepseek-v4-flash, conductor-verified; every finding dispositioned with no confirmed P0 or unresolved P1.
- [x] T043 [P2] Inventory structural-impact coverage. Evidence: `evidence/inventory/structural-impact-coverage.md` maps each changed surface, records unavailable graph tooling and uncovered native boundaries, captures inventory deltas, and assigns RR-005 to the release gate owner with reopen triggers.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All P0/P1 tasks are `[x]` with durable evidence; no implicit P1 deferral exists.
- [x] Every P2 deferral, including race/latency/structural characterization, has an owner, reason, expiry/reopen criterion, and user approval where project policy requires it.
- [x] Every `RR-*` P3 residual has a current disposition and cannot be mistaken for a native-runtime PASS.
- [x] Negative controls flip from the recorded failing symptom to PASS.
- [x] The whole-gate delta has zero new failure identity.
- [x] Parent and phases 014-018 expose one truthful current state.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: `spec.md`
- **Implementation plan**: `plan.md`
- **Decision**: `decision-record.md`
- **Verification contract**: `checklist.md`
- **Current delivery state**: `implementation-summary.md`
- **Superseded plan**: `../017-adapter-live-delivery-verification/spec.md`
- **Scenario**: `.opencode/skills/system-spec-kit/manual-testing-playbook/ux-hooks/directive-lifecycle-dedup.md`
<!-- /ANCHOR:cross-refs -->
