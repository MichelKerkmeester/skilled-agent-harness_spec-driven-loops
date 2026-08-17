---
title: Deep Research Strategy - grok-cursor lineage
description: Lineage-local strategy for Pi native Cursor/Devin model-bridge research.
trigger_phrases:
  - "pi cursor devin models bridge"
  - "pi custom provider gateway"
importance_tier: important
contextType: research
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking

Lineage: grok-cursor. Executor: cli-cursor / cursor-grok-4.6-xhigh. Stop policy: max-iterations (5). Convergence is telemetry only.

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

- [x] How does Pi's /models picker resolve providers and models from config files, models-store, auth.json, and custom providers?
- [x] Can Cursor subscription auth (cursor-agent OAuth, CURSOR_API_KEY, ~/.cursor stores) be reused by a Pi adapter or third-party client without violating ToS or account safety?
- [x] Can Devin OAuth (devin auth login, ~/.local/share/devin/credentials.toml) be reused similarly by a Pi adapter or gateway?
- [x] Can a local OpenAI-compatible gateway front cursor-agent or the Devin CLI so Pi treats it as a custom provider in /models?
- [x] Which path is technically feasible and account-safe, and how should the three paths be ranked?
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
- [x] How does Pi's /models picker resolve providers and models? → `/model` + `--list-models`; roster = catalogs + `models-store.json` + `models.json` overlay + `registerProvider`, auth-gated. No built-in Cursor/Devin. (iteration 1)
- [x] Can Cursor subscription auth be reused safely? → No for OAuth/access-token reuse against `api2.cursor.sh` (staff ToS §1.5, ban risk). Official User API keys work only through harness clients (CLI/SDK/Cloud Agents API), which are not raw `/v1/chat/completions`. (iteration 2)
- [x] Can Devin OAuth be reused safely? → `credentials.toml` holds `windsurf_api_key` vs `server.codeium.com`; copying among own machines is documented, feeding it to Pi as HTTP is not. Public API is session REST; ACP is stdio. Cognition ToS 2.3 analog. (iteration 3)
- [x] Can a local OpenAI-compatible gateway front the vendor CLIs? → Yes to *list* via `models.json` or `streamSimple` spawning official CLIs; nested harness makes it a poor native model. Private-endpoint gateways remain ToS-blocked. (iteration 4–5)
- [x] Ranked feasible/safe path? → Do not ship native `/model`. Keep `cli-cursor`/`cli-devin` dispatch. Reject token reuse and private proxies. CLI-front is experiment-only. (iteration 5)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Installed Pi 0.84.2 docs + redacted live `~/.pi/agent` schemas (iteration 1)
- Cursor staff Oh My Pi thread + ToS §1.5 as the closest prior art to this packet (iteration 2)
- Live `devin auth status` + redacted credentials.toml keys showing Windsurf/Codeium heritage (iteration 3)
- Separating CLI-spawn proxies from protobuf/private-API proxies (iteration 4)
- Ranking against the parent purpose, not just picker visibility (iteration 5)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- Treating the user phrase `/models` as the literal slash command; Pi's command is `/model` (iteration 1)
- Expecting `~/.cursor/cli-config.json` to hold the OAuth bearer token (iteration 2)
- Expecting a consumer `devin --api-key` flag analogous to Cursor (iteration 3)
- Hoping ACP or `streamSimple` would drop into `models.json` as a raw completions model (iterations 4–5)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
- Token-reuse HTTP against private Cursor/Devin backends (iterations 2–3, 5)
- Private-endpoint OpenAI proxies including protobuf reverse-engineering (iterations 2, 4)
- Native `/model` as a ToS-safe raw completions surface (iteration 5 ranking)
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Built-in Pi Cursor/Devin provider: absent from providers.md and live models-store.json (iteration 1)
- Pi models.json / Oh My Pi-style Cursor provider using login tokens against api2.cursor.sh (iteration 2, staff ToS §1.5)
- Local OpenAI-compatible proxy to private Cursor client endpoints (iteration 2, staff: same case)
- Pi provider copying credentials.toml windsurf_api_key to server.codeium.com (iteration 3, ToS 2.3 analog)
- Treating api.devin.ai as an openai-completions baseUrl (iteration 3, session REST)
- Reverse-engineered Cursor-To-OpenAI / protobuf HTTP2 as a "CLI gateway" (iteration 4)
- Advertising Cursor `auto` / full 150+ roster through a Pi overlay under this repo's allowlist policy (iteration 4)
- Shipping a native `/model` Cursor/Devin provider as the next implementation phase (iteration 5)
- Treating `registerProvider` `streamSimple` as a distinct safe native-model path (iteration 5)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none (all five key questions answered). Residual UNKNOWNs are non-blocking (token-store location, Devin v3 consumer keys, spawn-wrapper enforcement).
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- Residual UNKNOWN: exact Cursor token persistence (keychain vs Chromium) — not dumped.
- Residual UNKNOWN: whether consumer Devin Pro can mint v3 `cog_` keys.
- Residual UNKNOWN: Cursor staff enforcement against local CLI-spawn wrappers (no staff letter).
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
None. Lineage synthesis complete (`stopReason: maxIterationsReached`).
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md not present; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers:
  - `.opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md` — Pi is a multi-provider passthrough; live roster from `~/.pi/agent/auth.json` and `models-store.json`.
  - `.opencode/skills/cli-external-orchestration/cli-pi/references/cli-reference.md` — `pi --list-models`; default config dir `~/.pi/agent`; `PI_CODING_AGENT_DIR` override.
  - `.pi/PLUGINS.md` — repo `.pi/models.json` is a cache-compat overlay; canonical symlink `~/.pi/agent/models.json` → repo `.pi/models.json`; credentials stay in `auth.json` / `models-store.json`.
  - `.pi/models.json` — currently only `providers.opencode-go.compat.sendSessionAffinityHeaders`.
  - `.opencode/skills/cli-external-orchestration/cli-cursor/references/cli-reference.md` — `cursor-agent login` OAuth; `CURSOR_API_KEY` / `--api-key`; endpoint `https://api2.cursor.sh`.
  - `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md` — `devin auth login` OAuth only; credentials at `~/.local/share/devin/credentials.toml`; API `https://api.devin.ai`.
  - Parent spec `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/spec.md` — research first, implement later; ToS/account-safety is in-scope.
- Reuse candidates: Pi custom-provider `models.json` overlay (already used for `opencode-go`); existing `cli-cursor` / `cli-devin` executor dispatch (out of scope to change, useful as comparison).
- Integration points: Pi `/models` picker, `--provider`/`--model`, custom provider `baseUrl`/`api`/`apiKey`, Cursor `api2.cursor.sh`, Devin `api.devin.ai`.
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
- Started: 2026-08-17T10:26:00Z
- Write surface: `specs/cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities/research/lineages/grok-cursor` only
