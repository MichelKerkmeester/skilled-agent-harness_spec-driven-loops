---
title: "Implementation Plan: repo-rules router and rule-set routing audit and optimisation"
description: "Measure the real Gate 5 payload before judging it, decide each smart-routing mechanism on whether it has a runtime consumer, then repair only the defects measurement actually found."
trigger_phrases:
  - "gate 5 payload measurement"
  - "router transfer verdict"
  - "de-em-dash repair plan"
  - "trigger table match surface"
  - "repo rules invariants"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: repo-rules router and rule-set routing audit and optimisation

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documents; Node and Python measurement scripts |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `scratch/invariant-check.cjs`, `validate.sh --strict`, `validate_document.py` |

### Overview

Measure before judging. The prior analysis compared the router against `AGENTS.md` and
concluded the router is not where cost lives. That conclusion is correct, but it was
reached by measuring the index rather than the payload, so it understates the rule
system's real footprint by roughly a factor of five. The plan re-measures against a
realistic action corpus, decides each smart-routing mechanism by whether a runtime
consumer exists, and then repairs only what measurement actually found.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Baseline invariants captured before any edit
- [x] Token measurement method fixed (`tiktoken` `cl100k_base`, not byte estimates)
- [x] Ownership boundaries confirmed against the six-stream brief

### Definition of Done
- [x] All five invariants re-verified after the change
- [x] Trigger phrase count unchanged at 164
- [x] `validate.sh --strict` returns an explicit `RESULT: PASSED`
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Two-surface routing, matching the shape already used by the skill hubs: an index that
selects, and a payload that binds. `REPO RULES.md` is the index; `repo-rules/*.md` is
the payload. The measurement question is which of the two carries the cost.

### Key Components

- **`REPO RULES.md` section 2**: the match surface. 37 action clauses across 9 rows,
  699 tokens. Long rows are the routing, not bloat.
- **`REPO RULES.md` section 3**: an index that lets a reader settle a simple question
  without loading a rule file. It is a cache, not a duplicate of section 2.
- **`repo-rules/*.md`**: 16,442 tokens of payload, of which 1,837 is `trigger_phrases`
  frontmatter used at authoring time by the collision check.
- **`AGENTS.md` Gate 5**: the obligation that makes the router load at all.

### Data Flow

Gate 5 fires on the first write of a session. The reader matches the action against
section 2, loads every rule the matching rows name, and the rules bind at precedence
level 3. Nothing machine-readable participates: there is no scorer, daemon or compiled
router anywhere in this path.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

### Phase 1: Setup

Capture the baseline before touching anything. Invariants, token counts and the sibling
symlink topology are all recorded first, so every later claim has something to compare
against and nothing needs a stash to reconstruct.

### Phase 2: Implementation

Measure, then decide, then repair. The measurement settles whether the router is worth
cutting; the transfer verdicts settle what to port from the skill hubs; only what survives
both is edited. The template is corrected in the same pass as the shipped routers, because
fixing the copies and leaving the source guarantees the defect returns.

### Phase 3: Verification

Re-run the same invariant script used for the baseline, confirm table integrity, prove the
one pre-existing validator error pre-dates this work with a `git show HEAD:` control, and
require an explicit `RESULT: PASSED` from the authoritative gate.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Three objective checks, all reproducible from `scratch/`:

1. **Invariant check** (`invariant-check.cjs`): trigger rows, index rows and rule file
   count equal; every link resolves; dividers equal numbered sections; trigger phrases
   counted and collision-checked.
2. **Table integrity**: every markdown row's cell count matches its header. Catches
   structural damage, though not the semantic damage found here.
3. **Negative control for the punctuation claim**: the pre-edit file was recovered with
   `git show HEAD:<path>` into `scratch/base/` and validated, proving the one blocking
   validator error on the router template pre-dates this work.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

`AGENTS.md` is symlinked into three sibling repositories, so any edit to it lands in all
four at once. The nine rule files are likewise symlinked per-file. `REPO RULES.md` is a
real file in each repository, so router edits do not propagate and must be repeated.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

To undo: `git checkout -- "REPO RULES.md" AGENTS.md repo-rules/ .opencode/skills/sk-doc/sk-create-repo-rule/assets/repo-rules-router-template.md`
and delete `specs/sk-doc/043-repo-rules-router-audit/`. Nothing was staged, committed or
pushed, and no file outside those four surfaces was touched.
<!-- /ANCHOR:rollback -->

---
