# Iteration 003 — mcp-figma skill architecture (blueprint)

- **Wave:** 2 (of 3)
- **Executor:** `openai/gpt-5.5-fast --variant high` via cli-opencode (read-only seat, exit 0)
- **Seat id:** b4640ur90
- **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-003.txt`
- **Raw output (full, with line-cited provenance):** `../raw/iter-003.out`
- **Confidence (seat self-report):** high (grounded in sibling skills + sk-doc templates)

> Orchestrator note: this is the de-facto build spec. Seat read mcp-open-design/SKILL.md, mcp-chrome-devtools/SKILL.md, sk-doc skill_md_template + smart_router and cited exact lines for every structural choice. Verbatim provenance is in raw/iter-003.out.

---

## Frontmatter (proposed)
```yaml
---
name: mcp-figma
description: "Figma CLI orchestrator: drives figma-cli for desktop Figma work and optionally routes Dev Mode MCP through Code Mode."
allowed-tools: [Bash, Edit, Glob, Grep, mcp__code_mode__call_tool_chain, Read, Write]
version: 1.0.0
---
```
Keywords: `figma, figma-cli, figma-ds-cli, figma-desktop, figma-dev-mode-mcp, design-tokens, variables, components, figma-export, figma-daemon, code-mode`
> Description ≈108 chars (≤130 budget OK); re-check against project-wide ~5,600-char description budget at registration.

## Smart router (Section 2)
**Primary detection signal:** workflow direction → CLI-primary vs optional-MCP.
**INTENT_SIGNALS (6):**
- `CREATE_RENDER` (w4): create/render/draw/component/frame/layout/import/tailwind/css/storybook
- `DESIGN_SYSTEM_TOKENS` (w4): tokens/variables/var:/styles/design system/component props/grid/annotate
- `INSPECT_EXPORT` (w4): inspect/extract/export/screenshot/metadata/DESIGN.md/selected node
- `CONNECT_SETUP_DAEMON` (w5): connect/safe/patch/unpatch/daemon/diagnose/status/reconnect/token/3456
- `MCP_CONTEXT` (w4): dev mode mcp/official figma mcp/get_design_context/get_variable_defs/code connect/mcp.figma.com/127.0.0.1:3845/code mode
- `TROUBLESHOOT` (w4): error/failed/not connected/desktop not running/binary not found/oauth/permission/catalog

**RESOURCE_MAP:** CREATE_RENDER/DESIGN_SYSTEM_TOKENS/INSPECT_EXPORT → figma_cli_reference.md + tool_surface.md; CONNECT_SETUP_DAEMON → figma_cli_reference.md + troubleshooting.md; MCP_CONTEXT → mcp_wiring.md + code_mode_integration.md + tool_surface.md; TROUBLESHOOT → troubleshooting.md + figma_cli_reference.md.
**Transport selector:** CLI is default (figma-cli owns author/modify/export); switch to OPTIONAL_MCP only when MCP intent + "mcp" explicit, or when figma-cli unavailable but Code Mode is and MCP context requested. Keep sk-doc guarded discovery + top-2 ambiguity + UNKNOWN_FALLBACK.

## 8-section blueprint
1. **WHEN TO USE** — activates for Figma Desktop automation, extraction, variable/token work, import/export, CLI daemon setup, optional Dev Mode MCP reads. NOT for: generic app coding w/o Figma, pure taste decisions (→sk-design-interface), browser debugging (→chrome-devtools), MagicPath/Open-Design tasks, official MCP writes unless requested.
2. **SMART ROUTING** — detection (CLI vs MCP), phase flow (verify binary → verify Desktop/daemon → score → load refs → gate mutation → execute → verify), INTENT_SIGNALS/RESOURCE_MAP/levels/guarded-discovery/fallback.
3. **HOW IT WORKS** — binary verification (`command -v figma-cli` then `figma-ds-cli`, then `--version`/`--help`); Figma Desktop + daemon model (HTTP 127.0.0.1:3456, X-Daemon-Token at ~/.figma-ds-cli/.daemon-token); connect modes (safe preferred, yolo only on consent, unpatch rollback); command classes; optional official MCP via Code Mode (remote/desktop, mcp-remote bridge, naming).
4. **RULES** — ALWAYS/NEVER/ESCALATE (full text below).
5. **REFERENCES** — figma_cli_reference, tool_surface, mcp_wiring, code_mode_integration, troubleshooting; loading notes.
6. **SUCCESS CRITERIA** — connect/read/mutate/MCP-context completion checklists.
7. **INTEGRATION POINTS** — Bash owns figma-cli; Code Mode owns optional MCP; sk-design-interface owns design judgment; sk-code owns adapting exports into code; chrome-devtools for browser preview only.
8. **REFERENCES & RELATED** — router-discovered refs; related skills; upstream figma-ds-cli/figma-cli + official Dev Mode MCP + Code Mode.

## CLI-primary vs MCP-optional split (the routing rule)
- **figma-cli = PRIMARY** — operate Figma Desktop: connect, daemon lifecycle, inspect/export, `extract`→DESIGN.md, import from Tailwind/CSS/tokens/Storybook, create/modify/delete nodes, variables, components, annotations, grids, plugins, dev links.
- **Official Figma Dev Mode MCP = OPTIONAL/opt-in** — pull design context INTO the agent: `get_design_context`, `get_variable_defs`, `get_screenshot`, `get_metadata`, `get_code_connect_map`, `search_design_system` via Code Mode. MCP writes (`use_figma`) take the SAME mutating gates as CLI writes.

## RULES (full)
**ALWAYS:** (1) verify binary on PATH (figma-cli → figma-ds-cli → `--version`/`--help`); (2) require Figma Desktop running; (3) confirm daemon status before daemon-backed commands; (4) prefer `connect --safe` for first setup; (5) gate every destructive verb (confirm + explicit target + command preview + rollback); (6) treat eval/raw/run as arbitrary mutation; (7) apply sk-design-interface when a read/export feeds a design decision; (8) keep official MCP optional/opt-in (no silent CLI→MCP switch).
**NEVER:** (1) auto-run yolo app.asar patch without consent + stated `unpatch` rollback; (2) destructive via active-selection fallback (require explicit id/name); (3) run var delete-all/var delete-batch/delete/remove/node delete/undo/unwrap/fj delete/plugins uninstall/dev unlink/component prop delete/grid clear/annotate clear without confirmation; (4) assume `figma-cli` exists because `figma-ds-cli` is installed; (5) expose/paste the daemon token; (6) claim official MCP availability before Code Mode discovery confirms manual + exact tool names.
**ESCALATE IF:** (1) binary missing/wrong-only → ask to install/pin `figma-ds-cli@1.2.0`; (2) Figma Desktop not running or daemon diagnosis fails after reconnect; (3) before yolo patch / destructive / broad deletes / undo-unwrap / arbitrary eval-raw-run; (4) official MCP requested but OAuth/catalog/Dev-Mode/Full-seat unmet; (5) CLI and MCP disagree on file/node/variable state → ask which prevails before mutation.

## Reference-file plan (build targets)
- `references/figma_cli_reference.md` — package/binary identity, verification, Node/macOS baseline, Desktop-session req, connect modes, daemon verbs, token/header model, command examples.
- `references/tool_surface.md` — read-only/mutating/destructive taxonomy + destructive set + eval/raw/run rule + extract/import workflows + var:name binding.
- `references/mcp_wiring.md` — official Dev Mode MCP endpoints, remote vs desktop prereqs, OAuth/catalog/Dev-Mode/seat reqs, conservative mcp-remote bridge.
- `references/code_mode_integration.md` — manual discovery, `{manual}.{manual}_{tool}` naming, existing community `figma` manual caveat, official registration plan, call_tool_chain snippets.
- `references/troubleshooting.md` — missing binary, npm-latest mismatch, Desktop not running, daemon token, 3456 unreachable, safe-plugin issues, yolo recovery via unpatch, OAuth/catalog failures.
- `README.md`, `feature_catalog/feature_catalog.md`, `manual_testing_playbook/manual_testing_playbook.md`, `INSTALL_GUIDE.md`, `scripts/install.sh`.

## Cross-skill edges (graph-metadata schema 2)
- **depends_on:** sk-design-interface (0.7, design judgment when reads/exports feed a decision); mcp-code-mode (0.45, optional MCP via Code Mode).
- **enhances:** sk-code (0.4, Figma exports/DESIGN.md/vars feed app implementation).
- **siblings:** mcp-open-design (0.55), mcp-chrome-devtools (0.5), mcp-magicpath (0.5), mcp-code-mode (0.35).

## Confidence + unknowns
High for structure/routing/rules/refs/edges (grounded in cited local files). Unknowns: official MCP HTTP transport unproven in repo (→ mcp-remote bridge); exact figma-cli `--help` text to verify at build; exact official MCP manual name to discover via Code Mode before documenting invocation as fact.
