---
title: "Tasks: Phase 11: bdg-eval-port-note"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "bdg eval port note tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 11: bdg-eval-port-note

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

`M` is `.skilled/skills/mcp-browser-use/mcp-chrome-devtools`. `G` is `$M/references/troubleshooting.md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm that `dom eval` ignores the session's port in bdg 0.6.10 (`/opt/homebrew/lib/node_modules/browser-debugger-cli/dist/commands/dom/index.js`). Verify: the Measured Behavior grep in spec.md prints lines 478 and 480. Evidence: both lines, `default: 9222` and `verifyTargetExists(metadata, port)`.
- [x] T002 Count the guide's lines that name the error or the fix, at HEAD (`G`). Verify: `git show HEAD:$G | rg -c 'Session target not found|returnByValue'` prints nothing, because nothing matches. Evidence: no match.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add the `Session target not found` entry to §6 with symptoms, cause, a port check and two fixes (`G`). Verify: `rg -c 'Session target not found|returnByValue' $G` prints 3. Evidence: 3.
- [x] T004 Bump the guide to 1.0.5.0 with the trigger phrase "session target not found", and the mode to 1.0.27.0 with `changelog/v1.0.27.0.md` (`G`, `$M/SKILL.md`, `$M/changelog/`). Verify: the hub check's `13d-packet-version` line passes. Evidence: `PASS: 13d-packet-version: 3 mode packet(s) match their newest changelog entry`.
- [x] T005 Record phase 11 in the parent's phase map, handoff table and goal binding table (`specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md`, `goal.md`). Verify: `rg -n '011-bdg-eval-port-note' specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/spec.md specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/goal.md` prints the three rows. Evidence: spec.md lines 126 and 148, goal.md line 80.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T006 Run the browser hub check (`.skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/mcp-browser-use`). Verify: prints `OK: parent-skill-check — all hard invariants passed, 0 warnings`. Evidence: that line, exit 0.
- [x] T007 Validate this packet and the parent recursively, strict (`validate.sh`). Verify: every folder prints `RESULT: PASSED`. Evidence: 12 `RESULT: PASSED`, exit 0, 0 errors. The 2 warnings (001 SOURCE_TAGS, 006 FRONTMATTER_MEMORY_BLOCK) were there before this phase.
- [x] T008 Check both goals and rebuild the trigger index (`check-goal.cjs`, `generate-trigger-index.mjs --quiet`). Verify: each goal check exits 0, and the index rebuild exits 0. Evidence: both goals `RESULT: PASSED (5/5 checks)` with exit 0, the parent slice at 3922 characters (`packet_budget=ok`), and the index rebuild exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Automated checks passed (T006 to T008)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
