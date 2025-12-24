---
description: Full end-to-end SpecKit workflow (12 steps) - supports :auto and :confirm modes
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
│   ├─ ASK user: "What feature would you like to build?"
│   ├─ WAIT for user response (DO NOT PROCEED)
│   ├─ Store response as: feature_description
│   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2
│
└─ IF $ARGUMENTS contains content:
    ├─ Store as: feature_description
    └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer features from context, screenshots, or conversation history
```

**Phase 1 Output:** `feature_description = ________________`

---

## 🔒 PHASE 2: CONSOLIDATED SETUP (Spec Folder + Execution Mode)

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
   │    A) Autonomous - Execute all 12 steps without approval       │
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

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create spec folders without user confirmation
⛔ NEVER auto-select execution mode without suffix or explicit choice
```

**Phase 2 Output:** `spec_choice = ___` | `spec_path = ________________` | `execution_mode = ________________`

---

## 🔒 PHASE 3: MEMORY CONTEXT LOADING (Conditional)

**STATUS: ☐ BLOCKED / ☐ N/A**

> **Gate 4 Integration:** This phase implements AGENTS.md Gate 4 (Memory Loading). See Gate 4 for the `[1] [2] [3] [all] [skip]` selection format.

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
        │   │ B) Load all recent files, up to 3 (comprehensive).  │
        │   │ C) List all files and select specific                │
        │   │ D) Skip (start fresh, no context)                  │
        │   └────────────────────────────────────────────────────┘
        │
        ├─ WAIT for user response
        ├─ Execute loading based on choice (use Read tool)
        ├─ Acknowledge loaded context briefly
        └─ SET STATUS: ✅ PASSED

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
│   ├─ YES → Proceed to "# SpecKit Complete" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Started reading the workflow section before all phases passed
- Proceeded without asking user for feature description (Phase 1)
- Asked spec folder and execution mode as SEPARATE questions instead of consolidated (Phase 2)
- Auto-created or assumed a spec folder without A/B/C/D choice (Phase 2)
- Skipped memory prompt when using existing folder with memory files (Phase 3)
- Inferred feature from context instead of explicit user input
- Auto-selected execution mode without suffix or explicit user choice

**Workflow Violations (Steps 1-12):**
- **Skipped Phase Gate and jumped directly to implementation code**
- **Started writing code before completing Steps 1-7 (Planning Phase)**
- **Did not mark tasks [x] in tasks.md during Step 10**
- **Did not create implementation-summary.md in Step 11**
- **Claimed "complete" or "done" without verifying all 12 steps executed**

**Confidence Violations (AGENTS.md Section 3):**
- **Proceeded with confidence <40% without asking clarifying question**
- **Made technical decisions without citing sources**
- **Claimed certainty without evidence (fabricated or guessed)**
- **Failed to escalate after 2 failed attempts or 10 minutes**

**VIOLATION RECOVERY PROTOCOL:**
```
FOR PHASE VIOLATIONS:
1. STOP immediately - do not continue current action
2. STATE: "I violated PHASE [X] by [specific action]. Correcting now."
3. RETURN to the violated phase
4. COMPLETE the phase properly (ask user, wait for response)
5. RESUME only after all phases pass verification

FOR WORKFLOW VIOLATIONS:
1. STOP immediately
2. STATE: "I skipped STEP [X] by [specific action]. Correcting now."
3. RETURN to the skipped step
4. COMPLETE all activities for that step
5. VERIFY outputs exist
6. MARK step ✅ in tracking table
7. CONTINUE to next step in sequence

FOR CONFIDENCE VIOLATIONS:
1. STOP immediately
2. STATE: "Confidence checkpoint failed ([NN%]). Correcting now."
3. Present clarifying question with A/B/C options
4. WAIT for user response
5. Re-evaluate confidence after clarification
6. PROCEED only when confidence ≥40% (or user explicitly approves risk)
```

---

## 🧑‍🏫 CONFIDENCE CHECKPOINT PROTOCOL

**Reference:** AGENTS.md Section 3 + `spec_kit_complete_[auto|confirm].yaml` for full scoring details.

**Quick Reference:**
- **≥80%** → Proceed with cited evidence
- **40-79%** → Proceed with caution, document assumptions
- **<40%** → STOP and ask clarifying question (A/B/C format)

**Key Checkpoints:** Steps 1, 3, 6, 10

---

# 📊 WORKFLOW EXECUTION (12 STEPS) - MANDATORY TRACKING

**⛔ ENFORCEMENT RULE:** Execute steps IN ORDER (1→12). Mark each step ✅ ONLY after completing ALL its activities and verifying outputs. DO NOT SKIP STEPS.

---

## PHASE A: PLANNING (Steps 1-7)

| STEP | NAME              | STATUS | REQUIRED OUTPUT           | VERIFICATION                          |
| ---- | ----------------- | ------ | ------------------------- | ------------------------------------- |
| 1    | Request Analysis  | ☐      | requirement_summary       | Scope defined                         |
| 2    | Pre-Work Review   | ☐      | coding_standards_summary  | AGENTS.md reviewed                    |
| 3    | Specification     | ☐      | `spec.md` created         | File exists, no [NEEDS CLARIFICATION] |
| 4    | Clarification     | ☐      | updated `spec.md`         | Ambiguities resolved                  |
| 5    | Quality Checklist | ☐      | `checklist.md` (Level 2+) | Checklist items defined               |
| 6    | Planning          | ☐      | `plan.md` created         | Technical approach documented         |
| 7    | Task Breakdown    | ☐      | `tasks.md` created        | All tasks listed with IDs             |

---

## 🔒 PHASE GATE: PLANNING → IMPLEMENTATION

**STATUS: ☐ BLOCKED**

```
BEFORE proceeding to Implementation Phase (Steps 8-12):

VERIFY all planning artifacts exist and are complete:
├─ [ ] spec.md exists in spec_path
├─ [ ] spec.md has NO [NEEDS CLARIFICATION] markers remaining
├─ [ ] plan.md exists in spec_path
├─ [ ] plan.md has technical approach defined
├─ [ ] tasks.md exists in spec_path
├─ [ ] tasks.md has all implementation tasks listed with T### IDs

IF any artifact missing or incomplete:
└─ STOP → Return to appropriate step (3, 6, or 7) → Complete it → Return here

WHEN all artifacts verified:
└─ SET PHASE STATUS: ✅ PASSED → Proceed to Step 8

⛔ HARD STOP: DO NOT start Step 8 until Phase Gate shows ✅ PASSED
⛔ NEVER skip directly to writing implementation code
⛔ NEVER assume "I know what to build" - follow the process
```

---

## PHASE B: IMPLEMENTATION (Steps 8-12)

| STEP | NAME                 | STATUS | REQUIRED OUTPUT                   | VERIFICATION                              |
| ---- | -------------------- | ------ | --------------------------------- | ----------------------------------------- |
| 8    | Analysis             | ☐      | consistency_report                | Artifacts cross-checked                   |
| 9    | Implementation Check | ☐      | prerequisites_verified            | Ready to implement                        |
| 10   | Development          | ☐      | code changes + tasks marked `[x]` | **ALL tasks in tasks.md marked complete** |
| 10.5 | Checklist Verify     | ☐      | All P0/P1 verified                | **Level 2+ ONLY - BLOCKING**              |
| 11   | Completion           | ☐      | `implementation-summary.md`       | **Summary file created**                  |
| 12   | Save Context         | ☐      | `memory/*.md`                     | Context preserved                         |

---

## ⛔ CRITICAL ENFORCEMENT RULES

```
STEP 10 (Development) REQUIREMENTS:
├─ MUST load tasks.md and execute tasks in order
├─ MUST mark each task [x] in tasks.md when completed
├─ MUST NOT claim "development complete" until ALL tasks marked [x]
└─ MUST test code changes before marking complete

STEP 10.5 (Checklist Verification) REQUIREMENTS - LEVEL 2+ ONLY:
├─ ⛔ BLOCKING: This step is REQUIRED for Level 2+ before claiming completion
├─ Load checklist.md from spec folder
├─ Verify ALL P0 items are marked [x] with evidence
├─ Verify ALL P1 items are either:
│   ├─ Marked [x] with evidence, OR
│   └─ Have documented user approval to defer
├─ P2 items may be deferred without approval
├─ Evidence format: "- [x] Task description [EVIDENCE: file.js:45-67 - implementation verified]"
└─ ⛔ HARD BLOCK: Cannot proceed to Step 11 if any P0 items are unchecked

STEP 11 (Completion) REQUIREMENTS:
├─ Validation runs automatically on spec folder first
│   ├─ Pass → continue
│   ├─ Warnings → continue with caution
│   └─ Errors → STOP and fix before proceeding
├─ MUST verify all tasks in tasks.md show [x]
├─ MUST create implementation-summary.md with:
│   ├─ Files modified/created
│   ├─ Verification steps taken
│   ├─ Deviations from plan (if any)
│   └─ Browser testing results
└─ MUST NOT skip this step

STEP 12 (Save Context) REQUIREMENTS:
├─ MUST save session context to memory/ folder
├─ MUST include decisions made and implementation details
├─ **MANDATORY:** Use generate-context.js for memory save:
│   ```
│   node .opencode/skill/system-memory/scripts/generate-context.js [spec-folder-path]
│   ```
└─ ❌ DO NOT use Write/Edit tools to create memory files directly
```

---

## ⚠️ WORKFLOW VIOLATION DETECTION

**YOU ARE IN VIOLATION IF YOU:**
- Started writing implementation code before Step 8
- Skipped Steps 8-9 and jumped directly to coding
- Did not mark tasks `[x]` in tasks.md during Step 10
- Did not create implementation-summary.md in Step 11
- Claimed "complete" without all 12 steps showing ✅

**WORKFLOW VIOLATION RECOVERY:**
```
1. STOP current action
2. STATE: "I skipped Step [X]. Correcting now."
3. Return to the skipped step
4. Complete ALL activities for that step
5. Mark step ✅ in tracking table
6. Continue to next step
```

---

# SpecKit Complete

Execute the complete SpecKit lifecycle from specification through implementation with context preservation. Supports autonomous (`:auto`) and interactive (`:confirm`) execution modes.

---

```yaml
role: Expert Developer using Smart SpecKit with Full Lifecycle Management
purpose: Spec-driven development with mandatory compliance and comprehensive documentation
action: Run full 12-step SpecKit from specification to implementation with context preservation

operating_mode:
  workflow: sequential_12_step
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_or_interactive
  approvals: step_by_step_for_confirm_mode
  tracking: progressive_task_checklists
  validation: checkpoint_based_with_checklist_verification
```

---

## 1. 📋 PURPOSE

Run the full 12-step SpecKit workflow: specification, clarification, planning, task breakdown, implementation, and context saving. This is the comprehensive workflow for feature development with full documentation trail.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Feature description with optional parameters (branch, scope, context)
**Outputs:** Complete spec folder with all artifacts + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

## 3. 📊 WORKFLOW-OVERVIEW

| Step | Name                 | Purpose                                                                      | Outputs                   |
| ---- | -------------------- | ---------------------------------------------------------------------------- | ------------------------- |
| 1    | Request Analysis     | Analyze inputs, define scope                                                 | requirement_summary       |
| 2    | Pre-Work Review      | Review AGENTS.md, standards                                                  | coding_standards_summary  |
| 3    | Specification        | Create spec.md                                                               | spec.md, feature branch   |
| 4    | Clarification        | Resolve ambiguities                                                          | updated spec.md           |
| 5    | Quality Checklist    | Generate validation checklist (ACTIVELY USED for verification at completion) | checklist.md              |
| 6    | Planning             | Create technical plan                                                        | plan.md, research.md      |
| 7    | Task Breakdown       | Break into tasks                                                             | tasks.md                  |
| 8    | Analysis             | Verify consistency                                                           | consistency_report        |
| 9    | Implementation Check | Verify prerequisites                                                         | greenlight                |
| 10   | Development          | Execute implementation                                                       | code changes              |
| 11   | Completion           | Generate summary                                                             | implementation-summary.md |
| 12   | Save Context         | Preserve conversation                                                        | memory/*.md               |

---

## 4. ⚡ INSTRUCTIONS

After all phases pass, load and execute the appropriate YAML prompt:

- **AUTONOMOUS**: `.opencode/command/spec_kit/assets/spec_kit_complete_auto.yaml`
- **INTERACTIVE**: `.opencode/command/spec_kit/assets/spec_kit_complete_confirm.yaml`

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
- Checklist verification protocol
- Failure recovery procedures

**See also:** AGENTS.md Sections 2-4 for memory loading, confidence framework, and request analysis.

---

## 6. ✅ VALIDATION

Before marking complete, validation runs automatically on the spec folder.

### Validation Modes

| Option      | Description                      |
| ----------- | -------------------------------- |
| `--json`    | Output results in JSON format    |
| `--strict`  | Treat warnings as errors         |
| `--quiet`   | Suppress output except errors    |
| `--verbose` | Show detailed output with timing |

### Validation Rules (7 total)

1. **FILE_EXISTS** - Required files present for documentation level
2. **PLACEHOLDER_FILLED** - No unfilled `[PLACEHOLDER]` markers
3. **SECTIONS_PRESENT** - Required markdown sections exist
4. **LEVEL_DECLARED** - Documentation level declared in spec.md
5. **PRIORITY_TAGS** - Checklist items have P0/P1/P2 tags
6. **EVIDENCE_CITED** - Claims have `[SOURCE:]` citations
7. **ANCHORS_VALID** - Memory file ANCHOR pairs are balanced

**Exit codes:** 0 = pass, 1 = warnings, 2 = errors (must fix)

---

## 7. 🔀 PARALLEL DISPATCH

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

### Step 6: 4-Agent Parallel Exploration (Automatic)

Step 6 (Planning) automatically dispatches 4 Sonnet agents in parallel via the Task tool:

1. **Architecture Explorer** - Project structure, entry points, component connections
2. **Feature Explorer** - Similar features, related patterns
3. **Dependency Explorer** - Imports, modules, affected areas
4. **Test Explorer** - Test patterns, testing infrastructure

After agents return, hypotheses are verified by reading identified files and building a complete mental model.

### Eligible Phases

- Step 3: Specification
- Step 6: Planning (includes automatic 4-agent exploration)
- Step 8: Analysis
- Step 10: Development

### Override Phrases

- **Direct**: "proceed directly", "handle directly", "skip parallel"
- **Parallel**: "use parallel", "dispatch agents", "parallelize"
- **Auto-decide**: "auto-decide", "auto mode", "decide for me" (1 hour session preference)
