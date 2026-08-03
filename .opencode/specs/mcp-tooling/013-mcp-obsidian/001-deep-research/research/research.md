# Deep Research — Obsidian CLI / REST API / MCP landscape

A 3-lineage cli-codex fan-out (GPT-5.6 SOL/TERRA/LUNA) converged on the same shape for the new `mcp-obsidian` mode: **adopt existing providers on both surfaces and build only a thin router/safety facade — do not build a vault engine.** For the CLI, adopt the official first-party `obsidian` binary (app-backed) with `notesmd-cli` as a genuinely headless filesystem profile. For MCP, the coddingtonbear Local REST API community plugin is the shared data plane; adopt the verified `obsidian-mcp-server` (cyanheads) stdio wrapper for today's stdio-only Code Mode, and migrate to the plugin's built-in Streamable HTTP `/mcp/` endpoint once Code Mode's HTTP-manual + custom-header schema is proven. The single decisive constraint is **runtime, not package selection**: every rich surface (official CLI, Local REST API, all reviewed MCP wrappers) requires a running Obsidian desktop app plus the enabled plugin and a bearer token; only `notesmd-cli` and one filesystem MCP candidate are truly headless. Package identity is a hard release gate — the sibling ClickUp packet records a public-npm 404 for its configured `@clickup/mcp-server`, so no name enters `.utcp_config.json` without a live registry check.

## Run provenance

| Lineage | Model / mode | Iterations | Final convergence | Early convergence | Notes |
|---------|--------------|-----------:|------------------:|-------------------|-------|
| sol | GPT-5.6, high | 4 | 0.68 | None (max-iterations policy) | Bridges built-in `/mcp/` via `mcp-remote`; surfaces filesystem MCP `obsidian-mcp` |
| terra | GPT-5.6, max/fast | 3 | 0.75 | None (max-iterations policy) | Ranks `obsidian-mcp-server` stdio as default; did not surface `notesmd-cli` |
| luna | GPT-5.6, max | 3 | 0.58 | None (max-iterations policy) | Broadest MCP candidate enumeration; ran in direct-mode recovery after cli-codex executor failed to initialize |

- **Merged registry:** 52 key findings, 80 source findings, 10 research questions resolved, 0 open, aggregate convergence 0.67. All three lineages ran to their iteration cap by operator contract (`stopPolicy: max-iterations`); convergence telemetry was informational only, so no lineage synthesized early.
- **Executor caveat:** the LUNA lineage's requested `cli-codex` executor could not initialize its nested app-server client and completed via the workflow's direct-mode recovery path — same artifact root, route proof, state records, and live citations. This affects executor provenance, not source evidence.
- **Scope:** read-only research. No repository config, source, vault, token, or running Obsidian app was accessed or changed by any lineage.

## Research questions answered

### 1. Is there a first-party/official Obsidian CLI? What does the developer API expose?

**Yes — one, and it is app-backed.** The official `obsidian` CLI ships with the desktop installer (1.12.7+), is enabled from Obsidian settings, and exposes commands for file CRUD, search, daily notes, tags, frontmatter/properties (`property:*`), templates, and command-palette execution; if Obsidian is not running, the first command launches it. It is an app-backed automation API, not a standalone vault binary, and there is no npm package for it. [SOURCE: https://obsidian.md/help/cli]

The **developer/plugin API** (`Vault`, `MetadataCache`) is an in-app plugin-process API (`this.app.vault`), not a documented standalone CLI or remote MCP transport. It supplies the primitives for in-app CRUD and link/backlink resolution (`MetadataCache.unresolvedLinks`), but only inside a custom Obsidian plugin. [SOURCE: https://docs.obsidian.md/Plugins/Vault] [SOURCE: https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks] The `obsidian` npm package is API type definitions for plugin development, not a server. [SOURCE: https://www.npmjs.com/package/obsidian] Separately, official **Obsidian Headless** (`npm install -g obsidian-headless`, binary `ob`, Node 22+, `ob login`) is a real package whose documented scope is Obsidian **Sync/Publish only** — not note CRUD/search. [SOURCE: https://www.npmjs.com/package/obsidian-headless] [SOURCE: https://obsidian.md/help/sync/headless] The `obsidian://` URI scheme is a UI-action surface (open/new/daily/search/append) with no authenticated data plane and no backlinks/tag/frontmatter enumeration. [SOURCE: https://obsidian.md/help/Extending%2BObsidian/Obsidian%2BURI]

### 2. Best-maintained community CLI + install method + auth + vault-path model + headless capability

**`notesmd-cli` (Yakitrak).** It is the maintained Go project formerly named "Obsidian CLI," which explicitly renamed itself after the official CLI appeared; the researched release is **v0.3.6**, distributed via **Homebrew, Scoop, AUR, and Go source build** (not npm/PyPI). It registers a vault **directory** directly, requires **no Obsidian app and no token**, and is genuinely headless on the filesystem. Documented surface: list, read, content search, create/update/delete, move/rename (updates internal links), daily notes (reads `.obsidian/daily-notes.json` for folder/format/template), and frontmatter. It does **not** document a first-class backlinks report, tag-management API, or general template catalog — treat those as build/derive. [SOURCE: https://github.com/Yakitrak/notesmd-cli] (Found and recommended by SOL and LUNA; TERRA did not surface it.)

Rejected community CLI alternatives: PyPI `obsidian-cli` (real, but ships a colliding `obsidian` binary and only vault/open/template scope) [SOURCE: https://pypi.org/project/obsidian-cli/]; `@obsidian-vfs/core` (real npm **library** 0.4.0, not a CLI; search/wikilinks degrade when Obsidian is down) [SOURCE: https://www.npmjs.com/package/%40obsidian-vfs/core]; `@questi0nm4rk/vori` (real npm, **read-only** query/search, no CRUD) [SOURCE: https://www.npmjs.com/package/%40questi0nm4rk/vori].

### 3. Existing Obsidian MCP servers — names, transport, auth, verified identity

All rich MCP paths ride on the **coddingtonbear Local REST API** community plugin, which now ships a **built-in Streamable HTTP MCP endpoint at `/mcp/`** in addition to authenticated REST. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] Verified candidates:

| Candidate | Transport | Auth | Verified identity | Backend |
|-----------|-----------|------|-------------------|---------|
| Local REST API built-in `/mcp/` | Streamable HTTP (`https://127.0.0.1:27124/mcp/`, HTTP `27123` opt-in) | `Authorization: Bearer <key>` | VERIFIED — plugin endpoint, not a standalone package [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] | App + plugin + token |
| `obsidian-mcp-server` (cyanheads) | stdio + HTTP | `OBSIDIAN_API_KEY` | VERIFIED — npm registry, cyanheads author, matching repo, latest tag `3.2.9`; 14 tools / 3 resources [SOURCE: https://registry.npmjs.org/obsidian-mcp-server] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] | Local REST API v4+ |
| `mcp-obsidian` (MarkusPfundstein, PyPI) | stdio (`uvx mcp-obsidian`) | `OBSIDIAN_API_KEY` (+opt `OBSIDIAN_HOST`/`OBSIDIAN_PORT`) | VERIFIED — PyPI v0.2.2, Python ≥3.11, 7 tools [SOURCE: https://pypi.org/project/mcp-obsidian/] [SOURCE: https://github.com/MarkusPfundstein/mcp-obsidian] | Local REST API |
| `obsidian-mcp` (StevenStavrakis, npm) | stdio (`npx -y obsidian-mcp /vault/path`) | **None** | VERIFIED-BY-ONE (SOL, via repo `package.json`, **not** npm registry directly) [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp] | **Filesystem — headless, no app/token** |
| `@huangyihe/obsidian-mcp` (npm) | stdio | `OBSIDIAN_API_TOKEN` (+ `OBSIDIAN_API_PORT`, `OBSIDIAN_VAULT_PATH`) | VERIFIED — npm scoped v1.6.0, repo `newtype-01/obsidian-mcp` [SOURCE: https://www.npmjs.com/package/%40huangyihe/obsidian-mcp] [SOURCE: https://github.com/newtype-01/obsidian-mcp] | REST + filesystem fallback |
| `@connorbritain/obsidian-mcp-server` (npm) | stdio | `OBSIDIAN_API_KEY` | VERIFIED — npm scoped v0.2.3, matching repo [SOURCE: https://www.npmjs.com/package/%40connorbritain/obsidian-mcp-server] | Local REST API + optional Dataview/Periodic/Smart Connections |
| `@mseep/obsidian-mcp-server` (npm) | stdio | `OBSIDIAN_API_KEY` | RESOLVABLE but PROVENANCE UNCLEAR — README redirects to cyanheads source; audit before adoption [SOURCE: https://www.npmjs.com/package/%40mseep%2Fobsidian-mcp-server] | Local REST API |
| `otaviocc/ObsidianMCPServer` (Swift) | stdio | `OBSIDIAN_BASE_URL` + `OBSIDIAN_API_KEY` | VERIFIED — Brew/Mint/source, **macOS-only** [SOURCE: https://github.com/otaviocc/ObsidianMCPServer] | Local REST API |

**Flagged:** the sibling `@clickup/mcp-server` name did **not** resolve on npm during identity verification (npm search returned other ClickUp packages; the exact page 404'd) — the cautionary precedent for this whole packet. [SOURCE: https://www.npmjs.com/package/%40clickup/mcp-server] [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65] Note also that `obsidian-mcp` (StevenStavrakis), `mcp-obsidian` (MarkusPfundstein), and `@huangyihe/obsidian-mcp` are **three distinct projects** with overlapping names — do not conflate them.

### 4. Headless, or Local REST API + token + running app?

**Only `notesmd-cli` and the filesystem MCP `obsidian-mcp` (StevenStavrakis) are genuinely headless.** Everything else requires a running desktop app. A wrapper process being launchable with `npx`/`uvx`/a native binary does **not** make its Obsidian backend headless. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://pypi.org/project/mcp-obsidian/]

| Surface | Obsidian app required | Token required | Vault backend |
|---------|:---:|:---:|---|
| Official `obsidian` CLI | Yes (first command launches it) | No | Live app / metadata |
| `notesmd-cli` | **No** | **No** | Filesystem |
| Local REST API built-in `/mcp/` | Yes | Bearer key | Live app / metadata |
| `obsidian-mcp-server` (cyanheads) | Yes | `OBSIDIAN_API_KEY` | Local REST API |
| `mcp-obsidian` (PyPI) | Yes | `OBSIDIAN_API_KEY` | Local REST API |
| `obsidian-mcp` (StevenStavrakis) | **No** | **No** | Filesystem |
| `obsidian-headless` (`ob`) | No | `ob login` | Sync/Publish only (not note CRUD) |
| `obsidian://` | Yes | No | App URL handler |

For a strictly headless deployment, official Headless Sync can *materialize* a vault on disk, then `notesmd-cli` or a filesystem MCP operates on the Markdown — but such a path must explicitly declare its gaps: no Obsidian index, no verified backlinks, no template-plugin execution, no app-managed link updates. [SOURCE: https://obsidian.md/help/sync/headless] [INFERENCE: based on filesystem-backend semantics vs. the app metadata cache]

### 5. Auth / config / env-prefix pattern to mirror in `.utcp_config.json` + `.env.example`

Local REST API authenticates with an **API key as a bearer token**; default HTTPS endpoint `https://127.0.0.1:27124` (self-signed cert), HTTP `27123` opt-in. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] The canonical env contract (cyanheads wrapper) is: `OBSIDIAN_API_KEY` (secret), `OBSIDIAN_BASE_URL`, `OBSIDIAN_VERIFY_SSL` (self-signed localhost only), `OBSIDIAN_REQUEST_TIMEOUT_MS`, plus least-privilege controls `OBSIDIAN_READ_PATHS`, `OBSIDIAN_WRITE_PATHS`, `OBSIDIAN_READ_ONLY`, `OBSIDIAN_ENABLE_COMMANDS`; `MCP_TRANSPORT_TYPE`/`MCP_LOG_LEVEL` are adapter-layer settings. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server]

**Code Mode env-prefix:** the existing manual pattern is `transport: "stdio"`, `command: "npx"`, an args array, and an `env` object; `.env` variables are prefixed with the manual name (`{manual_name}_{VAR}`). A manual named `obsidian` therefore maps `OBSIDIAN_API_KEY` → **`obsidian_OBSIDIAN_API_KEY`**. [SOURCE: .utcp_config.json:66] [SOURCE: .env.example:1] Map fork-specific aliases (`OBSIDIAN_API_TOKEN`, `OBSIDIAN_HOST`/`OBSIDIAN_PORT`) to the canonical key at the adapter boundary — do not make two secret names equally authoritative. [SOURCE: https://github.com/newtype-01/obsidian-mcp] Pin an exact version rather than a moving `@latest` tag; validate the exact package/version at install time because similarly named scoped packages are not interchangeable. [SOURCE: https://registry.npmjs.org/obsidian-mcp-server]

Canonical stdio manual (research proposal, not an applied edit):

```json
{
  "name": "obsidian",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "obsidian": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "obsidian-mcp-server@<pinned-version>"],
        "env": {
          "OBSIDIAN_API_KEY": "${OBSIDIAN_API_KEY}",
          "OBSIDIAN_BASE_URL": "${OBSIDIAN_BASE_URL}",
          "OBSIDIAN_VERIFY_SSL": "${OBSIDIAN_VERIFY_SSL}",
          "OBSIDIAN_READ_ONLY": "${OBSIDIAN_READ_ONLY}",
          "OBSIDIAN_READ_PATHS": "${OBSIDIAN_READ_PATHS}",
          "OBSIDIAN_WRITE_PATHS": "${OBSIDIAN_WRITE_PATHS}",
          "OBSIDIAN_ENABLE_COMMANDS": "${OBSIDIAN_ENABLE_COMMANDS}",
          "MCP_TRANSPORT_TYPE": "stdio",
          "MCP_LOG_LEVEL": "info"
        }
      }
    }
  }
}
```

```dotenv
# Obsidian (Code Mode prefixes each var with the manual name: obsidian_<VAR>)
obsidian_OBSIDIAN_API_KEY=your_local_rest_api_key
obsidian_OBSIDIAN_BASE_URL=https://127.0.0.1:27124
obsidian_OBSIDIAN_VERIFY_SSL=false
obsidian_OBSIDIAN_READ_ONLY=true
obsidian_OBSIDIAN_READ_PATHS=notes/,inbox/
obsidian_OBSIDIAN_WRITE_PATHS=inbox/
obsidian_OBSIDIAN_ENABLE_COMMANDS=false
```

SOL's alternative for adopting the built-in `/mcp/` endpoint *now* bridges it through `mcp-remote@latest` (stdio→HTTP) with a full-value `Authorization` header env var (`obsidian_OBSIDIAN_AUTH_HEADER=Bearer <key>`). [SOURCE: https://www.npmjs.com/package/mcp-remote] Start read-only and folder-scoped (`OBSIDIAN_READ_ONLY=true`); `OBSIDIAN_VERIFY_SSL=false` is acceptable **only** for the localhost self-signed endpoint, never as a general TLS setting.

### 6. Initial feature surface (CRUD, search, backlinks, daily notes, tags, frontmatter, templates)

| Feature | Best adopted surface | Decision |
|---------|----------------------|----------|
| Note CRUD | Local REST API / cyanheads MCP (app-backed); `notesmd-cli` (headless) | ADOPT + thin facade (schema, path policy, structured errors, destructive-op confirmation) |
| Search | Local REST fuzzy + JsonLogic; cyanheads text/JsonLogic/optional Omnisearch; filesystem fallback | ADOPT + normalize query/result shape |
| Backlinks | **Official CLI** (dedicated backlinks command); MetadataCache in a plugin, or Markdown link scan headless | ADOPT via CLI; **BUILD/DERIVE** for MCP/headless — no first-class Local REST backlinks endpoint |
| Daily notes | Official CLI (`daily` append/prepend); `notesmd-cli` reads vault config; periodic-note commands | ADOPT/ADAPT with backend reporting |
| Tags | Local REST tag-list; official CLI tag commands; cyanheads tag manager | ADOPT + normalize inline `#tags` vs frontmatter `tags:` |
| Frontmatter | Local REST targeted PATCH; `notesmd-cli` YAML edit; cyanheads atomic manager | ADOPT + safety wrapper (type-preserving, `ifMatch`, no whole-file clobber) |
| Templates | **Official CLI** (list/read/insert/create + variable resolution); `notesmd-cli` daily-template only | ADOPT via CLI; **BUILD** a limited filesystem renderer as an explicit headless fallback |

Backlinks and native templates are the two capabilities **not** established as core Local REST API endpoints — all three lineages agree they are build/derive on the MCP and headless paths, while the official CLI covers both app-backed. [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api] [SOURCE: https://obsidian.md/help/cli] [SOURCE: https://docs.obsidian.md/Reference/TypeScript%20API/MetadataCache/unresolvedLinks]

## RECOMMENDATION — build vs adopt (per surface)

**Overall: ADOPT on both surfaces; BUILD only the `mcp-obsidian` mode as a router + safety/normalization facade + install/doctor checks. Do NOT build a vault engine.** Verify every package identity with a live registry/launch probe before it enters config.

### CLI surface — ADOPT (two-profile)

**Headline: ADOPT the official `obsidian` binary as the default (app-backed) CLI; ADOPT `notesmd-cli` as an explicit headless-filesystem profile.**

**Candidate 1 — official `obsidian` CLI (default).** *Verified identity:* VERIFIED — bundled with installer 1.12.7+, no npm package, binary `obsidian` [SOURCE: https://obsidian.md/help/cli].
- Pros: first-party; broadest feature coverage (CRUD, search, **dedicated backlinks**, daily notes, tags/properties, **native templates**, command execution); live Obsidian semantics and metadata freshness; no API key in `.env`.
- Cons: requires a running desktop app (launches it on first command) — not headless; not scriptable on a server without a GUI session.

**Candidate 2 — `notesmd-cli` (Yakitrak) (headless profile).** *Verified identity:* VERIFIED via GitHub + package managers (SOL+LUNA); v0.3.6; Homebrew/Scoop/AUR/Go — **not npm/PyPI** [SOURCE: https://github.com/Yakitrak/notesmd-cli].
- Pros: genuinely headless (no app, no token); direct vault-directory registration; CRUD, search, daily notes, frontmatter, link-preserving move; maintained, deliberately renamed from the legacy `obsidian-cli`.
- Cons: no first-class backlinks/tag-management/template catalog; filesystem writes can race a live app's metadata cache; TERRA did not independently surface it (2/3 verification).
- *Divergence:* TERRA proposed **building** a reduced filesystem backend instead. Best-supported call: **adopt `notesmd-cli`** (two of three lineages verified a real, maintained project) rather than build; reserve a custom backend only for gaps `notesmd-cli` cannot cover.

Do **not** use the legacy `obsidian-cli` name, PyPI `obsidian-cli` (binary collision), `@obsidian-vfs/core` (library), or `@questi0nm4rk/vori` (read-only) as the primary CLI. Never silently fall back between the app-backed and headless profiles — link resolution, template behavior, metadata freshness, and concurrency differ.

### MCP surface — ADOPT (Local REST API substrate)

**Headline: ADOPT `obsidian-mcp-server` (cyanheads, pinned) over stdio as the default MCP backend now; ADOPT the Local REST API built-in `/mcp/` endpoint as the target once Code Mode's HTTP-manual + custom-header schema is proven.**

**Candidate 1 — `obsidian-mcp-server` (cyanheads) over stdio (default now).** *Verified identity:* VERIFIED — strongest of all candidates; npm registry names package + cyanheads author + matching repo, latest tag `3.2.9`, 14 tools / 3 resources (all 3 lineages) [SOURCE: https://registry.npmjs.org/obsidian-mcp-server] [SOURCE: https://github.com/cyanheads/obsidian-mcp-server].
- Pros: works under today's stdio-only Code Mode with no unproven HTTP dependency; strongest identity verification; ships agent-safety controls absent from a raw endpoint (`OBSIDIAN_READ_ONLY`, `OBSIDIAN_READ_PATHS`/`WRITE_PATHS`, opt-in commands); typed CRUD/search/tags/frontmatter/patch tools; clean removal path when the direct endpoint is adopted.
- Cons: an extra wrapper process/semantic layer over Local REST API; still app-backed (needs plugin v4+ and token); link support is outgoing-parse, not verified backlinks; must be version-pinned.

**Candidate 2 — Local REST API built-in `/mcp/` endpoint (target).** *Verified identity:* VERIFIED — plugin-owned endpoint, no standalone package; Streamable HTTP at `https://127.0.0.1:27124/mcp/`, bearer auth (all 3 lineages) [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api].
- Pros: least-layered — removes an extra server process; direct access to live metadata, active file, and command palette; closest to Obsidian's cache; LUNA ranks it #1 where the host supports HTTP.
- Cons: requires Code Mode to support a header-bearing Streamable HTTP manual — **not demonstrated** by any local `.utcp_config.json` example (stdio only). SOL's workaround bridges it via `mcp-remote@latest` (stdio→HTTP), but `mcp-remote` was verified by only one lineage [SOURCE: https://www.npmjs.com/package/mcp-remote].
- *Divergence:* SOL made this the default (via `mcp-remote`); TERRA explicitly ruled out configuring built-in HTTP MCP before Code Mode's HTTP-manual schema is verified; LUNA ranked it #1 *conditional on HTTP-host support* with cyanheads #2. Reconciled call: ship Candidate 1 now, adopt Candidate 2 the moment the HTTP-manual path is confirmed.

*Lower-ranked MCP fallbacks (adopt only for a specific need):* `mcp-obsidian` (MarkusPfundstein, PyPI 0.2.2, lean 7-tool Python) [SOURCE: https://pypi.org/project/mcp-obsidian/]; `obsidian-mcp` (StevenStavrakis, npm) as a **headless filesystem** MCP for an explicit headless profile — **VERIFIED-BY-ONE, confirm before wiring** [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp]; `@connorbritain/obsidian-mcp-server` (graph/periodic/semantic, more coupling); `@huangyihe/obsidian-mcp` (different token contract); `otaviocc/ObsidianMCPServer` (macOS-only). Do **not** default to `@mseep/obsidian-mcp-server` (unclear provenance) without a source/package audit. Do **not** build a redundant REST-to-MCP adapter — Local REST API now ships `/mcp/` directly.

### Mirror from `mcp-click-up` (structural)

Operation→surface routing; one primary CLI + one primary MCP surface; install pointers rather than vendored source; doctor checks for binary/auth/registration/callable schema; Code Mode manual naming with prefixed `.env` vars; feature-catalog + manual-testing-playbook split by surface. **Do not** mirror the stale provider assumption — the ClickUp packet's own note records a 404 for its configured package, which makes live identity verification part of the Obsidian acceptance gate. [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/mcp-servers/clickup-mcp/README.md:65]

## Open risks / VERIFY

Phase 2 must confirm before wiring anything into `.utcp_config.json` / `.env.example`:

1. **Code Mode HTTP-manual + custom-header schema (decides the whole MCP topology).** Whether Code Mode can register a Streamable HTTP MCP with an `Authorization` header determines native `/mcp/` (Candidate 2) vs. the stdio wrapper (Candidate 1). Directly disputed: SOL assumed a bridge works; TERRA ruled it out pre-verification. [INFERENCE: based on .utcp_config.json:66]
2. **`obsidian-mcp-server` exact version pin.** LUNA verified latest `3.2.9` at research time; SOL/TERRA used `@latest`. Re-resolve the current latest and pin it (lockfile/checksum) before install. [SOURCE: https://registry.npmjs.org/obsidian-mcp-server]
3. **`mcp-remote` identity (SOL-only).** Confirm the npm package resolves before using SOL's built-in-endpoint bridge. [SOURCE: https://www.npmjs.com/package/mcp-remote]
4. **`obsidian-mcp` (StevenStavrakis) — headless filesystem MCP, VERIFIED-BY-ONE.** SOL cited the repo `package.json`, not the npm registry directly. Confirm npm-registry identity and the "no app / no token / filesystem" claim before relying on it for a headless profile. [SOURCE: https://github.com/StevenStavrakis/obsidian-mcp]
5. **`notesmd-cli` install channel + current version.** VERIFIED as a real project by 2/3 lineages, but via GitHub + Homebrew/Scoop/AUR (not a registry the repo's `.utcp`-style tooling installs from). Confirm the install method fits the mode's doctor script and re-check the current version (v0.3.6 at research time). TERRA did not surface it. [SOURCE: https://github.com/Yakitrak/notesmd-cli]
6. **`@mseep/obsidian-mcp-server` provenance UNCLEAR.** Resolvable npm name whose README redirects to cyanheads source — audit the package↔source relationship before any adoption. [SOURCE: https://www.npmjs.com/package/%40mseep%2Fobsidian-mcp-server]
7. **Backlinks and native templates are not core Local REST API endpoints.** Decide per profile whether to route them to the official CLI (app-backed) or build a derived index / filesystem renderer; do not assume CRUD/search adoption supplies them.
8. **Headless parity gaps are real.** No genuinely headless path reproduces Obsidian's index, verified backlinks, template-plugin execution, or app-managed link updates. Surface capability loss as explicit metadata; never silently normalize live vs. headless behavior.
9. **Self-signed TLS + bearer scope.** Trust the local certificate deliberately; keep `OBSIDIAN_VERIFY_SSL=false` scoped to localhost only. A Local REST API token grants access across the served vault surface — scope with `OBSIDIAN_READ_PATHS`/`WRITE_PATHS`, start read-only, and disable command execution by default. Tag listings may disclose tag names outside a read scope. [SOURCE: https://github.com/cyanheads/obsidian-mcp-server] [SOURCE: https://github.com/coddingtonbear/obsidian-local-rest-api]
10. **Validate against a disposable fixture vault** (read/search/CRUD/frontmatter-patch/tags, path-denial, read-only-denial, command opt-in; CLI backlinks/daily/templates separately; headless profile with Obsidian stopped) before declaring the mode production-ready.

### Point-of-disagreement summary

| Question | SOL | TERRA | LUNA | Best-supported call |
|----------|-----|-------|------|---------------------|
| Default MCP backend | Built-in `/mcp/` via `mcp-remote` now | `obsidian-mcp-server` stdio now; native later | Built-in `/mcp/` #1 *if HTTP host*; cyanheads #2 | `obsidian-mcp-server` stdio now (strongest identity, no unproven dep); built-in `/mcp/` as target |
| Headless CLI | Adopt `notesmd-cli` | Build a filesystem backend | Adopt `notesmd-cli` | Adopt `notesmd-cli` (2/3 verified real+maintained) |
| Headless MCP | Adopt filesystem `obsidian-mcp` | Build reduced backend | (not covered) | Conditional-adopt `obsidian-mcp`, VERIFIED-BY-ONE — verify first |
