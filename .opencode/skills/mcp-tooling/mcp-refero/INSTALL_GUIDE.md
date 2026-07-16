# mcp-refero Installation Guide

Verify-only setup guide for the `mcp-refero` skill, the read-only Refero design-reference transport. There is **nothing to install and no config to write**: the `refero` Code Mode manual is already registered in this repo's `.utcp_config.json` and is validated as-is. Setup means verifying the wiring, understanding the plan gating, and completing the **operator-only** authentication step. This guide never rewrites configuration.

> **Access trap, read first.** Live Refero MCP access requires a **Pro plan or higher**. The Free plan has **no MCP access at all** (an access denial, not a smaller tool set). Unauthenticated requests return HTTP 401. Pro carries a published quota of **8,000 MCP tool calls per month**.
> **Bridge:** `npx -y mcp-remote https://api.refero.design/mcp` (stdio, launched by Code Mode) | **Dependencies:** Node.js 18+ for the bridge; this project's Code Mode currently runs on Node 24

**Version:** 1.0.0.0 | **Updated:** 2026-07-16 | **Transport:** remote HTTP via mcp-remote (stdio bridge)

---

## 0. AI-FIRST INSTALL GUIDE

**Copy and paste this prompt to your AI assistant to get setup help:**

```
I want to verify the mcp-refero skill (the Refero design-reference MCP through Code Mode).

Please help me:
1. Check that Node.js 18+ and npx are available
2. Run the skill's scripts/doctor.sh (read-only) and confirm the 'refero' manual is registered in .utcp_config.json
3. Explain the plan requirement (Refero Pro or higher; Free has no MCP access)
4. Tell me exactly which authentication step is mine to do (browser OAuth, operator-only) and STOP there
5. Confirm the callables inside Code Mode with tool_info (doubled prefix: refero.refero_refero_<tool>; discovery works pre-auth — confirmed 2026-07-16)

Do NOT edit .utcp_config.json, do NOT touch ~/.mcp-auth, and never handle my credentials.
```

The AI will:
- Verify Node.js 18+ and npx on your system
- Run `scripts/doctor.sh`, which verifies only and never edits configuration or auth state
- Confirm the `refero` manual is present (read-only grep) rather than re-adding it
- Surface the operator-only OAuth step and wait for you to complete it
- Confirm the doubled-prefix callables through Code Mode discovery (pre-auth; first satisfied 2026-07-16 — see `references/discovery_fixture_2026-07-16.json`)

**Expected setup time:** 2 to 5 minutes, plus the operator OAuth step

### Quick Success Check (30 seconds)

1. Run `bash scripts/doctor.sh` from the skill folder. `OK 'refero' manual registered` means the wiring is present.
2. Run `REFERO_DOCTOR_LIVE=1 bash scripts/doctor.sh`. `HTTP 401` means the endpoint is reachable and correctly requires auth.
3. After operator OAuth, inside Code Mode: `tool_info({ tool_name: "refero.refero_refero_search_styles" })` returns a schema.

Not working? Go to [Troubleshooting](#6-troubleshooting).

---

## 1. OVERVIEW

`mcp-refero` reaches the remote, paid, read-only Refero MCP (`https://api.refero.design/mcp`) through this project's Code Mode. The registered `refero` manual launches `npx -y mcp-remote`, which bridges Code Mode's stdio to Refero's remote HTTP endpoint (HTTP-first; SSE fallback only after a 404; never forced).

### Core Principle

> **Verify, never rewrite.** The manual exists and is validated as-is. This guide adds no configuration, edits no files, and treats authentication as an operator-only action.

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│              CLI AI Agents (OpenCode / Claude Code)          │
└──────────────────────────────┬───────────────────────────────┘
                               │ Code Mode (call_tool_chain)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  refero manual (.utcp_config.json, already registered)       │
│  npx -y mcp-remote https://api.refero.design/mcp  (stdio)    │
└──────────────────────────────┬───────────────────────────────┘
                               │ remote HTTP + OAuth/Bearer
                               ▼
┌─────────────────────────────────────────────────────────────┐
│  Refero MCP (paid, read-only: styles / screens / flows)      │
└─────────────────────────────────────────────────────────────┘
```

---

## 2. PREREQUISITES

- [ ] **Node.js 18 or newer** on PATH (`node -v`); note that this project's Code Mode itself currently runs on Node 24 (Node 25 crashes `call_tool_chain`)
- [ ] **npx** available (`npx --version`); Code Mode launches the bridge, you never run it yourself
- [ ] **A Refero account on the Pro plan or higher** (Free has no MCP access)
- [ ] **A browser-capable session** for the first OAuth authorization (headless/CI environments likely need the documented Bearer alternative instead; obtaining a token is account-side and undocumented here)

### Validation: `phase_1_complete`

```bash
node -v && npx --version
```

**Checklist**:
- [ ] `node -v` shows v18 or higher
- [ ] `npx --version` returns a version with no error
- [ ] You know which Refero plan the account is on

❌ **STOP if validation fails.** Fix prerequisites before continuing.

---

## 3. VERIFY THE WIRING (READ-ONLY)

```bash
bash .opencode/skills/mcp-tooling/mcp-refero/scripts/doctor.sh
```

`doctor.sh` is a non-interactive, read-only report. It checks Node and npx, greps `.utcp_config.json` for the registered `refero` manual (it never edits the file), states the auth expectations, and optionally probes the endpoint.

```bash
REFERO_DOCTOR_LIVE=1 bash .opencode/skills/mcp-tooling/mcp-refero/scripts/doctor.sh
```

The gated live probe sends one unauthenticated HTTPS request. **HTTP 401 is the healthy result**: it proves the endpoint is reachable and requires auth, matching the documented behavior.

### Validation: `phase_2_complete`

**Checklist**:
- [ ] `doctor.sh` reports `OK 'refero' manual registered in .utcp_config.json`
- [ ] The gated probe (if run) reports HTTP 401
- [ ] Nothing was edited: no config change, no auth-state change

❌ **STOP if validation fails.** If the manual is missing, its registration is an operator decision made outside this skill; this guide never adds it.

---

## 4. AUTHENTICATE (OPERATOR-ONLY)

> **This entire section is performed by the operator, never by the agent.** The agent surfaces this step and waits. It never opens the OAuth URL on your behalf, never reads or repairs `~/.mcp-auth`, and never handles tokens.

### Default path: browser OAuth

1. Trigger a first Refero call through Code Mode (or let the agent attempt discovery). With no custom header, `mcp-remote` starts a browser OAuth flow with a localhost callback (port 3334 by default; 30-second default callback timeout).
2. Complete the authorization in your browser with your Pro (or higher) Refero account.
3. Auth state (client info, tokens, PKCE state) persists under `~/.mcp-auth` (or `MCP_REMOTE_CONFIG_DIR`). It is yours; the skill never touches it. Ephemeral runtimes without a persistent home may need to re-authenticate.

> **Honesty note:** end-to-end OAuth completion through this bridge is **Inferred**, not verified in this repo's record. An unauthenticated probe observed HTTP 401 with OAuth metadata, and a prior live-verified invocation through this exact manual exists from a paid, OAuth-completed account, but nobody has re-run the full authorization during packet authoring. If the flow fails, that is a finding to report, not to work around silently.

### Alternative path: env-backed Bearer header

Documented upstream and quoted verbatim in [`assets/utcp_refero_manual.md`](assets/utcp_refero_manual.md). It never enters the base manual, and how to obtain a Refero Bearer token is UNKNOWN (account/dashboard access required). Adopting this path is an operator decision.

### Validation: `phase_3_complete`

- [ ] You completed the browser authorization (or wired the Bearer alternative yourself)
- [ ] No token or auth-state content was pasted into any chat, file, or evidence

---

## 5. CONFIRM THE CALLABLES (INSIDE CODE MODE)

The mandatory confirmation step runs inside Code Mode, not in a shell:

```typescript
// Discovery names appear dotted: refero.refero.refero_search_styles
const all = await list_tools();
// MANDATORY: confirm the exact callable + schema before any real call
const info = await tool_info({ tool_name: "refero.refero_refero_search_styles" });
```

Expected: the eight documented tools resolve with the **doubled prefix** (`refero.refero_refero_<tool>`). If tools are missing, renamed, or expanded, fail closed and report the drift. Manuals load at Code Mode startup, so a fresh registration needs a reconnect before its tools resolve.

### Validation: `phase_4_complete`

- [x] `tool_info` returned a schema for at least one doubled-prefix callable [evidence: `references/discovery_fixture_2026-07-16.json` `tool_info_first` — full `refero_refero_search_stylesInput` interface with `response_format?: "json" | "md"`]
- [ ] The live tool set matches the eight documented tools (or the drift was reported and work stopped)

A first read-only search (`refero_refero_search_styles`) that returns a `{ pagination, records }` object confirms the system is operational end to end.

---

## 6. TROUBLESHOOTING

| Error | Cause | Fix |
| ----- | ----- | --- |
| HTTP 401 on every call | Not authenticated; the empty manual `env` is not anonymous access | Complete the operator OAuth (Section 4) on a Pro or higher account |
| Access denied despite auth | The account is on the Free plan, which has no MCP access | Upgrade the plan; do not retry, and do not expect a reduced Free tool set |
| `refero.*` tools do not resolve | Manual not loaded at Code Mode startup, or OAuth incomplete | Reconnect Code Mode; re-run `doctor.sh`; complete Section 4 |
| Callable not found with `refero.refero_<tool>` | Single-prefix name; the convention doubles the prefix | Use `refero.refero_refero_<tool>` and confirm with `tool_info` |
| `-32000 Connection closed` on every call | Code Mode on Node 25 (isolated-vm SIGSEGV) | Run Code Mode on Node 24 |
| OAuth callback times out | 30-second default callback timeout, or no browser session | Retry in a browser-capable session; consider the Bearer alternative for headless use |
| Auth lost after a machine/runtime move | Auth state under `~/.mcp-auth` did not survive | Re-authenticate (operator). Never delete or repair the directory as an agent action |
| 429 / quota errors | Pro is 8,000 calls/month; finer limits are unpublished | Read the provider's message; no client-side backoff contract exists to apply |

See [`references/troubleshooting.md`](references/troubleshooting.md) for the full symptom, cause, and fix detail.

---

## 7. RESOURCES

### File Locations

| Path | Purpose |
| ---- | ------- |
| `scripts/doctor.sh` | Read-only diagnostics; gated live probe via `REFERO_DOCTOR_LIVE=1` |
| `assets/utcp_refero_manual.md` | Verified manual snapshot + Bearer alternative (verbatim) |
| `.utcp_config.json` (repo root) | Holds the registered `refero` manual; **never edited by this skill** |
| `~/.mcp-auth` (or `MCP_REMOTE_CONFIG_DIR`) | Operator-owned auth state; **never touched by this skill** |

### Related Documentation

| Document | Location | Purpose |
| -------- | -------- | ------- |
| README | `.opencode/skills/mcp-tooling/mcp-refero/README.md` | Human orientation and quick start |
| SKILL.md | `.opencode/skills/mcp-tooling/mcp-refero/SKILL.md` | Runtime instructions and routing |
| Tool Surface | `.opencode/skills/mcp-tooling/mcp-refero/references/tool_surface.md` | The eight-tool contract, funnel, and plan gating |
| MCP Wiring | `.opencode/skills/mcp-tooling/mcp-refero/references/mcp_wiring.md` | Bridge, OAuth/Bearer, naming, discovery |
| Troubleshooting | `.opencode/skills/mcp-tooling/mcp-refero/references/troubleshooting.md` | Full failure-mode table |

### Licensing and Upstream

The Refero MCP is a **paid external service** ([refero.design/mcp](https://refero.design/mcp); docs at doc.refero.design). Nothing is vendored: no server code, no reference content, no methodology. The `mcp-remote` bridge is a separate open-source project on npm (unpinned in the manual; experimental per its own description). The official [referodesign/refero_skill](https://github.com/referodesign/refero_skill) repository (MIT, default branch `master`) is a design methodology skill and is deliberately not duplicated here.

---

## Quick Reference Card

### Verify

```bash
bash scripts/doctor.sh                       # read-only wiring + runtime report
REFERO_DOCTOR_LIVE=1 bash scripts/doctor.sh  # + one unauthenticated probe (expect 401)
```

### Authenticate (operator-only)

Browser OAuth on a Pro (or higher) account; auth state persists in `~/.mcp-auth`. Bearer header is the documented alternative (see `assets/utcp_refero_manual.md`).

### Confirm (inside Code Mode)

```typescript
tool_info({ tool_name: "refero.refero_refero_search_styles" })  // doubled prefix, fail closed on drift
```

### Validation Checkpoints Summary

| Checkpoint | Meaning |
| ---------- | ------- |
| `phase_1_complete` | Node 18+/npx present; plan known |
| `phase_2_complete` | `refero` manual verified read-only; probe returns 401 |
| `phase_3_complete` | Operator authentication completed (OAuth or Bearer) |
| `phase_4_complete` | Doubled-prefix callables confirmed via `tool_info` |

---

## Version History

| Version | Date | Changes |
| ------- | ---- | ------- |
| 1.0.0.0 | 2026-07-16 | First release. Verify-only guide over the existing validated `refero` manual: read-only doctor, gated 401 probe, operator-only OAuth step, doubled-prefix confirmation flow. |

---

**Need help?** See [Troubleshooting](#6-troubleshooting) or load the `mcp-refero` skill for detailed workflows.
