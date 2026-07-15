---
title: "Tasks: create-benchmark conformance_benchmark family"
description: "Task breakdown for authoring the conformance_benchmark family, its guide, routing projections, authoring-command branch, and parity test."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/001-create-benchmark-conformance-family"
    last_updated_at: "2026-07-15T05:30:00Z"
    last_updated_by: "claude"
    recent_action: "Reserved conformance-family child in the renumbered decomposition"
    next_safe_action: "Author the conformance_benchmark templates, guide, routing, and parity test"
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

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Relocate duplicated create-benchmark SKILL prose into references to reclaim word budget. Evidence: package_skill.py --check word count with headroom below 5000.
- [ ] T002 — Add the conformance_benchmark FAMILIES key and the empty assets and references directories. Evidence: directories present and the family key listed in the router.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Author the four conformance_benchmark asset templates. Evidence: README, contract, lane-config, and fixture-manifest templates each passing document validation.
- [ ] T004 — Author the conformance_benchmark authoring guide holding the procedural depth. Evidence: guide passes document validation and cross-links the four templates.
- [ ] T005 — Add the SKILL family-table row, triggers, concise package section, version bump, and synchronize the README, mode-registry, hub-router, and changelog. Evidence: routing projections list the family and package_skill.py --check passes.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Add the /create:benchmark --family=conformance_benchmark authoring branch. Evidence: dry run authors and validates a package with no adapter or benchmark run.
- [ ] T007 — Add the family-parity regression test. Evidence: test passes and fails closed when an asset directory is removed.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The conformance_benchmark family is templated and routed, /create:benchmark --family=conformance_benchmark authors packages without running a benchmark, the family-parity test passes and fails closed, and package_skill.py --check passes below 5000 words.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 000-command-benchmark-contract. Successor: 002-deterministic-fixtures-oracle.
<!-- /ANCHOR:cross-refs -->
