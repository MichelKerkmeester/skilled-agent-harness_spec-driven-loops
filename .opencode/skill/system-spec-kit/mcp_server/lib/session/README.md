# Session Layer

> Session management for the Spec Kit Memory MCP server - handles session deduplication, crash recovery, channel routing, and context persistence.

---

## TABLE OF CONTENTS

- [1. 📖 OVERVIEW](#1--overview)
- [2. 📁 STRUCTURE](#2--structure)
- [3. ⚡ FEATURES](#3--features)
- [4. 💡 USAGE EXAMPLES](#4--usage-examples)
- [5. 🛠️ TROUBLESHOOTING](#5--troubleshooting)
- [6. 🔗 RELATED RESOURCES](#6--related-resources)

---

## 1. 📖 OVERVIEW

The session layer provides all session-related operations for the Spec Kit Memory MCP server. It prevents duplicate context injection (saving ~50% tokens on follow-up queries), enables crash recovery with immediate SQLite persistence, and routes memories by git branch channel.

### Key Statistics

| Category | Count | Details |
|----------|-------|---------|
| Modules | 3 | Session management, channel routing, index |
| Token Savings | ~50% | On follow-up queries via deduplication |
| Session TTL | 30 min | Configurable via `SESSION_TTL_MINUTES` |
| Max Entries | 100 | Per session cap (R7 mitigation) |

### Key Features

| Feature | Description |
|---------|-------------|
| **Session Deduplication** | Tracks sent memories to prevent duplicate context injection |
| **Crash Recovery** | Immediate SQLite persistence + CONTINUE_SESSION.md generation |
| **Channel Routing** | Automatic context switching based on git branches |
| **Token Savings** | ~50% reduction on follow-up queries |
| **State Persistence** | Zero data loss on crash via immediate saves |

---

## 2. 📁 STRUCTURE

```
session/
├── index.js            # Module aggregator - exports all session functions
├── session-manager.js  # Session deduplication and crash recovery (~35KB)
├── channel.js          # Git branch-based channel routing
└── README.md           # This file
```

### Key Files

| File | Purpose |
|------|---------|
| `session-manager.js` | Core session tracking, deduplication, state persistence, CONTINUE_SESSION.md |
| `channel.js` | Derives channel from git branch, scopes memory queries by channel |
| `index.js` | Aggregates and re-exports all session module functions |

---

## 3. ⚡ FEATURES

### Session Deduplication (v1.2.0)

**Purpose**: Prevent sending the same memory content twice in a session, saving tokens.

| Aspect | Details |
|--------|---------|
| **Hash-based** | SHA-256 hash of memory content (truncated to 16 chars) |
| **Immediate Save** | SQLite persistence on each mark (crash resilient) |
| **Batch Support** | Efficient batch checking and marking |
| **Token Savings** | ~200 tokens per duplicate avoided |

```
Session Query Flow:
1. User queries memory_search
2. Results retrieved from index
3. filterSearchResults() removes already-sent memories
4. Filtered results returned to client
5. markResultsSent() records what was sent
```

### Crash Recovery (v1.2.0)

**Purpose**: Zero data loss on MCP server crash or context compaction.

| Aspect | Details |
|--------|---------|
| **Immediate Persistence** | State saved to SQLite instantly (seu-claude pattern) |
| **Interrupted Detection** | On startup, active sessions marked as interrupted |
| **State Recovery** | `recoverState()` returns state with `_recovered: true` flag |
| **CONTINUE_SESSION.md** | Human-readable recovery file in spec folder |

Session states:
- `active` - Session in progress
- `completed` - Session ended normally
- `interrupted` - Session crashed (detected on restart)

### Channel Routing

**Purpose**: Automatic context switching based on git branches.

| Aspect | Details |
|--------|---------|
| **Normalization** | Branch name: lowercase, special chars to hyphens, max 50 chars |
| **Caching** | 5-second TTL cache to avoid repeated execSync calls |
| **Default Channel** | Falls back to 'default' when not in git repo |
| **Include Default** | Branch queries also include 'default' channel memories |

### CONTINUE_SESSION.md Generation

**Purpose**: Human-readable recovery file for seamless session continuation.

Generated on checkpoint with:
- Session ID and status
- Spec folder and current task
- Last action and context summary
- Pending work description
- Quick resume command

---

## 4. 💡 USAGE EXAMPLES

### Example 1: Filter Search Results (Primary Integration)

```javascript
const { filterSearchResults, markResultsSent } = require('./session');

// After retrieving search results
const { filtered, dedupStats } = filterSearchResults(sessionId, results);

console.log(`Filtered ${dedupStats.filtered} duplicates`);
console.log(`Token savings: ${dedupStats.tokenSavingsEstimate}`);

// Return filtered results to client, then mark as sent
markResultsSent(sessionId, filtered);
```

### Example 2: Crash Recovery on Startup

```javascript
const { init, resetInterruptedSessions, getInterruptedSessions } = require('./session');

// Initialize session manager
init(database);

// Mark any active sessions as interrupted
const { interruptedCount } = resetInterruptedSessions();
console.log(`Found ${interruptedCount} interrupted sessions`);

// Get details for recovery UI
const { sessions } = getInterruptedSessions();
sessions.forEach(s => {
  console.log(`Session ${s.sessionId}: ${s.lastAction} in ${s.specFolder}`);
});
```

### Example 3: Save Session State with Checkpoint

```javascript
const { checkpointSession, saveSessionState } = require('./session');

// Save state immediately (minimal)
saveSessionState(sessionId, {
  specFolder: 'specs/005-feature',
  currentTask: 'T071',
  lastAction: 'Implemented causal edges',
  contextSummary: 'Working on memory relationships...',
  pendingWork: 'Need to add traversal depth limit'
});

// Full checkpoint with CONTINUE_SESSION.md
checkpointSession(sessionId, {
  specFolder: 'specs/005-feature',
  currentTask: 'T072',
  contextSummary: 'Session checkpoint before break'
}, '/absolute/path/to/specs/005-feature');
```

### Example 4: Channel-Scoped Memory Queries

```javascript
const { derive_channel_from_git_branch, get_channel_memories } = require('./session');

// Get current channel
const channel = derive_channel_from_git_branch();
console.log(`Current channel: ${channel}`);

// Get memories for this channel (includes 'default' channel)
const memories = get_channel_memories(db, {
  include_default: true,
  limit: 50
});
```

### Common Patterns

| Pattern | Code | When to Use |
|---------|------|-------------|
| Check if should send | `shouldSendMemory(sessionId, memory)` | Before returning single memory |
| Batch check | `shouldSendMemoriesBatch(sessionId, memories)` | Before returning multiple memories |
| Clear session | `clearSession(sessionId)` | On explicit session end |
| Get session stats | `getSessionStats(sessionId)` | For debugging/logging |
| Recover state | `recoverState(sessionId)` | On session resume |

---

## 5. 🛠️ TROUBLESHOOTING

### Common Issues

#### Memories Being Filtered When They Shouldn't Be

**Symptom**: Expected memories not returned in search results.

**Cause**: Memories already marked as sent in this session.

**Solution**:
```javascript
// Check session stats
const stats = getSessionStats(sessionId);
console.log(`Total sent: ${stats.totalSent}`);

// Clear session to reset
clearSession(sessionId);
```

#### Session State Not Persisting

**Symptom**: Session state lost between queries.

**Cause**: Database not initialized or session ID changing.

**Solution**:
```javascript
// Verify initialization
const db = getDb();
if (!db) {
  console.error('Session manager not initialized');
}

// Ensure consistent session ID
console.log(`Using session: ${sessionId}`);
```

#### Channel Not Detecting Git Branch

**Symptom**: All queries use 'default' channel.

**Cause**: Not in git repository or git command failing.

**Solution**:
```javascript
const { is_git_repo, get_raw_git_branch, clear_cache } = require('./session');

if (!is_git_repo()) {
  console.log('Not in git repo - using default channel');
}

// Clear cache if branch changed
clear_cache();
const branch = get_raw_git_branch();
console.log(`Raw branch: ${branch}`);
```

### Quick Fixes

| Problem | Quick Fix |
|---------|-----------|
| Stale branch cache | `clear_cache()` |
| Session dedup disabled | Check `DISABLE_SESSION_DEDUP` env var |
| TTL too short/long | Set `SESSION_TTL_MINUTES` env var |
| Max entries reached | Oldest entries auto-pruned (FIFO) |

### Diagnostic Commands

```javascript
// Check if deduplication enabled
const { isEnabled, getConfig } = require('./session');
console.log('Enabled:', isEnabled());
console.log('Config:', getConfig());

// Check session stats
const { getSessionStats } = require('./session');
console.log(getSessionStats(sessionId));

// Check for interrupted sessions
const { getInterruptedSessions } = require('./session');
console.log(getInterruptedSessions());

// Check channel state
const { derive_channel_from_git_branch } = require('./session');
console.log('Current channel:', derive_channel_from_git_branch());
```

### Configuration

| Environment Variable | Default | Description |
|---------------------|---------|-------------|
| `SESSION_TTL_MINUTES` | 30 | Session timeout in minutes |
| `SESSION_MAX_ENTRIES` | 100 | Maximum entries per session |
| `DISABLE_SESSION_DEDUP` | false | Set 'true' to disable deduplication |

---

## 6. 🔗 RELATED RESOURCES

### Internal Documentation

| Document | Purpose |
|----------|---------|
| [../README.md](../README.md) | Parent lib directory overview |
| [../storage/README.md](../storage/README.md) | Storage layer for persistence |
| [../cognitive/README.md](../cognitive/README.md) | Cognitive processing modules |

### Related Modules

| Module | Purpose |
|--------|---------|
| `context-server.js` | MCP server that uses session layer |
| `storage/checkpoints.js` | Checkpoint creation uses session state |
| `handlers/memory-search.js` | Primary consumer of session filtering |

### Design Patterns

| Pattern | Source | Usage |
|---------|--------|-------|
| seu-claude | External | Immediate SQLite persistence for crash recovery |
| CONTINUE_SESSION.md | seu-claude | Human-readable recovery file |

---

*Documentation version: 1.0 | Last updated: 2026-02-02 | Session layer v1.2.0*
