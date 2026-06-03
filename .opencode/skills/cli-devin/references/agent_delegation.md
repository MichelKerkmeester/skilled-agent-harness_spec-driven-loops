---
title: "Devin CLI — Agent Delegation Analog"
description: "How cli-devin routes work to specialized Devin behaviors. Devin does not expose --agent like OpenCode; the routing analog is (model, permission-mode, prompt-file). Rules, skills, and MCP servers are persisted on the user's profile and load automatically."
---

# Devin CLI — Agent Delegation Analog

How cli-devin routes dispatches to specialized Devin behaviors. Devin doesn't expose a `--agent <slug>` flag like OpenCode or a `-p <profile>` flag like Codex. The routing analog has three surfaces: **model**, **permission mode**, and **prompt-file**, supported by **rules** + **skills** + **MCP servers** persisted on the profile.

---

## 1. OVERVIEW

OpenCode agents live in `.opencode/agents/<slug>.md` and are routed via `--agent <slug>`. Codex profiles live in `.codex/config.toml` and are routed via `-p <profile>`. Devin works differently — there is no per-dispatch agent-routing flag. Instead:

| Devin Surface | What It Pins | Routed Via |
|---------------|--------------|------------|
| **Model** | Reasoning style, coding-specialization, breadth | `--model <id>` (per dispatch) or `/model <name>` (mid-session) |
| **Permission mode** | Risk tier — what Devin can do without confirmation | `--permission-mode <auto\|dangerous>` (per dispatch) or `/mode` inside the TUI (check `/help` in your installed binary for the live mid-session mode-switch surface) |
| **Prompt file** | The actual task description, with embedded constraints, acceptance criteria, spec-folder pre-approval | `--prompt-file <path>` |
| **Rules** | Persistent behavioral rules loaded automatically per profile | `devin rules list` to inspect (managed on Devin's side) |
| **Skills** | Reusable skill routines loaded by the Devin agent loop | `devin skills list` / `devin skills show <name>` |
| **MCP servers** | External tool integrations available to the dispatched session | `devin mcp add <name>` + `devin mcp login <name>` |

The calling AI's "routing decision" is a triple `(model, permission-mode, prompt-file)`, plus optional reference to a Devin skill name in the prompt body.

### Orchestration principle
The calling AI decides WHAT to delegate by composing the prompt + selecting model and permission mode. Devin's own internal agent loop (shaped by the user's profile's rules + skills + MCP servers) shapes HOW the dispatched session processes the task. The calling AI always validates and integrates the output.

This is similar to cli-opencode's agent delegation but with the inner shaping moved from a `--agent <slug>` lookup into the dispatched runtime itself.

---

## 2. ORCHESTRATION MODEL

```text
Calling AI (CONDUCTOR)
  |
  |-- Analyzes task, selects (model, permission-mode)
  |-- Composes prompt file with: context + task + constraints
  |-- Validates self-invocation guard (refuse if calling AI is devin)
  |-- Validates auth pre-flight (devin auth status)
  |-- Delegates via Bash tool
  |
  v
devin --prompt-file <path> --model <id> --permission-mode <mode>  (EXECUTOR ENTRY)
  |
  |-- Loads profile's rules + skills + MCP servers automatically
  |-- Routes prompt through Devin's internal agent loop
  |-- May invoke rules / skills / MCP tools as part of the autonomous loop
  |
  v
Devin Session (AGENT EXECUTION)
  |
  |-- Autonomously plans, edits, runs tests, iterates within permission-mode bounds
  |-- Streams output to stdout (and stderr)
  |
  v
Calling AI (CONDUCTOR — RESULT HANDBACK)
  |
  |-- Parses Devin's stdout/stderr
  |-- Validates output quality
  |-- Integrates findings into the parent workflow
  |-- Decides next step (next dispatch, completion, escalation)
```

### Invocation Pattern

```bash
devin \
  --prompt-file /tmp/devin-prompt.md \
  --model swe-1.6 \
  --permission-mode auto \
  2>&1 </dev/null
```

The `--model swe-1.6` flag is the cli-devin default — Cognition's coding-specialized model, the natural pick for Devin-native work. The `--permission-mode auto` flag is the safe default that pauses for confirmation on destructive ops.

### Conductor Rules

1. The calling AI always **decomposes** complex tasks before delegating to a single Devin dispatch.
2. The calling AI always **validates** Devin output before integrating.
3. The calling AI never **blindly forwards** operator requests to Devin without selecting (model, permission-mode) and composing a tight prompt.
4. The calling AI honors the self-invocation guard: refuses if the calling AI is itself a local `devin` session (cloud handoff is the documented exception).
5. The calling AI never **silently escalates** permission mode beyond `auto` — `dangerous` requires explicit operator approval recorded in the dispatch log.
6. Each `devin` invocation is **stateless by default** for one-shot dispatches; use `--continue` / `--resume <id>` for explicit continuation.
7. The calling AI surfaces operator-relevant output (auth issues, permission-mode escalations, cloud-handoff requests) rather than swallowing them.

### Orchestration Boundaries

- Devin operates within its `--permission-mode` boundary. The calling AI MUST NOT presume Devin will perform destructive ops in `auto` mode.
- Rules and skills are profile-scoped — the calling AI MUST NOT assume specific rules/skills are loaded; reference them in the prompt body if they're essential.
- MCP servers must be pre-configured on the profile. The calling AI does NOT register MCP servers ad-hoc per dispatch.

---

## 3. ROUTING MATRIX

How the calling AI selects (model, permission-mode) per task type. Positioning: SWE-1.6 is the default for context gathering, tool use, and simple-to-medium well-defined tasks. DeepSeek v4 is the primary pick for complex tasks. GLM 5.1 and Kimi k2.6 are documented complex-task fallbacks (operator selects fallback based on agentic vs large-context shape).

| Task Type | Model | Permission Mode | Notes |
|-----------|-------|-----------------|-------|
| Context gathering (read codebase, list files, summarize) | `swe-1.6` | `auto` | Default cli-devin shape; SWE-1.6 is fast for clearly-scoped reads |
| Tool use (run a single tool / MCP call / shell command) | `swe-1.6` | `auto` | SWE-1.6 fits well-defined tool invocations |
| Simple-to-medium well-defined code task | `swe-1.6` | `auto` (escalate to `dangerous` only with operator approval) | Clear acceptance criteria, bounded scope — SWE-1.6 territory |
| Test generation for a known module | `swe-1.6` | `auto` | Bounded scope; SWE-1.6 default |
| Complex task — ambiguous, multi-step, reasoning-bound | `deepseek-v4` | `auto` | DeepSeek v4 is the documented primary for complex work |
| Architectural review of a large area | `deepseek-v4` | `auto` (read-only intent — pair with `/plan` mode if interactive) | Complex / reasoning-bound; pair with `sk-code-review` baseline |
| Root-cause debug of a non-obvious failure | `deepseek-v4` | `auto` | Complex / reasoning-bound |
| Security audit of a subsystem | `deepseek-v4` | `auto` (read-only intent) | Complex / reasoning-bound; pair with `sk-code-review` |
| Complex task that didn't fit DeepSeek v4 (agentic / MCP-heavy) | `glm-5.1` | `auto` | Documented fallback for agentic / tool-use shape |
| Complex task that didn't fit DeepSeek v4 (large context) | `kimi-k2.6` | `auto` | Documented fallback for large-context shape (long files, sprawling diffs) |
| Unattended long-running work (operator stepping away) | `swe-1.6` or `deepseek-v4` | `dangerous` (operator-approved) | Pick by complexity; cloud handoff is the alternative |
| Full-auto destructive work (rare) | (any) | `dangerous` (operator-approved, logged) | Only with explicit approval; consider git worktree isolation per memory `reference_cli_opencode_destructive_scope_doc.md` |

### Devin-Side Surfaces

The calling AI MAY reference Devin's profile-scoped surfaces in the prompt body:

```
Use the `repo-aware-refactor` skill (installed on this profile) for the refactor steps.
```

```
Honor the `no-rm-without-confirm` rule (installed on this profile).
```

```
Use the `linear` MCP server (configured on this profile) to file follow-up tickets.
```

The calling AI does NOT install or modify these surfaces — that's an operator-side concern via `devin skills`, `devin rules`, `devin mcp`.

---

## 4. THE `As @<surface>` PROMPT-TIME PATTERN

cli-opencode uses `As @<agent>:` in the prompt body as a soft override when `--agent` isn't passed. Devin doesn't have a direct equivalent because routing happens through (model, permission-mode) + the dispatched runtime's loaded surfaces. Equivalents:

- `Use the <name> skill from this profile` — directs Devin to apply a specific skill
- `Honor the <name> rule from this profile` — directs Devin to honor a specific rule
- `Route through the <name> MCP server` — directs Devin to use an MCP server

These are hints to Devin's internal router; the calling AI cannot enforce them at the dispatch boundary.

---

## 5. LEAF-AGENT CONSTRAINTS

Devin's internal agent loop is autonomous — it may invoke its own tools, edit files, run tests, and iterate within the permission-mode boundary. There is no "leaf agent" enforcement at the cli-devin layer; the boundary is the permission mode itself.

`/plan` slash command (interactive) is the closest analog to a LEAF mode — Devin reasons without editing. For non-interactive dispatches, the calling AI can compose a prompt that explicitly asks Devin to "do not modify files; produce a plan only" and pair with `--permission-mode auto` so any accidental destructive op pauses for confirmation.

---

## 6. WORKED EXAMPLES

### Example 1: Refactor via Devin's autonomous loop

```bash
cat > /tmp/devin-refactor.md <<'EOF'
<task>
Refactor `src/payments/charge.ts` to extract the retry-with-backoff logic into a reusable utility at `src/lib/retry.ts`. Update all call sites. Run `npm test -- --filter payments` after each significant change. Stop if tests fail.
</task>

<constraints>
- Permission mode: normal.
- Use the `typescript-react` surface conventions (sk-code detects this stack).
- Do not modify files outside src/payments/ and src/lib/.
</constraints>
EOF

devin --prompt-file /tmp/devin-refactor.md --model swe-1.6 --permission-mode auto 2>&1 </dev/null | tee /tmp/devin.log
```

### Example 2: Complex architectural review with DeepSeek v4 (primary)

```bash
cat > /tmp/devin-arch.md <<'EOF'
<task>
Review the architecture of `src/payments/*`. Identify: race conditions, error-handling gaps, missing observability, and any pattern violations vs. the typescript-react surface conventions. Cite file:line for each finding. Do not modify any files — produce a Markdown report only.
</task>

<constraints>
- Permission mode: normal. Read-only intent.
- Cite file:line for every finding.
- Output format: P0/P1/P2 finding blocks with rationale and suggested fix.
</constraints>
EOF

devin --prompt-file /tmp/devin-arch.md --model deepseek-v4 --permission-mode auto 2>&1 </dev/null
```

### Example 3: Complex agentic / MCP-heavy task with GLM 5.1 (fallback)

Use when DeepSeek v4 doesn't fit the complex task — the work is heavy on tool chaining, MCP server calls, or structured multi-step planning.

```bash
cat > /tmp/devin-agentic.md <<'EOF'
<task>
Use the `linear` MCP server (configured on this profile) to: enumerate open issues tagged "auth-rewrite", group them by affected file, and produce a Markdown plan that maps each issue to a concrete change. Do not modify code — produce the plan only.
</task>

<constraints>
- Permission mode: normal. Read-only intent + MCP tool calls allowed.
- Use the `linear` MCP server explicitly.
- Output: Markdown plan grouped by file, with issue ID and one-line change per row.
</constraints>
EOF

devin --prompt-file /tmp/devin-agentic.md --model glm-5.1 --permission-mode auto 2>&1 </dev/null
```

### Example 4: Complex large-context task with Kimi k2.6 (fallback)

Use when DeepSeek v4 doesn't fit the complex task — the work needs to fit a large amount of source in a single context window (long files, sprawling diffs, multi-repo grep).

```bash
cat > /tmp/devin-large-ctx.md <<'EOF'
<task>
Read every TypeScript file under `src/legacy/`, identify all functions that handle currency conversion (any combination of "rate", "fx", "currency", "exchange"), and produce a consolidated table of every entry point, its caller, and the assumptions it makes about precision. Cite file:line for each entry.
</task>

<constraints>
- Permission mode: normal. Read-only intent.
- Cite file:line for every entry.
- Output format: Markdown table.
</constraints>
EOF

devin --prompt-file /tmp/devin-large-ctx.md --model kimi-k2.6 --permission-mode auto 2>&1 </dev/null
```

---

## 7. FAILURE MODES AND OUTPUT HANDLING

### Capturing Output
Always capture stdout + stderr together: `2>&1`. Use `tee` for human-visible streaming + log file capture. Use `</dev/null` for background dispatches.

### Parsing Structured Output
Devin's default output is free-form text. The calling AI MUST either:
- Prompt Devin to emit a deterministic block (e.g. `BEGIN_JSON` / `END_JSON` markers) and parse from there.
- Treat output as free-form and apply best-effort heuristic parsing (less reliable).

The official `--json` flag is unverified as of 2026-05-15 — do not rely on it in automation without confirming against the installed CLI.

### Failure Modes
| Mode | Detection | Recovery |
|------|-----------|----------|
| Auth fails mid-dispatch | stderr contains "Not authenticated" | Re-run `devin auth status`, surface to operator, do not retry silently |
| Permission denied on destructive op | Devin pauses for confirmation in non-interactive mode | Re-dispatch with `dangerous` (operator-approved) or run interactively |
| Tests fail at intermediate step | Dispatch returns non-zero or output reports failure | Calling AI surfaces the failure; operator decides next step |
| Output truncated | Long output may be truncated by terminal pager — use `--prompt-file` + log capture | Calling AI should not assume completeness; check exit code |

### Recovery Patterns
- Always run `devin auth status` after an auth-related failure.
- Always check exit code; non-zero is informative.
- Cloud-handoff failures: see `cloud_handoff.md`.

---

## 8. RELATED RESOURCES

- [SKILL.md](../SKILL.md)
- [cli_reference.md](./cli_reference.md)
- [integration_patterns.md](./integration_patterns.md)
- [devin_tools.md](./devin_tools.md)
- [cloud_handoff.md](./cloud_handoff.md)
