# Deep Review Strategy - Session Tracking

Lineage: `review/lineages/dsflash-llmgw` (fan-out CLI lineage, executor cli-pi model deepseek-v4.1-flash).

## 1. OVERVIEW

### Purpose

Persistent brain for this review session. Records which dimensions remain, what was found (P0/P1/P2), what review approaches worked or failed, and where to focus next. Read at every iteration.

### Usage

- Init: copied from the deep-review strategy template and populated with Topic, Review Dimensions, Known Context, and Review Boundaries.
- Per iteration: read Next Focus, review the assigned dimension/files, update findings, mark dimensions complete, set new Next Focus.
- Mutability: mutable, shared state between orchestrator and iterations.

## 2. TOPIC

Review: `specs/sk-code/011-sk-code-poinytail-based-refinement/013-root-cause-and-ux-research/007-remediation-deep-review` (spec-folder). The product change under review is commits `fde8a56d87..8e1be919a4` on branch `worktrees/094-root-cause-ux-research`, scoped by `goal-file-manifest.txt` (30 files: compiled-routing tests and fixtures, the Pi dispatch guard and its test, README node floor, system-spec-kit 2.7.2.1 changelog/version, hook stdin deadline test, and the six phase docs).

<!-- ANCHOR:review-dimensions -->
## 3. REVIEW DIMENSIONS (remaining)
[All dimensions complete]

<!-- /ANCHOR:review-dimensions -->
## 4. NON-GOALS

- Changing any product file. Findings name the fix; a later phase builds it.
- Fixes 4 and 5 of the research, which the skill-authoring track owns.
- Auditing the derived artifacts (`runtime/data/trigger-index.json`, retrieval fixtures) by direct read; they are regenerated and belong to their generators' `--check` modes.
- The deferred `fork` and `completed-continue` lifecycle branches of deep-review.

## 5. STOP CONDITIONS

- Primary: `stopPolicy=max-iterations`, `maxIterations=5`. The lineage must run all five iterations; convergence before the cap is telemetry only.
- Convergence threshold 0.10 (weighted new-finding ratio) is recorded per iteration but does not stop this run.
- No-progress / stuck recovery: `stuckThreshold=2`.

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
- P2 (Suggestions): 1
- Resolved: 0

<!-- /ANCHOR:running-findings -->
## 8. WHAT WORKED

- Reading the closure trace output first (`--check` file list) before the copy loop, which made the authored-fixture propagation visible (iteration 1).
- Running each named regression command and recording exit codes instead of trusting commit messages (iteration 1).
- Confirming live guard behavior with a classifier probe plus the observed denial of this run's own setup command (iteration 1).
- Comparing two resolver functions on the same command list instead of reading one implementation (iteration 2); the two-column probe made the Pi wrapper gap unambiguous.
- Checking sibling adapters for the established pattern before recommending a fix (iteration 2).

## 9. WHAT FAILED

- The first probe syntax (top-level await, wrong relative depth) needed two rewrites before it ran; direct-run imports of the guard drag in an unresolved `hook-flags` path, so the probe imports only the classifier (iteration 1).
- The Pi preflight vitest suite could not be rerun inside the lineage write surface (cache writes outside it); its claim stays unverified (iteration 1).
- A bash command containing a variable expansion plus `-p` is denied by the reviewed guard, so probes must avoid that shape (iteration 1).
- Rerunning the Pi preflight vitest suite remains out of bounds for the lineage write surface, so the wrapper fix cannot be proven against its own suite from here (iteration 2).

### Iteration 3 reflections

- What worked: reading the committed close-out diff (`git show`) against the working tree separated scaffold state from committed claims; generator `--check` modes gave independent verdicts on mirrors and derived artifacts.
- What failed: `generate-trigger-index --check` reports five stale documents created by this packet's own untracked scaffold, so it cannot confirm the reviewed commits' claim in the current tree; attribution resolved by tracking the docs' commit status.

### Iterations 4-5 reflections

- What worked: the mutant probe (write at 100 ms) independently proved the late-write test's sensitivity; the closure rerun of `compiled-route-guard.cjs` completed the named regression set.
- What failed: the vitest Pi preflight suite and `validate.sh --strict` stay out of containment, so two commit claims remain unverified by this lane.

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **004's test pins only a phrase, not the whole guidance.** Ruled out: the phrase asserted is the actionable core; pinning the full sentence would make wording edits fail for no behavioral reason, and the commit's own before/after run covers the clause it added. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **004's test pins only a phrase, not the whole guidance.** Ruled out: the phrase asserted is the actionable core; pinning the full sentence would make wording edits fail for no behavioral reason, and the commit's own before/after run covers the clause it added.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **004's test pins only a phrase, not the whole guidance.** Ruled out: the phrase asserted is the actionable core; pinning the full sentence would make wording edits fail for no behavioral reason, and the commit's own before/after run covers the clause it added.

### **A hidden P0 appeared during closure.** Ruled out: all four dimensions and both core protocols completed with the three P1s unchanged; no P0 candidate survived adversarial re-read. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **A hidden P0 appeared during closure.** Ruled out: all four dimensions and both core protocols completed with the three P1s unchanged; no P0 candidate survived adversarial re-read.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **A hidden P0 appeared during closure.** Ruled out: all four dimensions and both core protocols completed with the three P1s unchanged; no P0 candidate survived adversarial re-read.

### **Admission pin at 86 is wrong.** Ruled out: suite 29/29 passes with the pin; the corpus count is asserted by the suite itself. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Admission pin at 86 is wrong.** Ruled out: suite 29/29 passes with the pin; the corpus count is asserted by the suite itself.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Admission pin at 86 is wrong.** Ruled out: suite 29/29 passes with the pin; the corpus count is asserted by the suite itself.

### **Derived `HUB_COUNT` hides a dropped hub.** Ruled out: `resolver.DEFAULT_ON_HUBS` is an independent seven-name hardcoded set [SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:37-45`], and `.skilled/bin/tests/compiled-route-manifest.test.cjs:1128` asserts its size equals `HUB_COUNT`, so a hub dropped from `sync.HUBS` fails the suite. This mirrors the risk row the phase-001 spec already accepted. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Derived `HUB_COUNT` hides a dropped hub.** Ruled out: `resolver.DEFAULT_ON_HUBS` is an independent seven-name hardcoded set [SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:37-45`], and `.skilled/bin/tests/compiled-route-manifest.test.cjs:1128` asserts its size equals `HUB_COUNT`, so a hub dropped from `sync.HUBS` fails the suite. This mirrors the risk row the phase-001 spec already accepted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Derived `HUB_COUNT` hides a dropped hub.** Ruled out: `resolver.DEFAULT_ON_HUBS` is an independent seven-name hardcoded set [SOURCE: `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/resolve.cjs:37-45`], and `.skilled/bin/tests/compiled-route-manifest.test.cjs:1128` asserts its size equals `HUB_COUNT`, so a hub dropped from `sync.HUBS` fails the suite. This mirrors the risk row the phase-001 spec already accepted.

### **Expanded-token handling in the classifier is injection-prone.** Ruled out as a separate finding: the same expanded-token state produces the iteration-1 false positive rather than an executable-injection path (nothing is executed by the classifier; it is a pure string classifier). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Expanded-token handling in the classifier is injection-prone.** Ruled out as a separate finding: the same expanded-token state produces the iteration-1 false positive rather than an executable-injection path (nothing is executed by the classifier; it is a pure string classifier).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Expanded-token handling in the classifier is injection-prone.** Ruled out as a separate finding: the same expanded-token state produces the iteration-1 false positive rather than an executable-injection path (nothing is executed by the classifier; it is a pure string classifier).

### **Manifest-test literal replacement is tautological against its own message.** Ruled out: `sync.HUBS` is the pinned served list [SOURCE: `.skilled/bin/compiled-route-sync.cjs:51-59`], and the assertions still cross-check the trace against a separate list (`FIXED_HUBS`, engine children). -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Manifest-test literal replacement is tautological against its own message.** Ruled out: `sync.HUBS` is the pinned served list [SOURCE: `.skilled/bin/compiled-route-sync.cjs:51-59`], and the assertions still cross-check the trace against a separate list (`FIXED_HUBS`, engine children).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Manifest-test literal replacement is tautological against its own message.** Ruled out: `sync.HUBS` is the pinned served list [SOURCE: `.skilled/bin/compiled-route-sync.cjs:51-59`], and the assertions still cross-check the trace against a separate list (`FIXED_HUBS`, engine children).

### **Missing parent changelog refresh.** Ruled out: the instruction is template boilerplate repeated across completed sibling packets, and no track packet has a `changelog/` directory; not a per-phase omission. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Missing parent changelog refresh.** Ruled out: the instruction is template boilerplate repeated across completed sibling packets, and no track packet has a `changelog/` directory; not a per-phase omission.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Missing parent changelog refresh.** Ruled out: the instruction is template boilerplate repeated across completed sibling packets, and no track packet has a `changelog/` directory; not a per-phase omission.

### **Parent phase-map placeholder is a close-out defect.** Ruled out: the placeholder row is uncommitted scaffold for the in-progress phase 7, absent from the close-out commit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **Parent phase-map placeholder is a close-out defect.** Ruled out: the placeholder row is uncommitted scaffold for the in-progress phase 7, absent from the close-out commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Parent phase-map placeholder is a close-out defect.** Ruled out: the placeholder row is uncommitted scaffold for the in-progress phase 7, absent from the close-out commit.

### **Secret disclosure through the reviewed guard.** Ruled out: the guard only returns static reason strings; the audit line scrubbing path is unchanged by the six commits. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **Secret disclosure through the reviewed guard.** Ruled out: the guard only returns static reason strings; the audit line scrubbing path is unchanged by the six commits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Secret disclosure through the reviewed guard.** Ruled out: the guard only returns static reason strings; the audit line scrubbing path is unchanged by the six commits.

### **Served canaries regressed from the fixture removal.** Ruled out: 0 failures across seven hubs. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: **Served canaries regressed from the fixture removal.** Ruled out: 0 failures across seven hubs.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Served canaries regressed from the fixture removal.** Ruled out: 0 failures across seven hubs.

### **The 006 late-write test is timing-flaky by construction.** Ruled out as a new finding: the observed margin (write 800 ms vs exit 551 ms) is wider than the write delay, and the test uses the suite's existing short-host envelope; a startup slower than 800 ms would be a new machine-level failure mode for the whole suite, not this case alone. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The 006 late-write test is timing-flaky by construction.** Ruled out as a new finding: the observed margin (write 800 ms vs exit 551 ms) is wider than the write delay, and the test uses the suite's existing short-host envelope; a startup slower than 800 ms would be a new machine-level failure mode for the whole suite, not this case alone.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The 006 late-write test is timing-flaky by construction.** Ruled out as a new finding: the observed margin (write 800 ms vs exit 551 ms) is wider than the write delay, and the test uses the suite's existing short-host envelope; a startup slower than 800 ms would be a new machine-level failure mode for the whole suite, not this case alone.

### **The close-out's trigger-index claim is false.** Ruled out as a claim defect: the current `--check` failure traces entirely to the untracked 007 packet created after the close-out commit. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **The close-out's trigger-index claim is false.** Ruled out as a claim defect: the current `--check` failure traces entirely to the untracked 007 packet created after the close-out commit.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The close-out's trigger-index claim is false.** Ruled out as a claim defect: the current `--check` failure traces entirely to the untracked 007 packet created after the close-out commit.

### **The guard's green status excuses the authored-tree defect.** Ruled out: the guard reads the served tree; the finding concerns the authored source a rebuild consumes. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **The guard's green status excuses the authored-tree defect.** Ruled out: the guard reads the served tree; the finding concerns the authored source a rebuild consumes.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The guard's green status excuses the authored-tree defect.** Ruled out: the guard reads the served tree; the finding concerns the authored source a rebuild consumes.

### **The long deny string violates a style gate.** Ruled out: no linter or formatter config applies to the path, and the file's existing message strings share the shape. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **The long deny string violates a style gate.** Ruled out: no linter or formatter config applies to the path, and the file's existing message strings share the shape.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **The long deny string violates a style gate.** Ruled out: no linter or formatter config applies to the path, and the file's existing message strings share the shape.

### `agent_cross_runtime` (overlay): pass. `.pi/extensions/dispatch-preflight-lint.ts` is byte-identical to the canonical guard; `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `agent_cross_runtime` (overlay): pass. `.pi/extensions/dispatch-preflight-lint.ts` is byte-identical to the canonical guard; `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `agent_cross_runtime` (overlay): pass. `.pi/extensions/dispatch-preflight-lint.ts` is byte-identical to the canonical guard; `sync-skills-hermes.cjs --check` prints `PASS: 70 Hermes skill copies in sync`.

### `checklist_evidence` (core): notApplicable (Level 1 folder has no checklist.md). -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `checklist_evidence` (core): notApplicable (Level 1 folder has no checklist.md).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): notApplicable (Level 1 folder has no checklist.md).

### `checklist_evidence` (core): notApplicable (no checklist.md at Level 1). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `checklist_evidence` (core): notApplicable (no checklist.md at Level 1).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): notApplicable (no checklist.md at Level 1).

### `checklist_evidence` (core): notApplicable. -- BLOCKED (iteration 5, 2 attempts)
- What was tried: `checklist_evidence` (core): notApplicable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): notApplicable.

### `checklist_evidence` (core): notApplicable. Level 1 folder has no `checklist.md`. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `checklist_evidence` (core): notApplicable. Level 1 folder has no `checklist.md`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `checklist_evidence` (core): notApplicable. Level 1 folder has no `checklist.md`.

### `feature_catalog_code` (overlay): partial. Catalog classification model contradicts shipped behavior for shell wrappers (P2 finding above). -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `feature_catalog_code` (overlay): partial. Catalog classification model contradicts shipped behavior for shell wrappers (P2 finding above).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `feature_catalog_code` (overlay): partial. Catalog classification model contradicts shipped behavior for shell wrappers (P2 finding above).

### `playbook_capability` (overlay): partial. Same contradiction, plus the playbook's own deny-contract section paraphrases the reason without the new guidance sentence; not treated as a separate defect. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `playbook_capability` (overlay): partial. Same contradiction, plus the playbook's own deny-contract section paraphrases the reason without the new guidance sentence; not treated as a separate defect.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `playbook_capability` (overlay): partial. Same contradiction, plus the playbook's own deny-contract section paraphrases the reason without the new guidance sentence; not treated as a separate defect.

### `skill_agent` (overlay): pass. system-spec-kit SKILL.md and changelog both carry 2.7.2.1; the changelog documents the late-write case and the helper option. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `skill_agent` (overlay): pass. system-spec-kit SKILL.md and changelog both carry 2.7.2.1; the changelog documents the late-write case and the helper option.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `skill_agent` (overlay): pass. system-spec-kit SKILL.md and changelog both carry 2.7.2.1; the changelog documents the late-write case and the helper option.

### `spec_code` (core): partial. Phase 001: REQ-001 `--check` exit 0 confirmed; REQ-002 manifest suite `fail 0` confirmed (42/42, `MANIFEST_EXIT=0`); SC-001 authored and served harness byte-identical confirmed (`diff` empty); SC-002 hub-count literal confirmed removed (`HUB_COUNT = sync.HUBS.length`, `.skilled/bin/tests/compiled-route-manifest.test.cjs:49`). Phase 002: pin at 86 confirmed by the passing suite; the pin's 86 could not be re-derived independently inside this lineage (the evidence report lives in the phase folder). Phase 003: canary removal confirmed in both fixture copies; served canaries 0 failures. Phase 006: version 2.7.2.1 present in canonical and Hermes SKILL.md and changelog; hook stdin suite 40/40. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: `spec_code` (core): partial. Phase 001: REQ-001 `--check` exit 0 confirmed; REQ-002 manifest suite `fail 0` confirmed (42/42, `MANIFEST_EXIT=0`); SC-001 authored and served harness byte-identical confirmed (`diff` empty); SC-002 hub-count literal confirmed removed (`HUB_COUNT = sync.HUBS.length`, `.skilled/bin/tests/compiled-route-manifest.test.cjs:49`). Phase 002: pin at 86 confirmed by the passing suite; the pin's 86 could not be re-derived independently inside this lineage (the evidence report lives in the phase folder). Phase 003: canary removal confirmed in both fixture copies; served canaries 0 failures. Phase 006: version 2.7.2.1 present in canonical and Hermes SKILL.md and changelog; hook stdin suite 40/40.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): partial. Phase 001: REQ-001 `--check` exit 0 confirmed; REQ-002 manifest suite `fail 0` confirmed (42/42, `MANIFEST_EXIT=0`); SC-001 authored and served harness byte-identical confirmed (`diff` empty); SC-002 hub-count literal confirmed removed (`HUB_COUNT = sync.HUBS.length`, `.skilled/bin/tests/compiled-route-manifest.test.cjs:49`). Phase 002: pin at 86 confirmed by the passing suite; the pin's 86 could not be re-derived independently inside this lineage (the evidence report lives in the phase folder). Phase 003: canary removal confirmed in both fixture copies; served canaries 0 failures. Phase 006: version 2.7.2.1 present in canonical and Hermes SKILL.md and changelog; hook stdin suite 40/40.

### `spec_code` (core): partial. The security lens does not change the phase-1..6 alignment results; commit 004's message still reaches `.pi/extensions` unchanged, and no phase doc claims a wrapper path was considered. -- BLOCKED (iteration 2, 1 attempts)
- What was tried: `spec_code` (core): partial. The security lens does not change the phase-1..6 alignment results; commit 004's message still reaches `.pi/extensions` unchanged, and no phase doc claims a wrapper path was considered.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): partial. The security lens does not change the phase-1..6 alignment results; commit 004's message still reaches `.pi/extensions` unchanged, and no phase doc claims a wrapper path was considered.

### `spec_code` (core): pass (unchanged from iteration 3). -- BLOCKED (iteration 4, 1 attempts)
- What was tried: `spec_code` (core): pass (unchanged from iteration 3).
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): pass (unchanged from iteration 3).

### `spec_code` (core): pass for the checked claims. Phase statuses are `Complete` for 001-006 and `In Progress` for 007; predecessor/successor chain is contiguous 001 -> 006 and 007 follows 006. Parent goal log matches the commits: 001 `fde8a56d87` sync exit 1->0 and manifest 26->42; 002 `48c4d4284f` admission 28->29; 003 `6df2b9c3b5` canaries 1->0; 004 `7cd3e8e5db` Pi 35->36; 005 `54f9d041fd`/`4a8a4065b6` README 20.19+; 006 `54b4547bff` hook 39->40 and version 2.7.2.1. Independent reruns in iterations 1-2 reproduced the after-numbers for 001, 002, 003 and 006; the 004 suite could not be rerun under containment and stays an unconfirmed claim. -- BLOCKED (iteration 3, 1 attempts)
- What was tried: `spec_code` (core): pass for the checked claims. Phase statuses are `Complete` for 001-006 and `In Progress` for 007; predecessor/successor chain is contiguous 001 -> 006 and 007 follows 006. Parent goal log matches the commits: 001 `fde8a56d87` sync exit 1->0 and manifest 26->42; 002 `48c4d4284f` admission 28->29; 003 `6df2b9c3b5` canaries 1->0; 004 `7cd3e8e5db` Pi 35->36; 005 `54f9d041fd`/`4a8a4065b6` README 20.19+; 006 `54b4547bff` hook 39->40 and version 2.7.2.1. Independent reruns in iterations 1-2 reproduced the after-numbers for 001, 002, 003 and 006; the 004 suite could not be rerun under containment and stays an unconfirmed claim.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): pass for the checked claims. Phase statuses are `Complete` for 001-006 and `In Progress` for 007; predecessor/successor chain is contiguous 001 -> 006 and 007 follows 006. Parent goal log matches the commits: 001 `fde8a56d87` sync exit 1->0 and manifest 26->42; 002 `48c4d4284f` admission 28->29; 003 `6df2b9c3b5` canaries 1->0; 004 `7cd3e8e5db` Pi 35->36; 005 `54f9d041fd`/`4a8a4065b6` README 20.19+; 006 `54b4547bff` hook 39->40 and version 2.7.2.1. Independent reruns in iterations 1-2 reproduced the after-numbers for 001, 002, 003 and 006; the 004 suite could not be rerun under containment and stays an unconfirmed claim.

### `spec_code` (core): pass. Closure rerun of `compiled-route-guard.cjs`: exit 0, "All hubs fresh or excused", confirming phase 001 REQ-003's guard claim alongside the earlier reruns. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: `spec_code` (core): pass. Closure rerun of `compiled-route-guard.cjs`: exit 0, "All hubs fresh or excused", confirming phase 001 REQ-003's guard claim alongside the earlier reruns.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `spec_code` (core): pass. Closure rerun of `compiled-route-guard.cjs`: exit 0, "All hubs fresh or excused", confirming phase 001 REQ-003's guard claim alongside the earlier reruns.

### Overlays: unchanged from iteration 3. -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Overlays: unchanged from iteration 3.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlays: unchanged from iteration 3.

### Overlays: unchanged; `feature_catalog_code` and `playbook_capability` stay partial on `R3-P2-001`. -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Overlays: unchanged; `feature_catalog_code` and `playbook_capability` stay partial on `R3-P2-001`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Overlays: unchanged; `feature_catalog_code` and `playbook_capability` stay partial on `R3-P2-001`.

<!-- /ANCHOR:exhausted-approaches -->
## 10A. SATURATED / SWEPT DIMENSIONS AND EXPANSION FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Swept: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

## 11. RULED OUT DIRECTIONS

[Review angles that were investigated and definitively eliminated -- consolidated from iteration dead-end data]

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
- Dimension: none (review complete; synthesis next) - Focus area: synthesis inputs — findings registry, five iteration records, delta files, report assembly - Reason: all dimensions covered, all named checks run, five of five iterations dispatched - Rotation status: complete - Blocked/productive carry-forward: 004 vitest rerun and strict validation remain out of containment; both caveated in the report - Required evidence: registry counts, iteration files 1..5, delta files 1..5 - Recovery note: none Review verdict: CONDITIONAL

<!-- /ANCHOR:next-focus -->
## 13. KNOWN CONTEXT

### Bounded Context Snapshot

- Target pointers: 30 files in `goal-file-manifest.txt`; six fix commits; phase docs under `001-*` .. `006-*`; parent packet `013-root-cause-and-ux-research`.
- Behavior claims to verify: each phase's `spec.md`/`goal.md`/`implementation-summary.md` against its commit; REQ-001 (five iteration records) and REQ-002 (report carries file:line plus confirming command or read) of `007/spec.md`; README Node floor 20.19+; system-spec-kit version 2.7.2.1.
- Reuse and conventions: `.skilled/repo-rules/prevent-overengineering.md`; comment hygiene (no spec paths/phase numbers/finding ids in code comments); severity scale P0/P1/P2 only.
- Review risks and gaps: resource-map.md absent, coverage gate skipped; derived artifacts checked via their generators only; the dispatch guard blocks shell commands containing a variable expansion plus `-p`/`--print`, including during this review run.
- Out-of-scope areas: product files are read-only; no fixes land in this phase.

## 14. CROSS-REFERENCE STATUS

<!-- MACHINE-OWNED: START -->
[Alignment checks completed across core and overlay protocols]

| Protocol | Level | Status | Iteration | Notes |
|----------|-------|--------|-----------|-------|
| `spec_code` | core | pass | 3 | phase claims checked; parent close-out log matches independent reruns for 001/002/003/006; 004 suite unconfirmed under containment |
| `checklist_evidence` | core | notApplicable | 1 | Level 1 folder has no checklist.md |
| `skill_agent` | overlay | pass | 3 | SKILL.md and changelog both 2.7.2.1 |
| `agent_cross_runtime` | overlay | pass | 3 | .pi/extensions guard byte-identical; sync-skills-hermes --check PASS 70 in sync |
| `feature_catalog_code` | overlay | partial | 3 | catalog wrapper claim contradicts shipped behavior (R3-P2-001) |
| `playbook_capability` | overlay | partial | 3 | playbook repeats the wrapper-as-ambiguous claim (R3-P2-001) |
<!-- MACHINE-OWNED: END -->

## 15. FILES UNDER REVIEW

<!-- MACHINE-OWNED: START -->
[Per-file coverage state table -- populated during initialization from scope discovery]

| File | Dimensions Reviewed | Last Iteration | Findings | Status |
|------|-------------------|----------------|----------|--------|
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | D1, D2 | 2 | 2 P1 | reviewed |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.test.ts` | D1, D2 | 2 |  | partial (suite not rerun) |
| `.skilled/bin/tests/compiled-route-manifest.test.cjs` | D1 | 1 | 0 | reviewed |
| `.skilled/bin/tests/compiled-route-admission.test.cjs` | D1 | 1 | 0 | reviewed |
| `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json` | D1 | 1 | 0 | reviewed |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json` | D1 | 1 | 0 | reviewed |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/009-parent-hub-rollout/008-cli-classifier/harness/build-artifacts.cjs` | D1 | 1 | 1 P1 | reviewed (stale sibling fixture) |
| `README.md` | D1 | 1 | 0 | reviewed |
| `.skilled/skills/system-spec-kit/SKILL.md` |  |  |  | pending |
| `.hermes/skills/system-spec-kit/SKILL.md` |  |  |  | pending |
| `.skilled/skills/system-spec-kit/changelog/v2.7.2.1.md` |  |  |  | pending |
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs` | D1 | 1 | 0 | reviewed |
| `001-compiled-route-manifest-suite/{spec,goal,implementation-summary}.md` |  |  |  | pending |
| `002-admission-corpus-pin/{spec,goal,implementation-summary}.md` |  |  |  | pending |
| `003-stale-jev-canary/{spec,goal,implementation-summary}.md` |  |  |  | pending |
| `004-pi-ambiguous-denial/{spec,goal,implementation-summary}.md` |  |  |  | pending |
| `005-readme-node-floor/{spec,goal,implementation-summary}.md` |  |  |  | pending |
| `006-hook-late-write-test/{spec,goal,implementation-summary}.md` |  |  |  | pending |
<!-- MACHINE-OWNED: END -->

## 16. REVIEW BOUNDARIES

<!-- MACHINE-OWNED: START -->
- Max iterations: 5
- Convergence threshold: 0.10
- Rolling STOP threshold: 0.08
- No-progress threshold: 0.05
- Coverage stabilization passes required: 1
- Session lineage: sessionId=fanout-dsflash-llmgw-1791667148881-n911tj, parentSessionId=null, generation=1, lineageMode=new
- Findings registry: `deep-review-findings-registry.json`
- Release-readiness states: in-progress | converged | release-blocking
- Per-iteration budget: 12 tool calls, 10 minutes
- Severity threshold: P2
- Review target type: spec-folder
- Cross-reference checks: core=[spec_code, checklist_evidence], overlay=[skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability]
- Started: 2026-10-10T21:22:12.815Z
<!-- MACHINE-OWNED: END -->
