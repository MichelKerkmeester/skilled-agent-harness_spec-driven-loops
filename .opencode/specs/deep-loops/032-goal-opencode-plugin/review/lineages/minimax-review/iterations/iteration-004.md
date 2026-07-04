# Iteration 004: Traceability — phase-handoff criteria verification

## Focus

- Dimension: traceability
- Goal: verify the parent's "Phase Handoff Criteria" table
  (spec.md:201-226) against the actual implementation evidence in
  each phase's `implementation-summary.md` and `changelog/`.
- Cross-check the parent's `Verification` column for accuracy and
  completeness, especially the cited test runs.

## Scorecard

- Dimensions covered: traceability
- Files reviewed: 16 (parent spec.md, 5 phase impl-summaries, 5 phase changelogs, parent changelog README)
- New findings: P0=0 P1=2 P2=1
- Refined findings: 1 (F006 refined)
- New findings ratio: 1.0 (3/3 — every observation is novel)

## Findings

### P0 Findings

None.

### P1 Findings

- **F014 — Phase 009 (speckit-command-goal-prompt-offer) has a
  three-way status disagreement** —
  `.opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/spec.md`
  metadata says `Status: Planned`, but the same phase's
  `implementation-summary.md` says `Status: Complete` (line ~5,
  `grep` at `iterations/iteration-004.md:78-79`), and
  `graph-metadata.json` reports `derived.status: planned`. The
  parent's phase-map row (spec.md:180) says
  "In Progress (separate session)" — a third state distinct from
  both Planned and Complete. This is the same shape of drift as F006
  (012), but here the spec and graph agree (both say "planned")
  while the implementation-summary claims "Complete". The dossier
  (PKT-1 / REQ-003) does not list 009 for status reconciliation; the
  doc-staleness audit (2026-07-04) notes that 009 is "owned by a
  separate session, no changelog here" but does not adjudicate the
  status. Phase 015's REQ-003 enumerates 010/011/013/014 only.
  - Category: traceability
  - Source evidence: 009/spec.md metadata row, 009/implementation-summary.md
    line 5, 009/graph-metadata.json derived.status, parent spec.md:180.
  - Affected surface hints: `["009-speckit-command-goal-prompt-offer/{spec,
    implementation-summary, graph-metadata}.md", "phase 015 REQ-003",
    "phase-map row 9"]`

- **F015 — Parent handoff table (spec.md:216) annotates phase 010's
  verification evidence as "not cited", but phase 010's
  implementation-summary.md DOES cite fresh `node` execution
  evidence** —
  `spec.md:216` reads "All 5 phase-010 fixes land with the existing
  6-file test suite passing | Fresh `node` execution evidence (not
  cited) in phase 010's implementation-summary.md". The "(not cited)"
  annotation in the Verification column was correct at the time of
  authoring (the spec.md was written before phase 010's full
  verification was pasted), but phase 010's `implementation-summary.md`
  now carries:
  - Step 1: baseline suite (6 `exit: 0`)
  - Step 2: `node --check` pass
  - Step 3: post-edit suite (6 `exit: 0`)
  - Step 5: REQ-001, REQ-002, REQ-003 manual non-reproduction
    scripts with JSON output
  (per the read at `iterations/iteration-004.md:30-100`).
  So the "(not cited)" annotation in the parent's handoff table is
  stale; the citation now exists. The handoff table should be
  re-synchronized with the live state. This is a **documented
  gap in the handoff criteria that the operator already
  acknowledged but did not re-check after phase 010 closed**.
  - Category: traceability
  - Source evidence: spec.md:216 vs
    010-security-and-correctness-fixes/implementation-summary.md
    ## Verification section.
  - Affected surface hints: `["spec.md phase-handoff table",
    "phase 015 PKT-1 reconciliation scope"]`

### P2 Findings

- **F016 — Phase 012's handoff verification reference (spec.md:218)
  says "Full suite run plus T014 revert-and-fail spot-check evidence
  in phase 012's implementation-summary.md" but the implementation
  summary does not include an explicit "T014 revert-and-fail"
  spot-check section** — the impl summary for 012 has Step 1
  (baseline), Step 3 (regression after edits), and Step 5 (SC-002
  mutation check), all of which show 6/6 test files passing. There
  is no T014-named spot-check entry. The audit dossier
  (`scratch/2026-07-03-four-reviewer-audit-findings.md` §A) doesn't
  pin T014 specifically either. Either T014 was a planned task that
  was never written up, or the spot-check happened but wasn't
  recorded in the implementation summary. This is an advisory
  documentation gap, not a correctness defect.
  - Category: traceability
  - Source evidence: spec.md:218 vs grep of 012/implementation-summary.md
    for "T014" or "revert-and-fail" — neither phrase appears.
  - Affected surface hints: `["012-regression-test-backfill/implementation-summary.md",
    "spec.md:218"]`

## Refinements

- **F006 refined** — Originally recorded as three-way disagreement
  in phase 012. This iteration's deeper read confirms 012's
  implementation-summary.md and graph-metadata.json drift is the
  same pattern as F014 (009): spec + graph agree on Draft, impl
  summary claims Complete. Adding to the "three-way drift" pattern
  family. F006's confidence is unchanged at 0.9; F014's confidence
  is 0.95 (the doc/README confirms the separate-session ownership
  context).

## Cross-Reference Results

| Protocol           | Status   | Gate     | Evidence                                       | Notes |
|--------------------|----------|----------|------------------------------------------------|-------|
| spec_code          | partial  | hard     | spec.md:201-226 handoff table vs impl-summaries| 2 drifts (F014, F015), 1 missing citation (F016) |
| checklist_evidence | n/a      | hard     | not run this iteration                         | Defer |
| skill_agent        | n/a      | advisory | not run this iteration                         | Defer to iteration 005 |
| agent_cross_runtime| n/a      | advisory | not run this iteration                         | Defer to iteration 009 |
| feature_catalog_code| n/a     | advisory | not run this iteration                         | Defer to iteration 007 |
| playbook_capability| n/a      | advisory | not run this iteration                         | Defer to iteration 008 |

## Assessment

- newFindingsRatio: 1.0 (3/3 novel, 1 refinement)
- dimensionsAddressed: traceability
- noveltyJustification: cross-references each phase's Verification
  evidence against the parent's handoff table; surfaces two
  three-way status drifts (009, 012 — same pattern family) and one
  stale "(not cited)" annotation in the parent's handoff table
  (F015). F016 flags a missing spot-check in phase 012's
  implementation summary.

## Ruled Out

- Phase 014's "owned by a separate operator report" is not a status
  drift — phase 014's spec.md:43 says `Status: Complete` and the
  impl-summary evidence is rich. The audit dossier's PKT-1 row
  flagged 014 as missing a Status row, but this iteration confirms
  the row exists (F009).
- Phases 015-021 are Planned; their handoff criteria are forward-
  looking expectations, not current state, so they are not
  candidates for drift findings yet.

## Dead Ends

- The "6-file test suite" referenced in spec.md:216 and
  spec.md:222 (forward-looking for 016) actually corresponds to the
  7 cjs test files (capabilities, continuation, export-contract,
  lifecycle, state, supervisor, tool-path), not 6. The
  `mk-goal-export-contract.test.cjs` was added in phase 012's
  regression-test backfill; the handoff table was authored before
  that, and the count drifted from 6 to 7. This is a related
  contract drift but is documented as "(not cited)" annotation
  in spec.md:216; not a separate finding (subsumed by F015).

## Recommended Next Focus

Iteration 005: maintainability dimension — audit the test
architecture (10 cjs test files), helpers, naming consistency, and
the planned node:test conversion (phase 018 scope). Validate that
the test files share fixtures/helper patterns or have implicit
duplication that would make a node:test conversion risky.

## Claim Adjudication

```json
{"findingId":"F014","claim":"Phase 009 speckit-command-goal-prompt-offer has a three-way status disagreement: spec.md=Planned, graph-metadata=planned, implementation-summary=Complete; parent phase-map says In Progress.","evidenceRefs":[".opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/spec.md metadata row",".opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/implementation-summary.md:5",".opencode/specs/deep-loops/032-goal-opencode-plugin/009-speckit-command-goal-prompt-offer/graph-metadata.json derived.status",".opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:180"],"counterevidenceSought":"Re-grepped 009 folder for Status rows; spec says Planned, impl-summary says Complete, graph says planned. Parent phase-map says 'In Progress (separate session)'.","alternativeExplanation":"Could be that the separate session wrote the implementation-summary as a forward-looking scaffold before actual completion; or that 'Complete' in impl-summary is template boilerplate (similar to F008 finding for 015-021). Need to inspect impl-summary content for actual evidence vs template voice.","finalSeverity":"P1","confidence":0.9,"downgradeTrigger":"If 009's implementation-summary.md is template boilerplate (Status: Complete is a template default), downgrade to P2."}
{"findingId":"F015","claim":"Parent spec.md:216 annotates phase 010's verification evidence as 'not cited', but phase 010's implementation-summary.md DOES cite fresh node execution evidence (Steps 1, 2, 3, 5).","evidenceRefs":[".opencode/specs/deep-loops/032-goal-opencode-plugin/spec.md:216",".opencode/specs/deep-loops/032-goal-opencode-plugin/010-security-and-correctness-fixes/implementation-summary.md ## Verification"],"counterevidenceSought":"Re-read 010 impl-summary; confirmed Step 1 (baseline), Step 2 (syntax check), Step 3 (post-edit suite), Step 5 (REQ-001/002/003 manual non-reproduction) all carry cited outputs.","alternativeExplanation":"Could be that the 'not cited' annotation was deliberately retained as a reminder that the impl-summary was authored at a different time than the spec.md handoff table, and the operator prefers not to retroactively edit the handoff table. Unlikely — phase 015 PKT-1 reconciliation should sweep this.","finalSeverity":"P1","confidence":0.95,"downgradeTrigger":"If the operator intentionally keeps the '(not cited)' annotation as a backreference to a pre-fix state, downgrade to P2."}
```

Review verdict: CONDITIONAL