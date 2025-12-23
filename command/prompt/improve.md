---
description: Enhance prompts using DEPTH framework with AI-guided analysis
argument-hint: "<prompt-text> [:quick|:improve|:refine]"
allowed-tools: Read, Write
---

# 🚨 MANDATORY PHASES - BLOCKING ENFORCEMENT

**These phases use CONSOLIDATED PROMPTS to minimize user round-trips. Each phase BLOCKS until complete. You CANNOT proceed to the workflow until ALL phases show ✅ PASSED or ⏭️ N/A.**

**Round-trip optimization:** This workflow requires 2-3 user interactions.

---

## 🔒 PHASE 1: INPUT VALIDATION

**STATUS: ☐ BLOCKED**

**Check `$ARGUMENTS` for prompt text to improve:**

```
IF $ARGUMENTS is empty, undefined, or contains only whitespace:
    ⛔ BLOCKED - Cannot proceed
    
    ACTION REQUIRED:
    1. Present a prompt asking the user:
       question: "What prompt would you like me to improve?"
       options:
         - label: "Provide prompt text"
           description: "I'll paste or describe the prompt to improve"
    2. WAIT for user response
    3. Capture response as: prompt_text = ______
    4. Only THEN proceed to PHASE 2

IF $ARGUMENTS contains prompt text:
    ✅ Capture: prompt_text = $ARGUMENTS
    → SET STATUS: ✅ PASSED → Proceed to PHASE 2

⛔ HARD STOP: DO NOT read past this phase until STATUS = ✅ PASSED
⛔ NEVER infer prompts from context or conversation history
```

**Phase 1 Output:**
- `prompt_text = ______` (REQUIRED - must be filled before continuing)

---

## 🔒 PHASE 2: SPEC FOLDER SELECTION

**STATUS: ☐ BLOCKED**

**You MUST ask user to select a spec folder option. DO NOT SKIP THIS QUESTION.**

```
⛔ BLOCKED until user explicitly selects A, B, C, or D

ACTION REQUIRED:
1. Present a multiple-choice prompt with these options:
   question: "Where should I save the prompt improvement documentation?"
   options:
     A) Use existing spec folder - [suggest relevant existing folder if found]
     B) Create new spec folder - specs/[###-prompt-improvement]/
     C) Update related spec - [suggest if related spec exists]
     D) Skip documentation - (output directly without saving)

2. WAIT for user response
3. Capture: spec_folder_choice = ______ (A, B, C, or D)
4. Capture: spec_folder_path = ______
5. SET STATUS: ✅ PASSED → Proceed to PHASE 3 (if applicable) or continue workflow

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER auto-create spec folders without user confirmation
```

**Phase 2 Output:**
- `spec_folder_choice = ______` (REQUIRED - A, B, C, or D)
- `spec_folder_path = ______` (REQUIRED - actual path, or "N/A" if D)

---

## 🔒 PHASE 3: MEMORY CONTEXT LOADING (CONDITIONAL)

**STATUS: ☐ BLOCKED / ☐ N/A**

**This phase only applies if user selected Option A or C in PHASE 2.**

```
IF spec_folder_choice is A or C AND memory/ folder exists with files:
    → Auto-load the most recent memory file (DEFAULT)
    → Briefly confirm: "Loaded context from [filename]"
    → User can say "skip memory" or "fresh start" to bypass
    
IF spec_folder_choice is B or D:
    → SET STATUS: ⏭️ N/A (no memory to load)
    → Proceed to workflow

⛔ HARD STOP: DO NOT proceed until STATUS = ✅ PASSED or ⏭️ N/A
```

---

## ✅ PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL phases:**

| PHASE                       | REQUIRED STATUS    | YOUR STATUS | OUTPUT VALUE                                         |
| --------------------------- | ------------------ | ----------- | ---------------------------------------------------- |
| PHASE 1: INPUT              | ✅ PASSED          | ______      | prompt_text: ______                                  |
| PHASE 2: SPEC FOLDER        | ✅ PASSED          | ______      | spec_choice: ___ / spec_path: ___                    |
| PHASE 3: MEMORY             | ✅ PASSED or ⏭️ N/A | ______      | memory_loaded: ______                                |

```
VERIFICATION CHECK:
├─ ALL phases show ✅ PASSED or ⏭️ N/A?
│   ├─ YES → Proceed to "# Improve Prompt - DEPTH Framework" section below
│   └─ NO  → STOP and complete the blocked phase
```

---

## ⚠️ VIOLATION SELF-DETECTION (BLOCKING)

**YOU ARE IN VIOLATION IF YOU:**

**Phase Violations:**
- Started reading the workflow section before all phases passed
- Proceeded without asking user for prompt text (Phase 1)
- Skipped spec folder question (Phase 2)
- Auto-created or assumed a spec folder without A/B/C/D choice (Phase 2)
- Skipped memory prompt when using existing folder with memory files (Phase 3)
- Inferred prompt from context instead of explicit user input
- Proceeded without user's explicit choice

**VIOLATION RECOVERY PROTOCOL:**
```
FOR PHASE VIOLATIONS:
1. STOP immediately - do not continue current action
2. STATE: "I violated PHASE [X] by [specific action]. Correcting now."
3. RETURN to the violated phase
4. COMPLETE the phase properly (ask user, wait for response)
5. RESUME only after all phases pass verification
```

---

# Improve Prompt - DEPTH Framework

Transform raw prompts into optimized, framework-structured prompts using DEPTH methodology (Discover, Engineer, Prototype, Test, Harmonize).

---

```yaml
role: Prompt Engineering Specialist with Multi-Perspective Analysis Expertise
purpose: Transform raw prompts into optimized, framework-structured prompts through systematic DEPTH methodology
action: Apply 5-phase enhancement workflow with cognitive rigor and framework selection

operating_mode:
  workflow: sequential_with_cognitive_rigor
  workflow_compliance: MANDATORY
  workflow_execution: autonomous_with_user_checkpoints
  approvals: framework_selection_for_complexity_5_plus
  tracking: phase_round_progress_transparent
  validation: qualitative_completeness_check
```

---

## 1. 📋 PURPOSE

Apply systematic prompt enhancement with:
- **Framework selection** - Auto-select from 7 frameworks (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- **Iterative refinement** - Multi-round improvement for clarity and structure
- **Dual output** - SpecKit spec.md + YAML prompt for comprehensive documentation

---

## 2. 📝 CONTRACT

**Input:** `$ARGUMENTS` = prompt text + optional mode (`:quick`, `:improve`, `:refine`)

**Output:** Always creates spec folder with both files:
1. **spec.md** - Simplified specification (Purpose, Original Prompt, numbered framework sections)
2. **enhanced_prompt.yaml** - Pure YAML prompt (NO metadata wrapper, just framework components at top-level)

**Location:** User-selected spec folder (A/B/C/D choice following SpecKit workflow)

**Modes:**
- **:quick** - Fast enhancement (1-5 rounds, auto-framework, <10s)
- **:improve** - Full DEPTH (10 rounds, interactive framework selection)
- **:refine** - Polish existing prompt (preserve framework, focus on clarity)
- **Default** - Interactive mode with full user participation

**Status:** `STATUS=OK SPEC={folder} FILES={spec.md,enhanced_prompt.yaml}` or `STATUS=ERROR|CANCELLED`

### User Input

```text
$ARGUMENTS
```

---

## 3. 📊 WORKFLOW OVERVIEW (5 PHASES)

| Phase | Name      | Purpose                           | Outputs                        |
| ----- | --------- | --------------------------------- | ------------------------------ |
| 1     | Discover  | Analyze intent, assess complexity | complexity_score, gap_analysis |
| 2     | Engineer  | Select framework, restructure     | framework_selection, structure |
| 3     | Prototype | Generate enhanced draft           | enhanced_prompt_draft          |
| 4     | Test      | Validate clarity and completeness | validation_report              |
| 5     | Harmonize | Final polish for consistency      | spec.md, enhanced_prompt.yaml  |

---

## 4. 🔀 MODE DETECTION & ROUTING

| Pattern                       | Mode        | Behavior                                   |
| ----------------------------- | ----------- | ------------------------------------------ |
| `/prompt:improve:quick`       | QUICK       | 1-5 rounds, auto-framework                 |
| `/prompt:improve:improve`     | FULL        | 10 rounds, interactive framework selection |
| `/prompt:improve:refine`      | REFINE      | Preserve framework, polish clarity         |
| `/prompt:improve` (no suffix) | INTERACTIVE | Full user participation                    |

---

## 5. ⚡ INSTRUCTIONS

After all phases pass, load and execute the workflow YAML:

**Location:** `.opencode/command/prompt/assets/improve_prompt.yaml`

The YAML contains:
- Complete DEPTH methodology (10 rounds)
- Framework selection algorithm
- Cognitive rigor techniques
- Multi-perspective analysis
- Quality standards
- Output specifications

---

## 6. 📌 REFERENCE

**Full details in YAML prompt:**
- DEPTH phases and rounds (D→E→P→T→H)
- Framework definitions (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT)
- Complexity assessment formula
- Cognitive rigor techniques (4 techniques, 8-11 min)
- Multi-perspective analysis (3-5 perspectives)
- Quality validation gates
- Mode-specific adaptations
- Output file specifications

**See also:** AGENTS.md Sections 2-4 for memory loading, confidence framework, and request analysis.

---

## 7. 🔗 FRAMEWORK QUICK REFERENCE

| Framework   | Components                                                       | Best For          | Complexity |
| ----------- | ---------------------------------------------------------------- | ----------------- | ---------- |
| **RCAF**    | role, context, action, format                                    | General-purpose   | 1-6        |
| **COSTAR**  | context, objective, style, tone, audience, response              | Communication     | 5-6        |
| **RACE**    | role, action, context, examples                                  | Rapid prototyping | 3-5        |
| **CIDI**    | context, instructions, details, input                            | Creative/ideation | 4-6        |
| **TIDD-EC** | task, instructions, details, deliverables, examples, constraints | Technical specs   | 5-7        |
| **CRISPE**  | capacity, role, insight, statement, personality, experiment      | System prompts    | 4-6        |
| **CRAFT**   | context, role, action, format, target                            | Multi-stakeholder | 7-10       |

---

## 8. 🔍 EXAMPLES

### Quick Mode
```bash
/prompt:improve:quick "Analyze user feedback"
```
Output: 3-5 rounds, RCAF framework, ~5 seconds

### Interactive Mode
```bash
/prompt:improve "Review code for architecture and performance"
```
Output: 10 rounds, user selects framework (complexity 5-6), ~12 seconds

### Refine Mode
```bash
/prompt:improve:refine "Role: Data scientist. Task: Analyze IoT sensor data..."
```
Output: Preserves existing framework, polishes clarity, ~9 seconds

---

## 9. ⚠️ CRITICAL RULES

- ✅ Execute full DEPTH (10 rounds) unless :quick mode
- ✅ Generate BOTH files (spec.md + enhanced_prompt.yaml)
- ✅ Replace all placeholders in YAML (no `{ACTUAL_*}` text in output)
- ✅ Ensure framework components are complete and substantive
- ❌ NEVER skip framework selection rationale
- ❌ NEVER leave placeholder text in YAML output
- ❌ NEVER proceed with incomplete prompts without user confirmation
