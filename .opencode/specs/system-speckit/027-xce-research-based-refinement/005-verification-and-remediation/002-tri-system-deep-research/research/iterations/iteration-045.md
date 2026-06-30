# Iteration 045 — Angle 45

**Angle:** Trusted-mutation gating: advisor_rebuild/skill_graph_scan --trusted docs vs actual enforcement.

**Summary:** The core advisor_rebuild and skill_graph_scan gates are enforced fail-closed in code and the CLI refused untrusted calls with exit 64. The main issues are contract drift around trusted context in docs/install snippets, plus a real CLI-vs-daemon mismatch for `skill_graph_propagate_enhances` report mode.

**Findings kept:** 5

## [P1][BROKEN-FEATURE] CLI and daemon disagree on propagate-enhances trust gating

- Evidence: .opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/skill-advisor-cli.md:23; .opencode/skills/system-skill-advisor/mcp_server/skill-advisor-cli.ts:655-664; .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:40-43
- Detail: Docs and CLI client-side validation treat only real apply-mode `skill_graph_propagate_enhances` as requiring `--trusted`, but the daemon handler requires trusted caller context for report/propose/apply before any detection runs. That means the CLI contract is not byte-for-byte aligned with daemon enforcement for the default no-write report path.
- Fix sketch: Either require `--trusted` for all `skill_graph_propagate_enhances` modes in the CLI/docs, or relax daemon auth for report/propose only.

## [P1][DOC-DRIFT] Mutation-boundary docs falsely say only advisor_rebuild mutates SQLite

- Evidence: .opencode/skills/system-skill-advisor/README.md:108; .opencode/skills/system-skill-advisor/references/runtime/freshness_contract.md:134; .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/scan.ts:49-58
- Detail: The docs claim only `advisor_rebuild` mutates the SQLite database. The `skill_graph_scan` handler also indexes skill metadata, refreshes embeddings, and publishes a new graph generation, so it is a mutation path and correctly requires trusted context.
- Fix sketch: Update freshness/trust docs to name both `advisor_rebuild` and `skill_graph_scan` as SQLite/generation mutation paths.

## [P1][README-MISALIGNMENT] Install guide config omits trust grant needed for native MCP mutations

- Evidence: .opencode/install_guides/README.md:781-794 omits MK_SKILL_ADVISOR_TRUST_DEFAULT; .opencode/skills/system-skill-advisor/mcp_server/advisor-server.ts:198-211 requires the daemon env grant for absent _meta; opencode.json:61-68 shows the current working config includes it
- Detail: The install guide's `mk_skill_advisor` MCP config block lacks `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted`, while the server fails closed for transport-absent metadata unless that daemon-owned env grant is present. Users following the guide can end up with `advisor_rebuild`/`skill_graph_scan` rejected from native MCP repair flows.
- Fix sketch: Add `MK_SKILL_ADVISOR_TRUST_DEFAULT=trusted` and the current trust note to the install guide's config snippet.

## [P2][README-MISALIGNMENT] Setup guide still tells users to call skill_graph_scan without trusted context

- Evidence: .opencode/install_guides/SET-UP - Skill Advisor.md:101-103 and :149; command `node .opencode/bin/skill-advisor.cjs skill_graph_scan --format json --warm-only` returned `{ "status": "error", "error": "skill_graph_scan requires --trusted or MK_SKILL_ADVISOR_CLI_TRUSTED=1", "exitCode": 64 }`
- Detail: The setup guide repeatedly says to call `skill_graph_scan({})` after metadata edits, but current CLI enforcement requires `--trusted` or the trusted env grant. The guidance is incomplete for operators using the daemon-backed CLI or an MCP surface without the trust default.
- Fix sketch: Change the examples to `skill_graph_scan` from a trusted MCP env block or `node .opencode/bin/skill-advisor.cjs skill_graph_scan --trusted`.

## [P2][BUG] Shared trust rejection message is hard-coded to skill_graph_scan

- Evidence: .opencode/skills/system-skill-advisor/mcp_server/lib/auth/trusted-caller.ts:30-34; .opencode/skills/system-skill-advisor/mcp_server/handlers/skill-graph/propagate-enhances.ts:40-42
- Detail: `requireTrustedCaller` returns the message `skill_graph_scan requires trusted caller context` for any caller that uses the shared guard. `advisor_rebuild` overrides the message, but `skill_graph_propagate_enhances` surfaces the wrong tool name on auth rejection.
- Fix sketch: Pass the tool name into `requireTrustedCaller` or let handlers map `UNTRUSTED_CALLER` to tool-specific error text.
