---
description: Implementation workflow (9 steps) - execute pre-planned work. Requires existing plan.md. Supports :auto and :confirm modes
argument-hint: "<spec-folder> [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

## ⛔ GATE 3 COMPLIANCE

This command involves FILE MODIFICATIONS. Per AGENTS.md Section 2, Gate 3 MUST be satisfied before implementation.

**Standard Gate 3 Question Format:**
> **Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

**First Message Protocol:** If this command is invoked as the user's FIRST message requesting file modifications, the spec folder question is your FIRST response. No analysis first, no tool calls first.

**Failure Pattern #5 Warning (Skip Process):**
> "I already know this" - Triggers: "straightforward", "comprehensive", "fix all", "15 agents"
> Even exciting implementation requests MUST complete Phase 1-3 blocking gates.

**Self-Verification:** Before proceeding to workflow:
> □ STOP. File modification detected? Did I ask spec folder question? If NO → Ask NOW.

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
│   ├─ Search for available spec folders with plan.md:
│   │   $ ls -d specs/*/ 2>/dev/null | tail -10
│   │
│   ├─ ASK user: "Which spec folder would you like to implement?"
│   │   Present found folders with plan.md status
│   ├─ WAIT for user response (DO NOT PROCEED)
│   ├─ Store response as: spec_folder_input
│   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2
│
└─ IF $ARGUMENTS contains a spec folder path:
    ├─ Store as: spec_folder_input
    └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2

**STOP HERE** - Wait for user to specify or select a spec folder before continuing.

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer spec folder from context, .spec-active, or conversation history
```

**Phase 1 Output:** `spec_folder_input = ________________`

---

## 🔒 PHASE 2: CONSOLIDATED SETUP (Validation + Execution Mode)

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 1 PASSES:

1. Validate spec_folder_input exists and has required files:
   $ ls -la [spec_folder_input]/

   Check for:
   - spec.md (REQUIRED)
   - plan.md (REQUIRED)
   - tasks.md (will create if missing)
   - checklist.md (REQUIRED for Level 2+)

2. IF required files missing:
   ├─ INFORM user: "Missing required files: [list]"
   ├─ ASK: "Run /spec_kit:plan first, or select different folder?"
   │   - A) Run /spec_kit:plan to create planning artifacts
   │   - B) Select a different spec folder
   └─ WAIT and redirect accordingly

3. CHECK for mode suffix in command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, still ask Q1)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, still ask Q1)
   └─ No suffix → execution_mode = "ASK" (include Q2 in consolidated prompt)

4. IF files exist, ASK user with CONSOLIDATED prompt:

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **1. Confirm Spec Folder** (required):                          │
   │    Folder: [spec_folder_input]                                 │
   │    ├─ spec.md ✓                                                │
   │    ├─ plan.md ✓                                                │
   │    └─ [other files status]                                      │
   │                                                                │
   │    A) Yes, implement this spec folder                          │
   │    B) No, select a different spec folder                       │
   │    C) Cancel - I need to plan first                             │
   │                                                                │
   │ **2. Execution Mode** (if no :auto/:confirm suffix):             │
   │    A) Autonomous - Execute all 9 steps without approval        │
   │    B) Interactive - Pause at each step for approval            │
   │                                                                │
   │ Reply with choices, e.g.: "A, A" or "A" (if mode pre-set)      │
   └────────────────────────────────────────────────────────────────┘

5. WAIT for user response (DO NOT PROCEED)

6. Parse response:
   ├─ IF user selects B or C for Q1 → redirect accordingly
   └─ IF user selects A for Q1 → store and continue

7. Store results:
   - spec_path = [confirmed path]
   - prerequisites_valid = yes
   - execution_mode = [AUTONOMOUS/INTERACTIVE] (from suffix or Q2 answer)

8. SET STATUS: ✅ PASSED (Stateless - no .spec-active file created)

**STOP HERE** - Wait for user to confirm spec folder and select execution mode before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly confirms
⛔ NEVER assume spec folder is correct without validation
⛔ NEVER auto-select execution mode without suffix or explicit choice
```

**Phase 2 Output:** `spec_path = ________________` | `prerequisites_valid = [yes/no]` | `execution_mode = ________________`

---

## 🔒 PHASE 3: MEMORY CONTEXT LOADING (Conditional)

**STATUS: ☐ BLOCKED / ☐ N/A**

```
EXECUTE AFTER PHASE 2 PASSES:

1. Check: Does spec_path/memory/ exist AND contain files?

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

| PHASE                       | REQUIRED STATUS   | YOUR STATUS | OUTPUT VALUE                            |
| --------------------------- | ----------------- | ----------- | --------------------------------------- |
| PHASE 1: INPUT              | ✅ PASSED          | ______      | spec_folder_input: ______               |
| PHASE 2: SETUP (Valid+Mode) | ✅ PASSED          | ______      | spec_path: ___ / valid: ___ / mode: ___ |
| PHASE 3: MEMORY             | ✅ PASSED or ⏭️ N/A | ______      | memory_loaded: ______                   |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED or ⏭️ N/A?
│   ├─ YES → Proceed to "# SpecKit Implement" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all phases passed
- Proceeded without asking user for spec folder (Phase 1)
- Asked validation confirmation and execution mode as SEPARATE questions instead of consolidated (Phase 2)
- Started implementation without validating spec folder has required files (Phase 2)
- Skipped memory prompt when memory files exist (Phase 3)
- Inferred spec folder from .spec-active or context instead of explicit user input
- Auto-selected execution mode without suffix or explicit user choice

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue current action
2. STATE: "I violated PHASE [X] by [specific action]. Correcting now."
3. RETURN to the violated phase
4. COMPLETE the phase properly (ask user, wait for response)
5. RESUME only after all phases pass verification
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
| 6    | Development            | Execute implementation                                             | code changes              |
| 7    | Completion             | Generate summary (MANDATORY for Level 2+)                          | implementation-summary.md |
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

## 8. 🔀 KEY DIFFERENCES FROM /SPEC_KIT:COMPLETE

- **Requires existing plan** - Won't create spec.md or plan.md
- **Starts at implementation** - Skips specification and planning phases
- **Use case** - Separated planning/implementation, team handoffs, phased delivery

---

## 9. ✅ VALIDATION DURING IMPLEMENTATION

Validation runs automatically to catch issues early.

Key rules for implementation phase:
- **PLACEHOLDER_FILLED** - Replace all `[PLACEHOLDER]` markers
- **PRIORITY_TAGS** - Add P0/P1/P2 to checklist items
- **EVIDENCE_CITED** - Add `[SOURCE:]` citations for claims

---

## 10. 🔍 EXAMPLES

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

## 11. 🔗 COMMAND CHAIN

This command is part of the SpecKit workflow:

```
[/spec_kit:plan] → /spec_kit:implement → [/spec_kit:handover]
```

**Prerequisite:**
← `/spec_kit:plan [feature-description]` (creates spec.md, plan.md)

---

## 12. 📌 NEXT STEPS

After implementation completes, suggest relevant next steps:

| Condition | Suggested Command | Reason |
|-----------|-------------------|--------|
| Implementation complete | Verify in browser | Test functionality works |
| Need to save progress | `/memory:save [spec-folder-path]` | Preserve implementation context |
| Ending session | `/spec_kit:handover [spec-folder-path]` | Create continuation document |
| Found bugs during testing | `/spec_kit:debug [spec-folder-path]` | Delegate debugging to fresh agent |
| Ready for next feature | `/spec_kit:complete [feature-description]` | Start new workflow |

**ALWAYS** end with: "What would you like to do next?"