---
title: Prompt Templates
description: Copy-paste ready prompt templates for common Devin CLI tasks organized by category with placeholders and examples.
trigger_phrases:
  - "devin prompt templates"
  - "devin -p templates"
  - "devin code generation template"
  - "devin subagent template"
  - "devin review prompt template"
  - "devin cloud handoff template"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Prompt Templates - Devin CLI

Copy-paste ready prompt templates for common Devin CLI tasks. Replace `[placeholders]` with your values.

## 1. OVERVIEW

### Purpose

This asset provides structured, copy-paste ready prompt templates for invoking Devin CLI across common development tasks. Each template includes the full command with flags, placeholder variables, and a concrete example.

### Usage

1. Find the template category matching your task
2. Copy the command
3. Replace `[placeholders]` with actual values
4. Run in your terminal or via Bash tool

### Flag Reference

| Flag | Purpose |
|------|---------|
| `--model adaptive` | Skill default model (Adaptive router). Override per dispatch with `opus`, `sonnet`, `swe`, `gpt`, `codex`, `gemini`, etc. |
| `--permission-mode auto` | Read-only auto-approve. Use for review, analysis, research. |
| `--permission-mode accept-edits` | Auto-approve workspace edits. Use for code generation, bug fixing. |
| `--permission-mode dangerous` | Auto-approve all tools. **Requires explicit user approval.** |
| `--sandbox` | OS-level sandbox (selects `autonomous` mode). For unattended execution. |
| `-p` / `--print` | Non-interactive mode: print response and exit. |
| `-c` / `--continue` | Continue the most recent session. |
| `-r` / `--resume <id>` | Resume a specific session by ID. |
| `--` | Separator before the prompt (use when prompt starts with flag-like tokens). |

---

## 2. CODE GENERATION

### Single-File Application

Framework: RCAF

Generate a complete single-file application from a description.

```bash
devin -p "Create a [description] application in [language]. Requirements: [requirements]. Output a single complete file with all imports, error handling, and comments. Start immediately." \
  --model adaptive --permission-mode accept-edits
```

**Example:**

```bash
devin -p "Create a REST API server application in TypeScript. Requirements: Express framework, CRUD endpoints for a 'tasks' resource, input validation with Zod, error middleware, health check endpoint. Output a single complete file with all imports, error handling, and comments. Start immediately." \
  --model adaptive --permission-mode accept-edits
```

### Multi-File Project

Framework: RCAF

Generate a multi-file project structure with coordinated files.

```bash
devin -p "Create a [description] project in [language] with the following structure: [features]. Generate all files including entry point, modules, configuration, and package manifest. Write files to [directory]. Start immediately." \
  --model adaptive --permission-mode accept-edits
```

**Example:**

```bash
devin -p "Create a CLI tool project in TypeScript with the following structure: command parser with yargs, config loader from YAML, logger module with levels, and main entry point. Generate all files including entry point, modules, configuration, and package manifest. Write files to ./src/cli-tool/. Start immediately." \
  --model adaptive --permission-mode accept-edits
```

### Component / Module

Framework: RCAF

Generate a single component or module that fits into an existing codebase.

```bash
devin -p "Create a [language] [format] for [description]. Follow the patterns used in the existing codebase. Include types, exports, error handling, and JSDoc comments. Output only the code." \
  --model adaptive --permission-mode accept-edits
```

---

## 3. CODE REVIEW

### Comprehensive Review

Framework: TIDD-EC

Full code review covering correctness, style, maintainability, and performance.

```bash
devin -p "Review the file at [file-path] thoroughly. Check for: 1) Logic errors and edge cases, 2) Code style and naming consistency, 3) Error handling completeness, 4) Performance issues, 5) Maintainability concerns. For each issue found, provide the line reference, severity (critical/warning/info), and a suggested fix." \
  --model opus --permission-mode auto
```

### Security-Focused Review

Framework: TIDD-EC

Review focused on security vulnerabilities and attack surfaces.

```bash
devin -p "Perform a security audit of [file-path]. Check for: 1) Injection vulnerabilities (SQL, XSS, command injection), 2) Authentication and authorization flaws, 3) Sensitive data exposure (hardcoded secrets, logging PII), 4) Input validation gaps, 5) Insecure dependencies or patterns, 6) eval() or dynamic code execution. Rate each finding as critical/high/medium/low severity." \
  --model opus --permission-mode auto
```

### Subagent-Delegated Review

Framework: TIDD-EC

Use a subagent for parallel review work.

```bash
devin -p "Use a subagent_explore subagent to review [file-path] for code quality issues. The subagent should check for logic errors, style issues, and missing error handling. Report findings with severity ratings." \
  --model adaptive --permission-mode auto
```

---

## 4. BUG FIXING

### Fix Identified Bugs

Framework: RCAF + TIDD-EC

Fix a known bug with description and reproduction context.

```bash
devin -p "Fix this bug in [file-path]: [description]. The expected behavior is [requirements]. The actual behavior is [description]. Apply the minimal fix without refactoring unrelated code. Explain the root cause and the fix. Start immediately." \
  --model adaptive --permission-mode accept-edits
```

### Auto-Detect and Fix

Framework: RCAF + TIDD-EC

Let Devin scan a file for potential bugs and apply fixes.

```bash
devin -p "Scan [file-path] for bugs. Look for: null/undefined access, off-by-one errors, race conditions, unhandled promise rejections, incorrect type coercions, resource leaks, and logic errors. For each bug found: describe the issue, show the fix, and explain why it is a bug. Apply all fixes. Start immediately." \
  --model adaptive --permission-mode accept-edits
```

### Subagent-Delegated Debugging

Framework: RCAF + TIDD-EC

Use a general subagent for fresh-perspective debugging.

```bash
devin -p "Use a subagent_general subagent to debug this issue: [description]. The error occurs at [file-path]:[line]. Prior attempts: [what was tried]. The subagent should apply the minimal fix and report what was changed." \
  --model adaptive --permission-mode accept-edits
```

---

## 5. TEST GENERATION

### Unit Tests

Framework: RCAF

Generate unit tests for a specific file or module.

```bash
devin -p "Generate comprehensive [framework] unit tests for [file-path]. Cover: 1) Happy path for each exported function, 2) Edge cases (empty input, null, boundary values), 3) Error conditions and thrown exceptions, 4) Mock external dependencies. Use describe/it blocks with descriptive names. Output a complete test file." \
  --model adaptive --permission-mode accept-edits
```

**Example (Jest):**

```bash
devin -p "Generate comprehensive Jest unit tests for src/utils/validator.ts. Cover: 1) Happy path for each exported function, 2) Edge cases (empty input, null, boundary values), 3) Error conditions and thrown exceptions, 4) Mock external dependencies. Use describe/it blocks with descriptive names. Output a complete test file." \
  --model adaptive --permission-mode accept-edits
```

### Integration Tests

Framework: RCAF

Generate integration tests that test multiple components working together.

```bash
devin -p "Generate [framework] integration tests for the [description] workflow. Test files involved: [file-path]. Cover: 1) End-to-end happy path, 2) Error propagation across layers, 3) Database/API interaction patterns, 4) Setup and teardown for test isolation. Write the complete test file." \
  --model adaptive --permission-mode accept-edits
```

### Test Coverage Analysis

Framework: RCAF

Identify missing test coverage in an existing test suite.

```bash
devin -p "Analyze [test-file] against the implementation in [source-file]. Identify: 1) Functions with no test coverage, 2) Edge cases not covered by existing tests, 3) Error paths not exercised. List gaps by priority (critical/high/medium) and suggest specific test cases to add." \
  --model adaptive --permission-mode auto
```

---

## 6. SUBAGENT DELEGATION

### Parallel Research with Explore Subagents

Framework: CRAFT

Spawn multiple explore subagents for independent research tasks.

```bash
devin -p "Spawn [N] subagent_explore subagents in the background: [task-1], [task-2], [task-3]. When all complete, synthesize a summary of the findings." \
  --model adaptive --permission-mode auto
```

**Example:**

```bash
devin -p "Spawn three subagent_explore subagents in the background: 1. Map the API layer — list all endpoints and handlers, 2. Map the database layer — list all models and relationships, 3. Map the auth layer — trace the authentication flow. When all three complete, synthesize an architecture summary." \
  --model adaptive --permission-mode auto
```

### Code Changes with General Subagent

Framework: RCAF

Use a general subagent for focused code changes.

```bash
devin -p "Use a subagent_general subagent to [description]. Apply the changes and report what was modified and why." \
  --model adaptive --permission-mode accept-edits
```

### Custom Subagent Profile

Framework: RCAF

Use a custom AGENT.md profile for specialized work.

```bash
devin -p "Use the [profile-name] subagent to [description]. Report the results." \
  --model adaptive --permission-mode auto
```

---

## 7. CLOUD HANDOFF

### Long-Running Task Handoff

Framework: CRAFT

Hand off a long-running task to a cloud Devin session.

```bash
# Start a session, then hand off inside the REPL
devin -- "[description of long-running task]" --permission-mode accept-edits
# Inside the REPL:
/handoff [task description]
```

**Example:**

```bash
devin -- "Run the full integration test suite, fix any failures, and verify the build passes" --permission-mode accept-edits
# Inside the REPL:
/handoff run the full integration test suite, fix any failures, and verify the build passes
```

### Browser-Dependent Workflow Handoff

Framework: CRAFT

Hand off a task that needs a browser to the cloud.

```bash
devin -- "Test the OAuth flow end-to-end: start the dev server, navigate to the login page, complete the OAuth flow, and verify the callback handles the token correctly" --permission-mode accept-edits
# Inside the REPL:
/handoff test the OAuth flow end-to-end
```

---

## 8. ARCHITECTURE ANALYSIS

### Project Analysis

Framework: CRAFT

Analyze overall project architecture and structure.

```bash
devin -p "Analyze the project structure in [directory]. Provide: 1) High-level architecture overview, 2) Key modules and their responsibilities, 3) Dependency relationships between major components, 4) Entry points and data flow, 5) Technology stack summary. Output as structured markdown." \
  --model opus --permission-mode auto
```

### Dependency Analysis

Framework: CRAFT

Map dependencies and identify coupling issues.

```bash
devin -p "Analyze dependencies in [directory]. Identify: 1) Direct and transitive dependency chains, 2) Circular dependencies, 3) Tightly coupled modules, 4) Unused imports or dead code paths, 5) Dependency inversion violations. Suggest concrete decoupling strategies." \
  --model opus --permission-mode auto
```

---

## 9. SPECIALIZED TASKS

### Git Commit Message

Framework: RCAF

Generate a commit message from staged changes.

```bash
devin -p "Based on the following git diff, write a commit message following Conventional Commits format (type(scope): description). Include a body explaining why the change was made. Diff: $(git diff --cached)" \
  --model adaptive --permission-mode auto
```

### Code Explanation

Framework: CRAFT

Get a detailed explanation of unfamiliar code.

```bash
devin -p "Explain [file-path] in detail. Cover: 1) What the code does at a high level, 2) Key algorithms or patterns used, 3) How data flows through the functions, 4) Why certain design decisions were likely made, 5) Any non-obvious behavior or gotchas. Write for a developer unfamiliar with this codebase." \
  --model adaptive --permission-mode auto
```

### Error Diagnosis

Framework: TIDD-EC

Diagnose an error message with full context.

```bash
devin -p "Diagnose this error: [error message]. It occurs when running [description] in [file-path]. Stack trace: [stack trace]. Provide: 1) Root cause analysis, 2) Step-by-step fix, 3) How to prevent this error in the future." \
  --model adaptive --permission-mode accept-edits
```

### Session-Based Multi-Step Task

Framework: CRAFT

Orchestrate a complex multi-step task across sessions.

```bash
# Step 1: Begin task
devin -p "Begin implementing [feature]. Start with the interface design and data model. Stop before writing implementation. Describe the planned approach." \
  --model adaptive --permission-mode accept-edits

# Step 2: Continue and implement
devin -c -p "Continue implementing [feature] from where we left off. Implement the core logic." \
  --model adaptive --permission-mode accept-edits
```

### Research-Then-Implement

Framework: CRISPE + RCAF

Research best practices, then apply them to the codebase.

```bash
# Phase 1: Research
devin -p "Research current best practices for [topic] in [language/framework]. Summarize the top 3 recommended approaches with pros and cons." \
  --model adaptive --permission-mode auto

# Phase 2: Implement
devin -p "Based on best practices for [topic], implement [description] in [file-path]. Use the [approach] pattern. Preserve all existing behavior." \
  --model adaptive --permission-mode accept-edits
```

---

## 10. TEMPLATE VARIABLES

All placeholders used across templates in this file:

| Variable | Description | Example Values |
|----------|-------------|----------------|
| `[file]` | Relative file path | `src/utils/validator.ts`, `lib/api.py` |
| `[file-path]` | Full file path for Devin dispatch | `src/auth/handler.ts` |
| `[directory]` | Project or module directory | `./src/`, `./packages/core/` |
| `[description]` | Free-text description of intent or behavior | `"rate-limiting middleware"`, `"Cannot read property of null"` |
| `[features]` | List of features or capabilities | `"auth, logging, caching"` |
| `[requirements]` | Specific requirements or constraints | `"must handle 1000 req/s"`, `"readability and testability"` |
| `[framework]` | Framework name | `React`, `Vue`, `Express`, `FastAPI`, `Jest`, `Vitest` |
| `[language]` | Programming language | `TypeScript`, `Python`, `Go`, `Rust` |
| `[format]` | Code format or structure type | `module`, `class`, `component`, `middleware` |
| `[topic]` | Research subject or technology name | `Next.js 15`, `Bun vs Deno`, `React Server Components` |
| `[error message]` | Verbatim error text | `"Cannot read properties of undefined"` |
| `[stack trace]` | Error stack trace | Multi-line stack trace text |
| `[N]` | Number of subagents | `3`, `5` |
| `[task-N]` | Subagent task description | `"Map the API layer"` |
| `[profile-name]` | Custom subagent profile name | `reviewer`, `test-runner` |
| `[session-id]` | Devin session identifier | `brisk-otter` |

### Placeholder Conventions

- **Single value**: `[file]` - replace with one value
- **List value**: `[features]` - replace with comma-separated list
- **Free text**: `[description]` - replace with natural language
- **Compound**: Some templates use the same placeholder multiple times. Replace each occurrence independently.

---

## 11. RELATED RESOURCES

### Parent

- [SKILL.md](../SKILL.md) - Main skill instructions and invocation patterns

### References

- [cli-reference.md](../references/cli-reference.md) - Complete CLI subcommand and flag reference
- [integration-patterns.md](../references/integration-patterns.md) - Cross-AI orchestration patterns
- [devin-tools.md](../references/devin-tools.md) - Built-in capabilities (run_subagent, /handoff, MCP, session management)
- [agent-delegation.md](../references/agent-delegation.md) - Subagent profile roster and custom AGENT.md patterns
- [cloud-handoff.md](../references/cloud-handoff.md) - /handoff cloud-handoff mechanics and state transfer

---

## 12. MEMORY EPILOGUE

### Purpose

Append this epilogue to any delegated prompt when the calling AI needs structured session memory back from Devin CLI. The agent will include the delimited section in its output, enabling the calling AI to extract, parse, and save it via `generate-context.js`.

### Epilogue Template

Append the following text to the end of any Devin CLI prompt:

```text
When you finish, include a session memory section in your output using EXACTLY this format:

<!-- MEMORY_HANDBACK_START -->
## Session Memory

### Summary
[1-3 sentences: what was accomplished]

### Files Modified
- path/to/file.ts

### Decisions
- Decision and rationale

### Next Steps
- Remaining work

### Spec Folder
[spec-folder-name]
<!-- MEMORY_HANDBACK_END -->
```

### Extraction by Calling AI

After receiving agent output, the calling AI extracts the handback section:

```javascript
const match = output.match(/<!-- MEMORY_HANDBACK_START -->([\s\S]*?)<!-- MEMORY_HANDBACK_END -->/);
```

Then constructs structured JSON and saves via:

```bash
# Redact or scrub secrets before writing the JSON payload
# Write extracted data to JSON
cat > /tmp/save-context-data.json << 'JSONEOF'
{
  "specFolder": "<extracted or provided by calling AI>",
  "user_prompts": [
    "<delegated task or user goal>"
  ],
  "observations": [
    {
      "type": "implementation",
      "title": "<short accomplishment>",
      "narrative": "<what changed and why it matters>",
      "facts": [
        "<verification or durable implementation detail>"
      ]
    }
  ],
  "recent_context": [
    {
      "request": "<delegated task or user goal>",
      "learning": "<durable implementation detail or verification result>"
    }
  ],
  "FILES": [
    {
      "FILE_PATH": "<extracted path when known>",
      "DESCRIPTION": "<what changed and why it matters>",
      "ACTION": "Modified",
      "MODIFICATION_MAGNITUDE": "small",
      "_provenance": "tool"
    }
  ],
  "sessionSummary": "<extracted summary>",
  "keyDecisions": ["<extracted decisions>"],
  "nextSteps": ["<extracted remaining work>"],
  "triggerPhrases": ["<auto-derived from task>"]
}
JSONEOF

# Save via generate-context.js JSON mode
node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json [spec-folder]
```

Structured JSON is the required save path. You can pass the payload via temp file, `--stdin`, or `--json`; do not call `generate-context.js` with only a spec folder.

---

## 13. MODEL SELECTION FOR TEMPLATES

All templates default to `--model adaptive`. Tune the model to the task.

### Deep Reasoning (architecture, security, planning)

```bash
# Architecture analysis with Opus
devin -p "Analyze the architecture of this project. Identify coupling issues, circular dependencies, and scalability concerns." \
  --model opus --permission-mode auto

# Security audit with Opus
devin -p "Perform a thorough security audit of [file-path]. Check OWASP Top 10, auth bypasses, injection vectors, and cryptographic weaknesses." \
  --model opus --permission-mode auto
```

### Quick Edits (cost-sensitive)

```bash
# Quick fix with SWE Fast
devin -p "Fix the typo in the error message at line 42 in [file-path]." \
  --model swe-1-6-fast --permission-mode accept-edits

# Quick lookup with SWE
devin -p "List all TODO comments in src/." \
  --model swe --permission-mode auto
```

### Mixed Effort Workflow

Use `opus` for analysis, then `adaptive` for implementation:

```bash
# Step 1: Deep analysis with Opus
devin -p "Identify all security vulnerabilities in src/auth/" \
  --model opus --permission-mode auto > /tmp/security-findings.txt

# Step 2: Fix with Adaptive
devin -p "Fix these security issues: $(cat /tmp/security-findings.txt)" \
  --model adaptive --permission-mode accept-edits
```
