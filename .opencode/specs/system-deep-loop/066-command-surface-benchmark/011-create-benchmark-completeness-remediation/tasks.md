---
title: "Tasks: create-benchmark completeness remediation"
description: "Task ledger mapping every verified P1/P2 finding from the Fable 5 + Sol Ultra dual review to a scoped, behavior-preserving fix, plus the Sol Ultra re-review gate."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation"
    last_updated_at: "2026-07-15T18:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored task ledger from dual-review findings"
    next_safe_action: "Execute T003 (router fix)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/create-benchmark/SKILL.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Tasks: create-benchmark completeness remediation

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` open · `[x]` complete. Each task carries its severity, target file(s), and the fix, grounded in the dual-review evidence under `evidence/`. Findings are hypotheses until confirmed against the real file at edit time.
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Fold the remediation into packet 066 as this child; author spec, plan, tasks, checklist; generate metadata. (`f585e94db5`)
- [x] T002 — Archive the two dual-review reports verbatim under `evidence/` as the finding source of truth.
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**P1 (functional + authoring blockers)**

- [x] T003 (P1) — **Router fallback + family keying.** `DEFAULT_RESOURCE` → `references/shared/README.md`; `FAMILY_DISK_KEY` maps `mcp_promotion`→`shared`. Shipped `3c7f512131`; re-review confirmed CLOSED (Sol P1-5).
- [x] T004 (P1) — **Behavior schema-v2 scaffold.** Scenario template carries a v2 block; index schemaVersion wording conditional; guide §6 teaches one-block-per-file. Shipped `3c7f512131`. Re-review found scaffold defects (v1 block lacked evidence_kind/min_seats for ai-council/improvement; postcondition/command_topology gaps) — all corrected in `8ab89656c6`.
- [x] T005 (P1) — **Conformance exemplar completion.** Authored the family README + `command-surface/conformance_benchmark.md`; corrected the "planned adapter" wording. Shipped `cec7160e47`. Re-review found a false "no run" status and a broken verify command — both corrected in `8ab89656c6`.

**P2 (create-benchmark-local)**

- [x] T006 (P2) — **Command-benchmark first-classing.** Added `references/shared/command_benchmark_composition.md` (matrix-manifest field shape), composition note, routing keys, unknown-fallback line. Shipped `f82e58ba9b`; router-overclaim + resultPointer gaps corrected in `8ab89656c6`.
- [x] T007 (P2) — **Route-map refresh.** `references/shared/README.md` now lists conformance (§12), Lane A (§14), and the composition guide. Shipped `f82e58ba9b`.
- [x] T008 (P2) — **Phantom Lane D + guide wording.** Removed the "Lane A/D" phantom. The scorer/seed reconciliation was over-corrected and re-fixed in `8ab89656c6` (author does NOT select scorer/seed; lane-owned). Shipped `f82e58ba9b`.
- [x] T009 (P2) — **Deep-command links.** `/deep:command-benchmark` real link in both guides; Lane A `/deep:agent-improvement` retargeted to the command; direct `/deep:model-benchmark` link added. Shipped `f82e58ba9b`.
- [x] T010 (P2) — **Lane C fixture-authoring link.** Linked `scenario_authoring.md` + the `create-manual-testing-playbook` corpus handoff. Shipped `f82e58ba9b`.

**P2 (cross-tree exemplar sweep — full-sweep, hyphen-pilot-aware)**

- [x] T011 (P2) — **MCP consumer README + template href.** Validator path → `sk-doc/shared/scripts/`; dangling "Section 6" → create-benchmark SKILL §4–§8; template href `../../README.md`→`../README.md`. Non-promoted folders already carried HOLD/UNREPORTED status (no redundant "legacy" tag). Shipped `413f463c22`.
- [x] T012 (P2) — **Lane C exemplar READMEs.** Added run-label index (system-deep-loop), authored the missing deep-improvement index, labeled sk-code legacy sidecars (no rename, no hyphen reversion). Shipped `91e0449be6`; sk-code headline contradiction re-fixed in `8ab89656c6`.
- [x] T013 (P2) — **Behavior-index back-pointers.** Added create-benchmark back-pointers to the four deep-mode behavior_benchmark.md indexes. Shipped `91e0449be6`.
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 (P1) — **GPT-5.6 Sol Ultra Fast re-review.** Dispatched against the patched tree (tip `91e0449be6`); report archived at `evidence/review-sol-ultra-rereview.md`. Verdict FAIL: 10 new issues (4 P1) plus surviving PARTIAL findings. Every load-bearing claim was independently verified against real files; the confirmed regressions were closed in `8ab89656c6`, and the deeper structural findings are recorded below (T016).
- [x] T015 (P1) — **Validate + ship.** `validate_document.py` 0 issues on every edited doc; `validate.sh --strict` on this child is Errors:0 Warnings:0 RESULT:PASSED; commits pathspec-scoped + FF-pushed to `skilled/v4.0.0.0` (`3c7f512131`, `cec7160e47`, `f82e58ba9b`, `413f463c22`, `91e0449be6`, `8ab89656c6`); completion metadata reconciled here.

**Re-review regressions (all CLOSED in `8ab89656c6`)**

- [x] N1 broken oracle verify command (path-doubling) · N2 false "no run" status (004 has a completed FAIL run) · N3/N5 v1 scaffold missing evidence_kind/min_seats/candidate_evidence + postcondition shape · N6 router-overclaim prose · N7 matrix `resultPointer` omission · N8 scorer/seed over-claim · N9 sk-code stale headline.
- N4 = the `cec7160e47` commit-sweep of 16 concurrent-session files (disclosed to operator; not un-swept — needs force-push, forbidden). N10 = this metadata reconciliation.

**T016 — surviving structural findings (ESCALATED, beyond doc-remediation scope)**

- [ ] Sol P1-2 — Lane C primary-corpus authoring not wired end-to-end (needs a fixture-pair scaffold in `create-manual-testing-playbook`, not just a link).
- [ ] Sol P1-3 / Fable #5 — `command_benchmark` is not a router `FAMILIES` key (adding it is a runtime router change, not a doc edit).
- [ ] Sol P1-4 — Lane B reviewer-profile authoring excluded although a live `reviewer_regression.json` exists (needs a reviewer-profile template + policy decision).
- [ ] Sol P1-6 / Fable #1 — conformance guide requires package-local fixtures, but the shipped manifest uses an external `fixtureRoot`; the doctrine needs an explicit decision on which pattern is canonical.
- [ ] Lower-severity: Fable #8 (`/create:benchmark` 2-of-6 coverage note), Sol P2-4 (stale Lane B profile-count README), Sol P2-6 (RVB-001 budget mismatch, ACB seat wording), Sol P2-7 (vision-audit classification).
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All P1/P2 findings closed or explicitly labeled legacy, both review reports archived under `evidence/`, the Sol Ultra re-review clean of surviving P1, and strict validation green.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Evidence: `evidence/review-sol-ultra.md`, `evidence/review-fable.md`. Related closeout: `../010-scorecard-and-closeout/`.
<!-- /ANCHOR:cross-refs -->
