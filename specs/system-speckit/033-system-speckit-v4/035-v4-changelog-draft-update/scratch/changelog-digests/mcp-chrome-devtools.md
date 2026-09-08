# mcp-chrome-devtools changelog digest

Skill path: `.opencode/skills/mcp-tooling/mcp-chrome-devtools/`. Versions covered: 1.0.0.0 through 1.0.11.0, all 7 entries the changelog folder holds (fewer than 10 exist, so every entry is included). Date range: 2025-12-27 through 2026-08-04. Versions 1.0.3.0 through 1.0.6.0 and 1.0.9.0 have no changelog file.

## Per version, newest first

### 1.0.11.0 (2026-08-04, `v1.0.11.0.md`)

The skill README was rewritten in the purpose-first voice the fleet adopted after the mcp-obsidian pilot. It now opens with a one-line pitch in a blockquote under the H1, then a problem-first overview, an at-a-glance table and numbered all-caps sections. Every capability, command, path and reference the previous README recorded was kept, including the CDP capability surface, the two-path router and the three example workflows. The README frontmatter version field moved from 1.0.0.22 to 1.0.11.0 so the document and the changelog record agree again. No runtime behavior and no `.utcp_config.json` state changed.

### 1.0.10.0 (2026-07-16, `v1.0.10.0.md`)

Inventory parity with the sibling mcp-tooling modes. A `feature-catalog/` was added with a root catalog file plus 29 per-feature files across 7 domains (cli_bdg_lifecycle, protocol_discovery, dom_and_screenshot, console_and_network, mcp_parallel_instances, automation_and_performance, recovery_and_troubleshooting), mirroring the mcp-click-up structure and frontmatter. `assets/utcp-chrome-devtools-manuals.md` was added as a byte-true snapshot of the dual `chrome_devtools_1` and `chrome_devtools_2` Code Mode manual registrations, extracted with `jq`, carrying the dual-manual-for-parallelism rationale and a verify-do-not-re-add provenance contract. Two `mcp-servers/` pointer folders were added, `bdg-cli/README.md` for the CLI install pointer with nothing vendored and `chrome-devtools-mcp/README.md` for the Code Mode server behind the manuals. SKILL.md section 8 was updated to link all three. The entry states no runtime, routing or `.utcp_config.json` change.

### 1.0.8.0 (2026-02-20, `v1.0.8.0.md`)

Wording only. SKILL.md was made the clearly stated starting point and the older navigation page `index.md` was reframed as supplemental rather than primary, so readers stop treating it as the main guide. The entry changes no behavior. Note that `index.md` is no longer present at the packet root today, though no entry in this changelog records its deletion.

### 1.0.7.0 (2026-02-16, `v1.0.7.0.md`)

Readability and validation cleanup. Decorative symbols were stripped from headings and the heading style was normalized across SKILL.md, README.md, INSTALL-GUIDE.md, `examples/README.md` and `references/session-management.md` to match the current validation rules.

### 1.0.2.0 (2026-02-15, `v1.0.2.0.md`)

Retrieval and tone pass on the two readmes. Hidden section markers were added around the main sections of `README.md` and `examples/README.md` so memory and retrieval tools can target a section precisely, and both files were lightly rewritten for tone and consistency with the project writing rules.

### 1.0.1.0 (2026-01-14, `v1.0.1.0.md`)

BREAKING in the routing sense: the routing rules were changed so the lightweight bdg command-line path is now tried first by default and the fuller Code Mode MCP path became the fallback, reversing the previous balance for everyday browser work. The same release documented screenshot capture, network monitoring, console access, cookie handling and better terminal composability, and corrected broken documentation links and section pointers in `references/session-management.md` and `references/cdp-patterns.md`, with the troubleshooting reference expanded to cover the new actions.

### 1.0.0.0 (2025-12-27, `v1.0.0.0.md`)

First release. It shipped the two-path model, a lightweight command-line route for quick jobs and a fuller integration route for multi-tool work, so operators pick the simplest route per job instead of carrying the heavier setup every time. It bundled page control, clicks, screenshots, network checks, console viewing and storage access into one skill, and shipped SKILL.md, README.md, INSTALL-GUIDE.md plus the `session-management.md` and `cdp-patterns.md` references.

## Facts the v4 draft gets wrong or misses

- The draft never names `mcp-chrome-devtools` anywhere in its 463 lines. It calls the Chrome bridge only "the browser" (draft lines 36, 373 and 377) while naming the sibling `mcp-aside-devtools` explicitly at draft line 387. The Chrome bridge is the older and more documented of the two browser modes across all 7 entries from `v1.0.0.0.md` onward, so leaving it unnamed reads as if `mcp-aside-devtools` were the only browser bridge.
- The draft misses the CLI-first routing default. `v1.0.1.0.md` records that the bdg command-line path became the preferred route with the MCP path as fallback. Draft line 387 gives exactly that shape to `mcp-aside-devtools` ("from its command line, with a server fallback") but says nothing equivalent for the Chrome mode, so a reader would not learn that both browser bridges are CLI-first.
- The draft misses the dual Code Mode manual registration. `v1.0.10.0.md` records `chrome_devtools_1` and `chrome_devtools_2` registered in `.utcp_config.json` for parallel isolated browser instances, with a packet-local byte-true snapshot at `assets/utcp-chrome-devtools-manuals.md` and a verify-do-not-re-add contract. The draft discusses `.utcp_config.json` only for removals (draft lines 294 and 445) and never mentions this parallelism registration.
- The draft's "feature catalogs, install front doors and worked examples" credit at draft line 377 is correct for this mode but undated in the draft. `v1.0.10.0.md` shows the catalog, the `mcp-servers/` install pointers and the manuals snapshot arrived only at 1.0.10.0 on 2026-07-16, which is late in the release window and after the hub consolidation the draft describes in the same paragraph.
- Not wrong: the draft's "nine modes" count at draft lines 36 and 377 matches `mode-registry.json` at `.opencode/skills/mcp-tooling/`, which registers mcp-aside-devtools, mcp-chrome-devtools, mcp-click-up, mcp-figma, mcp-magicpath, mcp-mobbin, mcp-notion, mcp-obsidian and mcp-refero.
- Not wrong: the draft's path-move warning at draft line 403 is scoped to `mcp-figma` only. No entry in this changelog records a path move for this mode. Every Files Changed row from `v1.0.0.0.md` onward already reads `.opencode/skills/mcp-tooling/mcp-chrome-devtools/`, so this mode was born inside the hub and needs no repoint.
- Version drift worth flagging for the draft: `v1.0.11.0.md` aligned the README frontmatter to 1.0.11.0 but the SKILL.md frontmatter still reads 1.0.10.0, so the packet reports two different versions depending on which file you open.
- Naming drift worth flagging: `v1.0.10.0.md` names the 7 catalog domains in snake_case (cli_bdg_lifecycle and so on) but the directories on disk are kebab-case (`cli-bdg-lifecycle` and so on), presumably from the later repo-wide kebab migration. The 30-file count the entry claims is confirmed on disk.

## Current version and identity

The SKILL.md frontmatter at `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` reads `version: 1.0.10.0`. The README.md frontmatter reads `version: 1.0.11.0`, matching the newest changelog entry. The two disagree.

Identity: this is a MODE, not a hub and not standalone. There is no `mode-registry.json` at the skill root. The registry lives one level up at `.opencode/skills/mcp-tooling/mode-registry.json`, which carries `"workflowMode": "mcp-chrome-devtools"` with `packetKind: "workflow"` and `backendKind: "cli-plus-mcp"`. The parent also holds `graph-metadata.json`, `description.json` and `hub-router.json`, the hub-only metadata set, confirming `mcp-tooling` as the parent hub. The registry states every mcp-tooling mode has `routingClass: "metadata"`, so the advisor routes the single `mcp-tooling` identity and the hub picks this mode.
