---
title: "Implementation Summary"
description: "The hub vocabulary source check passes again with drift=0. Nine phrases were carried from two hub-router.json files to the root ROUTER.md of sk-doc and system-deep-loop, and the files derived from them were regenerated."
trigger_phrases:
  - "hub vocabulary drift implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/hub-routing-and-surfaces/008-hub-vocabulary-drift"
    last_updated_at: "2026-11-13T21:40:26Z"
    last_updated_by: "template-author"
    recent_action: "Initialize continuity block"
    next_safe_action: "Replace template defaults on first save"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-hub-vocabulary-drift"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 008-hub-vocabulary-drift |
| **Completed** | 2026-11-13 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The Routing Registry Drift Guard step "Hub vocabulary source" passes again on this branch: `ci-hub-vocabulary-source.cjs` prints `checked=7 hub(s), drift=0` where main prints `drift=9`. The branch is implemented and verified but not yet on main. It lands through the 008-command-surfacing-build session.

### Add the nine hub-router.json phrases to the sk-doc and system-deep-loop root ROUTER.md intents so the hub vocabulary source check passes

Commit 7af52ef940 put nine phrases into the `vocabularyClasses` of two `hub-router.json` files and left the hubs' root `ROUTER.md` behind. You now find all nine in the `INTENT_SIGNALS` block of the matching root `ROUTER.md`, six in sk-doc and three in system-deep-loop, so stage one and stage two of the router agree on the vocabulary again.

Two files were edited by hand. The other seven changed because a generator or `create.sh` wrote them. Each generator ran only after a guard named its file as stale.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/ROUTER.md` | Modified | Six keywords appended. `AGENT_CREATION` gets "agent definition" and "specialist persona file". `COMMAND_CREATION` gets "prompt shortcut" and "confirm flag". `DIFF` gets "before and after my rewrite". `GOAL_AUTHORING` gets "intent file" |
| `.skilled/skills/system-deep-loop/ROUTER.md` | Modified | Three keywords appended. `RESEARCH` gets "find out everything". `REVIEW` gets "findings stop changing". `AI_COUNCIL` gets "several models" |
| `.skilled/skills/sk-doc/graph-metadata.json` | Modified | Written by `generate-router-intent-signals.cjs --write`. Without it the step "Router intent-signal carry" failed with `missing=9` |
| `.skilled/skills/system-deep-loop/graph-metadata.json` | Modified | Written by the same `--write` run |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json` | Modified | Refreshed because `compiled-route-guard.cjs` reported system-deep-loop stale-manifest |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json` | Modified | Copy of the manifest above, written by the same refresh |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Recompiled because `skill-graph-freshness.cjs --strict` reported SIGNAL DRIFT for sk-doc and system-deep-loop |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Recaptured. One entry changed, `harder:4c8fe4462488`: native top moved from sk-doc to system-deep-loop, which holds the deep-review gold |
| `specs/sk-doc/hub-routing-and-surfaces/graph-metadata.json` | Modified | `create.sh` added this packet to `children_ids` |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered
<!-- FILL: Name the commands that proved it and the order they ran. GOOD: Ran `--keep 3` and a plain run, then the suite. All three passed. WEAK: Tested and shipped. -->

All commands ran on worktree branch `worktrees/372-hub-vocabulary-drift`. The failing output on main was captured first in `scratch/measured-before.txt`, and the advisor suites were run for a baseline. Then the two `ROUTER.md` files were edited and the generators ran in this order:

1. `generate-router-intent-signals.cjs --write`
2. `node .skilled/bin/compiled-route-manifest.cjs refresh --hub system-deep-loop --skill-root .skilled/skills/system-deep-loop`
3. `skill_graph_compiler.py --export-json`
4. `capture-local-native-divergence-ledger.mjs --write`

The checks in the Verification table ran after the last generator. The branch is committed here and handed to the 008-command-surfacing-build session. It does not go to main by itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Edit the shared sk-doc `ROUTER.md` on this branch, but only other lines than the 008 session edits | Operator decision of 2026-11-13, "Edit here, other lines". The 008 session edits the frontmatter version line and the `SKILL_CREATION` line on its unpushed branch, so staying off those two lines keeps the merge free of conflicts |
| Commit here and land through the 008 session | Operator decision of 2026-11-13, "Commit here, land via 008". The 008 session merges this branch and recaptures `scorer-eval-baseline.json` once, instead of two branches each recapturing it |
| Leave `scorer-eval-baseline.json`, `routing-baseline.json`, the three corpus files, both `hub-router.json` files and `mode-registry.json` untouched | The session that owns packet `system-skill-advisor/routing-and-scoring/008-command-surfacing-build` edits them on its unpushed branch |
| Fix the root `ROUTER.md` and no mode packet's `ROUTER.md` | The check reads only the `INTENT_SIGNALS` block of each hub's root `ROUTER.md` |
| Refresh only the system-deep-loop manifest | `compiled-route-guard.cjs` reported only system-deep-loop as stale. sk-doc stayed fresh |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification
<!-- FILL: Write one check per row with the exact output. GOOD: `ls logs/archive | wc -l` after `--keep 3`: 3. After a plain run: 10. Suite: PASSED. WEAK: All tests pass. -->

| Check | Result |
|-------|--------|
| `ci-hub-vocabulary-source.cjs` | PASS. `checked=7 hub(s), drift=0`, `RESULT: PASSED`, exit 0 |
| `generate-router-intent-signals.cjs --check` | PASS. `checked=7 hub(s), missing=0, orphans=0`, `RESULT: PASSED`, exit 0 |
| `compiled-route-guard.cjs` | PASS. All hubs fresh, exit 0 |
| `compiled-route-admission.cjs --hub system-deep-loop` | PASS. 16 pass, exit 0 |
| `skill-graph-freshness.cjs --strict` | PASS. SIGNAL DRIFT none, exit 0 |
| `skill_graph_compiler.py --validate-only` | PASS. `VALIDATION PASSED`, exit 0 |
| `parent-skill-check.cjs` on all seven hubs | PASS. OK, exit 0 |
| `validate_skill_package.py` on sk-doc and system-deep-loop | PASS. PASS, exit 0 |
| `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs` | PASS. 14 of 14, exit 0 |
| Advisor suites `routing-registry-drift-guard`, `routing-parity-deep-skills`, `routing-parity-deep-council`, `routing-golden-prompts` and `tests/parity/` | Before the change 12 files and 123 tests passed. After it 122 of 123 pass |
| `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | FAIL by design. `holdout_top1.correct: live=51 baseline=50. improvement detected` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The scorer baseline ratchet is red on this branch.** `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` fails with `holdout_top1.correct: live=51 baseline=50. improvement detected`. One more holdout prompt now routes correctly. The baseline recapture belongs to the 008 session, so the test stays red here until that session merges this branch and recaptures `scorer-eval-baseline.json`.
2. **Main still fails the check.** This branch does not go to main by itself. Until the 008 session lands it, `ci-hub-vocabulary-source.cjs` on main keeps printing `drift=9`.
<!-- /ANCHOR:limitations -->

---
