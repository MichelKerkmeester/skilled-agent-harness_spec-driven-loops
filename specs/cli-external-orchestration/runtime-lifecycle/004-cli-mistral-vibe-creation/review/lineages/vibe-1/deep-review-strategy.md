# Deep Review Strategy - Session Tracking

## 2. TOPIC
Review of `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation` (spec-folder, Level 2 phase parent, 22 child phases). Focus: phases 013-022 and the 2026-11-15 fixes, plus the open lead that VIB-HK-005, 006 and 007 failed live after the automatic handover tier `e5b8611a4fa`.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS
- Re-running the live Vibe conversation runner (needs a live model and tmux); live evidence is read as recorded artifacts.
- Reviewing phases 001-012 except where a 013-022 claim depends on them.
- Reviewing the generated trigger index (`runtime/data/trigger-index.json`) or other build outputs.
- Editing any reviewed file: this lineage is read-only outside its own packet.

---

## 5. STOP CONDITIONS
- `config.maxIterations` = 5 reached (stopPolicy `max-iterations`).
- An active P0 that cannot be adjudicated inside the iteration budget.
- A required packet artifact missing or contradictory.

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
- P1 (Required): 3
- P2 (Suggestions): 10
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Repro-first on the operator lead: calling `buildCompactionPart` twice against one state dir, once with an empty goal env and once with `VIBE_SPEC_FOLDER`, reproduced the exact "fresh state dir returns it, live state dir does not" asymmetry in one run (iteration 1).
- Reading the `e5b8611a4fa` diff before blaming it: the commit only added the hand-over part, so the defect was correctly placed in `compaction-context.mjs` rather than in the new code (iteration 1).
- Comparing recorded evidence timestamps against the commit date: it turned a vague "the packet says PASS" into a dated traceability finding without running anything (iteration 2).
- Reading the guards before the gaps: naming every destructive path and its guard first kept the security pass from inflating two same-user P2s into P1s (iteration 3).
- Diffing the module headers against the `PARTS` arrays: `compaction-post-tool.mjs` and `turn-end.mjs` were updated by `e5b8611a4fa` and `turn-start.mjs` was not, which located the one stale ordering contract in a single read (iteration 4).
- Reading the test file for what it does *not* assert: the suite pins the no-watermark rule for the no-compaction case only, which explains why the iteration-1 defect shipped green (iteration 4).
- Running `git show <commit> -- <file>` instead of re-reading the file: three additive hunks settled the VIB-HK-005 premise in one call and turned a vague lead into a dated traceability finding (iteration 5).
- Grepping the whole feature catalog for the feature's own vocabulary (`re-inject`, `Context restored`, `watermark`): a zero-hit result is stronger evidence of absence than reading one section (iteration 5).

---

## 9. WHAT FAILED
- Treating the recorded live PASS rows as current: `VIB-HK-006/vibe/result.json` is stamped 06:34Z, before the 13:24Z commit, so the matrix rows cannot speak for the post-commit behaviour (iteration 1).
- Explaining the VIB-HK-005 save-nudge failure from the compaction root cause: the save nudge runs before the hand-over part and shares no state, so that lead stays open (iteration 1).
- Reading `022/implementation-summary.md` limitation 3 as covering the whole merge: it scopes out only VIB-HK-027, not the three scenarios the same merge changed (iteration 2).
- Expecting a security finding in the hand-over tier: every destructive path already carries a named guard, so the pass produced two P2 advisories rather than a P1 (iteration 3).
- Reading the `withdrawOnOperatorPrompt` comment as a description of the code: the comment reasons about a prompt, but the call passes only `sessionId` and `env`, so the guard it describes is not there (iteration 4).
- Treating the `--remove-home` fix as the interesting part of the maintainability pass: it is complete and consistent, so the pass had to move to the composer headers and the test file to find anything (iteration 4).
- Accepting the operator lead's file attribution without the diff: the lead names `turn-start.mjs`, but the commit only appends to it, so the 005 cause is not there (iteration 5).
- Grepping the packet tree for a scenario id: the pattern matched sibling lineage logs and returned 47 KB of another lineage's state, which is not evidence for this one (iteration 5).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`spec.md` phase-count drift.** The Phase Documentation Map lists 22 child phases and all 22 folders exist on disk. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`spec.md` phase-count drift.** The Phase Documentation Map lists 22 child phases and all 22 folders exist on disk.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`spec.md` phase-count drift.** The Phase Documentation Map lists 22 child phases and all 22 folders exist on disk.

### **A consume-without-inject defect in the save nudge.** `takeNudge` returns the count it stores, so the reminder and the cursor advance together. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A consume-without-inject defect in the save nudge.** `takeNudge` returns the count it stores, so the reminder and the cursor advance together.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A consume-without-inject defect in the save nudge.** `takeNudge` returns the count it stores, so the reminder and the cursor advance together.

### **A contradiction among the ten active findings.** Each names a distinct file and line; no two assert incompatible behaviour for the same surface. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A contradiction among the ten active findings.** Each names a distinct file and line; no two assert incompatible behaviour for the same surface.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A contradiction among the ten active findings.** Each names a distinct file and line; no two assert incompatible behaviour for the same surface.

### **A duplicate between R2-P2-001 and R5-P2-001.** R2-P2-001 is `.skilled/hooks/goal/README.md:80`; R5-P2-001 is the feature catalog. Different files, different claims. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A duplicate between R2-P2-001 and R5-P2-001.** R2-P2-001 is `.skilled/hooks/goal/README.md:80`; R5-P2-001 is the feature catalog. Different files, different claims.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A duplicate between R2-P2-001 and R5-P2-001.** R2-P2-001 is `.skilled/hooks/goal/README.md:80`; R5-P2-001 is the feature catalog. Different files, different claims.

### **A missing playbook scenario for the changed composers.** VIB-HK-005/006/007 exist and target exactly those composers; the gap is the run date, not the coverage. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **A missing playbook scenario for the changed composers.** VIB-HK-005/006/007 exist and target exactly those composers; the gap is the run date, not the coverage.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing playbook scenario for the changed composers.** VIB-HK-005/006/007 exist and target exactly those composers; the gap is the run date, not the coverage.

### **A missing test for the post-tool size gate.** `compaction-context.test.mjs:210-235` covers both the skip and the run; only the empty-text branch is uncovered (finding 2). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A missing test for the post-tool size gate.** `compaction-context.test.mjs:210-235` covers both the skip and the run; only the empty-text branch is uncovered (finding 2).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A missing test for the post-tool size gate.** `compaction-context.test.mjs:210-235` covers both the skip and the run; only the empty-text branch is uncovered (finding 2).

### **A stale `compaction-post-tool.mjs` or `turn-end.mjs` header.** Both were updated by the commit; only `turn-start.mjs` was missed. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A stale `compaction-post-tool.mjs` or `turn-end.mjs` header.** Both were updated by the commit; only `turn-start.mjs` was missed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale `compaction-post-tool.mjs` or `turn-end.mjs` header.** Both were updated by the commit; only `turn-start.mjs` was missed.

### **Command injection through the printed manual claim command.** Every argument is shell-quoted and the spec-folder suffix is charset-restricted. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Command injection through the printed manual claim command.** Every argument is shell-quoted and the spec-folder suffix is charset-restricted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Command injection through the printed manual claim command.** Every argument is shell-quoted and the spec-folder suffix is charset-restricted.

### **Dead code in the compaction detector.** Every exported function has a caller: `buildCompactionPart` from both composers, `buildPostToolPart` from the binding, `measureJournal` from the binding's default. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Dead code in the compaction detector.** Every exported function has a caller: `buildCompactionPart` from both composers, `buildPostToolPart` from the binding, `measureJournal` from the binding's default.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Dead code in the compaction detector.** Every exported function has a caller: `buildCompactionPart` from both composers, `buildPostToolPart` from the binding, `measureJournal` from the binding's default.

### **F11 unimplemented.** Both halves are present: `.vibe` in `overlay-engine.cjs:87` and the three checks in `doctor-runtime-mirrors.yaml:47-49`. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **F11 unimplemented.** Both halves are present: `.vibe` in `overlay-engine.cjs:87` and the three checks in `doctor-runtime-mirrors.yaml:47-49`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **F11 unimplemented.** Both halves are present: `.vibe` in `overlay-engine.cjs:87` and the three checks in `doctor-runtime-mirrors.yaml:47-49`.

### **F5 unimplemented.** Both the sender (`relaunch-core.cjs:1201-1211`) and the receiver (`goal-inject.mjs:33`) carry the fallback. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **F5 unimplemented.** Both the sender (`relaunch-core.cjs:1201-1211`) and the receiver (`goal-inject.mjs:33`) carry the fallback.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **F5 unimplemented.** Both the sender (`relaunch-core.cjs:1201-1211`) and the receiver (`goal-inject.mjs:33`) carry the fallback.

### **Part ordering as the VIB-HK-005 cause.** `composeTurnStart` awaits each part sequentially and the save nudge sits at index 3, before the appended `handoverPart`; the diff adds no reordering. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Part ordering as the VIB-HK-005 cause.** `composeTurnStart` awaits each part sequentially and the save nudge sits at index 3, before the appended `handoverPart`; the diff adds no reordering.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Part ordering as the VIB-HK-005 cause.** `composeTurnStart` awaits each part sequentially and the save nudge sits at index 3, before the appended `handoverPart`; the diff adds no reordering.

### **Path traversal through `SKILLED_LOOP_ID`.** `relaunchFilePath` rejects anything outside `[A-Za-z0-9._-]`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Path traversal through `SKILLED_LOOP_ID`.** `relaunchFilePath` rejects anything outside `[A-Za-z0-9._-]`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Path traversal through `SKILLED_LOOP_ID`.** `relaunchFilePath` rejects anything outside `[A-Za-z0-9._-]`.

### **Reader scope (the pre-fix VIB-HK-006 cause).** `vibe.mjs:79-102` now reads `CURRENT`, the generation manifest, the chunks and `projection-state.json`, and `withSnapshot` at `:116-124` merges them. The recorded diagnosis is closed. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Reader scope (the pre-fix VIB-HK-006 cause).** `vibe.mjs:79-102` now reads `CURRENT`, the generation manifest, the chunks and `projection-state.json`, and `withSnapshot` at `:116-124` merges them. The recorded diagnosis is closed.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Reader scope (the pre-fix VIB-HK-006 cause).** `vibe.mjs:79-102` now reads `CURRENT`, the generation manifest, the chunks and `projection-state.json`, and `withSnapshot` at `:116-124` merges them. The recorded diagnosis is closed.

### **Secret exposure through the killer's environment.** The child is `process.execPath` running the repository's own `killer.cjs`, so the inherited environment is not handed to an untrusted program. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Secret exposure through the killer's environment.** The child is `process.execPath` running the repository's own `killer.cjs`, so the inherited environment is not handed to an untrusted program.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Secret exposure through the killer's environment.** The child is `process.execPath` running the repository's own `killer.cjs`, so the inherited environment is not handed to an untrusted program.

### **Symlink escape through the goal packet.** `readPacketGoal` re-checks the real path against the real workspace root. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Symlink escape through the goal packet.** `readPacketGoal` re-checks the real path against the real workspace root.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Symlink escape through the goal packet.** `readPacketGoal` re-checks the real path against the real workspace root.

### **The `--remove-home` fix being incomplete.** The writable-then-delete path, the `vibe_home_removed` field and the usage text all agree. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The `--remove-home` fix being incomplete.** The writable-then-delete path, the `vibe_home_removed` field and the usage text all agree.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `--remove-home` fix being incomplete.** The writable-then-delete path, the `vibe_home_removed` field and the usage text all agree.

### **The catalog being uniformly Vibe-blind.** `feature-catalog.md:1112` names Vibe as a history-lookup sender, so the gap is two specific sections. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The catalog being uniformly Vibe-blind.** `feature-catalog.md:1112` names Vibe as a history-lookup sender, so the gap is two specific sections.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The catalog being uniformly Vibe-blind.** `feature-catalog.md:1112` names Vibe as a history-lookup sender, so the gap is two specific sections.

### **The hand-over part suppressing the compaction part.** `turn-start.mjs:92-101` orders the compaction part before the hand-over part, and `composeTurnStart` catches per part. Not the cause. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The hand-over part suppressing the compaction part.** `turn-start.mjs:92-101` orders the compaction part before the hand-over part, and `composeTurnStart` catches per part. Not the cause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The hand-over part suppressing the compaction part.** `turn-start.mjs:92-101` orders the compaction part before the hand-over part, and `composeTurnStart` catches per part. Not the cause.

### **Watermark directory resolution.** `stateDirFor` at `compaction-context.mjs:67-70` follows `payload.cwd` and falls back to the checkout, and the test at `compaction-context.test.mjs:129-139` pins it. Not the cause. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Watermark directory resolution.** `stateDirFor` at `compaction-context.mjs:67-70` follows `payload.cwd` and falls back to the checkout, and the test at `compaction-context.test.mjs:129-139` pins it. Not the cause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Watermark directory resolution.** `stateDirFor` at `compaction-context.mjs:67-70` follows `payload.cwd` and falls back to the checkout, and the test at `compaction-context.test.mjs:129-139` pins it. Not the cause.

### **Watermark file size overflow.** `readWatermark` at `:92` rejects a file over 4096 bytes, which would reset the floor to 0 and cause a repeat, not a suppression. 64 ids of 36 characters stay under the cap, so this is not the live cause. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Watermark file size overflow.** `readWatermark` at `:92` rejects a file over 4096 bytes, which would reset the floor to 0 and cause a repeat, not a suppression. 64 ids of 36 characters stay under the cap, so this is not the live cause.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Watermark file size overflow.** `readWatermark` at `:92` rejects a file over 4096 bytes, which would reset the floor to 0 and cause a repeat, not a suppression. 64 ids of 36 characters stay under the cap, so this is not the live cause.

### **Wrong-pid signal after a process-table read failure.** `isLoopAncestor` throws and the killer refuses rather than guessing. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Wrong-pid signal after a process-table read failure.** `isLoopAncestor` throws and the killer refuses rather than guessing.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Wrong-pid signal after a process-table read failure.** `isLoopAncestor` throws and the killer refuses rather than guessing.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
- Reader scope as the live cause: `vibe.mjs:79-124` now seeds from the committed snapshot generation and merges the journal tail, so the pre-fix VIB-HK-006 cause is closed (iteration 1, evidence: `vibe.mjs:79-124`).
- Watermark directory resolution: `stateDirFor` follows `payload.cwd` and the test at `compaction-context.test.mjs:129-139` pins it (iteration 1).
- Watermark file size overflow: a file over 4096 bytes resets the floor to 0 and causes a repeat, not a suppression (iteration 1, evidence: `compaction-context.mjs:92`).
- The hand-over part suppressing the compaction part: the compaction part is ordered first and each part is caught separately (iteration 1, evidence: `turn-start.mjs:92-101`).
- F11 unimplemented: `.vibe` is in `overlay-engine.cjs:87` and the three checks are in `doctor-runtime-mirrors.yaml:47-49` (iteration 2).
- F5 unimplemented: both `relaunch-core.cjs:1201-1211` and `goal-inject.mjs:33` carry the fallback (iteration 2).
- A missing playbook scenario for the changed composers: VIB-HK-005/006/007 exist and target them; the gap is the run date (iteration 2).
- Command injection through the printed manual claim command: every argument is shell-quoted and the spec-folder suffix is charset-restricted (iteration 3, evidence: `nudge.cjs:120-124`, `skilled-loop:836-857`, `relaunch-core.cjs:30-31`).
- Path traversal through `SKILLED_LOOP_ID`: `relaunchFilePath` rejects anything outside `[A-Za-z0-9._-]` (iteration 3, evidence: `relaunch-core.cjs:307-314`).
- Symlink escape through the goal packet: `readPacketGoal` re-checks the real path against the real workspace root (iteration 3, evidence: `goal-slice.cjs:443-462`).
- Wrong-pid signal after a process-table read failure: `isLoopAncestor` throws and the killer refuses (iteration 3, evidence: `killer.cjs:205-212`).
- Secret exposure through the killer environment: the child is the repository own `killer.cjs` (iteration 3).
- The `--remove-home` fix being incomplete: `run-conversation-scenario.cjs:1301-1315` makes the tree writable before `rmSync`, `:3274-3275` records `vibe_home_removed`, and `:3359` documents the flag (iteration 4).
- A stale `compaction-post-tool.mjs` or `turn-end.mjs` header: both were updated by `e5b8611a4fa`; only `turn-start.mjs` was missed (iteration 4).
- Dead code in the compaction detector: `buildCompactionPart`, `buildPostToolPart` and `measureJournal` all have callers (iteration 4).
- A missing test for the post-tool size gate: `compaction-context.test.mjs:210-235` covers both the skip and the run; only the empty-text branch is uncovered (iteration 4).
- Part ordering as the VIB-HK-005 cause: `composeTurnStart` awaits each part sequentially and the save nudge sits at index 3, before the appended `handoverPart` (iteration 5, evidence: `turn-start.mjs:124-141`).
- A consume-without-inject defect in the save nudge: `takeNudge` returns the count it stores, so the reminder and the cursor advance together (iteration 5, evidence: `capture-core.mjs:419-443`).
- The feature catalog being uniformly Vibe-blind: `feature-catalog.md:1112` names Vibe as a history-lookup sender, so the gap is two specific sections (iteration 5).
- A duplicate between R2-P2-001 and R5-P2-001: different files, different claims (iteration 5).
- A contradiction among the ten active findings: each names a distinct file and line (iteration 5).

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none remaining - Focus area: synthesis - Reason: all four dimensions and every overlay protocol are now covered; the iteration cap is reached - Rotation status: correctness, traceability, security, maintainability and cross-reference all reviewed - Blocked/productive carry-forward: productive -- the `git show` diff settled the 005 premise in one call - Required evidence: none; synthesis reads the registry

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: `.skilled/hooks/session-lifecycle/vibe/{turn-start,turn-end,compaction-post-tool,compaction-context}.mjs`, `.skilled/hooks/shared/session-readers/vibe.mjs`, `.skilled/hooks/session-handover/vibe/handover-parts.mjs`, `.skilled/hooks/session-handover/lib/relaunch-core.cjs`, `.skilled/hooks/goal/vibe/goal-inject.mjs`; packet docs `spec.md` and phases `013`-`022`.
- Behavior claims: Vibe has no compaction hook, so `compaction-context.mjs` re-injects the goal slice and the open handoff pointer once per compaction, at the next turn start or the next tool call. Every path "fails open" per the module header.
- Reuse and conventions: each composer part runs in its own try/catch and contributes nothing on failure; state lives under the payload `cwd`; the append gateway is the only state-log writer.
- Review risks and gaps: the live runner evidence under `022/scratch/live/` predates `e5b8611a4fa` for VIB-HK-005/006/007, so its PASS rows are stale relative to the operator's report. `resource-map.md` is absent, so the coverage gate is skipped.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->
| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | partial | 2 | The 018/022 claims hold for the reader and the F1/F2/F5/F11 fixes, but the 022 live-verdict claim does not cover the shipped composers. |
| `checklist_evidence` | core | fail | 2 | `022/tasks.md:90-92` mark T041-T043 `[x]` on evidence that predates `e5b8611a4fa`. |
| `skill_agent` | overlay | pass | 3 | `goal/README.md:80` and `:140` are stale; the session-lifecycle and session-handover READMEs match the code, including the killer ancestry guard. |
| `agent_cross_runtime` | overlay | notApplicable | 2 | No agent profile changed in the 2026-11-15 fixes. |
| `feature_catalog_code` | overlay | pending | - | Deferred to iteration 5. |
| `playbook_capability` | overlay | partial | 2 | The scenarios exist and the runner drives them, but their recorded verdicts are pre-change. |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->
| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/hooks/session-lifecycle/vibe/compaction-context.mjs` | D1 | 1 | 2 P1, 1 P2 | partial |
| `.skilled/hooks/session-lifecycle/vibe/compaction-post-tool.mjs` | D1 | 1 | 0 | complete |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | D1 | 1 | 0 | complete |
| `.skilled/hooks/shared/session-readers/vibe.mjs` | D1 | 1 | 0 | complete |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | D1 | 1 | 0 | complete |
| `.skilled/hooks/goal/vibe/goal-inject.mjs` | D1, D3 | 2 | 0 | complete |
| `022/implementation-summary.md` | D3 | 2 | 1 P1 | partial |
| `022/scratch/verdicts.md` | D3 | 2 | 0 | complete |
| `spec.md` | D3 | 2 | 1 P2 | partial |
| `.skilled/hooks/goal/README.md` | D3 | 2 | 1 P2 | partial |
| `.skilled/commands/doctor/assets/doctor-runtime-mirrors.yaml` | D3 | 2 | 0 | complete |
| `.skilled/hooks/session-handover/lib/relaunch-core.cjs` | D3, D2 | 3 | 0 | partial |
| `.skilled/hooks/session-handover/vibe/handover-parts.mjs` | D1, D2 | 3 | 1 P2 | partial |
| `.skilled/hooks/session-handover/lib/killer.cjs` | D2 | 3 | 0 | complete |
| `.skilled/hooks/session-handover/lib/nudge.cjs` | D2 | 3 | 0 | complete |
| `.skilled/hooks/goal/lib/goal-slice.cjs` | D2 | 3 | 0 | complete |
| `.skilled/bin/skilled-loop` | D2 | 3 | 0 | complete |
<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.1
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-vibe-1-1794765851303-zrv85l, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 24 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-15T18:10:03Z
<!-- MACHINE-OWNED: END -->
