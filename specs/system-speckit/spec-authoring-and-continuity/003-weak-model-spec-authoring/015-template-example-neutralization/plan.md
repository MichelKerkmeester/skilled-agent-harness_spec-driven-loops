---
title: "Implementation Plan: Phase 15: template-example-neutralization"
description: "The conductor takes guard and census baselines and writes a replacement table for the 87 lines the sweep found. DeepSeek V4.1 Flash max through cli-pi applies it one file per brief, the golden snapshot is regenerated, and the guards, the census and a fresh Opus medium review prove nothing else moved."
trigger_phrases:
  - "template example neutralization plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 15: template-example-neutralization

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one output branch. Prove it with a line count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown template comments; one vitest snapshot file |
| **Framework** | system-spec-kit templates, the authoring card and the CLI test project |
| **Storage** | None |
| **Testing** | vitest (`template-fill-guidance`, `scaffold-golden-snapshots`), `check-card-sync.sh`, `check-example-drift.sh`, `sync-skills-hermes.cjs --check`, the strict census |

### Overview
The change rewrites 87 example lines in 11 templates and the authoring card so they tell one neutral story, a `--keep <n>` option for a fictional `scripts/rotate-logs.sh`, instead of the benchmark's `--quiet` flag for `recommend-level.sh`. The conductor writes every old and new line into one replacement table, and DeepSeek V4.1 Flash max through cli-pi applies it one file per brief, with cli-codex `gpt-6-luna` as the fallback. The proof is the term gate dropping from 63 to 0, every guard printing its baseline pass line, an unchanged strict census and a fresh Opus medium review of the diff.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `rg -n 'quiet' recommend-level.sh` prints the new branch before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `ls scratch/baseline/` lists the census and guard baselines
- [ ] `scratch/replacements.md` holds one row per line in `scratch/example-sweep.md`, 87 in all

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `recommend-level.sh`. WEAK: Standard architecture. -->

### Pattern
Table-driven literal rewrite. The conductor decides every new line; the executor only applies it.

### Key Components
- **The replacement table** (`scratch/replacements.md`): one row per swept line with file, line, old GOOD and WEAK text and new GOOD and WEAK text, all in the `rotate-logs.sh --keep` story.
- **The fill notes**: `<!-- FILL: ... GOOD: ... WEAK: ... -->` comments in `templates/core/` and `templates/addons/`. Only the example text after `GOOD:` and `WEAK:` changes; the instruction before `GOOD:` stays.
- **The golden snapshot**: rendered from the templates by `scaffold-golden-snapshots.vitest.ts`, so it is regenerated, never hand-edited.

### Data Flow
The sweep feeds the table, the table feeds one brief per file, and each brief's diff is checked against the table before the next goes out. After the last file the snapshot is regenerated and the guards and census run once over the final tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `recommend-level.sh`: owns the output. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `templates/core/*.tmpl`, `templates/addons/*.tmpl` fill notes | Show a model what a good section looks like | update | The term gate prints 0; `template-fill-guidance.vitest.ts` prints `24 passed` |
| `references/workflows/spec-authoring-card.md` sections 6 and 7 | Show the Step shape and the task-line shape | update | The card check in `spec.md` REQ-002; `check-card-sync.sh` prints `CARD SYNC OK` |
| `runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap` | Pins the rendered templates | update by regeneration | `scaffold-golden-snapshots.vitest.ts` prints `12 passed` without `-u` |
| `templates/examples/level-*` | Filled examples a model reads | not a consumer | `check-example-drift.sh` prints `EXAMPLE_DRIFT_OK`; the sweep found no task term there |
| Existing spec packets | Carry copies of the old fill notes | not a consumer | The strict census diff prints nothing |
| `.hermes/skills/system-spec-kit/SKILL.md` | Mirrors the skill doc | unchanged | `sync-skills-hermes.cjs --check` prints `PASS` |
| `recommend-level.sh`, `validate.sh --quiet` and their tests and docs | Real tools | unchanged | `git diff --name-only -- . ':!specs' \| wc -l` prints 13 |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads the current output. Implementation adds the branch. Verification counts lines. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup takes the baselines and writes the table, Implementation applies it file by file and regenerates the snapshot, and Verification reruns the guards and census, reviews the diff and validates.

### Step 1: Baselines and the replacement table

Acceptance: the census and guard baselines exist, and the table has one row for each of the 87 swept lines.
Verify: `cat scratch/baseline/census-before-*.tsv | wc -l` prints 4719, and `rg -c '^\| [a-z-]+\.md(\.tmpl)?:[0-9]+ ' scratch/replacements.md` prints 87.

### Step 2: Apply the table, one file per brief

Acceptance: each of the 12 files changed exactly its swept lines, and no fill note matches the term regex `G` from `spec.md`.
Verify: `rg -i -e "$G" .skilled/skills/system-spec-kit/templates/core .skilled/skills/system-spec-kit/templates/addons | rg 'FILL:' | wc -l` prints 0.

### Step 3: Regenerate the snapshot and run the guards

Acceptance: the snapshot is regenerated, and the tests and guards print their baseline pass lines.
Verify: the snapshot test without `-u` prints `12 passed`, the fill-guidance test prints `24 passed`, and the two guards print `CARD SYNC OK` and `EXAMPLE_DRIFT_OK`.

### Step 4: Census, review and validate

Acceptance: the census is unchanged, the reviewer passes the diff, and the folder validates.
Verify: `diff <(sort scratch/baseline/census-before.tsv) <(sort scratch/baseline/census-after.tsv)` prints nothing, and `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `--quiet` prints 1 line. The default prints 17. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Term gate | Fill notes in `templates/core` and `templates/addons`, and the card | The REQ-001 and REQ-002 `rg` commands; 0 hits and 7 tool lines |
| Shape | Every fill note keeps GOOD then WEAK | `template-fill-guidance.vitest.ts`: `24 passed` |
| Snapshot | The rendered templates | `scaffold-golden-snapshots.vitest.ts`: `12 passed` after regeneration |
| Guards | Card wiring and example anchors | `check-card-sync.sh`: `CARD SYNC OK`; `check-example-drift.sh`: `EXAMPLE_DRIFT_OK` |
| Census | 4,719 existing folders under strict validation | `strict-census.mjs` over the phase 010 shards, before and after; sorted diff empty |
| Mirror | The Hermes copies | `sync-skills-hermes.cjs --check`: `PASS` |
| Review | The whole diff against the table | A fresh Opus medium agent ends `scratch/review.md` with `VERDICT: PASS` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| LLM Gateway, DeepSeek V4.1 Flash max through cli-pi | External | Green | Rerun the same brief on cli-codex `gpt-6-luna` |
| `strict-census.mjs` and the shard lists in `010-deep-review-finding-fixes/scratch/` | Internal | Green | No census proof; the phase cannot close |
| The built orchestrator `runtime/dist/lib/validation/orchestrator.js` in this checkout | Internal | Green | Rebuild with `npm run build` in `runtime/cli` before the census |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: the default output changes. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: a guard, test or census row changes from its baseline, or the reviewer finds a marker, anchor or instruction text changed.
- **Procedure**: before commit, `git checkout --` the one file the failing brief touched and rerun that brief; after commit, `git revert` the phase commit.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (baselines, table) ──► Implementation (12 briefs, snapshot) ──► Verification (guards, census, review, validate)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 014's final tree | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close, and phase 016 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
<!-- FILL: Give each phase an estimate and a total. Mark the total as an assumption. Write `N/A` with one reason, or delete the whole section. GOOD: Setup 10 minutes, implementation 30, verification 10. Total 50 minutes. WEAK: A few hours. -->

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Med | 45 minutes: the census runs in three shards while the conductor writes the table |
| Core Implementation | Low | 60 minutes: 12 short briefs, each checked before the next |
| Verification | Low | 40 minutes: the census rerun and the review run in parallel |
| **Total** | | **About 2.5 hours (assumption)** |
<!-- /ANCHOR:effort -->

---
