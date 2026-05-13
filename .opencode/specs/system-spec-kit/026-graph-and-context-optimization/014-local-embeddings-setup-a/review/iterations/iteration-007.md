# Deep Review v2 Iteration 007 — 009 security

**Dimension:** security
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No exploitable remote security issue found in this pass. | Daemon IPC remains local to the configured daemon socket. | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-009-002 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:389` | Search-only mode opens a DB derived from the client-supplied `project_root` without constraining it to the configured root. | Lines 389-395 build `root / ".cocoindex_code" / "target_sqlite.db"` directly from the request path before opening SQLite. | Reject search roots outside `COCOINDEX_CODE_ROOT_PATH` or the daemon's known project set. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P2-V2-009-001 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py:54` | IPC debug mode can log response payload bytes. | Lines 54-60 print the first 200 response bytes when `COCOINDEX_CODE_IPC_DEBUG=1`; search responses can include snippets and paths. | Document the flag as sensitive diagnostics and keep it disabled by default. |

## Notes
The P1 is local-boundary hardening, not a claim that the shipped search path is broken.
