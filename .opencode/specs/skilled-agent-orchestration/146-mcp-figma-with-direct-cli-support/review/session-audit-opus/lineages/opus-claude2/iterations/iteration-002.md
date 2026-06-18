# Iteration 002 — Security

**Dimension**: D2 Security
**Focus files**: scripts (token + patch handling), `tool_surface.md`, `mcp_wiring.md`
**Session**: fanout-opus-claude2-1781464600582-ntawto

## Scope

Credential exposure, trust boundaries (daemon binding, app.asar patch consent), and the gating of mutating / destructive / arbitrary verbs.

## What I checked

- **Daemon token never exposed.** `doctor.sh:33` reports the token file presence with "(contents NOT shown)" and never cats it. `_common.sh:48` defines `DAEMON_TOKEN_FILE` as a path constant, not contents. SKILL.md NEVER-rule 4 forbids pasting the token. [SOURCE: .opencode/skills/mcp-figma/scripts/doctor.sh:33] [SOURCE: .opencode/skills/mcp-figma/scripts/_common.sh:48]
- **Local binding.** Daemon `127.0.0.1:3456`, CDP `127.0.0.1:9222` — no external bind. [SOURCE: .opencode/skills/mcp-figma/scripts/_common.sh:50-51]
- **Patch consent.** `connect-yolo.sh` requires the explicit consent flag and states the rollback before patching. Safe (plugin) connect is the default. [SOURCE: .opencode/skills/mcp-figma/scripts/connect-yolo.sh:10-27]
- **No hardcoded secrets.** `print-utcp-snippets.sh:31` prints only the placeholder `figd_your_token_here`; `mcp_wiring.md` uses `${FIGMA_API_KEY}` / prefixed `.env` and never a real token. [SOURCE: .opencode/skills/mcp-figma/scripts/print-utcp-snippets.sh:31]
- **Arbitrary-verb gating.** `tool_surface.md:160-162` classes `eval`/`run`/`raw` ARBITRARY with the §7 review-before-run rule; `eval`/`raw`/`run` are kept off the default path. [SOURCE: .opencode/skills/mcp-figma/references/tool_surface.md:160-162]
- **Destructive set.** `tool_surface.md:208-227` requires confirm + explicit target + rollback, never the active-selection fallback. [SOURCE: .opencode/skills/mcp-figma/references/tool_surface.md:208-227]

## Findings

### F-OPUS-002 (P2, security) — arbitrary/destructive gating is contract-only
The `eval`/`raw`/`run` and destructive-verb gates live entirely in prose (`tool_surface.md` §6/§7, SKILL.md NEVER-rules). There is no programmatic consent wrapper for those verbs the way `connect-yolo.sh` gates the patch. This is inherent to a docs-and-scripts skill and the AGENTS.md framework provides the enforcement layer, so it is advisory, not blocking.
[SOURCE: .opencode/skills/mcp-figma/references/tool_surface.md:185-190]

### Claim adjudication
No P0/P1 in this iteration. No credential leak, no unsafe bind, no missing patch consent found.

## Coverage

- Dimensions covered so far: D1, D2
- New findings this iteration: 1 (P2)
- newFindingsRatio: 0.15

Review verdict: PASS
