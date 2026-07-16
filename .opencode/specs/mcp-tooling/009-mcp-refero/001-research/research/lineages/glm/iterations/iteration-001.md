# Iteration 1: Broad Survey — Refero MCP Tool Surface, Auth, and Skill-Repo Conventions

**Lineage:** glm (fanout-glm-1784198125985-iw9229) · **Iteration:** 1 of 2 · **Executor:** cli-opencode zai-coding-plan/glm-5.2 · **stopPolicy:** max-iterations

## Focus

Inventory the Refero MCP developer surface from the two pinned sources — `https://refero.design/mcp` (product page) and `https://github.com/referodesign/refero_skill` (official skill repo) — and cross-reference the existing `refero` manual in `.utcp_config.json`. Capture: tool names/parameters/response shapes, the auth/transport story, content coverage, and the skill-repo's structural conventions. This is the foundation iteration; subsequent angles deepen auth/gating/limits and the transport-packet design.

## Findings

### F1. The Refero MCP exposes exactly 8 tools across 3 research layers (styles, screens, flows)

The repo's `references/mcp-tools.md` documents a stable, `refero_`-prefixed tool surface. All tools are read-only search/retrieval — no mutating tools exist. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md]

**Styles layer (visual direction & taste):**

| Tool | Required params | Optional params | Returns |
|------|-----------------|-----------------|---------|
| `refero_search_styles` | `query` (string) | `page` (number) | style UUID, title, source URL, preview image URL, platform, rich NL description |
| `refero_get_style` | `style_id` (string) **OR** `style_ids` (string[]) — exactly one | `response_format` (`json`\|`md`, default `md`) | visual thesis, colors+roles, typography/type scale, layout/section rhythm/composition, spacing/radius/shadows/elevation/surfaces, component treatments, imagery treatment, do/don't rules, prompt guidance |

**Screens layer (concrete UI patterns):**

| Tool | Required params | Optional params | Returns |
|------|-----------------|-----------------|---------|
| `refero_search_screens` | `query` (string), `platform` (enum `web`\|`ios`) | `page` (number) | screen search results |
| `refero_get_screen` | `screen_id` (string) **OR** `screen_ids` (string[]) — exactly one | — | metadata, descriptions, app/site info, patterns, elements, fonts, content structure |
| `refero_get_similar_screens` | `screen_id` (string) | `limit` (number; default ~10, max ~20) | visually/functionally similar screens |
| `refero_get_screen_image` | `screen_id` (string) | `image_size` (enum `thumbnail`\|`full`, default `thumbnail`) | raw screenshot image content (heavier context) |

**Flows layer (multi-step journey logic):**

| Tool | Required params | Optional params | Returns |
|------|-----------------|-----------------|---------|
| `refero_search_flows` | `query` (string), `platform` (enum `web`\|`ios`) | `page` (number) | flow search results |
| `refero_get_flow` | `flow_id` (number) **OR** `flow_ids` (number[]) — exactly one | — | step-by-step goals, actions, system responses, screens, user problem, related search queries |

Content scale stated by the repo: **150,000+ real app screens** and **6,000+ user flows** "from Stripe, Linear, Notion, Figma, and the best-designed products." [SOURCE: https://github.com/referodesign/refero_skill README]

### F2. Three documented client-side "common mistakes" that the transport packet MUST encode as guardrails

The reference enumerates explicit anti-patterns that will break or waste calls. These map directly to validation rules for the `mcp-refero` transport packet: [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md]

1. **Do not use old `_tool` suffixed names** — legacy tool aliases exist; only the `refero_*` names above are current.
2. **Do not call `get_design_guidance`** — a deprecated tool; use styles/screens/flows research instead.
3. **Parameter hygiene:**
   - Do NOT pass `image_size` to `refero_get_screen` — use `refero_get_screen_image` for raw images.
   - Do NOT pass `include_similar` to `refero_get_screen` — use `refero_get_similar_screens`.
   - Do NOT pass `limit`, `image_size`, or `include_similar` to **search** tools (search tools only take `query`/`platform`/`page`).
   - `response_format` should be used ONLY when the client's shown tool schema includes it (i.e. `refero_get_style`).
4. **Layer discipline:** do not use screens as the primary source for visual taste when styles are available; styles first, screens for structure, flows for sequencing.

### F3. Auth model: Bearer-token HTTP transport OR mcp-remote OAuth browser flow

The repo documents two connection patterns, both hitting the same endpoint `https://api.refero.design/mcp`: [SOURCE: https://github.com/referodesign/refero_skill README]

- **Direct HTTP transport** (Claude Code / Cursor / Gemini): `Authorization: Bearer <token>` header. Example: `claude mcp add --transport http refero https://api.refero.design/mcp --header "Authorization: Bearer <token>"`.
- **`mcp-remote` bridge** (the path used by this repo's existing `.utcp_config.json` manual): `npx -y mcp-remote https://api.refero.design/mcp`. The README states: *"The first time you call Refero, a browser window opens to sign in. After that it's automatic."* → `mcp-remote` handles an OAuth/browser login flow and caches the token; no Bearer token is stored in `.utcp_config.json` (env is empty `{}`).

**Implication for the transport packet:** The existing manual relies on interactive OAuth via `mcp-remote` (a browser sign-in on first call). This is a read-only, Code-Mode-only transport. The packet must document that first-use requires an interactive browser sign-in (or a manually-supplied Bearer token) and that credentials live in `mcp-remote`'s cache, not in the manual's `env`.

### F4. Coverage limits: styles are web-marketing-scoped; screens/flows are broad

A current limitation directly affects how the transport packet routes requests: [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md and SKILL.md]

- **Styles** currently cover ONLY web marketing/product pages (landing, pricing, product marketing, editorial brand, SaaS sites). They do **NOT** cover in-app dashboards, auth screens, settings screens, or iOS app screens as *style systems*. For product UI, use styles for visual language then screens/flows for product logic.
- **Screens** support `platform: web|ios` — so iOS app screens ARE searchable as screens (just not as style systems).
- **Flows** likewise support `platform: web|ios`.

### F5. The official skill repo is a standalone design-methodology skill — NOT an mcp-tooling transport packet

`refero_skill` is a peer of `sk-design` (a design-judgment + research-first methodology skill), not a peer of `mcp-figma` (an mcp-tooling transport). Key structural conventions: [SOURCE: https://github.com/referodesign/refero_skill README + SKILL.md]

- **License:** MIT. **Install:** `npx skills add https://github.com/referodesign/refero_skill --skill refero-design` ("Craft knowledge loads immediately. No account required").
- **Structure:** `SKILL.md` (focused core workflow) + `references/` (`typography.md`, `color.md`, `motion.md`, `icons.md`, `craft-details.md`, `anti-ai-slop.md`, `copywriting.md`, `visual-workflow.md`, `mcp-tools.md`, `example-workflow.md`) + `assets/` (banner). **Contributing rule:** *"keep SKILL.md focused on the core workflow and put detailed, conditional guidance in references/"*.
- **The skill works WITHOUT live MCP** ("Useful on its own as a design methodology and craft reference"). Live tools are an enhancement.

**Critical routing insight for phase 002:** The `mcp-refero` transport packet must NOT duplicate `refero_skill`'s design methodology (that would collide with `sk-design`). It must be the thin read-only transport (peer of `mcp-figma`), exposing the 8 tools via Code Mode and pairing with `sk-design` for judgment — exactly mirroring the mcp-figma split: *"the design judgment is sk-design; this skill is the transport."*

### F6. Existing `.utcp_config.json` manual is a minimal stdio-over-mcp-remote bridge

The live transport under test: [SOURCE: .utcp_config.json, manual `refero`]
```json
{
  "name": "refero",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "refero": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "mcp-remote", "https://api.refero.design/mcp"],
        "env": {}
      }
    }
  }
}
```
No Bearer token / API key in `env`. Auth is delegated entirely to `mcp-remote`'s OAuth browser flow. The `mcp-refero` transport packet will be authored **atop** this existing manual (read-only reference now; verification/modification deferred to phase 003).

## Sources Consulted

- [SOURCE: https://refero.design/mcp] — product page (JS-rendered; returned only the title "Refero — UI/UX Design Inspiration for Your Next Project"; no crawlable body). Body content unverified from this URL directly.
- [SOURCE: https://github.com/referodesign/refero_skill] — repo README (install, structure, MIT license, 159★/12 forks, live-connect instructions, auth Bearer token, mcp-remote browser sign-in).
- [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md] — full 8-tool reference (params, returns, common mistakes, weak-results guidance).
- [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md] — research-first methodology, three-layer routing, styles coverage limit, quality gates.
- [SOURCE: .utcp_config.json] — existing `refero` manual (stdio/mcp-remote bridge, empty env).
- [SOURCE: .opencode/skills/mcp-tooling/mcp-figma/SKILL.md] — sibling transport-packet convention (references/tool_surface, mcp_wiring, troubleshooting; assets/utcp_manual, env_template).

## Assessment

- **newInfoRatio:** 1.0 — first pass; all findings are new to this packet.
- **Novelty justification:** No prior research existed in this lineage; the tool inventory, auth model, coverage limits, and skill-vs-transport distinction are all net-new.
- **Confidence:** High on the tool surface and repo conventions (primary source = official repo docs). Medium on auth specifics (Bearer token + mcp-remote OAuth documented, but the exact token-grant flow and free/paid boundaries are NOT yet documented here).

## Reflection

**What worked:** Fetching the raw `references/mcp-tools.md` and `SKILL.md` from GitHub gave an authoritative, parameter-level tool inventory — far more complete than the JS-rendered product page. The `.utcp_config.json` manual cross-check confirmed the endpoint and the mcp-remote transport path.

**What failed / gaps:** The `refero.design/mcp` product page is a client-rendered SPA; WebFetch returned only the title, so pricing/free-vs-paid and rate-limit info was NOT obtainable from that URL. These remain open for iteration 2.

**Ruled out:** Attempting to scrape the SPA body of `refero.design/mcp` for structured data — it does not yield crawlable content via WebFetch.

## Recommended Next Focus

Iteration 2 should **broaden review angles** (convergence is telemetry-only under max-iterations) into the gaps: (a) free-vs-paid gating and rate limits (try `refero.design` root/pricing or the README's pricing signals); (b) the exact auth/token lifecycle for `mcp-remote` and how the transport packet should document first-use interactive sign-in vs. a pre-supplied Bearer token; (c) the `mcp-refero` transport-packet file layout mapped explicitly onto the mcp-figma convention (tool_surface taxonomy, mcp_wiring, troubleshooting, env_template) so phase 002 can author without re-discovery.
