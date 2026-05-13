# Deep Review v3 Iteration 039 - secrets and residual v2 checks

**Dimension:** security  
**Commit reviewed:** d76f3b795

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P0-V3-SEC-001 | `.env:12` | v2 GitHub PAT finding is still valid: the live workspace still contains a full GitHub personal access token. | `.env:12` still matches the `github_pat_` pattern. The review intentionally does not reproduce the token value. | Rotate the GitHub token, replace `.env`, and treat prior transcripts/tool output as exposed. |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V3-007-001 | `shared/embeddings/factory.ts:97` | v2 Voyage guard ordering is still valid. | `warnIfVoyageDriftDetected()` returns unless effective provider is `hf-local`; `resolveProvider()` still selects Voyage in auto mode when `VOYAGE_API_KEY` is present at `factory.ts:377-385`. | Warn/fail during provider resolution when Setup A expects local-only but auto would select Voyage. |
| P1-V3-009-001 | `cocoindex_code/daemon.py:389` | v2 search-only project-root validation is still valid. | Search-only mode still builds `target_db` from client-supplied `project_root` and opens it at lines 389-395. | Constrain search roots to configured roots before opening SQLite. |
| P1-V3-009-002 | `cocoindex_code/daemon.py:440` | v2 project-status row-count issue is still valid. | If the project is not loaded in `_projects`, `get_status()` still returns zero chunks/languages at lines 440-444 instead of inspecting the valid DB used by search-only mode. | Make status inspect the same search-only DB or report "not loaded" distinctly. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P2-V3-009-001 | `cocoindex_code/protocol.py:104` | v2 mutable default remains. | `rankingSignals: list[str] = []` is still present. | Use `msgspec.field(default_factory=list)` if supported, or construct the list explicitly. |

## Notes
This iteration re-confirms the high-risk v2 residuals that 011 did not touch. The PAT remains the release blocker.
