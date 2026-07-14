---
title: "Tasks: command-benchmark contract"
description: "Task breakdown for freezing the command-surface benchmark contract."
status: planned
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: command-benchmark contract

## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.

## Phase 1: Setup

- [ ] T001 — Regenerate the canonical command census from `sync-prompts.cjs` and record exact source/mirror counts. Evidence: `sync-prompts.cjs --check` exit 0 + frozen census snapshot.
- [ ] T002 — Enumerate every command and assign it to one of the four topologies. Evidence: taxonomy table covering the full census with zero unclassified.

## Phase 2: Implementation

- [ ] T003 — Author the topology taxonomy reference with a fail-closed rule for unclassified shapes. Evidence: taxonomy doc + rule statement.
- [ ] T004 — Document the two non-averaged verdict axes and the ownership boundary against generic document validation. Evidence: verdict-axis + ownership reference.
- [ ] T005 — Define per-phase handoff gates (evidence + exit code). Evidence: handoff-gate table referenced by downstream phase specs.

## Phase 3: Verification

- [ ] T006 — Confirm the census reproduces and the taxonomy assigns every command exactly once. Evidence: `sync-prompts.cjs --check` exit 0; taxonomy count equals census count.

## Completion Criteria

All tasks checked with evidence; the contract references are cross-linked from downstream phase specs; the
census snapshot reproduces at exit 0.

## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Consumers: children 001–008.
