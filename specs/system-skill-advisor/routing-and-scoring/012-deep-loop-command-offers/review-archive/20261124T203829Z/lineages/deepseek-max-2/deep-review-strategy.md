---
title: "Deep Review Strategy - 012-deep-loop-command-offers (lineage deepseek-max-2)"
description: "Runtime strategy file for the deepseek-max-2 fan-out lineage of the generation 8 traceability review of packet 012."
trigger_phrases:
  - "deep review strategy 012 deepseek-max-2"
importance_tier: normal
contextType: planning
version: 1.13.0.0
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

**Topic:** Review of `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder target), generation 8 traceability rerun.

**Operator review focus (config.reviewFocus):** Traceability: finish the `spec_code` and `checklist_evidence` protocols. Check every REQ in `spec.md` against the code that implements it or the decision that records it, and every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that really exists in the tree, including the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006).

## 2. TOPIC

The packet closes a build that changed the advisor's deep-loop command gate (`lib/command-attach.ts` and its Python fallback `scripts/skill_advisor.py`), the stage-one scorer lane (`lib/scorer/lanes/explicit.ts`), the two deep command documents with their presentation contracts, the corpus and its baseline, and the deep-review reducer (`runtime/scripts/reduce-state.cjs`). It carries 52 requirements across twelve fix rounds, 60 acceptance rows, nine decision records and 72 files in the declared review scope.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
- [ ] correctness
- [ ] security
- [ ] maintainability

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- No behaviour change is proposed; the review reports only. Every fix lands in a later round.
- The advisor vitest suite and the Python suite are not run: the lineage write surface is the lineage directory, and running the repo's gates is outside it.
- Behaviour re-measurement of the 69 probes and the 247-row routing corpus is not repeated. The probe and corpus evidence is read from the tree and the committed artefacts.

## 5. STOP CONDITIONS

- `config.stopPolicy` is `max-iterations`: convergence is telemetry only, and the loop stops at `maxIterations` = 7 with stop reason `maxIterationsReached`.
- `spec_code` and `checklist_evidence` must both reach a recorded status before synthesis (REQ-033 / AC-040 depends on it).

<!-- ANCHOR:completed-dimensions -->
## 6. COMPLETED DIMENSIONS
- [x] traceability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 7. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 4
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Looking each requirement's own prompts up in the shared fixture: 48 of 51 quoted strings resolved to a case, so a requirement's reach into the two gate copies is provable from one file (iterations 1, 2).
- Reading the compiler's slice markers instead of the compiled output: it turned an apparent stale build into a declared boundary (iteration 1).
- Recomputing every count a closure record states instead of reading it: that is what found the pair-count drift stated three ways and the one unsatisfiable scope claim (iterations 4, 6).
- Running the packet's own checker (`scratch/citations/evidence-tails.py`) rather than trusting the task text: `problems=0` over 60 rows (iteration 4).
- Byte-comparing the runtime mirrors instead of assuming packaging drift: only frontmatter and the path convention differed (iteration 7).

## 9. WHAT FAILED

- Treating the strategy's dimension checklist as narrative: pre-ticking two dimensions at init made the reducer report coverage no iteration had earned, and it had to be corrected before iteration 2 (iteration 1).
- Searching the acceptance table for requirement gaps: every REQ id is already covered, so the direction yielded nothing (iteration 1).
- Trying to close the feature-catalog drift inside this lineage: the page is outside the seeded scope, so the row had to be deferred and now stands as the run's only search debt (iteration 7).

<!-- ANCHOR:exhausted-approaches -->
## 10. EXHAUSTED APPROACHES (do not retry)
### **`MODE_CUES` and the hub router keying different modes.** Ruled out: both key `research` and `review`, and the test at `deep-loop-offer-cases.vitest.ts:743` asserts the four surfaces together. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **`MODE_CUES` and the hub router keying different modes.** Ruled out: both key `research` and `review`, and the test at `deep-loop-offer-cases.vitest.ts:743` asserts the four surfaces together.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A `Met` row resting on evidence that does not exist.** Ruled out: 60 of 60 tails resolve, and the anchors named by the first 29 rows exist as files, rows or lines. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A `Met` row resting on evidence that does not exist.** Ruled out: 60 of 60 tails resolve, and the anchors named by the first 29 rows exist as files, rows or lines.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A checklist count that contradicts its own boxes.** Ruled out: the Verification Summary recomputes to the same figures. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A checklist count that contradicts its own boxes.** Ruled out: the Verification Summary recomputes to the same figures.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A citation tail that lands on the wrong line.** Ruled out: the independent checker reports `problems=0` over all 60 rows. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A citation tail that lands on the wrong line.** Ruled out: the independent checker reports `problems=0` over all 60 rows.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A corpus-count drift in the ticked tasks.** Ruled out: the baseline still reads `false_offer` 0/57 and `false_offer_attached` 1/57, which is what the tasks quote. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A corpus-count drift in the ticked tasks.** Ruled out: the baseline still reads `false_offer` 0/57 and `false_offer_attached` 1/57, which is what the tasks quote.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A degraded row keeping a withheld command.** Ruled out by reading the withhold branch, which strips `command`, `policy`, `ownerSkillId` and `typed`. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **A degraded row keeping a withheld command.** Ruled out by reading the withhold branch, which strips `command`, `policy`, `ownerSkillId` and `typed`.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A drift-guard list with no Python counterpart.** Ruled out: `SMALL_EDIT_WORDING` is the one deliberate exception and has no Python copy, and the two command lead lists it was excused for are compared. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **A drift-guard list with no Python counterpart.** Ruled out: `SMALL_EDIT_WORDING` is the one deliberate exception and has no Python copy, and the two command lead lists it was excused for are compared.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A fixture count in the sixth-round rows that has moved.** Ruled out: the refusal, doctor, typed, no-edit and effort counts all recompute to the stated figures. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **A fixture count in the sixth-round rows that has moved.** Ruled out: the refusal, doctor, typed, no-edit and effort counts all recompute to the stated figures.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A gate pattern the drift guard neither compares nor lists.** Ruled out: the coverage test recomputes the 43 `re.compile` assignments in the fallback's gate slice and requires the accounted set to equal it. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **A gate pattern the drift guard neither compares nor lists.** Ruled out: the coverage test recomputes the 43 `re.compile` assignments in the fallback's gate slice and requires the accounted set to equal it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A mirror that has drifted in substance.** Ruled out: `.opencode` is identical and `.claude` differs only in frontmatter and the path convention its runtime requires. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A mirror that has drifted in substance.** Ruled out: `.opencode` is identical and `.claude` differs only in frontmatter and the path convention its runtime requires.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A missing declared change-set file.** Ruled out: all 26 paths in the three change-set tables resolve to existing files. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **A missing declared change-set file.** Ruled out: all 26 paths in the three change-set tables resolve to existing files.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A playbook precondition that the build invalidated.** Ruled out: NC-012's no-edit gate is a writing-workflow gate, which REQ-040 left unchanged. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A playbook precondition that the build invalidated.** Ruled out: NC-012's no-edit gate is a writing-workflow gate, which REQ-040 left unchanged.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A read-only loop lost to a no-edit clause.** Ruled out: the guard at `command-attach.ts:1620` exempts the read-only modes, and the three `no-edit-*` rows carry their mode. -- RULED OUT (iteration 3, 1 attempt)
- What was tried: **A read-only loop lost to a no-edit clause.** Ruled out: the guard at `command-attach.ts:1620` exempts the read-only modes, and the three `no-edit-*` rows carry their mode.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A refinement folding across files.** Ruled out by reading `refinesSameLocation` and the unit test that names it. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **A refinement folding across files.** Ruled out by reading `refinesSameLocation` and the unit test that names it.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A REQ-015 to REQ-034 prompt missing from the shared fixture.** Ruled out: 48 of 51 quoted strings resolve to a case prompt, and the three that do not are a repeated unit, a describe name and a quoted line, none of which is a prompt. -- RULED OUT (iteration 2, 1 attempt)
- What was tried: **A REQ-015 to REQ-034 prompt missing from the shared fixture.** Ruled out: 48 of 51 quoted strings resolve to a case prompt, and the three that do not are a repeated unit, a describe name and a quoted line, none of which is a prompt.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A requirement in REQ-001 to REQ-014 with no acceptance row.** Ruled out: all 52 requirement ids appear in the acceptance table, and every acceptance row names at least one requirement id. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **A requirement in REQ-001 to REQ-014 with no acceptance row.** Ruled out: all 52 requirement ids appear in the acceptance table, and every acceptance row names at least one requirement id.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A served-head test that pins the gate layer only.** Ruled out: `tests/typed-on-stuck-serving.vitest.ts:112` goes through the real `advisor_recommend` head, and the fixture column is read on both sides. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **A served-head test that pins the gate layer only.** Ruled out: `tests/typed-on-stuck-serving.vitest.ts:112` goes through the real `advisor_recommend` head, and the fixture column is read on both sides.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A skill contract that contradicts the agent definition it dispatches.** Ruled out by reading the final-line contract, the status enum and the LEAF boundary in both. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **A skill contract that contradicts the agent definition it dispatches.** Ruled out by reading the final-line contract, the status enum and the LEAF boundary in both.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A ticked task whose named test or fixture row is absent.** Ruled out: every test title and fixture row id quoted by T059 to T111 resolves in the tree. -- RULED OUT (iteration 4, 1 attempt)
- What was tried: **A ticked task whose named test or fixture row is absent.** Ruled out: every test title and fixture row id quoted by T059 to T111 resolves in the tree.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **A waiver without a decision record.** Ruled out: AC-008/ADR-003, AC-017/ADR-002, AC-019/ADR-001 and AC-020/ADR-009 all pair correctly. -- RULED OUT (iteration 5, 1 attempt)
- What was tried: **A waiver without a decision record.** Ruled out: AC-008/ADR-003, AC-017/ADR-002, AC-019/ADR-001 and AC-020/ADR-009 all pair correctly.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **ADR-005 or ADR-006 stating a decision the code does not implement.** Ruled out by reading both the ADRs and the branches they name. -- RULED OUT (iteration 6, 1 attempt)
- What was tried: **ADR-005 or ADR-006 stating a decision the code does not implement.** Ruled out by reading both the ADRs and the branches they name.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **An active P0 or P1 at the run's last iteration.** Ruled out: four P2 findings, no P0 or P1, across seven iterations. -- RULED OUT (iteration 7, 1 attempt)
- What was tried: **An active P0 or P1 at the run's last iteration.** Ruled out: four P2 findings, no P0 or P1, across seven iterations.
- Why ruled out: One pass of evidence did not support this direction.
- Reopen when: a later iteration carries evidence that contradicts that pass.

### **Compiled contracts stale against the edited presentations.** Ruled out: the compiler's slice markers (`compile-command-contracts.cjs:76-78`, `:177-179`) start after the offer section by design, `extractBetween` throws on a missing marker (`:291-296`), and both compiled files carry the setup H3s the slice contains. The offer's absence from the compiled surface is a slice property, not drift. -- RULED OUT (iteration 1, 1 attempt)
- What was tried: **Compiled contracts stale against the edited presentations.** Ruled out: the compiler's slice markers (`compile-command-contracts.cjs:76-78`, `:177-179`) start after the offer section by design, `extractBetween` throws on a missing marker (`:291-296`), and both compiled files carry the setup H3s the slice contains. The offer's absence from the compiled surface is a slice property, not drift.
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

- Compiled contracts stale against the edited presentations: the compiler slice opens at `:auto Setup Resolution`, above which the offer section sits, and a missing marker throws (iteration 1, evidence: `compile-command-contracts.cjs:76-78,291-296`).
- A requirement with no acceptance row: all 52 REQ ids appear in the acceptance table (iteration 1).
- A declared change-set file missing from the tree: all 26 paths resolve (iteration 1).
- A REQ-015 to REQ-034 prompt missing from the shared fixture: 48 of 51 quoted strings resolve, the other three are not prompts (iteration 2).
- A drift-guard list with no Python counterpart: `SMALL_EDIT_WORDING` is the deliberate exception (iteration 2).
- A refinement folding across files: `refinesSameLocation` returns false on a different file or dimension (iteration 2).
- A gate pattern neither compared nor listed: 43 compiled patterns, 43 accounted for (iteration 3).
- `MODE_CUES` and the hub router keying different modes: both key `research` and `review` (iteration 3).
- A degraded row keeping a withheld command: the branch strips four fields (iteration 3).
- A `Met` row resting on evidence that does not exist: 60 of 60 tails resolve (iteration 5).
- A waiver without a decision record: four waivers, four ADRs (iteration 5).
- A sixth-round fixture count that moved: every count recomputes (iteration 6).
- An ADR stating a behaviour the tree does not implement: ADR-005 and ADR-006 both hold (iteration 6).
- A runtime mirror drifted in substance: frontmatter and path convention only (iteration 7).
- A playbook precondition the build invalidated: NC-012 gates a writing workflow (iteration 7).

<!-- ANCHOR:next-focus -->
## 12. NEXT FOCUS
- Dimension: none. The run stopped at its iteration cap (7 of 7) with stop reason `maxIterationsReached`.
- Focus area: a follow-up run. Correct the four P2 closure-record drifts in one docs pass, and bind a review to the feature-catalog page so the deferred search-debt row `SL-019` can close.
- Reason: search debt is the only reason the verdict is CONDITIONAL; the doctrine's next step is another `/deep:review` over the deferred surface, not a remediation plan.
- Rotation status: closed for this lineage. `correctness`, `security` and `maintainability` were not re-reviewed here and need their own iterations.
- Blocked / productive carry-forward: productive, with the coverage gap carried forward as a named limit.
- Required evidence: the four finding ids, both core protocol statuses, and the coverage state in `deep-review-findings-registry.json`.

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- **Target pointers:** `spec.md` (52 REQ rows), `tasks.md` (T001 to T111, CHK-001 to CHK-051), `acceptance-criteria.md` (AC-001 to AC-060), `decision-record.md` (ADR-001 to ADR-009), `implementation-summary.md`, `timeline.md`.
- **Behavior claims to verify:** every REQ names the gate copy, scorer lane, reducer function, test title or fixture row that implements it; every `Met` acceptance row names evidence the tree holds.
- **Reuse and conventions:** the shared fixture `tests/fixtures/deep-loop-offer-cases.json` (359 cases) is read by both the TypeScript and the Python suite, so a case is pinned in both copies or in neither.
- **Review risks and gaps:** the advisor suite and the Python suite cannot be run from this lineage, so "the suite passes" claims rest on the recorded evidence rows, not on a fresh run. Probe and corpus evidence in `scratch/` is read, not re-measured.
- **Scope:** 72 files are pre-bound in `review-scope-files.txt`; `runtime/dist/` is generated output and is not a review target.

## 14. CROSS-REFERENCE STATUS

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1-3 | 52 of 52 requirement rows bound to a symbol, fixture row, test title or document line |
| `checklist_evidence` | core | pass | 4-6 | 111 ticked tasks and 42 acceptance rows read with counts recomputed; four P2 docs-drift records |
| `skill_agent` | overlay | pass | 7 | the deep-review skill contract and its agent definition agree |
| `agent_cross_runtime` | overlay | pass | 7 | opencode mirror identical; claude mirror differs only in runtime frontmatter and path convention |
| `feature_catalog_code` | overlay | partial | 7 | the catalog's no-edit sentence predates the read-only loop exception; deferred as an out-of-scope surface (search debt `SL-019`) |
| `playbook_capability` | overlay | pass | 7 | NC-012 gates a writing workflow, which the build did not change |

## 15. FILES UNDER REVIEW

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| spec.md (52 REQ rows) | traceability | 6 | 0 | complete |
| tasks.md (111 tasks, 51 CHK) | traceability | 4 | 2 P2 | complete |
| acceptance-criteria.md (60 rows) | traceability | 6 | 1 P2 | complete |
| decision-record.md (9 ADRs) | traceability | 6 | 0 | complete |
| timeline.md | traceability | 2 | 1 P2 | complete |
| implementation-summary.md | traceability | 6 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts | traceability | 6 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py | traceability | 3 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts | traceability | 3 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts | traceability | 3 | 0 | complete |
| .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs | traceability | 3 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json | traceability | 6 | 0 | complete |
| .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts | traceability | 6 | 1 P2 | complete |
| .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ (corpus and baseline) | traceability | 5 | 0 | complete |
| .skilled/commands/deep/ (commands, presentations, YAML, compiled) | traceability | 1 | 0 | complete |
| .skilled/skills/system-deep-loop/deep-review/SKILL.md and .skilled/agents/deep-review.md (+ mirrors) | traceability | 7 | 0 | complete |

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10 (telemetry only under `stopPolicy: max-iterations`)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-deepseek-max-2-1795550334883-gjbarh, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-24T20:01:19Z
<!-- MACHINE-OWNED: END -->
