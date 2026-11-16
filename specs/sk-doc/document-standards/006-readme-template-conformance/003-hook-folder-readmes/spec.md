---
title: "Feature Specification: Phase 3: hook-folder-readmes"
description: "The 26 hook folder READMEs mostly carry the hook template's section list already, but their runtime coverage rows were never checked against the adapters and registration files. One README, reached through a symlink, uses a section set of its own. This phase brings all 26 to the folder scaffold with every runtime row checked."
trigger_phrases:
  - "hook folder readmes"
  - "phase 3 hook folder readmes"
  - "hook readme runtime coverage"
  - "rewrite hook folder readmes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: hook-folder-readmes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 7 |
| **Predecessor** | 002-mode-packet-readmes |
| **Successor** | 004-hook-runtime-readmes |
| **Handoff Criteria** | All 26 hook folder READMEs validate, scan with 0 hard voice blockers, and each coverage table matches the adapters on disk |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the README template conformance specification.

**Scope Boundary**: The 26 `.skilled/hooks/<name>/README.md` files. `.skilled/hooks/shared/README.md` and the hooks library README use the code-folder template and belong to phase 007. Runtime adapter READMEs one level down belong to phase 004.

**Dependencies**:
- The hook folder scaffold in `.skilled/skills/sk-doc/sk-create-readme/assets/hook-readme-template.md`, and the validator and voice scanner under `.skilled/skills/sk-doc/`
- Phase 002, pushed to origin/main
- `goal-doc-contract.test.cjs`, `completion-evidence-sentinel.vitest.ts`, `advisor-runtime-list-parity.vitest.ts` and `git-setup-check.test.cjs`, which read text from four of these READMEs

**Deliverables**:
- 26 hook folder READMEs that follow the folder scaffold, with a checked runtime row for each of the eight runtimes
- A before and after baseline per file
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A hook folder README tells a maintainer which runtimes run a concern and where each adapter really lives. 24 of the 26 already carry the folder scaffold's section list, but nobody has checked their runtime coverage rows against the adapters and the files that register them since adapters moved between runtimes. `session-handover` carries one hard voice blocker. Four READMEs are symlinks: `git-preflight` and `git-message-gate` share the sk-git hooks README, `spec-gate` points into the spec-kit runtime, and `skill-advisor` points at `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, which uses a section set of its own.

### Purpose
Each of the 26 hook folder READMEs follows the hook template's folder scaffold, passes the validator and the voice scan with zero hard blockers, and states only runtime rows, paths and switches the code confirms.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The list comes from `git ls-files`, so it can be rerun at implement time. `baseline.sh` and `h2model.py` are the scratchpad checks named in `plan.md`. The link check runs on each symlink's real path, because a symlinked README's relative links resolve from its target folder.

```text
$ git ls-files '.skilled/hooks/**README.md' | awk -F/ 'NF==4' | grep -v '^.skilled/hooks/shared/README.md$' | wc -l
26

$ bash baseline.sh $(cat r003.txt) | awk -F'\t' '{split($4,a,"=");h+=a[2]; if(a[2]>0)n++; split($2,b,"=");l+=b[2]} END{print "files="NR, "lines="l, "hard_sum="h, "files_with_hard="n+0}'
files=26 lines=5640 hard_sum=1 files_with_hard=1

$ grep -v 'hard=0' baseline-003-before.tsv | cut -f1,4,5
.skilled/hooks/session-handover/README.md	hard=1	ceil=95/100

$ python3 h2model.py "OVERVIEW,HOW IT WORKS,RUNTIME COVERAGE,DIRECTORY TREE,KEY FILES,CONFIGURATION,VALIDATION,RELATED" $(cat r003.txt) | grep -v EXACT | cut -f1,3,4
DIFF	.skilled/hooks/session-handover/README.md	OVERVIEW / QUICK START / RUNTIME COVERAGE / DIRECTORY TREE / KEY FILES / CONFIGURATION / VALIDATION / RELATED
DIFF	.skilled/hooks/skill-advisor/README.md	OVERVIEW / WHAT IT DOES / PER-RUNTIME DELIVERY / DIRECTORY TREE / KEY FILES / CONFIGURATION / BOUNDARIES AND FLOW / VALIDATION / RELATED

$ find .skilled/hooks -maxdepth 2 -name README.md -type l
.skilled/hooks/spec-gate/README.md
.skilled/hooks/git-message-gate/README.md
.skilled/hooks/skill-advisor/README.md
.skilled/hooks/git-preflight/README.md

$ python3 readme_links.py . <the 26 files, each at its real path>
checked 164 outbound and 0 inbound anchored links across 26 files, 0 problems
```

All 26 print `✅ VALID` and none has an emoji in a heading. The template names session handover's QUICK START as an allowed replacement for HOW IT WORKS, so that file differs only by its blocker.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bring each of the 26 READMEs to the folder scaffold, keeping the section list where it already matches.
- Check every RUNTIME COVERAGE row against the adapter on disk and the file that registers it, for all eight runtimes, and correct or drop what does not hold.
- Rewrite the skill advisor hook doc at its symlink target to the folder scaffold, as the operator chose, keeping the bold runtime rows a test reads.
- Clear the one hard voice blocker in the session handover README.
- Rebuild the README verdict baseline for the files whose verdict changes, and the trigger index when `trigger_phrases` change.

### Out of Scope
- Runtime adapter READMEs in `<name>/<runtime>/`. Phase 004 owns them.
- `.skilled/hooks/shared/README.md`, the hooks library README and the code folder READMEs. Phase 007 owns them.
- Adapters, registration files and every other non-README file. A defect found there is recorded, not fixed.
- Hand edits to README versions and changelog entries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/<name>/README.md` (22 real files) | Modify | Bring to the folder scaffold and check every runtime row |
| `.skilled/skills/sk-git/scripts/hooks/README.md` | Modify | Target of the git-preflight and git-message-gate links. Already on the scaffold, fact-checked in place |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/README.md` | Modify | Target of the spec-gate link. Already on the scaffold, fact-checked in place |
| `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md` | Modify | Target of the skill-advisor link. Rewritten to the folder scaffold |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Generated. Rebuilt for the entries whose verdict changes |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and its three retrieval fixtures | Modify | Generated. Rebuilt when `trigger_phrases` change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the 26 READMEs opens with an H1 that names the concern, and every H2 is numbered, ALL CAPS, named in the folder scaffold's section model and preceded by `---`. RUNTIME COVERAGE has one row for each of the eight runtimes. |
| REQ-002 | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` for each of the 26 files. |
| REQ-003 | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0` for each of the 26 files. |
| REQ-004 | Every relative link in the 26 files resolves, and every link elsewhere in the repository that points into one of them with an anchor still resolves. |
| REQ-005 | Every path, command, count and list a README states matches the code it describes, checked by a session that did not write that README. |
| REQ-006 | The tests that read these READMEs still pass: the goal doc contract test, the completion evidence sentinel, the advisor runtime list parity test and the git setup check test, the README verdict parity test and the sk-doc script suite. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-007 | Each command a README shows is followed by its expected output, as the template's checklist asks. |
| REQ-008 | No rewritten README's mechanical voice ceiling ends lower than its baseline. |
| REQ-009 | `implementation-summary.md` records the before and after validator, voice and link results for every file. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The baseline script prints `✅ VALID` and `hard=0` for all 26 files, and `h2model.py` prints EXACT for each, or DIFF only where QUICK START replaces HOW IT WORKS.
- **SC-002**: The link checker reports 0 problems for all 26 files at their real paths.
- **SC-003**: The four consumer tests, the verdict parity test and the sk-doc suite pass, and the phase is pushed with `validate.sh --strict` printing `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The hook folder scaffold and the two sk-doc scripts | A template change mid-phase would move the target | Read the template once at Setup and treat that read as the contract for the phase |
| Risk | A rewrite drops a fact a reader relied on, or states one the code does not support | High | A session that did not write the README checks it against the code before the phase closes |
| Risk | A runtime row names an adapter or registration that moved | High | The reviewer opens each runtime's registration file and the adapter for every covered row |
| Risk | Editing a symlink target breaks a reader of that target, such as the section 3 citation in `git-setup-check.cjs` | Med | The sk-git hooks README keeps its registration steps in section 3, and `git-setup-check.test.cjs` runs before commit |
| Risk | Parallel sessions edit the same file | Med | Each session owns one README and edits nothing else |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: this phase changes documentation only and runs no service, so it has no performance, security or reliability limit to state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a template section with no real content for a folder is left out and the rest renumbered, never filled with a placeholder.
- Maximum input: `skill-advisor-hook.md` holds 301 lines and is the one full rewrite. It keeps the bold runtime rows and links to the skill's references for detail.
- Failure path: a claim the session cannot confirm from the code is dropped, never kept on trust.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 26 files, 5,640 lines, one full rewrite |
| Risk | 8/25 | Four tests read text from four of these READMEs, and four files are symlinks |
| Research | 14/20 | Every runtime row needs a check against an adapter and a registration file |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator chose to rewrite the skill advisor hook doc at its symlink target.
<!-- /ANCHOR:questions -->

---
