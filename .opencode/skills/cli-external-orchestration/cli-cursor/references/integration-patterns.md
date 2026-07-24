---
title: "Cross-AI Orchestration Patterns: Calling AI + Cursor CLI"
description: "Proven patterns for orchestrating Cursor CLI from any AI assistant session, including implementation templates and practical considerations."
trigger_phrases:
  - "cursor orchestration patterns"
  - "cursor generate review fix cycle"
  - "cursor background execution"
  - "cursor cross validation"
  - "cursor approval strategy"
  - "cursor validation pipeline"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Cross-AI Orchestration Patterns: Calling AI + Cursor CLI

Proven patterns for orchestrating Cursor CLI from any AI assistant session.

---

## 1. OVERVIEW

### Core Principle

The calling AI acts as the orchestrator (planner, validator, integrator) while Cursor CLI executes targeted tasks. The value comes from combining different model perspectives — including Cursor's own Composer model — not from redundant work.

### Purpose

Each pattern documented here includes the rationale, implementation template, and practical considerations for combining the calling AI with Cursor CLI effectively.

### When to Use

- You need a second AI perspective on generated code, or specifically Cursor's own Composer model's perspective
- You want read-only exploration (`--mode plan`/`--mode ask`) before committing to a write-capable dispatch
- You want to run parallel AI tasks while the calling AI continues working
- Complex workflows benefit from structured, multi-stage generation and validation

---

## 2. GENERATE-REVIEW-FIX CYCLE

**The most reliable cross-AI pattern.** One AI generates, the other reviews, then the original fixes.

### Flow

```
Calling AI (plan) --> Cursor CLI (generate) --> Calling AI (review) --> Cursor CLI (fix)
```

### Implementation

```bash
# Step 1: Cursor generates the code
cursor-agent -p \
  "Create a rate limiter middleware for Express with sliding window algorithm. Output only the code, no explanation." \
  --model auto --auto-review --sandbox enabled --output-format text > /tmp/rate-limiter.ts

# Step 2: Calling AI reviews (done within the calling AI session)
# Read /tmp/rate-limiter.ts, identify issues, write review to /tmp/review.md

# Step 3: Cursor fixes based on review
cursor-agent -p \
  "In rate-limiter.ts, fix these issues: $(cat /tmp/review.md)" \
  --model auto --auto-review --sandbox enabled --output-format text > /tmp/rate-limiter-v2.ts
```

### When to Use

- Code generation tasks where a second perspective catches edge cases
- Composer-specific validation, when the task specifically wants Cursor's native model's opinion
- Architecture decisions that benefit from adversarial review

### Considerations

- Always validate the final output yourself (neither AI is infallible)
- Keep the review focused: bullet points of specific issues, not general feedback
- Limit to 2 fix cycles maximum; diminishing returns beyond that

---

## 3. JSON OUTPUT PROCESSING

**Extract structured data from Cursor for programmatic use in the calling AI's workflows.**

### Implementation

```bash
# --output-format json gives a structured envelope: {type, result, session_id, usage, ...}
cursor-agent -p \
  "Analyze src/auth.ts and return JSON with: {functions: [{name, params, returnType}], issues: [{line, severity, description}]}" \
  --model auto --sandbox enabled --output-format json > /tmp/envelope.json

# The model's own answer is in the .result field; parse that separately
jq -r '.result' /tmp/envelope.json > /tmp/analysis.json
jq '.issues[] | select(.severity == "high")' /tmp/analysis.json
```

### Output Notes

`--output-format json` wraps the envelope (`session_id`, `usage`, `request_id`) around the model's answer in `.result` — the model's own answer inside `.result` may still be plain text or a markdown-fenced JSON block, since Cursor has no separate schema-enforcement flag:

- The model may wrap its own JSON answer in a markdown code block (` ```json ... ``` `) inside `.result`
- Strip the code fence before parsing the inner content with `jq`/`JSON.parse`
- Use explicit prompt instructions: "Return only raw JSON with no explanation or code fences."

### When to Use

- Extracting metrics, function signatures, or dependency lists
- Feeding Cursor analysis into the calling AI's decision logic
- Building automated pipelines that branch on structured output, or that need the `session_id` for a later `--resume`

---

## 4. BACKGROUND EXECUTION

**Run Cursor tasks in parallel while the calling AI continues working.**

### Implementation

```bash
# Launch multiple Cursor tasks in background
cursor-agent -p "Review src/api/ for issues. Return JSON." \
  --model auto --sandbox enabled --output-format text > /tmp/review.txt 2>&1 &
PID1=$!

cursor-agent -p "Generate unit tests for src/utils.ts" \
  --model auto --auto-review --sandbox enabled --output-format text > /tmp/generated-tests.ts 2>&1 &
PID2=$!

# Calling AI continues other work...

# Wait for specific task
wait $PID1
echo "Review complete"
cat /tmp/review.txt | head -20

# Wait for all
wait $PID1 $PID2
echo "All Cursor tasks complete"
```

### Considerations

- Always redirect stderr: `2>&1` to capture errors alongside output
- Set reasonable timeouts: `timeout 120 cursor-agent -p ...` to prevent hung processes
- Do not background two write-capable dispatches that touch the same files (race conditions)
- Background read-only (`--mode ask`/`--mode plan`) tasks are safe to parallelize freely

### Silent Stdin Consumption When Dispatching in a `while read` Loop

The same class of bug that affects other backgrounded CLI dispatches applies here: when a dispatcher script iterates over lines of input with `while IFS= read -r line; do ... done < input.jsonl` and launches `cursor-agent -p ... &` inside the loop body, the backgrounded process can inherit the loop's stdin and race the `read` command for lines, silently dropping most dispatches.

```bash
# RISKY: cursor-agent may inherit the loop's stdin
while IFS= read -r line; do
  cursor-agent -p "$PROMPT" --model auto --sandbox enabled > "$LOG" 2>&1 &
  echo "$!" > "pid-$LINE_ID.pid"
done < input.jsonl

# SAFE: redirect cursor-agent stdin from /dev/null so the loop keeps its own
while IFS= read -r line; do
  cursor-agent -p "$PROMPT" --model auto --sandbox enabled > "$LOG" 2>&1 </dev/null &
  echo "$!" > "pid-$LINE_ID.pid"
done < input.jsonl
```

**Always pair `cursor-agent -p ... &` inside a read-loop with `</dev/null` on the redirection.** Live-verified: a `cursor-agent -p ... </dev/null` dispatch completes normally with no hang, confirming the redirection is safe and does not interfere with the CLI's own operation.

---

## 5. MODEL SELECTION STRATEGY

**Cursor CLI's roster spans Composer and dozens of hosted-provider ids. Choose based on task type.**

### Decision Matrix

| Task Type | Model choice | Rationale |
|-----------|-----------------|-----------|
| General delegation | `auto` (default) | Cursor's own router balances speed/cost/quality |
| Task specifically wants Cursor's own model | `composer-2.5` / `composer-2.5-fast` | Cursor-exclusive — no hosted-provider equivalent |
| Architecture / security analysis at high depth | A hosted-frontier `-xhigh`/`-high` id (e.g. `gpt-5.2-high`, `claude-opus-4-8-xhigh`) | Effort is baked into the id; pick a high-tier suffix |
| Code generation | `auto` or a `-medium` id | Balanced for most generation tasks |
| Trivial lookups | `auto` | The router already selects an appropriately fast model |

### Implementation

```bash
# General delegation — let the router decide
cursor-agent -p "Add error handling to auth.ts" --model auto --auto-review --sandbox enabled

# Composer-specific request
cursor-agent -p "Review this diff for correctness" --model composer-2.5 --sandbox enabled

# High-effort analysis — pick the tier via the id itself, not a flag
cursor-agent -p "Review the authentication architecture for security gaps" \
  --mode ask --model gpt-5.2-high

# NEVER: parameterized bracket syntax — rejected outright by the live CLI
# cursor-agent -p "..." --model 'gpt-5.2[effort=high]'   # "Cannot use this model"
```

### Why Explicit Model Specification Matters

- Omitting `--model` defaults to `auto`, which is fine for general delegation but not reproducible if Cursor's routing logic changes across CLI versions
- Explicit specification ensures reproducible behavior in scripts and CI/CD pipelines
- Query `cursor-agent --list-models` (requires authentication) for the current live roster before hardcoding an id in a script — the roster changes over time

---

## 6. APPROVAL AND SANDBOX STRATEGY

**Choose the least-permissive approval/sandbox combination that allows the task to succeed.**

### Decision Flow

```
Task type?
  |
  +-- Analysis / exploration / Q&A --> --mode ask or --mode plan (read-only regardless of approval flags)
  |
  +-- Code generation / refactoring --> default agent mode + --auto-review + --sandbox enabled
  |
  +-- Fully unattended run --> default agent mode + --force + --sandbox disabled
                                (explicit user approval required)
```

### Implementation by Task Type

```bash
# Analysis: read-only, no approval flags needed (mode itself is read-only)
cursor-agent -p "Identify all N+1 query patterns in src/" --mode ask --model auto

# Code generation: default agent + Smart Auto
cursor-agent -p "Add retry logic to all API calls in src/api/" \
  --model auto --auto-review --sandbox enabled

# Fully unattended: explicit user approval required beforehand
cursor-agent -p "Run the test suite and fix failures" \
  --model auto --force --sandbox disabled
```

### Combinations to Avoid

| Combination | Risk | Better Approach |
|-------------|------|-----------------|
| `--force --sandbox disabled` without explicit user approval | Unrestricted, unreviewed changes | Require explicit approval before this combination; default to `--auto-review` |
| Two write-capable dispatches backgrounded against the same files | Race condition | Use `--mode ask`/`--mode plan` for parallel background tasks |
| `--auto-review` for pure exploration | Unnecessary write capability | Use `--mode ask`/`--mode plan`; they are read-only regardless of approval flags |

---

## 7. CONTEXT ENRICHMENT

**Provide Cursor with rich context for better results.**

### Explicit Context Injection

```bash
# Inject the calling AI's analysis as context
ANALYSIS="The bug is in the token refresh logic. The refresh token
is not being rotated on use, allowing token replay attacks."

cursor-agent -p \
  "In src/auth/tokens.ts, fix this security issue. Context from prior analysis: $ANALYSIS" \
  --model auto --auto-review --sandbox enabled
```

### Project Rules (automatic, not opt-in)

Unlike sibling CLIs that need an explicit context file reference, Cursor CLI automatically reads `.cursor/rules`, `AGENTS.md`, `CLAUDE.md`, and legacy `.cursorrules` at the project root — a dispatched session in this repo already has `AGENTS.md` loaded without any extra flag. Do not duplicate that content in the delegation prompt.

### Spec-Folder Pre-Approval

```bash
cursor-agent -p \
  "Spec folder: specs/cli-external-orchestration/030-cli-cursor-creation (pre-approved, skip Gate 3). \
   Implement the change described in tasks.md T004." \
  --model auto --auto-review --sandbox enabled
```

---

## 8. VALIDATION PIPELINE

**Multi-stage validation of Cursor-generated output.**

### Implementation

```bash
# Stage 1: Generate
cursor-agent -p "Create a webhook handler for Stripe events" \
  --model auto --auto-review --sandbox enabled --output-format text > /tmp/webhook.ts

# Stage 2: Syntax check
npx tsc --noEmit /tmp/webhook.ts 2>/tmp/syntax-errors.txt
if [ $? -ne 0 ]; then
  cursor-agent -p \
    "In webhook.ts, fix these TypeScript errors: $(cat /tmp/syntax-errors.txt)" \
    --model auto --auto-review --sandbox enabled --output-format text > /tmp/webhook-fixed.ts
  cp /tmp/webhook-fixed.ts /tmp/webhook.ts
fi

# Stage 3: Read-only security scan (a different execution mode, not a different tool)
cursor-agent -p \
  "Audit webhook.ts for security issues. Focus on: input validation, injection, auth bypasses. Return JSON: {issues: [{severity, line, description, fix}]}" \
  --mode ask --model auto --output-format json > /tmp/security-scan.json

# Stage 4: Functional check (calling AI reviews the result)
```

### Pipeline Stages (Recommended Order)

| Stage | Purpose | Cursor invocation |
|-------|---------|--------------------|
| 1. Generate | Create initial artifact | `--model auto --auto-review --sandbox enabled` |
| 2. Syntax | Verify it compiles/parses | Language toolchain (tsc, eslint, etc.) |
| 3. Security | Check for vulnerabilities | `--mode ask` (read-only) |
| 4. Functional | Verify correctness | Calling AI review or tests |

---

## 9. CROSS-VALIDATION WITH OTHER CLI EXECUTORS

**Use Cursor and a sibling CLI to validate each other's work, leveraging different strengths.**

### Strength Comparison for Task Routing

| Strength Area | Cursor CLI | Codex CLI | Claude Code CLI |
|---------------|-----------|-----------|-------------------|
| Native model | Composer (`composer-2.5`) | — | — |
| Model roster breadth | Widest (dozens of ids across providers) | 4 GPT ids | Anthropic-focused |
| Read-only exploration mode | `--mode ask`/`--mode plan` | `--sandbox read-only` | `--permission-mode plan` |
| Native worktree isolation | Yes (`-w`), unique to Cursor | No | No |
| Cloud remote execution | Yes (`worker`), unique to Cursor | No | No |
| Web search | Not documented as a CLI flag | `--search` | Built-in tool |

### Cross-Validation Strategies

| Strategy | Flow | Best For |
|----------|------|----------|
| **Adversarial review** | A generates, B critiques | Security-critical code |
| **Composer opinion** | Sibling generates, Cursor's Composer reviews | When a genuinely different model family's perspective is wanted |
| **Specialist routing** | Route by strength (table above) | Efficiency optimization |

---

## 10. ANTI-PATTERNS

**What NOT to do when orchestrating Cursor CLI from the calling AI.**

### 1. Trusting the Exit Code

```bash
# BAD: exit code is always 0, even on auth failure
if cursor-agent -p "..." --model auto --sandbox enabled; then
  echo "Success"  # This runs even when the dispatch never reached a model
fi

# GOOD: inspect output text
OUTPUT=$(cursor-agent -p "..." --model auto --sandbox enabled 2>&1)
if echo "$OUTPUT" | grep -qi "Authentication required"; then
  echo "Auth failed"
else
  echo "$OUTPUT"
fi
```

### 2. Using --force --sandbox disabled Without Approval

```bash
# BAD: unrestricted access with no human checkpoint
cursor-agent -p "Migrate the database" --model auto --force --sandbox disabled

# GOOD: require explicit user approval before this combination
```

### 3. Assuming the Bracket Syntax Works for Reasoning Effort

```bash
# BAD: rejected outright by the live CLI
cursor-agent -p "..." --model 'gpt-5.2[effort=high]'

# GOOD: pick the exact effort-suffixed id
cursor-agent -p "..." --model gpt-5.2-high
```

### 4. Ignoring the Shared Editor Config Surface

```bash
# BAD: assuming a clean, isolated session
cursor-agent -p "..." --model auto --sandbox enabled
# This silently inherits the operator's ~/.cursor/hooks.json, mcp.json, and rules.

# GOOD: read shared-editor-config.md and account for the shared surface explicitly
# before dispatching in an automated/unattended context.
```

### 5. Backgrounding cursor-agent Inside Shell Scripts Called by Another AI

```bash
# BAD: & inside the shell command — orchestrator sees instant exit 0
cursor-agent -p "Deep review all phases" --force --sandbox disabled > /tmp/result.txt 2>&1 &
echo "PID: $!"
# The Bash tool reports "completed" in <2 seconds. cursor-agent is still running.

# GOOD: no & — use the orchestrator's own background mechanism instead
# In Claude Code: Bash(command="cursor-agent -p ...", run_in_background=true)
cursor-agent -p "Deep review all phases" --force --sandbox disabled > /tmp/result.txt 2>&1
```
