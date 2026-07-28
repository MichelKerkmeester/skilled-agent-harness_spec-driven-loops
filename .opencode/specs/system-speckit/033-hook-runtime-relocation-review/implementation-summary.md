---
title: "Implementation Summary: Relocate fully-portable runtime-hook guard cores"
description: "Four fully-portable hook cores moved out of their owning skills into .opencode/runtime-hooks/, decoupling enforcement from skill knowledge, verified across 6 runtimes, now gated on a forced 5-iteration deep review before merge."
trigger_phrases:
  - "hook relocation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-hook-runtime-relocation-review"
    last_updated_at: "2026-07-28T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Retroactive packet authored; about to dispatch /deep:review:auto with fully bound setup"
    next_safe_action: "Load .opencode/commands/deep/assets/deep-review-auto.yaml with the resolved PRE-BOUND SETUP ANSWERS block"
    blockers: []
    key_files:
      - ".opencode/runtime-hooks/README.md"
      - ".opencode/skills/system-spec-kit/references/hooks/injection-contract.md"
      - ".opencode/specs/system-speckit/033-hook-runtime-relocation-review/checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "hook-runtime-relocation-review-20260728"
      parent_session_id: null
    completion_pct: 90
    open_questions:
      - "Merge into skilled/v4.0.0.0 now, push branch only, or leave local — gated on deep-review outcome."
    answered_questions:
      - "Relocation scope: fully-portable set only (dispatch, mcp-route-guard, post-edit-quality, task-dispatch)."
      - "Worktree vs branch: isolated worktree."
      - "Deep-review setup: new packet, force all 5 iterations regardless of early convergence."
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
| This packet's own `validate.sh --strict` | FAIL on `EVIDENCE_MARKER_LINT`/`GENERATED_METADATA_INTEGRITY`/`GENERATED_METADATA_DRIFT` — the worktree's `node_modules/.bin/tsx` is missing, a worktree-environment gap, not a content defect. Re-run from the main tree (or after `npm install` in the worktree) before final closeout. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Worktree tsx runtime gap.** `validate.sh --strict` cannot complete `EVIDENCE_MARKER_LINT`, `GENERATED_METADATA_INTEGRITY`, or `GENERATED_METADATA_DRIFT` inside this worktree because `node_modules/.bin/tsx` was never installed there. Re-run these three checks from the main tree, or install dependencies in the worktree, before the final pre-merge validation pass.
2. **Deep review not yet run.** The forced 5-iteration `/deep:review:auto` (executor `cli-opencode`, model `gpt-5.6-sol`, reasoning `high`, `stop_policy=max-iterations`) has not started as of this summary; findings from that review may require follow-up fixes before merge.
3. **Merge decision deferred.** Whether to merge into `skilled/v4.0.0.0`, push the branch only, or leave it local is intentionally left open pending the review outcome, per explicit operator instruction.
<!-- /ANCHOR:limitations -->
