---
title: "Verification Checklist: Forbid ephemeral-artifact references in code comments"
description: "Verification Date: 2026-05-27"
trigger_phrases:
  - "comment hygiene checklist"
  - "ephemeral reference verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/097-comment-ref-hygiene/001-rule-and-cleanup"
    last_updated_at: "2026-05-27T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored verification checklist"
    next_safe_action: "Author sk-code prevention rule (Part A)"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000119"
      session_id: "119-comment-ref-hygiene-init"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Forbid ephemeral-artifact references in code comments

<!-- SPECKIT_LEVEL: 3 -->
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
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Bucket-A inventory + Bucket-B/C DO-NOT-TOUCH list confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

Part A (sk-code rule) and the comments-only edit discipline live here.

- [x] CHK-010 [P0] Canonical rule present in `references/universal/code_style_guide.md` with allowed-vs-forbidden table + examples
- [x] CHK-011 [P0] P0 mirror added to `references/universal/code_quality_standards.md`
- [x] CHK-012 [P0] OpenCode §4 no longer recommends `T###`/`REQ-###`/`CHK-###` comment prefixes
- [x] CHK-013 [P1] §3 `REQ-005`/`bug #123` examples + §7 Pattern C reconciled
- [x] CHK-014 [P1] Webflow `cross_language_rules.md` §7 points to the canonical rule
- [x] CHK-015 [P1] `#1234` example in `code_style_guide.md` rewritten to durable form
- [x] CHK-016 [P0] Every per-chunk `git diff` changes only text inside comment syntax
- [x] CHK-017 [P1] Remaining comments read cleanly (no dangling "per"/"from"/"in")
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] system-spec-kit: typecheck + test:mcp/test green
- [x] CHK-021 [P0] system-code-graph: typecheck + test green
- [x] CHK-022 [P0] system-skill-advisor: typecheck + test green
- [x] CHK-023 [P0] deep-agent-improvement: `node --check` green per edited .cjs
- [x] CHK-024 [P1] Python (`py_compile`) / shell (`bash -n`) green for any edited files
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] No Bucket-B functional literal edited (`.opencode/specs/` paths/globs/SQL `LIKE`, `notes:`, schema descriptions, regexes)
- [x] CHK-FIX-002 [P0] No Bucket-C test fixture / assertion edited (anything under `tests/`/`*.vitest.ts`/fixtures)
- [x] CHK-FIX-003 [P0] Each chunk leaves the touched skill's compile + tests green; any red reverts the chunk
- [x] CHK-FIX-004 [P0] Comment-line ripgrep for ephemeral patterns returns zero across cleaned skills (Bucket A)
- [x] CHK-FIX-005 [P1] Any remaining pattern hits confirmed Bucket B/C via `git diff` (untouched)
- [x] CHK-FIX-006 [P1] CLI-CODEX reviewed each chunk's diff; flagged issues resolved
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced or exposed by edits
- [x] CHK-031 [P0] Stable security references (`CWE-###`) preserved by Rule C, not stripped
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec/plan/tasks/checklist/decision-record/implementation-summary synchronized
- [x] CHK-041 [P1] sk-code grep finds zero surviving `T###`/`REQ-###`/`CHK-###` recommendation
- [x] CHK-042 [P1] Echo sites reconciled (language style guides, config QS, checklists, quick_reference)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Per-chunk commits keep each chunk independently revertible
- [x] CHK-051 [P0] Scope lock honored — only files in spec.md "Files to Change" were modified
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-060 [P0] validate.sh --strict Exit 0
- [x] CHK-061 [P0] All P0 items above checked with evidence
- [x] CHK-062 [P1] Completion metadata reconciled (spec Status, continuity, implementation-summary)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..004)
- [x] CHK-101 [P1] All ADRs have status Accepted
- [x] CHK-102 [P1] Alternatives documented with rejection rationale (each ADR)
- [x] CHK-103 [P2] Instance-vs-structural distinction (ADR-001) reflected in the sk-code rule text
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-110 [P2] No runtime behavior change — comment-only and doc edits carry zero perf impact (NFR-P01)
- [x] CHK-111 [P2] No new dependencies or hot-path edits introduced
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-120 [P0] Rollback procedure is per-chunk `git checkout`/`git revert`; each chunk independently revertible
- [x] CHK-121 [P1] Working tree committed/stashed before cleanup so per-chunk diffs are clean
- [x] CHK-122 [P2] No feature flag needed (docs + comment edits only)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-130 [P1] Stable security references (`CWE-###`) preserved by Rule C, not stripped
- [x] CHK-131 [P2] No dependency or license changes
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [x] CHK-141 [P1] sk-code references self-consistent — no surviving `T###`/`REQ-###`/`CHK-###` recommendation
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Owner | Decision authority | Approved (plan + 6 scoping answers, incl. test-comment extension) | 2026-05-27 |
| Claude | Implementer | Complete (prod + test-file comment extension) | 2026-05-27 |
| CLI-CODEX (gpt-5.5) | Per-chunk reviewer | Reviewed (defects repaired by Claude) | 2026-05-27 |
<!-- /ANCHOR:sign-off -->
