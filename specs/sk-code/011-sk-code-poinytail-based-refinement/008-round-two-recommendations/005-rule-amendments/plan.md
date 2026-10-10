---
title: "Implementation Plan: Phase 5: rule-amendments"
description: "Adds six round-two amendments to two repo rule files and bumps both versions. Each edit is checked with the repo-rule checker, line receipts and an added-line prose check. The router, AGENTS.md and the trigger index stay unchanged."
trigger_phrases:
  - "rule amendments plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: rule-amendments

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown repo rule files, loaded by an agent through the `REPO RULES.md` router |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `check-repo-rules.cjs` (11 checks), `rg -n` line receipts, `diff` against `scratch/before/`, `git status --porcelain`, `repair-derived.cjs`, `validate.sh --strict` and `check-goal.cjs` |

### Overview
The two rule files need six amendments, and each one lands inside a section that already owns its subject, so no new file, trigger row or firing condition is added. A dry run applied the exact text in `tasks.md` to a copy of the rule tree in `scratch/dryrun/`. The copy passed the repo-rule checker at 11 of 11 with the line ceiling at 238, and the dry run supplied the expected line numbers the receipts cite. The builder applies the same text to the real files and reruns every check from the final state.

### Findings from planning

Every source line the research cites matched the file on 2026-10-10, so the six amendments rest on real text:

- Ponytail `context/skills/ponytail/SKILL.md` line 36 (the shortest working diff, and "a one-liner that needs decoding is not short"), line 39 (moved or merged code keeps its error handling and validation) and line 40 (equal options take the one correct on edge cases).
- `.skilled/skills/sk-code/shared/references/workflow-implement.md` line 51 (the reach list: callers, tests, fixtures, config and exports).
- `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md` line 54 (restraint never cuts accessibility) and line 85 (the accessibility wording the bullet reuses).
- `.skilled/repo-rules/evidence-and-proof.md` line 187 ("Four things, briefly:") and lines 185 to 199 for section 10.

Nothing in THE FIX failed to match. These differences matter to the builder:

- Amendment 2 changes an existing self-check line instead of adding a new one. `rule-anatomy.md` §7 asks for one self-check line per obligation, and the reach list extends an obligation that already has a line, so one line changes. This is a judgment, and the plan records it.
- Amendment 3 adds no Fires-when bullet. A bullet would fail checker 10 without a router row for moves, and the router is out of scope by D3. Open question 1 in `spec.md` records the gap.
- `validate.sh --strict` printed `RESULT: PASSED` on this folder's unfilled scaffold, with `Errors: 0` and one warning. A pass there proves nothing about the documents, so the bracket grep in T038 is required.
- `validate_document.py` returns `INVALID` on both rule files before any edit. It has no repo-rule document type and applies README rules, which need an overview section. It is not a gate for these files, and the contract's validator is `check-repo-rules.cjs`.
- `check-repo-rules.cjs` resolves one relative link into `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`. A copy of the rule tree fails check 7 unless that file is copied too. The real tree needs no such copy.

### Close-out count dependents

`rg -n -i 'four things' .skilled/repo-rules .skilled/skills/sk-doc "REPO RULES.md" AGENTS.md` returns two hits. `.skilled/repo-rules/evidence-and-proof.md:187` is the close-out count this child changes. `.skilled/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py:8` reads "Proves four things" and is unrelated. `AGENTS.md` and `REPO RULES.md` have no hit. `AGENTS.md:296` lists the same four close-out items in a sentence, without a count word, so after the change `AGENTS.md` keeps four items and `evidence-and-proof.md` has five. `communication-handoff.md` §1 names the status by section number only, so it has no count to break.
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
Single-source rule files behind one router, checked by one corpus checker. Each rule owns its subject, and an amendment lands in the section that already owns it.

### Key Components
- **`prevent-overengineering.md`** (164 lines, version 1.0.1.2): owns restraint. Gains amendments 1 to 4 and a self-check line for each.
- **`evidence-and-proof.md`** (236 lines, version 1.1.1.2): owns proof and the close-out. Gains amendment 5 and its self-check line.
- **`check-repo-rules.cjs`** (sk-create-repo-rule scripts): the contract's validator. It checks count parity, row coverage, phrase uniqueness, the 250-line ceiling, frontmatter keys, divider parity, rule links, Fires-when sections, index summaries, Fires-when coverage and card sync. It runs from the repository root with no arguments.
- **`REPO RULES.md`** and **`AGENTS.md`**: unchanged. The router rows for both rules keep their summaries, so checks 9 and 10 still match.

### Data Flow
An agent that writes or closes out a turn loads the router. The router loads the rule through its trigger row, and the rule's section now gives the decode floor, the reach list, the moves-and-merges check, the accessibility restraint or the residual-risk item. The trigger index does not read the rule bodies. Its corpus is `specs`, `.skilled/skills`, `.skilled/hooks` and `.skilled/changelog/skilled` (`lib/corpus.mjs` line 31), and no card directory exists for these rules.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- **Contract validator (REQ-007).** `check-repo-rules.cjs` runs before and after the edits. In the dry run it passed 11 of 11, and the line ceiling moved from max=236 to max=238. Every other check line stayed the same.
- **Line receipts (REQ-001 to REQ-006).** `rg -n` finds each amendment by a phrase that appears once, and the line numbers come from the dry run. If the builder reads a different line, the task stops (Law 4, line-number mismatch).
- **Prose rule (REQ-008).** The added lines of each file's diff against `scratch/before/` pass through `rg` for an em dash, a semicolon and a comma-list `and` or `or`. The detector is `, [^,.;]+, (and|or) `. In the dry run it printed nothing for either file. A known instance proves the detector is live: the removed line `the owning module, one real caller (\`file:line\`), and the contract` matches it, and the clause join `smaller than you think, or the code` does not. The detector is a proxy, and it misses a serial list whose item holds a comma.
- **Scope (REQ-009).** `git status --porcelain` over the touched and guarded paths, compared with the empty `scratch/status-before.txt` from T002.
- **Fires-when unchanged (SC-003).** The Fires-when section of each file is compared with its copy in `scratch/before/`.
- **Folder validator (SC-002).** `repair-derived.cjs --apply`, then `validate.sh --strict`, read for `RESULT: PASSED`. The bracket grep in T038 is the separate gate for unfilled text.
- **Unchanged checks.** The trigger index shows no rule-file path (REQ-011), and the close-out grep shows the one expected hit (REQ-010).

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The repo-rule contract: `.skilled/skills/sk-doc/sk-create-repo-rule/SKILL.md`, `references/rule-anatomy.md`, `references/agents-md-integration.md` and `references/decision-tests.md`.
- `check-repo-rules.cjs` and the rule files it reads. Its check 7 needs `.skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md` in place.
- Read-only sources: `context/skills/ponytail/SKILL.md` (repo path `specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail/SKILL.md`), `.skilled/skills/sk-code/shared/references/workflow-implement.md` and `.skilled/skills/sk-code/shared/references/universal/code-quality-standards.md`.
- The house prose rule, `.skilled/repo-rules/communication-prose.md` §3, which forbids an em dash, a semicolon and a serial comma in any sentence a reader reads.
- No sibling child. The trigger index is not a dependency, because it does not carry the rule files (T008).

<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Copy the two files back from `scratch/before/` over their source paths with `cp`, then rerun `check-repo-rules.cjs` and the path-scoped `git status --porcelain`, which must print nothing again. Do not use `git checkout`, `git restore` or `git stash`. The stash stack is shared with other sessions, and a `cp` restore touches only these two files.

<!-- /ANCHOR:rollback -->

---
