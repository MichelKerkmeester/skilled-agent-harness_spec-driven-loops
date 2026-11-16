---
title: "Feature Specification: Phase 2: mode-packet-readmes"
description: "The 41 mode packet READMEs below the seven hubs predate the skill README template. 12 of them fail the voice scan with 45 hard blockers between them, and 16 carry a section set the template does not name. This phase rewrites them to the template with every fact checked against the packet's files."
trigger_phrases:
  - "mode packet readmes"
  - "phase 2 mode packet readmes"
  - "mode packet readme template conformance"
  - "rewrite mode packet readmes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: mode-packet-readmes

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
| **Phase** | 2 of 7 |
| **Predecessor** | 001-skill-readmes |
| **Successor** | 003-hook-folder-readmes |
| **Handoff Criteria** | All 41 mode packet READMEs validate, scan with 0 hard voice blockers and have 0 broken links |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 2** of the README template conformance specification.

**Scope Boundary**: The 41 READMEs of the mode packets registered in each hub `mode-registry.json`. Hub roots belong to phase 001, and non-mode folders such as `benchmark/` and `shared/` are out of scope.

**Dependencies**:
- The validator `validate_document.py` and the voice scanner `hvr_scan.py` under `.skilled/skills/sk-doc/`, and `.skilled/skills/sk-doc/sk-create-readme/assets/skill-readme-template.md`
- Phase 001, so the hub READMEs these packets link back to are already settled
- `deep-research-contract-parity.vitest.ts` and `deep-review-contract-parity.vitest.ts` under `.skilled/skills/system-spec-kit/runtime/cli/tests/` read the two deep-loop mode READMEs, so both must pass after the rewrite

**Deliverables**:
- 41 mode packet READMEs that follow the skill README template
- A before and after baseline per file
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A mode packet README is what a reader opens after the hub routes them to one mode, such as `cli-codex` or `sk-create-readme`. These 41 files were written by many hands against older templates. 12 of them fail the voice scan, with 45 hard blockers between them, and `mcp-notion` alone carries 17. 16 differ from the skill README section model: the eight CLI packets carry a `STRUCTURE` section the template does not name, and `cli-jev`, `sk-create-goal`, `sk-design-chart` and two sk-code packets use section sets of their own. Their paths, counts and command lists were never re-checked after the packets moved.

### Purpose
Each of the 41 mode packet READMEs follows the skill README template, passes the validator and the voice scan with zero hard blockers, and states only facts that the packet's own files confirm.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The list comes from the seven registries, so it can be rerun at implement time. `baseline.sh` runs `validate_document.py`, `hvr_scan.py` and an emoji heading count per file. `h2model.py` compares each file's H2 list with the template's eight sections. Both live at the scratchpad path in `plan.md`.

```text
$ python3 -c "<print hub/<packet>/README.md for every mode in .skilled/skills/*/mode-registry.json>" | sort -u | wc -l
41

$ bash baseline.sh $(cat r002.txt) | awk -F'\t' '{split($4,a,"=");h+=a[2]; if(a[2]>0)n++; split($2,b,"=");l+=b[2]} END{print "files="NR, "lines="l, "hard_sum="h, "files_with_hard="n+0}'
files=41 lines=8490 hard_sum=45 files_with_hard=12

$ grep -v 'hard=0' baseline-002-before.tsv | cut -f1,4,5
cli-classifier/cli-jev/README.md	hard=6	ceil=68/100
cli-external-orchestration/cli-claude-code/README.md	hard=1	ceil=85/100
cli-external-orchestration/cli-deepseek-harness/README.md	hard=3	ceil=82/100
mcp-tooling/mcp-mobbin/README.md	hard=3	ceil=76/100
mcp-tooling/mcp-notion/README.md	hard=17	ceil=8/100
mcp-tooling/mcp-obsidian/README.md	hard=2	ceil=86/100
mcp-tooling/mcp-refero/README.md	hard=3	ceil=80/100
sk-code/sk-code-frontend/README.md	hard=1	ceil=94/100
sk-design/sk-design-diagram/README.md	hard=5	ceil=72/100
sk-doc/sk-create-manual-testing-playbook/README.md	hard=1	ceil=91/100
sk-doc/sk-create-quality-control/README.md	hard=1	ceil=88/100
sk-doc/sk-create-repo-rule/README.md	hard=2	ceil=78/100

$ python3 h2model.py "OVERVIEW,QUICK START,HOW IT WORKS,INTEGRATION & NAVIGATION,TROUBLESHOOTING,FAQ,VERIFICATION,RELATED DOCUMENTS" $(cat r002.txt) | cut -f1 | sort | uniq -c
  15 DIFF
  25 EXACT
   1 SUBSET

$ python3 readme_links.py . $(cat r002.txt)
checked 581 outbound and 0 inbound anchored links across 41 files, 0 problems

$ npx vitest run --config vitest.config.ts runtime/cli/tests/deep-research-contract-parity.vitest.ts runtime/cli/tests/deep-review-contract-parity.vitest.ts
 Test Files  2 passed (2)
      Tests  19 passed (19)
```

All 41 already print `✅ VALID` and none has an emoji in a heading. `sk-doc/mode-registry.json` lists `sk-create-skill` twice, once per mode it serves, which is why the registries name 42 modes for 41 files.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite each of the 41 mode packet READMEs to the skill README template: a one-line pitch, OVERVIEW first with a four-row At a Glance table and a What It Does subsection, numbered ALL-CAPS H2 sections with `---` dividers and only the sections the packet earns.
- Clear the 45 hard voice blockers in the 12 files that carry them.
- Check every path, command, count, flag and runtime list against the packet's files, and correct or drop what does not hold.
- Keep the content that code reads: the deep-loop artifact names the two contract parity vitests look for, and every heading another file links to with an anchor.
- Rebuild the README verdict baseline for the files whose verdict changes, and the trigger index when a README's `trigger_phrases` change.

### Out of Scope
- The 14 hub READMEs. Phase 001 owns them and they are pushed.
- `benchmark/`, `shared/` and other folders below a hub that no registry names as a mode.
- `SKILL.md`, `ROUTER.md`, references and every other file in a packet. A README describes the packet, so a defect found there is recorded, not fixed.
- Hand edits to README versions and changelog entries. The pre-commit doc-version gate raises a changed README's version itself, and a rewrite is not a skill release.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/cli-jev/README.md` | Modify | Rewrite to the template, 6 hard blockers to clear |
| `.skilled/skills/cli-external-orchestration/cli-*/README.md` (8) | Modify | Rewrite to the template and fold the `STRUCTURE` section into HOW IT WORKS, 4 hard blockers to clear |
| `.skilled/skills/mcp-tooling/mcp-*/README.md` (8) | Modify | Rewrite to the template, 25 hard blockers to clear across four files |
| `.skilled/skills/sk-code/sk-code-*/README.md` (5) | Modify | Rewrite to the template, 1 hard blocker to clear |
| `.skilled/skills/sk-design/sk-design-*/README.md` (3) | Modify | Rewrite to the template, 5 hard blockers to clear |
| `.skilled/skills/sk-doc/sk-create-*/README.md` (14) | Modify | Rewrite to the template, 4 hard blockers to clear |
| `.skilled/skills/system-deep-loop/deep-{research,review}/README.md` (2) | Modify | Rewrite to the template, keep the artifact names the parity vitests read |
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
| REQ-001 | Each of the 41 READMEs opens with an H1, a one-line blockquote pitch, then `## 1. OVERVIEW` whose first subsection is a four-row At a Glance table, and every H2 is numbered, ALL CAPS, named in the template's section model and preceded by `---`. |
| REQ-002 | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` for each of the 41 files. |
| REQ-003 | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0` for each of the 41 files. |
| REQ-004 | Every relative link in the 41 files resolves, and every link elsewhere in the repository that points into one of them with an anchor still resolves. |
| REQ-005 | Every path, command, count and list a README states matches the packet's files, checked by a session that did not write that README. |
| REQ-006 | The tests that read these READMEs still pass: the two deep-loop contract parity vitests, the README verdict parity test and the sk-doc script suite. |

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

- **SC-001**: The baseline script prints `✅ VALID` and `hard=0` for all 41 mode packet READMEs, and `h2model.py` prints EXACT or SUBSET for each.
- **SC-002**: The link checker reports 0 problems for links into and out of the 41 files.
- **SC-003**: The two parity vitests, the verdict parity test and the sk-doc suite pass, and the phase is pushed with `validate.sh --strict` printing `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The skill README template and the two sk-doc scripts | A template change mid-phase would move the target | Read the template once at Setup and treat that read as the contract for the phase |
| Risk | A rewrite drops a fact a reader relied on, or states one the code does not support | High | A session that did not write the README checks it against the packet's files before the phase closes |
| Risk | A rewrite drops a deep-loop artifact name the parity vitests read | High | The writer brief names each one, and both vitests run before commit |
| Risk | Folding the CLI `STRUCTURE` section away loses the file map a reader used | Med | The brief moves the file map into HOW IT WORKS instead of dropping it |
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

- Empty input: a template section with no real content for a packet is left out and the rest renumbered, never filled with a placeholder.
- Maximum input: `cli-opencode/README.md` holds 314 lines. It keeps the commands a reader runs and links to the packet's references for the rest.
- Failure path: a claim the session cannot confirm from the packet's files is dropped, never kept on trust.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 41 rewrites, 8,490 lines |
| Risk | 7/25 | No code changes. Two vitests read deep-loop README content |
| Research | 12/20 | Every stated fact needs a check against the packet's own files |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The registries fix the file list, and the template fixes the section model.
<!-- /ANCHOR:questions -->

---
