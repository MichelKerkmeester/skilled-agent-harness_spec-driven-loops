# Deep Review Strategy - scorer-8 (pass eight)

## 1. OVERVIEW

- Topic: command-surfacing review pass eight, scorer lineage. Review target `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build`, scoped to the three scorer files the pass-eight scope names.
- Goal: judge the rewritten guarded-write predicate (`guardedWriteCounts`) and the widened `MODE_SUFFIX` chain against the brief's rule, the command surface, and the week's earlier findings.
- Session lineage: sessionId=fanout-scorer-8-1794832880917-x4m8iz, parentSessionId=null, generation=1, lineageMode=new.
- Started: 2026-11-16T12:53:25Z.

### Purpose

Serves as the persistent brain for this lineage: which dimensions remain, what each pass found, which approaches are exhausted, and where the next pass looks. Read before every iteration.

### Usage

- Init: populated here from the brief, the scope file, the pass-seven lineage findings and the packet registry.
- Per iteration: read Next Focus, review one dimension, write the narrative and delta, record state through the append gateway, run the reducer.
- Mutability: mutable; the operator may edit commentary outside the machine-owned markers.

## 2. TOPIC

Review pass eight of the command-surfacing build. The scorer area covers `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` (the guarded-row unsafe predicate and the mode-suffix matcher), its vitest file, and the routing-accuracy README.

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Changing code, tests, docs or any file outside `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/scorer-8`.
- Re-scoring stored run sets. The brief forbids `score-command-transcripts.mjs --summary`, so every count claim comes from source inspection or a targeted `startState` probe.
- Re-reporting the three recorded limits (a suffix followed by a file extension; a `node -e` arrow inside escaped quotes; `isolation-check.sh` being macOS only) and the pass-seven findings this branch already fixed.
- Judging the attach-path area (`command-attach.ts`, `command-attach-guards.vitest.ts`, `CONTRIBUTING.md`). That is the `attach-docs-8` lineage's scope; the attach matcher is read here only as parity evidence.

## 5. STOP CONDITIONS

- Convergence per `config.convergenceThreshold` with all four dimensions covered, or `maxIterations` 5 reached.
- Escalate early if a P0 is confirmed, or if the scoped diff turns out to read holdout prompt text.

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 0
- P2 (Suggestions): 2
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Direct `startState` probes through the exported entry point turned each boundary question into an observed value, so every finding in this lineage carries a reproduced input rather than a reading of the code (iterations 1, 4, 5).
- Diffing the scoped files against the pass-seven commit and reading the whole predicate (`guardedWriteCounts`, `insideCheckout`, `firstWritePosition`) exposed the equality gap that a hunk-only read would have missed (iteration 1).
- Reading the command documents' argument hints settled the mode vocabulary question with a citation instead of a guess, and showed `:autopilot` is a stronger mode, not an alias (iterations 1, 4).
- Replaying the active findings at the cap kept the registry honest: all three inputs still reproduce on the shipped lines (iteration 5).

## 9. WHAT FAILED

- Treating `:unattended`, `:with-research` and `:auto:with-research` as a purely mechanical suffix widening missed that the self-chosen-mode rule reads the same vocabulary; the asymmetry only appeared at line level in the recovery pass (iteration 4).
- Two no-progress iterations in a row tripped `STUCK_RECOVERY`, which is why the lineage needed a recovery pass and the severity re-examination before it could stabilize (iteration 3).
- A legal convergence stop was unavailable: `hotspotSaturationGate` has no hotspot metadata to read in a lineage, so the candidate was vetoed and the run ended at the iteration cap (iteration 5).

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`//tmp/notes.md` escaping the scratch test**: `posix.normalize('//tmp/notes.md')` returns `/tmp/notes.md` (observed through Node's path module), so the double-slash spelling stays scratch. Not a defect. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`//tmp/notes.md` escaping the scratch test**: `posix.normalize('//tmp/notes.md')` returns `/tmp/notes.md` (observed through Node's path module), so the double-slash spelling stays scratch. Not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`//tmp/notes.md` escaping the scratch test**: `posix.normalize('//tmp/notes.md')` returns `/tmp/notes.md` (observed through Node's path module), so the double-slash spelling stays scratch. Not a defect.

### **`$TMPDIR/notes.md` as a write target**: the literal text stays relative and counts unsafe. The brief lists this spelling as a recorded limit; not re-reported. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`$TMPDIR/notes.md` as a write target**: the literal text stays relative and counts unsafe. The brief lists this spelling as a recorded limit; not re-reported.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`$TMPDIR/notes.md` as a write target**: the literal text stays relative and counts unsafe. The brief lists this spelling as a recorded limit; not re-reported.

### **`guardedWriteCounts` being unexported**: exporting it would widen the module surface for no caller; `startState` is the contract the scorer and tests use. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **`guardedWriteCounts` being unexported**: exporting it would widen the module surface for no caller; `startState` is the contract the scorer and tests use.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`guardedWriteCounts` being unexported**: exporting it would widen the module surface for no caller; `startState` is the contract the scorer and tests use.

### **`MODE_SUFFIX` applied to a route argument that ends in a mode word**: a route after a space is split off after the strip, and both the `expected_command` and the `expanded`/`skill` producers carry a bare command. No input reaches it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`MODE_SUFFIX` applied to a route argument that ends in a mode word**: a route after a space is split off after the strip, and both the `expected_command` and the `expanded`/`skill` producers carry a bare command. No input reaches it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`MODE_SUFFIX` applied to a route argument that ends in a mode word**: a route after a space is split off after the strip, and both the `expected_command` and the `expanded`/`skill` producers carry a bare command. No input reaches it.

### **A guarded write to `/dev/null` counted unsafe**: it is an over-count (cautious), pre-existing, and no run has to silence output to complete a guarded row. Not worth a finding. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A guarded write to `/dev/null` counted unsafe**: it is an over-count (cautious), pre-existing, and no run has to silence output to complete a guarded row. Not worth a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A guarded write to `/dev/null` counted unsafe**: it is an over-count (cautious), pre-existing, and no run has to silence output to complete a guarded row. Not worth a finding.

### **A missing holdout guard in the new code**: the new code touches no file, so there is nothing to guard. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A missing holdout guard in the new code**: the new code touches no file, so there is nothing to guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing holdout guard in the new code**: the new code touches no file, so there is nothing to guard.

### **A new finding from the final replay**: the replay inputs are the same four from iterations 1 and 4; no fifth input appeared at line level. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A new finding from the final replay**: the replay inputs are the same four from iterations 1 and 4; no fifth input appeared at line level.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A new finding from the final replay**: the replay inputs are the same four from iterations 1 and 4; no fifth input appeared at line level.

### **A symlink under a scratch folder that points into the checkout**: the scorer compares path text and never resolves links, and the brief's rule is written on the named paths. Recorded as a contract limit, not a finding; closing it would need a filesystem read the scorer does not perform. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A symlink under a scratch folder that points into the checkout**: the scorer compares path text and never resolves links, and the brief's rule is written on the named paths. Recorded as a contract limit, not a finding; closing it would need a filesystem read the scorer does not perform.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A symlink under a scratch folder that points into the checkout**: the scorer compares path text and never resolves links, and the brief's rule is written on the named paths. Recorded as a contract limit, not a finding; closing it would need a filesystem read the scorer does not perform.

### **Case-variant scratch spelling (`/TMP/x`)**: it fails the case-sensitive scratch pattern and is counted unsafe. A cautious over-count on a spelling no runner produces; not a finding. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Case-variant scratch spelling (`/TMP/x`)**: it fails the case-sensitive scratch pattern and is counted unsafe. A cautious over-count on a spelling no runner produces; not a finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Case-variant scratch spelling (`/TMP/x`)**: it fails the case-sensitive scratch pattern and is counted unsafe. A cautious over-count on a spelling no runner produces; not a finding.

### **Chain stripping a real command name**: no command under `.skilled/commands` is named `auto`, `confirm`, `autopilot`, `unattended` or `with-context|with-phases|with-research` (90 command files enumerated), so the alternation cannot collapse a command to its namespace. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Chain stripping a real command name**: no command under `.skilled/commands` is named `auto`, `confirm`, `autopilot`, `unattended` or `with-context|with-phases|with-research` (90 command files enumerated), so the alternation cannot collapse a command to its namespace.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Chain stripping a real command name**: no command under `.skilled/commands` is named `auto`, `confirm`, `autopilot`, `unattended` or `with-context|with-phases|with-research` (90 command files enumerated), so the alternation cannot collapse a command to its namespace.

### **Chained `:with-*` modifiers on a command that advertises none**: the scorer strips them by vocabulary, not by command, which matches the sibling matcher's documented choice (`command-attach.ts:203-210`). Not a defect. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Chained `:with-*` modifiers on a command that advertises none**: the scorer strips them by vocabulary, not by command, which matches the sibling matcher's documented choice (`command-attach.ts:203-210`). Not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Chained `:with-*` modifiers on a command that advertises none**: the scorer strips them by vocabulary, not by command, which matches the sibling matcher's documented choice (`command-attach.ts:203-210`). Not a defect.

### **Comment duplication between the inline note and the helper comment**: the inline note was removed in the same diff, so there is one comment, not two. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Comment duplication between the inline note and the helper comment**: the inline note was removed in the same diff, so there is one comment, not two.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Comment duplication between the inline note and the helper comment**: the inline note was removed in the same diff, so there is one comment, not two.

### **Duplicated scratch-root list as a finding**: no input shows a wrong result today; the two lists agree on every probed spelling. Recorded as a follow-up for the next pass, where a shared list would remove the drift. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Duplicated scratch-root list as a finding**: no input shows a wrong result today; the two lists agree on every probed spelling. Recorded as a follow-up for the next pass, where a shared list would remove the drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Duplicated scratch-root list as a finding**: no input shows a wrong result today; the two lists agree on every probed spelling. Recorded as a follow-up for the next pass, where a shared list would remove the drift.

### **Escalating iteration 1's P2s to P1**: the reach is not observed and the metric is advisory; the doctrine keeps them P2. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Escalating iteration 1's P2s to P1**: the reach is not observed and the metric is advisory; the doctrine keeps them P2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Escalating iteration 1's P2s to P1**: the reach is not observed and the metric is advisory; the doctrine keeps them P2.

### **Missing scorer-side negative suffix test as a finding**: the sibling suite pins it and today's alternation is explicit; a test-only gap with no failing input is a follow-up, not a defect. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Missing scorer-side negative suffix test as a finding**: the sibling suite pins it and today's alternation is explicit; a test-only gap with no failing input is a follow-up, not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Missing scorer-side negative suffix test as a finding**: the sibling suite pins it and today's alternation is explicit; a test-only gap with no failing input is a follow-up, not a defect.

### **Path traversal through the normalized value**: `posix.normalize` is called on a string that never reaches the filesystem in this function; the value only decides a boolean, so there is no path to escape. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Path traversal through the normalized value**: `posix.normalize` is called on a string that never reaches the filesystem in this function; the value only decides a boolean, so there is no path to escape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Path traversal through the normalized value**: `posix.normalize` is called on a string that never reaches the filesystem in this function; the value only decides a boolean, so there is no path to escape.

### **README over-claiming `..` support for relative paths**: a relative path is unsafe regardless of `..`, so the sentence is true for every input where the resolution changes the answer. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **README over-claiming `..` support for relative paths**: a relative path is unsafe regardless of `..`, so the sentence is true for every input where the resolution changes the answer.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **README over-claiming `..` support for relative paths**: a relative path is unsafe regardless of `..`, so the sentence is true for every input where the resolution changes the answer.

### **Treating the blocked stop as a review failure**: the only failing gate is graph metadata this lineage never writes; every actionable gate passed. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Treating the blocked stop as a review failure**: the only failing gate is graph metadata this lineage never writes; every actionable gate passed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Treating the blocked stop as a review failure**: the only failing gate is graph metadata this lineage never writes; every actionable gate passed.

### **Upgrading either P2 for the terminal stop**: the stop reason is the iteration cap, not a failure of the fix, and the doctrine keeps both at P2. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Upgrading either P2 for the terminal stop**: the stop reason is the iteration cap, not a failure of the fix, and the doctrine keeps both at P2.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Upgrading either P2 for the terminal stop**: the stop reason is the iteration cap, not a failure of the fix, and the doctrine keeps both at P2.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Consolidated from iteration dead-end data]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining. - Focus area: synthesis. The report must carry both active P2s, their three inputs, the blocked-stop cause, and the `maxIterationsReached` reason. - Reason: the cap is reached and the active set is stable. - Rotation status: complete. - Required evidence: the replay table above and the registry counts. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the three scoped files. Read context only inside the packet: `.skilled/commands/speckit/complete.md` and `plan.md` (argument hints), `command-attach.ts:203-235` (the sibling matcher), `038-alignment-p1-remediation/acceptance-criteria.md` AC-003 and `tasks.md` T004.
- Behavior claims under review: a guarded row (`ask` policy or `must-not-start`) is unsafe when it writes inside the run's checkout or anywhere outside a temp scratch folder (`/tmp`, `/private/tmp`, `/var/folders`, `/private/var/folders`), with a home path counting as real and `..` resolved first; and `MODE_SUFFIX` now strips a chain of `:auto|:confirm|:autopilot|:unattended` and `:with-context|:with-phases|:with-research` before a command is looked up.
- Prior state: pass seven raised four P2s in this family (tilde write, README omission, scratch-prefix traversal, helper name with two meanings). The branch fixes the first three by construction: `~` returns unsafe, the README states the boundary, and `posix.normalize` resolves `..` before the scratch test. The helper was renamed `guardedWriteCounts`.
- Risks and gaps: the diff also widens the mode vocabulary that `selfChosenAuto` (`:1362`) does not use; the checkout comparison has no equality case; the README and tests are the only documentation of the new boundary.

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 5 | REQ-002 and AC-002 match `guardedWriteCounts:1518-1525`; the two P2s are inputs the requirement text does not name. |
| `checklist_evidence` | core | pass | 5 | AC-002's verification cell and `tasks.md:47`/`:139` cover the shipped cases and the mirrored suffix chain. |
| `skill_agent` | overlay | pass | 1 | `sk-code-review/SKILL.md` and `references/review-core.md` were loaded before the first severity call. |
| `agent_cross_runtime` | overlay | notApplicable | 1 | The scoped diff touches no agent file or mirror. |
| `feature_catalog_code` | overlay | notApplicable | 1 | No catalog entry describes the scorer's unsafe metric. |
| `playbook_capability` | overlay | notApplicable | 1 | No playbook claims this metric. |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | D1, D2, D3, D4 | 5 | 2 P2 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | D1, D3, D4 | 5 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | D1, D3 | 4 | 0 | complete |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-scorer-8-1794832880917-x4m8iz, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-16T12:53:25Z
<!-- MACHINE-OWNED: END -->
