---
name: cli-opencode
description: "OpenCode CLI orchestrator: external dispatch, in-OpenCode parallel sessions, cross-AI handback with full runtime context."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.3.4.0
---

<!-- Keywords: opencode, opencode-cli, opencode-run, cross-ai, spec-kit-runtime, plugin-runtime, parallel-sessions, share-url, detached-session, agent-delegation, opencode-go, deepseek, openai, minimax, minimax-coding-plan, minimax-m3, minimax-m3-highspeed, token-plan -->

# OpenCode CLI Orchestrator - Full-Runtime Cross-AI Dispatch

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the OpenCode CLI binary (`opencode`). If the agent currently reading this skill is itself running inside OpenCode (TUI / acp / serve / run modes — detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `opencode` invocation. The only exception is an explicit "parallel detached" request that intentionally spawns a SEPARATE session with its own session id and state directory.
>
> Just as a Claude Code agent never calls cli-claude-code, an OpenCode agent never calls cli-opencode, a Codex agent never calls cli-codex and a Gemini agent never calls cli-gemini. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate OpenCode's `opencode run` from external AI assistants (Claude Code, Codex, Gemini, raw shell) AND from inside an existing OpenCode session for parallel detached workers. Three documented use cases keep the cycle risk explicit while giving every dispatch path a copy-paste invocation shape.

**Core Principle**: The calling AI stays the conductor. Delegate to OpenCode for what it does best — full plugin, skill, MCP, and Spec Kit Memory runtime in a one-shot dispatch. Validate and integrate the output.

---

## 1. WHEN TO USE

### Activation Triggers

- **Full plugin / skill / MCP runtime** (use case 1) — calling AI is Claude Code / Codex / Copilot / Gemini / raw shell AND the task needs the project's full Spec Kit Memory database, Code Graph semantic index, structural code graph, or every plugin/skill/MCP tool in a one-shot dispatch. Includes `@deep-research` / `@deep-review` agent loops with externalized state under `.opencode/specs/`.
- **Parallel detached session** (use case 2) — operator already inside OpenCode (TUI / web / serve / acp) AND wants a SEPARATE session with its own session id and state directory for ablation, worker farm, or parallel research. Prompt explicitly mentions "parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", or "share URL".
- **Cross-AI orchestration handback** (use case 3) — calling AI is non-Anthropic (Codex / Copilot / Gemini), task targets a project-specific subsystem (spec-kit, memory, code-graph, advisor), and the non-Anthropic CLI cannot load the project's plugin/skill/MCP runtime on its own and needs OpenCode as a bridge.
- **Agent dispatch** — task matches a specialized OpenCode agent. Primary agents (directly invokable via `--agent`): `general`, `plan` (built-in), `orchestrate`, `ai-council`. Subagents dispatched via the orchestrate primary: `context`, `review`, `write`, `debug`, `deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`.
- **Cross-repo dispatch** — session in repo A dispatches into repo B's plugin/skill/MCP runtime via `--dir <path>` or remote OpenCode server via `--attach <url>`.

### When NOT to Use

- **You ARE OpenCode already.** If your runtime is OpenCode (detection signal: `$OPENCODE_CONFIG_DIR` or any `OPENCODE_*` env var set, `opencode` in process ancestry, or `~/.opencode/state/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation. The single legitimate exception is an explicit "parallel detached" request that intentionally spawns a SEPARATE session id and state directory (use case 2); without that qualifier, the smart router refuses per ADR-001.
- Simple, quick tasks where `opencode run` overhead is not worth it.
- Tasks that only need a raw model dispatch — use a sibling cli-* skill.
- Tasks requiring interactive TUI or web UI (use `opencode` directly instead of `opencode run`).
- Context already loaded and understood by the calling AI.
- Tasks where the OpenCode binary is not installed at the expected path.

---

## 2. SMART ROUTING


### Prerequisite Detection

```bash
# Verify OpenCode CLI is available
command -v opencode || echo "Not installed. Run: brew install opencode (macOS) or curl -fsSL https://opencode.ai/install | bash"

# SELF-INVOCATION GUARD (ADR-001 layered detection)
# Layer 1: env var lookup — any OPENCODE_* variable
env | grep -q '^OPENCODE_' && echo "ERROR: OPENCODE_* env detected — already inside OpenCode."
# Layer 2: process ancestry — opencode in parent tree
ps -o command= -p "$PPID" | grep -q opencode && echo "ERROR: opencode parent process detected."
# Layer 3: state lock-file probe
ls ~/.opencode/state/*/lock 2>/dev/null | head -1 | grep -q lock && echo "ERROR: live OpenCode session lock detected."
```

### Self-Invocation Guard (ADR-001)

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside OpenCode."""
    # Layer 1: env var lookup — OpenCode sets OPENCODE_CONFIG_DIR and OPENCODE_* vars
    for key in os.environ:
        if key == 'OPENCODE_CONFIG_DIR' or key.startswith('OPENCODE_'):
            return ('env', key)
    # Layer 2: process ancestry — opencode in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/opencode' in ancestry or 'opencode ' in ancestry:
            return ('ancestry', 'opencode')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe
    state_dir = os.path.expanduser('~/.opencode/state')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    # Single legitimate exception: explicit "parallel detached" keywords (use case 2)
    # spawn a SEPARATE session id and state directory, not a self-dispatch.
    if not has_parallel_session_keywords(prompt):
        refuse(
            "Self-invocation refused: this agent is already running inside OpenCode. "
            "Use a sibling cli-* skill or a fresh shell session in a different runtime to dispatch a different model. "
            "For a parallel detached session, restate with explicit parallel-session keywords."
        )
```

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ----------------------- | ------------------------------ |
| ALWAYS      | Every skill invocation  | `references/cli_reference.md`, `assets/prompt_quality_card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs   |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md)):

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans `references/` and `assets/`.
- Pattern 2: Existence-Check Before Load - `load_if_available()` uses `_guard_in_skill()`, `inventory`, and `seen`.
- Pattern 3: Extensible Routing Key - provider/use-case context derives an `opencode` routing key across external dispatch, detached sessions, handback, agents, cross-repo, templates, and workflows.
- Pattern 4: Multi-Tier Graceful Fallback - `UNKNOWN_FALLBACK` disambiguates OpenCode vs sibling CLI vs detached/handback and missing intent routes return a "no knowledge base" notice.

```python
INTENT_SIGNALS = {
    "EXTERNAL_DISPATCH":  {"weight": 4, "keywords": ["delegate to opencode", "opencode run", "from claude code", "from codex", "from gemini", "from copilot", "external runtime", "full plugin runtime"]},
    "PARALLEL_DETACHED":  {"weight": 4, "keywords": ["parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", "share url", "share-url", "detached session"]},
    "CROSS_AI_HANDBACK":  {"weight": 4, "keywords": ["spec kit", "spec-kit", "spec_kit", "code graph", "memory_search", "session_bootstrap", "skill advisor", "cross-ai handback"]},
    "AGENT_DISPATCH":     {"weight": 4, "keywords": ["delegate", "agent", "deep-research", "deep-review", "ai-council", "review agent", "context agent"]},
    "CROSS_REPO":         {"weight": 3, "keywords": ["cross-repo", "different repo", "--dir", "another repository", "remote opencode"]},
    "TEMPLATES":          {"weight": 3, "keywords": ["template", "prompt", "how to ask", "opencode prompt", "minimax", "minimax-2.7", "MiniMax-M2.7", "tidd-ec", "prompt framework"]},
    "PATTERNS":           {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session continue", "resume session"]},
}

RESOURCE_MAP = {
    "EXTERNAL_DISPATCH":  ["references/cli_reference.md", "references/integration_patterns.md"],
    "PARALLEL_DETACHED":  ["references/integration_patterns.md", "assets/prompt_templates.md"],
    "CROSS_AI_HANDBACK":  ["references/integration_patterns.md", "references/opencode_tools.md"],
    "AGENT_DISPATCH":     ["references/agent_delegation.md", "assets/prompt_templates.md"],
    "CROSS_REPO":         ["references/cli_reference.md", "references/opencode_tools.md"],
    "TEMPLATES":          ["assets/prompt_templates.md", "references/cli_reference.md"],
    "PATTERNS":           ["references/integration_patterns.md", "references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli_reference.md", "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "opencode agent", "opencode prompt", "share url", "ablation", "worker farm", "self-invocation", "memory handback", "minimax", "minimax-2.7", "tidd-ec"],
    "ON_DEMAND": ["references/opencode_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about OpenCode CLI specifically?",
    "Does the task need the project's full plugin / skill / MCP runtime?",
    "Is a parallel detached session what they want?",
    "Is a non-Anthropic CLI handing back to OpenCode for a spec-kit workflow?",
]
```

**Call sequence** (using shared helpers from `shared_smart_router.md`):

1. `discover_markdown_resources()` — recursively enumerate current `.md` files under existing `references/` and `assets/` folders at routing time.
2. `_guard_in_skill()` + `load_if_available()` — sandbox paths to this skill, reject non-markdown loads, skip missing files, and suppress duplicates.
3. `score_intents(task)` and `select_intents(scores, ambiguity_delta=1.0)` — preserve provider-specific weighted intent scoring and top-2 ambiguity handling.
4. `get_routing_key(task, intents)` — derive the provider routing key from task/provider context, then fall back to `opencode`.
5. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
6. CONDITIONAL-load `RESOURCE_MAP[intent]`, ON_DEMAND-load keyword matches, and return a notice when no provider-specific knowledge base is available beyond always-load resources.

The `route_opencode_resources(task)` function body lives in [`shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `opencode`.

---

## 3. HOW IT WORKS

### Prerequisites

```bash
# Verify installation (cli-opencode v1.0.0 is pinned to opencode v1.3.17)
opencode --version | grep -q '^1\.' || echo "Not installed or version drift. See references/cli_reference.md §9."

# Self-invocation guard
env | grep -q '^OPENCODE_' && echo "ERROR: Already inside OpenCode session"

# Authentication — providers configured via opencode providers (alias auth)
opencode providers
```

**Authentication options**: `opencode providers login <provider>` (and `opencode auth login` for subscription plans) for OAuth and API key flows. Configured providers on a typical install: `opencode-go` (api, DEFAULT), `deepseek` (api, fallback), `minimax-coding-plan` (MiniMax Token Plan subscription — **DEFAULT MiniMax path**; `opencode auth login`; model `minimax-coding-plan/MiniMax-M3-highspeed`), `minimax` (MiniMax Direct API, pay-per-token — `MINIMAX_API_KEY`, model `minimax/MiniMax-M2.7`), `openai` (api, premium alternative for `gpt-5.5`/`gpt-5.5-pro`/`gpt-5.5-fast`).

### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default provider may not be logged in on this machine — silently failing with `provider/model not found` or `401 Unauthorized` mid-dispatch wastes a round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: list configured providers, capture for routing
PROVIDERS=$(opencode providers list 2>&1)
echo "$PROVIDERS" | grep -q "opencode-go"         && OPENCODE_GO_OK=1    || OPENCODE_GO_OK=0
echo "$PROVIDERS" | grep -q "deepseek"            && DEEPSEEK_OK=1       || DEEPSEEK_OK=0
echo "$PROVIDERS" | grep -q "minimax-coding-plan" && MINIMAX_TOKEN_OK=1  || MINIMAX_TOKEN_OK=0   # MiniMax Token Plan (default MiniMax path)
echo "$PROVIDERS" | grep -qE "minimax([^-]|$)"    && MINIMAX_DIRECT_OK=1 || MINIMAX_DIRECT_OK=0  # MiniMax Direct API (pay-per-token); regex skips the coding-plan provider
echo "$PROVIDERS" | grep -q "openai"              && OPENAI_OK=1         || OPENAI_OK=0
```

**Decision tree** (apply in order — first match wins):

| State | OPENCODE_GO_OK | DEEPSEEK_OK | OPENAI_OK | Action |
|-------|----------------|-------------|-----------|--------|
| Default available | 1 | * | * | Proceed with `--model opencode-go/deepseek-v4-pro --variant high` |
| Default missing, deepseek ready | 0 | 1 | * | **ASK user** before substituting — never auto-fall-back silently. Surface options A/B/C/D below. |
| Default missing, only openai ready | 0 | 0 | 1 | **ASK user** before substituting to OpenAI — surface options A/B/C/D below; OpenAI is a paid premium fallback. |
| All missing | 0 | 0 | 0 | **ASK user** to configure a provider — surface the login commands, do NOT dispatch. |

**MiniMax routing** (default = Token Plan; Direct API is the pay-per-token alternative — first match wins):

| State | Condition | Action |
|-------|-----------|--------|
| MiniMax requested (default) | `MINIMAX_TOKEN_OK=1` | Proceed with `--model minimax-coding-plan/MiniMax-M3-highspeed` — **omit `--agent`** (rejected on opencode 1.15.13); fall back to `minimax-coding-plan/MiniMax-M2.7-highspeed` if M3-highspeed is unavailable |
| Token Plan not configured | `MINIMAX_TOKEN_OK=0` | **ASK user** to run `opencode auth login` → MiniMax Token Plan — never substitute silently |
| Direct API explicitly requested | `MINIMAX_DIRECT_OK=1` | Proceed with `--model minimax/MiniMax-M2.7` (pay-per-token; confirm the live id via `opencode models minimax`) |
| Direct API requested, not configured | `MINIMAX_DIRECT_OK=0` | **ASK user** to run `opencode providers login minimax` (needs `MINIMAX_API_KEY`) — never substitute silently |

**User prompt template — default missing, fallback configured:**

```
The skill default `opencode-go/deepseek-v4-pro` is not configured on this machine.
A configured fallback is available. Pick one:
  A) Use `deepseek/deepseek-v4-pro --variant high` (direct DeepSeek API, configured now)
  B) Use `openai/gpt-5.5-pro --variant high` (OpenAI premium, configured now — paid)
  C) Run `opencode providers login opencode-go` first, then retry the original dispatch
  D) Name a different model — paste the `--model <provider/model>` you want to use
```

**User prompt template — all providers missing:**

```
No supported providers are configured on this machine. Run one:
  - `opencode providers login opencode-go`  (recommended — default for cli-opencode)
  - `opencode providers login deepseek`     (direct DeepSeek API alternative)
  - `opencode auth login`                   (MiniMax Token Plan — default MiniMax path; pick "MiniMax Token Plan (minimax.io)" → provider minimax-coding-plan; model minimax-coding-plan/MiniMax-M3-highspeed)
  - `opencode providers login minimax`      (MiniMax Direct API — pay-per-token; needs MINIMAX_API_KEY; model minimax/MiniMax-M2.7)
  - `opencode providers login openai`       (OpenAI premium alternative — paid)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (credential expired or rotated), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

### Default Invocation (Skill Default)

**Default model + variant + format + dir**: `opencode-go/deepseek-v4-pro` · `--variant high` · `--format json` · `--dir <repo-root>`. The repo root pin avoids CWD ambiguity. OpenCode Go is the default provider — it routes DeepSeek and other open models through a single gateway and gives elevated reasoning at low cost for routine cli-opencode dispatches.

Use `opencode run --model opencode-go/deepseek-v4-pro --variant high --format json --dir <repo-root> "<prompt>"`.

> **The `--agent` flag (read this):** Do NOT pass `--agent` on a top-level `opencode run`. Current opencode treats named agents like `general` as **subagents** and rejects them at the top level, so `--agent general` fails the dispatch outright. When no `--agent` is given, the default agent runs — which is what you want for almost every dispatch. **To run as a specific agent profile, describe the role in the prompt body** (for example, open the prompt with "Act as a code-review agent: …"), not via `--agent`. Only pass `--agent <name>` if you have confirmed against `opencode run --help` on the installed version that it accepts that agent at the top level.

Honor explicit user model, port, and handback phrasing verbatim; otherwise use the default invocation above.

### Core Invocation Pattern

Core flags: `--model`, `--agent`, `--variant`, `--format json`, `--dir`, continuation/session/fork flags, `--share` and `--port` for detached sessions, `--file`, `--thinking`, `--pure`, and log flags.

> **Non-interactive invocation stdin**: always append `</dev/null` to any non-interactive `opencode run` invocation. Without it, opencode can inherit parent-terminal stdin and trigger the reactive-EOF exit path when that stream closes. See `references/integration_patterns.md` §6.

### Model Selection

Run `opencode providers list` to confirm credentials and `opencode models <provider>` for live choices. Default to `opencode-go/deepseek-v4-pro --variant high`; direct `deepseek/*`, the MiniMax Token Plan default `minimax-coding-plan/MiniMax-M3-highspeed` (fallback `minimax-coding-plan/MiniMax-M2.7-highspeed`; omit `--agent`), the pay-per-token `minimax/MiniMax-M2.7` (Direct API), and `openai/*` (e.g. `openai/gpt-5.5`, `openai/gpt-5.5-pro`, `openai/gpt-5.5-fast`) remain available when explicitly requested.

Shared small-model facts, context defaults, quota pools, and fallback targets live in `../sk-prompt/assets/model-profiles.json`.

### OpenCode Agent Delegation

The calling AI is the conductor. OpenCode distinguishes **primary agents** (directly invokable via `--agent <slug>`) from **subagents** (dispatched as Task-tool subagents from a primary).

#### Primary agents — directly invokable via `--agent`

OpenCode defines `general`, `plan`, `orchestrate`, and `ai-council` as primary agents. **Caveat — never pass `--agent general`:** the current opencode treats `general` as a subagent and rejects it at the top level, and the default agent (used when no `--agent` is given) already covers that case. Pin `--agent plan|orchestrate|ai-council` only when the task needs that profile AND `opencode run --help` on the installed version confirms top-level acceptance; otherwise state the role in the prompt body.

#### Subagents — dispatched as Task subagents from a primary

<!-- F-007-B2-01: clarified single-hop dispatch contract; deep-research/deep-review/improve-* are command-only -->

These live at `.opencode/agents/<slug>.md` with `mode: subagent` and are NOT directly invokable via `opencode run --agent`. Two dispatch surfaces are legal under the single-hop NDP contract:

1. **Generic subagents** (`context`, `review`, `write`, `debug`) — dispatched by a primary (`orchestrate`) using the Task tool. To exercise via the opencode CLI, route through `--agent orchestrate` and let it dispatch the relevant subagent.
2. **Command-owned loop executors** (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) — dispatched ONLY by their parent commands (`/deep:start-research-loop`, `/deep:start-review-loop`, `/deep:start-agent-improvement-loop`, `/prompt`). Never dispatch these directly via `--agent <slug>` and never route them through `orchestrate`. The parent command owns iteration state, convergence detection, and continuity.

Generic subagents (`context`, `review`, `write`, `debug`) route through `orchestrate`; loop executors (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) route only through their parent commands.

See [agent_delegation.md](./references/agent_delegation.md) for the complete agent roster and dispatch patterns.

### Unique OpenCode Strengths

OpenCode dispatch provides full project runtime loading, detached sessions, JSON event streams, agent routing, cross-repo/server dispatch, session continuation, and plugin-disable debugging.

### Essential Commands

Use the default invocation for external runtime handback, append `--share --port <N>` only for explicit detached sessions, select `--agent orchestrate` for generic subagent routing, and change `--dir` for cross-repo dispatch.

### Error Handling

Install missing binaries, refuse ambiguous self-invocation, run provider pre-flight for model/auth errors, check version drift for unknown flags, force `--format json` for empty streams, add `</dev/null` for background loops, confirm `--share`, use `--pure` only for plugin crashes, and inspect state logs for stuck sessions.

---

## 4. RULES

### ✅ ALWAYS

1. Verify OpenCode CLI is installed before first invocation; confirm version baseline against v1.3.17 (drift handling per `references/cli_reference.md` §9).
2. **Run the self-invocation guard before dispatch** (ADR-001): Layer 1 env-var lookup for any `OPENCODE_*`, Layer 2 process-ancestry probe for `opencode` parent, Layer 3 `~/.opencode/state/<id>/lock` probe. Trip on ANY positive — refuse unless prompt has explicit parallel-session keywords.
3. Pin model + variant + format + dir explicitly — **no `--agent`** (see the Default Invocation note: current opencode rejects a top-level `--agent general`; put any agent-profile request in the prompt body). Default: `--model opencode-go/deepseek-v4-pro --variant high --format json --dir <repo-root>`. Honor user overrides verbatim (e.g. `opencode-go/deepseek-v4-flash`, `opencode-go/glm-5.1`, `deepseek/deepseek-v4-pro`, `minimax-coding-plan/MiniMax-M3-highspeed`, `openai/gpt-5.5-pro`).
4. Pass `--format json` unless the calling AI explicitly wants formatted output — JSON event stream is what external runtimes parse incrementally.
5. **Append `</dev/null` to every non-interactive `opencode run` invocation** that redirects stdout and/or stderr to files OR runs inside `while read` loops. opencode v1.14.39 reads stdin at startup before session creation; without explicit closed stdin, automation hangs forever at 0% CPU after the `+60s service=snapshot prune=7.days cleanup` log line. Position: AFTER the prompt positional argument, BEFORE the `> stdout 2> stderr` redirects. Foreground `| tail` happens to provide closed stdin (pipe stage upstream is empty) and accidentally bypasses the bug, but `> stdout.log 2> stderr.log` does not. The 9-character `</dev/null` redirect provides immediate EOF on stdin, unblocking the dispatch. **DO NOT auto-kill external operator-owned opencode sessions** when sweeping orphans between dispatches; exclude `opencode run` from pkill (per 2026-05-23 operator directive captured in memory `feedback_proactive_orphan_cleanup.md`). See `references/integration_patterns.md` §6 + memory `feedback_opencode_run_requires_dev_null_stdin.md` + CHANGELOG-2026-05-08-tool-name-regex-fix.md §Fix 4.
6. **Pass the spec folder to the dispatched session** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the dispatched session cannot answer Gate 3 interactively in non-interactive `run` mode.
7. **Load `assets/prompt_quality_card.md` before building any dispatch prompt.** Apply the CLEAR 5-question check, tag the framework in the Bash invocation comment, and use the returned `ENHANCED_PROMPT`. If complexity ≥ 7/10 or compliance/security signals appear, dispatch `@prompt-improver` via the Task tool first.
8. Validate dispatched session output: parse JSON events incrementally (tool calls, partial messages, final summary), run syntax checks if code generated, and cross-reference against project standards via `sk-code` surface detection plus `sk-code-review` when findings-first review is requested (see ALWAYS rule 12).
9. Capture stderr (`2>&1`) to catch tool errors and warnings.
10. Classify the use case (1 / 2 / 3) before dispatching — the smart router refuses dispatches that do not map to one of the three.
11. **Run the Provider Auth Pre-Flight once per session** (see §3 Provider Auth Pre-Flight). Cache the configured-providers list. If the default `opencode-go` is missing, ASK the user — never silently substitute the model. If a later dispatch returns an auth error, invalidate the cache and rerun the pre-flight before retrying.
12. **Code Standards Loading (surface-aware contract)** — When dispatching for code review or code generation, instruct the dispatched session to: (1) load `sk-code`; (2) let `sk-code` emit a surface tag matching the detected stack from markers and target files; (3) load the selected surface resources and run its verification commands; (4) add `sk-code-review` only for formal findings-first review output. Fallback: if the surface cannot be determined confidently, ask for the runtime surface and verification command set. NEVER hardcode obsolete sibling code skills in dispatch prompts.
13. **Destructive-scope-violation prevention (RM-8) for deep-loop dispatches** — If a permissions-matrix config is loaded (via `--permissions-matrix <path>` flag or recipe field), the structured gate applies and the four-layer prose mitigation is bypassed; see `references/permissions-matrix.md`. Without a loaded matrix, any non-interactive `opencode run` with `--dangerously-skip-permissions` against a populated worktree MUST apply the four-layer mitigation as a legacy fallback, deprecated-but-supported during transition: (L1) rendered prompt contains literal `BANNED OPERATIONS` and `ALLOWED WRITE PATHS`; (L2) `--dir` points at a fresh `git worktree`; (L3) main `git status` clean OR committed, recovery-baseline commit hash recorded; (L4) for multi-phase / phase-parent targets, prefer `cli-copilot` + `gpt-5.5 --reasoning-effort high` over `deepseek-v4-pro`. Background: on 2026-05-04 an `opencode-go/deepseek-v4-pro` dispatch under `/deep:start-review-loop:auto` deleted 44 files across two phase folders because the only safeguard was prose and `--dangerously-skip-permissions` granted unrestricted FS write. Full incident + root cause + checklist: `references/destructive_scope_violations.md`.
14. **Single-dispatch discipline (operator-gated, session-scoped)** — Default: launch ONE cli-* dispatch at a time across the cli-* family (cli-codex, cli-devin, cli-opencode, cli-claude-code, cli-gemini). Wait for the dispatched agent's work to return, verify outputs exist, then SIGKILL the dispatcher process + any orphan children (`pkill -9 -f "opencode run"` for this skill, plus `gtimeout` / `positional_scoring_fallback:app` cleanup). Only launch the next dispatch (this skill OR a sibling) after the prior one is dead and RSS has dropped. **Within a deep-flow session** (deep-review / deep-research): the operator authorizes the whole multi-iteration session at start — iterations chain back-to-back with kill-between as the safety mechanism, NOT a per-iteration operator confirmation prompt. **Exception (cross-skill parallel)**: when the operator explicitly authorizes N parallel dispatches, run N concurrently — but still SIGKILL each as its work returns.
15. **Set `AI_SESSION_CHILD=1` in the dispatched session's env** when sessions may be launched through the per-session worktree wrapper (`.opencode/bin/worktree-session.sh`). A dispatched `opencode run` is an orchestrated sub-session, not a new top-level session, so it must SHARE the parent's worktree rather than allocate its own. The wrapper checks `AI_SESSION_CHILD` (plus a `git --git-common-dir` structural backstop) and exec's in place when set. Pattern: `AI_SESSION_CHILD=1 opencode run ... </dev/null`. Harmless when the wrapper is not in use. See `.opencode/bin/README.md` → "Worktree session isolation".

### ❌ NEVER

1. Invoke this skill from within OpenCode itself for a self-dispatch — refuse with the documented error message; use a sibling cli-* / fresh shell / parallel-session keywords.
2. Pass `--share` without operator confirmation (CHK-033) — share URL exposes session contents.
3. Trust dispatched session output blindly for security-sensitive code, send sensitive data (API keys, passwords, credentials) in prompts, or hammer the API with rapid sequential calls.
4. Use `--pure` outside of plugin debugging (disabling plugins removes the entire point of cli-opencode dispatch).
5. Nest `opencode run` inside a dispatched session's tool calls — use OpenCode's native Task tool for sub-agent dispatch.

### ⚠️ ESCALATE IF

1. OpenCode CLI is not installed and user has not acknowledged (provide `brew install opencode` or `curl -fsSL https://opencode.ai/install | bash`).
2. Operator wants to publish a `--share` URL — get explicit confirmation per CHK-033.
3. Binary version differs from the v1.3.17 baseline — run `opencode --version` and `opencode run --help`; surface drift and fall back or require approval.
4. Smart router cannot map the prompt to one of the three use cases — surface the disambiguation checklist from UNKNOWN_FALLBACK.
5. Self-invocation guard trips AND the prompt is ambiguous — surface the refusal with three remediation options (sibling cli-* / fresh shell / parallel-session keywords).

### Memory Handback Protocol

When the calling AI needs to preserve session context from an OpenCode CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../system-spec-kit/references/cli/memory_handback.md).

OpenCode-specific Memory Epilogue template: see [assets/prompt_templates.md](./assets/prompt_templates.md) §14.

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) - Full subcommand and flag reference, models, version drift handling
- [integration_patterns.md](./references/integration_patterns.md) - 3 use cases, decision tree, self-invocation guard, silent stdin
- [opencode_tools.md](./references/opencode_tools.md) - Unique value props vs sibling cli-* skills
- [agent_delegation.md](./references/agent_delegation.md) - Agent routing matrix, leaf-agent constraints
- [destructive_scope_violations.md](./references/destructive_scope_violations.md) - RM-8 incident (2026-05-04, 44 files deleted), root cause analysis, four-layer prevention playbook

### Templates and Assets

- [prompt_templates.md](./assets/prompt_templates.md) - 13 numbered copy-paste templates per use case + agent + handback
- [prompt_quality_card.md](./assets/prompt_quality_card.md) - Framework selection, CLEAR 5-check, escalation triggers

### Shared (cli-* family)
- [shared_smart_router.md](../system-spec-kit/references/cli/shared_smart_router.md) - Helper-function bodies for the smart router.
- [memory_handback.md](../system-spec-kit/references/cli/memory_handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [OpenCode GitHub](https://github.com/sst/opencode) - Official repository
- [OpenCode Install](https://opencode.ai/install) - Standalone installer entry point
- [OpenCode Documentation](https://opencode.ai/docs) - Official docs

### Reference Loading Notes

- Load only references needed for current intent.
- Smart Routing (Section 2) is the single routing authority.
- `cli_reference.md` and `prompt_quality_card.md` are ALWAYS loaded as baseline.

---

## 6. SUCCESS CRITERIA

### Task Completion

- OpenCode CLI invoked with the correct subcommand, flags, model, agent, variant, format, and dir.
- Self-invocation guard checked before dispatch — refused when appropriate.
- Use case (1 / 2 / 3) classified explicitly before invocation.
- JSON event stream captured, parsed incrementally, validated, integrated.
- No security vulnerabilities introduced from generated code.
- `--share` URLs opt-in with operator confirmation per CHK-033.
- Background dispatches in `while read` loops include `</dev/null` redirect.
- Memory Handback extracted and saved through `generate-context.js` when applicable.

### Skill Quality

- All 8 sections present with proper anchor comments.
- Smart routing covers all intent signals with UNKNOWN_FALLBACK.
- Reference files provide deep-dive content without duplication.
- Self-invocation guard pseudocode reproduced in Section 2 mirrors ADR-001.

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via the Skill Advisor Hook (or `skill_advisor.py` fallback)
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP (`generate-context.js`)
- **Validation**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` for spec-folder workflows

**Tool roles**: Bash dispatches the CLI; Read/Glob/Grep validate output and probe `~/.opencode/state/` for session locks.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/cli_reference.md`, `references/integration_patterns.md`, `assets/prompt_quality_card.md`, `assets/prompt_templates.md`, `references/agent_delegation.md`, `references/opencode_tools.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Related skills: `cli-claude-code`, `cli-codex`, and `cli-gemini` for sibling cross-AI dispatch; `system-spec-kit` for handback; `sk-code` plus the selected overlay for generated code; `deep-research` and `deep-review` for loop execution; and `mcp-code-mode` for MCP-backed tools.
