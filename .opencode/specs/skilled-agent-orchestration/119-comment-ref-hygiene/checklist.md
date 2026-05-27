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
    packet_pointer: "skilled-agent-orchestration/119-comment-ref-hygiene"
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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Bucket-A inventory + Bucket-B/C DO-NOT-TOUCH list confirmed
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

Part A (sk-code rule) and the comments-only edit discipline live here.

- [ ] CHK-010 [P0] Canonical rule present in `references/universal/code_style_guide.md` with allowed-vs-forbidden table + examples
- [ ] CHK-011 [P0] P0 mirror added to `references/universal/code_quality_standards.md`
- [ ] CHK-012 [P0] OpenCode §4 no longer recommends `T###`/`REQ-###`/`CHK-###` comment prefixes
- [ ] CHK-013 [P1] §3 `REQ-005`/`bug #123` examples + §7 Pattern C reconciled
- [ ] CHK-014 [P1] Webflow `cross_language_rules.md` §7 points to the canonical rule
- [ ] CHK-015 [P1] `#1234` example in `code_style_guide.md` rewritten to durable form
- [ ] CHK-016 [P0] Every per-chunk `git diff` changes only text inside comment syntax
- [ ] CHK-017 [P1] Remaining comments read cleanly (no dangling "per"/"from"/"in")
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] system-spec-kit: typecheck + test:mcp/test green
- [ ] CHK-021 [P0] system-code-graph: typecheck + test green
- [ ] CHK-022 [P0] system-skill-advisor: typecheck + test green
- [ ] CHK-023 [P0] deep-agent-improvement: `node --check` green per edited .cjs
- [ ] CHK-024 [P1] Python (`py_compile`) / shell (`bash -n`) green for any edited files
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] No Bucket-B functional literal edited (`.opencode/specs/` paths/globs/SQL `LIKE`, `notes:`, schema descriptions, regexes)
- [ ] CHK-FIX-002 [P0] No Bucket-C test fixture / assertion edited (anything under `tests/`/`*.vitest.ts`/fixtures)
- [ ] CHK-FIX-003 [P0] Each chunk leaves the touched skill's compile + tests green; any red reverts the chunk
- [ ] CHK-FIX-004 [P0] Comment-line ripgrep for ephemeral patterns returns zero across cleaned skills (Bucket A)
- [ ] CHK-FIX-005 [P1] Any remaining pattern hits confirmed Bucket B/C via `git diff` (untouched)
- [ ] CHK-FIX-006 [P1] CLI-CODEX reviewed each chunk's diff; flagged issues resolved
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets introduced or exposed by edits
- [ ] CHK-031 [P0] Stable security references (`CWE-###`) preserved by Rule C, not stripped
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] spec/plan/tasks/checklist/decision-record/implementation-summary synchronized
- [ ] CHK-041 [P1] sk-code grep finds zero surviving `T###`/`REQ-###`/`CHK-###` recommendation
- [ ] CHK-042 [P1] Echo sites reconciled (language style guides, config QS, checklists, quick_reference)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Per-chunk commits keep each chunk independently revertible
- [ ] CHK-051 [P0] Scope lock honored — only files in spec.md "Files to Change" were modified
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-060 [P0] validate.sh --strict Exit 0
- [ ] CHK-061 [P0] All P0 items above checked with evidence
- [ ] CHK-062 [P1] Completion metadata reconciled (spec Status, continuity, implementation-summary)
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..004)
- [ ] CHK-101 [P1] All ADRs have status Accepted
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (each ADR)
- [ ] CHK-103 [P2] Instance-vs-structural distinction (ADR-001) reflected in the sk-code rule text
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-110 [P2] No runtime behavior change — comment-only and doc edits carry zero perf impact (NFR-P01)
- [ ] CHK-111 [P2] No new dependencies or hot-path edits introduced
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-120 [P0] Rollback procedure is per-chunk `git checkout`/`git revert`; each chunk independently revertible
- [ ] CHK-121 [P1] Working tree committed/stashed before cleanup so per-chunk diffs are clean
- [ ] CHK-122 [P2] No feature flag needed (docs + comment edits only)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-130 [P1] Stable security references (`CWE-###`) preserved by Rule C, not stripped
- [ ] CHK-131 [P2] No dependency or license changes
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [ ] CHK-141 [P1] sk-code references self-consistent — no surviving `T###`/`REQ-###`/`CHK-###` recommendation
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Owner | Decision authority | Approved (plan + 4 scoping answers) | 2026-05-27 |
| Claude | Implementer | In progress | 2026-05-27 |
| CLI-CODEX (gpt-5.5) | Per-chunk reviewer | Pending | — |
<!-- /ANCHOR:sign-off -->
