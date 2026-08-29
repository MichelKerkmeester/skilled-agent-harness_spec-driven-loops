---
name: mcp-magicpath
description: "MagicPath CLI transport: read-only component, project, team, design-system and canvas lookup through the magicpath-ai Node CLI via Code Mode's UTCP cli transport; no MCP server, no registered write surface."
compatibility: Requires the magicpath-ai Node CLI (installed version 2.6.1) on PATH and a credential (magicpath-ai login or MAGICPATH_TOKEN); this project's Code Mode currently runs on Node 24.
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.0.0.0
user-invocable: true
---

<!-- Keywords: magicpath, magicpath-ai, magicpath components, magicpath search components, magicpath inspect component, magicpath themes, magicpath design system, magicpath cli transport, magicpath canvas, magicpath share link -->

# MagicPath (mcp-magicpath)

Look up **MagicPath** components, projects, teams, design systems, and the live web canvas through the **`magicpath-ai` Node CLI** from an agent, via Code Mode's UTCP `cli` transport. MagicPath ships **no MCP server**; the bridge is the CLI, registered as the manual named `magicpath` in this repo's `.utcp_config.json`. The registered surface is **read-only on purpose**: fourteen tools that only read. The CLI can also write `.tsx` files into the calling project, install npm packages, and create remote projects and component revisions (`add`, `code`, `image`, `create-project`, `clone`), but those are deliberately **not registered**, so an agent cannot reach them through a tool call. Deep operational detail lives in [`references/tool-surface.md`](references/tool-surface.md), [`references/credential-setup.md`](references/credential-setup.md), and [`references/mutation-boundary.md`](references/mutation-boundary.md).

> **Transport shape (read first).** This is a `cli` transport manual, not an `mcp` one. The manual command (`node .opencode/bin/magicpath-utcp-manual.cjs`) emits the UTCP manual that lists the fourteen tools; each tool then runs through `node .opencode/bin/magicpath-utcp-exec.cjs`, which shells out to the `magicpath-ai` binary. Code Mode's naming convention is `{manual}.{tool}`, so the callable form is `magicpath.<tool>(...)` (for example `magicpath.search_components`), and discovery names appear dotted as `magicpath.<tool>`. The tool names have no `magicpath_` prefix of their own, so the prefix is applied once, not doubled. Confirm the exact callable with `tool_info` per session and fail closed on drift.

> **Calling convention (hard).** Inside `call_tool_chain`, tools are **synchronous**. Call them directly. Do **not** use `await`, do **not** use top-level `await`, and do **not** return a Promise — a returned Promise silently marshals as `{}` with no error. Plain JavaScript only; TypeScript type annotations fail to parse. A failing command does **not** throw. It returns the error text or a JSON error object as an ordinary value, so callers must inspect the returned value rather than rely on `try`/`catch`.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user wants to:
- Look up a MagicPath component by name across personal and team projects, or read a component's source, dependencies, and imports without installing it.
- List the projects, components, teams, or members reachable to the signed-in MagicPath user.
- Read a MagicPath design system (theme): its CSS variables, fonts, and styling prompt, to match generated UI to an existing brand rather than inventing values.
- Inspect the live MagicPath web canvas: the components and images currently selected, and the projects the user has open.
- List MagicPath components already installed in the current project directory.
- Produce a shareable URL for a MagicPath component or project to surface in conversation.
- Verify the `magicpath` manual wiring, the credential, and the CLI reachability.

**Keyword Triggers**: "magicpath", "magicpath-ai", "magicpath components", "magicpath search components", "magicpath inspect component", "magicpath themes", "magicpath design system", "magicpath canvas", "magicpath share link".

### Use Cases

**Component lookup (read-only).** Search component names across every accessible project, then inspect a shortlisted component's source, dependencies, and imports without installing anything. `inspect_component` writes no files and needs no package manifest, so it is the safe way to read a component and the only way to read one into a non-React project.

**Project and team inventory (read-only).** List projects across the personal workspace and every team, list the components inside one project (cursor-paginated), list the teams the user belongs to, and list the members of one team.

**Design system lookup (read-only).** List the design systems (themes) available to the user or one team, then fetch a theme's CSS variables, fonts, and styling prompt.

**Canvas and local state (read-only).** Read the components and images currently selected on the MagicPath web canvas, the projects open in the web app, and the MagicPath components already present in the current project directory.

**Sharing (read-only).** Print a shareable URL for a component or project on stdout without opening a browser.

**Wiring and credential verification.** Confirm the `magicpath` manual is registered, the CLI is reachable, and the credential is what the operator expects. Never repair auth state yourself.

### When NOT to Use

**Skip this skill when:**
- The work is to *generate*, *install*, *add*, *code*, *image*, *create-project*, or *clone* through MagicPath. Those CLI commands are deliberately unregistered; this packet exposes no tool that performs them. Hand the request to the operator or to a workflow that runs the CLI directly outside a tool call.
- The task is design judgment itself (palette, type, layout, taste, accessibility, or readiness verdicts). This packet is a read-only transport and issues no such verdict.
- The task is design-reference search over real shipped UI from other apps. That is `mcp-refero`, a sibling transport in this hub; MagicPath is its own component library, not a reference corpus of third-party apps.
- The task is Figma work (`mcp-figma`), Notion (`mcp-notion`), Obsidian (`mcp-obsidian`), or browser automation and preview (`mcp-chrome-devtools`).
- The work is generic app coding with no MagicPath input: use `sk-code`.
- The user asks to change this repo's files, the `.utcp_config.json` manual, or auth state. This transport forbids Write/Edit/Task and never mutates the workspace.

---

## 2. SMART ROUTING

### Primary Detection Signal

Route on **MagicPath-specific signals only**. Generic "component", "design system", or "theme" phrasing is not a MagicPath signal; component-library work in Figma belongs to `mcp-figma`, and third-party UI reference search belongs to `mcp-refero`.

```bash
# Signal detection (pseudo)
echo "$REQUEST" | grep -qiE 'magicpath' && ROUTE="MCP_MAGICPATH"
echo "$REQUEST" | grep -qiE 'magicpath-ai|magicpath (component|project|team|theme|design system|canvas|share)' && ROUTE="MCP_MAGICPATH"
# generic component/design/theme phrasing WITHOUT these signals -> not this packet
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: Verify wiring (magicpath manual registered; Code Mode reachable; credential operator-confirmed)
    +- STEP 1: Score intent -> SESSION | COMPONENTS | PROJECTS | TEAMS | THEMES | LOCAL_CANVAS | SHARING | WIRING_AUTH | TROUBLESHOOT
    +- Phase 2: Discovery (list_tools / tool_info confirms the magicpath.<tool> callables)   [MANDATORY]
    +- Phase 3: Read funnel (search/list -> inspect/get detail -> share last); inspect returned values, never try/catch
    +- Phase 4: Verify (evidence cited by source; unknown fields preserved; no invented capability)
```

### Resource Domains

The router discovers markdown resources recursively from `references/` and `assets/`, then applies intent scoring. This skill uses a **flat intent router**: no keyed `references/<key>/` subdirectories. References are the primary loaded resources; the single asset is the registered manual snapshot.

```text
references/tool-surface.md       # the 14-tool surface, args/bounds, the read funnel
references/credential-setup.md   # the credential, the .env wiring, the unauthenticated failure shape
references/mutation-boundary.md  # what is registered (read-only) vs what the CLI can do but is unregistered
assets/utcp-magicpath-manual.md  # verified manual snapshot (already registered) + the env-var wiring
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| CONDITIONAL | Component, project, team, theme, canvas, or sharing intent | `references/tool-surface.md` (tool contract + read funnel) |
| CONDITIONAL | Credential / auth intent | `references/credential-setup.md`, `assets/utcp-magicpath-manual.md` |
| CONDITIONAL | Mutation-boundary intent (what the agent may and may not reach) | `references/mutation-boundary.md` |
| FALLBACK | Zero-score routes only | `references/tool-surface.md` suggested (never auto-loaded) |

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../../sk-doc/sk-create-skill/assets/skill/skill-smart-router.md). Guard paths, discover at runtime, score intents, and fall back when unsure. Because this skill has no keyed resource subdirectories, intent selects from the flat resource inventory below.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references", SKILL_ROOT / "assets")
DEFAULT_RESOURCE = "references/tool-surface.md"
DEFAULT_RESOURCE_SEMANTICS = "fallback-only"
MIN_CONFIDENCE = 1
AMBIGUITY_DELTA = 1

INTENT_MODEL = {
    "SESSION":       {"keywords": [("info", 4), ("whoami", 4), ("signed in", 3), ("cli version", 3), ("reachable", 3), ("set up", 2)]},
    "COMPONENTS":    {"keywords": [("component", 4), ("search components", 4), ("inspect component", 4), ("component source", 3), ("component dependencies", 3), ("list components", 3), ("generated name", 2)]},
    "PROJECTS":      {"keywords": [("project", 4), ("list projects", 4), ("active project", 4), ("open project", 3), ("magicpath project", 3)]},
    "TEAMS":         {"keywords": [("team", 4), ("teams", 4), ("member", 3), ("list teams", 3), ("team member", 3), ("role", 2)]},
    "THEMES":        {"keywords": [("theme", 4), ("design system", 4), ("css variables", 3), ("brand", 3), ("styling prompt", 3), ("fonts", 2)]},
    "LOCAL_CANVAS":  {"keywords": [("canvas", 4), ("selection", 4), ("installed", 3), ("list installed", 3), ("selected", 2), ("open in the web", 2)]},
    "SHARING":       {"keywords": [("share", 4), ("share link", 4), ("shareable url", 3), ("link to", 2)]},
    "WIRING_AUTH":   {"keywords": [("wiring", 4), ("utcp", 4), ("manual", 4), ("credential", 4), ("magicpath token", 4), ("authenticate", 4), ("login", 3), ("register", 3), "setup", 2)]},
    "TROUBLESHOOT":  {"keywords": [("error", 4), ("failed", 4), ("not authenticated", 4), ("not working", 4), ("cli unavailable", 3), ("missing argument", 3), ("not resolving", 3)]},
}

INTENT_SIGNALS = {
    "SESSION":       {"weight": 4, "keywords": ["info", "whoami", "signed in", "cli version", "reachable", "set up"]},
    "COMPONENTS":    {"weight": 4, "keywords": ["component", "search components", "inspect component", "component source", "component dependencies", "list components", "generated name"]},
    "PROJECTS":      {"weight": 4, "keywords": ["project", "list projects", "active project", "open project", "magicpath project"]},
    "TEAMS":         {"weight": 4, "keywords": ["team", "teams", "member", "list teams", "team member", "role"]},
    "THEMES":        {"weight": 4, "keywords": ["theme", "design system", "css variables", "brand", "styling prompt", "fonts"]},
    "LOCAL_CANVAS":  {"weight": 4, "keywords": ["canvas", "selection", "installed", "list installed", "selected", "open in the web"]},
    "SHARING":       {"weight": 4, "keywords": ["share", "share link", "shareable url", "link to"]},
    "WIRING_AUTH":   {"weight": 4, "keywords": ["wiring", "utcp", "manual", "credential", "magicpath token", "authenticate", "login", "register", "setup"]},
    "TROUBLESHOOT":  {"weight": 4, "keywords": ["error", "failed", "not authenticated", "not working", "cli unavailable", "missing argument", "not resolving"]},
}

RESOURCE_MAP = {
    "SESSION":      ["references/tool-surface.md"],
    "COMPONENTS":   ["references/tool-surface.md"],
    "PROJECTS":     ["references/tool-surface.md"],
    "TEAMS":        ["references/tool-surface.md"],
    "THEMES":       ["references/tool-surface.md"],
    "LOCAL_CANVAS": ["references/tool-surface.md"],
    "SHARING":      ["references/tool-surface.md"],
    "WIRING_AUTH":  ["references/credential-setup.md", "assets/utcp-magicpath-manual.md"],
    "TROUBLESHOOT": ["references/credential-setup.md", "references/mutation-boundary.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the layer: session, components, projects, teams, themes, local/canvas, or sharing",
    "Confirm the magicpath manual is registered and discovery (tool_info) confirms the magicpath.<tool> callables",
    "Confirm a credential is present (magicpath-ai login or MAGICPATH_TOKEN); info answers without credentials, most other tools do not",
    "If the evidence will influence a design decision, remember this transport supplies read-only facts, never a taste verdict",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def discover_markdown_resources() -> set[str]:
    docs = []
    for base in RESOURCE_BASES:
        if base.exists():
            docs.extend(p for p in base.rglob("*.md") if p.is_file())
    return {d.relative_to(SKILL_ROOT).as_posix() for d in docs}

def classify_intents(request: str):
    text = (request or "").lower()
    scores = {i: 0 for i in INTENT_MODEL}
    for intent, cfg in INTENT_MODEL.items():
        for kw, w in cfg["keywords"]:
            if kw in text:
                scores[intent] += w
    ranked = sorted(scores.items(), key=lambda kv: kv[1], reverse=True)
    primary, top = ranked[0]
    if top == 0:
        return (None, None, scores)
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_magicpath_resources(request: str):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [i for i in (primary, secondary) if i]
    loaded, seen, notices = [], set(), []

    def load_if_available(rel: str) -> bool:
        guarded = _guard_in_skill(rel)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)
            return True
        if guarded not in inventory:
            notices.append(f"Resource not found in inventory: {guarded}")
        return False

    if max(scores.values() or [0]) < MIN_CONFIDENCE:
        return {"intents": intents, "load_level": "UNKNOWN_FALLBACK", "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
                "suggested_fallback": DEFAULT_RESOURCE, "resources": loaded, "notices": notices}
    for intent in intents:
        for rel in RESOURCE_MAP.get(intent, []):
            load_if_available(rel)
    return {"intents": intents, "intent_scores": scores, "resources": loaded, "notices": notices}
```

---

## 3. HOW IT WORKS

### First Step (Always): confirm wiring, then discover

The `magicpath` manual is **already registered** in this repo's `.utcp_config.json` (`call_template_type: "cli"`; the manual command runs `node .opencode/bin/magicpath-utcp-manual.cjs`, which prints the UTCP manual; tool execution runs through `node .opencode/bin/magicpath-utcp-exec.cjs`, which shells out to `magicpath-ai`). Verify it is present (read-only grep), never re-add it, and never edit it. Then discover the live callables through Code Mode before any call:

```javascript
// Discovery and callable names are the same: magicpath.search_components
const all = list_tools();
// MANDATORY: confirm the exact callable + schema before relying on any name
const info = tool_info({ tool_name: "magicpath.search_components" });
```

The callable form `magicpath.<tool>` follows Code Mode's `{manual}.{tool}` convention applied once, because the tool names have no `magicpath_` prefix of their own. If discovery shows the fourteen tools missing, renamed, or expanded, **fail closed**: report the drift; a changed provider surface requires a reviewed packet update, not an improvised call.

### The 14-tool surface (six themes)

The expected contract (authoritative baseline from the registered manual; `tool_info` is the final live schema). Full args, bounds, and result shapes: [`references/tool-surface.md`](references/tool-surface.md).

| Theme | Tool | Required args | Notes |
|---|---|---|---|
| Session | `info` | none | Answers without credentials; cheapest reachability check |
| Session | `whoami` | none | Fails when no credential is present |
| Components | `search_components` | `query` | `limit` (default 20), `team` optional |
| Components | `inspect_component` | `generated_name` | Reads source/deps/imports; writes no files |
| Components | `list_components` | `project_id` | `limit` (default 100), `after` cursor pagination |
| Projects | `list_projects` | none | `team`, `limit` optional |
| Projects | `active_project` | none | Projects open in the web app; lighter than `selection` |
| Projects | `share_link` | `identifier` | Component generated name or numeric project id; prints a URL, opens no browser |
| Teams | `list_teams` | none | Teams the user belongs to, with role |
| Teams | `list_members` | `team` | Members of one team (name or id) |
| Themes | `list_themes` | none | `team` optional |
| Themes | `get_theme` | `theme` | `team` optional; CSS variables, fonts, styling prompt |
| Local & canvas | `list_installed` | none | `path` optional; components already in the project directory |
| Local & canvas | `selection` | none | Canvas selection + open projects; empty when nothing is selected, safe to call speculatively |

Hard constraints: every tool is read-only. `limit` is declared as a `string` in the registered schema, not a number. `list_components` paginates by cursor (`after` is the previous page's last id), not by page number. `share_link` takes a component generated name or a numeric project id in one `identifier` argument. `info` is the only tool that answers without a credential; `whoami` and the rest require one. Preserve unknown response fields; the provider surface can grow.

### Calling through Code Mode

Call **synchronously inside the `call_tool_chain` body** (no `await`, no top-level `await`, no returned Promise), per the established convention:

```javascript
call_tool_chain({
  code: `
    var found = magicpath.search_components({
      query: "button",
      limit: "5"
    });
    var list = (found && found.records) ? found.records : [];
    var first = list.length ? list[0] : null;
    var detail = first
      ? magicpath.inspect_component({ generated_name: first.generated_name })
      : null;
    return { count: list.length, first: first, detail: detail };
  `
});
```

Inspect every returned value. A failing command does not throw; it returns the error text or a JSON error object as an ordinary value, so a caller that wraps the call in `try`/`catch` will miss the failure. Read the value, check for an `error`/`code` field, and only then use the result.

### The read funnel

1. **Start with reachability.** `info` answers without credentials and is the cheapest check that MagicPath is reachable and set up; it also reports the signed-in user, teams, projects, and CLI version.
2. **Search before detail.** For components, `search_components` first, then `inspect_component` for a shortlisted generated name. For themes, `list_themes` first, then `get_theme`. For project contents, `list_projects` first, then `list_components` for one `project_id`, cursor-paginating with `after`.
3. **Canvas and local state are safe to call speculatively.** `selection` returns empty collections when nothing is selected or no canvas is open; `active_project` is lighter than `selection` when only the project context is needed; `list_installed` scans the current project directory.
4. **Share last.** `share_link` prints a URL for a component or project to surface in conversation; it opens no browser.

### Auth, credential, and limits

- **Credential**: `magicpath-ai login` (browser) or the `MAGICPATH_TOKEN` environment variable. Under Code Mode the env var is wired as `magicpath_MAGICPATH_TOKEN` in `.env`, which the manual maps to the CLI's `MAGICPATH_TOKEN`. See [`references/credential-setup.md`](references/credential-setup.md).
- **Unauthenticated failure**: without a credential, a call returns structured JSON: `{"error":"Not authenticated. Set MAGICPATH_TOKEN or run \`magicpath-ai login\`.","code":"NOT_AUTHENTICATED","suggestion":"..."}`. `info` is the exception and answers without credentials.
- **Stale surface warning**: `magicpath-ai info -o json` reports a `cli.commands` list that is **stale and under-reports** the real surface. `magicpath-ai --help` is authoritative. The registered manual is the source of truth for what an agent can call; do not infer the tool set from `info`'s `cli.commands`.
- **Unknown limits**: no per-second, burst, concurrency, page-size, or retry contract is published for the CLI. Never invent a QPS number or backoff guarantee; on a failure, preserve the CLI's own message.
- **Local runtime**: Code Mode must run on **Node 24** (isolated-vm has no Node 25 build; `call_tool_chain` SIGSEGVs under Node 25). Local operational evidence, not a server property.

---

## 4. RULES

### ALWAYS

1. **ALWAYS confirm callables with `tool_info` after registration and before first use.** The `magicpath.<tool>` form is the documented convention; fail closed on any drift from the fourteen documented tools.
2. **ALWAYS call synchronously inside the `call_tool_chain` body** (no `await`, no top-level `await`, no returned Promise) and use plain JavaScript only; TypeScript type annotations fail to parse.
3. **ALWAYS inspect the returned value instead of relying on `try`/`catch`.** A failing command returns the error text or a JSON error object as an ordinary value; it does not throw.
4. **ALWAYS start from the registered manual as the source of truth.** `magicpath-ai info -o json`'s `cli.commands` list is stale and under-reports; `magicpath-ai --help` is authoritative, and the registered manual is what an agent can actually call.
5. **ALWAYS follow the read funnel**: reachability (`info`) -> search/list -> inspect/get detail -> share last; preserve unknown response fields.
6. **ALWAYS treat this packet as read-only against this repo** (`mutatesWorkspace: false`). Reads happen against the external MagicPath service; Write, Edit, and Task are forbidden tools for this transport.

### NEVER

1. **NEVER use Write, Edit, or Task through this packet.** It is a read-only TRANSPORT: it retrieves external facts and changes nothing in this workspace. Hand file changes to the owning workflow skill.
2. **NEVER edit `.utcp_config.json`'s `magicpath` manual.** It is validated as-is (verify, do not re-add, do not modify), and never add a second MagicPath manual.
3. **NEVER call, document, or expose the unregistered write surface** (`add`, `code`, `image`, `create-project`, `clone`, or any tool that writes `.tsx` files, installs npm packages, or creates remote projects or component revisions). Those are deliberately out of reach from a tool call; routing to them is a scope violation.
4. **NEVER accept, print, or cache credentials.** Surface the credential step to the operator and wait; never inspect, clear, or repair auth state.
5. **NEVER invent rate limits, page sizes, retry contracts, or backoff numbers.** No such contract is published for the CLI; on a failure, relay the CLI's own message.
6. **NEVER treat search rank, similarity, or a theme's styling prompt as a taste verdict.** This transport supplies read-only facts; it issues no design judgment.
7. **NEVER infer the tool set from `magicpath-ai info -o json`'s `cli.commands`.** That list is stale and under-reports; the registered manual and `magicpath-ai --help` are authoritative.

### ESCALATE IF

1. **ESCALATE IF authentication is required** (`NOT_AUTHENTICATED`, a login prompt, or a token need). Completing `magicpath-ai login` or wiring `MAGICPATH_TOKEN` is **operator-only**; surface the step and wait.
2. **ESCALATE IF discovery shows catalog drift**: a documented tool missing or renamed, unexpected new tools, or schemas that contradict [`references/tool-surface.md`](references/tool-surface.md). A provider-surface change requires a reviewed packet update.
3. **ESCALATE IF the request needs the write surface** (generating, installing, adding, coding, imaging, creating projects, or cloning). This packet cannot perform those; hand the request to the operator or a workflow that runs the CLI outside a tool call.
4. **ESCALATE IF `call_tool_chain` drops the connection** (`-32000 Connection closed`), which locally indicates a Node 25 runtime; the Node 24 pin is an operator-side fix.
5. **ESCALATE IF a tool returns `CLI_UNAVAILABLE`** (`Could not run magicpath-ai`); the `magicpath-ai` CLI is not on PATH and must be installed by the operator.

---

## 5. REFERENCES

### Core References

- [tool-surface.md](references/tool-surface.md) - The 14-tool contract: arguments, bounds, result shapes, the read funnel, and the stale-`cli.commands` warning.
- [credential-setup.md](references/credential-setup.md) - The credential, the `.env` wiring (`magicpath_MAGICPATH_TOKEN`), and the unauthenticated failure shape.
- [mutation-boundary.md](references/mutation-boundary.md) - What is registered (read-only) versus what the CLI can do but is deliberately unregistered.

### Templates and Assets

- [utcp-magicpath-manual.md](assets/utcp-magicpath-manual.md) - The verified `.utcp_config.json` manual snapshot (already registered: verify, do not re-add) plus the env-var wiring.

### Reference Loading Notes

- `tool-surface.md` is the baseline (always). Load `credential-setup.md` and the manual asset for wiring/auth intent, `mutation-boundary.md` for the read/write boundary.
- Keep Section 2 (SMART ROUTING) as the single routing authority.

---

## 6. SUCCESS CRITERIA

**Wiring verification complete when:**
- The `magicpath` manual was confirmed present in `.utcp_config.json` read-only (no edit, no re-add), and discovery (`list_tools` / `tool_info`) confirmed the `magicpath.<tool>` callables, or the credential/CLI blocker was escalated to the operator.

**Retrieval complete when:**
- The read funnel was followed (reachability -> search/list -> inspect/get -> share last), required arguments were supplied, cursor pagination used `after` (not page numbers) where applicable, returned values were inspected for `error`/`code`, and unknown fields were preserved.

**Always:**
- No workspace file changed, no credential was printed or cached, no auth state was touched, no unregistered write capability was invoked or documented as reachable, no unpublished limit was invented, and every capability claim stayed within the registered manual.

---

## 7. INTEGRATION POINTS

### Tool Usage Guidelines

- **Code Mode** (`mcp__code_mode__call_tool_chain`) owns every MagicPath call, including discovery (`list_tools`, `search_tools`, `tool_info`).
- **Read/Grep/Glob** load references and verify the manual's presence in `.utcp_config.json` read-only.
- **Bash** has no routine shell role here; the CLI is launched by the transport wrapper, not by this packet. A read-only reachability check (`magicpath-ai info -o json`) may be run to confirm the CLI is on PATH, but the packet never runs the bridge command itself.

### Cross-Workflow Contracts

- **`mcp-code-mode`** is the substrate: manuals, `{manual}.{tool}` naming, prefixed env vars (`magicpath_<NAME>`), discovery, and the synchronous-call discipline all come from it.
- **`mcp-refero`** is the sibling design-reference transport in this hub; it searches real shipped UI from third-party apps. MagicPath is its own component library, not a reference corpus, and the two surfaces do not overlap.
- **`sk-code`** owns adapting any resulting decision into application code and verifying it.

### External Tools

- **`magicpath-ai`** (Node CLI, installed version 2.6.1): the external service this transport reaches. Not vendored, not mirrored; must be on PATH.
- **`magicpath-utcp-exec.cjs`** and **`magicpath-utcp-manual.cjs`** (this repo's `.opencode/bin/`): the wrapper that strips unfilled argument placeholders before shelling out, and the manual emitter. The wrapper emits structured JSON errors (`MISSING_REQUIRED_ARGUMENT`, `CLI_UNAVAILABLE`) so a caller parsing JSON meets one shape whether it succeeded or not.

### Knowledge Base Dependencies

**Required**: `references/tool-surface.md` (tool contract baseline). **Conditional**: `credential-setup.md` + `assets/utcp-magicpath-manual.md` (wiring/auth), `mutation-boundary.md` (read/write boundary).

---

## 8. QUICK REFERENCE

| Item | Value |
|---|---|
| Transport | `cli` (UTCP); no MCP server |
| Manual | `magicpath` in `.utcp_config.json` (already registered; verify, never edit) |
| CLI | `magicpath-ai` (installed 2.6.1), on PATH |
| Callable form | `magicpath.<tool>(...)` (prefix applied once; confirm via `tool_info` per session) |
| Themes | Session (2) · Components (3) · Projects (3) · Teams (2) · Themes (2) · Local & canvas (2) |
| Tools | 14, all read-only |
| Pagination | `list_components` cursor (`after`); `limit` is a string |
| Credential | `magicpath-ai login` (browser) or `MAGICPATH_TOKEN` (wired as `magicpath_MAGICPATH_TOKEN` in `.env`) |
| Unauth failure | `{"error":"Not authenticated...","code":"NOT_AUTHENTICATED","suggestion":"..."}` (except `info`) |
| Stale surface | `magicpath-ai info -o json` `cli.commands` under-reports; `--help` is authoritative |
| Calling convention | Synchronous; no `await`, no top-level `await`, no returned Promise; plain JS only; inspect returned values, no try/catch reliance |
| Local runtime | Code Mode on Node 24 (Node 25 SIGSEGVs) |
| Mutation boundary | Read-only registered; `add`/`code`/`image`/`create-project`/`clone` deliberately unregistered |

---

## 9. REFERENCES AND RELATED RESOURCES

The router (Section 2) discovers reference and asset docs dynamically. Start from `references/tool-surface.md` for the tool contract and read funnel, `references/credential-setup.md` for the credential and `.env` wiring, and `references/mutation-boundary.md` for the read/write boundary.

Assets: `assets/utcp-magicpath-manual.md` (the verified, already-registered manual snapshot plus the env-var wiring), loaded for wiring/auth intent.

Feature catalog: `feature-catalog/feature-catalog.md` is the root inventory, with one domain overview per theme and one per-tool leaf per documented tool.

Related skills: `mcp-code-mode` (the substrate), `mcp-refero` (the sibling design-reference transport; no surface overlap), `mcp-figma`, `mcp-notion`, `mcp-obsidian`, `mcp-chrome-devtools` (other hub transports), `sk-code` (adapting evidence into an app), and `system-spec-kit` when packet documentation or memory continuity applies.

Upstream: MagicPath is the service behind the `magicpath-ai` CLI. This packet documents only the registered read-only surface; the vendor's own instruction files are out of scope and are not vendored or duplicated here.
