---
title: "Implementation Plan: Review Registry and Metadata Backfill"
description: "Plan for dispositioning glm's review findings and backfilling graph-metadata.json key_files."
trigger_phrases:
  - "review registry metadata backfill plan"
importance_tier: "medium"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/009-research-backlog-remediation/006-review-registry-and-metadata-backfill"
    last_updated_at: "2026-07-01T07:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored plan"
    next_safe_action: "Dispatch implementation to MiMo v2.5 ultraspeed via cli-opencode"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sonnet-009-remediation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Review Registry and Metadata Backfill

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

Read `007-fan-out-hardening/spec.md`'s In-Scope list (P1-001..005, P1-011-001, P2-009-001) and cross-reference each against glm's registry finding IDs to determine which map to shipped fixes. Update each matched finding's `disposition` field with a resolved status + evidence pointer. For the metadata backfill, read each folder's `spec.md` frontmatter `key_files` and copy the real values into the corresponding `graph-metadata.json`'s `derived.key_files`, rather than re-deriving from scratch. For the truncation bug, locate the string-truncation logic in `generate-description.ts` and switch it to a word-boundary-aware truncation (e.g. truncate then trim to the last whitespace).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Every disposition decision cites specific evidence (file/line or commit).
- Truncation fix doesn't change behavior for strings shorter than the limit.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Evidence-first disposition.** Don't mark a finding resolved just because a sibling phase claims completion — check the specific file/test that fixes that specific finding.
- **Copy from spec.md frontmatter, don't re-derive.** The `key_files` values already exist correctly in each folder's own `spec.md`; graph-metadata.json just needs to catch up to them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. Cross-reference all 9 glm findings against 007-fan-out-hardening's shipped scope; disposition each with evidence.
2. Backfill root + 008-parent `key_files` from their own `spec.md` frontmatter.
3. Fix the description-generator truncation bug.
4. Re-run the description generator and graph-metadata backfill scripts to confirm.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

1. Manual/scripted check that all 9 findings have a disposition other than bare `"active"` with no evidence.
2. Re-run `generate-description.js` against the root packet; confirm no mid-word truncation.
3. Re-run `backfill-graph-metadata.js`; confirm `key_files` now includes the real runtime scripts.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. No destructive operations.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## 8. AFFECTED SURFACES (reference)

| Surface | Change |
|---------|--------|
| `review/lineages/glm/deep-review-findings-registry.json` | Disposition backfill |
| `graph-metadata.json`, `008-loop-systems-remediation/graph-metadata.json` | key_files backfill |
| `generate-description.ts` | Truncation fix |
<!-- /ANCHOR:affected-surfaces -->
