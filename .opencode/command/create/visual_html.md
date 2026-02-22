---
description: Create or verify styled, self-contained visual HTML artifacts from topics, docs, diffs, and recaps using sk-visual-explainer - supports :auto and :confirm modes
argument-hint: "<target-or-source> [--mode <auto|create|analyze|verify|custom>] [--artifact <auto|spec|plan|tasks|checklist|implementation-summary|research|decision-record|readme|install-guide>] [--source-file <path>] [--spec-folder <path>] [--traceability] [--include-doc-impact] [--include-doc-health] [--type <architecture|flowchart|sequence|data-flow|er|state|mindmap|table|timeline|dashboard>] [--style <terminal|editorial|blueprint|neon|paper|hand-drawn|ide|data-dense|gradient>] [:auto|:confirm]"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep
---

> ⚠️ **EXECUTION PROTOCOL — READ FIRST**
>
> This command runs a structured YAML workflow. Do NOT dispatch agents from this document.
>
> **YOUR FIRST ACTION:**
> 1. Run Phase 0: @general agent self-verification (below)
> 2. Run Setup Phase: consolidated prompt to gather inputs
> 3. Determine execution mode from user input (`:auto` or `:confirm`)
> 4. Load the corresponding YAML file from `assets/`:
>    - Auto mode → `create_visual_html_auto.yaml`
>    - Confirm mode → `create_visual_html_confirm.yaml`
> 5. Execute the YAML workflow step by step
>
> This command is intentionally **general-agent based** and does **not** require `@write`.

---

# 🚨 PHASE 0: @GENERAL AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as the @general agent?
│
├─ INDICATORS that you ARE @general agent:
│   ├─ You were invoked without @write-only constraints
│   ├─ You can orchestrate Read/Write/Edit/Bash workflow execution
│   ├─ You can load skill references and execute YAML-defined logic
│
├─ IF YES (all indicators present):
│   └─ general_agent_verified = TRUE → Continue to Setup Phase
│
└─ IF NO or UNCERTAIN:
    │
    ├─ ⛔ HARD BLOCK - DO NOT PROCEED
    │
    ├─ DISPLAY to user:
    │   ┌────────────────────────────────────────────────────────────┐
    │   │ ⛔ GENERAL AGENT REQUIRED                                  │
    │   │                                                            │
    │   │ This command is designed for @general orchestration and    │
    │   │ does not require @write template-only routing.             │
    │   │                                                            │
    │   │ To proceed, restart with:                                  │
    │   │   @general /create:visual_html [arguments]                 │
    │   └────────────────────────────────────────────────────────────┘
    │
    └─ RETURN: STATUS=FAIL ERROR="General agent required"
```

**Phase Output:**
- `general_agent_verified = ________________`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**

This workflow uses a SINGLE consolidated prompt to gather ALL required inputs in ONE user interaction.

```
EXECUTE THIS SINGLE CONSOLIDATED PROMPT:

1. CHECK for mode suffix in $ARGUMENTS or command invocation:
   ├─ ":auto" suffix detected → execution_mode = "AUTONOMOUS" (pre-set, omit Q3)
   ├─ ":confirm" suffix detected → execution_mode = "INTERACTIVE" (pre-set, omit Q3)
   └─ No suffix → execution_mode = "ASK" (include Q3 in prompt)

2. CHECK if --mode is provided:
   ├─ IF provided and valid → operation_intent = value, omit Q1
   └─ IF missing → include Q1 in prompt

3. CHECK if $ARGUMENTS contains a non-flag source/target:
   ├─ IF present → target_input = extracted value, omit Q0
   └─ IF missing → include Q0 in prompt

4. ASK user with SINGLE consolidated prompt (include only applicable questions):

   ┌────────────────────────────────────────────────────────────────┐
   │ **Before proceeding, please answer:**                          │
   │                                                                │
   │ **Q0. Target Input** (if not provided in command):             │
   │    What should this run use as source or request input?        │
   │    (topic text, file path, diff target, html file, or free text) │
   │                                                                │
   │ **Q1. Operation Intent** (if --mode not provided):             │
   │    A) Auto-route from request (recommended)                    │
   │    B) Create a new visual artifact                             │
   │    C) Analyze or review content/changes                        │
   │    D) Verify or correct an existing visual                     │
   │    E) Custom intent (describe freely)                          │
   │                                                                │
   │ **Q2. Output Behavior** (required):                            │
   │    A) Create new output file (recommended)                      │
   │    B) Overwrite matching output file if present                 │
   │                                                                │
   │ **Q3. Execution Mode** (if no :auto/:confirm suffix):            │
   │    A) Interactive - confirm checkpoints                         │
   │    B) Autonomous - run end-to-end                              │
   │                                                                │
   │ Reply format: "A, A, A" or "specs/007-auth/plan.md, B, A"      │
   └────────────────────────────────────────────────────────────────┘

5. WAIT for user response (DO NOT PROCEED)

6. Parse response and store ALL results:
   - target_input = [from Q0 or $ARGUMENTS]
   - operation_intent = [auto|create|analyze|verify|custom_text]
   - operation_mode = [derived internal mode from operation_intent + target + flags]
   - output_behavior = [create_new|overwrite]
   - execution_mode = [AUTONOMOUS/INTERACTIVE from suffix or Q3]

7. SET STATUS: ✅ PASSED

**STOP HERE** - Wait for user to answer ALL applicable questions before continuing.

⛔ HARD STOP: DO NOT proceed until user explicitly answers
⛔ NEVER force a fixed mode list when user provides clear custom intent
⛔ NEVER split these questions into multiple prompts
```

**Phase Output:**
- `general_agent_verified = ________________`
- `target_input = ________________`
- `operation_intent = ________________`
- `operation_mode = ________________` (internal routing result)
- `output_behavior = ________________`
- `execution_mode = ________________`

---

## PHASE STATUS VERIFICATION (BLOCKING)

**Before continuing to the workflow, verify ALL values are set:**

| FIELD                  | REQUIRED | YOUR VALUE | SOURCE           |
| ---------------------- | -------- | ---------- | ---------------- |
| general_agent_verified | ✅ Yes    | ______     | Automatic check  |
| target_input           | ✅ Yes    | ______     | Q0 or $ARGUMENTS |
| operation_intent       | ✅ Yes    | ______     | Q1 or --mode     |
| operation_mode         | ✅ Yes    | ______     | Derived resolver |
| output_behavior        | ✅ Yes    | ______     | Q2               |
| execution_mode         | ✅ Yes    | ______     | Suffix or Q3     |

```
VERIFICATION CHECK:
├─ ALL required fields have values?
│   ├─ YES → Proceed to "⚡ INSTRUCTIONS" section below
│   └─ NO  → Re-prompt for missing values only
```

---

## 1. INSTRUCTIONS

After Phase 0 and Setup Phase pass, load and execute the appropriate YAML workflow:

- **AUTONOMOUS (`:auto`)**: `.opencode/command/create/assets/create_visual_html_auto.yaml`
- **INTERACTIVE (`:confirm`)**: `.opencode/command/create/assets/create_visual_html_confirm.yaml`

The YAML contains: mode routing, resource loading, output naming, metadata requirements, validation gates, and completion reporting.

---

> **📚 REFERENCE CONTEXT** — The sections below provide reference information for the YAML workflow. They are NOT direct execution instructions.

---

## CONSTRAINTS

- **DO NOT** dispatch any agent from this document
- **ALL** orchestration is handled by the YAML workflow steps
- **FIRST ACTION** is always: run Phase 0, run Setup, load YAML, execute

---

## 2. PURPOSE

Create or verify visual HTML artifacts through one unified command entrypoint with broad intent routing and optional custom user intent.

---

## 3. CONTRACT

**Inputs:** `$ARGUMENTS` with optional flags from frontmatter `argument-hint`.

**Outputs:**
- Creation modes: `.opencode/output/visual/{mode}-{descriptor}-{timestamp}.html`
- Fact-check mode: `.opencode/output/visual/{descriptor}-verified.html`

**Status:**
- Success: `STATUS=OK ACTION=<create|verify> PATH=<output-path>`
- Failure: `STATUS=FAIL ERROR="<message>"`

---

## 4. MODE ROUTING

| `--mode` intent | Primary behavior | Internal routed mode |
| --- | --- | --- |
| `auto` | Infer intent from target and flags | `generate` \| `plan-review` \| `diff-review` \| `recap` \| `fact-check` |
| `create` | Build a new visual output | `generate` |
| `analyze` | Review content, docs, or changes | `plan-review` \| `diff-review` \| `recap` |
| `verify` | Check and correct existing visual output | `fact-check` |
| `custom` | User-defined intent text | Resolver selects best-fit mode (ask when ambiguous) |

---

## 5. REFERENCE SOURCES

Load `sk-visual-explainer` and relevant references per mode:
- `.opencode/skill/sk-visual-explainer/SKILL.md`
- `references/quick_reference.md`
- `references/css_patterns.md`
- `references/quality_checklist.md`
- Additional references based on mode and flags

---

## 6. EXAMPLES

```bash
/create:visual_html "CI/CD architecture" --mode generate --style blueprint
/create:visual_html "specs/007-auth/plan.md" --mode analyze --artifact plan
/create:visual_html "feature/oauth-refresh" --mode analyze --include-doc-impact
/create:visual_html "2w" --mode analyze --spec-folder "specs/007-auth" --include-doc-health
/create:visual_html ".opencode/output/visual/plan-review-auth-20260222-113000.html" --mode verify --source-file "specs/007-auth/plan.md"
/create:visual_html "Map this release into a visual risk board for engineers and PMs" --mode custom
```
