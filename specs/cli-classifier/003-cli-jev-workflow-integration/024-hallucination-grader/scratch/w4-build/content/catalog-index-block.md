---

### Hallucination grader agreement

#### Description

Measures offline how well the deterministic hallucination check and a Deem or Jev grader agree with operator labels on benchmark outputs.

#### How It Works

`scripts/model-benchmark/scorer/score-d4-agreement.cjs --outputs <dir>` matches benchmark outputs to their fixtures, counts the operator's labels and prints the `hallucination-flag` baseline with a fixed keep rule, with no model call by default. `--deem` and `--jev` each add a model arm that runs only after its own checks pass and once 30 outputs carry labels, at least 5 in each class, and a finished arm prints one `verdict` line.

#### Source Files

See [`scoring-system/hallucination-grader-agreement.md`](../feature-catalog/scoring-system/hallucination-grader-agreement.md) for full implementation and validation file listings.

