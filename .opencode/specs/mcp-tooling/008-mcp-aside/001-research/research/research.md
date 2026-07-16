# Aside Browser Developer Surface — Canonical Fan-Out Research Synthesis

> **Fan-out synthesis of 3 detached deep-research lineages** — `sol` (gpt-5.6-sol xhigh, 5 iterations), `glm` (glm-5.2, 2 iterations), `luna` (gpt-5.6-luna max, 3 iterations) — 10 iterations total, stop-policy `max-iterations`. Cross-lineage reconciliation: agreements are stated once with merged citations; single-lineage attestations are tagged `[sol only]` / `[glm only]` / `[luna only]`; disagreements are tagged `[CONFLICT: ...]` and never averaged away. Lineage sources: `lineages/sol/research.md`, `lineages/glm/research.md`, `lineages/luna/research.md`; merged registry: `deep-research-findings-registry.json`; attribution: `fanout-attribution.md`.

---

## 1. Executive Summary

Aside is an AI browser with a real, standalone macOS CLI — not merely an MCP server. The installed binary exposes natural-language agent tasks (`aside "<task>"`, `aside exec`), a deterministic Playwright-compatible browser JavaScript REPL (`aside repl`), account management (`aside account list/status/use`), and a local MCP server launcher (`aside mcp`). All three lineages converge on this split. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside --help`, observed 2026-07-16 (luna)]

The MCP server is a client-spawned **local stdio** process with no URL, port, token, OAuth field, or environment credential in its published configuration; it relies on local Aside account, daemon, browser, and profile state (all lineages). [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/changelog/components.md]

The decisive cross-lineage resolution: sol and glm classified the MCP tool inventory as "not enumerated — runtime discovery required." The luna lineage **live-probed** the installed server (version `1.26.626.1517`, protocol `2024-11-05`) and found the inventory is **exactly one tool, `repl`** (required inputs `title` + `code`; persistent sandboxed ES2023+/Playwright environment; 120-second call timeout; `execution.taskSupport: forbidden`). There are no first-class `navigate`, `dom`, `screenshot`, `console`, or `network` MCP tools. [luna only — live MCP `initialize`/`tools/list`/`tools/call(repl)` probes, observed 2026-07-16; resolves the sol/glm runtime-discovery open question for this version]

Second live resolution [luna only]: a fresh `aside mcp` process is **not** browser-capable by itself — `listBrowserTabs()` returned `This task is not bound to a browser profile. Open it in Aside browser and try again.` Starting the MCP server does not grant control of an arbitrary browser; a task/profile binding is a prerequisite. [SOURCE: local MCP `tools/call(repl)` unbound-profile probe, observed 2026-07-16]

The agreed packet posture for `mcp-aside-devtools` is **CLI-primary + Code Mode MCP fallback**: `aside`/`aside exec` for outcome-oriented agent tasks, `aside repl` for deterministic evidence-friendly browser steps, and the discovered `aside mcp` `repl` tool via Code Mode for composition. Register **one** credential-free `aside` UTCP manual (stdio, `command: "aside"`, `args: ["mcp"]`, `env: {}`) — the manual JSON is byte-identical across sol and glm (§13). One unresolved conflict remains on parallel-manual strategy (§13, §16).

## 2. Background

The `mcp-tooling` skill hub (`.opencode/skills/mcp-tooling/`) routes to mode packets that bridge external tools — `mcp-chrome-devtools` (`bdg` CLI + `chrome-devtools-mcp` Code Mode fallback), `mcp-click-up`, and the `mcp-figma` transport — each following a CLI-primary + MCP-fallback structure registered in `.utcp_config.json` via `manual_call_templates[]`. The planned `mcp-aside-devtools` packet is a new mode under this hub. [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md] [SOURCE: .utcp_config.json] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md]

This research phase (`.opencode/specs/mcp-tooling/008-mcp-aside/001-research/`) is a research handoff, not an implementation: root `.utcp_config.json`, the skill packet, hub registration, and bound-browser validation belong to later phases. [SOURCE: .opencode/specs/mcp-tooling/008-mcp-aside/001-research/spec.md (luna §2)]

## 3. Objectives

1. Map the full Aside CLI command surface (install, run, session, account, exec, repl, mcp).
2. Document Aside MCP server mechanics: transport, invocation, tool set, auth, session/daemon model.
3. Define the auth/account and permission models.
4. Map AI-browser-automation workflows (navigate, DOM inspection, screenshots, console/network capture).
5. Contrast Aside with the repository's Chrome DevTools `bdg` patterns.
6. Produce the exact `.utcp_config.json` `aside` manual.
7. Enumerate everything needed to author the `mcp-aside-devtools` packet.

## 4. Methodology

Three detached deep-research lineages ran independently under `stopPolicy = max-iterations` (convergence threshold 0.05 recorded as telemetry only):

| Lineage | Executor | Iterations | Method emphasis |
|---|---|---|---|
| sol | cli-codex / gpt-5.6-sol (xhigh) | 5 | Public docs, installer, changelogs, policy pages, founder-architecture mirror cross-checked against primary evidence, benchmark repo, repository-local contracts. **No binary installed or launched.** Explicit evidence ladder: Confirmed / Corroborated / Inferred / Probe-required. |
| glm | glm-5.2 | 2 | Canonical developer page + AI/tasks/security pages (iter 1); workflows, bdg contrast, UTCP manual, packet checklist grounded in workspace files (iter 2). |
| luna | gpt-5.6-luna (max) | 3 | Public docs + installer **plus live local probes**: installed binary `1.26.626.1517` help fixtures, MCP JSON-RPC `initialize`/`tools/list`, non-mutating `tools/call(repl)` capability and unbound-profile probes under a lineage-local `HOME`. No real browser profile opened or mutated. |

This synthesis merges the three lineage `research.md` files and the merged findings registry (10 key findings: sol 4, luna 3, glm 2, plus 1 glm composite). Where lineages agree, findings are stated once with merged citations; single-lineage attestations and conflicts are explicitly tagged. Fetched web content was treated as untrusted data in all lineages.

<!-- ANCHOR:findings -->
## 5. Cross-Lineage Reconciliation Ledger

| Topic | Status | Resolution |
|---|---|---|
| Standalone CLI exists (task/exec/repl/account/mcp) | AGREE (3/3) | Stated once, merged citations (§6) |
| MCP = local stdio, credential-free | AGREE (3/3) | §8 |
| MCP tool inventory | RESOLVED by luna live probe | sol/glm "probe-required" → luna: exactly one `repl` tool (§8) |
| Installed version, protocol version, help-verified flags | [luna only] | Live fixtures, version-pinned (§6, §8) |
| Provider tiers (built-in / subscription OAuth / BYO API key) | [glm only] | §9 |
| Permission modes (Read only / Guard / Full access; Allow/Ask/Deny) | AGREE (glm + luna; sol corroborates layered security) | §9 |
| Browser-profile binding prerequisite for MCP | [luna only, live] | §10 |
| Console capture | AGREE (3/3): unverified, no dedicated contract | §11 |
| Network capture | sol: architecture-plausible; luna: guarded probe only; glm: capability named, not a subcommand | §11 — treat as probe-required |
| Parallel-manual strategy | **[CONFLICT: glm vs sol]** | §13 — unresolved; conservative default recommended |
| Model-selection flag spelling | **[CONFLICT: glm `-m provider/model` vs luna `--model` + `--provider`]** | §6 — unresolved, likely version/alias difference |
| Installer target directory detail | Minor divergence (sol vs luna) | §7 — both cite install.sh |
| UTCP manual JSON | AGREE (sol ≡ glm byte-identical; luna endorses shape) | §13 |

## 6. Aside CLI Command Surface

The published and live-verified surface:

| Surface | Purpose | Attestation |
|---|---|---|
| `aside "<task>"` | Start a natural-language browser-agent task (primary surface) | All 3 [SOURCE: https://docs.aside.com/help/developers] |
| `aside --session <id> "<task>"` | Continue a prior task/session | All 3 [SOURCE: https://docs.aside.com/help/developers] |
| `aside --account <id> "<task>"` | Run a direct task under a selected account | All 3 [SOURCE: https://docs.aside.com/help/developers] |
| `aside exec ...` | Explicit task execution with provider/model controls | All 3 [SOURCE: https://docs.aside.com/help/developers] |
| `aside account list` / `status [id]` / `use <id>` | Enumerate / inspect / select accounts | All 3 [SOURCE: https://docs.aside.com/help/developers] |
| `aside repl "<JavaScript>"` | Deterministic browser automation (e.g. `openTab(...)`) | All 3 [SOURCE: https://docs.aside.com/help/developers] |
| `aside mcp` | Start the local MCP server over stdio | All 3 [SOURCE: https://docs.aside.com/help/developers] |

Live-verified additional top-level options [luna only — local `aside --help`, version `1.26.626.1517`, observed 2026-07-16]:

```text
--version | --session <id> | --account <id> | --model <model> | --provider <provider>
--speed <default|fast> | --effort <off|minimal|low|medium|high|xhigh|ultrabrowse> | --update
```

If no command is given, Aside starts a browser-agent session; a URL prompt opens that page in Aside. [luna only — local `aside --help`] Subcommands are exactly `account`, `exec`, `repl`, `mcp`. [luna only — local help fixture]

**Model selection** — [CONFLICT: glm documents `aside exec --account u1 -m openai-codex/gpt-5.5` with a `-m provider/model` convention per the developer docs [SOURCE: https://docs.aside.com/help/developers]; luna's live `--help` shows separate `--model <model>` and `--provider <provider>` options with no `-m` recorded [SOURCE: local `aside --help`, 2026-07-16] — likely a docs-example alias vs. installed-help difference, unresolved; the packet should capture the installed version's help before freezing flag spellings.]

Boundary rules (agreed):
- `--account` is documented for direct tasks and `exec`, **not** for `mcp` or `repl`; do not invent `aside mcp --account`. [SOURCE: https://docs.aside.com/help/developers (sol)] [luna corroborates: `aside mcp --help` exposes no account/session option]
- `--session` belongs to agent-task continuation; it is not an MCP browser-target selector. [luna — local `aside mcp --help`; sol table separates the lifecycles]
- No primary evidence supports typed commands such as `aside navigate`, `aside dom`, `aside screenshot`, `aside console`, `aside network` (all 3; luna's live help confirms their absence in this version).

## 7. Installation, Platform, and Version

**Install** (curl bootstrap, not npm — all 3):

```bash
curl -fsSL https://releases.aside.com/install.sh | bash
```

[SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://releases.aside.com/install.sh]

Installer facts (sol + luna, both from the fetched installer):
- Supports **macOS (Darwin) arm64/aarch64 and x64 only**; Linux and Windows are rejected. [SOURCE: https://releases.aside.com/install.sh]
- Places the `aside` executable/shim at `~/.local/bin/aside` by default. [SOURCE: https://releases.aside.com/install.sh — attested by both sol and luna]
- Overridable via `ASIDE_CLI_VERSION`, `ASIDE_CLI_BASE_URL`, `ASIDE_CLI_INSTALL_DIR`, `ASIDE_CLI_BIN_DIR`. [SOURCE: https://releases.aside.com/install.sh]
- Install-target detail: sol describes a downloaded macOS app bundle installed as `Aside CLI.app`; luna describes a default application install under `~/.aside/cli`. [Minor divergence — both cite install.sh; likely two descriptions of the same bundle layout; capture the installed layout as a fixture before documenting it in the packet.]
- The Developer settings page can also install/update/reinstall the CLI. [glm only — SOURCE: https://docs.aside.com/help/developers]
- The CLI exposes `--update`; a packet should never invoke updates or the installer implicitly. [luna — local help; sol agrees: diagnose, don't silently install]

Installed version observed 2026-07-16: `1.26.626.1517`. [luna only — local `aside --version`]

Recommended preflight (agreed): `command -v aside` → `aside --version` → `aside --help` (captured as a fixture); if absent, report the official install command and let the operator decide. [SOURCE: lineage syntheses sol §6, luna §5, glm §13]

## 8. Aside MCP Server: Transport, Handshake, Tool Inventory

**Transport** (all 3): `aside mcp` is launched by the client as a local **stdio** process. The published client configuration is:

```json
{
  "mcpServers": {
    "aside": { "command": "aside", "args": ["mcp"] }
  }
}
```

No URL, port, bearer token, API-key env var, or OAuth field appears in any published or live-observed surface; there is no evidence for a remote HTTP/SSE endpoint on this exported server. [SOURCE: https://docs.aside.com/help/developers] [SOURCE: local `aside mcp --help`, 2026-07-16 (luna)] [SOURCE: https://docs.aside.com/changelog/components.md (sol)]

**Live handshake** [luna only — MCP JSON-RPC `initialize`, observed 2026-07-16]:

```json
{
  "protocolVersion": "2024-11-05",
  "capabilities": {"tools": {"listChanged": true}},
  "serverInfo": {"name": "aside", "version": "1.26.626.1517"}
}
```

**Live tool inventory** [luna only — `tools/list`, observed 2026-07-16; resolves the sol/glm probe-required classification for this version]:

- Exactly **one tool: `repl`** — required input `title` (string) + `code` (string); `execution.taskSupport: forbidden`.
- Description advertises a persistent sandboxed **ES2023+ REPL with Playwright APIs**, 120-second call timeout, no default/external modules, no `import`/`require`, and helpers including: `page`, `tabs`, `listBrowserTabs`, `attachBrowserTab(targetId)`, `attachActiveBrowserTab`, `getTabByTargetId`, `openTab(url)`, `closeTab`, `snapshot(page, options?)`, `page.screenshot(options)`, locator screenshots, `page.pdf`, `annotatedScreenshot`, `console.log`, `display`, `fetch`, `sleep`, `fs` (from `node:fs/promises`), `pwd`, `path`, `Buffer`.
- A non-mutating capability probe confirmed `page`, `tabs`, `fs`, `pwd` as objects/values and `openTab`, `snapshot`, `annotatedScreenshot`, `fetch` as functions.

Because `tools.listChanged: true` and the schema is runtime-discovered, the one-tool inventory is version-pinned evidence, not a permanent contract: the packet must still run discovery (`initialize` → `tools/list`, then Code Mode `search_tools()`/`list_tools()`/`tool_info()`) before invocation and save the schema as a versioned fixture (sol's hard-preflight sequence, §7 of sol lineage). [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:252-256]

Operational lifecycle evidence: Aside has fixed MCP idle survival and improved daemon-outage reporting; connection failures preserve stderr and timeout details — a wrapper must distinguish a dead stdio child from an unavailable/incompatible Aside daemon/browser. [sol only — SOURCE: https://docs.aside.com/changelog/components.md] Live process telemetry showed `discoveryIdleTimeoutMs: 300000` and `replIdleTimeoutMs: 1800000` (diagnostic observations, not public configuration guarantees). [luna only — local `aside mcp` startup/shutdown events]

Expected Code Mode callable: `aside.aside_repl` per the repository convention `{manual_name}.{manual_name}_{tool_name}` — treat as a post-registration discovery result to confirm, not a hard-coded promise. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:217-260 (luna)] [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:252 (sol)]

## 9. Auth, Accounts, and Permissions

**Layered identity model** (sol's decomposition, corroborated by glm/luna): Aside account sign-in and selected account; local browser profile and logged-in site sessions; password vault/autofill policy; model-provider credentials for task execution; user approvals and site auth challenges; and the MCP transport itself, which has **no published credential field**. Model-provider credentials are not MCP transport credentials. [SOURCE: https://docs.aside.com/help/developers]

**Provider tiers** [glm only — SOURCE: https://docs.aside.com/help/ai] (Settings > AI > Providers):
1. **Aside built-in** — plan-included models; requires active cloud-account sign-in.
2. **Subscription** — OAuth reuse of existing subscriptions (ChatGPT Plus/Pro, Claude Pro/Max, GitHub Copilot).
3. **API (BYO key)** — Anthropic, OpenAI, OpenRouter, Google, xAI, Vercel AI Gateway, Cloudflare AI Gateway.

Sign-out behavior [glm only]: a warning is printed; BYO provider keys keep working, built-in models fail closed until re-sign-in. [SOURCE: https://docs.aside.com/help/ai] The MCP server inherits the logged-in CLI account/provider context. [glm — SOURCE: https://docs.aside.com/help/ai; luna corroborates: `aside mcp` has no account/auth option of its own]

**Permission model** (glm + luna, from the same official pages):
- Task modes: `Default` (normal browser profile) or `Incognito`. [glm — SOURCE: https://docs.aside.com/help/tasks]
- Permission modes: **Read only / Guard (default for new tasks) / Full access**; Full access never exposes saved password values to the agent. [SOURCE: https://docs.aside.com/help/security] [SOURCE: https://docs.aside.com/help/tasks]
- Layered rules: agent-level + session-level overrides; values `Allow`/`Ask`/`Deny`; Deny takes precedence. Permission areas: sandbox, readable/writable file roots, reads/writes outside roots, tool/browser/network rules. [glm — SOURCE: https://docs.aside.com/help/security]
- Password boundary (all 3): Aside can sign in via password-manager autofill, but saved password values stay hidden from the agent; Aside checks password-access policy and target URL before building an autofill payload. [SOURCE: https://docs.aside.com/help/security] [sol adds MFA/passkey/CAPTCHA/vault boundaries — SOURCE: https://docs.aside.com/help/password-manager]

**Unattended-use boundary** (sol + luna agree): MFA, CAPTCHA, identity verification, vault unlock, and approvals can pause a task and require the user to resume — "unattended" is best-effort after a signed-in profile and permission policy are prepared, never a guarantee; the implementation must support resumable waiting, not bypasses. [SOURCE: https://docs.aside.com/help/tasks] [SOURCE: https://docs.aside.com/help/troubleshooting (luna)] [SOURCE: https://aside.com/policy/terms (sol)]

**Which permission mode `aside mcp` inherits, and whether MCP activity is auditable, is not published** — caller-owned read/action/sensitive policy is required (sol; open question §17). Data egress: selected prompts, tool results, snapshots, screenshots, and files may reach hosted model providers — "local-first" is not "never leaves device." [sol only — SOURCE: https://aside.com/policy/privacy]

## 10. Session, Daemon, Profile, and Concurrency Model

Three-layer model (luna's live formulation, consistent with sol/glm):
1. **Agent-task continuation** — `--session <id>` on `aside`/`aside exec` continues a prior run; state is account-scoped and persists across CLI invocations (transcripts in the task folder, generated files persist; tasks can pause for input/approval/notification and resume). [SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/help/tasks (glm)]
2. **REPL persistence** — `aside repl` / the MCP `repl` tool keeps a persistent JavaScript context while its process is alive. [luna — live; corroborated by the advertised "persistent" REPL description]
3. **Browser-profile binding** — browser operations require an Aside browser task/profile binding. A fresh `aside mcp` process is transport-healthy but browser-unbound: `listBrowserTabs()` → `This task is not bound to a browser profile. Open it in Aside browser and try again.` [luna only — live probe, 2026-07-16] This must be reported distinctly from auth failure (it is not a missing bearer token). Sol's docs-side counterpart: current product behavior keeps work tied to the originating profile and blocks browser operations when profile verification fails — stop on ambiguity/mismatch. [SOURCE: https://docs.aside.com/changelog/components.md]

**Daemon**: the MCP child fronts a separate local service (daemon-backed; idle-survival and daemon-outage fixes in the changelog [sol — SOURCE: https://docs.aside.com/changelog/components.md]). The public CLI exposes no `daemon`/`status`/`stop` or MCP session-selection command — rely only on the supported stdio process lifecycle and close the MCP process for cleanup. [luna — local help; INFERENCE: public-help absence is a supportability boundary, not proof of internal daemon absence] The supported user-facing procedure for binding an MCP process to an existing browser task/profile is undocumented (open question §17).

**Concurrency**: there is no public guarantee for concurrent mutating MCP clients on one profile; Aside routines avoid overlap, and Aside has no documented equivalent of Chrome DevTools' `--isolated=true`. Default: single-writer lock keyed by account/profile; enable read-only concurrency only after a controlled multi-client test proves isolation. [sol — SOURCE: https://docs.aside.com/help/automation] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:219] (See §13 for the conflicting glm dual-manual suggestion.)

**Session storage backend**: where/how `--session` state is persisted is not publicly documented. [glm only — open question]

## 11. AI-Browser-Automation Workflows

Two tiers (all 3): the **NL agent** (`aside "<prompt>"`, `aside exec`) for goal-driven, multi-step, approval/notification-gated, credential-autofill, multi-site work; and the **deterministic REPL** (`aside repl` / MCP `repl` tool) for direct inspection, screenshots, downloads, and repeatable steps. Documented agent capabilities: navigate, page/DOM inspection, screenshots, downloads, browse/search, use files, search history, request approvals, sign in via autofill, wait for notifications, create/preview files (images/PDFs/HTML/text). [glm — SOURCE: https://docs.aside.com/help/developers] [SOURCE: https://docs.aside.com/help/tasks]

Reconciled per-workflow capability map:

| Workflow | Verified lane | Status / qualification |
|---|---|---|
| Navigation & tabs | `openTab(url)` in REPL (advertised + observed as a function [luna live]); high-level via `aside "Open ..."` | Bound-page navigation not yet exercised [luna]; same-document/tab recovery in changelog [sol — SOURCE: https://docs.aside.com/changelog/components.md] |
| DOM / accessibility inspection | `snapshot(page, options?)` + Playwright locators + `page.evaluate` | `snapshot` advertised/observed [luna live]; accessibility-first modified snapshots exposing focus/iframe/clickable state [sol — SOURCE: https://docs.aside.com/help/developers, corroborated by https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks]; actual page output shape untested |
| Interaction | Locators, keyboard down/up, shortcuts, evaluate [sol — docs/changelog] | `page.evaluate` compatibility not universal: changelog records argument-edge fixes — put every used method/argument form in a smoke fixture [sol — SOURCE: https://docs.aside.com/changelog/components.md] |
| Screenshots | `page.screenshot(options)`, locator screenshots, `annotatedScreenshot`, `page.pdf` [luna live tool description; sol REPL evidence] | Output path/bytes not validated; success = non-empty file with PNG magic bytes, independent of tool response [sol — SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/dom_and_screenshot/screenshot_capture.md:21] |
| Downloads | REPL; native Chrome download checks [sol] | Controlled output path; no path escape |
| Console capture | **No dedicated verified contract in any lineage.** No Aside-specific console tool/helper in docs [sol] or live schema [luna] | Guarded Playwright `page.on('console', ...)` probe only if supported; otherwise report unsupported — fail closed [sol + luna INFERENCE, unverified] |
| Network capture | **No dedicated tool discovered.** Architecture captures/replays browser-authenticated requests [sol — corroborated founder-mirror + changelog] | Guarded `page.on('request'/'response', ...)` probe; do **not** promise HAR-export parity [luna]; method name and safe output contract require probe [sol] |
| Visual fallback | Screenshot/coordinate computer-use lane; stable 1440×900 background viewport | [sol only] — use only after semantic routes fail |
| Fetch / filesystem in REPL | `fetch`, `fs` (node:fs/promises), `pwd`, `path`, `Buffer` | [luna only — live tool description + probe] |

Artifact-evidence standard (sol, adopted): artifacts need independent proof — a screenshot is a non-empty PNG-magic file; structured capture must parse and contain a known marker/schema. [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/manual_testing_playbook/console_and_network/console_list.md:21]

## 12. Contrast with Chrome DevTools `bdg`

Merged contrast table (all three lineages contributed rows; no conflicts):

| Dimension | Chrome DevTools (`bdg`) | Aside | Design consequence |
|---|---|---|---|
| Install | `npm install -g browser-debugger-cli@alpha` [glm] | curl installer, macOS-only app bundle | Diagnose, never silently install |
| Primary CLI abstraction | Imperative typed CDP primitives (300+ methods, 53 domains) [glm]; `bdg dom/console/network` subcommands [sol] | NL agent task + JavaScript REPL | Copy routing discipline, not command names [sol] |
| Discovery | `bdg cdp --list/--describe/--search` | Runtime `--help` + MCP `tools/list` (live: one `repl` tool [luna]) | Freeze discovered fixtures per version |
| MCP server | `chrome-devtools-mcp` npm via npx | `aside mcp` built into the `aside` binary [glm] | — |
| MCP transport | stdio | stdio | Same registration shape |
| MCP tool inventory | Well-known CDP-oriented tool set | One `repl` tool (this version) [luna live] | Single Code Mode surface, not a tool family |
| Session lifecycle | Explicit URL start, JSON status, stop | Task `--session`; daemon-backed MCP; account/profile binding | Model each lifecycle separately [sol] |
| DOM | Raw query/eval + CDP breadth | Accessibility/Playwright semantics (`snapshot`, locators) | Semantic inspection first [sol] |
| Console / network | Explicit `bdg console --list`, `bdg network har <path>` | No dedicated verified contract; guarded probes only | Probe and fail closed (all 3) |
| Parallel instances | `--isolated=true`; multiple manuals (`chrome_devtools_1/2`) | No documented isolation flag | See §13 conflict; conservative default = one manual + per-profile serialization [sol] |
| Auth | None (local browser) | Aside account + provider tiers + profile + vault + site sessions | Stronger identity/approval preflight [sol] |
| Sandbox / permissions | None first-class | Read only / Guard / Full access + Allow/Ask/Deny [glm] | Surface as first-class security guidance |
| Artifact tests | Explicit JSON/PNG/HAR validation | Same proof standard applies | Verify independently of transport [sol] |

Transferable Code Mode rules (sol): progressive discovery, exact callable-name translation, structured returns, try/catch, explicit timeouts, cleanup in `finally`. [SOURCE: .opencode/skills/mcp-code-mode/SKILL.md:367] [SOURCE: .opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md:237]

## 13. UTCP Manual Registration

The manual JSON below is **byte-identical in the sol and glm lineages**; luna endorses the same shape (documented `command`/`args` snippet + live stdio confirmation). Sol carries the strongest citations for the repository schema fit, so the block is kept exactly as sol/glm wrote it. Append to `.utcp_config.json` `manual_call_templates[]`:

```json
{
  "name": "aside",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "aside": {
        "transport": "stdio",
        "command": "aside",
        "args": ["mcp"],
        "env": {}
      }
    }
  }
}
```

[SOURCE: .utcp_config.json:14] [SOURCE: https://docs.aside.com/help/developers]

Registration notes (merged):
- `command: "aside"` assumes PATH; resolve the absolute path via `command -v aside` under the Code Mode server's environment and substitute if needed (like the `open_design` manual). [glm; sol post-registration step 2]
- `env: {}` is correct — auth is account/session-based, not env-var. [glm — contrast `clickup_official`/`figma`; sol: no published MCP credential field]
- Post-registration validation (sol): `jq empty .utcp_config.json` → Code Mode `search_tools({ task_description: "Aside browser automation", limit: 20 })` → `tool_info()` on every intended callable → invoke only discovered `aside.aside_<tool>()` inside `call_tool_chain()` → return `{ success, data, errors, timestamp }` → preserve stderr/timeout details without leaking browser data. Expected callable: `aside.aside_repl` [luna — confirm, don't assume].
- **[CONFLICT: parallel manuals — glm recommends registering `aside_1`/`aside_2` manuals (mirroring `chrome_devtools_1/2`) driven by `--session`/`--account` scoping for parallel agent sessions; sol explicitly eliminates cloning Chrome's dual-isolated-manual layout because Aside has no `--isolated=true` equivalent and no isolation guarantee, mandating ONE manual + a single-writer lock per account/profile until a live multi-client test proves isolation — unresolved.]** Luna's live browser-binding finding (one profile-bound task per MCP process, binding procedure undocumented) weighs toward sol's conservative position, but no lineage ran the deciding multi-client test. Do not add a second manual without that evidence and a separate decision. [sol §14]

## 14. `mcp-aside-devtools` Packet-Authoring Inputs

**Location** (glm): `.opencode/skills/mcp-tooling/mcp-aside-devtools/`, plus a mode entry in `.opencode/skills/mcp-tooling/mode-registry.json`.

**Architecture** — sol's five-layer orchestrator (compatible with glm's checklist and luna's handoff contents):
1. **Router** — task CLI vs deterministic REPL vs Code Mode MCP, by intent and evidence needs (outcome → task CLI; deterministic proof → REPL; composition/discovered-only capability → MCP).
2. **Preflight** — platform, binary/version/help fixture, account, daemon/browser, profile binding, capabilities, output path, safety class.
3. **CLI adapters** — direct tasks, `exec`, session continuation, documented account selection, REPL quoting/result capture.
4. **Code Mode adapter** — MCP discovery, callable-name translation, schemas, timeouts, structured results, fallback.
5. **Policy/evidence layer** — read/action/sensitive rules, prompt-injection isolation, approvals, redaction, artifact verification, per-profile serialization.

**File layout** (sol §13, augmented by glm §13):

| Surface | Responsibility |
|---|---|
| `SKILL.md` | Triggers ("aside browser", "AI browser automation", "aside cli/mcp" [glm]), when-not (imperative CDP → bdg; heavy frameworks → Playwright [glm]), router, loading levels, route rules, non-goals, success criteria |
| `INSTALL_GUIDE.md` | Curl install + `aside --version` verify + account sign-in [glm] |
| `references/cli.md` | Documented commands, quoting, sessions, account selection, exit/error contract |
| `references/repl.md` | Asidewright patterns: navigation, accessibility snapshot, interaction, artifacts, redaction |
| `references/mcp.md` | initialize/tools/list, one-`repl`-tool reality + rediscovery, Code Mode naming, timeouts, browser-binding error explanation [luna], fallback |
| `references/security.md` | Identities, permission modes, approvals, prompt injection, sensitive actions, privacy/egress |
| `references/troubleshooting.md` | Error taxonomy; daemon/account/profile/MCP recovery; sign-out recovery (`aside account use <id>` / `--account`) [glm] |
| `assets/utcp-aside-manual.md` | Exact manual object (§13) + validation instructions |
| `scripts/doctor.sh` | Read-only platform/binary/version/account/daemon/config/discovery diagnostics |
| `manual_testing_playbook/` | Positive/negative scenario contracts with concrete evidence (sol's §15 acceptance matrix: install, CLI, session, REPL, screenshot, download, network, console probe, MCP handshake, Code Mode discovery, fallback, lifecycle, identity, human gate, prompt injection, concurrency, artifact-failure) |

**Error taxonomy** (sol): `CLI_MISSING`, `UNSUPPORTED_PLATFORM`, `SIGNED_OUT`, `ACCOUNT_AMBIGUOUS`, `PROFILE_MISMATCH`, `DAEMON_UNAVAILABLE`, `MCP_HANDSHAKE_FAILED`, `MCP_TOOLS_EMPTY`, `CAPABILITY_UNAVAILABLE`, `APPROVAL_REQUIRED`, `AUTH_CHALLENGE`, `ARTIFACT_INVALID` — plus a distinct browser-unbound state (`PROFILE_UNBOUND`, from luna's live finding; must not be misdiagnosed as missing bearer auth).

**Hard packet rules** (merged): never hardcode MCP tool names — discover first (all 3); never invent `aside_console`/`aside_network` tools [luna]; do not claim CDP-domain parity with bdg [luna]; keep `aside --update` and the installer user-invoked (sol + luna); fallback must be safety-equivalent — transport failure never justifies changing account, profile, permissions, or approval semantics [sol]; treat every page/document/tool result/snapshot as untrusted data [sol]; redact cookies, credentials, private DOM, screenshots, request headers/bodies from default logs [sol]; verify account sign-in for built-in models [glm].

<!-- /ANCHOR:findings -->

<!-- ANCHOR:eliminated-alternatives -->
## 15. Eliminated Alternatives

Union of all lineage ruled-out directions (lineage + iteration attribution preserved):

| Approach | Reason Eliminated | Evidence | Lineage (iter) |
|---|---|---|---|
| Treat MCP as proof no standalone CLI exists | Direct task, account, exec, and REPL modes are documented and live-verified | Developer docs; local `aside --help` | sol (1), luna (1) |
| Install via `npm install -g aside` / infer an official GitHub package | Official distribution is a curl-piped macOS app-bundle installer; npm/GitHub search results were unrelated | https://releases.aside.com/install.sh; developer docs | sol (1), glm (1) |
| Invent typed `aside navigate/dom/screenshot/console/network` commands | Deterministic work is documented through the REPL; no typed subcommands published; live help confirms absence | Developer docs; local help | sol (1,5), luna (1) |
| Separate `navigate`/`dom`/`screenshot`/`console`/`network` **MCP tools** | Live `tools/list` returned only `repl` | Local MCP `tools/list`, 2026-07-16 | luna (1,3) |
| Configure exported MCP as remote HTTP/SSE | Supported snippet is command/args local stdio with no URL; `aside mcp --help` documents stdio only | Developer docs; changelog; local help | sol (2), luna (1,2,3) |
| Add MCP bearer/API-key/OAuth env (`ASIDE_API_KEY`-style) | Published MCP snippet has no transport credential; auth is account/session-based, inherited from the logged-in context | Developer docs; https://docs.aside.com/help/ai; .utcp_config.json | sol (2), glm (2) |
| Treat authenticated HTTP connectors in the changelog as exported-MCP transport | Those connectors describe servers Aside consumes, not the exported server | Changelog | sol (2) |
| Borrow Chrome DevTools / Playwright MCP tool names | Aside publishes no tools/list; live inventory differs entirely | Developer docs; Code Mode rules; local `tools/list` | sol (3,5), luna (3) |
| Expose raw CDP as the agent contract | Asidewright deliberately presents Playwright/accessibility semantics | Architecture evidence; changelog | sol (3) |
| Treat Aside as a CDP-domain-complete bdg replacement | One REPL tool verified; no CDP catalog or dedicated HAR/console tools | Local MCP inventory; mcp-chrome-devtools references | luna (3) |
| Guarantee console capture from generic Playwright compatibility | No Aside-specific console contract exists in docs or live schema | Absence in primary docs; local `tools/list` | sol (3), luna (1) |
| Treat a fresh MCP process as a browser session | `listBrowserTabs()` fails until a browser profile/task is bound | Local `tools/call(repl)` error | luna (1,2,3) |
| Treat `--session` as an MCP browser selector | Documented for agent-task continuation only; MCP exposes no selector | Local `aside`/`exec`/`mcp` help | luna (2) |
| Treat local stdio as trusted | It exposes logged-in browser state and powerful actions | Security docs; terms | sol (4) |
| Promise a purely local data path | Hosted model, sync, and analytics paths are documented | Privacy policy/docs | sol (4) |
| Run sensitive account actions fully unattended / treat sign-in as sufficient | MFA, CAPTCHA, vault unlock, identity checks, and approvals require humans and pause tasks | Password-manager docs; terms; tasks/troubleshooting docs | sol (4), luna (1,2) |
| Allow concurrent mutations per profile | No isolation guarantee; routines avoid overlap | Automation docs; changelog | sol (4,5) |
| Clone Chrome's dual isolated manual layout / `--isolated=true`-style flag | Chrome has `--isolated=true`; Aside has no equivalent contract — **note: glm's `aside_1`/`aside_2` suggestion conflicts with this elimination (§13); recorded as eliminated by sol, proposed by glm, unresolved** | Local Chrome/UTCP sources; developer docs | sol (5) vs glm (2) |
| Hard-code `aside.aside_repl` without discovery | Derived from repository naming convention; needs post-registration confirmation | .opencode/skills/mcp-code-mode/SKILL.md:217-260 | luna (3) |
| Hardcode the MCP tool list in the packet | Inventory is runtime-discovered (`listChanged: true`); live one-tool result is version-pinned | Developer docs; local `tools/list` | glm (1,2), luna (1) |
| Silently fall back across safety boundaries | Equivalent browser operations can carry different profile/approval semantics | Security synthesis | sol (5) |

<!-- /ANCHOR:eliminated-alternatives -->

<!-- ANCHOR:divergence-map -->
## 16. Divergence Map

**Saturated directions** (agreed across lineages): standalone-CLI existence; local stdio transport; credential-free MCP registration; deterministic REPL as the low-level abstraction; caller-owned safety policy; repository UTCP manual shape.

**Cross-lineage pivots and resolutions:**
- sol/glm ended with "MCP tool inventory = probe-required"; luna's live probes resolved it (one `repl` tool, protocol `2024-11-05`, version `1.26.626.1517`) — a genuine cross-lineage frontier collapse achieved by method diversity (docs-only vs live-probe lineages).
- luna's evidence branches (live protocol/tool discovery; lifecycle/security review; repository packet/bdg mapping) converged on the same core model, preserving one deliberate divergence: Aside's profile/Playwright model vs bdg's direct CDP/session model. [luna §13]
- sol ran five fixed thematic passes with no pivots, pivot failures, audited overrides, or Council artifacts. [sol Divergence Map]
- glm broadened angles in iteration 2 instead of synthesizing early (newInfoRatio 1.00 → 0.65). [glm §17]

**Unresolved cross-lineage disagreements:** (1) parallel-manual strategy — glm dual-manual proposal vs sol single-manual elimination (§13); (2) model-flag spelling `-m provider/model` vs `--model`/`--provider` (§6); (3) minor installer-directory description divergence (§7).

**Remaining frontier** (union): bound-page REPL behavior (DOM snapshot/screenshot output shapes, console/network event listeners); MCP permission inheritance and audit visibility; multi-client/profile isolation; per-call account selection for `repl`/`mcp`; MCP-to-browser binding procedure; session storage backend; idle-timeout stability; post-registration Code Mode discovery confirmation. Registry telemetry: merged convergence score 0.727 across 10 key findings; luna local graph score 0.8067 with decision `CONTINUE` and two explicit blockers (bound-page output; post-registration discovery) — under `stopPolicy=max-iterations` this telemetry neither authorized early synthesis nor blocked the hard-cap synthesis. [SOURCE: deep-research-findings-registry.json] [SOURCE: lineages/luna/deep-research-state.jsonl]

Breadth is complete for packet authoring; live product behavior at the remaining frontier is explicitly unclaimed. [sol Divergence Map]

<!-- /ANCHOR:divergence-map -->

<!-- ANCHOR:open-questions -->
## 17. Open Questions

Union across lineages. Items sol/glm raised that luna's live probes already resolved are listed at the bottom for traceability.

| # | Question | Why it matters | Required evidence | Blocking? | Raised by |
|---|---|---|---|---|---|
| 1 | Does console capture work on a bound page (Playwright `page.on('console', ...)` inside `repl`), and what cleanup/result-size limits apply? | Determines debugger parity with `bdg console --list` | Sentinel console round trip on a bound page | Console feature only | sol, luna (glm implicit) |
| 2 | Do bound pages support `page.on('request'/'response', ...)` network capture, and what is the safe output contract? No HAR parity is promised. | Determines network-capture support | Guarded listener probe + parseable structured output | Network feature only | sol, luna |
| 3 | Which permission/task mode does `aside mcp` inherit, and is MCP activity auditable in the Aside UI? | Determines enforcement model and unattended-write policy | Controlled read/action/sensitive test matrix | Unattended write actions | sol |
| 4 | Are concurrent MCP clients isolated by process, account, profile, or session? (Decides the §13 sol-vs-glm parallel-manual conflict.) | Determines safe parallelism and manual count | Two-client read + mutation matrix | Parallel mutation; second manual | sol, glm (conflict) |
| 5 | Can `repl` or `mcp` select an account without changing the global default? | Multi-account ergonomics | Runtime help + controlled account test | Per-call account override | sol |
| 6 | What exact DOM snapshot and screenshot result shapes does a **bound** `repl` return? | Freezes the packet's evidence contracts | Authorized disposable-profile run | Reference-doc final wording | luna |
| 7 | What is the supported user-facing procedure for binding an MCP process to an existing Aside browser task/profile? | The unbound-profile error is the first thing packet users will hit | Docs or vendor guidance + reproduction | Troubleshooting doc accuracy | luna |
| 8 | Does Code Mode discover the callable exactly as `aside.aside_repl` after registration? | Confirms the fallback invocation path | Post-registration `search_tools`/`tool_info` run | MCP invocation, not UTCP registration | luna (sol convention) |
| 9 | Where/how is `--session` state persisted (storage backend)? | Continuity/cleanup guidance | Vendor docs or local inspection | No | glm |
| 10 | Are the observed idle values (`discoveryIdleTimeoutMs` 300000, `replIdleTimeoutMs` 1800000) stable across releases; are there lifecycle controls beyond closing stdio? | Lifecycle/recovery guidance | Cross-version observation | No | luna |
| 11 | Does the installer gain non-macOS artifacts or additional MCP transport flags in future versions? | Platform-support statement | Installer/docs re-check at authoring time | No | luna |
| 12 | Is `-m provider/model` (docs example) an alias of the installed `--model`/`--provider` options? (§6 conflict) | Correct flag spelling in `references/cli.md` | Installed-version help fixture + trial invocation | CLI reference wording | synthesis (glm vs luna) |
| 13 | Full REPL helper surface beyond the advertised/probed list — any undocumented helpers? | Completeness of `references/repl.md` | `aside repl --help` + bound-session enumeration | No | glm (partially resolved by luna's tool description) |

**Resolved during fan-out** (previously open in sol/glm): exact `aside --help`/version fixture → resolved by luna (version `1.26.626.1517`, full option/subcommand list); MCP server identity/protocol/tools/schemas → resolved by luna (`aside` / `2024-11-05` / one `repl` tool with `title`+`code` schema). Both remain version-pinned: the packet must re-capture fixtures against the installed version at authoring time.

<!-- /ANCHOR:open-questions -->

<!-- ANCHOR:convergence-report -->
## Appendix: Convergence Report

- **Stop reason:** `maxIterationsReached` (forced-depth; `stopPolicy = max-iterations` on all lineages)
- **Total iterations:** 10 (sol 5, glm 2, luna 3)
- **Convergence threshold:** 0.05 — telemetry only under the max-iterations policy

Lineage completion table:

| Lineage | Model | Iterations | Wall time | Final convergence | newInfoRatio trend | Notes |
|---|---|---|---|---|---|---|
| glm | glm-5.2 | 2 | ~17.6 min | 0.65 | 1.00 → 0.65 (mean 0.825) | 8/8 charter questions answered from docs |
| luna | gpt-5.6-luna (max) | 3 | ~18.5 min | 0.70 | 0.95 → 0.78 → 0.70 (mean 0.81) | Isolated-`CODEX_HOME` rerun after 6 compliance-halt attempts; live CLI/MCP probes; graph score 0.8067, decision `CONTINUE`, 2 blockers |
| sol | cli-codex / gpt-5.6-sol (xhigh) | 5 | ~24.8 min | 0.83 | mean 0.934 | 5/5 thematic passes; 0 pivots; docs-only, no binary launched |

- **Merged registry:** 10 key findings (sol 4, luna 3, glm 3); merged convergence score 0.727; 0 open/resolved question records survived the state-reconstruction merge (question tracking lives in each lineage's `findings-registry.json`). [SOURCE: deep-research-findings-registry.json]
- **Terminal claim:** the packet architecture and UTCP registration decision are synthesis-ready; live product behavior at the remaining frontier (bound-page outputs, permission inheritance, isolation) is explicitly unclaimed pending the §17 validation backlog.

<!-- /ANCHOR:convergence-report -->

## References

**Fan-out artifacts (this run):**
- `fanout-attribution.md` — lineage/iteration/convergence attribution table
- `deep-research-findings-registry.json` — merged 10-finding registry (lineage-attributed)
- `lineages/sol/research.md`, `lineages/sol/resource-map.md`, `lineages/sol/iterations/iteration-001..005.md`
- `lineages/glm/research.md`, `lineages/glm/iterations/iteration-001..002.md`
- `lineages/luna/research.md`, `lineages/luna/resource-map.md`, `lineages/luna/iterations/iteration-001..003.md`

**Primary Aside sources:**
- https://docs.aside.com/help/developers (incl. `#use-mcp`)
- https://docs.aside.com/llms.txt
- https://docs.aside.com/help/security
- https://docs.aside.com/help/password-manager
- https://docs.aside.com/help/privacy
- https://docs.aside.com/help/tasks
- https://docs.aside.com/help/automation
- https://docs.aside.com/help/ai
- https://docs.aside.com/help/browser-basics
- https://docs.aside.com/help/ultrabrowse
- https://docs.aside.com/help/troubleshooting
- https://docs.aside.com/changelog/components.md
- https://docs.aside.com/changelog/native.md
- https://releases.aside.com/install.sh
- https://aside.com/ · https://aside.com/policy/terms · https://aside.com/policy/privacy

**Live local evidence [luna]:** `aside --version` / `--help` / subcommand `--help` fixtures; MCP JSON-RPC `initialize`, `tools/list`, non-mutating `tools/call(repl)` capability and unbound-profile probes — all observed 2026-07-16 against version `1.26.626.1517`.

**Corroborating public sources [sol]:**
- https://youmind.com/es-ES/landing/x-viral-articles/aside-sota-browser-agent-benchmarks (founder-architecture mirror; used only with primary/changelog cross-checks)
- https://github.com/at-inc/aside-benchmarks

**Repository-local contracts:**
- `.opencode/skills/mcp-tooling/mcp-chrome-devtools/SKILL.md` (+ `references/`, `manual_testing_playbook/`)
- `.opencode/skills/mcp-code-mode/SKILL.md` (+ `references/configuration.md`, `references/naming_convention.md`, `references/workflows.md`)
- `.utcp_config.json`
- `.opencode/specs/mcp-tooling/008-mcp-aside/001-research/spec.md`, `context/website-link.md`
