---
title: "Implementation Plan: prompt-models asset and reference names (032 phase 004.003)"
description: "Implementation plan for phase 003 of the sk-prompt kebab-case program: rename eight prompt-models asset/reference files, update active consumers, preserve JSON data semantics, and exclude benchmark output."
trigger_phrases:
  - "prompt-models asset and reference implementation plan"
  - "sk-prompt phase 003 plan"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/003-prompt-models"
_memory:
  continuity:
    packet_pointer: "sk-doc/032-hyphen-naming-convention/008-component-migration/004-sk-prompt/003-prompt-models"
    last_updated_at: "2026-07-14T18:04:33Z"
    last_updated_by: "codex"
    recent_action: "Authored the prompt-models asset/reference implementation plan"
    next_safe_action: "Build the eight-entry path map and capture JSON key baselines"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/prompt-models/SKILL.md"
      - ".opencode/skills/sk-prompt/prompt-models/README.md"
      - ".opencode/skills/sk-prompt/prompt-models/assets/"
      - ".opencode/skills/sk-prompt/prompt-models/references/"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Benchmark trees and changelog history are adjacent-phase boundaries."
---
# Implementation Plan: prompt-models asset and reference names

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | `.opencode/skills/sk-prompt/prompt-models/` assets and references |
| **Change class** | Kebab-case filesystem rename, active reference closure, JSON contract check |
| **Execution** | Isolated worktree pinned to BASE; semantic map with generated-output exclusions |

### Overview
The packet has four underscore-separated asset/data filenames and four underscore-separated reference filenames. The
plan records the JSON key/model baseline before renaming, updates active path values, then parses the target files and
compares their data contract while leaving benchmark output to phase 005.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 002 handoff and pinned baseline are available.
- [ ] Eight source paths and their kebab-case targets are recorded.
- [ ] JSON key/model snapshots and benchmark/changelog exclusions are recorded.

### Definition of Done
- [ ] All eight source paths have moved to their mapped targets.
- [ ] Active skill, README, model-reference, and packet-local links resolve.
- [ ] Target JSON files parse with the original key and model-ID contract.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Use a semantic path map plus a content-contract snapshot. Rename path segments only; treat JSON keys and model IDs as data, not filenames.

### Key Components
- **Assets and data**: `cli_prompt_quality_card.md`, `confidence_scoring_rubric.md`, `model_profiles.json`, and `per_model_budgets.json`.
- **References**: `context_budget.md`, `output_verification.md`, `pattern_index.md`, and `quota_fallback.md`.
- **Consumers**: `SKILL.md`, `README.md`, model-specific Markdown profiles, and active cross-reference links.

### Data Flow
Path/key baselines → eight-entry map → filesystem rename → active path rewrite → JSON parse/key comparison → stale-source and scope audit.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm phase 002 handoff and capture the prompt-models tree at BASE.
- [ ] Record the eight source/target pairs and snapshot JSON keys/model IDs.
- [ ] Mark benchmark, changelog, `_index.md`, Python, package, and tool-mandated exclusions.

### Phase 2: Implementation
- [ ] Rename the four assets/data files and four references.
- [ ] Update active `SKILL.md`, `README.md`, model-profile, and reference path values.
- [ ] Leave JSON keys, model IDs, prose identifiers, and generated benchmark output unchanged.

### Phase 3: Verification
- [ ] Confirm all eight targets exist and no in-scope source path remains.
- [ ] Parse target JSON files and compare key/model snapshots.
- [ ] Resolve active links and prove the diff excludes benchmark output and changelog history.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Enumerate assets/references and compare exact source/target pairs |
| REQ-002 | Search active packet docs for stale names and resolve all new links/path values |
| REQ-003 | Parse both JSON targets and compare sorted key paths, model IDs, and cross-reference values |
| REQ-004 | Review the disposition ledger for benchmark, changelog, `_index.md`, Python/package, tool-mandated, and key tokens |
| REQ-005 | Run path/reference checks and confirm the map is bijective and reversible |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The phase inherits the program convention, exemption set, and pinned-worktree rules. It depends on `002-prompt-improve`
for sibling phase sequencing and hands its benchmark boundary to `005-benchmark`; phase 006 later verifies release
records without rewriting this packet's frozen history.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the path-scoped rename/reference commit(s) if any target collision, JSON mismatch, or unresolved active link is
found. Abort before commit on a failed preflight; no generated benchmark output or persistent data is altered.
<!-- /ANCHOR:rollback -->
