# Deep Review v2 Iteration 020 — 005 correctness

**Dimension:** correctness
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P0. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-005-001 | `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts:12` | `HF_EMBEDDINGS_DTYPE` changes the hf-local embedding runtime but is not part of the profile slug or DB filename. | `createProfileSlug()` uses provider/model/dim only at lines 12-18; `HfLocalProvider.getProfile()` passes provider/model/dim only at `hf-local.ts:423-428`. | Add dtype to hf-local profile identity, or hard-block dtype flips unless a fresh DB/reindex boundary is chosen. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P2 in this pass. | - | - |

## Notes
This re-confirms v1 `P1-005-001`.
