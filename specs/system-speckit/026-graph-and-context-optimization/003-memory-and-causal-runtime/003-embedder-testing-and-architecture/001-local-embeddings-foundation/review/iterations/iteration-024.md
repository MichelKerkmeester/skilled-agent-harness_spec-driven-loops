# Deep Review v2 Iteration 024 — 003 security

**Dimension:** security
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P0-V2-003-001 | `.codex/config.toml:14` | The direct Codex path combines `EMBEDDINGS_PROVIDER=auto` with no project-local override loading. | Line 14 sets `auto`; `resolveProvider()` chooses Voyage when `VOYAGE_API_KEY` exists at `factory.ts:377-385`. | Same fix as iteration 023; route through launcher or force local-only for Setup A. |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-003-001 | `.codex/config.toml:24` | Codex note says current provider is hf-local while the actual configured provider is `auto`. | Line 14 sets `EMBEDDINGS_PROVIDER = "auto"`; line 24 says current is hf-local. | Make the note match the config or change the config to `hf-local`. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P2. | - | - |

## Notes
Deduped P0 with `P0-V2-003-001`.
