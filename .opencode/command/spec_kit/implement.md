---
description: Implementation workflow (9 steps) - execute pre-planned work. Requires existing plan.md. Supports :auto and :confirm modes
argument-hint: "<spec-folder> [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task, memory_context, memory_search
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Determine execution mode from user input (`:auto` or `:confirm`)
> 2. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `spec_kit_implement_auto.yaml`
>    - Confirm mode → `spec_kit_implement_confirm.yaml`
> 3. Execute the YAML workflow step by step
>
> All content below is reference context for the YAML workflow. Do not treat reference sections, routing tables, or dispatch templates as direct instructions to execute.

# SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

---

## 0. 📋 UNIFIED SETUP PHASE

**STATUS: BLOCKED**

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix:
   - ":auto" -> execution_mode = "AUTONOMOUS" (omit Q2)
   - ":confirm" -> execution_mode = "INTERACTIVE" (omit Q2)
   - No suffix -> execution_mode = "ASK" (include Q2)

2. CHECK $ARGUMENTS for spec folder path:
   - IF has path -> spec_folder_input = $ARGUMENTS
   - IF empty -> include Q0 with available folders

3. Search for available spec folders with plan.md:
   $ ls -d specs/*/ 2>/dev/null | tail -10
   Check each for: spec.md, plan.md (required), checklist.md (optional)

4. IF spec_folder_input provided, validate prerequisites:
   - spec.md (REQUIRED), plan.md (REQUIRED)
   - tasks.md (create if missing), checklist.md (REQUIRED Level 2+)

5. CHECK for prior incomplete sessions:
   - Search memory/ for incomplete markers, unchecked tasks in tasks.md
   - IF found -> Show warning with options:
     A) Resume from where left off  B) Restart (archives prior)  C) Cancel

6. Check if memory/ exists with files for spec folder

7. ASK user (include only applicable questions):

   Q0. Spec Folder (if not provided):
      Available folders with plan.md: [list with status]
      Enter folder path or number

   Q1. Confirm Spec Folder (if path provided):
      Folder: [path] | spec.md [Y/N] | plan.md [Y/N] | checklist.md [Y/N/optional]
      A) Yes, implement  B) Different folder  C) Cancel (plan first)

   Q2. Execution Mode (if no suffix):
      A) Autonomous - all 9 steps without approval
      B) Interactive - pause at each step

   Q3. Dispatch Mode (required):
      A) Single Agent (Recommended)
      B) Multi-Agent (1+2)
      C) Multi-Agent (1+3)

   Q4. Memory Context (if memory/ has files):
      A) Load most recent  B) Load up to 3 recent  C) Skip (fresh start)

   Reply with answers, e.g.: "A, A, A, B" or "specs/007-auth/, A, A, B"

8. WAIT for user response (DO NOT PROCEED)

9. Parse and store:
   - spec_path, confirm_choice, execution_mode, dispatch_mode, memory_choice

10. Handle redirects:
    - confirm_choice == B -> Re-prompt folder selection
    - confirm_choice == C -> Redirect to /spec_kit:plan

11. Execute background operations:
    - memory_choice A: load most recent | B: load up to 3 | multi_*: note parallel dispatch

12. SET STATUS: PASSED

HARD STOP: DO NOT proceed until user answers
NEVER assume spec folder without confirmation
NEVER auto-select execution mode without suffix or explicit choice
NEVER split into multiple prompts
```

**Phase Output:**
- `spec_path` | `prerequisites_valid` | `execution_mode` | `dispatch_mode` | `memory_loaded`

> **Cross-reference**: Implements AGENTS.md Section 2 "Gate 3: Spec Folder Question" and "First Message Protocol".

---

# SpecKit Implement

Execute implementation of a pre-planned feature. Requires existing spec.md and plan.md from a prior `/spec_kit:plan` workflow.

> Standalone workflow (9 steps) that assumes spec.md and plan.md exist. Run `/spec_kit:plan` first if needed.

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

Run the 9-step implementation workflow: plan review, task breakdown, quality validation, development, completion summary, and handover check. Picks up where `/spec_kit:plan` left off.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` -- Spec folder path (REQUIRED) with optional parameters
**Outputs:** Completed implementation + implementation-summary.md + optional handover.md + `STATUS=<OK|FAIL|CANCELLED>`

### Prerequisites

**REQUIRED (all levels):** spec.md, plan.md, tasks.md (created if missing)
**REQUIRED Level 2+:** checklist.md

Missing prerequisites -> guide user to `/spec_kit:plan` first.

---

## 3. 📊 WORKFLOW OVERVIEW

| Step | Name                   | Purpose                                       | Outputs                   |
| ---- | ---------------------- | --------------------------------------------- | ------------------------- |
| 1    | Review Plan & Spec     | Understand requirements                       | requirements_summary      |
| 2    | Task Breakdown         | Create/validate tasks.md (via @speckit)        | tasks.md                  |
| 3    | Analysis               | Verify consistency                            | consistency_report        |
| 4    | Quality Checklist      | Validate checklists (used at completion)      | checklist_status          |
| 5    | Implementation Check   | Verify prerequisites                          | greenlight                |
| 5.5  | PREFLIGHT Capture      | Epistemic baseline for learning measurement   | preflight_baseline        |
| 6    | Development            | Execute implementation                        | code changes              |
| 7    | Completion             | Generate summary (via @speckit)               | implementation-summary.md |
| 7.5  | POSTFLIGHT Capture     | Learning delta and improvement calculation    | postflight_delta          |
| 8    | Save Context           | Preserve conversation                         | memory/*.md               |
| 9    | Session Handover Check | Prompt for handover document                  | handover.md (optional)    |

**Execute steps IN ORDER. Mark each ONLY after completing ALL activities. DO NOT SKIP.**

### Step 8: Save Context Protocol

**MANDATORY** via generate-context.js (per AGENTS.md Memory Save Rule):
```
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]
```
DO NOT use Write/Edit for memory files directly. After script, call `memory_save({ filePath })` for MCP availability.

### Memory Context Loading

Use `memory_context()` (L1 unified entry) as primary retrieval. Use `memory_search()` (L2) only as fallback for direct parameter control.

---

## 4. ⚡ INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml`

The YAML contains detailed step-by-step workflow, field extraction rules, completion report format, and all configuration.

---

## 5. 📊 OUTPUT FORMATS

### Success
```
SpecKit Implementation Complete - All 9 steps executed.
Artifacts: tasks.md, implementation-summary.md, memory/*.md
STATUS=OK PATH=[spec-folder-path]
```

### Failure
```
SpecKit Implementation Failed
Error: [description] | Step: [number]
STATUS=FAIL ERROR="[message]"
```

---

## 6. 📌 REFERENCE

**Full details in YAML prompts:** Workflow steps, field extraction, doc levels (1/2/3), templates, completion report, mode behaviors, parallel dispatch, checklist verification, failure recovery.

**See also:** AGENTS.md Sections 2-6 for memory loading, confidence framework, request analysis.

---

## 7. 🔧 PARALLEL DISPATCH

Supports parallel agent dispatch for complex phases (configured in YAML prompts).

### Complexity Scoring (5 dimensions)

| Dimension            | Weight | Scoring                              |
| -------------------- | ------ | ------------------------------------ |
| Domain Count         | 35%    | 1=0.0, 2=0.5, 3+=1.0                |
| File Count           | 25%    | 1-2=0.0, 3-5=0.5, 6+=1.0           |
| LOC Estimate         | 15%    | <50=0.0, 50-200=0.5, >200=1.0       |
| Parallel Opportunity | 20%    | sequential=0.0, some=0.5, high=1.0  |
| Task Type            | 5%     | trivial=0.0, moderate=0.5, complex=1.0|

### Thresholds

- **<20%**: Proceed directly | **>=20% + 2 domains**: ALWAYS ask user
- Eligible phase: `step_6_development`
- Override: `"proceed directly"` / `"use parallel"` / `"auto-decide"` (1hr session mode)

### Workstream Prefixes

`[W:IMPL-N]` implementation | `[W:TEST]` tests | `[W:DOCS]` documentation

---

## 8. 🔀 AGENT ROUTING

| Step                                         | Agent      | Fallback  | Purpose                                            |
| -------------------------------------------- | ---------- | --------- | -------------------------------------------------- |
| Step 7 (Verification)                        | `@review`  | `general` | Pre-Commit code review + P0/P1 gate validation (blocking) |
| Step 7 (implementation-summary.md)           | `@speckit` | `general` | Spec folder doc creation (AGENTS.md exclusive)     |
| Step 2/6 (substantive tasks.md)              | `@speckit` | `general` | New task content in spec folder                    |
| Step 6 (Development, 3+ failures)            | `@debug`   | `general` | Fresh-perspective debugging (4-phase methodology)  |
| Step 9 (Session Handover)                    | `@handover`| `general` | Session continuation document creation             |

> Minor status updates (checkbox toggles) may use `@general`. Only substantive creation requires `@speckit`.

### @review Dispatch Template (Dual-Phase)

**Phase A — Pre-Commit Code Review (Mode 2, non-blocking):**
```
You are the @review agent (Mode 2: Pre-Commit). Review code changes for quality.
Spec Folder: {spec_path} | Tasks: {spec_path}/tasks.md
Execute: Review code changes -> Check patterns/standards -> Flag issues
Return: Code quality assessment, issues found, recommendations
```

**Phase B — Gate Validation (Mode 4, blocking):**
```
You are the @review agent (Mode 4: Gate Validation). Verify implementation completeness.
Spec Folder: {spec_path} | Checklist: {spec_path}/checklist.md
Execute: Load checklist -> Verify P0 [x] with evidence -> Verify P1 -> Score (100-point)
Return: P0 status, P1 status, Quality score, Blocking issues
```

### @speckit Dispatch Template
```
You are the @speckit agent. Create implementation-summary.md.
Spec Folder: {spec_path} | Level: {documentation_level} | Tasks: {spec_path}/tasks.md
Create using template-first approach. Return: file confirmation + validation status.
```

### @debug Dispatch Template
```
You are the @debug agent. Follow your 4-phase debugging methodology.
Spec Folder: {spec_path} | Task: {current_task_id}
Error: {error_message} | Files: {affected_files} | Prior Attempts: {previous_attempts}
Execute: OBSERVE -> ANALYZE -> HYPOTHESIZE -> FIX
Return: Root cause, proposed fix, verification steps (Success/Blocked/Escalation)
```

### @handover Dispatch Template
```
You are the @handover agent. Create a session continuation document.
Spec Folder: {spec_path} | Workflow: implement | Step: 9
Context: Implementation complete, user opted for handover.
Create: handover.md with current state, pending items, and continuation guidance.
```

### Step 6 Debug Integration

Track `failure_count` per task during Step 6 (reset for each new task in tasks.md):

IF failure_count >= 3:
- Suggest to user: A) Dispatch @debug agent B) Continue manually (reset count) C) Skip task D) Pause workflow

IF debug triggered: Store current_task_id, dispatch @debug via Task tool (subagent_type: "debug"), display checkpoint (root cause, fix status, progress). User responds: Y (retry) / n (pause) / review (debug findings). <!-- REFERENCE: Activated by YAML workflow step, not directly -->

### Blocking Behavior

`@review` Phase B uses `blocking: true`: P0 FAIL -> workflow CANNOT proceed to completion claims. Phase A is advisory (non-blocking).

### Fallback

When `@speckit` unavailable: Warning logged, continues with `subagent_type: "general"`, less template validation.
When `@debug` unavailable: Falls back to `subagent_type: "general-purpose"`, same 4-phase methodology attempted.
When `@handover` unavailable: Falls back to `subagent_type: "general"`, handover.md creation with less template validation.

---

## 9. ✅ QUALITY GATES

| Gate                | Location        | Threshold | Blocking          |
| ------------------- | --------------- | --------- | ----------------- |
| Pre-Implementation  | Before Step 6   | 70        | Yes               |
| Mid-Implementation  | After Step 6.5  | 70        | No (warning only) |
| Post-Implementation | Before Step 7   | 70        | Yes               |

**Pre-Implementation:** spec.md complete, plan.md clear, tasks.md actionable, checklist.md exists (L2+), no P0 blockers.
**Post-Implementation:** All tasks [x], all P0 verified with evidence, P1 complete/deferred, tests pass, summary created.

### Evidence Log Pattern

`[E:filename]` for artifacts in `evidence/` (permanent) or `scratch/` (temporary).
Example: `[E:evidence/test-output.log]` or `[EVIDENCE: hero.js:45-67 verified]`

---

## 10. 📊 PREFLIGHT BASELINE (Step 5.5)

Capture epistemic baseline before implementation. Execute after Step 5, before Step 6. Skip for quick fixes (<10 LOC) or continuation with existing PREFLIGHT.

```
task_preflight(): specFolder, taskId, knowledgeScore[0-100], uncertaintyScore[0-100],
                  contextScore[0-100], knowledgeGaps[optional]
```

Skip: `"skip preflight"`, `"quick fix"` (auto if LOC<10), `"continuation"` (auto if prior exists)

---

## 11. 📊 POSTFLIGHT LEARNING (Step 7.5)

Capture learning delta after implementation. Execute after Step 7, before Step 8. Skip if no PREFLIGHT captured.

```
task_postflight(): specFolder, taskId (must match), knowledgeScore[0-100],
                   uncertaintyScore[0-100], contextScore[0-100],
                   gapsClosed[list], newGapsDiscovered[list]
```

**Learning Index** = (Knowledge Delta x 0.4) + (Uncertainty Reduction x 0.35) + (Context Improvement x 0.25)
Interpretation: 40+ significant, 15-40 moderate, 5-15 incremental, <5 execution-focused, negative = regression.

Reference: `.opencode/skill/system-spec-kit/references/memory/epistemic-vectors.md`

---

## 12. 📌 KEY DIFFERENCES FROM /SPEC_KIT:COMPLETE

- Requires existing plan (won't create spec.md/plan.md)
- Starts at implementation (skips specification/planning)
- Use case: separated planning/implementation, team handoffs, phased delivery

---

## 13. ✅ VALIDATION DURING IMPLEMENTATION

Runs automatically: **PLACEHOLDER_FILLED** (replace `[PLACEHOLDER]`), **PRIORITY_TAGS** (P0/P1/P2), **EVIDENCE_CITED** (`[SOURCE:]` citations).

---

## 14. 🔍 EXAMPLES

```
/spec_kit:implement:auto specs/042-user-auth/       # Autonomous mode
/spec_kit:implement:confirm specs/042-user-auth/    # Interactive mode
```

---

## 15. 🔗 COMMAND CHAIN

```
[/spec_kit:plan] -> /spec_kit:implement -> [/spec_kit:handover]
```

Prerequisite: `/spec_kit:plan [feature-description]` (creates spec.md, plan.md)

---

## 16. 📌 NEXT STEPS

| Condition                 | Suggested Command                          | Reason                          |
| ------------------------- | ------------------------------------------ | ------------------------------- |
| Implementation complete   | Verify in browser                          | Test functionality              |
| Need to save progress     | `/memory:save [spec-folder-path]`          | Preserve context                |
| Ending session            | `/spec_kit:handover [spec-folder-path]`    | Create continuation document    |
| Found bugs during testing | `/spec_kit:debug [spec-folder-path]`       | Delegate to fresh agent         |
| Ready for next feature    | `/spec_kit:complete [feature-description]` | Start new workflow              |
| Need crash recovery       | `/memory:continue`                         | Session recovery                |

**ALWAYS** end with: "What would you like to do next?"
