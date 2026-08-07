# Mobbin MCP Developer Surface — Canonical Fan-Out Research Synthesis

> **Fan-out header** — Deep-research fan-out, 3 detached lineages, 10 total iterations, run `1784199634206-lfqjyo`:
> **sol** (5 iterations, gpt-5.6-sol xhigh) · **glm** (2 iterations, glm-5.2) · **luna** (3 iterations, gpt-5.6-luna max).
> Stop policy: `max-iterations` (convergence threshold 0.05 was telemetry-only; no lineage synthesized early).
> All three lineages completed on the **first attempt** — zero failed/salvaged/orphaned lineages
> [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/orchestration-summary.json] [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/fanout-attribution.md].
>
> **Topic:** the official Mobbin MCP server (github.com/mobbin/mobbin-mcp-server) — tool surface, auth/API-key model, transport, install; the official Mobbin skills repo (github.com/mobbin/skills); app/screen/flow/element design-research workflows; plan gating — as authoring inputs for the `mcp-mobbin` transport packet (read-only, Code Mode only, mandatory `sk-design` judgment pairing) plus a NEW `mobbin` manual for `.utcp_config.json`.

---

## 1. Executive Summary

Mobbin's official design-reference MCP is a **hosted remote server at `https://api.mobbin.com/mcp` over Streamable HTTP** — there is no local package to install; the official repository (`mobbin/mobbin-mcp-server`, manifest name `com.mobbin/mobbin` v1.0.1) contains registration/metadata artifacts only [SOURCE: https://github.com/mobbin/mobbin-mcp-server] [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json]. Authentication is **browser OAuth** (protected-resource discovery, Dynamic Client Registration, authorization-code + PKCE S256, `openid` scope) — **no static Mobbin API key exists for MCP**; the API-key Bearer model belongs to the separate Team/Enterprise REST API [SOURCE: https://docs.mobbin.com/mcp/build-an-integration] [SOURCE: https://docs.mobbin.com/api/quickstart]. A live unauthenticated probe returned HTTP 401 with a `WWW-Authenticate` pointer to the protected-resource metadata, confirming the OAuth shape [SOURCE: https://api.mobbin.com/mcp] [SOURCE: https://api.mobbin.com/.well-known/oauth-protected-resource/mcp].

The complete **publicly documented tool baseline is one read tool: `search_screens`** (natural-language `query`; `platform` `ios`|`web`; `limit` default 5, ~15 max guidance). It returns ordered screen metadata (`index`, `id`, `app_name`, `mobbin_url`, `image_url`, `platform`), a `failed[]` list, and inline image content blocks [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]. App, screen, flow, and element research are **query intents over that single tool**, not four tool families. MCP access is documented for **Pro, Team, and Enterprise — not Free** [SOURCE: https://docs.mobbin.com/mcp/introduction], rate-limited to **60 requests per 60 seconds per user** [SOURCE: https://docs.mobbin.com/rate-limits].

For this repository: author `mcp-mobbin` as a non-mutating transport packet (`packetKind: "transport"`, `mutatesWorkspace: false`, Code Mode only) with mandatory `sk-design` pairing, and register one `mobbin` manual in `.utcp_config.json` that bridges the remote HTTP/OAuth service through a local `npx -y mcp-remote` stdio adapter with an **empty `env`** — no credential of any kind in config or `.env` [SOURCE: file:.utcp_config.json:147] [SOURCE: https://github.com/geelen/mcp-remote]. The exact authenticated `tools/list` inventory, live JSON Schema, and Code Mode callable name remain runtime UNKNOWNs (§17).

## 2. Background

Mobbin is "the world's largest library of real app UI screenshots" [SOURCE: https://github.com/mobbin/skills]. The `mcp-tooling` hub will gain a nested `mcp-mobbin` transport packet (phase 002), hub/registry integration plus the `.utcp_config.json` manual (phase 003), and install/validation (phase 004). The transport retrieves real-world design evidence through Code Mode's `call_tool_chain()`; it never decides taste — `sk-design` owns judgment, mirroring the existing `mcp-figma` transport convention [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md:79] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263]. This Phase-001 research grounds those phases in verified findings rather than assumptions.

## 3. Objectives

1. Establish the official Mobbin MCP endpoint, transport, and install model.
2. Establish the auth/credential model and whether any API key or env var belongs in config.
3. Enumerate the publicly documented MCP tool surface and its I/O contract.
4. Establish plan gating (free vs Pro/Team/Enterprise) and rate limits.
5. Derive app/screen/flow/element design-research workflows from the official skills repo.
6. Produce a paste-ready `mobbin` UTCP manual shape for `.utcp_config.json`.
7. Define the read-only, Code-Mode-only transport-packet contract and `sk-design` pairing.
8. Isolate everything that only an authenticated live run can confirm.

## 4. Methodology

Three detached lineages ran the deep-research loop protocol in parallel under scoped-`CODEX_HOME` launch, each writing only under its bound `lineages/<label>/` artifact root: config/strategy/state init → evidence iterations (state read, convergence-as-telemetry check, source fetches, `iteration-NNN.md`, JSONL delta, reducer refresh) → per-lineage synthesis. Under `stopPolicy: max-iterations`, early convergence signals were treated as telemetry only and each lineage broadened angles instead of stopping (all three would have voted CONTINUE at their final iteration). Evidence was restricted to official Mobbin repositories/docs/endpoints, the `mcp-remote` maintainer repository, direct unauthenticated read-only protocol probes (sol, luna), and local integration contracts (sol, luna). No Mobbin login, OAuth exchange, or authenticated MCP call occurred in any lineage. This document merges the three lineage syntheses; per-claim provenance is preserved and disagreements are kept as `[CONFLICT: ...]`, never averaged.

Lineage source-coverage asymmetry (load-bearing for §5): **glm** fetched only the two GitHub repos, the raw manifests, the raw skill file, and `docs.mobbin.com/mcp` (the Mintlify docs-MCP manifest) — it did **not** fetch the `docs.mobbin.com/mcp/*` documentation pages or local repo contracts, so its auth/gating answers were INFERRED/UNKNOWN by design. **sol** and **luna** additionally fetched the official MCP docs pages, ran live unauthenticated probes, and read local Code Mode/UTCP contracts.

## 5. Cross-Lineage Reconciliation Ledger

Status legend: **MERGED** = independently supported by 2–3 lineages; **[sol only]** / **[glm only]** / **[luna only]** = single-lineage; **[CONFLICT]** = lineages disagree, preserved unresolved or resolved only by strictly stronger evidence (never averaged).

| # | Finding | Lineages | Status |
|---|---------|----------|--------|
| L1 | Endpoint `https://api.mobbin.com/mcp`; hosted remote; no local package/npm executable | sol, glm, luna | MERGED |
| L2 | Provider transport is Streamable HTTP (`server.json` `remotes[]`); not SSE, not stdio | sol, glm, luna | MERGED |
| L3 | Manifest identity `com.mobbin/mobbin` v1.0.1; repo `mcp.json` is a minimal url-only client config | glm, luna | MERGED |
| L4 | `search_screens` is the only publicly documented MCP tool | sol, glm, luna | MERGED |
| L5 | Response = `{screens:[{index,id,app_name,mobbin_url,image_url,platform}], failed:[]}` + ordered inline image blocks | sol, glm, luna | MERGED |
| L6 | Inputs: `query` (natural language), `platform` `ios`\|`web`, `limit` default 5 / ~15 ceiling guidance | sol, glm, luna | MERGED |
| L7 | Auth = browser OAuth: protected-resource metadata, DCR (RFC 7591), PKCE S256, `openid`; access/refresh tokens; revocable (Account Settings → MCP) | sol, luna | MERGED |
| L8 | Live 401 + `WWW-Authenticate: Bearer resource_metadata=".../.well-known/oauth-protected-resource/mcp"` confirmed by direct probe | sol, luna | MERGED |
| L9 | No static MCP API key; `MOBBIN_API_KEY` must NOT appear in manual `env` or `.env` | sol, luna (glm compatible: url-only configs, no key field) | MERGED |
| L10 | Plan gating: MCP on Pro/Team/Enterprise; Free not eligible | sol, luna | MERGED — see C3 |
| L11 | Separate REST API (Team/Enterprise, workspace Bearer key, e.g. `POST /v1/screens/search`) must never be conflated with MCP | sol, luna | MERGED |
| L12 | Rate limit 60 requests / 60 seconds / user; on 429 honor `Retry-After` then exponential backoff | sol, luna | MERGED |
| L13 | UTCP manual: `mobbin` mcp manual, stdio `npx -y mcp-remote https://api.mobbin.com/mcp`, empty `env` (byte-identical JSON drafts) | sol, luna | MERGED — see C1 |
| L14 | Dotted discovery `mobbin.mobbin.search_screens` / callable `mobbin.mobbin_search_screens` is INFERRED until `tool_info()` confirms | sol, glm, luna | MERGED |
| L15 | Packet contract: `packetKind: "transport"`, `mutatesWorkspace: false`, Code Mode only, no Write/Edit/Task; fail closed on any mutation-capable tool discovered live | sol, glm, luna | MERGED |
| L16 | Mandatory `sk-design` cross-hub pairing; transport supplies evidence, never taste/acceptance | sol, glm, luna | MERGED |
| L17 | App/screen/flow/element = query intents over `search_screens`, not four tool families | sol, glm, luna | MERGED |
| L18 | The official skill's optional evidence-board writer is excluded from this transport (read-only boundary) | sol, luna | MERGED |
| L19 | Official skill workflow: derive query from user's words → infer platform → announce plan → call same-turn → visually inspect → answer from evidence (optional board path excluded) | glm, luna (sol compatible: analysis sequence) | MERGED |
| L20 | Two distinct Mobbin MCP servers exist: design-reference at `api.mobbin.com/mcp` (packet target) vs Mintlify docs-search at `docs.mobbin.com/mcp` (`search_mobbin_docs`, `query_docs_filesystem_mobbin_docs`, `submit_feedback`) — do not conflate | glm | [glm only] |
| L21 | Repo freshness snapshot 2026-07-16: server repo HEAD `bbee2a6be34d251c580ba80bb8b407c87587aba7` (2026-06-03); skills repo HEAD `9657786338c5e7fed597031982398a8d99681fec` (2026-05-04); `skills/` contains only `mobbin-search` | sol | [sol only] |
| L22 | Live authorization-server metadata (Supabase issuer) publishes authorization/token/registration endpoints + PKCE S256 (also advertises `plain` — use S256 anyway) | sol | [sol only] |
| L23 | `mcp-remote` is HTTP-first with SSE fallback only on HTTP 404; experimental, externally versioned; Node 18+ and working `npx` are prerequisites | sol | [sol only] |
| L24 | Finance+ is a separate paid add-on; its MCP result coverage is unestablished | sol | [sol only] |
| L25 | Official skill bundle install path: `npx skills add mobbin/skills` (guidance only; does not replace the MCP manual or OAuth) | luna | [luna only] |
| L26 | Registry proposal: `backendKind: mobbin-remote-mcp`; transport-axis `transports: ["mcp-figma","mcp-mobbin"]` with `crossHubPairing` both → `sk-design` | luna (sol compatible at contract level) | [luna only] (naming) |
| L27 | Local config authorities: `mcp-code-mode/references/configuration.md` + `scripts/validate_config.py` document `stdio`/`sse` manual shapes (no direct streamable-http shape today) | luna, sol | MERGED |
| C1 | **[CONFLICT: UTCP manual shape]** sol+luna: stdio `mcp-remote` adapter manual (identical JSON, grounded in `.utcp_config.json:147` and Code Mode config docs). glm: a "conceptual" direct `streamable-http` url-only manual — but glm explicitly did not read `.utcp_config.json`. Not averaged. The sol draft is kept EXACTLY in §12; glm's alternative is preserved in §16 Divergence Map. If Code Mode later validates direct Streamable HTTP, sol itself notes the direct URL becomes preferable. | sol+luna vs glm | CONFLICT (stronger-sourced draft adopted) |
| C2 | **[CONFLICT: `deep` search]** glm reads the official skill as exposing a `deep` search **input mode** ("A `deep` search mode exists for complex queries" [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/lineages/glm/iterations/iteration-002.md:37]). sol reads the same SKILL.md as three user-facing inputs only, with deep search being **server-side behavior** ("the skill says the server's deep search handles complex queries" [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/lineages/sol/iterations/iteration-002.md:17]). luna lists query/platform/limit only. Same source, divergent readings — unresolved until `tool_info()` shows the live schema. | glm vs sol (luna silent) | CONFLICT (open — §17 Q4) |
| C3 | **[CONFLICT: plan-gating and auth knowability]** glm marked plan gating UNKNOWN and auth INFERRED-url-only ("possibly anonymous"), from absence of evidence in its narrower source set. sol+luna positively cite `docs.mobbin.com/mcp/introduction` / `build-an-integration` (Pro/Team/Enterprise; OAuth required) plus a live 401 probe. Resolved in favor of sol+luna by strictly stronger, first-party + live evidence — not by averaging. glm's residual caveat survives as §17 Q6 (per-plan usage caps within eligible tiers remain undocumented). | glm vs sol+luna | CONFLICT (resolved by stronger evidence) |

**Counts:** 19 merged findings (L1–L19, L27), 8 single-lineage findings (L20–L26 + glm's docs-MCP tool list within L20), 3 conflicts (C1–C3; one adopted-stronger-draft, one open, one resolved-by-stronger-evidence).

<!-- ANCHOR:findings -->

## 6. Findings: MCP Tool Surface

The complete publicly documented baseline at 2026-07-16 is **one read tool** [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] [SOURCE: https://api.github.com/repos/mobbin/skills/contents/skills]:

| Tool | Posture | Skill-level inputs | Skill-level result |
|------|---------|--------------------|--------------------|
| `search_screens` | Read/search | `query`: natural language; `platform`: `ios` or `web`; `limit`: default 5, normally ≤ ~15 for variety | `screens[]` metadata, `failed[]`, then ordered inline image blocks |

Documented metadata shape:

```text
screens: [{ index, id, app_name, mobbin_url, image_url, platform }]
failed:  []
```

Inline images arrive in the same response after the metadata block, one per `screens[]` entry in the same order — `index` correlates image ↔ app; no second image-download tool exists or should be invented [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md].

`[CONFLICT: deep]` Whether `deep` search is a client-settable input (glm reading) or server-side behavior (sol reading) is unresolved — see §5 C2 and §17 Q4. Do not hardcode a `deep` parameter until `tool_info()` confirms it.

**Completeness boundary** [sol; luna concurs]: the official `skills/` tree contains exactly one skill (`mobbin-search`) naming only `search_screens`; the server repo publishes no implementation or `tools/list` export; the endpoint is auth-protected, so public enumeration is impossible [SOURCE: https://api.github.com/repos/mobbin/skills/contents/skills] [SOURCE: https://api.mobbin.com/mcp]. Therefore: **Confirmed** — `search_screens` is the only public documented tool. **UNKNOWN** — whether authenticated `tools/list` contains only that tool, and its exact JSON Schema. **Not allowed** — inventing `search_apps`, `search_flows`, `search_elements`, detail/image/mutation tools. The packet's read-only guarantee is an authorization boundary: allow only verified read/search tools; if live discovery returns a mutation-capable tool, refuse it and require an explicit reviewed contract change [sol].

**[glm only] Second server disambiguation:** `docs.mobbin.com/mcp` is a *separate* Mintlify docs-search MCP ("Mobbin Docs", transport `http`) exposing `search_mobbin_docs`, `query_docs_filesystem_mobbin_docs` (read-only virtualized docs filesystem: `rg`/`grep`/`tree`/`cat`/`head`/`jq`, 30KB truncation), and `submit_feedback` — the only non-purely-read action anywhere, and it belongs to the docs server, not the design server [SOURCE: https://docs.mobbin.com/mcp]. The `mcp-mobbin` packet targets `api.mobbin.com/mcp` only.

## 7. Findings: Transport + Install

| Concern | Contract | Packet implication |
|---------|----------|--------------------|
| Server URL | `https://api.mobbin.com/mcp` | Single remote endpoint [all 3] |
| Provider transport | Streamable HTTP (`server.json` `remotes:[{type:"streamable-http",...}]`) | Never describe Mobbin itself as stdio or SSE [all 3] |
| Provider install | None — hosted service; repo is metadata-only (README, `mcp.json`, `server.json`, `rules/`, `.cursor-plugin/`) | Do not clone/build/install a Mobbin server [all 3] |
| Local adapter | `mcp-remote` launched over stdio via `npx -y` | Bridges remote HTTP/OAuth into the current Code Mode stdio manual shape [sol, luna] |
| Runtime | Node.js 18+ and working `npx` | Doctor-check both before OAuth [sol only] |
| Network | Outbound HTTPS plus localhost OAuth callback | Headless sessions need operator-visible escalation [sol only] |

[SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json] [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json] [SOURCE: https://docs.mobbin.com/mcp/clients/other] [SOURCE: https://github.com/geelen/mcp-remote]

[sol only] `mcp-remote` defaults to HTTP-first and falls back to SSE only on HTTP 404; Mobbin requires Streamable HTTP, so no forced-SSE flag is needed. The adapter self-describes as experimental and is externally versioned — static compatibility does not equal a completed local OAuth/discovery run [SOURCE: https://github.com/geelen/mcp-remote#transport-strategies].

[sol only] Freshness: server repo HEAD `bbee2a6be34d251c580ba80bb8b407c87587aba7` (2026-06-03); skills repo HEAD `9657786338c5e7fed597031982398a8d99681fec` (2026-05-04) [SOURCE: https://api.github.com/repos/mobbin/mobbin-mcp-server/commits?per_page=1] [SOURCE: https://api.github.com/repos/mobbin/skills/commits?per_page=1].

## 8. Findings: Auth / API-Key Model

**Browser OAuth; no API key.** On first use the client opens a browser, the user signs in and authorizes, and the client receives OAuth access/refresh tokens. Custom integrations use OAuth protected-resource metadata, Dynamic Client Registration (RFC 7591), authorization-code flow with PKCE S256, and the `openid` scope. Client access is revocable from Mobbin Account Settings → MCP [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration] [SOURCE: https://docs.mobbin.com/mcp/disconnect] [sol, luna].

Live unauthenticated probe evidence [sol, luna]:

```text
HTTP 401
WWW-Authenticate: Bearer resource_metadata="https://api.mobbin.com/.well-known/oauth-protected-resource/mcp"
{"error":{"code":"unauthorized","message":"Missing or invalid Authorization header"}}
```

The protected-resource document names resource `https://api.mobbin.com/mcp`, the Supabase authorization server, and `openid`; [sol only] the authorization-server metadata publishes authorization/token/registration endpoints plus PKCE S256 (and also advertises `plain` — use S256 regardless) [SOURCE: https://api.mobbin.com/.well-known/oauth-protected-resource/mcp] [SOURCE: https://ujasntkfphywizsdaapi.supabase.co/auth/v1/.well-known/oauth-authorization-server].

glm independently converged on "no static client key" from the url-only configs alone (marked INFERRED in its lineage) [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/mcp.json]; its "possibly anonymous" default assumption is superseded by the sol/luna live 401 evidence (§5 C3).

**Security rules for the packet** [sol; luna concurs]:

- Keep manual `env` empty; never add `MOBBIN_API_KEY`, the REST workspace key, tokens, or a client secret to `.utcp_config.json` or `.env`. **There is no auth env var to name — that question is answered in the negative, not open.**
- Never accept credentials in prompts/tool arguments; never print Authorization headers, OAuth codes, token responses, adapter debug logs, or auth-cache contents.
- Treat adapter auth state as operator-owned; never auto-clear it — reauthorization is an explicit operator action [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting].
- Interpret a pre-authorization 401 as the expected protected-resource challenge, not a missing-key error.

## 9. Findings: Plan Gating

| Surface | Free | Pro | Team | Enterprise | Credential |
|---------|:----:|:---:|:----:|:----------:|------------|
| Mobbin website | Limited browsing | Full | Included | Included | User session |
| Mobbin MCP | **No** | **Yes** | **Yes** | **Yes** | Browser OAuth |
| Mobbin REST API | No | No | Yes | Yes | Workspace API key |

[SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/overview] [SOURCE: https://docs.mobbin.com/api/quickstart] [SOURCE: https://mobbin.com/pricing] [sol, luna; glm marked UNKNOWN from its narrower source set — §5 C3]

- No reviewed source documents different MCP tool sets per paid tier — do not invent per-tool tier gates [sol].
- Exact Free-account MCP denial behavior (status/payload/UX) is UNVERIFIED — the packet should state "MCP starts at Pro" without guessing failure semantics [sol, glm].
- [glm only, residual caveat] Per-plan usage caps within eligible tiers (searches/day, screens/query) are undocumented; carry as an install-guide caveat, not a claimed matrix.
- [sol only] Finance+ is a separate paid add-on; whether it changes MCP-returned datasets is unestablished [SOURCE: https://mobbin.com/pricing].
- **Rate limit** [sol, luna]: 60 requests per 60 seconds per user; 429 includes `Retry-After` — honor it, then exponential backoff with jitter [SOURCE: https://docs.mobbin.com/rate-limits].

## 10. Findings: Design-Research Search Workflows

There are **not** four documented tool families — app, screen, flow, and element research are intent-specific query designs over `search_screens` [all 3] [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]:

- **App research** — name the app/company/category and comparison goal ("banking apps onboarding identity verification"); compare `app_name`, platform, structure, visible patterns. Multiple results are evidence, not a design chooser.
- **Screen research** — name the concrete screen/state/job ("iOS subscription cancellation confirmation", "web empty-state dashboard"); start at 5 results; cite each `mobbin_url` used.
- **Flow research** — describe the journey and target step ("first-run onboarding progression", "forgot-password recovery"). The public contract returns screens, not an ordered flow object — reconstruct sequence only when visual evidence supports it and label reconstruction as inference.
- **Element research** — name component + context/state ("bottom-sheet destructive confirmation", "inline validation on signup"); analyze element behavior within returned screens; never fabricate an element-detail tool.

Official skill operating sequence [glm, luna; sol's analysis sequence concurs]: derive query terms from the user's actual words → infer `ios` vs `web` from app context (unclear → ask) → announce a short search plan → call `search_screens` in the same turn → visually inspect returned references (observe content/structure/styling/interaction; compare repeats and meaningful differences; synthesize principles) → answer from evidence tied to returned screens. The skill's optional evidence-board path is **excluded** from this transport (§13).

Context discipline [sol]: start `limit: 5`; ask before widening materially (do not exceed ~15 just for variety); report `failed[]` and missing images as partial success, never silently discard; retain `mobbin_url` as provenance for every selected reference.

## 11. Findings: Mobbin Skills Repo Structure

`github.com/mobbin/skills` (MIT) is the official skills repository. Its `skills/` tree contains **exactly one skill: `mobbin-search`**, whose SKILL.md is the authoritative usage contract for `search_screens` (inputs, response shape, workflow, visual-analysis guidance, optional board path) [SOURCE: https://github.com/mobbin/skills] [SOURCE: https://api.github.com/repos/mobbin/skills/contents/skills] [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md]. [sol only] Latest observed commit `9657786338c5e7fed597031982398a8d99681fec`, 2026-05-04. [luna only] Documented install path for clients that want the skill bundle: `npx skills add mobbin/skills` (plus a manual clone/copy path) — this installs guidance only and does not replace the MCP manual or OAuth setup [SOURCE: https://github.com/mobbin/skills].

## 12. Findings: DRAFT `mobbin` UTCP Manual for `.utcp_config.json`

**Adopted draft: the sol lineage's manual, kept EXACTLY as authored** (strongest-sourced: grounded in `file:.utcp_config.json:147`, `file:.opencode/skills/mcp-code-mode/references/configuration.md:162`/`:468`, and the `mcp-remote` maintainer repo). luna independently produced a **byte-identical** JSON draft. Phase 002 ships it as a paste-ready asset; phase 003 adds it to `manual_call_templates[]`:

```json
{
  "name": "mobbin",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "mobbin": {
        "transport": "stdio",
        "command": "npx",
        "args": [
          "-y",
          "mcp-remote",
          "https://api.mobbin.com/mcp"
        ],
        "env": {}
      }
    }
  }
}
```

[SOURCE: file:.utcp_config.json:147] [SOURCE: file:.opencode/skills/mcp-code-mode/references/configuration.md:162] [SOURCE: https://docs.mobbin.com/mcp/clients/other] [SOURCE: https://github.com/geelen/mcp-remote]

`[CONFLICT: manual shape]` glm sketched a direct `streamable-http` url-only manual instead, but explicitly did not read `.utcp_config.json` and labeled its shape "conceptual" — preserved in §16, not adopted. The local Code Mode config surface documents `stdio`/`sse` shapes only [luna: `file:.opencode/skills/mcp-code-mode/scripts/validate_config.py`; sol: configuration.md], so the stdio + `mcp-remote` bridge is the compatible current shape; if Code Mode later accepts direct Streamable HTTP, prefer the direct URL after validating its OAuth behavior [sol, luna].

**Calling convention** [sol, luna]: mandatory discovery-first sequence — `list_tools()` or `search_tools({ task_description: "Mobbin screen design research", limit: 10 })` → filter to the `mobbin` manual → `tool_info()` on the exact dotted name → only then `call_tool_chain({ code })`. Convention predicts dotted discovery `mobbin.mobbin.search_screens` and callable `mobbin.mobbin_search_screens(...)` (mirroring `clickup.clickup_*`), but both are **INFERRED until live discovery** [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:252] [SOURCE: file:.opencode/skills/mcp-code-mode/references/naming_convention.md]. Illustrative call (schema unconfirmed until `tool_info()`):

```typescript
call_tool_chain({
  code: `
    const result = await mobbin.mobbin_search_screens({
      query: "iOS banking app onboarding identity verification",
      platform: "ios",
      limit: 5
    });
    return { success: true, data: result, errors: [], timestamp: new Date().toISOString() };
  `
});
```

No `.env` line is required for this manual — there is no static MCP API key [sol, luna].

## 13. Findings: Transport-Packet Authoring Inputs (Phase 002/003)

**Permission surface** [sol; luna's allowed/forbidden contract concurs]: `Read, Glob, Grep, mcp__code_mode__list_tools, mcp__code_mode__search_tools, mcp__code_mode__tool_info, mcp__code_mode__call_tool_chain`. Never Write/Edit/Task/Bash-for-remote-calls, never a direct Mobbin MCP tool; the remote path is Code Mode only.

**Registry/hub contract** [sol, luna]:

- `workflowMode: "mcp-mobbin"`, `packetKind: "transport"`, `routingClass: "metadata"`, `toolPolicy.mutatesWorkspace: false`
- `backendKind`: a consistent Mobbin Code Mode discriminator — [luna only] proposes `mobbin-remote-mcp`
- `extensions.transport-axis.transports[]` gains `mcp-mobbin`; `crossHubPairing: mcp-mobbin -> sk-design` (alongside `mcp-figma -> sk-design`) [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json] [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md:79]

**Hard boundaries** [all 3]: no `.mobbin` evidence-board writes, no asset downloads into the workspace, no spec modification, no non-Code-Mode fallback; results (metadata, Mobbin URLs, image URLs, inline images) are ephemeral context. Any write-capable tool discovered at runtime is excluded from the route and reported as an integration risk.

**Phase 002 packet inventory** [sol]: `SKILL.md`, `README.md`, `INSTALL_GUIDE.md` (Node/npx, manual snippet, first-use OAuth, discovery verification — no provider server install), `assets/` (the §12 manual, no secret template), `references/` (mcp_wiring with remote-HTTP-vs-stdio-adapter and confirmed/inferred labels; tool_surface with the single-tool baseline + live UNKNOWNs; workflows with §10 recipes; troubleshooting per the risk table below), `feature_catalog/` (read-only), `scripts/` (non-mutating doctor helpers printing no auth state), `manual_testing_playbook/` (positive routing, ≥2 holdouts, deterministic vs paid-live splits), `mcp-servers/mobbin-mcp/README.md` (hosted provider, no local source), changelog + `package_skill.py --check` [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md:70].

**Phase 003** [sol]: registry entry, transport-axis + pairing edge, narrow router signals (Mobbin/app-screen-flow-element design-reference research) plus holdouts, parent SKILL/README/description/graph metadata + hub changelog/playbook, paste the `mobbin` manual into `.utcp_config.json` once, regenerate the advisor skill graph [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/003-hub-integration/spec.md:68].

**Validation split** [sol, luna]: deterministic no-account checks (manual JSON parse, endpoint/adapter/empty-env assertions, no-credential assertions, fixture the skill-level contract as skill-level not live schema, negative fixtures rejecting invented tools and pre-discovery callable guesses, routing holdouts vs Figma/browser/sk-design/other MCP) versus operator-authorized paid live checks (OAuth, dated `list_tools()`/`tool_info()` capture, one `limit: 1` smoke search, app/flow/element intent queries staying screen-search-shaped, partial-image visibility, safe 429 observation, drift → fail-closed packet update). Paid/OAuth scenarios must support `SKIP` with the missing entitlement stated.

**Troubleshooting/risk inputs** [sol; glm risks merged]:

| Symptom/risk | Interpretation | Safe action |
|---|---|---|
| 401 before auth | Expected protected-resource challenge | Complete browser OAuth; do not add an API key |
| Browser/callback fails | Headless session, port, timeout | Move to interactive session; never ask for token paste |
| No `mobbin.*` tools | Manual load/start/auth/plan failure | Validate JSON, Node/npx, restart, OAuth, then eligibility |
| Name/schema mismatch | Provider/adapter drift | Re-run discovery; fail closed; update reviewed docs |
| 429 | 60/60s window exceeded | Honor `Retry-After`; backoff with jitter |
| Free account blocked | Entitlement boundary | Explain MCP starts at Pro; do not guess exact semantics |
| Inline images through `call_tool_chain` unverified [glm] | May need a side-channel for visual inspection | Verify at install (phase 003/004) |
| Unpinned experimental adapter [sol]; auth drift to client keys [glm] | Compatibility drift | Smoke-test after dependency change; re-verify at install and on Mobbin releases |
| Large image responses | Context pressure | Default 5; metadata-first; widen deliberately |
| Unexpected mutation tool | Provider surface expanded | Refuse; read-only packet requires contract review |

## 14. Findings: `sk-design` Pairing Implications

`mcp-mobbin` is evidence transport, not a design authority [all 3]. Pairing lifecycle for design-affecting research [sol]:

1. `sk-design` gathers goal, surface, inputs, constraints, proof expectations.
2. It selects the smallest design-judgment mode (interface, foundations, motion, or audit).
3. `mcp-mobbin` retrieves cited screens through Code Mode.
4. Results return to the selected judgment mode.
5. `sk-design` — not transport rank or images alone — owns taste, accessibility, responsive, and readiness decisions.

When a user asks what to choose, what looks distinctive, whether a pattern is appropriate, or how to turn references into a direction, the relevant `sk-design` workflow loads and Mobbin results serve as evidence; the transport never independently decides palette, typography, hierarchy, or interaction direction [luna]. Pure setup/doctor or factual tool-surface reporting makes no design verdict, but the registry still declares the pairing [sol]. Guard against "design copied or generic": cite evidence, use `sk-design` critique, never copy wholesale [sol] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263] [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md].

## 15. Consolidated Recommendations

1. Treat `search_screens` as the only stable documented tool; make live discovery the runtime authority; fail closed on drift or mutation-capable surfaces [all 3].
2. Register exactly one `mobbin` manual using the §12 stdio `mcp-remote` bridge with empty `env`; no credential anywhere in config or `.env` [sol, luna].
3. Document Node 18+, `npx`, outbound HTTPS, browser/localhost OAuth, and paid-account prerequisites; keep auth state operator-owned [sol].
4. Separate website / OAuth-MCP / API-key-REST entitlements everywhere; target `api.mobbin.com/mcp`, never `docs.mobbin.com/mcp` [sol, luna, glm].
5. Route app/flow/element intents through semantic screen searches; never manufacture tool families or structured flow semantics [all 3].
6. Keep limits small, preserve result/image ordering and `failed[]`, cite `mobbin_url`, honor 429 `Retry-After` [sol, luna].
7. Make `mcp-mobbin` transport owner and `sk-design` judgment owner; transport output is evidence, not acceptance [all 3].
8. Split deterministic packet/hub tests from operator-authorized paid OAuth smoke tests; carry glm's install caveats (image path through `call_tool_chain`, per-plan caps) into the install guide [sol, glm, luna].

<!-- /ANCHOR:findings -->

<!-- ANCHOR:eliminated-alternatives -->
## Eliminated Alternatives

| Alternative | Reason eliminated | Evidence | Lineage(s) |
|---|---|---|---|
| Static `MOBBIN_API_KEY` (or any API-key env var) for MCP | MCP uses browser OAuth; no manual key setup exists | [SOURCE: https://docs.mobbin.com/mcp/introduction] [SOURCE: https://docs.mobbin.com/mcp/build-an-integration] | sol, luna |
| Reuse the REST workspace key for MCP | REST and MCP are separate surfaces, plans, and credentials | [SOURCE: https://docs.mobbin.com/overview] [SOURCE: https://docs.mobbin.com/api/quickstart] | sol, luna |
| Clone/install a local Mobbin server (stdio/npm package) | Official repo declares a hosted remote; no runtime package or launch command published | [SOURCE: https://github.com/mobbin/mobbin-mcp-server] [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json] | sol, glm, luna |
| Describe Mobbin itself as stdio or register it as SSE | Provider transport is Streamable HTTP; stdio belongs to the local adapter only | [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json] [SOURCE: https://docs.mobbin.com/mcp/clients/other] | sol, luna |
| Direct unproven Code Mode HTTP manual | Current local config surface documents stdio/sse shapes; hosted-OAuth precedent uses `mcp-remote` | [SOURCE: file:.utcp_config.json:147] [SOURCE: file:.opencode/skills/mcp-code-mode/scripts/validate_config.py] | sol, luna (vs glm — §5 C1) |
| Separate app/flow/element/detail/image tool families | Official skill names only `search_screens`; dimensions are query intents | [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] | sol, glm, luna |
| Free as a limited MCP tier | MCP begins at Pro; Free browsing is a different product surface | [SOURCE: https://docs.mobbin.com/mcp/introduction] | sol, luna |
| Per-tool Pro/Team/Enterprise gating claims | No reviewed source documents paid-tier tool differences | [SOURCE: https://docs.mobbin.com/overview] | sol |
| Evidence-board (`.mobbin`) writes inside the transport | Board creation is optional upstream and violates the non-mutating packet boundary | [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/002-skill-authoring/spec.md:81] [SOURCE: https://raw.githubusercontent.com/mobbin/skills/main/skills/mobbin-search/SKILL.md] | sol, luna |
| Guessing `mobbin.mobbin_search_screens` without discovery | Code Mode requires `list_tools`/`tool_info` before calls | [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:256] | sol, luna |
| Treating the public catalog as the authenticated `tools/list` | Protected endpoint prevents public enumeration | [SOURCE: https://api.mobbin.com/mcp] | sol, luna |
| Treating transport results as taste authority | `sk-design` owns judgment and acceptance | [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263] | sol, glm, luna |
| Auto-clearing adapter auth state | Destructive to operator-owned sessions | [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting] | sol |
| Targeting `docs.mobbin.com/mcp` as the design-reference server | It is a separate Mintlify docs-search server; design references live at `api.mobbin.com/mcp` | [SOURCE: https://docs.mobbin.com/mcp] [SOURCE: https://raw.githubusercontent.com/mobbin/mobbin-mcp-server/main/server.json] | glm |
| Reading auth/gating/tool-list from the server-repo README alone | READMEs omit all three; canonical sources are docs pages + raw manifests + the consuming skill | [SOURCE: https://github.com/mobbin/mobbin-mcp-server] | glm |
| Hardcoding a complete authenticated tool inventory | Public sources do not expose authenticated `tools/list` schemas | [SOURCE: https://github.com/mobbin/mobbin-mcp-server] | luna |
<!-- /ANCHOR:eliminated-alternatives -->

<!-- ANCHOR:divergence-map -->
## Divergence Map

Cross-lineage view: where the three lineages probed, agreed, diverged, and where the frontier remains.

| Direction | Lineage coverage | Resolution | Remaining frontier |
|---|---|---|---|
| API key vs OAuth | sol+luna (docs + live 401/metadata probes); glm (url-only configs, INFERRED) | Saturated: OAuth/DCR/PKCE S256; no static key. glm's weaker "possibly anonymous" reading superseded by live evidence (§5 C3) | Paid local OAuth round trip |
| Local package vs hosted server | All 3 | Saturated: hosted Streamable HTTP; repo is metadata-only | None for architecture |
| One tool vs app/flow/element families | All 3 | Saturated for the public contract: one skill, one tool | Authenticated live-list drift |
| `deep` search: input parameter vs server behavior | glm (input mode) vs sol (server-side); luna silent | **[CONFLICT: unresolved]** — same SKILL.md, divergent readings (§5 C2) | `tool_info()` on the live schema |
| UTCP manual shape: stdio `mcp-remote` bridge vs direct streamable-http | sol+luna (identical stdio drafts, local-config-grounded) vs glm (conceptual url-only, did not read `.utcp_config.json`) | **[CONFLICT: stronger-sourced draft adopted]** — sol's manual kept exactly (§12); direct-HTTP preferred only if Code Mode later validates it | End-to-end local OAuth/refresh through `mcp-remote` |
| Free vs paid eligibility | sol+luna (documented gate) vs glm (UNKNOWN) | Saturated for eligibility: Free excluded, Pro/Team/Enterprise included | Exact Free denial payload; per-plan caps within eligible tiers [glm caveat] |
| MCP vs REST API | sol, luna | Saturated: OAuth MCP vs Team/Enterprise workspace-key REST | None for manual design |
| Design-reference server vs docs server | glm only | Two-server disambiguation established | None; packet targets `api.mobbin.com/mcp` |
| Transport vs judgment authority | All 3 | Saturated: non-mutating transport, `sk-design` pairing | Downstream registry/playbook proof |
| Inline images through Code Mode | glm only (risk flagged) | Unverified | Install-time verification (phase 003/004) |
| Finance+ coverage | sol only | Public sources exhausted | Provider/paid runtime evidence |
| Repo freshness / drift baseline | sol only | Dated commit hashes captured 2026-07-16 | Re-check at install |

No lineage produced a formal divergent-mode pivot or Council artifact; breadth came from complementary source sets (glm: manifests + docs-MCP endpoint; luna: docs pages + local contracts; sol: all of the above + live protocol probes + adversarial completeness audit). The remaining frontier is operator-authorized runtime validation, not more unauthenticated searching.
<!-- /ANCHOR:divergence-map -->

<!-- ANCHOR:open-questions -->
## Open Questions

Union across lineages. None blocks phase-002 packet authorship [sol]; all must be carried as explicit UNKNOWNs into the packet's references and install guide. Note: **auth env-var naming is NOT open** — all lineages agree no MCP auth env var exists (§8).

1. **Authenticated tool inventory + schemas** — what exact tool names and JSON Schemas do authenticated `list_tools()` / `tools/list` and `tool_info()` return on the validation date? [sol, glm, luna]
2. **Adapter round trip** — does the current local Code Mode + `mcp-remote` version complete first-use Mobbin OAuth, token refresh, and reconnect reliably (any extra flags needed)? [sol, luna]
3. **Runtime callable name** — is the Code Mode callable exactly `mobbin.mobbin_search_screens`, or does this Code Mode version expose a different prefix/alias? [sol, luna, glm]
4. **`deep` search** — is `deep` a client-settable input parameter (glm reading) or server-side behavior (sol reading)? [CONFLICT: §5 C2] [glm, sol]
5. **Free-account denial semantics** — what precise status/payload/UX does a Free account receive during MCP authorization or tool use? [sol, glm]
6. **Per-plan usage caps** — do searches/day or screens-per-query caps exist within the eligible Pro/Team/Enterprise tiers (is the ~15 `limit` ceiling plan-derived)? [glm]
7. **Finance+ coverage** — does the Finance+ add-on change the dataset returned through standard MCP search? [sol]
8. **Inline-image fidelity through Code Mode** — does `call_tool_chain` faithfully pass the inline image content blocks, or does visual inspection need a side-channel? [glm]
9. **Paid-gate edge cases** — are there account/workspace edge cases within the documented Pro/Team/Enterprise gate requiring more specific packet error messages? [luna]
10. **Live schema extras** — does the live `search_screens` schema expose optional fields beyond `query`/`platform`/`limit`? Do not assume them until `tool_info()` confirms. [luna, glm]
<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:convergence-report -->
## Appendix: Convergence Report

- **Stop reason (all lineages):** `maxIterationsReached` — forced depth under `stopPolicy: max-iterations`; the 0.05 convergence threshold was telemetry-only and never terminated a lineage early.
- **Total iterations:** 10 across 3 lineages; merged registry records 10 key findings, composite convergenceScore 0.458 [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/deep-research-findings-registry.json].
- **Launch:** detached parallel fan-out under scoped `CODEX_HOME`; 3/3 lineages succeeded, 0 failed, 0 orphaned, 0 salvaged — **all first-attempt** [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/orchestration-summary.json] [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/fanout-attribution.md].

| Lineage | Model | Iterations | Wall time | Final/telemetry convergence | newInfoRatio trend | Failed attempts |
|---------|-------|-----------:|----------:|----------------------------:|--------------------|----------------:|
| sol | gpt-5.6-sol xhigh | 5 | 23.9 min | 0.58 (last-3 rolling avg 0.76; MAD floor 0.089) | 1.00, 0.93, 0.88, 0.82, 0.58 | 0 |
| glm | glm-5.2 | 2 | 11.6 min | 0.175 composite (would NOT have voted STOP) | 1.00, 0.85 | 0 |
| luna | gpt-5.6-luna max | 3 | 20.9 min | 0.62 (rolling avg 0.79) | 0.95, 0.80, 0.62 | 0 |

- **Question coverage:** sol 5/5 to the public/static evidence boundary; glm 4/6 resolved (1 INFERRED, 1 UNKNOWN — both since resolved by sol/luna evidence, §5 C3); luna 7/7 research questions with 3 runtime gates remaining.
- **Interpretation:** every lineage's telemetry stayed far above the 0.05 threshold at its cap (signals would have continued), confirming the "broaden angles, don't synthesize early" behavior was honored. Breadth was achieved through complementary source sets rather than divergent-mode pivots; no Council artifacts were produced.
- **Known telemetry anomaly:** the glm state log carries 5 post-window timestamps (synthesis records written ~13:05–13:15Z against an 11:00–11:12Z execution window) — a bookkeeping anomaly only; no execution failure [SOURCE: file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/orchestration-summary.json].
- **Residual frontier:** 10 open questions (above), all requiring an operator-authorized, paid, authenticated runtime — none blocking phase-002 authorship.
- **Confidence:** high for endpoint/transport/OAuth/plan-gate/rate-limit/public-tool-surface/local-architecture; medium for `mcp-remote` adapter compatibility; unknown for authenticated live schema and paid-runtime behavior.

### References

- Fan-out attribution: `file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/fanout-attribution.md`
- Merged findings registry: `file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/deep-research-findings-registry.json`
- Orchestration summary: `file:.opencode/specs/mcp-tooling/010-mcp-mobbin/001-research/research/orchestration-summary.json`
- Lineage syntheses: `lineages/sol/research.md`, `lineages/glm/research.md`, `lineages/luna/research.md`
- Lineage resource maps: `lineages/sol/resource-map.md`, `lineages/luna/resource-map.md` (glm emitted none)
- Consolidated source inventory: `./resource-map.md` (sibling document)

Primary external sources (merged; full per-source detail in `resource-map.md`): https://github.com/mobbin/mobbin-mcp-server (+ raw `mcp.json`, `server.json`) · https://github.com/mobbin/skills (+ raw `skills/mobbin-search/SKILL.md`) · https://docs.mobbin.com/mcp/introduction · /mcp/build-an-integration · /mcp/clients/other · /mcp/clients/overview · /mcp/disconnect · https://docs.mobbin.com/overview · /api/quickstart · /rate-limits · https://docs.mobbin.com/mcp (docs-MCP manifest) · https://mobbin.com/mcp · https://mobbin.com/pricing · https://api.mobbin.com/mcp · https://api.mobbin.com/.well-known/oauth-protected-resource/mcp · https://ujasntkfphywizsdaapi.supabase.co/auth/v1/.well-known/oauth-authorization-server · https://github.com/geelen/mcp-remote · GitHub API commit/tree probes. Local sources: `.utcp_config.json`, `mcp-code-mode` SKILL/configuration/naming/validate_config.py, `mcp-tooling` SKILL/mode-registry/`mcp-figma`, `sk-design` SKILL, phase 002/003 specs.
<!-- /ANCHOR:convergence-report -->
