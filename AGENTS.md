# AI Assistant Framework

> **Behavior framework** defining guardrails, standards, and decision protocols—tailored for anobel.com’s Webflow implementation.

---

#### 📦 PUBLIC RELEASE

The OpenCode development environment in this project is also available as a standalone public release.

| Resource                | Location                                                              |
| ----------------------- | --------------------------------------------------------------------- |
| **Public Repo (local)** | `/Users/michelkerkmeester/MEGA/Development/Opencode Dev Environment/` |
| **GitHub**              | https://github.com/MichelKerkmeester/Opencode_Dev_Environment         |

**This project is the source of truth.** Changes are synced to the public repo for distribution.

See [`PUBLIC_RELEASE.md`](PUBLIC_RELEASE.md) for sync process, what's included, and release management.

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
- **Spec Kit Memory MCP** for research tasks, context recovery, and finding prior work. See Section 6 for full tool list. **Memory saves MUST use `node .opencode/skill/system-spec-kit/scripts/generate-context.js [spec-folder-path]`** - NEVER manually create memory files.
- **LEANN MCP** for semantic code search - finds code by MEANING ("How does auth work?"). See §6 for tool list.
- **Narsil MCP** for structural code queries AND security scanning - finds code by STRUCTURE ("List functions in auth.ts"), security vulnerabilities, call graphs. Complements LEANN: use LEANN for understanding intent, Narsil for symbol navigation and security. Accessed via Code Mode.

### Quick Reference: Common Workflows

| Task                     | Flow                                                                                                                                     |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **File modification**    | Gate 1 → Gate 2 → Gate 3 (ask spec folder) → Load memory context → Execute                                                               |
| **Research/exploration** | `memory_match_triggers()` → `memory_search()` → `leann_leann_search()` → Document findings                                               |
| **Code search**          | `leann_leann_search()` for semantic (meaning), `narsil.narsil_find_symbols()` for structural (via Code Mode), `Grep()` for text patterns |
| **Resume prior work**    | Load memory files from spec folder → Review checklist → Continue                                                                         |
| **Save context**         | Execute `node .opencode/skill/system-spec-kit/scripts/generate-context.js [spec-folder-path]` → Verify ANCHOR format → Auto-indexed      |
| **Claim completion**     | Validation runs automatically → Load `checklist.md` → Verify ALL items → Mark with evidence                                              |
| **Debug delegation**     | `/spec_kit:debug` → Model selection → Task tool dispatch                                                                                 |
| **Debug stuck issue**    | 3+ failed attempts → /spec_kit:debug → Model selection → Task tool dispatch                                                              |
| **End session**          | /spec_kit:handover → Save context → Provide continuation prompt                                                                          |
| **New spec folder**      | Option B (Gate 3) → Research via Task tool → Evidence-based plan → Approval → Implement                                                  |
| **Complex multi-step**   | Task tool → Decompose → Delegate → Synthesize                                                                                            |
| **Documentation**        | workflows-documentation skill → Classify → DQI score → Fix → Verify                                                                      |
| **CDN deployment**       | Minify → Verify → Update HTML versions → Upload to R2 → Browser test                                                                     |
| **JavaScript minify**    | `minify-webflow.mjs` → `verify-minification.mjs` → `test-minified-runtime.mjs` → Browser test                                            |
| **LEANN index build**    | `leann-build <name> --docs src/` (requires alias setup - see mcp-leann skill)                                                            |

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
│          1c. Parse request → Check confidence (see §4)                       │
│          1d. If <40%: ASK | 40-79%: PROCEED WITH CAUTION | ≥80%: PASS       │
│                                                                             │
│ ⚠️ PRIORITY NOTE: Gate 1 is SOFT - if file modification detected, Gate 3      │
│    (HARD BLOCK) takes precedence. Ask spec folder question BEFORE analysis. │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 2: SKILL ROUTING [ADVISORY]                                            │
│ Action:  Optionally run: python3 .opencode/scripts/skill_advisor.py         │
│ Logic:   IF task clearly matches a skill domain → invoke skill directly     │
│          IF uncertain → run skill_advisor.py for recommendation             │
│          IF confidence > 0.8 from advisor → invoke recommended skill         │
│ Note:    Task-appropriate skills can be recognized without script call.     │
│          Script is advisory, not mandatory per request.                     │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ GATE 3: SPEC FOLDER QUESTION [HARD BLOCK] ⭐ PRIORITY GATE                  │
│                                                                             │
│ ⚠️ HARD BLOCK OVERRIDES SOFT BLOCKS: If file modification detected,           │
│    Gate 3 question MUST be asked BEFORE Gates 1-2 analysis/tool calls.      │
│    Sequence: Detect intent → Ask Gate 3 → Wait for A/B/C/D → Then analyze.  │
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

### First Message Protocol

**RULE**: If the user's FIRST message requests file modifications:
1. Gate 3 question is your FIRST response
2. No analysis first ("let me understand the scope")
3. No tool calls first ("let me check what exists")
4. Ask immediately:

   **Spec Folder** (required): A) Existing | B) New | C) Update related | D) Skip

5. Wait for answer, THEN proceed

**Why**: Large tasks feel urgent. Urgency bypasses process. Ask first, analyze after.

                                    ↓ PASS
┌─────────────────────────────────────────────────────────────────────────────┐
│ MEMORY CONTEXT LOADING [SOFT]                                               │
│ Trigger: User selected A or C in Gate 3 AND memory files exist               │
│ Action:  memory_search({ specFolder, includeContent: true })                │
│          → Results include embedded content (no separate load needed)       │
│          → Constitutional memories always appear first                       │
│          → Display relevant context directly from search results            │
│ Skip:    User can say "skip context" to proceed immediately                 │
└─────────────────────────────────────────────────────────────────────────────┘
                                    ↓ PASS
                              ✅ EXECUTE TASK
```

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

#### ⚡ Code Quality Standards Compliance

**MANDATORY:** Compliance checkpoints:
- Before **proposing solutions**: Verify approach aligns with code quality standards and webflow patterns 
- Before **writing documentation**: Use workflows-documentation skill for structure/style enforcement 
- Before **initialization code**: Follow initialization patterns from code quality standards
- Before **animation implementation**: See animation workflow references
- Before **code discovery**: Use mcp-leann (semantic) + mcp-narsil (structural, via Code Mode) as complementary tools (MANDATORY)
- Before **research tasks**: Use Spec Kit Memory MCP to find prior work, saved context, and related memories (MANDATORY)
- Before **spec folder creation**: Use system-spec-kit skill for template structure and sub-folder organization
- Before **session end or major milestones**: Use `/memory:save` or "save context" to preserve important context (manual trigger required)
- Before **CDN deployment**: See cdn_deployment.md for version management and upload workflow
- Before **JavaScript minification**: See minification_guide.md for safe minification with verification
- **If conflict exists**: Code quality standards override general practices

**Violation handling:** If proposed solution contradicts code quality standards, STOP and ask for clarification or revise approach.

#### ⚡ Common Failure Patterns 

| #   | Stage          | Pattern                      | Trigger Phrase                               | Response Action                                        |
| --- | -------------- | ---------------------------- | -------------------------------------------- | ------------------------------------------------------ |
| 1   | Understanding  | Task Misinterpretation       | N/A                                          | Parse request, confirm scope                           |
| 2   | Understanding  | Assumptions                  | N/A                                          | Read existing code first                               |
| 3   | Planning       | Rush to Code                 | "straightforward"                            | Analyze → Verify → Simplest                            |
| 4   | Planning       | Over-Engineering             | N/A                                          | YAGNI - solve only stated                              |
| 5   | Planning       | Skip Process                 | "I already know"                             | Follow checklist anyway                                |
| 6   | Implementation | Clever > Clear               | N/A                                          | Obvious code wins                                      |
| 7   | Implementation | Fabrication                  | "obvious" w/o verify                         | Output "UNKNOWN", verify first                         |
| 8   | Implementation | Cascading Breaks             | N/A                                          | Reproduce before fixing                                |
| 9   | Implementation | Root Folder Pollution        | Creating temp file                           | STOP → Move to scratch/ → Verify                       |
| 10  | Review         | Skip Verification            | "trivial edit"                               | Run ALL tests, no exceptions                           |
| 11  | Review         | Retain Legacy                | "just in case"                               | Remove unused, ask if unsure                           |
| 12  | Completion     | No Browser Test              | "works", "done"                              | Browser verify first                                   |
| 13  | Any            | Internal Contradiction       | Conflicting requirements                     | HALT → State conflict explicitly → Request resolution  |
| 14  | Understanding  | Wrong Search Tool            | "find", "search", "list"                     | LEANN for meaning, Narsil for structure, Grep for text |
| 15  | Planning       | Skip Research                | "simple task"                                | Dispatch Research anyway for evidence                  |
| 16  | Any            | Task Without Context         | Missing dispatch context                     | Use 4-section format with full context                 |
| 17  | Implementation | Skip Debug Delegation        | "tried 3+ times", "same error"               | STOP → Suggest /spec_kit:debug → Wait for response     |
| 18  | Any            | Skip Handover at Session End | "stopping", "done for now", "continue later" | Suggest /spec_kit:handover → Wait for response         |

**Enforcement:** STOP → Acknowledge ("I was about to [pattern]") → Correct → Verify

---

## 3. 📝 MANDATORY: CONVERSATION DOCUMENTATION

Every conversation that modifies files MUST have a spec folder. **Full details**: system-spec-kit skill

### Documentation Levels

| Level | LOC     | Required Files                                            | Use When                     |
| ----- | ------- | --------------------------------------------------------- | ---------------------------- |
| **1** | <100    | spec.md, plan.md, tasks.md, implementation-summary.md     | All features (minimum)       |
| **2** | 100-499 | Level 1 + checklist.md                                    | QA validation needed         |
| **3** | ≥500    | Level 2 + decision-record.md (+ optional research.md)     | Complex/architecture changes |

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
Know what code DOES? → leann_leann_search() or leann_leann_ask() [NATIVE MCP - MANDATORY]
Research/prior work? → memory_search() [NATIVE MCP - MANDATORY]
Code structure/symbols? → narsil.narsil_find_symbols() [CODE MODE - via call_tool_chain()]
Security scan/vulnerabilities? → narsil.narsil_scan_security() [CODE MODE - via call_tool_chain()]
Code analysis (dead code, complexity)? → narsil.narsil_* tools [CODE MODE - via call_tool_chain()]
Text pattern? → Grep()
File structure? → Glob()
Complex reasoning? → sequential_thinking_sequentialthinking() [NATIVE MCP - OPTIONAL]
Browser debugging? → workflows-chrome-devtools skill
External MCP tools? → call_tool_chain() [Code Mode - Webflow, Figma, ClickUp, Narsil, etc.]
Multi-step workflow? → Read skill SKILL.md [see §7 Skills]
Stuck debugging 3+ attempts? → /spec_kit:debug → Model selection → Task tool dispatch
Multi-step task? → Task tool for delegation
New spec folder (Option B)? → Research task dispatch
Browser debugging needed? → workflows-chrome-devtools skill
Documentation generation? → workflows-documentation skill
```

### Two "Semantic" Systems (DO NOT CONFUSE)

| System              | MCP Name          | Database Location                                               | Purpose                               |
| ------------------- | ----------------- | --------------------------------------------------------------- | ------------------------------------- |
| **LEANN**           | `leann`           | `~/.leann/indexes/`                                             | **Code** semantic search              |
| **Spec Kit Memory** | `spec_kit_memory` | `.opencode/skill/system-spec-kit/database/context-index.sqlite` | **Conversation** context preservation |

**Common Confusion Points:**
- Both use vector embeddings for semantic search
- LEANN is for code/document search, Spec Kit Memory is for conversation context
- They are COMPLETELY SEPARATE systems with different purposes

**When cleaning/resetting databases:**
- Code search issues → Delete `~/.leann/indexes/` or use `leann remove <index-name>`
- Memory issues → Delete `.opencode/skill/system-spec-kit/database/context-index.sqlite`
- **IMPORTANT**: After deletion, restart OpenCode to clear the MCP server's in-memory cache

### Code Search Tools (COMPLEMENTARY - NOT COMPETING)

| Tool       | Type                  | Query Example               | Returns                                 |
| ---------- | --------------------- | --------------------------- | --------------------------------------- |
| **LEANN**  | Semantic              | "How does auth work?"       | Code by meaning/intent                  |
| **Narsil** | Structural + Security | "List functions in auth.ts" | Symbols, call graphs, security findings |
| **Grep**   | Lexical               | "Find 'TODO' comments"      | Text pattern matches                    |

**Decision Logic:**
- Need to UNDERSTAND code? → LEANN (semantic)
- Need to MAP code structure? → Narsil (structural, via Code Mode)
- Need SECURITY scan or CODE ANALYSIS? → Narsil (via Code Mode)
- Need to FIND text patterns? → Grep (lexical)

**Typical Workflow:**
1. Narsil → Map structure via Code Mode ("What functions exist?")
2. LEANN → Understand purpose ("How does login work?")
3. Read → Get implementation details

**LEANN Indexing Best Practices:**
- **Shell alias recommended:** `alias leann-build='leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'`
- Usage: `leann-build <name> --docs src/` (Qwen3 is 50% better than Contriever, trained on code)
- Start with smallest effective scope: `--docs src/` for large projects (>2000 files)
- See mcp-leann skill for setup instructions

### MCP Configuration

**Two systems:**

1. **Native MCP** (`opencode.json`) - Direct tools, called natively
   - Sequential Thinking, LEANN, Spec Kit Memory, Code Mode server

2. **Code Mode MCP** (`.utcp_config.json`) - External tools via `call_tool_chain()`
   - Webflow, Figma, Github, ClickUp, Chrome DevTools, Narsil, etc.
   - Naming: `{manual_name}.{manual_name}_{tool_name}` (e.g., `webflow.webflow_sites_list({})`, `narsil.narsil_find_symbols({})`)
   - Discovery: `search_tools()`, `list_tools()`, or read `.utcp_config.json`
  
---

## 7. 🧩 SKILLS SYSTEM

Skills are specialized, on-demand capabilities that provide domain expertise. Unlike knowledge files (passive references), skills are explicitly invoked to handle complex, multi-step workflows.

### How Skills Work

```
Task Received → Gate 2: Run skill_advisor.py (optional)
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
- **Native**: OpenCode v1.0.190+ auto-discovers skills and exposes them as `skills_*` functions (e.g., `skills_mcp_leann`, `skills_system_spec_kit`)
- **Direct**: Read `SKILL.md` from `.opencode/skill/<skill-name>/` folder

### Skill Loading Protocol

1. Gate 2 provides skill recommendation via `skill_advisor.py`
2. Invoke using appropriate method for your environment
3. Read bundled resources from `references/`, `scripts/`, `assets/` paths
4. Follow skill instructions to completion
5. Do NOT re-invoke a skill already in context

### Skill Maintenance 

Skills are located in `.opencode/skill/`.

When creating or editing skills:
- Validate skill structure matches template in `workflows-documentation/references/skill_creation.md`
- Use the templates in `workflows-documentation/assets/` (`skill_md_template.md`, `skill_reference_template.md`, `skill_asset_template.md`)
- Ensure all bundled resources are referenced with relative paths
- Test skill invocation before committing

### Skill Routing (Gate 2)

Gate 2 routes tasks to skills via `skill_advisor.py`. When confidence > 0.8, you MUST invoke the recommended skill.

**How to use skills:**
- OpenCode v1.0.190+ auto-discovers skills from `.opencode/skill/*/SKILL.md` frontmatter
- Skills appear as `skills_*` functions in your available tools (e.g., `skills_mcp_leann`, `skills_system_spec_kit`)
- When a task matches a skill, read the SKILL.md directly: `Read(".opencode/skill/<skill-name>/SKILL.md")`
- Base directory provided for resolving bundled resources (`references/`, `scripts/`, `assets/`)

**Usage notes:**
- Do not invoke a skill that is already loaded in your context
- Each skill invocation is stateless
- Skills are auto-indexed from SKILL.md frontmatter - no manual list maintenance required