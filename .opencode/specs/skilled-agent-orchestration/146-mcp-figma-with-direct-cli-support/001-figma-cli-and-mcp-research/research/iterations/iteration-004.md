# Iteration 004 — install, safety, lifecycle (playbook)

- **Wave:** 2 (of 3)
- **Executor:** `openai/gpt-5.5-fast --variant high` via cli-opencode (read-only seat, exit 0)
- **Seat id:** bgwxx09au
- **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-004.txt`
- **Raw output (full snippets + tables):** `../raw/iter-004.out`
- **Confidence (seat self-report):** high (all local reads succeeded)

> Orchestrator note: seat read chrome-devtools INSTALL_GUIDE + install.sh, mcp-open-design mcp_wiring.md + tool_surface.md, mcp-code-mode configuration.md, .utcp_config.json — and cited lines. Full config snippets/tables in raw/iter-004.out.

---

## figma-cli install flow + `install.sh` (install + verify ONLY; never connect/patch)
Decision flow: (1) platform (macOS baseline; Linux/Win = unsupported/unverified); (2) Node `>=18` + npm; (3) detect Figma Desktop (`/Applications/Figma.app` or `~/Applications`), don't require running for install; (4) detect bins (`command -v figma-cli` then `figma-ds-cli`, `--version`); (5) **npm mismatch handling — never bare `npm i -g figma-ds-cli`; try pinned `figma-ds-cli@1.2.0`, then verify BOTH bins**; (6) repo fallback (resolve `npm view figma-ds-cli@1.2.0 repository.url`, clone OUTSIDE repo e.g. `~/.figma-ds-cli/source`, `npm link`); (7) verify (paths, version, help, Desktop present, optional `daemon status` if Figma open).
`install.sh`: flags `--help/--verbose/--force/--skip-verify/--source auto|npm|repo/--repo-url/--install-root`; phases check_prerequisites → detect_figma_desktop → check_existing_installation → install_npm_pinned → verify_binaries → install_from_repo → verify_installation → report_next_steps. Idempotent (skip if `figma-cli` works & no `--force`; "partial" if only `figma-ds-cli`); `set -euo pipefail`; mirrors chrome-devtools install.sh pattern. **Never patches Figma during install.**

## Connect + daemon lifecycle
**Default = `figma-cli connect --safe`** (FigCli plugin, no patch). Yolo `figma-cli connect` only on explicit consent (patches app.asar, codesign, restarts Figma, CDP 9222, may need Full Disk Access/admin, breaks on Figma update; rollback `figma-cli unpatch`).
- Safe flow: confirm Desktop installed → user opens file → import `plugin/manifest.json` once → keep Plugins→Development→FigCli open → `connect --safe` → `daemon status` (→ `daemon diagnose` if unhealthy).
- Yolo flow: STOP+confirm → state effect+rollback → ensure Figma safe to restart → `connect` → verify 9222 localhost-only → `daemon status`.
- Daemon: HTTP 127.0.0.1:3456, `X-Daemon-Token` (~/.figma-ds-cli/.daemon-token), PID ~/.figma-cli-daemon.pid, idle ~60min, not reboot-persistent. Recovery: status → diagnose → restart → reconnect. `Unauthorized` → diagnose then restart (don't auto-delete token).

## Optional MCP via Code Mode (opt-in; CLI works fully alone)
Code Mode facts: manuals in `.utcp_config.json` `manual_call_templates`; manual name = JS-identifier namespace; `.env` vars prefixed `{manual}_VAR`. Options:
1. **Framelink stdio — ALREADY registered as `figma`** (`npx -y figma-developer-mcp@latest --stdio`, `${FIGMA_API_KEY}`); only needs `.env`: `figma_FIGMA_API_KEY=figd_...` (prefix required even though config says `${FIGMA_API_KEY}`).
2. **Official remote http** `figma_official_remote` → `https://mcp.figma.com/mcp` (⚠️ http transport unproven in repo; catalog/OAuth gated).
3. **Official desktop http** `figma_official_desktop` → `http://127.0.0.1:3845/mcp` (needs latest Figma + open Design file + Dev Mode + "Enable desktop MCP server").
4. **Conservative `mcp-remote` stdio bridges** for remote/desktop (`npx -y mcp-remote <url>`) — the safe path since stdio is proven here.
Verify discipline: inspect JSON → validate → restart Code Mode → `list_tools()` filter by prefix → `search_tools(...)` → `tool_info()` before use; naming `{manual}.{manual}_{tool}`; never guess names. (Full snippets: raw/iter-004.out lines 120-216.)

## Safety & consent model
Global: never auto-patch; never auto-delete/bulk-delete/clear/unlink/uninstall/unwrap/undo/raw/eval/MCP-write without confirm; before mutation state effect+target+rollback; prefer duplicating file/page/selection first; bind services to 127.0.0.1 (don't expose 3456/9222/3845).
**STOP-and-confirm + rollback** (full table raw/iter-004.out:235-256): yolo connect→`unpatch`; var delete-all/delete-batch→dup/version-history; delete/remove, node delete, undo, unwrap, fj delete→Figma undo/version-history; plugins uninstall→reinstall; dev unlink→recreate; component prop delete, grid clear, annotate clear→dup/history; eval/raw/run→review first; MCP write-to-canvas→undo/history+dup first; port-kill→identify owner first.

## Licensing / vendoring
figma-cli = MIT. Reference upstream; install from npm or external user-owned clone; **do not vendor figma-cli source into the repo/skill**; repo fallback clones OUTSIDE the repo. Skill may ship small wrapper scripts + docs, not copied upstream code. Mirrors mcp-open-design's "use live, never vendor".

## INSTALL_GUIDE.md outline (14) + scripts plan
Outline: 1 AI-first prompt · 2 Overview · 3 Architecture (CLI primary + optional MCP) · 4 Prereqs · 5 Install flow · 6 Verification · 7 Connect modes · 8 Daemon lifecycle · 9 Optional MCP via Code Mode · 10 Safety model · 11 Licensing/upstream · 12 Troubleshooting · 13 Quick reference · 14 Version history.
Scripts: `install.sh` (install+verify), `doctor.sh` (report-only: node/npm/figma/bins/ports/daemon/token), `connect-safe.sh` (guided, refuses to patch), `connect-yolo.sh` (requires `--i-understand-this-patches-figma`), `daemon.sh` (status/start/diagnose/restart/reconnect), `unpatch.sh`, `print-utcp-snippets.sh` (prints Code Mode snippets, never edits `.utcp_config.json`).

## Troubleshooting (symptom→cause→fix) — full table raw/iter-004.out:295-312
Covers: `figma-cli: command not found` (npm latest mismatch → pinned 1.2.0/repo); only `figma-ds-cli` present; Node<18; Figma not found/not running; safe-connect plugin not open; yolo patch failed/Figma-update broke it (`unpatch`); daemon Unauthorized (diagnose→restart); 3456 unreachable; 9222/3845 port conflicts; official remote OAuth/catalog failure (→ mcp-remote bridge); MCP write fails (Full seat); Code Mode var-not-found (`figma_FIGMA_API_KEY` prefix); tools missing in Code Mode.

## Confidence + unknowns
High (local reads succeeded). Unknowns: exact upstream repo URL (resolve `npm view figma-ds-cli@1.2.0 repository.url` before scripting); Code Mode HTTP for official MCP unproven (→ mcp-remote stdio); exact official MCP tool names + write annotations (verify via live `list_tools()`); no install/config mutation/network tested (read-only).
