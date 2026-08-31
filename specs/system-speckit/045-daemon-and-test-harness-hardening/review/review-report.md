# Deep Review Report — Packet 045 (daemon-and-test-harness-hardening)

Session: `2026-08-31-auto-deep-review-045` · Generation 1 · lineageMode `resume` · stopPolicy `max-iterations` · maxIterations 4
Reviewer: `cli-codex` (gpt-5.6-luna, reasoning xhigh, service tier fast)
Spec folder: `specs/system-speckit/045-daemon-and-test-harness-hardening`

## 1. Executive Summary

- **Overall verdict: CONDITIONAL**
- **hasAdvisories: true** (eight P2 advisory carry-forwards remain)
- **P0 = 0 · P1 = 3 active · P2 = 8 advisory · Resolved this lineage: 2**
- Review scope: implementation across four phases (production-db isolation, orphan daemon reaping, test-hang containment, live-follow log hygiene), `specs/cli-external-orchestration/058-flag-enum-authority`, the `cli-external-orchestration` skill surface, and the cli-devin documentation surface.
- Three iterations ran on Grok 4.6 xhigh, DeepSeek V4 Flash Max, and Codex gpt-5.6-luna. Iteration 4 was a deliberate adversarial final pass: confirm or refute every still-open P1 and verify the operator's claim that P1-004 / P1-005 are now fixed.

## 2. Planning Trigger

- `/speckit:plan [remediation]` — required.
- Three active P1s survive four independent passes. They are small, well-localized defects with concrete fixes and file:line evidence. A remediation plan should treat them as one focused workstream plus an optional P2 carry-forward advisories section.

```json
{
  "triggered": true,
  "verdict": "CONDITIONAL",
  "hasAdvisories": true,
  "activeFindings": [
    "P1-001",
    "P1-002",
    "P1-003"
  ],
  "remediationWorkstreams": [
    {
      "id": "WS-P1-001",
      "title": "Enforce orphan-sweep kill switch at the apply API boundary",
      "findingId": "P1-001",
      "smallestFix": "Make `applySweep()` fail closed when `opts.enabled` is omitted, with the CLI payload passing an explicit decision; add a direct-call regression case to `orphan-daemon-reaping.vitest.ts`."
    },
    {
      "id": "WS-P1-002",
      "title": "Re-evaluate orphan classification at apply time using fresh parent evidence",
      "findingId": "P1-002",
      "smallestFix": "Reclassify/re-evaluate each candidate at apply time from current parent ownership (or add an explicit second pass) and add a transition test that exercises parent death between `planSweep` and `applySweep`."
    },
    {
      "id": "WS-P1-003",
      "title": "Reconcile cli-devin root precondition and environment table with the canonical probe",
      "findingId": "P1-003",
      "smallestFix": "Version-scope every historical probe result in the cli-devin playbook root and DV-004 evidence; align the root precondition and the reference environment table with the five canonical values plus aliases."
    }
  ],
  "specSeed": [
    "P1-001 — `process-sweep.ts` exported boundary needs an explicit opt-in/fail-closed contract for `enabled`.",
    "P1-002 — `process-sweep.ts applyCandidate` needs fresh parent evidence at apply time; one-pass contract must be documented if intentional.",
    "P1-003 — cli-devin root playbook must align with `cli-external-orchestration/SKILL.md` installed-binary authority rule and reflect packet 058 enum reconciliation."
  ],
  "planSeed": [
    "Workstream WS-P1-001: 1 file (process-sweep.ts) + 1 regression case (orphan-daemon-reaping.vitest.ts).",
    "Workstream WS-P1-002: 2 files (process-memory-harness.ts, process-sweep.ts) + 1 transition test (orphan-daemon-reaping.vitest.ts).",
    "Workstream WS-P1-003: 3 files (cli-devin/manual-testing-playbook/manual-testing-playbook.md, cli-devin/references/cli-reference.md, optional .opencode/skills/cli-external-orchestration/SKILL.md note)."
  ],
  "findingClasses": {
    "P1-001": "cross-consumer",
    "P1-002": "instance-only",
    "P1-003": "cross-consumer"
  },
  "affectedSurfacesSeed": {
    "P1-001": ["process-sweep library API", "session-cleanup plugin", "CLI entry point", "kill switch contract"],
    "P1-002": ["applyCandidate gate ordering", "plan-vs-apply snapshot freshness", "orphan reaper correctness"],
    "P1-003": ["cli-devin manual-testing-playbook root", "cli-devin/references/cli-reference.md environment table", "DV-004 evidence staleness"]
  },
  "fixCompletenessRequired": true,
  "resolvedThisLineage": ["P1-004", "P1-005"],
  "deferredAdvisories": ["P2-001", "P2-002", "P2-003", "P2-004", "P2-005", "P2-006", "P2-007", "P2-008"]
}
```

## 3. Active Finding Registry

Three P1s are active after iteration 4. Two prior P1s (P1-004, P1-005) are now resolved through adversarial re-check.

### P0

None.

### P1 (active)

#### P1-001 — Orphan-sweep kill switch remains bypassable through the library surface

- **File:** `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:83-87, 232-252, 389-395`
- **Class:** cross-consumer
- **Evidence:** `applySweep()` runs candidates when `opts.enabled` is omitted. The CLI payload builder (`process-sweep.ts:389-395`) reads `isSweepEnabled(env)` and forwards it explicitly, but the exported apply function does not require it. The in-tree direct caller `session-cleanup.js:63-66, 208-218` honors the switch only because it goes through the CLI; an arbitrary caller could bypass it.
- **Counterevidence sought:** an explicit CLI-only contract, or a direct caller that always forwards the switch.
- **Final severity:** P1. **Confidence:** high. **Downgrade trigger:** documented opt-in/fail-closed library contract plus a direct API test.
- **Disposition:** active.
- **Smallest correct fix:** enforce the switch at the apply API boundary; CLI passes an explicit decision; omitted `enabled` fails closed. Add the direct-call regression case.
- **Worth fixing?** Yes.

#### P1-002 — Plan-time parent evidence leaves a newly orphaned daemon unreaped

- **File:** `.opencode/skills/system-spec-kit/scripts/ops/process-memory-harness.ts:395-407`; `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts:201-216`
- **Class:** instance-only
- **Evidence:** A daemon with a live parent at inventory time is classified as `project-daemon`. If that parent dies before apply, the row retains the plan-time classification and `applyCandidate()` returns before the fresh parent check. The existing transition test (`orphan-daemon-reaping.vitest.ts:240-268`) injects a constant live-parent callback and does not exercise the parent-dies-mid-sweep transition.
- **Counterevidence sought:** a transition test or a documented one-pass contract that intentionally preserves any row not orphaned at plan time.
- **Final severity:** P1. **Confidence:** high. **Downgrade trigger:** documented second-pass semantics with a transition test proving the intentional deferral.
- **Disposition:** active.
- **Smallest correct fix:** reclassify/re-evaluate the candidate at apply time from fresh parent evidence (or add an explicit second pass) and add a parent-death transition test.
- **Worth fixing?** Yes.

#### P1-003 — cli-devin still exposes contradictory permission-mode authority

- **File:** `.opencode/skills/cli-external-orchestration/cli-devin/manual-testing-playbook/manual-testing-playbook.md:42-50, 91-99, 136-141`; `.opencode/skills/cli-external-orchestration/cli-devin/references/cli-reference.md:110-134, 599-605`
- **Class:** cross-consumer
- **Evidence:** The root playbook says its audit was against Devin 3000.6.7 and that `smart` is accepted, but its global precondition still says `smart` must not be treated as valid. The stale DV-004 row remains reachable. The reference's environment table omits `autonomous` and keeps an incomplete old enum. The parent rule at `.opencode/skills/cli-external-orchestration/SKILL.md:169` makes the installed binary authoritative.
- **Counterevidence sought:** a version-scoped qualifier that makes the old values historical only, or a narrower parser contract that excludes the audited runtime.
- **Final severity:** P1. **Confidence:** high. **Downgrade trigger:** version-scope every historical result and align the root precondition/table with the canonical probe.
- **Disposition:** active.
- **Smallest correct fix:** make the root precondition and DV-004 evidence version-scoped, then update the environment table to the accepted values and aliases.
- **Worth fixing?** Yes.

### P1 (resolved this lineage)

#### P1-004 — Phase 3 completion evidence gap → RESOLVED

- **File:** `specs/system-speckit/045-daemon-and-test-harness-hardening/003-test-hang-containment/goal.md:61-84`; `implementation-summary.md:81-83`; `tasks.md:53-65`
- **Class:** matrix/evidence
- **Adjudication:** Goal criteria 61-64 are checked; LOG section records 1200ms bound → exit 124 "terminating process group", reporter named `Timeout`, generous-bound healthy run (9 passed, margin 178907ms), and baseline duration. Runner implements the bound and process-group termination at `run-tests.mjs:11-49, 71-97`; reporter at `mcp-server/vitest.config.ts:35`.
- **Residual limitation:** no replayable fixture/transcript is checked in. That is a proportional P2 traceability follow-up, not a P1.
- **Disposition:** resolved.

#### P1-005 — Phase 4 completion evidence gap → RESOLVED

- **File:** `specs/system-speckit/045-daemon-and-test-harness-hardening/004-live-follow-log-hygiene/goal.md:61-84`; `implementation-summary.md:83-87`; `tasks.md:53-65`
- **Class:** matrix/evidence
- **Adjudication:** Goal criteria 61-64 are checked; LOG section records held-divergence deduplication (4 → 1), re-entry producing a second entry, cap rotation with `.log.1` retained, and pid-lock preservation. Implementation matches at `git-live-follow.sh:89-121, 198-238`.
- **Residual limitation:** no replayable synthetic-repository harness is checked in. That is a proportional P2 traceability follow-up, not a P1.
- **Disposition:** resolved.

### P2 (advisory, deferred)

P2-001 through P2-008 remain advisory carry-forwards and are deferred. They do not block release. Iter 4 did not re-open any of them and explicitly ruled out the ruled-out directions from iter 1 (ancestor/self/unknown-owner process termination, bind-mount and symlink identity defeat, fast-forward merge/reset clobbering, packet 058 core authority drift).

| ID | Title | File | Class |
|----|-------|------|-------|
| P2-001 | Wall-clock grace window vulnerable to NTP adjustment | process-sweep.ts:213-216 | instance-only |
| P2-002 | Apply-time socket-peer check passes empty socketPath, broadens filter | process-sweep.ts:217-220 | instance-only |
| P2-003 | run-tests.mjs hardcoded 10-minute default timeout excessive for mcp-server lane | run-tests.mjs:11-69 | instance-only |
| P2-004 | git-live-follow.sh LOCK_KEY uses CRC32 truncation only | git-live-follow.sh:83 | cross-consumer |
| P2-005 | git-live-follow.sh log rotation mv-then-truncate can lose the only historical copy | git-live-follow.sh:89-186 | instance-only |
| P2-006 | git-live-follow.sh lock acquisition has TOCTOU race between check and write | git-live-follow.sh:125-253 | cross-consumer |
| P2-007 | paths.ts isTestContext is env-only; vitest worker without env inheritance silently loses isolation | paths.ts:67-99 | class-of-bug |
| P2-008 | paths.ts workspace-root walk uses symlinked dirname; symlinked deployment can mislead root resolution | paths.ts:33-114 | instance-only |

## 4. Remediation Workstreams

Ordered P0 → P1 → P2 advisory. P0 absent.

1. **WS-P1-001** — Enforce orphan-sweep kill switch at the apply API boundary. File: `process-sweep.ts`. Companion regression case in `orphan-daemon-reaping.vitest.ts`.
2. **WS-P1-002** — Re-evaluate orphan classification at apply time using fresh parent evidence. Files: `process-memory-harness.ts`, `process-sweep.ts`. Companion transition test in `orphan-daemon-reaping.vitest.ts`.
3. **WS-P1-003** — Reconcile cli-devin root precondition and environment table with the canonical probe. Files: `cli-devin/manual-testing-playbook/manual-testing-playbook.md`, `cli-devin/references/cli-reference.md`. Optional: a clarifying note in `cli-external-orchestration/SKILL.md`.
4. **(Advisory)** P2-001 through P2-008 — collected into a deferred advisory workstream. None are release-blocking. P2-007 and P2-008 deserve a proportional second look if vitest worker behavior under symlinked deployments ever matters in production.

## 5. Spec Seed

- P1-001 — `process-sweep.ts` exported boundary needs an explicit opt-in/fail-closed contract for `enabled`. Document the CLI-only-vs-library distinction in the help banner and in a doc-comment at `applySweep`.
- P1-002 — `process-sweep.ts applyCandidate` needs fresh parent evidence at apply time; one-pass contract must be documented if intentional, with a transition test that proves the deferral.
- P1-003 — cli-devin root playbook must align with `cli-external-orchestration/SKILL.md` installed-binary authority rule and reflect packet 058 enum reconciliation (five canonical values plus both alias groups).

## 6. Plan Seed

- WS-P1-001: 1 file (process-sweep.ts) + 1 regression case (orphan-daemon-reaping.vitest.ts).
- WS-P1-002: 2 files (process-memory-harness.ts, process-sweep.ts) + 1 transition test (orphan-daemon-reaping.vitest.ts).
- WS-P1-003: 2 files (cli-devin/manual-testing-playbook/manual-testing-playbook.md, cli-devin/references/cli-reference.md); optional 1 file (.opencode/skills/cli-external-orchestration/SKILL.md note).

## 7. Traceability Status

- `spec_code` — partial. P1-001 through P1-003 still trace to implementation/consumer seams; Phases 3 and 4 completion claims now have durable goal-log measurements and checked criteria.
- `checklist_evidence` — partial. Tasks and goal criteria are reconciled for Phases 3 and 4, but the evidence is prose-log based rather than replayable artifacts.
- `skill_agent` — partial. The parent skill's installed-binary authority is correct, but the cli-devin root precondition and table remain stale.
- `agent_cross_runtime` — partial. The authority rule is hoisted correctly, while the Devin playbook still exposes historical contradictory guidance.
- `feature_catalog_code` — not applicable.
- `playbook_capability` — fail for the stale permission guidance; pass for the newly recorded Phase 3/4 capability results.
- `AC_COVERAGE` — exempt for spec-folder targets above Level 1 where the lifecycle is in-progress; surfaced as advisory in synthesis.

Resource Map Coverage Gate: `resource-map.md` is absent at the spec folder; the gate is skipped.

## 8. Deferred Items

- P2-001 through P2-008 — eight advisory carry-forwards, no new evidence in iter 4. Each has a clear file:line and a one-sentence fix; none blocks the current verdict.
- P1-004 / P1-005 — resolved this lineage; a checked-in replayable harness/transcript for Phases 3 and 4 would be a proportional P2 traceability improvement and could be tracked as a future P2 if the operator wants replay-grade artifacts.

## Dimension Expansion Map

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept directions: none yet recorded as a single sweeping event; iter 1 explicitly ruled out ancestor/self/unknown-owner process termination, bind-mount and symlink identity defeat, fast-forward merge/reset clobbering, and packet 058 core authority drift. Iter 4 added rule-outs for completion_evidence_gap (Phase 3, Phase 4).
- Pivot lineage: none yet
- Remaining frontier: small fixes for the three active P1s

## 9. Search Ledger

- `searchCoverage.graphCoverageMode`: `graphless_fallback`
- `candidateCoverage`: covered = [`kill_switch_bypass`, `stale_parent_classification`, `permission_enum_drift`, `completion_evidence_gap`, `log_state_transition_regression`], ruledOut = 5 (completion_evidence_gap ×2 + the four iter-1 rule-outs), deferred = [`advisory_carry_forward` ×1], blocked = []
- `searchDebt`: 1 item — `iteration 4 advisory_carry_forward (deferred): P2 carry-forward policy.; evidence=specs/system-speckit/045-daemon-and-test-harness-hardening/review/deep-review-strategy.md`
- `ruledOutCandidates`: completion_evidence_gap ×2, plus iter-1 rule-outs
- `cleanSearchProof`: completion_evidence_gap ×2

`hasSearchDebt: true`. The debt is a single P2 advisory carry-forward policy marker, not an unresolved required bug class. Verdict remains CONDITIONAL on the active P1s, not on search debt.

## 10. Audit Appendix

- Convergence summary: 4 iterations completed; iteration 4 reached max_iterations under stopPolicy=max-iterations; convergence signals treated as telemetry.
- Coverage summary: 4 of 4 review dimensions covered (correctness, security, traceability, maintainability). Search coverage mode: graphless_fallback.
- Ruled-out claims: completion_evidence_gap (Phases 3 and 4) ruled out as required bug classes after adversarial verification; iter-1 ancestor/self/unknown-owner process termination, bind-mount/symlink identity defeat, fast-forward merge/reset clobbering, and packet 058 core authority drift ruled out.
- Sources reviewed: implementation files in `.opencode/skills/system-spec-kit/{shared,scripts/ops,vitest.config.ts}`, `.opencode/bin/{system-spec-memory-launcher.cjs,lib/model-server-supervision.cjs,git-live-follow.sh}`, `.opencode/plugins/session-cleanup.js`, `.opencode/skills/system-spec-kit/mcp-server/{scripts/run-tests.mjs,vitest.config.ts,tests/*.vitest.ts}`, `specs/system-speckit/045-daemon-and-test-harness-hardening/{goal.md,001-004/*}`, `specs/cli-external-orchestration/058-flag-enum-authority/{spec.md,plan.md,tasks.md,implementation-summary.md}`, and `.opencode/skills/cli-external-orchestration/{SKILL.md,cli-devin/SKILL.md,cli-devin/references/cli-reference.md,cli-devin/manual-testing-playbook/}`.

### Core Protocols

- spec_code: partial
- checklist_evidence: partial

### Overlay Protocols

- skill_agent: partial
- agent_cross_runtime: partial
- feature_catalog_code: not applicable
- playbook_capability: fail for stale permission guidance; pass for newly recorded Phase 3/4 capability results

---

**Status:** `complete` · **Verdict:** `CONDITIONAL` · **Stop reason:** `maxIterationsReached` · **hasAdvisories:** `true` · **activeP0:** 0 · **activeP1:** 3 · **activeP2:** 8 · **resolved this lineage:** 2
