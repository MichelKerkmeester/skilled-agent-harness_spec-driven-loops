---
title: "Verification Checklist: deep-research reference split and router alignment"
description: "Level-2 verification checklist for the deep-research reference split and sk-doc smart-router alignment."
trigger_phrases:
  - "deep-research reference split checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/001-release-cleanup/006-deep-research-reference-split"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "checklist-complete"
    next_safe_action: "optional-commit"
    blockers: []
    key_files: ["checklist.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000012016"
      session_id: "131-000-012-reference-split"
      parent_session_id: "131-000-012-reference-split"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Verification Checklist: deep-research reference split and router alignment

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

- [x] CHK-001 [P0] Operator-selected phase folder recorded. Evidence: `spec.md` metadata uses `012-deep-research-reference-split`.
- [x] CHK-002 [P0] Split strategy recorded. Evidence: `spec.md` answered questions record split-and-slim.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Live convergence contract retained. Evidence: `convergence.md` plus `convergence_signals.md` retain hard stops, legal-stop gates, graph gates, `0.30/0.35/0.35`, and `> 0.60`.
- [x] CHK-011 [P0] State packet contract retained. Evidence: `state_format.md`, `state_jsonl.md`, `state_outputs.md`, and `state_reducer_registry.md`.
- [x] CHK-012 [P1] SKILL router follows sk-doc mechanics. Evidence: `SKILL.md` includes discovery, guard, existence checks, scoring, fallback, and missing-resource notice.
- [x] CHK-013 [P1] SKILL Section 1 follows sk-doc boundaries. Evidence: WHEN TO USE now contains activation triggers, use cases, and anti-patterns; operational contracts moved to HOW IT WORKS and RULES.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] `extract_structure.py` ran on changed/new docs. Evidence: DQI range 92-98, zero content issues.
- [x] CHK-021 [P0] `validate_document.py --blocking-only` passed. Evidence: all 12 changed/new docs returned PASS.
- [x] CHK-022 [P0] `quick_validate.py .opencode/skills/deep-research --json` passed. Evidence: `valid: true`, no warnings.
- [x] CHK-023 [P0] Grep checks passed. Evidence: stale weights, monolith-only descriptions, and review-mode bulk terms returned no matches.
- [x] CHK-024 [P0] Strict spec validation passed. Evidence: final `validate.sh --strict` result recorded in `implementation-summary.md`.
- [x] CHK-025 [P1] Template-fidelity pass completed. Evidence: README includes Purpose, Usage, Key Statistics, How This Compares, Key Features, Configuration, and Usage Examples; scoped grep found no file/resource paths in SKILL WHEN TO USE.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P1] `convergence.md` split into hub plus focused references. Evidence: four new `convergence_*.md` files.
- [x] CHK-FIX-002 [P1] `state_format.md` split into hub plus focused references. Evidence: three new `state_*.md` files.
- [x] CHK-FIX-003 [P1] README and quick reference navigation updated. Evidence: both docs reference the split contract.
- [x] CHK-FIX-004 [P1] Non-ASCII sk-doc/HVR leftovers removed from touched docs. Evidence: grep for em dash, arrows, section sign, and emoji markers returned no matches.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-SEC-001 [P0] No runtime or secret-bearing files changed. Evidence: scope limited to markdown/json spec metadata and deep-research docs.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-030 [P1] Deep-review bulk removed from deep-research references. Evidence: review-mode grep returned no matches.
- [x] CHK-031 [P1] New focused references are discoverable by `SKILL.md`. Evidence: `RESOURCE_MAP` and `ON_DEMAND` include the new files.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-040 [P0] Spec folder at `.opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/000-release-cleanup/002-deep-research/001-reference-split/`.
- [x] CHK-041 [P1] Skill changes scope-locked to `.opencode/skills/deep-research/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-24
<!-- /ANCHOR:summary -->
