# Deep Review Iteration 003 — 005-q4-quantization

**Dimension:** documentation accuracy
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:42:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P0 found in this pass. | - | - |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-005-001 | .opencode/skills/system-spec-kit/shared/embeddings/profile.ts:12 | Active carry-forward: dtype is not part of the persisted profile identity. | Same evidence as iteration 001. | Same fix as iteration 001. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-005-003 | 005-q4-quantization/implementation-summary.md:104 | Unknown dtype fallback is marked PASS "by construction" rather than by an executed test. | `implementation-summary.md:104` says PASS by construction; no recorded command output demonstrates `HF_EMBEDDINGS_DTYPE=garbage`. | Add a one-line smoke test for invalid dtype and record the log/output. |

## Notes
Docs are mostly honest about the benchmark limits. The main documentation gap is treating an inferred fallback as verified.
