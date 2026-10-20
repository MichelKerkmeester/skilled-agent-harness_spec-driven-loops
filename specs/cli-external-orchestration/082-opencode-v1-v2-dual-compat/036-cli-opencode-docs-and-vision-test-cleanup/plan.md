---
title: "Implementation Plan: Phase 36: cli-opencode-docs-and-vision-test-cleanup"
description: "Replace the pre-flight test's text-level comment cut with a quote-aware stripper and check the grep's input, add prose and prefix guards to the same test, reword the listing notes, point the sk-vision kill-switch tests at a path that is never created, and change the playbook snippets to call `default.server(...)`."
trigger_phrases:
  - "cli opencode docs and vision test cleanup plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 36: cli-opencode-docs-and-vision-test-cleanup

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js (CommonJS), TypeScript under Bun, Markdown |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, `bun test` |

### Overview
Five independent changes, each written by DeepSeek v4.1 flash through cli-pi from a one-change brief and verified by Luna. The doc test gains a shell comment stripper that tracks single quotes, double quotes and backslash escapes, a check that each `grep '^<provider>/'` line reads the standalone listing, a prose guard and a prefix-note guard. The listing notes are reworded to name the prefix. The sk-vision kill-switch block points `HOOK_FLAGS_CONFIG` at a path under a directory it never creates. The playbook snippets call `default.server(...)`.
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
Other - documentation guards and test hygiene.

### Key Components
- **`activeShellLines(lines)`**: drops whole-line comments and cuts a trailing comment only where `#` starts a word outside quotes.
- **Listing-source check**: a prefix grep counts only when it reads `opencode2 models --standalone` output directly or through a variable assigned from it earlier in the block.
- **Prose guard**: reads each shipped doc with code spans and fenced blocks removed and fails on a listing command left in the text.
- **Prefix-note guard**: fails a sentence that sends a reader to `opencode2 models --standalone` without naming a `<provider>/` prefix or the word prefix.

### Data Flow
Each guard reads the shipped docs at test time; nothing is generated.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

Baselines from the worktree at `origin/main` before any edit: cli-opencode script tests 13 of 13, sk-vision `bun test tests` 80 of 80 with 7 `sk-vision-flags-*` directories added per run, and the speckit-completion step 6 snippet exits 1 with `mod.default is not a function`. Each new guard is run against a mutant that it must fail. Each changed playbook snippet is run from the worktree root.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The plugin dual export in `.opencode/plugins/lib/v2-bridge.js`, whose `server(ctx)` returns the OpenCode 1 hooks object.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Revert the phase commits. Only a doc test, a Bun test file and Markdown change, so a revert restores the earlier wording and checks without touching runtime behaviour.
<!-- /ANCHOR:rollback -->

---
