---
description: Project response into plain English using external CLI agents, in-context reasoning, or local LLM.
argument-hint: "[cli-<skill>|native|local] [target-text]"
allowed-tools: Bash, Read, Grep, Glob
---

# MANDATORY FIRST ACTION - DO NOT SKIP

**BEFORE READING ANYTHING ELSE IN THIS FILE, CHECK `$ARGUMENTS`:**

```
IF $ARGUMENTS contains an explicit engine choice (cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-opencode, cli-pi, native, local):
    → Extract the engine and any optional target text
    → Continue reading this file

IF $ARGUMENTS is empty, undefined, or does not specify an engine:
    → STOP IMMEDIATELY
    → Present the user with this engine selection menu:
        question: "Which rewrite engine would you like to use for the plain-English projection?"
        options:
          - label: "External AI (cli-* skill)"
            description: "Route to one of the 6 external CLI skills: cli-claude-code, cli-codex, cli-cursor, cli-devin, cli-opencode, cli-pi"
          - label: "Native (In-Context)"
            description: "The active AI performs the plain-English rewrite in-context without running external or local models"
          - label: "Local LLM"
            description: "Run through the local provider path via the package's cli-output-wrapper"
    → WAIT for user response
    → If External AI is selected, prompt for the specific cli-* skill (and optional model override) if not already given
    → Use the explicit user selection as the execution engine
    → Only THEN continue with this workflow
```

**CRITICAL RULES:**
- **DO NOT** infer the engine from context, active environment, conversation history, or open files
- **DO NOT** assume which engine the user wants to use
- **DO NOT** proceed past this point without explicit engine confirmation from the user
- The engine selection MUST come from `$ARGUMENTS` or the user's explicit response to the question above

---

# Rewrite Response by External Agent

Execute a one-shot communication projection of a target response into plain English using a user-selected engine.

---

## 1. PURPOSE

The `/rewrite:response-by-external-agent` command performs a one-shot plain-English projection of a target assistant message through a user-selected engine (an external CLI agent, native in-context reasoning, or a local LLM).

- Projection is disabled by default globally and remains disabled after execution.
- Enables transient projection for the single execution lifecycle, runs the rewrite workflow, and flips projection off upon completion or failure.
- Operates as a display-only projection: changes no canonical transcript bytes, writes no files to disk, and modifies no repository state.
- Preserves technical accuracy, logical flow, and protected tokens byte-for-byte.

---

## 2. CONTRACT

**Inputs:**
- `$ARGUMENTS` — `[<engine>] [target-text]`
  - `<engine>`: Engine identifier (`cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-opencode`, `cli-pi`, `native`, or `local`).
  - `[target-text]`: Optional explicit text to project. Defaults to the immediately preceding assistant turn in the active session.

**Outputs:** Formatted plain-English projection followed by structured status line.

| Output Status | Condition |
| ------------- | --------- |
| `STATUS=OK` | Successfully projected and displayed rewritten response |
| `STATUS=NOOP REASON="no prior assistant message"` | No previous assistant message exists and no target text was provided |
| `STATUS=CANCELLED ACTION=cancelled` | User cancelled during engine selection or confirmation |
| `STATUS=FAIL ERROR="<message>"` | Missing configuration, invalid engine, dispatch error, or unrecoverable failure |

---

## 3. ON-RUN-OFF STATE MECHANISM

The projection capability operates under a strict transient lifecycle to guarantee that global settings remain untouched:

### Representation
- The state gate is controlled by the environment variable `COMMUNICATION_PROJECTION_ENABLED=1`.
- This matches the exact environment check executed by `isProjectionEnabled()` across runtime adapters and projection wrappers.

### Process-Scoped Execution
- The variable is set **inline** on the single execution process (for example, `COMMUNICATION_PROJECTION_ENABLED=1 <run-command>`).
- It lives exclusively in the transient process environment of that specific invocation and does not alter the parent shell environment.

### Guaranteed Flip-Off
- Because the variable is scoped strictly to the child subprocess invocation, it disappears automatically the instant the process exits, whether on success, timeout, or failure.
- When executed in interactive shells or multi-step wrappers, wrap execution in a try/finally trap:
  ```bash
  (
    export COMMUNICATION_PROJECTION_ENABLED=1
    trap 'unset COMMUNICATION_PROJECTION_ENABLED' EXIT
    <run-command>
  )
  ```
- The command MUST NEVER write projection flags to `enablement.local.json`.
- The command MUST NEVER leave `COMMUNICATION_PROJECTION_ENABLED` exported in the parent shell.

### Invariant Preservation
- The repository default-off invariant remains intact before, during, and after execution.
- Git-tracked configuration and `enablement.local.json` are never modified.

---

## 4. INSTRUCTIONS

Execute the following steps in order:

### Step 1: Resolve Target Content

- Check `$ARGUMENTS` for an explicit `[target-text]` parameter.
- If explicit target text is supplied, use it as the source text to project.
- If omitted, locate the immediately preceding assistant response in the active session.
- If no previous assistant response exists and no explicit target text was provided:
  - Emit message: `No prior assistant message found to rewrite.`
  - Return `STATUS=NOOP REASON="no prior assistant message"`.
  - Terminate execution.

### Step 2: Extract Protected Spans

- Scan the target text for literal technical tokens that must remain byte-for-byte unchanged:
  - Fenced code blocks (triple backticks) and inline code spans (single backticks)
  - File paths, directory paths, and file extensions
  - Terminal commands, scripts, CLI flags, and tool invocations
  - URLs, URIs, endpoints, and network protocol strings
  - Exact numbers, dates, timestamps, versions, and metrics
  - Technical identifiers (variable, function, class, and parameter names)
  - Literal strings, environment variables, and configuration keys

### Step 3: Route and Execute by Engine Choice

#### Branch A: Native In-Context Engine (`native`)
- No environment variable modification is required (no external or local model process runs).
- Load the wording standard. This file does not restate it:
  - `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`, the standard itself: voice directives, punctuation standards, structural patterns and the word lists.
  - `.opencode/skills/sk-doc/sk-create-with-human-voice/references/scope-and-exemptions.md`, the scope gate: which spans of the target a rewrite may touch, and which it carries rather than owns.
  - `.opencode/skills/sk-communication/SKILL.md` section 3, "The Wording Standard", for the two parts of the standard a projection excludes and the reason.
- Rewrite the resolved target text in-context under that standard. Two projection constraints override it wherever they collide:
  - **Preserve exact meaning**: Every factual statement, logical relationship, instruction and conclusion survives. The original author's claims are the accuracy baseline, so a hedge they meant stays even where the standard prefers certainty.
  - **Exact span fidelity**: Re-insert every protected span identified in Step 2 byte-for-byte.
- Proceed to Step 4 to display the result.

#### Branch B: External AI CLI Skill (`cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-opencode`, `cli-pi`)
- Validate the chosen CLI skill against the six supported external skills, then map `cli-<skill>` to its engine id: `cli-claude-code` → `claude-code`; `cli-codex`, `cli-cursor`, `cli-devin`, `cli-opencode`, `cli-pi` → `codex`, `cursor`, `devin`, `opencode`, `pi`.
- **Model resolution**: The entrypoint supplies a documented default model for `claude-code`, `codex`, `cursor`, `devin`, and `opencode` when the model argument is omitted, so an engine-only invocation runs. `pi` has no default and needs an explicit `provider/model` id. To pin a considered model, read `.opencode/skills/cli-external-orchestration/<cli-skill>/SKILL.md` and pass it explicitly.
- Route the rewrite through the package's external-cli provider entrypoint, passing the target text on stdin and scoping projection to this single process. Pass an explicit model, or omit it to use the engine's documented default (required for `pi`):
  ```bash
  printf '%s' "<target-text>" \
    | COMMUNICATION_PROJECTION_ENABLED=1 node \
        .opencode/skills/sk-communication/cli-communication-projection/bin/external-cli-project.mjs \
        <engine> [model]
  ```
- The entrypoint builds the `external-cli-<engine>` provider record, runs the rewrite through the CLI subprocess, and drives it through the package's privacy routing (hosted-retained under egress consent), fidelity validation, and exact-original fallback. It prints the projected plain-English text — or the byte-exact original on any denied route, dispatch failure, or rejected rewrite — to stdout, and a `STATUS=` line to stderr.
- Capture the entrypoint's stdout as the projection result.
- The inline environment variable is cleared automatically upon child process exit; the entrypoint sets no global projection state.
- Proceed to Step 4 to display the result.

#### Branch C: Local LLM Provider (`local`)
- The local provider is read from a `localProvider` block in `enablement.local.json`. If none is configured, the entrypoint below prints actionable instructions and returns `STATUS=FAIL ERROR="local provider not configured"`; surface that message and terminate.
- Route the resolved target text through the package's local projection entrypoint, passing the target text on stdin and scoping projection to this single process:
  ```bash
  printf '%s' "<target-text>" \
    | COMMUNICATION_PROJECTION_ENABLED=1 node \
        .opencode/skills/sk-communication/cli-communication-projection/bin/local-project.mjs
  ```
- The entrypoint builds the local provider record from `enablement.local.json` and drives the target text through the package's privacy routing (local-only, no egress), fidelity validation, and exact-original fallback. It prints the projected plain-English text — or the byte-exact original on any denied route, provider failure, or rejected rewrite — to stdout, and a `STATUS=` line to stderr.
- Capture the entrypoint's stdout as the projection result.
- The inline environment variable is cleared automatically upon child process exit; the entrypoint sets no global projection state.
- Proceed to Step 4 to display the result.

### Step 4: Render Projection and Return Status

- Display the projected output with the engine identifier:
  ```text
  > **Plain-English Rewrite (<engine>):**
  <projected text>
  ```
- Emit structured status:
  - Success: `STATUS=OK`
  - Cancellation: `STATUS=CANCELLED ACTION=cancelled`
  - Failure: `STATUS=FAIL ERROR="<message>"`

---

## 5. EXAMPLES

### Example 1: External AI Dispatch via CLI Skill

Invocation:

```text
/rewrite:response-by-external-agent cli-claude-code
```

Output:

```text
> **Plain-English Rewrite (cli-claude-code):**
I updated the configuration file `config.json` and ran all 12 test cases. Everything passed.

STATUS=OK
```

### Example 2: Native In-Context Projection

Invocation:

```text
/rewrite:response-by-external-agent native
```

Output:

```text
> **Plain-English Rewrite (native):**
The database migration completed successfully. All 5 tables were updated.

STATUS=OK
```

### Example 3: Local LLM Projection

Invocation:

```text
/rewrite:response-by-external-agent local
```

Output:

```text
> **Plain-English Rewrite (local):**
I built the application and verified that no build errors were reported.

STATUS=OK
```

---

## 6. NOTES

- **Display-Only Invariant:** This command modifies only the immediate presentation layer. It does not alter conversation transcripts, model history, or project files.
- **Default-OFF Invariant:** Global default-off state is preserved across all environments. `enablement.local.json` is never written to enable projection.
- **Guaranteed Cleanup:** `COMMUNICATION_PROJECTION_ENABLED` is scoped strictly to the child subprocess execution and ceases to exist immediately upon exit, even during errors or cancellations.
- **Pipeline Routing (Branch B):** The external-cli path runs through the package's `external-cli-project` entrypoint, so every cli-* rewrite passes the same privacy routing, fidelity validation, and exact-original fallback as the local provider path. A denied route, dispatch failure, or rejected rewrite returns the byte-exact original.
- **Supported External CLIs:** The six supported external CLI skills are `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-opencode`, and `cli-pi`.
- **The Standard Reaches Branch A Only:** Branches B and C hand the target to another model under the package's own one-line copy-editing instruction, `COPY_EDITING_INSTRUCTION` in `src/config/local-provider.ts` and `src/runtime/external-cli-projection.ts`. That instruction is a compiled package constant carried in the versioned prompt profile, so it is changed under the package gate rather than from a command file. An external or local rewrite is therefore held to fidelity validation and the exact-original fallback, not to the Human Voice Rules.
- **Preload Requirement:** The executing agent must read `.opencode/skills/cli-external-orchestration/<cli-skill>/SKILL.md` prior to external dispatch.
