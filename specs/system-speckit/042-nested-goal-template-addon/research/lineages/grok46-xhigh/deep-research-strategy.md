---
title: Deep Research Strategy - Nested goal addon
description: Fan-out lineage strategy for grok46-xhigh nested-goal research.
trigger_phrases:
  - nested goal
  - goal.md addon
importance_tier: important
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Nested goal addon (grok46-xhigh)

## 1. OVERVIEW

Detached fan-out lineage. Write surface is this directory only.

## 2. TOPIC

Design a nested-goal addon for system-spec-kit: a parent `goal.md` is the single objective an operator sets via the runtime goal command; it references per-phase child `goal.md` files so the effective directive can exceed the goal-command character cap while the set string stays small and stable.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)

None remaining. All six charter questions are answered.
<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS

- Implementing the addon, templates, validators, or command changes.
- Adding a runtime dereference engine that follows paths inside the frozen goal string.
- Unifying Claude native Stop-hook goal with OpenCode prompt-injection goal into one runtime.
- Adding `.opencode/hooks/goal/claude`.
- Mutating `spec.md`, running packet validation, saving memory, or writing outside this lineage directory.

## 5. STOP CONDITIONS

- `stopPolicy: max-iterations` with `maxIterations: 3`. Terminal stop is `maxIterationsReached`.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS

- [x] Q1: `goal.md` belongs on `lazyAddonDocs` at levels 1, 2, 3, 3+ and phase-parent; omit review. Not `optionalAddonDocs` (QA/closure + hardcoded collectDocuments). (iteration 1)
- [x] Q2: Three in-repo surfaces (OpenCode plugin, sibling core, Claude hole). 4000-char caps confirmed. Claude Stop-hook internals are operator-asserted, not repo-proven. (iteration 2)
- [x] Q3: `goal_prompting` should become runtime-neutral via a dispatch table; do not add a Claude adapter. Offer already does not call the tool; `set` is the gap. (iteration 2)
- [x] Q4: Binding is a prompt convention plus a present-file packet validator. Parent decisions win. Set string is a short pointer, not child paths. (iteration 3)
- [x] Q5: AC_CLOSURE is the L2+ packet-close complement, not the session stop evaluator, and it does not run on phase-parent. (iteration 3)
- [x] Q6: Split durable vs volatile log; cap the durable slice at 2000 chars; no whole-file cap. 033 `goal.md` is 15028 bytes with three phases. (iteration 3)
<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED

- Reading both document collectors (`collectDocuments` vs `validationDocsForLevel`) before trusting Level-row names. (iteration 1)
- Measuring 033 `goal.md` with `wc -c` rather than quoting the research brief. (iteration 2)
- Treating CC-029 / README matrix as the Claude truth instead of the research-topic Stop-hook claim. (iteration 2)
- Separating durable slice cap from whole-file cap. (iteration 3)
<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED

- memory_match_triggers and memory_context timed out at init; file-derived context only. (init)
- `constitutional/goal-prompting-runtime-specific.md` is cited by CC-029 and is absent on disk. (iteration 2)
- Gateway legacy projection writes `research/deep-research-state.jsonl` nested under the lineage and upcasts the topic to the session id; YAML/fanout merge still needs the lineage-root jsonl. (init)
<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)

### requiredAddonDocs for goal.md -- BLOCKED (iteration 1)
- What was tried: treat goal.md like a required level addon
- Why blocked: file-presence hard-error on every existing packet
- Do NOT retry: required lists

### optionalAddonDocs as primary bucket -- BLOCKED (iteration 1)
- What was tried: same bucket as checklist/AC
- Why blocked: QA/closure semantic; collectDocuments misses new names
- Do NOT retry: optionalAddonDocs for goal.md

### Claude sibling adapter -- BLOCKED (iteration 2)
- What was tried: port opencode_goal to Claude
- Why blocked: matrix by-design empty; CC-029
- Do NOT retry: hooks/goal/claude

### Runtime path-follower -- BLOCKED (iteration 3)
- What was tried: dereference paths inside the goal string
- Why blocked: both runtimes are string-in/string-out
- Do NOT retry: goal-core file following

### Whole-file parent size cap -- BLOCKED (iteration 3)
- What was tried: cap entire goal.md
- Why blocked: punishes the progress log
- Do NOT retry: whole-file cap
<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS

- requiredAddonDocs / requiredCoreDocs for goal.md (iteration 1)
- optionalAddonDocs as primary bucket (iteration 1)
- Distinct Level row for child packets (iteration 1)
- hooks/goal/claude adapter (iteration 2)
- Treating plugin and sibling core as one system (iteration 2)
- Runtime dereference of child paths (iteration 3)
- AC_CLOSURE as session stop evaluator (iteration 3)
- Whole-file size cap on parent goal.md (iteration 3)
- Putting child paths into the frozen set string (iteration 3)
<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER

- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: required lists; optionalAddonDocs-as-primary; Claude adapter; runtime dereference; whole-file cap
- Pivot lineage: none
- Remaining frontier: live Claude Stop-hook re-read behavior (unverified in repo)
<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS

- Does a live Claude Code Goal/Stop hook re-read a file path, or only the frozen string? Not answerable from this repository.
- Whether speckit stale-filename test (`goal.md` substring ban) should be narrowed when documenting the packet file.
<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS

None. maxIterations reached (3/3). Stop reason: maxIterationsReached.
<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

## 12. KNOWN CONTEXT

memory_match_triggers and memory_context timed out at init.

resource-map.md not present at spec folder; skipping coverage gate. Lineage-local `resource-map.md` emitted at synthesis from this run's sources.

### Bounded Context Snapshot

- Source pointers: spec-kit-docs.json, EXTENSION-GUIDE.md, spec-doc-structure.ts, orchestrator.ts, template-structure.js, phase-definitions.md, opencode-goal.js, goal-core.cjs, hooks/goal/README.md, speckit YAML goal_prompting, check-ac-closure.sh, 033/goal.md
- Constraints: lineage write surface only; reduce-state.cjs not invoked (would resolve parent research/)

## 13. RESEARCH BOUNDARIES

- Max iterations: 3
- Convergence threshold: 0.05
- Stop policy: max-iterations
- Stop reason: maxIterationsReached
- Started: 2026-08-29T17:50:00.000Z
- Completed: 2026-08-29T17:59:00.000Z
