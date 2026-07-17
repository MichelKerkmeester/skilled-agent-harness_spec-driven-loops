---
title: "Feature Specification: cli-external-orchestration benchmark naming (032 phase 005.006)"
description: "The cli-external-orchestration benchmark boundary currently contains only a .gitkeep marker, but the phase must protect the surface if fixtures, profiles, storage guides, reports, or generated runs are present at execution time. This phase applies the 032 authored-versus-generated naming boundary and records an explicit zero-candidate baseline."
trigger_phrases:
  - "cli-external benchmark kebab-case"
  - "benchmark fixture profile storage naming"
  - "cli-external phase 006 benchmark"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark boundary docs"
    next_safe_action: "Capture the benchmark census"
    blockers: []
    key_files:
      - ".opencode/skills/cli-external-orchestration/benchmark/"
      - ".opencode/skills/cli-external-orchestration/SKILL.md"
      - ".opencode/skills/cli-external-orchestration/README.md"
    completion_pct: 0
    open_questions:
      - "Any execution-time benchmark artifact beyond .gitkeep must be classified before mutation."
    answered_questions:
      - "The current benchmark tree contains only .gitkeep and no fixture, profile, storage-guide, report, or run candidate."
      - "Generated/lockfile output and benchmark payload/data keys remain outside filesystem renaming."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: cli-external-orchestration benchmark naming

> Phase adjacency under the cli-external-orchestration component parent: predecessor `005-manual-testing-playbook`; successor `007-changelog-verify`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/005-cli-external-orchestration/006-benchmark |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | cli-external-orchestration |
| **Origin** | Phase 006 of the cli-external-orchestration subtree under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The live `.opencode/skills/cli-external-orchestration/benchmark/` directory contains only `.gitkeep`, so there are no current fixture, profile, storage-guide, report, or run names to rename. The benchmark phase still needs an explicit boundary because artifacts may be introduced before migration execution, and generated output must not be mechanically rewritten as authored content.

This phase records the zero-candidate baseline, classifies any execution-time benchmark paths, renames only authored in-scope names, and hands a reproducible benchmark disposition to phase 007.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Census every descendant of `.opencode/skills/cli-external-orchestration/benchmark/`; the current result is `.gitkeep` only.
- If present at execution, map authored fixture, profile, storage-guide, report, index, or path directory names to kebab-case.
- Update active benchmark path references in hub skill/README/index documents and authored reports or guides.
- Classify generated runs, raw responses, retry artifacts, lockfiles, generated output, and frozen records before any rename.
- Preserve benchmark scenario IDs, fixture/profile data, report payload keys, model/data keys, and score values.

### Out of Scope
- The four manual-testing-playbook trees; phase 005 owns them.
- Non-benchmark component references/assets, root router files, code identifiers, JSON/YAML/TOML keys, frontmatter fields, Python/package names, and tool-mandated names.
- Inventing benchmark fixtures or profiles when the execution census is empty, and running a benchmark as part of this planning pass.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `benchmark/` | Inventory/bounded rename | Current tree is `.gitkeep` only; classify any execution-time authored candidates |
| Hub skill/README/index paths | Reference update | Repoint only active authored benchmark paths if candidates exist |
| Benchmark evidence | Classification record | Record authored, generated, frozen, exempt, and tool-mandated dispositions |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | The empty baseline is explicit | The pinned census records `benchmark/.gitkeep` as the only current entry and proves no fixture/profile/storage-guide/report candidate is silently omitted |
| REQ-002 [P0] | Authored execution-time names are kebab-case | Every authored in-scope benchmark candidate has a unique target and no stale source path; zero candidates is valid when evidenced |
| REQ-003 [P0] | Generated output is protected | Runs, raw responses, retries, generated/lockfile output, and frozen records have explicit dispositions and are not mechanically renamed |
| REQ-004 [P1] | Benchmark semantics are preserved | Scenario IDs, fixture/profile data, report payload keys, model/data keys, and scores match BASE; only required filesystem path values change |
| REQ-005 [P1] | Release handoff is complete | Phase 007 receives the benchmark census, map/disposition hash, path-reference result, and any execution-time finding |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The current empty benchmark boundary is recorded and any execution-time authored candidates are mapped.
- **SC-002**: Generated output and data semantics are preserved with evidence-backed dispositions.
- **SC-003**: Active authored benchmark references resolve and phase 007 receives the evidence.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is either inventing a rename for the empty current tree or treating future generated raw output as authored filesystem content. The phase depends on phase 005's playbook handoff and the 032 generated/frozen exemption; a zero-candidate census and explicit execution-time ledger prevent both errors.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The verifier must record whether any benchmark artifact appears between authoring and execution; it must not infer a candidate from the directory name alone.
<!-- /ANCHOR:questions -->

