---
title: "Implementation Plan: sk-code Alignment & Drift Guards"
description: "How the RESOURCE_MAP-equality doc-truth fix, the qualifiedIdToLeaf bidirectional bijection test, the run-all-drift-guards.sh orchestrator, and the additive surfaceBundle request-context land as the single code-opencode alignment-authority interface, behind the still-off SPECKIT_COMPILED_ROUTING flag."
trigger_phrases:
  - "sk-code alignment plan"
  - "drift guards orchestrator plan"
  - "qualifiedIdToLeaf plan"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Plan: sk-code Alignment & Drift Guards

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope; remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python (`verify_alignment_drift.py`, `verify_stack_folders.py`), TypeScript/Vitest (`sk-code-router-sync.vitest.ts`), CommonJS (`leaf-resource-contract.cjs`), POSIX shell (`run-all-drift-guards.sh`) |
| **Alignment authority (post-child)** | `code-opencode/SKILL.md` + `alignment-verification-automation.md` (doc pointer) + `sk-code-router-sync.vitest.ts` (real guard) + `leaf-resource-contract.cjs` (`qualifiedIdToLeaf`) — the single interface CF-SC-5 requires |
| **Frozen inputs** | Three pinned scorer digests — read-only evidence only; `run-all-drift-guards.sh` never touches them |
| **Dependency** | `002-runtime-promotion-and-status-foundation` — REQ-006 targets the runtime request contract only after 002 promotes it to a stable path |

### Overview

Four additive layers, in dependency order, none touching the frozen scorer or a routing decision. First, a doc-truth fix: rename the inert RESOURCE_MAP-equality claim in `code-opencode/SKILL.md` to name the real guard (`sk-code-router-sync.vitest.ts`) and backlink it from `alignment-verification-automation.md §5`. Second, a bidirectional proof: add `qualifiedIdToLeaf` to `leaf-resource-contract.cjs` and a Vitest suite asserting compiled `targetQualifiedIds` and the RESOURCE_MAP resolve to the same leaves in both directions. Third, unification: `run-all-drift-guards.sh` invokes all three of sk-code's disjoint drift guards behind one non-zero-on-any-failure exit code, and `SKILL.md`'s gate list is updated to name all three commands. Fourth (P1, gated on 002), an additive `surfaceBundle` composite-routing context field on the promoted runtime request contract, proven by one LUNA-high playbook case. The combined output — corrected doc pointer, bijection module, and orchestrator script — is published as the single code-opencode alignment-authority interface later 015 children consume.

<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `002-runtime-promotion-and-status-foundation` has promoted the resolver/engine/activation/bundle closure to a stable runtime path (required before REQ-006 starts; not required for REQ-001..REQ-004).
- [ ] `sk-code-router-sync.vitest.ts` and `leaf-resource-contract.cjs` are re-read and confirmed at their current locations (cited lines re-anchored on the symbol, not trusted verbatim).
- [ ] The three frozen scorer digests are confirmed unchanged immediately before work starts.

### Definition of Done
- [ ] `code-opencode/SKILL.md` names `sk-code-router-sync.vitest.ts` explicitly; `alignment-verification-automation.md §5` backlinks to it.
- [ ] `qualifiedIdToLeaf` bidirectional bijection Vitest suite passes, zero orphans both directions.
- [ ] `run-all-drift-guards.sh` invokes all three guards, non-zero on any failure; `SKILL.md`'s gate list names all three commands.
- [ ] (P1) `verify_alignment_drift.py --check-router` parses RESOURCE_MAP markdown behind a default-off flag; positive + drift fixtures pass/fail correctly.
- [ ] (P1) The promoted runtime request contract accepts the additive `surfaceBundle` context; one LUNA-high case proves `sk-code:code-opencode`.
- [ ] Frozen-scorer SHA-256 unchanged pre/post; `validate.sh --strict` on this child folder reports Errors: 0.

<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Doc-truth-first, then bijection-proof, then orchestration, then contract-extension — four additive layers. Nothing in this child edits a routing decision, a manifest, or the frozen scorer; every deliverable is a corrected pointer, a new test, a new script, or a new optional field.

### Key Components
- **`code-opencode/SKILL.md` + `alignment-verification-automation.md §5`**: the corrected doc pointer naming the real guard.
- **`leaf-resource-contract.cjs` (`qualifiedIdToLeaf`)**: the bidirectional lookup between compiled `targetQualifiedIds` and RESOURCE_MAP leaves.
- **`run-all-drift-guards.sh`**: the single orchestrator over `verify_alignment_drift.py`, `verify_stack_folders.py`, and `sk-code-router-sync.vitest.ts`.
- **Promoted runtime request contract**: the additive `surfaceBundle` composite-routing context field (P1, post-002).

### Data Flow

`route-gold.typed.json` (`targetQualifiedIds`) → `qualifiedIdToLeaf` → `leaf-manifest.json` leaves ↔ `code-opencode/SKILL.md` RESOURCE_MAP entries (bidirectional assertion, both directions must resolve) → `run-all-drift-guards.sh` aggregates this Vitest suite plus `verify_alignment_drift.py` plus `verify_stack_folders.py` into one exit code → `SKILL.md`'s gate list documents all three commands → (P1) the promoted request contract accepts an optional `surfaceBundle` context field consumed by one LUNA-high playbook case.

<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This child corrects a documentation claim and adds test/orchestration surface over existing, unmodified routing logic — the surface inventory below is required before any edit.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|---------------|
| `code-opencode/SKILL.md` (~L45, L51, L73-156, L163) | Names an inert, markdown-blind validator as the RESOURCE_MAP-equality enforcer | Rename the claim to `sk-code-router-sync.vitest.ts`; update the gate list (~L163) to name all three guard commands | `grep -n "sk-code-router-sync.vitest.ts" SKILL.md` hits; no remaining sentence attributes RESOURCE_MAP-equality enforcement to `verify_alignment_drift.py` alone |
| `alignment-verification-automation.md §5` (~L48-52) | Describes verification automation with no backlink to the real guard | Add an explicit backlink to `sk-code-router-sync.vitest.ts` | Backlink present; §5 names the file by path |
| `verify_alignment_drift.py` (SUPPORTED_EXTENSIONS L39-51) | Markdown-blind by construction; frozen extension set for TS/JS/Py/Shell/Rust/JSON | Add `--check-router` (default off) markdown RESOURCE_MAP parser (P1) | Default invocation byte-behavior-identical; `--check-router` catches a seeded drift fixture |
| `leaf-resource-contract.cjs` / `selectResourceContract` | No `qualifiedIdToLeaf` export | Add the bidirectional lookup | New Vitest asserts zero orphans in both directions |
| Promoted runtime request contract (post-002; pre-promotion `011-runtime-engine/lib/compiled-route.cjs:73`) | Prompt-text-only front door | Add an additive optional composite-routing context field (P1) | One LUNA-high case returns a `surfaceBundle` containing `sk-code:code-opencode`; field absence is a no-op on every other hub |
| Frozen scorer trio | Read-only digest evidence for the orchestrator's own integrity, never invoked or edited | **Unchanged — not a consumer** | Pre/post SHA-256 identical |

Required inventories before implementation:
- Re-anchor every cited `file:line` on the SYMBOL (not the number) per `review-v1.md` §2's ±2–10-line drift note.
- `grep -n "qualifiedIdToLeaf\|servingAuthority\|compiledRoute" leaf-resource-contract.cjs` to confirm no existing partial equivalent before adding a duplicate lookup.
- Confirm 002's promoted request-contract module path exists before starting REQ-006; if not yet promoted, defer REQ-006 rather than targeting the mutable spec-tree copy.

<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Doc-truth + authority interface groundwork
- [ ] Rename the RESOURCE_MAP-equality claim in `code-opencode/SKILL.md` to name `sk-code-router-sync.vitest.ts`.
- [ ] Add the `alignment-verification-automation.md §5` backlink.
- [ ] Draft the single alignment-authority interface note (CF-SC-5): what this child publishes, what 009/010/011 must consume instead of re-deriving.

### Phase 2: Bijection proof + guard unification
- [ ] Add `qualifiedIdToLeaf` to `leaf-resource-contract.cjs`, exposed via `selectResourceContract`.
- [ ] Add the bidirectional bijection Vitest suite (compiled → RESOURCE_MAP, RESOURCE_MAP → compiled).
- [ ] Author `run-all-drift-guards.sh`; update `SKILL.md`'s gate list (~L163) to name all three guard commands.

### Phase 3: Stretch — markdown gate + surfaceBundle context (P1)
- [ ] `verify_alignment_drift.py --check-router` markdown RESOURCE_MAP parser, default off.
- [ ] Positive fixture (aligned RESOURCE_MAP) and drift fixture (seeded mismatch) for `--check-router`.
- [ ] Promoted request-contract `surfaceBundle` field (post-002) + one LUNA-high playbook case.

### Phase 4: Verification
- [ ] Re-hash the three frozen scorer files before and after this child's full diff; confirm unchanged.
- [ ] Run `validate.sh --strict` on this child folder.

<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Bijection | `targetQualifiedIds` ↔ RESOURCE_MAP leaf, both directions | Vitest (`leaf-resource-contract.test.cjs` + `sk-code-router-sync.vitest.ts`) |
| Orchestration | All three drift guards aggregate correctly | `run-all-drift-guards.sh` with each guard individually seeded to fail |
| Fixture (P1) | `--check-router` positive + drift markdown fixtures | `verify_alignment_drift.py --check-router` |
| Manual (P1) | `surfaceBundle` end-to-end proof | One LUNA-high compiled-routing playbook case |
| Regression | Default (no-flag) behavior of every touched script is unchanged | Byte/behavior diff before vs. after this child's changes |

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `002-runtime-promotion-and-status-foundation` | Internal | Planned (not started) | REQ-006 (P1) cannot target a stable path; REQ-001..REQ-004 (P0) are unaffected and proceed independently |
| `sk-code-router-sync.vitest.ts` (existing guard) | Internal | Confirmed present, 193 lines | No target file for REQ-002's bijection additions or REQ-003's orchestration |
| `leaf-resource-contract.cjs` (existing module) | Internal | Confirmed present | No target for the `qualifiedIdToLeaf` export |
| `013-create-skill-alignment` (Planned) | Internal | Planned (not started) | Its "single-authority interface" language must reference the same interface this child publishes; sequencing risk only, not a hard block |

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any phase fails its own verification, or 002's promoted request-contract shape changes mid-build in a way that invalidates REQ-006's design.
- **Procedure**: Every change in this child is additive — a renamed doc claim, a new script, a new export, a new default-off flag, a new optional request-contract field. Rollback is a plain `git revert` of this child's diff; no manifest, fence, or serving-authority state exists for this child to disturb, so there is no CAS or hash-restore drill beyond the file revert itself. REQ-001's doc-truth fix has zero runtime effect to unwind.

<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Doc-truth) ──► Phase 2 (Bijection + orchestration) ──► Phase 3 (Stretch: markdown gate + surfaceBundle) ──► Phase 4 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Doc-truth | — | Phase 2 (the authority-interface note names what Phase 2 must publish against) |
| Bijection + orchestration | Doc-truth | Phase 3, Phase 4 |
| Stretch (markdown gate + surfaceBundle) | Bijection + orchestration; 002 (surfaceBundle only) | Phase 4 |
| Verify | All prior phases | Completion |

<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|-------------------|
| Doc-truth + authority note | Low | Small, targeted doc edits |
| Bijection + orchestration | Med | New test suite + new shell orchestrator |
| Stretch (markdown gate + surfaceBundle) | Med-High | New parser mode + fixtures; gated on 002's promoted path |
| Verification | Low | Automated re-hash + strict validate |

<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-implementation checklist
- [ ] Frozen-scorer digests re-verified before any change.
- [ ] `002`'s promotion status confirmed (blocks REQ-006 only).
- [ ] Cited `file:line` locations re-anchored on the symbol.

### Rollback procedure
1. `git revert` this child's diff (doc rename, new script, new exports, new optional field).
2. Confirm the frozen scorer digests are still unchanged after the revert.
3. Confirm no manifest, fence, or `selectedPolicy` state exists for this child to restore (none was ever touched).

### Data reversal
- **Has runtime effect?** No — every artifact here is a doc, a test, a script, or an additive optional field; nothing serves traffic and no routing decision changes.
- **Reversal procedure**: Plain file revert; no external committed effect exists to undo.

<!-- /ANCHOR:enhanced-rollback -->
