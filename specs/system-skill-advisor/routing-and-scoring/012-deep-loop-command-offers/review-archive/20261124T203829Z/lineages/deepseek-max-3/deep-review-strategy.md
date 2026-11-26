---
title: Deep Review Strategy - 012-deep-loop-command-offers (lineage deepseek-max-3)
description: Session tracking for the traceability-focused deep review lineage of the deep-loop command offers packet.
trigger_phrases:
  - "deep review strategy 012 lineage 3"
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 1. REVIEW CHARTER

- **Target**: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 3, generation 8)
- **Dimensions**: correctness, security, traceability, maintainability (all four; traceability carries the core protocols `spec_code` and `checklist_evidence`)
- **Operator focus**: traceability. Finish `spec_code` and `checklist_evidence`; check every REQ in `spec.md` against the code that implements it or the decision that records it, every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (REQ-023..REQ-034, AC-030..AC-042, ADR-005, ADR-006).
- **Stop policy**: `max-iterations`, cap 7. Convergence is telemetry only; this lineage broadens review angles rather than synthesizing early.
- **Success criteria**: zero P0; every REQ and every `Met`/ticked row either cites evidence that resolves in the tree or is reported as drift.

---

## 2. TOPIC

Review of the deep-loop command-offer packet: the advisor surfaces `/deep:research` and `/deep:review` in its brief, render and CLI paths, with the stop-and-ask gates, head-length limits and degraded-transport fallback that the packet's REQ/AC set claims.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not assessing the routing accuracy of the scorer beyond the deep-loop offer surface named in the REQs.
- Not re-running the packet's own gates (`validate.sh`, vitest) — this lineage reads tree evidence and cites it; it does not mutate the target.
- Not judging prose style of the spec docs beyond whether a claim resolves.

---

## 5. STOP CONDITIONS

- `maxIterations` (7) reached, per `config.stopPolicy: max-iterations`.
- Not converging early: with 7 bound iterations the loop treats convergence as telemetry and rotates dimension/focus instead.

**Outcome.** The cap was reached (7 of 7) with stop reason `maxIterationsReached`. All four dimensions are covered, both core protocols and three overlay protocols read `pass`, two overlays read `notApplicable`, and no active P0 or P1 remains. Four P2 advisories stay open and are grouped into three remediation workstreams in `review-report.md`. `releaseReadinessState` is `in-progress`, not `converged`, because a cap stop is not a convergence stop and because AC-040 is the cross-lineage merge's call.

---

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Resolving each cited `file:line` anchor from an AC evidence cell by direct read: cheap, and it found a row whose count clause no longer matches the tree (iteration 1).
- Reading the symbol names a REQ quotes (`withholdDeepLoopDoctorWithoutRun`, `_loop_ask_cues`, `typedCommandForTop`) and then following their call sites: it separates a requirement that is implemented from one whose named surface has quietly moved (iteration 1).
- Reading a security claim against the primitive rather than the prose: `spawn` with an argv array settles "no shell" in one read, and the tracked-table lookup settles "no free-text command" (iteration 2).
- Grepping a claim's own vocabulary across the packet docs (`vocabulary pairs`) to see whether a stale count is one cell or a class (iteration 2).
- Resolving the whole acceptance matrix in one scripted pass (existence plus line range) before reading any cell: it turns 60 rows into a short list worth reading rather than 119 individual lookups (iteration 3).
- Reading a REQ's own named file surfaces (`review.md` step 0, the two presentations' step 6, both YAML `next_steps`) rather than the AC row that restates them, which is how the completion-message nuance surfaced (iteration 3).
- Verifying a generated artifact by its own recorded digests instead of diffing it by eye: 31 of 31 matched, so REQ-007 needed one computation rather than a read (iteration 5).
- Reading each reducer seam at its function comment, which is where REQ-032, REQ-048 and REQ-052 put their rule (iteration 5).
- Using this run's own findings registry as the witness for a reducer requirement: REQ-032's same-file fold and different-file keep were both observed live, not only in its unit test (iteration 6).
- Reading the compiled-route enrichment as the clause it claims to satisfy, which settled REQ-046 in one read after the traceability passes had only checked its test's existence (iteration 6).
- Grouping the carried P2s by the surface a fix touches before writing the hand-off, which turned four findings into three advisory workstreams and one decision (iteration 7).

---

## 9. WHAT FAILED

- Counting a vocabulary array with an ad-hoc text probe: the row shape defeated two attempts, and the count only settled when the array's open and close brackets were read directly (iteration 1).
- Reading the pasted reply strip from one call site and assuming the others follow: `fusion.ts` strips inside its own entry point, so the parity check needed all four call sites, not two (iteration 2).
- Resolving packet-relative `scratch/` anchors from the repo root: the first bulk pass reported 24 anchors missing that all resolve once the packet prefix is applied (iteration 3).
- Extracting "paths" from a task line by regex: the first attempt picked up commands, flags and package-relative names and reported 212 false misses, so the pass had to be narrowed to repo-relative paths before it meant anything (iteration 4).
- Citing a function by a line number read from a `sed` window rather than from its own declaration line, which put `refinesSameLocation` three lines low until the declaration was checked (iteration 5).
- Hand-copying the route-proof string into an iteration record instead of reusing the exact constant: one token was lost, the gateway accepted it, and only a later self-check caught it. The repair is disclosed in iteration 6 and the report (iteration 5/6).

---

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### *`autonomous research` still reaching the advisor's derived lane through `deep-research/SKILL.md`.* `projection.ts:1449` reads top-level skill directories with `graph-metadata.json` and takes derived triggers from that metadata (`:1467`), so the nested packet's keyword list is not scored. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: *`autonomous research` still reaching the advisor's derived lane through `deep-research/SKILL.md`.* `projection.ts:1449` reads top-level skill directories with `graph-metadata.json` and takes derived triggers from that metadata (`:1467`), so the nested packet's keyword list is not scored.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A carried finding that a later edit already fixed.* All four re-read at their sites and still present. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: *A carried finding that a later edit already fixed.* All four re-read at their sites and still present.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A command offered twice by the compiled-route pass.* `alreadyOffered` is seeded from existing commands and grows as the pass keeps one. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: *A command offered twice by the compiled-route pass.* `alreadyOffered` is seeded from existing commands and grows as the pass keeps one.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A delta file that does not open with its iteration record.* All five open with one. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: *A delta file that does not open with its iteration record.* All five open with one.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A denial-of-service through an unbounded prefix scan or a nested quantifier.* Both directions are bounded, as recorded above. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: *A denial-of-service through an unbounded prefix scan or a nested quantifier.* Both directions are bounded, as recorded above.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A finding that would flip a `Met` row back to `Unmet`.* Each was checked against the row that owns its requirement, and each row's checkable behaviour is intact. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: *A finding that would flip a `Met` row back to `Unmet`.* Each was checked against the row that owns its requirement, and each row's checkable behaviour is intact.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A hidden P0 that a clean iteration merely failed to find.* The last two iterations looked at the two seams most likely to hide one — the enrichment pass and the reducer's live registry — and both held. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: *A hidden P0 that a clean iteration merely failed to find.* The last two iterations looked at the two seams most likely to hide one — the enrichment pass and the reducer's live registry — and both held.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A hub mode table that hardcodes a packet path the registry does not carry.* The table and the registry agree for both modes. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: *A hub mode table that hardcodes a packet path the registry does not carry.* The table and the registry agree for both modes.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A lineage whose iteration count is ambiguous to the loop.* Distinct-run counting gives five, which is the number of iterations actually run. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: *A lineage whose iteration count is ambiguous to the loop.* Distinct-run counting gives five, which is the number of iterations actually run.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A loop-name pattern that a doubled space or a non-breaking space defeats.* Both copies fold all whitespace before matching. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: *A loop-name pattern that a doubled space or a non-breaking space defeats.* Both copies fold all whitespace before matching.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A packet that quietly claims its coverage gate passed.* `T084`, `CHK-020`, AC-040 and the closure statement all say it has not, which is consistent. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: *A packet that quietly claims its coverage gate passed.* `T084`, `CHK-020`, AC-040 and the closure statement all say it has not, which is consistent.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A refused run ask inside the refusal machinery matching across a conjunction.* `RUN_ASK_REFUSAL_GAP` excludes `and|then|but|or` (`command-attach.ts:761`), which is the fixture's `refusal-verb-conjunction-*` reading. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: *A refused run ask inside the refusal machinery matching across a conjunction.* `RUN_ASK_REFUSAL_GAP` excludes `and|then|but|or` (`command-attach.ts:761`), which is the fixture's `refusal-verb-conjunction-*` reading.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A remediation that would need a code change to the gate.* Three of the four touch only prose or one import. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: *A remediation that would need a code change to the gate.* Three of the four touch only prose or one import.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A REQ with no owning acceptance row.* Every REQ-001..REQ-052 appears in the matrix's `REQ` column, several through more than one row. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: *A REQ with no owning acceptance row.* Every REQ-001..REQ-052 appears in the matrix's `REQ` column, several through more than one row.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A stale acceptance status.* The five non-`Met` rows each carry their record: three waivers name an ADR, the supersession names ADR-001, and the one `Unmet` row is explained in the closure statement. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: *A stale acceptance status.* The five non-`Met` rows each carry their record: three waivers name an ADR, the supersession names ADR-001, and the one `Unmet` row is explained in the closure statement.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A stale compiled contract, the classic generated-artifact failure.* All 31 recorded digests match the current sources. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: *A stale compiled contract, the classic generated-artifact failure.* All 31 recorded digests match the current sources.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A ticked box whose cited path does not exist.* All 33 repo-relative paths cited by a `[x]` box resolve. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: *A ticked box whose cited path does not exist.* All 33 repo-relative paths cited by a `[x]` box resolve.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A typed `/doctor:deep-loop` surviving a refusal it should not.* `DOCTOR_NAMING_LED` (`fusion.ts:1062`) reads a refusal or question lead directly before the name, and `doctorAsked` requires `!onlyMentioned` (`:1083`), so a refused naming is not served; a bare typed doctor on a stuck run is served, which is REQ-044's clause. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: *A typed `/doctor:deep-loop` surviving a refusal it should not.* `DOCTOR_NAMING_LED` (`fusion.ts:1062`) reads a refusal or question lead directly before the name, and `doctorAsked` requires `!onlyMentioned` (`:1083`), so a refused naming is not served; a bare typed doctor on a stuck run is served, which is REQ-044's clause.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A Verification Summary count that does not match its boxes.* The `P0` count matches exactly, and the single unverified item is the unticked `CHK-020`. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: *A Verification Summary count that does not match its boxes.* The `P0` count matches exactly, and the single unverified item is the unticked `CHK-020`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *A waiver named in a row but absent from `decision-record.md`.* ADR-001, ADR-002, ADR-003 and ADR-009 are all present. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: *A waiver named in a row but absent from `decision-record.md`.* ADR-001, ADR-002, ADR-003 and ADR-009 are all present.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *Arbitrary text reaching the rendered command from a prompt.* Every emitted `command` is a `TRACKED_COMMANDS` key, chosen by table lookup or by owner-checked derivation; a free-text field cannot become one. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: *Arbitrary text reaching the rendered command from a prompt.* Every emitted `command` is a `TRACKED_COMMANDS` key, chosen by table lookup or by owner-checked derivation; a free-text field cannot become one.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *Command injection through the Python child.* argv-form spawn with no shell, fixed argv shape, prompt over stdin. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: *Command injection through the Python child.* argv-form spawn with no shell, fixed argv shape, prompt over stdin.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *Doctor withheld on a stuck run that also carries no-edit wording.* The attach layer returns `undefined` for `isNoEditRequest(prompt)` (`command-attach.ts:1599`) and the fused layer strips a non-read-only row (`fusion.ts:1106`); the doctor row is `add-only`, so both layers withhold it. No divergence. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: *Doctor withheld on a stuck run that also carries no-edit wording.* The attach layer returns `undefined` for `isNoEditRequest(prompt)` (`command-attach.ts:1599`) and the fused layer strips a non-read-only row (`fusion.ts:1106`); the doctor row is `add-only`, so both layers withhold it. No divergence.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *The native path treating a pasted reply as typed where the degraded path does not.* Both strip it (`advisor-recommend.ts:544`, `skill-advisor-cli.ts:1511`, `subprocess.ts:251`). -- RULED OUT (iteration 2, 1 attempt)
- What was tried: *The native path treating a pasted reply as typed where the degraded path does not.* Both strip it (`advisor-recommend.ts:544`, `skill-advisor-cli.ts:1511`, `subprocess.ts:251`).
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### *Two candidate seams that would have made a fourth finding.* `replaceAnchorSection`'s ordinal rule and `stripReviewVerdict`'s cut both do what their requirements say, so nothing was filed against them. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: *Two candidate seams that would have made a fourth finding.* `replaceAnchorSection`'s ordinal rule and `stripReviewVerdict`'s cut both do what their requirements say, so nothing was filed against them.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

Three directions were investigated and eliminated this iteration; section 10 keeps their what-was-tried detail.

- Doctor withheld on a stuck run that also carries no-edit wording: both layers withhold it (`command-attach.ts:1599`, `fusion.ts:1106`, `command-attach.ts:79`) (iteration 1).
- A typed `/doctor:deep-loop` surviving a refusal lead: `DOCTOR_NAMING_LED` and `!onlyMentioned` keep a refused naming out, while a bare typed doctor on a stuck run is REQ-044's request (`fusion.ts:1062`, `fusion.ts:1083`) (iteration 1).
- A refusal gap matching across a conjunction: `RUN_ASK_REFUSAL_GAP` excludes `and|then|but|or` (`command-attach.ts:761`) (iteration 1).
- Arbitrary prompt text reaching the rendered command: every emitted command is a `TRACKED_COMMANDS` key chosen by table lookup or owner-checked derivation (`skill-advisor-cli.ts:1489`, `:1570`, `:1573`) (iteration 2).
- The pasted-reply strip applied on one path only: all of `advisor-recommend.ts:544`, `skill-advisor-cli.ts:1511` and `subprocess.ts:251` strip (iteration 2).
- Command injection through the Python child: argv-form `spawn` with no shell, fixed argv shape, prompt over stdin (`subprocess.ts:283`, `:414`) (iteration 2).
- ReDoS through the gate grammars: every quantified group is bounded in `LOOP_REQUEST` and the refusal patterns (`command-attach.ts:761`, `:983`, `:997`) (iteration 2).
- A REQ with no owning acceptance row: every REQ-001..REQ-052 appears in the matrix `REQ` column (iteration 3).
- A doubled or non-breaking space defeating a loop-name pattern: both copies fold all whitespace before matching (`command-attach.ts:883`, `skill_advisor.py:5109`) (iteration 3).
- `autonomous research` reaching the advisor's derived lane through the nested packet's keyword list: `projection.ts:1449` reads top-level skill directories with `graph-metadata.json` only (iteration 3).
- A stale compiled command contract: all 31 recorded `sourceDigests` match the current source bytes in both contracts (iteration 5).
- A hub mode table that hardcodes a packet path the registry does not carry: `SKILL.md:30`-`:31` and `mode-registry.json` agree for `research` and `review` (iteration 5).
- `replaceAnchorSection` losing a strategy file's own section numbers: it keeps the ordinal the file gave the section (iteration 5).

---

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Dimension: none remaining — the iteration cap (7) is reached.
- Focus area: synthesis. Compile the report, run the adversarial self-check over the four P2 findings, derive the verdict from the registry, and record the terminal gates.
- Reason: `stopPolicy: max-iterations`, iteration 7 of 7.
- Rotation status: complete; every configured dimension has at least one full iteration, and `correctness` and `traceability` have two each.
- Blocked/productive carry-forward: nothing blocked.
- Required evidence: `deep-review-findings-registry.json`, the six protocol statuses above, and the seven iteration narratives.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers**: 47 pre-bound scope files (see `review-scope-files.txt`); the packet's six canonical docs plus the advisor runtime, the deep-loop command/review docs, and the associated vitest/JSON fixtures.
- **Behavior claims**: `spec.md` REQ-001..REQ-034, `acceptance-criteria.md` AC-001..AC-042 (sixth fix round AC-030..AC-042), `decision-record.md` ADR-001..ADR-006.
- **Reuse and conventions**: advisor brief rendering via `command-attach.ts` / `render.ts`; typed-command fields on the recommend response; the `free`/`ask`/`run`/`start` typed-command vocabulary used by the deep-loop offer.
- **Review risks and gaps**: `resource-map.md` absent (coverage gate skipped); the packet was restarted eight generations deep, so prose may describe work an archived round superseded. Implementation evidence outranks stale prose.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 (re-read in 5, 6, 7) | All 52 REQs resolve to code, a decision, or the artifact that records the measurement; REQ-007's generated contracts verified by hash, 31 of 31 |
| `checklist_evidence` | core | pass | 4 (re-read in 7) | 119 of 119 acceptance anchors resolve; all 60 cells read; 138 task boxes checked with 33 repo paths present; Verification Summary reproduces from its boxes |
| `skill_agent` | overlay | pass | 5 | Hub `SKILL.md` mode table matches `mode-registry.json`; the hub names its projection drift guard |
| `agent_cross_runtime` | overlay | notApplicable | 5 | No agent definition among the 47 scope files |
| `feature_catalog_code` | overlay | notApplicable | 5 | No feature-catalog document mentions the deep-loop offer |
| `playbook_capability` | overlay | pass | 5 | Manual-testing playbook carries `mode-routing/review-routing.md` naming `/deep:review`; preconditions not read line by line |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| [pending first iteration] | - | - | - | - |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-3-1795550334883-gjbarh, parentSessionId=2026-11-24T19:58:39.000Z, generation=8, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T19:58:39.000Z
<!-- MACHINE-OWNED: END -->
