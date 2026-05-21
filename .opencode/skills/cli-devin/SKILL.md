---
name: cli-devin
description: "Devin CLI orchestrator: dispatch Cognition AI's 'Devin for Terminal' for autonomous coding work with optional local-to-cloud handoff."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.0.6.3
---

<!-- Keywords: devin, devin-cli, devin-for-terminal, cognition, swe-1.6, deepseek-v4, glm-5.1, kimi-k2.6, cloud-handoff, autonomous-agent, cross-ai, mcp, acp, permission-modes, complex-task-fallback -->

# Devin CLI Orchestrator — Local + Optional Cloud Handoff

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the Devin CLI binary (`devin`). If the agent currently reading this skill is itself running inside a local `devin` session (detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `devin` invocation. The only exception is an explicit "cloud handoff" request that intentionally migrates the work to a separate Devin cloud sandbox (see `references/cloud_handoff.md`).
>
> Just as a Claude Code agent never calls cli-claude-code, an OpenCode agent never calls cli-opencode, a Codex agent never calls cli-codex and a Gemini agent never calls cli-gemini. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate Cognition AI's "Devin for Terminal" Rust CLI (`devin`) from external AI assistants (Claude Code, Codex, Gemini, OpenCode, raw shell). Devin runs locally with full access to your codebase, tools, and environment — and uniquely in this family, can hand off the session to a cloud-hosted Devin VM that keeps working after you close your laptop and returns a PR.

**Core Principle**: The calling AI stays the conductor. Delegate to Devin for what it does best — SWE-1.6 by default for context gathering, tool use, and simple-to-medium well-defined coding tasks; DeepSeek v4 for complex work, with GLM 5.1 and Kimi k2.6 as documented complex-task fallbacks. The skill also documents Devin's local-to-cloud handoff for long-running async work. Validate and integrate the output.

---

## 1. WHEN TO USE

### Activation Triggers

- **Autonomous coding with Devin's specialized model** — calling AI is Claude Code / Codex / Gemini / OpenCode / raw shell AND the task benefits from Cognition's SWE-1.6 (coding-specialized), or the operator explicitly requested a Devin dispatch.
- **Local-to-cloud handoff** — the task is long-running (multi-hour), the operator wants to close the laptop and return to a finished PR, AND the operator has explicitly confirmed cloud-handoff is acceptable for this work. See `references/cloud_handoff.md`.
- **Cross-AI orchestration handback** — calling AI is non-Anthropic and the task targets Devin's MCP / rules / skills surfaces, or the operator wants a Devin-side perspective on the work as a second opinion.
- **Permission-mode taxonomy needed** — the task requires explicit control over Devin's `auto` / `dangerous` permission modes, mapped to the family's sandbox risk tiers.
- **ACP server bridge** — the calling AI wants to use Devin as an Agent Client Protocol server (`devin acp`) inside another tool's workflow.

### When NOT to Use

- **You ARE a local Devin session already.** If your runtime is `devin` running locally (detection signals: any `DEVIN_*` env var set, `devin` in process ancestry, or `~/.config/devin/sessions/<id>/lock` present), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns Devin units for no value. The cli-X family is exclusively for cross-AI delegation. The single legitimate exception is an explicit "cloud handoff" request that intentionally migrates the work to a SEPARATE Devin cloud sandbox (see §2 guard + `references/cloud_handoff.md`).
- Simple, quick tasks where `devin` startup overhead is not worth it — use a sibling cli-* skill.
- Tasks that only need a raw model dispatch with no autonomous-coding loop — `cli-codex` or `cli-claude-code` is leaner.
- Tasks requiring the Devin TUI's interactive slash commands directly — those are operator-driven, not skill-orchestrated.
- Context already loaded and understood by the calling AI — direct action is faster than a dispatch hop.
- Tasks where the `devin` binary is not installed at the expected path.
- Tasks where the operator does not have a Devin account, or where cloud-handoff entitlement is required but unconfirmed.

---

## 2. SMART ROUTING

### Prerequisite Detection

```bash
# Verify Devin CLI is available
command -v devin || echo "Not installed. Run: curl -fsSL https://cli.devin.ai/install.sh | bash (macOS/Linux) or irm https://static.devin.ai/cli/setup.ps1 | iex (Windows)"

# SELF-INVOCATION GUARD (layered detection — adapted for Devin)
# Layer 1: env var lookup — any DEVIN_* variable
env | grep -q '^DEVIN_' && echo "ERROR: DEVIN_* env detected — already inside a local devin session."
# Layer 2: process ancestry — devin in parent tree
ps -o command= -p "$PPID" | grep -q '/devin\|devin ' && echo "ERROR: devin parent process detected."
# Layer 3: state lock-file probe (TODO verify — Devin's exact session-state layout is not publicly documented at v0.x)
ls ~/.config/devin/sessions/*/lock 2>/dev/null | head -1 | grep -q lock && echo "ERROR: live devin session lock detected."
```

### Self-Invocation Guard

```python
def detect_self_invocation():
    """Returns a non-None signal when the orchestrator is already running inside a local devin session."""
    # Layer 1: env var lookup — Devin's runtime sets DEVIN_* vars (verified at design time; re-verify on first real dispatch)
    for key in os.environ:
        if key.startswith('DEVIN_'):
            return ('env', key)
    # Layer 2: process ancestry — devin in parent tree
    try:
        ancestry = subprocess.check_output(['ps', '-o', 'command=', '-p', str(os.getppid())]).decode()
        if '/devin' in ancestry or ancestry.strip().startswith('devin '):
            return ('ancestry', 'devin')
    except subprocess.SubprocessError:
        pass
    # Layer 3: state lock-file probe (speculative — adjust path once Devin v1.x docs the session-state directory)
    # TODO verify: confirm path against an actual Devin install
    state_dir = os.path.expanduser('~/.config/devin/sessions')
    if os.path.isdir(state_dir):
        for entry in os.listdir(state_dir):
            if os.path.exists(os.path.join(state_dir, entry, 'lock')):
                return ('lockfile', entry)
    return None

if detect_self_invocation():
    # Single legitimate exception: explicit "cloud handoff" keywords
    # The cloud handoff spawns a SEPARATE Devin cloud sandbox, not a self-dispatch.
    if not has_cloud_handoff_keywords(prompt):  # e.g. "cloud handoff", "hand off to cloud", "devin cloud"
        refuse(
            "Self-invocation refused: this agent is already running inside a local devin session. "
            "Use a sibling cli-* skill or a fresh shell session in a different runtime to dispatch a different model. "
            "For a cloud handoff to a separate Devin sandbox, restate with explicit cloud-handoff keywords and operator confirmation."
        )
```

### Resource Loading Levels

| Level       | When to Load            | Resources                      |
| ----------- | ----------------------- | ------------------------------ |
| ALWAYS      | Every skill invocation  | `references/cli_reference.md`, `assets/prompt_quality_card.md` |
| CONDITIONAL | If intent signals match | Intent-mapped reference docs (see table below) |
| ON_DEMAND   | Only on explicit request| Extended templates and patterns |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md)):

```python
INTENT_SIGNALS = {
    "DEVIN_LOCAL_DISPATCH":  {"weight": 4, "keywords": ["devin cli", "devin exec", "delegate to devin", "from claude code to devin", "from codex to devin", "swe-1.6", "swe1.6", "cognition swe"]},
    "DEVIN_CLOUD_HANDOFF":   {"weight": 4, "keywords": ["cloud handoff", "hand off to cloud", "devin cloud", "cloud agent", "close laptop", "long-running pr", "devin vm"]},
    "DEVIN_ACP_BRIDGE":      {"weight": 3, "keywords": ["acp server", "devin acp", "agent client protocol", "embed devin"]},
    "DEVIN_MCP_OPS":         {"weight": 3, "keywords": ["devin mcp", "devin mcp add", "devin mcp login", "mcp on devin"]},
    "DEVIN_RULES_SKILLS":    {"weight": 3, "keywords": ["devin rules", "devin skills", "devin skill show"]},
    "DEVIN_PERMISSION":      {"weight": 3, "keywords": ["devin permission-mode", "devin dangerous"]},
    "DEVIN_AUTH":            {"weight": 2, "keywords": ["devin auth", "devin login", "devin auth status", "devin configure"]},
}

RESOURCE_MAP = {
    "DEVIN_LOCAL_DISPATCH":  ["references/cli_reference.md", "references/devin_tools.md", "references/integration_patterns.md"],
    "DEVIN_CLOUD_HANDOFF":   ["references/cloud_handoff.md", "references/integration_patterns.md"],
    "DEVIN_ACP_BRIDGE":      ["references/devin_tools.md", "references/integration_patterns.md"],
    "DEVIN_MCP_OPS":         ["references/devin_tools.md", "references/cli_reference.md"],
    "DEVIN_RULES_SKILLS":    ["references/agent_delegation.md", "references/cli_reference.md"],
    "DEVIN_PERMISSION":      ["references/cli_reference.md", "references/devin_tools.md"],
    "DEVIN_AUTH":            ["references/cli_reference.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli_reference.md", "assets/prompt_quality_card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "complete guide", "devin agent", "devin prompt", "cloud handoff guide", "acp bridge", "rules skills"],
    "ON_DEMAND": ["references/devin_tools.md", "assets/prompt_templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Is the user asking about Devin CLI specifically (SWE 1.6 dispatch)?",
    "Does the task benefit from a cloud handoff to a separate Devin sandbox?",
    "Would a sibling cli-* peer (cli-codex, cli-claude-code) be a better routing target?",
    "Is the request actually about ACP bridge, MCP ops, rules/skills or auth?",
]
```

**Call sequence** (using shared helpers from `shared_smart_router.md`):

1. `discover_markdown_resources()` — recursively enumerate current `.md` files under existing `references/` and `assets/` folders at routing time.
2. `_guard_in_skill()` + `load_if_available()` — sandbox paths to this skill, reject non-markdown loads, skip missing files, and suppress duplicates.
3. `score_intents(task)` and `select_intents(scores, ambiguity_delta=1.0)` — preserve provider-specific weighted intent scoring and top-2 ambiguity handling.
4. `get_routing_key(task, intents)` — derive the provider routing key from task/provider context, then fall back to `devin`.
5. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
6. CONDITIONAL-load `RESOURCE_MAP[intent]`, ON_DEMAND-load keyword matches, and return a notice when no provider-specific knowledge base is available beyond always-load resources.

The `route_devin_resources(task)` function body lives in [`shared_smart_router.md`](../system-spec-kit/references/cli/shared_smart_router.md) — substitute `<PROVIDER>` = `devin`.

---

## 3. HOW IT WORKS

### Prerequisites

- `devin` binary on PATH (`command -v devin`). Install via `curl -fsSL https://cli.devin.ai/install.sh | bash` (macOS/Linux) or `irm https://static.devin.ai/cli/setup.ps1 | iex` (Windows).
- Authenticated session (`devin auth status` succeeds). Devin authenticates through Cognition's Codeium / Windsurf bridge (API server at `server.codeium.com`, webapp at `app.devin.ai`). Run `devin auth login` or the `devin setup` wizard to authenticate. Credentials live at `~/.local/share/devin/credentials.toml` (current path; may rotate). Config lives at `~/.config/devin/config.json`.
- For cloud-handoff dispatches: operator confirmation that the Devin account is provisioned for cloud sessions (the skill does NOT enforce; it surfaces a CHK gate before any handoff invocation — see `references/cloud_handoff.md`).
- The calling AI MUST NOT be a `devin` session itself (self-invocation guard above).

### Provider Auth Pre-Flight (Smart Fallback)

Run once per session before the first dispatch. The skill never substitutes auth state.

```bash
devin auth status
# Expected (authenticated): "Authenticated as <handle> · profile=<name>"
# Expected (unauthenticated): exit code non-zero, or "Not authenticated. Run: devin auth login"
```

| State | Skill Response |
|-------|----------------|
| Authenticated | Proceed to dispatch |
| Token missing | Surface `devin auth login` to operator (authenticates via Codeium / Windsurf / Devin bridge); do NOT auto-login |
| Token expired | Surface `devin auth logout && devin auth login` to operator |
| Profile mismatch | Surface `devin --config <path>` flag and `~/.config/devin/config.json` location; do NOT switch profiles silently |
| `devin` not installed | Surface install command from §2 Prerequisite Detection; refuse to dispatch |

**Error-recovery contract.** If a dispatch returns an auth error after pre-flight passed (token revoked, profile rotated), invalidate the cache, rerun the pre-flight, and apply the same decision tree before retrying. Never substitute a profile or model the operator didn't approve.

### Default Invocation (Skill Default)

**Default model + permission mode**: `swe-1.6` · `auto` permission mode. SWE-1.6 is Cognition's coding-specialized model and the natural default for Devin-native dispatches. `auto` is the default permission mode (auto-approves read-only tools; prompts on write/exec, matching the Codex `--ask-for-approval on-request` analog).

> **SWE-1.6 Prompt-Quality Contract (REQUIRED)**: SWE-1.6 is fast and coding-specialized but smaller than the complex-task models — it relies on prompt clarity for reliable output. EVERY cli-devin dispatch with `--model swe-1.6` MUST: (1) be composed through `sk-prompt` (apply a structured framework — **default RCAF (Role/Context/Action/Format)**; fall back to STAR for narrative-heavy tasks or BUILD for multi-file refactors; run the CLEAR 5-check) before composing the final `--prompt-file` payload, AND (2) include an explicit pre-planning block in the prompt body — the calling AI decomposes the task into ordered steps with acceptance criteria BEFORE handing it to SWE-1.6, rather than asking SWE-1.6 to figure out structure on its own. See `assets/prompt_templates.md` §2 for the canonical SWE-1.6 pre-planning template and `assets/prompt_quality_card.md` §3 for the framework selection rules. Skipping this contract is the single largest cause of underwhelming SWE-1.6 output and must be treated as a soft-block in operator review. **Composition guidance**: use medium-density pre-planning (3-4 ordered steps with per-step acceptance and verification); do NOT pair BUILD with strict bundle-gate wording — verbose constraint language pushes SWE 1.6 most strongly toward defensive output rather than direct code, and the same pattern holds on `deepseek-v4` and `kimi-k2.6`, so keep bundle-gate language at "standard" for all cli-devin model presets.

```bash
# Non-interactive dispatch via prompt file (preferred for prompts >2KB or programmatic dispatch)
devin --prompt-file /tmp/devin-prompt.md \
  --model swe-1.6 \
  --permission-mode auto \
  --config "$HOME/.config/devin/config.json"

# Interactive seed (shorter prompts; the calling AI parses Devin's stdout afterward)
devin "<seed prompt>" \
  --model swe-1.6 \
  --permission-mode auto
```

**User override** (honor explicit operator phrasing verbatim):

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model swe-1.6 --permission-mode auto` |
| "Use DeepSeek v4 on Devin" | `--model deepseek-v4 --permission-mode auto` |
| "Use Kimi k2.6 on Devin" | `--model kimi-k2.6 --permission-mode auto` |
| "Use GLM 5.1 on Devin" | `--model glm-5.1 --permission-mode auto` |
| "Devin dangerous mode" | `--permission-mode dangerous` (explicit operator approval REQUIRED — record in dispatch log) |
| "Devin bypass mode" | `--permission-mode dangerous` (auto-approve all actions — operator approval REQUIRED, record in dispatch log) |
| "Devin cloud handoff" | See `references/cloud_handoff.md` — operator-confirmed; the local CLI initiates the handoff but the cloud session runs in a separate sandbox |

Only model and permission-mode dimensions change via override. The skill never silently switches between local and cloud — cloud handoff is always explicit.

### Core Invocation Pattern

```bash
devin --prompt-file <path> --model <id> --permission-mode <auto|dangerous> 2>&1 </dev/null
```

> **Common flag mistakes**: there is no `--reasoning-effort` flag (model choice is the lever); there is no `--full-auto` flag (the closest analog is `--permission-mode dangerous`). Use `--prompt-file` for prompts >2KB rather than escaping a long positional argument. Use `-p` / `--print` for non-interactive single-shot dispatches (the canonical cli-devin shape).

| Flag / Option | Purpose |
|---------------|---------|
| `--model <id>` | Model selection — `swe-1.6` (default), `deepseek-v4`, `kimi-k2.6`, `glm-5.1` (plus 14 other models the binary supports; see `references/cli_reference.md` §5) |
| `--permission-mode auto` | **Default** — auto-approves read-only tools; prompts on write/exec actions |
| `--permission-mode dangerous` | Auto-approves all tools — **requires explicit operator approval**, record in dispatch log |
| `--prompt-file <path>` | Load prompt from file (preferred for >2KB or programmatic dispatch) |
| `--config <path>` | Override config file location (default: `~/.config/devin/config.json`) |
| `--continue` / `-c` | Resume most recent session |
| `--resume <ID>` / `-r` | Resume specific session by ID |
| `-p` / `--print [<PROMPT>]` | Print response and exit (non-interactive mode — required for scripted dispatch) |
| `--sandbox` | [Research Preview] OS-level process sandboxing (macOS seatbelt / Linux bwrap+seccomp) enforcing the active Read/Write permission scopes. Layered on top of `--permission-mode` |
| `--respect-workspace-trust [true\|false]` | Whether to honor VS Code workspace-trust settings. Defaults true in interactive, false in non-interactive |
| `--agent-config <FILE>` | Declarative agent configuration (JSON/YAML) defining system instructions, tool visibility, permissions. Strict parsing — unknown fields rejected |

> **Stdin handling**: For non-interactive dispatch (background, scripted, piped into a log), append `</dev/null` for consistency with the family convention. Note (2026-05-15): empirical testing against `devin 2026.5.6-8` did NOT reproduce the silent stdin-theft failure mode that cli-codex / cli-opencode docs describe — Devin's binary handles stdin differently and `while read` loops complete cleanly with or without the redirect. The `</dev/null` redirect remains harmless and recommended for cross-binary-version stability.

> **Default permission behavior**: `devin` defaults to `--permission-mode auto`. **Tasks that require destructive operations (file deletion, git history rewrite, package installation) will pause for confirmation in interactive mode unless `dangerous` is set.** For unattended dispatches, the calling AI MUST decide explicitly; never silently escalate the permission mode.

### Model Selection

Devin runs four model presets. The skill defaults to SWE-1.6 for context gathering, tool use, and simple-to-medium well-defined code tasks. DeepSeek v4 is the primary pick for complex work; GLM 5.1 and Kimi k2.6 are the documented complex-task fallbacks when DeepSeek v4 doesn't fit or doesn't deliver.

Per-model context budget defaults live in `assets/per-model-budgets.json`; the budget pattern is documented in `references/context-budget.md`, and the opt-in output-verification pipeline is documented in `references/output-verification.md`. Shared model facts, quota pools, and fallback targets live in `../sk-prompt/assets/model-profiles.json`.

| Model | ID | Use Case |
|-------|----|----------|
| **Cognition SWE-1.6** ★ default | `swe-1.6` | Context gathering, tool use, simple-to-medium code tasks that are clearly defined beforehand. Optimized for fast iteration inside Devin's agent loop. **Free tier** — does not consume Pro quota; dispatches succeed even when the TUI shows `Pro · 0% remaining`. |
| **DeepSeek v4** (DeepSeek) | `deepseek-v4` | **Primary for complex tasks** — ambiguous problems, multi-step work, deep reasoning, large refactors, architectural decisions, root-cause debugging. |
| **GLM 5.1** (Zhipu) | `glm-5.1` | Complex-task **fallback** when DeepSeek v4 doesn't fit (e.g. agentic / tool-use heavy, MCP chains, structured planning). |
| **Kimi k2.6** (Moonshot) | `kimi-k2.6` | Complex-task **fallback** when the work needs an unusually large context window (long files, sprawling diffs, multi-repo grep). |

**Selection Strategy**:
1. Default to SWE-1.6 for context gathering, tool use, and clearly-defined simple-to-medium tasks.
2. When the task is complex (ambiguous, multi-step, reasoning-bound, or scope-broad), use DeepSeek v4.
3. If DeepSeek v4 doesn't fit the shape of the complex task or doesn't deliver, fall back to GLM 5.1 or Kimi k2.6 (operator picks based on agentic vs large-context fit).
4. Never silently switch — honor operator phrasing verbatim.

**Preset reliability notes** (for long-running harnesses and scripted dispatches):
- `--model deepseek-v4` is reasoning-bound and frequently exceeds 15 minutes on non-trivial fixtures. Long-running harnesses should set ≥ 25-minute per-dispatch timeouts when using this preset.
- `--model kimi-k2.6` occasionally hangs ~25 minutes on complex fixtures (~5–10% failure rate at default timeouts). Either bump timeout to 30+ minutes or accept the failure rate and aggregate over ≥ 5 fixtures.
- `--model swe-1.6` is the fastest preset; default per-dispatch timeouts (10–15 minutes) are typically sufficient.
- `--model swe-1.6` runs on Devin's **Free tier** and does not gate on Pro quota. When the TUI banner reads `Pro · 0% remaining (resets in <Nh Mm>)`, SWE-1.6 dispatches continue to succeed; `--model deepseek-v4`, `--model glm-5.1`, and `--model kimi-k2.6` will fail with quota errors until the Pro window resets. Cross-AI dispatches that need to ride out a Pro-quota exhaustion should pin to `--model swe-1.6` for the duration.

### Devin Agent Delegation

Unlike `cli-opencode` (which exposes `--agent <slug>`) or `cli-codex` (which exposes `-p <profile>`), Devin does not have a top-level agent-routing flag. The Devin runtime ships its own internal agent loop, and customization happens through three surfaces:

| Task Type | Devin Surface | Invocation Pattern |
|-----------|---------------|--------------------|
| Custom behavioral rules | Devin rules (managed via `devin rules list`) | Author/select rules ahead of time; `devin` loads them automatically per the user's profile |
| Skill-style routines | Devin skills (managed via `devin skills list` / `devin skills show <name>`) | Reference the skill name in the prompt; Devin's internal router loads the matching skill |
| MCP servers | `devin mcp add <name>` + `devin mcp login <name>` | Configure ahead of time; available to all Devin sessions on the profile |

In practice, cross-AI dispatches use (model, permission-mode, prompt-file) as the routing dimensions. See `references/agent_delegation.md` for the full mapping and copy-paste invocations.

### Unique Devin Capabilities

| Capability | Purpose | Invocation |
|------------|---------|------------|
| Local-to-cloud handoff | Migrate the live session to a Devin cloud VM that keeps working after laptop close; returns a PR | Operator-initiated from the live `devin` TUI; the skill documents the pattern in `references/cloud_handoff.md` and ENFORCES an operator-confirmation gate before any cli-devin invocation that surfaces handoff phrasing |
| `devin acp` | Run as an Agent Client Protocol server, embeddable in other tools | `devin acp` |
| `devin mcp` | Connect to MCP servers; OAuth via `devin mcp login` | `devin mcp add <name>`, `devin mcp list`, `devin mcp login <name>` |
| Devin rules + skills | Custom behavioral rules and skill-style routines persisted across sessions | `devin rules list`, `devin skills {list,show}` |
| Four-model preset | Switch between SWE-1.6 / DeepSeek v4 / Kimi k2.6 / GLM 5.1 mid-session | `/model [name]` slash command (interactive) or `--model <id>` (one-shot) |
| Slash commands | 10 verified interactive commands (plus any added by Devin updates — run `/help` inside the TUI for the live list): `/mode`, `/plan`, `/clear`, `/fork`, `/revert`, `/steps`, `/ask`, `/model`, `/context`, `/help` | Inside the interactive `devin` TUI |

### Essential Commands

```bash
# Default dispatch (SWE-1.6, auto permission)
devin --prompt-file /tmp/prompt.md --model swe-1.6 --permission-mode auto

# Reasoning-heavy dispatch (DeepSeek v4)
devin --prompt-file /tmp/prompt.md --model deepseek-v4 --permission-mode auto

# Large-context dispatch (Kimi k2.6)
devin --prompt-file /tmp/prompt.md --model kimi-k2.6 --permission-mode auto

# Agentic / tool-use dispatch (GLM 5.1)
devin --prompt-file /tmp/prompt.md --model glm-5.1 --permission-mode auto

# Background execution (calling AI captures output asynchronously)
devin --prompt-file /tmp/prompt.md --model swe-1.6 --permission-mode auto > /tmp/devin.log 2>&1 </dev/null &

# Resume last session
devin --continue

# Resume specific session
devin --resume <session-id>

# List sessions
devin list

# Auth pre-flight (run before first dispatch)
devin auth status

# Inspect available rules and skills
devin rules list
devin skills list

# Connect an MCP server (configure once per profile)
devin mcp add <name>
devin mcp login <name>

# Update the CLI binary
devin update
```

### Error Handling

| Issue | Solution |
|-------|----------|
| CLI not installed | `curl -fsSL https://cli.devin.ai/install.sh \| bash` (macOS/Linux); `irm https://static.devin.ai/cli/setup.ps1 \| iex` (Windows) |
| Auth missing | Run `devin auth login` (authenticates via Codeium / Windsurf / Devin bridge at `server.codeium.com`); do not auto-login |
| `Pro · 0% remaining` banner in TUI | Only affects Pro-tier models (`deepseek-v4`, `glm-5.1`, `kimi-k2.6`, Claude/Gemini variants). `--model swe-1.6` runs on the Free tier and continues to dispatch normally. Switch to SWE-1.6 for the duration of the Pro window, or wait for the Pro window to reset. |
| Auth expired | Run `devin auth logout && devin auth login` |
| Wrong profile | Use `devin --config <path>` to override; profiles live at `~/.config/devin/config.json` |
| Task ran but no files changed | `--permission-mode auto` may have paused for confirmation — re-dispatch with explicit `dangerous` or `dangerous` (operator-approved) or run interactively |
| Background dispatch hangs at 0% CPU | Missing `</dev/null` — append it so devin's stdin is closed |
| Cloud-handoff dispatch refused | Account lacks cloud entitlement, or operator did not pre-confirm — see `references/cloud_handoff.md` |
| Self-invocation guard tripped | The calling AI is itself a local `devin` session; use a sibling cli-* skill or restate with explicit cloud-handoff keywords |
| Context too large | Use `--prompt-file <path>` rather than positional prompt; consider splitting into multiple dispatches |

---

## 4. RULES

### ✅ ALWAYS

1. Verify the Devin CLI is installed before first invocation (`command -v devin`).
2. Run the Provider Auth Pre-Flight (`devin auth status`) once per session before the first dispatch.
3. Use `--permission-mode auto` for default dispatches; escalate to `dangerous` ONLY with explicit operator approval, and record the escalation in the dispatch log.
4. **Specify model + permission-mode explicitly** in every dispatch. Default: `--model swe-1.6 --permission-mode auto` for context gathering, tool use, and clearly-defined simple-to-medium tasks. For complex tasks, use `deepseek-v4` as the primary pick; fall back to `glm-5.1` or `kimi-k2.6` when DeepSeek doesn't fit or doesn't deliver. Honor operator phrasing verbatim.
5. **Redirect devin stdin from `/dev/null`** for non-interactive / background / scripted dispatches as a portability convention. Pattern: `devin --prompt-file "$PROMPT_FILE" --model swe-1.6 -p > "$LOG" 2>&1 </dev/null &`. Empirical testing (2026-05-15, devin 2026.5.6-8) showed Devin does NOT exhibit silent stdin-theft — the redirect is harmless and recommended for cross-binary-version stability, but not load-bearing on the tested version. See `evidence/playbook-run-wave2-2026-05-15.md`.
6. Capture stderr (`2>&1`) so auth errors, rate-limit messages, and dispatch failures surface to the calling AI.
7. **Pass the spec folder to the delegated dispatch** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the operator before delegating — Devin cannot answer Gate 3 in unattended mode.
8. **Load `assets/prompt_quality_card.md` before building any dispatch prompt.** Apply the CLEAR 5-check, tag the framework in the Bash invocation comment, and use the returned `ENHANCED_PROMPT`. For complexity ≥ 7/10 or compliance/security signals, dispatch `@prompt-improver` via the Task tool instead of loading `sk-prompt` inline.
9. **Operator-confirmation gate before cloud handoff.** No cli-devin invocation that mentions "cloud handoff", "hand off to cloud", or `devin cloud` proceeds without the operator's explicit confirmation in the same turn. See `references/cloud_handoff.md`.
10. **Code Standards Loading (surface-aware contract)** — When dispatching for code generation or review, instruct the dispatched Devin session to: (1) load `sk-code`; (2) let `sk-code` emit a surface tag matching the detected stack; (3) load the selected surface resources and run its verification commands; (4) add `sk-code-review` only for formal findings-first review output. Fallback: ask for the runtime surface and verification command set if detection is ambiguous.
11. Validate Devin-generated code (XSS, injection, eval, syntax checks, surface-specific lint/test) before merging.
12. **SWE-1.6 Prompt-Quality Contract** — EVERY dispatch with `--model swe-1.6` MUST (a) be composed through `sk-prompt` with a chosen framework (**default RCAF**; STAR for narrative-heavy tasks, BUILD for well-defined multi-file refactors) and a passing CLEAR 5-check, AND (b) include an explicit pre-planning block in the prompt body: ordered steps + per-step acceptance criteria + stop conditions + verification approach. SWE-1.6 is coding-specialized but smaller than the complex-task models — it relies on the calling AI doing the structural decomposition upfront. Use medium-density pre-planning (3-4 steps); do NOT tighten bundle-gate language beyond "standard" — verbose constraints push SWE 1.6 most strongly toward defensive output rather than direct code, and the same pattern holds on `deepseek-v4` and `kimi-k2.6`, so keep bundle-gate language at "standard" for all cli-devin model presets. See `assets/prompt_templates.md` §2 for the canonical pre-planning template.
13. **Deep-Loop Iter Contract** (v1.0.3.0+) — when cli-devin is dispatched as the executor for `/spec_kit:deep-research` or `/spec_kit:deep-review` per-iter workers, ALSO pass `--agent-config <path>` pointing at one of the three pinned recipes in `assets/` (research-iter / review-iter / synthesis). The recipe enforces tool allowlist and scoped permission entries (`Read(/path/**)`, `Exec(<cmd>)`) at Devin's strict parser, so the iter cannot drift outside the read-only-research, read-only-review, or scoped-write-synthesis profile. See [`references/deep-loop-iter-contract.md`](./references/deep-loop-iter-contract.md) for the full contract and [`references/agent-config-recipes.md`](./references/agent-config-recipes.md) for per-recipe wording, allowlist rationale, and copy-paste invocations.
14. **Sequential_thinking MCP is mandatory pre-output** (v1.0.4.0+) — EVERY cli-devin dispatch regardless of model (SWE-1.6, DeepSeek v4, GLM 5.1, Kimi k2.6) MUST enforce `sequential_thinking` via a **2-layer pattern**: (1) operator-side user-scope MCP registration via `devin mcp add sequential_thinking npx @modelcontextprotocol/server-sequential-thinking@2025.12.18` (one-time per profile; the server then loads automatically for every Devin session) AND (2) a `system_instructions` mandate in the `--agent-config` recipe that requires the model to invoke `mcp__sequential_thinking__sequentialthinking` with at least 5 thoughts before producing the structured output. The recipe-level `mcp_servers` field is RESERVED but not yet wired — Devin binary v2026.5.6+ rejects every shape with `untagged enum McpServer` and self-logs `ACP: agent_config mcp_servers are not yet supported in the ACP path and will be ignored`. Re-introduce the recipe field once Devin lands `--agent-config mcp_servers` support; until then the 2-layer pattern is the only working enforcement. This requirement applies to research-iter / review-iter / synthesis recipes and any future cli-devin recipe. See `references/deep-loop-iter-contract.md` §SEQUENTIAL_THINKING for the full contract and `references/agent-config-recipes.md` §2 SCHEMA for the canonical 2-layer pattern.
15. **Single-dispatch discipline (operator-gated)** — Default: launch ONE cli-* dispatch at a time across the cli-* family (cli-codex, cli-devin, cli-opencode, cli-claude-code, cli-gemini). Wait for the dispatched agent's work to return, verify outputs exist, then SIGKILL the dispatcher process + any orphan children (`pkill -9 -f "devin --print"` for this skill). Only launch the next dispatch (this skill OR a sibling) after the prior one is dead and RSS has dropped. **Exception**: when the operator explicitly authorizes N parallel dispatches for this session, run N concurrently — but still SIGKILL each as its work returns. **Why**: each dispatch holds non-releasable agent + (when models touch MPS) wired-memory state on Apple Silicon. The 2026-05-21 session hit 63G used + 14G compressor + 125M unused after just iter-1 of a 10-iter cli-devin batch loop, with the system minutes from OOM-killing user apps. Never batch-loop multiple dispatches in a shell script that fires N+1 immediately after N exits without an operator-driven gate — applies especially to deep-research / deep-review iter-loops where each iteration's per-model budget compounds across runs. Memory: `feedback_deep_loop_iter_one_at_a_time.md`.

### ❌ NEVER

1. Use `--permission-mode dangerous` without explicit operator approval.
2. Initiate a cloud handoff without operator confirmation — cloud sessions transmit local repo state to Cognition's cloud sandbox and consume Devin units.
3. Use Devin for tasks where context is already loaded by the calling AI — direct action is faster.
4. Assume Devin output is correct without verification — cross-reference codebase, project standards, and the surface-specific verification commands.
5. Log or include Devin API tokens in any example, prompt, or output. All token references redirect to `devin auth login` / `~/.config/devin/config.json`.
6. Substitute models silently — honor operator phrasing verbatim, refuse if the requested model isn't one of the three documented presets.
7. Run the unofficial PyPI `devin-cli` package as a substitute — this skill targets only the official Rust `devin` binary.

### ⚠️ ESCALATE IF

1. Devin CLI is not installed and the operator has not acknowledged (provide the install command).
2. Auth pre-flight fails after one retry (surface `devin auth login` and wait).
3. Operator requests cloud handoff without confirming Devin account provisioning (surface `references/cloud_handoff.md` checklist).
4. Operator requests `--permission-mode dangerous` or `dangerous` without stating the destructive operations required (describe risks; get explicit approval).
5. The Devin CLI surface has drifted from this skill's documentation (operator can run `devin --help` to inspect; update `references/cli_reference.md` if persistent drift).

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Devin CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory_handback.md`](../system-spec-kit/references/cli/memory_handback.md).

Devin-specific Memory Epilogue template: see [assets/prompt_templates.md](./assets/prompt_templates.md) §6 (Memory Handback).

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

## 5. REFERENCES

### Core References

- [cli_reference.md](./references/cli_reference.md) — Devin CLI subcommands, flags, slash commands, permission modes, install / auth, version drift
- [integration_patterns.md](./references/integration_patterns.md) — Three use cases (external dispatch, ACP bridge, cloud-handoff initiation)
- [devin_tools.md](./references/devin_tools.md) — Unique Devin capabilities and cross-CLI comparison
- [agent_delegation.md](./references/agent_delegation.md) — (model, permission-mode, prompt-file) routing analog
- [cloud_handoff.md](./references/cloud_handoff.md) — Devin-unique local→cloud handoff narrative + operator-confirmation gate
- [deep-loop-iter-contract.md](./references/deep-loop-iter-contract.md) — Deep-research / deep-review per-iter contract (model, permission-mode, agent-config recipe selection, prompt body shape)
- [agent-config-recipes.md](./references/agent-config-recipes.md) — Canonical agent-config JSON shapes for research-iter / review-iter / synthesis dispatches

### Templates and Assets

- [prompt_templates.md](./assets/prompt_templates.md) — Copy-paste templates for common dispatch shapes
- [prompt_quality_card.md](./assets/prompt_quality_card.md) — CLEAR 5-check, framework selection

### Shared (cli-* family)
- [shared_smart_router.md](../system-spec-kit/references/cli/shared_smart_router.md) — Helper-function bodies for the smart router
- [memory_handback.md](../system-spec-kit/references/cli/memory_handback.md) — Canonical 7-step Memory Handback procedure

### External
- [Devin for Terminal — landing](https://devin.ai/terminal)
- [Devin CLI commands & flags reference](https://cli.devin.ai/docs/reference/commands)
- [Devin docs root](https://docs.devin.ai/get-started/devin-intro)
- [Cognition blog — Devin for Terminal](https://cognition.ai/blog/devin-for-terminal)
- [Cognition blog — How Cognition Uses Devin to Build Devin](https://cognition.ai/blog/how-cognition-uses-devin-to-build-devin)
- Devin webapp (account / sessions): https://app.devin.ai
- Auth provider: Codeium / Windsurf bridge — `server.codeium.com` (Cognition's auth server)

### Reference Loading Notes

- Load only references needed for the current intent (see §2 routing table).
- Smart Routing (§2) is the single routing authority.
- `cli_reference.md` is ALWAYS loaded as baseline.

---

## 6. SUCCESS CRITERIA

### Task Completion

- `devin` invoked with correct flags (model, permission-mode, prompt-file or seed).
- Output captured (`2>&1 </dev/null` for background), validated by the calling AI, and integrated appropriately.
- No security vulnerabilities introduced from generated code.
- Permission-mode escalations recorded with operator approval.
- Cloud handoffs (if any) preceded by an explicit operator-confirmation gate.
- Self-invocation guard never bypassed without explicit cloud-handoff keywords.

### Skill Quality

- All 8 sections present with proper anchor structure (family contract).
- Smart routing covers all intent signals with `UNKNOWN_FALLBACK`.
- Reference files provide deep-dive content without duplication.
- Cross-CLI parity verified by `grep -c '^## ' SKILL.md` returning 8 for cli-devin and the four siblings.

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via `skill_advisor.py`
- **Tool Routing**: Per AGENTS.md Section 6 decision tree
- **Memory**: Context preserved via Spec Kit Memory MCP

**Tool roles**: Bash dispatches the CLI; Read/Glob/Grep validate output. The skill does NOT write files itself — it dispatches a process that may. Validation of any writes is the calling AI's responsibility after dispatch.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers reference, asset, and script docs dynamically. Start with `references/cli_reference.md`, `references/integration_patterns.md`, `assets/prompt_quality_card.md`, `assets/prompt_templates.md`, `references/agent_delegation.md`, `references/devin_tools.md`, `references/cloud_handoff.md`, then load task-specific resources from `references/`, templates from `assets/`, and automation from `scripts/` if present.

Related skills: `cli-claude-code` for Anthropic Claude Code, `cli-codex` for OpenAI Codex, `cli-gemini` for Google Search-grounded research, `cli-opencode` for full plugin/skill/MCP/Spec-Kit-Memory runtime dispatch, `sk-code` for surface-aware code quality contracts, `mcp-code-mode` for external MCP work, and `system-spec-kit` for packet handback.
