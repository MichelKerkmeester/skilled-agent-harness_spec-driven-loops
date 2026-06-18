---
title: "Figma CLI Troubleshooting"
description: "Symptom to cause to fix guide for common figma-ds-cli, daemon, connect, and optional Code Mode MCP issues."
trigger_phrases:
  - "figma-cli command not found"
  - "figma-ds-cli troubleshooting"
  - "figma daemon unauthorized"
  - "figma connect safe mode"
  - "figma yolo patch broke"
  - "figma code mode variable not found"
importance_tier: "normal"
contextType: "implementation"
---

# Figma CLI Troubleshooting

> **IMPORTANT:** Examples in this guide are illustrative. The CLI is not assumed to be installed in any given environment, so command output is not reproduced literally. Verify the actual surface with `figma-ds-cli --help` (or the relevant subcommand's `--help`) before relying on a flag or verb.

---

## 1. OVERVIEW

### Core Principle

Find the root cause before applying a fix, because symptom fixes create cascading failures. The most common traps are upstream of any Figma operation: the wrong package installed under a colliding name, an old Node, Figma Desktop not open, or a connect mode that was never completed. Work the quick diagnostics first, then jump to the matching symptom row.

### When to Use

- Diagnose a `figma-ds-cli` install, binary-collision, connect, daemon, or port-conflict failure before mutating anything.
- Resolve an optional Figma MCP (Code Mode) discovery or env-prefix failure.

### Key Sources

- [figma_cli_reference.md](figma_cli_reference.md) - binary identity, connect modes, and the daemon model behind these symptoms.
- [tool_surface.md](tool_surface.md) - the command gating classes the escalation rows reference.
- [mcp_wiring.md](mcp_wiring.md) - the optional Code Mode MCP path and its `.env` prefix.

Two hard facts shape every fix below:

- **The canonical binary is `figma-ds-cli`** (silships, npm, MIT). The npm package literally named `figma-cli` is an **unrelated** tool (unic/figma-cli, bin `figma`). The `figma-cli` command only exists when installed from the silships git repo. **Never `npm i -g figma-cli`.**
- **The CLI drives the live Figma Desktop session**, so Figma Desktop must be **open with a file**, Node must be **>=18**, and there is **no Figma API key** for the CLI. macOS is the supported baseline, and Linux/Windows are experimental and unverified.

---

## 2. PREREQUISITES

Before deeper troubleshooting, confirm the foundation:

- **5-Check Sequence**: Binary identity -> Node version -> Figma Desktop open -> Connect mode completed -> Daemon health.
- **Platform Awareness**: macOS is the supported baseline. Linux/Windows are experimental and unverified, so treat platform-specific failures there as unsupported.
- **Error Capture**: Use `2>&1` so stderr is visible when a command appears to do nothing.

**Required knowledge**:

- Basic Bash/terminal usage.
- npm global install and PATH concepts.
- The difference between the safe plugin connect and the gated yolo patch (see `figma_cli_reference.md`).

---

## 3. QUICK DIAGNOSTICS

Run these checks first. All examples are illustrative, so confirm with `--help`.

```bash
# 1. Which Figma binary is on PATH? (canonical = figma-ds-cli)
command -v figma-ds-cli || echo "figma-ds-cli not found"
command -v figma-cli    || echo "figma-cli not present (this is fine; figma-ds-cli is canonical)"

# 2. Node version (must be >=18)
node --version

# 3. Is Figma Desktop installed? (must also be OPEN with a file)
ls -d /Applications/Figma.app 2>/dev/null || echo "Figma Desktop not found in /Applications"

# 4. Daemon health (only meaningful after a connect)
figma-ds-cli daemon status 2>&1
# If unhealthy:
figma-ds-cli daemon diagnose 2>&1

# 5. Daemon endpoint / token presence (do NOT print the token contents)
ls -l ~/.figma-ds-cli/.daemon-token 2>/dev/null || echo "no daemon token yet"
```

---

## 4. INSTALLATION ISSUES

### Issue: `figma-ds-cli: command not found`

**Symptoms**:

```bash
$ figma-ds-cli --version
bash: figma-ds-cli: command not found
```

**Diagnosis**:

```bash
# Was anything installed under the silships name?
npm list -g figma-ds-cli 2>&1

# Is the npm global bin directory on PATH?
npm config get prefix
echo "$PATH"
```

**Causes**:

- `figma-ds-cli` was never installed.
- It was installed but the npm global bin directory is not on `PATH`.

**Fix**:

1. **Install the correct package** (npm-published; canonical binary):
   ```bash
   npm i -g figma-ds-cli      # illustrative; verifies as figma-ds-cli
   ```
   The newer repo build (which also exposes a `figma-cli` alias) installs from the silships git repo instead:
   ```bash
   npm i -g git+https://github.com/silships/figma-cli.git
   # or: clone OUTSIDE this repo, then npm link
   ```
2. **Fix PATH** if the binary exists but is not found, adding the npm global bin to your shell profile and re-sourcing it.
3. **Never** `npm i -g figma-cli` to recover, because that pulls the unrelated tool (see next row).

---

### Issue: accidentally installed the unrelated npm `figma-cli`

**Symptoms**:

```bash
# `figma` exists but none of the figma-ds-cli verbs work:
$ figma connect --safe
# unknown command / unrelated help text (this is unic/figma-cli, not silships)
```

**Cause**: `npm i -g figma-cli` installs **`figma-cli` v1.0.0 by "Fredi Bach, Unic AG"** (repo `unic/figma-cli`, bin `figma`, a Figma-export/scaffold tool for style guides). This is **NOT** the silships tool and shares no command surface with `figma-ds-cli`.

**Fix**:

```bash
# Remove the wrong tool
npm uninstall -g figma-cli      # illustrative

# Install the correct one. Prefer the skill installer, which lands the full 1.2.0 surface:
scripts/install.sh              # auto: npm, then upgrade from repo when npm is stale
figma-ds-cli --version          # confirm it resolves to the silships tool, >= 1.2.0
```

> The silships `figma-cli` **command** only exists when installed from the silships git repo. If a `figma-cli` command is on PATH, confirm it resolves to silships (`figma-cli --version`/`--help`) before trusting it, because the unic npm package shadows the name. Prefer `figma-ds-cli` everywhere.

---

### Issue: figma-ds-cli is installed but `--safe`, `daemon`, or most commands are missing

**Symptoms**:

```bash
$ figma-ds-cli --version
1.0.0
$ figma-ds-cli connect --safe
# error: unknown option '--safe'
$ figma-ds-cli daemon status
# error: unknown command 'daemon'
```

**Cause**: you have the **npm-published `figma-ds-cli@1.0.0`**, a minimal build. npm only ever published `1.0.0` (no `--safe`, no `daemon`, no `extract`/`import`/`a11y`/`slot`, ~12 commands total). The full surface this skill documents is **1.2.0**, which is **unpublished on npm** and exists only in the silships repo.

**Fix**:

```bash
# Upgrade to 1.2.0 from the silships repo:
scripts/install.sh --source repo --force
figma-ds-cli --version          # expect >= 1.2.0
figma-ds-cli connect --help     # should now list --safe
```

> `scripts/install.sh --source auto` (the default) does this automatically: it installs from npm, detects the stale `1.0.0`, and upgrades from the repo.

---

### Issue: only one binary present (`figma-ds-cli` works, `figma-cli` missing)

**Symptoms**:

```bash
$ command -v figma-ds-cli   # → found
$ command -v figma-cli      # → not found
```

**Cause**: The **npm-published** package exposes **only `figma-ds-cli`**. The dual-bin form (`figma-ds-cli` + `figma-cli`) exists only in the newer silships **repo** build (`main`), which is not published to npm.

**Fix**: This is normal and not an error. **Use `figma-ds-cli` as the canonical command**, since every verb in this skill works through it. Only install from the silships repo if you specifically need the newer repo build, and do not chase the `figma-cli` alias.

---

### Issue: Node version too old (Node <18)

**Symptoms**:

```bash
$ figma-ds-cli --version
# errors or unexpected behavior on an old Node runtime
```

**Diagnosis**:

```bash
node --version   # figma-ds-cli requires Node.js >=18
```

**Fix**:

```bash
# Using nvm (recommended)
nvm install 18
nvm use 18
# Or install/update Node from nodejs.org, then re-run the install.
```

---

## 5. FIGMA DESKTOP ISSUES

### Issue: Figma Desktop not found

**Symptoms**: Connect or any CLI operation fails because there is no Figma Desktop to drive.

**Diagnosis**:

```bash
ls -d /Applications/Figma.app 2>/dev/null || ls -d ~/Applications/Figma.app 2>/dev/null \
  || echo "Figma Desktop not installed"
```

**Cause**: The CLI drives the **local Figma Desktop session**, so there is no API-key/cloud fallback. Without Figma Desktop installed, nothing connects.

**Fix**: Install Figma Desktop, then return to the connect flow. (macOS is the supported baseline.)

---

### Issue: Figma Desktop not running / no file open

**Symptoms**: The binary is present and Figma is installed, but connect or any document command fails to reach a live document.

**Cause**: figma-ds-cli requires Figma Desktop to be **open with a file**, since the daemon bridges to the active Desktop session, not to a cloud document.

**Fix**: Launch Figma Desktop, open (or create) a file, keep it focused, then re-run `figma-ds-cli connect --safe` and `figma-ds-cli daemon status`.

---

### Issue: safe-mode plugin not imported / not open

**Symptoms**: `figma-ds-cli connect --safe` does not establish a working bridge, and the daemon stays unhealthy.

**Cause**: Safe mode runs the **FigCli plugin** as the bridge (no app patch). The plugin must be imported once and then kept open every session.

**Fix**:

1. Confirm Figma Desktop is open with a file.
2. Import the plugin manifest **once**: in Figma, import `plugin/manifest.json` from the figma-ds-cli install.
3. Open and **keep open** `Plugins -> Development -> FigCli` for the whole session.
4. Re-run `figma-ds-cli connect --safe`, then `figma-ds-cli daemon status`.

> Safe connect (`connect --safe`) is the **default and recommended** path, and it never patches Figma.

---

## 6. CONNECT (YOLO PATCH) ISSUES

> The yolo patch is **gated**: it modifies Figma Desktop `app.asar` (and codesigns on macOS) and is only run on explicit consent with a stated rollback. The rollback for every yolo failure below is `figma-ds-cli unpatch`.

### Issue: yolo patch failed (permissions / Full Disk Access)

**Symptoms**: `figma-ds-cli connect` (yolo) fails while patching the Figma app, codesigning, or restarting Figma.

**Cause**: The patch writes to the Figma application bundle and re-signs it. On macOS this can require **Full Disk Access** and/or admin rights, and the operation also restarts Figma.

**Fix**:

1. Prefer the safe path instead: `figma-ds-cli connect --safe` (no patch, no special permissions).
2. If yolo is genuinely required, grant the terminal Full Disk Access (and admin where needed), ensure Figma is safe to restart, re-confirm consent, then re-run `figma-ds-cli connect`.
3. If the bundle is left in a bad state, revert with `figma-ds-cli unpatch`.

---

### Issue: yolo connection broke after a Figma update

**Symptoms**: A previously working yolo connection stops working after Figma Desktop auto-updates.

**Cause**: A Figma update replaces the patched `app.asar`, undoing the patch (and may invalidate the codesign).

**Fix**:

```bash
# Revert to a known-clean bundle first, then re-establish the connection.
figma-ds-cli unpatch        # illustrative; restore the original app.asar
figma-ds-cli connect --safe # prefer the no-patch path going forward
# (re-run yolo `connect` only on renewed explicit consent)
```

---

## 7. DAEMON ISSUES

The daemon is a local **HTTP server on `127.0.0.1:3456`** (not a Unix socket), authed via the `X-Daemon-Token` header (`~/.figma-ds-cli/.daemon-token`), PID at `~/.figma-cli-daemon.pid`, with an idle timeout (~60 min) and no reboot persistence. Recovery order is always **status -> diagnose -> restart -> reconnect**.

### Issue: daemon "Unauthorized"

**Symptoms**:

```bash
$ figma-ds-cli daemon status
Unauthorized
```

**Cause**: Token mismatch between the client and the running daemon (`X-Daemon-Token`).

**Fix**:

```bash
figma-ds-cli daemon diagnose 2>&1   # inspect the mismatch first
figma-ds-cli daemon restart 2>&1    # restart re-aligns the token
```

> **Never auto-delete the token** (`~/.figma-ds-cli/.daemon-token`) and never print its contents in user-facing output. Diagnose, then restart, because deletion is not the remedy.

---

### Issue: daemon unreachable on port 3456

**Symptoms**: Daemon-backed commands hang or fail to connect to `127.0.0.1:3456`.

**Diagnosis**:

```bash
figma-ds-cli daemon status 2>&1
ls -l ~/.figma-cli-daemon.pid 2>/dev/null   # is a daemon recorded?
lsof -nP -iTCP:3456 -sTCP:LISTEN 2>/dev/null # who, if anyone, owns 3456
```

**Causes**:

- The daemon idled out (~60 min), since it is not reboot-persistent.
- The daemon crashed.
- Another process holds port 3456.

**Fix**:

1. **Idle / crashed**: `figma-ds-cli daemon restart` (then `daemon reconnect` if the bridge is up but the document link dropped).
2. **Port owned by another process**: identify the owner with `lsof` first, and **never blind-kill** the port. If it is a stale figma-ds-cli daemon, `daemon restart`, but otherwise resolve the owning process before reusing 3456.

---

## 8. PORT CONFLICT ISSUES

### Issue: port 9222 conflict (yolo / CDP)

**Symptoms**: A yolo connection fails to expose CDP, or another tool is already using port 9222.

**Cause**: The yolo patch restarts Figma with remote debugging on **fixed CDP port 9222**. Another Chromium-based tool (for example a browser-debugging session) may already hold 9222.

**Fix**:

```bash
lsof -nP -iTCP:9222 -sTCP:LISTEN 2>/dev/null   # identify the owner FIRST
```

- If a different tool owns 9222 (for example a `mcp-chrome-devtools` session), stop that tool or free the port, then re-establish the Figma yolo connection.
- Do not kill an unidentified process, and confirm the owner before acting.
- Prefer `connect --safe`, which uses the plugin bridge and does not need port 9222.

---

## 9. OPTIONAL MCP (CODE MODE) ISSUES

The optional Figma MCP is the community **Framelink `figma-developer-mcp`**, already registered in this repo's Code Mode as the manual **`figma`** (stdio). The CLI works fully without it, and the MCP is opt-in and only for pulling design context FROM Figma. The official Figma Dev Mode MCP is **out of scope for this release**, so do not document it as a supported path. (A future option only.)

### Issue: Code Mode "variable not found" for the Figma token

**Symptoms**: Code Mode cannot resolve the Figma API key for the `figma` manual, even though the config references `${FIGMA_API_KEY}`.

**Cause**: Code Mode **prefixes each manual's env vars with the manual name**. The `figma` manual therefore needs the key as **`figma_FIGMA_API_KEY`**, not bare `FIGMA_API_KEY`.

**Fix**:

```bash
# In .env (illustrative, do not paste the token into chat output):
figma_FIGMA_API_KEY=figd_your_token_here
```

Set `figma_FIGMA_API_KEY` in `.env`, then restart Code Mode so the manual reloads. Never expose the token in user-facing output.

---

### Issue: Framelink `figma` tools missing in Code Mode

**Symptoms**: `call_tool_chain()` cannot find any `figma.figma_<tool>` to call.

**Diagnosis / Fix** (discover first, never guess names):

1. Confirm the `figma` manual is registered in `.utcp_config.json` (`manual_call_templates`), stdio, `npx -y figma-developer-mcp@latest --stdio`.
2. Ensure `figma_FIGMA_API_KEY` is set in `.env` (see the row above).
3. **Restart Code Mode** so the manual loads.
4. Discover the real surface before invoking:
   ```text
   list_tools()        # filter by the "figma" prefix
   search_tools(...)   # find a tool by intent
   tool_info(...)      # confirm the exact name + params
   ```
5. Call with the prefixed naming `figma.figma_<tool>`. Do not claim a tool works until discovery confirms it.

---

## 10. ERROR / SYMPTOM REFERENCE

| Symptom | Likely cause | Fix |
| --- | --- | --- |
| `figma-ds-cli: command not found` | Not installed, or npm global bin not on PATH | `npm i -g figma-ds-cli`; fix PATH; never `npm i -g figma-cli` |
| `figma` works but figma-ds-cli verbs fail | Installed the unrelated unic/`figma-cli` (bin `figma`) | Uninstall `figma-cli`; install `figma-ds-cli`; verify silships |
| Only `figma-ds-cli` present, no `figma-cli` | npm build ships only `figma-ds-cli`; dual-bin is repo-only | Normal, use `figma-ds-cli` as canonical |
| Errors on old Node | Node <18 | `nvm install 18 && nvm use 18` |
| Figma Desktop not found | Desktop not installed (no cloud fallback) | Install Figma Desktop |
| Connect/doc commands fail | Figma Desktop not running or no file open | Open Figma Desktop with a file, keep it focused |
| `connect --safe` won't bridge | FigCli plugin not imported / not open | Import `plugin/manifest.json` once; keep FigCli open |
| Yolo patch fails | Permissions / Full Disk Access / admin | Grant access or use `--safe`; `unpatch` to revert |
| Yolo broke after Figma update | Update replaced patched `app.asar` | `figma-ds-cli unpatch`, then re-connect (prefer `--safe`) |
| Daemon `Unauthorized` | `X-Daemon-Token` mismatch | `daemon diagnose` then `daemon restart` (never delete token) |
| Daemon unreachable on 3456 | Idle timeout / crash / port owned | `daemon restart`/`reconnect`; identify 3456 owner before reuse |
| CDP port 9222 conflict | Yolo uses fixed 9222; another tool holds it | Identify owner with `lsof`; free it or use `--safe` |
| Code Mode "variable not found" | Missing `figma_` env prefix | Set `figma_FIGMA_API_KEY` in `.env`; restart Code Mode |
| `figma` tools missing in Code Mode | Manual not loaded / not discovered | Confirm config + `.env`, restart, `list_tools()`/`tool_info()` |

---

## 11. COMMON SOLUTIONS CHECKLIST

Before escalating, confirm:

- [ ] `figma-ds-cli` is the binary in use (NOT the unrelated unic `figma-cli`).
- [ ] Node is **>=18** (`node --version`).
- [ ] Figma Desktop is **installed, open, and has a file open**.
- [ ] A connect mode completed: safe plugin (default) imported and FigCli kept open, or yolo consented + patched.
- [ ] `daemon status` is healthy (`diagnose` -> `restart` -> `reconnect` if not).
- [ ] The daemon endpoint (`127.0.0.1:3456`) and token file exist, and the token was never printed.
- [ ] For Code Mode: `figma_FIGMA_API_KEY` is set in `.env`, Code Mode was restarted, and tools were discovered before calling.
- [ ] No port conflict on 3456 or (yolo) 9222, with the owner identified before any kill.
- [ ] Examples were verified against the live `--help` surface, not assumed.

---

## 12. ESCALATION

Stop and escalate to the user (with the effect and a one-line rollback) when a quick fix is not safe to choose unilaterally:

- The binary is **missing or ambiguous**, so ask whether to install `figma-ds-cli` (npm) or the silships repo build, and do not guess.
- A **yolo patch**, an **unpatch**, or any **destructive verb** is needed to recover, so describe the effect and rollback, then wait for confirmation.
- A **port conflict** can only be cleared by stopping an unidentified process, so confirm the owner first.
- The **optional Figma MCP** is requested but no token / `figma` manual is configured, so surface the `.env` requirement, and never paste credentials.
- A failure persists on **Linux/Windows**, where those platforms are experimental and unverified, so flag the limitation rather than improvising an unsupported fix.

When reporting a bug upstream, include: the binary in use and version (`figma-ds-cli --version`), Node version, platform (macOS supported), connect mode (safe/yolo), `daemon diagnose` output (token redacted), and the full error with `2>&1`.

---

## 13. REFERENCES

- [figma_cli_reference.md](figma_cli_reference.md) - binary identity, Node/macOS baseline, Figma Desktop requirement, connect modes, and the daemon model.
- [tool_surface.md](tool_surface.md) - the read-only / mutating / destructive command taxonomy and the gating rules.
- [mcp_wiring.md](mcp_wiring.md) - the optional Figma MCP (Framelink `figma`) via Code Mode: the registered manual, the `.env` token, and discovery.
- [INSTALL_GUIDE.md](../INSTALL_GUIDE.md) - install steps and binary verification.
- [SKILL.md](../SKILL.md) - the skill contract this reference supports.
- Code Mode transport for the optional MCP: [mcp-code-mode SKILL.md](../../mcp-code-mode/SKILL.md). Browser-debugging owner for port 9222 conflicts: [mcp-chrome-devtools SKILL.md](../../mcp-chrome-devtools/SKILL.md).
- Upstream: [silships/figma-cli](https://github.com/silships/figma-cli) (npm `figma-ds-cli`, MIT). [Node.js](https://nodejs.org/) (>=18). This skill does not vendor either.

> **Note**: Most failures are upstream of any Figma operation: wrong package under the colliding `figma-cli` name, Node <18, Figma Desktop not open, an incomplete connect mode, or a missing Code Mode env prefix. Verify the binary, Desktop state, and daemon health before deeper diagnosis, and confirm every illustrative command against the live `--help` surface.
