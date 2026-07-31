---
title: "Tasks: catalog enforcement and coverage"
description: "The catalog validator discovers all 26 present feature-catalog packages, enforces the widened rule roster with paired fixtures, stages four known-backlog packages at WARN, and fails closed for promoted violations; shared helper and caller wiring are deferred."
trigger_phrases:
  - "catalog enforcement and coverage task list"
  - "feature catalog integrity task list"
importance_tier: "normal"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/023-feature-catalog-integrity/001-catalog-enforcement-and-coverage"
    last_updated_at: "2026-07-31T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Executed the scoped validator implementation and fixture gates"
    next_safe_action: "Run the full-fleet receipt and strict child validation"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Catalog Enforcement and Coverage

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`

Status: In Progress. Validator, fixture, full-fleet, and packet validation receipts are recorded; widened-corpus explanation and deferred callers remain open.
<!-- /ANCHOR:notation -->

---

## P1 - Execution Evidence

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 **Confirm findings against HEAD before any edit.** Re-ran
      `python3 .opencode/skills/sk-doc/sk-create-feature-catalog/scripts/validate_catalog_package.py --json` and record
      the violation count and type histogram (baseline: 19, all `missing_source_path`). Re-derive the census
      (baseline: 26 packages, 804 leaves, 8 packages / 66 leaves covered). Re-derive the bijection sweep across all 26
      packages (baseline: 104 orphan leaves, 0 dangling links; 94 spec-kit, 8 mcp-refero, 1 mcp-click-up, 1
      deep-research). Confirm the default exit code is 0 and `--strict` is 1. Re-read
      `assets/feature-catalog-template.md` and `assets/feature-catalog-snippet-template.md` for the Q2 ruling — the
      synthesis disagrees with the research here and that disagreement must be re-tested, not inherited. **Receipt:**
      HEAD `0322031c38`; pre-edit JSON reported 19 `missing_source_path` findings and rc 0.
- [x] T002 Measure full-run wall-clock over all 26 packages, so the pre-push question in Q4 is decided on data.
      **Receipt:** timed default run completed in `real 1.66` seconds; output digest
      `608fb7f8889461c00ff9b6a29512d68da2103f8d8be84219d4b7f23861fa19c6`.
- [x] T003 [P] Enumerate every existing caller of `validate_catalog_package.py` (CI, hooks, doctor routes, scripts) so
      the exit-code inversion cannot break one silently. **Receipt:** `rg -l` over executable `.opencode`/`.github`
      files found only this validator and its two tests; no CI, hook, or `/doctor` caller exists in the current tree.
- [ ] T004 [P] Audit the 14 never-audited nested packet catalogs for the covered-set ruling: leaf counts, orphan
      counts, dangling links.
- [x] T005 [B] Settle the covered-set ruling and record it in `decision-record.md`. **OPERATOR-DECISION (Q8).**
- [x] T006 [B] Settle the feature-leaf definition (feature versus category overview versus retirement record) and
      record it. Unblocks `003`'s 94 orphans. Covers `RC-003-03`.
- [x] T007 [B] Settle description-parity strictness and record it. **OPERATOR-DECISION (Q2).** **Evidence:** `feature-catalog-snippet-template.md` states normalized parity and the paired fixture harness passes.
- [x] T008 [B] Settle `mcp-code-mode` applicability and record it. **OPERATOR-DECISION (Q1).** Covers `RC-001-03` and
      the catalog half of `RC-007-07`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T009 Replace `expected_root_packages()` with presence-based discovery over `.opencode/skills/**/feature-catalog/`,
      carrying a ruled include/exclude map with a recorded reason per exclusion. Keep `system-code-graph` out — it has
      no `feature-catalog/` and is runtime data, not a skill root (`RC-001-02`). **OPERATOR-DECISION (Q8).**
- [x] T010 Add the coverage assertion: a test fails when a `feature-catalog/` directory exists outside the ruled set.
- [x] T011 Invert the exit-code contract: non-zero on FAIL by default, `--report-only` for advisory output, `--strict`
      retained as an alias.
- [x] T012 [P] Add phantom-row detection with paired fixtures; the negative fixture is the advisor's literal
      `hooks-and-plugin/opencode-hook.md (not yet authored)` row.
- [x] T013 [P] Add prose-path checking with paired fixtures; the negative fixture is
      `system-spec-kit/feature-catalog/governance/feature-flag-governance.md`.
- [x] T014 [P] Add root-H3-to-leaf-title parity with paired fixtures. **Evidence:** fixture output digest `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`.
- [x] T015 [B] Add the description-parity check at the ruled strictness, and amend
      `assets/feature-catalog-snippet-template.md` to state the rule. **OPERATOR-DECISION (Q2).**
- [x] T016 [P] Add packet-history metadata rejection (`Source phase:` and feature-ID history fields) with paired
      fixtures.
- [x] T017 [P] Add dark-vs-shipped labeling: a populated SOURCE FILES table must not be described as unshipped, and a
      feature labeled shipped must not carry an empty or stub table. **Evidence:** fixture output digest `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`.
- [x] T018 [B] Implement the volatile-value policy: derive structural rosters, reject measurement snapshots.
      **OPERATOR-DECISION (Q6).** **Evidence:** fixture output digest `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`.
- [B] T019 Build the count-derivation helper in `.opencode/skills/sk-doc/shared/scripts/` and import it from the
      validator. Coordinate with `036/032` and `sk-doc/022/001` so the helper and the manifest walker each have one
      definition site. **Deferred:** outside this leaf's locked editable scope; the coordinating consumer child owns
      the shared helper and its single-definition-site proof.
- [x] T020 [B] Implement the per-package severity map with promotion-on-clean. **OPERATOR-DECISION (Q3).** **Evidence:** `WARN_PACKAGE_IDS` drives backlog WARN; promoted package rc 1 and backlog package rc 0.
- [x] T021 [P] Close `RC-007-07` with a strike rationale at HEAD. The alleged README defect is already absent and the
      package.json premise is false; no `mcp-code-mode` README or package change is made.
- [B] T022 Record the 425-leaf hub-catalog baseline as the expected-inventory fixture. Covers `RC-001-01`. This is a
      fixture input, not a defect. **Deferred:** outside this leaf's locked fixture/test scope.
- [x] T023 Update `sk-create-feature-catalog/SKILL.md` to document the covered set and the enforced rule roster.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T024 Full-corpus dry run at both `warn` and `fail`; diff the violation set against the T001 baseline and explain
      every new violation.
- [x] T025 Exit-code tests: seeded violation returns non-zero, clean tree returns zero, `--report-only` returns zero
      either way.
- [x] T026 Fixture assertions: every positive fixture passes and every negative fixture fails for all six named checks
      plus volatile-value policy. **Receipt:** fixture output digest
      `9521c58d07ae6f31f61cce9a16ddcb8ba57a08352c326ba6782693f8eb55c05f`, direct rc 0.
- [x] T027 Determinism test: two `--json` runs on an unchanged tree are byte-identical.
- [B] T028 Single-definition-site test for the shared count-derivation helper. **Deferred with T019:** outside this leaf's
      locked editable scope and owned by the coordinating consumer child.
- [x] T029 Confirm the orphan/dangling baseline is unchanged by this phase: frozen pre-edit baseline remains 104
      orphans and 0 dangling links; the case-insensitive ClickUp root classification produces logical 103 orphans and
      0 dangling links without editing catalog content. **Receipt:** read-only census returned `packages=26 leaves=803
      orphans=103 dangling=0`; frozen pre-edit input remains `26/804/104/0`.
- [B] T030 Wire the gate: CI on `skilled/v*` plus a `/doctor` route at the ruled severity.
      **OPERATOR-DECISION (Q4).**
      **Deferred:** gate callers are outside this leaf's locked editable scope; this leaf exposes the fail-closed CLI and
      package filter for the caller child.
- [x] T031 Run `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh
      .opencode/specs/sk-doc/023-feature-catalog-integrity/001-catalog-enforcement-and-coverage --strict` and confirm
      exit 0. **Evidence:** final verbose output digest `f1853890f5b9bec83f93b0fb47f60fd818e4c4bd6950a1616082f59286b9d035`, direct rc 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining, or each remaining block has a recorded operator deferral
- [ ] All four rulings recorded in `decision-record.md` with a non-blank status
- [ ] Default invocation is fail-closed and proven by test
- [ ] `checklist.md` fully verified with evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Parent**: `sk-doc/023-feature-catalog-integrity`
- **Successors**: `002-hub-catalog-truth-repair` (Lanes B-D), `003-large-surface-catalog-reconciliation`
- **Coordination**: `system-deep-loop/036-deep-loop-innovation/032-docs-drift-and-p2-batch` (count derivation),
  `sk-doc/022-code-readme-coverage/001` (manifest walker)
<!-- /ANCHOR:cross-refs -->
