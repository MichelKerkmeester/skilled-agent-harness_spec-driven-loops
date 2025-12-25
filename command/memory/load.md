---
description: Load specific memory content by ID, spec folder, or anchor
argument-hint: "<memory-id> | <spec-folder> [--anchor:<id>]"
allowed-tools: Read, semantic_memory_memory_search, semantic_memory_memory_list
---

# Memory Load

Load and display specific memory content for review or context restoration.

---

```yaml
role: Memory Retrieval Specialist
purpose: Load specific memory content by various identifiers
action: Retrieve and display memory content with formatting

operating_mode:
  workflow: direct_retrieval
  workflow_compliance: MANDATORY
  approvals: none_required
  tracking: access_count
```

---

## 1. 🎯 PURPOSE

Load specific memory content when you need to:
- Review a particular memory's full content
- Load context from a specific spec folder
- Access a specific anchor section within a memory
- Restore context from a previous session

---

## 2. 📝 CONTRACT

**Inputs:** `$ARGUMENTS` - Memory ID, spec folder path, or anchor reference
**Outputs:** `STATUS=<OK|FAIL> CONTENT=<memory_content>`

---

## 3. 🔀 ARGUMENT ROUTING

```
$ARGUMENTS
    │
    ├─ Numeric ID (e.g., "42")
    │   └─→ Load memory by ID (Section 5.1)
    │
    ├─ Spec folder path (e.g., "007-auth")
    │   └─→ Load most recent memory from folder (Section 5.2)
    │
    ├─ With --anchor:<id> flag
    │   └─→ Load specific anchor section (Section 5.3)
    │
    └─ Empty
        └─→ Show usage help (Section 6)
```

---

## 4. 🔧 MCP ENFORCEMENT MATRIX

**CRITICAL:** Use the correct MCP tools for each retrieval pattern.

```
┌─────────────────┬─────────────────────────────────────────────────────────┬──────────┬─────────────────┐
│ MODE            │ REQUIRED CALLS                                          │ PATTERN  │ ON FAILURE      │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ BY ID           │ memory_list → Read(filePath)                            │ SEQUENCE │ ID not found    │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ BY SPEC FOLDER  │ memory_search(specFolder) → Read(filePath)              │ SEQUENCE │ No memories     │
├─────────────────┼─────────────────────────────────────────────────────────┼──────────┼─────────────────┤
│ WITH ANCHOR     │ memory_list/search → Read(filePath) → Extract anchor    │ SEQUENCE │ Anchor missing  │
└─────────────────┴─────────────────────────────────────────────────────────┴──────────┴─────────────────┘
```

### MCP Tool Signatures

```javascript
semantic_memory_memory_list({ limit: N, sortBy: "created_at", specFolder: "optional" })
semantic_memory_memory_search({ query: "*", specFolder: "<folder>", limit: 1 })
Read({ filePath: "<absolute_path>" })
```

---

## 5. ⚡ INSTRUCTIONS

### 5.1 Load by Memory ID

**Usage:** `/memory:load 42`

**Steps:**

1. Use `memory_list` to find the memory and get its file path:
   ```javascript
   semantic_memory_memory_list({ limit: 100, sortBy: "created_at" })
   ```

2. Find the memory with matching ID in results

3. Use `Read(filePath)` to load full content:
   ```javascript
   Read({ filePath: "<absolute_path_from_result>" })
   ```

4. Display formatted content (Section 7)

**Error Handling:**
- If ID not found: `STATUS=FAIL ERROR="Memory #<id> not found"`

### 5.2 Load by Spec Folder

**Usage:** `/memory:load 007-auth-feature`

**Steps:**

1. Search for memories in spec folder:
   ```javascript
   semantic_memory_memory_search({ 
     query: "*", 
     specFolder: "007-auth-feature",
     limit: 5 
   })
   ```

2. If multiple results, load the most recent one (sorted by updated_at)

3. Use `Read(filePath)` to load full content

4. Display formatted content (Section 7)

**Error Handling:**
- If no memories found: `STATUS=FAIL ERROR="No memories in folder <folder>"`

### 5.3 Load with Anchor

**Usage:** `/memory:load 42 --anchor:summary`

**Steps:**

1. Load memory file using steps from 5.1 or 5.2

2. Extract anchor section using regex pattern:
   ```regex
   <!-- ANCHOR:<anchor-id> -->
   (.*?)
   <!-- /ANCHOR:<anchor-id> -->
   ```

3. Display only the anchor content

**Anchor ID Examples:**
- `summary` - Session summary section
- `decision-*` - Decision records
- `implementation-*` - Implementation details
- `files` - Files modified list

**Error Handling:**
- If anchor not found: `STATUS=FAIL ERROR="Anchor '<id>' not found in memory #<id>"`
- Show available anchors if extraction fails

---

## 6. 📖 USAGE HELP

**When no arguments provided, display:**

```
MEMORY LOAD - Usage
────────────────────────────────────────────────────

Load specific memory content by ID, spec folder, or anchor.

USAGE:
  /memory:load <memory-id>              Load memory by numeric ID
  /memory:load <spec-folder>            Load most recent from folder
  /memory:load <id> --anchor:<anchor>   Load specific section

EXAMPLES:
  /memory:load 42                       Load memory #42
  /memory:load 007-auth                 Load from 007-auth folder
  /memory:load 42 --anchor:summary      Load only summary section
  /memory:load 007-auth --anchor:decision-jwt

RELATED:
  /memory:search                        Find memories by query
  /memory:save                          Save new memory
  /memory:checkpoint                    Checkpoint management

STATUS=OK
```

---

## 7. 📊 OUTPUT FORMAT

### Full Memory Display

```
MEMORY #<id>: <title>
────────────────────────────────────────────────────
Spec Folder: <spec_folder>
Created:     <created_date>
Updated:     <updated_date>
Tier:        <importance_tier>
Type:        <context_type>
Triggers:    <phrase1>, <phrase2>, <phrase3>

────────────────────────────────────────────────────
<memory_content>
────────────────────────────────────────────────────

AVAILABLE ANCHORS:
  - summary
  - decision-jwt
  - files

────────────────────────────────────────────────────
[e]dit triggers | [p]romote tier | [v]alidate | [b]ack | [q]uit

STATUS=OK ID=<id>
```

### Anchor-Only Display

```
MEMORY #<id>: <title>
ANCHOR: <anchor-id>
────────────────────────────────────────────────────

<anchor_content>

────────────────────────────────────────────────────
[f]ull memory | [o]ther anchor | [b]ack | [q]uit

STATUS=OK ID=<id> ANCHOR=<anchor-id>
```

---

## 8. 🔄 POST-LOAD ACTIONS

| Input | Action                                              |
| ----- | --------------------------------------------------- |
| e     | Go to trigger edit mode (see /memory:search)        |
| p     | Show tier promotion menu                            |
| v     | Validate as useful (`memory_validate(wasUseful:true)`) |
| f     | Load full memory (when in anchor view)              |
| o     | Prompt for another anchor ID                        |
| b     | Back to previous screen                             |
| q     | Exit with STATUS=OK                                 |

---

## 9. 🔍 QUICK REFERENCE

| Usage                              | Description                    |
| ---------------------------------- | ------------------------------ |
| `/memory:load 42`                  | Load memory by ID              |
| `/memory:load 007-auth`            | Load from spec folder          |
| `/memory:load 42 --anchor:summary` | Load specific anchor section   |
| `/memory:load 007-auth --anchor:decision-jwt` | Folder + anchor    |

---

## 10. ⚠️ ERROR HANDLING

| Condition                | Action                                          |
| ------------------------ | ----------------------------------------------- |
| Memory ID not found      | `STATUS=FAIL ERROR="Memory #<id> not found"`    |
| No memories in folder    | `STATUS=FAIL ERROR="No memories in <folder>"`   |
| Anchor not found         | Show available anchors, suggest alternatives    |
| File path missing        | `STATUS=FAIL ERROR="File path unavailable"`     |
| Read permission denied   | `STATUS=FAIL ERROR="Cannot read memory file"`   |

---

## 11. 📌 RELATED COMMANDS

- `/memory:search` - Find memories by query, browse dashboard
- `/memory:save` - Save new memory context
- `/memory:checkpoint` - Create/restore memory state checkpoints

---

## 12. 📚 FULL DOCUMENTATION

For comprehensive memory system documentation:
`.opencode/skill/system-spec-kit/SKILL.md`
