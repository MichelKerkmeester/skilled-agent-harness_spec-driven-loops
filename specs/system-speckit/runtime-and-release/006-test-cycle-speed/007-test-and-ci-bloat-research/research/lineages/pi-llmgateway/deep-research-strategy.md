---
title: Deep Research Strategy - Test and CI Bloat (pi-llmgateway lineage)
description: Research strategy and machine-owned tracking state for the cli-pi lineage investigating test, CI workflow and git hook bloat in this repository.
trigger_phrases:
  - "test and ci bloat research strategy"
  - "deep research strategy pi llmgateway"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Test and CI Bloat Research

## 1. OVERVIEW

### Purpose

Persistent brain for this lineage. Records what to investigate, what worked, what failed, and where to focus next. Read by the executor at every iteration.

### Usage

- Init populated Topic, Key Questions, Known Context, and Research Boundaries.
- Per iteration the agent reads Next Focus, writes iteration evidence, and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- Mutability: analyst-owned sections stay stable; machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Which automated tests, CI workflows and git hook checks in this repository are bloat or overengineered, and what should be deleted, merged, narrowed or moved off the commit and push path to shorten test and workflow run time? Subjects: `.github/workflows/`, `.skilled/scripts/git-hooks/`, the vitest and node:test suites under `.skilled/skills/*/runtime`, and test files under `specs/`. Settled and not to repeat: caching, trigger hygiene and workflow consolidation in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`, and the per-file splits and CI timing in phases 001 to 005 of `specs/system-speckit/runtime-and-release/006-test-cycle-speed`. For each proposed cut: file path, time it saves, regression it would stop catching. Research only.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which CI workflows duplicate a local git hook check or another workflow, and how many seconds per run would deleting or merging them save?
- [ ] Which test files under `.skilled/skills/*/runtime` are redundant, mirror the implementation, or re-assert framework behavior, and how long does each suite take?
- [ ] Which git hook checks under `.skilled/scripts/git-hooks/` can move to CI or narrow to changed paths, and how much wall clock per commit and push does each cost?
- [x] Which test files under `specs/` belong to closed packets, and what unique regression coverage would be lost by deleting them?
- [x] Which overengineered test infrastructure (custom harnesses, serial lists, fixtures, helper layers) costs run time or maintenance beyond the coverage it adds?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Caching strategy, trigger hygiene and workflow consolidation decisions already settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`.
- Per-file test splits and measured CI timing already recorded in phases 001 to 005 of `specs/system-speckit/runtime-and-release/006-test-cycle-speed`.
- Changing any test, workflow, hook or source file. Findings only.
- Rewriting test frameworks or proposing a new CI provider.

---

## 5. STOP CONDITIONS

- Ten iterations reached (`stopPolicy: max-iterations`), at which point synthesis runs regardless of newInfoRatio.
- Unrecoverable state corruption or repeated append-gateway refusal.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which test files under `specs/` belong to closed packets, and what unique regression coverage would be lost by deleting them?
- Which overengineered test infrastructure (custom harnesses, serial lists, fixtures, helper layers) costs run time or maintenance beyond the coverage it adds?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- reading the hook scripts as a gate inventory rather than trying to execute them. The scripts document their own removals, and those comments carry the only real timing number in the tree, which gave a criterion (block-or-drop) without needing to run anything. (iteration 1)
- pricing the components instead of the whole. Running the hooks was forbidden, but the components are individually reachable, and their sum is small enough to state with a known unmeasured term. (iteration 2)
- pairing each workflow with its hook gate by name and command, which turns "many workflows" into a finite duplicate set. Extracting `on:` blocks first also showed that almost everything pays twice per change, which multiplies any saving. (iteration 3)
- `--list` on the discovery runner answered the coverage question in one call without executing a single test, and per-tree `git ls-files` counts killed the mirror-duplication hypothesis before it could become a wrong recommendation. (iteration 4)
- classifying paths rather than reading files. The `scratch/`, `context/`, `baseline/` distribution settled the question in one pass, and the workflow grep settled coverage in another. (iteration 5)
- partitioning by suffix first. The `.test.mjs` / `.vitest.ts` split exposed the non-blocking job as the home of the most important suites, which no amount of reading individual files would have shown. (iteration 6)
- reading the two workflows' comments. They quote local test times (half a minute, 2.7 minutes) beside a measured mean, which is the only way to split install from assertion without step timings. (iteration 7)
- reading configs instead of test bodies. One `fileParallelism: false` line explains more run time than any amount of suite reading, and the deep-loop split shows what a hand-maintained serial list actually looks like. (iteration 8)
- summing the recorded means before reading any workflow. It inverted the natural order of investigation: the most duplicated guards turned out to be the least valuable to cut, and the expensive workflows contain little duplication. (iteration 9)
- ranking by measured sweep share first and candidate identity second. It kept a 10 s guard out of the top of the list even though it is pure duplication. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- measuring the gates by invocation. A hook that re-mints and stages files cannot be timed in a read-only research run; the attempt was abandoned before it could write. (iteration 1)
- chasing the reducer's Next Focus as a time item. The duplication is real, but measurement shows it costs milliseconds; following it as though it were a wait source would have wasted the iteration. (iteration 2)
- expecting job-level timing to exist. Only workflow means are recorded, so every per-job figure has to be labelled inferred. (iteration 3)
- assuming the 87 s mean proved the corpus was skipped. It might be a fast corpus; only per-step durations would settle it, and they do not exist. (iteration 4)
- assuming the census pattern found live suites in the spec tree. Ninety-one of 111 were captured logs or fixtures, which the first group-by-packet view hid. (iteration 5)
- the duplicate-basename hypothesis. Three matches looked like duplication until the imports showed two layers. (iteration 6)
- looking for redundancy by name. Both trees are single-dialect and their suite names describe distinct behaviours, so the redundancy question has a negative answer for these trees and the cost question carries the finding. (iteration 7)
- trying to attribute seconds. The repository stores no per-config timing, so every parallelism figure has to be offered as a hypothesis. (iteration 8)
- looking for a big single duplication inside the large workflows. Their cost is test volume and installs, not repeated checks. (iteration 9)
- hoping the candidates would sum to something the operator would notice. The arithmetic refused it — the two biggest workflows are big because of work nobody has proposed removing. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A cut inside `Spec-Kit Check`: the 339 vitest files it carries have no other door, so narrowing it without relocating them is coverage loss, not a saving. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A cut inside `Spec-Kit Check`: the 339 vitest files it carries have no other door, so narrowing it without relocating them is coverage loss, not a saving.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A cut inside `Spec-Kit Check`: the 339 vitest files it carries have no other door, so narrowing it without relocating them is coverage loss, not a saving.

### Any cut that re-proposes trigger changes, caching, workflow consolidation or per-file splits: settled in `002-ci-workflow-efficiency` and phases 001-005. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Any cut that re-proposes trigger changes, caching, workflow consolidation or per-file splits: settled in `002-ci-workflow-efficiency` and phases 001-005.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Any cut that re-proposes trigger changes, caching, workflow consolidation or per-file splits: settled in `002-ci-workflow-efficiency` and phases 001-005.

### Attributing the 457 s and 472 s means to specific suites without per-step durations; the install share is inferred from step order and the workflow's own quoted local test times. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Attributing the 457 s and 472 s means to specific suites without per-step durations; the install share is inferred from step order and the workflow's own quoted local test times.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attributing the 457 s and 472 s means to specific suites without per-step durations; the install share is inferred from step order and the workflow's own quoted local test times.

### Counting spawn-heavy suites as redundant: they are the only coverage for process-level behaviour (stdin deadlines, launcher reaping, hook contracts). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Counting spawn-heavy suites as redundant: they are the only coverage for process-level behaviour (stdin deadlines, launcher reaping, hook contracts).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting spawn-heavy suites as redundant: they are the only coverage for process-level behaviour (stdin deadlines, launcher reaping, hook contracts).

### Counting them as "coverage to preserve": nothing runs them, so there is no coverage to lose. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Counting them as "coverage to preserve": nothing runs them, so there is no coverage to lose.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting them as "coverage to preserve": nothing runs them, so there is no coverage to lose.

### Deleting the hook-backstop workflows outright. Measured cost per run is 66-148 s for the guard cluster, but each one covers the uninstalled-hook case, which is the normal case for a fresh clone. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Deleting the hook-backstop workflows outright. Measured cost per run is 66-148 s for the guard cluster, but each one covers the uninstalled-hook case, which is the normal case for a fresh clone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting the hook-backstop workflows outright. Measured cost per run is 66-148 s for the guard cluster, but each one covers the uninstalled-hook case, which is the normal case for a fresh clone.

### Deleting the stress configs without moving their suites: the suites catch real behaviour, and the week they were left unrun is what let them rot. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Deleting the stress configs without moving their suites: the suites catch real behaviour, and the week they were left unrun is what let them rot.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting the stress configs without moving their suites: the suites catch real behaviour, and the week they were left unrun is what let them rot.

### Deleting the three same-named suite pairs as duplicates: their imports show different layers and different mechanisms. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Deleting the three same-named suite pairs as duplicates: their imports show different layers and different mechanisms.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Deleting the three same-named suite pairs as duplicates: their imports show different layers and different mechanisms.

### Estimating per-step savings inside a workflow from its mean. The means include queue time, so a step-level number cannot be read from them. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Estimating per-step savings inside a workflow from its mean. The means include queue time, so a step-level number cannot be read from them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Estimating per-step savings inside a workflow from its mean. The means include queue time, so a step-level number cannot be read from them.

### Finding a single cut worth several minutes. The measured sweep is 4,129 s across 21 workflows with no duplication large enough to remove: the expensive workflows are expensive because of test volume and installs, both of which are real work or settled ground. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Finding a single cut worth several minutes. The measured sweep is 4,129 s across 21 workflows with no duplication large enough to remove: the expensive workflows are expensive because of test volume and installs, both of which are real work or settled ground.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Finding a single cut worth several minutes. The measured sweep is 4,129 s across 21 workflows with no duplication large enough to remove: the expensive workflows are expensive because of test volume and installs, both of which are real work or settled ground.

### Hook-gate elimination for speed. Every measured gate is cheap; deleting one would save under a second and could only lose a check. Pre-commit gate deletion is rejected as a time optimisation and survives only as a maintenance simplification argument. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Hook-gate elimination for speed. Every measured gate is cheap; deleting one would save under a second and could only lose a check. Pre-commit gate deletion is rejected as a time optimisation and survives only as a maintenance simplification argument.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hook-gate elimination for speed. Every measured gate is cheap; deleting one would save under a second and could only lose a check. Pre-commit gate deletion is rejected as a time optimisation and survives only as a maintenance simplification argument.

### Institutionalising the stress/default split: the gate is what let the suite rot unseen; the config is the workaround, not the design. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Institutionalising the stress/default split: the gate is what let the suite rot unseen; the config is the workaround, not the design.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Institutionalising the stress/default split: the gate is what let the suite rot unseen; the config is the workaround, not the design.

### Invoking `check-comment-hygiene.sh` with `bash`: the script's shebang is `python3`, so the bash invocation produced a syntax error. Re-run under `python3`; the failed attempt is not a checker defect. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Invoking `check-comment-hygiene.sh` with `bash`: the script's shebang is `python3`, so the bash invocation produced a syntax error. Re-run under `python3`; the failed attempt is not a checker defect. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Invoking `check-comment-hygiene.sh` with `bash`: the script's shebang is `python3`, so the bash invocation produced a syntax error. Re-run under `python3`; the failed attempt is not a checker defect. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1]

### Listing spec-tree test files as a time-saving cut: measured at zero run time. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Listing spec-tree test files as a time-saving cut: measured at zero run time.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Listing spec-tree test files as a time-saving cut: measured at zero run time.

### Merging the guard workflows into one job: workflow consolidation is settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency` and is not re-opened here. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Merging the guard workflows into one job: workflow consolidation is settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency` and is not re-opened here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Merging the guard workflows into one job: workflow consolidation is settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency` and is not re-opened here.

### Mirror duplication as a source of bloat: `.opencode` holds 35 test files and links the rest, so cutting a duplicated test tree is not available. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Mirror duplication as a source of bloat: `.opencode` holds 35 test files and links the rest, so cutting a duplicated test tree is not available.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Mirror duplication as a source of bloat: `.opencode` holds 35 test files and links the rest, so cutting a duplicated test tree is not available.

### Pricing parallelism from the repository alone. Without per-config timing, a parallelism change is a hypothesis with a plausible mechanism, not a measured cut. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Pricing parallelism from the repository alone. Without per-config timing, a parallelism change is a hypothesis with a plausible mechanism, not a measured cut.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Pricing parallelism from the repository alone. Without per-config timing, a parallelism change is a hypothesis with a plausible mechanism, not a measured cut.

### Ranking suites by line count as a proxy for run time. A 2,689-line in-process suite can be faster than a 299-line suite that spawns processes, and no per-file timing exists to settle it. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Ranking suites by line count as a proxy for run time. A 2,689-line in-process suite can be faster than a 299-line suite that spawns processes, and no per-file timing exists to settle it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranking suites by line count as a proxy for run time. A 2,689-line in-process suite can be faster than a 299-line suite that spawns processes, and no per-file timing exists to settle it.

### Ranking the small guards as the primary cuts: 23% of the sweep combined, and several of them cover the uninstalled-hook case that no other path covers. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Ranking the small guards as the primary cuts: 23% of the sweep combined, and several of them cover the uninstalled-hook case that no other path covers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Ranking the small guards as the primary cuts: 23% of the sweep combined, and several of them cover the uninstalled-hook case that no other path covers.

### Re-arguing triggers, caching, or a workflow-consolidation decision: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Re-arguing triggers, caching, or a workflow-consolidation decision: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-arguing triggers, caching, or a workflow-consolidation decision: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`.

### Re-litigating CI caching to fix the install share: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Re-litigating CI caching to fix the install share: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Re-litigating CI caching to fix the install share: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`.

### Reading per-test timings from CI logs: no job-level or step-level durations are stored in the repository, and this research run cannot call the GitHub API (no network credential guaranteed, and no writes outside the lineage). Savings stay estimates against workflow means. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Reading per-test timings from CI logs: no job-level or step-level durations are stored in the repository, and this research run cannot call the GitHub API (no network credential guaranteed, and no writes outside the lineage). Savings stay estimates against workflow means.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reading per-test timings from CI logs: no job-level or step-level durations are stored in the repository, and this research run cannot call the GitHub API (no network credential guaranteed, and no writes outside the lineage). Savings stay estimates against workflow means.

### Running the hooks themselves to time them: the hooks can re-mint and stage files (findings 1 and 4), so a measured run would mutate the tree. Timing was limited to read-only checkers. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Running the hooks themselves to time them: the hooks can re-mint and stage files (findings 1 and 4), so a measured run would mutate the tree. Timing was limited to read-only checkers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Running the hooks themselves to time them: the hooks can re-mint and stage files (findings 1 and 4), so a measured run would mutate the tree. Timing was limited to read-only checkers.

### Summing candidate 1 with candidates 3 and 4: they are steps inside the same 87 s workflow mean, so adding them double-counts. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Summing candidate 1 with candidates 3 and 4: they are steps inside the same 87 s workflow mean, so adding them double-counts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Summing candidate 1 with candidates 3 and 4: they are steps inside the same 87 s workflow mean, so adding them double-counts.

### Timing `frontmatter-version.mjs` and `check-mcp-mutation-class.sh`: both contain write calls. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Timing `frontmatter-version.mjs` and `check-mcp-mutation-class.sh`: both contain write calls.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Timing `frontmatter-version.mjs` and `check-mcp-mutation-class.sh`: both contain write calls.

### Timing the full `pre-commit` end to end: four of its gates rewrite the index, so the run cannot stay inside the research scope. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Timing the full `pre-commit` end to end: four of its gates rewrite the index, so the run cannot stay inside the research scope.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Timing the full `pre-commit` end to end: four of its gates rewrite the index, so the run cannot stay inside the research scope.

### Timing the re-mint gates by execution. They write to the index, so they cannot be measured without a scope violation. Their cost must be inferred from the engines they spawn, or measured by the operator in a scratch clone. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Timing the re-mint gates by execution. They write to the index, so they cannot be measured without a scope violation. Their cost must be inferred from the engines they spawn, or measured by the operator in a scratch clone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Timing the re-mint gates by execution. They write to the index, so they cannot be measured without a scope violation. Their cost must be inferred from the engines they spawn, or measured by the operator in a scratch clone.

### Treating `CodeQL` as a cut candidate. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating `CodeQL` as a cut candidate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `CodeQL` as a cut candidate.

### Treating every duplicate as deletable: `comment-hygiene.yml` and `agent-mirror-sync.yml` are the only backstop for a contributor whose hooks are not installed or trusted, so the cut is to stop paying for them on every run, not to remove them. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating every duplicate as deletable: `comment-hygiene.yml` and `agent-mirror-sync.yml` are the only backstop for a contributor whose hooks are not installed or trusted, so the cut is to stop paying for them on every run, not to remove them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating every duplicate as deletable: `comment-hygiene.yml` and `agent-mirror-sync.yml` are the only backstop for a contributor whose hooks are not installed or trusted, so the cut is to stop paying for them on every run, not to remove them.

### Treating hook latency as the primary time sink: measurement puts the whole hook path at about two seconds, against minutes in CI. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating hook latency as the primary time sink: measurement puts the whole hook path at about two seconds, against minutes in CI.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating hook latency as the primary time sink: measurement puts the whole hook path at about two seconds, against minutes in CI.

### Treating the 13 `.test.mjs` files as a small tail: they include the largest and most behaviour-heavy suite in the tree. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Treating the 13 `.test.mjs` files as a small tail: they include the largest and most behaviour-heavy suite in the tree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the 13 `.test.mjs` files as a small tail: they include the largest and most behaviour-heavy suite in the tree.

### Treating the phase's 1,270-file figure as the corpus size. It is a `git ls-files` census including archives, not the runnable set. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Treating the phase's 1,270-file figure as the corpus size. It is a `git ls-files` census including archives, not the runnable set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the phase's 1,270-file figure as the corpus size. It is a `git ls-files` census including archives, not the runnable set.

### Treating the serial list as redundant configuration: several of those suites genuinely share a database or a port, so the list is necessary; what is missing is a check that it is complete. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating the serial list as redundant configuration: several of those suites genuinely share a database or a port, so the list is necessary; what is missing is a check that it is complete.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the serial list as redundant configuration: several of those suites genuinely share a database or a port, so the list is necessary; what is missing is a check that it is complete.

### Treating the two measured advisory validators as the advisory job's cost: 2.77 s and 4.53 s are noise beside a 10-minute-timeout corpus run. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Treating the two measured advisory validators as the advisory job's cost: 2.77 s and 4.53 s are noise beside a 10-minute-timeout corpus run.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the two measured advisory validators as the advisory job's cost: 2.77 s and 4.53 s are noise beside a 10-minute-timeout corpus run.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- Invoking `check-comment-hygiene.sh` with `bash`: the script's shebang is `python3`, so the bash invocation produced a syntax error. Re-run under `python3`; the failed attempt is not a checker defect. [SOURCE: .skilled/skills/sk-code/sk-code-quality/scripts/check-comment-hygiene.sh:1] (iteration 1)
- Running the hooks themselves to time them: the hooks can re-mint and stage files (findings 1 and 4), so a measured run would mutate the tree. Timing was limited to read-only checkers. (iteration 1)
- Timing the re-mint gates by execution. They write to the index, so they cannot be measured without a scope violation. Their cost must be inferred from the engines they spawn, or measured by the operator in a scratch clone. (iteration 1)
- Hook-gate elimination for speed. Every measured gate is cheap; deleting one would save under a second and could only lose a check. Pre-commit gate deletion is rejected as a time optimisation and survives only as a maintenance simplification argument. (iteration 2)
- Timing `frontmatter-version.mjs` and `check-mcp-mutation-class.sh`: both contain write calls. (iteration 2)
- Timing the full `pre-commit` end to end: four of its gates rewrite the index, so the run cannot stay inside the research scope. (iteration 2)
- Treating hook latency as the primary time sink: measurement puts the whole hook path at about two seconds, against minutes in CI. (iteration 2)
- Deleting the hook-backstop workflows outright. Measured cost per run is 66-148 s for the guard cluster, but each one covers the uninstalled-hook case, which is the normal case for a fresh clone. (iteration 3)
- Re-arguing triggers, caching, or a workflow-consolidation decision: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`. (iteration 3)
- Treating every duplicate as deletable: `comment-hygiene.yml` and `agent-mirror-sync.yml` are the only backstop for a contributor whose hooks are not installed or trusted, so the cut is to stop paying for them on every run, not to remove them. (iteration 3)
- Mirror duplication as a source of bloat: `.opencode` holds 35 test files and links the rest, so cutting a duplicated test tree is not available. (iteration 4)
- Reading per-test timings from CI logs: no job-level or step-level durations are stored in the repository, and this research run cannot call the GitHub API (no network credential guaranteed, and no writes outside the lineage). Savings stay estimates against workflow means. (iteration 4)
- Treating the two measured advisory validators as the advisory job's cost: 2.77 s and 4.53 s are noise beside a 10-minute-timeout corpus run. (iteration 4)
- Counting them as "coverage to preserve": nothing runs them, so there is no coverage to lose. (iteration 5)
- Listing spec-tree test files as a time-saving cut: measured at zero run time. (iteration 5)
- Treating the phase's 1,270-file figure as the corpus size. It is a `git ls-files` census including archives, not the runnable set. (iteration 5)
- Deleting the three same-named suite pairs as duplicates: their imports show different layers and different mechanisms. (iteration 6)
- Ranking suites by line count as a proxy for run time. A 2,689-line in-process suite can be faster than a 299-line suite that spawns processes, and no per-file timing exists to settle it. (iteration 6)
- Treating the 13 `.test.mjs` files as a small tail: they include the largest and most behaviour-heavy suite in the tree. (iteration 6)
- Attributing the 457 s and 472 s means to specific suites without per-step durations; the install share is inferred from step order and the workflow's own quoted local test times. (iteration 7)
- Counting spawn-heavy suites as redundant: they are the only coverage for process-level behaviour (stdin deadlines, launcher reaping, hook contracts). (iteration 7)
- Institutionalising the stress/default split: the gate is what let the suite rot unseen; the config is the workaround, not the design. (iteration 7)
- Re-litigating CI caching to fix the install share: settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency`. (iteration 7)
- Deleting the stress configs without moving their suites: the suites catch real behaviour, and the week they were left unrun is what let them rot. (iteration 8)
- Pricing parallelism from the repository alone. Without per-config timing, a parallelism change is a hypothesis with a plausible mechanism, not a measured cut. (iteration 8)
- Treating the serial list as redundant configuration: several of those suites genuinely share a database or a port, so the list is necessary; what is missing is a check that it is complete. (iteration 8)
- Estimating per-step savings inside a workflow from its mean. The means include queue time, so a step-level number cannot be read from them. (iteration 9)
- Merging the guard workflows into one job: workflow consolidation is settled in `specs/system-speckit/repo-operations/002-ci-workflow-efficiency` and is not re-opened here. (iteration 9)
- Ranking the small guards as the primary cuts: 23% of the sweep combined, and several of them cover the uninstalled-hook case that no other path covers. (iteration 9)
- Treating `CodeQL` as a cut candidate. (iteration 9)
- A cut inside `Spec-Kit Check`: the 339 vitest files it carries have no other door, so narrowing it without relocating them is coverage loss, not a saving. (iteration 10)
- Any cut that re-proposes trigger changes, caching, workflow consolidation or per-file splits: settled in `002-ci-workflow-efficiency` and phases 001-005. (iteration 10)
- Finding a single cut worth several minutes. The measured sweep is 4,129 s across 21 workflows with no duplication large enough to remove: the expensive workflows are expensive because of test volume and installs, both of which are real work or settled ground. (iteration 10)
- Summing candidate 1 with candidates 3 and 4: they are steps inside the same 87 s workflow mean, so adding them double-counts. (iteration 10)

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
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: **Leave the git hooks alone.** Paths `.skilled/scripts/git-hooks/*`. Class: **no cut**. Time saved by any hook deletion: under 1 s per commit, against a measured 1-2 s total. Regression it stops catching: whichever ga...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

Baseline inventory from `specs/system-speckit/runtime-and-release/006-test-cycle-speed/007-test-and-ci-bloat-research/spec.md`:

- About 1,270 test files and 427,643 lines: 777 `.vitest.ts`, 217 `.test.cjs`, 102 `.test.mjs`, 71 `.py`, 66 `.test.ts`, 37 `.sh`.
- 32 CI workflow files, 3,867 lines under `.github/workflows/`.
- Test files by directory: 353 `system-spec-kit/runtime`, 186 `system-skill-advisor/runtime`, 174 `system-deep-loop/runtime`, 56 `doctor/scripts`, 54 `sk-doc/scripts`, 36 `sk-design-md-generator`, about 110 under `specs/`.
- CI mean run seconds: Spec-Kit Check 595, Deep-Loop Runtime Tests 472, Skill Advisor Stress 457, CodeQL 319, sk-doc Script Tests 279, OpenCode Plugin Tests 255, Gate Inputs 199, Trigger Index Rebuild 185, ... Rule Canary Sync 10.
- Local hook time (`.skilled/scripts/git-hooks/pre-commit`, `pre-push`) is not measured yet.

### Bounded Context Snapshot

- Source pointers: `.github/workflows/*.yml`, `.skilled/scripts/git-hooks/{pre-commit,pre-push,commit-msg,post-commit,...}`, `.skilled/skills/*/runtime/**/*.test.*`, `specs/**/*.test.*`.
- Reuse candidates: the settled CI efficiency packet for trigger/caching baselines so this lineage does not repeat it.
- Constraints and risks: run times in `spec.md` are wall-clock including queue time; per-check cost inside a workflow is not recorded anywhere, so estimates must be labelled inferred.

---

## 13. RESEARCH BOUNDARIES

- Max iterations: 10
- Convergence threshold: 0.05 (recorded as telemetry; `stopPolicy: max-iterations` runs every iteration)
- Per-iteration budget: 24 tool calls
- Progressive synthesis: true
- `research/research.md` ownership: workflow-owned canonical synthesis output (this lineage writes only inside its lineage directory)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A
- Current generation: 1
- Started: 2026-11-12T07:31:35Z
