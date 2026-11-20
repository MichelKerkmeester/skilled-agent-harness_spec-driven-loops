# Review Iteration 006

## Dispatcher

- Mode: review (fan-out lineage `vibe-3`)
- Session: `fanout-vibe-3-1795172940208-84a42n`, generation 1, lineageMode `new`
- Frontier node: F-1-006 (follow-up fixes and answer routing), dimension `traceability`
- Operator review focus: the phase-019 commit set at HEAD. This iteration addressed the focus by reconciling the packet's own answer counts against the committed rows, checking the one-commit-per-track claim, and testing whether the zero fingerprint can suppress a later save.
- Sources read: `steer.md` (absent), `deep-review-strategy.md`, `frontier-nodes.jsonl`, `git log 2f5fe41bb9e~1..aaaff7dd9df`, `git diff 2f5fe41bb9e~1 aaaff7dd9df`, the owning packet's `goal.md` and `implementation-summary.md`, and the HEAD files cited below.

## Files Reviewed

- `specs/system-skill-advisor/.../019-ollama-lane-honest-and-closeout/implementation-summary.md:3`, `:88`, `:120`
- `specs/system-skill-advisor/.../019-ollama-lane-honest-and-closeout/goal.md:47`, `:64`
- `specs/**/decision-record.md` (73 files, 227 added rows)
- `.skilled/skills/system-spec-kit/runtime/dist/lib/continuity/decision-record-writer.js:400-401`
- `.skilled/skills/system-spec-kit/runtime/dist/lib/resume/resume-ladder.js:495-517`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The packet summary claims 581 recorded answers while the decision and the commits say 231 and 227** -- `specs/system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/019-ollama-lane-honest-and-closeout/implementation-summary.md:3` -- the frontmatter description states that "581 unrecorded operator answers are recorded or settled", decision D3 in `goal.md:47` names 231 orphan answers, and the ten docs commits add 227 `| Q0` rows. The summary's own evidence table (`:120`) reports the post-write orphan scan as clean apart from a still-running session and "2 answers no packet records", and `:88` names 58 inferred mappings. None of the four numbers is reconciled anywhere in the packet, so an operator auditing the phase cannot tell which count the delivery should be measured against.
   Finding class: traceability
   Scope proof: the owning packet is named in the review focus, and the answer-routing claim is frontier node F-1-006's own question.
   Affected surface hints: the packet's `description.json` (generated from this frontmatter), the phase-019 closeout record, any later audit that counts recorded answers.
   Case: an operator reads the packet description, expects 581 recorded answers, counts 227 in the ten commits, and cannot tell whether 354 answers were lost or the sentence describes a wider scope.
   Claim adjudication:
   ```json
   {"type":"claim","claim":"The packet summary states 581 recorded answers while the decision names 231 and the commits add 227 rows, and the packet reconciles none of them.","evidenceRefs":["implementation-summary.md:3","goal.md:47","implementation-summary.md:120","implementation-summary.md:88"],"counterevidenceSought":"Searched the summary and goal for a sentence that defines 581 as a repo-wide total, and counted the added rows directly from the diff rather than trusting either figure.","alternativeExplanation":"581 is the repo-wide number of unrecorded answers found by the scan, 231 is this phase's share, and 227 is the number written after four were skipped with a reason.","finalSeverity":"P1","confidence":"medium","downgradeTrigger":"Downgrade to P2 if a packet sentence is found that defines 581 as the repo-wide total and the description is read as covering answers settled outside this phase."}
   ```

### P2 Findings

None.

## Traceability Checks

- `spec_code` -- pass -- the ten commits are one per spec track, matching D3's "one commit per spec track": agents, agents-md, cli-external-orchestration, hooks-plugins-extensions, sk-code, sk-doc, sk-git, system-skill-advisor, system-skilled-doctor, system-speckit.
- `checklist_evidence` -- partial -- the D3 completion criterion (the orphan scan lists no ended session that was not skipped with a reason) is reported as met in the summary's evidence table, but the count reconciliation above keeps this protocol partial.

## Integration Evidence

- `.skilled/skills/system-spec-kit/runtime/dist/lib/resume/resume-ladder.js:508-517` -- `handoverBindingVerifies` compares the handover's `session_dedup.fingerprint` with `buildContinuityFingerprint(continuitySnapshot.content)`, so the writer's all-zeros fingerprint can never match a real content hash. The zero fingerprint therefore marks a record as unbound rather than as a duplicate, and it cannot suppress a later save.
- `.skilled/skills/system-spec-kit/runtime/dist/lib/continuity/decision-record-writer.js:400-401` -- the zero fingerprint is the writer's own constant, which confirms the resume-ladder reading.
- `specs/**/decision-record.md` -- the two shared answers name all three packets in their `Carried by` column, so the 227 rows represent 223 distinct answers plus four documented shared rows.

## Edge Cases

- The 227-versus-231 gap is consistent with four answers skipped with a reason, which the completion criterion allows. It is not raised as a separate finding because the orphan scan that would settle it was not run in this lineage.
- The summary's evidence table reports "2 answers no packet records" as a residual. That is a known, stated gap rather than a silent one, so it is recorded here and not raised.
- The zero fingerprint appears in 54 of the 73 records. Because the resume ladder treats it as unbound, the effect is a lost freshness tie-break for those packets, not a lost save.

## Confirmed-Clean Surfaces

- The zero fingerprint cannot suppress a save.
- The ten commits map one-to-one onto the ten spec tracks D3 names.
- The shared answers are documented as shared rather than duplicated by mistake.

## Ruled Out

- "The zero fingerprint makes a later save look like a duplicate": ruled out -- the resume ladder compares it against a recomputed content hash, which it can never match.
- "An answer was written into the wrong packet": ruled out for the two shared answers, whose records name all three packets.
- "The ten commits do not follow the one-commit-per-track rule": ruled out -- each commit names one track.

## Next Focus

- Dimension: maintainability
- Focus area: frontier node F-1-003, maintainability pass over the launcher and the coverage code
- Reason: F-1-006 traceability is complete; the remaining node work is the maintainability dimension on both nodes
- Rotation status: F-1-006 has 3 of 4 dimensions covered
- Blocked/productive carry-forward: productive -- the count reconciliation produced the P1 and the resume-ladder read closed the fingerprint question
- Required evidence: the launcher's structure, the coverage code's duplication, and the doc-to-code naming
- Recovery note: none

Review verdict: CONDITIONAL
