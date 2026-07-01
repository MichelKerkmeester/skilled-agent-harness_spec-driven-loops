---
title: "Implementation Summary: mk-deep-loop-guard Loop-Detection + Identity-Resolution Hardening"
description: "Implemented phase 016's Design Option B in mk-deep-loop-guard.js: session-scoped, iteration-aware loop-repeat detection for orchestrate-to-command-owned-loop-executor dispatches, plus resolveTargetIdentity() fixing the subagent_type=\"general\" gap in the existing mode-mismatch check. Hermetic suite extended and passing (original 8 scenarios + new identity/loop scenarios); live re-verified against the real installed opencode host with zero regression."
trigger_phrases:
  - "implementation"
  - "summary"
  - "mk-deep-loop-guard hardening implementation"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/017-loop-guard-implementation"
    last_updated_at: "2026-07-01T21:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Implementation, hermetic tests, and live re-verification complete"
    next_safe_action: "None -- packet complete"
    blockers: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-017-impl"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Both the loop-repeat-detection gap and the subagent_type=\"general\" identity-resolution gap are fixed by the same resolveTargetIdentity() change, exactly as phase 016's research anticipated."
---
# Implementation Summary: mk-deep-loop-guard Loop-Detection + Identity-Resolution Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `017-loop-guard-implementation` |
| **Completed** | 2026-07-01 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Extended `.opencode/plugins/mk-deep-loop-guard.js` (phase 011, ~109 lines) to ~250 lines, adding:

1. **`resolveTargetIdentity(subagentType, promptText)`** — resolves the real dispatch target by parsing `Deep Route: ... target_agent=@X` first, then `Agent: @X`, falling back to raw `subagentType` only when it is not the literal `"general"` placeholder. Fixes a real, previously-shipped gap: `orchestrate.md`'s dispatch convention always sets `subagent_type: "general"`, so the phase-011 mode-mismatch check's `registry.get(args.subagent_type)` silently no-op'd on every real `orchestrate`-routed dispatch — the exact path it was built to guard.
2. **Check 1 (mode-mismatch)** — unchanged detection logic, now fed the correctly-resolved identity.
3. **Check 2 (loop-repeat, new)** — session-scoped state at `.opencode/skills/.loop-guard-state/{hex(sessionID)}.json`, following `mk-goal.js`'s atomic-write pattern (temp file + `renameSync`). Counts non-command-driven dispatches to 4 command-owned loop executors (`deep-research`, `deep-review`, `deep-improvement`, `prompt-improver`); an `Iteration: N of M` / `STATE SUMMARY` marker in the prompt exempts a dispatch from counting (it indicates a parent `/deep:*` command, not `orchestrate`, owns the loop). Threshold: 1st silent, 2nd warn, 3rd+ warn (default) or block (new `MK_DEEP_LOOP_GUARD_REJECT_LOOP=1` env var, independent of the existing `MK_DEEP_LOOP_GUARD_REJECT`).

Both checks fail open independently on any internal error (unreadable registry, state-dir write failure), matching the phase-011 discipline.

### Bugs self-caught before any test run

- An erroneous `new Date(0)` placeholder timestamp in `recordLoopDispatch()` — fixed to `new Date().toISOString()`.
- A double `"mk-deep-loop-guard:"` message prefix in the loop-repeat throw path (`loopRepeatDetail()` already includes the prefix; the throw site re-wrapped it) — fixed to match Check 1's single-prefix pattern.

### Comment-hygiene violation caught and fixed

A JSDoc comment on the plugin's factory function originally referenced "phase 016 research Open Questions" — a spec-path reference forbidden by this repo's comment-hygiene HARD BLOCK rule. Rewritten to state the durable technical limitation directly: "Loop-repeat detection is session-scoped and per-target-agent; it cannot detect a cross-executor meta-loop (e.g. deep-research, deep-review, deep-research again) — only repeated hand-offs to the SAME executor." Re-ran `check-comment-hygiene.sh`: exit 0.

### Test-file bugs caught while extending the hermetic suite

- A duplicate `let warned = '';` declaration: the pre-existing "Mismatch, warn mode (default)" test block already declares this variable in the same function scope; the newly-added identity-resolution block re-declared it, causing a `SyntaxError`. Fixed by reassigning the existing variable instead of re-declaring it.
- A stale `.loop-guard-state` directory left over from earlier loop-repeat test blocks broke the fail-open fixture, which expected to `writeFileSync` a *file* at that path (to simulate a path collision) but found an existing *directory* there instead (`EISDIR`). Fixed by `rmSync`-ing the path first.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Re-read `mk-goal.js` and `orchestrate.md` directly before writing any code, rather than working from phase 016's research summary alone — confirming the exact atomic-write shape and the exact real-world dispatch format (`subagent_type: "general"` on every row, `Agent: @X` prompt-line convention) this implementation needed to match.

Implemented both checks in one pass, then worked through three layers of self-verification before calling it done:

1. **Hermetic regression first**: ran the original 8-scenario test file unmodified against the rewritten plugin — confirmed zero regression before adding a single new test.
2. **Hermetic extension**: added identity-resolution, loop-repeat-threshold, command-driven-exemption, non-loop-executor-exemption, cross-session-isolation, and fail-open scenarios. Iterated through two real bugs in the test file itself (duplicate declaration, stale fixture directory) until the full suite passed cleanly.
3. **Live re-verification**: dispatched a real Task call through the installed `opencode` v1.17.11 host (`opencode run --agent general --dangerously-skip-permissions ... --print-logs`, `MK_DEEP_LOOP_GUARD_REJECT=1`), asking the agent to invoke the Task tool with a deliberately mismatched mode declaration. The agent set `subagent_type="ai-council"` directly (a real, valid `resolveTargetIdentity()` code path — the `subagentType !== "general"` fallback branch — rather than the literal `"general"` placeholder I had asked for). The plugin correctly resolved the identity, detected the mismatch, and threw; the outer `task` tool call's status became `"error"` and the calling agent's own reply reported the block. This reconfirms, under real host conditions post-rewrite, the single most load-bearing fact established in phase 011: throwing from `tool.execute.before` genuinely blocks the dispatch. Confirmed no `.opencode/skills/.loop-guard-state/` file was created for this dispatch (correctly excluded, since `ai-council` is not in `LOOP_EXECUTOR_AGENTS`).

Did not attempt a full live 3-dispatch loop-repeat reproduction (which would require getting `@orchestrate` itself to naturally issue 3 same-executor hand-offs in one session, a much higher-cost and less controllable test than the hermetic suite's deterministic coverage of the exact same logic). This is a deliberate scope decision, not an oversight — see Key Decisions.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Fixed the `subagent_type="general"` identity gap in the same change as loop-repeat detection, rather than a separate hotfix phase | Both phase 016 research lineages already identified they require the identical prompt-text-parsing fix (`resolveTargetIdentity()`); splitting them into two phases would mean writing the same function twice or awkwardly threading a dependency between two phase folders for no benefit. |
| Skipped a full live 3-dispatch loop-repeat reproduction via a real `@orchestrate` session | The hermetic suite already exhaustively and deterministically covers every loop-repeat branch (1st/2nd/3rd, command-driven exemption, non-loop-executor exemption, cross-session isolation, fail-open) — a live reproduction would only re-confirm the host-level throw-blocks-dispatch mechanic, which was already reconfirmed by the live mode-mismatch smoke test in this same session, at a much higher real cost (2-3 full subagent invocations vs. one). |
| Did perform one live smoke test rather than relying on hermetic tests alone | The one thing hermetic tests cannot see is whether the real host's Task-tool args object matches what direct source-reading of `orchestrate.md` predicted — a live dispatch is the only way to confirm no runtime-level surprise exists between "documented convention" and "actual wire format". |
| Renamed the colliding test variable to a plain reassignment rather than renaming the whole new block's variable to something unique | Reusing the existing `warned` variable (already scoped to the whole `main()` function) is simpler and matches how the rest of the file already reuses `loopWarnDetail` across multiple test blocks — no new naming convention needed. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Original 8 hermetic scenarios (no regression) | PASS |
| New identity-resolution scenarios (Deep Route, `Agent:` line, unresolvable no-op) | PASS |
| New loop-repeat scenarios (1st/2nd/3rd, warn vs. reject, command-driven exemption, non-loop-executor exemption, cross-session isolation, fail-open) | PASS |
| `node .opencode/plugins/tests/mk-deep-loop-guard.test.cjs` | Exit 0, "all assertions passed" |
| `check-comment-hygiene.sh` (plugin + test file) | PASS, 0 violations (1 caught and fixed) |
| `verify_alignment_drift.py --root .opencode/plugins` | PASS, 0 findings, 13 files scanned |
| Live smoke: mismatch + `MK_DEEP_LOOP_GUARD_REJECT=1` against real `opencode` v1.17.11 host | PASS — `task` tool status `"error"`, agent confirmed the block, correct identity resolved via the `subagentType !== "general"` fallback branch |
| Live smoke: no stray `.loop-guard-state/` file for a non-loop-executor (`ai-council`) target | PASS — directory absent after the run |
| `bash validate.sh --strict` on this phase folder | PASS, 0 errors, 0 warnings |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live loop-repeat reproduction not performed via a real `@orchestrate` session** (see Key Decisions) — the throw-blocks-dispatch mechanism itself is reconfirmed live for the mode-mismatch check, and the loop-repeat logic is identical machinery (same hook, same throw path), but a live 3x-same-executor-hand-off sequence specifically was not reproduced against a real, uncontrolled `@orchestrate` session.
2. **Cross-executor meta-loops are not detected** (documented in the plugin's own header comment, carried over from phase 016's limitation #2) — repeated hand-offs to *different* loop executors in sequence (e.g., `deep-research`, then `deep-review`, then `deep-research` again) do not trigger Check 2, since counting is per-target-agent.
3. **`prompt-improver` still has no `mode-registry.json` entry** (phase 016 limitation #3, out of scope for this phase per `spec.md`) — Check 1 (mode-mismatch) silently no-ops for it regardless, same as before this phase; Check 2 (loop-repeat) is unaffected since it does not depend on the registry.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:followup -->
## Recommended Follow-Up

None required to close this phase. Optional future work, not blocking:
1. Design Option C from phase 016 (a prompt-shape companion guard requiring `execution=single_iteration` on Deep Route headers targeting loop executors) remains a viable complementary addition if malformed-intent-on-first-dispatch detection becomes valuable.
2. Adding a `prompt-improver` entry to `mode-registry.json` would let Check 1 cover it too — unrelated to this phase's scope, tracked here only for discoverability.
<!-- /ANCHOR:followup -->

---

## Follow-Up: Documentation-Sync Audit (2026-07-01)

Ran a targeted grep-based sweep for every file referencing `mk-deep-loop-guard`, the retired `deep-route-guard`/`DEEP_ROUTE_GUARD` names, and `tool.execute.before` across skill docs, feature catalogs, manual testing playbooks, vitest suites, and READMEs, to confirm this phase's changes are fully and correctly reflected everywhere.

**Found and fixed one real drift item**: `.opencode/plugins/README.md`'s "CURRENT ENTRYPOINTS" table still described `mk-deep-loop-guard.js` with its pre-phase-017 single-check behavior (mode-mismatch only), omitting the new loop-repeat detection and `MK_DEEP_LOOP_GUARD_REJECT_LOOP` env var. Rewrote the row to describe both checks and the shared identity-resolution step.

**Confirmed clean, no changes needed**:
- No `.vitest.ts` suite anywhere in the repo references this plugin (it correctly follows the hermetic `.test.cjs` convention used by its sibling `mk-goal-*.test.cjs` files, not vitest — there is no gap, just a different, already-correct test format for this class of plugin).
- No hardcoded test-file-list script/CI config needed a new entry (tests run standalone per the established convention; no aggregator enumerates them).
- Remaining `deep-route-guard`/`DEEP_ROUTE_GUARD` matches outside historical phase-011/014/015 spec docs are all legitimate folder-path references (`011-deep-route-guard-plugin/`), not stale content.
- `cli-opencode/SKILL.md` and `references/agent_delegation.md`'s "exactly one bounded hand-off" prose contract remains factually accurate independent of this phase's mechanical enforcement addition; left unchanged as a deliberate scope decision (adding a cross-reference there would be a documentation enhancement, not a correctness fix, and this phase's `spec.md` scoped only the plugin + its own catalog/playbook entries).
- `orchestrate.md` (both `.opencode` and `.claude` mirrors) does not reference this plugin and did not need updating — separate architectural layer.
- Deep-loop-runtime's feature-catalog and manual-testing-playbook root-index feature/scenario counts (50/52) are unaffected, since F050/DLR-052 already existed and this phase only extended, not added, entries.

Re-ran `node .opencode/plugins/tests/mk-deep-loop-guard.test.cjs` (exit 0) and `verify_alignment_drift.py --root .opencode/plugins` (PASS, 0 findings) after the README fix.
