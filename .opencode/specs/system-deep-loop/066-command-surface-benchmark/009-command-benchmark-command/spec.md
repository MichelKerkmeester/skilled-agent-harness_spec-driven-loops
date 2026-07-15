---
title: "Feature Specification: /deep:command-benchmark — the two-axis command-surface benchmark launcher"
description: "Ships the /deep:command-benchmark workflow-YAML router that composes the deterministic conformance axis through the deep-alignment peer adapter and the behavioral DAB axis through the matrix scheduler over the shared runner behind one command, generates the Codex mirror, and passes hermetic smoke verification, without implementing adapter, scoring, or scheduling logic itself."
status: planned
trigger_phrases:
  - "command benchmark command"
  - "deep command-benchmark launcher"
  - "two-axis command benchmark launcher"
  - "run command surface benchmark"
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
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: /deep:command-benchmark — the two-axis command-surface benchmark launcher

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The two-axis command benchmark has no single entry point. Its conformance axis runs through the deep-alignment engine and its behavioral axis runs through the shared behavior runner via a matrix scheduler, but nothing composes them, binds their inputs, and reports their results without averaging. This phase ships /deep:command-benchmark, a workflow-YAML router in the deep namespace beside /deep:skill-benchmark and /deep:model-benchmark, that verifies dispatch context, binds inputs, selects the axis and mode, and dispatches to the already-shipped engines. The command owns dispatch only; it implements no adapter, scoring, or scheduling.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Author .opencode/commands/deep/command-benchmark.md as a numbered six-section router with a blocking spec-folder input gate and least-privilege allowed-tools.
- Author the three owned assets: presentation text, an auto workflow, and a confirm workflow.
- Compose the conformance axis by loading the reused alignment workflow with pre-bound lane-config and spec-folder inputs, never nesting a /deep:alignment shell invocation.
- Compose the behavioral axis by invoking the matrix scheduler over DAB-012 through DAB-027 with the shared runner's real scenario, leg, and out-dir CLI contract.
- Keep instrument validity separate from subject results in a STATUS, INSTRUMENT, CONFORMANCE, and BEHAVIOR status line, and emit the frozen evidence layout.
- Generate the Codex mirror .codex/prompts/deep-command-benchmark.md via sync-prompts and add the alignment alias in the system-deep-loop mode-registry without adding a workflow mode.
- Amend deep-alignment SKILL.md to permit this specialized command while preserving /deep:alignment as the general entry point.

**Out of scope:**
- Adapter check logic, S and D dimension rules, scoring weights, and model slugs, which stay contract and manifest owned.
- The matrix scheduler and behavior runner implementations, owned by the matrix phase and the shared framework.
- Behavior-scoring the launcher itself; it is excluded from DAB-012 through DAB-027 as instrument infrastructure and smoke-tested separately.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** The command is a workflow-YAML router with the canonical six numbered sections and a blocking input gate; markdown owns only dispatch-context verification, input binding, mode and axis selection, and target selection.
- **REQ-002 (P0):** The conformance axis reuses the existing alignment workflow with pre-bound inputs and never nests a /deep:alignment shell command or duplicates its loop.
- **REQ-003 (P0):** The final status line keeps instrument validity separate from subject results; a real subject FAIL still reports INSTRUMENT=VALID, and STATUS=FAIL is reserved for invalid or failed instrumentation.
- **REQ-004 (P1):** The Codex mirror is generated, not hand-authored, and sync-prompts.cjs --check reports the incremented mirror count.
- **REQ-005 (P1):** The launcher is excluded from DAB-012 through DAB-027 with an explicit recursion rationale and is smoke-tested separately.
- **REQ-006 (P1):** The deep-alignment mode contract and the system-deep-loop mode-registry admit the command as an alignment alias without adding a ninth workflow mode.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- validate_document.py --type command and extract_structure.py pass on the command.
- validate-command-references.cjs resolves the new YAML references and sync-prompts.cjs --check reports the incremented mirror count.
- A conformance-only smoke reaches a valid alignment result, a behavior-only smoke completes one cell per topology, and --axis=all composes both and reports separate axes.
- A deliberately failing subject still returns INSTRUMENT=VALID.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- Behavioral recursion — mitigated by excluding the launcher from the DAB suite and smoke-testing it separately.
- Self-census growth — the command adds one command, moving the deterministic corpus from 37 to 38 and requiring a discovery rerun at closeout.
- Nested-shell temptation — mitigated by binding alignment inputs directly rather than invoking /deep:alignment as a subcommand.
- Dependencies: the authored contract and lane-config, the registered adapter and lane, the DAB scenarios, and the matrix manifest and scheduler.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Whether the launcher should later gain a non-recursive --axis=conformance dry-run scenario if the operator wants it behavior-scored.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 008-bounded-command-matrix. Successor: 010-scorecard-and-closeout.
