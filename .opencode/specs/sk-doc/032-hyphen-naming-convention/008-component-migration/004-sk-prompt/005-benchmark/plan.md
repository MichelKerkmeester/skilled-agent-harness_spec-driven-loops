---
title: "Implementation Plan: sk-prompt benchmark artifact names (032 phase 004.005)"
description: "Implementation plan for phase 005 of the sk-prompt kebab-case program: rename authored benchmark directories, classify generated raw output, update active paths, and preserve benchmark semantics."
trigger_phrases:
  - "sk-prompt benchmark implementation plan"
  - "sk-prompt phase 005 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/005-benchmark"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the benchmark authored/generated path plan"
    next_safe_action: "Build the full benchmark path and disposition ledger"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/benchmark/"
      - ".opencode/skills/sk-prompt/prompt-improve/benchmark/"
      - ".opencode/skills/sk-prompt/prompt-models/benchmarks/"
      - ".opencode/skills/sk-prompt/benchmark/BENCHMARK-SUMMARY.md"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Authored candidates currently observed are live_final, router_final, and router_mode_a."
      - "Raw run/archive output is generated and must be dispositioned before any rename."
---
# Implementation Plan: sk-prompt benchmark artifact names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | Root `benchmark/`, prompt-improve `benchmark/`, and prompt-models `benchmarks/` trees |
| **Change class** | Authored artifact rename, generated-output disposition, benchmark reference closure |
| **Execution** | Isolated worktree pinned to BASE; semantic map and content-contract checks |

### Overview
The current authored path candidates are `live_final/`, `router_final/`, and `router_mode_a/`. The plan inventories
all benchmark descendants, separates authored paths from raw generated `runs/` and `runs-archive/` output, then updates
active path references while comparing benchmark IDs, payload keys, fixture/profile data, and scores with BASE.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 handoff and pinned BASE are available.
- [ ] All benchmark/benchmarks descendants are in the path ledger, including fixtures, profiles, storage guides, reports, and run output.
- [ ] Authored, generated, frozen, exempt, and tool-mandated classes are recorded before any filesystem operation.

### Definition of Done
- [ ] Authored benchmark candidates have unique kebab-case targets and active references resolve.
- [ ] Generated/frozen output is preserved with an evidence-backed disposition.
- [ ] Benchmark IDs, payload keys, profile/data keys, fixtures, and scores match BASE.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use an authored-artifact map plus a generated-output ledger. The map is path-aware and never substitutes underscores in report payloads or benchmark data keys.

### Key Components
- **Hub reports**: `benchmark/live_final/` and `benchmark/router_final/` become `live-final/` and `router-final/`.
- **Prompt-improve report**: `benchmark/router_mode_a/` becomes `benchmark/router-mode-a/`.
- **Prompt-models corpus**: inspect fixtures, variants, eval/state storage, profiles, and raw runs; preserve generated raw names such as `cidi__chunk.json` with a recorded disposition.
- **Consumers**: `BENCHMARK-SUMMARY.md`, skill/README links, report references, harness paths, and storage guides.

### Data Flow
BASE benchmark inventory → authored/generated/frozen classification → semantic path map → filesystem rename → active reference rewrite → ID/key/score parity checks.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 004 handoff and capture all three benchmark roots at BASE.
- [ ] Build the ledger for authored candidates, fixtures, profiles, storage guides, reports, runs, and archives.
- [ ] Snapshot scenario IDs, report payload keys, fixture/profile data, and score values.

### Phase 2: Implementation
- [ ] Rename authored `live_final`, `router_final`, and `router_mode_a` directories and any additional mapped authored candidates.
- [ ] Update active benchmark summaries, reports, skill/README links, harness paths, and storage-guide references.
- [ ] Preserve generated raw runs, archive names, JSON keys, fixture/profile semantics, IDs, and scores.

### Phase 3: Verification
- [ ] Re-enumerate benchmark paths and compare them with the disposition ledger.
- [ ] Resolve active paths and compare benchmark content contracts with BASE.
- [ ] Review the diff for generated-output or non-path semantic changes and record the map hash.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare authored benchmark paths with the exact source-target map |
| REQ-002 | Resolve active summary/report/skill/README/harness/storage paths and search for stale source paths |
| REQ-003 | Review every `runs/` and `runs-archive/` disposition; prove generated output was not mechanically renamed |
| REQ-004 | Compare benchmark scenario IDs, report payload keys, fixture/profile keys, and score values with BASE |
| REQ-005 | Confirm one disposition per path and a clean git-revert path for authored renames |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase inherits the 032 generated/frozen exemption and dependency-closed rename rules. It depends on `004-manual-testing-playbook`
for the shared playbook references and hands release evidence to `006-changelog-verify`; prompt-models asset filenames remain
with phase 003 even when benchmark prose mentions them.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the authored benchmark rename/reference commit(s) if a target collision, stale path, or content-contract mismatch
appears. Abort before commit on a failed generated-output classification; raw reports and archives are never rewritten as rollback work.
<!-- /ANCHOR:rollback -->
