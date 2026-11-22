---
title: "Implementation Summary"
description: "Phase 1 built: six tested contract libraries for system-skilled-bots, a BOT.md template and the setup evidence. 56 tests pass, all 18 acceptance rows are Met."
trigger_phrases:
  - "contracts and state root implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skilled-bots/001-headless-bots-first-build/001-contracts-and-state-root"
    last_updated_at: "2026-11-22T15:50:40Z"
    last_updated_by: "generate-context"
    recent_action: "Built and verified the six contract libraries; all acceptance rows Met"
    next_safe_action: "Commit phase 001 on branch system-skilled-bots, then start phase 002"
    packet_purpose: "Purpose: Every later phase imports one tested set of contracts: a run record, a `BOT.md` definition, a repository config, a repository identity, a needs-you item and a state layout."
    blockers: []
    key_files:
      - ".skilled/skills/system-skilled-bots/runtime/lib/state-root.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/run-record.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/definition.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/identity.ts"
      - ".skilled/skills/system-skilled-bots/runtime/lib/needs-you.ts"
    session_dedup:
      fingerprint: "sha256:57800f81dfd08e5ca8a61dd7a38fe31fa14f2a12d01d8d35ec659fdb912ac48e"
      session_id: "implement-001-contracts-and-state-root"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "306ce05f-f119-4cd7-b3ad-85d401c28435"
      workspace: "/Users/michelkerkmeester/worktrees/public/system-skilled-bots"
      savedAt: "2026-11-22T15:50:40Z"
      locatorKind: "transcript_path"
      version: 1
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-contracts-and-state-root |
| **Completed** | 2026-11-22 |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Later phases now import one tested set of contracts: the run record, the `BOT.md` definition, `bots/config.json`, repository identity, the needs-you item and the state layout. Run folders resolve into the Skilled tree's gitignored `.state`, and everything a run must not write resolves under the user-level state root.

### Phase 1: contracts-and-state-root

Each contract is one module under `.skilled/skills/system-skilled-bots/runtime/lib/`. Every module returns a named refusal instead of throwing or falling back to a default.

| Contract | Module | Read by |
|----------|--------|---------|
| Config keys, defaults, retention, needs-you expiry, `gitHookTrigger` | `repo-config.ts` | 003, 004, 005, 007 |
| Identity, the `identity-unknown` refusal, `identityGuard`, the folder key | `identity.ts` | 005, 006 |
| Both roots, every subfolder, record, item and install files, registered roots, run folders | `state-root.ts` | all |
| `BOT.md` parser, defaults, trigger kinds, isolation resolver | `definition.ts` | 002, 003, 004 |
| Run record, failure classes, delivery states, `awaiting-decision` exit | `run-record.ts` | 003, 005, 007 |
| Needs-you item and its derived state | `needs-you.ts` | 003, 005, 007, 008 |

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skilled-bots/runtime/package.json`, `package-lock.json` | Create | Self-contained dependency root: `tsx`, `yaml`, `vitest` |
| `.skilled/skills/system-skilled-bots/runtime/tsconfig.json`, `vitest.config.ts` | Create | Typecheck and test discovery for `*.vitest.ts` |
| `.skilled/skills/system-skilled-bots/runtime/lib/*.ts` | Create | The six contract libraries |
| `.skilled/skills/system-skilled-bots/runtime/tests/*.vitest.ts`, `tests/support.ts` | Create | Six test files and the temp-folder helpers |
| `.skilled/skills/system-skilled-bots/runtime/tests/fixtures/*.md` | Create | Three worked shapes and four defect cases |
| `.skilled/skills/system-skilled-bots/assets/bot-template.md` | Create | Author template, one comment per field |
| `scratch/skill-checks.txt`, `scratch/vocabularies.md`, `scratch/overlay-repin-state.md` | Create | Setup evidence |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work ran through `/speckit:implement` in autonomous mode, in the worktree `~/worktrees/public/system-skilled-bots` on branch `system-skilled-bots`. A background agent produced the vocabulary list and the overlay re-pin evidence while the libraries were written. A read-only review approved the code, and its four suggestions were applied.

Proof, in the order it ran:
1. Ran the skill and advisor checks with the empty folder, then again with the finished one. All six exit 0 both times.
2. Ran the suite and the typecheck. To show the tests catch real faults, I broke three guards on purpose (not-ignored refusal, unknown identity, symlink follow). Each break failed its tests, and each pass came back once restored.
3. Ran the formal check with `git status` and `~/Library/LaunchAgents` snapshots taken before and after the suite.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Run folders in the Skilled tree's gitignored `.state`, record user-level (ADR-001, Accepted) | Operator D2. A lost run folder never loses the record |
| Explicit `identity` field, refuse install and enqueue while unknown (ADR-002, Accepted) | Operator D3. Two remote-less repositories never share state |
| Retention keys with defaults 1000, 200, 100 and 200, expiry 7 days (ADR-011, Accepted) | Operator D5 and D10 |
| Exit `awaiting-decision` and the needs-you item (ADR-010) | Operator D1. Pinned to `blockedStop`, read from the deep-loop taxonomy |
| Failure class `budget` beside the four named classes (ADR-005) | research.md §10 makes reaching the budget its own class |
| [DEVIATION: the plan listed only `tsx` and `vitest`] Added `yaml` 2.9.1, the version `.skilled/package.json` already pins | `BOT.md` frontmatter nests maps such as `trigger: {kind: cron, ...}`, which a hand parser would misread |
| [DEVIATION: not in the plan] `resolveRunFolder` refuses a linked worktree with `skilled-tree-is-worktree` and follows a symlinked `.skilled` | The spec says the run root is never the run's worktree and names the symlinked case as supported. Git cannot answer `check-ignore` below a symlink (exit 128) |
| Identity folder key lowercases, then percent-encodes | Hosting services treat `owner/name` case-insensitively, and percent-encoding is one-to-one with no path separator. Registered roots use the same key |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `XDG_STATE_HOME=$S npm --prefix .skilled/skills/system-skilled-bots/runtime test` | 6 files, 56 tests passed, exit 0 |
| `npm run typecheck` in the runtime | exit 0. A planted type error was caught, so the pass is real |
| `git status --short` before and after the suite | `diff` printed nothing |
| Real `.skilled/skills/.state/system-skilled-bots` | Absent before and after |
| `rg -n 'launchctl\|LaunchAgents\|\.plist'` over the runtime | No match, exit 1. The `~/Library/LaunchAgents` listing is unchanged |
| Skill and advisor checks (`scratch/skill-checks.txt`) | Six checks, exit 0 before and after |
| Code review (Gate Validation, post_execution) | APPROVED, no P0 or P1 open. Four P2 suggestions applied |
| Acceptance criteria | 18 of 18 Met, see `acceptance-criteria.md` |
| Checklist in `tasks.md` | P0 11/11. P1 17/20, the other 3 N/A by the spec (no service runs). P2 2/9, the other 7 N/A |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Delivery state names are not settled.** research.md §10 says `queued` and `claimed`, but the Hermes file it cites stores `pending` and `delivering` (`scratch/vocabularies.md`). The record keeps research.md's names, and phase 4 confirms the pair before it writes delivery.
2. **Run evidence in the tree is best-effort.** A re-pin keeps it, observed byte-identical. From reading the code, a tree rebuilt from an archive or a fresh clone loses run folders, and a `/doctor:symlink` retarget hides them in the old checkout. The record and index survive because they are user-level.
3. **A copied (not linked) vendored tree gets no ignore line from any doctor flow.** `resolveRunFolder` refuses such a tree with `run-folder-not-ignored` until the consumer adds `.skilled/skills/.state/*/*` to its ignore rules.
4. **No checker CLI and no SKILL.md yet.** The folder holds runtime code only. Phase 2 adds the checker and phase 8 wires the hub.
<!-- /ANCHOR:limitations -->

---
