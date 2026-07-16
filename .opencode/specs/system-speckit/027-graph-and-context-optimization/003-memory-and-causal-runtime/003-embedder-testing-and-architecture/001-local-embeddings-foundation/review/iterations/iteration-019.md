# Deep Review v2 Iteration 019 — 007 cross-stack

**Dimension:** cross-stack
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P0. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-007-001 | `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:242` | Guard is attached to provider-info reporting, not provider selection. | Line 242 calls `warnIfVoyageDriftDetected()` from `getProviderInfoForResolution()`; `createEmbeddingsProvider()` chooses `providerName` from `resolveProvider()` at lines 551-555. | Move the local-only guard into the resolution path or enforce `EMBEDDINGS_PROVIDER=hf-local` for Setup A. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No new P2. | - | - |

## Notes
Deduped with `P1-V2-007-001`.
