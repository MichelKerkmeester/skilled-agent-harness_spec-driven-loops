---
title: "Tasks: Phase 1: cli-versus-mcp"
description: "Ordered task list and verification checklist for measuring both Obsidian app-backed surfaces and setting the skill default."
trigger_phrases:
  - "cli versus mcp tasks"
  - "obsidian measurement tasks"
  - "surface comparison checklist"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 1: cli-versus-mcp

<!-- SPECKIT_LEVEL: 3 -->

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

- [x] T001 Record the app state as found and the vault baseline: 234 markdown, 1582 files (`scratch/`)
- [x] T002 Write the CLI evidence runner that writes stdout, stderr, exit status and elapsed time to separate files (`scratch/runt.sh`)
- [x] T003 [P] Write the two stdio MCP clients, one call per process and one long-lived session (`scratch/mcpcall.cjs`, `scratch/mcpseq.cjs`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the app-closed matrix on both surfaces and confirm the CLI does not launch the app (`scratch/evidence/closed-*`)
- [x] T005 Launch Obsidian, enumerate the 106-command surface, and run the app-open CLI matrix across every capability family (`scratch/evidence/cli-*`)
- [x] T006 Enable the Local REST API plugin, run the MCP matrix over all 12 exposed tools, then restore the plugin to disabled (`scratch/evidence/mcp-open-seq*.json`)
- [x] T007 Benchmark ten reads through each surface and separate MCP startup from warm per-call cost (`scratch/evidence/bench-cli-read.txt`, `mcp-bench.json`)
- [x] T008 Exercise the failure shapes on both surfaces: missing file, unknown command, unknown vault, name collision, empty result, missing target
- [x] T009 Write `references/cli-versus-mcp.md` with every cell traced to a recorded invocation
- [x] T010 Update `README.md` and the three surface references to name the same default without hedging
- [x] T011 Correct the measured facts the skill had wrong, and update the playbook where the measurement changed a scenario
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Delete every scratch note and confirm the vault matches the baseline exactly
- [x] T013 Quit Obsidian and confirm both the app and the plugin are back to their found state
- [x] T014 Run `validate_document.py` and `hvr_scan.py` on every file written or edited
- [x] T015 Regenerate the hub leaf manifest and confirm `--check` reports OK
- [x] T016 Run `repair-derived.cjs --apply` then `validate.sh --strict --recursive` on the 019 tree
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: both surfaces exercised live, vault and app state restored
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

- [x] CHK-001 [P0] Requirements documented in spec.md: REQ-001 through REQ-006
- [x] CHK-002 [P0] Technical approach defined in plan.md §1 and §3, including why no measurement runs through a pipe
- [x] CHK-003 [P1] Dependencies identified in plan.md §6. The REST plugin was found disabled, which is itself a finding
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No runtime code ships. The runner scripts live in `scratch/`, which this repository does not git-ignore, so the evidence tree was left explicitly untracked rather than committed. See limitation 7 in `implementation-summary.md`
- [x] CHK-011 [P0] Every runner run's stderr was read. The MCP server's startup log is informational and was used as evidence
- [x] CHK-012 [P1] `runt.sh` carries a portable timeout, added after `property:remove` stalled past two minutes
- [x] CHK-013 [P1] Documents follow the sk-doc reference and readme templates. Both gates pass
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] AC-001 through AC-010 all Met in acceptance-criteria.md
- [x] CHK-021 [P0] Roughly sixty CLI invocations and 37 MCP tool calls against a live vault, in both app states
- [x] CHK-022 [P1] Empty search, empty directory, name collision, missing target, missing file, unknown vault, plugin disabled
- [x] CHK-023 [P1] Both failure contracts recorded: exit 1 on stderr when the app is down, exit 0 with prose on stdout when it is up
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Not a bug-fix packet. The measured contradictions are `matrix/evidence` findings and each is corrected in the reference that carried it.
- [x] CHK-FIX-002 [P0] `grep -rn '14 tool|3.2.9|five core'` across the skill found the stale claims. Two live in `SKILL.md` and `INSTALL-GUIDE.md` and are recorded as out of scope in spec.md §3.
- [x] CHK-FIX-003 [P0] Every document that states a surface preference was inventoried and updated. See plan.md FIX ADDENDUM.
- [x] CHK-FIX-004 [P0] No such fix. The one security-shaped item, the bearer token, is read from `.env` at call time and appears in no document or evidence file.
- [x] CHK-FIX-005 [P1] Three axes: surface (2), app state (2), capability family (24 rows in `cli-versus-mcp.md` §4.2).
- [x] CHK-FIX-006 [P1] The plugin-disabled state is exactly that variant, and it was run before enabling.
- [x] CHK-FIX-007 [P1] Evidence is pinned to dated invocations on Obsidian 1.13.7 and `obsidian-mcp-server` v0.12.3, not to a branch range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The Local REST API token is read from `.env` at call time. No document or evidence file contains it
- [x] CHK-031 [P0] Not applicable. No input surface ships
- [x] CHK-032 [P1] The bearer token authenticated against `https://127.0.0.1:27124`, confirmed by a 200 on the plugin root
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria and implementation summary all state the same default and the same numbers
- [x] CHK-041 [P1] The runner scripts carry a header saying what they write and why no pipe is used. No ephemeral artifact labels
- [x] CHK-042 [P2] The skill README's router, when-to-use section and FAQ now name the default
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The runners and all evidence live under this packet's `scratch/`
- [x] CHK-051 [P1] `scratch/` is NOT git-ignored in this repository, so its contents were explicitly unstaged. The files stay on disk as the receipts behind every cell and appear as untracked
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 22 | 22/22 |
| P2 Items | 11 | 11/11 |

**Verification Date**: 2026-09-02
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] ADR-001 and ADR-002 are in plan.md §L3, this packet having no separate decision-record.md
- [x] CHK-101 [P1] Both ADRs are Accepted
- [x] CHK-102 [P1] ADR-001 rejects defaulting to MCP and rejects leaving the choice to the reader, with reasons
- [x] CHK-103 [P2] Not applicable. Nothing migrates
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] NFR-P01 met: ten samples per surface. CLI 34/38/52 ms, MCP warm 3/3/15 ms after 724 ms startup
- [x] CHK-111 [P1] No throughput target was set. The break-even point of about 21 calls is the figure that matters and it is reported
- [x] CHK-112 [P2] Not applicable to a local vault tool
- [x] CHK-113 [P2] `cli-versus-mcp.md` §5 carries the table and the break-even derivation
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] plan.md §7. Every leg was executed: scratch notes deleted, plugin disabled, app quit
- [x] CHK-121 [P0] Not applicable
- [x] CHK-122 [P1] Not applicable
- [x] CHK-123 [P1] `cli-versus-mcp.md` §6 carries the preflight and wrapper an agent needs for each surface
- [x] CHK-124 [P2] Nothing deploys
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] Two items reviewed: the bearer token stays in `.env`, and the plugin was returned to disabled so no loopback API is left listening
- [x] CHK-131 [P1] No dependency was added. `obsidian-mcp-server` was already registered
- [x] CHK-132 [P2] Not applicable
- [x] CHK-133 [P2] One deliberate exception recorded: a bare `obsidian read` returned 38176 bytes of the operator's open note, run once to size the leak and not retained
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] Synchronized
- [x] CHK-141 [P1] All 12 exposed MCP tools are named with their behavior in `mcp-tools.md` §5
- [x] CHK-142 [P2] README, three references and the playbook
- [x] CHK-143 [P2] `cli-versus-mcp.md` §7 lists every unknown with the check that settles it
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Technical Lead | [ ] Approved | Pending review |
| Operator | Product Owner | [ ] Approved | Pending review |
| Operator | QA Lead | [ ] Approved | Pending review |
<!-- /ANCHOR:sign-off -->


