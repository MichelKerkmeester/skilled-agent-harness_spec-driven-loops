# Orchestrator verifications (live, beyond the gpt-5.5 seats)

These are facts I (the orchestrating agent) confirmed by running real commands, correcting or hardening seat claims. A finding is a hypothesis until the cited evidence is opened — these are the opened ones. Date: 2026-06-14.

## 1. Code Mode http-transport support — CONFIRMED (framework) but UNPROVEN (in repo)
- `grep '@utcp' .opencode/skills/mcp-code-mode/mcp_server/index.ts` → imports `@utcp/http` (L17) + `@utcp/mcp` (L19); `package.json` deps `@utcp/http ^1.0.13`, `@utcp/mcp ^1.0.16`. Framework CAN do http manuals.
- `jq` over `.utcp_config.json` → EVERY registered manual (chrome_devtools_1/2, clickup_official, **figma**, github) is `stdio`. **Zero http manuals exist here.** → official-Figma-over-http is framework-plausible but unproven; conservative path = stdio `mcp-remote` bridge or the existing stdio Framelink manual.

## 2. npm package reality — MAJOR correction to IT1/IT4
Ran `npm view` (npm 11.9.0):
- **`figma-ds-cli`**: only published version is **1.0.0** (versions array = `["1.0.0"]`). bin = **only `figma-ds-cli`** → `src/index.js`. repo = `git+https://github.com/silships/figma-cli.git`, homepage intodesignsystems.com.
- **`figma-ds-cli@1.2.0` does NOT exist on npm (E404).** → IT4's "install pinned `figma-ds-cli@1.2.0`" is IMPOSSIBLE from npm. Repo `main` is 1.2.0 but **unpublished**.
- **`figma-cli` is a SEPARATE, UNRELATED npm package**: name `figma-cli` v1.0.0, author **"Fredi Bach, Unic AG"**, repo `git+https://github.com/unic/figma-cli.git`, desc "A CLI to export and scaffold from Figma directly into style guides like Estatico", **bin = `figma`**. This is NOT the silships tool. → **`npm i -g figma-cli` installs the WRONG tool.**

### Corrected install/invocation guidance (supersedes IT3/IT4 where they lean on `figma-cli`)
- **Canonical binary = `figma-ds-cli`** (npm-published, unambiguous). The skill should invoke `figma-ds-cli`, not `figma-cli`.
- `figma-cli` command only exists if installed from the **silships git repo** (`main` exposes both bins). Treat `figma-cli` on PATH as ambiguous — verify it resolves to silships (`figma-cli --version`/help), since the npm `figma-cli` package (unic) shadows the name.
- **install.sh:** install via `npm i -g figma-ds-cli` (→ `figma-ds-cli`), OR `npm i -g git+https://github.com/silships/figma-cli.git` / clone+`npm link` for the newer 1.2.0 (→ both bins). **NEVER `npm i -g figma-cli`** (pulls unic/figma-cli). Detection: prefer `figma-ds-cli` on PATH; if using `figma-cli`, confirm it's silships.

## 3. Supporting packages — CONFIRMED present on npm
- `figma-developer-mcp` (Framelink, the Code Mode `figma` manual) = **v0.12.0** ("Give your coding agent access to your Figma data…").
- `mcp-remote` (the stdio↔remote bridge for the official server) = **v0.1.38**.

## 3b. LIVE install verification (phase 007, 2026-06-14) — the version gap is FUNCTIONAL
Installed both versions on this machine via the skill's own `install.sh`:
- `install.sh --source npm` → `figma-ds-cli@1.0.0` at `/opt/homebrew/bin/figma-ds-cli`. `--help` lists only **12 commands** (`init, setup, status, connect, var, collections, tokens, create, render, export, eval, raw`); `connect` has **NO `--safe`** (yolo-only); there is **NO `daemon`, `unpatch`, `extract`, `import`, `bind`, `a11y`, `slot`, `fj`, `inspect`, …**.
- `install.sh --source repo --force` → `figma-ds-cli@1.2.0` (and `figma-cli@1.2.0`) built from `silships/figma-cli`. `--help` lists the **full ~130-command surface**; `connect --help` shows `--safe` ("plugin-based, no patching required"); `daemon` exposes `status/start/stop/restart/reconnect/diagnose`; `extract`/`import`/`shadcn`/`blocks`/`spec` present. `status` with no Figma connected cleanly prompts `figma-ds-cli init` (no crash).
- **Conclusion:** npm `1.0.0` is not just "fewer bins" — it is a much smaller TOOL. The documented skill surface requires **1.2.0 from the repo**. Fixed in `install.sh` (auto now upgrades npm→repo when stale) + SKILL.md "Version trap" + INSTALL_GUIDE §5 + figma_cli_reference "Version drift" + troubleshooting (new stale-version issue). The repo build also surfaces `npm audit` advisories (dev deps).
- doctor.sh and the install/connect-yolo(refusal)/version-warning paths all verified working against the real binary.

## 4. Net effect on the build
- Skill name `mcp-figma` is unaffected (skill name ≠ npm package).
- Reference docs + install.sh + RULES must canonicalize on `figma-ds-cli` and carry an explicit "`figma-cli` npm name-collision" warning as a top install gotcha + troubleshooting row.
- Official-MCP-via-Code-Mode: document the existing stdio Framelink manual as the working default; official server via `mcp-remote` stdio bridge as the conservative add; raw http manual as experimental/unverified-here.
