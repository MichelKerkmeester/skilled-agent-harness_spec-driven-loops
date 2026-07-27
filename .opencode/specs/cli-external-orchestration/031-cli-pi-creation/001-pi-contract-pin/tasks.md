---
title: "Tasks: Pi CLI contract pin"
description: "Task breakdown for the Pi CLI contract-pin phase - install, live-verify, cross-check, record."
trigger_phrases:
  - "pi cli contract pin tasks"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin"
    last_updated_at: "2026-07-27T08:03:00Z"
    last_updated_by: "claude-code"
    recent_action: "Task list authored; none executed yet."
    next_safe_action: "Execute T001 (install) first; all later tasks depend on it."
    blockers: ["Pi CLI is not yet installed on this machine."]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-authoring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Pi CLI contract pin

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)` - `[P]` marks tasks that could run in parallel; none needed here, every task depends on the binary being installed first.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Install Pi CLI via the documented npm global install (`npm install -g --ignore-scripts @earendil-works/pi-coding-agent`), falling back to the `curl -fsSL https://pi.dev/install.sh | sh` shell installer only if the npm path fails
- [ ] T002 Confirm the binary resolves on `PATH` (`which pi`) and print the live version (`pi --version`)
- [ ] T003 Capture full `pi --help` output to enumerate the real subcommand/flag surface
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Launch `pi` interactively in a scratch directory; confirm `.pi/` directory creation and inspect its initial contents
- [ ] T005 Write a project `.pi/settings.json` plus a global-level settings file, each with one overriding key; confirm the documented project-over-global merge with nested-object merging live
- [ ] T006 Add a `"skills"` entry in `.pi/settings.json` pointing at this repo's `.opencode/skills/`; start a session and record whether discovery reports 12 hub-level skills or every nested mode/reference `SKILL.md` as well
- [ ] T007 Drop a probe `.pi/prompts/probe.md` using `$1`/`${1:-default}` placeholders; confirm it surfaces as `/probe`, confirm argument substitution, and confirm a same-named file one directory deeper is NOT discovered (non-recursive check)
- [ ] T008 Drop a minimal no-op `.pi/extensions/probe.ts`; confirm Pi's startup output acknowledges loading it
- [ ] T009 Inspect the auth/provider configuration surface; attempt a dispatch with no provider configured and record the exact failure output
- [ ] T010 Fetch and read the Programmatic Usage doc pages (SDK, RPC Mode, JSON Event Stream Mode) under `pi.dev/docs/latest` to identify the real headless-invocation syntax
- [ ] T011 Run one successful-path headless dispatch and one deliberately-failing dispatch; record both exit codes and full stdout/stderr verbatim - explicitly check for the `cursor-agent -p` exit-0-on-failure gotcha
- [ ] T012 Attempt `pi install npm:pi-subagents` (or `pi-mcp-extension`) far enough to confirm the real install-verb syntax, without proceeding into full package configuration
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Cross-check every live-observed behavior against the specific `pi.dev/docs/latest/**` page that documented it; note any drift between docs and the installed build
- [ ] T014 For any REQ-001..008 that could not be live-confirmed, mark it explicitly "documented, unconfirmed" in `implementation-summary.md` rather than asserting it as fact
- [ ] T015 Update this phase's `_memory.continuity` frontmatter (`completion_pct`, `answered_questions`, `open_questions`, `blockers`) to reflect what was actually confirmed once execution happens
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] T016 Write `implementation-summary.md` citing a live command's stdout/exit-code or a `pi.dev/docs` URL for every REQ in `spec.md`
- [ ] All tasks above marked `[x]` with evidence, no `[B]` blocked tasks remaining, manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- Consumed by `../002-deep-loop-executor-support/` (executor design) and `../003-cli-pi-skill-packet/` (SKILL.md/README content)
<!-- /ANCHOR:cross-refs -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `checklist.md` (this phase)
