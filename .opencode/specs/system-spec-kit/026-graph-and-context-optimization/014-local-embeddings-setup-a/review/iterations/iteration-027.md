# Deep Review v2 Iteration 027 — 008 post-merge checks

**Dimension:** edge-cases
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P0 in the checklist itself. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-008-002 | `008-finalize-and-commit/scratch/post-merge-checks.md:43` | Post-merge egress check delegates to a script that fails on this macOS interface set. | Lines 43-45 run `tcpdump-verify.sh`; that script uses `-i any` and `tcpdump -D` on this host has no `any`. | Fix the script or make the checklist pass an explicit interface. |
| P1-V2-009-003 | `008-finalize-and-commit/scratch/post-merge-checks.md:28` | Checklist search check can pass with an under-indexed DB. | Lines 28-39 do not inspect language counts or non-markdown coverage. | Add a DB/status language distribution check. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P2-V2-008-002 | `008-finalize-and-commit/scratch/post-merge-checks.md:83` | Section 7 is stale now that 009 has shipped. | Lines 83-90 say "If 009 hasn't shipped"; commit reviewed includes 009. | Convert this to "if 009 regresses" troubleshooting. |

## Notes
The checklist catches some regressions, but not source-language coverage and not macOS tcpdump portability.
