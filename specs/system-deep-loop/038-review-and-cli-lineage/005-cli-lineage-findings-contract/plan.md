---
title: "Implementation Plan: Give CLI deep-loop lineages the findings output contract and gate it per iteration"
description: "Carry each loop type's per-iteration output contract into the CLI lineage prompt, gate every iteration on findings the reducer can actually read, and make the merge and closeout count each iteration once. All changes sit in the shared deep-loop runtime scripts, with a test per behavior."
trigger_phrases:
  - "cli lineage findings contract plan"
  - "findings not enumerated gate"
  - "latest iteration record merge"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Give CLI deep-loop lineages the findings output contract and gate it per iteration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS scripts (`.cjs`), TypeScript tests |
| **Framework** | The system-deep-loop runtime |
| **Storage** | JSONL state logs, delta files and Markdown iteration files on disk |
| **Testing** | Vitest |

### Overview
A CLI fan-out lineage runs its whole loop from one prompt, so the per-iteration output contract has to travel inside that prompt. The plan adds the contract to `buildLoopPrompt`, adds a `findings_not_enumerated` check to `verify-iteration.cjs` that reads the same sources the reducer reads, and moves the shared helpers into one library module so the gate, the merge and the closeout agree on what an iteration and a finding are.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met, or deferred with a stated reason
- [x] Tests passing
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared runtime scripts with one library module for the rules more than one script applies.

### Key Components
- **`buildLoopPrompt`** (`scripts/fanout-run.cjs`): adds a CLI OUTPUT CONTRACT block per loop type, research or review, for CLI lineages only.
- **`verify-iteration.cjs`**: fails an iteration whose claimed findings have nothing behind them. Research checks the structured list, the `## Findings` Markdown, graph events and delta rows. Review checks the iteration's own claim, `findingsNew`, against `findingDetails`, delta finding rows and the Markdown the reducer parses.
- **`lib/deep-loop/iteration-findings.cjs`**: the research Markdown finding parser, `latestIterationRecords` and `deltaRowIteration`, used by the gate, the merge and the closeout.
- **`fanout-merge.cjs`, `synthesis-closeout.cjs`**: count the latest record per iteration and tolerate a registry list stored as a number.

### Data Flow
A CLI lineage writes its narrative, state record and delta per iteration. The gate reads all three before the iteration is accepted. The merge and closeout read the latest record per iteration and the delta rows filed under it, using the same helpers the gate used.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fanout-run.cjs` `buildLoopPrompt` | Builds the one prompt a CLI lineage gets | Update | `tests/fanout-loop-prompt-in-process.test.ts` |
| `verify-iteration.cjs` | Per-iteration gate | Update | `tests/unit/verify-iteration.vitest.ts` |
| `fanout-merge.cjs` | Merges lineage registries | Update | `fanout-merge-latest-record`, `fanout-merge-question-shape`, `fanout-merge` tests |
| `synthesis-closeout.cjs` | Closeout completeness check | Update | `synthesis-closeout-latest-record` test |
| `reduce-state.cjs` (review reducer) | Reads review findings | Unchanged. The gate calls its `parseIterationFile` | Corpus replay over 491 review logs |
| `post-dispatch-validate.ts` | Requires `findingDetails` to be an array | Unchanged, not in conflict | `post-dispatch-validate.ts:624-644,1667` |
| `deep-ai-council`, `deep-improvement` | Other deep-loop modes | Unchanged, defect absent | `orchestrate-session.cjs:145-173,262-295`, `deep-improvement/scripts/shared/loop-host.cjs:134-181` |

Inventories:
- Consumers of the moved helpers: `rg -n "parseIterationMarkdownFindings|latestIterationRecords|deltaRowIteration" .skilled/skills/system-deep-loop/runtime` names the gate, the merge and the closeout only.
- Matrix axes for the review gate: claim source (`findingsNew` object, `findingsNew` array, absent) by enumeration source (`findingDetails`, delta row, Markdown, none) by row attribution (this iteration, another iteration, unkeyed) by severity (ranked, adjudicated, unranked).
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
| Unit | Gate, prompt block, merge, closeout, registry guards | Vitest |
| Negative control | Each new gate branch disabled in turn, the matching test must fail | Vitest |
| Corpus replay | The review gate over every real `deep-review-state.jsonl` in this repository | Node script in scratch |
| Reproduction | The gate over the ten kept iterations of the AI Systems research run | `verify-iteration.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The review reducer's `parseIterationFile` export | Internal | Green | The gate's Markdown source would need its own parser |
| The AI Systems research rerun | External to this repository | Green | Closed `synthesis_complete`, proving SC-002 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The gate rejects iterations the templates call valid, or a live loop stalls on repeated redispatch.
- **Procedure**: `git revert` the single commit. No data or state format changes, so nothing else needs undoing.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under 1 hour |
| Core Implementation | Med | 2-3 hours |
| Verification | Med | 1-2 hours |
| **Total** | | **4-6 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not needed, no data changes
- [x] Feature flag configured: not used, the change lands as one revertible commit
- [x] Monitoring alerts set: not applicable, a gate failure surfaces as a `findings_not_enumerated` reason in the loop

### Rollback Procedure
1. `git revert` the commit in this repository.
2. Rerun the full runtime suite and confirm the baseline count.
3. Tell any session running a deep loop that the gate is gone.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
