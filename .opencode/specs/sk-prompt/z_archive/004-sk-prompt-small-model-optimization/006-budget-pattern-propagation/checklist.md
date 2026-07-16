---
title: "Verification Checklist: cross-skill propagation"
description: "L2 checks for Phase E."
trigger_phrases: ["cross-skill propagation checklist"]
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-prompt/004-sk-prompt-small-model-optimization/006-budget-pattern-propagation"
    last_updated_at: "2026-05-18T15:06:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored 006 checklist.md L2"
    next_safe_action: "Author 006 implementation-summary.md"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000028"
      session_id: "114-006-checklist-init"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Verification Checklist: cross-skill propagation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling |
|----------|----------|
| **[P0]** | HARD BLOCKER |
| **[P1]** | Required |
| **[P2]** | Optional |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] 004 shipped — `.opencode/skills/cli-devin/references/context-budget.md` and `per-model-budgets.json` exist
- [x] CHK-002 [P0] spec.md L2 validates — final strict validation captured in `/tmp/validate-006.log`
- [x] CHK-003 [P0] plan.md L2 validates — final strict validation captured in `/tmp/validate-006.log`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] cli-opencode/references/context-budget.md ≤ 200 LOC (sentinel pattern) — 54 LOC
- [x] CHK-011 [P1] Mirrored doc cites Phase C canonical with relative path — `../../cli-devin/references/context-budget.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 3 P0 requirements verified — T001, T003, T005 complete
- [x] CHK-021 [P1] Cross-references resolve (no broken links) — `/tmp/phase-006-xrefs.log`
- [x] CHK-022 [P1] Smoke test cli-opencode dispatch shows truncation marker — static substitute only: no agent dispatch per hard rule; Template 1 contains `[... truncated N tokens]`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All 4 affected files modified per spec.md §3 — created/updated the four scoped files
- [x] CHK-031 [P0] No regression in existing cli-opencode dispatches — docs-only addition to Template 1; no invocation flags changed
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P2] No credential references in new docs — static review found no secrets or credential values
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] cli-opencode/references/context-budget.md exists and points at canonical — `../../cli-devin/references/context-budget.md`
- [x] CHK-051 [P0] sk-prompt cli_prompt_quality_card.md §3 has "Budget Awareness" subsection — subsection present
- [x] CHK-052 [P1] sk-small-model pattern-index has 2 new rows — cli-opencode and sk-prompt rows shipped via 006
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] cli-opencode reference under references/ (standard layout) — `.opencode/skills/cli-opencode/references/context-budget.md`
- [x] CHK-061 [P1] No spurious files — only scoped docs plus `/tmp` logs created
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- **Total checks**: 15+
- **P0 blockers**: 9
- **P1 required**: 4
- **P2 optional**: 1
<!-- /ANCHOR:summary -->
