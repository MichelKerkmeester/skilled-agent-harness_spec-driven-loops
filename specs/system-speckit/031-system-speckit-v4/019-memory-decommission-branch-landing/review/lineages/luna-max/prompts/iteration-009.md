---
title: "Deep Review Iteration 9 Prompt"
loop_type: review
iteration: 9
---

# Iteration 9 review prompt

Audit cross-lane ranking determinism and perform an adversarial replay of every
active finding. Read the lexical ripgrep rank tuple, trigger-index scorer,
legacy replay ordering, zvec rank preservation and their focused tests. Compare
the implementation with the retrieval convention's explicit lane-merge
boundary; do not turn the intentional zvec external-rank limitation into a
finding. Recheck F001-F010 at their source boundaries for regressions, severity
changes or evidence loss, and classify any remaining ranking candidate as
covered, ruled out, or a new finding.

Required evidence:

- Use only the bounded paths in `scratch/review-scope.txt` as review targets.
- Cite exact source paths and line numbers for every finding or ruled-out claim.
- Distinguish deterministic lexical ordering, deterministic legacy replay
  input ordering, and the documented non-deterministic merged zvec boundary.
- Check P0, P1, and P2 severity; do not duplicate an active finding merely
  because its source was replayed.
- Do not run tests, validators, generators, graph writes, continuity writers,
  nested dispatches, or repository writes. Keep all output under the bound
  lineage directory.
- Convergence is telemetry only; continue the max-iterations loop.

Review verdict must be the final line of the iteration narrative and must be
`PASS`, `CONDITIONAL`, or `FAIL`.
