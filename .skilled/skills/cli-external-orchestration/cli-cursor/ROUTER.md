---
title: "Cursor CLI Orchestrator Router"
description: "Sibling router for cli-cursor: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-cursor router"
  - "cli-cursor routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Cursor CLI Orchestrator Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request reaches this skill when it names `cursor-agent`, Composer, a Cursor plan or ask exploration, Cursor's native worktree or cloud-worker surface, or an explicit Grok (4.5, 4.6, 4.7) or GLM 5.2 dispatch, since those are the only non-Composer families on the enforced allowlist. The router selects from four resource families: the ALWAYS-loaded CLI command reference and prompt-quality card, the prompt templates, the integration and delegation patterns, and the Cursor-unique surface docs for worktrees, the cloud worker, hooks and the shared editor config. A cross-AI second opinion, an independent implementation attempt and a read-only architecture question all arrive here, while a task whose context is already loaded, a simple one-shot and any dispatch attempted from inside Cursor itself do not.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **`GENERATION`** — `generate`, `create`, `build`, `write code` and `cursor create` requests at weight 4 load `references/cli-reference.md` and `assets/prompt-templates.md`, so the command shape and a copy-paste prompt arrive together.
- **`REVIEW`** — `review`, `audit`, `bug`, `second opinion` and `cross-validate` requests at weight 4 load `references/integration-patterns.md` and `references/agent-delegation.md`, the pattern for a second-pass dispatch and the execution-mode roster it runs in.
- **`COMPOSER`** — `composer`, `cursor's own model`, `auto router` and `cursor native model` requests at weight 4 load `references/cli-reference.md` and `assets/prompt-quality-card.md`, because the allowlist and the prompt contract decide a Composer dispatch.
- **`PLAN_ASK`** — `plan mode`, `ask mode`, `read-only`, `just explore` and `don't write anything` requests at weight 4 load `references/cli-reference.md` and `references/agent-delegation.md`, the two documents that say which mode is read-only and what each mode may do.
- **`AGENT_DELEGATION`** — `delegate`, `agent`, `background`, `cursor agent` and `subagent` requests at weight 4 load `references/agent-delegation.md` and `references/integration-patterns.md`, the Cursor-side delegation contract first and the cross-AI pattern after it.
- **`TEMPLATES`** — `template`, `prompt`, `how to ask` and `cursor prompt` requests at weight 3 load `assets/prompt-templates.md` and `references/cli-reference.md`.
- **`PATTERNS`** — `pattern`, `workflow`, `orchestrate`, `session`, `resume` and `continue` requests at weight 3 load `references/integration-patterns.md` and `references/cli-reference.md`.
- **`HOOKS`** — `hook`, `hooks`, `hooks.json`, `startup context`, `sessionstart` and `beforesubmitprompt` requests at weight 4 load `references/hook-contract.md` and `references/shared-editor-config.md`, since the hook surface and the config surface a dispatch inherits are one question.
- **`UNIQUE_SURFACES`** — `worktree`, `cloud worker`, `plugin marketplace`, `shared config` and `editor config` requests at weight 3 load `references/cursor-tools.md` and `references/shared-editor-config.md`, the opt-in surfaces and the isolation they need.
- **`DESIGN`** — `sk-design-md-generator`, `extract design system`, `generate design.md`, `style reference`, `design tokens`, `css extraction` and `tokens.json` requests at weight 4 declare no skill-local resource: the durable design loading contract lives in the always-fires Design Standards Loading rule and the dispatch manifest, so this key widens what reaches the skill without naming a file here.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the packet's probe, guard, loading levels, intent map and call sequence.

### Prerequisite Detection

```bash
# Verify Cursor CLI is available before routing
command -v cursor-agent || echo "Not installed. Run: curl https://cursor.com/install -fsS | bash"
```

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside cursor-agent."""
    # Layer 1: env var lookup — CURSOR_AGENT=1 is set unconditionally whenever the
    # current process runs under cursor-agent (confirmed live); CURSOR_CONVERSATION_ID
    # is the confirmed session-id marker (matches --output-format json's session_id).
    if os.environ.get('CURSOR_AGENT') == '1':
        return ('env', 'CURSOR_AGENT')
    if os.environ.get('CURSOR_CONVERSATION_ID'):
        return ('env', 'CURSOR_CONVERSATION_ID')
    # Layer 2: process ancestry — cursor-agent (the canonical binary, never the
    # bare "agent" alias, which would false-positive on unrelated commands) in
    # the parent tree.
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/cursor-agent' in ancestry or 'cursor-agent ' in ancestry:
            return ('ancestry', 'cursor-agent')
    except subprocess.SubprocessError:
        pass
    # Layer 3: best-effort session probe. No lock-file convention is documented
    # for Cursor CLI (unlike Codex's ~/.codex/state/<id>/lock) — this layer is
    # honestly weaker than the siblings' layer 3. Absence of a detected signal
    # here is NOT proof no session is active.
    state_dir = os.path.expanduser('~/.cursor')
    if os.path.isdir(state_dir) and os.environ.get('CURSOR_INVOKED_AS'):
        return ('state-probe', 'CURSOR_INVOKED_AS')
    return None

if detect_self_invocation():
    refuse(
        "Self-invocation refused: this agent is already running inside Cursor CLI. "
        "Use a sibling cli-* skill or a fresh shell session in a different runtime to dispatch a different model."
    )
```

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ------------------------ | ------------------------------- |
| ALWAYS      | Every skill invocation   | `references/cli-reference.md`, `assets/prompt-quality-card.md` |
| CONDITIONAL | If intent signals match  | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request | Extended templates and patterns |

### Call Sequence

The `discover_markdown_resources()` and `_guard_in_skill()` helpers, the six steps they run and `route_cursor_resources(task)` are documented once in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md); substitute `<PROVIDER>` = `cursor`, whose routing key falls back to `cursor-agent`.

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md)):

```python
INTENT_SIGNALS = {
    "GENERATION":        {"weight": 4, "keywords": ["generate", "create", "build", "write code", "cursor create"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "bug", "second opinion", "cross-validate"]},
    "COMPOSER":          {"weight": 4, "keywords": ["composer", "cursor's own model", "auto router", "cursor native model"]},
    "PLAN_ASK":          {"weight": 4, "keywords": ["plan mode", "ask mode", "read-only", "just explore", "don't write anything"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["delegate", "agent", "background", "cursor agent", "subagent"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "cursor prompt"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session", "resume", "continue"]},
    "HOOKS":             {"weight": 4, "keywords": ["hook", "hooks", "hooks.json", "startup context", "sessionstart", "beforesubmitprompt"]},
    "UNIQUE_SURFACES":   {"weight": 3, "keywords": ["worktree", "cloud worker", "plugin marketplace", "shared config", "editor config"]},
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
    "COMPOSER":          ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "PLAN_ASK":          ["references/cli-reference.md", "references/agent-delegation.md"],
    "AGENT_DELEGATION":  ["references/agent-delegation.md", "references/integration-patterns.md"],
    "TEMPLATES":         ["assets/prompt-templates.md", "references/cli-reference.md"],
    "PATTERNS":          ["references/integration-patterns.md", "references/cli-reference.md"],
    "HOOKS":             ["references/hook-contract.md", "references/shared-editor-config.md"],
    "UNIQUE_SURFACES":   ["references/cursor-tools.md", "references/shared-editor-config.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "worktree", "cloud worker", "plugin marketplace", "hook contract", "shared config"],
    "ON_DEMAND": ["references/cursor-tools.md", "references/shared-editor-config.md", "assets/prompt-templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Cursor CLI specifically?",
    "Does the task benefit from a second AI perspective or Cursor's own Composer model?",
    "Does the task want read-only plan/ask exploration instead of a write-capable dispatch?",
    "Would Cursor's worktree isolation or cloud worker genuinely help (opt-in, not default)?",
]
```
