# Research Synthesis: Refero MCP Developer Surface for the `mcp-refero` Transport Mode

**Lineage:** glm (`fanout-glm-1784198125985-iw9229`) · **Loop:** deep-research · **Iterations:** 2 · **stopPolicy:** max-iterations · **Spec folder:** `.opencode/specs/mcp-tooling/009-mcp-refero/001-research`

> Workflow-owned canonical synthesis for this lineage. Consolidates iteration-001 (F1-F6) and iteration-002 (F7-F10). Every load-bearing claim cites its source. Claims tagged **[CONFIRMED]** (read from an authoritative source this session) or **[INFERRED]** (reasoned, needs a live probe). resource-map.md was absent at init, so it is not cited.

---

## 1. Executive Summary

The Refero MCP is a **read-only UI/UX design-reference search service** exposing **8 tools across 3 research layers** (styles, screens, flows) over the endpoint `https://api.refero.design/mcp`. It is reachable through two auth paths: an interactive **`mcp-remote` OAuth browser flow** (the path used by this repo's existing `.utcp_config.json` manual) or a **Bearer token** over HTTP. The official `refero_skill` repo is a *standalone design-methodology skill* (a peer of `sk-design`), **not** an mcp-tooling transport — so the `mcp-refero` packet must be the **thin read-only transport** (a simpler peer of `mcp-figma`), pairing with `sk-design` for judgment and never duplicating the methodology. Free-vs-paid gating and rate limits are **undocumented in every authoritative source** and must be treated as an unverified gap. This synthesis is complete enough for phase 002 (skill authoring) to proceed without further external discovery.

---

## 2. The Refero MCP Tool Surface (8 tools, 3 layers)

All tools are **read-only search/retrieval** — there are no mutating tools. Tool names use the `refero_` prefix. **[CONFIRMED: https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md]**

### Layer 1 — Styles (visual direction & taste)

| Tool | Required params | Optional params | Returns |
|------|-----------------|-----------------|---------|
| `refero_search_styles` | `query` (string) | `page` (number) | style UUID, title, source URL, preview image URL, platform, rich NL description |
| `refero_get_style` | `style_id` (string) **OR** `style_ids` (string[]) — exactly one | `response_format` (`json`\|`md`, default `md`) | visual thesis, colors+roles, typography/type scale, layout/section rhythm/composition, spacing/radius/shadows/elevation/surfaces, component treatments, imagery treatment, do/don't rules, prompt guidance |

### Layer 2 — Screens (concrete UI patterns)

| Tool | Required params | Optional params | Returns |
|------|-----------------|-----------------|---------|
| `refero_search_screens` | `query` (string), `platform` (enum `web`\|`ios`) | `page` (number) | screen search results |
| `refero_get_screen` | `screen_id` (string) **OR** `screen_ids` (string[]) — exactly one | — | metadata, descriptions, app/site info, patterns, elements, fonts, content structure |
| `refero_get_similar_screens` | `screen_id` (string) | `limit` (number; default ~10, max ~20) | visually/functionally similar screens |
| `refero_get_screen_image` | `screen_id` (string) | `image_size` (enum `thumbnail`\|`full`, default `thumbnail`) | raw screenshot image content (heavier context) |

### Layer 3 — Flows (multi-step journey logic)

| Tool | Required params | Optional params | Returns |
|------|-----------------|-----------------|---------|
| `refero_search_flows` | `query` (string), `platform` (enum `web`\|`ios`) | `page` (number) | flow search results |
| `refero_get_flow` | `flow_id` (number) **OR** `flow_ids` (number[]) — exactly one | — | step-by-step goals, actions, system responses, screens, user problem, related search queries |

**Content scale:** 150,000+ real app screens and 6,000+ user flows "from Stripe, Linear, Notion, Figma, and the best-designed products." **[CONFIRMED: https://github.com/referodesign/refero_skill README]**

---

## 3. Documented Client-Side Guardrails (the "common mistakes")

The reference enumerates explicit anti-patterns that the transport packet MUST encode as validation/troubleshooting rules. **[CONFIRMED: references/mcp-tools.md "Common Mistakes"]**

1. **No old `_tool` suffixed names** — legacy aliases exist; only the `refero_*` names above are current.
2. **No `get_design_guidance`** — a deprecated tool; use styles/screens/flows research instead.
3. **Parameter hygiene:**
   - Do NOT pass `image_size` to `refero_get_screen` — use `refero_get_screen_image` for raw images.
   - Do NOT pass `include_similar` to `refero_get_screen` — use `refero_get_similar_screens`.
   - Do NOT pass `limit`, `image_size`, or `include_similar` to **search** tools (they take only `query`/`platform`/`page`).
   - `response_format` should be used ONLY when the client's shown tool schema includes it (i.e. `refero_get_style`).
4. **Layer discipline:** do not use screens as the primary source for visual taste when styles are available.

---

## 4. Auth & Transport Model

Endpoint: `https://api.refero.design/mcp`. **[CONFIRMED: README + .utcp_config.json]**

| Path | Mechanism | Credentials location | First-use |
|------|-----------|----------------------|-----------|
| **A. `mcp-remote` OAuth** (this repo's existing manual) | `npx -y mcp-remote https://api.refero.design/mcp`, empty `env` | `mcp-remote`'s own token cache (not in `.utcp_config.json`) | **Interactive:** browser window opens to sign in on the first call; cached thereafter ("automatic") |
| **B. Bearer token (HTTP)** | `Authorization: Bearer <token>` header | A Refero account/API token (grant flow **undocumented** in the skill repo) | Operator obtains a token out-of-band and supplies it |

The existing manual uses **path A** (empty `env`): **[CONFIRMED: .utcp_config.json, manual `refero`]**
```json
{ "name": "refero", "call_template_type": "mcp",
  "config": { "mcpServers": { "refero": {
    "transport": "stdio", "command": "npx",
    "args": ["-y", "mcp-remote", "https://api.refero.design/mcp"], "env": {}
  } } } }
```

**Operational constraint:** the interactive browser sign-in (path A) is a **first-use dependency**. The transport's troubleshooting reference MUST warn that first invocation requires a browser-capable session; headless/CI runs likely need path B (a pre-supplied Bearer token). **[INFERRED: operational consequence of the documented OAuth flow]**

**Code Mode env-prefix rule:** if a token is wired via env under path B, Code Mode prefixes env vars with the manual name → `refero_<NAME>`. The default asset keeps `env: {}` for path A and documents path B as an optional override. **[CONFIRMED: mcp-figma/references/mcp-wiring.md §3; INFERRED: Refero's token-grant flow]**

---

## 5. Coverage Limits

- **Styles** cover ONLY web marketing/product pages (landing, pricing, product marketing, editorial brand, SaaS sites). They do **NOT** cover in-app dashboards, auth screens, settings screens, or iOS app screens as *style systems*. For product UI, use styles for visual language then screens/flows for product logic. **[CONFIRMED: references/mcp-tools.md + SKILL.md]**
- **Screens** and **Flows** both support `platform: web|ios`, so iOS app screens/flows ARE searchable (just not as style systems).

---

## 6. Free vs Paid Gating & Rate Limits — Unverified Gap (Negative Knowledge)

**Rate limits and free-vs-paid tier boundaries are NOT documented in any authoritative source.** **[CONFIRMED: WebFetch on https://refero.design, https://refero.design/mcp, https://refero.design/pricing — all return only the SPA title; the skill repo documents neither]**

The only gating signals present anywhere:
- **Craft knowledge (skill's bundled references):** *"Craft knowledge loads immediately. No account required."* **[CONFIRMED: README]**
- **Live MCP tools:** require auth (Bearer token or `mcp-remote` OAuth sign-in). **[CONFIRMED: README]**

**Required handling for the transport packet:** (1) explicitly flag rate limits as undocumented/inferred; (2) record tier context per finding (which tier a result was observed under); (3) never claim a capability is free/paid without a live probe. This matches the phase spec's risk row (spec.md §6). **[CONFIRMED: spec.md]**

---

## 7. The Official `refero_skill` Repo: Conventions & Role

`referodesign/refero_skill` is a **standalone design-methodology skill** — a peer of `sk-design`, NOT an mcp-tooling transport. **[CONFIRMED: README + SKILL.md]**

- **License:** MIT. **Install:** `npx skills add https://github.com/referodesign/refero_skill --skill refero-design`.
- **Structure:** `SKILL.md` (focused core workflow) + `references/` (`typography`, `color`, `motion`, `icons`, `craft-details`, `anti-ai-slop`, `copywriting`, `visual-workflow`, `mcp-tools`, `example-workflow`) + `assets/` (banner).
- **Contributing rule:** *"keep SKILL.md focused on the core workflow and put detailed, conditional guidance in references/"*.
- **Works WITHOUT live MCP** ("Useful on its own as a design methodology and craft reference"); live tools are an enhancement.

**Critical routing insight for phase 002:** the `mcp-refero` transport packet must **NOT** duplicate this methodology (that would collide with `sk-design`). It is the thin read-only transport that pairs with `sk-design` for judgment.

---

## 8. Layer-Discipline Routing (the workflow the transport must surface)

The official methodology mandates a routing order that materially affects result quality. The transport exposes the tools; the *judgment* of what/when to search routes to `sk-design`. **[CONFIRMED: SKILL.md "Tool Routing"]**

1. **Styles first** for any visual task (`refero_search_styles` → `refero_get_style`) — establish taste/direction.
2. **Screens** for concrete UI patterns (`refero_search_screens` → `refero_get_screen` / `refero_get_similar_screens` / `refero_get_screen_image`).
3. **Flows** for multi-step journeys (`refero_search_flows` → `refero_get_flow`).
4. **Combine layers:** visual direction from styles, concrete patterns from screens, sequencing from flows.
5. **Coverage caveat:** styles are web-marketing-scoped; for dashboards/auth/settings/iOS use styles for visual language then screens/flows for product logic.

---

## 9. `mcp-refero` Transport-Packet Design (mapped onto mcp-figma)

`mcp-refero` is a **SIMPLER, read-only-only peer of `mcp-figma`**: MCP-only (no CLI primary), entirely read-only (no gating taxonomy beyond auth). **[CONFIRMED: mcp-figma/{SKILL.md, references/mcp-wiring.md, references/tool-surface.md}]**

**Proposed file layout (phase 002 authoring brief):**

| File | Role |
|------|------|
| `SKILL.md` | Focused contract: when to use, smart routing, read-only transport, **pairs with `sk-design`** (never duplicates `refero_skill`) |
| `references/refero_mcp_tools.md` | The 8-tool inventory (params, returns) — derived from `refero_skill`'s `references/mcp-tools.md` |
| `references/tool-surface.md` | Collapsed taxonomy: **all 8 tools READ-ONLY**; encode the §3 guardrails |
| `references/mcp-wiring.md` | The existing `refero` manual (path A) + Code Mode discover-first flow + `call_tool_chain` example + OAuth-vs-Bearer (path B) + env-prefix rule |
| `references/troubleshooting.md` | Weak-results guidance, first-use browser sign-in failures, `mcp-remote` token cache/expiry |
| `assets/utcp-refero-manual.md` | Paste-ready existing manual (stdio/mcp-remote, empty env) |
| `assets/env_template.md` | Mostly empty for path A; documents the optional `refero_<TOKEN>` Bearer override for path B |

**Distinctions from mcp-figma:** mcp-figma is CLI-primary + optional MCP with a complex gating taxonomy (read-only/mutating/destructive/arbitrary); mcp-refero is MCP-only and read-only-only — far simpler.

**Code Mode calling convention:** tool names are `{manual}.{manual}_{tool}`, so every call is `refero.refero_<tool>` (e.g., `refero.refero_search_styles`, `refero.refero_get_flow`). **Discover-first is mandatory:** `list_tools()` → `search_tools()` → `tool_info()` before invoking, since the live surface can change and clients namespace the `refero_` names. **[CONFIRMED: mcp-figma mcp-wiring.md §3-5]**

---

## 10. Existing Manual & Integration Boundary

The live transport under test is the existing `refero` manual in `.utcp_config.json` (§4). This research phase is **read-only**: the manual is referenced, not modified. Verification/modification and `mode-registry.json` registration are **phase 003** (out of scope here). **[CONFIRMED: spec.md §3 Out of Scope]**

---

## 11. Recommendations for Phase 002

1. Author `mcp-refero` per the §9 layout; keep `SKILL.md` focused and push tool detail into `references/` (mirroring both mcp-figma and refero_skill conventions).
2. Derive `references/refero_mcp_tools.md` directly from `refero_skill/references/mcp-tools.md` (it is the authoritative tool inventory).
3. Encode the §3 guardrails and §8 routing order as the transport's default workflow + validation rules.
4. Document both auth paths (§4); make path A (empty env) the default and flag the first-use browser-sign-in constraint prominently in `troubleshooting.md`.
5. Flag the §6 gating/rate-limit gap explicitly; add a "record tier context per finding" rule.
6. Pair with `sk-design` for all design judgment; do NOT import `refero_skill`'s craft references into the transport (that is `sk-design`'s neighbor, not the transport's job).
7. Use `refero.refero_<tool>` Code Mode naming and enforce discover-first (`list_tools`→`search_tools`→`tool_info`).

---

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Scrape `refero.design/mcp` SPA body for structured pricing/gating data | Client-rendered SPA; WebFetch returns only the title — no crawlable body | iteration-001.md; WebFetch on /mcp | 1 |
| Scrape `refero.design` root + `/pricing` for pricing/gating/rate-limit facts | Same SPA; all routes yield only the title — facts not web-crawlable | iteration-002.md F7; WebFetch on root + /pricing | 2 |
| Importing `refero_skill`'s design methodology into the `mcp-refero` transport | `refero_skill` is a peer of `sk-design`; duplicating it collides with `sk-design`'s authority — the transport must be thin/read-only and pair with `sk-design` | iteration-001.md F5; iteration-002.md F9, F10 | 1, 2 |
| Treating rate limits / tier boundaries as answerable from current sources | Confirmed undocumented in every authoritative source (skill repo + SPA); genuinely an external gap | iteration-002.md F7 | 2 |

---

## 12. Open Questions (unanswered / unverified)

- **Q3 — Rate limits:** CONFIRMED UNDOCUMENTED in all authoritative sources. Unverified gap → resolve via a live probe in a later phase (out of this read-only research scope).
- **Q4 — Free vs paid gating:** only signal is craft-knowledge-no-account vs live-MCP-needs-auth. Exact tier boundaries UNDOCUMENTED → unverified gap (live probe later).
- **Bearer-token grant flow (path B):** how an operator obtains a Refero Bearer token is undocumented in the skill repo. [INFERRED: needs Refero account/dashboard access to document]

---

## 13. Key Findings Index

| ID | Iteration | Summary | Source |
|----|-----------|---------|--------|
| F1 | 1 | 8 read-only tools, 3 layers (styles/screens/flows) | references/mcp-tools.md |
| F2 | 1 | Documented client mistakes / parameter hygiene | references/mcp-tools.md |
| F3 | 1 | Auth: Bearer HTTP or mcp-remote OAuth; endpoint | README + .utcp_config.json |
| F4 | 1 | Styles web-marketing-scoped; screens/flows web\|ios | references/mcp-tools.md + SKILL.md |
| F5 | 1 | refero_skill = methodology skill (peer of sk-design), MIT | README + SKILL.md |
| F6 | 1 | Existing manual = minimal stdio/mcp-remote bridge, empty env | .utcp_config.json |
| F7 | 2 | NEGATIVE KNOWLEDGE: gating + rate limits undocumented | iteration-002.md; WebFetch |
| F8 | 2 | Auth lifecycle: OAuth interactive first-use vs Bearer; env-prefix rule | iteration-002.md; mcp-figma mcp-wiring.md |
| F9 | 2 | Packet layout: simpler read-only-only peer of mcp-figma | iteration-002.md; mcp-figma references |
| F10 | 2 | Layer-discipline routing rule; sk-design pairing | SKILL.md Tool Routing |

---

## 14. Confidence Summary

- **High confidence [CONFIRMED]:** tool surface (F1-F2), auth paths at high level (F3/F8), coverage limits (F4), repo role (F5), existing manual (F6), packet layout & Code Mode convention (F9-F10).
- **Low / inferred [INFERRED]:** rate limits (F7 — negative knowledge), tier boundaries (F7), Bearer-token grant flow (F8), exact first-use UX details beyond "browser opens."

---

## 15. References

- https://refero.design/mcp — product/MCP page (SPA; title only via WebFetch).
- https://github.com/referodesign/refero_skill — official skill repo (README, MIT, 159★/12 forks).
- https://raw.githubusercontent.com/referodesign/refero_skill/master/references/mcp-tools.md — authoritative 8-tool reference.
- https://raw.githubusercontent.com/referodesign/refero_skill/master/SKILL.md — research-first methodology + routing.
- https://refero.design and https://refero.design/pricing — SPA (title only; confirmed unscrapable).
- `.utcp_config.json` — existing `refero` manual (stdio/mcp-remote bridge, empty env).
- `.opencode/skills/mcp-tooling/mcp-figma/SKILL.md`, `references/mcp-wiring.md`, `references/tool-surface.md` — transport-packet convention.
- `.opencode/specs/mcp-tooling/009-mcp-refero/001-research/spec.md` — phase scope, risks, open questions.

---

## 16. Synthesis Provenance

- Compiled from `iterations/iteration-001.md` (F1-F6) and `iterations/iteration-002.md` (F7-F10).
- Findings registry: `findings-registry.json` (4/6 questions resolved; Q3/Q4 closed as confirmed negative knowledge).
- Stop reason: `maxIterationsReached` (terminal; convergence telemetry-only per `stopPolicy: max-iterations`).
