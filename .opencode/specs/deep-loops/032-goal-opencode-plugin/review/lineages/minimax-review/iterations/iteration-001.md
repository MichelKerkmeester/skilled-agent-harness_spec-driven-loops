# Iteration 001: Inventory + Spec-folder scope discovery

## Focus

- Dimension: correctness (init scope discovery)
- Goal: enumerate every file in the packet and surface structural anomalies
  (orphan folders, missing required files, level mismatches, and changelog
  coverage gaps) that should drive the rest of the loop.
- Files touched in this iteration: read-only.

## Scorecard

- Dimensions covered: correctness (scope-discovery pass)
- Files reviewed: 27
- New findings: P0=0 P1=2 P2=3
- Refined findings: 0
- New findings ratio: 1.0 (5/5 — every observation is novel to this packet)

## Findings

### P0 Findings

None.

### P1 Findings

- **F001 — Orphan phase folder `009-diagnostic-review/` has no spec.md, plan.md,
  tasks.md, checklist.md, or implementation-summary.md** —
  `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-diagnostic-review/`
  contains only a deep-review state packet
  (`deep-review-config.json`, `deep-review-dashboard.md`,
  `deep-review-findings-registry.json`, `deep-review-state.jsonl`,
  `deep-review-strategy.md`, `deltas/`, `iterations/`, `prompts/`, `review-report.md`).
  The folder is listed in `graph-metadata.json:21` as a child of the packet
  and the parent's phase-map table (spec.md:177) calls it a "diagnostic
  review" phase, but it has no spec/plan/tasks/impl-summary and the
  phase 015 scope explicitly notes (spec.md:115-116) that 009 has dangling
  cross-references to its actual artifact locations. This is a structural
  drift finding; it predates phase 015 but is not closed by phase 015's
  REQ-007 ("repair dangling cross-references"), which only adds a pointer
  note. The folder itself remains unaddressed.
  - Category: traceability
  - Source evidence: directory listing of `009-diagnostic-review/` shows the
    nine review-packet files and no `spec.md`. Compare
    `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/`
    which has the full lean quartet (`spec.md`, `plan.md`, `tasks.md`,
    `implementation-summary.md`).
  - Affected surface hints: `["graph-metadata.json", "spec.md phase-map", "phase 015 REQ-007"]`

- **F002 — `description.json` declares `level: "phase"` but the parent
  spec.md metadata says `Level: phase parent`** —
  `.opencode/specs/deep-loops/032-goal-opencode-plugin/description.json:2`
  states `"level": "phase"`. The packet's `spec.md:45` metadata table
  declares `Level: phase parent` and `spec.md:50` says `Parent Spec: None
  (top-level packet under deep-loops)`. The system-spec-kit skill treats
  `level: "phase"` as a child-phase, not a phase parent; the mismatch can
  cause the packet to be filtered out of phase-parent lookups and break
  resume (`derived.last_active_child_id`) traversal.
  - Category: correctness
  - Source evidence: `description.json:2` vs `spec.md:45-50`.
  - Affected surface hints: `["description.json", "spec.md metadata", "system-spec-kit resume"]`

### P2 Findings

- **F003 — Only phase 016 has a `checklist.md`; the other 22 phases do
  not** — `ls .opencode/specs/deep-loops/032-goal-opencode-plugin/0*` shows
  `chk:no` for every phase folder except `016-plugin-correctness-fixes`
  (which the system requires because phase 016 is Level 2). The
  `checklist_evidence` core protocol cannot be run with confidence for
  any other phase. The audit dossier does not call this out, and phase
  015's REQ-001/002 validator recalibration will not address it. This is
  consistent with the lean template design (Level 1 packets are not
  required to ship a checklist), so it is an advisory, not a defect.
  - Category: traceability
  - Source evidence: directory listing (per-phase `has_*` audit at
    `iterations/iteration-001.md:22-44`).
  - Affected surface hints: `["checklist_evidence protocol", "lean template design"]`

- **F004 — `changelog/` is missing entries for phases 015, 016, 017, 018,
  019, 020, 021 (all still "Planned" per parent spec.md phase-map)** —
  `changelog/README.md:30-44` lists rollup + 001-008, 010-014 only. Phases
  015-021 are not yet shipped, so this is correct by design; the table
  omits a row for 009 with the note "owned by a separate session, no
  changelog here" but does not call out 015-021 as "planned, no
  changelog yet". Adding the placeholder rows would clarify to a
  future reader that the absence is intentional rather than missing.
  - Category: maintainability
  - Source evidence: `changelog/README.md:30-44` vs
    `spec.md:186-192` (phase-map status column).
  - Affected surface hints: `["changelog/README.md", "spec.md phase-map"]`

- **F005 — `description.json:11` `lastUpdated: 2026-07-01T17:23:54.971Z`
  predates several major edits (phase 014 close, the doc-staleness
  audit, and the four-reviewer audit dossier)** — This is a freshness
  gap; description.json has not been regenerated since phase 014. The
  `lastUpdated` is informational rather than load-bearing for any
  protocol gate, but a stale value of this kind is a known marker for
  "forgot to run `generate-context.js` after the last material change."
  - Category: maintainability
  - Source evidence: `description.json:11`; the last_save_at on
    `graph-metadata.json:232` is `2026-07-03T15:55:15.231Z` (two days
    later, used here as a sanity check).
  - Affected surface hints: `["description.json", "generate-context.js"]`

## Cross-Reference Results

| Protocol          | Status | Gate     | Evidence                                    | Notes |
|-------------------|--------|----------|---------------------------------------------|-------|
| spec_code         | partial| hard     | spec.md:177 phase-map vs dir listing        | Inventory only this iteration |
| checklist_evidence| partial| hard     | only 016 has checklist.md                   | See F003 — protocol N/A for lean Level 1 |
| skill_agent       | n/a    | advisory | not run this iteration                      | Defer to iteration 005 |
| agent_cross_runtime| n/a   | advisory | not run this iteration                      | Defer to iteration 009 |
| feature_catalog_code| n/a  | advisory | not run this iteration                      | Defer to iteration 007 |
| playbook_capability| n/a   | advisory | not run this iteration                      | Defer to iteration 008 |

## Assessment

- newFindingsRatio: 1.0 (5/5 — every observation is novel)
- dimensionsAddressed: correctness (scope discovery)
- noveltyJustification: structural-inventory observations: orphan folder, level
  mismatch, checklist coverage, changelog placeholder gap, description.json
  staleness. None are re-derivations of the four-reviewer audit findings,
  but F001 partially aligns with PKT-7 / 015 REQ-007.

## Ruled Out

- All four dimensions run independently each iteration. The packet has
  enough remaining angles that the audit dossier's F1-F12, e-1.x, e-2.x,
  e-3.x, PKT-1..15, DOC-1/2, VAL-1/2, INT-1/2/3 will not be re-derived
  line-by-line; the dossier remains the source of truth for those.
- 014's status missing-row is a phase-015 scope item and out of scope for
  this packet-level iteration.

## Dead Ends

(none)

## Recommended Next Focus

Iteration 002: correctness — verify the parent's phase-map table against
the on-disk phase folders. Validate that the 21 declared phases exist
with the expected filenames and that the spec.md metadata
(`Status: In Progress`, `phases 001-008, 010-014 complete`) is consistent
with `graph-metadata.json` and each child's own `description.json`.

## Claim Adjudication

```json
{"findingId":"F001","claim":"Phase folder 009-diagnostic-review/ is listed as a child in graph-metadata.json but contains no spec.md, plan.md, tasks.md, or implementation-summary.md.","evidenceRefs":[".opencode/specs/deep-loops/032-goal-opencode-plugin/009-diagnostic-review/ (directory listing shows only review-packet files)",".opencode/specs/deep-loops/032-goal-opencode-plugin/graph-metadata.json:21",".opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:177"],"counterevidenceSought":"Re-checked 009-diagnostic-review/ for spec/plan/tasks/impl-summary/changelog; none found. Compared to 009-speckit-command-goal-prompt-offer/ which has the full quartet.","alternativeExplanation":"Could be a stale review packet left in place after the diagnostic review was completed and the findings were merged into the four-reviewer audit dossier. Phase 015 REQ-007 adds a pointer note but does not retire the orphan folder.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"If 009-diagnostic-review/ is intentionally a review-only artifact (not a phase folder), the parent's phase-map row should be removed and graph-metadata.json:21 should drop it from children_ids; downgrade to P2."}
{"findingId":"F002","claim":"description.json level field is 'phase' but spec.md metadata declares 'phase parent'.","evidenceRefs":[".opencode/specs/deep-loops/032-goal-opencode-plugin/description.json:2",".opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:45-50"],"counterevidenceSought":"Grepped both files for 'level' and 'phase parent'; spec.md is authoritative. system-spec-kit resume walks `parentChain` and `level` to decide whether a folder is a phase parent.","alternativeExplanation":"Could be a 'level' semantic drift in the spec-kit schema where 'phase' is the parent of 'phase-step'; not the case here, the spec.md metadata is explicit.","finalSeverity":"P1","confidence":0.85,"downgradeTrigger":"If the system-spec-kit skill treats 'phase' as the parent and 'phase-step' as the child, downgrade to P2 documentation drift."}
```

Review verdict: CONDITIONAL