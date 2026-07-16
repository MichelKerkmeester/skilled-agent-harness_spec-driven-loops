# mcp-mobbin Installation Guide

Verify-only setup guide for the `mcp-mobbin` skill, the read-only Mobbin design-research transport. There is **nothing to install and no config to write from this packet**: the provider is a hosted remote service, the `mobbin` Code Mode manual **is registered** in `.utcp_config.json` (operator-applied 2026-07-16), and this guide never rewrites configuration. Setup means verifying the runtime and the registered manual, understanding the plan gating and the OAuth-only auth model, and knowing exactly which steps remain the operator's (Code Mode reconnect and browser OAuth).

> **Access trap, read first.** Mobbin MCP access requires a **paid plan: Pro, Team, or Enterprise** — the Free plan has no MCP access (the exact denial semantics are unverified; do not guess them). Authentication is **browser OAuth only**: there is **no API key and no auth env var** for Mobbin MCP — do not invent one. Unauthenticated requests return HTTP 401. The service enforces **60 requests per 60 seconds per user**.
> **Bridge (registered):** `npx -y mcp-remote https://api.mobbin.com/mcp` (stdio, launched by Code Mode from the registered manual) | **Dependencies:** Node.js 18+ and working `npx` for the bridge

**Version:** 1.1.0.0 | **Updated:** 2026-07-16 | **Transport:** hosted Streamable HTTP via mcp-remote (stdio bridge); manual registered — discovery and OAuth pending

---

## 0. AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get setup help:**

```
I want to verify the mcp-mobbin skill (the Mobbin design-research MCP through Code Mode).

Please help me:
1. Check that Node.js 18+ and npx are available
2. Run the skill's scripts/doctor.sh (read-only) and report the 'mobbin' manual state in .utcp_config.json
   (the manual IS registered - presence is the healthy result; absence means a broken registration to escalate)
3. Explain the plan requirement (Mobbin Pro, Team, or Enterprise; Free has no MCP access)
4. Explain the auth model (browser OAuth only - there is NO API key or auth env var) and tell me exactly
   which steps are mine to do (Code Mode reconnect + browser OAuth), then STOP there
5. Confirm the callables inside Code Mode with tool_info (discovery works pre-auth; confirmed
   2026-07-16: mobbin.mobbin_search_screens plus search_flows and search_sections -
   see references/discovery_fixture_2026-07-16.json)

Do NOT edit .utcp_config.json, do NOT invent a MOBBIN_API_KEY, do NOT touch ~/.mcp-auth,
and never handle my credentials.
```

The AI will:
- Verify Node.js 18+ and npx on your system
- Run `scripts/doctor.sh`, which verifies only and never edits configuration or auth state
- Report the manual's registration state honestly (registered; absence escalated as a failure) without touching the config
- Explain the OAuth-only model and surface the operator-only steps, then wait
- Confirm the callable through Code Mode discovery only after your OAuth, in a fresh session

**Expected setup time:** 2 to 5 minutes for verification; the Code Mode reconnect and OAuth are operator steps

### Quick Success Check (30 seconds)

1. Run `bash scripts/doctor.sh` from the skill folder. `OK 'mobbin' manual registered in .utcp_config.json` plus the bridge shape means the packet and the wiring state agree (absence would report ERR).
2. Run `MOBBIN_DOCTOR_LIVE=1 bash scripts/doctor.sh`. `HTTP 401` means the endpoint is reachable and correctly requires OAuth.
3. After operator OAuth, inside a fresh Code Mode session: `tool_info({ tool_name: "mobbin.mobbin_search_screens" })` returns a schema (or the actual live name, which then supersedes the prediction).

Not working? Go to [Troubleshooting](#6-troubleshooting).

---

## 1. OVERVIEW

`mcp-mobbin` reaches the remote, paid Mobbin MCP (`https://api.mobbin.com/mcp`, hosted Streamable HTTP; the official repo is registration metadata only, so there is no server to install) through this project's Code Mode. The registered `mobbin` manual launches `npx -y mcp-remote`, which bridges Code Mode's stdio to Mobbin's remote endpoint (HTTP-first; SSE fallback only after a 404; never forced) — in any Code Mode session started after the registration.

### Core Principle

> **Verify, never rewrite.** The manual is registered and operator-owned. This guide adds no configuration, edits no files, invents no credentials, and treats the Code Mode reconnect and authentication as operator-only actions. A broken registration is escalated, never repaired here.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              CLI AI Agents (OpenCode / Claude Code)          │
└──────────────────────────────┬───────────────────────────────┘
                               │ Code Mode (call_tool_chain)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  mobbin manual (.utcp_config.json — REGISTERED 2026-07-16)   │
│  npx -y mcp-remote https://api.mobbin.com/mcp  (stdio)       │
└──────────────────────────────┬───────────────────────────────┘
                               │ remote Streamable HTTP + browser OAuth (no API key)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Mobbin MCP (paid, hosted: search_screens design research)   │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PREREQUISITES

- [ ] **Node.js 18 or newer** on PATH (`node -v`) — the `mcp-remote` bridge requires it
- [ ] **npx** available (`npx --version`); Code Mode launches the bridge once registered, you never run it yourself
- [ ] **A Mobbin account on a paid plan** (Pro, Team, or Enterprise; Free has no MCP access; per-plan usage caps within eligible tiers are undocumented)
- [ ] **A browser-capable session** for the first OAuth authorization (headless/CI sessions cannot complete the flow and there is no token-paste alternative — no API key exists)

### Validation: `phase_1_complete`

```bash
node -v && npx --version
```

**Checklist**:
- [ ] `node -v` shows v18 or higher
- [ ] `npx --version` returns a version with no error
- [ ] You know which Mobbin plan the account is on

❌ **STOP if validation fails.** Fix prerequisites before continuing.

---

## 3. VERIFY THE WIRING STATE (READ-ONLY)

```bash
bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh
```

`doctor.sh` is a non-interactive, read-only report. It checks Node and npx, greps `.utcp_config.json` for the `mobbin` manual (it never edits the file), states the auth and plan expectations, and optionally probes the endpoint. **Manual presence is the healthy result; absence now reports as an ERROR** — a broken or reverted registration to escalate, never to repair from this guide.

```bash
MOBBIN_DOCTOR_LIVE=1 bash .opencode/skills/mcp-tooling/mcp-mobbin/scripts/doctor.sh
```

The gated live probe sends one unauthenticated HTTPS request. **HTTP 401 is the healthy result**: it proves the endpoint is reachable and requires OAuth, matching the documented behavior (the observed challenge carries a `WWW-Authenticate` pointer to the OAuth protected-resource metadata).

### Validation: `phase_2_complete`

**Checklist**:
- [ ] `doctor.sh` reports `OK 'mobbin' manual registered` plus the bridge shape (absence = ERR, escalate)
- [ ] The gated probe (if run) reports HTTP 401
- [ ] Nothing was edited: no config change, no auth-state change, no credential invented

❌ **STOP if validation fails.** If the manual is missing or malformed, that is a finding for the operator who owns the registration, not something this guide repairs.

---

## 4. RECONNECT AND AUTHENTICATE (OPERATOR-ONLY)

> **This entire section is performed by the operator — never by the agent.** The agent surfaces these steps and waits. It never edits `.utcp_config.json`, never opens the OAuth URL on your behalf, never reads or repairs `~/.mcp-auth`, and never handles tokens.

### Step A: reconnect Code Mode

The `mobbin` manual is already registered in `manual_call_templates[]` of `.utcp_config.json` (stdio, `npx -y mcp-remote https://api.mobbin.com/mcp`, **empty `env`** — no credential of any kind, and no `.env` line; reference shape in [`assets/utcp_mobbin_manual.md`](assets/utcp_mobbin_manual.md)). Reconnect Code Mode so the manual loads: manuals load at startup, so any session opened before the registration cannot see it.

### Step B: browser OAuth (the only auth path)

1. Trigger a first Mobbin call through Code Mode (or let the agent attempt discovery). With no credential configured — which is the only correct configuration — `mcp-remote` starts a browser OAuth flow (protected-resource discovery, Dynamic Client Registration per RFC 7591, authorization-code + PKCE S256, `openid` scope).
2. Complete the authorization in your browser with your paid Mobbin account. Access is revocable later from Mobbin Account Settings -> MCP.
3. Auth state persists under `~/.mcp-auth` (or `MCP_REMOTE_CONFIG_DIR`). It is yours; the skill never touches it. Ephemeral runtimes without a persistent home may need to re-authenticate.

> **Honesty note:** end-to-end OAuth completion through this bridge is **Inferred**, not verified in this repo's record. A live unauthenticated probe confirmed the OAuth shape (401 + protected-resource metadata; the authorization server publishes DCR and PKCE S256), but no operator has completed the flow. If it fails, that is a finding to report, not to work around silently — and never by inventing an API key, because none exists.

### Validation: `phase_3_complete`

- [ ] Code Mode was reconnected after the registration (the `mobbin` manual resolves in the fresh session)
- [ ] You completed the browser authorization on a paid account
- [ ] No token, header, or auth-state content was pasted into any chat, file, or evidence; the manual `env` is still empty

---

## 5. CONFIRM THE CALLABLE (INSIDE CODE MODE)

The mandatory confirmation step runs inside Code Mode, not in a shell:

```typescript
// Convention predicts dotted discovery: mobbin.mobbin.search_screens
const all = await list_tools();
// MANDATORY: confirm the exact callable + schema before any real call
const info = await tool_info({ tool_name: "mobbin.mobbin_search_screens" });
```

Expected: `search_screens` resolves under the `mobbin` manual. The predicted callable form is **Inferred from the `{manual}.{manual}_{tool}` convention and has never been observed live** — whatever name `tool_info` returns supersedes the prediction. Record the dated live tool list and schema; check the open items (is `deep` a client input? any fields beyond `query`/`platform`/`limit`?); **fail closed** if tools are missing, renamed, or expanded, and refuse any mutation-capable tool outright.

### Validation: `phase_4_complete`

- [ ] `tool_info` returned a schema for the live callable (predicted or corrected)
- [x] The live tool set was compared against the documented baseline: pre-auth discovery 2026-07-16 lists THREE tools (`search_screens`, `search_flows`, `search_sections`), superseding the one-tool baseline — recorded as a reviewed packet update, not drift-improvisation [evidence: `references/discovery_fixture_2026-07-16.json` `list_tools` payload]
- [ ] A first `limit: 1` smoke search returned `screens[]` + `failed[]`, and inline-image arrival through `call_tool_chain` was observed (its fidelity is UNKNOWN until this step)

---

## 6. TROUBLESHOOTING

| Error | Cause | Fix |
| ----- | ----- | --- |
| No `mobbin.*` tools resolve | Code Mode session predates the registration, OAuth incomplete, or the registration broke (`doctor.sh` absence = ERR) | Reconnect Code Mode in a fresh session, re-run `doctor.sh`, complete Section 4; a missing manual is escalated to the operator |
| HTTP 401 on every call | Not authenticated; the empty manual `env` is correct, not the problem | Complete the operator browser OAuth (Section 4) on a paid account. **Never add an API key — none exists** |
| OAuth callback fails or times out | Headless session or blocked localhost callback | Retry in a browser-capable session; there is no token-paste or API-key alternative for MCP |
| Access denied despite auth | The account is on the Free plan (no MCP access; exact denial semantics unverified) | Upgrade the plan; relay the provider's message verbatim; do not guess semantics |
| HTTP 429 | The 60 requests / 60 seconds / user window was exceeded | Honor `Retry-After`, then exponential backoff with jitter |
| Callable name differs from the fixture baseline | Provider or adapter drift since the 2026-07-16 discovery (`mobbin.mobbin_search_screens` et al. are confirmed, not permanent) | Use the name `tool_info` returns; save a fresh dated fixture; update the packet docs |
| Images missing or garbled in results | `failed[]` partial success, or inline-image fidelity through `call_tool_chain` (UNKNOWN until observed) | Report partial success; verify fidelity at this install step; plan a side-channel if needed |
| Auth lost after a machine/runtime move | Auth state under `~/.mcp-auth` did not survive | Re-authenticate (operator). Never delete or repair the directory as an agent action |

See [`references/troubleshooting.md`](references/troubleshooting.md) for the full symptom, cause, and fix detail.

---

## 7. RESOURCES

### File Locations

| Path | Purpose |
| ---- | ------- |
| `scripts/doctor.sh` | Read-only diagnostics; manual absence now an ERROR (broken registration); gated live probe via `MOBBIN_DOCTOR_LIVE=1` |
| `scripts/install.sh` | Non-interactive verify-only posture check: Node 18+/npx, registered manual presence, operator OAuth pointer |
| `assets/utcp_mobbin_manual.md` | The registered manual's reference shape + post-registration checklist (doc-side executed; live pending) |
| `examples/` | Worked Code Mode walkthroughs (smoke search, platform-filtered flow research, element intent) |
| `.utcp_config.json` (repo root) | Holds the registered `mobbin` manual (2026-07-16); **never edited by this skill** |
| `~/.mcp-auth` (or `MCP_REMOTE_CONFIG_DIR`) | Operator-owned auth state; **never touched by this skill** |

### Related Documentation

| Document | Location | Purpose |
| -------- | -------- | ------- |
| README | `.opencode/skills/mcp-tooling/mcp-mobbin/README.md` | Human orientation and quick start |
| SKILL.md | `.opencode/skills/mcp-tooling/mcp-mobbin/SKILL.md` | Runtime instructions and routing |
| Tool Surface | `.opencode/skills/mcp-tooling/mcp-mobbin/references/tool_surface.md` | The single-tool contract, intent workflows, plan gating, and rate limit |
| MCP Wiring | `.opencode/skills/mcp-tooling/mcp-mobbin/references/mcp_wiring.md` | Registered manual, bridge, OAuth/DCR/PKCE, inferred naming, discovery |
| Troubleshooting | `.opencode/skills/mcp-tooling/mcp-mobbin/references/troubleshooting.md` | Full failure-mode table |

### Licensing and Upstream

The Mobbin MCP is a **paid hosted external service** (`api.mobbin.com/mcp`; docs at docs.mobbin.com/mcp; the official `mobbin/mobbin-mcp-server` repository holds registration metadata only — nothing to clone or build). The `mcp-remote` bridge is a separate open-source project on npm (unpinned in the registered manual; experimental per its own description; Node 18+). The official [mobbin/skills](https://github.com/mobbin/skills) repository (MIT) holds the single `mobbin-search` skill; `npx skills add mobbin/skills` installs that guidance only and does not replace the MCP manual or OAuth. Nothing is vendored here.

---

## Quick Reference Card

### Verify

```bash
bash scripts/doctor.sh                        # read-only wiring-state + runtime report (manual registered = OK; absence = ERR)
bash scripts/install.sh                       # non-interactive verify-only posture check (never edits anything)
MOBBIN_DOCTOR_LIVE=1 bash scripts/doctor.sh   # + one unauthenticated probe (expect 401)
```

### Reconnect + authenticate (operator-only)

The manual is registered (empty `env`; no credential exists to add). Reconnect Code Mode, complete browser OAuth on a Pro/Team/Enterprise account; auth state persists in `~/.mcp-auth`.

### Confirm (inside Code Mode)

```typescript
tool_info({ tool_name: "mobbin.mobbin_search_screens" })  // Inferred prediction; the live answer supersedes it
```

### Validation Checkpoints Summary

| Checkpoint | Meaning |
| ---------- | ------- |
| `phase_1_complete` | Node 18+/npx present; plan known |
| `phase_2_complete` | Wiring state verified read-only (manual registered = OK); probe returns 401 |
| `phase_3_complete` | Operator Code Mode reconnect + browser OAuth completed; env still empty |
| `phase_4_complete` | Live callables confirmed via `tool_info` (done 2026-07-16, pre-auth; three-tool baseline recorded); smoke search observed (still pends operator OAuth) |

---

## Version History

| Version | Date | Changes |
| ------- | ---- | ------- |
| 1.1.0.0 | 2026-07-16 | Registered-state truth: the `mobbin` manual is registered in `.utcp_config.json`, manual absence flipped to an ERROR in `doctor.sh`, Section 4 reframed as reconnect + OAuth (operator-only), and the new verify-only `scripts/install.sh` plus `examples/` walkthroughs documented. |
| 1.0.0.0 | 2026-07-16 | First release. Verify-only guide for the pre-registration state: read-only doctor with absence-expected reporting, gated 401 probe, operator-only registration + OAuth steps fenced to a later phase, and the Inferred-callable confirmation flow. |

---

**Need help?** See [Troubleshooting](#6-troubleshooting) or load the `mcp-mobbin` skill for detailed workflows.
