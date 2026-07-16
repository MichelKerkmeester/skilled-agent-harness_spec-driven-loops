# Deep Review v3 Iteration 035 - cross-packet Qwen sweep

**Dimension:** correctness  
**Commit reviewed:** d76f3b795

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | Active source defaults no longer point at Qwen3. | The remaining source Qwen entries are recognized-model prompt registries in `shared.py:39-41`, which 011 explicitly allows. | Keep registry entries as opt-in support. |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V3-DOC-002 | `006-bge-m3-hybrid-evaluation/plan.md:45` | 006 still treats Qwen3 as the production baseline. | Lines 45 and 116 say the existing DB/status quo is Qwen3; after 011 the CocoIndex default is `google/embeddinggemma-300m`. | Update 006 to compare bge-m3 against EmbeddingGemma, not Qwen3. |
| P1-V3-DOC-003 | `009-cocoindex-ipc-fix/plan.md:80` | 009 architecture still says searches embed through Qwen3. | Lines 80 and 86 say the daemon embeds queries via Qwen3; source now maps `google/embeddinggemma-300m` to `InstructionRetrieval`. | Reconcile 009 architecture with the final model. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P2-V3-DOC-002 | `007-voyage-cleanup-and-egress-monitoring/scratch/tcpdump-verify.sh:5` | The egress script comment still names Qwen3 as the CocoIndex model. | Line 5 says "hf-local memory + Qwen3 cocoindex"; Setup A is now EmbeddingGemma on both surfaces. | Update comment while fixing the script's portability issue. |

## Notes
The Qwen source purge is mostly successful. The remaining problem is future-planning docs still route evaluation and diagnosis through the old Qwen assumption.
