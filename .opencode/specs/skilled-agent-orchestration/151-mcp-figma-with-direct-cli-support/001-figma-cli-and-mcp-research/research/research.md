# Deep Research — mcp-figma (figma-cli primary + optional Figma MCP via Code Mode)

Synthesis of a 5-iteration deep-research effort (gpt-5.5-fast --variant high seats, read-only, orchestrator-written) plus live orchestrator verifications. Goal: design a new `mcp-figma` skill where the silships **figma-cli is the PRIMARY tool** and a **Figma MCP is OPTIONAL, invoked through Code Mode** — structurally modeled on `mcp-chrome-devtools` (CLI-primary + MCP-via-Code-Mode) and `mcp-open-design` (CLI + optional-MCP hybrid, daemon model, gated mutating verbs, design-judgment handoff).

- **Spec folder:** `151-mcp-figma-with-direct-cli-support` (phase parent)
- **Research phase:** `001-figma-cli-and-mcp-research`
- **Iterations:** 5 (3 waves) — all exit 0. Per-iteration detail in `iterations/iteration-00{1..5}.md`; raw seat output in `raw/iter-00{1..5}.out`; live verifications in `iterations/orchestrator-verifications.md`.

---

## 1. Executive summary
- **figma-cli** (silships) is a local CLI that drives **Figma Desktop** with **no API key**. Two connect modes: **yolo** (`connect`, patches Figma `app.asar`, CDP port 9222) and **safe** (`connect --safe`, FigCli plugin). A local **daemon** (HTTP `127.0.0.1:3456`, `X-Daemon-Token`) brokers commands. Rich command surface (tokens, variables, render/JSX, create, export, lint, a11y, design-system extract/import).
- **figma-cli ships NO MCP of its own** (verified by source scan). So **"the figma mcp" = the separate official Figma Dev Mode MCP** (remote `https://mcp.figma.com/mcp` OAuth; desktop `http://127.0.0.1:3845/mcp` Dev Mode), OR the **community Framelink `figma-developer-mcp`** already registered in this repo's Code Mode.
- The skill should be **CLI-primary** (author/modify/export in Figma) with the **Figma MCP optional/opt-in** (pull design context/variables/screenshots INTO the agent for codegen) — exactly the chrome-devtools split.
- **⚠️ Install trap (orchestrator-verified):** the npm package **`figma-cli` is an UNRELATED tool** (unic/figma-cli, bin `figma`). The silships tool publishes as **`figma-ds-cli` (npm latest = 1.0.0, bin `figma-ds-cli` only)**; repo `main` is 1.2.0 (unpublished, exposes both bins). **Canonicalize on `figma-ds-cli`; never `npm i -g figma-cli`.**

## 2. Key findings by area
### figma-cli (IT1 + verifications)
- Package `figma-ds-cli`; npm has only **1.0.0** (bin `figma-ds-cli`); **1.2.0 is repo-only**; repo `git+https://github.com/silships/figma-cli.git`. Node `>=18`, **macOS baseline**.
- Connect: **safe preferred** (no patch); yolo patches app.asar + codesign + CDP 9222, may need Full Disk Access/admin, breaks on Figma updates; rollback `figma-cli unpatch`.
- Daemon: HTTP `127.0.0.1:3456`, token `~/.figma-ds-cli/.daemon-token`, PID `~/.figma-cli-daemon.pid`, idle ~60min. Verbs: status/diagnose/start/stop/restart/reconnect.
- Command classes tagged READ-ONLY / MUTATING / DESTRUCTIVE (full table `raw/iter-001.out`). Destructive set: `var delete-all|delete-batch`, `delete|remove`, `node delete`, `undo`, `unwrap`, `fj delete`, `plugins uninstall`, `dev unlink`, `component prop delete`, `grid clear`, `annotate clear`. `eval|raw|run` = arbitrary mutation.
- Design I/O: `extract`→DESIGN.md (11 sections, auto-splits >~50k tokens); `import` from Tailwind/CSS/tokens.json/Storybook; `var:name` binding. `init-agent` writes `AGENTS.md`/`.cursor/rules` (repo-mutating → not run by default).

### Figma MCP + Code Mode (IT2 + verifications)
- Official: remote `https://mcp.figma.com/mcp` (HTTP, OAuth, **client-catalog gate**, seat rate limits, write=Full seat) vs desktop `http://127.0.0.1:3845/mcp` (HTTP, Dev Mode + open file). Tools: `get_design_context`, `get_variable_defs`, `get_screenshot`, `get_metadata`, `get_code_connect_map`, `search_design_system`, `use_figma` (write), etc.
- Community **Framelink `figma-developer-mcp`** (v0.12.0, stdio, `FIGMA_API_KEY`) is **already registered** as Code Mode manual `figma`.
- Code Mode: `call_tool_chain`, naming `{manual}.{manual}_{tool}`, `.env` vars prefixed `figma_FIGMA_API_KEY`. **stdio is proven here; http is framework-loaded (`@utcp/http`) but UNPROVEN (zero http manuals exist).** Conservative official path = **`mcp-remote` (v0.1.38) stdio bridge**.

### Skill architecture (IT3)
- Frontmatter `name: mcp-figma`, concise description, **minimal allowed-tools** (IT5: trim to ~`[Read, Bash]` + code_mode; avoid Edit/Write at runtime). 6-intent smart router (CREATE_RENDER, DESIGN_SYSTEM_TOKENS, INSPECT_EXPORT, CONNECT_SETUP_DAEMON, MCP_CONTEXT, TROUBLESHOOT). 8-section SKILL.md. References: figma_cli_reference, tool_surface, mcp_wiring, code_mode_integration, troubleshooting. Graph edges: depends_on sk-interface-design(0.7)+mcp-code-mode(0.45); enhances sk-code(0.4); siblings mcp-open-design/mcp-chrome-devtools/mcp-magicpath/mcp-code-mode.

### Install / safety / lifecycle (IT4 + verifications)
- `install.sh` = install + verify ONLY (never connect/patch); npm `figma-ds-cli` or git install; **never `npm i -g figma-cli`**. Scripts: install/doctor/connect-safe/connect-yolo(`--i-understand-this-patches-figma`)/daemon/unpatch/print-utcp-snippets. STOP-and-confirm + rollback table per destructive verb. MIT, **don't vendor** (clone outside repo). 14-section INSTALL_GUIDE; troubleshooting table.

## 3. Recommended phased plan (final, from IT5)
- **151 parent** (control trio only) → **001 research** (this) → **002 CLI-first runtime MVP** (SKILL.md + core references + safety taxonomy) → **003 install & lifecycle** (INSTALL_GUIDE + scripts) → **004 optional MCP + Code Mode** (mcp_wiring + code_mode_integration) → **005 user docs + validation** (README + feature_catalog + manual_testing_playbook + changelog) → **006 registration + strict validation** (descriptions.json, graph-metadata, advisor triggers, validate.sh --strict) → **007 optional live verification (gated, human-approved)**.

## 4. Risk register (top)
npm binary collision (H/H — `figma-cli` npm is unrelated; canonicalize `figma-ds-cli`) · yolo patch reversibility (M/H — safe default, `unpatch`) · official-MCP http/OAuth/catalog unproven (H/M — mcp-remote bridge) · Framelink naming conflict (M/M — `figma_official_*` names) · MCP schema drift (M/M — verify via tool_info) · export overwrite (M/M — explicit path) · figma-cli doc drift (M/H — live `--help`) · token exposure (L/H — redact) · design-judgment scope creep (H/M — route to sk-interface-design) · cross-platform overclaim (H/L — macOS baseline). Full: `iterations/iteration-005.md`.

## 5. Open decisions for the operator
See the questions surfaced at plan-presentation time (live-install now vs later; version 1.0.0 vs pre-1.0; official-MCP http vs mcp-remote-only; Framelink-as-default; print-only utcp scripts; platform support; manual-testing destructive scope). Seat recommendations: keep Framelink default + official under new names; print-only scripts; macOS baseline.

<!-- ANCHOR:references -->
## References
- `iterations/iteration-001.md` — figma-cli capabilities (source-verified)
- `iterations/iteration-002.md` — Figma MCP landscape + Code Mode integration
- `iterations/iteration-003.md` — skill architecture blueprint
- `iterations/iteration-004.md` — install / safety / lifecycle playbook
- `iterations/iteration-005.md` — convergence / phasing / risks
- `iterations/orchestrator-verifications.md` — live npm/Code-Mode verifications (npm collision correction)
- `raw/iter-00{1..5}.out` — verbatim seat output (full command tables, config snippets)
- Upstream: https://github.com/silships/figma-cli · https://developers.figma.com/docs/figma-mcp-server/ · figma-developer-mcp (Framelink) · mcp-remote
- Siblings: `.opencode/skills/mcp-open-design/`, `.opencode/skills/mcp-chrome-devtools/`, `.opencode/skills/mcp-code-mode/`
<!-- /ANCHOR:references -->

<!-- _memory:
  last_updated_by: orchestrate
  recent_action: completed 5-iteration deep research (gpt-5.5-fast), wrote synthesis
  next_safe_action: present phased plan + open decisions, then scaffold 151 + build 002
-->
