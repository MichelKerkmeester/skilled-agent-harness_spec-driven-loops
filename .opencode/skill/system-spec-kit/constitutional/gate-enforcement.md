<!-- TEMPLATE: constitutional_memory.md v1.0 -->
---
title: "CRITICAL GATES & RULES - HARD BLOCK ENFORCEMENT"
importanceTier: constitutional
contextType: decision
triggerPhrases:
  # Continuation (Behavioral Rule)
  - continue
  - left off
  - continuation
  - handover
  - resume
  - where we left
  - pick up where
  - attempt
  # Gate 2 - Understanding
  - research
  - explore
  - understand
  - context
  # Gate 2 - Skill Routing (Advisory)
  - skill
  - workflow
  # Gate 3 - File Modification (HARD BLOCK)
  - fix
  - implement
  - create
  - modify
  - update
  - change
  - edit
  - refactor
  - write
  - add
  - remove
  - delete
  - rename
  - move
  - build
  - generate
  - configure
  - analyze
  - spec folder
  - gate 1
  - comprehensive
  - all bugs
  - fix all
  - everything
  # Memory Save Rule (HARD)
  - save context
  - save memory
  - memory save
  - preserve context
  # Completion Rule (HARD)
  - done
  - complete
  - finished
  - works
  - completed
  - all done
  # Memory Retrieval
  - search memory
  - find context
  - prior work
  - previous session
  # Edge Case - Compaction
  - compaction
  - context lost
  - context compaction
---

# CRITICAL GATES & RULES - HARD BLOCK ENFORCEMENT

> Constitutional memory for gates and behavioral rules. Always surfaces at top of memory search.

These rules are HARD BLOCKS. No exceptions. No "I'll do it after."

<!-- ANCHOR:gate-hard-blocks -->

## GATE 1: SPEC FOLDER BEFORE FILE MODIFICATIONS [HARD BLOCK]

**TRIGGER:** Any intent to create, edit, delete, fix, implement, update, rename, move, build, generate, configure, or analyze files.

**REQUIRED ACTION:**

STOP and ASK before using Read/Edit/Write/Bash:

> **Spec Folder:** A) Existing | B) New | C) Update related | D) Skip

WAIT for user's answer. THEN proceed.

**VIOLATION = HARD BLOCK**

- DO NOT analyze code first
- DO NOT "just check" files first  
- DO NOT start on "exciting" tasks without asking
- ASK FIRST, always

### FIRST MESSAGE PROTOCOL [HARD BLOCK]

**TRIGGER:** User's FIRST message in conversation requests file modifications

**ACTION:**
1. Gate 1 question is your FIRST response
2. No analysis first ("let me understand the scope")
3. No tool calls first ("let me check what exists")
4. Ask immediately → Wait for answer → THEN proceed

**RATIONALE:** Large tasks feel urgent. Urgency bypasses process. Ask first, analyze after.

## MEMORY SAVE RULE [HARD BLOCK]

**TRIGGER:** "save context", "save memory", `/memory:save`, or any memory file creation.

**REQUIRED ACTION:**

ONLY use this command to save context:

```bash
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js [spec-folder-path]
```

Or with JSON input for rich context:
```bash
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js /tmp/save-context-data.json
```

**VIOLATION = HARD BLOCK**

- NEVER manually create memory files with Write/Edit tools
- NEVER write to `memory/*.md` paths directly
- If violation detected: DELETE the file and re-run via script
- Script ensures: proper anchors, format, embeddings, indexing

<!-- /ANCHOR:gate-hard-blocks -->

<!-- ANCHOR:gate-behavioral -->

## BEHAVIORAL RULES (Always Active)

These rules apply automatically without numbered gate structure.

### CONTINUATION VALIDATION

**TRIGGER:** User message contains "CONTINUATION - Attempt" pattern

**Action:**
1. Parse handoff message for: Spec folder path, Last Action, Next Action
2. Validate against most recent memory file in spec folder
3. IF mismatch: Report and ask which is correct (A: Handoff, B: Memory, C: Investigate)
4. IF validated: Proceed with "Continuation validated"

**Rationale:** Moved from numbered gate - narrow trigger, procedural validation.

### COMPLETION VERIFICATION

**TRIGGER:** Claiming "done", "complete", "finished", "works"

**Action:**
1. Load `checklist.md` from spec folder
2. Verify ALL items addressed
3. Mark each `[x]` with evidence
4. Only THEN claim completion

**Exception:** Level 1 tasks (<100 LOC) may skip if no checklist.md exists.

<!-- /ANCHOR:gate-behavioral -->

<!-- ANCHOR:gate-soft-advisory -->

## NUMBERED GATES (Pre-Execution)

### GATE 2: UNDERSTANDING + CONTEXT SURFACING [SOFT BLOCK]

**TRIGGER:** EACH new user message (re-evaluate even in ongoing conversations)

**Action:**
1. Call `memory_match_triggers(prompt)` to surface relevant context
2. Classify intent shape: Research | Implementation
3. Parse request and check confidence (see Confidence Framework)
4. If <40%: ASK | 40-79%: PROCEED WITH CAUTION | >=80%: PASS

**Priority Note:** If file modification detected, Gate 1 (HARD BLOCK) takes precedence.

### GATE 3: SKILL ROUTING [ADVISORY]

**TRIGGER:** After understanding the request

**Action:** 
- IF task clearly matches a skill domain → invoke skill directly
- IF uncertain → optionally run `python3 .opencode/scripts/skill_advisor.py`
- IF confidence > 0.8 from advisor → invoke recommended skill

**Note:** Task-appropriate skills can be recognized without mandatory script call.
Script is advisory, not mandatory per request.

### MEMORY CONTEXT LOADING [SOFT]

**TRIGGER:** User selected A or C in Gate 1 AND memory files exist

**Action:**
```javascript
memory_search({ query: "session context", specFolder: "folder-name", includeContent: true })
```

Results include embedded content directly. Constitutional memories always appear first.

**Skip:** User can say "skip context" to proceed immediately.

<!-- /ANCHOR:gate-soft-advisory -->

<!-- ANCHOR:gate-edge-cases -->

## EDGE CASES

### COMPACTION RECOVERY

**TRIGGER:** System message "Please continue the conversation from where we left it off..." or context compaction detected.

**Action:**
1. **STOP** immediately
2. Display handover protocol:
   ```
   CONTEXT COMPACTION DETECTED
   
   Start new conversation with handoff:
   CONTINUATION - Attempt [N]
   Spec: [CURRENT_SPEC_PATH]
   Last: [COMPLETED_TASK]
   Next: [PENDING_TASK]
   
   Run /spec_kit:handover first
   ```
3. **WAIT** for user confirmation

### VIOLATION RECOVERY

If you catch yourself about to skip gates:

1. **STOP** immediately
2. **State**: "Before I proceed, I need to ask about documentation:"
3. **Ask** the applicable Gate 1 question
4. **Wait** for response, then continue

<!-- /ANCHOR:gate-edge-cases -->

<!-- ANCHOR:gate-quick-reference -->

## MEMORY RETRIEVAL: SEARCH + READ

**TRIGGER:** Need prior context, previous decisions, or session history.

**WORKFLOW:**

```
memory_search({ query: "topic" })  ->  Results with filePaths
         |
Read(result.filePath)  ->  Full content
```

**KEY POINTS:**

1. **Search is your entry point** - no separate "load" command
2. **Constitutional memories always surface first** in search results
3. **Use Read tool** to get full file content from search results
4. **Trigger matching** - `memory_match_triggers(prompt)` for proactive surfacing

## Quick Reference

| Gate/Rule          | Trigger                  | Action                      | Type             |
| ------------------ | ------------------------ | --------------------------- | ---------------- |
| **Gate 1**         | File modification intent | Ask A/B/C/D spec folder     | HARD             |
| **First Message**  | First msg + file mod     | Gate 1 question FIRST       | HARD             |
| **Memory Save**    | "save context/memory"    | Use generate-context.js     | HARD (post-exec) |
| **Continuation**   | "CONTINUATION - Attempt" | Validate against memory     | BEHAVIORAL       |
| **Completion**     | "done/complete/finished" | Verify checklist.md         | BEHAVIORAL       |
| **Gate 2**         | New user message         | `memory_match_triggers()`   | SOFT             |
| **Gate 3**         | After understanding      | Optional `skill_advisor.py` | ADVISORY         |
| **Memory Context** | Option A/C in Gate 1     | Load memory files           | SOFT (pre-exec)  |
| **Compaction**     | Context lost message     | Display handover protocol   | EDGE CASE        |
| **Violation**      | About to skip gates      | STOP, state, ask, wait      | EDGE CASE        |

## Self-Check (Before ANY Action)

```
[ ] File modification detected? Did I ask spec folder question? If NO → Ask NOW.
[ ] Am I saving memory/context? → Use generate-context.js script (not Write tool)
[ ] Aligned with ORIGINAL request? → Check for scope drift from Turn 1 intent
[ ] Claiming completion? → Verify checklist.md items first
```

<!-- /ANCHOR:gate-quick-reference -->

*Constitutional Memory - Always surfaces at top of search results*
*Location: .opencode/skill/system-spec-kit/constitutional/*