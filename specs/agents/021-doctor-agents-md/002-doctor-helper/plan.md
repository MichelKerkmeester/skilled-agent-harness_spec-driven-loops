---
title: "Implementation Plan: /doctor:helper"
description: "Write both suites and freeze the held-out set first, then build the matcher against the manifest, wire one read-only route, generate every derived surface and rebase the shared counts."
trigger_phrases:
  - "doctor helper plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: /doctor:helper

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js CommonJS, YAML input, `node:test` |
| **Framework** | None; the `yaml` package is the one dependency the matcher needs and its absence exits 2 |
| **Storage** | Reads `_routes.yaml`; writes nothing |
| **Testing** | `node:test` plus the family validators and the advisor's vitest suites |

### Overview
Both suites and the frozen held-out set land before the matcher so the accuracy bar is fixed before any tuning. The matcher then reads the same three manifest sections the bridge deriver reads, and the contract suite pins its entries to the deriver's generated output, so the two derivations cannot drift.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `/doctor:sk-skill` is on `main` and the counts are re-measured into `scratch/baseline.txt`
- [ ] The setup-list contract check runs once before anything is built, so an existing gap is known
- [ ] The manifest's phrase additions are listed before any tuning starts

### Definition of Done
- [ ] Both suites report `fail 0` and the held-out bar prints its three figures
- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the helper route
- [ ] Every generator's `--check` exits 0 and the deriver reports `fresh`
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One matcher over one manifest, one read-only route, generated surfaces downstream.

### Key Components
- **`doctor-helper-match.cjs`**: `loadEntries(root)` derives ids, runnables and phrases the way the bridge deriver does, and `rankProblem(entries, text, options)` scores them.
- **`helper.md` and its workflows**: parse free text after `--`, render at most three candidates, run a read-only pick in place and hand off a writing pick.
- **Two suites**: the matcher suite with the frozen held-out set, and the reach contract suite.

### Data Flow
The matcher reads the manifest, derives entries, scores a problem against the phrase vocabulary and renders candidates. A read-only pick loads that command's router with the target as its argument; a writing pick prints the line and stops.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Tokenizer, id and runnable derivation, skipping, exit codes | `node:test` |
| Accuracy | Self-recall over the live manifest and the frozen held-out set | `node:test` with a pinned sha256 |
| Contract | Reach, derivation parity, setup-row coverage and the router shape | `node:test` |
| Regression | The advisor's doctor suites | vitest in the advisor runtime |

### Scoring Knobs

Tuning changes the floor, the weights and the stopwords, and only ever against the tune set. The held-out set is authored before tuning and never edited during it.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `/doctor:sk-skill` on `main` | Internal | Yellow | Every count is stale and the reach probe measures the wrong set |
| The `yaml` package | Internal | Green | The matcher exits 2 with a named cause |
| The advisor runtime's build | Internal | Yellow | The vitest suites cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The held-out bar is missed, or the reach probe regresses on an existing phrase.
- **Procedure**: Revert the packet's commit. The route, the matcher and the generated surfaces travel together, and the manifest phrases that were added revert with them.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Matcher ──► Plumbing ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The re-measured baseline | The matcher |
| Matcher | The frozen held-out set | The plumbing |
| Plumbing | The matcher's output shape | Verification |
| Verification | Every generated surface | Packet closure |
<!-- /ANCHOR:phase-deps -->

---
