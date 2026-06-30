# Iteration 8 — kimi

**Angle:** MCP tool-surface drift: documented tool counts (39/8/9) and schemas vs registered tools + the daemon-CLI fallbacks.

**Findings:** 4

- **[P1] drift** `.opencode/bin/cli-offline-smoke.cjs:12` — Offline smoke hardcodes spec-memory CLI count as 37 while the MCP registry has 39 tools
  - evidence: Line 12: `{ name: 'spec-memory', shim: path.join(__dirname, 'spec-memory.cjs'), expectedCount: 37 }` conflicts with `.opencode/skills/system-spec-kit/mcp_server/tests/review-fixes.vitest.ts:117`: `expect(TOOL_DEFINITIONS.length).toBe(39);` — the same `TOOL_DEFINITIONS` array drives `spec-memory-cli.ts` list-tools output.
  - fix: Change `expectedCount` to `39` in cli-offline-smoke.cjs and reconcile the 37-vs-39 references in daemon_cli_reference.md and ENV_REFERENCE.md.
- **[P1] contradiction** `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md:27` — Daemon CLI reference documents spec-memory CLI as 37 tools, contradicting the 39-tool MCP surface
  - evidence: Line 27 table: `node .opencode/bin/spec-memory.cjs | mk-spec-memory | 37 | ...`; line 37: `spec-memory.cjs exposes the 37-tool CLI front-door surface while mk-spec-memory retains a 39-tool MCP surface`. This contradicts `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md:4019`: `all 39 tools become CLI commands generated at runtime from TOOL_DEFINITIONS`.
  - fix: Correct the table and prose to 39 tools for the spec-memory CLI, or document the exact two tools that are intentionally excluded and update the feature catalog.
- **[P1] contradiction** `.opencode/install_guides/README.md:318` — Install guide claims mk_skill_advisor has 8 tools instead of the registered 9
  - evidence: Line 318: `Skill Advisor (mk_skill_advisor) | MCP Server | Native advisor_recommend + skill_graph_* (8 tools)`; line 761 lists exactly 8: `advisor_recommend/rebuild/status/validate`, `skill_graph_scan/query/status/validate`. The authoritative `.opencode/skills/system-skill-advisor/references/runtime/tool_ids_reference.md:3` says `all 9 public ... tool IDs` and line 63 lists `skill_graph_propagate_enhances`.
  - fix: Update both rows to 9 tools and add `skill_graph_propagate_enhances` to the enumerated list in section 10.5 and the opencode.json `_NOTE_2_TOOLS` comment.
- **[P2] drift** `.opencode/skills/system-spec-kit/SKILL.md:436` — system-spec-kit SKILL.md misstates the code-graph tool surface and readiness contracts
  - evidence: Line 436: `...read tools (code_graph_query, code_graph_context, detect_changes) return blocked/degraded payloads under the readiness contract, and maintenance tools (code_graph_scan, code_graph_apply, code_graph_verify) handle recovery...` omits `code_graph_classify_query_intent` entirely and misclassifies readiness behavior versus the 8-tool registry in `system-code-graph/mcp_server/tool-schemas.ts`.
  - fix: Replace the inline five-tool summary with the canonical 8-tool family split from `system-code-graph/references/runtime/tool_surface.md` (status/always-answerable, classify/text-only, read/query/context/detect_changes, scan/apply/verify).
