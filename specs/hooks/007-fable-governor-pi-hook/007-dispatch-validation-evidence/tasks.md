---
title: "Tasks: Dispatch Validation, Evidence, and Corpus Baseline"
description: "Completed tasks for factory-level Pi evidence, claim reconciliation, and the full-corpus failure ledger."
trigger_phrases:
  - "dispatch evidence tasks"
  - "Pi factory evidence"
  - "Vitest baseline tasks"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/007-fable-governor-pi-hook/007-dispatch-validation-evidence"
    last_updated_at: "2026-08-04T22:51:09Z"
    last_updated_by: "phase007-evidence-refresh"
    recent_action: "Completed command-backed evidence tasks"
    next_safe_action: "Phase 008: reconcile packet state and generated metadata"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "checklist.md"
      - "evidence/full-corpus-baseline.md"
    session_dedup:
      fingerprint: "sha256:c6a419a57cc0e2332dee5ab8f33e7831fe35b6303710d46c695104e4f4e59b3f"
      session_id: "2026-08-04-cli-038-007-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Dispatch Validation, Evidence, and Corpus Baseline

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

Every completion row cites observed output. The full corpus is explicitly nonzero and is not treated as a passing gate.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P0] Run and save the focused Pi, shared matcher, Node rule, and headless-startup baselines before changing claims. [EVIDENCE: Pi suite final 32/32, shared matcher 351/351, Node rule 7/7, and encoded headless runtime smoke exit 0; commands and observations are recorded in `implementation-summary.md`. ]
- [x] T002 [P1] Run the canonical package-root full corpus from `.opencode/skills/system-skill-advisor/mcp-server`, capture commit, root, duration, test-file/test counts, skips, failures, and exit status, and preserve the historical 21-file observation separately. [EVIDENCE: `evidence/full-corpus-baseline.md` records Observation 001 and final Observation 002, both exit 1, plus the 27-entry failure ledger and historical provenance.]
- [x] T003 [P1] Inventory every claim in phases 001-006 that mentions byte parity, transform ordering, Pi `tool_call`, pure helper coverage, or the full corpus. [EVIDENCE: the claim-to-command table in `implementation-summary.md` and narrowed historical rows in phases 002-006 distinguish manual observation, containment-only automation, helper tests, registered callbacks, and the current corpus artifact.]
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P0] Verify the factory-level Pi harness records `pi.on` registrations, feeds raw input through the registered callbacks, invokes `tool_call`, and asserts block/allow values for self-dispatch and executor mismatch. [EVIDENCE: `dispatch-preflight-lint.test.ts` records default-factory `input` and `tool_call` handlers; the final Pi command passes 32/32.]
- [x] T005 [P1] Run the factory harness with advisor/directive text injected and with both transform registration orders. [EVIDENCE: the registered Pi test asserts injected advisor/directive text is produced, both `transformFirst` values deny injected-only authorization, the real advisor-first chain denies it, and a raw matching override allows the inspected executor; final command passes 32/32.]
- [x] T006 [P1] Verify shared matcher rows for direct commands, `printf`/`echo` false positives, quoted prose, separators, and ambiguous wrappers. [EVIDENCE: existing `inspectDispatch` rows in `dispatch-audit.test.mjs` cover those forms plus variables, aliases, substitutions, and wrappers; the focused shared command passes 351/351.]
- [x] T007 [P1] Create the immutable corpus baseline artifact with a failure ledger, maintenance owner, scope statement, and revisit trigger. [EVIDENCE: `evidence/full-corpus-baseline.md` contains exact command/root/commit/environment/duration/counts, 27 failure names, owner, and revisit trigger; both observations are exit 1.]
- [x] T008 [P1] Correct historical summaries, task evidence, and checklist rows so each claim names its evidence class and command; remove unsupported byte-parity or full-tool-call language. [EVIDENCE: changed-document rows are listed in `implementation-summary.md`; the claim scan was reviewed with historical/provenance matches retained only where explicitly qualified.]
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 [P0] Re-run the focused Pi factory and shared matcher commands and compare result classes with the ledger. [EVIDENCE: final Pi suite 32/32, shared suite 351/351, Node rule suite 7/7, and live smoke exit 0 are recorded separately in `implementation-summary.md`. ]
- [x] T010 [P1] Re-run the package-root full corpus from the same root; append a dated observation if the failure count changes and keep the prior historical row. [EVIDENCE: Observation 002 uses the same root and command as Observation 001; counts and failure names remain 18 failed files/27 failed tests, exit code 1, while the historical 21-file row remains intact.]
- [x] T011 [P1] Run the claim scan, inspect the scoped diff, and strict-validate this phase. [EVIDENCE: the final claim scan, `git diff --check`, no-stray sweep, staged-file check, and strict-validation output are captured in the completion handoff.]
- [x] T012 [P1] Hand off the evidence-class ledger and explicit full-corpus deferral to Phase 008. [EVIDENCE: `implementation-summary.md` and `evidence/full-corpus-baseline.md` provide the four-class ledger, focused receipts, owner, and revisit trigger; Phase 008 and Phase 009 source/state artifacts were not modified.]
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks are `[x]` or have an explicitly documented nonzero corpus deferral with owner and revisit trigger. [EVIDENCE: all T001-T012 rows are checked; corpus disposition is explicit in the baseline artifact.]
- [x] P0 factory coverage exists for self-dispatch and executor mismatch. [EVIDENCE: named registered factory cases in the final 32/32 Pi suite assert returned block results.]
- [x] Pure helper, shared-core, factory, and startup evidence are separate. [EVIDENCE: the ledger in `implementation-summary.md` labels each class and command independently.]
- [x] Unsupported parity, ordering, and coverage claims are corrected or backed by named tests. [EVIDENCE: claim-to-command audit and narrowed historical rows.]
- [x] The 21-file historical observation and the current full-corpus baseline coexist with a reasoned reconciliation. [EVIDENCE: `evidence/full-corpus-baseline.md` preserves both counts and the current exit code 1.]
- [x] Focused gates are green; the full-corpus result is stated honestly. [EVIDENCE: focused receipts exit 0; the package-root corpus remains explicitly **FAIL**, exit 1.]
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See [spec.md](spec.md).
- **Plan**: See [plan.md](plan.md).
- **Checklist**: See [checklist.md](checklist.md).
- **Baseline artifact**: See `evidence/full-corpus-baseline.md`.
- **Predecessor**: See [../006-dispatch-authorization-hardening/tasks.md](../006-dispatch-authorization-hardening/tasks.md).
- **Successor**: See [../008-phase-state-reconciliation/tasks.md](../008-phase-state-reconciliation/tasks.md).
<!-- /ANCHOR:cross-refs -->
