# Context Index: 028-mcp-to-cli-tool-transition

Reorganization bridge for resume tooling and humans. The phase-parent spec.md stays free of migration narrative by design; the history lives here.

## Reorganization Record

| Date | Change |
|------|--------|
| 2026-06-06 | Packet renamed from `028-memory-mcp-cli-feasibility` to `028-mcp-to-cli-tool-transition` (git mv, history preserved) |
| 2026-06-06 | All prior packet contents (spec/plan/tasks/implementation-summary, research runs 1–4) nested into child phase `001-spec-memory-cli/` to make room for subsequent implementation phases |
| 2026-06-06 | Implementation phases `001-cli-core/`, `002-hardening-and-tests/`, `003-runtime-integration/` scaffolded inside `001-spec-memory-cli/` |
| 2026-06-06 | Research record nested again as `001-spec-memory-cli/000-spec-memory-cli-research/`; `001-spec-memory-cli/` reduced to a lean phase parent (spec.md + description.json + graph-metadata.json only) |
| 2026-06-06 | Workstreams `002-code-index-cli/` and `003-skill-advisor-cli/` bootstrapped (lean parent + `000-*-research` child each) extending the program to the other two MCP servers; migration/retirement follow-ons renumbered to 004+ |

## Path Mapping

| Old Path | New Path |
|----------|----------|
| `028-memory-mcp-cli-feasibility/spec.md` | `028-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/spec.md` |
| `028-memory-mcp-cli-feasibility/research/**` | `028-mcp-to-cli-tool-transition/001-spec-memory-cli/000-spec-memory-cli-research/research/**` |

## Notes

- Historical research artifacts under `001-spec-memory-cli/research/` (run configs, state JSONLs, orchestration summaries) intentionally retain old absolute/relative path strings — they are completed-run evidence, not live pointers.
- Saved-memory rows indexed under the old packet path are refreshed by the post-rename `memory_index_scan`; `001-spec-memory-cli/description.json` retains the packet's memory save history.
