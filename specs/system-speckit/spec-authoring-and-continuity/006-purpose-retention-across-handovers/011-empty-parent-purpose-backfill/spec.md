---
title: "Feature Specification: Phase 11: empty-parent-purpose-backfill"
description: "Twenty-one live phase parents state no purpose of their own, ten with a bracketed placeholder and eleven with no purpose text, so a resume or compaction under them shows an ancestor's purpose or nothing. This phase writes one real sentence into each, read from the parent and its children, and the operator reviews all 21 before commit."
trigger_phrases:
  - "empty parent purpose backfill"
  - "phase 11 empty parent purpose backfill"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 11: empty-parent-purpose-backfill

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA
<!-- FILL: Fill every row: level, priority, status, date and branch. Use the real branch name. GOOD: Priority P1. Status Draft. Branch `feat/rotate-logs-keep`. WEAK: Priority TBD. Status maybe. -->

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | `worktrees/374-purpose-carry-follow-ups` |
| **Parent Spec** | ../spec.md |
| **Phase** | 11 of 11 |
| **Predecessor** | 010-problem-sentence-carry |
| **Successor** | None |
| **Handoff Criteria** | `node specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/011-empty-parent-purpose-backfill/scratch/check-backfill.mjs` prints `own purpose: 21 of 21`, each of the 21 parents validates with no more errors than its T002 baseline, and the operator has approved the 21 sentences |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 11** of the Carry a packet's purpose across handovers and compactions specification.

**Scope Boundary**: The `### Purpose` text of the 21 phase parents listed in `scratch/parents.txt`, and nothing else in those files. No code, no other heading, no child packet and no status field changes.

**Dependencies**:
- None blocking. The current purpose helper reads an exact `### Purpose` heading, which is the shape this phase writes, so it does not wait for phase 007. It is built last so its sentences are reviewed against the final rule.

**Deliverables**:
- One authored purpose sentence in each of the 21 parent `spec.md` files
- `scratch/sentences.md`, the 21 sentences with the child docs each was read from, for the operator review
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE
<!-- FILL: State the problem in two sentences: what breaks, and for whom. GOOD: The rotate-logs script never deletes old archives, so a host that copies `logs/archive` fills its disk. WEAK: The script has issues with output. -->

### Problem Statement
Twenty-one live phase parents hold no purpose of their own. Ten carry the bracketed placeholder their scaffold left under `### Purpose`, and eleven older parents have no purpose heading or label at all. A resume, relaunch or compaction in any packet below them shows an ancestor's purpose, which names a wider reason than the work at hand, or no purpose line at all.

### Purpose
Give each of the 21 phase parents that states no purpose one sentence saying why its group of child phases exists, so the next AI working below it sees the right reason.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
<!-- FILL: Run the command this change affects and paste the command and its verbatim output. Quote every number the spec states about current behavior from this block. Write `N/A:` and a reason when no command applies. GOOD: `bash scripts/rotate-logs.sh` with 10 archives, then `ls logs/archive | wc -l` prints 10. WEAK: The script deletes old logs. -->
```text
$ node specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/011-empty-parent-purpose-backfill/scratch/check-backfill.mjs | tail -1
own purpose: 0 of 21
```
Run 2026-11-14 at `bd79708c2f` in worktree 374. The full output listed `none` for three parents (`005-smart-rule-injection`, `020-chart-and-diagram-review`, `001-advisor-audit-and-state-containment`) and `ancestor` for the other eighteen.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE
<!-- FILL: List three to five things this change does, each starting with a verb. Before you list a new file, module, option, layer or dependency, name what fails today without it, or drop it. GOOD: Add a `--keep <n>` option that deletes all but the newest n archives in `logs/archive/`. WEAK: Update the script and docs. -->

### In Scope
- Replace the bracketed placeholder under `### Purpose` in the ten parents that have one with one authored sentence.
- Insert a `### Purpose` heading and one authored sentence directly above the first level-two heading in the eleven parents that have no purpose text.
- Record each sentence and the child docs it was read from in `scratch/sentences.md` for the operator review.

### Out of Scope
- The placeholder `**Status**` value in two of the parents - it is a separate field and carrying a purpose does not read it.
- Parents that state a purpose under another heading - phase 007 makes the reader find those.
- Rewriting any Problem Statement - the purpose sentence is the one line every hop carries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| The 21 `spec.md` files listed in `scratch/parents.txt` | Modify | One purpose sentence each |
| `scratch/sentences.md` | Create | The 21 sentences and their sources, for review |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
<!-- FILL: Write one testable requirement per row. Name the exact command or output. GOOD: With 10 archives, `bash scripts/rotate-logs.sh --keep 3` exits 0 and `ls logs/archive | wc -l` prints 3. WEAK: The option should work well. -->
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each of the 21 parents shows its own purpose | `node specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/011-empty-parent-purpose-backfill/scratch/check-backfill.mjs` prints `packet` on all 21 lines and `own purpose: 21 of 21` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No parent validates worse than before | `CI=1 bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <parent> --strict` prints a first `Summary` line with no more errors or warnings than the T002 baseline for each of the 21 |
| REQ-003 | The operator approved the 21 sentences | The operator's answer is recorded in `implementation-summary.md` before the commit |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA
<!-- FILL: Write one measurable outcome per line. A command can prove it. GOOD: With 10 archives in `logs/archive`, `bash scripts/rotate-logs.sh --keep 3` leaves 3. WEAK: The feature is successful. -->

- **SC-001**: `check-backfill.mjs` goes from `own purpose: 0 of 21` to `own purpose: 21 of 21`.
- **SC-002**: `git status --short` lists the 21 files and this packet's own docs, and nothing else.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES
<!-- FILL: Name one dependency and one risk. Give each a concrete mitigation. GOOD: A script that reads `--keep` with no value could delete every archive. Mitigation: reject a missing value with exit 2 and test it. WEAK: There may be some risk. -->

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The built purpose helper in `runtime/dist/lib/spec/packet-purpose.js` | The check script cannot import it | Run `npm run build` in `.skilled/skills/system-spec-kit/runtime` first |
| Risk | A sentence states the wrong reason for a parent, and every hop below it then carries that wrong reason | Medium | Each sentence is read from the parent's own title, description and problem text plus every child's purpose, its sources are listed in `scratch/sentences.md`, and the operator approves all 21 before commit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS
<!-- FILL: Write each open question as one line. Write `None` when nothing blocks. GOOD: Does a missing `--keep` value delete every archive? Decision: no, a missing value exits 2. WEAK: Edge cases are unclear. -->

- Where does the new heading go in the eleven parents with no purpose text? Decision: directly above the first line that starts with `## ` after the frontmatter, because those files use older layouts with no problem anchor, and the helper reads an exact `### Purpose` heading wherever it sits.
- Is `016-search-and-output-intelligence/research/spec.md` a real phase parent? Decision: yes for this phase, because it holds numbered child folders with their own `spec.md`, so the helper treats it as one.
<!-- /ANCHOR:questions -->

---


