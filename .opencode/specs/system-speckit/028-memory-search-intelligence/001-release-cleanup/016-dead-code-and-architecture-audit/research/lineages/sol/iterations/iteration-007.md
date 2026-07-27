# Iteration 007: Root config and database placement

## Focus

Audit root runtime configuration, symlinked config mirrors, and database locations for split authority or misplaced state.

## Findings

1. Two distinct live skill-advisor database sets exist under canonical `mcp-server/database/` and untracked underscore-form `mcp_server/database/`. The canonical launcher state file records the underscore database even though current OpenCode and Codex configs point to the hyphenated path. Different inodes, sizes, and recently updated lease databases make this a CAT-4/CAT-5 split-state risk; the alternate writer is UNKNOWN. [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/database/.mk-skill-advisor-launcher.json:7] [SOURCE: file:.opencode/skills/system-skill-advisor/mcp-server/database/.mk-skill-advisor-launcher.json:8] [SOURCE: file:opencode.json:55] [SOURCE: file:.codex/config.toml:24]
2. Root `.mcp.json`, `.cursor/mcp.json`, and `.claude/.utcp_config.json` are symlink mirrors, not independent stale copies, so they are ruled out.

## Sources Consulted

- `opencode.json:47-66`
- `.codex/config.toml:18-29`
- `.opencode/skills/system-skill-advisor/mcp-server/database/.mk-skill-advisor-launcher.json`
- `ls -li` across both skill-advisor database directories.

## Assessment

- New information ratio: 0.83
- Confidence: high that split state exists; cause and authoritative database contents remain unknown.

## Reflection

This is the highest operational-risk finding because both locations contain independent SQLite state, not symlink aliases.

## Recommended Next Focus

Search for backup, log-rotation, scratch, generated-scan, and ignored-file residue outside specs.
