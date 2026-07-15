---
title: "Implementation Plan: /deep:command-benchmark launcher"
description: "Plan for the /deep:command-benchmark launcher composing the conformance and behavioral axes behind one workflow-YAML router with a generated Codex mirror and hermetic smoke, owning dispatch only."
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
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: /deep:command-benchmark launcher

<!-- ANCHOR:summary -->
## 1. SUMMARY

Ship the /deep:command-benchmark launcher composing the two already-built axes behind one workflow-YAML router. The command binds inputs, selects axis and mode, dispatches to the reused alignment engine and the matrix scheduler, and reports two non-averaged axes with instrument validity held separate from subject results. It generates its Codex mirror and passes a hermetic smoke; it implements no adapter, scoring, or scheduling.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- validate_document.py --type command and extract_structure.py pass.
- validate-command-references.cjs OK and sync-prompts.cjs --check reports the incremented mirror count.
- Hermetic smoke: conformance-only valid result, one behavior cell per topology, --axis=all reports separate axes, and a failing subject still reports INSTRUMENT=VALID.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The router lives at .opencode/commands/deep/command-benchmark.md with presentation, auto, and confirm assets beside the sibling deep-benchmark commands. The conformance axis loads the reused deep_alignment_auto.yaml with pre-bound lane_config and spec_folder, so scoping.cjs validates the sk-doc-command adapter, discovery and partitioning run, and the LEAF checks each artifact — no nested shell command. The behavioral axis calls the matrix scheduler, which drives the shared runner once per manifest cell using its real scenario, leg, and out-dir contract and owns fixture restoration, hashes, skips, and contested reruns. Evidence lands under the spec-folder alignment directory and the spec-folder evidence command-benchmark run-id directory.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Mode contract and router skeleton
Amend the deep-alignment mode contract to permit the specialized command and add the alignment alias in the system-deep-loop mode-registry, then scaffold the router with frontmatter, the blocking spec-folder input gate, and the six numbered sections.

### Phase 2: Assets and axis wiring
Author the presentation, auto, and confirm assets, wire the conformance axis to the reused alignment workflow with pre-bound inputs, wire the behavioral axis to the matrix scheduler, emit the non-averaged status line and evidence layout, and generate the Codex mirror.

### Phase 3: Hermetic smoke
Run the smoke across both axes and prove a deliberately failing subject still returns INSTRUMENT=VALID.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Command and structure validation, command-reference resolution, prompt-sync check, and a hermetic smoke covering the conformance axis on clean public fixtures, one DAB pilot cell per topology, --axis=all composition, and a deliberately failing subject that keeps INSTRUMENT=VALID distinct from subject FAIL.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends on the family phase for the authored contract and lane-config, the lane-integration phase for the registered adapter and finalized lane, the scenario-rollout phase for the DAB scenarios, and the matrix phase for the manifest and scheduler. Feeds the closeout phase, which reruns the 38-command census after the command and mirror exist.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert by removing the command, its three assets, the generated Codex mirror, the mode-registry alias, and the deep-alignment SKILL amendment, leaving the reused engines untouched.
<!-- /ANCHOR:rollback -->
