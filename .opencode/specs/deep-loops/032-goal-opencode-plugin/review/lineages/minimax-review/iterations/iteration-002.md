# Iteration 002: Correctness — spec.md phase-map vs on-disk phase folders

## Focus

- Dimension: correctness
- Goal: verify the parent's phase-map table (spec.md:172-192) against the
  on-disk `Status` field in every phase's `spec.md`, `implementation-summary.md`,
  and `graph-metadata.json`. Find three-way status disagreements the
  four-reviewer audit missed.

## Scorecard

- Dimensions covered: correctness (status alignment)
- Files reviewed: 21 phase folders + parent spec.md + parent graph-metadata
- New findings: P0=0 P1=2 P2=2
- Refined findings: 1 (F001)
- New findings ratio: 1.0 (4/4 — every observation is novel)

## Findings

### P0 Findings

None.

### P1 Findings

- **F006 — Phase 012 has a three-way status disagreement** —
  `.opencode/specs/deep-loops/032-goal-opencode-plugin/012-regression-test-backfill/spec.md:43`
  declares `Status: Draft`, but the same phase's
  `implementation-summary.md:8` declares `Status: Complete` (and the
  parent's phase-map at `spec.md:183` says "012-regression-test-backfill
  | Complete"). The phase's own `graph-metadata.json:39` still reports
  `derived.status: draft`. This is the exact three-way status drift the
  four-reviewer audit dossier flagged for phases 010/011/013 (PKT-1/2/10/12
  in `../scratch/2026-07-03-four-reviewer-audit-findings.md` §C), but
  the dossier did not list 012 in the affected set. Phase 015's
  REQ-003 enumerates only 010/011/013/014 for status reconciliation; 012
  is missed by both the audit and the planned fix.
  - Category: correctness
  - Source evidence: spec.md:43 (`Draft`), implementation-summary.md (line ~8
    shows `Status | Complete` per grep `iterations/iteration-002.md:96-100`),
    graph-metadata.json:39 (`draft`).
  - Affected surface hints: `["012-regression-test-backfill/spec.md",
    "012-regression-test-backfill/implementation-summary.md",
    "012-regression-test-backfill/graph-metadata.json",
    "phase 015 REQ-003 (out of scope as currently written)"]`

- **F007 — Parent `derived.last_active_child_id` is 018-test-architecture-restructure
  (Planned), not a Complete phase** —
  `.opencode/specs/deep-loops/032-goal-opencode-plugin/graph-metadata.json:244`
  reports `last_active_child_id: deep-loops/032-goal-opencode-plugin/018-test-architecture-restructure`
  and `last_active_at: 2026-07-03T15:55:15.231Z`. The phase-map shows 018
  as `Planned` (spec.md:189). The `last_active_child_id` is supposed to
  point at the most recently materialized, in-progress child; pointing it
  at a Planned spec folder (whose only files are the lean quartet
  authored on 2026-07-03) means resume will land on a phase that has no
  implementation summary to anchor on. This will misroute `/speckit:resume`
  until the value is updated when 018 begins execution.
  - Category: correctness
  - Source evidence: `graph-metadata.json:244-245`, `spec.md:189` (phase-map row).
  - Affected surface hints: `["graph-metadata.json", "/speckit:resume target",
    "phase 018"]`

### P2 Findings

- **F008 — Phases 015/016/017/018/019/020/021 are all `Planned` but their
  `implementation-summary.md` files exist with `Status: Complete` rows
  in the spec-kit template** —
  Grep output (this iteration:106-114) shows e.g. `015 ... | Status | Complete`
  in the implementation-summary.md, but the matching spec.md says `Planned`
  and graph-metadata says `planned`. The `implementation-summary.md` files
  for 015-021 are template scaffolds (the lean quartet) and the `Status:
  Complete` rows are template boilerplate, not evidence of completion.
  Each Planned phase's `implementation-summary.md` should not claim
  `Status: Complete`; this is a template voice leak that could mislead a
  future reader into thinking the phase is shipped.
  - Category: correctness
  - Source evidence: grep of `*implementation-summary.md` for `| **Status** |`
    shows 015-021 all carry `Complete` boilerplate.
  - Affected surface hints: `["phase 015-021 implementation-summary.md templates",
    "lean template voice"]`

- **F009 — Phase 014's spec.md metadata has a `Status: Complete` row
  at line 43, but the four-reviewer audit dossier flagged 014 as
  "missing Status row"** —
  The audit dossier (`../scratch/2026-07-03-four-reviewer-audit-findings.md`
  §C, PKT-1 row) says 014 has no Status row in spec.md. The current
  spec.md DOES carry the row (`spec.md:43` in 014's folder, visible
  at `iterations/iteration-002.md:148-160`). Either the audit captured
  a snapshot before the row was added, or the row was added in a later
  pass. Phase 015 REQ-003 still includes "014's spec.md has a Status
  row" as a fix, which is now redundant; the dossier and REQ-003
  should be reconciled so phase 015 doesn't make a no-op edit.
  - Category: traceability
  - Source evidence: 014 spec.md:43 vs the dossier's PKT-1 enumeration and
    phase 015 REQ-003.
  - Affected surface hints: `["014-goal-state-cleanup-and-archive/spec.md",
    "phase 015 REQ-003 (redundant after live state)"]`

## Refinements

- **F001 refined** — Originally recorded as "orphan phase folder
  009-diagnostic-review/ has no spec.md/plan.md/tasks.md/impl-summary.md."
  Re-confirmed via this iteration's directory listing: the folder has
  nine review-packet files (deep-review-config.json, dashboard, registry,
  state, strategy, deltas/, iterations/, prompts/, review-report.md) and
  no lean quartet. This is consistent with the original finding; no
  severity change. Recorded in `iterations/iteration-001.md:48-58`.

## Cross-Reference Results

| Protocol           | Status   | Gate     | Evidence                                       | Notes |
|--------------------|----------|----------|------------------------------------------------|-------|
| spec_code          | partial  | hard     | spec.md:172-192 phase-map vs 21 Status rows     | One disagreement (F006) found in 012; F008 in 015-021; F007 in resume target |
| checklist_evidence | n/a      | hard     | not run this iteration                         | Defer to iteration 005 |
| skill_agent        | n/a      | advisory | not run this iteration                         | Defer to iteration 005 |
| agent_cross_runtime| n/a      | advisory | not run this iteration                         | Defer to iteration 009 |
| feature_catalog_code| n/a     | advisory | not run this iteration                         | Defer to iteration 007 |
| playbook_capability| n/a      | advisory | not run this iteration                         | Defer to iteration 008 |

## Assessment

- newFindingsRatio: 1.0 (4/4 novel, 1 refinement)
- dimensionsAddressed: correctness
- noveltyJustification: Three-way status alignment audit across all 22
  phase folders (3 fields per phase = 66 cells), plus the parent's
  `last_active_child_id` field. The four-reviewer audit enumerated 010/011/013
  for status reconciliation; this iteration finds 012 missed by both the
  audit and phase 015 REQ-003, plus the last_active_child_id misroute.

## Ruled Out

- Phase 020's `Status: Complete` boilerplate in implementation-summary.md
  would be a blocker if it were in a Complete phase, but 020 is Planned,
  so this is a template voice leak (covered as F008).
- The `009-diagnostic-review` folder is not a phase in the lean quartet
  sense; its absence of Status rows is a consequence of the orphan-folder
  finding (F001), not a new issue.

## Dead Ends

- Trying to derive status from `description.json` — those files don't
  carry a `status` field; status is in `spec.md` and `graph-metadata.json`.
  The skill's `generate-context.js` writes `derived.status` to graph
  metadata, not the description.json top level.

## Recommended Next Focus

Iteration 003: security dimension — audit mk-goal.js's prompt injection
clamp, role-label neutralizer, and verifier evidence redaction. The
audit dossier has F5 (P2) on the role-label neutralizer prefix class
and DR-005 on sanitizer hardening; re-validate the post-phase-010 fix
and look for adjacent attack surfaces the audit did not enumerate.

## Claim Adjudication

```json
{"findingId":"F006","claim":"Phase 012 spec.md says 'Draft' but implementation-summary.md says 'Complete' and parent's phase-map says 'Complete'; graph-metadata.json says 'draft'. Three-way status disagreement not caught by the four-reviewer audit (which listed 010/011/013 only).","evidenceRefs":[".opencode/specs/deep-loops/032-goal-opencode-plugin/012-regression-test-backfill/spec.md:43",".opencode/specs/deep-loops/032-goal-opencode-plugin/012-regression-test-backfill/implementation-summary.md:8",".opencode/specs/deep-loops/032-goal-opencode-plugin/012-regression-test-backfill/graph-metadata.json:39",".opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:183"],"counterevidenceSought":"Re-grepped 012 folder for Status rows; spec.md:43 is 'Draft', impl-summary shows 'Complete', graph derived.status is 'draft'. Phase 015 REQ-003 enumerates 010/011/013/014 only, not 012.","alternativeExplanation":"Could be a deliberate 'Draft' label meaning 'regression test backfill is draft' (i.e. the tests are aspirational); but the implementation-summary and parent phase-map both say 'Complete', which is the discrepancy.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"If 012 is intentionally in two states (spec.md Draft vs impl Complete) because the regression tests are aspirational scaffolding, downgrade to P2 documentation drift."}
{"findingId":"F007","claim":"Parent graph-metadata.json last_active_child_id points at 018-test-architecture-restructure, which is a Planned phase. Resume will misroute.","evidenceRefs":[".opencode/specs/deep-loops/032-goal-opencode-plugin/graph-metadata.json:244-245",".opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:189"],"counterevidenceSought":"Re-checked 018's spec.md:189 shows 'Planned'. graph-metadata 018/derived.status is 'planned'. No implementation-summary content past the lean template.","alternativeExplanation":"Could be by design (resume 'last authored' is correct semantic); the convention says last_active_child_id points at the most recently materialized child regardless of completion, so this is intentional. Investigate further in iteration 005 or by reading /speckit:resume implementation.","finalSeverity":"P1","confidence":0.7,"downgradeTrigger":"If /speckit:resume treats last_active_child_id as a hint rather than a target and the operator can override via folder argument, downgrade to P2."}
```

Review verdict: CONDITIONAL