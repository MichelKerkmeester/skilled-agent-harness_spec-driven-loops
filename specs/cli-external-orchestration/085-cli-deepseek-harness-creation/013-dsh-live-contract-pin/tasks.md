---
title: "Tasks: Phase 13: dsh-live-contract-pin"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "dsh live contract pin tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 13: dsh-live-contract-pin

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

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`E` is this phase's `evidence/` folder. `P` is `.dsh/patches/`. Every task runs in the orchestrating Claude session with the operator present.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the operator keyed the LLM Gateway route without reading or printing its key. Verify: `evidence/route-llmgateway.exit.txt` prints `0` and `evidence/latency-and-tokens.md` records the route as verified.
- [x] T002 Save the `~/.dsh` baseline (`E/dsh-home-before.txt`). Verify: `evidence/dsh-home-before.txt` records the baseline listing.
- [x] T003 Confirm the pinned binary (`E/version.txt`). Verify: `evidence/version.txt` records `0.2.2-rc.1`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Run the LLM Gateway route `deepseek-v4.1-flash-1017` with the OK prompt (`E/route-llmgateway.stdout.jsonl`, `.stderr.txt`, `exit.txt`). Verify: `evidence/route-llmgateway.exit.txt` is `0` and the last event is `completed`.
- [x] T005 Record OpenCode Go `deepseek-v4.1-flash` as configured, not verified because `OPENCODE_API_KEY` was unset. No request was sent. Verify: `evidence/latency-and-tokens.md` records the status and reason.
- [x] T006 Probe confinement in a temp workspace: inside succeeds, a `$HOME` write outside the cwd is denied, a sibling OS temp write is allowed and `bash echo ok` completes (`E/confinement.*`). Verify: `evidence/confinement.md` records each result and the temp exception.
- [x] T007 Verify Gateway `max` reasoning and record the developer-role compat setting (`E/reasoning-max.*`). `supportsDeveloperRole: false` completed; `true` remains UNKNOWN because no variant patch was sent. Verify: `evidence/reasoning-max.md`.
- [x] T008 Run the saved Gateway deep-research lineage evidence (`E/fanout-lineage.*`). Verify: `evidence/fanout-lineage.md` records two completed runs and a clean containment scan on the second.
- [x] T009 Record task-to-final latency and token counts per route (`E/latency-and-tokens.md`). Verify: `evidence/latency-and-tokens.md` has one row for each route.
- [x] T010 Compare both route patches with saved evidence. No proven value is wrong, so leave both unchanged. Gateway values match the observed run. OpenCode Go has no live request, so the evidence does not justify a correction. Verify: `evidence/reasoning-max.md`, `evidence/route-llmgateway.stdout.jsonl` and `evidence/latency-and-tokens.md`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Replace answered UNKNOWN entries and retain unanswered ones with their reasons. `hard-rules.json` had no UNKNOWN entry. Verify: `evidence/unknown-audit.txt` lists only explained UNKNOWN entries.
- [x] T012 Promote only LLM Gateway as default, record OpenCode Go as configured, not verified, set the preventive-sandbox capability with its temp caveat and add the live-contract entry. Verify: `evidence/live-contract-count.txt` records count 1 and valid JSON. The runtime typecheck passed. The four-suite sandbox run had 355 passed and only the two documented environment failures in `../012-deep-loop-modes-and-commands/evidence/sandbox-test-disposition.txt`.
- [x] T013 Write and link the re-pin runbook in the packet `references/`. Verify: `references/repin-runbook.md` covers T004 through T008 with placeholders and no key.
- [x] T014 Compare `~/.dsh` with the baseline and scan evidence for secrets (`E/dsh-home-after.txt`). Verify: `evidence/secret-scan-and-home-diff.txt` records zero differences and a clean secret scan.
- [x] T015 Validate this phase folder. Verify: `evidence/validate-strict.txt` contains `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence: T001 through T015 have saved evidence paths.
- [x] No `[B]` blocked tasks remaining. Evidence: no task carries the `[B]` state.
- [x] Saved manual verification evidence passed. Evidence: the Gateway route and clean second lineage completed; OpenCode Go has no request and remains unverified.
- [x] Each route has a status in the packet and runtime defaults include only verified routes. Evidence: `references/providers-and-models.md`, `executor-config.ts` and `evidence/live-contract-count.txt`.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: `../001-deep-research/research/phase-plan.md` Section 2 and `../001-deep-research/research/research.md` Section 12
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

A route that cannot be keyed or reached is recorded "configured, not verified" with the reason. Do not fabricate stderr for a route that received no request.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
  - Evidence: REQ-001 through REQ-006 in `spec.md`.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - Evidence: `plan.md` describes the saved probes, route promotion and validation steps.
- [x] CHK-003 [P1] Phase 006 strict validation passed, phase 008 guard bundle evidence is available and the operator keyed the Gateway route
  - Evidence: `../006-deep-loop-executor-kind/evidence/closeout-validation.txt`, `../008-dsh-repo-guards-safety-wave/evidence/bundle-node-test-run.txt` and `evidence/route-llmgateway.exit.txt`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every stateful or live model probe uses a fresh temp `DSH_HOME`
  - Evidence: `evidence/latency-and-tokens.md`, `evidence/confinement.md` and `evidence/fanout-lineage.md` record fresh temp workspaces and homes.
- [x] CHK-011 [P0] Every attempted run saves stdout, stderr and exit status verbatim; an unattempted route has a recorded reason
  - Evidence: Gateway route and confinement captures in `evidence/`; OpenCode Go has no request because its key was unset (`evidence/latency-and-tokens.md`).
- [x] CHK-012 [P1] Route patch values match observed evidence; any correction composes with no unmatched-target warning
  - Evidence: the checked-in Gateway values match `evidence/route-llmgateway.stdout.jsonl` and `evidence/reasoning-max.md`. No patch correction was needed. OpenCode Go had no live request.
- [x] CHK-013 [P1] Phase 006 suites produce no failures beyond the documented sandbox disposition
  - Evidence: `evidence/phase-006-focused-vitest.txt` reports 355 passed. Its only two failures match the documented sandbox disposition. The runtime typecheck exits 0 in `evidence/phase-006-typecheck.txt`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
  - Evidence: all six rows in `acceptance-criteria.md` are Met with saved evidence.
- [x] CHK-021 [P0] Each keyed route has exit 0 with `completed`
  - Evidence: the only keyed route, LLM Gateway, exits 0 and completes (`evidence/route-llmgateway.exit.txt`, `route-llmgateway.stdout.jsonl`).
- [x] CHK-022 [P1] The confinement probe denies a `$HOME` write and records that OS temp remains writable
  - Evidence: `evidence/confinement.md` and its stdout/result captures.
- [x] CHK-023 [P1] The fan-out containment scan is clean
  - Evidence: `evidence/fanout-lineage.md` records the clean second run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

N/A: this phase fixes no reported finding.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No key value appears in `evidence/`, the transcript or any commit
  - Evidence: `evidence/secret-scan-and-home-diff.txt` records a clean scan. No commit was created.
- [x] CHK-031 [P0] `~/.dsh` is identical before and after the phase
  - Evidence: `evidence/secret-scan-and-home-diff.txt` records zero differences.
- [x] CHK-032 [P1] Only the verified LLM Gateway route is the default; OpenCode Go stays explicit-only
  - Evidence: `DSH_DEFAULT_MODEL` in `executor-config.ts`, `references/providers-and-models.md` and `evidence/live-contract-count.txt`.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
  - Evidence: the outcome and verification state agree across `spec.md`, `plan.md` and this checklist.
- [x] CHK-041 [P1] Packet references and `hard-rules.json` agree with the evidence
  - Evidence: `evidence/unknown-audit.txt` records the unresolved items and reasons. `hard-rules.json` has no UNKNOWN entries.
- [x] CHK-042 [P2] The re-pin runbook is linked from the packet `SKILL.md`
  - Evidence: `SKILL.md` links to `references/repin-runbook.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Disposable homes live under `mktemp -d`, never in the repository
  - Evidence: saved route, confinement and lineage records identify fresh temp homes.
- [x] CHK-051 [P1] scratch/ cleaned before completion
  - Evidence: `evidence/scratch-clean.txt` records that `scratch/` contains only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 10 | 10/10 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-06. Evidence files are linked on each checklist row.
<!-- /ANCHOR:summary -->

---
