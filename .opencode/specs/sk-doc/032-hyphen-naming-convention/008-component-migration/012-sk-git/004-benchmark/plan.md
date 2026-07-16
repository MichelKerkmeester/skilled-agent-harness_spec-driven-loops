---
title: "Implementation Plan: sk-git benchmark (032 phase 008/012/004)"
description: "Implementation plan for the sk-git benchmark profile-directory rename. The executor will move the two observed profiles, inventory report/fixture/storage-guide paths, repair exact path values, and compare benchmark evidence before and after."
trigger_phrases:
  - "sk-git benchmark implementation plan"
  - "032 benchmark profile phase plan"
  - "benchmark artifact parity plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/004-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/012-sk-git/004-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored the benchmark execution plan and evidence-parity path"
    next_safe_action: "Execute the benchmark artifact map against the pinned baseline"
    blockers: []
    key_files:
      - ".opencode/skills/sk-git/benchmark/"
      - ".opencode/skills/sk-git/SKILL.md"
      - ".opencode/skills/sk-git/README.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: sk-git benchmark

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | sk-git benchmark profiles and report artifacts |
| **Change class** | Profile-directory rename plus exact path-value rewrite |
| **Execution** | Dependency-closed, path-scoped batch on the pinned migration worktree |

### Overview
The executor will rename the two observed profile directories and inventory the four report files plus any additional fixture or storage-guide paths at BASE. It will update only exact path-valued references, then compare report schemas, keys, scenario IDs, scores, and profile discovery so the filesystem change cannot become a benchmark-data change.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] BASE SHA and benchmark-map hash are recorded.
- [ ] Profile, report, fixture, and storage-guide inventories are complete, including explicit empty categories.
- [ ] The benchmark loader and all path-valued consumers are identified.

### Definition of Done
- [ ] Both observed profile directories are renamed once or recorded as already compliant.
- [ ] All report/profile pointers resolve through kebab-case paths.
- [ ] Report data, discovery, and evidence parity checks pass.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Profile map**: maps live_glm_5.2_high to live-glm-5.2-high and live_kimi_2.7 to live-kimi-2.7.
- **Artifact census**: treats the four existing skill-benchmark-report files as already-compliant filenames and records any fixture/storage-guide paths discovered at BASE.
- **Path-value rewrite**: changes exact filesystem/path values in reports or registries while leaving JSON/YAML/TOML keys and benchmark evidence intact.
- **Parity harness**: compares profile discovery, report filenames, report schemas, scenario IDs, scores, model labels, and storage/fixture references.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Pin BASE and the benchmark-map hash.
- Inventory both profiles, all report files, nested fixture/storage-guide paths, mode/symlink metadata, and path consumers.
- Abort on collisions, duplicate profiles, missing reports, or unknown path categories.

### Phase 2: Implementation
- Rename the two profile directories through the semantic map.
- Rewrite exact benchmark path values and any SKILL.md/README.md pointers.
- Do not rename already-compliant report filenames; record explicit no-op dispositions.
- Preserve report keys, schemas, scores, IDs, labels, transcripts, modes, and symlinks.

### Phase 3: Verification
- Compare pre/post profile and report discovery.
- Resolve all benchmark path values and scan for stale source profile names.
- Compare report data and evidence outside approved path values; record commands and counts in the SOL report.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the candidate inventory with the benchmark map; verify two profiles, four reports, and explicit fixture/storage-guide dispositions. |
| REQ-002 | Run the path resolver over benchmark reports, registries, SKILL.md, README.md, and discovered guidance; require zero broken/source paths. |
| REQ-003 | Compare report JSON keys/schema, Markdown structure, scenario IDs, scores, labels, and exact path values before and after. |
| REQ-004 | Assert both profile directories contain skill-benchmark-report.json and skill-benchmark-report.md after the rename. |
| REQ-005 | Inspect the diff for keys, fields, identifiers, tool-mandated names, and sibling-surface changes. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 032 frozen map and BASE | Internal | Required | No safe classification or evidence baseline. |
| Benchmark loader/registry | Internal | Required | Profile discovery and path closure cannot be proven. |
| Phase 005 reference checker | Internal | Required | Path-value closure lacks a consistent evidence source. |
| Lane C benchmark harness | Internal | Required | Scenario and score parity cannot be measured. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Profile/report discovery drift, score or schema change, unresolved path, or out-of-scope content mutation.
- **Procedure**: Stop before commit; restore the benchmark-only directory batch from the pinned worktree, or revert the phase commit. Recreate the profile/report and evidence-parity snapshots before retrying.
<!-- /ANCHOR:rollback -->
