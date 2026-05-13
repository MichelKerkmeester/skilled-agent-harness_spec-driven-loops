# Deep Review v2 Iteration 021 — 005 type-safety

**Dimension:** type-safety
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P0. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-005-001 | `.opencode/skills/system-spec-kit/shared/embeddings/profile.ts:40` | `EmbeddingProfileOptions` has no dtype field, so callers cannot encode the runtime variant in typed profile metadata. | Lines 40-45 define provider/model/dim/baseUrl only; `toJson()` likewise emits no dtype at lines 77-85. | Extend the type and serialized profile for hf-local dtype or introduce an explicit compatibility guard. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No new P2. | - | - |

## Notes
Deduped with `P1-V2-005-001`.
