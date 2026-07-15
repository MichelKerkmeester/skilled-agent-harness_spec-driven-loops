---
title: "Tasks: create-benchmark conformance_benchmark family"
description: "Task breakdown for authoring the conformance_benchmark family, its guide, routing projections, authoring-command branch, and parity test."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/001-create-benchmark-conformance-family"
    last_updated_at: "2026-07-15T06:28:57Z"
    last_updated_by: "codex"
    recent_action: "Completed all conformance family tasks with verification evidence"
    next_safe_action: "Orchestrator refreshes description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
      - ".opencode/skills/sk-doc/create-benchmark/README.md"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/hub-router.json"
      - ".opencode/commands/create/benchmark.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: create-benchmark conformance_benchmark family

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is complete.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Relocate duplicated create-benchmark SKILL prose into references to reclaim word budget. Evidence: [EVIDENCE: `package_skill.py --check` passes at 4,972 words, down from 4,993, after delegating a 411-word block to the existing behavior guide.]
- [x] T002 — Add the conformance_benchmark FAMILIES key and the empty assets and references directories. Evidence: [EVIDENCE: `FAMILIES` lists `conformance_benchmark` after `behavior_benchmark`, and both registered resource directories exist.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Author the four conformance_benchmark asset templates. Evidence: [EVIDENCE: `validate_document.py --type readme` exits 0 for 4/4 pre-authored templates, and 2/2 fenced JSON values parse.]
- [x] T004 — Author the conformance_benchmark authoring guide holding the procedural depth. Evidence: [EVIDENCE: `validate_document.py --type readme` exits 0 with zero issues for the preserved pre-authored guide.]
- [x] T005 — Add the SKILL family-table row, triggers, concise package section, version bump, and synchronize the README, mode-registry, hub-router, and changelog. Evidence: [EVIDENCE: `json.tool` parses both registries, SKILL validation exits 0, and packaging passes at 4,972 words.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Add the /create:benchmark --family=conformance_benchmark authoring branch. Evidence: [EVIDENCE: `yaml.safe_load` parses 2/2 workflows, and static branch assertions prove four outputs, validation, termination, and retained MCP promotion.]
- [x] T007 — Add the family-parity regression test. Evidence: [EVIDENCE: `test_create_benchmark_family_registry.py` passes for 7/7 families; removing the conformance asset directory produces a nonzero assertion before restoration.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The conformance_benchmark family is templated and routed, /create:benchmark --family=conformance_benchmark authors packages without running a benchmark, the family-parity test passes and fails closed, and package_skill.py --check passes below 5000 words.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 000-command-benchmark-contract. Successor: 002-deterministic-fixtures-oracle.
<!-- /ANCHOR:cross-refs -->
