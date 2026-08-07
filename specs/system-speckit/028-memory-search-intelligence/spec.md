---
title: "Feature Specification: Memory Search Intelligence Phase Parent"
description: "Lean coordination parent for the six active release, memory-engine, data-quality, remediation, dark-flag and surface-alignment phase parents."
trigger_phrases:
  - "028 memory search intelligence"
  - "028 phase parent topology"
  - "memory retrieval improvements"
  - "028 topology aliases"
  - "028 continuation state"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence"
    last_updated_at: "2026-07-11T16:53:11.428367Z"
    last_updated_by: "markdown-agent"
    recent_action: "Applied and documented the six-parent thematic topology at canonical roots 001 through 006"
    next_safe_action: "Route through a canonical child; scope metadata repairs separately"
    blockers: []
    key_files:
      - "spec.md"
      - "context-index.md"
      - "handover.md"
      - "scratch/topology-migration-manifest.json"
      - "001-release-cleanup/spec.md"
      - "002-speckit-memory/spec.md"
      - "003-spec-data-quality/spec.md"
      - "004-review-remediation/spec.md"
      - "005-dark-flag-graduation/spec.md"
      - "006-speckit-surface-alignment/spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-11-028-topology-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The active root topology is exactly six phase parents numbered 001 through 006."
      - "Former root leaves are nested under the matching thematic parent."
      - "Historical paths are aliases only; the migration manifest is the complete alias authority."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Memory Search Intelligence Phase Parent

## How to read this packet

Use this root `spec.md` for current governance and routing. Use `context-index.md` for historical migrations and old-to-new alias guidance. Use `handover.md` for current continuation state. The applied topology contract and complete 173-entry alias map live in `scratch/topology-migration-manifest.json`; the execution record lives in `scratch/topology-migration-log.md`. Implementation status remains phase-local and must be supported by that phase's `implementation-summary.md`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | active coordination parent; topology applied |
| **Created** | 2026-06-16 |
| **Updated** | 2026-07-11 |
| **Parent Spec** | `../description.json` |
| **Parent Packet** | `system-speckit` |
| **Topology authority** | `scratch/topology-migration-manifest.json` (`status: applied`) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Packet 028 accumulated memory-search, data-quality, release, review, flag-governance and surface-alignment work at the root. Earlier navigation described a flat `000` through `023` layout and later described the work as a renumber-only follow-up. Both descriptions are superseded: the applied topology now has six active root phase parents, numbered `001` through `006`, with former root leaves nested under the parent that owns their theme.

### Purpose

Keep the packet root a lean coordination parent. It defines the six canonical roots, transition rules, historical alias policy and recovery pointers without duplicating phase-local implementation claims or evidence.

> **Phase-parent note:** Root governance is maintained in `spec.md`, `context-index.md` and `handover.md`; detailed plans, tasks, checklists and implementation evidence remain in child packets.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Root navigation for the six active phase parents.
- Canonical-path and historical-alias policy for the applied migration.
- Thematic routing, nested counts, transition rules and recovery pointers.
- Preservation of dated extraction, renumbering and regrouping history as explicitly historical context.

### Out of Scope

- Phase-local implementation status, planning or evidence changes.
- Generated JSON, timeline, changelog, benchmark, feature-flag or review-evidence maintenance.
- Treating an old alias as a writable or canonical path.

### Root Governance Files

| File | Role |
|------|------|
| `spec.md` | Current root purpose, active phase map and transition rules |
| `context-index.md` | Migration history, alias guidance and thematic nesting bridge |
| `handover.md` | Current continuation and recovery state |
| `scratch/topology-migration-manifest.json` | Applied machine authority for all 173 governed phase mappings |
| `scratch/topology-migration-log.md` | Transaction and post-apply verification record |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

The manifest governs 173 phase folders. Counts below include each root parent; “nested” counts exclude it. All six canonical root paths and all 173 canonical phase paths resolve on disk.

| Root | Canonical folder | Focus | Direct children | Nested governed phases | Current root status |
|------|------------------|-------|----------------:|-------------------------:|---------------------|
| 001 | `001-release-cleanup/` | Release-readiness documentation, drift remediation and manual-playbook execution | 15 | 22 | Active phase parent |
| 002 | `002-speckit-memory/` | Memory retrieval, indexing, reliability, evaluation and daemon hardening | 42 | 55 | Active phase parent |
| 003 | `003-spec-data-quality/` | Authored/generated metadata quality, validation, migration and retrieval-gated tuning | 20 | 66 | Active phase parent |
| 004 | `004-review-remediation/` | Six review-remediation scopes retained as one thematic parent | 6 | 6 | Active phase parent |
| 005 | `005-dark-flag-graduation/` | Dark-flag evaluation, graduation, flag governance and graph-preservation evidence | 11 | 12 | Active phase parent |
| 006 | `006-speckit-surface-alignment/` | Documentation/surface alignment plus presentation-layer fixes | 6 | 6 | Active phase parent |

The nested totals are `22 + 55 + 66 + 6 + 12 + 6 = 167`; adding the six roots yields the manifest total of 173 governed phases. Seven numbered support directories are not governed phases, yielding 180 numbered directories overall.

### Root aliases

These are historical lookup aliases, not current folders:

| Historical root | Canonical root |
|-----------------|----------------|
| `000-release-cleanup/` | `001-release-cleanup/` |
| `001-speckit-memory/` | `002-speckit-memory/` |
| `002-spec-data-quality/` | `003-spec-data-quality/` |
| `003-review-remediation/` | `004-review-remediation/` |
| `004-dark-flag-graduation/` | `005-dark-flag-graduation/` |
| `005-speckit-surface-alignment/` | `006-speckit-surface-alignment/` |

Use `context-index.md` for moved former-root leaves and nested renumbering guidance. Use the manifest `aliases` object for exact path conversion; do not infer an alias from arithmetic alone.

### Phase Transition Rules

- Select one of the six canonical roots by subject; no new root sibling is created for work that belongs to an existing theme.
- Continue from the selected parent’s own `spec.md`, then descend to its direct child. Phase-local status comes from that child’s `implementation-summary.md`, not from this root map.
- Resolve any historical path through the manifest `aliases` object before reading or writing. Old machine-canonical paths are absent by post-apply contract.
- Keep the seven numbered support directories outside governed-phase counts and transition logic.
- Run strict validation on the selected child scope before making a completion claim.
- Return to this root only for cross-theme routing, alias recovery or packet-level continuation.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|----|----------|--------------|
| root | canonical parent | Match the work to one of roots 001-006 | Canonical parent path and `spec.md` resolve |
| historical reference | canonical phase | Resolve the exact key in manifest `aliases` | Alias target resolves and old path is absent |
| parent | nested phase | Follow the parent’s current child map | Nested phase `spec.md` resolves |
| nested phase | root | Work crosses themes or needs recovery | `context-index.md` and `handover.md` provide current routing |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:history -->
## 4. SUPERSEDED TOPOLOGY HISTORY

- **2026-07-06:** code-graph, deep-loop and most skill-advisor work were extracted to sibling subsystem packets. This decision remains in force.
- **2026-07-07:** the final held skill-advisor follow-up left packet 028. The resulting `000` through `005` root snapshot was valid at that date but is no longer current.
- **2026-07-10:** eighteen review-remediation leaves were added at roots `006` through `023`. That flat-root snapshot is historical; those leaves are now nested by theme.
- **2026-07-11:** the topology migration applied the six-parent `001` through `006` layout, renumbered thematic children contiguously, preserved aliases and verified all canonical paths. This is current truth.

The detailed prior migration narrative is preserved in `context-index.md`. Historical path text may remain in dated records, but active navigation must use canonical paths.
<!-- /ANCHOR:history -->

---

<!-- ANCHOR:questions -->
## 5. OPEN QUESTIONS

- None for root topology. Phase-local questions remain with their canonical child packet.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Migration and alias bridge:** `context-index.md`
- **Current continuation:** `handover.md`
- **Applied manifest:** `scratch/topology-migration-manifest.json`
- **Migration log:** `scratch/topology-migration-log.md`
- **Active roots:** `001-release-cleanup/`, `002-speckit-memory/`, `003-spec-data-quality/`, `004-review-remediation/`, `005-dark-flag-graduation/`, `006-speckit-surface-alignment/`
- **Graph metadata:** `graph-metadata.json`
