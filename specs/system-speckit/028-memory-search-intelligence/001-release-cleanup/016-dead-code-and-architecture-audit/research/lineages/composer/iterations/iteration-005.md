# Iteration 005 — commands/, agents/, repo-root config, runtime mirrors

**Focus:** Doctor command surface, agent mirror drift, MCP registration across `opencode.json` vs `.cursor/mcp.json`, legacy colon-form command files.
**newInfoRatio:** 0.55
**Novelty:** Quantified agent mirror divergence, documented colon-form doctor companions coexisting with argv router, and cursor MCP config shape difference.
**Status:** complete

## Findings

### F18 — CAT-2: Legacy colon-form doctor command markdown companions still present
- **Path:** `.opencode/commands/doctor/mcp.md`, `.opencode/commands/doctor/update.md`, `.opencode/commands/doctor/speckit.md`
- **Evidence:** `speckit.md:33` states `/doctor:update` and `/doctor:mcp` have separate routers; CLAUDE.md/AGENTS.md say not to route deleted legacy `/doctor:<name>` colon-forms for subsystem targets, but companion commands remain for MCP install/debug and update orchestration.
- **Proof:** `find .opencode/commands/doctor -maxdepth 1 -name '*.md'` → includes `mcp.md`, `update.md`; `rg 'doctor:mcp|doctor:update' .opencode/commands/doctor/speckit.md` → line 33.
- **Simpler shape:** Fold into `/doctor mcp` and `/doctor update` argv routes with redirects only, then delete colon-form command files.

### F19 — CAT-5: All 14 agent definitions differ between `.opencode/agents/` and `.claude/agents/`
- **Path:** `.opencode/agents/*.md` vs `.claude/agents/*.md`
- **Evidence:** `diff -rq .opencode/agents .claude/agents` reports differ for every agent including `deep-research.md`, `orchestrate.md`, `code.md`.
- **Proof:** `diff -rq .opencode/agents .claude/agents | wc -l` → 14; `wc -c .opencode/agents/deep-research.md .claude/agents/deep-research.md` → 34939 vs 34715 bytes.
- **Simpler shape:** Single canonical agent directory with runtime sync script (documented in hook-system.md) instead of manually mirrored trees.

### F20 — CAT-5: `.cursor/mcp.json` server key set differs from root `opencode.json` schema
- **Path:** `opencode.json`, `.cursor/mcp.json`
- **Evidence:** Cursor config uses flat server keys (`mk-spec-memory`, `code_mode`, etc.); comparison shows structural divergence (not byte-identical).
- **Proof:** `diff opencode.json .cursor/mcp.json` → differ; `jq -r '.mcpServers | keys[]' .cursor/mcp.json` → code_mode, mk-spec-memory, mk_code_index, mk_skill_advisor, sequential_thinking.
- **Simpler shape:** Generate `.cursor/mcp.json` from `opencode.json` template in doctor update bootstrap.

### F21 — CAT-3: Local `node_modules` trees under `.opencode/` (425M + 94M) are gitignored workspace residue
- **Path:** `.opencode/skills/system-spec-kit/node_modules`, `.opencode/node_modules`
- **Evidence:** Large on-disk trees; gitignored per `.opencode/.gitignore`.
- **Proof:** `du -sh .opencode/skills/system-spec-kit/node_modules .opencode/node_modules` → 425M, 94M; `git check-ignore -v .opencode/skills/system-spec-kit/node_modules` → `.opencode/.gitignore:1:node_modules`.
- **Simpler shape:** Document `npm ci` expectation in skill README; optional doctor check for stale node_modules size (not deletion in audit phase).

### F22 — CAT-1: `check-no-spec-imports.cjs` referenced only from bin docs/tests (guard script orphan from CI)
- **Path:** `.opencode/bin/check-no-spec-imports.cjs`
- **Evidence:** 3 non-spec references per iteration-1 style count; proves bin does not import spec tree at runtime.
- **Proof:** `rg -l 'check-no-spec-imports' --glob '*.{json,md,cjs}' .opencode/bin .opencode/plugins .opencode/skills/system-spec-kit | grep -v specs | wc -l` → 3.
- **Simpler shape:** Wire into pre-commit or validate.sh once; otherwise fold into existing compiled-route-guard.

## Dead Ends / Ruled Out
- `.devin/skills` directory absent — Devin uses `.devin/hooks/` only for spec-kit integration.

## Next focus
Synthesis — merge 22 findings across CAT-1..6 with convergence report (stopReason: max_iterations).
