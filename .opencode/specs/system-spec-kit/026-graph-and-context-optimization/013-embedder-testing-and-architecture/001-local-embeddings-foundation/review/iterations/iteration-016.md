# Deep Review v2 Iteration 016 — 007 security

**Dimension:** security
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P0 found in 007. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-007-001 | `.opencode/skills/system-spec-kit/shared/embeddings/factory.ts:97` | Voyage egress guard fires only after the effective provider is hf-local, so it misses the dangerous auto-to-Voyage path. | Lines 97-104 return early unless `effectiveProvider === 'hf-local'`; `resolveProvider()` returns `voyage` when `VOYAGE_API_KEY` exists in auto mode at lines 377-385. | Warn or fail in `resolveProvider()`/`validateConfiguredEmbeddingsProvider()` when Setup A expects local-only but `auto` sees `VOYAGE_API_KEY`. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P2 in this pass. | - | - |

## Notes
This re-confirms v1 `P1-007-001`.
