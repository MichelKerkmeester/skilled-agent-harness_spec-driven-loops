# Deep Review Iteration 001 — 002-model-installation-and-compat

**Dimension:** reversibility
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:55:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P0 found in this pass. | - | - |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| None | - | No P1 found in this pass. | - | - |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-002-001 | 002-model-installation-and-compat/implementation-summary.md:143 | HF cache symlink points to a fixed snapshot hash and can go stale after a future model download. | `implementation-summary.md:143` documents the hard-coded symlink fragility. | Add a startup repair/check for the symlink before relying on Setup A model loads. |

## Notes
This packet is mostly operational/model-install evidence. One pass was enough; no actual code-change footprint needed deeper iteration.
