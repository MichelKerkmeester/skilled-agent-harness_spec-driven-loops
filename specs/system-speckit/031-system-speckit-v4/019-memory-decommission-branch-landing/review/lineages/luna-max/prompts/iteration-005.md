---
title: "Deep Review Iteration 5 Prompt"
loop_type: review
iteration: 5
---

# Iteration 5 review prompt

Review the deep-loop runtime and review YAML for correctness, with an adversarial security-boundary check on artifact containment. Read the sources before making any finding. Focus on max-iterations completion proof, artifact-path canonicalization, state/iteration agreement, and the inline-vs-dispatched executor boundary.

Required evidence:

- Use only the bounded paths in `scratch/review-scope.txt` as review targets.
- Cite exact source paths and line numbers for every finding.
- Distinguish confirmed behavior from an inferred exploit path and state what would confirm it.
- Check for P0, P1, and P2 findings, but do not manufacture a finding when the source and counterevidence support a clean result.
- Do not run tests, validators, generators, graph writes, continuity writers, or any repository write. Keep all output under the bound lineage directory.

Review verdict must be the final line of the iteration narrative and must be `PASS`, `CONDITIONAL`, or `FAIL`.
