---
title: "Tasks: Official Obsidian CLI agent-usage support in mcp-obsidian"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "official obsidian cli tasks"
  - "obsidian cli verification tasks"
  - "app-backed cli checklist"
  - "tasks core"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Official Obsidian CLI agent-usage support in mcp-obsidian

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the CLI is already registered rather than installing anything (`readlink -f /usr/local/bin/obsidian` → `/Applications/Obsidian.app/Contents/MacOS/obsidian-cli`)
- [x] T002 Record the app-down failure contract before starting the app (stderr, exit 1, no auto-launch)
- [x] T003 [P] Start the desktop app and capture the full command surface (`obsidian help` → 106 commands, saved for analysis)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Author the agent contract (`references/official-cli-agent-usage.md`): preflight, exit-0 result handling, `key=value` syntax, surface selection, command surface, safety invariants, vendor disagreements, verification status
- [x] T005 Wire the `OFFICIAL_CLI` router intent into `INTENT_SIGNALS`, `RESOURCE_MAP`, the §2 loading map, the §8 inventory and the intent count (`SKILL.md`)
- [x] T006 Replace the PATH-only official-CLI check with a live `obsidian version` probe (`scripts/doctor.sh`)
- [x] T007 Add the two missing failure modes: app-down and exit-0-on-error (`references/troubleshooting.md` §5b, §5c)
- [x] T008 Correct the false auto-launch claim in all nine files that asserted it, one of them as `Confirmed behavior`
- [x] T009 Replace `obsidian --help` with `obsidian help` in 14 files, leaving `notesmd-cli --help` intact because that binary does take POSIX flags
- [x] T010 Replace positional-argument examples with the real `obsidian <command> key=value` grammar (`SKILL.md`, playbook root, `official-cli/open-app-action.md`)
- [x] T011 Add the executable form of the contract (`examples/official-cli-workflow.sh`) and index it (`examples/README.md` §3.3, `SKILL.md` §8)
- [x] T012 Rewrite the two `official-cli/` playbook scenarios to preflight with `obsidian version` and judge by stdout
- [x] T013 Write the release entry and bump versions (`changelog/v0.23.0.0.md`, `SKILL.md` 0.23.0.0, `obsidian-cli-commands.md` 0.2.0.0)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Negative control: run `doctor.sh` with the app down and confirm the previously green check became a warning
- [x] T015 Positive control: restart the app and confirm `doctor.sh` reports the version and liveness
- [x] T016 Run `examples/official-cli-workflow.sh` in both conditions: exit 1 with guidance when down, full round trip and self-cleanup when up
- [x] T017 Execute `SKILL.md`'s own `route_obsidian_resources` to prove `OFFICIAL_CLI` resolves and no existing intent regressed
- [x] T018 `bash -n` on all four touched shell scripts
- [x] T019 Reconcile the vault to its pre-change baseline and confirm no scratch note survived
- [x] T020 Run `validate.sh <packet> --strict` and require an explicit `RESULT: PASSED`
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
- **Closure gate**: See `acceptance-criteria.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..REQ-007)
- [x] CHK-002 [P0] Technical approach defined in plan.md, including the six autonomous decisions
- [x] CHK-003 [P1] Dependencies identified and available: desktop 1.13.7, registration symlink present
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `bash -n` clean on `doctor.sh`, `install.sh`, `setup.sh`, `official-cli-workflow.sh`
- [x] CHK-011 [P0] No errors or warnings in either script run; `doctor.sh` exits 0 in both app states
- [x] CHK-012 [P1] Error handling implemented: the `obs()` wrapper converts the CLI's stdout error text into a non-zero status, and the example script traps for cleanup
- [x] CHK-013 [P1] Follows project patterns: the example matches the banner, helper and preflight conventions of `headless-notes-workflow.sh`; comments carry the durable WHY and no ephemeral artifact labels
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (AC-001..AC-011 all `Met`)
- [x] CHK-021 [P0] Manual testing complete in both app-down and app-up conditions
- [x] CHK-022 [P1] Edge cases tested: name collision, missing file, unknown command, unknown vault, omitted target
- [x] CHK-023 [P1] Error scenarios validated: every observed failure exits 0 except the app-down case, which exits 1 on stderr
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: the auto-launch claim is `cross-consumer` (one false statement replicated across nine files); the `--help` syntax error is `class-of-bug`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed by grep for `launch`, `--help`, and positional-argument forms across the packet
- [x] CHK-FIX-003 [P0] Consumer inventory completed: references, SKILL.md router, scripts, feature catalog, playbook, install guide, README and examples index all updated
- [x] CHK-FIX-004 [P0] Not applicable. No security, path, parser or redaction logic was changed; the only executable change is a read-only diagnostic probe and an example script
- [x] CHK-FIX-005 [P1] Matrix axes listed: {app down, app up} × {binary registered, not registered} for the preflight, and {missing file, unknown command, unknown vault, empty search} for the result contract
- [x] CHK-FIX-006 [P1] Hostile-state variant executed: the app was quit and restarted to produce both global states rather than simulating them
- [x] CHK-FIX-007 [P1] Evidence is pinned to observed command output recorded in `implementation-summary.md`, not to a moving range
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. No vault content, note text or API key appears in any committed file
- [x] CHK-031 [P0] Input validation implemented: the example confirms the vault exists before mutating, because an unknown vault reports failure and still exits 0
- [x] CHK-032 [P1] Auth/authz unchanged. The `eval` and `dev:*` families are documented with their blast radius stated rather than presented as ordinary commands
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/acceptance-criteria synchronized
- [x] CHK-041 [P1] Code comments adequate and free of ephemeral artifact labels
- [x] CHK-042 [P2] README updated: skill README, INSTALL-GUIDE and examples README all carry the corrected contract
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only. The captured help output stayed in the session scratchpad, outside the repository
- [x] CHK-051 [P1] scratch/ clean before completion; the scoped diff contains no task-created residue
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---
