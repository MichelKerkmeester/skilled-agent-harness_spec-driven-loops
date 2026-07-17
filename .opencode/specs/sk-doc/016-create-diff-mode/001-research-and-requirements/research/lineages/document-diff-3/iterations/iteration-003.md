# Iteration 3: Snapshot Lifecycle Design

## Focus
Q3: Define the snapshot lifecycle — automatic baseline capture, hashing, retention, cleanup, explicit-pair fallback.

## Findings

### F1: Deterministic Snapshot Lifecycle Contract
The v1 snapshot system must implement this state machine:
```
[BEFORE AI EDIT]
  1. Read source document
  2. Compute content hash (SHA-256) 
  3. Check for existing snapshot with same hash → skip if identical
  4. Atomic write to snapshot store: {hash}.snapshot.json
  5. Record snapshot metadata: {path, mtime, hash, format, timestamp}

[AFTER AI EDIT]  
  6. Read current document
  7. Compare hash against snapshot → hash mismatch triggers diff
  8. If no snapshot exists → error with "no baseline captured" message
  
[EXPLICIT PAIR FALLBACK]
  9. Accept two explicit file paths (before, after)
  10. Skip automatic capture; diff directly
```

### F2: Snapshot Storage and Retention
- **Storage location**: `~/.document-diff/snapshots/` (configurable via env or CLI flag)
- **Naming**: `{sha256-hex}.snapshot.json` — content-addressed, avoiding filename collisions
- **Retention policy**:  
  - Default TTL: 30 days from last access  
  - Maximum snapshots: 100 (LRU eviction)  
  - Explicit cleanup command: `doc-diff clean --older-than N`
- **Metadata file**: `snapshots.json` index tracking path→hash mappings for reverse lookup
- **Permissions**: 0600 on snapshot store (user read/write only)

### F3: Atomicity and Failure Modes
- Atomic writes using write-temp+rename pattern (Node.js `fs.rename` is atomic on same filesystem)
- Failed snapshot capture must NOT block the AI edit — log warning, allow explicit-pair fallback
- Corrupted snapshots detected via hash verification before diff
- Stale snapshots (mtime mismatch) trigger re-snapshot automatically

### F4: Security Considerations
- Source documents may contain sensitive content → snapshots must NOT leave the local machine
- Snapshot directory permissions must restrict access to current user only
- No telemetry, no cloud sync, no automatic sharing
- Snapshot index file should NOT log document content, only hashes

### F5: Concurrency Model
- Per-document locking via lockfile (`{hash}.lock`) prevents concurrent snapshot writes
- Lock timeout: 30 seconds (stale lock cleanup on startup)
- Read operations (diff) are lock-free; only writes acquire locks

## Sources Consulted
- Node.js fs documentation (atomic rename, file permissions)
- SHA-256 content addressing pattern (Git object model)
- Spec.md §4-6 requirements for local-only, deterministic snapshot lifecycle

## Assessment
- **newInfoRatio**: 0.85 — concrete lifecycle design with specific mechanisms
- **Novelty Justification**: Designed complete snapshot state machine, storage model, retention policy, and failure modes not present in prior research

## Reflection
### What Worked
- Content-addressed storage (like Git) elegantly solves naming, dedup, and integrity
- The explicit-pair fallback covers the case where automatic capture fails

### Ruled Out
- SQLite for snapshot storage (overkill for v1; flat files are simpler, more portable)
- In-memory snapshot cache (loses data on crash; disk-first is safer)

## Recommended Next Focus
Q4: HTML report design — inline/side-by-side views, XSS safety, navigation, fidelity warnings
