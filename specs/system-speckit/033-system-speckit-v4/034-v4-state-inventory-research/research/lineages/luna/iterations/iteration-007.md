# Angle 7 — THE OTHER HUBS

## Focus

Inventory the remaining hubs and standalone skills: sk-code, sk-design, mcp-tooling, mcp-code-mode, sk-communication, sk-git, sk-prompt, and sk-vision. Compare the draft's claims about their topology, commands, and shipped surfaces against registries and live skill contracts.

## Actions Taken

- Opened the live mode registries and leaf manifests for the remaining hubs and standalone skills.
- Read the hub contracts and command routers for design, MCP tooling, communication, git, prompt, and vision surfaces.
- Compared the relevant draft sections covering design, code, prompt, MCP, communication, and upgrade notes.
- Did not read or modify any research lineage, build output, feature-catalog, manual-testing-playbook, or dependency-lock artifact.

## Findings

### INVENTORY

| surface | value | source |
|---|---|---|
| sk-code hub | Six modes: workflow `sk-code-quality`, `sk-code-review`; read-only surface `sk-code-webflow`, `sk-code-opencode`, `sk-code-mobile-cli`, `sk-code-obsidian`. Every mode is metadata-routed through the single hub identity; surface packets are bundled as evidence. | [SOURCE: `.opencode/skills/sk-code/mode-registry.json:3-7,30-44,92-110`] |
| sk-design hub | Four modes: fundamentals, md-generator, chart, diagram. The three command-bearing modes are `/design:extract`, `/design:chart`, and `/design:diagram`; fundamentals routes through aliases. | [SOURCE: `.opencode/skills/sk-design/SKILL.md:58-69`; `.opencode/commands/design/extract.md:7-12`; `.opencode/commands/design/diagram.md:7-13`; `.opencode/commands/design/chart.md:7-13`] |
| mcp-tooling hub | Nine modes: five workflow bridges (`mcp-chrome-devtools`, `mcp-click-up`, `mcp-obsidian`, `mcp-aside-devtools`, `mcp-notion`) and four read-only transports (`mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-magicpath`). The registry sets `command:null` for every mode; `/doctor:mcp` is the separate install/debug front door. | [SOURCE: `.opencode/skills/mcp-tooling/SKILL.md:15,25-33`; `.opencode/skills/mcp-tooling/mode-registry.json:11-15,31-37,134-141`] |
| mcp-code-mode standalone | One flat standalone skill, external shared MCP execution substrate rather than a mcp-tooling member. It exposes search/list/info and exact-name `call_tool_chain` execution with `{manual_name}.{manual_name}_{tool_name}` naming. | [SOURCE: `.opencode/skills/mcp-code-mode/SKILL.md:14-16,213-222,350-380`] |
| sk-communication standalone | One standalone projection skill with two lanes: projection is opt-in and advisor-excluded; the response and visual-explanation commands are in the `/rewrite` family. | [SOURCE: `.opencode/skills/sk-communication/SKILL.md:14-16,35-40,192-240`; `.opencode/commands/rewrite/response.md:98-113`; `.opencode/commands/rewrite/explain-visually.md:15-23`] |
| sk-git standalone | Single no-spec skill. It asks whether to use a worktree or current branch, allocates numbered `worktrees/{NNN}-{slug}` / `branches/{NNN}-{slug}` names, protects non-allowlisted pushes, and routes local GitKraken mutations back to Bash. | [SOURCE: `.opencode/skills/sk-git/SKILL.md:276-301,359-367`; `.opencode/skills/sk-git/leaf-manifest.json:2,73`] |
| sk-prompt standalone | One standalone mode with seven prompt frameworks, DEPTH processing, CLEAR scoring, and eight operating modes (interactive, text, short, improve, refine, JSON, YAML, raw). The live contract does not contain the draft's `prompt-models` mode. | [SOURCE: `.opencode/skills/sk-prompt/SKILL.md:3,12,25-38,292-319`; `.opencode/skills/sk-prompt/leaf-manifest.json:2,42`] |
| sk-vision standalone | One standalone vision mode with a locked 13-tool surface, JSON-RPC/Moondream lifecycle, host adapters, and a `/vision` command. | [SOURCE: `.opencode/skills/sk-vision/SKILL.md:162-221`; `.opencode/skills/sk-vision/leaf-manifest.json:2,24`] |
| mode/command topology | The actual design command family is `/design:*`, while communication uses `/rewrite:*`; no `/interface:*` family appears in the live command tree used for these surfaces. | [SOURCE: `.opencode/commands/design/extract.md:1-7`; `.opencode/commands/design/diagram.md:1-7`; `.opencode/commands/rewrite/response.md:98-113`] |
| hub-level contradictions | The mcp-tooling prose says “all eight modes” while its own live mode table lists nine modes including mcp-aside-devtools and mcp-notion. This is a README/SKILL-versus-registry count contradiction. | [SOURCE: `.opencode/skills/mcp-tooling/SKILL.md:25-33,78`; `.opencode/skills/mcp-tooling/mode-registry.json:31-37,134-141,352-358`] |

### DRIFT

| draft line | claim | verdict | actual state | severity | one-line correction | source |
|---:|---|---|---|:---:|---|---|
| 7 | Seven hubs share the same two-axis form and route correctly thirteen times out of thirteen. | STALE | sk-code is a two-axis hub, but sk-design is a four-mode hub, mcp-tooling has workflow/transport axes, and several remaining skills are standalone; the “seven hubs/two-axis” generalization is not the live topology. | P1 | Describe topology per hub and report registry-backed mode counts instead of one universal two-axis claim. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:7`; `.opencode/skills/sk-code/mode-registry.json:3-7`; `.opencode/skills/mcp-tooling/SKILL.md:15,25-33`] |
| 11 | `/interface:*` is a daily command family that behaves as before. | FALSE | Current design routers are `/design:extract`, `/design:diagram`, and `/design:chart`; the live command files do not establish an `/interface:*` family. | P0 | Replace `/interface:*` with the current `/design:*` commands and remove the claim that the old family remains alive. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:11`; `.opencode/commands/design/extract.md:1-7`; `.opencode/commands/design/diagram.md:1-7`] |
| 126 | A new `sk-create-diagram` packet is reachable through `/create:diagram`. | FALSE | Diagram creation belongs to the `sk-design-diagram` mode and `/design:diagram`; sk-doc's registry has no `sk-create-diagram` mode. | P0 | Move diagram ownership to `sk-design-diagram` and `/design:diagram`. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:126`; `.opencode/skills/sk-design/SKILL.md:58-69`; `.opencode/commands/design/diagram.md:1-13`] |
| 155 | `deep-alignment` is an active deep-loop mode. | FALSE | The live deep-loop registry contains research, review, ai-council, agent-improvement, model-benchmark, and skill-benchmark; no alignment mode was found in the registry. | P0 | Remove `deep-alignment` from shipped-mode claims unless a later registry adds it. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:155`; `.opencode/skills/system-deep-loop/mode-registry.json:19-117`] |
| 256 | The design surface has `/interface:*` commands and a fourteen-card manager shell. | FALSE | The live surface has four sk-design modes and `/design:*` routers; the draft's manager/card implementation is not represented by the live mode contract. | P0 | Rewrite the section around the four registered sk-design modes and their current routers. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:256-272`; `.opencode/skills/sk-design/SKILL.md:58-69`] |
| 278 | Open Design MCP is removed end to end. | TRUE | The current mcp-tooling inventory contains Figma, Refero, Mobbin, and MagicPath transports and no Open Design mode in the live hub table. | P2 | Keep the removal note, but cite the current transport roster rather than only the draft's historical wording. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:278`; `.opencode/skills/mcp-tooling/SKILL.md:25-33`] |
| 284-299 | sk-code becomes a hub with workflow modes and read-only surface packets; review is folded into the hub. | TRUE | The registry explicitly distinguishes two workflow modes and four read-only surface modes, with `sk-code-review` as a first-class workflow mode. | P2 | Retain the claim and add the two/four mode names from the registry. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:284-299`; `.opencode/skills/sk-code/mode-registry.json:30-44,92-110`] |
| 345 | sk-prompt has two modes, `prompt-improve` and `prompt-models`, with the old `/prompt` renamed to `/prompt-improve`. | FALSE | sk-prompt is a standalone one-mode skill with operating modes inside the skill; no `prompt-improve` or `prompt-models` registry modes were found. | P0 | Describe sk-prompt as one standalone skill with its eight operating modes and `/prompt-improve` only if a live command file proves that alias. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:345`; `.opencode/skills/sk-prompt/leaf-manifest.json:2,42`; `.opencode/skills/sk-prompt/SKILL.md:292-319`] |
| 351-361 | sk-prompt has six conformed per-model profiles under a `prompt-models` mode. | FALSE | The current standalone leaf manifest exposes only `sk-prompt`, and the SKILL.md framework matrix describes seven frameworks rather than a registered per-model mode. | P1 | Remove the `prompt-models` mode/profile count unless those files are restored and registered. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:351-361`; `.opencode/skills/sk-prompt/leaf-manifest.json:2,42`; `.opencode/skills/sk-prompt/SKILL.md:3,12`] |
| 367-395 | All MCP bridges are in one mcp-tooling hub, with mcp-figma nested under it. | TRUE | The hub's live table lists the workflow and transport modes, and the Figma packet is at `.opencode/skills/mcp-tooling/mcp-figma/`. | P2 | Retain the consolidation and path-move claims, while correcting the mode count and including Aside, Notion, and MagicPath. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:367-395`; `.opencode/skills/mcp-tooling/SKILL.md:25-33`] |
| 415-432 | sk-communication is a standalone, off-by-default, advisor-excluded projection layer. | TRUE | The live skill describes opt-in projection lanes and the standalone leaf manifest; `/rewrite:*` supplies the visible command family. | P2 | Retain the claim and name the `/rewrite:response` and `/rewrite:explain-visually` entry points. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:415-432`; `.opencode/skills/sk-communication/SKILL.md:14-16,192-240`] |
| 440-444 | Upgrade notes include prompt-model, prompt, diagram, and removed-surface renames. | STALE | Some removal/path notes are confirmed, but `prompt-models` and `/create:diagram` are not live surfaces; the current design family is `/design:*`. | P1 | Split the upgrade list into confirmed path changes and remove non-existent prompt/diagram surfaces. | [SOURCE: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md:440-444`; `.opencode/skills/sk-prompt/leaf-manifest.json:2,42`; `.opencode/commands/design/diagram.md:1-13`] |

DISAGREEMENTS: The mcp-tooling SKILL.md says “all eight modes” at line 78, while its live table and mode-registry enumerate nine modes; sk-design's live contract lists four modes, contradicting the draft's fourteen-card manager-shell description; sk-prompt's standalone leaf manifest contradicts the draft's two-mode `prompt-models` topology.

CONFIDENCE: Confirmed: all inventory rows whose cited SKILL.md, registry, manifest, or command file was opened in this iteration; confirmed draft verdicts use the opened changelog lines. Inferred: the absence of an `/interface:*` or `/create:diagram` command is based on the live command/registry surfaces inspected here, not a full historical search of every archived document.

## Questions Answered

- Which remaining surfaces are parent hubs? sk-code, sk-design, and mcp-tooling; mcp-code-mode, sk-communication, sk-git, sk-prompt, and sk-vision are standalone leaves.
- Does the draft's design command family still exist? No: the live design family is `/design:*`.
- Does the draft's `prompt-models` two-mode topology exist? No: the live skill is a standalone one-mode leaf with internal operating modes.
- Is Open Design still present in the MCP roster? No; the current roster has four other transports and five workflow bridges.

## Questions Remaining

- What mirror, hook, CI, and goal-resync contracts are actually shipped across runtimes?
- Which v3.6.0.0-to-v4 changes are confirmed by code versus only inferred from commit history?
- Which remaining changelog claims survive a full section-by-section reproduction pass?

## Next Focus

Iteration 8: RUNTIME MIRRORS, HOOKS, CI AND GOALS.

## Reflection

This angle materially reduces uncertainty because the draft's largest topology errors are not merely stale names: several claimed parent/mode boundaries do not exist in the live registries. The next pass should keep those distinctions explicit while checking whether the runtime mirrors and CI hooks preserve the claims that are true at the source-tree level.
