---
description: Planning workflow (7 steps) - spec through plan only, no implementation. Supports :auto and :confirm modes
argument-hint: "<feature-description> [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED or ⏭️ N/A.**

**Round-trip optimization:** This workflow requires 2-3 user interactions (down from 4).

---

## 🔒 PHASE 1: INPUT COLLECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

├─ IF $ARGUMENTS is empty, undefined, or whitespace-only (ignoring :auto/:confirm flags):
│   │
│   ├─ ASK user: "What feature would you like to plan?"
│   ├─ WAIT for user response (DO NOT PROCEED)
│   ├─ Store response as: feature_description
│   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2
│
└─ IF $ARGUMENTS contains content:
    ├─ Store as: feature_description
    └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2

**STOP HERE** - Wait for user to provide the feature description before continuing.

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer features from context, screenshots, or conversation history
```

**Phase 1 Output:** `feature_description = ________________`

---

## 🔒 PHASE 2: CONSOLIDATED SETUP (Spec Folder + Execution Mode)

**⚠️ FIRST MESSAGE PROTOCOL**: This phase MUST be your FIRST response if the command is invoked. No analysis, no tool calls - ask the consolidated question immediately, then wait.

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 1 PASSES:

1. CHECK for mode suffix in command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, still ask Q1)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, still ask Q1)
   └─ No suffix → execution_mode = "ASK" (include Q2 in consolidated prompt)

2. Search for related spec folders:
   $ ls -d specs/*/ 2>/dev/null | tail -10

3. ASK user with CONSOLIDATED prompt (bundle applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **1. Spec Folder** (required):                                 │
   │    A) Use existing: [suggest if related found]                 │
   │    B) Create new spec folder                                   │
   │    C) Update related spec: [if partial match found]            │
   │    D) Skip documentation                                       │
   │                                                                │
   │ **2. Execution Mode** (if no :auto/:confirm suffix):             │
   │    A) Autonomous - Execute all steps without approval          │
   │    B) Interactive - Pause at each step for approval            │
   │                                                                │
   │ Reply with choices, e.g.: "B, A" or "A" (if mode pre-set)      │
   └────────────────────────────────────────────────────────────────┘

4. WAIT for user response (DO NOT PROCEED)

5. Parse response and store results:
   - spec_choice = [A/B/C/D] (first answer)
   - spec_path = [path or null if D]
   - execution_mode = [AUTONOMOUS/INTERACTIVE] (from suffix or second answer)

6. SET STATUS: ✅ PASSED (Stateless - no .spec-active file created)

**STOP HERE** - Wait for user to select A/B/C/D and execution mode before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create spec folders without user confirmation
⛔ NEVER auto-select execution mode without suffix or explicit choice
```

**Phase 2 Output:** `spec_choice = ___` | `spec_path = ________________` | `execution_mode = ________________`

---

## 🔒 PHASE 3: MEMORY CONTEXT LOADING (Conditional)

**STATUS: ☐ BLOCKED / ☐ N/A**

```
EXECUTE AFTER PHASE 2 PASSES:

CHECK spec_choice value from Phase 2:

├─ IF spec_choice == D (Skip):
│   └─ SET STATUS: ⏭️ N/A (no spec folder, no memory)
│
├─ IF spec_choice == B (Create new):
│   └─ SET STATUS: ⏭️ N/A (new folder has no memory)
│
└─ IF spec_choice == A or C (Use existing):
    │
    ├─ Check: Does spec_path/memory/ exist AND contain files?
    │
    ├─ IF memory/ is empty or missing:
    │   └─ SET STATUS: ⏭️ N/A (no memory to load)
    │
    └─ IF memory/ has files:
        │
        ├─ ASK user:
        │   ┌────────────────────────────────────────────────────┐
        │   │ "Load previous context from this spec folder?"     │
        │   │                                                    │
        │   │ A) Load most recent memory file (quick refresh)     │
        │   │ B) Load all recent files, up to 3 (comprehensive)   │
        │   │ C) List all files and select specific                │
        │   │ D) Skip (start fresh, no context)                  │
        │   └────────────────────────────────────────────────────┘
        │
        ├─ WAIT for user response
        ├─ Execute loading based on choice (use Read tool)
        ├─ Acknowledge loaded context briefly
        └─ SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to select memory loading option before continuing.

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED or ⏭️ N/A
```

**Phase 3 Output:** `memory_loaded = [yes/no]` | `context_summary = ________________`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                      | REQUIRED STATUS   | YOUR STATUS | OUTPUT VALUE                                  |
| -------------------------- | ----------------- | ----------- | --------------------------------------------- |
| PHASE 1: INPUT             | ✅ PASSED          | ______      | feature_description: ______                   |
| PHASE 2: SETUP (Spec+Mode) | ✅ PASSED          | ______      | spec_choice: ___ / spec_path: ___ / mode: ___ |
| PHASE 3: MEMORY            | ✅ PASSED or ⏭️ N/A | ______      | memory_loaded: ______                         |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED or ⏭️ N/A?
│   ├─ YES → Proceed to "# SpecKit Plan" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all phases passed
- Proceeded without asking user for feature description (Phase 1)
- Asked spec folder and execution mode as SEPARATE questions instead of consolidated (Phase 2)
- Auto-created or assumed a spec folder without A/B/C/D choice (Phase 2)
- Skipped memory prompt when using existing folder with memory files (Phase 3)
- Inferred feature from context instead of explicit user input
- Auto-selected execution mode without suffix or explicit user choice

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue current action
2. STATE: "I violated PHASE [X] by [specific action]. Correcting now."
3. RETURN to the violated phase
4. COMPLETE the phase properly (ask user, wait for response)
5. RESUME only after all phases pass verification
```

> **Cross-reference**: These mandatory phases implement AGENTS.md Section 2 "Gate 3: Spec Folder Question" and "First Message Protocol". The canonical gate definitions are in AGENTS.md.

---

# SpecKit Plan

Execute the SpecKit planning lifecycle from specification through planning. Terminates after creating plan.md - use `/spec_kit:implement` for implementation phase.

---

```yaml
role: Expert Developer using Smart SpecKit for Planning Phase
purpose: Spec-driven planning with mandatory compliance and stakeholder review support
action: Run planning workflow from specification through technical plan creation

operating_mode:
  workflow: sequential
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: step_by_step_for_confirm_mode
  tracking: progressive_artifact_creation
  validation: consistency_check_before_handoff
```

---

## 1. 🎯 PURPOSE

Run the planning workflow: specification, clarification, and technical planning. Creates spec.md, plan.md, and checklists without proceeding to implementation. Use when planning needs review before coding.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Feature description with optional parameters (branch, scope, context)
**Outputs:** Spec folder with planning artifacts:
- spec.md ✓
- plan.md ✓
- checklist.md (Level 2+ only) ✓
- memory/*.md ✓

> **⚠️ Level 1 Note:** The /spec_kit:plan command creates spec.md and plan.md but NOT tasks.md. For complete Level 1 baseline documentation, either:
> - A) Run /spec_kit:implement after planning to create tasks.md
> - B) Run /spec_kit:complete instead for full workflow
> 
> Level 1 baseline (spec.md + plan.md + tasks.md) is only complete after implementation planning.

### User Input

```text
$ARGUMENTS
```

---

## 3. 📊 WORKFLOW OVERVIEW (7 STEPS)

| Step | Name             | Purpose                      | Outputs                  |
| ---- | ---------------- | ---------------------------- | ------------------------ |
| 1    | Request Analysis | Analyze inputs, define scope | requirement_summary      |
| 2    | Pre-Work Review  | Review AGENTS.md, standards  | coding_standards_summary |
| 3    | Specification    | Create spec.md               | spec.md                  |
| 4    | Clarification    | Resolve ambiguities          | updated spec.md          |
| 5    | Planning         | Create technical plan        | plan.md, checklist.md    |
| 6    | Save Context     | Save conversation context    | memory/*.md              |
| 7    | Handover Check   | Prompt for session handover  | handover.md (optional)   |

---

## 4. ⚡ INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_plan_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_plan_confirm.yaml`

The YAML contains detailed step-by-step workflow, field extraction rules, completion report format, and all configuration.

---

## 5. 📌 REFERENCE

**Full details in YAML prompts:**
- Workflow steps and activities
- Field extraction rules
- Documentation levels (1/2/3)
- Templates used
- Completion report format
- Mode behaviors (auto/confirm)
- Parallel dispatch configuration
- Checklist creation guidelines
- Failure recovery procedures

**See also:** AGENTS.md Sections 2-4 for memory loading, confidence framework, and request analysis.

---

## 6. 🔀 PARALLEL DISPATCH

This workflow supports smart parallel sub-agent dispatch for eligible phases using a 5-dimension complexity scoring algorithm.

### Complexity Scoring Algorithm (5 Dimensions)

| Dimension            | Weight | Scoring                                |
| -------------------- | ------ | -------------------------------------- |
| Domain Count         | 35%    | 1=0.0, 2=0.5, 3+=1.0                   |
| File Count           | 25%    | 1-2=0.0, 3-5=0.5, 6+=1.0               |
| LOC Estimate         | 15%    | <50=0.0, 50-200=0.5, >200=1.0          |
| Parallel Opportunity | 20%    | sequential=0.0, some=0.5, high=1.0     |
| Task Type            | 5%     | trivial=0.0, moderate=0.5, complex=1.0 |

### Decision Thresholds

- **<20%**: Proceed directly (no parallel agents)
- **≥20% + 2 domains**: ALWAYS ask user before parallel dispatch

### Planning Step: 4-Agent Parallel Exploration (Automatic)

The Planning step automatically dispatches 4 Sonnet agents in parallel via the Task tool:

1. **Architecture Explorer** - Project structure, entry points, component connections
2. **Feature Explorer** - Similar features, related patterns
3. **Dependency Explorer** - Imports, modules, affected areas
4. **Test Explorer** - Test patterns, testing infrastructure

After agents return, hypotheses are verified by reading identified files and building a complete mental model.

### Eligible Phases (Plan Workflow)

- Step 3: Specification
- Step 5: Planning (includes automatic 4-agent exploration)

### Override Phrases

- **Direct**: "proceed directly", "handle directly", "skip parallel"
- **Parallel**: "use parallel", "dispatch agents", "parallelize"
- **Auto-decide**: "auto-decide", "auto mode", "decide for me" (1 hour session preference)

---

## 7. 🔀 KEY DIFFERENCES FROM /SPEC_KIT:COMPLETE

- **Terminates after planning** - Does not include task breakdown, analysis, or implementation
- **Next step guidance** - Recommends `/spec_kit:implement` when ready to build
- **Use case** - Planning phase separation, stakeholder review, feasibility analysis

---

## 8. 🔍 EXAMPLES

**Example 1: Simple Planning (autonomous)**
```
/spec_kit:plan:auto Add dark mode toggle to the settings page
```

**Example 2: Complex Planning (interactive)**
```
/spec_kit:plan:confirm Redesign the checkout flow with multi-step form and payment integration
```

**Example 3: With Context**
```
/spec_kit:plan "Build analytics dashboard" tech stack: React, Chart.js, existing API
```

---

## 9. 🔗 COMMAND CHAIN

This command is part of the SpecKit workflow:

```
[/spec_kit:research] → /spec_kit:plan → [/spec_kit:implement]
```

**Explicit next step:**
→ `/spec_kit:implement [spec-folder-path]`

---

## 10. 🔜 WHAT NEXT?

After planning completes, suggest relevant next steps:

| Condition                             | Suggested Command                        | Reason                           |
| ------------------------------------- | ---------------------------------------- | -------------------------------- |
| Planning complete, ready to implement | `/spec_kit:implement [spec-folder-path]` | Continue to implementation phase |
| Need stakeholder review first         | Share `plan.md` for review               | Get approval before coding       |
| Technical uncertainty exists          | `/spec_kit:research [topic]`             | Investigate before committing    |
| Need to pause work                    | `/spec_kit:handover [spec-folder-path]`  | Save context for later           |
| Want to save context                  | `/memory:save [spec-folder-path]`        | Preserve decisions and findings  |

**ALWAYS** end with: "What would you like to do next?"
