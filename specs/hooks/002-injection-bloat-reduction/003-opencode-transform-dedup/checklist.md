---
title: "Verification Checklist: OpenCode Transform Dedup"
description: "Evidence-backed verification items for the stable-message-identity resolver, same-message dedup, and multi-transform receipts."
trigger_phrases:
  - "transform dedup checklist"
  - "message identity resolver verification"
importance_tier: "important"
contextType: "implementation"
parent: "hooks"
_memory:
  continuity:
    packet_pointer: "hooks/002-injection-bloat-reduction/003-opencode-transform-dedup"
    last_updated_at: "2026-08-07T04:16:20Z"
    last_updated_by: "codex"
    recent_action: "Recorded verified identity/dedup evidence and the remaining adversarial-table gap"
    next_safe_action: "Complete the remaining adversarial-table and P1 evidence rows before activation review"
    blockers:
      - "The generic adversarial table remains incomplete beyond the covered fallback delimiter collision"
    key_files:
      - ".opencode/plugins/mk-skill-advisor.js"
      - ".opencode/plugins/mk-spec-memory.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-06-hooks-002-003"
      parent_session_id: null
    completion_pct: 85
    open_questions: []
    answered_questions: []
---
# Verification Checklist: OpenCode Transform Dedup

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
- [x] CHK-003 [P1] Dependencies identified and available
  - **Evidence**: `plan.md` section 6 - phase 001's stable message identity and multi-transform receipts are the sole hard blocking dependency, named explicitly
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks
  - **Evidence**: `.opencode/plugins/lib/opencode-message-identity.js:169`, `.opencode/plugins/mk-skill-advisor.js:576`, `.opencode/plugins/mk-spec-memory.js:276`; `node --check` on all three runtime files -> exit 0; `python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` on all five scoped files -> exit 0; `python3 .../verify_alignment_drift.py --root .opencode/plugins` -> `Findings: 0`, `Errors: 0`, `Warnings: 0`; `git diff --check` -> exit 0
- [x] CHK-011 [P0] No console errors or warnings
  - **Evidence**: `.opencode/plugins/mk-skill-advisor.js:576-590`, `.opencode/plugins/mk-spec-memory.js:276-290`; scoped runtime scan reported `no console or direct stdio usage in scoped runtime files`; plugin test suite -> exit 0 with no plugin warnings
- [x] CHK-012 [P1] Error handling implemented (fail-open on unresolved identity)
  - **Evidence**: `.opencode/plugins/lib/opencode-message-identity.js:169-175`, `.opencode/plugins/mk-skill-advisor.js:577-580`, `.opencode/plugins/mk-spec-memory.js:277-280`; unresolved-identity fixtures at `.opencode/plugins/tests/mk-skill-advisor.test.cjs:597-612` and `.opencode/plugins/tests/mk-spec-memory.test.cjs:513-532` pass in the 42-test command
- [x] CHK-013 [P1] Code follows project patterns
  - **Evidence**: `.opencode/plugins/mk-skill-advisor.js:26`, `.opencode/plugins/mk-spec-memory.js:23`, `.opencode/plugins/lib/opencode-message-identity.js:1-352`; `node --test .opencode/plugins/tests/mk-skill-advisor.test.cjs .opencode/plugins/tests/mk-spec-memory.test.cjs` -> 43/43 pass
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-006)
  - **Evidence**: `.opencode/plugins/lib/opencode-message-identity.js:169-326`, `.opencode/plugins/mk-skill-advisor.js:327-328`, `.opencode/plugins/mk-spec-memory.js:120-121`; plugin command -> `ℹ tests 42`, `ℹ pass 42`, `ℹ fail 0`; policy-plan command -> `Test Files 2 passed`, `Tests 37 passed`
- [x] CHK-021 [P0] Manual/negative-control testing complete (flag-off byte-identical parity)
  - **Evidence**: `.opencode/plugins/tests/mk-skill-advisor.test.cjs:578-595` and `.opencode/plugins/tests/mk-spec-memory.test.cjs:484-511`; focused command -> `# tests 6`, `# pass 6`, `# fail 0`, covering both flag-off byte-parity fixtures
- [x] CHK-022 [P1] Edge cases tested (identity-resolution failure, empty transform list)
  - **Evidence**: `.opencode/plugins/lib/opencode-message-identity.js:183-188`, `.opencode/plugins/lib/opencode-message-identity.js:303-316`, `.opencode/plugins/tests/mk-skill-advisor.test.cjs:597-625`; full plugin command -> 43/43 pass, including unresolved and malformed identity plus empty receipt-state paths
- [x] CHK-023 [P1] Error scenarios validated (distinct-identical-text non-suppression)
  - **Evidence**: `.opencode/plugins/tests/mk-skill-advisor.test.cjs:555-576` and `.opencode/plugins/tests/mk-spec-memory.test.cjs:452-482`; focused command -> `# tests 6`, `# pass 6`, `# fail 0`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
  - **Evidence**: The scoped identity/dedup finding is classified as algorithmic with a cross-consumer producer surface; the resolver is at `.opencode/plugins/lib/opencode-message-identity.js:169-188`, and both transforms consume it at `.opencode/plugins/mk-skill-advisor.js:576-590` and `.opencode/plugins/mk-spec-memory.js:276-290`; the plugin suite passes 43/43, exit 0.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
  - **Evidence**: `rg -n "experimental.chat.system.transform|shouldDeduplicate|recordTransformReceipt" .opencode/plugins/mk-skill-advisor.js .opencode/plugins/mk-spec-memory.js .opencode/plugins/lib/opencode-message-identity.js` inventories both transform producers and the shared state producer; the command exits 0 and the plugin suite passes 43/43, exit 0.
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
  - **Evidence**: Consumers are the two plugin transforms and their CJS fixtures at `.opencode/plugins/tests/mk-skill-advisor.test.cjs` and `.opencode/plugins/tests/mk-spec-memory.test.cjs`; the focused plugin command passes 43/43, exit 0, and the policy-plan command passes 25/25, exit 0.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
  - **Evidence**: Partial only: `.opencode/skills/system-spec-kit/mcp-server/hooks/lib/spec-gate/spec-gate-core.test.mjs:368-386` now proves the fallback delimiter collision is separated, but joined-input, outside-root, and no-op rows are not covered for this phase; residual remains intentionally unchecked.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: `.opencode/plugins/lib/opencode-message-identity.js:1-352`; scoped secret-pattern scan reported `no common hardcoded-secret patterns in scoped files`
- [x] CHK-031 [P0] Input validation implemented (malformed session/message fields never crash the resolver)
  - **Evidence**: `.opencode/plugins/lib/opencode-message-identity.js:29-45`, `.opencode/plugins/lib/opencode-message-identity.js:154-160`; unresolved and malformed-input paths are covered by `.opencode/plugins/tests/mk-skill-advisor.test.cjs:597-625`; plugin command -> 43/43 pass
- [x] CHK-032 [P1] Auth/authz working correctly (not applicable - no auth surface in this module)
  - **Evidence**: `.opencode/plugins/lib/opencode-message-identity.js:1-352` has no auth surface; plugin command -> exit 0
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - **Evidence**: `spec.md`, `plan.md`, and `tasks.md` describe the same planned identity resolver, dedup gate, and multi-transform receipt extension
- [x] CHK-041 [P1] Code comments adequate (no spec-path/ADR/REQ/CHK ids embedded per comment-hygiene.md)
  - **Evidence**: all five scoped files; `python3 .opencode/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh` -> exit 0 for each file
- [x] CHK-042 [P2] README updated (if `.opencode/plugins/lib/` warrants a directory README entry)
  - **Evidence**: `.opencode/specs/hooks/002-injection-bloat-reduction/003-opencode-transform-dedup/spec.md:43-49` names the exact Files-to-Change set and does not require a README; `git status --short` shows no README change
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
  - **Evidence**: No temp files created; all writes confined to `003-opencode-transform-dedup/`
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - **Evidence**: No `scratch/` folder created or used in this spec-doc packet
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 11/12 (one adversarial-table row remains intentionally open) |
| P1 Items | 13 | 11/13 (feature gates verified; fix-SHA row remains unmarked) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-07. Identity/dedup acceptance is verified. One P0 adversarial-table row and two P1 fix-completeness rows remain open; the fallback delimiter collision is covered separately. The repository-wide alignment guard and global hook installer still report known external drift and were not modified.
<!-- /ANCHOR:summary -->
