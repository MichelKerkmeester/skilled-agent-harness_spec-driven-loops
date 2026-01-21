# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

#### 👨‍🚀 HOW TO USE / ADAPT THIS FRAMEWORK

1. Use this `AGENTS.md` as your starting point for SpecKit and memory workflows in any codebase.
2. Adapt the framework to fit your project's code standards, workflows, etc.
3. Update or extend rules, tools, and protocols as needed.
4. For practical setup examples and detailed instructions, see `.opencode/install_guides/SET-UP - AGENTS.md`.

---

## 1. 🚨 CRITICAL RULES (MANDATORY)

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 1).
- **Never lie or fabricate** - use "UNKNOWN" when uncertain.
- **Clarify** if confidence < 80% (see §4 Confidence Framework).
- **Use explicit uncertainty:** Prefix claims with "I'M UNCERTAIN ABOUT THIS:".

**QUALITY PRINCIPLES:**
- **Prefer simplicity**, reuse existing patterns, and cite evidence with sources
- Solve only the stated problem; **avoid over-engineering** and premature optimization
- **Verify with checks** (simplicity, performance, maintainability, scope) before making changes
- **Truth over agreement** - correct user misconceptions with evidence; do not agree for conversational flow

**HALT CONDITIONS (Stop and Report):**
- [ ] Target file does not exist or line numbers don't match.
- [ ] Syntax check or Tests fail after edit.
- [ ] Merge conflicts encountered.
- [ ] Edit tool reports "string not found".
- [ ] Test/Production boundary is unclear.

**MANDATORY TOOLS:**
- **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work.  **Memory saves MUST use `node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js [spec-folder-path]`** - NEVER manually create memory files.
- **Narsil MCP** for ALL code intelligence (semantic/structural search). Accessed via Code Mode.

### Quick Reference: Common Workflows

| Task                     | Flow                                                                                                                                       |
| ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **File modification**    | Gate 1 (spec folder) → Gate 2 → Gate 3 → Load memory context → Execute                                                                     |
| **Research/exploration** | `memory_match_triggers()` → `memory_search()` → Document findings                                                                          |
| **Code search**          | `narsil.narsil_neural_search()` for semantic (meaning), `narsil.narsil_find_symbols()` for structural (via Code Mode), `Grep()` for text   |
| **Resume prior work**    | Load memory files from spec folder → Review checklist → Continue                                                                           |
| **Save context**         | Execute `node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js [spec-folder-path]` → Verify ANCHOR format → Auto-indexed |
| **Claim completion**     | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                                |
| **Debug delegation**     | `/spec_kit:debug` → Model selection → Task tool dispatch                                                                                   |
| **Debug stuck issue**    | 3+ failed attempts → /spec_kit:debug → Model selection → Task tool dispatch                                                                |
| **End session**          | /spec_kit:handover → Save context → Provide continuation prompt                                                                            |
| **New spec folder**      | Option B (Gate 1) → Research via Task tool → Evidence-based plan → Approval → Implement                                                    |
| **Complex multi-step**   | Task tool → Decompose → Delegate → Synthesize                                                                                              |
| **Documentation**        | workflows-documentation skill → Classify → DQI score → Fix → Verify                                                                        |

---

## 2. ⛔ MANDATORY GATES - STOP BEFORE ACTING

**⚠️ BEFORE using ANY tool (except Gate Actions: memory_match_triggers, skill_advisor.py), you MUST pass all applicable gates below.**

### 🔒 PRE-EXECUTION GATES (Pass before ANY tool use)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 1: SPEC FOLDER QUESTION [HARD BLOCK] ⭐ FIRST GATE                     │
│                                                                             │
│ FILE MODIFICATION TRIGGERS (if ANY match → Q1 REQUIRED):                    │
│   □ "rename", "move", "delete", "create", "add", "remove"                   │
│   □ "update", "change", "modify", "edit", "fix", "refactor"                  │
│   □ "implement", "build", "write", "generate", "configure", "analyze"        │
│   □ Any task that will result in file changes                                │
│                                                                             │
│ Q1: SPEC FOLDER - If file modification triggers detected                      │
│     Options: A) Existing | B) New | C) Update related | D) Skip             │
│     ❌ DO NOT use Read/Edit/Write/Bash (except Gate Actions) before asking  │
│     ✅ ASK FIRST, wait for A/B/C/D response, THEN proceed                   │
│                                                                             │
│ BENEFIT: Better planning, reduced rework, consistent documentation          │
│ SKIP: User can say "skip research" to bypass Research task dispatch         │
│                                                                             │
│ Block: HARD - Cannot use tools without answer                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 2: UNDERSTANDING + CONTEXT SURFACING [SOFT BLOCK]                      │
│ Trigger: EACH new user message (re-evaluate even in ongoing conversations)  │
│ Action:  2a. Call memory_match_triggers(prompt) → Surface relevant context  │
│          2b. CLASSIFY INTENT: Identify "Shape" [Research | Implementation]  │
│          2c. Parse request → Check confidence (see §4)                       │
│          2d. If <40%: ASK | 40-79%: PROCEED WITH CAUTION | ≥80%: PASS       │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 3: SKILL ROUTING [ALWAYS REQUIRED for non-trivial tasks]               │
│                                                                             │
│ Action:  Verify skill routing via ONE of:                                   │
│   A) Run: python3 .opencode/scripts/skill_advisor.py "[request]" --threshold 0.8│
│   B) Cite user's explicit direction: "User specified: [exact quote]"         │
│                                                                             │
│ Logic:   Script confidence ≥ 0.8 → MUST invoke recommended skill             │
│          Script confidence < 0.8 → Proceed with general approach             │
│          User explicitly names skill/agent → Cite and proceed               │
│                                                                             │
│ Output:  First response MUST include either:                                │
│          "SKILL ROUTING: [brief script result]" OR                          │
│          "SKILL ROUTING: User directed → [skill/agent name]"                │
│                                                                             │
│ Skip:    Only for trivial queries (greetings, single-line questions)        │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ MEMORY CONTEXT LOADING [SOFT]                                               │
│ Trigger: User selected A or C in Gate 1 AND memory files exist               │
│ Action:  memory_search({ query, specFolder, anchors: ['summary', 'state'] })│
│          → Use anchors for targeted retrieval (~90% token savings)          │
│          → Common anchors: summary, decisions, state, context, artifacts    │
│          → Constitutional memories always appear first                       │
│          → Full content: omit anchors OR use includeContent: true           │
│ Skip:    User can say "skip context" to proceed immediately                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
                              ✅ EXECUTE TASK
```

### First Message Protocol

**RULE**: If the user's FIRST message requests file modifications:
1. Gate 1 question is your FIRST response
2. No analysis first ("let me understand the scope")
3. No tool calls first ("let me check what exists")
4. Ask immediately:

   **Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

5. Wait for answer, THEN proceed
6. Verify skill routing (Gate 3) before substantive work:
   - Run `python3 .opencode/scripts/skill_advisor.py "[request]" --threshold 0.8`
   - OR cite user's explicit skill/agent direction if provided

**Why**: Large tasks feel urgent. Urgency bypasses process. Ask first, analyze after.

### 🔒 POST-EXECUTION RULES (Behavioral - Not Numbered)

```
                                    ↓ TASK COMPLETE?
┌─────────────────────────────────────────────────────────────────────────────┐
│ MEMORY SAVE RULE [HARD]                                                     │
│ Trigger: "save context", "save memory", /memory:save, memory file creation   │
│                                                                             │
│ VALIDATION:                                                                 │
│   1. If NO folder argument → HARD BLOCK → List folders → Ask user           │
│   2. If folder provided → Validate alignment with conversation topic        │
│                                                                             │
│ EXECUTION:                                                                  │
│   Mode 1 (JSON): Write JSON to /tmp/save-context-data.json, pass as arg     │
│            `node generate-context.js /tmp/save-context-data.json`           │
│   Mode 2 (Direct): Pass spec folder path directly                           │
│            `node generate-context.js specs/005-memory`                      │
│                                                                             │
│ VIOLATION: Write tool on memory/ path → DELETE & re-run via script          │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
┌─────────────────────────────────────────────────────────────────────────────┐
│ COMPLETION VERIFICATION RULE [HARD]                                         │
│ Trigger: Claiming "done", "complete", "finished", "works"                    │
│                                                                             │
│ Action:                                                                     │
│   1. Validation runs automatically on spec folder (if exists)               │
│   2. Load checklist.md → Verify ALL items → Mark [x] with evidence          │
│                                                                             │
│ Skip: Level 1 tasks (no checklist.md required)                              │
│ Validation: Exit 0 = pass, Exit 1 = warnings, Exit 2 = errors (must fix)     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓
                              ✅ CLAIM COMPLETION
```

### 🔄 EDGE CASE: Compaction Recovery

When system message contains "Please continue the conversation from where we left it off...":

**Action:** Display branch protocol:
```
⚠️ CONTEXT COMPACTION DETECTED

To continue efficiently, start a new conversation with this handoff:

CONTINUATION - Attempt [N]
Spec: [CURRENT_SPEC_PATH]
Last: [LAST_ACTION]
Next: [NEXT_ACTION]

Run /spec_kit:handover to save handover context, then in new session:
/spec_kit:resume [spec-path]
```

**Continuation Validation:** When user message contains "CONTINUATION - Attempt" pattern:
1. Parse handoff message (spec folder, Last Action, Next Action)
2. Validate against most recent memory file if exists
3. If mismatch: Report and ask which is correct
4. If validated: Proceed with "✅ Continuation validated"

### ⚡ Self-Verification (MANDATORY before EVERY tool-using response)

```
□ File modification detected? Did I ask spec folder question? If NO → Ask NOW.
□ Skill routing verified? → Script output OR user direction citation required
□ Am I saving memory/context? → Use generate-context.js script (not Write tool)
□ Aligned with ORIGINAL request? → Check for scope drift from Turn 1 intent
□ Claiming completion? → Verify checklist.md items first
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
- Memory Context Loading: "skip context", "fresh start", "skip memory", [skip]
- Completion Verification: Level 1 tasks (no checklist.md required)

#### ⚡ Compliance Checkpoints

**MANDATORY:**
- Before **proposing solutions**: Verify approach aligns with project patterns and conventions
- Before **writing documentation**: Use workflows-documentation skill for structure/style enforcement 
- Before **code discovery**: Use mcp-narsil for ALL code intelligence (semantic via neural, structural, security) via Code Mode (MANDATORY)
- Before **research tasks**: Use Spec Kit Memory MCP to find prior work, saved context, and related memories (MANDATORY)
- Before **spec folder creation**: Use system-spec-kit skill for template structure and sub-folder organization
- Before **session end or major milestones**: Use `/memory:save` or "save context" to preserve important context (manual trigger required)
- **If conflict exists**: Project-specific patterns override general practices

**Violation handling:** If proposed solution contradicts project patterns, STOP and ask for clarification or revise approach.

#### ⚡ Common Failure Patterns

| #   | Stage          | Pattern                      | Trigger Phrase                               | Response Action                                       |
| --- | -------------- | ---------------------------- | -------------------------------------------- | ----------------------------------------------------- |
| 1   | Planning       | Rush to Code                 | "straightforward"                            | Analyze → Verify → Simplest                           |
| 2   | Planning       | Over-Engineering             | N/A                                          | YAGNI - solve only stated                             |
| 3   | Planning       | Skip Process                 | "I already know"                             | Follow checklist anyway                               |
| 4   | Implementation | Clever > Clear               | N/A                                          | Obvious code wins                                     |
| 5   | Implementation | Fabrication                  | "obvious" w/o verify                         | Output "UNKNOWN", verify first                        |
| 6   | Implementation | Cascading Breaks             | N/A                                          | Reproduce before fixing                               |
| 7   | Implementation | Root Folder Pollution        | Creating temp file                           | STOP → Move to scratch/ → Verify                      |
| 8   | Review         | Retain Legacy                | "just in case"                               | Remove unused, ask if unsure                          |
| 9   | Completion     | No Browser Test              | "works", "done"                              | Browser verify first                                  |
| 10  | Any            | Internal Contradiction       | Conflicting requirements                     | HALT → State conflict explicitly → Request resolution |
| 11  | Understanding  | Wrong Search Tool            | "find", "search", "list"                     | Narsil for meaning + structure, Grep for text         |
| 12  | Planning       | Skip Research                | "simple task"                                | Dispatch Research anyway for evidence                 |
| 13  | Any            | Task Without Context         | Missing dispatch context                     | Use 4-section format with full context                |
| 14  | Implementation | Skip Debug Delegation        | "tried 3+ times", "same error"               | STOP → Suggest /spec_kit:debug → Wait for response    |
| 15  | Any            | Skip Handover at Session End | "stopping", "done for now", "continue later" | Suggest /spec_kit:handover → Wait for response        |
| 16  | Understanding  | Skip Skill Routing           | "obvious which skill", "user specified"      | STOP → Run skill_advisor.py OR cite user direction    |

**Enforcement:** STOP → Acknowledge ("I was about to [pattern]") → Correct → Verify

---

## 3. 📝 MANDATORY: CONVERSATION DOCUMENTATION

Every conversation that modifies files MUST have a spec folder. **Full details**: system-spec-kit skill

### Documentation Levels

| Level  | LOC            | Required Files                                        | Use When                           |
| ------ | -------------- | ----------------------------------------------------- | ---------------------------------- |
| **1**  | <100           | spec.md, plan.md, tasks.md, implementation-summary.md | All features (minimum)             |
| **2**  | 100-499        | Level 1 + checklist.md                                | QA validation needed               |
| **3**  | ≥500           | Level 2 + decision-record.md (+ optional research.md) | Complex/architecture changes       |
| **3+** | Complexity 80+ | Level 3 + AI protocols, extended checklist, sign-offs | Multi-agent, enterprise governance |

> **Note:** `implementation-summary.md` is REQUIRED for all levels but created after implementation completes, not at spec folder creation time.

**Rules:** 
- When in doubt → higher level
- LOC is soft guidance (risk/complexity can override)
- Single typo/whitespace fixes (<5 characters in one file) are exempt from spec folder requirements

### Spec Folder Structure
**Path:** `/specs/[###-short-name]/` (e.g., `007-add-auth`)
**Templates:** `.opencode/skill/system-spec-kit/templates/`

| Folder     | Purpose                     | Examples                               |
| ---------- | --------------------------- | -------------------------------------- |
| `scratch/` | Temporary/disposable        | Debug logs, test scripts, prototypes   |
| `memory/`  | Context for future sessions | Decisions, blockers, session summaries |
| Root       | Permanent documentation     | spec.md, plan.md, checklist.md         |

**Sub-Folder Versioning** (when reusing spec folders):
- Option A with existing content → Archive to `001-{topic}/`, new work in `002-{name}/`
- Each sub-folder has independent `memory/` context

### Dynamic State (Auto-Evolution) & Completion Verification
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

---

## 4. 🧑‍🏫 CONFIDENCE & CLARIFICATION FRAMEWORK

**Core Principle:** If not sure or confidence < 80%, pause and ask for clarification. Present a multiple-choice path forward.

### Thresholds & Actions
- **80–100% (HIGH):** Proceed with at least one citable source or strong evidence
- **40–79% (MEDIUM):** Proceed with caution - provide caveats and counter-evidence
- **0–39% (LOW):** Ask for clarification with multiple-choice question or mark "UNKNOWN"
- **Safety override:** If there's a blocker or conflicting instruction, ask regardless of score

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

---

## 6. ⚙️ TOOL SYSTEM

### Two "Semantic" Systems (DO NOT CONFUSE)

| System              | MCP Name             | Database Location                                               | Purpose                               |
| ------------------- | -------------------- | --------------------------------------------------------------- | ------------------------------------- |
| **Narsil**          | `narsil` (Code Mode) | Managed by Narsil (--persist flag)                              | **Code** semantic + structural search |
| **Spec Kit Memory** | `spec_kit_memory`    | `.opencode/skill/system-spec-kit/database/context-index.sqlite` | **Conversation** context preservation |

**Common Confusion Points:**
- Both use vector embeddings for semantic search
- Narsil is for code search (semantic + structural), Spec Kit Memory is for conversation context
- They are COMPLETELY SEPARATE systems with different purposes

**When cleaning/resetting databases:**
- Code search issues → Use `narsil.narsil_reindex()` or restart MCP
- Memory issues → Delete `.opencode/skill/system-spec-kit/database/context-index.sqlite`
- **IMPORTANT**: After deletion, restart OpenCode to clear the MCP server's in-memory cache

### Code Search Tools (COMPLEMENTARY - NOT COMPETING)

| Tool                  | Type                  | Query Example               | Returns                                 |
| --------------------- | --------------------- | --------------------------- | --------------------------------------- |
| **Narsil Neural**     | Semantic              | "How does auth work?"       | Code by meaning/intent                  |
| **Narsil Structural** | Structural + Security | "List functions in auth.ts" | Symbols, call graphs, security findings |
| **Grep**              | Lexical               | "Find 'TODO' comments"      | Text pattern matches                    |

**Decision Logic:**
- Need to UNDERSTAND code? → Narsil neural_search
- Need to MAP code structure? → Narsil (structural, via Code Mode)
- Need SECURITY scan or CODE ANALYSIS? → Narsil (via Code Mode)
- Need to FIND text patterns? → Grep (lexical)

**Typical Workflow:**
1. Narsil → Map structure via Code Mode ("What functions exist?")
2. Narsil neural_search → Understand purpose ("How does login work?")
3. Read → Get implementation details

### MCP Configuration

**Two systems:**

1. **Native MCP** (`opencode.json`) - Direct tools, called natively
   - Sequential Thinking, Spec Kit Memory, Code Mode server

2. **Code Mode MCP** (`.utcp_config.json`) - External tools via `call_tool_chain()`
   - Webflow, Figma, Github, ClickUp, Chrome DevTools, Narsil, etc.
   - Naming: `{manual_name}.{manual_name}_{tool_name}` (e.g., `webflow.webflow_sites_list({})`, `narsil.narsil_find_symbols({})`)
   - Discovery: `search_tools()`, `list_tools()`, or read `.utcp_config.json`
  
---

## 7. 🧩 SKILLS SYSTEM

Skills are specialized, on-demand capabilities that provide domain expertise. Unlike knowledge files (passive references), skills are explicitly invoked to handle complex, multi-step workflows.

### How Skills Work

```
Task Received → Gate 2: Run skill_advisor.py
                    ↓
    Confidence > 0.8 → MUST invoke recommended skill
                    ↓
     Invoke Skill → Read(".opencode/skill/<skill-name>/SKILL.md")
                    ↓
    Instructions Load → SKILL.md content + resource paths
                    ↓
      Follow Instructions → Complete task using skill guidance
```

**Invocation Methods:**
- **Native**: OpenCode v1.0.190+ auto-discovers skills and exposes them as `skills_*` functions (e.g., `skills_system_spec_kit`)
- **Direct**: Read `SKILL.md` from `.opencode/skill/<skill-name>/` folder

### Skill Loading Protocol

1. Gate 2 provides skill recommendation via `skill_advisor.py`
2. Invoke using appropriate method for your environment
3. Read bundled resources from `references/`, `scripts/`, `assets/` paths
4. Follow skill instructions to completion
5. Do NOT re-invoke a skill already in context

### Skill Routing (Gate 2)

Gate 2 routes tasks to skills via `skill_advisor.py`. When confidence > 0.8, you MUST invoke the recommended skill.

**How to use skills:**
- OpenCode v1.0.190+ auto-discovers skills from `.opencode/skill/*/SKILL.md` frontmatter
- Skills appear as `skills_*` functions in your available tools (e.g., `skills_system_spec_kit`)
- When a task matches a skill, read the SKILL.md directly: `Read(".opencode/skill/<skill-name>/SKILL.md")`
- Base directory provided for resolving bundled resources (`references/`, `scripts/`, `assets/`)

**Usage notes:**
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
- Skills are auto-indexed from SKILL.md frontmatter - no manual list maintenance required

### Primary Skill: workflows-code

For ALL code implementation, `workflows-code` is the primary orchestrator skill.

**3-Phase Lifecycle (MANDATORY):**
1. **Phase 1 - Implementation**: Write code following Webflow patterns, async handling, validation
2. **Phase 1.5 - Code Quality Gate**: Validate against style standards (P0 items MUST pass)
3. **Phase 2 - Debugging**: Fix issues systematically using DevTools, trace root cause
4. **Phase 3 - Verification**: Browser testing at multiple viewports (MANDATORY before "done")

**The Iron Law**: NO COMPLETION CLAIMS WITHOUT FRESH BROWSER VERIFICATION EVIDENCE

**Auto-Detection Flow:**
```
Task Received → Detect keywords → Route to phase → Load resources
```

**Patterns Location:** `.opencode/skill/workflows-code/references/`
- `implementation/` → Async patterns, animation, CSS, Webflow, security, observers
- `debugging/` → Root cause tracing, error recovery
- `verification/` → Browser testing requirements
- `deployment/` → Minification, CDN deployment to R2
- `standards/` → Code quality, style guide, shared patterns

**Invocation:** Automatic via Gate 2 routing when code tasks detected.

### Skill Maintenance 

Skills are located in `.opencode/skill/`.

When creating or editing skills:
- Create or edit skills based on the workflow logic defined in `.opencode/agent/write.md`
- Validate skill structure matches template in `workflows-documentation/references/skill_creation.md`
- Use the templates in `workflows-documentation/assets/` (`skill_md_template.md`, `skill_reference_template.md`, `skill_asset_template.md`)
- Ensure all bundled resources are referenced with relative paths
- Test skill invocation before committing