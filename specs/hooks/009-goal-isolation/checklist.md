---
title: "Verification Checklist: Cross-Runtime Goal Isolation"
description: "Planning and implementation gates for proving that concurrent goal-capable sessions cannot read or mutate one another's objectives."
trigger_phrases:
  - "goal isolation checklist"
  - "two session goal verification"
  - "pi goal isolation proof"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/009-goal-isolation"
    last_updated_at: "2026-08-10T21:28:22Z"
    last_updated_by: "codex"
    recent_action: "Phase 6 implementation and content gates completed; delivery freshness remains pending"
    next_safe_action: "After authorized delivery, rerun default strict validation and restore completion metadata"
    blockers:
      - "Default strict completion freshness rejects the required uncommitted packet diff."
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:b7c1a12de079af5d3c3565d92fc585ed27bd89c15ef54f47c3eb42116a00e1a2"
      session_id: "goal-isolation-spec-20260810"
      parent_session_id: null
    completion_pct: 99
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Cross-Runtime Goal Isolation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **P0** | Hard blocker | Cannot claim implementation complete until verified. |
| **P1** | Required | Must complete or receive explicit user-approved deferral. |
| **P2** | Optional | May defer with a documented reason. |

Unchecked implementation items are expected while this packet remains `Planned`. Checked items include concrete evidence from the 2026-08-10 investigation.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements document the exact isolation boundary.
  - Evidence: `spec.md` defines one active goal per workspace/runtime/session scope and many concurrent sessions.
- [x] CHK-002 [P0] Technical approach and rollback are explicit.
  - Evidence: `plan.md` stages the test-first cutover; `decision-record.md` defines safe disable-and-revert behavior.
- [x] CHK-003 [P1] The current failure has a safe negative control.
  - Evidence: isolated CLI run produced `created`, then `replaced`; `show` returned only B and history archived active A.
- [x] CHK-004 [P1] Current consumers and session-id sources are inventoried.
  - Evidence: Pi uses `ctx.sessionManager`; Cursor/Devin payload types include `session_id`; OpenCode already requires session identity.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Goal-core public state operations require explicit validated scope. [Evidence: `.opencode/hooks/goal/lib/goal-core.test.cjs`]
- [x] CHK-011 [P0] Different sessions resolve different active and archive paths. [Evidence: `.opencode/hooks/goal/lib/goal-core.test.cjs` and live Pi canaries]
- [x] CHK-012 [P0] Same native id under different runtime namespaces cannot collide. [Evidence: namespace test in `goal-core.test.cjs`]
- [x] CHK-013 [P0] Missing identity causes no injection and no state write. [Evidence: `goal-core.test.cjs`, `goal.test.cjs`, `goal-pi.test.mjs`, and `goal-cursor.test.mjs`]
- [x] CHK-014 [P0] No production adapter or command reads `active-goal.json` implicitly. [Evidence: legacy-only adapter tests and focused stale scan]
- [x] CHK-015 [P0] Session A mutations leave session B byte-equivalent. [Evidence: `.opencode/hooks/goal/pi/goal-pi.test.mjs` turn-end test]
- [x] CHK-016 [P0] Legacy singleton state is quarantined and never auto-bound. [Evidence: `.opencode/hooks/goal/lib/goal-core.test.cjs` plus copied fixtures]
- [x] CHK-017 [P1] Atomic write and permission behavior remains intact. [Evidence: `.opencode/hooks/goal/lib/goal-core.test.cjs` and live mode 0600 checks]
- [x] CHK-018 [P1] Same-session concurrency has a tested serialization or revision contract. [Evidence: 40-process turn, terminal race, and migration race regressions pass in `.opencode/hooks/goal/lib/goal-core.test.cjs`]
- [x] CHK-019 [P1] Diagnostics distinguish current-scope and aggregate state without exposing raw ids. [Evidence: `.opencode/hooks/goal/bin/goal.test.cjs` aggregate diagnostic test]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Pi input, session-start, and turn-end handlers use `getSessionId()` for every state operation. [Evidence: Pi adapter suite]
- [x] CHK-021 [P0] Two live Pi command sessions retain distinct canaries; command-only runs create no model transcript body, and adapter tests cover injected payload separation. [Evidence: `PI_TWO_SESSION_CANARY=PASS` and `goal-pi.test.mjs`]
- [x] CHK-022 [P0] Legacy-only and missing-id Pi contexts receive no goal block. [Evidence: `.opencode/hooks/goal/pi/goal-pi.test.mjs`]
- [x] CHK-023 [P0] Full OpenCode `mk-goal` plugin suite passes as the per-session regression control. [Evidence: Phase 5 baseline 119/119; repaired Phase 6 final 128/128]
- [x] CHK-024 [P1] Cursor session-id and conversation-id cases match the supported contract. [Evidence: `.opencode/hooks/goal/cursor/goal-cursor.test.mjs`]
- [x] CHK-025 [P1] Devin tracked adapters, registration, docs, and tests agree with the decommission decision. [Evidence: `.devin/hooks.v1.json` has zero goal registrations]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The finding is classified as both `class-of-bug` and `cross-consumer`.
  - Evidence: one singleton producer feeds Pi, Cursor, the shared CLI, lifecycle mutation, rendering, and diagnostics.
- [x] CHK-FIX-002 [P0] Same-class state producers are inventoried.
  - Evidence: the inventory covers `goal-core.cjs`, `goal.cjs`, and OpenCode's separate `mk-goal.js` implementation.
- [x] CHK-FIX-003 [P0] Consumers and runtime registrations are inventoried.
  - Evidence: `spec.md` and `plan.md` enumerate Pi, Cursor, decommissioned Devin, OpenCode, commands, configs, tests, and docs.
- [x] CHK-FIX-004 [P0] Adversarial identity and path table tests pass for every retained runtime. [Evidence: `.opencode/hooks/goal/lib/goal-core.test.cjs` plus Pi/Cursor adapter tests]
- [x] CHK-FIX-005 [P1] The final implementation evidence lists every executed matrix row and result. [Evidence: Phase 5 `implementation-summary.md`]
- [x] CHK-FIX-006 [P1] Hostile environment and process-global state variants pass in isolated test processes. [Evidence: `goal-core.test.cjs` and `goal.test.cjs` isolated-process tests]
- [x] CHK-FIX-007 [P1] Implementation evidence is pinned to the final scoped diff. [Evidence: scoped `git status` and `git diff --check` receipts; no commit was requested]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] Raw session ids do not appear in state filenames or default diagnostics. [Evidence: `.opencode/hooks/goal/lib/goal-core.test.cjs` and live Pi path inspection]
- [x] CHK-031 [P0] Empty, delimiter-heavy, Unicode-control, traversal-shaped, oversized, nested-repository, and cross-workspace identity cases are tested. [Evidence: `.opencode/hooks/goal/lib/goal-core.test.cjs` scope and archive adversarial matrix]
- [x] CHK-032 [P1] Scoped files remain mode `0600`, directories remain `0700`, and prompt hardening tests stay green. [Evidence: integrated goal suite and live mode check]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P0] Architecture decision has status, alternatives, consequences, risks, and rollback.
  - Evidence: `decision-record.md` marks the composite-scope decision `Proposed` and compares five options.
- [x] CHK-041 [P1] Spec, plan, tasks, and checklist use the same scope and legacy policy. Evidence: `spec.md` REQ-001/REQ-005/REQ-006, `plan.md` Architecture, and `tasks.md` T006/T009 all require composite scope and reject passive singleton fallback.
- [x] CHK-042 [P1] Runtime contracts, commands, state README, capability matrix, playbooks, and feature catalogs match final behavior. [Evidence: 16/16 documents and 199/199 links]
- [x] CHK-043 [P2] Operator migration example is live-validated against a copied legacy record. [Evidence: valid and malformed copied-state canaries]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Final scoped status inspection contains only approved goal runtime, tests, config, documentation, and packet changes.
  - Evidence: scoped `git status --short` was limited to the named goal-isolation surfaces; unrelated dirty paths were preserved.
- [x] CHK-051 [P1] Task-created temporary directories were removed from `/tmp`.
  - Evidence: canary roots were moved to Trash for recoverability; the final `/tmp/goal-phase5.*` scan returned no matches.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## Migration and Rollout

- [x] CHK-060 [P0] Rollback disables injection before reverting code and never merges scoped records into one global record.
  - Evidence: `plan.md` and `decision-record.md` specify `MK_GOAL_PLUGIN_DISABLED=1` as the immediate safety action.
- [x] CHK-061 [P1] Migration avoids guessing legacy ownership.
  - Evidence: `plan.md` and `decision-record.md` permit only explicit binding or archival of the singleton record.
- [x] CHK-062 [P1] Partial-rollout prevention is proven across core, manager, adapters, configs, tests, and docs. [Evidence: `.opencode/hooks/goal/`, `.pi/settings.json`, registration probe, and normal-discovery canary]
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## Performance Verification

- [x] CHK-110 [P1] Scoped lookup meets the filesystem-operation budget in `spec.md`. [Evidence: `BOUNDED_SCOPED_READ=PASS` proves one direct state-path read and no scan]
- [x] CHK-111 [P2] A numeric singleton performance comparison is deferred because the accepted NFR is an operation bound, not a latency target. [DEFERRED: direct-read proof satisfies the required budget]
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## Deployment Readiness

- [ ] CHK-070 [P0] Default strict validation passes for this packet from a clean delivered state. [Evidence: default Phase 6 strict exits 0 with 0 errors/warnings; recursive parent strict exits 2 with 0 errors/1 parent `dirty_tree` warning while all six children pass]
- [x] CHK-071 [P0] The authoritative implementation gate is rerun under the sk-code global-backlog contract after the Phase 6 repair. [Evidence: wrapper exit 1 is isolated to 25,551 global findings across 807,825 files; stack folders pass 6/6, router sync passes 10/10, and packet-scoped goal alignment has zero findings]
- [x] CHK-072 [P1] `description.json`, `graph-metadata.json`, and continuity metadata reflect the repaired final packet state. [Evidence: generated-metadata integrity/drift gates pass and current completion documents contain nonzero recomputed fingerprints]
- [x] CHK-073 [P1] Final scoped diff contains no task-created residue or unrelated task changes. [Evidence: `git diff --check` passes, the temporary-artifact scan is empty, and exact scoped status contains only approved surfaces]
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## Compliance Verification

- [x] CHK-130 [P1] Session identifiers remain opaque in paths, diagnostics, logs, and prompt output. [Evidence: `.opencode/hooks/goal/lib/goal-core.test.cjs` and live state inspection]
- [x] CHK-131 [P1] The final diff introduces no unapproved dependency or persistence surface. [Evidence: `git diff -- package.json .opencode/package.json` is empty]
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## Documentation Verification

- [x] CHK-140 [P1] Planning documents describe one active goal per explicit session scope.
  - Evidence: `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `decision-record.md` use the same composite identity contract.
- [x] CHK-141 [P1] Runtime contracts, commands, state docs, matrices, and playbooks match the implemented behavior. [Evidence: 16/16 document validations and registration truth probe]
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Implementation owner | Technical verification | Passed automated and live-command acceptance | 2026-08-10 |
| Operator | Concurrent-session acceptance | Ready for normal-use observation; no separate manual sign-off claimed | 2026-08-10 |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 22 |
| P1 Items | 24 | 24 |
| P2 Items | 2 | 1 verified; 1 documented deferral |

**Verification Date**: 2026-08-10

**Current verdict**: IN PROGRESS. Phase 6 behavior, content validation, metadata, wrapper separation, and scoped-diff reconciliation are verified. Default strict delivery freshness awaits clean packet paths, so packet completion is not claimed.
<!-- /ANCHOR:summary -->
