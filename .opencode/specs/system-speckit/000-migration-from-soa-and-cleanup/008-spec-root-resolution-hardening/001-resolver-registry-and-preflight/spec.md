---
title: "Feature Specification: Resolver Registry and Preflight"
description: "Phase S0–S1: establish the single resolver contract, the R1–R10 expected-result table, and a fail-closed collision classifier before any mutation."
trigger_phrases:
  - "resolver registry"
  - "collision classifier"
  - "root resolution preflight"
importance_tier: "important"
contextType: "implementation"
---
# Feature Specification: Resolver Registry and Preflight

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
| **Predecessor** | None (entry phase) |
| **Successor** | `002-data-canonicalization` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Root resolution is implemented ~20 times with four different precedences (canonical-first, legacy-first, canonical-only, direct-path-first) and no single contract. Without a provable inventory and a fail-closed collision check, no later phase can claim call-site coverage or safe canonicalization.

### Purpose
Establish one resolver registry (the source of truth for every call site + its expected precedence), the R1–R10 expected-result table, and a fail-closed read-only collision classifier, plus a source/dist baseline — all before any mutation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Resolver registry table: every root-resolution call site (~20, research §4) + expected precedence.
- R1–R10 expected-result table encoded alongside the registry.
- Fail-closed read-only collision classifier across every physical root.
- Baseline: record source revision + both dist hashes.

### Out of Scope
- Any resolver or writer mutation (phases 003–004).
- Data migration (phase 002).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/core/config.ts` | Modify | Anchor the shared resolver contract (no behavior change yet) |
| new resolver-registry module | Create | Maintained call-site + precedence table |
| new collision-classifier module | Create | Fail-closed read-only root/packet classifier |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Registry enumerates every call site + precedence | Every site in research §4 present with file:line + precedence label |
| REQ-002 | R1–R10 expected-result table encoded | Each of R1–R10 has a defined expected assertion |
| REQ-003 | Fail-closed collision classifier | Divergent same-ID under two roots returns reject, not a resolved winner |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Registry coverage matches research §4 with zero unclassified sites.
- **SC-002**: Classifier returns the correct label for all five identity classes (canonical-only, legacy-only, same-inode alias, byte-identical duplicate, divergent duplicate).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Literal scan misses a dynamically composed resolver | Coverage gap | Registry is maintained + AST-backed, not one-shot |
| Dependency | Research §4 inventory | Registry seed | Cross-check dist behavior against source |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Are there resolvers beyond the bounded research scan, and how does the registry stay extensible?
<!-- /ANCHOR:questions -->
