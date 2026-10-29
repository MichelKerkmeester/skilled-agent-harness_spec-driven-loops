---
title: "Claude Code CLI Orchestrator Router"
description: "Sibling router for cli-claude-code: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-claude-code router"
  - "cli-claude-code routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# Claude Code CLI Orchestrator Router

The machine router for [`SKILL.md`](./SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request that names Claude Code, the `claude` CLI, extended thinking or a deep-reasoning handoff reaches this skill, and so does one asking for surgical code editing, schema-validated JSON, a second-AI code review, an agent-delegated task or a cost-capped background run. Those signals select from the flag and capability references in `references/`, the prompt card and templates in `assets/`, and the hub [`ROUTER.md`](../ROUTER.md) that names the leaves a dispatch starts from. A session already running inside Claude Code never reaches this router, because the self-invocation guard refuses it first.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **DEEP_REASONING** — "reason / think / analyze / trade-off / architecture / extended thinking / root cause / pros and cons / step by step / weigh the options" requests load `references/cli-reference.md` and `references/claude-tools.md`, the flags an Opus reasoning dispatch needs plus the capability comparison that justifies it.
- **CODE_EDITING** — "edit / refactor / modify / fix / surgical edit / diff-based / rewrite / multi-file edit / preserve existing patterns" requests load `references/cli-reference.md` and `assets/prompt-templates.md`, the invocation flags before the prompt shaped for a diff-based edit.
- **STRUCTURED_OUTPUT** — "json / schema / structured / extract / validate output / --json-schema / machine-readable / guaranteed structure" requests load `references/cli-reference.md` and `references/claude-tools.md`, for the `--json-schema` flag and the only capability that makes the delegation worth it.
- **REVIEW** — "review / audit / security / quality / second opinion / cross-validate / pre-merge / double-check" requests load `references/integration-patterns.md` and `references/agent-delegation.md`, the cross-AI review pattern plus the `review` agent that runs it read-only.
- **AGENT_DELEGATION** — "delegate / agent / background / parallel / offload / plan mode / read-only exploration / hand off" requests load `references/agent-delegation.md` and `references/integration-patterns.md`, the roster that picks the agent and the pattern that hands the work over.
- **TEMPLATES** — "template / prompt / how to ask / how do I phrase / wording / boilerplate" requests load `assets/prompt-templates.md` and `references/cli-reference.md`, a ready-made prompt before the flags it is paired with.
- **PATTERNS** — "pattern / workflow / orchestrate / session / continue / resume / cross-ai / pick up where we left off" requests load `references/integration-patterns.md` and `references/cli-reference.md`, where session continuity and orchestration meet.
- **DESIGN** — "sk-design-md-generator / extract design system / generate design.md / style reference / design tokens / css extraction" requests load no file here on purpose: the intent is a handoff, so it routes the work out to `sk-design-md-generator` and `RESOURCE_MAP` keeps no DESIGN entry.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

This section holds the packet's prerequisite probe, self-invocation guard, loading levels, intent dictionaries and call sequence.

### Prerequisite Detection

```bash
# Verify Claude Code CLI is available before routing
command -v claude || echo "Not installed. Run: npm install -g @anthropic-ai/claude-code"

# SELF-INVOCATION GUARD: inside Claude Code, never shell out to claude. Dispatch a native subagent (Agent tool); it inherits the session's effort, and an agent definition's `effort` field sets a different one.
[ -n "$CLAUDECODE" ] && echo "ERROR: Already inside Claude Code session. Do not self-invoke."
```

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside Claude Code."""
    # Layer 1: env var lookup — Claude Code sets CLAUDECODE on session start
    if os.environ.get('CLAUDECODE'):
        return ('env', 'CLAUDECODE')
    # Layer 2: process ancestry — claude in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/claude' in ancestry or 'claude ' in ancestry:
            return ('ancestry', 'claude')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe
    state_dir = os.path.expanduser('~/.claude/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    refuse(
        "Self-invocation refused: this agent is already running inside Claude Code. "
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

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md)):

```python
INTENT_SIGNALS = {
    "DEEP_REASONING":    {"weight": 4, "keywords": ["reason", "think", "analyze", "trade-off", "architecture", "extended thinking", "chain-of-thought", "root cause", "root-cause", "figure out why", "weigh the options", "pros and cons", "algorithm design", "architectural", "chain of thought", "extended-thinking", "step by step", "deep dive", "reasoning", "thinking through", "analysis", "trade-offs", "in-depth", "thorough", "carefully consider", "dig into", "get to the bottom of", "understand why", "evaluate the options", "unpack this", "difficult decision", "hard choice", "which direction", "long-term implications", "multiple factors", "nuanced", "compare and contrast", "make the call", "downstream effects", "well-thought-out"]},
    "CODE_EDITING":      {"weight": 4, "keywords": ["edit", "refactor", "modify", "fix", "change code", "surgical edit", "diff-based", "update the code", "rewrite", "restructure", "rename", "patch", "clean up", "rework", "multi-file edit", "diff based", "preserve existing patterns", "coordinated changes"]},
    "STRUCTURED_OUTPUT": {"weight": 4, "keywords": ["json", "schema", "structured", "extract", "parse", "validate output", "--json-schema", "machine-readable", "typed output", "well-formed", "extraction", "guaranteed structure", "pipeline integration", "return format", "field mapping"]},
    "REVIEW":            {"weight": 4, "keywords": ["review", "audit", "security", "quality", "second opinion", "cross-validate", "sanity check", "vulnerability", "pre-merge", "double-check", "look over", "flag concerns", "catch bugs", "spot issues"]},
    "AGENT_DELEGATION":  {"weight": 4, "keywords": ["delegate", "agent", "background", "parallel", "offload", "claude agent", "hand off", "farm out", "dispatch to", "read-only exploration", "plan mode", "spin off", "run independently"]},
    "TEMPLATES":         {"weight": 3, "keywords": ["template", "prompt", "how to ask", "claude prompt", "how do I phrase", "how should I word", "phrasing", "wording", "boilerplate"]},
    "PATTERNS":          {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session", "continue", "resume", "orchestration", "cross-ai", "conversation history", "pick up where we left off", "carry over context", "multi-step flow"]},
    # WHY: DESIGN is a deliberate cross-skill handoff, not an in-skill resource intent — when design
    # keywords fire, this skill's job is to route the work AWAY to sk-design-md-generator rather than
    # load local markdown. RESOURCE_MAP intentionally has no DESIGN entry and never will; the durable
    # sk-design-md-generator loading contract lives in the "Design Standards Loading" rule and the
    # DESIGN_DISPATCH_MANIFEST rule (Section 4 RULES), not in a same-skill reference file.
    "DESIGN":            {"weight": 4, "keywords": ["sk-design-md-generator", "extract design system", "generate design.md", "style reference", "design tokens", "css extraction", "tokens.json"]},
}

# DESIGN is a signal only: it loads no resource of this skill.
NO_LOAD_INTENTS = ("DESIGN",)

RESOURCE_MAP = {
    "DEEP_REASONING":    ["references/cli-reference.md", "references/claude-tools.md"],
    "CODE_EDITING":      ["references/cli-reference.md", "assets/prompt-templates.md"],
    "STRUCTURED_OUTPUT": ["references/cli-reference.md", "references/claude-tools.md"],
    "REVIEW":            ["references/integration-patterns.md", "references/agent-delegation.md"],
    "AGENT_DELEGATION":  ["references/agent-delegation.md", "references/integration-patterns.md"],
    "TEMPLATES":         ["assets/prompt-templates.md", "references/cli-reference.md"],
    "PATTERNS":          ["references/integration-patterns.md", "references/cli-reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "extended thinking", "json schema", "claude agent", "claude prompt", "diff-based edit"],
    "ON_DEMAND": ["references/claude-tools.md", "assets/prompt-templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Claude Code CLI specifically?",
    "Does the task benefit from deep reasoning or extended thinking?",
    "Is structured JSON output needed (--json-schema)?",
    "Would surgical code editing or agent delegation help?",
]
```

The shared helper call sequence this provider runs — `discover_markdown_resources()`, then `_guard_in_skill()` with the intent scoring, the routing key and the `ALWAYS` tier, then the conditional and on-demand loads and the `UNKNOWN_FALLBACK` — is stated once in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md).
The `route_claude_code_resources(task)` function body lives in that file too — substitute `<PROVIDER>` = `claude_code`.
