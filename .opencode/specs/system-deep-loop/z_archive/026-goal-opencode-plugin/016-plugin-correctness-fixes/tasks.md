---
title: "Tasks: Phase 16: plugin-correctness-fixes"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "goal plugin correctness fixes tasks"
  - "mk-goal F1-F12 task list"
  - "D1-D3 contract alignment tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/016-plugin-correctness-fixes"
    last_updated_at: "2026-07-03T13:34:00Z"
    last_updated_by: "opencode-gpt-5.5"
    recent_action: "Completed T015 command docs"
    next_safe_action: "Run T016 verification"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
      - ".opencode/commands/goal_opencode.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "032-phase-016-plugin-correctness-fixes-20260703"
      parent_session_id: null
    completion_pct: 94
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 16: plugin-correctness-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Run all 6 plugin test files fresh (`node --test .opencode/plugins/tests/mk-goal-*.test.cjs`), capture full output as the pre-edit regression baseline; re-confirm each finding's cited line ranges below against the working tree (dossier cites verified 2026-07-03, drift expected as the file is edited task-by-task)
  - Evidence: Baseline `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` passed 6/6 on 2026-07-03 with duration `864.782542ms`; `git diff --` over all allowed target files returned no output before edits; `mk-goal.js` read confirmed the cited F1-F12/D1 line-range seams in the working tree.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### P2 Fixes F1-F7 (fix + regression test per task)

- [x] T002 F1: skip/sample default-config always-hit gate logging in `maybeContinueGoal`'s `decision()` (mk-goal.js:1423-1437), add rotation/prune for `.continuation.log` and `.goal-events.log` reusing `pruneArchive` age machinery (mk-goal.js:471-487, 1814-1820), add `ts`+`goalId` fields to entries; regression test in `mk-goal-continuation.test.cjs` asserting bounded log growth under a burst of default-config `session.idle` events, pruning of aged entries, and `ts`/`goalId` present on new entries
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-continuation.test.cjs` failed pre-fix with `6 !== 0`; GREEN rerun passed 1/1 after adding quiet default gate logging, aged JSONL pruning, and `ts`/`goalId` entries.
- [x] T003 F2: close the TOCTOU on the continuation in-flight lock — make check-and-acquire of `inFlightContinuations` adjacent before any await (mk-goal.js:1455-1458 vs 1498), matching the verification-lock pattern (1806-1807); regression test in `mk-goal-continuation.test.cjs` driving `maybeContinueGoal` concurrently on a shared `runtimeState` and asserting exactly one `promptAsync` dispatch and one auto-turn charge
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-continuation.test.cjs` failed pre-fix with concurrent prompt count `19 !== 1`; GREEN rerun passed 1/1 after pre-await lock acquisition and outer lock release.
- [x] T004 F3: route `archiveGoalStateFile` (mk-goal.js:847-865) and `sweepOrphanedActiveStates`'s per-file archival (874-902) through the per-session `mutationQueues` (912-931) so archive renames cannot interleave with queued mutations; regression test in `mk-goal-lifecycle.test.cjs` interleaving a `session.deleted` archive with a queued `accountUsage`/`refreshGoalActivity` mutation (both orders) and asserting the state file stays archived, never resurrected
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` failed pre-fix with active state resurrection `true !== false`; GREEN rerun passed 1/1 after `archiveGoalStateFile` used the shared queue helper.
- [x] T005 F4: make `MK_GOAL_PLUGIN_DISABLED=1` fully inert for `handleEvent` (mk-goal.js:1752-1839) — no reads, usage-accounting writes, blocked-by-prompt writes, archive renames, or directory sweeps while disabled; regression test in `mk-goal-lifecycle.test.cjs` dispatching `session.created`, `message.updated`, `session.idle`, `session.deleted` with the flag set and asserting the state directory is byte-identical before/after
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` failed pre-fix with disabled events creating `d:.archive` and `f:.goal-events.log`; GREEN rerun passed 1/1 after early disabled gating in `handleEvent`.
- [x] T006 F5: widen the role-label neutralizer prefix class in `normalizeUserAuthoredText` from `(^|[\s\n>])` to a non-word-boundary class and add a homoglyph folding map for Cyrillic/Greek role tokens (mk-goal.js:199-202, 192); extend `redactEvidence` with Bearer-token and JWT redaction patterns (mk-goal.js:230-234); regression test in `mk-goal-state.test.cjs` covering the adversarial table (`(system:`, `"system:`, `>system:`, `ѕystem:` Cyrillic, `sуstem:` Cyrillic, Bearer/JWT strings) plus unchanged existing whitespace-prefixed fixtures
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-state.test.cjs` failed pre-fix on `(system: do X)`; GREEN rerun passed 1/1 after prefix widening, homoglyph folding, and Bearer/JWT redaction.
- [x] T007 F6: replace the single-slot `lastAccountedMessageID` dedupe in `accountUsage` (mk-goal.js:1074-1104, dedupe at 1078) with a bounded per-messageID last-accounted map that charges deltas; regression test in `mk-goal-lifecycle.test.cjs` driving an interleaved stream (msg-1-partial, msg-2-final, msg-1-final) and asserting each message charges exactly once with correct `budget_limited` trigger timing (1090-1091)
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` failed pre-fix with `150 !== 110`; GREEN rerun passed 1/1 after adding bounded `accountedMessageUsage` delta charging.
- [x] T008 F7: compute the `mutation=` label inside the `setGoal` mutator (mk-goal.js:993-1016) from the state it actually transformed instead of a pre-read outside the queue (1668-1675), and report `replaced` for same-objective-on-terminal-status (`complete`/`blocked`/`budget_limited`/`usage_limited`, matching the `buildNewGoal` path at 998-999); regression test in `mk-goal-tool-path.test.cjs` asserting `set` on a `complete` goal with an identical objective returns `mutation=replaced` with a fresh `goalId` and reset counters, while `set` on an `active` goal with the same objective still returns `mutation=refreshed`
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-tool-path.test.cjs` failed pre-fix because terminal same-objective set emitted `mutation=refreshed`; GREEN rerun passed 1/1 after moving label derivation into `setGoal`.

### P3 Fixes F8-F12 (fix + regression test per task)

- [x] T009 F8: replace `sanitizeInlineText` on `query.directory` in `buildPromptAsyncOptions` (mk-goal.js:1396-1400) with path-appropriate validation (resolve + existence check), no text sanitizer; regression test in `mk-goal-continuation.test.cjs` asserting a directory containing a `user:`/`tool:` segment or NFD-unicode (macOS) dispatches unchanged
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-continuation.test.cjs` failed pre-fix after `user:workspace/café` became `user-role:workspace/café`; GREEN rerun passed 1/1 after path validation replaced text sanitization.
- [x] T010 F9: make `event()` always append errors to `.goal-events.log` (mk-goal.js:1842-1848, 497-505), keep console output debug-only (`MK_GOAL_DEBUG=1`); regression test in `mk-goal-lifecycle.test.cjs` asserting a corrupt state file yields an `event_error` line in `.goal-events.log` with `MK_GOAL_DEBUG` unset
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` failed pre-fix with missing `event_error`; GREEN rerun passed 1/1 after removing the debug gate from event-error JSONL logging.
- [x] T011 F10: whitelist known fields in `normalizeStoredGoal` instead of spreading `...rawGoal` (mk-goal.js:670-671), re-validate `tokenBudget` as numeric on read (678, guards against silent disable at 1049-1051); regression test in `mk-goal-state.test.cjs` asserting an unknown injected field does not survive a read-write round trip and a non-numeric hand-edited `tokenBudget` no longer silently disables budget enforcement
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-state.test.cjs` failed pre-fix with injected field survival `true !== false`; GREEN rerun passed 1/1 after field whitelisting and token budget revalidation.
- [x] T012 F11: adopt one disabled-flag policy — re-evaluate `process.env` per call everywhere, including the transform gate which currently uses the factory-time `options.enabled` snapshot (mk-goal.js:1729 vs 1662/1701, gate at 1852); regression test in `mk-goal-lifecycle.test.cjs` flipping `MK_GOAL_PLUGIN_DISABLED` mid-process and asserting the transform gate and tools gate identically on the next call
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-lifecycle.test.cjs` failed pre-fix because transform injected while disabled; GREEN rerun passed 1/1 after per-call option normalization in event/transform/tool hooks.
- [x] T013 F12: point `fsyncDirectory` failure logging at the state root always, never the directory that failed (mk-goal.js:758-764, avoids self-defeating mkdir-during-deletion races via `ensureGoalStateDir`); regression test in `mk-goal-state.test.cjs` asserting an archive-dir fsync failure logs to the state root, not inside `.archive/`
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-state.test.cjs` failed pre-fix with no root `fsync_directory_error`; GREEN reruns passed `mk-goal-state.test.cjs` 1/1 and `mk-goal-export-contract.test.cjs` 1/1 after logging to the state root and pinning the new `fsyncDirectory` seam.

### D1-D3 Contract Alignment (code + doc, fix + regression test per task)

- [x] T014 D1: add `ACTION=<resolved action>` to the failure envelope (`failureLines`, mk-goal.js:1650-1657), additive only — existing `STATUS`/`ERROR`/`code` fields stay byte-identical, honoring the published `goal_opencode.md:35` contract per the dossier's recorded DECISION; regression test in `mk-goal-tool-path.test.cjs` asserting a failing tool call emits `STATUS=FAIL ACTION=<action> ERROR="..." code=...` with pre-existing fields unchanged
  - Evidence: RED `node --test .opencode/plugins/tests/mk-goal-tool-path.test.cjs` failed pre-fix because failure output was `STATUS=FAIL ERROR=...`; GREEN rerun passed 1/1 after `failureLines` emitted `ACTION=set`.
- [x] T015 D2+D3: document the `mutation=` output field (emitted at mk-goal.js:1646) and add a brief env-behavior note for `MK_GOAL_PLUGIN_DISABLED` fail-closed behavior (`STATUS=FAIL code=PLUGIN_DISABLED`) in `.opencode/commands/goal_opencode.md`; verify via doc-diff review against the live envelope output (no dedicated `.cjs` test — command-doc contract testing is INT-3's scope in phase 009, out of scope here)
  - Evidence: `.opencode/commands/goal_opencode.md` grep found `mutation=`, `MK_GOAL_PLUGIN_DISABLED`, and `STATUS=FAIL ACTION`; `node --test .opencode/plugins/tests/mk-goal-tool-path.test.cjs` passed 1/1 against live envelope behavior.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Final verification — Evidence: fresh `node --test .opencode/plugins/tests/mk-goal-*.test.cjs` = 6 files, 6 pass, 0 fail (same file-level count as the T001 baseline; each file's internal scenario count grew per the RED/GREEN evidence above). `mk-goal-export-contract.test.cjs` was updated in lockstep with T013's fix, which added a 16th seam (`fsyncDirectory`) needed by its own regression test — the export and its test assertion match exactly (`sort()`-based `deepEqual`, verified directly against the live file). `checklist.md`'s 42 items are all `[x]` with per-finding evidence. `SPECKIT_VALIDATE_LEGACY=1 bash validate.sh .opencode/specs/system-deep-loop/026-goal-opencode-plugin/016-plugin-correctness-fixes --strict` → Errors: 0, Warnings: 4 (all non-blocking: PRIORITY_TAGS/EVIDENCE_CITED formatting-convention mismatches on the checklist's sub-bullet evidence style, 4 non-blocking ANCHORS_VALID/TEMPLATE_HEADERS deviations from 3 custom Per-Finding sections added to checklist.md). One real SPEC_DOC_INTEGRITY error (implementation-summary.md's Spec Folder field used the full packet path instead of the bare folder name) was found and fixed during this verification pass.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Fresh full 6-file suite run pasted as evidence, delta reported against the T001 baseline
- [x] `checklist.md` fully verified with evidence
- [x] `validate.sh --strict` passes (Errors: 0) on this folder (via `SPECKIT_VALIDATE_LEGACY=1`, per Known Limitations)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Finding source**: `../scratch/2026-07-03-four-reviewer-audit-findings.md` §A (F1-F12, D1-D3; folded remedy shapes e-2.6, e-2.7, e-3.3, e-1.5)
<!-- /ANCHOR:cross-refs -->
