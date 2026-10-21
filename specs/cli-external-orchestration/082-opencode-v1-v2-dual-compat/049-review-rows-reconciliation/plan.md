---
title: "Implementation Plan: Phase 49: review-rows-reconciliation"
description: "Rewrite 039's held findings as fixed by phases 040 to 042, add rows for the four hook files added after the audit, and recompute the totals from the rows. A Node checker compares the rows with git ls-files, holds the open P0/P1 rule and replays §2 from the finding entries."
trigger_phrases:
  - "review rows reconciliation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 49: review-rows-reconciliation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown tables and a Node ESM checker |
| **Framework** | None; `node:fs` and `node:child_process` only |
| **Storage** | None; `review.md` is the record and the checker reads it |
| **Testing** | `node scratch/check-review-rows.mjs` and `validate.sh --recursive --strict` |

### Overview
The phase edits two audit docs and adds the checker that keeps them honest. Each of the 35 held entries names the phase and first fixing commit, the four files added after the audit get their own rows, and §2 is recomputed from the finding entries instead of being maintained by hand. The checker then proves the three properties that drifted: one row per tracked path, no open P0 or P1 outside a recorded reason, and totals that equal the rows.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
One review table as the source of truth, with a derived summary and a checker that recomputes the summary from the table.

### Key Components
- **§5 per-file table**: one row per tracked path, with a findings cell that gives each finding an id, a severity, the rule cited and its outcome. The checker parses this cell.
- **§2 Totals**: the confirmed, fixed, held-since-fixed and recorded counts per severity, recomputed from the rows.
- **§3 and §4**: the held findings with the phase and commit that fixed each, and the findings that stay with their reason.
- **Checker**: `scratch/check-review-rows.mjs` builds the tracked path set, compares it with the row paths, classifies every finding entry by outcome, and compares the per-severity counts with §2.

### Data Flow
`git ls-files` over the plugin folder and both hook trees gives the tracked set. The §5 rows give the row set, compared for missing, extra and duplicate paths. Each finding entry is classified as fixed, recorded, held or rejected, and a recorded P0 or P1 counts as closed only when §4 has a row whose reason is at least 20 characters. The same counts are compared with the §2 table, and any mismatch exits non-zero.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The checker is the test, and it prints one line per property so a failure names the property rather than the file. It proves path coverage against `git ls-files`, the open P0/P1 rule against the §4 reasons, and the three §2 counts against the rows; its output is recorded in `scratch/check-review-rows.txt`. It cannot tell whether a commit hash is the one that fixed a finding, or whether a recorded reason is a good one, so those stay a reading of the 040 to 042 and 048 summaries.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The 040, 041, 042 and 048 implementation summaries must keep naming the commits their fixes landed in, since each §3 row cites one. `git ls-files` must keep covering the three trees the review scopes, `.opencode/plugins`, `.skilled/hooks` and `.opencode/hooks`, because a new tree would add tracked paths the review does not describe. The packet's `validate.sh --recursive` must stay the closure gate for the level 1 docs.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert this phase's commit. The two 039 docs return to the held wording, the four `b14-new-files` rows disappear and §2 returns to its earlier counts; there is no code change to undo, and the six P2 they record would simply be lost from the record.
<!-- /ANCHOR:rollback -->

---
