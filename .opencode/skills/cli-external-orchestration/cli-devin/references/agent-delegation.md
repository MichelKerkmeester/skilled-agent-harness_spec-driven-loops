---
title: "Devin Subagent Delegation Reference"
description: "Reference for delegating tasks to Devin's subagent system via run_subagent, built-in profiles, and custom AGENT.md profiles."
trigger_phrases:
  - "devin subagent delegation"
  - "devin run_subagent"
  - "devin subagent_explore"
  - "devin subagent_general"
  - "devin custom agent"
  - "devin agent.md profile"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Devin Subagent Delegation Reference

Routing reference for delegating tasks to Devin CLI's subagent system.

---

## 1. OVERVIEW

### Core Principle

The calling AI decides WHAT to do, Devin CLI decides HOW to do it within the delegated scope. Devin's `run_subagent` tool spawns independent workers that share tools and codebase context with the parent but operate in their own conversation chain — they do not inherit the parent's conversation history.

### Purpose

Documents Devin's subagent system and how any AI assistant orchestrates it. The calling AI acts as the **conductor** (planner, validator, integrator) while Devin CLI executes targeted tasks through its subagent profiles.

### When to Use

- Delegating supplementary implementation or analysis tasks to Devin CLI subagents
- Parallel task processing through background subagents
- Read-only codebase exploration via `subagent_explore` (runs on cheap SWE-1.6)
- Code changes via `subagent_general` (runs on parent's model)
- Custom specialized workers defined in `.devin/agents/[name]/AGENT.md`
- Fresh-perspective debugging after the calling AI's attempts fail

---

## 2. ORCHESTRATION MODEL

```
Calling AI (CONDUCTOR)
  |
  |-- Analyzes task, selects subagent profile
  |-- Constructs devin CLI command with model + permission mode
  |-- Delegates via Bash tool
  |
  v
Devin CLI (EXECUTOR)
  |
  |-- Parent agent receives the prompt
  |-- Spawns subagent via run_subagent tool with selected profile
  |-- Subagent runs in foreground (parent pauses) or background (parallel)
  |-- Subagent returns result to parent, parent summarizes to caller
  |
  v
Calling AI (CONDUCTOR)
  |
  |-- Validates output quality
  |-- Integrates into workflow
  |-- Decides next step
```

### Invocation Pattern

Devin CLI tasks are routed through the parent agent, which spawns subagents using the `run_subagent` tool. The calling AI requests a specific profile in natural language; Devin's agent selects the appropriate profile and spawn mode.

```bash
# Request an explore subagent for read-only research
devin -p \
  "Research how the authentication module works using a subagent_explore subagent. Report the key files, data flow, and any potential issues." \
  --model adaptive --permission-mode auto

# Request a general subagent for code changes
devin -p \
  "Fix the failing tests in src/utils/ using a subagent_general subagent. Report what was changed and why." \
  --model adaptive --permission-mode accept-edits

# Request a custom subagent by name
devin -p \
  "Review the PR changes using the reviewer subagent. Report findings with severity ratings." \
  --model adaptive --permission-mode auto

# With file context
devin -p \
  "Explore the dependency graph for src/auth/ using a subagent_explore subagent. Map all imports and identify circular dependencies." \
  --model adaptive --permission-mode auto > /tmp/context-map.txt
```

### Conductor Rules

1. The calling AI always **decomposes** complex tasks before delegating.
2. The calling AI always **validates** Devin output before integrating.
3. The calling AI never **blindly forwards** user requests to Devin.
4. Subagents operate within their declared tool access and permission boundaries.
5. If a subagent returns low-quality output, the calling AI retries with refined instructions or uses a different approach.
6. Each `devin -p` invocation is **stateless** by default; include all necessary context in the prompt or use `-c` to continue a session.

---

## 3. SUBAGENT PROFILES

### Built-In Profiles

Devin ships with two built-in subagent profiles. The agent automatically chooses the appropriate profile based on the task.

| Profile | Description | Tool Access | Model | Foreground | Background |
|---------|-------------|-------------|-------|------------|------------|
| `subagent_explore` | Read-only codebase exploration and research | Read-only codebase tools plus web search; cannot edit files or fetch arbitrary URLs | Default subagent model (SWE-1.6 by default) | You approve/deny tool calls | Unapproved tools auto-denied |
| `subagent_general` | General-purpose tasks including code changes | Full tool access (foreground) or pre-approved tools only (background) | Same model as the parent agent | You approve/deny tool calls | Unapproved tools auto-denied |

### Model Selection for Subagents

Subagents do not all run on the model you picked. Each profile decides where its model comes from:

| Profile | Model used | Cost effect |
|---------|------------|-------------|
| `subagent_explore` | Default subagent model (SWE-1.6 by default) | Cheap: SWE-1.6 usage is billed at SWE rates, not at your primary model's rate |
| `subagent_general` | Same model as the parent agent | Same rate as the parent: a general subagent costs like a full extra session on your selected model |
| Custom subagents | The `model` field in `AGENT.md` if set, otherwise the default subagent model | Depends on the model you pin |

**Cost warning:** `subagent_general` inherits the parent's model. If you are running a premium model (e.g. Opus), every general subagent runs on that premium model too, with its own context window and inference calls. Ask for an explore subagent (or a custom subagent with a cheaper `model:` pinned) when the work is research rather than code changes.

### Influencing the Model

There is no way to name a model for a subagent in a prompt — the `run_subagent` tool takes a *profile*, not a model. You have two levers:

1. **Ask for a profile in natural language.** Requesting an explore subagent keeps the work on the cheap default subagent model. Asking for code changes gets you `subagent_general`, which runs on your selected model.
2. **Pin a model in a custom subagent profile.** `model:` in `AGENT.md` is the only way to run a *write-capable* subagent on a model other than the parent's.

---

## 4. FOREGROUND / BACKGROUND MODE

### Foreground Subagents

Foreground subagents run inline in the session. The parent agent pauses and waits for the subagent to finish before continuing. You can approve or deny tool calls as they come up.

- **When to use:** When the subagent's work must complete before the parent continues, or when tool approvals are needed.
- **Switching to background:** Press `Ctrl+B` while a foreground subagent is running. The subagent continues in the background, and the parent agent resumes.

### Background Subagents

Background subagents run in parallel while the parent agent continues working. The parent is automatically notified when the subagent completes. Unapproved tools are automatically denied.

- **When to use:** When independent tasks can run in parallel without blocking the parent.
- **Switching to foreground:** Open the subagent panel and press `f` on a running background subagent.
- **Key constraint:** Background subagents inherit any tool permissions already granted during the session. Any tool that has not been pre-approved is automatically denied. They cannot prompt you for new permissions.

### Resuming Failed Background Subagents

If a background subagent fails because a required tool was denied, resume it in the foreground to approve the necessary permissions. Resumed subagents always run in the foreground.

---

## 5. CUSTOM SUBAGENTS

Custom subagents are **experimental**. The format, behavior, and configuration options may change in future releases.

Beyond the built-in profiles, you can define custom subagent profiles with their own system prompts, tool restrictions, model overrides, and permissions — tailored to specific tasks.

### Creating a Custom Subagent

Custom subagents are defined as `AGENT.md` files inside a named directory under `agents/`. The directory name becomes the profile's identifier.

**Project-specific:**

```
.devin/agents/
└── reviewer/
    └── AGENT.md
```

Also supported:

```
.agents/agents/
└── reviewer/
    └── AGENT.md
```

**Global:**

```
# Linux/macOS
~/.config/devin/agents/
└── reviewer/
    └── AGENT.md
```

### AGENT.md Format

An `AGENT.md` file uses the same YAML frontmatter as skills, followed by the subagent's system prompt:

```markdown
---
name: reviewer
description: Reviews code changes for correctness and style
model: sonnet
allowed-tools:
  - read
  - grep
  - glob
  - exec
permissions:
  allow:
    - Exec(git diff)
    - Exec(git log)
  deny:
    - write
    - edit
---

You are a code review subagent. Your job is to review code changes
thoroughly and report findings back to the parent agent.

Focus on:
1. Correctness — logic errors, edge cases, off-by-one mistakes
2. Security — potential vulnerabilities
3. Style — consistency with the rest of the codebase
4. Performance — obvious inefficiencies

Always cite specific file paths and line numbers in your findings.
```

### Frontmatter Fields

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `name` | string | directory name | Identifier for the profile (must not conflict with built-in profiles) |
| `description` | string | none | Shown to the agent when selecting a profile |
| `model` | string | default subagent model (SWE-1.6) — **not** the parent's model | Override the model used by this subagent |
| `allowed-tools` | list | all tools | Restrict which tools the subagent can use. Cannot grant `ask_user_question`, which is always withheld from subagents. |
| `permissions` | object | inherit | Permission overrides (`allow`, `deny`, `ask`) |
| `max-nesting` | integer | none | Override the maximum nesting depth, allowing this subagent to spawn its own subagents |

### How Custom Subagents Are Used

Once defined, custom subagent profiles appear alongside the built-in ones. The agent sees a description of each available profile and chooses the most appropriate one when spawning a subagent. You can also ask the agent to use a specific profile by name (e.g., "review this code using the reviewer subagent").

Custom subagent profiles that conflict with a built-in profile name (`subagent_explore`, `subagent_general`) are skipped with a warning.

### Importing From Other Tools

Custom subagents are also imported from Claude Code's agent format:

| Source | File Pattern |
|--------|-------------|
| `.claude/agents/*.md` | Each `.md` file becomes a subagent profile |

Claude Code agent files use `tools` instead of `allowed-tools` in their frontmatter. Both formats are supported automatically.

---

## 6. NESTING DEPTH

By default, subagents cannot spawn their own subagents — only the root agent can. Subagent tools (`run_subagent` and `read_subagent`) are disabled inside a subagent to prevent unbounded nesting.

Custom subagent profiles can opt in to nested spawning by setting the `max-nesting` field in their frontmatter. This value overrides the default maximum depth, allowing subagents to spawn children as long as the tree stays within that limit.

```
Root agent (depth 0)
└── Custom subagent (depth 1) — can spawn children
    └── Child subagent (depth 2) — can spawn children
        └── Grandchild subagent (depth 3) — cannot spawn (depth limit reached)
```

**Cost warning:** Nested subagents can increase cost significantly. Each level of nesting spawns additional agents with their own context windows and inference calls. Use this feature deliberately.

---

## 7. EXAMPLES

### Read-Only Research Agent (Built-In)

```bash
# Request an explore subagent for codebase research
devin -p \
  "Use a subagent_explore subagent to thoroughly investigate the authentication module. Report:
   - Relevant files and their purposes
   - Architecture patterns and dependencies
   - Code flow traces with specific line references
   Be exhaustive — search broadly and follow references." \
  --model adaptive --permission-mode auto
```

### Code Change Agent (Built-In)

```bash
# Request a general subagent for bug fixing
devin -p \
  "Use a subagent_general subagent to fix the failing tests in src/utils/validator.ts.
   The tests fail because null inputs are not handled. Apply the minimal fix.
   Report what was changed and why." \
  --model adaptive --permission-mode accept-edits
```

### Custom Reviewer Agent

```markdown
# .devin/agents/reviewer/AGENT.md
---
name: reviewer
description: Reviews code changes for correctness and style
model: sonnet
allowed-tools:
  - read
  - grep
  - glob
  - exec
permissions:
  allow:
    - Exec(git diff)
    - Exec(git log)
  deny:
    - write
    - edit
---

You are a code review subagent. Review code changes thoroughly
and report findings back to the parent agent with specific file
paths and line numbers. Rate each finding as critical/high/medium/low.
```

```bash
# Use the custom reviewer subagent
devin -p \
  "Review the staged changes using the reviewer subagent. Focus on security and correctness." \
  --model adaptive --permission-mode auto
```

### Custom Test Runner Agent

```markdown
# .devin/agents/test-runner/AGENT.md
---
name: test-runner
description: Runs tests and reports results
allowed-tools:
  - read
  - grep
  - glob
  - exec
permissions:
  allow:
    - Exec(npm run test)
    - Exec(npm run lint)
    - Exec(npx tsc --noEmit)
---

You are a test runner subagent. Run the relevant test suites and report:
- Which tests passed and failed
- Failure messages and stack traces
- Suggestions for fixing failures
```

```bash
# Use the custom test-runner subagent
devin -p \
  "Run the full test suite using the test-runner subagent and report all failures." \
  --model adaptive --permission-mode accept-edits
```

### Background Fan-Out with Multiple Explore Subagents

```bash
# Spawn multiple explore subagents in the background
devin -p \
  "Spawn three subagent_explore subagents in the background:
   1. Map the API layer — list all endpoints and their handlers
   2. Map the database layer — list all models and their relationships
   3. Map the auth layer — trace the authentication flow end-to-end
   When all three complete, synthesize a summary of the architecture." \
  --model adaptive --permission-mode auto
```

---

## 8. CAPTURING OUTPUT

```bash
# Capture to file
devin -p "Use a subagent_explore subagent to list all exported functions in src/" \
  --model adaptive --permission-mode auto > /tmp/explore-output.txt

# Capture to variable
RESULT=$(devin -p "Use a subagent_explore subagent to analyze the auth module" \
  --model adaptive --permission-mode auto)

# Check result
if [ $? -eq 0 ]; then
  echo "Success: $RESULT"
else
  echo "Devin dispatch failed" >&2
fi
```

---

## 9. ERROR HANDLING

| Scenario | Detection | Recovery |
|----------|-----------|----------|
| Auth failure | Non-zero exit, auth error in output | Re-run `devin auth login` |
| Subagent denied tools | Subagent fails with permission error | Resume in foreground to approve tools |
| Profile not found | Warning in output, falls back to built-in | Verify AGENT.md exists at `.devin/agents/[name]/AGENT.md` |
| Permission restriction | Permission denied in output | Upgrade permission mode or adjust task scope |
| Timeout / hung | No output within expected time | Simplify task scope; break into smaller steps |
| Low-quality output | Calling AI validation fails | Retry with refined prompt; use a different profile |
| Nesting limit reached | Subagent cannot spawn children | Increase `max-nesting` in custom AGENT.md or restructure the task |
