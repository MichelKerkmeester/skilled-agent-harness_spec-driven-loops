---
title: "Research: session relaunch loop after phase 008"
description: "Five-iteration review of session relaunch code, adapters, handoff transitions, records, tests and documentation."
trigger_phrases:
  - "session relaunch loop"
  - "session handoff privacy"
  - "skilled-loop consume failure"
importance_tier: normal
contextType: research
---
# Research: session relaunch loop after phase 008

This five-iteration review found five confirmed code or record gaps and one architectural refinement. The strongest issue is that handoff directory creation does not establish the private repository boundary claimed by phase 008. Two separate consume-path failures can also lose the saved Gate 3 answer or discard a recovery record before a handoff is usable. The review was static; no tests or document extractors were run.

## 1. Executive Summary

The shared core, runtime adapters, wrapper, handoff CLI, tests and packet records were compared across five iterations. The review produced eight iteration-level findings, consolidated into six session-relaunch conclusions: five confirmed code/documentation/record gaps and one inferred architecture improvement. The repeated handoff-privacy finding from Iterations 1 and 5 is one issue; the parent worktree mismatch from Iterations 1 and 2 is also one issue.

The current handoff path can follow a pre-existing symlink, suppress mkdir/chmod errors and still return a note path. The CLI trusts the resolved handoffs directory as its containment root without checking it remains under the canonical repository. Separately, `skilled-loop` can omit the previously answered Gate 3 folder when `consume` fails, while `consume` can report success and delete its state even when its note could not be read or parsed.

## 2. Research Question and Scope

The research question was whether the session relaunch loop still has code/documentation/spec drift, latent failure edges, architecture refinements or standards gaps after phase 008. The review covered `.skilled/hooks/session-relaunch`, `.skilled/bin/skilled-loop`, `/speckit:handoff` references, the OpenCode plugin, runtime adapters, their tests and docs, phase 008 records, and the sk-code-skilled and sk-doc guidance.

All five strategy questions received an evidence-based discussion in iteration narratives. Persistent strategy metadata still shows five unchecked questions because the state projection did not accept Iterations 2–5; the convergence report distinguishes narrative coverage from persisted answer counts.

## 3. Method and Evidence

Five sequential source-review passes covered core/filesystem boundaries, adapter policy, wrapper failure transitions, test/document traceability and phase 008 closure evidence. Findings cite the relevant file and line. Confidence labels distinguish confirmed source/control-flow gaps from an inferred maintainability refinement. No tests, strict validators, resource-map generation or sk-doc quality-control extraction were run.

## 4. Architecture Observed

The shared session-relaunch code provides common helpers, while Claude, Codex, Hermes, Pi and OpenCode adapters each interpret host inputs and coordinate nudge policy. Pi and OpenCode also defer handoff delivery through host lifecycle state. The CLI plans and consumes handoff notes; `skilled-loop` handles relaunch, seed construction and manual recovery. The source comparison found shared policy concepts across adapters, but no confirmed current policy mismatch.

## 5. Finding: Handoff Directory Privacy Is Not Established

**Confirmed static code/documentation gap.** `ensureHandoffDir` attempts directory creation and mode change, suppresses errors and still returns a path. The CLI checks note containment relative to the resolved handoffs directory but does not establish that this directory remains under the canonical repository root. A pre-existing symlink can therefore direct note writes and chmod outside the repository; a writable target can also remain in use after a failed permission change. The existing focused test checks only a newly created directory's mode. Phase 008 says the directory is owner-only and that a failed create will fail visibly, which is stronger than this code path proves. [SOURCE: .skilled/hooks/session-relaunch/lib/nudge.cjs:219-225,267-273] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:128-190] [SOURCE: .skilled/hooks/session-relaunch/tests/nudge.test.cjs:495-506] [SOURCE: specs/hooks/023-session-relaunch-loop/008-review-3-remediation/acceptance-criteria.md:56] [SOURCE: specs/hooks/023-session-relaunch-loop/008-review-3-remediation/implementation-summary.md:52,91]

**Fix:** Resolve and validate the canonical repository root and every managed path component; reject symlinks and any resolved handoffs path outside that root; verify ownership and mode 0700 before returning a note path; fail closed on any check error. Add outside-symlink and chmod-failure tests, then align the phase summary and README with the guarantee those tests establish. This also closes the checklist gap for canonical paths and symlink escapes. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:101-108]

## 6. Finding: A Failed Consume Can Lose the Gate 3 Answer

**Confirmed control-flow edge.** `skilled-loop` extracts `spec_folder` from successful consume output. If consume fails, it still builds the relaunch seed or manual command without the folder suffix; `should-relaunch` does not return the folder as a fallback. The existing consume-failure test does not include a packet path or a Skip answer, while the README says the answer carries across the relaunch hop. [SOURCE: .skilled/bin/skilled-loop:68-87,450-465] [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:461-470,504-550] [SOURCE: .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs:1353-1373] [SOURCE: .skilled/hooks/session-relaunch/README.md:112]

**Fix:** Read and validate the saved `spec_folder` before consuming the record, or return it from a read-only `should-relaunch` path. Use that validated value when consume fails. Add failed-consume tests for both a packet path and `none`, covering relaunch and manual fallback output.

## 7. Finding: Invalid Handoff Consumption Can Delete Recovery State

**Confirmed control-flow edge.** `consume` catches note read or parse failures, may leave the note's spec folder unavailable, then unlinks the relaunch state and returns success. `skilled-loop` treats that result as permission to start a runtime with a claim seed pointing at an unreadable or invalid note. [SOURCE: .skilled/hooks/session-relaunch/bin/session-relaunch.cjs:504-550] [SOURCE: .skilled/bin/skilled-loop:456-467] [SOURCE: .skilled/hooks/session-relaunch/README.md:105-116]

**Fix:** Reject consumption before unlinking when the handoff is missing or invalid. Keep a recoverable record and make the wrapper show a manual recovery path rather than launching a claim that cannot succeed. Add missing-file and malformed-note cases.

## 8. Finding: Parent Worktree Metadata Still Names the Old Worktree

**Confirmed record inconsistency.** The parent spec Branch field and durable goal decision D6 still identify worktree 142. The later goal log records the amendment to worktree 148, and phase 008 binds worktree 148. [SOURCE: specs/hooks/023-session-relaunch-loop/spec.md:34] [SOURCE: specs/hooks/023-session-relaunch-loop/goal.md:52,131] [SOURCE: specs/hooks/023-session-relaunch-loop/008-review-3-remediation/goal.md:46]

**Fix:** Update the parent Branch field and D6 decision to worktree 148, or mark the earlier value as superseded in the durable decision so the active value is unambiguous.

## 9. Finding: Test README Omits the OpenCode Plugin Suite

**Confirmed documentation gap.** The session-relaunch test README lists the hook-directory suites and a command scoped to `.skilled/hooks/session-relaunch/tests/*.test.cjs`. The separate OpenCode plugin test is at `.opencode/plugins/tests/session-relaunch.test.cjs` and is listed in the Pi/OpenCode playbook, but the test README does not link to it. [SOURCE: .skilled/hooks/session-relaunch/tests/README.md:18-38,85-115] [SOURCE: .opencode/plugins/tests/session-relaunch.test.cjs:1-4] [SOURCE: .skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/session-relaunch-pi-opencode.md:83-89]

**Fix:** Add an OpenCode suite row and command, or label the README as covering only the hook-directory suites and link to the plugin test and its run command.

## 10. Architecture Refinement: Share Policy Preparation Across Adapters

**Inferred refinement, not a confirmed behavior mismatch.** The inspected Claude, Codex, Hermes, Pi and OpenCode paths repeat the threshold, pending-handoff and hop-cap checks, nudge-level selection, note planning, state updates and handoff-text construction. Pi and OpenCode add host-specific deferred delivery. [SOURCE: .skilled/hooks/session-relaunch/claude/context-nudge.mjs:97-128] [SOURCE: .skilled/hooks/session-relaunch/codex/shared.mjs:100-130] [SOURCE: .skilled/hooks/session-relaunch/hermes/context-nudge.mjs:80-124] [SOURCE: .skilled/hooks/session-relaunch/pi/session-relaunch.ts:306-350] [SOURCE: .opencode/plugins/session-relaunch.js:124-168]

**Recommendation:** Extract a shared policy-preparation function that accepts normalized usage, session, cwd and runtime inputs and returns a decision plus handoff text. Keep host event parsing and delivery timing in adapters, and add table-driven parity coverage for common policy decisions. A future mismatch between the shared function and any adapter test would change this recommendation's confidence.

## 11. Recommendations

| Order | Change | Evidence gate |
|---|---|---|
| 1 | Enforce canonical-root containment, reject symlinked managed paths, verify owner/mode, and correct privacy claims | Outside-symlink and chmod-failure tests pass; docs state the tested guarantee |
| 2 | Preserve Gate 3 data through consume failure and reject invalid handoffs before deleting state | Packet-path, Skip, missing-note and malformed-note cases cover both relaunch and recovery output |
| 3 | Reconcile the parent spec Branch field and D6 with worktree 148 | Parent records show one active worktree value |
| 4 | Add the OpenCode suite to the test inventory | README links to the distinct plugin suite and gives its command |
| 5 | Consider common adapter policy preparation | Table-driven adapter parity tests prove identical decisions while preserving host delivery behavior |

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| None recorded | Iteration files contain no `ruledOut` entries or `Dead Ends` sections; no rejected approach was reported | Iterations 1–5 | 1–5 |

## Divergence Map

No divergent pivots, pivot failures or overrides were recorded. The remaining review frontier is runtime verification of the filesystem and consume-path cases, followed by confirming the record fixes and adapter parity behavior.

## 12. Open Questions

- Do outside-symlink and chmod-failure cases reproduce the private-path gap under supported filesystems and platforms?
- Which failure modes can make a handoff disappear or become unreadable between `should-relaunch` and `consume`?
- Should the shared policy function own persisted-state mutation, or should it remain a pure decision function with the core owning persistence?
- After the parent records are reconciled, are there other active references to worktree 142?
- Does the sk-doc quality-control extractor identify any additional structure or citation issues in the session-relaunch documentation?

## 13. Standards Alignment

The confirmed filesystem issue conflicts with the sk-code-skilled universal checklist requirement to establish canonical paths and reject symlink escapes. The missing OpenCode test link is a discoverability and traceability gap. Static review did not establish another sk-doc structural violation. The sk-doc quality-control extractor was not run, so no DQI score or validation result is claimed. [SOURCE: .skilled/skills/sk-code/sk-code-skilled/assets/checklists/universal-checklist.md:101-108] [SOURCE: .skilled/skills/sk-doc/SKILL.md:153-154]

## 14. Workflow and State Integrity

The append gateway accepted ledger events for Iterations 2–5 but refused to project them because projection would drop keys from the existing config row. Those iteration events produced six refusals: three attempts for Iteration 2 and one each for Iterations 3–5. The terminal synthesis event was accepted at ledger sequences 7–9; all three projections were refused by the same guard, and retries stopped after the third failure. The canonical state JSONL therefore contains its config row and Iteration 1 only; it does not contain the terminal event. The iteration deltas remain the complete per-iteration finding record, and this synthesis document carries `stopReason: maxIterationsReached`. [SOURCE: specs/hooks/023-session-relaunch-loop/research/lineages/luna/gateway-refusals.jsonl:1-9] [SOURCE: specs/hooks/023-session-relaunch-loop/research/lineages/luna/deep-research-state.jsonl:1-2] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/shadow-projection-store.ts:204-233]

There is a second contract mismatch: the dispatcher requires `findingsCount` on each canonical state row, while the deep-research delta projection contract and legacy upcaster omit that field. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:78-83] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:386-396]

**Fix for the workflow owner:** Make projection preserve the existing config-row key set and reconcile `findingsCount` across the dispatcher, delta and projection contracts. Keep state writes on the append gateway; a direct state-log edit would bypass its append-only contract. This lineage records the conflict rather than changing files outside its authorized directory.

## 15. Confidence and Evidence Classification

The repository record mismatch, test inventory omission and source-level consume edges are confirmed by the cited records and control flow. The handoff privacy gap is confirmed as a code/documentation mismatch; its outside-symlink and chmod-failure runtime behavior still needs tests. Adapter policy duplication is an architectural inference, not evidence of a current output mismatch. No claim here is based on executed runtime behavior.

## 16. Limitations

This was a static review. No tests, strict validators, resource-map emitters, spec writeback or document-quality extractors ran. Spec writeback, validation and resource-map workflow commands target paths outside this lineage; they were excluded by the dispatcher's write boundary. The reducer ran with the explicit lineage artifact directory and reported one completed state iteration, zero corruption, and no resource map. The canonical state projection conflict prevented it from reflecting the later deltas in the state log and strategy.

## 17. Synthesis Record

- Lineage: `luna`; session: `fanout-luna-1792429886029-no7lpl`.
- Iteration artifacts: 5 narratives and 5 delta files; finding counts by iteration: 2, 2, 2, 1, 1 (8 total; 6 consolidated session-relaunch conclusions).
- `stopReason`: `maxIterationsReached`.
- Strategy status at synthesis: 0 of 5 questions persisted as answered; the five iteration narratives discuss all five questions.
- Canonical state projection: only Iteration 1 is present; Iterations 2–5 and all three terminal event attempts have ledger receipts but were refused during projection.
- Runtime tests and document extractors: not run.

## Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5 narrative/delta pairs; 1 iteration row in the canonical state projection
- Questions answered: 0 / 5 persisted in strategy; all five questions received narrative-level answers
- Remaining questions: 5 in strategy metadata; runtime filesystem and consume-path behavior, other active worktree references, adapter ownership boundary and document-quality extraction remain open
- Last 3 iteration summaries: Iteration 3 wrapper transitions (0.65); Iteration 4 test traceability and standards (0.54); Iteration 5 privacy and phase 008 evidence (0.38)
- Convergence threshold: 0.1; convergence before the configured cap was telemetry only
- Divergence summary: no pivots recorded

The terminal synthesis event is present in the ledger at sequences 7–9, and the synthesis document reports `maxIterationsReached` as required. The state projection and canonical answered-question count remain inconsistent with the five on-disk iteration artifacts because the append gateway rejected their projection.
