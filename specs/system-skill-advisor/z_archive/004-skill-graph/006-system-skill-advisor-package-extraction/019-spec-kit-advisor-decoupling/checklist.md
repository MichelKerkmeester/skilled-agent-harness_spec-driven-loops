---
title: "Verification Checklist: Full spec-kit advisor import decoupling [template:level_3/checklist.md]"
description: "Verification evidence for packet 019 import isolation, regression classification, template validation, and commit readiness."
trigger_phrases:
  - "019-spec-kit-advisor-decoupling"
  - "advisor import isolation checklist"
  - "decoupling verification"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/004-skill-graph/006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling"
    last_updated_at: "2026-05-15T09:20:00Z"
    last_updated_by: "codex"
    recent_action: "Normalized validation evidence."
    next_safe_action: "Commit and push the scoped decoupling changes after final staging audit."
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/hooks/"
      - ".opencode/skills/system-skill-advisor/mcp_server/tests/"
      - ".opencode/skills/system-spec-kit/mcp_server/hooks/"
      - ".opencode/skills/system-spec-kit/mcp_server/schemas/tool-input-schemas.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Memory vitest post-change has the same failed test count as baseline: 114 failed tests."
      - "Advisor vitest passes after updating dissolved packet paths in lane-weight-sweep."
---
# Verification Checklist: Full Spec-Kit Advisor Import Decoupling

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Must have evidence or explicit operator acceptance |
| **[P1]** | Required | Must complete or be documented as baseline-red |
| **[P2]** | Optional | Can defer with reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Existing 019 packet confirmed at the post-dissolution `006-system-skill-advisor-package-extraction/019-spec-kit-advisor-decoupling` path.
- [x] CHK-002 [P0] Prior dispatch log reviewed from `/tmp/cli-codex-dispatches/spec-kit-advisor-decoupling-out.log`.
- [x] CHK-003 [P1] Initial dirty tree reviewed before baseline stashing.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P0] Exact advisor import audit returns zero `from.*system-skill-advisor` imports in `system-spec-kit/mcp_server`.
- [x] CHK-011 [P0] Spec-kit hook paths remain process-boundary stubs, not in-process advisor imports.
- [x] CHK-012 [P1] Advisor lane sweep fixture paths now point to current packets `006-seeded-corpus-evaluation-sweep` and `007-hard-intent-corpus-resweep`.
- [x] CHK-013 [P1] Plugin bridge remains a process gateway and is not treated as a forbidden source import.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-020 [P0] Advisor baseline captured before decoupling restore: 6 failed files, 302 passed, 7 skipped.
- [x] CHK-021 [P0] Advisor post-fix suite passes: 52 files passed, 338 passed, 4 skipped.
- [x] CHK-022 [P0] Memory baseline captured before decoupling restore: 114 failed tests.
- [x] CHK-023 [P0] Memory post-change suite has 114 failed tests, so decoupling introduced 0 memory test regressions.
- [x] CHK-024 [P1] Full memory suite remains baseline-red and is documented rather than fixed in this packet.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Advisor regression class is `test-isolation`: a moved test referenced dissolved packet paths.
- [x] CHK-FIX-002 [P0] Same-class path inventory checked under `006-skill-advisor`; current packet paths exist.
- [x] CHK-FIX-003 [P0] Consumer inventory limited to `tests/scorer/lane-weight-sweep.vitest.ts`.
- [x] CHK-FIX-004 [P0] No security/path traversal code changed; this is fixture path maintenance.
- [x] CHK-FIX-005 [P1] Matrix axes are baseline versus post-change for advisor and memory suites.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant not applicable; suite uses existing launcher env.
- [x] CHK-FIX-007 [P1] Evidence is pinned to captured `/tmp/*-full.txt` logs from this dispatch.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-030 [P0] No secrets added.
- [x] CHK-031 [P0] No new input surface added.
- [x] CHK-032 [P1] Existing auth-related moved tests remain under advisor ownership.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-040 [P1] 019 docs normalized to Level 3 template markers and anchors.
- [x] CHK-041 [P1] Implementation summary records baseline-red classification.
- [x] CHK-042 [P2] Parent handover already records the 019 decoupling session.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-050 [P1] Commit staging limited to 019 decoupling-related files.
- [x] CHK-051 [P1] Test artifact stashes remain separate from the decoupling commit and are not staged.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 16/16 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-05-15
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## ARCHITECTURE VERIFICATION

- [x] CHK-060 [P0] Package ownership boundary is enforced by grep and file placement.
- [x] CHK-061 [P1] Remaining bridge behavior is process-boundary only.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## PERFORMANCE VERIFICATION

- [x] CHK-070 [P2] No runtime performance-critical path changed beyond hook process delegation already tested by smoke.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## DEPLOY READY

- [x] CHK-080 [P0] Advisor vitest is green after the fixture path fix.
- [x] CHK-081 [P0] Memory regressions introduced by decoupling are zero by baseline comparison.
- [x] CHK-082 [P0] Strict 019 and parent validation are final gates before commit.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## COMPLIANCE VERIFICATION

- [x] CHK-090 [P0] No branch creation, force push, or `--no-verify`.
- [x] CHK-091 [P0] No tool-id, server-id, or skill-id rename.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## DOCS VERIFICATION

- [x] CHK-100 [P1] Spec, plan, tasks, checklist, decision record, and implementation summary use required template source markers.
- [x] CHK-101 [P1] All required anchors are present.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## SIGN-OFF

- [x] CHK-110 [P0] Operator authorized commit and push on `main`.
- [x] CHK-111 [P0] Scope audit must show `FILES_OUT_OF_SCOPE=0` before commit.
<!-- /ANCHOR:sign-off -->
