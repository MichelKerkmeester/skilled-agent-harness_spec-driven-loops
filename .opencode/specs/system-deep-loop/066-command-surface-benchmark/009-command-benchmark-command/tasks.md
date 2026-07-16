---
title: "Tasks: /deep:command-benchmark launcher"
description: "Task breakdown for shipping the /deep:command-benchmark launcher, its three assets, the generated Codex mirror, and smoke verification."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/009-command-benchmark-command"
    last_updated_at: "2026-07-15T13:01:42Z"
    last_updated_by: "claude"
    recent_action: "Generated Codex mirror (37/37) and verified all G009 gates"
    next_safe_action: "Proceed to phase 010 scorecard and closeout"
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

`[ ]` open · `[x]` complete. Each task lists its verification evidence. All seven tasks are complete: the launcher, assets, alias, hermetic smoke, and the generated Codex mirror are in the tree and all G009 gates pass.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Amend the deep-alignment mode contract to permit the specialized command and add the alignment alias in the system-deep-loop mode-registry. Evidence: `.opencode/skills/system-deep-loop/deep-alignment/SKILL.md`; `mode-registry.json` retains 7 modes and adds `/deep:command-benchmark` only to the alignment aliases.
- [x] T002 — Scaffold the router with frontmatter, the blocking spec-folder input gate, and the six numbered sections. Evidence: `.opencode/commands/deep/command-benchmark.md`; `validate_document.py --type command` exits 0 and `extract_structure.py` reports the six canonical sections.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 — Author the presentation, auto, and confirm assets and wire the conformance axis to the reused alignment workflow with pre-bound inputs. Evidence: `.opencode/commands/deep/assets/deep_command-benchmark_{auto,confirm}.yaml` pre-bind lane config plus spec folder; `validate-command-references.cjs` exits 0 across 46 assets.
- [x] T004 — Wire the behavioral axis to the matrix scheduler over the DAB suite and emit the non-averaged status line and evidence layout. Evidence: the YAML assets call `run-command-behavior-matrix.cjs` through its frozen CLI and the presentation emits separate `STATUS`, `INSTRUMENT`, `CONFORMANCE`, and `BEHAVIOR` fields.
- [x] T005 — Generate the Codex mirror via sync-prompts. Evidence: `sync-prompts.cjs` wrote `.codex/prompts/deep-command-benchmark.md` (SHA-256 `d83a26e8…`, byte-identical to the generator's staging output) and `sync-prompts.cjs --check` reports `37 prompts are in sync`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 — Run the hermetic smoke across both axes. Evidence: `.opencode/commands/scripts/smoke-command-benchmark.cjs`; `node --check` and the direct smoke run exit 0, with conformance-only PASS, four topology cells, behavior-only reconciliation, and `all` reporting separate axes.
- [x] T007 — Prove instrument validity is separate from subject results. Evidence: the smoke resolves the instrument through the real `scoping.cjs` lane-config parser — a subject defect prints `STATUS=OK INSTRUMENT=VALID CONFORMANCE=FAIL`, while a broken lane-config prints `STATUS=FAIL INSTRUMENT=INVALID CONFORMANCE=NOT_EVALUATED`; the smoke exits 0 with zero live-model spawns.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

The launcher validates as a command, its references resolve, the Codex mirror count increments, the hermetic smoke passes across both axes, and a failing subject keeps instrument validity distinct from the subject result.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Predecessor: 008-bounded-command-matrix. Successor: 010-scorecard-and-closeout.
<!-- /ANCHOR:cross-refs -->
