---
title: "Tasks: Phase 15: vibe-turn-start-advisor-and-dist"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "vibe turn start advisor and dist tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 15: vibe-turn-start-advisor-and-dist

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

`S` is `.skilled/hooks/session-lifecycle/vibe`. `A` is `.skilled/skills/system-skill-advisor`. `G` is `.vibe/plugins/repo-guards`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the shared advisor handler passes its dsh suite (`A/hooks/tests/dsh-prompt-advisor.test.mjs`). Verify: `node --test A/hooks/tests/dsh-prompt-advisor.test.mjs` prints `fail 0`.
- [x] T002 [P] Confirm the dist checker runs in both modes (`.skilled/skills/sk-code/sk-code-quality/scripts/check-dist-staleness.sh`). Verify: `--all` and a single watched file both exit 0.
- [x] T003 Record the Vibe `pre_agent` payload fields and the reply fields this phase uses (`scratch/wire.md`). Verify: `rg -c "additional_context|session_id|parent_session_id|prompt" scratch/wire.md` prints at least 4.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Add `vibe` to the runtime label list and rebuild the advisor dist (`A/runtime/lib/advisor-runtime-values.ts`). Verify: `npm run build` in `A/runtime` exits 0, and `rg -c "'vibe'" A/runtime/dist/lib/advisor-runtime-values.js` prints 1. (The compiled file is `A/runtime/dist/runtime/lib/advisor-runtime-values.js`; `rg -c` prints 1 there.)
- [x] T005 Add the advisor part that maps the Vibe payload and skips children and subagents (`A/hooks/vibe/prompt-advisor.mjs`). Verify: `node --check A/hooks/vibe/prompt-advisor.mjs` exits 0.
- [x] T006 Add the composer with its ordered, fail-open part list (`S/turn-start.mjs`). Verify: `echo 'not json' | node S/turn-start.mjs` exits 0 and prints nothing.
- [x] T007 Add the composer tests for brief, blank, child, subagent, throwing-part and malformed-input cases (`S/turn-start.test.mjs`). Verify: `node --test S/turn-start.test.mjs` prints `pass 6` and `fail 0`.
- [x] T008 Add the non-strict dist-freshness hook (`G/dist-freshness.mjs`). Verify: `node --check G/dist-freshness.mjs` exits 0.
- [x] T009 Add the dist hook tests for an edit, a matched shell and an unmatched shell command (`G/tests/dist-freshness.test.mjs`). Verify: `node --test G/tests/dist-freshness.test.mjs` prints `pass 3` and `fail 0`.
- [x] T010 Register one `pre_agent` composer entry and the dist entries (`.vibe/hooks.toml`). Verify: `rg -c 'type = "pre_agent"' .vibe/hooks.toml` prints 2, and `rg -c "dist-freshness.mjs" .vibe/hooks.toml` prints at least 1.
- [x] T011 [P] Add the turn-start composer row (`S/README.md`). Verify: `rg -c "turn-start" S/README.md` prints at least 1.
- [x] T012 [P] Add the Vibe row (`.skilled/hooks/dist-freshness/README.md`). Verify: `rg -c "dist-freshness.mjs" .skilled/hooks/dist-freshness/README.md` prints at least 1.
- [x] T013 [P] Add the two new hook entries (`.vibe/SYNC.md`). Verify: `rg -c "turn-start|dist-freshness.mjs" .vibe/SYNC.md` prints at least 1.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Rerun the renderer test against the new entries (`G/tests/render-home-hooks.test.mjs`). Verify: `node --test G/tests/render-home-hooks.test.mjs` prints `fail 0`.
- [x] T015 Measure composer latency over 20 calls on a warm advisor, against a limit of 1500 ms at the 95th percentile (`scratch/latency.md`). Verify: `rg -n "p95|median|max" scratch/latency.md` prints three lines with millisecond values and a `limit: pass` or `limit: fail` line; on `fail` the advisor part stays, the number is recorded, and the operator is asked before phase 016 starts.
- [x] T016 Run one keyed scratch-cwd dispatch with the rendered home hooks and no `AI_SESSION_CHILD`, whose prompt writes nothing, so the advisor part runs (`scratch/keyed-run/advisor/`). Verify: its journal holds a `pre_agent` `hook_completed` record whose context starts with `Advisor:`.
- [x] T017 Run the documented child dispatch (`AI_SESSION_CHILD=1`) with the rendered home hooks, whose prompt edits one watched source file (`scratch/keyed-run/dist/`). Verify: its journal holds a `post_tool` record with `STALE DIST WARNING`, and no `Advisor:` context, because the advisor part skips children.
- [x] T018 Call the composer twice with one session id and an unchanged prompt route, against the real advisor and a temporary directive store (`scratch/dedupe.txt`). A print-mode run is one turn, so this check runs outside Vibe. Verify: the first output holds the routing head and `Directives:`, the second holds neither, and both are saved in `scratch/dedupe.txt`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:follow-ups -->
## Follow-ups

- [B] F001 The `vibe` label breaks the advisor's own runtime-list invariant, and the repair sits outside this phase's write authority. `A/runtime/tests/hooks/advisor-runtime-list-parity.vitest.ts` needs a `vibe` directory under `.skilled/hooks/skill-advisor/` and a `| **Vibe** |` row in `A/hooks/skill-advisor-hook.md`; `A/runtime/tests/legacy/advisor-observability.vitest.ts:69` pins the exact tuple and needs `'vibe'` appended. No CI workflow runs these two files today, but `npx vitest run` in `A/runtime` fails 3 cases until they are updated.
<!-- /ANCHOR:follow-ups -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining (F001 is blocked)
- [x] Both keyed runs' journal excerpts are in `scratch/keyed-run/`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
