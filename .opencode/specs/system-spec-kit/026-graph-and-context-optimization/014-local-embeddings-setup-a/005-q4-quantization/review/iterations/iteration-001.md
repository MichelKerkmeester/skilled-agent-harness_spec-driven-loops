# Deep Review Iteration 001 — 005-q4-quantization

**Dimension:** correctness
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:40:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P0 found in this pass. | - | - |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-005-001 | .opencode/skills/system-spec-kit/shared/embeddings/profile.ts:12 | `HF_EMBEDDINGS_DTYPE` changes the embedding space but is not part of the profile slug/database filename, creating a silent mixed-vector risk. | Profile slug is provider/model/dim only at `profile.ts:12-18`; HfLocalProvider profile omits dtype at `hf-local.ts:423-428`; docs acknowledge the same DB is reused at `005-q4-quantization/implementation-summary.md:118`. | Include dtype in the hf-local profile/DB key, or add a startup guard that refuses q4 against an fp32-populated DB until a force reindex completes. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-005-001 | 005-q4-quantization/spec.md:140 | Success criterion says q4 is a one-line opt-in, but the required re-embed/guard is not part of that path. | `spec.md:140` says add one line; `implementation-summary.md:118` says user must run `memory_index_scan force=true`. | Mention the reindex command in the success criterion, not only in limitations. |

## Notes
The dtype plumbing itself is present. The risk is persistence identity: the DB key cannot distinguish fp32 and q4 vectors.
