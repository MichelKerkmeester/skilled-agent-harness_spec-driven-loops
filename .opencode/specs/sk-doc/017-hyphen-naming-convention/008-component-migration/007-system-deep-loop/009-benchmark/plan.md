---
title: "Implementation Plan: system-deep-loop benchmark storage names (017 phase 007/009)"
description: "Plan for renaming the three root benchmark storage labels, repairing report/index path values, and proving fixture/profile and generated-output ownership without changing report filenames, payloads, or scores."
trigger_phrases:
  - "system-deep-loop benchmark implementation plan"
  - "benchmark storage rename plan"
  - "deep loop benchmark report path closure"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/008-component-migration/007-system-deep-loop/009-benchmark"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored benchmark phase plan"
    next_safe_action: "Execute the root benchmark rename closure"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: System-deep-loop benchmark storage names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/system-deep-loop/benchmark/` |
| **Change class** | Authored storage-directory rename plus path/reference repair |
| **Execution** | Isolated worktree using the pinned BASE, benchmark manifest, and frozen map |
| **Verification** | Report/path integrity, scenario discovery, D5 connectivity, and output ownership |

### Overview

Rename `after_d3_proxy/`, `live_mode_b/`, and `router_mode_a/` to their exact kebab-case targets. Preserve `baseline/`, the already-kebab report filenames, and report payloads; update README and runner path values; and record that deep-improvement fixture/profile paths are owned by phase 006.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [ ] The root benchmark manifest records the three storage candidates, baseline, reports, and active consumers.
- [ ] Generated report and deep-improvement fixture/profile ownership is attached.
- [ ] BASE scenario/report counts, trace modes, scores, and D5 results are captured.

### Definition of Done

- [ ] The three storage labels and active path consumers are kebab-clean and resolvable.
- [ ] Report presence, payloads, scenario IDs, scores, and connectivity match BASE.
- [ ] Generated-output and component-owned paths are not moved or rewritten under this child.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Storage layer**: rename only the three authored parent directories; preserve baseline and report filenames.
- **Consumer layer**: update README, runner output paths, baseline comparison paths, and storage-guide references.
- **Ownership layer**: classify deep-improvement fixture/profile assets and generated reports separately from root storage.
- **Data boundary**: preserve report JSON/Markdown content, keys, scenario IDs, trace modes, and score semantics.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [ ] Load the root benchmark map, BASE report manifest, README/runner references, and output ownership list.
- [ ] Record every report's parent label, trace mode, scenario count, verdict, and score.

### Phase 2: Core Implementation

- [ ] Rename `after_d3_proxy`, `live_mode_b`, and `router_mode_a` to `after-d3-proxy`, `live-mode-b`, and `router-mode-a`.
- [ ] Update README, benchmark commands, baseline comparisons, and storage path values.
- [ ] Preserve report files/payloads and leave deep-improvement fixtures/profiles and generated output under their owning dispositions.

### Phase 3: Verification

- [ ] Compare report manifests, payload hashes/content, scenario IDs, scores, and trace modes with BASE.
- [ ] Resolve all README/runner/storage references and run root benchmark discovery.
- [ ] Run D5 connectivity and ensure the result is non-zero and equivalent.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| Storage coverage | Map scan reports all three directories once and no old active storage path. |
| Report integrity | Parse/compare every JSON/Markdown report and preserve scenario IDs, trace modes, scores, and verdicts. |
| Reference integrity | Resolve README, runner, baseline, and storage-guide path values. |
| Benchmark parity | Run router/live discovery and D5 connectivity with non-zero corpus. |
| Ownership safety | Check deep-improvement fixture/profile and generated-output dispositions, report filenames, keys, and frozen history. |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Impact if Blocked |
|------------|------|-------------------|
| Root playbook phase | Sibling | Scenario corpus and D5 connectivity cannot be compared. |
| Deep-improvement ownership map | Sibling | Fixture/profile paths could be moved twice or omitted. |
| BASE benchmark manifest | Internal | Report and score parity cannot be demonstrated. |
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Missing report, changed payload/score, stale benchmark path, zero discovery, or ownership collision.
- **Procedure**: Revert only the root benchmark storage batch, restore the report manifest, and rerun discovery/parity checks before retrying.
<!-- /ANCHOR:rollback -->
