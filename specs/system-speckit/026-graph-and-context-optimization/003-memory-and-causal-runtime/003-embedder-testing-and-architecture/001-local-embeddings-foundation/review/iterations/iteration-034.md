# Deep Review v3 Iteration 034 - cross-packet recipe integrity

**Dimension:** docs  
**Commit reviewed:** d76f3b795

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No source-default P0 from the recipe. | Source defaults are now EmbeddingGemma despite recipe drift. | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V3-DOC-001 | `SETUP_A_RECIPE.md:1` | The Setup A recipe still describes the old opt-in model story after 011 made EmbeddingGemma the repo default. | Title says "EmbeddingGemma + Qwen3"; line 3 says new users get Nomic/MiniLM defaults; lines 7-10 frame EmbeddingGemma as an activation recipe. `.env.example:21-22` and source defaults now say EmbeddingGemma by default. | Rewrite the recipe as current-state default documentation, with Qwen only as opt-in history/override. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P2-V3-DOC-001 | `SETUP_A_RECIPE.md:117` | The recipe's CocoIndex prompt note omits the new EmbeddingGemma prompt shortcut. | `shared.py:53` has the EmbeddingGemma `InstructionRetrieval` entry, but recipe line 117 lists Nomic, CodeRankEmbed, and Qwen only. | Add EmbeddingGemma to the prompt shortcut note. |

## Notes
011 claimed prior-packet docs were updated, but the highest-level operator recipe still teaches the pre-011 defaults.
