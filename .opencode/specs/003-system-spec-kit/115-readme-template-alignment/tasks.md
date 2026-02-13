# Tasks: README Template Alignment & Root README Restructuring

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

---

## Phase 1: Template Alignment

- [ ] T001 Audit `readme_template.md` for gaps between documented and practiced patterns (`.opencode/skill/workflows-documentation/references/readme_template.md`)
- [ ] T002 Add badge pattern documentation: placement rules, format, recommended badge types (`.opencode/skill/workflows-documentation/references/readme_template.md`)
- [ ] T003 Add architecture diagram guidelines: ASCII vs mermaid, sizing, when to include (`.opencode/skill/workflows-documentation/references/readme_template.md`)
- [ ] T004 Add Before/After comparison format: table layout, code-block pattern, usage criteria (`.opencode/skill/workflows-documentation/references/readme_template.md`)
- [ ] T005 Add anchor placement rules: open/close pairing, kebab-case naming, positioning relative to headings (`.opencode/skill/workflows-documentation/references/readme_template.md`)
- [ ] T006 Add TOC consistency rules: manual maintenance protocol, phantom link prevention, heading-to-TOC sync (`.opencode/skill/workflows-documentation/references/readme_template.md`)

---

## Phase 2: Root README Restructuring

- [ ] T007 Audit root README anchor tags: inventory all open/close pairs, identify broken tags (`README.md`)
- [ ] T008 Fix broken anchor tags: close overview anchor, open structure anchor properly (`README.md`)
- [ ] T009 Add Quick Start section (section 2) with installation and first-run steps (`README.md`)
- [ ] T010 Add Structure section (section 3) with `.opencode/` directory tree overview (`README.md`)
- [ ] T011 Renumber sections from current 7 to target 9 (insert sections 2 and 3, shift remaining) (`README.md`)
- [ ] T012 Synchronize TOC: remove 2 phantom links, add entries for new sections 2 and 3 (`README.md`)
- [ ] T013 Verify all internal links resolve (no dangling `](#...)` references) (`README.md`)

---

## Phase 3: Root README Feature Content

- [ ] T014 [P] Add Local-First/Privacy callout in OVERVIEW section (`README.md`)
- [ ] T015 [P] Update Key Stats with current scripts count (`README.md`)
- [ ] T016 [P] Expand CWB (Context Window Budget) explanation in Agent Network section (`README.md`)
- [ ] T017 [P] Add 24 failure patterns note in Gate System section (`README.md`)
- [ ] T018 [P] Add Multi-stack auto-detection table in Skills Library section (`README.md`)
- [ ] T019 Add Command Architecture subsection: rename context + two-layer .md/.yaml explanation (`README.md`)
- [ ] T020 Add Code Mode MCP section with 98.7% context reduction stat (`README.md`)
- [ ] T021 Add Chrome DevTools Integration section with 300+ CDP methods stat (`README.md`)
- [ ] T022 Add Git Workflows section covering 3-phase workflow and worktrees (`README.md`)
- [ ] T023 Add Extensibility section explaining custom skills/agents/commands creation (`README.md`)
- [ ] T024 Verify final line count: must be 800-1000 lines (`README.md`)
- [ ] T025 Run final TOC and anchor integrity check across entire README (`README.md`)

---

## Completion Criteria

- [ ] All tasks T001-T025 marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] `readme_template.md` documents 5 evolved patterns (T002-T006)
- [ ] Root `README.md` has 9 sections, zero broken anchors, zero phantom TOC links
- [ ] Root `README.md` line count between 800 and 1000
- [ ] All 10 underrepresented features have content in root README

---

## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Related**: Specs 111, 112, 113, 114

---
