---
name: cli-hermes
description: "Hermes Agent CLI executor for quiet oneshot coding dispatch, LLM Gateway model routing and cross-AI validation."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.0.11.0
---

<!-- Keywords: hermes cli, hermes agent, nous hermes, delegate to hermes, hermes chat, hermes oneshot, hermes query-file, cross-ai, headless dispatch, llm gateway, project skills, hermes plugins -->

# Hermes Agent CLI Orchestrator - Cross-AI Task Delegation

> **CRITICAL — SELF-INVOCATION PROHIBITED**
>
> This skill dispatches to the Hermes Agent binary (`hermes`). If the agent currently reading this
> skill is itself running inside Hermes (detection signals in [`ROUTER.md`](./ROUTER.md) §3), the skill
> MUST refuse to load and return the documented error instead of generating any `hermes` invocation.
> Hermes has in-process delegation of its own (`delegate_task`), so a Hermes session hands work out
> through that, never by re-dispatching this CLI.

Orchestrate Hermes Agent (Nous Research's open-source, Python-based agent CLI) for quiet oneshot
coding dispatch, cross-AI validation, and model routing through the operator's LLM Gateway
provider. The evidence base is the phase 001 research synthesis and, once recorded, the live
contract pin:
[research synthesis](../../../specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/research.md),
[contract pin](../../../specs/cli-external-orchestration/071-cli-hermes-creation/002-hermes-contract-pin/implementation-summary.md).
Claims marked **source-read, unconfirmed** come from the installed Hermes source (v0.21.1) and
await the pin.

**Core principle**: use Hermes for what its surface offers, delegate research and review lineages to the shared
deep-loop runtime, validate the returned output, and keep the calling AI as conductor.

---

## 1. WHEN TO USE

### Activation Triggers

- **Headless Hermes dispatch**: the task explicitly names Hermes, Nous Research, or the Hermes agent.
- **Cross-AI validation**: an independent implementation attempt, review, or second opinion through a Hermes-hosted model.
- **LLM Gateway roster dispatch**: a task that wants `deepseek-v4.1-flash-1017`, `deepseek-v4.1-flash` or `glm-5.3-flash` through Hermes's tool loop rather than Pi's or OpenCode's.
- **Project skills and plugins**: a task that concerns Hermes's repo-local `.hermes/skills`, `.hermes/plugins`, or its skill and plugin commands.
- **Deep-loop fan-out**: a `/deep:research` or `/deep:review` lineage on `--executor=cli-hermes`.

### When NOT to Use

- **You ARE Hermes already.** Detection signals: `HERMES_AGENT=true` or `HERMES_SESSION_ID` in the environment, or `hermes` in process ancestry. Self-invocation loops the dispatch stack.
- Hermes is not installed or has no configured inference provider (`hermes config get providers.llmgateway.base_url` prints nothing; `hermes status` does not show custom provider blocks, so it is not the probe).
- The task needs an OS-level sandbox; Hermes has none (`--yolo` is an approval bypass, not confinement).
- A small in-process change the calling AI already understands.
- Interactive refinement in the TUI; use `hermes` directly.

---

## 2. SMART ROUTING

The `cli-external-orchestration` hub routes a Hermes dispatch here: the request names Hermes, Nous Research or the Hermes agent, and the hub's `cli-hermes` mode signal selects this packet.
A session already running inside Hermes is refused before any dispatch.

The hub [`ROUTER.md`](../ROUTER.md) names the two leaves a Hermes dispatch starts from.
Inside this packet the `ALWAYS` tier loads first: `references/cli-reference.md` and `assets/prompt-quality-card.md`.

A request that names no executor, or a model outside the closed roster, returns `UNKNOWN_FALLBACK` with a disambiguation checklist rather than a silent default.

Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.

---

## 3. HOW IT WORKS

### Execution Ownership

This packet owns provider-specific routing, the availability probe, and prompt construction.

For research and review lineages, the shared deep-loop runtime owns process construction and execution. `cli-hermes` is an `ExecutorKind`, and `buildHermesLineageCommand` in `fanout-run.cjs` emits the dispatch shape below.

That runner accepts only the `research` and `review` loop types. A single build or doc dispatch therefore runs the same shape directly, in the child environment that ALWAYS rule 11 sets.

Do not add a packet-local wrapper, spawn path, or command builder.

**One provider is reachable from the fan-out: `llmgateway`** (DevPass, the operator's LLM Gateway plan), declared as a Hermes custom provider block of that exact name in `~/.hermes/config.yaml` with `key_env: LLMGATEWAY_API_KEY`. That block is an operator step; the repo cannot carry it. Setup and the credential contract are in [providers-and-models.md](./references/providers-and-models.md).

**Closed roster, non-roster models are FORBIDDEN.** Dispatch ONLY the five the gateway serves for Hermes: `deepseek-v4.1-flash-1017`, `deepseek-v4.1-flash`, `glm-5.3-flash`, `minimax-m3` and `qwen3.8-max`.

- The `-1017` id is the rotation default.
- These are bare literals of Pi's roster, and every one was probed live.
- GPT-6 Luna and GPT-6 Sol are off this roster. GPT models run only on the GPT provider, through cli-codex or Pi's `openai` route.
- The deep-loop fan-out hard-rejects any other id (`isHermesModelAllowed` over `HERMES_SUPPORTED_MODELS`). Even a direct `hermes chat --model` invocation must not use an unlisted id.
- To add a model, amend the roster (spec packet plus `HERMES_SUPPORTED_MODELS`) first.

### The Dispatch Shape

~~~bash
hermes chat -Q --oneshot --query-file <prompt.md> --provider llmgateway --model deepseek-v4.1-flash-1017 \
  --reasoning max --ignore-rules --source tool --max-turns 200 --run-budget 840 \
  -t terminal,file,skills,todo,web --yolo --in <repo-root> </dev/null
~~~

- `chat -Q --oneshot` is the auditable headless form: response on stdout, `session_id: <id>` on stderr, hard exit codes (0 success, 1 `result.failed`, 130 interrupt). Never `hermes -z`: it drops the session id and auto-approves everything.
- `--query-file` reads the prompt verbatim; `-` reads stdin, which is how the fan-out builder passes it. Argv `-q` is for short prompts only.
- `--yolo` is required for writes; a read-only dispatch omits it and narrows `-t` to `file,todo`.
- `--run-budget` stays one margin under the caller's timeout because budget expiry has no distinct exit code; the in-agent wrap-up must win the race.
- `--in <repo-root>` pins the working directory on a manual dispatch; the fan-out omits it because the runner already spawns in the repo root.

### Dispatch Lifecycle

1. Verify the binary with `command -v hermes` and the provider with `hermes config get providers.llmgateway.base_url`.
2. Classify the request as write, read-only review, or generation; pick the toolset accordingly.
3. Compose the prompt using [prompt-quality-card.md](./assets/prompt-quality-card.md), persona inlined.
4. Pass a research or review lineage to the shared deep-loop runtime; run a single build or doc dispatch with the dispatch shape above.
5. Capture stdout (the response) and stderr (`session_id:`, `Error:`) separately.
6. Validate the output, changed files, and required tests before handback.

### Dispatch-Critical Gotchas

- **No provider configured means exit 1 with the reason on stdout, not stderr.** Observed live 2026-09-14 before the provider block existed: `No inference provider configured. Run 'hermes model' ...` printed to stdout, stderr empty, no `session_id:` line. Read the exit code, then stdout.
- **`--yolo` lifts only the dangerous-action gate.** Observed live 2026-09-14:
  - Without `--yolo`, a headless chat wrote an ordinary scratch file (exit 0).
  - `rm -rf <scratch dir>` came back `BLOCKED: Command flagged as dangerous ... single-query mode (-q) runs without a user present to approve it`.
  - With `--yolo`, the same command ran.
- Ordinary writes and commands need no flag. A read-only dispatch is read-only because of its `-t` list, not because `--yolo` is absent.
- **`--ignore-rules` is not optional.** Hermes injects `SOUL.md`, memories, session search, and the CWD `AGENTS.md`, `CLAUDE.md` and `.cursorrules` unless told not to.
- **`--worktree` writes inside the repo.** It runs `git worktree add`, which the fan-out containment guard reverts as an out-of-lineage write.
- **The stock toolset roster enables `delegation` and `memory`.** A leaf must pass an explicit `-t` list without them.
- **Hermes gates writes into any `.hermes/` directory.** Its file tools treat a write whose immediate parent is `.hermes` as a protected-instruction write needing approval (source-read: `tools/file_tools_write_guards.py`); author repo `.hermes/` files from outside Hermes.
- **`hermes pause` does not stop a CLI dispatch.** It scopes to cron, kanban and gateway turns. The runner's kill is the emergency stop.
- **Project skills load only after `hermes skills trust`.** The repo mirrors every skill as a generated markdown-only copy under `.hermes/skills/<name>/SKILL.md` (`sync-skills-hermes.cjs`), never as a symlink.
  - Hermes's static scanner walks a linked directory in full: ten minutes for the tree, every hub quarantined; one linked skill quarantined on its references and scripts, observed 2026-09-14.
- Preload with `-s <name>`. `hermes skills list` shows the loadable copies as `local` rows, and a copy the scanner quarantines is absent from both the listing and `-s`.
- See [hermes-tools.md](./references/hermes-tools.md).
- **`-Q` stdout can carry the model's reasoning before the answer** (observed with `deepseek-v4.1-flash` through the gateway). Read the tail for the answer; the fan-out validates artifacts, not stdout.
- **A research iteration is slow.** One live fan-out iteration with `deepseek-v4.1-flash` at `max` made thirteen gateway calls on a 65k to 90k token context and finished at 1042 seconds; the `--run-budget` wrap-up notice at 537 seconds was advisory and the runner's ceiling (twice `iterations × timeoutSeconds`) is what binds. Give a `cli-hermes` research lineage `timeoutSeconds` 900 or more.
- **`--run-budget` does not bound a stalled provider stream.** Hermes's stale-stream watchdog fires at 600 seconds and retries; the caller's own timeout is the real bound.
- **MCP servers are reached only when named in `-t`.** `-t file,todo` hides a configured server; `-t file,todo,code_mode` reaches it.

---

## 4. RULES

### ✅ ALWAYS

1. Run `command -v hermes` before every dispatch, and `hermes config get providers.llmgateway.base_url` for a configured provider.
2. Delegate research and review lineages to the shared deep-loop runtime. It rejects every other loop type, so a single build or doc dispatch runs the dispatch shape in §3 directly.
3. Use `chat -Q --oneshot` with `--query-file`; pass `--yolo` for writes and omit it for read-only work.
4. Pass `--ignore-rules`, `--source tool`, and an explicit `-t` list without `delegation` and `memory`.
5. Keep `--run-budget` under the caller's timeout and read the exit code, then stdout and stderr.
6. Use the prompt-quality card's two-tier precedence rule.
7. Validate Hermes-generated changes with the repository's code and test gates.
8. Keep the current runtime as conductor and Hermes as delegated executor.
9. Treat source-read claims as confirmed only when the contract pin records the live run.
10. Compose every dispatch as `{resolved agent persona + task prompt}`, never a bare task.
    - Resolve the persona from the CALLING runtime's agent directory (AGENTS.md §9), and INLINE it in the prompt.
    - No native persona surface exists: Hermes carries no agent directory of its own, and Hermes profiles are whole-home islands, so `delegate_task` children cannot read agent files.
    - Canonical contract: `../../sk-prompt/assets/cli-prompt-quality-card.md` "Persona Injection".
11. Set `AI_SESSION_CHILD=1` in the dispatched child's env AND state the exemption in the prompt, copying the preamble from [`shared/references/child-dispatch-preamble.md`](../shared/references/child-dispatch-preamble.md) to the top of every non-interactive prompt.

### ⛔ NEVER

1. Never dispatch when `command -v hermes` fails.
2. Never dispatch Hermes from inside Hermes, from inside a fan-out lineage, or when `cli-hermes` already appears in the dispatch stack.
3. Never build a second Hermes adapter inside this packet.
4. Never use `hermes -z` for an auditable dispatch, and never pass `--worktree`.
5. Never run `hermes import-agent`: it copies repo state into the user home and bypasses the trust and quarantine path.
6. Never claim a repo file configures Hermes hooks, MCP servers, or the provider; those are operator steps.
7. Never pass an off-roster model id or a provider-prefixed id.
8. Never pass secrets or provider keys in prompts.

### ⚠️ ESCALATE IF

1. Hermes is missing from PATH or `hermes config get providers.llmgateway.base_url` prints nothing.
2. The task needs a model outside the closed roster.
3. The task depends on a source-read behavior the contract pin has not yet confirmed.
4. The task requests `hermes skills trust`, `hermes mcp add`, or a config change; those are the operator's.
5. A Hermes plugin or hook would need `--accept-hooks`.

---

## 5. REFERENCES

### Core References

- [cli-reference.md](./references/cli-reference.md) - Flags, headless forms, exit codes, isolation flags, environment
- [providers-and-models.md](./references/providers-and-models.md) - The llmgateway provider contract, the five-id roster, reasoning levels
- [hermes-tools.md](./references/hermes-tools.md) - Toolsets, project skills and plugins, the write guard, subsystems that stay off
- [integration-patterns.md](./references/integration-patterns.md) - Conductor and executor patterns, cross-validation, anti-patterns
- [agent-delegation.md](./references/agent-delegation.md) - Persona inlining, persona skills, `delegate_task`, prompt templates for commands
- [hook-contract.md](./references/hook-contract.md) - Shell hooks versus the project plugin, the hook map for the repo's guard cores
- [mcp-policy.md](./references/mcp-policy.md) - Operator steps for MCP, deny-by-default per tool

### Templates and Assets

- [prompt-quality-card.md](./assets/prompt-quality-card.md) - Thin delegator to the canonical prompt-models card
- [prompt-templates.md](./assets/prompt-templates.md) - Write, read-only review, generation, and fan-out scaffolds

### External Sources

- [Research synthesis](../../../specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/research.md) - Two-lineage forced-depth research with verified citations
- [Hermes Agent repository](https://github.com/NousResearch/hermes-agent) - Upstream source and documentation

---

## 6. SUCCESS CRITERIA

### Dispatch Completion

- Hermes is present on PATH and a provider is configured before launch.
- The dispatch carries `--yolo` exactly when it writes, `--ignore-rules` always, and an explicit toolset list.
- Exit code, stdout and stderr are all read; `session_id:` is captured from stderr.
- Any workspace changes pass the calling workflow's verification gates.
- Research and review lineages run through the shared deep-loop runtime.

### Packet Quality

- References load progressively and stay packet-local.
- Source-read behavior is labeled until the contract pin confirms it.
- Operator steps (provider, trust, MCP, hooks) are documented as operator steps.
- No nested advisor identity is introduced under `cli-hermes`.

---

## 7. INTEGRATION POINTS

### Hub Integration

The hub owns advisor identity, mode registration, and router policy. This packet owns only the Hermes workflow contract and must not add `description.json` or `graph-metadata.json`.

### Deep-Loop Integration

The shared runtime is the sole process adapter. `cli-hermes` is not self-presence exempt: Hermes has in-process delegation, so the ancestry and lockfile guards apply as they do to every kind except Pi.

### Code and Spec Integration

`sk-code` owns surface detection and code verification. `system-spec-kit` owns Gate 3, spec folders and continuity. Include the parent spec folder in delegated prompts when the workflow has established one.

### Tool Roles

- Bash runs the availability probe, the provider probe, and the shared runtime entry point.
- Read, Glob, and Grep inspect prompts, references, and returned changes.
- This packet grants no new external tools.

---

## 8. REFERENCES AND RELATED RESOURCES

The router discovers markdown resources dynamically. Start with the CLI reference and prompt-quality card, then load only the references matching the task. Use [prompt-templates.md](./assets/prompt-templates.md) for repeatable prompt construction.

Related skills: cli-opencode, cli-claude-code, cli-codex, cli-cursor, cli-devin, and cli-pi for sibling CLI dispatch; sk-code for code standards; system-deep-loop for execution; system-spec-kit for packet handback.
