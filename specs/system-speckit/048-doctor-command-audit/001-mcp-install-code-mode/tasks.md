---
title: "Tasks: Phase 1: mcp-install-code-mode"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "mcp install code mode tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: mcp-install-code-mode

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

- [x] T001 Confirm the worktree and run the read-only health command once, keeping its output (`scratch/doctor-run.log`). Evidence: `bash .skilled/commands/doctor/scripts/mcp-doctor.sh --json` exited 2 with pass 8 / warn 0 / fail 3 — the launcher and UTCP JSON checks passed, while `node_engine` (unreadable manifest), `dist_exists` and `node_modules` failed; the run scanned only `opencode.json`, `.claude/mcp.json` and the absent `.vscode/mcp.json`.
- [x] T002 Read the router, the full install YAML and the presentation with line-numbered source reads (`scratch/reality-check.md`). Evidence: `mcp.md`, `doctor-mcp-install.yaml` and `doctor-mcp-presentation.txt` read in full; every claim in the inventory carries a line-number citation.
- [x] T003 [P] Probe every path the route and install YAML name, and inventory every command, flag and environment variable (`scratch/reality-check.md`). Evidence: each path is marked present, moved or missing with the `test -e` probe or source line that showed it; the inventory also lists the three other CLI skills (`mcp-figma`, `mcp-chrome-devtools`, `mcp-click-up`) and the two extra presentation rows (Skill Advisor, System Code Graph).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Write the verdict and the target behavior (`scratch/proposal.md`). Evidence: verdict `fix` — keep `/doctor:mcp` and narrow both sub-actions to Code Mode and `.utcp_config.json`, with an approval-before-mutation install sequence and a read-only health check at the end.
- [x] T005 Rewrite `.skilled/commands/doctor/assets/doctor-mcp-install.yaml` to Code Mode only. Evidence: `cli_skill_diagnostics` deleted; `server_filter` removed; seven project config targets plus a user-level Hermes row; `.vscode/mcp.json` removed; the sequential steps cover the manifest-guarded build, the UTCP manual and credential setup, runtime registration, and the final health check.
- [x] T006 Rewrite `.skilled/commands/doctor/assets/doctor-mcp-debug.yaml` to Code Mode only. Evidence: the "all 5" wording, `server_filter` and the System Code Graph row removed; the seven project configs and the user-level Hermes note replace the old config list.
- [x] T007 [P] Update `.skilled/commands/doctor/assets/doctor-mcp-presentation.txt` (presentation text). Evidence: Code Mode-only startup, install, debug and report text; Skill Advisor and System Code Graph rows removed; the invalid `--server system_skill_advisor` example removed.
- [x] T008 Update `.skilled/commands/doctor/mcp.md` (route text and argument schema). Evidence: the description names Code Mode and its UTCP setup only; the argument hint is `<install [--runtime <name>]|debug [--fix]>`; `--server` is gone from both sub-actions.
- [x] T009 [P] Wire the health script to the system that exists (`.skilled/commands/doctor/scripts/mcp-doctor.sh`, `mcp-doctor-lib.sh`). Evidence: seven config files checked with launcher and `UTCP_CONFIG_FILE` values; `dist` staleness by mtime plus `node --check`; UTCP manual name and call-template-type check; prefixed credential names by presence only; Hermes INFO row; stale self-paths fixed.
- [x] T010 [P] Update the catalog and contract consumers. Evidence: `.skilled/commands/README.txt` carries two `/doctor:mcp` rows; `command-contract.json` carries the `doctor mcp` argument hint and operation text.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Run `bash -n` on both scripts. Evidence: `SYNTAX_OK` for `mcp-doctor.sh` and `mcp-doctor-lib.sh`.
- [x] T012 Run the health command and confirm the expected result on this checkout. Evidence: `mcp-doctor.sh --json` → exit 2, summary pass 11 / warn 2 / fail 3; FAIL rows are `package_json`, `dist_exists` and `node_modules`; `utcp_manuals` PASS "14 manuals have a valid name and call_template_type"; Codex WARN "unvalidated: Python tomllib unavailable"; `utcp_credentials` WARN lists nine prefixed names, no values; `hermes_registration` INFO.
- [x] T013 Parse both YAMLs and scan them for removed names. Evidence: `python3 yaml.safe_load` → `YAML_OK` for both; `grep -niE 'figma|chrome|click.?up|skill.?advisor|code.?graph|\.venv|vscode'` → no output, exit 1.
- [x] T014 Validate the router document, the command catalog and the route manifest. Evidence: `validate_document.py mcp.md --type command` → `VALID`, 0 issues; catalog mirror check → `STATUS=OK`, exit 0; `route-validate.sh` → exit 0, "OK: route-validate — 10 routes validated, 2 warnings".
- [x] T015 Record the verdict applied, the decisions and the remaining findings. Evidence: `implementation-summary.md` states "Verdict: fix", lists the eight changed files, the key decisions and five recorded limitations/findings.
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

- [x] CHK-001 [P0] Requirements documented in spec.md — the five requirements and the success criteria are written and each maps to an acceptance row
- [x] CHK-002 [P0] Technical approach defined in plan.md — the audit-then-apply plan, affected surfaces and testing strategy
- [x] CHK-003 [P1] Dependencies identified and available — the worktree is provisioned and the route validator exists; the embedded Code Mode build inputs are absent and recorded as findings rather than treated as blockers
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `bash -n` → `SYNTAX_OK` for both scripts; both YAMLs parse with `yaml.safe_load`
- [x] CHK-011 [P0] No console errors or warnings — the health command emits one JSON object and no shell errors; `route-validate.sh` exits 0
- [x] CHK-012 [P1] Error handling implemented — a missing `package.json`, `dist` or `node_modules` is reported as a FAIL row by name, and the Codex row warns instead of passing when no TOML parser is available
- [x] CHK-013 [P1] Code follows project patterns — the script changes keep the existing check/result shape and the command assets keep their established frontmatter and section format; no ephemeral ids were added to code comments
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — every row in `acceptance-criteria.md` is `Met`
- [x] CHK-021 [P0] Manual testing complete — one read-only health run plus the script, YAML, router, catalog and route-manifest checks were all re-run after the change
- [x] CHK-022 [P1] Edge cases tested — absent VS Code config (not offered as a target), user-level Hermes reported as INFO, credentials reported by name only, and the `tomllib`-unavailable path reported as WARN
- [x] CHK-023 [P1] Error scenarios validated — the three FAIL rows are the real, expected absences in this worktree and are reported instead of masked
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class — the multi-server coverage removal is `cross-consumer` (router, both YAMLs, presentation, doctor scripts, README and contract); the subsystem defects are `instance-only` findings, recorded and not fixed here
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep — `scratch/reality-check.md` inventories every named producer, and the removed-name scan over both YAMLs returns no rows, exit 1
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests — `mcp.md`, the presentation, the catalog, the contract and both scripts were updated in the same pass; `route-validate.sh` and the catalog mirror check confirm the consumers agree
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases — credentials are compared by name and presence only, and the health run's WARN row lists nine names with no values; the seven config paths and the UTCP manual name/type check are the parser rows
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed — the affected-surfaces section lists server scope × runtime target × check status, and the post-fix health run covers each axis (seven config passes, one Codex warn, one Hermes info, three Code Mode fails)
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state — Python 3.9.6 has no `tomllib`, so the Codex row exercised the unvalidated fallback and warned rather than claiming a pass
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range — the tree is uncommitted by instruction; evidence is pinned to the enumerated eight-file working-tree diff and the recorded command output above
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — the doctor reports credential names and presence only; no value is read into the report or stored
- [x] CHK-031 [P0] Input validation implemented — YAML and JSON parse checks, the UTCP manual name and call-template-type check, the seven config wiring checks, and TOML validation or an explicit WARN
- [x] CHK-032 [P1] Auth/authz working correctly — N/A; the command has no auth or authz surface
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — `spec.md` status Complete, this task list fully ticked, `acceptance-criteria.md` all `Met`
- [x] CHK-041 [P1] Code comments adequate — the script comments describe the checks; no ephemeral spec or packet ids were added
- [x] CHK-042 [P2] README updated (if applicable) — `.skilled/commands/README.txt` carries the two updated `/doctor:mcp` rows
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — the audit artifacts (`reality-check.md`, `doctor-run.log`, `proposal.md`) live in `scratch/`; no other temp files were created
- [x] CHK-051 [P1] scratch/ cleaned before completion — the three audit artifacts are kept as this phase's evidence, not deleted
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-02
<!-- /ANCHOR:summary -->

---

