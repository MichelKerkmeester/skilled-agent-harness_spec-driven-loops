DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration Prompt Pack

## State

Segment: 1 | Iteration: 2 of 2
Questions: 2/5 answered | Last focus: schema and release/install mechanics
Last 2 ratios: N/A -> 1.00 | Stuck count: 0
Resource map: absent; coverage gate skipped.
Memory context refresh: unavailable; use primary sources.
Stop policy: `max-iterations`; this is the required final evidence iteration. Convergence before it was telemetry only.
Next focus: Command behavior, deterministic file-layer workflows, and failure/recovery branches.

Research topic: Complete the source-verified knowledge base for `TfTHacker/obsidian42-brat` v2.2.0+ from the perspective of an AI operating an Obsidian vault at the file layer.

Focus area: Map every requested command and its effects: add beta plugin; add with frozen version/release-tag pin; check for updates; update a single plugin; restart; add theme; remove theme. Trace command registrations and modals into source behavior. Then derive safe file-layer workflows for (a) headless install + enable, (b) registering an already installed plugin in BRAT `data.json`, and (c) pinning a frozen version. Build a full failure catalog covering no releases, missing/renamed assets, plugin absent after reload, private repositories/tokens, incompatible `minAppVersion`, malformed manifests, and stale registration. Cross-check official `tfthacker.com/BRAT` pages.

Iteration 1 established:

- `pluginList`, `pluginSubListFrozenVersion`, and `themesList` are the collection keys.
- Version records use `repo`, `version`, optional token fields, and optional `isIncompatible`.
- Current plugin install is GitHub-release-asset-first and writes `main.js`, `manifest.json`, optional `styles.css` under `.obsidian/plugins/{manifest.id}`.
- `enableAfterInstall` uses Obsidian `enablePluginAndSave`; pinned entries are skipped by normal updates.
- Themes prefer `theme-beta.css`, write `theme.css` plus `manifest.json`, and track a CSS checksum.

Do not spend the iteration rediscovering those facts. Verify or refine them only where command/error behavior depends on them.

## State Files

- Config: `.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian42-brat/lineages/sol/deep-research-config.json`
- State log: `.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian42-brat/lineages/sol/deep-research-state.jsonl`
- Strategy: `.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian42-brat/lineages/sol/deep-research-strategy.md`
- Registry: `.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian42-brat/lineages/sol/findings-registry.json`
- Previous iteration: `.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian42-brat/lineages/sol/iterations/iteration-001.md`
- Write narrative: `.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian42-brat/lineages/sol/iterations/iteration-002.md`
- Write delta: `.opencode/specs/mcp-tooling/013-mcp-obsidian/009-community-plugin-support/research/obsidian42-brat/lineages/sol/deltas/iter-002.jsonl`

## Constraints

- Execute exactly one LEAF iteration. Do not dispatch sub-agents.
- Read config, state, strategy, registry, and iteration 1 before any research action.
- Use 3–5 focused research actions and stay within 12 tool calls.
- Write only `iteration-002.md`, append exactly one canonical iteration row to the state log, and create `deltas/iter-002.jsonl`. Do not edit reducer-owned files or any path outside this lineage.
- Every finding needs `[SOURCE: URL]`, `[SOURCE: path:line]`, or explicit `[INFERENCE: ...]`.
- Clearly label file-layer recommendations that BRAT itself does not perform headlessly. Separate three states: files installed, plugin enabled in `community-plugins.json`, and repo registered in BRAT `data.json`.
- Include negative knowledge and exact limitations for private repositories and version pins.
- The state and delta iteration record must include `type`, `iteration`, `run`, `mode`, `target_agent`, `agent_definition_loaded`, `resolved_route`, `newInfoRatio`, `noveltyJustification`, `status`, `focus`, `findingsCount`, `ruledOut`, `toolsUsed`, `sourcesQueried`, `timestamp`, and `durationMs`.
- Route proof must be exactly `Resolved route: mode=research target_agent=deep-research`.

## Required Output Coverage

The narrative must contain:

1. A command matrix covering all requested commands.
2. File-layer recipes with concrete JSON examples for registration and pinning.
3. A troubleshooting table spanning no releases, asset mismatch, reload/visibility, private repositories, and compatibility/manifest failures.
4. Remaining uncertainties, including anything that cannot be safely proven from current source/docs.

Produce and verify:

1. `iterations/iteration-002.md`
2. One appended canonical iteration record in `deep-research-state.jsonl`
3. `deltas/iter-002.jsonl`, beginning with the same iteration record
