---
title: "Implementation Summary: Relocate fully-portable runtime-hook guard cores"
description: "Four fully-portable hook cores moved out of their owning skills into .opencode/runtime-hooks/, decoupling enforcement from skill knowledge -- live smoke-tested for Pi and OpenCode, verified via config/symlink/test-suite checks for Claude/Cursor/Devin/Codex -- now gated on a forced 5-iteration deep review before merge."
trigger_phrases:
  - "hook relocation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-hook-runtime-relocation-review"
    last_updated_at: "2026-07-28T14:42:45Z"
    last_updated_by: "claude"
    recent_action: "Round-2 fan-out review failed P0=4/P1=4/P2=1; fixed all 7 findings this pass"
    next_safe_action: "Verify fixes independently, then decide merge or push or leave-local"
    blockers:
      - "3rd verification not yet run; merge decision pending."
      - "cli-pi fanout dispatch unimplemented in fanout-run.cjs; separate follow-up, not this packet's scope."
    key_files:
      - ".opencode/runtime-hooks/README.md"
      - ".opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 95
    open_questions:
      - "Merge/push/leave-local — gated on a clean 3rd verification pass."
      - "Whether/when to fix the cli-pi fanout gap — separate from this packet."
    answered_questions:
      - "Relocation scope: fully-portable set only. Worktree, not branch."
      - "Review 1 (cli-opencode, 5 iters): CONDITIONAL P0=0/P1=6/P2=4, remediated."
      - "Review 2 (fan-out glm+luna, 3 iters, restart): FAIL P0=4/P1=4/P2=1 (luna never ran, cli-pi gap); all 7 fixed+reverified this pass — see Known Limitations."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-hook-runtime-relocation-review |
| **Completed** | 2026-07-28 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Four hook enforcement cores that used to live inside the skills they guard now live in their own tree, `.opencode/runtime-hooks/`, organized by concern instead of by owning skill. That means an operator can adopt a skill's guidance without automatically inheriting its enforcement hooks, or vice versa — the two were previously entangled in a single directory.

### `.opencode/runtime-hooks/` tree

Four concern folders — `dispatch/`, `mcp-route-guard/`, `post-edit-quality/`, `task-dispatch/` — each with a `lib/` holding the portable core plus its co-located tests, and one subfolder per runtime that still needs a real adapter file. Pi and OpenCode adapters stay physically in `.pi/extensions/` and `.opencode/plugins/` (both runtimes auto-discover from those fixed locations); only their import paths changed.

### Zero-regression wiring fixes

Two separate grep sweeps were needed: an import-statement grep found direct `require`/`import` consumers, but a second, dedicated hardcoded-path-string grep found 5 more consumers invisible to the first — Cursor adapters that `spawnSync` Claude's adapter by a hardcoded constant, `system-spec-kit/mcp-server/hooks/cursor/post-tool-use.mjs`'s two similar constants, and a concurrent session's brand-new `.pi/extensions/git-preflight-advisory.ts`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/runtime-hooks/**` | Created | New tree hosting the 4 relocated guard-core families + README. |
| 4 runtime skill trees (cli-external-orchestration, mcp-tooling, sk-code, system-deep-loop) | Modified (`git mv`) | Guard cores/adapters removed from their prior owning skill location. |
| `.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.codex/hooks.json` | Modified | Command-string paths repointed. |
| 4 runtime hook mirror dirs | Modified | Discovery symlinks re-pointed. |
| `.pi/extensions/*.ts`, `.opencode/plugins/mk-*.js` | Modified | Import/require paths updated in place. |
| 5 test files | Modified | Stale relative-path constants corrected. |
| ~20 documentation files | Modified | Path references and cross-links updated. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built in an isolated worktree (`.worktrees/0118-skilled-hook-runtime-relocation`, branch `skilled/0118-hook-runtime-relocation`) per the git-workspace-safety rule, on an operator-approved plan. Every relocated core was classified by tracing its real import graph, not by assumption. Verified with `git mv` for history preservation, per-suite test re-runs, live smoke tests of Pi and OpenCode, and `validate_document.py` on every touched doc. Committed as a single relocation commit, `40d5f0d2b3`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Relocate only the fully-portable set (dispatch, mcp-route-guard, post-edit-quality, task-dispatch) | Spec-gate, session-lifecycle, the skill-advisor brief, and git-preflight-advisory each genuinely depend on their owning skill's own engine — moving them would either drag the skill along or leave a hollow shell. |
| New tree name `.opencode/runtime-hooks/`, not `.opencode/hooks/` | `.opencode/hooks/` was already claimed by the git commit-hooks folder; reusing it would collide with an unrelated existing concern. |
| Leave Pi and OpenCode adapter files in place, only fix their import paths | Both runtimes auto-discover adapters from fixed directories (`.pi/extensions/`, `.opencode/plugins/`) — moving the files would break discovery, not fix anything. |
| Run a dedicated hardcoded-path-string grep in addition to the import-statement grep | The first grep alone missed 5 real consumers (cross-adapter `spawnSync` constants, a concurrent session's new file), proving import-only greps are an insufficient sweep for this kind of move. |
| Author a retroactive spec-kit packet for work already done via Claude plan-mode | This relocation had no prior spec folder; the operator asked for a forced 5-iteration deep review, which needs a `spec_folder` to bind to. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `dispatch-rule-checks.test.mjs` | PASS, 6/6 |
| `mcp-route-guard.test.cjs` | PASS, 1/1 |
| `mk-post-edit-quality.test.cjs` + `mk-deep-loop-guard.test.cjs` + `claude-task-dispatch-guard.test.cjs` | PASS, 40/40 combined |
| `test-root-name-consumer-matrix.cjs` | PASS, 17/17 |
| `dispatch-audit.test.mjs` | PASS, 38/38 via its own documented `npx vitest run` runner (an initial `node --test` invocation was the wrong runner and produced a false-alarm failure) |
| Documentation (`validate_document.py`) | PASS, 0 issues on all touched/new files |
| `mcp-code-mode` `parent-skill-check.cjs` | Pre-existing failure confirmed unrelated (identical result against the unmodified main tree) |
| Live smoke tests (Pi, OpenCode) | PASS, both runtimes load affected extensions/plugins with zero errors |
| Claude, Cursor, Devin, Codex runtime verification | Verified via config/symlink resolution checks plus each runtime's own test suites (`claude-task-dispatch-guard.test.cjs`, `mcp-route-guard.test.cjs`, etc.) — NOT live-smoke-tested post-move. This is the narrowed, accurate claim per `spec.md` REQ-002/NFR-R01; "verified across 6 runtimes" (this doc's earlier wording) overstated it. |
| This packet's own `validate.sh --strict` | PASS, Errors 0 / Warnings 0 (re-run after the Phase 6 fixes, description/graph-metadata regeneration, and a continuity-freshness timestamp refresh) |
| 5-iteration forced `/deep:review:auto` (`cli-opencode`, `gpt-5.6-sol`, `high`, `stop_policy=max-iterations`) — round 1 | CONDITIONAL, P0=0 P1=6 P2=4. Session archived at `review/review-archive/20260728T161859/` after round 2's `lineage_mode=restart`. |
| Phase 6 P1 remediation (round 1) | 3 pre-existing code bugs fixed (Codex multi-file coverage, dispatch-guard forgery hardening, credential-redaction gap) + 2 doc/evidence gaps fixed + 1 architecture-boundary item addressed (system-spec-kit dependency removed via new `runtime-hooks/shared/hook-adapter-shared.cjs`). |
| Fan-out re-review — round 2 (`cli-devin`/`glm-5-2` + `cli-pi`/`gpt-5.6-luna`, 3 iters each, `stop_policy=max-iterations`, `lineage_mode=restart`) | FAIL, P0=4 P1=4 P2=1, all from the `glm` lineage. `luna` lineage never dispatched (pre-existing `fanout-run.cjs` gap, see Known Limitations). See `review/review-report.md` and `review/lineages/glm/review-report.md`. |
| Round-2 remediation (this pass, done directly rather than via another full plan/implement cycle given the small mechanical scope) | 4 P0 broken imports fixed in `system-spec-kit`/`sk-git` (`permission-request-policy.mjs`, `git-preflight-advisory.mjs`, `advisory-noise-audit.mjs`, `git-rule-checks.test.mjs`) — all still pointed at the pre-relocation `dispatch-rule-checks.mjs` path, surviving the relocation, round-1 review, AND round-1 remediation. Plus 3 P1 stale-doc-reference fixes (`cli-codex/references/hook-contract.md`, `deep-alignment/references/adapters/sk-doc-known-deviations.md`, `.loop-guard-state/README.md`) and this packet's own CHK-011/CHK-041 evidence rows corrected again. Independently re-verified: module resolution succeeds on all 3 previously-broken `.mjs` files, `node --test` 23/23 + 2/2 on their suites, and a genuine unscoped repo-wide grep for every old relocated-core path string now returns zero hits outside archival specs/benchmark history. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Worktree tsx runtime gap, resolved.** `node_modules/.bin/tsx` was missing earlier in this session; it now resolves inside `system-spec-kit/scripts/`, and `EVIDENCE_MARKER_LINT`/`GENERATED_METADATA_INTEGRITY`/`GENERATED_METADATA_DRIFT` all run for real now (no longer a tooling-only failure).
2. **Two remediation rounds so far; a third verification pass is the next safe action.** Round 1 (CONDITIONAL, P0=0/P1=6/P2=4) was fixed and re-verified, but the re-review (round 2, fan-out) found the round-1 sweep still wasn't genuinely repo-wide — 4 more P0 broken imports and 3 more stale doc references had survived in `system-spec-kit`/`sk-git`, outside every prior sweep's scope. Those are now fixed too (this pass), but given the pattern of two consecutive "fixed and verified" claims each missing real issues, a third independent check (full re-review, or at minimum a fresh unscoped repo-wide grep) is warranted before trusting a clean state.
3. **`cli-pi` fan-out dispatch is unimplemented, unrelated to this packet.** `buildPiLineageCommand()` in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (~line 1830) is a deliberate stub that throws `'cli-pi command construction is unavailable until its headless invocation contract is confirmed'`. The round-2 re-review's `luna` lineage never executed because of this — a genuine, pre-existing gap in the shared deep-loop runtime, not a configuration mistake in this session's dispatch. No flag or model choice would have fixed it. This needs its own decision/fix outside this packet's scope.
4. **Merge decision deferred.** Whether to merge into `skilled/v4.0.0.0`, push the branch only, or leave it local remains open pending a clean re-review, per explicit operator instruction.
5. **Claude/Cursor/Devin/Codex are not live-smoke-tested post-move.** Only Pi and OpenCode received a real post-move live session check. The other 4 runtimes' correctness rests on config/symlink resolution plus their own test suites — a real but narrower form of evidence than a live post-move smoke test. Producing genuine live evidence for all 4 (rather than just narrowing this claim, which is what shipped) remains a legitimate future improvement, not a blocker.
<!-- /ANCHOR:limitations -->
