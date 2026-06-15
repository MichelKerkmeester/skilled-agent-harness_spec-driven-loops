---
title: "Feature Specification: Relocate the model registry + all model benchmarks into sk-prompt-small-model; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only [template:level_3/spec.md]"
description: "Relocates model-profiles.json and all benchmark run-data from scattered spec sub-phases into sk-prompt-small-model as a single authoritative hub, strips sk-prompt of small-model coupling so it can be forked as a generic framework engine, and routes deep-improvement model-benchmark outputs exclusively to the hub."
trigger_phrases:
  - "relocate model registry"
  - "model-profiles.json hub"
  - "sk-prompt forkable"
  - "benchmark hub"
  - "deep-improvement hub-only"
  - "model registry relocation"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-relocate-model-registry-and-benchmarks"
    last_updated_at: "2026-06-03T04:03:34Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Governance docs authored and validated"
    next_safe_action: "Spec complete — no further action required"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt-small-model/assets/model-profiles.json"
      - ".opencode/skills/sk-prompt-small-model/benchmarks/"
      - ".opencode/skills/deep-improvement/SKILL.md"
      - ".opencode/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/131-relocate-model-registry-and-benchmarks"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->
# Feature Specification: Relocate the model registry + all model benchmarks into sk-prompt-small-model; make sk-prompt a forkable standalone framework engine; deep-improvement writes benchmarks to the hub only

<!-- SPECKIT_LEVEL: 3 -->

---

## EXECUTIVE SUMMARY

The model registry (`model-profiles.json`) and all historical benchmark run-data lived in multiple locations — primarily inside sk-prompt and across six spec sub-phase folders — creating fragmented, hard-to-maintain state. This work consolidates the registry into `sk-prompt-small-model/assets/`, moves all benchmark outputs to `sk-prompt-small-model/benchmarks/`, strips sk-prompt of every small-model reference so it becomes a generic forkable framework engine, and locks deep-improvement's model-benchmark command to write exclusively to the hub.

**Key Decisions**: Benchmarks migrated wholesale to the hub (no per-spec copies); `model-profiles.md` deleted outright (JSON is the single source of truth); deep-improvement hub-only with no local override.

**Critical Dependencies**: All six benchmark sub-phases must be gutted to spec-kit doc shells with `BENCHMARK-RELOCATED.md` pointers before deep-improvement hub routing can be enforced without data loss.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `scaffold/131-relocate-model-registry-and-benchmarks` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`model-profiles.json` existed in `sk-prompt/assets/` even though sk-prompt-small-model is the canonical skill for per-model dispatch. Benchmark run-data (fixtures, profiles, synthesis) for six model/prompt evaluations were stored inside individual spec sub-phases, making them invisible to other sessions and impossible to cross-reference. sk-prompt contained per-model override notes, a Budget-Awareness small-model section, and a direct pointer to model-profiles.json, which prevented forking sk-prompt as a generic prompt-framework engine.

### Purpose

Establish `sk-prompt-small-model` as the single authoritative hub for the model registry and all benchmark history, and make sk-prompt a model-agnostic forkable framework engine with no small-model coupling.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Move `sk-prompt/assets/model-profiles.json` to `sk-prompt-small-model/assets/model-profiles.json`
- Delete `sk-prompt/references/model-profiles.md` (markdown mirror of the JSON registry)
- Strip sk-prompt of all small-model references: per-model override note, Budget-Awareness small-model section, model-profiles.json pointer, and Tier-2 reworded generically
- Move six benchmark sub-phases' run-data/harness/synthesis to `sk-prompt-small-model/benchmarks/<name>/`; gut each sub-phase to a spec-kit doc shell plus `BENCHMARK-RELOCATED.md` pointer
- Repoint all ~121 `model-profiles.json` references to the new hub path
- Repoint cli-opencode template benchmark-evidence citations to hub paths
- Route deep-improvement model-benchmark command outputs to `sk-prompt-small-model/benchmarks/{run_label}` (hub-only, no spec-local default, no override)

### Out of Scope

- Changes to other deep-improvement modes (agent-improvement, prompt-improvement) — those remain spec-local
- Changes to benchmark fixture content or scoring logic
- Any new benchmark runs
- sk-prompt-small-model SKILL.md narrative content (not a registry reference surface)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-prompt/assets/model-profiles.json` | Delete | Moved to sk-prompt-small-model hub |
| `sk-prompt-small-model/assets/model-profiles.json` | Create | New canonical registry location |
| `sk-prompt/references/model-profiles.md` | Delete | JSON is source of truth; MD mirror removed |
| `sk-prompt/SKILL.md` | Modify | Strip all small-model/registry references |
| `sk-prompt/references/cli_prompt_quality_card.md` | Modify | Remove per-model override note, Budget-Awareness section, model-profiles.json pointer |
| `sk-prompt/references/framework-registry.json` | No change | Generic registry, untouched |
| `sk-prompt-small-model/benchmarks/` | Create (dir) | Hub for all benchmark run-data |
| Six spec sub-phase benchmark dirs | Gut to shell + pointer | Run-data moved to hub |
| `deep-improvement/SKILL.md` | Modify | Hub-only routing for model-benchmark |
| `deep-improvement/commands/auto.yaml` | Modify | Hub-only output_dir |
| `deep-improvement/commands/confirm.yaml` | Modify | Hub-only output_dir |
| ~121 files with old registry path | Modify | Repoint to hub path |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `model-profiles.json` lives only in `sk-prompt-small-model/assets/` | `rg 'sk-prompt/assets/model-profiles' . --glob '*.md' --glob '*.json' --glob '*.yaml' --glob '*.cjs'` returns zero hits in active surfaces |
| REQ-002 | sk-prompt is grep-clean of small-model references | `rg -r 'model-profiles\|small.model\|Budget-Awareness' .opencode/skills/sk-prompt/` returns zero hits (excluding changelog) |
| REQ-003 | All 8/8 hub profile entries resolve in new location | `node -e "const p=require('./...hub-path...');console.log(Object.keys(p.models).length)"` outputs 8 |
| REQ-004 | Six benchmark sub-phases gutted to doc shells with pointers | Each gutted sub-phase directory contains `BENCHMARK-RELOCATED.md` pointing to the hub path |
| REQ-005 | deep-improvement model-benchmark writes to hub exclusively | `auto.yaml` and `confirm.yaml` output_dir is `sk-prompt-small-model/benchmarks/{run_label}`; no spec-local fallback |
| REQ-006 | All ~121 cross-references repointed | `rg 'sk-prompt/assets/model-profiles'` across full repo returns no hits in non-changelog files |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | cli-opencode template benchmark-evidence citations updated | Template files cite hub paths, not sub-phase paths |
| REQ-008 | deep-improvement SKILL.md documents hub-only routing | SKILL.md explicitly states model-benchmark outputs go to `sk-prompt-small-model/benchmarks/` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `sk-prompt` contains zero references to `model-profiles`, small-model-specific overrides, or Budget-Awareness small-model sections (grep-clean excluding changelog)
- **SC-002**: `sk-prompt-small-model/assets/model-profiles.json` exists with all 8 model profiles intact and resolving
- **SC-003**: All six benchmark sub-phases have a `BENCHMARK-RELOCATED.md` pointer and their run-data exists at the hub
- **SC-004**: deep-improvement model-benchmark command writes exclusively to `sk-prompt-small-model/benchmarks/{run_label}` in both auto and confirm modes
- **SC-005**: No dangling cross-references to the old registry path in any active surface (SKILL.md, YAML, .cjs, .md, .json)
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Six benchmark sub-phases must be gutted before deep-improvement routing locked | Benchmark data loss if routing changes before move completes | Move data first, update routing last |
| Risk | Stale cached references to old registry path in MCP memory index | Sessions may resolve the wrong path | Run `memory_index_scan` after migration to refresh |
| Risk | 121-reference repoint misses edge cases in CJS scripts | Runtime path errors in .cjs harness | Verify with `rg` post-repoint; .cjs scripts are path-agnostic |
| Risk | sk-prompt fork consumers use removed Budget-Awareness section | Forked copies break | Section removed cleanly; changelog records the removal |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Registry load remains synchronous JSON require/read; no latency regression from path change

### Security
- **NFR-S01**: No credentials or secrets in model-profiles.json (already the case; validate after move)

### Reliability
- **NFR-R01**: Hub registry must be loadable by all downstream consumers (deep-improvement .cjs scripts, cli-opencode templates, SKILL.md references) without modification beyond path repoint

---

## 8. EDGE CASES

### Data Boundaries
- Sub-phases with no run-data (only spec docs): gutted sub-phases that are already doc-only need only a `BENCHMARK-RELOCATED.md` stub with `hub_path: N/A`
- Registry with zero models: not a valid state; validate at least 8 entries after move

### Error Scenarios
- Partial migration (some sub-phases moved, others not): deep-improvement routing must not switch to hub-only until all six sub-phases are confirmed moved
- Old path still cached in MCP: `memory_index_scan` clears stale entries; `memory_search` result showing old paths is the trigger

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Files: ~135, LOC: ~500+, Systems: 4 skills + deep-improvement |
| Risk | 12/25 | No auth/API, breaking: yes (path change across 121 refs) |
| Research | 10/20 | Verified all 6 benchmark sub-phases, 8 profiles, 121 refs |
| Multi-Agent | 5/15 | Single-actor migration; no parallel workstreams |
| Coordination | 8/15 | Four skill surfaces + deep-improvement auto/confirm YAML |
| **Total** | **53/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Deep-improvement routing flips before benchmark data moved | H | L | Sequence enforced: move first, route last |
| R-002 | sk-prompt fork breaks due to removed model section | M | L | Removal is clean; changelog records it |
| R-003 | MCP memory index caches old registry path | L | M | `memory_index_scan` post-migration |

---

## 11. USER STORIES

### US-001: Model registry in one place (Priority: P0)

**As a** skill author dispatching to small models, **I want** to find `model-profiles.json` in `sk-prompt-small-model/assets/` only, **so that** I never have to check two locations for the canonical model list.

**Acceptance Criteria**:
1. Given I search the repo for `model-profiles.json`, When I run `find . -name model-profiles.json`, Then only `sk-prompt-small-model/assets/model-profiles.json` appears.

---

### US-002: sk-prompt forkable without small-model baggage (Priority: P0)

**As a** developer forking sk-prompt as a generic prompt-framework engine, **I want** no small-model-specific sections or registry pointers in SKILL.md or references, **so that** I can use sk-prompt for any model without inheriting MiMo/MiniMax-specific overrides.

**Acceptance Criteria**:
1. Given I fork sk-prompt to a new skill directory, When I grep for `model-profiles`, `small-model`, or `Budget-Awareness`, Then zero results appear.

---

### US-003: Benchmark outputs land in the hub automatically (Priority: P0)

**As a** user running `/deep:start-model-benchmark-loop`, **I want** all outputs written to `sk-prompt-small-model/benchmarks/{run_label}`, **so that** every benchmark run is immediately discoverable from the hub without manual relocation.

**Acceptance Criteria**:
1. Given I trigger a model-benchmark run, When the run completes, Then the output directory is under `sk-prompt-small-model/benchmarks/` and no files are written to the spec folder.

---

### US-004: Historical benchmarks accessible from hub (Priority: P1)

**As a** researcher comparing model performance across runs, **I want** all six historical benchmark datasets in `sk-prompt-small-model/benchmarks/`, **so that** I can compare runs without navigating individual spec sub-phase folders.

**Acceptance Criteria**:
1. Given I list `sk-prompt-small-model/benchmarks/`, When I look for the six migrated runs, Then each has its full run-data (fixtures, profiles, synthesis).

---

## 12. OPEN QUESTIONS

- None. All decisions ratified and implementation complete.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---

<!--
LEVEL 3 SPEC (~165 lines)
- Core + L2 + L3 addendums
- Executive Summary, Risk Matrix, User Stories
- Full Complexity Assessment
-->


<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
