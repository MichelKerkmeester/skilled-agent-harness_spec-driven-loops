---
title: Deep Research Strategy - v4.2.0.0 Release Notes Audit - codex
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
version: 1.14.3.0
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
- `origin`: one of `angle-bank`, `analyst-strategy`, `frontier`, `operator`, or `legacy-import`
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
Audit the Skilled v4.2.0.0 release notes against the work shipped since v4.1.0.0, and report what is missing, what has drifted and what is broken.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which commits in the window change user-visible behavior with no entry in the notes? Check each notes section in turn: Deep Loop, Fan-Out Runs, Dispatch and Safety, Skill Advisor, Installs and Overlays, OpenCode, Browser Use, Skills and Worktrees, How It Was Checked, Upgrade Notes.
- [ ] Which of the 21 recent packets shipped work the notes do not cover, or describe the shipped work differently from the notes?
- [ ] Which concrete claims in the notes (flags, paths, counts, test results, removed items) no longer match HEAD, including work that landed after a section was written?
- [ ] Which changes in the window introduced a bug, a dead reference or a broken cross-link?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
Editing the release notes, fixing defects, tagging or publishing the release, and auditing commits outside v4.1.0.0..HEAD or packets outside the supplied 21-folder list.

---

## 5. STOP CONDITIONS
Stop at legal convergence or iteration 10. Halt on missing or corrupt lineage state, a refused gateway append, or a write path outside this lineage.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- commit diffs followed by current code reads distinguished the added behavior from the adjacent review wording. (iteration 1)
- following the candidate change into the executable identity field tied it to the already-documented finished-lineage refusal. (iteration 2)
- checking the exit-code producers directly resolved whether the fan-out exit-3 note conflicts with the single-dispatch exit-64 behavior. (iteration 3)
- the recent packet summary stated the fallback exception explicitly, and the current Python gate showed the exact branch that implements it. (iteration 4)
- Reading the feature commit and current serializer together exposed a formatting behavior absent from the notes; the current reserved-path predicate plus the packet's recorded limitation confirmed the case-variant defect. (iteration 5)
- Comparing the late session-handover commit with current receiver behavior and searching the full release notes showed its linked-worktree goal carry is not mentioned, while direct source reads matched the explicit OpenCode claims. (iteration 6)
- Reading both the commit rationale and current compiled/runtime code distinguished two user-visible routing changes from the broader hub-routing description. (iteration 7)
- Comparing the recent packet's implementation summary with the current provisioning script separated the new skill-graph step from the dependency install behavior already named in the global notes. (iteration 8)
- Comparing the top-level install command with the package-specific verified installer revealed a concrete instruction mismatch; checking the committed file mode exposed a direct-execution regression that a shell-syntax read would miss. (iteration 9)
- following packet implementation summaries to their current source paths exposed three behavior changes that the aggregate note's component list did not describe. (iteration 10)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- a narrow diff path initially missed workflow/runtime changes because the commit did not touch the research mode folder. (iteration 1)
- broad fan-out keyword searches return many frontier changes; section-by-section matching was needed to isolate a new behavior. (iteration 2)
- broad executor-symbol searches returned many unrelated safety paths; following the named note claims was more precise. (iteration 3)
- none; commit, source and note evidence aligned. (iteration 4)
- A broad keyword scan was noisy because the overlay engine has many small follow-up commits; comparing the nearest note claims to focused current predicates and writers gave a clearer boundary. (iteration 5)
- A broad retired-name search was dominated by historical changelogs and benchmark artifacts; filtering to current runtime files and note claims was more useful. (iteration 6)
- None. (iteration 7)
- None. (iteration 8)
- Test-suite totals could not be revalidated without executing tests; they remain attributed to their recorded historical runs. (iteration 9)
- the local link scan is limited to Markdown targets, and this pass did not establish full coverage of the 1,084-commit window or all 21 packets. (iteration 10)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A full claim that all 1,084 commits and every feature in the 21 recent packets were compared line by line is not supported by the bounded section and packet checks completed here. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: A full claim that all 1,084 commits and every feature in the 21 recent packets were compared line by line is not supported by the bounded section and packet checks completed here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A full claim that all 1,084 commits and every feature in the 21 recent packets were compared line by line is not supported by the bounded section and packet checks completed here.

### Commit 0fde65e7b6989905abfc4498319d33058e62aad6 refines timestamp and retry evidence used by the flagged-pass feature already named in the notes at line 281; no separate contradiction was confirmed. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Commit 0fde65e7b6989905abfc4498319d33058e62aad6 refines timestamp and retry evidence used by the flagged-pass feature already named in the notes at line 281; no separate contradiction was confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Commit 0fde65e7b6989905abfc4498319d33058e62aad6 refines timestamp and retry evidence used by the flagged-pass feature already named in the notes at line 281; no separate contradiction was confirmed.

### No current BUG was confirmed in the added graph-scan path during this read-only pass. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No current BUG was confirmed in the added graph-scan path during this read-only pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No current BUG was confirmed in the added graph-scan path during this read-only pass.

### No evidence from this pass changes the classifications of findings recorded in iterations 1-9. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: No evidence from this pass changes the classifications of findings recorded in iterations 1-9.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No evidence from this pass changes the classifications of findings recorded in iterations 1-9.

### None. The fan-out commit scan produced a current executable-identity behavior change that can be tied to the existing finished-lineage note. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: None. The fan-out commit scan produced a current executable-identity behavior change that can be tied to the existing finished-lineage note.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The fan-out commit scan produced a current executable-identity behavior change that can be tied to the existing finished-lineage note.

### None. The initial path mismatch was corrected with the commit's complete relevant file set. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: None. The initial path mismatch was corrected with the commit's complete relevant file set.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. The initial path mismatch was corrected with the commit's complete relevant file set.

### The direct salvage-event JSONL append was excluded: blame attributes it to a June 2026 change, before this release window. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The direct salvage-event JSONL append was excluded: blame attributes it to a June 2026 change, before this release window.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The direct salvage-event JSONL append was excluded: blame attributes it to a June 2026 change, before this release window.

### The documented 14 top-level skill count and the worktree dependency-walk behavior match current files. The suite totals in How It Was Checked are recorded as historical run results; this read-only pass did not establish a contradiction with those past runs. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The documented 14 top-level skill count and the worktree dependency-walk behavior match current files. The suite totals in How It Was Checked are recorded as historical run results; this read-only pass did not establish a contradiction with those past runs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The documented 14 top-level skill count and the worktree dependency-walk behavior match current files. The suite totals in How It Was Checked are recorded as historical run results; this read-only pass did not establish a contradiction with those past runs.

### The existing note's claim that Skilled ships 14 skills still matches the 14 top-level skill manifests. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The existing note's claim that Skilled ships 14 skills still matches the 14 top-level skill manifests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The existing note's claim that Skilled ships 14 skills still matches the 14 top-level skill manifests.

### The first path-scoped commit read looked only under the mode packet. The relevant change was in the workflow and runtime files, which the full commit diff confirmed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The first path-scoped commit read looked only under the mode packet. The relevant change was in the workflow and runtime files, which the full commit diff confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The first path-scoped commit read looked only under the mode packet. The relevant change was in the workflow and runtime files, which the full commit diff confirmed.

### The nearest-lockfile dependency walk described at release-note lines 744-748 matches the current provisioning code; no separate DRIFT was confirmed. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: The nearest-lockfile dependency walk described at release-note lines 744-748 matches the current provisioning code; no separate DRIFT was confirmed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The nearest-lockfile dependency walk described at release-note lines 744-748 matches the current provisioning code; no separate DRIFT was confirmed.

### The package-lockfile counts still match the notes: 111 advisor dependencies and 313 system-spec-kit dependencies, excluding each lockfile's root package. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The package-lockfile counts still match the notes: 111 advisor dependencies and 313 system-spec-kit dependencies, excluding each lockfile's root package.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The package-lockfile counts still match the notes: 111 advisor dependencies and 313 system-spec-kit dependencies, excluding each lockfile's root package.

### The release-note claim that a finished lineage from another topic or executor refuses the whole run is consistent with current code; the narrower unreadable-executable identity safeguard is omitted, not contradictory. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: The release-note claim that a finished lineage from another topic or executor refuses the whole run is consistent with current code; the narrower unreadable-executable identity safeguard is omitted, not contradictory.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The release-note claim that a finished lineage from another topic or executor refuses the whole run is consistent with current code; the narrower unreadable-executable identity safeguard is omitted, not contradictory.

### The release-note statement that a review stops on `frontier_drained` is true for review. It is not a contradiction; the omitted research fan-out case is classified MISSING. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The release-note statement that a review stops on `frontier_drained` is true for review. It is not a contradiction; the omitted research fan-out case is classified MISSING.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The release-note statement that a review stops on `frontier_drained` is true for review. It is not a contradiction; the omitted research fan-out case is classified MISSING.

### The static scan found no missing local Markdown files or anchors in the release-note document. This scan does not verify arbitrary command or filesystem paths. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: The static scan found no missing local Markdown files or anchors in the release-note document. This scan does not verify arbitrary command or filesystem paths.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The static scan found no missing local Markdown files or anchors in the release-note document. This scan does not verify arbitrary command or filesystem paths.

### The upgraded script paths for residue cleanup, OpenCode setup, Bladebro installation, and native-module rebuild exist at their current documented owners. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: The upgraded script paths for residue cleanup, OpenCode setup, Bladebro installation, and native-module rebuild exist at their current documented owners.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The upgraded script paths for residue cleanup, OpenCode setup, Bladebro installation, and native-module rebuild exist at their current documented owners.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- None. The initial path mismatch was corrected with the commit's complete relevant file set. (iteration 1)
- The first path-scoped commit read looked only under the mode packet. The relevant change was in the workflow and runtime files, which the full commit diff confirmed. (iteration 1)
- The release-note statement that a review stops on `frontier_drained` is true for review. It is not a contradiction; the omitted research fan-out case is classified MISSING. (iteration 1)
- Commit 0fde65e7b6989905abfc4498319d33058e62aad6 refines timestamp and retry evidence used by the flagged-pass feature already named in the notes at line 281; no separate contradiction was confirmed. (iteration 2)
- None. The fan-out commit scan produced a current executable-identity behavior change that can be tied to the existing finished-lineage note. (iteration 2)
- The direct salvage-event JSONL append was excluded: blame attributes it to a June 2026 change, before this release window. (iteration 2)
- The release-note claim that a finished lineage from another topic or executor refuses the whole run is consistent with current code; the narrower unreadable-executable identity safeguard is omitted, not contradictory. (iteration 2)
- No current BUG was confirmed in the added graph-scan path during this read-only pass. (iteration 8)
- The existing note's claim that Skilled ships 14 skills still matches the 14 top-level skill manifests. (iteration 8)
- The nearest-lockfile dependency walk described at release-note lines 744-748 matches the current provisioning code; no separate DRIFT was confirmed. (iteration 8)
- The documented 14 top-level skill count and the worktree dependency-walk behavior match current files. The suite totals in How It Was Checked are recorded as historical run results; this read-only pass did not establish a contradiction with those past runs. (iteration 9)
- The package-lockfile counts still match the notes: 111 advisor dependencies and 313 system-spec-kit dependencies, excluding each lockfile's root package. (iteration 9)
- The upgraded script paths for residue cleanup, OpenCode setup, Bladebro installation, and native-module rebuild exist at their current documented owners. (iteration 9)
- A full claim that all 1,084 commits and every feature in the 21 recent packets were compared line by line is not supported by the bounded section and packet checks completed here. (iteration 10)
- No evidence from this pass changes the classifications of findings recorded in iterations 1-9. (iteration 10)
- The static scan found no missing local Markdown files or anchors in the release-note document. This scan does not verify arbitrary command or filesystem paths. (iteration 10)

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
The max-iteration cap ends this run. If the audit is extended, verify feature-level coverage for the still-unconfirmed recent packets, including sk-doc readability and hub-routing work, the changelog-system packet, ad...

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
The read-only inputs are the 926-line v4.2.0.0 release note, the supplied 1,084 non-merge commit list for v4.1.0.0..HEAD, and the supplied 21 recently touched packets. The parent spec defines MISSING, DRIFT, and BUG and requires a commit hash, source file line, and related release-note line for each finding. A fixed-string prior-context search found existing research setup in the sibling Devin lineage; its findings are not treated as verified evidence. The workflow prescribes an external temporary pattern file and spec.md writeback, both outside the authorized lineage, so those actions are skipped and the scope conflict will be recorded in iteration 1.

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

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
- Question injection surface: `{spec_folder}/research/inbox.jsonl`
- Question conflict owner: reducer registry; `question_conflict` events surface inbox/registry disagreements for operator decision
- Canonical pause sentinel: `research/.deep-research-pause`
- Capability matrix: `.skilled/skills/system-deep-loop/deep-research/assets/runtime-capabilities.json`
- Capability matrix doc: `.skilled/skills/system-deep-loop/deep-research/references/guides/capability-matrix.md`
- Capability resolver: `.skilled/skills/system-deep-loop/deep-research/scripts/runtime-capabilities.cjs`
- Current generation: 1
- Started: 2026-11-25T08:10:18Z
