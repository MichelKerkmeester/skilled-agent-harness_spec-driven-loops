---
title: "Feature Specification: Phase 3: lifecycle-lock-and-limits"
description: "Research restart is unreachable in auto mode and both loops lose the lineage values a restart sets. The packet lock can go stale during one long dispatch and later halts release it only through a prose catch-all. The 120-minute duration limit is written to config and read by nothing."
trigger_phrases:
  - "lifecycle lock and limits"
  - "phase 3 lifecycle lock and limits"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 3: lifecycle-lock-and-limits

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-11-14 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 5 |
| **Predecessor** | 002-persisted-loop-state-and-failure-policy |
| **Successor** | 004-workflow-single-source-and-drift-guard |
| **Handoff Criteria** | Phase 004 receives the same four step ids (`step_apply_lifecycle_request`, `step_record_restarted_run`, `step_release_lock`, `step_check_max_duration`) in all four workflow files and four test files that pass on the final tree: `workflow-restart-lifecycle.vitest.ts`, `workflow-lock-lifetime.vitest.ts`, `deep-research-lock-release.vitest.ts` and `workflow-max-duration.vitest.ts`. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 3** of the Fix every deep-research and deep-review workflow logic, drift and doc finding from the 2026-11-14 analysis specification.

**Scope Boundary**: This phase owns findings F06, F09 and F10. It changes the restart lifecycle, the lock lifetime, the lock release and the duration limit in the four deep-research and deep-review workflow files. It adds the research restart flags to the research command surface and the tests that guard all three. Single-sourcing the four workflow files is phase 004's job. Skill prose about the lifecycle is phase 005's job.

**Dependencies**:
- Phase 001 fixes the single stop-reason enum (`stop_reasons_enum` in the workflows, `STOP_REASONS` in `lifecycle-taxonomy.cjs`). Phase 001 adds the new member `maxDurationReached` to that enum, and the duration stop uses it.
- Phase 002 fixes persisted loop state and the failure policy. The shared release step runs on the halt paths phase 002 defines.

**Deliverables**:
- A research restart path that matches review's flags, ordering and recorded event.
- Restart paths in all four workflows that never move a held lock file and keep the new lineage values in the config.
- A lock lifetime that covers the longest allowed dispatch and one shared release step on every terminal path.
- An enforced `maxDurationMinutes` stop that still runs synthesis.
- Failing-first vitest files for each of the above.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
An operator cannot restart a deep-research run in auto mode, because the research command exposes no restart flag and `step_classify_session` never selects its `on_restart` branch. Every restart branch that does run, in research confirm and in both review workflows, moves the packet folder while the lock file inside it is held, and `step_create_config` then writes generation 1 and lineage mode `new` over the values the branch set. A single dispatch can outlast the lock's stale window, halts after initialization release the lock only through a prose catch-all. The 120-minute duration limit in every config is never read.

### Purpose
Make restart, lock lifetime, lock release and the duration limit behave as the workflow configs claim in both deep loops.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
```text
$ bash -c '
A=.skilled/commands/deep/assets; R=.skilled/skills/system-deep-loop/runtime
W="$A/deep-research-auto.yaml $A/deep-research-confirm.yaml $A/deep-review-auto.yaml $A/deep-review-confirm.yaml"
echo "## lock ttl"; rg -c -- "--ttl-ms 1800000" $W
echo "## stale rule"; rg -n "ttlMs \* 2" $R/lib/deep-loop/loop-lock.ts
echo "## dispatch cap"; rg -n "timeoutSeconds: z" $R/lib/deep-loop/executor-config.ts
echo "## lineage cap"; rg -n "LINEAGE_LIFETIME_HARD_MAX_HOURS = " $R/scripts/fanout-run.cjs
echo "## on_halt applies_to"; rg -n "applies_to: \[" $W | cut -c1-150
echo "## halt: true per file"; rg -c "halt: true" $W
echo "## research auto session states"; rg -n "session_state: \"" $A/deep-research-auto.yaml
echo "## restart flags in research surface"; rg -c -- "--restart|--lineage-mode" .skilled/commands/deep/research.md $A/deep-research-presentation.txt || echo 0
echo "## config lineage literals"; rg -n "lineageMode: \"new\"$|generation: 1$" $W
echo "## research restarted stem status"; rg -n "deep_research.run_restarted.: \{ status" $R/lib/deep-research-ledger-schema/deep-research-ledger-types.ts | cut -c1-90
echo "## maxDurationMinutes writers"; rg -n maxDurationMinutes $W .skilled/skills/system-deep-loop/deep-r*/assets/*-config.json
echo "## maxDurationMinutes readers outside workflows and templates"; rg -l maxDurationMinutes $R/lib $R/scripts .skilled/skills/system-deep-loop/deep-research/scripts .skilled/skills/system-deep-loop/deep-review/scripts --glob "!**/tests/**" | wc -l | tr -d " "
'; echo "exit=$?"
## lock ttl
.skilled/commands/deep/assets/deep-review-confirm.yaml:1
.skilled/commands/deep/assets/deep-review-auto.yaml:1
.skilled/commands/deep/assets/deep-research-confirm.yaml:1
.skilled/commands/deep/assets/deep-research-auto.yaml:1
## stale rule
640:  const expired = !Number.isFinite(heartbeatMs) || now.getTime() - heartbeatMs > ttlMs * 2;
## dispatch cap
95:  timeoutSeconds: z.number().int().positive().max(3600).default(900),
## lineage cap
1804:const LINEAGE_LIFETIME_HARD_MAX_HOURS = 4;
## on_halt applies_to
.skilled/commands/deep/assets/deep-review-auto.yaml:331:          applies_to: ["step_classify_session.on_invalid_state", "step_classify_session.on_com
.skilled/commands/deep/assets/deep-research-auto.yaml:293:          applies_to: ["step_classify_session.on_invalid_state", "step_classify_session.on_c
## halt: true per file
.skilled/commands/deep/assets/deep-review-auto.yaml:3
.skilled/commands/deep/assets/deep-research-confirm.yaml:8
.skilled/commands/deep/assets/deep-review-confirm.yaml:4
.skilled/commands/deep/assets/deep-research-auto.yaml:8
## research auto session states
314:          - session_state: "fresh | resume | completed-session | invalid-state"
## restart flags in research surface
0
## config lineage literals
.skilled/commands/deep/assets/deep-review-confirm.yaml:499:          lineageMode: "new"
.skilled/commands/deep/assets/deep-review-confirm.yaml:500:          generation: 1
.skilled/commands/deep/assets/deep-research-auto.yaml:380:          lineage.lineageMode: "new"
.skilled/commands/deep/assets/deep-research-auto.yaml:381:          lineage.generation: 1
.skilled/commands/deep/assets/deep-research-confirm.yaml:406:          lineage.lineageMode: "new"
.skilled/commands/deep/assets/deep-research-confirm.yaml:407:          lineage.generation: 1
.skilled/commands/deep/assets/deep-review-auto.yaml:514:          lineageMode: "new"
.skilled/commands/deep/assets/deep-review-auto.yaml:515:          generation: 1
## research restarted stem status
691:  'deep_research.run_restarted': { status: 'reserved', reason: 'No writer emits it tod
## maxDurationMinutes writers
.skilled/skills/system-deep-loop/deep-research/assets/deep-research-config.json:11:  "maxDurationMinutes": 120,
.skilled/commands/deep/assets/deep-review-auto.yaml:536:          maxDurationMinutes: 120
.skilled/commands/deep/assets/deep-review-confirm.yaml:523:          maxDurationMinutes: 120
.skilled/skills/system-deep-loop/deep-review/assets/deep-review-config.json:17:  "maxDurationMinutes": 120,
.skilled/commands/deep/assets/deep-research-confirm.yaml:397:          maxDurationMinutes: 120
.skilled/commands/deep/assets/deep-research-auto.yaml:369:          maxDurationMinutes: 120
## maxDurationMinutes readers outside workflows and templates
0
exit=0
```

Every workflow acquires with a TTL of 1800000 ms, and the lock is stale once its heartbeat is older than `ttlMs * 2`, so 60 minutes. One dispatch may run up to the `max(3600)` seconds cap before any post-dispatch work. The two `applies_to` lists name the init branches only, while the files hold 8, 8, 3 and 4 `halt: true` branches. The research auto classifier emits four session states. The research surface holds 0 restart flags. All four config steps hardcode generation 1. The research `run_restarted` stem is `reserved`. Four workflows and two config templates write `maxDurationMinutes: 120`, and 0 runtime files read it.

### Finding Verification

| Finding | Holds | Evidence and correction |
|---------|-------|-------------------------|
| F06 | In part | Holds for `deep-research-auto.yaml`: its classifier emits the four states on line 314 and nothing routes to `on_restart`. It does not hold for `deep-research-confirm.yaml`, where `on_restart_choice` is reachable from the resume prompt. That branch has the same defects. The premise that review restart works does not hold either. Review auto archives in `step_apply_lifecycle_request` before the lock, which is correct. But nothing binds `prior_session_id` or `prior_generation` from the old config, the classifier then sees a fresh packet, and `step_create_config` writes generation 1. Review confirm and review auto `on_restart` move the packet folder after `step_acquire_lock`, like research. Research mirrors review's flags, ordering and recorded event, and this phase fixes the lineage loss in all four files. |
| F09 | In a narrower form | The 1800000 ms TTL, the 60-minute stale window and the three init branches in `applies_to` hold. The four-hour figure is `LINEAGE_LIFETIME_HARD_MAX_HOURS` in `fanout-run.cjs`, which bounds a whole fan-out lineage. The lock is refreshed per iteration, so the expiry risk is one iteration, not one lineage. One dispatch may run 3600 seconds, which already equals the stale window before the reducer and validation run. The acquire passes no `--owner-pid`, so the lock is `transient` and is reclaimed on heartbeat age only. |
| F10 | Yes | Four workflows and two config templates write the field, and 0 runtime files read it. |
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Add the `--restart` and `--lineage-mode` flags to deep-research and an auto-mode `step_apply_lifecycle_request` that archives the packet before directories are created and before the lock is taken.
- Bind the prior session id and generation from the old config before any archive, and write the restart lineage values into the new config in all four workflows.
- Record `deep_research.run_restarted` after `deep_research.run_initialized`, as review records `deep_review.run_restarted`.
- Derive the lock TTL from the configured dispatch timeout, refresh the lock around each dispatch and route every terminal path through one `step_release_lock`.
- Enforce `maxDurationMinutes` at the loop boundary as a terminal stop that still runs synthesis.

### Out of Scope
- Merging the four workflow files into one source - phase 004 owns single-sourcing and the drift guard.
- Lifecycle prose in `deep-research/SKILL.md` and the loop protocol references - phase 005 owns doc alignment.
- Choosing or adding stop-reason enum members - phase 001 fixes the enum this phase consumes.
- The `deep-ai-council` workflows - no finding in this phase names them, and the new sibling phase `006-ai-council-mode-deprecation` retires the council mode.
- A background heartbeat process for the lock - D3 picks a derived lifetime, and plan section 3 gives the trade-off.
- Removing `maxDurationMinutes` instead of enforcing it - rejected, because the config and both templates advertise a wall-clock ceiling and an unattended auto run has no other bound on its total time.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/commands/deep/assets/deep-research-auto.yaml` | Modify | Restart pre-step, lineage binding, restarted event, TTL, dispatch refresh, shared release, duration stop |
| `.skilled/commands/deep/assets/deep-research-confirm.yaml` | Modify | Restart choice without moving the held lock, lineage binding, restarted event, TTL, refresh, shared release, duration stop |
| `.skilled/commands/deep/assets/deep-review-auto.yaml` | Modify | Bind prior lineage before archive, restart config values, TTL, refresh, shared release, duration stop |
| `.skilled/commands/deep/assets/deep-review-confirm.yaml` | Modify | Restart choice without moving the held lock, restart config values, TTL, refresh, shared release, duration stop |
| `.skilled/commands/deep/research.md` | Modify | Parse `--restart` and `--lineage-mode` into `lineage_mode` |
| `.skilled/commands/deep/assets/deep-research-presentation.txt` | Modify | Show and bind `lineage_mode` as review's presentation does |
| `.skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/deep-research-ledger-types.ts` | Modify | Mark `deep_research.run_restarted` spoken with both research producers |
| `.skilled/commands/deep/assets/compiled/deep-research.contract.markdown` | Modify | Regenerate from changed sources |
| `.skilled/commands/deep/assets/compiled/deep-review.contract.markdown` | Modify | Regenerate from changed sources |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-restart-lifecycle.vitest.ts` | Create | Restart order, flag and lineage tests |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-lock-lifetime.vitest.ts` | Create | TTL derivation and dispatch refresh tests |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-research-lock-release.vitest.ts` | Modify | Enumerate terminal paths and require the shared release |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/workflow-max-duration.vitest.ts` | Create | Duration stop placement, reason and synthesis tests |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | F06: `research.md` and `deep-research-presentation.txt` accept `--restart` and `--lineage-mode=auto\|resume\|restart`, bind `lineage_mode` with default `auto` and make both research workflows list `lineage_mode` in `step_preflight_contract` `required_values_present`. |
| REQ-002 | F06: `deep-research-auto.yaml` holds a top-level `step_apply_lifecycle_request` that runs only when `lineage_mode` is `restart` and appears before `step_fanout_spawn`, `step_create_directories` and `step_acquire_lock`. |
| REQ-003 | F06: no step in the four workflows runs a `mv {state_paths.packet_dir}` command after `step_acquire_lock`. The confirm restart choices archive the packet contents while the held lock file stays at `{state_paths.lock_file}`, and then recreate the prompt, iteration and delta directories before `step_create_config`. |
| REQ-004 | F06: every restart path binds `prior_session_id` and `prior_generation` from the existing config before it archives anything, in all four workflows. |
| REQ-005 | F06: when `lineage_mode` is `restart`, `step_create_config` writes lineage mode `restart`, generation `prior_generation + 1` and parent session id `prior_session_id`, and review's `step_create_findings_registry` writes the same generation and lineage mode. |
| REQ-006 | F06: both research workflows record `deep_research.run_restarted` through the append gateway in a `step_record_restarted_run` that follows `step_create_state_log`. No research restart branch appends before the state log is opened. `deep-research-ledger-types.ts` marks the stem `spoken` with both research workflow producers. |
| REQ-007 | F09: every `step_acquire_lock` derives `--ttl-ms` as the larger of 1800000 and the configured `timeoutSeconds` times 1000, and every workflow refreshes the lock immediately before and immediately after each dispatch. |
| REQ-008 | F09: each of the four workflows defines one `step_release_lock`, and every terminal path after a successful `step_acquire_lock` (each `halt: true`, each fail-closed lost lock, each halting `on_fail`, the cancel choice and normal completion) names it. Paths before the lock is held do not name it. The `applies_to` lists are removed. |
| REQ-009 | F09: `deep-research-lock-release.vitest.ts` enumerates the terminal paths after a successful acquire in all four workflows, fails when one does not route to `step_release_lock` and fails when a path before the acquire names it. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-010 | F10: each workflow holds a `step_check_max_duration` at the top of the loop that compares elapsed minutes since the run's start with `config.maxDurationMinutes` and, when the limit is reached, records the stop with `maxDurationReached`, the member phase 001 adds to the frozen `stop_reasons_enum`, skips dispatch and routes to synthesis. |
| REQ-011 | F10: `workflow-max-duration.vitest.ts` asserts the step exists in all four files, its stop reason is `maxDurationReached` and is a member of `STOP_REASONS` in `lifecycle-taxonomy.cjs` and its stop branch routes to synthesis rather than a halt. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm --prefix .skilled/skills/system-deep-loop/runtime test -- tests/unit/workflow-restart-lifecycle.vitest.ts tests/unit/workflow-lock-lifetime.vitest.ts tests/unit/deep-research-lock-release.vitest.ts tests/unit/workflow-max-duration.vitest.ts` exits 0 on the fixed tree and exits 1 on the start commit.
- **SC-002**: The full runtime suite, `npm --prefix .skilled/skills/system-deep-loop/runtime test`, reports no failure the start commit did not already report.
- **SC-003**: `rg -l maxDurationMinutes` over the four workflow files lists all four as readers through `step_check_max_duration`, not only as config writers.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Phase 001 frozen `stop_reasons_enum` | REQ-010 cannot emit `maxDurationReached` until the enum holds it | Implementation of REQ-010 waits for phase 001 to add `maxDurationReached`. This phase only uses the member and never adds it. |
| Dependency | Phase 002 halt and failure policy | The shared release may miss a halt path phase 002 adds | Run the REQ-009 enumeration test after rebasing on phase 002. |
| Risk | A restart archives the wrong folder or loses a packet | High | The archive is a move, never a delete. Plan section 7 names the move-back command, and the restart tests run on temp copies only. |
| Risk | A longer TTL keeps a crashed transient lock for up to twice the TTL | Med | The TTL grows only with the configured dispatch timeout. At the 3600-second cap a crashed run blocks the packet for 120 minutes, and `loop-lock.cjs status` shows the holder. |
| Risk | The reducer reads the legacy `restarted` event row and may miss the ledger stem | Med | Task T022 asserts the projected state log carries the restart row. |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: The two added lock refreshes per iteration each run one `loop-lock.cjs refresh` call and add no other process.
- **NFR-P02**: The four new or changed vitest files complete in under 30 seconds together on the runtime test runner.

### Security
- **NFR-S01**: The restart archive stays inside `{state_paths.archive_root}` under the resolved artifact root, and the tests assert no path outside it is touched.
- **NFR-S02**: Release keeps passing the acquire nonce, so a run never releases another run's lock.

### Reliability
- **NFR-R01**: A lock refreshed right before a dispatch at the 3600-second cap is not stale when the dispatch returns.
- **NFR-R02**: A release failure on a terminal path is logged and never blocks the halt or the synthesis.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a `--restart` with no existing packet archives nothing, binds a null parent session id and opens generation 1 with lineage mode `restart`.
- Maximum input: `timeoutSeconds` at 3600 gives a TTL of 3600000 ms and a stale window of 120 minutes, which covers the full dispatch.
- Failure path: a failed archive move halts with `STATUS=FAIL` through `step_release_lock` and never falls back to resume.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Four workflow files, two command surface files, one ledger type file and four test files |
| Risk | 14/25 | Restart moves packet folders and lock changes affect every deep run |
| Research | 8/20 | Read review's restart path and the lock library, decide D3 |
| **Total** | **37/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Which stop reason does the duration stop use? Answered by the operator on 2026-11-14: `maxDurationReached`, which phase 001 adds to the frozen list.
- Settled: the duration clock starts at the current generation's config `createdAt`. A resume keeps it and a restart resets it, so paused and waiting time counts. Adopted as the default on 2026-11-14: announced to the operator, who did not object.
- Answered in code: a native dispatch was not bounded by `timeoutSeconds`. The `if_native` branch held no timeout, so it now carries the same `timeout_seconds` line as the CLI branches. Recorded in `goal.md` section 4.
<!-- /ANCHOR:questions -->

---
