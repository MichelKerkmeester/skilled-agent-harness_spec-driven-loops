---
title: "Implementation Summary: Relocate + consolidate fully-portable hook guard cores into .opencode/hooks/"
description: "Four fully-portable hook cores moved out of their owning skills, then the git commit-hooks folder folded in and the whole tree renamed to .opencode/hooks/ -- decoupling enforcement from skill knowledge under one unified root, gated on two forced deep-review rounds."
trigger_phrases:
  - "hook relocation summary"
  - "hooks tree consolidation"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-hook-runtime-relocation-review"
    last_updated_at: "2026-07-28T17:45:00Z"
    last_updated_by: "claude"
    recent_action: "Phase 7 hooks-tree consolidation complete, verified this pass"
    next_safe_action: "Await merge/push/leave-local decision from operator"
    blockers:
      - "Merge/push/leave-local decision still pending, operator call."
      - "cli-pi fanout dispatch unimplemented in fanout-run.cjs; separate follow-up, not this packet's scope."
    key_files:
      - ".opencode/hooks/README.md"
      - ".opencode/scripts/git-hooks/pre-commit"
      - ".opencode/specs/system-speckit/033-hook-runtime-relocation-review/review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 98
    open_questions:
      - "Merge/push/leave-local, now including Phase 7."
      - "Whether/when to fix the cli-pi fanout gap — separate from this packet."
    answered_questions:
      - "Relocation scope: fully-portable set only. Worktree, not branch, each phase."
      - "Review 1 (cli-opencode, 5 iters): CONDITIONAL P0=0/P1=6/P2=4, remediated."
      - "Review 2 (fan-out glm+luna, 3 iters, restart): FAIL P0=4/P1=4/P2=1 (luna never ran, cli-pi gap); all 7 fixed+reverified."
      - "Operator: trust direct verification over a 3rd full review round; proceed to hooks-tree consolidation, then merge decision."
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

### Phase 7: hooks-tree consolidation

The operator later revisited the naming-collision decision below and asked for the opposite: fold the git commit-hooks folder into this tree as `git/`, then rename the whole tree from `runtime-hooks` to `hooks`. Doing this surfaced a dependency invisible from either folder's own contents: the repo's real, installed `.git/hooks/pre-commit` is a different, richer script (`.opencode/scripts/git-hooks/pre-commit`) that chain-calls the folded-in `git/pre-commit` by hardcoded path as its comment-hygiene sub-gate. Missing that one-line fix would have silently disabled comment-hygiene and agent-mirror-sync enforcement repo-wide — no error, just a guard that quietly stopped firing. Found only because the actual installed `.git/hooks/pre-commit` symlink was checked directly rather than trusting the folder's own README description of itself.

The same reference cascade from the original relocation repeated at the new name (`runtime-hooks` → `hooks`): 4 runtime configs, 17 discovery symlinks, Pi/OpenCode imports, cross-adapter spawn constants, and 35 docs. A second sweep beyond the mechanical substitution also caught 2 stale references that had survived every single prior pass (the original relocation, both review rounds, both remediation rounds) — `task-dispatch-guard.cjs`/`.mjs` old-path citations in `.loop-guard-state/README.md` and a Cursor manual-testing-playbook file, missed because none of those prior sweeps scoped a true repo-wide grep for those two specific files' old paths.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/hooks/**` | Created/renamed | Unified tree: the 4 relocated guard-core families + `shared/` + README, plus `git/` (the folded-in commit-hooks installer). |
| 4 runtime skill trees (cli-external-orchestration, mcp-tooling, sk-code, system-deep-loop) | Modified (`git mv`) | Guard cores/adapters removed from their prior owning skill location. |
| `.claude/settings.json`, `.cursor/hooks.json`, `.devin/hooks.v1.json`, `.codex/hooks.json` | Modified | Command-string paths repointed (twice: once to `runtime-hooks/`, once to `hooks/`). |
| 4 runtime hook mirror dirs | Modified | Discovery symlinks re-pointed (17 total). |
| `.pi/extensions/*.ts`, `.opencode/plugins/mk-*.js` | Modified | Import/require paths updated in place. |
| `.opencode/scripts/git-hooks/pre-commit` | Modified | `HYGIENE_HOOK` chain-call path fixed to the folded-in `git/pre-commit`. |
| 5 test files | Modified | Stale relative-path constants corrected. |
| 35 documentation files | Modified | Path references and cross-links updated across both renames. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built in an isolated worktree (`.worktrees/0118-skilled-hook-runtime-relocation`, branch `skilled/0118-hook-runtime-relocation`) per the git-workspace-safety rule, on an operator-approved plan. Every relocated core was classified by tracing its real import graph, not by assumption. Verified with `git mv` for history preservation, per-suite test re-runs, live smoke tests of Pi and OpenCode, and `validate_document.py` on every touched doc. Committed as a single relocation commit, `40d5f0d2b3`.

Phase 7 (the hooks-tree consolidation) was built the same way in a fresh isolated worktree (`.worktrees/0120-skilled-unify-hooks-tree`, branch `skilled/0120-unify-hooks-tree`, from `skilled/v4.0.0.0` after Phases 1-6 had already merged), again on an operator-approved plan produced via a full plan-mode research pass rather than assumed. The live git-hooks dependency was discovered by reading the actual installed `.git/hooks/pre-commit` symlink target directly, not by trusting either folder's own documentation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Relocate only the fully-portable set (dispatch, mcp-route-guard, post-edit-quality, task-dispatch) | Spec-gate, session-lifecycle, the skill-advisor brief, and git-preflight-advisory each genuinely depend on their owning skill's own engine — moving them would either drag the skill along or leave a hollow shell. |
| New tree name `.opencode/runtime-hooks/`, not `.opencode/hooks/` (initial pass) | `.opencode/hooks/` was already claimed by the git commit-hooks folder; reusing it would collide with an unrelated existing concern. **Superseded in Phase 7**: the operator asked to fold the git-hooks folder in as `git/` and take over the `.opencode/hooks/` name after all, rather than avoid the collision. |
| Leave Pi and OpenCode adapter files in place, only fix their import paths | Both runtimes auto-discover adapters from fixed directories (`.pi/extensions/`, `.opencode/plugins/`) — moving the files would break discovery, not fix anything. |
| Run a dedicated hardcoded-path-string grep in addition to the import-statement grep | The first grep alone missed 5 real consumers (cross-adapter `spawnSync` constants, a concurrent session's new file), proving import-only greps are an insufficient sweep for this kind of move. |
| Author a retroactive spec-kit packet for work already done via Claude plan-mode | This relocation had no prior spec folder; the operator asked for a forced 5-iteration deep review, which needs a `spec_folder` to bind to. |
| Fold `git/` in rather than leave the two trees separate (Phase 7) | The operator's actual goal was one unified root for every hook concept, not just avoiding a name collision — folding resolves the collision AND achieves that unification. |
| Verify the git-hooks chain via direct script invocation, not a native git-commit trigger | A shared, pre-existing `core.hooksPath` override to a `.no-hooks` sentinel in the common `.git/config` disables native hooks for this session across every worktree; changing it could affect concurrent sessions, so the script's own logic was verified directly instead and the gap disclosed rather than assumed passing. |
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
| Phase 7 hooks-tree consolidation | `.opencode/hooks/` + `.opencode/runtime-hooks/` folded into one `.opencode/hooks/` tree (`git/` subfolder + 4 concern folders + `shared/`). Live `.git/hooks/pre-commit` chain-call to the moved hygiene gate fixed and verified via direct script invocation. 2 more stale references found by a second sweep (predating this session entirely — missed by every prior pass). |
| Post-consolidation test re-run | 73/74 real `node --test` passes (1 pre-existing "dist not built in fresh worktree" gap on `spec-gate-core.mjs`, confirmed unrelated) + 40/40 `vitest`. `validate_document.py`: 0 issues on all 35 touched docs. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Worktree tsx runtime gap, resolved.** `node_modules/.bin/tsx` was missing earlier in this session; it now resolves inside `system-spec-kit/scripts/`, and `EVIDENCE_MARKER_LINT`/`GENERATED_METADATA_INTEGRITY`/`GENERATED_METADATA_DRIFT` all run for real now (no longer a tooling-only failure).
2. **Two remediation rounds closed; a third full review was explicitly declined by the operator.** Round 1 (CONDITIONAL, P0=0/P1=6/P2=4) was fixed and re-verified, but the re-review (round 2, fan-out) found the round-1 sweep still wasn't genuinely repo-wide — 4 more P0 broken imports and 3 more stale doc references had survived in `system-spec-kit`/`sk-git`, outside every prior sweep's scope. Those were fixed and independently re-verified (real repo-wide grep, direct module-resolution checks, test re-runs — not just re-trusting the same claim). Given that evidence, the operator chose to trust this round's direct verification over spending another full review cycle. Phase 7 then found 2 *more* stale references missed by every prior pass (see Phase 7 note below) — those are also fixed and independently re-verified, but the pattern is worth naming plainly: repeated "fixed and verified" claims on this packet have twice understated their own completeness on first pass.
3. **`cli-pi` fan-out dispatch is unimplemented, unrelated to this packet.** `buildPiLineageCommand()` in `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (~line 1830) is a deliberate stub that throws `'cli-pi command construction is unavailable until its headless invocation contract is confirmed'`. The round-2 re-review's `luna` lineage never executed because of this — a genuine, pre-existing gap in the shared deep-loop runtime, not a configuration mistake in this session's dispatch. No flag or model choice would have fixed it. This needs its own decision/fix outside this packet's scope.
4. **Merge decision deferred.** Whether to merge into `skilled/v4.0.0.0`, push the branch only, or leave it local remains open, now covering Phase 7 as well as Phases 1-6.
5. **Claude/Cursor/Devin/Codex are not live-smoke-tested post-move.** Only Pi and OpenCode received a real post-move live session check. The other 4 runtimes' correctness rests on config/symlink resolution plus their own test suites — a real but narrower form of evidence than a live post-move smoke test. Producing genuine live evidence for all 4 (rather than just narrowing this claim, which is what shipped) remains a legitimate future improvement, not a blocker.
6. **Phase 7's git-hooks discovery: `.opencode/hooks/pre-commit` was never standalone.** It's chain-called by the actual installed `.git/hooks/pre-commit` (`.opencode/scripts/git-hooks/pre-commit`) as its comment-hygiene sub-gate. This was invisible from either folder's own README and was found only by reading the real installed symlink target directly. Fixed and verified via direct script invocation (staged violation blocked, clean file passed).
7. **The native git-commit hook trigger itself is untestable in this session.** A shared `core.hooksPath` override to a `.no-hooks` sentinel, set in the repo's common `.git/config` (affects every worktree, confirmed pre-existing and not caused by this work), disables native git hooks entirely for this session. The hook *script's own logic* was verified directly (bypassing git's own invocation), which proves the code path is correct but does not prove git itself would call it — that would need testing outside this automated session, or once the shared override is no longer active.
8. **`.opencode/hooks/git/install-hooks.sh` remains a competing, lesser installer.** It targets the same `.git/hooks/pre-commit` symlink slot as the primary `.opencode/scripts/install-git-hooks.sh`, but installs a strictly worse hook (missing the doc-model-refs/card-sync/mutation-class/tool-ownership gates) if run directly. This is a pre-existing landmine, not introduced by this move; scope for this pass was limited to a path fix + a clarifying comment, not a redesign of the two-installer situation.
<!-- /ANCHOR:limitations -->
