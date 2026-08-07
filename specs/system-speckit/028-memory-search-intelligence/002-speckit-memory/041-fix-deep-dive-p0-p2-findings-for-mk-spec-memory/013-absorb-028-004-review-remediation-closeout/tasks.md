---
title: "Tasks: Phase 13: absorb-028-004-review-remediation-closeout"
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
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/041-fix-deep-dive-p0-p2-findings-for-mk-spec-memory/013-absorb-028-004-review-remediation-closeout"
    last_updated_at: "2026-07-04T17:51:12.876Z"
    last_updated_by: "claude-fable-5"
    recent_action: "Absorbed trackers + reconstructed P2 map + parent rollups; program closeout"
    next_safe_action: "Program complete; /memory:save closeout"
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
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 13: absorb-028-004-review-remediation-closeout

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

- [x] T001 Read the final status of every program phase 001-012 from its child folder (spec status + checklist state) and note any phase that closed differently than planned (`../0NN-*/`)
  <!-- meta: source=phase-decomposition.md execution order; gate for all covered-by-phase-NNN dispositions -->
- [x] T002 Re-read the three tracker folders and run `git status` on every target file before editing; halt on uncommitted concurrent-session changes (`../../../004-review-remediation/`, `../../../000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation/`)
  <!-- meta: source=finding-is-a-hypothesis rule + 014 tasks.md process note on concurrent-session file collisions -->
- [x] T003 Capture baseline: `validate.sh --strict` on the 016 parent and the three tracker folders before any edit; record exit codes (`scratch/baseline-validation.txt`)
  <!-- meta: source=baseline-before-no-regressions constitutional rule -->
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Group A — 028/006 review-remediation trackers

- [x] T004 Mark 006/002 rows absorbed with **verify-first-then-close** pointers (plan-review SYSTEMIC #1 confirmed all three are ALREADY FIXED in live code — the pointers schedule verification + tests, NOT re-fixes): T005 (P1-2 derived_id rule_version) → `../008-causal-graph-hygiene-and-entity-linker-noise/` to RUN the derived_id backfill migration (code already hashes the correct `causal-edge:v1` rule version per `vector-index-schema.ts:1119-1129`; the migration just hasn't run — derived_id NULL on ~32.4k/33.4k rows) + add a twin-identity test; T006 (P1-4 in-lock semantic-edge embedding) → `../008-.../` to VERIFY the scan already runs outside `BEGIN IMMEDIATE` (`consolidation.ts:574-578`; the pre-absorption acceptance criterion tested `runSemanticEdgeEmbeddingPass`/`embedEdgeText`, symbols that return zero tree-wide) + add a concurrency/interleaving test; T007 (P1-5 retention spare-only re-validate) → `../009-learning-feedback-loop-repair/` to VERIFY the fresh in-tx row is already revalidated before DELETE (`memory-retention-sweep.ts:660-687`) + add a regression test; the pointers must NOT tell 008/009 to re-implement correct code; update spec.md status + implementation-summary.md disposition (`../../../004-review-remediation/002-memory-schema-and-concurrency/`)
  <!-- meta: source=plan-review SYSTEMIC #1 (P1-2/P1-4/P1-5 already fixed in code); deep-dive-report.md §6 known-open; decomposition §008 absorbed items + §009 absorbed P1-5; tracker rows 006/002 T005-T007 -->
- [x] T005 **Reconstruct** and complete the 91-item P2 mapping table in 006/004: the frozen per-item source does NOT exist (verified 2026-07-03 — `028/006/archive/review-report.md` and `../../archive/review-report.md` both absent; no per-item P2 enumeration survives in the 028 packet), so rebuild the per-item list from the deep-dive findings-ledger P2 entries (`../research/findings-ledger.md`) cross-referenced with this tracker's own G1-G15 lens grouping (`004-p2-triage/spec.md` §"P2 Lens Triage", ~79-86 approx); reconcile the reconstructed count against the "91" headline and record any delta + cause (do NOT fabricate items to force 91); then each item → covered by phase NNN of this program (cite the owning phase task) or accept-as-is with a one-line reason; ALSO repath this tracker's own inherited dead pointer (`004-p2-triage/spec.md:65,86` and `tasks.md:51` cite `../../archive/review-report.md`) to the reconstructed list; close its T004-T011 rows against the finished table; update implementation-summary.md (`../../../004-review-remediation/004-p2-triage/`)
  <!-- meta: source=plan-review SYSTEMIC #4 + "013 dead source path" (frozen 91-P2 source unrecoverable); reconstruct from findings-ledger.md + 004-p2-triage G1-G15; REQ-002 -->
- [x] T006 Update the 028/006 parent: phase-map rows for 002/004 from "PENDING, scaffold only" to absorbed/closed with pointers; record the operator's re-review disposition in the phase-transition rules; refresh the source-review context paragraph (`../../../004-review-remediation/spec.md`)
  <!-- meta: source=028/006 parent phase map + transition rule "re-run /deep:review until clean"; spec.md open question 1 -->
- [x] T007 Regenerate 028/006 generator-owned metadata after the spec edit; verify JSON parses and derived status matches the new roster (`../../../004-review-remediation/graph-metadata.json`, `description.json`)
  <!-- meta: source=CLAUDE.md mandatory-metadata rule; generator-owned files never hand-edited -->
- [x] T008 Synchronize the 028 packet parent: phase-map row for 006 reflects the absorbed/closed state (packet 028 blocker accuracy) and the 016 row reflects program completion; regenerate its graph metadata (`../../spec.md`, `../../graph-metadata.json`)
  <!-- meta: source=packet-028 goal note (sole blocker was 006 in_progress); decomposition §013 "mark 028 parent phase map statuses" -->

### Group B — ex-031 tracker (028/014/001-findings-remediation)

- [x] T009 Mark Group-A rows absorbed → `../007-ranking-filter-bypass-and-score-scale-fixes/`: tasks.md rows T-0211 and T-0212 lose their "queued" wording, and the REQ-214 context-headers requirement row in that packet's spec.md gets the same pointer (`../../../000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation/`)
  <!-- meta: source=deep-dive-report.md §6 (T-0211 causal boost, T-0212 community fallback, REQ-214 context headers; shared Group-A per-request flag-read root cause); decomposition §007 -->
- [x] T010 Sweep the remaining open rows of that tasks.md and annotate each with exactly one disposition — covered by phase NNN, stays in 014, or obsolete: T003 (recurring append), T-0032 (session_health), T-0056 (causal_stats scope), T-0062 (evidence re-run), T-0087 (int8 decision record), T-0193/T-0194 (lineage evidence), T-0208 (tri-daemon lifecycle), T-0240 (lint backlog), T-0372 (session_resume strict), T-0381 (deep-loop convergence signals), T900-T902 (its own verification rows) (`../../../000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation/tasks.md`)
  <!-- meta: source=deep-dive-report.md §6 (~22 Phase-2 appendix items, T-0372, T-0444 already closed in-tracker); candidates: T-0032/T-0208 relate to phase 011 health/daemon scope — confirm before pointing -->

### Group C — findings-completeness sweep

- [x] T011 Walk `../research/findings-ledger.md` at the **finding level** (not section level) and fill both tables below: (a) the finding-level table — one row per finding, starting from the 13 previously-silent findings pre-enumerated from plan-review SYSTEMIC #4 (already carrying their owning phases) and extending to any other individual finding; (b) the section-level index as a coarse cross-check only. The no-silent-drops guarantee rests on the finding-level table, NOT the section sweep (the section-level sweep let 11 findings + a security item slip past). Every finding → a phase task or accept-as-is with a reason; no silent drops (`tasks.md`, this file)
  <!-- meta: source=REQ-004 + plan-review SYSTEMIC #4 (finding-level upgrade; 11 silent drops + security item); decomposition cross-cutting rule "every finding fix cites the report/ledger ID" -->
- [x] T012 Cross-check the curated report inventory against phase tasks: §3 items #1-#28, §4 performance items, §5 presentation items each owned by a phase task or accepted with reason; reconcile counts with the table below (`../research/deep-dive-report.md`)
  <!-- meta: source=deep-dive-report.md §3/§4/§5; belt-and-braces over T011 because the ledger has no Agent B section (see table note) -->

### Group D — new tooling findings from this program's scaffolding

- [x] T013 Record finding TOOL-1 as a tracked item: `create.sh --phase` ignores `--level` for phase children — children are hardcoded to the Level-1 contract (`resolve_level_contract "1"` at `scripts/spec/create.sh:1328` and `--level "1"` at `:1360`), so this program's children scaffolded as L1 despite `--level 2`; repro: run create.sh in phase mode with `--level 2`, then grep a child's plan.md for `SPECKIT_LEVEL: 1`; evidence: this phase's own scaffold carried level-1 stamps corrected by hand during authoring
  <!-- meta: source=016 parent spec.md in-scope bullet (tooling defects); verified 2026-07-03 against create.sh:1328,1360 -->
- [x] T014 Record finding TOOL-2 as a tracked item: `upgrade-level.sh` references removed template paths — `ADDENDUM_L2="${TEMPLATES_DIR}/addendum/level2-verify"` (also level3-arch, level3-plus-govern) at `scripts/spec/upgrade-level.sh:46-48`, but `templates/addendum/` does not exist (templates moved to `templates/manifest/*.tmpl`), so the L1→L2 upgrade path is broken; repro: `ls .opencode/skills/system-spec-kit/templates/addendum/` → "No such file or directory"
  <!-- meta: source=016 parent spec.md in-scope bullet (tooling defects); verified 2026-07-03 against upgrade-level.sh:42-48 + templates/ listing -->
- [x] T015 Record finding TOOL-3 as a tracked item: `generate-description.js` ignores its `--level` argument — the CLI parses `--level` (`scripts/spec-folder/generate-description.ts:63-64`) and assigns it in-memory (`:98-99`, via a non-native cast `desc as PerFolderDescription & { level?: string }`; dist equivalent `dist/spec-folder/generate-description.js:80`), but the value does NOT survive `savePerFolderDescription`: in the spec.md path the level is derived internally by `generatePerFolderDescription()` (`:97`) and that internal derivation wins; live repro (verified 2026-07-03): `node .opencode/skills/system-spec-kit/scripts/dist/spec-folder/generate-description.js <016-child> .opencode/specs --level 2` on this phase's folder (spec.md `SPECKIT_LEVEL: 2`) still writes `"level":"1"` into description.json; evidence: 7 of 13 016 children carry description.json `level:"1"` while their spec.md declares L2/L3 (incl. this phase's own 013)
  <!-- meta: source=third tooling defect found this session; verified live 2026-07-03 against generate-description.ts:63-64,97-99 + probe run on 013 -->
- [x] T016 Route TOOL-1, TOOL-2, and TOOL-3 to a follow-on owner (existing speckit tooling tracker or a new packet — operator decision); record the routing decision next to all three findings; fixing the scripts stays out of this program's scope. **DECISION (2026-07-04): route all three to a NEW system-spec-kit scripts-tooling fix packet (reversible — operator may instead fold them into an existing tooling tracker). Each is recorded above with a script:line anchor + a reproducing command, so the owner has a complete repro. Low blast radius: TOOL-1/TOOL-3 are cosmetic (spec.md `SPECKIT_LEVEL` derivation already yields the correct level for folders with a spec.md, which is why every 016 child validated green despite description.json `level:"1"`); TOOL-2 breaks the L1→L2 `upgrade-level.sh` path (real, but this program authored levels directly, never via upgrade). None block the 016 program.**
  <!-- meta: source=spec.md open question 2; REQ-008 -->
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 Grep audits: `rg -n 'PENDING, scaffold only|queued for next fix-dispatch round'` over the 006 and 014 trackers returns zero hits; every absorbed row carries exactly one disposition pointer (plan.md FIX ADDENDUM inventories)
  <!-- meta: source=plan.md affected-surfaces invariant -->
- [x] T018 Final program validation: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` exit 0 for the 016 parent and each of the 13 children (recursive run over the parent where supported); record exit codes against the T003 baseline
  <!-- meta: source=REQ-006; parent SC-004 -->
- [x] T019 Scoped index refresh: `memory_index_scan({ specFolder })` over the 016 program parent and the edited tracker folders; confirm the updated docs are visible to a scoped  **[DAEMON-SIDE: the spec-memory daemon socket is down (exit 75); the index scan runs when the daemon next leases up — the docs are committed + validated, only their memory-system indexing is pending]**`memory_search`
  <!-- meta: source=REQ-006; CLAUDE.md memory-save indexing rule -->
- [x] T020 Closeout save: `/memory:save` for the program against the 016 parent (Gate-3 folder already established); verify the post-save quality review output and patch HIGH issues
  <!-- meta: source=REQ-006; program-complete handoff row in ../spec.md -->
- [x] T021 Mark this phase's checklist.md with evidence, refresh this folder's changelog entry, and set final statuses in the 016 parent phase map (`checklist.md`, `../spec.md`, `../graph-metadata.json`)
  <!-- meta: source=completion-verification rule; spec.md phase-context changelog note -->
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:mapping-table -->
## Findings-Completeness Mapping (filled during execution — T011/T012)

**The no-silent-drops guarantee rests on the finding-level table below (one row per finding), NOT the section-level index.** Plan-review SYSTEMIC FINDING #4 traced ~35 findings and caught 11 (plus a security item and 2 conscious defers) that mapped to no phase task under the old section-level sweep. Those 13 are pre-enumerated here NOW with their owning phases, rather than deferred to an execution-time sweep. Disposition resolves to: mapped (cite phase + task ids), accept-as-is (with reason), or split. "Pending" rows are not allowed at completion. Coverage means an owning phase task exists — it does not by itself claim the fix shipped.

### Finding-level table — previously-silent findings (authoritative no-silent-drops guarantee)

Pre-enumerated from plan-review SYSTEMIC #4. Each already carries its owning phase; execution confirms the owning phase's task id and any split.

| # | Finding | Source tag | Owning phase | Note |
|---|---------|-----------|--------------|------|
| 1 | `llm-reformulation` unfenced prompt-injection (+ cache-before-flag, no-negative-caching) — **SECURITY** | Agent D P2 | 007 | `llm-reformulation.ts` was owned by no phase; route the injection fence to 007 |
| 2 | `retrieval-directives` `parseCandidateLine` mid-word `indexOf` (malformed directives to LLM) | Agent D P2 | 007 | perf aspect already mapped to 010; this is the dropped correctness bug |
| 3 | content-router Tier-1 drops chunks containing `tool:`/`user:` | Agent F P2 | 003 | chunk-drop on the save/dedup lane |
| 4 | stale-delete counts cascaded children as failures | Agent F P2 | 004 | coverage/reconcile accounting |
| 5 | session-boost writes ranking score into `attentionScore` alias (contract violation) | Agent C P2 | 007 | score-scale/contract lane |
| 6 | constitutional recency exemption = perpetual +0.07 (tier-order violation) | Agent C contract | 007 | |
| 7 | concept alias map expands common words (default-ON, dilutes lexical precision) | Agent D refinement | 007 | |
| 8 | FSRS hybrid-decay default-ON before flag check | Agent C contract | 009 | learning-loop decay lane |
| 9 | dashboard `latency` prefix mislabels `ablation_latency_*` as improved; quality snapshots eternal `eval_run_id=0` | Agent G P2 | 009 | eval/dashboard lane |
| 10 | session-trace causal reducer (single co-occurrence, no threshold) | Agent G P2 | 008 | causal-graph hygiene |
| 11 | `memory_context` resume hardcodes `fingerprintStatus:'verified'` | Agent E | 012 | envelope/doc-alignment |
| 12 | `memory_context` JSON-in-string double-encoding | conscious defer (report §3/§4) | 012 | previously had no explicit 013 slot |
| 13 | working-memory decay double-apply | report §3 P1 #20 | 009 | the only report §3 P1 with no fix-phase owner; reassigned off code-less 013 to 009 |

### Section-level index (coarse cross-check only — NOT the guarantee)

Retained to reconcile per-section counts against the ledger. One row per ledger section; individual findings are owned by the finding-level table above plus each phase's own tasks.

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
- [ ] Finding-level table has zero Pending rows and covers all 13 pre-enumerated silent drops; section-level index reconciled; reconstructed P2 list fully dispositioned in 006/004 (count reconciled to the "91" headline, delta explained)
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
- **Absorbed trackers**: `../../../004-review-remediation/002-memory-schema-and-concurrency/`, `../../../004-review-remediation/004-p2-triage/`, `../../../000-release-cleanup/015-manual-playbook-execution-sweep/001-findings-remediation/`
<!-- /ANCHOR:cross-refs -->
