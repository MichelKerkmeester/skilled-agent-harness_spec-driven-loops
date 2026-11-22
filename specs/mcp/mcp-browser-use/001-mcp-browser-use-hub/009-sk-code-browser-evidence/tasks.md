---
title: "Tasks: Phase 9: sk-code-browser-evidence"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk code browser evidence tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: sk-code-browser-evidence

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

- [x] T001 Read the `sk-code-frontend` row as HEAD holds it (`.skilled/skills/sk-code/ROUTER.md`). Verify: `git show HEAD:.skilled/skills/sk-code/ROUTER.md | rg -c 'page rendered in a browser'` prints 1.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Name the `mcp-browser-use` hub and its three browser modes in the `sk-code-frontend` row (`.skilled/skills/sk-code/ROUTER.md`). Verify: `rg -c 'mcp-browser-use' .skilled/skills/sk-code/ROUTER.md` prints 1, and the row names Chrome DevTools, Aside and Bladebro.
- [x] T003 Bump the router to 2.3.24.0, and sk-code to 3.12.2.0 in `SKILL.md`, `description.json`, `mode-registry.json` and `hub-router.json` (`.skilled/skills/sk-code/`). Verify: `rg -o -m1 '"?version"?: ?"?[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+"?' <each of the five files>` prints 2.3.24.0 for `ROUTER.md` and 3.12.2.0 for the other four.
- [x] T004 Add the changelog entry (`.skilled/skills/sk-code/changelog/v3.12.2.0.md`). Verify: `rg -n '^version: 3.12.2.0' .skilled/skills/sk-code/changelog/v3.12.2.0.md` prints one line.
- [x] T005 Amend the parent phase map, row 9, and the handoff row from 008 to 009 (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md`). Verify: `rg -n '^\| 9 \|' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` prints one line ending in `Complete`, and `rg -n '^\| 008-live-runs-and-playbook-fixes \| 009-sk-code' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md` prints one line.
- [x] T006 Add the 009 binding row to the parent goal (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md`). Verify: `rg -n '009-sk-code-browser-evidence/goal.md' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` prints one line.
- [x] T007 Replace every template token and placeholder in this packet (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence/*.md`). Verify: `rg -o 'YOUR_VALUE_HERE|FILL:|To be defined|scaffold/' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence/{spec,plan,goal,implementation-summary}.md | wc -l` prints 0.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Run the parent-skill checker on sk-code (`.skilled/commands/doctor/scripts/parent-skill-check.cjs`). Verify: prints `OK: parent-skill-check — all hard invariants passed, 0 warnings` and exits 0.
- [x] T009 Run the router sync verifier (`.skilled/skills/sk-code/sk-code-skilled/assets/scripts/verify-router-sync.cjs`). Verify: prints `router-sync: 5/5 checks passed` and exits 0.
- [x] T010 Validate this packet strictly (`.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh`). Verify: `validate.sh specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/009-sk-code-browser-evidence --strict` prints `RESULT: PASSED`.
- [x] T011 Validate the parent and its children recursively, strict (`validate.sh specs/mcp/mcp-browser-use/001-mcp-browser-use-hub --recursive --strict`). Verify: every folder it names prints `RESULT: PASSED`.
- [x] T012 Run the goal checker on this packet and on the parent (`.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs`). Verify: each run prints `RESULT: PASSED`.
- [x] T013 Follow-up: name the hub in `sk-code/SKILL.md` and ask page-speed claims for two numbers (`sk-code/SKILL.md`, `sk-code-frontend/references/web-performance-and-loading.md`). Verify: `parent-skill-check.cjs .skilled/skills/sk-code` prints `OK`. Evidence: `OK: parent-skill-check — all hard invariants passed, 0 warnings`; router-sync `5/5 checks passed`.
- [x] T014 Follow-up: hand cli-orca's non-Orca browser work to the hub (`.skilled/skills/cli-orca/`). Verify: `grep -rn "mcp-aside-devtools\|mcp-chrome-devtools" .skilled/skills/cli-orca` prints nothing. Evidence: 0 lines; both `FOREIGN_OWNERS` browser values read `mcp-browser-use`; catalog validator `PASS: 0 violations`.
- [x] T015 Follow-up: rewrite the dead `mcp-tooling/mcp-chrome-devtools` paths in `local-webflow` (outside this repository). Verify: a grep for that path in the skill prints nothing. Evidence: 11 paths in 8 files rewritten, 0 left; every new path resolves from `.skilled/skills/local-webflow`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Automated checks passed (T008 to T012). No live browser run was made, see spec section 7.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
