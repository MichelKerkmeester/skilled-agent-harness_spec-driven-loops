# Deep Review v2 Iteration 022 — 005 edge cases

**Dimension:** edge-cases
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P0. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-005-002 | `008-finalize-and-commit/scratch/post-merge-checks.md:65` | q4 instructions acknowledge mixed fp32/q4 vectors as "transient expected" but do not provide a reliable completion gate. | Lines 64-65 say existing fp32 vectors and q4 queries occupy the same DB until rescan completes. | Require a distinct q4 DB/profile or a post-rescan check proving every row was re-embedded under the new dtype. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P2. | - | - |

## Notes
This is the operator-facing version of the dtype identity risk.
