---
description: Create or update OpenCode skills via one unified command with operation routing. :auto/:confirm.
argument-hint: "<skill-name> [operation] [type] [--path <dir>] [--chained] [:auto|:confirm] (:auto supports PRE-BOUND SETUP ANSWERS: prompt-body block for non-interactive setup)"
allowed-tools: Read, Write, Edit, Bash, Glob, Grep, TodoWrite, mcp__cocoindex_code__search
---

> ⚠️ **EXECUTION PROTOCOL - READ FIRST**
>
> This command is the canonical entrypoint for skill command workflows.
> Do not split behavior across legacy command definitions.
>
> Mandatory execution order:
> 1. Run Phase 0 verification (`@markdown` or valid chained handoff)
> 2. Run unified setup (single consolidated prompt)
> 3. Verify required phase outputs are present
> 4. Route by mode (`:auto` or `:confirm`)
> 5. Route by operation (`full-create`, `full-update`, `reference-only`, `asset-only`)
> 6. Load and execute the selected unified YAML workflow

---

# 🚨 MANDATORY FIRST ACTION - DO NOT SKIP

Before reading any other section, execute Phase 0 and setup validation.
Do not infer missing command arguments from prior conversation context.

---

# 🚨 PHASE 0: @MARKDOWN AGENT VERIFICATION

**STATUS: ☐ BLOCKED**

```text
EXECUTE THIS AUTOMATIC SELF-CHECK (NOT A USER QUESTION):

SELF-CHECK: Are you operating as @markdown OR under a valid chained parent handoff?
|
|- CASE A: Valid chained handoff detected (--chained)
|  |- Required parent fields present?
|  |  - skill_name
|  |  - operation
|  |  - execution_mode
|  |  - parent_create_agent_verified=true
|  |  - type (required only for reference-only or asset-only)
|  |- IF all present:
|  |  - create_agent_verified = skipped-chained
|  |  - chained_handoff_valid = true
|  |  - phase_0_status = PASSED
|  |- IF missing required parent fields:
|     - chained_handoff_valid = false
|     - fall through to CASE B
|
|- CASE B: Standalone invocation
|  |- Verify @markdown indicators:
|  |  - Invoked with @markdown
|  |  - Template-first generation behavior available
|  |  - sk-doc quality validation behavior available
|  |- IF yes:
|  |  - create_agent_verified = true
|  |  - phase_0_status = PASSED
|  |- IF no/uncertain:
|     - HARD BLOCK and stop

HARD BLOCK MESSAGE:
"This command requires @markdown for template-first generation and sk-doc validation.
Restart with: @markdown /create:skill <skill-name> [operation] [type]"
```

Phase outputs:
- `create_agent_verified`
- `chained_handoff_valid`

---

# 🔒 UNIFIED SETUP PHASE

**STATUS: ☐ BLOCKED**

This command uses one consolidated setup prompt. Do not split setup questions.

### `:auto` Setup Resolution

Setup contract: see `.opencode/skills/system-spec-kit/references/workflows/auto_mode_contract.md`.

Under `execution_mode = AUTONOMOUS` (from the `:auto` suffix), follow the three-tier flow:

1. **Tier 1 — Resolve confidently** (contract §1): parse `$ARGUMENTS` flags + `PRE-BOUND SETUP ANSWERS:` block (§2) + the Default Resolution Table below (§3). When every required field is resolved, persist to `{spec_path}/create-skill-config.json` when a spec is linked, otherwise `/tmp/create-skill-config.json` (shape: `skillName`, `operation`, `type`, `skillPath`, `executionMode: "auto"`, `specChoice`, `specPath`, `memoryChoice`, `chainedHandoffValid`), bind runtime YAML placeholders, set `STATUS: PASSED`, load `.opencode/commands/create/assets/create_skill_auto.yaml`. End §0.

2. **Tier 2 — Targeted ask** (contract §1): when 1-2 required fields are genuinely ambiguous AND no default exists, emit ONE narrow question per ambiguous field. Command-specific Tier-2-eligible fields (per the Default Resolution Table below): `type`, `spec_choice`. **Ordering rule**: if `type` is required for `reference-only` or `asset-only`, ask only for `type` first — the answer may make the operation branch fully resolvable on the next Tier 1 pass.

3. **Tier 3 — Fail fast** (contract §4): emit the named-missing-inputs error format with `/create:skill:auto` as the command name. Exit non-zero. Do not load YAML.

`:confirm` path stays unchanged — see the consolidated setup prompt section below.

### PRE-BOUND SETUP ANSWERS Schema (for `:auto` non-interactive dispatch)

The dispatched prompt body may contain one structured marker block. Parse it before applying defaults. Grammar: see `auto_mode_contract.md` §2.

```yaml
PRE-BOUND SETUP ANSWERS:
  skill_name: my-skill  # hyphen-case string
  operation: full-create  # full-create | full-update | reference-only | asset-only
  type: workflow  # reference-only: workflow | patterns | debugging | tools | quick_ref; asset-only: template | lookup | example | guide
  skill_path: .opencode/skills/  # directory path
  execution_mode: AUTONOMOUS  # from :auto suffix
  spec_choice: new  # existing | new | update-related | skip | phase-folder
  spec_path: <spec-folder>  # explicit path when applicable
  memory_choice: skip  # latest | recent3 | skip | n/a
  chained_handoff_valid: false  # boolean
```

Rules: see `auto_mode_contract.md` §2 (unspecified fields fall back to default; marker fields take precedence over `$ARGUMENTS` flags; unknown fields warn; malformed lines parse-error).

### Default Resolution Table

| Field | Required | Resolves Via | Default | Tier-2 Candidate |
|-------|----------|--------------|---------|------------------|
| `skill_name` | Y | `$ARGUMENTS` first positional token, marker `skill_name`, or chained parent value | none | N |
| `operation` | Y | `$ARGUMENTS` second positional token, marker `operation`, or chained parent value | none | N |
| `type` | Conditional | `$ARGUMENTS` third positional token, marker `type`, or chained parent value when `operation` is `reference-only` / `asset-only` | none | Y, when operation requires type and type is ambiguous |
| `skill_path` | Y | flag `--path`, marker `skill_path`, or default | `.opencode/skills/` | N |
| `execution_mode` | Y | attached suffix `:auto` or marker `execution_mode` | `AUTONOMOUS` under `:auto` | N |
| `spec_choice` | Conditional | marker `spec_choice`, chained parent value, or targeted choice for `full-create` / `full-update` | none | Y, when full operation is selected and folder choice is ambiguous |
| `spec_path` | Conditional | marker `spec_path`, derived from `spec_choice`, or chained parent value | none | N |
| `memory_choice` | N | marker `memory_choice`, prior-work detection, or default | `skip` when no prior continuity records exist | N |
| `chained_handoff_valid` | N | flag `--chained` plus parent fields, marker `chained_handoff_valid`, or default | `false` | N |

**🚨 SINGLE CONSOLIDATED PROMPT - ONE USER INTERACTION**
```text
SETUP EXECUTION LOGIC:

1) Parse invocation shape
   - /create:skill <skill-name> [operation] [type] [--path <dir>] [--chained] [:auto|:confirm]

2) Parse mode suffix
   - :auto detected    -> execution_mode = AUTONOMOUS (omit mode question)
   - :confirm detected -> execution_mode = INTERACTIVE (omit mode question)
   - no suffix         -> execution_mode = ASK

3) Parse positional tokens
   - token 1: skill_name (if present)
   - token 2: operation (if present)
   - token 3: type (if present)

4) Parse flags
   - --path <dir>
   - --chained

5) Chained setup bypass logic
   - If chained_handoff_valid=true and all required fields for selected operation exist:
     - Skip setup prompt
     - Use parent values
   - If chained_handoff_valid=false or required chained fields missing:
     - Fall back to normal setup prompt

6) Determine which setup questions are required
   - Ask operation only when missing
   - Ask type only when operation requires it and type is missing/invalid
   - Ask execution mode only when no suffix is present
   - Ask spec folder choice only for full-create and full-update
   - Ask memory loading only when existing spec is selected and memory files exist

7) Ask ONE consolidated setup prompt with only missing items

   Q0. Skill Name (if missing)
       - Required format: hyphen-case (lowercase, digits, hyphens)

   Q1. Operation (if missing)
       A) full-create (new skill end-to-end)
       B) full-update (update existing skill and resources)
       C) reference-only (create/update one reference document)
       D) asset-only (create/update one asset document)

   Q2. Type (required only for reference-only or asset-only)
       - For reference-only: workflow | patterns | debugging | tools | quick_ref
       - For asset-only: template | lookup | example | guide

   Q3. Spec Folder (required for full-create/full-update)
       A) Existing
       B) New (recommended)
       C) Update related
       D) Skip
       E) Phase folder

       Optional for reference-only/asset-only:
       A) Attach existing spec path for continuity tracking
       B) Skip spec linkage

   Q4. Prior Work Context (when the existing spec has prior continuity records)
       A) Load most recent spec-doc record
       B) Load up to 3 most recent spec-doc records
       C) Skip

   Q5. Execution Mode (if no suffix)
       A) Interactive (:confirm)
       B) Autonomous (:auto)

8) Wait for user response and parse fields

9) Normalize setup outputs
   - skill_name
   - operation
   - type
   - skill_path (from --path or default .opencode/skills/)
   - execution_mode
   - spec_choice
   - spec_path
   - memory_choice

HARD STOPS:
- Do not infer missing operation or type from context
- Do not split setup across multiple prompts
- Do not continue with missing required fields for selected operation
```

Phase outputs:
- `skill_name`
- `operation`
- `type`
- `skill_path`
- `execution_mode`
- `spec_choice`
- `spec_path`
- `memory_choice`

---

# PHASE STATUS VERIFICATION (BLOCKING)

Verify all required values are set before YAML execution:

| Field | Required | Rule |
| --- | --- | --- |
| create_agent_verified | Yes | `true` or `skipped-chained` |
| skill_name | Yes | explicit, hyphen-case |
| operation | Yes | one of 4 operation values |
| type | Conditional | required for reference-only and asset-only |
| skill_path | Yes | default `.opencode/skills/` if omitted |
| execution_mode | Yes | `:auto` or `:confirm` |
| spec_choice | Conditional | required for full-create and full-update |
| spec_path | Conditional | required for spec choices A/B/C/E |

Proceed only when all required fields validate.

---

## 1. PURPOSE

Provide one canonical command entrypoint for skill lifecycle operations,
eliminating split logic across deprecated command definitions while preserving
strict @markdown + sk-doc + system-spec-kit behavior contracts.

## 2. CONTRACT

**Inputs:** `$ARGUMENTS` using canonical argument shape.

**Outputs:**
- Command execution through unified mode workflow and operation branch.
- Deterministic completion summary with status and path.

**Status patterns:**
- Success: `STATUS=OK PATH=<skill-root-or-target-file>`
- Failure: `STATUS=FAIL ERROR="<reason>"`
- Cancelled (confirm mode): `STATUS=CANCELLED ACTION=cancelled`

## 3. USER INPUT

```text
$ARGUMENTS
```

Accepted operation values:
- `full-create`
- `full-update`
- `reference-only`
- `asset-only`

Accepted mode suffix values:
- `:auto`
- `:confirm`

Accepted type values:
- reference-only: `workflow`, `patterns`, `debugging`, `tools`, `quick_ref`
- asset-only: `template`, `lookup`, `example`, `guide`

## 4. WORKFLOW OVERVIEW

| Step | Name | Purpose | Output |
| --- | --- | --- | --- |
| 1 | Phase 0 Verification | Ensure @markdown or valid chained handoff | `create_agent_verified` |
| 2 | Unified Setup | Capture all required parameters once | normalized setup fields |
| 3 | Phase Validation | Enforce required-field contract | phase pass/fail |
| 4 | Mode Routing | Route to auto or confirm unified YAML | target YAML path |
| 5 | Operation Routing | Select operation branch | operation-specific execution |
| 6 | Validation + Completion | Enforce quality gates and produce status | `STATUS=OK|FAIL|CANCELLED` |

## 5. INSTRUCTIONS

### Step 1: Run Phase 0
- Execute @markdown/chained verification.
- Hard block on failure.

### Step 2: Run Unified Setup
- Ask one consolidated prompt for missing values.
- Normalize and store outputs.

### Step 3: Run Phase Verification
- Validate required fields by operation.
- Re-prompt missing values only.

### Step 4: Route by Mode
- `:auto` -> load `create_skill_auto.yaml`.
- `:confirm` -> load `create_skill_confirm.yaml`.

### Step 5: Route by Operation
- Route to one branch: full-create/full-update/reference-only/asset-only.

### Step 6: Execute YAML + Report Completion
- Enforce gate model and validation loop.
- Return deterministic completion status.

---

## 6. MODE ROUTING

Mode route targets:
- `:auto` -> `.opencode/commands/create/assets/create_skill_auto.yaml`
- `:confirm` -> `.opencode/commands/create/assets/create_skill_confirm.yaml`

Default mode if omitted: `:confirm`.

Behavior summary:
- `:auto`: no approval checkpoints, stops for hard failures.
- `:confirm`: checkpointed execution with review/modify/abort options.

---

## 7. ARGUMENT ROUTING

```text
$ARGUMENTS
   |
   |- Parse mode suffix (:auto | :confirm)
   |
   |- Parse positional args:
   |   - skill_name
   |   - operation
   |   - type
   |
   |- Parse flags:
   |   - --path
   |   - --chained
   |
   |- If operation missing -> setup prompt Q1
   |
   |- If operation in {reference-only, asset-only} and type missing -> setup prompt Q2
   |
   |- If operation in {full-create, full-update} -> enforce spec folder setup Q3
   |
   '- Route execution to selected mode YAML and operation branch
```

---

## 8. OPERATION ROUTING CONTRACT

| Operation | Purpose | Type Required | Skill Must Exist |
| --- | --- | --- | --- |
| `full-create` | New skill end-to-end | No | No (hard block if exists) |
| `full-update` | Update existing skill and resources | No | Yes |
| `reference-only` | Create/update one reference doc | Yes | Yes |
| `asset-only` | Create/update one asset doc | Yes | Yes |

Branch guarantees:
- `full-create`: initializes and populates skill structure.
- `full-update`: modifies existing skill docs/resources without full re-init.
- `reference-only`: targets `references/` plus routing sync updates.
- `asset-only`: targets `assets/` plus routing sync updates.

---

## 9. VALIDATION AND QUALITY GATES

Hard gates:
- H0: create verification / valid chained handoff
- H1: required setup fields captured
- H2: operation/type compatibility
- H3: existence semantics (create vs update/doc-only)
- H4: sk-doc validation + DQI threshold

Soft gates:
- S1: similar skill discovery before full-create
- S2: optional resource expansion recommendations

DQI policy:
- hard minimum: 75
- target guidance:
  - full-create/full-update: 90
  - reference-only/asset-only: 80

Validation pipeline references:
- `.opencode/skills/sk-doc/scripts/quick_validate.py`
- `.opencode/skills/sk-doc/scripts/validate_document.py`
- `.opencode/skills/sk-doc/scripts/extract_structure.py`
- `.opencode/skills/sk-doc/scripts/package_skill.py`

Section boundary enforcement:
- `WHEN TO USE` = activation/use-case logic only
- `SMART ROUTING` = resource/file loading guidance only

---

## 10. MEMORY SAVE AND INDEXING

When spec tracking is active and context save is required:

1) Save context using system-spec-kit script:
- `node .opencode/skills/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`

2) Index immediately for retrieval:
- `memory_index_scan({ specFolder })` OR
- `memory_save({ filePath })`

Hard rule:
- Do not manually write memory files in `memory/`.

---

## 11. RUNTIME AGENT PATH RESOLUTION

Use `[runtime_agent_path]` based on active profile:
- Default profile -> `.opencode/agent`
- Codex profile -> `.codex/agents`
- Claude profile -> `.claude/agents`
- Gemini profile -> `.gemini/agents`

---

## 12. ERROR HANDLING

| Condition | Action |
| --- | --- |
| Missing `skill_name` | Re-prompt Q0 |
| Invalid `operation` | Re-prompt Q1 with valid options |
| Missing or invalid `type` for doc-only operations | Re-prompt Q2 with operation-specific values |
| `full-create` on existing skill | Offer reroute to `full-update` |
| Update/doc-only on missing skill | Offer reroute to `full-create` or corrected skill name |
| Validation failure (DQI/structure) | Enter fix-and-revalidate loop |
| Invalid chained handoff | Fall back to normal setup flow |

Recovery loop pattern:
1) Stop
2) State exact failure
3) Return to last valid gate
4) Re-run checks
5) Resume

---

## 13. EXAMPLES

Full create:
```text
/create:skill pdf-editor full-create :confirm
```

Full update:
```text
/create:skill pdf-editor full-update :auto
```

Reference only:
```text
/create:skill sk-doc reference-only workflow :confirm
```

Asset only:
```text
/create:skill sk-doc asset-only template :auto
```

Chained example:
```text
/create:skill sk-doc reference-only debugging --chained :auto
```

---

## 14. MIGRATION MAP

Canonical command strategy is active.

Deprecated invocation mapping:
- `/create:skill <skill-name> [:auto|:confirm]`
  -> `/create:skill <skill-name> full-create [:auto|:confirm]`

- `/create:skill_reference <skill-name> <reference-type> [--chained] [:auto|:confirm]`
  -> `/create:skill <skill-name> reference-only <reference-type> [--chained] [:auto|:confirm]`

- `/create:skill_asset <skill-name> <asset-type> [--chained] [:auto|:confirm]`
  -> `/create:skill <skill-name> asset-only <asset-type> [--chained] [:auto|:confirm]`

Canonical workflow files:
- `.opencode/commands/create/assets/create_skill_auto.yaml`
- `.opencode/commands/create/assets/create_skill_confirm.yaml`

---

## 15. RELATED COMMANDS

| Command | Purpose |
| --- | --- |
| `/create:prompt` | Builds prompt artifacts and may reference skill creation patterns |
| `/memory:save` | Manual context save trigger in active spec folders |

---

## 16. COMPLETION REPORT TEMPLATE

```text
Unified Skill Command Complete

Skill: [skill_name]
Operation: [operation]
Type: [type or N/A]
Mode: [:auto|:confirm]
Target: [skill_root_or_file]

Validation:
- Hard gates: PASSED
- DQI: [score] ([band])

Context:
- Spec path: [spec_path or none]
- Memory saved: [yes/no]
- Memory indexed: [yes/no]

STATUS=OK PATH=[target]
```

---

## 17. VIOLATION SELF-DETECTION (BLOCKING)

You are in violation if you:
- skip Phase 0 verification
- split setup prompts into multiple interactions
- proceed with missing required operation/type fields
- bypass create-vs-update existence checks
- claim completion without validation gate pass

Violation recovery protocol:
```text
1. STOP immediately.
2. STATE: "Violation detected: [exact issue]."
3. RETURN to the failed gate.
4. COMPLETE required checks or inputs.
5. RESUME from next valid step only.
```

---

Reference context files:
- `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`
- `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md`
- `.opencode/skills/sk-doc/assets/skill/skill_asset_template.md`
- `.opencode/skills/sk-doc/scripts/quick_validate.py`
- `.opencode/skills/sk-doc/scripts/validate_document.py`
- `.opencode/skills/sk-doc/scripts/extract_structure.py`
- `.opencode/skills/sk-doc/scripts/package_skill.py`

Always end user-facing execution with: "What would you like to do next?"
