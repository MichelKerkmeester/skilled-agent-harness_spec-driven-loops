---
title: "Implementation Plan: Let the continuity writer save into a research-level folder"
description: "Adds continuityHostPath to the save writer, so a research record's continuity lands in its spec.md."
trigger_phrases:
  - "research folder continuity plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Let the continuity writer save into a research-level folder

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript on Node.js |
| **Framework** | The system-spec-kit runtime CLI save writer |
| **Storage** | Spec-folder markdown plus generated JSON metadata |
| **Testing** | Vitest |

### Overview
The save writer gains `continuityHostPath(leafPath)`, which picks the doc that holds a leaf's continuity block: the leaf's implementation-summary.md when it exists, else its spec.md when that file carries the research level marker, else null. `planContinuityWrite` resolves the leaf, validates the merge against that host and carries it as `hostPath`. `writePlannedContinuity` re-reads the host, rebuilds the merge and renames a temp file over it.
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
Monolith

### Key Components
- **`continuityHostPath`**: resolves the doc that holds the leaf's continuity block.
- **`planContinuityWrite`**: decides the write before anything lands, validates the merge against the host and carries `hostPath` in the plan.
- **`writePlannedContinuity`**: re-reads the host, rebuilds the merge and renames a temp file into place under the leaf's canonical-save lock.

### Data Flow
The save payload carries `_continuity`. `planContinuityWrite` resolves the leaf, picks the host with `continuityHostPath` and refuses the continuity write when no host exists. `writePlannedContinuity` then reads the host, merges the payload with `buildSaveContinuityMarkdown`, writes a temp file and renames it over the host.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

`save-continuity-write.vitest.ts` covers the writer end to end. The red proof ran the two new cases against the unfixed `workflow.ts` and got 1 failed, 16 passed, exit 1, with the research case failing (`specs/system-speckit/052-research-folder-continuity/scratch/before/vitest-new-test-on-old-code.txt`). The green run against the fixed writer got 17 of 17 with exit 0 (`specs/system-speckit/052-research-folder-continuity/scratch/after/vitest.txt`).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

N/A. The architecture section already names the components this plan depends on, and the research record's host doc comes from its own scaffold at `templates/packet-types/research.spec.md.tmpl`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A. Reverting `workflow.ts` and `save-continuity-write.vitest.ts` returns the writer to the refusal behavior for research records.
<!-- /ANCHOR:rollback -->

---

