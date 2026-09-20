# Iteration 006 - README rows, line-exact: every found claim with its current truth

## Focus

README rows, line-exact: for every stale or understated README claim found so far (gate system and thresholds, clone URL and badges, domain-skill and template and scenario counts, agent roster, mcp-tooling bridge list, `.vscode/mcp.json`, sk-code surfaces, doctor workflow count), record the exact line number, the exact current wording, the exact current truth and the file or commit that proves it.

## Actions Taken

1. Loaded run state (`deep-research-strategy.md`, `findings-registry.json`); carried the README claims verified in iterations 2-3 and the residuals carried in iteration 5.
2. Read the root `README.md` end to end in line ranges (L1-312, L313-535, L604-620, L640-814, L952-975) plus a 63-match keyword sweep across all 1052 lines.
3. Probed the live tree for each claim's current truth: skill and agent directories, both `mode-registry.json` files, the template tree, the doctor asset folder, the advisor and mcp-click-up playbooks, the MCP config files, `git remote -v`, `git ls-files .vscode`, `.vscode` deletion history, and HTTP status of both repo slugs.
4. Composed the line-exact claim table. All researched files stayed read-only.

## Findings

| # | README line(s) | Exact current wording (abridged) | Current truth | Proof |
|---|---|---|---|---|
| 1 | L45, L261 | "GATE SYSTEM (3 mandatory gates)"; "3 mandatory gates run before any file change" | Five mandatory gates (Gate 1 Understanding, Gate 2 Skill Routing, Gate 3 Spec Folder, Gate 4 Workflow Tiebreakers, Gate 5 Repo Rules) plus three post-execution gates | root `AGENTS.md` sections 2 and 4 |
| 2 | L271 | "confidence >= 0.70, uncertainty <= 0.35" | Threshold table: >=80% proceed; 40-79% proceed with caveats; <40% ask. The 0.70/0.35 pair is gone | `AGENTS.md` section 2, "Confidence Thresholds" |
| 3 | L14-16 | badge URLs `img.shields.io/.../MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration` | Canonical slug is `MichelKerkmeester/skilled-agent-harness_spec-driven-loops`; the old slug answers 301 to it | `git remote -v`; `curl`: old slug `301 -> .../skilled-agent-harness_spec-driven-loops`, new slug 200 |
| 4 | L96-97 | `git clone https://github.com/MichelKerkmeester/opencode--spec-kit-skilled-agent-orchestration.git`; `cd opencode--spec-kit-skilled-agent-orchestration` | Same redirect; the clone works and `cd` matches the URL basename used, so the defect is the label, not a broken walkthrough | `git remote -v`; 301 probe |
| 5 | L59 | "20 domain skills" | 13 skill packets ship in `.skilled/skills/` (same 13 in `.claude/skills/`) | directory listings; the README's own L10 and L547 already say 13 |
| 6 | L180 | "Sixteen templates ship under `.skilled/skills/system-spec-kit/templates/`." | 18 `.tmpl` files: core 4, addons 10, packet-types 4; the table omits `research.spec.md.tmpl` and `review-report.md.tmpl` | `ls` of the three template folders |
| 7 | L413 | "Manual testing playbook: 47 scenario files ..." | Holds: 47 scenario `.md` files (plus index and vitest harness, 49 hits) verified in iteration 3; re-observed as 9 topic dirs whose depth-2 listing counts 47 | iteration-3 finding-3-4; playbook dir listing |
| 8 | L609 | "96-feature catalog + 76-scenario playbook included" | Unresolved: the package ships a 14-group feature catalog and an 11-group playbook; the 96/76 document-level totals were not re-verified | mcp-click-up dir listings (residual) |
| 9 | L640-691 | roster: Orchestrate, Code, Context, Review, Debug, Markdown, Prompt-Improver / AI Council, Deep Research, Deep Review, Context Retrieval, Deep Improvement | The 12 shipped agents include `design` (no roster row); `context` appears twice (as "Context" and "Context Retrieval") | `.skilled/agents/` and `.claude/agents/` listings (12 agent files each) |
| 10 | L607 | "One advisor identity routing to `mcp-chrome-devtools` ..., `mcp-click-up` ..., and `mcp-figma` ..." | 10 modes ship: workflow modes chrome-devtools, click-up, obsidian, aside-devtools, notion, orca-cli; transports figma, refero, mobbin, magicpath | `mcp-tooling/mode-registry.json` discriminator; 10 `mcp-*` dirs |
| 11 | L945 | customization row naming `mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, and `mcp-figma` | Same 10-mode truth; this row names 4 and omits 6 | same registry |
| 12 | L966 | "- **`.vscode/mcp.json`** - VS Code / Copilot MCP configuration wrapper." | Dead row: no `.vscode/` directory; `git ls-files .vscode` returns 0; deleted in commit 759713c41aa | `git ls-files`, `git log --diff-filter=D -- .vscode`; iteration-3's ~55-path probe found this the only miss |
| 13 | L567 | "Two ready surfaces: WEBFLOW (...) and OPENCODE (...)" | Three surfaces ship: webflow, opencode, obsidian | `sk-code/mode-registry.json` `extensions.surface-axis.surfaces`; the same README's L950 lists all three packets |
| 14 | L839 | "The 12 underlying YAML workflows in `.skilled/commands/doctor/assets/` are self-sufficient." | 13 `doctor-*.yaml` workflows (deep-loop, embeddings, fable-mode, mcp-debug, mcp-install, parent-skill, router-reach, runtime-mirrors, skill-advisor, skill-budget, skill-graph-freshness, speckit-retrieval, update) plus three `.txt` presentations | doctor assets listing |

Held claims (verified true; no action): L9/L36 "12 Specialized Agents"; L10 "13 On-Demand Skills"; L278 "confidence >= 0.8 -> MUST load skill" (Gate 2); L547 "13 advisor skill identities"; L413 scenario count; L696 command inventory (iteration 3).

Secondary observations: L936's customization row names "Webflow + OpenCode + Motion.dev" where the third shipped surface is obsidian; the "Core Configuration Files" list (rows at L965-966) omits the live `.cursor/mcp.json` and `.pi/mcp.json`; shields.io redirect-following for the badges was not tested (GitHub API redirects; shield rendering unverified).

Every row above is correction-shaped (a count, a label, a dead row, a list extension). The README's recent history already shows this pattern - 4dcc8c8f49 "docs(repo): correct ten claims the documentation review found false" and 5e9dbcbc42 "docs(readme): ... correct two command claims" - so Q5's targeted-correction verdict holds.

## Questions Answered

- Q3: substantially answered at line level. The stale/understated set is the 14 rows above; everything else sampled holds.
- Q3 residual closures this iteration: clone-slug redirect (301 -> new slug; label stale, walkthrough works); doctor 12-vs-13 (13 workflows ship); templates 16-vs-18 (18 ship); `.vscode/mcp.json` (deleted and untracked).
- Q1: clone-slug residual closed; the changelog-side classification from iteration 5 is unchanged.
- Q5: unchanged - targeted corrections still suffice for both documents.

## Questions Remaining

- Q3 residuals: "121 advisor test files / 872 tests" (L412) not counted; `AC_CLOSURE`/`AC_COVERAGE` presence in `dist/`; Node "18+" engines (L92); `.utcp_config.json` 14 templates vs 7 integrations (L894-902); Related Documents links (L420-431); `ai-council` vs `deep-ai-council` mode-key naming; new residuals: L609 96/76 totals; L936 "Motion.dev" naming; badge redirect behavior on shields.io.
- Q2 residuals: compiled-router closure for `sk-design`; Rust placement; `@markdown` / `deep-ai-council` renames.
- Q1 residual: L130 anchor-resolver behavior under the two root names.
- Q4: additive-gap list stands (iterations 4-5).

## Next Focus

Q3 residuals above (advisor test counts, Node engines, `.utcp_config.json`, Related Documents links), then the Q2 and Q1 residuals.

## SCOPE VIOLATIONS

None. All writes stayed within `iterations/iteration-006.md`, `deltas/iter-006.jsonl`, and the contract-mandated temp record consumed by the append gateway.
