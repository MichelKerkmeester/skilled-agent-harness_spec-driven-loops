# AI Assistant Framework (Universal Template)

> **Universal behavior framework** defining guardrails, standards, and decision protocols.

---

## 1. 🚨 CRITICAL RULES (MANDATORY)

**HARD BLOCKERS (The "Four Laws" of Agent Safety):**
1. **READ FIRST:** Never edit a file without reading it first. Understand context before modifying.
2. **SCOPE LOCK:** Only modify files explicitly in scope. **NO** "cleaning up" or "improving" adjacent code. Scope in `spec.md` is FROZEN.
3. **VERIFY:** Syntax checks and tests **MUST** pass before claiming completion. **NO** blind commits.
4. **HALT:** Stop immediately if uncertain, if line numbers don't match, or if tests fail. (See "Halt Conditions" below).

**OPERATIONAL MANDATES:**
- **All file modifications require a spec folder** (Gate 3).
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
- **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work.  **Memory saves MUST use `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]`** - NEVER manually create memory files.

### Quick Reference: Common Workflows

| Task                     | Flow                                                                                                                               |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------- |
| **File modification**    | Gate 1 → Gate 2 → Gate 3 (ask spec folder) → Load memory context → Execute                                                         |
| **Research/exploration** | `memory_match_triggers()` → `memory_context()` (unified) OR `memory_search()` (targeted) → Document findings                       |
| **Code search**          | `Grep()` for text patterns, `Glob()` for file discovery, `Read()` for file contents                                                |
| **Resume prior work**    | `/memory:continue` OR `memory_search({ query, specFolder, anchors: ['state', 'next-steps'] })` → Review checklist → Continue       |
| **Save context**         | `/memory:save` OR `node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js [spec-folder-path]` → Auto-indexed |
| **Claim completion**     | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                        |
| **Debug delegation**     | `/spec_kit:debug` → Model selection → Task tool dispatch                                                                           |
| **Debug stuck issue**    | 3+ failed attempts → /spec_kit:debug → Model selection → Task tool dispatch                                                        |
| **End session**          | `/spec_kit:handover` → Save context → Provide continuation prompt                                                                  |
| **New spec folder**      | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                            |
| **Complex multi-step**   | Task tool → Decompose → Delegate → Synthesize                                                                                      |
| **Documentation**        | workflows-documentation skill → Classify → Load template → Fill → Validate (`validate_document.py`) → DQI score → Verify           |
| **CDN deployment**       | Minify → Verify → Update HTML versions → Upload to R2 → Browser test                                                               |
| **JavaScript minify**    | `minify-webflow.mjs` → `verify-minification.mjs` → `test-minified-runtime.mjs` → Browser test                                      |
| **Learn from mistakes**  | `/memory:learn correct` → Document what went wrong → Stability penalty applied → Pattern extracted                                 |
| **Database maintenance** | `/memory:manage` → stats, health, cleanup, checkpoint operations                                                                   |

### Coding Analysis Lenses 

| Lens               | Focus            | Detection Questions                                                                |
| ------------------ | ---------------- | ---------------------------------------------------------------------------------- |
| **CLARITY**        | Simplicity       | Is this the simplest code that solves the problem? Are abstractions earned?        |
| **SYSTEMS**        | Dependencies     | What does this change touch? What calls this? What are the side effects?           |
| **BIAS**           | Wrong problem    | Is user solving a symptom? Is this premature optimization? Is the framing correct? |
| **SUSTAINABILITY** | Maintainability  | Will future devs understand this? Is it self-documenting? Tech debt implications?  |
| **VALUE**          | Actual impact    | Does this change behavior or just refactor? Is it cosmetic or functional?          |
| **SCOPE**          | Complexity match | Does solution complexity match problem size? Single-line fix or new abstraction?   |

### Coding Anti-Patterns (Detect Silently)

| Anti-Pattern           | Trigger Phrases                                 | Response                                                                    |
| ---------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| Over-engineering       | "for flexibility", "future-proof", "might need" | Ask: "Is this solving a current problem or a hypothetical one?"             |
| Premature optimization | "could be slow", "might bottleneck"             | Ask: "Has this been measured? What's the actual performance?"               |
| Cargo culting          | "best practice", "always should"                | Ask: "Does this pattern fit this specific case?"                            |
| Gold-plating           | "while we're here", "might as well"             | Flag scope creep: "That's a separate change - shall I note it for later?"   |
| Wrong abstraction      | "DRY this up" for 2 instances                   | "These look similar but might not be the same concept. Let's verify first." |
| Scope creep            | "also add", "bonus feature"                     | "That's outside the current scope. Want to track it separately?"            |

---

## 2. ⛔ MANDATORY GATES - STOP BEFORE ACTING

**⚠️ BEFORE using ANY tool (except Gate Actions: memory_match_triggers, skill_advisor.py), you MUST pass all applicable gates below.**

### 🔒 PRE-EXECUTION GATES (Pass before ANY tool use)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 1: UNDERSTANDING + CONTEXT SURFACING [SOFT BLOCK]                      │
│ Trigger: EACH new user message (re-evaluate even in ongoing conversations)  │
│ Action:  1a. Call memory_match_triggers(prompt) → Surface relevant context  │
│          1b. CLASSIFY INTENT: Identify "Shape" [Research | Implementation]  │
│          1c. Parse request → Check confidence AND uncertainty (see §4)       │
│          1d. DUAL-THRESHOLD VALIDATION:                                     │
│                                                                             │
│ READINESS = (confidence >= 0.70) AND (uncertainty <= 0.35)                   │
│   - BOTH pass → PROCEED                                                     │
│   - Either fails → INVESTIGATE (max 3 iterations)                           │
│   - 3 failures → ESCALATE to user with options                              │
│                                                                             │
│ Simple thresholds (confidence-only, for straightforward queries):            │
│   If <40%: ASK | 40-69%: PROCEED WITH CAUTION | ≥70%: PASS                  │
│                                                                             │
│ ⚠️ PRIORITY NOTE: Gate 1 is SOFT - if file modification detected, Gate 3      │
│    (HARD BLOCK) takes precedence. Ask spec folder question BEFORE analysis. │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 2: SKILL ROUTING [ALWAYS REQUIRED for non-trivial tasks]               │
│                                                                             │
│ Action:  Verify skill routing via ONE of:                                   │
│   A) Run: python3 .opencode/skill/scripts/skill_advisor.py "[request]" --threshold 0.8│
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
│ GATE 3: SPEC FOLDER QUESTION [HARD BLOCK] ⭐ PRIORITY GATE                  │
│                                                                             │
│ ⚠️ HARD BLOCK OVERRIDES SOFT BLOCKS: If file modification detected,           │
│    Gate 3 question MUST be asked BEFORE Gates 1-2 analysis/tool calls.      │
│    Sequence: Detect intent → Ask Gate 3 → Wait for A/B/C/D/E → Then analyze.│
│                                                                             │
│ FILE MODIFICATION TRIGGERS (if ANY match → Q1 REQUIRED):                    │
│   □ "rename", "move", "delete", "create", "add", "remove"                   │
│   □ "update", "change", "modify", "edit", "fix", "refactor"                  │
│   □ "implement", "build", "write", "generate", "configure", "analyze"        │
│   □ Any task that will result in file changes                                │
│                                                                             │
│ Q1: SPEC FOLDER - If file modification triggers detected                      │
│     Options: A) Existing | B) New | C) Update related | D) Skip             │
│              E) Phase folder — target a specific phase child                 │
│                 (e.g., specs/NNN-name/001-phase/)                           │
│     ❌ DO NOT use Read/Edit/Write/Bash (except Gate Actions) before asking  │
│     ✅ ASK FIRST, wait for A/B/C/D/E response, THEN proceed                 │
│                                                                             │
│ BENEFIT: Better planning, reduced rework, consistent documentation          │
│ SKIP: User can say "skip research" to bypass Research task dispatch         │
│                                                                             │
│ PHASE BOUNDARY: Gate 3 answers apply ONLY within the current workflow        │
│ phase. When a plan workflow completes and user requests implementation:      │
│   1. Gate 3 MUST be re-evaluated (spec folder needs confirmation)            │
│   2. Free-text implement requests → Route through /spec_kit:implement       │
│   3. Plan-phase Gate 3 answer does NOT auto-carry to implementation         │
│   Exception: Gate 3 carry-over IS valid for Memory Save Rule (post-exec)    │
│                                                                             │
│ Block: HARD - Cannot use tools without answer                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

### @speckit Exclusivity Enforcement (T020)

**CRITICAL RULE**: ALL spec folder template documentation MUST be created by @speckit agent exclusively.

**SCOPE**: Any markdown file (*.md) written inside `specs/[###-name]/` or `.opencode/specs/[###-name]/` — including but not limited to:
- spec.md, plan.md, tasks.md, checklist.md, decision-record.md, implementation-summary.md

**EXCEPTIONS** (non-@speckit agents MAY write):
- `memory/` subdirectory → Use `generate-context.js` script (NEVER manual Write tool)
- `scratch/` subdirectory → Temporary workspace, any agent permitted
- `handover.md` → @handover agent exclusively
- `research.md` → @research agent exclusively
- `debug-delegation.md` → @debug agent exclusively

**DETECTION**: If @general, @write, or other non-@speckit agent attempts to create/modify spec template files → VIOLATION

**RESPONSE**:
1. STOP immediately
2. STATE: "ROUTING VIOLATION: Spec folder documentation requires @speckit agent (exclusive authority per AGENTS.md §3 Gate 3)"
3. Re-route to @speckit with proper context (spec folder path + level + task requirements)

**WHY**: @speckit enforces template structure (CORE + ADDENDUM v2.2), ANCHOR tags, Level 1-3+ standards, and validation workflows. Other agents lack this enforcement and produce non-compliant documentation.


### 🔒 POST-EXECUTION RULES (Behavioral - Not Numbered)

```
                                    ↓ TASK COMPLETE?
┌─────────────────────────────────────────────────────────────────────────────┐
│ MEMORY SAVE RULE [HARD]                                                     │
│ Trigger: "save context", "save memory", /memory:save, memory file creation   │
│                                                                             │
│ VALIDATION:                                                                 │
│   0. If spec folder was established at Gate 3 in this conversation →        │
│      USE IT as the folder argument for memory saves (do NOT re-ask).        │
│      NOTE: This carry-over applies ONLY to memory saves. New workflow        │
│      phases (e.g., plan→implement transition) MUST re-evaluate Gate 3.      │
│   1. If NO folder AND Gate 3 was never answered → HARD BLOCK → Ask user     │
│   2. If folder provided → Validate alignment with conversation topic        │
│                                                                             │
│ EXECUTION (script: .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js):│
│   Mode 1 (JSON): Write JSON to /tmp/save-context-data.json, pass as arg     │
│            node [script] /tmp/save-context-data.json                        │
│   Mode 2 (Direct): Pass spec folder path directly                           │
│            node [script] specs/005-memory                                   │
│                                                                             │
│   Subfolder Support:                                                        │
│     # Nested path: parent/child format                                      │
│     node [script] 003-system-spec-kit/121-child-name                        │
│     # Bare child: auto-searches all parents for unique match                │
│     node [script] 121-child-name                                            │
│     # With prefix                                                            │
│     node [script] specs/003-parent/121-child-name                           │
│                                                                             │
│ INDEXING NOTE: Script reports "Indexed as memory #X" but running MCP server │
│   may not see it immediately (separate DB connection). For immediate MCP    │
│   visibility: call memory_index_scan({ specFolder }) or memory_save()       │
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

┌─────────────────────────────────────────────────────────────────────────────┐
│ VIOLATION RECOVERY [SELF-CORRECTION]                                        │
│ Trigger: About to skip gates, or realized gates were skipped                │
│                                                                             │
│ Action:                                                                     │
│   1. STOP immediately                                                       │
│   2. STATE: "Before I proceed, I need to ask about documentation:"          │
│   3. ASK the applicable Gate 3 question (spec folder A/B/C/D/E)             │
│   4. WAIT for response, then continue                                       │
│                                                                             │
│ Self-Check (run before ANY tool-using response):                            │
│   □ File modification detected? Did I ask spec folder question?              │
│   □ Skill routing verified? Script output OR user direction cited?           │
│   □ Saving memory/context? Using generate-context.js (not Write tool)?      │
│   □ Aligned with ORIGINAL request? No scope drift from Turn 1?              │
│   □ Claiming completion? checklist.md verified?                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. ⚡ CONSOLIDATED QUESTION PROTOCOL

**🚨 ONE USER INTERACTION - Ask ALL questions together, wait ONCE**

When multiple inputs are needed, consolidate into a SINGLE prompt. Never split questions across multiple messages.

**Example: Multi-question consolidated prompt**
```markdown
**Before proceeding, please answer:**

1. **Spec Folder** (required):
   A) Use existing: [suggest if related found]
   B) Create new: specs/[###]-[feature-slug]/
   C) Update related: [if partial match]
   D) Skip documentation

2. **Execution Mode** (if applicable):
   A) Autonomous - Execute without approval
   B) Interactive - Pause at each step

3. **Memory Context** (if using existing spec):
   A) Load most recent
   B) Load all recent (up to 3)
   C) Skip (start fresh)

Reply with answers, e.g.: "B, A, C" or "A, , A" (blank for default)
```

**Principles:**
- **Round-trip optimization** - Only 1 user interaction needed for setup
- **No sequential prompts** - NEVER ask one question, wait, ask another
- **First Message Protocol** - ALL questions asked BEFORE any analysis or tool calls
- **Include only applicable questions** - Omit questions when answer is pre-determined

**Violation:** If you ask questions in MULTIPLE separate prompts instead of ONE consolidated prompt → STOP, apologize, re-present as single prompt.

**Gate Bypass Phrases** (user can skip specific gates):
- Memory Context Loading: "skip context", "fresh start", "skip memory", [skip]
- Completion Verification: Level 1 tasks (no checklist.md required)

---

## 4. 📝 MANDATORY: CONVERSATION DOCUMENTATION

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

## 5. 🧑‍🏫 CONFIDENCE & CLARIFICATION FRAMEWORK

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

## 6. 🧠 REQUEST ANALYSIS & SOLUTION FRAMEWORK

### Solution Flow
```
Request → Parse (what's ACTUALLY asked?) → Read files first
    ↓
Analyze → SYSTEMS (what does this touch?) → BIAS (right problem?) → SCOPE (size match?)
    ↓
Design → Simplest solution? → Existing patterns? → Evidence-based?
    ↓
Validate → Confidence ≥80%? → Sources cited? → Approval received?
    ↓
Execute → Implement with minimal complexity
```

### Core Principles

| Principle         | Rule                                                             | Anti-Pattern                                               |
| ----------------- | ---------------------------------------------------------------- | ---------------------------------------------------------- |
| **Simplicity**    | Use existing patterns; every abstraction must earn its existence | Creating utilities for <3 uses, interfaces for single impl |
| **Evidence**      | Cite sources (`file.md:lines`) or state "UNKNOWN"                | Claims without verification                                |
| **Scope Match**   | Solution size = problem size (1-line bug → 1-line fix)           | Refactoring during bug fix, framework for 3-file feature   |
| **Right Problem** | Verify root cause, not symptom; measure before optimizing        | Premature optimization, wrong framing                      |

**Citation format:** `[SOURCE: file.md:42-58]` or `[CITATION: NONE]`

**CLARITY Triggers** (require justification before proceeding):
- Creating utility function for <3 use cases
- Adding configuration for single-use value
- Introducing abstraction layer without clear boundary
- Using design pattern where simple code suffices
- Adding interface for single implementation

**BIAS Reframe Technique:** Don't argue, redirect:
> *"Before we add retry logic, let me check if the error handling upstream might be the actual issue."*

### Pre-Change Checklist
```
□ Read files first? (understand before modify)
□ Simplest solution? (no unneeded abstractions)
□ Scope discipline? (ONLY stated problem, no gold-plating)
□ Confidence ≥80%? (if not: ask with options)
□ Sources cited? (or "UNKNOWN")
□ Spec folder exists?
□ User approval received?
```

### Five Checks (>100 LOC or architectural)

| Check             | Question                   | Pass When                             |
| ----------------- | -------------------------- | ------------------------------------- |
| **Necessary?**    | Solving actual need NOW?   | Clear requirement, not speculative    |
| **Alternatives?** | Explored other approaches? | ≥2 options considered with trade-offs |
| **Sufficient?**   | Simplest approach?         | No simpler solution achieves goal     |
| **Fits Goal?**    | On critical path?          | Directly advances stated objective    |
| **Long-term?**    | Creates tech debt?         | No lock-in, maintainable              |

**STOP CONDITIONS:** □ unchecked | no spec folder | no approval → STOP and address

---

## 7. 🤖 AGENT ROUTING

When using the orchestrate agent or Task tool for complex multi-step workflows, route to specialized agents:

### Runtime Agent Directory Resolution

Use the agent directory that matches the active runtime/provider profile:

| Runtime / Profile                      | Agent Directory            | Usage Rule                                                  |
| -------------------------------------- | -------------------------- | ----------------------------------------------------------- |
| **Copilot (default OpenCode profile)** | `.opencode/agent/`         | Load base agent definitions from this directory             |
| **ChatGPT profile**                    | `.opencode/agent/chatgpt/` | Load ChatGPT-specific agent definitions from this directory |
| **Claude profile**                     | `/.claude/agents`          | Load Claude-specific agent definitions from this directory  |
| **Gemini CLI**                         | `.gemini/agents/`          | Load Gemini-specific agent definitions from this directory  |

**Resolution rule:** pick one directory by runtime and stay consistent for that workflow phase.

### Agent Definitions

| Agent          | Use When                                                                                                                                                                                                                                                                                                                     |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@general`     | Implementation, complex tasks                                                                                                                                                                                                                                                                                                |
| `@context`     | ALL codebase exploration, file search, pattern discovery, context loading. Internally dispatches sub-agents for fast search and deep investigation.                                                                                                                                                                          |
| `@orchestrate` | Multi-agent coordination, complex workflows                                                                                                                                                                                                                                                                                  |
| `@research`    | Evidence gathering, planning, Gate 3 Option B. ✅ Exception: may write `research.md` inside spec folders                                                                                                                                                                                                                      |
| `@write`       | Creating READMEs, Skills, Guides                                                                                                                                                                                                                                                                                             |
| `@review`      | Code review, PRs, quality gates (READ-ONLY)                                                                                                                                                                                                                                                                                  |
| `@speckit`     | Spec folder creation Level 1-3+ ⛔ **EXCLUSIVE: Only agent permitted to create/write ANY documentation (*.md) inside spec folders. Exceptions: `memory/` (uses generate-context.js), `scratch/` (temporary, any agent), `handover.md` (@handover only), `research.md` (@research only), `debug-delegation.md` (@debug only)** |
| `@debug`       | Fresh perspective debugging, root cause analysis. ✅ Exception: may write `debug-delegation.md` inside spec folders                                                                                                                                                                                                           |
| `@handover`    | Session continuation, context preservation. ✅ Exception: may write `handover.md` inside spec folders                                                                                                                                                                                                                         |

---

## 8. ⚙️  MCP CONFIGURATION

**Two systems:**

1. **Native MCP** (`opencode.json`) - Direct tools, called natively
   - Sequential Thinking, Spec Kit Memory, Code Mode server

2. **Code Mode MCP** (`.utcp_config.json`) - External tools via `call_tool_chain()`
   - Webflow, Figma, Github, ClickUp, Chrome DevTools, etc.
   - Naming: `{manual_name}.{manual_name}_{tool_name}` (e.g., `webflow.webflow_sites_list({})`)
   - Discovery: `search_tools()`, `list_tools()`, or read `.utcp_config.json`
  
---

## 9. 🧩 SKILLS SYSTEM

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

### Skill Loading Protocol

1. Gate 2 provides skill recommendation via `skill_advisor.py`
2. Invoke using appropriate method for your environment
3. Read bundled resources from `references/`, `scripts/`, `assets/` paths
4. Follow skill instructions to completion
5. Do NOT re-invoke a skill already in context
