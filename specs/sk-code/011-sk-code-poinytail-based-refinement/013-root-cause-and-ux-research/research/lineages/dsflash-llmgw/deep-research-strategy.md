---
title: "Deep Research Strategy — Root causes and external-user experience (dsflash-llmgw)"
trigger_phrases: []
---
# Deep Research Strategy — Root causes and external-user experience (dsflash-llmgw)

## 1. OVERVIEW

### Purpose

Name the producing mechanism behind every process error and open product issue of the sk-code Ponytail refinement epic, and rank the smallest fixes by their impact on a person who clones or installs this framework into their own repository.

## 2. TOPIC

Root causes, hardening and external-user experience for the sk-code Ponytail refinement epic (packet `specs/sk-code/011-sk-code-poinytail-based-refinement`, children 001 to 011). Research only: change no product file.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

- [x] Q1: What mechanism produced process error (a), where a helper's String.replace read a dollar-apostrophe sequence as a replacement pattern and pasted a tasks.md tail twice? (iteration 1)
- [x] Q2: What mechanisms produced process errors (b) to (e): the validator parsing link-shaped task text, the reviewer wildcard rm, the committed regenerated scratch tree and the claims made before verification? (mechanisms answered in iterations 1-2; the (b), (c) and (d) incidents themselves unrecorded)
- [x] Q3: Why did the generated artifacts — the trigger index, the Hermes agent copies, the compiled-route manifests and the leaf manifests — drift and need orchestrator re-mints? (iteration 2)
- [x] Q4: Why did a changelog version collision occur at merge when main and the branch both minted system-spec-kit v2.7.1.0? (iteration 2)
- [x] Q5: What are the root causes of the open test and canary issues: the jev-transport-single canary deferral, the compiled-route-admission LIVE_CORPUS_SIZE 80 pin against 86 scenarios, and the manifest test failures? (iteration 3)
- [x] Q6: Why does the advisor battery score 13 of 17 with false positives where a file path in the prompt pulls routing, and why does the advisor never pass --surface-hint? (iteration 4)
- [x] Q7: Why does .skilled/skills/sk-code/SKILL.md carry 36 HVR hard blockers, and what does the 500 ms hook stdin deadline against a 3 s hook budget risk? (iteration 5)
- [x] Q8: What did the reducer change that lowered open findings in 146 review folders, and what is the mechanism? (iteration 6)
- [x] Q9: What breaks or confuses an external user who clones or installs this framework: setup, generated artifacts, version numbering, hook timing, routing surprises, error messages and recovery from a half-applied state? (iterations 7-8)
- [ ] Q10: Which smallest fixes survive the prevent-overengineering rule and how do they rank as implementation phases by external-user impact against cost?
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Changing any product file, skill, hook or test. Implementation is a later phase.
- The post-merge review of the epic's commits, which a sibling review track owns.
- Re-running the whole epic; this run traces mechanisms in the tree as it now stands plus the packet's own records.

## 5. STOP CONDITIONS

- Run exactly ten evidence iterations, treating convergence as telemetry.
- Synthesize only after all ten iterations complete or an unrecoverable state/write failure.
- Every finding carries path:line evidence, a CONFIRMED (ran or read) or INFERRED mark, a P0/P1/P2 by external-user impact, and a smallest fix that passes `.skilled/repo-rules/prevent-overengineering.md`.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] Q1 answered in iteration 1: `$'` in T050's check text expanded as a JavaScript replacement pattern during the fix-unit insertion; the repo's replacer-function fix in `nested-changelog.ts` is the canonical pattern.
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading the packet's own goal logs first led straight to the recorded cause of (a), and the scratch `fix-chain.json` preserved the exact `$'` trigger.
- Grepping for the exact byte shape `](` found the in-packet specimen in `002/tasks.md:65`.
- Reading every round parent log and the per-child "Orchestrator steps" rows exposed the source/generated split as a design decision with a documented cost, and the merge body named the version collision directly.
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- Repo-wide and git-history searches did not locate a record of the (b) incident itself; the packet carries the class, not the event.
- The same search found no run record for the (c) deletion or the (d) committed regeneration either; only the guard rules and the regenerated artifacts survive.
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

- None yet.
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- None yet.
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Saturated: Part 1 process errors and generated-artifact drift (iterations 1-2); the test and canary cluster (iteration 3); the advisor cluster (iteration 4); blockers and deadlines (iteration 5); the reducer dedup (iteration 6)
- Pivot lineage: none yet
- Remaining frontier: the full external-user lens (setup, artifacts, recovery, error messages) and the final ranked phases
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- The (b) validator incident's run record (would be settled by that run's stderr or the pre-repair tasks.md copy).
- The (c) `rm` incident's session record.
- The (d) introducing commit for the regenerated scratch tree and its message.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

None. All ten iterations are complete and recorded through the gateway; phase synthesis wrote `research.md`, `resource-map.md`, `findings-registry.json` and `deep-research-dashboard.md`, and recorded the terminal synthesis event with `stopReason: maxIterationsReached`.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

- The r3-dsflash-llmgw lineage (same executor and route) is the working precedent for this detached lineage's file layout, gateway usage and state shapes.
- The epic's research history (rounds 1 to 3) is merged in `specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md`; the round-one to round-four build children carry their own implementation summaries and goal logs.
- The completion checks for this phase read `deep-research-state.jsonl` for 10 iteration records, and `research/research.md` for a Proposed Implementation Phases section, a Rejected Ideas section, at least ten VERIFIED/INFERRED marks and resolving SOURCE tags.
