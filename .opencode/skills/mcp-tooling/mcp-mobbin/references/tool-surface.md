---
title: "Mobbin Tool Surface"
description: "The live-discovered Mobbin MCP contract (three read tools: search_screens, search_flows, search_sections): fixture schemas, the resolved deep-mode input, the query-intent research workflows, plan gating, rate limits, the completeness boundary, and the open questions carried as UNKNOWN."
trigger_phrases:
  - "mobbin tools"
  - "mobbin search screens"
  - "mobbin tool surface"
  - "mobbin plan gating"
  - "mobbin rate limit"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Mobbin Tool Surface

Read-only contract reference for the live-discovered Mobbin MCP tools.

## 1. OVERVIEW

### Purpose

The live contract for the Mobbin MCP. **Live Code Mode discovery ran 2026-07-16, pre-auth** (fixture: [`discovery-fixture-2026-07-16.json`](./discovery-fixture-2026-07-16.json)), and it **SUPERSEDES the research's one-public-tool baseline**: `list_tools` returned **THREE read tools** — registry names `mobbin.mobbin.search_screens`, `mobbin.mobbin.search_flows`, `mobbin.mobbin.search_sections` (TS callables `mobbin.mobbin_search_screens(args)` etc., per the fixture's `Access as:` lines). All three are read-only search tools: the mutation-refusal check passed — no mutation-capable tool appeared in the live listing. Treat per-session Code Mode discovery (`list_tools` / `search_tools` / `tool_info`) as the final live schema before calling. The documented-baseline facts below still trace to the official Mobbin skills repository (`mobbin/skills`) and the official Mobbin MCP docs (docs.mobbin.com/mcp).

### Usage

Use the discovered schemas and workflow constraints as the baseline, then re-confirm the intended callable in the active Code Mode session.

Claims below are tagged **[CONFIRMED]** (publicly documented, observed by live unauthenticated probe at research time, or read from the 2026-07-16 discovery fixture), **[INFERRED]** (supported but not exercised end-to-end), or **[UNKNOWN]** (requires an authenticated, paid, operator-authorized runtime).

> App, screen, and element research are **query intents over `search_screens`**; flow research has its own tool (`search_flows`, live-discovered 2026-07-16) and website-section research its own (`search_sections`). There are still no `search_apps`, `search_elements`, detail, image-download, or mutation tools, and none may be invented beyond the discovered inventory.

---

## 2. THE LIVE-DISCOVERED TOOLS (THREE)

Live-listed pre-auth on 2026-07-16 ([`discovery-fixture-2026-07-16.json`](./discovery-fixture-2026-07-16.json)); all schemas below are the fixture's declared TypeScript interfaces. **[CONFIRMED: fixture]**

| Tool | Posture | Required inputs | Optional inputs | Declared output |
|---|---|---|---|---|
| `search_screens` | Read/search | `query`: natural language; `platform`: `"ios" \| "web"` | `mode?: "deep" \| "standard" \| "fast"`; `limit?`; `exclude_screen_ids?: string[]`; `image_format?: "webp" \| "jpg"` | `{ query, screens: [{ id, image_url, mobbin_url, app_name, platform }] }` |
| `search_flows` | Read/search | `query`: one user journey; `platform`: `"ios" \| "web"` | `limit?`; `page?` (max 20); `image_format?` | `{ query, page, has_next_page, flows: [{ id, name, actions[], mobbin_url, app_name, platform, screen_count, screens: [{ screen_id, image_url, position }] }] }` |
| `search_sections` | Read/search | `query`: one website section | `limit?`; `page?`; `image_format?` | `{ query, page, has_next_page, sections: [{ id, image_url, mobbin_url, site_name }] }` |

`search_flows` and `search_sections` **supersede the research's one-public-tool baseline** (dated 2026-07-16): the official `mobbin-search` skill documented only `search_screens`; the live registry lists all three.

Inline images: all three tool descriptions instruct examining returned images and citing `mobbin_url` links. Note the fixture's declared `search_screens` output is `{ query, screens[] }` — the research-documented `index` and `failed[]` fields do **not** appear in the declared schema; verify their presence or absence on the first authenticated call rather than assuming either shape. **[CONFIRMED: fixture schema; live response shape untested]**

### Hard constraints

- `query` is natural language, derived from the user's actual words; one screen/journey/section per query (the fixture descriptions forbid combined intents, negations, and vague style words). Do not put platform words in `query` — use the `platform` parameter.
- `platform` is the enum `"ios" | "web"` on `search_screens` and `search_flows`; infer from app context, ask when unclear. `search_sections` has no platform parameter. **[CONFIRMED: fixture]**
- `limit` guidance: higher limits increase context usage (fixture wording); the official guidance treats ~15 as the ceiling for variety. Start small; ask before widening materially.
- Missing images or partial results are **partial success**: report them, never silently discard.
- Preserve unknown response fields untouched; declared schemas are discovery output, and live calls remain unexercised.
- Cite every selected reference by its `mobbin_url` (provenance).

### The `deep` mode (RESOLVED 2026-07-16)

The research record's input-vs-server-behavior conflict is **resolved by the fixture schema**: search mode is a client-settable input on `search_screens` — `mode?: "deep" | "standard" | "fast"`, where `"standard"` returns results with low latency, `"deep"` uses an AI-powered pipeline that interprets intent and scores results for relevance (for nuanced queries), and `"fast"` is a deprecated alias for `"standard"` slated for removal. **[CONFIRMED: fixture `search_screens` schema]**

### Completeness boundary

- **Documented baseline (historical)**: `search_screens` was the only publicly documented tool — the official `skills/` tree contains exactly one skill (`mobbin-search`) naming only `search_screens`. **[CONFIRMED at 2026-07-16: server repo HEAD `bbee2a6be34d251c580ba80bb8b407c87587aba7` (2026-06-03); skills repo HEAD `9657786338c5e7fed597031982398a8d99681fec` (2026-05-04)]**
- **Live inventory (supersedes the baseline)**: pre-auth `list_tools` on 2026-07-16 returned exactly three `mobbin.*` entries — `search_screens`, `search_flows`, `search_sections` — all read-only search tools. Mutation-refusal check: passed (no mutation-capable tool listed). **[CONFIRMED: fixture]**
- **Not allowed**: inventing `search_apps`, `search_elements`, detail/image/mutation tools, or anything beyond the discovered inventory.
- The packet's read-only guarantee is an **authorization boundary**: allow only verified read/search tools; if live discovery ever returns a mutation-capable tool, refuse it and require an explicit reviewed contract change.

### Two-server disambiguation

`docs.mobbin.com/mcp` is a **separate** Mintlify docs-search MCP ("Mobbin Docs") exposing `search_mobbin_docs`, `query_docs_filesystem_mobbin_docs`, and `submit_feedback`. It belongs to the docs server, not the design server. This packet targets `api.mobbin.com/mcp` only. **[CONFIRMED]**

---

## 3. THE QUERY-INTENT WORKFLOWS

App, screen, and element research run over `search_screens`; flow research now has a dedicated tool:

1. **App research** — name the app/company/category and the comparison goal ("banking apps onboarding identity verification"); compare `app_name`, platform, structure, and visible patterns across results. Multiple results are evidence, not a design chooser.
2. **Screen research** — name the concrete screen/state/job ("iOS subscription cancellation confirmation", "web empty-state dashboard"); start at 5 results; cite each `mobbin_url` used.
3. **Flow research** — use `search_flows` (live-discovered 2026-07-16): describe one user journey ("onboarding with personalization steps", "checkout with payment method selection"); it returns flow objects with ordered per-screen previews (`screens[].position`), `actions[]`, and `screen_count` — a real sequence contract, superseding the old screens-only reconstruction guidance. Reconstruction-as-inference labeling still applies to anything beyond the returned ordering.
4. **Element research** — name component + context/state ("bottom-sheet destructive confirmation", "inline validation on signup"); analyze element behavior within returned screens; never fabricate an element-detail tool.
5. **Website-section research** — use `search_sections` (live-discovered 2026-07-16): describe one section ("pricing page with plan comparison table", "hero section with signup form"); results carry `site_name` and section images.

### The official operating sequence

From the official `mobbin-search` skill: derive query terms from the user's actual words -> infer `ios` vs `web` from app context (unclear -> ask) -> announce a short search plan -> call `search_screens` in the same turn -> visually inspect returned references (observe content, structure, styling, interaction; compare repeats and meaningful differences; synthesize principles) -> answer from evidence tied to returned screens.

The official skill's **optional evidence-board writer is excluded** from this transport: board creation violates the non-mutating packet boundary.

### The local judgment boundary

This transport allows breadth while researching (multiple apps, screens, intents compared through metadata and images), but design-affecting use is governed by the `sk-design` contract: the design skill collapses evidence to one declared critique reference before any judgment. A transport response is untrusted reference evidence, never design approval. Search rank is not taste; an appealing screenshot is not acceptance; and no accessibility, responsiveness, or readiness verdict ever comes from this packet.

---

## 4. PLAN GATING AND LIMITS

| Surface | Free | Pro | Team | Enterprise | Credential |
|---------|:----:|:---:|:----:|:----------:|------------|
| Mobbin website | Limited browsing | Full | Included | Included | User session |
| Mobbin MCP | **No** | **Yes** | **Yes** | **Yes** | Browser OAuth |
| Mobbin REST API | No | No | Yes | Yes | Workspace API key |

**[CONFIRMED: docs.mobbin.com/mcp/introduction, /overview, /api/quickstart, mobbin.com/pricing]**

- No reviewed source documents different MCP tool sets per paid tier — do not invent per-tool tier gates.
- The exact Free-account MCP denial behavior (status/payload/UX) is **UNVERIFIED** — state "MCP starts at Pro" without guessing failure semantics.
- Per-plan usage caps within eligible tiers (searches/day, screens/query, whether the ~15 `limit` ceiling is plan-derived) are **undocumented** — carry as a caveat, never a claimed matrix.
- Finance+ is a separate paid add-on; whether it changes MCP-returned datasets is **unestablished**.
- The separate REST API (Team/Enterprise, workspace Bearer key, e.g. `POST /v1/screens/search`) must never be conflated with MCP.

**Rate limit** **[CONFIRMED: docs.mobbin.com/rate-limits]**: 60 requests per 60 seconds per user. On 429, honor `Retry-After`, then exponential backoff with jitter. Do not invent finer-grained burst or concurrency contracts.

---

## 5. THE OFFICIAL SKILLS REPOSITORY

`github.com/mobbin/skills` (MIT) is the official skills repository. Its `skills/` tree contains **exactly one skill: `mobbin-search`**, whose SKILL.md is the authoritative usage contract for `search_screens` (inputs, response shape, workflow, visual-analysis guidance, optional board path). The documented install path for clients that want the skill bundle is `npx skills add mobbin/skills` (plus a manual clone/copy path) — this installs **guidance only** and does not replace the MCP manual or OAuth setup. This packet references the repository and deliberately does not vendor it.

---

## 6. OPEN QUESTIONS (UNKNOWN, RUNTIME-ONLY)

These stay UNKNOWN until an operator-authorized, paid, authenticated runtime exists; none can be resolved by authoring, and none blocked this packet's authorship. Note: **auth env-var naming is NOT among them** — no MCP auth env var exists; that question is answered in the negative.

1. **RESOLVED for pre-auth discovery, 2026-07-16** ([`discovery-fixture-2026-07-16.json`](./discovery-fixture-2026-07-16.json)): `list_tools()` and `tool_info()` work WITHOUT OAuth and return three tools with full declared schemas (Section 2). Whether an authenticated session's inventory differs remains unobserved — re-run discovery after operator OAuth.
2. **Adapter round trip** — does the current local Code Mode + `mcp-remote` version complete first-use Mobbin OAuth, token refresh, and reconnect reliably (any extra flags needed)?
3. **RESOLVED 2026-07-16**: the registry/discovery name is `mobbin.mobbin.search_screens` (dot-separated) and the TS callable is `mobbin.mobbin_search_screens(args)` (fixture `Access as:` line) — exactly the convention-predicted pair, now observed.
4. **RESOLVED 2026-07-16**: `deep` is a client-settable input — `mode?: "deep" | "standard" | "fast"` on `search_screens` (see Section 2).
5. **Free-account denial semantics** — what precise status/payload/UX does a Free account receive during MCP authorization or tool use?
6. **Per-plan usage caps** — do searches/day or screens-per-query caps exist within the eligible Pro/Team/Enterprise tiers (is the ~15 `limit` ceiling plan-derived)?
7. **Finance+ coverage** — does the Finance+ add-on change the dataset returned through standard MCP search?
8. **Inline-image fidelity through Code Mode** — does `call_tool_chain` faithfully pass the inline image content blocks, or does visual inspection need a side-channel? (Verify at install.)
9. **Paid-gate edge cases** — are there account/workspace edge cases within the documented Pro/Team/Enterprise gate requiring more specific packet error messages?
10. **RESOLVED 2026-07-16**: the live `search_screens` schema exposes `mode`, `exclude_screen_ids`, and `image_format` beyond `query`/`platform`/`limit` (Section 2). Remaining sub-question: whether the declared output (`{ query, screens[] }`, no `index`/`failed[]`) matches actual authenticated responses.

---

## 7. RELATED RESOURCES

- [mcp-wiring.md](mcp-wiring.md) - the registered manual, mcp-remote bridge, OAuth/DCR/PKCE, fixture-observed registry/TypeScript naming, and the discovery-first contract.
- [troubleshooting.md](troubleshooting.md) - symptom, cause, and fix for the common failure modes.
- [utcp-mobbin-manual.md](../assets/utcp-mobbin-manual.md) - the registered manual's reference shape and post-registration checklist (discovery complete; authenticated OAuth and calls pending).
- [SKILL.md](../SKILL.md) - the runtime contract this reference supports.
