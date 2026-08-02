# Resource Map — Webflow MCP 2.0 Phase 1 Research

## Primary Sources (cited)

| Resource | Role | Lineages |
|---|---|---|
| https://webflow.com/blog/mcp-2-features | Seed; MCP 2.0 capability announcement | both |
| https://developers.webflow.com/mcp/reference/overview.md | Official MCP overview; supported clients | luna-fast |
| https://developers.webflow.com/mcp/reference/getting-started.md | Connection flow | luna-fast |
| https://developers.webflow.com/mcp/reference/how-it-works.md | Remote server, OAuth, Bridge App boundary | both |
| https://developers.webflow.com/mcp/tools/data-tools.md | Data tool inventory; per-action read/write | luna-fast |
| https://developers.webflow.com/mcp/tools/designer-tools.md | Designer tool surface; Bridge App dependency | luna-fast |
| https://developers.webflow.com/mcp/reference/skills.md | Skills orchestration layer; safe-publish pattern | luna-fast |
| https://github.com/webflow/mcp-server (README, package.json, src/tools/*.ts) | Official server; 18 tool modules; combined-tool pattern; per-action classes | deepseek-max |
| https://developers.webflow.com/data/docs/ai-tools.md | MCP overview, limitations, CMS draft/live FAQ | both |
| https://developers.webflow.com/data/reference/authentication.md | Auth modes | deepseek-max |
| https://developers.webflow.com/data/v2.0.0/reference/scopes.md | Scope model | deepseek-max |
| https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md | Site token | deepseek-max |
| https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md | Workspace token (read-only caveat) | deepseek-max |
| https://developers.webflow.com/data/reference/rate-limits.md | Plan rate limits; Retry-After | deepseek-max |
| https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md | Publish endpoint; customDomains vs webflow.io subdomain | deepseek-max |
| https://developers.webflow.com/llms.txt | Documentation index | deepseek-max |
| file:.opencode/skills/mcp-tooling/ | Hub leaf + registry layout (local) | deepseek-max |

## Dead Ends Recorded (negative knowledge)

- Invalid guessed documentation paths were recorded inside lineage iterations rather than replaced with unofficial sources (luna-fast methodology).
- npm `webflow-mcp` (third-party, 0.4.0) eliminated as the server package (official is `webflow-mcp-server` 1.0.1).
