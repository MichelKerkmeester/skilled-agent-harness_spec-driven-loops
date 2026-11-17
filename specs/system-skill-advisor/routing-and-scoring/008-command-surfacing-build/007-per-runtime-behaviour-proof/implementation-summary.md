---
title: "Implementation Summary"
description: "Built and measured on 2026-11-12 and 2026-11-13. A transcript scorer and a one-turn runner measured, in throwaway arenas on six runtimes, how often a model starts a command it is offered, before and after the brief and the Gate 2 rule landed, and once more on the merged tree."
trigger_phrases:
  - "per runtime behaviour proof implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof"
    last_updated_at: "2026-11-13T18:30:00Z"
    last_updated_by: "markdown"
    recent_action: "Closed phase 7 with the measured arms, six decision records and the G5 result"
    next_safe_action: "Operator approves Codex hooks in one arena, then run the Codex-only arm"
    blockers: []
    key_files:
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/summary.json"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/summary-final.json"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/decision-record.md"
      - "specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/acceptance-criteria.md"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs"
      - ".skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-007-per-runtime-behaviour-proof"
      parent_session_id: null
    session_ref:
      runtime: "claude"
      sessionId: "fddcf466-8e1f-44cf-a132-6f846b676c18"
      workspace: "/Users/michelkerkmeester/worktrees/public/352-command-surfacing-research"
      savedAt: "2026-11-12T20:58:41Z"
      locatorKind: "transcript_path"
      version: 1
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

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-per-runtime-behaviour-proof |
| **Completed** | 2026-11-13. AC-001, AC-002, AC-003, AC-006, AC-008 and AC-009 are `Met`. AC-004, AC-005 and AC-007 are `Waived` by ADR-005 to ADR-007. AC-010 is `Superseded` by ADR-008 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

You can now see, per runtime, how often a model starts the command the advisor offered it, read from the runtime's own stored session instead of from the advisor's output. Three arms ran on six runtimes in throwaway arenas: a before arm, an after arm once the brief and the Gate 2 rule landed, and a final arm on the merged tree.

### Phase 7: per-runtime-behaviour-proof

The runner starts one runtime CLI on one corpus prompt for one turn inside an arena, a clone with no git remote and with GitHub and git credentials off. It records the session locator and the paths the turn changed, then restores them. The scorer loads each session through the shared session readers and reports the start rate, the `COMMAND:` lines, unsafe starts and started loops without init, per runtime and arm. A holdout row is refused before its prompt is read.

Start rate per runtime. A start rate counts the 8 start and 4 run rows of the chat set. A start row whose turn hit its time cap leaves the denominator, so some rates read under 12.

| Runtime | Before | After | Final | Source |
|---------|--------|-------|-------|--------|
| claude | 3 of 12 | 4 of 12 | 5 of 12 | `scratch/summary.json` line 1, `scratch/summary-final.json` line 1 |
| codex | 0 of 12 | 0 of 12 | not measured | Same files. The final arm left codex out (`../goal.md` line 149) |
| pi | 0 of 11 | 2 of 10 | 6 of 12 | Same files |
| devin | 1 of 8 | 3 of 9 | 10 of 11 | Same files |
| opencode | 2 of 7 | 1 of 5 | 2 of 5 | Same files |
| dsh | 6 of 12 | 6 of 12 | 9 of 12 | Same files. Before is the DSH rerun |

Unsafe starts. The last column is the phase 015 rescoring of the final arm, `unsafeNoChangedPath` in `../015-health-default-and-brief-refinements/scratch/summary-final-after.json`.

| Runtime | Before | After | Final | Final, no changed path |
|---------|--------|-------|-------|------------------------|
| claude | 0 | 0 | 0 | 0 |
| codex | 0 | 0 | not measured | not measured |
| pi | 3 | 1 | 1 | 1 |
| devin | 3 | 1 | 2 | 1 |
| opencode | 2 | 2 | 2 | 0 |
| dsh | 1 | 0 | 2 | 2 |

Each unsafe run has its reason in `../goal.md` section 4: lines 133 and 134 for the after arm, lines 160 and 162 for the final arm. Of the final arm's seven, four left the repository unchanged and three are write-discipline misses that a brief cannot fix.

Started-command set, 36 runs at `ae06ccb118` (`scratch/summary.json` line 1, `scratch/summary.txt` lines 10 to 76): start claude 0 of 6, codex 0 of 6, pi 4 of 6, devin 4 of 6, opencode 5 of 6 and dsh 3 of 4 with 2 unscored. Loops without init: pi 2, devin 1, opencode 1. One repeated `COMMAND:` line on opencode.

Brief delivery. In the before arm Codex got no brief, 0 of 24 transcripts hold an Advisor line (`../goal.md` line 120), and the first DSH arm ran with the advisor off (line 122). In the after arm (line 135): claude 24 of 24, devin 24 of 24, pi 24 of 24, dsh 23 of 23 stored sessions, opencode plugin loaded on 24 runs and quoted by the model in 10, codex 0 of 24 because its hooks are unapproved. The final arm's run log records `briefDelivered` true on claude 24, devin 24, pi 24 and dsh 23 with 1 unknown, and unknown on all 24 opencode lines.

G5. A command file named `skill.md` hides its sibling commands from Claude Code's Skill tool. Phase 016 fixed it by renaming `/create:skill` to `/create:sk-skill`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs` | Created | Scores one session or one or more run logs per runtime and arm |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs` | Created | Runs one prompt for one turn on one runtime, records the locator and restores changed paths |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs` | Created | Builds an arena: a clone with no remote and the ignored build output copied in |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts` | Created | Scorer cases on built sessions, no live model |
| `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md` | Modified | The two scripts, their flags and exit codes |
| `.skilled/skills/system-skill-advisor/runtime/scripts/command-bridges/derive-command-bridges.cjs` | Modified | A lead phrase needs a state or health word unless its route's policy is `ask` |
| `.skilled/skills/system-skill-advisor/runtime/tests/command-policy-derivation.vitest.ts` | Modified | A failing and a passing lead-phrase case |
| `scratch/` | Created | `before.txt`, `pre-change-commit.txt`, `cli-versions.txt`, the run logs `runs-*.jsonl`, `summary-pre.txt`, `summary.txt`, `summary.json`, `summary-final.json`, `g5/`, `g2-fixture/`, the worker briefs in `briefs/`, the worker logs in `logs/` and `gh-config-empty/`, the empty GitHub CLI config the runner hands each turn |
| `decision-record.md` | Created | ADR-005 to ADR-010 for the close |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Workers built the scorer and runner in waves, and three smoke runs fixed the per-runtime argv and locators before the before arm (T047 to T057). Each arm ran one turn at a time in a fresh arena per runtime.

| Arm | Runs | Commit | Evidence |
|-----|------|--------|----------|
| Smoke | 6 | Recorded in `2920b1abef` | `scratch/runs-smoke.jsonl` |
| Before | 144 | `2920b1abef`, results committed in `f8a7f6fc10` | `scratch/pre-change-commit.txt` line 1, `../goal.md` line 121. `AGENTS.md` at `2920b1abef` holds no `COMMAND:` line (`rg -c` exits 1) |
| Before, DSH rerun | 24 | Not recorded in any scratch file | `scratch/runs-pre-dsh-rerun.jsonl`, `../goal.md` line 122 |
| After | 144 | `ae06ccb118` | `scratch/runs-post.jsonl`, `../goal.md` line 132 |
| After, Claude with the Gate 2 bullet | 24 | Not recorded in any scratch file | `scratch/runs-post-claude-bullet.jsonl`, `../goal.md` line 130. Rescored 2026-11-13: start 4 of 12, unsafe 0, `COMMAND:` line 2 of 24 |
| Started-command set | 36 | `ae06ccb118` | `scratch/runs-g2.jsonl`, `../goal.md` line 139 |
| Final | 120 | `320e7b64d4` | `scratch/runs-final.jsonl`, `../goal.md` line 152. Each `fin-*` arena has `320e7b64d4` in its log, `fin-claude` with one arena commit on top that delivers `AGENTS.md` to Claude Code |
| G5 listings | 2 | Outside the repository | `scratch/g5/` |

The before rates in `scratch/summary.json` match a scoring of `runs-pre-final.jsonl`, which is `runs-pre.jsonl` with its DSH lines replaced by the rerun. Scoring `runs-pre.jsonl` itself prints dsh 4 of 12.

### Deviations

1. Live runs ran in arenas, not in the worktree, by operator decision of 2026-11-12 (`tasks.md` notation section). This replaces plan ADR-003.
2. T031 and T032 did not run. The once-per-command clause would reword the operator-approved Gate 2 bullet (`../goal.md` line 128).
3. The first DSH before arm ran with the fan-out leaf marker, so the advisor was off. The summary uses the 24-row rerun.
4. The Claude after arm got the brief without the Gate 2 bullet, because an arena held no `CLAUDE.md`. A rerun with the bullet read the same 4 of 12.
5. A final arm on five runtimes, not in the plan, ran at `320e7b64d4` after the merge to main. Codex was left out because its hooks are unapproved.
6. 500 runs ran against the planned 332: 6 smoke, 144 before, 24 DSH rerun, 144 after, 24 Claude rerun, 36 started-command, 120 final and 2 G5.
7. A start rate reads n of fewer than 12 when capped start rows leave the denominator. SC-001 asks for n of 12.
8. Today's scorer differs from the one that wrote `summary.json`. It counts a loop without init as unsafe, so after-arm devin reads 2 and before-arm dsh reads 2. It counts a typed command Claude Code expands as a start, so the started-command set reads claude 3 of 6.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Level 2 over the helper's Level 1 | The brief requires `acceptance-criteria.md`, and every sibling phase is Level 2 |
| Score from each runtime's session store | One normalizer serves six runtimes through the existing readers (plan ADR-001) |
| All six runtimes, a before arm on the branch tip, chat-user runs and the kept lead phrase | The operator's answers of 2026-11-12, quoted in `spec.md` section 10 |
| Waive AC-004, zero unsafe after (ADR-005) | Each unsafe run has a reason, the real ones are write discipline a brief cannot fix, and the operator moved them to a separate packet (Q057) |
| Waive AC-005, loops without init (ADR-006) | Phase 013 folded a loop without init into the scorer's safety floor, so it now counts as unsafe |
| Waive AC-007, one repeated `COMMAND:` line (ADR-007) | The once-per-command clause needs a Gate 2 edit and Gate 2 stays as the operator approved it |
| Supersede the AC-010 floor (ADR-008) | Later phases recaptured it with their own committed scripts as `[160,50,21,5]` |
| Close T020 on the recorded listings (ADR-009) | `scratch/g5/` already holds both listings and the result |
| Close without the Codex-only arm (ADR-010) | The arm needs the operator to approve the Codex hooks, and codex already has a before and an after rate |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

Every check below ran on 2026-11-13 at HEAD `1ca14a4498` unless the row names a file.

| Check | Result |
|-------|--------|
| G5 listing result | Listing B, where `skill.md` was renamed to `new-skill.md`, lists `create:readme` (`scratch/g5/listing-b.txt` line 2). Listing A, with `skill.md`, lists one entry `create` and no `create:readme` (`scratch/g5/listing-a.txt` line 1) |
| `npx vitest run tests/command-transcript-score.vitest.ts` in `ADV` | `Tests 61 passed (61)`, exit 0 |
| `node S --runtime cursor --locator '{"sessionId":"x"}'` | `{"ok":false,"code":"capability_gated"}`, exit 2 |
| `node R --list chat \| wc -l` | 24 |
| `node R --dry-run --runtime claude --row-id <holdout id>` | exit 2, `"code":"holdout_row"`, no prompt text |
| `node S --summary` over `runs-pre-final.jsonl` and `runs-post-final.jsonl` | exit 0, the same six before and after pairs as `scratch/summary.json` |
| `jq -s 'group_by(.runtime) \| map({r: .[0].runtime, n: length})'` on `runs-pre.jsonl`, `runs-post.jsonl` and `runs-pre-dsh-rerun.jsonl` | 24 lines for each of claude, codex, devin, dsh, opencode and pi in both logs, and 24 dsh lines in the rerun |
| `jq -s '[.[] \| select(.restored != true)] \| length'` on `scratch/runs-*.jsonl` | 0 of 786 lines |
| `derive-command-bridges.cjs --check` | `"status": "fresh"`, `"changed": []`, exit 0 |
| `tests/command-policy-derivation.vitest.ts` and `tests/doctor-routing-slice.vitest.ts` | 9 passed and 2 passed, each exit 0 |
| `agents-md-check.cjs --json \| jq -r .status` | `OK` |
| Typed recall, false offers, scorer eval | `{"correct":24,"total":44}`, `{"count":0,"total":35}`, `[160,50,21,5]` |
| Full suite | Not rerun here. `../017-review-pass-two-remediation/scratch/after.txt` lines 18 and 19 and `../018-holdout-row-retirement/scratch/after.txt` lines 23 and 24 read 184 files, 1796 passed, 6 skipped |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Codex never saw a brief.** Its hooks are unapproved for arena paths, so its 0 of 12 in both arms measures a model with no offer. The Codex-only arm the operator approved (Q052) waits on the operator to approve the hooks in an arena. Question 4 of the phase 009 research is carried to that arm.
2. **Cursor and Hermes are not measured.** Cursor's session reader is gated, and Hermes has no reader.
3. **Each cell is one run.** A single run can mislead, and the denominators shrink when turns hit their cap.
4. **The before and after commits are pre-rebase hashes.** `2920b1abef`, `f8a7f6fc10` and `ae06ccb118` are not ancestors of HEAD after the rebase onto main, though git still resolves them. The commits of the DSH rerun and the Claude rerun are not recorded.
5. **The restore over-reported before phase 013.** It wrote `restored: true` over staged new files, which left three arenas dirty, so later started-command turns on opencode, devin and dsh saw an earlier turn's output (`../goal.md` line 140). The worktree itself was never touched.
6. **Some runs are unscored.** DSH has 1 after-arm run, 2 started-command runs and 1 final-arm run with `locator_unavailable`. OpenCode leaves no brief trace in its store, so its delivery reads `unknown`.
<!-- /ANCHOR:limitations -->

---
