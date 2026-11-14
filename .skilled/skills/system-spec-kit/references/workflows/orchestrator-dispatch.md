---
title: Orchestrator Dispatch Aids
description: Decomposition aids, output-review tables and the context and tool-call budgets the orchestrator agent applies when it plans and collects delegated work.
trigger_phrases:
  - "orchestrator dispatch aids"
  - "pre-delegation reasoning"
  - "delegation eligibility gate"
  - "tool call budget"
  - "context window budget"
  - "collection patterns"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Orchestrator Dispatch Aids

Open this when the orchestrator agent plans a dispatch, sizes a split, or chooses how results come back.

---

## 1. OVERVIEW

### Purpose

The orchestrator's definition keeps its rules and a one-line pointer to each aid here, so the definition stays short enough to load whole.

### When to Use

- Writing the Pre-Delegation Reasoning block or estimating complexity before a dispatch
- Deciding whether to split work, how many agents to run, and in what waves
- Choosing a collection pattern for 5 or more agents
- Reviewing a returned output against the verification actions and scoring dimensions

### Core Principle

The rules stay in `.skilled/agents/orchestrate.md`. This file holds the tables and worked aids those rules point to.

### Boundaries

- **In scope**: decomposition aids, the context window and tool call budgets, the output-review tables and the command suggestions.
- **Out of scope**: dispatch headers, result envelopes, handoff and pre-execution fields, which `agent-io-contract.md` owns.

A bare section number inside the moved text, such as §2, §6, §7 or §9, names a section of `.skilled/agents/orchestrate.md`, not of this file.

---

## 2. DECOMPOSITION AIDS

### Pre-Delegation Reasoning (PDR)

**MANDATORY** before EVERY sub-agent dispatch:

```
PRE-DELEGATION REASONING [Task #N]:
├─ Intent: [What does this task accomplish?]
├─ Complexity: [low/medium/high] → Because: [cite criteria below]
├─ Agent: @[agent] → Because: [cite §2 (Agent Routing)]
├─ Agent Def: [read | read + included (general-purpose only) | built-in | prior-session] → [.skilled/agents/<name>.md]
├─ Depth: [N] → Tier: [ORCHESTRATOR|LEAF] (§2 NDP)
├─ Parallel: [Yes/No] → Because: [data dependency]
├─ Risk: [Low/Medium/High] → [If High: fallback agent]
├─ Scoped Gates: [A debug handoff? B boundary contract? C pre-mortem?]
└─ TCB: [N] tool calls → [Single agent | Split: M × ~K calls] (mandatory for file I/O tasks)
```

**Rules:**
- Maximum 5 lines (no bloat)
- Must cite §2 (Agent Routing)
- High risk requires fallback agent specification

### Complexity Estimation

**MANDATORY**: Estimate before dispatching. Agents use this to calibrate their process depth.

| Complexity | Criteria                                                        | Agent Behavior                                              |
| ---------- | --------------------------------------------------------------- | ----------------------------------------------------------- |
| **low**    | Single file, < 50 LOC, no dependencies, well-understood pattern | FAST PATH: Skip ceremony, minimal tool calls, direct output |
| **medium** | 2-5 files, 50-300 LOC, some dependencies, standard patterns     | Normal workflow with all steps                              |
| **high**   | 6+ files, 300+ LOC, cross-cutting concerns, novel patterns      | Full process with PDR, verification, evidence               |

**Quick heuristic:** If you can describe the task in one sentence AND the agent needs ≤3 tool calls → `low`.

**CWB Fields (MANDATORY for 5+ agent dispatches):**
- **Output Size**: Controls how much the agent returns directly. See §9 Scale Thresholds.
- **Write To**: File path where the agent writes detailed findings. Required for Pattern C (§9).

### Delegation Eligibility Gate (DEG)

Run DEG before splitting work into multiple agents:

| Condition                                            | Action                                                |
| ---------------------------------------------------- | ----------------------------------------------------- |
| Estimated tool calls <= 8 and domain count <= 2      | Keep single-agent execution                           |
| Candidate sub-task < 4 tool calls                    | Merge into adjacent task (do not dispatch separately) |
| Shared files/objective across tasks                  | Prefer one agent with sequential sub-steps            |
| 3+ independent streams each >= 6 calls or >= 2 files | Multi-agent dispatch allowed                          |

If DEG does not clearly justify splitting, stay in direct-first mode.

### Parallel vs Sequential Dispatch

**DEFAULT TO FOCUSED EXECUTION**. Prefer single-agent execution first; use parallel dispatch only when independent workstreams are substantial.
- **NO Dependency + Small Scope:** Keep one agent and bundle related operations
- **NO Dependency + Substantial Scope:** Use parallel dispatch (typically 2 agents)
- **YES Dependency:** Run sequentially (e.g., "Research Pattern" → "Implement Pattern")

**BIAS FOR FOCUS**: When uncertain, use fewer agents with broader scope.

**DEFAULT PARALLEL CEILING: 2 agents maximum** unless the user explicitly requests more or DEG criteria justify expansion.

**CWB CEILING** (§9): Parallel-first applies **within each wave**, not across all agents. When expansion is required for 10+ agents, dispatch in waves of 5: each wave runs in parallel, but waves execute sequentially with synthesis between waves.

| Agent Count | Parallel Behavior                                                      |
| ----------- | ---------------------------------------------------------------------- |
| 1-2         | Full parallel, no restrictions **(DEFAULT CEILING)**                   |
| 3-6         | Requires explicit DEG justification; prefer concise returns            |
| 7-12        | Requires user override. Parallel within waves of 5, sequential between |

### Sub-Orchestrator Pattern (Disabled)

Sub-orchestrator fan-out is disabled here because nested dispatch is illegal. When work is large, keep orchestration at depth 0 and run additional waves directly from the top-level orchestrator.

---

## 3. CONDITIONAL BRANCHING AND EXAMPLE

### Conditional Branching

Enable result-dependent task routing. Add a `Branch` field to the task format:

```
└─ Branch:
    └─ IF output.confidence >= 80 THEN proceed to Task #(N+1)
       ELSE dispatch Task #(N+1-alt) with enhanced context
```

| Type           | Options                                                                                                                           |
| -------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| **Conditions** | `output.confidence` (0-100), `output.type` ("success"/"error"/"partial"), `output.status`, `output.score` (0-100), `output.count` |
| **Actions**    | `proceed to Task #N`, `dispatch Task #N-alt`, `escalate to user`, `retry with [modifications]`                                    |

Maximum conditional branch nesting: 3 levels deep. If deeper needed, refactor into separate tasks. (This is about IF/ELSE branch depth, not agent dispatch depth; see §2 NDP for agent nesting rules.)

### Example Decomposition

**User Request:** "Add a notification system, but first find out how we do toasts currently"

```
TASK #1: Explore Toast Patterns
├─ Scope: Find existing toast/notification implementations
├─ Agent: @context
├─ Skills: Glob, Grep, Read
├─ Output: Pattern findings with file locations
├─ Success: Pattern identified and cited
└─ Depends: none

TASK #2: Implement Notification System
├─ Scope: Build new system using patterns from Task #1
├─ Agent: @code
├─ Skills: sk-code
├─ Output: Functional notification system
├─ Success: Works in browser, tests pass
└─ Depends: Task #1
```

---

## 4. CONTEXT HEALTH AND COMMAND SUGGESTIONS

### Context Health Signals

#### Context Health Monitoring

| Signal               | Threshold       | Action                                             |
| -------------------- | --------------- | -------------------------------------------------- |
| Tool calls           | 15+             | Suggest handover                                   |
| Files modified       | 5+              | Recommend context save                             |
| Retry Ladder escalation | §7         | Offer `@debug`                                     |
| Session duration     | Extended        | Proactive handover prompt                          |
| **Agent dispatches** | **5+**          | **Enforce CWB (§9), use collection patterns (§9)** |
| **Context pressure** | **Any warning** | **Stop dispatching, synthesize current results**   |

### Command Suggestions

**Proactively suggest commands when conditions match:**

| Condition                              | Suggest              | Reason                                 |
| -------------------------------------- | -------------------- | -------------------------------------- |
| Sub-agent stuck 3+ times on same error | Surface prompted offer; user dispatches `@debug` via the runtime's delegation tool | Fresh perspective debugging (user-invoked) |
| Session ending or user says "stopping" | `/speckit:save`       | Preserve canonical continuity          |
| Need formal research before planning   | `/deep:research` | Autonomous iterative research loop  |
| Claiming task completion               | `/speckit:complete` | Verification workflow with checklist   |
| Need to save important context         | `/speckit:save`       | Preserve decisions and findings        |
| Resuming prior work (known spec)       | `/speckit:resume`   | Recover via `handover.md` -> `_memory.continuity` -> spec docs |
| Resuming interrupted work (unknown)    | `/speckit:resume`   | Auto-detect the packet, then follow the same canonical recovery order |
| Need retrieval over spec or skill docs | `/speckit:search`    | Lexical retrieval: trigger index plus ripgrep |

---

## 5. CONTEXT WINDOW BUDGET

### Context Window Budget (CWB)

#### Scale Thresholds & Collection Patterns

| Agent Count | Task Example                | Collection    | Output Constraint                       | Wave Size   | Est. Return |
| ----------- | --------------------------- | ------------- | --------------------------------------- | ----------- | ----------- |
| **1-3**     | Fact-finding, analysis      | A: Direct     | Full results (up to 8K each)            | All at once | ~2-4K/agent |
| **5-9**     | Complex research            | B: Summary    | Max 30 lines / ~500 tokens per agent    | All at once | ~500/agent  |
| **10-20**   | Comprehensive investigation | C: File-based | 3-line summary; details written to file | Waves of 5  | ~50/agent   |

**Pre-Dispatch (MANDATORY for 5+ agents):** Count agents → look up collection mode → add Output Size + Write To constraints to every dispatch (§4).

#### Collection Pattern Details

- **Pattern A (1-3):** Standard parallel dispatch. Collect full results directly and synthesize.
- **Pattern B (5-9):** Instruct each agent: "Return ONLY: (1) 3 key findings, (2) file paths found, (3) issues detected." Dispatch follow-up for deeper detail.
- **Pattern C (10-20):** Write-capable agents write to `[spec-folder]/scratch/agent-N-[topic].md` and return a 3-line summary. Read-only leaves (`@context`, `@review`, `@prompt-improver`) return their summary instead, and the orchestrator writes it to the scratch file. Between waves of 5, compress findings into running synthesis (~500 tokens) before next wave.

#### CWB Enforcement Points

| Step                | Check                                 | Action if Violated                        |
| ------------------- | ------------------------------------- | ----------------------------------------- |
| Step 5 (CWB CHECK)  | Agent count exceeds 4?                | Switch to summary-only or file-based mode |
| Step 6 (DELEGATE)   | Dispatch includes output constraints? | HALT - add constraints before dispatching |

---

## 6. TOOL CALL BUDGET

### Tool Call Budget (TCB)

#### Estimation Heuristic

| Operation         | Tool Calls | Example                     |
| ----------------- | ---------- | --------------------------- |
| File read         | 1          | `Read("src/app.ts")`        |
| File write/create | 1          | `Write("output.md")`        |
| File edit         | 1          | `Edit("config.json")`       |
| Bash command      | 1          | `Bash("npm test")`          |
| Grep search       | 1          | `Grep("pattern")`           |
| Glob search       | 1          | `Glob("**/*.md")`           |
| Verification step | 1-2        | Read + diff                 |
| **Buffer**        | **+30%**   | Navigation, retries, errors |

**Formula:** `TCB = (reads + writes + edits + bash + grep + glob + verification) × 1.3`

#### Thresholds

| Est. Tool Calls | Status       | Action                                          |
| --------------- | ------------ | ----------------------------------------------- |
| **1-8**         | ✅ SAFE       | Single agent, no restrictions                   |
| **9-12**        | ⚠️ CAUTION    | Single agent OK, but add Self-Governance Footer |
| **13+**         | 🚫 MUST SPLIT | Split so each part fits the target agent's `Tool Calls` budget, or 12 calls when it states none |

#### Batch Sizing Rule

When a task involves **N repetitive operations** on different files (e.g., "convert 8 files", "update 10 configs"):

| Items | Agents           | Items per Agent | Dispatch            |
| ----- | ---------------- | --------------- | ------------------- |
| 1-4   | 1                | All             | Single agent        |
| 5-8   | 2                | 2-4 each        | Parallel            |
| 9-12  | 3                | 3-4 each        | Parallel            |
| 13+   | N/4 (rounded up) | ~4 each         | Parallel waves of 3 |

---

## 7. OUTPUT REVIEW AIDS

### Verification Actions (Execute BEFORE accepting output)

| Action                   | Tool/Method              | Purpose                               |
| ------------------------ | ------------------------ | ------------------------------------- |
| **File Existence Check** | `@context` dispatch      | Verify claimed files exist            |
| **Content Spot-Check**   | Read key files           | Validate quality, detect placeholders |
| **Cross-Reference**      | Compare parallel outputs | Detect contradictions                 |
| **Path Validation**      | `@context` dispatch      | Confirm references are real           |
| **Evidence Audit**       | Check citations          | Ensure sources exist and are cited    |

### Scoring Dimensions (100 points total)

| Dimension        | Weight | Criteria                                  |
| ---------------- | ------ | ----------------------------------------- |
| **Accuracy**     | 40%    | Requirements met, edge cases handled      |
| **Completeness** | 35%    | All deliverables present, format followed |
| **Consistency**  | 25%    | Pattern adherence, style consistency      |

The score is advisory. It never decides accept, retry or escalate.

---

## 8. RESOURCE BUDGETS

### Resource Budgeting

| Task Type      | Token Limit | Time Limit | Overage Action           |
| -------------- | ----------- | ---------- | ------------------------ |
| Research       | 8K tokens   | 5 min      | Summarize and continue   |
| Implementation | 15K tokens  | 10 min     | Checkpoint and split     |
| Verification   | 4K tokens   | 3 min      | Skip verbose output      |
| Documentation  | 6K tokens   | 5 min      | Use concise template     |
| Review         | 5K tokens   | 4 min      | Focus on critical issues |

**Rule**: Before dispatching 5+ agents, estimate `agent_count × result_size_per_agent`. When that is large, use file-based collection (Pattern C above).

---

## 9. RELATED RESOURCES

- [orchestrate.md](../../../../agents/orchestrate.md) - The orchestrator's rules, which point to each aid here
- [agent-io-contract.md](./agent-io-contract.md) - Dispatch headers, result envelopes, handoff and pre-execution fields
- [parallel-dispatch-config.md](../../assets/parallel-dispatch-config.md) - Complexity scoring for parallel dispatch in spec-kit workflows
