---
title: Deep Research Strategy - Deep Review Complexity
description: Runtime strategy for the 10-iteration research loop investigating deep-review depth gaps.
---

# Deep Research Strategy - Deep Review Complexity

<!-- ANCHOR:overview -->
## 1. OVERVIEW

This research session compares the deep-review workflow against focused deep-research bug-finding behavior. The goal is to identify why deep-review can look surface-level and produce concrete improvement recommendations.
<!-- /ANCHOR:overview -->

## 2. TOPIC

Investigate why focused deep-research bug-finding can surface more bugs than the deep-review workflow, and identify changes that would make deep-review less surface-level.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which deep-review prompt, agent, or YAML constraints reduce bug-finding depth?
- [ ] Which deep-research mechanics produce stronger bug discovery and can transfer to deep-review?
- [ ] Does deep-review's convergence logic stop before adversarial class-of-bug coverage is complete?
- [ ] Does deep-review require enough file-line evidence, producer/consumer inventory, and hypothesis rotation?
- [ ] What target surfaces should a follow-up implementation packet change first?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Do not implement deep-review changes during this research packet.
- Do not change CLI executor code unless it directly affects research execution evidence.
- Do not evaluate unrelated skills outside deep-review, deep-research, and supporting spec-kit workflow surfaces.

## 5. STOP CONDITIONS

- Stop after 10 iterations.
- Stop early only if the workflow cannot create required artifacts or Codex dispatch fails unrecoverably.
- Do not stop merely because broad themes are identified; continue until target surfaces and verification recommendations are concrete.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Which deep-review prompt, agent, or YAML constraints reduce bug-finding depth?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

Iteration 001 found that deep-review has rigor after a finding exists, but weaker candidate-generation pressure than focused deep-research. Prior memory surfaced related archived packets for deep-research refinement and review-mode improvement. Treat those as hints, but verify current repository files before drawing conclusions.

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes target
- Progressive synthesis: true
- Canonical synthesis output: `research/research.md`
- Executor: `cli-codex`, model `gpt-5.5`, reasoning `high`, service tier `fast`
- Current generation: 1
- Started: 2026-05-22T05:55:00Z
