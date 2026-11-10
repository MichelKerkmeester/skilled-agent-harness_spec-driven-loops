---
title: "Implementation Summary: Phase 8: routing-and-release-alignment"
description: "A read-only question about the trigger index routes to system-spec-kit, the retrieval lane lost its unused code, and release v4.0.2.1 describes the retrieval work."
trigger_phrases:
  - "routing and release alignment implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/retrieval-integrations/001-sweet-search-integration/008-routing-and-release-alignment"
    last_updated_at: "2026-11-10T10:05:00Z"
    last_updated_by: "conductor"
    recent_action: "Built, gated and closed"
    next_safe_action: "None, the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-routing-and-release-alignment"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata
<!-- FILL: Fill the folder name, the completion date and the level. Use the real date. GOOD: `004-rotate-logs-keep`. Completed 2026-10-24. Level 1. WEAK: Folder: TBD. -->

| Field | Value |
|-------|-------|
| **Spec Folder** | 008-routing-and-release-alignment |
| **Completed** | 2026-11-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Ask the advisor to explain what the trigger index omits and it now names `system-spec-kit`, where it used to name the doctor helper. Six of the seven stored probes route to their expected skill, up from four, and release v4.0.2.1 describes what a lookup returns.

### Phase 8: routing-and-release-alignment

The explainer floor holds every skill at 0.25 on a read-only question unless a gate lets one through. No gate covered the trigger index, so the doctor hand-off claimed the prompt on its noun. `readOnlyRouteAllowed` now lets `system-spec-kit` through when a read-only prompt names the trigger index and does not say drift. A drift question still goes to the doctor.

A review agent read the retrieval code of phases 4 to 7 against the overengineering rule. It found no P0 or P1 and ten P2 items. Each was checked in the source, and the ones that held were applied: one sort that ordered an already ordered list, three exports nothing imported, one type check the caller made redundant, a read count that included files it had not read, a missing rejection handler and four tests that repeated another test.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` | Modified | Read-only lift for a prompt that names the trigger index |
| `.skilled/skills/system-skill-advisor/runtime/tests/scorer/route-gates.vitest.ts` | Modified | Four cases: the lift, another skill stays gated, drift stays at the floor, no index noun stays at the floor |
| `.skilled/skills/system-spec-kit/graph-metadata.json` | Modified | `trigger index`, `trigger phrase`, `unindexed spec` added; duplicate `spec docs` removed |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Recompiled from the metadata |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lib/unindexed-docs.mjs` | Modified | One export left, no second sort, `staleFallback.files` counts the docs it read |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/lookup-trigger-index.mjs` | Modified | A rejected `main()` prints one line to stderr and exits 2 |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/stale-fallback.vitest.ts`, `rg-wrapper-recipes.vitest.ts` | Modified | Four redundant tests removed |
| `.skilled/changelog/skilled/v4.0.2.1.md` | Created | The retrieval work as its own release: five glance bullets |
| `PUBLIC-RELEASE.md` | Modified | The current release is v4.0.2.1 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/rg-wrapper.mjs` | Modified | `path` and `count` sort their lists, cut at `--limit` and fill `fileCount`, `limit`, `hidden` and `truncated`; `schemaVersion` 3 |
| `.skilled/skills/system-spec-kit/runtime/cli/ops/retrofit-convention.mjs` | Modified | The baseline reads `fileCount` for the two recipes, so the cut leaves its numbers alone |
| `runtime/cli/tests/rg-wrapper-recipes.vitest.ts` | Modified | Two cases: a cut at 5 of 30 files, and a zero limit with the busiest file first |
| `retrieval-conventions.md`, two retrieval READMEs, `rg-flood-control.md` catalog and playbook, `search-presentation.txt`, command `README.txt`, `changelog/v2.12.48.0.md` | Modified, Created | The limit on all three recipes, schema version 3, release 2.12.48.0 |
| `system-spec-kit` `SKILL.md`, `changelog/v2.12.47.0.md` | Modified, Created | Version 2.12.47.0 and its entry |
| `system-skill-advisor` `SKILL.md`, `changelog/v0.18.6.0.md` | Modified, Created | Version 0.18.6.0 and its entry |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

In worktree 337, cut from `origin/main` after phase 7 landed. The conductor reran the seven stored probes on the unchanged tree, added the intent signals, and found two read-only probes still at the floor. It traced those to `readOnlyRouteAllowed`, added the lift and its tests, rebuilt the advisor and reran the probes. A review agent on Opus then read the retrieval code. The conductor checked each finding in the source, applied the trims, and ran both suites, the changelog shape check, the alignment battery and strict validation.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Lift in the scorer, not more phrases | The two failing probes are read-only questions, and the floor caps every skill at 0.25 whatever its phrases score. Only a gate moves them |
| The lift skips a prompt that says `drift` | "Explain trigger index drift and repair it" belongs to the doctor, which owns the repair. The route for it is the same as on `main` |
| Keep the `maxFiles` and `cwd` options | Only tests pass them. Without `maxFiles` the cap test needs 501 real files, and without `cwd` the tests must `chdir` |
| Keep the wrapper's `truncated` field | The trigger lookup uses the same name, and three tests read it. `hidden` says how much, `truncated` says whether |
| Keep the four `totalCandidates` tests | Each fails for a different reason: no limit, a limit below the pool, the search mode and the no-hit payload |
| Leave probe P02 of phase 6 as a tie | Same reason as phase 7: it asks for a code edit and `sk-code` is a correct answer |
| Bump the wrapper schema to 3 | `paths` and `counts` used to hold every file and now hold the files inside the limit. A reader of the old shape must be able to tell |
| Keep the limit fix out of the v4.0.2.1 release entry | The tag points at the commit before the fix, and moving a published tag needs the operator's word. The fix is in `v2.12.48.0.md` and rides the next release |
| Put test results in the release entry | The changelog template leaves test counts out. The operator asked for the testing done, so the entry carries them and the voice scan's one warning stands |
| Release the work as v4.0.2.1 with its own tag | The operator first asked for the work in changelog 4.0.2.0 with the tag republished, then replaced that with a new v4.0.2.1 entry and a dedicated tag. The v4.0.2.0 entry is back to its tagged text and its tag never moved |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Seven stored probes, before | 4 pass. Phase 4 P01 and P02 and phase 5 P01 name `command-doctor-helper` 0.8 first; phase 6 P02 ties |
| Seven stored probes, after | 6 pass. Phase 4 P01 `system-spec-kit` 0.82, P02 0.85; phase 5 P01 0.914, P02 0.873; phase 6 P01 0.892; phase 4 P03 `sk-code` 0.849; phase 6 P02 ties at 0.82 |
| "Explain trigger index drift and repair it" | `command-doctor-helper` 0.8, same as `main` |
| `skill-graph-freshness.cjs --strict` | `SIGNAL DRIFT compiled vs disk: none`, exit 0 |
| `npx vitest run tests/scorer/route-gates.vitest.ts` | `Tests  19 passed (19)` |
| Advisor suite | 161 files passed, 1387 passed, 8 skipped, 0 failed, exit 0. Four more tests than phase 7 |
| `system-spec-kit` suite after the trims | 299 files passed, 3 skipped; 4511 passed, 21 skipped, 0 failed, exit 0. Two earlier runs hit the runner's 10-minute bound on a loaded machine with no failed test, so this run set `SPECKIT_TEST_RUN_TIMEOUT_MS=2700000` and took 29 minutes |
| Zero-hit lookup time, index only and with the fallback | 89 to 102 ms, and 155 to 176 ms reading 156 docs |
| `check-comment-hygiene.sh` on the touched code | exit 0 |
| `check_changelog_shape.py` on the three entries | `PASS` each; the release entry is inside its 240-line and 26-item limits |
| Alignment battery over the change | `pass=55 fail=0 cannot_run=1 not_applicable=7` over 24 files. The one check that could not start, `S1-package-check`, needs a `node_modules` folder the worktree lacks; `npm --prefix .skilled/skills/system-spec-kit/runtime/cli run check` run by hand exits 0 |
| `validate.sh --strict --recursive` on the packet | 9 folders, each `RESULT: PASSED` |
| Wrapper tests after the limit fix | `rg-wrapper-recipes.vitest.ts`: `Tests  27 passed (27)` |
| `path` and `count` by hand, 4 files, `--limit 2` | `paths   : 4`, two paths, `+2 more files`; `counts  : 10 across 4 path(s)`, the two busiest files, `+2 more files with 3 matches` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Probe P02 of phase 6 still ties.** A prompt that mixes a code edit with spec search can route to `sk-code`. Name the skill in the prompt when the route matters.
2. **A running advisor keeps the old scorer.** Run `npm run build` in `system-skill-advisor/runtime`, then `skill_graph_scan --trusted` and `advisor_rebuild --trusted --force true` after pulling this change.
3. **`/speckit:search --paths` and `--count` run ripgrep directly.** The wrapper's limit reaches them only when a caller runs the wrapper's `path` or `count` recipe.
4. **The lift keys on the words "trigger index".** A read-only question that calls it "the index" stays at the floor and gets no skill above 0.25.
<!-- /ANCHOR:limitations -->

---


