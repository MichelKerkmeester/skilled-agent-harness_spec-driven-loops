---
title: Deep Review Strategy Template
description: Runtime template copied to review/ during initialization to track review progress, dimension coverage, findings, and outcomes across iterations.
trigger_phrases:
  - "deep review strategy template"
  - "review dimension tracking"
  - "exhausted review approaches"
  - "review session tracking"
importance_tier: normal
contextType: planning
version: 1.11.0.13
---

# Deep Review Strategy - Session Tracking Template

Runtime template copied into the resolved `{artifact_dir}/` during initialization. Tracks review progress across iterations.

## 1. OVERVIEW

### Purpose

Serves as the "persistent brain" for a deep review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read by the orchestrator and agents at every iteration.

### Usage

- **Init:** Orchestrator copies this template to `{artifact_dir}/deep-review-strategy.md` and populates Topic, Review Dimensions, Known Context, and Review Boundaries from config and memory context.
- **Per iteration:** Agent reads Next Focus, reviews the assigned dimension/files, updates findings, marks dimensions complete, and sets new Next Focus.
- **Mutability:** Mutable, updated by both orchestrator and agents throughout the session.
- **Protection:** None (shared mutable state). Orchestrator validates consistency on resume.
- **Ownership:** Machine-managed metrics and coverage blocks are wrapped in explicit ownership markers. Human commentary and operator overrides live outside those markers.

---

## 2. TOPIC
Review target: `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review` (spec-folder). The uncommitted implementation of child phases 002 to 006, judged against each child's spec.md and acceptance-criteria.md.

Operator review focus: The uncommitted implementation of child phases 002 to 006: the one-lineage refusal in .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs and its tests and fixtures, the executor binding wording in .skilled/commands/deep/research.md, review.md and both presentation assets plus the regenerated compiled contracts, the plan phase-line example in plan.md.tmpl and spec-authoring-card.md with the regenerated scaffold snapshot, the authoring-card pointers in create.sh, spec-gate-core.mjs and system-spec-kit ROUTER.md, and the gate repairs in the three speckit workflow YAML files. Judge the changed code and docs against each child's spec.md and acceptance-criteria.md. See the change set with git diff.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Phase 001 (research only, already Complete) and its research artifacts.
- Unrelated uncommitted edits by other sessions under .skilled/commands/doctor/.
- The parent track graph-metadata.json churn.
- Modifying any reviewed file: the target is read-only.

---

## 5. STOP CONDITIONS
- stopPolicy=max-iterations: run all 5 iterations; convergence is telemetry only before the ceiling.
- Halt on a provider quota or credential error from the cli-pi executor; never switch model or provider.

---

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
- P2 (Suggestions): 14
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Reading the guard together with `parseArgs`, `validateBaseArtifactDir` and `applyFlatPoolAssignmentGuard`: it proved the refusal is side-effect free without running the suite (iteration 1).
- Searching every non-test reference to `fanout-run.cjs`: it ruled out a hidden shipped one-lineage caller in one action (iteration 1).
- Comparing each child's acceptance citations to the actual test lines: the child 003 evidence resolved exactly, so the packet's own evidence is trustworthy where it is specific (iteration 1).
- Reading the executor schema to test the new prompt wording against a real field rather than against prose: it separated a valid key from an ambiguous target (iteration 1).
- Reading the guard together with `ACTIVE_FANOUT_LOOP_TYPES` and `assertActiveFanoutLoopType`: it converted a suspected live guard bypass into an accurately-scoped fail-open-on-change advisory (iteration 2).
- Reading `parseArgs` beside the guard's `!== true` test: it proved the opt-in is fail-closed against every value form, which closed a whole security direction in two reads (iteration 2).
- Diffing the model-facing additions (`create.sh` echoes, Gate-3 notice, three YAML prose values) for interpolation: it closed the prompt-injection direction without needing the runtime (iteration 2).
- Reading each child's closure triple together (acceptance row, `spec.md` status, summary completion percentage) instead of one doc at a time: it found the two packets whose docs disagree while proving 005 and 003 self-consistent (iteration 3).
- Searching the four policy carriers as one set for the refusal and its opt-in: a whole-set negative proved the capability is undocumented rather than merely phrased differently (iteration 3).
- Listing `references/` before claiming the playbook protocol: one `ls` showed there is no `playbooks/` directory, so the protocol was reported as bounded instead of as a pass over a missing surface (iteration 3).
- Reading the new guard with `ACTIVE_FANOUT_LOOP_TYPES` and `assertActiveFanoutLoopType` in one view: it proved the guard's loop-type clause is always true at that point, which converted a suspected dead-condition defect into an accurate single-source-of-truth advisory (iteration 4).
- Reading the sibling guard at `fanout-run.cjs:3408` before grading the new one: the identical literal shape already ships there, so the finding was honestly capped at P2 instead of being inflated to a correction (iteration 4).
- Listing the added comment lines as one set against the comment-hygiene rule: it produced a positive, sweepable result (no path, phase number or requirement id) rather than a per-hunk spot check (iteration 4).
- Searching for the contract generator before judging the compiled-contract diff: one `grep -l` proved the contracts are generated output, which closed a manual-edit drift direction outright (iteration 4).
- Reading child 005's `spec.md` and `acceptance-criteria.md` as a whole before judging its carriers: it turned REQ-004's second clause (IMPLEMENT still loads the card) into a three-carrier check (`ROUTER.md:39,163,203-211`) instead of a trust in the cited command's output (iteration 5).
- Reading the declared helper document (`shared-smart-router.md`) to test the six-verb edit for a divergent sibling: its own declaration that `INTENT_SIGNALS` is provider-supplied closed the whole duplicate-keyword direction in one read (iteration 5).
- Reading 006's five `Met` rows beside its closure statement: four disclosure surfaces in one view held the carried advisory at P2 without re-opening it (iteration 5).

---

## 9. WHAT FAILED
- Treating the generated-contract parity claim as verified: the parity suite was not executed, so the claim stays text-level only (iteration 1).
- Attempting an exact-string `sed` range build from `grep -n` on this shell: two command shapes failed (`sed: invalid command code ,`), costing actions before the same evidence came from fixed line ranges (iteration 1).
- Spending the whole `verify` profile on security surface reads: the dimension had a thin diff, so the budget could not also cover the two leads that each needed one more file, and both had to be deferred (iteration 2).
- Assuming the dispatched dimension would match the strategy's Next Focus: they disagreed (security vs traceability) and the disagreement had to be reconciled after the fact (iteration 2).
- Carrying iteration 1's checklist row forward as current fact: the strategy still said `004 AC-002 Unmet`, but the criterion closed against a captured exit since then. Re-reading the row was required before any traceability claim (iteration 3).
- Reporting the 006 checklist contradiction at P1 before the skeptic pass: the packet names its own blocked state in three places, so the finding dropped to P2 with a named upgrade trigger (iteration 3).
- Truncating an over-long output filter with `head` on the test diff: the pipe hit `grep: repetition-operator operand invalid` and the whole test diff had to be re-read, costing an action for a quoting mistake rather than for a hard question (iteration 4).
- Reading the strategy's `## 11. NEXT FOCUS` as authoritative after iteration 3 had already completed that dimension: the dispatch and the strategy disagreed, and the correction had to happen after the review instead of before it (iteration 4).
- Running a repository-wide `find` for one script name: it returned ~50 `containment/baseline` and `barter/` duplicates before the shipped path, so the existence answer arrived buried in noise that a scoped `ls` would have avoided (iteration 5).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`check-card-sync.sh` missing, making AC-004's evidence fabricated.** Ruled out — the script ships at `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` and iterates the intent set at `:85`. Running it was declined to stay inside the read-only band; upgrade trigger: a closeout run of the script that does *not* print `CARD SYNC OK`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`check-card-sync.sh` missing, making AC-004's evidence fabricated.** Ruled out — the script ships at `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` and iterates the intent set at `:85`. Running it was declined to stay inside the read-only band; upgrade trigger: a closeout run of the script that does *not* print `CARD SYNC OK`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`check-card-sync.sh` missing, making AC-004's evidence fabricated.** Ruled out — the script ships at `.skilled/skills/system-spec-kit/runtime/cli/spec/check-card-sync.sh` and iterates the intent set at `:85`. Running it was declined to stay inside the read-only band; upgrade trigger: a closeout run of the script that does *not* print `CARD SYNC OK`.

### **`IMPLEMENT` matching without loading the card (AC-004's second clause failing).** Ruled out by `ROUTER.md:203-211`; the card is the third entry of the IMPLEMENT resource array. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`IMPLEMENT` matching without loading the card (AC-004's second clause failing).** Ruled out by `ROUTER.md:203-211`; the card is the third entry of the IMPLEMENT resource array.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`IMPLEMENT` matching without loading the card (AC-004's second clause failing).** Ruled out by `ROUTER.md:203-211`; the card is the third entry of the IMPLEMENT resource array.

### **Carried security debt (`expandLineages` label validation, the single-executor `configDir` path).** Not re-entered; still unread. Upgrade trigger: any future claim stronger than PASS-with-advisories requires reading both. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Carried security debt (`expandLineages` label validation, the single-executor `configDir` path).** Not re-entered; still unread. Upgrade trigger: any future claim stronger than PASS-with-advisories requires reading both.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Carried security debt (`expandLineages` label validation, the single-executor `configDir` path).** Not re-entered; still unread. Upgrade trigger: any future claim stronger than PASS-with-advisories requires reading both.

### **Divergent duplicate IMPLEMENT keyword list in `shared-smart-router.md`.** Ruled out by reading the file: it declares `INTENT_SIGNALS`, `RESOURCE_MAP` and `LOADING_LEVELS` as provider-supplied (`:25`, `:182-184`) and defines only helper bodies; its `DEFAULT_RESOURCE` is `references/cli-reference.md`, not a system-spec-kit path. No sync defect exists to fix. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Divergent duplicate IMPLEMENT keyword list in `shared-smart-router.md`.** Ruled out by reading the file: it declares `INTENT_SIGNALS`, `RESOURCE_MAP` and `LOADING_LEVELS` as provider-supplied (`:25`, `:182-184`) and defines only helper bodies; its `DEFAULT_RESOURCE` is `references/cli-reference.md`, not a system-spec-kit path. No sync defect exists to fix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Divergent duplicate IMPLEMENT keyword list in `shared-smart-router.md`.** Ruled out by reading the file: it declares `INTENT_SIGNALS`, `RESOURCE_MAP` and `LOADING_LEVELS` as provider-supplied (`:25`, `:182-184`) and defines only helper bodies; its `DEFAULT_RESOURCE` is `references/cli-reference.md`, not a system-spec-kit path. No sync defect exists to fix.

### **Manual compiled-contract maintenance.** A generator script exists and the presentation sources changed with the contracts. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Manual compiled-contract maintenance.** A generator script exists and the presentation sources changed with the contracts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Manual compiled-contract maintenance.** A generator script exists and the presentation sources changed with the contracts.

### **New keyword collisions from the six verbs against sibling intents.** Ruled out by reading all 22 `INTENT_SIGNALS` keyword arrays: `add`, `change`, `edit`, `fix`, `update`, `write` appear in no other intent, and the nearest neighbours (`DEBUG`, `COMPLETE`) keep higher weights than IMPLEMENT's 3, so a debug or completion phrasing still wins. Residual routing precision is child `spec.md:124`'s own open question, not a defect. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **New keyword collisions from the six verbs against sibling intents.** Ruled out by reading all 22 `INTENT_SIGNALS` keyword arrays: `add`, `change`, `edit`, `fix`, `update`, `write` appear in no other intent, and the nearest neighbours (`DEBUG`, `COMPLETE`) keep higher weights than IMPLEMENT's 3, so a debug or completion phrasing still wins. Residual routing precision is child `spec.md:124`'s own open question, not a defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **New keyword collisions from the six verbs against sibling intents.** Ruled out by reading all 22 `INTENT_SIGNALS` keyword arrays: `add`, `change`, `edit`, `fix`, `update`, `write` appear in no other intent, and the nearest neighbours (`DEBUG`, `COMPLETE`) keep higher weights than IMPLEMENT's 3, so a debug or completion phrasing still wins. Residual routing precision is child `spec.md:124`'s own open question, not a defect.

### **Test-suite fidelity loss from the shared spawn helper.** `tests/unit/fanout-run.vitest.ts` now appends `--allow-single-lineage` in every launch that passes through the shared helper, which makes the suite's default entry point differ from the operator CLI. Ruled out as a defect: the behaviour is documented in the helper's own comment, the refusal case deliberately bypasses the helper via `rawSpawnCjs`, and the suite's cases drive one lineage on purpose. Upgrade trigger: a future case that needs the standard path to refuse will silently pass, and that case must use the raw path. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Test-suite fidelity loss from the shared spawn helper.** `tests/unit/fanout-run.vitest.ts` now appends `--allow-single-lineage` in every launch that passes through the shared helper, which makes the suite's default entry point differ from the operator CLI. Ruled out as a defect: the behaviour is documented in the helper's own comment, the refusal case deliberately bypasses the helper via `rawSpawnCjs`, and the suite's cases drive one lineage on purpose. Upgrade trigger: a future case that needs the standard path to refuse will silently pass, and that case must use the raw path.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Test-suite fidelity loss from the shared spawn helper.** `tests/unit/fanout-run.vitest.ts` now appends `--allow-single-lineage` in every launch that passes through the shared helper, which makes the suite's default entry point differ from the operator CLI. Ruled out as a defect: the behaviour is documented in the helper's own comment, the refusal case deliberately bypasses the helper via `rawSpawnCjs`, and the suite's cases drive one lineage on purpose. Upgrade trigger: a future case that needs the standard path to refuse will silently pass, and that case must use the raw path.

### **The 006 `Met` rows being an undisclosed false closure (promotion to P1 considered and refused).** Ruled out on four disclosure surfaces, listed under the adjudication above. Upgrade trigger: any edit that removes the CHK-012 sentence from `006.../implementation-summary.md:116,130` while the rows stay `Met`. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The 006 `Met` rows being an undisclosed false closure (promotion to P1 considered and refused).** Ruled out on four disclosure surfaces, listed under the adjudication above. Upgrade trigger: any edit that removes the CHK-012 sentence from `006.../implementation-summary.md:116,130` while the rows stay `Met`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 006 `Met` rows being an undisclosed false closure (promotion to P1 considered and refused).** Ruled out on four disclosure surfaces, listed under the adjudication above. Upgrade trigger: any edit that removes the CHK-012 sentence from `006.../implementation-summary.md:116,130` while the rows stay `Met`.

### **Tracked-artifact labels leaked into code comments.** Searched the added comment lines as a set; none carries a spec path, phase number or requirement id. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Tracked-artifact labels leaked into code comments.** Searched the added comment lines as a set; none carries a spec path, phase number or requirement id.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Tracked-artifact labels leaked into code comments.** Searched the added comment lines as a set; none carries a spec path, phase number or requirement id.

### `iterations` being an invalid `config.executor` key: it is a declared nullable field, so only the binding target is ambiguous, not the key. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `iterations` being an invalid `config.executor` key: it is a declared nullable field, so only the binding target is ambiguous, not the key.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `iterations` being an invalid `config.executor` key: it is a declared nullable field, so only the binding target is ambiguous, not the key.

### Guard bypass by loop-type variation: impossible today; `ACTIVE_FANOUT_LOOP_TYPES` is exactly `{research, review}` at `:475` and is enforced at `:3306` before the guard. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Guard bypass by loop-type variation: impossible today; `ACTIVE_FANOUT_LOOP_TYPES` is exactly `{research, review}` at `:475` and is enforced at `:3306` before the guard.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Guard bypass by loop-type variation: impossible today; `ACTIVE_FANOUT_LOOP_TYPES` is exactly `{research, review}` at `:475` and is enforced at `:3306` before the guard.

### Guard ordering hazard: no filesystem or ledger write occurs before the guard; `validateBaseArtifactDir` and `applyFlatPoolAssignmentGuard` are pure. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Guard ordering hazard: no filesystem or ledger write occurs before the guard; `validateBaseArtifactDir` and `applyFlatPoolAssignmentGuard` are pure.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Guard ordering hazard: no filesystem or ledger write occurs before the guard; `validateBaseArtifactDir` and `applyFlatPoolAssignmentGuard` are pure.

### Hand-edited compiled contracts: both contract diffs carry the same policy sentence as their presentation sources, and the prompt-block branch appears on the contract line child 002 predicted. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Hand-edited compiled contracts: both contract diffs carry the same policy sentence as their presentation sources, and the prompt-block branch appears on the contract line child 002 predicted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hand-edited compiled contracts: both contract diffs carry the same policy sentence as their presentation sources, and the prompt-block branch appears on the contract line child 002 predicted.

### Hidden shipped one-lineage caller broken by the refusal: searched, none found. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Hidden shipped one-lineage caller broken by the refusal: searched, none found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Hidden shipped one-lineage caller broken by the refusal: searched, none found.

### New spawn, path or secret handling in the change set: the diff adds one refusal branch, one flag-table entry and prose. No new `spawn`, no new `path.join` on caller input, no credential read. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: New spawn, path or secret handling in the change set: the diff adds one refusal branch, one flag-table entry and prose. No new `spawn`, no new `path.join` on caller input, no credential read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New spawn, path or secret handling in the change set: the diff adds one refusal branch, one flag-table entry and prose. No new `spawn`, no new `path.join` on caller input, no credential read.

### Opt-in enabling by value coercion: `!== true` plus the string-or-flag parser makes every non-bare form refuse. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Opt-in enabling by value coercion: `!== true` plus the string-or-flag parser makes every non-bare form refuse.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Opt-in enabling by value coercion: `!== true` plus the string-or-flag parser makes every non-bare form refuse.

### Prompt-injection surface from the new model-facing text: every added line is static repo text with no caller-data interpolation. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Prompt-injection surface from the new model-facing text: every added line is static repo text with no caller-data interpolation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prompt-injection surface from the new model-facing text: every added line is static repo text with no caller-data interpolation.

### Refusal-message leakage: the message names the workflow and omits both the opt-in and any count, as REQ-001 requires, and the test asserts both omissions. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Refusal-message leakage: the message names the workflow and omits both the opt-in and any count, as REQ-001 requires, and the test asserts both omissions.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Refusal-message leakage: the message names the workflow and omits both the opt-in and any count, as REQ-001 requires, and the test asserts both omissions.

### Speckit YAML schema breakage and guard ordering were ruled out in iteration 1 and were not re-entered beyond the confirmation needed for the two clean surfaces above. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Speckit YAML schema breakage and guard ordering were ruled out in iteration 1 and were not re-entered beyond the confirmation needed for the two clean surfaces above.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Speckit YAML schema breakage and guard ordering were ruled out in iteration 1 and were not re-entered beyond the confirmation needed for the two clean surfaces above.

### Speckit YAML schema breakage from the new `criteria` key: no validator exists over that asset folder; sibling `on_fail` keys are precedent. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Speckit YAML schema breakage from the new `criteria` key: no validator exists over that asset folder; sibling `on_fail` keys are precedent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Speckit YAML schema breakage from the new `criteria` key: no validator exists over that asset folder; sibling `on_fail` keys are precedent.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Hidden shipped one-lineage caller broken by the refusal: no non-test reference launches a one-lineage research or review config without the opt-in (iteration 1, evidence: search over all non-test `fanout-run.cjs` references).
- Guard firing after a directory or ledger write: `validateBaseArtifactDir` and `applyFlatPoolAssignmentGuard` are pure and the guard precedes preflight, directories, ledgers and spawn (iteration 1, evidence: `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:666-681,3397`).
- Hand-edited compiled contracts: both diffs carry the same policy sentence as their sources (iteration 1, evidence: `deep-research.contract.markdown:220,266`).
- Speckit YAML schema breakage from the new `criteria` key: no validator exists over the asset folder and `on_fail` precedent exists (iteration 1, evidence: `speckit-implement.yaml:393,403,513,560`).
- `iterations` being an invalid `config.executor` key: it is a declared nullable field (iteration 1, evidence: `executor-config.ts:827`).
- Refusal-message leakage of the opt-in or a count: the test asserts both omissions (iteration 1, evidence: `fanout-run.vitest.ts:2538-2539`).
- Guard bypass by a loop-type value outside the guard pair: `ACTIVE_FANOUT_LOOP_TYPES` is exactly `{research, review}` and `assertActiveFanoutLoopType` runs before the guard (iteration 2, evidence: `fanout-run.cjs:475,3306`).
- Opt-in enabled by value coercion: `parseArgs` stores a string for any lookahead value and the guard compares with `!== true` (iteration 2, evidence: `fanout-run.cjs:114,3402`).
- Prompt-injection surface from the new model-facing text: every added line in `create.sh`, `spec-gate-core.mjs` and the three speckit YAMLs is static prose (iteration 2, evidence: `spec-gate-core.mjs:178`, `create.sh:2207,2416`).
- Speckit YAML loader or schema breakage from `criteria`, `on_fail` or `test_failure`: prose values with sibling precedent (iteration 2, evidence: `speckit-implement.yaml:390,560,679`).
- Agent-definition drift from the one-lineage policy: all twelve `.skilled/agents/*.md` definitions carry no `fanout`, `single-executor`, `config.fanout` or `config.executor` statement, so no agent doc restates the changed rule (iteration 3, evidence: policy-term search across the agents directory).
- Playbook capability drift: the installed skill has no `playbooks/` directory and only `references/workflows/quick-reference.md` names the authoring card (iteration 3, evidence: `ls .skilled/skills/system-spec-kit/references`).
- 005 status drift: `Draft`, `AC-001 Unmet` and `completion_pct: 75` agree with each other (iteration 3, evidence: `005-point-chat-sessions-at-authoring-card/acceptance-criteria.md:62`, `implementation-summary.md:116`).
- 004 task-layer drift: T006 is ticked and CHK-021 carries the captured exit, so only the summary body lags (iteration 3, evidence: `004-name-file-in-plan-phase-lines/tasks.md:62,124`).
- Command-page routing drift: `review.md:98` and `research.md:126` state the one-lineage rule at the same granularity as both presentation assets (iteration 3, evidence: the two command pages and the two presentation files).
- Test-suite fidelity loss from the shared spawn helper: the helper now appends the opt-in to every launch, which is documented in place, and the refusal case deliberately bypasses it through `rawSpawnCjs` (iteration 4, evidence: `tests/unit/fanout-run.vitest.ts` helper hunk and the refusal case's own note; upgrade trigger: a future case needing the standard path to refuse).
- Tracked-artifact labels leaked into the added code comments: none of the four added comment blocks carries a spec path, phase number or requirement id (iteration 4, evidence: `fanout-run.cjs:3397-3399` and the three test-side notes).
- Manual compiled-contract maintenance: a generator exists at `runtime/scripts/compile-command-contracts.cjs` and the presentation sources changed alongside the contracts (iteration 4, evidence: generator file plus paired diffs).
- A divergent duplicate IMPLEMENT keyword list in `references/cli/shared-smart-router.md`: that file declares `INTENT_SIGNALS`/`RESOURCE_MAP`/`LOADING_LEVELS` as provider-supplied helper bodies only (`:25`, `:182-184`) and defaults to `references/cli-reference.md`, so the six-verb edit has no sibling copy to drift from. -- BLOCKED (iteration 5, 1 attempts)
- `check-card-sync.sh` being missing, which would make child 005 AC-004's cited output fabricated: the script ships at `runtime/cli/spec/check-card-sync.sh` and iterates `PLAN IMPLEMENT INTAKE TEMPLATE_AUTHORING` at `:85`, with the `CARD SYNC OK` sentinel at `:152`. -- BLOCKED (iteration 5, 1 attempts)
- New keyword collisions from the six write verbs against sibling intents: swept all 22 `INTENT_SIGNALS` keyword arrays, and `add`/`change`/`edit`/`fix`/`update`/`write` appear in no other intent while the nearest neighbours keep higher weights. Residual precision stays child 005's own open question, not a defect. -- BLOCKED (iteration 5, 1 attempts)
- Promoting 006's `Met` rows to P1 as an undisclosed false closure: `acceptance-criteria.md:96` and `implementation-summary.md:43,105,116,130` disclose the CHK-012 conflict on four surfaces while `Closeable: No` holds. Upgrade trigger: an edit that removes the CHK-012 sentence while the rows stay `Met`. -- BLOCKED (iteration 5, 1 attempts)

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none — terminal iteration, `stopPolicy=max-iterations` reached at 5 of 5. - Focus area: closure. All four dimensions are complete; 13 P2 advisories carry forward and no P0/P1 is active. - Reason: the loop ceiling, not convergence, ends this run; the convergence ratio for this iteration is telemetry below the 0.10 threshold only in the sense that nothing new was raised. - Rotation status: D1 correctness, D2 security, D3 traceability, D4 maintainability — 4/4 complete, plus a terminal broadened correctness pass. - Blocked/productive carry-forward: 13 active P2 plus 1 refinement of the parent phase-map advisory. The two deferred security leads stay open as scope debt. - Required evidence for any follow-on: run `check-card-sync.sh` and the contract-parity suite, and read the two deferred security leads, before promoting this packet past PASS-with-advisories. - Recovery note: none — this iteration completed normally. Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT
- A concurrent session edited unrelated working-tree files during iteration 1 (`README.md`, `.skilled/changelog/skilled/v4.0.2.1.md`, doctor surfaces). The changelog path was absent from the first `git status` snapshot and present later; no review action writes there. Treat the working tree as shared and re-diff before any implementation step.
- Continuity ladder: the parent has no handover.md, implementation-summary.md or decision-record.md; spec.md is the canonical parent doc. Its PHASE DOCUMENTATION MAP still lists phases 002-006 as Pending while each child carries an implementation-summary.md (a status-drift lead for traceability).
- Parent spec.md `Phase Handoff Criteria` table names the per-phase verification commands each child's acceptance criteria rest on.
- Builder evidence log: `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/build-evidence.md`; a pre-build spec review: `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/scratch/fable-review-of-phase-specs.md`.
- Phase 001 research output: `specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/001-research-egm-checks-and-chat-path-gaps/research/` (source of the recommendations 002-006 implement).
- Executor note: config.executor.model is the allowlisted literal `deepseek-v4.1-flash-1017`; the cli-pi builder maps it to the selector `llmgateway/deepseek-v4.1-flash-1017`, the exact route the operator requested (the provider-qualified literal is not on the builder allowlist).

### Bounded Context Snapshot

Populate during initialization before the first review dimension runs. Keep this pointer-based and scoped to the declared review target:

- Target pointers: files, specs, symbols, or resource-map entries under review.
- Behavior claims: acceptance criteria, public contracts, or docs to verify.
- Reuse and conventions: existing patterns that define expected implementation shape.
- Review risks and gaps: stale graph or memory caveats, missing files, and out-of-scope areas.

Do not inline full source bodies. Do not dispatch the retired standalone context loop. Use this snapshot only to seed review dimensions and final traceability.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | `SKILL.md:94` carries the exact REQ-002 sentence; 003 AC-001/AC-002 cite resolving runner and test lines; guard present at `fanout-run.cjs:3400-3407`. Contract parity still not executed. |
| `checklist_evidence` | core | partial | 3 | 002/003 fully Met; 004 AC-002 now Met against `build-evidence.md:152` but its summary body still says Unmet; 005 AC-001 Unmet and self-consistent; 006 all rows Met against an open CHK-012. |
| `skill_agent` | overlay | pass | 3 | `system-spec-kit/SKILL.md:94` binds plan-or-implement requests to `references/workflows/spec-authoring-card.md`, the file the sentence names. |
| `agent_cross_runtime` | overlay | pass | 3 | No `.skilled/agents/*.md` definition states the executor-matrix policy; `.claude/agents/` and `.pi/agents/` mirrors were not enumerated. |
| `feature_catalog_code` | overlay | partial | 3 | `fanout-dispatch.md:52-56` matches the routed policy, but no operator surface documents the refusal or `--allow-single-lineage` (finding R3-P2-003). |
| `playbook_capability` | overlay | pass | 3 | No `playbooks/` directory exists; `references/workflows/quick-reference.md` carries the card pointer and no playbook restates executor routing. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/spec.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/spec.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/002-bind-single-entry-executors-to-single-path/acceptance-criteria.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/003-refuse-single-lineage-fanout-run/spec.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/003-refuse-single-lineage-fanout-run/acceptance-criteria.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/spec.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/004-name-file-in-plan-phase-lines/acceptance-criteria.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/spec.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/005-point-chat-sessions-at-authoring-card/acceptance-criteria.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/spec.md | - | - | - | pending |
| specs/system-speckit/spec-authoring-and-continuity/005-goldfish-cold-read-plan-review/006-repair-speckit-workflow-gates/acceptance-criteria.md | - | - | - | pending |
| .skilled/commands/deep/assets/compiled/deep-ai-council.contract.markdown | correctness | 1 | 1 | reviewed |
| .skilled/commands/deep/assets/compiled/deep-research.contract.markdown | - | - | - | pending |
| .skilled/commands/deep/assets/compiled/deep-review.contract.markdown | - | - | - | pending |
| .skilled/commands/deep/assets/deep-research-presentation.txt | correctness | 1 | 1 | reviewed |
| .skilled/commands/deep/assets/deep-review-presentation.txt | correctness | 1 | 1 | reviewed |
| .skilled/commands/deep/research.md | correctness | 1 | 2 | reviewed |
| .skilled/commands/deep/review.md | correctness | 1 | 2 | reviewed |
| .skilled/commands/speckit/assets/speckit-complete.yaml | security | 2 | 0 | reviewed |
| .skilled/commands/speckit/assets/speckit-implement.yaml | correctness, security | 2 | 1 | reviewed |
| .skilled/commands/speckit/assets/speckit-plan.yaml | security | 2 | 0 | reviewed |
| .skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/repin-runbook.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/fanout-dispatch.md | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs | correctness, security | 2 | 3 | reviewed |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fanout.vitest.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/stress/cli-adapter/fixtures/adapter-fixture.ts | - | - | - | pending |
| .skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts | correctness | 1 | 0 | reviewed |
| .skilled/skills/system-deep-loop/runtime/tests/unit/lineage-timestamp-window.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/ROUTER.md | correctness | 1 | 0 | reviewed |
| .skilled/skills/system-spec-kit/SKILL.md | - | - | - | pending |
| .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md | correctness | 1 | 0 | reviewed |
| .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh | correctness, security | 2 | 0 | reviewed |
| .skilled/skills/system-spec-kit/runtime/cli/tests/scaffold-passes-its-own-gate.vitest.ts | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/cli/tests/snapshots/scaffold-golden-snapshots.vitest.ts.snap | - | - | - | pending |
| .skilled/skills/system-spec-kit/runtime/hooks/lib/spec-gate/spec-gate-core.mjs | correctness, security | 2 | 0 | reviewed |
| .skilled/skills/system-spec-kit/runtime/tests/hooks/spec-gate-core.test.mjs | - | - | - | pending |
| .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl | correctness | 1 | 0 | reviewed |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Stop policy: max-iterations
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-12T00:11:44.581Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=spec_code, checklist_evidence; overlay=skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability
- Started: 2026-11-12T00:11:44.581Z
- Executor: cli-pi, model deepseek-v4.1-flash-1017 (selector llmgateway/deepseek-v4.1-flash-1017), reasoningEffort max, timeout 1200s
<!-- MACHINE-OWNED: END -->

---

## 17. EXAMPLE (POPULATED)

Reference snippet showing a partially populated strategy file mid-review. Use this as a visual anchor when opening a live strategy doc.

```markdown
## 1. REVIEW CHARTER
- Target: .skilled/skills/system-deep-loop/deep-research (skill, v1.4.0)
- Dimensions: correctness, test-coverage, cross-runtime-parity, observability
- Stop conditions: rolling newInfoRatio < 0.08 for 2 iterations OR all dimensions converged OR max=7 reached
- Success criteria: zero P0 in correctness; test-coverage P0 resolved or deferred with rationale

## 4. NEXT FOCUS
- Dimension: test-coverage
- Files: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs, .skilled/skills/system-spec-kit/runtime/cli/tests/deep-research-contract-parity.vitest.ts
- Why: Iteration 2 surfaced a P0 (convergence-path coverage gap); needs a focused follow-up before correctness can terminate PASS.

## 9. COVERAGE MATRIX
| Dimension            | Status     | Iterations touched |
|----------------------|------------|--------------------|
| correctness          | converged  | 1                  |
| test-coverage        | converging | 2, 4               |
| cross-runtime-parity | converging | 3                  |
| observability        | converging | 4                  |
```
