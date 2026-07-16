---
title: "Implementation Plan: System Code Graph README Update"
description: "README-only documentation pass for the standalone system-code-graph skill, using sk-doc skill and code-folder README templates."
trigger_phrases:
  - "013 readmes update plan"
  - "system code graph readme plan"
  - "sk-doc readme template plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/007-docs-and-readmes/002-system-code-graph-readmes-update"
    last_updated_at: "2026-05-14T17:49:15Z"
    last_updated_by: "cli-codex-gpt5.5-xhigh-fast-013"
    recent_action: "Planned README template alignment and recorded git sandbox block"
    next_safe_action: "Stage and commit scoped files when git index writes are permitted"
    blockers:
      - "Sandbox denied git index lock creation during staging: .git/index.lock Operation not permitted"
    key_files:
      - ".opencode/skills/system-code-graph/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/database/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/handlers/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/lib/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/lib/utils/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/tests/README.md"
      - ".opencode/skills/system-code-graph/mcp_server/tools/README.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-14-013-readmes-update"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: System Code Graph README Update

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation |
| **Framework** | sk-doc README templates |
| **Storage** | None changed; database README documents existing SQLite artifacts only |
| **Testing** | sk-doc README validation, local link check, git diff whitespace check, strict spec validation |

### Overview

This packet audits README files inside `.opencode/skills/system-code-graph/` and updates authored files to the appropriate sk-doc template profile. The pass keeps runtime code untouched, uses packet 010's completed MCP rename as the naming source of truth and records vendor dependency READMEs as audited but not edited.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] Gate 3 pre-answered with the 013 packet path.
- [x] sk-doc and system-spec-kit routing confirmed by advisor.
- [x] Packet 010 status checked before choosing MCP namespace terminology.
- [x] README inventory produced with `find .opencode/skills/system-code-graph -name 'README*' -type f`.

### Definition of Done

- [x] Authored READMEs updated with matching sk-doc template variants.
- [x] Third-party dependency READMEs audited and left untouched.
- [x] sk-doc README validation exits 0 for edited READMEs.
- [x] Local README links resolve.
- [x] Strict 013 packet validation exits 0.
- [x] Scoped git staging attempted; commit blocked because staging failed.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Documentation-only template alignment.

### Key Components

- **Skill-root README**: Human-facing guide using `skill_readme_template.md`.
- **Code-section READMEs**: Developer orientation files using `readme_code_template.md`.
- **README selection guide**: `readme_template.md` used as the core selection and quality reference.
- **013 packet docs**: Level 1 documentation and validation ledger.

### Data Flow

```text
sk-doc README templates
  -> README inventory and classification
  -> authored system-code-graph README edits
  -> README validators and local link check
  -> 013 packet validation
  -> scoped staging and commit attempt
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Root skill README | Human orientation for the skill package | Rewritten to skill README profile | sk-doc README validator |
| `mcp_server/**/README.md` authored files | Developer orientation for code folders | Rewritten or refreshed to code-folder README profile | sk-doc README validator and local link check |
| `node_modules/**/README.md` | Third-party dependency documentation | Audited only | Work list records no edits |
| 013 packet docs | Documentation and validation ledger | Created and adapted from Level 1 templates | strict spec validation |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Research And Inventory

- [x] Read sk-doc `SKILL.md`.
- [x] Read `readme_code_template.md`, `skill_readme_template.md` and `readme_template.md`.
- [x] Locate README files under system-code-graph.
- [x] Read authored README files and dependency README files before editing.

### Phase 2: README Alignment

- [x] Rewrite root skill README with skill README profile.
- [x] Replace blank database README with code-folder artifact guide.
- [x] Refresh handlers, lib, utils, stress, tests and tools README files.
- [x] Update current MCP naming to packet 010 terminology.

### Phase 3: Verification And Delivery

- [x] Run sk-doc README validation across edited files.
- [x] Run local README link check.
- [x] Run whitespace check and fix trailing whitespace.
- [x] Run strict 013 packet validation.
- [x] Attempt to stage only scoped files.
- [ ] Commit requested files after staging is possible.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Documentation validation | Edited authored READMEs | `python3 .opencode/skills/sk-doc/scripts/validate_document.py --type readme --blocking-only` |
| Link validation | Local README links under authored files | Inline read-only Python link check |
| Whitespace validation | Edited README diff | `git diff --check` |
| Spec validation | 013 packet docs | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <013-folder> --strict` |
| Git hygiene | Staged file set | `git diff --cached --name-only` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc README templates | Internal docs | Green | Without them, classification would be ad hoc. |
| Packet 010 implementation summary | Internal packet | Green | Determines current MCP namespace wording. |
| Git index write access | Local tooling | Red | Staging failed because `.git/index.lock` could not be created. Report `COMMIT_SHA=uncommitted`. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: README validation fails, links break or staged scope includes forbidden files.
- **Procedure**: Revert only this packet's README edits and 013 packet docs, then restore from the original tracked files. Do not touch parallel packet folders or source code.
<!-- /ANCHOR:rollback -->
