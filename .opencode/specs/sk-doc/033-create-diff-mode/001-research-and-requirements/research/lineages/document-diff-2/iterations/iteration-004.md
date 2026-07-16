# Iteration 4: Snapshot Lifecycle Design

## Focus

Design the automatic snapshot lifecycle: capture timing, identity, hashing, atomic writes, retention, cleanup, recovery, and explicit-pair fallback.

## Findings

### Finding 1: Snapshot Timing Model

Three viable capture points, each with tradeoffs:

| Model | Trigger | Advantage | Risk |
|-------|---------|-----------|------|
| **Pre-edit hook** | Before any file write | Guaranteed baseline exists | Requires workflow integration |
| **Filesystem watcher** | On file modification events | Automatic, no integration needed | Race conditions, debounce complexity |
| **Explicit command** | User or skill invokes `diff capture` | Simple, predictable | User must remember |

**Recommendation for v1**: Explicit command (`diff capture <file>`) with a convenience wrapper for AI edit workflows. The wrapper auto-captures before any edit by the skill.

### Finding 2: Snapshot Identity and Storage

Recommended identity and storage model:

```
~/.document-diff/snapshots/
  {hash-of-abs-path}/
    {iso8601-timestamp}-{content-hash}.snap
    metadata.json
```

Key properties:
- **Identity**: Hash of absolute file path (deterministic, avoids path traversal)
- **Content hash**: SHA-256 of file content (detects identical snapshots, enables dedup)
- **Timestamp**: ISO 8601 with timezone (sortable, human-readable)
- **Metadata**: Original path, format, size, mtime, extraction fidelity score
- **Location**: User configurable via env var (`DOCDIFF_SNAPSHOT_DIR`), default `~/.document-diff/snapshots/`

### Finding 3: Atomicity and Safety Guarantees

| Property | Implementation |
|----------|---------------|
| **Atomic write** | Write to temp file, fsync, rename (POSIX atomic) |
| **Never overwrite source** | Snapshots are copies, originals never touched |
| **Concurrent safety** | Per-file lock (flock/fcntl), path-hash namespacing |
| **Crash safety** | Temp files cleaned on startup; partial writes detectable (hash mismatch) |
| **Cross-platform** | Use OS-appropriate primitives; avoid symlinks in snapshot paths |

### Finding 4: Retention Policy

Default retention rules (all configurable):
- **Keep last N snapshots per file** (default: 10)
- **Keep snapshots younger than T days** (default: 30)
- **Never delete the only snapshot** for a given path
- **Explicit cleanup command**: `diff cleanup [--dry-run] [--older-than N]`
- **Auto-cleanup on capture**: remove oldest snapshots when per-file limit exceeded

### Finding 5: Failure Modes and Recovery

| Failure | Detection | Recovery |
|---------|-----------|----------|
| Source file missing | Path not found at capture time | Error with actionable message |
| Source file unreadable | Permission error | Report, skip, do not create empty snapshot |
| Snapshot dir full | Write failure | Report disk space, suggest cleanup |
| Snapshot hash mismatch | Verify on read | Report corruption, suggest re-capture |
| Concurrent capture | Lock contention | Queue or fail-fast with message |
| Interrupted capture | Detect partial/incomplete snapshot | Clean on next startup (no .lock or temp files) |

### Finding 6: Explicit-Pair Fallback

For ad-hoc comparisons without automatic snapshots:
```
diff compare --before <file1> --after <file2> [--format html]
```
This bypasses the snapshot system entirely, using two explicit paths. Useful for:
- Comparing exported versions
- Integration with external workflows
- Testing and debugging

## Assessment

**newInfoRatio**: 0.7 — Snapshot lifecycle design is a novel synthesis within this packet, building on well-known filesystem safety patterns.

## Recommended Next Focus

HTML report architecture — design the self-contained, accessible, secure report contract.
