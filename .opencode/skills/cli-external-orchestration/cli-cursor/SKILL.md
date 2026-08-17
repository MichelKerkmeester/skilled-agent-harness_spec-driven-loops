---
name: cli-cursor
description: "Cursor CLI executor for cursor-agent-backed coding, plan/ask read-only modes, native git worktree isolation, and a cloud worker — a shared-editor-config CLI dispatch."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.4.1.0
hard_rules:
  - id: cursor-availability-required
    check: command-v-cursor-agent-required
    message: "Run `command -v cursor-agent` before every dispatch; if it fails, refuse the route without constructing or launching a command."
    severity: error
  - id: self-invocation-prohibited
    check: cursor-self-invocation-guard
    message: "Refuse dispatch when Cursor runtime signals are present; a running CLI skill never dispatches itself."
    severity: error
  - id: deep-loop-runtime-required
    check: deep-loop-runtime-delegation
    message: "Delegate execution to the shipped deep-loop runtime; this skill must not implement a second Cursor adapter."
    severity: error
---

<!-- Keywords: cursor, cursor-agent, cursor-cli, composer, cross-ai, agent-delegation, worktree, cloud-worker, plugin-marketplace, shared-editor-config, plan-mode, ask-mode -->

# Cursor CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the Cursor CLI binary (`cursor-agent`). If the agent currently reading this skill is itself running inside `cursor-agent` (detection signals listed in §2), the skill MUST refuse to load and return the documented error message instead of generating any `cursor-agent` invocation.
>
> A running CLI skill never dispatches itself. The cli-X skills are for **cross-AI delegation only** — never self-invocation.

Orchestrate Cursor's terminal coding agent (`cursor-agent`) for tasks that benefit from a second AI perspective, Cursor's native model (Composer), read-only plan/ask exploration, or its unique worktree/cloud-worker/plugin surfaces.

**Core Principle**: Use Cursor for what it does best. Delegate, validate, integrate. The calling AI stays the conductor.

---

## 1. WHEN TO USE

### Activation Triggers

- **Cross-AI Validation** — code review second perspective, bug detection, an independent implementation attempt.
- **Composer Dispatch** — tasks that specifically want Cursor's own native model (`composer-2.5`/`composer-2.5-fast`), or the Grok (4.5/4.6) / GLM 5.2 tiers already on the enforced allowlist (see §3 Model Selection).
- **Read-Only Exploration** — `--mode plan` (read-only planning) or `--mode ask` (read-only Q&A) when a task wants Cursor's analysis without any file writes.
- **Isolated Experimentation** — Cursor's native git worktree isolation (`-w`/`--worktree`) for a change the operator wants tried in a disposable checkout, documented in `references/cursor-tools.md` as an opt-in escape hatch, not this packet's default dispatch shape.
- **Specialized Generation** — explicit Cursor requests naming Grok (4.5 or 4.6) or GLM 5.2 specifically (the only non-Composer models on the enforced allowlist).

### When NOT to Use

- **You ARE Cursor already.** If your runtime is `cursor-agent` (detection signal: `CURSOR_AGENT=1` set, `CURSOR_CONVERSATION_ID` set, `cursor-agent` in process ancestry, or an active-session probe under `~/.cursor/`), this skill refuses to load. Self-invocation creates a circular dispatch loop and burns tokens for no value.
- Simple, quick tasks where CLI overhead is not worth it, or tasks needing an immediate response (auth/network round-trips may delay).
- Context already loaded and understood by the current agent.
- Interactive refinement requiring the full-screen TUI (use `cursor-agent` directly instead).
- Tasks where Cursor CLI is not installed, or the account is not authenticated (`cursor-agent about` reports "Not logged in").

---

## 2. SMART ROUTING

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
    # WHY: DESIGN is an intent signal only. The durable sk-design loading contract lives in the
    # always-fires Design Standards Loading rule and the dispatch manifest; RESOURCE_MAP stays
    # limited to same-skill markdown paths.
    "DESIGN":            {"weight": 4, "keywords": ["sk-design", "interface design", "frontend design", "visual design", "redesign the ui", "design foundations", "design tokens", "motion design", "micro-interactions", "design audit", "ui critique", "extract design system", "generate design.md"]},
}

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

**Call sequence** (using shared helpers from `shared-smart-router.md`):

1. `discover_markdown_resources()` — recursively enumerate current `.md` files under existing `references/` and `assets/` folders at routing time.
2. `_guard_in_skill()` + `load_if_available()` — sandbox paths to this skill, reject non-markdown loads, skip missing files, and suppress duplicates.
3. `score_intents(task)` and `select_intents(scores, ambiguity_delta=1.0)` — preserve provider-specific weighted intent scoring and top-2 ambiguity handling.
4. `get_routing_key(task, intents)` — derive the provider routing key from task/provider context, then fall back to `cursor-agent`.
5. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
6. CONDITIONAL-load `RESOURCE_MAP[intent]`, ON_DEMAND-load keyword matches, and return a notice when no provider-specific knowledge base is available beyond always-load resources.

The `route_cursor_resources(task)` function body lives in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md) — substitute `<PROVIDER>` = `cursor`.

---

## 3. HOW IT WORKS

### Prerequisites

Install with `curl https://cursor.com/install -fsS | bash` (Windows: `irm 'https://cursor.com/install?win32=true' | iex`). cli-cursor authenticates through **Cursor account OAuth** — run `cursor-agent login` and complete the browser flow (`NO_OPEN_BROWSER` disables browser opening for headless hosts). Headless/CI auth uses `CURSOR_API_KEY` or `--api-key`. Full install, auth, flag, hook, and unique-surface tables live in the ALWAYS-loaded [cli-reference.md](./references/cli-reference.md) — this section keeps only the routing decisions and dispatch-critical gotchas.

### Execution Ownership

This packet owns user-facing routing, the `command -v cursor-agent` availability probe, prompt construction, and the self-invocation guard. Actual process construction and execution delegate to the already-shipped deep-loop runtime at `../../system-deep-loop/runtime/scripts/fanout-run.cjs`, using executor kind `cli-cursor`.

The runtime is the single Cursor execution adapter. Do not add a packet-local wrapper, command builder, or spawn path. Direct `cursor-agent -p` snippets below are operator reference and manual-testing examples; orchestrated dispatches use the shared runtime.

### Provider Auth Pre-Flight

**MANDATORY before any first dispatch in a session.** `cursor-agent -p` without a valid session exits `0` even on an auth failure — the exit code is never a reliable availability signal. Run this check once per session, cache the result, and re-run it only if a dispatch's output text (not its exit code) shows an authentication error.

```bash
# One-shot pre-flight: capture account auth status for routing
CURSOR_ABOUT=$(cursor-agent about 2>&1)
echo "$CURSOR_ABOUT" | grep -qi "not logged in" && CURSOR_AUTH_OK=0 || CURSOR_AUTH_OK=1
```

**Decision tree** (apply in order — first match wins):

| State | CURSOR_AUTH_OK | Action |
|-------|-----------------|--------|
| Authenticated | 1 | Proceed with `cursor-agent -p "<prompt>" --output-format text --model composer-2.5 --auto-review --sandbox enabled` |
| Not logged in | 0 | **ASK user** to run `cursor-agent login` — surface the command, do NOT dispatch. Never substitute an unrelated CLI. |

**User prompt template — not logged in:**

```
Cursor CLI is not authenticated on this machine. cli-cursor uses Cursor account OAuth
(or CURSOR_API_KEY for headless auth). Run `cursor-agent login`
(browser flow), then confirm when login finishes — the skill will retry the original dispatch.
```

**Error-recovery contract.** If a dispatch's output text shows an auth error after pre-flight passed (session expired or revoked), invalidate the cache, re-run the pre-flight, and re-check before retrying. Never substitute a model the user didn't approve.

### Default Invocation (Skill Default)

**Default model + approval**: `composer-2.5` (Cursor's own native model) · `auto-review` approval (Smart Auto). `auto` (Cursor's own router) is NOT used — it can silently resolve to a model outside the enforced allowlist below, which defeats the point of enforcing one.

```bash
cursor-agent -p "<prompt>" \
  --output-format text \
  --model composer-2.5 \
  --auto-review \
  --sandbox enabled
```

**User override** (honor explicit user phrasing verbatim, but ONLY within the enforced allowlist — see Model Selection below):

| User says | Resolve to |
|-----------|------------|
| (nothing specified) | `--model composer-2.5 --auto-review --sandbox enabled` |
| "Use Composer" | `--model composer-2.5 --auto-review --sandbox enabled` |
| "Use Composer fast" | `--model composer-2.5-fast --auto-review --sandbox enabled` |
| "Use Grok" / "Grok high" | `--model cursor-grok-4.6-high --auto-review --sandbox enabled` |
| "Use GLM" / "GLM max" | `--model glm-5.2-max --auto-review --sandbox enabled` |
| "Just plan it, don't write anything" | `--model composer-2.5 --mode plan` (read-only; approval flags do not apply in plan mode) |
| "Full auto, run everything" | `--model composer-2.5 --force --sandbox disabled` |
| Any model NOT in the allowlist (e.g. "GPT-5.2 high", "use auto") | **Refuse the model, do not substitute silently.** Tell the user this dispatch is scoped to the allowlist below and ask which allowed model to use instead. |

Honor whichever dimensions the user names (approval level, mode). Model stays on `composer-2.5` unless the user explicitly names a different ALLOWED model.

### Model Selection — Enforced Allowlist

**cli-cursor dispatch is scoped to exactly 21 ids — never dispatch a model outside the allowlist (including `auto`), and never substitute the closest-sounding allowed model without telling the user.** Default `composer-2.5`; pick a Gemini 3.7 Flash High / GLM 5.2 / GPT-5.6 Luna Max / Grok (4.5 or 4.6) tier only when the task or user explicitly names that family. Cursor has no `--reasoning-effort` flag and rejects parameterized model brackets outright — effort tiers must be selected through exact enumerated ids.

The enforced allowlist (21 ids) and the per-task rationale table live inline in [references/cli-reference.md](./references/cli-reference.md) §5 and [references/providers-and-models.md](./references/providers-and-models.md) §2. Enforced at the runtime layer (`CURSOR_SUPPORTED_MODELS` in `executor-config.ts`, checked by `fanout-run.cjs` and `dispatch-model.cjs` before any command is constructed) and at this skill layer. If a task seems to need a model outside the allowlist, escalate to the user rather than fabricating a substitute or falling back to `auto`.

### Cursor Agent Delegation

The calling AI is the conductor; Cursor's own skill system at `~/.cursor/skills-cursor/` (observed live: `automate`, `babysit`, `canvas`, `create-hook`, `create-rule`, `create-skill`, `create-subagent`, `loop`, `migrate-to-skills`, `sdk`, `shell`, `split-to-prs`, `statusline`, `update-cli-config`, `update-cursor-settings`) confirms Cursor supports subagents natively, but these are Cursor-editor-side conventions, not a `-p <profile>` flag like Codex's. Full delegation contract and the `--mode plan`/`--mode ask`/default-agent execution-mode roster: [agent-delegation.md](./references/agent-delegation.md).

### Repository Rules, Hook Delivery, and Parity Boundaries

Cursor CLI reads project `.cursor/rules/*.md`, root `AGENTS.md`, root `CLAUDE.md`, and legacy `.cursorrules` automatically. This repo now uses `.cursor/rules/skill-routing.md` as a compact, always-on pointer to the relevant top-level `.opencode/skills/*/SKILL.md` packets. It is static session context, not a replacement for dynamic per-turn classification.

The `beforeSubmitPrompt` adapter is designed to deliver a dynamic skill-advisor-equivalent brief, but delivery is confirmed dormant under the installed Cursor CLI build. Its source marks the status as registered but unconfirmed and records the shared-advisor delegation in [`user-prompt-submit.ts`](../../system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts#L5-L14) and [`user-prompt-submit.ts`](../../system-spec-kit/mcp-server/hooks/cursor/user-prompt-submit.ts#L45-L51). A live marker re-probe against `cursor-agent 2026.07.23-e383d2b` confirmed that `beforeSubmitPrompt` did not fire. The static rules file therefore complements a missing dynamic brief; it does not claim to provide per-turn advisor output. The hook registration and adapter remain unchanged.

#### Custom Subagents (CORRECTION -- earlier claim was wrong)

An earlier pass recorded that "`cursor-agent --help` has no custom-agent-loading concept." **That was wrong**, and the error is instructive: agent profiles are discovered by *file convention*, never by a CLI flag, so grepping `--help` for a flag proves nothing about whether the concept exists.

Cursor CLI loads custom subagents from two places, confirmed live:

| Source | Scope | Status here |
|--------|-------|-------------|
| `.cursor/agents/*.md` | project | This repo mirrors all 13 roster agents here |
| `.claude/agents/*.md` | project (Claude-format auto-import) | Already worked before any mirror existed |

Cursor's own bundled `create-subagent` skill documents the format: `name` + `description` frontmatter (both required), markdown body as the system prompt. A live `cursor-agent --force -p` roster probe lists all 13 repo agents (`ai-council`, `code`, `context`, `debug`, `deep-alignment`, `deep-improvement`, `deep-research`, `deep-review`, `design`, `markdown`, `orchestrate`, `prompt-improver`, `review`) alongside Cursor's own built-ins, with no duplicate entries when both sources define the same name.

Each `.cursor/agents/<name>.md` is a **symlink** to the canonical `.claude/agents/<name>.md`, matching the discovery-mirror precedent already used for `.claude/hooks/` and `.codex/hooks/`. One source of truth, so a mirror can never drift from the agent it mirrors.

Note: `~/.cursor/agents/` (user-level) is documented by Cursor but a live probe found the CLI did **not** load a profile placed there; only the project-level paths above are verified working. Dispatch remains subject to this repo's own `preToolUse` spec-gate, which is correct behavior.

`cursor-agent --help` has no native command-roster listing subcommand. This repository still exposes a `.cursor/commands/` parity surface: the synchronizer derives it from eligible `.opencode/commands/` files, excludes `goal-opencode.md`, and adds the runtime-native `goal-cursor.md`; validate membership with `command-scope.cjs` and validate behavior with a real slash-command invocation.

| Task Type | Execution mode |
|-----------|-----------------|
| Code review / bug detection | default agent, `--sandbox enabled` |
| Read-only exploration / architecture questions | `--mode ask` |
| Multi-step planning without writes | `--mode plan` |
| Code generation / file edits | default agent, `--auto-review` or `--force` |

### Dispatch-Critical Gotchas

The full flag glossary, hook contract, shared-config surface, and troubleshooting table are in the ALWAYS-loaded [cli-reference.md](./references/cli-reference.md). Gotchas that silently break a dispatch and must be honored at routing time:

- **The exit code is never an availability signal.** `cursor-agent -p` without auth exits `0` and prints an error to stdout/stderr instead. Every guard and pre-flight in this packet checks output text, never exit code.
- **The canonical binary is `cursor-agent`, never the bare `agent` alias.** `agent` is a symlink to the same binary; using it in a process-ancestry match risks colliding with an unrelated `agent` command.
- **Cursor shares its entire config surface with the Cursor editor** (`.cursor/`/`~/.cursor/`: `mcp.json`, `hooks.json`, `rules/`, `cli-config.json`). A dispatched `cursor-agent` silently inherits the operator's shared hooks/MCP/rules unless a workspace/config-isolation flag is used — see [shared-editor-config.md](./references/shared-editor-config.md).
- **No `model[effort=...]` bracket support.** Unlike some sibling CLIs' parameterized model syntax, `cursor-agent --model 'cursor-grok-4.6[effort=high]'` is rejected outright ("Cannot use this model") — effort tiers must be selected via an exact enumerated id (`cursor-grok-4.6-high`), never a bracket.
- **`--auto-review`/`--force` are the write-capable escalation, not `--sandbox`.** `--sandbox enabled|disabled` toggles the OS-level sandbox; the approval decision (whether unattended actions run without a human) is `--auto-review` (Smart Auto) or `--force`/`--yolo` (Run Everything) — omitting both leaves Cursor's own prompt-and-block default in place, which cannot proceed unattended.
- **Project-scoped MCP servers show `not loaded (needs approval)`** until trusted. For a non-interactive dispatch that needs MCP tools, add `--approve-mcps` to the `cursor-agent -p` command (auto-approves configured MCP servers for that run); for a persistent operator grant use `cursor-agent mcp enable <server>` (a trust mutation the automation itself must never run).

---

## 4. RULES

### ✅ ALWAYS

1. Verify Cursor CLI is installed before first invocation (`command -v cursor-agent`).
2. Delegate orchestrated execution to `../../system-deep-loop/runtime/scripts/fanout-run.cjs` with executor kind `cli-cursor`; never build a second adapter in this packet.
3. Use `--mode plan` or `--mode ask` for read-only exploration/analysis/research; use the default agent mode with `--auto-review` or `--force` for code generation/file modification.
4. Validate Cursor-generated code (XSS, injection, eval, syntax checks via `node --check`, `tsc --noEmit`, etc.) before applying.
5. Capture stderr (`2>&1`) so errors surface; check output TEXT for auth/availability failures, never the exit code (always `0`).
6. **Redirect cursor-agent stdin from `/dev/null`** when dispatching in a `while read` loop, mirroring the family-wide convention: `cursor-agent -p "$PROMPT" > "$LOG" 2>&1 </dev/null &`. Live-verified: a real `cursor-agent -p ... </dev/null` dispatch completes normally with no hang.
7. **Specify model and approval mode explicitly** — never rely on caller environment. Default: `--model composer-2.5 --auto-review --sandbox enabled`. Honor user overrides verbatim, but ONLY within the enforced allowlist (§3 Model Selection) — never `auto`, never a model outside the 21 allowed ids.
8. Route to `--mode plan`/`--mode ask`/default agent per the task type (see Section 3 routing table).
9. **Pass the spec folder to the delegated agent** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating — the delegated agent cannot answer Gate 3 in `--force`/non-interactive mode.
10. **Prompt construction & model-craft (cli-* family precedence).** Compose every dispatch prompt via the 3-tier rule canonical in `../../sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md`:
   1. **Fast path (default).** Build from the local `assets/prompt-quality-card.md`, which delegates the framework table + CLEAR check to the canonical card.
   2. **Model override (mandatory for a profiled model).** If the target model has a profile at `../../sk-prompt/sk-prompt-models/references/models/<id>.md`, that profile OVERRIDES the cross-model default.
   3. **Deep path (escalation).** Dispatch `@prompt-improver` via the Task tool (never load full `sk-prompt` inline) when any canonical **Tier 3** trigger applies — the trigger list lives in `../../sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` under "Tier 3 — Deep path"; do not re-enumerate it here.
11. **Never inject user-level voice/personalization content into AI-orchestrated Cursor delegations.** Cursor CLI reads rules from `.cursor/rules`, `AGENTS.md`, `CLAUDE.md`, and legacy `.cursorrules` automatically. When an AI delegates via `cursor-agent -p`, the calling AI's own voice rules govern the response — keep delegations focused on task/model/approval/(spec-folder pre-approval).
12. **Code Standards Loading (surface-aware contract)** — When dispatching for code review or code generation, instruct the dispatched session to: (1) load `sk-code`; (2) let `sk-code` emit a surface tag matching the detected stack from markers and target files; (3) load the selected surface resources and run its verification commands; (4) add `code-review` only for formal findings-first review output. Fallback: if the surface cannot be determined confidently, ask for the runtime surface and verification command set. NEVER hardcode obsolete sibling code skills in dispatch prompts.
13. **Design Standards Loading (surface-aware contract)** — When dispatching for design or UI work, instruct the dispatched session to: (1) load `sk-design` (the hub); (2) let the hub resolve a `workflowMode` through `mode-registry.json` (`sk-design-interface` / `sk-design-md-generator`); (3) load the selected mode packet, set the design register, and run that mode's design verification. Fallback: if the design mode cannot be determined confidently, ask for the surface and design intent. NEVER treat `mcp-figma` as the taste authority, or hardcode obsolete flat design skills in dispatch prompts.
14. **Pass the design dispatch manifest to the dispatched session** — when dispatching design or UI work, inline a `DESIGN_DISPATCH_MANIFEST v1` block in the prompt (the child cannot resolve skill paths, so the manifest travels in the payload, not by reference): `skDesignLoaded` true, `register` resolved to `Brand` or `Product` (never `unknown`), registry-valid `workflowModes`, `dials`, `loadedFiles`, and `proofDemandBack`. If the manifest cannot be assembled — `sk-design` not loaded, register unresolved, or no registry-valid mode — ASK before launching the child rather than starting a silent design dispatch. The child returns the demanded proof; the parent reconciles it on the return path.
15. **Single-dispatch discipline (operator-gated, session-scoped)** — Default: launch ONE cli-* dispatch at a time across the cli-* family. Wait for the dispatched agent's work to return, verify outputs exist, then SIGKILL only the dispatch THIS skill started: capture its PID at launch (`cursor-agent -p ... & CURSOR_PID=$!`) and kill that captured PID directly plus its own orphan children (`kill -9 "$CURSOR_PID" 2>/dev/null; pkill -9 -P "$CURSOR_PID" 2>/dev/null`). **Never use a blanket `pkill -9 -f "cursor-agent"` pattern** — that matches and kills EVERY running `cursor-agent` process on the machine, including the operator's unrelated Cursor sessions (and the operator's own Cursor editor, since the CLI shares the binary family). Only launch the next dispatch (this skill OR a sibling) after the prior one is dead and RSS has dropped. **Within a deep-flow session** (deep-review / deep-research): the operator authorizes the whole multi-iteration session at start — iterations chain back-to-back with kill-between as the safety mechanism, NOT a per-iteration confirmation prompt. **Exception (cross-skill parallel)**: when the operator explicitly authorizes N parallel dispatches, run N concurrently — but still SIGKILL each by its own captured PID as its work returns.
16. **Set `AI_SESSION_CHILD=1` in the dispatched child's env** when sessions may be launched through the per-session worktree wrapper (`.opencode/bin/worktree-session.sh`). A dispatched `cursor-agent -p` is an orchestrated sub-session, not a new top-level session, so it must SHARE the parent's worktree rather than allocate its own (distinct from Cursor's own native `-w` worktree flag, which this packet's default dispatch never passes). Pattern: `AI_SESSION_CHILD=1 cursor-agent -p ... </dev/null`. Harmless when the wrapper is not in use. See `.opencode/bin/README.md` → "Worktree session isolation".

### ⛔ NEVER

1. Pass `-w`/`--worktree` or dispatch `cursor-agent worker` from orchestrated fan-out without explicit user approval — these are opt-in escape hatches documented in `references/cursor-tools.md`, not this packet's default dispatch behavior.
2. Trust Cursor output blindly for security-sensitive code, send sensitive data (API keys, passwords, credentials) in prompts, or hammer the CLI with rapid sequential calls.
3. Use Cursor for tasks where context is already loaded — direct action by the calling AI is faster.
4. Assume Cursor output is correct without verification — cross-reference codebase and project standards.
5. Build or maintain a packet-local Cursor execution adapter; the deep-loop runtime is the execution authority.
6. Treat a `0` exit code as proof of a successful, authenticated dispatch — always inspect output text.
7. Dispatch a `--model` value outside the enforced 21-id allowlist (§3 Model Selection) — including `auto` — or silently substitute the closest-sounding allowed model instead of asking the user. Enforced at the runtime layer (`CURSOR_SUPPORTED_MODELS`/`isCursorModelAllowed` in `executor-config.ts`; a hard-rejecting check in `fanout-run.cjs`'s `buildCursorLineageCommand` and `dispatch-model.cjs`'s cli-cursor case) — this rule states the same constraint for any advisory/manual dispatch the runtime layer cannot see.

### ⚠️ ESCALATE IF

1. Cursor CLI is not installed and user has not acknowledged (provide `curl https://cursor.com/install -fsS | bash`).
2. `cursor-agent about` reports "Not logged in" and the user has not acknowledged running `cursor-agent login`.
3. Cursor output conflicts with existing code patterns (present both perspectives; user decides).
4. Task requests `cursor-agent worker` (cloud execution) or native worktree isolation (`-w`) as part of an orchestrated fan-out (describe the scope-creep risk; get explicit user approval).

### Memory Handback Protocol

When the calling AI needs to preserve session context from a Cursor CLI delegation, run the canonical 7-step procedure (extract `MEMORY_HANDBACK` section → build structured JSON → scrub secrets → invoke `generate-context.js` via `--stdin`/`--json`/temp-file → `memory_index_scan`). Full procedure and caveats: [`system-spec-kit/references/cli/memory-handback.md`](../../system-spec-kit/references/cli/memory-handback.md). Cursor-specific Memory Epilogue template: [assets/prompt-templates.md](./assets/prompt-templates.md).

```bash
printf '%s' "$JSON_PAYLOAD" | node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js --stdin [spec-folder]
```

---

## 5. REFERENCES

### Core References

- [cli-reference.md](./references/cli-reference.md) - Complete CLI subcommands, flags, auth, and troubleshooting reference
- [integration-patterns.md](./references/integration-patterns.md) - Cross-AI orchestration patterns and workflows
- [cursor-tools.md](./references/cursor-tools.md) - Cursor-unique surfaces: native worktree (`-w`), cloud `worker`, plugin marketplace, MCP
- [hook-contract.md](./references/hook-contract.md) - Cursor's shared hooks.json contract (events, schema, discovery, envelope)
- [shared-editor-config.md](./references/shared-editor-config.md) - The shared `.cursor/`/`~/.cursor/` editor-config surface and dispatch-isolation implications
- [agent-delegation.md](./references/agent-delegation.md) - Cursor execution-mode roster (default/plan/ask) and delegation patterns

### Templates and Assets

- [prompt-templates.md](./assets/prompt-templates.md) - Copy-paste ready prompt templates for common tasks
- [prompt-quality-card.md](./assets/prompt-quality-card.md) - Fast-path prompt framework + CLEAR check (ALWAYS loaded)

### Manual Testing

- [manual-testing-playbook.md](./manual-testing-playbook/manual-testing-playbook.md) - 19 CU-NNN scenarios across 9 categories; the canonical no-mocking PASS/FAIL/SKIP validation gate for this skill

### Shared (cli-* family)

- [shared-smart-router.md](../../system-spec-kit/references/cli/shared-smart-router.md) - Helper-function bodies for the smart router.
- [memory-handback.md](../../system-spec-kit/references/cli/memory-handback.md) - Canonical 7-step Memory Handback procedure.

### External

- [Cursor CLI docs](https://cursor.com/docs/cli/overview) - Official documentation
- [Cursor account](https://cursor.com) - Cursor account (auth for cli-cursor)

### Reference Loading Notes

- Load only references needed for current intent; Smart Routing (Section 2) is the single routing authority.
- `cli-reference.md` is ALWAYS loaded as baseline.

---

## 6. SUCCESS CRITERIA

### Task Completion

- Cursor CLI invoked with correct subcommand, flags, model, and approval mode.
- Output captured, validated, and integrated appropriately; no security vulnerabilities introduced.
- Auth failures handled gracefully (text-based detection, never exit-code-based).
- Appropriate execution mode matched to task type (`--mode ask`/`--mode plan` for read-only, default agent for generation).
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

Related skills: `cli-codex` for OpenAI-backed delegation, `cli-claude-code` for extended reasoning, `cli-opencode` for full OpenCode runtime dispatch, `sk-code` for code-quality contracts, `mcp-code-mode` for external MCP work, and `system-spec-kit` for packet handback.
