---
title: "Feature Specification: sk-prompt benchmark artifact names (032 phase 004.005)"
description: "The sk-prompt benchmark surface contains underscore-separated authored result directories such as live_final, router_final, and router_mode_a, plus generated raw-run filenames with double underscores. This phase renames authored benchmark paths, updates path references, and records generated/frozen output dispositions without changing benchmark payload keys, fixtures, profiles, or scores."
trigger_phrases:
  - "sk-prompt benchmark kebab-case"
  - "benchmark artifact filename rename"
  - "sk-prompt phase 005 naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the benchmark artifact packet from all sk-prompt benchmark trees"
    next_safe_action: "Build the authored/generated benchmark path ledger after phase 004 handoff"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/benchmark/live_final/"
      - ".opencode/skills/sk-prompt/benchmark/router_final/"
      - ".opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/"
      - ".opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md"
      - ".opencode/skills/sk-prompt/prompt-models/benchmarks/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The authored underscore-separated benchmark directories currently observed are live_final, router_final, and router_mode_a."
      - "Raw files under prompt-models benchmark runs and runs-archive are generated output and require disposition, not blind renaming."
      - "The prompt-models asset model_profiles.json is owned by phase 003 because it is outside a benchmark tree."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: sk-prompt benchmark artifact names

> Phase adjacency under the sk-prompt component parent (grouping order, not a runtime dependency): predecessor `004-manual-testing-playbook`; successor `006-changelog-verify`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-prompt |
| **Origin** | Phase 005 of the sk-prompt component subtree under the 032 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The hub benchmark stores result reports under `live_final/` and `router_final/`, while the prompt-improve benchmark stores
its report under `router_mode_a/`. The prompt-models benchmark tree also contains generated raw-run names such as
`cidi__chunk.json`; treating authored artifacts and generated output identically would either leave active paths broken
or violate the program's generated-output exemption. This phase separates those classes and closes benchmark references safely.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Rename `.opencode/skills/sk-prompt/benchmark/live_final/` to `live-final/` and `router_final/` to `router-final/`.
- Rename `.opencode/skills/sk-prompt/prompt-improve/benchmark/router_mode_a/` to `router-mode-a/`.
- Inventory all `benchmark/` and `benchmarks/` descendants for fixture, profile, storage-guide, report, and path-valued names; rename any authored in-scope snake_case path found by the frozen map.
- Update active benchmark summaries, skill/README references, report links, harness path values, and storage-guide references.
- Preserve benchmark scenario IDs, fixture semantics, profile/data keys, report payload keys, and score values.

### Out of Scope
- Raw generated output under benchmark `runs/` and `runs-archive/`, including filenames such as `cidi__chunk.json` and retry/failure artifacts; classify and preserve them under the generated-output exemption unless the frozen map proves otherwise.
- `prompt-models/assets/model_profiles.json` and other non-benchmark packet assets; phase 003 owns those names.
- Changelog/frozen-history prose, code identifiers, JSON/YAML/TOML keys, frontmatter fields, Python/package names, and tool-mandated filenames.
- Re-running or re-baselining the benchmark as part of the rename phase; phase 007/central gates own aggregate evidence.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `sk-prompt/benchmark/live_final/` | Rename | `live-final/`; preserve report files and payload content |
| `sk-prompt/benchmark/router_final/` | Rename | `router-final/`; preserve report files and payload content |
| `prompt-improve/benchmark/router_mode_a/` | Rename | `router-mode-a/`; preserve the benchmark report and path semantics |
| `sk-prompt/benchmark/`, `prompt-improve/benchmark/`, `prompt-models/benchmarks/` | Inventory/reference update | Rename authored snake_case artifact paths and record generated/frozen output dispositions |
| Benchmark summaries, skill docs, READMEs, reports, and storage/path guides | Reference update | Repoint active path values without changing result keys or scores |
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 [P0] | Authored benchmark path names are kebab-case | `live_final`, `router_final`, and `router_mode_a` have exact hyphenated targets, plus any additional authored candidates found by the full ledger |
| REQ-002 [P0] | Active benchmark path references resolve | Summaries, reports, skill/README links, harness paths, and storage-guide references contain no stale active source path |
| REQ-003 [P0] | Generated benchmark output is classified correctly | `runs/`, `runs-archive/`, raw response names, retry artifacts, and generated payloads have explicit generated/frozen dispositions and are not mechanically rewritten |
| REQ-004 [P1] | Benchmark semantics are preserved | Fixture IDs, profile/data keys, report payload keys, scenario IDs, and score values match BASE; only filesystem path values change |
| REQ-005 [P1] | The phase map is complete and reversible | Every benchmark path has one rename/exempt/generated/frozen/tool-mandated disposition and the authored map supports a git revert |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Authored benchmark directories use kebab-case and all active benchmark path references resolve.
- **SC-002**: Generated output is explicitly preserved, and benchmark fixtures, profile/data keys, IDs, and scores remain unchanged.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The primary risk is treating generated raw runs as authored filesystem names or changing result payload keys while
rewriting paths. The phase depends on the playbook handoff and the program's generated/frozen exemptions; a full
benchmark ledger, JSON key comparison, and report/path resolution checks provide the guardrail.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; the verifier must record whether any new authored fixture/profile/storage-guide candidate appears in the pinned benchmark tree before execution.
<!-- /ANCHOR:questions -->
