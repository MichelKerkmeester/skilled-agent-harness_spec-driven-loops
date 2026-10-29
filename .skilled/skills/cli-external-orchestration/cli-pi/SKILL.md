---
name: cli-pi
description: "Pi CLI executor for guarded headless coding, JSON/RPC integration, native skills/extensions, and community-package delegation."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.5.20.0
---

<!-- Keywords: pi cli, pi agent, pi.dev cli, pi coding agent, delegate to pi, cross-ai, headless dispatch, json event stream, rpc mode, native skills, extensions, pi packages -->

# Pi CLI Orchestrator - Cross-AI Task Delegation

> **A Pi session MAY dispatch this skill.** Pi has no in-process delegation of its own, so the CLI
> is the only way a Pi session can hand work out; being inside Pi is not a reason to refuse.
>
> What still refuses: the shared runtime rejects a dispatch from inside a fan-out lineage, and one
> whose kind already appears in the dispatch stack. Those bound a runaway spawn chain and are
> unchanged. The sibling cli-X packets keep their own guards; this carve-out is Pi's alone.

Orchestrate Pi's terminal coding agent for headless coding, read-only tool-constrained reviews, JSON event-stream integrations, RPC clients, and Pi-native resource discovery.
The pinned contract is the source for confirmed command behavior: [Pi contract pin](../../../specs/cli-external-orchestration/z_archive/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md).
Pi-native skills, prompt templates, and some package surfaces remain documented but unconfirmed unless a source says otherwise.

**Core principle**: use Pi for the surfaces it exposes, delegate research and review lineages to the shared runtime, validate the returned output, and keep the calling AI as conductor.

---

## 1. WHEN TO USE

### Activation Triggers

- **Headless Pi dispatch**: use when the task explicitly requests Pi, pi.dev, or the Pi coding agent.
- **Cross-AI validation**: use for an independent implementation attempt, code review, or second opinion through Pi.
- **JSON event output**: use when a caller needs Pi's line-delimited event stream.
- **RPC integration**: use when a long-lived stdin/stdout protocol is explicitly requested.
- **Pi-native resources**: use when the task concerns Pi skills, prompt templates, extensions, or installed packages.
- **Community package delegation**: use when the task explicitly names pi-mcp-extension.

### When NOT to Use

- Pi is not installed or cannot be found on PATH.
- The task is a small in-process change that the calling AI already understands.
- The task requires a feature that belongs to the shared deep-loop runtime rather than this packet.
- A community package is requested without approval to install or trust project-local files.

---

## 2. SMART ROUTING

The `cli-external-orchestration` hub routes a Pi dispatch here: the request names Pi, pi.dev or the Pi coding agent, or needs Pi's JSON event stream, an RPC client, an independent second opinion, or Pi-native skills, extensions and packages.
`hub-router.json` scores that request, the winning `workflowMode` is `cli-pi`, and the hub loads this `SKILL.md` first.
The hub root `ROUTER.md` names this packet's first leaves, so leaf selection stays in the hub router rather than in this file.
`command -v pi` decides whether the route exists at all, and the probe runs before every dispatch.
Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.

---

## 3. HOW IT WORKS

### Execution Ownership

This packet owns provider-specific routing, the availability probe, and prompt construction.
For research and review lineages, the shared deep-loop runtime owns process construction and execution. The runtime supports the `cli-pi` executor kind, and its fan-out command builder is implemented with print mode, a provider-qualified `--model`, and `--thinking` from `reasoningEffort`, so a lineage dispatches through the executor kind directly.
That runner accepts only the `research` and `review` loop types, so a single build or doc dispatch uses the child dispatch envelope in [providers-and-models.md](./references/providers-and-models.md) §5.
Do not add a packet-local wrapper, spawn path, or command builder.

**Four providers are reachable:** `openai` (the ChatGPT sign-in, named `openai-codex` before Pi 1.0), `opencode-go`, `llmgateway` (**DevPass**, the operator's LLM Gateway plan, metered per token with a 3x credit bonus) and `minimax`.
`llmgateway` is not a Pi builtin. It exists only because `.pi/models.json` declares it, and its setup, credentials and removal are in [.pi/custom-providers.md](../../../../.pi/custom-providers.md).

**Closed roster: non-roster models are FORBIDDEN.** Dispatch ONLY the models in [references/providers-and-models.md](./references/providers-and-models.md) §2. That file is the single place the ids, thinking ceilings and per-provider id shapes are recorded, and this file names the providers without restating their models.
The deep-loop fan-out hard-rejects any off-roster id (`isPiModelAllowed` over `PI_SUPPORTED_MODELS`). Even a direct `pi --model` invocation must not use an unlisted id.
To add a model, amend the roster first, in the spec packet and in `PI_SUPPORTED_MODELS`.

The pinned contract confirms that headless Pi uses print mode, that JSON mode emits JSONL events, and that RPC mode is a persistent JSONL protocol. These are different contracts. Do not treat RPC as a one-shot print invocation. See [cli-reference.md](./references/cli-reference.md) and [integration-patterns.md](./references/integration-patterns.md).

### Dispatch Lifecycle

1. Verify the binary with command -v pi.
2. Classify the request as print, JSON, RPC, read-only tool-constrained review, native-resource inspection, or generation.
3. Compose the prompt using [prompt-quality-card.md](./assets/prompt-quality-card.md).
4. Pass a research or review lineage to the shared deep-loop runtime; run a single build or doc dispatch with the child dispatch envelope in [providers-and-models.md](./references/providers-and-models.md) §5.
5. Capture stdout and stderr separately when the runtime allows it.
6. Validate the output, changed files, and required tests before handback.

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
- [agent-delegation.md](./references/agent-delegation.md) covers Pi's built-in tool surface and the delegation boundary.

### Classifier Calls

Pi carries classifier models that answer a typed question over JSON state instead of chatting. The
classifier types are `choice`, `bool` and `score`, documented in the installed package's
`docs/models.md`. A Pi worker reaches them three ways:

- a codemode script calls `models.getModelOfType("classifier", provider, id)`, then
  `models.classify(model, { state, questions })`, and needs `"defaultTools": ["+codemode"]` in settings
- an extension calls `ctx.modelRegistry.classify()` and needs no codemode
- the SDK's `ModelRuntime` exposes `create()`, `getModelOfType`, `getAvailableOfType` and `classify`

Credentials stay in Pi's own store. Pi resolves them from its own configuration, so a classifier call
passes no key, and an answer is evidence for the caller's decision, never permission. When the service
reports token counts, `result.usage` carries them with their cost.

### Prompt Construction

The caller remains responsible for task scope, files, acceptance criteria, and verification. Use the prompt templates as scaffolds, not as a substitute for reading the target mode's skill contract. Pass an established spec folder to a non-interactive child when the parent workflow requires it.

### Dispatch-Critical Gotchas

The full flag glossary and pinned-contract citations are in the ALWAYS-loaded [cli-reference.md](./references/cli-reference.md). Gotchas that silently break a dispatch and must be honored at routing time:

- **Redirect stdin on every non-interactive dispatch: `</dev/null`.** Without it `pi -p` inherits the
  parent terminal's stdin and hangs indefinitely, emitting **nothing at all** — not a partial answer,
  not an error. Because print mode buffers until completion, an empty log is also what a working
  dispatch looks like mid-run, so the deadlock is indistinguishable from a slow model and has been
  mistaken for one for over an hour. The sibling `cli-opencode` packet carries the same rule for
  `opencode run`; it applies here for exactly the same reason.
- **`--offline` is required for any automated or CI dispatch.** `pi --verbose` without `--offline` hung for over two minutes with no reachable network path in the pinned contract's live probe. Any non-interactive dispatch through this packet must pass `--offline` explicitly rather than rely on a fast failure.
- **The exit code is never an availability or auth signal.** An identical unauthenticated `pi -p` dispatch returned exit `0` on the first run and exit `1` on every subsequent run in the pinned contract. Every guard in this packet checks output text (`No API key found...`), never exit code.
- **An invalid `.pi/extensions/*.ts` fails the whole session, not just that extension.** The pinned contract confirmed Pi validates extensions must export a factory function; a broken one blocks the entire dispatch with `Extension does not export a valid factory function` rather than skipping it with a warning.
- **The default provider is `google`, not Anthropic.** `pi --help` documents `--provider <name> (default: google)`. Do not assume an Anthropic-first default when you compose a dispatch that omits `--provider`.
  This repository's `.pi/settings.json` overrides that builtin: `defaultProvider` is `llmgateway` and `defaultModel` is `deepseek-v4.1-flash-1017`, so a run naming no model goes there rather than to `google`.
- **`pi install`/`pi list` require `--approve` to see or modify project-local package config.** Without it, both commands behave as if no packages exist, even when one is installed — the trust gate applies to reads, not only writes.
- **The operator's global Pi packages load in a dispatched child, and pi-blackhole compacts it mid-run.** pi-blackhole's config (`~/.pi/agent/pi-blackhole/pi-blackhole-config.json`) auto-compacts at `compactAfterTokens`, 272,000 here, with `midRunCompaction: "resume"`.
  The compaction replaces everything the child has read with a structural summary, so a child still reading when it fires starts reading again and can loop without ever editing.
  Set `PI_BLACKHOLE_PASSIVE=true` in the child's environment, which the package documents as switching off its background workers and its auto-compaction.
  The deep-loop fan-out's cli-pi environment filter passes this one variable through, so a value exported in the shell that runs the fan-out reaches every Pi child, and any variable outside the filter's list is still stripped.
  Pi's own compaction is off in `.pi/settings.json`, so the child keeps its model's full context window.

---

## 4. RULES

### ✅ ALWAYS

1. Run command -v pi before every dispatch.
2. Delegate research and review lineages to the shared deep-loop runtime. It rejects every other loop type, so a single build or doc dispatch uses the child dispatch envelope in [providers-and-models.md](./references/providers-and-models.md) §5.
3. Choose print, JSON, or RPC deliberately. RPC is persistent and is not a print-mode alias.
4. Capture and inspect output text for provider and extension failures.
5. Use the prompt-quality card's two-tier precedence rule.
6. Apply the least-permissive tool set that satisfies the task.
7. Validate Pi-generated changes with the repository's code and test gates.
8. Keep the current runtime as conductor and Pi as delegated executor.
9. Treat Pi-native discovery claims as confirmed only when backed by the pinned contract or a linked live documentation page.
10. Compose every dispatch as `{resolved agent persona + task prompt}`, never a bare task. Resolve the persona from the ACTIVE runtime's agent directory (AGENTS.md §9; never hardcode a runtime) and map each subtask to the right agent (code, review, design, deep-research, markdown).
   Core Pi has no native persona surface on `pi -p`, so INLINE the persona block into the payload, because the child cannot resolve agent paths by reference.
   A persona-less leaf runs as a generic assistant, dropping its tool-scope, verification gates, and output contract. Canonical contract: `../../sk-prompt/assets/cli-prompt-quality-card.md` "Persona Injection".
11. Set `AI_SESSION_CHILD=1` in the dispatched child's env AND state the exemption in the prompt. The variable makes the waiver true. It does not make it observable.
   The reader being waived is a model, and a model cannot see an environment variable, so a child given only the variable still stops to ask the documentation-scope question and writes nothing, at exit code zero.
   Copy the preamble from [`shared/references/child-dispatch-preamble.md`](../shared/references/child-dispatch-preamble.md) to the top of every non-interactive prompt.
12. Give a build dispatch one change per brief: name the file, the edit, and the check that proves it. A brief that asks the child to read a subsystem before it edits spends its context first.
   A DeepSeek V4.1 Flash build brief carrying five changes across five runtime files read about 995,000 characters in 25 minutes and wrote nothing. Chain the changes as separate dispatches and check each diff before sending the next.
13. Route a classifier question through Pi's own surfaces: `models.classify()` in a codemode script, `ctx.modelRegistry.classify()` in an extension, or the SDK's `ModelRuntime`, and leave the credential to Pi's own store.

### ⛔ NEVER

1. Never dispatch when command -v pi fails.
2. Never dispatch Pi from inside a fan-out lineage, or when cli-pi already appears in the dispatch stack; the shared runtime refuses both.
3. Never build a second Pi adapter inside this packet.
4. Never trust exit code alone as proof of model execution.
5. Never claim that skill or prompt-template flattening has been live-verified here.
6. Never install pi-mcp-extension without explicit package and trust review.
7. Never treat community packages as Pi first-party features.
8. Never use a bare single-token pi alias in routing metadata.
9. Never pass secrets or provider keys in prompts.
10. Never read a classifier answer as permission. It is evidence for the caller's decision, and the caller owns the consequence.

### ⚠️ ESCALATE IF

1. Pi is missing from PATH.
2. The task needs a successful provider dispatch but no credentials are available.
3. The task depends on a native discovery behavior still marked unconfirmed.
4. The task requests an install or project-local package change without trust approval.
5. The task requests RPC lifecycle behavior that the shared runtime does not yet support.

---

## 5. REFERENCES

### Core References

- [cli-reference.md](./references/cli-reference.md) - Confirmed CLI flags, modes, auth failure behavior, model selection, and command examples
- [providers-and-models.md](./references/providers-and-models.md) - Authenticated provider/model roster, the `--thinking` effort scale, and the GPT-6 and GPT-6.1 Terra ceiling cross-map
- [pi-tools.md](./references/pi-tools.md) - Pi capabilities with no sibling analog (RPC, native extensions/prompts, tool surface)
- [integration-patterns.md](./references/integration-patterns.md) - Conductor/executor patterns, cross-validation, and anti-patterns
- [agent-delegation.md](./references/agent-delegation.md) - Pi's built-in tool surface and the delegation boundary
- [native-skills-and-extensions.md](./references/native-skills-and-extensions.md) - Pi-native discovery surfaces with confidence labels
- [mcp-and-third-party-packages.md](./references/mcp-and-third-party-packages.md) - MCP and community package boundaries

### Templates and Assets

- [prompt-quality-card.md](./assets/prompt-quality-card.md) - Thin delegator to the canonical prompt-models card
- [prompt-templates.md](./assets/prompt-templates.md) - Print, JSON, RPC, review, and generation scaffolds

### External Sources

- [Pi contract pin](../../../specs/cli-external-orchestration/z_archive/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md) - Local live-verification evidence
- [Pi skills documentation](https://pi.dev/docs/latest/skills) - Documentation-only native skill surface
- [Pi RPC documentation](https://pi.dev/docs/latest/rpc) - Documentation-only RPC surface
- [Pi JSON documentation](https://pi.dev/docs/latest/json) - Documentation-only JSON event stream

---

## 6. SUCCESS CRITERIA

### Dispatch Completion

- Pi is present on PATH before launch.
- The selected mode matches the requested output contract.
- Output is captured and checked for auth, extension, and package errors.
- Any workspace changes pass the calling workflow's verification gates.
- Research and review lineages run through the shared deep-loop runtime.

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
