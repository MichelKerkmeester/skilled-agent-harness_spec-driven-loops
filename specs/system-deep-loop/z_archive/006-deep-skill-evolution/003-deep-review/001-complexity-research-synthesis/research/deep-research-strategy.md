---
title: Deep Research Strategy - Deep Review Complexity
description: Runtime strategy for the 15-iteration research loop investigating deep-review depth gaps and stress-testing surfaced recommendations.
---

# Deep Research Strategy - Deep Review Complexity

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This research session compares the deep-review workflow against focused deep-research bug-finding behavior. The continuation goal is to stress-test the surfaced recommendations and refine implementation order, validation strategy, rollout thresholds, and residual risks.
<!-- /ANCHOR:overview -->

## 2. TOPIC

Investigate why focused deep-research bug-finding can surface more bugs than the deep-review workflow, identify changes that would make deep-review less surface-level, and stress-test all surfaced recommendations before follow-up implementation.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which deep-review prompt, agent, or YAML constraints reduce bug-finding depth?
- [ ] Which deep-research mechanics produce stronger bug discovery and can transfer to deep-review?
- [ ] Does deep-review's convergence logic stop before adversarial class-of-bug coverage is complete?
- [ ] Does deep-review require enough file-line evidence, producer/consumer inventory, and hypothesis rotation?
- [ ] What target surfaces should a follow-up implementation packet change first?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement deep-review changes during this research packet.
- Do not change CLI executor code unless it directly affects research execution evidence.
- Do not evaluate unrelated skills outside deep-review, deep-research, and supporting spec-kit workflow surfaces.

## 5. STOP CONDITIONS

- Stop after 15 iterations.
- Stop early only if the workflow cannot create required artifacts or Codex dispatch fails unrecoverably.
- Do not stop merely because broad themes are identified; continue until target surfaces and verification recommendations are concrete.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **Ruled out: accept a ledger row with `evidenceRefs: []` as a clean-search proof.** That preserves checkbox theater and does not prove a search happened. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Ruled out: accept a ledger row with `evidenceRefs: []` as a clean-search proof.** That preserves checkbox theater and does not prove a search happened.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ruled out: accept a ledger row with `evidenceRefs: []` as a clean-search proof.** That preserves checkbox theater and does not prove a search happened.

### **Ruled out: fail every old review packet missing a ledger.** Current tests and fallback rows still contain legacy shapes, so fail-closed must start at explicit versioned complete records. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Ruled out: fail every old review packet missing a ledger.** Current tests and fallback rows still contain legacy shapes, so fail-closed must start at explicit versioned complete records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ruled out: fail every old review packet missing a ledger.** Current tests and fallback rows still contain legacy shapes, so fail-closed must start at explicit versioned complete records.

### **Ruled out: make graph events the only depth proof.** Graph checks are omitted when no graph data exists, and the current graph vocabulary still lacks bug-class and invariant semantics. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: **Ruled out: make graph events the only depth proof.** Graph checks are omitted when no graph data exists, and the current graph vocabulary still lacks bug-class and invariant semantics.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ruled out: make graph events the only depth proof.** Graph checks are omitted when no graph data exists, and the current graph vocabulary still lacks bug-class and invariant semantics.

### **Ruled out: make graphEvents mandatory as the proof of depth.** Current convergence intentionally omits graph checks when no graph events exist [SOURCE: .opencode/skills/deep-review/references/convergence.md:677], and graph node vocabulary is still too narrow for bug classes. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Ruled out: make graphEvents mandatory as the proof of depth.** Current convergence intentionally omits graph checks when no graph events exist [SOURCE: .opencode/skills/deep-review/references/convergence.md:677], and graph node vocabulary is still too narrow for bug classes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ruled out: make graphEvents mandatory as the proof of depth.** Current convergence intentionally omits graph checks when no graph events exist [SOURCE: .opencode/skills/deep-review/references/convergence.md:677], and graph node vocabulary is still too narrow for bug classes.

### **Ruled out: rely on a final report Search Ledger section without reducer-owned state.** Reports can only expose durable depth if iteration records and the reducer preserve the rows first. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Ruled out: rely on a final report Search Ledger section without reducer-owned state.** Reports can only expose durable depth if iteration records and the reducer preserve the rows first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ruled out: rely on a final report Search Ledger section without reducer-owned state.** Reports can only expose durable depth if iteration records and the reducer preserve the rows first.

### **Ruled out: require every proposed row field for every review.** That overburdens trivial reviews and invites dummy `producer:"n/a"` fields. Conditional requirements are stricter where they matter. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: **Ruled out: require every proposed row field for every review.** That overburdens trivial reviews and invites dummy `producer:"n/a"` fields. Conditional requirements are stricter where they matter.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Ruled out: require every proposed row field for every review.** That overburdens trivial reviews and invites dummy `producer:"n/a"` fields. Conditional requirements are stricter where they matter.

### Ruled out "add the ledger field, then test at the end." That lets schema work merge before behavior proves shallow PASS is impossible. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Ruled out "add the ledger field, then test at the end." That lets schema work merge before behavior proves shallow PASS is impossible.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out "add the ledger field, then test at the end." That lets schema work merge before behavior proves shallow PASS is impossible.

### Ruled out a report-only fix. The report compiler depends on reducer-owned state plus `findingDetails`, so report instructions alone would still lack stable search aggregates. [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1180] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Ruled out a report-only fix. The report compiler depends on reducer-owned state plus `findingDetails`, so report instructions alone would still lack stable search aggregates. [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1180]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out a report-only fix. The report compiler depends on reducer-owned state plus `findingDetails`, so report instructions alone would still lack stable search aggregates. [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1180]

### Ruled out graph vocabulary before ledger semantics. Current workflow and MCP validation would drop or reject the candidate node kinds. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Ruled out graph vocabulary before ledger semantics. Current workflow and MCP validation would drop or reject the candidate node kinds.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out graph vocabulary before ledger semantics. Current workflow and MCP validation would drop or reject the candidate node kinds.

### Ruled out graph vocabulary first. The graph should follow stable ledger semantics; otherwise new node kinds lack enforceable meaning. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Ruled out graph vocabulary first. The graph should follow stable ledger semantics; otherwise new node kinds lack enforceable meaning.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out graph vocabulary first. The graph should follow stable ledger semantics; otherwise new node kinds lack enforceable meaning.

### Ruled out making every producer/consumer/negative-test field mandatory for every row. Applicability and bug class should decide which subfields are hard requirements. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Ruled out making every producer/consumer/negative-test field mandatory for every row. Applicability and bug class should decide which subfields are hard requirements.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out making every producer/consumer/negative-test field mandatory for every row. Applicability and bug class should decide which subfields are hard requirements.

### Ruled out making graphEvents mandatory for all depth proof. The current prompt marks them optional, graphless fallback remains necessary, and existing convergence docs already describe graceful graph omission. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:70] [SOURCE: .opencode/skills/deep-review/references/convergence.md:677] -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Ruled out making graphEvents mandatory for all depth proof. The current prompt marks them optional, graphless fallback remains necessary, and existing convergence docs already describe graceful graph omission. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:70] [SOURCE: .opencode/skills/deep-review/references/convergence.md:677]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out making graphEvents mandatory for all depth proof. The current prompt marks them optional, graphless fallback remains necessary, and existing convergence docs already describe graceful graph omission. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:70] [SOURCE: .opencode/skills/deep-review/references/convergence.md:677]

### Ruled out relying on existing review graph signals for candidate saturation. They measure dimensions, findings, P0 resolution, evidence, and hotspots, not searched bug hypotheses. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Ruled out relying on existing review graph signals for candidate saturation. They measure dimensions, findings, P0 resolution, evidence, and hotspots, not searched bug hypotheses.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out relying on existing review graph signals for candidate saturation. They measure dimensions, findings, P0 resolution, evidence, and hotspots, not searched bug hypotheses.

### Ruled out relying only on graphEvents for ledger persistence. The current prompt marks `graphEvents` optional, and graphless runs need equivalent text/JSON fallback proof. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:69] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Ruled out relying only on graphEvents for ledger persistence. The current prompt marks `graphEvents` optional, and graphless runs need equivalent text/JSON fallback proof. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:69]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out relying only on graphEvents for ledger persistence. The current prompt marks `graphEvents` optional, and graphless runs need equivalent text/JSON fallback proof. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:69]

### Ruled out treating max-iterations synthesis as a clean PASS when candidate gates remain unsatisfied. Max iterations may stop dispatch, but report posture should carry unresolved search debt. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Ruled out treating max-iterations synthesis as a clean PASS when candidate gates remain unsatisfied. Max iterations may stop dispatch, but report posture should carry unresolved search debt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out treating max-iterations synthesis as a clean PASS when candidate gates remain unsatisfied. Max iterations may stop dispatch, but report posture should carry unresolved search debt.

### Ruled out using only `Ruled Out` / `Confirmed-Clean` markdown prose as the persistence path. It collapses clean proof and dead-end semantics and does not preserve row-level evidence refs. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:936] -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Ruled out using only `Ruled Out` / `Confirmed-Clean` markdown prose as the persistence path. It collapses clean proof and dead-end semantics and does not preserve row-level evidence refs. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:936]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ruled out using only `Ruled Out` / `Confirmed-Clean` markdown prose as the persistence path. It collapses clean proof and dead-end semantics and does not preserve row-level evidence refs. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:936]

### Searching for an existing `searchLedger` implementation in deep-review source found no current reducer or validator surface for it; the term appears in the research synthesis and planned recommendation set, not as shipped code. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Searching for an existing `searchLedger` implementation in deep-review source found no current reducer or validator surface for it; the term appears in the research synthesis and planned recommendation set, not as shipped code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for an existing `searchLedger` implementation in deep-review source found no current reducer or validator surface for it; the term appears in the research synthesis and planned recommendation set, not as shipped code.

### Searching for existing `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, or `TEST` review graph support led back to recommendation text and generic test-generation docs, not live graph schema support. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Searching for existing `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, or `TEST` review graph support led back to recommendation text and generic test-generation docs, not live graph schema support.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for existing `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, or `TEST` review graph support led back to recommendation text and generic test-generation docs, not live graph schema support.

### Searching for existing `searchLedger`, `targetSelection`, or `reviewDepthSchemaVersion` support found recommendation text and no live implementation path. That confirms this is a follow-up design/implementation packet rather than a hidden existing feature. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Searching for existing `searchLedger`, `targetSelection`, or `reviewDepthSchemaVersion` support found recommendation text and no live implementation path. That confirms this is a follow-up design/implementation packet rather than a hidden existing feature.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for existing `searchLedger`, `targetSelection`, or `reviewDepthSchemaVersion` support found recommendation text and no live implementation path. That confirms this is a follow-up design/implementation packet rather than a hidden existing feature.

### Searching for existing live `searchLedger` or candidate graph support led back to recommendation text rather than implementation surfaces. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Searching for existing live `searchLedger` or candidate graph support led back to recommendation text rather than implementation surfaces.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for existing live `searchLedger` or candidate graph support led back to recommendation text rather than implementation surfaces.

### Treating `Files Under Review` as `targetSelection` did not hold. It records scope coverage, not per-iteration risk-ranked selection. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating `Files Under Review` as `targetSelection` did not hold. It records scope coverage, not per-iteration risk-ranked selection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `Files Under Review` as `targetSelection` did not hold. It records scope coverage, not per-iteration risk-ranked selection.

### Treating `findingDetails` as the future carrier for all search evidence looked tempting, but it only attaches to active findings. Null-search proof and ruled-out candidates need their own records. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating `findingDetails` as the future carrier for all search evidence looked tempting, but it only attaches to active findings. Null-search proof and ruled-out candidates need their own records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `findingDetails` as the future carrier for all search evidence looked tempting, but it only attaches to active findings. Null-search proof and ruled-out candidates need their own records.

### Treating current `filesReviewed` or strategy scope discovery as equivalent to `targetSelection` did not hold. They show what could be reviewed, not why this iteration selected the riskiest targets. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating current `filesReviewed` or strategy scope discovery as equivalent to `targetSelection` did not hold. They show what could be reviewed, not why this iteration selected the riskiest targets.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating current `filesReviewed` or strategy scope discovery as equivalent to `targetSelection` did not hold. They show what could be reviewed, not why this iteration selected the riskiest targets.

### Treating delta-file existence as a complete post-dispatch check did not hold. The validator only looks for any iteration record in the delta file, not that it matches the state-log append. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating delta-file existence as a complete post-dispatch check did not hold. The validator only looks for any iteration record in the delta file, not that it matches the state-log append.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating delta-file existence as a complete post-dispatch check did not hold. The validator only looks for any iteration record in the delta file, not that it matches the state-log append.

### Treating empty graph `CONTINUE` as a valid graphless fallback did not hold. It has no accepted fallback proof and no actionable blocker. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating empty graph `CONTINUE` as a valid graphless fallback did not hold. It has no accepted fallback proof and no actionable blocker.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating empty graph `CONTINUE` as a valid graphless fallback did not hold. It has no accepted fallback proof and no actionable blocker.

### Treating empty graph `CONTINUE` as equivalent to graceful graphless fallback did not hold. It carries no accepted fallback proof and no blocked-stop detail. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Treating empty graph `CONTINUE` as equivalent to graceful graphless fallback did not hold. It carries no accepted fallback proof and no blocked-stop detail.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating empty graph `CONTINUE` as equivalent to graceful graphless fallback did not hold. It carries no accepted fallback proof and no blocked-stop detail.

### Treating the current validator failure reason list as enough for rollout policy did not hold. It can fail or pass, but it cannot carry migration warnings today. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating the current validator failure reason list as enough for rollout policy did not hold. It can fail or pass, but it cannot carry migration warnings today.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the current validator failure reason list as enough for rollout policy did not hold. It can fail or pass, but it cannot carry migration warnings today.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Ruled out: make graphEvents mandatory as the proof of depth.** Current convergence intentionally omits graph checks when no graph events exist [SOURCE: .opencode/skills/deep-review/references/convergence.md:677], and graph node vocabulary is still too narrow for bug classes. (iteration 11)
- **Ruled out: rely on a final report Search Ledger section without reducer-owned state.** Reports can only expose durable depth if iteration records and the reducer preserve the rows first. (iteration 11)
- **Ruled out: require every proposed row field for every review.** That overburdens trivial reviews and invites dummy `producer:"n/a"` fields. Conditional requirements are stricter where they matter. (iteration 11)
- Searching for existing `searchLedger`, `targetSelection`, or `reviewDepthSchemaVersion` support found recommendation text and no live implementation path. That confirms this is a follow-up design/implementation packet rather than a hidden existing feature. (iteration 11)
- Treating `Files Under Review` as `targetSelection` did not hold. It records scope coverage, not per-iteration risk-ranked selection. (iteration 11)
- **Ruled out: accept a ledger row with `evidenceRefs: []` as a clean-search proof.** That preserves checkbox theater and does not prove a search happened. (iteration 12)
- **Ruled out: fail every old review packet missing a ledger.** Current tests and fallback rows still contain legacy shapes, so fail-closed must start at explicit versioned complete records. (iteration 12)
- **Ruled out: make graph events the only depth proof.** Graph checks are omitted when no graph data exists, and the current graph vocabulary still lacks bug-class and invariant semantics. (iteration 12)
- Treating delta-file existence as a complete post-dispatch check did not hold. The validator only looks for any iteration record in the delta file, not that it matches the state-log append. (iteration 12)
- Treating the current validator failure reason list as enough for rollout policy did not hold. It can fail or pass, but it cannot carry migration warnings today. (iteration 12)
- Ruled out a report-only fix. The report compiler depends on reducer-owned state plus `findingDetails`, so report instructions alone would still lack stable search aggregates. [SOURCE: .opencode/commands/deep/assets/deep_start-review-loop_auto.yaml:1180] (iteration 13)
- Ruled out relying only on graphEvents for ledger persistence. The current prompt marks `graphEvents` optional, and graphless runs need equivalent text/JSON fallback proof. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:69] (iteration 13)
- Ruled out using only `Ruled Out` / `Confirmed-Clean` markdown prose as the persistence path. It collapses clean proof and dead-end semantics and does not preserve row-level evidence refs. [SOURCE: .opencode/skills/deep-review/scripts/reduce-state.cjs:936] (iteration 13)
- Searching for an existing `searchLedger` implementation in deep-review source found no current reducer or validator surface for it; the term appears in the research synthesis and planned recommendation set, not as shipped code. (iteration 13)
- Treating `findingDetails` as the future carrier for all search evidence looked tempting, but it only attaches to active findings. Null-search proof and ruled-out candidates need their own records. (iteration 13)
- Ruled out graph vocabulary first. The graph should follow stable ledger semantics; otherwise new node kinds lack enforceable meaning. (iteration 14)
- Ruled out making graphEvents mandatory for all depth proof. The current prompt marks them optional, graphless fallback remains necessary, and existing convergence docs already describe graceful graph omission. [SOURCE: .opencode/skills/deep-review/assets/prompt_pack_iteration.md.tmpl:70] [SOURCE: .opencode/skills/deep-review/references/convergence.md:677] (iteration 14)
- Ruled out relying on existing review graph signals for candidate saturation. They measure dimensions, findings, P0 resolution, evidence, and hotspots, not searched bug hypotheses. (iteration 14)
- Searching for existing `BUG_CLASS`, `INVARIANT`, `PRODUCER`, `CONSUMER`, or `TEST` review graph support led back to recommendation text and generic test-generation docs, not live graph schema support. (iteration 14)
- Treating empty graph `CONTINUE` as equivalent to graceful graphless fallback did not hold. It carries no accepted fallback proof and no blocked-stop detail. (iteration 14)
- Ruled out "add the ledger field, then test at the end." That lets schema work merge before behavior proves shallow PASS is impossible. (iteration 15)
- Ruled out graph vocabulary before ledger semantics. Current workflow and MCP validation would drop or reject the candidate node kinds. (iteration 15)
- Ruled out making every producer/consumer/negative-test field mandatory for every row. Applicability and bug class should decide which subfields are hard requirements. (iteration 15)
- Ruled out treating max-iterations synthesis as a clean PASS when candidate gates remain unsatisfied. Max iterations may stop dispatch, but report posture should carry unresolved search debt. (iteration 15)
- Searching for existing live `searchLedger` or candidate graph support led back to recommendation text rather than implementation surfaces. (iteration 15)
- Treating current `filesReviewed` or strategy scope discovery as equivalent to `targetSelection` did not hold. They show what could be reviewed, not why this iteration selected the riskiest targets. (iteration 15)
- Treating empty graph `CONTINUE` as a valid graphless fallback did not hold. It has no accepted fallback proof and no actionable blocker. (iteration 15)

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Open a follow-up implementation packet for `deep-review` review-depth v2. Start with failing seeded validator and reducer fixtures, add the v2 schema/prompt contract, implement warn-capable validation, persist search coverage in reducer/dashboard/report, then add candidate STOP gates and graph vocabulary in separate gated slices.

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

Iteration 001 found that deep-review has rigor after a finding exists, but weaker candidate-generation pressure than focused deep-research. Prior memory surfaced related archived packets for deep-research refinement and review-mode improvement. Treat those as hints, but verify current repository files before drawing conclusions.

## 13. RESEARCH BOUNDARIES

- Max iterations: 15
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes target
- Progressive synthesis: true
- Canonical synthesis output: `research/research.md`
- Executor: `cli-codex`, model `gpt-5.5`, reasoning `xhigh`, service tier `fast`
- Current generation: 1
- Started: 2026-05-22T05:55:00Z
