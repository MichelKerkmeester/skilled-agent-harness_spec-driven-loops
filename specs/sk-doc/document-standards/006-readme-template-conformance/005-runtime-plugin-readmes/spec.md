---
title: "Feature Specification: Phase 5: runtime-plugin-readmes"
description: "The 8 READMEs of the folders runtimes load entries from use section sets of their own, and four of them fail the voice scan with 27 hard blockers. This phase brings them to the runtime plugin template with every entry checked against the folder."
trigger_phrases:
  - "runtime plugin readmes"
  - "phase 5 runtime plugin readmes"
  - "plugin extension readme"
  - "hook mirror readme"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 5: runtime-plugin-readmes

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
| **Phase** | 5 of 7 |
| **Predecessor** | 004-hook-runtime-readmes |
| **Successor** | 006-runtime-folder-readmes |
| **Handoff Criteria** | All 8 plugin and mirror READMEs validate and scan with 0 hard voice blockers |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the README template conformance specification.

**Scope Boundary**: `.pi/extensions/README.md`, `.opencode/plugins/README.md`, `.dsh/plugins/repo-guards/README.md`, `.vibe/plugins/README.md` and the README in each of `.claude/hooks/`, `.codex/hooks/`, `.cursor/hooks/` and `.devin/hooks/`. Runtime folder roots and their `SYNC.md` belong to phase 006.

**Dependencies**:
- `.skilled/skills/sk-doc/sk-create-readme/assets/runtime-plugin-readme-template.md`
- Phase 004, so the adapter READMEs these entries point at are settled
- `goal-doc-contract.test.cjs`, which reads the OpenCode plugins README

**Deliverables**:
- 8 READMEs that follow the runtime plugin template
- A before and after baseline per file
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
These folders are where a runtime picks up the repository's hooks and plugins, and their READMEs tell a maintainer which entry is a link, a re-export or a real plugin. None of the 8 uses the runtime plugin template's section list. The four hook mirror READMEs share an ENTRYPOINT BEHAVIOR and INVENTORY shape of their own, and `.opencode/plugins/README.md` carries twelve H2 sections. Four fail the voice scan, with 27 hard blockers between them, and `.pi/extensions/README.md` alone carries 19.

### Purpose
Each of the 8 READMEs follows the runtime plugin template, passes the validator and the voice scan with zero hard blockers, and maps every entry to its real file as the folder shows it.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The list is fixed by the parent spec. `baseline.sh` and `h2model.py` are the scratchpad checks named in `plan.md`.

```text
$ bash baseline.sh $(cat r005.txt) | cut -f1,2,4,5
.pi/extensions/README.md	lines=201	hard=19	ceil=3/100
.opencode/plugins/README.md	lines=255	hard=3	ceil=83/100
.dsh/plugins/repo-guards/README.md	lines=171	hard=4	ceil=78/100
.vibe/plugins/README.md	lines=176	hard=0	ceil=100/100
.claude/hooks/README.md	lines=77	hard=0	ceil=98/100
.codex/hooks/README.md	lines=65	hard=0	ceil=98/100
.cursor/hooks/README.md	lines=69	hard=1	ceil=92/100
.devin/hooks/README.md	lines=62	hard=0	ceil=99/100

$ python3 h2model.py "OVERVIEW,ARCHITECTURE,DIRECTORY TREE,ENTRY MAP,BOUNDARIES AND FLOW,CONFIGURATION,VALIDATION,RELATED" $(cat r005.txt) | cut -f1 | sort | uniq -c
   8 DIFF

$ python3 readme_links.py . $(cat r005.txt)
checked 49 outbound and 0 inbound anchored links across 8 files, 0 problems

$ node --test .opencode/plugins/tests/goal-doc-contract.test.cjs
ℹ pass 5
```

All 8 print `✅ VALID` and none has an emoji in a heading.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bring each of the 8 READMEs to the runtime plugin template, with an ENTRY MAP row for every entry in the folder.
- Say for each entry whether it is a link, a one-line re-export, a thin adapter or a full plugin, checked on disk.
- Clear the 27 hard voice blockers in the four files that carry them.
- Check every path, event and switch against the folder, the runtime config and the cores the entries call.

### Out of Scope
- Runtime folder READMEs and `SYNC.md` files. Phase 006 owns them.
- The entries, adapters and runtime configs themselves. A defect found there is recorded, not fixed.
- Hand edits to README versions and changelog entries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/README.md` | Modify | Bring to the template, 19 hard blockers to clear |
| `.opencode/plugins/README.md` | Modify | Bring to the template, 3 hard blockers to clear, keep live goal switch names |
| `.dsh/plugins/repo-guards/README.md` | Modify | Bring to the template, 4 hard blockers to clear |
| `.vibe/plugins/README.md` | Modify | Bring to the template, keeping its PLUGIN MAP |
| `.claude/hooks/README.md`, `.codex/hooks/README.md`, `.cursor/hooks/README.md`, `.devin/hooks/README.md` | Modify | Bring to the template, 1 hard blocker to clear |
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
| REQ-001 | Each of the 8 READMEs opens with an H1 naming the runtime and its entries, and every H2 is numbered, ALL CAPS, named in the template's section model and preceded by `---`. |
| REQ-002 | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` for each of the 8 files. |
| REQ-003 | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0` for each of the 8 files. |
| REQ-004 | Every relative link in the 8 files resolves, and every link elsewhere in the repository that points into one of them with an anchor still resolves. |
| REQ-005 | Every path, command, count and list a README states matches the code it describes, checked by a session that did not write that README. |
| REQ-006 | The tests that read these READMEs still pass: the goal doc contract test, the README verdict parity test and the sk-doc script suite. |

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

- **SC-001**: The baseline script prints `✅ VALID` and `hard=0` for all 8 files, and `h2model.py` prints EXACT or SUBSET for each.
- **SC-002**: The link checker reports 0 problems for links into and out of the 8 files.
- **SC-003**: The goal doc contract test, the verdict parity test and the sk-doc suite pass, and the phase is pushed with `validate.sh --strict` printing `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The runtime plugin template and the two sk-doc scripts | A template change mid-phase would move the target | Read the template once at Setup and treat that read as the contract for the phase |
| Risk | A rewrite drops a fact a reader relied on, or states one the code does not support | High | A session that did not write the README checks it against the code before the phase closes |
| Risk | An entry map row calls a link a plugin, so a maintainer edits a file that changes nothing | High | The reviewer runs `ls -l` on the folder and checks each row's kind |
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
- Maximum input: `.opencode/plugins/README.md` holds 255 lines and twelve sections. It keeps the entry map and links to the plugin tests for the rest.
- Failure path: a claim the session cannot confirm from the code is dropped, never kept on trust.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | 8 files, 1,076 lines |
| Risk | 6/25 | One test reads goal switch names from one file |
| Research | 12/20 | Every entry needs a check against the folder and the runtime config |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
