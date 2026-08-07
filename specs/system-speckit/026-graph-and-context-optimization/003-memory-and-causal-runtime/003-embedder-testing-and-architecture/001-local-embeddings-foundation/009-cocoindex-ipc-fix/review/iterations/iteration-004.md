# Deep Review Iteration 004 — 009-cocoindex-ipc-fix

**Dimension:** cross-stack
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:51:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-009-001 | 009-cocoindex-ipc-fix/spec.md:124 | Active carry-forward: source-code language indexing is still not restored. | Same REQ-006 evidence as iteration 001. | Same fix as iteration 001. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-009-004 | 009-cocoindex-ipc-fix/implementation-summary.md:57 | Search works only against the existing markdown-only DB, so downstream 006 still lacks a valid code-search baseline. | `implementation-summary.md:57` says DB remains markdown-only; `:109` repeats `markdown: 1335`. | Do not unblock 006 until source-language rows are present and queried through the standard tool. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-009-004 | .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/protocol.py:104 | `SearchResult.rankingSignals` has a mutable default list. | `protocol.py:104` declares `rankingSignals: list[str] = []`. | Use a default factory if msgspec supports it, or require explicit lists at construction. |

## Notes
Cross-stack pass confirms 009 is not enough to feed 006. It fixes a read-only query path, not the indexing pipeline.
