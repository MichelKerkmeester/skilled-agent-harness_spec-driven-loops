---
title: "Implementation Plan: Phase 5: runtime-plugin-readmes"
description: "One DeepSeek writer session per README brings the 8 plugin, extension and hook mirror READMEs to the runtime plugin template, a different session checks each entry against the folder, and the main session reruns every gate before one commit."
trigger_phrases:
  - "runtime plugin readmes plan"
  - "runtime plugin readmes rewrite waves"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: runtime-plugin-readmes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown READMEs with YAML frontmatter |
| **Framework** | The `sk-create-readme` runtime plugin and extension template and the Human Voice Rules |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `h2model.py`, `readme_links.py`, goal-doc-contract.test.cjs |

### Overview
The phase brings the 8 READMEs of the folders a runtime loads entries from to the runtime plugin template: `.pi/extensions/`, `.opencode/plugins/`, `.dsh/plugins/repo-guards/`, `.vibe/plugins/` and the Claude, Codex, Cursor and Devin hook mirror folders. None follows the template's section list today, and four fail the voice scan with 27 hard blockers between them.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The file list is rebuilt from disk with the enumeration command below and still holds 8 files
- [ ] The baseline for all 8 files is recorded in `$S/baseline-005-before.tsv`
- [ ] The link checker and every consumer test in the affected surfaces table pass before any edit
- [ ] The writer and reviewer briefs are rendered from this plan's constraints

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash $S/tools/baseline.sh` prints `✅ VALID`, `hard=0` and `emojiH=0` for all 8 files, and `readme_links.py` prints `0 problems`
- [ ] `h2model.py` prints EXACT or SUBSET for every file against its template's section list
- [ ] Every consumer test in the affected surfaces table passes
- [ ] Docs updated (spec/plan/tasks), and `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-driven rewrite with independent review, one README per session.

### Key Components
- **Template** (`.skilled/skills/sk-doc/sk-create-readme/assets/runtime-plugin-readme-template.md`): the section model OVERVIEW, ARCHITECTURE, DIRECTORY TREE, ENTRY MAP, BOUNDARIES AND FLOW, CONFIGURATION, VALIDATION and RELATED, with a PLUGIN MAP allowed after the entry map for a folder that maps another runtime's plugins.
- **Writer sessions**: DeepSeek V4.1 Flash at max through cli-opencode, one README per session, started by `$S/dispatch.sh`. Each reads its sources, rewrites only its README and runs the per-file checks.
- **Reviewer sessions**: the same model through `$S/review.sh`, never the session that wrote the file. Each checks every path, command, count and list against the sources read-only and returns findings.
- **Main session**: confirms each finding against the code before applying it, reruns every check itself and owns the commit.
- **Scratchpad checks**: `baseline.sh` (validator, voice scan and emoji heading count per file), `h2model.py` (H2 list against the template), `readme_links.py` (outbound links plus anchored links into the files) and the enumeration list `r005.txt`, all under `$S`, which is `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/256db329-443e-4697-8e43-b3b7f7c74ec6/scratchpad`.

### Enumeration
```bash
printf '%s\n' .pi/extensions/README.md .opencode/plugins/README.md .dsh/plugins/repo-guards/README.md .vibe/plugins/README.md .claude/hooks/README.md .codex/hooks/README.md .cursor/hooks/README.md .devin/hooks/README.md > $S/r005.txt
```
Expected: 8 lines. Rerun it at implement time, because other sessions keep moving main.

### Data Flow
Each writer reads its sources and the template, then writes the README. Its reviewer reads the same sources and the new README and returns findings. The main session applies confirmed findings, reruns every check and records the before and after numbers.

### Waves
One canary writer runs first on `.cursor/hooks/README.md` (69 lines). The other 7 run as one wave. Reviewers start as soon as their file's writer returns.

### Writer Brief Constraints
- Follow the runtime plugin template: an H1 of the form `[Runtime] [Plugins or Extensions]: [What They Do]`, `---` before each numbered ALL-CAPS H2, and only the section names in its section model. ENTRY MAP has one row per entry with the event, the real file or core and what the session sees.
- Say what kind of file each entry is: a link, a one-line re-export, a thin adapter or a full plugin.
- The OpenCode plugins README keeps every goal switch name it lists live in `hook-flags.cjs`, because `goal-doc-contract.test.cjs` reads it.
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
| `.opencode/plugins/tests/goal-doc-contract.test.cjs` | Reads goal switch names from the OpenCode plugins README | Keep every named switch live | `pass 5` |
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
| Integration | Links into and out of the 8 files, and the code that reads them | `readme_links.py`, `test_readme_verdict_parity.py`, the sk-doc `run-script-tests.sh` suite and goal-doc-contract.test.cjs |
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
| Setup | Phase 004 pushed to origin/main | Implementation |
| Implementation | The baseline and the passing checks from Setup | Verification |
| Verification | Every writer and reviewer session returned | The commit and push |
<!-- /ANCHOR:phase-deps -->

---
