---
title: "Deep Review Iteration 10 Prompt"
loop_type: review
iteration: 10
---

# Iteration 10 review prompt

Perform the final max-depth closure pass. Recheck the forced-depth completion
contract and this lineage's contiguous iteration/state evidence, then replay
all active findings across correctness, security, traceability and
maintainability. Compare the packet's explicit closure requirements with the
review evidence that can be produced inside the lineage. Record unresolved
P1/P2 findings and blocked authoritative checks; do not claim acceptance
criteria completion or synthesize before this iteration is complete.

Required evidence:

- Use only bounded source entries from `scratch/review-scope.txt` as review
  targets, with exact source paths and line numbers.
- Confirm the max-iterations policy is honored by ten contiguous iteration
  narratives, ten state iteration records and a final synthesis obligation.
- Distinguish a complete lineage execution from release readiness: active P1
  findings and blocked external validators keep the review verdict conditional.
- Do not run tests, validators, generators, graph writes, continuity writers,
  nested dispatches, or repository writes. Keep all output under the bound
  lineage directory.

Review verdict must be the final line of the iteration narrative and must be
`PASS`, `CONDITIONAL`, or `FAIL`.
