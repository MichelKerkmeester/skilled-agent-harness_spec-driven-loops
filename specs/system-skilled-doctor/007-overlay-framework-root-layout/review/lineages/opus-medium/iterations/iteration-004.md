# Iteration 004 - Frontier node F-1-007: traceability

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-007 (remediation records traceable to code and test runs), dimension traceability (this node's question is a traceability question, so its first pass takes that dimension)
- Review focus addressed: checked the phase 006, 007 and 008 records and the ai-speckit record against the code and against rerun tests, re-verified prior R4-P2-001 and R6-P2-001, and checked the push and blocked-merge completion claims against git.
- Sources: steer.md absent; strategy; frontier block F-1-007.

## Files Reviewed

- `specs/system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation/implementation-summary.md` verification and limitations
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/implementation-summary.md:60-134`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:36-81`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:1-123`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/acceptance-criteria.md:66-67`, `specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:144-145`
- `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/spec.md:109-111` against `grep -n "adoptSource(" overlay-engine.cjs` at HEAD and at f2a608297c9
- Reruns: `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` -> tests 262, pass 262, fail 0, exit 0; `node --test overlays/root/opencode/scripts/git-hooks/tests/pre-commit.test.cjs` in ai-speckit -> 6 of 6, exit 0
- Git: `merge-base --is-ancestor b5a630c6efa origin/main` exit 0; `git log -- 008-push-and-repin` (b4799f7d547, 3101c9ed363, 28aa6f9f83d); in ai-speckit `git branch -r --contains 5dd004f3faa` prints nothing

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Phase 008's summary says its folder is uncommitted, in the commit that commits it** -- specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:115 -- Known Limitation 3 reads "This folder is uncommitted ... a Skilled session commits these files", and the continuity block's next_safe_action is "Commit this folder in a Skilled session" (`specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:14`). Both lines are in HEAD as committed by b4799f7d547 ("close the Barter re-pin onto the pushed Skilled fixes"), which committed the folder. A resume reads the next safe action and tries to commit work that is already committed.
   - Finding class: stale-status-claim
   - Scope proof: `git show HEAD:...008-push-and-repin/implementation-summary.md | grep uncommitted` prints line 115; git log shows the folder in three commits.
   - Affected surface hints: 008 implementation-summary.md limitations and _memory.continuity; graph-metadata.json derived from it.
   - Case: /speckit:resume on 008 reads next_safe_action "Commit this folder" although git status shows nothing to commit there.

2. **Phase 007's summary says the ai-speckit fix reaches origin with phase 008, but phase 008 pushed nothing in ai-speckit** -- specs/system-skilled-doctor/007-overlay-framework-root-layout/007-barter-review-fixes/implementation-summary.md:91 -- The How It Was Delivered line says the commit "reaches origin with phase 008's re-pin session". Phase 008 records "Nothing in ai-speckit is pushed. Its two commits are local, and the push is the operator's" (`specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/implementation-summary.md:114`), and `git branch -r --contains 5dd004f3faa` in ai-speckit prints no branch. The two phase records disagree on whether the Barter fix is published.
   - Finding class: contradicting-records
   - Scope proof: the only push forecast in 007; 008's tasks T007 also say "Neither is pushed" (`specs/system-skilled-doctor/007-overlay-framework-root-layout/008-push-and-repin/tasks.md:54`).
   - Affected surface hints: 007 implementation-summary.md delivery paragraph.
   - Case: a reader of 007 alone concludes the Barter commit gate fix is on ai-speckit's remote; a fresh clone of ai-speckit still has the fail-open gate.

## Prior-Finding Verification

- R6-P2-001 (002 spec adoptSource pointers stale, caller count wrong): FIXED. `specs/system-skilled-doctor/007-overlay-framework-root-layout/002-engine-framework-root-source-layout/spec.md:109` names eight call sites at :3454, :5628, :5632, :5709, :5721, :5724, :5730, :5737, which match grep at HEAD and at f2a608297c9 line for line.
- R4-P2-001 (005 AC rows Met while recording a deviation): FIXED at the closure rows. AC-008 and AC-009 Then clauses now name the baseline-equal bar they were judged on (`acceptance-criteria.md:66-67`). Residual: spec.md REQ-007 and REQ-008 (`specs/system-skilled-doctor/007-overlay-framework-root-layout/005-barter-move-overlays-out-of-tree/spec.md:144-145`) still state the original bars; 006's Known Limitation 4 records this openly, so it is not raised again.

## Traceability Checks

- checklist_evidence: partial. 006 test counts reproduced (262/262); 008 push verified (b5a630c6efa on origin/main); 007 and 008 disagree on publication (finding 2); 008 records a stale uncommitted state (finding 1).
- spec_code: pass for 002 spec pointers and 006's list of engine fixes against the code read in iterations 1-2.

## Integration Evidence

- Blocked merge: 008 tasks T002-T003 record the conflict set (four generated trigger-index files), the operator's decision, both merges and both rebuilds by id; `b5a630c6efa` is an ancestor of origin/main. Evidence is present for the push claim.
- Local main is now 1 ahead and 3 behind origin/main; that is later work, not a claim the records make.

## Edge Cases

- ai-speckit has uncommitted working-tree edits (vibe mirror rows in overlays/README.md and tests). This review covers the committed state at e63bd038a5d; the uncommitted hunks do not touch the lines cited in iteration 3.
- 007's Verification table says its numbers are quoted, not re-run; this iteration re-ran pre-commit.test.cjs and it matches.

## Confirmed-Clean Surfaces

- 006 verification table (engine suite count), 008 push and pin claims, 002 pointers.

## Ruled Out

- Push claimed without evidence: origin/main contains b5a630c6efa.
- Blocked merge left unrecorded: T002 names it and its resolution.

## Next Focus

- Dimension: security
- Focus area: frontier node F-1-001 (resolveOverlayDir outside-repository refusal, relayout path containment)
- Reason: all four nodes have had a first pass; F-1-001 holds the path-safety surface the review focus names
- Rotation status: F-1-001 correctness, F-1-003 correctness, F-1-005 correctness, F-1-007 traceability done
- Required evidence: overlay-engine.cjs resolveOverlayDir, containedOverlayPath, stagedUnownedChanges top-level probe

Review verdict: PASS
