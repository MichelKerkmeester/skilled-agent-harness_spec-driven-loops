---
title: "Implementation Plan: Phase 1: baseline-capture"
description: "Run each gate the sk-prompt teardown can move against the untouched tree, capture stdout and exit status to disk, and record the three routing metrics that later phases must restore or knowingly move."
trigger_phrases:
  - "008 phase 001 plan"
  - "baseline capture plan"
  - "sk-prompt gate baseline"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: baseline-capture

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js 20 (CommonJS gates), Python 3 (advisor + corpus scorer), Bash |
| **Framework** | None; the gates are standalone CLI scripts |
| **Storage** | Flat capture files under `scratch/baseline/` |
| **Testing** | Gate exit status is the assertion; no test framework runs in this phase |

### Overview
Eight gates guard the surfaces this teardown touches, and they live in three runtimes. This phase runs each one against the untouched working tree, tees stdout plus an explicit `exit=` line into a per-gate capture file, and reads the routing scorer's JSON output to record the joint counts and ratchet pins. Nothing is modified; the phase exists so later phases compare against measured fact.
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
Measurement harness — read-only invocation with captured output, no mutation path.

### Key Components
- **Skill-root gates**: `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs` — class contract and generated-artifact freshness across all 14 roots
- **Routing gates**: `compiled-route-guard.cjs` and `parent-skill-check.cjs` — serving-closure freshness and per-hub structural invariants
- **Prompt-knowledge gate**: `check-prompt-quality-card-sync.sh` — the four-check drift guard over the card layers
- **Advisor gates**: `skill_graph_compiler.py --validate-only` and `score-routing-corpus.py` — metadata validity and routing accuracy

### Data Flow
Each gate reads the working tree, writes human-readable findings to stdout, and signals pass or fail through its exit status. The harness tees both into `scratch/baseline/gN.txt`. The routing scorer additionally emits a JSON block whose joint counts and bucket accuracies are transcribed into the summary.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The gate exit status is the assertion. A gate that exits non-zero here is a pre-existing failure the teardown inherits rather than causes, and is recorded as such instead of being repaired in this phase.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The routing corpus scorer resolves the built shared dist in this checkout; confirmed runnable before the capture is trusted.
- `timeout` is absent on this platform, so gate invocations run unbounded rather than wrapped.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

No rollback is required. The phase writes only capture files under its own `scratch/`, and touches no tracked source.
<!-- /ANCHOR:rollback -->

---
