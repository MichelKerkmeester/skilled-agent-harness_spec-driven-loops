# Iteration 49 — kimi

**Angle:** If a 37-tool subset was ever intentional, reconstruct it from historical sources and document exact exclusions; current source has no two-tool filter.

**Findings:** 5

- **[P1] undocumented** `.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:953-959` — Historical 37-tool subset is reconstructible only from git history
  - evidence: Current TOOL_DEFINITIONS exports 39 tools, including memory_index_scan, memory_index_scan_status, and memory_index_scan_cancel. Git commit e5f694a05e ('feat(030): tri-109 — background memory_index_scan via a kind-agnostic job store') states in its message: 'tool surface 37 -> 39 (status/cancel); count guards + tool-ownership map updated', and its diff adds exactly memory_index_scan_status and memory_index_scan_cancel to TOOL_DEFINITIONS.
  - fix: Document the 37→39 transition and the two historically excluded tools (memory_index_scan_status, memory_index_scan_cancel) in the CLI reference and manual playbooks.
- **[P1] contradiction** `.opencode/skills/system-spec-kit/references/cli/daemon_cli_reference.md:27,37` — Daemon CLI reference asserts a 37-tool CLI subset but no two-tool filter exists
  - evidence: Line 27 table lists spec-memory as 37 tools; line 37 claims 'spec-memory.cjs exposes the 37-tool CLI front-door surface while mk-spec-memory retains a 39-tool MCP surface'. Contrast spec-memory-cli.ts:263 ('for (const tool of TOOL_DEFINITIONS)'), :541 ('count: TOOL_DEFINITIONS.length'), and :726-728, which all iterate the full 39-tool TOOL_DEFINITIONS with no exclusion filter.
  - fix: Update daemon_cli_reference.md to 39 tools and remove the false 37/39 split claim, or implement and name an explicit two-tool filter if one is intended.
- **[P1] misalignment** `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-list-tools-parity.md:3,11,17-21,40,59-60,69,89,93` — Manual playbook still locks spec-memory CLI parity to 37 tools
  - evidence: Frontmatter says 'spec-memory 37, code-index 8, skill-advisor 9'. Lines 11/17-21/40/59-60/69/89/93 repeat the 37-tool expectation and call the vitest suite a '37-tool parity lock', while spec-memory-cli-parity-and-help.vitest.ts:122 asserts 'exactly 39 tools'.
  - fix: Update the playbook to 39 tools and note that memory_index_scan_status and memory_index_scan_cancel raised the count.
- **[P1] drift** `.opencode/bin/cli-offline-smoke.cjs:12` — Offline smoke check hardcodes spec-memory count as 37
  - evidence: `{ name: 'spec-memory', shim: path.join(__dirname, 'spec-memory.cjs'), expectedCount: 37 }` while TOOL_DEFINITIONS and the parity test both enforce 39 tools.
  - fix: Change expectedCount to 39 and update the smoke check's documentation comments.
- **[P2] drift** `.opencode/skills/system-spec-kit/manual_testing_playbook/16--tooling-and-scripts/cli-stress-large-payload-pipe-integrity.md:11` — Stress scenario rationale cites 37 tools as the size driver
  - evidence: 'the 37 tools carry their full schemas' — the fixture now has 39 tools, so the stated size premise is stale (the >64KB invariant still holds).
  - fix: Update the rationale to cite 39 tools.
