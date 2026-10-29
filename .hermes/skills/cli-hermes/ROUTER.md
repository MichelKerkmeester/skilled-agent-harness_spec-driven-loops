---
title: "Hermes Agent CLI Orchestrator - Cross-AI Task Delegation Router"
description: "Sibling router for cli-hermes: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-hermes router"
  - "cli-hermes routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Hermes Agent CLI Orchestrator - Cross-AI Task Delegation Router

The machine router for [`SKILL.md`](../../../.skilled/skills/cli-external-orchestration/cli-hermes/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name Hermes, Nous Research or the Hermes agent, ask for headless `--oneshot` dispatch or an independent cross-AI validation, want a model from the LLM Gateway roster such as `deepseek-v4.1-flash-1017` or `glm-5.3-flash` through Hermes's own tool loop, or concern Hermes's repo-local project skills and plugins. A `/deep:research` or `/deep:review` lineage on `--executor=cli-hermes` lands here too, and a session already running inside Hermes is refused before any dispatch. It routes to `references/` for the CLI surface, the provider and roster contract, the toolset and hook model, the delegation patterns and the MCP policy, and to `assets/` for the prompt-quality card and the prompt templates.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`generation`** fires on `generate`, `create`, `build`, `write code` and `hermes coding agent` at weight 4. It loads `references/cli-reference.md` and `assets/prompt-templates.md`.
- **`review`** fires on `review`, `audit`, `bug`, `second opinion` and `cross-validate` at weight 4. It loads `references/integration-patterns.md` and `references/cli-reference.md`.
- **`headless`** fires on `hermes cli`, `hermes agent`, `headless`, `oneshot`, `query-file` and `quiet mode` at weight 4. It loads `references/cli-reference.md` and `assets/prompt-templates.md`.
- **`models`** fires on `llm gateway`, `devpass`, `deepseek-v4.1-flash-1017`, `deepseek-v4.1-flash`, `glm-5.3-flash`, `reasoning level` and `provider` at weight 4. It loads `references/providers-and-models.md` and `references/cli-reference.md`.
- **`agent_delegation`** fires on `delegate`, `persona`, `delegate_task`, `sub-agent` and `agent bridge` at weight 4. It loads `references/agent-delegation.md` and `references/integration-patterns.md`.
- **`native_resources`** fires on `skill`, `plugin`, `hermes skills`, `skills trust`, `project plugin` and `toolset` at weight 4. It loads `references/hermes-tools.md` and `references/agent-delegation.md`.
- **`hooks`** fires on `hook`, `pre_verify`, `pre_tool_call`, `consent allowlist` and `repo-guards` at weight 3. It loads `references/hook-contract.md` and `references/hermes-tools.md`.
- **`mcp`** fires on `mcp`, `hermes mcp add`, `mcp server` and `tools disable` at weight 3. It loads `references/mcp-policy.md` and `references/hermes-tools.md`.
- **`patterns`** fires on `pattern`, `workflow`, `session`, `resume` and `continue` at weight 3. It loads `references/integration-patterns.md` and `references/cli-reference.md`.
- **`templates`** fires on `template`, `prompt`, `how to ask` and `hermes prompt` at weight 3. It loads `assets/prompt-templates.md` and `assets/prompt-quality-card.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail the short summary leaves out: the fan-out model fallback, the prerequisite probes, the self-invocation guard, the loading levels, the intent map and the call sequence.

> **Fan-out fallback:** a deep-loop lineage that pins no model runs **DeepSeek V4.1 Flash**. The family is named here on purpose, without a version or an effort tier, so this line does not go stale when the family ships a point release; the runner resolves the current id. A drift test keeps the two in the same family.

### Prerequisite Detection

Run both probes before every dispatch. Do not build a command when the first fails; surface the second's result to the operator when it shows no provider.

~~~bash
command -v hermes || echo "Not installed. See https://github.com/NousResearch/hermes-agent"
hermes config get providers.llmgateway.base_url </dev/null
~~~

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside Hermes."""
    # Layer 1: Hermes sets HERMES_AGENT=true and HERMES_SESSION_ID in its own process env,
    # and its terminal tool inherits both into every child (source-read on v0.21.1).
    if os.environ.get('HERMES_AGENT') == 'true' or os.environ.get('HERMES_SESSION_ID'):
        return ('env', 'HERMES_AGENT')
    # Layer 2: process ancestry — hermes in the parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/hermes' in ancestry or ancestry.strip().endswith('hermes') or 'hermes chat' in ancestry:
            return ('ancestry', 'hermes')
    except subprocess.SubprocessError:
        pass
    return None

if detect_self_invocation():
    refuse(
        "Self-invocation refused: this agent is already running inside Hermes. "
        "Use Hermes's own delegate_task, or a sibling cli-* skill from a different runtime."
    )
```

### Resource Loading Levels

| Level | Load when | Resources |
|---|---|---|
| ALWAYS | Every Hermes route | `references/cli-reference.md`, `assets/prompt-quality-card.md` |
| CONDITIONAL | Task names the matching surface | One or more intent-mapped references |
| ON_DEMAND | The operator asks for templates, hooks, or MCP detail | `assets/prompt-templates.md`, `references/hook-contract.md`, `references/mcp-policy.md` |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md)):

```python
INTENT_SIGNALS = {
    "GENERATION":       {"weight": 4, "keywords": ["generate", "create", "build", "write code", "hermes coding agent"]},
    "REVIEW":           {"weight": 4, "keywords": ["review", "audit", "bug", "second opinion", "cross-validate"]},
    "HEADLESS":         {"weight": 4, "keywords": ["hermes cli", "hermes agent", "headless", "oneshot", "query-file", "quiet mode"]},
    "MODELS":           {"weight": 4, "keywords": ["llm gateway", "devpass", "deepseek-v4.1-flash-1017", "deepseek-v4.1-flash", "glm-5.3-flash", "reasoning level", "provider"]},
    "AGENT_DELEGATION": {"weight": 4, "keywords": ["delegate", "persona", "delegate_task", "sub-agent", "agent bridge"]},
    "NATIVE_RESOURCES": {"weight": 4, "keywords": ["skill", "plugin", "hermes skills", "skills trust", "project plugin", "toolset"]},
    "HOOKS":            {"weight": 3, "keywords": ["hook", "pre_verify", "pre_tool_call", "consent allowlist", "repo-guards"]},
    "MCP":              {"weight": 3, "keywords": ["mcp", "hermes mcp add", "mcp server", "tools disable"]},
    "PATTERNS":         {"weight": 3, "keywords": ["pattern", "workflow", "session", "resume", "continue"]},
    "TEMPLATES":        {"weight": 3, "keywords": ["template", "prompt", "how to ask", "hermes prompt"]},
}

RESOURCE_MAP = {
    "GENERATION":       ["references/cli-reference.md", "assets/prompt-templates.md"],
    "REVIEW":           ["references/integration-patterns.md", "references/cli-reference.md"],
    "HEADLESS":         ["references/cli-reference.md", "assets/prompt-templates.md"],
    "MODELS":           ["references/providers-and-models.md", "references/cli-reference.md"],
    "AGENT_DELEGATION": ["references/agent-delegation.md", "references/integration-patterns.md"],
    "NATIVE_RESOURCES": ["references/hermes-tools.md", "references/agent-delegation.md"],
    "HOOKS":            ["references/hook-contract.md", "references/hermes-tools.md"],
    "MCP":              ["references/mcp-policy.md", "references/hermes-tools.md"],
    "PATTERNS":         ["references/integration-patterns.md", "references/cli-reference.md"],
    "TEMPLATES":        ["assets/prompt-templates.md", "assets/prompt-quality-card.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "hermes hooks", "hermes mcp", "hermes plugins"],
    "ON_DEMAND": ["assets/prompt-templates.md", "references/hook-contract.md", "references/mcp-policy.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm that the user wants Hermes rather than another cli-X mode",
    "Confirm whether the dispatch writes (needs --yolo) or is read-only",
    "Confirm the model is on the closed roster and the llmgateway provider is configured",
    "Confirm the required verification command before dispatch",
]
```

### Call Sequence

The call sequence is `route_hermes_resources(task)`, whose helper bodies `discover_markdown_resources()`, `_guard_in_skill()`, `load_if_available()`, `score_intents()`, `select_intents()` and `get_routing_key()` are written once in [`shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md) with `<PROVIDER>` set to `hermes`.
