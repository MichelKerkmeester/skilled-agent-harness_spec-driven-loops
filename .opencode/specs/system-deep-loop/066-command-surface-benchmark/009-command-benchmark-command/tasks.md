---
title: "Tasks: /deep:command-benchmark launcher"
description: "Task breakdown for shipping the /deep:command-benchmark launcher, its three assets, the generated Codex mirror, and smoke verification."
status: planned
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/009-command-benchmark-command"
    last_updated_at: "2026-07-15T05:30:00Z"
    last_updated_by: "claude"
    recent_action: "Reserved launcher child in the renumbered decomposition"
    next_safe_action: "Ship /deep:command-benchmark with assets, Codex mirror, and hermetic smoke"
    blockers: []
    key_files:
      - ".opencode/commands/deep/command-benchmark.md"
      - ".opencode/skills/system-spec-kit/scripts/codex/sync-prompts.cjs"
      - ".opencode/skills/system-deep-loop/deep-alignment/SKILL.md"
      - ".opencode/skills/system-deep-loop/mode-registry.json"
      - ".opencode/commands/scripts/validate-command-references.cjs"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Tasks: /deep:command-benchmark launcher

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task lists its verification evidence. This child is Planned; all tasks are open.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 — Amend the deep-alignment mode contract to permit the specialized command and add the alignment alias in the system-deep-loop mode-registry. Evidence: SKILL amendment and alias present with no new workflow mode.
- [ ] T002 — Scaffold the router with frontmatter, the blocking spec-folder input gate, and the six numbered sections. Evidence: validate_document.py --type command structural pass.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T003 — Author the presentation, auto, and confirm assets and wire the conformance axis to the reused alignment workflow with pre-bound inputs. Evidence: validate-command-references.cjs resolves the new references.
- [ ] T004 — Wire the behavioral axis to the matrix scheduler over the DAB suite and emit the non-averaged status line and evidence layout. Evidence: dry invocation resolves the scheduler and status contract.
- [ ] T005 — Generate the Codex mirror via sync-prompts. Evidence: sync-prompts.cjs --check reports the incremented mirror count.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T006 — Run the hermetic smoke across both axes. Evidence: conformance-only valid result, one behavior cell per topology, and --axis=all reporting separate axes.
- [ ] T007 — Prove instrument validity is separate from subject results. Evidence: a deliberately failing subject returns INSTRUMENT=VALID with a real subject FAIL.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The launcher validates as a command, its references resolve, the Codex mirror count increments, the hermetic smoke passes across both axes, and a failing subject keeps instrument validity distinct from the subject result.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 008-bounded-command-matrix. Successor: 010-scorecard-and-closeout.
<!-- /ANCHOR:cross-refs -->
