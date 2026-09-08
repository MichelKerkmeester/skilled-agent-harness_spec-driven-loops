# mcp-tooling changelog digest

Skill path: `.opencode/skills/mcp-tooling/`. Versions covered: v1.0.0.0 through v1.6.1.0 (all 9 entries in `changelog/`, fewer than 10 exist). Dates: only `v1.6.1.0.md` carries one, "Released: 2026-08-29". The other 8 entries carry no date field, so no range can be stated for them.

---

## Per version, newest first

### v1.6.1.0 (`v1.6.1.0.md`)

`mcp-magicpath` was declared to pair unconditionally with `sk-design` under the design agent persona, and the hub prose that assumed one shared design partner for all four transports was corrected. The attempt to populate `extensions.transport-axis.crossHubPairing` was reverted after the compiled-routing pre-push gate refused the push: `registry-compiler.cjs:249-255` resolves that object's values as skill ids against `judgmentRegistries`, and `sk-design` is a flat standalone skill with no `mode-registry.json`, so any value at all produced `compile-error` with a null policy hash. The field is now documented as deliberately inert rather than unfinished. The axis description was rewritten to say that `mcp-figma`, `mcp-refero` and `mcp-mobbin` hand off to `sk-design-md-generator` because they return visual material with no token vocabulary, while `mcp-magicpath` returns named CSS variables from `get_theme` and so pairs with `sk-design` instead. `README.md` claims that every design operation pairs with `sk-design-md-generator` were fixed, `SKILL.md`'s transport enumeration was corrected to include `mcp-magicpath` (stale since v1.6.0.0), the `.opencode/changelog/mcp-tooling/` aggregation directory gained the missing `mcp-magicpath`, `mcp-notion` and `mcp-obsidian` symlinks, and `leaf-manifest.json` was regenerated (fleet audit checked=14 passed=14 failed=0).

### v1.6.0.0 (`v1.6.0.0.md`)

The hub gained a ninth mode, `mcp-magicpath`, a read-only design transport for MagicPath component and design-system lookup. It is the first member reached over a UTCP `cli` manual rather than an MCP server, because MagicPath publishes no MCP server. A new `backendKind: "code-mode-cli"` was added to `mode-registry.json` (v1.0.2.0 to v1.1.0.0), `hub-router.json` went v1.1.4.0 to v1.2.0.0 with a `magicpath-aliases` vocabulary class, a weight-4 router signal and a tie-break entry, and `SKILL.md`, `README.md` and `description.json` went v1.5.2.0 to v1.6.0.0. Only the provider's read-only commands are registered, so `mutatesWorkspace: false` holds and the CLI's file-writing and project-creating half is unreachable from a tool call. The entry also carries a correction: the hub's feature catalog and manual-testing playbook claimed seven modes while eight existed, because `mcp-notion` had been added without updating them, and both now read nine. Holdout coverage is stated honestly as 7/9. Known gap recorded: hub-level routing resolves MagicPath phrasings correctly, but a cold MagicPath request that names neither hub nor mode has been observed returning no advisor recommendation at all. Operators must authenticate separately with `magicpath-ai login` or `MAGICPATH_TOKEN`.

### v1.5.2.0 (`v1.5.2.0.md`)

The hub's root `ROUTER.md` completed the two-state root-router contract by adding the two frontmatter fields it was missing, `router_state: active` and `skill_pointer: SKILL.md`. No prose or machine-block bytes moved, and the `INTENT_SIGNALS` and `RESOURCE_MAP` fence keeps sha256 `8477b664...`, so replay and benchmark behavior is unchanged. `SKILL.md`, `README.md` and `description.json` took version-alignment-only bumps to v1.5.2.0, and `hub-router.json` v1.1.4.0 was untouched.

### v1.5.0.0 (`v1.5.0.0.md`)

The hub `README.md` was rewritten from a tabular reference card into the purpose-first standalone template shape, with a one-line pitch, a problem-first overview, an at-a-glance table first and numbered all-caps sections. Every factual claim about the then seven registered modes survived the rewrite, and each mode row gained a link to its own packet README. The README frontmatter version jumped from 1.0.0.0 to 1.5.0.0 so it finally agreed with a changelog history that had already reached v1.4.2.0. No migration required.

### v1.4.2.0 (`v1.4.2.0.md`)

REMOVED: the `mcp-webflow` transport mode was stripped from every hub surface after the operator deleted its packet, so Webflow is no longer a routable mode. `hub-router.json` (v1.1.2.0) lost the `mcp-webflow` tie-break slot, its router signal and the `webflow-aliases` and `webflow-operations` vocabulary classes. `mode-registry.json` (v1.0.2.0) lost the mode entry (backendKind `code-mode-stdio-mcp`, Webflow token wiring, conditional `sk-design` pairing) plus its `transport-axis` transports and `crossHubPairing` references. `description.json` (v1.4.2.0), `SKILL.md` (v1.3.2.0), `shared/references/smart-routing.md` and `leaf-manifest.json` all dropped Webflow, leaving a seven-mode surface router, and the `benchmark/reports/2026-08-02--webflow-registration--routing-replay/` report was deleted. Four committed merge-conflict blocks in `README.md` were also resolved.

### v1.3.0.0 (`v1.3.0.0.md`)

The hub gained its third design transport, `mcp-mobbin`, a read-only bridge to Mobbin's real-app mobile UX patterns (screens, flows, elements) over a remote MCP server reached through Code Mode. The 31-file packet came from a converged 10-iteration deep-research fan-out across 3 lineages, with `packetKind: "transport"`, `backendKind: "code-mode-remote-mcp"`, `mutatesWorkspace: false` and Write, Edit and Task forbidden. It was the sixth `modes[]` entry. The entry keeps its epistemics honest: OAuth, DCR and PKCE are documented as mechanism because no API key env var exists, and the callable name was inferred pending live discovery. `.utcp_config.json` gained a `mobbin` manual registered as stdio `npx -y mcp-remote https://api.mobbin.com/mcp` with empty env, OAuth flowing through the mcp-remote browser round trip on first use. A routing scenario at `manual-testing-playbook/hub-routing/mobbin-app-research.md` guards the Mobbin versus Refero boundary.

### v1.2.0.0 (`v1.2.0.0.md`)

The hub gained its second design transport, `mcp-refero`, a read-only bridge to Refero's 8 read-only tools over real-app screens, flows and styles. The 29-file packet came from a converged 10-iteration deep-research fan-out across 3 lineages, all first-attempt, and introduced `backendKind: "code-mode-remote-mcp"` as the fifth `modes[]` entry with `mutatesWorkspace: false` and Write, Edit and Task forbidden. The `transport-axis` extension then declared two transports, both with `crossHubPairing` to `sk-design`. Plan gating is carried honestly (Pro allows 8,000 calls per month, Free has no MCP) alongside an OAuth-inferred posture and a mandatory post-registration `tool_info` confirmation of the doubled-prefix callable. `.utcp_config.json` was unchanged because the `refero` manual was already registered, verified byte-identical by the packet's asset snapshot.

### v1.1.0.0 (`v1.1.0.0.md`)

The hub gained a third workflow mode, `mcp-aside-devtools`, bringing agentic AI-browser automation over the Aside browser: natural-language `aside` CLI tasks, deterministic `aside repl` evidence capture and `aside mcp` as a Code Mode fallback. The 41-file packet came from a converged 10-iteration deep-research fan-out across 3 lineages, with `packetKind: "workflow"`, `backendKind: "cli-plus-mcp"` and `mutatesWorkspace: true`. Its MCP inventory is documented as version-pinned (one `repl` tool at CLI 1.26.626.1517, protocol 2024-11-05) with runtime rediscovery mandated. `hub-router.json` gained a weight-4 signal and a tie-break slot after `mcp-click-up` and before the transport, and `.utcp_config.json` registered an `aside` manual as stdio `aside mcp` with credential-free empty env. The dual-manual layout stayed an open question gated on an isolation test.

### v1.0.0.0 (`v1.0.0.0.md`)

RENAME: `mcp-tooling` became a parent hub and three flat, independently advisor-routable skills folded into one advisor identity. MOVED PATH: `mcp-chrome-devtools/*` (41 files), `mcp-click-up/*` (155 files) and `mcp-figma/*` (40 files) were `git mv`d from their flat `.opencode/skills/mcp-<x>/` locations to `.opencode/skills/mcp-tooling/mcp-<x>/` with full history preserved, and each packet's internal absolute and relative self-references were rewritten for the new nesting depth. BREAKING: the three packets' own `graph-metadata.json` files were deleted, so their independent advisor identities dissolved into the hub's single `skill_id: mcp-tooling` identity, and reverse graph edges in `mcp-code-mode/graph-metadata.json` and `sk-design/graph-metadata.json` plus 3 advisor corpus rows in `labeled-prompts.jsonl` were repointed from the three bridge ids to `mcp-tooling`. The scaffold shipped `mode-registry.json`, `hub-router.json`, `description.json`, `graph-metadata.json` and `SKILL.md` with three modes (two `packetKind: "workflow"` bridges at `mutatesWorkspace:true` and one `packetKind: "transport"` figma bridge at `mutatesWorkspace:false`), `routerPolicy.defaultMode: "mcp-chrome-devtools"` and three router outcomes (`single`, `orderedBundle`, `defer`). The doctor install front door `.opencode/commands/doctor/assets/doctor-mcp-install.yaml` was repointed to the nested paths, and its pre-existing stale `mcp-open-design` entry was corrected to `sk-design/design-mcp-open-design`. Excluded by design (ADR-005): `mcp-code-mode` stays flat standalone infrastructure and is never a hub member.

---

## Facts the v4 draft gets wrong or misses

- MISSES the `mcp-webflow` removal entirely. `v1.4.2.0.md` records that the operator deleted the `mcp-webflow` packet and that the hub stripped it from `hub-router.json`, `mode-registry.json`, `description.json`, `SKILL.md`, `shared/references/smart-routing.md` and `leaf-manifest.json`, plus a deleted benchmark report. The draft never names it, and line 445 ("Drop removed surfaces") lists `open_design`, `cli-gemini`, `cli-copilot`, `pi-subagents`, `deep-alignment` and `sk-prompt-models` but not the Webflow transport. Note that the draft's `sk-code-webflow` mentions at lines 307 and elsewhere are a different, unrelated surface packet.
- WRONG at draft line 391: "The design transports defer to the design-judgment skill for taste." This is the exact one-partner-for-all claim that `v1.6.1.0.md` was written to correct. Per that entry, `mcp-figma`, `mcp-refero` and `mcp-mobbin` hand off to `sk-design-md-generator`, while `mcp-magicpath` pairs unconditionally with `sk-design` because `get_theme` already returns named CSS variables and fonts with nothing to re-measure. `sk-design-md-generator` applies to `mcp-magicpath` only when the reference is an external live site.
- INCOMPLETE at draft lines 401 to 403 and 444. The draft frames the fold-in as a single figma path move ("The one change here you may need to act on is a path move"). `v1.0.0.0.md` records three simultaneous moves: `mcp-chrome-devtools` (41 files) and `mcp-click-up` (155 files) moved out of their flat `.opencode/skills/` paths in the same change as `mcp-figma` (40 files). A reader with scripts pinned to the two flat non-figma paths is not told to repoint.
- MISSES the advisor-identity dissolution recorded in `v1.0.0.0.md`. The three former bridges lost their own `graph-metadata.json` files, so `mcp-chrome-devtools`, `mcp-click-up` and `mcp-figma` are no longer independently advisor-routable identities. The draft describes the hub only as a routing convenience and never says the old identities stopped existing.
- OVERCLAIMS at draft line 377: "The router underneath does what its name promises, backed by a hard gate that refuses to ship if any packet routes wrong." Both `v1.6.0.0.md` and `v1.6.1.0.md` record an unresolved known gap: hub-level replay resolves MagicPath phrasings correctly, but a cold MagicPath request naming neither hub nor mode has been observed returning no advisor recommendation at all, and adding trigger phrases did not change it. `v1.6.1.0.md` further records that nothing enforces any transport pairing mechanically, since the declarations are prompt-time discipline with no gate or validator observing them.
- MISSES the operator action for `mcp-magicpath` recorded in `v1.6.0.0.md`. The draft names the mode at line 389 but not that it requires separate authentication (`magicpath-ai login` or `MAGICPATH_TOKEN` wired as `magicpath_MAGICPATH_TOKEN`), without which every tool returns a structured `NOT_AUTHENTICATED` object.
- MISSES the `.utcp_config.json` registrations that came with the new modes. `v1.1.0.0.md` registers an `aside` manual and `v1.3.0.0.md` registers a `mobbin` manual (`npx -y mcp-remote https://api.mobbin.com/mcp`, OAuth on first use through the mcp-remote browser round trip). The draft tells readers to remove `open_design` from `.utcp_config.json` at line 445 but never mentions what was added there.
- The nine-mode count at draft lines 36 and 377 is CORRECT and matches `mode-registry.json`, and the figma path move text at line 403 is accurate as far as it goes.

---

## Current version and identity

- Version in `SKILL.md` frontmatter: `1.6.1.0` (matches the newest changelog entry).
- Identity: HUB. `mode-registry.json`, `hub-router.json`, `description.json` and `graph-metadata.json` all sit at the skill root `.opencode/skills/mcp-tooling/`, which is the hub-only metadata set. It is not a mode of any parent.
- Modes in `mode-registry.json` (9, in registry order):
  1. `mcp-chrome-devtools` (packetKind `workflow`)
  2. `mcp-click-up` (workflow)
  3. `mcp-aside-devtools` (workflow)
  4. `mcp-figma` (transport)
  5. `mcp-refero` (transport)
  6. `mcp-mobbin` (transport)
  7. `mcp-obsidian` (workflow)
  8. `mcp-notion` (workflow)
  9. `mcp-magicpath` (transport)
- `mode-registry.json` itself carries `"version": "1.2.0.0"`, and every mode uses `advisorRouting.routingClass: "metadata"`, meaning modes are resolved by hub membership rather than by their own advisor entries.
