---
title: "Implementation Plan: Phase 23: vibe-review-remediation"
description: "Fix the three Vibe hook scenarios the review found stale and the runner's unpinned model first, because the live reruns depend on them; then harden the compaction detector, correct the docs and record a disposition for every finding."
trigger_phrases:
  - "vibe review remediation plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 23: vibe-review-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ESM and CommonJS hooks, Markdown scenarios with a JSON conversation script |
| **Framework** | Mistral Vibe 3.1.2 hooks; the shared conversation runner driving Vibe in tmux |
| **Storage** | JSON state files under `.skilled/skills/.state/vibe-compaction/` |
| **Testing** | `node --test` suites, the runner's own suite, the playbook validator, live Vibe runs |

### Overview
The review's P1 is an evidence claim, and the three scenarios behind it failed for reasons in the scenario or the runner, so those fixes come first and the live reruns follow. The detector, hand-over and doc findings are independent edits with unit tests, made before the batch because a live run fails when the checkout changes under it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `node --test .skilled/hooks/session-lifecycle/vibe/*.test.mjs` and `node --test .skilled/hooks/session-handover/tests/*.test.cjs` print `fail 0`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Hook parts composed by one entry per Vibe event; scenarios judged from the session journal.

### Key Components
- **`compaction-context.mjs`**: finds a compaction in the journal that the session has not consumed and rebuilds the goal slice and handoff pointer.
- **`run-conversation-scenario.cjs`**: builds a disposable Vibe home per run, drives the session and writes `result.json`.
- **Hook scenarios**: one conversation script per hook, each check reading a journal record or a file.

### Data Flow
The runner copies `.vibe/config.toml` into the home, now with `active_model = "deepseek-flash"` first, renders the hooks and starts Vibe. A scenario's `launch_setup` may swap the pin. Vibe writes the resolved model to the session's `meta.json`, and the runner copies it into `result.json` as `vibe_model` before the home can be removed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `compaction-context.mjs` `writeWatermark` | Producer of the seen list | Update: every consumed id joins it | New catch-up test fails on the old code |
| `compaction-context.mjs` `measureJournal` | Producer of the post-tool size | Update: an empty folder measures 0 | New test fails on the old code |
| `compaction-context.mjs` `stateDirFor` | Path from `payload.cwd` | Update: only an existing directory | New test fails on the old code |
| `handover-parts.mjs` withdraw | Consumer of `pre_agent` | Update: needs a typed prompt | New test fails on the old code |
| `relaunch-core.cjs` `stateDir` | Shared by every runtime | Unchanged: `ensureStateDir` already checks owner and mode | `relaunch-core.cjs:166-176` |
| `arm({ cwd })` in the Vibe, Claude and Codex adapters | Shared pattern | Unchanged: `skilled-loop` checks the cwd before `cd` | `rg -n "cwd: payload.cwd" .skilled/hooks` |
| Runner `prepareVibeHome` | Producer of every Vibe home | Update: pin the model | Runner suite |
| VIB-HK-007 `launch_setup` | Consumer of the home config | Update: drop the runner's pin before its own | Live rerun |

Matrix axes for the reruns: scenario (005, 006, 007, plus 004 and 008 whose uncommitted reruns ran unpinned) by model (pinned). Five rows.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Detector, hand-over withdraw, runner pin | `node --test`, the runner suite |
| Integration | Playbook package structure | `validate-playbook-package.cjs` |
| Manual | VIB-HK-004 to 008 live on Vibe | The conversation runner through `scratchpad/run-batch.sh` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Mistral Vibe subscription | External | Green | No live reruns; unit work stands |
| `deepseek-flash` on the Vibe roster | External | Green | The pin falls back and `vibe_model` shows it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A live scenario or a unit suite fails because of a change in this phase.
- **Procedure**: `git revert` the phase commit; restore committed evidence with `git checkout -- <scenario folder>`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Scenario and runner fixes | The review's synthesis findings | Live reruns |
| Detector, hand-over and doc fixes | Nothing | Commit |
| Live reruns and record updates | All edits landed, no edit during the batch | Closure |
<!-- /ANCHOR:phase-deps -->

---
