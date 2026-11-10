---
title: Deep Research Strategy - proof-a lineage
description: Session tracking for the proof-a fan-out lineage of the research-lineage-reducer-path packet; one forced-depth iteration answering the --artifact-dir documentation question from packet docs and reducer source.
trigger_phrases:
  - "research lineage reducer path proof-a"
  - "artifact-dir documentation question"
importance_tier: normal
contextType: planning
version: 1.0.0
---

# Deep Research Strategy - proof-a lineage

## 1. OVERVIEW

### Purpose

Persistent state for this lineage's single research iteration. Records the topic, the key questions, and the focus decision so the iteration and the synthesis can be routed without re-deriving them.

### Usage

- **Init:** Written with the topic, key questions, non-goals, stop conditions, and first focus.
- **Per iteration:** The iteration file carries evidence; machine-owned sections here record what worked and what did not for reducer sync.
- **Mutability:** Machine-owned sections are rewritten by the workflow reducer; this file is the analyst copy for a one-iteration lineage.

---

## 2. TOPIC

Which file in this packet documents the deep-research reducer's `--artifact-dir` flag, and what exit code does a missing value produce? Answer from the packet's own docs and the reducer source only.

The "packet" is `specs/system-deep-loop/038-review-and-cli-lineage/006-research-lineage-reducer-path/`. The "reducer source" is the deep-research reducer CLI invoked by the phase's workflows.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [ ] Which file in this packet documents the deep-research reducer's --artifact-dir flag?
- [ ] What exit code does a missing --artifact-dir value produce?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Do not audit the deep-review reducer or its exit-code convention beyond what the packet docs state for contrast.
- Do not run the reducer, the workflows, or any test suite; the question is answered from packet docs and reducer source text.
- Do not validate or modify any file outside this lineage directory.

---

## 5. STOP CONDITIONS

- The single configured iteration is complete (`stopPolicy: max-iterations`).
- Both key questions are answered with a packet-doc citation and a reducer-source citation.

---

## 6. WHAT WORKED

- Reading the packet docs first isolated the four files that mention the flag, then reading the reducer CLI entry point confirmed the exit path.

---

## 7. WHAT FAILED

- Nothing failed in this iteration.

---

## 8. EXHAUSTED APPROACHES

- None; the topic is a bounded documentation lookup.

---

## 9. RULED-OUT DIRECTIONS

- Scoring the flag from the shared runtime reducer (`runtime/scripts/reduce-state.cjs`) as the answer: the packet scopes the change to the deep-research reducer under `deep-research/scripts/reduce-state.cjs`, so the shared runtime copy is not the packet's reducer of record.

---

## 10. DIVERGENCE FRONTIER

- Whether the packet's compiled workflow contract file also names the flag was not checked; the packet's own docs and the reducer source already answer the question.

---

## 11. CARRIED-FORWARD QUESTIONS

- None.

---

## 12. NEXT FOCUS

None; one forced-depth iteration with `stopPolicy: max-iterations`, followed by synthesis.
