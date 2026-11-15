---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "caller sweep and verification implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/loop-architecture/004-workflow-logic-hardening/006-ai-council-mode-deprecation/005-caller-sweep-and-verification"
    last_updated_at: "2026-11-15T01:30:00Z"
    last_updated_by: "claude-code"
    recent_action: "Closed child 005 with every acceptance row Met"
    next_safe_action: "Ask the operator before any push or merge"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-005-caller-sweep-and-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 005-caller-sweep-and-verification |
| **Completed** | 2026-11-15 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

Nothing outside history still sends a reader to the retired council mode. The vocabulary sweep prints no path outside its allowlist, and no gate ends worse than it started.

### Phase 5: caller-sweep-and-verification

Children 001 to 004 removed the mode. Docs, fixtures and tests in other skills still named `/deep:ai-council`, a third mode or a `council` scope. Each of those now says what is true: the CLI bridge docs, the root README, the spec-kit indexes and the Gate 3 resume phrase name `/speckit:ai-council`, and the doctor scenarios and benchmark templates describe two modes.

The sweep also proved what did not change. No `ai-council/` artifact folder under `specs/` differs from the start commit, and the divergent pivot's seat vocabulary is untouched.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/cli-external-orchestration/cli-opencode/` docs | Modified | Five files name `/speckit:ai-council` |
| `README.md`, `.env.example` | Modified | The council is described as an agent, and two unread variables are removed |
| `.skilled/skills/system-spec-kit/shared/gate-3-classifier.ts` and its menu parity test | Modified | The resume phrase and the file list follow the new command |
| `.opencode/plugins/tests/system-deep-loop-guard.test.cjs`, `claude-task-dispatch-guard.test.cjs` | Modified | Two registered modes, and a new case for an agent with no mode |
| `.skilled/commands/doctor/scripts/parent-skill-check.cjs` | Modified | Legal loop types are research and review |
| `.skilled/skills/sk-doc/` templates, allowlists and fixtures | Modified | Benchmark templates, the render ledger, the playbook allowlist and two frozen README fixtures |
| Spec-kit tests of deleted packet scripts and `test-council-matrix.sh` | Deleted | Seven test files and the matrix script |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` and three retrieval fixtures | Regenerated | The index no longer lists the deleted packet |
| Runtime mirrors, both compiled contracts, two compiled-route manifests, the command bridges | Regenerated | Derived files |
| `../scratch/gate-baseline.md`, `../scratch/exceptions.md` | Modified | The final column and the justified exceptions |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

Two DeepSeek dispatches did the docs sweep and the plugin guard tests, and the one-line fixtures were fixed by hand while they ran. Every diff was read. The whole gate set was then rerun from the final tree and recorded beside the start values. The work is commit `10c054c7b4`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Sixteen paths were added to the sweep allowlist | They are the council agent in five runtimes, the hub's three redirect sentences, the pivot's own seat wording, one changelog folder and the trigger index, which lists historical spec folders by name. |
| The council canary case was removed at its archived source | The runtime copy under `.skilled/bin` is synced from the archive, so an edit to the copy alone was reverted by the next sync. |
| `heldout.jsonl` keeps its council prompt | The file is hash-pinned by a test so tuning cannot touch it. The prompt still expects `/doctor:deep-loop`. |
| The command routing baseline was recaptured | Two plain prompts for deep research and deep review now reach their commands. Attached reach went from 12 to 14. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| Vocabulary sweep minus `scratch/exceptions.md` | 0 paths |
| `git diff --name-only a55b1f3d58 -- 'specs/**/ai-council/**'` | Prints nothing |
| Mirror checkers the runtime-mirrors doctor lists | All exit 0 |
| Gate set, 58 gates | No gate worse than its start. `trigger-index-check` moved from failing to passing |
| Runtime, advisor and spec-kit CLI suites | 2904 passed, 1708 passed, and 2590 passed with the one failure that predates the phase |
| `validate.sh` on the phase parent with `--recursive --strict` | `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **Five gates still fail as they did before the phase.** `corpus-pin`, `hub-vocabulary-source`, `broken-tracked-symlinks`, `command-router-drift` and `speckit-cli-vitest`. None is caused by this phase, and each needs its own fix.
2. **The trigger index still names `deep-ai-council`.** Those 43 entries are historical spec folders with that name, not the deleted packet.
3. **The spec-kit runtime dist must be rebuilt after a classifier edit.** Run `npm run build` in `.skilled/skills/system-spec-kit/runtime`. The top-level build alone leaves the validator reporting a stale dist.
<!-- /ANCHOR:limitations -->

---


