---
title: Deep Research Strategy - v4.2.0.0 Release Notes Audit
description: Runtime strategy for the fan-out lineage auditing the Skilled v4.2.0.0 release notes against the v4.1.0.0..HEAD window.
trigger_phrases:
  - "v4.2.0.0 release notes audit"
  - "release notes drift"
importance_tier: normal
contextType: planning
version: 1.0.0.0
---

# Deep Research Strategy - v4.2.0.0 Release Notes Audit

## 1. OVERVIEW

### Purpose

Persistent brain for the `devin` fan-out lineage auditing the Skilled v4.2.0.0 release notes against the work shipped in `v4.1.0.0..HEAD`.

### Usage

- **Init:** created with Topic, Key Questions, Known Context, and Research Boundaries from the dispatch bindings.
- **Per iteration:** the leaf writes iteration evidence and the reducer refreshes What Worked/Failed, answered questions, carried-forward questions, ruled-out directions, and Next Focus.
- **Mutability:** Mutable. Machine-owned sections are rewritten by the reducer after each iteration.

---

## 2. TOPIC

Audit the Skilled v4.2.0.0 release notes against the work shipped since v4.1.0.0, and report what is missing, what has drifted and what is broken.

Inputs, read-only: `.skilled/changelog/skilled/v4.2.0.0.md` (926 lines, not tagged yet); the `v4.1.0.0..HEAD` window with 1084 non-merge commits listed in `scratch/window-commits.txt`; 21 recently touched packets in `scratch/recent-packets.txt`.

Definitions: MISSING = a user-visible change in the window the notes never mention. DRIFT = a release-note claim the current code or docs contradict. BUG = a defect in code changed in the window, shown by reading the code or running a read-only command.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Which commits in the window change user-visible behavior with no entry in the notes? Check each notes section in turn: Deep Loop, Fan-Out Runs, Dispatch and Safety, Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, Upgrade Notes.
- [x] Which of the 21 recent packets shipped work the notes do not cover, or describe the shipped work differently from the notes?
- [x] Which concrete claims in the notes (flags, paths, counts, test results, removed items) no longer match HEAD, including work that landed after a section was written?
- [x] Which changes in the window introduced a bug, a dead reference or a broken cross-link?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS

- Implementing fixes for any finding; this run reports only.
- Editing the release notes or any file outside the lineage directory.
- Re-auditing v4.1.0.0 and earlier release notes.

---

## 5. STOP CONDITIONS

- The loop's convergence threshold (0.05 newInfoRatio) after the minIterations floor.
- The 10-iteration cap.
- Every finding cites a commit hash, a `file:line`, and the release-notes line it concerns.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Which commits in the window change user-visible behavior with no entry in the notes? Check each notes section in turn: Deep Loop, Fan-Out Runs, Dispatch and Safety, Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, Upgrade Notes.
- Which of the 21 recent packets shipped work the notes do not cover, or describe the shipped work differently from the notes?
- Which concrete claims in the notes (flags, paths, counts, test results, removed items) no longer match HEAD, including work that landed after a section was written?
- Which changes in the window introduced a bug, a dead reference or a broken cross-link?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- classifying the window by conventional-commit type and scope first turned 1084 commits into 64 feat commits plus a fix subject list, so each candidate could be checked against a specific notes line instead of read linearly. Reading the notes in full before the commits prevented a "missing" claim from being made about something already covered in a folded "Smaller fixes" block. (iteration 1)
- checking counts against filesystem facts (17 doctor commands, 26 target rows, 66 scenarios, 47 allowlist entries, eight hub routers, 18 subcommands) turned a large "unverifiable" surface into a short list of genuinely open numbers. Reading the notes' own last-edit commit first made the post-notes Python cut visible as the cause of the stale test rows. (iteration 2)
- filtering commit types per packet turned "touched in the window" into "shipped in the window", which is the only distinction that matters for a coverage audit. Reading each latest child's implementation-summary description gave a one-line statement of what shipped without opening every spec. (iteration 3)
- reading the new gate together with the function it feeds exposed the `typed`-mark drop, because the comment above the row tables states the invariant the normalization breaks. Checking the admission order and the band-budget carry against the notes' sentences cleared four surfaces cheaply. (iteration 4)
- running the one suite that writes only to a temp fixture turned a "20 of 20" claim into an observed 21-test result, which is stronger evidence than any file count. Dating the twenty-first test through `git log -S` showed the row was stale at writing time, not merely outrun. (iteration 5)
- filtering fix subjects by user-visible verbs, then checking only the survivors against the notes' text, found three clusters that the feat-only pass could not see. The review-target cluster is the largest, because six separate fixes landed under one unmentioned feature surface. (iteration 6)
- comparing the closing component list against the set of changelogs that gained entries in the window turned a prose claim into a set difference, which found two omissions that the packet and section passes had no reason to look for. (iteration 7)
- reading the adopt function as a refusal sequence and matching each refusal to a notes sentence is a fast way to prove a negative; every guard the notes promise is present and runs before the first write. (iteration 8)
- grouping the findings by classification and checking each against the later evidence produced a table a release manager can act on without re-reading the iterations. The supersession check showed every earlier finding survived, which is the expected shape when each was verified at the time it was written. (iteration 9)
- matching the state log's nine records against the nine narratives and nine deltas proved the artifact set complete without re-reading the research. The registry's counts agreeing with the files is the independent check that the reducer read the same records the gateway wrote. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- counting `def test_` functions cannot reconcile the notes' Python test totals, because the file is a case-table harness rather than one test per function. The numeric claims need a different source (a recorded run or a suite execution). (iteration 1)
- the two advisor suite totals cannot be reconciled from files, because a test count is a run artifact and no run record for HEAD exists in the packet. Trying harder on that number would have consumed the budget without a citable answer. (iteration 2)
- the first unfiltered count made seven planning packets look like shipped work; the packet tree carries research, plan and review commits under the same path, so path-only counting cannot separate them. (iteration 3)
- hunting for a fan-out or frontier defect by inspection produced no finding; those paths carry dense invariant comments and their tests pin the behavior, so a defect there would need a run, which the write boundary forbids. (iteration 4)
- the larger totals need full suite runs, and the notes' 595-file figure has no reproducible file-set definition, so both stayed UNKNOWN. Guessing a file set to make the number match would have produced a false confirmation. (iteration 5)
- a keyword sweep cannot decide coverage on its own; several candidates (`record the resolved model`, `read the node cap budget`) were already described in folded blocks. Each survivor needed a notes-line check. (iteration 6)
- the routing-analysis figure has no committed corpus, so it cannot be checked from files; recording it as UNKNOWN was the only honest outcome. (iteration 7)
- no defect surfaced. The overlay engine carries dense guard comments and a large test suite, so a defect there would need a fixture run that the write boundary forbids. (iteration 8)
- nothing failed; the iteration is a synthesis pass, so its ratio is the simplicity bonus rather than new evidence. (iteration 9)
- nothing failed; the iteration is a confirmation pass, so its ratio is 0.0. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`013-deep-loop-offer-in-hint` as a MISSING.** It is unlisted but its shipped behavior is described by the notes' "The Advisor Offers the Loop With Its Flags" section. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`013-deep-loop-offer-in-hint` as a MISSING.** It is unlisted but its shipped behavior is described by the notes' "The Advisor Offers the Loop With Its Flags" section.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`013-deep-loop-offer-in-hint` as a MISSING.** It is unlisted but its shipped behavior is described by the notes' "The Advisor Offers the Loop With Its Flags" section.

### **A band budget that carries upward.** `carry` is set from the current band's remainder and applied to the next band only. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A band budget that carries upward.** `carry` is set from the current band's remainder and applied to the next band only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A band budget that carries upward.** `carry` is set from the current band's remainder and applied to the next band only.

### **A breaking-change item that no longer holds.** All twenty were checked and hold at HEAD. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A breaking-change item that no longer holds.** All twenty were checked and hold at HEAD.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A breaking-change item that no longer holds.** All twenty were checked and hold at HEAD.

### **A doctor update that cleans before rebuilding.** The phase order puts the cleanup last. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A doctor update that cleans before rebuilding.** The phase order puts the cleanup last.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A doctor update that cleans before rebuilding.** The phase order puts the cleanup last.

### **A fan-out stop that records a live lineage as stopped.** The confirmation loop re-reads the process table and filters survivors on every pass until the grace expires. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A fan-out stop that records a live lineage as stopped.** The confirmation loop re-reads the process table and filters survivors on every pass until the grace expires.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A fan-out stop that records a live lineage as stopped.** The confirmation loop re-reads the process table and filters survivors on every pass until the grace expires.

### **A gate that reads rows by the wrong id.** `_DEEP_LOOP_RUN_ROWS` maps only the bridge id, but the gate runs before `normalize_command_bridge_recommendations`, so that is the id the rows carry at that point; the ordering helper runs after and accepts both ids. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A gate that reads rows by the wrong id.** `_DEEP_LOOP_RUN_ROWS` maps only the bridge id, but the gate runs before `normalize_command_bridge_recommendations`, so that is the id the rows carry at that point; the ordering helper runs after and accepts both ids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A gate that reads rows by the wrong id.** `_DEEP_LOOP_RUN_ROWS` maps only the bridge id, but the gate runs before `normalize_command_bridge_recommendations`, so that is the id the rows carry at that point; the ordering helper runs after and accepts both ids.

### **A missing entry for a listed component.** Every one of the fourteen named components has changelog commits in the window. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A missing entry for a listed component.** Every one of the fourteen named components has changelog commits in the window.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing entry for a listed component.** Every one of the fourteen named components has changelog commits in the window.

### **A missing or duplicated artifact.** Every iteration has exactly one narrative and one delta, and the state log has exactly one record per iteration. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A missing or duplicated artifact.** Every iteration has exactly one narrative and one delta, and the state log has exactly one record per iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing or duplicated artifact.** Every iteration has exactly one narrative and one delta, and the state log has exactly one record per iteration.

### **A pass-evidence off-by-one on a same-millisecond commit.** The window uses an exclusive start and an inclusive end, which is correct for sequential commits; a same-millisecond pair yields an empty window, not a misattributed call. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A pass-evidence off-by-one on a same-millisecond commit.** The window uses an exclusive start and an inclusive end, which is correct for sequential commits; a same-millisecond pair yields an empty window, not a misattributed call.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A pass-evidence off-by-one on a same-millisecond commit.** The window uses an exclusive start and an inclusive end, which is correct for sequential commits; a same-millisecond pair yields an empty window, not a misattributed call.

### **A relayout that leaves a half state.** The restore path covers every move, the manifest write and each relink. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **A relayout that leaves a half state.** The restore path covers every move, the manifest write and each relink.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A relayout that leaves a half state.** The restore path covers every move, the manifest write and each relink.

### **A second sk-git version gap.** `v1.11.14.0` changes only the claim that `create` is idempotent; it is a documentation correction, not user-visible behavior. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A second sk-git version gap.** `v1.11.14.0` changes only the claim that `create` is idempotent; it is a documentation correction, not user-visible behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A second sk-git version gap.** `v1.11.14.0` changes only the claim that `create` is idempotent; it is a documentation correction, not user-visible behavior.

### **A stale registry.** The registry's counts match the iteration files. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: **A stale registry.** The registry's counts match the iteration files.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale registry.** The registry's counts match the iteration files.

### **A wrong cited version.** Both cited versions exist exactly as named. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **A wrong cited version.** Both cited versions exist exactly as named.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A wrong cited version.** Both cited versions exist exactly as named.

### **An adopt path that ships a credential file.** Both the `.env` and the token-named refusals run per file before any copy. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **An adopt path that ships a credential file.** Both the `.env` and the token-named refusals run per file before any copy.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An adopt path that ships a credential file.** Both the `.env` and the token-named refusals run per file before any copy.

### **An adopt that writes outside the overlay folder.** The link guard resolves the source and refuses an escape. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **An adopt that writes outside the overlay folder.** The link guard resolves the source and refuses an escape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An adopt that writes outside the overlay folder.** The link guard resolves the source and refuses an escape.

### **An incomplete cli-orca removal.** All runtime mirrors and live trees are clean. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **An incomplete cli-orca removal.** All runtime mirrors and live trees are clean.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An incomplete cli-orca removal.** All runtime mirrors and live trees are clean.

### **Anchor or component-list drift.** All 63 internal links resolve, and every named component has a release entry. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Anchor or component-list drift.** All 63 internal links resolve, and every named component has a release entry.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Anchor or component-list drift.** All 63 internal links resolve, and every named component has a release entry.

### **Browser pin drift.** Bladebro v4.8.2, bdg 0.6.10, three modes and eight hubs all match. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Browser pin drift.** Bladebro v4.8.2, bdg 0.6.10, three modes and eight hubs all match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Browser pin drift.** Bladebro v4.8.2, bdg 0.6.10, three modes and eight hubs all match.

### **Count drift.** "14 skills" matches the 14 tracked top-level `SKILL.md` files; "seventeen" doctor commands matches the 17 `*.md` files under `.skilled/commands/doctor/`; the `/doctor:setup` target table has exactly 26 rows; `/doctor:skill-advisor` lists 6 targets; the advisor lockfile has 111 packages and the spec-kit lockfile 313, matching the notes' cost block. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Count drift.** "14 skills" matches the 14 tracked top-level `SKILL.md` files; "seventeen" doctor commands matches the 17 `*.md` files under `.skilled/commands/doctor/`; the `/doctor:setup` target table has exactly 26 rows; `/doctor:skill-advisor` lists 6 targets; the advisor lockfile has 111 packages and the spec-kit lockfile 313, matching the notes' cost block.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Count drift.** "14 skills" matches the 14 tracked top-level `SKILL.md` files; "seventeen" doctor commands matches the 17 `*.md` files under `.skilled/commands/doctor/`; the `/doctor:setup` target table has exactly 26 rows; `/doctor:skill-advisor` lists 6 targets; the advisor lockfile has 111 packages and the spec-kit lockfile 313, matching the notes' cost block.

### **Counting the Python scorer tests from source.** The fallback test file has 22 `def test_` functions but runs case tables, so 130 and 138 cannot be reconciled by counting. Deferred to a later iteration with a direct suite run or a test-record source. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Counting the Python scorer tests from source.** The fallback test file has 22 `def test_` functions but runs case tables, so 130 and 138 cannot be reconciled by counting. Deferred to a later iteration with a direct suite run or a test-record source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Counting the Python scorer tests from source.** The fallback test file has 22 `def test_` functions but runs case tables, so 130 and 138 cannot be reconciled by counting. Deferred to a later iteration with a direct suite run or a test-record source.

### **Deep Loop section drift.** Every sampled claim held: `--depth-mode=expansive` and both frontier cap flags are documented in `.skilled/commands/deep/research.md:3,109-111` and `review.md:3,102-104`; the frontier defaults are 3 deep and 6 children; the budget split is 50/35/15; the blocked thresholds are 2 for review and 3 for research (`convergence.cjs:1595`, `deep-review-config.json:23`, `deep-research-config.json:17`); `blockedStop` is emitted (`convergence.cjs:1177`); and the `blocked_stop` row exists (`convergence.cjs:1511`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Deep Loop section drift.** Every sampled claim held: `--depth-mode=expansive` and both frontier cap flags are documented in `.skilled/commands/deep/research.md:3,109-111` and `review.md:3,102-104`; the frontier defaults are 3 deep and 6 children; the budget split is 50/35/15; the blocked thresholds are 2 for review and 3 for research (`convergence.cjs:1595`, `deep-review-config.json:23`, `deep-research-config.json:17`); `blockedStop` is emitted (`convergence.cjs:1177`); and the `blocked_stop` row exists (`convergence.cjs:1511`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Deep Loop section drift.** Every sampled claim held: `--depth-mode=expansive` and both frontier cap flags are documented in `.skilled/commands/deep/research.md:3,109-111` and `review.md:3,102-104`; the frontier defaults are 3 deep and 6 children; the budget split is 50/35/15; the blocked thresholds are 2 for review and 3 for research (`convergence.cjs:1595`, `deep-review-config.json:23`, `deep-research-config.json:17`); `blockedStop` is emitted (`convergence.cjs:1177`); and the `blocked_stop` row exists (`convergence.cjs:1511`).

### **Dispatch section drift.** The 20 MB cap and `ENOBUFS` verdict exist (`executor-audit.ts:1515`, `fanout-run.cjs:5853`); `iterations/iteration-NNN.cost.json` is written with `providerCostUsd` (`dispatch-iteration.cjs:451,472`); and `SPECKIT_ALLOW_HOST_SESSION_EXECUTOR` relaxes only ancestry and env (`executor-audit.ts:42`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Dispatch section drift.** The 20 MB cap and `ENOBUFS` verdict exist (`executor-audit.ts:1515`, `fanout-run.cjs:5853`); `iterations/iteration-NNN.cost.json` is written with `providerCostUsd` (`dispatch-iteration.cjs:451,472`); and `SPECKIT_ALLOW_HOST_SESSION_EXECUTOR` relaxes only ancestry and env (`executor-audit.ts:42`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Dispatch section drift.** The 20 MB cap and `ENOBUFS` verdict exist (`executor-audit.ts:1515`, `fanout-run.cjs:5853`); `iterations/iteration-NNN.cost.json` is written with `providerCostUsd` (`dispatch-iteration.cjs:451,472`); and `SPECKIT_ALLOW_HOST_SESSION_EXECUTOR` relaxes only ancestry and env (`executor-audit.ts:42`).

### **Doctor count drift.** 17 commands, 26 setup rows, 6 advisor targets, 5 install steps and 66 scenarios all match. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Doctor count drift.** 17 commands, 26 setup rows, 6 advisor targets, 5 install steps and 66 scenarios all match.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Doctor count drift.** 17 commands, 26 setup rows, 6 advisor targets, 5 install steps and 66 scenarios all match.

### **Executing an adopt or relayout against a real tree.** Both write outside the lineage directory, which the dispatch forbids; the refusals were read from the code instead. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: **Executing an adopt or relayout against a real tree.** Both write outside the lineage directory, which the dispatch forbids; the refusals were read from the code instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Executing an adopt or relayout against a real tree.** Both write outside the lineage directory, which the dispatch forbids; the refusals were read from the code instead.

### **Fan-Out section drift.** `--status`, `--stop` and `--only-lineage` exist (`fanout-run.cjs:37,1526,2021`); a one-lineage matrix is refused (`fanout-run.cjs:4944`); a native lineage is refused (`fanout-run.cjs:4649`); the stop grace is 2,500 ms (`fanout-run.cjs:1463`); `survivors` is returned (`fanout-run.cjs:1536`); and `provider_cost_usd` is emitted (`fanout-run.cjs:6142`). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Fan-Out section drift.** `--status`, `--stop` and `--only-lineage` exist (`fanout-run.cjs:37,1526,2021`); a one-lineage matrix is refused (`fanout-run.cjs:4944`); a native lineage is refused (`fanout-run.cjs:4649`); the stop grace is 2,500 ms (`fanout-run.cjs:1463`); `survivors` is returned (`fanout-run.cjs:1536`); and `provider_cost_usd` is emitted (`fanout-run.cjs:6142`).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Fan-Out section drift.** `--status`, `--stop` and `--only-lineage` exist (`fanout-run.cjs:37,1526,2021`); a one-lineage matrix is refused (`fanout-run.cjs:4944`); a native lineage is refused (`fanout-run.cjs:4649`); the stop grace is 2,500 ms (`fanout-run.cjs:1463`); `survivors` is returned (`fanout-run.cjs:1536`); and `provider_cost_usd` is emitted (`fanout-run.cjs:6142`).

### **Finding the README-check script behind "79 of 79".** No script in the deep-loop tree reports that count, so the figure stays UNKNOWN. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Finding the README-check script behind "79 of 79".** No script in the deep-loop tree reports that count, so the figure stays UNKNOWN.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Finding the README-check script behind "79 of 79".** No script in the deep-loop tree reports that count, so the figure stays UNKNOWN.

### **OpenCode drift.** The major-2-only rule, the two-mode helper, the retired launcher names, the 18-subcommand shim and the v2 battery workflow all match HEAD. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **OpenCode drift.** The major-2-only rule, the two-mode helper, the retired launcher names, the 18-subcommand shim and the v2 battery workflow all match HEAD.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **OpenCode drift.** The major-2-only rule, the two-mode helper, the retired launcher names, the 18-subcommand shim and the v2 battery workflow all match HEAD.

### **Overlay layout drift.** The notes' layout, relayout, sibling-folder, audit and cache claims match the engine and its reference doc line for line. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Overlay layout drift.** The notes' layout, relayout, sibling-folder, audit and cache claims match the engine and its reference doc line for line.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Overlay layout drift.** The notes' layout, relayout, sibling-folder, audit and cache claims match the engine and its reference doc line for line.

### **Pinned-file-count drift.** The 187-file figure is explicitly pinned to `46465394d97` and matches that commit. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Pinned-file-count drift.** The 187-file figure is explicitly pinned to `46465394d97` and matches that commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Pinned-file-count drift.** The 187-file figure is explicitly pinned to `46465394d97` and matches that commit.

### **Plugin-count drift.** The plugin count is exactly 20. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Plugin-count drift.** The plugin count is exactly 20.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Plugin-count drift.** The plugin count is exactly 20.

### **Reading every one of the 165 `fix(system-deep-loop)` commits in full.** The subject filter plus the notes' folded blocks reduced the set to a handful of clusters; opening all of them would have consumed the budget without a better answer. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Reading every one of the 165 `fix(system-deep-loop)` commits in full.** The subject filter plus the notes' folded blocks reduced the set to a handful of clusters; opening all of them would have consumed the budget without a better answer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reading every one of the 165 `fix(system-deep-loop)` commits in full.** The subject filter plus the notes' folded blocks reduced the set to a handful of clusters; opening all of them would have consumed the budget without a better answer.

### **Reconciling 2,450 and 3,557 advisor suite totals.** The rows are labelled differently ("Advisor runtime suite" vs "with the loop offers"), so they may be two suite configurations rather than a contradiction. No HEAD run exists in the packet to settle it; recorded as an observation, not a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Reconciling 2,450 and 3,557 advisor suite totals.** The rows are labelled differently ("Advisor runtime suite" vs "with the loop offers"), so they may be two suite configurations rather than a contradiction. No HEAD run exists in the packet to settle it; recorded as an observation, not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reconciling 2,450 and 3,557 advisor suite totals.** The rows are labelled differently ("Advisor runtime suite" vs "with the loop offers"), so they may be two suite configurations rather than a contradiction. No HEAD run exists in the packet to settle it; recorded as an observation, not a finding.

### **Removal drift.** `--allow-single-lineage` has no remaining reference; `opencode2` has no reference in the deep-loop runtime; `.skilled/skills/cli-orca` is gone; `dualPlugin` is gone from `v2-bridge.js` (`definePlugin` at line 327); `nativeDual` is gone from `plugin-inventory.json` (`selfRegistered` instead); `.skilled/manual-testing-playbook/` is gone. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Removal drift.** `--allow-single-lineage` has no remaining reference; `opencode2` has no reference in the deep-loop runtime; `.skilled/skills/cli-orca` is gone; `dualPlugin` is gone from `v2-bridge.js` (`definePlugin` at line 327); `nativeDual` is gone from `plugin-inventory.json` (`selfRegistered` instead); `.skilled/manual-testing-playbook/` is gone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Removal drift.** `--allow-single-lineage` has no remaining reference; `opencode2` has no reference in the deep-loop runtime; `.skilled/skills/cli-orca` is gone; `dualPlugin` is gone from `v2-bridge.js` (`definePlugin` at line 327); `nativeDual` is gone from `plugin-inventory.json` (`selfRegistered` instead); `.skilled/manual-testing-playbook/` is gone.

### **Reproducing the "2 of 26 plain loop asks" routing-analysis figure.** No committed corpus carries that slice, so the number stays UNKNOWN rather than contradicted. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Reproducing the "2 of 26 plain loop asks" routing-analysis figure.** No committed corpus carries that slice, so the number stays UNKNOWN rather than contradicted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reproducing the "2 of 26 plain loop asks" routing-analysis figure.** No committed corpus carries that slice, so the number stays UNKNOWN rather than contradicted.

### **Running the advisor or deep-loop suites to get HEAD counts.** Out of scope: a suite run writes test artifacts outside the lineage directory, which the dispatch forbids. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Running the advisor or deep-loop suites to get HEAD counts.** Out of scope: a suite run writes test artifacts outside the lineage directory, which the dispatch forbids.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Running the advisor or deep-loop suites to get HEAD counts.** Out of scope: a suite run writes test artifacts outside the lineage directory, which the dispatch forbids.

### **Running the advisor suite or the Python fallback to observe the gate.** Both would write outside the lineage directory (a test artifact or a SQLite file), which the dispatch forbids. The gate's behavior was established by reading the code instead. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Running the advisor suite or the Python fallback to observe the gate.** Both would write outside the lineage directory (a test artifact or a SQLite file), which the dispatch forbids. The gate's behavior was established by reading the code instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Running the advisor suite or the Python fallback to observe the gate.** Both would write outside the lineage directory (a test artifact or a SQLite file), which the dispatch forbids. The gate's behavior was established by reading the code instead.

### **Running the advisor, deep-loop or doctor suites to settle their totals.** Each writes test artifacts or coverage databases outside the lineage directory, which the dispatch forbids. Those totals stay UNKNOWN with the exact command that would settle them. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Running the advisor, deep-loop or doctor suites to settle their totals.** Each writes test artifacts or coverage databases outside the lineage directory, which the dispatch forbids. Those totals stay UNKNOWN with the exact command that would settle them.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Running the advisor, deep-loop or doctor suites to settle their totals.** Each writes test artifacts or coverage databases outside the lineage directory, which the dispatch forbids. Those totals stay UNKNOWN with the exact command that would settle them.

### **Shared-case drift.** 368 matches. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Shared-case drift.** 368 matches.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Shared-case drift.** 368 matches.

### **The 595-file figure as a tree count.** It does not describe the whole tree, but the notes present it as a quality-gate scope, which the gate computes over a selected file set; calling it drift would be unsupported. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The 595-file figure as a tree count.** It does not describe the whole tree, but the notes present it as a quality-gate scope, which the gate computes over a selected file set; calling it drift would be unsupported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 595-file figure as a tree count.** It does not describe the whole tree, but the notes present it as a quality-gate scope, which the gate computes over a selected file set; calling it drift would be unsupported.

### **The eight unlisted packets that shipped nothing.** `005-skill-readability-refinement`, `001-hub-routing-quality`, `003-changelog-system`, `007-alignment-lane-runner`, `001-headless-bots-first-build`, `002-session-handover-loop` and `mcp-code-mode` have only `docs(specs)`, `chore(specs)` or `refactor(specs)` commits in the window, so their absence from the notes is correct. `001-headless-bots-first-build`'s own latest child states "Planned, not started." -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The eight unlisted packets that shipped nothing.** `005-skill-readability-refinement`, `001-hub-routing-quality`, `003-changelog-system`, `007-alignment-lane-runner`, `001-headless-bots-first-build`, `002-session-handover-loop` and `mcp-code-mode` have only `docs(specs)`, `chore(specs)` or `refactor(specs)` commits in the window, so their absence from the notes is correct. `001-headless-bots-first-build`'s own latest child states "Planned, not started."
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The eight unlisted packets that shipped nothing.** `005-skill-readability-refinement`, `001-hub-routing-quality`, `003-changelog-system`, `007-alignment-lane-runner`, `001-headless-bots-first-build`, `002-session-handover-loop` and `mcp-code-mode` have only `docs(specs)`, `chore(specs)` or `refactor(specs)` commits in the window, so their absence from the notes is correct. `001-headless-bots-first-build`'s own latest child states "Planned, not started."

### **The Pi fix as a DRIFT.** It restores a default the notes never state, so it is a MISSING entry rather than a contradiction. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The Pi fix as a DRIFT.** It restores a default the notes never state, so it is a MISSING entry rather than a contradiction.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The Pi fix as a DRIFT.** It restores a default the notes never state, so it is a MISSING entry rather than a contradiction.

### **The sk-doc hub-vocabulary failure as a separate BUG.** The commit is itself the fix; at HEAD the router and the trigger line agree, so no defect remains. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **The sk-doc hub-vocabulary failure as a separate BUG.** The commit is itself the fix; at HEAD the router and the trigger line agree, so no defect remains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The sk-doc hub-vocabulary failure as a separate BUG.** The commit is itself the fix; at HEAD the router and the trigger line agree, so no defect remains.

### **Treating every `fix` subject as a MISSING candidate.** Most fix subjects restate behavior the notes already describe in a folded "Smaller fixes" block; only three clusters survived the check against the notes' text. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Treating every `fix` subject as a MISSING candidate.** Most fix subjects restate behavior the notes already describe in a folded "Smaller fixes" block; only three clusters survived the check against the notes' text.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating every `fix` subject as a MISSING candidate.** Most fix subjects restate behavior the notes already describe in a folded "Smaller fixes" block; only three clusters survived the check against the notes' text.

### **Treating the 10-folder "Spec folders" block as the coverage list.** It lists 10 packets while `recent-packets.txt` holds 21, but the block is metadata, not a coverage claim; the packet-coverage question needs the per-packet check scheduled for a later iteration. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Treating the 10-folder "Spec folders" block as the coverage list.** It lists 10 packets while `recent-packets.txt` holds 21, but the block is metadata, not a coverage claim; the packet-coverage question needs the per-packet check scheduled for a later iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the 10-folder "Spec folders" block as the coverage list.** It lists 10 packets while `recent-packets.txt` holds 21, but the block is metadata, not a coverage claim; the packet-coverage question needs the per-packet check scheduled for a later iteration.

### **Using packet commit counts as a shipping signal without filtering commit types.** The first count said all 21 were touched and suggested several shipped; filtering `docs`/`chore`/`merge` reduced that to nine packets with shipped work. The unfiltered count would have produced false MISSING findings. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Using packet commit counts as a shipping signal without filtering commit types.** The first count said all 21 were touched and suggested several shipped; filtering `docs`/`chore`/`merge` reduced that to nine packets with shipped work. The unfiltered count would have produced false MISSING findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using packet commit counts as a shipping signal without filtering commit types.** The first count said all 21 were touched and suggested several shipped; filtering `docs`/`chore`/`merge` reduced that to nine packets with shipped work. The unfiltered count would have produced false MISSING findings.

### Large suite totals (advisor 2,450/3,557, deep-loop 4,039, doctor 1,673+19) and the live cost figures remain UNKNOWN because reproducing them needs a suite run outside the lineage write boundary. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Large suite totals (advisor 2,450/3,557, deep-loop 4,039, doctor 1,673+19) and the live cost figures remain UNKNOWN because reproducing them needs a suite run outside the lineage write boundary.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Large suite totals (advisor 2,450/3,557, deep-loop 4,039, doctor 1,673+19) and the live cost figures remain UNKNOWN because reproducing them needs a suite run outside the lineage write boundary.

### The "2 of 26 plain loop asks" analysis figure has no committed corpus and stays UNKNOWN. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The "2 of 26 plain loop asks" analysis figure has no committed corpus and stays UNKNOWN.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The "2 of 26 plain loop asks" analysis figure has no committed corpus and stays UNKNOWN.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- **Count drift.** "14 skills" matches the 14 tracked top-level `SKILL.md` files; "seventeen" doctor commands matches the 17 `*.md` files under `.skilled/commands/doctor/`; the `/doctor:setup` target table has exactly 26 rows; `/doctor:skill-advisor` lists 6 targets; the advisor lockfile has 111 packages and the spec-kit lockfile 313, matching the notes' cost block. (iteration 1)
- **Counting the Python scorer tests from source.** The fallback test file has 22 `def test_` functions but runs case tables, so 130 and 138 cannot be reconciled by counting. Deferred to a later iteration with a direct suite run or a test-record source. (iteration 1)
- **Deep Loop section drift.** Every sampled claim held: `--depth-mode=expansive` and both frontier cap flags are documented in `.skilled/commands/deep/research.md:3,109-111` and `review.md:3,102-104`; the frontier defaults are 3 deep and 6 children; the budget split is 50/35/15; the blocked thresholds are 2 for review and 3 for research (`convergence.cjs:1595`, `deep-review-config.json:23`, `deep-research-config.json:17`); `blockedStop` is emitted (`convergence.cjs:1177`); and the `blocked_stop` row exists (`convergence.cjs:1511`). (iteration 1)
- **Dispatch section drift.** The 20 MB cap and `ENOBUFS` verdict exist (`executor-audit.ts:1515`, `fanout-run.cjs:5853`); `iterations/iteration-NNN.cost.json` is written with `providerCostUsd` (`dispatch-iteration.cjs:451,472`); and `SPECKIT_ALLOW_HOST_SESSION_EXECUTOR` relaxes only ancestry and env (`executor-audit.ts:42`). (iteration 1)
- **Fan-Out section drift.** `--status`, `--stop` and `--only-lineage` exist (`fanout-run.cjs:37,1526,2021`); a one-lineage matrix is refused (`fanout-run.cjs:4944`); a native lineage is refused (`fanout-run.cjs:4649`); the stop grace is 2,500 ms (`fanout-run.cjs:1463`); `survivors` is returned (`fanout-run.cjs:1536`); and `provider_cost_usd` is emitted (`fanout-run.cjs:6142`). (iteration 1)
- **Removal drift.** `--allow-single-lineage` has no remaining reference; `opencode2` has no reference in the deep-loop runtime; `.skilled/skills/cli-orca` is gone; `dualPlugin` is gone from `v2-bridge.js` (`definePlugin` at line 327); `nativeDual` is gone from `plugin-inventory.json` (`selfRegistered` instead); `.skilled/manual-testing-playbook/` is gone. (iteration 1)
- **Treating the 10-folder "Spec folders" block as the coverage list.** It lists 10 packets while `recent-packets.txt` holds 21, but the block is metadata, not a coverage claim; the packet-coverage question needs the per-packet check scheduled for a later iteration. (iteration 1)
- **Anchor or component-list drift.** All 63 internal links resolve, and every named component has a release entry. (iteration 2)
- **Browser pin drift.** Bladebro v4.8.2, bdg 0.6.10, three modes and eight hubs all match. (iteration 2)
- **Doctor count drift.** 17 commands, 26 setup rows, 6 advisor targets, 5 install steps and 66 scenarios all match. (iteration 2)
- **OpenCode drift.** The major-2-only rule, the two-mode helper, the retired launcher names, the 18-subcommand shim and the v2 battery workflow all match HEAD. (iteration 2)
- **Overlay layout drift.** The notes' layout, relayout, sibling-folder, audit and cache claims match the engine and its reference doc line for line. (iteration 2)
- **Reconciling 2,450 and 3,557 advisor suite totals.** The rows are labelled differently ("Advisor runtime suite" vs "with the loop offers"), so they may be two suite configurations rather than a contradiction. No HEAD run exists in the packet to settle it; recorded as an observation, not a finding. (iteration 2)
- **Running the advisor or deep-loop suites to get HEAD counts.** Out of scope: a suite run writes test artifacts outside the lineage directory, which the dispatch forbids. (iteration 2)
- **`013-deep-loop-offer-in-hint` as a MISSING.** It is unlisted but its shipped behavior is described by the notes' "The Advisor Offers the Loop With Its Flags" section. (iteration 3)
- **A second sk-git version gap.** `v1.11.14.0` changes only the claim that `create` is idempotent; it is a documentation correction, not user-visible behavior. (iteration 3)
- **The eight unlisted packets that shipped nothing.** `005-skill-readability-refinement`, `001-hub-routing-quality`, `003-changelog-system`, `007-alignment-lane-runner`, `001-headless-bots-first-build`, `002-session-handover-loop` and `mcp-code-mode` have only `docs(specs)`, `chore(specs)` or `refactor(specs)` commits in the window, so their absence from the notes is correct. `001-headless-bots-first-build`'s own latest child states "Planned, not started." (iteration 3)
- **Using packet commit counts as a shipping signal without filtering commit types.** The first count said all 21 were touched and suggested several shipped; filtering `docs`/`chore`/`merge` reduced that to nine packets with shipped work. The unfiltered count would have produced false MISSING findings. (iteration 3)
- **A band budget that carries upward.** `carry` is set from the current band's remainder and applied to the next band only. (iteration 4)
- **A fan-out stop that records a live lineage as stopped.** The confirmation loop re-reads the process table and filters survivors on every pass until the grace expires. (iteration 4)
- **A gate that reads rows by the wrong id.** `_DEEP_LOOP_RUN_ROWS` maps only the bridge id, but the gate runs before `normalize_command_bridge_recommendations`, so that is the id the rows carry at that point; the ordering helper runs after and accepts both ids. (iteration 4)
- **A pass-evidence off-by-one on a same-millisecond commit.** The window uses an exclusive start and an inclusive end, which is correct for sequential commits; a same-millisecond pair yields an empty window, not a misattributed call. (iteration 4)
- **An incomplete cli-orca removal.** All runtime mirrors and live trees are clean. (iteration 4)
- **Running the advisor suite or the Python fallback to observe the gate.** Both would write outside the lineage directory (a test artifact or a SQLite file), which the dispatch forbids. The gate's behavior was established by reading the code instead. (iteration 4)
- **Finding the README-check script behind "79 of 79".** No script in the deep-loop tree reports that count, so the figure stays UNKNOWN. (iteration 5)
- **Pinned-file-count drift.** The 187-file figure is explicitly pinned to `46465394d97` and matches that commit. (iteration 5)
- **Plugin-count drift.** The plugin count is exactly 20. (iteration 5)
- **Running the advisor, deep-loop or doctor suites to settle their totals.** Each writes test artifacts or coverage databases outside the lineage directory, which the dispatch forbids. Those totals stay UNKNOWN with the exact command that would settle them. (iteration 5)
- **Shared-case drift.** 368 matches. (iteration 5)
- **The 595-file figure as a tree count.** It does not describe the whole tree, but the notes present it as a quality-gate scope, which the gate computes over a selected file set; calling it drift would be unsupported. (iteration 5)
- **Reading every one of the 165 `fix(system-deep-loop)` commits in full.** The subject filter plus the notes' folded blocks reduced the set to a handful of clusters; opening all of them would have consumed the budget without a better answer. (iteration 6)
- **The Pi fix as a DRIFT.** It restores a default the notes never state, so it is a MISSING entry rather than a contradiction. (iteration 6)
- **The sk-doc hub-vocabulary failure as a separate BUG.** The commit is itself the fix; at HEAD the router and the trigger line agree, so no defect remains. (iteration 6)
- **Treating every `fix` subject as a MISSING candidate.** Most fix subjects restate behavior the notes already describe in a folded "Smaller fixes" block; only three clusters survived the check against the notes' text. (iteration 6)
- **A breaking-change item that no longer holds.** All twenty were checked and hold at HEAD. (iteration 7)
- **A missing entry for a listed component.** Every one of the fourteen named components has changelog commits in the window. (iteration 7)
- **A wrong cited version.** Both cited versions exist exactly as named. (iteration 7)
- **Reproducing the "2 of 26 plain loop asks" routing-analysis figure.** No committed corpus carries that slice, so the number stays UNKNOWN rather than contradicted. (iteration 7)
- **A doctor update that cleans before rebuilding.** The phase order puts the cleanup last. (iteration 8)
- **A relayout that leaves a half state.** The restore path covers every move, the manifest write and each relink. (iteration 8)
- **An adopt path that ships a credential file.** Both the `.env` and the token-named refusals run per file before any copy. (iteration 8)
- **An adopt that writes outside the overlay folder.** The link guard resolves the source and refuses an escape. (iteration 8)
- **Executing an adopt or relayout against a real tree.** Both write outside the lineage directory, which the dispatch forbids; the refusals were read from the code instead. (iteration 8)
- Large suite totals (advisor 2,450/3,557, deep-loop 4,039, doctor 1,673+19) and the live cost figures remain UNKNOWN because reproducing them needs a suite run outside the lineage write boundary. (iteration 9)
- The "2 of 26 plain loop asks" analysis figure has no committed corpus and stays UNKNOWN. (iteration 9)
- **A missing or duplicated artifact.** Every iteration has exactly one narrative and one delta, and the state log has exactly one record per iteration. (iteration 10)
- **A stale registry.** The registry's counts match the iteration files. (iteration 10)

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
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

- Release notes: `.skilled/changelog/skilled/v4.2.0.0.md`, 926 lines, not tagged yet.
- Window: `v4.1.0.0..HEAD`, 1084 non-merge commits, listed as `hash date subject` in `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/window-commits.txt`.
- Recent packets: 21 spec folders in `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/scratch/recent-packets.txt`.
- HEAD at init: `c75200c504a`.

### Bounded Context Snapshot

- Source pointers: `.skilled/changelog/skilled/`, `.skilled/commands/deep/`, `.skilled/skills/system-deep-loop/`, `.skilled/skills/system-skill-advisor/`, `.skilled/agents/`.
- Integration points: release-note claims point at flags, paths, counts and defaults in those trees.
- Constraints and risks: the window is large; a commit-to-claim mapping is the only way to keep findings citable.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Convergence threshold: 0.05
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `new`, `resume`, `restart`, `completed-continue` through `--extend=N` and `--extend-minutes=M` (live)
- Deferred lifecycle branch: `fork` (not runtime-wired)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A pivot lineage
- Question injection surface: `specs/system-speckit/runtime-and-release/007-v4-2-0-0-release-audit-research/research/lineages/devin/inbox.jsonl`
- Question conflict owner: reducer registry
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Current generation: 1
- Started: 2026-11-25T08:05:26Z
