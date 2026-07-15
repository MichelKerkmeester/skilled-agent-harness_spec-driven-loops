---
title: "Feature Specification: command asset and reference closure (017 phase 008/013/009)"
description: "Reconcile residual command-surface asset, reference, and template files after namespace ownership is frozen; rename only unassigned snake_case files and update every proven pointer without duplicating sibling work."
trigger_phrases:
  - "command asset reference closure"
  - "command template filename migration"
  - "residual command asset naming"
importance_tier: "important"
contextType: "planning"
parent: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets"
    last_updated_at: "2026-07-14T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Authored command asset docs"
    next_safe_action: "Reconcile residual asset ownership"
    blockers: []
    key_files:
      - ".opencode/commands/"
      - "008-component-migration/013-commands/001-create-namespace"
      - "008-component-migration/013-commands/002-deep-namespace"
      - "008-component-migration/013-commands/004-doctor-namespace"
    completion_pct: 0
    open_questions:
      - "Whether the post-sibling inventory contains any unassigned maintained asset or template file."
    answered_questions:
      - "Namespace-owned workflow assets belong to phases 001–007, not a second rename here."
      - "Generated contracts, tool manifests, and negative fixtures retain their exact names or content under their documented boundaries."
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: command asset and reference closure

> Phase adjacency under the commands component parent: predecessor `008-loose-command-ids`; successor `010-commands-gate`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | sk-doc/019-hyphen-naming-convention/008-component-migration/013-commands/009-command-assets |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-14 |
| **Owner skill** | sk-doc |
| **Origin** | Phase 009 of the commands-surface migration under the 017 kebab-case filesystem-naming program |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The commands surface stores workflow, presentation, legacy, compiled, fixture, and reference-like files under several namespace asset directories. Phases 001–007 own the direct namespace migrations, while phase 008 owns loose root files. Without a residual pass, an unassigned maintained asset or a pointer to a renamed asset can escape the map; with an unbounded pass, two phases can rename the same file or rewrite exact tool data.

### Purpose

Reconcile residual command assets and references after sibling ownership is frozen, rename only unassigned maintained snake_case filesystem names to kebab-case, and close every active pointer without duplicating sibling work or changing exempt content.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Re-scan `.opencode/commands/**` after the sibling disposition maps are available.
- Build a residual map for every file or directory not already owned by phases 001–008, with special attention to reference, asset, and template files and their links/pointers.
- Rename residual maintained snake_case filesystem names to kebab-case and update every proven path consumer.
- Reconcile cross-namespace links from command markdown, README files, YAML/TXT assets, scripts, tests, and generated-source manifests.
- Explicitly disposition generated compiled contracts, the doctor route manifest, the scripts negative fixture, Python files/package directories, tool-mandated names, public command IDs, and historical/frozen evidence.

### Out of Scope

- Files already assigned to phases 001–008 for physical movement; phase 009 may update their cross-namespace references only when the owning phase's final target is pinned.
- Opportunistic renames of generated output, tool manifests, Python files or package directories, fixtures, semantic keys, public IDs, or frozen history.
- Any migration outside the commands subtree or any work that creates a second owner for a sibling row.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Consume sibling maps before assigning residual ownership | The phase records the source revision of phases 001–008 and creates no residual row already owned by a sibling. |
| REQ-002 | Give every residual file and directory exactly one disposition | Each row is classified as rename, compliant, exempt/tool-mandated, generated, fixture data, or unresolved blocker with an owner. |
| REQ-003 | Make every approved residual rename auditable | Each rename row records source, kebab-case target, owner, consumer list, and exact/casefold/NFC collision result. |
| REQ-004 | Close active references without changing semantic contracts | Links, path values, template pointers, manifests, and README references point to final targets while keys, command IDs, generated contracts, and negative-test values remain exact. |
| REQ-005 | Prove whole-surface residual closure | No active old path, broken target, duplicate ownership, or unclassified candidate remains when the rollup consumes the map. |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The residual inventory is complete and contains no row already owned by a sibling.
- **SC-002**: All maintained residual snake_case files either reach unique kebab-case targets or have an evidence-backed exemption.
- **SC-003**: Every active link and pointer resolves to the final path; generated and tool-boundary references are classified rather than rewritten blindly.
- **SC-004**: The subtree gate can aggregate one authoritative disposition per command-surface file.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Risk or Dependency | Impact | Mitigation |
|--------------------|--------|------------|
| Duplicate rename ownership | Two phases could move or claim one file. | Compare every candidate against sibling maps before assigning 009 ownership. |
| Generated output is hand-renamed | Regeneration or tool contracts could break. | Preserve generated filenames and use their supported regeneration boundary only. |
| A reference is updated to an intermediate target | Active links could remain broken after later phases. | Require final target pins and a repository-wide old/new path search. |
| Fixture or tool data is treated as a live path | Exact contracts or negative tests could drift. | Record content-versus-filesystem classification and preserve exact values. |
| Sibling maps and commands rollup | Missing ownership evidence blocks safe residual work or acceptance. | Consume phases 001–008 first and hand the final map to `010-commands-gate`. |
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

The only open question is whether the post-sibling inventory contains any residual maintained file. If it is empty, the phase produces a complete no-op disposition and reference audit; if it is non-empty, each row must meet the requirements above before rollup.
<!-- /ANCHOR:questions -->
