---
title: "Tasks: Phase 9: reference-restructure"
description: "Convert the rule blocks by script, rebuild the nine frontend references to the sk-doc reference template in three DeepSeek builds, then check links, rule ids and the gates."
trigger_phrases:
  - "reference restructure tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: reference-restructure

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`R` is `.skilled/skills/sk-code/sk-code-frontend/references`. `S` is this phase's `scratch/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the baseline: rule ids at HEAD (`S/rule-ids-before.txt`) and the link check on main. Verify: 66 ids; `check-links.py` prints `checked=94 broken=0`. Evidence: 66 ids; `checked=94 broken=0` on main.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Convert every rule block to a field list and put a blank line before each `---` (`S/fieldlist.py` over `R/*.md`). Verify: the bold-label count is 0 and no text line sits above a `---`. Evidence: label count 0 and setext check empty in all nine files.
- [x] T003 [P] Rebuild the cascade, layout and performance files (`S/brief-a-css-perf.md`). Verify: each opens `## 1. OVERVIEW`, P10 sits under the interaction section. Evidence: all three open `## 1. OVERVIEW`; P10 sits in section 4 after P7.
- [x] T004 [P] Rebuild the accessibility, elements and internationalization files, with the Angular removal (`S/brief-b-a11y-i18n.md`). Verify: `grep -i angular` prints nothing; I8 is gone. Evidence: no Angular line; the id diff is `I8`.
- [x] T005 [P] Rebuild the core, the web layer and the Figma check, moving the `bdg` recipes into `figma-to-code.md` (`S/brief-c-core-markup-figma.md`). Verify: externally linked section headings are unchanged. Evidence: `#2`..`#9`, `#2`/`#4`/`#5` and `#5-the-check` unchanged; link check `broken=0`.
- [x] T006 Add the frontend packet changelog entry (`sk-code-frontend/changelog/`). Verify: the file exists and the validator passes it. Evidence: `v1.0.2.0.md` VALID; SKILL.md at 1.0.2.0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Run the link check, the rule-id diff and `validate_document.py` on all nine files. Verify: `broken=0`, the id diff is `I8` only, each file VALID. Evidence: `checked=103 broken=0`; id diff `I8` only; nine VALID.
- [x] T008 Run the playbook validators, the compiled-route suites and router reach on sk-code (`S/final-gates.txt`). Verify: each passes. Evidence: playbooks PASS 27/2/20, 101/101 route tests, reach `RESULT: PASSED` on 7 hubs.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The opencode-go DeepSeek route answers. Evidence: three builds returned `STATUS=OK`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `validate_document.py` reports VALID for each of the nine files.
- [x] CHK-011 [P0] No relative link into the references is broken.
- [x] CHK-012 [P1] No rule text changed except the named Angular edits.
- [x] CHK-013 [P1] No text names a spec folder, phase or finding id.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] The rule-id diff against `S/rule-ids-before.txt` is `I8` only.
- [x] CHK-022 [P1] The sk-code, sk-code-frontend and mcp-figma playbooks validate.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No credential path is read or written. Documentation only.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] The frontend changelog records the restructure and the Angular removal.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-11-03
<!-- /ANCHOR:summary -->

---
