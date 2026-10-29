---
title: "OpenCode CLI Orchestrator Router"
description: "Sibling router for cli-opencode: the intent signals, the resource map and the no-match checklist a reader parses first."
trigger_phrases:
  - "cli-opencode router"
  - "cli-opencode routing"
importance_tier: normal
contextType: general
version: 1.0.0.0
router_state: active
skill_pointer: SKILL.md
---

# OpenCode CLI Orchestrator Router

The machine router for [`SKILL.md`](../../../.skilled/skills/cli-external-orchestration/cli-opencode/SKILL.md). `SKILL.md` keeps the short routing prose and the
link that points here; this file holds the declaration a reader parses to decide what loads.

---

## 1. OVERVIEW

A request reaches this skill when it names OpenCode, `opencode run`, a parallel detached session, a
cross-repo target, or a task that needs the full plugin, skill and MCP runtime in a one-shot dispatch.
It routes to the always-loaded call reference and prompt-quality card, then to the intent-mapped
references on the CLI contract, integration patterns, agent delegation and unique value props, and to
the prompt and template assets.

The router answers one question: given a request, which skill-local resources load, in what order, and
what happens when nothing matches. Every path below stays inside this skill folder, and no resource
loads before an intent selects it.

---

## 2. INTENT MODEL

- **EXTERNAL_DISPATCH** — fires on "delegate to opencode", "opencode run", "from claude code", "full plugin runtime", "hand this off to opencode". Loads `references/cli-reference.md` and `references/integration-patterns.md`.
- **PARALLEL_DETACHED** — fires on "parallel detached", "ablation suite", "worker farm", "spawn detached", "share url". Loads `references/integration-patterns.md` and `assets/prompt-templates.md`.
- **CROSS_AI_HANDBACK** — fires on "spec kit", "cross-ai handback", "project's spec folders", "use the skill advisor". Loads `references/integration-patterns.md` and `references/opencode-tools.md`.
- **AGENT_DISPATCH** — fires on "delegate", "agent", "deep-research", "deep-review", "ai-council", "spawn an agent". Loads `references/agent-delegation.md` and `assets/prompt-templates.md`.
- **CROSS_REPO** — fires on "cross-repo", "different repo", "--dir", "remote opencode server", "--attach". Loads `references/cli-reference.md` and `references/opencode-tools.md`.
- **TEMPLATES** — fires on "template", "prompt", "how to ask", "copy-paste template", "prompt quality". Loads `assets/prompt-templates.md` and `references/cli-reference.md`.
- **PATTERNS** — fires on "pattern", "workflow", "session continue", "resume session", "integration pattern". Loads `references/integration-patterns.md` and `references/cli-reference.md`.
- **DESIGN** — fires on "sk-design-md-generator", "extract design system", "style reference", "design tokens". Loads nothing from `RESOURCE_MAP`: it is a deliberate hand-off to `sk-design-md-generator`, carried by the ALWAYS Design Standards Loading rule and the dispatch manifest.

---

## 3. MACHINE ROUTER

The one machine-readable projection of the intent model above, written as `## MACHINE ROUTER` so every
reader finds it. This section is the last in the file, and it holds the only pseudocode.

The routing detail the short summary leaves out: the prerequisite probe, the guard, the loading levels, the intent map and the call sequence.

### Prerequisite Detection

```bash
# Verify OpenCode CLI is available (opencode2 preferred, opencode accepted)
command -v opencode2 || command -v opencode || echo "Not installed. Run: brew install opencode (macOS) or curl -fsSL https://opencode.ai/install | bash"
```

Install steps, side-by-side setup for both versions and the capability delta between them: [`references/install-and-versions.md`](../../../.skilled/skills/cli-external-orchestration/cli-opencode/references/install-and-versions.md).

### Self-Invocation Guard (ADR-001)

Before any dispatch, run the layered ADR-001 detection:
- Layer 1: any `OPENCODE_*` env var.
- Layer 2: an `opencode` process ancestor.
- Layer 3: the best-effort `~/.opencode/state/<id>/lock` probe.
- Any positive means refuse unless the prompt carries explicit parallel-session keywords (use case 2), which permits a SEPARATE session id and state directory.
- Full bash + python detection: [`references/self-invocation-guard.md`](../../../.skilled/skills/cli-external-orchestration/cli-opencode/references/self-invocation-guard.md).
- Decision tree + refusal text: [`references/integration-patterns.md`](../../../.skilled/skills/cli-external-orchestration/cli-opencode/references/integration-patterns.md) §5.

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ----------------------- | ------------------------------ |
| ALWAYS      | Every skill invocation  | `references/cli-reference.md`, `assets/prompt-quality-card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router

The four smart-router patterns are the shared helpers `discover_markdown_resources()`, `_guard_in_skill()` and `load_if_available()`, with `UNKNOWN_FALLBACK` for a low score; they are written once in [`shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md), and the flat resource folders select from `RESOURCE_MAP` by intent.

```python
INTENT_SIGNALS = {
    "EXTERNAL_DISPATCH":  {"weight": 4, "keywords": ["delegate to opencode", "opencode run", "from claude code", "from opencode", "from copilot", "external runtime", "full plugin runtime", "hand this off to opencode", "hand off to opencode", "send this to opencode", "dispatch to opencode", "run this through opencode", "let opencode handle this", "opencode's full runtime", "full runtime dispatch", "one-shot dispatch", "invoke opencode", "kick this off in opencode", "have opencode take care of this", "get opencode to run this", "pass this over to opencode", "opencode has access to every tool", "opencode has the whole toolchain", "since opencode has all the plugins", "opencode can load every skill", "ask opencode to handle this", "opencode should handle this", "offload this to opencode", "outsource this to opencode", "forward this to opencode", "route this to opencode", "push this to opencode", "opencode has everything loaded", "opencode has the whole toolset", "opencode cli", "run externally", "full toolset", "handle this externally", "external ai assistant", "run in opencode", "hand off externally"]},
    "PARALLEL_DETACHED":  {"weight": 4, "keywords": ["parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", "share url", "share-url", "detached session", "separate session id", "own state directory", "spin up a new session", "background opencode session", "run this in the background", "fan out workers", "concurrent sessions", "isolated session", "run these in parallel", "spin off a few workers", "kick off several sessions at once", "run copies side by side", "fire off multiple runs at the same time", "farm this out to multiple workers", "run a bunch of these concurrently", "distribute the work across sessions", "batch this across sessions", "start several sessions at once", "spin up another instance", "new opencode instance", "run it as its own session", "own separate session", "side session", "run this independently", "additional worker", "background job", "separate instance", "own instance", "parallel run", "concurrent run", "session of its own", "spin up a worker", "worker pool", "run in parallel"]},
    "CROSS_AI_HANDBACK":  {"weight": 4, "keywords": ["spec kit", "spec-kit", "spec_kit", "code graph", "skill advisor", "cross-ai handback", "hand back to opencode", "bridge back to opencode", "opencode as a bridge", "non-anthropic cli", "project's spec folders", "structural code index", "use the skill advisor"]},
    "AGENT_DISPATCH":     {"weight": 4, "keywords": ["delegate", "agent", "deep-research", "deep-review", "ai-council", "review agent", "context agent", "dispatch an agent", "spawn an agent", "run a subagent", "invoke a subagent", "specialized subagent", "debug agent", "write agent"]},
    "CROSS_REPO":         {"weight": 3, "keywords": ["cross-repo", "different repo", "--dir", "another repository", "remote opencode", "different repository", "target repo", "other codebase", "separate repository", "remote opencode server", "--attach"]},
    "TEMPLATES":          {"weight": 3, "keywords": ["template", "prompt", "how to ask", "opencode prompt", "minimax", "MiniMax-M3", "tidd-ec", "prompt framework", "prompt template", "how do i phrase this", "copy-paste template", "prompt quality", "prompt craft", "costar framework", "example prompt"]},
    "PATTERNS":           {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session continue", "resume session", "integration pattern", "dispatch pattern", "continue the session", "resume a session", "session continuation"]},
    # WHY: DESIGN is an intent signal only — a deliberate cross-skill handoff to sk-design-md-generator,
    # not a same-skill resource bundle. It intentionally has NO RESOURCE_MAP entry: this skill
    # hands design work off rather than owning design reference docs. The durable sk-design-md-generator
    # loading contract lives in the always-fires Design Standards Loading rule and the dispatch
    # manifest (see ALWAYS rules 13-14); RESOURCE_MAP stays limited to same-skill markdown paths.
    "DESIGN":             {"weight": 4, "keywords": ["sk-design-md-generator", "extract design system", "generate design.md", "style reference", "design tokens", "css extraction", "tokens.json"]},
}

# DESIGN is a signal only: it loads no resource of this skill.
NO_LOAD_INTENTS = ("DESIGN",)

RESOURCE_MAP = {
    "EXTERNAL_DISPATCH":  ["references/cli-reference.md", "references/integration-patterns.md"],
    "PARALLEL_DETACHED":  ["references/integration-patterns.md", "assets/prompt-templates.md"],
    "CROSS_AI_HANDBACK":  ["references/integration-patterns.md", "references/opencode-tools.md"],
    "AGENT_DISPATCH":     ["references/agent-delegation.md", "assets/prompt-templates.md"],
    "CROSS_REPO":         ["references/cli-reference.md", "references/opencode-tools.md"],
    "TEMPLATES":          ["assets/prompt-templates.md", "references/cli-reference.md"],
    "PATTERNS":           ["references/integration-patterns.md", "references/cli-reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "opencode agent", "opencode prompt", "share url", "ablation", "worker farm", "self-invocation", "memory handback", "minimax", "MiniMax-M3", "tidd-ec"],
    "ON_DEMAND": ["references/opencode-tools.md", "assets/prompt-templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about OpenCode CLI specifically?",
    "Does the task need the project's full plugin / skill / MCP runtime?",
    "Is a parallel detached session what they want?",
    "Is a non-Anthropic CLI handing back to OpenCode for a spec-kit workflow?",
]
```

### Call Sequence

The call sequence is `route_opencode_resources(task)`; its helper bodies, from `discover_markdown_resources()` to `get_routing_key()`, are written once in [`shared-smart-router.md`](../../../.skilled/skills/system-spec-kit/references/cli/shared-smart-router.md) with `<PROVIDER>` set to `opencode`.
