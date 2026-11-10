# mcp-magicpath changelog digest

Skill path: `.opencode/skills/mcp-tooling/mcp-magicpath/`. Versions covered: v1.0.0.0 through v1.1.0.0 (only two entries exist, so all of them are covered). Date range: 2026-08-29 to 2026-08-29, both entries carrying the same release date.

---

## Per version, newest first

### v1.1.0.0 - Design Authority Binding (`changelog/v1.1.0.0.md`)

This release bound the transport to a design-judgment owner. `sk-design` now loads unconditionally at STEP 0 of phase detection, before intent scoring and before the first tool call, with no keyword gate and no confidence threshold, and the packet operates under the design agent persona resolved from the active runtime's agent directory (`.opencode/agents/design.md`, `.claude/agents/design.md`, and the sibling runtime paths). A new ALWAYS rule states that loading means reading, a new ALWAYS row entered the Resource Loading Levels table, and `references/design-authority.md` was created as the contract. The persona's write authority is explicitly not inherited: `mutatesWorkspace: false` holds and Write, Edit and Task stay forbidden. The entry records why this transport pairs with `sk-design` rather than with `sk-design-md-generator` like its three sibling design transports (`mcp-figma`, `mcp-refero`, `mcp-mobbin`): `get_theme` already returns authored named CSS variables and fonts, so there is nothing to re-measure and what the surface lacks is the decide half. On the hub side, the `transport-axis` description now names the judgment owner per transport instead of asserting one pairing for all four, `crossHubPairing` stays empty because the compiled-routing pre-push gate refused an entry, and `.opencode/changelog/mcp-tooling/mcp-magicpath` was symlinked to this packet's `changelog/` directory alongside `mcp-notion` and `mcp-obsidian`. The entry states no breaking change to the tool surface: no tool was added, removed or renamed, and the fourteen registered callables are identical. Known limitations recorded: nothing enforces the pairing mechanically, the pairing is prose-only, the persona write exclusion is documented rather than enforced, and the two runtime variants of the design agent are not byte-identical.

### v1.0.0.0 - First Release (`changelog/v1.0.0.0.md`)

The initial release delivered `mcp-magicpath` as the read-only MagicPath transport in the `mcp-tooling` hub, with `packetKind: transport` and `mutatesWorkspace: false`. It documented fourteen read-only tools across six themes: session (`info`, `whoami`), components (`search_components`, `inspect_component`, `list_components`), projects (`list_projects`, `active_project`, `share_link`), teams (`list_teams`, `list_members`), themes (`list_themes`, `get_theme`), and local and canvas (`list_installed`, `selection`). MagicPath ships no MCP server, so the bridge is the `magicpath-ai` Node CLI at installed version 2.6.1, reached through Code Mode's UTCP `cli` transport: the manual command runs `node .opencode/bin/magicpath-utcp-manual.cjs` and tool calls run through `node .opencode/bin/magicpath-utcp-exec.cjs`. The callable form is `magicpath.<tool>(...)`, from the `{manual}.{tool}` rule applied once because the tool names carry no prefix of their own. Hard constraints were recorded: every tool is read-only, `limit` is declared as a string rather than a number, `list_components` paginates by cursor (`after`) rather than by page number, `share_link` takes a component generated name or a numeric project id in one `identifier`, and `info` is the only tool that answers without a credential. The calling convention is synchronous inside `call_tool_chain` with no `await`, plain JavaScript only, and errors returned as ordinary values rather than thrown. Credentials come from `magicpath-ai login` or the `MAGICPATH_TOKEN` environment variable wired as `magicpath_MAGICPATH_TOKEN` in `.env`. The release shipped `feature-catalog/` with a root inventory, six domain overviews and one leaf per tool, three references (`tool-surface.md`, `credential-setup.md`, `mutation-boundary.md`), `assets/utcp-magicpath-manual.md`, and a `README.md`.

BREAKING: none. Neither entry records a breaking change, and `changelog/v1.1.0.0.md` states the compatibility case explicitly.

RENAME: none recorded in either entry.

REMOVED: none of the fourteen tools. `changelog/v1.0.0.0.md` does record a deliberate exclusion rather than a removal: the CLI write commands (`add`, `code`, `image`, `create-project`, `clone`) are never registered, so an agent cannot reach them through a tool call.

Changed default worth flagging: `changelog/v1.1.0.0.md` makes `sk-design` loading unconditional where it previously was not loaded at all, which changes the default behavior of every invocation without changing any call signature.

---

## Facts the v4 draft gets wrong or misses

- Draft line 391 says the design transports defer to the design-judgment skill for taste, as one blanket statement for all of them. `changelog/v1.1.0.0.md` records that the pairing is not uniform: `mcp-figma`, `mcp-refero` and `mcp-mobbin` pair with `sk-design-md-generator`, while `mcp-magicpath` deliberately pairs with `sk-design` because `get_theme` already returns authored tokens and there is nothing to re-measure. The entry states this divergence is recorded on purpose so it does not read as an oversight, and the draft flattens it back out.
- Draft line 391 also reads as if the deferral is a property of the system. `changelog/v1.1.0.0.md` records under Known Limitations that nothing enforces the pairing mechanically: it is prompt-time discipline with no gate, hook or validator observing whether `sk-design` was read, and `crossHubPairing` stays empty because `registry-compiler.cjs:249-255` cannot resolve `sk-design` as a skill id.
- Draft line 389 describes `mcp-magicpath` only as component and design-system lookup over a `cli` manual. It omits the fact `changelog/v1.0.0.0.md` treats as the packet's core safety property: the registered surface is read-only on purpose, fourteen tools that only read, with the CLI's write commands deliberately unregistered. For a release whose stated theme is safer paths, this is the most relevant missing fact about this transport.
- Draft line 389 omits the two operational preconditions in `changelog/v1.0.0.0.md`: the `magicpath-ai` Node CLI at installed version 2.6.1 must be on PATH, and a credential is required for thirteen of the fourteen tools, with `info` the only one that answers without one. A reader following the draft alone would not know a login step exists.
- The draft does not mention the changelog aggregation change in `changelog/v1.1.0.0.md`: `.opencode/changelog/mcp-tooling/mcp-magicpath` was symlinked to the packet's `changelog/` directory, with `mcp-notion` and `mcp-obsidian` linked at the same time so all ten entries resolve. This is a path change readers of the aggregated changelog directory may need.
- Nothing in the entries contradicts the draft's mode count. The parent `mode-registry.json` lists nine modes, matching draft lines 36 and 377, and four of them carry `packetKind: transport` (`mcp-figma`, `mcp-refero`, `mcp-mobbin`, `mcp-magicpath`), matching the Four Transports heading at draft line 381.

---

## Current version and identity

The version in `SKILL.md` frontmatter is `1.1.0.0`, matching the newest changelog entry. `mcp-magicpath` is a **mode**, not a hub and not standalone. There is no `mode-registry.json` at `.opencode/skills/mcp-tooling/mcp-magicpath/` (the folder holds only `README.md`, `SKILL.md`, `assets`, `changelog`, `feature-catalog` and `references`), while the parent `.opencode/skills/mcp-tooling/mode-registry.json` lists it as `workflowMode: mcp-magicpath` with `packetKind: transport` and `backendKind: code-mode-cli`. The parent also carries `description.json`, `graph-metadata.json` and `hub-router.json`, which is the hub-only set, so the hub is `mcp-tooling` and this packet routes by hub membership.
