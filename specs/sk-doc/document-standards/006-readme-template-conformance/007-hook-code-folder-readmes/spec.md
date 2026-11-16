---
title: "Feature Specification: Phase 7: hook-code-folder-readmes"
description: "The 30 hook code folder READMEs, the shared folder README and the hooks library README pass the voice scan but mostly name their file section in their own way and were never checked against the folders. This phase brings all 32 to the code-folder template, the library README last."
trigger_phrases:
  - "hook code folder readmes"
  - "phase 7 hook code folder readmes"
  - "hooks library readme"
  - "code folder readme template"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 7: hook-code-folder-readmes

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
| **Phase** | 7 of 7 |
| **Predecessor** | 006-runtime-folder-readmes |
| **Successor** | None |
| **Handoff Criteria** | All 32 code folder READMEs validate and scan with 0 hard voice blockers, and the program's recursive validation passes |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 7** of the README template conformance specification.

**Scope Boundary**: The `lib/`, `tests/`, `bin/`, `history/` and `session-readers/` READMEs inside `.skilled/hooks/`, the session handover `tests/fixtures/` README, `.skilled/hooks/shared/README.md` and `.skilled/hooks/README.md`. Code folder READMEs outside `.skilled/hooks/` are out of the program.

**Dependencies**:
- `.skilled/skills/sk-doc/sk-create-readme/assets/readme-code-template.md`
- Phase 006, pushed to origin/main
- `runtime-refusal.test.mjs`, which reads the coverage matrix of `.skilled/hooks/README.md`

**Deliverables**:
- 32 code folder READMEs that follow the code-folder template
- A before and after baseline per file
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A code folder README orients a developer before they open the source. These 32 pass the validator and the voice scan, but only a few use the code-folder template's section names: 26 use a FILES section and some drop VALIDATION, and the session handover `history/` README carries eleven sections of its own. Their file tables were written when each folder was created and were never compared with the folder since. The hooks library README holds the switch index and the coverage matrix a test reads.

### Purpose
Each of the 32 READMEs follows the code-folder template, passes the validator and the voice scan with zero hard blockers, and lists only files, exports and commands the folder confirms.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The list comes from `git ls-files`, so it can be rerun at implement time. The validator skips fixture trees, so the fixtures README is checked with `--no-exclude`.

```text
$ { git ls-files '.skilled/hooks/**README.md' | awk -F/ 'NF==5 || NF==6' | grep -vE '/(pi|dsh|devin|claude|cursor|codex|vibe)/README.md$'; echo .skilled/hooks/shared/README.md; echo .skilled/hooks/README.md; } | wc -l
32

$ bash baseline.sh $(cat r007.txt) | awk -F'\t' '{split($4,a,"=");h+=a[2]; if(a[2]>0)n++; split($2,b,"=");l+=b[2]} END{print "files="NR, "lines="l, "hard_sum="h, "files_with_hard="n+0}'
files=32 lines=2811 hard_sum=0 files_with_hard=0

$ python3 validate_document.py .skilled/hooks/session-handover/tests/fixtures/README.md
⏭️  SKIPPED: .skilled/hooks/session-handover/tests/fixtures/README.md

$ python3 validate_document.py --no-exclude .skilled/hooks/session-handover/tests/fixtures/README.md
✅ VALID: .skilled/hooks/session-handover/tests/fixtures/README.md

$ python3 h2model.py "OVERVIEW,ARCHITECTURE,PACKAGE TOPOLOGY,DIRECTORY TREE,KEY FILES,BOUNDARIES AND FLOW,ENTRYPOINTS,VALIDATION,RELATED" $(cat r007.txt) | cut -f4 | sort | uniq -c | sort -rn
  24 OVERVIEW / FILES / VALIDATION / RELATED
   2 OVERVIEW / FILES / RELATED
   2 OVERVIEW / DIRECTORY TREE / VALIDATION / RELATED
   1 OVERVIEW / HOW IT WORKS / DIRECTORY TREE / KEY FILES / CONFIGURATION / VALIDATION / RELATED
   1 OVERVIEW / DIRECTORY TREE / FILES / VALIDATION / RELATED
   1 OVERVIEW / CORE PLACEMENT / DIRECTORY TREE / KEY FILES / BOUNDARIES AND FLOW / VALIDATION / COVERAGE MATRIX / RELATED
   1 OVERVIEW / CONTRACT / FILES / THE FOUR OPERATIONS / PUBLIC PROJECTION / BUDGET AND HANDLES / CLI / FAIL-OPEN MAPPING / EXAMPLE / VALIDATION / RELATED

$ python3 readme_links.py . $(cat r007.txt)
checked 140 outbound and 2 inbound anchored links across 32 files, 0 problems

$ node --test .skilled/hooks/decision-capture/bin/runtime-refusal.test.mjs
ℹ pass 6
```

The template lets a flat folder use a complete FILES table in place of a directory tree, so the 26 FILES files need only a fact check of the table when their folder is flat.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bring each of the 32 READMEs to the code-folder template, keeping a FILES table where the folder is flat.
- Check every file table against a listing of the folder, and every export and command against the code.
- Rewrite the hooks library README last, keeping its switch index and the coverage matrix the refusal test reads.
- Rebuild the README verdict baseline and the trigger index as needed.

### Out of Scope
- Code folder READMEs outside `.skilled/hooks/`, as the parent spec rules.
- The code in these folders. A defect found there is recorded, not fixed.
- Hand edits to README versions and changelog entries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/<name>/lib/README.md` (9) | Modify | Bring to the code-folder template |
| `.skilled/hooks/<name>/tests/README.md` (15) | Modify | Bring to the code-folder template |
| `.skilled/hooks/<name>/bin/README.md` (3) | Modify | Bring to the code-folder template |
| `.skilled/hooks/session-handover/history/README.md`, `.skilled/hooks/session-handover/tests/fixtures/README.md`, `.skilled/hooks/shared/session-readers/README.md` | Modify | Bring to the code-folder template |
| `.skilled/hooks/shared/README.md` | Modify | Bring to the code-folder template |
| `.skilled/hooks/README.md` | Modify | Rewritten last, keeping the switch index and the coverage matrix |
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
| REQ-001 | Each of the 32 READMEs opens with an H1 naming the folder and its responsibility, and every H2 is numbered, ALL CAPS, named in the code-folder scaffold or the FILES table name, and preceded by `---`. |
| REQ-002 | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` for each of the 32 files. |
| REQ-003 | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0` for each of the 32 files. |
| REQ-004 | Every relative link in the 32 files resolves, and every link elsewhere in the repository that points into one of them with an anchor still resolves. |
| REQ-005 | Every path, command, count and list a README states matches the code it describes, checked by a session that did not write that README. |
| REQ-006 | The tests that read these READMEs still pass: the runtime refusal test, the README verdict parity test and the sk-doc script suite. |

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

- **SC-001**: The baseline script prints `✅ VALID` and `hard=0` for all 32 files, the fixtures one with `--no-exclude`, and `h2model.py` prints EXACT or SUBSET for each.
- **SC-002**: The link checker reports 0 problems for links into and out of the 32 files.
- **SC-003**: The runtime refusal test, the verdict parity test and the sk-doc suite pass, `validate.sh --recursive --strict` passes on the program, and the phase is pushed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The code-folder template and the two sk-doc scripts | A template change mid-phase would move the target | Read the template once at Setup and treat that read as the contract for the phase |
| Risk | A rewrite drops a fact a reader relied on, or states one the code does not support | High | A session that did not write the README checks it against the code before the phase closes |
| Risk | The hooks library rewrite breaks the coverage matrix the refusal test reads | High | The brief pins the header and the cell vocabulary, and the test runs before commit |
| Risk | A file table misses a file | Med | The reviewer lists each folder and compares |
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
- Maximum input: `.skilled/hooks/README.md` holds 439 lines with the switch index and the coverage matrix. It keeps both and links to the hook folders for the rest.
- Failure path: a claim the session cannot confirm from the code is dropped, never kept on trust.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 32 files, 2,811 lines |
| Risk | 7/25 | One test reads the library coverage matrix |
| Research | 12/20 | Every file table needs a listing and every export a check |
| **Total** | **33/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
