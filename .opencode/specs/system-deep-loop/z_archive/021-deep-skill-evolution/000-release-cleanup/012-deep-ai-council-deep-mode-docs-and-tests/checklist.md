---
title: "Verification Checklist: deep-ai-council deep-mode docs + script tests (001)"
description: "Level-2 verification checklist for the five deferred 004 phase-5 follow-ons."
trigger_phrases:
  - "deep-ai-council follow-on checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/021-deep-skill-evolution/000-release-cleanup/012-deep-ai-council-deep-mode-docs-and-tests"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "phase-1-checklist-authored"
    next_safe_action: "execute-phase-2"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000011005"
      session_id: "131-000-011-followon"
      parent_session_id: "131-000-011-followon"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: deep-ai-council deep-mode docs + script tests

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

- [ ] CHK-001 [P0] Five deferred items scoped in `spec.md` (F-002/003/004/006 + DAC-001)
- [ ] CHK-002 [P0] Source scripts read before documenting (cite file:line)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] New references conform to `skill_reference_template.md` (frontmatter + short intro + §1 OVERVIEW)
- [ ] CHK-011 [P1] HVR ≥85 on both new references (no hard-blockers / em-dash / Oxford-list commas)
- [ ] CHK-012 [P0] No existing `.cjs` script logic changed (`git diff` shows only new test files)
- [ ] CHK-013 [P1] New refs wired into SKILL §3 RESOURCE_MAP + §6 REFERENCES + README §9
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] Strict validate exits 0
- [ ] CHK-021 [P0] sk-doc package validate accepts the skill
- [ ] CHK-022 [P0] 5 new vitest files: `node -c` clean; `vitest run` green (or documented skip)
- [ ] CHK-023 [P1] Advisor parity: deep-ai-council surfaces at threshold 0.8
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P1] Each resolved item (F-002/003/004/006 + DAC-001) traces to its 004 source finding
- [ ] CHK-FIX-002 [P1] DAC-001 narrative reconciliation covers both feature_catalog + playbook `01--` entries
- [ ] CHK-FIX-003 [P2] New references cross-checked against the scripts they document (file:line)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-SEC-001 [P0] No secrets in new references, tests, or changelog
- [ ] CHK-SEC-002 [P1] New tests do not perform network calls or write outside the test sandbox
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-030 [P1] DAC-001/002 narrative matches current `ai-council.*` reality (no file-identity claim of `deep-ai-council`)
- [ ] CHK-031 [P1] `changelog/v2.1.1.0.md` authored; SKILL version bumped 2.1.0.0 → 2.1.1.0
- [ ] CHK-032 [P2] Each resolved item traces to its 004 source (F-id in `implementation-summary.md`)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-040 [P0] Spec folder at `.../000-release-cleanup/004-deep-ai-council/001-deep-mode-docs-and-tests/`
- [ ] CHK-041 [P1] All skill changes scope-locked to `.opencode/skills/deep-ai-council/`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | [ ]/9 |
| P1 Items | 9 | [ ]/9 |
| P2 Items | 2 | [ ]/2 |

**Verification Date**: [YYYY-MM-DD — filled at completion]
<!-- /ANCHOR:summary -->
