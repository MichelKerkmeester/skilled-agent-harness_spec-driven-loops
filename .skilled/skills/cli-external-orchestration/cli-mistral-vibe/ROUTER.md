---
title: "Mistral Vibe CLI Orchestrator - Cross-AI Task Delegation Router"
description: "Sibling router for cli-mistral-vibe: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-mistral-vibe router"
  - "cli-mistral-vibe routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Mistral Vibe CLI Orchestrator - Cross-AI Task Delegation Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they use Vibe vocabulary: "Mistral Vibe", "`vibe -p`", "vibe print
mode" or "delegate to Vibe". No hub row routes here yet, so a request arrives when the operator
names Mistral Vibe or this packet's path. After that, the router matches requests about the dispatch
shape, the closed roster, the runtime folder, hooks, prompt composition and the hard rules to their
packet resources.

It routes to two skill-local families:

- The four `references/` documents that carry the CLI contract, the closed roster, the runtime folder
  and the guard plan.
- The one `assets/` scaffold that carries the prompt-quality card and its print-mode addenda.

The six fail-closed dispatch rules live in `hard-rules.json`, which [SKILL.md](./SKILL.md) links directly. It is not a routed resource: only `references/` and `assets/` files can be leaves.

`command -v vibe` plus the pinned version probe decide whether the route exists at all.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path stays inside this skill folder. The `DEFAULT_RESOURCE` is
`references/cli-reference.md`. The ALWAYS level also loads `assets/prompt-quality-card.md` before intent
selection. A matched intent then adds its mapped resources.

---

## 2. INTENT MODEL

- **`DISPATCH`** fires on `mistral vibe`, `vibe -p`, `vibe print mode`, `print mode`, `export.json` and `exit code` at weight 4, and loads `references/cli-reference.md`.
- **`ROSTER`** fires on `deepseek-flash`, `glm-flash`, `model roster`, `allowed_models`, `thinking = max` and `mistral provider` at weight 4, and loads `references/providers-and-models.md` and `references/cli-reference.md`.
- **`RUNTIME_FOLDER`** fires on `vibe_home` (`VIBE_HOME`), `.vibe/`, `runtime folder`, `trusted_folders`, `config.toml` and `sync` at weight 4, and loads `references/runtime-folder-and-sync.md`.
- **`GUARDS`** fires on `hooks.toml`, `hook`, `guard`, `pre_tool`, `post_tool` and `strict` at weight 4, and loads `references/guards-and-hooks.md`.
- **`PROMPT`** fires on `prompt quality`, `prompt composition`, `persona injection`, `prompt file` and `compose the prompt` at weight 3, and loads `assets/prompt-quality-card.md`.

No intent fires on the bare word `vibe`: it is ordinary English, and a signal that broad would claim
every request that mentions a feeling. Every Vibe signal above is a compound term, a flag, a file name
or an environment variable.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's deterministic routing detail: the prerequisite probe, the loading levels, the intent dictionaries and the call sequence that reads them.

### Prerequisite Detection

Run this probe before every dispatch, with `VIBE_HOME` already pointing at a disposable directory. Do not build a command when it fails.

~~~bash
command -v vibe || echo "Not installed. Install the pinned uv tool package mistral-vibe before dispatch."
vibe --version </dev/null
test -n "${MISTRAL_API_KEY:-}" || echo "MISTRAL_API_KEY is not exported; the mistral provider would fall back to browser sign-in."
~~~

The version must equal the pin recorded in [cli-reference.md](./references/cli-reference.md) section 1, and a fresh home must carry the two roster rows before `--model` can resolve.

### Resource Loading Levels

| Level | Load when | Resources |
|---|---|---|
| ALWAYS | Every Vibe route | references/cli-reference.md, assets/prompt-quality-card.md |
| CONDITIONAL | Task names the matching surface | One or more intent-mapped resources |
| ON_DEMAND | The operator asks for the full set | references/runtime-folder-and-sync.md, references/guards-and-hooks.md, references/providers-and-models.md |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md)):

```python
DEFAULT_RESOURCE = "references/cli-reference.md"

INTENT_SIGNALS = {
    "DISPATCH": {"weight": 4, "keywords": ["mistral vibe", "vibe -p", "vibe print mode", "print mode", "export.json", "exit code"]},
    "ROSTER": {"weight": 4, "keywords": ["deepseek-flash", "glm-flash", "model roster", "allowed_models", "thinking = max", "mistral provider"]},
    "RUNTIME_FOLDER": {"weight": 4, "keywords": ["vibe_home", ".vibe/", "runtime folder", "trusted_folders", "config.toml", "sync"]},
    "GUARDS": {"weight": 4, "keywords": ["hooks.toml", "hook", "guard", "pre_tool", "post_tool", "strict"]},
    "PROMPT": {"weight": 3, "keywords": ["prompt quality", "prompt composition", "persona injection", "prompt file", "compose the prompt"]},
}

RESOURCE_MAP = {
    "DISPATCH": ["references/cli-reference.md"],
    "ROSTER": ["references/providers-and-models.md", "references/cli-reference.md"],
    "RUNTIME_FOLDER": ["references/runtime-folder-and-sync.md"],
    "GUARDS": ["references/guards-and-hooks.md"],
    "PROMPT": ["assets/prompt-quality-card.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all references", "deep dive"],
    "ON_DEMAND": ["references/runtime-folder-and-sync.md", "references/guards-and-hooks.md", "references/providers-and-models.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm that the user wants Mistral Vibe rather than another cli-X mode",
    "Confirm which roster alias the task needs, deepseek-flash or glm-flash",
    "Confirm whether the task is read-only or writes files",
    "Confirm the required verification command before dispatch",
]
```

**Call sequence:** `route_vibe_resources(task)` runs on the shared helpers `discover_markdown_resources()` and `_guard_in_skill()`, documented once in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md) with `<PROVIDER>` = `vibe`.
