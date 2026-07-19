---
title: "Feature Specification: root-name consumer migration (020 phase 002)"
description: "The catalog/playbook root + index names are consumed by a network of runtime paths, not just the classifier: the classifier is a symlink plus a real file, the Lane C loader + generator, parent-skill-check.cjs, post-edit-router.cjs, package_skill.py, and an INVERSE guard that currently rejects the hyphenated state. All "
trigger_phrases:
  - "root-name consumer migration"
  - "hyphen naming phase 002"
  - "kebab-case root name"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/020-hyphen-naming-convention"
_memory:
  continuity:
    packet_pointer: "sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration"
    last_updated_at: "2026-07-14T17:28:50Z"
    last_updated_by: "codex"
    recent_action: "Augmented the phase acceptance contract with a per-skill fail-closed coexistence matrix"
    next_safe_action: "Execute the consumer and per-skill fail-closed fixtures during the bounded coexistence window"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr_rules.md -->

# Feature Specification: Root-name consumer migration

> Phase adjacency under the 020 parent (grouping order, not a runtime dependency): predecessor `001-convention-policy-and-scope`; successor `003-create-generators-and-templates`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/020-hyphen-naming-convention/002-root-name-consumer-migration |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-13 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 002 of the 020 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The catalog/playbook root + index names are consumed by a network of runtime paths, not just the classifier: the classifier is a symlink plus a real file, the Lane C loader + generator, parent-skill-check.cjs, post-edit-router.cjs, package_skill.py, and an INVERSE guard that currently rejects the hyphenated state. All must accept the hyphenated roots — with a bounded dual-name tolerance — before the physical catalog/playbook directory renames land (per-skill in phase 008; cross-skill symlink façades in 007), or every catalog leaf silently downgrades to `readme`.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- The `validate_document.py` classifier: update the real file under `shared/scripts/` and preserve the `sk-doc/scripts/` symlink (mode 120000).
- The Lane C loader (`load-playbook-scenarios.cjs`) + generator (`playbook-generator.cjs`) hardcoded root/index names.
- `parent-skill-check.cjs`, `post-edit-router.cjs`, and `package_skill.py` root-name references.
- The inverse guard `check_no_hyphenated_catalog_content.py` + its tests, plus `test_category_classification_denumbered.py`, redefined to the hyphenated target.
- A bounded dual-name tolerance: accept both roots for reads, emit only hyphens, fail closed if both physical roots coexist.

### Out of Scope
- Renaming the physical catalog/playbook directories (per-skill in phase 008 component migration; cross-skill symlink façades and command assets in 007).
- Removing the tolerance alias (phase 009-remove-transition-aliases; transition compatibility is removed exactly once, there).
- Generator emission (003).
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every runtime consumer of the catalog/playbook root/index names accepts the hyphenated roots | A reviewed consumer manifest lists each and all are updated |
| REQ-002 | The classifier change preserves the symlink and types hyphenated leaves correctly | A hyphenated catalog leaf classifies as its typed document, not `readme`; the symlink mode stays 120000 |
| REQ-003 | A bounded dual-name tolerance accepts both roots but fails closed if both physically coexist | Both roots classify identically for reads; coexistence of both physical roots errors |
| REQ-004 | The Lane C loader + generator load unchanged against the hyphenated roots | Discovered-scenario count and IDs are unchanged |
| REQ-005 | The inverse guard and its tests are redefined to the hyphenated target | The guard rejects underscore catalog content and accepts hyphenated content |
| REQ-006 | Root-name handling is correct on POSIX and Windows-style path separators | Matrix tests pass for both separators |
| REQ-007 | Every affected skill consumer fails closed when it receives an un-migrated or unsupported root/index during coexistence | The per-skill matrix records an explicit refusal/error for every consumer row; no consumer silently returns `readme`, an empty scenario set, an unrelated category, or a guessed path |
<!-- /ANCHOR:requirements -->

### Coexistence-window fail-closed acceptance

The bounded dual-name resolver is the only compatibility boundary during this phase. It may accept an explicitly registered legacy root for reads, but a consumer must not bypass that resolver and silently reinterpret an un-migrated or unsupported root/index. For each consumer row, the verifier supplies an unsupported or un-migrated input at the consumer boundary and requires an explicit refusal, typed error, or non-zero result before classification, discovery, routing, packaging, or emission. The result must never downgrade to `readme`, an empty benchmark corpus, an unrelated category, or a guessed path.

The recognized legacy-alias case is tested separately: when a row is intentionally served through the shared resolver, old and new read inputs must produce the same typed result, and both physical roots must fail with an explicit conflict. The compatibility exception therefore remains bounded and observable rather than becoming a permissive fallback.

| Active skill family | Consumer boundary covered by the fixture | Fail-closed acceptance |
|---------------------|------------------------------------------|------------------------|
| `sk-doc` and its `create-*` packets | Classifier, create-skill packaging/init, template and guard consumers | An un-migrated root/index is refused before document typing or emission; no generic `readme` result. |
| `sk-code` and nested code packets | Post-edit routing, quality checks, and catalog/playbook path scopes | An unsupported path errors before routing; no fallback to another scope. |
| `sk-design` and nested design packets | Design catalog/playbook discovery and authoring consumers | An unsupported root/index errors before discovery; no empty or unrelated design result. |
| `sk-prompt` and `prompt-improve` | Prompt-skill playbook consumers and generated-path lookup | An un-migrated name refuses the operation; no guessed prompt path is returned. |
| `mcp-code-mode` | Manual-playbook inventory and linked workflow consumers | An unsupported playbook root produces an explicit error; no empty workflow inventory. |
| `mcp-tooling` and nested MCP packets | MCP catalog/playbook loaders and path-value consumers | An unsupported root/index fails before a tool scenario is selected or emitted. |
| `system-code-graph` | Catalog/playbook evidence and graph-facing path consumers | An un-migrated path is rejected; no graph node is attached to a guessed location. |
| `system-deep-loop` and nested deep/runtime packets | Lane C loader/generator, deep-loop dispatch, and benchmark consumers | An unsupported name errors before scenario discovery; no zero-scenario success or silent benchmark downgrade. |
| `system-skill-advisor` | Advisor inventory, playbook tests, and graph projection consumers | An un-migrated root/index refuses inventory or projection; no empty or misrouted skill result. |
| `system-spec-kit` | Manual-playbook runners, workflow invariance checks, and spec-facing consumers | An unsupported name errors before execution or fixture enumeration; no skipped or misclassified workflow. |
| `cli-external-orchestration` and nested CLI packets | CLI playbook discovery and command-facing path consumers | An un-migrated name fails before dispatch; no fallback to a different CLI packet. |

The verifier derives the final row set from the reviewed phase 002 consumer manifest. Any active family discovered by that manifest that is not listed above must be added to the matrix before the phase can pass; archived `z_archive` content remains governed by the frozen-surface exemption.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All consumers accept hyphenated catalog roots.
- **SC-002**: Dual-name tolerance lets 002 land before 007 with zero downgrade risk.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

Inherits the program-level risks in the 020 parent spec (import breakage, validator downgrade, non-reproducible builds,
over-broad sweep, exemption leakage, concurrent sessions). Phase-specific risks are enumerated in this phase's plan.md.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking; resolved during this phase's execution against the pinned baseline. Ownership boundary (recorded in the packet's
execution-parallelization-strategy.md, verified against the 008 child specs and the on-disk per-skill catalog/playbook trees):
dual-name tolerance is ADDED here in 002; the physical catalog/playbook directories are RENAMED per-skill in phase 008 (with the
cross-skill symlink façades in 007); and the transition compatibility is REMOVED exactly once in 009 — no phase removes an alias
that another phase still relies on.
<!-- /ANCHOR:questions -->
