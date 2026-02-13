---
name: goop-memory
description: View memory system status and statistics
---

View the status and statistics of the persistent memory system.

## Usage

`/goop-memory` - Show memory system status
`/goop-memory stats` - Show detailed statistics
`/goop-memory clean` - Clean up old/low-importance memories

## Instructions

When this command is invoked:

1. Check if memory system is running:
   - Use `goop_status` to verify memory worker is active
   - Report if memory is disabled

2. Show memory statistics:
   - Total memories stored
   - Breakdown by type (decisions, observations, notes, etc.)
   - Recent activity summary
   - Storage usage

3. If "stats" argument:
   - Show detailed breakdown by type
   - Show top concepts/tags
   - Show importance distribution
   - Show oldest and newest memories

4. If "clean" argument:
   - List memories that could be cleaned (old + low importance)
   - Ask for confirmation before deleting
   - Report what was cleaned

## Example Output

```
## Memory System Status

Status: Running (worker on port 37777)

### Statistics
- Total Memories: 127
- Decisions: 23
- Observations: 65
- Notes: 31
- Session Summaries: 8

### Recent Activity
- Last save: 5 minutes ago
- Last search: 2 minutes ago
- Memories today: 7

### Top Concepts
1. architecture (15 memories)
2. typescript (12 memories)
3. testing (9 memories)
4. security (7 memories)
5. performance (5 memories)
```

Provide visibility into the memory system's state.
