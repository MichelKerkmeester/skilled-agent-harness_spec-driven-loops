# Context Index: 028-mcp-to-cli-tool-transition

Reorganization bridge for resume tooling and humans. The phase-parent spec.md stays free of migration narrative by design; the history lives here.

## Reorganization Record

| Date | Change |
|------|--------|
| 2026-06-06 | Packet renamed from `028-memory-mcp-cli-feasibility` to `028-mcp-to-cli-tool-transition` (git mv, history preserved) |
| 2026-06-06 | All prior packet contents (spec/plan/tasks/implementation-summary, research runs 1–4) nested into child phase `001-spec-memory-cli/` to make room for subsequent implementation phases |

## Path Mapping

| Old Path | New Path |
|----------|----------|
| `028-memory-mcp-cli-feasibility/spec.md` | `028-mcp-to-cli-tool-transition/001-spec-memory-cli/spec.md` |
| `028-memory-mcp-cli-feasibility/research/**` | `028-mcp-to-cli-tool-transition/001-spec-memory-cli/research/**` |

## Notes

- Historical research artifacts under `001-spec-memory-cli/research/` (run configs, state JSONLs, orchestration summaries) intentionally retain old absolute/relative path strings — they are completed-run evidence, not live pointers.
- Saved-memory rows indexed under the old packet path are refreshed by the post-rename `memory_index_scan`; `001-spec-memory-cli/description.json` retains the packet's memory save history.
