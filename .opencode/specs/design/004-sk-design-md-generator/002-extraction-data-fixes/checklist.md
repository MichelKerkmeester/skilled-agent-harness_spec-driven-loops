---
title: "Verification Checklist: Extraction data fixes (stop feeding the AI fake or missing data) [template:level_2/checklist.md]"
description: "Fix the extraction bugs that hand the WRITE phase fabricated defaults or empty fields, which it then writes about as if real. Covers the focus-consistent default, interaction capture off by default, dead a11y-async code, clustering/variant/component/shadow/contrast/motion corrections, the coverage-election pre-gate, and the un-audited detector modules."
trigger_phrases:
  - "extraction data fixes"
  - "focus consistent bug"
  - "interaction capture default"
  - "coverage election pre-gate"
  - "clustering accuracy"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/002-extraction-data-fixes"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 002 from research Phase 1"
    next_safe_action: "Capture baseline then implement T001 focus+interaction fix"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Extraction data fixes (stop feeding the AI fake or missing data)

<!-- SPECKIT_LEVEL: 2 -->

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
- [ ] CHK-002 [P0] Approach defined in plan.md
- [ ] CHK-003 [P1] Baseline captured (tool tests + anobel/gold-standard snapshots)

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] Focus-indicator returns captured:false on empty (no consistent:true)
- [ ] CHK-005 [P0] Coverage pre-gate added; deltaE kept <3 (iter-048 honored)
- [ ] CHK-006 [P0] extractA11yAsync wired; dead duplicate removed
- [ ] CHK-007 [P0] No tool behavior regressed on gold-standard examples (baseline delta reviewed)

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] vitest regression tests for: focus empty, coverage gate, distinct-color non-merge, a11y fields populate
- [ ] CHK-009 [P0] Live anobel re-extraction diffed vs baseline
- [ ] CHK-010 [P0] Detector-module empty-input tests

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-011 [P0] Root cause fixed, not symptom: each change traces to the corrected mechanism (e.g. honest-absence at the source), not a patched output
- [ ] CHK-012 [P1] No new fabrication surface introduced by the fix

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-013 [P1] No new network/file-write surface beyond the existing tool sandbox; extraction stays read-only against the target site

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-014 [P1] Changelog entry drafted; SKILL.md/resources updated where this phase touches them
- [ ] CHK-015 [P2] Parent graph-metadata status updated on completion

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-016 [P1] Changes confined to the files listed in spec.md §3; no out-of-scope edits

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-017 [P0] `validate.sh --strict` PASS on this phase
- [ ] CHK-018 [P0] `package_skill.py --check` PASS
- [ ] CHK-019 [P0] Re-extract anobel: no loss of real tokens vs baseline; the two known hallucinations not generatable/validatable
- [ ] CHK-020 [P1] 4 gold-standard examples re-extracted; token-count + section-coverage delta acceptable

<!-- /ANCHOR:summary -->

---

