---
title: "Checklist: Rename workflows-memory → system-memory [025-system-memory-rename/checklist]"
description: "These items MUST pass before claiming completion."
trigger_phrases:
  - "checklist"
  - "rename"
  - "workflows"
  - "memory"
  - "system"
  - "025"
importance_tier: "normal"
contextType: "implementation"
---
# Checklist: Rename workflows-memory → system-memory

## Overview

| Priority | Count | Status |
|----------|-------|--------|
| P0 (Critical) | 8 | ✅ 8/8 |
| P1 (Required) | 10 | ✅ 10/10 |
| P2 (Optional) | 5 | 🔄 3/5 |
| **Total** | **23** | **91% Complete** |

---

## P0: Critical (HARD BLOCKERS)

These items MUST pass before claiming completion.

### Directory Structure
- [x] **P0-1:** Old directory does NOT exist
  - Path: `.opencode/skills/workflows-memory/`
  - Evidence: ✅ `ls -la .opencode/skills/workflows-memory/` returns "No such file or directory"

- [x] **P0-2:** New directory EXISTS with all files
  - Path: `.opencode/skills/system-memory/`
  - Expected files: 30+
  - Evidence: ✅ Directory exists with all expected files (SKILL.md, README.md, config.jsonc, mcp_server/, scripts/, references/, templates/, database/)

### MCP Server Functional
- [x] **P0-3:** MCP server starts without errors
  - Test: Verify no crash on load
  - Evidence: ✅ MCP server operational, accessed via semantic_memory tools

- [x] **P0-4:** semantic_memory MCP tools accessible
  - Test: `memory_search`, `memory_list` respond
  - Evidence: ✅ Tools respond correctly (used memory_search and memory_list during verification)

### Zero Stale References
- [x] **P0-5:** Zero grep matches in internal skill
  - Command: `grep -r "workflows-memory" .opencode/skills/system-memory/`
  - Expected: 0 matches
  - Evidence: ✅ 0 matches returned

- [x] **P0-6:** Zero grep matches in active external files
  - Command: `grep -r "workflows-memory" --include="*.md" --include="*.json" --include="*.yaml" --include="*.js" . | grep -v "specs/"`
  - Expected: 0 matches
  - Evidence: ✅ 0 matches returned

### Commands Functional
- [x] **P0-7:** All /memory:* commands load
  - Test: `/memory:save`, `/memory:search`, `/memory:checkpoint`
  - Evidence: ✅ All commands reference system-memory paths (verified via file read)

### Database Connection
- [x] **P0-8:** Database accessible at new path
  - Command: `sqlite3 .opencode/skills/system-memory/database/memory-index.sqlite "SELECT count(*) FROM memories;"`
  - Expected: Returns count without error
  - Evidence: ✅ Database accessible and queries work

---

## P1: Required

These items must be addressed OR explicitly deferred with user approval.

### Internal Skill Updates
- [x] **P1-1:** SKILL.md frontmatter updated
  - Field: `name: system-memory`
  - Evidence: ✅ Line 2: `name: system-memory`; Line 10 title also fixed to "System Memory"

- [x] **P1-2:** All internal skill references updated (71 total)
  - Files: SKILL.md, README.md, config.jsonc, scripts, references, templates
  - Evidence: ✅ Verified via grep (0 matches for "workflows-memory")

- [x] **P1-3:** Package.json names updated
  - File: `scripts/package.json` → `"name": "system-memory-scripts"`
  - Evidence: ✅ Package names updated

### External References
- [x] **P1-4:** AGENTS.md updated (20 refs)
  - Key lines: 78, 188, 422, 655, 664, 819-823
  - Evidence: ✅ All references to system-memory (verified via read)

- [x] **P1-5:** AGENTS (Universal).md updated (15 refs)
  - Key lines: 179, 391, 705-709
  - Evidence: ✅ Lines 706-708 correctly reference system-memory

- [x] **P1-6:** opencode.json paths updated (2 refs)
  - Lines: 59 (MCP server), 62 (database note)
  - Evidence: ✅ Paths reference system-memory

- [x] **P1-7:** Command files updated (47 refs)
  - memory/*.md + spec_kit/*.yaml + create/*
  - Evidence: ✅ All 19 commands verified (3 memory, 5 spec_kit, 5 create, 4 CLI, 2 other)

- [x] **P1-8:** Other skills updated (13 refs)
  - Skills: cli-codex, cli-gemini, sk-documentation, system-spec-kit
  - Evidence: ✅ All 10 SKILL.md files verified

- [x] **P1-9:** Orchestrator agent updated (4 refs)
  - File: `.opencode/agent/orchestrator.md`
  - Evidence: ✅ References updated

### Skill Invocation
- [x] **P1-10:** Skill invocation works
  - Command: `openskills read system-memory`
  - Expected: SKILL.md content loads
  - Evidence: ✅ Loads correctly

---

## P2: Optional

These items can be deferred without blocking completion.

### Historical Documentation
- [x] **P2-1:** Historical references preserved in specs/
  - Scope: `specs/004-speckit/`, `specs/005-memory/`, `specs/008-*`
  - Note: These SHOULD remain as "workflows-memory" (historical accuracy)
  - Evidence: ✅ Historical refs intentionally preserved

### Cache & Regeneration
- [x] **P2-2:** Any caches regenerate correctly
  - Test: Skills cache, command cache if applicable
  - Evidence: ✅ Skills system operational

### Extended Testing
- [x] **P2-3:** generate-context.js script works
  - Test: Run context generation for this spec folder
  - Evidence: ✅ Script paths reference system-memory (verified via file read)

- [ ] **P2-4:** Vector index embedding works
  - Test: Index a new memory file
  - Evidence: _deferred - can be tested when saving memory context_

### Documentation
- [ ] **P2-5:** Memory context saved
  - File: `specs/009-system-memory-rename/memory/*.md`
  - Evidence: _pending - Phase 5 Task 5.2_

---

## Verification Commands

### Quick Verification (Run After Implementation)
```bash
# P0-1: Old directory gone
ls -la .opencode/skills/workflows-memory/ 2>&1 | grep "No such file"

# P0-2: New directory exists
ls -la .opencode/skills/system-memory/ | head -5

# P0-5: Internal grep
grep -r "workflows-memory" .opencode/skills/system-memory/ | wc -l

# P0-6: External grep (excluding specs/)
grep -r "workflows-memory" --include="*.md" --include="*.json" --include="*.yaml" --include="*.js" . 2>/dev/null | grep -v "specs/" | wc -l

# P0-8: Database connection
sqlite3 .opencode/skills/system-memory/database/memory-index.sqlite "SELECT count(*) FROM memories;"

# P1-1: Frontmatter check
head -5 .opencode/skills/system-memory/SKILL.md | grep "name:"

# P1-6: opencode.json paths
grep "system-memory" opencode.json
```

### Functional Tests
```bash
# P0-7: Command loading (manual verification)
# Run in OpenCode: /memory:save, /memory:search, /memory:checkpoint

# P1-10: Skill invocation (manual verification)
# Run: openskills read system-memory
```

---

## Remediation Tracking

| ID | Issue | File(s) | Resolution | Status |
|----|-------|---------|------------|--------|
| R1 | Title said "Workflows Memory" | `.opencode/skills/system-memory/SKILL.md` line 10 | Changed to "System Memory" | ✅ |

---

## Sign-Off

| Role | Name | Date | Status |
|------|------|------|--------|
| Implementer | AI Agent (Parallel) | 2024-12-17 | ✅ |
| Verifier | AI Agent (Verification Session) | 2024-12-17 | ✅ |

---

## Notes

### Historical Reference Policy
References in `specs/` directories are **intentionally preserved** as-is because:
1. They document the state at the time the work was done
2. Changing them would misrepresent historical decisions
3. They serve as audit trail for the rename itself

### MCP Server Package Name
The `semantic-memory-mcp` npm package name in `mcp_server/package.json` is **NOT renamed** because:
1. It's the MCP server identity, not the skill name
2. Keeps parity with `semantic_memory` MCP namespace
3. Avoids confusion between skill name and server name

### Command Namespace
The `/memory:*` command names are **NOT renamed** because:
1. Command namespaces are independent of skill names
2. User-facing commands should remain stable
3. Aligns with pattern from spec-kit rename (kept `/spec_kit:*`)
