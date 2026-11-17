# Deep Review Strategy - accuracy-runner-2 Lineage

## 1. REVIEW CHARTER

- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder target)
- Fan-out lineage: `accuracy-runner-2` (artifact dir `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/review/lineages/accuracy-runner-2`); pass-two area is `accuracy-runner`
- Dimensions: correctness, security, traceability, maintainability
- Stop conditions: legal convergence at `convergenceThreshold=0.10`, or `maxIterations=7`, whichever comes first
- Success criteria: every pass-one finding in the area re-verified; every file marked `yes` in `review-scope-2.txt` reviewed line by line; every area file covered at least once; findings carry `file:line` and a concrete input; holdout hygiene verified by counts only
- Review focus (operator bound): pass-two code review of command surfacing. Re-verify each pass-one fix in the area, review every file changed since pass one line by line for a defect the fix introduced, then look for new defects. Check behaviour on claude, codex, opencode, pi, devin and dsh; safety of offering a mutating command; holdout hygiene; docs that disagree with code.
- Resource map: `resource-map.md` not present; skipping coverage gate
- Baseline: pass one is closed at `review/review-report-pass-1.md`; its fixes landed in `b3b5ae8314` and `3b48f0e5f1`

---

## 2. TOPIC

Command surfacing behaviour for the routed skill/command advisor, restricted to the `accuracy-runner` area: the routing-accuracy measurement harness (`runtime/scripts/routing-accuracy/`), the prompt corpora and their committed baselines, the cost-measurement benches, the transcript/offer tests, the legacy fidelity tests and the manual-testing playbook that documents how to run them.

---

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Not reviewing `scorer-attach`, `render-hooks-plugin` or `doctor-install` area files except as read-only context when a cross-area contract is required
- Not fixing anything: the review is observation-only
- Not reading or printing holdout prompt text; holdout coverage is counts-only
- Not re-reporting a pass-one finding whose fix holds, the deferred items in report section 8, `R4-P2-003`, or the refuted finding
- Not running repo tooling that writes outside the lineage; runners are audited by reading, and only the single-file vitest commands the dispatch allows were run

---

## 5. STOP CONDITIONS

- Legal convergence (all dimensions covered plus stabilization) at or below `convergenceThreshold`
- `maxIterations=7` reached (`stopReason: maxIterationsReached`)
- Any active P0 blocks a PASS verdict but does not stop iteration dispatch by itself; the P0 override keeps `newFindingsRatio >= 0.50`

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
- P2 (Suggestions): 12
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED
- Re-reading each fix at its cited line and then running the two guard files turned the fix replay into observed evidence instead of a doc comparison (iteration 1).
- Counting the corpus and baseline by `id`, `split` and `row_type` proved holdout hygiene without ever printing prompt text (iteration 1).
- Asking "which caller reaches this line" found the g2 `--row-id` arm defect: the selection code and `armFor` disagree only on a path neither file's comment covers (iteration 2).
- Reading `finally` against every mutation the `try` makes found that only the clock and the temp directory are restored, not the environment (iteration 2).
- Re-deriving every spec floor from the committed baseline turned traceability into arithmetic, and all five floors held (iteration 4).
- Comparing each doc line with the tree or the function it names exposed two playbook statements and one test-table description that a green gate cannot catch (iteration 4).
- A local `git init` probe turned the porcelain quoting question into an observed fact instead of a guess, which is what raised the restore finding from suspicion to evidence (iteration 5).
- Replaying every active finding before the final iteration kept the terminal counts honest and closed the coverage map without a new finding (iteration 6-7).

---

## 9. WHAT FAILED
- The phase-map fix cannot be confirmed from the parent map: its reason sits only in `007/tasks.md`, so the pass-one item is reported again rather than closed (iteration 1).
- An early suspicion that `parseOffer` swallows a trailing word failed the reach test: the renderer never prints a bare word after the command, so it stays ruled out rather than a finding (iteration 2).
- A first read of the playbook's "41 `NNN-*.md`" note looked like a missing-file report; the tree shows 50 differently named files, so the finding was narrowed to the note (iteration 4).
- A first read of the legacy parity comment looked like it contradicted its accepted list; the list's own "reviewed-accepted divergence" wording resolved it, so it stayed ruled out (iteration 5).
- The coverage graph was unavailable in every iteration, so the loop could not claim a legal graph-backed STOP and stopped at the cap instead (iteration 7).

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`backfillRunLog` writing a partial log.** Ruled out: every prompt is resolved before the first line is written. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`backfillRunLog` writing a partial log.** Ruled out: every prompt is resolved before the first line is written.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`backfillRunLog` writing a partial log.** Ruled out: every prompt is resolved before the first line is written.

### **`capturedAtSha` points at a commit outside the history.** Ruled out by `git merge-base --is-ancestor`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`capturedAtSha` points at a commit outside the history.** Ruled out by `git merge-base --is-ancestor`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`capturedAtSha` points at a commit outside the history.** Ruled out by `git merge-base --is-ancestor`.

### **`measure-brief-cost.mjs` leaking a prompt.** Ruled out: output rows carry id and sizes only, and a refused row prints its id, never its prompt. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`measure-brief-cost.mjs` leaking a prompt.** Ruled out: output rows carry id and sizes only, and a refused row prints its id, never its prompt.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`measure-brief-cost.mjs` leaking a prompt.** Ruled out: output rows carry id and sizes only, and a refused row prints its id, never its prompt.

### **`measure-embedder-cost.mjs` claiming it starts nothing while spawning the CLI.** Ruled out: the claim is about the model server, and the script starts none. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`measure-embedder-cost.mjs` claiming it starts nothing while spawning the CLI.** Ruled out: the claim is about the model server, and the script starts none.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`measure-embedder-cost.mjs` claiming it starts nothing while spawning the CLI.** Ruled out: the claim is about the model server, and the script starts none.

### **`needsModeRows` publishing a holdout id.** Ruled out by the `publishRow` guard before the push and by the baseline scan (0 of 44). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`needsModeRows` publishing a holdout id.** Ruled out by the `publishRow` guard before the push and by the baseline scan (0 of 44).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`needsModeRows` publishing a holdout id.** Ruled out by the `publishRow` guard before the push and by the baseline scan (0 of 44).

### **`offerReached` still counting `unknown` as reached.** Ruled out: the packet's SC-002 pins that rule, and the pass-one fix corrected the README rather than the code. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **`offerReached` still counting `unknown` as reached.** Ruled out: the packet's SC-002 pins that rule, and the pass-one fix corrected the README rather than the code.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`offerReached` still counting `unknown` as reached.** Ruled out: the packet's SC-002 pins that rule, and the pass-one fix corrected the README rather than the code.

### **`parseOffer` reading a trailing word as part of the command.** Ruled out for the renderer's own head shape: after the command comes ` (policy)` or a space and a digit, and neither matches the optional second word. A two-word tracked command such as `/doctor:overlay apply` is matched whole, which is the intent. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`parseOffer` reading a trailing word as part of the command.** Ruled out for the renderer's own head shape: after the command comes ` (policy)` or a space and a digit, and neither matches the optional second word. A two-word tracked command such as `/doctor:overlay apply` is matched whole, which is the intent.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`parseOffer` reading a trailing word as part of the command.** Ruled out for the renderer's own head shape: after the command comes ` (policy)` or a space and a digit, and neither matches the optional second word. A two-word tracked command such as `/doctor:overlay apply` is matched whole, which is the intent.

### **`replayOffer` replaying the wrong hook for a non-Claude runtime.** Documented design: the head is the only text that names command and policy, and the replay is explicitly the Claude hook (`README.md:71`). Re-reporting it would be a deferred-item repeat, not a new defect. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`replayOffer` replaying the wrong hook for a non-Claude runtime.** Documented design: the head is the only text that names command and policy, and the replay is explicitly the Claude hook (`README.md:71`). Re-reporting it would be a deferred-item repeat, not a new defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`replayOffer` replaying the wrong hook for a non-Claude runtime.** Documented design: the head is the only text that names command and policy, and the replay is explicitly the Claude hook (`README.md:71`). Re-reporting it would be a deferred-item repeat, not a new defect.

### **A corpus or fixture drift.** Ruled out by row and id counts. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A corpus or fixture drift.** Ruled out by row and id counts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A corpus or fixture drift.** Ruled out by row and id counts.

### **A holdout leak through the fixtures.** Ruled out: the fixtures are golden and regression cases, not the holdout split; no holdout id appears in either. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A holdout leak through the fixtures.** Ruled out: the fixtures are golden and regression cases, not the holdout split; no holdout id appears in either.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A holdout leak through the fixtures.** Ruled out: the fixtures are golden and regression cases, not the holdout split; no holdout id appears in either.

### **A holdout row reaching the scorer through `--summary`.** Ruled out: the label map marks it and `scoreRun` returns `holdout_row` before `loadSession`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A holdout row reaching the scorer through `--summary`.** Ruled out: the label map marks it and `scoreRun` returns `holdout_row` before `loadSession`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A holdout row reaching the scorer through `--summary`.** Ruled out: the label map marks it and `scoreRun` returns `holdout_row` before `loadSession`.

### **A measured turn inheriting the operator's SSH agent, cloud profile or npm token.** Ruled out by the allowlist and by the observed guard test. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **A measured turn inheriting the operator's SSH agent, cloud profile or npm token.** Ruled out by the allowlist and by the observed guard test.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A measured turn inheriting the operator's SSH agent, cloud profile or npm token.** Ruled out by the allowlist and by the observed guard test.

### **A regression introduced by the pass-one fixes that the active findings missed.** Ruled out for the changed regions: every fix was re-read and the two guard suites pass. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A regression introduced by the pass-one fixes that the active findings missed.** Ruled out for the changed regions: every fix was re-read and the two guard suites pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A regression introduced by the pass-one fixes that the active findings missed.** Ruled out for the changed regions: every fix was re-read and the two guard suites pass.

### **A rename restored on one side only.** Ruled out: both sides of the porcelain ` -> ` pair are keys. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A rename restored on one side only.** Ruled out: both sides of the porcelain ` -> ` pair are keys.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A rename restored on one side only.** Ruled out: both sides of the porcelain ` -> ` pair are keys.

### **A restore gap for staged new files.** Ruled out: `restorePath` drops the index entry and deletes the file, and the test covers it. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A restore gap for staged new files.** Ruled out: `restorePath` drops the index entry and deletes the file, and the test covers it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A restore gap for staged new files.** Ruled out: `restorePath` drops the index entry and deletes the file, and the test covers it.

### **A routing floor has drifted from the committed baseline.** Ruled out by re-deriving all five numbers. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **A routing floor has drifted from the committed baseline.** Ruled out by re-deriving all five numbers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A routing floor has drifted from the committed baseline.** Ruled out by re-deriving all five numbers.

### **A stale legacy-test expectation after the health-record change.** Ruled out: `advisor-observability` and `advisor-privacy` build health from explicit records, and the runtime-label test drops retired labels as before. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **A stale legacy-test expectation after the health-record change.** Ruled out: `advisor-observability` and `advisor-privacy` build health from explicit records, and the runtime-label test drops retired labels as before.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A stale legacy-test expectation after the health-record change.** Ruled out: `advisor-observability` and `advisor-privacy` build health from explicit records, and the runtime-label test drops retired labels as before.

### **An arena that carries a `.env` file through a copied build tree.** Ruled out by `holdsDotenv` plus the name filter at every depth; a symlinked directory is copied as a link. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **An arena that carries a `.env` file through a copied build tree.** Ruled out by `holdsDotenv` plus the name filter at every depth; a symlinked directory is copied as a link.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An arena that carries a `.env` file through a copied build tree.** Ruled out by `holdsDotenv` plus the name filter at every depth; a symlinked directory is copied as a link.

### **Bench matrix still two runtimes.** Ruled out by the seven keys and the shared tuple; the bench's exclusion from the default test glob is documented and is the reason pass one found it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Bench matrix still two runtimes.** Ruled out by the seven keys and the shared tuple; the bench's exclusion from the default test glob is documented and is the reason pass one found it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Bench matrix still two runtimes.** Ruled out by the seven keys and the shared tuple; the bench's exclusion from the default test glob is documented and is the reason pass one found it.

### **Calling the run converged.** Rejected: the graph-backed STOP was unavailable and the cap was reached. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Calling the run converged.** Rejected: the graph-backed STOP was unavailable and the cap was reached.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Calling the run converged.** Rejected: the graph-backed STOP was unavailable and the cap was reached.

### **Holding a P2 as a P1 to make the report look thorough.** Rejected: every P2's reach was tested, and the two closest (log-path execution, quoted-path restore) need a non-default input. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Holding a P2 as a P1 to make the report look thorough.** Rejected: every P2's reach was tested, and the two closest (log-path execution, quoted-path restore) need a non-default input.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Holding a P2 as a P1 to make the report look thorough.** Rejected: every P2's reach was tested, and the two closest (log-path execution, quoted-path restore) need a non-default input.

### **NC-011's deep-loop gate description is stale after the pass-one fix.** Ruled out by reading the chapter's expected signals against `command-attach.ts`'s effort gate. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **NC-011's deep-loop gate description is stale after the pass-one fix.** Ruled out by reading the chapter's expected signals against `command-attach.ts`'s effort gate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **NC-011's deep-loop gate description is stale after the pass-one fix.** Ruled out by reading the chapter's expected signals against `command-attach.ts`'s effort gate.

### **Re-opening the pass-one credential and holdout items at P1.** Rejected: the fixes hold and the replay rows pass with evidence. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: **Re-opening the pass-one credential and holdout items at P1.** Rejected: the fixes hold and the replay rows pass with evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Re-opening the pass-one credential and holdout items at P1.** Rejected: the fixes hold and the replay rows pass with evidence.

### **README inventory count still drifting.** Ruled out by recounting both the code files (14) and the listed entries (21 of 21). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **README inventory count still drifting.** Ruled out by recounting both the code files (14) and the listed entries (21 of 21).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **README inventory count still drifting.** Ruled out by recounting both the code files (14) and the listed entries (21 of 21).

### **The `.env` copy guard missing in the arena builder.** Not reached this iteration; the builder's `holdsDotenv`/`DOTENV_PATTERN` path is iteration 3's security pass. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **The `.env` copy guard missing in the arena builder.** Not reached this iteration; the builder's `holdsDotenv`/`DOTENV_PATTERN` path is iteration 3's security pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The `.env` copy guard missing in the arena builder.** Not reached this iteration; the builder's `holdsDotenv`/`DOTENV_PATTERN` path is iteration 3's security pass.

### **The labeled corpus changed size under the parity test's 195-row assertion.** Ruled out by the row count. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The labeled corpus changed size under the parity test's 195-row assertion.** Ruled out by the row count.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The labeled corpus changed size under the parity test's 195-row assertion.** Ruled out by the row count.

### **The legacy parity test's accepted list contradicting its comment.** Ruled out: the list is explicitly "reviewed-accepted top-1 divergence", so `rr-iter3-105`'s presence matches "accepted as a divergence, not as correct". -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The legacy parity test's accepted list contradicting its comment.** Ruled out: the list is explicitly "reviewed-accepted top-1 divergence", so `rr-iter3-105`'s presence matches "accepted as a divergence, not as correct".
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The legacy parity test's accepted list contradicting its comment.** Ruled out: the list is explicitly "reviewed-accepted top-1 divergence", so `rr-iter3-105`'s presence matches "accepted as a divergence, not as correct".

### **The legacy parity test's expectation history missing a step.** Ruled out: the final sentence records the `rr-iter3-076` move that takes the pair from 116/111 to 117/112. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The legacy parity test's expectation history missing a step.** Ruled out: the final sentence records the `rr-iter3-076` move that takes the pair from 116/111 to 117/112.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The legacy parity test's expectation history missing a step.** Ruled out: the final sentence records the `rr-iter3-076` move that takes the pair from 116/111 to 117/112.

### **The run log itself being outside the restore's reach.** Not a gap: a log written after the closing snapshot is never a changed path, and a turn that edits it fails `restored` rather than passing silently. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The run log itself being outside the restore's reach.** Not a gap: a log written after the closing snapshot is never a changed path, and a turn that edits it fails `restored` rather than passing silently.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The run log itself being outside the restore's reach.** Not a gap: a log written after the closing snapshot is never a changed path, and a turn that edits it fails `restored` rather than passing silently.

### **The two baselines pin different scoring dates.** Ruled out: both are `2026-10-11`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The two baselines pin different scoring dates.** Ruled out: both are `2026-10-11`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The two baselines pin different scoring dates.** Ruled out: both are `2026-10-11`.

### `agent_cross_runtime`: partial. Read evidence for six runtimes; live proof stays phase 007's. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. Read evidence for six runtimes; live proof stays phase 007's.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. Read evidence for six runtimes; live proof stays phase 007's.

### `agent_cross_runtime`: partial. Read evidence only; live per-runtime proof stays phase 007's. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. Read evidence only; live per-runtime proof stays phase 007's.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. Read evidence only; live per-runtime proof stays phase 007's.

### `agent_cross_runtime`: partial. The arm and fixture defects are runtime-independent (they affect the log before any runtime runs), so no new per-runtime claim is made. The six argv tables were not re-read this iteration. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. The arm and fixture defects are runtime-independent (they affect the log before any runtime runs), so no new per-runtime claim is made. The six argv tables were not re-read this iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. The arm and fixture defects are runtime-independent (they affect the log before any runtime runs), so no new per-runtime claim is made. The six argv tables were not re-read this iteration.

### `agent_cross_runtime`: partial. The per-runtime proof is still phase 007's; no new per-runtime claim is made from the docs. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. The per-runtime proof is still phase 007's; no new per-runtime claim is made from the docs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. The per-runtime proof is still phase 007's; no new per-runtime claim is made from the docs.

### `agent_cross_runtime`: partial. The restore defect is runtime-independent; the per-runtime proof stays phase 007's. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `agent_cross_runtime`: partial. The restore defect is runtime-independent; the per-runtime proof stays phase 007's.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: partial. The restore defect is runtime-independent; the per-runtime proof stays phase 007's.

### `agent_cross_runtime`: pass for the credential boundary. The allowlist applies before any runtime argv is built, so the six runtimes share one boundary; the per-runtime proof is still phase 007's. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime`: pass for the credential boundary. The allowlist applies before any runtime argv is built, so the six runtimes share one boundary; the per-runtime proof is still phase 007's.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: pass for the credential boundary. The allowlist applies before any runtime argv is built, so the six runtimes share one boundary; the per-runtime proof is still phase 007's.

### `agent_cross_runtime`: pass for this iteration's scope. The six runtime argv tables and the runtime-keyed bench matrix were read; the end-to-end per-runtime proof stays open with phase 007 and is not claimed here. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `agent_cross_runtime`: pass for this iteration's scope. The six runtime argv tables and the runtime-keyed bench matrix were read; the end-to-end per-runtime proof stays open with phase 007 and is not claimed here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime`: pass for this iteration's scope. The six runtime argv tables and the runtime-keyed bench matrix were read; the end-to-end per-runtime proof stays open with phase 007 and is not claimed here.

### `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain the only closure gap, and the parent phase map note is iteration 1's finding. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain the only closure gap, and the parent phase map note is iteration 1's finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain the only closure gap, and the parent phase map note is iteration 1's finding.

### `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain, and the map note is iteration 1's finding. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain, and the map note is iteration 1's finding.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain, and the map note is iteration 1's finding.

### `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. No parent checklist; phase 007's open rows remain.

### `checklist_evidence`: partial. No parent checklist; phase 007's open tasks are the only security-relevant closure gap recorded. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence`: partial. No parent checklist; phase 007's open tasks are the only security-relevant closure gap recorded.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. No parent checklist; phase 007's open tasks are the only security-relevant closure gap recorded.

### `checklist_evidence`: partial. No parent checklist; the phase 007 note remains the only closure evidence for the per-runtime proof. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence`: partial. No parent checklist; the phase 007 note remains the only closure evidence for the per-runtime proof.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. No parent checklist; the phase 007 note remains the only closure evidence for the per-runtime proof.

### `checklist_evidence`: partial. Phase 007's T020/T046 and AC-004/005/007 remain open; the parent map note is finding 1. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `checklist_evidence`: partial. Phase 007's T020/T046 and AC-004/005/007 remain open; the parent map note is finding 1.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. Phase 007's T020/T046 and AC-004/005/007 remain open; the parent map note is finding 1.

### `checklist_evidence`: partial. The parent packet holds no checklist; its closure rows live in the phase children. Phase 007's T020/T046 and AC-004/005/007 are open by the note at `007/tasks.md:141`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence`: partial. The parent packet holds no checklist; its closure rows live in the phase children. Phase 007's T020/T046 and AC-004/005/007 are open by the note at `007/tasks.md:141`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence`: partial. The parent packet holds no checklist; its closure rows live in the phase children. Phase 007's T020/T046 and AC-004/005/007 are open by the note at `007/tasks.md:141`.

### `feature_catalog_code`: not re-checked this iteration; iteration 4 covers it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `feature_catalog_code`: not re-checked this iteration; iteration 4 covers it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: not re-checked this iteration; iteration 4 covers it.

### `feature_catalog_code`: pass (carried from iteration 4). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `feature_catalog_code`: pass (carried from iteration 4).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass (carried from iteration 4).

### `feature_catalog_code`: pass for the entries read. `feature-catalog/cli-surface/advisor-recommend.md` links NC-001/004/005 and its command semantics match the area; no contradiction found. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `feature_catalog_code`: pass for the entries read. `feature-catalog/cli-surface/advisor-recommend.md` links NC-001/004/005 and its command semantics match the area; no contradiction found.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass for the entries read. `feature-catalog/cli-surface/advisor-recommend.md` links NC-001/004/005 and its command semantics match the area; no contradiction found.

### `feature_catalog_code`: pass. -- BLOCKED (iteration 7, 2 attempts)
- What was tried: `feature_catalog_code`: pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pass.

### `feature_catalog_code`: pending. -- BLOCKED (iteration 3, 2 attempts)
- What was tried: `feature_catalog_code`: pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code`: pending.

### `playbook_capability`: not re-checked this iteration; iteration 4 covers it. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `playbook_capability`: not re-checked this iteration; iteration 4 covers it.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: not re-checked this iteration; iteration 4 covers it.

### `playbook_capability`: partial (root playbook statements carry iteration 4's findings; NC-011 holds). -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `playbook_capability`: partial (root playbook statements carry iteration 4's findings; NC-011 holds).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial (root playbook statements carry iteration 4's findings; NC-011 holds).

### `playbook_capability`: partial. NC-011 holds; the root playbook carries findings 7 and 8. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `playbook_capability`: partial. NC-011 holds; the root playbook carries findings 7 and 8.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial. NC-011 holds; the root playbook carries findings 7 and 8.

### `playbook_capability`: partial. NC-011 holds; the root playbook statements carry iteration 4's findings. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `playbook_capability`: partial. NC-011 holds; the root playbook statements carry iteration 4's findings.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial. NC-011 holds; the root playbook statements carry iteration 4's findings.

### `playbook_capability`: partial. NC-011's four prompts still match the fixed attach rules and its triage symbols resolve; the root playbook's inventory and persistence statements do not. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `playbook_capability`: partial. NC-011's four prompts still match the fixed attach rules and its triage symbols resolve; the root playbook's inventory and persistence statements do not.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: partial. NC-011's four prompts still match the fixed attach rules and its triage symbols resolve; the root playbook's inventory and persistence statements do not.

### `playbook_capability`: pending. -- BLOCKED (iteration 3, 2 attempts)
- What was tried: `playbook_capability`: pending.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability`: pending.

### `skill_agent`: notApplicable. -- BLOCKED (iteration 7, 6 attempts)
- What was tried: `skill_agent`: notApplicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: notApplicable.

### `skill_agent`: notApplicable. No agent definition owns this harness area. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `skill_agent`: notApplicable. No agent definition owns this harness area.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent`: notApplicable. No agent definition owns this harness area.

### `spec_code`: partial. The capture's published rows and the committed baseline still agree at the structural level (132 rows, no holdout ids). The three new findings are behaviour defects in the harness, not baseline drift, so no floor moved. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code`: partial. The capture's published rows and the committed baseline still agree at the structural level (132 rows, no holdout ids). The three new findings are behaviour defects in the harness, not baseline drift, so no floor moved.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The capture's published rows and the committed baseline still agree at the structural level (132 rows, no holdout ids). The three new findings are behaviour defects in the harness, not baseline drift, so no floor moved.

### `spec_code`: partial. The command-routing baseline's pinned numbers were re-read as structure: 176 corpus rows (44 typed on `none`, 45 plain `tune`, 44 plain `holdout`, 22 must-not-start, 9 near-miss, 12 slash-variant), 132 published rows, `needs_mode_floor` `{count: 1, total: 35}`. The phase-map row remains unexplained (finding 1). Full floor reconciliation belongs to iteration 4. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code`: partial. The command-routing baseline's pinned numbers were re-read as structure: 176 corpus rows (44 typed on `none`, 45 plain `tune`, 44 plain `holdout`, 22 must-not-start, 9 near-miss, 12 slash-variant), 132 published rows, `needs_mode_floor` `{count: 1, total: 35}`. The phase-map row remains unexplained (finding 1). Full floor reconciliation belongs to iteration 4.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The command-routing baseline's pinned numbers were re-read as structure: 176 corpus rows (44 typed on `none`, 45 plain `tune`, 44 plain `holdout`, 22 must-not-start, 9 near-miss, 12 slash-variant), 132 published rows, `needs_mode_floor` `{count: 1, total: 35}`. The phase-map row remains unexplained (finding 1). Full floor reconciliation belongs to iteration 4.

### `spec_code`: partial. The security-relevant rows of the spec (holdout hygiene, per-runtime proof, mutating-command policy) were checked at their code lines; the per-runtime proof stays open with phase 007. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code`: partial. The security-relevant rows of the spec (holdout hygiene, per-runtime proof, mutating-command policy) were checked at their code lines; the per-runtime proof stays open with phase 007.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: partial. The security-relevant rows of the spec (holdout hygiene, per-runtime proof, mutating-command policy) were checked at their code lines; the per-runtime proof stays open with phase 007.

### `spec_code`: pass. All five pinned routing numbers re-derive from the committed baseline and the pinned clock matches its source. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code`: pass. All five pinned routing numbers re-derive from the committed baseline and the pinned clock matches its source.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass. All five pinned routing numbers re-derive from the committed baseline and the pinned clock matches its source.

### `spec_code`: pass. Five floors and the pinned clock re-derived. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: `spec_code`: pass. Five floors and the pinned clock re-derived.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass. Five floors and the pinned clock re-derived.

### `spec_code`: pass. No new number claim was made this iteration; the five floors re-derived in iteration 4 still hold. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code`: pass. No new number claim was made this iteration; the five floors re-derived in iteration 4 still hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass. No new number claim was made this iteration; the five floors re-derived in iteration 4 still hold.

### `spec_code`: pass. No new number claim; iteration 4's five floors and the pinned clock hold. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `spec_code`: pass. No new number claim; iteration 4's five floors and the pinned clock hold.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code`: pass. No new number claim; iteration 4's five floors and the pinned clock hold.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS
[Review angles investigated and definitively eliminated]

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: synthesis - Focus area: compile the lineage report from the registry and the seven iteration files, then let the cross-lineage merge recompute the merged verdict - Reason: the cap is reached; no further iteration can change the active set without new evidence - Rotation status: all dimensions complete, stabilization and adjudication done - Blocked/productive carry-forward: blocked (no live arm, no graph); productive (fix replay, doc/tree comparison, restore probe) - Required evidence: the report's counts equal the registry's, and the final line is exactly one verdict Review verdict: PASS

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: the 31 `accuracy-runner` files in `review-scope-2.txt` (routing-accuracy runners/corpora, cost measurements, transcript/offer tests, legacy fidelity tests, the manual-testing playbook), plus shared docs that describe them.
- Behaviour claims to verify: routed command surfacing is cross-runtime correct (claude, codex, opencode, pi, devin, dsh); a mutating command is never offered unsafely; holdout rows are never read by tune/fix/report paths; docs match runner behaviour; pass-one fixes hold.
- Reuse and conventions: append-gateway state recording, P0/P1/P2 severity ladder, three-artifact iteration contract, pass-one report as the fix baseline.
- Review risks and gaps: holdout prompt text is out of read scope (counts only); the worktree is dirty from concurrent lineages, so a live behaviour arm would refuse with `worktree_dirty` and runners are audited by reading; the coverage graph is unavailable, so search is lexical and direct-read.

---

## 14. CROSS-REFERENCE STATUS
<!-- MACHINE-OWNED: START -->

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | [pending] | - | - |
| `checklist_evidence` | core | [pending] | - | - |
| `skill_agent` | overlay | [pending] | - | - |
| `agent_cross_runtime` | overlay | [pending] | - | - |
| `feature_catalog_code` | overlay | [pending] | - | - |
| `playbook_capability` | overlay | [pending] | - | - |
<!-- MACHINE-OWNED: END -->

---

## 15. FILES UNDER REVIEW
<!-- MACHINE-OWNED: START -->

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | D1, D3 | 5 | 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs` | D1, D3 | 4 | 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` | D1, D2, D4 | 5 | 2 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs` | D1, D2 | 5 | 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | D1, D3, D4 | 5 | 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs` | D2 | 3 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/worktree-restore.mjs` | D2, D4 | 5 | 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json` | D1, D3 | 4 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/scorer-eval-baseline.json` | D3 | 4 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` | D1, D2 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/labeled-prompts.jsonl` | D3 | 4 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/holdout-prompts.jsonl` | D3 | 4 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/ambiguity-prompts.jsonl` | D3 | 4 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/doctor-prompts.jsonl` | D3 | 4 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/measure-brief-cost.mjs` | D1 | 6 | 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/scripts/measure-embedder-cost.mjs` | D4 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/bench/hook-brief-signal-noise.bench.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/gate2-golden-prompts.jsonl` | D4 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/scripts/fixtures/skill-advisor-regression-cases.jsonl` | D4 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-behaviour-guards.vitest.ts` | D1, D2 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | D1 | 1 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-routing-slice.vitest.ts` | D1, D3 | 4 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/worktree-restore.vitest.ts` | D4 | 5 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/manual-testing-playbook.vitest.ts` | D3 | 4 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/README.md` | D3 | 6 | 1 P2 | partial |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-corpus-parity.vitest.ts` | D4 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-graph-health.vitest.ts` | D4 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-observability.vitest.ts` | D4 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/advisor-prompt-policy.vitest.ts` | D4 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/runtime/tests/legacy/runtime-label-removal.vitest.ts` | D4 | 6 | 0 | complete |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/manual-testing-playbook.md` | D3 | 4 | 2 P2 | partial |
| `.skilled/skills/system-skill-advisor/manual-testing-playbook/native-cli-tools/hub-command-attachment.md` | D3 | 4 | 0 | complete |
| `.skilled/skills/system-skill-advisor/README.md`, `ARCHITECTURE.md` | D3 | 4 | 0 | complete |
| `spec.md` (phase map) | D1 | 1 | 1 P2 | partial |

<!-- MACHINE-OWNED: END -->

---

## 16. REVIEW BOUNDARIES
<!-- MACHINE-OWNED: START -->
- Max iterations: 7
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-accuracy-runner-2-1794570021136-noekp0, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-11-13T11:48:49Z
<!-- MACHINE-OWNED: END -->
