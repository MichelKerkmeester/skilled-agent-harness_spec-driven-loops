---
title: "Feature Specification: create-benchmark conformance_benchmark family — canonical authoring for deterministic peer-adapter conformance benchmarks"
description: "Adds a fifth authored create-benchmark family, conformance_benchmark, that templates the input scaffolding for deterministic artifact-conformance benchmarks run through a deep-alignment peer adapter, plus routing projections, a minimal authoring-command branch, and a family-parity regression test."
status: complete
trigger_phrases:
  - "conformance benchmark family"
  - "conformance_benchmark template"
  - "peer adapter benchmark authoring"
  - "create-benchmark conformance family"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/001-create-benchmark-conformance-family"
    last_updated_at: "2026-07-15T06:28:57Z"
    last_updated_by: "codex"
    recent_action: "Completed conformance family routing, command authoring, and parity validation"
    next_safe_action: "Orchestrator refreshes description and graph metadata"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
      - ".opencode/skills/sk-doc/create-benchmark/README.md"
      - ".opencode/skills/sk-doc/mode-registry.json"
      - ".opencode/skills/sk-doc/hub-router.json"
      - ".opencode/commands/create/benchmark.md"
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 1 -->

# Feature Specification: create-benchmark conformance_benchmark family — canonical authoring for deterministic peer-adapter conformance benchmarks

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Parent Spec** | ../spec.md |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The create-benchmark skill templates four authored benchmark families — MCP promotion, behavior, skill-benchmark, and model-benchmark — but has no family for a deterministic artifact-conformance benchmark run through a deep-alignment peer adapter. Packet 066 is the first such benchmark, and without a canonical family every future conformance benchmark would be hand-assembled from scratch. This phase makes conformance-benchmark authoring canonical: a new conformance_benchmark family that templates the package index, benchmark contract, lane-config, and fixture-manifest inputs, with procedural depth relocated into a reference guide so the packaging word ceiling is respected.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

**In scope:**
- Add the conformance_benchmark family: a FAMILIES key plus matching assets/conformance_benchmark/ and references/conformance_benchmark/ directories.
- Author four asset templates — package README index, benchmark contract, lane-config, and fixture-manifest — plus one authoring guide holding the procedural depth.
- Add the SKILL family-table row, activation triggers, a concise package section, and version bump, keeping the SKILL under the 5000-word packaging ceiling by relocating duplicated detail into references.
- Synchronize routing projections in the create-benchmark README, sk-doc mode-registry, hub-router, sk-doc SKILL and README, and a changelog entry.
- Generalize /create:benchmark with a --family=conformance_benchmark branch that authors and validates a package without invoking any adapter or benchmark run.
- Add a family-parity regression test asserting every templated family has matching assets, references, a table row, and a README entry.

**Out of scope:**
- The sk-doc-command adapter and its S1-S5 or P0/P1/P2 semantics and known-deviation contract, which belong to later phases and deep-alignment.
- Deep-alignment discovery, partitioning, convergence, reduction, and the combined two-axis scorecard.
- The reference oracle implementation and any lane-owned runner, rubric, scorer, or reducer.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

- **REQ-001 (P0):** The new family follows the create-benchmark family-add contract exactly: a FAMILIES key, matching assets and references directories, a family-table row, and a dedicated SKILL section.
- **REQ-002 (P0):** The family templates author inputs, indexes, and evidence pointers only; they must not template a runner, rubric, scorer, adapter, reducer, or generated report.
- **REQ-003 (P1):** package_skill.py --check passes with the SKILL under 5000 words, offsetting the added section by relocating duplicated prose into references.
- **REQ-004 (P1):** The /create:benchmark --family=conformance_benchmark branch authors and validates a package and then stops, never invoking an adapter or a deep-alignment run.
- **REQ-005 (P1):** A family-parity test fails closed when a FAMILIES key lacks assets, references, a table row, or a README entry, since package_skill.py does not enumerate families.
- **REQ-006 (P2):** Routing projections across the sk-doc mode-registry, hub-router, and READMEs stay synchronized with the new family and its triggers.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The four templates and the authoring guide pass document validation and every fenced JSON block parses.
- package_skill.py against create-benchmark --check passes below 5000 words.
- The family-parity test passes and fails closed on a deliberately removed asset directory.
- /create:benchmark --family=conformance_benchmark routes to authoring only, with no adapter or benchmark execution.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- SKILL word ceiling — mitigated by an explicit word-budget task relocating duplicated detail into references before adding the section.
- No packaging family enumeration — mitigated by the dedicated family-parity regression test.
- Authoring-command breadth — the conformance branch is added minimally and full six-family command parity is recorded as separate debt rather than built here.
- Dependencies: the frozen conformance-package shape and evidence-path contract from the contract phase.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. `/create:benchmark` keeps the existing MCP route and adds only the conformance branch; broader command-family parity remains outside this packet.
<!-- /ANCHOR:questions -->

## PHASE SEQUENCE

Predecessor: 000-command-benchmark-contract. Successor: 002-deterministic-fixtures-oracle.
