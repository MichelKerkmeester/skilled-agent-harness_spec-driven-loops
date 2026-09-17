---
title: "MagicPath Mutation Boundary"
description: "The registered read-only surface versus the deliberately unregistered MagicPath CLI write surface: what an agent can and cannot reach through a tool call, and why the write half is out of scope by registration."
trigger_phrases:
  - "magicpath mutation boundary"
  - "magicpath read only"
  - "magicpath write surface"
  - "magicpath unregistered commands"
  - "magicpath add code image clone"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# MagicPath Mutation Boundary

> **Read-only by registration, not by accident.** The MagicPath CLI can write to the calling project and to the remote account, but the registered manual exposes only read-only commands. An agent cannot reach the write half through a tool call, and this packet will not route to it.

---

## 1. OVERVIEW

### Purpose

State precisely what the `magicpath` transport may and may not do, so an agent never improvises a mutating call and never documents an unregistered capability as reachable. The boundary is enforced by **registration**, not by a runtime check: the unregistered commands exist in the CLI but are absent from the manual, so the transport cannot invoke them.

### Usage

Treat this as the authoritative read/write boundary. When a request needs the write surface, escalate it to the operator or to a workflow that runs the CLI directly outside a tool call.

---

## 2. THE REGISTERED SURFACE (READ-ONLY)

The fourteen registered tools are all read-only. None writes a file, installs a package, or creates or modifies a remote resource.

| Theme | Tools | What they read |
|---|---|---|
| Session | `info`, `whoami` | authentication state, the signed-in user, teams, projects, CLI version |
| Components | `search_components`, `inspect_component`, `list_components` | component names, source/dependencies/imports, project contents |
| Projects | `list_projects`, `active_project`, `share_link` | project inventory, open projects, a shareable URL (printed, not opened) |
| Teams | `list_teams`, `list_members` | teams with role, team members |
| Themes | `list_themes`, `get_theme` | design-system inventory, CSS variables/fonts/styling prompt |
| Local & canvas | `list_installed`, `selection` | components in the project directory, the web-canvas selection |

`inspect_component` is the read path most worth flagging: it reads a component's source, dependencies, and imports **without installing anything and without a package manifest**, so it is the safe way to read a component and the only way to read one into a non-React project. It writes no files.

`share_link` prints a URL to stdout and opens no browser; it does not modify the resource it links to.

---

## 3. THE UNREGISTERED WRITE SURFACE (DELIBERATELY OUT OF REACH)

The `magicpath-ai` CLI can also perform mutating actions. These commands are **not registered** in the manual, so the transport cannot invoke them. **[CONFIRMED: the established phase-002 facts]**

| Unregistered CLI command | What it does | Why it is unregistered |
|---|---|---|
| `add` | Writes `.tsx` files into the calling project | Mutates the workspace |
| `code` | Generates/writes component code | Mutates the workspace |
| `image` | Writes image assets | Mutates the workspace |
| `create-project` | Creates a remote project | Mutates the remote account |
| `clone` | Creates a component revision | Mutates the remote account |
| (npm package install) | Installs npm packages as a side effect of some mutating commands | Mutates the workspace |

The registration is the boundary. An agent picking a tool should not be able to reach the destructive half by accident, so the write commands stay unreachable from a tool call until someone decides otherwise.

---

## 4. WHAT THIS PACKET WILL NOT DO

- It will **not** invoke, document as reachable, or route to `add`, `code`, `image`, `create-project`, `clone`, or any command that writes files, installs packages, or creates remote resources.
- It will **not** use Write, Edit, or Task. The transport is `mutatesWorkspace: false`; the allowed surface is Read, Bash, Grep, Glob, and Code Mode calls only.
- It will **not** edit `.utcp_config.json`'s `magicpath` manual to add a write command.
- It will **not** run `magicpath-ai` directly for a mutating command; the transport wrapper is the only thing that shells out, and it only runs the registered read-only commands.
- It will **not** treat a theme's styling prompt or a component's source as a taste verdict; this transport supplies read-only facts and issues no design judgment.

---

## 5. ESCALATION FOR WRITE REQUESTS

When a request needs the write surface (generate, install, add, code, image, create a project, or clone a revision):

1. **State the boundary.** Name the unregistered command and that the transport cannot reach it.
2. **Do not improvise.** Do not attempt to call it, do not edit the manual to add it, and do not run the CLI directly for it.
3. **Hand off.** Surface the request to the operator or to a workflow that runs the CLI directly outside a tool call, where the mutation is explicit and reviewed.

---

## 6. RELATED RESOURCES

- [tool-surface.md](tool-surface.md) - the 14-tool read-only contract and the read funnel.
- [credential-setup.md](credential-setup.md) - the credential, the `.env` wiring, and the unauthenticated failure shape.
- [utcp-magicpath-manual.md](../assets/utcp-magicpath-manual.md) - the verified manual snapshot, which lists only the read-only tools.
- [SKILL.md](../SKILL.md) - the runtime contract, including the escalation rules this boundary feeds.
