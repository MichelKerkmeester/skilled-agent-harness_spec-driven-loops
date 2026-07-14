---
name: cli-claude-code
description: "Claude Code CLI executor for Anthropic-backed reasoning, edits, reviews, and structured cross-AI handoff."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.3.0.0
hard_rules:
  - id: non-interactive-permission-mode-risk
    check: non-interactive-permission-mode-risk
    message: "Non-interactive `claude -p` with acceptEdits + no TTY + a Bash-heavy prompt can deadlock on an unanswerable shell-permission prompt; run it sandboxed with `--dangerously-skip-permissions` or ensure the prompt needs no shell approval."
    severity: warn
---

<!-- Keywords: claude-code, claude-cli, anthropic, cross-ai, deep-reasoning, extended-thinking, code-editing, structured-output, agent-delegation, opus, sonnet, haiku -->

# Claude Code CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the Anthropic CLI binary (`claude`). If the agent currently reading this skill is itself running inside Claude Code (detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `claude` invocation.
>
> A running CLI skill never dispatches itself. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate Anthropic's Claude Code CLI from external AI assistants (OpenCode, Copilot, etc.) for tasks that benefit from deep extended thinking, surgical code editing, structured output with JSON schema validation, agent delegation, or persistent memory context.

**Core Principle**: The calling AI stays the conductor. Delegate to Claude Code for what it does best — deep reasoning, precise code editing, and structured analysis. Validate and integrate the output.

---

## 1. WHEN TO USE

### Activation Triggers

- **Deep Reasoning** — extended-thinking architectural decisions, multi-dimensional trade-off analysis, step-by-step algorithm design, root-cause analysis of subtle bugs.
- **Code Editing** — surgical diff-based edits, pattern-preserving refactors, and multi-file coordinated changes.
- **Structured Output** — `--json-schema`-validated output, machine-readable analysis, guaranteed-structure data extraction, pipeline integration.
- **Code Review** — second-AI security audits, extended-thinking architecture review, cross-AI validation, pre-merge quality gates.
- **Agent-Delegated Tasks** — specialized `.claude/agents/*.md` matches, `--permission-mode plan` read-only exploration, `@ai-council` planning, session continuity (`--continue`, `--resume`).
- **Background Processing** — long-running offloaded analysis, parallel generation/docs, batch processing with `--max-budget-usd` cost control.

### When NOT to Use

- **You ARE Claude Code already.** If your runtime is Claude Code (detection signal: `$CLAUDECODE` env var set, `claude` in process ancestry, or `~/.claude/state/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation.
- Simple, quick tasks where CLI overhead is not worth it.
- Tasks requiring interactive terminal UI (use `claude` directly instead).
- Context already loaded and understood by the calling AI.
- Tasks where Claude Code CLI is not installed.
- Real-time web search (Claude Code has no `--search` flag — use OpenCode).

---

## 2. SMART ROUTING


### Prerequisite Detection

```bash
# Verify Claude Code CLI is available before routing
command -v claude || echo "Not installed. Run: npm install -g @anthropic-ai/claude-code"

# SELF-INVOCATION GUARD: If you ARE Claude Code, do not use this skill — use native capabilities
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
| ALWAYS      | Every skill invocation  | `references/cli_reference.md`, `assets/prompt_quality_card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared_smart_router.md`](../../system-spec-kit/references/cli/shared_smart_router.md)):

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
    # keywords fire, this skill's job is to route the work AWAY to sk-design (the hub) rather than
    # load local markdown. RESOURCE_MAP intentionally has no DESIGN entry and never will; the durable
    # sk-design loading contract lives in the "Design Standards Loading" rule and the
    # DESIGN_DISPATCH_MANIFEST rule (Section 4 RULES), not in a same-skill reference file.
    "DESIGN":            {"weight": 4, "keywords": ["sk-design", "interface design", "frontend design", "visual design", "redesign the ui", "design foundations", "design tokens", "motion design", "micro-interactions", "design audit", "ui critique", "extract design system", "generate design.md"]},
}

RESOURCE_MAP = {
    "DEEP_REASONING":    ["references/cli_reference.md", "references/claude_tools.md"],
    "CODE_EDITING":      ["references/cli_reference.md", "assets/prompt_templates.md"],
    "STRUCTURED_OUTPUT": ["references/cli_reference.md", "references/claude_tools.md"],
    "REVIEW":            ["references/integration_patterns.md", "references/agent_delegation.md"],
    "AGENT_DELEGATION":  ["references/agent_delegation.md", "references/integration_patterns.md"],
    "TEMPLATES":         ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":          ["references/integration_patterns.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli_reference.md", "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "extended thinking", "json schema", "claude agent", "claude prompt", "diff-based edit"],
    "ON_DEMAND": ["references/claude_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Claude Code CLI specifically?",
    "Does the task benefit from deep reasoning or extended thinking?",
    "Is structured JSON output needed (--json-schema)?",
    "Would surgical code editing or agent delegation help?",
]
```

**Call sequence** (using shared helpers from `shared_smart_router.md`):

1. `discover_markdown_resources()` — recursively enumerate current `.md` files under existing `references/` and `assets/` folders at routing time.
2. `_guard_in_skill()` + `load_if_available()` — sandbox paths to this skill, reject non-markdown loads, skip missing files, and suppress duplicates.
3. `score_intents(task)` and `select_intents(scores, ambiguity_delta=1.0)` — preserve provider-specific weighted intent scoring and top-2 ambiguity handling.
4. `get_routing_key(task, intents)` — derive the provider routing key from task/provider context, then fall back to `claude_code`.
5. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
6. CONDITIONAL-load `RESOURCE_MAP[intent]`, ON_DEMAND-load keyword matches, and return a notice when no provider-specific knowledge base is available beyond always-load resources.

The `route_claude_code_resources(task)` function body lives in [`shared_smart_router.md`](../../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `claude_code`.

---

## 3. HOW IT WORKS

### Prerequisites

```bash
# Verify installation
command -v claude || echo "Not installed. Run: npm install -g @anthropic-ai/claude-code"

# Self-invocation guard
[ -n "$CLAUDECODE" ] && echo "ERROR: Already inside a Claude Code session — do not self-invoke"

# Authentication — OAuth (Claude subscription), no API key
claude auth login        # interactive OAuth (browser flow)
# claude setup-token     # non-interactive OAuth token for CI/CD
```

**Authentication**: cli-claude-code authenticates through the Claude subscription OAuth only — `claude auth login` (interactive browser flow) or `claude setup-token` (a non-interactive OAuth token for CI/CD). It does not use an `ANTHROPIC_API_KEY`.

### Provider Auth Pre-Flight (Claude Subscription OAuth)

**MANDATORY before any first dispatch in a session.** cli-claude-code authenticates through the Claude subscription OAuth only. If neither `claude auth login` nor a `claude setup-token` session is configured on this machine, a dispatch fails with `401 Unauthorized` mid-round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: capture OAuth status for routing
CLAUDE_AUTH=$(claude auth status 2>&1)
echo "$CLAUDE_AUTH" | grep -qi "authenticated\|logged in\|oauth\|setup-token" && CLAUDE_OAUTH_OK=1 || CLAUDE_OAUTH_OK=0
```

**Decision tree** (apply in order — first match wins):

| State | CLAUDE_OAUTH_OK | Action |
|-------|-----------------|--------|
| OAuth ready | 1 | Proceed with `claude -p "<prompt>" --model claude-sonnet-4-6 --output-format text` |
| Not authenticated | 0 | **ASK user** to run `claude auth login` — surface the command, do NOT dispatch. Never substitute an API key or a different model. |

**User prompt template — not authenticated:**

```
Claude Code is not authenticated on this machine. cli-claude-code uses Claude subscription OAuth only.
Run one, then confirm — the skill will retry the original dispatch:
  - `claude auth login`     (interactive browser OAuth flow)
  - `claude setup-token`    (non-interactive OAuth token for CI/CD)
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (OAuth expired or revoked), invalidate the cache, re-run `claude auth login`, and re-check before retrying. Never substitute a model the user didn't approve.

### Default Invocation (Skill Default)

**Default model + flags + agent**: `claude-sonnet-4-6` · `--output-format text` · no `--agent` (general-purpose). For deep-reasoning work, override with `--model claude-opus-4-6 --effort high`. The pinned shape:

```bash
claude -p "<prompt>" \
  --model claude-sonnet-4-6 \
  --output-format text \
  2>&1
```

**User override** (honor explicit user phrasing verbatim):

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model claude-sonnet-4-6 --output-format text` |
| "Use Opus extended thinking" | `--model claude-opus-4-6 --effort high` |
| "JSON schema output" | Append `--json-schema '<schema>' --output-format json` |
| "Cost-capped" | Append `--max-budget-usd 1.00` |
| "Plan mode" | Append `--permission-mode plan` (read-only) |

### Model Selection

`claude-sonnet-4-6` is the skill default. The full roster (including the current-generation `claude-opus-4-8` / `claude-sonnet-5` / `claude-fable-5` IDs), with cost and per-task selection guidance, lives in the ALWAYS-loaded [cli_reference.md](./references/cli_reference.md) §6.

| Model | ID | When to reach for it |
|-------|----|----------------------|
| **Opus** | `claude-opus-4-6` (current: `claude-opus-4-8`) | Deep reasoning, complex architecture, extended thinking (`--effort high`) |
| **Sonnet** ★ default | `claude-sonnet-4-6` (current: `claude-sonnet-5`) | Balanced performance/cost — default for most tasks |
| **Haiku** | `claude-haiku-4-5-20251001` | Fast, lightweight tasks; use only when explicitly requested |

Default to Sonnet unless the task needs Opus deep reasoning; name a current-generation ID explicitly when you want it.

### Claude Code Agent Delegation

Route to a specialized `.claude/agents/*.md` agent with `--agent <name>` when the task matches a specialization. Full roster and invocation patterns: [agent_delegation.md](./references/agent_delegation.md).

| Task Type | Agent |
|-----------|-------|
| Codebase exploration | `context` (add `--permission-mode plan`) |
| Systematic debugging | `debug` |
| Session state capture | `handover` |
| Multi-agent coordination | `orchestrate` |
| Evidence gathering | `research` |
| Code review / audit | `review` (add `--permission-mode plan`) |
| Spec documentation | `speckit` |
| Multi-strategy planning | `ai-council` (add `--permission-mode plan`) |
| Documentation generation | `write` |

### Dispatch-Critical Gotchas

The full flag glossary, unique capabilities (`--json-schema`, `--max-budget-usd`, extended thinking, session `--continue`/`--resume`), essential command examples, and troubleshooting table are in the ALWAYS-loaded [cli_reference.md](./references/cli_reference.md) (§4–§13). Four gotchas that must be honored at routing time:

- **Non-interactive requires `-p` (print) mode** — `claude -p "prompt" --output-format text 2>&1`. `--output-format` defaults to `text`; use `json` (adds role/content/cost metadata) or `stream-json` only when a pipeline needs it. Capture stderr with `2>&1`.
- **`--permission-mode plan` is read-only** — use it for review/analysis/exploration (no file writes). `bypassPermissions` auto-approves all writes and **requires explicit user approval**; the default mode already allows writes.
- **No `--search` flag** — Claude Code has no live web browsing. Route web research to cli-opencode.
- **Check `$CLAUDECODE` before dispatch** — a set value means the caller is already inside Claude Code; refuse (self-invocation), do not dispatch.

---

## 4. RULES

### ✅ ALWAYS

1. Verify Claude Code CLI is installed before first invocation (`command -v claude`); check `$CLAUDECODE` for nesting.
2. Use `--permission-mode plan` for review/analysis/exploration (no file writes); `--output-format text` unless JSON is specifically needed.
3. Validate output before applying — correctness, completeness, alignment, syntax checks if code generated.
4. Capture stderr (`2>&1`) to catch errors and warnings.
5. Specify `--model` explicitly: default `claude-sonnet-4-6` unless task needs Opus (deep reasoning). Use Haiku only when explicitly requested or after adoption.
6. Route to the appropriate `--agent <name>` when the task matches a specialization (see Section 3 routing table).
7. **Pass the spec folder to the delegated agent** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the delegated agent cannot answer Gate 3 interactively.
8. **Prompt construction & model-craft (cli-* family precedence).** Compose every dispatch prompt via the 3-tier rule canonical in `../../sk-prompt/prompt-models/assets/cli_prompt_quality_card.md`:
   1. **Fast path (default).** Build from the local `assets/prompt_quality_card.md`, which delegates the framework table + CLEAR check to the canonical card.
   2. **Model override (mandatory for a profiled model).** If the target model has a profile at `../../sk-prompt/prompt-models/references/models/<id>.md`, that profile OVERRIDES the cross-model default. The **sk-prompt/prompt-models** hub owns per-model prompt-craft (framework + scaffold + gotchas, mirroring `sk-prompt/prompt-models/assets/model_profiles.json` `recommended_frameworks`); consult it before composing for any small model.
   3. **Deep path (escalation).** Dispatch `@prompt-improver` via the Task tool (never load full `sk-prompt` inline) when any canonical **Tier 3** trigger applies — the trigger list lives in `../../sk-prompt/prompt-models/assets/cli_prompt_quality_card.md` under "Tier 3 — Deep path"; do not re-enumerate it here.

   Tag the framework in the Bash invocation comment and use the returned `ENHANCED_PROMPT`. Apply the CLEAR 5-question check from the canonical card via the local delegating card.
9. **Code Standards Loading (surface-aware contract)** — When dispatching for code review or code generation, instruct the dispatched session to: (1) load `sk-code`; (2) let `sk-code` emit a surface tag matching the detected stack from markers and target files; (3) load the selected surface resources and run its verification commands; (4) load `sk-code`'s code-review mode only for formal findings-first review output. Fallback: if the surface cannot be determined confidently, ask for the runtime surface and verification command set. NEVER hardcode obsolete sibling code skills in dispatch prompts.
10. **Design Standards Loading (surface-aware contract)** — When dispatching for design or UI work, instruct the dispatched session to: (1) load `sk-design` (the hub); (2) let the hub resolve a `workflowMode` through `mode-registry.json` (interface / foundations / motion / audit / md-generator); (3) load the selected mode packet, set the design register, and run that mode's design verification; (4) if the work feeds Open Design, carry the `mcp-open-design` pairing — the transport never decides taste. Fallback: if the design mode cannot be determined confidently, ask for the surface and design intent. NEVER treat `mcp-figma` or `mcp-open-design` as the taste authority, or hardcode obsolete flat design skills in dispatch prompts.
11. **Pass the design dispatch manifest to the dispatched session** — when dispatching design or UI work, inline a `DESIGN_DISPATCH_MANIFEST v1` block in the prompt (the child cannot resolve skill paths, so the manifest travels in the payload, not by reference): `skDesignLoaded` true, `register` resolved to `Brand` or `Product` (never `unknown`), registry-valid `workflowModes`, `dials`, `loadedFiles`, and `proofDemandBack`. If the manifest cannot be assembled — `sk-design` not loaded, register unresolved, or no registry-valid mode — ASK before launching the child rather than starting a silent design dispatch. The child returns the demanded proof; the parent reconciles it on the return path.
12. **Single-dispatch discipline (operator-gated, session-scoped)** — Default: launch ONE cli-* dispatch at a time across the cli-* family (cli-opencode, cli-claude-code). Wait for the dispatched agent's work to return, verify outputs exist, then SIGKILL the dispatcher process + any orphan children (`pkill -9 -f "claude -p"` for this skill, plus `gtimeout` / `positional_scoring_fallback:app` cleanup). Only launch the next dispatch (this skill OR a sibling) after the prior one is dead and RSS has dropped. **Within a deep-flow session** (deep-review / deep-research): the operator authorizes the whole multi-iteration session at start — iterations chain back-to-back with kill-between as the safety mechanism, NOT a per-iteration operator confirmation prompt. **Exception (cross-skill parallel)**: when the operator explicitly authorizes N parallel dispatches, run N concurrently — but still SIGKILL each as its work returns.
13. **Set `AI_SESSION_CHILD=1` in the dispatched child's env** when sessions may be launched through the per-session worktree wrapper (`.opencode/bin/worktree-session.sh`). A dispatched `claude -p` run is an orchestrated sub-session, not a new top-level session, so it must SHARE the parent's worktree rather than allocate its own. The wrapper checks `AI_SESSION_CHILD` (plus a `git --git-common-dir` structural backstop) and exec's in place when set. Pattern: `AI_SESSION_CHILD=1 claude -p ...`. Harmless when the wrapper is not in use. See `.opencode/bin/README.md` → "Worktree session isolation". Prepend `MK_SPEC_GATE_ENFORCE=0` next to it so a dispatched child never inherits an enforced spec-gate from the parent shell (belt-and-suspenders alongside the wrapper's own neutralization and the core's `AI_SESSION_CHILD` deny-narrowing): `MK_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 claude -p ...`.

### ⛔ NEVER

1. Use `--permission-mode bypassPermissions` without explicit user approval (auto-approves all writes/tool calls).
2. Trust output blindly for security-sensitive code (review for XSS, injection, hardcoded secrets, eval), or send sensitive data (API keys, passwords, credentials) in prompts — Claude Code transmits to Anthropic's API.
3. Hammer the API with rapid sequential calls — respect rate limits; use `--max-budget-usd` for cost control.
4. Use Claude Code for tasks where context is already loaded — direct action by the calling AI is faster.

### ⚠️ ESCALATE IF

1. Claude Code CLI is not installed and user has not acknowledged (provide `npm install -g @anthropic-ai/claude-code`).
2. Rate limits or budget caps are persistently hit (suggest increasing `--max-budget-usd` or checking quota).
3. Output conflicts with existing code patterns (present both perspectives; user decides).
4. Task requires `--permission-mode bypassPermissions` (describe risks; get explicit user approval).

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Claude Code CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../../system-spec-kit/references/cli/memory_handback.md).

Claude-Code-specific Memory Epilogue template: see [assets/prompt_templates.md](./assets/prompt_templates.md) §11.

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) - Complete CLI flags, commands, models, authentication, and configuration
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns (reversed: external AI conducts, Claude Code executes)
- [claude_tools.md](./references/claude_tools.md) - Unique capabilities and comparison with OpenCode
- [agent_delegation.md](./references/agent_delegation.md) - 9 agent roster, routing table, and invocation patterns

### Templates and Assets

- [prompt_templates.md](./assets/prompt_templates.md) - Copy-paste ready prompt templates for common tasks

### Shared (cli-* family)
- [shared_smart_router.md](../../system-spec-kit/references/cli/shared_smart_router.md) - Helper-function bodies for the smart router.
- [memory_handback.md](../../system-spec-kit/references/cli/memory_handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [Claude Code GitHub](https://github.com/anthropics/claude-code) - Official repository
- [Claude](https://claude.ai) - Claude subscription OAuth account (auth for cli-claude-code)
- [Claude Code Documentation](https://docs.anthropic.com/en/docs/claude-code) - Official docs

### Reference Loading Notes

- Load only references needed for current intent.
- Smart Routing (Section 2) is the single routing authority.
- `cli_reference.md` is ALWAYS loaded as baseline.

---

## 6. SUCCESS CRITERIA

### Task Completion

- Claude Code CLI invoked with correct flags, model, and permission mode.
- Output captured, validated, and integrated appropriately.
- No security vulnerabilities introduced from generated code.
- Rate limits and budget caps handled gracefully.
- Appropriate agent routed for specialized tasks.
- Permission mode matched to task type (plan for review, default for generation).

### Skill Quality

- All 8 sections present with proper anchor comments.
- Smart routing covers all intent signals with UNKNOWN_FALLBACK.
- Reference files provide deep-dive content without duplication.

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

**Tool roles**: Bash dispatches the CLI; Read/Glob/Grep validate output.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/cli_reference.md`, `references/integration_patterns.md`, `assets/prompt_quality_card.md`, `assets/prompt_templates.md`, `references/agent_delegation.md`, `references/claude_tools.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Related skills: `cli-opencode` for sandboxed OpenAI perspective, `cli-opencode` for full OpenCode runtime dispatch, `sk-code` for code-quality contracts, `mcp-code-mode` for external MCP work, and `system-spec-kit` for packet handback.
