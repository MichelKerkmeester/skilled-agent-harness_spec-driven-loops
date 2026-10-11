---
title: "Implementation Plan: Phase 7: lineage-reducer-compliance"
description: "Diagnose why proof-a skipped the reducer, then put the provenance check at the fan-out merge: a stamped dashboard passes, a hand-written dashboard is refused, and a missing dashboard merges with a warning."
trigger_phrases:
  - "lineage reducer compliance plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: lineage-reducer-compliance

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS script plus a Vitest TypeScript suite |
| **Framework** | Deep-loop runtime fan-out merge |
| **Storage** | Lineage artifact folders on disk |
| **Testing** | Vitest (`runtime/tests/unit`) |

### Overview

Diagnosis first, then one merge-time guard. The check reads the reducer's stamp in a research lineage's dashboard. A dashboard without the stamp refuses that lineage, a missing dashboard merges it with a provenance warning, and a stamped dashboard passes in silence. Baseline before the change: 71 merge tests passing across 4 merge suites, and `fanout-run.vitest.ts` carrying 9 pre-existing environment failures.
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

Guard clause at the merge boundary, refusal only on positive evidence.

### Key Components

- **`fanout-merge.cjs` provenance check**: reads `deep-research-dashboard.md` in each research lineage that carries a registry and classifies it as `reducer`, `hand-written` or `unverified`.
- **`fanout-merge-reducer-provenance.vitest.ts`**: the three regression cases, built from the saved `proof-a` and `proof-b` shapes.
- **Saved proof lineages**: `../006-research-lineage-reducer-path/research/lineages/` supplies the end-to-end fixture.

### Data Flow

The merge scans each lineage folder. For a research lineage with an on-disk registry it reads the dashboard and looks for the reducer stamp. `hand-written` excludes the lineage from the merged set and prints an error line. `unverified` keeps it in the merge and prints a warning. `reducer` prints nothing. The JSON payload carries `refused_reducer_provenance` and `reducer_provenance_warnings` when either list is non-empty.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Test first. The new suite ran red before the check existed, then green after it. The full merge set was rerun next, then the check ran end to end over the saved `proof-a` and `proof-b` lineages, and the `fanout-run.vitest.ts` baseline was captured before the edit and rerun after it. Counts and transcripts: sections 2 to 6 of `scratch/evidence/lane-01-reducer-provenance.txt`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Phase 006, which fixed the reducer output path and left the saved proof lineages.
- The reducer's dashboard stamp, `description: Auto-generated reducer view over the research packet.`, owned by `deep-research/scripts/reduce-state.cjs`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` and delete `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge-reducer-provenance.vitest.ts`. Nothing was committed and no data migrated, so the revert is the only step.
<!-- /ANCHOR:rollback -->

---
