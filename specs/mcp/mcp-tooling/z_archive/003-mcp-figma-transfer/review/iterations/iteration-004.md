# Iteration 004 — D4 Maintainability

## Findings (P0/P1/P2 with evidence)

### P0 — Blockers

None.

### P1 — Required

1. **The skill index still has contradictory total skill-folder counts after `mcp-figma` removal.** The requested count command returns 17 top-level non-hidden skill folders:
   - Command: `ls -d .opencode/skills/*/ | wc -l`
   - Result: `17`
   - Current non-hidden folders: `cli-claude-code`, `cli-codex`, `cli-gemini`, `cli-opencode`, `mcp-chrome-devtools`, `mcp-coco-index`, `mcp-code-mode`, `sk-code`, `sk-code-review`, `sk-deep-research`, `sk-deep-review`, `sk-doc`, `sk-git`, `sk-improve-agent`, `sk-improve-prompt`, `system-spec-kit`.
   Evidence: `.opencode/skills/README.md:44` says the tree holds 21 skill folders, while `.opencode/skills/README.md:54` says `Total skill folders | 16`. The MCP integration row is correct at `.opencode/skills/README.md:58` with 3 entries and no `mcp-figma` references, but the total count drift fails the D4 consistency gate.

2. **Install-guide skill counts are stale and disagree with both the skill index and actual disk state.** `rg -n "mcp-figma" .opencode/install_guides/README.md ".opencode/install_guides/SET-UP - AGENTS.md"` returns no hits, so the deleted skill name is gone. The remaining counts are inconsistent:
   - `.opencode/install_guides/README.md:1453` says `.opencode/skills/` has 18 skills.
   - `.opencode/install_guides/README.md:1464` says `Skills | 15`, and the listed set omits current folders such as `cli-opencode`, `sk-deep-review`, and `sk-improve-agent`.
   - `.opencode/install_guides/SET-UP - AGENTS.md:523` says `Current Installation (9 skills)`, but the visible table at `:525-532` lists only 6 rows.
   - `.opencode/install_guides/SET-UP - AGENTS.md:975` and `:1000` still say `All 9 skills installed`.
   These are maintainability defects because future setup/customization work will copy stale routing inventory into `AGENTS.md`.

### P2 — Suggestions

1. **Barter and Public Figma agent copies have a one-line non-behavioral heading drift.** `diff -rq` between Barter Figma and Public Figma reports only `AGENTS.md` differing. The diff is:
   - Barter `AI_Systems/Barter/MCP Agents/Figma/AGENTS.md:181`: `### Step 7 Detail: Figma Operations Pipeline`
   - Public `AI_Systems/Public/Figma/AGENTS.md:181`: `### Figma Operations Pipeline`
   The D4 expected-diff rule allowed README/context/node_modules differences, not `AGENTS.md`, so this is drift. I am keeping it P2 because the surrounding Step 7 table at `:174-179` is identical and the heading change does not alter routing behavior.

## Coverage Verified

| Sub-check | Status | Evidence |
|---|---|---|
| A. Folder mirror parity Barter↔ClickUp | PASS | `diff -rq` shows expected per-agent content/name differences. Authored top-level layout matches exactly: `AGENTS.md`, `README.md`, `INSTALL_GUIDE.md`, `Favicon.jpg`, `context/`, `knowledge base/`, `mcp servers/`. Excluding `node_modules`, both trees have 9 directories and the same base subfolder shape: `knowledge base/{integrations,reference,system}` plus two MCP server child folders. Flagged extras: ClickUp has context sample/import files and a CLI KB doc; Figma has `.gitkeep` and Figma-specific MCP server names. |
| B. Barter↔Public Figma diff | FAIL | `diff -rq ".../Barter/MCP Agents/Figma" ".../Public/Figma"` reports only `AGENTS.md` differing. `README.md` has no diff, and both sides currently have `context/.gitkeep` plus `mcp servers/figma-mcp-stdio/node_modules`. Unexpected difference: heading at `AGENTS.md:181`, recorded as P2. |
| C. KB frontmatter uniformity | PASS | Both Barter and Public have 5 Figma KB docs. Line-1 `^---` grep count is 0. First non-empty content lines are the expected H1s: `# Figma - Integrations - MCP Knowledge - v0.100`, `# Figma - Reference - Combined Workflows - v0.100`, `# Figma - System - Interactive Intelligence - v0.100`, `# Figma - System - Prompt - v0.100`, and `# Figma - Thinking - SYNC Framework - v0.100` in both repos. |
| D. Public README §8 + badge math | PASS | `AI_Systems/Public/README.md:9` has `Systems-8_Total`; the `MCP's Made Easy` TOC has 6 entries: 3 Media Editor, 4 Webflow, 5 Notion, 6 CapCut, 7 ClickUp, 8 Figma. Anchor `<a id="8-figma-agent"></a>` resolves at `:186`; §8 at `:187` mirrors §7 with emoji/numbered H3, lead paragraph, smart-agent block, and capabilities. |
| E. Skill index consistency | FAIL | Exact requested count `ls -d .opencode/skills/*/ | wc -l` returns 17. `.opencode/skills/README.md:44` says 21 and `:54` says 16. MCP integration skills are correct at 3 on `:58`, and `rg "mcp-figma" .opencode/skills/README.md` returns no hits. |
| F. Install guides consistency | FAIL | No `mcp-figma` references remain in `.opencode/install_guides/README.md` or `SET-UP - AGENTS.md`. Counts are stale: README says 18 skills at `:1453` and 15 at `:1464`; SET-UP says 9 skills at `:523`, `:975`, and `:1000`. Actual non-hidden skill-folder count is 17. |
| G. Cross-repo commit hygiene | PASS | `git show --stat --oneline --name-only 9f7b3c6d4 a4cb4e0a1 7307e056d b03bf7563` touches only mcp-figma removal/cross-reference files, advisor corpus/fixtures, install-guide cleanup, and the `067-mcp-figma-transfer` spec packet. No unrelated `sk-code`, `sk-deep-review`, or parallel-work files appear. |

## Verdict

D4: CONDITIONAL

No P0 maintainability blocker was found, but the skill index and install-guide count drift are P1 documentation-maintenance defects. They should be corrected before relying on these docs for future setup, routing, or resume work.

## Cumulative Verdict After 4 iterations

D1+D2+D3+D4: FAIL overall because D3 still has active P0 findings for child `--strict` validation and unchecked checklist evidence. D2 and D4 add active P1s. No D4 P0 was added.

## Next Focus (for iteration 5)

Cross-cutting + adversarial review: verify whether the active D2/D3/D4 findings are independent or symptoms of one stale-doc synchronization problem, then test the highest-risk resume/setup path a future agent would actually follow.
