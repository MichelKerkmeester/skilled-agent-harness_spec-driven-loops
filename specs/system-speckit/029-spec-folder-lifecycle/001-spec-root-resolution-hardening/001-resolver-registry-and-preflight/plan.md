---
title: "Implementation Plan: Resolver Registry and Preflight"
description: "Build the resolver registry, R1–R10 table, and fail-closed collision classifier with a recorded source/dist baseline."
trigger_phrases:
  - "resolver registry plan"
  - "collision classifier plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Resolver Registry and Preflight

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript → dist JS; Node |
| **Subsystems** | `scripts/core`, `mcp_server/handlers`, `shared` |
| **Testing** | Vitest fixtures for the classifier |

### Overview
This entry phase builds no behavior change to live resolution. It produces the maintained registry (single source of truth for every call site + precedence), encodes the R1–R10 expected-result table, and adds a fail-closed read-only collision classifier. It records a source + rebuilt-dist baseline so later phases can prove production behavior.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Research §4 resolver inventory available
- [x] Five identity classes defined

### Definition of Done
- [ ] Registry covers every research §4 site with precedence labels
- [ ] Classifier passes fixtures for all five identity classes
- [ ] Source revision + both dist hashes recorded

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A maintained registry module + a pure read-only classifier function. No mutation of live resolution in this phase.

### Key Components
- **Resolver registry** — table of `{callSite, file:line, expectedPrecedence}` for every site.
- **Collision classifier** — `(relativePacketId) → {class, roots[]}`; fail-closed on divergent.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Seed the registry from research §4
- [ ] Define the R1–R10 expected-result table schema

### Phase 2: Core Implementation
- [ ] Fill the registry for all sites; add the classifier
- [ ] Record source + rebuilt-dist baseline hashes

### Phase 3: Verification
- [ ] Classifier fixtures pass; registry coverage confirmed vs research §4

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Classifier over five identity classes | Vitest |
| Coverage audit | Registry vs research §4 | Script + review |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Research §4 inventory | Internal | Green | No registry seed |
| Clean dist rebuild | Internal | Green | No baseline |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: registry or classifier defect found downstream.
- **Procedure**: this phase adds no live-resolution behavior, so rollback is discarding the registry/classifier modules and rescanning. Fully reversible.

<!-- /ANCHOR:rollback -->
