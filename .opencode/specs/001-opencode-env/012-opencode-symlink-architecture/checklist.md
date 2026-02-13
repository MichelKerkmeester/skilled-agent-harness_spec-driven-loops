# Checklist: Symlink `.opencode/` to Public Release

## P0 - HARD BLOCKERS

- [ ] `config.js` supports `SPEC_KIT_DB_DIR` env var with backward-compatible fallback
- [ ] Database files migrated to `.opencode-local/database/`
- [ ] `opencode.json` sets `SPEC_KIT_DB_DIR` environment variable
- [ ] `.opencode/` replaced with symlink to Public
- [ ] `specs/` moved to project root and accessible

## P1 - MUST COMPLETE

- [ ] AGENTS.md updated (PUBLIC RELEASE section reversed, paths updated)
- [ ] AGENTS.md updated (same changes as AGENTS.md)
- [ ] PUBLIC_RELEASE.md rewritten for symlink architecture
- [ ] `.gitignore` properly ignores `.opencode` symlink, tracks `specs/` and `.opencode-local/`
- [ ] `code_database` and `code_index` symlinks handled

## P2 - VERIFICATION

- [ ] MCP servers boot without errors
- [ ] `skill_advisor.py` resolves paths through symlink
- [ ] Memory search/save writes to `.opencode-local/database/`
- [ ] Skills load correctly through symlink
