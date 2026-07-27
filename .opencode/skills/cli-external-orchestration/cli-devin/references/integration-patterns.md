---
title: "Cross-AI Orchestration Patterns: Calling AI + Devin CLI"
description: "Proven patterns for orchestrating Devin CLI from any AI assistant session, including implementation templates and practical considerations."
trigger_phrases:
  - "devin orchestration patterns"
  - "devin generate review fix cycle"
  - "devin background execution"
  - "devin cross validation"
  - "devin subagent fan-out"
  - "devin cloud handoff integration"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Cross-AI Orchestration Patterns: Calling AI + Devin CLI

Proven patterns for orchestrating Devin CLI from any AI assistant session.

---

## 1. OVERVIEW

### Core Principle

The calling AI acts as the orchestrator (planner, validator, integrator) while Devin CLI executes targeted tasks. The value comes from combining different model perspectives and leveraging Devin's multi-model surface, subagent delegation, and cloud handoff — not from redundant work.

### Purpose

Each pattern documented here includes the rationale, implementation template, and practical considerations for combining the calling AI with Devin CLI effectively. Devin is the 5th executor kind in the cli-* family alongside cli-codex (OpenAI), cli-claude-code (Anthropic), cli-opencode (OpenCode), and cli-cursor (Cursor).

### When to Use

- You need a second AI perspective on generated code, architecture, or security
- Devin's strengths (multi-model selection, subagent delegation, cloud handoff, Adaptive routing) complement the calling AI's strengths
- You want to run parallel AI tasks through subagents while the calling AI continues working
- Complex workflows benefit from structured, multi-stage generation and validation
- You need to offload long-running tasks to a cloud VM with browser and shell access
- You want cross-AI validation from a Cognition-backed model

---

## 2. GENERATE-REVIEW-FIX CYCLE

**The most reliable cross-AI pattern.** One AI generates, the other reviews, then the original fixes.

### Flow

```
Calling AI (plan) --> Devin CLI (generate) --> Calling AI (review) --> Devin CLI (fix)
```

### Implementation

```bash
# Step 1: Devin generates the code
devin -p \
  "Create a rate limiter middleware for Express with sliding window algorithm. Output only the code, no explanation." \
  --model adaptive --permission-mode accept-edits > /tmp/rate-limiter.ts

# Step 2: Calling AI reviews (done within the calling AI session)
# Read /tmp/rate-limiter.ts, identify issues, write review to /tmp/review.md

# Step 3: Devin fixes based on review
devin -p \
  "@/tmp/rate-limiter.ts Fix these issues: $(cat /tmp/review.md)" \
  --model adaptive --permission-mode accept-edits > /tmp/rate-limiter-v2.ts
```

### When to Use

- Code generation tasks where a second perspective catches edge cases
- Complex algorithms where verification matters more than speed
- Architecture decisions that benefit from adversarial review

### Considerations

- Always validate the final output yourself (neither AI is infallible)
- Keep the review focused: bullet points of specific issues, not general feedback
- Limit to 2 fix cycles maximum; diminishing returns beyond that

---

## 3. SUBAGENT DELEGATION FOR PARALLEL WORK

**Devin's unique strength: native subagent spawning for independent parallel tasks.**

### Flow

```
Calling AI (plan) --> Devin CLI (spawn subagents) --> [explore-1, explore-2, explore-3] --> Devin (summarize) --> Calling AI
```

### Implementation

```bash
# Dispatch Devin to spawn multiple explore subagents for independent research
devin -p \
  "Spawn three subagent_explore subagents: one to map the API layer, one to map the database layer, and one to map the auth layer. Run them in the background. When all three complete, summarize the key files, dependencies, and any circular imports found." \
  --model adaptive --permission-mode auto > /tmp/subagent-summary.txt 2>&1

# Calling AI reads the summary
cat /tmp/subagent-summary.txt
```

### When to Use

- Independent research tasks that can run in parallel
- Codebase exploration across multiple modules simultaneously
- Gathering context before a major implementation effort

### Considerations

- `subagent_explore` runs on the cheap default subagent model (SWE-1.6) — cost-effective
- `subagent_general` inherits the parent's model — more expensive, use for code changes
- Background subagents cannot prompt for new permissions — pre-approve tools first
- Each subagent has its own context window — they do not inherit the parent's conversation history

---

## 4. BACKGROUND EXECUTION

**Run Devin tasks in parallel while the calling AI continues working.**

### Implementation

```bash
# Launch multiple Devin tasks in background
devin -p "Review src/api/ for security vulnerabilities. Return structured findings." \
  --model opus --permission-mode auto > /tmp/security-review.txt 2>&1 &
PID1=$!

devin -p "Generate unit tests for src/utils.ts" \
  --model adaptive --permission-mode accept-edits > /tmp/generated-tests.ts 2>&1 &
PID2=$!

# Calling AI continues other work...

# Wait for specific task
wait $PID1
echo "Security review complete"
cat /tmp/security-review.txt | head -20

# Wait for all
wait $PID1 $PID2
echo "All Devin tasks complete"
```

### Monitoring

```bash
# Check if still running
kill -0 $PID1 2>/dev/null && echo "Still running" || echo "Complete"

# Check output size (proxy for progress)
wc -c /tmp/security-review.txt

# Tail streaming output
tail -f /tmp/generated-tests.ts
```

### When to Use

- Independent tasks that do not depend on each other
- Long-running analysis while the calling AI handles quick edits
- Generating multiple artifacts simultaneously (tests, docs, types)

### Considerations

- Always redirect stderr: `2>&1` to capture errors alongside output
- Set reasonable timeouts: `timeout 120 devin -p ...` to prevent hung processes
- Do not background tasks with `--permission-mode accept-edits` or higher that write to the same files (race conditions)
- Background `--permission-mode auto` (read-only) tasks are safe to parallelize freely

### False-Completion Trap When Launching from Another AI's Bash Tool

When an orchestrating AI uses its `Bash` tool to launch `devin -p ... &`, the shell command returns exit 0 immediately because the `&` backgrounds the process and the parent shell exits. The orchestrating AI's task system reports "completed" even though the devin process is still running.

**Symptom:** All 5 parallel devin sessions "complete" in under 2 seconds. Output files are empty or missing.

**Root cause:** The Bash tool wraps the command in a subshell. `devin -p ... &` forks the process, the subshell exits, and the task system sees exit 0.

```bash
# BAD: Reports instant "completion" to the orchestrator
devin -p "..." --permission-mode accept-edits > /tmp/result.txt &
echo "PID: $!"
# Shell exits immediately. Orchestrator thinks task is done.

# GOOD: Let the Bash tool wait for devin to finish
devin -p "..." --permission-mode accept-edits > /tmp/result.txt
# Bash tool blocks until devin completes. Use run_in_background on the Bash call itself.
```

### Silent Stdin Consumption When Dispatching in a `while read` Loop

When a dispatcher script iterates over lines of input with `while IFS= read -r line; do ... done < input.jsonl` and launches `devin -p ... &` inside the loop body, **devin silently consumes the loop's stdin**. The loop exits after the first 3-6 iterations with no error, dropping most dispatches.

**Symptom:** You dispatch a 27-finding batch; only 3-6 devin processes actually launch. No error, no warning.

**Root cause:** `devin -p` inherits the script's stdin by default. Each backgrounded devin process reads from the same file descriptor and races with the `read` command for lines.

```bash
# BAD: devin inherits the loop's stdin, drains input.jsonl after iteration ~3
while IFS= read -r line; do
  devin -p "$PROMPT" > "$LOG" 2>&1 &
  echo "$!" > "pid-$LINE_ID.pid"
done < input.jsonl

# GOOD: redirect devin stdin from /dev/null so the loop keeps its own
while IFS= read -r line; do
  devin -p "$PROMPT" > "$LOG" 2>&1 </dev/null &
  echo "$!" > "pid-$LINE_ID.pid"
done < input.jsonl
```

**Always pair `devin -p ... &` inside a read-loop with `</dev/null` on the redirection.**

---

## 5. MODEL SELECTION STRATEGY

**Devin CLI supports multiple models from multiple providers. Choose based on task type.**

### Decision Matrix

| Task Type | Model | Flag | Rationale |
|-----------|-------|------|-----------|
| General delegation | `adaptive` | `--model adaptive` | Router auto-selects best model per task |
| Architecture analysis | `opus` | `--model opus` | Deep reasoning for complex analysis |
| Security audit | `opus` | `--model opus` | Catches subtle vulnerability patterns |
| Complex planning | `opus` / `adaptive` | `--model opus` | Multi-strategy evaluation |
| Research synthesis | `sonnet` / `adaptive` | `--model sonnet` | Good synthesis at reasonable cost |
| Code generation | `adaptive` / `sonnet` | `--model adaptive` | Balanced for code output |
| Standard review | `sonnet` / `adaptive` | `--model sonnet` | Efficient pattern-based review |
| Implementation | `adaptive` / `sonnet` | `--model adaptive` | Balanced for spec-to-code |
| Test generation | `gpt` / `adaptive` | `--model gpt` | Solid test structure |
| Documentation | `adaptive` / `sonnet` | `--model adaptive` | Efficient structured generation |
| Quick edits | `swe-1-6-fast` | `--model swe-1-6-fast` | Minimize latency and cost |
| Cost-sensitive | `swe` / `adaptive` | `--model swe` | Reasonable intelligence at low cost |

### Implementation

```bash
# Deep analysis with Opus
devin -p "Review the authentication architecture for security gaps" \
  --model opus --permission-mode auto

# Code-focused tasks with Adaptive
devin -p "Write tests for utils.ts" \
  --model adaptive --permission-mode accept-edits

# Quick edits with SWE Fast
devin -p "Fix the typo in the error message at line 42" \
  --model swe-1-6-fast --permission-mode accept-edits

# Mixed workflow: analyze with Opus, implement with Adaptive
devin -p "Identify all security vulnerabilities in src/auth/" \
  --model opus --permission-mode auto > /tmp/security-findings.txt

devin -p "Fix these security issues: $(cat /tmp/security-findings.txt)" \
  --model adaptive --permission-mode accept-edits
```

### Why Explicit Model Specification Matters

- Omitting `--model` relies on the CLI default from `~/.config/devin/config.json`, which may differ across machines
- Explicit specification ensures reproducible behavior in scripts and CI/CD pipelines
- The model can also be set in the config file as a project-level default

---

## 6. PERMISSION MODE STRATEGY

**Choose the least-permissive mode that allows the task to succeed.**

### Decision Flow

```
Task type?
  |
  +-- Analysis / review / exploration --> auto
  |
  +-- Code generation / refactoring --> accept-edits
  |
  +-- Trusted workflow with judgment calls --> smart
  |
  +-- System operations / full auto --> dangerous (ASK USER FIRST)
  |
  +-- Unattended execution with OS limits --> --sandbox (autonomous)
```

### Implementation by Task Type

```bash
# Analysis: auto (read-only auto-approve)
devin -p "Identify all N+1 query patterns in src/" \
  --permission-mode auto --model adaptive

# Code generation: accept-edits
devin -p "Add retry logic to all API calls in src/api/" \
  --permission-mode accept-edits --model adaptive

# Unattended execution: sandbox
devin --sandbox -p "Run the test suite and fix any failures" \
  --model adaptive

# Preview before committing: auto first, accept-edits after review
devin -p "List all files that would be changed by the auth refactor" \
  --permission-mode auto --model adaptive > /tmp/files-to-change.txt
# Review /tmp/files-to-change.txt, then proceed:
devin -p "Apply the auth refactor to the files listed in /tmp/files-to-change.txt" \
  --permission-mode accept-edits --model adaptive
```

### Mode Combinations to Avoid

| Combination | Risk | Better Approach |
|-------------|------|-----------------|
| `dangerous` + unattended | Unrestricted, unreviewed changes | Use `accept-edits` or `--sandbox` instead |
| `accept-edits` + blind background | Parallel writes to same files | Use `auto` for parallel background tasks |
| `accept-edits` for pure analysis | Unnecessary write permissions | Use `auto`; it is sufficient for analysis |

---

## 7. CONTEXT ENRICHMENT

**Provide Devin with rich context for better results.**

### File References

```bash
# In the REPL, type @ to open file autocomplete
# @src/database.ts refactor to use the repository pattern

# Non-interactive with file content piped in
cat src/auth.ts | devin -p "Add input validation to all functions in this file" \
  --model adaptive --permission-mode accept-edits
```

### Explicit Context Injection

```bash
# Inject the calling AI's analysis as context
CALLING_AI_ANALYSIS="The bug is in the token refresh logic. The refresh token
is not being rotated on use, allowing token replay attacks."

devin -p \
  "Fix this security issue in the auth token handler. Context from prior analysis: $CALLING_AI_ANALYSIS" \
  --model opus --permission-mode accept-edits
```

### Web Research via Fetch

```bash
# Devin can fetch URLs during execution for current information
devin -p "Fetch the latest Express.js 5.x migration guide and summarize the breaking changes. Implement the recommended patterns in src/app.ts." \
  --model adaptive --permission-mode accept-edits
```

---

## 8. VALIDATION PIPELINE

**Multi-stage validation of Devin-generated output.**

### Implementation

```bash
# Stage 1: Generate
devin -p "Create a webhook handler for Stripe events" \
  --model adaptive --permission-mode accept-edits > /tmp/webhook.ts

# Stage 2: Syntax check
npx tsc --noEmit /tmp/webhook.ts 2>/tmp/syntax-errors.txt
if [ $? -ne 0 ]; then
  devin -p \
    "Fix these TypeScript errors in the webhook handler: $(cat /tmp/syntax-errors.txt)" \
    --model adaptive --permission-mode accept-edits > /tmp/webhook-fixed.ts
  cp /tmp/webhook-fixed.ts /tmp/webhook.ts
fi

# Stage 3: Security scan
devin -p \
  "Audit this webhook handler for security issues. Focus on: input validation, injection attacks, authentication bypasses. Return structured findings." \
  --model opus --permission-mode auto > /tmp/security-scan.txt

# Stage 4: Functional check (calling AI reviews the result)
# Read /tmp/webhook.ts and /tmp/security-scan.txt within the calling AI

# Stage 5: Style alignment
devin -p \
  "Reformat the webhook handler to match project conventions. Functional style, JSDoc on exports." \
  --model adaptive --permission-mode accept-edits > /tmp/webhook-final.ts
```

### Pipeline Stages (Recommended Order)

| Stage | Purpose | Tool |
|-------|---------|------|
| 1. Generate | Create initial artifact | Devin (`adaptive`, `accept-edits`) |
| 2. Syntax | Verify it compiles/parses | Language toolchain (tsc, eslint, etc.) |
| 3. Security | Check for vulnerabilities | Devin (`opus`, `auto`) |
| 4. Functional | Verify correctness | Calling AI review or tests |
| 5. Style | Match project conventions | Devin (`adaptive`, `accept-edits`) |

### When to Use

- Any generated code that will be committed to the repository
- Security-sensitive code (auth, payments, data handling)
- Code that lacks test coverage

---

## 9. CROSS-VALIDATION WITH OTHER CLI EXECUTORS

**Use multiple AI executors to validate each other's work.**

### Calling AI Generates, Devin Reviews

```bash
# Calling AI generates code (within the session)
# Then Devin reviews it:
devin -p \
  "Review the newly-generated module for: correctness, edge cases, performance issues, and adherence to SOLID principles. Be critical. Return structured findings." \
  --model opus --permission-mode auto > /tmp/devin-review.txt
```

### Devin Generates, Calling AI Reviews

```bash
# Devin generates
devin -p "Create a caching layer with TTL support and LRU eviction" \
  --model adaptive --permission-mode accept-edits > /tmp/cache.ts

# Calling AI reviews within the session (read /tmp/cache.ts and analyze)
```

### Multi-Executor Consensus Check

```bash
# Devin generates one approach
devin -p "Design a caching strategy for this API. Consider Redis, in-memory, and CDN approaches." \
  --model opus --permission-mode auto > /tmp/devin-plan.txt

# Codex generates another approach (via cli-codex)
codex exec "Design a caching strategy for this API. Consider Redis, in-memory, and CDN approaches." \
  --model gpt-5.5 --sandbox read-only > /tmp/codex-plan.txt

# Calling AI compares both approaches and synthesizes
```

### Strength Comparison for Task Routing

| Strength Area | Calling AI | Devin CLI |
|---------------|-------------|-----------|
| Codebase context | Deep (built-in tools, spec-kit memory) | Good (with @ file references and subagents) |
| Multi-model access | Single model | Multiple (Opus, Sonnet, GPT, SWE, Codex, Gemini, etc.) |
| Multi-file refactoring | Strong | Strong (especially with Opus) |
| Architecture reasoning | Strong | Strong (Opus reasoning) |
| Subagent delegation | Not native | Native (`run_subagent`) |
| Cloud execution | Not built-in | `/handoff` to cloud VM |
| Session continuity | Built-in (conversation context) | Via `-c` / `-r` / `/resume` / `/fork` |
| Spec-kit memory | Native | Not available |
| Cost optimization | Single model | Adaptive router + SWE-1.6 for cheap tasks |

### Cross-Validation Strategies

| Strategy | Flow | Best For |
|----------|------|----------|
| **Adversarial review** | A generates, B critiques | Security-critical code |
| **Consensus check** | Both solve independently, compare | Architectural decisions |
| **Specialist routing** | Route by strength (table above) | Efficiency optimization |
| **Red team** | A writes, B tries to break | Auth, payments, data access |
| **Multi-model consensus** | Devin runs multiple models internally | Tasks where model diversity helps |

---

## 10. SESSION CONTINUITY

**Maintain context across multiple Devin invocations for complex, multi-turn tasks.**

### Session Operations

```bash
# Continue the most recent session
devin -c

# Resume a specific session by ID
devin -r brisk-otter

# Non-interactive continuation
devin -c -p "Continue implementing the rate limiter from where we left off" \
  --model adaptive --permission-mode accept-edits

# List sessions
devin list --format json
```

### Multi-Turn Scripted Workflow

```bash
# Turn 1: Analysis - capture session ID from output
devin -p "Analyze src/auth/ architecture. List 5 improvements." \
  --model opus --permission-mode auto > /tmp/analysis.txt
# Note the session ID from the output or session list

# Turn 2: Implement first improvement (continue same session)
devin -c -p "Implement improvement #1 from your analysis" \
  --model adaptive --permission-mode accept-edits

# Fork before trying a risky approach (inside REPL)
# /fork
```

### When to Use Each Operation

| Operation | When to Use |
|-----------|-------------|
| `-c` / continue | Continue the most recent session with existing context |
| `-r` / resume | Resume a specific session by ID |
| `/fork` | Try a different approach without losing the original session state |
| New session | Fresh context; prior session is not relevant |
| `-p` (stateless) | One-shot tasks; simpler to re-provide context than manage sessions |

### Considerations

- For cross-AI orchestration, it is often simpler to re-provide context via file references than to manage session IDs across multiple `devin -p` calls.
- Use sessions when the task genuinely builds on prior Devin reasoning that would be costly to re-establish.
- Fork before any operation that could leave the session in a broken state.

---

## 11. ANTI-PATTERNS

**What NOT to do when orchestrating Devin CLI from the calling AI.**

### 1. Using dangerous Mode Without Approval

```bash
# BAD: Dangerous mode on destructive operations without human checkpoint
devin -p "Clean up the codebase" --permission-mode dangerous

# GOOD: Review plan first, then execute with appropriate mode
devin -p "List files that could be cleaned up. Do not delete anything." \
  --permission-mode auto --model adaptive
# Review the list, then selectively execute
```

### 2. Trusting Output Blindly

```bash
# BAD: Direct pipe to production
devin -p "Generate migration SQL" --model adaptive --permission-mode auto \
  | psql production_db

# GOOD: Generate, review, test, then apply
devin -p "Generate migration SQL" --model adaptive --permission-mode auto \
  > /tmp/migration.sql
# Review /tmp/migration.sql
# Test on staging: psql staging_db -f /tmp/migration.sql
# Then apply to production
```

### 3. Over-Specifying in a Single Prompt

```bash
# BAD: Everything at once
devin -p "Create a complete REST API with auth, CRUD, rate limiting, caching, logging, monitoring, tests, and deployment config" \
  --model adaptive

# GOOD: Incremental
devin -p "Create type definitions for a blog API: User, Post, Comment" \
  --model adaptive --permission-mode accept-edits
# Then build on top incrementally
```

### 4. Background Tasks Writing the Same Files

```bash
# BAD: Parallel writes to overlapping files
devin -p "Fix auth" --permission-mode accept-edits --model adaptive &
devin -p "Fix auth tests" --permission-mode accept-edits --model adaptive &
# Race condition: both modify src/auth/ simultaneously

# GOOD: Background only for independent, read-only analysis
devin -p "Review src/auth/" --permission-mode auto --model opus > /tmp/auth-review.txt &
devin -p "Review src/payments/" --permission-mode auto --model opus > /tmp/pay-review.txt &
wait
```

### 5. Backgrounding devin Inside Shell Scripts Called by Another AI

```bash
# BAD: & inside the shell command - orchestrator sees instant exit 0
devin -p "Deep review all phases" --permission-mode accept-edits > /tmp/result.txt 2>&1 &
echo "PID: $!"
# The Bash tool reports "completed" in <2 seconds. Devin is still running.

# GOOD: No & - use the orchestrator's own background mechanism instead
devin -p "Deep review all phases" --permission-mode accept-edits > /tmp/result.txt 2>&1
# The orchestrator waits for the actual devin process to finish.
```

### 6. Forgetting Context in Stateless -p Calls

```bash
# BAD: Follow-up without re-providing context
devin -p "Analyze src/auth.ts" --model adaptive  # Turn 1
devin -p "Now fix the issue you found" --model adaptive  # Turn 2: Devin has no memory of Turn 1

# GOOD: Re-provide context or use session continue
devin -p "Analyze src/auth.ts" --model adaptive > /tmp/analysis.txt
devin -p "Fix the issues identified: $(cat /tmp/analysis.txt)" \
  --model adaptive --permission-mode accept-edits
```

### 7. Using subagent_general for Read-Only Research

```bash
# BAD: general subagent runs on parent's (possibly expensive) model for research
devin -p "Use a subagent_general subagent to research the auth module" \
  --model opus --permission-mode auto

# GOOD: explore subagent runs on cheap SWE-1.6 for read-only research
devin -p "Use a subagent_explore subagent to research the auth module" \
  --model adaptive --permission-mode auto
```
