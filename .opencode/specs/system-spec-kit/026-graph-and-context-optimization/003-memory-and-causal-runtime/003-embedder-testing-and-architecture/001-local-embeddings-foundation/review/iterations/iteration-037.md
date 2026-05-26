# Deep Review v3 Iteration 037 - dtype and filename identity

**Dimension:** edge-cases  
**Commit reviewed:** d76f3b795

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No new dtype P0. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V3-005-001 | `shared/embeddings/profile.ts:12` | v2 dtype-in-filename risk is still valid. | `createProfileSlug(provider, model, dim)` omits dtype at lines 12-18; `HfLocalProvider.getProfile()` returns provider/model/dim only at `hf-local.ts:423-428`; q4 instructions acknowledge mixed fp32/q4 vectors in `post-merge-checks.md:65`. | Add dtype to hf-local profile/DB identity, or make dtype flips require a new DB plus completed reindex gate. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No separate P2. | - | - |

## Notes
This remains unchanged by 011. The unified 768 dimension does not solve fp32/q4 corpus/query mixing.
