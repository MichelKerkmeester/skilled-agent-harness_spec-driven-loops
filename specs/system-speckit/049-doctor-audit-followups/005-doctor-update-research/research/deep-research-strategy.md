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
Is /doctor:update perfected? Audit the whole /doctor:update surface end to end: the router .skilled/commands/doctor/update.md, the workflows doctor-update-check.yaml, doctor-update-align.yaml and doctor-update-apply.yaml, doctor-update-presentation.txt, the engine .skilled/commands/doctor/scripts/release-update.cjs and its tests. Find every remaining defect, gap, unsafe path and drift: workflow promises the engine does not keep, engine behaviour the workflows do not describe, real operator scenarios that break (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback, customized skills), sk-create-command contract violations, missing tests. Rank the fixes that would make it perfect. Ground every claim in file and line evidence from this repository.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [x] Q1: Does each workflow (check, align, apply) promise only what release-update.cjs actually does: flags, exit codes, outputs, unit keys, locking, rollback?
- [x] Q2: Does release-update.cjs behave correctly in real operator scenarios (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback), and does a test cover each?
- [x] Q3: Do update.md and doctor-update-presentation.txt meet the sk-create-command contract (thin router, presentation split, approval gates, dry-run, rollback), and do they agree with the workflows?
- [x] Q4: Is customization handling sound end to end: base recording, three-way merge, provenance, hashes; align never writes skill bodies; apply applies only accepted decisions?
- [x] Q5: What else blocks a safe end-to-end update for an operator (install and sync scripts, post-apply rebuild and reindex, docs, recovery), ranked by severity?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Fixing anything. The run is read-only outside research/.
- The other doctor commands, whose scripts phase 004 covered.
- Re-deciding the command split settled by the 048/003-update research.

---

## 5. STOP CONDITIONS
- Stop policy is max-iterations: all 6 iterations run. Iterations 1-5 use cli-codex gpt-6-luna (max, fast). Iteration 6 uses a fresh Claude Opus 5.5 at xhigh as an independent pass over the same questions.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
- Q1: Does each workflow (check, align, apply) promise only what release-update.cjs actually does: flags, exit codes, outputs, unit keys, locking, rollback?
- Q2: Does release-update.cjs behave correctly in real operator scenarios (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback), and does a test cover each?
- Q3: Do update.md and doctor-update-presentation.txt meet the sk-create-command contract (thin router, presentation split, approval gates, dry-run, rollback), and do they agree with the workflows?
- Q4: Is customization handling sound end to end: base recording, three-way merge, provenance, hashes; align never writes skill bodies; apply applies only accepted decisions?
- Q5: What else blocks a safe end-to-end update for an operator (install and sync scripts, post-apply rebuild and reindex, docs, recovery), ranked by severity?

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- driving the real engine in throwaway repos turned three "the workflow covers it" readings into reproduced defects (P1-A, P2-E, P2-F) that static reading had missed, because each lives in the hand-off between two actions rather than inside one. (iteration 6)

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- the earlier static pass could not show that Node skips `finally` on SIGINT and SIGTERM; a ten-line signal probe settled it. (iteration 6)

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### A data-overwriting race from local edits between dry-run and approval: `assertPlanFresh` and the HEAD-dirty check refuse or skip instead [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1644-1661] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1877-1882]. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A data-overwriting race from local edits between dry-run and approval: `assertPlanFresh` and the HEAD-dirty check refuse or skip instead [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1644-1661] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1877-1882].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A data-overwriting race from local edits between dry-run and approval: `assertPlanFresh` and the HEAD-dirty check refuse or skip instead [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1644-1661] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1877-1882].

### A tracked `.skilled/release/` colliding with apply's metadata writes: `git ls-files .skilled/release` is empty and `runs/` is ignored at `.gitignore:256`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A tracked `.skilled/release/` colliding with apply's metadata writes: `git ls-files .skilled/release` is empty and `runs/` is ignored at `.gitignore:256`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A tracked `.skilled/release/` colliding with apply's metadata writes: `git ls-files .skilled/release` is empty and `runs/` is ignored at `.gitignore:256`.

### An offline downgrade through a stale local tag: when the recorded base cannot resolve offline, the base falls back to ancestry, so newer local content reads `local-only`, not `take-release` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:797-819]. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: An offline downgrade through a stale local tag: when the recorded base cannot resolve offline, the base falls back to ancestry, so newer local content reads `local-only`, not `take-release` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:797-819].
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: An offline downgrade through a stale local tag: when the recorded base cannot resolve offline, the base falls back to ancestry, so newer local content reads `local-only`, not `take-release` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:797-819].

### None. Every action produced evidence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: None. Every action produced evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: None. Every action produced evidence.

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
- A data-overwriting race from local edits between dry-run and approval: `assertPlanFresh` and the HEAD-dirty check refuse or skip instead [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1644-1661] [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:1877-1882]. (iteration 6)
- A tracked `.skilled/release/` colliding with apply's metadata writes: `git ls-files .skilled/release` is empty and `runs/` is ignored at `.gitignore:256`. (iteration 6)
- An offline downgrade through a stale local tag: when the recorded base cannot resolve offline, the base falls back to ancestry, so newer local content reads `local-only`, not `take-release` [SOURCE: .skilled/commands/doctor/scripts/release-update.cjs:797-819]. (iteration 6)
- None. Every action produced evidence. (iteration 6)

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
- Q1: Complete the field-by-field check of every workflow promise against engine exit codes, report fields, unit keys, lock behavior and rollback outcomes. The prerelease binding gap is established, but the full contract matrix remains open. (iteration 1)
- Q2: Finish the scenario matrix, especially abrupt interruption recovery, renames, offline align/apply and generated files outside the recognized patterns. (iteration 1)
- Q5: Inspect install and sync scripts, post-apply rebuild/reindex behavior, documentation and recovery paths. (iteration 1)
- Q4: Verify customization base recording, three-way merge provenance, hashes and decision-only apply behavior end to end. (iteration 1)
- Q3: Do update.md and doctor-update-presentation.txt meet the sk-create-command contract (thin router, presentation split, approval gates, dry-run, rollback), and do they agree with the workflows? (iteration 2)
- Q1: Does each workflow (check, align, apply) promise only what `release-update.cjs` actually does: flags, exit codes, outputs, unit keys, locking, rollback? (iteration 2)
- Q4: Is customization handling sound end to end: base recording, three-way merge, provenance, hashes; align never writes skill bodies; apply applies only accepted decisions? (iteration 2)
- Q5: What else blocks a safe end-to-end update for an operator (install and sync scripts, post-apply rebuild and reindex, docs, recovery), ranked by severity? (iteration 2)
- Q2: Does release-update.cjs behave correctly in real operator scenarios (vendored tree without tags, offline, prereleases, renamed, deleted, binary or generated files, partial or interrupted apply, rollback), and does a test cover each? (iteration 3)
- Q1: Does each workflow (check, align, apply) promise only what release-update.cjs actually does: flags, exit codes, outputs, unit keys, locking, rollback? (iteration 3)
- Q1, Q2, Q3 and Q5 remain outside this iteration's focus. (iteration 4)
- The practical impact of tree-less legacy base records with mutable release tags was not reproduced; the code path is confirmed, but the resulting misclassification is not measured. (iteration 4)
- Q1-Q4 remain for the other iterations; this pass answered Q5 only. (iteration 5)
- None of the five key questions remain open. Unverified residue: P2-H and P2-I need a reproducing fixture; the iteration-5 copied-tree documentation claim was not re-read. (iteration 6)

<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
Prior work (pointers, read them rather than trust this summary):
- specs/system-speckit/048-doctor-command-audit/003-update/research/research.md: the design research that split /doctor:update into check, align and apply and moved the database rebuild to /doctor:rebuild.
- specs/system-speckit/049-doctor-audit-followups/002-release-update-customization-signals/: generated-versus-authored files, base recording, prerelease ordering, apply-only questions.
- specs/system-speckit/049-doctor-audit-followups/004-doctor-scripts-conformance/implementation-summary.md: release-update.cjs fixes (check survives deleted changelog, align reads worktree edits, second apply replans, kind:name unit keys, numeric prerelease order, rollback takes the apply lock, plan paths confined to units).
- Engine tests: .skilled/commands/doctor/scripts/tests/release-update.test.cjs (run: node --test that file).

### Bounded Context Snapshot

Populate during initialization when the target is codebase-scoped. Keep this pointer-based and small:

- Source pointers: paths, symbols, or resource-map entries relevant to the topic.
- Reuse candidates: existing utilities, patterns, docs, or agents worth extending.
- Integration points: files or contracts the research is likely to touch.
- Constraints and risks: scope limits, stale graph or memory gaps, and known non-goals.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use `@context` for one-shot retrieval, and use this snapshot only to seed the research loop.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 6
- Convergence threshold: 0.05 (telemetry only under max-iterations)
- Per-iteration budget: 24 tool calls, 10 minutes
- Progressive synthesis: true (default)
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
- Started: 2026-10-03T19:12:55.598Z

resource-map.md not present; skipping coverage gate
