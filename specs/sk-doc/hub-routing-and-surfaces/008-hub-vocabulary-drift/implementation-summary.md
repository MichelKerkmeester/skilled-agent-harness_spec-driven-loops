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
    last_updated_by: "claude-opus-5-5"
    recent_action: "Landed the fix on main with the review P1 phrases swapped"
    next_safe_action: "None; the packet is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-008-hub-vocabulary-drift"
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
| **Spec Folder** | 008-hub-vocabulary-drift |
| **Completed** | 2026-11-14 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built
<!-- FILL: Open with the user-visible change in two sentences, then list each changed file. GOOD: `--keep 3` leaves three archives in `logs/archive`. A plain run leaves all ten. WEAK: Implemented the feature. -->

The Routing Registry Drift Guard step "Hub vocabulary source" passes again on this branch: `ci-hub-vocabulary-source.cjs` prints `checked=7 hub(s), drift=0` where main prints `drift=9`. It landed on main on 2026-11-14 from worktree branch `worktrees/387-hub-vocabulary-drift-landing`, with the two phrases the review flagged replaced by narrower ones.

### Add the nine hub-router.json phrases to the sk-doc and system-deep-loop root ROUTER.md intents so the hub vocabulary source check passes

Commit 7af52ef940 put nine phrases into the `vocabularyClasses` of two `hub-router.json` files and left the hubs' root `ROUTER.md` behind. You now find all nine in the `INTENT_SIGNALS` block of the matching root `ROUTER.md`, six in sk-doc and three in system-deep-loop, so stage one and stage two of the router agree on the vocabulary again.

Two files were edited by hand. The other eleven changed because a generator or `create.sh` wrote them. Each of the four generators listed under How It Was Delivered ran only after a guard named its file as stale. The work is commit bc86b64c79 on branch `worktrees/372-hub-vocabulary-drift`. During that commit the pre-commit gate `doc-version-bump` raised the frontmatter version line of both `ROUTER.md` files by itself.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/sk-doc/ROUTER.md` | Modified | Six keywords appended. `AGENT_CREATION` gets "new agent definition" and "specialist persona file" ("agent definition" until the 2026-11-14 landing). `COMMAND_CREATION` gets "prompt shortcut" and "reusable prompt shortcut" ("confirm flag" until the 2026-11-14 landing). `DIFF` gets "before and after my rewrite". `GOAL_AUTHORING` gets "intent file". The gate `doc-version-bump` raised the frontmatter version line from 2.4.6.0 to 2.4.7.0 |
| `.skilled/skills/system-deep-loop/ROUTER.md` | Modified | Three keywords appended. `RESEARCH` gets "find out everything". `REVIEW` gets "findings stop changing". `AI_COUNCIL` gets "several models". The gate `doc-version-bump` raised the frontmatter version line from 1.6.8.0 to 1.6.9.0 |
| `.skilled/skills/sk-doc/graph-metadata.json` | Modified | Written by `generate-router-intent-signals.cjs --write`. Without it the step "Router intent-signal carry" failed with `missing=9` |
| `.skilled/skills/system-deep-loop/graph-metadata.json` | Modified | Written by the same `--write` run |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/system-deep-loop/manifest.json` | Modified | Refreshed because `compiled-route-guard.cjs` reported system-deep-loop stale-manifest |
| `specs/sk-doc/z_archive/019-skill-routing-refactor/015-router-unification-program/013-live-activation/activation/system-deep-loop/manifest.json` | Modified | Copy of the manifest above, copied by hand as `compiled-route-guard.cjs` instructs. The refresh writes only the runtime manifest |
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Modified | Recompiled because `skill-graph-freshness.cjs --strict` reported SIGNAL DRIFT for sk-doc and system-deep-loop |
| `.skilled/skills/system-skill-advisor/runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modified | Recaptured. One entry changed, `harder:4c8fe4462488`: native top moved from sk-doc to system-deep-loop, which holds the deep-review gold |
| `specs/sk-doc/hub-routing-and-surfaces/graph-metadata.json` | Modified | `create.sh` added this packet to `children_ids` |
| `.skilled/skills/system-spec-kit/runtime/data/trigger-index.json` | Modified | Rebuilt trigger index, written by `generate-trigger-index.mjs`. `generate-trigger-index.mjs --check` exits 0 |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/corpus-manifest.json` | Modified | Written by the same `generate-trigger-index.mjs` run |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/generation-diagnostics.json` | Modified | Written by the same `generate-trigger-index.mjs` run |
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/fixtures/phrase-variants.json` | Modified | Written by the same `generate-trigger-index.mjs` run |
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

The checks in the Verification table ran after the last generator. The branch is committed here as bc86b64c79 and handed to the 008-command-surfacing-build session. That commit also carries the rebuilt trigger index, and `generate-trigger-index.mjs --check` exits 0. It does not go to main by itself.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions
<!-- FILL: Write one decision per row. Give the reason, not the label. GOOD: Option over environment variable: one run can pick a different count without editing config. WEAK: Used the best approach. -->

| Decision | Why |
|----------|-----|
| Edit the shared sk-doc `ROUTER.md` on this branch, but only other lines than the 008 session edits | Operator decision of 2026-11-13, "Edit here, other lines". The 008 session edits the `SKILL_CREATION` line on its unpushed branch, so this branch stays off that line. The frontmatter version line was not left alone: the gate `doc-version-bump` raised it to 2.4.7.0 in commit bc86b64c79. The command surfacing branch raises the sk-doc line to the same 2.4.7.0, so both branches make an identical change to that line |
| Commit here and land through the 008 session | Operator decision of 2026-11-13, "Commit here, land via 008". The 008 session merges this branch and recaptures `scorer-eval-baseline.json` once, instead of two branches each recapturing it |
| Leave `scorer-eval-baseline.json`, `routing-baseline.json`, the three corpus files, both `hub-router.json` files and `mode-registry.json` untouched | The session that owns packet `system-skill-advisor/routing-and-scoring/008-command-surfacing-build` edits them on its unpushed branch |
| Fix the root `ROUTER.md` and no mode packet's `ROUTER.md` | The check never opens a mode packet's `ROUTER.md`. It reads the root `ROUTER.md` intents and `RESOURCE_MAP`, `hub-router.json`, `mode-registry.json` and each packet's `Keyword triggers:` line |
| Land from main, not through the 008 session | Operator decision of 2026-11-14, "Land 372 + fix P1". It supersedes "Commit here, land via 008" |
| Replace "agent definition" with "new agent definition" and "confirm flag" with "reusable prompt shortcut" | A phrase in `ROUTER.md` becomes an advisor signal, words included. "confirm flag" sent "add a --confirm flag to the deploy script" from sk-code to sk-doc and took the `/doctor:agents-md` tune row. Dropping both phrases cost the two tune rows their attached command. "auto or confirm flag" still leaked the word confirm. The two chosen phrases keep every probe and every command-routing metric equal to main |
| Keep the three system-deep-loop phrases | Their single words add system-deep-loop as a passing second candidate on some unrelated prompts, but no probe and no corpus row changes its top-1 |
| Refresh only the system-deep-loop manifest | `compiled-route-guard.cjs` reported only system-deep-loop as stale. sk-doc stayed fresh |
| Merge worktrees 386, 387 and 388 into one branch, recheck it, then push once | Operator decision of 2026-11-14, "Integrate, recheck, push". One push carried all three, and the checks ran on the merged state, so no worktree reached main unchecked against the others. It landed as a fast-forward to `d3f08a81ac` |
| Remove the three worktrees and their branches after the push | Operator decision of 2026-11-14, "Remove after push". The branches were fully merged into origin/main, so removing them lost no commit |
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
| `tests/parity/scorer-eval-baseline-ratchet.vitest.ts` | Failed on branch 372 with `live=51 baseline=50`. Passes after the 2026-11-14 recapture |
| Every run step of `routing-registry-drift.yml`, run locally with its working directory | Landing: 15 of 15 exit 0, including the corpus gate at advisor accuracy 0.5795, TT 110, FT 3, FF 1 |
| Review probe prompts, 18 of them, and `capture-command-routing-baseline.mjs` against main | Landing: no top-1 and no metric differs from main |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations
<!-- FILL: Name one real limit and the workaround. GOOD: `--keep` deletes the older archives for good. Copy `logs/archive/` aside first when a run may cut too deep. WEAK: No limitations. -->

1. **The holdout gain is a word accident.** The prompt `harder:4c8fe4462488` reaches its deep-review gold through the single words stop and several, not through a phrase. The recaptured baseline records 51, so a later change to those words can move it back to 50.
2. **The corpus gate was red on main for a second reason.** All three corpus hashes had moved since the 2026-10-11 pin, so the landing also recaptures `routing-baseline.json` against main's corpus. The 008 branch holds its own recapture against its own corpus, which retires one holdout row, and its next merge from main will conflict there.
3. **The 008 branch will meet these commits.** Its unpushed branch also carries 6d96d8f1d2 and edits `scorer-eval-baseline.json`, so its next merge from main may conflict there and in the generated files.
<!-- /ANCHOR:limitations -->

---
