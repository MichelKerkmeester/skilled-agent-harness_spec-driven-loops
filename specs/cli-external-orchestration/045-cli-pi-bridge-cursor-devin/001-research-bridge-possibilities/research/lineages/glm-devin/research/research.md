---
title: "Pi Native Bridge to Cursor & Devin CLI Models — Research Synthesis"
lineage: glm-devin
executor: cli-devin / glm-5-2
iterations: 5
stop_policy: max-iterations
status: complete
verdict: not-feasible-now
created: 2026-08-17T13:19:40Z
completed: 2026-08-17T14:38:10Z
---

# Pi Native Bridge to Cursor & Devin CLI Models — Research Synthesis

## 1. Executive Summary

**Verdict: Not feasible now.** No path to natively expose Cursor and Devin subscription-backed models in Pi's `/model` picker is both technically clean and account-safe as of August 2026. Four of five candidate paths are ToS-blocked with first-hand evidence (Cursor staff ruling + §1.5; Cognition §2.3 analog). The sole technically-feasible path (a CLI-spawn OpenAI gateway) is ToS-ambiguous for Cursor, worse for Devin (session-based, unsuitable for interactive use), and duplicates the repo's existing `cli-cursor`/`cli-devin` executor dispatch with a nested-harness cost that breaks Pi's native tool loop.

**Recommendation:** Do not build a native Pi Cursor/Devin bridge now. Keep the existing `cli-cursor`/`cli-devin` executor dispatch as the supported surface. Track two vendor-side feature requests whose shipment would change the verdict: (1) Cursor public OpenAI-compatible `/v1/chat/completions`, and (2) a Devin raw-completions surface. Re-evaluate when either ships, and re-verify the ToS landscape at that time.

---

## 2. Research Topic

How can `cli pi` natively expose Cursor and Devin subscription-backed models in its own `/model` picker: reusing the operator Cursor (`cursor-agent`) and Devin OAuth/subscription auth, adding Pi provider adapters, or fronting each vendor CLI with a local OpenAI-compatible gateway. Assess technical feasibility and the Terms-of-Service and account-safety boundaries of each path, grounded in the actual `pi`, `cursor-agent`, and `devin` CLI surfaces.

---

## 3. Methodology

Five-iteration deep-research loop (stop policy: max-iterations). Each iteration had one focus, gathered first-hand evidence from live CLI surfaces and official docs, externalized findings to iteration files, and updated the strategy/registry/dashboard. No sub-agents. No secrets copied into artifacts.

**Evidence sources (first-hand):**
- Live `pi --version`/`--help`/`--list-models`, `~/.pi/agent/auth.json` keys, `~/.pi/agent/models-store.json`, `.pi/models.json`, `.pi/PLUGINS.md`, installed `docs/custom-provider.md` + `docs/providers.md`
- Live `cursor-agent about`, `~/.cursor/cli-config.json` keys, `cli-cursor/references/`
- Live `devin auth status`, `devin models list`, `devin acp --help`, `~/.local/share/devin/credentials.toml` keys, `cli-devin/references/`
- Fetched `https://cursor.com/terms-of-service` (§1.5, last updated Aug 13, 2026)
- Fetched Cursor staff forum thread `https://forum.cursor.com/t/.../167778` (deanrie, Aug 10 & 16, 2026)
- Fetched `https://cognition.com/legal/platform-terms-of-service` (§2.3, last updated Jun 30, 2026)
- Fetched `https://cognitionai.mintlify.app/api-reference/overview` (Devin v3 API)
- Fetched `https://github.com/tageecc/cursor-agent-api-proxy` (CLI-spawn proxy, 52★)
- Fetched `https://github.com/timxx/Cursor-To-OpenAI` (reverse-engineered proxy)

---

## 4. Key Findings by Question

### Q1: How does Pi's /model picker resolve providers and models? (iteration 1)

Pi's interactive model selector is `/model` (singular); the headless roster dump is `pi --list-models [search]`. The live roster composes from four layers:

| Layer | Source | Role |
|-------|--------|------|
| Built-in catalogs | shipped `docs/providers.md` | Six subscription `/login` providers + ~20 env-var API-key providers |
| Provider cache | `~/.pi/agent/models-store.json` | Auto-refreshed catalog cache (not a durable edit target) |
| Operator overlay | `~/.pi/agent/models.json` → repo `.pi/models.json` | Custom provider config / compat flags |
| Extension registry | `pi.registerProvider()` | Full custom providers (OAuth, custom streaming, dynamic discovery) |

Two extension hooks exist: (1) `models.json` overlay (HTTP endpoints with a supported `api` type), and (2) `pi.registerProvider()` extension (full custom providers with OAuth/SSO, `streamSimple`). Both expect an HTTP LLM API (9 supported `api` types: `openai-completions`, `openai-responses`, `anthropic-messages`, `google-generative-ai`, `openai-codex-responses`, `azure-openai-responses`, `mistral-conversations`, `google-vertex`, `bedrock-converse-stream`) or a custom `streamSimple` implementation. A sibling-CLI subprocess is not a native provider shape.

On this machine, `auth.json` has six authenticated providers (openai-codex OAuth + 5 API-key); **none is Cursor or Devin**. The built-in subscription `/login` list (Codex, Claude Pro/Max, Copilot, xAI, OpenRouter, Radius) excludes both vendors. Picker visibility is auth-gated; credential resolution order is `--api-key` → `auth.json` → env → `models.json`.

### Q2: Can Cursor subscription auth be reused safely? (iteration 2)

**No.** Cursor's `api2.cursor.sh` is a private Connect-RPC/protobuf agent backend, not one of Pi's nine supported API types. A Pi `models.json` provider pointing at it with `api: "openai-completions"` would not speak the right protocol; a `registerProvider` with `streamSimple` would have to reverse-engineer the private protocol.

Cursor staff (deanrie) stated on the record (Aug 10 & 16, 2026) that Oh My Pi's `cursor` provider and local OpenAI-compatible proxies to the same private endpoints **violate ToS §1.5** (reverse engineering / accessing the internal structure), and that using the subscription outside official clients can trigger abuse enforcement **up to and including an account ban**. A "personal, local-only" proxy does not change the analysis. The supported out-of-IDE paths (CLI, Agent SDK, Cloud Agents API) **always run the agent harness, not a raw model**. There is no public `/v1/chat/completions` endpoint (open feature request).

`~/.cursor/cli-config.json` holds identity and model preferences (`modelParameters`: default/grok-4.5/composer-2.5/glm-5.2), not OAuth tokens — so a "copy the token" adapter would have to extract them from the keychain/Chromium store first.

### Q3: Can Devin OAuth be reused safely? (iteration 3)

**No.** `~/.local/share/devin/credentials.toml` holds `windsurf_api_key` (the full account credential) pinned to `server.codeium.com` (the CLI's private API server). Consumer CLI auth is OAuth-only (`devin auth login`); there is no `--api-key` flag. Feeding `windsurf_api_key` into a Pi HTTP provider against `server.codeium.com` would be a Cognition Platform ToS §2.3(ii) analog (reverse-engineering / deriving access to a software component), with high account-suspension risk (§2.4).

The public `api.devin.ai` v3 API is **session REST** (`POST .../sessions` with `{ "prompt": "..." }`), not OpenAI chat completions. Authentication uses `cog_`-prefixed service-user keys (teams/enterprise) or Personal Access Tokens. `devin acp` is ACP JSON-RPC over stdio (an editor-integration protocol), not an HTTP LLM API. No Pi-named staff letter exists, but the structural ToS mapping is strong. Devin exposes 40 model families through its own CLI/REPL, not through any OpenAI-compatible HTTP endpoint.

### Q4: Can a local OpenAI-compatible gateway front the vendor CLIs? (iteration 4)

**Technically feasible but not recommended.** Two distinct proxy architectures exist:

| Class | Exemplar | What it fronts | ToS |
|-------|----------|----------------|-----|
| CLI-spawn | `tageecc/cursor-agent-api-proxy` (52★) | Official `cursor-agent` subprocess | Ambiguous |
| Reverse-engineered | `timxx/Cursor-To-OpenAI` | Private Cursor backend (reverse-engineered protobuf) | Blocked (§1.5) |

The reverse-engineered class is the already-ruled-out ToS violation. The CLI-spawn class is architecturally distinct (the official client makes the upstream calls), but ToS-ambiguous: it still exposes the subscription to a third-party harness (Pi), which the staff letter may still consider a violation.

**The nested-harness problem:** Both Cursor and Devin official CLIs run an agent harness (tool loop, planning, file edits). A Pi `models.json` provider pointing at a CLI-spawn gateway would receive a nested agent: Pi sends a prompt + tool definitions, the gateway forwards to the vendor CLI, the vendor harness runs its own tool loop (ignoring or double-executing Pi's tools), and returns a final text blob. Pi's native tool streaming (tool-call deltas, stop-reason events) is lost; agent-harness latency is added on every "completion."

For Devin, no CLI-spawn proxy exists. `devin -p` spawns a full session per request (minutes of latency), unsuitable for interactive `/model` use. `devin acp` is ACP stdio, still an agent harness.

The repo already has `cli-cursor`/`cli-devin` executor dispatch (shell-out to official CLIs with enforced allowlists). A Pi `/model` row backed by a CLI-spawn gateway would duplicate that dispatch with extra hops and a protocol translation layer, while inheriting the nested-harness cost.

### Q5: Ranked verdict (iteration 5)

| Path | Feasibility | Account-safety | ToS | Verdict |
|------|-------------|----------------|-----|---------|
| P1 Built-in Pi Cursor/Devin | Not feasible (no built-in) | n/a | n/a | Ruled out (iter 1) |
| P2 Cursor token-reuse HTTP | Mechanically feasible; wrong protocol | Unsafe (ban risk) | Violates §1.5 | Ruled out (iter 2) |
| P3 Devin token-reuse HTTP | Not feasible (session REST) | Unsafe (full credential) | Violates §2.3 analog | Ruled out (iter 3) |
| P4 Reverse-engineered proxy | Feasible (exemplar exists) | Unsafe (ban risk) | Violates §1.5(i) | Ruled out (iter 4) |
| P5 CLI-spawn gateway | Feasible (exemplar exists) | Ambiguous | ToS-ambiguous (Cursor); worse (Devin) | Not recommended |

**No path is both technically clean and account-safe.** The parent spec's purpose is investigation, not implementation — so the correct output is a not-feasible-now verdict with open feature requests.

---

## 5. Open Feature Requests (Unblock Conditions)

1. **Cursor public OpenAI-compatible `/v1/chat/completions`** — staff confirmed this is an open feature request. If shipped, a Pi `models.json` provider could call it directly with `CURSOR_API_KEY` (User API Keys are already supported headless auth), eliminating the reverse-engineering and private-endpoint ToS issues.

2. **Devin raw-completions surface** — Devin's public API is session REST, not chat completions. A raw-completions surface (or a `cog_` service-user key path for consumer Pro) would enable a Pi `models.json` provider. Currently UNKNOWN whether consumer Devin Pro can mint v3 `cog_` keys.

3. **(Secondary) Cursor staff clarification on CLI-spawn gateways** — the staff letter did not resolve whether fronting the official CLI (not private endpoints) is ToS-safe. A clarification would resolve the P5 ambiguity.

---

## 6. Recommendation

1. **Do not build a native Pi Cursor/Devin bridge now.** All five paths are either ToS-blocked or offer no advantage over the existing executor.
2. **Keep the existing `cli-cursor`/`cli-devin` executor dispatch** as the supported Cursor/Devin surface. The research confirms this is the ToS-safe path.
3. **Track the two vendor feature requests** (§5) and re-evaluate when either ships.
4. **Re-verify the ToS landscape** before any future implementation. Both Cursor's ToS (Aug 13, 2026) and Cognition's (Jun 30, 2026) are recent and may change.

---

## 7. Residual UNKNOWNs

- Exact Cursor token persistence location (keychain vs Chromium secret store) — not dumped (out of scope; would require credential extraction).
- Whether consumer Devin Pro can mint v3 `cog_` service-user keys.
- Whether Cursor staff would explicitly bless CLI-spawn gateways (genuine ToS ambiguity, unresolved by the staff letter).

---

## 8. Parent-Purpose Alignment

The parent spec (`specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/spec.md`) defines the problem as investigating how `cli pi` can natively expose Cursor/Devin subscription-backed models, with ToS/account-safety in scope and implementation out of scope. This packet answers all five key questions with first-hand evidence and delivers a ranked verdict. The phase-transition rules gate implementation on a research verdict; this verdict is **not-feasible-now** pending the vendor feature requests in §5. Any future implementation packet should re-verify the ToS landscape at that time.

---

## 9. Iteration Index

| Iteration | Focus | Ratio | Findings |
|-----------|-------|-------|----------|
| 1 | Pi /model picker + provider hooks | 1.00 | 8 |
| 2 | Cursor auth, api2.cursor.sh, ToS §1.5 | 0.85 | 7 |
| 3 | Devin OAuth, credentials.toml, session REST, ToS §2.3 | 0.80 | 7 |
| 4 | Local gateway fronting official CLIs vs private proxies | 0.70 | 7 |
| 5 | Ranked verdict and parent-purpose alignment | 0.45 | 6 |

Total: 27 key findings, 5/5 questions answered, 6 ruled-out directions.

---

## 10. Sources

| Source | Type | Iterations |
|--------|------|------------|
| `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md` | Installed docs | 1 |
| `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/providers.md` | Installed docs | 1 |
| `~/.pi/agent/auth.json` (keys only) | Live config | 1 |
| `~/.pi/agent/models-store.json` | Live config | 1 |
| `.pi/models.json` + `.pi/PLUGINS.md` | Repo overlay | 1 |
| `pi --version` / `--help` / `--list-models` | Live CLI | 1 |
| `cursor-agent about` | Live CLI | 2 |
| `~/.cursor/cli-config.json` (keys only) | Live config | 2 |
| `https://cursor.com/terms-of-service` §1.5 | Official ToS | 2 |
| `https://forum.cursor.com/t/.../167778` (staff) | Staff ruling | 2 |
| `devin auth status` / `devin models list` / `devin acp --help` | Live CLI | 3 |
| `~/.local/share/devin/credentials.toml` (keys only) | Live config | 3 |
| `https://cognition.com/legal/platform-terms-of-service` §2.3 | Official ToS | 3 |
| `https://cognitionai.mintlify.app/api-reference/overview` | Official API docs | 3 |
| `https://github.com/tageecc/cursor-agent-api-proxy` | Community project | 4 |
| `https://github.com/timxx/Cursor-To-OpenAI` | Community project | 4 |
| Parent `spec.md` | Repo spec | 5 |
