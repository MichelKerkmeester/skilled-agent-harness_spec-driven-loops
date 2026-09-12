---
title: "Research: sk-communication engine logic"
description: "Five-iteration audit of the projection engine's own logic against three external communication sources, with a ranked change list separating decision-free edits from design decisions."
trigger_phrases:
  - "projection engine logic"
  - "copy editing instruction"
  - "validator unconditional markers"
  - "cut and reorder lane"
  - "one home for the wording standard"
importance_tier: important
contextType: general
---

# Research: sk-communication engine logic

Five iterations, convergence disabled. Executor `cli-pi`, model `deepseek-v4.1-flash` through the
DevPass LLM Gateway, thinking pinned to `max`.

| Measure | Value |
|---|---|
| Iterations completed | 5 |
| Key findings | 77 |
| Ruled-out directions | 20 |
| Final convergence score | 0.67 |

This run asks a different question from its sibling. The sibling classified source recommendations
against the rule stack. This one audits the engine's own logic.

---

## 1. VERDICT

The engine's documented wording standard has no runtime carrier. The whole instruction a rewriting
provider receives is thirteen words, declared twice, and the standard the skill's documentation
calls the definition of plain English never reaches the model.

Four changes need no design decision. Five need one. The lane question, whether the engine should
cut and reorder rather than re-render, is a decision and not an edit.

---

## 2. WHAT THE ENGINE ACTUALLY DOES

- **One instruction, thirteen words, declared twice.** `src/config/local-provider.ts:64-65` and
  `src/runtime/external-cli-projection.ts:38-39` each carry a byte-identical
  `COPY_EDITING_INSTRUCTION`. No rubric, no named habits, no repairs, no examples.
- **It reaches the provider as a system message through two builders**, and nothing composes
  standard content onto it. `src/providers/adapters.ts:101` for the HTTP path,
  `src/transports/cli.ts:64` for the external-CLI path. The contract types the field as an opaque
  string and validates only that it is a string (`src/contracts/validate-policy.ts:136`).
- **So "plain English" is a dangling reference.** `SKILL.md:174` states that the phrase is not
  defined in the skill and is the Human Voice Rules, and that every rewrite path routes to that
  standard rather than carrying a private rubric. The routing exists in prose. The provider receives
  the label alone.
- **The two operator commands are wired correctly**, which makes the gap a split rather than an
  omission. Both load the standard by reference and say "This file does not restate it". A rewrite
  therefore honours the standard when the operator picks the in-context engine and does not when
  they pick a local or external provider.
- **There is no transform layer.** The fidelity subsystem validates and rejects. Nothing detects a
  habit and applies a repair.

---

## 3. DECISION-FREE CHANGES

Four rows the operator can take without deciding anything. None touches the frozen invariants.

**R1. Collapse the duplicated constants into one declaration.** The instruction and its temperature
are verbatim duplicates across two profiles, and a third literal sits in the test helper. Any
wording change today must land in three places with nothing failing if one is missed. The same two
profiles already disagree on thinking mode, so the drift is not hypothetical. Mechanically
verifiable by asserting both profiles resolve to byte-identical instructions.

**R2. Correct the target noun in the instruction.** It says "the user message" while both profiles
declare `copyEditingScope: 'assistant-message-only'`. Iteration 5 resolved this to a labelling
defect rather than a live mis-target risk, because the bounded context's selected text has no reader
anywhere in the source and only metadata reaches the policy contract, so the provider receives
exactly one text to rewrite. Worth fixing because the phrase is wrong, not because it is dangerous.

**R3. Stop stamping five `passed` markers for comparisons that did not run.** The guard at
`src/fidelity/validator.ts:183` closes at `:222`, and the five markers are pushed unconditionally at
`:223-227`. A candidate identical to its source skips every structure and semantic comparison and
still records `MARKDOWN_STRUCTURE_CHANGED`, `FACT_ADDED`, `POLARITY_CHANGED`,
`REQUIREMENT_STRENGTH_CHANGED` and `PRIORITY_CHANGED` as passed. The record asserts five checks that
never executed. Running the comparisons on identical text cannot change any outcome, so only the
evidence record changes.

**R4. Record what kind of change a candidate made, using values already computed.** The accept
record today says a candidate passed, never what it did.

---

## 4. DECISIONS REQUIRED

Five rows that need an answer before anything is built.

1. **The content-loss floor.** What quantity of removal stops being a copy edit.
2. **Whether an unchanged candidate gates anything.** Today it passes. It could reasonably be
   treated as not-a-projection and rejected.
3. **Thinking mode across the two lanes.** The profiles disagree today.
4. **A report-only style channel, and its host is the decision.** The skill forbids a second home
   for the wording standard, so where detectors live is the question, not whether they work.
5. **A future cut-and-reorder operation.** This is the lane question, and it is the deepest one.

---

## 5. THE LANE QUESTION

The clarity source says rewriting means cutting and reordering, and that smoothing turns a rough
authentic sentence into a bland one. The engine's operation is a re-render, which is smoothing.

The fidelity contract bears on whether the alternative is even admissible. The markdown structure
signature is order-preserving for headings, lists, quotes, fences and tables, and count-based for
inline links, reference links, inline code and HTML. So a reorder that moves a heading is caught,
and a headingless prose reorder is invisible to the contract. That asymmetry is what makes
cut-and-reorder a design decision rather than a feature request: the current contract cannot
distinguish it from a copy edit in the prose case.

---

## 6. WHAT NOT TO DO

Do not put detectors into the engine as a private rubric. The skill's own rule gives the wording
standard exactly one home, and a detector set in engine code is a second home for wording knowledge
whatever it is called. If detectors are wanted, the standard carries them and the engine reads them.

---

## 7. RUN INTEGRITY

All five iterations wrote their three artifacts. Every one fails the workflow's mechanical gate on
`route_proof_missing`, the same deterministic upcaster defect the sibling run hit, which does not
touch findings.

One claim was corrected mid-run. Iteration 1 reported the target-noun mismatch as a contradiction
between the instruction and the scope field. That was overstated, and iteration 3 was briefed with
the correction. Iteration 5 closed it with evidence: a labelling defect, not a mis-target risk.
