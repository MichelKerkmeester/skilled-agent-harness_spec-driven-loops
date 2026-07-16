---
title: "Implementation Plan: sk-code benchmark artifacts (032 phase 008/007)"
description: "Plan for renaming tracked sk-code benchmark storage labels through the semantic map, repairing benchmark navigation, and proving corpus/report discovery parity without rewriting generated artifacts."
trigger_phrases:
  - "benchmark naming implementation plan"
  - "sk-code benchmark rename plan"
  - "benchmark storage path repair"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/007-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/001-sk-code/007-benchmark"
    last_updated_at: "2026-07-14T18:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark phase plan"
    next_safe_action: "Execute the tracked benchmark path rename closure"
    blockers: []
    key_files:
      - ".opencode/skills/sk-code/benchmark/README.md"
      - ".opencode/skills/sk-code/benchmark/fixtures/"
      - ".opencode/skills/sk-code/benchmark/router_final/"
      - ".opencode/skills/sk-code/benchmark/live_final/"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Implementation Plan: sk-code benchmark artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | .opencode/skills/sk-code/benchmark |
| **Change class** | Tracked storage-directory rename plus path repair |
| **Execution** | Frozen semantic map in the pinned BASE worktree |
| **Verification** | Path scan, generated-artifact comparison, corpus/report discovery, README command check |

### Overview

Classify benchmark directories and files first, then rename only the seven tracked storage labels in scope. Update benchmark/README.md and path-derived navigation while preserving renderer-owned report content and the scenario corpus from 006.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The map distinguishes tracked storage labels from generated report output.
- [ ] The 006 playbook handoff identifies the canonical corpus path and scenario count.
- [ ] BASE report/file hashes and benchmark discovery evidence are attached.

### Definition of Done

- [ ] All in-scope storage labels are kebab-case and benchmark navigation resolves.
- [ ] Generated artifacts are byte/content-equivalent and report filenames/schemas are unchanged.
- [ ] Corpus/report discovery is non-zero and equivalent to BASE.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Storage-label map**: rename d4r_live, fixtures/sk_code, live_final, live_mode_b, live_remediated, router_baseline, and router_final as explicit directory rows.
- **Navigation layer**: update benchmark/README.md, d4r_live/README.md, command output paths, and relative report links.
- **Generated boundary**: leave skill-benchmark-report.json/md and d4-ablation.json content/filenames renderer-owned unless the frozen map says a path value itself changes.
- **Parity layer**: compare path inventory, report hashes, corpus IDs, and harness discovery before and after.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load frozen map, BASE benchmark evidence, and 006 corpus-path handoff.
- [ ] Inventory all benchmark directories/files and classify tracked storage versus generated output.
- [ ] Capture report hashes, filenames, scenario IDs, command paths, and README links.

### Phase 2: Core Implementation

- [ ] Rename the seven listed storage labels to kebab-case.
- [ ] Update benchmark/README.md, d4r_live/README.md, command examples, report links, and corpus path consumers.
- [ ] Preserve report files, fixture data, schemas, and generated content exactly.

### Phase 3: Verification

- [ ] Compare final storage/file manifest and generated artifact hashes with BASE.
- [ ] Run non-zero benchmark discovery through router/live path loaders without changing reports.
- [ ] Confirm scenario IDs and corpus membership match the 006 handoff.
- [ ] Search for active old storage labels and verify exemptions/classifications.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Storage coverage | Frozen-map and path scans cover all seven labels and nested path prefixes. |
| Navigation | Resolve README command paths, report links, corpus paths, and storage navigation. |
| Artifact preservation | Compare report filenames, schemas, content hashes, fixture files, and generated-output dispositions with BASE. |
| Discovery parity | Run the benchmark loader/harness in a non-mutating mode and compare non-zero corpus/report discovery. |
| Scope safety | Verify no scenario content, identifiers, keys, exact names, Python/package, lockfile, or frozen surface changed. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 006 playbook closure | Internal | Required | The canonical benchmark corpus path is unresolved. |
| 032 frozen map | Internal | Required | Tracked versus generated storage cannot be distinguished. |
| 000 benchmark baseline | Internal | Required | Report and corpus parity cannot be proven. |
| Lane C harness | Internal | Required | Non-zero benchmark discovery cannot be checked. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Empty corpus, changed report content, stale storage path, collision, or generated-output violation.
- **Procedure**: Revert the storage-label/path batch, restore the pre-change manifest and report hashes, and rerun discovery before retrying.
<!-- /ANCHOR:rollback -->
