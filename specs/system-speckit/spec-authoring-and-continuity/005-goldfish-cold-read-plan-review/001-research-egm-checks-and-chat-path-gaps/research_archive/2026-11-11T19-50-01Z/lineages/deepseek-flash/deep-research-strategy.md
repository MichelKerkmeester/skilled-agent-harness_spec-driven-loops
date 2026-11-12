---
title: Deep Research Strategy - Elephant-Goldfish fresh-context checks in speckit plan/implement
description: Runtime strategy for the fan-out lineage deepseek-flash researching whether system-spec-kit can adopt Elephant-Goldfish fresh-context checks inside existing plan/implement steps.
trigger_phrases:
  - "elephant goldfish fresh context check"
  - "document-alone comprehension paraphrase"
  - "decision-free implementation readiness"
  - "speckit plan fresh context"
  - "speckit implement readiness gate"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - Session Tracking

## 2. TOPIC

Can system-spec-kit adopt the Elephant-Goldfish Model's fresh-context checks (a document-alone comprehension paraphrase, a decision-free implementation readiness check, an optional critic) inside the existing `/speckit:plan` and `/speckit:implement` steps, without new commands or agents and without forcing Level 1 work through them? Sources: github.com/google/elephant-goldfish-model (skills/egm-review, egm-draft, agents/*.md, resources/document_standards) and this repository's `.skilled/commands/speckit/assets/speckit-plan.yaml` and `speckit-implement.yaml`. Answer where each check belongs, how it scales by spec Level 1, 2, 3 and 3+, what to leave out as overengineering, and how to measure whether it helps.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] What does the Elephant-Goldfish Model specify for each fresh-context check (document-alone paraphrase, decision-free readiness check, optional critic), and what evidence does the upstream repository give for it?
- [x] Which step inside `.skilled/commands/speckit/assets/speckit-plan.yaml` can host a document-alone comprehension paraphrase without adding a command, agent, or new artifact?
- [x] Which step inside `.skilled/commands/speckit/assets/speckit-implement.yaml` can host a decision-free readiness check, and what does implement already compute that the check can reuse instead of re-reading?
- [x] How should each check scale across spec Levels 1, 2, 3 and 3+ so Level 1 work is not forced through ceremony it does not need?
- [x] Which upstream elements are overengineering for system-spec-kit, and what observable signal would show the adopted checks actually help?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Not designing a new command, agent, or skill: the adoption must land inside existing plan/implement steps.
- Not implementing the change: findings only, no edits to the researched command YAMLs.
- Not editing spec.md, the parent research packet, or any file outside this lineage directory.

---

## 5. STOP CONDITIONS

- `config.maxIterations` (5) reached: stop with `stopReason: maxIterationsReached`.
- Required control files unreadable, or every in-scope source unreachable after Tier 1 retries.
- Convergence below threshold is telemetry only for this run; broaden angle instead of stopping early.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- What does the Elephant-Goldfish Model specify for each fresh-context check (document-alone paraphrase, decision-free readiness check, optional critic), and what evidence does the upstream repository give for it?
- Which step inside `.skilled/commands/speckit/assets/speckit-plan.yaml` can host a document-alone comprehension paraphrase without adding a command, agent, or new artifact?
- Which step inside `.skilled/commands/speckit/assets/speckit-implement.yaml` can host a decision-free readiness check, and what does implement already compute that the check can reuse instead of re-reading?
- How should each check scale across spec Levels 1, 2, 3 and 3+ so Level 1 work is not forced through ceremony it does not need?
- Which upstream elements are overengineering for system-spec-kit, and what observable signal would show the adopted checks actually help?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the two personas in full rather than skimming the orchestration skill produced the decisive detail. The paraphrase rule is one sentence in the persona, and the reason it exists is a second sentence; neither is visible from the pipeline summary, so an orchestration-only read would have produced a checklist with no rationale. (iteration 1)
- reading step 5 end to end, instead of grepping for "validate", surfaced the three surfaces that decide the answer at once - the self-scored confidence checkpoint, the post-write validation gate, and the four-agent explorer wave. Each alone would have suggested a different placement. (iteration 2)
- reading the quality_gates block before the step bodies changed the answer. Step 1 looks like the natural seat, but the blocking gate before step 6 is where a verdict has leverage, and it already prices plan clarity at 25 points - so the check inherits an existing scoring slot rather than creating one. (iteration 3)
- reading the structural contract instead of the command's own summary of levels resolved the 3+ question immediately - the command's summary copies files, the contract owns requirements, and only the contract can say whether a fourth tier exists. (iteration 4)
- applying the repo's own reversal-cost order turned the leave-out question from taste into a comparison. Importing the five-stage pipeline is not "too much ceremony" in the abstract; it is the expensive move beside a cheaper one that already exists. (iteration 5)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- assuming the fetch tool's clone path was durable. It is a per-call artifact, so a follow-up read failed on all three files and cost a redundant call. (iteration 1)
- trusting the reducer-derived Next Focus. It is generated from the latest finding text, so it names the last thing learned rather than the next open question, and following it would have spent an iteration re-checking measurement evidence already marked UNKNOWN. (iteration 2)
- the first hypothesis (step 6's parallel dispatch is the fresh-context hook) collapsed on sequencing: the dispatch is inside the coding phase, so any verdict is retrospective. (iteration 3)
- the first scaling draft branched on document length at check time. That looked cheap but made the check's behaviour depend on a number that plan revisions move, and it duplicated the level decision `recommend-level.sh` already makes. (iteration 4)
- the first measurement draft proposed a satisfaction score. It died on the same objection that killed the existing confidence checkpoints as evidence - the scorer is the context being scored. (iteration 5)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### "Put it in step 7 because step 7 is already mandatory" is now eliminated: mandatory status there refers to closeout emission, not to a document judgment. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: "Put it in step 7 because step 7 is already mandatory" is now eliminated: mandatory status there refers to closeout emission, not to a document judgment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Put it in step 7 because step 7 is already mandatory" is now eliminated: mandatory status there refers to closeout emission, not to a document judgment.

### "Scale by document size at check time" is eliminated: it re-derives a value the level contract already fixed, and the first plan revision would move the threshold underneath a running workflow. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: "Scale by document size at check time" is eliminated: it re-derives a value the level contract already fixed, and the first plan revision would move the threshold underneath a running workflow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "Scale by document size at check time" is eliminated: it re-derives a value the level contract already fixed, and the first plan revision would move the threshold underneath a running workflow.

### "The quality gate already covers plan clarity, so nothing is needed": eliminated because the gate is scored by the same reader that must later execute the plan, which is the exact blind spot the fresh-context check exists to remove. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: "The quality gate already covers plan clarity, so nothing is needed": eliminated because the gate is scored by the same reader that must later execute the plan, which is the exact blind spot the fresh-context check exists to remove.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: "The quality gate already covers plan clarity, so nothing is needed": eliminated because the gate is scored by the same reader that must later execute the plan, which is the exact blind spot the fresh-context check exists to remove.

### A dedicated metrics file or dashboard for the checks: rejected because acceptance criteria, the task checklist and deviation markers already carry countable rows. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A dedicated metrics file or dashboard for the checks: rejected because acceptance criteria, the task checklist and deviation markers already carry countable rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A dedicated metrics file or dashboard for the checks: rejected because acceptance criteria, the task checklist and deviation markers already carry countable rows.

### Adding a fifth explorer to the existing parallel wave without qualification: rejected as-is because of the conclusion-free contract (finding 5); it survives only as a separate dispatch under a different brief. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Adding a fifth explorer to the existing parallel wave without qualification: rejected as-is because of the conclusion-free contract (finding 5); it survives only as a separate dispatch under a different brief.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding a fifth explorer to the existing parallel wave without qualification: rejected as-is because of the conclusion-free contract (finding 5); it survives only as a separate dispatch under a different brief.

### Cloning the upstream repository for repeated local reads: the fetch tool reported a clone path under /private/tmp, but the path was gone by the next call, so raw.githubusercontent.com slices were used instead. Retrying the clone gave no benefit over raw reads for four files. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Cloning the upstream repository for repeated local reads: the fetch tool reported a clone path under /private/tmp, but the path was gone by the next call, so raw.githubusercontent.com slices were used instead. Retrying the clone gave no benefit over raw reads for four files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cloning the upstream repository for repeated local reads: the fetch tool reported a clone path under /private/tmp, but the path was gone by the next call, so raw.githubusercontent.com slices were used instead. Retrying the clone gave no benefit over raw reads for four files.

### Collapsing everything into "just add a review step": rejected because three of the twelve findings are about what to delete, and the deletion is the part that keeps Level 1 cheap. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Collapsing everything into "just add a review step": rejected because three of the twelve findings are about what to delete, and the deletion is the part that keeps Level 1 cheap.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Collapsing everything into "just add a review step": rejected because three of the twelve findings are about what to delete, and the deletion is the part that keeps Level 1 cheap.

### Gating all three checks on LOC alone: rejected because LOC is already the level input; re-testing it duplicates the level decision and creates two sources of truth for the same threshold. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Gating all three checks on LOC alone: rejected because LOC is already the level input; re-testing it duplicates the level decision and creates two sources of truth for the same threshold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Gating all three checks on LOC alone: rejected because LOC is already the level input; re-testing it duplicates the level decision and creates two sources of truth for the same threshold.

### Importing the full five-stage review as a plan sub-pipeline: rejected on reversal cost, since it adds stages beside existing gates rather than extending one. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Importing the full five-stage review as a plan sub-pipeline: rejected on reversal cost, since it adds stages beside existing gates rather than extending one.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Importing the full five-stage review as a plan sub-pipeline: rejected on reversal cost, since it adds stages beside existing gates rather than extending one.

### Making Level 1 skip every check: rejected because the comprehension paraphrase costs one short paragraph inside an existing checkpoint, and the model's own claim is about a document whose parts do not connect, which a 60-line plan can still be. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Making Level 1 skip every check: rejected because the comprehension paraphrase costs one short paragraph inside an existing checkpoint, and the model's own claim is about a document whose parts do not connect, which a 60-line plan can still be.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making Level 1 skip every check: rejected because the comprehension paraphrase costs one short paragraph inside an existing checkpoint, and the model's own claim is about a document whose parts do not connect, which a 60-line plan can still be.

### Making the critic mandatory at any level: it duplicates the design critique that already exists as an upstream stage and has no blocking output to justify the dispatch cost. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Making the critic mandatory at any level: it duplicates the design critique that already exists as an upstream stage and has no blocking output to justify the dispatch cost.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Making the critic mandatory at any level: it duplicates the design critique that already exists as an upstream stage and has no blocking output to justify the dispatch cost.

### No further dead ends; the leave-out list is the consolidated dead-end record for the whole lineage and belongs in synthesis. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No further dead ends; the leave-out list is the consolidated dead-end record for the whole lineage and belongs in synthesis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No further dead ends; the leave-out list is the consolidated dead-end record for the whole lineage and belongs in synthesis.

### None yet. One path is now marked not-worth-repeating: fetching the GitHub HTML tree and expecting a stable local clone path in the same run. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None yet. One path is now marked not-worth-repeating: fetching the GitHub HTML tree and expecting a stable local clone path in the same run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None yet. One path is now marked not-worth-repeating: fetching the GitHub HTML tree and expecting a stable local clone path in the same run.

### Placing it in step 3 (specification) or step 4 (clarification): both precede plan.md authoring, so there is no plan document to paraphrase. Step 4's `[NEEDS CLARIFICATION]` cap of 3 is an ambiguity extractor for spec.md, not a comprehension test of a plan. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Placing it in step 3 (specification) or step 4 (clarification): both precede plan.md authoring, so there is no plan document to paraphrase. Step 4's `[NEEDS CLARIFICATION]` cap of 3 is an ambiguity extractor for spec.md, not a comprehension test of a plan.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Placing it in step 3 (specification) or step 4 (clarification): both precede plan.md authoring, so there is no plan document to paraphrase. Step 4's `[NEEDS CLARIFICATION]` cap of 3 is an ambiguity extractor for spec.md, not a comprehension test of a plan.

### Placing the paraphrase in step 7 (handover check): the step's purpose is workflow closeout after planning, its validation is `workflow_finish_confirmed`, and its outputs are a status string. Putting a comprehension verdict there separates the finding from the approval decision that the operator makes in step 5, which is the moment the check is meant to inform. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Placing the paraphrase in step 7 (handover check): the step's purpose is workflow closeout after planning, its validation is `workflow_finish_confirmed`, and its outputs are a status string. Putting a comprehension verdict there separates the finding from the approval decision that the operator makes in step 5, which is the moment the check is meant to inform.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Placing the paraphrase in step 7 (handover check): the step's purpose is workflow closeout after planning, its validation is `workflow_finish_confirmed`, and its outputs are a status string. Putting a comprehension verdict there separates the finding from the approval decision that the operator makes in step 5, which is the moment the check is meant to inform.

### Reading skills/egm-draft/SKILL.md in this iteration: drafting is the elephant half of the model, and the research question is scoped to the checks. Deferred, not abandoned. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Reading skills/egm-draft/SKILL.md in this iteration: drafting is the elephant half of the model, and the research question is scoped to the checks. Deferred, not abandoned.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading skills/egm-draft/SKILL.md in this iteration: drafting is the elephant half of the model, and the research question is scoped to the checks. Deferred, not abandoned.

### Reusing the debug delegation contract: it is user-dispatched by design, so wrapping it would turn an operator prompt into an automated gate, which is a larger change than the research question permits. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reusing the debug delegation contract: it is user-dispatched by design, so wrapping it would turn an operator prompt into an automated gate, which is a larger change than the research question permits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reusing the debug delegation contract: it is user-dispatched by design, so wrapping it would turn an operator prompt into an automated gate, which is a larger change than the research question permits.

### Seating it in step 3 (consistency analysis): that step maps requirements to task coverage, which is traceability, not decision freedom. It answers "is every requirement covered", not "can an implementer proceed without choosing". -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Seating it in step 3 (consistency analysis): that step maps requirements to task coverage, which is traceability, not decision freedom. It answers "is every requirement covered", not "can an implementer proceed without choosing".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Seating it in step 3 (consistency analysis): that step maps requirements to task coverage, which is traceability, not decision freedom. It answers "is every requirement covered", not "can an implementer proceed without choosing".

### Seating it in step 4 (acceptance criteria): the right rubric shape, but the wrong question - acceptance rows verify outcomes after the fact, and the step is already skipped for Level 1. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Seating it in step 4 (acceptance criteria): the right rubric shape, but the wrong question - acceptance rows verify outcomes after the fact, and the step is already skipped for Level 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Seating it in step 4 (acceptance criteria): the right rubric shape, but the wrong question - acceptance rows verify outcomes after the fact, and the step is already skipped for Level 1.

### Seating the readiness check in step 6's parallel dispatch: the dispatch happens after implementation begins, so a "do not start coding yet" verdict would arrive too late. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Seating the readiness check in step 6's parallel dispatch: the dispatch happens after implementation begins, so a "do not start coding yet" verdict would arrive too late.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Seating the readiness check in step 6's parallel dispatch: the dispatch happens after implementation begins, so a "do not start coding yet" verdict would arrive too late.

### Treating Level 3+ as a fourth file tier: the structural contract has three tiers, and inventing a fourth would fork the level vocabulary that `recommend-level.sh` and the validators share. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating Level 3+ as a fourth file tier: the structural contract has three tiers, and inventing a fourth would fork the level vocabulary that `recommend-level.sh` and the validators share.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating Level 3+ as a fourth file tier: the structural contract has three tiers, and inventing a fourth would fork the level vocabulary that `recommend-level.sh` and the validators share.

### Treating the existing confidence checkpoint as already satisfying the requirement: rejected on evaluator identity, not on rubric quality. It scores the same context's own draft. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the existing confidence checkpoint as already satisfying the requirement: rejected on evaluator identity, not on rubric quality. It scores the same context's own draft.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the existing confidence checkpoint as already satisfying the requirement: rejected on evaluator identity, not on rubric quality. It scores the same context's own draft.

### Using the learning index as the effectiveness measure: rejected as self-reported by construction. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Using the learning index as the effectiveness measure: rejected as self-reported by construction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the learning index as the effectiveness measure: rejected as self-reported by construction.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Cloning the upstream repository for repeated local reads: the fetch tool reported a clone path under /private/tmp, but the path was gone by the next call, so raw.githubusercontent.com slices were used instead. Retrying the clone gave no benefit over raw reads for four files. (iteration 1)
- None yet. One path is now marked not-worth-repeating: fetching the GitHub HTML tree and expecting a stable local clone path in the same run. (iteration 1)
- Reading skills/egm-draft/SKILL.md in this iteration: drafting is the elephant half of the model, and the research question is scoped to the checks. Deferred, not abandoned. (iteration 1)
- "Put it in step 7 because step 7 is already mandatory" is now eliminated: mandatory status there refers to closeout emission, not to a document judgment. (iteration 2)
- Adding a fifth explorer to the existing parallel wave without qualification: rejected as-is because of the conclusion-free contract (finding 5); it survives only as a separate dispatch under a different brief. (iteration 2)
- Placing it in step 3 (specification) or step 4 (clarification): both precede plan.md authoring, so there is no plan document to paraphrase. Step 4's `[NEEDS CLARIFICATION]` cap of 3 is an ambiguity extractor for spec.md, not a comprehension test of a plan. (iteration 2)
- Placing the paraphrase in step 7 (handover check): the step's purpose is workflow closeout after planning, its validation is `workflow_finish_confirmed`, and its outputs are a status string. Putting a comprehension verdict there separates the finding from the approval decision that the operator makes in step 5, which is the moment the check is meant to inform. (iteration 2)
- Treating the existing confidence checkpoint as already satisfying the requirement: rejected on evaluator identity, not on rubric quality. It scores the same context's own draft. (iteration 2)
- "The quality gate already covers plan clarity, so nothing is needed": eliminated because the gate is scored by the same reader that must later execute the plan, which is the exact blind spot the fresh-context check exists to remove. (iteration 3)
- Reusing the debug delegation contract: it is user-dispatched by design, so wrapping it would turn an operator prompt into an automated gate, which is a larger change than the research question permits. (iteration 3)
- Seating it in step 3 (consistency analysis): that step maps requirements to task coverage, which is traceability, not decision freedom. It answers "is every requirement covered", not "can an implementer proceed without choosing". (iteration 3)
- Seating it in step 4 (acceptance criteria): the right rubric shape, but the wrong question - acceptance rows verify outcomes after the fact, and the step is already skipped for Level 1. (iteration 3)
- Seating the readiness check in step 6's parallel dispatch: the dispatch happens after implementation begins, so a "do not start coding yet" verdict would arrive too late. (iteration 3)
- "Scale by document size at check time" is eliminated: it re-derives a value the level contract already fixed, and the first plan revision would move the threshold underneath a running workflow. (iteration 4)
- Gating all three checks on LOC alone: rejected because LOC is already the level input; re-testing it duplicates the level decision and creates two sources of truth for the same threshold. (iteration 4)
- Making Level 1 skip every check: rejected because the comprehension paraphrase costs one short paragraph inside an existing checkpoint, and the model's own claim is about a document whose parts do not connect, which a 60-line plan can still be. (iteration 4)
- Making the critic mandatory at any level: it duplicates the design critique that already exists as an upstream stage and has no blocking output to justify the dispatch cost. (iteration 4)
- Treating Level 3+ as a fourth file tier: the structural contract has three tiers, and inventing a fourth would fork the level vocabulary that `recommend-level.sh` and the validators share. (iteration 4)
- A dedicated metrics file or dashboard for the checks: rejected because acceptance criteria, the task checklist and deviation markers already carry countable rows. (iteration 5)
- Collapsing everything into "just add a review step": rejected because three of the twelve findings are about what to delete, and the deletion is the part that keeps Level 1 cheap. (iteration 5)
- Importing the full five-stage review as a plan sub-pipeline: rejected on reversal cost, since it adds stages beside existing gates rather than extending one. (iteration 5)
- No further dead ends; the leave-out list is the consolidated dead-end record for the whole lineage and belongs in synthesis. (iteration 5)
- Using the learning index as the effectiveness measure: rejected as self-reported by construction. (iteration 5)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Target surfaces: `.skilled/commands/speckit/assets/speckit-plan.yaml` (885 lines) and `.skilled/commands/speckit/assets/speckit-implement.yaml` (830 lines), both in this repository.
- Upstream source: `github.com/google/elephant-goldfish-model`, notably `skills/egm-review`, `skills/egm-draft`, `agents/*.md`, `resources/document_standards`.
- Lane constraint: this lineage may write only inside its own packet directory; spec.md writeback and repo tooling runs are out of scope by dispatch.
- Sibling context: the parent research packet for 005 holds no `research.md` yet, so this lineage starts from primary sources.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; this run stops at the iteration cap)
- Per-iteration budget: 24 tool calls
- Progressive synthesis: true
- `research.md` ownership: workflow-owned canonical synthesis output inside this lineage
- Lifecycle branches: `new` (this run)
- Current generation: 1
- Started: 2026-11-11T18:14:33Z
