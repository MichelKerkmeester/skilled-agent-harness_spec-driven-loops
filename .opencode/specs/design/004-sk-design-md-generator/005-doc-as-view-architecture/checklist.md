---
title: "Verification Checklist: Doc-as-view architecture (deterministic render, AI out of the value tables) [template:level_2/checklist.md]"
description: "The structural endgame: generate the value-bearing sections deterministically from tokens (no AI), reduce AI prose to short token-cited annotations, and enforce citation gating. Removes the AI from the value-table surface where it can fabricate."
trigger_phrases:
  - "doc as view architecture"
  - "deterministic formatters"
  - "prompt builder"
  - "citation gating"
  - "three-class section partition"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/004-sk-design-md-generator/005-doc-as-view-architecture"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 005 from research Phase 4"
    next_safe_action: "Build formatters.ts Phase A (§2 Color + §3 Typography) first"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-151-005"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Doc-as-view architecture (deterministic render, AI out of the value tables)

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

- [ ] CHK-004 [P0] formatters.ts deterministic + matches tokens exactly
- [ ] CHK-005 [P0] build-write-prompt.ts marks PRESENT/ABSENT
- [ ] CHK-006 [P0] checkCitationGating enforces (b)/(c) citations
- [ ] CHK-007 [P0] AI cannot edit class-(a) sections

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-008 [P0] Byte-parity proven on anobel + gold-standard before enabling
- [ ] CHK-009 [P0] vitest determinism + citation-gate tests
- [ ] CHK-010 [P0] Fallback AI-write path intact until parity

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

