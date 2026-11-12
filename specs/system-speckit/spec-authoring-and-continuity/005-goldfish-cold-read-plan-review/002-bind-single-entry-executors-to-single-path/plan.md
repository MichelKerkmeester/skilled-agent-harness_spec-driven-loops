---
title: "Implementation Plan: Phase 2: bind-single-entry-executors-to-single-path"
description: "Update the research and review command policy clauses and their presentation assets to select the executor path by expanded lineage count. Regenerate the two compiled contracts from those sources, then verify the source and generated wording with focused searches."
trigger_phrases:
  - "bind single entry executors to single path plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 2: bind-single-entry-executors-to-single-path

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown and plain-text command assets; Node.js contract generator |
| **Framework** | N/A; documentation workflow |
| **Storage** | None |
| **Testing** | Focused text assertions and generated-contract checks; no Vitest suite |

### Overview
Update the research and review command files and their presentation assets so an --executors matrix expanding to one lineage selects config.executor, while two or more expanded lineages select config.fanout. Preserve the existing repeated-flag and count-above-one fan-out conditions. The rule is stated in seven places across five files: one paragraph in each command file, one sentence and one pair of bullets in each presentation asset, and one line in the deep-research feature catalog. Regenerate both compiled contracts with the existing compiler and verify the maintained and generated policy text with focused rg commands.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] The pre-edit policy clauses are captured from the four maintained source files. Verify: T001 reads the four files from Git HEAD and prints their baseline match counts. Evidence: T001 printed 3, 3, 1 and 1 in source order (exit 0); spec.md preserves the pre-edit command output.
- [x] The compiler source map confirms the command and presentation files used for each generated contract. Verify: rg -n 'commandPath:|presentationPath:|sourcePaths:' .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs prints the relevant definitions. Evidence: review mappings are at lines 176-185 and research mappings at lines 278-287 (exit 0).

### Definition of Done
- [x] Both branches of the policy are present in all four maintained files and both generated contracts. Verify: T011 in tasks.md prints 11 and `no old policy wording`. Evidence: T011 printed both markers (exit 0).
- [x] The research and review contracts are regenerated with the existing compiler. Verify: both compile-command-contracts.cjs --write commands print their contract paths. Evidence: the build record at `../scratch/build-evidence.md:50` records both writes exiting 0; the fresh read-only compiles matched the contracts and each count printed 2 (exit 0).
- [x] The child packet validator prints RESULT: PASSED. Evidence: T012 records the final strict validation result.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-derived command policy.

### Key Components
- **Maintained policy sources**: The research and review command files and their matching presentation assets define the executor-selection instructions.
- **Generated command contracts**: The compiled research and review contracts embed the presentation blocks and record source digests; the renderer rejects stale contracts.

### Data Flow
The four maintained files define the policy. compile-command-contracts.cjs compiles each command and presentation source into its contract. The command renderer consumes the generated contract, so the implementation must regenerate both outputs after the source edits.

### Decisions made in the review pass

These close choices the first draft left to the implementer. Each is written into the task that carries it.

- **Exact wording.** Every edit task points at an edit file under `scratch/` that holds the old text and the new text. The old text of each was matched exactly once against the source on 2026-11-11.
- **Seven places, not four.** The first draft covered the command paragraphs and the flag-parsing bullets. Each presentation asset states the rule a second time in its `Fan-out default policy` sentence (deep-research-presentation.txt:71, deep-review-presentation.txt:88), and the compiled contracts embed that sentence. T005 and T007 correct it.
- **Feature catalog line.** `fanout-dispatch.md:52-53` in the deep-research feature catalog restates the rule. Leaving it would keep one shipped statement of the old rule, so T008 corrects it. The deep-review catalog entry does not state the rule and stays untouched.
- **What a one-lineage matrix writes.** One entry with `count` 1 or absent writes `config.executor` from that entry and leaves `config.fanout` unset. The entry's `iterations` value sets `maxIterations`, because in a fan-out it is the per-lineage iteration cap. With `config.fanout` unset, the four workflow steps skip the runner on their existing `skip_when: "no entries in config.fanout.executors"` guard, so no workflow file changes.
- **A one-entry `cli-deepseek-harness` matrix.** That kind runs only as a fan-out lineage. Bound to `config.executor`, it reaches the existing fail-fast at `deep-research-auto.yaml:1216`, which tells the caller to rerun with `--count=2` or a second `--executor` group. This phase leaves that step as it is.
- **The review sentence keeps its tail.** `deep-review-presentation.txt:88` continues with `Native and CLI fan-out lineages run under`, which `deep-review-auto-restart-contract.vitest.ts` asserts. T007 replaces only the policy sentence and checks the tail is still there.
- **Proof of regeneration.** A fresh compile is byte-identical to the committed contract today, measured for both commands on 2026-11-11. T009 and T010 therefore prove regeneration by comparing a fresh compile with the written file.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup reads the current policy in .skilled/commands/deep/research.md, .skilled/commands/deep/review.md, .skilled/commands/deep/assets/deep-research-presentation.txt, and .skilled/commands/deep/assets/deep-review-presentation.txt, plus the generator source map in .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs.
Implementation updates .skilled/commands/deep/research.md, .skilled/commands/deep/review.md, .skilled/commands/deep/assets/deep-research-presentation.txt, .skilled/commands/deep/assets/deep-review-presentation.txt, and .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md, then regenerates .skilled/commands/deep/assets/compiled/deep-research.contract.markdown and .skilled/commands/deep/assets/compiled/deep-review.contract.markdown.
Verification checks both policy branches in .skilled/commands/deep/research.md, .skilled/commands/deep/review.md, .skilled/commands/deep/assets/deep-research-presentation.txt, .skilled/commands/deep/assets/deep-review-presentation.txt, .skilled/commands/deep/assets/compiled/deep-research.contract.markdown, and .skilled/commands/deep/assets/compiled/deep-review.contract.markdown, then runs the strict validator on this child packet.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

This phase changes command documentation and generated contracts. Use the focused rg assertions and contract-generator commands in tasks.md, then run the required child-packet validator. No Vitest suite is in scope for this documentation change.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- Node.js must be available for compile-command-contracts.cjs.
- The maintained command and presentation source files must remain readable to the generator.
- No new package or runtime dependency is required.

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a focused check finds conflicting policy text or a generated contract fails its content check. First confirm that the seven scoped paths contain no unrelated working-tree edits with git diff -- .skilled/commands/deep/research.md .skilled/commands/deep/review.md .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md .skilled/commands/deep/assets/compiled/deep-research.contract.markdown .skilled/commands/deep/assets/compiled/deep-review.contract.markdown. If they are clean apart from this change, revert those seven paths with git restore --worktree -- .skilled/commands/deep/research.md .skilled/commands/deep/review.md .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md .skilled/commands/deep/assets/compiled/deep-research.contract.markdown .skilled/commands/deep/assets/compiled/deep-review.contract.markdown; otherwise restore only the seven policy statements from the captured baseline and regenerate the two contracts.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Research and review command files plus both presentation assets (four maintained sources) | Own the executor-selection policy text | Update the six policy statements only | T002-T007 check each statement; T011 audits all four sources |
| Deep-research feature catalog entry `fanout-dispatch.md` | Restates the default policy in one line | Update that line only | T008 checks the line; T011 audits it |
| Research and review compiled contracts (two generated outputs) | Carry the compiled policy consumed by the command renderer | Regenerate from maintained sources with the existing compiler | T009-T010 regenerate each contract and compare it with a fresh compile; T011 counts the branch in both outputs |

Required inventories:
- Finding class: cross-consumer. Same-class producers: the four command and presentation files carry the same executor-selection rule. Verify: `rg -n 'Fan-out policy|Fan-out default policy|--executors' .skilled/commands/deep/research.md .skilled/commands/deep/review.md .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt`.
- Consumers of changed symbols: no code symbols change. The compiler reads the command and presentation sources, and the renderer reads the generated contracts. Verify: `rg -n 'commandPath:|presentationPath:|sourcePaths:' .skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs` and `rg -n 'compiledContractPath' .skilled/skills/system-deep-loop/runtime/scripts/render-command-contract.cjs`.
- Matrix axes: matrix cardinality is zero, one or two-plus expanded lineages; repeated --executor flags are zero or one versus two-plus; --count is at or below one versus above one. The required policy rows are no matrix with zero or one executor to config.executor, one expanded matrix lineage to config.executor, two-plus matrix lineages to config.fanout, two-plus repeated flags to config.fanout and any --count above one to config.fanout.
- Algorithm invariant: no parser or runner algorithm changes. The policy invariant is exactly one expanded matrix lineage to config.executor and two or more to config.fanout, while the existing repeated-flag and count-above-one triggers remain fan-out conditions.
<!-- /ANCHOR:affected-surfaces -->


<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Current clauses in the four maintained sources and compiler source mapping | Implementation |
| Implementation | Setup confirms the source files and generator inputs; T001 confirms the current policy lines | Verification |
| Verification | T002-T010 update and regenerate the seven policy-bearing files | Packet closure |
<!-- /ANCHOR:phase-deps -->

---
