---
title: "Implementation Plan: Deprecate project .gemini runtime surface"
description: "Plan for deleting the project .gemini runtime surface and updating active non-spec references while preserving specs as historical records."
trigger_phrases:
  - "gemini deprecation plan"
  - "project .gemini cleanup"
importance_tier: "important"
contextType: "plan"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/107-cli-gemini-deprecation/001-runtime-surface-and-skill-deletion"
    last_updated_at: "2026-06-05T06:55:00Z"
    last_updated_by: "opencode"
    recent_action: "Filled concrete implementation plan"
    next_safe_action: "Execute inventory, deletion, active reference updates, and verification"
    blockers: []
    key_files:
      - ".gemini/**"
      - "AGENTS.md"
      - "README.md"
      - ".opencode/commands/**"
      - ".opencode/skills/**"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "gemini-deprecation-2026-06-05"
      parent_session_id: null
    completion_pct: 15
    open_questions: []
    answered_questions:
      - "Delete project .gemini."
      - "All specs are historical for cleanup purposes."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deprecate project .gemini runtime surface

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, JSON, TypeScript, JavaScript, Python, Shell |
| **Framework** | OpenCode skill and command repository |
| **Storage** | No application storage changes |
| **Testing** | Targeted `rg`, SpecKit validation, TypeScript/Vitest or script checks for changed surfaces |

### Overview

Delete the project `.gemini/**` runtime surface and the checked-in `.opencode/skills/cli-gemini/**` skill, then update active non-spec files that advertise either deleted surface. Preserve only external Gemini binary, user-home, or historical references that do not claim an installed `cli-gemini` skill exists.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented.
- [x] Success criteria measurable with tracked-file and targeted-search checks.
- [x] Dependencies identified: commands, skills, docs, runtime detection, tests, and manifests.

### Definition of Done
- [x] Project `.gemini/**` tracked files deleted.
- [x] Active non-spec project `.gemini` references removed or replaced.
- [x] Deleted `cli-gemini` skill removed from catalogs, advisor routing, and skill graph metadata.
- [ ] Targeted tests and strict SpecKit validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Repository runtime-surface deprecation with exact-token inventory, surgical reference updates, and targeted regression verification.

### Key Components
- **Project runtime mirror**: `.gemini/**`, deleted from tracked files.
- **Gemini CLI skill**: `.opencode/skills/cli-gemini/**`, deleted from checked-in skills.
- **Runtime discovery and setup**: doctor scripts, runtime detection, install guides, and hooks docs updated so project `.gemini/settings.json` is no longer a required checked-in surface.
- **Agent and command mirror guidance**: OpenCode command and skill docs updated to exclude project `.gemini` mirrors from active authoring expectations.
- **Tests and manifests**: parity tests and capability manifests updated so they do not assert deleted `.gemini/agents` files.

### Data Flow

The repository no longer publishes project Gemini runtime files or an installed `cli-gemini` skill. Any remaining Gemini binary references are external or historical, not active skill registrations.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.gemini/**` | Project Gemini runtime mirror | Delete | `git ls-files ".gemini/**"` shows no remaining tracked files after deletion. |
| `.opencode/skills/cli-gemini/**` | Gemini CLI skill | Delete completely | `glob .opencode/skills/cli-gemini/**` returns no files; skill graph scan removes stale node. |
| `AGENTS.md`, `README.md` | User-facing setup and runtime docs | Remove project `.gemini` runtime instructions | Targeted active-doc search. |
| `.opencode/commands/create/**` | Command and component scaffolds | Remove Gemini project mirror destination | Search and targeted command asset review. |
| `.opencode/commands/doctor/**` | MCP config audit/install/debug routes | Remove project `.gemini/settings.json` config target | Targeted doctor script search and syntax checks. |
| `.opencode/skills/**/runtime_capabilities.json` | Runtime capability declarations | Remove Gemini mirror path entries or mark unsupported when project mirror is required | JSON parse and tests. |
| `.opencode/skills/**/tests/**` | Runtime mirror parity tests | Remove `.gemini` assertions or convert to temp fixture only | Targeted test runs. |
| Skill-advisor catalogs and graph metadata | Available-skill routing | Remove `cli-gemini` as a routable skill | Skill graph scan/rebuild and advisor recommendation check. |

Required inventories:
- `rg -n "(^|[^~])\\.gemini/(agents|commands|workflows|scripts|skills|specs|changelog|settings\\.json|GEMINI\\.md|\\.utcp_config\\.json)"` with specs and node_modules excluded.
- `git ls-files ".gemini/**"` for deletion footprint.
- `glob .opencode/skills/cli-gemini/**` for deleted skill footprint.
- Targeted post-edit search excluding `specs/**`, `.opencode/specs/**`, and user-home `~/.gemini` docs.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Load auto workflow and governing skills.
- [x] Create missing Level 3 packet files.
- [x] Record resolved setup values.

### Phase 2: Core Implementation
- [x] Delete `.gemini/**` tracked files.
- [x] Delete `.opencode/skills/cli-gemini/**` tracked skill files.
- [x] Update top-level docs and command assets.
- [x] Update skill source, manifests, tests, and docs that require project `.gemini` or advertise `cli-gemini` as installed.

### Phase 3: Verification
- [ ] Run targeted active-reference search.
- [ ] Run syntax or unit tests for changed code paths.
- [ ] Run strict SpecKit validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Inventory | Tracked `.gemini` files and active project path references | `git ls-files`, `rg` |
| Syntax | Changed JSON, YAML, Python, Shell, TypeScript/JavaScript | native parsers, targeted scripts, build where applicable |
| Unit | Changed MCP/runtime detection and parity tests | targeted `npx vitest run ...` |
| Spec | Packet documentation and checklist evidence | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| User clarification on deletion semantics | Requirement | Green | Already answered: delete project `.gemini`. |
| User clarification on historical specs | Requirement | Green | Already answered: all specs are historical for cleanup. |
| Local test dependencies | Tooling | Yellow | If a targeted test cannot run, record exact blocker and use static verification. |
| Checked-in generated dist | Build artifact | Yellow | If build does not refresh dist, patch tracked dist to match source. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Targeted tests fail in a way that cannot be repaired safely in scope, or deletion breaks active non-Gemini runtime surfaces.
- **Procedure**: Revert this packet's edits and restore `.gemini/**` from git history only if the user cancels the deprecation. Do not partially recreate project `.gemini` files while claiming deprecation success.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Inventory -> Documentation scope -> Runtime/source edits -> Tests -> Spec closeout
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | Clarified scope | All updates |
| Documentation scope | Inventory | Runtime/source edits |
| Runtime/source edits | Documentation scope | Tests |
| Tests | Runtime/source edits | Closeout |
| Closeout | Tests | Completion |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 30-45 minutes |
| Core Implementation | High | 2-4 hours |
| Verification | High | 1-2 hours |
| **Total** | | **3.5-6.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Record current tracked `.gemini/**` deletion footprint.
- [ ] Keep all edits in the working tree for diff review before any commit.
- [ ] Run targeted reference search before claiming completion.

### Rollback Procedure
1. Restore deleted `.gemini/**` and edited files from git if the user cancels deprecation.
2. Re-run targeted searches to confirm project `.gemini` references are back only when rollback is intended.
3. Re-run validation for the packet state.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Git-level file restoration only.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Scope clarification
  -> tracked deletion
  -> docs and command updates
  -> source/manifests/tests updates
  -> verification and closeout
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Scope clarification | User answers | Bound deletion rules | All work |
| Inventory | Scope clarification | Active file list | Edits |
| Runtime/source edits | Inventory | Updated behavior/tests | Verification |
| Documentation edits | Inventory | Updated user guidance | Verification |
| Verification | All edits | Evidence | Completion |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventory project `.gemini` references** - CRITICAL.
2. **Delete `.gemini/**` and update active runtime dependencies** - CRITICAL.
3. **Run targeted search and tests** - CRITICAL.

**Total Critical Path**: 3 implementation stages.

**Parallel Opportunities**:
- Documentation edits and manifest/test edits are conceptually separable, but this run remains single-agent because the user constrained agent dispatch.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Packet initialized | Level 3 docs exist with concrete scope | Planning |
| M2 | Runtime surface removed | `.gemini/**` deleted from tracked files | Implementation |
| M3 | References aligned | Active project `.gemini` search clean or only documented exceptions remain | Verification |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### ADR-001: Delete project `.gemini` and preserve external Gemini CLI support

**Status**: Accepted

**Context**: The repo should stop maintaining a checked-in Gemini project runtime mirror, but Gemini CLI remains useful as an external executor with user-home configuration.

**Decision**: Delete the project `.gemini` surface and update active repo references to remove it as a supported project mirror.

**Consequences**:
- The repo has fewer project runtime mirrors to maintain.
- Existing tests and docs that assumed `.gemini` parity must be updated.

**Alternatives Rejected**:
- Keep `.gemini` as a tombstone: rejected because the user requested deletion.
- Remove all Gemini CLI support: rejected because the request targets project `.gemini`, not the external CLI skill.
