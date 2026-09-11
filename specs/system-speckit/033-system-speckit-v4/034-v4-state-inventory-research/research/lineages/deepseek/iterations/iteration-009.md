# Iteration 9: Angle 9 — BREAKING CHANGES AND UPGRADE NOTES

## Focus
List every rename, removal, moved path, changed default and retired command since v3.6.0.0 that an upgrading operator would hit, using git log with targeted greps and timeline.md; separate confirmed-by-code from inferred-from-commit-message.

## INVENTORY

| Surface | Value | SOURCE |
|---|---|---|
| Branch / range | on skilled/v4.0.0.0; 4,449 commits since v3.6.0.0 (2026-06-18) | git branch; git log range |
| Tags | v3.6.0.0 (2026-06-18 21:48:57 +0200), v4.0.0.0-beta.1 present; no v4.0.0.0 tag | git tag; git log -1 v3.6.0.0 |
| Memory DB removal | CONFIRMED-BY-CODE: "remove the CLI's decommission orphans", "remove the shared package's dead half", "remove the CLI package residue"; runtime/data/trigger-index.json replaces memory; sweep-memory-residue.mjs kept | git log greps; retrieval/ ls |
| Runtime rename | CONFIRMED: "move the engine package to runtime and drop its MCP identity" (0db44e44c02), "retire the MCP-server identity from the runtime's live docs" (945ded30d94); no mcp-server/ or scripts/ at skill root | git log; skills ls |
| /interface:* retirement | CONFIRMED: "deprecate judgment hub + interface" (4ac89951ca1); "rename design-reference command to extract" (7ef698947aa); "give the moved modes and their commands the hub's own name" (e866336d2e8); today only /design:{chart,diagram,extract} | git log greps; commands/design/ ls |
| sk-prompt conversion | CONFIRMED: "bring the sk-prompt standalone conversion into main" (622f74cd4c0) — sk-prompt is standalone, not a hub | git log; sk-prompt/ ls |
| Open Design removal | CONFIRMED: "feat(sk-design)!: retire Open Design transport" (a38f8d7da78) — breaking commit | git log grep |
| Gemini route change | CONFIRMED: "retire the Gemini 3.8 Flash route from cli-devin" (da3d26aa767); cli-gemini/cli-copilot leaves absent from tree | git log; skills ls |
| DeepSeek variant change | CONFIRMED: "withdraw the DeepSeek Flash Vision variant, keep plain flash" (a8d5d24e9e4) on the opencode route | git log grep |
| deep-alignment mode | CONFIRMED ABSENT: no commit adds an alignment mode; "alignment" hits are the reality-alignment research lanes (docs), not a mode | git log grep |
| New validation rule | CONFIRMED: "register the wikilink scan as the LINKS_VALID rule" (fc6acd911f2) | git log grep |
| create.sh capability | CONFIRMED: "let create.sh scaffold review and research packets" (e1a408ff6b8) | git log grep |

## DRIFT

| Draft line | Claim | Verdict | Actual state | Severity | Correction | SOURCE |
|---|---|---|---|---|---|---|
| "**Renames to adopt.** sk-prompt-small-model → sk-prompt-models; @improve-prompt → @prompt-improver; /prompt → /prompt-improve; doc-quality → create-quality-control; @create → @markdown; the /create commands sk-skill → skill and folder_readme → readme" | Rename list | STALE (partial) | @markdown, skill, readme TRUE (agents/create ls); /prompt → actually /prompt:improve (file prompt/improve.md); sk-prompt-models does NOT exist (standalone conversion commit); no /doc:quality; no create-quality-control command | P1 | Only @markdown, /create:skill, /create:readme confirmed; /prompt:improve is the live command; prompt-models and doc:quality are gone | git log 622f74cd4c0; commands ls |
| "**Repoint what moved.** specs went from .opencode/specs/ to a top-level specs/; deep-loop-workflows and deep-loop-runtime merged into system-deep-loop; the deep router agent is now deep-loop" | Moved paths | STALE (partial) | specs/ top-level TRUE (repo root); deep-loop-* identities gone TRUE; BUT "deep router agent is now deep-loop" FALSE — agent retired, no deep-loop agent | P1 | Drop the deep-loop agent line; the router agent is retired | .opencode/agents/ ls |
| "**Drop removed surfaces.** cli-gemini and cli-copilot are gone — Copilot-shaped prompts now route to Claude Code. Remove the open_design server from .utcp_config.json and stop referencing design-generation-patterns.md" | Removed surfaces | TRUE | cli-gemini/cli-copilot absent; Open Design retired in a breaking commit (a38f8d7da78) | — | Confirmed | skills ls; git log |
| "**Changed defaults.** Pi hands subtasks to its own subagents unless you name a cli-* mode" | Pi subagent default | TRUE | pi-subagents dispatch directive existed and was later REMOVED: "remove the pi-subagents dispatch directive and injector hook" (1f382f64a49) — default is now native subagents by absence | P1 | Mechanic changed since draft: the pi-subagents directive itself was removed; pi-tools/agent-delegation docs remain | git log 1f382f64a49 |
| "New branches use the owner-first form" | Branch grammar | STALE | worktrees/NNN-slug or branches/NNN-slug; owner-first rejected (worktree-naming.sh) | P1 | See iteration 7 row | worktree-naming.sh:112-120 |
| "the deep loops ... a conformance-audit mode joins" | Alignment mode ships | FALSE | No alignment commits; only "reality-alignment" docs lanes | P0 | Never shipped; remove from upgrade notes | git log grep |
| "Codex and Devin ... brought back" | Executor revival | TRUE | cli-codex + cli-devin leaves with full install/auth docs | — | Confirmed | leaf SKILL.md |

## Sources Consulted
- git log v3.6.0.0..HEAD with targeted --grep (memory, mcp-server, prompt, gemini/copilot, interface, alignment, open design, hub), git tag, git log -1 v3.6.0.0
- .opencode/skills, .opencode/commands, .opencode/agents ls (tree state)

## Assessment
- **newInfoRatio**: 0.85 — commit-level confirmations are new; several draft upgrade notes were already flagged in prior angles.
- **Confidence**: Confirmed-by-code for every row (git log + tree state). No inferred-from-message rows carried without tree confirmation.

## Reflection
- Worked: narrow --grep + tree `ls` pairs confirm-or-kill each upgrade note in one call each.
- Failed: nothing failed.
- Ruled out: full 4,449-commit read (targeted greps only, per briefing).

## Recommended Next Focus
Angle 10: DRAFT-VERSUS-REALITY — walk CHANGELOG-v4.0.0.0.md section by section and record TRUE/STALE/FALSE/MISSING per checkable claim, prioritizing the sections the earlier angles found most wrong.
