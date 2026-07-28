---
name: cli-pi
description: "Pi CLI executor for guarded headless coding, JSON/RPC integration, native skills/extensions, and community-package delegation."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.2.0.0
hard_rules:
  - id: pi-availability-required
    check: command-v-pi-required
    message: "Run command -v pi before every dispatch; if it fails, refuse the route without constructing or launching a command."
    severity: error
  - id: self-invocation-prohibited
    check: pi-self-invocation-guard
    message: "Refuse dispatch when Pi runtime signals are present; a running CLI skill never dispatches itself."
    severity: error
  - id: deep-loop-runtime-required
    check: deep-loop-runtime-delegation
    message: "Delegate execution to the shipped deep-loop runtime; this skill must not implement a second Pi adapter."
    severity: error
---

<!-- Keywords: pi cli, pi agent, pi.dev cli, pi coding agent, delegate to pi, cross-ai, headless dispatch, json event stream, rpc mode, native skills, extensions, pi packages -->

# Pi CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the Pi CLI binary, pi. If the agent reading this skill is already running inside Pi, refuse to construct a Pi invocation.
>
> A running CLI skill never dispatches itself. The cli-X skills are for cross-AI delegation only.

Orchestrate Pi's terminal coding agent for headless coding, read-only tool-constrained reviews, JSON event-stream integrations, RPC clients, and Pi-native resource discovery. The pinned contract is the source for confirmed command behavior: [Pi contract pin](../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md). Pi-native skills, prompt templates, and some package surfaces remain documented but unconfirmed unless a source says otherwise.

**Core principle**: use Pi for the surfaces it exposes, delegate execution to the shared runtime, validate the returned output, and keep the calling AI as conductor.

---

## 1. WHEN TO USE

### Activation Triggers

- **Headless Pi dispatch**: use when the task explicitly requests Pi, pi.dev, or the Pi coding agent.
- **Cross-AI validation**: use for an independent implementation attempt, code review, or second opinion through Pi.
- **JSON event output**: use when a caller needs Pi's line-delimited event stream.
- **RPC integration**: use when a long-lived stdin/stdout protocol is explicitly requested.
- **Pi-native resources**: use when the task concerns Pi skills, prompt templates, extensions, or installed packages.
- **Community package delegation**: use when the task explicitly names pi-subagents or pi-mcp-extension.

### When NOT to Use

- **You ARE Pi already.** Refuse if process ancestry indicates a Pi process or the local project heuristic indicates an active Pi context. The guard is intentionally conservative.
- Pi is not installed or cannot be found on PATH.
- The task is a small in-process change that the calling AI already understands.
- The task requires a feature that belongs to the shared deep-loop runtime rather than this packet.
- A community package is requested without approval to install or trust project-local files.

---

## 2. SMART ROUTING

### Prerequisite Detection

Run this probe before every dispatch. Do not build a command when it fails.

~~~bash
command -v pi || echo "Not installed. Install @earendil-works/pi-coding-agent before dispatch."
~~~

The pinned contract confirms the binary version used for the contract run and the headless entry point. For exact flags and observed failure behavior, load [cli-reference.md](./references/cli-reference.md).

### Self-Invocation Guard

Use the following guard before loading a dispatch template:

~~~python
def detect_self_invocation():
    """Return a signal when the caller is likely already inside Pi."""
    # Process ancestry is a documented-but-unconfirmed signal for this packet.
    try:
        ancestry = subprocess.check_output(
            ["ps", "-o", "command=", "-p", str(os.getppid())],
            text=True,
        )
        if "/pi" in ancestry or ancestry.strip().endswith(" pi"):
            return ("ancestry", "pi")
    except (OSError, subprocess.SubprocessError):
        pass

    # The .pi directory is a non-conclusive project heuristic, not proof of an active session.
    if os.path.isdir(os.path.join(os.getcwd(), ".pi")):
        return ("project-heuristic", ".pi")

    # No first-party environment signal is treated as confirmed here. Absence of a
    # detected signal is not proof that no Pi session is active.
    return None

signal = detect_self_invocation()
if signal:
    refuse(
        "Self-invocation refused: the caller may already be running inside Pi. "
        "Use a different runtime or a fresh shell session."
    )
~~~

The guard deliberately uses only process ancestry and the non-conclusive project heuristic. It does not invent an environment variable or infer safety from a missing signal.

### Resource Loading Levels

| Level | Load when | Resources |
|---|---|---|
| ALWAYS | Every Pi route | references/cli-reference.md, assets/prompt-quality-card.md |
| CONDITIONAL | Task names the matching surface | One or more intent-mapped references |
| ON_DEMAND | The operator asks for templates or package detail | assets/prompt-templates.md, native-skills-and-extensions.md, mcp-and-third-party-packages.md |

### Smart Router

Provider-specific dictionaries (used by the shared helper functions in [`system-spec-kit/references/cli/shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md)):

```python
INTENT_SIGNALS = {
    "GENERATION": {"weight": 4, "keywords": ["generate", "create", "build", "write code", "pi coding agent"]},
    "REVIEW": {"weight": 4, "keywords": ["review", "audit", "bug", "second opinion", "cross-validate"]},
    "HEADLESS": {"weight": 4, "keywords": ["pi cli", "pi agent", "headless", "print mode", "json event"]},
    "RPC": {"weight": 4, "keywords": ["rpc", "stdin", "stdout", "jsonl", "persistent process"]},
    "AGENT_DELEGATION": {"weight": 4, "keywords": ["delegate", "subagent", "pi-subagents", "agent bridge"]},
    "NATIVE_RESOURCES": {"weight": 4, "keywords": ["skill", "prompt template", "extension", "pi-mcp-extension", "package"]},
    "PATTERNS": {"weight": 3, "keywords": ["pattern", "workflow", "session", "resume", "continue"]},
    "TEMPLATES": {"weight": 3, "keywords": ["template", "prompt", "how to ask", "pi prompt"]},
}

RESOURCE_MAP = {
    "GENERATION": ["references/cli-reference.md", "assets/prompt-templates.md"],
    "REVIEW": ["references/integration-patterns.md", "references/cli-reference.md"],
    "HEADLESS": ["references/cli-reference.md", "assets/prompt-templates.md"],
    "RPC": ["references/cli-reference.md", "references/integration-patterns.md"],
    "AGENT_DELEGATION": ["references/agent-delegation.md", "references/integration-patterns.md"],
    "NATIVE_RESOURCES": ["references/native-skills-and-extensions.md", "references/mcp-and-third-party-packages.md"],
    "PATTERNS": ["references/integration-patterns.md", "references/cli-reference.md"],
    "TEMPLATES": ["assets/prompt-templates.md", "assets/prompt-quality-card.md"],
}

LOADING_LEVELS = {
    "ALWAYS": ["references/cli-reference.md", "assets/prompt-quality-card.md"],
    "ON_DEMAND_KEYWORDS": ["full reference", "all templates", "deep dive", "mcp extension", "subagent package", "native skills"],
    "ON_DEMAND": ["references/native-skills-and-extensions.md", "references/mcp-and-third-party-packages.md", "assets/prompt-templates.md"],
}

UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm that the user wants Pi rather than another cli-X mode",
    "Confirm whether the task is print, JSON, RPC, or interactive",
    "Confirm whether project-local resources may be trusted",
    "Confirm the required verification command before dispatch",
]
```

**Call sequence** (using shared helpers from `shared-smart-router.md`):

1. `discover_markdown_resources()` — recursively enumerate current `.md` files under existing `references/` and `assets/` folders at routing time.
2. `_guard_in_skill()` + `load_if_available()` — sandbox paths to this skill, reject non-markdown loads, skip missing files, and suppress duplicates.
3. `score_intents(task)` and `select_intents(scores, ambiguity_delta=1.0)` — preserve provider-specific weighted intent scoring and top-2 ambiguity handling.
4. `get_routing_key(task, intents)` — derive the provider routing key from task/provider context, then fall back to `cli-pi`.
5. ALWAYS-load `LOADING_LEVELS["ALWAYS"]`, then return `UNKNOWN_FALLBACK` with `UNKNOWN_FALLBACK_CHECKLIST` when max score is 0.
6. CONDITIONAL-load `RESOURCE_MAP[intent]`, ON_DEMAND-load keyword matches, and return a notice when no provider-specific knowledge base is available beyond always-load resources.

The `route_pi_resources(task)` function body lives in [`shared-smart-router.md`](../../system-spec-kit/references/cli/shared-smart-router.md) — substitute `<PROVIDER>` = `pi`.

---

## 3. HOW IT WORKS

### Execution Ownership

This packet owns provider-specific routing, the availability probe, prompt construction, and the self-invocation guard. The shared deep-loop runtime owns process construction and execution. Use the executor kind cli-pi once the runtime supports it. Do not add a packet-local wrapper, spawn path, or command builder.

The pinned contract confirms that headless Pi uses print mode, that JSON mode emits JSONL events, and that RPC mode is a persistent JSONL protocol. These are different contracts. Do not treat RPC as a one-shot print invocation. See [cli-reference.md](./references/cli-reference.md) and [integration-patterns.md](./references/integration-patterns.md).

### Dispatch Lifecycle

1. Verify the binary with command -v pi.
2. Run the self-invocation guard.
3. Classify the request as print, JSON, RPC, read-only tool-constrained review, native-resource inspection, or generation.
4. Compose the prompt using [prompt-quality-card.md](./assets/prompt-quality-card.md).
5. Pass the request to the shared deep-loop runtime.
6. Capture stdout and stderr separately when the runtime allows it.
7. Validate the output, changed files, and required tests before handback.

### Headless Modes

| Requested result | Pi surface | Guardrail |
|---|---|---|
| One prompt and final response | print mode with -p or --print | Inspect output, not exit code alone |
| Structured events | --mode json | Parse one JSON object per line |
| Long-lived integration | --mode rpc | Keep stdin/stdout as a JSONL protocol |
| Read-only review | print mode plus --tools read,grep,find,ls | Treat the tool allowlist as the write boundary |

The print, JSON, RPC, and tool flags above are from the live help capture and the pinned contract. The read-only pattern is a caller-selected restriction, not a separate Pi plan mode.

### Provider Preflight

Pi reports missing provider credentials in output. The pinned contract observed the same failure with different exit codes across otherwise identical invocations. Never use an exit code alone to claim that a dispatch reached a model. If the output reports a missing API key, stop and surface the provider requirement.

### Native Resources

Pi's native resource surfaces are documented separately because their discovery behavior is not uniformly live-confirmed:

- [native-skills-and-extensions.md](./references/native-skills-and-extensions.md) covers skills, prompt templates, and extensions.
- [mcp-and-third-party-packages.md](./references/mcp-and-third-party-packages.md) covers packages, MCP, and community bridges.
- [agent-delegation.md](./references/agent-delegation.md) distinguishes built-in tools from community subagent packages.

### Prompt Construction

The caller remains responsible for task scope, files, acceptance criteria, and verification. Use the prompt templates as scaffolds, not as a substitute for reading the target mode's skill contract. Pass an established spec folder to a non-interactive child when the parent workflow requires it.

### Dispatch-Critical Gotchas

The full flag glossary and pinned-contract citations are in the ALWAYS-loaded [cli-reference.md](./references/cli-reference.md). Gotchas that silently break a dispatch and must be honored at routing time:

- **`--offline` is required for any automated or CI dispatch.** `pi --verbose` without `--offline` hung for over two minutes with no reachable network path in the pinned contract's live probe. Any non-interactive dispatch through this packet must pass `--offline` explicitly rather than rely on a fast failure.
- **The exit code is never an availability or auth signal.** An identical unauthenticated `pi -p` dispatch returned exit `0` on the first run and exit `1` on every subsequent run in the pinned contract. Every guard in this packet checks output text (`No API key found...`), never exit code.
- **An invalid `.pi/extensions/*.ts` fails the whole session, not just that extension.** The pinned contract confirmed Pi validates extensions must export a factory function; a broken one blocks the entire dispatch with `Extension does not export a valid factory function` rather than skipping it with a warning.
- **The default provider is `google`, not Anthropic.** `pi --help` documents `--provider <name> (default: google)`. Do not assume an Anthropic-first default when composing a dispatch that omits `--provider`.
- **`pi install`/`pi list` require `--approve` to see or modify project-local package config.** Without it, both commands behave as if no packages exist, even when one is installed — the trust gate applies to reads, not only writes.

---

## 4. RULES

### ✅ ALWAYS

1. Run command -v pi before every dispatch.
2. Run the self-invocation guard before constructing a command.
3. Delegate execution to the shared deep-loop runtime.
4. Choose print, JSON, or RPC deliberately. RPC is persistent and is not a print-mode alias.
5. Capture and inspect output text for provider and extension failures.
6. Use the prompt-quality card's three-tier precedence rule.
7. Apply the least-permissive tool set that satisfies the task.
8. Validate Pi-generated changes with the repository's code and test gates.
9. Keep the current runtime as conductor and Pi as delegated executor.
10. Treat Pi-native discovery claims as confirmed only when backed by the pinned contract or a linked live documentation page.

### ⛔ NEVER

1. Never dispatch when command -v pi fails.
2. Never dispatch Pi from a Pi session detected by the guard.
3. Never build a second Pi adapter inside this packet.
4. Never trust exit code alone as proof of model execution.
5. Never claim that skill or prompt-template flattening has been live-verified here.
6. Never install pi-subagents or pi-mcp-extension without explicit package and trust review.
7. Never treat community packages as Pi first-party features.
8. Never use a bare single-token pi alias in routing metadata.
9. Never pass secrets or provider keys in prompts.

### ⚠️ ESCALATE IF

1. Pi is missing from PATH.
2. The self-invocation guard detects ancestry or the .pi heuristic.
3. The task needs a successful provider dispatch but no credentials are available.
4. The task depends on a native discovery behavior still marked unconfirmed.
5. The task requests an install or project-local package change without trust approval.
6. The task requests RPC lifecycle behavior that the shared runtime does not yet support.

---

## 5. REFERENCES

### Core References

- [cli-reference.md](./references/cli-reference.md) - Confirmed CLI flags, modes, auth failure behavior, model selection, and command examples
- [pi-tools.md](./references/pi-tools.md) - Pi capabilities with no sibling analog (RPC, native extensions/prompts, tool surface)
- [integration-patterns.md](./references/integration-patterns.md) - Conductor/executor patterns, cross-validation, and anti-patterns
- [agent-delegation.md](./references/agent-delegation.md) - Built-in boundary and community subagent package guidance
- [native-skills-and-extensions.md](./references/native-skills-and-extensions.md) - Pi-native discovery surfaces with confidence labels
- [mcp-and-third-party-packages.md](./references/mcp-and-third-party-packages.md) - MCP and community package boundaries

### Templates and Assets

- [prompt-quality-card.md](./assets/prompt-quality-card.md) - Thin delegator to the canonical prompt-models card
- [prompt-templates.md](./assets/prompt-templates.md) - Print, JSON, RPC, review, and generation scaffolds

### External Sources

- [Pi contract pin](../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md) - Local live-verification evidence
- [Pi skills documentation](https://pi.dev/docs/latest/skills) - Documentation-only native skill surface
- [Pi RPC documentation](https://pi.dev/docs/latest/rpc) - Documentation-only RPC surface
- [Pi JSON documentation](https://pi.dev/docs/latest/json) - Documentation-only JSON event stream

---

## 6. SUCCESS CRITERIA

### Dispatch Completion

- Pi is present on PATH before launch.
- The self-invocation guard returns no signal.
- The selected mode matches the requested output contract.
- Output is captured and checked for auth, extension, and package errors.
- Any workspace changes pass the calling workflow's verification gates.
- The shared deep-loop runtime owns process execution.

### Packet Quality

- References are loaded progressively and remain packet-local.
- Unconfirmed Pi-doc behavior is labeled as unconfirmed.
- Community packages are clearly separated from Pi's first-party CLI.
- No nested advisor identity is introduced under cli-pi.

---

## 7. INTEGRATION POINTS

### Hub Integration

The hub owns advisor identity, mode registration, and router policy. This packet owns only the Pi workflow contract. The packet must not add description.json or graph-metadata.json.

### Deep-Loop Integration

The shared runtime is the sole process adapter. The packet supplies the selected mode, validated prompt, and runtime requirements. Runtime support is a prerequisite for an end-to-end dispatch.

### Code and Spec Integration

sk-code owns surface detection and code verification. system-spec-kit owns Gate 3, spec folders, memory, and continuity. Include the parent spec folder in delegated prompts when the workflow has already established one.

### Tool Roles

- Bash runs the availability probe and the shared runtime entry point.
- Read, Glob, and Grep inspect prompts, references, and returned changes.
- This packet does not grant new external tools.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers markdown resources dynamically. Start with the CLI reference and prompt-quality card, then load only the references matching the task. Use [prompt-templates.md](./assets/prompt-templates.md) for repeatable prompt construction.

Related skills: cli-opencode, cli-claude-code, cli-codex, cli-cursor, and cli-devin for sibling CLI dispatch; sk-code for code standards; system-deep-loop for execution; and system-spec-kit for packet handback.

