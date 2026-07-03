---
title: "Tasks: Phase 13: absorb-028-006-review-remediation-closeout"
description: "Task list for the program bookkeeping closeout: tracker absorption pointers, 91-item P2 mapping, ledger completeness sweep, tooling-finding records, and final recursive validation."
trigger_phrases:
  - "review remediation closeout tasks"
  - "absorbed tracker pointers tasks"
  - "p2 triage mapping table"
  - "findings completeness mapping table"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/016-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/013-absorb-028-006-review-remediation-closeout"
    last_updated_at: "2026-07-03T09:57:00Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Authored phase planning docs (spec, plan, tasks, checklist)"
    next_safe_action: "Execute LAST in program order, after phase 012 closes"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-03-016-013-closeout-planning"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: absorb-028-006-review-remediation-closeout

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

Each task carries a metadata comment citing its source: report finding numbers (#N), ledger tags (L#, agent letters), tracker row ids, or decomposition section.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the final status of every program phase 001-012 from its child folder (spec status + checklist state) and note any phase that closed differently than planned (`../0NN-*/`)
  <!-- meta: source=phase-decomposition.md execution order; gate for all covered-by-phase-NNN dispositions -->
- [ ] T002 Re-read the three tracker folders and run `git status` on every target file before editing; halt on uncommitted concurrent-session changes (`../../006-review-remediation/`, `../../014-manual-playbook-execution-sweep/001-findings-remediation/`)
  <!-- meta: source=finding-is-a-hypothesis rule + 014 tasks.md process note on concurrent-session file collisions -->
- [ ] T003 Capture baseline: `validate.sh --strict` on the 016 parent and the three tracker folders before any edit; record exit codes (`scratch/baseline-validation.txt`)
  <!-- meta: source=baseline-before-no-regressions constitutional rule -->
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Group A — 028/006 review-remediation trackers

- [ ] T004 Mark 006/002 rows absorbed with pointers: T005 (P1-2 derived_id rule_version) and T006 (P1-4 in-lock semantic-edge embedding) → `../008-causal-graph-hygiene-and-entity-linker-noise/`; T007 (P1-5 retention spare-only re-validate) → `../009-learning-feedback-loop-repair/`; update spec.md status + implementation-summary.md disposition (`../../006-review-remediation/002-memory-schema-and-concurrency/`)
  <!-- meta: source=deep-dive-report.md §6 known-open; decomposition §008 absorbed items + §009 absorbed P1-5; tracker rows 006/002 T005-T007 -->
- [ ] T005 Complete the 91-item P2 mapping table in 006/004: each item → covered by phase NNN of this program (cite the owning phase task) or accept-as-is with a one-line reason; close its T004-T011 rows against the finished table; update implementation-summary.md (`../../006-review-remediation/004-p2-triage/`)
  <!-- meta: source=028/006/004 pending contract (91 P2 from 028/006/archive/review-report.md, 15 lens families); REQ-002 -->
- [ ] T006 Update the 028/006 parent: phase-map rows for 002/004 from "PENDING, scaffold only" to absorbed/closed with pointers; record the operator's re-review disposition in the phase-transition rules; refresh the source-review context paragraph (`../../006-review-remediation/spec.md`)
  <!-- meta: source=028/006 parent phase map + transition rule "re-run /deep:review until clean"; spec.md open question 1 -->
- [ ] T007 Regenerate 028/006 generator-owned metadata after the spec edit; verify JSON parses and derived status matches the new roster (`../../006-review-remediation/graph-metadata.json`, `description.json`)
  <!-- meta: source=CLAUDE.md mandatory-metadata rule; generator-owned files never hand-edited -->
- [ ] T008 Synchronize the 028 packet parent: phase-map row for 006 reflects the absorbed/closed state (packet 028 blocker accuracy) and the 016 row reflects program completion; regenerate its graph metadata (`../../spec.md`, `../../graph-metadata.json`)
  <!-- meta: source=packet-028 goal note (sole blocker was 006 in_progress); decomposition §013 "mark 028 parent phase map statuses" -->

### Group B — ex-031 tracker (028/014/001-findings-remediation)

- [ ] T009 Mark Group-A rows absorbed → `../007-ranking-filter-bypass-and-score-scale-fixes/`: tasks.md rows T-0211 and T-0212 lose their "queued" wording, and the REQ-214 context-headers requirement row in that packet's spec.md gets the same pointer (`../../014-manual-playbook-execution-sweep/001-findings-remediation/`)
  <!-- meta: source=deep-dive-report.md §6 (T-0211 causal boost, T-0212 community fallback, REQ-214 context headers; shared Group-A per-request flag-read root cause); decomposition §007 -->
- [ ] T010 Sweep the remaining open rows of that tasks.md and annotate each with exactly one disposition — covered by phase NNN, stays in 014, or obsolete: T003 (recurring append), T-0032 (session_health), T-0056 (causal_stats scope), T-0062 (evidence re-run), T-0087 (int8 decision record), T-0193/T-0194 (lineage evidence), T-0208 (tri-daemon lifecycle), T-0240 (lint backlog), T-0372 (session_resume strict), T-0381 (deep-loop convergence signals), T900-T902 (its own verification rows) (`../../014-manual-playbook-execution-sweep/001-findings-remediation/tasks.md`)
  <!-- meta: source=deep-dive-report.md §6 (~22 Phase-2 appendix items, T-0372, T-0444 already closed in-tracker); candidates: T-0032/T-0208 relate to phase 011 health/daemon scope — confirm before pointing -->

### Group C — findings-completeness sweep

- [ ] T011 Walk `../research/findings-ledger.md` section by section and fill the mapping table below: every finding mapped to a phase task or explicitly accepted-as-is with a reason; no silent drops (`tasks.md`, this file)
  <!-- meta: source=REQ-004; decomposition cross-cutting rule "every finding fix cites the report/ledger ID" -->
- [ ] T012 Cross-check the curated report inventory against phase tasks: §3 items #1-#28, §4 performance items, §5 presentation items each owned by a phase task or accepted with reason; reconcile counts with the table below (`../research/deep-dive-report.md`)
  <!-- meta: source=deep-dive-report.md §3/§4/§5; belt-and-braces over T011 because the ledger has no Agent B section (see table note) -->

### Group D — new tooling findings from this program's scaffolding

- [ ] T013 Record finding TOOL-1 as a tracked item: `create.sh --phase` ignores `--level` for phase children — children are hardcoded to the Level-1 contract (`resolve_level_contract "1"` at `scripts/spec/create.sh:1328` and `--level "1"` at `:1360`), so this program's children scaffolded as L1 despite `--level 2`; repro: run create.sh in phase mode with `--level 2`, then grep a child's plan.md for `SPECKIT_LEVEL: 1`; evidence: this phase's own scaffold carried level-1 stamps corrected by hand during authoring
  <!-- meta: source=016 parent spec.md in-scope bullet (tooling defects); verified 2026-07-03 against create.sh:1328,1360 -->
- [ ] T014 Record finding TOOL-2 as a tracked item: `upgrade-level.sh` references removed template paths — `ADDENDUM_L2="${TEMPLATES_DIR}/addendum/level2-verify"` (also level3-arch, level3-plus-govern) at `scripts/spec/upgrade-level.sh:46-48`, but `templates/addendum/` does not exist (templates moved to `templates/manifest/*.tmpl`), so the L1→L2 upgrade path is broken; repro: `ls .opencode/skills/system-spec-kit/templates/addendum/` → "No such file or directory"
  <!-- meta: source=016 parent spec.md in-scope bullet (tooling defects); verified 2026-07-03 against upgrade-level.sh:42-48 + templates/ listing -->
- [ ] T015 Route TOOL-1 and TOOL-2 to a follow-on owner (existing speckit tooling tracker or a new packet — operator decision); record the routing decision next to both findings; fixing the scripts stays out of this program's scope
  <!-- meta: source=spec.md open question 2; REQ-008 -->
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T016 Grep audits: `rg -n 'PENDING, scaffold only|queued for next fix-dispatch round'` over the 006 and 014 trackers returns zero hits; every absorbed row carries exactly one disposition pointer (plan.md FIX ADDENDUM inventories)
  <!-- meta: source=plan.md affected-surfaces invariant -->
- [ ] T017 Final program validation: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` exit 0 for the 016 parent and each of the 13 children (recursive run over the parent where supported); record exit codes against the T003 baseline
  <!-- meta: source=REQ-006; parent SC-004 -->
- [ ] T018 Scoped index refresh: `memory_index_scan({ specFolder })` over the 016 program parent and the edited tracker folders; confirm the updated docs are visible to a scoped `memory_search`
  <!-- meta: source=REQ-006; CLAUDE.md memory-save indexing rule -->
- [ ] T019 Closeout save: `/memory:save` for the program against the 016 parent (Gate-3 folder already established); verify the post-save quality review output and patch HIGH issues
  <!-- meta: source=REQ-006; program-complete handoff row in ../spec.md -->
- [ ] T020 Mark this phase's checklist.md with evidence, refresh this folder's changelog entry, and set final statuses in the 016 parent phase map (`checklist.md`, `../spec.md`, `../graph-metadata.json`)
  <!-- meta: source=completion-verification rule; spec.md phase-context changelog note -->
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:mapping-table -->
## Findings-Completeness Mapping Table (filled during execution — T011/T012)

One row per ledger section. Disposition column resolves to: mapped (cite phase + task ids), accept-as-is (with reason), or split (both, itemized beneath the table). "Pending" rows are not allowed at completion. Coverage means an owning phase task exists — it does not by itself claim the fix shipped.

| Ledger Section | Scope | Expected Owners (per phase-decomposition.md) | Disposition |
|----------------|-------|----------------------------------------------|-------------|
| L1 corpus identity split + duplicates | data quality | phases 001, 003 | Pending |
| L2 orphan sweep cursor | index hygiene | phase 001 | Pending |
| L3 embedding coverage | vectors | phase 004 | Pending |
| L4 trigger phrase junk | triggers | phase 005 | Pending |
| L5 archive/tier pollution | tiers | phase 002 (+ 005 constitutional hygiene) | Pending |
| L6 daemon/ops | freshness, crash, latency | phase 011 (+ 010 latency) | Pending |
| L7 envelope/presentation bloat | envelope | phase 012 | Pending |
| L8 causal graph pollution | graph | phase 008 | Pending |
| L9 chunking dormant + oversized docs | chunking | phase 004 | Pending |
| DUP MECHANISM (migration v28 + partial index + channel-inconsistent exclusion) | dedup | phases 002, 003 | Pending |
| Agent E (tool surface) | match_triggers, disclosure, envelope | phases 005, 012 | Pending |
| Agent F (indexing) | scan, retry, orphans | phases 001, 004, 010 | Pending |
| Agent I (commands/presentation) | CLI, docs drift, hooks | phases 011, 012 | Pending |
| Agent A (prior work) | tracker landscape, dark flags, deliberately-not-built | this phase (013) — pointer + accept records | Pending |
| Agent C (scoring/cognitive) | fusion, boosts, dead battery | phases 006, 007, 010 | Pending |
| Agent G (learning/feedback/eval) | learning loop, eval parity | phases 006, 009 | Pending |
| Agent D (query understanding + graph search) | intent, HyDE, communities, entity linker | phases 007, 008, 010 | Pending |
| Agent H (save path) | save lanes, tiers, hashes | phases 002, 003 | Pending |
| Agent B (pipeline core) — NO ledger section (report notes it pending) | fusion/score scale | phases 007, 010 via report §3/§4 citations (B P2 / B OPT tags in phase-decomposition.md) | Pending |

Sweep notes recorded at execution time go below this line (itemized splits, accept-as-is reasons, and any finding re-routed to a different phase than expected).
<!-- /ANCHOR:mapping-table -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Mapping table above has zero Pending rows; 91/91 P2 items dispositioned in 006/004
- [ ] Grep audits and final recursive strict validation passed with recorded evidence
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Program parent**: See `../spec.md`
- **Evidence corpus**: `../research/phase-decomposition.md`, `../research/deep-dive-report.md` (§6), `../research/findings-ledger.md`
- **Absorbed trackers**: `../../006-review-remediation/002-memory-schema-and-concurrency/`, `../../006-review-remediation/004-p2-triage/`, `../../014-manual-playbook-execution-sweep/001-findings-remediation/`
<!-- /ANCHOR:cross-refs -->
