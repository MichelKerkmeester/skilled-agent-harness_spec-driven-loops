---
name: cli-opencode
description: "OpenCode CLI orchestrator: external dispatch, in-OpenCode parallel sessions, cross-AI handback with full runtime context."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.3.15.3
hard_rules:
  - id: stdin-redirect-required
    check: stdin-redirect-required
    message: "Ad-hoc `opencode run` MUST close/redirect stdin (`</dev/null`) — omitting it can hang indefinitely at 0% CPU with zero output."
    severity: warn
  - id: no-bare-agent-general
    check: no-bare-agent-general
    message: "Never pass a bare top-level `--agent general`; opencode rejects it on run."
    severity: warn
  - id: command-flag-for-slash-prompt
    check: command-flag-for-slash-prompt
    message: "A slash-command-shaped prompt (`/family:name ...`) needs `--command <family>/<name>`, else opencode silently delivers the slash text as raw prose."
    severity: warn
  - id: share-requires-confirmation
    check: share-requires-confirmation
    message: "`--share` publishes the session and requires prior operator confirmation."
    severity: warn
---

<!-- Keywords: opencode, opencode-cli, opencode-run, cross-ai, spec-kit-runtime, plugin-runtime, parallel-sessions, share-url, detached-session, agent-delegation, deepseek, openai, minimax, minimax-coding-plan, minimax-m3, token-plan, xiaomi, xiaomi-token-plan, xiaomi-token-plan-ams, xiaomi-api, xiaomi-direct, mimo, mimo-v2.5-pro, mimo-v2.5-pro-ultraspeed, ultraspeed, glm-5.2, zai-coding-plan, z.ai-coding-plan, glm-coding-plan -->

# OpenCode CLI Orchestrator - Full-Runtime Cross-AI Dispatch

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the OpenCode CLI binary (`opencode`). If the agent currently reading this skill is itself running inside OpenCode (TUI / acp / serve / run modes — detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `opencode` invocation. The only exception is an explicit "parallel detached" request that intentionally spawns a SEPARATE session with its own session id and state directory.
>
> A running CLI skill never dispatches itself. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate OpenCode's `opencode run` from external AI assistants (Claude Code, OpenCode, raw shell) AND from inside an existing OpenCode session for parallel detached workers. Three documented use cases keep the cycle risk explicit while giving every dispatch path a copy-paste invocation shape.

**Core Principle**: The calling AI stays the conductor. Delegate to OpenCode for what it does best — full plugin, skill, MCP, and Spec Kit Memory runtime in a one-shot dispatch. Validate and integrate the output.

---

## 1. WHEN TO USE

### Activation Triggers

- **Full plugin / skill / MCP runtime** (use case 1) — calling AI is Claude Code / OpenCode / Copilot / raw shell AND the task needs the project's full Spec Kit Memory database, Code Graph semantic index, structural code graph, or every plugin/skill/MCP tool in a one-shot dispatch. Includes `@deep-research` / `@deep-review` agent loops with externalized state under `.opencode/specs/`.
- **Parallel detached session** (use case 2) — operator already inside OpenCode (TUI / web / serve / acp) AND wants a SEPARATE session with its own session id and state directory for ablation, worker farm, or parallel research. Prompt explicitly mentions "parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", or "share URL".
- **Cross-AI orchestration handback** (use case 3) — calling AI is non-Anthropic (OpenCode / Copilot), task targets a project-specific subsystem (spec-kit, memory, code-graph, advisor), and the non-Anthropic CLI cannot load the project's plugin/skill/MCP runtime on its own and needs OpenCode as a bridge. When the caller only needs a daemon-backed tool call, prefer the shipped front doors (`spec-memory.cjs`, `code-index.cjs`, `skill-advisor.cjs`) over a full `opencode run` delegation.
- **Agent dispatch** — task matches a specialized OpenCode agent. Primary agents (directly invokable via `--agent`): `general`, `plan` (built-in), `orchestrate`. Generic subagents fully dispatched via the orchestrate primary: `context`, `review`, `write`, `debug`, `ai-council`. Command-owned loop executors (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) are owned end-to-end by their parent `/deep:*` command; `orchestrate` may perform exactly one bounded hand-off dispatch to a recognized loop request, but never manages the loop itself. See §3 "OpenCode Agent Delegation" for the full contract.
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

Intent-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared_smart_router.md`](../../system-spec-kit/references/cli/shared_smart_router.md)):

- Pattern 1: Runtime Discovery - `discover_markdown_resources()` recursively scans existing `references/` and `assets/` folders with `base.exists()` safeguards.
- Pattern 2: Existence-Check Before Load - `load_if_available()` uses `_guard_in_skill()`, `inventory`, and `seen` so raw loads, missing files, duplicate loads, and path escapes are rejected.
- Pattern 3: Not applicable here - `cli-opencode` has flat resource folders, not keyed `references/<key>/` or `assets/<key>/` subdirectories. Routing selects from `RESOURCE_MAP` by intent signal rather than by runtime resource key.
- Pattern 4: Multi-Tier Graceful Fallback - low-confidence intent scores return `UNKNOWN_FALLBACK` with a disambiguation checklist; missing intent resources still return always-load baseline docs plus a clear notice.

```python
INTENT_SIGNALS = {
    "EXTERNAL_DISPATCH":  {"weight": 4, "keywords": ["delegate to opencode", "opencode run", "from claude code", "from opencode", "from copilot", "external runtime", "full plugin runtime"]},
    "PARALLEL_DETACHED":  {"weight": 4, "keywords": ["parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", "share url", "share-url", "detached session"]},
    "CROSS_AI_HANDBACK":  {"weight": 4, "keywords": ["spec kit", "spec-kit", "spec_kit", "code graph", "memory_search", "session_bootstrap", "skill advisor", "cross-ai handback"]},
    "AGENT_DISPATCH":     {"weight": 4, "keywords": ["delegate", "agent", "deep-research", "deep-review", "ai-council", "review agent", "context agent"]},
    "CROSS_REPO":         {"weight": 3, "keywords": ["cross-repo", "different repo", "--dir", "another repository", "remote opencode"]},
    "TEMPLATES":          {"weight": 3, "keywords": ["template", "prompt", "how to ask", "opencode prompt", "minimax", "MiniMax-M3", "tidd-ec", "prompt framework"]},
    "PATTERNS":           {"weight": 3, "keywords": ["pattern", "workflow", "orchestrate", "session continue", "resume session"]},
    # WHY: DESIGN is an intent signal only. The durable sk-design loading contract lives in the
    # always-fires Design Standards Loading rule and the dispatch manifest; RESOURCE_MAP stays
    # limited to same-skill markdown paths.
    "DESIGN":             {"weight": 4, "keywords": ["sk-design", "interface design", "frontend design", "visual design", "redesign the ui", "design foundations", "design tokens", "motion design", "micro-interactions", "design audit", "ui critique", "extract design system", "generate design.md"]},
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
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "opencode agent", "opencode prompt", "share url", "ablation", "worker farm", "self-invocation", "memory handback", "minimax", "MiniMax-M3", "tidd-ec"],
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
4. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
5. CONDITIONAL-load existing `RESOURCE_MAP[intent]` entries via `load_if_available()`, ON_DEMAND-load keyword matches, and return a notice when no intent-specific knowledge base is available beyond always-load resources.

The `route_opencode_resources(task)` function body lives in [`shared_smart_router.md`](../../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `opencode`.

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

**Authentication options**: `opencode providers login <provider>` (and `opencode auth login` for subscription plans) for OAuth and API key flows. Configured providers on a typical install: `deepseek` (api, DEFAULT), `minimax-coding-plan` (MiniMax Token Plan subscription — **DEFAULT MiniMax path**; `opencode auth login`; model `minimax-coding-plan/MiniMax-M3`), `minimax` (MiniMax Direct API, pay-per-token — `opencode providers login minimax`; model `minimax/MiniMax-M3`), `xiaomi` (Xiaomi Direct API, pay-per-token — `opencode providers login xiaomi`; models `xiaomi/mimo-v2.5-pro` and the low-latency `xiaomi/mimo-v2.5-pro-ultraspeed`), `xiaomi-token-plan-ams` (Xiaomi Token Plan Europe; `opencode auth login`; model `xiaomi-token-plan-ams/mimo-v2.5-pro` — NOTE: observed not resolving on this install 2026-06-11 (ProviderModelNotFoundError surfaced as 'Unexpected server error'); re-auth via `opencode auth login` or use the `xiaomi` Direct API instead), `openai` (api, premium alternative — full GPT-5.6 catalog: a bare tier (`gpt-5.6`/`gpt-5.6-fast`/`gpt-5.6-pro`) plus three named families Sol/Terra/Luna, each in base/Fast/Pro model tiers (`gpt-5.6-sol`/`gpt-5.6-sol-fast`/`gpt-5.6-sol-pro`, `gpt-5.6-terra`/`gpt-5.6-terra-fast`/`gpt-5.6-terra-pro`, `gpt-5.6-luna`/`gpt-5.6-luna-fast`/`gpt-5.6-luna-pro`); `gpt-5.6-sol` is the flagship default).

### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default provider may not be logged in on this machine — silently failing with `provider/model not found` or `401 Unauthorized` mid-dispatch wastes a round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: list configured providers, capture for routing
PROVIDERS=$(opencode providers list 2>&1)
echo "$PROVIDERS" | grep -q "deepseek"            && DEEPSEEK_OK=1       || DEEPSEEK_OK=0
echo "$PROVIDERS" | grep -q "minimax-coding-plan" && MINIMAX_TOKEN_OK=1  || MINIMAX_TOKEN_OK=0   # MiniMax Token Plan (default MiniMax path)
echo "$PROVIDERS" | grep -qE "minimax([^-]|$)"    && MINIMAX_DIRECT_OK=1 || MINIMAX_DIRECT_OK=0  # MiniMax Direct API (pay-per-token); regex skips the coding-plan provider
echo "$PROVIDERS" | grep -q "xiaomi-token-plan-ams" && XIAOMI_OK=1       || XIAOMI_OK=0          # Xiaomi Token Plan (Europe)
echo "$PROVIDERS" | grep -qE "xiaomi([^-]|$)"     && XIAOMI_DIRECT_OK=1 || XIAOMI_DIRECT_OK=0   # Xiaomi Direct API (pay-per-token); regex skips the token-plan-ams provider
echo "$PROVIDERS" | grep -q "openai"              && OPENAI_OK=1         || OPENAI_OK=0
```

**Decision tree** (apply in order — first match wins):

| State | DEEPSEEK_OK | OPENAI_OK | Action |
|-------|-------------|-----------|--------|
| Default available | 1 | * | Proceed with `--model deepseek/deepseek-v4-pro --variant high` |
| Default missing, openai ready | 0 | 1 | **ASK user** before substituting to OpenAI — surface options A/B/C/D below; OpenAI is a paid premium fallback. |
| All missing | 0 | 0 | **ASK user** to configure a provider — surface the login commands, do NOT dispatch. |

**MiniMax routing** (default = Token Plan; Direct API is the pay-per-token alternative — first match wins):

| State | Condition | Action |
|-------|-----------|--------|
| MiniMax requested (default) | `MINIMAX_TOKEN_OK=1` | Proceed with `--model minimax-coding-plan/MiniMax-M3` — **omit `--agent`** (rejected on opencode 1.15.13) |
| Token Plan not configured | `MINIMAX_TOKEN_OK=0` | **ASK user** to run `opencode auth login` → MiniMax Token Plan — never substitute silently |
| Direct API explicitly requested | `MINIMAX_DIRECT_OK=1` | Proceed with `--model minimax/MiniMax-M3` (pay-per-token; confirm the live id via `opencode models minimax`) |
| Direct API requested, not configured | `MINIMAX_DIRECT_OK=0` | **ASK user** to run `opencode providers login minimax` (needs `MINIMAX_API_KEY`) — never substitute silently |

**MiMo routing** (Xiaomi Token Plan Europe and Xiaomi Direct API; explicitly-selectable — first match wins):

| State | Condition | Action |
|-------|-----------|--------|
| MiMo requested (default) | `XIAOMI_DIRECT_OK=1` | Proceed with `--model xiaomi/mimo-v2.5-pro --variant high` (high reasoning is the standing default — opencode maps low/medium/high to MiMo's reasoning effort) — **omit `--agent`** (`--agent general` warns and falls back on opencode 1.15.13); confirm the live id via `opencode models xiaomi` |
| MiMo speed variant requested ("ultraspeed", latency-sensitive checks/smokes) | `XIAOMI_DIRECT_OK=1` | Proceed with `--model xiaomi/mimo-v2.5-pro-ultraspeed --variant high` — low-latency MiMo-V2.5-Pro serving tier, same COSTAR prompt contract as the standard model |
| Direct API not configured | `XIAOMI_DIRECT_OK=0` | **ASK user** to run `opencode providers login xiaomi` — never substitute silently |
| Token Plan explicitly requested | `XIAOMI_OK=1` | Proceed with `--model xiaomi-token-plan-ams/mimo-v2.5-pro --variant high` — NOTE: observed not resolving on this install 2026-06-11 (ProviderModelNotFoundError surfaced as 'Unexpected server error'); re-auth via `opencode auth login` or use the `xiaomi` Direct API instead |
| Token Plan requested, not configured | `XIAOMI_OK=0` | **ASK user** to run `opencode auth login` → Xiaomi Token Plan (Europe) — never substitute silently |

**User prompt template — default missing, fallback configured:**

```
The skill default `deepseek/deepseek-v4-pro` is not configured on this machine.
A configured fallback is available. Pick one:
  A) Use `openai/gpt-5.6-sol-pro --variant high` (OpenAI premium, configured now — paid)
  B) Use `xiaomi/mimo-v2.5-pro --variant high` (Xiaomi Direct API, configured now) — or `xiaomi/mimo-v2.5-pro-ultraspeed --variant high` for latency-sensitive runs
  C) Use `kimi-for-coding/k2p7` (Kimi For Coding plan, configured now — subscription)
  D) Run `opencode providers login deepseek` first, then retry the original dispatch
  E) Name a different model — paste the `--model <provider/model>` you want to use
```

**User prompt template — all providers missing:**

```
No supported providers are configured on this machine. Run one:
  - `opencode providers login deepseek`     (recommended — default for cli-opencode)
  - `opencode auth login`                   (MiniMax Token Plan — default MiniMax path; pick "MiniMax Token Plan (minimax.io)" → provider minimax-coding-plan; model minimax-coding-plan/MiniMax-M3)
  - `opencode providers login minimax`      (MiniMax Direct API — pay-per-token; needs MINIMAX_API_KEY; model minimax/MiniMax-M3)
  - `opencode auth login`                   (Xiaomi Token Plan — default Xiaomi path; pick "Xiaomi Token Plan (Europe)" → provider xiaomi-token-plan-ams; model xiaomi-token-plan-ams/mimo-v2.5-pro)
  - `opencode providers login xiaomi`       (Xiaomi Direct API — pay-per-token; models xiaomi/mimo-v2.5-pro and xiaomi/mimo-v2.5-pro-ultraspeed)
  - `opencode auth login`                   (Kimi For Coding plan — Kimi/Moonshot coding subscription; provider kimi-for-coding; model kimi-for-coding/k2p7)
  - `opencode auth login`                   (Z.AI GLM Coding Plan — GLM coding subscription; provider zai-coding-plan; model zai-coding-plan/glm-5.2)
  - `opencode providers login openai`       (OpenAI premium alternative — paid)
Which would you like to set up? Confirm when login finishes; the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (credential expired or rotated), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a model the user didn't approve.

### Default Invocation (Skill Default)

**Default model + variant + format + dir**: `deepseek/deepseek-v4-pro` · `--variant high` · `--format json` · `--dir <repo-root>`. The repo root pin avoids CWD ambiguity. Direct DeepSeek is the default provider — it gives elevated reasoning at low cost for routine cli-opencode dispatches.

Use `opencode run --model deepseek/deepseek-v4-pro --variant high --format json --dir <repo-root> "<prompt>"`.

> **The `--agent` flag (read this):** Do NOT pass `--agent` on a top-level `opencode run`. Current opencode treats named agents like `general` as **subagents** and rejects them at the top level, so `--agent general` fails the dispatch outright. When no `--agent` is given, the default agent runs — which is what you want for almost every dispatch. **To run as a specific agent profile, describe the role in the prompt body** (for example, open the prompt with "Act as a code-review agent: …"), not via `--agent`. Only pass `--agent <name>` if you have confirmed against `opencode run --help` on the installed version that it accepts that agent at the top level.

Honor explicit user model, port, and handback phrasing verbatim; otherwise use the default invocation above.

### Core Invocation Pattern

Core flags: `--model`, `--agent`, `--variant`, `--format json`, `--dir`, continuation/session/fork flags, `--share` and `--port` for detached sessions, `--file`, `--thinking`, `--pure`, and log flags.

> **Non-interactive invocation stdin**: always append `</dev/null` to any non-interactive `opencode run` invocation. Without it, opencode can inherit parent-terminal stdin and trigger the reactive-EOF exit path when that stream closes. See `references/integration_patterns.md` §6.

> **Registered command dispatch (`--command`)**: slash-command text inside a `run` message is NOT expanded — `opencode run "/memory:search query"` delivers the slash text to the model as raw prose, and the command template (router contract, presentation assets, MUST-render envelopes) never enters the session. To execute a registered command non-interactively: `opencode run --command <family>/<name> [flags] "<args>"` — the message becomes `$ARGUMENTS`. Registry names are slash-namespaced: `memory/search` for `/memory:search` (a wrong `--command` name fails with the full registry list). Verified on opencode 1.17.4. Consequences: (a) any behavior/adherence probe of a slash command MUST use `--command`, and the raw-text form is only valid as a labeled negative control; (b) inside `` !`…` `` template injections `$ARGUMENTS` expands like `"$@"` — one word per argument — so renderer scripts must join argv themselves.

### Model Selection

Run `opencode providers list` to confirm credentials and `opencode models <provider>` for live choices. Default to `deepseek/deepseek-v4-pro --variant high` (direct DeepSeek API); the MiniMax Token Plan default `minimax-coding-plan/MiniMax-M3` (omit `--agent`), the pay-per-token `minimax/MiniMax-M3` (Direct API), `xiaomi-token-plan-ams/mimo-v2.5-pro --variant high` (Xiaomi Token Plan Europe — MiMo; high reasoning preset; omit `--agent`), `xiaomi/mimo-v2.5-pro --variant high` (Xiaomi Direct API — MiMo; pay-per-token) and `xiaomi/mimo-v2.5-pro-ultraspeed --variant high` (low-latency MiMo tier, same prompt contract) remain available. The Kimi For Coding plan model `kimi-for-coding/k2p7` ("Kimi K2.7 Code"; 256k / 262,144-token context; subscription billing — dispatch cost 0; omit `--agent`; `--variant high` accepted but effect benchmark-unverified) is the coding-optimized large-context Kimi path. **Operational caveat (observed 2026-06-17):** on broad / large-repo scopes at `--variant high`, k2p7 over-explores (many sequential reads) and can exceed a 600s timeout WITHOUT emitting — opencode flushes only the final assistant message to stdout, so a killed run yields 0 bytes (looks like a hang, but it was working). Mitigate with a hard read-cap in the prompt ("read ≤N files then emit") + a 1200s+ timeout, or omit `--variant`. The Z.AI GLM Coding Plan model `zai-coding-plan/glm-5.2` ("GLM-5.2"; flagship long-horizon coding; 1,000,000-token context / 131,072 output per Z.AI docs; subscription billing; omit `--agent`; `--variant`↔`reasoning_effort` mapping unverified — GLM has native high/max, smoke-test before relying on it; thinking on by default + preserved on the Coding Plan endpoint) is the Z.AI direct-provider GLM path, superseding the gateway-only `glm-5.1` removed in v1.3.15.0; confirm the live slug via `opencode models zai-coding-plan`. **Operational (benchmark 008, n=45):** thinking-on drives latency variance 6–161s (avg ~26s) — budget generous timeouts; expect ~1/45 transient dispatch failures (retry the cell). Empirical prompt framework: COSTAR (benchmark 008). **Vision (image input):** `glm-5.2` is natively multimodal (vision-to-code), but `opencode run --file <image>` does NOT deliver images to this provider — upstream #20802 for custom OpenAI-compatible providers (confirmed 2026-06-28: `--file` → `NO_IMAGE_RECEIVED`). For image input use the direct Z.AI Coding Plan multimodal API (base64 `image_url` at `https://api.z.ai/api/coding/paas/v4/chat/completions`) — a deviation from this skill's dispatch path justified only by the verified #20802 breakage; see `../../sk-prompt/prompt-models/references/models/glm-5.2.md` §7. OpenAI chat models — the full GPT-5.6 catalog spans a bare tier plus three named families (Sol, Terra, Luna), each offered in three model tiers (base / Fast / Pro) for twelve slugs total (`openai/gpt-5.6`, `openai/gpt-5.6-fast`, `openai/gpt-5.6-pro`, `openai/gpt-5.6-sol`, `openai/gpt-5.6-sol-fast`, `openai/gpt-5.6-sol-pro`, `openai/gpt-5.6-terra`, `openai/gpt-5.6-terra-fast`, `openai/gpt-5.6-terra-pro`, `openai/gpt-5.6-luna`, `openai/gpt-5.6-luna-fast`, `openai/gpt-5.6-luna-pro`) — usable when explicitly requested; **`gpt-5.6-sol` is the flagship default OpenAI model** for this skill. The model tier (base / Fast / Pro) is orthogonal to reasoning effort, which is the separate `--variant` lever up to **`xhigh`** (e.g. `--model openai/gpt-5.6-sol --variant xhigh`; per-tier effort ranges in `references/cli_reference.md` §5). **The `-fast` model tiers** (e.g. `openai/gpt-5.6-sol-fast`, `openai/gpt-5.6-terra-fast`) are the low-latency Fast variants (OpenAI `priority` service tier). Confirm live slugs via `opencode models openai`.

Shared small-model facts, context defaults, quota pools, and fallback targets live in `../../sk-prompt/prompt-models/assets/model_profiles.json`.

### OpenCode Agent Delegation

The calling AI is the conductor. OpenCode distinguishes **primary agents** (directly invokable via `--agent <slug>`) from **subagents** (dispatched as Task-tool subagents from a primary).

#### Primary agents — directly invokable via `--agent`

OpenCode defines `general`, `plan`, and `orchestrate` as primary agents. **Caveat — never pass `--agent general`:** the current opencode treats `general` as a subagent and rejects it at the top level, and the default agent (used when no `--agent` is given) already covers that case. Pin `--agent plan|orchestrate` only when the task needs that profile AND `opencode run --help` on the installed version confirms top-level acceptance; otherwise state the role in the prompt body.

#### Subagents — dispatched as Task subagents from a primary

These live at `.opencode/agents/<slug>.md` with `mode: subagent` and are NOT directly invokable via `opencode run --agent`. Three dispatch surfaces are legal under the single-hop NDP contract:

1. **Generic subagents** (`context`, `review`, `write`, `debug`) — dispatched by a primary (`orchestrate`) using the Task tool. To exercise via the opencode CLI, route through `--agent orchestrate` and let it dispatch the relevant subagent.
2. **`ai-council`** — dispatched either via its own `/deep:ai-council` command or via `orchestrate`'s registry-backed Task-dispatch. Direct `--agent ai-council` is rejected at the top level (`mode: subagent`); route through `/deep:ai-council` or `--agent orchestrate` with an ai-council-shaped prompt.
3. **Command-owned loop executors** (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) — LOOP-OWNED by their parent commands (`/deep:research`, `/deep:review`, `/deep:agent-improvement`, `/prompt`), which own iteration state, convergence detection, and continuity. Never dispatch these directly via raw `--agent <slug>` from the CLI. `orchestrate` is an authorized **caller/coordinator only** for these agents (e.g. its registry-backed `/deep:review` Priority row) — it may perform exactly one bounded hand-off dispatch to the resolved leaf, but MUST NOT re-implement the loop (no iterating, no convergence checks, no continuity tracking); that remains the parent command's job.

Generic subagents (`context`, `review`, `write`, `debug`) and `ai-council` route through `orchestrate` for full Task-tool dispatch; loop executors (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`) are loop-owned by their parent commands, with `orchestrate` limited to a single bounded hand-off when it recognizes one of these as the target.

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
3. Pin model + variant + format + dir explicitly — **no `--agent`** (see the Default Invocation note: current opencode rejects a top-level `--agent general`; put any agent-profile request in the prompt body). Default: `--model deepseek/deepseek-v4-pro --variant high --format json --dir <repo-root>`. Honor user overrides verbatim (e.g. `deepseek/deepseek-v4-pro`, `minimax-coding-plan/MiniMax-M3`, `minimax/MiniMax-M3`, `xiaomi-token-plan-ams/mimo-v2.5-pro`, `xiaomi/mimo-v2.5-pro`, `xiaomi/mimo-v2.5-pro-ultraspeed`, `openai/gpt-5.6-sol-pro`).
4. Pass `--format json` unless the calling AI explicitly wants formatted output — JSON event stream is what external runtimes parse incrementally.
5. **Append `</dev/null` to every non-interactive `opencode run` invocation** that redirects stdout and/or stderr to files OR runs inside `while read` loops. opencode v1.14.39 reads stdin at startup before session creation; without explicit closed stdin, automation hangs forever at 0% CPU after the `+60s service=snapshot prune=7.days cleanup` log line. Position: AFTER the prompt positional argument, BEFORE the `> stdout 2> stderr` redirects. Foreground `| tail` happens to provide closed stdin (pipe stage upstream is empty) and accidentally bypasses the bug, but `> stdout.log 2> stderr.log` does not. The 9-character `</dev/null` redirect provides immediate EOF on stdin, unblocking the dispatch. **DO NOT auto-kill external operator-owned opencode sessions** when sweeping orphans between dispatches; exclude `opencode run` from pkill (per 2026-05-23 operator directive captured in memory `feedback_proactive_orphan_cleanup.md`). See `references/integration_patterns.md` §6 + memory `feedback_opencode_run_requires_dev_null_stdin.md` + CHANGELOG-2026-05-08-tool-name-regex-fix.md §Fix 4.
6. **Pass the spec folder to the dispatched session** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the dispatched session cannot answer Gate 3 interactively in non-interactive `run` mode.
7. **Prompt construction & model-craft (cli-* family precedence).** Compose every dispatch prompt via the 3-tier rule canonical in `../../sk-prompt/prompt-models/assets/cli_prompt_quality_card.md`:
   1. **Fast path (default).** Build from the local `assets/prompt_quality_card.md`, which delegates the framework table + CLEAR check to the canonical card.
   2. **Model override (mandatory for a profiled model).** If the target model has a profile at `../../sk-prompt/prompt-models/references/models/<id>.md`, that profile OVERRIDES the cross-model default. The **sk-prompt/prompt-models** hub owns per-model prompt-craft (framework + scaffold + gotchas, mirroring `sk-prompt/prompt-models/assets/model_profiles.json` `recommended_frameworks`); consult it before composing for any small model.
   3. **Deep path (escalation).** Dispatch `@prompt-improver` via the Task tool (never load full `sk-prompt` inline) when any canonical **Tier 3** trigger applies — the trigger list lives in `../../sk-prompt/prompt-models/assets/cli_prompt_quality_card.md` under "Tier 3 — Deep path"; do not re-enumerate it here.
8. Validate dispatched session output: parse JSON events incrementally (tool calls, partial messages, final summary), run syntax checks if code generated, and cross-reference against project standards via `sk-code` surface detection plus its code-review mode when findings-first review is requested (see ALWAYS rule 12).
9. Capture stderr (`2>&1`) to catch tool errors and warnings.
10. Classify the use case (1 / 2 / 3) before dispatching — the smart router refuses dispatches that do not map to one of the three.
11. **Run the Provider Auth Pre-Flight once per session** (see §3 Provider Auth Pre-Flight). Cache the configured-providers list. If the default `deepseek` is missing, ASK the user — never silently substitute the model. If a later dispatch returns an auth error, invalidate the cache and rerun the pre-flight before retrying.
12. **Code Standards Loading (surface-aware contract)** — When dispatching for code review or code generation, instruct the dispatched session to: (1) load `sk-code`; (2) let `sk-code` emit a surface tag matching the detected stack from markers and target files; (3) load the selected surface resources and run its verification commands; (4) load `sk-code`'s code-review mode only for formal findings-first review output. Fallback: if the surface cannot be determined confidently, ask for the runtime surface and verification command set. NEVER hardcode obsolete sibling code skills in dispatch prompts.
13. **Design Standards Loading (surface-aware contract)** — When dispatching for design or UI work, instruct the dispatched session to: (1) load `sk-design` (the hub); (2) let the hub resolve a `workflowMode` through `mode-registry.json` (interface / foundations / motion / audit / md-generator / design-mcp-open-design); (3) load the selected mode packet, set the design register, and run that mode's design verification; (4) if the work feeds Open Design, carry the `design-mcp-open-design` pairing (a nested transport packet of the hub) — the transport never decides taste. Fallback: if the design mode cannot be determined confidently, ask for the surface and design intent. NEVER treat `mcp-figma` or `design-mcp-open-design` as the taste authority, or hardcode obsolete flat design skills in dispatch prompts.
14. **Pass the design dispatch manifest to the dispatched session** — when dispatching design or UI work, inline a `DESIGN_DISPATCH_MANIFEST v1` block in the prompt (the child cannot resolve skill paths, so the manifest travels in the payload, not by reference): `skDesignLoaded` true, `register` resolved to `Brand` or `Product` (never `unknown`), registry-valid `workflowModes`, `dials`, `loadedFiles`, and `proofDemandBack`. If the manifest cannot be assembled — `sk-design` not loaded, register unresolved, or no registry-valid mode — ASK before launching the child rather than starting a silent design dispatch. The child returns the demanded proof; the parent reconciles it on the return path.
15. **Destructive-scope-violation prevention (RM-8) for deep-loop dispatches** — If a permissions-matrix config is loaded (via `--permissions-matrix <path>` flag or recipe field), the structured gate applies and the four-layer prose mitigation is bypassed; see `references/permissions-matrix.md`. Without a loaded matrix, any non-interactive `opencode run` with `--dangerously-skip-permissions` against a populated worktree MUST apply the four-layer mitigation as a legacy fallback, deprecated-but-supported during transition: (L1) rendered prompt contains literal `BANNED OPERATIONS` and `ALLOWED WRITE PATHS`; (L2) `--dir` points at a fresh `git worktree`; (L3) main `git status` clean OR committed, recovery-baseline commit hash recorded; (L4) for multi-phase / phase-parent targets, prefer `cli-copilot` + `gpt-5.6-sol --reasoning-effort high` (verify `gpt-5.6-sol` availability on the Copilot surface — unverified, carried over from a gpt-5.5-era check; if absent, pick an available Copilot model, don't silently fall back to the risky default) over `deepseek-v4-pro`. Background: on 2026-05-04 an `opencode-go/deepseek-v4-pro` dispatch under `/deep:review:auto` deleted 44 files across two phase folders because the only safeguard was prose and `--dangerously-skip-permissions` granted unrestricted FS write. Full incident + root cause + checklist: `references/destructive_scope_violations.md`.
16. **Single-dispatch discipline (operator-gated, session-scoped)** — Default: launch ONE cli-* dispatch at a time across the cli-* family (cli-opencode, cli-claude-code). Wait for the dispatched agent's work to return, verify outputs exist, then SIGKILL only the dispatch THIS skill started: capture its PID at launch (`opencode run ... & OC_PID=$!`) and kill that captured PID directly plus its own orphan children (`kill -9 "$OC_PID" 2>/dev/null; pkill -9 -P "$OC_PID" 2>/dev/null`), then apply the same PID-scoped `gtimeout` / `positional_scoring_fallback:app` cleanup. (A backgrounded `opencode run &` is NOT a process-group leader unless launched with `setsid`/`set -m`, so a negative-PID group kill would target a nonexistent group and miss the process — kill the captured PID directly.) **Kill only the dispatch you started, by captured PID; never a blanket `pkill -9 -f "opencode run"` pattern — see Rule 5** (a blanket match kills operator-owned `opencode run` sessions too). Only launch the next dispatch (this skill OR a sibling) after the prior one is dead and RSS has dropped. **Within a deep-flow session** (deep-review / deep-research): the operator authorizes the whole multi-iteration session at start — iterations chain back-to-back with kill-between as the safety mechanism, NOT a per-iteration operator confirmation prompt. **Exception (cross-skill parallel)**: when the operator explicitly authorizes N parallel dispatches, run N concurrently — but still SIGKILL each by its own captured PID as its work returns.
17. **Set `AI_SESSION_CHILD=1` in the dispatched session's env** when sessions may be launched through the per-session worktree wrapper (`.opencode/bin/worktree-session.sh`). A dispatched `opencode run` is an orchestrated sub-session, not a new top-level session, so it must SHARE the parent's worktree rather than allocate its own. The wrapper checks `AI_SESSION_CHILD` (plus a `git --git-common-dir` structural backstop) and exec's in place when set. Pattern: `AI_SESSION_CHILD=1 opencode run ... </dev/null`. Harmless when the wrapper is not in use. See `.opencode/bin/README.md` → "Worktree session isolation".

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

When the calling AI needs to preserve session context from an OpenCode CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../../system-spec-kit/references/cli/memory_handback.md).

For read-only or hook-style recovery, use the daemon-backed CLI front doors instead of spawning OpenCode: `node .opencode/bin/spec-memory.cjs <tool>`, `node .opencode/bin/code-index.cjs <tool>`, or `node .opencode/bin/skill-advisor.cjs <tool>`. Prompt-time paths must probe warm sockets or pass `--warm-only`; exit `75` is retryable daemon/IPC unavailability, not a model failure.

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
- [prompt_quality_card.md](./assets/prompt_quality_card.md) - Executor-specific model overrides (MiniMax, MiMo); delegates shared framework table and CLEAR check to canonical card

### Shared (cli-* family)
- [shared_smart_router.md](../../system-spec-kit/references/cli/shared_smart_router.md) - Helper-function bodies for the smart router.
- [memory_handback.md](../../system-spec-kit/references/cli/memory_handback.md) - Canonical 7-step Memory Handback procedure.

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

This skill operates within the behavioral framework defined in [AGENTS.md](../../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via the Skill Advisor Hook (or `skill_advisor.py` fallback)
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP (`generate-context.js`)
- **Validation**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh` for spec-folder workflows

**Tool roles**: Bash dispatches the CLI; Read/Glob/Grep validate output and probe `~/.opencode/state/` for session locks.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/cli_reference.md`, `references/integration_patterns.md`, `assets/prompt_quality_card.md`, `assets/prompt_templates.md`, `references/agent_delegation.md`, `references/opencode_tools.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` when present.

Related skills: `cli-claude-code` and `cli-opencode` for sibling cross-AI dispatch; `system-spec-kit` for handback; `sk-code` plus the selected overlay for generated code; `system-deep-loop` for loop execution (its `research` and `review` modes); and `mcp-code-mode` for MCP-backed tools.
