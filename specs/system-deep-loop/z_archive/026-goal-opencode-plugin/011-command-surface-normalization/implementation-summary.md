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
    packet_pointer: "system-deep-loop/026-goal-opencode-plugin/011-command-surface-normalization"
    last_updated_at: "2026-07-01T00:00:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Amended 2026-07-01: operator confirmed goal_opencode.md as final"
    next_safe_action: "Proceed to phase 012 (regression-test-backfill)"
    blockers: []
    key_files:
      - ".opencode/commands/goal_opencode.md"
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:161cc6191170579d804aa33b19b09fa5d4f84c3266169d2e0d05fe486f877406"
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
| **Status** | Complete |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The `/goal` command file had three committed renames in two days with no durable doc sweep: `goal.md` -> `goal_opencode.md` -> `goal.md` -> `goal_opencode.md`. `opencode_goal.md` was never a committed path. This phase picked one final name, backed by deep-research's confirmed no-built-in-collision finding, and closed every reference in one pass, plus fixed two smaller config-contract gaps deep-review found in the same command surface.

**Amendment (2026-07-01, same day):** this phase originally renamed the file to `.opencode/commands/goal.md`. The operator subsequently confirmed `.opencode/commands/goal_opencode.md` as the correct, final name instead (a concurrent session had independently reached the same filename). All referencing surfaces below were re-swept to point at `goal_opencode.md`; the command file itself was not renamed again since it was already at that name in the shared working tree.

### Command rename

The command file lives at `.opencode/commands/goal_opencode.md`. Its own `# /goal` heading matches. A repo-wide sweep confirmed nine referencing surfaces needed no filename fix at all when this phase first ran (phase 003/007/008 docs and both feature catalogs/playbooks already referenced `goal.md`, since that was phase 003's original, never-realized mandate) — those same nine surfaces were updated again in the amendment to point at `goal_opencode.md`. The two surfaces that carried retired names were fixed directly: `004-lifecycle-tracking/graph-metadata.json` (stripped two non-deliverable files from `key_files` per DR-007-P2) and the `goal-prompting-runtime-specific.md` constitutional memory note (updated its "currently named" claim to `/goal_opencode`; its historical rename narrative was extended, not rewritten).

### Unknown-verb contract (REQ-004)

The command doc claimed unsupported verbs fail with `STATUS=FAIL`; the actual `/goal` command routing (steps 1-7 in `goal_opencode.md` `## 4. INSTRUCTIONS`) always resolves any non-empty argument to `action: "set"` before the tool is ever called — it never sends an unrecognized verb through. The doc's claim was wrong, not the behavior, so the doc line was corrected to describe the real coerce-to-`set` behavior. `executeGoalAction`'s own internal fallback (an unrecognized `action` field defaults to `show`) is a separate, defensive layer that only matters if something calls the `mk_goal` tool directly outside the command's routing — it doesn't contradict the doc fix.

### MK_GOAL_PLUGIN_DISABLED fail-closed (REQ-005)

`MK_GOAL_PLUGIN_DISABLED=1` previously only suppressed passive injection/autonomy; manual `/goal set|clear|complete|pause` tool calls still executed. `executeGoalAction` and `executeGoalStatus` now throw a `PLUGIN_DISABLED` `GoalError` up front when the flag is set, so manual mutations fail closed too. `ENV_REFERENCE.md`'s entry was updated to describe this broader contract.

### Mutation-status field (REQ-006)

`/goal set` output now includes a `mutation=created|refreshed|replaced` line: `created` when no goal existed, `refreshed` when the same objective was re-set, `replaced` when a different objective overwrote an existing goal.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/commands/goal_opencode.md` | Modified | Final canonical command filename (REQ-002, amended); corrected the unknown-verb-fails claim to the real coerce-to-set behavior (REQ-004) |
| `.opencode/plugins/mk-goal.js` | Modified | Fail-closed `MK_GOAL_PLUGIN_DISABLED` gate on `executeGoalAction`/`executeGoalStatus` (REQ-005); `mutation` field on `/goal set` output (REQ-006) |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified | `MK_GOAL_PLUGIN_DISABLED` entry now documents the broader fail-closed contract |
| `.opencode/skills/system-spec-kit/constitutional/goal-prompting-runtime-specific.md` | Modified | "Currently named" claim updated to `/goal_opencode`; historical rename narrative extended with the amendment |
| `.opencode/specs/system-deep-loop/026-goal-opencode-plugin/004-lifecycle-tracking/graph-metadata.json` | Modified | Stripped two non-deliverable files (`mk-spec-memory.js`, `session-cleanup.js`) from `key_files` (DR-007-P2) |
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
| Originally renamed to plain `goal.md`, not a prefixed variant | Deep-research proved via a `strings` search of the installed opencode 1.17.11 binary that no built-in `/goal` command exists, so there was never a real collision forcing a prefix |
| Amended to `goal_opencode.md` as the final name | The operator explicitly overrode this phase's `goal.md` conclusion in favor of `goal_opencode.md`, matching what a concurrent session had independently converged on |
| REQ-004: fixed the doc, not the code | The command's own routing already resolves every input to a valid action before calling the tool; the doc's "unsupported verbs fail" claim was simply inaccurate |
| REQ-005: fail closed, not doc-narrow | No existing test exercises manual mutations while `MK_GOAL_PLUGIN_DISABLED=1`, so fail-closed is the safer contract and costs nothing in test regressions |
| Re-swept 9 doc/catalog/playbook surfaces to `goal_opencode.md` | They initially needed no edit when this phase renamed to `goal.md` (phase 003's original, never-realized mandate matched), but the amendment to `goal_opencode.md` required updating all nine |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `ls .opencode/commands/*goal*.md` | PASS — exactly one file, `goal_opencode.md` (post-amendment) |
| `node --check .opencode/plugins/mk-goal.js` | PASS |
| Full 6-file `mk-goal-*.test.cjs` suite (fresh run, this verification pass) | PASS — 6/6 exit 0 |
| Repo-wide `rg -n 'goal\.md'` excluding `.git/`, `**/changelog/**`, `**/research/**`, `**/review/**`, `**/research_archive/**` (post-amendment re-run) | Non-zero, but every remaining hit is historical narrative (this phase's own spec/plan/tasks describing the original `goal.md` decision, or the constitutional note's rename history) — zero hits reference `goal.md` as the *current* filename |
| `mutation=created\|refreshed\|replaced` repro (3 sequential `executeGoalAction` set calls: new objective, same objective, different objective) | PASS — `created`, `refreshed`, `replaced` in order, independently reproduced |
| `MK_GOAL_PLUGIN_DISABLED=1` fail-closed repro (`set` and `status` calls) | PASS — both return `STATUS=FAIL ERROR="...disables goal plugin tool execution" code=PLUGIN_DISABLED`, independently reproduced |
| `goal_opencode.md` unknown-verb doc vs. code cross-check | PASS — `## 4. INSTRUCTIONS` steps 1-7 confirm every input resolves to a valid action before the tool call; doc line now matches |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Historical narrative still mentions retired filenames, including `goal.md` (this phase's own original, now-superseded conclusion).** This phase's own `spec.md`/`plan.md`/`tasks.md`/`graph-metadata.json` and the constitutional memory file's rename history intentionally keep past names in past-tense narrative — this is correct, not stale, but it means a literal repo-wide grep for retired names does not return zero hits (only zero hits as a *current* filename claim).
2. **A fifth rename is still architecturally possible.** Nothing in this phase prevents another session from renaming the command file again; the fix is procedural (this phase existing) and evidentiary (the no-collision finding), not a code-level guard. The operator's 2026-07-01 confirmation of `goal_opencode.md` is the standing decision until explicitly changed again.
<!-- /ANCHOR:limitations -->

---

<!--
CORE TEMPLATE: Post-implementation documentation, created AFTER work completes.
Write in human voice: active, direct, specific. No em dashes, no hedging, no AI filler.
HVR rules: .opencode/skills/sk-doc/references/hvr_rules.md
-->
