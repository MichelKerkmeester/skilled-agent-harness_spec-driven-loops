---
title: mcp-magicpath
description: Read-only lookup of MagicPath components, projects, teams, design systems, and the live web canvas through the magicpath-ai Node CLI via Code Mode. No MCP server; the registered surface is read-only on purpose.
trigger_phrases:
  - "magicpath"
  - "magicpath-ai"
  - "magicpath components"
  - "magicpath search components"
  - "magicpath themes"
  - "magicpath design system"
version: 1.1.0.0
---

# mcp-magicpath

> MagicPath is a generated-UI component library behind the `magicpath-ai` Node CLI. This skill makes that library reachable from an agent as read-only facts: components, projects, teams, design systems, and the live web canvas. The registered surface is read-only on purpose, and every invocation runs paired with `sk-design` under the design agent persona: this skill retrieves, `sk-design` decides.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Looking up MagicPath components by name and reading their source without installing them; listing projects, components, teams, members, and design systems; reading a theme's CSS variables and fonts; inspecting the web canvas; producing a shareable URL; verifying the wiring and credential |
| **Invoke with** | "magicpath", "magicpath-ai", "magicpath components", "magicpath search components", "magicpath themes", "magicpath design system", "magicpath canvas", or auto-routing on MagicPath keywords |
| **Works on** | The `magicpath-ai` Node CLI (installed version 2.6.1), reached through Code Mode's UTCP `cli` transport via the `magicpath` manual already registered in this repo's `.utcp_config.json`. Needs the CLI on PATH and a credential (`magicpath-ai login` or `MAGICPATH_TOKEN`). No MCP server |
| **Produces** | Cited read-only facts: component search results, component source/dependencies/imports, project and component listings, team and member listings, theme CSS variables/fonts/styling prompt, the canvas selection, installed components, and shareable URLs |

---

## 2. OVERVIEW

### Why This Skill Exists

MagicPath exposes a generated-UI component library and an account surface (projects, teams, design systems) through the `magicpath-ai` Node CLI. Reaching that surface from a coding agent without a contract is risky in specific, documented ways.

The CLI is not an MCP server. The bridge is a UTCP `cli` transport manual registered as `magicpath`, whose tool calls shell out through a wrapper that strips unfilled argument placeholders before invoking the binary. An agent that guesses the callable form or the argument shape burns a round trip. The CLI can also write `.tsx` files, install npm packages, and create remote projects and component revisions (`add`, `code`, `image`, `create-project`, `clone`), but those commands are deliberately not registered, so an agent cannot reach the destructive half by accident. The surface an agent sees is fourteen read-only tools and nothing else.

Two further traps sit inside the read-only surface. `magicpath-ai info -o json` reports a `cli.commands` list that is stale and under-reports the real surface, so an agent that infers the tool set from `info` will miss tools. And inside `call_tool_chain`, tools are synchronous: an `await`, a top-level `await`, or a returned Promise silently marshals as `{}` with no error, and a failing command does not throw but returns the error as an ordinary value. An agent that wraps calls in `try`/`catch` will miss failures.

This packet wraps the wiring, the fourteen-tool contract, the read funnel, and the hard boundary that this transport supplies read-only facts and never mutates the workspace or the account.

### What It Does

The packet is a TRANSPORT under the `mcp-tooling` hub, with `packetKind: transport` and `mutatesWorkspace: false`. It verifies the existing `magicpath` Code Mode manual, discovers and confirms the live callables, and runs the read-only funnel: reachability first, then search/list, then inspect/get detail, then share last. Every read happens against the external MagicPath service or the local project directory. Nothing in this repo changes. The allowed tool surface is Read, Bash, Grep, Glob, and Code Mode calls only.

### The MagicPath Tool Surface

| Theme | Tools | What the skill operates |
|---|---|---|
| **Session** | `info`, `whoami` | reachability, the signed-in user, teams, projects, CLI version |
| **Components** | `search_components`, `inspect_component`, `list_components` | name search, source/dependencies/imports, project contents |
| **Projects** | `list_projects`, `active_project`, `share_link` | project inventory, open projects, shareable URLs |
| **Teams** | `list_teams`, `list_members` | teams with role, team members |
| **Themes** | `list_themes`, `get_theme` | design-system inventory, CSS variables/fonts/styling prompt |
| **Local & canvas** | `list_installed`, `selection` | components in the project directory, the web-canvas selection |

The full contract lives in [`references/tool-surface.md`](./references/tool-surface.md).

---

## 3. QUICK START

The callable names must be confirmed live with `tool_info` before use. Most tools need a credential; `info` is the exception.

**Step 1: Verify the wiring (read-only).**

Confirm the `magicpath` manual is present in `.utcp_config.json` (read-only grep), that `magicpath-ai` is on PATH, and that a credential is set. `info` answers without credentials and is the cheapest reachability check:

```javascript
call_tool_chain({
  code: `
    var r = magicpath.info({});
    return r;
  `
});
```

**Step 2: Discover and confirm the callables (mandatory).**

```javascript
const info = tool_info({ tool_name: "magicpath.search_components" })
```

Expect a live schema for the `magicpath.<tool>` callable. Fail closed when the fourteen documented tools are missing, renamed, expanded, or otherwise drifted.

**Step 3: Run the read funnel, search before detail.**

```javascript
call_tool_chain({
  code: `
    var found = magicpath.search_components({ query: "button", limit: "5" });
    var list = (found && found.records) ? found.records : [];
    var first = list.length ? list[0] : null;
    var detail = first
      ? magicpath.inspect_component({ generated_name: first.generated_name })
      : null;
    return { count: list.length, first: first, detail: detail };
  `
});
```

Expect the match count and the first record, then the inspected component detail. Inspect every returned value for an `error`/`code` field before using it; a failing command does not throw.

**Step 4: Surface a shareable URL when one is asked for.**

```javascript
call_tool_chain({
  code: `
    var link = magicpath.share_link({ identifier: "wispy-river-5234" });
    return link;
  `
});
```

`share_link` prints a URL for a component generated name or a numeric project id; it opens no browser.

---

## 4. HOW IT WORKS

### The Read Funnel

Every request runs the same read order. `info` first, because it answers without credentials and confirms reachability. Then search or list to establish candidates. Then inspect or get for shortlisted items. Then share last, only when a URL is needed. Cursor pagination on `list_components` uses `after` (the previous page's last id), never a page number. Unknown response fields are preserved rather than dropped.

### The Callable Name

Code Mode names calls `{manual}.{tool}`. The manual is named `magicpath` and the tool names have no `magicpath_` prefix of their own, so the callable form applies the prefix once: `magicpath.search_components(...)`. Discovery lists the dotted registry names `magicpath.<tool>`. The rule stays discovery-first: re-confirm the exact callable with `tool_info` per session and fail closed on drift. Calls run synchronously inside the `call_tool_chain` body, with no `await` and no returned Promise.

### Wiring And Authentication

The `magicpath` manual is already registered in `.utcp_config.json` (`call_template_type: "cli"`; the manual command runs `node .opencode/bin/magicpath-utcp-manual.cjs`; tool execution runs through `node .opencode/bin/magicpath-utcp-exec.cjs`). The packet verifies it read-only and never edits it.

Authentication is operator-only. The credential is `magicpath-ai login` (browser) or the `MAGICPATH_TOKEN` environment variable, wired as `magicpath_MAGICPATH_TOKEN` in `.env` (Code Mode prefixes env vars with the manual name). Without a credential, a call returns structured JSON: `{"error":"Not authenticated. Set MAGICPATH_TOKEN or run \`magicpath-ai login\`.","code":"NOT_AUTHENTICATED","suggestion":"..."}`. `info` is the exception and answers without credentials. The packet never accepts, prints, caches, or repairs credentials.

No per-second, burst, concurrency, page-size, or retry contract is published for the CLI. The packet never invents one.

### The Mutation Boundary

The registered surface is read-only on purpose. The CLI can also write `.tsx` files into the calling project, install npm packages, and create remote projects and component revisions (`add`, `code`, `image`, `create-project`, `clone`), but those commands are deliberately not registered. An agent cannot reach them through a tool call, and this packet will not route to them. Full detail: [`references/mutation-boundary.md`](./references/mutation-boundary.md).

### The Stale Surface Warning

`magicpath-ai info -o json` reports a `cli.commands` list that is stale and under-reports the real surface. `magicpath-ai --help` is authoritative. The registered manual is the source of truth for what an agent can call; do not infer the tool set from `info`'s `cli.commands`.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this packet when you want MagicPath facts: a component by name and its source, a project's contents, a team's members, a design system's tokens, the canvas selection, the installed components, or a shareable URL. Also reach for it when the `magicpath` wiring or its credential needs verification.

Skip it when the work is to generate, install, add, code, image, create a project, or clone a revision; those are unregistered mutating commands and this packet cannot reach them. Skip it only when the design work has no MagicPath surface in it at all; when it does, this skill loads `sk-design` for you rather than handing back unowned facts. Skip it for third-party UI reference search (`mcp-refero`), Figma (`mcp-figma`), Notion (`mcp-notion`), Obsidian (`mcp-obsidian`), browser automation (`mcp-chrome-devtools`), and generic app coding (`sk-code`). Never use it to change files. The allowed tool surface is Read, Bash, Grep, Glob, and Code Mode calls only.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-design` | The unconditional design authority, loaded on every invocation before the first tool call. It owns values, interaction, motion, and the WCAG review pass; this skill supplies the evidence it reasons over. |
| The design agent | The operating persona, resolved from the ACTIVE runtime's agent directory. Its judgment contract and LEAF discipline are adopted; its write capability is not, because this transport forbids Write/Edit/Task. |
| `sk-design-md-generator` | Applies only when the reference is an external live site rather than a MagicPath theme. MagicPath themes already return named CSS variables, so there is nothing to re-measure. |
| `mcp-code-mode` | The substrate. Manuals, `{manual}.{tool}` naming, prefixed env vars, discovery, and the synchronous-call discipline all come from Code Mode. |
| `mcp-refero` | The sibling design-reference transport in this hub. It searches real shipped UI from third-party apps; MagicPath is its own component library, not a reference corpus. No surface overlap. |
| `mcp-figma` | The sibling Figma transport in this hub. |
| `mcp-chrome-devtools` | Browser inspection and preview, never a MagicPath surface. |
| `sk-code` | Owns adapting any resulting decision into application code and verifying it. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| `{"code":"NOT_AUTHENTICATED",...}` | No credential is present | Operator-only: run `magicpath-ai login` or wire `MAGICPATH_TOKEN` as `magicpath_MAGICPATH_TOKEN` in `.env`. The agent surfaces the step and waits |
| `whoami` fails but `info` works | `info` answers without credentials; `whoami` does not | Confirm a credential is set; `whoami` requires it |
| `magicpath.*` tools do not resolve | Manual not loaded at Code Mode startup | Reconnect Code Mode so manuals reload; verify the `magicpath` manual in `.utcp_config.json` (read-only grep) |
| A callable name fails (`magicpath.search_components` not found) | Wrong prefix form | Use `magicpath.<tool>(...)` and confirm with `tool_info` first |
| `await is only valid in async functions...` | Top-level `await` or a returned Promise in the `call_tool_chain` body | Call synchronously inside the body, no `await`, no returned Promise |
| A returned value is `{}` | A Promise was returned and silently marshaled | Return a plain value, not a Promise |
| A failure was missed | The command did not throw; it returned the error as a value | Inspect the returned value for `error`/`code`; do not rely on `try`/`catch` |
| `{"code":"CLI_UNAVAILABLE",...}` | `magicpath-ai` is not on PATH | Operator-side: install the `magicpath-ai` CLI |
| `{"code":"MISSING_REQUIRED_ARGUMENT",...}` | A required argument was not supplied | Supply every argument the tool declares as required |
| Tools seem missing from `info` | `magicpath-ai info -o json` `cli.commands` is stale and under-reports | Use `magicpath-ai --help` and the registered manual as the source of truth |
| `-32000 Connection closed` on every call | Code Mode running on Node 25, which crashes isolated-vm with SIGSEGV | Operator-side: run Code Mode on Node 24 |
| A request to generate/install/clone | Those are unregistered mutating commands | This packet cannot perform them; hand the request to the operator or a workflow that runs the CLI outside a tool call |

---

## 7. FAQ

**Q: Is there a MagicPath MCP server?**

A: No. MagicPath ships no MCP server. The bridge is the `magicpath-ai` Node CLI (installed version 2.6.1), reached through Code Mode's UTCP `cli` transport, registered as the manual named `magicpath` in `.utcp_config.json`.

**Q: Why is the callable prefix `magicpath.<tool>` and not `magicpath.<tool>`?**

A: Code Mode names calls `{manual}.{tool}`. The manual is named `magicpath`, so the callable becomes `magicpath.<tool>`. The tool names have no `magicpath_` prefix of their own, so the prefix is applied once. Confirm the exact form with `tool_info` per session.

**Q: Can this packet generate or install a component?**

A: No. The `add`, `code`, `image`, `create-project`, and `clone` CLI commands are mutating and deliberately not registered. The fourteen registered tools are all read-only. Hand such work to the operator or a workflow that runs the CLI directly outside a tool call.

**Q: Why does `info` work without a credential when other tools do not?**

A: `info` reports authentication state, the signed-in user, teams, projects, and the CLI version, and is documented as answering without credentials, so it is the cheapest reachability and setup check. `whoami` and the rest require a credential.

**Q: Can this packet change my files or the MagicPath config?**

A: No. It is a transport with `mutatesWorkspace: false`. The allowed surface is Read, Bash, Grep, Glob, and Code Mode calls only. The `magicpath` manual in `.utcp_config.json` is validated as-is and never edited.

**Q: Why did a failure not throw?**

A: By design. A failing command returns the error text or a JSON error object as an ordinary value, so a caller parsing JSON meets one shape whether it succeeded or not. Inspect the returned value for `error`/`code`; do not rely on `try`/`catch`.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| Skill package | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/package_skill.py .opencode/skills/mcp-tooling/mcp-magicpath --check` reports zero errors |
| SKILL.md frontmatter | `head -8 .opencode/skills/mcp-tooling/mcp-magicpath/SKILL.md` shows `name`, `description`, `version`, and `user-invocable`, with `version: 1.1.0.0` |
| Wiring presence | Read-only grep of `.utcp_config.json` reports the `magicpath` manual registered |
| CLI reachability | Inside Code Mode: `magicpath.info({})` returns a result without a credential |
| Callable confirmation | Inside Code Mode: `tool_info({ tool_name: "magicpath.search_components" })` returns a schema |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, and references |
| [`references/tool-surface.md`](./references/tool-surface.md) | The 14-tool contract, argument bounds, the read funnel, and the stale-`cli.commands` warning |
| [`references/credential-setup.md`](./references/credential-setup.md) | The credential, the `.env` wiring, and the unauthenticated failure shape |
| [`references/mutation-boundary.md`](./references/mutation-boundary.md) | The registered read-only surface versus the deliberately unregistered write surface |
| [`references/design-authority.md`](./references/design-authority.md) | The unconditional `sk-design` pairing, the persona, and the reconciled write boundary |
| [`assets/utcp-magicpath-manual.md`](./assets/utcp-magicpath-manual.md) | The verified manual snapshot and the env-var wiring, verbatim |
| [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory by theme, with one per-tool leaf per documented tool |
| [`changelog/v1.0.0.0.md`](./changelog/v1.0.0.0.md) | First release entry |
| [`changelog/v1.1.0.0.md`](./changelog/v1.1.0.0.md) | The unconditional design-authority binding |
| [Skills Library](../../README.txt) | The skill catalog and routing front door |
