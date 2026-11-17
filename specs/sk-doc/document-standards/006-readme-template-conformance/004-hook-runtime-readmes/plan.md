---
title: "Implementation Plan: Phase 4: hook-runtime-readmes"
description: "One DeepSeek writer session per README brings the 47 runtime adapter READMEs to the hook template's runtime folder scaffold, a different session checks each against its adapter and registration file, and the main session reruns every gate before one commit."
trigger_phrases:
  - "hook runtime readmes plan"
  - "hook runtime readmes rewrite waves"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: hook-runtime-readmes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown READMEs with YAML frontmatter |
| **Framework** | The runtime folder scaffold in the `sk-create-readme` hook template and the Human Voice Rules |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `h2model.py`, `readme_links.py`, hook-wiring-check.cjs --root . |

### Overview
The phase brings the 47 runtime adapter READMEs under `.skilled/hooks/<name>/<runtime>/` to the runtime folder scaffold. 44 of them name their file section FILES, which the scaffold calls DIRECTORY TREE, and 13 have no VALIDATION section. Each README names the event, the registration file, what the adapter reads and how it fails, all checked against the adapter and its registration.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The file list is rebuilt from disk with the enumeration command below and still holds 47 files
- [ ] The baseline for all 47 files is recorded in `$S/baseline-004-before.tsv`
- [ ] The link checker and every consumer test in the affected surfaces table pass before any edit
- [ ] The writer and reviewer briefs are rendered from this plan's constraints

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash $S/tools/baseline.sh` prints `✅ VALID`, `hard=0` and `emojiH=0` for all 47 files, and `readme_links.py` prints `0 problems`
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
- **Template** (`.skilled/skills/sk-doc/sk-create-readme/assets/hook-readme-template.md`): its section 5 runtime folder scaffold: OVERVIEW, DIRECTORY TREE, VALIDATION and RELATED. A flat runtime folder keeps the DIRECTORY TREE heading and may hold the file table alone, naming every file other than the README.
- **Writer sessions**: GPT-6 Luna at max on the fast tier through cli-codex for the canary. When the codex usage limit stopped the first wave, the operator switched to DeepSeek V4.1 Flash Max (`deepseek-v4-1-flash-1017-max`) through cli-devin in `dangerous` permission mode. When devin's daily quota ran out after three waves, the operator switched to DeepSeek V4.1 Flash at max through cli-opencode on the OpenCode Go route (`opencode-go/deepseek-v4.1-flash#max`). One README per session, started by `$S/run.sh` and driven in waves by `$S/drive.sh`. Each reads its sources, rewrites only its README and runs the per-file checks.
- **Reviewer sessions**: the same executor through `$S/run.sh`, never the session that wrote the file, told to write nothing. The main session compares `git status` with its snapshot after each wave. Each reviewer checks every path, command, count and list against the sources and returns findings.
- **Main session**: confirms each finding against the code before applying it, reruns every check itself and owns the commit.
- **Scratchpad checks**: `baseline.sh` (validator, voice scan and emoji heading count per file), `h2model.py` (H2 list against the template), `readme_links.py` (outbound links plus anchored links into the files) and the enumeration list `r004.txt`, all under `$S`, which is `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/256db329-443e-4697-8e43-b3b7f7c74ec6/scratchpad`.

### Enumeration
```bash
git ls-files '.skilled/hooks/**README.md' | awk -F/ 'NF==5' | grep -E '/(pi|dsh|devin|claude|cursor|codex|vibe)/README.md$' > $S/r004.txt
```
Expected: 47 lines. Rerun it at implement time, because other sessions keep moving main.

### Data Flow
Each writer reads its sources and the template, then writes the README. Its reviewer reads the same sources and the new README and returns findings. The main session applies confirmed findings, reruns every check and records the before and after numbers.

### Waves
One canary writer runs first on the shortest file, `mcp-route-guard/pi/README.md` (37 lines). The other 46 run in waves of four writers. The first three waves overlapped each wave's reviewers with the next wave's writers. That ran eight devin sessions, twice the four the operator approved, and hit devin's request rate limit. From wave 3 on, each wave's reviewers run after its writers, so no more than four sessions run at once. A wave that hits the provider's usage limit waits for the reset and re-dispatches only the sessions the limit stopped.

### Writer Brief Constraints
- Follow the runtime folder scaffold: an H1 of the form `[Runtime] [Concern Name]: [Event] Adapter`, no tagline, `---` before each numbered ALL-CAPS H2, and the four sections OVERVIEW, DIRECTORY TREE, VALIDATION and RELATED. A flat folder keeps the DIRECTORY TREE heading and holds a file table naming every file other than the README.
- OVERVIEW names the event, the file that registers the adapter, what the adapter reads first, the switch the adapter checks and how every failure ends. It calls `SYSTEM_HOOKS_DISABLED` the master switch only when the adapter's code path reaches the shared hook-flags resolver.
- Every file keeps VALIDATION, as goal D2 requires. The command is the adapter's own test, else a test that drives this adapter, else a stdin smoke run of the adapter file, else the registration check: `hook-wiring-check.cjs --root .` for Claude, Codex, Cursor and Devin, and the `hook-adapter-path-parity` suite for Pi. Run it from the repository root and state its result.
- The frontmatter `title` matches the H1. Keep `description` and `trigger_phrases` unless a value is wrong, and leave `version` alone, because the pre-commit gate raises it.
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
| Each runtime's registration file (`.claude/settings.json`, `.codex/hooks.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.vibe/hooks.toml`, `.pi/extensions/`, `.dsh/plugins/repo-guards/`) | Names the adapter each README describes | Read only, never edited | Reviewer confirms each README's registration line |
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
| Integration | Links into and out of the 47 files, and the code that reads them | `readme_links.py`, `test_readme_verdict_parity.py`, the sk-doc `run-script-tests.sh` suite and hook-wiring-check.cjs --root . |
| Manual | Fact accuracy and template fit | One reviewer session per README, every finding confirmed by the main session |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `python3`, `node`, `npx vitest` and `rg` | Internal | Green | No check can run |
| `codex` with the GPT-6 Luna route on the fast tier | External | Limit reached | The operator switched the drive to devin with DeepSeek V4.1 Flash Max |
| `devin` with `deepseek-v4-1-flash-1017-max` | External | Green | A usage-limit hit pauses the drive until the reset. A second hit in a row, or a reset hours away, stops it for an operator decision |
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
| Setup | Phase 003 pushed to origin/main | Implementation |
| Implementation | The baseline and the passing checks from Setup | Verification |
| Verification | Every writer and reviewer session returned | The commit and push |
<!-- /ANCHOR:phase-deps -->

---
