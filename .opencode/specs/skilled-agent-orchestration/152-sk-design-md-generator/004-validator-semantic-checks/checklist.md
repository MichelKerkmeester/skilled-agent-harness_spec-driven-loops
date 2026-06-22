---
title: "Verification Checklist: Validator semantic checks (make the checker see prose) [template:level_2/checklist.md]"
description: "Extend validate.ts beyond hex/section-header checks so it can detect prose fabrication: a section-coverage report, a prose-discipline check, non-color stability gating, source-sentinel provenance, and a values-vs-claims score split."
trigger_phrases:
  - "validator prose checks"
  - "section coverage report"
  - "non-color stability gating"
  - "source sentinel provenance"
  - "dual score split"
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator/004-validator-semantic-checks"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 004 from research Phase 3"
    next_safe_action: "Implement checkSectionCoverage first (mechanical hallucination detector)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Validator semantic checks (make the checker see prose)

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

- [ ] CHK-004 [P0] checkSectionCoverage maps every section to backing fields
- [ ] CHK-005 [P0] Dual score split implemented
- [ ] CHK-006 [P0] Prose checks WARNING-tier with suppression
- [ ] CHK-007 [P0] Non-color stability gating extended

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] OLD anobel stub now FAILS (empty §6 + unverified prose)
- [ ] CHK-009 [P0] Corrected anobel PASSES with no false-positives
- [ ] CHK-010 [P0] vitest covers each check + guard

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

