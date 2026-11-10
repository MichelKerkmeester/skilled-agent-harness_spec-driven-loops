---
title: "Feature Specification: Phase 10: reference-readability-research"
description: "Phase 009 found the frontend references collapsing rule fields into one paragraph, rendering lines as headings and gluing OVERVIEW onto content sections, and every check still passed them. This phase runs a 15-iteration deep research across every sk-code mode's references and assets, and into sk-create-skill, to find the same defects elsewhere and the authoring and validation gaps that let them ship."
trigger_phrases:
  - "reference readability research"
  - "phase 10 reference readability research"
  - "sk-code reference layout audit"
  - "sk-create-skill reference quality"
importance_tier: "normal"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 10: reference-readability-research

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-03 |
| **Branch** | `worktrees/315-frontend-reference-restructure` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 of 10 |
| **Predecessor** | 009-reference-restructure |
| **Successor** | None |
| **Handoff Criteria** | `research/research.md` ranks the findings with file:line evidence, and a fix plan waits for the operator's go |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 10** of the frontend upstream proposals packet.

**Scope Boundary**: read-only research over `.skilled/skills/sk-code/` (the hub's `shared/` folder and the `sk-code-ci`, `sk-code-frontend`, `sk-code-quality`, `sk-code-review` and `sk-code-skilled` modes: their references, assets, `SKILL.md` and `ROUTER.md`), and over `.skilled/skills/sk-doc/sk-create-skill/` with the shared validator `validate_document.py` and the templates it checks against. The only writes are under this phase folder.

**Dependencies**:
- Phase 009 closed, with main at `118b56609f`.

**Deliverables**:
- A synthesized `research/research.md`, then a fix plan in `plan.md` and `tasks.md` for the operator to approve before any skill file changes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 009 found layout defects in the frontend references that every gate had passed: rule fields written as consecutive bold-label lines that Markdown joins into one paragraph, text lines directly above `---` that render as headings, and first sections titled `OVERVIEW AND <topic>` with no overview in them. `validate_document.py` reported each file VALID with 0 issues before the fix. The other sk-code modes were written the same way and have not been checked.

### Purpose
Know which sk-code references and assets have readability, structure, layout or sort-order defects, and which changes to sk-create-skill's templates, guidance and validator would stop the next skill from shipping them.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ git show cd00629166:.skilled/skills/sk-code/sk-code-frontend/references/web-cascade-and-selectors.md > /tmp/old.md
$ python3 .skilled/skills/sk-doc/scripts/validate_document.py /tmp/old.md
✅ VALID  Document type: reference  Total issues: 0
$ grep -c '^\*\*\(Rule\|Why\|When not to\|Pitfall\|Support\|See also\)\.\*\*' /tmp/old.md
55
$ find .skilled/skills/sk-code \( -path '*/references/*.md' -o -path '*/assets/*.md' \) -type f | wc -l
99
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Audit every reference and asset under `.skilled/skills/sk-code/` for rendering defects, structure against the sk-doc reference and asset templates, readability, and the sort order of sections and items inside each file.
- Trace why `validate_document.py`, the sk-create-skill templates and its authoring guidance passed the phase 009 defects.
- Rank the fixes, separate the mechanical ones from those that need authoring, and name a check for each class.

### Out of Scope
- Editing any skill file during the research; the fix plan waits for the operator.
- Rule content correctness, such as browser support data or CI semantics, beyond what a readability defect exposes.
- Skills outside sk-code and sk-create-skill, except where the shared validator or templates they share decide the answer.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `010-reference-readability-research/research/` | Create | Deep-research state, iterations and synthesis |
| `010-reference-readability-research/plan.md`, `tasks.md` | Modify | Fix plan after synthesis |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | The research runs 15 iterations across two lineages: DeepSeek V4.1 Flash at max (8) and GPT-6 Luna at xhigh on the standard tier (7), with no early stop |
| REQ-002 | Every finding cites `file:line`, and the synthesis keeps only findings a second read confirms |
| REQ-003 | No skill file changes before the operator approves the fix plan |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | The synthesis covers each of the five sk-code modes and the hub's `shared/` folder, or says which it found clean |
| REQ-005 | The synthesis names, for each defect class, the sk-create-skill template, guidance or validator change that would catch it, and whether `validate_document.py` can check it mechanically |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `research/research.md` exists with ranked findings and the 15 iteration files are on disk.
- **SC-002**: Each proposed validator check flags at least one named known-bad file (the `cd00629166` control, another `cd00629166` reference, or a confirmed HEAD defect), and none flags a file this research confirmed clean. The operator accepted this wording on 2026-11-04, because the control holds only five of the ten defect classes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | opencode-go DeepSeek and codex Luna | A lineage cannot run | On a quota or provider stop, stop and ask; never re-route a GPT model off its own provider |
| Risk | Two lineages report the same defect in different words, or disagree | Med | The synthesis merges by file and line, and a disagreement is checked against the file, not tallied |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Reliability
- **NFR-R01**: The research writes nothing outside this phase folder.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A file that is a symlink into another skill is audited once, in its owner.
- A mode whose references are already clean is reported clean, with the checks that showed it.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | About 99 documents across five modes, plus the sk-create-skill package |
| Risk | 4/25 | Read-only research |
| Research | 14/20 | Two lineages, 15 iterations |
| **Total** | **28/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None blocking. The operator set the split (8 + 7), the stop policy (all iterations) and the follow-up (plan, then ask) on 2026-11-03.
<!-- /ANCHOR:questions -->

---
