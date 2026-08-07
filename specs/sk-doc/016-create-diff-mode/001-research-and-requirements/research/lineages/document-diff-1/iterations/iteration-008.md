# Iteration 8: OpenCode Skill Interface Design

## Focus
Design the OpenCode skill wrapper contract: CLI vs programmatic API, configuration surface, usage patterns for AI agents.

## Findings

### 1. Skill interface architecture
The portable core is a TypeScript library (`document-diff-core`). The OpenCode skill is a thin wrapper that:
- Exposes the core as slash commands within OpenCode
- Handles path resolution relative to the active workspace
- Manages snapshot storage within the workspace context
- Renders HTML reports to a user-facing location

### 2. CLI-first design (recommended)
The primary interface is CLI-based, suitable for both direct user use and AI agent invocation:

```
# Capture a snapshot
document-diff capture path/to/file.md

# Compare current version against last snapshot
document-diff compare path/to/file.md

# Compare two specific versions
document-diff compare --before path/to/v1.md --after path/to/v2.md

# Generate HTML report
document-diff compare path/to/file.md --output report.html

# List snapshots
document-diff list path/to/file.md

# Cleanup old snapshots
document-diff cleanup --older-than 7d
```

### 3. Programmatic API (library usage)
For AI agents and scripts that want direct programmatic access:
```typescript
import { capture, compare, listSnapshots, cleanup } from 'document-diff-core';

// Capture before-snapshot
const snapshot = await capture('path/to/file.md');

// Compare current vs snapshot
const result = await compare(snapshot.id, 'path/to/file.md');
console.log(result.summary); // { added: 15, removed: 8, modified: 5 }

// Generate HTML report
const html = result.toHtml({ outputFormat: 'side-by-side' });
```

### 4. OpenCode skill descriptor contract
The skill follows the `customize-opencode` skill authoring patterns:
```yaml
name: document-diff
description: Compare document versions with local AI snapshots
command: npx document-diff
commands:
  capture: "Capture a before-snapshot of a document"
  compare: "Generate a diff report between versions"
  list: "List stored snapshots"
  cleanup: "Remove expired snapshots"
allowed-tools: [Bash, Read, Write]
```

### 5. Configuration surface
```json
{
  "snapshotDir": "~/.document-snapshots",
  "snapshotTTLDays": 7,
  "maxFileSizeMB": 10,
  "defaultOutputFormat": "side-by-side",
  "colorScheme": "auto",
  "supportedFormats": {
    "text": { "enabled": true },
    "markdown": { "enabled": true },
    "html": { "enabled": true },
    "docx": { "enabled": true },
    "pdf": { "enabled": false, "message": "PDF comparison not supported in v1. Use an external converter first." }
  },
  "security": {
    "restrictToWorkspace": true,
    "followSymlinks": false,
    "sanitizeMammothOutput": true
  }
}
```

### 6. Integration with existing OpenCode patterns
- The skill follows the same two-axis hub pattern as `sk-code` (workflow modes + surface evidence)
- AI agents invoke `document-diff capture` before starting edits and `document-diff compare` after changes
- The HTML report is written to the workspace so the user can open it directly
- Snapshot storage is per-workspace by default, configurable to global

## Sources Consulted
- `.opencode/skills/customize-opencode` (skill authoring patterns)
- Prior iteration findings (architecture, security, format tiers)
- `.opencode/specs/.../001-research-and-requirements/spec.md` (skill wrapper requirement)

## Assessment
- **newInfoRatio**: 0.5 (CLI commands and programmatic API are concrete new designs; skill descriptor contract is new; configuration schema is new)
- **Novelty Justification**: Defined the concrete CLI surface with 5 commands; paired with programmatic API for agent use; aligned with OpenCode skill authoring conventions.

## Reflection
- **What Worked**: CLI-first design is simple and debuggable; programmatic API provides flexibility for agent integration.
- **What Failed**: N/A
- **Ruled Out**: GUI-only interface (violates AI agent integration requirement). REST API (violates local-only constraint).

## Recommended Next Focus
Cross-format comparison strategies: how to handle format-mismatched document pairs, fidelity scoring, and edge cases.
