---
title: "Implementation Plan: Derive SOURCE quality_class at the graph upsert choke point"
description: "Export a frozen quality_class vocabulary beside SAFE_METADATA_KEYS, derive the class for research SOURCE nodes in upsert.cjs from the node path, then name, then id, strip leaf values, and move the upsert-seeded fixtures. Proved by four existing coverage-graph and convergence suites."
trigger_phrases:
  - "source diversity quality class plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Derive SOURCE quality_class at the graph upsert choke point

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS entry script run under tsx, TypeScript library |
| **Framework** | system-deep-loop coverage graph |
| **Storage** | SQLite coverage graph through `runtime/lib/coverage-graph/coverage-graph-db.ts` |
| **Testing** | vitest, run from `.skilled/skills/system-deep-loop/runtime` |

### Overview
`upsert.cjs` is the one script entry that writes graph nodes, so the derivation sits in its node loop. The vocabulary is one frozen export beside `SAFE_METADATA_KEYS` in `coverage-graph-query.ts`, which `upsert.cjs` can load because it re-runs itself under the tsx loader (`upsert.cjs:45-56`). Fixtures that seed SOURCE nodes through the `upsert` script move from hand-set classes to source names that derive them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/coverage-graph-signals.vitest.ts tests/integration/convergence-script.vitest.ts tests/integration/upsert-script.vitest.ts tests/unit/deep-research-graph-upsert.vitest.ts` exits 0, with the REQ-001 case red before the change
- [ ] The playbook scenario is written through `/create:manual-testing-playbook`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Ingest-time normalization. The writer, not the leaf, sets a derived field from a closed set.

### Key Components
- **Vocabulary constant** (`coverage-graph-query.ts`): the only list of allowed values. Its one consumer is `upsert.cjs`; the reader `coverage-graph-signals.ts:680` keeps counting distinct strings and needs no change.
- **Derivation in `upsert.cjs`**: for `loopType === 'research'` and `kind === 'SOURCE'`, drop `metadata.quality_class`, classify `path`, then `name`, then `id` as URL or repo path, and set the result. `path` already reaches this loop: the pack requires it on file SOURCE nodes (`prompt-pack-iteration.md.tmpl:86`) and `iteration-graph-upsert.cjs:143` spreads it into the input. Other kinds and review nodes pass through untouched.
- **Read path**: `SAFE_METADATA_KEYS` already lists `quality_class` (`coverage-graph-query.ts:131`), so the stored value survives a read with no change.

### Data Flow
Leaf `graphEvents` reach `upsert.cjs` as nodes. For a research SOURCE node, the script classifies its path (or name, or id), writes the class into metadata, and the DB stores it. `computeResearchSourceDiversityFromData` then counts distinct stored classes per question exactly as before, so a question needs two derived classes to reach 2.0 and clear the 1.5 threshold.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the four suites for a green baseline and lists every fixture that sets `quality_class`. Implementation adds the constant, adds the derivation and strip in `upsert.cjs`, then moves the fixtures and adds the cases. Verification reruns the four suites, checks no non-SOURCE metadata changed, and writes the playbook scenario through `/create:manual-testing-playbook`. The ordered work and each task's verify clause live in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run `cd .skilled/skills/system-deep-loop/runtime && npx vitest run tests/unit/coverage-graph-signals.vitest.ts tests/integration/convergence-script.vitest.ts tests/integration/upsert-script.vitest.ts tests/unit/deep-research-graph-upsert.vitest.ts`. It must exit 0. The REQ-001 strip case is written first and must fail against the current `upsert.cjs`. The REQ-004 code-only fixture pins the passing code-plus-test case.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None. No new package or module; the constant joins an existing file. This phase is a prerequisite of `../010-research-frontier-mode/`. No compiled contract digests a file this phase changes, so there is no regeneration step, and no agent definition changes, so there is no mirror sync.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: research runs stop or continue differently on the graph `sourceDiversity` signal in a way the REQ-004 arithmetic does not explain. Revert the single commit; stored graphs keep their derived values, which the reader counts like any other string, so no data migration is needed.
<!-- /ANCHOR:rollback -->

---
