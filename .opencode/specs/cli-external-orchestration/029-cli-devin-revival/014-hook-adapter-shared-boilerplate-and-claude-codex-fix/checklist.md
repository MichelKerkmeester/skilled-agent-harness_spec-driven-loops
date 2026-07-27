---
title: "Verification Checklist: Hook adapter shared boilerplate and Claude/Codex fix"
description: "Evidence gate for the shared stdin/parse helper, the Claude/Codex alias fix, and the migration of Q6-sampled adapters."
trigger_phrases:
  - "hook adapter shared boilerplate checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/029-cli-devin-revival/014-hook-adapter-shared-boilerplate-and-claude-codex-fix"
    last_updated_at: "2026-07-27T07:00:00Z"
    last_updated_by: "claude"
    recent_action: "Phase re-scaffolded (Planned)."
    next_safe_action: "Verify each item with command-backed evidence."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-adapter-shared-boilerplate-and-claude-codex-fix"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Hook adapter shared boilerplate and Claude/Codex fix

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

- [ ] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md` defines five acceptance-tested requirements (REQ-001 through REQ-005).]
- [ ] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md` scopes the extraction to the Q6-sampled families and the Claude/Codex alias fix.]
- [ ] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: phase 012 is complete; the Q6 synthesis is available in the parent's research artifacts.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Both shared helper files pass syntax checks. [EVIDENCE: `node --check` passes for both.]
- [ ] CHK-011 [P0] Every migrated adapter's existing test suite passes unchanged. [EVIDENCE: `node --test` reports the same pass counts as before migration.]
- [ ] CHK-012 [P1] Codex's `apply_patch` path-parsing is untouched by the alias fix. [EVIDENCE: diff review isolates the `firstNonBlankString()` change from the `apply_patch` branch.]
- [ ] CHK-013 [P1] No shared core (`spec-gate-core.mjs`, `dispatch-guard.cjs`, `mcp-route-guard.mjs`) is modified. [EVIDENCE: `git diff --stat` on the shared cores produces no output.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Claude's spec-gate suite includes a discriminating masking-regression row that fails pre-fix and passes post-fix. [EVIDENCE: test suite diff shows the new row and its pass/fail transition.]
- [ ] CHK-021 [P0] Codex's spec-gate suite includes the same discriminating masking-regression row. [EVIDENCE: test suite diff shows the new row and its pass/fail transition.]
- [ ] CHK-022 [P1] The shared helper is byte-behavior-identical to the boilerplate it replaces. [EVIDENCE: micro-test comparing old inline vs. new shared-import behavior.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] Grep finds no remaining inline `readStdin()`/`JSON.parse`-fail-open duplication in the migrated files. [EVIDENCE: grep output across all migrated adapters.]
- [ ] CHK-031 [P0] All 4 runtimes' `spec-gate-enforce.mjs` use `firstNonBlankString()` (Devin/Cursor already did; Claude/Codex newly fixed here). [EVIDENCE: grep confirms the function is present in all 4 files.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] No adapter logs or transmits raw payload contents. [EVIDENCE: code review of the shared helper and migrated adapters.]
- [ ] CHK-041 [P1] The shared helper introduces no new state persistence. [EVIDENCE: `hook-adapter-shared.mjs`/`.cjs` contain no filesystem write calls.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 014.]
- [ ] CHK-051 [P1] Comments explain durable runtime constraints without packet identifiers. [EVIDENCE: `check-comment-hygiene.sh` reports no violations.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P1] The new shared helper files live under the runtime `lib/` directory, not `scratch/` or an ad hoc path. [EVIDENCE: `hook-adapter-shared.mjs`/`.cjs` are created under `system-spec-kit/runtime/lib/`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 0/7 |
| P1 Items | 6 | 0/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: Pending (Planned)
<!-- /ANCHOR:summary -->
