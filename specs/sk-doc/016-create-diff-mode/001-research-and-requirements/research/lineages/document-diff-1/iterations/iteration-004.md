# Iteration 4: Snapshot Lifecycle Design

## Focus
Design the snapshot lifecycle: automatic capture, storage strategy, hash-based change detection, and cleanup for local AI document diff.

## Findings

### 1. Snapshot lifecycle model for local document diff
The lifecycle follows a four-phase model:
1. **Detect**: AI agent signals intent to edit a file (or edits and saves it). The tool captures a "before" snapshot.
2. **Capture**: Store the snapshot with metadata (timestamp, file path, content hash, format type).
3. **Compare**: After AI edit, capture "after" state and compute diff against stored snapshot.
4. **Cleanup**: Expire old snapshots; retain only relevant comparison pairs.

### 2. Storage strategy options
| Strategy | Pros | Cons | Recommendation |
|----------|------|------|----------------|
| **Filesystem (.snapshots/ dir)** | Simple, no dependencies, human-inspectable | Disk I/O, no built-in querying | **Recommended for v1** |
| **SQLite (better-sqlite3)** | Queryable, compact, transactional | Extra dependency, binary format | v2 consideration |
| **In-memory only** | Zero disk footprint | Lost on process restart | Unusable for persistent snapshots |

**Recommended v1 strategy**: A `.document-snapshots/` directory in the user's home or project root, organized by `{filePathHash}/{timestamp}.snap`. Content stored as plain text copies. Metadata stored as a JSON sidecar file per snapshot. This is transparent, debuggable, and requires zero database dependencies.

### 3. Hash-based change detection
- Use SHA-256 of file content to detect actual changes vs. timestamp-only changes
- On snapshot capture, compute and store content hash
- On comparison request, compute current hash; if unchanged, skip diff (no change detected)
- Store hash in snapshot metadata to enable fast deduplication

### 4. Automatic snapshot triggers
- **File watcher approach** (chokidar, 188M weekly downloads, MIT): Watch target directories for file changes. On `change` event with `awaitWriteFinish: true` (handles chunked writes), capture snapshot. chokidar v5 is ESM-only, node >=20, 1 dependency.
- **Explicit API approach**: expose `capture(path)` and `compare(path)` methods that AI agents call directly. More predictable, avoids polling overhead.
- **Hybrid (recommended)**: Primary mode is explicit API (capture before edit, compare after). Optional watcher mode for monitoring directories continuously.
[SOURCE: https://www.npmjs.com/package/chokidar]

### 5. Snapshot retention and cleanup
- **Pair-based retention**: Keep snapshot pairs (before + after) for the last N comparisons per file (default: 10)
- **TTL-based expiration**: Snapshots older than configurable TTL (default: 7 days) are eligible for cleanup
- **Manual cleanup**: `diff-tool cleanup --older-than 7d` command
- **Auto-cleanup**: Run at most once per session, clean expired snapshots on next capture
- **Pair matching**: If only "before" exists without "after", warn user and offer to discard orphaned snapshot

## Sources Consulted
- https://www.npmjs.com/package/chokidar (file watching)
- Prior iteration findings (format adapters, diff pipeline)
- `.opencode/specs/.../001-research-and-requirements/spec.md` (local-first requirement)

## Assessment
- **newInfoRatio**: 0.7 (Snapshot lifecycle is a new architectural dimension; chokidar evaluation is new; storage strategy comparison is new)
- **Novelty Justification**: Established the four-phase lifecycle model; selected filesystem-based storage as simplest v1 approach; designed explicit API + optional watcher hybrid trigger model.

## Reflection
- **What Worked**: Filesystem-based snapshots align with local-first constraint and transparency goal.
- **What Failed**: Pure watcher approach has edge cases (atomic writes, rapid successive saves).
- **Ruled Out**: SQLite storage for v1 (unnecessary dependency). In-memory-only storage (not persistent).

## Recommended Next Focus
Design the HTML report format: fidelity indicators, change severity classification, risk scoring, and embeddable structure.
