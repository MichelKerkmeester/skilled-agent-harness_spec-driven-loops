# Iteration 002 — F1: Cursor one-time MCP approval

## Focus
Determine whether per-server manual MCP approval is Cursor's intended security posture and identify the cleanest pre-approval path for a repo's own MCP server (operators + CI).

## Actions Taken
1. Read the local cli-cursor reference docs (`cli-reference.md`, `cursor-tools.md`) for the MCP approval surface.
2. Web-researched Cursor's MCP trust/approval model and pre-approval mechanisms.

## Findings

### Root cause
Cursor's project-scoped MCP servers **require a one-time operator trust grant** before tools load. This is clearly **intended security behavior** (equivalent to VS Code's workspace trust / Claude Code's mcp tool-approval), not a bug. A server configured in `.cursor/mcp.json` is discovered but starts in an **unapproved** state (`needs approval`) until an operator explicitly approves it. The `cursor-agent mcp list` output (`sk-vision: not loaded (needs approval)`) is the accurate, expected representation of that state.

### Bug vs expected
**Expected.** Cursor does not ship a per-server `"trusted": true` / `"autoApprove": true` JSON field in `mcp.json` (community reports confirm `autoApprove` is not a supported `mcp.json` field; tool-execution approval is managed by Cursor's UI/allowlist settings, not per-server JSON).

### The cleanest durable pre-approval paths (3, ordered by blast radius)

1. **Per-dispatch CLI flag — `--approve-mcps`** (best for CI/orchestration one-offs):
   `cursor-agent -p "<task>" --model composer-2.5 --auto-review --sandbox enabled --approve-mcps`
   Auto-approves all configured MCP servers **for that single dispatch**. It is not a persistent trust grant and does not replace the operator's `mcp enable` trust mutation ([SOURCE: file: .opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:110,243]).
2. **Persistent operator trust — `cursor-agent mcp enable sk-vision`** (the action already performed). This is the durable per-server approval; it must be run by an operator (or an explicit CI step), never by the manual-testing-playbook itself, because it is a security trust mutation ([SOURCE: file: .../cursor-tools.md:102]).
3. **Move the server to user scope — `~/.cursor/mcp.json`** so a personally-trusted server avoids the project-level approval step. Community-confirmed workaround for repeated project approval prompts ([SOURCE: web forum.cursor.com/t/remote-url-sse-mcp-still-broken-for-agent-12-months-workaround/154832]).

### Recommendation for cli-cursor playbook + skill docs
The playbook already treats `needs approval` as an operator-action SKIP. The durable documentation fix: the cli-cursor skill should make explicit that (a) a configured-but-unapproved server is intentional and gated on `cursor-agent mcp enable <id>`, and (b) `--approve-mcps` is the non-interactive escape hatch for **automated** dispatches that must use MCP tools — so the documented dispatch recipe for any MCP-dependent task should carry `--approve-mcps`. Cross-host generalization: this is Cursor's per-host trust scope; Pi/OpenCode/Devin do not replicate it because they attach tools in-process or via a different allowlist (see F2).

## Questions Answered
- Q: Is per-server manual approval intentional? A: Yes — confirmed expected security posture.
- Q: Cleanest pre-approval for repo's own server? A: `--approve-mcps` for CI one-offs; `cursor-agent mcp enable` for persistent; `~/.cursor/mcp.json` to avoid re-approval.

## Questions Remaining
- None for F1.

## Next Focus
Iteration 3: F2 — Devin `-p` MCP rejection and the per-tool/per-server allowlist that avoids `--permission-mode dangerous`.

## Ruled Out
- Adding `"trusted": true`/`"autoApprove": true` to `.cursor/mcp.json` (not a supported field — would be a dead config).

## Source Citations
- [SOURCE: file: .opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md:110,243]
- [SOURCE: file: .opencode/skills/cli-external-orchestration/cli-cursor/references/cursor-tools.md:102-113]
- [SOURCE: web forum.cursor.com — remote-url-sse-mcp-still-broken-for-agent-12-months-workaround/154832]
- [SOURCE: web docs.cursor.com/context/model-context-protocol]
