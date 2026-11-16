---
title: "Implementation Plan: Phase 2: mode-packet-readmes"
description: "One DeepSeek writer session per README rewrites the 41 mode packet READMEs to the skill README template in waves, a different session fact-checks each one against its packet, and the main session reruns every gate before one commit."
trigger_phrases:
  - "mode packet readmes plan"
  - "mode packet readmes rewrite waves"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: mode-packet-readmes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown READMEs with YAML frontmatter |
| **Framework** | The `sk-create-readme` skill README template and the Human Voice Rules |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `h2model.py`, `readme_links.py`, deep-research-contract-parity.vitest.ts, deep-review-contract-parity.vitest.ts, parent-skill-check.cjs, check-rule-copies.test.sh, check-documentation-drift.cjs |

### Overview
The phase changes the 41 mode packet READMEs registered in the seven hub `mode-registry.json` files. One writer session per README rewrites it, and a different session checks every fact against the packet's files. The main session then reruns the validator, the voice scan, the structure check, the link check and the tests that read README content, and commits once.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The file list is rebuilt from disk with the enumeration command below and still holds 41 files
- [x] The baseline for all 41 files is recorded in `$S/baseline-002-before.tsv`
- [x] The link checker and every consumer test in the affected surfaces table pass before any edit
- [x] The writer and reviewer briefs are rendered from this plan's constraints

### Definition of Done
- [x] All acceptance criteria met
- [x] `bash $S/tools/baseline.sh` prints `✅ VALID`, `hard=0` and `emojiH=0` for all 41 files, and `readme_links.py` prints `0 problems`
- [x] `h2model.py` prints EXACT or SUBSET for every file against its template's section list
- [x] Every consumer test in the affected surfaces table passes
- [x] Docs updated (spec/plan/tasks), and `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-driven rewrite with independent review, one README per session.

### Key Components
- **Template** (`.skilled/skills/sk-doc/sk-create-readme/assets/skill-readme-template.md`): the section model and checklist each README must meet. Only OVERVIEW is required. QUICK START, HOW IT WORKS, INTEGRATION & NAVIGATION, TROUBLESHOOTING, FAQ and VERIFICATION are optional, and RELATED DOCUMENTS is required when the README links anywhere.
- **Writer sessions**: DeepSeek V4.1 Flash at max through cli-opencode, one README per session, started by `$S/dispatch.sh`. Each reads its sources, rewrites only its README and runs the per-file checks.
- **Reviewer sessions**: the same model through `$S/review.sh`, never the session that wrote the file. Each checks every path, command, count and list against the sources read-only and returns findings.
- **Main session**: confirms each finding against the code before applying it, reruns every check itself and owns the commit.
- **Scratchpad checks**: `baseline.sh` (validator, voice scan and emoji heading count per file), `h2model.py` (H2 list against the template), `readme_links.py` (outbound links plus anchored links into the files) and the enumeration list `r002.txt`, all under `$S`, which is `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/256db329-443e-4697-8e43-b3b7f7c74ec6/scratchpad`.

### Enumeration
```bash
python3 -c "import json,glob,os
for r in sorted(glob.glob('.skilled/skills/*/mode-registry.json')):
    d=json.load(open(r)); hub=os.path.dirname(r); m=d.get('modes') or d.get('workflowModes') or d
    it=m.items() if isinstance(m,dict) else [(x.get('id') or x.get('name'),x) for x in m]
    [print(os.path.join(hub,str((v.get('packet') or v.get('path') or v.get('packetPath') or v.get('folder') or k) if isinstance(v,dict) else k),'README.md')) for k,v in it]" | sort -u > $S/r002.txt
```
Expected: 41 lines. Rerun it at implement time, because other sessions keep moving main.

### Data Flow
Each writer reads its sources and the template, then writes the README. Its reviewer reads the same sources and the new README and returns findings. The main session applies confirmed findings, reruns every check and records the before and after numbers.

### Waves
One canary writer runs first on the smallest file, `sk-code-frontend` (81 lines). The other 40 run in waves of up to eight sessions, grouped by hub so one wave's reviewers can share a read of the hub. Reviewers start as soon as their file's writer returns.

### Writer Brief Constraints
- Follow the skill README template: H1, a one-line blockquote pitch, `## 1. OVERVIEW` opening with a four-row At a Glance table and a What It Does subsection, at most two more OVERVIEW subsections, numbered ALL-CAPS H2s from the template's list only, each after a `---` line, and a FAQ of two to five questions when present.
- The eight CLI packet READMEs drop their `STRUCTURE` section and move its file map into HOW IT WORKS.
- The deep-research README keeps the artifact names its parity vitest reads, and the deep-review README keeps `deep-review-config.json`, `deep-review-state.jsonl`, `deep-review-findings-registry.json`, `.deep-review-pause`, `completed-continue` and `releaseReadinessState`.
- Keep a `README.md` in every packet folder, because `parent-skill-check.cjs` lists it as a file the hub owns.
- The sk-code-review README keeps the three status lines `Review status: APPROVED`, `Review status: REQUESTED_CHANGES` and `Review status: COMMENTED`, and keeps the fenced example right after `**Step 2: Run the primary workflow.**` with a `Not checked:` line, one blank line and the exact status line last, because `check-rule-copies.js` reads it.
- Keep frontmatter `title`, `description` and `trigger_phrases` unless a value is wrong, and leave `version` alone, because the pre-commit gate raises it.
- Keep exact commands, paths, flags and file names where a reader acts on them, and state each command's expected output.
- Link text in prose is plain words, wording is provider agnostic and the AI Council gets no emphasis.
- Edit only the assigned README and run no git command.
- Report every command run with its exit status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `deep-research-contract-parity.vitest.ts` and `deep-review-contract-parity.vitest.ts` | Read the two deep-loop mode READMEs with their primary docs | Keep every artifact name they require | Both pass, 19 tests |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Checks each hub owns a README in every packet folder | None, the files stay in place | Exit 0 and 0 FAIL for all seven hubs |
| `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` | Reads three status lines and one fenced example from the sk-code-review README | Keep the lines and the fence shape | `check-rule-copies.test.sh` prints `All rule-canary test cases passed` |
| `.skilled/skills/system-deep-loop/runtime/scripts/check-documentation-drift.cjs` | Checks deep-research README links and file names in both deep-loop mode READMEs | Keep every named file real | Exit 0 |
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Holds the validator verdict the CI parity test expects for every README | Update the entries whose verdict changes | `test_readme_verdict_parity.py` prints `PARITY PASS` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and three retrieval fixtures | Maps `trigger_phrases` to paths | Regenerate as the last step before the commit | `generate-trigger-index.mjs --check` reports every entry fresh |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup rebuilds the file list, records the baseline and confirms every check passes before an edit. Implementation runs one canary writer, then the rest in waves, then one reviewer per README. Verification reruns the baseline, the structure check, the link check and every consumer test, then commits, merges origin/main and pushes. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each README's structure and voice | `validate_document.py` prints `VALID`, `hvr_scan.py` reports `hard blockers: 0`, `h2model.py` prints EXACT or SUBSET |
| Integration | Links into and out of the 41 files, and the code that reads them | `readme_links.py`, `test_readme_verdict_parity.py`, the sk-doc `run-script-tests.sh` suite and deep-research-contract-parity.vitest.ts, deep-review-contract-parity.vitest.ts, parent-skill-check.cjs, check-rule-copies.test.sh, check-documentation-drift.cjs |
| Manual | Fact accuracy and template fit | One reviewer session per README, every finding confirmed by the main session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `python3`, `node`, `npx vitest` and `rg` | Internal | Green | No check can run |
| `opencode` with the DeepSeek V4.1 Flash route | External | Green | The writers run as Claude subagents instead, recorded as a deviation from D4 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a check fails after the push, or a reader finds a README states something false.
- **Procedure**: `git revert <phase commit>` restores every README and the generated files in one commit, because the phase lands as one commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 001 pushed to origin/main | Implementation |
| Implementation | The baseline and the passing checks from Setup | Verification |
| Verification | Every writer and reviewer session returned | The commit and push |
<!-- /ANCHOR:phase-deps -->

---
