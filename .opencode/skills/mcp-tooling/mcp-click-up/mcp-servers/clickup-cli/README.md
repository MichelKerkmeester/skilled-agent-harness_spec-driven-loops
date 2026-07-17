---
title: "clickup-cli (cupt)"
description: "Vendored install pointer for cupt, the ClickUp Task Management CLI that mcp-click-up drives for daily task operations."
trigger_phrases:
  - "clickup cli"
  - "cupt install"
  - "cupt cli"
  - "install cupt"
version: 1.0.0.0
---

# clickup-cli (cupt)

> Install and verify the `cupt` CLI that mcp-click-up's daily task operations run on.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Installing and verifying `cupt`, the primary CLI mcp-click-up drives for daily ClickUp task operations. |
| **Invoke with** | `bash setup.sh`, then `cupt --version` and `cupt status`. |
| **Works on** | Python 3.8+ with `pipx` (preferred) or `pip`. |
| **Produces** | A working `cupt` binary on `PATH`, authenticated against a ClickUp workspace. |

---

## 2. OVERVIEW

### Why This Package Exists

mcp-click-up drives daily ClickUp task operations (listing, completing, time tracking, notes, attachments) through `cupt`, a real third-party CLI, rather than reimplementing that surface. This folder is not vendored source. It is the install pointer and pinned version constraint that the parent skill's `SKILL.md` and `scripts/install.sh` read from.

### What It Does

`cupt` (ClickUp Task Management CLI) is an actively maintained third-party project. `setup.sh` installs it in an isolated environment via `pipx`, falling back to `pip install --user` when `pipx` is unavailable, and no-ops if a `cupt` binary is already on `PATH`. `requirements.txt` pins the minimum supported version for `pip install -r requirements.txt` use.

---

## 3. QUICK START

**Step 1: Install.**

```bash
bash setup.sh
```

Installs `cupt` via `pipx` when available, otherwise `pip install --user cupt`. Prints `cupt already installed` and exits cleanly if a `cupt` binary is already on `PATH`.

**Step 2: Authenticate.**

```bash
cupt auth
# or non-interactively:
cupt config --api-token pk_YOUR_TOKEN_HERE
```

Get a Personal API Token at https://app.clickup.com/settings/apps. Credentials are stored as plaintext YAML at `~/.cupt/config.yaml`, protected by owner-only file permissions (mode `0600`). This is not encryption.

**Step 3: Verify.**

```bash
cupt --version
cupt status
```

Expected: `cupt, version <installed version>`, then two lines — `OK: Authenticated as: <user>` and `OK: Workspace: <name>`.

---

## 4. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `cupt: command not found` after install | The `pip install --user` script directory is not on `PATH` | Re-run via `pipx install cupt`, or add the `pip --user` scripts directory to `PATH` |
| `cupt status` reports an auth failure | No token configured, or the stored token was revoked | Run `cupt auth` again, or `cupt config --api-token pk_xxx` with a fresh token |

---

## 5. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`../../SKILL.md`](../../SKILL.md) | Runtime routing between `cupt` and the official ClickUp MCP |
| [`../../references/cupt_commands.md`](../../references/cupt_commands.md) | Full `cupt` command reference with agent patterns |
| [`../../references/INSTALL-GUIDE.md`](../../references/INSTALL-GUIDE.md) | Step-by-step install with validation checkpoints |
