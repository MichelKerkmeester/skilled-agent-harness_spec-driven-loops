---
title: "Implementation Plan: Phase 6: runtime-folder-readmes"
description: "One DeepSeek writer session per file brings 7 runtime folder READMEs and 8 SYNC docs to the runtime folder template and writes `.vibe/README.md`, a different session checks each surface row against the folder, and the main session reruns every gate before one commit."
trigger_phrases:
  - "runtime folder readmes plan"
  - "runtime folder readmes rewrite waves"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: runtime-folder-readmes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown READMEs with YAML frontmatter |
| **Framework** | The `sk-create-readme` runtime folder and sync manifest template and the Human Voice Rules |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `h2model.py`, `readme_links.py`, opencode-compat-layout.test.cjs |

### Overview
The phase covers the seven runtime folder READMEs, the eight `SYNC.md` manifests and a new `.vibe/README.md`. The READMEs already follow the section list, so their work is the fact check. The manifests carry 91 hard voice blockers between them, and `.opencode/SYNC.md` uses section names of its own.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The file list is rebuilt from disk with the enumeration command below and still holds 16 files
- [ ] The baseline for all 16 files is recorded in `$S/baseline-006-before.tsv`
- [ ] The link checker and every consumer test in the affected surfaces table pass before any edit
- [ ] The writer and reviewer briefs are rendered from this plan's constraints

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash $S/tools/baseline.sh` prints `✅ VALID`, `hard=0` and `emojiH=0` for all 16 files, and `readme_links.py` prints `0 problems`
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
- **Template** (`.skilled/skills/sk-doc/sk-create-readme/assets/runtime-folder-template.md`): the README scaffold (OVERVIEW, HOW IT CONNECTS TO SKILLED, GETTING STARTED, WHAT IS GENERATED AND WHAT IS AUTHORED, CHECKING IT IS HEALTHY, LIMITS AND KNOWN GAPS, RELATED) and the sync manifest scaffold (OVERVIEW, SURFACE INVENTORY, WHAT THIS FOLDER NEVER HOLDS, WHEN TO SYNC, SYNC WORKFLOW, FORMAT CONTRACT, REQUIRED PARITY, DRIFT CHECKS, KNOWN GAPS, RELATED DOCUMENTS).
- **Writer sessions**: DeepSeek V4.1 Flash at max through cli-opencode, one README per session, started by `$S/dispatch.sh`. Each reads its sources, rewrites only its README and runs the per-file checks.
- **Reviewer sessions**: the same model through `$S/review.sh`, never the session that wrote the file. Each checks every path, command, count and list against the sources read-only and returns findings.
- **Main session**: confirms each finding against the code before applying it, reruns every check itself and owns the commit.
- **Scratchpad checks**: `baseline.sh` (validator, voice scan and emoji heading count per file), `h2model.py` (H2 list against the template), `readme_links.py` (outbound links plus anchored links into the files) and the enumeration list `r006.txt`, all under `$S`, which is `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/256db329-443e-4697-8e43-b3b7f7c74ec6/scratchpad`.

### Enumeration
```bash
{ for d in .claude .codex .cursor .devin .dsh .opencode .pi; do echo $d/README.md; done; for d in .claude .codex .cursor .devin .dsh .opencode .pi .vibe; do echo $d/SYNC.md; done; echo .vibe/README.md; } > $S/r006.txt
```
Expected: 16 lines. Rerun it at implement time, because other sessions keep moving main.

### Data Flow
Each writer reads its sources and the template, then writes the README. Its reviewer reads the same sources and the new README and returns findings. The main session applies confirmed findings, reruns every check and records the before and after numbers.

### Waves
One canary writer runs first on `.opencode/SYNC.md` (75 lines), because its inventory table feeds a test. The other 15 run in two waves of up to eight. Reviewers start as soon as their file's writer returns.

### Writer Brief Constraints
- A README follows the README scaffold and opens OVERVIEW with the four-row At a Glance table. A `SYNC.md` follows the sync manifest scaffold, and says how the runtime reads the folder before anything else.
- Give each fact one home: the manifest holds the full surface inventory, the format contract and the drift checks, and the README names each piece in one row and links the manifest.
- `.opencode/SYNC.md` keeps `## 2. SURFACE INVENTORY` as its second H2 with an H2 numbered 3 after it, and keeps every inventory row matching the disk, because `opencode-compat-layout.test.cjs` reads that table.
- `.vibe/README.md` is new: write it from the README scaffold with frontmatter `version: 1.0.0.0`, from `.vibe/SYNC.md`, `config.toml`, `hooks.toml` and the folder listing.
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
| `.skilled/bin/tests/opencode-compat-layout.test.cjs` | Reads `## 2. SURFACE INVENTORY` up to `## 3.` in `.opencode/SYNC.md` | Keep the heading, the numbering and every row | `pass 21` |
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
| Integration | Links into and out of the 16 files, and the code that reads them | `readme_links.py`, `test_readme_verdict_parity.py`, the sk-doc `run-script-tests.sh` suite and opencode-compat-layout.test.cjs |
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
| Setup | Phase 005 pushed to origin/main | Implementation |
| Implementation | The baseline and the passing checks from Setup | Verification |
| Verification | Every writer and reviewer session returned | The commit and push |
<!-- /ANCHOR:phase-deps -->

---
