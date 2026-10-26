---
title: "Implementation Plan: Phase 14: removed-template-reality-sweep"
description: "Two read-only sweeps list every leftover mention of the three deleted add-on templates and every doc that no longer matches the shipped code. The conductor checks each finding, DeepSeek dispatches fix them one batch at a time, and both sweeps rerun clean from the final tree."
trigger_phrases:
  - "removed template reality sweep plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 14: removed-template-reality-sweep

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one output branch. Prove it with a line count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, a few TypeScript test comments |
| **Framework** | system-spec-kit docs, commands, agents and the runtime mirrors |
| **Storage** | None |
| **Testing** | The two sweeps rerun from the final tree, `sync-skills-hermes.cjs --check` and `validate.sh --strict` |

### Overview
Two Opus medium auditors sweep the repository read-only and write their findings to `scratch/audit-mentions.md` and `scratch/audit-reality.md`. The conductor checks each finding, DeepSeek V4.1 Flash max through cli-pi fixes the confirmed ones, one brief per batch, and a fresh Opus medium agent reviews the diff. Both sweeps rerun from the final tree with zero stale hits, and the Hermes check prints PASS. Both sweeps exclude `specs/**`, `changelog/` folders, the generated trigger index and retrieval fixtures, and the deep loops' own map docs.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `rg -n 'quiet' recommend-level.sh` prints the new branch before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `ls scratch/` lists `audit-mentions.md` and `audit-reality.md`
- [ ] Each audit file records the sweep commands it ran

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `recommend-level.sh`. WEAK: Standard architecture. -->

### Pattern
Audit, fix, re-audit. The sweeps find, the conductor confirms, the executor edits.

### Key Components
- **The mention sweep**: lists every line that still names before-after, roadmap or resource-map as a spec-kit template or add-on, in READMEs, skill docs, commands, agents, the runtime mirrors and runtime code comments.
- **The reality sweep**: checks each doc that states the add-on set, the template total, `--with-lazy-addons`, the card's validate step, the repair hint order or id numbering against `templates/addons/`, `create.sh`, the card, `runtime/lib/validation/orchestrator.ts` and the templates.

### Data Flow
Each sweep writes one result table to `scratch/`. The conductor marks each row stale or not stale, groups the stale rows into batches and hands each batch to one fix brief. The reviewer reads the diff, and the sweeps run again.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `recommend-level.sh`: owns the output. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `templates/addons/`, `create.sh`, the card, `orchestrator.ts` | Own the shipped behavior the docs describe | unchanged | The reality sweep reads them as the source of truth |
| READMEs, skill docs, commands, agents, runtime mirrors, code comments | Describe that behavior | update where stale | Both sweeps rerun with zero stale hits |
| The deep loops' own `resource-map.md` output docs | Describe a file that still ships | not a consumer | Each sweep row records why it is not stale |
| `.hermes/skills/` copies | Mirror the skill docs | update by sync | `sync-skills-hermes.cjs --check` prints PASS |

Known first hit: `.skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts:486` calls `resource-map.md` "the addon".
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads the current output. Implementation adds the branch. Verification counts lines. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup records the sweeps, Implementation fixes the hits and syncs Hermes, and Verification reruns the sweeps, reviews the diff and validates.

### Step 1: Record both sweeps

Acceptance: both audit files exist and list their commands and their hits.
Verify: `ls scratch/audit-mentions.md scratch/audit-reality.md` prints both paths.

### Step 2: Fix every confirmed hit

Acceptance: every row the conductor marked stale has a fix in the diff.
Verify: `rg -n 'the addon' .skilled/skills/system-spec-kit/runtime/cli/tests/upgrade-legacy.vitest.ts` prints nothing.

### Step 3: Sync the Hermes copies

Acceptance: the Hermes copies match their sources.
Verify: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` prints `PASS`.

### Step 4: Rerun, review and validate

Acceptance: both sweeps find zero stale hits, the reviewer finds no wrong rewrite, and the folder validates.
Verify: `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `--quiet` prints 1 line. The default prints 17. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Sweep | Mentions of the three deleted templates outside the exclusions | The `rg` commands recorded in `scratch/audit-mentions.md`, rerun from the final tree; zero stale hits |
| Reality | Add-on set, template total, `--with-lazy-addons`, validate step, repair hint, id numbering | The checks recorded in `scratch/audit-reality.md`, rerun from the final tree; zero contradictions |
| Mirror | The Hermes copies | `sync-skills-hermes.cjs --check` prints `PASS` |
| Review | The whole diff | A fresh Opus medium agent reads it and reports no wrong rewrite |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| LLM Gateway, DeepSeek V4.1 Flash max through cli-pi | External | Green | Rerun the brief on cli-codex Luna |
| Phase 013's final working tree | Internal | Green | The sweeps check a moving target; rerun them from the final tree |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: the default output changes. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a fix rewrites a correct line, such as one about the deep loops' own map.
- **Procedure**: revert this phase's doc edits in its one commit with `git revert`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (sweeps) ──► Implementation (fixes, Hermes sync) ──► Verification (rerun, review, validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 013's final tree | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
<!-- FILL: Give each phase an estimate and a total. Mark the total as an assumption. Write `N/A` with one reason, or delete the whole section. GOOD: Setup 10 minutes, implementation 30, verification 10. Total 50 minutes. WEAK: A few hours. -->

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20 minutes, the sweeps run in parallel |
| Core Implementation | Med | 60 minutes, one brief per batch |
| Verification | Low | 30 minutes |
| **Total** | | **About 2 hours (assumption)** |
<!-- /ANCHOR:effort -->

---
