---
title: "Verification Checklist: Full-First + Route-Only Repeats"
description: "Verification evidence for the shadow-only delivery-state machine, epoch resolver, byte-parity proof, and seven behavioral negative controls."
trigger_phrases:
  - "full first route only repeats checklist"
  - "delivery state machine verification"
importance_tier: "critical"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/004-full-first-route-only-repeats"
    last_updated_at: "2026-08-07T04:39:14Z"
    last_updated_by: "opus"
    recent_action: "Verified receipt-gated shadow reduction proof"
    next_safe_action: "Keep route-only delivery disabled pending activation review"
    blockers:
      - "Full repository alignment guard reports pre-existing baseline drift; scoped alignment passes"
      - "Global Codex hook installer check reports hook-file drift outside this worktree"
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-004"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Full-First + Route-Only Repeats

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` REQ-001 through REQ-007
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` sections 3 (Architecture) and 4 (Implementation Phases)
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `plan.md` section 6 - phases 001, 002, and 003 are all named hard blocking dependencies
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: `policy-plan.ts:409`, `render.ts:292`; `npm run typecheck` exit 0, `node --check .opencode/plugins/mk-skill-advisor.js` exit 0, and `git diff --check` exit 0
- [x] CHK-011 [P0] No console errors or warnings
  - **Evidence**: plugin dedup command — tests 43 passed, 0 failed, exit 0; focused policy command — tests 25 passed, 0 failed, exit 0
- [x] CHK-012 [P1] Error handling implemented (unresolved session identity always defaults to full delivery)
  - **Evidence**: `policy-plan.ts:294`, `policy-plan.ts:409`, `policy-plan.ts:457`; focused policy command — 25 passed, 0 failed, exit 0
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: scoped `verify_alignment_drift.py` over the changed code roots — 130 files scanned, 0 findings, 0 errors, 0 warnings, exit 0; the full guard's unrelated baseline drift is recorded below
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-007)
  - **Evidence**: `policy-plan.ts:409`, `render.ts:214`, `user-prompt-submit.ts:150`, `mk-skill-advisor.js:640`; focused policy command — 25 passed, 0 failed, exit 0; emitted responses remain unchanged in the negative-control fixture matrix
- [x] CHK-021 [P0] Manual/negative-control testing complete (all seven behavioral negative controls green)
  - **Evidence**: `policy-plan-negative-controls.vitest.ts:40`, `policy-plan-negative-controls.vitest.ts:113`; focused policy command — 7 named controls plus parity assertions, 25 total tests passed, exit 0
- [x] CHK-022 [P1] Edge cases tested (dirty-marking, epoch advance, unknown-session isolation)
  - **Evidence**: `policy-plan.vitest.ts:140`, `policy-plan.vitest.ts:163`, `policy-plan.vitest.ts:187`; focused policy command — 25 passed, 0 failed, exit 0
- [x] CHK-023 [P1] Error scenarios validated (long-context, advisor failure, no-match, comment-writing, completion-proof, resume, compaction)
  - **Evidence**: `policy-plan-negative-controls.vitest.ts:42`, `:65`, `:73`, `:77`, `:83`, `:89`, `:94`; focused policy command — 25 passed, 0 failed, exit 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: `policy-plan.ts:409` is the single algorithmic state-machine implementation; no unresolved actionable finding remains in the scoped diff; `git diff --check` exit 0
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: producer inventory covers `render.ts:265`, `user-prompt-submit.ts:248`, `mk-skill-advisor.js:640`, and `skill-advisor-brief.ts:180`; `rg` producer inventory command exit 0
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: consumer inventory covers `render.ts:292`, `user-prompt-submit.ts:273`, `mk-skill-advisor.js:955`, `skill-advisor-brief.ts:180`, and all relevant test suites; `rg` consumer inventory command exit 0
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: Not applicable to this phase's non-security state machine; malformed, unresolved, and ambiguous identity handling is exercised at `policy-plan.vitest.ts:187`; focused policy command — 25 passed, exit 0
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: six epoch signals at `policy-plan.vitest.ts:163`, seven negative controls at `policy-plan-negative-controls.vitest.ts:40`, and 30 serializer parity rows (`SC-001 byte-diff: empty; rows=30`); all associated suites passed
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: OpenCode runtime shadow observer at `mk-skill-advisor.js:640` is fail-open and non-consuming; plugin suite — 43 passed, 0 failed, exit 0
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: baseline SHA `7ebc12cd92a49cfce007d79f93e7ec30ea4e1efd`; final `git status --short` contains only the six requested code/test files plus the two explicitly requested record documents
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: scoped diff review of the six implementation/test files; no credential material added; comment-hygiene checks exit 0 for all six files
- [x] CHK-031 [P0] Input validation implemented (malformed lifecycle/session signals never crash the state machine)
  - **Evidence**: `policy-plan.ts:294`, `policy-plan.ts:326`, `policy-plan.vitest.ts:187`; focused policy command — 25 passed, 0 failed, exit 0
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable - no auth surface in this module)
  - **Evidence**: No auth/authz surface is introduced; the changed boundary is the local shadow state machine at `policy-plan.ts:409`; focused Vitest exit 0
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` describe the same planned delivery-state machine, epoch resolver, and negative-control suite
- [x] CHK-041 [P1] Code comments adequate (no spec-path/ADR/REQ/CHK ids embedded per comment-hygiene.md)
  - **Evidence**: `check-comment-hygiene.sh` run with `python3` against each of the six changed code/test files — all six exit 0 with no findings
- [x] CHK-042 [P2] README updated (if applicable)
  - **Evidence**: Not applicable; this phase changes internal rendering/state behavior and adds no user-facing README contract
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No temp files created; all writes confined to `004-full-first-route-only-repeats/`
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: No `scratch/` folder created or used in this spec-doc packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-07. Scoped implementation checks pass. The full `run-all-drift-guards.sh` command remains red on the pre-existing repository-wide alignment backlog (472 findings: 268 errors, 204 warnings); its stack-folder and router-sync subguards pass.
<!-- /ANCHOR:summary -->
