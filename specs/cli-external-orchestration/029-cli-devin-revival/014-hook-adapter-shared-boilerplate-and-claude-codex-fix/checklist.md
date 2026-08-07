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
    last_updated_at: "2026-07-27T10:45:00Z"
    last_updated_by: "claude"
    recent_action: "Implemented (GPT-5.6-LUNA); all checks verified."
    next_safe_action: "None; phase complete."
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "hook-adapter-shared.mjs", "hook-adapter-shared.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-adapter-shared-boilerplate-and-claude-codex-fix"
      parent_session_id: null
    completion_pct: 100
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

- [x] CHK-001 [P0] Requirements documented. [EVIDENCE: `spec.md` defines five acceptance-tested requirements (REQ-001 through REQ-005).]
- [x] CHK-002 [P0] Technical approach defined. [EVIDENCE: `plan.md` scopes the extraction to the Q6-sampled families and the Claude/Codex alias fix.]
- [x] CHK-003 [P1] Dependencies identified and available. [EVIDENCE: phase 012 is complete; the `firstNonBlankString()` pattern was copied directly from the already-fixed Devin adapter.]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both shared helper files pass syntax checks. [EVIDENCE: `node --check` passes for `hook-adapter-shared.mjs` and `.cjs`.]
- [x] CHK-011 [P0] Every migrated adapter's existing test suite passes unchanged. [EVIDENCE: spec-gate core 67/67, devin spec-gate 15/15, cursor prebind 16/16, devin permission-request-policy 2/2 -- all unchanged from pre-migration.]
- [x] CHK-012 [P1] Codex's `apply_patch` path-parsing is untouched by the alias fix. [EVIDENCE: `git diff` on `codex/spec-gate-enforce.mjs` shows `pathsFromPatch()` with zero line changes; only `filePathFrom()`'s alias chain and the stdin/parse boilerplate changed.]
- [x] CHK-013 [P1] No shared core (`spec-gate-core.mjs`, `dispatch-guard.cjs`, `mcp-route-guard.mjs`) is modified. [EVIDENCE: `git diff --stat` on all three shared cores produces no output.]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Claude's spec-gate suite includes a discriminating masking-regression row. [EVIDENCE: new `spec-gate-claude.test.mjs` (13/13) includes "a truthy non-string in an earlier field does not mask a valid later alias".]
- [x] CHK-021 [P0] Codex's spec-gate suite includes the same discriminating masking-regression row. [EVIDENCE: new `spec-gate-codex.test.mjs` (14/14) includes the equivalent row plus a dedicated "Codex apply_patch still resolves a patch header for enforcement" row.]
- [x] CHK-022 [P1] The shared helper is byte-behavior-identical to the boilerplate it replaces. [EVIDENCE: `node --test` on `spec-gate-core.test.mjs` 67/67, `spec-gate-devin.test.mjs` 15/15, `spec-gate-prebind.test.mjs` 16/16, all unchanged post-migration.]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Grep finds no remaining inline `readStdin()`/`JSON.parse`-fail-open duplication in the migrated files. [EVIDENCE: `grep -l "for await (const chunk of process.stdin)"` across all 9 migrated adapters returns no matches.]
- [x] CHK-031 [P0] All 4 runtimes' `spec-gate-enforce.mjs` use `firstNonBlankString()` (Devin/Cursor already did; Claude/Codex newly fixed here). [EVIDENCE: `grep -l "function firstNonBlankString"` matches all 4 files.]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No adapter logs or transmits raw payload contents. [EVIDENCE: `git diff` review of `hook-adapter-shared.mjs`/`.cjs` and all 9 migrated adapters shows only stdin-read/parse boilerplate changed, 9/9 with no new logging or transmission calls.]
- [x] CHK-041 [P1] The shared helper introduces no new state persistence. [EVIDENCE: `hook-adapter-shared.mjs`/`.cjs` contain no filesystem write calls -- both files only read `process.stdin` and parse JSON.]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] Spec, plan, tasks, checklist, and summary are synchronized. [EVIDENCE: `validate.sh --strict` reports 0 errors, 0 warnings for phase 014.]
- [x] CHK-051 [P1] Comments explain durable runtime constraints without packet identifiers. [EVIDENCE: `check-comment-hygiene.sh` reports 0 violations across all 13 created/modified JavaScript files.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P1] The new shared helper files live under the runtime `lib/` directory, not `scratch/` or an ad hoc path. [EVIDENCE: `hook-adapter-shared.mjs`/`.cjs` are created under `.opencode/skills/system-spec-kit/runtime/lib/`.]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-27 (Complete)
<!-- /ANCHOR:summary -->
