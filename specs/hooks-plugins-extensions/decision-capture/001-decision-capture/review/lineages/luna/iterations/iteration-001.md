# Review Iteration 001

## Dispatcher

- Iteration: 1 of 7
- Mode: review
- Dimension: correctness
- Target agent: deep-review
- Agent definition loaded: true
- Resolved route: Resolved route: mode=review target_agent=deep-review
- Operator review focus: Decision-capture series code and docs: .skilled/hooks/decision-capture (lib, bin sweeps, claude, devin, pi adapters and tests), .opencode/plugins/decision-capture.js, system-spec-kit runtime decision-table-matcher.ts, cli/continuity/match-decision-table.ts, decision-record-writer.ts consumed-log reader, cli/core/workflow.ts operator-decision path, .skilled/commands/speckit/save.md decision step, hooks README and coverage-rationale, the operator-decision-capture feature catalog entry and the decision-capture playbook scenarios. Look for correctness bugs, security and path issues, maintainability and overengineering.
- Focus application: This correctness pass traced the Claude and Pi transcript selectors through their sweep write paths, and checked the shared chat-candidate detector that feeds save-time decision proposals. Save, matcher, writer, other adapter, catalog, and playbook paths remain scheduled for later dimension passes.

## Files Reviewed

- .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:194
- .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:239
- .skilled/hooks/decision-capture/bin/sweep-pi.mjs:234
- .skilled/hooks/decision-capture/bin/sweep-pi.mjs:275
- .skilled/hooks/decision-capture/lib/chat-questions.mjs:34
- .skilled/hooks/decision-capture/lib/chat-questions.mjs:81
- .skilled/hooks/decision-capture/lib/capture-core.mjs:64
- .skilled/hooks/decision-capture/lib/capture-core.mjs:129

## Findings by Severity

### P0 Findings

None.

### P1 Findings

1. **Claude and Pi can select a transcript from a different project when project paths collide** -- .skilled/hooks/decision-capture/bin/sweep-transcript.mjs:244 -- Both default transcript selectors map project paths with lossy replacement: Claude replaces every non-alphanumeric character with a hyphen, and Pi replaces path separators with hyphens. For example, /work/foo-bar and /work/foo/bar map to the same project key in each adapter. The selectors then choose the newest transcript in that shared directory without checking that the transcript belongs to the requested project. The sweep writes the recovered answers to the current project queue, so a save can attach another project's operator choices to the wrong packet.
Finding class: cross_project_transcript_contamination
Scope proof: The default path is reached from each CLI when no --transcript argument is supplied; both sweep functions then append recovered records under the current projectDir.
Affected surface hints: .skilled/hooks/decision-capture/bin/sweep-transcript.mjs, .skilled/hooks/decision-capture/bin/sweep-pi.mjs, .skilled/hooks/decision-capture/lib/capture-core.mjs, .skilled/commands/speckit/save.md
Case: Run a save in /work/foo/bar after a newer Claude or Pi transcript was written for /work/foo-bar; both paths map to the same transcript directory, and the unrelated answers can be queued in /work/foo/bar.
Claim-adjudication:
```json
{"type":"claim_adjudication","claim":"The default Claude and Pi transcript selectors can return another project's transcript because their project-directory keys are not injective and they do not validate project identity after selection.","evidenceRefs":[".skilled/hooks/decision-capture/bin/sweep-transcript.mjs:239",".skilled/hooks/decision-capture/bin/sweep-transcript.mjs:254",".skilled/hooks/decision-capture/bin/sweep-transcript.mjs:194",".skilled/hooks/decision-capture/bin/sweep-pi.mjs:275",".skilled/hooks/decision-capture/bin/sweep-pi.mjs:280",".skilled/hooks/decision-capture/bin/sweep-pi.mjs:234"],"counterevidenceSought":"Compared the other selectors: Devin and OpenCode query their session stores by working directory, while Codex checks the transcript cwd. No equivalent identity check appears in the Claude or Pi default selector.","alternativeExplanation":"The runtime may retain a canonical project identity in transcript metadata, but these selectors do not inspect it before returning the latest file.","finalSeverity":"P1","confidence":"high","downgradeTrigger":"Downgrade if the runtime directory scheme is shown to be collision-resistant or the selected transcript is validated against the canonical current project path before sweep."}
```

### P2 Findings

2. **A closing code or quotation paragraph can be emitted as a chat question** -- .skilled/hooks/decision-capture/lib/chat-questions.mjs:90 -- Earlier paragraphs are screened with asks(), which strips code and quoted text through prose(), but the closing paragraph bypasses that filter and only checks whether it contains a question mark. The shared detector can therefore offer code or quoted text as a decision question when it is the final paragraph.
Finding class: false_positive_chat_candidate
Scope proof: Every runtime sweep passes normalized assistant and prompt turns to chatCandidatesFromTurns; the final paragraph takes the closing branch at this line before save-time proposals are formed.
Affected surface hints: .skilled/hooks/decision-capture/lib/chat-questions.mjs, all transcript sweep adapters, .skilled/commands/speckit/save.md
Case: An assistant ends a response with a fenced code sample containing "Should the badge be blue?" and the operator replies to a different preceding request; because the code sample is the closing paragraph, it is emitted as a candidate.
No claim-adjudication packet is required for this P2.

## Traceability Checks

- Core spec_code: partial for this pass; runtime path selection and candidate behavior reviewed, full code-to-spec mapping deferred.
- Core checklist_evidence: not evaluated in this correctness pass.
- Overlay feature_catalog_code: queued for the traceability pass.
- Overlay playbook_capability: queued for the traceability pass.

## Workflow Contract Conflict

- The workflow YAML includes eventId inside graph_convergence_evaluated data, but the ledger schema closes that payload without an eventId field. The first gateway append was refused; this lineage records the deviation and retries with the schema-valid fields only.

## Integration Evidence

The save command consumes sweep output and distinguishes queued answers from chat candidates. This pass reviewed the shared candidate producer and the Claude/Pi sweep destination, but did not execute the save workflow or tests.

## Edge Cases

- Distinct project paths that differ by a slash versus a hyphen collide in both the Claude and Pi project keys.
- Only the closing paragraph bypasses prose filtering; earlier code and quoted paragraphs are screened.
- No runtime transcript was opened; conclusions follow from the selector transforms and their direct sweep call paths.

## Confirmed-Clean Surfaces

- Codex's latest transcript selector checks the transcript's cwd against projectDir before returning it.
- The chat candidate cap remains explicit and ranked; no cap defect was observed in the reviewed shared detector.

## Ruled Out

- No evidence in the reviewed slice that the Claude/Pi sweep writes outside the current project's local decision-capture queue.
- No tests were run; the review strategy marks runtime tests as out of scope for this read-only loop.

## Next Focus

- Dimension: security
- Focus area: Transcript discovery, path identity, queue and consumed-log boundaries across the bound decision-capture focus.
- Reason: Verify whether the confirmed project-key collision permits broader path or trust-boundary failures and inspect remaining runtime selectors.
- Rotation status: D1 correctness recorded; move to D2 security.
- Blocked/productive carry-forward: Productive approach was tracing selector output to the queue write; carry it into the other adapters and save/matcher path.
- Required evidence: Direct reads of all remaining adapters, hook/plugin entry points, and queue/log path functions.
- Recovery note: Recheck the collision finding's call path and keep it active unless a project-identity validation is found.

Review verdict: CONDITIONAL
