# mcp-figma changelog digest

Skill path: `.opencode/skills/mcp-tooling/mcp-figma/`. Versions covered: v1.0.0.0 through v1.1.0.0 (all 3 entries in `changelog/`, fewer than 10 exist). Date range: 2026-06-15 to 2026-08-04.

---

## Per version, newest first

### v1.1.0.0 (2026-08-04)

`v1.1.0.0.md` records a documentation-only release that rewrites `README.md` from a tabular reference card into the purpose-first fleet narrative proven by the mcp-obsidian pilot. The new shape is a one-line pitch after the title, an AT A GLANCE table, a problem-first OVERVIEW and a capability table called The Figma Document Layer that names frames and components, tokens and variables, read-only exports and the design context pulled through the optional MCP. The entry states that every fact from the old README survives, including the `figma-cli` naming trap, the safe and yolo connect modes, the daemon model, the read-only and mutating and destructive gating taxonomy and the optional Framelink MCP wiring. The frontmatter description and trigger phrases are preserved. The README version field moves from `1.0.0.2` to `1.1.0.0` and the document passes `validate_document.py --type readme` with zero issues. The entry explicitly says no CLI, daemon, gating, MCP wiring or skill behavior changed.

### v1.0.1.0 (2026-07-16)

`v1.0.1.0.md` adds a new `examples/` directory, bringing the skill to examples parity with the sibling packets `mcp-chrome-devtools` and `mcp-click-up`. The set is deliberately safe: no destructive verb, no yolo patch and no `init-agent` anywhere in it. Four files land. `examples/README.md` gives the directory overview, the safety properties of binary discipline and gating fidelity and command provenance, prerequisites, per-walkthrough usage and exit codes, troubleshooting and see-also links. `examples/safe-connect-daemon-health.sh` walks binary detection with the naming-trap refusal, then `connect --safe` over the plugin bridge with no patch, then read-only `daemon status` and `daemon diagnose`, mirroring playbook scenarios DETECT-001, CONNECT-001 and DAEMON-001, and it never prints the daemon token. `examples/inspect-export-readonly.sh` covers read-only `node tree` and `find` plus `export screenshot -f svg -o <path>` to an explicit non-existing output path with an overwrite refusal, mirroring INSPECT-001 and EXPORT-001. `examples/optional-mcp-context.md` is a discovery-first walkthrough for the opt-in Framelink `figma` MCP through Code Mode, requiring `list_tools` and `tool_info` before any call and the prefixed `figma_FIGMA_API_KEY`. `SKILL.md` is updated to version 1.0.1.0 with Section 8 linking the examples directory. The entry says no CLI, daemon, gating or MCP wiring behavior changed.

### v1.0.0.0 (2026-06-15)

`v1.0.0.0.md` is the first stable release, promoting the skill to the 1.0.0.0 line. The skill teaches an agent to drive Figma Desktop from the terminal through the silships figma-cli published to npm as `figma-ds-cli`, with an optional Figma MCP through this project's Code Mode. The CLI is the primary surface for inspect, export, render, tokens, variables, components and design-system extract or import. The MCP is opt-in and used only to pull Figma design data in for codegen. The spine is the read-only, mutating and destructive gating taxonomy plus the `sk-design-interface` handoff. New in this release: an embedded CLI install scaffold at `mcp-servers/figma-cli/` whose `setup.sh` delegates to the canonical `scripts/install.sh`, plus `mcp-servers/figma-mcp/` as a pointer to the optional Framelink `figma` Code Mode MCP that vendors nothing because the manual is already registered in the repo `.utcp_config.json`. Live verification ran against `figma-ds-cli` 1.2.0, the full silships repo build exposing safe connect, the local daemon, design-system extract and the complete command surface. The entry also records install and doctor parity with `mcp-open-design`, `mcp-chrome-devtools`, `mcp-click-up` and `mcp-code-mode`, and a house-voice conformance pass across SKILL.md, the references, the install guide, the feature catalog and the manual testing playbook. Carried-forward surface includes the four references (`figma-cli-reference.md`, `tool-surface.md`, `mcp-wiring.md`, `troubleshooting.md`) and nine scripts (`install.sh`, `doctor.sh`, `connect-safe.sh`, `connect-yolo.sh`, `daemon.sh`, `unpatch.sh`, `print-utcp-snippets.sh`, `_common.sh`).

Flagged items across the three entries:

- BREAKING trap recorded in `v1.0.0.0.md`: the npm package literally named `figma-cli` is an unrelated tool (unic/figma-cli, binary `figma`), so `npm i -g figma-cli` installs the wrong thing. The canonical package is `figma-ds-cli`.
- BREAKING capability gap recorded in `v1.0.0.0.md`: npm publishes only `figma-ds-cli@1.0.0`, a minimal build with no `--safe`, no `daemon` and no `extract`. The documented surface needs 1.2.0 from the silships repo.
- No RENAME and no REMOVED item appears in any of the three entries. No changed default appears either: safe connect is the default from v1.0.0.0 onward and neither later entry moves it.

---

## Facts the v4 draft gets wrong or misses

Draft read: `specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md`, 463 lines.

- Missed, not wrong. Draft line 401 ("Figma Moves Into the Hub") says "The one change here you may need to act on is a path move, not a removal" and "Nothing about how Figma work runs has changed." That is true of the hub move itself, but `v1.0.0.0.md` and `v1.0.1.0.md` land real surface additions inside the v4 window that the draft never mentions: the embedded install scaffold at `mcp-servers/figma-cli/` and `mcp-servers/figma-mcp/`, and the four-file `examples/` directory. A reader of the draft alone would not know the skill gained an install front door or worked examples.
- Missed. The draft never mentions the `figma-ds-cli` naming trap or the 1.2.0-from-repo requirement, both flagged as central in `v1.0.0.0.md`. Draft line 444 tells readers to repoint the `mcp-figma` path but gives no hint that a fresh install from npm gets either the wrong package or a minimal build lacking safe connect, the daemon and extract.
- Missed. `v1.1.0.0.md` is a README rewrite onto the fleet narrative standard, part of the same documentation-quality program the draft covers elsewhere. The draft's Figma section does not record it.
- Verified correct, no correction needed. Draft lines 36 and 377 both say the hub has nine modes. `mode-registry.json` lists exactly nine: mcp-chrome-devtools, mcp-click-up, mcp-aside-devtools, mcp-figma, mcp-refero, mcp-mobbin, mcp-obsidian, mcp-notion and mcp-magicpath.
- Verified correct, no correction needed. Draft line 294 says "Figma and the terminal remain your design transports" after the Open Design removal. Nothing in the three changelog entries contradicts that, and the registry still carries `mcp-figma` with `packetKind: transport`.
- No factual error found in the draft that the changelog entries contradict. The gaps above are omissions, not misstatements.

---

## Current version and identity

- `SKILL.md` frontmatter version: **1.0.1.0**.
- `README.md` frontmatter version: **1.1.0.0**.
- Newest changelog entry: **v1.1.0.0**.
- Version drift found. `v1.1.0.0.md` bumped only the README version field (from `1.0.0.2` to `1.1.0.0`) and left `SKILL.md` at `1.0.1.0`, the value set by `v1.0.1.0.md`. The skill root therefore reports two different versions depending on which file you read.
- Identity: **a mode**, not a hub and not standalone. `mcp-figma` has no `mode-registry.json` at its own root (root holds only INSTALL-GUIDE.md, README.md, SKILL.md, assets, changelog, examples, feature-catalog, manual-testing-playbook, mcp-servers, references and scripts). Its parent `.opencode/skills/mcp-tooling/` holds `mode-registry.json`, `hub-router.json`, `graph-metadata.json` and `description.json`, the hub-only set. The registry entry classifies `mcp-figma` with `packetKind: transport`, `backendKind: figma-desktop-transport` and `routingClass: metadata`, meaning it carries no advisor entry of its own and is reached only through the `mcp-tooling` hub.
