---
title: "Verification Checklist: Measurement & Receipts Foundation"
description: "Verification items and implementation evidence for the shadow planner, canonical block IDs, delivery receipts, and parity fixtures."
trigger_phrases:
  - "measurement and receipts checklist"
  - "shadow planner verification"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/001-measurement-and-receipts-foundation"
    last_updated_at: "2026-08-07T04:16:20Z"
    last_updated_by: "codex"
    recent_action: "Recorded receipt-gated delivery and pure-peek verification for the shadow planner"
    next_safe_action: "Resolve the Pi owner mismatch and remaining P1 record items"
    blockers:
      - "The current Pi prompt-advisor owner has no PI_SUBAGENT_DISPATCH_DIRECTIVE export or equivalent text constant."
      - "The full repository Vitest gate is not clean in this environment; see implementation-summary.md."
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-001"
      parent_session_id: null
    completion_pct: 84
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Measurement & Receipts Foundation

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
  - **Evidence**: `spec.md` REQ-001 through REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` sections 3 (Architecture) and 4 (Implementation Phases)
- [ ] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `render.ts` and the Gate owner are available; inspection of `.opencode/skills/system-skill-advisor/hooks/pi/prompt-advisor.ts:16-57` found no `PI_SUBAGENT_DISPATCH_DIRECTIVE` export or equivalent owner constant. The mismatch is recorded as a deviation.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: No project lint/format script is defined in `mcp-server/package.json`; final `npm run typecheck` in `.opencode/skills/system-skill-advisor/mcp-server` exited 0, `git diff --check` exited 0, and the comment-hygiene checker exited 0 for the scoped TypeScript files.
- [x] CHK-011 [P0] No console errors or warnings
  - **Evidence**: `tests/parity/policy-plan-serializer-parity.vitest.ts:153-190`; `../../system-spec-kit/mcp-server/node_modules/.bin/vitest run tests/policy-plan.vitest.ts tests/parity/policy-plan-serializer-parity.vitest.ts` reports 2 files and 37 tests passed, exit 0; the existing renderer/producer/privacy command reports 3 files and 32 tests passed, exit 0.
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: `policy-plan.ts:245-285` validates every receipt field; `policy-plan.ts:317-332` keeps shadow observation fail-open; `tests/policy-plan.vitest.ts:79-96` rejects each missing field.
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: `policy-plan.ts:213-243` exposes pure allow-listed hash helpers; `render.ts:164-242` calls the observer additively and returns the original render values; the initial package typecheck exited 0 before ignored dependency directories became incomplete.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
  - **Evidence**: `tests/policy-plan.vitest.ts:23-113` covers IDs, hash purity, receipt fields, and configured/observed lanes; `tests/parity/policy-plan-serializer-parity.vitest.ts:153-190` covers all six serializers and 30 parity rows; both scoped suites exit 0.
- [x] CHK-021 [P0] Manual/negative-control testing complete (zero-output-diff proof)
  - **Evidence**: Proof-first `npx vitest run tests/policy-plan.vitest.ts` exited 1 before the allow-list because the received serialization contained the path and session token; the allow-listed rerun exited 0. The parity suite prints `SC-001 byte-diff: empty; rows=30` and exits 0.
- [x] CHK-022 [P1] Edge cases tested (Gate-emitting, read-only, and failure/fallback fixture cases)
  - **Evidence**: `tests/parity/fixtures/policy-plan/*.json` contains five cases for each of Claude, Codex, Devin, Cursor, OpenCode, and Pi; the parity run reports 37/37 tests passed, exit 0.
- [x] CHK-023 [P1] Error scenarios validated (adversarial raw-data-leakage control)
  - **Evidence**: `tests/policy-plan.vitest.ts:46-61` asserts a filesystem path and session token are absent from the serialized hash input; the post-allow-list unit run reports 2/2 tests passed, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: No dispatched review finding was supplied; the scoped change is classified as a `matrix/evidence` implementation with additive observer wiring in `render.ts:164-242`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: The producer inventory is explicit in `policy-plan.ts:121-167` (nine stable IDs and owner-content callbacks); absent owners are represented as `undefined` rather than copied text.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: `render.ts:7,168-242` is the only production consumer in scope; `tests/policy-plan.vitest.ts:5-20` and `tests/parity/policy-plan-serializer-parity.vitest.ts:8-15` are the test consumers; the scoped diff contains no other production call-site edits.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: N/A for this phase: the scoped change is hash allow-list and receipt validation, not a path/parser/redaction fix; the path-plus-session negative control remains at `tests/policy-plan.vitest.ts:46-61`, and the focused policy suites pass 25/25, exit 0.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: `tests/parity/policy-plan-serializer-parity.vitest.ts:21-22,153-190` defines six runtimes x five cases and prints `rows=30`.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: Not applicable: `policy-plan.ts:173-243` reads only explicit block input and owner constants; it does not read environment or mutable global state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: No commit or fix SHA was created in this worktree; evidence remains file-and-command based as requested.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: The only session-like value is the adversarial test fixture at `tests/policy-plan.vitest.ts:47-55`; the planner's allow-list is `policy-plan.ts:91-105` and excludes prompt/session fields.
- [x] CHK-031 [P0] Hash inputs never include raw prompt text, file paths, or session identifiers (REQ-002)
  - **Evidence**: `policy-plan.ts:213-227` serializes only `id`, `content`, and `order`; `tests/policy-plan.vitest.ts:46-61` verifies the path and session token are absent.
- [x] CHK-032 [P1] Shadow receipts are never merged into, or consumed by, the emitted response
  - **Evidence**: `observeRenderedAdvisorPolicy` returns `void` at `policy-plan.ts:317-332`; every `render.ts` return remains the original `rendered` value or `null` at `render.ts:168-242`; parity diff is empty across 30 rows.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: `checklist.md` and `implementation-summary.md` are updated, but `spec.md`, `plan.md`, and `tasks.md` remain unchanged by the explicit file-scope constraint; the summary records this deviation.
- [x] CHK-041 [P1] Code comments adequate (no spec-path/ADR/REQ/CHK ids embedded per comment-hygiene.md)
  - **Evidence**: `python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` exits 0 for `policy-plan.ts`, `render.ts`, and both new Vitest files.
- [ ] CHK-042 [P2] README updated (if `lib/policy-plan.ts` warrants a directory README entry)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No task-created temp files remain; the generated TypeScript build-info artifact from the baseline compiler check was removed before final status inspection.
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: No `scratch/` folder created or used in this spec-doc packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 11 | 8/11 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-08-07. All P0 items are resolved or explicitly N/A. Remaining work is the Pi owner mismatch, three P1 evidence/record rows, and the optional README review; the phase remains in progress.
<!-- /ANCHOR:summary -->
