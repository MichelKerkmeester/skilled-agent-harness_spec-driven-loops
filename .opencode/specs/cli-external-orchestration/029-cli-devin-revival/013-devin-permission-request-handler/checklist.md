---
title: "Verification Checklist: Devin PermissionRequest handler"
description: "Evidence gate for the real PermissionRequest adapter, its shared-core composition, its registration, and its live verification."
trigger_phrases:
  - "devin permission request handler checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/013-devin-permission-request-handler"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Verify each item with command-backed evidence."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "devin-permission-request-handler"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Devin PermissionRequest handler

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md` defines six acceptance-tested requirements (REQ-001 through REQ-006).]
- [ ] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md` scopes the adapter to compose `isExemptTargetPath` and `dispatch-rule-checks`.]
- [ ] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: phases 008 and 012 are complete.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] The adapter passes syntax checks. [EVIDENCE: `node --check` passes.]
- [ ] CHK-011 [P0] The shared spec-gate core and `dispatch-rule-checks` suites pass unchanged after this phase. [EVIDENCE: both suites report their existing pass counts.]
- [ ] CHK-012 [P1] Every unrecognized `tool_name`/shape denies, never allows. [EVIDENCE: `permission-request-policy.test.mjs` unclassifiable-deny row.]
- [ ] CHK-013 [P1] No shared core (`spec-gate-core.mjs`, `dispatch-rule-checks.mjs`) is modified. [EVIDENCE: `git diff --stat` on both cores produces no output.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Write-class allow and deny rows both pass. [EVIDENCE: `permission-request-policy.test.mjs` write-allow/write-deny rows.]
- [ ] CHK-021 [P0] Exec-class allow and deny rows both pass. [EVIDENCE: `permission-request-policy.test.mjs` exec-allow/exec-deny rows.]
- [ ] CHK-022 [P0] Malformed input and missing identity both deny (fail-closed, not fail-open). [EVIDENCE: `permission-request-policy.test.mjs` malformed-input/missing-identity rows.]
- [ ] CHK-023 [P1] A live `devin -p` probe confirms the adapter resolves a real approval-needing call. [EVIDENCE: probe transcript in `implementation-summary.md`.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] `.devin/hooks.v1.json`'s `PermissionRequest` array is no longer `[]`. [EVIDENCE: registration diff shows the new adapter under the nested `{matcher, hooks:[...]}` shape.]
- [ ] CHK-031 [P0] The test suite is discriminating, not merely green. [EVIDENCE: at least one row fails against a naive always-allow stub, documented in `implementation-summary.md`.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No raw payload contents (file contents, command strings) are logged or transmitted. [EVIDENCE: adapter code review + test assertions on emitted fields only.]
- [ ] CHK-041 [P1] Classification is a pure decision function with no persistent state writes. [EVIDENCE: adapter code contains no filesystem write calls outside the shared cores it composes.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 013.]
- [ ] CHK-051 [P1] Comments explain durable runtime constraints without packet identifiers. [EVIDENCE: `check-comment-hygiene.sh` reports no violations.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] Temporary files remain under `scratch/` or approved system temp paths. [EVIDENCE: the live-probe backup/restore of `.devin/hooks.v1.json` uses a scratch-scoped or system temp path, never overwriting the live file without a restore step.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 0/8 |
| P1 Items | 7 | 0/7 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending (Planned)
<!-- /ANCHOR:summary -->
