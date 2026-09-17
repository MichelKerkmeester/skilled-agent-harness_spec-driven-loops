---
title: "MagicPath Tool Surface"
description: "The 14-tool MagicPath CLI contract: arguments, bounds, result shapes, the read funnel, the cursor-pagination rule, and the stale cli.commands warning as fail-closed negative knowledge."
trigger_phrases:
  - "magicpath tools"
  - "magicpath search components inspect"
  - "magicpath list components projects teams themes"
  - "magicpath tool surface"
  - "magicpath cli commands"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# MagicPath Tool Surface

Read-only contract reference for the fourteen MagicPath CLI tools.

## 1. OVERVIEW

### Purpose

The expected contract for the MagicPath CLI's **fourteen read-only tools across six themes** (session, components, projects, teams, themes, local & canvas). Treat this table as the documented baseline and Code Mode discovery (`list_tools` / `search_tools` / `tool_info`) as the final live schema before calling. Documented facts trace to the registered manual emitted by `node .opencode/bin/magicpath-utcp-manual.cjs`; the manual is the source of truth for what an agent can call.

### Usage

Use the tables and constraints as the documented baseline, then confirm every intended callable and schema through live Code Mode discovery.

> The registered surface is **read-only on purpose**. The CLI can also write `.tsx` files, install npm packages, and create remote projects and component revisions (`add`, `code`, `image`, `create-project`, `clone`), but those commands are deliberately **not** registered. There are no registered mutating tools. See [`mutation-boundary.md`](mutation-boundary.md).

---

## 2. THE FOURTEEN TOOLS

Every tool requests JSON output (`-o json`), so results parse as one shape. Optional `limit` and other optional arguments are declared as `string` in the registered schema, not `number`; pass them as strings.

### Session & identity

| Tool | Required args | Optional args / bounds | Returns / notes |
|---|---|---|---|
| `info` | none | none | Authentication state, the signed-in user, their teams and projects, and the CLI version. **Answers without credentials**, so it is the cheapest way to check whether MagicPath is reachable and set up |
| `whoami` | none | none | The currently authenticated MagicPath user. **Fails when no credential is present** |

### Components

| Tool | Required args | Optional args / bounds | Returns / notes |
|---|---|---|---|
| `search_components` | `query: string` (text to match against component names) | `limit: string` (maximum results, default 20); `team: string` (restrict to one team, by name or id) | Search component names across every accessible project, personal and team. Use this first when looking for a component by name |
| `inspect_component` | `generated_name: string` (the component generated name, such as `wispy-river-5234`) | none | Read a component's source, dependencies, and import information without installing anything. **Writes no files and needs no package manifest**, so it is the safe way to read a component, and the only way to read one into a non-React project |
| `list_components` | `project_id: string` (the project id) | `limit: string` (maximum results per page, default 100); `after: string` (fetch components after this id) | List the components inside one project. **Paginates by cursor**: pass the previous page's last id as `after` |

### Projects & sharing

| Tool | Required args | Optional args / bounds | Returns / notes |
|---|---|---|---|
| `list_projects` | none | `team: string` (restrict to one team, by name or id); `limit: string` (maximum results) | List projects across the personal workspace and every team the user belongs to |
| `active_project` | none | none | The projects the user currently has open in the MagicPath web app. **Lighter than a selection lookup** when only the project context is needed |
| `share_link` | `identifier: string` (a component generated name, or a numeric project id) | none | Print a shareable URL for a component or project on stdout **without opening a browser**. Use this when a link has to be presented in conversation |

### Teams & members

| Tool | Required args | Optional args / bounds | Returns / notes |
|---|---|---|---|
| `list_teams` | none | none | The teams the current user belongs to, with their role in each |
| `list_members` | `team: string` (team name or id) | none | The members of one team |

### Themes (design systems)

| Tool | Required args | Optional args / bounds | Returns / notes |
|---|---|---|---|
| `list_themes` | none | `team: string` (restrict to one team, by name or id) | List design systems available to the user, or to one team |
| `get_theme` | `theme: string` (theme id or name) | `team: string` (look the theme up within one team) | Fetch a design system's CSS variables, fonts, and styling prompt. Use this to match generated UI to an existing brand rather than inventing values |

### Local & canvas

| Tool | Required args | Optional args / bounds | Returns / notes |
|---|---|---|---|
| `list_installed` | none | `path: string` (directory to scan; defaults to the conventional component path) | List MagicPath components already present in the current project directory |
| `selection` | none | none | The components and images currently selected on the MagicPath web canvas, plus the projects the user has open. **Returns empty collections when nothing is selected or no canvas is open**, so it is safe to call speculatively |

### Hard constraints

- **Every tool is read-only.** There are no registered mutating tools.
- **`limit` is a `string`, not a number.** The registered schema declares it as `string`; pass string values.
- **`list_components` paginates by cursor**, not by page number. `after` is the previous page's last id; do not pass a `page` argument.
- **`share_link` takes one `identifier`** that is either a component generated name or a numeric project id; the tool disambiguates.
- **`info` is the only tool that answers without a credential.** `whoami` and the rest require one; see [`credential-setup.md`](credential-setup.md).
- The provider surface can grow: **preserve unknown structured fields** rather than decoding into a closed schema.

---

## 3. THE READ FUNNEL

The workflow contract for the registered surface:

1. **Reachability first.** `info` answers without credentials and reports authentication state, the signed-in user, teams, projects, and the CLI version. It is the cheapest check that MagicPath is reachable and set up, and the entry point for any session.
2. **Search before detail (components).** `search_components` by name across personal and team projects, shortlist on the returned metadata, then `inspect_component` for the chosen `generated_name`. `inspect_component` writes no files and needs no package manifest, so it is the safe read path and the only way to read a component into a non-React project.
3. **List before detail (projects, teams, themes).** `list_projects` then `list_components` for one `project_id` (cursor-paginated with `after`); `list_teams` then `list_members` for one team; `list_themes` then `get_theme` for one theme.
4. **Canvas and local state are safe to call speculatively.** `selection` returns empty collections when nothing is selected or no canvas is open; `active_project` is lighter than `selection` when only the project context is needed; `list_installed` scans the current project directory.
5. **Share last.** `share_link` prints a URL for a component or project to surface in conversation; it opens no browser.

Cite evidence by the source id, generated name, or URL the tool returns. Unknown response fields are preserved rather than dropped.

---

## 4. STALE SURFACE WARNING (FAIL-CLOSED NEGATIVE KNOWLEDGE)

`magicpath-ai info -o json` reports a `cli.commands` list that is **stale and under-reports** the real surface. `magicpath-ai --help` is authoritative. The registered manual is the source of truth for what an agent can call.

| Artifact | Status |
|---|---|
| `magicpath-ai info -o json` `cli.commands` | Stale and under-reports; do not infer the tool set from it |
| `magicpath-ai --help` | Authoritative for the CLI's real command surface |
| The registered manual (`magicpath-utcp-manual.cjs` output) | The source of truth for what an agent can call |

If a plan, a prompt, or a generated call relies on `info`'s `cli.commands` as the tool inventory, reject that inference and re-check the registered manual and `--help`.

---

## 5. CALLING CONVENTION

Inside `call_tool_chain`:

- Tools are **synchronous**. Call them directly.
- Do **not** use `await`, do **not** use top-level `await`, and do **not** return a Promise. A returned Promise silently marshals as `{}` with no error.
- **Plain JavaScript only**; TypeScript type annotations fail to parse.
- A failing command does **not** throw. It returns the error text or a JSON error object as an ordinary value, so inspect the returned value rather than rely on `try`/`catch`.

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

The wrapper (`magicpath-utcp-exec.cjs`) emits structured JSON errors so a caller parsing JSON meets one shape whether it succeeded or not:

| Code | Meaning |
|---|---|
| `MISSING_REQUIRED_ARGUMENT` | A required argument was not supplied; the wrapper names the missing arguments |
| `CLI_UNAVAILABLE` | `magicpath-ai` could not be run (not on PATH); install the CLI |
| `NOT_AUTHENTICATED` | No credential is present; run `magicpath-ai login` or set `MAGICPATH_TOKEN` |

---

## 6. OPEN QUESTIONS (UNKNOWN, RUNTIME-ONLY)

These stay UNKNOWN until live evidence exists; none can be resolved by authoring:

1. The exact result-shape fields each tool returns beyond the descriptions above (the registered schema declares `outputs` as an open object; confirm via `tool_info`).
2. Whether `limit` accepts non-string values at the CLI level (the registered schema declares `string`; pass strings).
3. What per-second, burst, concurrency, page-size, and retry behavior the CLI exhibits. None is published.
4. Whether `list_components` cursor pagination has a maximum page size beyond the `limit` default of 100.
5. Whether the Node 24-only Code Mode constraint persists after future Code Mode / isolated-vm releases.

---

## 7. RELATED RESOURCES

- [credential-setup.md](credential-setup.md) - the credential, the `.env` wiring, and the unauthenticated failure shape.
- [mutation-boundary.md](mutation-boundary.md) - the registered read-only surface versus the deliberately unregistered write surface.
- [utcp-magicpath-manual.md](../assets/utcp-magicpath-manual.md) - the verified manual snapshot and the env-var wiring.
- [SKILL.md](../SKILL.md) - the runtime contract this reference supports.
