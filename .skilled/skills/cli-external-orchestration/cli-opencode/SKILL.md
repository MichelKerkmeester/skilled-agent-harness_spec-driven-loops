---
name: cli-opencode
description: "OpenCode CLI orchestrator: external dispatch, in-OpenCode parallel sessions, cross-AI handback with full runtime context."
allowed-tools: [Bash, Read, Glob, Grep]
version: 2.0.0.0
---

# OpenCode CLI Orchestrator - Full-Runtime Cross-AI Dispatch

> **CRITICAL: SELF-INVOCATION PROHIBITED**
>
> If you run this skill inside OpenCode (TUI / acp / serve / run modes; detection signals in §8), you MUST refuse to load it and return the documented error message instead of dispatching.
> This skill dispatches to the OpenCode CLI binary (`opencode`).
> Only an explicit "parallel detached" request is exempt. It must intentionally spawn a SEPARATE session with its own session id and state directory.
>
> A running CLI skill never dispatches itself. The cli-X skills are for **cross-AI delegation only**, never self-invocation.

Orchestrate OpenCode 2's `opencode run` from external AI assistants (Claude Code, OpenCode, raw shell) AND from inside an existing OpenCode session for parallel detached workers. Three documented use cases keep the cycle risk explicit and give every dispatch path a copy-paste invocation shape.

**Core Principle**: The calling AI stays the conductor. Delegate to OpenCode for what it does best: the full plugin, skill, and MCP runtime in a one-shot dispatch. Validate and integrate the output.

---

## 1. WHEN TO USE

### Activation Triggers

- **Full plugin / skill / MCP runtime** (use case 1): calling AI is Claude Code / OpenCode / Copilot / raw shell AND the task needs the project's spec folders and continuity docs, or every plugin/skill/MCP tool in a one-shot dispatch. Includes `@deep-research` / `@deep-review` agent loops with externalized state under `.opencode/specs/`.
- **Parallel detached session** (use case 2): operator already inside OpenCode (TUI / web / serve / acp) AND wants a SEPARATE session with its own session id and state directory for ablation, worker farm, or parallel research. Prompt explicitly mentions "parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", or "share URL".
- **Agent dispatch**: Use this when a task matches a specialized OpenCode agent.
  - Primary agents (directly invokable via `--agent`): `plan` (built-in), `orchestrate`. `general` is a subagent; omit `--agent` to run it.
  - The orchestrate primary fully dispatches generic subagents: `context`, `review`, `write`, `debug`, `ai-council`.
  - Their parent `/deep:*` command owns the loop executors end-to-end: `deep-research`, `deep-review`, `prompt-improver`.
  - `orchestrate` may make exactly one bounded hand-off to a recognized loop request, but never manages the loop.
  - See §3 for the full contract.
- **Cross-repo dispatch**: a session in repo A dispatches into repo B's plugin/skill/MCP runtime via `--server <url>` and a start-in-directory `cd`.

### When NOT to Use

- **You ARE OpenCode already.** If your runtime is OpenCode (detection signals in §8), this skill refuses to load.
- Self-invocation creates a circular dispatch loop and burns tokens for no value. The cli-X family is exclusively for cross-AI delegation.
- Only an explicit "parallel detached" request is exempt; it must intentionally spawn a SEPARATE session id and state directory (use case 2).
- Without that qualifier, the smart router refuses per ADR-001.
- Simple, quick tasks where `opencode run` overhead is not worth it.
- Tasks that only need a raw model dispatch. Use a sibling cli-* skill.
- Tasks requiring interactive TUI or web UI (use `opencode` directly instead of `opencode run`).
- Context already loaded and understood by the calling AI.
- Tasks where the OpenCode binary is not installed at the expected path.

---

## 2. SMART ROUTING

The `cli-external-orchestration` hub routes an OpenCode dispatch here: the request names OpenCode, `opencode run`, a parallel detached session or a full plugin runtime, and the hub's `cli-opencode` mode signal selects this packet.
A session already inside OpenCode is refused unless the request asks for a parallel detached session.

The hub [`ROUTER.md`](../ROUTER.md) names the two leaves an OpenCode dispatch starts from.
Three use cases route here: external dispatch, parallel detached session and cross-AI handback.
Inside this packet the `ALWAYS` tier loads first: `references/cli-reference.md` and `assets/prompt-quality-card.md`.

A request that maps to no use case returns `UNKNOWN_FALLBACK` with a disambiguation checklist rather than a silent default.
Read [`ROUTER.md`](./ROUTER.md) before selecting skill-local resources; open only the matched files.

---

## 3. HOW IT WORKS

### Execution Ownership

This packet owns user-facing routing, the OpenCode binary probe, prompt construction and the self-invocation guard.
For research and review lineages, the shared deep-loop runtime at `../../system-deep-loop/runtime/scripts/fanout-run.cjs` owns process construction and execution, using executor kind `cli-opencode`.
That runner accepts only the `research` and `review` loop types, so a single build or doc dispatch uses the child dispatch envelope in [providers-and-models.md](./references/providers-and-models.md) §5.
Do not add a packet-local wrapper, spawn path or command builder. Direct `opencode run` snippets below are operator reference and manual-testing examples.

### Prerequisites

**Pinned version.** The repository pins OpenCode 2 at 2.3.2, and the setup helper installs exactly that pin.
Flag and provider observations naming 2.0.32 were read on that release, not re-read on 2.3.2.
Two subcommands moved in 2.3.0: credentials are under `opencode auth`, and agents are listed by `opencode debug agents`.
A binary that reports major 1 is `unsupported`, and a deep-loop lineage refuses it; anything that is neither major 1 nor major 2 is `unknown`.
The install reference is [`references/install-and-versions.md`](./references/install-and-versions.md).

The resolver probes `opencode` on `PATH`. `OPENCODE_BIN` names a different binary when it is set.

```bash
# Binary pick and version check: references/install-and-versions.md §4-5.
OC=${OPENCODE_BIN:-opencode}
"$OC" --version   # `opencode v2.3.2` = OpenCode 2; a major-1 line is unsupported, and a deep-loop lineage refuses it

# Self-invocation guard. OPENCODE_API_KEY is a provider key an operator exports, not a session marker.
env | grep -v '^OPENCODE_API_KEY=' | grep -q '^OPENCODE_' && echo "ERROR: Already inside OpenCode session"

# Authentication.
opencode auth list
```

**Authentication options**: `opencode auth login <provider>`, because there is no `providers` subcommand. A subscription plan uses `opencode auth login` with no provider and an interactive pick. Full per-provider login shapes: `references/cli-reference.md` §4.

### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default provider may not be logged in, and a silent `401` mid-dispatch wastes a round-trip. Run the pre-flight once per session, cache the result, and re-run only on an auth failure.

The one-shot pre-flight bash, the decision trees and the error-recovery contract live in [`references/cli-reference.md`](./references/cli-reference.md) §4. Never substitute a model the user didn't approve. ASK when the default is unavailable.

### Default Invocation (Skill Default)

**Default model, effort and format**: the default is `llmgateway/deepseek-v4.1-flash-1017` at the `max` effort with `--format json`.
The dispatch starts in the repo root, adds `--standalone` and puts effort on the model id: `-m llmgateway/deepseek-v4.1-flash-1017#max`.
Full argv and the provider check: [`references/cli-reference.md`](./references/cli-reference.md) §4.

> **Fan-out fallback:** a deep-loop lineage that pins no model runs **DeepSeek V4.1 Flash**. The family is named here without a version or an effort tier on purpose, so this line does not go stale when the family ships a point release. The runner resolves the current id, and a drift test keeps the two in the same family.

> **The `--agent` flag (read this):** Do NOT pass `--agent` on a top-level `opencode run`.
> The default agent is correct for almost every dispatch; it applies when you omit `--agent`.
> To target a specific agent profile, describe the role in the prompt body (e.g. "Act as a code-review agent: …").
> Pass `--agent <name>` only after `opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null` confirms acceptance.
> On OpenCode 2.0.32, `--agent <slug>` runs the session as that agent, including `general`. An unknown slug exits 1; an "As @review" body stays with the default agent.
> Full roster and top-level rules: [`references/agent-delegation.md`](./references/agent-delegation.md).

Honor explicit user model and handback phrasing verbatim. Otherwise use the default invocation above.

### Core Invocation Pattern

Core flags on OpenCode 2:
- Effort goes in `-m provider/model#<level>`; the working directory is a start-in-directory `cd`.
- `--standalone`, `--server` and the log flags are global, and `run` accepts them on its command line.
- `run` also takes `--worktree` and `--archived`, neither of which this skill passes.
- `--share` and `--port` are absent on `run`.

> **Non-interactive invocation stdin**: always append `</dev/null` to any non-interactive `opencode run` invocation, because a run that leaves stdin open can hang at 0% CPU with no output (see `references/integration-patterns.md` §6). The recorded hang is from OpenCode 1 (v1.14.39), and no OpenCode 2 reproduction is recorded, so the redirect stays required.

> **Always pin the model with `-m <provider/model>`**: a run that inherits an out-of-quota default provider retries the `429` forever and prints nothing, which looks like a deadlock. It is the most common cause of a "hung" `opencode run`. Diagnose with `--print-logs --log-level debug` and look for `stream error … Error 429`, then pin a provider/model with live quota.

> **Registered command dispatch**: slash-command text inside a `run` message is NOT expanded, and `run` has no flag for a registered command. Send it through `session.command` (POST /api/session/{id}/command). Full semantics: `references/cli-reference.md` §4.

### Model Selection

Run `opencode models --standalone` filtered for the `<provider>/` prefix; `models` takes no provider argument. Defaults live in §3 Default Invocation, and the roster is [references/providers-and-models.md](references/providers-and-models.md).

**Five providers are reachable** (`opencode-go`, `openai`, `llmgateway` (**DevPass**), `minimax`, `mistral`), with `llmgateway/deepseek-v4.1-flash-1017` the single default, and the full roster and per-provider caveats in [references/providers-and-models.md](references/providers-and-models.md).
One cross-provider footgun is worth carrying here: **id shape differs per provider**, and copying a form between providers returns a 400 (see [references/providers-and-models.md](references/providers-and-models.md) §2).

**Closed roster: only models catalogued in that reference may be dispatched. Any model outside it is FORBIDDEN for cli-opencode** (a hard discipline rule, since cli-opencode has no code-enforced allowlist).

### OpenCode Agent Delegation

The calling AI is the conductor. OpenCode distinguishes **primary agents** (invokable via `--agent <slug>`) from **subagents** (Task-dispatched from a primary).

#### Primary agents, directly invokable via `--agent`

OpenCode lists `plan` and the repo's `orchestrate` as primary agents, and `general` as a subagent, on 2.0.32.
**Never pass `--agent general`**; the default agent covers that case.
Pin `--agent plan|orchestrate` only when the task needs that profile and `opencode run --help -m llmgateway/deepseek-v4.1-flash-1017 </dev/null` confirms top-level acceptance. Otherwise, state the role in the prompt body.

#### Subagents, dispatched as Task subagents from a primary

These subagents live at `.opencode/agents/<slug>.md` with `mode: subagent`. The binary accepts `--agent <subagent-slug>`, but the routing policy keeps subagents behind `--agent orchestrate` or their owning command.
Route generic subagents (`context`, `review`, `write`, `debug`) through `--agent orchestrate`. Route `ai-council` through `/speckit:ai-council` or `orchestrate`.
The parent `/deep:*` commands own the loop executors `deep-research`, `deep-review` and `prompt-improver`. Never dispatch them by raw `--agent <slug>`.
`orchestrate` may make one bounded hand-off but MUST NOT re-implement the loop.

See [agent-delegation.md](./references/agent-delegation.md) for the full roster and dispatch patterns.

### Essential Commands

Cross-repo dispatch starts in the target directory, and `--server <url>` points the run at a remote OpenCode server.
`--agent orchestrate` runs the session as `orchestrate`; how it then routes subagents is untested.

### Error Handling

- Install missing binaries.
- Refuse ambiguous self-invocation.
- Run provider pre-flight for model/auth errors.
- Check version drift for unknown flags.
- Force `--format json` for empty streams.
- Add `</dev/null` for background loops.
- Never pass `--share`.
- Inspect state logs for stuck sessions.

---

## 4. RULES

### ✅ ALWAYS

1. Verify OpenCode CLI is installed before first invocation. Confirm the version baseline for OpenCode 2 (2.3.2), with drift handling per `references/cli-reference.md` §9.
2. **Run the self-invocation guard before dispatch** (ADR-001): Layer 1 env-var lookup for any `OPENCODE_*` other than `OPENCODE_API_KEY`, Layer 2 process-ancestry probe for `opencode` parent, Layer 3 `~/.opencode/state/<id>/lock` probe. Trip on ANY positive. Refuse unless the prompt has explicit parallel-session keywords.
3. Pin model, effort, format and working directory explicitly.
   - Default: `-m llmgateway/deepseek-v4.1-flash-1017#max --format json` with a start-in-directory `cd`.
   - **No `--agent`**: the default agent covers the general case, so omit the flag. Put agent-profile requests in the prompt body.
   - Honor user overrides verbatim. Check the id against the roster in [references/providers-and-models.md](references/providers-and-models.md) rather than memory; each provider allows a specific set and a specific id shape.
4. Pass `--format json` unless the calling AI explicitly wants formatted output. The JSON event stream is what external runtimes parse incrementally.
5. **Append `</dev/null` to every non-interactive `opencode run` invocation** when it redirects stdout and/or stderr to files or runs inside `while read` loops.
   - Without a closed stdin, `opencode run` hangs at 0% CPU.
   - Place it after the prompt positional argument and before the `> stdout 2> stderr` redirects.
   - **DO NOT auto-kill external operator-owned opencode sessions** when sweeping orphans. Exclude `opencode run` from pkill.
   - Hang mechanics and failure patterns: [`references/integration-patterns.md`](./references/integration-patterns.md) §6.
6. **Pass the spec folder to the dispatched session** in the prompt: if the calling AI has an active Gate-3 spec folder, include `Spec folder: <path> (pre-approved, skip Gate 3)`. If none, ASK the user before delegating: the dispatched session cannot answer Gate 3 interactively in non-interactive `run` mode.
7. **Prompt construction & model-craft (cli-* family precedence).** Compose every dispatch prompt via the 2-tier rule canonical in `../../sk-prompt/assets/cli-prompt-quality-card.md`:
   1. **Fast path (default).** Build from the local `assets/prompt-quality-card.md`, which delegates the framework table + CLEAR check to the canonical card. Framework selection uses the canonical card's cross-model defaults, with no per-model prompt-craft profiles.
   2. **Deep path (escalation).** Dispatch `@prompt-improver` via the Task tool (never load full `sk-prompt` inline) when any canonical **Tier 2** trigger applies. The Tier 2 trigger list lives in `../../sk-prompt/assets/cli-prompt-quality-card.md`. Do not re-enumerate it here.
8. Validate dispatched session output: parse JSON events incrementally (tool calls, partial messages, final summary), run syntax checks if code generated, and cross-reference against project standards via `sk-code` surface detection plus its code-review mode for findings-first review (see ALWAYS rule 12).
9. Capture stderr (`2>&1`) to catch tool errors and warnings.
10. Classify the use case (1 / 2 / 3) before dispatching. The smart router refuses dispatches that do not map to one of the three.
11. **Run the Provider Auth Pre-Flight once per session** (see §3 Provider Auth Pre-Flight). Cache the configured-providers list. If the default provider is missing (`llmgateway`), ASK the user. Never silently substitute the model. If a later dispatch returns an auth error, invalidate the cache and rerun the pre-flight before retrying.
12. **Code Standards Loading (surface-aware contract):** For code review or generation, instruct the session to:
    - (1) Load `sk-code`.
    - (2) Let `sk-code` emit a surface tag matching the detected stack.
    - (3) Load selected surface resources and run its verification commands.
    - (4) Load `sk-code`'s code-review mode only for formal findings-first review output.
    - If the surface cannot be determined confidently, ask for the runtime surface and verification command set.
    - NEVER hardcode obsolete sibling code skills in dispatch prompts.
13. **Design Standards Loading (measured-reference contract):** For design or UI work, instruct the session to:
   - (1) Load `sk-design-md-generator`.
   - (2) Extract a measured Style Reference DESIGN.md (named color tokens, type scale, components, Quick-Start CSS/Tailwind) from the live source before building UI.
   - (3) Build against those measured tokens and run the extraction's validate step to confirm hex/section fidelity.
   - If no live source can be measured, ask for the reference URL or exact tokens.
   - NEVER treat `mcp-figma` or `sk-design-md-generator` as a taste or critique authority. The extraction measures real CSS; it does not judge design.
14. **Pass the design reference manifest to the dispatched session:** For design or UI work, inline a `DESIGN_DISPATCH_MANIFEST v1` block in the prompt.
    - The child cannot resolve skill paths; the manifest must travel in the payload, not by reference.
    - Include `styleReferenceExtracted` true, the measured live `source`, measured design tokens / type scale / components, `loadedFiles` and `proofDemandBack`.
    - If you lack a Style Reference or a live source, ask before launching; do not start a silent dispatch.
    - The child returns the demanded proof. The parent reconciles it on return.
15. **Destructive-scope-violation prevention (RM-8) for deep-loop dispatches.**
    - The permissions-matrix gate (`permissions-gate.ts`) has no production caller. A `--permissions-matrix <path>` config is not enforced and bypasses nothing (wiring status: `references/permissions-matrix.md`).
    - For non-interactive `opencode run` with `--auto` against a populated worktree, you MUST apply the four-layer mitigation, the only active protection:
      - (L1) The rendered prompt contains literal `BANNED OPERATIONS` and `ALLOWED WRITE PATHS`.
      - (L2) The working directory points to a fresh `git worktree`, reached with a start-in-directory `cd`.
        - OpenCode 2 takes the model's working directory from `PWD`, not from the process directory, and names the repository's first checkout as the workspace root. A dispatch from Node `spawn()` with `cwd` must also set `PWD` to that directory, and the prompt carries the `REPOSITORY ROOT` line from the child-dispatch preamble.
        - `scripts/probe-worktree-confinement.cjs` shows whether a dispatch shape stays inside: exit 1 means a tool path left the worktree.
      - (L3) Commit the target's own in-flight changes by explicit path. Leave other sessions' changes alone and record the recovery-baseline commit hash.
      - (L4) For multi-phase / phase-parent targets, prefer `cli-copilot` + `gpt-6-sol --reasoning-effort high` over the DeepSeek V4 Flash default, after confirming that model on the Copilot surface.
    - The 2026-05-04 incident deleted 44 files. See `references/destructive-scope-violations.md` for its root cause and checklist.
16. **Single-dispatch discipline (operator-gated, session-scoped).**
    - Launch ONE cli-* dispatch at a time. Wait for it to return and verify its outputs.
    - Then SIGKILL only the dispatch this skill started, using its captured PID and that PID's own children. Never use a blanket `pkill -9 -f "opencode run"` (see Rule 5).
    - Deep-flow sessions chain iterations back-to-back with kill-between. Explicitly authorized parallel dispatches are each killed by their own PID.
    - Full procedure: [`references/integration-patterns.md`](./references/integration-patterns.md) §8.
17. **Set `AI_SESSION_CHILD=1` in the dispatched session's env AND state the exemption in the prompt.**
    - A model cannot see an environment variable. Given only the variable, a session still asks the documentation-scope question and writes nothing at exit code zero.
    - Copy the preamble from [`shared/references/child-dispatch-preamble.md`](../shared/references/child-dispatch-preamble.md) to the top of every non-interactive prompt.
    - The variable also tells the per-session worktree wrapper (`.skilled/bin/worktree-session.sh`) that dispatched `opencode run` is an orchestrated sub-session sharing the parent's worktree rather than allocating its own.
    - The wrapper checks `AI_SESSION_CHILD` plus a `git --git-common-dir` backstop, then execs in place when set.
    - Pattern: `AI_SESSION_CHILD=1 opencode run -m llmgateway/deepseek-v4.1-flash-1017#max ... </dev/null`. Harmless when the wrapper is not in use.
    - See `.skilled/bin/README.md` → "Worktree session isolation".
    - Prepend `SYSTEM_SPEC_GATE_ENFORCE=0` next to it so the child never inherits an enforced spec-gate from the parent shell: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run -m llmgateway/deepseek-v4.1-flash-1017#max ... </dev/null`.

18. **Agent-persona injection (attach identity, not just the task).** Every dispatch composes `{resolved agent persona + task prompt}`, never a bare task.
    - Resolve the persona from the ACTIVE runtime's agent directory per AGENTS.md §9 (`.opencode/agents/<name>.md`, `.claude/agents/<name>.md`, etc.). Never hardcode one runtime.
    - Map each subtask to the RIGHT agent, not one default: `code`→code, `review`→review, `design`→design, research→`deep-research`, docs→`markdown`.
    - **OpenCode reaches personas via a primary:** route `--agent orchestrate` (or another primary) so the resolved persona runs as a Task subagent. Top-level `--agent` rejects `mode: subagent` personas (see [`references/agent-delegation.md`](./references/agent-delegation.md)).
    - On a bare `opencode run` that names no subagent, **INLINE** the persona block into the payload using the same in-payload pattern as the `DESIGN_DISPATCH_MANIFEST` (Rule 14); the child cannot resolve agent paths by reference.
    - A persona-less dispatch runs the leaf as a generic assistant, silently dropping its tool-scope, verification gates and output contract.
    - Canonical contract: `../../sk-prompt/assets/cli-prompt-quality-card.md` "Persona Injection". Native precedent: `orchestrate.md` "Agent Loading Protocol".
    - Declare rare exceptions at the dispatch site: native surface used, focused summary for a small-context model, or pure-mechanical command.

### ⛔ NEVER

1. Invoke this skill from within OpenCode itself for a self-dispatch. Refuse with the documented error message and use a sibling cli-* / fresh shell / parallel-session keywords.
2. Pass `--share`. `run` has no such flag, so there is no URL to publish.
3. Trust dispatched session output blindly for security-sensitive code, send sensitive data (API keys, passwords, credentials) in prompts, or hammer the API with rapid sequential calls.
4. Nest `opencode run` inside a dispatched session's tool calls. Use OpenCode's native Task tool for sub-agent dispatch.

### ⚠️ ESCALATE IF

1. OpenCode CLI is not installed and user has not acknowledged (provide `brew install opencode` or `curl -fsSL https://opencode.ai/v2/install | bash`).
2. Operator asks for a share URL. `run` has no share flag, so say there is no URL to publish.
3. Binary version differs from the OpenCode 2 (2.3.2) baseline. Run `opencode --version` and `run --help`, then surface drift and require approval.
4. Smart router cannot map the prompt to one of the three use cases. Surface the disambiguation checklist from UNKNOWN_FALLBACK.
5. Self-invocation guard trips AND the prompt is ambiguous. Surface the refusal with three remediation options (sibling cli-* / fresh shell / parallel-session keywords).

### Memory Handback Protocol

When you need to preserve session context from an OpenCode CLI delegation, run the canonical procedure: extract `MEMORY_HANDBACK`, scrub secrets, and invoke `generate-context.js` via `--stdin`/`--json`/temp-file.
The continuity writer is the last step; nothing is handed to an index.
Full procedure and caveats: [`system-spec-kit/references/cli/memory-handback.md`](../../system-spec-kit/references/cli/memory-handback.md).


OpenCode-specific Memory Epilogue template: see [assets/prompt-templates.md](./assets/prompt-templates.md) §14.

Example invocation:
```bash
printf '%s' "$JSON_PAYLOAD" | node .skilled/skills/system-spec-kit/runtime/cli/dist/continuity/generate-context.js --stdin [spec-folder]
```

---

## 5. SUCCESS CRITERIA

### Task Completion

- OpenCode CLI invoked with the correct subcommand, flags, model, effort, format and working directory.
- Self-invocation guard checked before dispatch and refused when appropriate.
- Use case (1 / 2 / 3) classified explicitly before invocation.
- JSON event stream captured, parsed incrementally, validated, integrated.
- No security vulnerabilities introduced from generated code.
- No dispatch passes `--share` (`run` has no such flag).
- Background dispatches in `while read` loops include `</dev/null` redirect.
- Memory Handback extracted and saved through `generate-context.js` when applicable.

### Skill Quality

- All numbered sections present and correctly ordered.
- Smart routing covers all intent signals with UNKNOWN_FALLBACK.
- Reference files provide deep-dive content without duplication.
- Self-invocation guard detail in [`ROUTER.md`](./ROUTER.md) mirrors ADR-001.

---

## 6. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via the Skill Advisor Hook (or `skill_advisor.py` fallback)
- **Tool Routing**: Per AGENTS.md Section 5 decision tree
- **Continuity**: Context preserved by `/speckit:save`, which writes through `generate-context.js`
- **Validation**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` for spec-folder workflows

**Tool roles**: Bash dispatches the CLI. Read/Glob/Grep validate output and probe `~/.opencode/state/` for session locks.

---

## 7. REFERENCES AND RELATED RESOURCES

### Core References

- [cli-reference.md](./references/cli-reference.md) - Full subcommand/flag reference, provider auth pre-flight, models, version drift
- [integration-patterns.md](./references/integration-patterns.md) - 3 use cases, decision tree, silent stdin
- [self-invocation-guard.md](./references/self-invocation-guard.md) - ADR-001 layered bash + python detection contract
- [opencode-tools.md](./references/opencode-tools.md) - Unique value props vs sibling cli-* skills
- [agent-delegation.md](./references/agent-delegation.md) - Agent routing matrix, leaf-agent constraints
- [destructive-scope-violations.md](./references/destructive-scope-violations.md) - RM-8 incident, root cause, four-layer prevention playbook
- [install-and-versions.md](./references/install-and-versions.md) - Install reference, version detection, upgrade, uninstall and removing an older install
- [providers-and-models.md](./references/providers-and-models.md) - The provider, model and variant-effort roster
- [permissions-matrix.md](./references/permissions-matrix.md) - Matrix schema, resolution semantics and RM-8 replay reasoning
- [context-budget.md](./references/context-budget.md) - Model context windows and the truncation marker for bounded prompts

### Templates and Assets

- [prompt-templates.md](./assets/prompt-templates.md) - Copy-paste templates per use case + agent + handback
- [prompt-quality-card.md](./assets/prompt-quality-card.md) - Executor-specific model overrides, delegating the framework/CLEAR check to the canonical card

### Shared (cli-* family)
- [shared-smart-router.md](../../system-spec-kit/references/cli/shared-smart-router.md) - Helper-function bodies for the smart router.
- [memory-handback.md](../../system-spec-kit/references/cli/memory-handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [OpenCode GitHub](https://github.com/sst/opencode) - Official repository
- [OpenCode 2 Install](https://opencode.ai/v2/install) - Standalone installer entry point
- [OpenCode Documentation](https://opencode.ai/docs) - Official docs

### Reference Loading Notes

- Smart Routing (Section 2) is the summary. [`ROUTER.md`](./ROUTER.md) is the single routing authority.
- The router discovers reference, asset, and script docs dynamically: resources from `references/`, templates from `assets/`, automation from `scripts/` when present.

### Related Skills

`cli-claude-code` and `cli-opencode` for sibling cross-AI dispatch, `system-spec-kit` for handback, `sk-code` plus the selected overlay for generated code, `system-deep-loop` for loop execution (its `research` and `review` modes), and `mcp-code-mode` for MCP-backed tools.
