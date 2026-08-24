---
title: "Claudian Plugin In-Vault Troubleshooting"
description: "Cause, detection and recovery for Claudian plugin problems: CLI not found, desktop-only, provider auth, the three-name confusion, and the in-app store discoverability issue."
trigger_phrases:
  - "claudian cli not found"
  - "claudian desktop only"
  - "claudian provider auth"
  - "claudian vs claudianIA"
  - "claudian search missing"
  - "claudian plugin not showing"
importance_tier: "normal"
contextType: "general"
version: "0.1.0.0"
---

# Claudian Plugin In-Vault Troubleshooting

Diagnose the provider CLI, the Claudian settings, and the authored artifacts (commands, skills, MCP config) separately. A config file that parses can still point at a CLI that is not installed, or sit in the wrong scope.

---

## 1. OVERVIEW

| Symptom | Most likely cause |
| --- | --- |
| Provider does nothing / "CLI not found" | The provider's CLI is not installed, not on `PATH`, or the path in settings is wrong |
| Plugin absent on mobile | Claudian is desktop-only (`isDesktopOnly: true`); there is no mobile build |
| Agent starts but is unauthorized | The provider CLI itself is not logged in / has no valid account or API key |
| A `/command` or `/skill` doesn't appear | Authored in the wrong scope or provider directory, or a name collision across scopes |
| MCP tool not available to the agent | Declared in a Claudian-invented file instead of the provider's native MCP config, or the agent was not restarted |
| Wrong "Claudian" installed | Confused `realclaudian` with ClaudianIA (id `claudian`) or Claudian Plus — see §6 |
| Not findable in the community store search | The listing was removed from the in-app browse index — see §7 |
| Change had no effect | The provider agent was not restarted after the config edit |

---

## 2. DIAGNOSIS SEQUENCE

1. Confirm the installed plugin is `realclaudian` (folder `.obsidian/plugins/realclaudian/`, display name Claudian), not another "claudian" (§6).
2. Confirm the active provider's CLI is installed and on `PATH` (`which <cli>` / `where.exe <cli>`).
3. Confirm the provider CLI is authenticated on its own — Claudian relays the CLI, it does not hold the credentials.
4. For a missing command/skill, confirm the file is in the right provider directory and the right scope, and that no same-named artifact shadows it.
5. For a missing MCP tool, confirm the entry is in the provider's native MCP config, not a Claudian-specific file.
6. Check the render/run step last: the operator must restart the agent (or reopen the pane) after any config change.

---

## 3. CLI NOT FOUND / PROVIDER WON'T RUN

| Cause | Check | Fix |
| --- | --- | --- |
| Provider CLI not installed | Run `which <cli>` / `where.exe <cli>` | Install the provider's CLI first; Claudian shells out to it and cannot run without it |
| CLI not on Obsidian's `PATH` | Compare the shell `PATH` with what Obsidian sees | Set the absolute path under **Settings → Advanced → (provider) CLI path** |
| Windows wrapper picked up | Check whether the path ends in `.cmd`/`.ps1` | Point at the real executable, not the `.cmd`/`.ps1` wrapper |
| Missing environment variables | Confirm the CLI's required env vars | Add them under **Settings → Environment** |

---

## 4. DESKTOP-ONLY / PLATFORM

| Cause | Check | Fix |
| --- | --- | --- |
| Trying to use Claudian on mobile | The manifest declares `isDesktopOnly: true` | There is no mobile build — use a desktop vault. Never document a mobile workflow |
| Obsidian below the minimum version | Compare the installed Obsidian version with `minAppVersion 1.13.0` | Update Obsidian to 1.13.0+; older versions will not load the plugin |

---

## 5. PROVIDER AUTH

| Cause | Check | Fix |
| --- | --- | --- |
| Provider CLI not logged in | Run the CLI in a terminal and confirm it is authenticated | Authenticate the CLI itself (its own login/API-key flow); Claudian relays the CLI's session, it does not manage the credential |
| Wrong account / expired subscription | Confirm the account tied to the CLI is valid | Fix the account at the provider, not in Claudian |
| Collab Mode needs Git | Confirm `git` is installed for Collab Mode | Install Git; Collab Mode is Git-backed |

Claudian holds no API key of its own — it is local CLI execution. If the agent is unauthorized, the fix is on the provider CLI, never in a Claudian "API key" field.

---

## 6. DON'T CONFUSE THESE THREE

Three different plugins share the "Claudian" name. Only the first is documented here.

| Plugin | Author | Manifest `id` | What it is |
| --- | --- | --- | --- |
| **Claudian** | YishenTu | **`realclaudian`** | This plugin: embeds coding-agent CLIs (Claude Code, Codex, Grok, OpenCode, Pi) with the vault as the working directory. Registered as `realclaudian` because the id `claudian` was already taken |
| **ClaudianIA** | Enigmora | `claudian` | A different plugin: a Claude-API cloud-chat sidebar. **Not** documented here — do not treat a `.obsidian/plugins/claudian/` folder as this reference set's subject |
| **Claudian Plus** | (separate) | (separate) | Another distinct plugin — not this one |

Before acting on any "claudian" folder or listing, confirm the manifest `id` is `realclaudian` and the author is YishenTu. A `.obsidian/plugins/claudian/` folder is ClaudianIA, not this plugin.

---

## 7. IN-APP STORE DISCOVERABILITY

| Cause | Check | Fix |
| --- | --- | --- |
| Claudian not findable in the in-app community-store search | Search **Settings → Community plugins → Browse** | The listing was reported removed from the in-app browse index (GitHub `YishenTu/claudian#912`). Install via BRAT (see `../obsidian42-brat/`) or a manual download of the release instead |

The discoverability issue (`YishenTu/claudian#912`) is **closed but its resolution is unconfirmed** — the report notes the plugin dropped out of the community browse index while its plugin page still existed. Treat in-app search as unreliable for finding Claudian: prefer the BRAT or manual install path, and do not tell the operator to "just search the store" as if it is guaranteed to surface.

---

## 8. RECOVERY

| Problem | Fix |
| --- | --- |
| CLI not found | Install the provider CLI, then set its absolute path in Claudian settings |
| Unauthorized agent | Authenticate the provider CLI itself; there is no Claudian-side credential |
| Command/skill invisible | Move it to the correct provider directory and scope; resolve any name collision |
| MCP tool missing | Move the entry into the provider's native MCP config and restart the agent |
| Wrong plugin installed | Confirm the folder is `realclaudian`, author YishenTu; remove the wrong "claudian" if it was installed by mistake |
| Not in store search | Install via BRAT or manual download; do not rely on in-app search |
| Config edit had no effect | Restart the agent / reopen the pane so the CLI reloads |

---

## 9. VALIDATION CHECKPOINTS

| Checkpoint | What it proves |
| --- | --- |
| `plugin_identity_confirmed` | The installed plugin is `realclaudian` by YishenTu, not ClaudianIA or Claudian Plus |
| `provider_cli_reachable` | The active provider's CLI resolves on `PATH` (or the set path exists) |
| `provider_authenticated` | The provider CLI is logged in on its own; no Claudian-side key is assumed |
| `artifact_scope_correct` | A command/skill lives in the right provider directory and scope with no unresolved collision |
| `mcp_declared_provider_native` | The MCP entry is in the provider's own MCP config, and a restart was advised |
| `install_path_reliable` | Install guidance uses BRAT/manual, not an in-app search assumed to work |

---

## 10. LIMITS

- The `mcp-obsidian` mode configures Claudian and authors the files it reads. It never runs the agent, approves a diff, or renders a plan — those are the operator's in-app steps.
- The on-disk paths are observed in the compiled plugin and follow each provider CLI's native layout; the exact file schema is `VERIFY` against a live install (`data-model.md` §1/§7).
- Claudian is desktop-only and requires an already-installed, already-authenticated provider CLI. It holds no credential of its own.
- Each provider uses its own native config — never assume Claude Code's `.claude/` shape for Codex, OpenCode, Grok or Pi.
- In-app store discoverability is unreliable (`#912`, closed but unconfirmed) — prefer BRAT or manual install.
