---
title: "Implementation Plan: create-benchmark conformance_benchmark family"
description: "Plan for adding the conformance_benchmark authoring family to create-benchmark: four asset templates, an authoring guide, routing projections, a minimal /create:benchmark branch, and a family-parity test, all authoring-only with no adapter or scoring logic."
status: complete
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/001-create-benchmark-conformance-family"
    last_updated_at: "2026-07-15T06:28:57Z"
    last_updated_by: "codex"
    recent_action: "Completed the planned conformance family implementation and verification"
    next_safe_action: "Orchestrator refreshes description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
      - ".opencode/skills/sk-doc/create-benchmark/README.md"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/hub-router.json"
      - ".opencode/commands/create/benchmark.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: create-benchmark conformance_benchmark family

<!-- ANCHOR:summary -->
## 1. SUMMARY

Add the conformance_benchmark family to create-benchmark so deterministic peer-adapter conformance benchmarks are authored canonically. The change is documentation and scaffolding: four templates, a guide, routing projections, a minimal authoring-command branch, and a parity test. No scoring, adapter, reducer, or runner logic is authored here; those stay lane-owned.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- package_skill.py against create-benchmark --check PASS below 5000 words.
- All four templates and the guide pass validate_document.py and JSON blocks parse.
- Family-parity test passes and fails closed when an asset directory is removed.
- /create:benchmark --family=conformance_benchmark authors and validates without any benchmark run.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The family plugs into create-benchmark's existing runtime discriminator: a FAMILIES key selects resources beneath assets/<family>/ and references/<family>/. The templates instantiate a consuming package under the deep-alignment mode's assets/conformance_benchmark/<benchmark-id>/ tree — a README index, a benchmark contract, a lane-config, and a fixtures manifest — matching the behavior family's evidence boundary where stable contracts live with the mode and run evidence lives in the executing spec phase. The SKILL section stays concise; the authoring guide carries the step-by-step procedure and the worked mapping to this packet.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Word budget and family skeleton
Relocate duplicated SKILL prose into references to reclaim word budget, then add the FAMILIES key and the empty assets/conformance_benchmark/ and references/conformance_benchmark/ directories.

### Phase 2: Templates, guide, and routing
Author the four asset templates and the authoring guide, add the SKILL family-table row, activation triggers, and concise package section, and synchronize the README, mode-registry, hub-router, and changelog projections.

### Phase 3: Authoring command and parity test
Add the /create:benchmark --family=conformance_benchmark authoring branch and the family-parity regression test, then run the full validation gate.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Run package_skill.py --check, validate_document.py on each template and the guide, a JSON parse of each fenced lane-config and fixture-manifest block, the new family-parity test including a fail-closed check with a removed asset directory, and a /create:benchmark --family=conformance_benchmark dry run confirming authoring-only behavior.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

Depends on the contract phase for the frozen conformance-package shape and evidence-path contract. Consumed by the fixtures phase, which instantiates its fixture manifest from the template, and by the launcher phase, which loads the authored contract and lane-config.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The change is additive documentation and scaffolding; revert by removing the new family directories, the SKILL section and table row, the routing-projection edits, the authoring-command branch, and the parity test, restoring the prior four-family SKILL and version.
<!-- /ANCHOR:rollback -->
