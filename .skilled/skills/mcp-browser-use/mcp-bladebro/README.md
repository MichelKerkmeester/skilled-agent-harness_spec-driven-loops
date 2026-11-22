---
title: "mcp-bladebro"
description: "Bladebro mode of mcp-browser-use: CLI first with a Code Mode MCP fallback, an owned agent-browser default, operator-gated real-browser lanes and three verbatim safety rules."
version: 1.2.1.0
---

# mcp-bladebro

The Bladebro mode of the `mcp-browser-use` hub. It tells an agent which transport to use, which browser lane to drive and which actions to refuse.

---

## 1. OVERVIEW

Use this mode when the hub selects Bladebro for an agentic, stealth or caller-owned-browser task. The table names what it covers and what it hands to the sibling modes.

| Aspect | What it gives you |
|---|---|
| **Use it for** | Agentic branching browser runs, operator-authorized stealth on a signed-in site, and attachment to a browser the caller owns |
| **Transport** | The `bladebro` CLI when installed; `bladebro mcp` through Code Mode when the binary is missing or the task needs composition, parallel isolated sessions or an MCP-only capability |
| **Default lane** | The Bladebro-owned agent-browser profile; real-browser `rb` lanes only on explicit request |
| **Hands off** | HAR, heap and performance traces, Lighthouse, raw CDP and cross-origin iframes go to `mcp-chrome-devtools`; deterministic signed-in proof goes to `mcp-aside-devtools` |
| **Pin** | Upstream Bladebro v4.8.2, read 2026-11-21 |

### Status

The packet is authored from upstream documentation pinned to v4.8.2. The install, the MCP lane and every agent-browser probe ran live on macOS arm64 on 2026-11-21. The real-browser reads in `clone` mode failed with the Aside browser binary, and attaching to a running Aside passed. Bladebro is still installed on this host because the operator chose to keep it. The results are in `benchmark/reports/`. Installing and removing Bladebro stay operator decisions.

---

## 2. FILES

- `SKILL.md`: the lane rule, the browser lanes, the limits and the safety rules R-SEC-1, R-SEC-2 and R-SEC-3.
- `ROUTER.md`: the packet machine router.
- `references/cli-reference.md`: the five tools, CLI output and configuration.
- `references/browser-lanes.md`: the agent browser and the `rb` lanes.
- `references/mcp-wiring.md`: the `bladebro` Code Mode manual and discovery.
- `references/install-and-verify.md`: the operator-gated install, the pin check and rollback.
- `assets/utcp-bladebro-manual.md`: the registered Code Mode manual, the one place its JSON is stated.
- `scripts/install.sh` and `scripts/doctor.sh`: the pinned install wrapper and the read-only doctor, described in `scripts/README.md`.
- `INSTALL-GUIDE.md`: the operator install walk-through.
- `feature-catalog/`: the current capability inventory, one file per feature, linked from the playbook scenarios.
- `examples/`: runnable example scripts for an isolated agent-browser read, a step plan and read-only attach reads, described in `examples/README.md`.
- `mcp-servers/`: install pointers for the `bladebro` binary (`bladebro-cli/`) and the built-in MCP server (`bladebro-mcp/`). Nothing is vendored there.
- `benchmark/`: the live-run reports.
- `changelog/`: release notes for this packet.
