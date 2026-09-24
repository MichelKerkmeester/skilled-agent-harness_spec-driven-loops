---
title: "Implementation Plan: Phase 58: Upgrade-level section fragments"
description: "Replace the line diff in upgrade-level.sh with a section-level comparison of two template renders, so an upgrade adds whole sections and nothing else."
trigger_phrases:
  - "upgrade level plan"
  - "section fragment derivation"
  - "upgrade-level section key"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 58: Upgrade-level section fragments

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash with awk; TypeScript test |
| **Framework** | None. A command-line script |
| **Storage** | The packet's markdown documents |
| **Testing** | Vitest, `cli` project, plus the existing `test-upgrade-level.sh` |

### Overview
The script already renders each template at two levels. Instead of diffing those renders line by line, it now splits the higher render into `## ` sections and keeps the ones whose heading the lower render and the target document lack. The heading key strips a leading number whether or not one is there, so numbered and unnumbered headings compare the same way.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Extend in place, inside the fragment helpers of `upgrade-level.sh`.

### Key Components
- **`derive_addendum_fragment`**: renders both levels and emits the higher level's whole sections that are new.
- **`filter_sections_absent_from`**: drops sections the target already has, and anything above the first heading.
- **The heading key**: heading text without its `#` marks and leading number, lowercased.

### Data Flow
Each upgrade step calls `derive_addendum_fragment` for a document, and the step's own code inserts the fragment at its anchor: before OPEN QUESTIONS for spec.md, at the end for plan.md and tasks.md, and as a prefix and suffix pair for the level 3 spec.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The new test renders a level 1 packet from the templates, upgrades it to level 2 and, separately, to level 3, and checks the shape of spec.md, plan.md and tasks.md. Run against the previous script it fails, which is the negative control. The existing shell test covers argument handling, dry runs and level detection.

### Delivery
The section derivation and its test were written by a GPT-6 Luna executor from a brief. Review then found two more defects in the same script, a level marker written inside new documents' frontmatter and new documents keeping the template's placeholder identity, and a MiMo v2.6 Pro executor fixed each from its own literal brief. The orchestrator reviewed every diff and ran every check itself.

### Deviation from the planner
The planner scoped this phase to the stray fragments. The two further fixes were added because an upgraded packet still failed strict validation without them, which is the failure this phase exists to end.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The inline gate renderer and the core templates, which the script and the test both render.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commit.
<!-- /ANCHOR:rollback -->

---
