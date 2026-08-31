---
title: "Tasks: Retire the decommissioned MCP server from the doctor tooling and clear stale spec residue"
description: "Ordered tasks: verify the decommission and the two sk-doc claims, capture a test baseline, delete by line number, then compare every check against the baseline."
trigger_phrases:
  - "decommissioned server tasks"
  - "doctor removal tasks"
  - "residue cleanup tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Retire the decommissioned MCP server from the doctor tooling and clear stale spec residue

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

- [x] T001 Confirm the server is absent from all four runtime configs (`opencode.json`, `.claude/mcp.json`, `.codex/config.toml`, `.utcp_config.json`) — all four returned no match
- [x] T002 Identify the real decommission commit `7673da6bc24` and confirm its file list never touched `.opencode/commands/doctor/`
- [x] T003 [P] Establish the doctor test surface from `.opencode/commands/doctor/scripts/README.md` §4 and §7
- [x] T004 Capture the baseline: `bash -n` ×2, `route-validate.sh`, `--self-test`, `check-mcp-mutation-class.sh`, three `tests/*.test.cjs`, and `mcp-doctor.sh --json`
- [x] T005 Record the negative control — `mcp-doctor.sh --server sequential_thinking --json` proves a live probe and two false warnings
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Read all four doctor files in full and resolve exact line boundaries before any edit
- [x] T007 Remove `diagnose_sequential_thinking()`, its dispatch line, the config-wiring array entry and three help-text references (`.opencode/commands/doctor/scripts/mcp-doctor.sh`)
- [x] T008 Remove the server definition, two install-guide pointers and two report rows; retarget the `npx` prerequisite to its real consumer (`.opencode/commands/doctor/assets/doctor-mcp-install.yaml`)
- [x] T009 Remove the repair-action block, two install-guide pointers and one report row; repair the invariant sentence the edit landed on (`.opencode/commands/doctor/assets/doctor-mcp-debug.yaml`)
- [x] T010 Remove four report table rows (`.opencode/commands/doctor/assets/doctor-mcp-presentation.txt`)
- [x] T011 Confirm `specs/sk-doc/039-create-repo-rules/` is empty, never git-tracked and unreferenced, then remove it with `rmdir`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Re-run every baseline check and compare to the recorded numbers
- [x] T013 Re-run the searches that found each item and confirm they return clean
- [x] T014 Verify `--server sequential_thinking` is inert and `--help` no longer advertises the name
- [x] T015 Decide the `specs/sk-doc/graph-metadata.json` question and record the evidence for the decision
- [x] T016 Regenerate packet metadata and run `validate.sh --strict`
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `bash -n` exit 0 on both scripts; both YAML files parse
- [x] CHK-011 [P0] No console errors or warnings — `route-validate.sh` warnings unchanged at 2, both pre-existing and unrelated
- [x] CHK-012 [P1] Error handling implemented — `should_run` string match makes a retired name inert; verified live
- [x] CHK-013 [P1] Code follows project patterns — deletions preserve the surrounding one-blank-line separator convention
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — see `acceptance-criteria.md`, 8 of 8 Met
- [x] CHK-021 [P0] Manual testing complete — `--json`, `--server`, `--help` all exercised after the change
- [x] CHK-022 [P1] Edge cases tested — retired `--server` name, and the full-run warning-count delta
- [x] CHK-023 [P1] Error scenarios validated — no `npx` network probe remains in the retired path
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class recorded: `cross-consumer` — one retired server spanning four coupled file layers.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -n "server-sequential-thinking" .opencode/commands/doctor/` — 6 sites before, 0 after.
- [x] CHK-FIX-003 [P0] Consumer inventory completed — `_routes.yaml`, cleanup scripts, route guard, `deep-ai-council` and the install-guides README each inspected and classified.
- [x] CHK-FIX-004 [P0] Not applicable — no security, path, parser or redaction logic changed. Adversarial input case (`--server` with a retired name) still executed.
- [x] CHK-FIX-005 [P1] Matrix axes listed in `plan.md` — four file layers × two operations; every cell inspected.
- [x] CHK-FIX-006 [P1] Not applicable — no test or code path reads process-wide state.
- [x] CHK-FIX-007 [P1] Evidence pinned to `49a17ac317` (HEAD at start) and the working-tree diff; nothing committed.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none added; the change is purely deletions plus one comment
- [x] CHK-031 [P0] Input validation implemented — `--server` argument handling unchanged
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable; no auth surface. `check-mcp-mutation-class.sh` still passes
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate — one comment added, naming the `npx` prerequisite's real consumer
- [x] CHK-042 [P2] README updated — not applicable; `scripts/README.md` names no individual server
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — baseline JSON kept in the session scratchpad, outside the repository
- [x] CHK-051 [P1] scratch/ cleaned before completion — packet `scratch/` holds no task-created residue
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-31
<!-- /ANCHOR:summary -->

---
