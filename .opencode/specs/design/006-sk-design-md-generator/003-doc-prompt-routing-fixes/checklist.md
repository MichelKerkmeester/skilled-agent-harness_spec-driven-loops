---
title: "Verification Checklist: Doc, prompt & routing fixes (remove the fabrication mandates) [template:level_2/checklist.md]"
description: "Remove the structural instructions in the format spec, style guide, prompt template, and SKILL.md that REQUIRE the AI to write content with no backing data. Adds the ABSENT-stamp path, the AP-29 anti-pattern, the per-section anti-fabrication ruleset, and loads the cardinal-rules card as a pre-write gate."
trigger_phrases:
  - "fabrication mandate removal"
  - "absent stamp"
  - "named principle evidence gate"
  - "comparative framing removal"
  - "per-section anti-fabrication ruleset"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/006-sk-design-md-generator/003-doc-prompt-routing-fixes"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 003 from research Phase 2"
    next_safe_action: "Implement T-section requirements data-driven first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-003"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Doc, prompt & routing fixes (remove the fabrication mandates)

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

- [ ] CHK-004 [P0] No instruction requires content without backing data
- [ ] CHK-005 [P0] ABSENT-stamp + ESCALATE path present
- [ ] CHK-006 [P0] AP-29 + per-section ruleset documented
- [ ] CHK-007 [P0] Single source of truth for cardinal rules

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Re-author anobel: §6 ABSENT, no gradient-depth, no comparative claims
- [ ] CHK-009 [P0] sk-doc DQI + package_skill.py --check green on the resources

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-010 [P0] Root cause fixed, not symptom: each change traces to the corrected mechanism (e.g. honest-absence at the source), not a patched output
- [ ] CHK-011 [P1] No new fabrication surface introduced by the fix

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-012 [P1] No new network/file-write surface beyond the existing tool sandbox; extraction stays read-only against the target site

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-013 [P1] Changelog entry drafted; SKILL.md/resources updated where this phase touches them
- [ ] CHK-014 [P2] Parent graph-metadata status updated on completion

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-015 [P1] Changes confined to the files listed in spec.md §3; no out-of-scope edits

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-016 [P0] `validate.sh --strict` PASS on this phase
- [ ] CHK-017 [P0] `package_skill.py --check` PASS
- [ ] CHK-018 [P0] Re-extract anobel: no loss of real tokens vs baseline; the two known hallucinations not generatable/validatable
- [ ] CHK-019 [P1] 4 gold-standard examples re-extracted; token-count + section-coverage delta acceptable

<!-- /ANCHOR:summary -->

---

