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
  - spec folder
  - gate 3
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

<!-- ANCHOR:constitutional-gate-enforcement -->

# CRITICAL GATES & RULES - HARD BLOCK ENFORCEMENT

> Constitutional memory for gates and behavioral rules. Always surfaces at top of memory search.

These rules are HARD BLOCKS. No exceptions. No "I'll do it after."

---

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

---

### COMPLETION VERIFICATION

**TRIGGER:** Claiming "done", "complete", "finished", "works"

**Action:**
1. Load `checklist.md` from spec folder
2. Verify ALL items addressed
3. Mark each `[x]` with evidence
4. Only THEN claim completion

**Exception:** Level 1 tasks (<100 LOC) may skip if no checklist.md exists.

---

## NUMBERED GATES (Pre-Execution)

### GATE 1: UNDERSTANDING + CONTEXT SURFACING [SOFT BLOCK]

**TRIGGER:** EACH new user message (re-evaluate even in ongoing conversations)

**Action:**
1. Call `memory_match_triggers(prompt)` to surface relevant context
2. Classify intent shape: Research | Implementation
3. Parse request and check confidence (see Confidence Framework)
4. If <40%: ASK | 40-79%: PROCEED WITH CAUTION | >=80%: PASS

**Priority Note:** If file modification detected, Gate 3 (HARD BLOCK) takes precedence.

---

### GATE 2: SKILL ROUTING [ADVISORY]

**TRIGGER:** After understanding the request

**Action:** 
- IF task clearly matches a skill domain → invoke skill directly
- IF uncertain → optionally run `python3 .opencode/scripts/skill_advisor.py`
- IF confidence > 0.8 from advisor → invoke recommended skill

**Note:** Task-appropriate skills can be recognized without mandatory script call.
Script is advisory, not mandatory per request.

---

### GATE 3: SPEC FOLDER BEFORE FILE MODIFICATIONS [HARD BLOCK]

**TRIGGER:** Any intent to create, edit, delete, fix, implement, update, rename, or move files.

**REQUIRED ACTION:**

STOP and ASK before using Read/Edit/Write/Bash:

> **Spec Folder:** A) Existing | B) New | C) Update related | D) Skip

WAIT for user's answer. THEN proceed.

**VIOLATION = HARD BLOCK**

- DO NOT analyze code first
- DO NOT "just check" files first  
- DO NOT start on "exciting" tasks without asking
- ASK FIRST, always

---

### MEMORY CONTEXT LOADING [SOFT]

**TRIGGER:** User selected A or C in Gate 3 AND memory files exist

**Action:**
```javascript
memory_search({ specFolder: "folder-name", includeContent: true })
```

Results include embedded content directly. Constitutional memories always appear first.

**Skip:** User can say "skip context" to proceed immediately.

---

## POST-EXECUTION RULES

### MEMORY SAVE RULE [HARD BLOCK]

**TRIGGER:** "save context", "save memory", `/memory:save`, or any memory file creation.

**REQUIRED ACTION:**

ONLY use this command to save context:

```bash
node .opencode/skill/system-spec-kit/scripts/generate-context.js [spec-folder-path]
```

Or with JSON input for rich context:
```bash
node .opencode/skill/system-spec-kit/scripts/generate-context.js /tmp/save-context-data.json
```

**VIOLATION = HARD BLOCK**

- NEVER manually create memory files with Write/Edit tools
- NEVER write to `memory/*.md` paths directly
- If violation detected: DELETE the file and re-run via script
- Script ensures: proper anchors, format, embeddings, indexing

---

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

---

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

---

## Quick Reference

| Gate/Rule | Trigger | Action | Type |
|-----------|---------|--------|------|
| **Continuation** | "CONTINUATION - Attempt" | Validate against memory | BEHAVIORAL |
| **Gate 1** | New user message | `memory_match_triggers()` | SOFT |
| **Gate 2** | After understanding | Optional `skill_advisor.py` | ADVISORY |
| **Gate 3** | File modification intent | Ask A/B/C/D spec folder | HARD |
| **Memory Context** | Option A/C selected | Load memory files | SOFT (pre-exec) |
| **Memory Save** | "save context/memory" | Use generate-context.js | HARD (post-exec) |
| **Completion** | "done/complete/finished" | Verify checklist.md | HARD (post-exec) |
| **Compaction** | Context lost message | Display handover protocol | EDGE CASE |

---

## Self-Check (Before ANY Action)

```
[ ] File modification detected? Did I ask spec folder question? If NO → Ask NOW.
[ ] Am I saving memory/context? → Use generate-context.js script (not Write tool)
[ ] Aligned with ORIGINAL request? → Check for scope drift from Turn 1 intent
[ ] Claiming completion? → Verify checklist.md items first
```

<!-- /ANCHOR:constitutional-gate-enforcement -->

---

*Constitutional Memory - Always surfaces at top of search results*
*Location: .opencode/skill/system-spec-kit/constitutional/*
