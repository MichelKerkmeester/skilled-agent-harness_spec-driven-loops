---
title: Deep Review Strategy - expansive-depth program (21c4b325b5a..1d2b49e4306)
description: Session tracking for the 10-iteration deep review of every change the expansive-depth program made.
importance_tier: normal
contextType: planning
---

# Deep Review Strategy - Session Tracking

## 1. OVERVIEW

Persistent brain for this review session. Read at every iteration; the leaf updates Next Focus, findings and what worked or failed.

---

## 2. TOPIC
Review of commit range `21c4b325b5a..1d2b49e4306` on branch `worktrees/455-expansive-depth-integration`: the expansive-depth program, phases 001-014 (completed-run extension, defect fixes D1-D14, opt-in `--depth-mode=expansive` for deep-research and deep-review, playbooks, catalogs and alignment). 235 commits, 10 merge commits. Review target type: `files` (the commit range expanded to its changed files).

### Review Charter
- Dimensions (6): correctness, security, traceability, maintainability, plus two custom dimensions, `overengineering` and `sk-code-alignment`.
- **overengineering rubric**: find abstractions, options, layers, files or fallbacks that no current requirement earns. Measure against `.skilled/repo-rules/prevent-overengineering.md` and the restraint signals in the root `CLAUDE.md` section 3: flexibility or future-proofing language, unmeasured performance claims, DRY across two instances, a new option or layer with one caller, and a symptom fixed where it surfaced instead of at its producer. Every finding names what to delete or collapse, and what current requirement (if any) it serves.
- **sk-code-alignment rubric**: conformance with `.skilled/skills/sk-code/`: the review-mode floor (`sk-code-review/references/review-core.md`), the stack surface rules for the JS, CJS, TS and test files touched, its quality tiers and the test-what-changed rule (coverage floor = happy path plus one edge per public surface; above it a test earns its place by failing for one real reason no other test catches), and comment hygiene: no spec paths, phase numbers, REQ/ADR/task/finding ids or slice labels (for example "D5", "Slice K", "phase 011") inside code comments.
- Severity: P0/P1/P2 only, reach-calibrated per review-core.md section 2.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Not reviewing the generated run artifacts under the packet's `research/`, `research_archive/`, `scratch/` and child-phase `research/` or `review/` directories (about 1,700 of the 1,970 changed paths). They are loop output, not program work. Only the packet's canonical docs and each child phase's `spec.md`, `tasks.md` and `implementation-summary.md` are in scope.
- Not implementing fixes. Not re-running the test suites as a pass/fail gate (a leaf may run a single targeted test read-only to confirm a claim).
- Not reviewing files outside Review Scope Files: a finding must cite a listed file, or the terminal scope gate fails.

---

## 5. STOP CONDITIONS
- Exactly 10 iterations: `maxIterations` 10, `antiConvergence.minIterations` 10, `stopPolicy` max-iterations (convergence is telemetry only before the cap).
- `maxDurationMinutes` raised from the workflow's 120 to 360 at config creation so the duration stop cannot cut the run short (recorded deviation).
- Three consecutive failed iterations still stop the run with reason error.

---

<!-- ANCHOR:completed-dimensions -->
## 4. COMPLETED DIMENSIONS
- [x] correctness
- [x] security
- [x] traceability
- [x] maintainability
- [x] overengineering
- [x] sk-code-alignment

<!-- /ANCHOR:completed-dimensions -->
<!-- ANCHOR:running-findings -->
## 5. RUNNING FINDINGS
- P0 (Blockers): 0
- P1 (Required): 2
- P2 (Suggestions): 14
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Iteration 10: checking each ticked checklist claim by content against the code it cites (not by cited line) confirmed 12 phases' rows and turned 010 CHK-032 from unverified into a confirmed gap.
- Iteration 9: tracing the run_extended ceiling across YAML producer, schema isData and reducer foldRun confirmed one identity in all three; grepping workflow bindings closed the merged-coverage open question.
- Iteration 7: diff-first reads of the six new-to-review files, then one exact search to test each id-collision hypothesis against the minting code.
- Iteration 1: calling the exported `scopeInsideReviewTarget` with this run's own config turned a reading into a confirmed P1; diff-plus-current-file reads kept the four-file slice inside budget.
- Iteration 2: listing every frontier-admit shell step in both YAMLs and comparing what each interpolates isolated the one leaf-derived value; a one-line bash probe confirmed substitution.
- Iteration 3: counting child status rows and checkbox states across all 14 phases in one pass surfaced the 010/011 checklist-vs-AC contradiction; tracing the convergence.cjs:1195 diff to 003 spec.md:65 closed the iteration-1 spec_code gap.
- Iteration 4: diffing the two copies of each repeated YAML step against each other (and the contract test's indent-anchored stepText) exposed copy drift a single-copy read misses.
- Iteration 5: grepping for every reader of a field or flag (`.budget`, `maxIterationsSource`) and checking the step's declared outputs separated consumer-less options from earned ones.
- Iteration 6: scanning only the added diff lines for hygiene labels and running verify_alignment_drift.py on a scratch copy of the changed code covered all 26 files cheaply; comparing two readers of the same torn-line condition in one file surfaced the inconsistency.

---

- Iteration 8: stuck recovery at function granularity. For each config option, field and merged key, a grep for its readers outside its own file turned two dead pivot knobs and four reader-less merge surfaces into P2 findings.

## 9. WHAT FAILED
- Iteration 10: no overengineering pass over the playbook and catalog duplication; budget went to closing checklist_evidence. skill_agent, feature_catalog_code and playbook_capability not re-run.
- Iteration 9: correctness third pass over schemas, legacy upcast, continuity thread and dispatch/verify diffs yielded no new finding.
- Iteration 8: did not trace whether synthesis runs convergence.cjs on the fan-out parent registry (finding R8-P2-003 withdraw trigger); checklist_evidence still unrun.
- Iteration 7: budget ran out before tracing consumers of the merged searchCoverage buckets.
- Iteration 1: did not trace which phase owns the review-wide `minIterationsNotReached` widening (convergence.cjs:1195); left spec_code partial.
- Iteration 2: security pass did not advance spec_code or checklist_evidence; both core protocols still open.
- Iteration 3: playbook_capability checked presence only (no scenario steps run); skill_agent and agent_cross_runtime overlays not run; 010 CHK-032 research scope intersection left unverified.
- Iteration 4: did not advance spec_code or checklist_evidence; feature_catalog_code and playbook_capability still unrun.
- Iteration 5: did not reach divergent-pivot.ts retry plumbing; spec_code and checklist_evidence still partial.
- Iteration 6: name-based test-coverage counting is weak evidence (helpers are exercised through CLIs); divergent-pivot.ts still unread; core protocols not advanced.

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### .vibe deep-review mirror missing the custom rule: the low line count comes from a one-line TOML string, and the rule text is present. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: .vibe deep-review mirror missing the custom rule: the low line count comes from a one-line TOML string, and the rule text is present.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: .vibe deep-review mirror missing the custom rule: the low line count comes from a one-line TOML string, and the rule text is present.

### `classifySourceLocation` hard-coded doc-host list (upsert.cjs:311-345) as speculative: it replaces a leaf-supplied quality class that a leaf could game. That is a current requirement, and the list is small and closed. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `classifySourceLocation` hard-coded doc-host list (upsert.cjs:311-345) as speculative: it replaces a leaf-supplied quality class that a leaf could game. That is a current requirement, and the list is small and closed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `classifySourceLocation` hard-coded doc-host list (upsert.cjs:311-345) as speculative: it replaces a leaf-supplied quality class that a leaf could game. That is a current requirement, and the list is small and closed.

### `deriveReviewFindingEvidence` reused-id split (`#<iteration>`) as speculative: a comment cites the reducer's same rule, and finding ids are unique only per source. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: `deriveReviewFindingEvidence` reused-id split (`#<iteration>`) as speculative: a comment cites the reducer's same rule, and finding ids are unique only per source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `deriveReviewFindingEvidence` reused-id split (`#<iteration>`) as speculative: a comment cites the reducer's same rule, and finding ids are unique only per source.

### 008 T004 `REQUIRED_DIMENSIONS` default parameters as a routing leak: every call site that matters passes the universe, and the defaults only serve direct callers of the exported helpers. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: 008 T004 `REQUIRED_DIMENSIONS` default parameters as a routing leak: every call site that matters passes the universe, and the defaults only serve direct callers of the exported helpers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 008 T004 `REQUIRED_DIMENSIONS` default parameters as a routing leak: every call site that matters passes the universe, and the defaults only serve direct callers of the exported helpers.

### 014 T001 ticked while marked open: the same row records the later close with its command output. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: 014 T001 ticked while marked open: the same row records the later close with its command output.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: 014 T001 ticked while marked open: the same row records the later close with its command output.

### Abstracting the twice-written half-budget node cap: two instances, below the rule's threshold. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Abstracting the twice-written half-budget node cap: two instances, below the rule's threshold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Abstracting the twice-written half-budget node cap: two instances, below the rule's threshold.

### Attempt-1 config byte-identity rewrite in divergent-pivot.ts as gold-plating: it keeps resumed attempt-1 replays consistent, which is a correctness requirement. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Attempt-1 config byte-identity rewrite in divergent-pivot.ts as gold-plating: it keeps resumed attempt-1 replays consistent, which is a correctness requirement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Attempt-1 config byte-identity rewrite in divergent-pivot.ts as gold-plating: it keeps resumed attempt-1 replays consistent, which is a correctness requirement.

### Cycle check bypass: `checkCycle` caps steps at maxDepth+1 and returns `cycle` on a revisit; a dangling parent is caught earlier by relevance. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Cycle check bypass: `checkCycle` caps steps at maxDepth+1 and returns `cycle` on a revisit; a dangling parent is caught earlier by relevance.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Cycle check bypass: `checkCycle` caps steps at maxDepth+1 and returns `cycle` on a revisit; a dangling parent is caught earlier by relevance.

### Dead `budgetSplit` config key: read by reduce-state.cjs:1966-1970. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Dead `budgetSplit` config key: read by reduce-state.cjs:1966-1970.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Dead `budgetSplit` config key: read by reduce-state.cjs:1966-1970.

### Default-run registry drift: the frontier key is spread only when the projection exists. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Default-run registry drift: the frontier key is spread only when the projection exists.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Default-run registry drift: the frontier key is spread only when the projection exists.

### Divergent `fanout_graph_store` text across copies: identical, so not drift. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Divergent `fanout_graph_store` text across copies: identical, so not drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Divergent `fanout_graph_store` text across copies: identical, so not drift.

### Env widening through `guardContext.env`: the env still passes the executor allowlist. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Env widening through `guardContext.env`: the env still passes the executor allowlist.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Env widening through `guardContext.env`: the env still passes the executor allowlist.

### Function-length lens (several 60-90 line functions in frontier-admit.cjs): lens default P2, consistent with sibling runtime scripts; not raised as noise. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Function-length lens (several 60-90 line functions in frontier-admit.cjs): lens default P2, consistent with sibling runtime scripts; not raised as noise.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Function-length lens (several 60-90 line functions in frontier-admit.cjs): lens default P2, consistent with sibling runtime scripts; not raised as noise.

### Graph `--output` arbitrary write: operator-only CLI flag with fixed callers. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Graph `--output` arbitrary write: operator-only CLI flag with fixed callers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Graph `--output` arbitrary write: operator-only CLI flag with fixed callers.

### Huge `--extend` value bypassing the ceiling: the regex has no upper bound, but `isUint32` on every budget field refuses it at the gateway before the config moves. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Huge `--extend` value bypassing the ceiling: the regex has no upper bound, but `isUint32` on every budget field refuses it at the gateway before the config moves.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Huge `--extend` value bypassing the ceiling: the regex has no upper bound, but `isUint32` on every budget field refuses it at the gateway before the config moves.

### Idle fan-out lineage reseeding the whole target (seed step skipped for lineages; seedNodes is idempotent). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Idle fan-out lineage reseeding the whole target (seed step skipped for lineages; seedNodes is idempotent).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Idle fan-out lineage reseeding the whole target (seed step skipped for lineages; seedNodes is idempotent).

### inboxId/nodeId normalization mismatch in the research frontier projection. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: inboxId/nodeId normalization mismatch in the research frontier projection.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: inboxId/nodeId normalization mismatch in the research frontier projection.

### Leaf prose fields widening the iteration event: optionalLeafFields keeps only typed fields and drops a field with the wrong shape. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Leaf prose fields widening the iteration event: optionalLeafFields keeps only typed fields and drops a field with the wrong shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Leaf prose fields widening the iteration event: optionalLeafFields keeps only typed fields and drops a field with the wrong shape.

### Lineage store path traversal via frontier partition: the path is built from the fan-out label, not node content. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Lineage store path traversal via frontier partition: the path is built from the fan-out label, not node content.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Lineage store path traversal via frontier partition: the path is built from the fan-out label, not node content.

### Missing documentation of the research block step: frontier-admit-script.md:35 documents it. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Missing documentation of the research block step: frontier-admit-script.md:35 documents it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing documentation of the research block step: frontier-admit-script.md:35 documents it.

### Missing tests for new reducer/merge helpers: covered behaviorally through the reducer and merge CLIs. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Missing tests for new reducer/merge helpers: covered behaviorally through the reducer and merge CLIs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Missing tests for new reducer/merge helpers: covered behaviorally through the reducer and merge CLIs.

### Node-id collision after a torn store line: `nextNodeSerial` counts from the highest serial, not the row count. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: Node-id collision after a torn store line: `nextNodeSerial` counts from the highest serial, not the row count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Node-id collision after a torn store line: `nextNodeSerial` counts from the highest serial, not the row count.

### Partition-guard masking by a colliding lineage-local id (see Edge Cases). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Partition-guard masking by a colliding lineage-local id (see Edge Cases).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Partition-guard masking by a colliding lineage-local id (see Edge Cases).

### Redundant `step_frontier_activate`: the reducer attributes visits from `active` rows. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Redundant `step_frontier_activate`: the reducer attributes visits from `active` rows.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Redundant `step_frontier_activate`: the reducer attributes visits from `active` rows.

### Removal of the remaining-iterations preflight as a regression (the spec retires it deliberately, specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/spec.md:108). -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Removal of the remaining-iterations preflight as a regression (the spec retires it deliberately, specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/spec.md:108).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Removal of the remaining-iterations preflight as a regression (the spec retires it deliberately, specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/012-pivot-hygiene/spec.md:108).

### Repeated `error instanceof Error ? error.message : String(error)` idiom: one-line idiom, below the rule-of-three value threshold for a helper. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Repeated `error instanceof Error ? error.message : String(error)` idiom: one-line idiom, below the rule-of-three value threshold for a helper.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Repeated `error instanceof Error ? error.message : String(error)` idiom: one-line idiom, below the rule-of-three value threshold for a helper.

### Research/review reducer generation drift on run_extended: research takes `max(run.generation, data.generation)`, review takes the scope generation. Both come from the same config generation in the extend step, so they cannot disagree in a recorded event. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Research/review reducer generation drift on run_extended: research takes `max(run.generation, data.generation)`, review takes the scope generation. Both come from the same config generation in the extend step, so they cannot disagree in a recorded event.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Research/review reducer generation drift on run_extended: research takes `max(run.generation, data.generation)`, review takes the scope generation. Both come from the same config generation in the extend step, so they cannot disagree in a recorded event.

### Review-pivot quotedPaths stripping as a guard bypass (.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:189): scope text is adapter-built from admitted frontier nodes and the pivot stays read-only by contract; security is outside this iteration's dimension. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Review-pivot quotedPaths stripping as a guard bypass (.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:189): scope text is adapter-built from admitted frontier nodes and the pivot stays read-only by contract; security is outside this iteration's dimension.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Review-pivot quotedPaths stripping as a guard bypass (.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:189): scope text is adapter-built from admitted frontier nodes and the pivot stays read-only by contract; security is outside this iteration's dimension.

### Separate catalog finding for commit-range relevance: duplicate of R1-P1-001's root cause. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Separate catalog finding for commit-range relevance: duplicate of R1-P1-001's root cause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Separate catalog finding for commit-range relevance: duplicate of R1-P1-001's root cause.

### Speculative object-form `reviewScopeFiles` support: matches terminal-gates' existing reader. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Speculative object-form `reviewScopeFiles` support: matches terminal-gates' existing reader.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Speculative object-form `reviewScopeFiles` support: matches terminal-gates' existing reader.

### Stale "completed-continue is deferred" text anywhere in the slice: none found; all copies updated. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Stale "completed-continue is deferred" text anywhere in the slice: none found; all copies updated.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Stale "completed-continue is deferred" text anywhere in the slice: none found; all copies updated.

### Undocumented default-path widening of the review floor: owned by 003 (003 spec.md:65), shipped floor 2 unchanged. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Undocumented default-path widening of the review floor: owned by 003 (003 spec.md:65), shipped floor 2 unchanged.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Undocumented default-path widening of the review floor: owned by 003 (003 spec.md:65), shipped floor 2 unchanged.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Iteration 1: frontier cycle-check bypass, node-id collision after a torn store line, default-run registry drift from the frontier key (all verified clean in frontier-admit.cjs / reduce-state.cjs).
- Iteration 2: env widening via guardContext.env (allowlist still filters), lineage-store or graph-output path traversal (label and fixed paths), upsert row content reaching shell or writes.
- Iteration 3: undocumented default-path review floor widening (owned by 003), undocumented research block step (frontier-admit-script.md:35), separate catalog finding for commit-range relevance (duplicate of R1-P1-001).
- Iteration 4: stale 'completed-continue deferred' wording (all copies updated), divergent fanout_graph_store copies (identical text).
- Iteration 5: dead budgetSplit key (read at reduce-state.cjs:1966-1970), redundant step_frontier_activate (reducer reads active rows, reduce-state.cjs:1940), speculative object-form reviewScopeFiles (mirrors terminal-gates), abstracting the two-copy half-budget node cap (below threshold).
- Iteration 6: comment-hygiene labels (clean), untested reducer/merge helpers (covered through CLIs), function-length lens noise, repeated error-message idiom (below rule of three).
- Iteration 7: partition-guard masking by lineage-local id collision, idle lineage reseeding, remaining-iterations preflight removal (deliberate per pivot-hygiene spec), inboxId/nodeId normalization mismatch, attempt-2 seat-event reuse.
- Iteration 10: 014 T001 ticked while open (same row records the close), 008 T004 REQUIRED_DIMENSIONS default params as routing leak, .vibe mirror missing the custom rule (one-line TOML string).
- Iteration 8: doc-host list in classifySourceLocation (anti-gaming requirement), reused-id `#iteration` split in deriveReviewFindingEvidence (mirrors reducer), attempt-1 config byte-identity rewrite (replay correctness), frontier merge plus partition guard (earned, shared by both loops).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (cap reached). Synthesis next. - Focus area: synthesis should carry R1-P1-001 and R2-P1-001 as the release-blocking items, and R3-P2-002 with its refinement R10-P2-001 as the checklist follow-up. - Reason: iteration 10 is maxIterations. - Rotation status: 6/6 dimensions covered. Core protocols are recorded: spec_code partial, checklist_evidence partial. - Blocked/productive carry-forward: exhausted approaches unchanged. Productive: checking checklist claims by content rather than by cited line. - Required evidence: none further this run. Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot
- Continuity: no `handover.md`. `implementation-summary.md` continuity block is stale (last action "Generation 2 research synthesized", completion 0) although the tip commit says every phase is complete.
- Target pointers: 51 changed code and config files (`runtime/scripts/*.cjs`, `runtime/lib/**`, both workflow YAMLs, configs, agent tomls), 54 test files, 125 doc files (playbooks, feature catalogs, references, changelogs), and 48 packet docs. Highest churn: `frontier-admit.cjs` (1,138 lines), `reduce-state.cjs` (364), `deep-review.yaml` (355), `deep-research.yaml` (336), `divergent-pivot.ts` (293), `upsert.cjs` (291), `deep-research/scripts/reduce-state.cjs` (249), `fanout-merge.cjs` (238), `fanout-run.cjs` (158).
- Behavior claims: `spec.md` section 3 says expansive mode stays opt-in and default runs stay byte-identical for phases 010 and 011, while the defect fixes in 002-009, 012 and 013 change default-path behavior on purpose. Phase map in `spec.md` lists build order and per-phase scope; each child spec names its files.
- Reuse and conventions: append gateway is the only state-log writer; `convergence.cjs` is the only stop-decision computer; `frontier-admit.cjs` owns the node store.
- Review risks: the spec's Phase Documentation Map still shows every phase as `draft`. resource-map.md is not present; skipping coverage gate.
- Executor note: native executor; the dispatch passes model opus and effort medium on the Agent call, because the native executor kind accepts no model or effort field in config.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 10 | owner of minIterations widening traced (003); R1-P1-001 commit-range relevance gap still active |
| `checklist_evidence` | core | partial | 10 | ticked rows verified; 010/011 P0 rows open on Complete phases; 010 CHK-032 unmet (R10-P2-001) |
| `skill_agent` | overlay | pending | - | - |
| `agent_cross_runtime` | overlay | pass | 10 | custom-dimension rule in canonical agent and all five mirrors |
| `feature_catalog_code` | overlay | pending | - | - |
| `playbook_capability` | overlay | pending | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
Code and config files listed below; the full 278-path scope (tests, docs, packet docs) is `reviewScopeFiles` in `deep-review-config.json`.

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.codex/agents/deep-research.toml` | none | - | - | pending |
| `.codex/agents/deep-review.toml` | none | - | - | pending |
| `.dsh/agents/deep-research.patch.yml` | none | - | - | pending |
| `.dsh/agents/deep-review.patch.yml` | none | - | - | pending |
| `.gitignore` | none | - | - | pending |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json` | none | - | - | pending |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | none | - | - | pending |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | none | - | - | pending |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | none | - | - | pending |
| `.skilled/commands/deep/assets/deep-research.yaml` | none | - | - | pending |
| `.skilled/commands/deep/assets/deep-review-presentation.txt` | none | - | - | pending |
| `.skilled/commands/deep/assets/deep-review.yaml` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-research/scripts/divergent-research-pivot.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-review/assets/prompt-pack-iteration.md.tmpl` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/deep-review/scripts/render-contract-snapshot.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/description.json` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/graph-metadata.json` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/hub-router.json` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/mode-registry.json` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-query.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/coverage-graph/coverage-graph-signals.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/continuity-thread.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-schema.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-schema.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-ledger-schema/deep-review-ledger-types.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-review-reducers/deep-review-reducer.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-contract.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-review-state-contract.ts` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/dispatch-iteration.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/divergent-pivot.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs` | none | - | - | pending |
| `.skilled/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs` | none | - | - | pending |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | none | - | - | pending |
| `.skilled/skills/system-spec-kit/runtime/cli/optimizer/optimizer-manifest.json` | none | - | - | pending |
| `.vibe/agents/deep-research.toml` | none | - | - | pending |
| `.vibe/agents/deep-review.toml` | none | - | - | pending |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 10
- Convergence threshold: 0.10
- Stop policy: max-iterations (minIterations 10)
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=2026-11-19T04:20:12.962Z, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: files
- Cross-reference checks: core=spec_code,checklist_evidence, overlay=skill_agent,agent_cross_runtime,feature_catalog_code,playbook_capability
- Started: 2026-11-19T04:20:12.962Z
<!-- MACHINE-OWNED: END -->
