---
title: "Devin CLI Orchestrator - Cross-AI Task Delegation Router"
description: "Sibling router for cli-devin: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-devin router"
  - "cli-devin routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Devin CLI Orchestrator - Cross-AI Task Delegation Router

The machine router for [`SKILL.md`](../../../.skilled/skills/cli-external-orchestration/cli-devin/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

Requests reach this skill when they name `devin`, Cognition, an autonomous SWE dispatch, a cloud handoff through `/handoff` or a subagent, and when the task wants a second AI perspective, a model offered only through Devin (DeepSeek, GLM-5.2, GPT-5.6 Luna Max, Grok, SWE-2) or parallel code generation. It routes to six guides under `references/`, from the CLI reference and the integration patterns through devin-tools, agent delegation, cloud handoff and the provider catalog, and to the two `assets/` files that carry the prompt-quality card and the copy-paste prompt templates. The CLI reference and the quality card load on every invocation, and every other family waits for an intent to select it.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`GENERATION`** fires on `generate`, `create`, `build`, `write code` and `devin create` at weight 4. It loads `references/cli-reference.md` and `assets/prompt-templates.md`.
- **`REVIEW`** fires on `review`, `audit`, `security`, `bug`, `second opinion` and `cross-validate` at weight 4. It loads `references/integration-patterns.md` and `references/agent-delegation.md`.
- **`RESEARCH`** fires on `search`, `latest`, `current`, `what's new`, `web research`, `browse` and `explore` at weight 4. It loads `references/devin-tools.md` and `assets/prompt-templates.md`.
- **`ARCHITECTURE`** fires on `architecture`, `codebase`, `investigate`, `dependencies` and `analyze project` at weight 3. It loads `references/devin-tools.md` and `references/agent-delegation.md`.
- **`AGENT_DELEGATION`** fires on `delegate`, `subagent`, `agent`, `background`, `parallel`, `offload` and `run_subagent` at weight 4. It loads `references/agent-delegation.md` and `references/integration-patterns.md`.
- **`CLOUD_HANDOFF`** fires on `handoff`, `hand off`, `cloud devin`, `long-running`, `ci validation`, `browser` and `vm` at weight 5. It loads `references/cloud-handoff.md` and `references/cli-reference.md`.
- **`TEMPLATES`** fires on `template`, `prompt`, `how to ask` and `devin prompt` at weight 3. It loads `assets/prompt-templates.md` and `references/cli-reference.md`.
- **`PATTERNS`** fires on `pattern`, `workflow`, `orchestrate`, `session`, `resume` and `continue` at weight 3. It loads `references/integration-patterns.md` and `references/cli-reference.md`.
- **`DESIGN`** fires on `sk-design-md-generator`, `extract design system`, `generate design.md`, `style reference`, `design tokens`, `css extraction` and `tokens.json` at weight 4. It selects no `RESOURCE_MAP` entry by design: the intent is scored and reported, and the durable design-loading contract lives in the Design Standards Loading rule and the dispatch manifest, not in a skill-local markdown path.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the packet's probe, guard, loading levels, intent map and call sequence.

### Prerequisite Detection

```bash
# Verify Devin CLI is available before routing
command -v devin || echo "Not installed. Run: devin setup or curl -fsSL https://devin.ai/install | bash"
```

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside Devin."""
    # Layer 1: env var lookup — Devin sets DEVIN_PROJECT_DIR on session start
    if os.environ.get('DEVIN_PROJECT_DIR'):
        return ('env', 'DEVIN_PROJECT_DIR')
    # Layer 2: process ancestry — devin in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/devin' in ancestry or 'devin ' in ancestry or ancestry.strip().endswith('devin'):
            return ('ancestry', 'devin')
    except subprocess.SubprocessError:
        pass
    # Layer 3: active-session credentials probe (session-in-flight heuristic)
    creds = os.path.expanduser('~/.local/share/devin/credentials.toml')
    if os.path.exists(creds):
        # Credentials file existing alone is not conclusive (persists after logout),
        # but paired with DEVIN_PROJECT_DIR or ancestry it confirms an active session.
        pass
    return None

if detect_self_invocation():
    refuse(
        "Self-invocation refused: this agent is already running inside Devin. "
        "Use a sibling cli-* skill or a fresh shell session in a different runtime to dispatch a different model."
    )
```

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ----------------------- | ------------------------------ |
| ALWAYS      | Every skill invocation  | `references/cli-reference.md`, `assets/prompt-quality-card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Call Sequence

The `discover_markdown_resources()` and `_guard_in_skill()` helpers, the six steps they run and `route_devin_resources(task)` are documented once in [`shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md); substitute `<PROVIDER>` = `devin`, whose routing key falls back to `devin`.

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md)):

```python
INTENT_SIGNALS = {
    "GENERATION":        {"weight": 4, "keywords": ["generate", "create", "build", "write code", "devin create"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "security", "bug", "second opinion", "cross-validate"]},
    "RESEARCH":          {"weight": 4, "keywords": ["search", "latest", "current", "what's new", "web research", "browse", "explore"]},
    "ARCHITECTURE":      {"weight": 3, "keywords": ["architecture", "codebase", "investigate", "dependencies", "analyze project"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["delegate", "subagent", "agent", "background", "parallel", "offload", "run_subagent"]},
    "CLOUD_HANDOFF":     {"weight": 5, "keywords": ["handoff", "hand off", "cloud devin", "long-running", "ci validation", "browser", "vm"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "devin prompt"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session", "resume", "continue"]},
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
    "RESEARCH":          ["references/devin-tools.md", "assets/prompt-templates.md"],
    "ARCHITECTURE":      ["references/devin-tools.md", "references/agent-delegation.md"],
    "AGENT_DELEGATION":  ["references/agent-delegation.md", "references/integration-patterns.md"],
    "CLOUD_HANDOFF":     ["references/cloud-handoff.md", "references/cli-reference.md"],
    "TEMPLATES":         ["assets/prompt-templates.md", "references/cli-reference.md"],
    "PATTERNS":          ["references/integration-patterns.md", "references/cli-reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "devin agent", "devin prompt", "cloud handoff", "subagent", "review command", "continue session"],
    "ON_DEMAND": ["references/devin-tools.md", "references/cloud-handoff.md", "assets/prompt-templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Devin CLI specifically?",
    "Does the task benefit from a second AI perspective?",
    "Is cloud handoff or subagent delegation needed?",
    "Would a specific model available through Devin fit the task?",
]
```
