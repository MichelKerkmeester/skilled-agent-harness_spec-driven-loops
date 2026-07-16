# Deep Review Iteration 002 — 005-q4-quantization

**Dimension:** type-safety
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:41:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P0 found in this pass. | - | - |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-005-002 | .opencode/skills/system-spec-kit/shared/types.ts:95 | The public factory options do not expose `dtype`, so the documented provider option is not available through `createEmbeddingsProvider()`. | `CreateProviderOptions` ends at `timeout?: number` in `types.ts:95-105`; factory constructs HfLocalProvider without dtype at `factory.ts:452-457`. | Add `dtype?: HfLocalDtype | string` to the shared options contract and pass it through for hf-local. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-005-002 | .opencode/skills/system-spec-kit/shared/dist/embeddings/providers/hf-local.d.ts:18 | `HfLocalOptions` remains non-exported in the declaration file, limiting type reuse by callers constructing HfLocalProvider directly. | `hf-local.d.ts:18-24` declares the interface locally; only `HfLocalDtype` is exported at `:25`. | Export `HfLocalOptions` if direct construction is intended as a supported API. |

## Notes
Type-safety pass found no runtime crash, but the high-level API contract is narrower than the docs imply.
