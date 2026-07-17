---
title: "Implementation Plan: Reader Normalization"
description: "Switch the shared helper and independent constructors to canonical-first with read-only legacy fallback, then run a clean compatibility window."
trigger_phrases:
  - "reader normalization plan"
  - "canonical-first readers plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Reader Normalization

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript → dist |
| **Subsystems** | `scripts/core`, MCP resume/indexing/discovery constructors |
| **Testing** | Reader fixtures; fallback-hit instrumentation |

### Overview
With writers canonical, normalize all unqualified readers to canonical-first with a read-only legacy fallback so unique legacy-only packets stay readable. Instrument fallback hits and run a 28-day zero-hit window before alias retirement.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 003 writers canonical
- [x] Reader call sites listed in the registry

### Definition of Done
- [ ] Shared helper + all constructors canonical-first
- [ ] Legacy fallback is read-only; unique legacy-only still readable
- [ ] Compatibility window records zero fallback hits

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Canonical-first selection with a read-only legacy fallback branch, plus a fallback-hit counter for the window.

### Key Components
- **Shared helper** — canonical-first ordering.
- **Independent constructors** — same contract via the shared resolver.
- **Fallback instrumentation** — counts legacy hits for the window gate.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Add the fallback-hit counter + window harness

### Phase 2: Core Implementation
- [ ] Shared helper canonical-first with read-only legacy fallback
- [ ] Independent constructors canonical-first

### Phase 3: Verification
- [ ] Reader fixtures pass; run the 28-day zero-hit window

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Canonical-first + legacy-only fallback | Vitest |
| Window | Zero fallback hits over 28 days | Instrumentation |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 003 writers canonical | Internal | Not started | Reader/writer mismatch |
| Registry (phase 001) | Internal | Not started | Cannot prove reader coverage |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a reader returns the wrong root or a legacy-only packet becomes unreachable.
- **Procedure**: roll back reader behavior only; writers and canonical data stay. Fully behavior-reversible.

<!-- /ANCHOR:rollback -->
