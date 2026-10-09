---
title: "Implementation Plan: Phase 3: doctrine-pass"
description: "Adds the reuse rung, a never-cut pointer and an accessibility P0 item to sk-code's always-loaded restraint ladder, and aligns the implement workflow's ladder summary, reuse step and reach list with it. The never-cut items are pinned in the rule-copy canary and its tamper test, the ladder playbook scenario and canary README follow the change, and the always-loaded file is measured before and after."
trigger_phrases:
  - "doctrine pass plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 3: doctrine-pass

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference, playbook and README docs; one Node.js canary script (`check-rule-copies.js`); its bash tamper test (`check-rule-copies.test.sh`) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `check-rule-copies.js`, `check-rule-copies.test.sh`, an inline `node -e` rung-order check, `wc -l -c`, `run-all-drift-guards.sh`, `check-comment-hygiene.sh`, `validate.sh --strict` |

### Overview
The ladder in `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:42-53` has six rungs and no reuse step. The implement workflow at `.skilled/skills/sk-code/shared/references/workflow-implement.md:66` summarizes it in a different order ("platform/runtime features and existing helpers"). This phase inserts "Already in this codebase?" as rung 2, adds one pointer sentence from the ladder to the P0 tier, adds accessibility as P0 item 8, rewrites the workflow summary (`:66`), reuse step (`:73`) and reach list (`:51`) to match, pins the never-cut strings in `.skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:35-60`, adds the newly checked file and one tamper case per pin to `check-rule-copies.test.sh`, and brings the DR-001 ladder scenario and the canary README up to date. The exact replacement text is fixed in `tasks.md` so the builder does not have to compose doctrine.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-source doctrine with a summary copy and a string canary. The ladder in the universal standard is the authority; the implement workflow restates its order; the canary locks the items the ladder may never cut.

### Key Components
- **`code-quality-standards.md`**: always loaded on every sk-code route (`.skilled/skills/sk-code/ROUTER.md:320-324`, `DEFAULT_RESOURCE`). Holds the ladder (`:42-53`) and the P0 tier (`:71-81`). Gains rung 2, the pointer sentence and P0 item 8.
- **`workflow-implement.md`**: shared implement doctrine, symlinked into `sk-code-opencode/references/`, `sk-code-webflow/references/` and `sk-code-obsidian/references/` (all three link to `../../shared/references/workflow-implement.md`). It is loaded per surface, not on every route. Lines `:51`, `:66` and `:73` change.
- **`check-rule-copies.js`**: exact-substring canary. Gains one `EXACT_INVARIANTS` entry for `code-quality-standards.md` and one sentence in its header comment (`:6-14`). CI runs it through `.github/workflows/rule-canary-sync.yml:18-25` via the `.opencode/skills` symlink.
- **`check-rule-copies.test.sh`**: tamper harness. Its `TARGETS` list (`:22-29`) gains `code-quality-standards.md`, so a seeded tree holds every file the canary reads; it gains an untampered seeded-tree case and one delete-and-name case per pin.
- **`design-restraint-ladder.md`** (playbook DR-001) and **`sk-code-review/scripts/README.md`**: human-facing descriptions of the ladder and the canary. The scenario moves to seven rungs (`:11`, `:43`, `:77`, `:82`); the README updates its description (`:3`), contents rows (`:20-21`) and expected output (`:33`).

### Data Flow
An agent on any sk-code route loads `code-quality-standards.md`, reads the ladder and stops at the first rung that holds; the pointer sends it to §3 for what it may not cut. On implement intent it also loads `workflow-implement.md`, whose summary now names the same seven rungs in the same order and whose research step names the full reach list. The canary reads `code-quality-standards.md` on every CI push and fails if a pinned never-cut string disappears.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Rung order agreement (REQ-001).** No existing checker compares the ladder with the workflow summary. `tasks.md` T019 gives an inline `node -e` check that finds seven ordered keywords in both places and counts seven numbered rungs. Run against the current tree on 2026-10-09 it exits 1 with `FAIL ladder has 6 rungs, expected 7` and `missing or out of order: codebase` for both files, which is the expected "before" result.
- **Canary pins (REQ-004).** Proven by the permanent tamper suite, not a throwaway loop. `check-rule-copies.test.sh` seeds `code-quality-standards.md` with the other targets, runs an untampered seeded tree (expects exit 0), then deletes each pin in turn and expects exit 1 plus a `missing exact invariant string` line naming that pin. The untampered case proves each failure has one cause. T022 also breaks the canary on purpose once to show the new cases can fail.
- **Existing tamper suite (SC-002).** The seven existing cases must still pass; with `TARGETS` complete, each still fails only for its own mutation. Expected total: 20 `PASS` lines and `All rule-canary test cases passed`.
- **Docs that describe the change.** T025 greps the DR-001 scenario for the reuse rung and the canary README for the new expected-output line, and compares that line with the canary's real output.
- **Size (REQ-003).** `wc -l -c` before and after, with the "before" taken once phase 002 has landed so the delta belongs to this phase alone.
- **Unchanged checks.** `run-all-drift-guards.sh` and `check-comment-hygiene.sh` show no new finding for the changed scripts and docs.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- **Phase 002 must be complete first.** It rewrites the precedence clause in the same paragraph, `code-quality-standards.md:53` (`OPENCODE > WEBFLOW > UNKNOWN` to `OPENCODE > OBSIDIAN > WEBFLOW > UNKNOWN`). On 2026-10-09 its `tasks.md` still holds the template tasks and `:53` still reads the old order, so phase 002 is not built.
- **Line drift.** Once rung 2 and the pointer paragraph are inserted, every line from `:47` down moves. Tasks name the anchor text to find, and the line numbers are the pre-edit ones.
- **A stale line this phase leaves alone.** `.skilled/skills/sk-code/manual-testing-playbook/design-restraint/design-restraint-ladder.md:13` states the old precedence `OPENCODE over WEBFLOW over UNKNOWN`. It is surface precedence, not a rung, and phase 002's playbook scope names only the DR-004 row, the stack-folder scenario and an Obsidian scenario, so no phase currently owns it.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

T002 copies the six in-scope files into `scratch/before/` after phase 002 lands and before any edit. To roll back, copy each snapshot back over its source path. Do not use `git checkout` or `git restore` on these files: if phase 002 is not yet committed, a whole-file restore would also drop 002's precedence edit on `code-quality-standards.md:53`.
<!-- /ANCHOR:rollback -->

---
