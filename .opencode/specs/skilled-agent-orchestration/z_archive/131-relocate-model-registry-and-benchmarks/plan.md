---
title: "Implementation Plan: Relocate the model registry + all model benchmarks into sk-prompt-models; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only [template:level_3/plan.md]"
description: "Migrates model-profiles.json and six benchmark sub-phases into sk-prompt-models, strips sk-prompt of all small-model coupling, and locks deep-improvement model-benchmark routing to the hub — executed as a single sequenced migration with grep verification at each stage."
trigger_phrases:
  - "model registry migration plan"
  - "sk-prompt forkable plan"
  - "benchmark hub migration"
  - "deep-improvement hub routing plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-relocate-model-registry-and-benchmarks"
    last_updated_at: "2026-06-03T04:03:34Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Plan authored post-implementation"
    next_safe_action: "Spec complete — no further action required"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-models/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-models/benchmarks/"
      - ".opencode/skills/deep-improvement/commands/auto.yaml"
      - ".opencode/skills/deep-improvement/commands/confirm.yaml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/131-relocate-model-registry-and-benchmarks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Relocate the model registry + all model benchmarks into sk-prompt-models; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JSON, Markdown, YAML, CommonJS (.cjs) |
| **Framework** | OpenCode skill system, spec-kit v2.2 |
| **Storage** | Filesystem (skill asset directories, spec folders) |
| **Testing** | `rg` grep verification, `node -e` require checks |

### Overview

This migration consolidates the model registry and all benchmark run-data into `sk-prompt-models` as a single hub. The work proceeds in three sequenced phases: first, the registry and benchmark data are moved and all cross-references repointed; second, sk-prompt is stripped of every small-model coupling and deep-improvement routing is locked to hub-only; third, grep verification confirms no dangling references remain in any active surface.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented in spec.md
- [x] Success criteria measurable (SC-001 through SC-005)
- [x] Dependencies identified: six benchmark sub-phases, ~121 cross-references, four skill surfaces

### Definition of Done
- [x] All acceptance criteria met (REQ-001 through REQ-008)
- [x] Grep verification confirms zero dangling references in active surfaces
- [x] Docs updated (spec/plan/tasks/checklist/decision-record/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Hub consolidation: move authoritative data to a single owner, then repoint all consumers.

### Key Components

- **`sk-prompt-models/assets/model-profiles.json`**: Registry hub. Owns all 8 model profile entries. Canonical path for all downstream references.
- **`sk-prompt-models/benchmarks/`**: Benchmark hub. Receives run-data from six migrated sub-phases and all future deep-improvement model-benchmark runs.
- **`sk-prompt/SKILL.md` + references**: Consumer surfaces stripped of registry pointers and small-model-specific content.
- **`deep-improvement` SKILL.md + auto/confirm YAMLs**: Routing rules updated to write to hub exclusively.

### Data Flow

Registry consumers (deep-improvement .cjs scripts, cli-opencode templates, SKILL.md references) previously read from `sk-prompt/assets/model-profiles.json`. After migration all consumers read from `sk-prompt-models/assets/model-profiles.json`. Benchmark outputs previously defaulted to spec-local directories; after migration deep-improvement writes directly to `sk-prompt-models/benchmarks/{run_label}`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt/assets/model-profiles.json` | Producer (source registry) | Deleted; content moved to hub | `find . -name model-profiles.json` returns one result only |
| `sk-prompt-models/assets/model-profiles.json` | New canonical producer | Created with full 8-profile registry | `node -e "require('./...')"` loads without error |
| `sk-prompt/references/model-profiles.md` | MD mirror of registry | Deleted outright | `find . -name model-profiles.md -path '*/sk-prompt/*'` returns zero |
| `sk-prompt/SKILL.md` | Consumer of registry path + small-model content | Stripped of all small-model/registry refs | `rg 'model-profiles\|small.model\|Budget-Awareness' sk-prompt/` zero hits |
| `sk-prompt/references/cli_prompt_quality_card.md` | Contained per-model-override note + Budget-Awareness section | Stripped | Grep clean |
| `deep-improvement/SKILL.md` | Describes model-benchmark output location | Updated to hub-only | Cites `sk-prompt-models/benchmarks/` |
| `deep-improvement/commands/auto.yaml` | Defines output_dir for model-benchmark | Repointed to hub | `grep output_dir auto.yaml` shows hub path |
| `deep-improvement/commands/confirm.yaml` | Defines output_dir for model-benchmark | Repointed to hub | `grep output_dir confirm.yaml` shows hub path |
| Six spec sub-phase benchmark dirs | Contained run-data | Gutted to doc shell + BENCHMARK-RELOCATED.md | Each dir has `BENCHMARK-RELOCATED.md` |
| ~121 cross-reference files | Cited old registry path | Repointed to hub path | `rg 'sk-prompt/assets/model-profiles'` zero hits |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Create `sk-prompt-models/assets/` directory if not present
- [x] Create `sk-prompt-models/benchmarks/` hub directory
- [x] Inventory all six benchmark sub-phases to confirm run-data locations

### Phase 2: Implementation

- [x] Copy `model-profiles.json` to hub; delete from sk-prompt/assets/
- [x] Delete `sk-prompt/references/model-profiles.md`
- [x] Strip sk-prompt SKILL.md and cli_prompt_quality_card.md of all small-model/registry references; reword Tier-2 generically
- [x] Move six benchmark sub-phases' run-data to `sk-prompt-models/benchmarks/<name>/`; write `BENCHMARK-RELOCATED.md` in each gutted sub-phase
- [x] Repoint all ~121 cross-references from old to hub path (single path-swap)
- [x] Update cli-opencode template benchmark-evidence citations to hub paths
- [x] Update deep-improvement SKILL.md, auto.yaml, and confirm.yaml to hub-only routing

### Phase 3: Verification

- [x] `rg 'sk-prompt/assets/model-profiles'` returns zero hits in active surfaces
- [x] `rg -r 'model-profiles\|small.model\|Budget-Awareness' .opencode/skills/sk-prompt/` returns zero hits (excluding changelog)
- [x] 8/8 hub profiles resolve: `node -e` require check passes
- [x] All six sub-phases have `BENCHMARK-RELOCATED.md`
- [x] deep-improvement auto.yaml + confirm.yaml cite hub path exclusively
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Grep verification | All active surfaces for dangling old registry path | `rg 'sk-prompt/assets/model-profiles'` |
| Grep verification | sk-prompt skill for any small-model reference | `rg -r 'model-profiles\|small.model\|Budget-Awareness' sk-prompt/` |
| Load test | Hub registry JSON validity | `node -e "const p=require('./hub-path'); console.log(Object.keys(p.models || p).length)"` |
| Directory listing | Six sub-phases have BENCHMARK-RELOCATED.md | `find . -name BENCHMARK-RELOCATED.md` |
| Manual | deep-improvement auto.yaml + confirm.yaml show hub output_dir | `grep output_dir` in both files |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Six benchmark sub-phase directories accessible | Internal | Green | Cannot migrate run-data without access |
| sk-prompt-models/assets/ writable | Internal | Green | Registry hub creation blocked |
| ~121 reference files in working tree | Internal | Green | Repoint operation blocked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any downstream consumer fails to load the registry from the hub path
- **Procedure**: Restore `sk-prompt/assets/model-profiles.json` from git history (`git show HEAD~1:.opencode/skills/sk-prompt/assets/model-profiles.json > restore.json`); revert cross-reference repoints via `git revert`
<!-- /ANCHOR:rollback -->

---

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ─────────────────────────────┐
                                              ├──► Phase 2 (Implementation) ──► Phase 3 (Verify)
Phase 1 (Inventory sub-phases) ──────────────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verify |
| Verify | Implementation | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 30 min |
| Core Implementation | High | 4-6 hours (121 refs + 6 sub-phases) |
| Verification | Medium | 1 hour |
| **Total** | | **5.5-7.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Git history preserved (all changes committed before final verification)
- [x] No feature flag needed (filesystem migration)
- [x] No monitoring alerts needed (no runtime service)

### Rollback Procedure
1. Run `git log --oneline -10` to identify the pre-migration commit
2. Restore registry: `git show <sha>:.opencode/skills/sk-prompt/assets/model-profiles.json > restore.json`
3. Revert cross-reference repoints: `git revert` the repoint commit
4. Verify old path resolves: `rg 'sk-prompt/assets/model-profiles' .` shows expected hits

### Data Reversal
- **Has data migrations?** No (files moved, not transformed)
- **Reversal procedure**: `git mv` in reverse; all run-data content unchanged
<!-- /ANCHOR:enhanced-rollback -->

---

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────────┐     ┌──────────────────────┐     ┌──────────────────────┐
│   Phase 1            │────►│   Phase 2             │────►│   Phase 3            │
│   Setup + Inventory  │     │   Move + Strip + Route│     │   Grep Verify        │
└──────────────────────┘     └──────────┬───────────┘     └──────────────────────┘
                                        │
                              ┌─────────▼──────────┐
                              │  Phase 2b           │
                              │  121-ref repoint    │
                              └────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Hub registry created | Setup | model-profiles.json in hub | Repoint, routing update |
| Benchmark sub-phases moved | Setup | Hub benchmark dirs | deep-improvement routing lock |
| sk-prompt stripped | Hub registry | Clean sk-prompt | Verify grep |
| 121-ref repoint | Hub registry | Updated cross-refs | Verify grep |
| deep-improvement routing | Benchmark dirs moved | Hub-only YAML | Verify routing |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Create hub registry at new path** - 30 min - CRITICAL
2. **Gut six sub-phase benchmark dirs and move to hub** - 2-3 hours - CRITICAL
3. **Repoint 121 cross-references** - 1-2 hours - CRITICAL
4. **Strip sk-prompt of small-model references** - 1 hour - CRITICAL
5. **Lock deep-improvement routing to hub** - 30 min - CRITICAL

**Total Critical Path**: 5-7 hours

**Parallel Opportunities**:
- Stripping sk-prompt (step 4) and gutting benchmark sub-phases (step 2) can run simultaneously once hub registry exists
- 121-ref repoint (step 3) can begin as soon as hub path is confirmed
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Hub Created | `model-profiles.json` at hub path, benchmarks/ dir exists | Phase 1 complete |
| M2 | Data Migrated | Six sub-phases gutted; all run-data at hub; sk-prompt stripped | Phase 2 complete |
| M3 | Verification Passed | Zero dangling refs; deep-improvement routes to hub; 8/8 profiles resolve | Phase 3 complete |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION RECORD

See `decision-record.md` for the three ratified decisions: benchmarks-to-hub wholesale, model-profiles.md deleted outright, and deep-improvement hub-only routing.

---

<!--
LEVEL 3 PLAN (~200 lines)
- Core + L2 + L3 addendums
- Dependency graphs, milestones
- Architecture decision records
-->


<!-- SCAFFOLD_AI_PROTOCOL_MARKERS:
AI EXECUTION
Pre-Task Checklist
Execution Rules
Status Reporting Format
Blocked Task Protocol
-->
