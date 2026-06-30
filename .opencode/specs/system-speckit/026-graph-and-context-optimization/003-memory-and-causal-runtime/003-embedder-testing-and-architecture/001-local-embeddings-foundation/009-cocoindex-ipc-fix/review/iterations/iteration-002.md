# Deep Review Iteration 002 — 009-cocoindex-ipc-fix

**Dimension:** security
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:49:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-009-001 | 009-cocoindex-ipc-fix/tasks.md:77 | Active carry-forward: indexing remains blocked. | `tasks.md:77`. | Same fix as iteration 001. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-009-002 | .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:389 | Search-only mode opens `project_root/.cocoindex_code/target_sqlite.db` from the request path; the daemon trusts the client-supplied project root. | `daemon.py:389-395` builds the DB path from `SearchRequest.project_root`. | Ensure MCP/CLI request roots are constrained to `COCOINDEX_CODE_ROOT_PATH` or a known project root before opening arbitrary local paths. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-009-002 | .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:54 | IPC debug logs first 200 response bytes; result content may include code snippets or sensitive paths. | `_log_ipc_recv()` prints hex bytes at `client.py:54-60` when `COCOINDEX_CODE_IPC_DEBUG=1`. | Keep the flag off by default and document that debug logs can contain response payload. |

## Notes
Security pass found no secret in committed artifacts. The main concern is local daemon trust boundary around arbitrary project roots.
