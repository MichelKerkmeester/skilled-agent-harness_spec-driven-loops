---
title: "Feature Specification: deep command namespace naming (020 phase 008/013/002)"
description: "The deep command namespace mixes maintained workflow assets, legacy fallback bodies, and generated compiled contracts whose filenames and embedded source paths use underscores. This phase renames maintained filesystem names, preserves generated-output exemptions, and keeps deep command IDs and contract authority intact."
trigger_phrases:
  - "deep command namespace naming"
  - "kebab-case deep assets"
  - "deep command contract paths"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored deep namespace docs"
    next_safe_action: "Execute the maintained deep asset closure against the frozen map"
    blockers: []
    key_files:
      - ".opencode/commands/deep/"
      - ".opencode/commands/deep/assets/legacy/"
      - ".opencode/commands/deep/assets/compiled/README.md"
      - ".opencode/skills/system-deep-loop/runtime/scripts/compile-command-contracts.cjs"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Maintained deep assets and legacy bodies are rename candidates; compiled contract files are generated-output exemptions."
      - "Compiled contract source-digest paths must be regenerated after maintained asset paths change."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: Deep command namespace naming

> Phase adjacency under the commands component parent: predecessor `001-create-namespace`; successor `003-design-namespace`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/008-component-migration/013-commands/002-deep-namespace |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 002 of the commands-surface migration under the 020 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The maintained deep asset tree contains names such as `deep_ai-council_auto.yaml`, `deep_research_presentation.txt`, and `deep_ai-council.body.md`. The sibling `compiled/` tree contains generated contract files with the same underscore convention and embeds source paths and digests, so a raw filesystem sweep would either rename exempt output or leave generated contracts stale.

### Purpose

Rename the maintained deep workflow, presentation, and legacy fallback files to kebab-case, update their path consumers, and regenerate or verify compiled contract metadata without treating generated contract filenames as migration candidates.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- The 21 maintained files under `.opencode/commands/deep/assets/`: `deep_agent-improvement_auto.yaml`, `deep_agent-improvement_confirm.yaml`, `deep_agent-improvement_presentation.txt`; `deep_ai-council_auto.yaml`, `deep_ai-council_confirm.yaml`, `deep_ai-council_presentation.txt`; `deep_alignment_auto.yaml`, `deep_alignment_confirm.yaml`, `deep_alignment_presentation.txt`; `deep_model-benchmark_auto.yaml`, `deep_model-benchmark_confirm.yaml`, `deep_model-benchmark_presentation.txt`; `deep_research_auto.yaml`, `deep_research_confirm.yaml`, `deep_research_presentation.txt`; `deep_review_auto.yaml`, `deep_review_confirm.yaml`, `deep_review_presentation.txt`; and `deep_skill-benchmark_auto.yaml`, `deep_skill-benchmark_confirm.yaml`, `deep_skill-benchmark_presentation.txt`.
- The four maintained fallback bodies in `assets/legacy/`: `deep_ai-council.body.md`, `deep_alignment.body.md`, `deep_research.body.md`, and `deep_review.body.md`.
- Deep command, README, asset, compiler, test, and external path references; generated source-digest inputs must be updated through the supported compiler path.

### Out of Scope

- The already-compliant command markdown files under `.opencode/commands/deep/` and the `assets/compiled/README.md` document.
- Generated compiled filenames `deep_ai-council.contract.md`, `deep_alignment.contract.md`, `deep_research.contract.md`, and `deep_review.contract.md`; generated output remains an explicit 020 exemption. Their generated content may be refreshed only to reflect maintained source paths and digests.
- Deep command IDs, workflow YAML keys, contract schema fields, Python/package names, lockfiles, and frozen history.
- Other commands namespaces and the shared asset rollup owned by sibling phases.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every maintained deep asset and legacy body has one semantic target | The map lists 25 maintained source files, 25 distinct kebab-case targets, and no unknown disposition. |
| REQ-002 | Deep workflow and fallback references remain resolvable | Auto, confirm, presentation, legacy, compiler source-path, and README pointers resolve with no active old maintained path. |
| REQ-003 | Generated contract exemption is honored | The four compiled contract filenames remain exact, and regenerated source-digest paths identify the new maintained asset paths. |
| REQ-004 | Deep command behavior and IDs remain stable | Deep research, review, alignment, AI council, agent improvement, model benchmark, and skill benchmark routes retain their BASE outcomes. |
| REQ-005 | The phase produces an auditable closure | The report records maintained versus generated dispositions, compiler output evidence, reference results, and the path-scoped diff. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 25 maintained deep asset/body names are kebab-case and all active references resolve.
- **SC-002**: Generated compiled contract filenames remain exempt while their maintained source paths and digests are current.
- **SC-003**: Deep command IDs, workflow selection, fallback injection, and contract validation retain BASE semantics.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The compiled contracts include generated headers, source paths, and digests; renaming those files directly would violate the generated-output exemption, while failing to refresh their source references would create false freshness or stale injection behavior. The phase depends on the 005 rename/reference tooling, the 006 frozen map, the deep-loop compiler, and the 000 baseline; it must distinguish maintained assets from generated output before any rename batch starts.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking. The execution report must identify the compiler command and resulting contract evidence used to refresh generated source paths; no hand edit to generated sections is authorized.
<!-- /ANCHOR:questions -->
