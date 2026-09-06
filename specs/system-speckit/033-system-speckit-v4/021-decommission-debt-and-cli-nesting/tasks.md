---
title: "Tasks: Decommission debt fixes and runtime alignment"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "task breakdown"
  - "implementation tasks"
  - "verification checklist"
  - "task dependencies"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Decommission debt fixes and runtime alignment

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

- [x] T001 Read the debt rows in packet 052's goal log and the review reports that raised them
- [x] T002 Open this packet under the system-speckit track
- [x] T003 [P] Inventory the code folders and README coverage of `runtime/` and `scripts/`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Freshness: exclude the generator fixtures from the scripts sources; walker test (`1200c71f22`)
- [x] T005 Fan-out: retain bounded lineage stderr and write `logs/fanout-lineage.err`; runner test (`1200c71f22`)
- [x] T006 Review leaf: contract rule to resolve review paths against the dispatched artifact directory, all agent mirrors in sync (`c34ccfeb47`)
- [x] T007 Delete the rollback runbook with its README, alias and manifest entries; drop the unused MCP response type; rename the stale test (`1200c71f22`, `c34ccfeb47`)
- [x] T008 Move the trigger index to `runtime/data/`, remove the retired search-decisions file, rewrite every reference and the architecture topology (`1200c71f22`, `c34ccfeb47`)
- [x] T009 Align `runtime/` and `scripts/` with `sk-code-opencode` and write or refresh every code README: five Sonnet agents on disjoint folder sets (`9e759d06cf`, `588be3fc00`, `923f4e966d`, `e5b414cbae`); 87 code READMEs, 0 validator issues, no code folder without one
- [x] T009a Restore the eleven session-lifecycle hook registrations and mirror links the memory sweep dropped (`273767431d`); repair the two stale session-stop tests and the stdout scan exclusions (`6698bcc80b`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Typecheck shared, scripts and runtime exit 0; touched suites unchanged or improved per agent report; 87 READMEs validated
- [x] T011 Gates at `e0ae6d7063`: freshness stays green across two index runs without a re-stamp; sweep live 0; doctor routes 9; audits 14 of 14; routing guard fresh; validate strict PASSED on 052, 053 and this packet
- [x] T014 Act on the Grok lineage: remove the code that still targeted the retired store (extractor storage half, transaction manager, shared row types, folder-detector session-learning lookup, three-arm parity harness, importer-less better-sqlite3 and sqlite-vec, tests bound to deleted modules, absent-playbook allowlist) at `159c036502` and `9141353b0d`; validate.sh fails closed when its freshness helper cannot run (`171465b256`); Devin fallback text and a retired doctor path fixed (`4333c4d7b4`)
- [x] T013 Two-executor review-angle deep research under `research/`: Grok 20 of 20 fulfilled (16 min), LUNA 20 of 20 with synthesis (88 min; runner rejected the lineage for a leaf write outside its directory, now fixed at `deb1c487a6`); 10 and 59 findings triaged against HEAD
- [x] T015 Act on the LUNA lineage: gate and residue rows fixed (`a3dab29283`, `171465b256`), projection nesting fixed (`deb1c487a6`), skipped suites restored and two production bugs they hid fixed (`1d97495a5f`, `4621813b96`), sweep vocabulary widened (`255c932f9f`)
- [x] T016 Decompose the remaining findings into seven remediation phases (001 to 007) under this packet; all validate strict
- [x] T012 Close this packet and record the outcome in packet 052's goal log — parent and seven phases validate strict PASSED; outcome, passes and deviations logged in 052's goal
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed — gate set rerun at the closing head, see `implementation-summary.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 to REQ-004 in `spec.md`; the seven remediation phases each carry their own requirements table
- [x] CHK-002 [P0] Technical approach defined in plan.md — `plan.md` §3 plus each phase's plan
- [x] CHK-003 [P1] Dependencies identified and available — `plan.md` §6; the CLI workspace installs under the hoisted strategy (`57ef5fe600`), `npm ci --dry-run` up to date
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks — `npm run typecheck` (shared, runtime, cli) exit 0 at `072da7777c`; deep-loop runtime `tsc --noEmit` 0 errors at `75fc0c7713`
- [x] CHK-011 [P0] No console errors or warnings — `dist-freshness.cjs check-all` fresh; CLI project 1568 of 1589 tests green, the one red file targets the operator's in-flight 036 packet
- [x] CHK-012 [P1] Error handling implemented — fail-closed paths kept: validate.sh exits 3 when its freshness helper cannot run (phase 001); the council guard and the changelog output override reject out-of-root writes with named errors
- [x] CHK-013 [P1] Code follows project patterns — every code folder under `runtime/` and `runtime/cli/` carries a README at 0 issues (T009); comment hygiene gate passed on every commit
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met — AC-001 to AC-007 Met in `acceptance-criteria.md`; each phase's criteria closed in its own packet
- [x] CHK-021 [P0] Manual testing complete — gates rerun at `072da7777c`: route-validate 9 routes, compiled-route-guard fresh, skill-root audit 14 of 14, derived freshness 14 of 14, codex hooks OK, runtime mirrors 169 of 169, agent mirrors 12 of 12, contract drift OK for 3 commands, hook-path parity 100 of 100, residue sweep live 0
- [x] CHK-022 [P1] Edge cases tested — containment tests for a not-yet-created council root, an absolute and a `..` changelog override, and a symlinked parent; prune prediction versus apply; second-run byte stability
- [x] CHK-023 [P1] Error scenarios validated — out-of-root writes throw; a missing strategy anchor surfaces a warning without withholding output; malformed JSONL still fails closed (reducer suite)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`. — classes recorded in the phase 002 disposition tables: path-map drift is `cross-consumer`, the two containment gaps `class-of-bug`, the stale CLI-tree tests `test-isolation`, the prune and byte-stability defects `algorithmic`, the rest `instance-only`
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep. — `rg` for `system-spec-kit/scripts`, `scripts/spec/`, `scripts/dist`, `@spec-kit/scripts` returns only recorded history outside `specs/`, changelogs and benchmark reports
- [x] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests. — `scripts-registry.json`, `spec-root-registry.ts`, both CI workflows, four workflow assets, the doctor bootstrap, the runbook and every README under the moved tree were repointed and verified on disk
- [x] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases. — council guard: outside-root, symlink, not-yet-created root; changelog override: absolute outside, `..`, symlinked parent, inside no-op; repair tool: unwritable failure exits 2
- [x] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed. — review scope manifest 450 paths; CLI project 146 files; deep-loop suite 154 files; hook parity 100 registrations
- [x] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state. — the phase-parent classifier honors `SPECKIT_GENERATOR_HARDENING` opt-out spellings identically to the runtime; the freshness helper fails closed when unavailable
- [x] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range. — every disposition row in the phase summaries names its commit
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets — none introduced; two helpers that hardcoded a workstation path were removed at `c0254f4a8c`
- [x] CHK-031 [P0] Input validation implemented — `--output` and the council payload path are validated against their roots before any write
- [x] CHK-032 [P1] Auth/authz working correctly — not applicable: no authentication surface in scope
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — parent and all seven phases validate `--strict` PASSED at `072da7777c`
- [x] CHK-041 [P1] Code comments adequate — every new comment states the durable why; the comment-hygiene gate passed on each commit
- [x] CHK-042 [P2] README updated (if applicable) — skill, runtime, CLI and 87 code-folder READMEs describe the `runtime/cli` topology
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — runner logs and lane logs live in the session scratchpad outside the repository; packet `scratch/` holds the inventory, path map, plan, scope manifest and launch script
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only recorded evidence; no task residue
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 0/12 |
| P1 Items | 12 | 0/12 |
| P2 Items | 1 | 0/1 |

**Verification Date**: 2026-09-05
<!-- /ANCHOR:summary -->

---



