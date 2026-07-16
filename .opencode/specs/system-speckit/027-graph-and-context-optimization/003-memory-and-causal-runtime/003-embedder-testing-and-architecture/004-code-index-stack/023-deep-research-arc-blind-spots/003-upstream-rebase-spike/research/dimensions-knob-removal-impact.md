# Dimensions Knob Removal Impact

Upstream `cocoindex-code` v0.2.30 removed the dimensions knob from per-side embedder params. The current upstream validator rejects `dimensions` in `indexing_params` or `query_params`, and the README states the reason plainly: output dimension must match between indexing and query.

## Impact for 023A3

023A3 should not add a local per-side dimensions knob. Any dimension control must be model-wide and must force a reindex, because existing stored vectors and query vectors need the same shape.

Recommended 023A3 rule:

| Design Question | Answer |
|-----------------|--------|
| Can `indexing_params.dimensions` differ from `query_params.dimensions`? | No. Reject it. |
| Can dimensions live in provider-specific model metadata? | Yes, if it is model-wide and tied to reindex requirements. |
| Can local config expose a generic dimensions override? | Only after checking the CocoIndex SDK embedder constructor surface and only with clear reindex semantics. |
| Should docs mention existing vector stores? | Yes. Dimension changes invalidate the index. |

## Why This Matters

A naive dimensions knob would create an index that can be written but not queried correctly, or queried with silent recall degradation if adapters coerce shapes. Upstream's decision is the safer invariant: prompt/input-type can differ by side, vector dimension cannot.
