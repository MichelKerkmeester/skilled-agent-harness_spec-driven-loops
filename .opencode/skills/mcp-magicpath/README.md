---
title: mcp-magicpath
description: MagicPath UI-component surface that drives the magicpath-ai CLI to find, preview, inspect, install and author design components, in both the install-into-app and author-on-canvas directions.
trigger_phrases:
  - "magicpath"
  - "magic path"
  - "ui component"
  - "design to code"
  - "canvas component"
---

# mcp-magicpath

> Find, preview, inspect, install and author MagicPath UI components from your agent or terminal, in both directions: pull a design into your app, or push code back onto the canvas.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Discovering MagicPath components ("designs"), inspecting their source, installing them into a React/TypeScript app, and authoring or editing canvas components from local code |
| **Invoke with** | "magicpath", "magic path", "ui component", "design to code", "canvas component" or auto-routing on MagicPath keywords |
| **Works on** | Any project for read-only `inspect`/translate; React + TypeScript for `add` (installs to `src/components/magicpath/`). Needs Node.js (for `npx`), MagicPath auth, and a browser for login/preview |
| **Produces** | Installed React component source you import directly, translated UI for non-JS targets, or new/edited MagicPath canvas components submitted back to the platform |

---

## 2. OVERVIEW

### Why This Skill Exists

MagicPath is an external platform for building, sharing and installing UI components with AI. Reaching it from an agent is awkward without a contract: an agent needs to know how to authenticate, how to find the right component across personal and team workspaces, when to read source versus install it, and how to push generated code back onto a canvas without corrupting the build setup. Guessing at any of those wastes a round-trip or, worse, writes the wrong files into the user's app. This skill wraps the official `magicpath-ai` CLI behind a single set of instructions so the agent always knows the first command to run, the safe read-only path, and the strict file boundary for canvas authoring.

### What It Does

The skill drives one tool, the `magicpath-ai` CLI, invoked through `npx -y magicpath-ai` so there is no separate global install — `npx` fetches the package on first use. It covers two opposite workflow directions. The **install direction** finds a component with `search`, reads its source read-only with `inspect`, and either installs it into a React/TypeScript app with `add` or, for non-JS targets, translates the inspected source by hand. The **author direction** uses the `code` subcommands to scaffold, edit and submit MagicPath canvas components from local files, inside a strict editable-file boundary. Teams, themes (design systems) and the live canvas selection are first-class: the skill resolves "my designs", "our team's components" and "the X theme" to the right CLI flags.

This is a pure-CLI surface. Despite the `mcp-` family prefix, MagicPath has **no MCP server component** — every operation goes through `magicpath-ai`. The prefix places it in the framework's "External Tool Surfaces" family alongside the other external-service skills.

---

## 3. QUICK START

**Step 1: Install the CLI.**

```bash
bash .opencode/skills/mcp-magicpath/scripts/install.sh
# Expected: [mcp-magicpath] ✓ magicpath-ai X.Y.Z installed successfully
# Makes the `magicpath-ai` command globally available (npm install -g).
# The docs below also work via `npx -y magicpath-ai ...` with no global install.
```

**Step 2: Check auth and project context.**

```bash
magicpath-ai info -o json
# Expected: JSON with auth.authenticated, user, teams[], projects[], version
```

If `auth.authenticated` is false, log in and verify:

```bash
magicpath-ai login          # opens the browser, auto-completes on authorize
magicpath-ai whoami -o json # Expected: your user object
```

**Step 3: Find and inspect a component (read-only).**

```bash
magicpath-ai search "card" -o json        # match component names across workspaces
magicpath-ai inspect <generatedName> -o json
# Expected: { component, files: [{ path, content }], dependencies, importStatement }
# inspect writes nothing — safe in any project type
```

**Step 4: Install into a React/TypeScript app, then import it.**

```bash
magicpath-ai add <generatedName> --dry-run   # preview the file list first
magicpath-ai add <generatedName> -y          # installs to src/components/magicpath/
# Then import the installed component — never copy its markup elsewhere
```

For non-JS projects (Swift, Python, etc.), stop at `inspect` and translate the source into the target language by hand. Do not use `add`.

---

## 4. HOW IT WORKS

### First Step Always

Every session starts with `npx -y magicpath-ai info -o json`. It returns auth status plus the user's teams and projects in one round-trip, so the agent knows whether to log in and which workspace context applies before doing anything else. When the user references a component or canvas, `selection` returns the currently selected components, images and open projects; `active-project` is the lighter call when only the open project is needed.

### The Install Direction (inspect / add)

`search` matches component names (case-insensitive substring) across personal and team workspaces and returns a `previewImageUrl` for visual context. `inspect` is the read-only workhorse: it prints the component's source files, dependencies and import statement without writing anything or requiring a `package.json`, so it works in any project type. `add` is the only writing command on this path — it installs source into `src/components/magicpath/` (override with `--path`) and is React/TypeScript-only. The rule is firm: never use `add` merely to read source (`inspect` does that), and after `add` always import the installed component rather than copying its markup.

### The Author Direction (code subcommands)

The `code` subcommands let an agent author or edit a MagicPath canvas component from local files. `code start` is the stateful entrypoint for both create (`--project`) and edit (`--component`): it creates a pending revision, enables canvas presence, scaffolds or writes the editable files, and persists state in `<dir>/magicpath-code.json`. `code submit` uploads changed files (and infers deletions) and, with `--wait`, blocks on the build so the agent can fix failures in the same turn. `code context` is the read-only inspector — it writes source for viewing but creates no revision and no manifest.

The editable-file boundary is strict. The API accepts full-file replacements only for `src/App.tsx`, `src/index.css`, files under `src/components/generated/**`, and temporary image assets under `assets/**`. It rejects dependency installs, `package.json` edits, `src/main.tsx`, Vite config and lockfile changes. Tailwind v4 rules apply: keep `@import 'tailwindcss';`, never use the old `@tailwind base/components/utilities;` directives, and append to `src/index.css` rather than replacing it.

### Teams, Themes and Images

Users belong to teams (workspaces) that own shared projects and themes. By default `search` and `list-projects` span all workspaces; `--team <nameOrId>` and `--personal` narrow the scope, and `list-teams` / `list-members` resolve names to IDs. "Themes" are MagicPath design systems — `list-themes` and `get-theme` return CSS variable maps (light/dark), fonts and a natural-language styling prompt to apply to components. The `image` subcommands list and add standalone images on a project canvas, distinct from the `assets/` build inputs in the `code` flow.

### Embedded Browser

When the host has an embedded browser, keep the MagicPath project canvas open as a persistent visual surface using `share`/`view` URLs. If you create a project for canvas authoring, open it in the embedded browser immediately after creation and before `code start`. See [`references/working_with_embedded_browsers.md`](./references/working_with_embedded_browsers.md).

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for this skill whenever a user mentions MagicPath, "designs", their components, themes, or asks to turn a design into code or push code onto a canvas. Use the **install direction** when the goal is to get an existing MagicPath component into an application — `inspect` to read, `add` to install in React/TS, or `inspect`-and-translate everywhere else. Use the **author direction** when the goal is to create or edit a MagicPath canvas component from local code with `code start` / `code submit`.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-code` | Owns application-code standards, surface detection and verification. After `add` installs component source, sk-code governs how it is wired, adapted and tested in the host app. |
| `mcp-chrome-devtools` | Sibling browser surface. When the host lacks an embedded browser, chrome-devtools can drive a real browser for the login and preview flows MagicPath relies on. |
| `mcp-click-up` / `mcp-code-mode` | Family siblings under "External Tool Surfaces". Unlike those, this skill has no MCP transport — it is CLI-only. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| First `npx` call hangs for several seconds | `npx` is downloading the `magicpath-ai` package on first use | Wait — subsequent calls are fast. Pass `-y` so it never blocks on an install prompt |
| `auth.authenticated` is false | Not logged in | Run `npx -y magicpath-ai login`, finish browser auth, then verify with `npx -y magicpath-ai whoami -o json` |
| Login can't open a browser (headless) | No browser on the host | Use `npx -y magicpath-ai login --code <code>` to exchange a browser authorization code directly |
| `add` failed or wrote nothing | Target is not a React/TypeScript project, or files exist | Use `inspect` + manual translation for non-JS; add `--overwrite` to replace, or `--dry-run` to preview first |
| Canvas component build failed after `code submit` | An edit broke the strict file boundary or Tailwind v4 rules | Submit with `--wait`, read the build diagnostics, and confirm only `src/App.tsx`, `src/index.css`, `src/components/generated/**` and `assets/**` changed |
| Images render broken in a canvas component | Inlined base64 or referenced an expiring `accessUrl` | Place files under `assets/` and reference them by relative path (e.g. `../../../assets/hero.png`); use the local `assetPath`, never the `accessUrl` |

---

## 7. FAQ

**Q: Do I need to install anything first?**

A: No. The CLI runs through `npx -y magicpath-ai`, which fetches the package on first use. You only need Node.js available and a MagicPath account to authenticate against.

**Q: When do I use `inspect` versus `add`?**

A: `inspect` is read-only and works in any project — use it to read source, or to read source you will translate into a non-JS language. `add` writes the component's source into `src/components/magicpath/` and is React/TypeScript-only. Never use `add` just to read; never `add` and then hand-copy the markup somewhere else — import the installed component.

**Q: A user said "my designs" / "the Acme theme" / "our team's components" — what do those mean?**

A: "Designs" are MagicPath components — search, inspect and install them normally. A "theme" is a design system: use `list-themes` and `get-theme` to pull its CSS variables, fonts and styling prompt. "Our team's" scopes to a workspace — add `--team <nameOrId>`, and use `list-teams` / `list-members` to resolve names to IDs.

**Q: What can the `code` flow actually edit?**

A: Only full-file replacements of `src/App.tsx`, `src/index.css`, `src/components/generated/**`, and temporary image assets under `assets/**`. Dependency installs, `package.json`, `src/main.tsx`, Vite config and lockfiles are rejected. Keep Tailwind v4's `@import 'tailwindcss';` and append to `src/index.css` rather than replacing it.

**Q: Why is it named `mcp-magicpath` if there is no MCP server?**

A: The `mcp-` prefix is this framework's family bucket for external tool surfaces, not a claim that MagicPath ships an MCP server. MagicPath is reached purely through the `magicpath-ai` CLI. The prefix keeps the skill catalog's family convention consistent; the transport is CLI-only.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/mcp-magicpath/README.md --type readme` reports zero issues |
| SKILL.md frontmatter | `head -12 .opencode/skills/mcp-magicpath/SKILL.md` shows `name: mcp-magicpath`, a `description`, and `user-invocable: true` |
| CLI install | `bash .opencode/skills/mcp-magicpath/scripts/install.sh --check-only` reports `magicpath-ai X.Y.Z already installed` once Step 1 has run |
| Advisor discovery | `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"install a magicpath component"}' --warm-only --format json` lists `mcp-magicpath` |
| CLI reachability | `magicpath-ai info -o json` (or `npx -y magicpath-ai info -o json`) returns a JSON object with `version` and `auth` (network + Node.js required) |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions: WHEN TO USE, SMART ROUTING, HOW IT WORKS, RULES, and references (house template) |
| [`INSTALL_GUIDE.md`](./INSTALL_GUIDE.md) | Phased install, authentication, and verification for the `magicpath-ai` CLI (global / in-skill vendor / npx) |
| [`references/magicpath_operations.md`](./references/magicpath_operations.md) | Full operational playbook: discover/understand/install/integrate phases, theme application, canvas authoring, Design Defaults, and the command quick reference |
| [`references/cli_reference.md`](./references/cli_reference.md) | Complete `magicpath-ai` command reference with flags, JSON shapes and the `code` subcommands |
| [`references/working_with_repositories.md`](./references/working_with_repositories.md) | Importing or recreating UI from a local path or a GitHub/GitLab/Bitbucket repo into MagicPath |
| [`references/working_with_embedded_browsers.md`](./references/working_with_embedded_browsers.md) | Using a MagicPath project as a persistent visual canvas in hosts with an embedded browser |
| [`scripts/install.sh`](./scripts/install.sh) | Installs the `magicpath-ai` CLI globally; `--check-only` reports status, `--force` reinstalls |
| [`mcp-servers/magicpath-cli/`](./mcp-servers/magicpath-cli/README.md) | Vendors the `magicpath-ai` CLI into the skill (`package.json` + `setup.sh`); local `npm install` alternative to the global installer |
| [Skills Library](../README.md) | The skill catalog and routing front door |
