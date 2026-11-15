---
title: "Implementation Plan: Phase 9: deep-review-p2-remediation"
description: "Seven small edits across CI, one test, the lookup offer, two playbooks and the /speckit:complete workflow, each proved by a negative control taken before the edit and rerun after it."
trigger_phrases:
  - "deep review p2 remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: deep-review-p2-remediation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (engine), ESM JavaScript (tests), YAML (CI and command workflow), Markdown (playbooks) |
| **Framework** | Node 22, GitHub Actions |
| **Storage** | None |
| **Testing** | vitest for the engine and hooks tree, `node --test` for the session readers and the handover CLI |

### Overview
Each change is in place, in the file the finding names. The offer gains one shape check on its runtime label, and the test swaps a skip for an assertion. Every fix is proved by rerunning the negative control recorded in `spec.md` Measured Behavior, then the whole gate against the captured baselines.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `npm --prefix .skilled/hooks/session-handover/history test` prints 140 passed, and the hooks, readers, handover and hook-state suites match their baselines with exit 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place edits, no new files.

### Key Components
- **`lookup-offer.ts`**: builds the printed command. It gains `isHistoryLookupRuntime`, which admits one plain lowercase word, and the body and section builders withhold the offer for any other label. Importing `HISTORY_LOCATOR_KINDS` here was tried and dropped: Pi's compaction hook loads this module from source and Devin's loads its build, and neither should need the runtime build only to fit sections. A literal runtime list would be a second copy that drifts, so the check is on the shape and the test holds every schema runtime to it.
- **`project.test.mjs`**: the reader contract suite, which now fails on a missing schema.
- **`spec-kit-check.yml`**: the only workflow that runs the engine suites, now triggered by `.skilled/hooks/**`. The `.opencode/hooks` path is a symlink to the same tree, so one glob covers both.
- **`speckit-complete.yaml`**: loses `phase_predecessor_validation`. No other speckit workflow carries it.

### Data Flow
A claim mints a locator, then `buildHistoryLookupSection` turns it into the printed section. The runtime label is checked for its shape before it is written into the command, and any other label yields no section, the same withhold path a missing build already takes.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup captures the baselines and reproduces each finding. Implementation edits the seven files in place. Verification reruns each negative control, the whole suite set and the strict validator.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

One new engine test covers the unsafe label. The schema change is proved by moving the schema aside and back. The CI filter, the playbook lines and the workflow removal are proved by `rg` counts. SL-510 is proved by the two measurement scripts in `scratch/`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None new. The engine build at `.skilled/hooks/session-handover/history/dist/` must be rebuilt after the change so the claim loads the guarded offer. No new package.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a claim from a supported sender stops printing its section, or a suite drops below its baseline. Revert the phase commit with `git revert`. The edits share no state, so any one file can also be restored on its own with `git checkout <base> -- <file>`.
<!-- /ANCHOR:rollback -->

---
