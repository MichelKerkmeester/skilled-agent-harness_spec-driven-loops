---
description: Create session handover document for continuing work in a new conversation. Supports :quick and :full variants
argument-hint: "[spec-folder-path] [:quick|:full]"
allowed-tools: Read, Write, Edit, Bash, Grep, Glob, Task
---

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED or ⏭️ N/A.**

**Round-trip optimization:** Handover uses 1-2 user interactions. Variant defaults to QUICK without asking.

---

## 🔒 PHASE 1: INPUT & SPEC DETECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS CHECK FIRST:

1. CHECK for spec folder in $ARGUMENTS:

├─ IF $ARGUMENTS contains a spec folder path:
│   │
│   ├─ Validate path exists: ls -d [spec_folder_input] 2>/dev/null
│   │
│   ├─ IF path exists:
│   │   ├─ Store as: spec_path
│   │   ├─ detection_method = "provided"
│   │   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2
│   │
│   └─ IF path NOT found:
│       ├─ SHOW: "Spec folder not found: [path]"
│       ├─ ASK: "Would you like to:"
│       │   ┌────────────────────────────────────────────────────────────┐
│       │   │ A) Try auto-detection (search for recent sessions)         │
│       │   │ B) Provide a different path                                │
│       │   │ C) Cancel                                                  │
│       │   └────────────────────────────────────────────────────────────┘
│       └─ WAIT for user response
│
└─ IF $ARGUMENTS is empty (auto-detect mode):
    │
    ├─ Find most recent memory file (Stateless - no .spec-active marker)
    │   $ find specs -path "*/memory/*.md" -type f 2>/dev/null | xargs ls -t 2>/dev/null | head -1
    │
    ├─ IF session found:
    │   ├─ Store as: spec_path (extract from memory file path)
    │   ├─ detection_method = "recent"
    │   └─ SET STATUS: ✅ PASSED → Proceed to PHASE 2
    │
    └─ IF NO session found:
        ├─ SHOW: "No active session detected"
        ├─ ASK: "Would you like to:"
        │   ┌────────────────────────────────────────────────────────────┐
        │   │ A) List available spec folders and select one              │
        │   │ B) Cancel handover                                         │
        │   └────────────────────────────────────────────────────────────┘
        └─ WAIT for user response

⛔ HARD STOP: DO NOT proceed until a valid spec_path is confirmed
```

**Phase 1 Output:** `spec_path = ________________` | `detection_method = [recent/provided]`

---

## 🔒 PHASE 2: VARIANT SELECTION

**STATUS: ☐ BLOCKED**

```
EXECUTE AFTER PHASE 1 PASSES:

1. CHECK command invocation for variant suffix:
   ├─ ":quick" suffix detected → variant = "QUICK"
   ├─ ":full" suffix detected → variant = "FULL"
   └─ No suffix → variant = "QUICK" (default - faster, lower friction)

2. Validate spec folder has required context:
   $ ls -la [spec_path]/
   
   Check for:
   - spec.md (recommended)
   - plan.md or tasks.md (recommended)
   - memory/*.md files (for context gathering)

3. IF variant is FULL and no substantial context found:
   ├─ WARN: "Limited context available for comprehensive handover"
   ├─ ASK: "Would you like to:"
   │   ┌────────────────────────────────────────────────────────────┐
   │   │ A) Proceed with full handover anyway                       │
   │   │ B) Switch to quick handover (recommended)                  │
   │   │ C) Cancel                                                  │
   │   └────────────────────────────────────────────────────────────┘
   └─ WAIT for user response

4. Store variant and SET STATUS: ✅ PASSED

Note: Unlike resume, handover defaults to QUICK variant without asking,
since quick handover covers most use cases with minimal friction.

⛔ HARD STOP: DO NOT proceed until variant is determined
```

**Phase 2 Output:** `variant = [QUICK/FULL]` | `context_available = [yes/limited/no]`

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                      | REQUIRED STATUS | YOUR STATUS | OUTPUT VALUE                           |
| -------------------------- | --------------- | ----------- | -------------------------------------- |
| PHASE 1: INPUT & SPEC      | ✅ PASSED        | ______      | spec_path: ______ / method: ______     |
| PHASE 2: VARIANT SELECTION | ✅ PASSED        | ______      | variant: ______ / context: ______      |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED?
│   ├─ YES → Proceed to "# SpecKit Handover" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**
- Started reading the workflow section before all phases passed
- Assumed a spec folder without user confirmation when path was invalid
- Proceeded without validating spec path exists (Phase 1)
- Did not default to QUICK variant when no suffix provided
- Created handover without gathering context first
- Did not display the created file path and continuation instructions

**VIOLATION RECOVERY PROTOCOL:**
```
1. STOP immediately - do not continue current action
2. STATE: "I violated PHASE [X] by [specific action]. Correcting now."
3. RETURN to the violated phase
4. COMPLETE the phase properly (ask user, wait for response)
5. RESUME only after all phases pass verification
```

---

# 📊 WORKFLOW EXECUTION - MANDATORY TRACKING

**⛔ ENFORCEMENT RULE:** Execute steps IN ORDER. Mark each step ✅ ONLY after completing ALL its activities and verifying outputs. DO NOT SKIP STEPS.

---

## Quick Variant (4 steps)

| STEP | NAME              | STATUS | REQUIRED OUTPUT         | VERIFICATION                |
| ---- | ----------------- | ------ | ----------------------- | --------------------------- |
| 1    | Validate Spec     | ☐      | spec_path confirmed     | Path validated              |
| 2    | Gather Context    | ☐      | context_summary         | Last action, next action    |
| 3    | Create Handover   | ☐      | quick-continue.md       | File created in spec folder |
| 4    | Display Result    | ☐      | continuation_displayed  | Instructions shown to user  |

## Full Variant (5 steps)

| STEP | NAME              | STATUS | REQUIRED OUTPUT         | VERIFICATION                  |
| ---- | ----------------- | ------ | ----------------------- | ----------------------------- |
| 1    | Validate Spec     | ☐      | spec_path confirmed     | Path validated                |
| 2    | Gather Context    | ☐      | context_summary         | Comprehensive context loaded  |
| 3    | Analyze Session   | ☐      | session_analysis        | Decisions, blockers extracted |
| 4    | Create Handover   | ☐      | handover.md             | File created via Sonnet agent |
| 5    | Display Result    | ☐      | continuation_displayed  | Instructions shown to user    |

---

# SpecKit Handover

Create session handover document for continuing work in a new conversation. Supports quick (~14 lines) and full (~100-150 lines) variants for different handoff needs.

---

```yaml
role: Expert Developer using Smart SpecKit for Session Handover
purpose: Create continuation documentation for session branching and context preservation
action: Run 4-5 step handover workflow from context gathering through document creation

operating_mode:
  workflow: sequential_4_or_5_step
  workflow_compliance: MANDATORY
  workflow_execution: variant_based
  approvals: none_for_quick_agent_for_full
  tracking: file_creation
  validation: file_exists_check
```

---

## 1. 📋 PURPOSE

Create a handover document that enables seamless session continuation. The quick variant creates a minimal quick-continue.md for fast context handoff. The full variant creates a comprehensive handover.md via Sonnet agent with detailed session analysis.

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` — Optional spec folder path with optional :quick/:full variant suffix
**Outputs:** Handover document (quick-continue.md or handover.md) + `STATUS=<OK|FAIL|CANCELLED>`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📊 WORKFLOW OVERVIEW

### Quick Variant (4 Steps)

| Step | Name            | Purpose                              | Outputs            |
| ---- | --------------- | ------------------------------------ | ------------------ |
| 1    | Validate Spec   | Confirm spec folder exists           | spec_path          |
| 2    | Gather Context  | Extract last action, next action     | context_summary    |
| 3    | Create Handover | Generate quick-continue.md           | quick-continue.md  |
| 4    | Display Result  | Show file path and continuation info | user_instructions  |

### Full Variant (5 Steps)

| Step | Name            | Purpose                              | Outputs            |
| ---- | --------------- | ------------------------------------ | ------------------ |
| 1    | Validate Spec   | Confirm spec folder exists           | spec_path          |
| 2    | Gather Context  | Load comprehensive session context   | context_summary    |
| 3    | Analyze Session | Extract decisions, blockers, pending | session_analysis   |
| 4    | Create Handover | Generate handover.md via Sonnet      | handover.md        |
| 5    | Display Result  | Show file path and continuation info | user_instructions  |

---

## 4. ⚡ INSTRUCTIONS

### Quick Variant

Create quick-continue.md directly using the template:

**Template**: `.opencode/skill/system-spec-kit/templates/quick-continue.md`

> **Template Source:** Use the template at `.opencode/skill/system-spec-kit/templates/quick-continue.md` as the authoritative source. The inline example below is for reference only.

### Attempt Counter Logic

Before creating quick-continue.md, determine the attempt number:

1. Check if quick-continue.md already exists in the spec folder
2. If exists, read the current attempt number from the file
3. Increment by 1 for the new handover
4. If no existing file, start at Attempt 1

**Implementation:**
```
IF quick-continue.md exists in [spec_folder]:
  Extract current [N] from "CONTINUATION - Attempt [N]"
  New attempt = N + 1
ELSE:
  New attempt = 1
```

**Output format:**
```
**CONTINUATION - Attempt [calculated_number]**
```

**Content structure (reference only):**
```markdown
# Quick Continue: [FEATURE_NAME]

**Spec Folder**: [PATH]
**Last Updated**: [TIMESTAMP]

## Last Completed
[What was just finished - be specific]

## Next Action
[What to do next - include file names if relevant]

## Blockers
[Any issues or "None"]

## Context
[1-2 sentences of critical context for continuation]
```

### Full Variant

Load and execute the Sonnet agent specification:

**Agent YAML**: `.opencode/command/spec_kit/assets/spec_kit_handover_full.yaml`

The agent generates comprehensive handover.md with 7 sections:
1. Session Summary
2. Current State
3. Completed Work
4. Pending Work
5. Key Decisions
6. Blockers & Risks
7. Continuation Instructions

---

## 5. 📊 OUTPUT FORMATS

**Output Location:** 
- Quick variant: `[spec_folder]/quick-continue.md`
- Full variant: `[spec_folder]/handover.md`

These files are created in the spec folder root, NOT in memory/.

> **💡 Tip:** After creating the handover file, consider also running `/memory:save` to preserve full semantic context for future searches. Handover files are for quick continuation; memory files are for semantic retrieval.

### Quick Handover Success

```text
╭─────────────────────────────────────────────────────────────╮
│ ✅ QUICK HANDOVER CREATED                                   │
├─────────────────────────────────────────────────────────────┤
│ File: specs/014-auth-feature/quick-continue.md              │
│ Size: 14 lines                                              │
├─────────────────────────────────────────────────────────────┤
│ TO CONTINUE IN NEW SESSION:                                 │
│                                                             │
│ /spec_kit:resume specs/014-auth-feature/                    │
│                                                             │
│ Or paste this handoff:                                      │
│ ┌─────────────────────────────────────────────────────────┐ │
│ │ CONTINUATION - Attempt 1                                │ │
│ │ Spec: specs/014-auth-feature/                           │ │
│ │ Last: [Last completed action]                           │ │
│ │ Next: [Next pending action]                             │ │
│ └─────────────────────────────────────────────────────────┘ │
╰─────────────────────────────────────────────────────────────╯
```

### Full Handover Success

```text
╭─────────────────────────────────────────────────────────────╮
│ ✅ FULL HANDOVER CREATED                                    │
├─────────────────────────────────────────────────────────────┤
│ File: specs/014-auth-feature/handover.md                    │
│ Size: 127 lines                                             │
│ Sections: 7                                                 │
├─────────────────────────────────────────────────────────────┤
│ TO CONTINUE IN NEW SESSION:                                 │
│                                                             │
│ /spec_kit:resume specs/014-auth-feature/                    │
╰─────────────────────────────────────────────────────────────╯
```

### No Spec Folder Found

```text
╭─────────────────────────────────────────────────────────────╮
│ ⚠️  NO ACTIVE SESSION                                       │
├─────────────────────────────────────────────────────────────┤
│ No recent spec folders found for handover.                  │
├─────────────────────────────────────────────────────────────┤
│ OPTIONS                                                     │
│   • Specify folder: /spec_kit:handover specs/014-*/         │
│   • Start new work: /spec_kit:complete                      │
╰─────────────────────────────────────────────────────────────╯
```

---

## 6. 📌 REFERENCE

**Full details in YAML prompt:**
- Full variant agent specification
- 7-section handover structure
- Context extraction patterns
- Decision documentation format

**Related templates:**
- `.opencode/skill/system-spec-kit/templates/quick-continue.md`
- `.opencode/skill/system-spec-kit/templates/handover.md`

**See also:** AGENTS.md Gate 0 (compaction handling), Gate 7 (context health monitoring).

---

## 6.1 🔀 PARALLEL DISPATCH

The handover workflow is a **utility workflow** and does NOT use parallel dispatch. All steps execute sequentially:

- **Quick variant**: 4 sequential steps
- **Full variant**: 5 sequential steps (Step 4 uses Sonnet agent)

Parallel dispatch is only used in implementation-heavy workflows (`/spec_kit:complete`, `/spec_kit:implement`, `/spec_kit:research`).

---

## 7. 🔍 EXAMPLES

**Example 1: Quick handover (default)**
```
/spec_kit:handover
```
→ Auto-detects recent spec folder, creates quick-continue.md

**Example 2: Quick handover for specific folder**
```
/spec_kit:handover specs/014-auth-feature/
```
→ Creates quick-continue.md in specified folder

**Example 3: Quick handover (explicit)**
```
/spec_kit:handover:quick
```
→ Same as default, creates minimal quick-continue.md

**Example 4: Full handover**
```
/spec_kit:handover:full specs/014-auth-feature/
```
→ Creates comprehensive handover.md via Sonnet agent

---

## 8. 🔗 RELATED COMMANDS

| Command              | Relationship                                         |
| -------------------- | ---------------------------------------------------- |
| `/spec_kit:resume`   | Loads handover document to continue work             |
| `/spec_kit:complete` | Start new feature (handover captures in-progress)    |
| `/memory:save`       | Save context to memory (handover is for branching)   |

---

## 9. 📌 INTEGRATION

### Gate 7 Integration

Gate 7 (Context Health Monitor) suggests `/spec_kit:handover` during long sessions:

- **Tier 1** (15 exchanges): "Consider /spec_kit:handover soon"
- **Tier 2** (25 exchanges): "Recommend /spec_kit:handover now"
- **Tier 3** (35 exchanges): "Handover strongly recommended"

### Gate 0 Integration

Gate 0 (Compaction Detection) displays handover format when context compaction is detected:

```
CONTINUATION - Attempt [N]
Spec: [CURRENT_SPEC_PATH]
Last: [MOST_RECENT_COMPLETED_TASK]
Next: [NEXT_PENDING_TASK]

Run /spec_kit:handover to save quick-continue.md, then in new session:
/spec_kit:resume [spec-path]
```

### Keyword Triggers

Proactive `/spec_kit:handover` suggestion on session-ending keywords:
- "stopping", "done", "finished", "break", "later"
- "forgetting", "remember", "context", "losing track"
