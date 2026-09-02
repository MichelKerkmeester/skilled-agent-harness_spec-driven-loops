---
title: "Implementation Plan: Fidelity and library research for sk-create-chart"
description: "Renumber three reference overviews, run a ten-iteration research loop against six open-source charting libraries, then apply the improvements the loop proves and that the template contract allows."
trigger_phrases:
  - "chart fidelity plan"
  - "chart research loop"
  - "renumber overview sections"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Fidelity and library research for sk-create-chart

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown references, self-contained HTML5 templates, Node CommonJS for the corpus check |
| **Framework** | None by contract. A template depends on nothing at runtime |
| **Storage** | None. Data is a literal array inside each template |
| **Testing** | `scripts/check-corpus.cjs`, structural by default and browser-backed under `--render` |

### Overview
Three reference overviews are shifted so the numbering starts at one, and every citation that named a shifted section is corrected in the same pass. A deep-research loop then runs ten iterations against Chart.js, D3, Vega-Lite, Plotly, Observable Plot and ECharts, producing cited findings about axis ladders, label placement, colour ramps, accessibility, responsive sizing and the data-to-mark relationship. What the loop proves and the contract allows is applied to the templates, each edit gated on the corpus check with `--render`. Anything larger is recorded as a decision.
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
- [ ] `check-corpus.cjs --render` prints `RESULT: PASSED` from the final state
- [ ] Docs updated (spec/plan/tasks/acceptance-criteria/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A flat corpus of self-contained documents, checked by one script. There is no runtime, no build and no shared library, which is the property the mode sells.

### Key Components
- **`references/`**: the three documents whose numbering this phase changes, plus the README that indexes them.
- **`assets/templates/`**: twenty chart forms, each a complete HTML file.
- **`scripts/check-corpus.cjs`**: fifteen named checks, the authority on whether an edit shipped correctly.
- **`research/`**: the deep-research packet this phase produces, owned by the deep-research skill.

### Data Flow
A reader arrives with a question, the catalog maps it to a form, the form is copied, its data block is replaced, and the corpus check confirms the result still satisfies the contract.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The renumbering is a rename with real consumers, so the inventory below is the part that decides whether it shipped correctly.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `references/catalog.md`, `color-system.md`, `template-contract.md` | Own the section numbers | update | `grep -n '^## [0-9]'` on each file before and after |
| `references/catalog.md` line 72 | Cites its own families section by number | update | `grep -rn 'section [0-9]'` over the mode |
| `manual-testing-playbook/**` | Six scenarios cite `template-contract.md` sections by number | update | `grep -rn 'section [0-9]'` over the mode |
| `README.md` line 67, two playbook rows | Cite `SKILL.md` sections, which do not shift | unchanged | same grep, confirmed as `SKILL.md` references |

Required inventories:
- Producers of the numbering: `grep -rn '^## [0-9]' references/`.
- Consumers of the numbering: `grep -rniE 'section [0-9]' .` over the whole mode, run before and after.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Every template and palette sheet against the thirteen rules | `node scripts/check-corpus.cjs` |
| Rendered | Every file opened headless, figure region asserted non-empty | `node scripts/check-corpus.cjs --render` |
| Manual | Reading a delivered chart with no caption around it | Browser, per the manual testing playbook |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| A CLI executor for the research loop | External | Yellow | The loop cannot run, and the phase delivers only the renumbering |
| Headless Chrome for `--render` | External | Green | Template edits cannot be proven, so none may be applied |
| `check-corpus.cjs` | Internal | Green | No gate, so no template edit is claimable |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the corpus check fails on a file this phase touched, and the failure repeats on the same file across runs.
- **Procedure**: `git checkout -- <file>` for the affected template. Every change here is a working-tree edit on tracked files, nothing is committed by this phase, so reverting is a checkout with no history rewrite and no remote step.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (scaffold, stage, baseline) ──► Renumber ──┐
                                                 ├──► Apply ──► Verify
Research loop (ten iterations) ──────────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Renumber, Research |
| Renumber | Setup | Verify |
| Research | Setup | Apply |
| Apply | Research | Verify |
| Verify | Renumber, Apply | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes |
| Renumber | Low | 20 minutes |
| Research loop | Medium | 12 minutes of executor wall time |
| Apply | Medium | 1 hour |
| Verification | Low | 20 minutes |
| **Total** | | **about 3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Baseline corpus check captured before any edit
- [x] Phase folder staged immediately after scaffolding
- [x] Nothing committed, so the working tree is the only state to revert

### Rollback Procedure
1. Identify the failing file from the `RESULT:` block of the corpus check.
2. `git checkout -- <file>` to restore it from the index or `HEAD`.
3. Re-run `node scripts/check-corpus.cjs --render` and read the `RESULT:` line.
4. Record the reverted change in `implementation-summary.md` as not applied, with the reason.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->

---


---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Setup     │────►│  Renumber   │────►│   Verify    │
│  + baseline │     │ + citations │     │  + summary  │
└──────┬──────┘     └─────────────┘     └─────────────┘
       │                                       ▲
       │            ┌─────────────┐            │
       └───────────►│  Research   │────► Apply ┘
                    │ 10 iters    │
                    └─────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Setup | None | Phase folder, staged, baseline check | Renumber, Research |
| Renumber | Setup | Three shifted overviews, seven corrected citations | Verify |
| Research | Setup | Ten iteration records, one synthesis | Apply |
| Apply | Research | Template edits and decisions | Verify |
| Verify | Renumber, Apply | Green corpus check, closed acceptance criteria | None |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Setup and baseline** - 20 minutes - CRITICAL
2. **Research loop, ten iterations** - 12 minutes - CRITICAL
3. **Apply and verify** - 1 hour - CRITICAL

**Total Critical Path**: about 2 hours

**Parallel Opportunities**:
- None that are safe. Authoring in the working tree while a lineage is live is what triggered the containment revert recorded in the implementation summary.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Renumbering done | `grep -rn '## 0\. OVERVIEW'` returns nothing and citations resolve | Early |
| M2 | Research complete | Ten iteration records and a synthesis exist | Middle |
| M3 | Applied and green | `check-corpus.cjs --render` prints `RESULT: PASSED` | End |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

Decision records for this phase live in `decision-record.md`. This section names the one decision that shaped the plan itself.

### ADR-001: Reach fidelity through independent work and MIT-class libraries

**Status**: Accepted

**Context**: the mode was built from a PolyForm Noncommercial reference implementation. This repository is MIT and public.

**Decision**: the research question is how the corpus gets better, not how it gets closer to that reference. The reference is not opened by this phase or by any executor it dispatches. Chart.js, D3, Vega-Lite, Plotly, Observable Plot and ECharts are MIT-class and are legitimate sources of both ideas and, where the template contract allows, code.

**Consequences**:
- Findings are grounded in public documentation that any reader can check.
- Some conventions the reference may already solve have to be rediscovered, which costs iterations.

**Alternatives Rejected**:
- Reading the reference for ideas only: the licence governs the work, not the intent, and a paraphrase is still derived.

---

---

<!-- ANCHOR:ai-execution-protocol -->
## L3: AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm the baseline corpus check was captured before any template edit, and its `RESULT:` line read.
- [ ] Confirm no fan-out lineage is running in this working tree before authoring any file, per ADR-005.
- [ ] Confirm every finding about to be applied has a corpus citation that opens at the line it names.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Renumber and correct the citations in one pass, because a shifted section with a stale citation is worse than either alone. |
| TASK-SCOPE | Edits stay inside `.opencode/skills/sk-doc/sk-create-chart/` and this phase folder. `SKILL.md` is never edited, and a needed change to it is recorded as prepared text. |
| TASK-GATE | No template edit is claimed until `node scripts/check-corpus.cjs --render` prints `RESULT: PASSED` from the state that includes it. |

### Status Reporting Format
Report phase status as: `Phase 007 — <Draft|Applying|Complete> — N/10 iterations — M/10 template recommendations applied — gate: <PASSED|FAILED>`.

### Blocked Task Protocol
A render failure on the same file across repeated runs is a chart drawing nothing, and it blocks the claim until the template is fixed or reverted. A different file each run is the headless browser, and it is retried rather than fixed. If the named executor is rate limited, the next permitted executor is used and recorded, and the loop is not hand-rolled to work around the outage.
<!-- /ANCHOR:ai-execution-protocol -->
