# Deep Review Iteration 003 — 009-cocoindex-ipc-fix

**Dimension:** edge-cases
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Timestamp:** 2026-05-12T22:50:00+02:00

## P0 Findings (must fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P0-009-001 | 009-cocoindex-ipc-fix/implementation-summary.md:99 | Active carry-forward: explicit refresh/index still fails. | `implementation-summary.md:99`. | Same fix as iteration 001. |

## P1 Findings (should fix before ship)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P1-009-003 | .opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:393 | Search-only path skips project creation, so status calls still report zero chunks until a Project is loaded. | Search-only branch uses `self._projects.get(project_root)` and only opens DB directly at `daemon.py:391-404`; `get_status()` returns zero when project is absent at `daemon.py:440-444`. | Update `project_status` to inspect an existing DB even when the project is not loaded, or document that search-only success and status are decoupled. |

## P2 Findings (nice to fix)
| ID | File:Line | Issue | Evidence | Suggested Fix |
|---|---|---|---|---|
| P2-009-003 | 009-cocoindex-ipc-fix/scratch/__pycache__/verify-direct.cpython-311.pyc | Python bytecode cache is present under scratch and could be accidentally committed. | `find` listed `scratch/__pycache__/verify-direct.cpython-311.pyc`. | Remove ignored/generated scratch bytecode before final commit. |

## Notes
Edge-case pass found a status/search mismatch introduced by the search-only path. It is not as severe as the Rust-core indexing blocker.
