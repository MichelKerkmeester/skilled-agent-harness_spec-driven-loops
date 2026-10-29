---
title: "Pi CLI Orchestrator - Cross-AI Task Delegation Router"
description: "Sibling router for cli-pi: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-pi router"
  - "cli-pi routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Pi CLI Orchestrator - Cross-AI Task Delegation Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name Pi, pi.dev or the Pi coding agent, ask for a headless dispatch, a JSON event stream, an RPC client or an independent second opinion, or concern Pi-native skills, prompt templates, extensions and packages. It routes to two skill-local families: the seven `references/` packets that carry the CLI contract, the provider and model roster, the tool surface, the delegation boundary and the native discovery surfaces, and the two `assets/` scaffolds that carry the prompt-quality card and the print, JSON, RPC, review and generation templates. The ALWAYS level loads `references/cli-reference.md` and `assets/prompt-quality-card.md` before an intent selects anything else, and `command -v pi` decides whether the route exists at all.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`GENERATION`** fires on `generate`, `create`, `build`, `write code` and `pi coding agent` at weight 4, and loads `references/cli-reference.md` and `assets/prompt-templates.md`.
- **`REVIEW`** fires on `review`, `audit`, `bug`, `second opinion` and `cross-validate` at weight 4, and loads `references/integration-patterns.md` and `references/cli-reference.md`.
- **`HEADLESS`** fires on `pi cli`, `pi agent`, `headless`, `print mode` and `json event` at weight 4, and loads `references/cli-reference.md` and `assets/prompt-templates.md`.
- **`RPC`** fires on `rpc`, `stdin`, `stdout`, `jsonl` and `persistent process` at weight 4, and loads `references/cli-reference.md` and `references/integration-patterns.md`.
- **`AGENT_DELEGATION`** fires on `delegate`, `built-in tools`, `tool allowlist` and `agent bridge` at weight 4, and loads `references/agent-delegation.md` and `references/integration-patterns.md`.
- **`NATIVE_RESOURCES`** fires on `skill`, `prompt template`, `extension`, `pi-mcp-extension` and `package` at weight 4, and loads `references/native-skills-and-extensions.md` and `references/mcp-and-third-party-packages.md`.
- **`CLASSIFIER`** fires on `classify`, `classifier`, `typed judgment` and `choice question` at weight 4. `RESOURCE_MAP` carries no entry for it, so it scores without selecting a path, and its surface stays in `SKILL.md`'s Classifier Calls prose.
- **`PATTERNS`** fires on `pattern`, `workflow`, `session`, `resume` and `continue` at weight 3, and loads `references/integration-patterns.md` and `references/cli-reference.md`.
- **`TEMPLATES`** fires on `template`, `prompt`, `how to ask` and `pi prompt` at weight 3, and loads `assets/prompt-templates.md` and `assets/prompt-quality-card.md`.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The packet's deterministic routing detail: the fan-out fallback, the prerequisite probe, the loading levels, the provider-specific intent dictionaries and the call sequence that reads them.

> **Fan-out fallback:** a deep-loop lineage that pins no model runs **DeepSeek V4.1 Flash**. The family is named here on purpose, without a version or an effort tier, so this line does not go stale when the family ships a point release; the runner resolves the current id. A drift test keeps the two in the same family.

### Prerequisite Detection

Run this probe before every dispatch. Do not build a command when it fails.

~~~bash
command -v pi || echo "Not installed. Install @earendil-works/pi-coding-agent before dispatch."
~~~

The pinned contract confirms the binary version used for the contract run and the headless entry point. For exact flags and observed failure behavior, load [cli-reference.md](./references/cli-reference.md).

### Resource Loading Levels

| Level | Load when | Resources |
|---|---|---|
| ALWAYS | Every Pi route | references/cli-reference.md, assets/prompt-quality-card.md |
| CONDITIONAL | Task names the matching surface | One or more intent-mapped references |
| ON_DEMAND | The operator asks for templates or package detail | assets/prompt-templates.md, native-skills-and-extensions.md, mcp-and-third-party-packages.md |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md)):

```python
INTENT_SIGNALS = {
    "GENERATION": {"weight": 4, "keywords": ["generate", "create", "build", "write code", "pi coding agent"]},
    "REVIEW": {"weight": 4, "keywords": ["review", "audit", "bug", "second opinion", "cross-validate"]},
    "HEADLESS": {"weight": 4, "keywords": ["pi cli", "pi agent", "headless", "print mode", "json event"]},
    "RPC": {"weight": 4, "keywords": ["rpc", "stdin", "stdout", "jsonl", "persistent process"]},
    "AGENT_DELEGATION": {"weight": 4, "keywords": ["delegate", "built-in tools", "tool allowlist", "agent bridge"]},
    "NATIVE_RESOURCES": {"weight": 4, "keywords": ["skill", "prompt template", "extension", "pi-mcp-extension", "package"]},
    "CLASSIFIER": {"weight": 4, "keywords": ["classify", "classifier", "typed judgment", "choice question"]},
    "PATTERNS": {"weight": 3, "keywords": ["pattern", "workflow", "session", "resume", "continue"]},
    "TEMPLATES": {"weight": 3, "keywords": ["template", "prompt", "how to ask", "pi prompt"]},
}

# CLASSIFIER is a signal only: it loads no resource of this skill.
NO_LOAD_INTENTS = ("CLASSIFIER",)

RESOURCE_MAP = {
    "GENERATION": ["references/cli-reference.md", "assets/prompt-templates.md"],
    "REVIEW": ["references/integration-patterns.md", "references/cli-reference.md"],
    "HEADLESS": ["references/cli-reference.md", "assets/prompt-templates.md"],
    "RPC": ["references/cli-reference.md", "references/integration-patterns.md"],
    "AGENT_DELEGATION": ["references/agent-delegation.md", "references/integration-patterns.md"],
    "NATIVE_RESOURCES": ["references/native-skills-and-extensions.md", "references/mcp-and-third-party-packages.md"],
    "PATTERNS": ["references/integration-patterns.md", "references/cli-reference.md"],
    "TEMPLATES": ["assets/prompt-templates.md", "assets/prompt-quality-card.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "mcp extension", "native skills"],
    "ON_DEMAND": ["references/native-skills-and-extensions.md", "references/mcp-and-third-party-packages.md", "assets/prompt-templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm that the user wants Pi rather than another cli-X mode",
    "Confirm whether the task is print, JSON, RPC, or interactive",
    "Confirm whether project-local resources may be trusted",
    "Confirm the required verification command before dispatch",
]
```

**Call sequence** — `route_pi_resources(task)` runs on the shared helpers `discover_markdown_resources()` and `_guard_in_skill()`, documented once in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md) with `<PROVIDER>` = `pi`.
