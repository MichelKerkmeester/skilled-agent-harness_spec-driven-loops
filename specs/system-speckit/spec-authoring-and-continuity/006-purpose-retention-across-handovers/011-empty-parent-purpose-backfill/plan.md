---
title: "Implementation Plan: Phase 11: empty-parent-purpose-backfill"
description: "Twenty-one literal text edits, one per phase parent, that put an authored purpose sentence under ### Purpose. Ten replace a bracketed placeholder and eleven insert a new heading above the first level-two heading. The proof is the check script, a strict validate per parent and the operator's review."
trigger_phrases:
  - "empty parent purpose backfill plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: empty-parent-purpose-backfill

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY
<!-- FILL: Fill the stack row and write three sentences: what changes, where, and how you will prove it. GOOD: Change one bash script. Add one `--keep <n>` option. Prove it with an archive count. WEAK: This plan describes the implementation. -->

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec docs |
| **Framework** | system-spec-kit spec folders, read by `resolvePacketPurpose` in `runtime/lib/spec/packet-purpose.ts` |
| **Storage** | None |
| **Testing** | `node` with `scratch/check-backfill.mjs`, `validate.sh --strict` per parent, `rg` |

### Overview
Each of the 21 parents in `scratch/parents.txt` gets one purpose sentence the builder writes after reading the parent and its children. Ten files have a placeholder line to replace and eleven get a new `### Purpose` block. The check script must print `own purpose: 21 of 21`, each parent must validate no worse than its baseline, and the operator approves the sentences before commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES
<!-- FILL: Turn each gate into a check a command can answer. Keep the boxes unticked until they pass. GOOD: `ls scripts/rotate-logs.sh` prints the path and `ls logs/archive | wc -l` prints 10 before the task starts. WEAK: The team agrees the plan is ready. -->

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `node specs/system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/011-empty-parent-purpose-backfill/scratch/check-backfill.mjs | tail -1` prints `own purpose: 21 of 21`
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE
<!-- FILL: Name the pattern in three words, then list the one component that changes. Name what fails today without each component you add, or drop it. GOOD: Single script branch. The component is `scripts/rotate-logs.sh`. WEAK: Standard architecture. -->

### Pattern
Authored text, one line per file. No code, no new heading level beyond `### Purpose`.

### Key Components
- **The ten placeholder parents**: each holds `### Purpose` followed by one bracketed line such as `[One-paragraph purpose — what this phased decomposition achieves]`. That one line is replaced.
- **The eleven parents with no purpose text**: each gets three new lines, `### Purpose`, the sentence and a blank line, directly above the first line that starts with `## ` after the frontmatter.

### Data Flow
After the edit, `resolvePacketPurpose` returns the parent's own sentence for the parent, and a child with no purpose of its own inherits that sentence instead of a wider ancestor's.

### How each sentence is written
1. Read the parent's `title`, `description` and problem text, and the title plus Purpose (or first problem sentence) of every numbered child `spec.md` under it.
2. Write one sentence of at most 250 characters that says why this group of children exists: the shared reason, not a list of the children.
3. The sentence starts with a verb or a subject, ends with a full stop, holds no em dash, no brackets, no `UNKNOWN` and does not begin with `Keep parent documentation lean`.
4. Record the sentence and the files read for it in `scratch/sentences.md` under the parent's folder path.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES
<!-- FILL: Point to `tasks.md` and name the three phases in one line. GOOD: Setup reads `scripts/rotate-logs.sh` and counts the archives. Implementation adds `--keep` to `scripts/rotate-logs.sh`. Verification runs `scripts/rotate-logs.sh --keep 3` and counts 3. WEAK: See tasks. -->

Setup builds the runtime, runs the check script and records a strict-validate baseline for each of the 21 parents. Implementation writes one sentence per parent in `scratch/sentences.md`, then applies it to that parent's `spec.md` with the Edit tool. Verification reruns the check script and the 21 validates, and stops for the operator review before any commit. `tasks.md` owns the order and the task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY
<!-- FILL: Name the one command you will run and the output it must print. GOOD: `ls logs/archive | wc -l` prints 3 after `--keep 3` and 10 after a plain run. WEAK: Test it manually. -->

Baseline, 2026-11-14 at `bd79708c2f`: `check-backfill.mjs` printed `own purpose: 0 of 21`, with three `none` lines and eighteen `ancestor` lines. After the edits it must print `packet` on all 21 lines and `own purpose: 21 of 21`.

A validate baseline that later prints more errors or warnings for a parent stops that parent. Report the difference and revert that one file.

What no check proves: that a sentence is the real reason for its parent. The operator review is that check.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES
<!-- FILL: List each tool the change needs, or write `None`. GOOD: `bash` and `awk`. No new package. WEAK: Usual dependencies. -->

`node`, `rg` and `validate.sh`. The check script imports the built helper, so `npm run build` in `.skilled/skills/system-spec-kit/runtime` runs first. No new package. This phase does not need phase 007, because it writes the exact heading the current helper reads.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN
<!-- FILL: Name the trigger and the one command that reverts the change. GOOD: Trigger: `--keep 3` removes an archive newer than the three kept. Revert the one commit. WEAK: Roll back if needed. -->

Trigger: the operator rejects a sentence, or a parent validates worse than its baseline. Before commit, run `git checkout -- <spec.md>` for that parent and rewrite it. After commit, revert the one commit.
<!-- /ANCHOR:rollback -->

---

