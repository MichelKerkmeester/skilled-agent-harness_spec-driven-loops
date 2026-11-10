### .skilled/skills/mcp-tooling/mcp-refero/README.md

- [P2] .skilled/skills/mcp-tooling/mcp-refero/README.md:36 | 7 | The paragraph packs four independent failure mechanisms (doubled names, plan gate, 401, stale surface) into one block, so the risk list cannot be scanned. | Replace line 36 with:
  ```markdown
  - **Doubled callable names.** The callable names double their prefix inside Code Mode (`refero.refero_refero_<tool>`). Two independent research lineages got that detail wrong by derivation. Only live evidence settled it, so discovery confirmation is mandatory.
  - **Plan gating.** Access is plan-gated. The Free tier has no MCP at all.
  - **Authentication.** Unauthenticated calls return HTTP 401, so an agent that guesses burns a round trip and then misreports the failure.
  - **Stale surfaces.** Stale extractions of an older tool surface still circulate: four-tool lists, `_tool` names, numeric screen IDs and `limit`/`offset` paging. Calling them fails.
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-refero/README.md:112 | 7 | The paragraph packs the naming derivation, the live evidence, the operating rule and the synchronous-call rule into one run of prose. | Replace line 112 with:
  ```markdown
  Code Mode names calls `{manual}.{manual}_{tool}`. Every Refero tool is already named `refero_*`, so the callable form doubles the prefix: `refero.refero_refero_search_styles(...)`.

  - **Evidence.** Live discovery on 2026-07-16 (`references/discovery-fixture-2026-07-16.json`) settled the naming conflict in the research record. All eight tools list pre-auth under the dotted doubled registry names `refero.refero.refero_<tool>`, and the fixture's `Access as:` line confirms the doubled TypeScript callable.
  - **Rule.** The rule stays discovery-first: re-confirm the exact callable with `tool_info` per session and fail closed on drift.
  - **Call style.** Calls run synchronously inside the `call_tool_chain` body, with no top-level `await`.
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-refero/README.md:136 | 9 | `mcp-mobbin` ships in this same hub (v1.1.6.0, with its own SKILL, ROUTER and catalogs), so the forward-looking "planned future sibling" status is stale and reads as unavailable. | Replace `(\`mcp-mobbin\`, a planned future sibling)` with `(\`mcp-mobbin\`, the sibling Mobbin transport)`.
- [P2] .skilled/skills/mcp-tooling/mcp-refero/README.md:219 | 8 | The Related Documents index covers every packet document except `scripts/README.md`, so the scripts folder has no entry point from the README. | Insert before line 219:
  ```markdown
  | [`scripts/README.md`](./scripts/README.md) | What each helper script checks and the output it prints: verify-only posture and report-only diagnostics |
  ```

### .skilled/skills/mcp-tooling/mcp-refero/ROUTER.md

- [P1] .skilled/skills/mcp-tooling/mcp-refero/ROUTER.md:23 | 1 | The last sentence says `references/tool-surface.md` is "never loaded by any scored route", but `RESOURCE_MAP` maps it to STYLES, SCREENS and FLOWS (lines 135-137), the intent bullets say those intents load it (lines 35-37) and the loading table lists it for research intent (line 89). The router template makes the map the declared source, so the prose contradicts the contract a reader must follow. | Replace `\`references/tool-surface.md\` is the declared default, offered as a fallback suggestion rather than loaded by any scored route.` with `\`references/tool-surface.md\` is the declared default: the three research routes load it, and a zero-score route offers it as a suggestion.`
- [P2] .skilled/skills/mcp-tooling/mcp-refero/ROUTER.md:23 | 7 | The middle of the paragraph packs the three reference families and the asset into one colon-led clause chain, so the selection set cannot be scanned. | Replace `From there the router selects among three reference families and one asset: the 8-tool contract and research funnel in \`references/tool-surface.md\`, the manual, bridge and auth model in \`references/mcp-wiring.md\`, the failure modes in \`references/troubleshooting.md\`, and the already-registered manual snapshot in \`assets/utcp-refero-manual.md\`, because this is a flat intent router with no keyed resource subdirectories.` with:
  ```markdown
  From there the router selects among three reference families and one asset:

  - `references/tool-surface.md` for the 8-tool contract and research funnel
  - `references/mcp-wiring.md` for the manual, bridge and auth model
  - `references/troubleshooting.md` for the failure modes
  - `assets/utcp-refero-manual.md` for the already-registered manual snapshot

  It is a flat intent router with no keyed resource subdirectories.
  ```

### .skilled/skills/mcp-tooling/mcp-refero/SKILL.md

- [P1] .skilled/skills/mcp-tooling/mcp-refero/SKILL.md:66 | 1 | The sentence says `references/tool-surface.md` is "never loaded on a scored route", but `ROUTER.md` maps it to STYLES, SCREENS and FLOWS, so a reader who follows this loading summary skips the tool contract on every research query. | Replace `\`references/tool-surface.md\` is the default resource, offered as a fallback suggestion and never loaded on a scored route.` with `\`references/tool-surface.md\` is the default resource: the three research routes load it, and a zero-score route offers it as a suggestion.`
- [P1] .skilled/skills/mcp-tooling/mcp-refero/SKILL.md:226 | 1 | The Bash rule says `doctor.sh` is the only shell role, but the README verification table and this file's own Section 9 both use the verify-only `scripts/install.sh`, so the rule forbids a documented verification step. | Replace line 226 with `- **Bash** runs only the read-only helpers: \`scripts/doctor.sh\` diagnostics and the verify-only \`scripts/install.sh\` posture check. This transport has no other shell role (Code Mode owns the stdio process launch, so the packet never runs \`npx\` itself).`
- [P2] .skilled/skills/mcp-tooling/mcp-refero/SKILL.md:54 | 9 | `mcp-mobbin` ships in this hub, so "a future sibling transport" states a status that is no longer true. | Replace `That is \`mcp-mobbin\` (a future sibling transport, not this packet).` with `That is \`mcp-mobbin\` (the sibling Mobbin transport, not this packet).`
- [P2] .skilled/skills/mcp-tooling/mcp-refero/SKILL.md:232 | 9 | Same stale status: `mcp-mobbin` is a shipped sibling, not "a planned future sibling". | Replace `**\`mcp-mobbin\`** is a planned future sibling for Mobbin research.` with `**\`mcp-mobbin\`** is the sibling transport for Mobbin research.`

### .skilled/skills/mcp-tooling/mcp-refero/assets/utcp-refero-manual.md

- clean

### .skilled/skills/mcp-tooling/mcp-refero/references/mcp-wiring.md

- [P2] .skilled/skills/mcp-tooling/mcp-refero/references/mcp-wiring.md:21 | 4 | The overview has no `### Purpose` and no `### When to Use`; it opens with an unlabeled definition paragraph and then the evidence-tag legend, so the reader gets neither why the reference exists nor when to open it. | Insert `### Purpose` and a blank line before line 23, then insert after line 25:
  ```markdown
  ### When to Use

  - Check the registered `refero` manual and the `mcp-remote` bridge before the first Refero call in a session.
  - Confirm the doubled-prefix callable names, or choose between browser OAuth and the env-backed Bearer alternative.
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-refero/references/mcp-wiring.md:71 | 7 | One paragraph packs three separate findings: the 401 observation, the 404 discovery miss, and the authorization-server metadata. | Replace line 71 with:
  ```markdown
  **Live unauthenticated observation** [CONFIRMED at research time]:

  - Direct GET and JSON-RPC `initialize` against the endpoint both returned **HTTP 401** advertising Bearer auth, scope `files:read`, and a protected-resource metadata URL.
  - That URL (`/.well-known/oauth-protected-resource`) returned **404** during research, but current `mcp-remote` treats a 404 as a discovery miss and tries alternate well-known locations.
  - `/.well-known/oauth-authorization-server` IS available and advertises authorization-code and client-credentials grants, dynamic registration, token/revocation endpoints, and `read`/`files:read` scopes.
  ```

### .skilled/skills/mcp-tooling/mcp-refero/references/tool-surface.md

- [P1] .skilled/skills/mcp-tooling/mcp-refero/references/tool-surface.md:35 | 2 | The table has six columns but only five headings, and six rows carry `\` plus spaces where `\|` was intended (lines 38, 39, 40, 42, 43, 44). Each of those rows shifts one cell right: the union types and the `platform` enum split apart, `response_format?` renders under Returns, and the returns text lands in an unnamed sixth column. | Replace lines 35-44 with:
  ```markdown
  | Layer | Tool | Required args | Optional args / bounds | Returns |
  | --- | --- | --- | --- | --- |
  | Styles | `refero_search_styles` | `query: string` | `page` (default 1); `response_format?` | `{pagination, records[]}`: style UUID, title, source URL, preview URL, platform, description |
  | Styles | `refero_get_style` | exactly one of `style_id: string` \| `style_ids: string[]` | `response_format?` | Visual thesis, color/token roles, typography, layout, spacing, surfaces/elevation, components, imagery, do/don't rules |
  | Screens | `refero_search_screens` | `query: string`, `platform: "web"\| "ios"` | `page`; `response_format?` | Paginated UUID records with `site`, `page_url`, `refero_url`, thumbnail, `page_types`, `ux_patterns`, `ui_elements`, colors, content |
  | Screens | `refero_get_screen` | exactly one of `screen_id: string` \| `screen_ids: string[]` | `response_format?` | Full screen metadata, fonts, tags, description/layout/functions. Never pass `image_size` or `include_similar` here |
  | Screens | `refero_get_similar_screens` | `screen_id: string` | `limit` 1-20, default 10; `response_format?` | Comparable screen records |
  | Screens | `refero_get_screen_image` | `screen_id: string` | `image_size: "thumbnail"\| "full"` (default thumbnail) | Raw screenshot image content |
  | Flows | `refero_search_flows` | `query: string`, `platform: "web"\| "ios"` | `page`; `response_format?` | Paginated summaries with **numeric** flow IDs, site, steps summary, problem, description |
  | Flows | `refero_get_flow` | exactly one of `flow_id: number` \| `flow_ids: number[]` | `response_format?` | Ordered steps: screen UUID, goal, action, system response, metadata, `related_queries` |
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-refero/references/tool-surface.md:25 | 4 | The reference overview uses `### Usage` instead of the template's `### When to Use`, and the sentence describes an action rather than the trigger that sends a reader here. | Replace lines 25-27 with:
  ```markdown
  ### When to Use

  Open this before writing or reviewing a Refero call: the tables and constraints are the documented baseline, and every intended callable and schema still needs a live Code Mode discovery check.
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-refero/references/tool-surface.md:111 | 9 | The section is titled "OPEN QUESTIONS (UNKNOWN, RUNTIME-ONLY)" and opens by saying these stay UNKNOWN, yet items 1 and 2 are labeled RESOLVED and PARTIALLY RESOLVED, so the container makes settled, dated findings read as open questions. | Replace lines 111-113 with:
  ```markdown
  ## 6. QUESTION STATUS (RESOLVED, PARTIAL AND UNKNOWN)

  Each entry records what live evidence has settled and what stays UNKNOWN until a runtime check; none of it can be resolved by authoring:
  ```

### .skilled/skills/mcp-tooling/mcp-refero/references/troubleshooting.md

- [P2] .skilled/skills/mcp-tooling/mcp-refero/references/troubleshooting.md:25 | 4 | The reference overview uses `### Usage` instead of the template's `### When to Use`, and the sentence never states the trigger that sends a reader here. | Replace lines 25-27 with:
  ```markdown
  ### When to Use

  Open this when a Refero call fails, stalls or returns less than expected: match the observed symptom to the table, preserve the read-only boundary, and use the linked references when discovery or authentication needs confirmation.
  ```
