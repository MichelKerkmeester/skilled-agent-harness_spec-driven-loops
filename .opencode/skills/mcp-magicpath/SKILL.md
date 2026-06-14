---
name: mcp-magicpath
description: Find, preview, inspect, and install MagicPath UI components into an app, or author and edit MagicPath canvas components from local code, through the magicpath-ai CLI. Covers teams, themes, the live canvas selection, and importing UI from a repository.
compatibility: Requires Node.js (for npx), network access to MagicPath, and browser access for login or preview flows.
metadata:
  author: MagicPathAI
  source: https://github.com/MagicPathAI/agent-skills
allowed-tools: [Read, Bash(npx -y magicpath-ai *)]
version: 1.0.0
user-invocable: true
---

<!-- keywords: magicpath ui-components design-to-code canvas npx-magicpath-ai mcp -->

# MagicPath (mcp-magicpath)

Find, preview, inspect, install, and author MagicPath UI components through the `magicpath-ai` CLI. This is a CLI-only surface (no MCP server); the `mcp-` prefix is the framework's external-tool family bucket. Deep operational detail lives in [`references/magicpath_operations.md`](references/magicpath_operations.md).

> **Terminology.** Users call components "designs" (interchangeable), design systems "themes", and workspaces "teams". Resolve "my designs" to components, "the X theme" to a design system (`list-themes`/`get-theme`), and "the team's work" to a team scope (`--team`/`--personal`).

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user:
- Mentions MagicPath, "my designs/components", a project, theme, or canvas selection.
- Wants to find, preview, or inspect a MagicPath component.
- Wants to install a MagicPath component into a React/TypeScript app, or translate one into another language.
- Wants to author or edit a MagicPath canvas component from local code.
- Wants to import or recreate existing UI (local path or Git repo) onto a MagicPath canvas.

**Keyword Triggers**: "magicpath", "magic path", "ui component", "design to code", "canvas component", "install component", "inspect component".

### Use Cases

**Install direction (pull a design into an app).** Find with `search`, read read-only with `inspect`, install into React/TS with `add`, then adapt to production. For non-JS targets, `inspect` and translate by hand.

**Author direction (push code onto the canvas).** Scaffold, edit, and submit canvas components with the `code` subcommands, inside a strict editable-file boundary, following the Design Defaults.

### When NOT to Use

**Skip this skill when:**
- The work is generic app coding with no MagicPath component involved (use `sk-code`).
- The user wants browser automation unrelated to MagicPath (use `mcp-chrome-devtools`).
- No MagicPath account or network is available; authentication is required first.

---

## 2. SMART ROUTING

### Primary Detection Signal

Detect the workflow **direction** from the request, since it selects both the commands and the references to load:

```bash
# Direction detection (pseudo)
echo "$REQUEST" | grep -qiE 'code |canvas|author|create component|edit component' && DIR="AUTHOR"
echo "$REQUEST" | grep -qiE 'import|recreate|bring .* into magicpath|render .* in magicpath' && DIR="REPO_IMPORT"
echo "$REQUEST" | grep -qiE 'install|add |inspect|into my app' && DIR="INSTALL"
# default when only finding/listing: DISCOVER
```

### Phase Detection

```text
TASK CONTEXT
    |
    +- STEP 0: info -o json (auth + project context)
    +- STEP 1: Score intent -> INSTALL | AUTHOR | REPO_IMPORT | DISCOVER
    +- Phase 1: Discover (search / selection / active-project)
    +- Phase 2: Understand (inspect / read target / read repo)
    +- Phase 3: Act (add + adapt, or code start/submit)
    +- Phase 4: Verify (import + render, or view the canvas result)
```

### Resource Domains

```text
references/cli_reference.md                 # full command surface (all directions)
references/magicpath_operations.md          # workflow phases, themes, canvas authoring, rules
references/working_with_repositories.md     # REPO_IMPORT direction
references/working_with_embedded_browsers.md# embedded-canvas hosts (Codex/Cursor)
```

### Resource Loading Levels

| Level | When to Load | Resources |
| ----- | ------------ | --------- |
| ALWAYS | Every invocation | `references/cli_reference.md` (command shapes) |
| CONDITIONAL | Intent matches | `magicpath_operations.md` (INSTALL/AUTHOR), `working_with_repositories.md` (REPO_IMPORT) |
| ALWAYS (design work) | AUTHOR / REPO_IMPORT / post-`add` adapt | `sk-interface-design` design principles, applied before building |
| ALWAYS (design work) | AUTHOR / REPO_IMPORT / post-`add` adapt | `sk-interface-design/references/claude_design_parity.md` (the shared loop: reuse-before-generate, fidelity check, revision grammar, boundary) |
| ON_DEMAND | Embedded-browser host | `working_with_embedded_browsers.md` |

### Smart Router Pseudocode

> Resilience pattern: see [sk-doc smart-router template](../sk-doc/assets/skill/skill_smart_router.md). Guard paths, discover at runtime, derive a routing key, score intents, fall back when unsure.

```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
RESOURCE_BASES = (SKILL_ROOT / "references",)
DEFAULT_RESOURCE = "references/cli_reference.md"

INTENT_MODEL = {
    "INSTALL":     {"keywords": [("install", 4), ("add", 3), ("inspect", 3), ("into my app", 4)]},
    "AUTHOR":      {"keywords": [("code", 3), ("canvas", 4), ("author", 4), ("edit component", 4)]},
    "REPO_IMPORT": {"keywords": [("import", 4), ("recreate", 4), ("repo", 3), ("bring", 2)]},
    "DISCOVER":    {"keywords": [("search", 4), ("find", 3), ("list", 3), ("theme", 3), ("team", 3)]},
}

RESOURCE_MAP = {
    "INSTALL":     ["references/magicpath_operations.md", "references/cli_reference.md"],
    "AUTHOR":      ["references/magicpath_operations.md", "references/working_with_embedded_browsers.md"],
    "REPO_IMPORT": ["references/working_with_repositories.md", "references/magicpath_operations.md"],
    "DISCOVER":    ["references/cli_reference.md"],
}

# Cross-skill: AUTHOR and REPO_IMPORT (and post-add adaptation) are design work.
# Always also load the sk-interface-design skill and apply its design_principles
# before building. mcp-magicpath owns the CLI flow, sk-interface-design owns the look.
DESIGN_INTENTS = {"AUTHOR", "REPO_IMPORT"}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm the direction: install into an app, author on the canvas, or import a repo",
    "Confirm whether a specific component/project/selection is referenced",
    "Confirm the target project type (React/TS vs other) for install",
    "Confirm authentication: run `npx -y magicpath-ai info -o json`",
]

AMBIGUITY_DELTA = 1

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)            # raises if path escapes the skill
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
        return ("DISCOVER", None, scores)
    secondary, second = ranked[1]
    if second > 0 and (top - second) <= AMBIGUITY_DELTA:
        return (primary, secondary, scores)
    return (primary, None, scores)

def route_magicpath_resources(request: str):
    inventory = discover_markdown_resources()
    primary, secondary, scores = classify_intents(request)
    intents = [primary] + ([secondary] if secondary else [])
    loaded, seen = [], set()

    def load_if_available(rel: str):
        guarded = _guard_in_skill(rel)
        if guarded in inventory and guarded not in seen:
            load(guarded); loaded.append(guarded); seen.add(guarded)

    load_if_available(DEFAULT_RESOURCE)
    if max(scores.values() or [0]) < 1:
        return {"intents": intents, "needs_disambiguation": True,
                "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST, "resources": loaded}
    for intent in intents:
        for rel in RESOURCE_MAP.get(intent, []):
            load_if_available(rel)
    return {"intents": intents, "intent_scores": scores, "resources": loaded}
```

---

## 3. HOW IT WORKS

### First Step (Always)

```bash
npx -y magicpath-ai info -o json
# auth status + teams + projects in one call. If auth.authenticated is false:
npx -y magicpath-ai login            # browser auth, auto-completes
npx -y magicpath-ai whoami -o json   # verify
```

Pass `-o json` on every data-returning command. The global installer (`scripts/install.sh`) makes the bare `magicpath-ai` command available; `npx -y magicpath-ai` works either way.

### Install Direction (inspect / add)

```text
STEP 1: search "<query>" -o json          # find across workspaces
       └─ confirm the component with the user (STOP and wait)
       ↓
STEP 2: inspect <generatedName> -o json    # read-only source; safe in any project
       └─ read the target codebase: layout, data flow, design system
       ↓
STEP 3: add <generatedName> -y             # React/TS only -> src/components/magicpath/
       └─ non-JS: skip add; translate the inspected source by hand
       ↓
STEP 4: import the installed component and adapt it (responsive, real data, a11y)
```

`add` installs source you then import; never `add` merely to read (use `inspect`), and never copy a component's markup instead of importing it. See [magicpath_operations.md](references/magicpath_operations.md) for the discover/understand/adapt phases and the design-to-production mindset.

### Author Direction (code subcommands)

```bash
npx -y magicpath-ai code start --project <id> --dir <dir> --name "Name" -o json   # create
npx -y magicpath-ai code start --component <id> --dir <dir> -o json               # edit
npx -y magicpath-ai code submit --dir <dir> --wait -o json                        # build + wait
npx -y magicpath-ai code context <id> --dir <dir> -o json                         # read-only
```

`code start` creates a pending canvas revision and scaffolds editable files; `code submit` uploads changes and builds. The editable boundary is strict: only `src/App.tsx`, `src/index.css`, `src/components/generated/**`, and temporary `assets/**`. Canvas components must follow the **Design Defaults** (responsive, centered, no device mockups, single screen, fully interactive) and Tailwind v4 rules. Full detail in [magicpath_operations.md](references/magicpath_operations.md).

**Apply the design skill first.** Authoring a canvas component is design work, so before writing code, load `sk-interface-design` and run its process: ground the subject, brainstorm a token system, and critique it against the AI-default looks. mcp-magicpath drives the MagicPath CLI. `sk-interface-design` owns the visual direction.

### Repository Import

To recreate existing UI (local path or Git repo) on the canvas, use the `code start` → `code submit` flow, not `add`/`inspect`. See [working_with_repositories.md](references/working_with_repositories.md).

### Embedded Browser

In hosts with an embedded browser (Codex, some Cursor flows), keep the MagicPath **project** canvas open via `share <projectId>` URLs; open a newly created project before `code start`. See [working_with_embedded_browsers.md](references/working_with_embedded_browsers.md).

---

## 4. RULES

### ALWAYS

1. **ALWAYS run `info -o json` first** and authenticate (`login`) before any operation. There is no offline mode.
2. **ALWAYS pass `-o json`** on data-returning commands for structured output, and `-y` on `add` in non-interactive contexts.
3. **ALWAYS confirm the component with the user before `add`/`inspect`** unless they named an exact `generatedName`. This is a STOP point.
4. **ALWAYS import and adapt after `add`** (responsive sizing, real data, accessibility, preserved existing behavior). A component dropped in unadapted is a bug.
5. **ALWAYS keep the editable-file boundary** in the `code` flow: only `src/App.tsx`, `src/index.css`, `src/components/generated/**`, `assets/**`.
6. **ALWAYS apply `sk-interface-design` when producing or shaping UI through this skill** — authoring a canvas component, recreating a repo's UI on the canvas, or adapting an installed component for production. Load its `design_principles` and run ground -> token-system -> critique before building. This skill owns the CLI flow. `sk-interface-design` owns the aesthetic direction.
7. **ALWAYS follow the shared parity loop** in `sk-interface-design/references/claude_design_parity.md` for canvas work: reuse the active theme's registered components before authoring net-new (`search`/`inspect` first); after `code submit --wait`, verify against the backend-rendered `previewImageUrl` (fetch it with `scripts/design_fidelity.py --project <id> --component <name>`; not a `view`/`share` browser screenshot, which is auth-gated) and self-heal build errors within the editable boundary (cap two retries); use the element-target grammar to route broad feedback to a re-plan and targeted feedback to `code start --component --revision`; keep generated source, wrapper/adaptation, and business logic distinct (import installed components, never copy generated markup).

### NEVER

1. **NEVER use `add` just to read source** — use read-only `inspect`. `add` is React/TypeScript only.
2. **NEVER copy a component's markup into another file** instead of importing the installed component.
3. **NEVER add device mockups or stack multiple screens in one canvas frame** when authoring; use internal state or separate `code start` sessions per screen.
4. **NEVER run `view` commands in parallel** or auto-navigate an embedded canvas to an individual design preview unless asked.

### ESCALATE IF

1. **ESCALATE IF the target project is non-React/JS** and the user expected `add` — confirm whether to translate the source instead.
2. **ESCALATE IF the workspace is ambiguous** (personal vs which team) before creating a project — run `list-teams` and ask.
3. **ESCALATE IF a multi-view design is requested** — ask whether it is one interactive component or separate frames, then stop and wait.

---

## 5. REFERENCES

### Core References

- [magicpath_operations.md](references/magicpath_operations.md) - Full workflow: discover/understand/install/integrate, themes, canvas authoring, Design Defaults, critical rules, quick reference.
- [cli_reference.md](references/cli_reference.md) - Complete `magicpath-ai` command reference with flags and JSON shapes.
- [working_with_repositories.md](references/working_with_repositories.md) - Importing or recreating UI from a local path or Git repo.
- [working_with_embedded_browsers.md](references/working_with_embedded_browsers.md) - Using a MagicPath project as a persistent canvas in embedded-browser hosts.

### Reference Loading Notes

- Load only what the detected direction requires (see Section 2). `cli_reference.md` is the baseline; load `magicpath_operations.md` for execution detail.
- Keep Section 2 (SMART ROUTING) as the single routing authority.

---

## 6. SUCCESS CRITERIA

**Install complete when:**
- ✅ The component was inspected, installed into `src/components/magicpath/`, imported, and adapted (responsive, real data, a11y).
- ✅ Existing behavior of any replaced component is preserved.

**Canvas authoring complete when:**
- ✅ `code submit --wait` returns a `completed` build.
- ✅ The component is responsive, centered, single-screen, and fully interactive (no placeholder handlers).

**Always:**
- ✅ `info -o json` confirmed authentication before acting.
- ✅ Every data command used `-o json`.

---

## 7. INTEGRATION POINTS

### Required Tool

**`magicpath-ai` CLI** — three install paths: globally via `scripts/install.sh` (`npm install -g magicpath-ai`), vendored into the skill via `mcp-servers/magicpath-cli/` (`bash setup.sh` → local `node_modules`), or on demand via `npx -y magicpath-ai`. Requires Node.js 16+, network access, and a browser for login. MagicPath has no MCP server; the CLI is the only interface.

### Related Skills

- **`sk-interface-design`** owns the visual direction and is **auto-applied whenever this skill produces or shapes UI** (canvas authoring, repo recreation, post-`add` adaptation): load its design principles and run its critique process before building.
- **`sk-code`** owns application-code standards. After `add` installs component source, sk-code governs how it is wired, adapted, and tested.
- **`mcp-chrome-devtools`** can drive a real browser for MagicPath login/preview when the host lacks an embedded browser.

### Knowledge Base Dependencies

**Required**: `references/cli_reference.md` (command shapes). **Conditional**: `references/magicpath_operations.md`, `references/working_with_repositories.md`, `references/working_with_embedded_browsers.md` per detected direction.

---

## 8. REFERENCES AND RELATED RESOURCES

The router (Section 2) discovers reference docs dynamically. Start from `references/cli_reference.md` for command shapes and load `references/magicpath_operations.md` for execution detail; load `references/working_with_repositories.md` and `references/working_with_embedded_browsers.md` only when the direction or host calls for them.

Scripts: `scripts/install.sh` makes the `magicpath-ai` CLI available (`npm install -g magicpath-ai`), with an `npx -y magicpath-ai` fallback. See [`scripts/README.md`](scripts/README.md) for the script surface.

Install guide: [`INSTALL_GUIDE.md`](INSTALL_GUIDE.md) for phased install (global / in-skill vendor / npx), browser authentication, and end-to-end verification.

Related skills: `sk-interface-design` (auto-applied for the visual direction whenever this skill authors or shapes UI), `sk-code` for adapting installed component source into an app, `mcp-chrome-devtools` for a real browser when the host has no embedded one, and `system-spec-kit` when packet documentation or memory continuity applies.

Upstream: vendored from [MagicPathAI/agent-skills](https://github.com/MagicPathAI/agent-skills); `references/magicpath_operations.md` preserves the upstream operational guide.
