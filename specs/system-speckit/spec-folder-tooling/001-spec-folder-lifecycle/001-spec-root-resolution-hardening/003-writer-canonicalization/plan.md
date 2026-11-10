---
title: "Implementation Plan: Writer Canonicalization"
description: "Canonicalize the Stop autosave, generate-context, phase-pointer refresh, and create.sh; add collision rejection; ship source+dist as one bundle."
trigger_phrases:
  - "writer canonicalization plan"
  - "collision rejection plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Writer Canonicalization

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript → dist; Bash (`create.sh`) |
| **Subsystems** | `mcp_server/hooks`, `scripts/memory`, `scripts/core`, `scripts/spec` |
| **Testing** | Alias-absent writer smoke; collision-rejection unit tests |

### Overview
Canonicalize all automatic writers in one shippable source+dist bundle, add per-write same-ID collision rejection, smoke-test with the alias absent, then unfreeze. This is where the first non-reversible canonical write occurs, so the bundle is gated.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 002 data canonicalized
- [x] Writer entrypoints inventoried

### Definition of Done
- [ ] All four writers emit canonical; alias-absent smoke passes
- [ ] Collision rejection blocks divergent same-ID writes
- [ ] Source+dist shipped together; unfreeze clean

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Each writer resolves once via the shared resolver → canonical, then writes; a collision guard rejects divergent same-ID targets fail-closed.

### Key Components
- **Stop autosave / generate-context** — canonical target resolution.
- **Phase-pointer refresh** — consumes the resolved absolute child path.
- **create.sh** — both modes canonical; no legacy `mkdir -p`.
- **Collision guard** — per-write same-ID rejection.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Add the shared-resolver call + collision guard scaffold to each writer

### Phase 2: Core Implementation
- [ ] Canonicalize Stop autosave, generate-context, phase-pointer, create.sh (both modes)
- [ ] Wire per-write same-ID collision rejection
- [ ] Build source+dist bundle

### Phase 3: Verification
- [ ] Alias-absent writer smoke; collision-rejection tests; unfreeze

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Smoke | Each writer, alias absent | Vitest + temp workspace |
| Unit | Collision rejection | Vitest |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 002 canonical data | Internal | Not started | Writers may canonicalize onto unresolved divergence |
| Clean dist rebuild | Internal | Green | Cannot ship the bundle |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: losing-root write or source/dist mismatch after unfreeze.
- **Procedure**: refreeze, roll back the behavior bundle, preserve canonical data. After the first post-unfreeze canonical write, data rollback is no longer lossless — behavior-only rollback.

<!-- /ANCHOR:rollback -->
