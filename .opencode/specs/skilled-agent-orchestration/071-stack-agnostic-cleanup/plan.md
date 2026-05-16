---
title: "Implementation Plan: Phase 071 Stack-Agnostic Cleanup"
description: "Inventory and remove stack-specific references from non-sk-code skills while preserving sk-code as the single surface-aware customization layer."
trigger_phrases:
  - "stack agnostic cleanup"
  - "skill graph validation"
  - "non sk-code cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/071-stack-agnostic-cleanup"
    last_updated_at: "2026-05-05T19:14:28Z"
    last_updated_by: "cli-codex"
    recent_action: "Planned deterministic cleanup order"
    next_safe_action: "Run inventory grep and patch matched skills"
    blockers: []
    key_files:
      - ".opencode/skills/"
      - "specs/skilled-agent-orchestration/071-stack-agnostic-cleanup/"
    session_dedup:
      fingerprint: "sha256:bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb"
      session_id: "phase-071-stack-agnostic-cleanup"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 071 Stack-Agnostic Cleanup

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, TOML skill metadata |
| **Framework** | OpenCode skill framework |
| **Storage** | Filesystem spec packet and skill files |
| **Testing** | Scoped grep, frontmatter checks, skill graph compile/validate, strict spec validation |

### Overview
This cleanup replaces stack-specific examples in non-`sk-code` skills with generic service, frontend, code-surface, or `<surface>` language. The implementation is inventory-driven: collect the current matches, patch only affected non-protected files, then prove the scoped grep is clean.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable.
- [x] Protected paths identified.

### Definition of Done
- [ ] Initial inventory saved in packet scratch notes.
- [ ] Affected skill files patched without touching `sk-code`.
- [ ] Final scoped grep returns zero.
- [ ] Skill graph compile and validate-only pass.
- [ ] Strict spec validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Content cleanup with routing-boundary preservation.

### Key Components
- **`sk-code`**: Sole allowed owner of stack, library, CMS, and surface-specific details.
- **Non-`sk-code` skills**: Generic orchestration, documentation, git, MCP, CLI, and review guidance.
- **Skill graph compiler**: Validation surface for metadata and routing signals.

### Data Flow
Inventory grep produces a match list. Patches replace matched strings with generic examples. Final grep and compiler validation prove the cleaned skill layer remains parseable and routable.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/cli-*` | Runtime CLI skill guidance | Patch matched docs/config | Grep before/after and frontmatter checks |
| `.opencode/skills/mcp-*` | MCP orchestration guidance | Patch matched examples | Grep before/after and frontmatter checks |
| `.opencode/skills/sk-doc` | Documentation guidance | Patch matched examples | Grep before/after |
| `.opencode/skills/sk-git` | Git workflow guidance | Patch matched examples | Grep before/after |
| `.opencode/skills/sk-code-review` | Review baseline plus surface evidence | Replace concrete surface tags with `<surface>` placeholders | Grep before/after |
| `.opencode/skills/system-spec-kit` | Spec and skill routing framework | Generalize examples/signals | Skill graph compile and validate-only |
| `.opencode/skills/sk-code` | Surface-aware code standards | Unchanged | `git diff --name-only -- .opencode/skills/sk-code` |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Create Level 2 spec packet.
- [ ] Add ADR-001 for the agnostic skill layer rule.
- [ ] Run initial scoped grep and save inventory note.

### Phase 2: Core Implementation
- [ ] Patch CLI skills in deterministic order.
- [ ] Patch MCP skills in deterministic order.
- [ ] Patch `sk-doc` and `sk-git`.
- [ ] Patch `sk-code-review`.
- [ ] Patch `system-spec-kit`.
- [ ] Patch `mcp-code-mode` last because it has the largest example surface.

### Phase 3: Verification
- [ ] Run final scoped grep.
- [ ] Verify touched `SKILL.md` frontmatter.
- [ ] Recompile skill graph export.
- [ ] Run compiler validate-only.
- [ ] Run strict spec validation.
- [ ] Write implementation summary.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Static search | Forbidden stack/library/repo terms outside protected paths | `grep -rEi ...` with exclusions |
| Metadata parse | Touched `SKILL.md` frontmatter | Ruby or shell frontmatter extraction checks |
| Compiler | Skill graph consistency | `skill_graph_compiler.py --export-json --pretty` and `--validate-only` |
| Spec validation | Phase packet completeness | `validate.sh <packet> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing skill files | Internal | Green | Cleanup cannot proceed without inventory |
| Skill graph compiler | Internal | Green | Completion cannot be claimed |
| Spec validator | Internal | Green | Packet cannot be closed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Compiler validation fails due to content cleanup, or final grep proves protected paths were touched.
- **Procedure**: Revert only Phase 071 edits to affected non-`sk-code` files, keep the inventory evidence, and re-run the scoped grep to identify the failing replacement.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inventory -> Patch deterministic skill groups -> Final grep -> Compiler validation -> Spec validation -> Summary
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core cleanup |
| Core cleanup | Inventory | Verification |
| Verification | Core cleanup | Completion summary |
| Summary | Verification | Final status |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 20-30 minutes |
| Core Implementation | Medium | 1-2 hours |
| Verification | Medium | 30-45 minutes |
| **Total** | | **2-3 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Protected path exclusions identified.
- [ ] Initial grep saved.
- [ ] Changed file list reviewed before final status.

### Rollback Procedure
1. Use `git diff --name-only` to identify Phase 071 changed files.
2. Revert only files changed for this cleanup if validation fails.
3. Re-run the scoped grep and compiler validation.
4. Update this packet with the failure evidence.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git revert of Phase 071 content edits only.
<!-- /ANCHOR:enhanced-rollback -->
