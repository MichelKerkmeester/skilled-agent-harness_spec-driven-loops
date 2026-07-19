---
title: "OpenCode CLI - Integration Patterns and Use Cases"
description: "The three documented use cases for cli-opencode (external runtime to OpenCode, in-OpenCode parallel detached session, cross-AI orchestration handback) with copy-paste prompt templates, smart-router signals, and the self-invocation guard decision tree."
trigger_phrases:
  - "opencode integration patterns"
  - "opencode self-invocation guard"
  - "opencode parallel detached session"
  - "opencode cross-ai handback"
  - "opencode stdin dev null rule"
  - "opencode run hang non-interactive"
importance_tier: important
contextType: implementation
version: 1.3.0.14
---

# OpenCode CLI - Integration Patterns

How cli-opencode positions itself relative to the three sibling cli-* skills, the three documented use cases (per ADR-002), the smart-router decision tree that picks between them, and the self-invocation guard that protects against circular dispatch (per ADR-001).

---

## 1. OVERVIEW

The three sibling cli-* skills exist because their target binaries are external runtimes — Claude Code, OpenCode, Copilot do not own this repo. OpenCode owns this repo. A naive "delegate to opencode" skill makes no sense for an in-OpenCode operator (it would create a circular dispatch).

cli-opencode resolves this by documenting THREE orthogonal use cases. The smart router selects between them based on the calling AI's runtime context.

| Use case | Calling runtime | Target | Self-invocation? |
|----------|-----------------|--------|------------------|
| 1. External runtime to OpenCode | Claude Code, OpenCode, Copilot, raw shell | OpenCode for full plugin / skill / MCP runtime | No |
| 2. In-OpenCode parallel detached session | OpenCode itself (TUI / web / serve / acp) | New OpenCode session via `--share --port N` | No (different session id) |
| 3. Cross-AI orchestration handback | OpenCode / Copilot | OpenCode for spec-kit specific workflows | No |

The cycle ADR-001 protects against is the operator inside OpenCode asking cli-opencode to "delegate this exact prompt to OpenCode" — that case is REFUSED at the routing layer.

---

## 2. USE CASE 1 — EXTERNAL RUNTIME TO OPENCODE

### When to use

The calling AI is Claude Code, OpenCode, Copilot, or a raw shell. The task needs the project's full plugin / skill / MCP / Spec Kit Memory runtime — not just a raw model dispatch. Examples:

- Run `memory_search` against the project's spec-doc database
- Call Code Graph for semantic code search across the repo
- Dispatch a `@deep-research` or `@deep-review` agent loop with externalized state
- Run a sub-agent that needs Spec Kit Memory for continuity across iterations

### Smart-router signal

ADR-001's detection signal does NOT trip (no OPENCODE_* env var, no opencode parent process, no live state lock).

### Prompt template

```text
You are dispatching from <calling-runtime> into a fresh OpenCode session via cli-opencode.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Plugins / skills required: <list>
- MCP tools required: <list>

Constraints:
- <list>

Success criteria:
- <list>

Memory epilogue: include MEMORY_HANDBACK delimiters at the end of the response so the calling runtime can preserve context.
```

### Invocation shape

```bash
opencode run \
  --model deepseek/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt-from-template>" 2>&1
```

### Why it matters

This is the canonical cross-AI dispatch path. It gives external runtimes a one-shot bridge into the project's full runtime without forcing the operator to leave their host session.

---

## 3. USE CASE 2 — IN-OPENCODE PARALLEL DETACHED SESSION

### When to use

The operator is already inside an OpenCode session (TUI, web, serve, acp). They want a SEPARATE OpenCode session — not a continuation, not a fork — to run an ablation suite, a worker farm, or a parallel research sweep. The new session has its own session id, its own state directory, and an optional share URL.

### Smart-router signal

ADR-001's detection signal trips (in-OpenCode runtime). The router checks the prompt for explicit parallel-session keywords:

- "parallel detached session"
- "ablation suite"
- "worker farm"
- "parallel research"
- "spawn detached"
- "share URL"

If at least one of these phrases appears AND the prompt does NOT request "delegate this exact prompt", the router permits the dispatch with `--share --port <N>`.

### Prompt template

```text
You are spawning a parallel detached OpenCode session for <purpose>.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Iteration N of <total>
- State file: <path>

Constraints:
- This session must NOT modify the parent session's state.
- Write results to <state file path>.
- Publish a share URL only if the operator confirmed (CHK-033).

Success criteria:
- <list>
```

### Invocation shape

```bash
opencode run \
  --share \
  --port 4096 \
  --model deepseek/deepseek-v4-pro \
  --agent deep-research \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt-from-template>" 2>&1
```

### Why it matters

Parallel research, ablation studies, and worker farms need N concurrent sessions. Each must be independent. The detached pattern makes this possible without leaking state between sessions.

### Operator confirmation for share URLs

Per CHK-033, the calling AI MUST confirm with the operator before passing `--share`. The share URL exposes the session's contents to anyone with the URL, so it is opt-in.

---

## 4. USE CASE 3 — CROSS-AI ORCHESTRATION HANDBACK

### When to use

The calling AI is a non-Anthropic CLI (OpenCode, Copilot). The task requires OpenCode-specific plugins or skills (e.g. spec-kit workflows, the Spec Kit Memory MCP database, the structural code graph). The non-Anthropic CLI cannot load the project's plugins on its own — cli-opencode is the documented bridge.

### Smart-router signal

ADR-001's detection signal does NOT trip (the calling AI is OpenCode / Copilot, not OpenCode). The prompt mentions a project-specific subsystem:

- "spec kit" / "spec-kit" / "spec_kit"
- "spec kit memory"
- "code graph"
- "skill advisor"
- "session bootstrap"

When the calling AI is non-Anthropic AND a project-specific subsystem is named, this use case is selected over use case 1 (which is the more general path).

### Prompt template

```text
You are dispatching from <calling-runtime> into OpenCode for a spec-kit-specific workflow.

Goal: <one-sentence goal>

Context:
- Spec folder: <path> (pre-approved, skip Gate 3)
- Subsystem: <spec-kit / memory / code-graph / advisor>
- Operation: <save / search / query / scan / validate>

Constraints:
- The OpenCode session MUST load the system-spec-kit skill for this dispatch.
- All MCP calls go through the project's local MCP servers.

Success criteria:
- <list>

Memory epilogue: include MEMORY_HANDBACK delimiters at the end so the calling runtime can preserve context.
```

### Invocation shape

```bash
opencode run \
  --model deepseek/deepseek-v4-pro \
  --agent general \
  --variant high \
  --format json \
  --dir "$REPO_ROOT" \
  "<prompt-from-template>" 2>&1
```

The invocation shape is identical to use case 1 — the difference is the prompt content, which targets a project-specific subsystem.

### Why it matters

OpenCode and Copilot cannot load this project's plugin / skill / MCP runtime on their own. cli-opencode is the documented bridge that lets a OpenCode-led orchestration call into the project's spec-kit workflows without leaving the OpenCode session.

---

## 5. SMART-ROUTER DECISION TREE

The skill's smart router picks between the three use cases (or refuses) using this decision tree:

```text
INPUT: prompt + calling runtime
                |
                v
[ADR-001 SELF-INVOCATION GUARD]
- Layer 1: env var lookup (any OPENCODE_* env var present?)
- Layer 2: process ancestry (opencode in parent process tree?)
- Layer 3: best-effort lock-file probe (~/.opencode/state/<id>/lock present? -- heuristic, not guaranteed on every install)
                |
        +-------+-------+
        |               |
       NO              YES
        |               |
        v               v
[CALLING RUNTIME]   [PROMPT KEYWORDS]
        |               |
   +----+----+    +-----+-----+
   |         |    |           |
Anthropic  Other  parallel   self-dispatch
(Claude    (OpenCode words    only
Code)      Copilot)        |           |
   |         |             v           v
   v         v        USE CASE 2   REFUSE
USE CASE  [PROJECT     (in-       (cycle —
1         SUBSYSTEM    OpenCode   surface
(external NAMED?]      parallel)  ADR-001
to                      |          error)
OpenCode)        +------+------+
                 |             |
                YES            NO
                 |             |
                 v             v
             USE CASE 3     USE CASE 1
             (cross-AI      (external
             handback)      to OpenCode)
```

### Refusal message

When the router hits the REFUSE leaf, it surfaces this exact message:

```text
ERROR: cli-opencode self-invocation refused.

You are already inside OpenCode (signal: <env|ancestry|lockfile> tripped).
Asking cli-opencode to delegate this exact prompt back to OpenCode would create
a circular dispatch.

Options:
1. Use a sibling cli-* skill (cli-claude-code, cli-opencode)
   to dispatch a different model.
2. Open a fresh shell session (no OpenCode parent) and re-run from there.
3. If you wanted a parallel detached session (different session id, separate
   state directory), restate the request with explicit "parallel detached" /
   "ablation suite" / "worker farm" / "share URL" keywords — that triggers
   use case 2 instead of refusal.
```

---

## 6. STDIN HANDLING — `</dev/null` IS REQUIRED FOR ALL NON-INTERACTIVE DISPATCH

**`opencode run` reads stdin at startup before session creation (opencode v1.14.39).** Without an explicit closed stdin, ANY non-interactive automation that redirects stdout/stderr hangs forever at 0% CPU — even with a clean tool registry, valid model, and `--pure` set. This is the third independent root cause discovered during the 027-xce-research-based-refinement deep-research run on 2026-05-08; see `../CHANGELOG-2026-05-08-tool-name-regex-fix.md` §Fix 4 and memory `feedback_opencode_run_requires_dev_null_stdin.md`.

### Hang symptom (diagnostic)

If you see ALL of:
- Process at 0% CPU after >60s
- `~/.local/share/opencode/log/<timestamp>.log` last entry is `service=snapshot prune=7.days cleanup`
- 0 bytes stdout, 0 bytes stderr
- No TCP connections to provider
- 12-min timeout fires, exit code 124

…it's the stdin-startup-deadlock. Append `</dev/null`.

### Failure patterns (all hang)

```bash
# WRONG #1 — file redirect without </dev/null
opencode run --model X "<prompt>" > stdout.log 2> stderr.log

# WRONG #2 — combined redirect via tee
opencode run --model X "<prompt>" 2>&1 | tee combined.log

# WRONG #3 — background opencode in while-read loop without </dev/null
while IFS= read -r line; do
  opencode run --format json "<prompt>" > "$LOG" 2>&1 &
done < input.jsonl
# Both bugs apply: stdin-startup-read AND silent loop-stdin consumption.
```

### Fix patterns (all work)

```bash
# RIGHT #1 — file redirect with </dev/null
opencode run --model X "<prompt>" </dev/null > stdout.log 2> stderr.log

# RIGHT #2 — combined redirect with explicit closed stdin via < /dev/null
opencode run --model X "<prompt>" </dev/null 2>&1 | tee combined.log

# RIGHT #3 — background in while-read loop
while IFS= read -r line; do
  opencode run --format json "<prompt>" > "$LOG" 2>&1 </dev/null &
done < input.jsonl

# RIGHT #4 — foreground pipe to tail (works WITHOUT </dev/null because the empty pipe upstream provides EOF)
opencode run --model X "<prompt>" 2>&1 | tail -15
```

### Why foreground `| tail` accidentally works

When you run `opencode run "..." 2>&1 | tail`, the shell sets up a pipe BEFORE invoking opencode. opencode's stdin is NOT connected to your terminal — it's connected to the upstream pipe stage, which has no producer (the prompt is the positional argument, not piped via stdin). The shell closes that pipe immediately, opencode reads EOF, and startup proceeds. This is fragile — `2>&1 | tee combined.log` does NOT work because `tee` may keep the pipe open differently depending on shell + tee implementation. **Always use `</dev/null` explicitly** rather than relying on accidental pipe behavior.

### Position rule

`</dev/null` belongs:
- AFTER the prompt positional argument
- BEFORE the `> stdout 2> stderr` redirects (or anywhere on the command line — shell parses redirects independent of position, but right-after-prompt is conventional and easiest to spot during code review)

```bash
# canonical order
opencode run --flags "<prompt>" </dev/null > stdout 2> stderr
#                              ^^^^^^^^^^
#                              stdin from /dev/null (immediate EOF)
```

### Background dispatch from automation scripts (the deep-research / deep-review pattern)

```bash
timeout 720 opencode run \
  --model deepseek/deepseek-v4-pro \
  --variant high \
  --pure \
  --dangerously-skip-permissions \
  "$(cat prompt.md)" \
  </dev/null \
  > "$LOG_DIR/iter-N-stdout.log" \
  2> "$LOG_DIR/iter-N-stderr.log"
```

This is the pattern enforced by the 4 `if_cli_opencode` blocks in the deep-research and deep-review YAML workflow files. Any new automation that dispatches opencode MUST follow it.

### Upstream

The bug is in opencode v1.14.39. The fix would be: in the `run` subcommand entrypoint, check `process.stdin.isTTY` (or equivalent) and skip the stdin read in non-interactive mode — the message is already provided as a positional argument, so stdin is informational only. Until upstream patches this, `</dev/null` at every callsite is the workaround. File a bug report with opencode-ai/opencode if not already filed.

---

## 7. MEMORY HANDBACK

cli-opencode dispatches that produce evidence for a Spec Kit Memory save MUST include the Memory Epilogue at the end of the prompt. The dispatched session adds `MEMORY_HANDBACK_START` / `MEMORY_HANDBACK_END` delimiters around a structured JSON payload that the calling AI extracts and feeds to `generate-context.js`.

The full Memory Handback Protocol is shared with cli-claude-code and cli-opencode. See SKILL.md Section 4 (RULES) for the canonical 7-step procedure. The same JSON normalization (camelCase / snake_case aliases) and post-010 save gates apply.

---

## 8. RELATED RESOURCES

- `./cli-reference.md` - Full subcommand and flag reference
- `./opencode-tools.md` - Unique value props vs sibling cli-* skills
- `./agent-delegation.md` - Agent routing matrix
- `../assets/prompt-templates.md` - Copy-paste templates per use case
- `../SKILL.md` - Skill entry point and smart router pseudocode
