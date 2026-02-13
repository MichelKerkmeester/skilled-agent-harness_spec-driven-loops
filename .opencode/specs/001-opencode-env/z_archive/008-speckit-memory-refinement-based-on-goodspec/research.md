# Research: Current Memory Commands Analysis

**Research ID:** 086-memory-commands-analysis
**Date:** 2026-02-04
**Status:** Complete
**Scope:** Analysis of current memory commands vs goodspec memory commands

---

## Executive Summary

This document provides a comprehensive analysis of the current SpecKit memory command system (5 commands) compared to the goodspec memory system (3 commands). The analysis reveals that our system is significantly more sophisticated with advanced features like intent-aware retrieval, session deduplication, and checkpoint management, but the goodspec system offers simpler user experience with semantic content types.

---

## 1. Current Memory Command Roster

Our memory system consists of **5 commands** (consolidated from 9 in v1.2.1):

| Command | File | Purpose | Complexity |
|---------|------|---------|------------|
| `/memory:context` | `context.md` | Unified intent-aware retrieval | High |
| `/memory:continue` | `continue.md` | Session recovery from crash/compaction | Medium |
| `/memory:learn` | `learn.md` | Explicit learning capture with corrections | High |
| `/memory:manage` | `manage.md` | Database administration and checkpoints | High |
| `/memory:save` | `save.md` | Context preservation with semantic indexing | High |

**Source:** `/Users/michelkerkmeester/MEGA/Development/Websites/anobel.com/.opencode/command/memory/`

---

## 2. Goodspec Memory Command Roster

The goodspec system uses **3 memory commands**:

| Command | File | Purpose | Complexity |
|---------|------|---------|------------|
| `/goop-memory` | `goop-memory.md` | View memory status and statistics | Low |
| `/goop-remember` | `goop-remember.md` | Save context, decisions, notes | Low |
| `/goop-recall` | `goop-recall.md` | Search and retrieve memories | Low |

**Source:** `specs/003-memory-and-spec-kit/086-speckit-memory-refinement-based-on-goodspec/context/goodspec-repo/commands/`

---

## 3. Detailed Command Analysis

### 3.1 Context Retrieval Comparison

#### Our System: `/memory:context`

**Features:**
- Intent-aware routing with 5 intent types: `add_feature`, `fix_bug`, `refactor`, `security_audit`, `understand`
- Automatic weight adjustments based on detected intent (1.2x-1.5x boosts)
- Anchor-based retrieval for 93% token savings
- Token budget enforcement (2000-4000 tokens configurable per intent)
- Session deduplication for cross-session queries
- Mandatory argument validation gate

**Intent Detection Logic:**
```javascript
const INTENT_KEYWORDS = {
  add_feature: ['implement', 'add feature', 'add new', 'add a', 'create new', 'build new', 'new feature'],
  fix_bug: ['bug', 'error', 'fix', 'broken', 'issue', 'debug'],
  refactor: ['refactor', 'restructure', 'improve', 'clean up', 'optimize'],
  security_audit: ['security', 'vulnerability', 'auth', 'sanitize', 'xss', 'csrf'],
  understand: ['how', 'why', 'what', 'explain', 'understand', 'learn']
};
```

**Usage Patterns:**
- `/memory:context "oauth implementation"` - Auto-detect add_feature
- `/memory:context "auth bug" --intent:fix_bug` - Explicit intent override

#### Goodspec: `/goop-recall`

**Features:**
- Simple query-based search
- Pre-defined shortcuts: `recent`, `decisions`
- Type filtering (decision, note, observation)
- Importance scoring display
- Suggested related searches

**Usage Patterns:**
- `/goop-recall [query]` - Simple text search
- `/goop-recall recent` - Show recent memories
- `/goop-recall decisions` - Filter by type

**Gap Analysis:**
| Feature | Our System | Goodspec | Gap |
|---------|------------|----------|-----|
| Intent detection | Yes (5 types) | No | Our advantage |
| Weight optimization | Yes (per intent) | No | Our advantage |
| Anchor retrieval | Yes (93% savings) | No | Our advantage |
| Token budgets | Yes | No | Our advantage |
| Simple queries | Complex | Simple | Goodspec advantage |
| Type shortcuts | No | Yes (`recent`, `decisions`) | Goodspec advantage |

---

### 3.2 Save Operations Comparison

#### Our System: `/memory:save`

**Features:**
- Multi-phase validation (Phase 0: Pre-flight, Phase 1: Folder, Phase 1B: Alignment)
- Mandatory spec folder association
- JSON data construction with structured fields:
  - sessionSummary, keyDecisions, filesModified, triggerPhrases, technicalContext
- ANCHOR tag generation with opening AND closing markers
- Session deduplication (fingerprint-based)
- Token budget validation for large conversations
- Sub-agent delegation for execution
- Deferred indexing with graceful degradation
- Structured JSON response envelope

**Save Process:**
1. Phase 0: Pre-flight checks (anchors, duplicates, tokens, folder, naming)
2. Phase 1: Spec folder validation
3. Phase 1B: Content alignment check
4. Step 2: Context analysis (AI extracts data)
5. Step 3: Anchor generation
6. Step 4: JSON data construction
7. Step 5: Execute `generate-context.js` script
8. Step 6: Report results

**Usage:**
- `/memory:save 011-memory` - Save to specific spec folder
- `/memory:save` - Auto-detect spec folder (requires prompt)

#### Goodspec: `/goop-remember`

**Features:**
- Auto-type detection based on content prefix
- 4 memory types: decision, note, todo, auto-detect
- Automatic fact extraction
- Concept/tag extraction
- Importance scoring (1-10)
- Simple confirmation output

**Usage Patterns:**
- `/goop-remember [content]` - Auto-detect type
- `/goop-remember decision: [content]` - Log decision with reasoning
- `/goop-remember note: [content]` - Quick note
- `/goop-remember todo: [content]` - Durable task

**Gap Analysis:**
| Feature | Our System | Goodspec | Gap |
|---------|------------|----------|-----|
| Spec folder association | Required | None | Organizational advantage ours |
| Pre-flight validation | 5 checks | None | Quality advantage ours |
| Type prefixes | None | Yes (`decision:`, `note:`, `todo:`) | Goodspec UX advantage |
| Auto-fact extraction | No | Yes | Goodspec advantage |
| Importance scoring | Tier-based (6 tiers) | Numeric (1-10) | Different approach |
| Inline content | No (requires phases) | Yes (single line) | Goodspec UX advantage |

---

### 3.3 Management Operations Comparison

#### Our System: `/memory:manage`

**Features:**
- 10 subcommands: stats, scan, cleanup, tier, triggers, validate, delete, health, checkpoint create/restore/list/delete
- Checkpoint system with max 10 checkpoints, 30-day auto-cleanup
- Pre-cleanup checkpoint creation for safety
- Rollback support with pre-restore snapshots
- Tier management (6 tiers: constitutional to deprecated)
- Trigger phrase editing
- Usefulness validation feedback
- Health diagnostics
- Schema v9 with 5 tables (memories, causal_edges, memory_corrections, session_state, checkpoints)

**Subcommand Summary:**
| Subcommand | Purpose |
|------------|---------|
| (empty) | Stats dashboard |
| `scan [--force]` | Index new/changed files |
| `cleanup` | Remove deprecated/old memories |
| `tier <id> <tier>` | Change importance tier |
| `triggers <id>` | Edit trigger phrases |
| `validate <id> useful\|not` | Record feedback |
| `delete <id>` | Remove memory |
| `health` | System diagnostics |
| `checkpoint create <name>` | Save state |
| `checkpoint restore <name>` | Restore state |
| `checkpoint list` | List checkpoints |
| `checkpoint delete <name>` | Remove checkpoint |

#### Goodspec: `/goop-memory`

**Features:**
- 3 subcommands: (default), stats, clean
- Worker status display
- Type breakdown (decisions, observations, notes, session summaries)
- Recent activity summary
- Storage usage
- Top concepts display
- Clean with confirmation

**Subcommand Summary:**
| Subcommand | Purpose |
|------------|---------|
| (empty) | Basic status |
| `stats` | Detailed breakdown |
| `clean` | Remove old/low-importance |

**Gap Analysis:**
| Feature | Our System | Goodspec | Gap |
|---------|------------|----------|-----|
| Checkpoints | Yes (full backup/restore) | No | Our major advantage |
| Tier management | Yes (6 tiers) | No | Our advantage |
| Trigger editing | Yes | No | Our advantage |
| Validation feedback | Yes | No | Our advantage |
| Health diagnostics | Yes (schema, DB health) | Basic status | Our advantage |
| Scan/indexing | Yes (force option) | No | Our advantage |
| Top concepts | No | Yes | Goodspec advantage |
| Recent activity | Partial | Yes | Goodspec advantage |
| Simplicity | Low (12 subcommands) | High (3 subcommands) | Goodspec advantage |

---

### 3.4 Session Recovery Comparison

#### Our System: `/memory:continue`

**Features:**
- 3 recovery scenarios: crash, compaction, timeout
- Auto vs manual mode
- CONTINUE_SESSION.md detection
- SQLite crash recovery with WAL (Write-Ahead Logging)
- SessionStateManager API
- Content vs folder alignment validation
- Recovery priority order (5 sources)
- Session isolation for security

**Recovery Sources (priority order):**
1. CONTINUE_SESSION.md (<24h old)
2. Memory file with state anchor
3. Most recent memory file (full)
4. checklist.md progress
5. User input (fallback)

#### Goodspec: No equivalent

Goodspec does not have a dedicated session recovery command.

---

### 3.5 Learning Capture Comparison

#### Our System: `/memory:learn`

**Features:**
- 5 learning types: pattern, mistake, insight, optimization, constraint
- 4-phase extraction: extraction, classification, source linking, destination selection
- Importance auto-boost (critical/important tiers)
- 85% confidence auto-set for explicit captures
- Source context linking to spec folders or memories
- Correction subcommand (`correct <id> <type> [replacement-id]`)
- Undo subcommand
- History subcommand
- Stability penalties for corrections (0.5x-0.7x)
- Consolidation pipeline integration

**Subcommands:**
| Subcommand | Purpose |
|------------|---------|
| (default) | Capture learning |
| `correct <id> <type> [replacement-id]` | Mark correction |
| `undo <id>` | Reverse correction |
| `history` | View corrections |

#### Goodspec: Partial in `/goop-remember`

The `decision:` prefix in `/goop-remember` captures architectural decisions with reasoning, but there's no dedicated learning system.

**Gap Analysis:**
| Feature | Our System | Goodspec | Gap |
|---------|------------|----------|-----|
| Dedicated learning command | Yes | No | Our major advantage |
| Learning types | 5 types | N/A | Our advantage |
| Correction tracking | Yes (with penalties) | No | Our major advantage |
| Undo capability | Yes | No | Our advantage |
| Source linking | Yes | No | Our advantage |

---

## 4. Memory Operations Comparison

### 4.1 Save Operations

| Operation | Our System | Goodspec |
|-----------|------------|----------|
| Save context | `/memory:save <folder>` | `/goop-remember [content]` |
| Save decision | `/memory:learn` + type=decision | `/goop-remember decision: [content]` |
| Save note | `/memory:save` with content | `/goop-remember note: [content]` |
| Save todo | Not supported | `/goop-remember todo: [content]` |
| Auto-type detection | No (explicit classification) | Yes (content-based) |

### 4.2 Retrieval Operations

| Operation | Our System | Goodspec |
|-----------|------------|----------|
| Semantic search | `/memory:context [query]` | `/goop-recall [query]` |
| Intent-aware search | Yes (5 intents) | No |
| Recent memories | Via search | `/goop-recall recent` |
| Filter by type | Via anchors | `/goop-recall decisions` |
| Anchor retrieval | Yes (93% savings) | No |

### 4.3 Management Operations

| Operation | Our System | Goodspec |
|-----------|------------|----------|
| View stats | `/memory:manage` | `/goop-memory` |
| Detailed stats | `/memory:manage` (always detailed) | `/goop-memory stats` |
| Cleanup | `/memory:manage cleanup` | `/goop-memory clean` |
| Health check | `/memory:manage health` | Status via `/goop-memory` |
| Tier change | `/memory:manage tier <id> <tier>` | Not supported |
| Checkpoint | `/memory:manage checkpoint` | Not supported |

---

## 5. User Experience Analysis

### 5.1 Complexity Comparison

| Metric | Our System | Goodspec |
|--------|------------|----------|
| Total commands | 5 | 3 |
| Subcommands | ~20+ | ~7 |
| Mandatory phases | 2-4 per command | 0 |
| Required arguments | Spec folder required | Content inline |
| Learning curve | High | Low |

### 5.2 Interaction Patterns

**Our System:**
- User invokes command
- System checks arguments (blocks if missing)
- Multi-phase validation gates
- User may need to answer questions
- Execution occurs
- Structured JSON response

**Goodspec:**
- User invokes command with content inline
- System auto-detects type
- Immediate execution
- Simple confirmation response

### 5.3 UX Strengths

**Our System:**
- Rigorous validation prevents errors
- Intent-aware optimization improves relevance
- Checkpoint system enables safe experimentation
- Correction tracking improves accuracy over time
- Structured responses enable automation

**Goodspec:**
- Minimal friction for quick saves
- Content prefixes are intuitive (`decision:`, `note:`)
- Single-line invocation is fast
- Top concepts provides discoverability
- Simple output is easy to scan

---

## 6. Identified Gaps

### 6.1 Missing in Our System (from Goodspec)

| Gap | Goodspec Feature | Impact | Priority |
|-----|------------------|--------|----------|
| Content prefix shortcuts | `decision:`, `note:`, `todo:` | UX friction | Medium |
| Quick save mode | Single-line save without phases | Speed | High |
| Auto-fact extraction | Automatic knowledge atoms | Quality | Medium |
| Top concepts view | Popular tags/topics | Discoverability | Low |
| Recent activity summary | Last save/search times | Visibility | Low |
| Todo type | Durable tasks | Workflow | Low |

### 6.2 Our Advantages Over Goodspec

| Advantage | Our Feature | Impact |
|-----------|-------------|--------|
| Intent awareness | 5 intent types with weight optimization | High relevance |
| Anchor retrieval | 93% token savings | Efficiency |
| Checkpoint system | Backup/restore with rollback | Safety |
| Correction tracking | Stability penalties, undo | Accuracy |
| Session recovery | 3 scenarios, SQLite WAL | Reliability |
| Learning capture | 5 types with source linking | Knowledge base |
| Validation gates | Pre-flight, alignment checks | Quality |
| Tier management | 6 importance levels | Organization |

---

## 7. Recommendations

### 7.1 High Priority Improvements

1. **Add Quick Save Mode**
   - Allow `/memory:save "content"` for inline saves
   - Skip validation gates when content is provided inline
   - Auto-detect spec folder from conversation context

2. **Add Content Prefix Shortcuts**
   - Support `/memory:learn decision: [content]`
   - Support `/memory:learn note: [content]`
   - Support `/memory:learn pattern: [content]`

3. **Simplify Default Experience**
   - Make `/memory:context` work with zero arguments (prompt user)
   - Make `/memory:save` auto-detect folder more aggressively

### 7.2 Medium Priority Improvements

4. **Add Recent Activity View**
   - Show last save/search times in `/memory:manage`
   - Add "recent" shortcut to `/memory:context`

5. **Add Top Concepts View**
   - Extract and rank trigger phrases by frequency
   - Display in `/memory:manage stats`

6. **Auto-Fact Extraction**
   - Parse content for atomic knowledge pieces
   - Store as searchable facts

### 7.3 Low Priority Improvements

7. **Todo Type Support**
   - Add `todo` as learning type or separate command
   - Track completion status

8. **Observation Type**
   - Add `observation` as learning type
   - Distinguish from insights

---

## 8. Architecture Comparison

### 8.1 Storage Model

**Our System:**
- SQLite database with 5 tables
- Vector embeddings for semantic search
- Schema v9 with WAL for crash recovery
- Importance tiers (6 levels)
- Anchor tags for section retrieval
- Session state tracking

**Goodspec:**
- Persistent memory worker (port 37777)
- Memory types: decisions, observations, notes, session summaries
- Importance scores (1-10 numeric)
- Concepts/tags for grouping
- Facts (atomic knowledge)

### 8.2 MCP Integration

**Our System:**
- 15+ MCP tools (memory_save, memory_search, memory_update, etc.)
- Checkpoint tools (create, restore, list, delete)
- Health and validation tools
- Causal linking tools

**Goodspec:**
- `goop_status` - Worker status
- `memory_save` - Save memory
- `memory_search` - Search memories
- `memory_decision` - Log decision
- `memory_note` - Quick note

---

## 9. Conclusion

Our memory system is significantly more sophisticated than goodspec's, with advanced features like intent-aware retrieval, checkpoint management, and correction tracking. However, goodspec offers a simpler user experience with content prefixes and single-line saves.

**Key Takeaways:**

1. **Complexity vs Simplicity Tradeoff**: Our system prioritizes reliability and power; goodspec prioritizes ease of use.

2. **Quick Wins Available**: Adding content prefixes and quick save mode would significantly improve UX without sacrificing our advanced features.

3. **Our Unique Strengths**: Intent detection, anchor retrieval, checkpoint system, and correction tracking are major advantages that goodspec lacks.

4. **Missing Features**: Quick saves, content prefixes, and top concepts view would improve discoverability and speed.

---

## 10. Appendix: Command Reference Comparison

### A. Full Command Matrix

| Our Command | Arguments | Goodspec Equivalent | Notes |
|-------------|-----------|---------------------|-------|
| `/memory:context` | `<query> [--intent:<type>]` | `/goop-recall [query]` | We add intent detection |
| `/memory:continue` | `[:auto\|:manual]` | None | Unique to us |
| `/memory:learn` | `[description] \| correct \| undo \| history` | `/goop-remember decision:` (partial) | We have full learning system |
| `/memory:manage` | `[scan\|cleanup\|tier\|triggers\|validate\|delete\|health\|checkpoint]` | `/goop-memory [stats\|clean]` | We have 12 subcommands vs 3 |
| `/memory:save` | `<spec-folder>` | `/goop-remember [content]` | We require folder, they inline content |

### B. MCP Tool Comparison

| Category | Our Tools | Goodspec Tools |
|----------|-----------|----------------|
| Save | memory_save, memory_update | memory_save, memory_decision, memory_note |
| Search | memory_search, memory_match_triggers | memory_search |
| Manage | memory_list, memory_delete, memory_stats, memory_health, memory_validate | goop_status |
| Index | memory_index_scan | N/A |
| Checkpoint | checkpoint_create, checkpoint_restore, checkpoint_list, checkpoint_delete | N/A |
| Causal | memory_causal_link, memory_drift_why, memory_causal_stats | N/A |
| Session | task_preflight, task_postflight | N/A |

---

*Research compiled by Claude Opus 4.5 on 2026-02-04*
