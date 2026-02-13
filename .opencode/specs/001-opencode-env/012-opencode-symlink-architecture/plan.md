# Plan: Symlink `.opencode/` to Public Release

## Approach: Full Symlink + Env Var for Database

### Step 1: Add database path env var support
Modify `config.js:17` to check `SPEC_KIT_DB_DIR` env var before falling back to `__dirname`-based path.

### Step 2: Create project-local database directory
Create `.opencode-local/database/` and migrate existing database files.

### Step 3: Update opencode.json
Add `SPEC_KIT_DB_DIR` to the `spec_kit_memory` environment block.

### Step 4: Move project-specific items out of `.opencode/`
- Move `specs/` from `.opencode/specs/` to project root
- Handle `code_database` and `code_index` symlinks

### Step 5: Replace `.opencode/` with symlink
Backup `.opencode/`, create symlink to Public.

### Step 6: Update documentation
- AGENTS.md, AGENTS.md: Reversed source-of-truth, updated paths
- PUBLIC_RELEASE.md: Complete rewrite
- .gitignore: Verify tracking rules

### Step 7: Verify
Test MCP servers, skill_advisor.py, memory operations, skill loading.

## Final Directory Layout
```
anobel.com/
  .opencode -> /path/to/Public/.opencode   (SYMLINK)
  .opencode-local/                          (REAL - project-specific)
    database/
  specs/                                    (REAL - project-specific)
    000-opencode-env/
    005-anobel.com/
    ...
  opencode.json
  AGENTS.md
```
