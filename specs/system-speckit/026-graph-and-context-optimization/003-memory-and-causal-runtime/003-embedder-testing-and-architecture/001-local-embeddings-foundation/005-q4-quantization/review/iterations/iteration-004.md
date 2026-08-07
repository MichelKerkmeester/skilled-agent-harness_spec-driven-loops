# Deep Review Iteration 004 — 005-q4-quantization

**Dimension:** performance
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:43:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P0 found in this pass. | - | - |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-005-001 | .opencode/skills/system-spec-kit/shared/embeddings/profile.ts:12 | Active carry-forward: performance win is unsafe to operationalize until q4 has a distinct DB/reindex boundary. | Same persistence-identity evidence as iteration 001. | Same fix as iteration 001. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-005-004 | 005-q4-quantization/scratch/fp32-vs-q4-similarity.mjs:16 | The q4 "effectively interchangeable" verdict is based on 15 synthetic texts, not retrieval labels. | Corpus has 15 hardcoded rows at `scratch/fp32-vs-q4-similarity.mjs:16-32`; docs caveat this at `implementation-summary.md:116`. | Keep it advisory and avoid recommending q4 as default until a labeled retrieval benchmark exists. |

## Notes
Converged: no P0, two API/persistence P1s, and two evidence-quality P2s.
