---
title: "Implementation Plan: Phase 21: vibe-hook-docs-correction"
description: "Correct the Vibe guard reference, one code comment and two index lines from the runs phases 014 to 019 recorded, add playbook and catalog coverage for the new hooks, and close the parent with a recursive strict validate."
trigger_phrases:
  - "vibe hook docs correction plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 21: vibe-hook-docs-correction

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown references, one JavaScript comment |
| **Framework** | sk-doc reference, playbook and feature-catalog conventions |
| **Storage** | None |
| **Testing** | Citation map review, the playbook and catalog validators, `validate.sh --recursive --strict` |

### Overview
A citation map comes first: every line to change is paired with the run that proves its new text. The doc edits follow the map and nothing else. The phase closes with the playbook and catalog checks and a recursive strict validate of the parent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 014 to 020 report Complete in their `implementation-summary.md`
- [ ] `scratch/citation-map.md` pairs every target line with a run

### Definition of Done
- [ ] `rg -c 'UNKNOWN wire format'` on `SKILL.md` and `README.md` exits 1
- [ ] `validate.sh <parent> --recursive --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-mapped doc correction.

### Key Components
- **Citation map** (`scratch/citation-map.md`): without it, a corrected line can rest on a source reading, the error this phase exists to remove.
- **Guard reference** (`references/guards-and-hooks.md`): the one file the hook-type and plugin verdicts live in.

### Data Flow
Each phase 014 to 019 run record feeds one or more rows of the citation map; each map row names the doc line, the new text and the run; the edits apply the map; the validators check the result.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup re-anchors every target line by its text and builds the citation map from the recorded runs of phases 014 to 019. Implementation rewrites the guard reference, the comment, the index lines and the catalog lines from the map, and hands the per-hook playbook scenarios to phase 022. Verification runs the counts, the catalog check and the parent's recursive strict validate. `tasks.md` holds the ordered steps.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The counts in Measured Behavior are rerun after the edits. The playbook and catalog validators run on the changed folders. `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent> --recursive --strict` closes the phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Recorded runs from phases 014 to 019, the sk-doc playbook and catalog validators, and the spec validator. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a corrected verdict is contradicted by a later run. Revert that row to its previous text with an UNVERIFIED note naming the contradicting run, then revert the phase's commit if more than one row is affected.
<!-- /ANCHOR:rollback -->

---
