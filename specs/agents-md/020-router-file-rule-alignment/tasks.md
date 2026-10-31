---
title: "Tasks: Align the hub routing repo rule with the per-skill ROUTER.md layout"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "router file rule alignment tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Align the hub routing repo rule with the per-skill ROUTER.md layout

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Search `AGENTS.md`, `REPO RULES.md` and every rule file for router-location wording (`AGENTS.md`, `.skilled/repo-rules/`). Verify: `rg -n -i 'smart.?rout|machine.?router|ROUTER\.md' AGENTS.md "REPO RULES.md" .skilled/repo-rules/` prints lines only from `skill-hub-routing.md` and `REPO RULES.md`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Add a mode packet's own `ROUTER.md` to the rule's "Fires when" list (`.skilled/repo-rules/skill-hub-routing.md`). Verify: `grep -c "a mode packet's own \`ROUTER.md\`" .skilled/repo-rules/skill-hub-routing.md` prints 1.
- [x] T003 State where each `ROUTER.md` lives and that a router edit goes there, not in `SKILL.md` (`.skilled/repo-rules/skill-hub-routing.md` §1). Verify: `grep -c 'never in `SKILL.md`' .skilled/repo-rules/skill-hub-routing.md` prints 1.
- [x] T004 Point the detail table at the reference that defines each `ROUTER.md`, and raise the version to 1.0.0.3 (`.skilled/repo-rules/skill-hub-routing.md` §5). Verify: `grep -c 'where each `ROUTER.md` lives' .skilled/repo-rules/skill-hub-routing.md` prints 1.
- [x] T005 Add a mode packet's own `ROUTER.md` to the hub routing trigger row (`REPO RULES.md`). Verify: `grep -c "a mode packet's own" "REPO RULES.md"` prints 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the repo-rule corpus checker (`.skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs`). Verify: it prints `RESULT: PASSED (11/11 checks)`.
- [x] T007 Validate this packet (`specs/agents/020-router-file-rule-alignment`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
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
