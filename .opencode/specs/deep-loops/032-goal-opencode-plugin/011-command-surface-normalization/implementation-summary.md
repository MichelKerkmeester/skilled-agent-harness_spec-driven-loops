---
title: "Implementation Summary: Phase 11: command-surface-normalization"
description: "Renamed the /goal command to its final canonical name and swept every referencing surface; reconciled two config-contract gaps."
trigger_phrases:
  - "goal command rename"
  - "phase 011 implementation summary"
  - "command surface normalization"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/032-goal-opencode-plugin/011-command-surface-normalization"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Verified GPT-5.5's phase 011 changes and closed out documentation"
    next_safe_action: "Proceed to phase 012 (regression-test-backfill)"
    blockers: []
    key_files:
      - ".opencode/commands/goal.md"
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-011-command-surface-20260701"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "REQ-004 resolved by correcting the command doc to match the actual coerce-to-set dispatch behavior (code left unchanged)."
      - "REQ-005 resolved by making executeGoalAction/executeGoalStatus fail closed when MK_GOAL_PLUGIN_DISABLED=1, since no existing test relied on manual mutations working while disabled."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 011-command-surface-normalization |
| **Completed** | 2026-07-01 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `/goal` command file had been renamed twice in two days with no doc sweep either time (`opencode_goal.md` -> `goal_opencode.md`), leaving nine referencing surfaces stale. This phase picks one final name, backed by deep-research's confirmed no-built-in-collision finding, and closes every reference in one pass, plus fixes two smaller config-contract gaps deep-review found in the same command surface.

### Command rename

`.opencode/commands/goal_opencode.md` is now `.opencode/commands/goal.md`. Its own `# /goal` heading already matched, so no further edit was needed there. A repo-wide sweep confirmed nine referencing surfaces needed no filename fix at all (phase 003/007/008 docs and both feature catalogs/playbooks already referenced `goal.md`, since that was phase 003's original, never-realized mandate); the two surfaces that did carry the retired names were fixed directly: `004-lifecycle-tracking/graph-metadata.json` (stripped two non-deliverable files from `key_files` per DR-007-P2) and the `goal-prompting-runtime-specific.md` constitutional memory note (updated only its "currently named" claim; its historical rename narrative was left untouched, since that record is accurate).

### Unknown-verb contract (REQ-004)

The command doc claimed unsupported verbs fail with `STATUS=FAIL`; the actual `/goal` command routing (steps 1-7 in `goal.md` `## 4. INSTRUCTIONS`) always resolves any non-empty argument to `action: "set"` before the tool is ever called — it never sends an unrecognized verb through. The doc's claim was wrong, not the behavior, so the doc line was corrected to describe the real coerce-to-`set` behavior. `executeGoalAction`'s own internal fallback (an unrecognized `action` field defaults to `show`) is a separate, defensive layer that only matters if something calls the `mk_goal` tool directly outside the command's routing — it doesn't contradict the doc fix.

### MK_GOAL_PLUGIN_DISABLED fail-closed (REQ-005)

`MK_GOAL_PLUGIN_DISABLED=1` previously only suppressed passive injection/autonomy; manual `/goal set|clear|complete|pause` tool calls still executed. `executeGoalAction` and `executeGoalStatus` now throw a `PLUGIN_DISABLED` `GoalError` up front when the flag is set, so manual mutations fail closed too. `ENV_REFERENCE.md`'s entry was updated to describe this broader contract.

### Mutation-status field (REQ-006)

`/goal set` output now includes a `mutation=created|refreshed|replaced` line: `created` when no goal existed, `refreshed` when the same objective was re-set, `replaced` when a different objective overwrote an existing goal.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/goal_opencode.md` -> `.opencode/commands/goal.md` | Renamed | Final canonical command filename (REQ-002) |
| `.opencode/commands/goal.md` | Modified | Corrected the unknown-verb-fails claim to the real coerce-to-set behavior (REQ-004) |
| `.opencode/plugins/mk-goal.js` | Modified | Fail-closed `MK_GOAL_PLUGIN_DISABLED` gate on `executeGoalAction`/`executeGoalStatus` (REQ-005); `mutation` field on `/goal set` output (REQ-006) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | `MK_GOAL_PLUGIN_DISABLED` entry now documents the broader fail-closed contract |
| `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | Modified | "Currently named" claim updated to `/goal`; historical rename narrative left untouched |
| `.opencode/specs/deep-loops/032-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json` | Modified | Stripped two non-deliverable files (`mk-spec-memory.js`, `session-cleanup.js`) from `key_files` (DR-007-P2) |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented by GPT-5.5 (cli-opencode, high effort) in an isolated git worktree; that dispatch was interrupted mid-write (killed before it finished this summary doc), so the code/doc diffs were independently re-verified here (Sonnet) against the actual worktree state rather than trusted from the dispatch's own self-report, then this summary was completed directly from that verification.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Renamed to plain `goal.md`, not a prefixed variant | Deep-research proved via a `strings` search of the installed opencode 1.17.11 binary that no built-in `/goal` command exists, so there was never a real collision forcing a prefix |
| REQ-004: fixed the doc, not the code | The command's own routing already resolves every input to a valid action before calling the tool; the doc's "unsupported verbs fail" claim was simply inaccurate |
| REQ-005: fail closed, not doc-narrow | No existing test exercises manual mutations while `MK_GOAL_PLUGIN_DISABLED=1`, so fail-closed is the safer contract and costs nothing in test regressions |
| Left 9 doc/catalog/playbook surfaces untouched | They already referenced `goal.md` (phase 003's original, never-realized mandate) — the rename made them correct rather than requiring an edit |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ls .opencode/commands/*goal*.md` | PASS — exactly one file, `goal.md` |
| `node --check .opencode/plugins/mk-goal.js` | PASS |
| Full 6-file `mk-goal-*.test.cjs` suite (fresh run, this verification pass) | PASS — 6/6 exit 0 |
| Repo-wide `rg -n 'opencode_goal\|goal_opencode'` excluding `.git/`, `**/changelog/**`, `**/research/**`, `**/review/**`, `**/research_archive/**` (independently re-run, this verification pass) | Non-zero, but every remaining hit is this phase's own spec/plan/tasks/graph-metadata.json narrating the rename history it fixes, or the constitutional note's intentionally-preserved historical prose — zero hits reference the retired names as the *current* filename |
| `mutation=created\|refreshed\|replaced` repro (3 sequential `executeGoalAction` set calls: new objective, same objective, different objective) | PASS — `created`, `refreshed`, `replaced` in order, independently reproduced |
| `MK_GOAL_PLUGIN_DISABLED=1` fail-closed repro (`set` and `status` calls) | PASS — both return `STATUS=FAIL ERROR="...disables goal plugin tool execution" code=PLUGIN_DISABLED`, independently reproduced |
| `goal.md` unknown-verb doc vs. code cross-check | PASS — `## 4. INSTRUCTIONS` steps 1-7 confirm every input resolves to a valid action before the tool call; doc line now matches |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical narrative still mentions both retired filenames.** This phase's own `spec.md`/`plan.md`/`tasks.md`/`graph-metadata.json` and the constitutional memory file's rename history intentionally keep the old names in past-tense narrative — this is correct, not stale, but it means a literal repo-wide grep for the retired names does not return zero hits (only zero hits as a *current* filename claim).
2. **A third rename is still architecturally possible.** Nothing in this phase prevents another session from renaming the command file again; the fix is procedural (this phase existing) and evidentiary (the no-collision finding), not a code-level guard.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
