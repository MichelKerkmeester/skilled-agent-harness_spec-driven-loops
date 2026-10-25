---
title: "Implementation Plan: Phase 12: authoring-speed-fixes-and-alignment"
description: "Three file-disjoint lanes build the speed changes phase 011 ranks as safe, then one alignment pass updates the docs that describe them and phase 010's changes."
trigger_phrases:
  - "authoring speed fixes and alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.3 -->
# Implementation Plan: Phase 12: authoring-speed-fixes-and-alignment

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js scripts, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest, the sk-doc script tests, the card and example guards |

### Overview
Lane 1 adds `-c core.fsmonitor=false` to two scanners, lane 2 edits one card line and one template description, and lane 3 drops stale labels from one reference. Then an alignment pass updates the docs those lanes and phase 010 made stale. Same output before and after proves lane 1; the guards and snapshot test prove lane 2.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] `rg -n 'Lane 1|Lane 2|Lane 3' ../011-authoring-speed-research/research/phase-012-proposal.md` prints all three lanes

### Definition of Done
- [ ] The goal's four criteria hold
- [ ] `validate.sh` on this folder with `--strict` prints `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
File-disjoint lanes

### Key Components
- **The two scanners**: list git files for `SOURCE_TAGS` and the sk-doc citation drift scan
- **The card and the tasks template**: what a model reads before it writes

### Data Flow
Validation calls the scanner, the scanner lists tracked and untracked files through git, and the rule checks each citation against that list.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Lanes 1 and 3 run first, lane 2 runs after phase 010 lane A finishes, and the alignment pass runs last.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Lane 1: `check-source-tags.vitest.ts` and `test-cite-drift-scan.mjs` pass, and the before and after scanner output is identical. Lane 2: `check-card-sync.sh` and `check-example-drift.sh` exit 0 and the scaffold snapshot test passes.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

None beyond `git`, Node.js and the existing test runners.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Trigger: a scanner verdict changes or a guard fails. Revert the lane's commit.
<!-- /ANCHOR:rollback -->

---
