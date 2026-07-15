# Deep Review v2 Iteration 010 — 009 edge cases

**Dimension:** edge-cases
**Reviewer:** cli-codex gpt-5.5 high (normal speed)
**Commit reviewed:** 2b767d051

## P0 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No edge-case P0 found. | - | - |

## P1 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| P1-V2-009-004 | `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:440` | `project_status` reports zero chunks when search-only mode has a valid DB but no loaded project object. | Lines 440-444 return `total_chunks=0` if `self._projects` lacks the root; search-only mode at 393-402 can query the DB without populating that map. | Make status inspect the DB directly, or document search/status decoupling. |

## P2 Findings
| ID | File:Line | Issue | Evidence | Recommendation |
|---|---|---|---|---|
| None | - | No P2 in this pass. | - | - |

## Notes
This can hide a healthy index from operators after a daemon restart.
