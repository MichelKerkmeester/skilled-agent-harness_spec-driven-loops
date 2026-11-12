---
title: "Feature Specification: Phase 2: bind-single-entry-executors-to-single-path"
description: "Research and review guidance currently routes every --executors matrix to fan-out, including matrices that expand to one lineage. Correct the policy and regenerate both compiled command contracts so a one-lineage matrix uses the single-executor path."
trigger_phrases:
  - "bind single entry executors to single path"
  - "one-lineage executor matrix"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 2: bind-single-entry-executors-to-single-path

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-11 |
| **Branch** | main |
| **Parent Spec** | ../spec.md |
| **Phase** | 2 of 6 |
| **Predecessor** | 001-research-egm-checks-and-chat-path-gaps |
| **Successor** | 003-refuse-single-lineage-fanout-run |
| **Handoff Criteria** | The four maintained policy clauses and both generated contracts consistently route one expanded lineage to config.executor and two or more expanded lineages to config.fanout; strict validation passes. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 2 of the child build sequence following the research packet.

**Scope Boundary**: Correct the research and review command policy prose, the one feature catalog line that restates it, and regenerate the compiled contracts. Do not change command parsing, workflow YAML, runner behavior, tests, or hooks.

**Dependencies**:
- The findings in 001-research-egm-checks-and-chat-path-gaps.
- The existing compile-command-contracts.cjs generator and the four maintained command and presentation files.

**Deliverables**:
- Corrected policy clauses in both command files and both presentation assets.
- Regenerated compiled research and review command contracts.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Before this phase, the research and review command clauses routed any `--executors` value to `config.fanout`; their exact old blocks are preserved in `scratch/edit-T002.txt` and `scratch/edit-T003.txt`. The two presentation assets repeated the blanket rule in their `Fan-out default policy` sentences and flag-parsing bullets, and the feature catalog stated it as the default; the old clauses are preserved in `scratch/edit-T004.txt` through `scratch/edit-T008.txt`. The four auto and confirm workflow steps call `fanout-run.cjs` when `config.fanout.executors` has entries (.skilled/commands/deep/assets/deep-research-auto.yaml, .skilled/commands/deep/assets/deep-research-confirm.yaml, .skilled/commands/deep/assets/deep-review-auto.yaml, and .skilled/commands/deep/assets/deep-review-confirm.yaml). The old policy therefore sent a one-lineage matrix through fan-out instead of the single-executor path.

### Purpose
Make the research and review policy select config.executor for a matrix that expands to one lineage and reserve config.fanout for two or more lineages, while preserving the existing multi-flag and count-above-one fan-out conditions.

<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
The command and output below capture the pre-edit baseline from five source files. Each presentation asset has one matching policy sentence and two matching policy bullets, each command file has one matching policy paragraph, and the feature catalog has one matching line. Lines are cut at 200 characters.

~~~text
Command:
rg -n --sort path -e 'an .--executors. value' -e '0 or 1 --executor' -e '2[+] --executor flags' -e '0–1 .--executor. flags' -e '2\+ / .--executors. /' .skilled/commands/deep/assets/deep-research-presentation.txt .skilled/commands/deep/assets/deep-review-presentation.txt .skilled/commands/deep/research.md .skilled/commands/deep/review.md .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md | cut -c1-200

Output:
.skilled/commands/deep/assets/deep-research-presentation.txt:71:**Fan-out default policy:** 0–1 `--executor` flags and no `--executors` → `config.executor` (single-executor, default, unchanged). 2+ `-
.skilled/commands/deep/assets/deep-research-presentation.txt:108:   |   - 0 or 1 --executor (no --executors, no count>1): write config.executor (single, unchanged)
.skilled/commands/deep/assets/deep-research-presentation.txt:109:   |   - 2+ --executor flags, --executors, or any count>1: write config.fanout
.skilled/commands/deep/assets/deep-review-presentation.txt:88:**Fan-out default policy:** 0–1 `--executor` flags and no `--executors` → `config.executor` (single-executor, default, unchanged). 2+ `--e
.skilled/commands/deep/assets/deep-review-presentation.txt:136:   |   - 0 or 1 --executor (no --executors, no count>1): write config.executor (single, unchanged)
.skilled/commands/deep/assets/deep-review-presentation.txt:137:   |   - 2+ --executor flags, --executors, or any count>1: write config.fanout
.skilled/commands/deep/research.md:126:two or more `--executor` flags, an `--executors` value, or any `--count` above 1 switches to
.skilled/commands/deep/review.md:98:two or more `--executor` flags, an `--executors` value, or any `--count` above 1 switches to
.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md:52:Default policy: 0–1 executor → `config.executor`; 2+ / `--executors` / `count>1` →
~~~

This output is historical baseline evidence. T011 in tasks.md checks the current policy.

<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Revise the research and review command policy clauses so an --executors matrix expanding to exactly one lineage selects config.executor.
- Revise the matching policy clauses in both presentation assets so only a matrix expanding to two or more lineages selects config.fanout; retain the existing repeated --executor and count-above-one triggers.
- Revise the second statement of the same rule in each presentation asset, the `Fan-out default policy` sentence, and the one line that restates it in the deep-research feature catalog entry.
- Regenerate the research and review compiled contracts from their maintained command and presentation sources.

### Out of Scope
- Command parsing, executor expansion, workflow YAML, and fanout-run.cjs behavior; this phase corrects the policy instructions and generated contracts only.
- Test, hook, template, and unrelated command changes; no implementation or test files are required for this documentation change.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .skilled/commands/deep/research.md | Modify | Correct the research policy paragraph for one-lineage and multi-lineage matrices. |
| .skilled/commands/deep/review.md | Modify | Correct the review policy paragraph for one-lineage and multi-lineage matrices. |
| .skilled/commands/deep/assets/deep-research-presentation.txt | Modify | Correct the research presentation policy clauses. |
| .skilled/commands/deep/assets/deep-review-presentation.txt | Modify | Correct the review presentation policy clauses. |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md | Modify | Correct the one line that restates the default policy. |
| .skilled/commands/deep/assets/compiled/deep-research.contract.markdown | Regenerate | Compile the updated research command and presentation sources. |
| .skilled/commands/deep/assets/compiled/deep-review.contract.markdown | Regenerate | Compile the updated review command and presentation sources. |
| .skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown | Record generated drift fix | Account for the already refreshed hash-pinned contract; do not hand-edit it or add a generation command in this child. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The research and review policy clauses select config.executor when an --executors matrix expands to exactly one lineage, and config.fanout when it expands to two or more lineages. Two or more --executor flags and any --count above 1 remain fan-out triggers. | T002 to T008 each print OK for their file, and T011 counts 11 lines carrying the one-lineage branch across the seven policy-bearing files and confirms that the blanket matrix-to-fan-out wording is absent. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Regenerate the research and review compiled contracts from their maintained source files; do not hand-edit the generated contracts. | T009 and T010 run the compile-command-contracts.cjs --write commands, a fresh compile matches each written contract byte for byte, and each contract carries the one-lineage branch on 2 lines. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The T011 audit counts 11 lines carrying the one-lineage branch across the four maintained files, the feature catalog entry and the two generated contracts, and finds no line of the old wording.
- **SC-002**: T009 and T010 regenerate both compiled contracts, and a fresh compile of each matches the written file.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The existing compile-command-contracts.cjs generator reads the command and presentation sources. | If generation is skipped, the renderer rejects stale compiled contracts. | Run the research and review --write commands after source edits; verify the generated policy text. |
| Risk | The command files and presentation assets can state different lineage thresholds. | Users may still be directed to fan-out for a one-lineage matrix. | Search all four maintained files for both policy branches, then check both regenerated contracts. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A. This phase changes command policy documentation and generated contracts, so it has no runtime latency or throughput target.

### Security
- **NFR-S01**: N/A. This phase changes no authentication, authorization, credential or sensitive-data behavior.

### Reliability
- **NFR-R01**: All seven policy-bearing files, the four maintained command and presentation sources, the feature catalog entry and the two generated contracts, must state both routing branches and retain the existing multi-flag and count-above-one triggers after verification.

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: With no --executors matrix and zero --executor flags, the existing policy keeps config.executor.
- Maximum input: The policy defines no numeric matrix-size cap. Every matrix that expands to two or more lineages selects config.fanout. The separate --concurrency option caps simultaneous lineages and defaults to 2.
- Failure path: If either contract-generation command fails, leave its task unmet and do not count the contract as regenerated. T009 or T010 records the observed command output and exit status.

<!-- /ANCHOR:edge-cases -->

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 16/25 | Seven policy-bearing files: four maintained sources, one feature catalog entry and two generated contracts. One routing rule changes. |
| Risk | 12/25 | Stale wording can route a one-lineage matrix to fan-out. This phase changes documentation and generated contracts only. |
| Research | 18/20 | The plan checks four policy sources, four workflow call sites, the compiler source map and the related research evidence. |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The compiler maps the research and review command files and their presentation assets into each contract's `sourcePaths` (`.skilled/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs:176-185` and `:278-287`). The build record at `../scratch/build-evidence.md:50` records both contract writes.
<!-- /ANCHOR:questions -->

---
