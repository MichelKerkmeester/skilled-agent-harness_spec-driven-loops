### .skilled/skills/cli-classifier/README.md

- [P2] .skilled/skills/cli-classifier/README.md:13 | 3 | The lead is five sentences across the tagline and paragraph, and restates the hub’s purpose instead of hooking the reader. | Replace lines 13–15 with: `Open this README when you need to prepare Jev or see which mode the hub routes a classifier request to.`
- [P2] .skilled/skills/cli-classifier/README.md:30 | 4 | The Overview gives Purpose and Why It Matters, but its When to Use content appears earlier in At a Glance. | Rename `### What It Does` to `### Purpose`, then move the existing “Use it for” content into a `### When to Use` subsection immediately after the Purpose text.
- [P2] .skilled/skills/cli-classifier/README.md:66 | 7 | This paragraph combines the auth gate, independent feature calls, measurement result, measured questions and gate module. | Replace it with a short lead and bullets for those claims: Jev auth passes; each feature can ask Jev independently; each uses its measured question, which beat the best model-free rule; `jev-features.mjs` decides whether it runs.
- [P2] .skilled/skills/cli-classifier/README.md:94 | 9 | The body includes the status token `router_state: active`. | Remove `, \`router_state: active\`` from the Router row.
- [P2] .skilled/skills/cli-classifier/README.md:104 | 9 | The sentence about releases before the `cli-jev` mode is migration history in a current-state README. | Move the historical sentence to the changelog entry that records that transition.

### .skilled/skills/cli-classifier/ROUTER.md

- [P2] .skilled/skills/cli-classifier/ROUTER.md:18 | 3 | The four-sentence lead repeats the Overview’s purpose and routing details instead of serving as a short hook. | Replace lines 18–22 with: `A request’s judgment intent determines which packet-local leaves load.`
- [P2] .skilled/skills/cli-classifier/ROUTER.md:26 | 4 | The Overview states the router’s purpose and no-match behavior, but not when to use it. | Add after line 28: `Use this router after the hub selects a mode, when a request needs its packet-local resources resolved.`
- [P2] .skilled/skills/cli-classifier/ROUTER.md:42 | 5 | The dominant-intent, near-tie and fallback decisions follow the intent list they govern. | Move line 42 to after line 36 and before the first intent bullet.
- [P2] .skilled/skills/cli-classifier/ROUTER.md:48 | 7 | This paragraph packs the model projection, replay lookup, map-sync instruction and path-validation contract together. | Split it into bullets covering those four mechanisms, preserving each claim.
- [P2] .skilled/skills/cli-classifier/ROUTER.md:110 | 9 | “Moved here from `SKILL.md`” is authoring history in the document body. | Move that provenance to the changelog, then describe the current routing directive and section 3’s role as the only replay source.
- [P2] .skilled/skills/cli-classifier/ROUTER.md:120 | 9 | The body includes the status token `router_state: active`. | Remove `, which ships \`router_state: active\``.

### .skilled/skills/cli-classifier/SKILL.md

- [P2] .skilled/skills/cli-classifier/SKILL.md:12 | 3 | The four-sentence lead restates the skill’s purpose and routing details instead of acting as a hook. | Replace it with: `The hub keeps backend choice explicit and sends unclear classifier requests to disambiguation.`
- [P2] .skilled/skills/cli-classifier/SKILL.md:99 | 9 | The body includes the status token `router_state: active`. | Remove `, \`router_state: active\`` from the Router bullet.
- [P2] .skilled/skills/cli-classifier/SKILL.md:158 | 2 | The validator reports an unnumbered H2 among numbered peers. | Replace `## RELATED RESOURCES` with `## 6. RELATED RESOURCES`.

### .skilled/skills/cli-classifier/shared/README.md

- [P2] .skilled/skills/cli-classifier/shared/README.md:14 | 4 | The Overview describes the folder’s purpose but does not say when to use it. | Add after the purpose paragraph: `Use this folder when a packet needs shared transport, feature-gate or scorer-report helpers.`
- [P2] .skilled/skills/cli-classifier/shared/README.md:17 | 7 | One paragraph packs the responsibilities of three helpers, their behavior and their callers. | Split the three helper descriptions into one bullet per module, then keep the caller list as a separate sentence.
- [P2] .skilled/skills/cli-classifier/shared/README.md:43 | 1 | The code-folder template calls for Related links when nearby docs exist; this README has no related section. | Add a final `### Related` block under the existing H2 with links to `../README.md` and `./scripts/README.md`; keep the frozen H2 sequence unchanged.

### .skilled/skills/cli-classifier/shared/scripts/README.md

- [P2] .skilled/skills/cli-classifier/shared/scripts/README.md:15 | 1 | The Overview has four paragraphs, beyond the code-folder template’s one-to-two-paragraph shape. | Keep a short purpose-and-usage overview and move the module-specific details into itemized entries under Contents, preserving every claim.
- [P2] .skilled/skills/cli-classifier/shared/scripts/README.md:17 | 4 | The Overview explains responsibilities and behavior but does not say when to use this folder. | Add a sentence such as: `Use this folder when you need to inspect or change the shared Jev transport, feature gate or scorer-report helpers.`
- [P2] .skilled/skills/cli-classifier/shared/scripts/README.md:17 | 7 | The overview paragraphs pack transport routes, gate behavior, scoring mechanisms and credential-loading details together. | Move those details into itemized module entries under Contents, splitting each module’s mechanisms into bullets while keeping the table as a table.
- [P2] .skilled/skills/cli-classifier/shared/scripts/README.md:27 | 1 | The directory has a `tests/` subdirectory, so its code-folder README requires a directory tree; the Contents table does not show the full tree. | Add a fenced tree listing `README.md`, the three `.mjs` files, `tests/README.md` and the three test modules.
