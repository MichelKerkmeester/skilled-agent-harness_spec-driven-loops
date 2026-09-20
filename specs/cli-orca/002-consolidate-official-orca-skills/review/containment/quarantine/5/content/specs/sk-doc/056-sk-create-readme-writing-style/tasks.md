---
title: "Tasks: Improve sk-create-readme writing-style guidance"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Improve sk-create-readme writing-style guidance

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Scaffold Level 2 packet at `specs/sk-doc/056-sk-create-readme-writing-style/` via `create.sh` and move it under `specs/sk-doc/`
- [x] T002 Analyze `sk-create-readme` writing-style logic (SKILL.md, three references, two templates, shared core-standards) and enumerate the gaps the root README rework exposed
- [x] T003 Record scope decisions: Docs + Template, new packet, technical register for non-front-page READMEs
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 `SKILL.md`: optional `Problem` row in the section table, four new format rules (emoji registers, feature-named headings, per-item descriptions, paragraph bound), version 1.2.0.0. Problem row added then removed per ADR-001
- [x] T005 `references/readme/writing-patterns.md`: `Emoji Use` rule, `Paragraphs and Bullets` rule, `Itemized Inventory` pattern, version 1.2.0.0. `Problem` standard added then removed per ADR-001
- [x] T006 `references/readme/types-and-voice.md`: `Front-Page vs Technical Register` subsection, version 1.2.0.0
- [x] T007 `references/readme/quality-and-checklist.md`: checklist items for emoji register, feature-named headings, per-item descriptions, paragraph bound, version 1.2.0.0
- [x] T008 `shared/references/core-standards.md`: README emoji line names the two registers, version 2.1.0.37
- [x] T009 `assets/readme-template.md`: inventory-description rule, itemized pattern example, scaffold comment, version 1.2.0.0
- [x] T010 `changelog/v1.2.0.0.md`: release entry in the v1.1.0.0 format
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 `validate_document.py` on all seven touched files: VALID, 0 issues each
- [x] T012 `hvr_scan.py` on all seven touched files: no new hard blockers (pre-existing blockers in untouched lines confirmed by diff position)
- [x] T013 Fill packet docs (spec.md, plan.md, tasks.md, implementation-summary.md, acceptance-criteria.md) and run `validate.sh --strict`
- [x] T014 Supersede the Problem-section guidance after the operator removed it from the root README: `decision-record.md` ADR-001, AC-004 marked Superseded, REQ-004 struck in spec.md

### Verification Checklist

- [x] Every load-bearing addition sits in `SKILL.md` or the reference an author consults at that decision point
- [x] Emoji rule names both registers and the semantic set (✅ ❌ ⚠️ 🔒 🚨)
- [x] Additions are opt-in or scoped to the README types they fit
- [x] No file outside the Files to Change table was modified
<!-- /ANCHOR:phase-3 -->

---
