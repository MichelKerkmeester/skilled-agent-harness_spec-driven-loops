# Deep Review v3 Iteration 036 - unified-model dimensions

**Dimension:** type-safety  
**Commit reviewed:** d76f3b795

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | Runtime dimension maps for the new defaults are internally 768. | `factory.ts:131-133` maps both canonical and ONNX EmbeddingGemma ids to 768; `config.py:10` and `settings.py:119` select the canonical CocoIndex id. | Keep 768 as the source-of-truth default. |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V3-DIM-001 | `002-model-installation-and-compat/spec.md:132` | Earlier packet docs still claim canonical `google/embeddinggemma-300m` produces 2560-dim vectors. | Lines 72, 132, and `implementation-summary.md:131` describe the Python sentence-transformers smoke test as 2560-dim; 011 and factory source now assert 768-dim for the same canonical model. | Correct or explicitly supersede the old measurement so future rebuilds do not create a 2560/768 mismatch. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P2-V3-DIM-001 | `shared/embeddings.ts:868` | Public compatibility constant still names the old Nomic default. | The effective `getModelName()` path falls through `getProviderInfo()` and should resolve the new factory default, but the exported `DEFAULT_MODEL_NAME` and tests still say Nomic. | Rename/document this as a legacy constant or align it with the new default to avoid API confusion. |

## Notes
The 768-dim assumption is held in the live factory path. The docs around 002 are now the dangerous part because they encode the wrong vector shape.
