# Troubleshooting Reference - Issue Resolution Guide

> Systematic diagnosis and resolution for semantic memory issues, context retrieval failures, and MCP tool problems.

---

## 1. 📖 OVERVIEW

**Core Principle:** Systematic diagnosis before fixes. Never guess at solutions.

This reference provides structured troubleshooting for the semantic memory system v12.0.0, covering:

- **Context retrieval failures** - Memory search returning no/wrong results
- **Vector index issues** - Embedding generation and search problems
- **MCP tool connection problems** - Server connectivity and timeout issues
- **Decay calculation issues** - Recency scoring anomalies
- **Hybrid search fallback scenarios** - When FTS5 or vector search fails

### Diagnosis Decision Tree

```
Issue Detected
     │
     ├─→ "No results" ─────────────────→ See §3 COMMON ERRORS
     │         │
     │         ├─→ Vector search empty? ─→ Check index: memory_stats()
     │         └─→ FTS5 search empty? ───→ Check content indexing
     │
     ├─→ "Wrong results" ──────────────→ See §4 DEBUGGING
     │         │
     │         ├─→ Low relevance? ───────→ Check decay settings
     │         └─→ Stale content? ───────→ Verify tier/importance
     │
     ├─→ "Tool timeout" ───────────────→ See §3 MCP Connection Issues
     │
     └─→ "Permission denied" ──────────→ See §3 File System Issues
```

---

## 2. 🎯 QUICK FIXES

| Issue | Symptom | Solution |
|-------|---------|----------|
| Missing spec folder | `Folder not found` | `mkdir -p specs/###-feature/memory/` |
| Vector search empty | No results from `memory_search()` | Run `memory_stats()` to check index health |
| MCP server not responding | Tool timeout errors | Restart MCP server, check `.mcp.json` config |
| Wrong script path | `File not found` | Use `.opencode/skill/system-memory/` |
| Arg format error | Invalid parameter | Use full folder name: `122-skill-standardization` |
| Decay not applying | Old memories ranked high | Check `useDecay: true` in search params |
| Constitutional not surfacing | Critical memories missing | Verify tier is `constitutional` via `memory_list()` |

### Before/After: Common Mistakes

❌ **Wrong approach:**
```javascript
// Guessing at folder names
memory_search({ query: "auth", specFolder: "122" })
```

✅ **Correct approach:**
```javascript
// Use full spec folder identifier
memory_search({ query: "auth", specFolder: "122-skill-standardization" })
```

❌ **Wrong approach:**
```javascript
// Calling through Code Mode (loses native efficiency)
call_tool_chain(`semantic_memory.memory_search({ query: "test" })`)
```

✅ **Correct approach:**
```javascript
// Direct MCP call (native, faster)
memory_search({ query: "test" })
```

---

## 3. ⚠️ COMMON ERRORS

### Vector Index Issues

| Error | Root Cause | Resolution |
|-------|------------|------------|
| `Vector search returned 0 results` | Index empty or corrupted | Run `memory_stats()` to verify index size; restart MCP server |
| `Embedding generation failed` | Model unavailable or rate limited | Wait 60s and retry; check API key validity |
| `Index out of sync` | New memories not indexed | Force re-index via server restart |
| `Dimension mismatch` | Mixed embedding models | Clear index, regenerate with single model |

### MCP Tool Connection Problems

| Error | Root Cause | Resolution |
|-------|------------|------------|
| `Tool timeout after 30s` | Server overloaded or hung | Restart MCP server; reduce concurrent calls |
| `Connection refused` | Server not running | Start server: check `.mcp.json` configuration |
| `Invalid tool name` | Wrong call syntax | Use native MCP syntax: `memory_search()`, `memory_load()`, etc. |
| `Authentication failed` | Invalid or expired credentials | Refresh API keys in environment |

**Connection Recovery Protocol:**

1. Check server status: `ps aux | grep semantic-memory`
2. Verify config: `cat .mcp.json | jq '.mcpServers["semantic-memory"]'`
3. Test basic call: `memory_stats()`
4. If still failing: restart server and wait 10s

### Context Retrieval Issues

| Issue | Symptom | Solution |
|-------|---------|----------|
| **Anchor not found** | `Anchor not found: X` | Use `memory_search()` to find available anchors |
| **Memory folder empty** | `No previous sessions found` | Save context first via skill workflow |
| **Wrong memory loaded** | Context from different session | Check `specFolder` parameter matches intent |
| **Legacy file detected** | `Legacy format detected` | Re-save to generate current anchors |
| **Token budget exceeded** | `Token budget exceeded: N tokens` | Use `limit` parameter or filter by tier |
| **No results from search** | `No memories found matching: query` | Broaden query; check `memory_list()` for content |

### Decay Calculation Issues

| Issue | Root Cause | Resolution |
|-------|------------|------------|
| Old memories ranked too high | Decay not enabled | Set `useDecay: true` in search params |
| Recent memories not prioritized | Half-life too long | Default is 90 days; adjust if needed |
| Score calculations seem wrong | Missing timestamp | Verify `created_at` field populated |
| Decay too aggressive | Half-life too short | 90-day default is recommended |

**Decay Formula Reference:**
```
decayed_score = base_score × (0.5 ^ (days_old / 90))

Example: 60-day-old memory with base score 0.85
→ 0.85 × (0.5 ^ (60/90)) = 0.85 × 0.63 = 0.54
```

### Hybrid Search Fallback Scenarios

| Scenario | Primary Search | Fallback | Trigger |
|----------|----------------|----------|---------|
| Short query (<3 words) | Vector | FTS5 | Low vector confidence |
| Exact phrase needed | FTS5 | Vector | User quotes query |
| No vector results | Vector | FTS5 | 0 results from embeddings |
| API rate limited | Vector | FTS5 | Embedding API error |

### File System Issues

| Error | Root Cause | Resolution |
|-------|------------|------------|
| `Permission denied` | Folder not writable | `chmod -R u+w specs/###-*/` |
| `ENOENT: no such file` | Path doesn't exist | Create directory structure first |
| `EACCES` | User lacks permissions | Check ownership: `ls -la` |
| `Disk full` | No space for index | Clear old data or expand storage |

---

## 4. 🔧 DEBUGGING

### Debugging Commands

```bash
# Check if memory file has anchors (UPPERCASE format)
grep -c "<!-- ANCHOR:" specs/049-*/memory/*.md

# List all available anchor IDs in a file
grep -o 'ANCHOR:[a-z0-9-]*' specs/049-*/memory/*.md | sed 's/ANCHOR://' | sort -u

# Find all memory files with anchors across project
find specs -name "*.md" -path "*/memory/*" -exec grep -l "<!-- ANCHOR:" {} \;

# Check memory system statistics (via MCP)
# Use: memory_stats() - shows counts, dates, tier breakdown

# Verify index health
# Use: memory_list({ limit: 5 }) - quick check for recent entries

# Test search functionality
# Use: memory_search({ query: "test", limit: 3 })
```

### File Format Detection

```bash
# Check file version (UPPERCASE anchor format)
grep -q "<!-- ANCHOR:" file.md && echo "Current (supports anchors)" || echo "Legacy (full read only)"

# Count files by format in spec folder
current_count=$(find specs/049-*/memory -name "*.md" -exec grep -l "<!-- ANCHOR:" {} \; | wc -l)
total_count=$(find specs/049-*/memory -name "*.md" | wc -l)
echo "Current: $current_count | Legacy: $((total_count - current_count))"
```

### Systematic Debugging Workflow

**Step 1: Gather Information**
```javascript
// Check system health
memory_stats()

// List recent memories
memory_list({ limit: 10, sortBy: "created_at" })

// Test basic search
memory_search({ query: "recent work", limit: 5 })
```

**Step 2: Isolate the Problem**

❌ **Wrong approach:**
```
"Search isn't working" → Immediately restart server
```

✅ **Correct approach:**
```
"Search isn't working" → Check stats → Test search → Verify content exists → Then diagnose
```

**Step 3: Verify Fix**
```javascript
// After any fix, verify with these checks:
memory_stats()  // Index counts should be non-zero
memory_search({ query: "test" })  // Should return results
memory_list({ limit: 3 })  // Should show recent entries
```

### Root Cause Analysis Patterns

| Symptom | Check First | Check Second | Likely Cause |
|---------|-------------|--------------|--------------|
| All searches empty | `memory_stats()` | `memory_list()` | Empty index |
| Some searches empty | Query specificity | Tier filtering | Query too narrow |
| Wrong results returned | Decay settings | Importance tiers | Ranking misconfigured |
| Slow responses | Server load | Index size | Performance bottleneck |
| Intermittent failures | Connection status | Rate limits | External service issue |

---

## 5. 📋 ESCALATION

### When to Escalate

**Escalate immediately if:**
- Vector embedding generation fails repeatedly (>3 attempts)
- MCP server crashes on startup
- Data corruption suspected (inconsistent counts)
- Authentication/permission issues persist after standard fixes

### Escalation Checklist

Before escalating, gather:

```markdown
□ Error message (exact text)
□ memory_stats() output
□ Steps to reproduce
□ Recent changes to config
□ Server logs (if available)
```

### Escalation Path

| Severity | Condition | Action |
|----------|-----------|--------|
| **Critical** | Data loss suspected | Stop operations, backup immediately |
| **High** | System unusable | Restart services, check logs |
| **Medium** | Feature degraded | Document issue, apply workaround |
| **Low** | Minor inconvenience | Log for later fix |

### Common Workflow Issues

**"I can't find a specific decision I know we made"**

✅ Solution: Use cross-folder search
```javascript
memory_search({ 
  query: "auth decision",
  limit: 10
  // Note: omit specFolder to search all folders
})
```

**"Smart search returns nothing but I know the content exists"**

Root Cause: Content not indexed or uses legacy format

✅ Solution:
1. Check if memory exists: `memory_list({ specFolder: "###-name" })`
2. If exists but not searchable: re-save to generate embeddings
3. Use `memory_load()` for direct access to known content

**"Context loaded from wrong spec folder"**

Root Cause: Incorrect specFolder parameter

✅ Solution:
```javascript
// Verify active context
memory_list({ specFolder: "###-correct-folder", limit: 3 })

// Load from specific folder
memory_load({ specFolder: "###-correct-folder" })
```

**"Constitutional memories not appearing"**

Root Cause: Tier not set correctly

✅ Solution:
```javascript
// Check memory tier
memory_list({ tier: "constitutional" })

// Update tier if needed
memory_update({ id: 123, importanceTier: "constitutional" })
```

---

## 6. 🔄 RECOVERY PROCEDURES

### Index Recovery

If vector index is corrupted or empty:

1. **Backup current state**: `memory_stats()` output
2. **Restart MCP server**: Triggers re-initialization
3. **Verify recovery**: `memory_stats()` should show counts
4. **Re-index if needed**: Save new memory to trigger indexing

### Data Recovery

If memories are missing:

1. Check file system: `find specs -path "*/memory/*.md"`
2. Check database directly if accessible
3. Restore from checkpoint: `checkpoint_list()` → `checkpoint_restore()`

### Configuration Recovery

If settings are wrong:

1. Check `.mcp.json` for server config
2. Verify environment variables
3. Reset to defaults if needed

---

## 7. 🔗 RELATED RESOURCES

### Reference Files
- [semantic_memory.md](./semantic_memory.md) - MCP tools, hybrid search, and importance tier system
- [execution_methods.md](./execution_methods.md) - Memory file detection and execution trigger patterns
- [spec_folder_detection.md](./spec_folder_detection.md) - Routing logic and alignment scoring

### Related Skills
- `system-spec-kit` - Spec folder creation and template management
- `mcp-leann` - Semantic code search using vector embeddings
