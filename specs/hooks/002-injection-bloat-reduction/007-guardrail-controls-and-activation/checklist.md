---
title: "Verification Checklist: Guardrail Controls and Activation Gate"
description: "Verification Date: 2026-08-07; all required controls and scope gates passed"
trigger_phrases:
  - "guardrail activation gate checklist"
  - "behavioral negative control verification"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation"
    last_updated_at: "2026-08-07T04:31:31Z"
    last_updated_by: "codex"
    recent_action: "Verified terminal controls and TMPDIR-independent fixture isolation"
    next_safe_action: "Collect candidate-owned behavioral and delivery evidence without changing flag defaults"
    blockers: []
    key_files:
      - ".opencode/skills/system-skill-advisor/mcp-server/lib/render.ts"
    session_dedup:
      fingerprint: "sha256:924f210819640f7159f2da9fbd3ef5951d6b2e850f1cead3f3076effbb7a9378"
      session_id: "2026-08-06-hooks-002-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Guardrail Controls and Activation Gate

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

- [x] CHK-001 [P0] Requirements documented in spec.md — Evidence: `spec.md:101-116`; `GIT_DIR=/private/tmp/guardrail-no-git-dir SPECKIT_COMPLETION_FRESHNESS=false bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase> --strict --no-recursive` exit 0.
- [x] CHK-002 [P0] Technical approach defined in plan.md — Evidence: `plan.md:73-108`; `GIT_DIR=/private/tmp/guardrail-no-git-dir SPECKIT_COMPLETION_FRESHNESS=false bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <phase> --strict --no-recursive` exit 0.
- [x] CHK-003 [P1] Dependencies identified and available — Evidence: `plan.md:125-131`; `node --test guardrail-negative-controls.test.mjs activation-matrix.test.mjs` exit 0.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — Evidence: `guardrail-negative-controls.test.mjs:1-294`, `activation-matrix.test.mjs:1-145`; `node --check` on both files exit 0.
- [x] CHK-011 [P0] No console errors or warnings — Evidence: `guardrail-negative-controls.test.mjs:266-336`, `activation-matrix.test.mjs:112`; combined `node --test` exit 0 with no test failures.
- [x] CHK-012 [P1] Error handling implemented — Evidence: `guardrail-negative-controls.test.mjs:54-60,245-317`; real guard failures are asserted and temporary fixtures are removed in `finally`; combined `node --test` exit 0.
- [x] CHK-013 [P1] Code follows project patterns — Evidence: `activation-matrix.test.mjs:61-145`; `node --test` and `node --check` exit 0.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met — Evidence: `spec.md:103-127`; combined `node --test` reports 6 tests, 6 pass, 0 fail, exit 0; isolated dirty-tree-free phase validator exit 0.
- [x] CHK-021 [P0] Manual testing complete — Evidence: `rollback-procedure.md:26-38`; manual worked-cell walkthrough recorded; `node --test` exit 0.
- [x] CHK-022 [P1] Edge cases tested — Evidence: `activation-matrix.test.mjs:88-110` tests fail/unknown/ambiguous evidence; `guardrail-negative-controls.test.mjs:245-267` tests forbidden and clean fixtures; combined `node --test` exit 0.
- [x] CHK-023 [P1] Error scenarios validated — Evidence: `guardrail-negative-controls.test.mjs:277-291` asserts real validator exit 2 and diagnostic; `node --test` exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — Evidence: `risk-register.md:5-13` classifies each control boundary; `git diff --name-only -- .opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation` is phase-scoped.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — Evidence: `activation-matrix.json:22-47` inventories all applicability producers; `node --test activation-matrix.test.mjs` exit 0.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — Evidence: `activation-matrix.schema.json:96-140` defines cell consumers and `activation-matrix.test.mjs:115-145` consumes them; phase validator exit 0.
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — Evidence: N/A for this phase: no production security/path/parser/redaction fix; `guardrail-negative-controls.test.mjs:55-82` pins fixtures to an isolated root outside `.opencode/specs` even when `TMPDIR` points into the packet, and `:207-272` covers the real controls; combined `node --test` exit 0.
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — Evidence: `activation-matrix.json:6-14,49-80` lists 6 runtimes, 5 candidates, and 30 cells; `activation-matrix.test.mjs:61-75` asserts the same; exit 0.
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — Evidence: `guardrail-negative-controls.test.mjs:66-80` sets `TMPDIR` to the repository packet and proves the fixture remains isolated; `node --test guardrail-negative-controls.test.mjs` exits 0 in both normal and hostile-TMPDIR runs.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — Evidence: the final scope command is the explicit phase path `git diff --name-only -- .opencode/specs/hooks/002-injection-bloat-reduction/007-guardrail-controls-and-activation`; no commit or push is claimed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — Evidence: `git diff --name-only` is limited to the phase folder; no secret-bearing runtime file changed.
- [x] CHK-031 [P0] Input validation implemented — Evidence: `activation-matrix.test.mjs:46-59,61-75` validates runtime/candidate/cell shape; exit 0.
- [x] CHK-032 [P1] Auth/authz working correctly — Evidence: N/A: this phase creates offline test/data/docs only; `spec.md:84-93` limits Files to Change and scope diff remains phase-local.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — Evidence: `spec.md:84-93`, `plan.md:62-65`, `tasks.md:75-90`, and this checklist; isolated phase validator exit 0.
- [x] CHK-041 [P1] Code comments adequate — Evidence: `guardrail-negative-controls.test.mjs:245-267` keeps the forbidden comment in a temp fixture string only; direct comment-hygiene guard on both new `.mjs` files exits 0.
- [x] CHK-042 [P2] README updated (if applicable) — Evidence: N/A: README is outside `spec.md:84-93` Files to Change; `git diff --name-only` confirms no README change.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — Evidence: `guardrail-negative-controls.test.mjs:54-60` uses `os.tmpdir()` and never writes fixtures under `.opencode/specs/`; `find <phase> -maxdepth 1 -type d` shows only the phase directory.
- [x] CHK-051 [P1] scratch/ cleaned before completion — Evidence: `guardrail-negative-controls.test.mjs:57-60` removes each temp tree in `finally`; post-test phase inventory contains no fixture directories.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-07 — all 20 checklist items verified with file/line and command evidence
<!-- /ANCHOR:summary -->
