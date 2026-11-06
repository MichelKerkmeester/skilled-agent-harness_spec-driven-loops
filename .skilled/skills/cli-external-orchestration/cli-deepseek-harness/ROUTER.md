---
title: "DeepSeek Harness CLI Orchestrator - Cross-AI Task Delegation Router"
description: "Sibling router for cli-deepseek-harness: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-deepseek-harness router"
  - "cli-deepseek-harness routing"
importance_tier: normal
contextType: general
version: 1.0.1.0
router_state: active
skill_pointer: SKILL.md
---

# DeepSeek Harness CLI Orchestrator - Cross-AI Task Delegation Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they use harness vocabulary: "DeepSeek Harness", "`dsh`", "`dsh headless`" or "delegate to dsh". After the hub selects it, the router matches requests about route patches, the runtime folder, guards, MCP or fan-out to their packet resources.

It routes to two skill-local families:

- The six `references/` documents that carry the CLI contract, the closed roster, the runtime folder, the guard plan, the MCP policy and the fan-out executor.
- The two `assets/` scaffolds that carry the prompt-quality card and the dispatch templates.

`command -v dsh` plus the pinned version probe decide whether the route exists at all.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path stays inside this skill folder. The `DEFAULT_RESOURCE` is
`references/cli-reference.md`. The ALWAYS level also loads `assets/prompt-quality-card.md` before intent
selection. A matched intent then adds its mapped resources.

---

## 2. INTENT MODEL

- **`DISPATCH`** fires on `dsh`, `deepseek harness`, `dsh headless`, `headless dispatch`, `second opinion` and `review` at weight 4, and loads `references/cli-reference.md` and `assets/prompt-templates.md`.
- **`ROSTER`** fires on `model`, `provider`, `route patch`, `llm gateway`, `opencode go` and `deepseek v4.1 flash` at weight 4, and loads `references/providers-and-models.md` and `references/cli-reference.md`.
- **`RUNTIME_FOLDER`** fires on `.dsh`, `dsh_home`, `profile`, `skills farm`, `sync` and `persona patch` at weight 4, and loads `references/runtime-folder-and-sync.md`.
- **`GUARDS`** fires on `guard`, `hook`, `plugin`, `cordis` and `repo-guards` at weight 4, and loads `references/guards-and-hooks.md`.
- **`MCP`** fires on `mcp`, `code mode` and `mcp patch` at weight 4, and loads `references/mcp.md`.
- **`FANOUT`** fires on `fan-out`, `lineage`, `deep-loop`, `executor kind` and `env allowlist` at weight 4, and loads `references/fanout-executor.md` and `references/cli-reference.md`.
- **`TEMPLATES`** fires on `template`, `prompt`, `how to ask` and `handback` at weight 3, and loads `assets/prompt-templates.md` and `assets/prompt-quality-card.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's deterministic routing detail: the prerequisite probe, the loading levels, the intent dictionaries and the call sequence that reads them.

### Prerequisite Detection

Run this probe before every dispatch, with `DSH_HOME` already pointing at a disposable directory. Do not build a command when it fails.

~~~bash
command -v dsh || echo "Not installed. Install the pinned @deepseek-ai/dsh before dispatch."
dsh --version </dev/null
~~~

The version must equal the pin recorded in [cli-reference.md](./references/cli-reference.md) section 2.

### Resource Loading Levels

| Level | Load when | Resources |
|---|---|---|
| ALWAYS | Every dsh route | references/cli-reference.md, assets/prompt-quality-card.md |
| CONDITIONAL | Task names the matching surface | One or more intent-mapped references |
| ON_DEMAND | The operator asks for the full set | references/runtime-folder-and-sync.md, references/guards-and-hooks.md, references/mcp.md, references/fanout-executor.md |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md)):

```python
DEFAULT_RESOURCE = "references/cli-reference.md"

INTENT_SIGNALS = {
    "DISPATCH": {"weight": 4, "keywords": ["dsh", "deepseek harness", "dsh headless", "headless dispatch", "second opinion", "review"]},
    "ROSTER": {"weight": 4, "keywords": ["model", "provider", "route patch", "llm gateway", "opencode go", "deepseek v4.1 flash"]},
    "RUNTIME_FOLDER": {"weight": 4, "keywords": [".dsh", "dsh_home", "profile", "skills farm", "sync", "persona patch"]},
    "GUARDS": {"weight": 4, "keywords": ["guard", "hook", "plugin", "cordis", "repo-guards"]},
    "MCP": {"weight": 4, "keywords": ["mcp", "code mode", "mcp patch"]},
    "FANOUT": {"weight": 4, "keywords": ["fan-out", "lineage", "deep-loop", "executor kind", "env allowlist"]},
    "TEMPLATES": {"weight": 3, "keywords": ["template", "prompt", "how to ask", "handback"]},
}

RESOURCE_MAP = {
    "DISPATCH": ["references/cli-reference.md", "assets/prompt-templates.md"],
    "ROSTER": ["references/providers-and-models.md", "references/cli-reference.md"],
    "RUNTIME_FOLDER": ["references/runtime-folder-and-sync.md"],
    "GUARDS": ["references/guards-and-hooks.md"],
    "MCP": ["references/mcp.md"],
    "FANOUT": ["references/fanout-executor.md", "references/cli-reference.md"],
    "TEMPLATES": ["assets/prompt-templates.md", "assets/prompt-quality-card.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all references", "deep dive"],
    "ON_DEMAND": ["references/runtime-folder-and-sync.md", "references/guards-and-hooks.md", "references/mcp.md", "references/fanout-executor.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm that the user wants DeepSeek Harness rather than another cli-X mode",
    "Confirm which roster route the task needs, LLM Gateway or OpenCode Go",
    "Confirm whether the task is read-only or writes files",
    "Confirm the required verification command before dispatch",
]
```

**Call sequence:** `route_dsh_resources(task)` runs on the shared helpers `discover_markdown_resources()` and `_guard_in_skill()`, documented once in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md) with `<PROVIDER>` = `dsh`.
