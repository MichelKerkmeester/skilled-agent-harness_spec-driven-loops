---
title: "Implementation Plan: Phase 3: routing-baseline-recapture"
description: "Recapture the scorer-eval ratchet pins and the routing-accuracy corpus hash that the model-alias deletion legitimately moved."
trigger_phrases:
  - "008 phase 003 plan"
  - "routing-baseline-recapture plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: routing-baseline-recapture

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| Language/Stack | Node.js 20, Python 3, Markdown |
| Framework | Vitest 4 where suites apply |
| Storage | None |
| Testing | Gate exit status and the advisor suites |

### Overview
Two pinned artifacts move together: the scorer-eval baseline, which records exact bucket and holdout counts, and the routing baseline, which records a sha256 per corpus file. The holdout rows that asserted the retired capability are removed first so the recapture measures the corpus as it should now be, then the capture script regenerates every metric in one pass and the drifted hash is copied into the checked-in baseline.
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
Measure-then-pin: edit the corpus, re-measure through the capture tool, re-pin the hash.

### Key Components
- **`capture-scorer-eval-baseline.mjs`**: Regenerates every ratchet metric under the reproducible no-sqlite regime
- **`scorer-eval-baseline-ratchet.vitest.ts`**: Re-scores live and holds each metric to the captured baseline
- **`routing-baseline.json`**: Records one sha256 per corpus file; the CI gate exits before scoring if any drifts

### Data Flow
The capture script scores the three corpora and the delegation fixture under a fixed environment, writes the metric set, and the ratchet re-runs the same scoring at test time and compares. The corpus hashes are checked first, so a corpus edit without a re-pin stops the gate before any scoring happens.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The ratchet suite is the acceptance signal for the pins; the routing-accuracy scorer run with the exact CI threshold arguments is the acceptance signal for the thresholds. Both were observed failing before the recapture and passing after.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The capture script resolves the built shared dist, which is present in this checkout.
- CI has no skill-graph sqlite, so both capture and verification run in the filesystem-fallback regime the pins were taken in.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the scoped diff. The prior pins and corpus rows are recoverable from git history and no external state was written.
<!-- /ANCHOR:rollback -->

---
