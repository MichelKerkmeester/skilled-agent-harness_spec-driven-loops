---
title: "Implementation Plan: better-sqlite3 Version + Node-ABI Alignment"
description: "Phased plan to align better-sqlite3 across the runtime and system-spec-kit and make the pin self-healing across Node ABI bumps."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/019-risky-followup-remediation/001-dependency-and-node-abi-alignment"
    last_updated_at: "2026-08-26T11:05:01.015Z"
    last_updated_by: "claude"
    recent_action: "Authored the dependency/Node-ABI phased plan"
    next_safe_action: "Phase 1: audit + decide the canonical version"
---
# Implementation Plan: better-sqlite3 Version + Node-ABI Alignment

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Symptom** | `dependency-seams` fails: runtime `better-sqlite3@12.10.0` ≠ system-spec-kit `12.11.1` |
| **Deeper cause** | Native ABI must match the running Node; Node shifted `25.6.1 → 26.7.0` this session |
| **Change kind** | npm version alignment + a self-healing ABI-rebuild hook |
| **Verification** | `dependency-seams` + every SQLite-backed test + a forced-mismatch repro |

### Overview
Two problems are entangled: a semver drift between two skills and a native ABI that moves with the Node version. The plan first decides the canonical version and the ABI strategy from evidence, then aligns the version and adds a self-healing rebuild so the binding is always valid for the running Node, then verifies against the whole suite and a forced mismatch.

<!-- /ANCHOR:summary -->
---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Both skills' installed + declared better-sqlite3 versions captured
- [ ] The running Node's `NODE_MODULE_VERSION` captured
- [ ] The canonical-version direction decided with rationale

### Definition of Done
- [ ] `dependency-seams` passes
- [ ] better-sqlite3 loads from both skills under current Node
- [ ] A forced ABI mismatch is auto-repaired
- [ ] Whole-suite delta clean vs the 017 baseline

<!-- /ANCHOR:quality-gates -->
---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single canonical native dependency, self-healing against ABI drift. The version is aligned across skills; a boot/setup guard compares the compiled binding's ABI to the running Node and rebuilds on mismatch, so a Node bump repairs itself instead of failing tests.

### Key Components
- **Version pin** — one `better-sqlite3` version declared identically in both skills.
- **ABI guard** — a small check (`process.versions.modules` vs the binding's build) that triggers `npm rebuild better-sqlite3` when they differ, with a clear warning if the toolchain is absent.

<!-- /ANCHOR:architecture -->
---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Investigate & decide
- [ ] Capture installed + declared better-sqlite3 in runtime and system-spec-kit, plus every other consumer of it in the repo
- [ ] Capture the running Node `NODE_MODULE_VERSION` and confirm the ABI (not just semver) is the real matcher
- [ ] **Decide** the canonical version — default to aligning the runtime UP to system-spec-kit's `12.11.1` unless a consumer forbids it (system-spec-kit backs the memory MCP; moving it is higher-blast)
- [ ] **Decide** where the ABI guard lives (shared boot module vs test-setup) and its rebuild trigger

### Phase 2: Implement
- [ ] Align `better-sqlite3` to the canonical version in the runtime (and/or system-spec-kit) + lockfiles
- [ ] Update the `dependency-seams` PINNED constant only if the canonical version moved
- [ ] Add the ABI-mismatch guard + auto-rebuild (warn-and-continue when the toolchain is missing)

### Phase 3: Verify
- [ ] `dependency-seams` passes
- [ ] better-sqlite3 loads from both skills; a memory MCP op works (system-spec-kit unaffected)
- [ ] Force an ABI mismatch (stale build) and confirm the guard repairs it
- [ ] Whole runtime suite vs the 017 baseline: no new failures

<!-- /ANCHOR:phases -->
---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Targeted | `dependency-seams` + SQLite-backed tests | vitest |
| Negative control | A deliberately stale ABI build repaired by the guard | manual repro + vitest |
| Regression | Whole runtime suite vs baseline | vitest run |
| Cross-skill | memory MCP loads + a real memory op | MCP smoke |

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| npm + native toolchain (node-gyp) | External | Unknown | No version change or rebuild |
| system-spec-kit dependency surface | Internal | Green | Defines the higher-blast side |
| The 017 whole-suite baseline | Internal | Green | Regression yardstick |

<!-- /ANCHOR:dependencies -->
---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The version change breaks the memory MCP or a native load.
- **Procedure**: Revert the `package.json`/lockfile change and the ABI guard; `npm install` back to the prior tree. The change is confined to dependency metadata + one guard module.

<!-- /ANCHOR:rollback -->
---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Decide version + ABI strategy) ──> Phase 2 (Align + guard) ──> Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Investigate & decide | None | Implement |
| Implement | Decisions | Verify |
| Verify | Implement | None |

<!-- /ANCHOR:phase-deps -->
---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Investigate & decide | Medium | 1-2 hours |
| Implement (align + guard) | Medium | 2-3 hours |
| Verify (suite + forced mismatch) | Medium | 1-2 hours (+ suite runtime) |

<!-- /ANCHOR:effort -->
---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Prior lockfile snapshot captured
- [ ] Memory MCP smoke recorded before the change

### Rollback Procedure
1. Revert `package.json` + lockfile to the snapshot.
2. Remove the ABI guard module.
3. `npm install` to restore the prior tree; rebuild if needed.
4. Confirm the memory MCP and SQLite-backed tests return to their pre-change state.

### Data Reversal
- **Has data migrations?** No — dependency + guard only.

<!-- /ANCHOR:enhanced-rollback -->
