# Iteration 002 — D2 Security

**Executor:** cli-codex (gpt-5.5 high reasoning, fast)
**Dimension:** D2 Security
**Started:** 2026-05-05T09:30:03Z

## Findings

### P0 — Blockers

None.

### P1 — Required

1. Code Mode install-guide snippets still reference the unprefixed env var.
   Evidence: both install guides label the section "For Code Mode" but map `"FIGMA_API_KEY": "${FIGMA_API_KEY}"` instead of reading from `${figma_FIGMA_API_KEY}`:
   - `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/MCP Agents/Figma/INSTALL_GUIDE.md:341-365`
   - `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Public/Figma/INSTALL_GUIDE.md:341-365`
   The same guides later document the prefix rule correctly at lines 471-485, and both stdio `config-snippets.md` files use `${figma_FIGMA_API_KEY}` plus a critical warning at lines 71-85. The conflicting install-guide snippet is still a security/configuration footgun because it is the copy/paste path.

2. Knowledge-base examples use a token-shaped placeholder outside the allowed placeholder form.
   Evidence: `rg -n -P '(figd_(?!your_token_here\b)[A-Za-z0-9_-]+|pk_[A-Za-z0-9_-]+)'` over both Figma agent folders returned only:
   - `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Barter/MCP Agents/Figma/knowledge base/integrations/Figma - Integrations - MCP Knowledge - v0.100.md:433` with `api_key: "figd_your_token"`
   - `/Users/michelkerkmeester/MEGA/Development/AI_Systems/Public/Figma/knowledge base/integrations/Figma - Integrations - MCP Knowledge - v0.100.md:433` with `api_key: "figd_your_token"`
   This does not appear to be a real secret, but the D2 rule says only `figd_your_token_here` is acceptable. Normalize both examples.

### P2 — Suggestions

None.

## Coverage Verified

| Sub-check | Status | Evidence |
|---|---|---|
| A. No token exposure | FAIL | No real-looking `figd_*` or `pk_*` secrets found, but both KB copies contain non-approved `figd_your_token` placeholders at line 433. |
| B. Env var prefix rule documented | FAIL | Config snippets are correct (`config-snippets.md:71-85` in both repos), and install guides document the rule at `INSTALL_GUIDE.md:471-485`; however both install-guide Code Mode JSON snippets still use `${FIGMA_API_KEY}` at `INSTALL_GUIDE.md:341-365`. |
| C. OAuth flow safety | PASS | Option A is browser-based: both install guides say the browser opens the OAuth screen, sign in, approve, and return to the AI client at `INSTALL_GUIDE.md:554-564`; no instruction to commit OAuth tokens or paste tokens into shell history was found. |
| D. .gitignore enforcement | PASS | `git check-ignore -v` confirms Barter `.gitignore:7` ignores `node_modules/` and `.gitignore:11` ignores `.env`; Public `.gitignore:7` ignores `node_modules/` and `.gitignore:10` ignores `.env`. `git ls-files` returned no tracked stdio `node_modules` or `.env` paths. |
| E. verify.sh safety | PASS | HTTP verification script uses only `FIGMA_MCP_ENDPOINT` and timeout vars, posts JSON-RPC initialize/tools-list payloads, suppresses curl stderr, and prints only endpoint/status/protocol reachability; see Barter `mcp servers/figma-mcp-http/verify.sh:8-67`. |
| F. No committed secrets | PASS | `git ls-files` searches in both Barter `MCP Agents/Figma` and Public `Figma` returned no tracked `.env`, `*.pem`, token, secret, or credential files. |

## Verdict

D2: CONDITIONAL

## Next Focus (for iteration 3)

Pass to D3 Traceability after remediation notes are queued: verify spec docs, checklist evidence, commit ledger integrity, and implementation alignment across the three repos.
