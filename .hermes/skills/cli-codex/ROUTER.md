---
title: "Codex CLI Orchestrator - Cross-AI Task Delegation Router"
description: "Sibling router for cli-codex: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-codex router"
  - "cli-codex routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Codex CLI Orchestrator - Cross-AI Task Delegation Router

The machine router for [`SKILL.md`](../../../.skilled/skills/cli-external-orchestration/cli-codex/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when the prompt names Codex, the Codex CLI or `codex exec`, when the `cli-external-orchestration` hub's `cli-codex` mode signal selects this packet, and when the ask is a cross-AI second opinion, a diff-aware review, live web research through `codex --search exec`, a codebase architecture walk, parallel or backgrounded generation, or a specialized generation such as a test suite, a code translation or batch docs. A session already running inside Codex never routes here, because the self-invocation guard refuses it.
The resource families it selects from are the intent-mapped guides under `references/` — the CLI reference, integration patterns, built-in tools, hook contract, agent delegation and provider roster — and the prompt material under `assets/`: the ALWAYS-loaded quality card plus the copy-paste templates.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`GENERATION`** — fires on `generate`, `create`, `build`, `write code` and `codex create` at weight 4, and loads `references/cli-reference.md` and `assets/prompt-templates.md`.
- **`REVIEW`** — fires on `review`, `audit`, `security`, `bug`, `second opinion`, `cross-validate` and `/review` at weight 4, and loads `references/integration-patterns.md` and `references/agent-delegation.md`.
- **`RESEARCH`** — fires on `search`, `latest`, `current`, `what's new`, `web research`, `--search` and `browse` at weight 4, and loads `references/codex-tools.md` and `assets/prompt-templates.md`.
- **`ARCHITECTURE`** — fires on `architecture`, `codebase`, `investigate`, `dependencies` and `analyze project` at weight 3, and loads `references/codex-tools.md` and `references/agent-delegation.md`.
- **`AGENT_DELEGATION`** — fires on `delegate`, `agent`, `background`, `parallel`, `offload` and `codex agent` at weight 4, and loads `references/agent-delegation.md` and `references/integration-patterns.md`.
- **`TEMPLATES`** — fires on `template`, `prompt`, `how to ask` and `codex prompt` at weight 3, and loads `assets/prompt-templates.md` and `references/cli-reference.md`.
- **`PATTERNS`** — fires on `pattern`, `workflow`, `orchestrate`, `session`, `resume` and `fork` at weight 3, and loads `references/integration-patterns.md` and `references/cli-reference.md`.
- **`HOOKS`** — fires on `hook`, `hooks`, `advisor brief`, `startup context`, `userpromptsubmit`, `sessionstart` and `codex_hooks` at weight 4, and loads `references/hook-contract.md` and `references/cli-reference.md`.
- **`DESIGN`** — fires on `sk-design-md-generator`, `extract design system`, `generate design.md`, `style reference`, `design tokens`, `css extraction` and `tokens.json` at weight 4. It carries no map entry of its own, because it is an intent signal only: the durable `sk-design-md-generator` loading contract lives in the always-fires Design Standards Loading rule and the dispatch manifest it injects, and the resource map stays limited to same-skill markdown paths.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.


This section holds the packet's prerequisite probe, self-invocation guard, loading levels, intent dictionaries and call sequence.

### Prerequisite Detection

```bash
# Verify Codex CLI is available before routing
command -v codex || echo "Not installed. Run: npm i -g @openai/codex"
```

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside Codex."""
    # Layer 1: env var lookup — Codex sets CODEX_SESSION_ID and CODEX_* vars
    for key in os.environ:
        if key == 'CODEX_SESSION_ID' or key.startswith('CODEX_'):
            return ('env', key)
    # Layer 2: process ancestry — codex in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/codex' in ancestry or 'codex ' in ancestry:
            return ('ancestry', 'codex')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe
    state_dir = os.path.expanduser('~/.codex/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    refuse(
        "Self-invocation refused: this agent is already running inside Codex. "
        "Use a sibling cli-* skill or a fresh shell session in a different runtime to dispatch a different model."
    )
```

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ----------------------- | ------------------------------ |
| ALWAYS      | Every skill invocation  | `references/cli-reference.md`, `assets/prompt-quality-card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md)):

```python
INTENT_SIGNALS = {
    "GENERATION":        {"weight": 4, "keywords": ["generate", "create", "build", "write code", "codex create"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "security", "bug", "second opinion", "cross-validate", "/review"]},
    "RESEARCH":          {"weight": 4, "keywords": ["search", "latest", "current", "what's new", "web research", "--search", "browse"]},
    "ARCHITECTURE":      {"weight": 3, "keywords": ["architecture", "codebase", "investigate", "dependencies", "analyze project"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["delegate", "agent", "background", "parallel", "offload", "codex agent"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "codex prompt"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session", "resume", "fork"]},
    "HOOKS":             {"weight": 4, "keywords": ["hook", "hooks", "advisor brief", "startup context", "userpromptsubmit", "sessionstart", "codex_hooks"]},
    # WHY: DESIGN is an intent signal only. The durable sk-design-md-generator loading contract lives in the
    # always-fires Design Standards Loading rule and the dispatch manifest; RESOURCE_MAP stays
    # limited to same-skill markdown paths.
    "DESIGN":            {"weight": 4, "keywords": ["sk-design-md-generator", "extract design system", "generate design.md", "style reference", "design tokens", "css extraction", "tokens.json"]},
}

# DESIGN is a signal only: it loads no resource of this skill.
NO_LOAD_INTENTS = ("DESIGN",)

RESOURCE_MAP = {
    "GENERATION":        ["references/cli-reference.md", "assets/prompt-templates.md"],
    "REVIEW":            ["references/integration-patterns.md", "references/agent-delegation.md"],
    "RESEARCH":          ["references/codex-tools.md", "assets/prompt-templates.md"],
    "ARCHITECTURE":      ["references/codex-tools.md", "references/agent-delegation.md"],
    "AGENT_DELEGATION":  ["references/agent-delegation.md", "references/integration-patterns.md"],
    "TEMPLATES":         ["assets/prompt-templates.md", "references/cli-reference.md"],
    "PATTERNS":          ["references/integration-patterns.md", "references/cli-reference.md"],
    "HOOKS":             ["references/hook-contract.md", "references/cli-reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "codex agent", "codex prompt", "web research", "review command", "fork session", "hook contract"],
    "ON_DEMAND": ["references/codex-tools.md", "assets/prompt-templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Codex CLI specifically?",
    "Does the task benefit from a second AI perspective?",
    "Is real-time web information needed (--search)?",
    "Would codebase-wide analysis or /review workflow help?",
]
```

The shared helper call sequence this provider runs — `discover_markdown_resources()`, then `_guard_in_skill()` with the intent scoring, the routing key and the `ALWAYS` tier, then the conditional and on-demand loads and the `UNKNOWN_FALLBACK` — is stated once in [`shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md).
The `route_codex_resources(task)` function body lives in that file too — substitute `<PROVIDER>` = `codex`.
