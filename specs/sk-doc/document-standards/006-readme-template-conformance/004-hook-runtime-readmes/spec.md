---
title: "Feature Specification: Phase 4: hook-runtime-readmes"
description: "44 of the 47 runtime adapter READMEs name their file section FILES where the runtime folder scaffold says DIRECTORY TREE, and 13 have no VALIDATION section. This phase brings all 47 to the scaffold with each event, registration and failure line checked against the adapter."
trigger_phrases:
  - "hook runtime readmes"
  - "phase 4 hook runtime readmes"
  - "runtime adapter readme"
  - "rewrite runtime adapter readmes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 4: hook-runtime-readmes

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
| **Phase** | 4 of 7 |
| **Predecessor** | 003-hook-folder-readmes |
| **Successor** | 005-runtime-plugin-readmes |
| **Handoff Criteria** | All 47 runtime adapter READMEs validate, scan with 0 hard voice blockers, and each names its real registration file |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 4** of the README template conformance specification.

**Scope Boundary**: The 47 `.skilled/hooks/<name>/<runtime>/README.md` files for the claude, codex, cursor, devin, dsh, pi and vibe runtime folders. Hook folder READMEs one level up belong to phase 003, and `lib/`, `tests/` and `bin/` READMEs belong to phase 007.

**Dependencies**:
- The runtime folder scaffold in section 5 of `.skilled/skills/sk-doc/sk-create-readme/assets/hook-readme-template.md`
- Phase 003, so the hook folder READMEs these files link up to are settled

**Deliverables**:
- 47 runtime adapter READMEs that follow the runtime folder scaffold
- A before and after baseline per file
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A runtime adapter README tells a maintainer how one runtime runs one concern: the event, the file that registers the adapter and how it fails. All 47 pass the validator and the voice scan, but 44 differ from the runtime folder scaffold. 31 use OVERVIEW, FILES, VALIDATION and RELATED, 13 drop VALIDATION as well, and only 3 match. Their event names and registration files were written when each adapter landed and were never checked again.

### Purpose
Each of the 47 runtime adapter READMEs follows the runtime folder scaffold, passes the validator and the voice scan with zero hard blockers, and names the event, registration file and failure behavior the code confirms.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The list comes from `git ls-files`, so it can be rerun at implement time. `baseline.sh` and `h2model.py` are the scratchpad checks named in `plan.md`.

```text
$ git ls-files '.skilled/hooks/**README.md' | awk -F/ 'NF==5' | grep -E '/(pi|dsh|devin|claude|cursor|codex|vibe)/README.md$' | sed 's#.*/\([a-z]*\)/README.md#\1#' | sort | uniq -c
   8 claude
   5 codex
   5 cursor
   8 devin
   9 dsh
   9 pi
   3 vibe

$ bash baseline.sh $(cat r004.txt) | awk -F'\t' '{split($4,a,"=");h+=a[2]; if(a[2]>0)n++; split($2,b,"=");l+=b[2]} END{print "files="NR, "lines="l, "hard_sum="h, "files_with_hard="n+0}'
files=47 lines=2639 hard_sum=0 files_with_hard=0

$ python3 h2model.py "OVERVIEW,DIRECTORY TREE,VALIDATION,RELATED" $(cat r004.txt) | cut -f4 | sort | uniq -c | sort -rn
  31 OVERVIEW / FILES / VALIDATION / RELATED
  13 OVERVIEW / FILES / RELATED
   3 OVERVIEW / DIRECTORY TREE / VALIDATION / RELATED

$ for d in $(cat r004.txt); do find $(dirname $d) -mindepth 1 -maxdepth 1 -type d | wc -l; done | sort | uniq -c
  44 0
   3 1

$ python3 readme_links.py . $(cat r004.txt)
checked 192 outbound and 0 inbound anchored links across 47 files, 0 problems

$ node .skilled/commands/doctor/scripts/hook-wiring-check.cjs --root .
ok claude
ok codex
ok cursor
ok devin
```

All 47 print `✅ VALID` with `hard=0` and no emoji heading, so this phase's work is the section model and the fact check. 44 of the 47 folders are flat.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bring each of the 47 READMEs to the runtime folder scaffold: OVERVIEW, DIRECTORY TREE, VALIDATION and RELATED.
- Rename each FILES section to DIRECTORY TREE, keeping a file table that names every file in a flat folder.
- Add VALIDATION where the adapter has a test or a smoke command, with the command run and its result stated.
- Check each event, registration file, switch and failure line against the adapter and its registration.

### Out of Scope
- Hook folder READMEs. Phase 003 owns them.
- Code folder READMEs such as `lib/` and `tests/`. Phase 007 owns them.
- Adapters and registration files. A defect found there is recorded, not fixed.
- Hand edits to README versions and changelog entries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/hooks/<name>/claude/README.md` (8) | Modify | Bring to the runtime folder scaffold |
| `.skilled/hooks/<name>/codex/README.md` (5) | Modify | Bring to the runtime folder scaffold |
| `.skilled/hooks/<name>/cursor/README.md` (5) | Modify | Bring to the runtime folder scaffold |
| `.skilled/hooks/<name>/devin/README.md` (8) | Modify | Bring to the runtime folder scaffold |
| `.skilled/hooks/<name>/dsh/README.md` (9) | Modify | Bring to the runtime folder scaffold |
| `.skilled/hooks/<name>/pi/README.md` (9) | Modify | Bring to the runtime folder scaffold |
| `.skilled/hooks/<name>/vibe/README.md` (3) | Modify | Bring to the runtime folder scaffold |
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
| REQ-001 | Each of the 47 READMEs opens with an H1 naming the runtime, the concern and the event, and every H2 is numbered, ALL CAPS, one of OVERVIEW, DIRECTORY TREE, VALIDATION and RELATED, and preceded by `---`. |
| REQ-002 | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` for each of the 47 files. |
| REQ-003 | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0` for each of the 47 files. |
| REQ-004 | Every relative link in the 47 files resolves, and every link elsewhere in the repository that points into one of them with an anchor still resolves. |
| REQ-005 | Every path, command, count and list a README states matches the code it describes, checked by a session that did not write that README. |
| REQ-006 | The tests that read these READMEs still pass: the hook wiring check, the README verdict parity test and the sk-doc script suite. |

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

- **SC-001**: The baseline script prints `✅ VALID` and `hard=0` for all 47 files, and `h2model.py` prints EXACT or SUBSET for each.
- **SC-002**: The link checker reports 0 problems for links into and out of the 47 files.
- **SC-003**: The hook wiring check, the verdict parity test and the sk-doc suite pass, and the phase is pushed with `validate.sh --strict` printing `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The runtime folder scaffold and the two sk-doc scripts | A template change mid-phase would move the target | Read the template once at Setup and treat that read as the contract for the phase |
| Risk | A rewrite drops a fact a reader relied on, or states one the code does not support | High | A session that did not write the README checks it against the code before the phase closes |
| Risk | A README names a registration file or event that changed | High | The reviewer opens the runtime's registration file for every README |
| Risk | A file table misses a file in the folder | Med | The reviewer lists the folder and compares |
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
- Maximum input: The longest adapter README, `session-lifecycle/vibe/README.md`, holds 119 lines. It keeps the adapter's behavior and links to the hook folder README for the concern.
- Failure path: a claim the session cannot confirm from the code is dropped, never kept on trust.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 14/25 | 47 short files, 2,639 lines |
| Risk | 5/25 | No test reads these READMEs |
| Research | 12/20 | Each README needs a check against its adapter and registration file |
| **Total** | **31/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The scaffold keeps the DIRECTORY TREE heading for flat folders, holding the file table alone.
<!-- /ANCHOR:questions -->

---
