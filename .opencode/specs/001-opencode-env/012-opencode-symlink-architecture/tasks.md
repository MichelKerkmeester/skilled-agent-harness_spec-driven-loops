# Tasks: Symlink `.opencode/` to Public Release

## Task List

- [ ] **T1**: Add `SPEC_KIT_DB_DIR` env var support to `config.js` (Public repo)
- [ ] **T2**: Create `.opencode-local/database/` directory
- [ ] **T3**: Migrate database files to `.opencode-local/database/`
- [ ] **T4**: Update `opencode.json` with `SPEC_KIT_DB_DIR` env var
- [ ] **T5**: Move specs from `.opencode/specs/` to project root `specs/`
- [ ] **T6**: Handle `code_database` and `code_index` symlinks
- [ ] **T7**: Backup `.opencode/` and replace with symlink to Public
- [ ] **T8**: Update AGENTS.md (PUBLIC RELEASE section + spec paths)
- [ ] **T9**: Update AGENTS.md (PUBLIC RELEASE section + spec paths)
- [ ] **T10**: Rewrite PUBLIC_RELEASE.md (reversed source-of-truth)
- [ ] **T11**: Update .gitignore (`.opencode` symlink, `specs/`, `.opencode-local/`)
- [ ] **T12**: Verify MCP servers boot correctly
- [ ] **T13**: Verify skill_advisor.py path resolution
- [ ] **T14**: Verify memory search/save with new database location
- [ ] **T15**: Verify skill loading through symlink
