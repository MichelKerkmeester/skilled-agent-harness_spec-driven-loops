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