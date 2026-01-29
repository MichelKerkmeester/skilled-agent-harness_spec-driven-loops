# Memory

> Context preservation folder for future sessions - **NEVER created manually**.

---

## 1. 📖 OVERVIEW

The `memory/` folder stores session context, decisions, blockers, and summaries for future AI sessions. It enables:

1. **Context Recovery** - Resume work from previous sessions without repeating discovery
2. **Decision Tracking** - Preserve architectural choices and rationale
3. **Blocker Documentation** - Record unresolved issues for future resolution
4. **Session Handoffs** - Transfer context between sessions or team members

---

## 2. ⚠️ IMPORTANT WARNING

**CRITICAL**: NEVER create memory files manually using the Write tool.

Memory files MUST be generated using the `generate-context.js` script to ensure:
- Proper ANCHOR formatting for semantic search
- Automatic indexing in the Spec Kit Memory database
- Consistent structure and metadata
- Vector embeddings for context retrieval

**Violation Recovery**: If you accidentally create a memory file with the Write tool:
1. DELETE the manually created file
2. Re-run via `generate-context.js` script

---

## 3. 🚀 HOW MEMORY FILES ARE CREATED

Memory files are created automatically by the `generate-context.js` script:

```bash
# Mode 1: JSON input (recommended for complex context)
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js /tmp/save-context-data.json

# Mode 2: Direct spec folder path
node .opencode/skill/system-spec-kit/scripts/memory/generate-context.js specs/005-memory
```

**User Triggers**:
- "save context" or "save memory" in conversation
- `/memory:save` command
- `/spec_kit:handover` command (session end)

**Output Location**: `specs/[###-name]/memory/YYYYMMDD_HHMMSS_[title].md`

---

## 4. 📁 WHAT GOES HERE

This `templates/memory/` folder is **empty by design**. It demonstrates the structure of where memory files would be saved in an active spec folder, but contains no actual saved context.

In a real spec folder (e.g., `specs/007-auth/memory/`), you would find:

| File Pattern | Content | Example |
|--------------|---------|---------|
| `YYYYMMDD_HHMMSS_session.md` | Session summary with decisions | `20260121_143022_auth-implementation.md` |
| `YYYYMMDD_HHMMSS_blocker.md` | Unresolved blockers | `20260121_150045_oauth-callback-issue.md` |
| `YYYYMMDD_HHMMSS_decision.md` | Architectural decisions | `20260121_152030_jwt-vs-sessions.md` |

**ANCHOR Format** (enables semantic search):
```markdown
## ANCHOR: summary
Brief overview of what happened in this session

## ANCHOR: decisions
- Decision 1: JWT tokens chosen over sessions (rationale: scalability)
- Decision 2: bcrypt for password hashing (rationale: industry standard)

## ANCHOR: state
Current implementation status and what's working

## ANCHOR: next-steps
What needs to happen next
```

**6-Tier Importance System** (retrieval priority):

Memory files are automatically scored using a 6-tier importance system that determines retrieval priority:

| Tier | Score | Criteria | Retrieval Priority |
|------|-------|----------|-------------------|
| **Constitutional** | 100 | Project-wide rules, hard constraints | ALWAYS retrieved first |
| **Critical** | 80 | Blockers, critical decisions | High priority |
| **High** | 60 | Major decisions, key context | Medium-high priority |
| **Medium** | 40 | Standard session context | Medium priority |
| **Low** | 20 | Minor notes, references | Low priority |
| **Archive** | 10 | Historical, rarely needed | Lowest priority |

**How Tiers Work:**
- Constitutional memories appear FIRST in all search results (safety-critical rules)
- Critical/High memories surface for active work context
- Medium memories provide background context
- Low/Archive memories retrieved only when specifically relevant

**Automatic Scoring:** The `generate-context.js` script analyzes content to assign tier scores based on keywords, section structure, and context markers.

---

## 5. 📚 RELATED DOCUMENTS

### Documentation
- [Memory System Overview](../../references/memory/memory_system.md) - Architecture and indexing
- [Save Workflow](../../references/memory/save_workflow.md) - Step-by-step save process
- [Trigger Configuration](../../references/memory/trigger_config.md) - Auto-trigger rules

### Scripts
- [generate-context.js](../../scripts/memory/generate-context.js) - Memory file generation (MANDATORY)
- [search-memory.js](../../scripts/memory/search-memory.js) - Search saved context

### Commands
- `/memory:save` - Save current conversation context
- `/memory:search` - Search across all memory files
- `/spec_kit:handover` - Create session handover document

---

<!--
MEMORY TEMPLATES - Empty by Design
- Demonstrates structure, contains no saved context
- Real memory files created via generate-context.js ONLY
- Located in active spec folders: specs/[###-name]/memory/
- Template folder shows WHERE memory would be saved
-->
