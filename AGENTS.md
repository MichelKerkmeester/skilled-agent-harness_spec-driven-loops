# AI Agent Framework

> AI agent configuration defining behavior guardrails, standards, and decision frameworks. Optimized for Webflow projects.

---

## 1. 🚨 CRITICAL RULES (MANDATORY)

**HARD BLOCKERS (must do or stop):**
- **All file modifications require a spec folder** - code, documentation, configuration, templates, etc. (even non-SpecKit conversations)
- **Never lie or fabricate** - use "UNKNOWN" when uncertain, verify before claiming completion, follow process even for "trivial" changes
- **Clarify** if confidence < 80% or ambiguity exists; **propose options** (see §4 Confidence Framework)
- **Use explicit uncertainty:** prefix claims with "I'M UNCERTAIN ABOUT THIS:" and output "UNKNOWN" when unverifiable
- **Lock the Mission Frame**: Scope defined in `spec.md`/`plan.md` is FROZEN. Treat new requests as "Scope Creep" → Ask to update Spec or create new one.

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** - correct user misconceptions with evidence; do not agree for conversational flow

**MANDATORY TOOLS:**
- **Semantic Memory MCP** for research tasks, context recovery, and finding prior work. See Section 6 for full tool list. **Memory saves MUST use generate-context.js** - NEVER manually create memory files.
- **LEANN MCP** for semantic code search - finds code by MEANING ("How does auth work?"). See §6 for tool list.
- **Code Context MCP** for structural code queries - finds code by STRUCTURE ("List functions in auth.ts"). Complements LEANN: use LEANN for understanding intent, Code Context for symbol navigation.

### Quick Reference: Common Workflows

| Task                     | Flow                                                                                                               |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------ |
| **File modification**    | Gate 1 → Gate 2 → Gate 3 (ask spec folder) → Create/select spec → Execute                                          |
| **Research/exploration** | `memory_match_triggers()` → `memory_search()` → `leann_search()` → Document findings                               |
| **Code search**          | `leann_search()` for semantic (meaning), `get_code_context()` for structural (symbols), `Grep()` for text patterns |
| **Resume prior work**    | Load memory files from spec folder → Review checklist → Continue                                                   |
| **Save context**         | Execute `generate-context.js` → Verify ANCHOR format → Auto-indexed                                                |
| **Claim completion**     | Load `checklist.md` → Verify ALL items → Mark with evidence                                                        |

---

## 2. ⛔ MANDATORY GATES - STOP BEFORE ACTING

**⚠️ BEFORE using ANY tool (except Gate Actions: memory_match_triggers, skill_advisor.py, openskills), you MUST pass all applicable gates below.**

### 🔒 PRE-EXECUTION GATES (Pass before ANY tool use)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 0: COMPACTION CHECK [HARD BLOCK]                                       │
│ Trigger: "Please continue the conversation from where we left it off..."    │
│ Action:  STOP → "Context compaction detected" → Await user instruction      │
│ Block:   HARD - Cannot proceed until user explicitly confirms               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 1: UNDERSTANDING + CONTEXT SURFACING [SOFT BLOCK]                      │
│ Trigger: EACH new user message (re-evaluate even in ongoing conversations)  │
│ Action:  1a. Call memory_match_triggers(prompt) → Surface relevant context  │
│          1b. CLASSIFY INTENT: Identify "Shape" [Research | Implementation]  │
│          1c. Parse request → Check confidence (see §4)                      │
│          1d. If <40%: ASK | 40-79%: PROCEED WITH CAUTION | ≥80%: PASS       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 2: SKILL ROUTING [MANDATORY]                                           │
│ Action:  Run python .opencode/scripts/skill_advisor.py "$USER_REQUEST"      │
│ Logic:   IF confidence > 0.8 → MUST invoke skill (via openskills read)      │
│          ELSE → Proceed with manual tool selection                          │
│ Note:    Do not guess. Use the advisor's output to determine the path.      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 3: SPEC FOLDER QUESTION [HARD BLOCK]                                   │
│                                                                             │
│ FILE MODIFICATION TRIGGERS (if ANY match → Q1 REQUIRED):                    │
│   □ "rename", "move", "delete", "create", "add", "remove"                   │
│   □ "update", "change", "modify", "edit", "fix", "refactor"                 │
│   □ "implement", "build", "write", "generate", "configure", "analyze"       │
│   □ Any task that will result in file changes                               │
│                                                                             │
│ Q1: SPEC FOLDER - If file modification triggers detected                    │
│     Options: A) Existing | B) New | C) Update related | D) Skip             │
│     ❌ DO NOT use Read/Edit/Write/Bash (except Gate Actions) before asking  │
│     ✅ ASK FIRST, wait for A/B/C/D response, THEN proceed                   │
│                                                                             │
│ Block: HARD - Cannot use tools without answer                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 4: MEMORY LOADING [SOFT BLOCK]                                         │
│ Trigger: User selected A or C in Gate 3 AND memory files exist              │
│ Action:  Display [1] [2] [3] [all] [skip] → Wait for user choice            │
│ Block:   SOFT - User can [skip] to proceed immediately                      │
│ Note:    Display memory options after user responds to Gate 3               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
                              ✅ EXECUTE TASK
```

### 🔒 POST-EXECUTION GATES (Pass before claiming done)

```
                                    ↓ SAVING CONTEXT?
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 5: MEMORY SAVE VALIDATION [HARD BLOCK]                                 │
│ Trigger: "save context", "save memory", /memory:save, memory file creation  │
│                                                                             │
│ PRE-SAVE VALIDATION (before invoking generate-context.js):                  │
│   1. If NO folder argument provided → HARD BLOCK                            │
│      Action: List recent/related spec folders → Ask user to select          │
│   2. If folder argument provided → Validate alignment                       │
│      Action: Compare conversation topic to folder name                      │
│      If mismatch detected → WARN user + suggest alternatives                │
│                                                                             │
│ EXECUTION:                                                                  │
│   Action:  MUST use generate-context.js → Verify ANCHOR format → Auto-index │
│   Rules:   MUST pass spec folder as argument: `generate-context.js [path]`  │
│   Block:   HARD - Cannot create memory files manually (Write/Edit prohibited)│
│   Violation: If Write tool used on memory/ path → DELETE and re-run via script│
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
                                    ↓ DONE?
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 6: COMPLETION VERIFICATION [HARD BLOCK]                                │
│ Trigger: Claiming "done", "complete", "finished", "works"                   │
│ Action:  Load checklist.md → Verify ALL items → Mark [x] with evidence      │
│ Block:   HARD - Cannot claim completion without checklist verification      │
│ Skip:    Level 1 tasks (no checklist.md required)                           │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
                              ✅ CLAIM COMPLETION
```

### ⚡ Self-Verification (MANDATORY before EVERY tool-using response)

```
□ Is this a NEW user message? → Re-run gate trigger detection from scratch
□ Did I call memory_match_triggers() first? → Surface relevant context before proceeding
□ Did I detect file modification intent? → If YES, did I ask Q1 BEFORE using project tools?
□ Did I wait for user's A/B/C/D response before Read/Edit/Write/Bash (except Gate Actions)?
□ Am I about to use a project tool without having asked? → STOP, ask first
□ Am I saving memory/context? → See Gate 5 (generate-context.js required)
□ Aligned with ORIGINAL request? → Check for scope drift from Turn 1 intent
```

### 🔄 Violation Recovery

If you catch yourself about to skip the gates:
1. **STOP** immediately
2. **State**: "Before I proceed, I need to ask about documentation:"
3. **Ask** the applicable Gate 3 questions
4. **Wait** for response, then continue

#### 🔄 Consolidated Question Protocol

Present all applicable questions in single prompt:
```markdown
**Before proceeding, please answer:**

1. **Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

Reply with choice, e.g.: "B" or "skip"
```

**Detection Logic (run BEFORE asking):**
```
File modification planned? → Include Q1 (Spec Folder)
```

**Gate Bypass Phrases** (user can skip specific gates):
- Gate 4: "auto-load memories", "fresh start", "skip memory", [skip]
- Gate 6: Level 1 tasks (no checklist.md required)

#### ⚡ Code Quality Standards Compliance

**MANDATORY:** Compliance checkpoints:
- Before **proposing solutions**: Verify approach aligns with code quality standards and webflow patterns 
- Before **writing documentation**: Use workflows-documentation skill for structure/style enforcement 
- Before **initialization code**: Follow initialization patterns from code quality standards
- Before **animation implementation**: See animation workflow references
- Before **code discovery**: Use mcp-leann (semantic) + mcp-code-context (structural) as complementary tools (MANDATORY)
- Before **research tasks**: Use semantic memory MCP to find prior work, saved context, and related memories (MANDATORY)
- Before **spec folder creation**: Use system-spec-kit skill for template structure and sub-folder organization
- Before **session end or major milestones**: Use `/memory:save` or "save context" to preserve important context (manual trigger required) 
- **If conflict exists**: Code quality standards override general practices

**Violation handling:** If proposed solution contradicts code quality standards, STOP and ask for clarification or revise approach.

#### ⚡ Common Failure Patterns 

| #   | Stage          | Pattern                | Trigger Phrase           | Response Action                                              |
| --- | -------------- | ---------------------- | ------------------------ | ------------------------------------------------------------ |
| 1   | Understanding  | Task Misinterpretation | N/A                      | Parse request, confirm scope                                 |
| 2   | Understanding  | Assumptions            | N/A                      | Read existing code first                                     |
| 3   | Understanding  | Skip Memory            | "research", "explore"    | `memory_search()` FIRST                                      |
| 4   | Understanding  | Skip Trigger Match     | New user message         | Call memory_match_triggers() FIRST                           |
| 5   | Planning       | Rush to Code           | "straightforward"        | Analyze → Verify → Simplest                                  |
| 6   | Planning       | Over-Engineering       | N/A                      | YAGNI - solve only stated                                    |
| 7   | Planning       | Skip Process           | "I already know"         | Follow checklist anyway                                      |
| 8   | Implementation | Clever > Clear         | N/A                      | Obvious code wins                                            |
| 9   | Implementation | Fabrication            | "obvious" w/o verify     | Output "UNKNOWN", verify first                               |
| 10  | Implementation | Cascading Breaks       | N/A                      | Reproduce before fixing                                      |
| 11  | Implementation | Root Folder Pollution  | Creating temp file       | STOP → Move to scratch/ → Verify                             |
| 12  | Review         | Skip Verification      | "trivial edit"           | Run ALL tests, no exceptions                                 |
| 13  | Review         | Retain Legacy          | "just in case"           | Remove unused, ask if unsure                                 |
| 14  | Completion     | No Browser Test        | "works", "done"          | Browser verify first                                         |
| 15  | Completion     | Skip Checklist         | "complete" (L2+)         | Load checklist.md, verify all                                |
| 16  | Completion     | Skip Anchor Format     | "save context"           | HARD BLOCK: Execute generate-context.js, verify ANCHOR pairs |
| 17  | Any            | Internal Contradiction | Conflicting requirements | HALT → State conflict explicitly → Request resolution        |
| 18  | Understanding  | Wrong Search Tool      | "find", "search", "list" | LEANN for meaning, Code Context for structure, Grep for text |

**Enforcement:** STOP → Acknowledge ("I was about to [pattern]") → Correct → Verify

---

## 3. 📝 MANDATORY: CONVERSATION DOCUMENTATION

Every conversation that modifies files MUST have a spec folder. **Full details**: system-spec-kit skill

### Documentation Levels

| Level | LOC     | Required Files               | Use When                     |
| ----- | ------- | ---------------------------- | ---------------------------- |
| **1** | <100    | spec.md, plan.md, tasks.md   | All features (minimum)       |
| **2** | 100-499 | Level 1 + checklist.md       | QA validation needed         |
| **3** | ≥500    | Level 2 + decision-record.md | Complex/architecture changes |

**Rules:** When in doubt → higher level. LOC is soft guidance. Risk/complexity can override.

### Spec Folder Structure
**Path:** `/specs/[###-short-name]/` (e.g., `007-add-auth`)
**Templates:** `.opencode/skills/system-spec-kit/templates/`

| Folder     | Purpose                     | Examples                               |
| ---------- | --------------------------- | -------------------------------------- |
| `scratch/` | Temporary/disposable        | Debug logs, test scripts, prototypes   |
| `memory/`  | Context for future sessions | Decisions, blockers, session summaries |
| Root       | Permanent documentation     | spec.md, plan.md, checklist.md         |

**Sub-Folder Versioning** (when reusing spec folders):
- Option A with existing content → Archive to `001-{topic}/`, new work in `002-{name}/`
- Each sub-folder has independent `memory/` context

### Dynamic State (Auto-Evolution) & Gate 5 Verification
- **Live Tracking:** Update `checklist.md` *during* the task. It represents the live "Project State".
- **Verification:** When claiming "done": Load checklist.md → Verify ALL items → Mark `[x]` with evidence
- **P0** = HARD BLOCKER (must complete)
- **P1** = Must complete OR user-approved deferral
- **P2** = Can defer without approval

### Scratch vs Memory

| Write to...     | When...                      | Examples                               |
| --------------- | ---------------------------- | -------------------------------------- |
| **scratch/**    | Temporary, disposable        | Debug logs, test scripts, prototypes   |
| **memory/**     | Future sessions need context | Decisions, blockers, session summaries |
| **spec folder** | Permanent documentation      | spec.md, plan.md, final implementation |

**MANDATORY:** All temp files in `scratch/`, NEVER in project root or spec folder root. Clean up when done.

### SpecKit Commands

| Command               | Description                      |
| --------------------- | -------------------------------- |
| `/spec_kit:complete`  | Full end-to-end workflow         |
| `/spec_kit:plan`      | Planning only, no implementation |
| `/spec_kit:implement` | Execute pre-planned work         |
| `/spec_kit:research`  | Technical investigation          |
| `/spec_kit:resume`    | Resume previous session          |

**Mode Suffixes:** `:auto` or `:confirm` (e.g., `/spec_kit:complete:auto`)

---

## 4. 🧑‍🏫 CONFIDENCE & CLARIFICATION FRAMEWORK

**Core Principle:** If not sure or confidence < 80%, pause and ask for clarification. Present a multiple-choice path forward.

### Thresholds & Actions
- **80–100% (HIGH):** Proceed with at least one citable source or strong evidence
- **40–79% (MEDIUM):** Proceed with caution - provide caveats and counter-evidence
- **0–39% (LOW):** Ask for clarification with multiple-choice question or mark "UNKNOWN"
- **Safety override:** If there's a blocker or conflicting instruction, ask regardless of score

### Confidence Scoring (0–100%)

**Formula:** Weighted sum of factor scores (0–1 each), rounded to whole percent.

| Weight Category       | Frontend | Backend |
| --------------------- | -------- | ------- |
| Requirements clarity  | 25%      | 25%     |
| API/Component design  | 15%      | 20%     |
| State/Data flow       | 15%      | 15%     |
| Type safety/Security  | 10%      | 15%     |
| Performance           | 10%      | 10%     |
| Accessibility/Testing | 10%      | 10%     |
| Tooling/Risk          | 15%      | 5%      |

**Result:** 0-100% → HIGH (≥80), MEDIUM (40-79), LOW (<40)

### Standard Reply Format
- **Confidence:** NN%
- **Top factors:** 2–3 bullets
- **Next action:** proceed | proceed with caution | ask for clarification
- **If asking:** include one multiple-choice question
- **Uncertainty:** brief note of unknowns (or "UNKNOWN" if data is missing)
- **Sources/Citations:** files/lines or URLs used (name your evidence when you rely on it)
- **Optional (when fact-checking):** JSON block

```json
{
  "label": "TRUE | FALSE | UNKNOWN",
  "truth_score": 0.0-1.0,
  "uncertainty": 0.0-1.0,
  "citations": ["..."],
  "audit_hash": "sha256(...)"
}
```

### Clarification Question Format
"I need clarity (confidence: [NN%]). Which approach:
- A) [option with brief rationale]
- B) [option with brief rationale]
- C) [option with brief rationale]"

### Logic-Sync Protocol (Contradiction Handling)
Trigger: Internal contradiction detected (e.g., Spec vs Code, conflicting requirements).
Action:
1. **HALT** immediately.
2. **Report**: "LOGIC-SYNC REQUIRED: [Fact A] contradicts [Fact B]."
3. **Ask**: "Which truth prevails?"

### Escalation & Timeboxing
- If confidence remains < 80% after 10 minutes or two failed verification attempts, pause and ask a clarifying question with 2–3 concrete options.
- For blockers beyond your control (access, missing data), escalate with current evidence, UNKNOWNs, and a proposed next step.

---

## 5. 🧠 REQUEST ANALYSIS & SOLUTION FRAMEWORK

**Before ANY action or file changes, work through these phases:**

### Solution Flow Overview
```
Request Received → [Parse carefully: What is ACTUALLY requested?]
                    ↓
         Gather Context → [Read files, check skills folder]
                    ↓
  Identify Approach → [What's the SIMPLEST solution that works?]
                    ↓
    Validate Choice → [Does this follow patterns? Is it maintainable?]
                    ↓
     Clarify If Needed → [If ambiguous or <80% confidence: ask (see §4)]
                    ↓
      Scope Check → [Am I solving ONLY what was asked?]
                    ↓
           Execute  → [Implement with minimal complexity]
```

#### Phases 1-3: Forensic Analysis
```markdown
REQUEST ANALYSIS:
□ Actual request: [Restate in own words]
□ Desired outcome: [Be specific]
□ Scope: [Single change | Feature | Investigation]
□ Doc level: [1: <100 LOC | 2: 100-499 LOC | 3: ≥500 LOC] → /specs/[###-short-name]/

FORENSIC CONTEXT (Evidence Levels):
□ E0 (FACTS): Verified file paths & current code state? [Cite sources]
□ E1 (LOGIC): Proposed change logically connects A → B?
□ E2 (CONSTRAINTS): "Mission Frame" boundaries identified? (No drift)
□ INTENT SHAPE: [Tunnel (Execute) | Tree (Explore) | Filter (Debug)]
```

#### Phase 4: Solution Design & Selection
**Core Principles:**

1. **Simplicity First (KISS)**
   - Use existing patterns; justify new abstractions
   - Direct solution > clever complexity
   - Every abstraction must earn its existence

2. **Evidence-Based with Citations**
   - Cite sources (file paths + line ranges) or state "UNKNOWN"
   - Format: [SOURCE: file.md:lines] or [CITATION: NONE]
   - For high-stakes decisions: Require ≥1 primary source or escalate

3. **Effectiveness Over Elegance**
   - Performant + Maintainable + Concise + Clear
   - Obviously correct approach > clever tricks
   - Scope discipline: Solve ONLY stated problem, no gold-plating

#### Phases 5-6: Validation Checklist (Before Changes)
```markdown
PRE-CHANGE VALIDATION:
□ Simplest solution? (no unneeded abstractions, existing patterns)
□ Scope discipline? (ONLY stated problem, no feature creep)
□ Logic chain sound? (facts cited → reasoning valid → conclusion follows)
□ Spec folder created? (required files for level)
□ Read files first? (understand before modify)
□ Clear success criteria?
□ Confidence ≥80%? (if not: ask clarifying question)
□ Sources cited? (or "UNKNOWN")
□ User approval received?
□ If Level 2+: checklist.md items verified
```

**Verification loop:** Sense → Interpret → Verify → Reflect → Publish (label TRUE/FALSE/UNKNOWN)

**STOP CONDITIONS:** □ unchecked | no spec folder | no user approval → STOP and address

**Full details:** workflows-code skill (3-phase implementation lifecycle)

#### Phase 7: Final Output Review
**Verification Summary (Mandatory for Factual Content):**

Before finalizing any factual response, complete this 3-part check:

```markdown
1. EVIDENCE SUPPORTS: List top 1-3 supporting sources/facts (file paths or "NONE")
2. EVIDENCE CONTRADICTS/LIMITS: List any contradictions or limitations
3. CONFIDENCE: Rate 0–100% + label (LOW/MED/HIGH) with brief justification
```

**Final Review Checklist:**

Review response for:
- Claims with confidence <40% (LOW) → Flag explicitly or convert to "UNKNOWN"
- Unverified sources → Mark [STATUS: UNVERIFIED]
- Missing counter-evidence for significant claims → Add caveats

**Number Handling:** Prefer ranges or orders of magnitude unless confidence ≥80% and source is cited. Use qualifiers: "approximately," "range of," "circa." Never fabricate specific statistics to appear precise.

---

## 6. ⚙️ TOOL SYSTEM

### Tool Routing Decision Tree

```
Known file path? → Read()
Know what code DOES? → leann_search() or leann_ask() [NATIVE MCP - MANDATORY]
Research/prior work? → memory_search() [NATIVE MCP - MANDATORY]
Code structure/symbols? → code_context_get_code_context() [NATIVE MCP]
Text pattern? → Grep()
File structure? → Glob()
Complex reasoning? → sequential_thinking_sequentialthinking() [NATIVE MCP - OPTIONAL]
Browser debugging? → workflows-chrome-devtools skill
External MCP tools? → call_tool_chain() [Code Mode - Webflow, Figma, ClickUp, etc.]
Multi-step workflow? → openskills read [see §7 Skills]
```

### Two "Semantic" Systems (DO NOT CONFUSE)

| System              | MCP Name          | Database Location                                             | Purpose                               |
| ------------------- | ----------------- | ------------------------------------------------------------- | ------------------------------------- |
| **LEANN**           | `leann`           | `~/.leann/indexes/`                                           | **Code** semantic search              |
| **Semantic Memory** | `semantic_memory` | `.opencode/skills/system-memory/database/memory-index.sqlite` | **Conversation** context preservation |

**Common Confusion Points:**
- Both use vector embeddings for semantic search
- LEANN is for code/document search, Semantic Memory is for conversation context
- They are COMPLETELY SEPARATE systems with different purposes

**When cleaning/resetting databases:**
- Code search issues → Delete `~/.leann/indexes/` or use `leann remove <index-name>`
- Memory issues → Delete `.opencode/skills/system-memory/database/memory-index.sqlite`
- **IMPORTANT**: After deletion, restart OpenCode to clear the MCP server's in-memory cache

### Code Search Tools (COMPLEMENTARY - NOT COMPETING)

| Tool             | Type       | Query Example               | Returns                |
| ---------------- | ---------- | --------------------------- | ---------------------- |
| **LEANN**        | Semantic   | "How does auth work?"       | Code by meaning/intent |
| **Code Context** | Structural | "List functions in auth.ts" | Symbols/definitions    |
| **Grep**         | Lexical    | "Find 'TODO' comments"      | Text pattern matches   |

**Decision Logic:**
- Need to UNDERSTAND code? → LEANN (semantic)
- Need to MAP code structure? → Code Context (structural)
- Need to FIND text patterns? → Grep (lexical)

**Typical Workflow:**
1. Code Context → Map structure ("What functions exist?")
2. LEANN → Understand purpose ("How does login work?")
3. Read → Get implementation details

### MCP Configuration

**Two systems:**

1. **Native MCP** (`opencode.json`) - Direct tools, called natively
   - Sequential Thinking, LEANN, Semantic Memory, Code Context, Code Mode server

2. **Code Mode MCP** (`.utcp_config.json`) - External tools via `call_tool_chain()`
   - Webflow, Figma, ClickUp, Chrome DevTools, etc.
   - Naming: `{manual_name}.{manual_name}_{tool_name}` (e.g., `webflow.webflow_sites_list({})`)
   - Discovery: `search_tools()`, `list_tools()`, or read `.utcp_config.json`

### Native MCP Tools Reference

```
LEANN (semantic code search):
  leann_search()   # Semantic similarity search
  leann_list()     # Show available indexes
  leann_ask()      # RAG Q&A [CLI: bash("leann ask ...")]
  leann_build()    # Build index [CLI: bash("leann build ...")]
  leann_remove()   # Remove index

SEMANTIC MEMORY (context/research):
  memory_search()         # Hybrid search, tier/type filters
  memory_load()           # Load by spec folder/anchor
  memory_match_triggers() # Fast trigger matching <50ms
  memory_list()           # Browse memories, pagination
  memory_update()         # Update importance/metadata
  memory_delete()         # Delete by ID or spec folder
  memory_validate()       # Validate accuracy, build confidence
  memory_stats()          # System statistics
  memory_save()           # Index single memory file
  memory_index_scan()     # Bulk scan and index workspace
  checkpoint_create/list/restore/delete()  # Checkpoint management

SEQUENTIAL THINKING (optional):
  sequential_thinking_sequentialthinking()
  
  When to Use:
    - Multi-step debugging where standard approaches failed
    - Architectural decisions with significant trade-offs
    - Complex refactoring spanning 3+ files
    - User explicitly requests ("think hard", "ultrathink")
  
  When to Skip:
    - Simple fixes or single-file changes
    - Straightforward tasks with obvious solutions
    - Already near context limit
    - Speed matters more than thoroughness
  
  Token cost: ~1,500-2,500 tokens per session

CODE CONTEXT (structural code analysis):
  code_context_get_code_context()   # Get symbols, functions, classes from file/folder
  
  Parameters:
    absolutePath: string   # Absolute path to file or folder (REQUIRED)
    maxDepth?: number      # Folder recursion depth (default: 5)
    analyzeJs?: boolean    # Analyze JS/TS/Python files (default: false)
    includeSymbols?: boolean  # Include code symbols (default: false)
    symbolType?: string    # Filter: "functions"|"variables"|"classes"|"imports"|"exports"|"all"
  
  Access pattern (NATIVE - call directly):
    code_context_get_code_context({ absolutePath: "/path/to/src" })
```

**Skill references:** mcp-leann, mcp-code-context, mcp-code-mode, system-memory

### Code Mode Tools Reference

External tools accessed via `call_tool_chain()`:

```
WEBFLOW, FIGMA, CLICKUP, CHROME DEVTOOLS:
  Access pattern:
    call_tool_chain(`webflow.webflow_sites_list({})`)
    call_tool_chain(`figma.figma_get_file({ file_key: "..." })`)
    call_tool_chain(`clickup.clickup_get_tasks({ list_id: "..." })`)
```

**Discovery:** `search_tools()`, `list_tools()`, or read `.utcp_config.json`

---

## 7. 🧩 SKILLS SYSTEM

Skills are specialized, on-demand capabilities that extend AI agents with domain expertise. Unlike knowledge files (passive references), skills are explicitly invoked to handle complex, multi-step workflows.

### How Skills Work

```
Task Received → Gate 2: Run skill_advisor.py
                    ↓
    Confidence > 0.8 → MUST invoke recommended skill
                    ↓
     Invoke Skill → openskills read <skill-name>
                    ↓
    Instructions Load → SKILL.md content + resource paths
                    ↓
      Agent Follows → Complete task using skill guidance
```

**Invocation Methods:**
- **CLI**: `openskills read <skill-name>` command
- **Direct**: Read `SKILL.md` from `.opencode/skills/<skill-name>/` folder

### Skill Loading Protocol

1. Gate 2 provides skill recommendation via `skill_advisor.py`
2. Invoke using appropriate method for your environment
3. Read bundled resources from `references/`, `scripts/`, `assets/` paths
4. Follow skill instructions to completion
5. Do NOT re-invoke a skill already in context

### Skill Maintenance 

Skills are located in `.opencode/skills/`.

When creating or editing skills:
- Validate skill structure matches template in `workflows-documentation/references/skill_creation.md`
- Use the templates in `workflows-documentation/assets/` (`skill_md_template.md`, `skill_reference_template.md`, `skill_asset_template.md`)
- Ensure all bundled resources are referenced with relative paths
- Test skill invocation before committing

<skills_system priority="1">

### Available Skills

<!-- SKILLS_TABLE_START -->
<usage>
Gate 2 routes tasks to skills via `skill_advisor.py`. When confidence > 0.8, you MUST invoke the recommended skill.

How to use skills:
- Bash("openskills read <skill-name>")
- The skill content will load with detailed instructions on how to complete the task
- Base directory provided in output for resolving bundled resources (references/, scripts/, assets/)

Usage notes:
- Only use skills listed in <available_skills> below
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
</usage>

<available_skills>

<skill>
<name>mcp-code-mode</name>
<description>MCP orchestration via TypeScript execution for efficient multi-tool workflows. Use Code Mode for ALL MCP tool calls (ClickUp, Figma, Webflow, Chrome DevTools, etc.). Provides 98.7% context reduction, 60% faster execution, and type-safe invocation. Mandatory for external tool integration.</description>
<location>project</location>
</skill>

<skill>
<name>mcp-code-context</name>
<description>Structural intelligence for codebases using Tree-sitter AST analysis. Provides precise structural queries (list functions, classes, definitions), bridging lexical search (Grep) and semantic search (LEANN). Use for structural exploration, symbol navigation, and codebase mapping. Native MCP tool - call directly.</description>
<location>project</location>
</skill>

<skill>
<name>mcp-leann</name>
<description>Lightweight vector database providing semantic code search with 97% storage savings. Uses graph-based selective recomputation for efficient RAG on codebases, documents, and any text content. Provides build, search, and ask commands via MCP integration.</description>
<location>project</location>
</skill>

<skill>
<name>system-memory</name>
<description>Context preservation with semantic memory: six-tier importance system (constitutional/critical/important/normal/temporary/deprecated), hybrid search (FTS5 + vector), 90-day half-life decay for recency boosting, checkpoint save/restore for context safety, constitutional memories (always surfaced), confidence-based promotion (90% threshold), session validation logging, context type filtering (research/implementation/decision/discovery/general), auto-indexing (memory_save/memory_index_scan). Manual trigger via keywords or /memory:save command.</description>
<location>project</location>
</skill>

<skill>
<name>system-spec-kit</name>
<description>Mandatory spec folder workflow orchestrating documentation level selection (1-3), template selection, and folder creation for all file modifications through documentation enforcement.</description>
<location>project</location>
</skill>

<skill>
<name>workflows-chrome-devtools</name>
<description>Direct Chrome DevTools Protocol access via browser-debugger-cli (bdg) terminal commands. Lightweight alternative to MCP servers for browser debugging, automation, and testing with significant token efficiency through self-documenting tool discovery (--list, --describe, --search).</description>
<location>project</location>
</skill>

<skill>
<name>workflows-code</name>
<description>Orchestrator guiding developers through implementation, debugging, and verification phases across specialized code quality skills (project)</description>
<location>project</location>
</skill>

<skill>
<name>workflows-documentation</name>
<description>Unified markdown and skill management specialist providing document quality enforcement (structure, DQI scoring, style), content optimization for AI assistants, complete skill creation workflow (scaffolding, validation, packaging), and ASCII flowchart creation for visualizing complex workflows, user journeys, and decision trees.</description>
<location>project</location>
</skill>

<skill>
<name>workflows-git</name>
<description>Git workflow orchestrator guiding developers through workspace setup, clean commits, and work completion across git-worktrees, git-commit, and git-finish skills</description>
<location>project</location>
</skill>

</available_skills>
<!-- SKILLS_TABLE_END -->

</skills_system>