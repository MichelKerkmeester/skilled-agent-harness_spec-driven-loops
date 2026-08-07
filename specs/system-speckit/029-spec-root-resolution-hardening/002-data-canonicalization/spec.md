---
title: "Feature Specification: Data Canonicalization"
description: "Phase S2: under a writer freeze, classify every packet, resolve divergent duplicates, and move legacy-only packets to canonical with lossless quarantine."
trigger_phrases:
  - "packet canonicalization"
  - "writer freeze"
  - "divergent duplicate resolution"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Data Canonicalization

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-17 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `system-speckit/000-migration-from-soa-and-cleanup/008-spec-root-resolution-hardening` |
| **Predecessor** | `001-resolver-registry-and-preflight` |
| **Successor** | `003-writer-canonicalization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Before writers change, packet data itself must be canonicalized. Legacy-only packets, byte-identical duplicates, and divergent duplicates must be resolved without any writer creating a new split-brain mid-migration. This is the last fully data-reversible stage.

### Purpose
Under a writer freeze, classify every relative packet identity with file-set hashes, manually resolve divergent duplicates, move legacy-only packets to canonical, and quarantine originals so a rollback is lossless.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Apply and enforce a packet-writer freeze.
- Classify every packet identity into a hashed manifest.
- Manually resolve divergent duplicates with explicit winner decisions.
- Move legacy-only packets to canonical; quarantine originals.

### Out of Scope
- Writer behavior changes (phase 003).
- Reader normalization (phase 004).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| packet data under `.opencode/specs/**` | Migrate | Legacy-only packets moved to canonical |
| quarantine store | Create | Lossless originals for rollback |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Writer freeze is active during migration | No packet writer can mutate data while the freeze holds |
| REQ-002 | Every packet identity classified | Hashed manifest labels each as canonical-only / legacy-only / alias / byte-identical / divergent |
| REQ-003 | Divergent duplicates resolved before move | Each divergent pair has an explicit winner; none auto-resolved |
| REQ-004 | Legacy-only moved with lossless quarantine | Originals recoverable byte-for-byte from quarantine |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Post-migration, no divergent same-ID packet exists under two roots.
- **SC-002**: Quarantine restore reproduces every moved packet byte-for-byte (lossless rollback proven).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A writer runs during the freeze | New split-brain | Freeze enforced + fault-injection tested (phase 005 L4) |
| Dependency | Phase 001 classifier | Cannot classify | 002 blocked until 001 lands |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which store and retention does quarantine use so rollback stays lossless across the window?
<!-- /ANCHOR:questions -->
