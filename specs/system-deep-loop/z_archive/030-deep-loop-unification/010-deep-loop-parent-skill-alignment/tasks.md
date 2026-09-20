---
title: "Tasks: deep-loop parent-skill alignment"
description: "Closure task breakdown for deep-loop alignment. R1-R5 and NFR-S01 per-mode allowed-tools C0/C1/C3 closeout are done; C2 did not trigger; the full live-loop e2e remains optional and was not run."
trigger_phrases:
  - "deep-loop alignment tasks"
  - "ai-council rename tasks"
importance_tier: "supporting"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-unification/010-deep-loop-parent-skill-alignment"
    last_updated_at: "2026-06-26T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "R5 gates green; runtime reachability confirmed by registration; optional live-loop e2e not run"
    next_safe_action: "Optional: run a full live deep-loop e2e; refresh metadata separately"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "author-155-003-deep-loop-alignment"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "R1 static invokable-hub routing done."
      - "R2 deep-ai-council rename done."
      - "R3 done: all five feature_catalog directories are earned and stay."
      - "R4 done: merged identity is kept by sign-off; drift-guard is green."
      - "NFR-S01 done: per-mode allowed-tools contract accepted."
      - "R5 done: strict recursive spec validation passed, package checks passed, routing fixtures passed, parent-skill invariants passed, and runtime registration confirms reachability; full live-loop e2e remains optional and was not run."
---
# Tasks: deep-loop parent-skill alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/global/hvr_rules.md -->

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

Tasks map to `plan.md` stages (Stage 0-5). A task is either complete or pending; `[B]` is not combined with `[x]`. Current state: R1-R5 and NFR-S01 C0/C1/C3 closeout are done; C2 did not trigger and is checked as skipped by decision; the full live-loop e2e remains optional and was not executed.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

**Structural alignment (plan Stages 0–2): inventory + baseline, then the lowest-blast structural fixes.**

- [x] T001 Stage 0 — Record a recovery baseline before any mutation (baseline SHA)
- [x] T002 [P] Stage 0 — Inventory every `ai-council` reference: commands, agents, `mode-registry.json`, `deep-loop-runtime`, cross-refs (inventory notes)
- [x] T003 [P] Stage 0 — Inventory each deep mode's `feature_catalog/` contents (inventory notes)
- [x] T004 [P] Stage 0 — Inventory `deep-loop-runtime` path/identity assumptions + the merged-identity projection sites (inventory notes)
- [x] T005 Stage 1 (R2) — Rename folder `ai-council` → `deep-ai-council` per ADR-001 (`.opencode/skills/deep-loop-workflows/`)
- [x] T006 Stage 1 (R2) — Rewire every reference from the T002 inventory (commands, agents, registry, runtime, cross-refs)
- [x] T007 Stage 1 (R2) — `package_skill.py --check` passes for the hub + all five packets; zero broken `ai-council` refs
- [x] T008 Stage 2 (R3) — Apply the ADR-003 ruling per mode: keep all five earned `feature_catalog/` directories
- [x] T009 Stage 2 (R3) — No repointing needed because the R3 ruling keeps all five catalogs; zero deletion branch triggered
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

**Routing + runtime (plan Stages 3–4): the higher-blast work, gated on Phase 1.**

- [x] T010 Stage 3 (R1) — Retrofit static Option E onto the deep-loop hub `SKILL.md` + `mode-registry.json` routing
- [x] T011 Stage 3 (R1/R5) — Reachability confirmed by runtime registration: `Skill(deep-loop-workflows)` is registered as the top-level hub, hub `graph-metadata.json` is present, `/deep:*` commands and the `ai-council` agent are registered/available, and the full live-loop e2e remains optional/not run
- [x] T012 Stage 4 (R4) — Verify `deep-loop-runtime` path/identity assumptions hold post-1–3 by keeping the existing merged-identity layer
- [x] T013 Stage 4 (R4) — Evaluate and record the merged-identity keep/simplify decision (ADR-002): keep by maintainer sign-off; drift-guard green
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

**Validation (plan Stage 5), gated on Phase 2.**

- [x] T014 Stage 5 (R5) — `package_skill.py --check` passed on the hub and all five packets (`deep-research`, `deep-review`, `deep-improvement`, `deep-context`, `deep-ai-council`)
- [x] T015 Stage 5 (R5) — Advisor/graph consistency confirmed by the routing-registry drift-guard, routing-parity fixtures, and `parent-skill-check.cjs`; forced `advisor_rebuild` was not run and is not required because routing data was unchanged
- [x] T016 Stage 5 (R5) — Routing fixtures passed: routing-registry drift guard, deep-skills routing parity, and deep-council routing parity; 3 files, 19 tests, all passed
- [x] T017 Stage 5 (R5) — `validate.sh --strict --recursive` passed on the parent plus the then-current child phases with 0 errors and 0 warnings

**Deferred-item closeout (maps to plan.md "Deferred-Item Closeout"; C0 decisions first, live-infra only on a gated branch):**

C0 — decisions & assessment (read-only):
- [x] T018 Decide NFR-S01: accept per-mode allowed-tools as authoritative + document residual dispatch evidence risk + optional hardening probe (decision-record.md)
- [x] T019 Per-mode earned-keep assessment of all five `feature_catalog/` dirs; record keep-all verdict table (decision-record.md)
- [x] T020 Decide R4: maintainer sign-off keeps merged identity; drift-guard green (decision-record.md)

C1 — doc-only resolutions (reversible):
- [x] T021 NFR-S01 (A): record the per-mode allowed-tools decision; close the security checklist rows (decision-record.md, checklist.md)
- [x] T022 R3 keep-all branch: amend ADR-003, fill the assessment table, mark Stage 2 done (decision-record.md, checklist.md)
- [x] T023 R4 sign-off branch: record keep + rationale; ADR-002 → Accepted (kept) (decision-record.md)

C2 — live-infra (gated on sign-off; skip if C1 closes everything):
- [x] T024 Not triggered — R3 remove branch (not triggered - skipped by decision): keep-all verdict means no unearned `feature_catalog/` directories to remove
- [x] T025 Not triggered — NFR-S01 (B) branch (not triggered - skipped by decision): per-mode allowed-tools accepted; runtime dispatch probe is optional future hardening
- [x] T026 Not triggered — R4 fixture branch (not triggered - skipped by decision): maintainer sign-off keeps the layer; fixture comparison is optional

C3 — full validation & close-out (also completes T015–T017 above):
- [x] T027 Operator reachability: `Skill(deep-loop-workflows)` reachability is confirmed by runtime registration; `/deep:*` commands and the `ai-council` agent are registered/available; full live-loop e2e was not executed and remains optional
- [x] T028 Final `validate.sh --strict --recursive` plus `package_skill.py --check` passed; Stage 5/R5 is complete and statuses are reconciled with the parent phase map

C3 result: complete for required R5 closure evidence. The deliberately unrun full live-loop e2e is optional residual evidence, not a blocker.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] All required gates green; `/deep:*` commands and the `ai-council` agent are registered/available; full live-loop e2e not run
- [x] deep-loop workflow behavior unchanged by this markdown-only closure; only structure/invocation evidence is reconciled
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Decision Records**: See `decision-record.md`
<!-- /ANCHOR:cross-refs -->
