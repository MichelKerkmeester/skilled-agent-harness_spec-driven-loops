---
title: "Implementation Plan: 118/001 — Runtime Skill Scaffold"
description: "Level 2 plan for scaffolding the .opencode/skills/deep-loop-runtime/ skeleton with SKILL.md, README.md, and five subfolder placeholders ready for phase 002 lib moves."
trigger_phrases:
  - "deep-loop-runtime scaffold"
  - "runtime skill skeleton"
  - "118 phase 001"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/006-deep-skill-evolution/004-deep-loop-runtime/002-skill-scaffold"
    last_updated_at: "2026-05-22T19:50:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored Level 2 implementation plan."
    next_safe_action: "Execute scaffold per Phase 1 to 3 tasks."
    blockers: []
    key_files:
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:1180011180011180011180011180011180011180011180011180011180010002"
      session_id: "118-001-runtime-skill-scaffold-plan"
      parent_session_id: "118-001-runtime-skill-scaffold-spec"
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 118/001 — Runtime Skill Scaffold

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/deep-loop-runtime/` new peer skill scaffold |
| **Testing** | `validate.sh --strict`, directory listing, frontmatter grep |
| **Primary Constraint** | No file moves, no MCP edits, no DB relocation in this phase |
| **Rollout Mode** | Scaffold only - folder structure plus two short markdown files plus five `.gitkeep` files |

### Overview
Phase 001 is the foundation phase of the 118 FULL_ISOLATE_NO_MCP migration arc. It creates the empty `.opencode/skills/deep-loop-runtime/` peer skill skeleton so subsequent phases have a destination for runtime libs (phase 002), `.cjs` script shims (phase 003), the relocated SQLite DB (phase 003), and migrated tests (phase 007). The scaffold consists of a `SKILL.md` declaring the new skill contract, a `README.md` for human readers, and five subfolders (`lib/deep-loop/`, `lib/coverage-graph/`, `scripts/`, `storage/`, `tests/`) each holding a single `.gitkeep` placeholder. No file moves, no MCP changes, no DB relocation happen here.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Parent spec read and the 118 arc context internalized.
- [x] Predecessor-overridden 117 ADR-001 SPLIT ruling acknowledged.
- [x] Level 2 template references inspected.
- [x] Phase 001 spec authored and frozen scope confirmed.

### Definition of Done
- [ ] `.opencode/skills/deep-loop-runtime/` folder exists with `SKILL.md`, `README.md`, and five subfolders with `.gitkeep` files.
- [ ] Strict spec validation passes for this packet with zero warnings.
- [ ] No file under `.opencode/skills/system-spec-kit/mcp_server/` was touched.
- [ ] Phase 002 can begin lib moves without additional setup.
- [ ] All required `_memory.continuity` fingerprints are unique across packet docs.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Folder-and-frontmatter scaffold. The pattern matches existing peer skills (`deep-review`, `deep-research`): a top-level `SKILL.md` with frontmatter declaring `name`, `version`, and `allowed-tools`, plus a human-facing `README.md` and content subdirectories that will be populated by downstream phases. The five subfolders are pre-created with `.gitkeep` placeholders so git preserves their identity even before phase 002 lands the first real files.

### Key Components
- **`.opencode/skills/deep-loop-runtime/SKILL.md`**: Authoritative skill manifest. Declares the skill name, version 0.1.0, allowed-tools list (Read, Glob, Grep, Bash), purpose, and a cross-reference to the 118 ADR-001 user-directive override.
- **`.opencode/skills/deep-loop-runtime/README.md`**: Human-readable overview. Explains the skill is the future home of deep-loop and coverage-graph runtime infrastructure plus the planned phase ownership.
- **`lib/deep-loop/.gitkeep`**: Phase 002 destination for the 10 deep-loop `.ts` files.
- **`lib/coverage-graph/.gitkeep`**: Phase 002 destination for the 3 coverage-graph `.ts` files including `coverage-graph-db.ts`.
- **`scripts/.gitkeep`**: Phase 003 destination for the 4 `.cjs` shim entry points that replace the deleted MCP tools.
- **`storage/.gitkeep`**: Phase 003 destination for the relocated `deep-loop-graph.sqlite` and any future runtime-owned storage.
- **`tests/.gitkeep`**: Phase 007 destination for migrated runtime tests split off from the central `tests/deep-loop/` tree.

### Data Flow
1. Phase 001 (this phase) creates the empty skeleton.
2. Phase 002 moves 13 lib files into `lib/deep-loop/` and `lib/coverage-graph/`.
3. Phase 003 creates 4 `.cjs` shims in `scripts/` and relocates `deep-loop-graph.sqlite` into `storage/`.
4. Phase 004 deletes the now-orphaned MCP handlers and tool schema entries from `system-spec-kit/mcp_server/`.
5. Phase 005 to 008 update YAMLs, collateral, tests, and changelog.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Read parent `spec.md` and confirm scope boundary for phase 001.
- [ ] Read peer skill examples (`.opencode/skills/deep-review/SKILL.md`, `.opencode/skills/deep-research/SKILL.md`) to confirm frontmatter shape.
- [ ] Confirm `.opencode/skills/deep-loop-runtime/` does not yet exist (no skill name collision).

### Phase 2: Implementation
- [ ] Create `.opencode/skills/deep-loop-runtime/` folder.
- [ ] Author `SKILL.md` with the documented frontmatter (name, version 0.1.0, allowed-tools, purpose), body referencing the 118 ADR-001 ruling, and the phase ownership map.
- [ ] Author `README.md` with the human-facing overview.
- [ ] Create `lib/deep-loop/`, `lib/coverage-graph/`, `scripts/`, `storage/`, and `tests/` subfolders.
- [ ] Add `.gitkeep` to each of the five subfolders.

### Phase 3: Verification
- [ ] Run `ls .opencode/skills/deep-loop-runtime/` and confirm `SKILL.md`, `README.md`, and the five subfolders are present.
- [ ] Run `find .opencode/skills/deep-loop-runtime -name .gitkeep` and confirm the result contains exactly five paths.
- [ ] Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` and confirm `RESULT: PASSED` with zero warnings.
- [ ] Run `git status .opencode/skills/system-spec-kit/mcp_server/` and confirm no in-scope changes were introduced.
- [ ] Update `implementation-summary.md` with concrete file paths and verification commands.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Command |
|-----------|-------|---------|
| Folder existence | Skill scaffold | `ls .opencode/skills/deep-loop-runtime/` |
| Subfolder placeholders | `.gitkeep` count = 5 | `find .opencode/skills/deep-loop-runtime -name .gitkeep \| wc -l` |
| Frontmatter | `SKILL.md` declares name, version 0.1.0, allowed-tools | `head -30 .opencode/skills/deep-loop-runtime/SKILL.md` |
| Strict spec validation | This packet under L2 contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution/003-deep-loop-runtime/002-skill-scaffold --strict` |
| MCP surface untouched | `system-spec-kit/mcp_server/` unchanged | `git status .opencode/skills/system-spec-kit/mcp_server/` |
| Phase parent still validates | 118 parent + phase 001 child | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution --strict --recursive` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase parent `graph-metadata.json` lists 001 as child | Internal | Green | Validator would not link phase 001 to parent. |
| `validate.sh` script availability | Internal | Green | Cannot verify packet on completion. |
| Existing peer skill examples (`deep-review`, `deep-research`) | Internal | Green | Cannot pattern-match `SKILL.md` shape. |
| Git working tree is on `main` and clean for this packet | External | Green | Stale state would conflate scaffold with unrelated changes. |
| Node + `bash` runtime | External | Green | Validator and `generate-context.js` depend on both. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Strict validation fails after scaffold, or `SKILL.md` is rejected by the skill-graph compiler.
- **Procedure**: `rm -rf .opencode/skills/deep-loop-runtime/` removes the entire scaffold. The spec packet remains as authored. Restart by re-reading the failing validator output, correcting the `SKILL.md` frontmatter, and re-running the implementation steps. No other surfaces are touched in phase 001 so rollback is fully contained.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 Setup ─────┐
                   ├─> Phase 2 Implementation ─> Phase 3 Verification
(read parent spec) │
                   │
(read peer SKILL)  │
                   │
(confirm no clash) ┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Parent spec, peer skill examples | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 002 lib migration |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 10 minutes |
| Implementation | Low | 20 minutes |
| Verification and Handoff | Low | 15 minutes |
| **Total** | | **~45 minutes** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Confirm `.opencode/skills/deep-loop-runtime/` does not exist before write.
- [ ] Confirm spec packet files are committed or staged so the scaffold sits on a known baseline.
- [ ] Confirm `validate.sh` is on disk and exits 0 on a known-good reference (e.g. `116-deep-skill-evolution/002-deep-review/008-playbooks-and-default-calibration`).

### Rollback Procedure
1. `rm -rf .opencode/skills/deep-loop-runtime/` to remove the entire scaffold.
2. Re-run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/116-deep-skill-evolution --strict --recursive` to confirm parent validation still passes.
3. Investigate the validator failure or compiler rejection that triggered rollback before retrying.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: file deletion only. No DB or shared state is modified by this phase.
<!-- /ANCHOR:enhanced-rollback -->
</content>
</invoke>