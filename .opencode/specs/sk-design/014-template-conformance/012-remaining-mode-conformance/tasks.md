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
    last_updated_at: "2026-07-27T18:03:42Z"
    last_updated_by: "conformance-executor"
    recent_action: "All tasks marked complete with evidence"
    next_safe_action: "Packet complete, no further action required"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-md-generator/references/extraction-workflow.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 100
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

- [x] T001 Change `importance_tier` from `"high"` to `important` (`design-md-generator/references/extraction-workflow.md:10`) [10m]
  - Evidence: `rg -n 'importance_tier' design-md-generator/references/extraction-workflow.md` -> `importance_tier: "important"`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation [exemplar files + heading numbering, ~2.25h]

### Resolve exemplar DESIGN.md files

- [x] T002 Check for citing sites referencing the four exemplar files by path (no path) [15m]
  - Evidence: `rg -rn "examples/(vercel|linear|supabase|stripe)/DESIGN.md" design-md-generator/` -> path-only citations in `SKILL.md`, feature-catalog, playbook scenarios; no `#fragment` anchors
- [x] T003 Decide relocate vs. documented exemption based on T002 (no path) [10m]
  - Decision: documented exemption (see `references/examples/README.md`); relocating would require updating every citing site for zero functional gain
- [x] T004 Execute the decision for `examples/vercel/DESIGN.md` (`vercel/DESIGN.md`) [5m]
  - Evidence: `contextType: reference` -> `general`; body byte-identical otherwise
- [x] T005 Execute the decision for `examples/linear/DESIGN.md` (`linear/DESIGN.md`) [5m]
  - Evidence: same fix as T004
- [x] T006 Execute the decision for `examples/supabase/DESIGN.md` (`supabase/DESIGN.md`) [5m]
  - Evidence: same fix as T004
- [x] T007 Execute the decision for `examples/stripe/DESIGN.md` (`stripe/DESIGN.md`) [5m]
  - Evidence: same fix as T004
- [x] T007a (added) Apply the same `contextType` fix to the 4 paired `writing-notes.md` files and to `editorial-exemplar.md` [15m]
  - Evidence: `rg -n 'contextType:' references/examples/**/*.md` -> all `general`
- [x] T007b (added) Author `references/examples/README.md` recording the exemption decision [10m]
  - Evidence: file created, cited in spec.md §7

### Number design-mcp-open-design headings

- [x] T008 Record + renumber H2s (`design-mcp-open-design/references/cli-child-pairing.md`) [20m]
  - Evidence: pre `## Result Schema`/`## Parent Re-Validation`/... (unnumbered) -> post `## 1. OVERVIEW` through `## 10. REGISTER ACCEPTANCE GATE`, 0 headings lost
- [x] T009 Record + renumber H2s (`design-mcp-open-design/references/freshness-invalidation.md`) [15m]
  - Evidence: pre 4 unnumbered H2s -> post `## 1. OVERVIEW` through `## 5. IMPLEMENTATION NOTES`, 0 headings lost
- [x] T010 Record + renumber H2s (`design-mcp-open-design/references/guarded-proxy.md`, 234 lines) [30m]
  - Evidence: pre 9 unnumbered H2s -> post `## 1. OVERVIEW` through `## 11. AUTOMATION FREEZE`, 0 headings lost
- [x] T011 Record + renumber H2s (`design-mcp-open-design/references/inner-generator-binding.md`) [15m]
  - Evidence: pre 5 unnumbered H2s -> post `## 1. OVERVIEW` through `## 7. ACCEPTANCE`, 0 headings lost
- [x] T012 Record + renumber H2s (`design-mcp-open-design/references/smart-router-pseudocode.md`) [15m]
  - Evidence: pre 1 unnumbered H2 (`## References`) -> post `## 1. OVERVIEW`, `## 2. IMPLEMENTATION`, `## 3. REFERENCES`, 0 headings lost
- [x] T012a (added) `design-mcp-open-design/references/design-parity-transport.md` — 6th file found missing `## 1. OVERVIEW` during the exhaustive sweep [15m]
  - Evidence: renumbered 1-5 -> 2-6, `## RELATED` -> `## 7. RELATED RESOURCES`
- [x] T012b (added) `design-md-generator/references/guided-run.md`, `authoring-boundary.md`, `assets/source-of-truth-router-card.md` — missing `## 1. OVERVIEW` found during sweep [30m]
  - Evidence: each now opens with `## 1. OVERVIEW`, remaining sections renumbered with no heading lost
- [x] T012c (added) `design-md-generator/assets/cardinal-rules-card.md` — second `importance_tier: "high"` instance [5m]
  - Evidence: `rg -n 'importance_tier: "high"' design-md-generator` -> no matches
- [x] T012d (added) `design-md-generator/manual-testing-playbook/{authoring-boundary,source-of-truth}/*.md` — stray `contextType` field not in the scenario template [10m]
  - Evidence: field removed, `title`/`description`/`version` only remain
- [x] T012e (added) `design-md-generator/references/writing-style-guide.md` and `design-md-format.md` — intro-length and header-casing cleanups found during sweep [20m]
  - Evidence: intro trimmed to 1-2 sentences (writing-style-guide.md); sections 3-15 ALL-CAPS titled, `## Section presence` -> `## 16. SECTION PRESENCE` (design-md-format.md); `design-md-format.md`'s `## 0.`-based numbering and missing OVERVIEW documented as an exception, not restructured (see `implementation-summary.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification [~20m]

- [x] T013 `rg -n "importance_tier" extraction-workflow.md` shows in-enum value (no path) [5m]
  - Evidence: `importance_tier: "important"`
- [x] T014 Confirm the already-conformant `design-mcp-open-design` files show no diff (no path) [5m]
  - Evidence: `git diff --stat` for `mcp-wiring.md`, `od-cli-reference.md`, `tool-surface.md` -> no changes (design-parity-transport.md was reclassified in-scope per T012a, see spec.md addendum)
- [x] T015 `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/sk-design/014-template-conformance/012-remaining-mode-conformance --strict` exits 0 (no path) [5m]
  - Evidence: see verification run in `implementation-summary.md`
- [x] T016 Mark checklist.md items with evidence (`checklist.md`) [5m]
  - Evidence: all P0/P1 items checked with citations
- [x] T017 (added) Run full gate: `package_skill.py --check --strict` (both skills), `parent-skill-check.cjs sk-design`, `transport-grounding.test.mjs`, backend `npm run test` [30m]
  - Evidence: parent-skill-check OK 0 warnings (after `generate-leaf-manifest.cjs --write`); transport-grounding 37/37; backend 173/173; `package_skill.py --check` (non-strict) PASS both; `--strict` FAILs both on pre-existing, out-of-scope filename issues (`INSTALL-GUIDE.md`, exemplar `DESIGN.md`, `scripts/_common.sh`) — see spec.md Out of Scope
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Exemplar file content byte-identical before/after (only the `contextType` frontmatter field changed)
- [x] No heading dropped in any renumbered file
- [x] Checklist.md fully verified
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
<!-- /ANCHOR:cross-refs -->
