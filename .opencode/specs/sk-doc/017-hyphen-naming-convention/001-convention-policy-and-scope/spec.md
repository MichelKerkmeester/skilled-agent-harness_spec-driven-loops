---
title: "Feature Specification: convention policy and scope (017 phase 001)"
description: "There is no single authoritative statement that kebab-case (hyphens) is the canonical filesystem-naming form, nor a written exemption boundary, nor a record of the program decisions from the GPT design review. Packet 027 currently mandates the opposite for catalog/playbook content. This phase publishes the canonical co"
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
    last_updated_at: "2026-07-13T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Phase spec authored for the 017 phased tree"
    next_safe_action: "Execute this phase on the pinned worktree when picked up"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Convention policy and scope

> Phase adjacency under the 017 parent (grouping order, not a runtime dependency): predecessor `000-worktree-baseline-and-census`; successor `002-root-name-consumer-migration`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/017-hyphen-naming-convention/001-convention-policy-and-scope |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 001 of the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

There is no single authoritative statement that kebab-case (hyphens) is the canonical filesystem-naming form, nor a written exemption boundary, nor a record of the program decisions from the GPT design review. Packet 027 currently mandates the opposite for catalog/playbook content. This phase publishes the canonical convention doc + the program decision record and supersedes the 027 ADR before any logic or rename work.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The canonical kebab-case convention doc (rule + rationale) under sk-doc, linked from the create-* skills.
- The full exemption/deny-list boundary: `.py`, Python import-package dirs, vendored/third-party, generated/lockfiles, tool-mandated filenames, test-runner magic, frozen surfaces.
- The out-of-scope line: code identifiers, JSON/YAML/TOML keys, frontmatter FIELDS, DB columns keep idiomatic case; frontmatter VALUES that are paths/slugs do change.
- The frozen-history exception (append-only supersession; scope-aware zero-snake gate).
- A decision record capturing the GPT-5.6-sol review outcome and the program decisions (dual-name tolerance, dependency-closure batching, fresh-install, numbering).
- Formal supersession of the 027 underscore ADR.

### Out of Scope
- Any code or filesystem rename (later phases).
- Generator/validator changes (002/003).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A canonical convention doc states hyphens are the sole in-scope filesystem-naming form with `.py` and Python package dirs exempt | The doc exists under sk-doc and is linked from the create-* skills |
| REQ-002 | The exemption set and the identifier/key + frontmatter-value boundary are written unambiguously | Each exemption class is enumerated with an example; the frontmatter value-vs-key line is explicit |
| REQ-003 | The frozen-history exception and scope-aware gate are documented | The doc states frozen surfaces are append-only and excluded from the zero-snake gate |
| REQ-004 | A decision record supersedes the 027 underscore ADR | The 027 ADR is referenced and marked superseded |
| REQ-005 | The decision record captures the dual-name tolerance and dependency-closure batching decisions | Both decisions appear with rationale and alternatives considered |
| REQ-006 | The decision record records the fresh-install (no-symlink) and packet-numbering decisions | Both are stated with their evidence |
| REQ-007 | Python import-package directory handling is documented as exempt | The doc explains why `_`->`-` on a package dir breaks `import` |
| REQ-008 | The convention doc is the single canonical source referenced by later phases | Later phase specs point at the convention doc, not ad-hoc rules |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: One canonical convention doc is the single source of truth.
- **SC-002**: The 027 ADR is formally superseded and the program decisions are recorded.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 017 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline.
<!-- /ANCHOR:questions -->
