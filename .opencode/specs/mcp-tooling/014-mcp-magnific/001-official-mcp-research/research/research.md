# Research: Official Magnific MCP contract

Phase 1 evidence synthesis for `mcp-magnific`. Every load-bearing claim below carries a source
(`evidence/<file>`) and a confidence. Date of evidence: 2026-08-02.

---

## 1. Executive Summary

| Aspect | Verdict | Confidence |
|--------|---------|------------|
| Endpoint | `https://mcp.magnific.com` (root path, no sub-path) | Confirmed (wire + official docs) |
| Transport | MCP **streamable HTTP** (POST-only, JSON; 405 on GET with `allow: POST`) | Confirmed (wire) |
| Authentication | **OAuth 2.0**, Keycloak realm `auth.magnific.com/realms/mcp`; Bearer token in `Authorization` header | Confirmed (wire + official docs) |
| Auth flow shape | Browser-based authorization-code + PKCE (S256); device-code grant also advertised by the server | Confirmed (server metadata) |
| Anonymous access | None — `initialize` and `tools/list` both return 401 without a token | Confirmed (wire) |
| Tool surface | ~34 documented tools across account, creations, image, video, audio, 3D, custom references, folders/Spaces, discovery | Official docs (live schemas auth-blocked) |
| Credits | MCP shares the account credit balance; generation/transformation/training consume credits | Official docs + product page |
| Code Mode topology | `npx -y mcp-remote https://mcp.magnific.com` (stdio) — matches existing remote transports | Recommended (see §6) |

**Implementation gate:** Phase 2 can freeze transport classification, auth contract, safety gates, and
bridge choice from this document alone. Live tool *schemas* remain `UNKNOWN` until an
operator-authenticated session exists (Phase 3).

---

## 2. Source Matrix

| # | Claim | Source | Evidence | Confidence |
|---|-------|--------|----------|------------|
| S1 | Endpoint is `https://mcp.magnific.com` | Official docs; product page; wire probe | `evidence/07-official-docs-mcp.md`, `evidence/06-official-landing-page.md`, `evidence/01-endpoint-get-405.txt` | Confirmed |
| S2 | Server speaks streamable HTTP MCP | Official docs ("streamable HTTP MCP transport"); wire behavior (POST-only, JSON-RPC-style 401 body, `Mcp-Session-Id` compatible flow) | `evidence/07`, `evidence/01`, `evidence/02` | Confirmed |
| S3 | OAuth 2.0 with Magnific account; browser prompt on first connect; session persists | Official docs (getting-started + authentication sections) | `evidence/07` | Confirmed |
| S4 | Protected-resource metadata at `/.well-known/oauth-protected-resource` | Official docs + live fetch | `evidence/07`, `evidence/04-oauth-protected-resource.json` | Confirmed |
| S5 | Authorization-server metadata at `/.well-known/oauth-authorization-server` | Official docs + live fetch | `evidence/07`, `evidence/05-oauth-authorization-server.json` | Confirmed |
| S6 | Auth server is Keycloak realm `https://auth.magnific.com/realms/mcp` | Live metadata (issuer, endpoints) | `evidence/04`, `evidence/05` | Confirmed |
| S7 | PKCE S256 supported; code-challenge methods `plain`,`S256` | Live metadata | `evidence/05` | Confirmed |
| S8 | Device-code grant advertised (`urn:ietf:params:oauth:grant-type:device_code` + device endpoint) | Live metadata | `evidence/05` | Confirmed |
| S9 | Bearer methods: header only; scopes `openid profile email mcp:custom-audience` (+`offline_access`) | Live metadata | `evidence/04` | Confirmed |
| S10 | No anonymous access: `initialize` and `tools/list` return 401 `Unauthenticated.` | Wire probes | `evidence/02-initialize-401.txt`, `evidence/03-tools-list-401.txt` | Confirmed |
| S11 | Tool names are stable across clients and referenceable in prompts | Official docs (Available tools) | `evidence/07` | Confirmed (docs) — re-verify per session via live `tools/list` |
| S12 | MCP shares the account credit balance; no API key needed | Official docs (intro + FAQ) | `evidence/07` | Confirmed |
| S13 | Generation and transformation actions consume credits | Product page (parent spec record); docs "uses your existing credits" | `evidence/06`, `evidence/07` | High (per-tool exact cost unknown) |
| S14 | Setup path: Magnific account → add `https://mcp.magnific.com` in client → approve OAuth | Official docs (Getting started) | `evidence/07` | Confirmed |
| S15 | `mcp-remote` (npm) provides stdio bridge with full OAuth (browser flow, token refresh, `--bearer-token`/`--header`, `--resource` session isolation, `--ignore-tool`) | npm package README (v0.1.38) | `evidence/09-mcp-remote-notes.md` | Confirmed |
| S16 | Code Mode manual templates support `stdio` (command/args) and `sse` (url) MCP transports; repo precedent for OAuth remote servers is `mcp-remote` via stdio | `mcp-code-mode` configuration reference; `.utcp_config.json` (mobbin, refero) | local inventory | Confirmed |

---

## 3. Transport & Authentication Contract (verified)

### 3.1 Transport

- GET `/` → `405 Method Not Allowed`, `allow: POST`, CORS `access-control-allow-headers: Authorization, Content-Type, X-Pikaso-Client` (evidence 01).
- POST with `initialize` JSON-RPC (protocol version 2025-03-26) without a token → `401` with
  `www-authenticate: Bearer error="invalid_token", resource_metadata="https://mcp.magnific.com/.well-known/oauth-protected-resource", scope="openid profile email mcp:custom-audience"` (evidence 02).
- POST `tools/list` without a token → `401 {"message":"Unauthenticated."}` (evidence 03).
- Conclusion: the entire surface is gated behind a Bearer token; there is no anonymous discovery
  path. This is an RFC 9728-style protected resource; clients are expected to discover OAuth
  metadata from the `www-authenticate` challenge or the well-known URLs.

### 3.2 OAuth contract

| Field | Value |
|-------|-------|
| Issuer | `https://auth.magnific.com/realms/mcp` (Keycloak) |
| Authorization endpoint | `.../protocol/openid-connect/auth` |
| Token endpoint | `.../protocol/openid-connect/token` |
| Device endpoint | `.../protocol/openid-connect/auth/device` |
| PKCE | S256 supported |
| Grant types | authorization_code, refresh_token, device_code, client_credentials, others advertised |
| Token binding | DPoP supported (`dpop_signing_alg_values_supported`), TLS client-cert-bound tokens supported |
| Scopes | `openid profile email mcp:custom-audience` (+ `offline_access` advertised) |
| Revocation | `.../protocol/openid-connect/revoke` |

Keycloak deployment (realm `mcp`), browser authorization-code + PKCE is the flow the official docs
describe ("opens a browser window so you can sign in and approve access"). Device-code grant is
advertised by the server and is a viable headless fallback for CLI use. DPoP support means some
clients may be required to bind tokens; `mcp-remote` v0.1.38 supports DPoP on streamable-http
targets (documented in its release notes; verify during Phase 3).

### 3.3 Session persistence

Official docs: after first approval, "the client keeps the session and won't ask you again."
`mcp-remote` stores OAuth state under `~/.mcp-auth/` keyed by server URL (+ `--resource`), and
refreshes tokens automatically.

---

## 4. Tool Inventory (official docs; live schemas pending auth)

Source: `evidence/07-official-docs-mcp.md` "Available tools". Names are documented as stable across
clients. **The docs themselves state the server is the source of truth: live `tools/list` always
reflects the latest set** — a per-session discovery requirement, not a one-time snapshot.

| Group | Tools |
|-------|-------|
| Account | `account_balance`, `project_report` |
| Creations (history) | `creations_search`, `creations_get`, `creations_show`, `creations_wait`, `creation_status`, `creations_request_upload`, `creations_upload`, `creations_finalize_upload`, `creations_move` |
| Image generation/editing | `images_generate`, `images_generate_svg`, `images_to_svg`, `images_upscale`, `images_crop`, `images_resize`, `images_remove_background`, `images_models_list`, `images_models_show` |
| Video | `video_generate`, `video_models_list`, `video_models_show` |
| Audio | `audio_tts`, `audio_voices_list`, `audio_voices_show` |
| 3D | `models3d_generate` |
| Custom references (LoRA-style) | `custom_references_create` (train a Soul character or style), `custom_references_list` |
| Folders & Spaces | `folders_list`, `folders_get`, `folders_create`, `folders_rename`, `folders_delete`, `spaces_list`, `spaces_view` |
| Discovery | `tools_show` (picker UI surface) |

~34 documented tools. No `resources/` or `prompts/` claims are made by the docs page; treat as
`UNKNOWN` until authenticated `tools/list` (and `resources/list`) discovery. `tools_show` is notable:
it surfaces a picker UI and must be evaluated for interactive-session behavior during Phase 3.

---

## 5. Cost, Mutation & Safety Classification

Confidence legend: **V** = verified by official docs/wire; **I** = inferred from tool name +
official statements (generation/transformation consumes credits); **U** = unknown.

| Class | Tools | Confidence | Notes |
|-------|-------|------------|-------|
| Read-only, no-cost surface | `account_balance`, `project_report`, `creations_search`, `creations_get`, `creations_show`, `creations_wait`, `creation_status`, `images_models_list/show`, `video_models_list/show`, `audio_voices_list/show`, `custom_references_list`, `folders_list/get`, `spaces_list`, `spaces_view`, `tools_show` | V (read semantics); I (no-cost) | Balance/history/browse/listing calls; still require auth. `creations_show` renders inline — confirm client-side render has no server spend. |
| Credit-consuming generation | `images_generate`, `images_generate_svg`, `video_generate`, `audio_tts`, `models3d_generate` | I (V that credits are the currency; exact per-call cost U) | Docs: "Everything runs on your Magnific account and uses your existing credits." Product page: generation consumes credits. |
| Credit-consuming transformation | `images_upscale`, `images_crop`, `images_resize`, `images_remove_background`, `images_to_svg` | I | Magnific's core products (upscale/relight/edit) consume credits; exact cost U. |
| Credit-consuming training | `custom_references_create` | I | "Train a Soul character or style" — training is a credit action on the product page; exact cost U. |
| Account/workspace writes (no direct credit spend claimed) | `creations_request_upload`, `creations_upload`, `creations_finalize_upload`, `creations_move`, `folders_create`, `folders_rename` | I | Writes to the remote account; no credit claim found. |
| Destructive | `folders_delete` | I | Deletes a folder in the remote account; requires confirmation gate. |
| Sharing/team effects | `spaces_list`, `spaces_view` only read; no publish/share tools documented | V (absence in docs) | No `share`/`publish` tool in the documented list; re-verify against live `tools/list`. |

**Safety policy implication for Phase 2:** the read-only class above forms the no-cost verification
fixture set; every tool in the credit-consuming and destructive classes must sit behind an explicit
operator-confirmation gate with a stated expected output and spend boundary. `--ignore-tool` on
`mcp-remote` can enforce an additional hard block (e.g., block `custom_references_create` and
`folders_delete` until manually lifted), but the confirmation-gate policy is the primary control.

---

## 6. Runtime Topology Recommendation (REQ-005)

**Recommended: stdio bridge via `mcp-remote`.**

```json
{
  "name": "magnific",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "magnific": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "mcp-remote", "https://mcp.magnific.com"],
        "env": {}
      }
    }
  }
}
```

Why:

1. **Repo precedent** — the existing remote design transports (`mobbin`, `refero`) already ship
   exactly this shape in `.utcp_config.json`; `mcp-code-mode` documents it as the remote-MCP pattern.
2. **OAuth handling** — `mcp-remote` implements the full MCP authorization spec: browser
   authorization-code + PKCE, token refresh, DPoP (streamable-http targets), session persistence
   under `~/.mcp-auth/`, and `--bearer-token`/`--header` escape hatches for token injection.
3. **No secrets in the repository** — credentials live in the operator's browser session and
   `~/.mcp-auth/`, satisfying the Phase 3 secret boundary. `.env` is not required (unlike
   clickup/figma API-key templates).
4. **Safety extension** — `--ignore-tool` can hard-block dangerous tools at the bridge layer.

**Alternative considered: direct streamable-HTTP registration.** The official docs describe direct
connection from clients (Claude Code `mcp add --transport http`, Cursor `url` config). Code Mode's
`sse` template type exists, but this repo has no verified streamable-HTTP + OAuth precedent in
Code Mode, and the `sse` type targets SSE URLs. Direct registration remains documented-but-unverified
for Code Mode; the bridge is the verified path. Phase 3 should confirm whether Code Mode's `sse`
template type can complete the OAuth flow at all; if it can, direct registration becomes a candidate
but is not required.

**Auth-flow completion requires operator interaction** (browser sign-in or device-code approval).
Phase 3 must budget for an operator-present OAuth step; this is a blocker, not a bug.

---

## 7. Verification Fixtures (REQ-006)

### No-cost probe set (read-only, auth required)
`tools/list`, `resources/list`, `account_balance`, `creations_search` (empty query), `spaces_list`,
`folders_list`, `images_models_list`. All are read-only; none consume credits. Balance-before/after
comparison using `account_balance` brackets any smoke test and proves zero-spend for the read class.

### Separately consented paid smoke scenario (Phase 5/7, operator budget required)
Single smallest-scope `images_generate` (e.g., one 1024×1024 image, explicit model if selectable)
with: stated expected output, `account_balance` before/after, and a hard spend boundary agreed
before execution. Deferrable — verification must never authorize financial spend implicitly.

---

## 8. Unknowns & Blockers

| # | Unknown | Why it matters | Path to resolve |
|---|---------|----------------|-----------------|
| U1 | Live tool schemas (input/output JSON Schemas) for all ~34 tools | Schema-level integration, parameter names | Authenticated `tools/list` in Phase 3 (operator OAuth) |
| U2 | Per-tool credit cost / pre-execution cost estimation | Spend-boundary enforcement | Authenticated discovery; look for cost fields in schemas or `account_balance` semantics |
| U3 | Async job lifecycle details (`creations_wait`/`creation_status` semantics, polling contract) | Correct wait/poll behavior | Authenticated probe of read-only status calls |
| U4 | Asset output format (durable URLs? signed? downloadable? inline base64?) | Asset handling in Code Mode | Authenticated read-only creations browse + docs; no generation until consent |
| U5 | Whether `resources/` or `prompts/` are exposed | Surface completeness | Authenticated `resources/list`, `prompts/list` |
| U6 | Team/workspace scope of MCP session | Account-changing effects | Authenticated `project_report`/`spaces_view` reads |
| U7 | DPoP enforcement (server advertises support; is it *required*?) | Bridge compatibility | Phase 3: complete OAuth via mcp-remote; check token binding |
| U8 | `tools_show` interactive behavior | Client-side UX/safety | Phase 3 evaluation |
| U9 | Exact cost of `custom_references_create` training | Consent-gate accuracy | Operator inquiry / authenticated docs |

None of U1–U9 blocks Phase 2 architecture decisions; all are schema/detail level, resolved in
Phase 3. The single structural blocker is **operator-provided OAuth approval** for live discovery.

---

## 9. No-Spend Confirmation

All live calls made during this research: one GET (405), two unauthenticated POST probes
(initialize, tools/list — both 401, no side effects), two well-known metadata GETs, one docs
sitemap/llms.txt fetch, and reader-proxy fetches of public pages. No generation, transformation,
training, publishing, or upload call was issued. No credits were spent, and no authenticated
session exists from this research.

---

## 10. Handoff to Phase 2

Phase 2 should accept, with this document as the evidence base:

1. **Classification** — `packetKind: transport`, `mutatesWorkspace: false` (all writes land in the
   remote Magnific account, never this workspace).
2. **Judgment pairing** — creative/design-affecting requests pair with `sk-design` (matches the
   transport-axis doctrine; Magnific is a creative-generation transport, not a taste authority).
3. **Bridge** — `mcp-remote` stdio template with OAuth browser flow; no repo secrets.
4. **Gates** — read-only class freely callable post-auth; credit-consuming + destructive classes
   require explicit operator confirmation with expected output and spend boundary; optional
   `--ignore-tool` hard blocks.
5. **Verification** — no-cost probe set (§7) mandatory; paid smoke deferred to operator consent.


> **Addendum (2026-08-02, authenticated discovery):** Live `tools/list` after operator OAuth
> returned **85 tools, 22 resources, and 1 prompt** (server `pikaso` 1.0.0) — substantially
> beyond the official docs' ~34-name baseline, confirming the docs' own statement that the live
> surface is authoritative. Key additions: `simulate_cost`/`simulate_flows`/`simulate_spaces`
> (pre-execution cost estimation), `library_*` (share/delete), `spaces_run`/`spaces_edit`/
> `flows_run` (workflow execution), `stock_download`, `projects_move`, `creations_like`/
> `creations_comment`. `tools_show` (docs) is absent live; the upload trio differs
> (`creations_upload_image`/`creations_upload_file`/`creations_upload_show`). Full schemas:
> `../003-mcp-runtime-integration/research/discovery-fixture-authenticated.json`.

## Evidence Index

| File | Content |
|------|---------|
| `evidence/01-endpoint-get-405.txt` | Wire: GET / → 405, `allow: POST`, CORS headers |
| `evidence/02-initialize-401.txt` | Wire: POST initialize → 401 + `www-authenticate` Bearer challenge |
| `evidence/03-tools-list-401.txt` | Wire: POST tools/list → 401 `Unauthenticated.` |
| `evidence/04-oauth-protected-resource.json` | Live: RFC 9728 protected-resource metadata |
| `evidence/05-oauth-authorization-server.json` | Live: full authorization-server metadata (Keycloak) |
| `evidence/06-official-landing-page.md` | Official product page content (reader-proxy capture) |
| `evidence/07-official-docs-mcp.md` | Official docs MCP page (endpoint, auth, clients, tool list, FAQ) |
| `evidence/08-official-docs-index-llms.txt` | Official docs index (llms.txt) |
| `evidence/09-mcp-remote-notes.md` | mcp-remote v0.1.38 capabilities (README extraction) |

All evidence captured 2026-08-02. Live wire evidence is timestamped in the files' response
headers where present.
