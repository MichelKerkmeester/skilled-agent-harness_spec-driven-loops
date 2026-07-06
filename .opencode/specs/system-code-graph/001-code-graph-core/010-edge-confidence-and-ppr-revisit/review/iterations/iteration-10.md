# Dimension

Traceability: internal doc-to-doc consistency across this packet's own `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, and `implementation-summary.md`.

# Files Reviewed

- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/spec.md:1`
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/plan.md:1`
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/tasks.md:1`
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/checklist.md:1`
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/decision-record.md:1`
- `.opencode/specs/system-code-graph/001-code-graph-core/010-edge-confidence-and-ppr-revisit/implementation-summary.md:1`
- `.opencode/skills/sk-code-review/references/review_core.md:28`

# Findings by Severity

## P0

None.

## P1

### P1-007 [P1] Verification docs conflate "suite green" with a known failing baseline

- Claim: The same verification fact is stated two incompatible ways: acceptance language says the existing code-graph suite should be green/passing with the new flag off, while the completion evidence says the accepted result was a failing baseline of 6 failed files / 9 failed tests, later 5 failed files / 8 failed tests after the ADR-001 fix.
- Evidence: `spec.md:129` requires the existing code-graph test suite to pass with the flag off; `plan.md:61` says the suite should be green with the flag off; `tasks.md:62` records the actual accepted baseline as 6 failed test files / 9 failed tests with zero new regressions; `checklist.md:70` says "green" while also citing the same 6 failed / 9 failed baseline; `implementation-summary.md:101` records the same 6 failed / 9 failed baseline, and `implementation-summary.md:105` records a later 5 failed / 8 failed full-suite result.
- Counterevidence sought: The packet repeatedly frames the failed counts as pre-existing and says the invariant is zero new regressions, not absolute suite success. That supports the implementation result, but it does not reconcile the words "passes" and "green" in the acceptance surfaces.
- Alternative explanation: The authors may be using "green" colloquially to mean "no new failures relative to baseline." If so, the spec/plan/checklist should say that explicitly because the numeric evidence is not an actually green suite.
- Final severity: P1, because this is a must-fix gate/verification wording conflict in acceptance and completion docs, not just phrasing polish.
- Confidence: 0.91.
- Downgrade trigger: Downgrade to P2 if the packet updates every acceptance/checklist use of "passes" or "green" to a baseline-relative formulation such as "no new failures against the known failing baseline," preserving the cited failure counts.
- Finding class: matrix/evidence.
- Scope proof: Cross-checked every occurrence of this verification fact across `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md`; all numeric failing-baseline evidence agrees, but the pass/green wording does not.
- Affected surface hints: verification wording, acceptance criteria, checklist evidence, implementation summary.
- Content hash: `sha256:3fb3d8269bad4649f24fedf57400baf4a66fa9d43a0c8f4655210dbe667729b7`.

## P2

### P2-008 [P2] Spec references the benchmark record with a different relative path than the completion docs

- Claim: The original benchmark record path is stated differently across packet docs, and the `spec.md` variant points one directory too shallow.
- Evidence: `spec.md:22` and `spec.md:219` reference `../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md`; `tasks.md:74` and `implementation-summary.md:21` reference `../../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md`. Path existence check found the `../../007-dark-flag-graduation/.../benchmark-results.md` target exists and the `../007-dark-flag-graduation/.../benchmark-results.md` target does not.
- Counterevidence sought: A sibling `007-dark-flag-graduation` under `002-code-graph/` would make the spec path valid, but no such benchmark result path exists.
- Alternative explanation: The spec was drafted before the packet hierarchy was finalized and the later tasks/summary paths were corrected after sync.
- Final severity: P2, because it is a broken documentation cross-reference rather than a behavioral or release-gating issue.
- Confidence: 0.96.
- Downgrade trigger: Downgrade to no finding if the spec path is corrected to `../../007-dark-flag-graduation/005-codegraph-seeded-ppr/benchmark-results.md` or the missing target is intentionally created.
- Finding class: instance-only.
- Scope proof: Checked both relative path forms from the packet root; only the `../../` variant resolved.
- Affected surface hints: spec cross-references, benchmark provenance.
- Content hash: `sha256:398f97e5fe166244c8896228da2def50431b7673b1e04312d7b5741efc14ecde`.

### P2-009 [P2] ADR-001 near-miss attribution points to the wrong packet in several docs

- Claim: The ADR-001 near-miss is described as violating this packet's own ADR-001 in task/checklist/summary docs, but the packet's decision record says the relevant "second walker" ADR-001 lives in `../005-seeded-ppr-ranking/decision-record.md`; this packet's ADR-001 is about reusing the discarded resolution-quality signal.
- Evidence: `tasks.md:63` says the local reimplementation violated "this packet's own ADR-001" forbidding a second walker; `checklist.md:94` repeats that attribution; `implementation-summary.md:65` says this packet's own architecture decision record warned against the second walker. In contrast, `decision-record.md:34` names this packet's ADR-001 as "Reuse the discarded resolution-quality signal," `decision-record.md:62-64` describes the confidence-differentiation decision, and `decision-record.md:146` identifies the second-walker warning as ADR-001 in `../005-seeded-ppr-ranking/decision-record.md`.
- Counterevidence sought: A local ADR in this packet forbidding a second walker would reconcile the wording, but the current packet's ADR-001 text does not contain that decision.
- Alternative explanation: The docs use "this packet" loosely to refer to the broader seeded-PPR revisit chain rather than this exact folder.
- Final severity: P2, because the implementation history is still understandable, but future reviewers may chase the wrong ADR when validating the near-miss.
- Confidence: 0.88.
- Downgrade trigger: Downgrade to no finding if tasks/checklist/summary clarify that the violated ADR was `../005-seeded-ppr-ranking/decision-record.md` ADR-001, or if this packet adds an explicit local ADR cross-reference for the second-walker rule.
- Finding class: instance-only.
- Scope proof: Cross-checked every ADR-001 near-miss mention in the packet docs against the packet's own decision record.
- Affected surface hints: decision provenance, task evidence, checklist evidence, implementation summary.
- Content hash: `sha256:e0947ae0c9a1ec59f4067beeb91964acd597fd1fe589cfbdd5835e4bf40dc236`.

# Traceability Checks

- Commit hashes: Consistent. `657a0f6a3e` is the introduced commit and `277c35344c` is the deleted commit in `spec.md:84` and `plan.md:57`; recovery via `277c35344c^:<path>` is consistent in `spec.md:45`, `plan.md:77`, `decision-record.md:135`, and `implementation-summary.md:63`.
- Flag names: Consistent. `SPECKIT_CODE_GRAPH_EDGE_CONFIDENCE_DIFFERENTIATION` appears consistently in `spec.md:82`, `tasks.md:61`, `checklist.md:60`, `decision-record.md:64`, and `implementation-summary.md:59`. `SPECKIT_CODE_GRAPH_SEEDED_PPR_RANKING` appears consistently where the recovered PPR flag is named in `tasks.md:63` and `checklist.md:61`.
- Benchmark methodology: Consistent. The packet repeats the same 20 labeled queries, precision/recall/nDCG@3/5/8, and damping sweep 0.5-0.95 across `spec.md:114`, `checklist.md:82`, and `implementation-summary.md:69`.
- Benchmark outcome deltas: Consistent within rounding. `tasks.md:65` gives a summarized precision/recall/nDCG loss range; `implementation-summary.md:69` provides the more granular metric list without contradicting the task summary.
- Confidence values: Consistent. The differentiated confidence tiers `0.3/0.35/0.75/0.9` appear in `tasks.md:64`, `decision-record.md:64`, and `implementation-summary.md:59`/`implementation-summary.md:106` without numeric conflict.
- Completion-state drift: The existing P1-003 already covers the checklist/tasks/plan completion-state conflict, so I did not re-emit it. This pass strengthens that finding with adjacent continuity metadata drift: `spec.md:13-16` and `plan.md:12-22` still present early-session next actions and completion `0`, while `decision-record.md:13-21`, `checklist.md:13-21`, and `implementation-summary.md:15-26` present later completion states.

# Verdict

CONDITIONAL. This traceability pass found one new P1 verification-wording inconsistency and two P2 documentation traceability defects. No P0 findings.

# Next Dimension

Recommended next dimension: reducer merge/synthesis validation after the orchestrator incorporates batch deltas from iterations 8-11, with special attention to deduping this pass against existing P1-003 rather than treating adjacent completion metadata drift as a separate blocker.

Review verdict: CONDITIONAL
