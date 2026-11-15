---
title: "Tasks: Hook hub index gap links and conversation scenario renames"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "hub index gap links tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Hook hub index gap links and conversation scenario renames

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`H` is `.skilled/hooks`. `C` is `.skilled/skills/cli-external-orchestration`. The coverage scan is a session script that resolves every file under the eight runtime hook folders and checks it against `H`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the coverage baseline on origin/main. Verify: the scan prints `{"IN_HOOKS":61,"LINKED_FROM_HOOKS":94,"MISSING":68}`. Evidence (2026-11-15): printed as stated.
- [x] T002 List the conversation scenarios under `C` whose plain name collides with a single-prompt twin. Verify: 11 collide and 29 rename. Evidence (2026-11-15): 11 COLLIDE, 29 renameable after dropping `continue-previous-conversation.md`, a single-prompt file whose feature name ends in the word.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the twelve Vibe links (`H/<concern>/vibe/`). Verify: `[ -e <link> ]` holds for each. Evidence (2026-11-15): all twelve print `ok`.
- [x] T004 Add the OpenCode links (`H/ask-surface-guard/opencode/`, `H/decision-capture/opencode/`). Verify: both resolve. Evidence (2026-11-15): both print `ok`.
- [x] T005 Update the hub tree and wiring text (`H/README.md`). Verify: `rg -c 'vibe/' H/README.md` rises. Evidence (2026-11-15): the tree, the skill-owned index paragraph, the OpenCode mirror paragraph, the Key Files row and the runtime wiring row name the links.
- [x] T006 [P] Add the `vibe/` line to eight concern README trees (`H/{classifier-injection-screen,dispatch,dist-freshness,mcp-route-guard,overlay-guard,post-edit-quality,session-cleanup,task-dispatch}/README.md`). Verify: `validate_document.py` reports 0 issues each. Evidence (2026-11-15): 0 issues on all eight.
- [x] T007 Rename the 29 scenarios with `git mv` and rewrite the references that resolve to them (`C/**/manual-testing-playbook/`, `system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-handover-vibe.md`). Verify: no live file outside `specs/` names an old path. Evidence (2026-11-15): the grep printed nothing after the two hub index link labels were fixed.
- [x] T008 Regenerate the trigger index (`generate-trigger-index.mjs`). Verify: exit 0. Evidence (2026-11-15): exit 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the coverage scan. Verify: `"LINKED_FROM_HOOKS":108` and 0 dangling. Evidence (2026-11-15): `{"IN_HOOKS":61,"LINKED_FROM_HOOKS":108,"MISSING":54}`, 0 dangling.
- [x] T010 Check links and playbooks. Verify: `check-markdown-links.cjs` prints 0 broken and each package validator prints PASS. Evidence (2026-11-15): 7604 files, 14910 links, 0 broken. Vibe PASS 52 scenarios, hub PASS 27 scenarios, both 0 violations and 0 warnings. system-spec-kit exit 0 with two warnings in files this change does not touch.
- [x] T011 Run the hook suites. Verify: they pass, or fail only where origin/main fails. Evidence (2026-11-15): vitest 501/501. OpenCode plugin tests 591/591. node:test collection 1836/1837, the one failure being `hook-stdin-deadline.test.mjs:172`, which fails identically with this change stashed and is red on main's last three OpenCode Plugin Tests runs. After rebasing onto `acfa9f0ffa1`, which repairs that check on main, the file passes 22/22.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
