---
title: "Implementation Plan: Phase 1: skill-readmes"
description: "Five writer agents rewrite the 13 skill READMEs and write the sk-design one in disjoint batches, five different agents check each README's facts against its skill, and the orchestrator reruns every gate before one commit."
trigger_phrases:
  - "skill readmes plan"
  - "skill readme rewrite batches"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: skill-readmes

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
| **Testing** | `validate_document.py`, `hvr_scan.py`, a scratchpad link checker, the README verdict parity test, the spec-kit registry count test and the deep-loop drift check |

### Overview
The phase changes 13 skill READMEs and adds one for `sk-design`, all under `.skilled/skills/`. Writer agents rewrite them in five disjoint batches, and a second set of agents checks every fact against the skill's files. The orchestrator then reruns the validator, the voice scan, the link check and the three tests that read README content, and commits once.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] The baseline for all 14 files is recorded: `bash baseline.sh .skilled/skills/*/README.md` printed the lines quoted in `spec.md`
- [ ] The link checker and the three content tests pass before any edit
- [ ] Each writer has a disjoint file list and the brief below

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `bash baseline.sh` prints `✅ VALID` and `hard=0` for all 14 tracked skill READMEs, and `readme_links.py` prints `0 problems`
- [ ] The parity test prints `PARITY PASS`, the registry count test passes and the drift check exits 0
- [ ] Docs updated (spec/plan/tasks), and `validate.sh --strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template-driven rewrite with independent review.

### Key Components
- **Skill README template** (`.skilled/skills/sk-doc/sk-create-readme/assets/skill-readme-template.md`): the section model and checklist each README must meet.
- **Writer agents**: one Opus agent per batch. Each reads its skills' files, rewrites only its own READMEs and runs the per-file checks.
- **Reviewer agents**: one Opus agent per batch, never the batch's writer. Each checks every path, command, count and list against the skill's files and reports what is wrong.
- **Scratchpad checks**: `baseline.sh` (validator, voice scan and emoji heading count per file) and `readme_links.py` (outbound links plus anchored links into the files from anywhere in the repository). Both live in `/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Skilled/337e2d66-377c-4a62-99f7-86910ae24591/scratchpad/`.

### Data Flow
Each writer reads its skill's `SKILL.md`, router, registry and folders, then writes the README. Its reviewer reads the same sources and the new README and returns findings. The orchestrator applies confirmed findings, reruns every check and records the before and after numbers.

### Batches
- **A**: `system-spec-kit` (716 lines).
- **B**: `sk-git` and `system-skill-advisor` (609 lines).
- **C**: `sk-doc`, `sk-prompt` and `sk-code` (713 lines).
- **D**: `mcp-code-mode`, `mcp-tooling`, `cli-external-orchestration` and `cli-classifier` (650 lines).
- **E**: `system-skilled-doctor`, `system-deep-loop`, `cli-orca` and the new `sk-design` README.

### Writer Brief Constraints
- Follow the template's section model and checklist. Keep frontmatter `title`, `description` and `trigger_phrases` unless a value is wrong, and leave `version` alone, because the pre-commit gate raises it.
- Keep exact commands, paths, flags and file names where a reader acts on them. State each command's expected output, running it first when it is read-only.
- In prose, link text is plain words. Wording stays provider agnostic.
- Keep what code reads: the `42-rule registry` phrase in the spec-kit README, every registered packet folder name followed by `/` in the deep-loop README, the `## 4. ADAPTING TO YOUR STACK` heading in the sk-code README unless the root README link is updated with it, and every `readme-check` block that still matches a target.
- Keep a `README.md` at every hub root, because `parent-skill-check.cjs` lists it as a file the hub owns.
- Keep the sk-git and spec-kit `readme-check` blocks resolving: `check_readme_references.py` must still print `unresolved=0` for both.
- Edit only the assigned READMEs and run no git command.
- No AI Council emphasis. Link text in prose is plain words, and wording is provider agnostic.
- Report every command run with its exit status.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-doc/scripts/tests/code-folder/baseline-readme-verdicts.json` | Holds the validator verdict the CI parity test expects for every README | Update the entries whose verdict changes | `test_readme_verdict_parity.py` prints `PARITY PASS` |
| `README.md` line 311 | Links to `.skilled/skills/sk-code/README.md#4-adapting-to-your-stack` | Unchanged unless that heading changes | `readme_links.py` reports 0 inbound problems |
| `validator-registry-doc-count.vitest.ts` | Reads `42-rule registry` from the spec-kit README | Not a consumer of the rewrite if the phrase stays | The test passes |
| `check-documentation-drift.cjs` | Requires each registered packet name in the deep-loop README | Not a consumer of the rewrite if every name stays | The script exits 0 |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Maps README `trigger_phrases` to paths | Regenerate only if a phrase changes | `git diff --stat` on the index after regeneration |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the baseline and confirms every check passes before an edit. Implementation runs the five writer batches in parallel, then five reviewers. Verification reruns the baseline, the link check and the three content tests, then commits, merges origin/main and pushes. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each README's structure and voice | `validate_document.py` prints `VALID`, `hvr_scan.py` reports `hard blockers: 0` |
| Integration | Links into and out of the 14 files, and the code that reads them | `readme_links.py`, `test_readme_verdict_parity.py`, the registry count vitest and `check-documentation-drift.cjs` |
| Manual | Fact accuracy and template fit | A reviewer agent per batch, findings confirmed by the orchestrator |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `python3`, `node`, `npx vitest` and `rg` | Internal | Green | No check can run |
| Opus subagents | Internal | Green | The rewrite runs serially in this session instead |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a check fails after the push, or a reader finds a README states something false.
- **Procedure**: `git revert <phase commit>` restores every README and the verdict baseline in one commit, because the phase lands as one commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Nothing | Implementation |
| Implementation | The baseline and the passing checks from Setup | Verification |
| Verification | Every writer and reviewer batch returned | The commit and push |
<!-- /ANCHOR:phase-deps -->

---
