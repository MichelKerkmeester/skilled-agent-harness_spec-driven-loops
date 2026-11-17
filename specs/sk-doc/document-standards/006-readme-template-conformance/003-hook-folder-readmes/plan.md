---
title: "Implementation Plan: Phase 3: hook-folder-readmes"
description: "One DeepSeek writer session per README brings the 26 hook folder READMEs to the hook template's folder scaffold, a different session checks each runtime row against the adapters and their registration files, and the main session reruns every gate before one commit."
trigger_phrases:
  - "hook folder readmes plan"
  - "hook folder readmes rewrite waves"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: hook-folder-readmes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown READMEs with YAML frontmatter |
| **Framework** | The `sk-create-readme` hook folder template and the Human Voice Rules |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `h2model.py`, `readme_links.py`, goal-doc-contract.test.cjs, completion-evidence-sentinel.vitest.ts, advisor-runtime-list-parity.vitest.ts, git-setup-check.test.cjs |

### Overview
The phase brings the 26 hook folder READMEs under `.skilled/hooks/<name>/` to the hook template's folder scaffold. 24 already carry its section list, so most of the work is the fact check: every RUNTIME COVERAGE row must match the adapter on disk and the file that registers it. Four READMEs are symlinks. Three already follow the template and are fact-checked in place, and the skill advisor one is rewritten at its target, `.skilled/skills/system-skill-advisor/hooks/skill-advisor-hook.md`, as the operator chose.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The file list is rebuilt from disk with the enumeration command below and still holds 26 files
- [ ] The baseline for all 26 files is recorded in `$S/baseline-003-before.tsv`
- [ ] The link checker and every consumer test in the affected surfaces table pass before any edit
- [ ] The writer and reviewer briefs are rendered from this plan's constraints

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash $S/tools/baseline.sh` prints `✅ VALID`, `hard=0` and `emojiH=0` for all 26 files, and `readme_links.py` prints `0 problems`
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
- **Template** (`.skilled/skills/sk-doc/sk-create-readme/assets/hook-readme-template.md`): the folder scaffold in its section 4: OVERVIEW, HOW IT WORKS, RUNTIME COVERAGE, DIRECTORY TREE, KEY FILES, CONFIGURATION, VALIDATION and RELATED. HOW IT WORKS is kept only when the core makes decisions worth explaining, and a hand-started concern may put QUICK START in its place, as session handover does.
- **Writer sessions**: DeepSeek V4.1 Flash at max through cli-opencode, one README per session, started by `$S/dispatch.sh`. Each reads its sources, rewrites only its README and runs the per-file checks.
- **Reviewer sessions**: the same model through `$S/review.sh`, never the session that wrote the file. Each checks every path, command, count and list against the sources read-only and returns findings.
- **Main session**: confirms each finding against the code before applying it, reruns every check itself and owns the commit.
- **Scratchpad checks**: `baseline.sh` (validator, voice scan and emoji heading count per file), `h2model.py` (H2 list against the template), `readme_links.py` (outbound links plus anchored links into the files) and the enumeration list `r003.txt`, all under `$S`, which is `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/256db329-443e-4697-8e43-b3b7f7c74ec6/scratchpad`.

### Enumeration
```bash
git ls-files '.skilled/hooks/**README.md' | awk -F/ 'NF==4' | grep -v '^.skilled/hooks/shared/README.md$' > $S/r003.txt
```
Expected: 26 lines. Rerun it at implement time, because other sessions keep moving main.

### Data Flow
Each writer reads its sources and the template, then writes the README. Its reviewer reads the same sources and the new README and returns findings. The main session applies confirmed findings, reruns every check and records the before and after numbers.

### Waves
One canary writer runs first on `classifier-injection-screen` (163 lines). The other 25 run in waves of up to eight sessions. A symlinked README is written at its target path, and the two sk-git hooks share one target, so that file gets one writer and one reviewer. Reviewers start as soon as their file's writer returns.

### Writer Brief Constraints
- Follow the folder scaffold: an H1 that names the concern and what it does, no tagline, `---` before each numbered ALL-CAPS H2, and only the section names in the template's section model.
- RUNTIME COVERAGE has one row for each of the eight runtimes in the hooks coverage matrix: Claude, Codex, Cursor, Devin, OpenCode, Pi, DSH and Vibe. Each covered row names the entry and the real file, and the text after the table names the registration file per runtime: `.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, the `.opencode/plugins/` glob, the Pi extension entry, the DSH guard bundle and `.vibe/hooks.toml`.
- A symlinked README is edited at its target, and every relative link is written from the target's folder.
- The skill advisor hook doc keeps one `| **Runtime** |` row with a bold first cell for each runtime folder under `.skilled/hooks/skill-advisor/`, because `advisor-runtime-list-parity.vitest.ts` reads that pattern.
- The goal README keeps every backticked repository path real and names only goal switch names that `hook-flags.cjs` declares, because `goal-doc-contract.test.cjs` reads it.
- The completion evidence README keeps `display: false`, `deliverAs: "nextTurn"` and `model-visible` near the words next turn, because `completion-evidence-sentinel.vitest.ts` reads it.
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
| `.opencode/plugins/tests/goal-doc-contract.test.cjs` | Reads the goal README's paths and switch names | Keep both real | `pass 5` |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts` | Reads delivery terms from the completion evidence README | Keep the terms | `Tests 33 passed` |
| `.skilled/skills/system-skill-advisor/runtime/tests/hooks/advisor-runtime-list-parity.vitest.ts` | Reads bold runtime rows from the skill advisor hook doc | Keep one bold row per runtime folder | `Tests 2 passed` |
| `.skilled/commands/doctor/scripts/git-setup-check.cjs:107` | Points repairs at section 3 of the sk-git hooks README | Keep the registration steps in section 3 | `pass 86` |
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
| Integration | Links into and out of the 26 files, and the code that reads them | `readme_links.py`, `test_readme_verdict_parity.py`, the sk-doc `run-script-tests.sh` suite and goal-doc-contract.test.cjs, completion-evidence-sentinel.vitest.ts, advisor-runtime-list-parity.vitest.ts, git-setup-check.test.cjs |
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
| Setup | Phase 002 pushed to origin/main | Implementation |
| Implementation | The baseline and the passing checks from Setup | Verification |
| Verification | Every writer and reviewer session returned | The commit and push |
<!-- /ANCHOR:phase-deps -->

---
