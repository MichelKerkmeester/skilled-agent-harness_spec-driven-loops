---
title: "Implementation Plan: Data Canonicalization"
description: "Freeze writers, classify and hash every packet, resolve divergent duplicates, and move legacy-only packets to canonical with lossless quarantine."
trigger_phrases:
  - "data canonicalization plan"
  - "writer freeze plan"
importance_tier: "important"
contextType: "implementation"
---
# Implementation Plan: Data Canonicalization

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node scripts; filesystem packet tree |
| **Subsystems** | packet data under `.opencode/specs/**`; quarantine store |
| **Testing** | Lossless-restore fixtures; freeze fault injection |

### Overview
The high-risk data stage. It freezes all packet writers, classifies every packet with file-set hashes, resolves divergent duplicates by explicit decision, and moves legacy-only packets to canonical while quarantining originals so rollback is lossless up to writer-unfreeze.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 001 classifier available
- [x] Freeze mechanism designed

### Definition of Done
- [ ] Freeze active; hashed manifest complete
- [ ] All divergent duplicates explicitly resolved
- [ ] Legacy-only moved; quarantine restore proven lossless

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Freeze → classify → resolve → move → quarantine. No writer behavior change; only data location + a temporary freeze.

### Key Components
- **Writer freeze** — blocks all packet writers for the migration window.
- **Hashed manifest** — file-set hash per packet identity + class label.
- **Quarantine store** — byte-exact originals for lossless rollback.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Implement the writer freeze + a freeze self-check
- [ ] Wire the classifier into a manifest generator

### Phase 2: Core Implementation
- [ ] Generate the hashed manifest; resolve divergent duplicates
- [ ] Move legacy-only packets to canonical; quarantine originals

### Phase 3: Verification
- [ ] Prove lossless quarantine restore; confirm zero divergent survivors

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Restore | Quarantine → byte-exact restore | Vitest |
| Fault injection | Writer attempt during freeze | Vitest |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 classifier | Internal | Not started | Cannot classify packets |
| Writer freeze | Internal | Not started | Migration unsafe |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: mis-migration or divergence detected before writer-unfreeze.
- **Procedure**: restore from quarantine (byte-exact) and rescan. This stage is fully data-reversible; the point of no lossless return is the first post-unfreeze canonical write (phase 003).

<!-- /ANCHOR:rollback -->
