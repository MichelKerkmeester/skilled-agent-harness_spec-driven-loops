---
title: "Checklist: Write-Set Conflict Graph"
description: "Checklist for the 004-write-set-conflict-graph child of the phase-012 shared mode contracts and fixtures parent: verify the phase-013 write-set conflict graph, hard ordering, safe parallelism, and orchestrator contract."
trigger_phrases:
  - "write-set conflict graph checklist"
  - "phase-013 graph verification"
  - "deep-loop lane conflict checklist"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/012-shared-mode-contracts-and-fixtures/004-write-set-conflict-graph"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Executed the local graph, drift, fence, determinism, and evidence verification suite"
    next_safe_action: "Run the independent verifier against the sealed graph inputs"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts"
      - ".opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/scheduler.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts"
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Checklist: Write-Set Conflict Graph

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for phase 012's `004-write-set-conflict-graph` child. Every item is a check the paired verify agent runs
before the graph is accepted as the phase-013 orchestration input; each report pins the BASE identity, graph source
digests, graph schema version, graph digest, commands, exit codes, node/edge counts, lane decisions, and unexpected
tracked mutation. A `serial-single-writer` fallback is a refusal receipt that prevents widening, not evidence that the
graph is complete or that the phase gate is green.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The frozen graph sources are pinned and their digests bind the graph [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:43]
- [x] CHK-002 [P0] The node set exactly matches all eight `mode_workstreams_phase_013` entries [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:145]
- [x] CHK-003 [P1] The shipped-mode census sources and graph schema version are recorded in the executable graph [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/shipped-census.ts:16]
- [x] CHK-004 [P2] This child retains `depends_on: []`; sibling adjacency remains navigation-only [File: spec.md:59]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-005 [P0] Graph resources use canonical identities and distinguish access, state, locks, fixtures, outputs, and immutable inputs [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/types.ts:20]
- [x] CHK-006 [P0] Every conflict edge names its type, resources, effect, reason, and source evidence [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/types.ts:124]
- [x] CHK-007 [P1] Unknown, stale, aliased, and contradictory evidence fails closed and cannot be omitted as safe [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/canonicalize.ts:107]
- [x] CHK-008 [P2] Policy preserves `serial-single-writer` as the fallback and stable ordering after validation [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/scheduler.ts:93]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-009 [P0] Missing, duplicate, renamed, and extra manifest nodes fail validation [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:102]
- [x] CHK-010 [P0] Resource normalization catches aliases, canonical collisions, and path ancestor/descendant overlap [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:203]
- [x] CHK-011 [P0] Write-write and symmetric write-read fixtures emit evidence and separate conflicting lanes [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:153]
- [x] CHK-012 [P0] Common is a dedicated hard predecessor of all three variants [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:260]
- [x] CHK-013 [P0] Review and alignment are fenced through both canonical review-loop aliases [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:280]
- [x] CHK-014 [P0] Research/council independence is accepted only while actual mutable sets are disjoint [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:340]
- [x] CHK-015 [P0] Incomplete, stale, unresolved, contradictory, unknown, or cyclic evidence returns serial fallback or refusal [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/scheduler.ts:93]
- [x] CHK-016 [P0] Equivalent reordered sealed inputs produce the same digest and schedule evidence [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:390]
- [x] CHK-017 [P0] Changed source digests or declarations reject old graphs before orchestration [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:467]
- [x] CHK-018 [P0] Every decision records predecessors, conflicts, fences, source digest, class, and reason [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:430]
- [x] CHK-019 [P1] Incomplete evidence cannot widen parallelism based on distinct node names [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:128]
- [x] CHK-027 [P0] Trailing-slash-equivalent file writers and readers derive conflict edges, while true prefixes remain conflicting [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:263]
- [x] CHK-028 [P0] Shared-state access outside `read` or `write` emits a validation issue and global serial fallback [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:333]
- [x] CHK-029 [P0] Valid shared-state writers and readers still derive write-write and write-read conflicts [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:370]
- [x] CHK-030 [P0] ASCII-case-only path identities become unresolved aliases and cannot grant parallel safety [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:398]
- [x] CHK-031 [P1] Unrecognized mutability normalizes to unknown and forces conservative scheduling [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:435]
- [x] CHK-032 [P0] The unchanged shipped declarations still keep genuinely independent research and council work parallel [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:583]
- [x] CHK-033 [P0] NFC and NFD spellings of one filename derive a conflict and cannot share a lane [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:435]
- [x] CHK-034 [P1] Genuinely different Unicode filenames remain parallel-safe [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:475]
- [x] CHK-035 [P0] Empty, `.` and `/` path spellings canonicalize to one namespace root and conflict [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:517]
- [x] CHK-036 [P0] The honest shipped research/council control remains parallel-safe after path hardening [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:583]
- [x] CHK-037 [P0] The 16-case case × trailing-slash × NFC/NFD × root/non-root matrix never permits same-path writers to share a lane [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:459]
- [x] CHK-038 [P1] Different filenames, NFKC-only ligature variants, and different accented filenames remain parallel-safe [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:513]
- [x] CHK-039 [P0] The pure-ASCII case-plus-trailing-slash repro emits unresolved-alias fallback and cannot share a lane [File: .opencode/skills/system-deep-loop/runtime/tests/unit/write-set-conflict-graph.vitest.ts:513]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-020 [P1] The graph cites every frozen contract and shipped census source used for derivation [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/graph.ts:195]
- [x] CHK-021 [P1] Output distinguishes derived conflicts, hard order, fences, explicit independence, and fallback [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/types.ts:124]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-022 [P2] Graph evidence contains source paths and digests only; no credential, live secret, or unsealed payload is included [File: .opencode/skills/system-deep-loop/runtime/lib/write-set-conflict-graph/types.ts:46]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-023 [P2] The frozen `spec.md` remains unchanged; `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` reflect the local outcome [File: implementation-summary.md:1]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-024 [P1] Task-owned changes are limited to the new graph library, its unit test, and leaf-local docs/metadata [File: implementation-summary.md:79]
- [x] CHK-025 [P1] The additive graph change can be removed without touching shipped modes; runtime fallback remains serial-single-writer [File: plan.md:151]
- [ ] CHK-026 [P0] The independent verifier has accepted the digest-bound graph schedule as a phase-013 orchestration input
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

Local implementation evidence is ready when every graph, constraint, drift, determinism, and receipt check passes, the
report pins source and graph digests, and no stale or incomplete evidence widens phase-013 parallelism. Phase completion
still requires CHK-026; a conservative fallback cannot satisfy that sign-off.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 contract, the graph schedule is digest-bound, and
`git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
