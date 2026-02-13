# Spec: Symlink `.opencode/` to Public Release

## Overview
Replace the `.opencode/` directory in anobel.com with a symlink to the Public Release repo, making the Public repo the single source of truth for the OpenCode framework.

## Problem
The current workflow requires manual `cp -r` sync from anobel.com to Public. This is error-prone and creates drift between the two copies.

## Solution
- Full symlink: `.opencode -> /path/to/Public/.opencode`
- Environment variable `SPEC_KIT_DB_DIR` to override database path (avoids Node.js `__dirname` resolving through symlinks)
- Project-specific items (`specs/`, database) moved out of `.opencode/`

## Scope

### In Scope
- Add `SPEC_KIT_DB_DIR` env var support to `config.js`
- Create `.opencode-local/database/` for project-local database
- Update `opencode.json` with `SPEC_KIT_DB_DIR`
- Move specs from `.opencode/specs/` to project root `specs/`
- Replace `.opencode/` with symlink
- Update AGENTS.md, AGENTS.md, PUBLIC_RELEASE.md, .gitignore

### Out of Scope
- Changes to any skill logic
- Changes to MCP server code beyond config.js
- Other projects (kerkmeester.com, etc.)

## Files Modified
1. `Public/.opencode/skill/system-spec-kit/mcp_server/core/config.js` - env var support
2. `anobel.com/opencode.json` - add SPEC_KIT_DB_DIR
3. `anobel.com/AGENTS.md` - update PUBLIC RELEASE section + paths
4. `anobel.com/AGENTS.md` - same updates as AGENTS.md
5. `anobel.com/PUBLIC_RELEASE.md` - rewrite for reversed source-of-truth
6. `anobel.com/.gitignore` - ensure .opencode symlink ignored, specs/ tracked

## Risk Assessment
| Risk | Mitigation |
|------|-----------|
| Database writes to wrong location | `SPEC_KIT_DB_DIR` env var |
| `skill_advisor.py` path resolution | Python `os.path.abspath()` doesn't resolve symlinks |
| `code_mode` MCP server | Uses ESM `import.meta.url` which doesn't resolve symlinks |
| Git tracking confusion | `.gitignore` updated appropriately |
