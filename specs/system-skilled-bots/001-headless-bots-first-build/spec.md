---
title: "Feature Specification: Build system-skilled-bots: file-defined headless agent bots run on a schedule or event"
description: "Phase parent for the first build of system-skilled-bots: one skill with four fixed modes that runs an authored BOT.md headless by hand, on a launchd schedule or from a queued request, with run folders in the Skilled tree's gitignored state and every control file under a user-level state root."
trigger_phrases:
  - "headless bots first build phase parent spec"
  - "system-skilled-bots first build"
  - "BOT.md bots runner launchd"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build"
    last_updated_at: "2026-11-22T12:00:00Z"
    last_updated_by: "spec-writer"
    recent_action: "Folded operator decisions D1 to D12 into the spec"
    next_safe_action: "Plan or resume a child phase folder, starting with 001-contracts-and-state-root"
    blockers: []
    key_files:
      - "spec.md"
      - "decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-writer-001-headless-bots-first-build"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Q2 human decision in a run: decision queue with needs-you items (operator D1, decision-record.md ADR-001; design Proposed for phase work)"
      - "Q3 run folders: inside the Skilled tree's gitignored .skilled/skills/.state/, control state stays user-level (operator D2, ADR-002)"
      - "Q5 identity with no remote: explicit identity in bots/config.json, refuse install and enqueue while unknown (operator D3, ADR-003)"
      - "Q6 moved checkout: detect and reinstall, aware of the overlay system (operator D4, ADR-004)"
      - "Q8 retention: 1,000 index rows per identity, 200 run folders per bot, 100 skipped slots per summary, configurable (operator D5, ADR-005)"
      - "Q9 git-hook scope: every checkout (operator D6, ADR-006)"
      - "Levels: phases 001, 003 and 006 rise to Level 3 (operator D8)"
      - "Second round D9 to D12: hold, needs-you config keys, queue defaults, bots answer in 005 (decision-record.md)"
      - "Names: skill system-skilled-bots and definitions in bots/ (operator, research.md §16 Q10); one BOT.md per bot (research.md §15 recommendation 2)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent-spec | v2.3 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md: these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Build system-skilled-bots: file-defined headless agent bots run on a schedule or event

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-11-22 |
| **Branch** | `main` |
| **Parent Spec** | None (top-level packet of the `system-skilled-bots` track) |
| **Parent Packet** | system-skilled-bots/001-headless-bots-first-build |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All eight children validate strict, every success criterion in section 5 has evidence, and phase 008 has replayed both routing stages for this hub |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Skilled has agents, commands and three installed schedulers. It has no way to define a recurring or event-driven agent job as a file and have it run unattended from the terminal. The earlier per-repository Hermes layer was removed because it generated 177 files for five sessions. Any replacement must add nothing generated to a checkout (research.md §3, §4).

### Purpose
Build `system-skilled-bots`: one skill with four fixed modes (author, run, schedule, status) that runs an authored `BOT.md` headless by hand, on a launchd schedule or from a queued request. The consumer checkout holds definitions only.

A bot is one authored `BOT.md` in `bots/` at a consumer repository's root, and repository policy sits in `bots/config.json`. One runner runs any bot by id. launchd is the first trigger backend, with one generated agent per bot schedule. Every trigger only writes a run request. The checkout holds definitions and nothing else. Queue, leases, switches, needs-you items, registered roots and the index live under a user-level state root, because a run must not be able to write them (research.md §1, §13, §15). Run folders live in the Skilled tree's gitignored state at `.skilled/skills/.state/system-skilled-bots/<identity>/runs/<run id>/`. That placement is an operator decision that overrides research.md §11's inference (decision-record.md ADR-002).

A run that needs a human decision parks itself with the terminal exit `awaiting-decision` and leaves a needs-you item. The operator answers it later with `bots answer`, which enqueues a `resume` request (decision-record.md ADR-001). While the item is open, the bot's scheduled and queued runs are held (D9). Phase 003 owns the items, the hold, `bots inbox`, expiry and the resumed prompt. Phase 005 owns `bots answer` (D12).

> **Phase-parent note:** This spec.md and the optional `decision-record.md` are the only authored documents at the parent level. `phase-definitions.md` §3 allows the parent decision record for decisions that span phases. All detailed planning, task breakdowns, checklists and phase-local decisions live in the child phase folders listed in the Phase Documentation Map below.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Build steps 1 to 9 of research.md §15 across eight child phases.
- The run record, the `BOT.md` format, `bots/config.json`, repository identity and the state layout: control state under the user-level root, run folders in the Skilled tree's gitignored `.state`.
- The needs-you decision queue: the `awaiting-decision` exit, the item record, the hold on a bot with an open item, `bots inbox`, `bots answer` and the `resume` request kind. It spans phases 001, 003, 005, 006, 007 and 008.
- Overlay awareness for schedules: the install record keeps the resolved runner path and `.skilled` kind, status flags a changed tree, and phase 006 names a post-repin hook point.
- The cron translator, label grammar, slot lister and definition checker, with a live weekday-only probe.
- The manual runner `bots run <id>` with its run and invocation stop layers, then opt-in worktree isolation and delivery channels.
- The request pipeline: atomic enqueue, claim, quarantine, retry bound, `bots enqueue`, `bots drain` and an opt-in git post-commit producer.
- The transactional launchd installer and uninstaller, the scheduler stop layer, fire-time slot accounting and the queue-drain agent.
- The SQLite status index and `bots status`.
- Hub wiring for the four modes, router commands, generated mirrors, the doctor asset and the two-stage replay.

### Out of Scope
- Build step 10 of research.md §15: the scheduled worktree reclaimer, a Hermes cron backend and the webhook adapter. Each can be added later as phase 009 or higher.
- Orca delegation.
- Any dedicated app or dashboard.
- Any file written by the hub into a consumer checkout or a vendored tree, with two exceptions: a bot's own work in its bound spec folder, and run folders under the Skilled tree's gitignored `.skilled/skills/.state/system-skilled-bots/`.
- Editing the doctor overlay engine. The post-repin report is a follow-up owned by system-skilled-doctor unless the operator approves it here.
- Needs-you dialogs with more than one question, and answering from a phone or a chat channel.

### Files to Change
Audit summary only. Per-phase detail lives in each child's `plan.md`. Reused pieces such as `system-deep-loop/runtime/lib/deep-loop/`, `.skilled/skills/sk-git/scripts/worktree-naming.sh` and `.skilled/bin/worktree-reaper.sh` are imported or called, not changed.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.skilled/skills/system-skilled-bots/runtime/lib/` | Create | 001 to 007 | Record, definition, config, state root, identity, translator, runner, queue, installer and index modules with tests |
| `.skilled/skills/system-skilled-bots/assets/` | Create | 001 | The `BOT.md` template for authors |
| Definition checker script (location decided in 002) | Create | 002 | Checker with the research.md §6 output contract and negative fixtures |
| `.skilled/bin/` (bots CLI entry) | Create | 003 | Thin CLI for the `bots` verbs, modeled on `.skilled/bin/compiled-route.cjs` |
| `.skilled/scripts/git-hooks/post-commit` | Modify | 005 | One opt-in, enqueue-only, non-fatal leg. Shared file: owner and callers named before the edit |
| `~/Library/LaunchAgents/` | Create (outside repo) | 002, 006 | The temporary weekday probe plist in 002; generated bot plists in 006 only |
| `.skilled/skills/system-skilled-bots/` hub files | Create | 008 | `SKILL.md`, `mode-registry.json`, `hub-router.json`, `ROUTER.md`, `graph-metadata.json`, four metadata mode packets |
| `.skilled/commands/bots/` | Create | 008 | Thin router commands, with generated runtime mirrors |
| `.skilled/commands/doctor/assets/` | Create | 008 | Doctor YAML asset that runs the definition checker |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Depends on | Status |
|-------|--------|-------|------------|--------|
| 1 | 001-contracts-and-state-root/ | Run record with the `awaiting-decision` exit, needs-you item schema, `BOT.md` parser, `bots/config.json` with identity, retention and needs-you expiry keys, and the split state layout: control state user-level, run folders in the Skilled tree's gitignored `.state`. Checks what an overlay re-pin does to `.state` (research.md §5, §10, §11; ADR-001, ADR-002) | None | Draft |
| 2 | 002-schedule-predicates-and-checker/ | Cron translator, label grammar, slot lister and definition checker, with the live weekday probe (research.md §6, §7) | 001 | Draft |
| 3 | 003-manual-runner/ | `bots run <id>` end to end in a shared checkout, with the run and invocation stop layers. Writes needs-you items, holds a bot while one is open, builds the resumed prompt for a `resume` request and adds `bots inbox`. `bots answer` is phase 005's (research.md §8, §13; ADR-001, D9, D12) | 001 | Draft |
| 4 | 004-worktree-isolation-and-delivery/ | Opt-in worktree runs and real delivery channels (research.md §10, §13) | 003, and 002's checker code merged (not 002 closed) | Draft |
| 5 | 005-request-pipeline/ | Atomic enqueue, claim, quarantine, retry bound, `bots enqueue`, hand-run `bots drain`, the opt-in git hook, the `resume` request kind keyed by item id, `bots answer` as a queue producer and quarantine of held requests as `held-needs-you` (research.md §9; ADR-001, D9, D11, D12) | 003 | Draft |
| 6 | 006-launchd-installer/ | Transactional install and uninstall, scheduler stop layer, fire-time slot accounting and the queue-drain agent. The install record keeps the resolved runner path and `.skilled` kind, and a post-repin check names its hook point in the overlay flow. A fire during a hold records a skipped slot (research.md §7; ADR-004, D9) | 002, 003, 005 | Draft |
| 7 | 007-status-index/ | SQLite index and `bots status`, joined with `launchctl print`. Rows for open needs-you items, held bots, a changed runner path and a vanished run folder; retention per ADR-005 and D10 (research.md §12; ADR-001, ADR-004) | 003, 006 | Draft |
| 8 | 008-hub-wiring/ | Four metadata modes, commands, mirrors, doctor asset, two-stage replay and staged re-pin. `inbox` maps onto the status mode and `answer` onto the run mode; the re-pin also checks that reinstall is reported when the runner path changes (research.md §14; ADR-001, ADR-004) | 001 to 007 | Draft |

**Levels.** The operator raised phases 001, 003 and 006 to Level 3 (decision-record.md D8). Each child carries its own level. The parent stays a phase parent.

**Parallel lanes.** After 001 closes, 002 and 003 can run in parallel. After 003 closes, 004 and 005 can run in parallel. Phase 003 does not wait on 002, so the weekday probe's calendar wait overlaps runner work. Phase 004 also needs 002's checker code merged, because it adds the worktree invariant to that checker. It does not wait for 002 to close, since 002 stays open for days on the weekday probe.

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before a phase that depends on it begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-contracts-and-state-root | 002-schedule-predicates-and-checker | Record, definition and config predicates are importable, and the three worked shapes of research.md §5 parse | 001 acceptance criteria all Met; its tests pass |
| 001-contracts-and-state-root | 003-manual-runner | State-root resolver and identity rule exist and are tested | 001 acceptance criteria all Met; parent ADR-002 (run folders) and ADR-003 (identity) are Accepted |
| 003-manual-runner | 004-worktree-isolation-and-delivery | `bots run <id>` leaves one complete terminal record in a shared checkout | 003 acceptance criteria all Met |
| 003-manual-runner | 005-request-pipeline | The runner and its stop layers can be called by a queue consumer | 003 acceptance criteria all Met |
| 002, 003 and 005 | 006-launchd-installer | Translator and checker, runner with kill switches, and the request pipeline all exist; the weekday probe result is recorded | 002, 003 and 005 acceptance criteria all Met |
| 003 and 006 | 007-status-index | Run records and installed labels exist to index | 003 and 006 acceptance criteria all Met |
| 001 to 007 | 008-hub-wiring | Every runtime behavior is built and proven by a real run | All seven earlier children validate strict with acceptance criteria Met |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

No cross-phase operator question is open. The operator answered Q2, Q3, Q5, Q6, Q8 and Q9 on 2026-11-22. Each is Accepted in `decision-record.md` (ADR-001 to ADR-006, answers D1 to D6). The needs-you design behind ADR-001 is Proposed for phase work.

Answered by evidence inside a phase, not by the operator: Q1 (weekday probe, phase 002), Q4 (slot lister across daylight saving, phase 002) and Q7 (next fire time, phase 006). Q10 (names) is settled and recorded as Accepted.
<!-- /ANCHOR:questions -->

---

## 5. SUCCESS CRITERIA

Each criterion is proven by a real run in the phase that owns it. The research ran nothing, so no criterion is met by reading alone (research.md §17).

1. `bots run <id>` runs a manual bot end to end and leaves one complete run record.
2. A cron bot installs as a disabled launchd agent, fires after being enabled and records its slot and lateness.
3. A queued request is claimed once, retried within a bound and quarantined when it cannot run.
4. Each of the three stop layers stops what it claims to stop, and no switch or needs-you item sits in a file a run can write.
5. `bots status` shows installed, last run, delivery, missing-checkout, changed-runner-path, vanished-run-folder and open needs-you states from a rebuildable index.
6. The definition checker passes the three worked shapes and fails each negative fixture with its invariant id.
7. Target for phase 008: all four modes route through both stages for this hub, and a staged re-pin leaves a consumer's `bots/` intact. Until 008 passes, no mode is routed.
8. No hub code writes into a checkout or a vendored tree, apart from a bot's own work in its bound spec folder and run folders under the Skilled tree's gitignored `.skilled/skills/.state/system-skilled-bots/`.
9. The weekday-only question is answered by a recorded live test before any weekday schedule is installed.
10. A run that needs a decision ends `awaiting-decision` and leaves one needs-you item. `bots answer` enqueues one `resume` request, and the resumed run carries the question and answer in the same spec folder. An unanswered item expires to `expired` after `needsYou.expiryDays` and is never answered automatically. While an item is open, the bot's scheduled and queued runs are held and reported.
11. After a staged overlay re-pin or symlink retarget, status reports each bot schedule whose runner path changed as needing reinstall.

---

## 6. STANDING RULES FOR EVERY CHILD

Every child spec references this section instead of restating it.

### Scheduling invariant
Nothing is scheduled before the runner and its kill switches exist (research.md §1 decision 6, §15). Phase 006 enforces it in three ways:
- **Structural.** Phase 006 is the only phase allowed to write a hub-labeled plist or call `launchctl bootstrap`. Its entry conditions are phases 003 and 005 complete. Phases 001 to 005 each carry an acceptance check that no code path calls `launchctl bootstrap`.
- **Mechanical.** The installer runs a preflight. It refuses to install when the runner cannot be resolved, the state-root switches cannot be read, or the definition fails the checker or the posture check.
- **Default.** A first install is disabled (research.md §15 step 7).

**One stated exception: the phase 002 weekday probe.** It is a hand-written plist that appends a timestamp to a file. It calls neither the runner nor any agent. Its label sits outside the hub label grammar. It is removed before phase 002 closes. It is not a breach of the invariant.

### The seven first-build invariants (research.md §15)
1. Derived files are written to a temp file and renamed.
2. Nothing writes into a vendored tree. One named exception: run folders under the Skilled tree's gitignored `.skilled/skills/.state/system-skilled-bots/` (decision-record.md ADR-002). Queue, leases, switches, needs-you items, registered roots and the index never live there.
3. Unknown cost is `null`.
4. A missing path is not a failure, and an unreadable one is not missing.
5. Delivery is at most once, and an uncertain send is `unknown`.
6. A dirty or unmerged worktree is never reclaimed automatically.
7. The lease key never contains a worktree path.

### State placement
A run must not be able to write its own control state. Queue, leases, switches, needs-you items, registered roots and the SQLite index live under the user-level state root. Only run folders live in the Skilled tree's gitignored `.state`. A record points at its run folder, and every reader treats a vanished run folder as a row state, never a crash.

### Routing claims
No phase document reports a mode as routed before phase 008 has run both routing stages with this hub's path (research.md §15 step 9).

---

## 7. RISKS ACROSS PHASES

| Risk | Where it bites | Mitigation |
|------|----------------|------------|
| The weekday probe takes calendar days | Phase 002 close, then phase 006 | Start it on day one of 002. Phase 003 does not wait for it |
| The probe shows `Weekday` alone does not behave like cron | Phases 002 and 006, the flagship example | The translator refuses the form and the worked example `0 9 * * 1-5` changes |
| Contract drift after phase 001 | Every later phase | Record and definition changes go back through 001's spec. The checker imports predicates (research.md §6) |
| Runs called contained on executor kinds with no preventive sandbox | Phase 003 | Posture is declared and validated, and the record states the honored posture (research.md §13) |
| A child stops to ask and exits 0 | Phase 003 | The exemption goes in the prompt as well as the environment (research.md §8) |
| Respawn loop on a queue folder that never empties | Phases 005 and 006 | Claim before dispatch, quarantine outside the watched folder, retry bound (research.md §9) |
| Two clones of one repository share an identity, so they share labels and state | Phases 001, 006, 007 | Not covered by the research. Phase 001 decides and tests it |
| A moved checkout leaves dead plists | Phases 006 and 007 | Status detects it and reinstall repairs it (research.md §7) |
| An overlay re-pin, symlink retarget or `/doctor:symlink` change moves the runner path without the repo moving | Phases 006, 007, 008 | The install record keeps the resolved runner path and `.skilled` kind; status flags a mismatch; the staged re-pin in 008 proves it (ADR-004) |
| Run folders are lost when an overlay re-pin replaces the vendored tree | Phases 001, 003, 007 | Phase 001 records what a re-pin does to `.skilled/skills/.state/`. If it wipes it, run history in the tree is best-effort and the index row survives (ADR-002) |
| A consumer's vendored copy may not ignore `.skilled/skills/.state/` | Phase 001 | Unverified: the cited ignore rules are Skilled's own `.gitignore`. Phase 001 checks a vendored consumer before any run writes there |
| A symlinked `.skilled` shared by several consumer repos puts their run folders in one `.state` | Phases 001, 003, 007 | Run folders are partitioned by repo identity, and identity never collides (ADR-003) |
| Needs-you items pile up unanswered | Phases 003 and 007 | Status rows, one delivery notice per item, and expiry to `expired` (ADR-001) |
| `man launchctl` says `print` output is not API, so its format can change | Phases 006 and 007 | The `launchctl print` parser is best-effort and tolerant. A parse failure shows as an explicit row state, never as a wrong one |
| Green gates read as integration | Phase 008 | Two-stage replay with the hub path passed explicitly (`skill-hub-routing.md` §3) |
| Edits to shared files: the post-commit hook, deep-loop libraries | Phases 003 and 005 | Import, do not modify. Name owner and callers before any edit |
| A skill folder with no registry fails existing checks before phase 008 | Phases 001 to 007 | Phase 001 tests it and picks the layout |
| Eight phases exceed the suggested count of four | Parent | The two parallel lanes shorten the path. If the operator wants fewer, fold 004 into 003 |
| The evidence base ran nothing | All | Every phase proves its claims with a real run (research.md §17) |

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Decision record**: `decision-record.md` for the cross-phase operator decisions
- **Research**: `specs/other/008-workflow-hub-research/research/research.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
