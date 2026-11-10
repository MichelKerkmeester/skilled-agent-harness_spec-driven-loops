---
title: "Implementation Plan: Phase 59: cross-cli-map-refresh"
description: "One file, `.skilled/CROSS-CLI.md`, is re-derived from the tree rather than from its own last draft: every count comes from `git ls-tree` or from the two generator `--check` runs, DeepSeek writes the edit from that evidence, and a separate read-only DeepSeek session checks each number against the same commands. `validate_document.py`, the markdown link check and strict validation of this phase and of 082 gate the result before it is pushed to main and CI is recorded."
trigger_phrases:
  - "cross cli map refresh plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 59: cross-cli-map-refresh

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, edited under the `sk-doc` contract |
| **Framework** | DeepSeek v4.1 flash, high thinking, for the writing brief; DeepSeek v4.1 flash, thinking max, for the read-only review session |
| **Storage** | None |
| **Testing** | `validate_document.py`, `check-markdown-links.cjs`, `validate.sh --strict` on this phase and `--recursive` on 082, plus one read-only review round |

### Overview
The facts come first and they come from commands, not from the map: `git ls-tree` for the directory counts, and `sync-runtime-mirrors.cjs --check` and `sync-hook-registrations.cjs --check` for the two totals they own. DeepSeek writes the edit against that evidence, and a separate read-only DeepSeek session that did not write it walks every number back to the same commands. The validators run last, over the finished file.
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
- [ ] Commit and push to main
- [ ] Confirm CI green at the pushed commit
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: a single-file documentation correction, with the tree as the source of truth and a read-only review round as the fact gate.

### Key Components
- **`.skilled/CROSS-CLI.md`**: the only file edited. Seven sections: overview, the map table, why each runtime differs, the generators and drift, how to change something, and related links.
- **`git ls-tree`**: supplies every directory count, so the edit is written from the tree rather than from the previous draft.
- **`sync-runtime-mirrors.cjs --check` and `sync-hook-registrations.cjs --check`**: supply the two totals only the generators know, 194 mirrors across 8 trees and 32 hooks.
- **The read-only reviewer**: a separate DeepSeek session that did not write the text, checking each count and each named path against those same commands.

### Data Flow
Operator request, then the commands that re-derive every fact, then one writing brief to DeepSeek v4.1 flash through the CLI dispatch, then the edited map, then a read-only review round whose findings feed back as a fix brief, then the validators, then the push and the CI record.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

The map cannot be executed, so its gate is the tree. `git ls-tree` re-derives every count and `--check` re-derives the two generator totals; `validate_document.py` checks the document's structure; `check-markdown-links.cjs` proves every path the map names resolves; `validate.sh --strict` proves this phase's packet and `validate.sh --recursive` proves 082 as a whole. The read-only review round is the part no script covers: it asks whether each sentence is true, not only whether its number is current, and its findings are fixed rather than waived.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The counts come from the tree at the commit this phase reads, and the two totals come from `sync-runtime-mirrors.cjs` and `sync-hook-registrations.cjs` under `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/`. The document contract is `sk-doc`'s, whose `validate_document.py` and `check-markdown-links.cjs` are the content gate. The reviewer is a separate read-only DeepSeek session; Luna was not used, because the operator moved review to DeepSeek on 2026-10-21.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

One file changed, so `git checkout -- .skilled/CROSS-CLI.md` restores the previous draft, and this folder's docs can be removed with it. Nothing else reads the map at runtime, so a rollback costs a reader the corrections and nothing in behaviour.
<!-- /ANCHOR:rollback -->

---
