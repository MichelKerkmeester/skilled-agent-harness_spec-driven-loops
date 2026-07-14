---
title: "Implementation Plan: Deprecate cli-codex skill and operational references"
description: "Retire cli-codex by removing the discoverable skill, active executor support, advisor routes, command options, agent prompts, and public docs while preserving archival history. Verification uses scoped grep, targeted tests, metadata rebuilds, and strict spec validation."
trigger_phrases:
  - "cli-codex deprecation plan"
  - "codex cli skill retirement plan"
  - "remove cli-codex executor"
  - "skill graph cleanup"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/cli-external-orchestration/025-cli-codex-deprecation"
    last_updated_at: "2026-06-30T06:40:00Z"
    last_updated_by: "opencode"
    recent_action: "Created implementation plan for cli-codex operational retirement"
    next_safe_action: "Execute implementation through the separate SpecKit implementation workflow"
    blockers: []
    key_files:
      - ".opencode/skills/cli-codex/"
      - ".opencode/commands/deep/assets/"
      - ".opencode/skills/deep-loop-runtime/"
      - ".opencode/skills/system-skill-advisor/"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/"
    session_dedup:
      fingerprint: "sha256:951b82df8b7b03d01f3aecac83cfb367798059f3291c5484a195365fe50d8a33"
      session_id: "159-cli-codex-deprecation-plan"
      parent_session_id: null
    completion_pct: 35
    open_questions: []
    answered_questions:
      - "Retire active operational cli-codex references and preserve historical archives."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Deprecate cli-codex skill and operational references

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | OpenCode system docs, TypeScript, JavaScript, shell, JSON, YAML, Markdown |
| **Framework** | OpenCode skill/agent/command surface, SpecKit, Skill Advisor, deep-loop runtime |
| **Storage** | Checked-in skill graph metadata and generated skill-advisor graph cache |
| **Testing** | Vitest packages, shell/spec validation, skill graph scan, alignment drift verifier, scoped grep |

### Overview
Implement a source-first retirement sweep: remove the discoverable `cli-codex` skill tree, remove active executor/advisor/command references, then rebuild or update generated graph metadata so the retired node does not reappear. Keep historical specs, changelogs, and run outputs unchanged unless a file is consumed as active runtime input.

### Planning Evidence

| Evidence | Result |
|----------|--------|
| `rg --hidden --files-with-matches "cli-codex" .` | Huge raw set dominated by historical specs and run artifacts; output saved by tool due size. |
| Scoped active grep | Found active references in root docs, install guides, agents, deep command assets, skill docs, advisor, deep-loop runtime, matrix runner, playbooks, and generated graph metadata. |
| Context agent architecture sweep | Confirmed `cli-codex` is both a skill identity and executor kind. |
| Context agent verification sweep | Identified advisor, deep-loop runtime, deep-improvement, and matrix runner tests as likely affected. |
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in `spec.md`.
- [x] Success criteria measurable with grep, metadata, and test evidence.
- [x] Dependencies identified: advisor graph, deep-loop executor config, command assets, agents, mirrors, and docs.

### Definition of Done
- [ ] Discoverable `cli-codex` skill tree removed or made non-loadable.
- [ ] Active operational references removed or retargeted.
- [ ] Skill-advisor graph and checked-in metadata no longer contain `cli-codex` routes.
- [ ] Targeted tests and validation commands pass.
- [ ] Remaining grep hits are zero or classified as archival/non-operational in `implementation-summary.md`.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Source-first deprecation with generated metadata refresh.

### Key Components
- **Skill package**: `.opencode/skills/cli-codex/` is the discoverable OpenCode skill to retire.
- **Executor runtime**: deep-loop runtime and deep-improvement/model benchmark code currently treat `cli-codex` as an executable kind.
- **Command surfaces**: `/deep:*` YAML and presentation assets expose `cli-codex` choices.
- **Advisor surfaces**: scorer lane code, corpora, skill graph metadata, and generated graph cache route to `cli-codex`.
- **Documentation surfaces**: root docs, install guides, active skill docs, agents, mirrors, feature catalogs, and manual playbooks advertise the retired executor.

### Data Flow
Skill discovery reads `SKILL.md` and graph metadata, advisor graph scanning indexes those skills, commands and agents advertise executor choices, and deep-loop runtime executes configured executor kinds. The retirement must remove the source skill and every active reference that can route back to it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/skills/cli-codex/**` | Discoverable skill package | Delete or make non-discoverable | `Glob` no active `SKILL.md`; final grep excludes deleted tree. |
| `.opencode/skills/deep-loop-runtime/**` | Executor kind validation and fanout dispatch | Remove `cli-codex` enum/config/spawn/audit tests | Deep-loop runtime typecheck/test; grep for `kind.*cli-codex`. |
| `.opencode/commands/deep/assets/**` | User-facing and machine-readable executor options | Remove `cli-codex` options/examples | Scoped grep over command assets. |
| `.opencode/skills/system-skill-advisor/**` | Advisor routing and skill graph | Remove route/corpus/graph edges; rebuild metadata | Advisor tests and skill graph scan/status. |
| `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/**` | Matrix executor adapter | Remove adapter/manifest cells/tests | Matrix runner targeted tests or TypeScript compile. |
| `.opencode/agents/**`, `.claude/agents/**` | Canonical and mirrored prompts | Remove `cli-codex` vantages/seats | Grep mirrors and canonical prompts. |
| Root docs and install guides | Public skill catalog | Remove `cli-codex` listing | Scoped grep over README/AGENTS/install guides. |
| Active skill docs and playbooks | Cross-CLI recipes and tests | Retire or retarget scenarios | Scoped grep over `.opencode/skills` excluding historical specs/changelogs. |

Required inventories:
- Same-class producers: `rg --hidden --files-with-matches "cli-codex" AGENTS.md README.md .opencode .claude --glob '!**/specs/**' --glob '!**/z_archive/**' --glob '!**/changelog/**' --glob '!**/node_modules/**'`.
- Consumers of changed symbols: `rg --hidden "cli-codex|kind.*cli-codex|expectedSkill.*cli-codex|--executor=cli-codex" .opencode/skills .opencode/commands .opencode/agents .claude/agents README.md AGENTS.md`.
- Matrix axes: skill discovery, executor validation, command presentation, advisor routing, docs/playbooks, mirrors, generated metadata.
- Algorithm invariant: no active operational surface may route, recommend, validate, or spawn `cli-codex` after retirement.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Run `/speckit:plan:auto` contract through planning steps.
- [x] Create Level 3 packet and document archive boundary.
- [ ] Capture initial active grep count before implementation edits.

### Phase 2: Core Implementation
- [ ] Remove `.opencode/skills/cli-codex/` from the active skill inventory.
- [ ] Remove `cli-codex` executor kind support from deep-loop runtime, deep-improvement/model benchmark, and matrix runner sources/tests.
- [ ] Remove `cli-codex` options from `/deep:*` command YAML and presentation assets.
- [ ] Update skill-advisor scorer/corpora/metadata and rebuild skill graph artifacts.
- [ ] Update agents, mirrors, root docs, install guides, skill docs, feature catalogs, and manual playbooks.

### Phase 3: Verification
- [ ] Run targeted package tests for touched TypeScript/JavaScript surfaces.
- [ ] Run `verify_alignment_drift.py` for changed `.opencode` scopes.
- [ ] Run scoped grep and document any remaining archival exceptions.
- [ ] Run strict SpecKit validation for this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Spec validation | This packet | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/cli-external-orchestration/025-cli-codex-deprecation --strict` |
| Alignment | Changed `.opencode` scopes | `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root <changed-scope>` |
| Advisor | Skill advisor scoring and graph | Package typecheck/tests plus `skill_graph_scan`/status where needed |
| Deep-loop runtime | Executor config, audit, fanout | Package typecheck/tests for deep-loop runtime |
| Deep-improvement | Model/skill benchmark executor references | Vitest tests for model benchmark and skill benchmark |
| Matrix runner | CLI adapter manifest and runner | TypeScript compile or targeted matrix runner tests |
| Grep | Active references | Scoped `rg --hidden` include/exclude command from success criteria |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Skill graph scan/rebuild | Internal tool | Available | Manual metadata cleanup may be needed if rebuild fails. |
| Deep-loop package tests | Internal verification | Available | Must fall back to targeted TypeScript/Vitest commands if no top-level script exists. |
| Scoped grep | Local tool | Available | Required to prove active references are gone. |
| Historical archives | Audit data | Preserved | Remaining archival grep hits must be documented, not rewritten. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Tests fail in a way that cannot be resolved within the requested deprecation scope, or downstream workflows need `cli-codex` retained as an executor.
- **Procedure**: Restore the deleted `cli-codex` skill tree and revert touched command/runtime/advisor/doc changes from git, then rerun skill graph scan and scoped grep to confirm the previous contract is restored.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Phase 1 (Setup) -> Phase 2 (Core retirement) -> Phase 3 (Verification)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core retirement |
| Core retirement | Setup | Verification |
| Verification | Core retirement | Completion claim |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Medium | 1-2 hours |
| Core Implementation | High | 4-8 hours |
| Verification | High | 2-4 hours |
| **Total** | | **7-14 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] No production deployment or data migration required.
- [ ] Git diff reviewed to ensure only requested deprecation surfaces changed.
- [ ] Skill graph state can be rebuilt from checked-in metadata.

### Rollback Procedure
1. Restore the `cli-codex` skill tree from git.
2. Restore executor/command/advisor/docs references from the same diff.
3. Rebuild or rescan skill graph metadata.
4. Rerun advisor/deep-loop tests and scoped grep.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: Source-only git rollback plus generated metadata rebuild.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Skill tree removal
        |
        v
Advisor graph cleanup ----> Docs and agents cleanup
        |                         |
        v                         v
Executor/runtime cleanup --> Command asset cleanup
        |                         |
        v                         v
               Verification and final grep
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Skill tree | Planning scope | Removed discoverable skill | Advisor graph rebuild |
| Runtime executor | Inventory | Removed executor kind | Command/test verification |
| Advisor graph | Skill tree cleanup | Updated recommendations | Final skill graph status |
| Docs/agents | Inventory | Updated guidance | Final grep |
| Tests | Source edits | Verification evidence | Completion claim |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventory active references** - CRITICAL
2. **Remove skill and executor routing** - CRITICAL
3. **Update advisor graph and command assets** - CRITICAL
4. **Run targeted tests and final grep** - CRITICAL

**Total Critical Path**: One focused implementation pass plus verification.

**Parallel Opportunities**:
- Docs/playbooks can update after the source reference inventory is stable.
- Agent mirrors can update alongside canonical agent prompt cleanup.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Planning complete | Spec, plan, tasks, checklist, decision record validated | Planning phase |
| M2 | Source retirement complete | Skill tree and executor/advisor routes removed | Implementation phase |
| M3 | Verification complete | Tests, metadata rebuild, final grep, and strict validation pass | Verification phase |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

### Decision: Operational retirement with archive preservation

The decision record accepts a full operational retirement of `cli-codex` while preserving historical audit records. See `decision-record.md` for alternatives and rollback details.
