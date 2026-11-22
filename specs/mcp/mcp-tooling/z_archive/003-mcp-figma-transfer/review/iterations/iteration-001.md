# Iteration 001 — D1 Correctness

**Executor:** cli-codex (gpt-5.5 high reasoning, fast)
**Dimension:** D1 Correctness
**Started:** 2026-05-05T09:30:15Z

## Findings

### P0 — Blockers

None.

### P1 — Required

None.

### P2 — Suggestions

None.

## Coverage Verified

| Sub-check | Status | Evidence |
|---|---|---|
| A. Persona boundaries (Barter) | PASS | `AI_Systems/Barter/MCP Agents/Figma/AGENTS.md:11-16` includes NOT designer, NOT implementation guidance, NOT manual Figma API, and ARE operating via 18 MCP tools / native tooling only; `AGENTS.md:20` starts the Authority Level supersession block. |
| A. Persona boundaries (Public) | PASS | `AI_Systems/Public/Figma/AGENTS.md:11-16` includes the same four boundary statements; `AGENTS.md:20` starts the Authority Level supersession block. |
| B. Command Registry parity | PASS | Barter and Public `AGENTS.md:84-92` have identical `$file/$node/$export/$component/$style/$team/$comment/$auth/$interactive` rows, shortcuts `$f/$n/$e/$c/$s/$t/$cm/$a/$int`, and MCP tool mappings. `diff -u` over the two Command Registry blocks returned no differences. |
| C. SYNC verb consistency | PASS | `rg -n "Capture"` across both Figma agent folders, excluding `node_modules` and `.opencode`, returned 0 hits. Positive SYNC evidence: Barter/Public `AGENTS.md:177,192` and KB prompt docs `Figma - System - Prompt - v0.100.md:23,42,79,711` use Survey → Yield → Navigate → Create. |
| D. 18 tools catalog accuracy | PASS | Barter and Public MCP Knowledge docs are identical. Barter KB lists six category sections with counts: file 4 (`:352`), image 2 (`:463`), comments 3 (`:528`), team/projects 2 (`:615`), components 4 (`:678`), styles 3 (`:785`). Tool rows count to 18, with priority counts HIGH=5, MEDIUM=7, LOW=6 at `:869`, `:881`, `:895`, matching source `git show 9f7b3c6d48^:.opencode/skills/mcp-figma/references/tool_reference.md` sections HIGH=5, MEDIUM=7, LOW=6. |
| E. mcp-code-mode KEEP set ≥6 files | PASS | `rg -l "figma-developer-mcp\|figma\.figma_\|FIGMA_API_KEY" .opencode/skills/mcp-code-mode` returned 13 files and `rg -n` returned 72 refs, preserving the D1 KEEP set above the ≥6 file / ~50 ref threshold. |
| F. mcp-code-mode skill-name 0 hits | PASS | `rg -n "mcp-figma" .opencode/skills/mcp-code-mode` returned 0 hits, confirming the D1 skill-name strip set is applied. |

## Verdict

D1: PASS

## Next Focus (for iteration 2)

Pass to D2 Security: verify token exposure boundaries, environment-variable prefix behavior, OAuth/PAT setup safety, and absence of committed secrets across Barter/Public Figma folders and mcp-code-mode retained Figma references.
