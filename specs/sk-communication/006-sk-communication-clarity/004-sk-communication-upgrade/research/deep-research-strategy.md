---
title: Deep Research Strategy - sk-communication engine logic
description: Session tracking for the research run on whether and how the projection engine's own logic should change in light of the three vendored communication sources.
trigger_phrases:
  - "projection engine logic"
  - "copy editing instruction"
  - "transform layer"
  - "fidelity validator quality check"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

Runtime state for the deep-research session bound to
`specs/sk-communication/006-sk-communication-clarity/004-sk-communication-upgrade`.

---

## 2. TOPIC

How should the `sk-communication` projection engine's own logic change in light of the three
vendored communication sources under `../../context`, and where must any wording knowledge live so
the skill keeps exactly one home for it. This run is about the engine, not about which repo rule
owns which recommendation. The sibling phase already answered the allocation question.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] What instruction does the engine actually send a rewriting provider, and does it match what the skill's own documentation says its wording standard is?
- [ ] Should the engine gain a transform layer of detectors with deterministic repairs, and if so what is each transform in precise terms?
- [ ] What quality post-condition could the fidelity validator check that it does not check today, and is that post-condition mechanically checkable rather than a judgment?
- [ ] Is a re-render in plainer words still the right lane, given the clarity source's claim that smoothing is not rewriting and polishes away what is worth keeping?
- [ ] Where may any new wording knowledge live without giving the standard a second home, and what does the skill's own one-home rule actually permit?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Changing the byte-safety, privacy, provider, egress or telemetry invariants. They are frozen by the packet that built them.
- Re-deciding which repo rule owns which recommendation. The sibling research phase settled that and its synthesis is the input, not the subject.
- Writing or editing any code. This run reports findings and cites them.
- Reviving the retired explanation lane.
- Designing the reply-scoring harness, which belongs to the verification phase.

---

## 5. STOP CONDITIONS

- All 5 iterations complete. Convergence cannot stop this run early: `antiConvergence.convergenceMode` is `off`.
- Three consecutive iteration failures route to stuck recovery.
- The pause sentinel `research/.deep-research-pause` appears.
- Every key question carries an answer grounded in a cited line of the engine's own source rather than in its documentation.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the two source files at their cited lines settled the correction in one step, because the dispatch's correction was already the right reading and only needed the second referent located — which `src/context/selector.ts:70-74` and the policy contract at `:382-387` supplied. Classifying the style rules side by side in one table worked because it forced the detect/repair distinction into the open, and that distinction is what separates the mechanical three from the judgment rest. (iteration 3)
- reading the *input contract* before the decision logic settled the render (iteration 4)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- I tried to close the context-transmission question inside the prompt-assembly path and hit a dead end, because that path carries only inference controls (`src/providers/controls.ts:44-68`) and the context selection lives in the runtime layer instead. Reading the wrong layer cost one tool call; the right layer is the assembler that produces `document.encodedText`. (iteration 3)
- I spent a call looking for a semantic-difference module that might carry (iteration 4)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **"A rubric is carried somewhere else in the package and merged into the prompt."** Ruled out by -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **"A rubric is carried somewhere else in the package and merged into the prompt."** Ruled out by
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **"A rubric is carried somewhere else in the package and merged into the prompt."** Ruled out by

### **Expecting an LLM-based quality judge behind `judgeMode: 'required'`.** Attempted by reading the -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Expecting an LLM-based quality judge behind `judgeMode: 'required'`.** Attempted by reading the
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Expecting an LLM-based quality judge behind `judgeMode: 'required'`.** Attempted by reading the

### **Re-reading `validator.ts` to locate the judge call.** Avoided by reading the caller -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Re-reading `validator.ts` to locate the judge call.** Avoided by reading the caller
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-reading `validator.ts` to locate the judge call.** Avoided by reading the caller

### **Reading `.opencode/commands/rewrite/response*.md` in this iteration** to explain how the standard -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reading `.opencode/commands/rewrite/response*.md` in this iteration** to explain how the standard
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading `.opencode/commands/rewrite/response*.md` in this iteration** to explain how the standard

### **Reading the vendored `claude-style-patch` and `i-have-adhd` sources this iteration.** Deferred -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reading the vendored `claude-style-patch` and `i-have-adhd` sources this iteration.** Deferred
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading the vendored `claude-style-patch` and `i-have-adhd` sources this iteration.** Deferred

### Attempting a mechanical definition of "stacked compression": still not expressible, ledger -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Attempting a mechanical definition of "stacked compression": still not expressible, ledger
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attempting a mechanical definition of "stacked compression": still not expressible, ledger

### Attempting to adjudicate "stacked compression" mechanically: the rule's own definition (`STYLE.md:41-43`) makes the third move depend on the first two, so a deterministic version is not expressible without solving metaphor and nominalization detection, which are judgment tasks. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Attempting to adjudicate "stacked compression" mechanically: the rule's own definition (`STYLE.md:41-43`) makes the third move depend on the first two, so a deterministic version is not expressible without solving metaphor and nominalization detection, which are judgment tasks.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attempting to adjudicate "stacked compression" mechanically: the rule's own definition (`STYLE.md:41-43`) makes the third move depend on the first two, so a deterministic version is not expressible without solving metaphor and nominalization detection, which are judgment tasks.

### None yet. This iteration opened the evidence base rather than exhausting a direction. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None yet. This iteration opened the evidence base rather than exhausting a direction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None yet. This iteration opened the evidence base rather than exhausting a direction.

### None. The assigned focus produced evidence on every sub-question; nothing was exhausted. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None. The assigned focus produced evidence on every sub-question; nothing was exhausted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The assigned focus produced evidence on every sub-question; nothing was exhausted.

### Re-deriving rows R1-R4 from the source in this iteration: the touch points were already cited in -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Re-deriving rows R1-R4 from the source in this iteration: the touch points were already cited in
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-deriving rows R1-R4 from the source in this iteration: the touch points were already cited in

### Reading `.opencode/commands/rewrite/response*.md` to settle whether the *user-facing* command name -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading `.opencode/commands/rewrite/response*.md` to settle whether the *user-facing* command name
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading `.opencode/commands/rewrite/response*.md` to settle whether the *user-facing* command name

### Reading the phrase "the user message" as a plain contradiction of `copyEditingScope`: rejected on the evidence in finding 1 — the two phrases are true of two different referents in the same request, so no contradiction exists to resolve. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Reading the phrase "the user message" as a plain contradiction of `copyEditingScope`: rejected on the evidence in finding 1 — the two phrases are true of two different referents in the same request, so no contradiction exists to resolve.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the phrase "the user message" as a plain contradiction of `copyEditingScope`: rejected on the evidence in finding 1 — the two phrases are true of two different referents in the same request, so no contradiction exists to resolve.

### Reading the vendored `claude-style-patch` and `i-have-adhd` sources again: iteration 3 already -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Reading the vendored `claude-style-patch` and `i-have-adhd` sources again: iteration 3 already
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading the vendored `claude-style-patch` and `i-have-adhd` sources again: iteration 3 already

### Searching `src/` for a semantic-difference module that might hold a prose-order test: the only -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Searching `src/` for a semantic-difference module that might hold a prose-order test: the only
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching `src/` for a semantic-difference module that might hold a prose-order test: the only

### Searching for a context-text field in the prompt assembly path (`src/contracts/prompt.ts`, `src/providers/controls.ts`): no such field exists, so the question of whether the context text is transmitted cannot be answered from that surface. The remaining trace must go through the assembler that produces `document.encodedText`. Not a saturated direction — one specific check remains. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Searching for a context-text field in the prompt assembly path (`src/contracts/prompt.ts`, `src/providers/controls.ts`): no such field exists, so the question of whether the context text is transmitted cannot be answered from that surface. The remaining trace must go through the assembler that produces `document.encodedText`. Not a saturated direction — one specific check remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a context-text field in the prompt assembly path (`src/contracts/prompt.ts`, `src/providers/controls.ts`): no such field exists, so the question of whether the context text is transmitted cannot be answered from that surface. The remaining trace must go through the assembler that produces `document.encodedText`. Not a saturated direction — one specific check remains.

### Searching for a prose-order detector to make the R4 observability field complete: it does not -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Searching for a prose-order detector to make the R4 observability field complete: it does not
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for a prose-order detector to make the R4 observability field complete: it does not

### Treating `INVALID_INPUT` at the render layer as an order check: ruled out by finding 2 — it compares -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating `INVALID_INPUT` at the render layer as an order check: ruled out by finding 2 — it compares
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `INVALID_INPUT` at the render layer as an order check: ruled out by finding 2 — it compares

### Treating the fidelity validator as the natural home for style post-conditions: rejected in finding 6, because every validator failure discards the rewrite back to the exact original. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating the fidelity validator as the natural home for style post-conditions: rejected in finding 6, because every validator failure discards the rewrite back to the exact original.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the fidelity validator as the natural home for style post-conditions: rejected in finding 6, because every validator failure discards the rewrite back to the exact original.

### Treating the render layer as the place a reorder would have to be caught: ruled out by finding 1 — -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the render layer as the place a reorder would have to be caught: ruled out by finding 1 —
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the render layer as the place a reorder would have to be caught: ruled out by finding 1 —

### Treating the validator as the host for any new quality signal: closed by construction (see 5.3). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the validator as the host for any new quality signal: closed by construction (see 5.3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the validator as the host for any new quality signal: closed by construction (see 5.3).

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **"A rubric is carried somewhere else in the package and merged into the prompt."** Ruled out by (iteration 1)
- **Reading `.opencode/commands/rewrite/response*.md` in this iteration** to explain how the standard (iteration 1)
- None yet. This iteration opened the evidence base rather than exhausting a direction. (iteration 1)
- **Expecting an LLM-based quality judge behind `judgeMode: 'required'`.** Attempted by reading the (iteration 2)
- **Re-reading `validator.ts` to locate the judge call.** Avoided by reading the caller (iteration 2)
- **Reading the vendored `claude-style-patch` and `i-have-adhd` sources this iteration.** Deferred (iteration 2)
- None. The assigned focus produced evidence on every sub-question; nothing was exhausted. (iteration 2)
- Attempting to adjudicate "stacked compression" mechanically: the rule's own definition (`STYLE.md:41-43`) makes the third move depend on the first two, so a deterministic version is not expressible without solving metaphor and nominalization detection, which are judgment tasks. (iteration 3)
- Reading the phrase "the user message" as a plain contradiction of `copyEditingScope`: rejected on the evidence in finding 1 — the two phrases are true of two different referents in the same request, so no contradiction exists to resolve. (iteration 3)
- Searching for a context-text field in the prompt assembly path (`src/contracts/prompt.ts`, `src/providers/controls.ts`): no such field exists, so the question of whether the context text is transmitted cannot be answered from that surface. The remaining trace must go through the assembler that produces `document.encodedText`. Not a saturated direction — one specific check remains. (iteration 3)
- Treating the fidelity validator as the natural home for style post-conditions: rejected in finding 6, because every validator failure discards the rewrite back to the exact original. (iteration 3)
- Reading `.opencode/commands/rewrite/response*.md` to settle whether the *user-facing* command name (iteration 4)
- Searching `src/` for a semantic-difference module that might hold a prose-order test: the only (iteration 4)
- Treating `INVALID_INPUT` at the render layer as an order check: ruled out by finding 2 — it compares (iteration 4)
- Treating the render layer as the place a reorder would have to be caught: ruled out by finding 1 — (iteration 4)
- Attempting a mechanical definition of "stacked compression": still not expressible, ledger (iteration 5)
- Re-deriving rows R1-R4 from the source in this iteration: the touch points were already cited in (iteration 5)
- Reading the vendored `claude-style-patch` and `i-have-adhd` sources again: iteration 3 already (iteration 5)
- Searching for a prose-order detector to make the R4 observability field complete: it does not (iteration 5)
- Treating the validator as the host for any new quality signal: closed by construction (see 5.3). (iteration 5)

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
- [ ] What quality post-condition could the fidelity validator check that it does not check today, (iteration 2)
- [ ] Where may any new wording knowledge live without giving the standard a second home? (advanced: (iteration 2)
- [ ] What instruction does the engine actually send a rewriting provider, and does it match the (iteration 2)
- [ ] Should the engine gain a transform layer of detectors with deterministic repairs, and if so (iteration 2)
- [ ] Is a re-render in plainer words still the right lane, given the clarity source's claim about (iteration 2)
- Where may wording knowledge live without giving the standard a second home? Made sharper by finding 2: the instruction text already has two homes inside the package. (iteration 3)
- What mechanically checkable post-condition remains available to the validator, given that style rules cannot sit on the fail-closed acceptance path (finding 6)? The three mechanical detectors are candidates for a report-only channel, but where that channel lives is unanswered. (iteration 3)
- Does the bounded context text enter the provider request body? Needed to decide whether the referent ambiguity is a live rewrite-target risk or a labelling risk (finding 3). (iteration 3)
- Is a re-render in plainer words still the right lane, given the clarity source's claim that smoothing is not rewriting? Untouched this iteration. (iteration 3)
- Where may a second operation's instruction live without giving the wording standard a second home, (iteration 4)
- Is the composed markdown structure signature order-preserving (arrays joined in order) or (iteration 4)
- Does the bounded context text enter the provider request body? Still open from iteration 3; needed (iteration 4)
- **The gate status of the unchanged-candidate case** (D2). (iteration 5)
- **The content-loss policy** (D1): what fraction of source content may a copy edit discard before (iteration 5)
- **Whether cut-and-reorder is wanted as a second operation** (D5). (iteration 5)
- **The home of a report-only style channel** (D4) if one is wanted at all. (iteration 5)
- Residual, deliberately not chased: whether any test (outside `src/`) reads `selectedText`. It (iteration 5)
- **Whether unguided-rewrite quality is a paid gate** (D3) — answerable only by the blind (iteration 5)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
**Whether unguided-rewrite quality is a paid gate** (D3) — answerable only by the blind

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

`resource-map.md` not present; skipping coverage gate.

### Bounded Context Snapshot

- **The engine.** `.opencode/skills/sk-communication/cli-communication-projection/src/`, subsystems `core`, `context`, `contracts`, `fidelity`, `render`, `privacy`, `providers`, `runtimes`, `clients`, `evaluation`, `observability`, `doctor`, `release`.
- **The two instruction sites.** `src/config/local-provider.ts` and `src/runtime/external-cli-projection.ts` each declare a `COPY_EDITING_INSTRUCTION` constant. Read both and compare them with the skill's documented wording standard.
- **The fidelity surface.** `src/fidelity/index.ts` exports `protected-spans`, `reject-only-judge`, `types` and `validator`. Read the validator to see what it checks.
- **The skill's contract.** `.opencode/skills/sk-communication/SKILL.md`, especially its wording-standard section, its one-home rule for voice rubrics, and the two presentation tiers.
- **The commands.** `.opencode/commands/rewrite/response.md` and `response-by-external-agent.md`, which each load the standard by reference. Compare their instruction with the engine's.
- **The sources.** `../../context/clarity.md` rule 17 on cutting and reordering versus smoothing; `../../context/claude-style-patch-main/STYLE.md` for named tics with repairs and its README's claim about concrete rules against stated preferences; `../../context/i-have-adhd-main/skills/i-have-adhd/SKILL.md` for its pre-send deletion pass and its read-back test.
- **The sibling synthesis.** `../../001-research-communication-context/research/research.md` is the input for what was already decided. Do not re-open its allocations.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05, telemetry only
- Convergence mode: `off`
- Per-iteration budget: 12 tool calls, 10 minutes. Briefs that exceed it get killed at 899 seconds, which happened once in the sibling run.
- Executor: `cli-pi`, model `deepseek-v4.1-flash` through the DevPass LLM Gateway, thinking pinned to `max`
- research/research.md ownership: workflow-owned canonical synthesis output
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-09-12T15:20:00Z
