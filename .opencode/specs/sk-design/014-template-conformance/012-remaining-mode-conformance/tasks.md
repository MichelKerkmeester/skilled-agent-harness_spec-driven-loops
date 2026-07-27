---
title: "Tasks: Template conformance for design-md-generator and design-mcp-open-design"
description: "Task breakdown for the three independent fixes: enum correction, exemplar-file relocate-vs-exempt, and heading numbering across five reference files."
trigger_phrases:
  - "remaining mode conformance tasks"
  - "design-md-generator conformance tasks"
  - "design-mcp-open-design conformance tasks"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/012-remaining-mode-conformance"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored task breakdown across four phases"
    next_safe_action: "Start T001"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->
# Tasks: Template conformance for design-md-generator and design-mcp-open-design
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort]`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup [enum fix, ~10m]

- [ ] T001 Change `importance_tier` from `"high"` to `important` (`design-md-generator/references/extraction-workflow.md:10`) [10m]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [exemplar files + heading numbering, ~2.25h]

### Resolve exemplar DESIGN.md files

- [ ] T002 Check for citing sites referencing the four exemplar files by path (no path) [15m]
- [ ] T003 Decide relocate vs. documented exemption based on T002 (no path) [10m]
- [ ] T004 Execute the decision for `examples/vercel/DESIGN.md` (`vercel/DESIGN.md`) [5m]
- [ ] T005 Execute the decision for `examples/linear/DESIGN.md` (`linear/DESIGN.md`) [5m]
- [ ] T006 Execute the decision for `examples/supabase/DESIGN.md` (`supabase/DESIGN.md`) [5m]
- [ ] T007 Execute the decision for `examples/stripe/DESIGN.md` (`stripe/DESIGN.md`) [5m]

### Number design-mcp-open-design headings

- [ ] T008 Record + renumber H2s (`design-mcp-open-design/references/cli-child-pairing.md`) [20m]
- [ ] T009 Record + renumber H2s (`design-mcp-open-design/references/freshness-invalidation.md`) [15m]
- [ ] T010 Record + renumber H2s (`design-mcp-open-design/references/guarded-proxy.md`, 234 lines) [30m]
- [ ] T011 Record + renumber H2s (`design-mcp-open-design/references/inner-generator-binding.md`) [15m]
- [ ] T012 Record + renumber H2s (`design-mcp-open-design/references/smart-router-pseudocode.md`) [15m]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [~20m]

- [ ] T013 `rg -n "importance_tier" extraction-workflow.md` shows in-enum value (no path) [5m]
- [ ] T014 Confirm the 4 already-conformant `design-mcp-open-design` files show no diff (no path) [5m]
- [ ] T015 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/012-remaining-mode-conformance --strict` exits 0 (no path) [5m]
- [ ] T016 Mark checklist.md items with evidence (`checklist.md`) [5m]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Exemplar file content byte-identical before/after
- [ ] No heading dropped in any renumbered file
- [ ] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
