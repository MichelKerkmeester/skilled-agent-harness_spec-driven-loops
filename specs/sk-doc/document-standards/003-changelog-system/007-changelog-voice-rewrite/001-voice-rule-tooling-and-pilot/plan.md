---
title: "Implementation Plan: Phase 1: voice-rule-tooling-and-pilot"
description: "Amend the voice rule, copy and adapt the earlier retrofit's briefs and driver to a sentence and voice rewrite, then pilot it on 20 files with a second-model fact check."
trigger_phrases:
  - "voice rule tooling and pilot plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 1: voice-rule-tooling-and-pilot

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, Node.js 22 for the driver, Python 3 for the checks. Worker: `vibe` 3.1.2 with `deepseek-flash` at high. Fact check: `cli-codex` with `gpt-6-luna` at `xhigh`, `fast` tier |
| **Framework** | None |
| **Storage** | `../scratch/state.jsonl`, one JSON row per dispatch |
| **Testing** | `check_changelog_shape.py`, `hvr_scan.py`, `measure-voice.py` and a second-model fact check |

Unknowns: the real tokens per file and the pass rate of the chosen model pair. The pilot measures both. Neither needs `/deep:research`.

### Overview
Two rule files change, so a retrofit the operator approves may edit a released changelog. The earlier retrofit's tooling is copied into `../scratch/` and adapted: the brief asks for short sentences and plain words with every fact kept, and the driver gates on the sentence rules, the voice scan and a fact check. A 20-file pilot proves it before any wave runs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `measure-voice.py ../scratch/lists/pilot.txt` prints `avg_words` of 10 or less and `sentences_over_22=0` on the kept files
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Gated batch rewrite

### Key Components
- **`../scratch/brief-rewrite.md`**: tells the executor to split and simplify sentences while keeping every fact. Without it the earlier format brief would restructure entries again.
- **`../scratch/brief-verify.md`**: tells a second executor, with no write access, to list anything dropped, added or changed. Without it the rewriter is its own only judge.
- **`../scratch/rewrite-driver.cjs`**: runs one file per dispatch, reruns every gate, retries up to three attempts and restores on failure. It adds token counts to each state row and a `--dry-run` mode, which the earlier driver lacks. For each rewrite it makes a fresh `VIBE_HOME`, copies `.vibe/config.toml` there, sets the `deepseek-flash` row to `thinking = "high"`, renders the repository hooks into that home and reads `usage` from `export.json`.

### Data Flow
The driver reads a list file. For each file it saves the original, sends the rewrite brief, runs the shape check, the voice scan and the fact check on the result, and writes one row to `state.jsonl`. A file that fails three attempts is restored from HEAD.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this is a refactor of prose, not a fix of a reported finding. The one shared contract it touches, the voice rule, is listed in `spec.md` under Files to Change.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup splits the scope list and copies the earlier tooling. Implementation amends the voice rule and adapts the briefs and driver. Verification runs the 20-file pilot and reports its numbers and tokens.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The driver's gate logic on one file that passes and one built to fail | The new `--dry-run` mode of `../scratch/rewrite-driver.cjs` |
| Integration | The 20 pilot files through every gate | `rewrite-driver.cjs`, `check_changelog_shape.py`, `hvr_scan.py` |
| Manual | The operator reads the pilot rewrites against the originals | `git diff` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `../../002-skill-changelog-retrofit/scratch/` tooling | Internal | Green | The driver is written from scratch, which costs a day |
| `vibe` 3.1.2 and `MISTRAL_API_KEY` for the worker | External | Green | No rewrite can run |
| `codex-cli` 0.169.0, logged in with ChatGPT, with `gpt-6-luna` quota for the fact check | External | Yellow | The run stops and asks. It never moves the check to another provider |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a kept pilot file is found to have lost or changed a fact.
- **Procedure**: `git checkout HEAD -- <file>` before commit, or `git revert <commit>` after it. The rule amendment reverts with its own commit.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 002 and every later phase |
<!-- /ANCHOR:phase-deps -->

---
