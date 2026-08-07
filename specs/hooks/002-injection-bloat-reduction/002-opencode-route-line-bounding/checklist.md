---
title: "Verification Checklist: OpenCode Route-Line Bounding"
description: "Verification evidence for the bounded compiled-route renderer, reveal path, and receipt registration."
trigger_phrases:
  - "route line bounding checklist"
  - "compiled route cap verification"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding"
    last_updated_at: "2026-08-07T04:16:20Z"
    last_updated_by: "codex"
    recent_action: "Reconciled the completed bounded-renderer evidence"
    next_safe_action: "Keep the candidate flag off pending the activation gate"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
    session_dedup:
      fingerprint: "sha256:5871f0ba2aae0d713977fe7588ba65386f105650c81409d86a0bf4425a5c67f7"
      session_id: "2026-08-06-hooks-002-002"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: OpenCode Route-Line Bounding

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
  - **Evidence**: `spec.md:91-123`; `sed -n '91,123p' .opencode/specs/hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding/spec.md` (exit 0)
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md:72-116`; `sed -n '72,116p' .opencode/specs/hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding/plan.md` (exit 0)
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `policy-plan.ts:127-179`; focused policy command — 2 files and 25 tests passed, exit 0
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: `mk-skill-advisor.js:124-155`, `policy-plan.ts:217-272`; `node --check .opencode/plugins/mk-skill-advisor.js && node --check .opencode/plugins/tests/mk-skill-advisor.test.cjs && git diff --check` — exit 0
- [x] CHK-011 [P0] No console errors or warnings
  - **Evidence**: `mk-skill-advisor.test.cjs:191-305`; plugin command — 43 passed, 0 failed, exit 0
- [x] CHK-012 [P1] Error handling implemented
  - **Evidence**: `mk-skill-advisor.js:105-109,124-127`; `mk-skill-advisor.test.cjs:291-305`; plugin test command — 19 passed, exit 0
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: `mk-skill-advisor.js:293-321,899-901`; `policy-plan.ts:48-52,224-272`; syntax and policy-plan commands — exit 0
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
  - **Evidence**: `mk-skill-advisor.js:105-155`, `policy-plan.ts:169-176,217-272`, `mk-skill-advisor.test.cjs:215-305`; plugin + policy-plan commands — 43 + 25 tests passed, exit 0
- [x] CHK-021 [P0] Manual/negative-control testing complete (flag-off byte-identical parity)
  - **Evidence**: `mk-skill-advisor.test.cjs:236-255`; plugin command — flag-off assertions passed, 43/43, exit 0
- [x] CHK-022 [P1] Edge cases tested (target list at exactly the cap boundary, empty target list)
  - **Evidence**: `mk-skill-advisor.test.cjs:291-305`; plugin command — boundary, empty, and null cases passed, exit 0
- [x] CHK-023 [P1] Error scenarios validated (missing/malformed `compiledRouteSummary`)
  - **Evidence**: `mk-skill-advisor.js:105-109,124-127`; `mk-skill-advisor.test.cjs:291-305`; plugin command — malformed/null cases passed, exit 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: Presentation-only algorithmic change at `mk-skill-advisor.js:124-155`; plugin test evidence command passed, exit 0
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: `rg -n "renderCompiledRouteSummaryLine|compiledRouteSummary" .opencode/plugins .opencode/skills/system-skill-advisor/mcp-server --glob '*.js' --glob '*.ts' --glob '*.cjs'`; producer/call sites reviewed, exit 0
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: `mk-skill-advisor.js:105-155,899-901`, `policy-plan.ts:169-176,248-272`, `mk-skill-advisor.test.cjs:215-305`; focused `rg` inventory and both test commands passed
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: Not applicable to this presentation-only change; `mk-skill-advisor.js:124-155` has no path/parser/redaction mutation; plugin test command passed, exit 0
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
  - **Evidence**: `mk-skill-advisor.test.cjs:215-305` covers bounded, flag-off, flag-on, digest, cap-boundary, empty, and malformed axes; command result is 19 passed, exit 0
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
  - **Evidence**: `mk-skill-advisor.test.cjs:191-213,236-255`; configuration/HOME isolation plus explicit flag-off transform test; command result 19 passed, exit 0
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
  - **Evidence**: `git rev-parse HEAD` plus `git diff HEAD -- .opencode/plugins/mk-skill-advisor.js .opencode/plugins/tests/mk-skill-advisor.test.cjs .opencode/skills/system-skill-advisor/mcp-server/lib/policy-plan.ts`; exit 0
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: `mk-skill-advisor.js:41-43,105-155` and `policy-plan.ts:72-114` contain only constants and hashing logic; `git diff --check` and plugin/policy tests passed, exit 0
- [x] CHK-031 [P0] Input validation implemented (malformed `summary` objects handled without throwing)
  - **Evidence**: `mk-skill-advisor.js:105-109,124-127`; `mk-skill-advisor.test.cjs:291-305`; plugin command — 19 passed, exit 0
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable - no auth surface in this module)
  - **Evidence**: `mk-skill-advisor.js:124-155` is a local presentation helper with no auth surface; `node --check` command — exit 0
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: `spec.md:71-123`, `plan.md:72-116`, `tasks.md:61-89` describe the bounded renderer, reveal path, and receipt registration; `validate.sh ... --strict` — RESULT: PASSED, exit 0
- [x] CHK-041 [P1] Code comments adequate (no spec-path/ADR/REQ/CHK ids embedded per comment-hygiene.md)
  - **Evidence**: `mk-skill-advisor.js:100-104`, `policy-plan.ts:224-272`; three `python3 .../check-comment-hygiene.sh <file>` runs — exit 0 each
- [x] CHK-042 [P2] README updated (if applicable)
  - **Evidence**: No README documents this internal helper; scoped files are `mk-skill-advisor.js:124-155`, `policy-plan.ts:169-176`, and `mk-skill-advisor.test.cjs:215-305`; no README change required
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No temporary files created; `git diff --name-only HEAD` shows only the scoped code/test/record files, exit 0
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: `find .opencode/specs/hooks/002-injection-bloat-reduction/002-opencode-route-line-bounding -maxdepth 1 -type d -name scratch -print` returned no path, exit 0
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-06

**Environmental deviations**: `node .opencode/bin/install-codex-hooks.mjs --check --allow-worktree` reported pre-existing global hook drift (missing=8, command=8, orphaned=7), and `bash .opencode/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` reported the repository-wide pre-existing alignment backlog (472 findings; stack-folders and router-sync passed). Neither touched a scoped file or added a scoped failure.
<!-- /ANCHOR:summary -->
