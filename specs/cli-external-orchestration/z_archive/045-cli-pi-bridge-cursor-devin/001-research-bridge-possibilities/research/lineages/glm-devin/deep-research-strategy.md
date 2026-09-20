---
title: Deep Research Strategy - glm-devin lineage
description: Lineage-local strategy for Pi native Cursor/Devin model-bridge research.
trigger_phrases:
  - "pi cursor devin models bridge"
  - "pi custom provider gateway"
importance_tier: important
contextType: research
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

Lineage: glm-devin. Executor: cli-devin / glm-5-2. Stop policy: max-iterations (5). Convergence is telemetry only.

## 1. OVERVIEW

### Purpose

Persistent research plan for exposing Cursor and Devin subscription-backed models inside Pi's own `/models` picker.

---

## 2. TOPIC
How can cli pi (the pi CLI) natively expose Cursor and Devin subscription-backed models in its own /models picker: reusing the operator Cursor (cursor-agent) and Devin OAuth/subscription auth, adding pi provider adapters, or fronting each vendor CLI with a local OpenAI-compatible gateway. Assess technical feasibility and the Terms-of-Service and account-safety boundaries of each path, grounded in the actual pi, cursor-agent, and devin CLI surfaces (config files, auth token stores, model APIs).

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
Generated from the reducer registry.

- [x] How does Pi's /model picker resolve providers and models from config files, models-store, auth.json, and custom providers, and which extension hooks could carry a Cursor/Devin-shaped source?
- [x] Can Cursor subscription auth (cursor-agent OAuth, CURSOR_API_KEY, ~/.cursor stores) be reused by a Pi adapter or third-party HTTP client without violating ToS or account safety?
- [x] Can Devin OAuth (devin auth login, ~/.local/share/devin/credentials.toml) be reused similarly by a Pi adapter or gateway?
- [x] Can a local OpenAI-compatible gateway front cursor-agent or the Devin CLI so Pi treats it as a custom provider in /model?
- [x] Which path is technically feasible and account-safe, and how should the three paths be ranked against the parent spec's purpose?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Shipping a production bridge implementation in this packet.
- Changing the existing `cli-cursor` / `cli-devin` shell-out executor dispatch surfaces.
- Copying or publishing live auth tokens, API keys, or credential file contents into research artifacts.
- Inventing vendor APIs that are not visible on the installed CLIs or public docs.
- Claiming ToS permission from marketing copy alone.

---

## 5. STOP CONDITIONS
- Max iterations reached (5). Stop policy is `max-iterations`; early composite convergence is telemetry only.
- All five key questions have evidence-backed answers, including a ranked verdict or a documented not-feasible conclusion.
- Three consecutive stuck iterations with no new sources (recovery then synthesis with gaps).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- [x] How does Pi's /model picker resolve providers and models? → `/model` (interactive) + `pi --list-models` (CLI dump); roster = built-in catalogs + `models-store.json` cache + `models.json` overlay + `registerProvider`, auth-gated. Six authenticated providers on this machine; no built-in Cursor/Devin. Two hooks (`models.json` HTTP overlay, `registerProvider` extension) both expect an HTTP LLM API or `streamSimple`. (iteration 1)
- [x] Can Cursor subscription auth be reused safely? → No for OAuth/access-token reuse against `api2.cursor.sh` (staff ToS §1.5, ban risk; local-only does not help). `cli-config.json` holds identity/model prefs, not tokens. Official out-of-IDE surfaces (CLI/SDK/Cloud Agents) always run the agent harness, not raw completions. No public `/v1/chat/completions`. (iteration 2)
- [x] Can Devin OAuth be reused safely? → `credentials.toml` holds `windsurf_api_key` vs `server.codeium.com` (private backend); OAuth-only consumer CLI. Public `api.devin.ai` v3 is session REST (`POST .../sessions`), not chat completions. `devin acp` is stdio JSON-RPC. Cognition ToS §2.3 analog (no Pi-named staff letter); high risk. (iteration 3)
- [x] Can a local OpenAI-compatible gateway front the vendor CLIs? → Technically feasible as a Pi `models.json` provider (CLI-spawn class, e.g. `cursor-agent-api-proxy`). Two architectures: CLI-spawn (official client, ToS-ambiguous) vs reverse-engineered (private backend, blocked). Nested-harness breaks Pi's tool loop; vendor harness uses own tools; double-tool-execution risk; added latency. No Devin CLI-spawn proxy; `devin -p` = session-per-request (minutes). Repo already has `cli-cursor`/`cli-devin` executor dispatch — a Pi gateway duplicates it with extra hops. (iteration 4)
- [x] Ranked verdict? → No clean path. P1 built-in: ruled out. P2 Cursor token-reuse: ruled out (ToS §1.5). P3 Devin token-reuse: ruled out (ToS §2.3 analog). P4 reverse-engineered proxy: ruled out (§1.5(i)). P5 CLI-spawn gateway: conditionally feasible but not recommended (ToS-ambiguous, nested-harness, duplicates executor). Recommendation: do not build now; track Cursor public `/v1/chat/completions` + Devin raw-completions; keep existing `cli-cursor`/`cli-devin` executor dispatch. (iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Live `pi --version`/`--help`/`--list-models` plus `auth.json` key enumeration on the authenticated machine (iteration 1)
- Installed `docs/custom-provider.md` + `docs/providers.md` for the four-layer roster and nine API types (iteration 1)
- `.pi/PLUGINS.md` + `.pi/models.json` symlink for the overlay/cache-compat contract (iteration 1)
- First-hand fetch of Cursor ToS §1.5 and the staff forum thread for a verifiable ban-risk citation (iteration 2)
- `cursor-agent about` + `cli-config.json` key enumeration for the live auth/config shape (iteration 2)
- First-hand fetch of Cognition ToS §2.3 and the Devin API overview; live `devin auth status` + `credentials.toml` keys + `devin acp --help` (iteration 3)
- First-hand fetch of two community proxy projects (`cursor-agent-api-proxy` CLI-spawn vs `Cursor-To-OpenAI` reverse-engineered) for the architectural split (iteration 4)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Treating the user phrase `/models` as the literal slash command; Pi's command is `/model` (iteration 1)
- Expecting `~/.cursor/cli-config.json` to hold the OAuth bearer token; it holds identity/model prefs only (iteration 2)
- Expecting a consumer `devin --api-key` flag analogous to Cursor; consumer CLI is OAuth-only (iteration 3)
- Hoping `api.devin.ai` was an OpenAI-compatible `baseUrl`; it is session REST (iteration 3)
- No Devin CLI-spawn OpenAI proxy exists to study; Devin surfaces are session-based (iteration 4)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Token-reuse HTTP against private Cursor backends (iteration 2)
- Token-reuse HTTP against private Devin/Codeium backends (iteration 3)
- Reverse-engineered OpenAI proxies to private Cursor/Devin backends (iteration 4, re-confirmed blocked)
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Built-in Pi Cursor/Devin provider: absent from providers.md subscription list and live auth.json (iteration 1)
- Pi models.json / Oh My Pi-style Cursor provider using login tokens against api2.cursor.sh (iteration 2, staff ToS §1.5)
- Local OpenAI-compatible proxy to private Cursor client endpoints (iteration 2, staff: same case)
- Pi provider copying credentials.toml windsurf_api_key to server.codeium.com (iteration 3, Cognition ToS §2.3 analog)
- Treating api.devin.ai as an openai-completions baseUrl (iteration 3, session REST)
- Reverse-engineered OpenAI proxies to private Cursor/Devin backends (iteration 4, re-confirmed blocked class)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: Cursor + Devin private-endpoint token reuse; reverse-engineered proxies
- Pivot lineage: none yet
- Remaining frontier: Q5 open (ranked verdict and parent-purpose alignment)
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Residual UNKNOWN: exact Cursor token persistence (keychain vs Chromium) — not dumped
- Residual UNKNOWN: whether consumer Devin Pro can mint v3 cog_ service-user keys
- Residual UNKNOWN: whether Cursor staff would bless CLI-spawn gateways (genuine ToS ambiguity)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 5: ranked verdict — order the paths by technical feasibility and account-safety, map each to the parent spec's purpose, state the recommendation, and list open feature requests to track (Cursor public `/v1/chat/completions`, Devin raw-completions surface).
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers:
  - `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` — Pi is a multi-provider passthrough; live roster from `~/.pi/agent/auth.json` and `models-store.json`; no enforced allowlist at this layer.
  - `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md` — `pi --list-models`; default config dir `~/.pi/agent`; `PI_CODING_AGENT_DIR` override; `--provider` default `google`.
  - `.pi/PLUGINS.md` — repo `.pi/models.json` is a cache-compat overlay; canonical symlink `~/.pi/agent/models.json` → repo `.pi/models.json`; credentials stay in `auth.json` / `models-store.json`.
  - `.pi/models.json` — currently only `providers.opencode-go.compat.sendSessionAffinityHeaders`.
  - `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/custom-provider.md` — `pi.registerProvider()` full + legacy forms; API types; OAuth; `streamSimple`; `!command`/`$ENV` apiKey syntax.
  - `~/.local/lib/node_modules/@earendil-works/pi-coding-agent/docs/providers.md` — built-in subscription `/login` list (Codex, Claude Pro/Max, Copilot, xAI, OpenRouter, Radius); auth resolution order.
  - `.opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md` — `cursor-agent login` OAuth; `CURSOR_API_KEY` / `--api-key`; endpoint `https://api2.cursor.sh`; `cli-config.json` schema.
  - `.opencode/skills/cli-external-orchestration/cli-cursor/references/providers-and-models.md` — enforced 21-id allowlist; `auto` excluded.
  - `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md` — `devin auth login` OAuth only; credentials at `~/.local/share/devin/credentials.toml`; API `https://api.devin.ai`; `devin acp` ACP over stdio.
  - Parent spec `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/spec.md` — research first, implement later; ToS/account-safety is in-scope.
- Reuse candidates: Pi custom-provider `models.json` overlay (already used for `opencode-go`); existing `cli-cursor` / `cli-devin` executor dispatch (out of scope to change, useful as comparison).
- Integration points: Pi `/model` picker, `--provider`/`--model`, custom provider `baseUrl`/`api`/`apiKey`, Cursor `api2.cursor.sh`, Devin `api.devin.ai` / `server.codeium.com`.
- Constraints and risks: no child `spec.md` at `001-research-bridge-possibilities/` (folder_state no-spec; skip spec anchoring writes). Do not copy secrets. Fan-out write surface is this lineage directory only.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stopPolicy = max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output at this lineage root
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A
- Question injection surface: `inbox.jsonl` in this lineage directory
- Canonical pause sentinel: `.deep-research-pause` in this lineage directory
- Current generation: 1
- Started: 2026-08-17T13:19:40Z
- Write surface: `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities/research/lineages/glm-devin` only
