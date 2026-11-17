---
title: Deep Review Strategy - advisor intent signals and ADR-001 pass fourteen
description: Runtime strategy for the data-14 lineage, tracking the six removed advisor intent signals, the one kept phrase, and ADR-001's decline of probes P05, P08 and P09.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - data-14

## 1. OVERVIEW

### Purpose

Persistent state for the `data-14` lineage of review pass fourteen. It records which dimensions remain, what was found, which approaches worked, and where the next iteration focuses.

### Usage

- **Init:** populated from the review brief, the scope file and the commit range.
- **Per iteration:** read Next Focus, review the named area, record findings, mark dimensions, and set the next focus.
- **Mutability:** updated in place by this lineage.

---

## 2. TOPIC

Review of the data area for command surfacing pass fourteen. The area covers `system-skill-advisor`'s `intent_signals` in `.skilled/skills/system-skill-advisor/graph-metadata.json`, where six phrases were removed and only "vibe prompt hook" remains from the seven pass thirteen appended, and ADR-001 in `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/040-final-alignment-loop/decision-record.md`, which now declines probes P05, P08 and P09 and fixes P07 with "vibe prompt hook" alone. The diff runs `932aff4e437..e626653ce79`.

The operator's question for this area is narrow: does any remaining intent signal pull an ordinary prompt to the advisor, and does ADR-001 stay consistent with the tree it describes.

---

## 3. REVIEW DIMENSIONS (remaining)
<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->

---

## 4. NON-GOALS

- Reviewing the mention area (`command-attach.ts` and its guard tests) assigned to `mention-14`; read-only context only.
- Re-reporting the recorded limits in `review-brief-14.txt` unless a new input breaks them.
- Re-reporting the open P2 list of `038-alignment-p1-remediation/scratch/alignment-final-dispositions.md` and of review passes ten to thirteen.
- Running the repository suite, the build, or any git write; this lineage reports only.
- Opening `command-prompts.jsonl`, `holdout-prompts.jsonl` or `behaviour-fresh-prompts.jsonl` except through the allowed aggregate path; the holdout rule stays in force.

---

## 5. STOP CONDITIONS

- Composite convergence stop at threshold 0.10 with all four dimensions covered.
- `maxIterations` 8 reached without a legal convergence stop.
- A blocking stop from `convergence.cjs` naming an uncovered dimension or an unresolved active P0.

---

## 6. COMPLETED DIMENSIONS
<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->

---

## 7. RUNNING FINDINGS
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 1
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->

---

## 8. WHAT WORKED

- Init: reading the scope file, both diffs, then the whole files at `e626653ce79` before choosing a focus. It separated the phrase delta (six removed, one kept) from the ADR delta (three probes declined).
- Iteration 1: scoring the ordinary prompts in-process with the committed projection, then dropping one signal at a time. The single-signal drop test separated a real signal match from a description or graph-edge effect and gave each P1 case a causal proof.
- Iteration 1: reproducing the pass-thirteen leak transcript first, then widening it. The reproduction showed the removed phrases are clean and the residual lives in older signals.
- Iteration 2: reading the cited leak transcript beside ADR-001. It showed the decision record's evidence is exactly the five prompts the removed phrases hit, which is why the residual went unrecorded.

---

## 9. WHAT FAILED

- Init: none.
- Iteration 1: none. The first attempt at `doctor-helper-match.cjs` put the prompt before `--` and was rejected; the documented `--` form worked.
- Iteration 3: recording `checklist_evidence` as `partial` left a hard gating failure in the registry, so the stop was blocked. The protocol is a run-level judgement; re-recording a partial status on a replay pass re-opens it.
- Iteration 4: closing the protocol raised the score to 1, but two zero-novelty passes had already tripped the stuck threshold, so the decision was `STUCK_RECOVERY` rather than `STOP`. The recovery event and a changed-granularity pass were needed before the stop.
- Iteration 5: none. The per-signal sweep confirmed the F001 boundary and found no new out-of-contract case.

---

## 10. EXHAUSTED APPROACHES (do not retry)
<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A broader leak than F001 among the remaining signals: the wider sweep produced only in-domain or ambiguous results beyond the four established cases. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A broader leak than F001 among the remaining signals: the wider sweep produced only in-domain or ambiguous results beyond the four established cases.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broader leak than F001 among the remaining signals: the wider sweep produced only in-domain or ambiguous results beyond the four established cases.

### A broken ADR-to-probe linkage: P05's helper ranking, P07's pass and the P08/P09 non-advisor outcomes all reproduce. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A broken ADR-to-probe linkage: P05's helper ranking, P07's pass and the P08/P09 non-advisor outcomes all reproduce.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A broken ADR-to-probe linkage: P05's helper ranking, P07's pass and the P08/P09 non-advisor outcomes all reproduce.

### A changed F001 or F002 case: both reproduce unchanged. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A changed F001 or F002 case: both reproduce unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A changed F001 or F002 case: both reproduce unchanged.

### A changed outcome since iteration 1: the F001 and pass-thirteen transcripts reproduce exactly. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A changed outcome since iteration 1: the F001 and pass-thirteen transcripts reproduce exactly.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A changed outcome since iteration 1: the F001 and pass-thirteen transcripts reproduce exactly.

### A holdout leak through the ADR's citation: the cited transcript holds five ordinary prompts and no corpus row. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A holdout leak through the ADR's citation: the cited transcript holds five ordinary prompts and no corpus row.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A holdout leak through the ADR's citation: the cited transcript holds five ordinary prompts and no corpus row.

### A new documentation or test-surface defect beyond F002: the ADR and test gap is unchanged from iteration 2. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: A new documentation or test-surface defect beyond F002: the ADR and test gap is unchanged from iteration 2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new documentation or test-surface defect beyond F002: the ADR and test gap is unchanged from iteration 2.

### A new gating failure introduced since iteration 3: the only blocker was the partial protocol status, and it is closed here with evidence. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: A new gating failure introduced since iteration 3: the only blocker was the partial protocol status, and it is closed here with evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A new gating failure introduced since iteration 3: the only blocker was the partial protocol status, and it is closed here with evidence.

### A regression caused by the pass-thirteen removal in the five prompts it tested: all five reproduce the pass-thirteen transcript. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A regression caused by the pass-thirteen removal in the five prompts it tested: all five reproduce the pass-thirteen transcript.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A regression caused by the pass-thirteen removal in the five prompts it tested: all five reproduce the pass-thirteen transcript.

### A secret or environment exposure in either scope file: both are plain author text and markdown, with no value that looks like a credential or host. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: A secret or environment exposure in either scope file: both are plain author text and markdown, with no value that looks like a credential or host.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A secret or environment exposure in either scope file: both are plain author text and markdown, with no value that looks like a credential or host.

### A stale SQLite projection still carrying the six removed phrases: the projection lists 33 canonical signals and none of the six. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: A stale SQLite projection still carrying the six removed phrases: the projection lists 33 canonical signals and none of the six.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A stale SQLite projection still carrying the six removed phrases: the projection lists 33 canonical signals and none of the six.

### A state disagreement between the registry and the iteration records: both list the same two open findings and four covered dimensions. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: A state disagreement between the registry and the iteration records: both list the same two open findings and four covered dimensions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A state disagreement between the registry and the iteration records: both list the same two open findings and four covered dimensions.

### An AC-004/ADR contradiction: both say P05, P08 and P09 are declined and P07 is fixed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: An AC-004/ADR contradiction: both say P05, P08 and P09 are declined and P07 is fixed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An AC-004/ADR contradiction: both say P05, P08 and P09 are declined and P07 is fixed.

<!-- /ANCHOR:exhausted-approaches -->

---

## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
<!-- ANCHOR:ruled-out -->
- A stale SQLite projection still carrying the six removed phrases: the projection lists 33 canonical signals and none of the six (iteration 1).
- A broken ADR-to-probe linkage: P05's helper ranking, P07's pass and the P08/P09 non-advisor outcomes all reproduce (iteration 1).
- A regression in the five prompts pass thirteen tested: all five reproduce the pass-thirteen transcript (iteration 1).
- A secret, injection or holdout surface in either scope file: plain author text and markdown, no metacharacter, no corpus reference (iteration 2).
- A broader leak than F001 among the remaining signals: the wider sweep produced only in-domain or ambiguous results beyond the four cases (iteration 5).
- A registry and iteration-record disagreement: both list two open findings and all four covered dimensions (iteration 5).
<!-- /ANCHOR:ruled-out -->

---

## 12. NEXT FOCUS
<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Session complete: stop reason `converged` at iteration 5, all four dimensions covered, `blockedBy` empty.
- Carry-forward: F001 (P1) and F002 (P2) remain open for the planning stage; no further review direction remains.
- Next action: `/speckit:plan` on the two remediation workstreams in `review-report.md`.
<!-- /ANCHOR:next-focus -->

---

## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/skills/system-skill-advisor/graph-metadata.json` (`intent_signals`, lines 66-100) and `040-final-alignment-loop/decision-record.md` (ADR-001, line 37). Context: `acceptance-criteria.md:59`, `tasks.md:49,58`, `scratch/probes.json`, `scratch/after-pass-13.txt`.
- Behavior claims: the seven pass-thirteen phrases leaked ordinary prompts, six were removed, "vibe prompt hook" alone keeps P07; P05, P08 and P09 are declined in ADR-001.
- Reuse and conventions: run the built native scorer in-process with `scoreAdvisorPrompt`; the SQLite projection is fresh and carries the 33 canonical signals (37 after phrase variants).
- Review risks and gaps: the pass-thirteen leak check covered five prompts; the broad sentence "no ordinary prompt tops the advisor" in `tasks.md:58` is wider than that test set.

---

## 14. CROSS-REFERENCE STATUS
<!-- ANCHOR:cross-reference -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 1 | ADR-001's P05/P07/P08/P09 outcomes match the tree and probe rows |
| `checklist_evidence` | core | partial | 1 | AC-004 agrees; T008's "no ordinary prompt" sentence is wider than its five-prompt check (F001) |
| `skill_agent` | overlay | pass | 3 | Author metadata and the committed projection carry the same 33 canonical signals |
| `agent_cross_runtime` | overlay | notApplicable | 1 | No agent file or runtime-specific surface in this area |
| `feature_catalog_code` | overlay | notApplicable | 2 | No feature catalog row changes in this area |
| `playbook_capability` | overlay | notApplicable | 2 | No manual-testing playbook source in this area |
<!-- /ANCHOR:cross-reference -->

---

## 15. FILES UNDER REVIEW
<!-- ANCHOR:files-under-review -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/graph-metadata.json` | correctness, traceability | 1 | 1 P1 | partial |
| `040-final-alignment-loop/decision-record.md` | correctness, traceability | 1 | 0 | partial |
<!-- /ANCHOR:files-under-review -->

---

## 16. REVIEW BOUNDARIES
<!-- ANCHOR:review-boundaries -->
- Max iterations: 8
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-data-14-1794868189353-tsxtos, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T23:29:00.000Z
<!-- /ANCHOR:review-boundaries -->
