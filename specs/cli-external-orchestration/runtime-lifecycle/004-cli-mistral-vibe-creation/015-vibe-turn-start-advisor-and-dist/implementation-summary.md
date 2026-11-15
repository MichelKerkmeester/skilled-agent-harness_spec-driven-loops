---
title: "Implementation Summary"
description: "Built the pre_agent turn-start composer with the advisor brief as its first part, the non-strict post_tool dist-freshness hook, the vibe runtime label and both registrations. Both keyed runs recorded. Follow-up F001, the advisor runtime-list tuple, is resolved."
trigger_phrases:
  - "vibe turn start advisor and dist implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/015-vibe-turn-start-advisor-and-dist"
    last_updated_at: "2026-11-15T10:35:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Confirmed F001 resolved: both advisor tuple test files pass 14 of 14"
    next_safe_action: "None: the phase is closed"
    blockers: []
    key_files:
      - ".skilled/hooks/session-lifecycle/vibe/turn-start.mjs"
      - ".skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs"
      - ".vibe/plugins/repo-guards/dist-freshness.mjs"
      - ".vibe/hooks.toml"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "mistral-support-2026-11-14"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Does the shared handler emit the routing head every turn? It reduces to the head once the directive block is proven delivered, so the advisor part keeps a per-session head receipt for the head itself. T018 proved both reductions."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 015-vibe-turn-start-advisor-and-dist |
| **Completed** | 2026-11-14, F001 resolved 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A Vibe session now gets the skill advisor brief on each main-session prompt, and an edit that leaves a watched package's build behind its sources now returns a `STALE DIST WARNING` with the tool result. Both go through hooks that never block.

### Phase 15: vibe-turn-start-advisor-and-dist

- **Turn-start composer.** `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` runs on `pre_agent` for the main session only. It parses one payload from stdin, runs a fixed list of part builders each in its own try/catch, joins the non-empty results with a blank line, and prints one `{"hook_specific_output":{"additional_context":"..."}}` object. Malformed input, a non-`pre_agent` event and an empty result print nothing and exit 0. Later turn-start concerns add a builder here instead of a new `hooks.toml` entry.
- **Advisor part.** `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` maps the Vibe payload onto `handleClaudeUserPromptSubmit` under the `vibe` runtime label, with the checkout root as the advisor workspace so a scratch-cwd dispatch still resolves the advisor CLI. It skips a blank prompt, `AI_SESSION_CHILD=1` and a non-null `parent_session_id`. The shared handler's file-backed directive store drops the constant `Directives:` block on a proven repeat; a per-session head receipt under the same state directory drops the routing head when it has not changed.
- **Runtime label.** `vibe` joined `ADVISOR_RUNTIME_VALUES`, and the advisor runtime was rebuilt so the compiled label list carries it.
- **Dist hook.** `.vibe/plugins/repo-guards/dist-freshness.mjs` runs on `post_tool`. A `write_file` or `edit` checks the edited file in single-file mode; a `bash` or `process_start` command that runs `validate.sh` or a headless dispatch checks every package with `SPECKIT_DIST_AUTO_REBUILD=0`, so a mid-session check never races a rebuild. A failed tool call stays silent. The entry is non-strict, so a checker failure leaves the tool result intact.
- **Registrations and docs.** `.vibe/hooks.toml` holds one `pre_agent` composer entry (`match = "main"`, `timeout = 20.0`) and two `post_tool` dist entries; the session-lifecycle README, the dist-freshness README and `.vibe/SYNC.md` describe them.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/session-lifecycle/vibe/turn-start.mjs` | Created | The `pre_agent` composer with its ordered, fail-open part list |
| `.skilled/hooks/session-lifecycle/vibe/turn-start.test.mjs` | Created | Six composer cases: brief, blank, child, subagent, throwing part, malformed input |
| `.skilled/skills/system-skill-advisor/hooks/vibe/prompt-advisor.mjs` | Created | The advisor part: payload mapping, skip rules, head receipt |
| `.skilled/skills/system-skill-advisor/runtime/lib/advisor-runtime-values.ts` | Modified | Added `vibe` to the runtime label tuple |
| `.skilled/skills/system-skill-advisor/runtime/dist/**` | Rebuilt | The compiled label list and the rest of the advisor dist |
| `.vibe/plugins/repo-guards/dist-freshness.mjs` | Created | The non-strict `post_tool` staleness check |
| `.vibe/plugins/repo-guards/tests/dist-freshness.test.mjs` | Created | Edit, matched shell and unmatched-shell cases |
| `.vibe/hooks.toml` | Modified | One `pre_agent` composer entry and two `post_tool` dist entries |
| `.skilled/hooks/session-lifecycle/vibe/README.md` | Modified | The turn-start composer row |
| `.skilled/hooks/dist-freshness/README.md` | Modified | The Vibe row in the per-runtime matrix |
| `.vibe/SYNC.md` | Modified | The composer and dist entries in the guards section |
| `scratch/wire.md` | Created | The `pre_agent` and `post_tool` fields this phase reads and writes |
| `scratch/latency.md` | Created | The 20-call latency measurement |
| `scratch/dedupe.txt` | Created | The two-call dedupe transcript |
| `scratch/keyed-run/advisor/` | Created | The main-session run's export, journal, stdout and excerpt |
| `scratch/keyed-run/dist/` | Created | The child run's export, journal, stdout, warning excerpt and excerpt |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The composer copies `session-start.mjs`: one stdin read, a fixed builder list, a per-part try/catch, one joined `additional_context`. The advisor part copies the dsh adapter's payload mapping and skip rules, but keeps its receipts on disk because Vibe starts a new process per turn. The dist hook copies `post-edit-quality.mjs`'s fail-open shape and calls the same `check-dist-staleness.sh` the session-start hook already runs.

The two hooks were proven three ways: unit tests for the decisions, a keyed main-session run for the advisor brief, and a keyed child dispatch for the dist warning. The dedupe check ran the composer twice outside Vibe, because a print-mode run is one turn.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The head receipt lives under `SPECKIT_DIRECTIVE_LIFECYCLE_STATE_DIR` (default `$TMPDIR/speckit-advisor`) in a `vibe-turn-start/` subfolder | A Vibe hook is a new process per turn, so an in-memory receipt cannot dedupe; sharing the directive store's base directory lets one switch isolate both receipts, and the subfolder never collides with the store's own `directive-lifecycle/` tree |
| The advisor part passes the checkout root as `cwd`, not the payload's `cwd` | A dispatched Vibe session runs in a scratch folder, where the advisor CLI walk-up finds nothing; the checkout is located from the hook file, as `session-start.mjs` already does |
| The composer exports `composeTurnStart` and guards its CLI entry | The tests inject a part list without an env seam in production code, and the malformed-input case still spawns the real entry point |
| The dist hook exports `runDistFreshness` with an injected checker runner | The three cases pin which call earns a check and which checker mode it names without making a real package stale or adding a production env override |
| The composer is a separate `pre_agent` entry from `spec-gate-classify` | A composer failure cannot open the spec gate, which is the frozen decision D2 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| T001 shared advisor dsh suite | `node --test .skilled/skills/system-skill-advisor/hooks/tests/dsh-prompt-advisor.test.mjs` printed `pass 8`, `fail 0` |
| T002 dist checker modes | `--all` and a single watched file both exited `0` |
| T003 wire fields | `rg -c "additional_context\|session_id\|parent_session_id\|prompt" scratch/wire.md` printed `7` |
| T004 label and rebuild | `npm run build` in `A/runtime` exited `0`; `rg -c "'vibe'" A/runtime/dist/runtime/lib/advisor-runtime-values.js` printed `1` (the task text names `dist/lib/`, which does not exist) |
| T005 advisor part syntax | `node --check A/hooks/vibe/prompt-advisor.mjs` exited `0` |
| T006 composer malformed input | `echo 'not json' \| node S/turn-start.mjs` exited `0` and printed nothing |
| T007 composer tests | `node --test S/turn-start.test.mjs` printed `pass 6`, `fail 0` |
| T008 dist hook syntax | `node --check G/dist-freshness.mjs` exited `0` |
| T009 dist hook tests | `node --test G/tests/dist-freshness.test.mjs` printed `pass 3`, `fail 0` |
| T010 registrations | `rg -c 'type = "pre_agent"' .vibe/hooks.toml` printed `2`; `rg -c "dist-freshness.mjs" .vibe/hooks.toml` printed `2` |
| T011 session-lifecycle README | `rg -c "turn-start" S/README.md` printed `6` |
| T012 dist-freshness README | `rg -c "dist-freshness.mjs" .skilled/hooks/dist-freshness/README.md` printed `1` |
| T013 SYNC.md | `rg -c "turn-start\|dist-freshness.mjs" .vibe/SYNC.md` printed `2` |
| T014 renderer test | `node --test G/tests/render-home-hooks.test.mjs` printed `pass 4`, `fail 0` |
| T015 latency | 20 calls: `median` 377.7 ms, `p95` 737.6 ms, `max` 870.7 ms, `limit: pass` |
| T016 main-session keyed run | Journal `pre_agent_turn` `hook_completed` context starts with `Advisor: no skill matched.`; `export.json` records `exit_code` `0`, `outcome` `finished` |
| T017 child keyed run | Journal `post_tool_call` record carries `STALE DIST WARNING: @spec-kit/system-skill-advisor`; no `Advisor:` text anywhere in the journal |
| T018 dedupe | First call held `Advisor:` and `Directives:`; second call printed nothing |
| SC-001 combined suite | `node --test S/turn-start.test.mjs G/tests/dist-freshness.test.mjs` printed `tests 9`, `pass 9`, `fail 0` |
| Strict validation | `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh <this folder> --strict --quiet` printed `RESULT: PASSED` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **F001 is resolved.** The fix landed with the Vibe mode commit, and on 2026-11-15 `npx vitest run` on both test files printed 14 of 14 passing. The original problem: adding `vibe` to `ADVISOR_RUNTIME_VALUES` breaks the advisor's own cross-file invariant. `A/runtime/tests/hooks/advisor-runtime-list-parity.vitest.ts` needs a `vibe` directory under `.skilled/hooks/skill-advisor/` and a `| **Vibe** |` row in `A/hooks/skill-advisor-hook.md`; `A/runtime/tests/legacy/advisor-observability.vitest.ts:69` pins the exact tuple and needs `'vibe'` appended. `npx vitest run` on those two files fails 3 cases. Neither file is in this phase's Files to Change, so the repair needs write authority this worker did not have. No CI workflow runs those two files today.
2. **The T004 verify path in `tasks.md` is wrong.** The compiled file is `A/runtime/dist/runtime/lib/advisor-runtime-values.js`, not `A/runtime/dist/lib/advisor-runtime-values.js`. The check was run against the real path and printed `1`.
3. **`--add-dir` loads that directory's `.vibe/hooks.toml`.** The first child-dispatch attempt passed `--add-dir <checkout root>` so the edit could reach a watched source. That made the checkout a project root, so the unrendered project hooks file won over the rendered home copy and every `$(git rev-parse --show-toplevel)` command failed from the scratch cwd. The recorded run passes `--add-dir <watched package>/lib` instead, which has no `.vibe/` folder. A production dispatch that needs checkout-wide file access hits the same wall.
4. **The head receipt is not reset by compaction.** Vibe exposes no compaction event, so a compacted-away head is not re-sent; the shared handler's directive store still re-sends the block when the transcript shrinks.
<!-- /ANCHOR:limitations -->

---
