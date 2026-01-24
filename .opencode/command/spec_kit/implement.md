---
description: Implementation workflow (9 steps) - execute pre-planned work. Requires existing plan.md. Supports :auto and :confirm modes
argument-hint: "<spec-folder> [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

## ⛔ GATE 3 COMPLIANCE

This command involves FILE MODIFICATIONS. Per AGENTS.md Section 2, Gate 3 MUST be satisfied before implementation.

**First Message Protocol:** If this command is invoked as the user's FIRST message requesting file modifications, the consolidated setup prompt is your FIRST response. No analysis first, no tool calls first.

**Failure Pattern #5 Warning (Skip Process):**
> "I already know this" - Triggers: "straightforward", "comprehensive", "fix all", "15 agents"
> Even exciting implementation requests MUST complete the unified setup phase.

**Self-Verification:** Before proceeding to workflow:
> □ STOP. File modification detected? Did I ask the consolidated setup prompt? If NO → Ask NOW.

---

# 🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

**This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.**

**Round-trip optimization:** This workflow requires only 1 user interaction (all questions asked together).

---

## 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q2)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q2)
   └─ No suffix → execution_mode = "ASK" (include Q2 in prompt)

2. CHECK if $ARGUMENTS contains a spec folder path:
   ├─ IF $ARGUMENTS has a path → spec_folder_input = $ARGUMENTS
   └─ IF $ARGUMENTS is empty → include Q0 with available folders

3. Search for available spec folders with plan.md:
   $ ls -d specs/*/ 2>/dev/null | tail -10
   Check each for: spec.md, plan.md (required), checklist.md (optional)

4. IF spec_folder_input provided, validate prerequisites:
   $ ls -la [spec_folder_input]/
   - spec.md (REQUIRED)
   - plan.md (REQUIRED)
   - tasks.md (will create if missing)
   - checklist.md (REQUIRED for Level 2+)

5. Check if memory/ exists and has files for the spec folder

6. ASK user with SINGLE CONSOLIDATED prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Spec Folder** (if not provided in command):              │
   │    Available folders with plan.md:                             │
   │    [list folders with status indicators]                       │
   │    Enter folder path or number:                                │
   │                                                                │
   │ **Q1. Confirm Spec Folder** (if path provided):                 │
   │    Folder: [spec_folder_input]                                 │
   │    ├─ spec.md [✓/✗]                                            │
   │    ├─ plan.md [✓/✗]                                            │
   │    └─ checklist.md [✓/✗/optional]                              │
   │                                                                │
   │    A) Yes, implement this spec folder                          │
   │    B) No, select a different spec folder                       │
   │    C) Cancel - I need to plan first                             │
   │                                                                │
   │ **Q2. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Autonomous - Execute all 9 steps without approval        │
   │    B) Interactive - Pause at each step for approval            │
   │                                                                │
   │ **Q3. Dispatch Mode** (required):                              │
   │    A) Single Agent - Execute with one agent (Recommended)      │
   │    B) Multi-Agent (1+2) - 1 orchestrator (opus) + 2 workers (opus) │
   │    C) Multi-Agent (1+3) - 1 orchestrator (opus) + 3 workers (opus) │
   │                                                                │
   │ **Q4. Worker Model** (if B or C selected above):               │
   │    Default: opus                                               │
   │    To use different model, type: opus, gemini, gpt             │
   │    for default                                                 │
   │                                                                │
   │ **Q5. Memory Context** (if memory/ has files):                  │
   │    A) Load most recent memory file                              │
   │    B) Load all recent files, up to 3                            │
   │    C) Skip (start fresh)                                       │
   │                                                                │
   │ Reply with answers, e.g.: "A, A, A, , B" or "specs/007-auth/, A, A, gemini, B" │
   └────────────────────────────────────────────────────────────────┘

7. WAIT for user response (DO NOT PROCEED)

8. Parse response and store ALL results:
   - spec_path = [from Q0/Q1 or $ARGUMENTS]
   - confirm_choice = [A/B/C from Q1]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q2]
   - dispatch_mode = [single/multi_small/multi_large from Q3]
   - worker_model = [from Q4: opus/gemini/gpt, default opus if blank]
   - memory_choice = [A/B/C from Q5, or N/A if no memory files]

9. Handle redirects if needed:
   - IF confirm_choice == B → Re-prompt with folder selection only
   - IF confirm_choice == C → Redirect to /spec_kit:plan

10. Execute background operations based on choices:
    - IF memory_choice == A: Load most recent memory file
    - IF memory_choice == B: Load up to 3 recent memory files
    - IF dispatch_mode is multi_*: Note parallel dispatch will be used

11. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER assume spec folder is correct without user confirmation
⛔ NEVER auto-select execution mode without suffix or explicit choice
⛔ NEVER split these questions into multiple prompts
```

**Phase Output:**
- `spec_path = ________________`
- `prerequisites_valid = ________________`
- `execution_mode = ________________`
- `dispatch_mode = ________________`
- `worker_model = ________________` (default: opus)
- `memory_loaded = ________________`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD               | REQUIRED      | YOUR VALUE | SOURCE                |
| ------------------- | ------------- | ---------- | --------------------- |
| spec_path           | ✅ Yes         | ______     | Q0/Q1 or $ARGUMENTS   |
| prerequisites_valid | ✅ Yes         | ______     | Validation check      |
| execution_mode      | ✅ Yes         | ______     | Suffix or Q2          |
| dispatch_mode       | ✅ Yes         | ______     | Q3                    |
| worker_model        | ○ Conditional | ______     | Q4 (default: opus)    |
| memory_loaded       | ○ Conditional | ______     | Q5 (if memory exists) |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "# SpecKit Implement" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all fields are set
- Asked questions in MULTIPLE separate prompts instead of ONE consolidated prompt
- Started implementation without validating spec folder has required files
- Auto-selected dispatch mode without explicit user choice
- Inferred spec folder from .spec-active or context instead of explicit user input
- Auto-selected execution mode without suffix or explicit user choice

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue current action
2. STATE: "I asked questions separately instead of consolidated. Correcting now."
3. PRESENT the single consolidated prompt with ALL applicable questions
4. WAIT for user response
5. RESUME only after all fields are set
```

---

# SpecKit Implement

Execute implementation of a pre-planned feature. Requires existing spec.md and plan.md from a prior `/spec_kit:plan` workflow.

> **Note**: This is a standalone workflow (9 steps) that assumes spec.md and plan.md already exist.
> Run `/spec_kit:plan` first if you need to create planning artifacts.

---

```yaml
role: Expert Developer using Smart SpecKit for Implementation Phase
purpose: Execute pre-planned feature implementation with mandatory checklist verification
action: Run 9-step implementation workflow from plan review through completion summary

operating_mode:
  workflow: sequential_9_step
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: step_by_step_for_confirm_mode
  tracking: progressive_task_completion
  validation: checklist_verification_with_evidence
```

---

## 1. 🎯 PURPOSE

Run the 9-step implementation workflow: plan review, task breakdown, quality validation, development, completion summary, and handover check. Picks up where `/spec_kit:plan` left off to execute the actual code changes.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Spec folder path (REQUIRED) with optional parameters (environment, constraints)
**Outputs:** Completed implementation + implementation-summary.md + optional handover.md + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

### Prerequisites

**REQUIRED** (Level 1 baseline - all levels):
- `spec.md` - Feature specification
- `plan.md` - Technical plan
- `tasks.md` - Task breakdown (will be created if missing)

**REQUIRED for Level 2+:**
- `checklist.md` - Validation checklist (MANDATORY for verification before completion claims)

If prerequisites are missing, guide user to run `/spec_kit:plan` first.

---

## 3. 📊 WORKFLOW OVERVIEW

| Step | Name                   | Purpose                                                            | Outputs                   |
| ---- | ---------------------- | ------------------------------------------------------------------ | ------------------------- |
| 1    | Review Plan & Spec     | Understand requirements                                            | requirements_summary      |
| 2    | Task Breakdown         | Create/validate tasks.md                                           | tasks.md                  |
| 3    | Analysis               | Verify consistency                                                 | consistency_report        |
| 4    | Quality Checklist      | Validate checklists (ACTIVELY USED for verification at completion) | checklist_status          |
| 5    | Implementation Check   | Verify prerequisites                                               | greenlight                |
| 5.5  | **PREFLIGHT Capture**  | Capture epistemic baseline for learning measurement                | preflight_baseline        |
| 6    | Development            | Execute implementation                                             | code changes              |
| 7    | Completion             | Generate summary (MANDATORY for Level 2+)                          | implementation-summary.md |
| 7.5  | **POSTFLIGHT Capture** | Capture learning delta and calculate improvement                   | postflight_delta          |
| 8    | Save Context           | Preserve conversation                                              | memory/*.md               |
| 9    | Session Handover Check | Prompt for handover document                                       | handover.md (optional)    |

---

## 4. ⚡ INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml`

The YAML contains detailed step-by-step workflow, field extraction rules, completion report format, and all configuration.

---

## 5. 📊 OUTPUT FORMATS

### Success Output
```
✅ SpecKit Implementation Complete

All 9 implementation steps executed successfully.

Artifacts Created:
- tasks.md (task breakdown with all items marked [x])
- implementation-summary.md (completion summary)
- memory/*.md (session context)

STATUS=OK PATH=[spec-folder-path]
```

### Failure Output
```
❌ SpecKit Implementation Failed

Error: [error description]
Step: [step number where failure occurred]

STATUS=FAIL ERROR="[message]"
```

---

## 6. 📌 REFERENCE

**Full details in YAML prompts:**
- Workflow steps and activities
- Field extraction rules
- Documentation levels (1/2/3)
- Templates used
- Completion report format
- Mode behaviors (auto/confirm)
- Parallel dispatch configuration
- Checklist verification protocol
- Failure recovery procedures

**See also:** AGENTS.md Sections 2-4 for memory loading, confidence framework, and request analysis.

---

## 7. 🔀 PARALLEL DISPATCH

The implement workflow supports parallel agent dispatch for complex phases. This is configured in the YAML prompts.

### Complexity Scoring Algorithm (5 dimensions)

| Dimension            | Weight | Scoring                                |
| -------------------- | ------ | -------------------------------------- |
| Domain Count         | 35%    | 1=0.0, 2=0.5, 3+=1.0                   |
| File Count           | 25%    | 1-2=0.0, 3-5=0.5, 6+=1.0               |
| LOC Estimate         | 15%    | <50=0.0, 50-200=0.5, >200=1.0          |
| Parallel Opportunity | 20%    | sequential=0.0, some=0.5, high=1.0     |
| Task Type            | 5%     | trivial=0.0, moderate=0.5, complex=1.0 |

### Decision Thresholds

- **<20%**: Proceed directly (no parallel agents)
- **≥20% + 2 domains**: ALWAYS ask user before dispatch

### Eligible Phases

- `step_6_development` - Main implementation phase

### User Override Phrases

- `"proceed directly"` / `"handle directly"` → Skip parallel dispatch
- `"use parallel"` / `"dispatch agents"` → Force parallel dispatch
- `"auto-decide"` → Enable session auto-mode (1 hour)

---

## 8. 🤖 AGENT ROUTING

This command routes Step 11 (Checklist Verification) to the specialized `@review` agent when available.

| Step                             | Agent     | Fallback  | Purpose                                           |
| -------------------------------- | --------- | --------- | ------------------------------------------------- |
| Step 7 (Completion/Verification) | `@review` | `general` | P0/P1 checklist verification with quality scoring |

### How Agent Routing Works

1. **Detection**: When Step 7 (Completion) is reached, the system checks if `@review` agent is available
2. **Dispatch**: If available, dispatches to `@review` agent with spec path and checklist
3. **Fallback**: If agent unavailable, falls back to `subagent_type: "general-purpose"` (Claude Code) or `"general"` (OpenCode) with warning
4. **Output**: Agent returns structured verification result with P0/P1 status and quality score

### Agent Dispatch Template

```
Task tool with prompt:
---
You are the @review agent. Verify implementation completeness.

Spec Folder: {spec_path}
Checklist: {spec_path}/checklist.md

Execute:
1. Load checklist.md
2. Verify ALL P0 items are [x] with evidence
3. Verify ALL P1 items are [x] or have deferral approval
4. Score against quality rubric (100-point scale)

Return:
- P0 status: [PASS/FAIL]
- P1 status: [PASS/PARTIAL/FAIL]
- Quality score: [0-100]
- Blocking issues: [list]
---
```

### Blocking Behavior

**IMPORTANT**: The `@review` agent routing uses `blocking: true`:
- If P0 status is FAIL, workflow **CANNOT** proceed to completion claims
- Clear message shows which P0 items are incomplete
- User must address P0 items before claiming "done"

### Fallback Behavior

When `@review` agent is unavailable:
- Warning message: "Review agent unavailable, using general dispatch"
- Workflow continues with `subagent_type: "general-purpose"` (Claude Code) or `"general"` (OpenCode)
- Same verification executed, may have less rigorous scoring

---

## 9. ✅ QUALITY GATES

Quality gates enforce minimum standards at key workflow transitions.

### Gate Configuration

| Gate                | Location                 | Threshold | Blocking          |
| ------------------- | ------------------------ | --------- | ----------------- |
| Pre-Implementation  | Before Step 6            | 70        | Yes               |
| Mid-Implementation  | After Step 6.5           | 65        | No (warning only) |
| Post-Implementation | Before Step 7 completion | 70        | Yes               |

### Gate Behavior

**Pre-Implementation Gate (Step 5 → Step 6)**
- Evaluates: Prerequisites complete, plan clarity, task breakdown quality
- Score < 70: BLOCK - Cannot start development
- Score ≥ 70: PASS - Proceed to development

**Mid-Implementation Gate (Step 6.5)**
- Evaluates: Code quality, test coverage, task completion rate
- Score < 65: WARNING - Log concern, continue with caution
- Score ≥ 65: PASS - Continue normally

**Post-Implementation Gate (Step 7)**
- Evaluates: All tasks complete, tests pass, checklist verified
- Score < 70: BLOCK - Cannot claim completion
- Score ≥ 70: PASS - Generate implementation-summary.md

**IMPORTANT: @review Agent Blocking**

The `@review` agent routing (Section 8) provides **additional blocking** beyond quality gates:
- Quality gates check score thresholds (numeric)
- `@review` agent checks P0/P1 checklist items (categorical)
- BOTH must pass for completion claims
- `@review` blocking is separate from circuit breaker behavior

### Gate Check Lists

**Pre-Implementation Checklist:**
- [ ] spec.md exists and is complete
- [ ] plan.md exists with clear technical approach
- [ ] tasks.md exists with actionable items
- [ ] checklist.md exists (Level 2+)
- [ ] No unresolved P0 blockers

**Post-Implementation Checklist:**
- [ ] All tasks marked [x] in tasks.md
- [ ] All P0 checklist items verified with evidence
- [ ] All P1 items complete or deferred with approval
- [ ] Tests pass (if applicable)
- [ ] implementation-summary.md created

---

## 10. 🚀 PREFLIGHT BASELINE CAPTURE (Step 5.5)

**Purpose:** Capture epistemic baseline for learning measurement before implementation begins.

### When to Execute

- **Execute:** After Step 5 (Implementation Check) passes, before Step 6 (Development) begins
- **Skip if:** Quick fix (<10 LOC) or continuation of prior session with existing PREFLIGHT

### PREFLIGHT Action Protocol

1. **Assess Knowledge Level (0-100):**
   - What do I already know about this task?
   - Which files/code am I already familiar with?
   - Have I worked on similar implementations before?

2. **Assess Uncertainty Level (0-100):**
   - What don't I know that I need to know?
   - Are there architectural unknowns?
   - Are there external dependencies I'm unsure about?

3. **Assess Context Completeness (0-100):**
   - Is the spec.md clear and complete?
   - Do I have all dependencies identified?
   - Is the plan.md actionable?

### Recording PREFLIGHT

**Option A - MCP Tool (Recommended):**
```
Call task_preflight() with:
- specFolder: [spec-folder-path]
- taskId: [task-identifier, e.g., "T1" or "implementation"]
- knowledgeScore: [0-100]
- uncertaintyScore: [0-100]
- contextScore: [0-100]
- knowledgeGaps: [optional list of identified gaps]
```

**Option B - Implementation Log:**
If MCP tool unavailable, record in implementation log or scratch/:
```markdown
## PREFLIGHT Baseline - [timestamp]
- Knowledge: [score]/100 - [brief rationale]
- Uncertainty: [score]/100 - [brief rationale]
- Context: [score]/100 - [brief rationale]
```

### Skip Conditions

User can say:
- `"skip preflight"` → Proceed directly to Step 6
- `"quick fix"` → Auto-skip if LOC < 10
- `"continuation"` → Auto-skip if prior session PREFLIGHT exists

---

## 11. 📊 POSTFLIGHT LEARNING DELTA (Step 7.5)

**Purpose:** Capture learning measurement and calculate improvement after implementation completes.

### When to Execute

- **Execute:** After Step 7 (Completion) verification passes, before Step 8 (Save Context)
- **Skip if:** Quick fix (<10 LOC) or no PREFLIGHT was captured

### POSTFLIGHT Action Protocol

1. **Re-assess Knowledge Level (0-100):**
   - What did I learn during implementation?
   - Which files/patterns do I now understand better?
   - What insights emerged from the work?

2. **Re-assess Uncertainty Level (0-100):**
   - What uncertainties were resolved?
   - What new uncertainties emerged?
   - Are there follow-up questions?

3. **Re-assess Context Completeness (0-100):**
   - How did my understanding evolve?
   - Were there gaps in the spec/plan?
   - What context would help future sessions?

4. **List Learning Artifacts:**
   - Gaps closed during implementation
   - New gaps discovered
   - Patterns learned
   - Decisions made and rationale

### Recording POSTFLIGHT

**Option A - MCP Tool (Recommended):**
```
Call task_postflight() with:
- specFolder: [spec-folder-path]
- taskId: [task-identifier, must match preflight]
- knowledgeScore: [0-100]
- uncertaintyScore: [0-100]
- contextScore: [0-100]
- gapsClosed: [list of resolved uncertainties]
- newGapsDiscovered: [list of new questions/unknowns]
```

**Option B - Implementation Log:**
If MCP tool unavailable, record in implementation log or memory/:
```markdown
## POSTFLIGHT Delta - [timestamp]
- Knowledge: [score]/100 (delta: +/-[change])
- Uncertainty: [score]/100 (delta: +/-[change])
- Context: [score]/100 (delta: +/-[change])
- Gaps Closed: [list]
- Gaps Discovered: [list]
```

### Learning Index Calculation

The Learning Index is calculated automatically when both PREFLIGHT and POSTFLIGHT are captured:

```
Learning Index = (Knowledge Delta × 0.4) + (Uncertainty Reduction × 0.35) + (Context Improvement × 0.25)

Where (all scores on 0-100 scale):
- Knowledge Delta = POSTFLIGHT.knowledge - PREFLIGHT.knowledge
- Uncertainty Reduction = PREFLIGHT.uncertainty - POSTFLIGHT.uncertainty (positive = good)
- Context Improvement = POSTFLIGHT.context - PREFLIGHT.context
```

**Interpretation (0-100 scale):**
- **40+**: Significant learning session
- **15-40**: Moderate learning
- **5-15**: Incremental learning
- **<5**: Execution-focused (low learning, not necessarily bad)
- **Negative**: Knowledge regression detected (may indicate scope expansion)

### Skip Conditions

User can say:
- `"skip postflight"` → Proceed directly to Step 8
- `"quick fix"` → Auto-skip if LOC < 10

### Reference Documents

For detailed epistemic measurement theory, see:
- `.opencode/skill/system-spec-kit/references/memory/epistemic-vectors.md` - Full epistemic measurement framework
- `.opencode/skill/system-spec-kit/references/validation/five-checks.md` - Five validation checks including learning measurement

---

## 12. 🔌 CIRCUIT BREAKER

The circuit breaker isolates failing operations to prevent cascading failures.

### States

| State     | Condition               | Behavior                                 |
| --------- | ----------------------- | ---------------------------------------- |
| CLOSED    | Normal operation        | All operations proceed                   |
| OPEN      | 3+ consecutive failures | Operations fail-fast, skip affected step |
| HALF-OPEN | After cooldown (30s)    | Single test operation allowed            |

### Configuration

| Parameter         | Value | Description                                |
| ----------------- | ----- | ------------------------------------------ |
| failure_threshold | 3     | Failures before OPEN state                 |
| cooldown_seconds  | 30    | Time before HALF-OPEN                      |
| success_to_close  | 1     | Successes in HALF-OPEN to return to CLOSED |

### Behavior by Step

- **Steps 1-5**: Circuit breaker active - failures trigger state changes
- **Step 6**: Per-task circuit breaker - isolates failing tasks
- **Step 7**: Critical step - circuit breaker disabled (must complete or fail explicitly)
- **Steps 8-9**: Circuit breaker active - non-critical, can skip on OPEN

### Recovery Actions

When circuit opens:
1. Log failure pattern and affected step
2. Skip to next non-dependent step if possible
3. Report to user with options:
   - A) Retry after cooldown
   - B) Skip affected step
   - C) Abort workflow

**NOTE: @review Agent Blocking vs Circuit Breaker**

These are SEPARATE mechanisms:
- **Circuit breaker**: Handles operational failures (errors, timeouts, crashes)
- **@review blocking**: Handles quality failures (incomplete P0 items)

A workflow can have:
- Circuit CLOSED + @review BLOCKED = Quality issue, not operational issue
- Circuit OPEN + @review PASS = Operational issue, quality was fine
- Both mechanisms must be satisfied for successful completion

---

## 13. 🔀 KEY DIFFERENCES FROM /SPEC_KIT:COMPLETE

- **Requires existing plan** - Won't create spec.md or plan.md
- **Starts at implementation** - Skips specification and planning phases
- **Use case** - Separated planning/implementation, team handoffs, phased delivery

---

## 14. ✅ VALIDATION DURING IMPLEMENTATION

Validation runs automatically to catch issues early.

Key rules for implementation phase:
- **PLACEHOLDER_FILLED** - Replace all `[PLACEHOLDER]` markers
- **PRIORITY_TAGS** - Add P0/P1/P2 to checklist items
- **EVIDENCE_CITED** - Add `[SOURCE:]` citations for claims

---

## 15. 🔍 EXAMPLES

**Example 1: Execute Existing Plan (autonomous)**
```
/spec_kit:implement:auto specs/042-user-auth/
```

**Example 2: With Review (interactive)**
```
/spec_kit:implement:confirm specs/042-user-auth/
```

**Example 3: With Staging Environment**
```
/spec_kit:implement "specs/042-user-auth/" staging: https://staging.example.com
```

---

## 16. 🔗 COMMAND CHAIN

This command is part of the SpecKit workflow:

```
[/spec_kit:plan] → /spec_kit:implement → [/spec_kit:handover]
```

**Prerequisite:**
← `/spec_kit:plan [feature-description]` (creates spec.md, plan.md)

---

## 17. 📌 NEXT STEPS

After implementation completes, suggest relevant next steps:

| Condition                 | Suggested Command                          | Reason                            |
| ------------------------- | ------------------------------------------ | --------------------------------- |
| Implementation complete   | Verify in browser                          | Test functionality works          |
| Need to save progress     | `/memory:save [spec-folder-path]`          | Preserve implementation context   |
| Ending session            | `/spec_kit:handover [spec-folder-path]`    | Create continuation document      |
| Found bugs during testing | `/spec_kit:debug [spec-folder-path]`       | Delegate debugging to fresh agent |
| Ready for next feature    | `/spec_kit:complete [feature-description]` | Start new workflow                |

**ALWAYS** end with: "What would you like to do next?"