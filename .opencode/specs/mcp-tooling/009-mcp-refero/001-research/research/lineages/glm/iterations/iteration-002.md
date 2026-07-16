# Iteration 2: Broaden Angles — Gating/Rate-Limits, Auth Lifecycle, and Transport-Packet Layout

**Lineage:** glm (fanout-glm-1784198125985-iw9229) · **Iteration:** 2 of 2 (final) · **Executor:** cli-opencode zai-coding-plan/glm-5.2 · **stopPolicy:** max-iterations (convergence telemetry-only → angles broadened, not synthesized early)

## Focus

Close the iteration-1 gaps by broadening review angles: (a) free-vs-paid gating and rate limits (try alternate `refero.design` URLs); (b) the auth/token lifecycle for `mcp-remote` and how a transport packet should document first-use interactive sign-in vs. a Bearer token; (c) the explicit `mcp-refero` transport-packet file layout mapped onto the proven `mcp-figma` convention, including the Code Mode tool-naming and env-prefix rules.

## Findings

### F7. Free-vs-paid gating and rate limits are NOT publicly documented — a load-bearing negative-knowledge finding

After iteration 1 exhausted `refero.design/mcp`, iteration 2 probed `https://refero.design` (root) and `https://refero.design/pricing`. **Both are the same client-rendered SPA and return only the title** ("Refero — UI/UX Design Inspiration for Your Next Project") via WebFetch — no crawlable body, pricing table, or rate-limit text. [SOURCE: WebFetch on https://refero.design and https://refero.design/pricing, this iteration]

The official `refero_skill` repo documents **neither rate limits nor any free-vs-paid tool-surface boundary.** The only gating signals present anywhere in the authoritative sources are: [SOURCE: README + SKILL.md]
- **Craft knowledge (the skill's bundled references):** *"Craft knowledge loads immediately. No account required."* (install via `npx skills add ...`).
- **Live MCP tools:** require auth — either a Bearer token (HTTP transport) or the `mcp-remote` OAuth browser sign-in ("The first time you call Refero, a browser window opens to sign in. After that it's automatic.").

**Implication for the transport packet (phase 002):** Rate limits and exact tier boundaries (free vs paid) are an **unverified gap**. The packet must (1) explicitly flag rate limits as undocumented/inferred, (2) record tier context per finding (which tier a result was observed under), and (3) never claim a capability is free/paid without a live probe. This mirrors the phase spec's own risk row: *"Free-tier research account sees a reduced tool surface — Record tier context per finding; flag paid-only claims as unverified where not probed."* [SOURCE: spec.md §6 Risks]

### F8. Auth/token lifecycle: two paths, one documented contract — the transport packet documents both

Iteration 1 established two auth paths at a high level; iteration 2 pins the lifecycle the packet must encode: [SOURCE: README + .utcp_config.json + mcp-figma/mcp_wiring.md env-prefix rule]

| Path | Mechanism | Where credentials live | First-use |
|------|-----------|------------------------|-----------|
| **A. `mcp-remote` OAuth** (this repo's existing manual) | `npx -y mcp-remote https://api.refero.design/mcp`, empty `env` | `mcp-remote`'s own token cache (not in `.utcp_config.json`) | **Interactive:** a browser window opens to sign in on the first call; cached thereafter ("automatic") |
| **B. Bearer token (HTTP)** | `Authorization: Bearer <token>` header | A Refero account/API token (grant flow NOT documented in the skill repo) | Operator obtains a token out-of-band and supplies it |

**Code Mode env-prefix rule applies if path B is wired via env:** Code Mode prefixes every environment variable with the manual name (confirmed in `mcp-figma/references/mcp_wiring.md` — `figma_FIGMA_API_KEY`). For a `refero` manual, any token env var would be `refero_<NAME>`. However, the existing manual uses path A with empty `env`, so the packet's default asset keeps `env: {}` and documents path B as an optional operator override. **[CONFIRMED: mcp-figma mcp_wiring.md §3 env-prefix rule; INFERRED: Refero's specific token-grant flow is undocumented]**

**Critical interaction:** the interactive browser sign-in (path A) is a **first-use dependency**. The packet's troubleshooting reference MUST warn that first invocation requires an interactive environment (a browser-capable session); headless/CI runs likely need path B (a pre-supplied Bearer token). This is a real operational constraint for the transport, not a footnote.

### F9. Transport-packet file layout: mcp-refero is a SIMPLER read-only-only peer of mcp-figma (MCP-only, no CLI)

Mapping the proven `mcp-figma` packet onto the (simpler) `mcp-refero` shape. `mcp-figma` is CLI-primary + optional MCP with a complex gating taxonomy (read-only/mutating/destructive/arbitrary). `mcp-refero` is **MCP-only and entirely read-only** — no CLI, no mutating surface, so the gating taxonomy collapses to "all 8 tools read-only; no gating beyond auth." [SOURCE: .opencode/skills/mcp-tooling/mcp-figma/{SKILL.md, references/mcp_wiring.md, references/tool_surface.md}]

**Proposed `mcp-refero` packet layout (for phase 002 authoring):**

| File | Role | Derives from mcp-figma |
|------|------|------------------------|
| `SKILL.md` | Focused contract: when to use, smart routing, read-only transport, **pairs with `sk-design` for judgment** (never duplicates `refero_skill`'s methodology) | SKILL.md |
| `references/refero_mcp_tools.md` | The 8-tool inventory (params, returns) — derived from `refero_skill`'s `references/mcp-tools.md` | (new; mcp-figma uses a CLI reference) |
| `references/tool_surface.md` | Simplified taxonomy: **all 8 tools READ-ONLY**; encode the 4 documented client-mistake guardrails (no old `_tool` names, no `get_design_guidance`, no `image_size`/`include_similar` on `get_screen`, no `limit`/`image_size`/`include_similar` on search tools, `response_format` only where schema shows it) | tool_surface.md (collapsed) |
| `references/mcp_wiring.md` | The existing `refero` manual (path A) + Code Mode discover-first flow + `call_tool_chain` example + OAuth-vs-Bearer token (path B) + env-prefix rule | mcp_wiring.md |
| `references/troubleshooting.md` | Weak-results guidance (from mcp-tools.md "If Results Are Weak"), first-use browser sign-in failures, `mcp-remote` token cache, token-expiry | troubleshooting.md |
| `assets/utcp_refero_manual.md` | Paste-ready existing manual (stdio/mcp-remote, empty env) | utcp_figma_manual.md |
| `assets/env_template.md` | Mostly empty for path A; documents the optional `refero_<TOKEN>` Bearer-token override for path B | env_template.md |

**Code Mode calling convention (confirmed from mcp-figma):** tool names are `{manual}.{manual}_{tool}`, so every Refero call is `refero.refero_<tool>` (e.g., `refero.refero_search_styles`, `refero.refero_get_style`, `refero.refero_search_screens`, `refero.refero_get_screen`, `refero.refero_get_similar_screens`, `refero.refero_get_screen_image`, `refero.refero_search_flows`, `refero.refero_get_flow`). Discover-first is mandatory: `list_tools()` → `search_tools()` → `tool_info()` before invoking, since the live surface can change and the `refero_` names are namespaced by the client. **[CONFIRMED: mcp-figma mcp_wiring.md §3-5 naming + discover-first]**

### F10. Layer-discipline routing rule the transport MUST surface (from SKILL.md)

The official methodology mandates a non-obvious routing order that the transport packet should encode as the default workflow, because it materially affects result quality: [SOURCE: refero_skill SKILL.md "Tool Routing"]
1. **Styles first** for any visual task (`refero_search_styles` → `refero_get_style`) — establish taste/direction.
2. **Screens** for concrete UI patterns (`refero_search_screens` → `refero_get_screen` / `refero_get_similar_screens` / `refero_get_screen_image`) — page structure, components, states.
3. **Flows** for multi-step journeys (`refero_search_flows` → `refero_get_flow`) — sequencing.
4. **Combine layers:** visual direction from styles, concrete patterns from screens, sequencing from flows.
5. **Coverage caveat:** styles are web-marketing-scoped only; for dashboards/auth/settings/iOS, use styles for visual language then screens/flows for product logic.

The transport packet exposes these tools but routes the *judgment* of what/when to search to **`sk-design`** — exactly the mcp-figma split ("the design judgment is sk-design; this skill is the transport").

## Sources Consulted

- [SOURCE: https://refero.design] — root page (SPA; title only; confirms unscrapability).
- [SOURCE: https://refero.design/pricing] — pricing page (SPA; title only; **no crawlable pricing/gating/rate-limit content** — load-bearing negative knowledge).
- [SOURCE: .opencode/skills/mcp-tooling/mcp-figma/references/mcp_wiring.md] — Code Mode wiring convention (already-registered manual, env-prefix rule `manual_ENVNAME`, discover-first `list_tools`→`search_tools`→`tool_info`, `call_tool_chain` example, `{manual}.{manual}_{tool}` naming).
- [SOURCE: .opencode/skills/mcp-tooling/mcp-figma/references/tool_surface.md] — gating-taxonomy convention (read-only/mutating/destructive/arbitrary) that mcp-refero collapses to read-only-only.
- [SOURCE: refero_skill SKILL.md "Tool Routing" + README] — layer-discipline routing rule; auth paths; "no account required" gating signal.
- [SOURCE: .opencode/specs/mcp-tooling/009-mcp-refero/001-research/spec.md §6] — phase risk row on tier-context-per-finding.

## Assessment

- **newInfoRatio:** 0.7 — substantially new angles (negative-knowledge on gating/limits, auth lifecycle pinning, the full packet layout, Code Mode naming convention), with some consolidation of iteration-1 tool-surface facts.
- **Novelty justification:** Iteration 2 added the gating/rate-limit gap as confirmed negative knowledge, the operational first-use browser-sign-in constraint, and the concrete transport-packet file layout + calling convention — none present in iteration 1.
- **Confidence:** High on the packet layout and Code Mode convention (read from the mcp-figma sibling in-repo). Low/inferred on rate limits and exact tier boundaries (undocumented; flagged as unverified gap).

## Reflection

**What worked:** Re-deriving the packet layout from the in-repo mcp-figma sibling gave a concrete, file-level blueprint for phase 002 without any external guessing. Probing the alternate `refero.design` URLs converted "we don't know gating" into a *confirmed* negative-knowledge finding (stronger than an open question).

**What failed / gaps:** Rate limits and free-vs-paid tier boundaries remain **undocumented** in every authoritative source — this is a genuine external gap, not a research shortfall. The token-grant flow for path B (how an operator obtains a Refero Bearer token) is also undocumented in the skill repo.

**Ruled out:** Further scraping of `refero.design/*` SPA routes — all yield only the title; the pricing/gating facts are not web-crawlable and must be resolved by a live probe (deferred, out of this read-only research phase's scope) or operator knowledge.

## Recommended Next Focus

This is the final iteration (max-iterations reached). Synthesis should consolidate F1-F10 into `research.md`: the 8-tool inventory, the read-only transport design atop the existing manual, the OAuth/Bearer auth lifecycle with the first-use browser-sign-in constraint, the unverified gating/rate-limit gap (flagged for live-probe in a later phase), the mcp-figma-mapped packet layout, and the sk-design pairing principle — handing phase 002 a no-further-discovery authoring brief.
