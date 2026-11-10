---
title: Deep Research Strategy Template
description: Runtime template copied to research/ during initialization to track research progress, focus decisions, and outcomes across iterations.
trigger_phrases:
  - "deep research strategy"
  - "research strategy template"
  - "research session tracking"
  - "exhausted research approaches"
  - "research stop conditions"
  - "ruled out research directions"
importance_tier: normal
contextType: planning
version: 1.14.0.19
---

# Deep Research Strategy - Session Tracking Template

Runtime template copied to `{spec_folder}/research/` during initialization. Tracks research progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep research session. Records what to investigate, what worked, what failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{spec_folder}/research/deep-research-strategy.md` and populates Topic, Key Questions, Known Context, and Research Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable — analyst-owned sections remain stable, while machine-owned sections are rewritten by the reducer after each iteration. Section 3 is a generated projection from the reducer registry.
- **Protection:** Shared state with explicit ownership boundaries. Orchestrator validates consistency on resume.

### Question Injection Surface

Use `{spec_folder}/research/inbox.jsonl` to append external questions during an active run. Each line is one JSON object with:

- `id`: stable inbox record identifier
- `text`: question text to promote
- `source`: concrete source label, such as an angle bank entry, analyst strategy, or operator note
- `origin`: one of `angle-bank`, `analyst-strategy`, `operator`, or `legacy-import`
- `injectedAtIteration`: iteration number when the question was introduced
- `promotedQuestionId`: promoted registry question id, or `null` until promotion

The reducer reads the inbox on every reduce step and carries `origin` into the question registry and dashboard badges. Direct edits to Section 3 still work as a compatibility path, but they are attributed as `legacy-import`.

Question ownership is explicit:

- Inbox rows are immutable input.
- The reducer registry is canonical question state.
- Section 3 is rendered only from the registry view.

When an inbox row targets an existing registry question but carries different text, the reducer keeps the registry value, records `operatorDecision: needs_decision`, and appends a `question_conflict` event with both `inboxValue` and `registryValue`.

---

## 2. TOPIC
How can the Skilled test cycle get faster after the five cuts already built? Measured state on an 18-core Mac: the system-deep-loop suite takes 504-511 s (161 files in parallel, then 12 timing-sensitive files serially, about 265 s: tests/stress/**, tests/lifecycle/**, unit/fanout-run, unit/lineage-timestamp-window, integration/deep-research-postflip-fanout). The system-spec-kit npm test takes 841-911 s: the core lane 348-399 s (about 300 s of it is import time), the cli lane about 400 s set by tests/upgrade-legacy.vitest.ts alone, and validation about 90 s. Open items: (1) the cli lane's upgrade-legacy file sets its time; (2) the 12 serial deep-loop files; (3) the 300 s import time in the spec-kit core lane; (4) ledger read caching ideas in production code (singleWriterReadCache, gateway rescans) that change runtime behavior; (5) a smaller CI runner gains less from parallel files. Prioritize changes that keep every assertion, measure before claiming and avoid overengineering.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which fixture setup, waits, subprocesses, and assertions account for the roughly 400-second cli lane in tests/upgrade-legacy.vitest.ts, and what test-only changes can reduce elapsed time while retaining every assertion?
- [x] Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?
- [x] What accounts for about 300 seconds of import time in the spec-kit core lane, how is that time produced, and which test-process or module-loading changes can reduce it without changing coverage?
- [x] What evidence would justify production changes involving singleWriterReadCache or gateway rescans, and how should their runtime-behavior risk be separated from test-only speed work?
- [x] How do worker count and file parallelism affect elapsed time on smaller CI runners, and what runner-specific measurements should guide any concurrency change?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
This research will not remove tests or assertions, edit production or test code, change CI workflows, or claim new timing results without an observed run. It will identify measured, assertion-preserving candidates and the evidence needed to validate them.

---

## 5. STOP CONDITIONS
Stop at legal convergence after at least 3 iterations, or at 10 iterations. Preserve unresolved questions and blocked evidence paths; do not implement changes in this research lineage.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which fixture setup, waits, subprocesses, and assertions account for the roughly 400-second cli lane in tests/upgrade-legacy.vitest.ts, and what test-only changes can reduce elapsed time while retaining every assertion?
- Which twelve timing-sensitive system-deep-loop files make up about 265 seconds, what shared-state or timing assumptions keep them serial, and can any safe scheduling change retain all assertions?
- What accounts for about 300 seconds of import time in the spec-kit core lane, how is that time produced, and which test-process or module-loading changes can reduce it without changing coverage?
- What evidence would justify production changes involving singleWriterReadCache or gateway rescans, and how should their runtime-behavior risk be separated from test-only speed work?
- How do worker count and file parallelism affect elapsed time on smaller CI runners, and what runner-specific measurements should guide any concurrency change?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the harness and runner together separated repeated per-test work from the one-time skill copy and showed that the slow file is already isolated from the other CLI files. (iteration 1)
- reading the parent timing notes alongside the runner showed that the reported slow-file duration and runner log are not phase-level measurements. (iteration 2)
- combining the config globs with exact file discovery made the twelve-file set explicit; targeted reads showed concrete timing, child-process, and graph-lock behaviors. (iteration 3)
- combining the before/after record with the current Vitest config separated a likely repeated worker cost from the excluded deep-loop suite. (iteration 4)
- reading the option contract, only enabled caller, focused tests, and gateway flow showed where a cache is safe and which fresh reads protect the write path. (iteration 5)
- reading the workflow commands beside the Vitest configs showed that the current CI runner label is not a resource measurement and the file-parallelism settings leave worker count to defaults. (iteration 6)
- comparing the YAML branch with the convergence reference surfaced an enforcement ambiguity that would be hidden by reporting only the reducer's 5/5 question coverage. (iteration 7)
- checking the packet file inventory distinguishes a described profile from a profile that can actually be analyzed. (iteration 8)
- the job and step view surfaced an independent scheduling candidate beyond raising Vitest worker counts, while the artifact search checked whether prior timing data could be recovered. (iteration 9)
- reading the runner entrypoint exposed a ready-made lane timer and the exact sequence without executing the suite. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- static reading cannot determine which phase consumes the most wall time. (iteration 1)
- static inspection cannot assign elapsed seconds to the fixture copy, reset loop, subprocesses, or validation calls. (iteration 2)
- static source cannot rank the twelve files by elapsed time or prove their independence under concurrent load. (iteration 3)
- the available runner reports only whole-invocation time, so it cannot assign the 302 seconds to particular imports. (iteration 4)
- the packet’s short note does not distinguish the existing single-writer cache from additional gateway changes; source-level scan counts also do not establish elapsed time. (iteration 5)
- the packet contains no runner-side timing or CPU/IO profile, so no worker cap can be selected responsibly from its Mac measurements. (iteration 6)
- repository text does not show whether a separate runtime implementation adds the low-novelty check, and the raw run artifacts needed to reconcile 834 versus 841 seconds are absent. (iteration 7)
- the profile is not present among the packet files examined, and this run cannot recreate it without executing tests. (iteration 8)
- workflow YAML identifies order and artifact steps but gives no full job duration or repeated setup cost. (iteration 9)
- the existing timer stops at lane boundaries, so it cannot rank per-case or module-import costs; workflow text cannot establish job-splitting savings. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### Assuming the all-questions-answered STOP branch proves that the separate low-novelty rule passed. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Assuming the all-questions-answered STOP branch proves that the separate low-novelty rule passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Assuming the all-questions-answered STOP branch proves that the separate low-novelty rule passed.

### Attributing the remaining import time to deep-loop test imports; the recorded 302-second figure remained after those tests were excluded. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Attributing the remaining import time to deep-loop test imports; the recorded 302-second figure remained after those tests were excluded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attributing the remaining import time to deep-loop test imports; the recorded 302-second figure remained after those tests were excluded.

### Choosing a maxWorkers value from runner-label assumptions without capturing the actual runner resources. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Choosing a maxWorkers value from runner-label assumptions without capturing the actual runner resources.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Choosing a maxWorkers value from runner-label assumptions without capturing the actual runner resources.

### Claiming a wall-time reduction from step order alone without accounting for repeated setup/build and measuring the complete workflow. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Claiming a wall-time reduction from step order alone without accounting for repeated setup/build and measuring the complete workflow.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming a wall-time reduction from step order alone without accounting for repeated setup/build and measuring the complete workflow.

### Claiming per-test or per-phase timing from the runner's existing whole-lane timer. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Claiming per-test or per-phase timing from the runner's existing whole-lane timer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Claiming per-test or per-phase timing from the runner's existing whole-lane timer.

### Counting source-level reads alone cannot show the elapsed-time saving; the scan cost must be measured on the target workload. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Counting source-level reads alone cannot show the elapsed-time saving; the scan cost must be measured on the target workload.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting source-level reads alone cannot show the elapsed-time saving; the scan cost must be measured on the target workload.

### Enabling the cache at the CLI gateway solely because repeated ledger reads are visible in source; there is no test-cycle profile showing their cost and the gateway can have concurrent process writers. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Enabling the cache at the CLI gateway solely because repeated ledger reads are visible in source; there is no test-cycle profile showing their cost and the gateway can have concurrent process writers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Enabling the cache at the CLI gateway solely because repeated ledger reads are visible in source; there is no test-cycle profile showing their cost and the gateway can have concurrent process writers.

### Increasing worker count as a way to reduce the serial 12-file group. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Increasing worker count as a way to reduce the serial 12-file group.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Increasing worker count as a way to reduce the serial 12-file group.

### Moving any of the twelve files to parallel based only on filenames or source structure; the current evidence does not demonstrate independence under load. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Moving any of the twelve files to parallel based only on filenames or source structure; the current evidence does not demonstrate independence under load.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Moving any of the twelve files to parallel based only on filenames or source structure; the current evidence does not demonstrate independence under load.

### None. Static inspection identified measurable phases; it did not establish their relative costs. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. Static inspection identified measurable phases; it did not establish their relative costs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. Static inspection identified measurable phases; it did not establish their relative costs.

### Raising the CLI file-level worker count by itself: the runner already executes the slow file concurrently with the rest of the CLI project. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Raising the CLI file-level worker count by itself: the runner already executes the slow file concurrently with the rest of the CLI project.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising the CLI file-level worker count by itself: the runner already executes the slow file concurrently with the rest of the CLI project.

### Re-running the test suite to regenerate the historical profile; this research run is limited to existing evidence. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Re-running the test suite to regenerate the historical profile; this research run is limited to existing evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-running the test suite to regenerate the historical profile; this research run is limited to existing evidence.

### Removing the locked append rescan or post-append projection reads without evidence that the replacement preserves current-head, idempotency, fencing, and projection behavior. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Removing the locked append rescan or post-append projection reads without evidence that the replacement preserves current-head, idempotency, fencing, and projection behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removing the locked append rescan or post-append projection reads without evidence that the replacement preserves current-head, idempotency, fencing, and projection behavior.

### Repeating static inspection to infer the upgrade-legacy phase split; reducer marks that direction blocked, and the controlled test is outside this lineage’s execution boundary. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Repeating static inspection to infer the upgrade-legacy phase split; reducer marks that direction blocked, and the controlled test is outside this lineage’s execution boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repeating static inspection to infer the upgrade-legacy phase split; reducer marks that direction blocked, and the controlled test is outside this lineage’s execution boundary.

### Source-text timing totals alone cannot choose an implementation change or establish savings; the next useful evidence is a controlled profile of the corresponding workload. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Source-text timing totals alone cannot choose an implementation change or establish savings; the next useful evidence is a controlled profile of the corresponding workload.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Source-text timing totals alone cannot choose an implementation change or establish savings; the next useful evidence is a controlled profile of the corresponding workload.

### Static packet and runner inspection cannot produce per-case elapsed time. A controlled instrumented run is the next evidence needed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Static packet and runner inspection cannot produce per-case elapsed time. A controlled instrumented run is the next evidence needed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Static packet and runner inspection cannot produce per-case elapsed time. A controlled instrumented run is the next evidence needed.

### The existing npm runner provides lane-level elapsed logs only; it cannot identify which case or import phase dominates a lane. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The existing npm runner provides lane-level elapsed logs only; it cannot identify which case or import phase dominates a lane.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The existing npm runner provides lane-level elapsed logs only; it cannot identify which case or import phase dominates a lane.

### The inspected workflows provide no CI artifact-upload path for the historical profile and no per-step duration report in the source checked here. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The inspected workflows provide no CI artifact-upload path for the historical profile and no per-step duration report in the source checked here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The inspected workflows provide no CI artifact-upload path for the historical profile and no per-step duration report in the source checked here.

### The packet and runner do not identify slow modules or the method behind the reported import-time value. A per-worker/module profile is required before a specific loading change can be justified. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The packet and runner do not identify slow modules or the method behind the reported import-time value. A per-worker/module profile is required before a specific loading change can be justified.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The packet and runner do not identify slow modules or the method behind the reported import-time value. A per-worker/module profile is required before a specific loading change can be justified.

### The reported aggregate 265-second serial time does not provide per-file costs. Source inspection identifies the scheduling premise but cannot rank candidates. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The reported aggregate 265-second serial time does not provide per-file costs. Source inspection identifies the scheduling premise but cannot rank candidates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The reported aggregate 265-second serial time does not provide per-file costs. Source inspection identifies the scheduling premise but cannot rank candidates.

### The searched packet file inventory did not expose the historical profile, so it cannot supply per-file timings from the available packet artifacts. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The searched packet file inventory did not expose the historical profile, so it cannot supply per-file timings from the available packet artifacts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The searched packet file inventory did not expose the historical profile, so it cannot supply per-file timings from the available packet artifacts.

### The workflow runner label and current source files do not contain a CPU-count measurement or worker-count benchmark. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: The workflow runner label and current source files do not contain a CPU-count measurement or worker-count benchmark.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The workflow runner label and current source files do not contain a CPU-count measurement or worker-count benchmark.

### Treating a profile description in prose as access to the profile's per-file measurements. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating a profile description in prose as access to the profile's per-file measurements.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a profile description in prose as access to the profile's per-file measurements.

### Treating separate commands as proof that a parallel CI job split will be faster. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating separate commands as proof that a parallel CI job split will be faster.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating separate commands as proof that a parallel CI job split will be faster.

### Treating the 18-core Mac timings as a measurement of the current ubuntu-latest CI jobs. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the 18-core Mac timings as a measurement of the current ubuntu-latest CI jobs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 18-core Mac timings as a measurement of the current ubuntu-latest CI jobs.

### Treating the lane total or the slow file total as evidence of which internal phase dominates; the current timers measure broader invocations. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the lane total or the slow file total as evidence of which internal phase dominates; the current timers measure broader invocations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the lane total or the slow file total as evidence of which internal phase dominates; the current timers measure broader invocations.

### Treating the packet's 834-second and 841-second lower bounds as interchangeable without checking run records. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating the packet's 834-second and 841-second lower bounds as interchangeable without checking run records.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the packet's 834-second and 841-second lower bounds as interchangeable without checking run records.

### Treating the sequential shard runner as a proven import-time optimization; its source documents a different purpose and separate process starts. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the sequential shard runner as a proven import-time optimization; its source documents a different purpose and separate process starts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the sequential shard runner as a proven import-time optimization; its source documents a different purpose and separate process starts.

### Treating the single-writer cache as wholly unimplemented; the current code already enables it in the per-lineage single-writer effect dispatcher. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the single-writer cache as wholly unimplemented; the current code already enables it in the per-lineage single-writer effect dispatcher.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the single-writer cache as wholly unimplemented; the current code already enables it in the per-lineage single-writer effect dispatcher.

### Treating the two inspected workflows as proof that no profile exists in any external artifact store. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating the two inspected workflows as proof that no profile exists in any external artifact store.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the two inspected workflows as proof that no profile exists in any external artifact store.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None. Static inspection identified measurable phases; it did not establish their relative costs. (iteration 1)
- Raising the CLI file-level worker count by itself: the runner already executes the slow file concurrently with the rest of the CLI project. (iteration 1)
- Static packet and runner inspection cannot produce per-case elapsed time. A controlled instrumented run is the next evidence needed. (iteration 2)
- Treating the lane total or the slow file total as evidence of which internal phase dominates; the current timers measure broader invocations. (iteration 2)
- Moving any of the twelve files to parallel based only on filenames or source structure; the current evidence does not demonstrate independence under load. (iteration 3)
- Repeating static inspection to infer the upgrade-legacy phase split; reducer marks that direction blocked, and the controlled test is outside this lineage’s execution boundary. (iteration 3)
- The reported aggregate 265-second serial time does not provide per-file costs. Source inspection identifies the scheduling premise but cannot rank candidates. (iteration 3)
- Attributing the remaining import time to deep-loop test imports; the recorded 302-second figure remained after those tests were excluded. (iteration 4)
- The packet and runner do not identify slow modules or the method behind the reported import-time value. A per-worker/module profile is required before a specific loading change can be justified. (iteration 4)
- Treating the sequential shard runner as a proven import-time optimization; its source documents a different purpose and separate process starts. (iteration 4)
- Counting source-level reads alone cannot show the elapsed-time saving; the scan cost must be measured on the target workload. (iteration 5)
- Enabling the cache at the CLI gateway solely because repeated ledger reads are visible in source; there is no test-cycle profile showing their cost and the gateway can have concurrent process writers. (iteration 5)
- Removing the locked append rescan or post-append projection reads without evidence that the replacement preserves current-head, idempotency, fencing, and projection behavior. (iteration 5)
- Treating the single-writer cache as wholly unimplemented; the current code already enables it in the per-lineage single-writer effect dispatcher. (iteration 5)
- Choosing a maxWorkers value from runner-label assumptions without capturing the actual runner resources. (iteration 6)
- Increasing worker count as a way to reduce the serial 12-file group. (iteration 6)
- The workflow runner label and current source files do not contain a CPU-count measurement or worker-count benchmark. (iteration 6)
- Treating the 18-core Mac timings as a measurement of the current ubuntu-latest CI jobs. (iteration 6)
- Assuming the all-questions-answered STOP branch proves that the separate low-novelty rule passed. (iteration 7)
- Source-text timing totals alone cannot choose an implementation change or establish savings; the next useful evidence is a controlled profile of the corresponding workload. (iteration 7)
- Treating the packet's 834-second and 841-second lower bounds as interchangeable without checking run records. (iteration 7)
- Re-running the test suite to regenerate the historical profile; this research run is limited to existing evidence. (iteration 8)
- The searched packet file inventory did not expose the historical profile, so it cannot supply per-file timings from the available packet artifacts. (iteration 8)
- Treating a profile description in prose as access to the profile's per-file measurements. (iteration 8)
- Claiming a wall-time reduction from step order alone without accounting for repeated setup/build and measuring the complete workflow. (iteration 9)
- The inspected workflows provide no CI artifact-upload path for the historical profile and no per-step duration report in the source checked here. (iteration 9)
- Treating the two inspected workflows as proof that no profile exists in any external artifact store. (iteration 9)
- Claiming per-test or per-phase timing from the runner's existing whole-lane timer. (iteration 10)
- The existing npm runner provides lane-level elapsed logs only; it cannot identify which case or import phase dominates a lane. (iteration 10)
- Treating separate commands as proof that a parallel CI job split will be faster. (iteration 10)

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
- How many seconds the copy, resets, CLI subprocesses, and validation calls each contribute; answer with per-case timing in a controlled run. (iteration 1)
- Exact copy, reset, subprocess, and validation durations remain unknown and require a controlled instrumented run. (iteration 2)
- Per-file timing contributions to the reported 265 seconds are not present in the dispatch evidence or source files, so the slowest serial files cannot be ranked here. (iteration 3)
- Whether any specific file can move to a separate parallel subgroup requires repeated runs under the target 18-core runner and smaller CI runner, with interference checks. (iteration 3)
- Which modules or import phases account for the reported 302 seconds, and whether process reuse or module-loading changes reduce wall time while preserving the per-file scratch database and all assertions. (iteration 4)
- No before/after wall-time or scan-duration profile for these gateway operations is present, so no speed-up is claimed. (iteration 5)
- The smaller-runner tradeoff remains open. (iteration 5)
- No timing result from a smaller runner is available, so the best worker cap and expected savings remain unknown. (iteration 6)
- The packet’s 18-core timings do not establish whether the current ubuntu-latest jobs are CPU-bound, disk-bound, or constrained by worker startup. (iteration 6)
- No original key questions remain. The per-case, per-file, import-phase, gateway-cost, and small-runner measurements remain unavailable; these are evidence gaps, not reopened key questions. (iteration 7)
- No original key questions remain. The location and availability of the generated JSON profile remain unconfirmed beyond the packet inventory searched here. (iteration 8)
- No original key questions remain. Whether CI job splitting reduces end-to-end wall time and whether the historical profile was saved elsewhere remain unmeasured or unconfirmed. (iteration 9)
- No original key questions remain. Actual job-split savings, repeated setup/build cost, CI-runner capacity, detailed test phases, and the historical profile's external availability remain unmeasured or unconfirmed. (iteration 10)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
The parent packet reports all five planned cuts as built. Its plan records a measured 504-511 s deep-loop suite and a 348-399 s spec-kit core lane; the dispatch supplies newer 18-core measurements of 504-511 s deep-loop, 841-911 s overall spec-kit, about 400 s cli, and about 300 s core import time. These figures are reports, not re-measured in this lineage.

Resource-map status: resource-map.md not present at init; skipping coverage gate.

### Bounded Context Snapshot

- Source pointers: `specs/system-speckit/runtime-and-release/006-test-cycle-speed/001-five-cuts/plan.md`, `tasks.md`, `implementation-summary.md`, the two runtimes’ Vitest configs and runner scripts, and the named slow tests.
- Reuse candidates: existing per-file test fixtures and runner/project configuration introduced by the five completed cuts.
- Integration points: `system-spec-kit/runtime/package.json`, `system-spec-kit/runtime/scripts/run-tests.mjs`, `system-spec-kit/runtime/scripts/run-cli-tests.sh`, and `system-deep-loop/runtime/vitest.config.ts`.
- Constraints and risks: code and CI are read-only in this lineage; preserve every assertion; time reports vary by machine and require repeat measurements before a performance claim.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true (final synthesis is workflow-owned)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred, not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-10T16:49:27Z
