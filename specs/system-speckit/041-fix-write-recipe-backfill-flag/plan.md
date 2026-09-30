---
title: "Implementation Plan: Correct the graph metadata backfill command in the spec folder write recipe"
description: "Swap one flag for a positional argument in Step 5 of the write recipe, then prove the command text runs and the old form does not."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Correct the graph metadata backfill command in the spec folder write recipe

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference document, Node CLI script |
| **Framework** | None |
| **Storage** | None |
| **Testing** | The recipe's own command run with `--dry-run`, plus `validate.sh --strict` |

### Overview
The recipe's Step 5 passes the packet folder as `--root <folder>`, which the backfill script does not read as a target. The fix passes the folder positionally, as the script's usage header documents, and the proof runs the text exactly as the recipe now reads.
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
Other: a one-line correction to a reference document.

### Key Components
- **`spec-folder-write-recipe.md`**: The recipe authors follow to scaffold a packet that passes strict validation.
- **`backfill-graph-metadata.js`**: The script Step 5 calls, whose `planBackfill` decides what an argument means.

### Data Flow
The recipe text becomes a shell command, `planBackfill` parses its arguments, and a positional folder becomes the scoped target that the script refreshes.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run the old command and record its exit status as the baseline. After the edit, extract the two command lines from the recipe file, substitute a real packet folder and `--dry-run`, and run that text. The dry-run writes nothing, so the check is safe to repeat.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The built script under `runtime/cli/dist/graph/` must exist. It does, and the dry-run loads it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the commit. The change is two lines in one document and touches no code.
<!-- /ANCHOR:rollback -->

---
