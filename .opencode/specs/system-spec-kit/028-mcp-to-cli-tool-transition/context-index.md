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

## Main-Reconciliation Record (2026-06-09)

The packet was drafted at the 2026-06-06 branch point; `main` then advanced ~98 commits before the plan was revisited. The phase docs were realigned to that current `main` state:

| Main change | Reconciliation in 028 |
|-------------|------------------------|
| Packet 142 removed cli-devin + the entire Devin runtime/hook surface (`.devin/`, all `hooks/devin/`, the `devin` advisor enum, swe-1.6) | Devin struck from the program-wide pairing rule and all three workstreams' `003-runtime-integration` docs; the triad collapses to Claude Code + Codex (+ the per-system OpenCode plugin). Requirement/task IDs were kept in place; only Devin tokens and `.devin/*` config references were removed. |
| Packet 132 deprecated Gemini end-to-end | Gemini exclusion rationale corrected (surface removed — no longer "adapters exist, unregistered"); stale Gemini entries dropped from the 001 Files-to-Change table and the 003 Gemini-catalog row. |
| Packets 026/027/140/030 reworked the daemon launcher/lease/reap/re-election lifecycle (re-election default-on flag, childPid-keyed liveness, reap-under-respawn-lock, warm-daemon adoption, N-consecutive-probe before reap, reconnecting session proxy on spec-memory + code-index) | Parent "daemon unchanged" Out-of-Scope claim refined (tool handlers + IPC wire protocol unchanged; the launcher/lease/reap lifecycle evolved; the CLI auto-spawn path must bind the current launcher contract). The tri-daemon spawn drill + D1/D7/D8/D9 test specs were re-specified in the hardening phases against that contract. |
| The bridge import-only repair (026/008) was reverted as a direct-DB dual-writer hazard | 002 OpenCode-plugin bridge prose aligned to "repair via a CLI/IPC-backed transport; never initialize the memory DB in-process" across spec/plan/tasks/summary. |

Branch note: `028-mcp-to-cli-tool-transition` was fast-forwarded to `main` (it carried no unique commits) before these edits, so the docs are aligned with the real current code. `graph-metadata.json` `.devin/*` entries are regenerated on the next memory save.
