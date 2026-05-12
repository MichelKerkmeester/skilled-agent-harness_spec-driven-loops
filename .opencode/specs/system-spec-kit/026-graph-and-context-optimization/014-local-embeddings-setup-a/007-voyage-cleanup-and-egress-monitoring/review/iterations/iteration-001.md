# Deep Review Iteration 001 — 007-voyage-cleanup-and-egress-monitoring

**Dimension:** correctness
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:44:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P0 found in this pass. | - | - |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-007-001 | .opencode/skills/system-spec-kit/shared/embeddings/factory.ts:377 | The egress guard does not prevent or warn before the auto resolver chooses Voyage when `VOYAGE_API_KEY` is present. | `resolveProvider()` returns `voyage` on a non-placeholder key at `factory.ts:377-385`; the new guard only warns when `effectiveProvider === 'hf-local'` at `factory.ts:97-104`. | For Setup A, force `EMBEDDINGS_PROVIDER=hf-local` or warn when `EMBEDDINGS_PROVIDER=auto` and `VOYAGE_API_KEY` is present, before provider selection can egress. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-007-001 | 007-voyage-cleanup-and-egress-monitoring/implementation-summary.md:53 | Summary says the only remaining context-index sqlite has 2112 live rows; live DB has since advanced. | Docs line `53`; read-only sqlite check returned `embedding_status success|2144`. | Timestamp row-count evidence or refresh it at finalization. |

## Notes
The delete cleanup is real. The warning mechanism is weaker than the success criterion implies because it does not handle the most dangerous auto-selection path.
