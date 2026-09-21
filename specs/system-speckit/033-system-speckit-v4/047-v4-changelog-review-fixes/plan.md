---
title: "Implementation Plan: Phase 1: v4-changelog-review-fixes"
description: "Applies the eight machine-checkable LUNA-review findings to the v4 changelog as one atomic, uniquely-anchored edit pass, then re-proves every standing 046 gate, records the count deltas, and closes with the bookkeeping, validation and one local commit."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "architecture decisions"
  - "testing strategy"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: v4-changelog-review-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, plain prose under the 045/046 changelog voice |
| **Framework** | The sk-doc changelog contract; the HVR and census gates; the 045/046 evidence-anchored editing pattern |
| **Storage** | None (git-tracked prose; the only state is the committed changelog plus this packet) |
| **Testing** | The census/HVR/semicolon/skeleton battery, the facts-extraction diff, the finding acceptance greps, validate.sh --strict |

### Overview
The 046-close changelog (722 lines, 17/55/18/43, sha256 e3b1b5c1…) is amended by thirteen whole-anchor edits in one atomic call: five counting-and-spelling fixes, one added owning sentence, one added bridging lead, one glance-bullet swap, and five extra blank lines deleted (the seventh rides inside the lead-paragraph edit). Every anchor is proven unique before the call; every finding's truth is machine-checked against the repo before the prose changes; every standing gate is re-run after.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Evidence-anchored single-batch editing (the 045/046 sequence): truth first, then a uniquely-anchored atomic edit, then the gates.

### Key Components
- **The thirteen anchors**: whole-unique oldText spans, each proven count==1 against the pinned pre-edit file; the two edits that would share a heading are merged into one span so the batch stays disjoint.
- **The standing gates**: the wall census (0), the HVR scan (0 hard blockers), the semicolon survey (0 outside &nbsp;), the pinned skeleton (17/55/18/43) — the pass must leave all four exactly where 046 closed them.
- **The evidence trail**: scratch/ holds the 722-line before-copy (sha-verified), the facts-before extraction, and the before-to-after diff; the count record in spec.md closes the accounting.

### Data Flow
Review finding → truth check (repo greps, the tracked executor config, the skill definitions) → unique anchor → one atomic edit call → the eight acceptance greps → the four standing gates → the facts-extraction diff → the count record → the bookkeeping → validate → the single local commit.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The verification battery in tasks.md T006/T008 is the test suite: the eight finding acceptance greps (each keyed to the reviewer's own citation), the wall census, the HVR scan, the semicolon survey, the pinned skeleton counts, and the facts-before-to-after diff that must map 1:1 to the thirteen declared edits. There is no test suite for prose; these gates are the tests. The final authority is validate.sh 047-v4-changelog-review-fixes --strict.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

046-v4-changelog-remediation is Complete; its count record (722 lines, 17/55/18/43, sha256 e3b1b5c1…, 0 walls, 0 hard blockers, 0 semicolons outside &nbsp;) is the baseline this packet amends, and it is not re-opened. The review report lives at ../046-v4-changelog-remediation/scratch/luna-review-2026-09-21.md and is the scope's source. Concurrent writers were active across the 046 close: the sentinel precedes the edit, and the commit stages explicit paths only, leaving .pi/settings.json unstaged. The 046-era changelog-prose-audit.py no longer exists under .skilled (a concurrent reorg retired it); the census runs inline per the 046 precedent of embedding the checks, while the HVR scanner survives at its 046-verbatim path.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Before the commit: `git restore specs/system-speckit/033-system-speckit-v4/CHANGELOG-v4.0.0.0.md` removes the whole pass (the file is committed at 6cc4bafc61) and the untracked packet directory deletes cleanly. After the commit: `git reset --soft HEAD~1` returns the branch to 6cc4bafc61 with the changes back in the working tree.
<!-- /ANCHOR:rollback -->

---

