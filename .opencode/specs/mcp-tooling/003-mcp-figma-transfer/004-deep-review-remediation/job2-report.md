# Job 2 Report - Cross-Repo Dead-Link Cleanup

Spec packet: `067-mcp-figma-transfer/004-deep-review-remediation`
Executor: `cli-codex`
Date: 2026-05-05

| Task | Status | Evidence |
| --- | --- | --- |
| T130 (R-013) | DONE | `readlink ".opencode/install_guides/MCP - Figma.md"` returned `../skill/mcp-figma/INSTALL_GUIDE.md`; `rm` executed; `test ! -e` passed; `.opencode/install_guides/README.md:78-85` no longer contains the Figma row. |
| T140 (R-014) | DONE | Retired source-skill links removed; replacements present at Barter README:674, Public README:674, Barter Combined Workflows:1068, and Public Combined Workflows:1068; dead `mcp-figma` source-link search returned no matches. |
| T150 (R-015) | DONE | Public local-bundled `cwd` now uses `/Users/<you>/MEGA/Development/AI_Systems/Public/Figma/mcp servers/figma-mcp-stdio` at Public INSTALL_GUIDE.md:410 and config-snippets.md:121. |
| T170 (R-017) | DONE | Canonical token placeholder `api_key: "figd_your_token_here"` present at Barter MCP Knowledge:433 and Public MCP Knowledge:433. |
| T200 (R-020) | DONE | Orphan `references/tool_reference.md` replaced with `knowledge base/integrations/Figma - Integrations - MCP Knowledge - v0.100.md` at Barter System Prompt:83 and Public System Prompt:83. |
| T210 (R-021) | DONE | INSTALL_GUIDE verify wording now states DNS resolution, HTTPS reachability, and best-effort MCP protocol response with OAuth caveat at Barter INSTALL_GUIDE.md:606 and Public INSTALL_GUIDE.md:606. |

Verification notes:
- Broken symlink target was verified before deletion.
- `.opencode/install_guides/README.md` no longer advertises `MCP - Figma.md`.
- Searches for the retired source-skill paths across the four T140 files returned no matches.
- Searches for the corrected Public `cwd`, canonical token placeholder, system prompt catalog path, and verify wording returned the expected lines.
