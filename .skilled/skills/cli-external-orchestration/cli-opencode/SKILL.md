---
name: cli-opencode
description: "OpenCode CLI orchestrator: external dispatch, in-OpenCode parallel sessions, cross-AI handback with full runtime context."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.5.7.0
---

<!-- Keywords: opencode, opencode-cli, opencode-run, cross-ai, spec-kit-runtime, plugin-runtime, parallel-sessions, share-url, detached-session, agent-delegation, openai, minimax, minimax-coding-plan, minimax-m3, token-plan, llmgateway, glm-5.2, zai-coding-plan, z.ai-coding-plan, glm-coding-plan, deepseek-v4-flash-latest, deepseek-v4.1-flash, gpt-6-luna -->

# OpenCode CLI Orchestrator - Full-Runtime Cross-AI Dispatch

> **CRITICAL: SELF-INVOCATION PROHIBITED**
>
> If you run this skill inside OpenCode (TUI / acp / serve / run modes; detection signals in §8), you MUST refuse to load it and return the documented error message instead of dispatching.
> This skill dispatches to the OpenCode CLI binary (`opencode`; an `opencode2` installed by the v2 package is also accepted).
> Only an explicit "parallel detached" request is exempt. It must intentionally spawn a SEPARATE session with its own session id and state directory.
>
> A running CLI skill never dispatches itself. The cli-X skills are for **cross-AI delegation only**, never self-invocation.

Orchestrate OpenCode 2's `opencode run` (OpenCode 1's `opencode run` as the fallback) from external AI assistants (Claude Code, OpenCode, raw shell) AND from inside an existing OpenCode session for parallel detached workers. Three documented use cases keep the cycle risk explicit and give every dispatch path a copy-paste invocation shape.

**Core Principle**: The calling AI stays the conductor. Delegate to OpenCode for what it does best: the full plugin, skill, and MCP runtime in a one-shot dispatch. Validate and integrate the output.

---

## 1. WHEN TO USE

### Activation Triggers

- **Full plugin / skill / MCP runtime** (use case 1): calling AI is Claude Code / OpenCode / Copilot / raw shell AND the task needs the project's spec folders and continuity docs, or every plugin/skill/MCP tool in a one-shot dispatch. Includes `@deep-research` / `@deep-review` agent loops with externalized state under `.opencode/specs/`.
- **Parallel detached session** (use case 2): operator already inside OpenCode (TUI / web / serve / acp) AND wants a SEPARATE session with its own session id and state directory for ablation, worker farm, or parallel research. Prompt explicitly mentions "parallel detached", "ablation suite", "worker farm", "parallel research", "spawn detached", or "share URL".
- **Agent dispatch**: Use this when a task matches a specialized OpenCode agent.
  - Primary agents (directly invokable via `--agent`): `general`, `plan` (built-in), `orchestrate`.
  - The orchestrate primary fully dispatches generic subagents: `context`, `review`, `write`, `debug`, `ai-council`.
  - Their parent `/deep:*` command owns the loop executors end-to-end: `deep-research`, `deep-review`, `prompt-improver`.
  - `orchestrate` may make exactly one bounded hand-off to a recognized loop request, but never manages the loop.
  - See §3 for the full contract.
- **Cross-repo dispatch**: On OpenCode 2, a session in repo A dispatches into repo B's plugin/skill/MCP runtime via `--server <url>` and a start-in-directory `cd`.
  - OpenCode 1 remains supported for now as a fallback for users who have not updated. Use `--dir <path>` or a remote OpenCode server via `--attach <url>` (see [`references/install-and-versions.md`](./references/install-and-versions.md)).

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

### Prerequisites

**Verified versions.** This skill was verified against OpenCode 2.1.4 and OpenCode 1.19.4 on 2026-10-24.
Flag and provider observations naming 2.0.32 or 1.19.3 were read on those releases, not re-read on 2.1.4 or 1.19.4.
OpenCode 2 is expected and recommended; OpenCode 1 remains supported for now as a fallback for users who have not updated.
The skill loads and runs on both, with a documented capability delta. Later versions are unsupported until re-verified.
The delta is in [`references/install-and-versions.md`](./references/install-and-versions.md).

The resolver takes the first `opencode2` on `PATH`, falling back to the first `opencode` only if no `opencode2` exists. `OPENCODE_BIN` overrides both.
The recommended side-by-side layout has no `opencode2`; there, the resolver's `opencode` is OpenCode 2. OpenCode 1 answers only to `opencode1`.
This skill's OpenCode 1 command lines name `opencode`, which is right on a v1-only machine. For side by side, run them as `opencode1` or set `OPENCODE_BIN=opencode1`.

```bash
# Binary pick and version check: references/install-and-versions.md §4-5.
OC=${OPENCODE_BIN:-}; if [ -z "$OC" ]; then OC=$(command -v opencode2 2>/dev/null); [ -z "$OC" ] && OC=$(command -v opencode 2>/dev/null); fi
"$OC" --version   # `opencode v2.1.4` = OpenCode 2 (expected), `1.19.4` = OpenCode 1 (fallback); either major passes

# Self-invocation guard
env | grep -q '^OPENCODE_' && echo "ERROR: Already inside OpenCode session"

# Authentication
opencode providers
```

**Authentication options**: `opencode providers login <provider>` (or `opencode auth login` for subscription plans). Full per-provider login shapes: `references/cli-reference.md` §4.

### Provider Auth Pre-Flight (Smart Fallback)

**MANDATORY before any first dispatch in a session.** The default provider may not be logged in, and a silent `401` mid-dispatch wastes a round-trip. Run the pre-flight once per session, cache the result, and re-run only on an auth failure.

The one-shot pre-flight bash, the decision trees and the error-recovery contract live in [`references/cli-reference.md`](./references/cli-reference.md) §4. Never substitute a model the user didn't approve. ASK when the default is unavailable.

### Default Invocation (Skill Default)

**Default model, variant and format**: Both OpenCode versions use `llmgateway/deepseek-v4.1-flash-1017` at the `max` variant with `--format json`.
OpenCode 2 (the expected version) starts in the repo root, adds `--standalone` and puts effort on the model id (`-m llmgateway/deepseek-v4.1-flash-1017#max`).
OpenCode 1 (the supported fallback) uses this canonical dispatch: `opencode run --model llmgateway/deepseek-v4.1-flash-1017 --variant max --format json --dir <repo-root> "<prompt>"`.
Full v2 argv and the per-version provider check: [`references/cli-reference.md`](./references/cli-reference.md) §4.

> **Fan-out fallback:** a deep-loop lineage that pins no model runs **DeepSeek V4.1 Flash**. The family is named here without a version or an effort tier on purpose, so this line does not go stale when the family ships a point release. The runner resolves the current id, and a drift test keeps the two in the same family.

> **The `--agent` flag (read this):** Do NOT pass `--agent` on a top-level `opencode run`.
> The default agent is correct for almost every dispatch; it applies when you omit `--agent`.
> To target a specific agent profile, describe the role in the prompt body (e.g. "Act as a code-review agent: …").
> Pass `--agent <name>` only after `opencode run --help` confirms acceptance.
> On OpenCode 2.0.32, `--agent <slug>` runs the session as that agent, including `general`. An unknown slug exits 1; an "As @review" body stays with the default agent.
> On OpenCode 1 (fallback), named agents like `general` are rejected at the top level.
> Full roster and top-level rules: [`references/agent-delegation.md`](./references/agent-delegation.md).

Honor explicit user model, port, and handback phrasing verbatim. Otherwise use the default invocation above.

### Core Invocation Pattern

Core flags on OpenCode 2:
- Effort goes in `-m provider/model#<level>`; `--dir` becomes a start-in-directory `cd`.
- `run` adds `--standalone` and `--server`. Log flags are global.
- `--share`, `--port` and `--pure` are absent on `run`.

OpenCode 1 fallback supports:
- `--model`, `--agent`, `--variant`, `--format json`, `--dir`, session/fork flags, `--port` for detached sessions, `--file`, `--thinking`, `--pure`, `--title`, `--command`, `--attach` (with `-p`/`-u`), `-i`, `--auto` and log flags (see [`references/install-and-versions.md`](./references/install-and-versions.md)).

> **Non-interactive invocation stdin**: always append `</dev/null` to any non-interactive `opencode run` invocation, on both versions, because the hang is observed on OpenCode 1 and unverified on OpenCode 2 (see `references/integration-patterns.md` §6).

> **Always pin the model with `-m <provider/model>`**: a run that inherits an out-of-quota default provider retries the `429` forever and prints nothing, which looks like a deadlock. It is the most common cause of a "hung" `opencode run`. Diagnose with `--print-logs --log-level DEBUG` and look for `stream error … Error 429`, then pin a provider/model with live quota.

> **Registered command dispatch (`--command`, OpenCode 1 only)**: slash-command text inside a `run` message is NOT expanded. OpenCode 2 has no `run` flag for a registered command. On OpenCode 1 (fallback), use `opencode run --command <family>/<name> [flags] "<args>"`. Full semantics: `references/cli-reference.md` §4.

### Model Selection

On OpenCode 2, run `opencode models --standalone` filtered for the `<provider>/` prefix (2.0.32's `models` takes no provider argument). On OpenCode 1 (fallback), run `opencode providers list` to confirm credentials and `opencode models <provider>` for live choices. Defaults live in §3 Default Invocation, and the roster is [references/providers-and-models.md](references/providers-and-models.md).

**Four providers are reachable** (`opencode-go`, `openai`, `llmgateway` (**DevPass**), `minimax`), with `llmgateway/deepseek-v4.1-flash-1017` the single default on both OpenCode 2 and OpenCode 1, and the full roster and per-provider caveats in [references/providers-and-models.md](references/providers-and-models.md).
One cross-provider footgun is worth carrying here: **id shape differs per provider**, and copying a form between providers returns a 400 (see [references/providers-and-models.md](references/providers-and-models.md) §2).

**Closed roster: only models catalogued in that reference may be dispatched. Any model outside it is FORBIDDEN for cli-opencode** (a hard discipline rule, since cli-opencode has no code-enforced allowlist).

### OpenCode Agent Delegation

The calling AI is the conductor. OpenCode distinguishes **primary agents** (invokable via `--agent <slug>`) from **subagents** (Task-dispatched from a primary).

#### Primary agents, directly invokable via `--agent`

OpenCode lists `plan` and the repo's `orchestrate` as primary agents, and `general` as a subagent, on 2.0.32 and 1.19.3.
**Never pass `--agent general`**; the default agent covers that case on both versions, and OpenCode 1 rejects it at the top level.
Pin `--agent plan|orchestrate` only when the task needs that profile and `opencode run --help` confirms top-level acceptance. Otherwise, state the role in the prompt body.

#### Subagents, dispatched as Task subagents from a primary

These subagents live at `.opencode/agents/<slug>.md` with `mode: subagent`. They are NOT directly invokable via `opencode run --agent`.
Route generic subagents (`context`, `review`, `write`, `debug`) through `--agent orchestrate`. Route `ai-council` through `/deep:ai-council` or `orchestrate`.
The parent `/deep:*` commands own the loop executors `deep-research`, `deep-review` and `prompt-improver`. Never dispatch them by raw `--agent <slug>`.
`orchestrate` may make one bounded hand-off but MUST NOT re-implement the loop.

See [agent-delegation.md](./references/agent-delegation.md) for the full roster and dispatch patterns.

### Essential Commands

On OpenCode 2, those flags are gone from `run`. Cross-repo dispatch starts in the target directory.
`--agent orchestrate` runs the session as `orchestrate`; how it then routes subagents is untested.
On OpenCode 1 (fallback), `--port <N>` serves explicit detached sessions and `--dir` serves cross-repo dispatch.
`--agent orchestrate` routes generic subagents (see [`references/install-and-versions.md`](./references/install-and-versions.md)).

### Error Handling

- Install missing binaries.
- Refuse ambiguous self-invocation.
- Run provider pre-flight for model/auth errors.
- Check version drift for unknown flags.
- Force `--format json` for empty streams.
- Add `</dev/null` for background loops.
- Never pass `--share`.
- Use `--pure` only for plugin crashes; it is absent from OpenCode 2 `run` and available on OpenCode 1 only (see [`references/install-and-versions.md`](./references/install-and-versions.md)).
- Inspect state logs for stuck sessions.

---

## 4. RULES

### ✅ ALWAYS

1. Verify OpenCode CLI is installed before first invocation. Confirm the version baseline for OpenCode 2 (2.1.4, the expected version) or OpenCode 1 (1.19.4, supported for now as a fallback), with drift handling per `references/cli-reference.md` §9.
2. **Run the self-invocation guard before dispatch** (ADR-001): Layer 1 env-var lookup for any `OPENCODE_*`, Layer 2 process-ancestry probe for `opencode` parent, Layer 3 `~/.opencode/state/<id>/lock` probe. Trip on ANY positive. Refuse unless the prompt has explicit parallel-session keywords.
3. Pin model, variant, format and dir explicitly.
   - OpenCode 2 default: `-m llmgateway/deepseek-v4.1-flash-1017#max --format json` with a start-in-directory `cd`.
   - OpenCode 1 fallback: `--model llmgateway/deepseek-v4.1-flash-1017 --variant max --format json --dir <repo-root>` (see [`references/cli-reference.md`](./references/cli-reference.md) §4).
   - **No `--agent`**: the Default Invocation note says top-level `--agent general` is rejected. Put agent-profile requests in the prompt body.
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
11. **Run the Provider Auth Pre-Flight once per session** (see §3 Provider Auth Pre-Flight). Cache the configured-providers list. If the default provider is missing (`llmgateway` on both versions), ASK the user. Never silently substitute the model. If a later dispatch returns an auth error, invalidate the cache and rerun the pre-flight before retrying.
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
    - For non-interactive `opencode run` with `--dangerously-skip-permissions` against a populated worktree, you MUST apply the four-layer mitigation, the only active protection:
      - (L1) The rendered prompt contains literal `BANNED OPERATIONS` and `ALLOWED WRITE PATHS`.
      - (L2) The working directory points to a fresh `git worktree` (OpenCode 2: start-in-directory `cd`; OpenCode 1: `--dir <path>`).
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
    - Pattern: `AI_SESSION_CHILD=1 opencode run ... </dev/null`. Harmless when the wrapper is not in use.
    - See `.skilled/bin/README.md` → "Worktree session isolation".
    - Prepend `SYSTEM_SPEC_GATE_ENFORCE=0` next to it so the child never inherits an enforced spec-gate from the parent shell: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 opencode run ... </dev/null`.

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
2. Pass `--share`. OpenCode 2 `run` has no such flag, and on OpenCode 1.19.3 (fallback) it is a hidden, deprecated flag that only prints "Session sharing has been discontinued" (see [`references/install-and-versions.md`](./references/install-and-versions.md)).
3. Trust dispatched session output blindly for security-sensitive code, send sensitive data (API keys, passwords, credentials) in prompts, or hammer the API with rapid sequential calls.
4. Use `--pure` outside of plugin debugging (absent from OpenCode 2 `run`, OpenCode 1 only, see [`references/install-and-versions.md`](./references/install-and-versions.md)). Disabling plugins removes the entire point of cli-opencode dispatch.
5. Nest `opencode run` inside a dispatched session's tool calls. Use OpenCode's native Task tool for sub-agent dispatch.

### ⚠️ ESCALATE IF

1. OpenCode CLI is not installed and user has not acknowledged (provide `brew install opencode` or `curl -fsSL https://opencode.ai/install | bash`).
2. Operator asks for a share URL. OpenCode 2 `run` has no share flag, and OpenCode 1.19.3 discontinued session sharing, so say there is no URL to publish.
3. Binary version differs from the OpenCode 2 (2.1.4, expected) or OpenCode 1 (1.19.4, fallback) baseline. Run `opencode --version` (`opencode1 --version` for the side-by-side OpenCode 1) and `run --help`, then surface drift and fall back or require approval.
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

## 5. REFERENCES AND RELATED RESOURCES

### Core References

- [cli-reference.md](./references/cli-reference.md) - Full subcommand/flag reference, provider auth pre-flight, models, version drift
- [integration-patterns.md](./references/integration-patterns.md) - 3 use cases, decision tree, silent stdin
- [self-invocation-guard.md](./references/self-invocation-guard.md) - ADR-001 layered bash + python detection contract
- [opencode-tools.md](./references/opencode-tools.md) - Unique value props vs sibling cli-* skills
- [agent-delegation.md](./references/agent-delegation.md) - Agent routing matrix, leaf-agent constraints
- [destructive-scope-violations.md](./references/destructive-scope-violations.md) - RM-8 incident, root cause, four-layer prevention playbook

### Templates and Assets

- [prompt-templates.md](./assets/prompt-templates.md) - Copy-paste templates per use case + agent + handback
- [prompt-quality-card.md](./assets/prompt-quality-card.md) - Executor-specific model overrides, delegating the framework/CLEAR check to the canonical card

### Shared (cli-* family)
- [shared-smart-router.md](../../system-spec-kit/references/cli/shared-smart-router.md) - Helper-function bodies for the smart router.
- [memory-handback.md](../../system-spec-kit/references/cli/memory-handback.md) - Canonical 7-step Memory Handback procedure.

### External
- [OpenCode GitHub](https://github.com/sst/opencode) - Official repository
- [OpenCode Install](https://opencode.ai/install) - Standalone installer entry point
- [OpenCode Documentation](https://opencode.ai/docs) - Official docs

### Reference Loading Notes

- Smart Routing (Section 2) is the summary. [`ROUTER.md`](./ROUTER.md) is the single routing authority.
- The router discovers reference, asset, and script docs dynamically: resources from `references/`, templates from `assets/`, automation from `scripts/` when present.

### Related Skills

`cli-claude-code` and `cli-opencode` for sibling cross-AI dispatch, `system-spec-kit` for handback, `sk-code` plus the selected overlay for generated code, `system-deep-loop` for loop execution (its `research` and `review` modes), and `mcp-code-mode` for MCP-backed tools.

---

## 6. SUCCESS CRITERIA

### Task Completion

- OpenCode CLI invoked with the correct subcommand, flags, model, agent, variant, format, and dir.
- Self-invocation guard checked before dispatch and refused when appropriate.
- Use case (1 / 2 / 3) classified explicitly before invocation.
- JSON event stream captured, parsed incrementally, validated, integrated.
- No security vulnerabilities introduced from generated code.
- No dispatch passes `--share` (absent from OpenCode 2 `run`, discontinued on OpenCode 1 1.19.3).
- Background dispatches in `while read` loops include `</dev/null` redirect.
- Memory Handback extracted and saved through `generate-context.js` when applicable.

### Skill Quality

- All numbered sections present and correctly ordered.
- Smart routing covers all intent signals with UNKNOWN_FALLBACK.
- Reference files provide deep-dive content without duplication.
- Self-invocation guard detail in [`ROUTER.md`](./ROUTER.md) mirrors ADR-001.

---

## 7. INTEGRATION POINTS

### Framework Integration

This skill operates within the behavioral framework defined in [AGENTS.md](../../../../AGENTS.md).

Key integrations:
- **Gate 2**: Skill routing via the Skill Advisor Hook (or `skill_advisor.py` fallback)
- **Tool Routing**: Per AGENTS.md Section 5 decision tree
- **Continuity**: Context preserved by `/speckit:save`, which writes through `generate-context.js`
- **Validation**: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh` for spec-folder workflows

**Tool roles**: Bash dispatches the CLI. Read/Glob/Grep validate output and probe `~/.opencode/state/` for session locks.
