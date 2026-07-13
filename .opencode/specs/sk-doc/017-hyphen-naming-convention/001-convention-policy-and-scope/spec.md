---
title: "Feature Specification: convention policy and scope (019 phase 001)"
description: "There is no single authoritative statement that kebab-case (hyphens) is the canonical filesystem-naming form, nor a written exemption boundary. Packet 027 currently mandates the opposite (underscore) for catalog/playbook content. The program needs one canonical convention doc and a decision record that supersedes the 0"
trigger_phrases:
  - "convention policy and scope"
  - "hyphen naming phase 001"
  - "kebab-case convention policy"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/017-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/017-hyphen-naming-convention/001-convention-policy-and-scope"
    last_updated_at: "2026-07-13T11:44:19Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec scaffolded from the 019 decomposition"
    next_safe_action: "Plan this phase when it is picked up for execution"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Convention policy and scope

> Phase adjacency under the 019 parent (grouping order, not a runtime dependency): predecessor none (first phase); successor `002-sk-doc-validator-and-classifier-logic`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/001-convention-policy-and-scope |
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 001 of the 019 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

There is no single authoritative statement that kebab-case (hyphens) is the canonical filesystem-naming form, nor a written exemption boundary. Packet 027 currently mandates the opposite (underscore) for catalog/playbook content. The program needs one canonical convention doc and a decision record that supersedes the 027 ADR before any logic or rename work begins.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The canonical kebab-case convention doc (rule + rationale) under sk-doc.
- The full exemption set: `.py`, vendored/third-party, generated/lockfiles, tool-mandated filenames.
- The explicit out-of-scope line: code identifiers, JSON/YAML keys, frontmatter fields, DB columns keep idiomatic case.
- A decision record formally superseding the 027 underscore ADR.

### Out of Scope
- Any code or filesystem rename (later phases).
- Generator/validator changes (002/003).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A canonical convention doc states hyphens are the sole in-scope filesystem-naming form with `.py` exempt | Doc exists under sk-doc and is linked from the create-* skills |
| REQ-002 | The exemption set and the identifier/key out-of-scope boundary are written unambiguously | Each exemption class is enumerated with an example |
| REQ-003 | A decision record supersedes the 027 underscore ADR | The 027 ADR is referenced and marked superseded |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One canonical convention doc is the single source of truth.
- **SC-002**: The 027 ADR is formally superseded.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 019 parent spec (import breakage, validator downgrade, over-broad sweep,
exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md when it is planned.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking at scaffold time; resolved during this phase's planning.
<!-- /ANCHOR:questions -->
