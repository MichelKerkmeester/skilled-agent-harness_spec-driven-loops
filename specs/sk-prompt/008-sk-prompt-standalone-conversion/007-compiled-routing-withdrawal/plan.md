---
title: "Implementation Plan: Phase 7: compiled-routing-withdrawal"
description: "Withdraw sk-prompt from the compiled-routing serving closure and live-activation fence, and restore every remaining hub to fresh."
trigger_phrases:
  - "008 phase 007 plan"
  - "compiled-routing-withdrawal plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: compiled-routing-withdrawal

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | Node.js 20 CommonJS, JSON manifests |
| Framework | None |
| Storage | Promoted runtime closure plus an authored source tree |
| Testing | The compiled-routing freshness guard |

### Overview
Compiled routing keeps two copies of each hub's activation state: a promoted runtime copy that serving reads, and an authored copy under the program's spec tree that a rebuild would restore from. Withdrawal therefore has to happen in both trees plus the closure manifest and four hardcoded lists, and any hub whose routing inputs moved during the program has to be re-minted in both places so the pair agrees.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented — evidence: `spec.md` §2 states the problem and §3 fixes the scope
- [x] Success criteria measurable — evidence: `spec.md` §5 states each criterion as an observable check
- [x] Dependencies identified — evidence: §6 of this plan lists them

### Definition of Done
- [x] All acceptance criteria met — evidence: the Verification table in `implementation-summary.md`
- [x] Tests passing (if applicable) — evidence: recorded in the phase-3 verification tasks
- [x] Docs updated (spec/plan/tasks) — evidence: this folder validates with Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Dual-tree withdrawal: runtime and authored source must agree, or a rebuild reverts the change.

### Key Components
- **`serving-closure.manifest.json`**: Declares which hubs are served and the exact file set the serving path touches
- **The per-hub activation manifest**: Records the effective policy hash and serving authority for one hub
- **`compiled-route-guard.cjs`**: Compares each hub's manifest against its current routing inputs and against the authored copy

### Data Flow
A route request resolves a hub to its compiled policy through the runtime engine's hub map, checks the activation fence for serving authority, and falls back to legacy routing on any miss. Removing the hub from the map and the closure makes it fall back by construction rather than by error.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The freshness guard is the acceptance signal. It distinguishes three states - fresh, stale manifest, and runtime differing from authored source - and all three were observed during this phase before it reported clean.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The refresh and mint verbs are provided by the compiled-route manifest tool; the authored tree location was taken from an earlier commit that fixed the same drift class.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped diff. Both trees and all four lists are plain files under version control.
<!-- /ANCHOR:rollback -->

---
