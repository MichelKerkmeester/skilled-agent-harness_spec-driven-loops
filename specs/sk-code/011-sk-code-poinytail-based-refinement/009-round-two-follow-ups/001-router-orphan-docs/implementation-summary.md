---
title: "Implementation Summary"
description: "Router check 1b now runs in a bare guard run and in the drift-guard umbrella and passes, because six Obsidian references are routed under existing intents, three shared workflow docs are allowlisted by exact path and a new node test proves the check still fails on a stray doc."
trigger_phrases:
  - "router orphan docs implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/011-sk-code-poinytail-based-refinement/009-round-two-follow-ups/001-router-orphan-docs"
    last_updated_at: "2026-10-10T09:50:00Z"
    last_updated_by: "build-agent"
    recent_action: "Made router check 1b a default leg and routed the six Obsidian references"
    next_safe_action: "Orchestrator runs sync-skills-hermes.cjs in write mode, then reruns the goal criteria"
    blockers: []
    key_files:
      - ".skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs"
      - ".skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs"
      - ".skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh"
      - ".skilled/skills/sk-code/sk-code-obsidian/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-router-orphan-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 001-router-orphan-docs |
| **Completed** | 2026-10-10 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A doc that no router names now fails the same gate that checks router paths. Before this change `verify_router_sync.cjs --checks 1b` listed nine orphan docs, so the leg was held back and a tenth unrouted doc passed every gate. After it, a bare guard run covers five legs and the drift-guard umbrella runs all five.

### Phase 1: router-orphan-docs

The guard clears the nine orphans in two ways. The three canonical `shared/references/workflow-*.md` docs are allowlisted by exact path in `NON_ROUTED_ALLOWLIST`, with a comment above the set that gives the reason: the hub `SKILL.md` tells the acting agent to read the doctrine from the active surface's symlinked copy, so no router names the canonical path or the symlink. The six Obsidian references are routed under existing intents in `sk-code-obsidian/SKILL.md` section 2b: `accessibility.md` and `theme-variables.md` under `STACK_STANDARDS`, `setup/setup.md`, `operations/operations.md` and `skill-reference-integrity.md` under `VERIFICATION`, and `quality/doc-quality-gate.md` under `CODE_QUALITY`. Seven keywords taken from the titles of those docs were added (`dqi`, `plugin setup`, `install the plugin`, `settings migration`, `reference integrity`, `accessibility`, `theme variable`) and no intent key was created.

With the nine cleared, `OPT_IN_LEGS` and the filter that used it are gone, `run-all-drift-guards.sh` passes `--checks 1a,1b,2,3,4`, and a new `node:test` file builds a throwaway hub under the OS temp directory and runs a copy of the guard there. It proves three things: a symlinked workflow doc is not reported, a stray `shared/references/stray.md` and a stray packet doc are both still reported, and a run without `--checks` includes leg 1b.

The Obsidian playbook root, the OB-H06 scenario and the OB-019 scenario called these docs unmapped or unwired. Those lines now say the docs are routed. `OB-H06` stays keyword-blind (no word from its prompt became a keyword) and its `expected_intent` changed from `UNMAPPED` to `STACK_STANDARDS`. Every doc that called leg 1b opt-in or not run was rewritten, and the OpenCode and Obsidian packets moved to 1.1.1.0 and 0.1.2.0 with one changelog entry each.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_router_sync.cjs` | Modified | Three exact-path allowlist entries with the reason beside the set, `OPT_IN_LEGS` and its filter removed |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/tests/verify_router_sync.test.cjs` | Created | Three-case `node:test` file run against a throwaway hub (the `scripts/tests/` folder is new) |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/run-all-drift-guards.sh` | Modified | Passes `--checks 1a,1b,2,3,4`, header line and the note under the call rewritten |
| `.skilled/skills/sk-code/sk-code-opencode/scripts/README.md` | Modified | Overview sentence, umbrella table row and one row for the new test |
| `.skilled/skills/sk-code/sk-code-opencode/SKILL.md` | Modified | Pointer comment, wrapper description, leg 1b sentence, version 1.1.0.0 to 1.1.1.0 |
| `.skilled/skills/sk-code/sk-code-opencode/references/shared/alignment-verification-automation.md` | Modified | Table row, gap note and entry-point line |
| `.skilled/skills/sk-code/sk-code-opencode/changelog/v1.1.1.0.md` | Created | Changelog entry for 1.1.1.0 |
| `.skilled/skills/sk-code/benchmark/README.md` | Modified | Successor note now says every check is wired |
| `.skilled/skills/sk-code/sk-code-obsidian/SKILL.md` | Modified | Seven keywords, six `RESOURCE_MAP` entries, version 0.1.1.0 to 0.1.2.0 |
| `.skilled/skills/sk-code/sk-code-obsidian/changelog/v0.1.2.0.md` | Created | Changelog entry for 0.1.2.0 |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/manual-testing-playbook.md` | Modified | Category rows, OB-019 and OB-H06 summary lines, holdout note and the honesty paragraph |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/holdout/accessibility-independent.md` | Modified | OB-H06 scenario: expected intent, overview, contract, commands and anchors |
| `.skilled/skills/sk-code/sk-code-obsidian/manual-testing-playbook/token-cost-baseline/ceiling-load-all.md` | Modified | OB-019 scenario: three sentences that called `accessibility.md` unwired |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-code/manifest.json` | Unchanged | `compiled-route-guard.cjs` listed sk-code `fresh` after the edits, so no re-mint ran |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/sk-code/manifest.json` | Unchanged | Same reason, nothing to copy |
| `.skilled/skills/sk-code/leaf-manifest.json` | Unchanged | `generate-leaf-manifest.cjs --check` printed `OK` with the same digest, so no regeneration ran |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The build captured every baseline first (guard, umbrella, compiled guard, leaf manifest, playbook validator, voice scan and a 27-scenario routing replay), then wrote the test and ran it against the unedited guard. It failed 3 of 3 for the intended reasons: the two symlink and stray cases reported `workflow-debug.md`, and the bare run printed no leg 1b line. After the guard, umbrella, Obsidian router and doc edits the same test passed 3 of 3.

The routing replay of all 27 Obsidian scenarios shows an identical intents column before and after, no lost resource and rising counts only (OB-011 15 to 21, OB-015 19 to 25, OB-017 6 to 8, OB-019 12 to 15). A reach probe with one plain-words prompt per new route printed six `MISS` lines before and six `OK` lines after.

Hermes copy regeneration: deferred to the orchestrator. The build ran only `sync-skills-hermes.cjs --check`, which was `PASS: 70 Hermes skill copies in sync` before the edits and now prints `DRIFT sk-code-obsidian` and `DRIFT sk-code-opencode` with `FAIL: 2 drifted, 0 stale`, the two expected lines. T065 and T066 were both skipped because the compiled manifest and the leaf manifest were already fresh. Nothing is committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Allowlist the three workflow docs by exact path instead of matching a routed path by realpath | No router names the canonical path or the surface symlinks, so resolving a routed path to its real file finds nothing. Exact paths keep any other unrouted doc under `shared/` reported, and the stray-doc test case proves it. |
| Route the six Obsidian references under existing intents only | Each doc answers the questions of an intent that already exists, so no intent key was needed and the replay shows no intent change. |
| Keep OB-H06 keyword-blind | `screen reader` was not added as a keyword, so the probe still measures whether the file surfaces without the declared word. Its `expected_intent` now names `STACK_STANDARDS`, as OB-H01 to OB-H05 name theirs. |
| Put the test under `scripts/tests/` and run a copy of the guard against a throwaway hub | The style guide keeps tests under a `tests/` tree, and a throwaway hub lets the check pass and fail without touching the live tree. The folder is not a leaf root, so the leaf manifest did not move. |
| Word the allowlist comment around where the loading is instructed | The orchestrator replaced the plan's comment text: the hub `SKILL.md` tells the acting agent to read the doctrine from the active surface's symlinked copy, which is the reason no router names either path. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Goal 1: bare `verify_router_sync.cjs` run | PASS: five `PASS check` lines including `PASS check 1b: every routable reference or asset doc is routed`, `router-sync: 5/5 checks passed`, `exit=0` |
| Goal 2: `run-all-drift-guards.sh` | PASS: `exit=0`, `PASS check 1b`, `PASS: router-sync (verify_router_sync.cjs --checks 1a,1b,2,3,4)`, `Errors: 0`, `run-all-drift-guards: all 3 guards PASSED` |
| Goal 3: `node --test .../verify_router_sync.test.cjs` | PASS: `ℹ tests 3`, `ℹ pass 3`, `ℹ fail 0`, `exit=0`, and the stray `shared/references/stray.md` case passes. Against the unedited guard the same file printed `ℹ fail 3` |
| Goal 4: six routes and three allowlist entries | PASS: the grep counts print `6` then `3` |
| Goal 5: compiled routing, leaf manifest, rule copies | PASS: `sk-code` line ends in `fresh`, `checked=14 fresh=14 failed=0`, `OK: all rule invariants present`, `exit=0` |
| Goal 6: `validate.sh <this folder> --strict` | PASS: `Summary: Errors: 0  Warnings: 0` and `RESULT: PASSED` |
| Routing replay, 27 Obsidian scenarios | PASS: intents column identical, `NONE_LOST`, counts rise as predicted |
| Reach probe, six prompts | PASS: six `OK` lines with the intents `STACK_STANDARDS`, `STACK_STANDARDS`, `VERIFICATION`, `VERIFICATION`, `CODE_QUALITY`, `VERIFICATION` |
| Hub package and parent checks | PASS: `package_skill.py --check`, compiled routing readiness and `parent-skill-check.cjs` all PASS (exit 0), subject line names `.skilled/skills/sk-code` |
| Playbook validator | PASS: `violations=0 warnings=0`, unchanged from baseline |
| Document validator, nine edited or new files | PASS: `VALID` and `Total issues: 0` each. The playbook root stays `INVALID` with 2 issues, the same as baseline |
| Voice scan | PASS: both changelogs 0 hard blockers, no edited file count rose (OpenCode `SKILL.md` 26 to 25, holdout 11 to 3, ceiling 10 to 7, playbook root 83 to 82) |
| Stale-wording search over `.skilled/skills/sk-code` | PASS: prints nothing, `exit=1` |
| Alignment lint of the new test, git discovery blocked | PASS: `Scanned files: 1`, `Findings: 0`, `exit=0` |
| Hermes check | EXPECTED DRIFT: `DRIFT sk-code-obsidian` and `DRIFT sk-code-opencode`, nothing else. The orchestrator regenerates them |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The Hermes copies are not regenerated.** `.hermes/skills/sk-code-obsidian/SKILL.md` and `.hermes/skills/sk-code-opencode/SKILL.md` drift until the orchestrator runs `sync-skills-hermes.cjs` once.
2. **Three dead entries sit in `NON_ROUTED_ALLOWLIST`.** `ROUTER.md`, `references/stack-detection.md` and `references/phase-detection.md` never match a walked path, because the walk yields hub-relative paths such as `shared/references/stack-detection.md`. They were left alone as out of scope.
3. **A stale count remains in a playbook scenario.** `.skilled/skills/sk-code/sk-code-opencode/manual-testing-playbook/authoring-verification/verification-alignment.md` (line 28) still says "two drift guards" where the umbrella runs three.
4. **Section 4 of the Obsidian `SKILL.md` names three assets that do not exist.** `assets/renderer-implementation-checklist.md`, `assets/comment-grammar-checklist.md` and `assets/debug-checklist.md` are listed, and the assets folder holds seven other files. Left unchanged.
5. **Five of the six routed docs still have no row in section 2 of the Obsidian `SKILL.md`.** `accessibility.md`, `theme-variables.md`, `setup/setup.md`, `operations/operations.md` and `quality/doc-quality-gate.md` are reached through the section 2b map only. `skill-reference-integrity.md` already had a row, so the task text that said six was off by one.
6. **Operator decision, not made here.** Routing the three workflow docs through each surface `RESOURCE_MAP` and dropping their allowlist entries would let leg 1b see them, but it changes what three surfaces load.
7. **The full node test suite was not run.** `run-node-tests.mjs --list` finds the new file, and the file was run directly.
<!-- /ANCHOR:limitations -->

---
