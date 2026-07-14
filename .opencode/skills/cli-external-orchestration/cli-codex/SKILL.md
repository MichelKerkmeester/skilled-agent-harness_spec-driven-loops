---
name: cli-codex
description: "Codex CLI executor for OpenAI-backed coding, repo analysis, PR review, web research, and cross-model validation."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.6.0.0
hard_rules:
  - id: codex-availability-required
    check: command-v-codex-required
    message: "Run `command -v codex` before every dispatch; if it fails, refuse the route without constructing or launching a command."
    severity: error
  - id: self-invocation-prohibited
    check: codex-self-invocation-guard
    message: "Refuse dispatch when Codex runtime signals are present; a running CLI skill never dispatches itself."
    severity: error
  - id: deep-loop-runtime-required
    check: deep-loop-runtime-delegation
    message: "Delegate execution to the shipped deep-loop runtime; this skill must not implement a second Codex adapter."
    severity: error
---

<!-- Keywords: codex, codex-cli, openai, cross-ai, web-search, code-generation, code-review, second-opinion, agent-delegation, gpt-5, session-management -->

# Codex CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the OpenAI CLI binary (`codex`). If the agent currently reading this skill is itself running inside Codex (detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `codex` invocation.
>
> A running CLI skill never dispatches itself. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate OpenAI's Codex CLI for tasks that benefit from a second AI perspective, real-time web search, deep codebase analysis, built-in code review workflows, or parallel code generation.

**Core Principle**: Use Codex for what it does best. Delegate, validate, integrate. The calling AI stays the conductor.

---

## 1. WHEN TO USE

### Activation Triggers

- **Cross-AI Validation** — code review second perspective, security audit alternative analysis, bug detection, `/review` diff-aware workflow.
- **Web Research** — current internet info via `--search` flag, latest library versions, API changes, community solutions.
- **Codebase Architecture Analysis** — onboarding to unfamiliar codebases, cross-file dependency mapping, architecture docs from code.
- **Parallel Task Processing** — offloading generation, simultaneous code generations, background docs/test generation.
- **Agent-Delegated Tasks** — specialized profile matches (`.codex/agents/*.toml`), session management (resume, fork), multi-strategy planning.
- **Specialized Generation** — explicit Codex requests, test suite generation, code translation, batch docs (JSDoc, README, API), visual input via `--image`/`-i`.

### When NOT to Use

- **You ARE Codex already.** If your runtime is Codex (detection signal: `$CODEX_SESSION_ID` or any `CODEX_*` env var set, `codex` in process ancestry, or `~/.codex/state/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation.
- Simple, quick tasks where CLI overhead is not worth it.
- Tasks requiring immediate response (rate limits may cause delays).
- Context already loaded and understood by the current agent.
- Interactive refinement requiring the full-screen TUI (use `codex` directly instead).
- Tasks where Codex CLI is not installed.

---

## 2. SMART ROUTING


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
| ALWAYS      | Every skill invocation  | `references/cli_reference.md`, `assets/prompt_quality_card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared_smart_router.md`](../../system-spec-kit/references/cli/shared_smart_router.md)):

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
    # WHY: DESIGN is an intent signal only. The durable sk-design loading contract lives in the
    # always-fires Design Standards Loading rule and the dispatch manifest; RESOURCE_MAP stays
    # limited to same-skill markdown paths.
    "DESIGN":            {"weight": 4, "keywords": ["sk-design", "interface design", "frontend design", "visual design", "redesign the ui", "design foundations", "design tokens", "motion design", "micro-interactions", "design audit", "ui critique", "extract design system", "generate design.md"]},
}

RESOURCE_MAP = {
    "GENERATION":        ["references/cli_reference.md", "assets/prompt_templates.md"],
    "REVIEW":            ["references/integration_patterns.md", "references/agent_delegation.md"],
    "RESEARCH":          ["references/codex_tools.md", "assets/prompt_templates.md"],
    "ARCHITECTURE":      ["references/codex_tools.md", "references/agent_delegation.md"],
    "AGENT_DELEGATION":  ["references/agent_delegation.md", "references/integration_patterns.md"],
    "TEMPLATES":         ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":          ["references/integration_patterns.md", "references/cli_reference.md"],
    "HOOKS":             ["references/hook_contract.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli_reference.md", "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "codex agent", "codex prompt", "web research", "review command", "fork session", "hook contract"],
    "ON_DEMAND": ["references/codex_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Codex CLI specifically?",
    "Does the task benefit from a second AI perspective?",
    "Is real-time web information needed (--search)?",
    "Would codebase-wide analysis or /review workflow help?",
]
```

**Call sequence** (using shared helpers from `shared_smart_router.md`):

1. `discover_markdown_resources()` — recursively enumerate current `.md` files under existing `references/` and `assets/` folders at routing time.
2. `_guard_in_skill()` + `load_if_available()` — sandbox paths to this skill, reject non-markdown loads, skip missing files, and suppress duplicates.
3. `score_intents(task)` and `select_intents(scores, ambiguity_delta=1.0)` — preserve provider-specific weighted intent scoring and top-2 ambiguity handling.
4. `get_routing_key(task, intents)` — derive the provider routing key from task/provider context, then fall back to `codex`.
5. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
6. CONDITIONAL-load `RESOURCE_MAP[intent]`, ON_DEMAND-load keyword matches, and return a notice when no provider-specific knowledge base is available beyond always-load resources.

The `route_codex_resources(task)` function body lives in [`shared_smart_router.md`](../../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `codex`.

---

## 3. HOW IT WORKS

### Prerequisites

```bash
# Verify installation
command -v codex || echo "Not installed. Run: npm i -g @openai/codex"

# Authentication — API key OR ChatGPT OAuth
export OPENAI_API_KEY=your-key-here
codex login
```

**Authentication options**: `OPENAI_API_KEY` env var (direct API), or ChatGPT OAuth via `codex login` (uses ChatGPT account credentials).

### Execution Ownership

This packet owns user-facing routing, the `command -v codex` availability probe, prompt construction, and the self-invocation guard. Actual process construction and execution delegate to the already-shipped deep-loop runtime at `../../system-deep-loop/runtime/scripts/fanout-run.cjs`, using executor kind `cli-codex`.

The runtime is the single Codex execution adapter. Do not add a packet-local wrapper, command builder, or spawn path. Direct `codex exec` snippets below are operator reference and manual-testing examples; orchestrated dispatches use the shared runtime.

### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default OpenAI auth (API key OR ChatGPT OAuth) may not be configured on this machine — silently failing with `401 Unauthorized` or `not authenticated` mid-dispatch wastes a round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: capture auth status for routing
[ -n "$OPENAI_API_KEY" ] && OPENAI_KEY_OK=1 || OPENAI_KEY_OK=0
CODEX_AUTH=$(codex login status 2>&1)
echo "$CODEX_AUTH" | grep -qi "logged in\|chatgpt-oauth" && CODEX_OAUTH_OK=1 || CODEX_OAUTH_OK=0
```

**Decision tree** (apply in order — first match wins):

| State | OPENAI_KEY_OK | CODEX_OAUTH_OK | Action |
|-------|---------------|----------------|--------|
| Default available | 1 | * | Proceed with `codex exec --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"` |
| API key missing, OAuth ready | 0 | 1 | **ASK user** before substituting — never auto-fall-back silently. Surface options A/B/C below. |
| Both missing | 0 | 0 | **ASK user** to configure auth — surface the login commands, do NOT dispatch. |

**User prompt template — API key missing, OAuth configured:**

```
`$OPENAI_API_KEY` is not set, but ChatGPT OAuth via `codex login` is configured.
Pick one:
  A) Use the existing ChatGPT OAuth session (works for `codex exec` if your ChatGPT plan covers the model)
  B) Run `export OPENAI_API_KEY=sk-...` first, then retry the original dispatch
  C) Name a different model — paste the `--model <id>` you want to use
```

**User prompt template — both missing:**

```
No OpenAI auth is configured on this machine. Run one:
  - `export OPENAI_API_KEY=sk-...`  (recommended for direct API calls)
  - `codex login`                    (interactive ChatGPT OAuth flow; requires ChatGPT Plus/Pro/Business)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (key revoked or OAuth expired), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

### Default Invocation (Skill Default)

**Default model + effort + tier**: `gpt-5.5` · `medium` reasoning · `fast` service tier. Balances speed, cost, and quality for the typical delegation.

```bash
codex exec \
  --model gpt-5.5 \
  -c model_reasoning_effort="medium" \
  -c service_tier="fast" \
  -c approval_policy=never \
  --sandbox workspace-write \
  "<prompt>"
```

**User override** (honor explicit user phrasing verbatim):

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"` |
| "Use gpt 5.5 high fast" | `--model gpt-5.5 -c model_reasoning_effort="high" -c service_tier="fast"` |
| "Use gpt 5.5 low" | `--model gpt-5.5 -c model_reasoning_effort="low" -c service_tier="fast"` (fast stays unless user drops it) |
| "Use gpt 5.5 xhigh" | `--model gpt-5.5 -c model_reasoning_effort="xhigh" -c service_tier="fast"` |
| "Use gpt 5.6 luna max" | `--model gpt-5.6-luna -c model_reasoning_effort="max" -c service_tier="fast"` |
| "Use gpt 5.6 terra high" | `--model gpt-5.6-terra -c model_reasoning_effort="high" -c service_tier="fast"` |
| "Use gpt 5.6 sol ultra" | `--model gpt-5.6-sol -c model_reasoning_effort="ultra" -c service_tier="fast"` |

Honor whichever dimensions the user names. Model stays on `gpt-5.5` and service tier stays on `fast` unless the user explicitly names a different model or tier; keep the reasoning effort within the chosen model's ceiling (`gpt-5.5` ≤ `xhigh`, `gpt-5.6-luna` / `gpt-5.6-terra` ≤ `max`, `gpt-5.6-sol` ≤ `ultra`).

### Core Invocation Pattern

```bash
codex exec "prompt" --model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast" 2>&1
```

> **Common flag mistakes**: `--reasoning`, `--reasoning-effort` and `--quiet` do NOT exist. Use `-c model_reasoning_effort="high"` for reasoning effort (or set it in `config.toml`). There is no quiet flag. Use `-o file.txt` to capture the last message to a file.

| Flag / Option | Purpose |
|---------------|---------|
| `--model <id>` | Model selection — `gpt-5.5` (skill default), `gpt-5.6-luna`, `gpt-5.6-terra`, `gpt-5.6-sol` |
| `-c model_reasoning_effort="<level>"` | Reasoning effort — `none`, `minimal`, `low`, `medium`, `high`, `xhigh`, `max`, `ultra`. Ceiling is per-model: `gpt-5.5` ≤ `xhigh`; `gpt-5.6-luna` / `gpt-5.6-terra` ≤ `max`; `gpt-5.6-sol` ≤ `ultra` |
| `-c service_tier="fast"` | **Fast mode** — routes through fast tier. **Always pass explicitly** when delegating from another AI so the call is self-documenting and never silently falls back to a slower tier. |
| `--sandbox read-only` | Safe mode: read files, no writes or shell commands |
| `--sandbox workspace-write` | Allow file writes within the workspace |
| `--sandbox danger-full-access` | Full shell access — **requires explicit user approval** |
| `--ask-for-approval untrusted` | Prompt before untrusted operations (default) |
| `--ask-for-approval on-request` | Prompt only when Codex requests approval |
| `--ask-for-approval never` | Auto-approve all operations (use with caution) |
| `--full-auto` | Low-friction sandboxed automation: `workspace-write` sandbox + `on-request` approval. Default for unattended orchestration. |
| `--search` | Enable live web browsing during task execution |
| `--image` / `-i` | Attach an image file as visual input |

> **Default sandbox behavior**: `codex exec` without an explicit `--sandbox` flag defaults to `read-only` with `approval: never`. **File modification tasks will silently fail** — the agent reads code and plans changes but cannot write them. Always pass `--sandbox workspace-write` (or `--full-auto`) when the task requires file edits.

> **Fast mode (REQUIRED for cross-AI delegation)**: Always pass `-c service_tier="fast"` explicitly. This routes the call through the fast tier instead of relying on whatever the user's `~/.codex/config.toml` sets as default. Explicit means reproducible regardless of who runs it.

### Model Selection

`gpt-5.5` at `medium` is the skill default for cross-AI delegation. Four GPT models are available on the `fast` service tier; each caps at a different reasoning-effort ceiling. Pick the model for the task, then tune reasoning effort within that model's ceiling. All are `-c service_tier="fast"`.

| Model | ID | Reasoning-effort range (fast tier) | When to reach for it |
|-------|----|------------------------------------|----------------------|
| **GPT-5.5** ★ default | `gpt-5.5` | `low` · `medium` · `high` · `xhigh` | General delegation — generation, review, docs, research. Default at `medium`. |
| **GPT-5.6 LUNA** | `gpt-5.6-luna` | `low` · `medium` · `high` · `xhigh` · `max` | Implementation-heavy work wanting deeper reasoning; the `luna-impl` profile pins `max`. |
| **GPT-5.6 TERRA** | `gpt-5.6-terra` | `low` · `medium` · `high` · `xhigh` · `max` | A GPT-5.6 fast sibling; callable directly via `-m gpt-5.6-terra` (no dedicated config profile). |
| **GPT-5.6 SOL** | `gpt-5.6-sol` | `low` · `medium` · `high` · `xhigh` · `max` · `ultra` | Verification / review and the hardest planning — the only model reaching `ultra`; the `sol-verify` profile pins `xhigh`. |

**Reasoning-effort scale** (ascending): `low` → `medium` (5.5 default) → `high` → `xhigh` → `max` → `ultra`. Ceilings are per-model: `gpt-5.5` ≤ `xhigh`; `gpt-5.6-luna` / `gpt-5.6-terra` ≤ `max`; `gpt-5.6-sol` ≤ `ultra`. Codex also accepts `none` / `minimal` below `low` for trivial lookups.

> **Note**: There is no `--reasoning-effort` CLI flag. Set via `-c model_reasoning_effort="<level>"` or in `config.toml` / profile sections.

**Selection Strategy**: default to `gpt-5.5 medium`; raise reasoning effort (`high` / `xhigh`) for architecture, security, and complex planning; escalate to a GPT-5.6 model when the task wants reasoning past `xhigh` — `gpt-5.6-luna max` for implementation, `gpt-5.6-sol xhigh` / `ultra` for verification and review; drop to `low` / `minimal` for trivial lookups.

### Codex Agent Delegation

The calling AI is the conductor; Codex profiles in `config.toml` `[profiles.<name>]` shape HOW Codex processes the task (sandbox, reasoning).

| Task Type | Profile | Invocation Pattern |
|-----------|---------|-------------------|
| Code review / security audit | review | `codex exec -p review "Review @./src/auth.ts for security issues" -m gpt-5.5` |
| Git diff review | (built-in) | `codex exec review "Focus on security" --commit HEAD` |
| Architecture exploration | context | `codex exec -p context "Analyze the architecture of this project" -m gpt-5.5` |
| Technical research | research | `codex exec -p research "Research latest Express.js security advisories" -m gpt-5.5 --search` |
| Documentation generation | write | `codex exec -p write "Generate README for this project" -m gpt-5.5` |
| Fresh-perspective debugging | debug | `codex exec -p debug "Debug this error: [error]" -m gpt-5.5` |
| Multi-strategy planning | ai-council | `codex exec -p ai-council "Plan the authentication redesign" -m gpt-5.5` |

**Profile setup**: Defined in `.codex/config.toml` under `[profiles.<name>]`. Each profile can override `model`, `model_reasoning_effort`, `sandbox_mode`, and `approval_policy`. The `.codex/agents/*.toml` files provide agent definitions for the interactive multi-agent TUI feature.

See [agent_delegation.md](./references/agent_delegation.md) for complete agent roster.

### Unique Codex Capabilities

| Capability | Purpose | Invocation |
|------------|---------|------------|
| `/review` command | Built-in diff-aware code review in TUI | `codex` then type `/review` |
| `--search` flag | Live web browsing during exec | `codex exec "..." --search` |
| `codex mcp` | Connect to Model Context Protocol servers | `codex mcp` subcommand |
| Native hooks | Inject startup context and advisor briefs when `[features].codex_hooks = true` | `~/.codex/hooks.json` |
| Session resume | Continue a previous Codex session | `codex resume [session-id]` |
| Session fork | Branch from an existing session | `codex fork [session-id]` |
| `--image` / `-i` | Attach images for visual input | `codex exec "..." -i screenshot.png` |
| `codex cloud` | Remote task execution | `codex cloud` subcommand |

### Essential Commands

```bash
# Code generation (workspace writes allowed)
codex exec "Create [description] with [features]. Output complete file." --model gpt-5.5 --sandbox workspace-write

# Code review (read-only — no file modifications)
codex exec "Review @./src/auth.ts for security vulnerabilities" --model gpt-5.5 --sandbox read-only

# Git diff review (built-in review subcommand)
codex exec review "Focus on security vulnerabilities" --commit HEAD --model gpt-5.5

# Web research (live web browsing enabled)
codex exec "What's new in [topic]? Search the web for current information." --model gpt-5.5 --search --sandbox read-only

# Background execution
codex exec "[long task]" --model gpt-5.5 --sandbox workspace-write 2>&1 &

# With image input
codex exec "Implement this UI component based on the attached design" --model gpt-5.5 -i design.png --sandbox workspace-write

# Profile-based task delegation
codex exec -p research "Research latest security advisories for Express.js" --model gpt-5.5 --search
```

### Error Handling

| Issue | Solution |
|-------|----------|
| CLI not installed | `npm i -g @openai/codex` |
| `OPENAI_API_KEY` not set | `export OPENAI_API_KEY=your-key` or run `codex login` |
| Rate limit exceeded | Wait for auto-retry or reduce request frequency |
| Auth expired | Run `codex login` to re-authenticate via OAuth |
| Sandbox violation | Match `--sandbox` level to task requirements |
| Task ran but no files changed | `codex exec` defaults to `read-only` sandbox — add `--sandbox workspace-write` or `--full-auto` for edit tasks |
| Agent asks for spec folder / approval | Non-interactive `exec` cannot answer prompts — include `(pre-approved, skip Gate 3)` in prompt and use `--full-auto` |
| Context too large | Specify files explicitly with `@./path` rather than broad prompts |
| No startup context or advisor brief | Enable `[features].codex_hooks = true` and verify `~/.codex/hooks.json` has Spec Kit Memory `SessionStart` and `UserPromptSubmit` entries. See `references/hook_contract.md`. |

---

## 4. RULES

### ✅ ALWAYS

1. Verify Codex CLI is installed before first invocation (`command -v codex`).
2. Delegate orchestrated execution to `../../system-deep-loop/runtime/scripts/fanout-run.cjs` with executor kind `cli-codex`; never build a second adapter in this packet.
3. Use `--sandbox read-only` for review/analysis/research; `--sandbox workspace-write` (or `--full-auto`) for code generation/file modification — `codex exec` defaults to `read-only`, so omitting causes silent no-op on edit tasks.
4. Validate Codex-generated code (XSS, injection, eval, syntax checks via `node --check`, `tsc --noEmit`, etc.) before applying.
5. Capture stderr (`2>&1`) so rate-limit messages and errors surface.
6. **Redirect codex stdin from `/dev/null`** when dispatching in a `while read` loop. Pattern: `codex exec "$PROMPT" > "$LOG" 2>&1 </dev/null &`. Without `</dev/null`, the backgrounded codex process inherits the loop's stdin (the file after `done < input.jsonl`) and silently consumes the remaining lines — the loop exits after 3-6 iterations with no error. See `references/integration_patterns.md#background-execution` → "Silent Stdin Consumption".
7. **Specify model + effort + service tier explicitly** — never rely on caller environment. Default: `--model gpt-5.5 -c model_reasoning_effort="medium" -c service_tier="fast"`. Honor user overrides verbatim. Use `high`/`xhigh` for reasoning-heavy tasks (architecture, security, deep planning).
8. Route to the appropriate `-p <profile>` when the task matches a specialization (see Section 3 routing table); use `codex exec review` (built-in subcommand) for git diff reviews.
9. **Pass the spec folder to the delegated agent** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the delegated agent cannot answer Gate 3 in `--full-auto` or non-interactive mode.
10. **Prompt construction & model-craft (cli-* family precedence).** Compose every dispatch prompt via the 3-tier rule canonical in `../../sk-prompt/prompt-models/assets/cli_prompt_quality_card.md`:
   1. **Fast path (default).** Build from the local `assets/prompt_quality_card.md`, which delegates the framework table + CLEAR check to the canonical card.
   2. **Model override (mandatory for a profiled model).** If the target model has a profile at `../../sk-prompt/prompt-models/references/models/<id>.md`, that profile OVERRIDES the cross-model default. The **sk-prompt/prompt-models** packet owns per-model prompt-craft (framework + scaffold + gotchas, mirroring `sk-prompt/prompt-models/assets/model_profiles.json` `recommended_frameworks`); consult it before composing for any small model.
   3. **Deep path (escalation).** Dispatch `@prompt-improver` via the Task tool (never load full `sk-prompt` inline) when any canonical **Tier 3** trigger applies — the trigger list lives in `../../sk-prompt/prompt-models/assets/cli_prompt_quality_card.md` under "Tier 3 — Deep path"; do not re-enumerate it here.
11. **Never inject user-level voice/personalization content into AI-orchestrated Codex delegations.** Codex CLI reads user-level voice from `~/.codex/AGENTS.md` (the human's global settings, loaded automatically). When an AI delegates via `codex exec`, the calling AI's own voice rules govern the response — do NOT read `~/.codex/AGENTS.md` and paste into delegation prompts. Keep delegations focused on task/model/sandbox/effort/(spec-folder pre-approval). If the user asks how to make Codex sound more like Claude in *their own* sessions, point to `~/.codex/AGENTS.md` — not any repo asset.
12. **Code Standards Loading (surface-aware contract)** — When dispatching for code review or code generation, instruct the dispatched session to: (1) load `sk-code`; (2) let `sk-code` emit a surface tag matching the detected stack from markers and target files; (3) load the selected surface resources and run its verification commands; (4) add `code-review` only for formal findings-first review output. Fallback: if the surface cannot be determined confidently, ask for the runtime surface and verification command set. NEVER hardcode obsolete sibling code skills in dispatch prompts.
13. **Design Standards Loading (surface-aware contract)** — When dispatching for design or UI work, instruct the dispatched session to: (1) load `sk-design` (the hub); (2) let the hub resolve a `workflowMode` through `mode-registry.json` (interface / foundations / motion / audit / md-generator); (3) load the selected mode packet, set the design register, and run that mode's design verification; (4) if the work feeds Open Design, carry the `design-mcp-open-design` pairing — the transport never decides taste. Fallback: if the design mode cannot be determined confidently, ask for the surface and design intent. NEVER treat `mcp-figma` or `design-mcp-open-design` as the taste authority, or hardcode obsolete flat design skills in dispatch prompts.
14. **Pass the design dispatch manifest to the dispatched session** — when dispatching design or UI work, inline a `DESIGN_DISPATCH_MANIFEST v1` block in the prompt (the child cannot resolve skill paths, so the manifest travels in the payload, not by reference): `skDesignLoaded` true, `register` resolved to `Brand` or `Product` (never `unknown`), registry-valid `workflowModes`, `dials`, `loadedFiles`, and `proofDemandBack`. If the manifest cannot be assembled — `sk-design` not loaded, register unresolved, or no registry-valid mode — ASK before launching the child rather than starting a silent design dispatch. The child returns the demanded proof; the parent reconciles it on the return path.
15. **Single-dispatch discipline (operator-gated, session-scoped)** — Default: launch ONE cli-* dispatch at a time across the cli-* family (cli-codex, cli-opencode, cli-claude-code). Wait for the dispatched agent's work to return, verify outputs exist, then SIGKILL only the dispatch THIS skill started: capture its PID at launch (`codex exec ... & CODEX_PID=$!`) and kill that captured PID directly plus its own orphan children (`kill -9 "$CODEX_PID" 2>/dev/null; pkill -9 -P "$CODEX_PID" 2>/dev/null`), then apply the same PID-scoped `gtimeout` / `positional_scoring_fallback:app` cleanup. **Never use a blanket `pkill -9 -f "codex exec --model"` pattern** — that matches and kills EVERY running `codex exec` process on the machine, including the operator's unrelated codex sessions. Only launch the next dispatch (this skill OR a sibling) after the prior one is dead and RSS has dropped. **Within a deep-flow session** (deep-review / deep-research): the operator authorizes the whole multi-iteration session at start — iterations chain back-to-back with kill-between as the safety mechanism, NOT a per-iteration operator confirmation prompt. **Exception (cross-skill parallel)**: when the operator explicitly authorizes N parallel dispatches, run N concurrently — but still SIGKILL each by its own captured PID as its work returns.
16. **Set `AI_SESSION_CHILD=1` in the dispatched child's env** when sessions may be launched through the per-session worktree wrapper (`.opencode/bin/worktree-session.sh`). A dispatched `codex exec` is an orchestrated sub-session, not a new top-level session, so it must SHARE the parent's worktree rather than allocate its own. The wrapper checks `AI_SESSION_CHILD` (plus a `git --git-common-dir` structural backstop) and exec's in place when set. Pattern: `AI_SESSION_CHILD=1 codex exec ... </dev/null`. Harmless when the wrapper is not in use. See `.opencode/bin/README.md` → "Worktree session isolation".

### ❌ NEVER

1. Use `--sandbox danger-full-access` without explicit user approval (full shell beyond workspace = damage risk). `--full-auto` (workspace-write + on-request approval) does not require pre-approval.
2. Trust Codex output blindly for security-sensitive code, send sensitive data (API keys, passwords, credentials) in prompts, or hammer the API with rapid sequential calls.
3. Use Codex for tasks where context is already loaded — direct action by the calling AI is faster.
4. Assume Codex output is correct without verification — cross-reference codebase and project standards.
5. Build or maintain a packet-local Codex execution adapter; the deep-loop runtime is the execution authority.

### ⚠️ ESCALATE IF

1. Codex CLI is not installed and user has not acknowledged (provide `npm i -g @openai/codex`).
2. Rate limits are persistently exceeded (suggest checking API key quota or OAuth account limits).
3. Codex output conflicts with existing code patterns (present both perspectives; user decides).
4. Task requires `--sandbox danger-full-access` (describe risks; get explicit user approval). `--full-auto` does not require escalation.

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Codex CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../../system-spec-kit/references/cli/memory_handback.md).

Codex-specific Memory Epilogue template: see [assets/prompt_templates.md](./assets/prompt_templates.md) §13.

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) - Complete CLI subcommands, flags, sandbox modes, and config reference
- [integration_patterns.md](./references/integration_patterns.md) - Cross-AI orchestration patterns and workflows
- [codex_tools.md](./references/codex_tools.md) - Built-in capabilities documentation (/review, --search, MCP, session management)
- [hook_contract.md](./references/hook_contract.md) - Native hook contract and Spec Kit Memory startup/advisor wiring
- [agent_delegation.md](./references/agent_delegation.md) - Codex agent roster, routing table, and invocation patterns

### Templates and Assets

- [prompt_templates.md](./assets/prompt_templates.md) - Copy-paste ready prompt templates for common tasks

### Shared (cli-* family)
- [shared_smart_router.md](../../system-spec-kit/references/cli/shared_smart_router.md) - Helper-function bodies for the smart router.
- [memory_handback.md](../../system-spec-kit/references/cli/memory_handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [Codex CLI GitHub](https://github.com/openai/codex) - Official repository
- [OpenAI Platform](https://platform.openai.com/api-keys) - API key management
- [OpenAI ChatGPT](https://chatgpt.com) - ChatGPT OAuth account

### Reference Loading Notes

- Load only references needed for current intent.
- Smart Routing (Section 2) is the single routing authority.
- `cli_reference.md` is ALWAYS loaded as baseline.

---

## 6. SUCCESS CRITERIA

### Task Completion

- Codex CLI invoked with correct subcommand, flags, model, and sandbox mode.
- Output captured, validated, and integrated appropriately.
- No security vulnerabilities introduced from generated code.
- Rate limits handled gracefully (retry or fallback strategy).
- Appropriate Codex profile routed for specialized tasks.
- Sandbox level matched to task type (read-only for review, workspace-write for generation).
- Orchestrated execution delegated to the shared deep-loop runtime without a packet-local adapter.

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
- **Execution**: Shared deep-loop runtime (`../../system-deep-loop/runtime/scripts/fanout-run.cjs`)

**Tool roles**: Bash dispatches the CLI; Read/Glob/Grep validate output.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/cli_reference.md`, `references/integration_patterns.md`, `assets/prompt_quality_card.md`, `assets/prompt_templates.md`, `references/agent_delegation.md`, `references/codex_tools.md`, `references/hook_contract.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Related skills: `cli-claude-code` for extended reasoning, `cli-opencode` for full OpenCode runtime dispatch, `sk-code` for code-quality contracts, `mcp-code-mode` for external MCP work, and `system-spec-kit` for packet handback.
