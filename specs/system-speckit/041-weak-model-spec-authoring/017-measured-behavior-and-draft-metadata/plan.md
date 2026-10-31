---
title: "Implementation Plan: Phase 17: measured-behavior-and-draft-metadata"
description: "Take the census and suite baselines, then build the two changes one brief each through DeepSeek V4.1 Flash max on cli-pi: a Measured behavior block with a warning-only rule for new-version specs, and Draft-only derived-metadata auto-repair in the validate CLI. A fresh Opus medium agent reviews, and the conductor runs the build, tests, census and Hermes gates."
trigger_phrases:
  - "measured behavior and draft metadata plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 17: measured-behavior-and-draft-metadata

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one output branch. Prove it with a line count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (orchestrator), Bash (rule, validate.sh), Markdown (template, docs) |
| **Framework** | system-spec-kit validator: `validate.sh` front-end, `orchestrator.ts`, registry rules |
| **Storage** | None; the auto-repair rewrites a packet's own metadata files |
| **Testing** | Vitest in `runtime/cli/tests/`, the 010 census tools, `check-card-sync.sh`, `check-example-drift.sh`, `sync-skills-hermes.cjs --check` |

### Overview
Change 1 adds a short `measured-behavior` block to `templates/core/spec.md.tmpl` after the `problem` anchor and a `MEASURED_BEHAVIOR` registry rule that warns, only for specs at the new stamp, when the block is missing or empty. Change 2 adds a Draft-only auto-repair to the orchestrator's CLI entry: when every error is a derived-metadata rule it spawns `repair-derived.cjs --apply` with the switch off, prints what it rewrote and revalidates. Two new Vitest files prove both, the strict census over the 010 shard lists proves no existing packet changes verdict or warning count, and the Hermes check proves the docs synced.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `rg -n 'quiet' recommend-level.sh` prints the new branch before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] `git log -1 --format=%s -- .skilled/skills/system-spec-kit/templates/core/spec.md.tmpl` names a phase 015 or 016 commit, so both have landed
- [ ] `ls scratch/baseline/` lists `census-before.tsv`, `rules-before.tsv` and `suite-before.txt`

### Definition of Done
- [ ] Every row in `acceptance-criteria.md` is Met
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. GOOD: Single script branch. The component is `recommend-level.sh`. WEAK: Standard architecture. -->

### Pattern
Version-gated warning, CLI-only repair.

### Key Components
- **`measured-behavior` block**: an anchor holding `### Measured Behavior`, a fill note and a fenced command-and-output block, placed right after the line that closes the `problem` anchor (`templates/core/spec.md.tmpl:107`). It has no H2, so `requiredTemplateSections` (`runtime/lib/validation/orchestrator.ts:662-697`) counts it neither required nor optional and no existing doc gains a required anchor.
- **`MEASURED_BEHAVIOR` rule** (`runtime/cli/rules/check-measured-behavior.sh`, registry severity `warn`): reads the `SPECKIT_TEMPLATE_SOURCE` stamp of `spec.md` the way `carriesTokenGateStamp` does (`orchestrator.ts:730-744`), with its own minimum set to the new stamp; below it the rule passes as not applicable.
- **Draft auto-repair** (`orchestrator.ts` CLI entry, `:1512-1517`): after `validateFolder`, if the report failed, `specStatusIsDraft(folder)` (`:773`) is true, every error rule is in the derivable set and the switch is on, it runs the repair, prints its rewrites and replaces the report with a second `validateFolder` run. `validateFolder` itself (`:1320`) stays read-only, so `strict-census.mjs` and `rule-census.mjs`, which import it directly, never write.

### Data Flow
`validate.sh` calls the orchestrator CLI per folder (`runtime/cli/spec/validate.sh:376` and `:410`). The CLI builds the report; on a qualifying Draft failure it spawns `node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder <packet> --apply` from the repository root, because the script resolves paths against its working directory (`repair-derived.cjs:39`), with `SPECKIT_DRAFT_AUTO_REPAIR=0` in its environment, because it runs `validate.sh --json` itself (`repair-derived.cjs:171`). The derivable set is `repair-derived.cjs`'s `DERIVABLE` (`:76-83`) less `SPEC_DOC_INTEGRITY`, which it repairs only in part (`:70-75`). On repair failure the original report and the existing hint (`writeRepairHint`, `orchestrator.ts:1485-1503`) print unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES
<!-- FILL: Name each surface the change touches. Write `not a consumer` when it does not read the change. Write `N/A` or delete the whole addendum when no fix surface applies. GOOD: `recommend-level.sh`: owns the output. Action: update. WEAK: Various files. -->

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `templates/core/spec.md.tmpl` and `templates/examples/level-*/spec.md` | Scaffold source and the examples a model reads | update | `check-example-drift.sh` exits 0; `template-structure.vitest.ts` passes |
| `validator-registry.json`, `validate.sh --help` | List every rule | update | `validator-registry-doc-count.vitest.ts` and `validate-help-lists-every-rule.vitest.ts` pass |
| `orchestrator.ts` CLI entry, `writeRepairHint` | Prints the report and the repair offer | update | `draft-auto-repair.vitest.ts` passes |
| `repair-derived.cjs` | Rewrites derived metadata | unchanged | `repair-derived.vitest.ts` still passes |
| `strict-census.mjs`, `rule-census.mjs`, any `validateFolder` importer | Library callers | not a consumer | Census diff prints nothing; `git status --porcelain specs/` is the same before and after the census |
| Card section 9, `SKILL.md`, `validation-rules.md`, `ENV-REFERENCE.md`, READMEs with "41-rule registry" | Describe validator behavior | update | `check-card-sync.sh` prints `CARD SYNC OK`; `rg -n '41-rule registry'` prints nothing |
| `.hermes/skills/` copies | Mirror the skill docs | update by sync | `sync-skills-hermes.cjs --check` prints `PASS` |
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads the current output. Implementation adds the branch. Verification counts lines. WEAK: See tasks. -->

Follow the ordered tasks in `tasks.md`. Setup records the baselines, Implementation runs one DeepSeek V4.1 Flash max brief per change through cli-pi (cli-codex gpt-6-luna as fallback), and Verification builds, tests, reruns the census, syncs Hermes and has a fresh Opus medium agent review the diff.

### Step 1: Record the baselines

Acceptance: the metadata-round count, both census baselines and the suite baseline exist before any code edit.
Verify: `ls scratch/metadata-rounds.md scratch/baseline/census-before.tsv scratch/baseline/rules-before.tsv scratch/baseline/suite-before.txt` prints four paths.

### Step 2: Add the Measured behavior block and its rule

Acceptance: a new Level 1 scaffold warns on `MEASURED_BEHAVIOR` until the block is filled, and a v2.3 spec never does.
Verify: `npx vitest run cli/tests/measured-behavior-rule.vitest.ts` from `runtime/` prints all tests passed.

### Step 3: Add the Draft auto-repair

Acceptance: a Draft packet failing only on stale metadata passes in one validate run, and every refused case leaves the packet byte-identical.
Verify: `npx vitest run cli/tests/draft-auto-repair.vitest.ts` from `runtime/` prints all tests passed.

### Step 4: Update docs, build and run the gates

Acceptance: the docs describe both changes, the build exits 0, the census diff is empty, Hermes prints PASS and the review finds no blocker.
Verify: `diff <(sort scratch/baseline/census-before.tsv) <(sort scratch/baseline/census-after.tsv)` prints nothing.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `--quiet` prints 1 line. The default prints 17. WEAK: Test it manually. -->

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `MEASURED_BEHAVIOR`: missing, empty fence, filled fence, `N/A:` with reason, v2.3 stamp, never `error` | `measured-behavior-rule.vitest.ts` |
| Integration | Auto-repair: qualifying Draft passes in one run and names its rewrites; switch off, `CI` set, non-Draft, mixed errors and library call each leave the packet hash unchanged; repair runs once; `--json` stdout parses | `draft-auto-repair.vitest.ts` |
| Regression | Every existing packet's verdict and warning count | `strict-census.mjs` and `rule-census.mjs` over `010-deep-review-finding-fixes/scratch/baseline/shard-{0,1,2}.txt`, before and after |
| Suite | No new failure | `npm --prefix .skilled/skills/system-spec-kit/runtime test`, before and after, never concurrent with the build |
| Review | The whole diff | A fresh Opus medium agent writes `scratch/review.md` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 015 and 016 committed | Internal | Yellow | The template edit conflicts; wait for both |
| LLM Gateway, DeepSeek V4.1 Flash max through cli-pi | External | Green | Rerun the brief on cli-codex gpt-6-luna |
| `010-deep-review-finding-fixes/scratch/tools/` and its shard lists | Internal | Green | No regression proof; the phase cannot close |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: the default output changes. Revert the one commit. WEAK: Roll back if needed. -->

- **Trigger**: the census diff is not empty, or a validate run writes to a packet it should not have.
- **Procedure**: set `SPECKIT_DRAFT_AUTO_REPAIR=0` at once, then `git revert` this phase's commit and rebuild the runtime.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES
<!-- FILL: Draw the phase order in the fence, then fill the table with depends-on and blocks. Write `N/A` with one reason, or delete the whole section. GOOD: Setup to Implementation to Verification. Verification blocks close. WEAK: Phases depend on each other. -->

```
Setup (baselines) ──► Implementation (block + rule, then auto-repair) ──► Verification (build, tests, census, docs, review)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 015 and 016 committed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Close |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION
<!-- FILL: Give each phase an estimate and a total. Mark the total as an assumption. Write `N/A` with one reason, or delete the whole section. GOOD: Setup 10 minutes, implementation 30, verification 10. Total 50 minutes. WEAK: A few hours. -->

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 40 minutes, mostly the census |
| Core Implementation | Med | 90 minutes, two briefs |
| Verification | Med | 90 minutes, census and suite reruns |
| **Total** | | **About 4 hours (assumption)** |
<!-- /ANCHOR:effort -->

---
