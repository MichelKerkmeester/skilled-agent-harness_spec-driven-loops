---
name: cli-devin
description: "Devin CLI executor for Cognition-backed coding, cloud handoff, subagent delegation, and cross-AI validation."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.4.0.0
hard_rules:
  - id: devin-availability-required
    check: command-v-devin-required
    message: "Run `command -v devin` before every dispatch; if it fails, refuse the route without constructing or launching a command."
    severity: error
  - id: self-invocation-prohibited
    check: devin-self-invocation-guard
    message: "Refuse dispatch when Devin runtime signals are present; a running CLI skill never dispatches itself."
    severity: error
  - id: deep-loop-runtime-required
    check: deep-loop-runtime-delegation
    message: "Delegate execution to the shipped deep-loop runtime; this skill must not implement a second Devin adapter."
    severity: error
---

<!-- Keywords: devin, devin-cli, cognition, cross-ai, cloud-handoff, subagent-delegation, code-generation, code-review, second-opinion, multi-model, session-management, handoff, swe -->

# Devin CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the Cognition CLI binary (`devin`). If the agent currently reading this skill is itself running inside Devin (detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `devin` invocation.
>
> A running CLI skill never dispatches itself. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate Cognition's Devin CLI for tasks that benefit from a second AI perspective, multi-model selection (DeepSeek, GLM-5.2, GPT-5.6 Luna Max, Grok (4.5 and 4.6), SWE-1.7), subagent delegation with `run_subagent`, cloud handoff via `/handoff`, or parallel code generation.

**Core Principle**: Use Devin for what it does best. Delegate, validate, integrate. The calling AI stays the conductor.

---

## 1. WHEN TO USE

### Activation Triggers

- **Cross-AI Validation** — code review second perspective, security audit alternative analysis, bug detection, independent implementation attempts.
- **Cloud Handoff** — long-running tasks, complex refactors, CI-like validation, browser-dependent workflows offloaded to a cloud Devin session via `/handoff`.
- **Subagent Delegation** — specialized profile matches (`subagent_explore`, `subagent_general`, custom `.devin/agents/[name]/AGENT.md` profiles), parallel task processing through Devin's native subagent system.
- **Multi-Model Dispatch** — tasks that specifically want a model available through Devin's multi-model surface (DeepSeek, GLM-5.2, GPT-5.6 Luna Max, Grok (4.5 and 4.6), SWE-1.7), selected per-dispatch with `--model`.
- **Parallel Code Generation** — offloading generation, simultaneous code generations, background docs/test generation through subagents.
- **Specialized Generation** — explicit Devin requests, test suite generation, code translation, batch documentation, visual input via clipboard paste or `@` file mentions.

### When NOT to Use

- **You ARE Devin already.** If your runtime is Devin (detection signal: `$DEVIN_PROJECT_DIR` env var set, `devin` in process ancestry, or credentials present at `~/.local/share/devin/credentials.toml` while a session is active), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value.
- Simple, quick tasks where CLI overhead is not worth it, or tasks needing an immediate response (auth/network round-trips may delay).
- Context already loaded and understood by the current agent.
- Interactive refinement requiring the full-screen REPL (use `devin` directly instead).
- Tasks where Devin CLI is not installed.

---

## 2. SMART ROUTING

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

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md)):

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
    # WHY: DESIGN is an intent signal only. The durable sk-design loading contract lives in the
    # always-fires Design Standards Loading rule and the dispatch manifest; RESOURCE_MAP stays
    # limited to same-skill markdown paths.
    "DESIGN":            {"weight": 4, "keywords": ["sk-design", "interface design", "frontend design", "visual design", "redesign the ui", "design foundations", "design tokens", "motion design", "micro-interactions", "design audit", "ui critique", "extract design system", "generate design.md"]},
}

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

**Call sequence** (using shared helpers from `shared-smart-router.md`):

1. `discover_markdown_resources()` — recursively enumerate current `.md` files under existing `references/` and `assets/` folders at routing time.
2. `_guard_in_skill()` + `load_if_available()` — sandbox paths to this skill, reject non-markdown loads, skip missing files, and suppress duplicates.
3. `score_intents(task)` and `select_intents(scores, ambiguity_delta=1.0)` — preserve provider-specific weighted intent scoring and top-2 ambiguity handling.
4. `get_routing_key(task, intents)` — derive the provider routing key from task/provider context, then fall back to `devin`.
5. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
6. CONDITIONAL-load `RESOURCE_MAP[intent]`, ON_DEMAND-load keyword matches, and return a notice when no provider-specific knowledge base is available beyond always-load resources.

The `route_devin_resources(task)` function body lives in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md) — substitute `<PROVIDER>` = `devin`.

---

## 3. HOW IT WORKS

### Prerequisites

Install via `devin setup` (interactive wizard) or `curl -fsSL https://devin.ai/install | bash`. cli-devin authenticates through **Devin account OAuth** — run `devin auth login` and complete the browser flow (or `--force-manual-token-flow` for SSH/remote sessions). Full install, auth, flag, permission-mode, session, and troubleshooting tables live in the ALWAYS-loaded [cli-reference.md](./references/cli-reference.md) — this section keeps only the routing decisions and dispatch-critical gotchas.

### Execution Ownership

This packet owns user-facing routing, the `command -v devin` availability probe, prompt construction, and the self-invocation guard. Actual process construction and execution delegate to the already-shipped deep-loop runtime at `../../system-deep-loop/runtime/scripts/fanout-run.cjs`, using executor kind `cli-devin`.

The runtime is the single Devin execution adapter. Do not add a packet-local wrapper, command builder, or spawn path. Direct `devin -p` snippets below are operator reference and manual-testing examples; orchestrated dispatches use the shared runtime.

### Provider Auth Pre-Flight (Devin Account OAuth)

**MANDATORY before any first dispatch in a session.** cli-devin authenticates through Devin account OAuth only. If `devin auth login` has not been completed on this machine, a dispatch fails with an authentication error mid-round-trip. Run this check once per session, cache the result, and re-run it only if a dispatch fails with an auth error.

```bash
# One-shot pre-flight: capture Devin auth status for routing
DEVIN_AUTH=$(devin auth status 2>&1)
echo "$DEVIN_AUTH" | grep -qi "logged in" && DEVIN_AUTH_OK=1 || DEVIN_AUTH_OK=0
```

**Decision tree** (apply in order — first match wins):

| State | DEVIN_AUTH_OK | Action |
|-------|---------------|--------|
| OAuth ready | 1 | Proceed with `devin -p --model <model> --permission-mode <mode> -- "<prompt>"` |
| Not logged in | 0 | **ASK user** to run `devin auth login` — surface the command, do NOT dispatch. Never substitute a different auth method or skip the check. |

**User prompt template — not logged in:**

```
Devin is not authenticated on this machine. cli-devin uses Devin account OAuth only.
Run `devin auth login` (browser flow; or `devin auth login --force-manual-token-flow` for SSH/remote),
then confirm when login finishes — the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (OAuth expired or revoked), invalidate the cache, rerun `devin auth login`, and re-check before retrying. Never substitute a model the user didn't approve.

### Default Invocation (Skill Default)

**Default model + permission mode**: `swe` (alias → `swe-1-7-lightning`) · `accept-edits` permission mode. Balances speed, cost, and quality for the typical delegation.

```bash
devin -p \
  --model swe \
  --permission-mode accept-edits \
  -- \
  "<prompt>"
```

**User override** (honor explicit user phrasing verbatim):

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model swe --permission-mode accept-edits` |
| "Use glm" | `--model glm-5-2 --permission-mode accept-edits` |
| "Use glm max" | `--model glm-5-2-max --permission-mode accept-edits` |
| "Use grok high" | `--model grok-4-6-high --permission-mode accept-edits` |
| "Use deepseek" | `--model deepseek-v4-pro --permission-mode accept-edits` |
| "Use swe max" | `--model swe-1-7 --permission-mode accept-edits` |
| "Use glm dangerous" | `--model glm-5-2 --permission-mode dangerous` |
| "Use autonomous sandbox" | `--sandbox --permission-mode autonomous` |

Honor whichever dimensions the user names. Model stays on `swe` and permission mode stays on `accept-edits` unless the user explicitly names a different model or mode.

### Model Selection

Default `swe` (alias → `swe-1-7-lightning`). Switch per-dispatch with `--model <name>`; there is no headless reasoning-effort flag, so autonomy is set through `--permission-mode`. Curated families, alphabetical: DeepSeek (`deepseek-v4-pro`, `deepseek-v4-flash-max`, `deepseek-v4-pro-max`), GLM-5.2 (`glm-5-2`, `glm-5-2-1m`, `glm-5-2-max`, `glm-5-2-max-1m`, `glm-5-2-none`, `glm-5-2-none-1m`), GPT-5.6 Luna Max (`gpt-5-6-luna-max`, `gpt-5-6-luna-max-priority`), Grok 4.5 (`grok-4-5-high`, `grok-4-5-low`, `grok-4-5-medium`), Grok 4.6 (`grok-4-6-high`, `grok-4-6-low`, `grok-4-6-medium`, `grok-4-6-xhigh`), SWE-1.7 (`swe-1-7`, `swe-1-7-lightning`, `swe-1-7-medium`) — full roster and the permission-mode effort lever in [references/providers-and-models.md](references/providers-and-models.md).

**Selection Strategy**: default `swe` for quick edits and cost-sensitive work; switch to `grok-4-6-high` (or `-xhigh` for the deepest passes) for reasoning-heavy work (architecture, security, deep planning); use `glm-5-2` / `glm-5-2-max` for general generation; use `swe-1-7` for max-effort SWE work. Per-task rationale table: [cli-reference.md](./references/cli-reference.md) §5.

### Devin Subagent Delegation

The calling AI is the conductor; Devin's `run_subagent` tool spawns independent workers that share tools and codebase context but operate in their own conversation chain. Two built-in profiles (`subagent_explore` read-only, `subagent_general` full-access) plus custom `.devin/agents/[name]/AGENT.md` profiles shape HOW Devin processes the subtask. Full roster and invocation patterns: [agent-delegation.md](./references/agent-delegation.md).

| Task Type | Profile | Model |
|-----------|---------|-------|
| Read-only codebase exploration | `subagent_explore` | Default subagent model (SWE-1.6) |
| General-purpose code changes | `subagent_general` | Same as parent agent |
| Custom specialized worker | `.devin/agents/[name]/AGENT.md` | Pinned in AGENT.md or default |

Subagents run foreground (parent pauses) or background (parallel, auto-deny unapproved tools). The `run_subagent` tool takes a profile, not a model — to pin a model on a write-capable subagent, use a custom AGENT.md with a `model:` field.

### Devin Skills, Rules, and Native Agent Profiles

The installed Devin CLI discovers repository skills and rules that are already present; this phase does not add adapters for either mechanism. On Devin `3000.2.17`, the live `devin skills list` output included these repo-local packets:

```text
  /sk-doc [user,model] (./.opencode/skills/sk-doc)
  /cli-external-orchestration [user,model] (./.opencode/skills/cli-external-orchestration)
  /sk-git [user,model] (./.opencode/skills/sk-git)
  /mcp-tooling [user,model] (./.opencode/skills/mcp-tooling)
  /mcp-code-mode [user,model] (./.opencode/skills/mcp-code-mode)
  /system-skill-advisor [user,model] (./.opencode/skills/system-skill-advisor)
  /system-spec-kit [user,model] (./.opencode/skills/system-spec-kit)
  /sk-code [user,model] (./.opencode/skills/sk-code)
  /system-deep-loop [user,model] (./.opencode/skills/system-deep-loop)
  /sk-prompt [user,model] (./.opencode/skills/sk-prompt)
  /sk-design [user,model] (./.opencode/skills/sk-design)
```

The phase's live context records Devin as discovering 13 top-level skill packets. The rerun in this checkout printed the 12 concrete `./.opencode/skills/*` paths above, plus the external `devin-cli` packet and the empty-path `declarative-repo-setup` entry; the output is preserved here rather than inventing a filesystem path for the thirteenth local packet.

The live `devin rules list` output was:

```text
Available Rules

  global_rules [Windsurf] always-on
  CLAUDE [Claude] always-on
  AGENTS [Standard] always-on
  CLAUDE [Claude] always-on
```

This means root `CLAUDE.md`/`AGENTS.md` context is already surfaced by Devin. It is discovery behavior to document, not a build gap.

#### Agent Roster Parity

All 13 repo agents are dispatchable through `run_subagent`: `ai-council`, `code`, `context`, `debug`, `deep-alignment`, `deep-improvement`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`, `prompt-improver`, `review`. A live roster probe lists them alongside Devin's own `subagent_explore` and `subagent_general`.

Each `.devin/agents/<name>/AGENT.md` is a **symlink** to the canonical `.claude/agents/<name>.md`, matching the discovery-mirror precedent already used for `.claude/hooks/` and `.codex/hooks/`. One source of truth, so a mirror can never drift from the agent it mirrors.

This works because Devin's failure with Claude-format agents is a *discovery-path* limitation, not a *format-parsing* one: the same file Devin ignores at `.claude/agents/<name>.md` registers correctly once reachable at Devin's own `.devin/agents/<name>/AGENT.md` path -- Claude's `tools:` frontmatter field is accepted as-is, so no per-agent translation to `allowed-tools:` is needed.

Invoke by naming the profile explicitly:

```bash
command -v devin
devin --permission-mode bypass -p \
  "Use the review subagent to review the current diff for correctness, security, and repository-convention consistency. Cite file paths and line numbers." \
  2>&1
```

The native profile format is documented by Devin at [docs.devin.ai/cli/subagents](https://docs.devin.ai/cli/subagents). It is experimental and uses `.devin/agents/[name]/AGENT.md` with YAML fields such as `name`, `description`, `model`, `allowed-tools`, `permissions`, and `max-nesting`.

#### Installed-Version Import Correction

Devin's docs claim that `.claude/agents/*.md` files are automatically imported. A live probe against the installed Devin `3000.2.17` found the repo's 13-file `.claude/agents/` directory but reported that none of those profiles were usable through `run_subagent`; only `subagent_explore` and `subagent_general` were dispatchable. This is a confirmed installed-version finding, not an assumption. A native `.devin/agents/[name]/AGENT.md` profile is required for a custom profile here. The older import note in the reference material must not be treated as working behavior for this version.

#### Devin Has No Command-File System

Commands are not a missing Devin parity feature. The installed `devin --help` lists `auth`, `mcp`, `models`, `rules`, `skills`, `plugins`, `cloud`, `list`, `update`, `version`, `migrate`, `sandbox`, `setup`, `uninstall`, `acp`, `shell`, and `help`; it has no `commands` subcommand. A direct `devin commands` probe returns `error: unexpected argument 'commands' found`, and the installed docs expose no command-file directory. This is an architectural non-concept for Devin, not a build gap.

### Cloud Handoff

Devin's unique `/handoff` command transfers the current session to a cloud Devin session with its own VM, shell, browser, and full repo access. Use for long-running tasks, complex refactors, CI-like validation, browser-dependent workflows, and parallel execution. Full mechanics and state transfer: [cloud-handoff.md](./references/cloud-handoff.md).

### Dispatch-Critical Gotchas

The full flag glossary, permission modes, unique capabilities (`/handoff`, `run_subagent`, `devin mcp`, session resume/continue, `--sandbox`), essential command examples, and troubleshooting table are in the ALWAYS-loaded [cli-reference.md](./references/cli-reference.md). Four gotchas that silently break a dispatch and must be honored at routing time:

- **`devin -p` is non-interactive and exits after one turn** — it prints the response to stdout and exits. For multi-turn work, use `devin -c` (continue) or `devin -r <session-id>` (resume). Do not expect a REPL from `-p`.
- **`--permission-mode` defaults to `auto` (read-only auto-approve)** — file-modification tasks silently prompt or no-op without elevated mode. Pass `--permission-mode accept-edits` (or `dangerous` for full auto-approve) whenever the task requires edits. The `--sandbox` flag selects `autonomous` mode and is the only mode available in sandbox sessions.
- **Always pass `--model` explicitly in scripts** — omitting it relies on the caller's `~/.config/devin/config.json` default, which may be a different model. Explicit means reproducible regardless of who runs it.
- **Use `--` before every print-mode prompt** — `devin -p -- "list all TODO comments"` prevents the prompt from being parsed as CLI flags. The prompt must follow the separator, or load it with `--prompt-file`.

---

## 4. RULES

### ✅ ALWAYS

1. Verify Devin CLI is installed before first invocation (`command -v devin`).
2. Delegate orchestrated execution to `../../system-deep-loop/runtime/scripts/fanout-run.cjs` with executor kind `cli-devin`; never build a second adapter in this packet.
3. Use `--permission-mode auto` (or default) for review/analysis/research; `--permission-mode accept-edits` (or `dangerous`) for code generation/file modification — `devin -p` defaults to `auto`, so omitting causes silent no-op on edit tasks.
4. Validate Devin-generated code (XSS, injection, eval, syntax checks via `node --check`, `tsc --noEmit`, etc.) before applying.
5. Capture stderr (`2>&1`) so rate-limit messages and errors surface.
6. **Redirect devin stdin from `/dev/null`** when dispatching in a `while read` loop. Pattern: `devin -p -- "$PROMPT" > "$LOG" 2>&1 </dev/null &`. Without `</dev/null`, the backgrounded devin process inherits the loop's stdin and silently consumes the remaining lines. See `references/integration-patterns.md#background-execution` → "Silent Stdin Consumption".
7. **Specify model + permission mode explicitly** — never rely on caller environment. Default: `--model swe --permission-mode accept-edits`. Honor user overrides verbatim. Use `grok-4-6-high` for reasoning-heavy tasks (architecture, security, deep planning).
8. Route to the appropriate subagent profile when the task matches a specialization (see Section 3 routing table); use `subagent_explore` for read-only research, `subagent_general` for code changes.
9. **Pass the spec folder to the delegated agent** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the delegated agent cannot answer Gate 3 in non-interactive `-p` mode.
10. **Prompt construction & model-craft (cli-* family precedence).** Compose every dispatch prompt via the 3-tier rule canonical in `../../sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md`:
    1. **Fast path (default).** Build from the local `assets/prompt-quality-card.md`, which delegates the framework table + CLEAR check to the canonical card.
    2. **Model override (mandatory for a profiled model).** If the target model has a profile at `../../sk-prompt/sk-prompt-models/references/models/<id>.md`, that profile OVERRIDES the cross-model default. The **sk-prompt/sk-prompt-models** packet owns per-model prompt-craft (framework + scaffold + gotchas, mirroring `sk-prompt/sk-prompt-models/assets/model-profiles.json` `recommended_frameworks`); consult it before composing for any small model.
    3. **Deep path (escalation).** Dispatch `@prompt-improver` via the Task tool (never load full `sk-prompt` inline) when any canonical **Tier 3** trigger applies — the trigger list lives in `../../sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` under "Tier 3 — Deep path"; do not re-enumerate it here.
11. **Never inject user-level voice/personalization content into AI-orchestrated Devin delegations.** Devin CLI reads user-level rules from `~/.config/devin/` and project `.devin/` config. When an AI delegates via `devin -p`, the calling AI's own voice rules govern the response — do NOT read user config and paste into delegation prompts. Keep delegations focused on task/model/permission-mode/(spec-folder pre-approval). If the user asks how to make Devin sound more like another tool in *their own* sessions, point to `~/.config/devin/config.json` — not any repo asset.
12. **Code Standards Loading (surface-aware contract)** — When dispatching for code review or code generation, instruct the dispatched session to: (1) load `sk-code`; (2) let `sk-code` emit a surface tag matching the detected stack from markers and target files; (3) load the selected surface resources and run its verification commands; (4) add `code-review` only for formal findings-first review output. Fallback: if the surface cannot be determined confidently, ask for the runtime surface and verification command set. NEVER hardcode obsolete sibling code skills in dispatch prompts.
13. **Design Standards Loading (surface-aware contract)** — When dispatching for design or UI work, instruct the dispatched session to: (1) load `sk-design` (the hub); (2) let the hub resolve a `workflowMode` through `mode-registry.json` (`sk-design-interface` / `sk-design-md-generator`); (3) load the selected mode packet, set the design register, and run that mode's design verification. Fallback: if the design mode cannot be determined confidently, ask for the surface and design intent. NEVER treat `mcp-figma` as the taste authority, or hardcode obsolete flat design skills in dispatch prompts.
14. **Pass the design dispatch manifest to the dispatched session** — when dispatching design or UI work, inline a `DESIGN_DISPATCH_MANIFEST v1` block in the prompt (the child cannot resolve skill paths, so the manifest travels in the payload, not by reference): `skDesignLoaded` true, `register` resolved to `Brand` or `Product` (never `unknown`), registry-valid `workflowModes`, `dials`, `loadedFiles`, and `proofDemandBack`. If the manifest cannot be assembled — `sk-design` not loaded, register unresolved, or no registry-valid mode — ASK before launching the child rather than starting a silent design dispatch. The child returns the demanded proof; the parent reconciles it on the return path.
15. **Single-dispatch discipline (operator-gated, session-scoped)** — Default: launch ONE cli-* dispatch at a time across the cli-* family (cli-devin, cli-codex, cli-claude-code, cli-opencode, cli-cursor). Wait for the dispatched agent's work to return, verify outputs exist, then SIGKILL only the dispatch THIS skill started: capture its PID at launch (`devin -p -- ... & DEVIN_PID=$!`) and kill that captured PID directly plus its own orphan children (`kill -9 "$DEVIN_PID" 2>/dev/null; pkill -9 -P "$DEVIN_PID" 2>/dev/null`), then apply the same PID-scoped `gtimeout` cleanup. **Never use a blanket `pkill -9 -f "devin -p"` pattern** — that matches and kills EVERY running `devin` process on the machine, including the operator's unrelated devin sessions. Only launch the next dispatch (this skill OR a sibling) after the prior one is dead and RSS has dropped. **Within a deep-flow session** (deep-review / deep-research): the operator authorizes the whole multi-iteration session at start — iterations chain back-to-back with kill-between as the safety mechanism, NOT a per-iteration confirmation prompt. **Exception (cross-skill parallel)**: when the operator explicitly authorizes N parallel dispatches, run N concurrently — but still SIGKILL each by its own captured PID as its work returns.
16. **Set `AI_SESSION_CHILD=1` in the dispatched child's env** when sessions may be launched through the per-session worktree wrapper (`.opencode/bin/worktree-session.sh`). A dispatched `devin -p` is an orchestrated sub-session, not a new top-level session, so it must SHARE the parent's worktree rather than allocate its own. The wrapper checks `AI_SESSION_CHILD` (plus a `git --git-common-dir` structural backstop) and exec's in place when set. Pattern: `AI_SESSION_CHILD=1 devin -p -- ... </dev/null`. Harmless when the wrapper is not in use. See `.opencode/bin/README.md` → "Worktree session isolation".

### ⛔ NEVER

1. Use `--permission-mode dangerous` without explicit user approval (full shell beyond workspace = damage risk). `accept-edits` (workspace edits auto-approve) does not require pre-approval.
2. Trust Devin output blindly for security-sensitive code, send sensitive data (API keys, passwords, credentials) in prompts, or hammer the API with rapid sequential calls.
3. Use Devin for tasks where context is already loaded — direct action by the calling AI is faster.
4. Assume Devin output is correct without verification — cross-reference codebase and project standards.
5. Build or maintain a packet-local Devin execution adapter; the deep-loop runtime is the execution authority.

### ⚠️ ESCALATE IF

1. Devin CLI is not installed and user has not acknowledged (provide `devin setup` or install URL).
2. Rate limits are persistently exceeded (suggest checking the Devin account's plan and usage limits).
3. Devin output conflicts with existing code patterns (present both perspectives; user decides).
4. Task requires `--permission-mode dangerous` (describe risks; get explicit user approval). `accept-edits` does not require escalation.
5. Cloud handoff is requested for a task involving sensitive data or production systems (confirm the cloud session's isolation and data handling before handing off).

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Devin CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory-handback.md`](../../system-spec-kit/references/cli/memory-handback.md). Devin-specific Memory Epilogue template: [assets/prompt-templates.md](./assets/prompt-templates.md) §13.

```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

## 5. REFERENCES

### Core References

- [cli-reference.md](./references/cli-reference.md) - Complete CLI subcommands, flags, permission modes, and config reference
- [integration-patterns.md](./references/integration-patterns.md) - Cross-AI orchestration patterns and workflows
- [devin-tools.md](./references/devin-tools.md) - Built-in capabilities documentation (run_subagent, /handoff, MCP, session management, Fetch)
- [agent-delegation.md](./references/agent-delegation.md) - Subagent profile roster, routing table, and invocation patterns
- [cloud-handoff.md](./references/cloud-handoff.md) - /handoff cloud-handoff mechanics, use cases, and state transfer
- [manual-testing-playbook.md](./manual-testing-playbook/manual-testing-playbook.md) - 20-scenario Devin-native manual validation package

### Templates and Assets

- [prompt-templates.md](./assets/prompt-templates.md) - Copy-paste ready prompt templates for common tasks
- [prompt-quality-card.md](./assets/prompt-quality-card.md) - Fast-path prompt framework + CLEAR check (ALWAYS loaded)

### Shared (cli-* family)

- [shared-smart-router.md](../../system-spec-kit/references/cli/shared-smart-router.md) - Helper-function bodies for the smart router.
- [memory-handback.md](../../system-spec-kit/references/cli/memory-handback.md) - Canonical 7-step Memory Handback procedure.

### External

- [Devin CLI Documentation](https://docs.devin.ai/cli) - Official CLI documentation
- [Devin Web App](https://app.devin.ai) - Cloud session management and tracking

### Reference Loading Notes

- Load only references needed for current intent; Smart Routing (Section 2) is the single routing authority.
- `cli-reference.md` is ALWAYS loaded as baseline.

---

## 6. SUCCESS CRITERIA

### Task Completion

- Devin CLI invoked with correct subcommand, flags, model, and permission mode.
- Output captured, validated, and integrated appropriately; no security vulnerabilities introduced.
- Rate limits handled gracefully (retry or fallback strategy).
- Appropriate subagent profile and permission mode matched to task type (auto/accept-edits for review, accept-edits/dangerous for generation).
- Cloud handoff used when the task benefits from a VM, browser, or long-running execution.
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

The router discovers reference, asset, and script docs dynamically (Section 5 is the authored index). Start with the ALWAYS-loaded `references/cli-reference.md` and `assets/prompt-quality-card.md`, then load task-specific resources per Smart Routing.

Related skills: `cli-codex` for OpenAI-backed dispatch, `cli-claude-code` for extended reasoning, `cli-opencode` for full OpenCode runtime dispatch, `cli-cursor` for Composer/shared-editor-config dispatch, `sk-code` for code-quality contracts, `mcp-code-mode` for external MCP work, and `system-spec-kit` for packet handback.
