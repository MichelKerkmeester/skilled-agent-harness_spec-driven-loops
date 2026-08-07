---
title: "Verification Checklist: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced"
description: "Verification checklist for 028-fanout-dispatch-integrity: baseline-before-delta evidence, a negative test per confirmed finding, and independent adversarial verification."
trigger_phrases:
  - "fanout dispatch integrity"
  - "fanout fulfillment artifact contract"
  - "write containment dirty path"
  - "executor audit provenance"
  - "deep loop 028 fanout"
importance_tier: "high"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/028-fanout-dispatch-integrity"
    last_updated_at: "2026-07-30T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the verification checklist from the WS1 phase-tree proposal"
    next_safe_action: "Run checklist items after phase execution completes"
    blockers: []
    key_files:
      - "checklist.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

# Verification Checklist: Make Fan-Out Fulfillment Evidence-Derived and Dispatch Containment Enforced

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

Evidence strings must name a **test name + suite-content digest + candidate SHA**. A bare run count is not evidence: reconciling exactly that failure is what child `021` exists for.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] All scoped finding IDs classified by T001 before any edit
  - **Evidence**: T001 table in `tasks.md`: every ID carries `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` plus a cited probe
- [ ] CHK-002 [P0] Pre-edit baseline captured for every runner this child touches
  - **Evidence**: Recorded discovered-test count, pass/fail/skip, and exit code per runner, at a named SHA

- [ ] CHK-010 [P0] Isolated worktree confirmed before any dispatch test runs
  - **Evidence**: Worktree path recorded; main checkout `git status` unchanged across the whole child
- [ ] CHK-011 [P0] Existing lineage artifact shapes enumerated
  - **Evidence**: Shape census so the contract does not reject genuine lineages
- [ ] CHK-012 [P1] Wrapper shell usage enumerated before argv migration
  - **Evidence**: List of wrappers relying on shell features, with replacements named
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-020 [P0] No dispatch path hardcodes a permission bypass
  - **Evidence**: Grep for `--dangerously-skip-permissions` in dispatch paths returns none
- [ ] CHK-021 [P0] Containment logic is not conditioned on dispatch kind
  - **Evidence**: Grep for kind names inside the containment boundary returns none
- [ ] CHK-022 [P1] No ephemeral artifact labels embedded in shipped code comments
  - **Evidence**: Comment hygiene review of the diff
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-003 [P0] Every confirmed finding has a negative test that is red pre-fix and green post-fix
  - **Evidence**: Named test per finding, with the red run and the green run both recorded
- [ ] CHK-004 [P0] Whole gate re-run at close and reported as a delta against the baseline
  - **Evidence**: Post-edit run of every runner, delta table vs CHK-002
- [ ] CHK-005 [P1] Independent adversarial verification pass by a different actor than the builder
  - **Evidence**: Verification record naming the actor and the defects found (or explicitly none)

- [ ] CHK-030 [P0] A lineage with a report but a missing, duplicated or inconsistent state JSONL fails fulfillment
  - **Evidence**: Three named tests
- [ ] CHK-031 [P0] A lineage with a self-reported count and no iteration files fails fulfillment
  - **Evidence**: Named test
- [ ] CHK-032 [P0] One containment test per supported dispatch kind, none skipped
  - **Evidence**: Per-kind test list with results
- [ ] CHK-033 [P0] Truncation of a pre-existing dirty out-of-scope file is detected
  - **Evidence**: Content-identity based named test
- [ ] CHK-034 [P0] An out-of-worktree artifact scope is a hard dispatch failure
  - **Evidence**: Named test
- [ ] CHK-035 [P1] A topic containing quotes, semicolons and spaces survives argv dispatch
  - **Evidence**: Named test with the exact payload recorded
- [ ] CHK-036 [P1] Materially different invocations produce distinguishable audit blocks
  - **Evidence**: Assertions in the existing receipts suites
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each of the 12 scoped findings has a finding class recorded (`CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED`) from T002
  - **Evidence**: T002 output table in `tasks.md` lists all 12 IDs with a classification and a cited probe
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for report-only fulfillment and self-reported iteration counts
  - **Evidence**: `rg -n "fulfil|fulfill|report" .opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` reviewed for every remaining acceptance path outside the new artifact contract
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for the executor audit and observability sink fields this child adds
  - **Evidence**: Every reader of `executor-audit.ts` JSONL and `observability-events.cjs` records enumerated; none breaks on the added fields
- [ ] CHK-FIX-004 [P0] An adversarial dispatch-kind case is exercised: a kind with no supported sandbox mode
  - **Evidence**: Named test asserting the dispatch is rejected, not recorded as effective
- [ ] CHK-FIX-005 [P1] The {12 findings} x {fixed, `REFUTED`, `ALREADY-FIXED`} disposition matrix is listed before completion is claimed
  - **Evidence**: T002 classification table cross-tabulated against the fix set in `implementation-summary.md`
- [ ] CHK-FIX-006 [P1] The per-mode artifact contract is exercised against every enumerated lineage shape from T003, not only a synthetic example
  - **Evidence**: Shape census from T003 mapped one-to-one against contract test fixtures
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-007 [P1] Severity calibration carried into the spec and not re-escalated
  - **Evidence**: `spec.md` §2 contains the calibration block verbatim

- [ ] CHK-040 [P0] Credential-shaped keys and prompt or error text in nested payloads are redacted or rejected at the sink
  - **Evidence**: Named tests per payload shape
- [ ] CHK-041 [P1] A parent environment variable outside the allowlist is absent in the Codex child
  - **Evidence**: Named test
- [ ] CHK-042 [P1] No concurrent session file was touched during this child
  - **Evidence**: Main checkout `git status` unchanged across the whole child
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-006 [P0] No evidence string cites a bare run count or raw line number
  - **Evidence**: Every evidence string carries a test name + suite digest + candidate SHA
- [ ] CHK-008 [P0] `validate.sh --strict` exits 0 for this child
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <child> --strict` -> exit 0

- [ ] CHK-050 [P1] The `F-016-01` calibration is carried, not escalated
  - **Evidence**: `spec.md` records it as a robustness fix with operator-supplied values
- [ ] CHK-051 [P1] The containment policy for kinds that cannot enforce a mode is written down
  - **Evidence**: Policy statement in the child
- [ ] CHK-052 [P1] The per-mode artifact contract is documented where a mode author will find it
  - **Evidence**: Contract location recorded with rationale
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-090 [P1] Temp files confined to `scratch/`
  - **Evidence**: No temp file outside `scratch/`; `git status` clean for out-of-scope paths
- [ ] CHK-091 [P1] Work ran in an isolated worktree, so no concurrent session's files were touched
  - **Evidence**: Worktree path recorded; `git status` in the main checkout unchanged across the run
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in `decision-record.md`
  - **Evidence**: ADR-001..ADR-003 present with context, alternatives, and consequences
- [ ] CHK-101 [P1] Every ADR carries a terminal status
  - **Evidence**: No ADR remains `Proposed` at close
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale
  - **Evidence**: Each ADR alternatives table names why the rejected option loses

- [ ] CHK-103 [P1] ADR-001 alternative (keep report-presence fulfillment with a warning) documented with rejection rationale
  - **Evidence**: ADR-001 alternatives table
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3: Behavior and Regression Verification

- [ ] CHK-110 [P0] Whole `runtime` suite plus the receipts suites re-run and reported as a delta
  - **Evidence**: Before/after discovered, pass, fail, skip, exit code
- [ ] CHK-111 [P1] Artifact-contract validation cost on the largest lineage recorded
  - **Evidence**: Wall-clock validation time, so a later regression is visible
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3: Landing Readiness

- [ ] CHK-120 [P0] Rollback procedure documented and rehearsed
  - **Evidence**: `plan.md` §7 and the L2 enhanced-rollback section; rehearsal recorded
- [ ] CHK-121 [P1] Completion metadata reconciled across spec/plan/tasks/implementation-summary
  - **Evidence**: No doc claims a completion state another doc contradicts
- [ ] CHK-122 [P1] `031` sequencing on `fanout-run.cjs` recorded
  - **Evidence**: Ordering in this child and in WS1 `MANIFEST.md`
- [ ] CHK-123 [P1] `024` directory coordination recorded
  - **Evidence**: File-ownership note for `runtime/lib/deep-loop/`
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3: Compliance Verification

- [ ] CHK-130 [P1] The observability-sink allowlist reads only its own payload and performs no network access
  - **Evidence**: Sink source reviewed; no fetch/network calls
- [ ] CHK-131 [P1] No fixture, audit record, or test payload embeds a credential, token, or absolute machine-local path
  - **Evidence**: Audit and sink test fixtures reviewed; only repo-relative or synthetic values present
- [ ] CHK-132 [P2] The `F-016-01` severity calibration (`spec.md` §2) is carried verbatim into `decision-record.md` ADR-002
  - **Evidence**: Grep confirms the calibration language is reused, not re-escalated
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3: Documentation Verification

- [ ] CHK-140 [P1] `spec.md`, `plan.md`, `tasks.md`, and `checklist.md` are synchronized at close
  - **Evidence**: Cross-read confirms no doc claims a completion state another doc contradicts
- [ ] CHK-141 [P1] `decision-record.md` records ADR-001 through ADR-003 in terms sibling children (`024`, `031`) can cite without re-deriving them
  - **Evidence**: `decision-record.md` ADRs reviewed for citability by `024` and `031`
- [ ] CHK-142 [P2] The per-mode artifact contract's chosen location (registry vs. per-asset) is documented where a future mode author will find it
  - **Evidence**: Contract location recorded with rationale in `plan.md` or the contract file itself
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 0/23 |
| P1 Items | 26 | 0/26 |
| P2 Items | 2 | 0/2 |

**Verification Date**: not yet run
**Verified By**: not yet assigned
**Status**: Planned — no item may be marked `[x]` without a test name, a suite-content digest, and a candidate SHA.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:sign-off -->
## L3: Sign-off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Independent verifier | REQ-U04 adversarial pass over the containment and fulfillment fix set | [ ] Approved | |
| `024` owner | `runtime/lib/deep-loop/` directory coordination sign-off | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
