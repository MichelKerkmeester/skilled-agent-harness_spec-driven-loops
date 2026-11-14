---
title: "Feature Specification: Phase 13: skill-docs-and-housekeeping"
description: "SKILL.md, two references, two READMEs and the changelog of system-spec-kit predate phases 006 to 011, and the packet's own records carry four small defects the reviews found. This phase aligns the skill documents to sk-doc's skill and README standards, adds a v2.13.1.0 changelog entry, fixes the packet records and reviews the phase 009 routing change no reviewer saw."
trigger_phrases:
  - "skill docs and housekeeping"
  - "phase 13 skill docs and housekeeping"
  - "next spec number counts archived"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 13: skill-docs-and-housekeeping

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-14 |
| **Branch** | Chosen by the operator before the build, worktree or current branch |
| **Parent Spec** | ../spec.md |
| **Phase** | 13 of 13 |
| **Predecessor** | 012-catalog-and-playbook-alignment |
| **Successor** | None |
| **Handoff Criteria** | Every remaining row of both reviews is fixed or recorded, and `validate.sh` on the parent with `--strict --recursive` prints `RESULT: PASSED` 14 times |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 13** of the Subtrack proposal, deterministic packet relocation, z_archive on every subtrack and opt-in archive search specification.

**Scope Boundary**: `SKILL.md`, `README.md`, `changelog/`, `references/` and `runtime/cli/spec/README.md` of system-spec-kit, and this packet's own records. No code change, except a fix the phase 009 routing review finds in `graph-metadata.json`.

**Dependencies**:
- Phases 011 and 012, whose behavior and pages these documents point at
- `.skilled/skills/sk-doc/sk-create-skill/SKILL.md`, `.skilled/skills/sk-doc/sk-create-readme/SKILL.md` and `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`

**Deliverables**:
- `SKILL.md` with a next-number command that counts archived packets and a script list naming the relocation, proposal and archive entry points
- References and READMEs that state `archivedPaths`, the fourth no-map case, archived phases in numbering, status 3 and the mixed-track refusal
- A `v2.13.1.0` changelog entry and the matching `SKILL.md` version
- Packet records without the four defects, and a recorded review of the phase 009 routing change
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
`SKILL.md` publishes a next-number command that ignores archived packets, against decision D4, and its script list omits the three tools this packet added. Two references, two READMEs and the changelog still describe the packet after phase 005. The packet's own records name evidence files that were never written, call the decisions Q010 to Q013 when Q015 exists, leave the untracked-stop limitation undocumented, and scoped the review so that nobody judged the phase 009 routing change.

### Purpose
The skill's own documents match its shipped behavior, and the packet's records are accurate and fully reviewed.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ sed -n '295p' .skilled/skills/system-spec-kit/SKILL.md
| Next spec number | `ls -d specs/[0-9]*/ \| sed 's/.*\/\([0-9]*\)-.*/\1/' \| sort -n \| tail -1` |
$ sed -n '5p' .skilled/skills/system-spec-kit/SKILL.md
version: 2.13.0.0
```
The `ls` reads only the specs root and skips every `z_archive/`, while `create.sh` counts archived packets. The other rows of section 3 are quoted in `../review/review-report.md` and `../review/fable-5-2-review.md`.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

`S` is `.skilled/skills/system-spec-kit`. `F` numbers are the findings of `../review/fable-5-2-review.md`. Line numbers are from 2026-11-14 and T001 re-reads each one.

### In Scope
- `S/SKILL.md:295`: a next-number command that counts archived packets (P1).
- `S/references/retrieval/retrieval-conventions.md:84`: `archivedPaths` on the path recipe (P1).
- `S/references/structure/folder-structure.md:141`: the NNN-slug refusal as a fourth no-map case (P1).
- `S/runtime/cli/spec/README.md:114`: the mixed-track restore refusal and status 3 in the `archive.sh` row (P1).
- `S/SKILL.md:317`: `relocate.mjs`, `suggest-subtracks.mjs` and `archive.sh` in the script list (P2).
- `S/references/structure/phase-definitions.md:255`: an archived phase counts when a new phase is numbered (P2).
- `S/README.md:639`: status 3 in the relocation summary (P2).
- `S/runtime/cli/spec/README.md:120`: an untracked packet stopped before the ledger step is refused with the move back, not finished by a rerun (F5).
- `S/changelog/v2.13.1.0.md` and `S/SKILL.md` version: one entry for phases 006 to 013 (P2).
- `../006-relocate-resume-and-preflight/implementation-summary.md`: the untracked-stop limitation (F5).
- `tasks.md` of phases 006 to 010: Verify clauses that name files never written point at the evidence that exists (F7).
- `../decision-record.md:13`: the continuity line names Q010 to Q015 (F9).
- `../goal-file-manifest.txt`: add `S/graph-metadata.json`, `scorer-eval-baseline.json` and `skill-graph.json`, then review the phase 009 routing change (F8).

### Out of Scope
- Root `README.md`, `AGENTS.md`, `.env.example` and `references/workflows/worked-examples.md`, which both reviews found current.
- Re-opening decision Q014. B8 stays an accepted miss unless the routing review finds a new defect.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `S/SKILL.md` | Modify | Next-number command, script list, version |
| `S/references/retrieval/retrieval-conventions.md` | Modify | `archivedPaths` |
| `S/references/structure/folder-structure.md` | Modify | Fourth no-map case |
| `S/references/structure/phase-definitions.md` | Modify | Archived phases in numbering |
| `S/runtime/cli/spec/README.md` | Modify | `archive.sh` row, untracked-stop limit |
| `S/README.md` | Modify | Status 3 |
| `S/changelog/v2.13.1.0.md` | Create | Release entry for phases 006 to 013 |
| `../006-*/implementation-summary.md`, `../00[6-9]-*/tasks.md`, `../010-*/tasks.md` | Modify | Known limitation, Verify clauses |
| `../decision-record.md`, `../goal-file-manifest.txt` | Modify | Continuity line, manifest entries |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one.

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `SKILL.md` publishes a next-number command whose answer counts archived packets per root, the rule at `create.sh:1637-1661`. `create.sh` has no print-only flag, and without a track it also counts numbered branches, so the published command names the root it reads | In a `mktemp` copy with `specs/demo/001-a` live and `specs/demo/z_archive/008-b` archived, the published command run for `specs/demo` prints `9` or `009`, matching the number `create.sh --track demo --skip-branch` gives |
| REQ-002 | The retrieval reference, the structure reference and the command README state `archivedPaths`, the fourth no-map case, the mixed-track restore refusal and status 3 on the `archive.sh` row | `rg -n 'archivedPaths' S/references/retrieval/retrieval-conventions.md` prints a line, `rg -n 'four cases' S/references/structure/folder-structure.md` prints a line, and `rg -n '^\| `archive.sh`.*flat packets' S/runtime/cli/spec/README.md` and `rg -n '^\| `archive.sh`.*(status 3|exits? 3)' S/runtime/cli/spec/README.md` each print a line |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | `SKILL.md`'s script list, the phase reference and the skill README's relocation summary match the shipped tools | `rg -c 'relocate.mjs|suggest-subtracks.mjs' S/SKILL.md` grows by the script-list rows, `rg -n 'z_archive' S/references/structure/phase-definitions.md` prints the numbering sentence, and a line of `S/README.md` that names `relocate.mjs` also names status 3. Line 162's `exit 3` is about `validate.sh` and does not count |
| REQ-004 | The command README and phase 006's summary state the untracked-stop limitation, and the README's `relocate.mjs` row states exit 3 as narrowed by phase 011 | Both files name the refusal and the move back to the source path, and `S/runtime/cli/spec/README.md:120` says 3 needs a `RESULT: FAILED` line |
| REQ-005 | A `v2.13.1.0` changelog entry covers phases 006 to 013, and `SKILL.md` carries that version | The entry passes the sk-create-changelog checks, and `sed -n '5p' S/SKILL.md` prints `version: 2.13.1.0` |
| REQ-006 | No Verify clause in phases 006 to 010 names a file that does not exist | For each `scratch/*.txt` name in those `tasks.md` files, `ls` finds the file, or the clause names the file that holds the evidence |
| REQ-007 | The decision record's continuity line names the highest operator decision id in its table | `sed -n '13p' ../decision-record.md` names the id that `rg -o '^\| Q[0-9]+' ../decision-record.md \| tail -1` prints |
| REQ-008 | The phase 009 routing change is reviewed and its verdict recorded | `../goal-file-manifest.txt` lists `S/graph-metadata.json`, `scorer-eval-baseline.json` and `skill-graph.json`, the three files commit `0701a31ae5` touched outside `specs/`. `scratch/routing-review.md` holds the diff of `0701a31ae5`, three `advisor_recommend` runs on archive-search and sub-track prompts with their top skill, and a verdict. A defect it finds is fixed here under `.skilled/repo-rules/skill-hub-routing.md` |
| REQ-009 | The changed skill documents pass the sk-doc skill, README and changelog checks | T014 runs `validate_document.py` and `check_changelog_shape.py`, the validators `sk-create-skill`, `sk-create-readme` and `sk-create-changelog` name, on each changed file, and each exits 0 |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every row of both reviews outside phases 011 and 012 is fixed or recorded, and each check in section 4 prints what it names.
- **SC-002**: Run after the last edit, `validate.sh` on the parent with `--strict --recursive` prints `RESULT: PASSED` 14 times. It already does at planning time, so it is a regression gate, not proof of the work.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Editing the `tasks.md` of Complete phases changes their validation | Med: a parent recursive run fails | Only Verify clauses change, and T014 runs the recursive validation |
| Risk | The routing review finds a defect that touches the advisor | Med: a scorer regression | The fix runs the advisor suite and `skill-hub-routing.md`'s per-hub gate before it lands |
| Dependency | Phases 011 and 012 | High: the changelog and READMEs describe their behavior | This phase starts after both are committed |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Answered by the plan verifier and the orchestrator: `create.sh` has no print-only flag, and its rule at lines 1637 to 1661 counts `<root>/*` and `<root>/z_archive/*`. The published line is a per-root `ls` of both, and adding a flag is out of scope.
<!-- /ANCHOR:questions -->

---
