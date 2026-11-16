---
title: "Feature Specification: Phase 1: skill-readmes"
description: "The 13 skill READMEs predate the current skill README template, six of them fail the voice scan with 20 hard blockers between them, and sk-design has no README. This phase rewrites the 13 to the template and writes the sk-design one, with every fact checked against the skill's files."
trigger_phrases:
  - "skill readmes"
  - "phase 1 skill readmes"
  - "skill readme template conformance"
  - "rewrite skill readmes"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 1: skill-readmes

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
| **Phase** | 1 of 7 |
| **Predecessor** | None |
| **Successor** | 002-mode-packet-readmes |
| **Handoff Criteria** | All 14 skill READMEs, the new `sk-design` one included, validate, scan with 0 hard voice blockers and have 0 broken links |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 1** of the README template conformance specification.

**Scope Boundary**: The 13 tracked `.skilled/skills/*/README.md` files and a new `.skilled/skills/sk-design/README.md`. Mode packet READMEs below a hub belong to phase 002. `local-webflow` is a symlink into another project and is not part of this repository.

**Dependencies**:
- The validator `validate_document.py` and the voice scanner `hvr_scan.py` under `.skilled/skills/sk-doc/`, and `.skilled/skills/sk-doc/sk-create-readme/assets/skill-readme-template.md`

**Deliverables**:
- 13 rewritten skill READMEs and one new one, all following the skill README template
- A before and after baseline per file in `implementation-summary.md`
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The skill READMEs are the front door a person reads before opening a skill's `SKILL.md`. They were written against older templates, so their section sets differ from the skill README template that owns them now: three have no What It Does subsection, `cli-orca` uses a five-row Field and Value table in place of At a Glance, and several carry sections the template does not name. Six of the 13 fail the voice scan, with 20 hard blockers between them. `sk-design` has no README at all. Nobody has re-checked their paths, counts and command lists since the skills moved.

### Purpose
Each of the 14 skill READMEs follows the skill README template, passes the validator and the voice scan with zero hard blockers, and states only facts that the skill's own files confirm.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The baseline script runs `validate_document.py`, `hvr_scan.py` and an emoji heading count on each file. It is kept at the scratchpad path in `plan.md`. The `local-webflow` line is the symlinked folder outside this repository.

```text
$ bash baseline.sh .skilled/skills/*/README.md
.skilled/skills/cli-classifier/README.md	lines=138	✅ VALID issues=0	hard=2	ceil=89/100	emojiH=0
.skilled/skills/cli-external-orchestration/README.md	lines=148	✅ VALID issues=0	hard=2	ceil=89/100	emojiH=0
.skilled/skills/cli-orca/README.md	lines=93	✅ VALID issues=0	hard=1	ceil=95/100	emojiH=0
.skilled/skills/local-webflow/README.md	lines=129	❌ INVALID issues=2	hard=4	ceil=76/100	emojiH=0
.skilled/skills/mcp-code-mode/README.md	lines=223	✅ VALID issues=0	hard=0	ceil=90/100	emojiH=0
.skilled/skills/mcp-tooling/README.md	lines=141	✅ VALID issues=0	hard=0	ceil=95/100	emojiH=0
.skilled/skills/sk-code/README.md	lines=228	✅ VALID issues=0	hard=0	ceil=97/100	emojiH=0
.skilled/skills/sk-doc/README.md	lines=247	✅ VALID issues=0	hard=0	ceil=89/100	emojiH=0
.skilled/skills/sk-git/README.md	lines=329	✅ VALID issues=0	hard=0	ceil=94/100	emojiH=0
.skilled/skills/sk-prompt/README.md	lines=238	✅ VALID issues=0	hard=2	ceil=81/100	emojiH=0
.skilled/skills/system-deep-loop/README.md	lines=127	✅ VALID issues=0	hard=3	ceil=84/100	emojiH=0
.skilled/skills/system-skill-advisor/README.md	lines=280	✅ VALID issues=0	hard=0	ceil=97/100	emojiH=0
.skilled/skills/system-skilled-doctor/README.md	lines=144	✅ VALID issues=0	hard=0	ceil=96/100	emojiH=0
.skilled/skills/system-spec-kit/README.md	lines=716	✅ VALID issues=0	hard=10	ceil=38/100	emojiH=0

$ python3 readme_links.py . .skilled/skills/*/README.md
checked 220 outbound and 1 inbound anchored links across 14 files, 0 problems

$ python3 .skilled/skills/sk-doc/scripts/tests/test_readme_verdict_parity.py
PARITY baseline_files=1244 post_files=1244 diff_entries=0
PARITY PASS: verdict diff is empty
```

The 13 tracked files hold 3,052 lines. None has an emoji in a heading, so the emoji step of the program has no work in this phase.
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rewrite each of the 13 skill READMEs to the skill README template: a one-line pitch, OVERVIEW first with a four-row At a Glance table and a What It Does subsection, numbered ALL-CAPS H2 sections with `---` dividers and only the sections the skill earns.
- Write `.skilled/skills/sk-design/README.md` from the same template, from the skill's `SKILL.md`, registry, router and mode folders.
- Check every path, command, count, mode list and runtime list against the skill's files, and correct or drop what does not hold.
- Keep the content that code reads: the `42-rule registry` phrase in the spec-kit README, every registered packet folder name in the deep-loop README and the anchor the root README links into the sk-code README.
- Rebuild the README verdict baseline for the files whose verdict changes, and the trigger index if a README's `trigger_phrases` change.

### Out of Scope
- The 41 mode packet READMEs below the hubs. Phase 002 owns them.
- `.skilled/skills/local-webflow/`. It is a symlink into a different project, and git does not track it.
- `SKILL.md`, `ROUTER.md`, references and every other file in a skill. A README describes the skill, so a defect found there is recorded, not fixed.
- Hand edits to README versions and changelog entries. The pre-commit doc-version gate raises a changed README's version itself, and a rewrite is not a skill release.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/cli-classifier/README.md` | Modify | Rewrite to the template, 2 hard blockers to clear |
| `.skilled/skills/cli-external-orchestration/README.md` | Modify | Rewrite to the template, 2 hard blockers to clear |
| `.skilled/skills/cli-orca/README.md` | Modify | Rewrite to the template, 1 hard blocker to clear |
| `.skilled/skills/mcp-code-mode/README.md` | Modify | Rewrite to the template |
| `.skilled/skills/mcp-tooling/README.md` | Modify | Rewrite to the template |
| `.skilled/skills/sk-code/README.md` | Modify | Rewrite to the template, keep the `#4-adapting-to-your-stack` anchor or update the root README link |
| `.skilled/skills/sk-design/README.md` | Create | New README from the template |
| `.skilled/skills/sk-doc/README.md` | Modify | Rewrite to the template |
| `.skilled/skills/sk-git/README.md` | Modify | Rewrite to the template, keep its `readme-check` block valid |
| `.skilled/skills/sk-prompt/README.md` | Modify | Rewrite to the template, 2 hard blockers to clear |
| `.skilled/skills/system-deep-loop/README.md` | Modify | Rewrite to the template, 3 hard blockers to clear, keep every packet folder name |
| `.skilled/skills/system-skill-advisor/README.md` | Modify | Rewrite to the template |
| `.skilled/skills/system-skilled-doctor/README.md` | Modify | Rewrite to the template |
| `.skilled/skills/system-spec-kit/README.md` | Modify | Rewrite to the template, 10 hard blockers to clear, keep the `42-rule registry` phrase |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Modify | Generated. Rebuilt for the entries whose verdict changes |
| `README.md` | Modify | Only if the sk-code anchor it links to must change |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Each of the 14 READMEs opens with an H1, a one-line blockquote pitch, then `## 1. OVERVIEW` whose first subsection is a four-row At a Glance table, and every H2 is numbered, ALL CAPS and preceded by `---`. |
| REQ-002 | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <readme>` prints `VALID` for each of the 14 files. |
| REQ-003 | `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_scan.py <readme>` reports `hard blockers: 0` for each of the 14 files. |
| REQ-004 | Every relative link in the 14 files resolves, and every link elsewhere in the repository that points into one of them with an anchor still resolves. |
| REQ-005 | Every path, command, count and list a README states matches the skill's files, checked by a reviewer who did not write that README. |
| REQ-006 | The tests that read these READMEs still pass: the README verdict parity test, the spec-kit registry count test and the deep-loop documentation drift check. |

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

- **SC-001**: The baseline script prints `✅ VALID` and `hard=0` for all 14 tracked skill READMEs.
- **SC-002**: The link checker reports 0 problems for links into and out of the 14 files.
- **SC-003**: The parity test, the registry count test and the drift check pass, and the phase is pushed with `validate.sh --strict` printing `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The skill README template and the two sk-doc scripts | A template change mid-phase would move the target | Read the template once at Setup and treat that read as the contract for the phase |
| Risk | A rewrite drops a fact a reader relied on, or states one the code does not support | High | A second agent checks each rewritten README against the skill's files before the phase closes |
| Risk | A rewrite breaks content that code reads, such as the registry count phrase or a packet folder name | High | The writer brief names each one, and the three tests run before commit |
| Risk | A heading change breaks an anchor another file links to | Med | The link checker runs before and after, over inbound and outbound links |
| Risk | Parallel agents edit the same file | Med | Each agent owns a disjoint list of READMEs and edits nothing else |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A: this phase changes documentation only and runs no service, so it has no performance, security or reliability limit to state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a README section with no real content for its skill is removed and the rest renumbered, never filled with a placeholder.
- Maximum input: `system-spec-kit/README.md` holds 716 lines and 10 hard blockers. It keeps the technical detail a reader acts on and links to the skill's references for the rest.
- Failure path: a claim the agent cannot confirm from the skill's files is dropped, never kept on trust.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | 13 rewrites, 3,052 lines, and one new README |
| Risk | 8/25 | No code changes. Three tests read README content, and one root link points at an anchor |
| Research | 12/20 | Every stated fact needs a check against the skill's own files |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The operator added the `sk-design` README to this phase, and `local-webflow` is outside the repository.
<!-- /ANCHOR:questions -->

---
