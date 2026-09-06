---
title: "Implementation Plan: evilcharts reference research for sk-create-chart"
description: "Vendor evilcharts at a pinned commit, run two five-iteration research lineages over it on two model families, and reduce their output to one ranked synthesis mapping each finding onto the chart mode."
trigger_phrases:
  - "evilcharts research plan"
  - "two lineage fan-out"
  - "vendored source research"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: evilcharts reference research for sk-create-chart

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | The subject is TypeScript, React, Recharts, ECharts and Tailwind. The product is markdown |
| **Framework** | The deep-loop fan-out runner, two CLI executors |
| **Storage** | Externalised JSONL lineage state under `research/evilcharts-2026-09-03/` |
| **Testing** | `validate.sh --strict` on the phase folder, plus citation resolution against the pinned tree |

### Overview
The reference is vendored first, at a fixed commit, with its licence and provenance recorded beside
it, so every later citation is a path a reader can open rather than a URL that may move. Two
lineages then run over that tree in parallel, five iterations each with convergence off, on two
different model families so a shallow reading by one is unlikely to be the whole result. Each
iteration ends in ranked, concrete changes to named `sk-create-chart` templates and to the template
contract, with the evilcharts `file:line` each change came from. A final synthesis at
`research/research.md` merges and ranks them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `validate.sh <this folder> --strict` prints `RESULT: PASSED`
- [ ] Docs updated (spec/plan/tasks/goal/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A pinned read-only corpus, two independent readers, one reducer. Nothing in this phase mutates the
subject or the target. The only writes are the vendored tree, the lineage state and the documents in
this folder.

### Key Components
- **`context/evilcharts/`**: the subject, pinned at commit `500ecd44`, MIT.
- **`research/evilcharts-2026-09-03/`**: fan-out orchestration state, two lineage directories.
- **`research/research.md`**: the ranked synthesis, the one document the next phase reads.
- **`.opencode/skills/sk-doc/sk-create-chart/`**: the target. Read by the lineages, written by none
  of them.

### Data Flow
A lineage reads the vendored tree and the mode side by side, writes an iteration record, and the
reducer folds it into the lineage's running state. At the end the two lineages' findings are merged
into one ranked list.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase adds a phase to a packet that declares its phases in two places, so both have to move or
the packet describes itself wrongly.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../spec.md` Phase Documentation Map | Lists phases 1 through 7 | update | The map has a row 8 naming this folder |
| `../goal.md` BINDING table | Lists the phases that carry their own goal | update | The table names `008-evilcharts-reference-research/goal.md` |
| `../changelog/` | One file per closed phase | unchanged until closeout | This phase is not closed by this run |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase
checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | The phase folder against the packet contract | `validate.sh --strict` |
| Completeness | Five iteration records per lineage | The lineage `iterations/` directory listing |
| Citation | Every ranked recommendation names a line that exists | Open the cited path in the pinned tree |
| Voice | Everything authored here | `hvr_scan.py`, zero hard blockers |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `cli-pi` with OpenRouter credentials | External | Yellow | The GLM lineage never starts, and the phase runs on one reader |
| `cli-devin` | External | Yellow | The DeepSeek lineage never starts |
| A worktree of its own | Internal | Green | Without one the run destroys concurrent uncommitted work |
| The pinned vendored tree | Internal | Green | Without it citations point at a moving target |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the run produces no usable synthesis, or the vendored tree turns out to be the wrong
  subject.
- **Procedure**: the whole phase lives in one folder in one worktree. Removing the folder removes
  the phase, and reverting the two parent-file edits is a checkout of two files. Nothing outside
  this folder is modified, so there is no consumer to unwind.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (worktree, scaffold, vendor) ──► Fan-out (2 lineages x 5) ──► Synthesise ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Fan-out |
| Fan-out | Setup | Synthesise |
| Synthesise | Fan-out | Verify |
| Verify | Synthesise | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 40 minutes |
| Fan-out | Medium | 2 hours, unattended |
| Synthesise | Medium | 30 minutes |
| Verify | Low | 20 minutes |
<!-- /ANCHOR:effort -->
