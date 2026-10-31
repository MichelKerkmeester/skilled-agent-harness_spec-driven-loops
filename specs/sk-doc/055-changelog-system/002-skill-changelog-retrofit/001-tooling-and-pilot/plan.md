---
title: "Implementation Plan: Phase 1: tooling and pilot"
description: "A driver sends one changelog per dispatch to GPT-6 Luna on cli-pi and cli-codex. It keeps a rewrite only when it passes a shape checker, the HVR scan and a separate fact check, and otherwise restores the original. A ten-file pilot sets the style before the per-skill waves."
trigger_phrases:
  - "changelog retrofit plan"
  - "changelog rewrite driver"
  - "changelog shape checker"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: tooling and pilot

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown targets, with a Python checker and a Node driver |
| **Framework** | sk-create-changelog's compact and expanded format contract |
| **Storage** | The changelog files in place, with run records in `../scratch/` |
| **Testing** | The shape checker, `hvr_scan.py` and a fact-check dispatch per file |

### Overview
Each changelog is rewritten by its own dispatch. GPT-6 Luna runs at xhigh for the rewrite and at high for the fact check, through the GPT plan on cli-pi and cli-codex, with LLM Gateway only while that plan reports a usage limit. A rewrite stays only when all three gates pass. A ten-file pilot covering every legacy style is reviewed before phases 002 to 016 run the remaining files, one commit per skill.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [x] Tests passing (checker calibration and the pilot's gate reruns)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A queue with two worker lanes. Each file passes through a chain of gates, and any failed gate restores the file.

### Key Components
- **`../scratch/check_changelog_shape.py`**: encodes the contract's structure rules. Given the original, it also rejects changed frontmatter and any identifier or number the original lacks. The canonical exemplar passes it.
- **`../scratch/brief-rewrite.md`**: the one-file rewrite brief. Its fact rules outrank its style rules, and the executor runs both checks itself before handing back.
- **`../scratch/brief-verify.md`**: a no-tools review of the original beside the rewrite. It returns unsupported, dropped, distorted and padding items as JSON.
- **`../scratch/rewrite-driver.cjs`**: runs the lanes, reruns every gate itself, retries with the findings up to three attempts in all, restores failures and records each file to a state file. It refuses any path that is not a skill changelog, and it refuses the exemplar.

### Data Flow
The original is copied to `../scratch/orig/`. The rewrite dispatch edits the file in place. The driver runs the checker and the HVR scan, then the fact-check dispatch. A failure sends the findings back for another attempt. Three failures restore the original and keep the draft in `../scratch/failed/`. Both folders name each file after its path with slashes turned into `__`, so the names start with a dot and `ls -A` shows them.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Skill changelogs | Release history read by operators | Rewritten in place | Checker, HVR scan and fact check per file |
| `.skilled/changelog/*` | Links into the skill changelog folders | Unchanged, since they follow the files | `ls -la .skilled/changelog` shows the links |
| Compiled routing manifests | Fingerprint skill trees | Re-minted by the pre-commit gate when needed | `compiled-route-guard.cjs` after each skill commit |
| Mirror generators | Copy skill files to other runtimes | Checked, not edited | Each generator's `--check` after each skill commit |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Calibration | The checker against the exemplar, the compliant files and legacy files | `check_changelog_shape.py` |
| Per file | Shape, voice and fidelity of each rewrite | Checker, `hvr_scan.py`, the fact-check dispatch |
| Manual | Every pilot file, old beside new | The orchestrator's read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| GPT-6 Luna through the GPT plan (cli-pi `openai-codex`, cli-codex) | External | Green, smoke-tested 2026-09-24 | The driver moves to the gateway route |
| GPT-6 Luna through LLM Gateway | External | Green, per `.pi/custom-providers.md` | The run pauses until the plan resets |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a kept rewrite turns out to have lost or invented a fact.
- **Procedure**: restore the file from `../scratch/orig/` or with `git checkout -- <file>` before it is committed, or from the commit before its wave after.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup (checker, briefs, driver) ──► Pilot (10 files) ──► Operator style approval ──► Phases 002 to 016
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Pilot |
| Pilot | Setup | Approval |
| Approval | Pilot review | Phases 002 to 016 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | Done on 2026-09-24 |
| Pilot | Low | Run 2 took 217 to 2,172 seconds per file, 32 GPT dispatches for ten files |
| Approval | Low | One operator review |
| **Total** | | **One session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created: every original is copied to `../scratch/orig/` before its dispatch, and git holds the rest
- [x] Stop switch: a `../scratch/STOP` file ends the run after the files in flight
- [x] Monitoring: `../scratch/driver-status.json` and the driver log record every result

### Rollback Procedure
1. Create `../scratch/STOP` to halt the run.
2. Restore any file from `../scratch/orig/` or from git.
3. Rerun the checker over the restored files.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: `git checkout` of the affected files
<!-- /ANCHOR:enhanced-rollback -->
