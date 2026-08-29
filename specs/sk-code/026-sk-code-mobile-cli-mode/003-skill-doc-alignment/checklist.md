---
title: "Verification Checklist: sk-code-mobile-cli skill doc alignment"
description: "QA checklist mapping to the objective proof plan for the docs-only skill alignment: template conformance on seven docs, design-reference deletion with broken : 0 link integrity, and README plus playbook current-reality reconciliation with no negative-control regression. All items pending; plan only, not started."
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-code/026-sk-code-mobile-cli-mode/003-skill-doc-alignment"
    last_updated_at: "2026-08-27T00:00:00.000Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Authored the proof-plan-mapped QA checklist."
    next_safe_action: "Verify each item from the final state after A-D execute."
    blockers: []
    completion_pct: 0
---

# Verification Checklist: sk-code-mobile-cli skill doc alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|---|---|---|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

All items are unchecked: this is a plan-only packet, not started. Verify each from the final state after
Groups A through D execute in the Public worktree.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Requirements REQ-001 through REQ-008 documented in spec.md
- [ ] CHK-002 [P0] Four-workstream approach and ordering defined in plan.md
- [ ] CHK-003 [P1] The three v4 templates and the exemplar `token-retint-checklist.md` read before editing
- [ ] CHK-004 [P1] OQ-1 `dqi-baseline.md` decision obtained before Group B starts (REQ-007)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

Doc-structure quality: conformance of the seven target docs to their v4 templates.

- [ ] CHK-010 [P0] All seven docs carry `## 1. OVERVIEW` (SC-001, REQ-001, REQ-002)
- [ ] CHK-011 [P0] All seven docs end with a RELATED-RESOURCES or REFERENCES section (SC-001)
- [ ] CHK-012 [P0] Every H2 across the seven docs is ALL-CAPS numbered, with each GATE folded into the numbered pattern and its content preserved (REQ-001)
- [ ] CHK-013 [P1] Asset intros trimmed to 1-2 sentences with an H1 `Title - Subtitle` (REQ-001)
- [ ] CHK-014 [P1] The two `a11y-parity-checklist.md` H2 parentheticals are ALL-CAPS (REQ-001)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

Objective proof-plan checks, run from the final state.

- [ ] CHK-020 [P0] `SKILL_DIR/references/design-reference/` no longer exists (SC-002, REQ-003)
- [ ] CHK-021 [P0] `scan-skill-references.mjs` against `SKILL.md` reports `broken : 0` (SC-002, REQ-006)
- [ ] CHK-022 [P0] Literal grep of README and playbook returns zero pre-migration and zero negative-control strings (SC-003, REQ-005)
- [ ] CHK-023 [P1] `README.md` has the one-line blockquote pitch after the H1 and a 4-row AT A GLANCE (SC-004, REQ-004)
- [ ] CHK-024 [P1] Each edited doc passes `validate_document.py` when present, or the absence is recorded (SC-005, REQ-008)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

Alignment completeness for this docs-only packet.

- [ ] CHK-FIX-001 [P0] All seven target docs plus `README.md` are processed; none skipped
- [ ] CHK-FIX-002 [P0] The two live `SKILL.md` danglers (line 80 bullet, line 74 count) are fixed in the same change as the folder deletion (REQ-003)
- [ ] CHK-FIX-003 [P0] The negative-control grep is re-run after the README rewrite and returns nothing (REQ-005)
- [ ] CHK-FIX-004 [P1] The two historical changelog mentions of `design-reference/` are confirmed untouched (REQ-003)
- [ ] CHK-FIX-005 [P1] Partially conformant files (for example `bem-rename-checklist.md`) receive only the missing template pieces, with no renumber of an already-correct gate
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No secrets, credentials, or external network references introduced by any edit (NFR-S01)
- [ ] CHK-031 [P1] Only `references/design-reference/` is deleted; no other file in `SKILL_DIR` or either app tree is removed (NFR-P01)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized
- [ ] CHK-041 [P1] REQ and SC identifiers are consistent across the four packet docs
- [ ] CHK-042 [P2] A skill changelog entry for the landed edit is considered at landing time (tracked outside this packet)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] The edits are made in an isolated Public worktree, not the shared checkout
- [ ] CHK-051 [P1] No stray temp files are left in the packet or the worktree
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|---|---|---|
| P0 Items | 12 | 0/12 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Not started (plan only)
<!-- /ANCHOR:summary -->
