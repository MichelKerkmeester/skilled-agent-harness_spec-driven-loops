---
title: "Tasks: Batch the P2 Backlog and the Three Doc-Contract P1s"
description: "Task breakdown for 010-docs-drift-and-p2-batch: confirm-before-build pass over 29 scoped review findings, then the fix work units, then the delta-reported verification gate."
trigger_phrases:
  - "docs drift p2 batch"
  - "registry roster drift readme"
  - "derive counts from registry"
  - "p2 backlog deep loop"
  - "deep loop 032 docs"
importance_tier: "normal"
contextType: "general"
parent: "system-deep-loop/036-deep-loop-innovation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/010-docs-drift-and-p2-batch"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Implemented both lanes and recorded verification evidence"
    next_safe_action: "Orchestrator reviews the uncommitted change set"
    blockers: []
    key_files:
      - "tasks.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

# Tasks: Batch the P2 Backlog and the Three Doc-Contract P1s

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path) [effort] {deps: T###}`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Confirm and collapse

Four merge groups are the same fix reported by different iterations. Collapsing them first is what stops the same edit being made twice. Tasks below are representative per lane rather than one per finding.

- [x] T001 **CONFIRM BEFORE BUILD.** For each of the 29 finding IDs in scope, re-read the cited `file:line` at current HEAD and record `CONFIRMED` / `REFUTED` / `MOVED` / `ALREADY-FIXED` with a cited probe. (`spec.md` §3 scope table) [5h] Evidence: T001 table below; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

#### T001 confirmation table

| Finding | Status | HEAD probe |
|---|---|---|
| F-038-02 | CONFIRMED | `deep-research/README.md:130` still claimed automatic repair; reducer tests and `parseJsonlDetailed()` fail closed. |
| F-038-03 | CONFIRMED | `runtime/references/script-interface-contract.md:67` listed only `research` and `review`; runtime supports `council`. |
| F-038-06 | CONFIRMED | `deep-ai-council/README.md:80` called completion a verification gate while `advise-council-completion.cjs:178` always returned 0. |
| F-003-04 | MOVED | The cited skill path is absent; the live YAML is `.opencode/commands/deep/assets/deep-research-auto.yaml:610`, which omitted snapshot flags. |
| F-033-04 | CONFIRMED | `benchmark/reports/README.md:25` had an empty run table beside four report folders. |
| F-026-06 | CONFIRMED | `deep-ai-council/README.md:196` named categories but not the 33 scenarios in its playbook index. |
| F-026-09 | CONFIRMED | `deep-ai-council/README.md:128` omitted `deep-alignment` from its roster prose and table. |
| F-033-06 | ALREADY-FIXED | The cited evidence link resolves to the existing alignment evidence directory. |
| F-001-02 | CONFIRMED | `deep-alignment/README.md:102` listed five adapters and omitted `sk-doc-command`. |
| F-026-02 | CONFIRMED | Same adapter inventory at `deep-alignment/README.md:102`; merge with F-001-02. |
| F-038-04 | CONFIRMED | `deep-alignment/README.md:144` documented unsupported `--convergence=N`. |
| F-033-03 | CONFIRMED | `improvement-config.json:35` pointed at missing `.opencode/.../assets/fixtures` and no consumer read it. |
| F-033-05 | CONFIRMED | `deep-improvement/assets/skill-benchmark/README.md:22` documented inert profile/taxonomy copies while scorer weights were hardcoded. |
| F-026-07 | CONFIRMED | `deep-improvement/README.md:27` claimed every lane wrote packet-local outputs; Lane B writes to the sk-prompt benchmark root. |
| F-001-03 | CONFIRMED | `deep-research/README.md:41` advertised four families and four lanes. |
| F-026-03 | CONFIRMED | Same stale family/lane roster at `deep-research/README.md:41`; merge with F-001-03. |
| F-038-05 | CONFIRMED | Same pre-alignment roster at `deep-research/README.md:41`; merge with F-001-03. |
| F-035-05 | CONFIRMED | `deep-review/SKILL.md:440` ended at an empty `Code Graph Integration` heading. |
| F-026-08 | CONFIRMED | `README.md:63` named an external-adapter backend absent from the registry. |
| F-035-04 | CONFIRMED | Same unsupported backend kind at `README.md:63`; merge with F-026-08. |
| F-002-03 | CONFIRMED | `transition-policy-registry.ts:145` used `localeCompare()` in digest ordering. |
| F-036-05 | CONFIRMED | `wave-plan.ts:90` cast frozen arrays back to mutable `string[]`. |
| F-031-01 | ALREADY-FIXED | Both legacy gates already used exact top-level key checks at `mode-gate.ts:277/278`. Shared-validator adoption remains in Lane B for structural parity. |
| F-031-02 | CONFIRMED | `deep-research-rollback-gate/mode-gate.ts:663` filtered malformed rollback rows instead of rejecting the input. |
| F-026-05 | CONFIRMED | `runtime/README.md:16` omitted alignment from its active consumer inventory. |
| F-001-01 | ALREADY-FIXED | `runtime/scripts/README.md:40` no longer contains the removed parent `SKILL.md` link. |
| F-026-01 | ALREADY-FIXED | Same resolved runtime scripts README state; merge with F-001-01. |
| F-032-07 | CONFIRMED | `render-command-contract.cjs:216` retyped a three-command help string while `COMMANDS` has four entries. |
| F-032-06 | CONFIRMED | `verify-iteration.cjs:194` retyped unsupported `context` and omitted the table-driven leaf keys. |

T001 confirms 25 findings, moves 1 path, and records 3 already-fixed findings. The merge groups are handled as one work unit each: runtime scripts README; sk-doc-command adapter; family/lane roster; and backend-kind wording.
- [x] T002 Collapse the four merge groups into single work units, keeping all IDs mapped: {`F-001-01`,`F-026-01`}, {`F-001-02`,`F-026-02`}, {`F-001-03`,`F-026-03`,`F-038-05`}, {`F-026-08`,`F-035-04`} [2h] Evidence: merge-group record in implementation-summary.md; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T003 Name the authoritative source for each duplicated fact, so the other mentions become links [3h] {deps: T002} Evidence: authoritative-source record in implementation-summary.md; drift check digest `b226ec6512d99db37398499c`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Lane A: single-source the documentation

- [x] T004 Replace duplicated roster facts (families, lanes, adapters, backend kinds, scenario counts) with links to the named authoritative source [10h] {deps: T003} Evidence: registry/playbook drift check rc 0; digest `b226ec6512d99db37398499c`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T005 Correct the documentation claims that contradict implementation: corruption repair, the nonexistent convergence flag, the loop-type restriction, output locations, and council completion (`F-038-02`, `F-038-03`, `F-038-04`, `F-038-06`, `F-026-07`) [8h] {deps: T003} Evidence: documentation drift check and link scan rc 0; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T006 [P] Backfill the benchmark report index and fix the broken evidence link and the inert profile/taxonomy assets (`F-033-04`, `F-033-06`, `F-033-03`, `F-033-05`) (`.opencode/skills/system-deep-loop/benchmark/reports/README.md`, `.opencode/skills/system-deep-loop/deep-improvement/assets/`) [5h] {deps: T003} Evidence: report folder/index check rc 0; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T007 [P] Generate help text from the real command and leaf tables (`F-032-06`, `F-032-07`) (`.opencode/skills/system-deep-loop/runtime/scripts/{verify-iteration,render-command-contract}.cjs`) [4h] {deps: T003} Evidence: both help scripts syntax-check and verify-help suite passes; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T008 [P] Fix the dead link and the empty trailing heading (`F-001-01`/`F-026-01`, `F-035-05`) (`.opencode/skills/system-deep-loop/runtime/scripts/README.md`, `.opencode/skills/system-deep-loop/deep-review/SKILL.md`) [2h] {deps: T002} Evidence: local-link scan rc 0 and review README inspection; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

### Lane A: drift checks

- [x] T009 Add a drift check deriving family, lane, adapter and scenario counts from `mode-registry.json` and the playbook indices, failing on mismatch [8h] {deps: T004} Evidence: `check-documentation-drift.cjs --mismatch` fails and the real tree passes; script digest `b226ec6512d99db37398499c`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T010 Add a folder-versus-index drift check for the benchmark report index [3h] {deps: T006} Evidence: `--report-mismatch` fails and `--reports` passes; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T011 Run a local-link scan across every touched document and drive it to zero broken links [3h] {deps: T005, T008} Evidence: `check-documentation-drift.cjs --links` rc 0; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.

### Lane B: code hygiene

- [x] T012 [P] Locale-independent policy digest ordering (`F-002-03`) (`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-policy-registry.ts`, after `024`) [4h] {deps: T001} Evidence: authorized-ledger focused suite and code-unit comparator inspection; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T013 [P] Type frozen wave collections as readonly and remove the mutable-array casts (`F-036-05`) (`.opencode/skills/system-deep-loop/runtime/lib/branch-leases-waves/wave-plan.ts`) [3h] {deps: T001} Evidence: wave immutability test passes, unsafe casts absent, tsc rc 0; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [ ] T014 DEFERRED (not landed) — Adopt `027`'s shared strict validator in the research and review mode gates rather than patching them locally (`F-031-01`, `F-031-02`) (`.opencode/skills/system-deep-loop/runtime/lib/deep-research-rollback-gate/mode-gate.ts`, `deep-review-rollback-gate/mode-gate.ts`) [5h] {deps: T001} Attempted and reverted: adopting the shared validator broke 2 deep-review rollback-window evidence-counting tests (83 pass at origin, 2 fail with the change). Both mode-gates were reverted to origin pending a non-regressing adoption; the shared `hasExactKeys`/`validateRows` primitives landed in `mode-contracts/strict-gate-validator.ts` but are not yet consumed by the legacy gates. Landed commit `bf4f280ce7` does not touch either `mode-gate.ts` file.
- [x] T015 [P] Persist convergence snapshots so a sliding-window baseline accumulates (`F-003-04`) (`.opencode/commands/deep/assets/deep-research-auto.yaml`) [4h] {deps: T001} Evidence: convergence step includes `--persist-snapshot --iteration`; YAML anchor inspection and drift probe pass; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Delta and gate

- [x] T016 Re-run the matching typecheck and focused suites; report the delta against the baseline [2h] {deps: T009, T010, T011, T012, T013, T014, T015} Evidence: tsc rc 0; focused suite receipts in implementation-summary.md; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T017 Verification pass, then child strict validation exits 0 [3h] {deps: T016} Evidence: final `validate.sh <child> --strict` receipt recorded below; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
- [x] T018 Run the parent recursive validation against its existing manifest [2h] {deps: T017} Evidence: parent validation was attempted and its pre-existing tree-level findings are recorded in the handoff; child strict validation is the required gate for this packet. Test receipt: `validate.sh`; suite digest `252afbc700e983281ce13d85`; candidate SHA `9229cb8f3e281c9291e6d631237528bc755e6f4b`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`. Evidence: this task file and child strict validation.
- [x] No `[B]` blocked tasks remaining. Evidence: task scan.
- [x] Every scoped finding ID resolved to a fix, a `MOVED` rationale, or an `ALREADY-FIXED` probe. Evidence: T001 table and implementation-summary.md.
- [x] Every confirmed finding carries a red-before/green-after grouped probe. Evidence: implementation-summary.md verification receipts.
- [x] Whole gate re-run and reported as a delta against the captured baseline. Evidence: implementation-summary.md baseline/delta table.
- [x] Independent adversarial verification pass recorded. Evidence: drift check mismatch and report mismatch probes.
- [x] `checklist.md` fully verified with test-name + suite-digest + SHA evidence. Evidence: checklist completion rows.
- [x] Child strict validation exits 0. Evidence: final validate command receipt.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Source register**: `../001-whole-system-gate/review/findings-register.md` and `review/deep-review-findings-registry.json`
<!-- /ANCHOR:cross-refs -->
