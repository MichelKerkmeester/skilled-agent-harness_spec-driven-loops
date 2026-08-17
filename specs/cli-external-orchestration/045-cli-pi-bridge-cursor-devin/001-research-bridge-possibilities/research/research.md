---
title: "Consolidated Research: Native Pi /model Bridge to Cursor & Devin Subscription Models"
description: "Two-model deep-research synthesis (Grok-4.6-xhigh via cli-cursor + GLM-5.2-High via cli-devin, 5 forced-depth iterations each) on whether cli pi can natively expose Cursor and Devin subscription-backed models in its /model picker."
lineages:
  - grok-cursor (cursor-grok-4.6-xhigh, 5 iters, complete)
  - glm-devin (glm-5-2, 5 iters, complete)
verdict: not-feasible-now
convergence: strong (both models independently reached the same verdict)
created: 2026-08-17
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/045-cli-pi-bridge-cursor-devin/001-research-bridge-possibilities"
    last_updated_at: "2026-08-17T11:46:00Z"
    last_updated_by: "claude"
    recent_action: "Consolidated two-model synthesis authored"
    next_safe_action: "Close packet"
    blockers: []
    key_files:
      - "research/lineages/grok-cursor/research.md"
      - "research/lineages/glm-devin/research.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "research-045-001"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Consolidated Research: Native Pi `/model` Bridge to Cursor & Devin Subscription Models

> **Method.** Two independent 5-iteration deep-research lineages, forced depth (no early convergence): **Grok-4.6-xhigh** via `cli-cursor` and **GLM-5.2-High** via `cli-devin`. Each grounded its findings in the live `pi`, `cursor-agent`, and `devin` CLI surfaces plus the vendors' Terms of Service. Per-lineage syntheses: `research/lineages/grok-cursor/research.md` and `research/lineages/glm-devin/research.md`.

---

## 1. Executive Verdict

**Not feasible now — do not build a native pi `/model` provider for Cursor or Devin subscription models. Keep the existing `cli-cursor` / `cli-devin` executor dispatch.**

Both models reached this verdict independently, which is strong cross-model validation. No path is simultaneously (a) a raw completions row in pi's picker and (b) permitted by the vendors' Terms of Service on their official surfaces.

The three approaches in the original question resolve as:

1. **Reuse Cursor/Devin OAuth/subscription tokens inside pi** — **ToS-blocked.** Cursor staff ruled on the record (forum thread, Aug 2026) that pointing a local OpenAI-compatible client at Cursor's private endpoints violates ToS §1.5 (reverse engineering / internal-structure access) and risks an account ban; "personal, local-only" does not change it. Devin is the same shape against `server.codeium.com` (`credentials.toml`'s `windsurf_api_key` is the whole account) — a Cognition Platform ToS §2.3 analog with high suspension risk. **Hard reject.**
2. **Pi provider adapters** (`models.json` / `pi.registerProvider()`) — pi accepts only 9 HTTP API types (e.g. `openai-completions`, `anthropic-messages`) or a custom `streamSimple`. Cursor's `api2.cursor.sh` is private Connect-RPC/protobuf; Devin's public `api.devin.ai` v3 is **session REST**, not chat completions. Both official surfaces are **session/harness products, not raw model APIs** — an adapter would re-implement the vendor agent. **Not a native model.**
3. **Local OpenAI-compatible gateway fronting each CLI** — the only *technically feasible* path (an exemplar exists: `cursor-agent-api-proxy`), but **not recommended.** It produces a **nested harness** (pi's tool loop wrapping the vendor's tool loop → collapsed tool-calling, added agent-turn latency), it duplicates the repo's existing `cli-cursor`/`cli-devin` dispatch, and for Cursor it remains ToS-ambiguous (staff did not bless CLI-spawn wrappers). Devin has no such proxy and `devin -p` spawns a full minutes-long session per request — unsuitable for interactive `/model`.

---

## 2. Cross-Model Agreement

| Question | Grok-4.6-xhigh (cursor) | GLM-5.2-High (devin) | Agreement |
|----------|--------------------------|-----------------------|-----------|
| Native built-in Cursor/Devin provider in pi? | None exists | None exists | ✅ Ruled out |
| Reuse Cursor token in a pi HTTP provider? | ToS-blocked (staff §1.5), ban risk | ToS-blocked (staff §1.5), ban risk | ✅ Hard reject |
| Reuse Devin `windsurf_api_key`? | High-risk §2.3 analog; full-account credential | High-risk §2.3 analog; full-account credential | ✅ Hard reject |
| Provider adapter over official APIs? | Official surfaces are session/harness, not completions | Same; 9 pi API types, none fits | ✅ Not a native model |
| Local CLI-spawn gateway? | Feasible-to-list, nested-harness cost, not recommended | Feasible, ToS-ambiguous, not recommended | ✅ Not recommended |
| Overall | Keep `cli-cursor`/`cli-devin` shell-out | Keep `cli-cursor`/`cli-devin` shell-out | ✅ **Same verdict** |

---

## 3. How pi's `/model` picker actually works

`/model` (singular) is the interactive selector; `pi --list-models [search]` is the headless dump. The roster composes from four layers: shipped built-in catalogs (six subscription `/login` providers + ~20 env-var API-key providers), an auto-refreshed provider cache (`~/.pi/agent/models-store.json`), an operator overlay (`~/.pi/agent/models.json` → repo `.pi/models.json`), and the extension registry (`pi.registerProvider()`). The two extension points both expect an **HTTP LLM API** (one of 9 `api` types) or a custom `streamSimple` implementation — **a sibling-CLI subprocess is not a native provider shape.** Picker visibility is auth-gated; the built-in subscription `/login` list (Codex, Claude Pro/Max, Copilot, xAI, OpenRouter, Radius) **excludes both Cursor and Devin.**

---

## 4. Cursor & Devin auth / API / ToS

- **Cursor.** `~/.cursor/cli-config.json` holds identity + model preferences, not OAuth tokens (a token-copy adapter would first have to extract them from the keychain/Chromium store). `api2.cursor.sh` is a private Connect-RPC agent backend. Supported out-of-IDE paths (CLI, Agent SDK, Cloud Agents API) **always run the agent harness, not a raw model.** No public `/v1/chat/completions` (tracked as an open feature request). Staff on record: local OpenAI-compatible proxies to the private endpoints violate ToS §1.5 and risk a ban.
- **Devin.** Consumer CLI auth is OAuth-only (`devin auth login`); `~/.local/share/devin/credentials.toml` stores `windsurf_api_key` pinned to `server.codeium.com`. Public `api.devin.ai` v3 is **session REST** (`POST /sessions` with a prompt), authenticated by `cog_` service-user keys (teams/enterprise) or PATs — not OpenAI chat completions. `devin acp` is ACP JSON-RPC over stdio (an editor-integration protocol), still an agent harness.

---

## 5. Ranked path matrix (both lineages, reconciled)

| Path | Technical feasibility | Account-safety | ToS | Verdict |
|------|-----------------------|----------------|-----|---------|
| P1 — Built-in pi Cursor/Devin provider | Not feasible (none exists) | n/a | n/a | Ruled out |
| P2 — Cursor token-reuse HTTP provider | Mechanically possible; wrong protocol (private Connect-RPC) | Unsafe (ban risk) | Violates §1.5 | Ruled out |
| P3 — Devin token-reuse HTTP provider | Not feasible (session REST, not completions) | Unsafe (full-account credential) | Violates §2.3 analog | Ruled out |
| P4 — Reverse-engineered OpenAI proxy | Feasible (exemplar exists) | Unsafe (ban risk) | Violates §1.5(i) | Ruled out |
| P5 — CLI-spawn OpenAI gateway | Feasible (exemplar for Cursor; none for Devin) | Ambiguous (third-party harness over subscription) | ToS-ambiguous (Cursor); worse (Devin) | Not recommended |

---

## 6. Recommendation

1. **Do not build a native pi Cursor/Devin `/model` bridge now.** Every path is either ToS-blocked or offers no advantage over the existing executor while adding a nested-harness cost.
2. **Keep `cli-cursor` / `cli-devin` executor dispatch** as the supported Cursor/Devin surface (official clients, enforced allowlists) — both models confirm this is the ToS-safe path.
3. **Do not** point `models.json` at `api2.cursor.sh` or `server.codeium.com`, and **do not** copy Cursor tokens or Devin's `windsurf_api_key` into pi `auth.json`.
4. **Re-verify the ToS landscape** before any future implementation — both vendors' terms are recent (Cursor Aug 13, 2026; Cognition Jun 30, 2026).

---

## 7. Unblock conditions (open feature requests to track)

1. **Cursor public OpenAI-compatible `/v1/chat/completions`** (staff-confirmed open FR). If shipped, a pi `models.json` provider could call it directly with a Cursor User API Key — eliminating the reverse-engineering and private-endpoint ToS problems.
2. **A Devin raw-completions surface** (or a consumer-Pro `cog_` service-user key path). Devin's current public API is session REST; a completions surface would enable a pi provider. (UNKNOWN whether consumer Devin Pro can mint v3 `cog_` keys.)
3. **Cursor staff clarification on CLI-spawn gateways** — would resolve the sole remaining P5 ambiguity.

---

## 8. Residual UNKNOWNs

- Exact Cursor token persistence location (keychain vs Chromium secret store) — not extracted (out of scope).
- Whether consumer Devin Pro can mint v3 `cog_` service-user keys.
- Whether Cursor staff would explicitly permit CLI-spawn gateways that front the official client rather than private endpoints.

---

## 9. Provenance

| Lineage | Executor | Model | Iterations | Status | Detailed synthesis |
|---------|----------|-------|------------|--------|--------------------|
| grok-cursor | cli-cursor | cursor-grok-4.6-xhigh | 5/5 | complete | `research/lineages/grok-cursor/research.md` |
| glm-devin | cli-devin | glm-5-2 (GLM-5.2-High) | 5/5 | complete | `research/lineages/glm-devin/research.md` |

Both lineages ran to their forced-depth iteration cap and emitted their completion sentinel. Each was independently marked a write-containment failure by the fan-out guard (an unrelated session-side-effect interaction, tracked separately) after producing its full synthesis; both syntheses were recovered intact and consolidated here.

Detailed per-model evidence tables, iteration logs, and source lists live in the two lineage folders and their `iterations/`.
