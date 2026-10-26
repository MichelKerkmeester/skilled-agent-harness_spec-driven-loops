---
title: "Feature Specification: CI efficiency release docs"
description: "Release records and doc fixes for the CI workflow-efficiency program, the operator-private surface skill work and their companions, so the changelogs, READMEs and the root README describe what main ships."
trigger_phrases:
  - "ci efficiency release docs"
  - "ci workflow efficiency changelogs"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.3 -->
# Feature Specification: CI efficiency release docs

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-25 |
| **Branch** | `worktrees/218-ci-efficiency-build` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The CI workflow-efficiency program (`specs/system-speckit/053-ci-workflow-efficiency`), the private surface skill work (`specs/sk-code/013-private-surface-skills`) and their companions reached main without changelog entries for eleven touched skills and modes. Several READMEs, feature catalogs, playbooks and the root README still describe the removed Webflow and Obsidian surfaces, or leave out `/doctor:ci`, the command that reports and toggles the CI switches.

### Purpose
Each touched skill and mode gets a changelog entry at its decided version, and each doc that describes the changed surfaces matches main.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Write eleven changelog entries, one for each touched skill or mode, at the decided versions.
- Move the version carriers of each bumped skill to its decided version: the `.skilled` carriers, the `.hermes/skills/` mirrors and, for the two hubs whose `hub-router.json` changes, the re-minted activation manifest.
- Apply the audit's 49 doc-fix items at their current lines, or record each one as rejected with a reason.
- Add `/doctor:ci` to the root README DOCTOR section and to the doctor catalogs that describe the routers.
- Check that every skill and mode changelog folder stays linked under `.skilled/changelog`.

### Out of Scope
- The framework release note under `.skilled/changelog/skilled/`, including that folder's README. Reason: the operator names the release note at release time, and open question 2 asks whether this work joins it.
- Released changelog entries. Reason: a released entry is history, so a false claim in one is corrected in the new entry.
- Trigger-index and retrieval fixtures that hold version strings. Reason: the index rebuild regenerates them.
- Files under `specs/hooks/023-session-relaunch-loop/`. Reason: another session owns them.
- The name of the operator-private skill in any public file. Reason: privacy. Open question 3 covers the existing entry that already names it.
- Audit notes that point outside the touched skills, such as the missing `surfaceDetection` step in the create-skill-parent scaffold. Reason: each needs its own decision (open question 4).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/sk-code/` hub, `sk-code-skilled/`, `sk-code-review/`, `sk-code-ci/`, `sk-code-quality/` | Create, Modify | Five changelog entries at 3.0.0.0, 2.0.1.0, 1.8.0.0, 1.1.0.0 and 1.4.1.0, their version carriers, their `.hermes/skills/` mirrors, the sk-code activation manifest, and the sk-code doc fixes listed in tasks.md |
| `.skilled/skills/system-skill-advisor/` | Create, Modify | Entry at 0.17.0.0, its `SKILL.md` and Hermes mirror, the doctor routing page, the README and the private-skill containment page |
| `.skilled/skills/system-spec-kit/` and `.hermes/skills/system-spec-kit/SKILL.md` | Create, Modify | Entry at 2.9.2.0, its `SKILL.md`, the regenerated Hermes mirror, the Hermes README, `ARCHITECTURE.md` and the doctor catalog pages |
| `.skilled/skills/sk-doc/` hub, `sk-create-skill/`, `sk-create-command/` | Create, Modify | Entries at 2.3.13.0 (open question 1 answered, see deviation a in tasks.md), 1.5.6.0 and 1.0.5.0, their version carriers, their `.hermes/skills/` mirrors, the sk-doc activation manifest, and the sk-create-skill reference fixes |
| `.skilled/skills/sk-git/` | Create, Modify | Entry at 1.9.5.0, its `SKILL.md` and its Hermes mirror |
| `README.md`, `.skilled/commands/README.txt`, `.skilled/commands/doctor/assets/doctor-setup.yaml`, `.skilled/skills/README.txt`, `.github/workflows/README.md` | Modify | Root README DOCTOR section and switch notes, plus the catalog rows that list the doctor commands and the CI surface |
| `specs/system-speckit/055-ci-efficiency-release-docs/` | Modify | This packet's four documents |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Eleven changelog entries exist, one for each touched skill or mode, each a new `vX.md` file at its decided version. The sk-doc hub entry is 2.3.13.0, per open question 1, which is answered. |
| REQ-002 | Each bumped skill's version carriers state the decided version. No carrier outside a changelog folder keeps the old version, except generated fixtures. |
| REQ-003 | The root README DOCTOR section names `/doctor:ci`, and its intro reads "Eleven commands". |
| REQ-004 | Every skill and mode changelog folder stays linked under `.skilled/changelog`. Only the style-library bundle and the spec templates stay unlinked. |
| REQ-005 | `.skilled/changelog/skilled/` and every released changelog entry stay unmodified. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-006 | Each audit doc-fix item is applied at its current line, or recorded as rejected with a reason in tasks.md. |
| REQ-007 | `validate_document.py` exits 0 on each markdown file the work creates or edits, including this packet's four documents. |
| REQ-008 | The mirror sync, route validation and router-sync gates pass after the edits, as they did at baseline. |
| REQ-009 | Added lines contain no em dash, no concrete operator-private skill name and no private path. |
| REQ-010 | Each hub gets its own commit that touches only that hub's paths. The push waits for the operator's yes. |
| REQ-011 | The CI and doctor docs that the audit lists name `/doctor:ci`. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The version carrier sweep in tasks.md prints no old version outside changelog folders, and the eleven entry files exist.
- **SC-002**: The changelog link scan prints only the style-library bundle and the spec templates.
- **SC-003**: `rg -n '/doctor:ci' README.md` prints a line between the DOCTOR heading and the UTILITY heading.
- **SC-004**: The mirror sync, route validation and router-sync gates pass, and `validate_document.py` exits 0 on each edited file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Decided versions against origin/main | High: a decided number that main already holds would collide with a released entry. The sk-doc hub's 2.3.12.0 is already taken. | Check each target path before writing (tasks.md T002). Ask the operator before using any other number. |
| Dependency | `validate_document.py` in `.skilled/skills/sk-doc/shared/scripts/` | Med: a file that fails the validator cannot be committed. | Run it on each edited file and fix the finding at its source. |
| Risk | Concurrent writers in the same worktree | High: while this packet was written, dozens of files changed, some of them audit fixes and new entries from other writers. A commit can sweep in files another writer owns. | Stage only the hub's own paths, read `git status` before each commit, and never revert another writer's change. |
| Risk | An audit line moved since the audit ran | Med: a fix lands on the wrong text. | Re-grep the quoted phrase and edit the line that holds it. Example: the root-metadata sentence moved from line 121 to line 123. |
| Risk | A released entry states a false claim | Med: the release record stays wrong. | Correct the claim in the new entry, never in the released file. |
| Risk | The packet folder was untracked when the six commits were pushed, so the Message Contract check failed on the Spec trailer for each commit (run 40242193992, head cdd611f210) | High: the CI record stays red on the pushed head | Commit the packet folder before, or together with, the first commit whose Spec trailer cites it. The packet commit, pushed with the two follow-up commits, puts the folder on main. See deviation f in tasks.md. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

N/A: the packet ships markdown and version strings only. It runs no service, so no latency, security or uptime target applies.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Target number already taken: the work stops and asks the operator. It does not pick another number (open question 1).
- Maximum length: N/A. Each entry follows its own skill's newest entry, and only the sk-code hub entry uses the expanded major-release format.
- Invalid format: `validate_document.py` names the finding, and the fix goes into the file it names.

### Error Scenarios
- Concurrent write: another writer changed a file this packet also edits. Re-read the file, keep that change, and note the overlap in the commit.
- Gate fails after an edit: fix the file that drifted, then rerun the gate. The gate itself stays as it is.
- Audit line moved: re-grep the quoted phrase, then edit the line that holds it.

### State Transitions
- Partial completion: some hubs committed and others not. The packet lists which hubs are done, and the next commit waits for its own gates.
- Session expiry: N/A. The work lives in files, not in session state.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | About 60 files across seven skill and doc families, plus eleven new changelog entries. The level helper prints Level 2 for 900 lines and 60 files. |
| Risk | 10/25 | No runtime or code change. The risks are a version collision, a privacy leak and a wrong release record. |
| Research | 8/20 | The read-only audit traced the 49 doc-fix items. The remaining work re-reads each line before it edits. |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Open question 1, answered: the sk-doc hub entry is 2.3.13.0, not the decided 2.3.12.0. The released entry `.skilled/skills/sk-doc/changelog/v2.3.12.0.md` (added by commit `c301fa4bc7`) already holds 2.3.12.0, and the hub's `SKILL.md` already reads `version: 2.3.12.0`. 2.3.13.0 is the next free patch, and it records the redirect, allowlist and README-fixture changes that the 2.3.12.0 entry does not describe. Deviation a in tasks.md holds the detail.
- Open question 2: Does this work join the framework entry `v4.0.0.14.md` under `.skilled/changelog/skilled/`, or does it wait for a v4.0.0.15? A local tag named `v4.0.0.14` now exists, while the audit saw no tag and the request calls the entry unreleased. The operator decides, and this packet writes neither entry. Status at closure: left to the operator, because the framework note is named at release time. The framework folder stays unmodified (REQ-005), and the stale README edit is saved as a patch (deviation d in tasks.md).
- Open question 3: Should the operator-private skill's id come out of the public sk-code-quality v1.4.0.0 entry and out of two quality checklists? Released entries change only through a new entry, so the choice is a checklist edit or a leave-as-is decision.
- Open question 4: Should the create-skill-parent scaffold (`.skilled/commands/create/assets/create-skill-parent-auto.yaml`) gain a `surfaceDetection` step, so that a new surface gets the block that ranks it? The file sits outside this packet.
- Open question 5: Several docs carry an edition that lags their skill anchor. The audit reports the sk-code hub README at 2.2.19.0 against the hub's 2.4. Should such docs be re-derived only when this packet edits them, or in a separate sweep?
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Acceptance Criteria**: See `acceptance-criteria.md`
