---
title: "Verification Checklist: Deferred enhancements & external-tool borrows (TIER-3 / future) [template:level_2/checklist.md]"
description: "The TIER-3 items the research explicitly deferred plus the lower-priority borrow-list techniques: DTCG typed tokens + tokens.css, multi-viewport breakpoints, gradient decomposition, CIEDE2000 contrast, MCP token endpoint, composite/aliased tokens, semantic component tagging, hybrid clustering, and the semantic-data section gaps."
trigger_phrases:
  - "deferred enhancements"
  - "DTCG typed tokens"
  - "tokens.css output"
  - "gradient decomposition"
  - "MCP token endpoint"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "design/006-sk-design-md-generator/006-deferred-enhancements"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 006 (deferred bucket) from research TIER-3"
    next_safe_action: "Revisit after phases 002-005 ship; each item is independently optional"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-006"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Deferred enhancements & external-tool borrows (TIER-3 / future)

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

- [ ] CHK-004 [P0] Every deferred item captured with rationale + dependency
- [ ] CHK-005 [P0] DTCG framed parallel-first (non-breaking)
- [ ] CHK-006 [P0] Semantic-section gaps documented as accept-open

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Cross-check: every research §3/§4/§7 deferred item appears here
- [ ] CHK-008 [P0] Each item has a file target + dependency note

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-009 [P0] Root cause fixed, not symptom: each change traces to the corrected mechanism (e.g. honest-absence at the source), not a patched output
- [ ] CHK-010 [P1] No new fabrication surface introduced by the fix

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-011 [P1] No new network/file-write surface beyond the existing tool sandbox; extraction stays read-only against the target site

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-012 [P1] Changelog entry drafted; SKILL.md/resources updated where this phase touches them
- [ ] CHK-013 [P2] Parent graph-metadata status updated on completion

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-014 [P1] Changes confined to the files listed in spec.md §3; no out-of-scope edits

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [ ] CHK-015 [P0] `validate.sh --strict` PASS on this phase
- [ ] CHK-016 [P0] `package_skill.py --check` PASS
- [ ] CHK-017 [P0] Re-extract anobel: no loss of real tokens vs baseline; the two known hallucinations not generatable/validatable
- [ ] CHK-018 [P1] 4 gold-standard examples re-extracted; token-count + section-coverage delta acceptable

<!-- /ANCHOR:summary -->

---

