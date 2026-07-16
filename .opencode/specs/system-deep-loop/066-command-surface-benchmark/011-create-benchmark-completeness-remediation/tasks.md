---
title: "Tasks: create-benchmark completeness remediation"
description: "Task ledger mapping every verified P1/P2 finding from the Fable 5 + Sol Ultra dual review to a scoped, behavior-preserving fix, plus the Sol Ultra re-review gate."
status: in_progress
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/066-command-surface-benchmark/011-create-benchmark-completeness-remediation"
    last_updated_at: "2026-07-16T04:35:00Z"
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

**T016 — structural findings (RESOLVED under operator "Fix all" authorization)**

Initially escalated as beyond doc-remediation scope; the operator authorized them, and all were closed as documentation/template edits — no scorer, evaluator, scheduler, runtime, or frozen-framework code was changed.

- [x] Sol P1-2 / P2-1 — Lane C playbook snippet template now carries the loader-gating frontmatter (`id`, `expected_intent`, `expected_resources`) so a playbook scenario is discoverable by the skill-benchmark loader; authoring notes document the prompt + negative-activation contract.
- [x] Sol P1-3 / Fable #5 — `command_benchmark` stays a composition (not a seventh `FAMILIES` key), but a Tier-0 composite routing branch now loads both family guides + the composition doc, making it routable by name; the prose matches.
- [x] Sol P1-4 — the reviewer-mode profile (`reviewer_regression.json`) is now recorded in the model-benchmark section as a distinct, gated, lane-owned input rather than silently excluded.
- [x] Sol P1-6 / Fable #1 — the conformance guide documents both fixture-corpus patterns (package-local vs external `fixtureRoot` delegation), matching the shipped exemplar.
- [x] Sol P2-2 / Fable #3 — the shared route-map template table now lists the four conformance templates.
- [x] Sol P2-4 — Lane B profiles README corrected (three → 10; reviewer profile named).
- [x] Sol P2-6 — deep-review RVB index budgets reconciled to the scenario `budget_ms` contracts (five rows: RVB-001/003/004/007/008).
- [x] Sol P2-7 — one-off/experimental benchmarks (e.g. the prompt-models vision audit) are explicitly out-of-taxonomy in "When NOT to Use".
- [x] Fable #6 — deep-improvement Lane C README notes the pending frozen `baseline/` anchor (no run fabricated).
- [x] Fable #7 — the spec-kit MCP README repoints "canonical mechanics" to create-benchmark `SKILL.md` §3-8.
- [x] Fable #8 — §13 states `/create:benchmark` drives two of six families; the other four are authored directly.
- [x] Fable #9 — behavior guide `DAB` prefix and the §1 behavior-mode taxonomy aligned to the framework's fixed-prefix table.
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

All P1/P2 findings closed or explicitly labeled legacy, both review reports archived under `evidence/`, the Sol Ultra re-review clean of surviving P1, and strict validation green.
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

Parent: `system-deep-loop/066-command-surface-benchmark`. Evidence: `evidence/review-sol-ultra.md`, `evidence/review-fable.md`. Related closeout: `../010-scorecard-and-closeout/`.
<!-- /ANCHOR:cross-refs -->
