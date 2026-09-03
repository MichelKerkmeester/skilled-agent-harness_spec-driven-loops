---
title: "Iteration 1: D1 Correctness — Requirement logic, completion claims, and gate integrity"
trigger_phrases: []
---
# Iteration 1: D1 Correctness — Requirement logic, completion claims, and gate integrity

## Focus
Dimension: correctness. Scope: packet spec/plan/tasks/acceptance-criteria/implementation-summary/description.json, parent phase map, and `check-ac-coverage.sh` (rule + tests). Confirm REQ-001..006 against the shipped rule, and whether completion metadata can be trusted.

## Scorecard
- Dimensions covered: correctness
- Files reviewed: 11
- New findings: P0=0 P1=3 P2=1
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 1.0

## Findings

### P0, Blocker
- None.

### P1, Required
- **F001**: `plan.md` specifies a goal-document validator, not the AC_COVERAGE evidence-source fix, `specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/plan.md:8`, [Evidence: frontmatter description is "A present-file rule that checks a goal document's shape: its durable and log headings, a binding block on phase parents, listed child paths that exist, and a durable slice within its character budget." Architecture §3 (`plan.md:78-85`) lists Shape/Binding/Path/Budget checks and a data flow that "reads the goal document if present." That is the 042 `GOAL_SHAPE` rule. This packet's spec (`spec.md:59-69`) and shipped code (`check-ac-coverage.sh:179` `_ac_analyze_canonical`, `:72` `_ac_traceability_file`) implement an evidence-source repair. A resume agent following `plan.md` would implement the wrong rule.]
- **F002**: Parent phase map still lists this packet as Pending, `specs/system-speckit/033-spec-kit-template-optimization/spec.md:111`, [Evidence: Files to Change in this packet (`spec.md:99`) requires `specs/.../033-*/spec.md` to "Phase map records phase 2 as shipped." The parent map row for phase 4 is `| 4 | 004-checklist-deprecation-closure/ | [Phase 4 scope] | Pending |`. Handoff criteria `003 → 004` are still `[Criteria TBD]` (`parent spec.md:126`). Phase 2 of the parent (002-acceptance-criteria-template) is already Complete (`parent spec.md:108`); the unedited row is this packet's own map entry.]
- **F003**: Packet completion metadata contradicts Status Complete, `specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/spec.md:27`, [Evidence: spec.md `_memory.continuity.completion_pct: 0` and `next_safe_action: Validate the packet and close it out` (`spec.md:18,27`) while metadata Status is Complete (`spec.md:47`). plan.md `completion_pct: 0` and `next_safe_action: Implement the canonical evidence read` (`plan.md:17,25`). tasks.md `completion_pct: 0` (`tasks.md:25`) while T001–T012 are `[x]` (`tasks.md:56-81`). implementation-summary.md `completion_pct: 100` and Status Complete (`implementation-summary.md:25,44`). A resume agent would re-implement shipped work.]

### P2, Suggestion
- **F004**: Generated `description.json` still says Level 1, `specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/description.json:17`, [Evidence: `"level": "1"` vs `<!-- SPECKIT_LEVEL: 2 -->` (`spec.md:36`) and metadata Level 2 (`spec.md:45`). Advisor/routing metadata would mis-score this packet.]

## Claim adjudication

```json
{
  "findingId": "F001",
  "claim": "plan.md describes the 042 goal-document validator rather than the AC_COVERAGE evidence-source fix this packet shipped.",
  "evidenceRefs": [
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/plan.md:8",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/plan.md:78",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/spec.md:59",
    ".opencode/skills/system-spec-kit/scripts/rules/check-ac-coverage.sh:179"
  ],
  "counterevidenceSought": "Compared plan.md §3 to check-goal-shape.sh and to check-ac-coverage.sh. Plan components (durable/log headings, binding block, child path existence, durable-slice budget) match GOAL_SHAPE, not AC_COVERAGE.",
  "alternativeExplanation": "plan.md could be an addendum for a later goal-template phase accidentally left in. Rejected: the title and packet pointer are this packet's, and there is no AC_COVERAGE architecture section to supersede it.",
  "finalSeverity": "P1",
  "confidence": 0.95,
  "downgradeTrigger": "If plan.md §1–§3 are rewritten to the evidence-source/precedence/lifecycle design actually shipped, downgrade to P2 leftover-template noise.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F002",
  "claim": "The parent 033 phase map still marks 004-checklist-deprecation-closure Pending even though this packet listed that map update as in-scope shipped work.",
  "evidenceRefs": [
    "specs/system-speckit/033-spec-kit-template-optimization/spec.md:111",
    "specs/system-speckit/033-spec-kit-template-optimization/spec.md:126",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/spec.md:99"
  ],
  "counterevidenceSought": "Read the parent phase map and handoff table. Phase 2 (002) is Complete; phase 4 (this packet) is Pending with TBD handoff criteria. 002-acceptance-criteria-template/implementation-summary.md:43 Status Complete confirms phase 2 was already shipped.",
  "alternativeExplanation": "Files to Change 'phase 2 as shipped' might mean parent phase 2, already Complete, so no edit was required. Rejected as the primary reading: this packet is phase 4, the Pending row is this folder, and the Files to Change path is the parent spec.md.",
  "finalSeverity": "P1",
  "confidence": 0.88,
  "downgradeTrigger": "If the parent map row for phase 4 is set Complete with real handoff criteria, or an ADR states the map is owned by a later close-out packet, downgrade to P2.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

```json
{
  "findingId": "F003",
  "claim": "Status Complete coexists with completion_pct 0 and a next_safe_action to implement work that tasks.md already marks done.",
  "evidenceRefs": [
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/spec.md:27",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/spec.md:47",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/plan.md:17",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/tasks.md:25",
    "specs/system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure/implementation-summary.md:25"
  ],
  "counterevidenceSought": "Read all five continuity blocks. implementation-summary and goal.md report completion_pct 100; spec/plan/tasks remain at 0. T001–T012 are checked with file:line evidence. Did not run validate.sh (lineage write-surface ban).",
  "alternativeExplanation": "completion_pct 0 could mean 'memory save never ran' rather than 'work unfinished'. That still leaves next_safe_action pointing at implementation and is a resume footgun, so P1 stands.",
  "finalSeverity": "P1",
  "confidence": 0.9,
  "downgradeTrigger": "If spec/plan/tasks continuity and next_safe_action are reconciled to the shipped summary, downgrade to P2 fingerprint/placeholder noise.",
  "transitions": [
    { "iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery" }
  ]
}
```

## Traceability Checks (this iteration)
- `spec_code`: partial — REQ-001 (canonical Verification read at `check-ac-coverage.sh:179`), REQ-002 (waived/superseded at `:220`), REQ-003 (tasks-first at `:72`), REQ-004 (lifecycle at `:50-60`), REQ-005 (header bind at `:200-208`), REQ-006 (14 named cases in `scripts/tests/check-ac-coverage.sh`) are present in code. Packet plan/parent-map/continuity claims do not match that shipped state (F001–F003).
- `checklist_evidence`: not fully executed; deferred to D3. Observation only: T001–T012 are `[x]` with citations; leftover CHK-* rows are `[ ]` by documented design (`implementation-summary.md:120`).

## Correctness of the rule (inspection, suite not executed)
- `bash -n` on rule and test: clean.
- `_ac_analyze_canonical` and `_ac_count_total` both prefer `acceptance-criteria.md` when present (`check-ac-coverage.sh:155-157,314-315`).
- Test file names 14 cases pinning ratio not severity (`scripts/tests/check-ac-coverage.sh:30,60-129`). Suite uses `mktemp` and was not run from this lineage.
- Four packet-042 `acceptance-criteria.md` files each have five Verification cells with `file:line` citations (20 cells), matching the backfill claim in `implementation-summary.md:70`.

## Adversarial self-check
- Hunter: re-read plan.md:8-85, parent spec.md:106-126, spec.md:27-47, tasks.md:25 vs 56-81.
- Skeptic: F001 is documentation, not a failing ratio. Kept P1 because plan.md is the implementation contract a follow-on agent would execute.
- Referee: no P0. Three P1s confirmed. F004 stays P2.

## Next Dimension
D2 Security — trust boundaries of the awk parsers, path handling, escaped-pipe split, lifecycle status matching, and default-on flag.

Review verdict: CONDITIONAL
