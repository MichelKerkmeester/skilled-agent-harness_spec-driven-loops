---
title: "Feature Specification: Phase 6: runtime-folder-readmes"
description: "The 8 runtime SYNC manifests carry 91 hard voice blockers between them, and `.opencode/SYNC.md` uses section names of its own. `.vibe/` has no README. This phase brings the 7 runtime folder READMEs and 8 manifests to the runtime folder template and writes the Vibe README."
trigger_phrases:
  - "runtime folder readmes"
  - "phase 6 runtime folder readmes"
  - "sync manifest template"
  - "vibe readme"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 6: runtime-folder-readmes

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-16 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-runtime-plugin-readmes |
| **Successor** | 007-hook-code-folder-readmes |
| **Handoff Criteria** | All 16 runtime folder files validate and scan with 0 hard voice blockers, including the new `.vibe/README.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the README template conformance specification.

**Scope Boundary**: The `README.md` in `.claude/`, `.codex/`, `.cursor/`, `.devin/`, `.dsh/`, `.opencode/` and `.pi/`, the `SYNC.md` in those seven and in `.vibe/`, and a new `.vibe/README.md`. Plugin and hook mirror READMEs inside these folders belong to phase 005.

**Dependencies**:
- `.skilled/skills/sk-doc/sk-create-readme/assets/runtime-folder-template.md`
- Phase 005, so the plugin READMEs these files link to are settled
- `opencode-compat-layout.test.cjs`, which parses the inventory table of `.opencode/SYNC.md`

**Deliverables**:
- 7 runtime folder READMEs and 8 sync manifests that follow the template
- A new `.vibe/README.md`
- A before and after baseline per file
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each runtime folder has a README for a person setting it up and a `SYNC.md` that records what is generated, linked or authored and how drift is caught. The seven READMEs already carry the template's section list. The eight manifests carry 91 hard voice blockers between them: `.pi/SYNC.md` scores a mechanical ceiling of 0 and `.devin/SYNC.md` 17. `.opencode/SYNC.md` names its sections in its own way, and `.vibe/` has a manifest but no README.

### Purpose
Each runtime folder README and sync manifest follows its scaffold in the runtime folder template, passes the validator and the voice scan with zero hard blockers, and states only surfaces, commands and checks the folder confirms. `.vibe/README.md` exists.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The list is fixed by the parent spec. `baseline.sh` and `h2model.py` are the scratchpad checks named in `plan.md`. `validate_document.py` falls back to README rules for a `SYNC.md`, and it reports that fallback as one issue on `.opencode/SYNC.md` only.

```text
$ bash baseline.sh $(cat r006.txt) | awk -F'\t' '{split($4,a,"=");h+=a[2]; if(a[2]>0)n++; split($2,b,"=");l+=b[2]} END{print "files="NR, "lines="l, "hard_sum="h, "files_with_hard="n+0}'
files=15 lines=1725 hard_sum=91 files_with_hard=8

$ grep -v 'hard=0' baseline-006-before.tsv | cut -f1,4,5
.claude/SYNC.md	hard=14	ceil=29/100
.codex/SYNC.md	hard=14	ceil=29/100
.cursor/SYNC.md	hard=12	ceil=40/100
.devin/SYNC.md	hard=16	ceil=17/100
.dsh/SYNC.md	hard=4	ceil=80/100
.opencode/SYNC.md	hard=7	ceil=63/100
.pi/SYNC.md	hard=21	ceil=0/100
.vibe/SYNC.md	hard=3	ceil=85/100

$ python3 h2model.py "<the seven README sections>" $(grep README r006.txt) | cut -f1 | sort | uniq -c
   7 EXACT

$ python3 h2model.py "<the ten manifest sections>" $(grep SYNC r006.txt) | cut -f1 | sort | uniq -c
   1 DIFF
   7 SUBSET

$ ls .vibe/README.md
ls: .vibe/README.md: No such file or directory

$ python3 readme_links.py . $(cat r006.txt)
checked 82 outbound and 0 inbound anchored links across 15 files, 0 problems

$ node --test .skilled/bin/tests/opencode-compat-layout.test.cjs
ℹ pass 21
```

All 15 existing files print `✅ VALID` and none has an emoji in a heading.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Bring each of the 8 manifests to the sync manifest scaffold and clear their 91 hard voice blockers.
- Fact-check the 7 runtime folder READMEs, which already carry the README scaffold's sections, and fix what does not hold.
- Write `.vibe/README.md` from the README scaffold.
- Keep the `.opencode/SYNC.md` inventory table that `opencode-compat-layout.test.cjs` compares with the disk.

### Out of Scope
- Plugin, extension and hook mirror READMEs. Phase 005 owns them.
- Generators, drift checks and runtime configs. A defect found there is recorded, not fixed.
- Hand edits to README versions and changelog entries.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.claude/README.md`, `.codex/README.md`, `.cursor/README.md`, `.devin/README.md`, `.dsh/README.md`, `.opencode/README.md`, `.pi/README.md` | Modify | Fact-check against the README scaffold |
| `.claude/SYNC.md`, `.codex/SYNC.md`, `.cursor/SYNC.md`, `.devin/SYNC.md`, `.dsh/SYNC.md`, `.opencode/SYNC.md`, `.pi/SYNC.md`, `.vibe/SYNC.md` | Modify | Bring to the sync manifest scaffold, 91 hard blockers to clear |
| `.vibe/README.md` | Create | The one runtime folder with no README |
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
| REQ-001 | Each README opens with an H1 and OVERVIEW leading with a four-row At a Glance table, each manifest opens OVERVIEW with how the runtime reads the folder, and every H2 is numbered, ALL CAPS, named in its scaffold and preceded by `---`. |
| REQ-002 | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` for each of the 16 files. |
| REQ-003 | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0` for each of the 16 files. |
| REQ-004 | Every relative link in the 16 files resolves, and every link elsewhere in the repository that points into one of them with an anchor still resolves. |
| REQ-005 | Every path, command, count and list a README states matches the code it describes, checked by a session that did not write that README. |
| REQ-006 | The tests that read these READMEs still pass: the OpenCode compat layout test, the README verdict parity test and the sk-doc script suite. |

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

- **SC-001**: The baseline script prints `✅ VALID` and `hard=0` for all 16 files, and `h2model.py` prints EXACT or SUBSET for each against its scaffold.
- **SC-002**: The link checker reports 0 problems for links into and out of the 16 files.
- **SC-003**: The compat layout test, the verdict parity test and the sk-doc suite pass, and the phase is pushed with `validate.sh --strict` printing `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The runtime folder template and the two sk-doc scripts | A template change mid-phase would move the target | Read the template once at Setup and treat that read as the contract for the phase |
| Risk | A rewrite drops a fact a reader relied on, or states one the code does not support | High | A session that did not write the README checks it against the code before the phase closes |
| Risk | Renaming a section in `.opencode/SYNC.md` breaks the compat layout test | High | The brief pins the SURFACE INVENTORY heading and numbering, and the test runs before commit |
| Risk | A new `.vibe/README.md` states a setup step the folder does not support | Med | The writer reads `.vibe/SYNC.md`, `config.toml` and `hooks.toml` first, and the reviewer checks each step |
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
- Maximum input: `.devin/SYNC.md` holds 152 lines with 16 hard blockers. It keeps every inventory row and drift check and rewrites the prose around them.
- Failure path: a claim the session cannot confirm from the code is dropped, never kept on trust.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 10/25 | 15 files, 1,725 lines, one new file |
| Risk | 8/25 | One test parses an inventory table |
| Research | 12/20 | Every surface row needs a check against the folder and its generator |
| **Total** | **30/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None.
<!-- /ANCHOR:questions -->

---
